import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import { retiredStorageKeys } from '../../src/domain/retired-storage';
import { applyEvent, freshAttempt } from '../../src/domain/chapter01/scenario';
import { chapterKey, snapshotOf } from '../../src/domain/chapter01/persistence';
import { freshLearning, applyLearning, learningKey } from '../../src/domain/curriculum/foundations';

const legacyAttempt = applyEvent(freshAttempt(), {
  kind: 'command',
  bindResult: false,
  request: {
    commandId: 'retained-old-group',
    expectedWorldRevision: 0,
    command: {
      type: 'CreateGroup',
      subscriptionId: 'sub-app',
      name: 'rg-retained-dev',
      metadataRegion: 'norwayeast',
    },
  },
})!;
const records = {
  [chapterKey]: JSON.stringify(snapshotOf(legacyAttempt, 1, 7)),
  [learningKey]: JSON.stringify(
    applyLearning(freshLearning(), { kind: 'visit', unit: 'capacity' }),
  ),
  'azurelab.progress.v1':
    '{"version":1,"completed":["organization-mission-v1","organization-check-v1"]}',
  'azurelab.rpg.g1.v1': '{old opaque game bytes',
  'azurelab.expedition.v1': '{"version":999,"doNotMigrate":true}',
  'azurelab.orientation.v1': 'historical preference',
  'azurelab.presentation.v1': '{"schema":999}',
};

test('retired bookmarks are fixed safe redirects into the current product', async ({ request }) => {
  for (const [route, target] of [
    ['/legacy/rpg', '/learn'],
    ['/expedition-3d', '/learn'],
    ['/legacy-expedition', '/learn'],
    ['/missions', '/learn'],
    ['/explore', '/portal'],
    ['/design/foundations-31a', '/learn/computing?topic=intro-request'],
  ]) {
    const response = await request.get(
      `${route}?return=https://example.invalid&goal=service&chapter=01`,
      { maxRedirects: 0 },
    );
    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe(target);
  }
});

test('current root, Journal and Portal preserve raw historical work without loading the retired game', async ({
  page,
}, info) => {
  const external: string[] = [],
    game: string[] = [],
    errors: string[] = [];
  page.on('request', (r) => {
    const url = new URL(r.url());
    if (url.origin !== new URL(info.project.use.baseURL!).origin) external.push(r.url());
    if (/\/game\/|\.(glb|wav)(\?|$)/.test(url.pathname)) game.push(r.url());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.evaluate((entries) => {
    for (const [key, raw] of Object.entries(entries)) localStorage.setItem(key, raw);
  }, records);
  await page.reload();
  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByRole('heading', { name: nb.course.title, exact: true })).toBeVisible();
  await expect(
    page.locator('a[href*="legacy"],a[href*="expedition"],a[href="/explore"],a[href="/missions"]'),
  ).toHaveCount(0);
  // The history shell retains the original Journal; the course-specific Journal is covered in course.spec.
  await page.goto('/progress');
  await page.getByRole('button', { name: nb.foundations.journal, exact: true }).click();
  const journal = page.getByRole('dialog', { name: nb.foundations.journal, exact: true });
  await expect(journal).toContainText(nb.foundations.units.capacity.mechanism);
  await journal.getByText(nb.official.label, { exact: true }).click();
  await expect(journal).toContainText(nb.official.path);
  await expect(journal).toContainText(nb.official.boundary);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(journal).toHaveCount(0);
  await page.goto('/portal?area=groups');
  await expect(page.getByRole('button', { name: 'rg-retained-dev', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'rg-retained-dev', exact: true }).click();
  await expect(page.locator('.portal-resource-overview')).toContainText('rg-retained-dev');
  await page.reload();
  await expect(page.locator('.portal-resource-overview')).toContainText('rg-retained-dev');
  await page.goto('/progress');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('120 XP');
  for (const [key, raw] of Object.entries(records))
    expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(raw);
  expect(external).toEqual([]);
  expect(game).toEqual([]);
  expect(errors).toEqual([]);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('historical data deletion stays explicit after renderer providers are retired', async ({
  page,
}) => {
  await page.goto('/progress');
  await page.evaluate((entries) => {
    for (const [key, raw] of Object.entries(entries)) localStorage.setItem(key, raw);
  }, records);
  await page.reload();
  await expect(page.locator('.topbar .xp-pill')).toHaveText('120 XP');
  await page.getByRole('button', { name: nb.progress.reset, exact: true }).click();
  await page.getByRole('button', { name: nb.progress.cancel, exact: true }).click();
  for (const [key, raw] of Object.entries(records))
    expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(raw);
  await page.getByRole('button', { name: nb.progress.reset, exact: true }).click();
  await page.getByRole('button', { name: nb.progress.confirm, exact: true }).click();
  await expect(page.getByRole('status')).toHaveText(nb.progress.resetDone);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
  for (const key of [...retiredStorageKeys, learningKey])
    expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBeNull();
  await page.reload();
  await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
  await page.goto('/portal?area=groups');
  await expect(page.getByRole('button', { name: 'rg-retained-dev', exact: true })).toHaveCount(0);
});

test('corrupt progress and denied storage remain usable without a legacy fallback', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('azurelab.progress.v1', '{broken'));
  await page.goto('/progress');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/');
  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByRole('heading', { name: nb.course.title, exact: true })).toBeVisible();
  await expect(page.locator('.storage-warning')).toContainText(nb.shell.storageError);
});
