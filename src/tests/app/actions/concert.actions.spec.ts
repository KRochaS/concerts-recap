import { searchConcertAction } from '@/app/actions/concert.actions';

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

const mockedSearchExecute = jest.fn();

jest.mock('@/core/application/concerts/search-concert-summary.usecase', () => ({
  SearchConcertSummaryUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute,
  })),
}));

describe('Server Actions: Concert', () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
  });

  describe('searchConcertAction', () => {
    it('should return success when the term is not empty', async () => {
      const input = [
        {
          id: '1',
          artist: 'Artist',
          venue: 'Venue',
          city: 'City',
          date: '2026-02-13',
          setlistRating: 5,
          kmTraveled: 120,
        },
      ];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('query', 'Artist');

      const result = await searchConcertAction({ success: true }, formData);
      expect(result.success).toBe(true);
      expect(result.concerts).toEqual(input);
    });

    it('should return success and all concerts when the term is empty', async () => {
      const input = [
        {
          id: '1',
          artist: 'Artist',
          venue: 'Venue',
          city: 'City',
          date: '2026-02-13',
          setlistRating: 5,
          kmTraveled: 120,
        },
        {
          id: '2',
          artist: 'Artist 2',
          venue: 'Venue 2',
          city: 'City 2',
          date: '2026-02-14',
          setlistRating: 4,
          kmTraveled: 120,
        },
      ];

      mockedSearchExecute.mockResolvedValue(input);
      const formData = new FormData();
      formData.append('query', '');

      const result = await searchConcertAction({ success: true }, formData);
      expect(result.success).toBe(true);
      expect(result.concerts).toEqual(input);
    });

    it('should return a generic error when the search fails', async () => {
      mockedSearchExecute.mockRejectedValue(new Error('UNKNOWN_ERROR'));

      const formData = new FormData();
      formData.append('query', 'error');

      const result = await searchConcertAction({ success: true }, formData);
      expect(result.success).toBe(false);
      expect(result.concerts).toBeUndefined();
      expect(result.message).toBe(
        'Failed to search concerts. Please try again later.'
      );
    });

    it('should trim whitespace before execution', async () => {
      const input = [
        {
          id: '1',
          artist: 'Artist 1',
          venue: 'Venue',
          city: 'City',
          date: '2026-02-13',
          setlistRating: 5,
          kmTraveled: 120,
        },
      ];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('query', '  Artist 1   ');

      const result = await searchConcertAction({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(result.concerts).toEqual(input);
      expect(mockedSearchExecute).toHaveBeenCalledWith('Artist 1');
    });

    it('should handle missing query as empty term', async () => {
      const input = [
        {
          id: '1',
          artist: 'Artist',
          venue: 'Venue',
          city: 'City',
          date: '2026-02-13',
          setlistRating: 5,
          kmTraveled: 120,
        },
        {
          id: '2',
          artist: 'Artist 2',
          venue: 'Venue 2',
          city: 'City 2',
          date: '2026-02-14',
          setlistRating: 4,
          kmTraveled: 120,
        },
      ];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();

      const result = await searchConcertAction({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(result.concerts).toEqual(input);
      expect(mockedSearchExecute).toHaveBeenCalledWith('');
    });
  });
});
