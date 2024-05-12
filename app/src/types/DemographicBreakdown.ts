import { CandidateVote } from './CandidateVote';

export type DemographicBreakdown = {
  count: number;
  ageBreakdown: Record<string, number>;
  genderBreakdown: Record<string, number>;
} & CandidateVote;