import { test, expect, type Page } from '@playwright/test';
import Axe from '@axe-core/playwright';
import { startTemporary, service, create, courseBytes, c } from './ephemeral-actions';
import { nb } from '../../src/content/nb';
import { architectureStudioNb as studio } from '../../src/content/architecture-studio-nb';
import { start as missionStart, create as courseCreate, returnCourse } from './vm-debrief-actions';
import { revealPortalLink } from './portal-actions';
import { revealLaboratoryLink, closeLaboratoryDrawer } from './laboratory-actions';
const p = nb.portal;
async function home(page: Page, mode: 'course' | 'laboratory') {
  const link = page
    .locator('.portal-nav nav')
    .getByRole('link', { name: p.areas.home, exact: true });
  if (mode === 'course') await revealPortalLink(page, link);
  else await revealLaboratoryLink(page, link);
  await link.click();
  if (mode === 'laboratory') await closeLaboratoryDrawer(page);
  await expect(page.locator('[data-portal-component="home"]')).toBeVisible();
}
async function scope(page: Page, name: string) {
  await service(page, p.areas.subscriptions);
  await page
    .locator('[data-portal-component="subscriptions"]')
    .getByRole('link', { name, exact: true })
    .click();
  await expect(page.locator('[data-portal-component="subscription-details"]')).toBeVisible();
}
test('free shared Home subscriptions scoped creation Properties resources Studio and recent navigation use real temporary evidence without inspection writes', async ({
  page,
}, info) => {
  const commands: string[] = [];
  page.on('request', (r) => {
    if (
      r.url().endsWith('/api/laboratory/ephemeral') &&
      r.method() === 'POST' &&
      r.postDataJSON().action === 'command'
    )
      commands.push(r.postData()!);
  });
  await startTemporary(page);
  await expect(page.locator('[data-portal-component="home"]')).toBeVisible();
  await expect(page.locator('[data-guide]')).toHaveCount(0);
  const before = await courseBytes(page);
  await scope(page, 'App Sandbox');
  await page.screenshot({ path: info.outputPath('free-subscription-before-create.png') });
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await expect(page.getByLabel(c.subscription, { exact: true })).toHaveValue('sub-app');
  await page.getByLabel(c.name, { exact: true }).fill('rg-shared-home');
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await page
    .getByRole('region', { name: c.review, exact: true })
    .getByRole('button', { name: c.create, exact: true })
    .click();
  await expect(page.locator('.portal-title h1')).toHaveText('rg-shared-home');
  await service(page, c.accounts);
  const made = await create(page, c.newAccount, { name: 'sharedhomeaccount72' });
  expect(made.world.groups[0]!.subscriptionId).toBe('sub-app');
  const original = JSON.stringify(made.entries);
  await page
    .getByRole('navigation', { name: 'sharedhomeaccount72 · Overview', exact: true })
    .getByRole('button', { name: nb.portalUi.properties, exact: true })
    .click();
  await expect(page.getByRole('link', { name: c.receipt, exact: true })).toHaveAttribute(
    'href',
    new RegExp(made.receipt.commandId),
  );
  await service(page, p.areas.resources);
  await expect(page.locator('table')).toContainText('sharedhomeaccount72');
  const count = commands.length;
  await service(page, studio.title);
  await expect(page.locator('.architecture-studio')).toBeVisible();
  await home(page, 'laboratory');
  await expect(page.locator('[data-portal-component="home"] table')).toContainText(
    'sharedhomeaccount72',
  );
  await scope(page, 'Shared Sandbox');
  await expect(page.locator('[data-portal-component="subscription-details"]')).not.toContainText(
    'rg-shared-home',
  );
  await page.goBack();
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas.subscriptions);
  await page.goForward();
  await expect(page.locator('.portal-title h1')).toHaveText('Shared Sandbox');
  expect(commands).toHaveLength(count);
  expect(await courseBytes(page)).toBe(before);
  await service(page, c.history);
  await expect(page.locator('table tbody tr')).toHaveCount(made.entries.length);
  expect(JSON.stringify(made.entries)).toBe(original);
  await page.screenshot({ path: info.outputPath('free-original-history.png') });
});
test('guided course uses the same Home catalogue and subscriptions while actual v2 task and exact return retain original authority', async ({
  page,
}, info) => {
  await missionStart(page, 'infrastructure');
  await home(page, 'course');
  await expect(page.locator('.mission-coach')).toBeVisible();
  await expect(page.locator('.mission-coach')).toContainText('SavvyShark');
  const nav = page.getByRole('navigation', { name: p.navLabel, exact: true });
  await nav.getByRole('link', { name: p.areas.subscriptions, exact: true }).click();
  await page
    .locator('[data-portal-component="subscriptions"]')
    .getByRole('link', { name: 'Shared Sandbox', exact: true })
    .click();
  await expect(page.locator('[data-portal-component="subscription-details"]')).toBeVisible();
  await page.screenshot({ path: info.outputPath('course-subscription.png') });
  await courseCreate(page, 'group', 'rg-shared-course', 'sub-shared', 'norwayeast');
  await home(page, 'course');
  await expect(page.locator('[data-portal-component="home"] table')).toContainText(
    'rg-shared-course',
  );
  await expect(nav.getByRole('link', { name: 'Storage accounts', exact: true })).toHaveCount(0);
  await expect(nav.getByRole('link', { name: p.areas.apps, exact: true })).toBeVisible();
  await returnCourse(page, 'infrastructure');
});
test('persistent shared Home subscriptions reload and isolated sessions read the same committed World without new history', async ({
  page,
  browser,
}, info) => {
  await page.goto('/labs/laboratory');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.locator('[data-portal-component="home"]')).toBeVisible();
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await page.getByLabel(c.name, { exact: true }).fill('rg-shared-persistent');
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await page
    .getByRole('region', { name: c.review, exact: true })
    .getByRole('button', { name: c.create, exact: true })
    .click();
  await expect(page.locator('.portal-title h1')).toHaveText('rg-shared-persistent');
  const before = await (await page.request.get('/api/laboratory/state')).json();
  await scope(page, 'Shared Sandbox');
  await expect(page.locator('[data-portal-component="subscription-details"]')).toContainText(
    'rg-shared-persistent',
  );
  await page.reload();
  await expect(page.locator('[data-portal-component="subscription-details"]')).toContainText(
    'rg-shared-persistent',
  );
  const after = await (await page.request.get('/api/laboratory/state')).json();
  expect(after).toEqual(before);
  const isolated = await browser.newContext({ baseURL: info.project.use.baseURL });
  expect((await isolated.request.get('/api/laboratory/state')).status()).toBe(401);
  await isolated.close();
});
test('historical free 3.0 has common Home and subscription discovery without advertising newer model operations', async ({
  page,
}) => {
  await page.goto('/labs/laboratory');
  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })
    .selectOption('laboratory@3.0.0');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.locator('[data-portal-component="home"]')).toBeVisible();
  await service(page, p.areas.services);
  const directory = page.locator('[data-portal-component="service-directory"]');
  await expect(directory.getByRole('link', { name: c.accounts, exact: true })).toBeVisible();
  await expect(directory.getByRole('link', { name: p.areas.vms, exact: true })).toHaveCount(0);
  await expect(directory.getByRole('link', { name: p.areas.apps, exact: true })).toHaveCount(0);
  await scope(page, 'App Sandbox');
  await expect(page.locator('[data-portal-component="subscription-details"]')).toContainText(
    'sub-app',
  );
});
test('shared Home subscriptions compact keyboard focus reduced motion Axe and short desktop stay readable in both modes', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startTemporary(page);
  for (const [width, height] of [
    [1440, 900],
    [1024, 768],
    [1024, 500],
    [800, 700],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await home(page, 'laboratory');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect((await new Axe({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`free-home-${width}-${height}.png`) });
  }
  const first = page
    .locator('.portal-home-services')
    .getByRole('link', { name: p.areas.subscriptions, exact: true });
  await first.focus();
  await expect(first).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-portal-component="subscriptions"]')).toBeVisible();
  expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('free-subscriptions-short.png') });
  await service(page, p.areas.services);
  expect(
    await page
      .locator('[data-portal-component="service-directory"] [data-icon]')
      .evaluateAll((icons) => icons.every((icon) => icon.getBoundingClientRect().width <= 22)),
  ).toBe(true);
  await page.goto('/portal');
  await expect(page.locator('[data-portal-component="home"]')).toBeVisible();
  expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  const link = page
    .locator('.portal-home-services')
    .getByRole('link', { name: p.areas.subscriptions, exact: true });
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-portal-component="subscriptions"]')).toBeVisible();
  await page
    .locator('[data-portal-component="subscriptions"]')
    .getByRole('link', { name: 'Shared Sandbox', exact: true })
    .click();
  await expect(page.locator('[data-portal-component="subscription-details"]')).toBeVisible();
  expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('course-subscription-short.png') });
});
