import { SandboxStore, sandboxKey } from '../../src/domain/sandbox/store';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  identityNb as c,
  identityItemsNb,
  nb,
  serverlessNb,
  courseHubNb as h,
} from '../../src/content/nb';
import {
  identityHref,
  identityKey,
  identityFacts,
  freshIdentity,
  applyIdentity,
  identityGuidedAnswer,
  type IdentitySave,
  type IdentityMission,
} from '../../src/domain/curriculum/identity-foundations';
import { type IdentityInput } from '../../src/domain/curriculum/identity-foundations-model';
import { identityContrasts, journey, external } from '../fixtures/identity';
import { storageKey, freshStorage, applyStorage } from '../../src/domain/curriculum/storage';
import {
  resilienceKey,
  freshResilience,
  applyResilience,
} from '../../src/domain/curriculum/storage-resilience';
import { openCoursePath } from './course-hub-actions';
const bench = (p: Page) => p.locator('.identity-workbench');
const raw = (p: Page, key = identityKey) => p.evaluate((k) => localStorage.getItem(k), key);
const facts = async (p: Page) =>
  identityFacts(JSON.parse((await raw(p)) ?? JSON.stringify(freshIdentity())) as IdentitySave);
async function studio(p: Page, mission: IdentityMission) {
  await p.goto(identityHref('studio') + '&perspective=' + mission);
  await bench(p).getByRole('button', { name: c.labels.begin, exact: true }).click();
  await p
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
}
async function run(p: Page, input: IdentityInput) {
  for (const [key, value] of Object.entries(input)) {
    if (key === 'kind') continue;
    const label = c.controls[key as keyof typeof c.controls];
    const target = bench(p).getByRole(typeof value === 'boolean' ? 'checkbox' : 'combobox', {
      name: label,
      exact: true,
    });
    if (await target.isDisabled()) continue;
    if (typeof value === 'boolean') await target.setChecked(value);
    else await target.selectOption(String(value));
  }
  await bench(p).getByRole('combobox', { name: c.labels.predict, exact: true }).selectOption('1');
  await bench(p).getByRole('button', { name: c.labels.run, exact: true }).click();
  await expect(bench(p).locator('.compute-observation')).toBeVisible();
  if (await p.getByRole('dialog').isVisible()) await p.getByRole('dialog').press('Escape');
  const observed = (await facts(p)).guide?.runs.at(-1)?.input;
  for (const [key, value] of Object.entries(input)) {
    if (
      input.kind === 'directory' &&
      input.solution !== 'managed' &&
      ['sync', 'change'].includes(key)
    )
      continue;
    if (
      input.kind === 'external' &&
      ((input.approach !== 'b2b' && ['guest', 'invitation'].includes(key)) ||
        ((input.approach === 'customer' || input.home === 'other') &&
          ['inbound', 'outbound'].includes(key)))
    )
      continue;
    expect(observed).toHaveProperty(key, value);
  }
}
async function explain(p: Page, mission: IdentityMission) {
  await bench(p)
    .getByRole('radio', { name: c.causal[mission][identityGuidedAnswer[mission]], exact: true })
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
async function choose(p: Page, item: keyof typeof identityItemsNb, d: number, r: number) {
  const f = p.locator('.identity-lesson .compute-assessment form');
  await f.getByRole('radio', { name: identityItemsNb[item].decisions[d]!, exact: true }).check();
  await f.getByRole('radio', { name: identityItemsNb[item].reasons[r]!, exact: true }).check();
}
test('Identity follows Storage in one existing path with exact sidebar, Back/Forward, reload and non-completing navigation', async ({
  page,
}) => {
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-path')).toHaveCount(3);
  await expect(page.locator('.course-hub .course-primary')).toHaveCount(1);
  const row = page.locator('.learn-hub-module[data-module="identity"]');
  await expect(row).toContainText(h.moduleLabels.identity);
  await expect(
    page
      .locator('.learn-hub-path')
      .filter({ has: page.getByRole('heading', { name: h.paths.architecture.title, exact: true }) })
      .locator('.learn-hub-planned'),
  ).toContainText('RBAC & Conditional Access');
  await row.locator('a').click();
  await expect(page).toHaveURL(identityHref('introduction'));
  for (const topic of ['directory', 'domain', 'sso', 'mfa', 'passwordless', 'external'] as const) {
    await openCoursePath(page, 'architecture');
    await page.locator(`#course-activities-identity a[href="${identityHref(topic)}"]`).click();
    await expect(page.locator('.identity-lesson [data-activity-heading]')).toHaveText(
      c.topics[topic],
    );
  }
  await page.locator('.course-overview-link').click();
  await expect(page).toHaveURL('/learn');
  await page.locator('.learn-hub-module[data-module="cost"] a').click();
  await expect(page).toHaveURL(/learn\/cost/);
  await page.goBack();
  await expect(page).toHaveURL('/learn');
  await page.goBack();
  await expect(page).toHaveURL(identityHref('external'));
  await page.reload();
  await expect(page.locator('#course-activities-identity a[aria-current="step"]')).toHaveText(
    c.topics.external,
  );
  await page.getByRole('link', { name: nb.course.sandbox, exact: true }).click();
  await expect(page).toHaveURL('/portal');
  await page.getByRole('link', { name: nb.course.returnCourse, exact: true }).click();
  await expect(page).toHaveURL(/\/learn/);
  if (new URL(page.url()).pathname === '/learn') {
    await expect(page.locator('.learn-hub-start a.course-primary')).toHaveAttribute(
      'href',
      identityHref('external'),
    );
    await page.locator('.learn-hub-start a.course-primary').click();
  }
  await expect(page).toHaveURL(identityHref('external'));
  await page.goto('/learn/storage-resilience?topic=summary');
  await page.locator('.course-step-navigation .course-nav-next a').click();
  await expect(page).toHaveURL(identityHref('introduction'));
  await page.locator('.course-step-navigation .course-nav-previous a').click();
  await expect(page).toHaveURL('/learn/storage-resilience?topic=summary');
  expect((await facts(page)).completed).toEqual([]);
  expect((await facts(page)).firsts).toEqual([]);
});
test('directory guide requires capability, credential, source and schema contrasts without a deployment or old-history credit', async ({
  page,
}) => {
  let a = applyStorage(freshStorage(), { kind: 'begin', item: 'sa01' })!;
  a = applyStorage(a, { kind: 'draft', answer: { decision: 0, reason: 0 } })!;
  a = applyStorage(a, { kind: 'submit' })!;
  let old = applyResilience(freshResilience(), { kind: 'begin', item: 'rb01' })!;
  old = applyResilience(old, { kind: 'draft', answer: { decision: 1, reason: 2 } })!;
  old = applyResilience(old, { kind: 'submit' })!;
  const oldA = JSON.stringify(a),
    oldB = JSON.stringify(old);
  const priorBytes = new Map<string, string>();
  const priorSandbox = new SandboxStore({
    getItem: (k) => priorBytes.get(k) ?? null,
    setItem: (k, v) => {
      priorBytes.set(k, v);
    },
    removeItem: (k) => {
      priorBytes.delete(k);
    },
  });
  priorSandbox.load();
  expect(
    priorSandbox.dispatch({
      kind: 'command',
      request: {
        commandId: 'prior-identity-group',
        expectedWorldRevision: priorSandbox.getSnapshot().attempt.engine.world.revision,
        command: {
          type: 'CreateGroup',
          subscriptionId: 'sub-app',
          metadataRegion: 'norwayeast',
          name: 'rg-prior-identity',
        },
      },
    }),
  ).toBe(true);
  expect(priorSandbox.getSnapshot().attempt.responses.at(-1)?.outcome).toBe('accepted');
  const oldTechnical = priorBytes.get(sandboxKey)!;
  const oldXp = JSON.stringify({ version: 1, completed: ['organization-mission-v1'] });

  await page.addInitScript(
    ({ a, b, oldA, oldB, technicalKey, oldTechnical, oldXp }) => {
      if (!localStorage.getItem(a)) localStorage.setItem(a, oldA);
      if (!localStorage.getItem(b)) localStorage.setItem(b, oldB);
      if (!localStorage.getItem(technicalKey)) localStorage.setItem(technicalKey, oldTechnical);
      if (!localStorage.getItem('azurelab.progress.v1'))
        localStorage.setItem('azurelab.progress.v1', oldXp);
    },
    { a: storageKey, b: resilienceKey, oldA, oldB, technicalKey: sandboxKey, oldTechnical, oldXp },
  );
  await page.goto(identityHref('studio') + '&perspective=directory');
  await bench(page).getByRole('button', { name: c.labels.begin, exact: true }).click();
  await page.getByRole('dialog').press('Escape');
  expect((await facts(page)).guided).toEqual([]);
  await studio(page, 'directory');
  const technical = await page.evaluate(() =>
    ['azurelab.sandbox.v2', 'azurelab.progress.v1'].map((k) => localStorage.getItem(k)),
  );
  for (const input of identityContrasts.directory) await run(page, input);
  await expect(bench(page)).toContainText(c.model.directoryCauses.fit);
  await explain(page, 'directory');
  expect((await facts(page)).completed).toEqual(['directory']);
  expect(
    await page.evaluate(() =>
      ['azurelab.sandbox.v2', 'azurelab.progress.v1'].map((k) => localStorage.getItem(k)),
    ),
  ).toEqual(technical);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect((await facts(page)).completed).toEqual(['directory']);
  expect(await raw(page, storageKey)).toBe(oldA);
  expect(await raw(page, resilienceKey)).toBe(oldB);
  expect(await raw(page, sandboxKey)).toBe(oldTechnical);
  expect(await raw(page, 'azurelab.progress.v1')).toBe(oldXp);
});
test('sign-in guide separates SSO, different factors, passwordless and a paired app authorization change', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (r) => {
    if (!r.url().startsWith('http://127.0.0.1:3000')) requests.push(r.url());
  });
  await studio(page, 'journey');
  for (const input of identityContrasts.journey) await run(page, input);
  await explain(page, 'journey');
  await run(page, { ...journey, method: 'authenticator', requirement: 'resistant' });
  await expect(bench(page)).toContainText(c.model.journeyCauses.strength);
  await run(page, { ...journey, method: 'passkey', identity: false, access: 'allow' });
  await expect(bench(page)).toContainText(c.model.journeyCauses.identity);
  await expect(bench(page)).toContainText(c.model.accessText['not-evaluated']);
  expect((await facts(page)).completed).toEqual(['journey']);
  expect(requests).toEqual([]);
});
test('external guide separates home, resource, guest, customer and mutual shared-channel conditions', async ({
  page,
}) => {
  await studio(page, 'external');
  for (const input of identityContrasts.external) await run(page, input);
  await explain(page, 'external');
  await run(page, { ...external, audience: 'shared', approach: 'direct', home: 'other' });
  await expect(bench(page)).toContainText(c.model.externalCauses['direct-scope']);
  await expect(bench(page)).toContainText(c.model.noAdmin);
  await run(page, { ...external, guest: true, homeAuth: false });
  const externalFacts = bench(page).locator('.identity-facts');
  await expect(
    externalFacts
      .locator('div')
      .filter({ has: page.getByText(c.visual.collaborationReady, { exact: true }) }),
  ).toContainText(c.model.yes);
  await expect(
    externalFacts
      .locator('div')
      .filter({ has: page.getByText(c.visual.resourceAccepted, { exact: true }) }),
  ).toContainText(c.model.no);
  await expect(externalFacts).not.toContainText(c.visual.requirements);

  expect((await facts(page)).completed).toEqual(['external']);
});
test('paired firsts, Journal assistance, retry, historical feedback and exact independent resume remain distinct', async ({
  page,
}) => {
  await page.goto(identityHref('assessment', 'if04'));
  await begin(page);
  await expect(page.locator('.compute-feedback')).toHaveCount(0);
  await choose(page, 'if04', 1, 1);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.fail);
  const first = JSON.stringify((await facts(page)).firsts[0]);
  await begin(page);
  await choose(page, 'if04', 1, 0);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.sso.title);
  expect((await facts(page)).assisted).toBe(true);
  await page.getByRole('dialog').press('Escape');
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.pass);
  expect(JSON.stringify((await facts(page)).firsts[0])).toBe(first);
  await page.goto(identityHref('assessment', 'if10'));
  await begin(page);
  await choose(page, 'if10', 2, 1);
  const before = await raw(page);
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start a.course-primary')).toHaveAttribute(
    'href',
    identityHref('assessment', 'if10'),
  );
  expect(await raw(page)).toBe(before);
  await page.locator('.learn-hub-start a.course-primary').click();
  await expect(page).toHaveURL(identityHref('assessment', 'if10'));
  await page.reload();
  expect((await facts(page)).current).toMatchObject({
    item: 'if10',
    assisted: false,
    answer: { decision: 2, reason: 1 },
  });
  await page.goto(identityHref('assessment', 'if04'));
  await expect(page.locator('.compute-feedback')).toHaveCount(0);
  expect((await facts(page)).assisted).toBe(false);
  await page.goto(identityHref('assessment', 'if10'));
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  expect(JSON.stringify((await facts(page)).firsts[0])).toBe(first);
});
test('denied aid, already-open cross-tab Journal, Portal shielding and compare-before-delete recovery remain fail-closed', async ({
  page,
}) => {
  const seed = JSON.stringify(applyIdentity(freshIdentity(), { kind: 'begin', item: 'if08' }));
  await page.addInitScript(
    ({ key, seed }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, seed);
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && sessionStorage.getItem('deny-identity') === 'yes') throw Error('denied');
        return set.call(this, k, v);
      };
    },
    { key: identityKey, seed },
  );
  await page.goto(identityHref('assessment', 'if08'));
  await page.evaluate(() => sessionStorage.setItem('deny-identity', 'yes'));
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.external.title);
  expect(await raw(page)).toBe(seed);
  await page.getByRole('dialog').press('Escape');
  await page.evaluate(() => sessionStorage.removeItem('deny-identity'));
  await page.getByRole('button', { name: c.storage.reload, exact: true }).click();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.external.title);
  expect((await facts(page)).assisted).toBe(true);
  const peer = await page.context().newPage();
  await peer.goto('/learn');
  const save = JSON.parse((await raw(page))!) as IdentitySave;
  const newer = JSON.stringify(
    applyIdentity(save, { kind: 'draft', answer: { decision: 1, reason: 2 } }),
  );
  await peer.evaluate(({ key, newer }) => localStorage.setItem(key, newer), {
    key: identityKey,
    newer,
  });
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.external.title);
  expect(await raw(page)).toBe(newer);
  await page.getByRole('dialog').press('Escape');
  await page.goto('/portal');
  await expect(page.locator('.guidance-window')).toHaveCount(0);
  await expect(page.locator('[data-guide-state]')).toHaveCount(0);
  expect(await raw(page)).toBe(newer);
  await peer.close();
  await page.evaluate((key) => localStorage.setItem(key, '{broken'), identityKey);
  await page.goto(identityHref('assessment', 'if08'));
  await page.getByRole('button', { name: c.storage.recover, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.storage.confirm, exact: true })
    .click();
  expect((await facts(page)).attempts).toEqual([]);
});
test('Identity desktop and compact keyboard, semantic flows, reduced motion and short native briefing stay readable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await studio(page, 'journey');
  await run(page, { ...journey, method: 'passkey', access: 'deny' });
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
    [800, 700],
  ] as const) {
    await page.setViewportSize({ width, height });
    const select = bench(page).getByRole('combobox', { name: c.controls.access, exact: true });
    await select.scrollIntoViewIfNeeded();
    await select.focus();
    await expect(select).toBeFocused();
    await page.keyboard.press('Tab');
    const button = bench(page).getByRole('button', { name: c.labels.run, exact: true });
    await button.hover();
    await expect(button).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(button).toHaveCSS('background-color', 'rgb(7, 85, 149)');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await button.focus();
    await expect(button).toHaveCSS('outline-width', '3px');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
  await bench(page).getByText(c.visual.details, { exact: true }).click();
  await expect(
    bench(page).getByRole('table', { name: c.visual.methodTable, exact: true }),
  ).toBeVisible();
  const tableRegion = bench(page).getByRole('region', { name: c.visual.methodTable, exact: true });
  await tableRegion.focus();
  await expect(tableRegion).toBeFocused();
  await page.keyboard.press('ArrowRight');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await bench(page).getByRole('button', { name: c.labels.recall, exact: true }).click();
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
