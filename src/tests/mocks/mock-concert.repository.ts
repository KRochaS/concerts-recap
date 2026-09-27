import { ConcertRepository } from '@/core/domain/concerts/concerts.repository';
import { ConcertSummary } from '@/core/domain/concerts';
import { listConcertSummariesResponse } from '@/tests/mocks/data-providers/concert-summary.data-provider';
import { CreateConcertInput } from '@/core/domain/concerts';

export class MockConcertRepository implements ConcertRepository {
  public async create(_data: CreateConcertInput): Promise<string> {
    return Promise.resolve('mock-concert-id');
  }

  public async findByConcert(
    _data: CreateConcertInput
  ): Promise<ConcertSummary | null> {
    return null;
  }

  public async findManySummaries(): Promise<ConcertSummary[]> {
    return listConcertSummariesResponse();
  }

  public async searchManySummaries(term: string): Promise<ConcertSummary[]> {
    const summaries = listConcertSummariesResponse();
    return summaries.filter((concert) =>
      concert.artist.toLowerCase().includes(term.toLowerCase())
    );
  }
}
