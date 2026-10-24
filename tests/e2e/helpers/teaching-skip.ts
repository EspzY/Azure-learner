import type { Page } from '@playwright/test';
import { nb } from '../../../src/content/nb';
// Existing regression flows explicitly choose the experienced skip, preserving their assertions.
// living-learning.spec.ts separately exercises real timed playback and complete teaching controls.
export async function installTeachingSkip(page: Page) {
  const skip = page.getByRole('button', { name: nb.teaching.skip, exact: true });
  await page.addLocatorHandler(skip, async () => {
    await skip.click();
  });
}
