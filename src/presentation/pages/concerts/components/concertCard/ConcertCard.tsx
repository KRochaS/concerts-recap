import { Star } from 'lucide-react';

interface ConcertCardProps {
  artist: string;
  location: string;
  date: string;
  kmTraveled: number;
  rating: number;
  tags: Array<{ id: number; label: string; emoji?: string }>;
  beforeBattery?: number;
  afterBattery?: number;
}

export const ConcertCard = ({
  artist,
  location,
  date,
  kmTraveled,
  rating,
}: ConcertCardProps) => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0a0b14] p-6 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-white">{artist}</h3>
        <p className="text-sm text-zinc-400">{location}</p>
        <p className="text-xs text-zinc-500 mt-1">{date}</p>
        <p className="text-xs text-zinc-500">{kmTraveled} km travelled</p>
      </div>

      {/* Rating */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700'
            }
          />
        ))}
      </div>
    </div>
  );
};
