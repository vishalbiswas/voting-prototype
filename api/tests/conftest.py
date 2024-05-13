import os
import tempfile

import pytest
from voter import create_app
from voter.services.database import init_db, seed_db, get_db


@pytest.fixture
def app():
    db_fd, db_path = tempfile.mkstemp()

    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///' + db_path
    })

    with app.app_context():
        init_db()
        seed_db()

    yield app

    with app.app_context():
        db = get_db()
        db.session.remove()
        db.drop_all()
        db.engine.dispose()

    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()
