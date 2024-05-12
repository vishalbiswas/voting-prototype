import { Candidate } from "./Candidate";

export type CandidateVote = {
  count: number;
} & Candidate;