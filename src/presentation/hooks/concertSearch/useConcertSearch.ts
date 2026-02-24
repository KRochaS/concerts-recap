import { useQueryState } from 'nuqs';
import { useRef, useEffect, startTransition } from 'react';
import { useActionState } from 'react';
import { searchConcertAction } from '@/app/actions/concert.actions';
import { ConcertSummary } from '@/core/domain/concerts/concert.entity';

export function useConcertSearch(initialConcerts: ConcertSummary[]) {
  const [query, setQuery] = useQueryState('q', { defaultValue: '' });
  const formRef = useRef<HTMLFormElement | null>(null);

  const [searchState, searchAction, isPending] = useActionState(
    searchConcertAction,
    {
      success: true,
      concerts: initialConcerts,
    }
  );

  const hasQuery = query.trim().length > 0;
  const concertList = hasQuery
    ? (searchState.concerts ?? initialConcerts)
    : initialConcerts;

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    startTransition(() => {
      formRef.current?.requestSubmit();
    });
  };

  useEffect(() => {
    if (!hasQuery) return;
    formRef.current?.requestSubmit();
  }, [hasQuery]);

  return {
    query,
    concertList,
    isPending,
    handleQueryChange,
    formRef,
    searchAction,
  };
}
