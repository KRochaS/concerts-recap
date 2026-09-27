import { generateText, Output } from 'ai';
import z from 'zod';
import { AIService } from '@/core/domain/ai/ai.service';
import { ExtractedConcertData } from '@/core/domain/ai/extracted-concert-data.entity';

export const CONCERT_TICKET_NOT_RECOGNIZED = 'CONCERT_TICKET_NOT_RECOGNIZED';
export const AI_EXTRACTION_INVALID_RESPONSE = 'AI_EXTRACTION_INVALID_RESPONSE';

const extractedConcertSchema = z.object({
  date: z
    .string()
    .datetime()
    .refine(
      (value) => {
        const year = new Date(value).getUTCFullYear();
        return year >= 1900 && year <= 2100;
      },
      { message: 'Date must have a plausible year.' }
    ),
  artist: z.string(),
  venue: z.string(),
  city: z.string(),
});

export class AIApiService implements AIService {
  async extractConcertDataFromImage(
    imageUrl: string
  ): Promise<ExtractedConcertData> {
    const isTicket = await this.isConcertTicketImage(imageUrl);

    if (!isTicket) {
      throw new Error(CONCERT_TICKET_NOT_RECOGNIZED);
    }

    const result = await generateText({
      model: 'openai/gpt-4o',
      output: Output.object({
        schema: extractedConcertSchema,
      }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this concert ticket image and fill in exactly the schema fields. Do not add extra fields. For date, transcribe the date shown on the ticket and return it in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ). Do not infer, reorder, or alter any date digits.',
            },
            {
              type: 'image',
              image: imageUrl,
            },
          ],
        },
      ],
    });

    const parsedData = extractedConcertSchema.safeParse(result.output);

    if (!parsedData.success) {
      throw new Error(AI_EXTRACTION_INVALID_RESPONSE);
    }

    return {
      date: new Date(parsedData.data.date),
      artist: parsedData.data.artist,
      venue: parsedData.data.venue,
      city: parsedData.data.city,
    };
  }

  private async isConcertTicketImage(imageUrl: string): Promise<boolean> {
    const result = await generateText({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'You are an image classifier. Check whether the image is a concert ticket or clearly related to a live music event. Reply with only "yes" or "no".',
            },
            {
              type: 'image',
              image: imageUrl,
            },
          ],
        },
      ],
    });

    const answer = result.text.toLowerCase().trim();
    return answer.startsWith('sim') || answer.startsWith('yes');
  }
}
