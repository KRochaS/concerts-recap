import { ExtractedConcertData } from '@/core/domain/ai/extracted-concert-data.entity';

export interface AIService {
  extractConcertDataFromImage(imageUrl: string): Promise<ExtractedConcertData>;
}
