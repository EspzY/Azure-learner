import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { refinedAssessmentNb as c, nb } from '../../src/content/nb';
import {
  refinedItems,
  refinedLimit,
  refinedKeys,
  refinedHref,
  refinedFacts,
  restoreRefined,
  freshRefined,
  applyRefined,
} from '../../src/domain/curriculum/refined-assessment';
import {
  expansionKeys,
  fresh,
  apply,
  facts,
  restore,
  type Track,
} from '../../src/domain/curriculum/expansion';
const t = c.ui;
const saved = async (p: Page, track: Track) =>
  restoreRefined(track, await p.evaluate((k) => localStorage.getItem(k), refinedKeys[track])).save;
async function begin(p: Page, track: Track) {
  await p.goto(refinedHref(track));
  await p.getByRole('button', { name: t.start, exact: true }).click();
  await p.getByRole('dialog').getByRole('button', { name: t.confirm, exact: true }).click();
  await expect(p.locator('[data-refined-item]')).toHaveCount(6);
  await expect(p.locator('[data-refined-item]').first()).toBeFocused();
}
async function fill(p: Page, track: Track, first = false) {
  for (const i of refinedItems(track)) {
    const box = p.locator(`[data-refined-item="${i.id}"]`);
    const pair = c.feedback[i.id].pairs[0]!;
    await box
      .getByRole('combobox')
      .nth(0)
      .selectOption(first ? i.decisions[0]!.id : pair[0]);
    await box
      .getByRole('combobox')
      .nth(1)
      .selectOption(first ? i.reasons[0]!.id : pair[1]);
    if (i.id === 'b-capacity') await box.getByRole('textbox').fill(first ? '5' : '005');
  }
}
async function clean(p: Page) {
  await p.goto('/learn');
  await p.evaluate(() => localStorage.clear());
  await p.reload();
}
for (const track of ['benefits', 'services'] as const)
  test(`${track} updated all-first browser submission fails and assisted retry preserves immutable first`, async ({
    page,
  }) => {
    await begin(page, track);
    await fill(page, track, true);
    await page.getByRole('button', { name: t.submit, exact: true }).click();
    let f = refinedFacts(await saved(page, track));
    expect(f.first!.result!.every((r) => r.correct)).toBe(false);
    expect(f.first!.assisted).toBe(false);
    const first = JSON.stringify(f.first);
    await page.getByRole('button', { name: t.newAttempt, exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: t.confirm, exact: true }).click();
    await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
    await expect(
      page.getByRole('dialog').getByRole('heading', { name: t.history, exact: false }),
    ).toBeVisible();
    expect(refinedFacts(await saved(page, track)).assisted).toBe(true);
    await page.keyboard.press('Escape');
    await fill(page, track);
    await page.getByRole('button', { name: t.submit, exact: true }).click();
    f = refinedFacts(await saved(page, track));
    expect(JSON.stringify(f.first)).toBe(first);
    expect(f.submissions[1]!.result!.every((r) => r.correct)).toBe(true);
    expect(f.submissions[1]).toMatchObject({ assisted: true, retry: true });
    await page.reload();
    expect(JSON.stringify(refinedFacts(await saved(page, track)).first)).toBe(first);
  });
test('updated assessment Start Cancel Escape and exact draft Hub resume preserve technical records', async ({
  page,
}) => {
  await page.goto(refinedHref('benefits'));
  const snapshot = await page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(([k]) => /sandbox|progress|mission|benefits\.v1/.test(k)),
    ),
  );
  const start = page.getByRole('button', { name: t.start, exact: true });
  await start.click();
  await page.keyboard.press('Escape');
  await expect(start).toBeFocused();
  expect(refinedFacts(await saved(page, 'benefits')).attempts).toHaveLength(0);
  await start.click();
  await page.getByRole('dialog').getByRole('button', { name: t.cancel, exact: true }).click();
  expect(refinedFacts(await saved(page, 'benefits')).attempts).toHaveLength(0);
  await start.click();
  await page.getByRole('dialog').getByRole('button', { name: t.confirm, exact: true }).click();
  const field = page.locator('[data-refined-item="b-capacity"]');
  await field.getByRole('textbox').fill('4');
  await field.getByRole('combobox').first().selectOption('add');
  await page.goto('/learn');
  await expect(page.locator('.course-primary')).toHaveAttribute('href', refinedHref('benefits'));
  await page.locator('.course-primary').click();
  await expect(page).toHaveURL(refinedHref('benefits'));
  await page.reload();
  await expect(field.getByRole('textbox')).toHaveValue('4');
  await expect(field.getByRole('combobox').first()).toHaveValue('add');
  expect(refinedFacts(await saved(page, 'benefits')).assisted).toBe(false);
  expect(
    await page.evaluate(() =>
      Object.fromEntries(
        Object.entries(localStorage).filter(([k]) =>
          /sandbox|progress|mission|benefits\.v1/.test(k),
        ),
      ),
    ),
  ).toEqual(snapshot);
});
test('historical Benefits and Services active attempts retain original rubric and explicit routes', async ({
  page,
}) => {
  for (const track of ['benefits', 'services'] as const) {
    await clean(page);
    const old = apply(fresh(track), { kind: 'begin' })!;
    await page.evaluate(({ k, v }) => localStorage.setItem(k, v), {
      k: expansionKeys[track],
      v: JSON.stringify(old),
    });
    await page.goto('/learn');
    await expect(page.locator('.course-primary')).toHaveAttribute('href', refinedHref(track, true));
    await page.locator('.course-primary').click();
    const answers =
      track === 'benefits'
        ? ['1', 'restore', 'one-rule', 'review', 'data', 'usage']
        : ['iaas', 'customer', 'adapt', 'access', 'paas', 'platform-supported', 'plan'];
    for (const [n, q] of nb.expansion[track].assessment.items.entries()) {
      const control = page.getByLabel(q.question, { exact: true });
      if (q.id === 'unmet') await control.fill(answers[n]!);
      else await control.selectOption(answers[n]!);
    }
    await page.getByRole('button', { name: nb.expansion.common.submit, exact: true }).click();
    const raw = await page.evaluate((k) => localStorage.getItem(k), expansionKeys[track]);
    expect(
      Object.values(facts(restore(track, raw).save).submissions[0]!.criteria).every(Boolean),
    ).toBe(true);
    await page.goto(refinedHref(track));
    await expect(page.getByRole('button', { name: t.start, exact: true })).toBeEnabled();
    expect(await page.evaluate((k) => localStorage.getItem(k), expansionKeys[track])).toBe(raw);
  }
  await page.goto('/learn/services?topic=overview&version=1');
  await expect(page).toHaveURL(/version=1/);
});
test('updated Services accepts both matching architectures and rejects incompatible cross pairs', async ({
  page,
}) => {
  await begin(page, 'services');
  await fill(page, 'services');
  const box = page.locator('[data-refined-item="s-choice"]');
  await box.getByRole('combobox').nth(0).selectOption('paas');
  await box.getByRole('combobox').nth(1).selectOption('os');
  await page.getByRole('button', { name: t.submit, exact: true }).click();
  expect(
    refinedFacts(await saved(page, 'services')).first!.result!.find((r) => r.id === 's-choice')!
      .correct,
  ).toBe(false);
  for (const pair of [
    ['iaas', 'os'],
    ['paas', 'platform'],
  ]) {
    await page.getByRole('button', { name: t.newAttempt, exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: t.confirm, exact: true }).click();
    await fill(page, 'services');
    await box.getByRole('combobox').nth(0).selectOption(pair[0]!);
    await box.getByRole('combobox').nth(1).selectOption(pair[1]!);
    await page.getByRole('button', { name: t.submit, exact: true }).click();
    expect(
      refinedFacts(await saved(page, 'services'))
        .submissions.at(-1)!
        .result!.every((r) => r.correct),
    ).toBe(true);
  }
});
test('updated denied durable assistance withholds Journal feedback and stale tab cannot submit', async ({
  page,
  context,
}) => {
  await begin(page, 'benefits');
  await fill(page, 'benefits');
  const stale = await context.newPage();
  await stale.goto(refinedHref('benefits'));
  await expect(stale.locator('[data-refined-item]')).toHaveCount(6);
  await page.locator('[data-refined-item="b-capacity"]').getByRole('textbox').fill('4');
  await expect(stale.getByText(t.recovery, { exact: false }).first()).toBeVisible();
  await stale.getByRole('button', { name: t.submit, exact: true }).click({ force: true });
  expect(refinedFacts(await saved(page, 'benefits')).submissions).toHaveLength(0);
  await stale.close();
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw new DOMException('Denied', 'QuotaExceededError');
      return original.call(this, k, v);
    };
  }, refinedKeys.benefits);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: t.history, exact: false }),
  ).toHaveCount(0);
  expect(refinedFacts(await saved(page, 'benefits')).assisted).toBe(false);
  await expect(page.getByRole('dialog')).toContainText('Oppdatert Benefits-vurdering');
});
test('new and old concurrent assessment contexts are explicit and corrupt recovery is scoped', async ({
  page,
}) => {
  await page.goto('/learn');
  const old = apply(fresh('benefits'), { kind: 'begin' })!,
    updated = applyRefined(freshRefined('benefits'), { kind: 'begin' })!;
  await page.evaluate(
    ({ a, b, k, l }) => {
      localStorage.setItem(k, a);
      localStorage.setItem(l, b);
    },
    {
      a: JSON.stringify(old),
      b: JSON.stringify(updated),
      k: expansionKeys.benefits,
      l: refinedKeys.benefits,
    },
  );
  await page.reload();
  await expect(page.getByText(t.conflict, { exact: true })).toBeVisible();
  await expect(page.locator('.course-primary')).toHaveAttribute('href', '/learn');
  await page.evaluate((k) => localStorage.setItem(k, 'broken'), refinedKeys.services);
  await page.goto(refinedHref('services'));
  await expect(page.locator('[data-refined-item]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: t.start, exact: true })).toBeDisabled();
  const legacyBeforeRecovery = await page.evaluate(
    (k) => localStorage.getItem(k),
    expansionKeys.benefits,
  );
  await page.getByRole('button', { name: t.clear, exact: true }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), refinedKeys.services)).toBeNull();
  expect(await page.evaluate((k) => localStorage.getItem(k), expansionKeys.benefits)).toBe(
    legacyBeforeRecovery,
  );
  let bounded = applyRefined(freshRefined('services'), { kind: 'begin' })!;
  while (bounded.events.length < refinedLimit - 3)
    bounded = applyRefined(bounded, {
      kind: 'answer',
      item: 's-driver',
      field: 'decision',
      value: 'iaas',
    })!;
  await page.evaluate(({ k, v }) => localStorage.setItem(k, v), {
    k: refinedKeys.services,
    v: JSON.stringify(bounded),
  });
  await page.reload();
  await expect(page.getByText(t.bounded, { exact: true })).toBeVisible();
  await expect(
    page.locator('[data-refined-item]').first().getByRole('combobox').first(),
  ).toBeDisabled();
  await page.getByRole('button', { name: t.abandon, exact: true }).click();
  expect(refinedFacts(await saved(page, 'services')).current!.status).toBe('abandoned');
  expect(refinedFacts(await saved(page, 'services')).first).toBeNull();
});
test('updated assessment desktop compact short-height keyboard centered start reduced motion and Axe remain usable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const size of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(size);
    await page.goto(refinedHref('services'));
    await page.getByRole('button', { name: t.start, exact: true }).click();
    const box = await page.getByRole('dialog').boundingBox();
    expect(Math.abs(box!.x + box!.width / 2 - size.width / 2)).toBeLessThan(2);
    await page.keyboard.press('Escape');
  }
  await begin(page, 'services');
  await fill(page, 'services');
  await page.getByRole('button', { name: t.submit, exact: true }).focus();
  await expect(page.getByRole('button', { name: t.submit, exact: true })).toBeInViewport();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('assessment-short.png') });
  await page.getByRole('button', { name: t.submit, exact: true }).click();
  expect(refinedFacts(await saved(page, 'services')).first).toMatchObject({
    assisted: false,
    retry: false,
  });
  expect(refinedFacts(await saved(page, 'services')).first!.result!.every((r) => r.correct)).toBe(
    true,
  );
});
