import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Configuración para la base de datos (ejemplo con SQLite)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'

