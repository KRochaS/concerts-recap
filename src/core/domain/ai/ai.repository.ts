import { ExtractedConcertData } from '@/core/domain/ai/extracted-concert-data.entity';

export interface AIRepository {
  extractConcertDataFromImage(imageUrl: string): Promise<ExtractedConcertData>;
}
