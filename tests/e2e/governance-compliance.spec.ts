import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { governanceNb as c, governanceItemsNb, nb, serverlessNb } from '../../src/content/nb';
import {
  governanceHref,
  governanceKey,
  governanceFacts,
  freshGovernance,
  applyGovernance,
  governanceGuidedAnswer,
  type GovernanceSave,
  type GovernanceMission,
} from '../../src/domain/curriculum/governance';
import type { GovernanceInput } from '../../src/domain/curriculum/governance-model';
import { governancePolicyEvidence } from '../../src/domain/curriculum/governance-evidence';
import { governanceContrasts, locks } from '../fixtures/governance';
import { SandboxStore, sandboxKey } from '../../src/domain/sandbox/store';
import { accessKey, freshAccess, applyAccess } from '../../src/domain/curriculum/access-control';
import { openCoursePath } from './course-hub-actions';
const bench = (p: Page) => p.locator('.governance-workbench');
const raw = (p: Page, key = governanceKey) => p.evaluate((k) => localStorage.getItem(k), key);
async function facts(p: Page) {
  return governanceFacts(
    JSON.parse((await raw(p)) ?? JSON.stringify(freshGovernance())) as GovernanceSave,
  );
}
async function studio(p: Page, mission: GovernanceMission) {
  await p.goto(governanceHref('studio') + '&perspective=' + mission);
  await bench(p).getByRole('button', { name: c.labels.begin, exact: true }).click();
  await p
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
}
async function closeMilestone(p: Page) {
  if (await p.getByRole('dialog').isVisible()) await p.getByRole('dialog').press('Escape');
}
async function run(p: Page, input: GovernanceInput) {
  for (const [key, value] of Object.entries(input)) {
    if (key === 'kind') continue;
    if (
      input.kind === 'policy' &&
      ((key === 'propertyPresent' && input.rule === 'location') ||
        (['identityReady', 'remediationRequested'].includes(key) &&
          !['modify', 'deploy'].includes(input.effect)) ||
        (key === 'remediationRequested' && input.phase !== 'existing'))
    )
      continue;
    if (
      input.kind === 'locks' &&
      ['second', 'secondScope'].includes(key) &&
      !(await bench(p)
        .locator('.governance-advanced')
        .evaluate((el) => (el as HTMLDetailsElement).open))
    )
      await bench(p).locator('.governance-advanced summary').click();
    const name =
      key === 'target'
        ? input.kind === 'policy'
          ? c.controls.policyTarget
          : c.controls.lockTarget
        : c.controls[key as keyof typeof c.controls];
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
async function explain(p: Page, mission: GovernanceMission) {
  await bench(p)
    .getByRole('radio', { name: c.causal[mission][governanceGuidedAnswer[mission]], exact: true })
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
async function choose(p: Page, id: keyof typeof governanceItemsNb, d: number, r: number) {
  const form = p.locator('.governance-lesson .compute-assessment form');
  await form.getByRole('radio', { name: governanceItemsNb[id].decisions[d]!, exact: true }).check();
  await form.getByRole('radio', { name: governanceItemsNb[id].reasons[r]!, exact: true }).check();
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
async function area(p: Page, id: 'groups' | 'plans') {
  const link = p
    .getByRole('navigation', { name: nb.portal.navLabel, exact: true })
    .getByRole('link', { name: nb.portal.areas[id], exact: true });
  if (!(await link.isVisible()))
    await p.getByRole('button', { name: nb.portal.menu, exact: true }).click();
  await link.click();
  await expect(p.locator('.portal-title h1')).toHaveText(nb.portal.areas[id]);
}
async function create(p: Page, kind: 'group' | 'plan', name: string, region: string) {
  await area(p, kind === 'group' ? 'groups' : 'plans');
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

test('Governance follows Cost in path03 with exact assessment resume, sidebar history and non-completing navigation', async ({
  page,
}) => {
  await page.goto('/learn/cost?topic=summary');
  await page
    .locator('.course-step-navigation')
    .getByRole('link', { name: new RegExp(c.title) })
    .click();
  await expect(page).toHaveURL(governanceHref('introduction'));
  await expect(page.locator('.course-navigation-content')).toContainText(c.title);
  await openCoursePath(page, 'management');
  await expect(page.locator('#course-path-management [aria-current="step"]')).toHaveText(
    c.topics.introduction,
  );
  await page.getByRole('link', { name: c.topics.purview, exact: true }).click();
  await expect(page).toHaveURL(governanceHref('purview'));
  await page.goBack();
  await expect(page).toHaveURL(governanceHref('introduction'));
  await page.goForward();
  await expect(page).toHaveURL(governanceHref('purview'));
  await page.reload();
  await expect(page.locator('.governance-lesson h2')).toHaveText(c.topics.purview);
  expect((await facts(page)).completed).toEqual([]);
  await page.goto(governanceHref('assessment', 'gc06'));
  await begin(page);
  await choose(page, 'gc06', 1, 1);
  const before = await raw(page);
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start .course-primary')).toHaveAttribute(
    'href',
    governanceHref('assessment', 'gc06'),
  );
  expect(await raw(page)).toBe(before);
  await page.locator('.learn-hub-start .course-primary').click();
  await expect(page.locator('.compute-assessment h3')).toHaveText(governanceItemsNb.gc06.title);
  await page.reload();
  expect((await facts(page)).current).toMatchObject({
    item: 'gc06',
    assisted: false,
    answer: { decision: 1, reason: 1 },
  });
});
test('Data governance saves causal curation and separate source-access observations without changing Sandbox or earlier firsts', async ({
  page,
}) => {
  let old = applyAccess(freshAccess(), { kind: 'begin', item: 'ab01' })!;
  old = applyAccess(old, { kind: 'draft', answer: { decision: 1, reason: 2 } })!;
  old = applyAccess(old, { kind: 'submit' })!;
  const prior = JSON.stringify(old),
    xp = JSON.stringify({ version: 1, completed: ['organization-mission-v1'] });
  await page.addInitScript(
    ({ prior, key, xp }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, prior);
      if (!localStorage.getItem('azurelab.progress.v1'))
        localStorage.setItem('azurelab.progress.v1', xp);
    },
    { prior, key: accessKey, xp },
  );
  await page.goto(governanceHref('studio'));
  await bench(page).getByRole('button', { name: c.labels.begin, exact: true }).click();
  await page.getByRole('dialog').press('Escape');
  expect((await facts(page)).guided).toEqual([]);
  await studio(page, 'data');
  const native = await raw(page, sandboxKey);
  for (const input of governanceContrasts.data) await run(page, input);
  await explain(page, 'data');
  await expect(bench(page)).toContainText(c.visual.notAccess);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect((await facts(page)).completed).toEqual(['data']);
  expect(await raw(page, sandboxKey)).toBe(native);
  expect(await raw(page, accessKey)).toBe(prior);
  expect(await raw(page, 'azurelab.progress.v1')).toBe(xp);
});
test('Policy investigation uses unchanged real Portal denial, correction and receipts with a precise Governance return', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await studio(page, 'policy');
  for (const input of governanceContrasts.policy) await run(page, input);
  const start = (await facts(page)).guide!;
  expect(start.attempt).toBe(1);
  await bench(page)
    .getByRole('link', { name: new RegExp(c.technical.open) })
    .click();
  await expect(page).toHaveURL(/area=policy.*governance=policy/);
  await create(page, 'group', 'rg-gov-p12', 'norwayeast');
  await expect(page).toHaveURL(/area=resource/);
  const before = (await technical(page)).attempt.engine.world;
  await create(page, 'plan', 'plan-gov-p12', 'northeurope');
  await expect(page.locator('.chapter-receipt')).toHaveAttribute('data-outcome', 'rejected');
  const deniedView = await technical(page),
    denied = deniedView.attempt.responses.at(-1)!;
  expect(denied).toMatchObject({
    code: 'policy-location-denied',
    beforeRevision: before.revision,
    afterRevision: before.revision,
    addedIds: [],
  });
  expect(deniedView.attempt.engine.world).toEqual(before);
  await page
    .locator('.chapter-receipt')
    .getByRole('button', { name: nb.chapter.editConfiguration, exact: true })
    .click();
  await page
    .getByRole('combobox', { name: nb.portal.region, exact: true })
    .selectOption('westeurope');
  await page
    .locator('.portal-create-tabs')
    .getByRole('button', { name: nb.portal.review, exact: true })
    .click();
  await page
    .locator('.portal-create-footer')
    .getByRole('button', { name: nb.portal.create, exact: true })
    .click();
  await expect(page).toHaveURL(/area=resource/);
  const acceptedView = await technical(page),
    accepted = acceptedView.attempt.responses.at(-1)!;
  expect(accepted.outcome).toBe('accepted');
  const technicalBytes = await raw(page, sandboxKey);
  await page.getByRole('button', { name: nb.portal.returnLearning, exact: true }).click();
  await expect(page).toHaveURL(governanceHref('studio') + '&perspective=policy');
  const panel = bench(page).locator('.governance-technical');
  for (const label of [
    c.technical.inspectPolicy,
    c.technical.inspectScope,
    c.technical.inspectGroup,
  ])
    await panel.getByRole('button', { name: label, exact: true }).click();
  for (const receipt of [denied, accepted]) {
    await panel
      .getByRole('combobox', { name: c.technical.receipt, exact: true })
      .selectOption(receipt.commandId);
    await panel.getByRole('button', { name: c.technical.inspectReceipt, exact: true }).click();
    await closeMilestone(page);
  }
  await expect(panel).toContainText(c.technical.verified);
  await explain(page, 'policy');
  expect(await raw(page, sandboxKey)).toBe(technicalBytes);
  const save = JSON.parse((await raw(page))!) as GovernanceSave;
  expect(
    governancePolicyEvidence(governanceFacts(save).guide!, acceptedView.attempt.engine, 1).complete,
  ).toBe(true);
  await page.reload();
  await expect(bench(page).getByText(c.labels.done, { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test('Lock investigation distinguishes modification, POST, data deletion and whole-group descendants without an operative lock', async ({
  page,
}) => {
  await studio(page, 'locks');
  const native = await raw(page, sandboxKey);
  for (const input of governanceContrasts.locks) await run(page, input);
  await explain(page, 'locks');
  await run(
    page,
    locks({ lock: 'readonly', scope: 'sub-app', second: 'delete', secondScope: 'vm' }),
  );
  await expect(bench(page).locator('.governance-result')).toContainText(c.visual.lockCauses.lock);
  await run(page, locks({ target: 'account', operation: 'start-vm' }));
  await expect(bench(page).locator('.governance-result')).toContainText(
    c.visual.lockCauses.outside,
  );
  expect(await raw(page, sandboxKey)).toBe(native);
  expect((await facts(page)).completed).toEqual(['locks']);
});
test('Governance first submission, complete reason, durable Journal help and retry retain original classifications', async ({
  page,
}) => {
  await page.goto(governanceHref('assessment', 'gc09'));
  await begin(page);
  await expect(page.locator('.compute-feedback')).toHaveCount(0);
  await expect(page.getByRole('group', { name: c.assessment.reason, exact: true })).toBeVisible();
  await choose(page, 'gc09', 0, 1);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.fail);
  const first = JSON.stringify((await facts(page)).firsts[0]);
  await begin(page);
  await choose(page, 'gc09', 0, 0);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.purview.title);
  expect((await facts(page)).assisted).toBe(true);
  await page.getByRole('dialog').press('Escape');
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.pass);
  expect(JSON.stringify((await facts(page)).firsts[0])).toBe(first);
  await page.goto(governanceHref('assessment', 'gc05'));
  await begin(page);
  await choose(page, 'gc05', 0, 1);
  await page.goto(governanceHref('assessment', 'gc09'));
  await expect(page.locator('.compute-feedback')).toHaveCount(0);
  expect((await facts(page)).assisted).toBe(false);
});
test('Governance denied assistance, already-open cross-tab Journal, Summary and Portal shielding stay fail-closed', async ({
  page,
}) => {
  const seed = JSON.stringify(applyGovernance(freshGovernance(), { kind: 'begin', item: 'gc03' }));
  await page.addInitScript(
    ({ key, seed }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, seed);
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && sessionStorage.getItem('deny-governance') === 'yes') throw Error('denied');
        return set.call(this, k, v);
      };
    },
    { key: governanceKey, seed },
  );
  await page.goto(governanceHref('assessment', 'gc03'));
  await page.evaluate(() => sessionStorage.setItem('deny-governance', 'yes'));
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.purview.title);
  expect(await raw(page)).toBe(seed);
  await page.getByRole('dialog').press('Escape');
  await page.goto(governanceHref('summary'));
  await expect(page.locator('.governance-summary')).toHaveCount(0);
  expect(await raw(page)).toBe(seed);
  await page.evaluate(() => sessionStorage.removeItem('deny-governance'));
  await page.goto(governanceHref('assessment', 'gc03'));
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.purview.title);
  expect((await facts(page)).assisted).toBe(true);
  const peer = await page.context().newPage();
  await peer.goto('/learn');
  const newer = JSON.stringify(
    applyGovernance(JSON.parse((await raw(page))!), {
      kind: 'draft',
      answer: { decision: 1, reason: 0 },
    }),
  );
  await peer.evaluate(({ key, newer }) => localStorage.setItem(key, newer), {
    key: governanceKey,
    newer,
  });
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.purview.title);
  expect(await raw(page)).toBe(newer);
  await page.getByRole('dialog').press('Escape');
  await page.goto('/portal');
  await expect(page.locator('.guidance-window')).toHaveCount(0);
  await expect(page.locator('[data-guide-state]')).toHaveCount(0);
  expect(await raw(page)).toBe(newer);
  await peer.close();
});
test('Old Policy receipts and corrupt scoped history cannot create new investigation credit or remove technical records', async ({
  page,
}) => {
  const io = new Map<string, string>(),
    store = new SandboxStore({
      getItem: (k) => io.get(k) ?? null,
      setItem: (k, v) => {
        io.set(k, v);
      },
      removeItem: (k) => {
        io.delete(k);
      },
    });
  store.load();
  let seq = 0;
  const command = (c: Record<string, string>) =>
    store.dispatch({
      kind: 'command',
      request: {
        commandId: `old-gov-${++seq}`,
        expectedWorldRevision: store.getSnapshot().attempt.engine.world.revision,
        command: c,
      },
    });
  command({
    type: 'CreateGroup',
    subscriptionId: 'sub-app',
    name: 'rg-old-gov',
    metadataRegion: 'norwayeast',
  });
  const group = store.getSnapshot().attempt.engine.world.groups[0]!;
  command({
    type: 'CreatePlan',
    groupId: group.id,
    name: 'plan-old-gov',
    region: 'northeurope',
    profile: 'linux-learning-v1',
  });
  command({
    type: 'CreatePlan',
    groupId: group.id,
    name: 'plan-old-gov',
    region: 'westeurope',
    profile: 'linux-learning-v1',
  });
  const bytes = io.get(sandboxKey)!;
  await page.addInitScript(
    ({ key, bytes }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, bytes);
    },
    { key: sandboxKey, bytes },
  );
  await studio(page, 'policy');
  for (const input of governanceContrasts.policy) await run(page, input);
  await expect(bench(page).locator('.governance-technical')).toContainText(
    c.technical.emptyReceipts,
  );
  await expect(bench(page).getByText(c.labels.done, { exact: true })).toHaveCount(0);
  const original = await raw(page, sandboxKey);
  await page.evaluate((key) => localStorage.setItem(key, '{bad'), governanceKey);
  await page.goto(governanceHref('assessment', 'gc01'));
  await page.getByRole('button', { name: c.storage.recover, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.storage.confirm, exact: true })
    .click();
  expect((await facts(page)).attempts).toEqual([]);
  expect(await raw(page, sandboxKey)).toBe(original);
});
test('Governance desktop and compact keyboard, short native briefing, semantic alternatives and reduced motion remain readable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await studio(page, 'locks');
  await run(page, locks({ lock: 'readonly', operation: 'start-vm' }));
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
    [800, 700],
  ] as const) {
    await page.setViewportSize({ width, height });
    const ctl = bench(page).getByRole('combobox', { name: c.controls.operation, exact: true });
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
  await bench(page).locator('.governance-result details summary').click();
  const region = bench(page).getByRole('region', { name: c.visual.snapshot, exact: true });
  await region.focus();
  await expect(region).toBeFocused();
  await bench(page).locator('pre').focus();
  await expect(bench(page).locator('pre')).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
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
