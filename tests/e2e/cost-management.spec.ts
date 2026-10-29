import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { costNb as c, costItemsNb, nb } from '../../src/content/nb';
import { revealPortalLink } from './portal-actions';
import {
  applyCost,
  costFacts,
  costKey,
  costItems,
  costLimit,
  freshCost,
  type CostSave,
} from '../../src/domain/curriculum/cost';
import { freshTransfer, applyTransfer, transferKey } from '../../src/domain/curriculum/transfer';
import { initialEstimate } from '../../src/domain/curriculum/cost-model';
import { milestonePreferenceKey } from '../../src/domain/guidance/milestone-preferences';
const read = async (page: Page) =>
  JSON.parse(
    (await page.evaluate((k) => localStorage.getItem(k), costKey)) ?? JSON.stringify(freshCost()),
  ) as CostSave;
const root = async (page: Page) => {
  await page.goto('/');
  await page.getByRole('link', { name: c.intro + ' →', exact: true }).click();
  await expect(page).toHaveURL(/\/learn\/cost/);
};
const lesson = async (page: Page, topic: keyof typeof c.topics) => {
  await expect(page.getByRole('heading', { name: c.title, level: 1, exact: true })).toBeVisible();
  const link = page
    .locator('.course-navigation-content')
    .getByRole('link', { name: c.topics[topic], exact: true });
  if (!(await link.isVisible()))
    await page.getByRole('button', { name: nb.course.learning, exact: true }).click();
  await link.click();
};
const beginMission = async (page: Page) => {
  await page.getByRole('button', { name: c.guided.brief, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Start undersøkelsen', exact: true })
    .click();
};
const predict = async (page: Page, value: string) => {
  await page
    .getByRole('combobox', { name: c.controls.prediction, exact: true })
    .selectOption(value);
  await page.getByRole('button', { name: c.controls.run, exact: true }).click();
};
const closeMilestone = async (page: Page) => {
  const dialog = page.getByRole('dialog');
  if (await dialog.isVisible())
    await dialog.getByRole('button', { name: 'Lukk', exact: true }).last().click();
};
const answerGuided = async (page: Page, mission: keyof typeof c.missions) => {
  await page
    .getByRole('radio', {
      name: c.missions[mission].answers[c.missions[mission].correct],
      exact: true,
    })
    .check();
  await page.getByRole('button', { name: c.guided.submit, exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: c.guided.done })).toBeVisible();
};
const startCase = async (page: Page, id: keyof typeof costItems) => {
  await page.getByRole('combobox', { name: c.assessment.case, exact: true }).selectOption(id);
  await page.getByRole('button', { name: c.assessment.start, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: costItemsNb[id].title, exact: true }),
  ).toBeFocused();
};
test('actual Portal configuration is read-only context, never fabricated economic history', async ({
  page,
  context,
}) => {
  const p = nb.portal;
  await page.goto('/');
  await page.getByRole('link', { name: 'Fri Portal-sandbox', exact: true }).click();
  await expect(page.locator('.portal-title h1')).toBeVisible();
  const groups = page
    .getByRole('navigation', { name: p.navLabel, exact: true })
    .getByRole('link', { name: p.areas.groups, exact: true });
  await revealPortalLink(page, groups);
  await groups.click();
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page.getByLabel(p.groupName, { exact: true }).fill('rg-cost-reference');
  await page
    .locator('.portal-create-tabs')
    .getByRole('button', { name: p.review, exact: true })
    .click();
  await expect(page.getByText(p.valid, { exact: true })).toBeVisible();
  await page
    .locator('.portal-create-footer')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  const before = await page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(([k]) => /sandbox|chapter|progress/.test(k)),
    ),
  );
  await page.goto('/learn');
  await page.locator('.cost-entry').getByRole('link').click();
  await lesson(page, 'estimate');
  await beginMission(page);
  await page
    .getByRole('combobox', { name: c.workbench.selectResource, exact: true })
    .selectOption({ label: 'rg-cost-reference' });
  await expect(page.getByText(c.reference.unknown, { exact: true })).toBeVisible();
  await expect(page.getByText(c.controls.noResult, { exact: true }).last()).toBeVisible();
  const opened = context.waitForEvent('page');
  await page.getByRole('link', { name: c.reference.open, exact: true }).click();
  const resource = await opened;
  await expect(resource).toHaveURL(/area=resource/);
  await expect(resource.locator('h1')).toContainText('rg-cost-reference');
  await resource.close();
  await expect(page).toHaveURL(/learn\/cost\?topic=estimate/);
  await predict(page, 'same');
  await expect(page.getByText('741,00 ØK', { exact: true }).first()).toBeVisible();
  expect(
    await page.evaluate(() =>
      Object.fromEntries(
        Object.entries(localStorage).filter(([k]) => /sandbox|chapter|progress/.test(k)),
      ),
    ),
  ).toEqual(before);
  expect(costFacts(await read(page)).firsts).toHaveLength(0);
});
test('ordinary root integrates full theory, explicit briefing and causal estimates without old evidence/XP', async ({
  page,
}) => {
  await root(page);
  await expect(
    page.getByText(c.sections.introduction.paragraphs[1], { exact: true }),
  ).toBeVisible();
  await lesson(page, 'estimate');
  await expect
    .poll(async () => (await read(page)).events.at(-1))
    .toEqual({ kind: 'visit', topic: 'estimate' });
  const before = await read(page);
  await page.getByRole('button', { name: c.guided.brief, exact: true }).click();
  await page.getByRole('dialog').press('Escape');
  expect(costFacts(await read(page)).guided).toHaveLength(0);
  expect((await read(page)).events).toEqual(before.events);
  await beginMission(page);
  await predict(page, 'same');
  await expect(page.getByText('741,00 ØK', { exact: true }).first()).toBeVisible();
  await page.getByLabel(c.controls.hours, { exact: true }).fill('240');
  await page.reload();
  await expect(page.getByLabel(c.controls.hours, { exact: true })).toHaveValue('240');
  await predict(page, 'lower');
  await expect(page.getByRole('dialog')).toBeVisible();
  await closeMilestone(page);
  await expect(page.getByText('261,00 ØK', { exact: true }).first()).toBeVisible();
  await answerGuided(page, 'estimate');
  expect(costFacts(await read(page)).firsts).toHaveLength(0);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('status').filter({ hasText: c.guided.done })).toBeVisible();
  expect(costFacts(await read(page)).guide!.runs.length).toBe(2);
  await page.getByRole('button', { name: c.controls.compare, exact: true }).click();
  await page.reload();
  await expect(page.getByText(c.comparisonReference, { exact: false })).toContainText('240');
  expect(costFacts(await read(page)).guide!.configuration).toMatchObject({
    mission: 'estimate',
    baseline: { hours: 240 },
    input: { hours: 240 },
  });
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).filter((k) => /sandbox|chapter|progress|cloud-transfer/.test(k)),
    ),
  ).toEqual([]);
});
test('dated cost analysis filters actual synthetic scope, explains increase and retains observed result', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'analysis');
  await beginMission(page);
  await page.getByRole('combobox', { name: c.controls.scope, exact: true }).selectOption('app');
  await predict(page, 'higher');
  const delta = page.getByRole('table', { name: c.analysis.delta, exact: true });
  await expect(delta.getByRole('row').filter({ hasText: 'Compute' })).toContainText('240,00 ØK');
  await expect(page.getByText(c.analysis.explanation, { exact: true })).toBeVisible();
  await answerGuided(page, 'analysis');
  await page.getByRole('region', { name: c.workbench.allRows, exact: true }).focus();
  await page.keyboard.press('End');
  await expect(page.getByText('2026-09-20 · fixture-transfer', { exact: true })).toBeVisible();
  await page.reload();
  expect(costFacts(await read(page)).completed).toContain('analysis');
});
test('budget contrast never stops resources; observed milestone is once-only and recallable', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'budgets');
  await beginMission(page);
  await predict(page, 'lower');
  await expect(page.getByText(c.budget.no, { exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: c.budget.type, exact: true }).selectOption('forecast');
  await page.getByLabel(c.budget.threshold, { exact: true }).fill('100');
  await predict(page, 'higher');
  await expect(page.getByRole('dialog')).toContainText(c.milestone.budgetText);
  await closeMilestone(page);
  await expect(page.getByText(c.budget.yes, { exact: true })).toBeVisible();
  await answerGuided(page, 'budgets');
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: c.milestone.budgetTitle, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.milestone.budgetText);
  await page.keyboard.press('Escape');
  expect(
    await page.evaluate(() => Object.keys(localStorage).filter((k) => /sandbox|chapter/.test(k))),
  ).toEqual([]);
});
test('tag workbench separates resource metadata, report inheritance and cost conservation', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'tags');
  await beginMission(page);
  await predict(page, 'same');
  await expect(page.getByText('627,00 ØK', { exact: true }).first()).toBeVisible();
  for (const id of ['fixture-large', 'fixture-disk']) {
    await page
      .getByRole('combobox', { name: `${c.tags.direct} · ${id}`, exact: true })
      .selectOption('Product');
    await page
      .getByRole('combobox', { name: `${c.tags.environment} · ${id}`, exact: true })
      .selectOption('Development');
  }
  await page
    .getByRole('combobox', { name: c.tags.inheritance, exact: true })
    .selectOption('keep-resource');
  await predict(page, 'same');
  let row = page
    .getByRole('row')
    .filter({ has: page.getByRole('rowheader', { name: 'fixture-plan', exact: true }) });
  await expect(row).toContainText('Finance');
  await page
    .getByRole('combobox', { name: c.tags.inheritance, exact: true })
    .selectOption('prefer-parent');
  await predict(page, 'same');
  row = page
    .getByRole('row')
    .filter({ has: page.getByRole('rowheader', { name: 'fixture-plan', exact: true }) });
  await expect(row.getByRole('cell').nth(0)).toHaveText('Finance');
  await expect(row.getByRole('cell').nth(2)).toHaveText('Shared');
  await answerGuided(page, 'tags');
  await page.reload();
  expect(costFacts(await read(page)).completed).toContain('tags');
});
test('wrong first, help, retry, exact repetition and reload do not rewrite the first answer', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  await startCase(page, 'cm02');
  await page.getByRole('radio', { name: costItemsNb.cm02.decisions[0], exact: true }).check();
  await page.getByRole('radio', { name: costItemsNb.cm02.reasons[0], exact: true }).check();
  await page.reload();
  await expect(
    page.getByRole('radio', { name: costItemsNb.cm02.decisions[0], exact: true }),
  ).toBeChecked();
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.getByRole('region', { name: c.currentFeedback, exact: true })).toContainText(
    costItemsNb.cm02.feedback[1][0],
  );
  const first = costFacts(await read(page)).firsts[0];
  await page.getByRole('button', { name: c.assessment.retry, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
  await page.getByRole('link', { name: c.assessment.help, exact: true }).click();
  await expect(page).toHaveURL(/topic=drivers/);
  await expect(page.getByText(c.sections.drivers.paragraphs[0], { exact: true })).toBeVisible();
  expect(costFacts(await read(page)).assisted).toBe(true);
  await page.goBack();
  await page.getByRole('radio', { name: costItemsNb.cm02.decisions[0], exact: true }).check();
  await page.getByRole('radio', { name: costItemsNb.cm02.reasons[1], exact: true }).check();
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.getByRole('region', { name: c.currentFeedback, exact: true })).toContainText(
    c.assessment.assisted,
  );
  expect(costFacts(await read(page)).firsts[0]).toEqual(first);
  await page.getByRole('button', { name: c.assessment.history, exact: true }).click();
  await expect(page.getByRole('region', { name: c.historyFeedback, exact: true })).toContainText(
    costItemsNb.cm02.feedback[1][0],
  );
});
test('all four objectives and optimization have actual unseen cases with matched structured reasons', async ({
  page,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  for (const id of Object.keys(costItems) as (keyof typeof costItems)[]) {
    await startCase(page, id);
    const [d, r] = costItems[id].accepted;
    await page.getByRole('radio', { name: costItemsNb[id].decisions[d], exact: true }).check();
    await page.getByRole('radio', { name: costItemsNb[id].reasons[r], exact: true }).check();
    await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
    await expect(page.getByRole('region', { name: c.currentFeedback, exact: true })).toContainText(
      c.assessment.pass,
    );
  }
  expect(costFacts(await read(page)).firsts).toHaveLength(10);
  await lesson(page, 'summary');
  await page.getByRole('button', { name: 'Knowledge Journal', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.tags.paragraphs[3]);
  await page.keyboard.press('Escape');
  await page.reload();
  expect(costFacts(await read(page)).firsts).toHaveLength(10);
});
test('durable help denial prevents cost teaching from leaking into PR25 transfer', async ({
  page,
}) => {
  const begin = applyTransfer(freshTransfer(), { kind: 'begin', item: 'campaign-pricing' })!;
  const bytes = JSON.stringify(begin);
  await page.addInitScript(
    ({ key, bytes }) => {
      localStorage.setItem(key, bytes);
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key) throw Error('denied aid');
        return original.call(this, k, v);
      };
    },
    { key: transferKey, bytes },
  );
  await page.goto('/learn/cost?topic=optimization');
  await expect(page.getByText(c.sections.optimization.paragraphs[2], { exact: true })).toHaveCount(
    0,
  );
  expect(await page.evaluate((k) => localStorage.getItem(k), transferKey)).toBe(bytes);
});
test('cost active context shields historical PR25 feedback when aid cannot be written', async ({
  page,
}) => {
  let old = applyTransfer(freshTransfer(), { kind: 'begin', item: 'baseline-pricing' })!;
  old = applyTransfer(old, { kind: 'draft', answer: { decision: 0, reason: 1 } })!;
  old = applyTransfer(old, { kind: 'submit' })!;
  const cost = applyCost(freshCost(), { kind: 'begin', item: 'cm09' })!,
    bytes = JSON.stringify(cost);
  await page.addInitScript(
    ({ costKey, bytes, transferKey, old }) => {
      localStorage.setItem(costKey, bytes);
      localStorage.setItem(transferKey, JSON.stringify(old));
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === costKey) throw Error('denied aid');
        return set.call(this, k, v);
      };
    },
    { costKey, bytes, transferKey, old },
  );
  await page.goto('/learn/computing?topic=transfer&case=cc05');
  await expect(page.getByRole('region', { name: 'Aktuell innlevering', exact: true })).toHaveCount(
    0,
  );
  expect(await page.evaluate((k) => localStorage.getItem(k), costKey)).toBe(bytes);
});
test('already-open historical cost feedback closes on real cross-tab conflict and protects newer records', async ({
  page,
  context,
}) => {
  await root(page);
  await lesson(page, 'assessment');
  await startCase(page, 'cm01');
  await page.getByRole('radio', { name: costItemsNb.cm01.decisions[1], exact: true }).check();
  await page.getByRole('radio', { name: costItemsNb.cm01.reasons[2], exact: true }).check();
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.getByRole('region', { name: c.currentFeedback, exact: true })).toBeVisible();
  const peer = await context.newPage();
  await peer.goto('/');
  await peer.evaluate(
    ({ key }) => {
      const s = JSON.parse(localStorage.getItem(key)!);
      s.events.push({ kind: 'begin', item: 'cm03' });
      localStorage.setItem(key, JSON.stringify(s));
    },
    { key: costKey },
  );
  await expect(page.getByRole('region', { name: c.currentFeedback, exact: true })).toHaveCount(0);
  await expect(page.getByText(c.storage.issue, { exact: false }).first()).toBeVisible();
  await peer.close();
  await page.getByRole('button', { name: c.storage.load, exact: true }).first().click();
  expect(costFacts(await read(page)).current!.item).toBe('cm03');
});
test('invalid cost recovery is isolated and newer valid replacement is never removed', async ({
  page,
  context,
}) => {
  await page.addInitScript(
    ({ key }) => {
      localStorage.setItem(key, '{');
      localStorage.setItem(
        'azurelab.learning.cloud-transfer.v1',
        JSON.stringify({
          schema: 1,
          content: '1.0.0',
          model: '1.0.0',
          rubric: '1.0.0',
          events: [],
        }),
      );
    },
    { key: costKey },
  );
  await page.goto('/learn/cost?topic=assessment');
  const old = await page.evaluate(() =>
    localStorage.getItem('azurelab.learning.cloud-transfer.v1'),
  );
  await page.getByRole('button', { name: c.storage.recover, exact: true }).first().click();
  await page.getByRole('button', { name: c.storage.confirm, exact: true }).first().click();
  expect((await read(page)).events).toEqual([{ kind: 'visit', topic: 'assessment' }]);
  expect(costFacts(await read(page)).firsts).toHaveLength(0);
  const peer = await context.newPage();
  await peer.goto('/');
  await peer.evaluate((key) => localStorage.setItem(key, '{'), costKey);
  await page.getByRole('button', { name: c.storage.load, exact: true }).first().click();
  await page.getByRole('button', { name: c.storage.recover, exact: true }).first().click();
  await expect(page.getByRole('button', { name: c.storage.confirm, exact: true })).toBeVisible();
  const newer = applyCost(freshCost(), { kind: 'begin', item: 'cm03' })!;
  const bytes = JSON.stringify(newer);
  await peer.evaluate(({ key, bytes }) => localStorage.setItem(key, bytes), {
    key: costKey,
    bytes,
  });
  await expect(page.getByRole('button', { name: c.storage.confirm, exact: true })).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), costKey)).toBe(bytes);
  await page.getByRole('button', { name: c.storage.load, exact: true }).first().click();
  expect(costFacts(await read(page)).current!.item).toBe('cm03');
  await peer.close();
  expect(
    await page.evaluate(() => localStorage.getItem('azurelab.learning.cloud-transfer.v1')),
  ).toBe(old);
});
test('witnessed guided work at the capacity boundary can finish and reload without new work or evidence upgrades', async ({
  page,
}) => {
  let s = freshCost();
  while (s.events.length < costLimit - 8)
    s = applyCost(s, {
      kind: 'visit',
      topic: s.events.length % 2 ? 'drivers' : 'introduction',
    })!;
  s = applyCost(s, { kind: 'mission', mission: 'estimate' })!;
  for (const hours of [720, 240])
    s = applyCost(s, {
      kind: 'run',
      mission: 'estimate',
      input: { ...initialEstimate, hours },
      baseline: initialEstimate,
      prediction: 'lower',
    })!;
  const prefix = structuredClone(s.events),
    old = JSON.stringify(freshTransfer());
  await page.addInitScript(
    ({ key, s, oldKey, old }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(s));
      if (localStorage.getItem(oldKey) === null) localStorage.setItem(oldKey, old);
    },
    { key: costKey, s, oldKey: transferKey, old },
  );
  await page.goto('/learn/cost?topic=estimate');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: c.controls.run, exact: true })).toBeDisabled();
  await page.getByRole('radio', { name: c.missions.estimate.answers[0], exact: true }).check();
  await page.getByRole('button', { name: c.guided.submit, exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: c.guided.done })).toBeVisible();
  const saved = await read(page);
  expect(saved.events).toHaveLength(costLimit - 4);
  expect(saved.events.slice(0, prefix.length)).toEqual(prefix);
  expect(costFacts(saved).firsts).toEqual([]);
  expect(await page.evaluate((k) => localStorage.getItem(k), transferKey)).toBe(old);
  await page.reload();
  await expect(page.getByRole('button', { name: c.guided.submit, exact: true })).toBeDisabled();
  await expect(page.getByRole('status').filter({ hasText: c.guided.done })).toBeVisible();
  expect(await read(page)).toEqual(saved);
});
test('actual UI-history repair clears stale warnings without replaying an old interruption or altering learning', async ({
  page,
  context,
}) => {
  let s = applyCost(freshCost(), { kind: 'mission', mission: 'estimate' })!;
  s = applyCost(s, {
    kind: 'run',
    mission: 'estimate',
    input: initialEstimate,
    baseline: initialEstimate,
    prediction: 'same',
  })!;
  await page.addInitScript(
    ({ key, s, history }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(s));
      if (localStorage.getItem(history) === null) localStorage.setItem(history, 'broken');
    },
    { key: costKey, s, history: milestonePreferenceKey },
  );
  await page.goto('/learn/cost?topic=estimate');
  await page.getByLabel(c.controls.hours, { exact: true }).fill('240');
  await predict(page, 'lower');
  const warning = page.getByText(nb.milestones.storage, { exact: true });
  await expect(warning).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const saved = await read(page),
    peer = await context.newPage();
  await peer.goto('/');
  const repair = async (raw: string) => {
    await peer.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
      key: milestonePreferenceKey,
      raw,
    });
  };
  await repair(JSON.stringify({ schema: 1, seen: ['cost-time@1.0.0:cost-management'] }));
  await expect(warning).toHaveCount(0);
  expect(await read(page)).toEqual(saved);
  await repair('broken-again');
  await expect(warning).toBeVisible();
  await repair(
    JSON.stringify({ schema: 1, seen: Array.from({ length: 256 }, (_, i) => `full-${i}`) }),
  );
  await expect(warning).toBeVisible();
  await repair(JSON.stringify({ schema: 1, seen: [] }));
  await expect(warning).toHaveCount(0);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await read(page)).toEqual(saved);
  await predict(page, 'lower');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), milestonePreferenceKey),
  ).toEqual({ schema: 1, seen: [] });
  await page.getByRole('button', { name: c.milestone.title, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.milestone.text);
  await closeMilestone(page);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(costFacts(await read(page)).firsts).toEqual([]);
  await peer.close();
});
test('switching a guided mission is explicit, offers exact continuation and explains retained earlier work', async ({
  page,
}) => {
  let s = applyCost(freshCost(), { kind: 'mission', mission: 'estimate' })!;
  s = applyCost(s, {
    kind: 'configure',
    mission: 'estimate',
    input: { ...initialEstimate, hours: 240 },
    baseline: initialEstimate,
  })!;
  await page.addInitScript(({ key, s }) => localStorage.setItem(key, JSON.stringify(s)), {
    key: costKey,
    s,
  });
  await page.goto('/learn/cost?topic=analysis');
  const continueCurrent = page.getByRole('link', { name: c.guided.continue, exact: true });
  await expect(continueCurrent).toHaveAttribute('href', '/learn/cost?topic=estimate');
  await continueCurrent.click();
  await expect(page.getByLabel(c.controls.hours, { exact: true })).toHaveValue('240');
  expect(costFacts(await read(page)).guided).toHaveLength(1);
  await lesson(page, 'analysis');
  await expect
    .poll(async () => (await read(page)).events.at(-1))
    .toEqual({
      kind: 'visit',
      topic: 'analysis',
    });
  const before = await read(page);
  await page.getByRole('button', { name: c.guided.brief, exact: true }).click();
  await expect(page.getByRole('dialog').getByText(c.guided.switch, { exact: true })).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Avbryt', exact: true }).click();
  expect(await read(page)).toEqual(before);
  await beginMission(page);
  expect(costFacts(await read(page)).guide!.mission).toBe('analysis');
  await lesson(page, 'estimate');
  await expect(page.getByText(c.guided.previous, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.guided.brief, exact: true }).click();
  await expect(
    page.getByRole('dialog').getByText(c.guided.previous, { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Start undersøkelsen', exact: true })
    .click();
  await expect(page.getByLabel(c.controls.hours, { exact: true })).toHaveValue('720');
  const saved = await read(page);
  expect(saved.events.slice(0, s.events.length)).toEqual(s.events);
  expect(costFacts(saved).guided).toHaveLength(3);
  expect(costFacts(saved).firsts).toEqual([]);
});
test('capacity explanation disables new begin while reserved help and terminal submit still work', async ({
  page,
}) => {
  let s = applyCost(freshCost(), { kind: 'begin', item: 'cm01' })!;
  while (s.events.length < costLimit - 2)
    s = applyCost(s, { kind: 'draft', answer: { decision: s.events.length % 2, reason: 2 } })!;
  await page.addInitScript(({ key, s }) => localStorage.setItem(key, JSON.stringify(s)), {
    key: costKey,
    s,
  });
  await page.goto('/learn/cost?topic=assessment&case=cm01');
  await page.getByRole('button', { name: 'Knowledge Journal', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.drivers.paragraphs[0]);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  expect((await read(page)).events).toHaveLength(costLimit);
  await expect(page.getByRole('button', { name: c.assessment.retry, exact: true })).toBeDisabled();
  await expect(page.getByText(c.storage.capacity, { exact: true })).toBeVisible();
});
// Each full-page Axe scan gets its own normal test budget; keep every viewport,
// interaction and assertion rather than sharing 30s across six complete scans.
for (const [width, height] of [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
  [1024, 768],
  [1024, 500],
  [390, 844],
] as const) {
  test(`desktop/compact assessment ${width}x${height}, long feedback, keyboard and reduced motion remain readable with no external runtime requests`, async ({
    page,
    baseURL,
  }) => {
    const outside: string[] = [];
    page.on('request', (r) => {
      if (new URL(r.url()).origin !== new URL(baseURL!).origin) outside.push(r.url());
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await root(page);
    await lesson(page, 'assessment');
    await startCase(page, 'cm06');
    await page.getByRole('radio', { name: costItemsNb.cm06.decisions[2], exact: true }).focus();
    await page.keyboard.press('Space');
    await page.getByRole('radio', { name: costItemsNb.cm06.reasons[1], exact: true }).check();
    await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
    await page.setViewportSize({ width, height });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await expect(page.getByRole('region', { name: c.currentFeedback, exact: true })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(outside).toEqual([]);
  });
}
// Preserve both complete scans for each workbench with independently bounded
// setup. Guided switching/history has its own explicit regression above.
for (const topic of ['estimate', 'analysis', 'budgets', 'tags'] as const) {
  test(`${topic} workbench preserves readable semantic controls in short and existing compact layouts`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await root(page);
    await lesson(page, topic);
    await beginMission(page);
    await predict(page, topic === 'analysis' ? 'higher' : topic === 'budgets' ? 'lower' : 'same');
    for (const [width, height] of [
      [1024, 500],
      [390, 844],
    ] as const) {
      await page.setViewportSize({ width, height });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      ).toBe(true);
      const button = page.getByRole('button', { name: c.controls.run, exact: true });
      await button.focus();
      await button.press('Tab');
      await page.keyboard.press('Shift+Tab');
      await expect(button).toBeFocused();
      await expect(button).toBeInViewport();
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
  });
}
