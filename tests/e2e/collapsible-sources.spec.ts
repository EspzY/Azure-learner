import { test, expect, chromium, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  nb,
  sourceDisclosureNb as c,
  refinedAssessmentNb as assessment,
  serverlessNb,
  architectureNb,
} from '../../src/content/nb';
import { securitySources } from '../../src/domain/curriculum/security-sources';
import { governanceSources } from '../../src/domain/curriculum/governance-sources';
import { toolsSources } from '../../src/domain/curriculum/management-tools-sources';
import { storageSources } from '../../src/domain/curriculum/storage-sources';
import { resilienceSources } from '../../src/domain/curriculum/storage-resilience-sources';
import { migrationSources } from '../../src/domain/curriculum/migration-sources';
import { costStudySources } from '../../src/domain/curriculum/cost-sources';
import {
  refinedKeys,
  refinedHref,
  refinedFacts,
  restoreRefined,
} from '../../src/domain/curriculum/refined-assessment';
const disclosure = (p: Page) => p.locator('details.source-disclosure');
async function settled(p: Page) {
  await p.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}
const raw = (p: Page) =>
  p.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(localStorage).sort())));
async function inspect(p: Page, scope: Locator, count?: number) {
  await expect(scope).not.toHaveAttribute('open', '');
  const entries = scope.locator('li[data-source-id]');
  if (count !== undefined) await expect(entries).toHaveCount(count);
  const n = await entries.count();
  await expect(scope.locator('summary')).toHaveText(`${c.title} (${n})`);
  await settled(p);
  const before = await raw(p);
  await scope.locator('summary').click();
  await expect(scope).toHaveAttribute('open', '');
  for (const a of await scope.locator('a').all()) {
    await expect(a).toBeVisible();
    await expect(a).toHaveAttribute('href', /^https:\/\//);
    await expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await scope.locator('summary').click();
  expect(await raw(p)).toBe(before);
}
test('Large Summary source banks and global Journal default closed with exact counts and preserved references', async ({
  page,
}) => {
  for (const [module, bank] of [
    ['security', securitySources],
    ['governance', governanceSources],
    ['management-tools', toolsSources],
  ] as const) {
    await page.goto(`/learn/${module}?topic=summary`);
    await expect(disclosure(page)).toHaveCount(1);
    await inspect(page, disclosure(page), Object.keys(bank).length);
    expect(await page.locator('.compute-sources > p').isVisible()).toBe(true);
  }
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('details.source-disclosure')).toHaveCount(1);
  await inspect(page, dialog.locator('details.source-disclosure'), 40);
  const rect = await dialog.boundingBox();
  expect(Math.abs(rect!.x + rect!.width / 2 - page.viewportSize()!.width / 2)).toBeLessThan(2);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: nb.course.journal, exact: true })).toBeFocused();
});
test('Storage A B C Cost and Compute keep complete Summary banks separate from topic sources', async ({
  page,
}) => {
  for (const [module, bank] of [
    ['storage', storageSources],
    ['storage-resilience', resilienceSources],
    ['migration', migrationSources],
  ] as const) {
    await page.goto(`/learn/${module}?topic=summary`);
    await inspect(page, disclosure(page), Object.keys(bank).length);
  }
  await page.goto('/learn/cost?topic=drivers');
  await inspect(page, disclosure(page), costStudySources.drivers.length);
  await page.goto('/learn/compute?topic=introduction');
  await expect(disclosure(page)).toHaveCount(1);
  await inspect(page, disclosure(page));
  await page.goto('/learn/compute?topic=summary');
  await inspect(page, disclosure(page));
});
test('Earlier Foundations Benefits Services Core Serverless and teaching Journal use the same source disclosure without hiding model limits', async ({
  page,
}) => {
  for (const route of [
    '/learn/computing?topic=intro-request',
    '/learn/benefits?topic=availability',
    '/learn/services?topic=overview&version=2',
    '/learn/computing?topic=serverless-summary',
    '/learn/architecture?topic=summary',
    '/learn/architecture?topic=core-summary',
  ]) {
    await page.goto(route);
    await expect(disclosure(page).first()).toBeVisible();
    for (const s of await disclosure(page).all()) await inspect(page, s);
  }
  await page.goto('/learn/computing?topic=serverless-summary');
  await expect(page.getByText(serverlessNb.boundary, { exact: true }).last()).toBeVisible();
  await page.goto('/learn/architecture?topic=summary');
  await expect(page.getByText(architectureNb.locationLimit, { exact: true }).last()).toBeVisible();
  for (const route of [
    '/learn/computing?topic=capacity&version=1',
    '/learn/services?topic=overview&version=1',
  ]) {
    await page.goto(route);
    await expect(disclosure(page).first()).toBeVisible();
    for (const source of await disclosure(page).all()) await inspect(page, source);
  }
  await page.goto('/learn');
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog').locator('details.source-disclosure').first()).toBeVisible();
  await expect(page.getByRole('dialog').locator('details.source-disclosure[open]')).toHaveCount(0);
});
test('Source disclosures never replace denied durable teaching boundaries or cross-tab protection for either new assessment version', async ({
  browser,
  baseURL,
}) => {
  for (const track of ['benefits', 'services'] as const) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(baseURL + refinedHref(track));
    await page.getByRole('button', { name: assessment.ui.start, exact: true }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: assessment.ui.confirm, exact: true })
      .click();
    const deny = (key: string) => {
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && JSON.parse(v).events?.at(-1)?.kind === 'aid')
          throw new DOMException('Denied', 'QuotaExceededError');
        return set.call(this, k, v);
      };
    };
    await page.addInitScript(deny, refinedKeys[track]);
    await page.evaluate(deny, refinedKeys[track]);
    const firstRaw = await page.evaluate((k) => localStorage.getItem(k), refinedKeys[track]);
    await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
    await expect(
      page.getByRole('dialog').getByText('Oppdatert', { exact: false }).first(),
    ).toBeVisible();
    await expect(page.getByRole('dialog').locator('details.source-disclosure')).toHaveCount(0);
    expect(await page.evaluate((k) => localStorage.getItem(k), refinedKeys[track])).toBe(firstRaw);
    await page.keyboard.press('Escape');
    await page.goto(baseURL + '/learn/security?topic=unknown-topic');
    await expect(disclosure(page)).toHaveCount(0);
    await expect(page.locator('.course-storage').first()).toBeVisible();
    expect(
      refinedFacts(
        restoreRefined(
          track,
          await page.evaluate((k) => localStorage.getItem(k), refinedKeys[track]),
        ).save,
      ).assisted,
    ).toBe(false);
    await context.close();
  }
  const context = await browser.newContext(),
    page = await context.newPage();
  await page.goto(baseURL + refinedHref('benefits'));
  await page.getByRole('button', { name: assessment.ui.start, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: assessment.ui.confirm, exact: true })
    .click();
  await page.goto(baseURL + '/learn/security?topic=summary');
  await disclosure(page).locator('summary').click();
  const other = await context.newPage();
  await other.goto(baseURL + refinedHref('benefits'));
  await other.locator('[data-refined-item="b-capacity"]').getByRole('textbox').fill('4');
  await expect(disclosure(page)).toHaveCount(0);
  await expect(page.locator('.course-storage').first()).toContainText('conflict');
  expect(
    refinedFacts(
      restoreRefined(
        'benefits',
        await other.evaluate((k) => localStorage.getItem(k), refinedKeys.benefits),
      ).save,
    ).first,
  ).toBeNull();
  await context.close();
});
test('Source desktop compact native keyboard short-height zoom reduced motion and Axe retain readable links and no evidence writes', async ({
  page,
  baseURL,
}) => {
  const initial = page.viewportSize()!;
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const size of [
    initial,
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(size);
    await page.goto('/learn/management-tools?topic=summary');
    const s = disclosure(page),
      summary = s.locator('summary');
    await expect(s).not.toHaveAttribute('open', '');
    await summary.focus();
    const before = await page.evaluate(() => scrollY);
    await page.keyboard.press('Space');
    await expect(s).toHaveAttribute('open', '');
    await expect(summary).toBeFocused();
    expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.keyboard.press('Enter');
    await expect(s).not.toHaveAttribute('open', '');
  }
  await page.setViewportSize(initial);
  await page.goto('/learn/management-tools?topic=summary');
  await disclosure(page).locator('summary').click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const zoom = await chromium.launchPersistentContext('', {
    channel: 'chromium',
    headless: true,
    viewport: null,
    deviceScaleFactor: undefined,
    args: ['--window-size=1440,900'],
  });
  try {
    const p = zoom.pages()[0]!;
    await p.goto('chrome://settings/appearance');
    await p.locator('select#zoomLevel').selectOption('2');
    await p.goto(baseURL + '/learn/security?topic=summary');
    expect(await p.evaluate(() => devicePixelRatio)).toBe(2);
    await disclosure(p).locator('summary').click();
    await disclosure(p).evaluate((el) => {
      for (const node of el.querySelectorAll<HTMLElement>('a,summary,small'))
        node.style.fontSize = parseFloat(getComputedStyle(node).fontSize) * 2 + 'px';
    });
    expect(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page: p }).analyze()).violations).toEqual([]);
  } finally {
    await zoom.close();
  }
});
