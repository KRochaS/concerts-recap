import { ConcertCardContent } from '@/presentation/pages/concerts/components/ConcertCardContent/ConcertCardContent';

export default function ConcertsPage() {
  return (
    <ConcertCardContent
      concerts={[
        {
          id: '1',
          artist: 'Arctic Monkeys',
          location: 'Manchester, O2 Apollo',
          date: 'March 16, 2025',
          kmTraveled: 288,
        },
      ]}
    />
  );
}
