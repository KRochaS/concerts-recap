import { CreateConcertDTO } from '@/core/application/concerts/create-concert.dto';

type CreateConcertDTOOverrides = Partial<CreateConcertDTO>;

const defaultPayload: CreateConcertDTO = {
  date: new Date('2026-03-15'),
  artist: 'Radiohead',
  venue: 'Madison Square Garden',
  city: 'New York',
  description:
    'An amazing concert experience with incredible setlist and atmosphere.',
  ticketImageUrl: 'https://example.com/ticket.jpg',
};

export const createConcertPayload = (
  overrides: CreateConcertDTOOverrides = {}
): CreateConcertDTO => ({
  ...defaultPayload,
  ...overrides,
});
