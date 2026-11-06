import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb, laboratoryV3Nb as c, challenge2Nb } from '../../src/content/nb';
import { portalWorkspaceNb as w } from '../../src/content/portal-workspace-nb';
import { laboratoryNetworkNb as n } from '../../src/content/laboratory-networking-nb';
import { revealPortalLink } from './portal-actions';
import { revealLaboratoryLink, closeLaboratoryDrawer } from './laboratory-actions';
import { startUpdated, servicesNew, updatedKey } from './challenge-v2-actions';
const p = nb.portal;
const bytes = (page: Page) =>
  page.evaluate(() =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(localStorage)
          .filter(([k]) => k.startsWith('azurelab.'))
          .sort(([a], [b]) => a.localeCompare(b)),
      ),
    ),
  );
const state = (page: Page) => page.request.get('/api/laboratory/state').then((r) => r.json());
async function start(page: Page) {
  await page.goto('/');
  await page
    .getByRole('link', {
      name: 'Åpne laboratoriet · AzureLab Laboratory, separat arbeidsområde',
      exact: true,
    })
    .click();
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.getByRole('button', { name: c.newGroup, exact: true })).toBeVisible();
}
async function commit(page: Page, name: string) {
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await page
    .getByRole('region', { name: c.review, exact: true })
    .getByRole('button', { name: c.create, exact: true })
    .click();
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
}
async function group(page: Page, name = 'rg-shared-portal') {
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill(name);
  await commit(page, name);
}
async function nav(page: Page, name: string) {
  const link = page
    .getByRole('navigation', { name: c.navigation, exact: true })
    .getByRole('link', { name, exact: true });
  await revealLaboratoryLink(page, link);
  await link.click();
}

test('shared Portal actual course and free RG create list properties receipts and reset use common presentation with isolated original authorities', async ({
  page,
}, info) => {
  await page.goto('/portal?area=groups');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page.getByLabel(p.groupName, { exact: true }).fill('rg-shared-portal');
  await page
    .getByRole('combobox', { name: p.subscription, exact: true })
    .selectOption('sub-shared');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('norwayeast');
  await page.screenshot({ path: info.outputPath('course-create.png') });
  await page
    .locator('.portal-create-tabs')
    .getByRole('button', { name: p.review, exact: true })
    .click();
  await page
    .locator('.portal-create-footer')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  const groups = page
    .getByRole('navigation', { name: p.navLabel, exact: true })
    .getByRole('link', { name: p.areas.groups, exact: true });
  await revealPortalLink(page, groups);
  await groups.click();
  await expect(page.getByRole('button', { name: 'rg-shared-portal', exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath('course-list.png') });
  await page.getByRole('button', { name: 'rg-shared-portal', exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText('rg-shared-portal');
  for (const component of [
    'header',
    'search',
    'navigation',
    'title',
    'resource-layout',
    'resource-menu',
  ])
    await expect(page.locator(`[data-portal-component="${component}"]`)).toBeVisible();
  await page.screenshot({ path: info.outputPath('course-detail.png') });
  await expect(
    page.locator('.portal-header').getByRole('button', { name: /SavvyShark/ }),
  ).toBeVisible();
  const course = await bytes(page);
  await start(page);
  await group(page);
  expect(await bytes(page)).toBe(course);
  await expect(page.locator('[data-portal-mode="laboratory"]')).toBeVisible();
  for (const component of [
    'header',
    'search',
    'navigation',
    'title',
    'resource-layout',
    'resource-menu',
  ])
    await expect(page.locator(`[data-portal-component="${component}"]`)).toBeVisible();
  await expect(page.locator('.portal-guidance-control')).toHaveCount(0);
  await expect(page.locator('[data-guide]')).toHaveCount(0);
  const original = await state(page);
  await page
    .locator('.portal-resource-menu')
    .getByRole('button', { name: nb.portalUi.properties, exact: true })
    .click();
  await expect(page).toHaveURL(/section=properties/);
  await expect(page.locator('.portal-properties')).toContainText('rg-shared-portal');
  expect(await state(page)).toEqual(original);
  await page
    .locator('.portal-resource-menu')
    .getByRole('button', { name: p.overview, exact: true })
    .click();
  await page.screenshot({ path: info.outputPath('free-detail.png') });
  await page.getByRole('link', { name: c.receipt, exact: true }).click();
  await page.getByText(c.details, { exact: true }).click();
  expect(JSON.parse((await page.locator('.lab-result pre').textContent())!)).toEqual(
    original.entries[0],
  );
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.confirmReset, exact: true }).click();
  const cleared = await state(page);
  expect(cleared.world.groups).toEqual([]);
  expect(cleared.entries[0]).toEqual(original.entries[0]);
  expect(await bytes(page)).toBe(course);
  await page.getByRole('link', { name: w.course, exact: true }).click();
  await expect(page.locator('[data-portal-mode="course"]')).toBeVisible();
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas.home);
  const oldGroups = page
    .getByRole('navigation', { name: p.navLabel, exact: true })
    .getByRole('link', { name: p.areas.groups, exact: true });
  await revealPortalLink(page, oldGroups);
  await oldGroups.click();
  await expect(page.getByRole('button', { name: 'rg-shared-portal', exact: true })).toBeVisible();
  expect(await state(page)).toEqual(cleared);
});

test('shared Portal free search filters parent properties Back Forward and reload inspect one World without commands or course credit', async ({
  page,
}) => {
  await start(page);
  await group(page);
  await page.getByRole('button', { name: n.newVnet, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('vnet-shared');
  await page.getByRole('textbox', { name: n.addressSpace, exact: true }).fill('10.20.0.0/16');
  await commit(page, 'vnet-shared');
  await nav(page, c.groups);
  await page.getByRole('link', { name: 'rg-shared-portal', exact: true }).click();
  await page.getByRole('button', { name: c.newAccount, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('sharedportalstore');
  await commit(page, 'sharedportalstore');
  const original = await state(page),
    old = await bytes(page);
  await nav(page, p.areas.resources);
  await page.getByRole('combobox', { name: p.type, exact: true }).selectOption('vnet');
  await expect(page.getByRole('link', { name: 'vnet-shared', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'sharedportalstore', exact: true })).toHaveCount(0);
  const search = page.getByRole('searchbox', { name: w.search, exact: true });
  await search.fill('vnet-shared');
  await search.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'vnet-shared', exact: true })).toBeVisible();
  await page
    .locator('.portal-resource-menu')
    .getByRole('button', { name: nb.portalUi.properties, exact: true })
    .click();
  await expect(page.locator('.portal-properties')).toContainText('10.20.0.0/16');
  await page.goBack();
  await expect(page).not.toHaveURL(/section=properties/);
  await page.goForward();
  await expect(page).toHaveURL(/section=properties/);
  await page.reload();
  await expect(page.locator('.portal-properties')).toContainText('10.20.0.0/16');
  expect(await state(page)).toEqual(original);
  expect(await bytes(page)).toBe(old);
});

test('shared Portal free mode cannot mount course learning or alter an actual active independent draft and assistance boundary', async ({
  page,
  context,
}) => {
  await startUpdated(page, servicesNew);
  await page
    .getByRole('combobox', { name: challenge2Nb.ui.decision, exact: true })
    .first()
    .selectOption('iaas');
  const before = await bytes(page),
    draft = await page.evaluate((k) => localStorage.getItem(k), updatedKey);
  const free = await context.newPage();
  await start(free);
  await group(free, 'rg-independent-free');
  await expect(
    free.locator(
      '.portal-challenge-updated,.portal-training-strip,.portal-guidance-control,.portal-guidance-menu,[data-guide]',
    ),
  ).toHaveCount(0);
  expect(await bytes(free)).toBe(before);
  await page.reload();
  await expect(page.locator('.portal-challenge-updated')).toContainText(challenge2Nb.ui.active);
  await expect(
    page.getByRole('combobox', { name: challenge2Nb.ui.decision, exact: true }).first(),
  ).toHaveValue('iaas');
  expect(await page.evaluate((k) => localStorage.getItem(k), updatedKey)).toBe(draft);
});

test('shared Portal compact native search drawer properties dialogs reduced motion Axe and unavailable server preserve scope and visible controls', async ({
  page,
  context,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page);
  await group(page, 'rg-compact-shared');
  const original = await state(page);
  for (const size of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(size);
    await expect(
      page.getByRole('heading', { name: 'rg-compact-shared', exact: true }),
    ).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const link = page
      .getByRole('navigation', { name: c.navigation, exact: true })
      .getByRole('link', { name: c.groups, exact: true });
    await revealLaboratoryLink(page, link);
    await link.focus();
    await page.keyboard.press('Enter');
    await page.getByRole('link', { name: 'rg-compact-shared', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'rg-compact-shared', exact: true }),
    ).toBeFocused();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`shared-${size.width}-${size.height}.png`) });
  }
  await closeLaboratoryDrawer(page);
  const help = page.getByRole('button', { name: p.limitations, exact: true });
  await help.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toContainText(w.scopeNote);
  await page.keyboard.press('Escape');
  await expect(help).toBeFocused();
  await nav(page, c.groups);
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('rg-reviewed-only');
  await page.getByRole('button', { name: c.review, exact: true }).click();
  const review = page.getByRole('region', { name: c.review, exact: true });
  await expect(
    review.getByRole('heading', { name: c.review, level: 2, exact: true }),
  ).toBeFocused();
  await expect(review).toContainText(w.reviewAccepted);
  await expect(review).not.toContainText(c.codes.created);
  const create = review.getByRole('button', { name: c.create, exact: true });
  await expect(create).toBeInViewport({ ratio: 1 });
  const box = await create.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(40);
  expect(box!.y + box!.height).toBeLessThanOrEqual(500);
  const footer = await page.locator('.laboratory-workspace-status').boundingBox();
  expect(footer).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(footer!.y);
  await page.screenshot({ path: info.outputPath('shared-review-focus-1024-500.png') });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Tab');
  await expect(create).toBeFocused();
  await page.screenshot({ path: info.outputPath('shared-review-1024-500.png') });
  await page.getByRole('button', { name: c.cancel, exact: true }).click();
  expect(await state(page)).toEqual(original);
  const empty = await context.browser()!.newContext();
  try {
    const off = await empty.newPage();
    let posts = 0;
    off.on('request', (r) => {
      if (r.method() === 'POST' && r.url().includes('/api/laboratory')) posts++;
    });
    await off.route('**/api/laboratory/state', (r) =>
      r.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'backend-unavailable' }),
      }),
    );
    await off.goto(new URL('/labs/laboratory', page.url()).href);
    await expect(off.locator('[data-portal-component="header"]')).toBeVisible();
    await expect(off.getByRole('main').getByRole('alert')).toHaveText(
      c.codes['backend-unavailable'],
    );
    await expect(off.getByRole('main')).toContainText(c.unavailable);
    await expect(off.getByRole('button', { name: c.start, exact: true })).toBeDisabled();
    expect(posts).toBe(0);
    expect(await empty.cookies()).toEqual([]);
  } finally {
    await empty.close();
  }
});
