import { Link } from 'react-router-dom';
import clsx from 'clsx';
import useVotes from '../hooks/votes';
import { CandidateVote } from '../types/CandidateVote';
import { useMemo } from 'react';

const CandidateStat = ({
  candidate,
  percent,
}: {
  candidate: CandidateVote;
  percent: number;
}) => (
  <Link
    to={'/candidate/' + candidate.id}
    className="block mb-5 rounded-sm text-black dark:text-white border-2"
  >
    <div className="p-3">
      <div
        className="rounded h-5 bg-orange-400"
        style={{ width: percent * 100 + '%', minWidth: '2px' }}
      ></div>
      <p className="font-bold">{candidate.count} votes</p>
      <h3 className="text-xl font-semibold">{candidate.name}</h3>
      <div className="flex mt-3 items-center">
        <div className="rounded-full bg-gray-300 p-2 me-3">
          <img className="w-6 h-6" src={candidate.symbol} />
        </div>
        <p>
          {candidate.party}
          <br />
          <small className="leading-none">Group</small>
        </p>
      </div>
    </div>
    <div className="bg-gray-100 p-3 text-center text-black">See Breakdown</div>
  </Link>
);

export default function Leaderboard() {
  const { isLive, votes } = useVotes();

  const percents = useMemo(() => {
    const percents: Record<string, number> = {};
    const highest = votes.reduce((p, c) => Math.max(p, c.count), 0);
    votes.forEach((v) => (percents[v.id] = v.count / highest));
    return percents;
  }, [votes]);

  return (
    <div>
      <p
        className={clsx(
          'px-3 py-2 rounded mb-3 text-white',
          isLive ? 'bg-green-500 dark:bg-green-600' : 'bg-red-600'
        )}
      >
        {isLive ? 'Live updates are enabled' : 'Live updates are disabled'}
      </p>
      {votes.map((v) => (
        <CandidateStat key={v.id} candidate={v} percent={percents[v.id]} />
      ))}
    </div>
  );
}
