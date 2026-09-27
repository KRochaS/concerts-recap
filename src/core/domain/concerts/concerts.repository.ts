import {
  ConcertSummary,
  CreateConcertInput,
} from '@/core/domain/concerts/concert.entity';

export interface ConcertRepository {
  create(data: CreateConcertInput): Promise<string>;
  findByConcert(data: CreateConcertInput): Promise<ConcertSummary | null>;
  findManySummaries(): Promise<ConcertSummary[]>;
  searchManySummaries(term: string): Promise<ConcertSummary[]>;
}
