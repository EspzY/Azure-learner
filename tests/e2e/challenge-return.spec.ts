import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import { acknowledgeMilestone } from './portal-actions';
const p = nb.portal,
  c = nb.course;
const computing =
  '/portal?area=challenge&course=1&module=computing&topic=resource-bridge&mode=independent';
const services = '/portal?area=challenge&course=1&module=services&topic=practice&mode=independent';
const key = 'azurelab.portal.learning.v1';
const pinKey = 'azurelab.portal.challenge-origin.v1';
const raw = (page: Page) => page.evaluate((k) => localStorage.getItem(k), key);
const events = async (page: Page) =>
  JSON.parse((await raw(page))!).events as { kind: string; answers?: object }[];
const technical = (page: Page) =>
  page.evaluate(() =>
    Object.fromEntries(
      ['azurelab.sandbox.v2', 'azurelab.chapter01.guided.v1', 'azurelab.progress.v1'].map((k) => [
        k,
        localStorage.getItem(k),
      ]),
    ),
  );
const backCourse = (page: Page) =>
  page.locator('.portal-training-strip').getByRole('link', { name: c.returnCourse, exact: true });
async function start(page: Page, href = computing) {
  await page.goto(href);
  await page.getByRole('button', { name: p.challenge.start, exact: true }).click();
  await expect(page.locator('.portal-challenge')).toContainText(p.challenge.active);
}
async function area(page: Page, id: 'groups' | 'plans' | 'apps') {
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
async function create(
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
async function draft(page: Page) {
  await page.getByRole('combobox', { name: p.challenge.os, exact: true }).selectOption('iaas');
  await page.getByRole('combobox', { name: p.challenge.web, exact: true }).selectOption('paas');
  await page.getByRole('combobox', { name: p.challenge.ready, exact: true }).selectOption('saas');
  await page
    .getByRole('combobox', { name: p.challenge.reason, exact: true })
    .selectOption('managed-platform');
  await page.getByRole('combobox', { name: p.challenge.cause, exact: true }).selectOption('plan');
}

test('Computing real Web lab returns through changed challenge to neutral origin, Hub, same draft and original submitted receipt evidence', async ({
  page,
}, info) => {
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
  await page.getByRole('textbox', { name: p.groupName, exact: true }).fill('rg-guided54');
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
    .selectOption({ label: 'rg-guided54' });
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
    .selectOption({ label: 'rg-guided54' });
  await page.getByRole('textbox', { name: p.name, exact: true }).fill('plan-guided54');
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
    .selectOption({ label: 'rg-guided54' });
  await page.getByRole('textbox', { name: p.name, exact: true }).fill('app-guided54');
  await page
    .getByRole('combobox', { name: p.plan, exact: true })
    .selectOption({ label: 'plan-guided54 · West Europe' });
  await page.locator('[data-guide="review"]').click();
  await page.locator('[data-guide="commit"]').click();
  await coach.getByRole('button', { name: p.areas.architecture, exact: true }).click();
  await page.getByRole('button', { name: p.graph.list, exact: true }).click();
  await page
    .getByRole('button', {
      name: `app-guided54 → plan-guided54 · ${p.graph.relations['depends-on']}`,
      exact: true,
    })
    .click();
  await coach.getByRole('link', { name: c.returnCourse, exact: true }).click();
  await expect(page).toHaveURL(/computing\?topic=resource-bridge&activity=debrief/);
  await page.getByRole('button', { name: c.startIndependent, exact: true }).click();
  await expect(backCourse(page)).toHaveAttribute(
    'href',
    '/learn/computing?topic=resource-bridge&activity=debrief',
  );
  expect(await raw(page)).toBeNull();
  await page.getByRole('button', { name: p.challenge.start, exact: true }).click();
  await page.getByRole('combobox', { name: p.challenge.os, exact: true }).selectOption('iaas');
  const initial = await raw(page),
    world = await technical(page);
  await backCourse(page).click();
  await expect(page).toHaveURL(/computing\?topic=resource-bridge&activity=challenge-return/);
  await expect(
    page.getByRole('heading', { name: 'Endret Web-oppgave', exact: true }),
  ).toBeFocused();
  await expect(page.locator('#lab-debrief')).toHaveCount(0);
  expect(await raw(page)).toBe(initial);
  await page.getByRole('link', { name: 'Fortsett samme Web-oppgave', exact: true }).click();
  await expect(page.getByRole('combobox', { name: p.challenge.os, exact: true })).toHaveValue(
    'iaas',
  );
  await page.reload();
  await expect(page.getByRole('combobox', { name: p.challenge.os, exact: true })).toHaveValue(
    'iaas',
  );
  await page.goBack();
  await page.goForward();
  await expect(page.getByRole('combobox', { name: p.challenge.os, exact: true })).toHaveValue(
    'iaas',
  );
  await page.goto('/learn');
  await expect(page.getByRole('link', { name: p.continueChallenge, exact: true })).toHaveAttribute(
    'href',
    computing,
  );
  await page.getByRole('link', { name: p.continueChallenge, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toBeFocused();
  expect(await technical(page)).toEqual(world);
  await create(page, 'group', 'rg-cc54');
  await create(page, 'plan', 'plan-cc54');
  await create(page, 'app', 'app-cc54');
  const afterOperations = await technical(page);
  await page.goto(computing);
  await draft(page);
  const form = page.locator('.portal-challenge form');
  await form
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption({ label: 'rg-cc54' });
  await form
    .getByRole('combobox', { name: p.plan, exact: true })
    .selectOption({ label: 'plan-cc54' });
  await form
    .getByRole('combobox', { name: p.app, exact: true })
    .selectOption({ label: 'app-cc54' });
  await page.getByRole('button', { name: p.challenge.submit, exact: true }).click();
  await expect(page.locator('.portal-challenge')).toContainText(p.challenge.first);
  await expect(page.getByRole('region', { name: p.challenge.first, exact: true })).toContainText(
    p.challenge.passed,
  );
  await expect(page.getByRole('region', { name: p.challenge.first, exact: true })).toContainText(
    p.challenge.unassisted,
  );
  const submitted = await raw(page);
  await backCourse(page).click();
  await expect(page).toHaveURL(/computing\?topic=resource-bridge&activity=debrief/);
  await expect(page.locator('#lab-debrief')).toBeFocused();
  await page.getByRole('button', { name: c.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.goto(computing);
  expect(await raw(page)).toBe(submitted);
  expect(await technical(page)).toEqual(afterOperations);
  await page.screenshot({ path: info.outputPath('computing-completed-1440.png') });
});

test('legacy unknown origin stays neutral despite mutable Computing or Services position; stored first rubric is never changed', async ({
  page,
}) => {
  await page.goto('/learn');
  const historic = {
    schema: 1,
    content: '1.0.0',
    rubric: 'portal-transfer@1',
    events: [
      { kind: 'begin', boundary: null, attemptNumber: 1 },
      { kind: 'draft', answers: { osModel: 'iaas' } },
      { kind: 'submit', through: 'no-technical-command' },
      { kind: 'begin', boundary: null, attemptNumber: 1 },
      { kind: 'draft', answers: { webModel: 'paas' } },
    ],
  };
  await page.evaluate(({ key, historic }) => localStorage.setItem(key, JSON.stringify(historic)), {
    key,
    historic,
  });
  await page.goto(services);
  await expect(page.locator('.portal-submission')).toHaveCount(0);
  await expect(page.locator('.portal-training-strip')).toContainText('opprinnelse ukjent');
  await expect(backCourse(page)).toHaveAttribute('href', '/learn?activity=challenge-return');
  const before = await raw(page);
  await backCourse(page).click();
  expect(await raw(page)).toBe(before);
  await page.getByRole('link', { name: 'Kursoversikt', exact: true }).click();
  await expect(page.getByRole('link', { name: p.continueChallenge, exact: true })).toHaveAttribute(
    'href',
    '/portal?area=challenge&mode=independent',
  );
  await page.getByRole('link', { name: p.continueChallenge, exact: true }).click();
  await expect(page.getByRole('combobox', { name: p.challenge.web, exact: true })).toHaveValue(
    'paas',
  );
  await page
    .getByRole('button', { name: 'Åpne tidligere tilbakemelding · registrerer hjelp', exact: true })
    .click();
  await expect(page.getByRole('region', { name: p.challenge.first, exact: true })).toBeVisible();
  expect((await events(page)).at(-1)?.kind).toBe('aid');
  await page.getByRole('button', { name: p.challenge.abandon, exact: true }).click();
  expect((await events(page)).slice(0, historic.events.length)).toEqual(historic.events);
  expect((await events(page)).at(-1)?.kind).toBe('abandon');
});

test('documented Services origin survives reload and abandon; assisted retry preserves the same first submission', async ({
  page,
}) => {
  await start(page, services);
  await draft(page);
  // Abandon is explicit and preserves the old draft; retry is a new begin, not a new first result.
  await page.getByRole('button', { name: p.challenge.abandon, exact: true }).click();
  const abandoned = (await events(page)).slice();
  await page.getByRole('button', { name: p.challenge.retry, exact: true }).click();
  await expect(backCourse(page)).toHaveAttribute(
    'href',
    '/learn/services?topic=practice&activity=challenge-return',
  );
  await backCourse(page).click();
  await page
    .getByRole('link', { name: 'Åpne undervisningen · registrerer hjelp', exact: true })
    .click();
  await expect.poll(async () => (await events(page)).some((e) => e.kind === 'aid')).toBe(true);
  await page.goto('/learn');
  await expect(page.getByRole('link', { name: p.continueChallenge, exact: true })).toHaveAttribute(
    'href',
    services,
  );
  await page.getByRole('link', { name: p.continueChallenge, exact: true }).click();
  await expect(page).toHaveURL(services);
  await page.reload();
  await expect(backCourse(page)).toHaveAttribute(
    'href',
    '/learn/services?topic=practice&activity=challenge-return',
  );
  expect((await events(page)).slice(0, abandoned.length)).toEqual(abandoned);
});

test('denied durable aid fails closed and denied origin Start never claims an active attempt', async ({
  page,
}) => {
  await start(page);
  const before = await raw(page);
  await page.addInitScript(
    ({ key }) => {
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key) throw Error('test denied durable write');
        return set.call(this, k, v);
      };
    },
    { key },
  );
  await page.goto('/learn/computing?topic=resource-bridge&activity=debrief');
  await expect(
    page.locator('.management-lesson .course-storage').filter({ hasText: 'unsaved' }).first(),
  ).toContainText('unsaved');
  await expect(page.locator('#lab-debrief')).toHaveCount(0);
  await expect(page.locator('.responsibility-recap')).toHaveCount(0);
  expect(await raw(page)).toBe(before);
  const other = await page
    .context()
    .browser()!
    .newContext({ baseURL: new URL(page.url()).origin });
  const tab = await other.newPage();
  await tab.addInitScript(
    ({ pinKey }) => {
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === pinKey) throw Error('denied origin');
        return set.call(this, k, v);
      };
    },
    { pinKey },
  );
  await tab.goto(computing);
  await tab.getByRole('button', { name: p.challenge.start, exact: true }).click();
  await expect(tab.locator('.portal-challenge [role=alert]')).toContainText(
    'Lagringen kan ikke bekreftes',
  );
  expect(await raw(tab)).toBeNull();
  await other.close();
});

test('two tabs cannot repin the active challenge and corrupt navigation evidence recovers neutrally without changing draft or World', async ({
  page,
  context,
}) => {
  await page.goto(computing);
  const stale = await context.newPage();
  await stale.goto(services);
  await page.getByRole('button', { name: p.challenge.start, exact: true }).click();
  await expect(stale.locator('.portal-challenge [role=alert]')).toContainText(
    'Lagringen kan ikke bekreftes',
  );
  await expect(stale.getByRole('button', { name: p.challenge.start, exact: true })).toBeDisabled();
  const before = await raw(page),
    world = await technical(page);
  await stale.reload();
  await expect(backCourse(stale)).toHaveAttribute(
    'href',
    '/learn/computing?topic=resource-bridge&activity=challenge-return',
  );
  await stale.evaluate((k) => localStorage.setItem(k, '{"schema":99}'), pinKey);
  await expect(page.locator('.portal-challenge')).toContainText('Lagringen kan ikke bekreftes');
  await page.reload();
  await expect(backCourse(page)).toHaveAttribute('href', '/learn?activity=challenge-return');
  expect(await raw(page)).toBe(before);
  expect(await technical(page)).toEqual(world);
  await stale.close();
});

test('challenge return desktop compact keyboard short-height reduced motion Axe and original teaching destination stay accessible without evidence writes', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page);
  await page.getByRole('combobox', { name: p.challenge.os, exact: true }).selectOption('iaas');
  const before = await raw(page),
    world = await technical(page);
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(viewport);
    await backCourse(page).click();
    const title = page.getByRole('heading', { name: 'Endret Web-oppgave', exact: true });
    await expect(title).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('link', { name: 'Fortsett samme Web-oppgave', exact: true }),
    ).toBeFocused();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: info.outputPath(`neutral-${viewport.width}-${viewport.height}.png`),
    });
    await page.keyboard.press('Enter');
    await expect(page.getByRole('combobox', { name: p.challenge.os, exact: true })).toHaveValue(
      'iaas',
    );
  }
  expect(await raw(page)).toBe(before);
  expect(await technical(page)).toEqual(world);
});
