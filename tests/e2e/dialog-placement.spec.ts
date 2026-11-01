import { test, expect, chromium, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { revealPortalLink } from './portal-actions';
import {
  nb,
  securityNb,
  securityItemsNb,
  storageNb,
  identityNb,
  monitoringNb,
  serverlessNb,
  labsNb,
} from '../../src/content/nb';
import { sandboxKey } from '../../src/domain/sandbox/store';
import { securityKey, securityFacts, securityItems } from '../../src/domain/curriculum/security';

const cases = [
  ['security', 'sp01', securityKey, securityNb],
  ['storage', 'sa01', 'azurelab.learning.storage-services.v1', storageNb],
  ['identity', 'if01', 'azurelab.learning.identity-foundations.v1', identityNb],
  ['monitoring', 'md01', 'azurelab.learning.monitoring-diagnostics.v1', monitoringNb],
] as const;
const raw = (p: Page, key = securityKey) => p.evaluate((k) => localStorage.getItem(k), key);
const ordinary = (p: Page) => p.locator('dialog.portal-dialog:not(.portal-side-panel)');
async function centered(p: Page, dialog: Locator) {
  await expect(dialog).toBeVisible();
  const b = await dialog.boundingBox();
  const v = await p.evaluate(() => ({ width: innerWidth, height: innerHeight }));
  expect(Math.abs(b!.x + b!.width / 2 - v.width / 2)).toBeLessThanOrEqual(1);
  expect(Math.abs(b!.y + b!.height / 2 - v.height / 2)).toBeLessThanOrEqual(1);
  expect(b!.x).toBeGreaterThanOrEqual(8);
  expect(b!.y).toBeGreaterThanOrEqual(8);
  expect(b!.x + b!.width).toBeLessThanOrEqual(v.width - 8);
  expect(b!.y + b!.height).toBeLessThanOrEqual(v.height - 8);
  expect(await dialog.evaluate((el) => el.matches(':modal'))).toBe(true);
}
async function focusedActionInside(dialog: Locator, action: Locator) {
  await action.focus();
  await expect(action).toBeFocused();
  const d = await dialog.boundingBox(),
    a = await action.boundingBox();
  expect(a!.y).toBeGreaterThanOrEqual(d!.y);
  expect(a!.y + a!.height).toBeLessThanOrEqual(d!.y + d!.height);
  await expect(action).toBeInViewport();
  expect(
    await action.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
    }),
  ).toBe(true);
}

for (const [module, item, key, copy] of cases) {
  test(`Dialog ${module}: centered native start at desktop and short heights preserves cancel Escape and no attempt`, async ({
    page,
  }) => {
    await page.goto(`/learn/${module}?topic=assessment&case=${item}`);
    const start = page
      .getByRole('button', { name: copy.assessment.start, exact: true })
      .and(page.locator('button:not(dialog *)'));
    await expect(start).toBeVisible();
    const saved = await raw(page, key),
      world = await raw(page, sandboxKey);
    for (const [width, height] of [
      [1440, 900],
      [1024, 768],
      [1024, 500],
    ]) {
      await page.setViewportSize({ width: width!, height: height! });
      await start.scrollIntoViewIfNeeded();
      const scroll = await page.evaluate(() => scrollY);
      await start.click();
      const dialog = page.getByRole('dialog', { name: copy.assessment.title, exact: true });
      await centered(page, dialog);
      await expect(dialog.locator('header button')).toBeFocused();
      const cancel = dialog.getByRole('button', { name: copy.labels.cancel, exact: true });
      await page.keyboard.press('Tab');
      await expect(cancel).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(dialog.locator('header button')).toBeFocused();
      await focusedActionInside(
        dialog,
        dialog.getByRole('button', { name: copy.assessment.start, exact: true }),
      );
      // showModal makes the underlying application inert even to explicit focus calls.
      await start.evaluate((el) => (el as HTMLElement).focus());
      expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
      if (height === 500)
        await expect.poll(() => dialog.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
      if (height === 900) expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      if (height === 768) await cancel.click();
      else await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(start).toBeFocused();
      expect(Math.abs((await page.evaluate(() => scrollY)) - scroll)).toBeLessThanOrEqual(2);
      expect(await raw(page, key)).toBe(saved);
      expect(await raw(page, sandboxKey)).toBe(world);
    }
  });
}

test('Global Journal centered keyboard scrolling title and focus return keep history unchanged', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learn/security?topic=introduction');
  await expect(page.locator('.security-lesson')).toBeVisible();
  const saved = await raw(page),
    button = page.getByRole('button', { name: nb.course.journal, exact: true });
  for (const [width, height] of [
    [1440, 900],
    [1024, 500],
    [800, 700],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await button.click();
    const dialog = page.getByRole('dialog', { name: nb.course.journal, exact: true });
    await centered(page, dialog);
    await expect(dialog.locator('header button')).toBeFocused();
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.locator('header button')).toBeFocused();
    await dialog.focus();
    await page.keyboard.press('End');
    await expect.poll(() => dialog.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(button).toBeFocused();
    expect(await raw(page)).toBe(saved);
  }
});

test('Portal ordinary modal side panels native briefings and guidance menu retain distinct desktop compact placement', async ({
  page,
}) => {
  await page.goto('/portal');
  await expect(page.locator('.portal-title h1')).toHaveText(nb.portal.areas.home);
  const nav = page.getByRole('navigation', { name: nb.portal.navLabel, exact: true });
  const groups = nav.getByRole('link', { name: nb.portal.areas.groups, exact: true });
  await revealPortalLink(page, groups);
  await groups.click();
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: nb.portal.create, exact: true })
    .click();
  await page.getByLabel(nb.portal.groupName, { exact: true }).fill('rg-modal44-preserved');
  await page
    .getByRole('combobox', { name: nb.portal.subscription, exact: true })
    .selectOption('sub-app');
  await page
    .getByRole('combobox', { name: nb.portal.region, exact: true })
    .selectOption('norwayeast');
  await page
    .locator('.portal-create-tabs')
    .getByRole('button', { name: nb.portal.review, exact: true })
    .click();
  await page.getByRole('button', { name: nb.portal.create, exact: true }).last().click();
  await expect(page.locator('.portal-title h1')).toHaveText('rg-modal44-preserved');
  const world = await raw(page, sandboxKey);
  expect(world).toContain('rg-modal44-preserved');
  const help = page.getByRole('button', { name: nb.portal.limitations, exact: true });
  await help.click();
  await centered(page, ordinary(page));
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(help).toBeFocused();
  for (const button of [
    page.getByRole('button', { name: /^Notifications \(\d+\)$/ }),
    page.getByRole('button', { name: nb.portalUi.appearance, exact: true }),
  ]) {
    await button.click();
    const dialog = page.locator('dialog.portal-side-panel');
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox(),
      header = await page.locator('.portal-header').boundingBox();
    const width = await page.evaluate(() => innerWidth);
    expect(Math.abs(box!.x + box!.width - width)).toBeLessThanOrEqual(1);
    expect(box!.y).toBe(header!.height);
    expect(await dialog.evaluate((el) => getComputedStyle(el).margin)).toBe('0px');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(button).toBeFocused();
  }
  await page.goto('/portal');
  for (const width of [320, 800]) {
    await page.setViewportSize({ width, height: 500 });
    await page.locator('.portal-guidance-toggle').click();
    const menu = await page.locator('#portal-guidance-menu').boundingBox(),
      header = await page.locator('.portal-header').boundingBox();
    expect(menu!.x).toBeGreaterThanOrEqual(0);
    expect(menu!.x + menu!.width).toBeLessThanOrEqual(width);
    expect(menu!.y).toBeGreaterThanOrEqual(header!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.keyboard.press('Escape');
    await expect(page.locator('.portal-guidance-toggle')).toBeFocused();
  }
  await page.setViewportSize({ width: 1024, height: 500 });
  await page.goto('/learn/security?topic=missions');
  await page.locator('.compute-mission-list article').first().getByRole('link').click();
  await centered(page, page.locator('dialog.mission-briefing.sl-guidance'));
  await expect(ordinary(page)).toHaveCount(0);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.cancel, exact: true })
    .click();
  expect(
    JSON.parse((await raw(page))!).events.filter((e: { kind: string }) => e.kind === 'mission'),
  ).toEqual([]);
  await page.goto('/learn/services?topic=iaas&activity=practical&version=2');
  const launch = page
    .locator('.practical-entry')
    .getByRole('button', { name: labsNb.launch, exact: true });
  await launch.click();
  await centered(page, page.locator('dialog.mission-briefing:not(.sl-guidance)'));
  await page.keyboard.press('Escape');
  await expect(launch).toBeFocused();
  expect(await raw(page, sandboxKey)).toBe(world);
});

test('Real Chromium browser zoom and doubled text preserve centered scrollable accessible modal actions', async ({
  baseURL,
}) => {
  // Full pinned Chromium exposes its own settings; this is actual browser zoom, not DPR emulation.
  const context = await chromium.launchPersistentContext('', {
    channel: 'chromium',
    headless: true,
    viewport: null,
    deviceScaleFactor: undefined,
    args: ['--window-size=1440,900'],
  });
  try {
    const page = context.pages()[0]!;
    await page.goto('chrome://settings/appearance');
    await page.locator('select#zoomLevel').selectOption('2');
    await page.goto(baseURL + '/learn/security?topic=assessment&case=sp01');
    expect(await page.evaluate(() => devicePixelRatio)).toBe(2);
    expect(await page.evaluate(() => innerWidth)).toBe(720);
    await page.getByRole('button', { name: securityNb.assessment.start, exact: true }).click();
    const dialog = ordinary(page);
    await centered(page, dialog);
    await dialog.evaluate((el) => {
      const text = [...el.querySelectorAll<HTMLElement>('h2,p,button')].map((node) => ({
        node,
        size: parseFloat(getComputedStyle(node).fontSize),
      }));
      text.forEach(({ node, size }) => {
        node.style.fontSize = size * 2 + 'px';
      });
    });
    await centered(page, dialog);
    await focusedActionInside(
      dialog,
      dialog.getByRole('button', { name: securityNb.assessment.start, exact: true }),
    );
    expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('button', { name: securityNb.assessment.start, exact: true }),
    ).toBeFocused();
    expect(securityFacts(JSON.parse((await raw(page))!)).firsts).toEqual([]);
  } finally {
    await context.close();
  }
});

test('Centered start and Journal retain explicit first submission durable aid denial and immutable first evidence', async ({
  page,
}) => {
  await page.addInitScript((key) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key && sessionStorage.getItem('deny-modal-aid') === 'yes') throw Error('denied');
      return set.call(this, k, v);
    };
  }, securityKey);
  const begin = async (item: string) => {
    await page.goto('/learn/security?topic=assessment&case=' + item);
    await page.getByRole('button', { name: securityNb.assessment.start, exact: true }).click();
    await ordinary(page)
      .getByRole('button', { name: securityNb.assessment.start, exact: true })
      .click();
  };
  await begin('sp01');
  const pair = securityItems.sp01.accepted[0]!;
  await page
    .getByRole('radio', { name: securityItemsNb.sp01.decisions[pair[0]]!, exact: true })
    .check();
  await page
    .getByRole('radio', { name: securityItemsNb.sp01.reasons[pair[1]]!, exact: true })
    .check();
  await page.getByRole('button', { name: securityNb.assessment.submit, exact: true }).click();
  const facts = async () => securityFacts(JSON.parse((await raw(page))!));
  await expect.poll(async () => (await facts()).firsts.length).toBe(1);
  const first = JSON.stringify((await facts()).firsts[0]);
  expect((await facts()).firsts[0]!.assisted).toBe(false);
  await begin('sp08');
  await page.getByRole('radio', { name: securityItemsNb.sp08.decisions[0], exact: true }).check();
  const saved = await raw(page);
  await page.evaluate(() => sessionStorage.setItem('deny-modal-aid', 'yes'));
  const journal = page.getByRole('button', { name: nb.course.journal, exact: true });
  await journal.click();
  await centered(page, ordinary(page));
  await expect(ordinary(page).locator('.security-lesson')).toHaveCount(0);
  expect(await raw(page)).toBe(saved);
  await page.keyboard.press('Escape');
  await expect(journal).toBeFocused();
  await page.evaluate(() => sessionStorage.removeItem('deny-modal-aid'));
  await page.reload();
  await expect(
    page.getByRole('radio', { name: securityItemsNb.sp08.decisions[0], exact: true }),
  ).toBeChecked();
  await journal.click();
  await expect(ordinary(page).locator('.security-lesson')).toBeVisible();
  expect((await facts()).assisted).toBe(true);
  await centered(page, ordinary(page));
  await page.keyboard.press('Escape');
  await expect(journal).toBeFocused();
  expect(JSON.stringify((await facts()).firsts.find((a) => a.item === 'sp01'))).toBe(first);
});
