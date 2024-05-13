/* eslint-disable no-undef */
import { describe, it, expect, afterEach, vi } from 'vitest';
// eslint-disable-next-line no-redeclare
import { render } from '@testing-library/react';

import VoteForm from '../../views/VoteForm.tsx';
import { MemoryRouter } from 'react-router-dom';
import { API_URL } from '../../utils/constants.ts';

const mockFetch = vi.fn();

describe('Renders voting page correctly', async () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should render the page correctly', async () => {
    global.fetch = mockFetch;
    const candidates = [
      {
        name: 'Candidate A',
        party: 'Party A',
        symbol: '',
        id: 1,
      },
      {
        name: 'Candidate B',
        party: 'Party B',
        symbol: '',
        id: 2,
      },
    ];

    mockFetch.mockReturnValue(
      new Promise(() => ({ json: new Promise(() => candidates) }))
    );

    render(
      <MemoryRouter>
        <VoteForm />
      </MemoryRouter>
    );

    expect(mockFetch).toHaveBeenCalledWith(API_URL + '/candidate', { signal: expect.any(AbortSignal)});
  });

  // TODO: add test case for successful and unsuccessful votes
});
