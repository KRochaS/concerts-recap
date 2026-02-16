import { ConcertSummary } from '@/core/domain/concerts';
import { ConcertRepository } from '@/core/domain/concerts/concerts.repository';
import { PrismaClient } from '@/generated/prisma/client';

const CONCERT_SELECT = {
  id: true,
  artist: true,
  venue: true,
  city: true,
  date: true,
  setlistRating: true,
  kmTraveled: true,
};

export class PrismaConcertRepository implements ConcertRepository {
  constructor(private prisma: PrismaClient) {}

  async findManySummaries(): Promise<ConcertSummary[]> {
    const concerts = await this.prisma.concertMemory.findMany({
      select: CONCERT_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    return concerts;
  }

  async searchManySummaries(term: string): Promise<ConcertSummary[]> {
    const query = term.trim() ?? '';
    const concerts = await this.prisma.concertMemory.findMany({
      where: query
        ? {
            OR: [
              { artist: { contains: query, mode: 'insensitive' } },
              { venue: { contains: query, mode: 'insensitive' } },
              { city: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      select: CONCERT_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    return concerts;
  }
}
