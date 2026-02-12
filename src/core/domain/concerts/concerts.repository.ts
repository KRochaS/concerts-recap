import { Concert, ConcertSummary } from './concert.entity';

export interface ConcertRepository {
  findMany(): Promise<Concert[]>;
  searchMany(term: string): Promise<Concert[]>;
  findManySummaries(): Promise<ConcertSummary[]>;
  searchManySummaries(term: string): Promise<ConcertSummary[]>;
}
