import { expect, type Page, type Locator } from '@playwright/test';
import { nb } from '../../src/content/nb';
export async function revealPortalLink(page: Page, link: Locator) {
  const nav = page.getByRole('navigation', { name: nb.portal.navLabel, exact: true });
  if (!(await nav.isVisible()))
    await page.getByRole('button', { name: nb.portal.menu, exact: true }).click();
  if (!(await link.isVisible())) await nav.locator('.portal-learning-tools > summary').click();
  await expect(link).toBeVisible();
}
export async function editAppSetting(page: Page, label: string, value: string) {
  await page
    .getByRole('row')
    .filter({ hasText: label })
    .getByRole('button', { name: nb.portalUi.edit, exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: nb.portalUi.editSetting, exact: true });
  await dialog.getByRole('combobox', { name: label, exact: true }).selectOption(value);
  await dialog.getByRole('button', { name: nb.portalUi.saveDraft, exact: true }).click();
  await expect(dialog).toHaveCount(0);
}
