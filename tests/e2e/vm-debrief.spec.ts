import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  start,
  create,
  vm,
  selectCurrent,
  inspectAll,
  returnCourse,
  reflect,
  state,
} from './vm-debrief-actions';
import { missionsNb as c, vmDebriefNb as d, nb, learningPolishNb } from '../../src/content/nb';
import { missionKey, missionFacts, missionOrigin } from '../../src/domain/sandbox/missions';
import { sandboxKey } from '../../src/domain/sandbox/store';
import { diagnosticFixture } from '../cc02-fixture';
import {
  challenge2Key,
  freshChallenge2,
  applyChallenge2,
} from '../../src/domain/portal/challenge-v2';

test.setTimeout(240000);
test.use({ actionTimeout: 15000 });

async function seed(page: Page, options: Parameters<typeof diagnosticFixture>[0] = {}) {
  const fixture = diagnosticFixture(options);
  await page.addInitScript(
    ({ fixture, missionKey, sandboxKey }) => {
      if (localStorage.getItem(missionKey) === null)
        localStorage.setItem(missionKey, fixture.missions);
      if (localStorage.getItem(sandboxKey) === null)
        localStorage.setItem(sandboxKey, fixture.sandbox);
    },
    { fixture, missionKey, sandboxKey },
  );
  return fixture;
}
async function records(page: Page) {
  return page.evaluate(() =>
    Object.fromEntries(
      Object.keys(localStorage)
        .filter((k) => k.includes('sandbox') || k.includes('chapter') || k.includes('xp'))
        .map((k) => [k, localStorage.getItem(k)]),
    ),
  );
}
async function openEvidence(page: Page) {
  await page.locator('.vm-debrief-evidence > summary').click();
}

test('VM debrief distinguishes accepted Small creation from the Standard mission requirement and preserves first through correct explicit retry', async ({
  page,
}, info) => {
  await start(page, 'infrastructure');
  await create(page, 'group', 'rg-debrief', 'sub-shared', 'norwayeast');
  await vm(page, false, 'small');
  await selectCurrent(page);
  await inspectAll(page);
  await returnCourse(page, 'infrastructure');
  await reflect(page, 'infrastructure');
  const debrief = page.locator('.mission-debrief');
  await expect(debrief).toContainText(d.incomplete);
  await expect(debrief).toContainText(d.technical);
  await expect(debrief.locator('[data-diagnostic-field="profile"]')).toContainText('Standard');
  await expect(debrief.locator('[data-diagnostic-field="profile"]')).toContainText('Small');
  await expect(debrief.locator('[data-diagnostic-field="profile"]')).toContainText(d.differs);
  await expect(debrief.locator('.vm-debrief-differences')).toHaveText(
    /VM-profil: Small → Standard/,
  );
  await expect(debrief).not.toContainText(c.next);
  await debrief.locator('h3').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await page.screenshot({ path: info.outputPath('small-diagnostic-1440.png') });
  const first = await state(page),
    technical = await records(page);
  await openEvidence(page);
  await debrief.getByRole('link', { name: d.openReceipt, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText(nb.portal.areas.activity);
  await expect(page.locator('.chapter-receipt')).toContainText('Opprett VM og avhengigheter');
  await expect(page.locator('.mission-portal-notice')).toContainText(d.portalSubmitted);
  await expect(page.locator('.mission-portal-notice')).not.toContainText(c.unverified);
  await page.locator('.mission-portal-notice').scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('original-receipt-1440.png') });
  await page.goBack();
  await expect(debrief).toContainText('VM-profil: Small → Standard');
  expect(await records(page)).toEqual(technical);
  expect(await state(page)).toEqual(first);
  await debrief.getByRole('button', { name: d.retry, exact: true }).click();
  expect(await state(page)).toEqual(first);
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: learningPolishNb.briefing.start, exact: true }).click();
  await expect(page.locator('.mission-coach')).toBeVisible();
  await vm(page, false, undefined, 'vm-correct');
  await selectCurrent(page);
  await inspectAll(page);
  await returnCourse(page, 'infrastructure');
  await reflect(page, 'infrastructure');
  await expect(debrief).toContainText(c.complete);
  await expect(debrief.locator('.vm-debrief-differences')).toHaveCount(0);
  await expect(debrief.getByRole('link', { name: d.continue, exact: true })).toHaveAttribute(
    'href',
    '/learn/services?topic=assessment&version=2',
  );
  const latest = await state(page);
  expect(latest.events.slice(0, first.events.length)).toEqual(first.events);
  expect(missionFacts(latest).sessions).toHaveLength(2);
  await debrief.locator('h3').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await page.screenshot({ path: info.outputPath('correct-diagnostic-1440.png') });
  await page.reload();
  await expect(debrief).toContainText(c.complete);
  await page.locator('.mission-entry').getByText(c.history, { exact: true }).click();
  await page.getByRole('button', { name: `${d.view} #1`, exact: true }).click();
  await expect(debrief).toContainText('VM-profil: Small → Standard');
  await expect(page.locator('.vm-debrief-focus')).toBeFocused();
  const beforeHistoricalEvidence = await records(page);
  await openEvidence(page);
  await debrief.getByRole('link', { name: d.openReceipt, exact: true }).click();
  await expect(page.locator('.chapter-receipt')).toContainText(
    missionFacts(first).current!.through!,
  );
  await expect(page.locator('.mission-portal-notice')).toContainText(d.portalSubmitted);
  await expect(page.locator('.mission-portal-notice')).not.toContainText(c.unverified);
  await page
    .locator('.mission-portal-notice')
    .getByRole('link', { name: c.return, exact: true })
    .click();
  await expect(page).toHaveURL(missionOrigin('infrastructure'));
  await expect(debrief).toContainText(c.complete);
  expect(await records(page)).toEqual(beforeHistoricalEvidence);
  expect(await state(page)).toEqual(latest);
});

test('historical VM diagnostic uses through before deletion and archived attempt instead of current World', async ({
  page,
}) => {
  const fixture = await seed(page, { profile: 'small', deleted: true, archive: 'valid' });
  await page.goto(missionOrigin('infrastructure'));
  const debrief = page.locator('.mission-debrief');
  await expect(debrief).toContainText('VM-profil: Small → Standard');
  await expect(debrief).toContainText(d.technical);
  const before = await records(page);
  await openEvidence(page);
  await expect(debrief).toContainText(d.archived);
  await expect(debrief).toContainText(fixture.receipt);
  await expect(debrief.getByRole('link', { name: d.openReceipt, exact: true })).toHaveCount(0);
  await expect(debrief.getByRole('link', { name: d.resource, exact: true })).toHaveCount(0);
  await page.reload();
  await expect(debrief).toContainText('VM-profil: Small → Standard');
  expect(await records(page)).toEqual(before);
  await page.goto(`/portal?area=activity&id=${fixture.receipt}&mission=infrastructure`);
  await expect(page.locator('.mission-portal-notice')).toContainText(c.unverified);
  await expect(page.locator('.mission-portal-notice')).not.toContainText(d.portalSubmitted);
  expect(await records(page)).toEqual(before);
});

test('missing or corrupt VM technical archive never borrows current inventory or claims success', async ({
  page,
  context,
}) => {
  await seed(page, { profile: 'small', archive: 'missing' });
  await page.goto(missionOrigin('infrastructure'));
  await expect(page.locator('.mission-debrief')).toContainText(d.unverified);
  await expect(page.locator('.vm-debrief-comparison')).toHaveCount(0);
  await expect(page.getByRole('button', { name: d.retry, exact: true })).toHaveCount(0);
  const other = await context.newPage();
  await seed(other, { archive: 'corrupt' });
  // Same context storage would be shared: install a separately corrupted existing technical record explicitly.
  const corrupt = diagnosticFixture({ archive: 'corrupt' });
  await other.goto('/portal');
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: sandboxKey,
    raw: corrupt.sandbox,
  });
  await page.reload();
  await expect(page.locator('.mission-safety-recovery')).toContainText(
    c.recoveryContexts.technical,
  );
  await expect(page.locator('.vm-debrief-comparison')).toHaveCount(0);
  await expect(page.locator('.vm-debrief-diagnostics')).toHaveCount(0);
  await other.close();
});

test('independent VM comparison stays absent before submit and uses its own requirements after submission', async ({
  page,
}) => {
  await seed(page, { mode: 'independent', active: true });
  await page.goto(missionOrigin('infrastructure'));
  await expect(page.locator('.mission-activity')).toBeVisible();
  await expect(page.locator('.vm-debrief-comparison')).toHaveCount(0);
  await expect(page.getByRole('button', { name: `${d.view} #1`, exact: true })).toHaveCount(0);
  await page
    .locator('.mission-activity')
    .getByRole('button', { name: c.submit, exact: true })
    .click();
  await expect(page.locator('.mission-debrief')).toContainText(c.complete);
  await expect(page.locator('[data-diagnostic-field="image"]')).toContainText(
    'Windows Server 2022',
  );
  await expect(page.locator('[data-diagnostic-field="profile"]')).toHaveText(
    /Small.*Small.*Oppfylt/,
  );
  await expect(page.locator('[data-diagnostic-field="subscriptionId"]')).toHaveText(
    /App Sandbox.*App Sandbox/,
  );
  expect(missionFacts(await state(page)).current?.aided).toBe(false);
});

test('VM history and diagnostics remain closed on another independent context denied aid and cross-tab conflict', async ({
  page,
  context,
}) => {
  const fixture = await seed(page, { profile: 'small' });
  // New Portal-v2 context is a genuine independent begin replay, not a UI-only flag.
  const challenge = applyChallenge2(freshChallenge2(), {
    kind: 'begin',
    attemptNumber: 1,
    boundary: null,
    origin: null,
    prior: 'none-recorded',
  })!;
  expect(challenge).toBeTruthy();
  await page.addInitScript(
    ({ key, raw }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, raw);
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key) throw new DOMException('denied', 'QuotaExceededError');
        set.call(this, k, v);
      };
    },
    { key: challenge2Key, raw: JSON.stringify(challenge) },
  );
  await page.goto(missionOrigin('infrastructure'));
  await expect(page.locator('.course-storage')).toContainText('Oppdatert');
  await expect(page.locator('.vm-debrief-comparison')).toHaveCount(0);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).not.toContainText(d.technical);
  await page.keyboard.press('Escape');
  expect(await page.evaluate((k) => localStorage.getItem(k), missionKey)).toBe(fixture.missions);
  await page.goto(`/portal?area=activity&id=${fixture.receipt}&mission=infrastructure`);
  await expect(page.locator('.mission-portal-notice')).toContainText(c.unverified);
  await expect(page.locator('.mission-portal-notice')).not.toContainText(d.portalSubmitted);
  await page.goto(missionOrigin('infrastructure'));
  const other = await context.newPage();
  await other.goto('/portal');
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: challenge2Key,
    raw: JSON.stringify(freshChallenge2()),
  });
  await page.reload();
  await expect(page.locator('.vm-debrief-comparison')).toBeVisible();
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: challenge2Key,
    raw: JSON.stringify(challenge),
  });
  await expect(page.locator('.vm-debrief-comparison')).toHaveCount(0);
  await expect(page.locator('.course-storage')).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), missionKey)).toBe(fixture.missions);
  await other.close();
});

test('VM accepted creation with missing inspections explains remaining work without inventing a configuration failure', async ({
  page,
}) => {
  await seed(page, { inspected: false });
  await page.goto(missionOrigin('infrastructure'));
  const debrief = page.locator('.mission-debrief');
  await expect(debrief).toContainText(d.incomplete);
  await expect(debrief).toContainText(d.technical);
  await expect(debrief).toContainText(c.criteria.attachments);
  await expect(debrief).toContainText(c.criteria.receipt);
  await expect(debrief.locator('.vm-debrief-differences')).toHaveCount(0);
  await expect(debrief.getByRole('button', { name: d.retry, exact: true })).toBeVisible();
});

test('VM diagnostic desktop compact keyboard short-height focus reduced motion and Axe keep diagnosis and next action readable', async ({
  page,
}, info) => {
  await seed(page, { profile: 'small' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(missionOrigin('infrastructure'));
  const diagnostic = page.locator('.vm-debrief-diagnostics');
  await expect(diagnostic).toBeVisible();
  const before = await records(page),
    first = await state(page);
  for (const [width, height] of [
    [1440, 900],
    [1024, 768],
    [1024, 500],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page
      .locator('.mission-debrief h3')
      .evaluate((el) => el.scrollIntoView({ block: 'start' }));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: info.outputPath(`diagnostic-${width}x${height}.png`) });
    const retry = diagnostic.getByRole('button', { name: d.retry, exact: true });
    await retry.focus();
    await retry.scrollIntoViewIfNeeded();
    const box = await retry.boundingBox(),
      footer = await page.locator('.course-step-navigation').boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(65);
    expect(box!.y + box!.height).toBeLessThanOrEqual(footer!.y);
  }
  await page.locator('.vm-debrief-evidence > summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.vm-debrief-evidence')).toHaveAttribute('open', '');
  await page.keyboard.press('Space');
  await expect(page.locator('.vm-debrief-evidence')).not.toHaveAttribute('open', '');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await diagnostic.getByRole('button', { name: d.retry, exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(diagnostic.getByRole('button', { name: d.retry, exact: true })).toBeFocused();
  expect(await records(page)).toEqual(before);
  expect(await state(page)).toEqual(first);
});
