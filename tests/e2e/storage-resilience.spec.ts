import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  storageResilienceNb as c,
  resilienceItemsNb,
  nb,
  serverlessNb,
  courseHubNb as h,
} from '../../src/content/nb';
import {
  resilienceHref,
  resilienceKey,
  resilienceFacts,
  freshResilience,
  applyResilience,
  type ResilienceSave,
  type ResilienceMission,
} from '../../src/domain/curriculum/storage-resilience';
import {
  initialTiers,
  initialReplication,
  type ResilienceInput,
} from '../../src/domain/curriculum/storage-resilience-model';
import {
  freshStorage,
  storageKey,
  applyStorage,
  storageFacts,
} from '../../src/domain/curriculum/storage';
import { openCoursePath } from './course-hub-actions';
const bench = (page: Page) => page.locator('.resilience-workbench');
const raw = (page: Page, key = resilienceKey) => page.evaluate((k) => localStorage.getItem(k), key);
const facts = async (page: Page) =>
  resilienceFacts(
    JSON.parse((await raw(page)) ?? JSON.stringify(freshResilience())) as ResilienceSave,
  );
async function studio(page: Page, mission: ResilienceMission) {
  await page.goto(resilienceHref('studio') + '&perspective=' + mission);
  await bench(page).getByRole('button', { name: c.labels.begin, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
}
async function run(page: Page, input: ResilienceInput) {
  for (const [key, value] of Object.entries(input)) {
    if (key === 'kind') continue;
    if (
      input.kind === 'tiers' &&
      ['phase', 'rule'].includes(key) &&
      (input.assignment === 'inherit' || input.tier !== 'archive')
    )
      continue;
    if (key === 'region') {
      await bench(page)
        .getByRole('checkbox', { name: c.labels.region, exact: true })
        .setChecked(Boolean(value));
      continue;
    }
    const label =
      key === 'tier' && input.kind === 'replication'
        ? c.labels.replicaTier
        : c.labels[key as keyof typeof c.labels];
    if (key === 'days' || key === 'amount')
      await bench(page)
        .getByRole('spinbutton', { name: String(label), exact: true })
        .fill(String(value));
    else
      await bench(page)
        .getByRole('combobox', { name: String(label), exact: true })
        .selectOption(String(value));
  }
  await bench(page)
    .getByRole('combobox', { name: c.labels.predict, exact: true })
    .selectOption('1');
  await bench(page).getByRole('button', { name: c.labels.run, exact: true }).click();
  await expect(bench(page).locator('.compute-observation')).toBeVisible();
  if (await page.getByRole('dialog').isVisible()) await page.getByRole('dialog').press('Escape');
  expect((await facts(page)).guide?.runs.at(-1)?.input).toEqual(input);
}
async function explain(page: Page, mission: ResilienceMission, index: number) {
  await bench(page).getByRole('radio', { name: c.causal[mission][index], exact: true }).check();
  await bench(page).getByRole('button', { name: c.labels.explain, exact: true }).click();
  await expect(bench(page).getByText(c.labels.done, { exact: true })).toBeVisible();
}
async function begin(page: Page) {
  await page
    .getByRole('button', { name: new RegExp(`^(${c.assessment.start}|${c.assessment.retry})$`) })
    .click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
}
async function choose(page: Page, item: keyof typeof resilienceItemsNb, d: number, r: number) {
  const form = page.locator('.resilience-lesson .compute-assessment form');
  await form
    .getByRole('radio', { name: resilienceItemsNb[item].decisions[d], exact: true })
    .check();
  await form.getByRole('radio', { name: resilienceItemsNb[item].reasons[r], exact: true }).check();
}
test('Storage parts share one Hub group and keep exact A links, active sidebar, history and B return', async ({
  page,
}) => {
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-path')).toHaveCount(3);
  await expect(page.locator('.course-hub .course-primary')).toHaveCount(1);
  const group = page.locator('.learn-hub-module[data-module="storage"]');
  await expect(group).toContainText(h.moduleLabels.storage);
  await expect(page.locator('.learn-hub-module[data-module="storage-resilience"]')).toContainText(
    h.moduleLabels['storage-resilience'],
  );
  await expect(page.locator('.learn-hub-planned')).toContainText([
    'File Movement & Migration',
    'Governance',
  ]);
  await page.locator('.learn-hub-module[data-module="storage-resilience"] a').click();
  await expect(page).toHaveURL(resilienceHref('introduction'));
  for (const topic of ['tiers', 'lifecycle', 'redundancy', 'recovery', 'boundaries'] as const) {
    await openCoursePath(page, 'architecture');
    await page
      .locator(`#course-activities-storage-resilience a[href="${resilienceHref(topic)}"]`)
      .click();
    await expect(page.locator('.resilience-lesson [data-activity-heading]')).toHaveText(
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
  await expect(page).toHaveURL(resilienceHref('boundaries'));
  await expect(
    page.locator('#course-activities-storage-resilience a[aria-current="step"]'),
  ).toHaveText(c.topics.boundaries);
  await page.reload();
  await expect(
    page.locator('button[aria-controls="course-activities-storage-resilience"]'),
  ).toHaveAttribute('aria-expanded', 'true');
  await page.goto('/learn/storage?topic=summary');
  await page.locator('.course-step-navigation .course-nav-next a').click();
  await expect(page).toHaveURL(resilienceHref('introduction'));
  expect((await facts(page)).completed).toEqual([]);
  expect((await facts(page)).firsts).toEqual([]);
});
test('tier contrasts preserve Cold online, explicit costs, pending Archive and unsupported combinations without technical state', async ({
  page,
}) => {
  let old = applyStorage(freshStorage(), { kind: 'begin', item: 'sa01' })!;
  old = applyStorage(old, { kind: 'draft', answer: { decision: 0, reason: 0 } })!;
  old = applyStorage(old, { kind: 'submit' })!;
  await page.addInitScript(
    ({ key, old }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, old);
    },
    { key: storageKey, old: JSON.stringify(old) },
  );
  await studio(page, 'tiers');
  const technical = await raw(page, 'azurelab.sandbox.v2');
  const t = initialTiers;
  for (const input of [
    t,
    { ...t, usage: 'frequent' as const },
    { ...t, usage: 'frequent' as const, tier: 'hot' as const },
  ])
    await run(page, input);
  await expect(bench(page)).toContainText(c.model.costAssumptions);
  expect((await facts(page)).completed).toEqual([]);
  for (const input of [
    { ...t, tier: 'archive' as const, retrieval: 'flexible' as const },
    { ...t, tier: 'archive' as const, phase: 'pending' as const },
    { ...t, tier: 'archive' as const, phase: 'complete' as const, rule: 'unguarded' as const },
  ])
    await run(page, input);
  await expect(bench(page).locator('.compute-observation')).toContainText(c.model.lifecycleRisk);
  await run(page, { ...t, tier: 'archive', redundancy: 'ZRS' });
  await expect(bench(page).locator('.compute-observation')).toContainText(c.model.archiveConflict);
  await expect(bench(page).locator('.compute-observation')).not.toContainText(
    c.model.tierUnsupported,
  );
  await explain(page, 'tiers', 1);
  expect((await facts(page)).completed).toEqual(['tiers']);
  expect((await facts(page)).firsts).toEqual([]);
  for (const input of [
    { ...t, tier: 'cool' as const, days: 15, change: 'delete' as const },
    { ...t, service: 'files' as const },
    { ...t, account: 'premium' as const },
  ])
    await run(page, input);
  await expect(bench(page).locator('.compute-observation')).toContainText(c.model.tierUnsupported);
  expect(await raw(page, storageKey)).toBe(JSON.stringify(old));
  expect(await raw(page, 'azurelab.sandbox.v2')).toBe(technical);
  const saved = await raw(page);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await raw(page)).toBe(saved);
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start a.course-primary')).toHaveAttribute(
    'href',
    resilienceHref('studio') + '&perspective=tiers',
  );
});
test('replica maps separate physical survival, read-only secondary, missing writes, deletion and service support', async ({
  page,
}) => {
  await studio(page, 'replication');
  const p = initialReplication;
  for (const input of [
    p,
    { ...p, failure: 'zone' as const },
    { ...p, redundancy: 'ZRS' as const, failure: 'zone' as const },
    { ...p, redundancy: 'GRS' as const, failure: 'region' as const },
    { ...p, redundancy: 'RA-GRS' as const, failure: 'region' as const },
  ])
    await run(page, input);
  await expect(bench(page).locator('.compute-observation')).toContainText(c.model.pendingWrite);
  await expect(bench(page).locator('.compute-observation')).toContainText(c.model.writeNo);
  await expect(bench(page).locator('.compute-observation')).toContainText(c.model.failoverNeeded);
  await run(page, { ...p, redundancy: 'RA-GZRS', failure: 'deletion' });
  await expect(bench(page).locator('.compute-observation')).toContainText(c.model.deletion);
  await expect(bench(page).locator('.compute-observation')).toContainText(c.model.restoreNeeded);
  await expect(bench(page).locator('.compute-observation')).not.toContainText(
    c.model.noRegionalCopy,
  );
  await expect(bench(page).locator('.resilience-replica-map li[data-state="deleted"]')).toHaveCount(
    6,
  );
  await explain(page, 'replication', 2);
  await run(page, { ...p, target: 'filesHdd', redundancy: 'RA-GRS', failure: 'region' });
  await expect(bench(page).locator('.compute-observation')).toContainText(c.model.filesRa);
  for (const input of [
    { ...p, target: 'diskSsd' as const, redundancy: 'GRS' as const },
    { ...p, target: 'filesSsd' as const, redundancy: 'GZRS' as const },
  ]) {
    await run(page, input);
    await expect(bench(page).locator('.compute-observation')).toContainText(c.model.typeConflict);
  }
  await run(page, { ...p, region: false });
  await expect(bench(page).locator('.compute-observation')).toContainText(c.model.regionUnknown);
  await expect(bench(page).locator('.resilience-replica-map')).toHaveCount(0);
  await page.goto(resilienceHref('summary'));
  await expect(page.locator('.resilience-summary')).toContainText('1/2');
  expect((await facts(page)).firsts).toEqual([]);
});
test('new independent decisions keep immutable firsts, family exposure, durable teaching aid and exact resume', async ({
  page,
}) => {
  await page.goto(resilienceHref('assessment', 'rb03'));
  await begin(page);
  await expect(page.locator('.compute-feedback')).toHaveCount(0);
  await choose(page, 'rb03', 0, 0);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.fail);
  const first = JSON.stringify((await facts(page)).firsts[0]);
  await begin(page);
  await choose(page, 'rb03', 0, 1);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.lifecycle.title);
  expect((await facts(page)).assisted).toBe(true);
  await page.getByRole('dialog').press('Escape');
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.pass);
  expect(JSON.stringify((await facts(page)).firsts[0])).toBe(first);
  await page.goto(resilienceHref('assessment', 'rb09'));
  await begin(page);
  await choose(page, 'rb09', 1, 0);
  const before = await raw(page);
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start a.course-primary')).toHaveAttribute(
    'href',
    resilienceHref('assessment', 'rb09'),
  );
  expect(await raw(page)).toBe(before);
  await page.locator('.learn-hub-start a.course-primary').click();
  await expect(page).toHaveURL(resilienceHref('assessment', 'rb09'));
  await expect(page.locator('.compute-assessment form')).toBeVisible();
  await page.reload();
  await expect(page.locator('.compute-assessment')).toContainText(resilienceItemsNb.rb09.problem);
  expect((await facts(page)).current).toMatchObject({
    item: 'rb09',
    assisted: false,
    answer: { decision: 1, reason: 0 },
  });
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.pass);
  expect(JSON.stringify((await facts(page)).firsts[0])).toBe(first);
});
test('denied assistance, already-open cross-tab Journal and scoped recovery preserve Part A and newer writes', async ({
  page,
}) => {
  const seed = JSON.stringify(applyResilience(freshResilience(), { kind: 'begin', item: 'rb08' })),
    old = JSON.stringify(freshStorage());
  await page.addInitScript(
    ({ key, seed, oldKey, old }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, seed);
      if (!localStorage.getItem(oldKey)) localStorage.setItem(oldKey, old);
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && sessionStorage.getItem('deny-resilience') === 'yes') throw Error('denied');
        return set.call(this, k, v);
      };
    },
    { key: resilienceKey, seed, oldKey: storageKey, old },
  );
  await page.goto(resilienceHref('assessment', 'rb08'));
  await page.evaluate(() => sessionStorage.setItem('deny-resilience', 'yes'));
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.recovery.title);
  expect(await raw(page)).toBe(seed);
  await page.getByRole('dialog').press('Escape');
  await page.evaluate(() => sessionStorage.removeItem('deny-resilience'));
  await page.getByRole('button', { name: c.storage.reload, exact: true }).click();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.recovery.title);
  expect((await facts(page)).assisted).toBe(true);
  const peer = await page.context().newPage();
  await peer.goto('/learn');
  const current = JSON.parse((await raw(page))!) as ResilienceSave;
  const newer = JSON.stringify(
    applyResilience(current, { kind: 'draft', answer: { decision: 2, reason: 1 } }),
  );
  await peer.evaluate(({ key, newer }) => localStorage.setItem(key, newer), {
    key: resilienceKey,
    newer,
  });
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.recovery.title);
  expect(await raw(page)).toBe(newer);
  await page.getByRole('dialog').press('Escape');
  await page.getByRole('button', { name: c.storage.reload, exact: true }).click();
  expect((await facts(page)).current?.answer).toEqual({ decision: 2, reason: 1 });
  await peer.close();
  await page.evaluate((key) => localStorage.setItem(key, '{broken'), resilienceKey);
  await page.reload();
  await page.getByRole('button', { name: c.storage.recover, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.storage.confirm, exact: true })
    .click();
  expect((await facts(page)).attempts).toEqual([]);
  expect(await raw(page, storageKey)).toBe(old);
  expect(storageFacts(JSON.parse(old)).firsts).toEqual([]);
});
test('Storage B desktop and compact keyboard, hover contrast, semantic maps and short native briefing remain readable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await studio(page, 'replication');
  await run(page, { ...initialReplication, redundancy: 'RA-GZRS', failure: 'region' });
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
    [800, 700],
  ] as const) {
    await page.setViewportSize({ width, height });
    const target = bench(page).getByRole('combobox', { name: c.labels.failure, exact: true });
    await target.scrollIntoViewIfNeeded();
    await target.focus();
    await expect(target).toBeFocused();
    await page.keyboard.press('Tab');
    const primary = bench(page).getByRole('button', { name: c.labels.run, exact: true });
    await primary.hover();
    await expect(primary).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(primary).toHaveCSS('background-color', 'rgb(7, 85, 149)');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.mouse.move(0, 0);
    await primary.focus();
    await expect(primary).toHaveCSS('outline-width', '3px');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
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
