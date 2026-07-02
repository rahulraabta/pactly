import { test, expect } from '@playwright/test';

test('has dashboard route and correct title', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Wait for the main elements to load
  await expect(page.getByText('Active Projects')).toBeVisible();
  await expect(page.getByText('Recent Activity')).toBeVisible();
  
  // Assuming the hero amount is displayed
  await expect(page.locator('text=in unpaid milestones')).toBeVisible();
});
