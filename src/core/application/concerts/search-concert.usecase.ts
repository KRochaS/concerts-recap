import { ConcertRepository } from '@/core/domain/concerts/concerts.repository';

export class SearchConcertUseCase {
  constructor(private concertRepository: ConcertRepository) {}

  async execute(term?: string) {
    const query = term?.toLowerCase() ?? '';

    if (!query) {
      return this.concertRepository.findMany();
    }

    return this.concertRepository.searchMany(query);
  }
}
