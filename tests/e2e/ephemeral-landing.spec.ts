import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing launches actual 3.7 Laboratory without a database, then returns to root', async ({ page }) => {
  // Explicitly simulate an unavailable persistent backend, not a fabricated World.
  await page.route('**/api/laboratory/state', async (route) => {
    await route.fulfill({ status: 503, contentType: 'application/json',
      body: JSON.stringify({ error: 'backend-unavailable' }) });
  });
  await page.goto('/');
  const sandbox = page.getByRole('link', { name: 'Åpne fri Sandbox', exact: true });
  await expect(sandbox).toHaveAttribute('href', '/labs/laboratory');
  await sandbox.click();
  await expect(page).toHaveURL('/labs/laboratory');
  const temporary = page.getByRole('button', { name: 'Start midlertidig Sandbox uten lagring' });
  await expect(temporary).toBeVisible();
  await temporary.click();
  await expect(page.getByText('Midlertidig – ingen lagring')).toBeVisible();
  await page.getByRole('button', { name: 'Ny ressursgruppe' }).click();
  await page.getByRole('textbox', { name: /^Name/ }).fill('rg-preview-memory');
  await page.getByRole('button', { name: 'Se gjennom' }).click();
  await page.locator('.lab-review').getByRole('button', { name: 'Opprett' }).click();
  await expect(page.getByRole('heading', { name: 'rg-preview-memory' })).toBeVisible();
  await page.getByRole('link', { name: 'Til forsiden' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'AzureLab' })).toBeVisible();
  await sandbox.click();
  await expect(page.getByRole('heading', { name: 'rg-preview-memory' })).toBeVisible();
  await page.reload();
  await expect(temporary).toBeVisible();
  await expect(page.getByRole('heading', { name: 'rg-preview-memory' })).toHaveCount(0);
});
test('course navigation keeps guided origins separate while making free Lab discoverable', async ({ page }) => {
  await page.goto('/learn');
  await expect(page.getByRole('link', { name: 'Åpne fri Sandbox' })).toHaveAttribute(
    'href', '/labs/laboratory',
  );
  await page.getByRole('link', { name: 'Til forsiden' }).click();
  await expect(page).toHaveURL('/');
  await page.goto('/portal');
  await expect(page.getByRole('link', { name: 'Til forsiden' })).toBeVisible();
  await page.getByRole('link', { name: 'Til forsiden' }).click();
  await expect(page).toHaveURL('/');
});
test('compact landing is readable with keyboard access and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 500 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.landing-course')).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'Åpne fri Sandbox' })).toBeVisible();
  await page.getByRole('link', { name: 'Åpne fri Sandbox' }).focus();
  await expect(page.getByRole('link', { name: 'Åpne fri Sandbox' })).toBeFocused();
  const violations = await new AxeBuilder({ page }).analyze();
  expect(violations.violations).toEqual([]);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
