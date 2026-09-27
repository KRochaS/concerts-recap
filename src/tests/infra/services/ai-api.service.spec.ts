import { generateText, Output } from 'ai';
import {
  AI_EXTRACTION_INVALID_RESPONSE,
  AIApiService,
  CONCERT_TICKET_NOT_RECOGNIZED,
} from '@/infra/services/ai-api.service';

jest.mock('ai', () => ({
  generateText: jest.fn(),
  Output: {
    object: jest.fn((value) => value),
  },
}));

const mockedGenerateText = generateText as jest.MockedFunction<
  typeof generateText
>;
const mockedOutputObject = Output.object as jest.MockedFunction<
  typeof Output.object
>;

describe('AIApiService', () => {
  const imageUrl = 'https://example.com/ticket.jpg';
  let service: AIApiService;

  beforeEach(() => {
    mockedGenerateText.mockReset();
    mockedOutputObject.mockClear();
    service = new AIApiService();
  });

  it('should reject an image that is not a concert ticket', async () => {
    mockedGenerateText.mockResolvedValueOnce({ text: 'no' } as never);

    await expect(service.extractConcertDataFromImage(imageUrl)).rejects.toThrow(
      CONCERT_TICKET_NOT_RECOGNIZED
    );
    expect(mockedGenerateText).toHaveBeenCalledTimes(1);
  });

  it('should classify and extract concert data from a ticket image', async () => {
    mockedGenerateText
      .mockResolvedValueOnce({ text: 'yes' } as never)
      .mockResolvedValueOnce({
        output: {
          date: '2026-03-01T21:00:00Z',
          artist: 'Artist',
          venue: 'Venue',
          city: 'City',
        },
      } as never);

    await expect(
      service.extractConcertDataFromImage(imageUrl)
    ).resolves.toEqual({
      date: new Date('2026-03-01T21:00:00Z'),
      artist: 'Artist',
      venue: 'Venue',
      city: 'City',
    });
    expect(mockedGenerateText).toHaveBeenCalledTimes(2);
    expect(mockedOutputObject).toHaveBeenCalledTimes(1);
  });

  it('should reject an invalid structured response', async () => {
    mockedGenerateText
      .mockResolvedValueOnce({ text: 'yes' } as never)
      .mockResolvedValueOnce({
        output: {
          date: 'invalid-date',
          artist: 'Artist',
          venue: 'Venue',
          city: 'City',
        },
      } as never);

    await expect(service.extractConcertDataFromImage(imageUrl)).rejects.toThrow(
      AI_EXTRACTION_INVALID_RESPONSE
    );
  });

  it('should reject a response with an implausible date year', async () => {
    mockedGenerateText
      .mockResolvedValueOnce({ text: 'yes' } as never)
      .mockResolvedValueOnce({
        output: {
          date: '2707-07-27T00:00:00Z',
          artist: 'Artist',
          venue: 'Venue',
          city: 'City',
        },
      } as never);

    await expect(service.extractConcertDataFromImage(imageUrl)).rejects.toThrow(
      AI_EXTRACTION_INVALID_RESPONSE
    );
  });

  it('should propagate provider errors', async () => {
    mockedGenerateText.mockRejectedValueOnce(new Error('PROVIDER_ERROR'));

    await expect(service.extractConcertDataFromImage(imageUrl)).rejects.toThrow(
      'PROVIDER_ERROR'
    );
  });
});
