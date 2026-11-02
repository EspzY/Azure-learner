import { migrationSources } from '../../src/domain/curriculum/migration-sources';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { migrationNb as c, migrationItemsNb, nb, serverlessNb } from '../../src/content/nb';
import {
  migrationHref,
  migrationKey,
  migrationFacts,
  freshMigration,
  applyMigration,
  migrationGuidedAnswer,
  type MigrationSave,
  type MigrationMission,
} from '../../src/domain/curriculum/migration';
import type { MigrationInput } from '../../src/domain/curriculum/migration-model';
import { migrationItems } from '../../src/domain/curriculum/migration-items';
import { migrationContrasts, planning, sync } from '../fixtures/migration';
import { sandboxKey } from '../../src/domain/sandbox/store';
import { toolsKey, freshTools, applyTools } from '../../src/domain/curriculum/management-tools';
import { openCoursePath } from './course-hub-actions';
const bench = (p: Page) => p.locator('.migration-workbench');
const raw = (p: Page, key = migrationKey) => p.evaluate((k) => localStorage.getItem(k), key);
async function facts(p: Page) {
  return migrationFacts(
    JSON.parse((await raw(p)) ?? JSON.stringify(freshMigration())) as MigrationSave,
  );
}
async function studio(p: Page, mission: MigrationMission) {
  await p.goto(migrationHref('studio') + '&perspective=' + mission);
  await bench(p).getByRole('button', { name: c.labels.begin, exact: true }).click();
  await p
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
}
async function closeMilestone(p: Page) {
  if (await p.getByRole('dialog').isVisible()) await p.getByRole('dialog').press('Escape');
}
async function run(p: Page, input: MigrationInput) {
  for (const [key, value] of Object.entries(input)) {
    if (key === 'kind') continue;
    const name = c.controls[key as keyof typeof c.controls];
    const ctl = bench(p).getByRole(typeof value === 'boolean' ? 'checkbox' : 'combobox', {
      name,
      exact: true,
    });
    if (typeof value === 'boolean') {
      if ((await ctl.isChecked()) !== value) await ctl.setChecked(value);
    } else if ((await ctl.inputValue()) !== String(value)) await ctl.selectOption(String(value));
  }
  await bench(p).getByRole('combobox', { name: c.labels.predict, exact: true }).selectOption('1');
  await bench(p).getByRole('button', { name: c.labels.run, exact: true }).click();
  await expect(bench(p).locator('.compute-observation')).toBeVisible();
  await closeMilestone(p);
  expect((await facts(p)).guide?.runs.at(-1)?.input).toEqual(input);
}
async function explain(p: Page, mission: MigrationMission) {
  await bench(p)
    .getByRole('radio', { name: c.causal[mission][migrationGuidedAnswer[mission]], exact: true })
    .check();
  await bench(p).getByRole('button', { name: c.labels.explain, exact: true }).click();
  await expect(bench(p).getByText(c.labels.done, { exact: true })).toBeVisible();
}
async function begin(p: Page) {
  await p
    .getByRole('button', { name: new RegExp(`^(${c.assessment.start}|${c.assessment.retry})$`) })
    .click();
  await p
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
}
async function choose(p: Page, id: keyof typeof migrationItemsNb, d: number, r: number) {
  const form = p.locator('.migration-lesson .compute-assessment form');
  await form.getByRole('radio', { name: migrationItemsNb[id].decisions[d]!, exact: true }).check();
  await form.getByRole('radio', { name: migrationItemsNb[id].reasons[r]!, exact: true }).check();
}
async function area(p: Page, id: 'groups' | 'plans' | 'apps') {
  const link = p
    .getByRole('navigation', { name: nb.portal.navLabel, exact: true })
    .getByRole('link', { name: nb.portal.areas[id], exact: true });
  if (!(await link.isVisible()))
    await p.getByRole('button', { name: nb.portal.menu, exact: true }).click();
  await link.click();
  await expect(p.locator('.portal-title h1')).toHaveText(nb.portal.areas[id]);
}
async function create(p: Page, kind: 'group' | 'plan' | 'app', name: string, region: string) {
  await area(p, kind === 'group' ? 'groups' : kind === 'plan' ? 'plans' : 'apps');
  await p
    .locator('.portal-commandbar')
    .getByRole('button', { name: nb.portal.create, exact: true })
    .click();
  await p
    .getByLabel(kind === 'group' ? nb.portal.groupName : nb.portal.name, { exact: true })
    .fill(name);
  if (kind === 'group')
    await p
      .getByRole('combobox', { name: nb.portal.subscription, exact: true })
      .selectOption('sub-app');
  if (kind === 'app') {
    const options = await p
      .getByRole('combobox', { name: nb.portal.plan, exact: true })
      .locator('option')
      .evaluateAll((els) => els.map((e) => (e as HTMLOptionElement).value).filter(Boolean));
    expect(options).toHaveLength(1);
    await p.getByRole('combobox', { name: nb.portal.plan, exact: true }).selectOption(options[0]!);
  }
  if (kind !== 'app')
    await p.getByRole('combobox', { name: nb.portal.region, exact: true }).selectOption(region);
  await p
    .locator('.portal-create-tabs')
    .getByRole('button', { name: nb.portal.review, exact: true })
    .click();
  await p
    .locator('.portal-create-footer')
    .getByRole('button', { name: nb.portal.create, exact: true })
    .click();
}

test('Storage Part C retains its three-part catalogue and follows Security with exact source links and active resume', async ({
  page,
}) => {
  await page.goto('/learn/security?topic=summary');
  await page
    .locator('.course-step-navigation')
    .getByRole('link', { name: new RegExp(c.title) })
    .click();
  await expect(page).toHaveURL(migrationHref('introduction'));
  await page.goto(migrationHref('summary'));
  const sources = page.locator('.migration-lesson .compute-sources a');
  await expect(sources).toHaveCount(Object.keys(migrationSources).length);
  for (const [id, { url, title }] of Object.entries(migrationSources)) {
    const source = sources.filter({ hasText: new RegExp('^' + id + ' · ') });
    await expect(source).toHaveAttribute('href', url);
    await expect(source).toHaveAttribute('target', '_blank');
    await expect(source).toContainText(title);
  }
  await expect(
    page
      .locator('.course-step-navigation')
      .getByRole('link', { name: new RegExp(nb.course.overview) }),
  ).toHaveAttribute('href', '/learn');
  await page.goto('/learn');
  await openCoursePath(page, 'architecture');
  const path = page
    .locator('.learn-hub-path')
    .filter({ has: page.locator('.learn-hub-module[data-module="migration"]') });
  const order = await path
    .locator('[data-module]')
    .evaluateAll((els) => els.map((e) => e.getAttribute('data-module')));
  expect(order.indexOf('storage')).toBeLessThan(order.indexOf('storage-resilience'));
  expect(order.indexOf('storage-resilience')).toBeLessThan(order.indexOf('migration'));
  expect(order.indexOf('migration')).toBeLessThan(order.indexOf('identity'));
  expect((await facts(page)).completed).toEqual([]);
  await page.goto(migrationHref('assessment', 'fm07'));
  await begin(page);
  await choose(page, 'fm07', 1, 0);
  await page.goto('/learn');
  await page.locator('.course-hub .course-primary').click();
  await expect(page).toHaveURL(migrationHref('assessment', 'fm07'));
  expect((await facts(page)).current?.answer).toEqual({ decision: 1, reason: 0 });
  await page.reload();
  await expect(page.locator('.migration-lesson .compute-assessment form')).toBeVisible();
  await page.goBack();
  await page.goForward();
  await expect(page.locator('.migration-lesson')).toBeVisible();
});
test('Method guide compares valid alternatives automation protocol and fidelity while actual Portal context stays read-only', async ({
  page,
}) => {
  await studio(page, 'method');
  const before = await raw(page, sandboxKey);
  for (const input of migrationContrasts.method) await run(page, input);
  await explain(page, 'method');
  expect(await raw(page, sandboxKey)).toBe(before);
  await bench(page)
    .getByRole('link', { name: new RegExp(c.context.open) })
    .click();
  await expect(page).toHaveURL(/migration=inspect/);
  await create(page, 'group', 'rg-migration-p16', 'norwayeast');
  await create(page, 'plan', 'plan-migration-p16', 'westeurope');
  await create(page, 'app', 'app-migration-p16', 'westeurope');
  const native = await raw(page, sandboxKey);
  await page.getByRole('button', { name: nb.portal.returnLearning, exact: true }).click();
  await expect(page).toHaveURL(migrationHref('studio') + '&perspective=method');
  await studio(page, 'planning');
  await run(page, planning());
  const context = bench(page).locator('.migration-context');
  const picker = context.getByRole('combobox', { name: c.context.select, exact: true });
  const id = await picker
    .locator('option')
    .filter({ hasText: 'app-migration-p16' })
    .getAttribute('value');
  await picker.selectOption(id!);
  await expect(context.locator('dl')).toContainText('app-migration-p16');
  await expect(context.locator('dl')).toContainText('planId:');
  await expect(context.locator('dl')).toContainText('CreateWebApp');
  expect(await raw(page, sandboxKey)).toBe(native);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('Manifest guide preserves direction explicit deletion unresolved conflict and offline tiered-content boundaries', async ({
  page,
}) => {
  await studio(page, 'sync');
  const before = await raw(page, sandboxKey);
  for (const input of migrationContrasts.sync) await run(page, input);
  await explain(page, 'sync');
  await run(page, sync({ method: 'file-sync', scenario: 'concurrent' }));
  await expect(bench(page).locator('.migration-result')).toContainText(
    c.visual.actions['conflict-review'],
  );
  await run(page, sync({ method: 'directional', scenario: 'same-time-different' }));
  await expect(bench(page).locator('.migration-result')).toContainText(
    c.visual.actions['keep-target'],
  );
  await run(
    page,
    sync({ method: 'file-sync', cloudTiering: true, localContent: false, connected: false }),
  );
  await expect(bench(page).locator('.migration-result')).toContainText(
    c.visual.contentStates['offline-unavailable'],
  );
  expect(await raw(page, sandboxKey)).toBe(before);
});
test('Planning guide separates dependencies stale assessment complete transport budgets and declared cutover validation', async ({
  page,
}) => {
  await studio(page, 'planning');
  const before = await raw(page, sandboxKey);
  for (const input of migrationContrasts.planning) await run(page, input);
  await explain(page, 'planning');
  await run(page, planning({ strategy: 'physical', deviceEligible: false }));
  await expect(bench(page).locator('.migration-result')).toContainText(
    c.visual.transportStates.unknown,
  );
  await run(
    page,
    planning({
      dependencies: true,
      strategy: 'physical',
      phase: 'transported',
      transferVerified: true,
    }),
  );
  await expect(bench(page).locator('.migration-result')).toContainText(c.visual.planningLimit);
  await expect(bench(page).locator('.migration-stages li').last()).toHaveAttribute(
    'data-met',
    'false',
  );
  expect(await raw(page, sandboxKey)).toBe(before);
});
test('Independent decisions require compatible reasons and preserve first evidence through assisted retry Journal and exact active shielding', async ({
  page,
}) => {
  await page.goto(migrationHref('assessment', 'fm01'));
  await begin(page);
  const [d, r] = migrationItems.fm01.accepted[0];
  await choose(page, 'fm01', d, (r + 1) % 3);
  await page
    .locator('.migration-lesson form')
    .getByRole('button', { name: c.assessment.submit, exact: true })
    .click();
  await expect(page.locator('.migration-lesson')).toContainText(c.assessment.fail);
  const first = JSON.stringify((await facts(page)).firsts[0]);
  await begin(page);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections['file-sync'].title);
  await page.getByRole('dialog').press('Escape');
  await choose(page, 'fm01', d, r);
  await page
    .locator('.migration-lesson form')
    .getByRole('button', { name: c.assessment.submit, exact: true })
    .click();
  expect(JSON.stringify((await facts(page)).firsts[0])).toBe(first);
  expect((await facts(page)).current).toMatchObject({ retry: true, assisted: true });
  await expect(page.locator('.migration-counterfactual')).toContainText(
    migrationItemsNb.fm01.explain,
  );
  await page.goto(migrationHref('assessment', 'fm06'));
  await begin(page);
  await page.goto(migrationHref('assessment', 'fm01'));
  await expect(page.locator('.migration-counterfactual')).toHaveCount(0);
  await page.goto('/portal');
  await expect(page.locator('.guidance-window')).toHaveCount(0);
  expect((await facts(page)).current?.item).toBe('fm06');
});
test('Denied durable assistance and already-open cross-tab conflict hold Journal, Summary and Portal guidance without changing a draft', async ({
  page,
}) => {
  const seed = JSON.stringify(applyMigration(freshMigration(), { kind: 'begin', item: 'fm03' }));
  await page.addInitScript(
    ({ key, seed }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, seed);
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && sessionStorage.getItem('deny-migration') === 'yes') throw Error('denied');
        return set.call(this, k, v);
      };
    },
    { key: migrationKey, seed },
  );
  await page.goto(migrationHref('assessment', 'fm03'));
  await page.evaluate(() => sessionStorage.setItem('deny-migration', 'yes'));
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.migrate.title);
  expect(await raw(page)).toBe(seed);
  await page.getByRole('dialog').press('Escape');
  await page.goto(migrationHref('summary'));
  await expect(page.locator('.migration-summary')).toHaveCount(0);
  expect(await raw(page)).toBe(seed);
  await page.evaluate(() => sessionStorage.removeItem('deny-migration'));
  await page.goto(migrationHref('assessment', 'fm03'));
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.migrate.title);
  expect((await facts(page)).assisted).toBe(true);
  const peer = await page.context().newPage();
  await peer.goto('/learn');
  const newer = JSON.stringify(
    applyMigration(JSON.parse((await raw(page))!), {
      kind: 'draft',
      answer: { decision: 1, reason: 0 },
    }),
  );
  await peer.evaluate(({ key, newer }) => localStorage.setItem(key, newer), {
    key: migrationKey,
    newer,
  });
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.migrate.title);
  expect(await raw(page)).toBe(newer);
  await page.getByRole('dialog').press('Escape');
  await page.goto('/portal');
  await expect(page.locator('.guidance-window')).toHaveCount(0);
  await expect(page.locator('[data-guide-state]')).toHaveCount(0);
  expect(await raw(page)).toBe(newer);
  await peer.close();
});
test('File Movement desktop and compact keyboard manifest flows short briefing reduced motion Axe and scoped corrupt recovery stay readable', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  let old = applyTools(freshTools(), { kind: 'begin', item: 'mt01' })!;
  old = applyTools(old, { kind: 'abandon' })!;
  const oldBytes = JSON.stringify(old);
  await page.addInitScript(
    ({ key, bytes }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, bytes);
    },
    { key: toolsKey, bytes: oldBytes },
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await studio(page, 'sync');
  await run(page, sync({ method: 'directional', deleteDestination: true }));
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
    [800, 700],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await expect(
      bench(page).getByRole('button', { name: c.labels.run, exact: true }),
    ).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(
      bench(page).getByRole('table', { name: c.visual.manifestTitle, exact: true }),
    ).toBeVisible();
  }
  await bench(page).getByRole('combobox', { name: c.controls.method, exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await expect(
    bench(page).getByRole('combobox', { name: c.controls.direction, exact: true }),
  ).toBeFocused();
  expect(
    (
      await new AxeBuilder({ page })
        .include('.migration-lesson')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await bench(page).getByRole('button', { name: c.labels.recall, exact: true }).click();
  await page.setViewportSize({ width: 1024, height: 500 });
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('region').focus();
  await page.keyboard.press('End');
  await expect(
    dialog.locator('footer').getByRole('button', { name: serverlessNb.close, exact: true }),
  ).toBeVisible();
  await dialog.press('Escape');
  await expect(
    bench(page).getByRole('button', { name: c.labels.recall, exact: true }),
  ).toBeFocused();
  const native = await raw(page, sandboxKey);
  await page.evaluate((key) => localStorage.setItem(key, '{bad'), migrationKey);
  await page.reload();
  await page.getByRole('button', { name: c.storage.recover, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.storage.confirm, exact: true })
    .click();
  expect(await raw(page, toolsKey)).toBe(oldBytes);
  expect(await raw(page, sandboxKey)).toBe(native);
  expect(errors).toEqual([]);
});

test('Independent changed workflows distinguish graphical scripted copy hybrid sync and local cache without World credit', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 500 });
  const originals: unknown[] = [];
  for (const [id, d, r] of [
    ['fm09', 2, 0],
    ['fm10', 2, 2],
  ] as const) {
    await page.setViewportSize(
      id === 'fm10' ? { width: 800, height: 700 } : { width: 1024, height: 500 },
    );
    await page.goto(migrationHref('assessment', id));
    const native = await raw(page, sandboxKey);
    await begin(page);
    await choose(page, id, d, r);
    expect(
      (
        await new AxeBuilder({ page })
          .include('.migration-lesson')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page
      .locator('.migration-lesson form')
      .getByRole('button', { name: c.assessment.submit, exact: true })
      .click();
    await expect(page.locator('.compute-feedback')).toContainText(c.assessment.pass);
    await expect(page.locator('.migration-counterfactual')).toContainText(
      migrationItemsNb[id].explain,
    );
    const f = await facts(page);
    expect(f.firsts.at(-1)).toMatchObject({ item: id, assisted: false, status: 'submitted' });
    expect(f.firsts.slice(0, originals.length)).toEqual(originals);
    originals.splice(0, originals.length, ...f.firsts);
    expect(await raw(page, sandboxKey)).toBe(native);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});
