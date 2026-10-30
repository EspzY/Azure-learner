import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  networkingNb as c,
  networkingItemsNb,
  nb,
  labsNb,
  serverlessNb,
  missionsNb,
  computeNb,
  costNb,
} from '../../src/content/nb';
import {
  networkingKey,
  networkingFacts,
  freshNetworking,
  applyNetworking,
  networkingGuidedAnswer,
  type NetworkingSave,
  type NetworkingItemId,
} from '../../src/domain/curriculum/networking';
import {
  computeKey,
  computeFacts,
  freshCompute,
  applyCompute,
} from '../../src/domain/curriculum/compute';
import { SandboxStore, sandboxKey } from '../../src/domain/sandbox/store';
import { milestonePreferenceKey } from '../../src/domain/guidance/milestone-preferences';
import {
  applyMission,
  freshMissions,
  missionKey,
  missionOrigin,
  missionFacts,
} from '../../src/domain/sandbox/missions';
test.setTimeout(180000);
test.use({ actionTimeout: 15000 });
const read = async (page: Page) =>
  JSON.parse(
    (await page.evaluate((k) => localStorage.getItem(k), networkingKey)) ??
      JSON.stringify(freshNetworking()),
  ) as NetworkingSave;
async function root(page: Page) {
  await page.goto('/');
  await page.locator('.learn-hub-module[data-module="networking"]').getByRole('link').click();
  await expect(page).toHaveURL(/learn\/networking/);
  await expect(page.locator('.networking-lesson [data-activity-heading]')).toBeVisible();
}
async function lesson(page: Page, topic: keyof typeof c.topics) {
  const link = page
    .locator('.course-navigation-content')
    .getByRole('link', { name: c.topics[topic], exact: true });
  if (!(await link.isVisible()))
    await page.getByRole('button', { name: nb.course.learning, exact: true }).click();
  await link.click();
  await expect(page).toHaveURL(new RegExp(`topic=${topic}(?:&|$)`));
}
async function begin(page: Page) {
  await page.getByRole('button', { name: c.labels.begin, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
}
async function close(page: Page) {
  if (await page.getByRole('dialog').isVisible()) await page.getByRole('dialog').press('Escape');
}
async function run(page: Page, outcome: string) {
  await page.getByRole('combobox', { name: c.labels.predict, exact: true }).selectOption(outcome);
  await page.getByRole('button', { name: c.labels.run, exact: true }).click();
}
async function finish(page: Page) {
  const g = networkingFacts(await read(page)).guide!;
  await page
    .getByRole('radio', {
      name: c.causal[g.mission][networkingGuidedAnswer[g.mission]],
      exact: true,
    })
    .check();
  await page.getByRole('button', { name: c.labels.explain, exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: c.labels.done })).toBeVisible();
}
async function startCase(page: Page, id: NetworkingItemId) {
  await page.getByRole('combobox', { name: c.assessment.case, exact: true }).selectOption(id);
  await page
    .getByRole('button', { name: new RegExp(`${c.assessment.start}|${c.assessment.retry}`) })
    .click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
}
async function answer(page: Page, id: NetworkingItemId, d: number, r: number) {
  await page.getByRole('radio', { name: networkingItemsNb[id].decisions[d], exact: true }).check();
  await page.getByRole('radio', { name: networkingItemsNb[id].reasons[r], exact: true }).check();
}
test('ordinary root, original theory, explicit address mission and saved correction', async ({
  page,
}) => {
  await root(page);
  await expect(
    page.getByText(c.sections.introduction.paragraphs[0], { exact: true }),
  ).toBeVisible();
  await lesson(page, 'addressing');
  await expect.poll(async () => networkingFacts(await read(page)).topic).toBe('addressing');
  const before = await read(page);
  await page.getByRole('button', { name: c.labels.begin, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.missions.address.observe);
  const viewport = page.viewportSize();
  await page.setViewportSize({ width: 1024, height: 500 });
  const reading = page.getByRole('region', { name: nb.milestones.reading, exact: true });
  await reading.focus();
  await reading.press('End');
  await expect
    .poll(() =>
      reading.evaluate((el) => Math.round(el.scrollTop + el.clientHeight - el.scrollHeight)),
    )
    .toBe(0);
  await expect(
    page.getByRole('dialog').getByText(c.missions.address.steps[4], { exact: true }),
  ).toBeInViewport();
  await close(page);
  expect((await read(page)).events).toEqual(before.events);
  if (viewport) await page.setViewportSize(viewport);
  await begin(page);
  await run(page, '0');
  await expect(page.locator('.network-result')).toContainText(c.model.invalid);
  await page.getByRole('textbox', { name: c.model.data, exact: true }).fill('10.84.2.0/24');
  await page.reload();
  await expect(page.getByRole('textbox', { name: c.model.data, exact: true })).toHaveValue(
    '10.84.2.0/24',
  );
  await run(page, '2');
  await expect(page.locator('.network-result')).toContainText(c.model.valid);
  await finish(page);
  await page.reload();
  expect(networkingFacts(await read(page)).completed).toContain('address');
  expect(networkingFacts(await read(page)).firsts).toEqual([]);
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).filter((k) => /sandbox|chapter|progress/.test(k)),
    ),
  ).toEqual([]);
});
test('peering diagnosis distinguishes nontransitivity, explicit sides and overlap with once-only recall', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'peering');
  await begin(page);
  await run(page, '0');
  await expect(page.locator('.network-verdict')).toContainText(c.model.peeringMissing);
  await page.getByRole('checkbox', { name: 'A → C', exact: true }).check();
  await page.getByRole('checkbox', { name: 'C → A', exact: true }).check();
  await run(page, '2');
  await expect(page.locator('.network-verdict')).toContainText(c.model.logical);
  await page.getByRole('checkbox', { name: c.model.overlapToggle, exact: true }).check();
  await page.getByRole('combobox', { name: c.model.destination, exact: true }).selectOption('b');
  await run(page, '0');
  await expect(page.getByRole('dialog')).toContainText(c.milestone.peering.text);
  await close(page);
  await finish(page);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: c.milestone.peering.title, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.milestone.peering.text);
  await close(page);
  expect(networkingFacts(await read(page)).completed).toContain('peering');
  const raw = await page.evaluate((k) => localStorage.getItem(k), milestonePreferenceKey),
    peer = await page.context().newPage();
  await peer.goto('/');
  await peer.evaluate((k) => localStorage.setItem(k, '{broken'), milestonePreferenceKey);
  await expect(page.getByText(c.storage.milestones, { exact: true })).toBeVisible();
  await peer.evaluate(({ k, v }) => localStorage.setItem(k, v!), {
    k: milestonePreferenceKey,
    v: raw,
  });
  await expect(page.getByText(c.storage.milestones, { exact: true })).toHaveCount(0);
  await run(page, '0');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await peer.close();
});
test('DNS investigation separates missing visibility, correct answer, path and authorization', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'dns');
  await begin(page);
  await run(page, '0');
  await expect(page.locator('.network-verdict')).toContainText(c.model.resolutionFail);
  await page.getByRole('checkbox', { name: c.model.linked, exact: true }).check();
  await page.getByRole('checkbox', { name: c.model.peered, exact: true }).uncheck();
  await run(page, '1');
  await expect(page.getByRole('dialog')).toContainText(c.milestone.dns.text);
  await close(page);
  await expect(page.locator('.network-dns-pipeline')).toContainText('10.85.1.20');
  await expect(page.locator('.network-verdict')).toContainText(c.model.dnsOnly);
  await finish(page);
  await page.getByRole('checkbox', { name: c.model.peered, exact: true }).check();
  await page.getByRole('combobox', { name: c.model.access, exact: true }).selectOption('deny');
  await run(page, '1');
  await expect(page.locator('.network-verdict')).toContainText(c.model.dnsOnly);
  await page.reload();
  expect(networkingFacts(await read(page)).completed).toContain('dns');
  await page.getByRole('combobox', { name: c.model.zone, exact: true }).selectOption('provided');
  await expect(
    page.getByRole('combobox', { name: c.model.record, exact: true }).locator('option'),
  ).toHaveCount(2);
  await page.getByRole('checkbox', { name: c.model.sameVnet, exact: true }).check();
  await page.getByRole('combobox', { name: c.model.access, exact: true }).selectOption('allow');
  await run(page, '2');
  await expect(page.locator('.network-dns-pipeline')).toContainText(c.model.providedHostname);
  await expect(page.locator('.network-dns-pipeline')).not.toContainText('archive.training.example');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test('unseeded actual Portal journey keeps correct CreateKind and seven genuine network references', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'dependencies');
  await begin(page);
  await page
    .getByRole('link', { name: c.labels.portal + ' · Resource groups', exact: true })
    .click();
  const p = nb.portal,
    guide = page.locator('.network-portal-guide');
  await expect(page).toHaveURL(/networking=inspect/);
  await expect(
    guide.getByRole('combobox', { name: c.inspection.choose, exact: true }),
  ).toBeVisible();
  async function create(area: 'groups' | 'vms' | 'plans' | 'apps') {
    const link = page
      .locator('.portal-nav')
      .getByRole('link', { name: p.areas[area], exact: true });
    if (new URL(page.url()).searchParams.get('area') !== area) {
      if (!(await link.isVisible()))
        await page.getByRole('button', { name: p.menu, exact: true }).click();
      await link.click();
    }
    await page
      .locator('.portal-commandbar')
      .getByRole('button', { name: p.create, exact: true })
      .click();
  }
  await create('groups');
  await expect(guide).toContainText(c.inspection.guide.group);
  await expect(guide).toContainText(c.inspection.locations.group);
  await expect(guide).toContainText(c.inspection.createReasons.group);
  await expect(guide).not.toContainText(c.inspection.guide.vm);
  await page.getByRole('textbox', { name: p.groupName, exact: true }).fill('rg-network-first');
  await page
    .locator('.portal-create-footer')
    .getByRole('button', { name: p.review, exact: true })
    .click();
  await page
    .locator('.portal-create-footer')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await create('plans');
  await expect(guide).toContainText(c.inspection.guide.otherCreate);
  await expect(guide).not.toContainText(c.inspection.guide.vm);
  await create('apps');
  await expect(guide).toContainText(c.inspection.guide.otherCreate);
  await create('vms');
  await expect(guide).toContainText(c.inspection.guide.vm);
  await expect(guide).toContainText(c.inspection.locations.vm);
  await expect(guide).toContainText(c.inspection.createReasons.vm);
  await page.getByLabel(labsNb.vm.name, { exact: true }).fill('vm-net28');
  await page
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption({ label: 'rg-network-first' });
  await page
    .getByRole('navigation', { name: labsNb.vm.title, exact: true })
    .getByRole('button', { name: labsNb.vm.tabs[3], exact: true })
    .click();
  await page
    .locator('.portal-create-footer')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await guide.getByRole('combobox', { name: c.inspection.choose, exact: true }).selectOption({
    label: await guide.locator('option').filter({ hasText: 'vm-net28' }).innerText(),
  });
  for (let i = 0; i < 7; i++) {
    await guide.locator('nav').getByRole('button').nth(i).click();
    if (i === 6) {
      await expect(guide).toContainText(c.inspection.guide.receipt);
      await expect(guide).not.toContainText(c.inspection.guide.list);
    }
    await guide.getByRole('button', { name: c.inspection.observed, exact: true }).click();
  }
  await expect(page.getByRole('dialog')).toContainText(c.milestone.inspect.text);
  await close(page);
  await guide.getByRole('link', { name: c.labels.return, exact: true }).click();
  await expect(page).toHaveURL(/learn\/networking\?topic=dependencies/);
  await finish(page);
  await page.reload();
  await expect(page.locator('.network-refs')).toContainText('10.42.0.0/16');
  await page.getByRole('button', { name: c.milestone.inspect.title, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.milestone.inspect.text);
  await close(page);
  expect(networkingFacts(await read(page)).firsts).toEqual([]);
  await lesson(page, 'summary');
  await expect(page.locator('.compute-summary')).toContainText('1/4');
});
test('existing VM is reused only for fresh inspection; no new command or IP allocation', async ({
  page,
}) => {
  const values = new Map<string, string>(),
    s = new SandboxStore({
      getItem: (k) => values.get(k) ?? null,
      setItem: (k, v) => {
        values.set(k, v);
      },
      removeItem: (k) => {
        values.delete(k);
      },
    });
  s.load();
  for (const command of [
    {
      type: 'CreateGroup',
      name: 'rg-network-reuse',
      subscriptionId: 'sub-shared',
      metadataRegion: 'norwayeast',
    },
    {
      type: 'CreateVmBundle',
      groupId: 'group-1',
      name: 'vm-reused',
      region: 'northeurope',
      image: 'ubuntu-22-04',
      profile: 'small',
      dataDiskGiB: '0',
      subnetId: '',
    },
  ] as const) {
    const v = s.getSnapshot();
    s.dispatch({
      kind: 'command',
      request: {
        commandId: `network-seed-${v.attempt.engine.ledger.length + 1}`,
        expectedWorldRevision: v.attempt.engine.world.revision,
        command:
          command.type === 'CreateVmBundle'
            ? { ...command, groupId: v.attempt.engine.world.groups[0]!.id }
            : command,
      },
      bindResult: false,
    });
  }
  const raw = values.get(sandboxKey)!;
  await page.addInitScript(
    ({ k, v }) => {
      if (localStorage.getItem(k) === null) localStorage.setItem(k, v);
    },
    { k: sandboxKey, v: raw },
  );
  await root(page);
  await lesson(page, 'dependencies');
  await begin(page);
  await page.getByRole('combobox', { name: c.inspection.choose, exact: true }).selectOption({
    label: await page.locator('option').filter({ hasText: 'vm-reused' }).innerText(),
  });
  await expect(page.getByText(c.inspection.reuse, { exact: true })).toBeVisible();
  await expect(page.getByText(c.inspection.noIp, { exact: false }).first()).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), sandboxKey)).toBe(raw);
  expect(networkingFacts(await read(page)).guide?.inspected).toEqual([]);
});
test('wrong first, precise feedback, repeat/help and retry preserve historical classification', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  await startCase(page, 'nw04');
  await answer(page, 'nw04', 2, 0);
  await page.reload();
  await expect(
    page.getByRole('radio', { name: networkingItemsNb.nw04.reasons[0], exact: true }),
  ).toBeChecked();
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.getByRole('region', { name: c.currentFeedback, exact: true })).toContainText(
    c.assessment.fail,
  );
  await expect(page.getByRole('region', { name: c.currentFeedback, exact: true })).toContainText(
    networkingItemsNb.nw04.feedback[1][0],
  );
  const first = networkingFacts(await read(page)).firsts[0];
  await startCase(page, 'nw04');
  await page.getByRole('link', { name: c.assessment.help, exact: true }).click();
  await expect(page).toHaveURL(/topic=addressing/);
  await expect(page.locator('[data-activity-heading]')).toHaveText(c.topics.addressing);
  expect(networkingFacts(await read(page)).assisted).toBe(true);
  await lesson(page, 'assessment');
  await answer(page, 'nw04', 2, 2);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  expect(networkingFacts(await read(page)).firsts[0]).toEqual(first);
  expect(networkingFacts(await read(page)).current).toMatchObject({
    assisted: true,
    retry: true,
    status: 'submitted',
  });
});
test('all-context preflight records durable aid and blocks historical feedback after a peer conflict', async ({
  page,
}) => {
  let n = applyNetworking(freshNetworking(), { kind: 'begin', item: 'nw01' })!;
  n = applyNetworking(n, { kind: 'draft', answer: { decision: 1, reason: 2 } })!;
  n = applyNetworking(n, { kind: 'submit' })!;
  const co = applyCompute(freshCompute(), { kind: 'begin', item: 'cp01' })!;
  await page.addInitScript(
    ({ n, co, k, ck }) => {
      if (localStorage.getItem(k) === null) localStorage.setItem(k, JSON.stringify(n));
      if (localStorage.getItem(ck) === null) localStorage.setItem(ck, JSON.stringify(co));
    },
    { n, co, k: networkingKey, ck: computeKey },
  );
  await root(page);
  expect(
    computeFacts(JSON.parse((await page.evaluate((k) => localStorage.getItem(k), computeKey))!))
      .assisted,
  ).toBe(true);
  await lesson(page, 'assessment');
  await expect(page.getByRole('region', { name: c.currentFeedback, exact: true })).toBeVisible();
  const peer = await page.context().newPage();
  await peer.goto('/');
  await peer.evaluate((k) => localStorage.setItem(k, '{broken'), networkingKey);
  await expect(page.getByRole('region', { name: c.currentFeedback, exact: true })).toHaveCount(0);
  await expect(page.getByText(networkingItemsNb.nw01.decisive, { exact: true })).toHaveCount(0);
  await peer.close();
});
test('active assisted Practical Missions shield external guidance while their own independent controls stay usable', async ({
  page,
}) => {
  let mission = applyMission(freshMissions(), {
    type: 'start',
    mission: 'platform',
    mode: 'independent',
    attempt: 1,
    boundary: null,
  })!;
  mission = applyMission(mission, { type: 'aid' })!;
  await page.addInitScript(
    ({ key, save }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(save));
    },
    { key: missionKey, save: mission },
  );
  await root(page);
  for (const topic of ['addressing', 'peering', 'dns', 'dependencies'] as const) {
    await lesson(page, topic);
    await expect(page.getByText(c.storage.unsafe, { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: c.labels.begin, exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: c.labels.run, exact: true })).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      page.getByRole('link', {
        name: `${missionsNb.reviewContext} · ${missionsNb.recoveryContexts.missions}`,
        exact: true,
      }),
    ).toHaveAttribute('href', missionOrigin('platform'));
  }
  await page.goto('/learn/compute?topic=containers');
  await expect(page.getByText(computeNb.storage.unsafe, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: computeNb.labels.run, exact: true })).toHaveCount(
    0,
  );
  await page.goto('/learn/cost?topic=estimate');
  await expect(page.getByText(costNb.workbench.recallUnsafe, { exact: true })).toBeVisible();
  await page.goto(missionOrigin('platform'));
  await expect(
    page
      .getByRole('group', {
        name: missionsNb.missions.platform.independentQuestions.decision,
        exact: true,
      })
      .getByRole('radio')
      .first(),
  ).toBeEnabled();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const persisted = missionFacts(
    JSON.parse((await page.evaluate((k) => localStorage.getItem(k), missionKey))!),
  );
  expect(persisted.active).toBe(true);
  expect(persisted.assisted).toBe(true);
  expect(networkingFacts(await read(page)).guided).toHaveLength(0);
});
test('own active controls remain usable while denied aid withholds Journal and old explanations', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  await startCase(page, 'nw11');
  await answer(page, 'nw11', 1, 0);
  await page.evaluate((k) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === k) throw Error('denied fixture');
      return set.call(this, key, value);
    };
  }, networkingKey);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: c.storage.title, exact: true }),
  ).toBeVisible();
  await expect(page.getByText(c.sections.dns.paragraphs[4], { exact: true })).toHaveCount(0);
  await close(page);
  await expect(page.getByRole('button', { name: c.assessment.submit, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: c.assessment.submit, exact: true })).toBeDisabled();
  expect(networkingFacts(await read(page)).assisted).toBe(false);
});
test('keyboard, reduced motion, compact/short desktop and semantic results remain readable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await root(page);
  await lesson(page, 'dns');
  await begin(page);
  await run(page, '0');
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
    [640, 600],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.locator('.network-dns-pipeline').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await expect(page.locator('.network-verdict')).toBeVisible();
  }
  const control = page.getByRole('combobox', { name: c.model.record, exact: true });
  await control.focus();
  await page.keyboard.press('ArrowDown');
  await expect(control).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
