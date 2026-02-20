import { CreateConcertUseCase } from '@/core/application/concerts/create-concert.usecase';
import { ConcertRepository } from '@/core/domain/concerts/concerts.repository';
import { createConcertPayload } from '@/tests/mocks/data-providers/create-concert-action.data-provider';

const makeRepository = (overrides: Partial<ConcertRepository>) => {
  const base = {
    create: jest.fn(async () => undefined),
  };

  return { ...base, ...overrides } as ConcertRepository;
};

describe('Create Concert Use Case', () => {
  it('should create a concert when there is no duplicate', async () => {
    const repository = makeRepository({
      findByConcert: jest.fn().mockResolvedValue(null),
    });
    const useCase = new CreateConcertUseCase(repository);
    const input = createConcertPayload();

    await expect(useCase.execute(input)).resolves.toBeUndefined();
    expect(repository.create).toHaveBeenCalledWith(input);
  });

  it('should throw an error when there is a duplicate', async () => {
    const repository = makeRepository({
      findByConcert: jest.fn().mockResolvedValue(createConcertPayload()),
    });
    const useCase = new CreateConcertUseCase(repository);
    const input = createConcertPayload();

    await expect(useCase.execute(input)).rejects.toThrow(
      'CONCERT_ALREADY_EXISTS'
    );
    expect(repository.create).not.toHaveBeenCalled();
  });
});
