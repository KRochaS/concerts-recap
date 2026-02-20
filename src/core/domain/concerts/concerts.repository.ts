import { CreateConcertDTO } from '@/core/application/concerts/create-concert.dto';
import { ConcertSummary } from '@/core/domain/concerts/concert.entity';

export interface ConcertRepository {
  create(data: CreateConcertDTO): Promise<void>;
  findByConcert(data: CreateConcertDTO): Promise<ConcertSummary | null>;
  findManySummaries(): Promise<ConcertSummary[]>;
  searchManySummaries(term: string): Promise<ConcertSummary[]>;
}
