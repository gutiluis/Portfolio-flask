# file: models.py

"""SQLAlchemy ORM models"""
import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Text, String, Date
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///projects.db'
db = SQLAlchemy(app)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_owner = db.Column(db.Boolean, default=False, nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Project(db.Model):
    """SQLAlchemy model"""
    __tablename__ = 'projects'
    # primary_key is implicitly nullable=False
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    created: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    technologies: Mapped[str] = mapped_column(Text, nullable=False)
    github_repo: Mapped[str] = mapped_column(Text, unique=True, nullable=False)

    def __repr__(self):
        return f'''<Project (Title: {self.title}
                Description: {self.description}
                technologies: {self.technologies}
                Github: {self.github_repo})'''
