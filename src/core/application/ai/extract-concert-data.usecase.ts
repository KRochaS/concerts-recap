import { AIRepository } from '@/core/domain/ai/ai.repository';
import { ExtractedConcertData } from '@/core/domain/ai/extracted-concert-data.entity';

export class ExtractConcertDataUseCase {
  constructor(private aiRepository: AIRepository) {}

  async execute(imageUrl: string): Promise<ExtractedConcertData> {
    return this.aiRepository.extractConcertDataFromImage(imageUrl);
  }
}
