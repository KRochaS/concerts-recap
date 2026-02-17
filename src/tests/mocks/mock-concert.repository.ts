import { ConcertRepository } from '@/core/domain/concerts/concerts.repository';
import { ConcertSummary } from '@/core/domain/concerts';
import { listConcertSummariesResponse } from './data-providers/concert-summary.data-provider';

export class MockConcertRepository implements ConcertRepository {
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
