import { ConcertSummary } from '@/core/domain/concerts';
import { ConcertRepository } from '@/core/domain/concerts/concerts.repository';

export class SearchConcertSummaryUseCase {
  constructor(private concertRepository: ConcertRepository) {}

  async execute(term?: string): Promise<ConcertSummary[]> {
    const query = term?.toLowerCase() ?? '';

    if (!query) {
      return this.concertRepository.findManySummaries();
    }

    return this.concertRepository.searchManySummaries(query);
  }
}
