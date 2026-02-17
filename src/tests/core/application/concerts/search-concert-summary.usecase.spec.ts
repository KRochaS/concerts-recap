import { SearchConcertSummaryUseCase } from '@/core/application/concerts/search-concert-summary.usecase';
import { MockConcertRepository } from '@/tests/mocks/mock-concert.repository';

describe('SearchConcertSummaryUseCase', () => {
  let repository: MockConcertRepository;
  let useCase: SearchConcertSummaryUseCase;

  beforeEach(() => {
    repository = new MockConcertRepository();
    useCase = new SearchConcertSummaryUseCase(repository);
  });

  it('should return all concert summaries when no term is provided', async () => {
    const results = await useCase.execute('');
    expect(results).toHaveLength(2);
  });

  it('should return filtered concert summaries when a term is provided', async () => {
    const query = 'Artist A';

    const results = await useCase.execute(query);

    expect(results).toHaveLength(1);
    expect(results[0].artist).toBe(query);
  });

  it('should trim whitespace-only search terms and return all summaries', async () => {
    const findManySummaries = jest.spyOn(repository, 'findManySummaries');
    const searchManySummaries = jest.spyOn(repository, 'searchManySummaries');
    const query = '         ';

    const results = await useCase.execute(query);

    expect(results).toHaveLength(2);
    expect(findManySummaries).toHaveBeenCalledTimes(1);
    expect(searchManySummaries).not.toHaveBeenCalled();
  });

  it('should trim search terms with leading and trailing spaces', async () => {
    const searchManySummaries = jest.spyOn(repository, 'searchManySummaries');
    const findManySummaries = jest.spyOn(repository, 'findManySummaries');
    const query = '         Artist A         ';

    const results = await useCase.execute(query);

    expect(results).toHaveLength(1);
    expect(searchManySummaries).toHaveBeenCalledWith(
      query.trim().toLowerCase()
    );
    expect(findManySummaries).not.toHaveBeenCalled();
  });

  it('should handle undefined or null terms and return the complete list', async () => {
    const findManySummaries = jest.spyOn(repository, 'findManySummaries');
    const searchManySummaries = jest.spyOn(repository, 'searchManySummaries');
    const query = undefined;

    const results = await useCase.execute(query);
    expect(results).toHaveLength(2);
    expect(findManySummaries).toHaveBeenCalledTimes(1);
    expect(searchManySummaries).not.toHaveBeenCalled();
  });
});
