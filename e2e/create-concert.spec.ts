import { PrismaClient } from '@/generated/prisma/client';
import { test, expect, Page } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type ConcertFormData = {
  description: string;
  artist: string;
  venue: string;
  city: string;
};

async function fillConcertForm(page: Page, data: ConcertFormData) {
  await expect(page.getByTestId('description-input')).toBeVisible();
  await expect(page.getByTestId('date-input')).toBeVisible();
  await expect(page.getByTestId('artist-input')).toBeVisible();
  await expect(page.getByTestId('venue-input')).toBeVisible();
  expect(page.getByTestId('city-input')).toBeVisible();
  await page.fill('[data-testid="description-input"]', data.description);
  await page.getByTestId('artist-input').fill(data.artist);
  await page.getByTestId('venue-input').fill(data.venue);
  await page.getByTestId('city-input').fill(data.city);
}

async function selectDate(page: Page, date: Date) {
  const dateButton = page.getByTestId('date-input');
  await dateButton.click();
  const day = date.getUTCDate().toString();
  await page.getByText(day, { exact: true }).click();
  const expectedDate = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  await expect(dateButton).toHaveText(expectedDate);
}

test('should create a new concert with success', async ({
  page,
}: {
  page: Page;
}) => {
  await page.goto('/new-concert');
  const now = new Date();
  const formData: ConcertFormData = {
    description: `It was an unforgettable night filled with raw emotion and powerful melodies. ${Date.now()}`,
    artist: `The National ${Date.now()}`,
    venue: `Aragon Ballroom ${Date.now()}`,
    city: `Chicago ${Date.now()}`,
  };
  await fillConcertForm(page, formData);
  await selectDate(page, now);
  await page.getByText('NEXT').click();
  await expect(page.locator('text=Concert created successfully.')).toBeVisible({
    timeout: 15000,
  });
});

test('should validate duplicate concert', async ({ page }: { page: Page }) => {
  await page.goto('/new-concert');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = await new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  await prisma.concertMemory.deleteMany({
    where: { artist: { contains: 'E2E duplicate test' } },
  });
  const fixedDateISO = '2026-02-22T00:00:00.000Z';
  const fixedDate = new Date(fixedDateISO);
  const formData: ConcertFormData = {
    description: 'E2E duplicate test',
    artist: 'E2E duplicate test',
    venue: 'E2E duplicate test',
    city: 'E2E duplicate test',
  };
  await prisma.concertMemory.create({ data: { ...formData, date: fixedDate } });
  await prisma.$disconnect();
  await fillConcertForm(page, formData);
  await selectDate(page, fixedDate);
  await page.getByText('NEXT').click();
  await expect(
    page.locator(
      'text=Concert already exists. Please check the details and try again.'
    )
  ).toBeVisible({ timeout: 15000 });
});
