import { PrismaConcertRepository } from '@/infra/repository/prisma-concert.repository';
import { listConcertSummariesResponse } from '@/tests/mocks/data-providers/concert-summary.data-provider';
import { ConcertSummary } from '@/core/domain/concerts/concert.entity';
import { PrismaClient } from '@/generated/prisma/internal/class';
import { CreateConcertDTO } from '@/core/application/concerts/create-concert.dto';
import { createConcertPayload } from '@/tests/mocks/data-providers/create-concert-action.data-provider';

type ConcertDelegateMock = {
  create: jest.MockedFunction<
    (args: { data: CreateConcertDTO }) => Promise<void>
  >;
  findFirst: jest.MockedFunction<
    (args: {
      where: { artist: string; venue: string; city: string; date: Date };
      select?: Record<string, boolean>;
    }) => Promise<ConcertSummary | null>
  >;
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
      findFirst: jest.fn(),
      create: jest.fn(),
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

  describe('create', () => {
    it('should call prisma create with correct data', async () => {
      const data = createConcertPayload();

      await repository.create(data);

      expect(prisma.concertMemory.create).toHaveBeenCalledWith({
        data,
      });
    });
  });

  describe('findByConcert', () => {
    it('should call prisma findFirst with correct where clause and select', async () => {
      prisma.concertMemory.findFirst.mockResolvedValue(
        listConcertSummariesResponse()[0]
      );
      const data = createConcertPayload();

      const result = await repository.findByConcert(data);

      expect(prisma.concertMemory.findFirst).toHaveBeenCalledWith({
        where: {
          artist: data.artist,
          venue: data.venue,
          city: data.city,
          date: data.date,
        },
        select: mockSelect,
      });
      expect(result).toEqual(listConcertSummariesResponse()[0]);
    });
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
