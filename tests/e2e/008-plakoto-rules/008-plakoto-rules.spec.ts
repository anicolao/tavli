import { test, expect } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

test('Plakoto rules: No doubling cube, pinning works, and mother checker win', async ({ page }, testInfo) => {
  const tester = new TestStepHelper(page, testInfo);
  tester.setMetadata('Plakoto Rules', 'Verify Plakoto-specific rules and UI cleanup.');

  await page.goto('/');

  await tester.step('no-doubling-cube', {
    description: 'Verify no doubling cube is present',
    verifications: [
      { 
        spec: 'No doubling cube text', 
        check: async () => {
            const content = await page.content();
            expect(content.toLowerCase()).not.toContain('doubling');
            expect(content.toLowerCase()).not.toContain('cube');
        } 
      }
    ]
  });

  await tester.step('pinning-mechanic', {
    description: 'Verify pinning mechanic',
    verifications: [
      {
        spec: 'Can pin an opponent checker',
        check: async () => {
            // Setup state for pinning
            await page.evaluate(() => {
                const { store } = window as any;
                const board = Array.from({ length: 24 }, () => []);
                board[10] = [1]; // P1 at index 10
                board[8] = [2];  // P2 at index 8
                store.dispatch({ 
                    type: 'game/setGameState', 
                    payload: { board, turn: 2, dice: [2], movesRemaining: [2], winner: null }
                });
            });

            // P2 (Dark) moves forward: 8 + 2 = 10.
            const point8 = page.locator('[data-index="8"]');
            const point10 = page.locator('[data-index="10"]');
            
            await point8.click();
            await expect(point10).toHaveClass(/highlight/);
            await point10.click();
            
            const point10Content = await page.evaluate(() => {
                const { store } = window as any;
                return store.getState().game.board[10];
            });
            expect(point10Content).toEqual([1, 2]);
        }
      },
      {
        spec: 'Cannot move pinned checker',
        check: async () => {
            // Now it's P1's turn (after P2 move)
            // But let's force it to be P1's turn if it didn't change automatically
            await page.evaluate(() => {
                const { store } = window as any;
                store.dispatch({ 
                    type: 'game/setGameState', 
                    payload: { turn: 1, dice: [1], movesRemaining: [1] }
                });
            });
            
            // Point 10 has [1, 2]. P1 is on bottom. Top is 2.
            // P1 cannot move from point 10 because they are not on top.
            const point10 = page.locator('[data-index="10"]');
            await point10.click();
            
            // Should NOT be highlighted anywhere
            const highlightCount = await page.locator('.highlight').count();
            expect(highlightCount).toBe(0);
        }
      }
    ]
  });

  await tester.step('mother-checker-win', {
    description: 'Verify Mother Checker win condition',
    verifications: [
      {
        spec: 'P2 wins by pinning P1 mother checker',
        check: async () => {
            await page.evaluate(() => {
                const { store } = window as any;
                const board = Array.from({ length: 24 }, () => []);
                board[23] = [1]; // P1 mother checker at index 23
                board[21] = [2]; // P2 checker nearby at index 21
                store.dispatch({ 
                    type: 'game/setGameState', 
                    payload: { 
                        board, 
                        turn: 2, 
                        dice: [2], 
                        movesRemaining: [2],
                        checkersOff: { 1: 0, 2: 0 },
                        winner: null
                    }
                });
            });

            const point21 = page.locator('[data-index="21"]');
            const point23 = page.locator('[data-index="23"]');
            
            await point21.click();
            await point23.click();
            
            const winner = await page.evaluate(() => {
                const { store } = window as any;
                return store.getState().game.winner;
            });
            expect(winner).toBe(2);
            
            await expect(page.locator('.winner')).toContainText('Player Dark Wins');
        }
      }
    ]
  });

  tester.generateDocs();
});
