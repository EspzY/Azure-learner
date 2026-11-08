import { expect, type Locator, type Page } from '@playwright/test';
import { laboratoryV3Nb as c, nb } from '../../src/content/nb';

/** Use the actual shared Portal drawer; opening it never starts a technical operation. */
export async function revealLaboratoryLink(page: Page, link: Locator) {
  await expect(page.locator('[data-portal-mode="laboratory"]:visible')).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: c.loading })).toHaveCount(0);
  const nav = page.getByRole('navigation', { name: c.navigation, exact: true });
  if (!(await nav.isVisible()))
    await page.getByRole('button', { name: nb.portal.menu, exact: true }).click();
  await expect(link).toBeVisible();
}

export async function closeLaboratoryDrawer(page: Page) {
  if ((await page.evaluate(() => innerWidth)) <= 1100) {
    await page.keyboard.press('Escape');
    const nav = page.locator('aside[data-portal-component="navigation"]');
    await expect(nav).not.toHaveClass(/mobile-open/);
    await expect(nav).not.toBeVisible();
  }
}
