import { describe, it, expect, afterEach, vi } from 'vitest';
// eslint-disable-next-line no-redeclare
import { render, screen } from '@testing-library/react';

import Leaderboard from '../../views/Leaderboard.tsx';
import * as useVotes from '../../hooks/votes.ts';
import { MemoryRouter } from 'react-router-dom';

describe('Renders leaderboard page correctly', async () => {
  const useVotesSpy = vi.spyOn(useVotes, 'default');

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should render the page correctly', async () => {
    const votes = [
      {
        name: 'Candidate A',
        party: 'Party A',
        symbol: '',
        count: 10,
        id: 1,
      },
    ];

    useVotesSpy.mockReturnValue({ votes, isLive: true });
    render(
      <MemoryRouter>
        <Leaderboard />
      </MemoryRouter>
    );
    const h3 = await screen.queryByText(votes[0].name);
    const progress = await screen.queryByTestId('progress');

    expect(h3).not.toBeNull();
    expect(progress?.style.width).toBe('100%');
  });
});
