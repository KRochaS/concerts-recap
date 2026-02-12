import { Concert, ConcertSummary } from '@/core/domain/concerts';
import { ConcertRepository } from '@/core/domain/concerts/concerts.repository';
import { PrismaClient } from '@/generated/prisma/client';

export class PrismaConcertRepository implements ConcertRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(): Promise<Concert[]> {
    const concerts = await this.prisma.concertMemory.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return concerts;
  }

  async searchMany(term: string): Promise<Concert[]> {
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
      orderBy: { createdAt: 'desc' },
    });
    return concerts;
  }

  async findManySummaries(): Promise<ConcertSummary[]> {
    const concerts = await this.prisma.concertMemory.findMany({
      select: {
        id: true,
        artist: true,
        venue: true,
        city: true,
        date: true,
        setlistRating: true,
        kmTraveled: true,
      },
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
      select: {
        id: true,
        artist: true,
        venue: true,
        city: true,
        date: true,
        setlistRating: true,
        kmTraveled: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return concerts;
  }
}
