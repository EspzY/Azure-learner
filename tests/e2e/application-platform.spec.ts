import { test, expect, type Page } from '@playwright/test';
import Axe from '@axe-core/playwright';
import { nb, landingNb as landing, laboratoryV3Nb as c } from '../../src/content/nb';
import { laboratoryEphemeralNb as temp } from '../../src/content/laboratory-ephemeral-nb';
import { laboratoryApplicationNb as a } from '../../src/content/laboratory-application-nb';
import { architectureStudioNb as studio } from '../../src/content/architecture-studio-nb';
import { service, create, courseBytes, memoryResponse } from './ephemeral-actions';
import type { CommandResult, Snapshot } from '../../src/laboratory/engine';
async function begin(page: Page) {
  await page.goto('/');
  await page.getByRole('link', { name: landing.labLink, exact: true }).click();
  const response = memoryResponse(page, 'session');
  await page.getByRole('button', { name: temp.start, exact: true }).click();
  const s: Snapshot = await (await response).json();
  expect(s.world.model).toBe('laboratory@3.8.0');
  await expect(page.locator('[data-portal-component="home"]')).toBeVisible();
  return s;
}
async function fill(page: Page, values: Record<string, string>) {
  for (const [name, value] of Object.entries(values)) {
    const input = page.locator('.lab-form').getByLabel(name, { exact: true });
    if (await input.evaluate((e) => e.tagName === 'SELECT')) await input.selectOption(value);
    else await input.fill(value);
  }
}
const operationResponse = (page: Page, action: string) =>
  page.waitForResponse(
    (r) =>
      r.request().method() === 'POST' &&
      (r.url().endsWith('/api/laboratory/' + action) ||
        (r.url().endsWith('/api/laboratory/ephemeral') &&
          r.request().postDataJSON().action === action)),
  );
async function review(page: Page) {
  const response = operationResponse(page, 'review');
  await page.locator('.lab-form').getByRole('button', { name: a.review, exact: true }).click();
  const result = await (await response).json();
  const panel = page.getByRole('region', { name: a.review, exact: true });
  await expect(panel).toBeVisible();
  return { panel, result };
}
async function save(page: Page, label: string) {
  const response = operationResponse(page, 'command');
  await page
    .getByRole('region', { name: a.review, exact: true })
    .getByRole('button', { name: label, exact: true })
    .click();
  const result: CommandResult = await (await response).json();
  expect(result.receipt.outcome).toBe('accepted');
  await expect(page.locator('.lab-form')).toHaveCount(0);
  return result;
}
async function operation(
  page: Page,
  operationName: string,
  values: Record<string, string>,
  action: string = a.create,
) {
  await page.getByRole('button', { name: operationName, exact: true }).click();
  await fill(page, values);
  const r = await review(page);
  expect(r.result.preview.outcome).toBe('accepted');
  return save(page, action);
}
async function ready(page: Page, suffix: string) {
  await begin(page);
  const before = await courseBytes(page);
  const group = await create(page, c.newGroup, { name: `rg-app-${suffix}` });
  await service(page, nb.portal.areas.plans);
  const plan = await operation(page, a.operations.CreateAppServicePlan, {
    [a.fields.name]: `asp-${suffix}`,
  });
  await service(page, nb.portal.areas.apps);
  const app = await operation(page, a.operations.CreateWebApp, {
    [a.fields.name]: `web-${suffix}`,
  });
  return { before, group, plan, app };
}
test('application platform creates actual plan app synthetic deployment settings receipts and Studio relationships without course writes', async ({
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
  const s = await ready(page, 'vertical');
  if (s.app.world.model !== 'laboratory@3.8.0') throw Error('model');
  const app = s.app.world.webApps[0]!;
  await expect(
    page.locator('.portal-properties').getByRole('link', { name: 'asp-vertical', exact: true }),
  ).toHaveAttribute('href', new RegExp(s.app.world.plans[0]!.id));
  await expect(page.getByText(a.incomplete, { exact: true })).toBeVisible();
  await operation(page, a.operations.DeploySyntheticApplication, {}, a.save);
  await expect(page.locator('.portal-title h1')).toHaveText('hello-world');
  await page
    .locator('.portal-properties')
    .getByRole('link', { name: app.name, exact: true })
    .click();
  await expect(page.getByText(a.configured, { exact: true })).toBeVisible();
  await operation(
    page,
    'Add application setting',
    { [a.fields.name]: 'APP_MODE', [a.fields.value]: 'synthetic' },
    a.save,
  );
  await expect(page.locator('.portal-properties')).toContainText('synthetic');
  await page.locator('.lab-evidence-link').click();
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText('SetWebAppSetting');
  await page.getByText(c.details, { exact: true }).click();
  await expect(page.locator('[data-portal-component="receipt"] pre')).toBeVisible();
  const count = commands.length;
  await service(page, nb.portal.areas.resources);
  await expect(page.getByRole('table')).toContainText('asp-vertical');
  await expect(page.getByRole('table')).toContainText('web-vertical');
  await service(page, studio.title);
  await expect(page.locator('.architecture-studio')).toContainText('web-vertical');
  await expect(page.locator('.architecture-studio')).toContainText('asp-vertical');
  await page.getByRole('button', { name: studio.list, exact: true }).click();
  await page
    .getByRole('table', { name: studio.list, exact: true })
    .getByRole('button', { name: `${app.name} · ${app.id}`, exact: true })
    .click();
  await expect(page.locator('.studio-inspector')).toContainText(a.hosting);
  await page.getByRole('link', { name: studio.open, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText(app.name);
  await page.getByRole('link', { name: studio.back, exact: true }).click();
  await expect(page.locator('.architecture-studio')).toBeVisible();
  await expect(page.locator('.studio-inspector')).toContainText(app.name);
  expect(commands).toHaveLength(count);
  expect(await courseBytes(page)).toBe(s.before);
  await page.screenshot({ path: info.outputPath('application-studio.png') });
});
test('application configuration changes preserve IDs and origins and change the real read-only diagnosis', async ({
  page,
}, info) => {
  const s = await ready(page, 'change');
  if (s.app.world.model !== 'laboratory@3.8.0') throw Error('model');
  const app = s.app.world.webApps[0]!;
  await operation(page, a.operations.DeploySyntheticApplication, {}, a.save);
  await page
    .locator('.portal-properties')
    .getByRole('link', { name: app.name, exact: true })
    .click();
  await expect(page.getByText(a.configured, { exact: true })).toBeVisible();
  const changed = await operation(
    page,
    'Edit',
    { [a.fields.publicNetworkAccess]: 'Disabled' },
    a.save,
  );
  expect(changed.receipt.applicationChange).toMatchObject({
    id: app.id,
    createOrigin: app.origin,
    before: { publicNetworkAccess: 'Enabled' },
    after: { publicNetworkAccess: 'Disabled' },
  });
  await expect(page.locator('.portal-title h1')).toHaveText(app.name);
  await expect(page.getByText(a.issues['public-access-disabled'], { exact: true })).toBeVisible();
  await expect(page.getByText(a.incomplete, { exact: true })).toBeVisible();
  expect(changed.world.model === 'laboratory@3.8.0' && changed.world.webApps[0]!.id).toBe(app.id);
  await page.getByRole('link', { name: a.latest, exact: true }).click();
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText('UpdateWebApp');
  const changeTable = page
    .locator('[data-portal-component="receipt"]')
    .getByRole('table', { name: a.changes, exact: true });
  await expect(changeTable).toContainText('Enabled');
  await expect(changeTable).toContainText('Disabled');
  await page.screenshot({ path: info.outputPath('application-change-receipt.png') });
  await page.goBack();
  await expect(page.getByText(a.issues['public-access-disabled'], { exact: true })).toBeVisible();
  expect(await courseBytes(page)).toBe(s.before);
});
test('application server Review denies occupied plan deletion and invalid settings without committing a proposal', async ({
  page,
}, info) => {
  const s = await ready(page, 'negative');
  if (s.app.world.model !== 'laboratory@3.8.0') throw Error('model');
  await page
    .locator('.portal-properties')
    .getByRole('link', { name: 'asp-negative', exact: true })
    .click();
  await page.getByRole('button', { name: a.remove, exact: true }).click();
  const blocked = await review(page);
  expect(blocked.result.preview.code).toBe('resource-in-use');
  await expect(blocked.panel.getByRole('button', { name: a.remove, exact: true })).toBeDisabled();
  await page.getByRole('button', { name: a.cancel, exact: true }).click();
  await page.getByRole('table').getByRole('link', { name: 'web-negative', exact: true }).click();
  await page.getByRole('button', { name: 'Add application setting', exact: true }).click();
  await fill(page, { [a.fields.name]: 'PASSWORD', [a.fields.value]: 'not-a-real-secret' });
  const invalid = await review(page);
  expect(invalid.result.preview.code).toBe('unsupported-profile');
  await expect(invalid.panel.getByRole('button', { name: a.save, exact: true })).toBeDisabled();
  await page.screenshot({ path: info.outputPath('application-denied-review.png') });
  await page.getByRole('button', { name: a.cancel, exact: true }).click();
  await service(page, c.history);
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(s.app.entries.length);
  expect(await courseBytes(page)).toBe(s.before);
});
test('application compact native keyboard focus reduced motion Axe and short desktop keep Review and Properties readable', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page, 'accessible');
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.locator('.portal-title h1')).toHaveText('web-accessible');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: info.outputPath(`application-properties-${viewport.width}-${viewport.height}.png`),
    });
  }
  expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  await expect(page.getByRole('button', { name: 'Edit', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.lab-form h2')).toBeFocused();
  const input = page.locator('.lab-form').getByLabel(a.fields.publicNetworkAccess, { exact: true });
  await input.focus();
  await page.keyboard.press('d');
  await input.selectOption('Disabled');
  await expect(input).toBeFocused();
  const r = await review(page);
  expect(r.result.preview.outcome).toBe('accepted');
  await expect(
    r.panel.getByRole('heading', { name: 'Konfigurasjonen er validert', exact: true }),
  ).toBeFocused();
  const summaryBounds = await r.panel
    .getByRole('heading', { name: 'Konfigurasjonen er validert', exact: true })
    .boundingBox();
  const headerBounds = await page.locator('.portal-header').boundingBox();
  expect(summaryBounds!.y).toBeGreaterThanOrEqual(headerBounds!.y + headerBounds!.height);
  await expect(r.panel).toContainText('Enabled');
  await expect(r.panel).toContainText('Disabled');
  expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('application-review-1024-500.png') });
  await r.panel.getByRole('button', { name: a.save, exact: true }).focus();
  await expect(r.panel.getByRole('button', { name: a.save, exact: true })).toBeInViewport({
    ratio: 1,
  });
  await page.keyboard.press('Enter');
  await expect(page.locator('.lab-form')).toHaveCount(0);
  await expect(page.getByText(a.issues['public-access-disabled'], { exact: true })).toBeVisible();
});

test('application explicit delete preserves original receipts and removes only owned configuration with dependency checks', async ({
  page,
}, info) => {
  const s = await ready(page, 'delete');
  if (s.app.world.model !== 'laboratory@3.8.0') throw Error('model');
  const app = s.app.world.webApps[0]!,
    plan = s.app.world.plans[0]!;
  await operation(
    page,
    'Add application setting',
    { [a.fields.name]: 'APP_MODE', [a.fields.value]: 'synthetic' },
    a.save,
  );
  await page.getByRole('button', { name: a.remove, exact: true }).click();
  const settingReview = await review(page);
  await expect(
    settingReview.panel.getByRole('button', { name: a.remove, exact: true }),
  ).toBeDisabled();
  await settingReview.panel.getByRole('checkbox', { name: a.confirm, exact: true }).check();
  const deletedSetting = await save(page, a.remove);
  expect(deletedSetting.receipt.removedIds).toHaveLength(1);
  await service(page, nb.portal.areas.apps);
  await page.getByRole('table').getByRole('link', { name: app.name, exact: true }).click();
  await page.getByRole('button', { name: a.remove, exact: true }).click();
  const appReview = await review(page);
  await appReview.panel.getByRole('checkbox', { name: a.confirm, exact: true }).check();
  const deletedApp = await save(page, a.remove);
  expect(deletedApp.receipt.removedIds).toEqual([app.id]);
  await service(page, nb.portal.areas.plans);
  await page.getByRole('table').getByRole('link', { name: plan.name, exact: true }).click();
  await page.getByRole('button', { name: a.remove, exact: true }).click();
  const planReview = await review(page);
  await planReview.panel.getByRole('checkbox', { name: a.confirm, exact: true }).check();
  const deletedPlan = await save(page, a.remove);
  expect(deletedPlan.receipt.removedIds).toEqual([plan.id]);
  await service(page, c.history);
  await page.getByRole('link', { name: s.app.receipt.commandId, exact: true }).click();
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(app.id);
  await page.getByText(c.details, { exact: true }).click();
  await expect(page.locator('[data-portal-component="receipt"] pre')).toContainText('CreateWebApp');
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(deletedPlan.entries.length);
  expect(await courseBytes(page)).toBe(s.before);
  await page.screenshot({
    path: info.outputPath('application-deleted-original-create-receipt.png'),
  });
});
test('application PostgreSQL workspace persists actual UI-created plan app and deployment across reload with original evidence', async ({
  page,
}, info) => {
  await page.goto('/');
  await page.getByRole('link', { name: landing.labLink, exact: true }).click();
  const started = operationResponse(page, 'session');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  const initial: Snapshot = await (await started).json();
  expect(initial.world.model).toBe('laboratory@3.8.0');
  const before = await courseBytes(page);
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await page.locator('.lab-form').getByLabel(c.name, { exact: true }).fill('rg-persistent-app');
  await review(page);
  await save(page, c.create);
  await service(page, nb.portal.areas.plans);
  await operation(page, a.operations.CreateAppServicePlan, { [a.fields.name]: 'asp-persistent' });
  await service(page, nb.portal.areas.apps);
  const app = await operation(page, a.operations.CreateWebApp, {
    [a.fields.name]: 'web-persistent',
  });
  const deployment = await operation(page, a.operations.DeploySyntheticApplication, {}, a.save);
  expect(deployment.world.model).toBe('laboratory@3.8.0');
  const url = page.url();
  await page.reload();
  await expect(page.locator('.portal-title h1')).toHaveText('hello-world');
  expect(page.url()).toBe(url);
  await page.locator('.lab-evidence-link').click();
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(
    deployment.receipt.commandId,
  );
  await service(page, nb.portal.areas.apps);
  await page.getByRole('table').getByRole('link', { name: 'web-persistent', exact: true }).click();
  await expect(page.getByText(a.configured, { exact: true })).toBeVisible();
  await page.locator('.lab-evidence-link').click();
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(
    app.receipt.commandId,
  );
  expect(await courseBytes(page)).toBe(before);
  await page.screenshot({ path: info.outputPath('application-persistent-original-receipt.png') });
});
