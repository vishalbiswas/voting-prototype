import pytest
from flask import json


def vote(client, candidate_id):
    data = {
        'voter_id': '123456718',
        'gender': 'male',
        'age': 30
    }
    return client.post(f'/candidate/{candidate_id}/vote', json=data)


def test_get_candidates(client):
    response = client.get('/candidate/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 3


def test_cast_vote(client):
    candidate_id = 1
    response = vote(client, candidate_id)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['candidate_id'] == candidate_id
    assert data['votes'] == 1


def test_get_demographic_breakdown(client):
    candidate_id = 2
    vote(client, candidate_id)
    response = client.get(f'/candidate/{candidate_id}/breakdown')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['count'] == 1
    assert data['genderBreakdown']['male'] == 1
    assert len(data['genderBreakdown']) == 1
    assert 'unknown' not in data['genderBreakdown']
    assert len(data['ageBreakdown']) == 1
