import { PrismaConcertRepository } from '@/infra/repository/prisma-concert.repository';
import { listConcertSummariesResponse } from '@/tests/mocks/data-providers/concert-summary.data-provider';
import { ConcertSummary } from '@/core/domain/concerts/concert.entity';
import { PrismaClient } from '@/generated/prisma/internal/class';

type ConcertDelegateMock = {
  findMany: jest.MockedFunction<
    (args: {
      select?: Record<string, boolean>;
      orderBy?: { createdAt: 'asc' | 'desc' };
      where?: {
        OR: Array<{
          artist: { contains: string; mode: 'insensitive' };
          venue: { contains: string; mode: 'insensitive' };
          city: { contains: string; mode: 'insensitive' };
        }>;
      };
    }) => Promise<ConcertSummary[]>
  >;
};

type PrismaMock = {
  concertMemory: ConcertDelegateMock;
};
function createMockPrisma() {
  const mock: PrismaMock = {
    concertMemory: {
      findMany: jest.fn(),
    },
  };
  return mock as never as PrismaClient & PrismaMock;
}

describe('PrismaConcertRepository', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let repository: PrismaConcertRepository;

  const mockSelect = {
    id: true,
    artist: true,
    venue: true,
    city: true,
    date: true,
    setlistRating: true,
    kmTraveled: true,
    createdAt: true,
    updatedAt: true,
  };

  beforeEach(() => {
    prisma = createMockPrisma();
    repository = new PrismaConcertRepository(prisma);
  });

  describe('findManySummaries', () => {
    it('should order by createdAt descending and map the data', async () => {
      const input = listConcertSummariesResponse();
      prisma.concertMemory.findMany.mockResolvedValue(input);

      const results = await repository.findManySummaries();

      expect(prisma.concertMemory.findMany).toHaveBeenCalledWith({
        select: mockSelect,
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toEqual(input);
    });
  });

  describe('searchManySummaries', () => {
    it('should not send a where clause when the search term is empty', async () => {
      const input = listConcertSummariesResponse();
      prisma.concertMemory.findMany.mockResolvedValue(input);

      const results = await repository.searchManySummaries('   ');

      expect(prisma.concertMemory.findMany).toHaveBeenCalledWith({
        where: undefined,
        select: mockSelect,
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });

    it('should search by term and populate the OR clause in the where filter', async () => {
      const input = listConcertSummariesResponse();
      prisma.concertMemory.findMany.mockResolvedValue(input);

      const results = await repository.searchManySummaries(' Artist 1  ');

      expect(prisma.concertMemory.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { artist: { contains: 'Artist 1', mode: 'insensitive' } },
            { venue: { contains: 'Artist 1', mode: 'insensitive' } },
            { city: { contains: 'Artist 1', mode: 'insensitive' } },
          ],
        },
        select: mockSelect,
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });
  });
});
