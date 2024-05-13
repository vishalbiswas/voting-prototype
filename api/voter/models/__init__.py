
import enum
from typing import Optional

from sqlalchemy import String, ForeignKey, Enum, Integer, func
from sqlalchemy.orm import Mapped, mapped_column


from ..services.database import get_db

db = get_db()


class Gender(enum.Enum):
    male = 'male'
    female = 'female'
    others = 'others'


class Candidate(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    symbol: Mapped[str] = mapped_column(String(255), nullable=False)
    party: Mapped[str] = mapped_column(String(255), nullable=False)

    def get_votes(self):
        return db.session.execute(db.select(func.count(Vote.id)).where(Vote.candidate_id == self.id)).scalar()

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'party': self.party,
            'symbol': self.symbol,
        }

    @staticmethod
    def get_all_votes():
        result = db.session.execute(
            db.select(
                Candidate,
                func.count(Vote.candidate_id).label('count')
            ).group_by(Vote.candidate_id).join_from(Candidate, Vote, isouter=True)
        ).all()
        mapped = []
        for (c, count) in result:
            mapped.append({
                **c.json(),
                'count': count,
            })
        return mapped


class Vote(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    voter_id: Mapped[str] = mapped_column(
        String(10), unique=True, nullable=False)
    gender: Mapped[Optional[Gender]] = mapped_column(Enum(Gender))
    age: Mapped[Optional[int]] = mapped_column(Integer())

    candidate_id: Mapped[int] = mapped_column(
        ForeignKey('candidate.id'), nullable=False)
