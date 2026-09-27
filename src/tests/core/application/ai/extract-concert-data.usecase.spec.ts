import { ExtractConcertDataUseCase } from '@/core/application/ai/extract-concert-data.usecase';
import { AIService } from '@/core/domain/ai/ai.service';

const makeAIService = (overrides: Partial<AIService> = {}) => {
  const base: AIService = {
    extractConcertDataFromImage: jest.fn(),
  };

  return { ...base, ...overrides };
};

describe('Extract Concert Data Use Case', () => {
  it('should return the data extracted by the AI service', async () => {
    const imageUrl = 'https://example.com/ticket.jpg';
    const extractedData = {
      date: new Date('2026-03-01T21:00:00Z'),
      artist: 'Artist',
      venue: 'Venue',
      city: 'City',
    };
    const aiService = makeAIService({
      extractConcertDataFromImage: jest.fn().mockResolvedValue(extractedData),
    });
    const useCase = new ExtractConcertDataUseCase(aiService);

    await expect(useCase.execute(imageUrl)).resolves.toEqual(extractedData);
    expect(aiService.extractConcertDataFromImage).toHaveBeenCalledTimes(1);
    expect(aiService.extractConcertDataFromImage).toHaveBeenCalledWith(
      imageUrl
    );
  });

  it('should propagate errors from the AI service', async () => {
    const aiService = makeAIService({
      extractConcertDataFromImage: jest
        .fn()
        .mockRejectedValue(new Error('AI_SERVICE_ERROR')),
    });
    const useCase = new ExtractConcertDataUseCase(aiService);

    await expect(
      useCase.execute('https://example.com/ticket.jpg')
    ).rejects.toThrow('AI_SERVICE_ERROR');
  });
});
