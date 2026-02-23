import { CreateConcertDTO } from '@/core/application/concerts/create-concert.dto';
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
  createdAt: true,
  updatedAt: true,
};

export class PrismaConcertRepository implements ConcertRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateConcertDTO): Promise<void> {
    await this.prisma.concertMemory.create({
      data: {
        artist: data.artist,
        venue: data.venue,
        city: data.city,
        date: data.date,
        description: data.description,
        ticketImageUrl: data.ticketImageUrl ?? null,
      },
    });
  }

  async findByConcert(data: CreateConcertDTO): Promise<ConcertSummary | null> {
    // Normaliza a data para UTC 00:00:00 e busca por registros no mesmo dia
    const inputDate = new Date(data.date);
    const startOfDay = new Date(
      Date.UTC(
        inputDate.getUTCFullYear(),
        inputDate.getUTCMonth(),
        inputDate.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const endOfDay = new Date(
      Date.UTC(
        inputDate.getUTCFullYear(),
        inputDate.getUTCMonth(),
        inputDate.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );
    const concert = await this.prisma.concertMemory.findFirst({
      where: {
        artist: data.artist,
        venue: data.venue,
        city: data.city,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: CONCERT_SELECT,
    });
    return concert;
  }

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
