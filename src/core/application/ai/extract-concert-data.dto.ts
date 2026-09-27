import z from 'zod';

export const extractConcertDataSchema = z.object({
  imageUrl: z.string().url(),
});

export type ExtractConcertDataDTO = z.infer<typeof extractConcertDataSchema>;
