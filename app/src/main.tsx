import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Leaderboard from './views/Leaderboard.tsx';
import App from './App.tsx';
import VoteForm from './views/VoteForm.tsx';
import Candidate from './views/Candidate.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Leaderboard />
      },
      {
        path: 'vote',
        element: <VoteForm />
      },
      {
        path: 'candidate/:id',
        element: <Candidate />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
