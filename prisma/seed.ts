import { PrismaClient } from '@/generated/prisma/client';
import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';

const url = process.env.DATABASE_URL ?? '';
const prisma = url
  ? new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) })
  : undefined;

const artists = [
  'Arctic Monkeys',
  'The 1975',
  'Billie Eilish',
  'Radiohead',
  'Taylor Swift',
  'Bad Bunny',
  'Coldplay',
  'Red Hot Chili Peppers',
  'The Weeknd',
  'Kendrick Lamar',
];

const venues = [
  'O2 Apollo',
  'The O2',
  'Madison Square Garden',
  'Wembley Stadium',
  'Barclays Center',
  'Resorts World Arena',
  'Arena Birmingham',
  'Manchester Arena',
];

const cities = [
  'Manchester',
  'London',
  'Birmingham',
  'Liverpool',
  'Glasgow',
  'New York',
  'Los Angeles',
  'Chicago',
];

function buildConcertMemory() {
  const artist = faker.helpers.arrayElement(artists);
  const venue = faker.helpers.arrayElement(venues);
  const city = faker.helpers.arrayElement(cities);
  const date = faker.date.past({ years: 2 });

  const description = faker.lorem.paragraph();
  const kmTraveled = faker.number.int({ min: 1, max: 1500 });

  return {
    artist,
    venue,
    city,
    date,
    description,
    kmTraveled,
  };
}

export async function seedDatabase() {
  if (!prisma) return;

  const count = Number(process.env.E2E_SEED_COUNT ?? 20);
  await prisma.concertMemory.deleteMany();

  const data = Array.from({ length: count }, () => buildConcertMemory());
  await prisma.concertMemory.createMany({ data });
  await prisma.$disconnect();
}

export async function cleanDatabase() {
  if (!prisma) return;

  await prisma.concertMemory.deleteMany();
  await prisma.$disconnect();
}

async function main() {
  await seedDatabase();
}

main().catch(() => {
  process.exit(1);
});
