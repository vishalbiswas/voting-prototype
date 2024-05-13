import os

from flask import Flask
from flask_cors import CORS

from .views import candidate
from .services import database, socket


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    # TODO: manage configuration from environment variables and .env
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI='sqlite:///' +
        os.path.join(app.instance_path, 'voter.db'),
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    CORS(app)

    database.init_app(app)

    app.register_blueprint(candidate.bp)
    socket.socketio.init_app(app)

    return app
