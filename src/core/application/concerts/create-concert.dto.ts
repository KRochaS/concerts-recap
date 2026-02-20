import z from 'zod';

export const createConcertSchema = z.object({
  date: z.date({ message: 'Date is required' }),
  artist: z.string().min(3, 'Artist must be required').max(100),
  venue: z.string().min(3, 'Venue must be required').max(100),
  city: z.string().min(3, 'City must be required').max(100),
  description: z.string().min(10, 'Description must be required').max(500),
  ticketImageUrl: z.url({ message: 'Invalid URL' }).nullish(),
});

export type CreateConcertDTO = z.infer<typeof createConcertSchema>;
