# Voting Prototype API

A taluka voting application with a real-time dashboard and demographic breakdown of votes.

## Requirements

1. Python 3.10+
2. WebSocket API support in client
3. WSGI server like Gunicorn for production deployment

## Setup

1. Create and activate a virtual environment. [See documentation.](https://docs.python.org/3/library/venv.html#creating-virtual-environments)
2. Install from requirements.txt
   `pip install -r requirements.txt`
3. Run using `python main.py`

It will give you the URL where the Flask API is available.

## Endpoints

#### 1. Retrieve Votes for All Candidates

- **URL:** `/candidate/votes`
- **Method:** `GET`
- **Description:** Retrieves all votes for candidates.
- **Response:** JSON array containing vote information for each candidate.
- **Sample:**

```json
[
  {
    "count": 12,
    "id": 1,
    "name": "Lalita Saini",
    "party": "Pear Everywhere",
    "symbol": "https://raw.githubusercontent.com/atisawd/boxicons/master/svg/solid/bxs-pear.svg"
  },
  {
    "count": 15,
    "id": 2,
    "name": "Subhash Saran",
    "party": "Guarded Palace",
    "symbol": "https://raw.githubusercontent.com/atisawd/boxicons/master/svg/solid/bxs-shield-plus.svg"
  },
  {
    "count": 2,
    "id": 3,
    "name": "Ajit Pradhan",
    "party": "Sailing Spirit",
    "symbol": "https://raw.githubusercontent.com/atisawd/boxicons/master/svg/solid/bxs-brightness.svg"
  }
]
```

#### 2. Retrieve All Candidates

- **URL:** `/candidate`
- **Method:** `GET`
- **Description:** Retrieves information for all candidates.
- **Response:** JSON array containing details of each candidate.
- **Sample:**

```json
[
  {
    "id": 1,
    "name": "Lalita Saini",
    "party": "Pear Everywhere",
    "symbol": "https://raw.githubusercontent.com/atisawd/boxicons/master/svg/solid/bxs-pear.svg"
  },
  {
    "id": 2,
    "name": "Subhash Saran",
    "party": "Guarded Palace",
    "symbol": "https://raw.githubusercontent.com/atisawd/boxicons/master/svg/solid/bxs-shield-plus.svg"
  },
  {
    "id": 3,
    "name": "Ajit Pradhan",
    "party": "Sailing Spirit",
    "symbol": "https://raw.githubusercontent.com/atisawd/boxicons/master/svg/solid/bxs-brightness.svg"
  }
]
```

#### 3. Cast Vote for Candidate

- **URL:** `/candidate/<candidate_id>/vote`
- **Method:** `POST`
- **Description:** Casts a vote for the specified candidate.
- **Parameters:**
  - `candidate_id`: Integer, ID of the candidate for whom the vote is cast.
  - `voter_id`: String, ID of the voter casting the vote (mandatory).
  - `gender`: String, optional. Gender of the voter.
  - `age`: Integer, optional. Age of the voter.
- **Response:** JSON object containing the candidate ID and updated vote count for the candidate.
- **Sample:**

```json
{ "candidate_id": 2, "votes": 16 }
```

#### 4. Get Demographic Breakdown for a Candidate

- **URL:** `/candidate/<candidate_id>/breakdown`
- **Method:** `GET`
- **Description:** Provides a demographic breakdown of votes for the specified candidate.
- **Parameters:**
  - `candidate_id`: Integer, ID of the candidate.
- **Response:** JSON object containing candidate information, total vote count, gender breakdown, and age breakdown.
- **Sample:**

```json
{
  "ageBreakdown": { "26 - 35": 12, "66 - 75": 2, "unknown": 2 },
  "count": 16,
  "genderBreakdown": { "female": 1, "male": 13, "unknown": 2 },
  "id": 2,
  "name": "Subhash Saran",
  "party": "Guarded Palace",
  "symbol": "https://raw.githubusercontent.com/atisawd/boxicons/master/svg/solid/bxs-shield-plus.svg"
}
```

#### 5. Real-time updates WebSocket/SocketIO

- **Event:** `update_votes`
- **Protocol:** `WebSocket / SocketIO`
- **Description:** Pushes updated votes for all candidates.
- **Event Data:** See response of API 1. Retrieve Votes for All Candidates

### Additional Notes

- The API utilizes SQLAlchemy for database operations.
- SocketIO is employed for broadcasting vote updates in real-time.
- Demographic breakdowns include gender and age groups of voters.
- Age groups are categorized into predefined ranges.
- An event listener updates votes count after each vote insertion.

### Next Steps

- Unit testing using pytest
- Manage configuration using .env files
- Better socketio handling
