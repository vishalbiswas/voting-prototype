from flask import Blueprint, request, jsonify
from sqlalchemy import between, exc, func
from sqlalchemy.event import listens_for

from voter.utils import send_error

from ..services.database import get_db
from ..services.socket import socketio
from ..models import Candidate, Vote, Gender

bp = Blueprint('candidate', __name__, url_prefix='/candidate')
db = get_db()


@bp.get('/votes')
def get_votes():
    return jsonify(Candidate.get_all_votes())


@bp.get('/')
def get_candidates():
    return jsonify([c.json() for c in db.session.execute(db.select(Candidate)).scalars()])


@bp.post('/<int:candidate_id>/vote')
def cast_vote(candidate_id: int):
    """Adds a new vote entry for the specified candidate."""
    if 'voter_id' not in request.json or request.json['voter_id'] is None:
        return send_error('Voter ID missing', 400)
    
    voter_id = str(request.json['voter_id'])
    if len(voter_id) > 10 or len(voter_id) == 0:
        return send_error('Invalid Voter ID', 400)

    candidate = db.get_or_404(Candidate, candidate_id)
    vote = Vote(voter_id=request.json['voter_id'], candidate_id=candidate.id)

    if 'gender' in request.json and request.json['gender']:
        if request.json['gender'] not in Gender:
            return send_error('Invalid gender', 400)
        vote.gender = Gender[request.json['gender']]

    if 'age' in request.json:
        try:
            age = int(request.json['age'])
            if age < 18 or age > 150:
                return send_error('Invalid Age', 400)
            vote.age = age
        except:
            return send_error('Invalid Age', 400)

    db.session.add(vote)
    try:
        db.session.commit()
    except exc.IntegrityError:
        return send_error('Voter ID has already registered', 400)

    return jsonify({
        'candidate_id': candidate.id,
        'votes': candidate.get_votes(),
    })


@bp.get('/<int:candidate_id>/breakdown')
def get_breakdown(candidate_id: int):
    """Gives demographic breakdown of all votes for the specific candidate."""
    
    candidate = db.get_or_404(Candidate, candidate_id)
    
    
    gender = db.session.execute(
        db.select(Vote.gender, func.count())
        .where(Vote.candidate_id == candidate.id)
        .group_by(Vote.gender)
    )
    gender_breakdown = {}
    for g in gender:
        k = 'unknown' if g[0] is None else g[0].value
        gender_breakdown[k] = g[1]


    age_groups = [(None, 25), (26, 35), (36, 45),
                  (46, 55), (56, 65), (66, 75), (76, None)]
    age_breakdown = {}
    for range in age_groups:
        if range[0] is None or range[0] == 0:
            k = str(range[1]) + ' and less'
            where_clause = Vote.age <= range[1]
        elif range[1] is None:
            k = str(range[0]) + ' and more'
            where_clause = Vote.age >= range[0]
        else:
            k = str(range[0]) + ' - ' + str(range[1])
            where_clause = between(
                expr=Vote.age, lower_bound=range[0], upper_bound=range[1])

        v = db.session.execute(
            db.select(func.count())
            .where((Vote.candidate_id == candidate.id) & (where_clause))
        ).scalar()
        if v > 0:
            age_breakdown[k] = v

    age_unknown = db.session.execute(
        db.select(func.count())
        .where((Vote.candidate_id == candidate.id) & (Vote.age == None))
    ).scalar()
    if age_unknown > 0:
        age_breakdown['unknown'] = age_unknown


    return jsonify({
        **candidate.json(),
        'count': candidate.get_votes(),
        'genderBreakdown': gender_breakdown,
        'ageBreakdown': age_breakdown,
    })


def update_vote(counts):
    """Broadcasts update_votes event to all listeners."""
    socketio.emit('update_votes', counts, namespace='/')


@listens_for(Vote, 'after_insert')
def vote_inserted(mapper, connection, target):
    # do not cause vote insertion to rollback
    # TODO: move this to asynchronus process
    try:
        update_vote(Candidate.get_all_votes())
    except Exception as e:
        print(e)
