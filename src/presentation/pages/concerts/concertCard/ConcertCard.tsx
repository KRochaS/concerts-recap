import { ConcertSummary } from '@/core/domain/concerts/concert.entity';
import { Star } from 'lucide-react';

export const ConcertCard = ({
  artist,
  city,
  date,
  kmTraveled,
  setlistRating,
}: ConcertSummary) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0a0b14] p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-white">{artist}</h3>
        <p className="text-sm text-zinc-400">{city}</p>
        <p className="text-xs text-zinc-500 mt-1">{formattedDate}</p>
        <p className="text-xs text-zinc-500">{kmTraveled} km travelled</p>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < (setlistRating ?? 0)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-zinc-700'
            }
          />
        ))}
      </div>
    </div>
  );
};
