#!/usr/bin/env python3
# file: app.py
"""Flask with relational db creation for the portfolio site. The app is importing a model."""
from datetime import datetime
from flask import render_template, url_for, request, redirect, abort
from flask_login import login_required, current_user, login_user, logout_user, LoginManager
from functools import wraps
from flask_migrate import Migrate
from models import db, Project, app, User
import os

app.config['SECRET_KEY'] = os.environ['SECRET_KEY']


migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

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


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')

        user = User.query.filter_by(username=username).first()

        if user and user.is_owner and user.check_password(password):
            login_user(user)
            return redirect(url_for('index'))

        return render_template(
            'login.html',
            error='Invalid username or password.',
        ), 401

    return render_template('login.html')


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/')
def index():
    """Render home page."""
    projects = Project.query.all()
    return render_template('index.html', projects=projects)


@app.route('/projects/new', methods=["GET", "POST"])
@login_required
@owner_required
def add_project():
    """Render new project form html."""
    if request.method == "POST":

        year_and_month = request.form.get('date')
        # model takes datetimeobject in column
        convert_string = datetime.strptime(year_and_month, "%Y-%m").date()

        new_project = Project(
            # get is a method needs parentheses
            title=request.form.get('title'),
            created=convert_string,
            description=request.form.get('desc'),
            technologies=request.form.get('technologies'),
            github_repo=request.form.get('github'))

        db.session.add(new_project)
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('projectform.html')


@app.route('/projects/<int:project_id>')
def project_detail(project_id):
    """Render detail per project id."""
    project = Project.query.get_or_404(project_id)
    return render_template('detail.html', project=project)


@app.route('/projects/<int:project_id>/edit', methods=["GET", "POST"])
@login_required
@owner_required
def project_edit(project_id):
    """Render edition page with same conventions from add project."""
    project = Project.query.get_or_404(project_id)
    if request.method == 'POST':

        year_and_month = request.form.get('date')
        convert_string = datetime.strptime(year_and_month, "%Y-%m").date()

        project.title = request.form.get('title')
        project.created = convert_string
        project.description = request.form.get('desc')
        project.technologies = request.form.get('technologies')
        project.github_repo = request.form.get('github')
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('editform.html', project=project)


@app.route('/projects/<int:project_id>/delete', methods=['POST'])
@login_required
@owner_required
def project_delete(project_id):
    """Delete project from db and redirect to home."""
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/about')
def about():
    """Render about page."""
    projects = Project.query.all()
    return render_template('about.html', projects=projects)


@app.errorhandler(404)
def not_found(error):
    """Render custom page not found error."""
    return render_template('404.html', msg=error), 404


