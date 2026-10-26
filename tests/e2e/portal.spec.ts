import { revealPortalLink } from './portal-actions';
import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
const p = nb.portal;
test.use({ trace: 'on', video: 'on', actionTimeout: 15000 });
test.setTimeout(180000);
async function capture(page: Page, info: TestInfo, name: string) {
  await page.screenshot({ path: info.outputPath(`portal-${name}.png`), scale: 'css' });
}
async function audit(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
}
async function area(page: Page, id: keyof typeof p.areas) {
  const nav = page.getByRole('navigation', { name: p.navLabel, exact: true });
  const link = nav.getByRole('link', { name: p.areas[id], exact: true });
  await revealPortalLink(page, link);
  await link.click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas[id]);
}
async function create(
  page: Page,
  kind: 'group' | 'plan' | 'app',
  name: string,
  options: { subscription?: string; group?: string; region?: string; plan?: string } = {},
  info?: TestInfo,
) {
  await area(page, kind === 'group' ? 'groups' : kind === 'plan' ? 'plans' : 'apps');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await expect(page.locator('h1')).toHaveText(p.createTitles[kind]);
  await page.getByLabel(kind === 'group' ? p.groupName : p.name, { exact: true }).fill(name);
  if (options.subscription)
    await page
      .getByRole('combobox', { name: p.subscription, exact: true })
      .selectOption(options.subscription);
  if (options.group)
    await page
      .getByRole('combobox', { name: p.group, exact: true })
      .selectOption({ label: options.group });
  if (options.region)
    await page.getByRole('combobox', { name: p.region, exact: true }).selectOption(options.region);
  if (options.plan)
    await page
      .getByRole('combobox', { name: p.plan, exact: true })
      .selectOption({ label: options.plan });
  if (info) await capture(page, info, `${kind}-basics`);
  if (info) await audit(page);
  await page
    .locator('.portal-create-tabs')
    .getByRole('button', { name: p.review, exact: true })
    .click();
  await expect(page.getByText(p.valid, { exact: true })).toBeVisible();
  if (info) await capture(page, info, `${kind}-review`);
  if (info) await audit(page);
  await page
    .locator('.portal-create-footer')
    .getByRole('button', { name: p.create, exact: true })
    .click();
}
async function buildChanged(page: Page) {
  await create(page, 'group', 'rg-transfer', { subscription: 'sub-shared', region: 'norwayeast' });
  await create(page, 'plan', 'plan-transfer', {
    subscription: 'sub-shared',
    group: 'rg-transfer',
    region: 'northeurope',
  });
  await create(page, 'app', 'app-transfer', {
    subscription: 'sub-shared',
    group: 'rg-transfer',
    plan: 'plan-transfer · North Europe',
  });
}
async function answerChallenge(page: Page) {
  await page.getByRole('combobox', { name: p.challenge.os, exact: true }).selectOption('iaas');
  await page.getByRole('combobox', { name: p.challenge.web, exact: true }).selectOption('paas');
  await page.getByRole('combobox', { name: p.challenge.ready, exact: true }).selectOption('saas');
  await page
    .getByRole('combobox', { name: p.challenge.reason, exact: true })
    .selectOption('managed-platform');
  await page.getByRole('combobox', { name: p.challenge.cause, exact: true }).selectOption('plan');
  await page
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption({ label: 'rg-transfer' });
  await page
    .getByRole('combobox', { name: p.plan, exact: true })
    .selectOption({ label: 'plan-transfer' });
  await page
    .getByRole('combobox', { name: p.app, exact: true })
    .selectOption({ label: 'app-transfer' });
}
test('source-backed learning, real Portal creation, policy recovery, live graph and changed independent build', async ({
  page,
}, info) => {
  const external: string[] = [],
    game: string[] = [],
    errors: string[] = [],
    scripts: Promise<string>[] = [];
  page.on('response', (r) => {
    if (r.url().includes('/_next/static/') && r.url().endsWith('.js')) scripts.push(r.text());
  });
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== new URL(info.project.use.baseURL!).origin)
      external.push(r.url());
    if (/\/game\/|\.(glb|wav)(\?|$)/.test(r.url())) game.push(r.url());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/portal');
  await capture(page, info, 'home');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('searchbox', { name: p.search, exact: true }).fill('App Service');
  await expect(page.locator('.portal-search-results')).toContainText(p.areas.plans);
  await capture(page, info, 'search');
  await page.getByRole('searchbox', { name: p.search, exact: true }).press('Escape');
  await area(page, 'learn');
  await page.locator('.portal-manuscript .curriculum-trail > summary').click();
  await expect(page.getByText(nb.official.servicesImplemented, { exact: true })).toBeVisible();
  await page.locator('.curriculum-trail > details > summary').click();
  await expect(page.locator('.curriculum-trail > details > ol > li')).toHaveText([
    ...nb.official.serviceUnits,
  ]);
  await capture(page, info, 'official-context');
  await audit(page);
  await page.locator('.portal-manuscript .curriculum-trail > summary').click();
  await expect(page.locator('.portal-manuscript')).toContainText(
    p.lesson.sections.overview.mechanism,
  );
  for (const model of ['iaas', 'paas', 'saas'] as const) {
    await page
      .locator('.portal-model-choice')
      .getByRole('button', { name: new RegExp(`^${model.toUpperCase()}`) })
      .click();
    await expect(
      page
        .locator('.portal-layer-stack button')
        .filter({ hasText: nb.learningResponsibility.layers.os.label }),
    ).toContainText(model === 'iaas' ? p.responsibility.customer : p.responsibility.microsoft);
  }
  await page.locator('.portal-responsibility').scrollIntoViewIfNeeded();
  await capture(page, info, 'responsibility');
  await audit(page);
  await page
    .locator('.portal-lesson-menu')
    .getByRole('button', { name: p.lesson.sections.selection.title, exact: true })
    .click();
  const answers = [
    ['iaas', 'os-control'],
    ['paas', 'managed-platform'],
    ['saas', 'ready-service'],
  ];
  await expect(page.locator('.portal-guided-case')).toHaveCount(3);
  for (const [i, form] of (await page.locator('.portal-guided-case').all()).entries()) {
    await form
      .getByRole('combobox', { name: p.lesson.model, exact: true })
      .selectOption(answers[i]![0]!);
    await form
      .getByRole('combobox', { name: p.lesson.reason, exact: true })
      .selectOption(answers[i]![1]!);
    await form.getByRole('button', { name: p.lesson.check, exact: true }).click();
  }
  await expect(page.getByText(p.lesson.guidedComplete, { exact: true })).toBeVisible();
  await page
    .locator('.portal-lesson-menu')
    .getByRole('button', { name: p.lesson.sections.paas.title, exact: true })
    .click();
  await expect(page.locator('.portal-manuscript h2')).toHaveText(p.lesson.sections.paas.title);
  await capture(page, info, 'learn-paas');
  await page.getByRole('button', { name: p.openPractice, exact: true }).click();
  await expect(page.locator('h1')).toHaveText(p.areas.groups);
  await capture(page, info, 'integrated-practice');
  await create(page, 'group', 'rg-guided', { region: 'norwayeast' }, info);
  await expect(page.locator('h1')).toHaveText('rg-guided');
  await capture(page, info, 'group-overview');
  await create(page, 'plan', 'plan-guided', { group: 'rg-guided', region: 'northeurope' }, info);
  await expect(page.locator('.chapter-receipt')).toHaveAttribute('data-outcome', 'rejected');
  await expect(page.locator('.chapter-receipt')).toContainText('policy-web-location');
  await capture(page, info, 'policy-rejection');
  await audit(page);
  expect(
    (
      await page.evaluate(() => JSON.parse(localStorage.getItem('azurelab.sandbox.v2')!))
    ).commands.some((e: { command: { type: string } }) => e.command.type === 'CreatePlan'),
  ).toBe(true);
  await page.getByRole('button', { name: nb.chapter.showPolicy, exact: true }).click();
  await expect(page.locator('h1')).toHaveText(p.areas.policy);
  await expect(page.locator('.portal-view')).toContainText('policy-web-location');
  await capture(page, info, 'policy-inspection');
  await audit(page);
  await area(page, 'resources');
  await expect(page.locator('table')).not.toContainText('plan-guided');
  await create(page, 'plan', 'plan-guided', { group: 'rg-guided', region: 'westeurope' });
  await expect(page.locator('h1')).toHaveText('plan-guided');
  await create(
    page,
    'app',
    'app-guided',
    { group: 'rg-guided', plan: 'plan-guided · West Europe' },
    info,
  );
  await expect(page.locator('h1')).toHaveText('app-guided');
  await capture(page, info, 'app-overview');
  await area(page, 'resources');
  await page.getByRole('searchbox', { name: p.filter, exact: true }).fill('app-guided');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await capture(page, info, 'inventory-filter');
  await area(page, 'architecture');
  await expect(page.locator('.react-flow__node')).toHaveCount(6);
  await page.locator('.portal-graph').scrollIntoViewIfNeeded();
  await capture(page, info, 'architecture-live');
  await audit(page);
  await page.getByRole('button', { name: p.graph.list, exact: true }).click();
  await expect(page.locator('.portal-relation-list')).toContainText('app-guided → plan-guided');
  await capture(page, info, 'architecture');
  await page
    .locator('.portal-relation-list')
    .getByRole('button', {
      name: `app-guided → plan-guided · ${p.graph.relations['depends-on']}`,
      exact: true,
    })
    .click();
  const inspector = page.getByRole('complementary', { name: p.graph.inspectRelation, exact: true });
  await expect(
    inspector.getByRole('heading', { name: p.graph.relations['depends-on'], exact: true }),
  ).toBeVisible();
  await inspector.getByRole('button', { name: p.relatedLearning, exact: true }).click();
  await expect(inspector).toContainText(p.graph.explanations['depends-on']);
  await inspector.scrollIntoViewIfNeeded();
  await capture(page, info, 'architecture-selected');
  await page
    .locator('.portal-training-strip')
    .getByRole('button', { name: p.returnLearning, exact: true })
    .click();
  await expect(page).toHaveURL(/topic=paas/);
  await expect(page.locator('.portal-manuscript h2')).toHaveText(p.lesson.sections.paas.title);
  await area(page, 'challenge');
  await page.getByRole('button', { name: p.challenge.start, exact: true }).click();
  await capture(page, info, 'independent-brief');
  await buildChanged(page);
  await area(page, 'challenge');
  await answerChallenge(page);
  await page.getByRole('button', { name: p.challenge.submit, exact: true }).click();
  const first = page.getByRole('region', { name: p.challenge.first, exact: true });
  await expect(first).toHaveAttribute('data-correct', 'true');
  await expect(page.locator('.portal-training-strip')).toContainText(p.modes.independent);
  await expect(first).toContainText(p.challenge.unassisted);
  await capture(page, info, 'independent-result');
  await audit(page);
  await page.reload();
  await expect(first).toHaveAttribute('data-correct', 'true');
  await area(page, 'resources');
  await expect(page.locator('tbody tr')).toHaveCount(4);
  await expect(page.getByRole('button', { name: 'rg-guided', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: /^Notifications \(\d+\)$/ }).click();
  await expect(page.getByRole('dialog')).toContainText('policy-location-denied');
  await page.keyboard.press('Escape');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.locator('canvas').count()).toBe(0);
  expect(external).toEqual([]);
  expect(game).toEqual([]);
  expect(
    (await Promise.all(scripts)).some((s) => /WebGLRenderer|GLTFLoader|react-three\/fiber/.test(s)),
  ).toBe(false);
  expect(errors).toEqual([]);
  const oldAwards = await page.evaluate(() => localStorage.getItem('azurelab.progress.v1'));
  await area(page, 'challenge');
  await page.getByRole('button', { name: p.challenge.retry, exact: true }).click();
  await page.getByRole('button', { name: p.challenge.abandon, exact: true }).click();
  await expect(
    page.getByRole('region', { name: `${p.challenge.retryResult} 2`, exact: true }),
  ).toContainText(p.challenge.abandoned);
  await page.getByRole('button', { name: p.limitations, exact: true }).click();
  await page.getByRole('button', { name: p.resetTechnical, exact: true }).click();
  await page.getByRole('button', { name: p.confirmReset, exact: true }).click();
  await expect(page.locator('tbody tr')).toHaveCount(0);
  await area(page, 'challenge');
  await expect(first).toContainText(p.challenge.unverifiable);
  expect(await page.evaluate(() => localStorage.getItem('azurelab.progress.v1'))).toBe(oldAwards);
});
test('keyboard search, incomplete practice, reference assistance, first submission and malformed storage are honest', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/portal?area=learn&topic=iaas');
  await expect(page.getByText(p.lesson.guidedIncomplete, { exact: true })).toBeVisible();
  const search = page.getByRole('searchbox', { name: p.search, exact: true });
  await search.fill('Resource groups');
  await search.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('h1')).toHaveText(p.areas.groups);
  await buildChanged(page);
  await expect(
    page.locator('.portal-commandbar').getByRole('button', { name: p.create, exact: true }),
  ).toHaveCount(0);
  await area(page, 'groups');
  await expect(
    page.getByRole('columnheader', { name: nb.portalUi.location, exact: true }),
  ).toBeVisible();
  // Azure labels this column Location; the actual value is still group metadata, not member placement.
  await expect(
    page.getByRole('row').filter({ hasText: 'rg-transfer' }).locator('span[title]'),
  ).toHaveAttribute('title', p.locationNote);
  await expect(page.getByRole('row').filter({ hasText: 'rg-transfer' })).toContainText(
    'Norway East',
  );
  await capture(page, info, 'group-list');
  await page.getByRole('button', { name: 'rg-transfer', exact: true }).click();
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await expect(page.getByRole('combobox', { name: p.subscription, exact: true })).toHaveValue(
    'sub-shared',
  );
  await expect(page.getByRole('combobox', { name: p.group, exact: true })).toHaveValue('group-1');
  await page
    .locator('.portal-create-footer')
    .getByRole('button', { name: p.close, exact: true })
    .click();
  await area(page, 'challenge');
  await page.getByRole('button', { name: p.challenge.start, exact: true }).click();
  await page.goto('/portal?area=learn&module=services&topic=iaas');
  await area(page, 'challenge');
  await expect(page.getByRole('status')).toContainText(p.challenge.assisted);
  await page.getByRole('button', { name: p.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(p.lesson.sections.iaas.mechanism);
  await page.keyboard.press('Escape');
  await answerChallenge(page);
  await page.getByRole('button', { name: p.challenge.submit, exact: true }).click();
  const first = page.getByRole('region', { name: p.challenge.first, exact: true });
  await expect(first).toHaveAttribute('data-correct', 'false');
  await expect(first).toContainText(p.challenge.assisted);
  await capture(page, info, 'assisted-preexisting');
  await page.reload();
  await expect(first).toHaveAttribute('data-correct', 'false');
  await page.setViewportSize({ width: 844, height: 390 });
  await page.getByRole('button', { name: /^Notifications \(\d+\)$/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: p.close, exact: true }).click();
  await capture(page, info, 'short');
  await audit(page);
  await page.setViewportSize({ width: 320, height: 740 });
  // Exercise the declared non-Segoe fallback too; CI exposed a real header-width regression.
  await page.addStyleTag({ content: '.portal { font-family: Arial, sans-serif; }' });
  await expect(page.locator('.portal-notifications [data-icon="notifications"]')).toBeVisible();
  await audit(page);
  await page.getByRole('button', { name: p.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: p.close, exact: true }).click();
  await capture(page, info, 'narrow');
  await page.evaluate(() =>
    localStorage.setItem(
      'azurelab.portal.learning.v1',
      JSON.stringify({ schema: 99, content: '1.0.0', rubric: 'portal-transfer@1', events: [] }),
    ),
  );
  await page.reload();
  await expect(page.getByRole('status')).toContainText('unsupported');
  await expect(page.getByRole('button', { name: p.challenge.retry, exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: p.resetModule, exact: true }).click();
  await page.getByRole('button', { name: p.confirmModuleReset, exact: true }).click();
  await expect(page.getByRole('button', { name: p.challenge.start, exact: true })).toBeEnabled();
  await area(page, 'resources');
  await expect(page.locator('tbody tr')).toHaveCount(2);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test('direct Portal entry preserves history and archived entry stays isolated', async ({
  page,
}) => {
  const compatibility = await page.request.get(
    '/expedition-3d?goal=service&return=chapter01&redirect=https://example.invalid',
    { maxRedirects: 0 },
  );
  expect(compatibility.status()).toBe(307);
  expect(compatibility.headers().location).toBe('/learn');
  const unsafe = await page.request.get(
    '/expedition-3d?goal=https://example.invalid&return=other',
    { maxRedirects: 0 },
  );
  expect(unsafe.status()).toBe(307);
  expect(unsafe.headers().location).toBe('/learn');
  await page.goto('/portal');
  await expect(page).toHaveURL(/\/portal$/);
  await expect(page.locator('.portal-nav nav')).not.toContainText('RPG');
  expect(await page.locator('a[href*="legacy"], a[href*="expedition-3d"]').count()).toBe(0);
  await area(page, 'learn');
  const section = page
    .locator('.portal-lesson-menu')
    .getByRole('button', { name: p.lesson.sections.paas.title, exact: true });
  await section.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/topic=paas/);
  await area(page, 'plans');
  await page.goBack();
  await expect(page.locator('.portal-manuscript h2')).toHaveText(p.lesson.sections.paas.title);
  await page.goForward();
  await expect(page.locator('h1')).toHaveText(p.areas.plans);
  await audit(page);
});
test('original cloud-computing manuscript and investigation stay usable without the game and on tablet', async ({
  page,
}, info) => {
  await page.goto('/portal?area=learn&module=computing&topic=capacity');
  await expect(page.locator('.portal-manuscript')).toContainText(
    nb.foundations.units.capacity.mechanism,
  );
  await page.getByRole('spinbutton', { name: nb.foundations.predict, exact: true }).fill('4');
  await page.getByRole('button', { name: nb.foundations.run, exact: true }).click();
  await expect(page.locator('.learning-result')).toContainText(nb.foundations.shortage);
  await page
    .getByRole('combobox', { name: nb.foundations.operation, exact: true })
    .selectOption('cloud');
  await page.getByRole('button', { name: nb.foundations.run, exact: true }).click();
  await expect(
    page.getByRole('button', { name: nb.foundations.check, exact: true }),
  ).toBeDisabled();
  await audit(page);
  await page.setViewportSize({ width: 1024, height: 768 });
  await capture(page, info, 'tablet-foundations');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  for (const unit of ['responsibility', 'models', 'placement', 'metering', 'pricing'] as const) {
    await page
      .locator('.portal-lesson-menu')
      .getByRole('button', { name: nb.foundations.units[unit].title, exact: true })
      .click();
    await expect(page.locator('.portal-manuscript')).toContainText(
      nb.foundations.units[unit].mechanism,
    );
    await expect(page.locator('.learning-core')).toHaveCount(0);
    await page.getByRole('button', { name: nb.foundations.run, exact: true }).click();
    await expect(page.locator('.learning-result')).toBeVisible();
    await audit(page);
  }
  const journal = page.getByRole('button', { name: p.journal, exact: true });
  await journal.click();
  await expect(page.getByRole('dialog')).toContainText(nb.foundations.units.pricing.mechanism);
  await audit(page);
  await page.keyboard.press('Escape');
  await expect(journal).toBeFocused();
  await page.getByRole('button', { name: nb.foundations.transfer, exact: true }).click();
  await audit(page);
});
