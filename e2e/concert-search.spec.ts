import { PrismaClient } from '@/generated/prisma/client';
import { test, expect, Page } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';

test.describe('Search concerts', () => {
  test('should filter concerts list by term', async ({
    page,
  }: {
    page: Page;
  }) => {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    const prisma = new PrismaClient({ adapter });

    const uniqueTerm = `UniqueTerm ${Date.now()}`;
    await prisma.concertMemory.create({
      data: {
        artist: `Artist ${uniqueTerm}`,
        venue: 'Venue',
        city: 'City',
        date: new Date(),
        description: 'Description',
      },
    });

    await prisma.$disconnect();

    await page.goto('/concerts');

    const searchInput = page.getByTestId('search-input');
    expect(searchInput).toBeVisible();
    await searchInput.fill(uniqueTerm);

    await expect(page.getByText(uniqueTerm)).toBeVisible();
  });
});
