import { ConcertSummary } from './concert.entity';

export interface ConcertRepository {
  findManySummaries(): Promise<ConcertSummary[]>;
  searchManySummaries(term: string): Promise<ConcertSummary[]>;
}
