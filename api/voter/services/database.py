import click
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)


def get_db():
    return db


def init_db():
    db = get_db()
    db.create_all()


def seed_db():
    db = get_db()
    from ..models import Candidate
    db.session.add_all([
        Candidate(name='Lalita Saini',
                  symbol='https://raw.githubusercontent.com/atisawd/boxicons/master/svg/solid/bxs-pear.svg', party='Pear Everywhere'),
        Candidate(name='Subhash Saran',
                  symbol='https://raw.githubusercontent.com/atisawd/boxicons/master/svg/solid/bxs-shield-plus.svg', party='Guarded Palace'),
        Candidate(name='Ajit Pradhan',
                  symbol='https://raw.githubusercontent.com/atisawd/boxicons/master/svg/solid/bxs-brightness.svg', party='Sailing Spirit'),
    ])
    db.session.commit()


@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


@click.command('seed-db')
def seed_db_command():
    """Seed the database with Candidates"""
    seed_db()
    click.echo('Candidates created.')


def init_app(app):
    db = get_db()
    db.init_app(app)
    with app.app_context():
        import voter.models
        db.create_all()
        app.cli.add_command(init_db_command)
