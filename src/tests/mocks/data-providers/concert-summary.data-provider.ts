import { ConcertSummary } from '@/core/domain/concerts';

type ConcertSummaryOverrides = Partial<ConcertSummary>;

const now = new Date();

const defaultSummaries: ConcertSummary[] = [
  {
    id: '1',
    artist: 'Artist A',
    date: new Date('2026-02-13'),
    venue: 'Venue',
    city: 'City',
    setlistRating: 5,
    kmTraveled: 120,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    artist: 'Artist B',
    date: new Date('2026-02-14'),
    venue: 'Venue 2',
    city: 'City 2',
    setlistRating: 4,
    kmTraveled: 120,
    createdAt: now,
    updatedAt: now,
  },
];

export const listConcertSummariesResponse = (
  overrides: ConcertSummaryOverrides[] = []
): ConcertSummary[] =>
  defaultSummaries.map((summary, index) => ({
    ...summary,
    ...(overrides[index] ?? {}),
  }));
