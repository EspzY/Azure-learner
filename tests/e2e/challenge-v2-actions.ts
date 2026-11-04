import { expect, type Page } from '@playwright/test';
import { nb, challenge2Nb as copy } from '../../src/content/nb';
import { acknowledgeMilestone } from './portal-actions';
const p = nb.portal,
  c = nb.course;
export async function area(
  page: Page,
  id: 'groups' | 'plans' | 'apps' | 'challenge' | 'resources' | 'activity',
) {
  if (id === 'challenge') {
    await page
      .locator('.portal-training-strip')
      .getByRole('button', { name: p.continueChallenge, exact: true })
      .click();
    await expect(page.locator('.portal-title h1')).toHaveText(p.areas.challenge);
    await expect(page.locator('.portal-title h1')).toBeFocused();
    return;
  }
  const nav = page.locator('.portal-nav nav');
  await nav.waitFor({ state: 'attached' });
  if (!(await nav.isVisible()))
    await page.getByRole('button', { name: p.menu, exact: true }).click();
  await expect(nav).toBeVisible();
  const link = nav.getByRole('link', { name: p.areas[id], exact: true });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas[id]);
  await expect(page.locator('.portal-title h1')).toBeFocused();
}
export async function create(
  page: Page,
  kind: 'group' | 'plan' | 'app',
  name: string,
  region = 'northeurope',
  group = 'rg-cc54',
  plan = 'plan-cc54',
) {
  await area(page, kind === 'group' ? 'groups' : kind === 'plan' ? 'plans' : 'apps');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.createTitles[kind]);
  await expect(page.locator('.portal-title h1')).toBeFocused();
  await page
    .getByRole('combobox', { name: p.subscription, exact: true })
    .selectOption('sub-shared');
  if (kind === 'group') {
    await page
      .getByRole('combobox', { name: p.subscription, exact: true })
      .selectOption('sub-shared');
    await page.getByRole('textbox', { name: p.groupName, exact: true }).fill(name);
    await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('norwayeast');
  } else {
    await page.getByRole('combobox', { name: p.group, exact: true }).selectOption({ label: group });
    await page.getByRole('textbox', { name: p.name, exact: true }).fill(name);
    if (kind === 'plan')
      await page.getByRole('combobox', { name: p.region, exact: true }).selectOption(region);
    else
      await page
        .getByRole('combobox', { name: p.plan, exact: true })
        .selectOption({ label: `${plan} · North Europe` });
  }
  await expect(page.getByRole('combobox', { name: p.subscription, exact: true })).toHaveValue(
    'sub-shared',
  );
  await page.locator('[data-guide="review"]').click();
  await expect(page.locator('.portal-create dl')).toContainText('Shared Sandbox');
  await expect(page.locator('[data-guide="validation"]')).toContainText(p.valid);
  await page.locator('[data-guide="commit"]').click();
  await expect(page.locator('.portal-title h1')).toHaveText(name);
  await expect(page.locator('.portal-title h1')).toBeFocused();
}

export async function completeComputingLab(page: Page) {
  await page.goto('/learn/computing?topic=resource-bridge');
  await page.getByRole('button', { name: c.startLab, exact: true }).click();
  await expect(page).toHaveURL(/lab=web-platform/);
  const coach = page.getByRole('complementary', { name: c.guided, exact: true });
  await expect(coach).toHaveAttribute('data-step', 'find-groups');
  // Follow the guide's actual Search action and wait for observed form state.
  // A URL change or enabled server-rendered input alone is not hydrated readiness.
  await page.getByRole('searchbox', { name: p.search, exact: true }).fill('Resource groups');
  await page
    .locator('.portal-search-results a[href^="/portal?"]', { hasText: 'Resource groups' })
    .click();
  await expect(coach).toHaveAttribute('data-step', 'create-group');
  // Original guided lab uses App Sandbox and intentionally investigates a denied hosting location.
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await expect(coach).toHaveAttribute('data-step', 'subscription');
  await page.getByRole('combobox', { name: p.subscription, exact: true }).selectOption('sub-app');
  await expect(coach).toHaveAttribute('data-step', 'group-name');
  await page.getByRole('textbox', { name: p.groupName, exact: true }).fill('rg-guided55');
  await expect(coach).toHaveAttribute('data-step', 'metadata');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('norwayeast');
  await expect(coach).toHaveAttribute('data-step', 'review-group');
  await expect(page.getByRole('combobox', { name: p.subscription, exact: true })).toHaveValue(
    'sub-app',
  );
  await page.locator('[data-guide="review"]').click();
  await expect(page.locator('[data-guide="validation"]')).toContainText(p.valid);
  await page.locator('[data-guide="commit"]').click();
  await area(page, 'plans');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption({ label: 'rg-guided55' });
  await page.getByRole('textbox', { name: p.name, exact: true }).fill('denied54');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('northeurope');
  await page.locator('[data-guide="review"]').click();
  await page.locator('[data-guide="commit"]').click();
  await coach.getByRole('button', { name: c.goPolicy, exact: true }).click();
  await acknowledgeMilestone(page, 'policy-denial');
  await area(page, 'plans');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption({ label: 'rg-guided55' });
  await page.getByRole('textbox', { name: p.name, exact: true }).fill('plan-guided55');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('westeurope');
  await page.locator('[data-guide="review"]').click();
  await page.locator('[data-guide="commit"]').click();
  await area(page, 'apps');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption({ label: 'rg-guided55' });
  await page.getByRole('textbox', { name: p.name, exact: true }).fill('app-guided55');
  await page
    .getByRole('combobox', { name: p.plan, exact: true })
    .selectOption({ label: 'plan-guided55 · West Europe' });
  await page.locator('[data-guide="review"]').click();
  await page.locator('[data-guide="commit"]').click();
  await coach.getByRole('button', { name: p.areas.architecture, exact: true }).click();
  await page.getByRole('button', { name: p.graph.list, exact: true }).click();
  await page
    .getByRole('button', {
      name: `app-guided55 → plan-guided55 · ${p.graph.relations['depends-on']}`,
      exact: true,
    })
    .click();
  await coach.getByRole('link', { name: c.returnCourse, exact: true }).click();
  await expect(page).toHaveURL(/computing\?topic=resource-bridge&activity=debrief/);
}

export const updatedKey = 'azurelab.portal.challenge.v2';
export const oldKey = 'azurelab.portal.learning.v1';
export const computingNew =
  '/portal?area=challenge&course=1&module=computing&topic=resource-bridge&mode=independent&assessment=updated';
export const servicesNew =
  '/portal?area=challenge&course=1&module=services&topic=practice&mode=independent&assessment=updated';
export const raw = (page: Page, key = updatedKey) =>
  page.evaluate((k) => localStorage.getItem(k), key);
export const technical = (page: Page) =>
  page.evaluate(() =>
    Object.fromEntries(
      ['azurelab.sandbox.v2', 'azurelab.chapter01.guided.v1', 'azurelab.progress.v1'].map((k) => [
        k,
        localStorage.getItem(k),
      ]),
    ),
  );
export const backCourse = (page: Page) =>
  page.locator('.portal-training-strip').getByRole('link', { name: c.returnCourse, exact: true });
export async function startUpdated(page: Page, href = computingNew) {
  await page.goto(href);
  await page.getByRole('button', { name: copy.ui.start, exact: true }).click();
  await expect(page.locator('.portal-challenge-updated')).toContainText(copy.ui.active);
}
export async function fillNew(
  page: Page,
  group = 'rg-cc55',
  plan = 'plan-cc55',
  app = 'app-cc55',
  wrong = false,
) {
  const first = page
    .locator('form fieldset > section')
    .filter({ has: page.getByRole('heading', { name: copy.items[0].title, exact: true }) });
  const second = page
    .locator('form fieldset > section')
    .filter({ has: page.getByRole('heading', { name: copy.items[1].title, exact: true }) });
  await first
    .getByRole('combobox', { name: copy.ui.decision, exact: true })
    .selectOption(wrong ? 'paas' : 'iaas');
  await first
    .getByRole('combobox', { name: copy.ui.reason, exact: true })
    .selectOption('guest-lifecycle');
  await second.getByRole('combobox', { name: copy.ui.decision, exact: true }).selectOption('paas');
  await second
    .getByRole('combobox', { name: copy.ui.reason, exact: true })
    .selectOption(wrong ? 'windows-control' : 'supported-platform');
  for (const [name, value] of [
    [p.challenge.web, 'paas'],
    [p.challenge.ready, 'saas'],
    [p.challenge.reason, 'managed-platform'],
    [p.challenge.cause, 'plan'],
    [p.group, group],
    [p.plan, plan],
    [p.app, app],
  ])
    await page
      .getByRole('combobox', { name, exact: true })
      .selectOption(
        ['paas', 'saas', 'managed-platform', 'plan'].includes(value!) ? value! : { label: value! },
      );
}
export async function actualWeb(page: Page) {
  await create(page, 'group', 'rg-cc55');
  await create(page, 'plan', 'plan-cc55', 'northeurope', 'rg-cc55');
  await create(page, 'app', 'app-cc55', 'northeurope', 'rg-cc55', 'plan-cc55');
  await area(page, 'challenge');
}
