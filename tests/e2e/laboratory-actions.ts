import { expect, type Locator, type Page } from '@playwright/test';
import { laboratoryV3Nb as c, nb } from '../../src/content/nb';

/** Use the actual shared Portal drawer; opening it never starts a technical operation. */
export async function revealLaboratoryLink(page: Page, link: Locator) {
  const nav = page.getByRole('navigation', { name: c.navigation, exact: true });
  if (!(await nav.isVisible()))
    await page.getByRole('button', { name: nb.portal.menu, exact: true }).click();
  await expect(link).toBeVisible();
}

export async function closeLaboratoryDrawer(page: Page) {
  if ((await page.evaluate(() => innerWidth)) <= 1100) {
    const toggle = page.getByRole('button', { name: nb.portal.menu, exact: true });
    if ((await toggle.getAttribute('aria-expanded')) === 'true') await toggle.click();
  }
}
