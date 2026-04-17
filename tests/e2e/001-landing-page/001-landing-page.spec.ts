import { test, expect } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

test('Landing page shows Tavli - Plakoto', async ({ page }, testInfo) => {
  const tester = new TestStepHelper(page, testInfo);
  tester.setMetadata('Landing Page', 'Verify that the landing page loads and shows the correct title.');

  await page.goto('/');

  await tester.step('landing-page-loaded', {
    description: 'Landing Page Loaded',
    verifications: [
      { spec: 'Title is visible', check: async () => await expect(page.locator('h1')).toHaveText('Tavli - Plakoto') }
    ]
  });

  tester.generateDocs();
});
