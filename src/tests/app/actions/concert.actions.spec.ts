import {
  createConcertAction,
  searchConcertAction,
} from '@/app/actions/concert.actions';
import { listConcertSummariesResponse } from '@/tests/mocks/data-providers/concert-summary.data-provider';
import { createConcertPayload } from '@/tests/mocks/data-providers/create-concert-action.data-provider';

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

const mockedSearchExecute = jest.fn();
const mockedCreateConcertExecute = jest.fn();

jest.mock('@/core/application/concerts/search-concert-summary.usecase', () => ({
  SearchConcertSummaryUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute,
  })),
}));

jest.mock('@/core/application/concerts/create-concert.usecase', () => ({
  CreateConcertUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedCreateConcertExecute,
  })),
}));

describe('Server Actions: Concert', () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
    mockedCreateConcertExecute.mockReset();
  });

  describe('searchConcertAction', () => {
    it('should return success when the term is not empty', async () => {
      const input = listConcertSummariesResponse([{ artist: 'Artist' }]);
      mockedSearchExecute.mockResolvedValue(input.slice(0, 1));

      const formData = new FormData();
      formData.append('query', 'Artist');

      const result = await searchConcertAction({ success: true }, formData);
      expect(result.success).toBe(true);
      expect(result.concerts).toEqual(input.slice(0, 1));
    });

    it('should return success and all concerts when the term is empty', async () => {
      const input = listConcertSummariesResponse();

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
      const input = listConcertSummariesResponse();
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('query', '  Artist 1   ');

      const result = await searchConcertAction({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(result.concerts).toEqual(input);
      expect(mockedSearchExecute).toHaveBeenCalledWith('Artist 1');
    });

    it('should handle missing query as empty term', async () => {
      const input = listConcertSummariesResponse();
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();

      const result = await searchConcertAction({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(result.concerts).toEqual(input);
      expect(mockedSearchExecute).toHaveBeenCalledWith('');
    });
  });

  describe('createConcertAction', () => {
    it('should create a concert successfully', async () => {
      mockedCreateConcertExecute.mockResolvedValue(undefined);

      const data = createConcertPayload();
      const result = await createConcertAction(data);
      expect(result?.success).toBe(true);
      expect(result?.message).toBe('Concert created successfully.');
    });
    it('should validate the input data and return errors for invalid data', async () => {
      const data = createConcertPayload({
        description: '',
        artist: '',
        venue: '',
        city: '',
        date: 'invalid-date' as never as Date,
      });

      const result = await createConcertAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe(
        'Invalid data. Please check the form and try again.'
      );
      expect(result?.errors).toBeDefined();
    });

    it('should return error when concert already exists', async () => {
      mockedCreateConcertExecute.mockRejectedValue(
        new Error('CONCERT_ALREADY_EXISTS')
      );

      const data = createConcertPayload();

      const result = await createConcertAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe(
        'Concert already exists. Please check the details and try again.'
      );
    });

    it('should return a generic error when creation fails', async () => {
      mockedCreateConcertExecute.mockRejectedValue(new Error('UNKNOWN_ERROR'));

      const data = createConcertPayload();

      const result = await createConcertAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe(
        'Failed to create concert. Please try again later.'
      );
    });
  });
});
