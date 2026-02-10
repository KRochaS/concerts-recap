'use client';

import { Button } from '@/presentation/shared/components/button/Button';
import { ConcertCard } from '../concertCard/ConcertCard';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/presentation/shared/components/input/Input';
import { startTransition, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Concert = {
  id: string;
  artist: string;
  location: string;
  date: string;
  kmTraveled: number;
};

export type ConcertCardContentProps = {
  concerts: Concert[];
};

// const mockConcerts = [
//   {
//     id: 1,
//     artist: 'Arctic Monkeys',
//     location: 'Manchester, O2 Apollo',
//     date: 'March 16, 2025',
//     kmTraveled: 288,
//     rating: 4,
//     tags: [
//       { id: 1, label: 'Cried', emoji: '😭' },
//       { id: 2, label: 'Moshpit', emoji: '🎵' },
//       { id: 3, label: 'Merch', emoji: '🛍️' },
//     ],
//     beforeBattery: 80,
//     afterBattery: 20,
//   },
//   {
//     id: 2,
//     artist: 'The 1975',
//     location: 'London, The O2',
//     date: 'February 8, 2025',
//     kmTraveled: 120,
//     rating: 5,
//     tags: [
//       { id: 1, label: 'Filmed', emoji: '🎥' },
//       { id: 2, label: 'Song sang', emoji: '🎤' },
//     ],
//     beforeBattery: 100,
//     afterBattery: 15,
//   },
//   {
//     id: 3,
//     artist: 'Billie Eilish',
//     location: 'Birmingham, Resorts World Arena',
//     date: 'January 22, 2025',
//     kmTraveled: 95,
//     rating: 5,
//     tags: [
//       { id: 1, label: 'Eye contact', emoji: '👁️' },
//       { id: 2, label: 'Front row', emoji: '🎪' },
//     ],
//     beforeBattery: 90,
//     afterBattery: 5,
//   },
// ];

export function ConcertCardContent({ concerts }: ConcertCardContentProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const router = useRouter();

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    startTransition(() => {
      const url = newQuery
        ? `/concerts?q=${encodeURIComponent(newQuery)}`
        : '/concerts';
      router.push(url, { scroll: false });
    });
  };

  return (
    <div className="mx-auto max-w-331.25 px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Concert Memories
          </h1>
          <p className="text-sm md:text-base text-zinc-400 mt-1">
            Your collection of unforgettable live music experiences
          </p>
        </div>
        <Link href="/new-concert">
          <Button> Add Memory</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input
          placeholder="Search by artist, venue, or city..."
          data-testid="search-input"
          type="text"
          value={query}
          onChange={handleQueryChange}
        />
        <select className="px-4 py-2 rounded-lg bg-[#0f0f10] border border-zinc-800 text-white focus:outline-none focus:border-zinc-700">
          <option>All Years</option>
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
        </select>
        <select className="px-4 py-2 rounded-lg bg-[#0f0f10] border border-zinc-800 text-white focus:outline-none focus:border-zinc-700">
          <option>All Venues</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {concerts.map((concert) => (
          <ConcertCard rating={0} tags={[]} key={concert.id} {...concert} />
        ))}
      </div>

      <div>
        {concerts.map((concert) => (
          <p key={concert.id}> {concert.artist} </p>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center">
        <button className="px-6 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 transition-colors">
          Load More Memories
        </button>
      </div>
    </div>
  );
}
