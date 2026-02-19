'use client';

import { Button } from '@/presentation/shared/components/button/Button';
import { ConcertList } from '@/presentation/pages/concerts/concertList/ConcertList';
import Link from 'next/link';
import { Input } from '@/presentation/shared/components/input/Input';
import {
  Activity,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConcertSummary } from '@/core/domain/concerts/concert.entity';
import { searchConcertAction } from '@/app/actions/concert.actions';

export type ConcertCardContentProps = {
  concerts: ConcertSummary[];
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const formRef = useRef<HTMLFormElement | null>(null);

  const [searchState, searchAction, isPending] = useActionState(
    searchConcertAction,
    {
      success: true,
      concerts: concerts,
    }
  );

  const hasQuery = query.trim().length > 0;
  const concertList = hasQuery ? (searchState.concerts ?? concerts) : concerts;

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    startTransition(() => {
      const url = newQuery
        ? `/concerts?q=${encodeURIComponent(newQuery)}`
        : '/concerts';
      router.push(url, { scroll: false });
      formRef.current?.requestSubmit();
    });
  };

  useEffect(() => {
    if (!hasQuery) {
      return;
    }
    formRef.current?.requestSubmit();
  }, [hasQuery]);

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
      <div className="flex flex-col gap-4 mb-8">
        <form ref={formRef} action={searchAction} className="w-full">
          <Input
            name="query"
            placeholder="Search by artist, venue, or city..."
            data-testid="search-input"
            type="text"
            value={query}
            onChange={handleQueryChange}
          />
        </form>
        <Activity mode={isPending ? 'hidden' : 'visible'}>
          <ConcertList concerts={concertList} />
        </Activity>
      </div>

      {/* Cards Grid */}

      {/* Load More Button */}
      <div className="flex justify-center">
        <button className="px-6 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 transition-colors">
          Load More Memories
        </button>
      </div>
    </div>
  );
}
