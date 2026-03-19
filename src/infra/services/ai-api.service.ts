import { AIService } from '@/core/domain/ai/ai.service';
import { ExtractedConcertData } from '@/core/domain/ai/extracted-concert-data.entity';

export class AIApiService implements AIService {
  constructor(
    private apiBaseUrl: string = process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000'
  ) {}

  async extractConcertDataFromImage(
    imageUrl: string
  ): Promise<ExtractedConcertData> {
    const response = await fetch(`${this.apiBaseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message =
        typeof body?.error === 'string'
          ? body.error
          : 'Failed to extract concert data from image';
      throw new Error(message);
    }

    const data = await response.json();

    return {
      date: new Date(data.date),
      artist: data.artist,
      venue: data.venue,
      city: data.city,
    };
  }
}
