import { ConcertSummary } from '@/core/domain/concerts/concert.entity';
import { ConcertCard } from '../concertCard/ConcertCard';

export type ConcertListProps = {
  concerts: ConcertSummary[];
};

export function ConcertList({ concerts }: ConcertListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      {concerts.map((concert) => (
        <ConcertCard
          key={concert.id}
          {...concert}
          kmTraveled={concert.kmTraveled ?? 0}
        />
      ))}
    </div>
  );
}
