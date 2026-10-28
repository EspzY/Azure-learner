import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { computeNb as c, computeItemsNb, nb, labsNb, serverlessNb } from '../../src/content/nb';
import {
  computeKey,
  computeFacts,
  computeGuidedAnswer,
  computeItems,
  computeItemIds,
  applyCompute,
  freshCompute,
  type ComputeSave,
  type ComputeItemId,
} from '../../src/domain/curriculum/compute';
import { applyCost, freshCost, costKey, costFacts } from '../../src/domain/curriculum/cost';
import { SandboxStore, sandboxKey } from '../../src/domain/sandbox/store';
import { freshLearning, applyLearning, learningKey } from '../../src/domain/curriculum/foundations';
import { freshV2, applyV2, foundationsV2Key } from '../../src/domain/curriculum/foundations-v2';
import {
  freshServerless,
  applyServerless,
  serverlessKey,
} from '../../src/domain/curriculum/serverless';
import {
  freshPhysical,
  applyPhysical,
  physicalKey,
} from '../../src/domain/curriculum/architecture-physical';
import {
  freshManagement,
  applyManagement,
  managementKey,
} from '../../src/domain/curriculum/architecture-management';
import {
  freshServices,
  applyModuleEvent,
  serviceLearningKey,
} from '../../src/domain/portal/learning';
import { freshPractical, applyPractical, practicalKey } from '../../src/domain/sandbox/practical';
import { freshMissions, applyMission, missionKey } from '../../src/domain/sandbox/missions';
import { freshTransfer, applyTransfer, transferKey } from '../../src/domain/curriculum/transfer';
import {
  fresh as freshExpansion,
  apply as applyExpansion,
  expansionKeys,
} from '../../src/domain/curriculum/expansion';
test.setTimeout(180000);
test.use({ actionTimeout: 15000 });
const read = async (page: Page) =>
  JSON.parse(
    (await page.evaluate((k) => localStorage.getItem(k), computeKey)) ??
      JSON.stringify(freshCompute()),
  ) as ComputeSave;
const root = async (page: Page) => {
  await page.goto('/');
  await page.locator('.compute-entry').getByRole('link').click();
  await expect(page).toHaveURL(/learn\/compute/);
};
async function lesson(page: Page, topic: keyof typeof c.topics) {
  const link = page
    .locator('.course-navigation-content')
    .getByRole('link', { name: c.topics[topic], exact: true });
  if (!(await link.isVisible()))
    await page.getByRole('button', { name: nb.course.learning, exact: true }).click();
  await link.click();
}
async function begin(page: Page) {
  await page.getByRole('button', { name: c.labels.begin, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
}
async function predict(page: Page, value: string) {
  await page.getByRole('combobox', { name: c.labels.predict, exact: true }).selectOption(value);
  await page.getByRole('button', { name: c.labels.run, exact: true }).click();
}
async function close(page: Page) {
  if (await page.getByRole('dialog').isVisible()) await page.getByRole('dialog').press('Escape');
}
async function finishGuided(page: Page) {
  const mission = computeFacts(await read(page)).guide!.mission;
  await page
    .getByRole('radio', {
      name: c.causes[mission].choices[computeGuidedAnswer[mission]],
      exact: true,
    })
    .check();
  await page.getByRole('button', { name: c.labels.explain, exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: c.labels.done })).toBeVisible();
}
async function startCase(page: Page, id: ComputeItemId) {
  await page.getByRole('combobox', { name: c.assessment.case, exact: true }).selectOption(id);
  await page
    .getByRole('button', { name: new RegExp(`${c.assessment.start}|${c.assessment.retry}`) })
    .click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
}
async function answer(page: Page, id: ComputeItemId, decision: number, reason: number) {
  await page
    .getByRole('radio', { name: computeItemsNb[id].decisions[decision], exact: true })
    .check();
  await page.getByRole('radio', { name: computeItemsNb[id].reasons[reason], exact: true }).check();
}
test('root integrates original theory, visible briefing and durable container mechanism without old evidence', async ({
  page,
}) => {
  await root(page);
  await expect(
    page.getByText(c.sections.introduction.paragraphs[0], { exact: true }),
  ).toBeVisible();
  await lesson(page, 'containers');
  await expect(page.getByText(c.sections.containers.paragraphs[3], { exact: true })).toBeVisible();
  const before = await read(page);
  await page.getByRole('button', { name: c.labels.begin, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.missions.container.observe);
  await page.keyboard.press('Escape');
  expect((await read(page)).events).toEqual(before.events);
  await begin(page);
  await predict(page, '1');
  await expect(page.getByText(c.models.container.lost, { exact: true })).toBeVisible();
  await page
    .getByRole('combobox', { name: c.models.container.storage, exact: true })
    .selectOption('external');
  await page.reload();
  await expect(
    page.getByRole('combobox', { name: c.models.container.storage, exact: true }),
  ).toHaveValue('external');
  await predict(page, '2');
  await expect(page.getByRole('dialog')).toContainText(c.milestone.container.text);
  await close(page);
  await finishGuided(page);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('status').filter({ hasText: c.labels.done })).toBeVisible();
  expect(computeFacts(await read(page)).firsts).toEqual([]);
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).filter((k) => /sandbox|chapter|progress|cost-management/.test(k)),
    ),
  ).toEqual([]);
});
test('capacity mission distinguishes zone failure, explicit scale rule, routing and data', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'resilience');
  await begin(page);
  await page
    .getByRole('combobox', { name: c.models.capacity.mode, exact: true })
    .selectOption('set');
  await page.getByLabel(c.models.capacity.count, { exact: true }).fill('3');
  await page
    .getByRole('combobox', { name: c.models.capacity.failure, exact: true })
    .selectOption('zone');
  await predict(page, '0');
  await expect(page.getByRole('table')).toContainText(c.models.capacity.affected);
  await page
    .getByRole('combobox', { name: c.models.capacity.mode, exact: true })
    .selectOption('zones');
  await predict(page, '2');
  await page
    .getByRole('combobox', { name: c.models.capacity.mode, exact: true })
    .selectOption('vmss');
  await page
    .getByRole('combobox', { name: c.models.capacity.failure, exact: true })
    .selectOption('none');
  await page.getByLabel(c.models.capacity.demand, { exact: true }).fill('40');
  await page.getByLabel(c.models.capacity.auto, { exact: true }).check();
  await predict(page, '2');
  await expect(page.getByRole('dialog')).toContainText(c.milestone.capacity.text);
  await close(page);
  await finishGuided(page);
  await page.getByLabel(c.models.capacity.data, { exact: true }).uncheck();
  await predict(page, '0');
  await expect(page.locator('.compute-metrics')).toContainText('0');
  await page.reload();
  expect(computeFacts(await read(page)).completed).toContain('capacity');
});

test('container host responsibility, cached instance and retained data are independent of a failed new process', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'containers');
  await begin(page);
  await page
    .getByRole('combobox', { name: c.models.container.host, exact: true })
    .selectOption('customer-vm');
  await page
    .getByRole('combobox', { name: c.models.container.storage, exact: true })
    .selectOption('external');
  await page
    .getByRole('combobox', { name: c.models.container.action, exact: true })
    .selectOption('inspect');
  await page.getByRole('checkbox', { name: c.models.container.image, exact: true }).uncheck();
  await predict(page, '2');
  await expect(page.locator('.compute-kernel-boundary')).toContainText(
    c.models.container.customerHost,
  );
  await expect(page.locator('.compute-properties')).toContainText('instance-A');
  await expect(page.locator('.compute-new-instance')).toContainText(c.models.container.currentData);
  await page
    .getByRole('combobox', { name: c.models.container.action, exact: true })
    .selectOption('recreate');
  await predict(page, '0');
  await expect(page.locator('.compute-data-lifecycle')).toContainText(
    c.models.container.storedWithoutExecution,
  );
  await expect(
    page
      .locator('.compute-observation')
      .getByText(c.models.container.noProcess, { exact: true })
      .first(),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('combobox', { name: c.models.container.host, exact: true }),
  ).toHaveValue('customer-vm');
  await expect(page.locator('.compute-data-lifecycle')).toContainText(
    c.models.container.storedWithoutExecution,
  );
  expect(computeFacts(await read(page)).firsts).toEqual([]);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test('hosting and AVD investigations preserve explicit publication versus host observations', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'hosting');
  await begin(page);
  await page
    .getByRole('combobox', { name: c.models.hosting.workload, exact: true })
    .selectOption('web-image');
  await predict(page, '2');
  await expect(page.getByText(c.models.hosting.valid, { exact: true })).toBeVisible();
  await page
    .getByRole('combobox', { name: c.models.hosting.workload, exact: true })
    .selectOption('cluster-api');
  await page
    .getByRole('combobox', { name: c.models.hosting.service, exact: true })
    .selectOption('aks');
  await page
    .getByRole('combobox', { name: c.models.hosting.reason, exact: true })
    .selectOption('kubernetes');
  await predict(page, '2');
  await finishGuided(page);
  await lesson(page, 'desktop');
  await page.getByLabel(c.models.desktop.hosts, { exact: true }).fill('0');
  await predict(page, '1');
  await expect(page.getByText(c.models.desktop.noHost, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '02 Workspace', exact: false }).click();
  await expect(page.getByText(c.models.desktop.details[1], { exact: true })).toBeVisible();
  await page.getByLabel(c.models.desktop.linked, { exact: true }).uncheck();
  await predict(page, '0');
  await expect(page.getByText(c.models.desktop.missing, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel(c.models.desktop.hosts, { exact: true })).toHaveValue('0');
});
test('all independent cases require compatible pairs and preserve firsts before precise repetition', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  for (const id of computeItemIds) {
    await startCase(page, id);
    const pair = computeItems[id].accepted[0]!;
    await answer(page, id, pair[0], pair[1]);
    await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
    await expect(page.getByText(c.assessment.pass, { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: c.assessment.alternatives, exact: true }),
    ).toBeVisible();
  }
  const s = await read(page);
  expect(computeFacts(s).firsts).toHaveLength(14);
  await page.reload();
  expect(computeFacts(await read(page)).firsts).toEqual(computeFacts(s).firsts);
  await page.getByRole('link', { name: new RegExp(c.assessment.repeat) }).click();
  await expect(page).toHaveURL(/topic=dependencies/);
});
test('wrong compatible-service/mismatched-reason first persists through reload, explicit aid and correct retry', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  await startCase(page, 'cp11');
  await answer(page, 'cp11', 0, 2);
  await page.reload();
  await expect(
    page.getByRole('radio', { name: computeItemsNb.cp11.decisions[0], exact: true }),
  ).toBeChecked();
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.getByText(c.assessment.fail, { exact: true })).toBeVisible();
  const first = computeFacts(await read(page)).firsts[0];
  expect(first!.assisted).toBe(false);
  await startCase(page, 'cp11');
  await page.getByRole('link', { name: c.assessment.help, exact: true }).click();
  await expect(page).toHaveURL(/topic=hosting/);
  await page.goBack();
  await expect(page.getByText(c.assessment.assisted, { exact: false }).first()).toBeVisible();
  await answer(page, 'cp11', 0, 1);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.getByText(c.assessment.pass, { exact: true })).toBeVisible();
  expect(computeFacts(await read(page)).firsts[0]).toEqual(first);
  await lesson(page, 'summary');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(
    page.getByRole('dialog').getByText(c.sections.desktop.paragraphs[2], { exact: true }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('dialog').press('Escape');
  await expect(page).toHaveURL(/topic=summary/);
});
test('historical feedback fails closed when another independent store cannot durably record aid', async ({
  page,
}) => {
  let s = applyCompute(freshCompute(), { kind: 'begin', item: 'cp01' })!;
  s = applyCompute(s, { kind: 'draft', answer: { decision: 2, reason: 0 } })!;
  s = applyCompute(s, { kind: 'submit' })!;
  const cost = applyCost(freshCost(), { kind: 'begin', item: 'cm01' })!;
  await page.addInitScript(
    ({ s, cost, computeKey, costKey }) => {
      localStorage.setItem(computeKey, JSON.stringify(s));
      localStorage.setItem(costKey, JSON.stringify(cost));
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === costKey) throw Error('denied aid');
        return set.call(this, k, v);
      };
    },
    { s, cost, computeKey, costKey },
  );
  await page.goto('/learn/compute?topic=assessment&case=cp01');
  await expect(page.getByText(c.storage.failed, { exact: true })).toHaveCount(0);
  await expect(page.locator('.compute-feedback')).toHaveCount(0);
  expect(
    costFacts(JSON.parse((await page.evaluate((k) => localStorage.getItem(k), costKey)) ?? '{}'))
      .assisted,
  ).toBe(false);
});
test('new Compute assessment shields Portal/SavvyShark and already-open teaching on actual peer conflict', async ({
  page,
  context,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  await startCase(page, 'cp02');
  await page.goto('/portal?area=create&kind=vm&compute=vm');
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/learn/compute?topic=functions');
  await expect(page.getByText(c.sections.functions.paragraphs[1], { exact: true })).toBeVisible();
  expect(computeFacts(await read(page)).assisted).toBe(true);
  const peer = await context.newPage();
  await peer.goto('/');
  await peer.evaluate((k) => localStorage.setItem(k, '{broken'), computeKey);
  await expect(page.getByText(c.sections.functions.paragraphs[1], { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: c.storage.reload, exact: true })).toBeVisible();
  await peer.close();
});
test('actual VM mission uses real Portal create/accepted receipt and all live dependencies without automatic commands', async ({
  page,
}) => {
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
  for (const command of [
    {
      type: 'CreateGroup',
      name: 'rg-compute-applied',
      subscriptionId: 'sub-app',
      metadataRegion: 'norwayeast',
    },
    {
      type: 'CreateVmBundle',
      groupId: 'group-1',
      name: 'vm-net-seed',
      region: 'northeurope',
      image: 'ubuntu-22-04',
      profile: 'small',
      dataDiskGiB: '0',
      subnetId: '',
    },
  ] as const) {
    const v = store.getSnapshot();
    store.dispatch({
      kind: 'command',
      request: {
        commandId: `seed-${v.attempt.engine.ledger.length + 1}`,
        expectedWorldRevision: v.attempt.engine.world.revision,
        command:
          command.type === 'CreateVmBundle'
            ? { ...command, groupId: v.attempt.engine.world.groups[0]!.id }
            : command,
      },
      bindResult: false,
    });
    expect(store.getSnapshot().attempt.engine.ledger.at(-1)!.receipt.outcome).toBe('accepted');
  }
  await page.addInitScript(
    ({ k, v }) => {
      if (localStorage.getItem(k) === null) localStorage.setItem(k, v);
    },
    {
      k: sandboxKey,
      v: values.get(sandboxKey)!,
    },
  );
  await root(page);
  await lesson(page, 'dependencies');
  await begin(page);
  await page
    .getByRole('link', { name: c.labels.portal + ' · Virtual machines', exact: true })
    .click();
  await expect(page).toHaveURL(/compute=vm/);
  const p = nb.portal;
  await expect(
    page
      .locator('.portal-training-strip')
      .getByRole('link', { name: nb.course.returnCourse, exact: true }),
  ).toHaveAttribute('href', '/learn/compute?topic=dependencies');
  await page
    .locator('.portal-training-strip')
    .getByRole('button', { name: p.returnLearning, exact: true })
    .click();
  await expect(page).toHaveURL(/learn\/compute\?topic=dependencies/);
  await page
    .getByRole('link', { name: c.labels.portal + ' · Virtual machines', exact: true })
    .click();
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption(store.getSnapshot().attempt.engine.world.groups[0]!.id);
  await page.getByLabel(labsNb.vm.name, { exact: true }).fill('vm-indexer');
  await page
    .getByRole('combobox', { name: labsNb.vm.image, exact: true })
    .selectOption('windows-2022');
  await page
    .getByRole('combobox', { name: labsNb.vm.profile, exact: true })
    .selectOption('standard');
  if (await page.evaluate(() => innerWidth >= 1024)) {
    const right = await page
      .getByRole('combobox', { name: labsNb.vm.profile, exact: true })
      .evaluate((e) => e.getBoundingClientRect().right);
    const left = await page
      .locator('.compute-portal-guide')
      .evaluate((e) => e.getBoundingClientRect().left);
    expect(right).toBeLessThan(left);
  }
  await page
    .getByRole('navigation', { name: labsNb.vm.title, exact: true })
    .getByRole('button', { name: labsNb.vm.tabs[1], exact: true })
    .click();
  await page.getByRole('combobox', { name: labsNb.vm.dataDisk, exact: true }).selectOption('64');
  await page
    .getByRole('navigation', { name: labsNb.vm.title, exact: true })
    .getByRole('button', { name: labsNb.vm.tabs[2], exact: true })
    .click();
  const subnet = store
    .getSnapshot()
    .attempt.engine.world.infrastructure.find((r) => r.kind === 'subnet')!.id;
  await page.getByRole('combobox', { name: labsNb.vm.network, exact: true }).selectOption(subnet);
  await page
    .getByRole('navigation', { name: labsNb.vm.title, exact: true })
    .getByRole('button', { name: labsNb.vm.tabs[3], exact: true })
    .click();
  await page
    .locator('.portal-create-footer')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  const guide = page.locator('.compute-portal-guide');
  await guide.getByRole('combobox', { name: c.vmCopy.select, exact: true }).selectOption({
    label: await guide.locator('option').filter({ hasText: 'vm-indexer' }).innerText(),
  });
  for (let n = 0; n < 7; n++) {
    if (n > 0) {
      await guide.locator('nav').getByRole('button').first().click();
    }
    await guide.getByRole('button', { name: c.labels.inspect, exact: true }).click();
  }
  await guide.getByRole('link', { name: c.labels.return, exact: true }).click();
  await finishGuided(page);
  await page.reload();
  await expect(page.getByRole('status').filter({ hasText: c.labels.done })).toBeVisible();
  expect(computeFacts(await read(page)).firsts).toEqual([]);
  await lesson(page, 'summary');
  const summary = page.locator('.compute-summary');
  const vmRow = summary
    .locator('li')
    .filter({ has: page.getByRole('link', { name: c.missions.vm.title, exact: true }) });
  await expect(vmRow).toContainText(c.labels.done);
  const technicalRaw = await page.evaluate((k) => localStorage.getItem(k), sandboxKey);
  const learningRaw = await page.evaluate((k) => localStorage.getItem(k), computeKey);
  const peer = await page.context().newPage();
  await peer.goto('/');
  await peer.evaluate((k) => localStorage.setItem(k, '{broken'), sandboxKey);
  await expect(vmRow).toContainText(c.vmCopy.unverified);
  await expect(vmRow).not.toContainText(c.labels.done);
  await expect(summary.getByText(c.vmCopy.uncertain, { exact: false })).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), computeKey)).toBe(learningRaw);
  await peer.evaluate(({ k, v }) => localStorage.setItem(k, v!), {
    k: sandboxKey,
    v: technicalRaw,
  });
  await page.reload();
  await expect(vmRow).toContainText(c.labels.done);
  await peer.close();
});
test('keyboard, Axe, reduced motion and constrained desktop views expose all required instructions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await root(page);
  await lesson(page, 'containers');
  await begin(page);
  await predict(page, '1');
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
  ] as const) {
    await page.setViewportSize({ width, height });
    await expect(page.getByRole('button', { name: c.labels.run, exact: true })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
  }
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: c.labels.recall, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('region', { name: nb.milestones.reading, exact: true }).focus();
  await page.keyboard.press('End');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: c.labels.recall, exact: true })).toBeFocused();
});

test('all twelve older independent contexts durably shield Compute teaching and Journal on denied assistance', async ({
  browser,
  baseURL,
}) => {
  const fixtures = [
    [learningKey, applyLearning(freshLearning(), { kind: 'begin-transfer' })],
    [foundationsV2Key, applyV2(freshV2(), { kind: 'begin' })],
    [serverlessKey, applyServerless(freshServerless(), { kind: 'begin' })],
    [physicalKey, applyPhysical(freshPhysical(), { kind: 'begin' })],
    [managementKey, applyManagement(freshManagement(), { kind: 'begin' })],
    [
      serviceLearningKey,
      applyModuleEvent(freshServices(), { kind: 'begin', boundary: null, attemptNumber: 1 }),
    ],
    [
      practicalKey,
      applyPractical(freshPractical(), {
        type: 'start',
        kind: 'saas',
        mode: 'independent',
        origin: { module: 'services', topic: 'saas' },
        attempt: 1,
        boundary: null,
      }),
    ],
    [
      missionKey,
      applyMission(freshMissions(), {
        type: 'start',
        mission: 'platform',
        mode: 'independent',
        attempt: 1,
        boundary: null,
      }),
    ],
    [transferKey, applyTransfer(freshTransfer(), { kind: 'begin', item: 'baseline-pricing' })],
    [costKey, applyCost(freshCost(), { kind: 'begin', item: 'cm02' })],
    ...(['benefits', 'services'] as const).map(
      (id) => [expansionKeys[id], applyExpansion(freshExpansion(id), { kind: 'begin' })] as const,
    ),
  ] as const;
  for (const [key, save] of fixtures) {
    expect(save).toBeTruthy();
    const context = await browser.newContext(),
      page = await context.newPage(),
      bytes = JSON.stringify(save);
    await context.addInitScript(
      ({ key, bytes }) => {
        if (localStorage.getItem(key) === null) localStorage.setItem(key, bytes);
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function (k, v) {
          if (k === key) throw Error('denied aid');
          return original.call(this, k, v);
        };
      },
      { key, bytes },
    );
    await page.goto(new URL('/learn/compute?topic=containers', baseURL!).href);
    await expect(page.getByText(c.sections.containers.paragraphs[1], { exact: true })).toHaveCount(
      0,
    );
    await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
    await expect(
      page.getByRole('dialog').getByText(c.sections.containers.paragraphs[1], { exact: true }),
    ).toHaveCount(0);
    expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(bytes);
    await context.close();
  }
});

test('explicit pause and recall restore a prior guided configuration without new evidence', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'containers');
  await begin(page);
  await page
    .getByRole('combobox', { name: c.models.container.storage, exact: true })
    .selectOption('external');
  await predict(page, '2');
  const prior = structuredClone(computeFacts(await read(page)).guide!);
  await page.getByRole('button', { name: c.pauseGuided, exact: true }).click();
  await lesson(page, 'hosting');
  await begin(page);
  await lesson(page, 'containers');
  await page.getByRole('button', { name: `${c.recallGuided} · #${prior.id}`, exact: true }).click();
  await expect(
    page.getByRole('combobox', { name: c.models.container.storage, exact: true }),
  ).toHaveValue('external');
  await page.reload();
  expect(computeFacts(await read(page)).guide).toEqual(prior);
  expect(computeFacts(await read(page)).firsts).toEqual([]);
});
