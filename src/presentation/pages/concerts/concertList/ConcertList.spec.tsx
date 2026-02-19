import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConcertList } from '@/presentation/pages/concerts/concertList/ConcertList';
import { ConcertCard } from '@/presentation/pages/concerts/concertCard/ConcertCard';

jest.mock('../concertCard/ConcertCard', () => ({
  ConcertCard: jest.fn(() => <div />),
}));

const concerts = [
  {
    id: '1',
    artist: 'Arctic Monkeys',
    venue: 'O2 Apollo',
    city: 'Manchester',
    date: new Date('2025-03-16'),
    setlistRating: 4,
    kmTraveled: 288,
    createdAt: new Date('2025-03-17'),
    updatedAt: new Date('2025-03-17'),
  },
  {
    id: '2',
    artist: 'The 1975',
    venue: 'The O2',
    city: 'London',
    date: new Date('2025-02-08'),
    setlistRating: 5,
    kmTraveled: 120,
    createdAt: new Date('2025-02-09'),
    updatedAt: new Date('2025-02-09'),
  },
];

describe('ConcertList', () => {
  it('should render list of concerts when there are concerts', () => {
    render(<ConcertList concerts={concerts} />);

    const firstCall = (ConcertCard as jest.Mock).mock.calls[0][0];
    expect(firstCall.artist).toBe(concerts[0].artist);
    expect(ConcertCard).toHaveBeenCalledTimes(concerts.length);
  });
});
