# End-to-End Testing Guide: Tavli Digital Café

## Philosophy: "Zero-Pixel Tolerance"

We follow a "Zero-Pixel Tolerance" approach to E2E testing. This means that every step of a user scenario must be visually verified against a baseline snapshot. Our goal is to ensure that the application not only *functions* correctly but *looks* exactly as intended at every point in the user journey.

## Core Requirements

1.  **Fast Feedback**: Tests must be reliable and fast. We enforce a maximum timeout of **2000ms** for any individual action or assertion.
2.  **No `waitForTimeout`**: Use of `page.waitForTimeout()` or `setTimeout` is strictly forbidden. Use Playwright's built-in web-first assertions or specific state-based waits.
3.  **Visual Snapshots**: Every logical step in a scenario must capture a visual snapshot.
4.  **Numbered Scenarios**: Scenarios are organized in `tests/e2e/` using a 3-digit prefix (e.g., `001-login-flow/`, `002-gameplay-portes/`).

## Implementation: `TestStepHelper`

We use a `TestStepHelper` pattern to keep our tests clean and consistent. This helper encapsulates the boilerplate of capturing screenshots and managing step numbers.

### Example Scenario Structure

```typescript
// tests/e2e/001-matchmaking/001-scenario.spec.ts
import { test, expect } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

test('Player can create and join a match', async ({ page }) => {
    const helper = new TestStepHelper(page, '001-matchmaking');

    // Step 0: Initial Landing
    await page.goto('/');
    await helper.snapshot('landing-page-loaded');

    // Step 1: Create Match
    await page.click('button:has-text("Create Match")');
    await expect(page.locator('.match-id')).toBeVisible({ timeout: 2000 });
    await helper.snapshot('match-created');

    // Step 2: ...
});
```

## Scenario Organization

Each scenario directory should contain:
- `NNN-scenario.spec.ts`: The actual test code.
- `README.md`: A brief description of the scenario and its business value.
- `screenshots/`: (Git-ignored) Local storage for baseline and diff images.

## Best Practices

- **Atomic Tests**: Each test should focus on a single user goal.
- **Data Isolation**: Use unique identifiers or clean up Firestore state between runs.
- **Device Emulation**: Regularly run tests against mobile profiles to verify the PWA responsiveness.
- **Network Resilience**: Mock external API calls if they are not essential to the UI flow being tested (Firestore should generally be live or emulated).
