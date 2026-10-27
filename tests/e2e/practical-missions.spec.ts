import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { missionsNb as c, nb, labsNb as lab, learningPolishNb } from '../../src/content/nb';
import {
  missionKey,
  missionFacts,
  missionOrigin,
  type MissionId,
  type MissionSave,
  freshMissions,
  missionAnswerIds,
} from '../../src/domain/sandbox/missions';
import { SandboxStore, sandboxKey, restoreSandbox } from '../../src/domain/sandbox/store';
import type { Command } from '../../src/domain/sandbox/model';
import { editAppSetting } from './portal-actions';
import { expansionKeys, fresh as freshExpansion } from '../../src/domain/curriculum/expansion';
test.setTimeout(240000);
test.use({ actionTimeout: 15000 });
const p = nb.portal;
async function seed(page: Page, kind: 'vm' | 'app') {
  const values = new Map<string, string>(),
    store = new SandboxStore({
      getItem: (k) => values.get(k) ?? null,
      setItem: (k, v) => {
        values.set(k, v);
      },
      removeItem: (k) => {
        values.delete(k);
      },
    });
  store.load();
  const send = (command: Command) => {
    const view = store.getSnapshot();
    store.dispatch({
      kind: 'command',
      request: {
        commandId: `fixture-${view.attempt.engine.ledger.length + 1}`,
        expectedWorldRevision: view.attempt.engine.world.revision,
        command,
      },
      bindResult: false,
    });
    return store.getSnapshot().attempt.engine.ledger.at(-1)!.receipt.addedIds[0]!;
  };
  const group = send({
    type: 'CreateGroup',
    name: 'rg-existing',
    subscriptionId: 'sub-app',
    metadataRegion: 'norwayeast',
  });
  if (kind === 'vm')
    send({
      type: 'CreateVmBundle',
      groupId: group,
      name: 'vm-existing',
      region: 'northeurope',
      image: 'ubuntu-22-04',
      profile: 'small',
      dataDiskGiB: '0',
      subnetId: '',
    });
  else {
    const plan = send({
      type: 'CreatePlan',
      groupId: group,
      name: 'plan-existing',
      region: 'westeurope',
      profile: 'linux-learning-v1',
    });
    send({ type: 'CreateWebApp', groupId: group, name: 'app-existing', planId: plan });
  }
  await page.addInitScript(
    ({ key, raw }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, raw);
    },
    { key: sandboxKey, raw: values.get(sandboxKey)! },
  );
}
async function start(page: Page, id: MissionId, mode = 'guided') {
  await page.goto('/');
  await page
    .locator('.mission-discovery')
    .getByRole('link', { name: c.missions[id].title, exact: true })
    .click();
  const entry = page.getByRole('region', { name: c.missions[id].title, exact: true });
  await expect(entry).toContainText(c.missions[id].bridge);
  if (mode === 'guided') {
    const before = await page.evaluate(() =>
      localStorage.getItem('azurelab.practical-missions.v1'),
    );
    await entry.getByRole('button', { name: c.start, exact: true }).click();
    const dialog = page.getByRole('dialog', { name: c.missions[id].title, exact: true });
    await expect(dialog).toContainText(c.missions[id].observation);
    await dialog
      .getByRole('button', { name: learningPolishNb.briefing.cancel, exact: true })
      .click();
    expect(await page.evaluate(() => localStorage.getItem('azurelab.practical-missions.v1'))).toBe(
      before,
    );
    await entry.getByRole('button', { name: c.start, exact: true }).click();
    await dialog
      .getByRole('button', { name: learningPolishNb.briefing.start, exact: true })
      .click();
  } else await entry.getByRole('button', { name: c.independent, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`mission=${id}`));
  await expect(page.locator('.mission-coach')).toContainText(c.missions[id].title);
}
async function area(page: Page, area: keyof typeof p.areas) {
  await expect(page.locator('.portal-title h1')).toBeVisible();
  const nav = page.getByRole('navigation', { name: p.navLabel, exact: true });
  if (!(await nav.isVisible()))
    await page.getByRole('button', { name: p.menu, exact: true }).click();
  await expect(nav).toBeVisible();
  const link = nav.getByRole('link', { name: p.areas[area], exact: true });
  if (!(await link.isVisible())) await nav.locator('.portal-learning-tools > summary').click();
  await link.click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas[area]);
}
async function create(
  page: Page,
  kind: 'group' | 'plan' | 'app',
  name: string,
  subscription = 'sub-app',
  region = 'westeurope',
  groupName = 'rg-mission',
) {
  await area(page, kind === 'group' ? 'groups' : kind === 'plan' ? 'plans' : 'apps');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`area=create.*kind=${kind}`));
  await expect(page.locator('.portal-title h1')).toHaveText(p.createTitles[kind]);
  if (kind === 'group') {
    await page
      .getByRole('combobox', { name: p.subscription, exact: true })
      .selectOption(subscription);
    await expect(page.getByRole('combobox', { name: p.subscription, exact: true })).toHaveValue(
      subscription,
    );
    await page.getByLabel(p.groupName, { exact: true }).fill(name);
  } else {
    await page
      .getByRole('combobox', { name: p.subscription, exact: true })
      .selectOption(subscription);
    await page
      .getByRole('combobox', { name: p.group, exact: true })
      .selectOption({ label: groupName });
    await page.getByLabel(p.name, { exact: true }).fill(name);
  }
  if (kind === 'app') {
    const selector = page.locator('[data-guide="plan"]');
    await selector.selectOption({ index: (await selector.locator('option').count()) - 1 });
  } else await page.getByRole('combobox', { name: p.region, exact: true }).selectOption(region);
  await page
    .locator('.portal-create-tabs')
    .getByRole('button', { name: p.review, exact: true })
    .click();
  if (kind === 'group')
    await expect(page.locator('.portal-review')).toContainText(
      subscription === 'sub-shared' ? 'Shared Sandbox' : 'App Sandbox',
    );
  await page.locator('[data-guide="commit"]').click();
  await expect(page).toHaveURL(/area=(resource|activity)/);
  if (kind === 'group') {
    await expect(page.locator('.portal-title h1')).toHaveText(name);
    await expect(page.locator('.portal-essentials')).toContainText(
      subscription === 'sub-shared' ? 'Shared Sandbox' : 'App Sandbox',
    );
  }
}
async function vm(page: Page, independent = false) {
  await area(page, 'vms');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page
    .locator('[data-guide="subscription"]')
    .selectOption(independent ? 'sub-app' : 'sub-shared');
  await page.locator('[data-guide="group"]').selectOption({ index: 1 });
  await page
    .getByLabel(lab.vm.name, { exact: true })
    .fill(independent ? 'vm-transfer' : 'vm-converter');
  await page
    .locator('[data-guide="vm-image"]')
    .selectOption(independent ? 'windows-2022' : 'ubuntu-22-04');
  await page.locator('[data-guide="vm-profile"]').selectOption(independent ? 'small' : 'standard');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Disks', exact: true })
    .click();
  await page.getByRole('combobox', { name: lab.vm.dataDisk, exact: true }).selectOption('32');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Review + create', exact: true })
    .click();
  await page.locator('[data-guide="commit"]').click();
  await expect(page).toHaveURL(/area=resource/);
}
async function closeObservation(page: Page) {
  const dialog = page.locator('dialog[open]');
  if (await dialog.count()) {
    await expect(dialog).toHaveCount(1);
    if (await dialog.getAttribute('data-milestone'))
      await dialog.getByRole('button', { name: nb.milestones.close, exact: true }).click();
    else await dialog.getByRole('button', { name: 'Lukk', exact: true }).last().click();
  }
}
async function inspectCurrent(page: Page) {
  await closeObservation(page);
  const coach = page.locator('.mission-coach');
  await coach
    .getByRole('button', { name: new RegExp(`^(?:${c.inspect}|${c.inspected}) ·`) })
    .click();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await closeObservation(page);
}
async function selectCurrent(page: Page) {
  await page
    .locator('.mission-coach')
    .getByRole('button', { name: new RegExp(`^${c.select} ·`) })
    .click();
}
async function inspectAll(page: Page) {
  const links = await page
    .locator('.mission-coach .mission-actual a')
    .evaluateAll((links) =>
      links.map((a) => ({ href: (a as HTMLAnchorElement).href, text: a.textContent ?? '' })),
    );
  for (const link of links) {
    await page
      .locator('.mission-coach')
      .getByRole('link', { name: link.text, exact: true })
      .click();
    await inspectCurrent(page);
  }
}
async function returnCourse(page: Page, id: MissionId) {
  await page.locator('.mission-coach').getByRole('link', { name: c.return, exact: true }).click();
  await expect(page).toHaveURL(missionOrigin(id));
  await expect(page.locator('.mission-activity')).toBeVisible();
}
async function inspectFromCourse(page: Page, id: MissionId) {
  const names = await page.locator('.mission-activity .mission-actual a').allTextContents();
  for (const name of names) {
    await page
      .locator('.mission-activity .mission-actual')
      .getByRole('link', { name, exact: true })
      .click();
    await inspectCurrent(page);
    await returnCourse(page, id);
  }
}
async function reflect(page: Page, id: MissionId, wrong = false) {
  const activity = page.locator('.mission-activity');
  const choices = c.missions[id].choices as Record<string, readonly [string, string]>;
  const ids = {
    diagnose: ['dependency', 'declared-path'],
    governance: ['resource-location', 'bounded-check'],
    infrastructure: ['guest-control', 'retained-operations'],
    platform: ['managed-os', 'config-only'],
  }[id];
  const session = missionFacts(await state(page)).current!;
  if (id === 'platform' && session.mode === 'independent') {
    ids[0] = missionAnswerIds(session).decision[0]!;
    ids[1] = missionAnswerIds(session).reason[0]!;
  }
  await activity
    .getByRole('radio', {
      name: choices[wrong ? Object.keys(choices)[1]! : ids[0]!]![0],
      exact: true,
    })
    .check();
  await activity.getByRole('radio', { name: choices[ids[1]!]![0], exact: true }).check();
  await activity.getByRole('button', { name: c.submit, exact: true }).click();
}
async function state(page: Page) {
  return JSON.parse(
    (await page.evaluate((key) => localStorage.getItem(key), missionKey)) ?? 'null',
  ) as MissionSave;
}
async function shot(page: Page, info: TestInfo, name: string) {
  await page.screenshot({ path: info.outputPath(`pr24-${name}.png`), fullPage: false });
}
async function compositions(page: Page, info: TestInfo, name: string) {
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await shot(page, info, `${name}-${width}x${height}`);
    if (name === 'diagnosis-model') {
      await page
        .locator('.mission-model-result table')
        .evaluate((table) => table.scrollIntoView({ block: 'center' }));
      const table = await page.locator('.mission-model-result table').boundingBox();
      const footer = await page.locator('.course-step-navigation').boundingBox();
      expect(table!.y).toBeGreaterThanOrEqual(65);
      expect(table!.y + table!.height).toBeLessThanOrEqual(footer!.y);
      await shot(page, info, `diagnosis-result-${width}x${height}`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
}
test('Benefits diagnosis: root → existing real chain → distinct failure/routing model → causal debrief → immutable resume', async ({
  page,
}, info) => {
  await seed(page, 'vm');
  await start(page, 'diagnose');
  await page.getByRole('button', { name: 'vm-existing', exact: true }).click();
  await selectCurrent(page);
  await inspectAll(page);
  await returnCourse(page, 'diagnose');
  const model = page.locator('.mission-diagnosis');
  await model.getByRole('combobox', { name: c.model.prediction, exact: true }).selectOption('1');
  await model.getByRole('button', { name: c.model.run, exact: true }).click();
  await expect(model.locator('[role="status"]')).toContainText(`${c.model.actual}: 0`);
  await model
    .getByRole('combobox', { name: c.model.isolation, exact: true })
    .selectOption('independent');
  await expect(model.getByRole('button', { name: c.model.run, exact: true })).toBeDisabled();
  await expect(model).toContainText(c.model.stale);
  await model.getByRole('combobox', { name: c.model.prediction, exact: true }).selectOption('1');
  await model.getByRole('button', { name: c.model.run, exact: true }).click();
  await expect(page.getByRole('dialog', { name: c.milestone.title, exact: true })).toBeVisible();
  await shot(page, info, 'diagnosis-milestone');
  await closeObservation(page);
  await expect(model.locator('[role="status"]')).toContainText(`${c.model.actual}: 1`);
  await compositions(page, info, 'diagnosis-model');
  await reflect(page, 'diagnose');
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  const saved = await state(page);
  expect(missionFacts(saved).current?.mode).toBe('guided');
  await page.reload();
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  expect(await state(page)).toEqual(saved);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page
    .locator('.mission-entry')
    .getByRole('button', { name: c.independent, exact: true })
    .click();
  await page.getByRole('button', { name: 'vm-existing', exact: true }).click();
  await selectCurrent(page);
  await returnCourse(page, 'diagnose');
  await inspectFromCourse(page, 'diagnose');
  await model.getByRole('combobox', { name: c.model.failure, exact: true }).selectOption('os');
  await model.getByRole('combobox', { name: c.model.routing, exact: true }).selectOption('single');
  await model.getByRole('combobox', { name: c.model.prediction, exact: true }).selectOption('0');
  await model.getByRole('button', { name: c.model.run, exact: true }).click();
  await model
    .getByRole('combobox', { name: c.model.routing, exact: true })
    .selectOption('balanced');
  await model.getByRole('combobox', { name: c.model.prediction, exact: true }).selectOption('1');
  await model.getByRole('button', { name: c.model.run, exact: true }).click();
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await expect(model).not.toContainText(c.model.explain);
  await reflect(page, 'diagnose');
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  expect(missionFacts(await state(page)).current?.aided).toBe(false);
});
test('Benefits governance: actual denied/corrected receipts, scope and metadata comparison through ordinary course return', async ({
  page,
}, info) => {
  await start(page, 'governance');
  await expect(page.locator('.mission-coach')).toContainText(c.missions.governance.stages[0]);
  await expect(page.locator('.mission-coach')).not.toContainText(c.createVm);
  await create(page, 'group', 'rg-mission', 'sub-app', 'norwayeast');
  await create(page, 'plan', 'plan-rejected', 'sub-app', 'northeurope');
  await expect(page.locator('.portal-view')).toContainText('policy-location-denied');
  await inspectCurrent(page);
  await shot(page, info, 'governance-denial');
  await page
    .locator('.portal-view')
    .getByRole('button', { name: nb.chapter.showPolicy, exact: true })
    .click();
  await expect(page.locator('dialog[data-milestone="policy-denial"][open]')).toBeVisible();
  await closeObservation(page);
  await inspectCurrent(page);
  await create(page, 'plan', 'plan-corrected');
  await create(page, 'app', 'app-governed');
  await selectCurrent(page);
  await inspectAll(page);
  await returnCourse(page, 'governance');
  await reflect(page, 'governance');
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  await compositions(page, info, 'governance-debrief');
  const technical = await page.evaluate((key) => localStorage.getItem(key), sandboxKey);
  const replay = restoreSandbox(technical!).attempt.engine;
  expect(replay.world.resources.map((r) => r.name)).not.toContain('plan-rejected');
  expect(
    replay.ledger.some(
      (e) =>
        e.request.command.name === 'plan-rejected' &&
        e.receipt.outcome === 'rejected' &&
        e.receipt.addedIds.length === 0,
    ),
  ).toBe(true);
  await page
    .locator('.mission-entry')
    .getByRole('button', { name: c.independent, exact: true })
    .click();
  await create(page, 'plan', 'plan-transfer-denied', 'sub-app', 'northeurope');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await create(page, 'plan', 'plan-transfer-corrected');
  await create(page, 'app', 'app-transfer');
  await selectCurrent(page);
  await vm(page, true);
  await returnCourse(page, 'governance');
  await inspectFromCourse(page, 'governance');
  await reflect(page, 'governance');
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  expect(missionFacts(await state(page)).current?.aided).toBe(false);
});
test('Service Types IaaS: new requirement, real bundle/attachments and changed independent scope/profile preserve first', async ({
  page,
}, info) => {
  await start(page, 'infrastructure');
  await create(page, 'group', 'rg-shared', 'sub-shared', 'norwayeast');
  await vm(page);
  await selectCurrent(page);
  await shot(page, info, 'iaas-new-vm');
  await inspectAll(page);
  await returnCourse(page, 'infrastructure');
  await reflect(page, 'infrastructure');
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  const prefix = (await state(page)).events;
  await page.reload();
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  await page
    .locator('.mission-entry')
    .getByRole('button', { name: c.independent, exact: true })
    .click();
  await expect(page.locator('.mission-coach')).toContainText(c.missions.infrastructure.independent);
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  await create(page, 'group', 'rg-independent', 'sub-app', 'norwayeast');
  await vm(page, true);
  await selectCurrent(page);
  await returnCourse(page, 'infrastructure');
  await inspectFromCourse(page, 'infrastructure');
  await expect(page.locator('.mission-activity')).not.toContainText(c.rationale);
  await reflect(page, 'infrastructure');
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  await shot(page, info, 'iaas-independent');
  const save = await state(page);
  expect(save.events.slice(0, prefix.length)).toEqual(prefix);
  expect(missionFacts(save).current?.aided).toBe(false);
  expect(missionFacts(save).sessions).toHaveLength(2);
});
test('Service Types PaaS: actual draft versus Apply, ordered maintenance/restoration, receipts, reuse and exact resume', async ({
  page,
}, info) => {
  await seed(page, 'app');
  await start(page, 'platform');
  await page.getByRole('button', { name: 'app-existing', exact: true }).click();
  await selectCurrent(page);
  await page.getByRole('button', { name: lab.settings.title, exact: true }).click();
  const raw = await page.evaluate((key) => localStorage.getItem(key), sandboxKey);
  await editAppSetting(page, lab.settings.environment, 'staging');
  await editAppSetting(page, lab.settings.catalog, 'read-only');
  expect(await page.evaluate((key) => localStorage.getItem(key), sandboxKey)).toBe(raw);
  await shot(page, info, 'paas-unapplied-draft');
  await page.reload();
  await page.getByRole('button', { name: lab.settings.title, exact: true }).click();
  await editAppSetting(page, lab.settings.environment, 'staging');
  await editAppSetting(page, lab.settings.catalog, 'read-only');
  await page.getByRole('button', { name: lab.settings.apply, exact: true }).click();
  await page.getByRole('button', { name: lab.settings.title, exact: true }).click();
  await editAppSetting(page, lab.settings.catalog, 'standard');
  await page.getByRole('button', { name: lab.settings.apply, exact: true }).click();
  await inspectAll(page);
  await closeObservation(page);
  await page.getByRole('button', { name: c.milestone.recall, exact: true }).click();
  await compositions(page, info, 'paas-milestone');
  await closeObservation(page);
  await returnCourse(page, 'platform');
  await reflect(page, 'platform');
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  await shot(page, info, 'paas-debrief');
  await page.reload();
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  const saved = await state(page);
  expect(missionFacts(saved).current?.mode).toBe('guided');
  await page
    .locator('.mission-entry')
    .getByRole('button', { name: c.independent, exact: true })
    .click();
  await expect(page.locator('.mission-coach')).not.toContainText(c.guidance.settings[0]);
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  await create(page, 'app', 'app-staging-isolated', 'sub-app', 'westeurope', 'rg-existing');
  await page.getByRole('button', { name: lab.settings.title, exact: true }).click();
  await editAppSetting(page, lab.settings.environment, 'staging');
  await editAppSetting(page, lab.settings.catalog, 'read-only');
  await page.getByRole('button', { name: lab.settings.apply, exact: true }).click();
  await area(page, 'apps');
  await page.getByRole('button', { name: 'app-existing', exact: true }).click();
  await selectCurrent(page);
  await page.getByRole('button', { name: lab.settings.title, exact: true }).click();
  await editAppSetting(page, lab.settings.environment, 'production');
  await editAppSetting(page, lab.settings.catalog, 'standard');
  await page.getByRole('button', { name: lab.settings.apply, exact: true }).click();
  await returnCourse(page, 'platform');
  await inspectFromCourse(page, 'platform');
  await reflect(page, 'platform');
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  expect(missionFacts(await state(page)).current?.aided).toBe(false);
  await page
    .locator('.mission-entry')
    .getByRole('button', { name: c.independent, exact: true })
    .click();
  await returnCourse(page, 'platform');
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }).click();
  await page.reload();
  expect(missionFacts(await state(page)).assisted).toBe(true);
  expect((await state(page)).events.slice(0, saved.events.length)).toEqual(saved.events);
});

test('mission persistence: stale tabs withhold guidance, reload resumes, abandonment preserves inventory and unsupported recovery is isolated', async ({
  page,
  context,
}) => {
  await seed(page, 'app');
  await start(page, 'platform');
  const raw = await page.evaluate((key) => localStorage.getItem(key), sandboxKey);
  const other = await context.newPage();
  await other.goto(page.url());
  await expect(other.locator('.mission-coach')).toContainText(c.missions.platform.title);
  await page.getByRole('button', { name: 'app-existing', exact: true }).click();
  await selectCurrent(page);
  await expect(other.locator('.mission-coach')).toContainText(c.blocked);
  await expect(other.locator('.mission-coach')).not.toContainText(c.guidance.settings[0]);
  await other
    .locator('.mission-coach')
    .getByRole('button', { name: c.reload, exact: true })
    .click();
  await expect(other.locator('.mission-coach')).toContainText(c.guidance.settings[0]);
  await other
    .locator('.mission-coach')
    .getByRole('button', { name: c.abandon, exact: true })
    .click();
  await expect(other.locator('.mission-portal-notice')).toContainText(c.unverified);
  expect(missionFacts(await state(other)).current?.status).toBe('abandoned');
  expect(await other.evaluate((key) => localStorage.getItem(key), sandboxKey)).toBe(raw);
  await other.close();
  await page.evaluate((key) => localStorage.setItem(key, '{"schema":99}'), missionKey);
  await page.goto(missionOrigin('platform'));
  await expect(page.getByText(`${c.storage} (unsupported)`, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.recover, exact: true }).click();
  const valid = JSON.stringify(freshMissions());
  // A newer valid save appears after the confirmation was opened. Recovery must preserve it.
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key: missionKey,
    value: valid,
  });
  await page.getByRole('button', { name: c.confirm, exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), missionKey)).toBe(valid);
  expect(await page.evaluate((key) => localStorage.getItem(key), sandboxKey)).toBe(raw);
});

test('mission accessibility: keyboard briefing/cancel, short window, reduced motion and denied persistence withhold critical guidance', async ({
  page,
  baseURL,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1024, height: 500 });
  const requests: string[] = [];
  expect(baseURL).toBeTruthy();
  const applicationOrigin = new URL(baseURL!).origin;
  page.on('request', (request) => {
    if (/^https?:\/\//.test(request.url()) && new URL(request.url()).origin !== applicationOrigin)
      requests.push(request.url());
  });
  await page.goto('/');
  await page
    .locator('.mission-discovery')
    .getByRole('link', { name: c.missions.infrastructure.title, exact: true })
    .click();
  const entry = page.getByRole('region', { name: c.missions.infrastructure.title, exact: true });
  const start = entry.getByRole('button', { name: c.start, exact: true });
  await start.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: c.missions.infrastructure.title, exact: true });
  await expect(dialog).toContainText(c.missions.infrastructure.scenario);
  await shot(page, info, 'short-keyboard-briefing');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(start).toBeFocused();
  expect(await page.evaluate((key) => localStorage.getItem(key), missionKey)).toBeNull();
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw new DOMException('blocked', 'QuotaExceededError');
      original.call(this, k, v);
    };
  }, missionKey);
  await start.click();
  await dialog.getByRole('button', { name: learningPolishNb.briefing.start, exact: true }).click();
  await expect(page.locator('.mission-coach')).toContainText(c.storage);
  await expect(page.locator('.mission-coach')).not.toContainText(c.guidance.build[0]);
  expect(await page.evaluate((key) => localStorage.getItem(key), missionKey)).toBeNull();
  expect(requests).toEqual([]);
});

test('independent mission Journal requires durable assistance; failed help cannot expose teaching or rewrite the stored attempt', async ({
  page,
}) => {
  await seed(page, 'app');
  await start(page, 'platform', 'independent');
  await returnCourse(page, 'platform');
  const before = await state(page);
  const technical = await page.evaluate((key) => localStorage.getItem(key), sandboxKey);
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw new DOMException('blocked', 'QuotaExceededError');
      original.call(this, k, v);
    };
  }, missionKey);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  const journal = page.getByRole('dialog', { name: nb.course.journal, exact: true });
  await expect(journal).toContainText(c.storage);
  await expect(journal.locator('.expanded-reference')).toHaveCount(0);
  expect(await state(page)).toEqual(before);
  await journal.getByRole('button', { name: 'Close', exact: true }).click();
  await page.reload();
  expect(missionFacts(await state(page)).current?.aided).toBe(false);
  expect(await page.evaluate((key) => localStorage.getItem(key), sandboxKey)).toBe(technical);
});

test('mission recovery names non-Core and technical conflicts, preserves latest data and withholds a different technical attempt', async ({
  page,
  context,
}) => {
  await seed(page, 'app');
  await start(page, 'platform');
  await returnCourse(page, 'platform');
  await page.goto('/');
  await page
    .locator('.mission-discovery')
    .getByRole('link', { name: `${c.resume} · ${c.missions.platform.title}`, exact: true })
    .click();
  await expect(page).toHaveURL(missionOrigin('platform'));
  const other = await context.newPage();
  await other.goto('/portal');
  const benefits = JSON.stringify(freshExpansion('benefits'));
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: expansionKeys.benefits,
    raw: benefits,
  });
  await expect(page.locator('.mission-activity')).toContainText('Benefits');
  await expect(page.locator('.mission-activity .mission-actual')).toHaveCount(0);
  await page.getByRole('button', { name: `${c.reloadContext} · Benefits`, exact: true }).click();
  await expect(page.locator('.mission-activity .mission-actual')).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), expansionKeys.benefits)).toBe(
    benefits,
  );
  await create(other, 'group', 'rg-other-tab', 'sub-shared', 'norwayeast');
  const latest = await other.evaluate((key) => localStorage.getItem(key), sandboxKey);
  await expect(page.locator('.mission-activity')).toContainText(c.recoveryContexts.technical);
  await expect(page.locator('.mission-activity .mission-actual')).toHaveCount(0);
  await page
    .getByRole('button', {
      name: `${c.reloadContext} · ${c.recoveryContexts.technical}`,
      exact: true,
    })
    .click();
  await expect(page.locator('.mission-activity .mission-actual')).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), sandboxKey)).toBe(latest);
  await other.getByRole('button', { name: p.limitations, exact: true }).click();
  await other.getByRole('button', { name: p.resetTechnical, exact: true }).click();
  await other.getByRole('button', { name: p.confirmReset, exact: true }).click();
  await page
    .getByRole('button', {
      name: `${c.reloadContext} · ${c.recoveryContexts.technical}`,
      exact: true,
    })
    .click();
  await expect(page.locator('.mission-activity')).toContainText(c.unverified);
  await expect(page.locator('.mission-activity .mission-actual')).toHaveCount(0);
  await page
    .locator('.mission-activity')
    .getByRole('button', { name: c.abandon, exact: true })
    .click();
  expect(missionFacts(await state(page)).current?.status).toBe('abandoned');
  await other.close();
});

test('historical mission debrief and entry cannot reveal teaching during another assessment, denied help or an already-open cross-tab conflict', async ({
  page,
  context,
}) => {
  await seed(page, 'app');
  const submitted: MissionSave = {
    ...freshMissions(),
    events: [
      { type: 'start', mission: 'platform', mode: 'guided', attempt: 1, boundary: null },
      { type: 'answer', field: 'decision', value: 'managed-os' },
      { type: 'answer', field: 'reason', value: 'config-only' },
      { type: 'submit', through: null },
    ],
  };
  const begun = { ...freshExpansion('benefits'), events: [{ kind: 'begin' }] };
  const missionRaw = JSON.stringify(submitted),
    benefitsRaw = JSON.stringify(begun);
  await page.addInitScript(
    ({ missionKey, benefitsKey, missionRaw, benefitsRaw }) => {
      if (localStorage.getItem(missionKey) === null) localStorage.setItem(missionKey, missionRaw);
      if (localStorage.getItem(benefitsKey) === null)
        localStorage.setItem(benefitsKey, benefitsRaw);
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === benefitsKey) throw new DOMException('denied', 'QuotaExceededError');
        original.call(this, key, value);
      };
    },
    { missionKey, benefitsKey: expansionKeys.benefits, missionRaw, benefitsRaw },
  );
  await page.goto(missionOrigin('platform'));
  const entry = page.getByRole('region', { name: c.missions.platform.title, exact: true });
  await expect(entry.locator('.mission-safety-recovery')).toContainText('Benefits');
  await expect(entry.locator('.mission-debrief')).toHaveCount(0);
  await expect(entry).not.toContainText(c.missions.platform.bridge);
  await expect(entry).not.toContainText(c.missions.platform.feedback);
  expect(await page.evaluate((key) => localStorage.getItem(key), expansionKeys.benefits)).toBe(
    benefitsRaw,
  );
  expect(await page.evaluate((key) => localStorage.getItem(key), missionKey)).toBe(missionRaw);
  const technical = await page.evaluate((key) => localStorage.getItem(key), sandboxKey);
  const other = await context.newPage();
  await other.goto('/portal');
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: expansionKeys.benefits,
    raw: JSON.stringify(freshExpansion('benefits')),
  });
  await entry.getByRole('button', { name: `${c.reloadContext} · Benefits`, exact: true }).click();
  await expect(entry.locator('.mission-debrief')).toBeVisible();
  await entry.locator('.mission-debrief details').first().locator('summary').click();
  await expect(entry.locator('.mission-debrief dl').first()).toBeVisible();
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: expansionKeys.benefits,
    raw: benefitsRaw,
  });
  await expect(entry.locator('.mission-debrief')).toHaveCount(0);
  await expect(entry).not.toContainText(c.missions.platform.feedback);
  await expect(entry.locator('.mission-safety-recovery')).toContainText('Benefits');
  expect(await page.evaluate((key) => localStorage.getItem(key), expansionKeys.benefits)).toBe(
    benefitsRaw,
  );
  expect(await page.evaluate((key) => localStorage.getItem(key), missionKey)).toBe(missionRaw);
  expect(await page.evaluate((key) => localStorage.getItem(key), sandboxKey)).toBe(technical);
  await other.close();
});

test('independent graph inspection is operational; Related learning requires durable aid and already-open explanations withhold on conflict', async ({
  page,
  context,
}) => {
  await seed(page, 'vm');
  await start(page, 'diagnose', 'independent');
  await area(page, 'architecture');
  const list = page.locator('.portal-node-list');
  if (!(await list.isVisible()))
    await page.getByRole('button', { name: p.graph.list, exact: true }).click();
  await list
    .getByRole('button', { name: `${p.graph.types.vm} · vm-existing`, exact: true })
    .click();
  const inspector = page.locator('.portal-graph-inspector');
  const before = await state(page);
  expect(missionFacts(before).current?.aided).toBe(false);
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw new DOMException('blocked', 'QuotaExceededError');
      original.call(this, k, v);
    };
  }, missionKey);
  await inspector.getByRole('button', { name: p.relatedLearning, exact: true }).click();
  await expect(inspector).toContainText(c.storage);
  await expect(inspector).not.toContainText(lab.vm.note);
  expect(await state(page)).toEqual(before);
  await page.reload();
  if (!(await list.isVisible()))
    await page.getByRole('button', { name: p.graph.list, exact: true }).click();
  await list
    .getByRole('button', { name: `${p.graph.types.vm} · vm-existing`, exact: true })
    .click();
  await inspector.getByRole('button', { name: p.relatedLearning, exact: true }).click();
  await expect(inspector).toContainText(lab.vm.note);
  expect(missionFacts(await state(page)).current?.aided).toBe(true);
  const other = await context.newPage();
  await other.goto(missionOrigin('diagnose'));
  await other
    .locator('.mission-activity')
    .getByRole('radio', { name: c.missions.diagnose.choices.dependency[0], exact: true })
    .check();
  await expect(inspector).not.toContainText(lab.vm.note);
  await expect(inspector).toContainText('conflict');
  await other.close();
});
