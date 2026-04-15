import { test, expect } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

test('Board layout shows four quadrants and a central bar', async ({ page }, testInfo) => {
  const tester = new TestStepHelper(page, testInfo);
  tester.setMetadata('Board Layout', 'Verify that the board uses a four-quadrant grid layout with a central bar.');

  await page.goto('/');

  await tester.step('board-layout-verified', {
    description: 'Board Layout Verified',
    verifications: [
      { spec: 'Board container is visible', check: async () => await expect(page.locator('.board')).toBeVisible() },
      { spec: 'Four quadrants are present', check: async () => {
          await expect(page.locator('.quadrant.top-left')).toBeVisible();
          await expect(page.locator('.quadrant.top-right')).toBeVisible();
          await expect(page.locator('.quadrant.bottom-left')).toBeVisible();
          await expect(page.locator('.quadrant.bottom-right')).toBeVisible();
      }},
      { spec: 'Central bar is present', check: async () => await expect(page.locator('.bar')).toBeVisible() }
    ]
  });

  tester.generateDocs();
});
