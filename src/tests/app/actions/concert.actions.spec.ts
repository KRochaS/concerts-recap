import {
  createConcertAction,
  extractConcertDataAction,
  searchConcertAction,
} from '@/app/actions/concert.actions';
import { listConcertSummariesResponse } from '@/tests/mocks/data-providers/concert-summary.data-provider';
import { createConcertPayload } from '@/tests/mocks/data-providers/create-concert-action.data-provider';

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

const mockedSearchExecute = jest.fn();
const mockedCreateConcertExecute = jest.fn();
const mockedExtractConcertDataExecute = jest.fn();

jest.mock('@/infra/services', () => ({
  AIApiService: jest.fn(),
  CONCERT_TICKET_NOT_RECOGNIZED: 'CONCERT_TICKET_NOT_RECOGNIZED',
}));

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

jest.mock('@/core/application/ai/extract-concert-data.usecase', () => ({
  ExtractConcertDataUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedExtractConcertDataExecute,
  })),
}));

describe('Server Actions: Concert', () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
    mockedCreateConcertExecute.mockReset();
    mockedExtractConcertDataExecute.mockReset();
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
      mockedCreateConcertExecute.mockResolvedValue('mock-concert-id');

      const data = createConcertPayload();
      const result = await createConcertAction(data);
      expect(result?.success).toBe(true);
      expect(result?.message).toBe('Concert created successfully.');
      expect(result?.concertId).toBe('mock-concert-id');
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

  describe('extractConcertDataAction', () => {
    it('should reject an invalid image URL before calling the use case', async () => {
      const result = await extractConcertDataAction('invalid-url');

      expect(result).toEqual({
        success: false,
        message: 'Invalid ticket image URL. Please try again.',
      });
      expect(mockedExtractConcertDataExecute).not.toHaveBeenCalled();
    });

    it('should call the use case with a valid image URL', async () => {
      const imageUrl = 'https://example.com/ticket.jpg';
      const extractedData = {
        date: new Date('2026-03-01T21:00:00Z'),
        artist: 'Artist',
        venue: 'Venue',
        city: 'City',
      };
      mockedExtractConcertDataExecute.mockResolvedValue(extractedData);

      const result = await extractConcertDataAction(imageUrl);

      expect(result).toEqual({ success: true, data: extractedData });
      expect(mockedExtractConcertDataExecute).toHaveBeenCalledWith(imageUrl);
    });

    it('should return a ticket-specific error when the image is rejected', async () => {
      mockedExtractConcertDataExecute.mockRejectedValue(
        new Error('CONCERT_TICKET_NOT_RECOGNIZED')
      );

      const result = await extractConcertDataAction(
        'https://example.com/ticket.jpg'
      );

      expect(result).toEqual({
        success: false,
        message:
          "This image doesn't look like a concert ticket. Please upload a clear photo of the concert ticket.",
      });
    });

    it('should hide technical errors from the UI', async () => {
      mockedExtractConcertDataExecute.mockRejectedValue(
        new Error('PROVIDER_INTERNAL_ERROR')
      );

      const result = await extractConcertDataAction(
        'https://example.com/ticket.jpg'
      );

      expect(result).toEqual({
        success: false,
        message: 'Failed to analyze ticket image. Please try again later.',
      });
    });
  });
});
