import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { toolsNb as c, toolsItemsNb, nb, serverlessNb } from '../../src/content/nb';
import {
  toolsHref,
  toolsKey,
  toolsFacts,
  freshTools,
  applyTools,
  toolsGuidedAnswer,
  type ToolsSave,
  type ToolsMission,
} from '../../src/domain/curriculum/management-tools';
import type { ToolsInput } from '../../src/domain/curriculum/management-tools-model';
import { toolsNativeEvidence } from '../../src/domain/curriculum/management-tools-evidence';
import { toolsContrasts, change, arc } from '../fixtures/management-tools';
import { SandboxStore, sandboxKey } from '../../src/domain/sandbox/store';
import {
  governanceKey,
  freshGovernance,
  applyGovernance,
} from '../../src/domain/curriculum/governance';
import { toolsItems } from '../../src/domain/curriculum/management-tools-items';
import { openCoursePath } from './course-hub-actions';
const bench = (p: Page) => p.locator('.tools-workbench');
const raw = (p: Page, key = toolsKey) => p.evaluate((k) => localStorage.getItem(k), key);
async function facts(p: Page) {
  return toolsFacts(JSON.parse((await raw(p)) ?? JSON.stringify(freshTools())) as ToolsSave);
}
async function studio(p: Page, mission: ToolsMission) {
  await p.goto(toolsHref('studio') + '&perspective=' + mission);
  await bench(p).getByRole('button', { name: c.labels.begin, exact: true }).click();
  await p
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
}
async function closeMilestone(p: Page) {
  if (await p.getByRole('dialog').isVisible()) await p.getByRole('dialog').press('Escape');
}
async function run(p: Page, input: ToolsInput) {
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
async function explain(p: Page, mission: ToolsMission) {
  await bench(p)
    .getByRole('radio', { name: c.causal[mission][toolsGuidedAnswer[mission]], exact: true })
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
async function choose(p: Page, id: keyof typeof toolsItemsNb, d: number, r: number) {
  const form = p.locator('.tools-lesson .compute-assessment form');
  await form.getByRole('radio', { name: toolsItemsNb[id].decisions[d]!, exact: true }).check();
  await form.getByRole('radio', { name: toolsItemsNb[id].reasons[r]!, exact: true }).check();
}
async function technical(p: Page) {
  const bytes = await raw(p, sandboxKey),
    io = new Map<string, string>();
  if (bytes) io.set(sandboxKey, bytes);
  const s = new SandboxStore({
    getItem: (k) => io.get(k) ?? null,
    setItem: (k, v) => {
      io.set(k, v);
    },
    removeItem: (k) => {
      io.delete(k);
    },
  });
  s.load();
  return s.getSnapshot();
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

test('Management follows Governance in path03 with exact assessment resume, sidebar history and non-completing navigation', async ({
  page,
}) => {
  await page.goto('/learn/governance?topic=summary');
  await expect
    .poll(() =>
      page.evaluate(
        (key) =>
          JSON.parse(localStorage.getItem(key) ?? 'null')?.events.some(
            (e: { kind: string; topic?: string }) => e.kind === 'visit' && e.topic === 'summary',
          ) ?? false,
        governanceKey,
      ),
    )
    .toBe(true);
  await page
    .locator('.course-step-navigation')
    .getByRole('link', { name: new RegExp(c.title) })
    .click();
  await expect(page).toHaveURL(toolsHref('introduction'));
  await openCoursePath(page, 'management');
  await expect(page.locator('#course-path-management [aria-current="step"]')).toHaveText(
    c.topics.introduction,
  );
  await page.getByRole('link', { name: c.topics.arm, exact: true }).click();
  await expect(page).toHaveURL(toolsHref('arm'));
  await page.goBack();
  await expect(page).toHaveURL(toolsHref('introduction'));
  await page.goForward();
  await page.reload();
  await expect(page.locator('.tools-lesson h2')).toHaveText(c.topics.arm);
  expect((await facts(page)).completed).toEqual([]);
  await page.goto(toolsHref('assessment', 'mt06'));
  await begin(page);
  await choose(page, 'mt06', 1, 0);
  const before = await raw(page);
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start .course-primary')).toHaveAttribute(
    'href',
    toolsHref('assessment', 'mt06'),
  );
  expect(await raw(page)).toBe(before);
  await page.locator('.learn-hub-start .course-primary').click();
  await page.reload();
  expect((await facts(page)).current).toMatchObject({
    item: 'mt06',
    assisted: false,
    answer: { decision: 1, reason: 0 },
  });
});
test('Same Intent uses five distinct tool descriptions and real Portal group, plan, app, receipts and dependency with exact return', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await studio(page, 'intent');
  for (const input of toolsContrasts.intent) await run(page, input);
  const start = (await facts(page)).guide!;
  expect(start.attempt).toBe(1);
  await bench(page)
    .getByRole('link', { name: new RegExp(c.technical.open) })
    .click();
  await expect(page).toHaveURL(/area=groups.*tools=intent/);
  await create(page, 'group', 'rg-tools-p13', 'norwayeast');
  await expect(page).toHaveURL(/area=resource/);
  await create(page, 'plan', 'plan-tools-p13', 'westeurope');
  await expect(page).toHaveURL(/area=resource/);
  await create(page, 'app', 'app-tools-p13', 'westeurope');
  await expect(page).toHaveURL(/area=resource/);
  const native = await technical(page),
    bytes = await raw(page, sandboxKey);
  expect(native.attempt.responses.slice(-3).map((r) => r.operation)).toEqual([
    'CreateGroup',
    'CreatePlan',
    'CreateWebApp',
  ]);
  expect(native.attempt.responses.slice(-3).every((r) => r.outcome === 'accepted')).toBe(true);
  await page.getByRole('button', { name: nb.portal.returnLearning, exact: true }).click();
  await expect(page).toHaveURL(toolsHref('studio') + '&perspective=intent');
  const panel = bench(page).locator('.tools-technical');
  for (const name of [
    c.technical.inspectScope,
    c.technical.inspectGroup,
    c.technical.inspectPlan,
    c.technical.inspectApp,
    c.technical.inspectDependency,
  ])
    await panel.getByRole('button', { name, exact: true }).click();
  for (const receipt of native.attempt.responses.slice(-3)) {
    await panel
      .getByRole('combobox', { name: c.technical.receipt, exact: true })
      .selectOption(receipt.commandId);
    await panel.getByRole('button', { name: c.technical.inspectReceipt, exact: true }).click();
    await closeMilestone(page);
  }
  await expect(panel).toContainText(c.technical.verified);
  await explain(page, 'intent');
  expect(await raw(page, sandboxKey)).toBe(bytes);
  expect(toolsNativeEvidence((await facts(page)).guide!, native.attempt.engine, 1).complete).toBe(
    true,
  );
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
});
test('IaC stored contrasts distinguish reference, ordering, parameter changes, retained resources and unresolved previews without World mutation', async ({
  page,
}) => {
  let old = applyGovernance(freshGovernance(), { kind: 'begin', item: 'gc01' })!;
  old = applyGovernance(old, { kind: 'draft', answer: { decision: 2, reason: 1 } })!;
  old = applyGovernance(old, { kind: 'submit' })!;
  const prior = JSON.stringify(old);
  await page.addInitScript(
    ({ key, prior }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, prior);
    },
    { key: governanceKey, prior },
  );
  await studio(page, 'change');
  const before = await raw(page, sandboxKey);
  for (const input of toolsContrasts.change) await run(page, input);
  await explain(page, 'change');
  await run(page, change({ syntax: 'bicep', binding: 'dangling' }));
  await expect(bench(page).locator('.tools-result')).toContainText(c.visual.refValid);
  await run(page, change({ baseline: 'dev', evaluation: 'unresolved' }));
  await expect(bench(page).locator('.tools-result')).toContainText(c.visual.changeTypes.unknown);
  await expect(
    bench(page).getByRole('region', { name: c.visual.difference, exact: true }),
  ).not.toContainText(c.visual.changeTypes['no-change']);
  for (const binding of ['dangling', 'wrong-scope'] as const) {
    await run(page, change({ baseline: 'dev', binding, order: 'explicit' }));
    const difference = bench(page).getByRole('region', { name: c.visual.difference, exact: true });
    await expect(difference.getByRole('row').nth(1)).toContainText(
      c.visual.changeTypes['no-change'],
    );
    await expect(difference.getByRole('row').nth(2)).toContainText(c.visual.changeTypes.modify);
    await expect(difference.getByRole('row').nth(2)).not.toContainText(
      c.visual.changeTypes['no-change'],
    );
  }
  await page.reload();
  expect((await facts(page)).completed).toEqual(['change']);
  expect(await raw(page, sandboxKey)).toBe(before);
  expect(await raw(page, governanceKey)).toBe(prior);
});
test('Arc stored contrasts retain physical location and stale representation without claiming migration, resize or stopped local Flux', async ({
  page,
}) => {
  await studio(page, 'arc');
  const before = await raw(page, sandboxKey);
  for (const input of toolsContrasts.arc) await run(page, input);
  await explain(page, 'arc');
  await run(
    page,
    arc({ resource: 'othercloud-server', approach: 'servers', capability: 'resize-vm' }),
  );
  await expect(bench(page).locator('.tools-result')).toContainText(c.visual.notSupported);
  await expect(bench(page).locator('.tools-result')).toContainText(c.visual.arcConnectionBoundary);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.reload();
  expect((await facts(page)).completed).toEqual(['arc']);
  expect(await raw(page, sandboxKey)).toBe(before);
});
test('Structured decisions require a compatible reason and preserve an unaided first through Journal help and retry, including both valid IaC choices', async ({
  page,
}) => {
  await page.goto(toolsHref('assessment', 'mt01'));
  await begin(page);
  const [d, r] = toolsItems.mt01.accepted[0];
  await choose(page, 'mt01', d, (r + 1) % 3);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.fail);
  const first = JSON.stringify((await facts(page)).firsts[0]);
  await begin(page);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.arm.title);
  await page.getByRole('dialog').press('Escape');
  await choose(page, 'mt01', d, r);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  expect(JSON.stringify((await facts(page)).firsts[0])).toBe(first);
  expect((await facts(page)).current).toMatchObject({ retry: true, assisted: true });
  for (const [decision, reason] of toolsItems.mt07.accepted) {
    await page.goto(toolsHref('assessment', 'mt07'));
    await begin(page);
    await choose(page, 'mt07', decision, reason);
    await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
    await expect(page.locator('.compute-feedback')).toContainText(c.assessment.pass);
  }
  await page.goto(toolsHref('assessment', 'mt03'));
  await begin(page);
  await page.goto(toolsHref('assessment', 'mt01'));
  await expect(page.locator('.compute-feedback')).toHaveCount(0);
  expect((await facts(page)).assisted).toBe(false);
});
test('Denied durable assistance and already-open cross-tab conflict hold Journal, Summary and Portal guidance without changing a draft', async ({
  page,
}) => {
  const seed = JSON.stringify(applyTools(freshTools(), { kind: 'begin', item: 'mt03' }));
  await page.addInitScript(
    ({ key, seed }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, seed);
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && sessionStorage.getItem('deny-tools') === 'yes') throw Error('denied');
        return set.call(this, k, v);
      };
    },
    { key: toolsKey, seed },
  );
  await page.goto(toolsHref('assessment', 'mt03'));
  await page.evaluate(() => sessionStorage.setItem('deny-tools', 'yes'));
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.arm.title);
  expect(await raw(page)).toBe(seed);
  await page.getByRole('dialog').press('Escape');
  await page.goto(toolsHref('summary'));
  await expect(page.locator('.tools-summary')).toHaveCount(0);
  expect(await raw(page)).toBe(seed);
  await page.evaluate(() => sessionStorage.removeItem('deny-tools'));
  await page.goto(toolsHref('assessment', 'mt03'));
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.arm.title);
  expect((await facts(page)).assisted).toBe(true);
  const peer = await page.context().newPage();
  await peer.goto('/learn');
  const newer = JSON.stringify(
    applyTools(JSON.parse((await raw(page))!), {
      kind: 'draft',
      answer: { decision: 1, reason: 0 },
    }),
  );
  await peer.evaluate(({ key, newer }) => localStorage.setItem(key, newer), {
    key: toolsKey,
    newer,
  });
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.arm.title);
  expect(await raw(page)).toBe(newer);
  await page.getByRole('dialog').press('Escape');
  await page.goto('/portal');
  await expect(page.locator('.guidance-window')).toHaveCount(0);
  await expect(page.locator('[data-guide-state]')).toHaveCount(0);
  expect(await raw(page)).toBe(newer);
  await peer.close();
});
test('Corrupt scoped Tools history recovers without removing original Sandbox or Governance evidence and navigation gives no credit', async ({
  page,
}) => {
  await studio(page, 'intent');
  const native = await raw(page, sandboxKey);
  await expect(bench(page).locator('.tools-technical')).toContainText(c.technical.emptyReceipts);
  expect((await facts(page)).completed).toEqual([]);
  await page.evaluate(
    ({ key, oldKey, oldBytes }) => {
      localStorage.setItem(key, '{bad');
      localStorage.setItem(oldKey, oldBytes);
    },
    { key: toolsKey, oldKey: governanceKey, oldBytes: JSON.stringify(freshGovernance()) },
  );
  await page.goto(toolsHref('assessment', 'mt01'));
  await page.getByRole('button', { name: c.storage.recover, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.storage.confirm, exact: true })
    .click();
  expect((await facts(page)).attempts).toEqual([]);
  expect(await raw(page, sandboxKey)).toBe(native);
  expect(await raw(page, governanceKey)).toBe(JSON.stringify(freshGovernance()));
});
test('Management desktop and compact keyboard, semantic flows, code focus, short native briefing and reduced motion remain readable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await studio(page, 'change');
  await run(page, change({ syntax: 'bicep' }));
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
    [800, 700],
  ] as const) {
    await page.setViewportSize({ width, height });
    const ctl = bench(page).getByRole('combobox', { name: c.controls.syntax, exact: true });
    await ctl.scrollIntoViewIfNeeded();
    await ctl.focus();
    await expect(ctl).toBeFocused();
    await page.keyboard.press('Tab');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
  await bench(page).locator('.tools-result details summary').click();
  const region = bench(page).getByRole('region', { name: c.visual.snapshot, exact: true });
  await region.focus();
  await expect(region).toBeFocused();
  const code = bench(page).getByLabel(c.visual.definition, { exact: true });
  await code.focus();
  await expect(code).toBeFocused();
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
});
