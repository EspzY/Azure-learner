import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function checkAccessibility(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    })),
  ).toEqual([]);
}

async function createGroup(page: Page) {
  await page.getByLabel('Navn på resource group', { exact: true }).fill('rg-azurelab-dev');
  await page.getByLabel('Region for metadata', { exact: true }).selectOption('norwayeast');
  await page.getByRole('button', { name: 'Opprett i simuleringen' }).click();
}
async function passCheck(page: Page) {
  await page.getByRole('radio', { name: 'Under en subscription', exact: true }).check();
  await page
    .getByRole('radio', { name: 'Nei, ressursens region velges separat', exact: true })
    .check();
  await page
    .getByRole('radio', {
      name: 'En tenant kan ha flere subscriptions; hver stoler på én tenant',
      exact: true,
    })
    .check();
  await page.getByRole('button', { name: 'Sjekk svarene' }).click();
}

test('playable loop, feedback, persistence and idempotent replay', async ({ page }) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:3000') && !request.url().startsWith('data:'))
      external.push(request.url());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: 'Åpne Azure-universet' }).click();
  await expect(page.getByRole('heading', { name: 'Alt har sin plass.' })).toBeVisible();
  await page.getByRole('button', { name: 'Listevisning', exact: true }).click();
  await page.getByRole('button', { name: 'Azure resource App Service', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'App Service', exact: true })).toBeVisible();
  await expect(page.locator('.inspector')).toContainText('West Europe');
  await expect(page.locator('.geography-note')).toContainText('Norway East');
  await createGroup(page);
  await expect(page.locator('.action-feedback')).toContainText('Oppdrag utført!');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('✦ 80 XP');
  await createGroup(page);
  await expect(page.locator('#creation-error')).toContainText('allerede');
  await page.getByRole('radio', { name: 'Direkte under en Azure-region', exact: true }).check();
  await page
    .getByRole('radio', { name: 'Ja, alle ressurser arver gruppens region', exact: true })
    .check();
  await page
    .getByRole('radio', { name: 'En subscription stoler på mange tenants samtidig', exact: true })
    .check();
  await page.getByRole('button', { name: 'Sjekk svarene' }).click();
  await expect(page.locator('.assessment-result')).toContainText('0 / 3');
  await expect(page.locator('.answer-feedback')).toHaveCount(3);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('✦ 80 XP');
  await page.getByRole('button', { name: 'Prøv på nytt' }).click();
  await passCheck(page);
  await expect(page.locator('.assessment-result')).toContainText('3 av 3 riktige');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('✦ 120 XP');
  await checkAccessibility(page);
  await page.reload();
  await expect(page.locator('.topbar .xp-pill')).toHaveText('✦ 120 XP');
  await page.getByRole('button', { name: 'Nullstill simulering' }).click();
  await createGroup(page);
  await passCheck(page);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('✦ 120 XP');
  await page.getByRole('link', { name: 'Fremgang', exact: true }).click();
  await expect(page.locator('.milestone-list > div')).toHaveCount(2);
  await expect(page.getByText('Ikke vurdert', { exact: true })).toBeVisible();
  await expect(page.getByText('Ikke beregnet', { exact: true })).toBeVisible();
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('graph keyboard interaction, responsive layout, reduced motion and accessibility', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/explore');
  const node = page.getByRole('button', {
    name: 'Microsoft Entra tenant AzureLab Directory',
    exact: true,
  });
  await node.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'AzureLab Directory', exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('architecture-map.png'), fullPage: true });
  await checkAccessibility(page);
  await page.getByRole('button', { name: 'Listevisning', exact: true }).click();
  await expect(page.locator('.scope-list button')).toHaveCount(8);
  await expect(page.getByRole('button', { name: 'Sjekk svarene' })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('explore.png'), fullPage: true });
  await checkAccessibility(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  for (const [route, label] of [
    ['/', 'dashboard'],
    ['/missions', 'missions'],
    ['/progress', 'progress'],
  ]) {
    await page.goto(route!);
    await page.screenshot({ path: testInfo.outputPath(`${label}.png`), fullPage: true });
    await checkAccessibility(page);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});

test('corrupted and unavailable storage remain usable; deletion is explicit', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('azurelab.progress.v1', '{broken'));
  await page.goto('/progress');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('✦ 0 XP');
  await page.getByRole('button', { name: 'Slett lokal fremgang', exact: true }).click();
  await page.getByRole('button', { name: 'Behold fremgangen', exact: true }).click();
  await page.getByRole('button', { name: 'Slett lokal fremgang', exact: true }).click();
  await page.getByRole('button', { name: 'Slett fremgangen nå', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Lokal fremgang er slettet.');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/explore');
  await expect(page.getByRole('status')).toContainText('tillater ikke lokal lagring');
  await createGroup(page);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('✦ 80 XP');
});
