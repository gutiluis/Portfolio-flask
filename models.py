#!/usr/bin/env python3

# file: models.py
# descr: main model class mapper

"""Database models in sqlalchemy for the flask app."""
import datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Text, String, Date


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///projects.db'
db = SQLAlchemy(app)


class Project(db.Model):
    """SQLAlchemy model"""
    __tablename__ = 'projects'
    # primary_key is implicitly nullable=False
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    created: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    skills: Mapped[str] = mapped_column(Text, nullable=False)
    github_repo: Mapped[str] = mapped_column(Text, unique=True, nullable=False)

    def __repr__(self):
        return f'''<Project (Title: {self.title}
                Description: {self.description}
                Skills: {self.skills}
                Github: {self.github_repo})'''
