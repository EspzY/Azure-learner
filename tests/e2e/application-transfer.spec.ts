import {
  refinedKeys,
  freshRefined,
  applyRefined,
  refinedFacts,
  restoreRefined,
  refinedHref,
} from '../../src/domain/curriculum/refined-assessment';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { applicationNb as c, nb, computeNb, serverlessNb } from '../../src/content/nb';
import {
  applicationIds,
  applicationItems,
  applicationHref,
  applicationKey,
  applicationFacts,
  restoreApplication,
  evaluateApplication,
  type ApplicationItem,
} from '../../src/domain/curriculum/application-transfer';
import {
  networkingKey,
  freshNetworking,
  applyNetworking,
  networkingFacts,
  restoreNetworking,
} from '../../src/domain/curriculum/networking';
import {
  costKey,
  freshCost,
  applyCost,
  costFacts,
  restoreCost,
} from '../../src/domain/curriculum/cost';
import { transferKey, freshTransfer, applyTransfer } from '../../src/domain/curriculum/transfer';
import { computeKey, computeFacts, restoreCompute } from '../../src/domain/curriculum/compute';
import { sandboxKey } from '../../src/domain/sandbox/store';
import { storageKey } from '../../src/domain/progression';
import { inspectionFixture } from '../fixtures/portal-inspection';
const facts = async (page: Page) =>
  applicationFacts(
    restoreApplication(await page.evaluate((k) => localStorage.getItem(k), applicationKey)).save,
  );
async function begin(page: Page, id: ApplicationItem) {
  await page.goto(applicationHref(id));
  await page
    .locator('.application-assessment')
    .getByRole('button', { name: new RegExp(`^(${c.ui.start}|${c.ui.retry})$`) })
    .click();
  await page.getByRole('dialog').getByRole('button', { name: c.ui.start, exact: true }).click();
  await expect(page.locator('.application-assessment form')).toBeVisible();
}
async function choose(page: Page, id: ApplicationItem, decision?: string, reason?: string) {
  const pair = applicationItems[id].accepted[0]!;
  await page.locator(`input[name="application-decision"][value="${decision ?? pair[0]}"]`).check();
  await page.locator(`input[name="application-reason"][value="${reason ?? pair[1]}"]`).check();
}
async function submit(page: Page) {
  await page.getByRole('button', { name: c.ui.submit, exact: true }).click();
  await expect(page.locator('[data-application-result]').first()).toBeVisible();
}
const technical = (page: Page) =>
  page.evaluate(({ world, xp }) => [localStorage.getItem(world), localStorage.getItem(xp)], {
    world: sandboxKey,
    xp: storageKey,
  });

test('all-first actual browser submissions cannot solve the transfer bank and retry never rewrites first evidence', async ({
  page,
}) => {
  for (const id of applicationIds) {
    await begin(page, id);
    await choose(page, id, applicationItems[id].decisions[0], applicationItems[id].reasons[0]);
    await submit(page);
  }
  const f = await facts(page);
  expect(f.firsts).toHaveLength(6);
  expect(f.firsts.filter((a) => evaluateApplication(a).relation).length).toBeLessThan(6);
  const first = JSON.stringify(f.firsts);
  await begin(page, 'at-network-01');
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog').locator('.application-history')).toBeVisible();
  expect((await facts(page)).assisted).toBe(true);
  await page.keyboard.press('Escape');
  await choose(page, 'at-network-01');
  await submit(page);
  expect(JSON.stringify((await facts(page)).firsts)).toBe(first);
  expect((await facts(page)).submitted.at(-1)).toMatchObject({ assisted: true, retry: true });
});
test('changed evidence and contracts accept coherent counterfactual pairs and both qualified adapters', async ({
  page,
}) => {
  for (const id of applicationIds) {
    await begin(page, id);
    await choose(page, id);
    await submit(page);
    expect(evaluateApplication((await facts(page)).submitted.at(-1)!).relation).toBe(true);
  }
  await begin(page, 'at-storage-02');
  await choose(page, 'at-storage-02', 'files-pilot', 'files-adapter');
  await submit(page);
  expect(evaluateApplication((await facts(page)).submitted.at(-1)!).relation).toBe(true);
  await begin(page, 'at-storage-02');
  await choose(page, 'at-storage-02', 'files-pilot', 'object-contract');
  await submit(page);
  expect(evaluateApplication((await facts(page)).submitted.at(-1)!).relation).toBe(false);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog').locator('.application-history')).toContainText('(8)');
  await page.keyboard.press('Escape');
  await page.reload();
  expect((await facts(page)).firsts).toHaveLength(6);
});
test('original nw12 and pricing histories retain original rubrics while related cross-module exposure is explicit', async ({
  page,
}) => {
  let n = applyNetworking(freshNetworking(), { kind: 'begin', item: 'nw12' })!;
  n = applyNetworking(n, { kind: 'draft', answer: { decision: 0, reason: 1 } })!;
  n = applyNetworking(n, { kind: 'submit' })!;
  let cost = applyCost(freshCost(), { kind: 'begin', item: 'cm10' })!;
  cost = applyCost(cost, { kind: 'draft', answer: { decision: 1, reason: 2 } })!;
  cost = applyCost(cost, { kind: 'submit' })!;
  let t = applyTransfer(freshTransfer(), { kind: 'begin', item: 'campaign-pricing' })!;
  t = applyTransfer(t, { kind: 'draft', answer: { decision: 1, reason: 2 } })!;
  t = applyTransfer(t, { kind: 'submit' })!;
  const originals = {
    [networkingKey]: JSON.stringify(n),
    [costKey]: JSON.stringify(cost),
    [transferKey]: JSON.stringify(t),
  };
  await page.addInitScript((data) => {
    for (const [k, v] of Object.entries(data))
      if (!localStorage.getItem(k)) localStorage.setItem(k, v);
  }, originals);
  await begin(page, 'at-cost-01');
  await expect(page.locator('.application-exposure')).toContainText(c.ui.banks['cloud-transfer']);
  await expect(page.locator('.application-exposure')).toContainText(c.ui.banks.cost);
  await choose(page, 'at-cost-01');
  await submit(page);
  await page.goto('/learn/cost?topic=assessment&case=cm10');
  expect(
    costFacts(restoreCost(await page.evaluate((k) => localStorage.getItem(k), costKey)).save)
      .attempts[0],
  ).toEqual(costFacts(cost).attempts[0]);
  await page.goto('/learn/networking?topic=assessment&case=nw12');
  expect(
    networkingFacts(
      restoreNetworking(await page.evaluate((k) => localStorage.getItem(k), networkingKey)).save,
    ).firsts[0],
  ).toEqual(networkingFacts(n).firsts[0]);
  await begin(page, 'at-network-01');
  await expect(page.locator('.application-exposure')).toContainText(c.ui.banks.networking);
  expect(await page.evaluate((k) => localStorage.getItem(k), transferKey)).toBe(
    originals[transferKey],
  );
});
test('Start Escape exact draft Hub resume and denied durable help preserve independent shielding', async ({
  page,
}) => {
  await page.goto(applicationHref('at-network-01'));
  const snapshot = await technical(page);
  const start = page.getByRole('button', { name: c.ui.start, exact: true });
  await start.click();
  await page.keyboard.press('Escape');
  await expect(start).toBeFocused();
  expect((await facts(page)).attempts).toHaveLength(0);
  await begin(page, 'at-network-01');
  await page.locator('input[name="application-decision"][value="dns-object"]').check();
  const raw = await page.evaluate((k) => localStorage.getItem(k), applicationKey);
  await page.goto('/learn');
  await expect(page.locator('.course-primary')).toHaveAttribute(
    'href',
    applicationHref('at-network-01'),
  );
  await page.locator('.course-primary').click();
  await expect(page).toHaveURL(applicationHref('at-network-01'));
  await page.reload();
  await expect(page.locator('input[value="dns-object"]')).toBeChecked();
  const deny = (key: string) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key && JSON.parse(v).events?.at(-1)?.kind === 'aid')
        throw new DOMException('Denied', 'QuotaExceededError');
      return set.call(this, k, v);
    };
  };
  await page.addInitScript(deny, applicationKey);
  await page.evaluate(deny, applicationKey);
  await page.getByRole('link', { name: c.ui.help, exact: true }).click();
  await expect(page.locator('.course-storage').first()).toBeVisible();
  await expect(page.locator('.application-entry')).toHaveCount(0);
  await expect(page.locator('.networking-lesson')).toHaveCount(0);
  await expect(page.locator('.compute-sources')).toHaveCount(0);
  expect(await page.evaluate((k) => localStorage.getItem(k), applicationKey)).toBe(raw);
  await page.goto('/learn/networking?topic=dns&application=at-network-01');
  await expect(page.locator('.application-assessment')).toHaveCount(0);
  await expect(page.locator('.course-storage').first()).toBeVisible();
  await expect(page.locator('.networking-lesson')).toHaveCount(0);
  await page.goto('/portal?area=home');
  await page.locator('.portal-guidance-toggle').click();
  await expect(page.locator('#portal-guidance-menu')).toContainText('aktiv selvstendig vurdering');
  await page.goto('/learn');
  await page.locator('.course-primary').click();
  await expect(page).toHaveURL(applicationHref('at-network-01'));
  await expect(page.locator('input[value="dns-object"]')).toBeChecked();
  expect((await facts(page)).assisted).toBe(false);
  expect(await technical(page)).toEqual(snapshot);
});
test('stale tabs rejected writes and scoped recovery cannot create two first results or erase a newer attempt', async ({
  page,
  context,
}) => {
  await begin(page, 'at-storage-01');
  await choose(page, 'at-storage-01');
  const other = await context.newPage();
  await other.goto(applicationHref('at-storage-01'));
  await expect(other.locator('input[value="concurrent-io"]')).toBeChecked();
  await other.locator('input[name="application-reason"][value="single-writer"]').check();
  await expect(page.locator('.course-storage').first()).toBeVisible();
  await expect(page.getByRole('button', { name: c.ui.submit, exact: true })).toBeDisabled();
  await other.getByRole('button', { name: c.ui.submit, exact: true }).click();
  expect((await facts(other)).firsts).toHaveLength(1);
  await page.reload();
  expect((await facts(page)).firsts).toHaveLength(1);
  const before = JSON.stringify((await facts(page)).firsts);
  await begin(page, 'at-storage-01');
  await page.evaluate((key) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw Error('denied');
      return set.call(this, k, v);
    };
  }, applicationKey);
  await page.locator('input[value="concurrent-io"]').click();
  await expect(page.locator('.application-assessment').getByRole('alert')).toContainText(
    c.ui.failed,
  );
  expect(JSON.stringify((await facts(page)).firsts)).toBe(before);
  await other.close();
});
test('native keyboard short-window composition reduced motion and Axe keep transfer controls accessible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(applicationHref('at-storage-02'));
  const initial = page.viewportSize();
  expect(initial).not.toBeNull();
  await page.getByRole('button', { name: c.ui.start, exact: true }).click();
  const dialog = page.getByRole('dialog');
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.abs(box!.x + box!.width / 2 - initial!.width / 2)).toBeLessThan(3);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: c.ui.start, exact: true })).toBeFocused();
  await begin(page, 'at-storage-02');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
  ] as const) {
    await page.setViewportSize({ width, height });
    await expect(page.getByRole('button', { name: c.ui.submit, exact: true })).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await page.getByRole('button', { name: c.ui.abandon, exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: c.ui.abandon, exact: true })).toBeInViewport();
  }
  await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test('four natural entries invalid links original Portal inspection and guidance preserve technical and guided evidence', async ({
  page,
}) => {
  const f = inspectionFixture();
  await page.addInitScript(
    ({ key, raw }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, raw);
    },
    { key: sandboxKey, raw: f.raw },
  );
  for (const [group, path] of [
    ['networking', '/learn/networking?topic=assessment'],
    ['storage', '/learn/storage?topic=assessment'],
    ['cost', '/learn/cost?topic=assessment'],
    ['cost', '/learn/computing?topic=transfer'],
  ] as const) {
    await page.goto(path);
    await expect(page.locator('.application-entry')).toHaveCount(1);
    await expect(page.locator('.application-entry')).toContainText(c.ui.preps[group]);
    await expect(page.locator('.application-entry a')).toHaveCount(2);
  }
  await page.goto('/learn/storage?topic=assessment&application=at-network-01');
  await expect(page.getByText(c.ui.invalid, { exact: true })).toBeVisible();
  expect((await facts(page)).attempts).toHaveLength(0);
  await page.goto('/learn/compute?topic=dependencies');
  await page.getByRole('button', { name: computeNb.labels.begin, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
  const guide = JSON.stringify(
      computeFacts(
        restoreCompute(await page.evaluate((k) => localStorage.getItem(k), computeKey)).save,
      ).guide,
    ),
    world = await technical(page);
  await begin(page, 'at-network-01');
  await page.goto('/portal?area=resource&compute=vm&id=' + f.vm.id);
  await expect(page.locator('.portal-title h1')).toHaveText(f.vm.name);
  await page
    .locator('.portal-resource-menu')
    .getByRole('button', { name: nb.portal.areas.activity, exact: true })
    .click();
  await expect(page.locator('.portal-table-scroll tbody tr')).toHaveCount(1);
  await page.locator('.portal-guidance-toggle').click();
  await expect(page.locator('#portal-guidance-menu')).toContainText('aktiv selvstendig vurdering');
  await expect(page.locator('.compute-portal-guide')).toContainText(computeNb.storage.unsafe);
  await expect(page.locator('.compute-portal-guide').getByRole('combobox')).toHaveCount(0);
  await expect(page.locator('.compute-portal-guide .compute-causal')).toHaveCount(0);
  expect(await technical(page)).toEqual(world);
  expect(
    JSON.stringify(
      computeFacts(
        restoreCompute(await page.evaluate((k) => localStorage.getItem(k), computeKey)).save,
      ).guide,
    ),
  ).toBe(guide);
});

test('corrupt transfer recovery and competing historical contexts remain explicit without fabricated fresh progress', async ({
  page,
}) => {
  const historical = applyRefined(freshRefined('benefits'), { kind: 'begin' })!;
  await page.goto('/learn');
  await page.evaluate((k) => localStorage.setItem(k, 'invalid'), applicationKey);
  await page.reload();
  await page.goto(applicationHref('at-cost-01'));
  await expect(page.getByRole('heading', { name: c.ui.recovery, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: c.ui.start, exact: true })).toBeDisabled();
  await expect(page.locator('.application-exposure')).toHaveCount(0);
  await page.getByRole('button', { name: c.ui.reset, exact: true }).click();
  await page.getByRole('button', { name: c.ui.confirm, exact: true }).click();
  expect((await facts(page)).attempts).toHaveLength(0);
  await begin(page, 'at-cost-01');
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: refinedKeys.benefits,
    raw: JSON.stringify(historical),
  });
  await page.goto('/learn');
  await page.reload();
  await expect(page.locator('.course-primary')).toHaveAttribute('href', '/learn');
  await expect(
    page.locator('.course-storage').getByRole('link', { name: c.ui.title, exact: true }),
  ).toHaveAttribute('href', applicationHref('at-cost-01'));
  await expect(
    page
      .locator('.course-storage')
      .getByRole('link', { name: 'Oppdatert Benefits-vurdering', exact: true }),
  ).toHaveAttribute('href', refinedHref('benefits'));
  expect((await facts(page)).firsts).toHaveLength(0);
  const old = restoreRefined(
    'benefits',
    await page.evaluate((k) => localStorage.getItem(k), refinedKeys.benefits),
  ).save;
  expect(refinedFacts(old).first).toBeNull();
  expect(refinedFacts(old).active).toBe(true);
});
