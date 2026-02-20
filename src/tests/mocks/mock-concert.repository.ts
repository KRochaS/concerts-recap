import { ConcertRepository } from '@/core/domain/concerts/concerts.repository';
import { ConcertSummary } from '@/core/domain/concerts';
import { listConcertSummariesResponse } from '@/tests/mocks/data-providers/concert-summary.data-provider';
import { CreateConcertDTO } from '@/core/application/concerts/create-concert.dto';

export class MockConcertRepository implements ConcertRepository {
  public async create(_data: CreateConcertDTO): Promise<void> {
    return Promise.resolve();
  }

  public async findByConcert(
    _data: CreateConcertDTO
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
