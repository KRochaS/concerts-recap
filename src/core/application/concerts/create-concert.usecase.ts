import { ConcertRepository } from '@/core/domain/concerts/concerts.repository';
import { CreateConcertDTO } from '@/core/application/concerts/create-concert.dto';

export class CreateConcertUseCase {
  constructor(private concertRepository: ConcertRepository) {}

  async execute(data: CreateConcertDTO): Promise<string> {
    const concertExists = await this.concertRepository.findByConcert(data);
    if (concertExists) {
      throw new Error('CONCERT_ALREADY_EXISTS');
    }
    return this.concertRepository.create(data);
  }
}
