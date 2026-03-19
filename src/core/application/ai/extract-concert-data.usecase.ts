import { AIService } from '@/core/domain/ai/ai.service';
import { ExtractedConcertData } from '@/core/domain/ai/extracted-concert-data.entity';

export class ExtractConcertDataUseCase {
  constructor(private aiService: AIService) {}

  async execute(imageUrl: string): Promise<ExtractedConcertData> {
    return this.aiService.extractConcertDataFromImage(imageUrl);
  }
}
