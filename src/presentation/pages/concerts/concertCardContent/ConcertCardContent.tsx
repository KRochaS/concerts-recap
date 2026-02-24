'use client';

import { ConcertList } from '@/presentation/pages/concerts/concertList/ConcertList';
import { Input } from '@/presentation/shared/components/input/Input';
import { Activity } from 'react';
import { ConcertSummary } from '@/core/domain/concerts/concert.entity';
import { ConcertHeader } from '@/presentation/pages/concerts/concertHeader/ConcertHeader';
import { useConcertSearch } from '@/presentation/hooks/concertSearch/useConcertSearch';

export type ConcertCardContentProps = {
  concerts: ConcertSummary[];
};

export function ConcertCardContent({ concerts }: ConcertCardContentProps) {
  const {
    query,
    concertList,
    isPending,
    handleQueryChange,
    formRef,
    searchAction,
  } = useConcertSearch(concerts);

  return (
    <div className="mx-auto min-w-[70.74rem] max-w-[70.74rem] px-4 py-10">
      <ConcertHeader />
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
    </div>
  );
}
