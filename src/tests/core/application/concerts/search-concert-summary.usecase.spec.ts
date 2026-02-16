import { SearchConcertSummaryUseCase } from '@/core/application/concerts/search-concert-summary.usecase';
import { ConcertSummary } from '@/core/domain/concerts';
import { ConcertRepository } from '@/core/domain/concerts/concerts.repository';

describe('SearchConcertSummaryUseCase', () => {
  const input: ConcertSummary[] = [
    {
      id: '1',
      artist: 'Artist A',
      date: new Date(),
      venue: '',
      city: '',
      setlistRating: null,
      kmTraveled: null,
    },
    {
      id: '2',
      artist: 'Artist B',
      date: new Date(),
      venue: '',
      city: '',
      setlistRating: null,
      kmTraveled: null,
    },
  ];
  const repository: ConcertRepository = {
    findManySummaries: async () => input,
    searchManySummaries: async (term) =>
      input.filter((concert) =>
        concert.artist.toLowerCase().includes(term.toLowerCase())
      ),
  };

  it('should return all concert summaries when no term is provided', async () => {
    const useCase = new SearchConcertSummaryUseCase(repository);

    const results = await useCase.execute('');
    expect(results).toHaveLength(2);
  });

  it('should return filtered concert summaries when a term is provided', async () => {
    const useCase = new SearchConcertSummaryUseCase(repository);
    const query = 'Artist A';

    const results = await useCase.execute(query);

    expect(results).toHaveLength(1);
    expect(results[0].artist).toBe(query);
  });

  it('should trim search terms with spaces and return matching results', async () => {
    const findManySummaries = jest.fn().mockResolvedValue(input);
    const searchManySummaries = jest.fn().mockResolvedValue([]);
    const repositoryWithSpies: ConcertRepository = {
      ...repository,
      findManySummaries,
      searchManySummaries,
    };
    const useCase = new SearchConcertSummaryUseCase(repositoryWithSpies);
    const query = '         ';

    const results = await useCase.execute(query);

    expect(results).toHaveLength(2);
    expect(findManySummaries).toHaveBeenCalledTimes(1);
    expect(searchManySummaries).not.toHaveBeenCalled();
  });

  it('should trim search terms with spaces and return matching results', async () => {
    const firstElement = input.slice(0, 1);
    const findManySummaries = jest.fn().mockResolvedValue(input);
    const searchManySummaries = jest.fn().mockResolvedValue(firstElement);
    const repositoryWithSpies: ConcertRepository = {
      ...repository,
      findManySummaries,
      searchManySummaries,
    };
    const useCase = new SearchConcertSummaryUseCase(repositoryWithSpies);
    const query = '         Artist A         ';

    const results = await useCase.execute(query);

    expect(results).toMatchObject(firstElement);
    expect(searchManySummaries).toHaveBeenCalledWith(
      query.trim().toLowerCase()
    );
    expect(findManySummaries).not.toHaveBeenCalled();
  });

  it('should handle undefined or null terms and return the complete list', async () => {
    const findManySummaries = jest.fn().mockResolvedValue(input);
    const searchManySummaries = jest.fn().mockResolvedValue([]);
    const repositoryWithSpies: ConcertRepository = {
      ...repository,
      findManySummaries,
      searchManySummaries,
    };
    const useCase = new SearchConcertSummaryUseCase(repositoryWithSpies);
    const query = undefined;

    const results = await useCase.execute(query);
    expect(results).toMatchObject(input);
    expect(findManySummaries).toHaveBeenCalledTimes(1);
    expect(searchManySummaries).not.toHaveBeenCalled();
  });
});
