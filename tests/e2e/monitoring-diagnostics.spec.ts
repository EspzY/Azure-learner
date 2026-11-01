import { monitoringSources } from '../../src/domain/curriculum/monitoring-sources';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { monitoringNb as c, monitoringItemsNb, nb, serverlessNb } from '../../src/content/nb';
import {
  monitoringHref,
  monitoringKey,
  monitoringFacts,
  freshMonitoring,
  applyMonitoring,
  monitoringGuidedAnswer,
  type MonitoringSave,
  type MonitoringMission,
} from '../../src/domain/curriculum/monitoring';
import type { MonitoringInput } from '../../src/domain/curriculum/monitoring-model';
import { monitoringItems } from '../../src/domain/curriculum/monitoring-items';
import { monitoringContrasts, telemetry, health } from '../fixtures/monitoring';
import { sandboxKey } from '../../src/domain/sandbox/store';
import { toolsKey, freshTools, applyTools } from '../../src/domain/curriculum/management-tools';
import { openCoursePath } from './course-hub-actions';
const bench = (p: Page) => p.locator('.monitoring-workbench');
const raw = (p: Page, key = monitoringKey) => p.evaluate((k) => localStorage.getItem(k), key);
async function facts(p: Page) {
  return monitoringFacts(
    JSON.parse((await raw(p)) ?? JSON.stringify(freshMonitoring())) as MonitoringSave,
  );
}
async function studio(p: Page, mission: MonitoringMission) {
  await p.goto(monitoringHref('studio') + '&perspective=' + mission);
  await bench(p).getByRole('button', { name: c.labels.begin, exact: true }).click();
  await p
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
}
async function closeMilestone(p: Page) {
  if (await p.getByRole('dialog').isVisible()) await p.getByRole('dialog').press('Escape');
}
async function run(p: Page, input: MonitoringInput) {
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
async function explain(p: Page, mission: MonitoringMission) {
  await bench(p)
    .getByRole('radio', { name: c.causal[mission][monitoringGuidedAnswer[mission]], exact: true })
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
async function choose(p: Page, id: keyof typeof monitoringItemsNb, d: number, r: number) {
  const form = p.locator('.monitoring-lesson .compute-assessment form');
  await form.getByRole('radio', { name: monitoringItemsNb[id].decisions[d]!, exact: true }).check();
  await form.getByRole('radio', { name: monitoringItemsNb[id].reasons[r]!, exact: true }).check();
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

test('Monitoring follows Management in path03 with exact active resume, client Back Forward and non-completing navigation', async ({
  page,
}) => {
  await page.goto('/learn/management-tools?topic=summary');
  await page
    .locator('.course-step-navigation')
    .getByRole('link', { name: new RegExp(c.title) })
    .click();
  await expect(page).toHaveURL(monitoringHref('introduction'));
  await expect(page.locator('.monitoring-lesson')).toContainText(c.sections.introduction.title);
  await page.goto(monitoringHref('summary'));
  const sources = page.locator('.monitoring-lesson .compute-sources a');
  await expect(sources).toHaveCount(Object.keys(monitoringSources).length);
  for (const [id, [url, title]] of Object.entries(monitoringSources)) {
    const source = sources.filter({ hasText: new RegExp('^' + id + ' · ') });
    await expect(source).toHaveAttribute('href', url);
    await expect(source).toHaveAttribute('target', '_blank');
    await expect(source).toContainText(title.replace(/^'|'$/g, ''));
  }
  await page.goto('/learn');
  await openCoursePath(page, 'management');
  await expect(page.locator('.learn-hub-module[data-module="monitoring"]')).toBeVisible();
  expect((await facts(page)).completed).toEqual([]);
  await page.goto(monitoringHref('assessment', 'md07'));
  await begin(page);
  await choose(page, 'md07', 1, 0);
  await page.goto('/learn');
  await page.locator('.course-hub .course-primary').click();
  await expect(page).toHaveURL(monitoringHref('assessment', 'md07'));
  expect((await facts(page)).current?.answer).toEqual({ decision: 1, reason: 0 });
  await page.reload();
  await expect(page.locator('.monitoring-lesson .compute-assessment form')).toBeVisible();
  await page.goBack();
  await page.goForward();
  await expect(page.locator('.monitoring-lesson')).toBeVisible();
});
test('Evidence guide stores source freshness and category contrasts; actual Portal context stays separate and returns exactly', async ({
  page,
}) => {
  await studio(page, 'evidence');
  const before = await raw(page, sandboxKey);
  for (const input of monitoringContrasts.evidence) await run(page, input);
  await explain(page, 'evidence');
  expect(await raw(page, sandboxKey)).toBe(before);
  await bench(page)
    .getByRole('link', { name: new RegExp(c.context.open) })
    .click();
  await expect(page).toHaveURL(/monitoring=inspect/);
  await create(page, 'group', 'rg-monitoring-p14', 'norwayeast');
  await create(page, 'plan', 'plan-monitoring-p14', 'westeurope');
  await create(page, 'app', 'app-monitoring-p14', 'westeurope');
  const native = await raw(page, sandboxKey);
  await page.getByRole('button', { name: nb.portal.returnLearning, exact: true }).click();
  await expect(page).toHaveURL(monitoringHref('studio') + '&perspective=evidence');
  await studio(page, 'telemetry');
  await run(page, telemetry());
  await expect(bench(page).locator('.monitoring-context')).toContainText('plan-monitoring-p14');
  expect(await raw(page, sandboxKey)).toBe(native);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('Health guide distinguishes scope public gaps Unknown historical records and unsupported checks without confirmed app cause', async ({
  page,
}) => {
  await studio(page, 'health');
  const before = await raw(page, sandboxKey);
  for (const input of monitoringContrasts.health) await run(page, input);
  await explain(page, 'health');
  await run(page, health({ event: 'maintenance', supported: false }));
  await expect(bench(page).locator('.monitoring-result')).toContainText(c.visual.notSupported);
  await expect(bench(page).locator('.monitoring-result')).toContainText(c.visual.correlation);
  expect(await raw(page, sandboxKey)).toBe(before);
  expect((await facts(page)).completed).toContain('health');
});
test('Telemetry guide separates aggregation missing data collection matched rule notification and filtered traces without runtime mutation', async ({
  page,
}) => {
  await studio(page, 'telemetry');
  const before = await raw(page, sandboxKey);
  for (const input of monitoringContrasts.telemetry) await run(page, input);
  await explain(page, 'telemetry');
  await run(page, telemetry({ coverage: 'gap', rule: 'enabled', aggregation: 'average' }));
  await expect(bench(page).locator('.monitoring-result')).toContainText(
    c.visual.assessments['insufficient-data'],
  );
  await expect(bench(page).locator('.monitoring-result')).toContainText('62,5');
  await run(page, telemetry({ rule: 'enabled', ruleSignal: 'duration' }));
  await expect(bench(page).locator('.monitoring-result')).toContainText(
    c.visual.assessments['different-signal'],
  );
  await run(
    page,
    telemetry({ logSource: 'application', instrumented: true, filter: 'operation-a' }),
  );
  await expect(bench(page).locator('.monitoring-trace')).toContainText('TimeoutException');
  await expect(bench(page).locator('.monitoring-result')).toContainText(c.visual.notSent);
  expect(await raw(page, sandboxKey)).toBe(before);
});
test('Independent decisions require compatible reasons and preserve first evidence through assisted retry Journal and exact active shielding', async ({
  page,
}) => {
  await page.goto(monitoringHref('assessment', 'md01'));
  await begin(page);
  const [d, r] = monitoringItems.md01.accepted[0];
  await choose(page, 'md01', d, (r + 1) % 3);
  await page
    .locator('.monitoring-lesson form')
    .getByRole('button', { name: c.assessment.submit, exact: true })
    .click();
  await expect(page.locator('.monitoring-lesson')).toContainText(c.assessment.fail);
  const first = JSON.stringify((await facts(page)).firsts[0]);
  await begin(page);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.logs.title);
  await page.getByRole('dialog').press('Escape');
  await choose(page, 'md01', d, r);
  await page
    .locator('.monitoring-lesson form')
    .getByRole('button', { name: c.assessment.submit, exact: true })
    .click();
  expect(JSON.stringify((await facts(page)).firsts[0])).toBe(first);
  expect((await facts(page)).current).toMatchObject({ retry: true, assisted: true });
  await expect(page.locator('.monitoring-counterfactual')).toContainText(
    monitoringItemsNb.md01.explain,
  );
  await page.goto(monitoringHref('assessment', 'md06'));
  await begin(page);
  await page.goto(monitoringHref('assessment', 'md01'));
  await expect(page.locator('.monitoring-counterfactual')).toHaveCount(0);
  await page.goto('/portal');
  await expect(page.locator('.guidance-window')).toHaveCount(0);
  expect((await facts(page)).current?.item).toBe('md06');
});
test('Denied durable assistance and already-open cross-tab conflict hold Journal, Summary and Portal guidance without changing a draft', async ({
  page,
}) => {
  const seed = JSON.stringify(applyMonitoring(freshMonitoring(), { kind: 'begin', item: 'md03' }));
  await page.addInitScript(
    ({ key, seed }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, seed);
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && sessionStorage.getItem('deny-monitoring') === 'yes') throw Error('denied');
        return set.call(this, k, v);
      };
    },
    { key: monitoringKey, seed },
  );
  await page.goto(monitoringHref('assessment', 'md03'));
  await page.evaluate(() => sessionStorage.setItem('deny-monitoring', 'yes'));
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.monitor.title);
  expect(await raw(page)).toBe(seed);
  await page.getByRole('dialog').press('Escape');
  await page.goto(monitoringHref('summary'));
  await expect(page.locator('.monitoring-summary')).toHaveCount(0);
  expect(await raw(page)).toBe(seed);
  await page.evaluate(() => sessionStorage.removeItem('deny-monitoring'));
  await page.goto(monitoringHref('assessment', 'md03'));
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.monitor.title);
  expect((await facts(page)).assisted).toBe(true);
  const peer = await page.context().newPage();
  await peer.goto('/learn');
  const newer = JSON.stringify(
    applyMonitoring(JSON.parse((await raw(page))!), {
      kind: 'draft',
      answer: { decision: 1, reason: 0 },
    }),
  );
  await peer.evaluate(({ key, newer }) => localStorage.setItem(key, newer), {
    key: monitoringKey,
    newer,
  });
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.monitor.title);
  expect(await raw(page)).toBe(newer);
  await page.getByRole('dialog').press('Escape');
  await page.goto('/portal');
  await expect(page.locator('.guidance-window')).toHaveCount(0);
  await expect(page.locator('[data-guide-state]')).toHaveCount(0);
  expect(await raw(page)).toBe(newer);
  await peer.close();
});
test('Monitoring desktop and compact keyboard short briefing semantic tables reduced motion Axe and scoped corrupt recovery stay readable', async ({
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
  await studio(page, 'telemetry');
  await run(page, telemetry({ rule: 'enabled', routed: true, instrumented: true }));
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
      bench(page).getByRole('table', { name: c.visual.chart, exact: true }),
    ).toBeVisible();
  }
  await bench(page).getByRole('combobox', { name: c.controls.coverage, exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await expect(
    bench(page).getByRole('combobox', { name: c.controls.aggregation, exact: true }),
  ).toBeFocused();
  expect(
    (
      await new AxeBuilder({ page })
        .include('.monitoring-lesson')
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
  await page.evaluate((key) => localStorage.setItem(key, '{bad'), monitoringKey);
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
