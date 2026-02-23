import { test, expect, Page } from '@playwright/test';

test('should loading the initial page', async ({ page }: { page: Page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'Your concert recap,\nthoughts, and memories',
    })
  ).toBeVisible();
  await expect(
    page.getByText('Fill out your concert memories page with the best moments')
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'REGISTER CONCERTS' })
  ).toBeVisible();
});
