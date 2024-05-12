import { useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { API_URL } from '../utils/constants';
import { CandidateVote } from '../types/CandidateVote';

export default function useVotes() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [votes, setVotes] = useState<Array<CandidateVote>>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/candidate/votes`, { signal: controller.signal })
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

  return { votes: votes.sort((a, b) => b.count - a.count), isLive: isConnected };
}
