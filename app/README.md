# Voting Prototype Front-end

This React front-end app interacts with the Flask API to provide a user interface for viewing a leaderboard of votes, casting votes, and displaying demographic breakdowns.

## Requirements

1. NodeJS v20+
2. Browser that supports WebSocket API / SocketIO

## Setup

1. Install dependencies `npm ci`
2. Run in dev mode `npm run dev`

## Routes

### 1. Leaderboard

- **Path:** `/`
- **Description:** Displays a leaderboard showing the total votes for each candidate. Each new vote gets updated on the leaderboard in real-time.

### 2. Vote Form

- **Path:** `/vote`
- **Description:** Provides a form for users to cast their votes for candidates.

### 3. Candidate Details

- **Path:** `/candidate/<id>`
- **Description:** Displays detailed information about a specific candidate, including their total votes and demographic breakdown.

## Additional Notes

- The React app communicates with the Flask API via HTTP requests to retrieve and submit data.
- Routing is implemented using React Router to navigate between different views/components.
- WebSocket / SocketIO is utilized for vote count updates.
- Chart.js is used for demographic charts.
- TailwindCSS is used for styling.
- Operating System dark mode behaviour is respected.

### Next Steps

- Unit testing using vitest
- Full support for Dark mode
