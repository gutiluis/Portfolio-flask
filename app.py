#!/usr/bin/env python3
# file: app.py
"""Flask with relational db creation for the portfolio site."""

from dotenv import load_dotenv
from datetime import datetime
from flask import render_template, url_for, request, redirect, abort, flash, jsonify
from flask_login import (
    login_required,
    current_user,
    login_user,
    logout_user,
    LoginManager,
)
from flask_mail import Message
from flask_wtf.csrf import CSRFProtect
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from functools import wraps
from flask_migrate import Migrate
from models import db, Project, app, User, mail, Score
from sqlalchemy import or_
import os
import re

load_dotenv()


migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

csrf = CSRFProtect(app)
limiter = Limiter(
    get_remote_address,
    app=app,
    storage_uri="redis://localhost:6379/0",
)


def generate_reset_token(user):
    serializer = URLSafeTimeSerializer(app.config["SECRET_KEY"])
    return serializer.dumps(user.id, salt="password-reset")


def verify_reset_token(token):
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])

    try:
        user_id = serializer.loads(token, salt="password-reset", max_age=1800)
    except (SignatureExpired, BadSignature):
        return None

    return db.session.get(User, user_id)


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


def owner_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if not current_user.is_owner:
            abort(403)
        return view(*args, **kwargs)

    return wrapped_view


def backup_function(func):
    @wraps(func)
    def wrapped_backup(*args, **kwargs):
        import shutil

        shutil.copy2("instance/projects.db", "instance/backup.db")
        return func(*args, **kwargs)

    return wrapped_backup


@app.route("/login", methods=["GET", "POST"])
@limiter.limit("5 per minute", methods=["POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("index"))

    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        user = User.query.filter(
            or_(User.username == username, User.email == username)
        ).first()

        if user and user.is_owner and user.check_password(password):
            login_user(user)
            return redirect(url_for("index"))

        return render_template(
            "login.html",
            error="Invalid username or password.",
        ), 401

    return render_template("login.html")


@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))


@app.route("/forgot-password", methods=["GET", "POST"])
@limiter.limit("5 per hour", methods=["POST"])
def forgot_password():
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()

        user = User.query.filter_by(email=email, is_owner=True).first()

        if user:
            token = generate_reset_token(user)

            reset_url = url_for("reset_password", token=token, _external=True)

            message = Message(
                subject="Password Reset - technobool", recipients=[user.email]
            )

            message.body = (
                f"To reset your password, visit:\n\n"
                f"{reset_url}\n\n"
                "This link expires in 30 minutes."
            )

            mail.send(message)

        return render_template(
            "forgot_password.html",
            message="If the account exists, a password reset link has been sent.",
        )

    return render_template("forgot_password.html")


@app.route("/reset-password/<token>", methods=["GET", "POST"])
@limiter.limit("5 per hour", methods=["POST"])
def reset_password(token):
    user = verify_reset_token(token)

    if not user or not user.is_owner:
        return render_template(
            "reset_password.html",
            error="This password reset link is invalid or expired.",
        )

    if request.method == "POST":
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")

        if not password:
            return render_template(
                "reset_password.html", error="Password cannot be empty."
            )

        if password != confirm_password:
            return render_template(
                "reset_password.html", error="Passwords do not match."
            )

        user.set_password(password)
        db.session.commit()

        return redirect(url_for("login"))

    return render_template("reset_password.html")


@app.route("/")
def index():
    """Render home page."""
    projects = Project.query.all()
    return render_template("index.html", projects=projects)


@app.route("/projects/new", methods=["POST"])
@login_required
@owner_required
@backup_function
def add_project():
    """create a new project in the sqlite3 db"""
    if request.method == "POST":
        year_and_month = request.form.get("date")
        # model takes datetimeobject in column
        convert_string = datetime.strptime(year_and_month, "%Y-%m").date()

        new_project = Project(
            # get is a method needs parentheses
            title=request.form.get("title"),
            created=convert_string,
            description=request.form.get("desc"),
            technologies=request.form.get("technologies"),
            category=request.form.get("category"),
            summary=request.form.get("summary"),
            github_repo=request.form.get("github"),
        )

        db.session.add(new_project)
        db.session.commit()
        return redirect(url_for("index"))


@app.route("/projects/new", methods=["GET"])
@login_required
@owner_required
def new_project():
    return render_template("projectform.html")


@app.route("/projects/<int:project_id>", methods=["GET"])
def project_detail(project_id):
    """Render detail per project id."""
    project = Project.query.get_or_404(project_id)
    projects = Project.query.all()
    return render_template("detail.html", project=project, projects=projects)


@app.route("/projects/<int:project_id>/edit", methods=["POST"])
@login_required
@owner_required
@backup_function
def project_edit(project_id):
    """Render edition page with same conventions from add project."""
    project = Project.query.get_or_404(project_id)
    year_and_month = request.form.get("date")
    convert_string = datetime.strptime(year_and_month, "%Y-%m").date()

    project.title = request.form.get("title")
    project.created = convert_string
    project.description = request.form.get("desc")
    project.technologies = request.form.get("technologies")
    project.category = request.form.get("category")
    project.summary = request.form.get("summary")
    project.github_repo = request.form.get("github")
    db.session.commit()
    return redirect(url_for("index"))


@app.route("/projects/<int:project_id>/edit", methods=["GET"])
@login_required
@owner_required
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    projects = Project.query.all()
    return render_template("editform.html", project=project, projects=projects)


@app.route("/projects/<int:project_id>/delete", methods=["POST"])
@login_required
@owner_required
@backup_function
def project_delete(project_id):
    """Delete project from db and redirect to home."""
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return redirect(url_for("index"))


@app.route("/about")
def about():
    """About route"""
    projects = Project.query.all()
    return render_template("about.html", projects=projects)


@app.route("/technologies")
def technologies():
    """Tech-Stack route"""
    projects = Project.query.all()
    return render_template("technologies.html", projects=projects)


@app.route("/contact", methods=["GET", "POST"])
@limiter.limit("5 per minute", methods=["POST"])
def contact():
    """Send email"""
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        sender_email = request.form.get("email", "").strip()
        subject = request.form.get("subject", "").strip()
        country = request.form.get("country", "").strip()
        phone = request.form.get("phone", "").strip()
        message = request.form.get("message", "").strip()

        if not all([name, sender_email, subject, country, message]):
            flash("All fields are required.", "error")
            return redirect(url_for("contact"))

        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", sender_email):
            flash("Please enter a valid email address.", "error")
            return redirect(url_for("contact"))

        if (
            len(name) > 100
            or len(sender_email) > 254
            or len(subject) > 150
            or len(country) > 50
            or len(phone) > 30
            or len(message) > 5000
        ):
            flash("One or more fields exceed the allowed length.", "error")
            return redirect(url_for("contact"))

        if "\r" in subject or "\n" in subject:
            flash("Invalid subject.", "error")
            return redirect(url_for("contact"))

        if phone and not re.fullmatch(r"(?=.*\d)[+\d().\-\s]{1,30}", phone):
            flash("Please enter a valid telephone number.", "error")
            return redirect(url_for("contact"))

        contact_email = app.config.get("CONTACT_EMAIL")
        if not contact_email:
            flash("Contact email is not configured.", "error")
            return redirect(url_for("contact"))

        email_message = Message(
            subject=f"Portfolio contact: {subject}",
            recipients=[contact_email],
            reply_to=sender_email,
            body=(
                f"Name: {name}\n"
                f"Email: {sender_email}\n"
                f"Country: {country}\n"
                f"Telephone: {phone or 'Not provided'}\n\n"
                f"Message:\n{message}",
            ),
        )

        try:
            mail.send(email_message)
            flash("Your message has been sent successfully!", "success")
        except Exception:
            app.logger.exception("Failed to send contact email.")
            flash("Unable to send your message. Please try again later.", "error")

        return redirect(url_for("contact"))
    projects = Project.query.all()
    return render_template("contact.html", projects=projects)


@app.route("/privacy_policy")
def privacy_policy():
    """copyrights policy"""
    projects = Project.query.all()
    return render_template("privacy_policy.html", projects=projects)


@app.route("/terms_of_use")
def terms_of_use():
    """terms and conditions"""
    projects = Project.query.all()
    return render_template("terms_of_use.html", projects=projects)


@app.errorhandler(404)
def not_found(error):
    """Render custom page not found error."""
    return render_template("404.html", msg=error), 404


@app.errorhandler(429)
def ratelimit_handler(error):
    return render_template(
        "429.html", error="Too many requests. Please try again later."
    ), 429
