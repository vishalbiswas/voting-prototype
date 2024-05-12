import { useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { Link } from 'react-router-dom';

export default function Leaderboard() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [votes, setVotes] = useState<Array<any>>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('http://localhost:5000/candidate/votes', { signal: controller.signal })
      .then((res) => res.json())
      .then(setVotes)
      .catch((err) => {
        if (err.name !== 'AbortError') throw err;
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onVotesUpdated(value: Array<any>) {
      setVotes(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('update_votes', onVotesUpdated);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('update_vote', onVotesUpdated);
    };
  }, []);

  return (
    <div>
      {votes.map((v) => (
        <Link key={v.id} to={'/candidate/' + v.id}>
          Count: {v.count}
          <br />
          <img src={v.symbol} />
          <h3>{v.name}</h3>
          <p>{v.party}</p>
        </Link>
      ))}
    </div>
  );
}
