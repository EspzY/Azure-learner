import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  connectivityNb as c,
  connectivityItemsNb as items,
  networkingNb,
  nb,
  serverlessNb,
  missionsNb,
  computeNb,
} from '../../src/content/nb';
import {
  connectivityKey,
  connectivityFacts,
  connectivityHref,
  connectivityGuidedAnswer,
  freshConnectivity,
  applyConnectivity,
  type ConnectivitySave,
  type ConnectivityItemId,
} from '../../src/domain/curriculum/connectivity';
import {
  networkingKey,
  networkingFacts,
  freshNetworking,
  applyNetworking,
} from '../../src/domain/curriculum/networking';
import { runEndpoint, runHybrid } from '../../src/domain/curriculum/connectivity-model';
import {
  freshMissions,
  applyMission,
  missionKey,
  missionOrigin,
  missionFacts,
} from '../../src/domain/sandbox/missions';

test.setTimeout(180000);
test.use({ actionTimeout: 15000 });

const read = async (page: Page) =>
  JSON.parse(
    (await page.evaluate((key) => localStorage.getItem(key), connectivityKey)) ??
      JSON.stringify(freshConnectivity()),
  ) as ConnectivitySave;
const facts = async (page: Page) => connectivityFacts(await read(page));
async function root(page: Page) {
  await page.goto('/');
  await page.locator('.learn-hub-module[data-module="connectivity"]').getByRole('link').click();
  await expect(page).toHaveURL(/learn\/connectivity/);
  await expect(page.locator('.connectivity-lesson [data-activity-heading]')).toBeVisible();
}
async function lesson(page: Page, topic: keyof typeof c.topics) {
  const link = page
    .locator('.course-navigation-content')
    .getByRole('link', { name: c.topics[topic], exact: true });
  if (!(await link.isVisible()))
    await page.getByRole('button', { name: nb.course.learning, exact: true }).click();
  await link.click();
  await expect(page).toHaveURL(new RegExp(`topic=${topic}(?:&|$)`));
  await expect(page.locator('.connectivity-lesson [data-activity-heading]')).toHaveText(
    c.topics[topic],
  );
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
async function select(page: Page, field: keyof typeof c.model.labels, value: string) {
  await page
    .getByRole('combobox', { name: c.model.labels[field], exact: true })
    .selectOption(value);
}
async function toggle(page: Page, field: keyof typeof c.model.labels, checked: boolean) {
  await page
    .getByRole('checkbox', { name: c.model.labels[field], exact: true })
    .setChecked(checked);
}
async function run(page: Page, prediction: '0' | '1' | '2') {
  await page
    .getByRole('combobox', { name: c.labels.predict, exact: true })
    .selectOption(prediction);
  await page.getByRole('button', { name: c.labels.run, exact: true }).click();
  await expect(page.locator('.connectivity-result')).toBeVisible();
}
async function resultCheck(
  page: Page,
  key: keyof typeof c.model.resultLabel,
  value: 'yes' | 'no' | 'unknown',
) {
  const row = page
    .locator('.connectivity-checks > div')
    .filter({ has: page.getByText(c.model.resultLabel[key], { exact: true }) });
  await expect(row.locator('dd')).toHaveText(c.model[value]);
}
async function finish(page: Page) {
  const guide = (await facts(page)).guide!;
  await page
    .getByRole('radio', {
      name: c.causal[guide.mission][connectivityGuidedAnswer[guide.mission]],
      exact: true,
    })
    .check();
  await page.getByRole('button', { name: c.labels.explain, exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: c.labels.done })).toBeVisible();
}
async function startCase(page: Page, item: ConnectivityItemId) {
  await page.getByRole('combobox', { name: c.assessment.case, exact: true }).selectOption(item);
  await page
    .getByRole('button', { name: new RegExp(`${c.assessment.start}|${c.assessment.retry}`) })
    .click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
  await expect.poll(async () => (await facts(page)).current?.status).toBe('active');
}
async function answer(page: Page, item: ConnectivityItemId, decision: number, reason: number) {
  await page.getByRole('radio', { name: items[item].decisions[decision], exact: true }).check();
  await page.getByRole('radio', { name: items[item].reasons[reason], exact: true }).check();
}
async function seed(page: Page, key: string, raw: string) {
  await page.addInitScript(
    ({ key, raw }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, raw);
    },
    { key, raw },
  );
}

test('ordinary root, explicit briefing and three hybrid choices preserve Part A while pause/resume retains work', async ({
  page,
}) => {
  const partA = applyNetworking(freshNetworking(), { kind: 'begin', item: 'nw04' })!;
  const partARaw = JSON.stringify(applyNetworking(partA, { kind: 'abandon' })!);
  await seed(page, networkingKey, partARaw);
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.protocol !== 'data:' && !['127.0.0.1', 'localhost'].includes(url.hostname))
      external.push(request.url());
  });
  await root(page);
  await expect(
    page.getByText(c.sections.introduction.paragraphs[0], { exact: true }),
  ).toBeVisible();
  await lesson(page, 'expressroute');
  await expect.poll(async () => (await facts(page)).topic).toBe('expressroute');
  const before = await read(page);
  await page.getByRole('button', { name: c.labels.begin, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.missions.choose.observe);
  await close(page);
  expect((await read(page)).events).toEqual(before.events);
  await begin(page);
  await run(page, '1');
  let observed = runHybrid((await facts(page)).guide!.runs.at(-1)!.input)!;
  expect(observed.encrypted).toBe(true);
  expect(observed.privateTransport).toBe(false);
  expect(observed.requirementsMet).toBe(false);
  await resultCheck(page, 'encrypted', 'yes');
  await resultCheck(page, 'privateTransport', 'no');
  await select(page, 'transport', 'expressroute');
  await run(page, '1');
  observed = runHybrid((await facts(page)).guide!.runs.at(-1)!.input)!;
  expect(observed.privateTransport).toBe(true);
  expect(observed.encrypted).toBe(false);
  await resultCheck(page, 'privateTransport', 'yes');
  await resultCheck(page, 'encrypted', 'no');
  await page.getByRole('button', { name: c.pauseGuided, exact: true }).click();
  await expect(page.getByRole('button', { name: c.labels.run, exact: true })).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: `${c.recallGuided} · #1`, exact: true }).click();
  await expect(
    page.getByRole('combobox', { name: c.model.labels.transport, exact: true }),
  ).toHaveValue('expressroute');
  await select(page, 'encryption', 'macsec');
  await run(page, '1');
  await resultCheck(page, 'encrypted', 'no');
  await resultCheck(page, 'linkEncrypted', 'no');
  await toggle(page, 'direct', true);
  await run(page, '1');
  await resultCheck(page, 'linkEncrypted', 'yes');
  await resultCheck(page, 'encrypted', 'no');
  await resultCheck(page, 'requirementsMet', 'no');
  await select(page, 'encryption', 'ipsec');
  await run(page, '2');
  await resultCheck(page, 'requirementsMet', 'yes');
  await finish(page);
  await page.reload();
  expect((await facts(page)).completed).toContain('choose');
  expect((await facts(page)).firsts).toEqual([]);
  expect(await page.evaluate((key) => localStorage.getItem(key), networkingKey)).toBe(partARaw);
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).filter((key) => /sandbox|chapter|progress/.test(key)),
    ),
  ).toEqual([]);
  expect(external).toEqual([]);
});

test('hybrid outage requires a configured usable backup and a route; a laptop mode does not connect a whole site', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'vpn');
  await begin(page);
  await run(page, '0');
  expect(runHybrid((await facts(page)).guide!.runs.at(-1)!.input)!.knownPath).toBe(false);
  await toggle(page, 'backupReady', true);
  await run(page, '2');
  await expect(page.getByRole('dialog')).toContainText(c.milestone.diagnose.text);
  await close(page);
  let observed = runHybrid((await facts(page)).guide!.runs.at(-1)!.input)!;
  expect(observed.usedBackup).toBe(true);
  expect(observed.medium).toBe('internet');
  await resultCheck(page, 'usedBackup', 'yes');
  await toggle(page, 'routeReady', false);
  await run(page, '0');
  await resultCheck(page, 'knownPath', 'no');
  await finish(page);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: c.milestone.diagnose.title, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.milestone.diagnose.text);
  await close(page);
  await toggle(page, 'routeReady', true);
  await select(page, 'transport', 'vpn');
  await select(page, 'vpnMode', 'p2s');
  await run(page, '0');
  observed = runHybrid((await facts(page)).guide!.runs.at(-1)!.input)!;
  expect(observed.modeFits).toBe(false);
  await resultCheck(page, 'modeFits', 'no');
  await select(page, 'demand', 'user');
  await run(page, '2');
  expect(runHybrid((await facts(page)).guide!.runs.at(-1)!.input)!.requirementsMet).toBe(true);
});

test('private entry and public network access are independent; application authorization remains a separate gate', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'endpoints');
  await begin(page);
  await run(page, '2');
  await toggle(page, 'path', true);
  await select(page, 'publicAccess', 'disabled');
  await run(page, '2');
  expect(runEndpoint((await facts(page)).guide!.runs.at(-1)!.input)!.authorized).toBe(true);
  await resultCheck(page, 'authorized', 'yes');
  await select(page, 'endpoint', 'public');
  await select(page, 'dns', 'public');
  await run(page, '1');
  let observed = runEndpoint((await facts(page)).guide!.runs.at(-1)!.input)!;
  expect(observed.resolved).toBe(true);
  expect(observed.networkAllowed).toBe(false);
  expect(observed.input.privateState).toBe('approved');
  await resultCheck(page, 'resolved', 'yes');
  await resultCheck(page, 'networkAllowed', 'no');
  await finish(page);
  await select(page, 'publicAccess', 'enabled');
  await select(page, 'appAuth', 'deny');
  await run(page, '1');
  observed = runEndpoint((await facts(page)).guide!.runs.at(-1)!.input)!;
  expect(observed.networkAllowed).toBe(true);
  expect(observed.authorized).toBe(false);
  await resultCheck(page, 'networkAllowed', 'yes');
  await resultCheck(page, 'authorized', 'no');
  await select(page, 'appAuth', 'allow');
  await select(page, 'endpoint', 'private');
  await run(page, '1');
  observed = runEndpoint((await facts(page)).guide!.runs.at(-1)!.input)!;
  expect(observed.actualEndpoint).toBe('public');
  expect(observed.endpointMatch).toBe(false);
  expect(observed.networkAllowed).toBe(true);
  expect(observed.authorized).toBe(true);
  expect(observed.outcome).toBe(1);
  await resultCheck(page, 'endpointMatch', 'no');
  await resultCheck(page, 'networkAllowed', 'yes');
  await resultCheck(page, 'authorized', 'yes');
  await expect(page.locator('.connectivity-verdict')).toHaveText(c.model.outcome[1]);
  await page.reload();
  expect((await facts(page)).completed).toContain('endpoint');
  expect((await facts(page)).firsts).toEqual([]);
});

test('private DNS investigation separates public selection, resolver visibility, route, approval and authorization', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'private-dns');
  await begin(page);
  await run(page, '1');
  await expect(page.locator('.connectivity-pipeline')).toContainText('203.0.113.24');
  expect(runEndpoint((await facts(page)).guide!.runs.at(-1)!.input)!.actualEndpoint).toBe('public');
  await select(page, 'dns', 'private');
  await run(page, '0');
  expect(runEndpoint((await facts(page)).guide!.runs.at(-1)!.input)!.resolved).toBe(false);
  await resultCheck(page, 'resolved', 'no');
  await toggle(page, 'linked', true);
  await toggle(page, 'path', false);
  await run(page, '1');
  await expect(page.getByRole('dialog')).toContainText(c.milestone.dns.text);
  await close(page);
  await expect(page.locator('.connectivity-pipeline')).toContainText('10.87.4.12');
  await resultCheck(page, 'resolved', 'yes');
  await resultCheck(page, 'knownPath', 'no');
  await resultCheck(page, 'endpointControls', 'yes');
  await resultCheck(page, 'applicationAllowed', 'yes');
  await resultCheck(page, 'networkAllowed', 'no');
  await resultCheck(page, 'authorized', 'no');
  await toggle(page, 'path', true);
  await select(page, 'appAuth', 'deny');
  await run(page, '1');
  let observed = runEndpoint((await facts(page)).guide!.runs.at(-1)!.input)!;
  expect(observed.networkAllowed).toBe(true);
  expect(observed.authorized).toBe(false);
  await resultCheck(page, 'networkAllowed', 'yes');
  await resultCheck(page, 'authorized', 'no');
  await finish(page);
  await select(page, 'appAuth', 'allow');
  await select(page, 'privateState', 'pending');
  await run(page, '1');
  observed = runEndpoint((await facts(page)).guide!.runs.at(-1)!.input)!;
  expect(observed.resolved).toBe(true);
  expect(observed.endpointReady).toBe(false);
  await resultCheck(page, 'endpointReady', 'no');
  await select(page, 'privateState', 'approved');
  await select(page, 'resolver', 'custom');
  await run(page, '0');
  await toggle(page, 'forwarding', true);
  await run(page, '2');
  observed = runEndpoint((await facts(page)).guide!.runs.at(-1)!.input)!;
  expect(observed.authorized).toBe(true);
  expect(observed.responseAssumed).toBe(false);
  await resultCheck(page, 'authorized', 'yes');
  await resultCheck(page, 'responseAssumed', 'unknown');
  await page.reload();
  expect((await facts(page)).completed).toContain('dns');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('a correct independent choice with a wrong cause fails; durable help and retry preserve the first', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  await startCase(page, 'nc05');
  await answer(page, 'nc05', 0, 0);
  await page.reload();
  await expect(page.getByRole('radio', { name: items.nc05.reasons[0], exact: true })).toBeChecked();
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  const feedback = page.getByRole('region', { name: c.currentFeedback, exact: true });
  await expect(feedback).toContainText(c.assessment.fail);
  await expect(feedback).toContainText(items.nc05.feedback[1][0]);
  const first = (await facts(page)).firsts[0];
  await startCase(page, 'nc05');
  await page.getByRole('link', { name: c.assessment.help, exact: true }).click();
  await expect(page.locator('[data-activity-heading]')).toHaveText(c.topics.expressroute);
  await expect.poll(async () => (await facts(page)).assisted).toBe(true);
  await lesson(page, 'assessment');
  await answer(page, 'nc05', 0, 1);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(feedback).toContainText(c.assessment.pass);
  expect((await facts(page)).firsts[0]).toEqual(first);
  expect((await facts(page)).current).toMatchObject({
    assisted: true,
    retry: true,
    status: 'submitted',
  });
  await lesson(page, 'summary');
  await expect(page.locator('.connectivity-summary')).toContainText(c.assessment.fail);
  await page.reload();
  expect((await facts(page)).firsts[0]).toEqual(first);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections['private-dns'].paragraphs[0]);
});

test('abandonment retains family exposure and never manufactures a first submission or guided credit', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  await startCase(page, 'nc01');
  await answer(page, 'nc01', 2, 1);
  await page.getByRole('button', { name: c.assessment.abandon, exact: true }).click();
  await startCase(page, 'nc02');
  expect((await facts(page)).current).toMatchObject({ item: 'nc02', retry: true, assisted: false });
  await expect(page.getByText(items.nc02.decisive, { exact: true })).toHaveCount(0);
  await page.reload();
  expect((await facts(page)).firsts).toEqual([]);
  expect((await facts(page)).completed).toEqual([]);
  await answer(page, 'nc02', 0, 2);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  expect((await facts(page)).firsts[0]).toMatchObject({
    item: 'nc02',
    retry: true,
    assisted: false,
  });
});

test('Part A teaching and feedback durably classify aid for the new context; already-open Journal withdraws on conflict', async ({
  page,
}) => {
  let a = applyNetworking(freshNetworking(), { kind: 'begin', item: 'nw01' })!;
  a = applyNetworking(a, { kind: 'draft', answer: { decision: 1, reason: 2 } })!;
  a = applyNetworking(a, { kind: 'submit' })!;
  await seed(page, networkingKey, JSON.stringify(a));
  await root(page);
  await lesson(page, 'assessment');
  await startCase(page, 'nc10');
  await answer(page, 'nc10', 2, 1);
  await page.goto('/learn/networking?topic=assessment&case=nw01');
  await expect(
    page.getByRole('region', { name: networkingNb.currentFeedback, exact: true }),
  ).toBeVisible();
  await expect.poll(async () => (await facts(page)).assisted).toBe(true);
  const priorA = await page.evaluate((key) => localStorage.getItem(key), networkingKey);
  expect(networkingFacts(JSON.parse(priorA!)).firsts[0]).toEqual(networkingFacts(a).firsts[0]);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(networkingNb.sections.dns.paragraphs[0]);
  const peer = await page.context().newPage();
  await peer.goto('/');
  const newer = applyConnectivity(await read(page), {
    kind: 'draft',
    answer: { decision: 0, reason: 1 },
  })!;
  const newerRaw = JSON.stringify(newer);
  await peer.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: connectivityKey,
    raw: newerRaw,
  });
  await expect(
    page.getByText(networkingNb.sections.dns.paragraphs[0], { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: c.storage.title, exact: true }),
  ).toBeVisible();
  await close(page);
  await page.goto(connectivityHref('assessment', 'nc10'));
  await expect(
    page.getByRole('radio', { name: items.nc10.decisions[0], exact: true }),
  ).toBeChecked();
  expect(await page.evaluate((key) => localStorage.getItem(key), connectivityKey)).toBe(newerRaw);
  expect(
    networkingFacts(
      JSON.parse((await page.evaluate((key) => localStorage.getItem(key), networkingKey))!),
    ).firsts[0],
  ).toEqual(networkingFacts(a).firsts[0]);
  expect(await page.evaluate((key) => localStorage.getItem(key), networkingKey)).toBe(priorA);
  await peer.close();
});

test('denied durable aid withholds Journal while the student retains their own saved draft and scoped recovery', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  await startCase(page, 'nc11');
  await answer(page, 'nc11', 1, 2);
  const before = await read(page);
  await page.evaluate((key) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, value) {
      if (k === key) throw Error('denied Part B fixture');
      return set.call(this, k, value);
    };
  }, connectivityKey);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: c.storage.title, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(c.sections['private-dns'].paragraphs[0], { exact: true }),
  ).toHaveCount(0);
  await close(page);
  await expect(
    page.getByRole('radio', { name: items.nc11.decisions[1], exact: true }),
  ).toBeChecked();
  await expect(page.getByRole('button', { name: c.assessment.submit, exact: true })).toBeDisabled();
  expect((await read(page)).events).toEqual(before.events);
  expect((await facts(page)).assisted).toBe(false);
  await page.reload();
  await expect(page.getByRole('button', { name: c.assessment.submit, exact: true })).toBeEnabled();
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  expect((await facts(page)).firsts[0]).toMatchObject({
    assisted: false,
    answer: { decision: 1, reason: 2 },
  });
});

test('active assisted older missions suppress Part B guidance and keep their own controls accessible', async ({
  page,
}) => {
  let older = applyMission(freshMissions(), {
    type: 'start',
    mission: 'platform',
    mode: 'independent',
    attempt: 1,
    boundary: null,
  })!;
  older = applyMission(older, { type: 'aid' })!;
  await seed(page, missionKey, JSON.stringify(older));
  await root(page);
  for (const topic of ['vpn', 'expressroute', 'endpoints', 'private-dns'] as const) {
    await lesson(page, topic);
    await expect(page.getByText(c.storage.unsafe, { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: c.labels.begin, exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: c.labels.run, exact: true })).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  }
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
  expect(
    missionFacts(
      JSON.parse((await page.evaluate((key) => localStorage.getItem(key), missionKey))!),
    ),
  ).toMatchObject({ active: true, assisted: true });
  expect((await facts(page)).guided).toEqual([]);
});

test('active assisted Part B continues to shield earlier automatic teaching without changing the saved first', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  await startCase(page, 'nc08');
  await page.getByRole('link', { name: c.assessment.help, exact: true }).click();
  await expect.poll(async () => (await facts(page)).assisted).toBe(true);
  await expect(page.getByRole('button', { name: c.labels.begin, exact: true })).toHaveCount(0);
  await page.goto('/learn/networking?topic=peering');
  await expect(page.getByText(networkingNb.storage.unsafe, { exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: networkingNb.labels.run, exact: true }),
  ).toHaveCount(0);
  await page.goto('/learn/compute?topic=containers');
  await expect(page.getByText(computeNb.storage.unsafe, { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/');
  await page.locator('.learn-hub-module[data-module="connectivity"]').getByRole('link').click();
  await expect(page).toHaveURL(/topic=assessment.*case=nc08/);
  await answer(page, 'nc08', 2, 2);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  expect((await facts(page)).firsts[0]).toMatchObject({ item: 'nc08', assisted: true });
  expect((await facts(page)).guided).toEqual([]);
});

test('invalid recovery is scoped and a newer valid replacement survives an already-open confirmation', async ({
  page,
}) => {
  const older = JSON.stringify(
    applyNetworking(freshNetworking(), { kind: 'visit', topic: 'dns' })!,
  );
  await seed(page, networkingKey, older);
  await seed(page, connectivityKey, '{broken');
  await page.goto(connectivityHref('assessment'));
  await expect(page.getByRole('heading', { name: c.storage.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.storage.recover, exact: true }).click();
  const replacement = JSON.stringify(
    applyConnectivity(freshConnectivity(), { kind: 'begin', item: 'nc03' })!,
  );
  const peer = await page.context().newPage();
  await peer.goto('/');
  await peer.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: connectivityKey,
    raw: replacement,
  });
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.storage.confirm, exact: true })
    .click();
  expect(await page.evaluate((key) => localStorage.getItem(key), connectivityKey)).toBe(
    replacement,
  );
  expect(await page.evaluate((key) => localStorage.getItem(key), networkingKey)).toBe(older);
  // The peer write deliberately invalidated this tab. Recovery must preserve
  // that newer record; explicit reload adopts it without merging or deleting.
  await page.getByRole('button', { name: c.storage.reload, exact: true }).click();
  await expect(page.getByRole('button', { name: c.assessment.abandon, exact: true })).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), connectivityKey)).toBe(
    replacement,
  );
  await peer.close();
});

test('at the event bound, saved own answers, durable Journal aid and terminal submit retain their reserved capacity', async ({
  page,
}) => {
  let save = freshConnectivity();
  for (let index = 0; index < 794; index++)
    save = applyConnectivity(save, {
      kind: 'visit',
      topic: index % 2 === 0 ? 'vpn' : 'endpoints',
    })!;
  save = applyConnectivity(save, { kind: 'begin', item: 'nc12' })!;
  expect(save.events).toHaveLength(795);
  await seed(page, connectivityKey, JSON.stringify(save));
  await page.goto(connectivityHref('assessment', 'nc12'));
  await expect(page.getByText(c.storage.capacity, { exact: true })).toBeVisible();
  await answer(page, 'nc12', 0, 0);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.endpoints.paragraphs[0]);
  await expect.poll(async () => (await facts(page)).assisted).toBe(true);
  await close(page);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.getByRole('region', { name: c.currentFeedback, exact: true })).toContainText(
    c.assessment.pass,
  );
  const first = (await facts(page)).firsts[0];
  expect(first).toMatchObject({ item: 'nc12', assisted: true, status: 'submitted' });
  await page.reload();
  expect((await facts(page)).firsts[0]).toEqual(first);
  await expect(page.getByRole('button', { name: c.assessment.retry, exact: true })).toBeDisabled();
  expect((await read(page)).events.length).toBeLessThanOrEqual(800);
});

test('short briefing, keyboard, reduced motion and semantic endpoint stages remain readable across desktop and compact sizes', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await root(page);
  await lesson(page, 'private-dns');
  await page.getByRole('button', { name: c.labels.begin, exact: true }).click();
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
    page.getByRole('dialog').getByText(c.missions.dns.steps.at(-1)!, { exact: true }),
  ).toBeInViewport();
  await expect(
    page.getByRole('dialog').getByRole('button', { name: serverlessNb.start, exact: true }),
  ).toBeInViewport();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
  await run(page, '1');
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
    [640, 600],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.locator('.connectivity-pipeline').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await expect(page.locator('.connectivity-verdict')).toBeVisible();
    await page.screenshot({ path: info.outputPath(`endpoint-${width}x${height}.png`) });
  }
  const control = page.getByRole('combobox', { name: c.model.labels.dns, exact: true });
  await control.focus();
  await page.keyboard.press('ArrowDown');
  await expect(control).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
