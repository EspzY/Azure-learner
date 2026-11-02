import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  nb,
  visualReviewNb as c,
  computeNb,
  serverlessNb,
  labsNb,
  refinedAssessmentNb,
} from '../../src/content/nb';
import { visualHref, visualPortalHref, directions } from '../../src/features/design-review/model';
import { inspectionFixture } from '../fixtures/portal-inspection';
import { sandboxKey, SandboxStore } from '../../src/domain/sandbox/store';
import { storageKey } from '../../src/domain/progression';
import { computeKey, computeFacts, restoreCompute } from '../../src/domain/curriculum/compute';
import { refinedKeys, refinedHref } from '../../src/domain/curriculum/refined-assessment';

const technical = (page: Page) =>
  page.evaluate(({ world, xp }) => [localStorage.getItem(world), localStorage.getItem(xp)], {
    world: sandboxKey,
    xp: storageKey,
  });
async function fixture(page: Page) {
  const f = inspectionFixture();
  await page.addInitScript(
    ({ k, v }) => {
      if (!localStorage.getItem(k)) localStorage.setItem(k, v);
    },
    { k: sandboxKey, v: f.raw },
  );
  return f;
}
const guide = async (page: Page) =>
  computeFacts(restoreCompute(await page.evaluate((k) => localStorage.getItem(k), computeKey)).save)
    .guide;

test('two isolated visual candidates retain actual catalog theory and honest empty Journal without awarding learning', async ({
  page,
}) => {
  await page.goto('/learn');
  await page.locator('.visual-review-entry a').click();
  await expect(page).toHaveURL(/design-review/);
  const before = await technical(page);
  for (const d of directions) {
    await page.goto(visualHref(d, 'hub'));
    await expect(page.locator('.ve-path')).toHaveCount(3);
    await expect(page.locator('.ve-module-group a')).toHaveCount(17);
    await page.locator('.ve-hero-action a').click();
    await expect(page.locator('h1')).toHaveText(computeNb.title);
    await page.locator('.ve-module-hero a').click();
    await expect(page.locator('.ve-reading')).toContainText(computeNb.sections.vm.paragraphs[0]);
    await expect(page.locator('.ve-truth-note')).toContainText(computeNb.sections.vm.limit);
    await expect(page.locator('.source-disclosure')).not.toHaveAttribute('open');
    await page.goto(visualHref(d, 'journal'));
    await page.getByRole('button', { name: c.journalOpen, exact: true }).click();
    await expect(page.getByRole('dialog')).toContainText(c.journalEmpty);
    const box = await page.getByRole('dialog').boundingBox();
    expect(Math.abs(box!.x + box!.width / 2 - 720)).toBeLessThan(3);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: c.journalOpen, exact: true })).toBeFocused();
  }
  expect(await guide(page)).toBeUndefined();
  expect(await technical(page)).toEqual(before);
});

test('design Studio requires prediction and explicit pure evaluation and invalidates stale presentation without World writes', async ({
  page,
}) => {
  await fixture(page);
  await page.goto(visualHref('editorial', 'studio'));
  const before = await technical(page);
  const run = page.getByRole('button', { name: c.modelRun, exact: true });
  await expect(run).toBeDisabled();
  await expect(page.getByRole('status')).toContainText(c.modelPending);
  await page
    .getByRole('combobox', { name: computeNb.labels.predict, exact: true })
    .selectOption('1');
  await run.click();
  await expect(page.getByRole('status')).toContainText(computeNb.models.container.lost);
  await page
    .getByRole('combobox', { name: computeNb.models.container.storage, exact: true })
    .selectOption('external');
  await expect(page.getByRole('status')).toContainText(c.modelPending);
  await run.click();
  await expect(page.getByRole('status')).toContainText(computeNb.models.container.kept);
  await page
    .getByRole('checkbox', { name: computeNb.models.container.runtime, exact: true })
    .uncheck();
  await run.click();
  await expect(page.getByRole('status')).toContainText(computeNb.models.container.noProcess);
  await page.reload();
  await expect(run).toBeDisabled();
  await expect(page.getByRole('status')).toContainText(c.modelPending);
  expect(await technical(page)).toEqual(before);
  expect(await guide(page)).toBeUndefined();
});

test('native guide actual VM creation dependencies receipt recall and return use one original technical store', async ({
  page,
}) => {
  const f = await fixture(page);
  await page.goto(visualHref('editorial', 'guide'));
  await page.getByRole('button', { name: computeNb.labels.begin, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText(computeNb.missions.vm.title);
  expect(await guide(page)).toBeUndefined();
  await page.keyboard.press('Escape');
  expect(await guide(page)).toBeUndefined();
  await page.getByRole('button', { name: computeNb.labels.begin, exact: true }).click();
  await dialog.getByRole('button', { name: serverlessNb.start, exact: true }).click();
  const started = await guide(page);
  expect(started?.mission).toBe('vm');
  await page
    .locator('.ve-live-mission')
    .getByRole('link', { name: c.workspace, exact: false })
    .click();
  await page.locator('.ve-handoff').getByRole('link', { name: c.workspace, exact: false }).click();
  const p = nb.portal;
  await page
    .getByRole('navigation', { name: p.navLabel, exact: true })
    .getByRole('link', { name: p.areas.vms, exact: true })
    .click();
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page.locator('[data-guide="group"]').selectOption(f.group.id);
  await page.getByLabel(labsNb.vm.name, { exact: true }).fill('vm-design50');
  await page.locator('[data-guide="region"]').selectOption('norwayeast');
  await page.locator('[data-guide="vm-image"]').selectOption('windows-2022');
  await page.locator('[data-guide="vm-profile"]').selectOption('standard');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Disks', exact: true })
    .click();
  await page.getByRole('combobox', { name: labsNb.vm.dataDisk, exact: true }).selectOption('64');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Review + create', exact: true })
    .click();
  await page.locator('[data-guide="commit"]').click();
  await expect(page.locator('.portal-title h1')).toHaveText('vm-design50');
  await expect(page).toHaveURL(/surface=workspace/);
  const data = await page.evaluate((k) => localStorage.getItem(k), sandboxKey);
  const store = new SandboxStore({
    getItem: (k) => (k === sandboxKey ? data : null),
    setItem: () => {
      throw Error('readonly');
    },
    removeItem: () => {
      throw Error('readonly');
    },
  });
  store.load();
  expect(store.getSnapshot().issue).toBeNull();
  expect(store.getSnapshot().attempt.engine.ledger.at(-1)!.receipt.outcome).toBe('accepted');
  const before = await technical(page);
  await page
    .locator('.portal-resource-menu')
    .getByRole('button', { name: nb.portalUi.properties, exact: true })
    .click();
  await expect(page).toHaveURL(/view=properties/);
  await page.reload();
  await expect(page.locator('.portal-resource-main')).toContainText('windows-2022');
  await page.goBack();
  await page
    .locator('.portal-resource-menu')
    .getByRole('button', { name: p.areas.activity, exact: true })
    .click();
  await page.locator('.portal-table-scroll').getByRole('button').first().click();
  await expect(page.locator('.chapter-receipt')).toHaveAttribute('data-outcome', 'accepted');
  await page.locator('.portal-guidance-toggle').click();
  await expect(page.locator('#portal-guidance-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await page
    .locator('.ve-review-bar')
    .getByRole('link', { name: c.backGuide, exact: false })
    .click();
  expect((await guide(page))?.id).toBe(started?.id);
  await page.getByRole('button', { name: computeNb.labels.recall, exact: true }).click();
  await expect(dialog).toContainText(computeNb.missions.vm.situation);
  await page.keyboard.press('Escape');
  expect(await technical(page)).toEqual(before);
});

test('neutral prototype Portal withholds independent guidance and denied durable aid blocks design theory Journal and cross-context access', async ({
  page,
  context,
}) => {
  const f = await fixture(page);
  await page.goto(refinedHref('benefits'));
  await page.getByRole('button', { name: refinedAssessmentNb.ui.start, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: refinedAssessmentNb.ui.confirm, exact: true })
    .click();
  await page.locator('[data-refined-item="b-capacity"]').getByRole('textbox').fill('4');
  const raw = await page.evaluate((k) => localStorage.getItem(k), refinedKeys.benefits),
    before = await technical(page);
  await page.goto(visualPortalHref('/portal?area=resource&compute=vm&id=' + f.vm.id, 'editorial'));
  await expect(page.locator('.portal-title h1')).toHaveText(f.vm.name);
  await page.locator('.portal-guidance-toggle').click();
  await expect(page.locator('#portal-guidance-menu')).toContainText('aktiv selvstendig vurdering');
  expect(await page.evaluate((k) => localStorage.getItem(k), refinedKeys.benefits)).toBe(raw);
  await context.addInitScript((k) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, v) {
      if (key === k && JSON.parse(v).events?.at(-1)?.kind === 'aid')
        throw new DOMException('Denied', 'QuotaExceededError');
      return set.call(this, key, v);
    };
  }, refinedKeys.benefits);
  await page.goto(visualHref('editorial', 'theory'));
  await expect(page.locator('.ve-reading')).toHaveCount(0);
  await expect(page.locator('.course-storage').first()).toBeVisible();
  await page.locator('.ve-journal-trigger').click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate((k) => localStorage.getItem(k), refinedKeys.benefits)).toBe(raw);
  await page.goto('/learn');
  await expect(page.locator('.course-primary')).toHaveAttribute('href', refinedHref('benefits'));
  await page.locator('.course-primary').click();
  await expect(page.locator('[data-refined-item="b-capacity"]').getByRole('textbox')).toHaveValue(
    '4',
  );
  const other = await context.newPage();
  await other.goto(visualHref('continuity', 'guide'));
  await expect(other.locator('.ve-live-mission')).toHaveCount(0);
  expect(await technical(page)).toEqual(before);
});

test('visual desktop compact short-height keyboard native disclosures motion and focus keep primary controls accessible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const d of directions)
    for (const [width, height] of [
      [1920, 1080],
      [1440, 900],
      [1366, 768],
      [1024, 768],
      [1024, 500],
    ] as const) {
      await page.setViewportSize({ width, height });
      await page.goto(visualHref(d, 'studio'));
      await expect(page.locator('[data-ve-heading]')).toBeFocused();
      const run = page.getByRole('button', { name: c.modelRun, exact: true });
      await run.scrollIntoViewIfNeeded();
      await expect(run).toBeInViewport();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
      expect(
        await page.locator('.ve-page').evaluate((e) => getComputedStyle(e).animationName),
      ).toBe('none');
    }
  await page.goto(visualHref('editorial', 'theory'));
  const summary = page.locator('.source-disclosure summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.source-disclosure')).toHaveAttribute('open', '');
  await page.keyboard.press('Space');
  await expect(page.locator('.source-disclosure')).not.toHaveAttribute('open');
  await page.locator('.ve-journal-trigger').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.ve-journal-trigger')).toBeFocused();
});

test('character library stays explicitly rejected while actual Portal panels menu missing-resource and history anchors remain native', async ({
  page,
}) => {
  const f = await fixture(page);
  await page.goto(visualHref('editorial', 'character'));
  await expect(page.locator('.ve-art-grid figure')).toHaveCount(4);
  await expect(page.locator('.ve-truth-note')).toContainText(c.character.blockedTitle);
  const before = await technical(page);
  await page.goto(visualHref('editorial', 'handoff'));
  await page.locator('.ve-resource-preview a').click();
  await expect(page.locator('.portal-title h1')).toHaveText(f.vm.name);
  await page
    .locator('.portal-header')
    .getByRole('button', { name: /^Notifications/ })
    .click();
  await expect(page.locator('.portal-side-panel')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.goto(visualPortalHref('/portal?area=resource&id=absent&compute=vm', 'editorial'));
  await expect(page.locator('.portal-title')).not.toContainText(f.vm.name);
  await page
    .locator('.ve-review-bar')
    .getByRole('link', { name: c.backGuide, exact: false })
    .click();
  await expect(page).toHaveURL(/surface=guide/);
  await page.goBack();
  await expect(page).toHaveURL(/id=absent/);
  expect(await technical(page)).toEqual(before);
});

test('both visual directions preserve native controls Axe semantics and contrast in actual Studio', async ({
  page,
}) => {
  for (const d of directions) {
    await page.goto(visualHref(d, 'studio'));
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});
