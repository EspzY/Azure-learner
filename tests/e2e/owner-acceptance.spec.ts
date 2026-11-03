import { openCloudPart } from './cloud-chapter-actions';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb, ownerAcceptanceNb as a, labsNb, managementNb } from '../../src/content/nb';
import {
  freshV2,
  applyV2,
  v2Facts,
  v2Criteria,
  foundationsV2Key as key,
} from '../../src/domain/curriculum/foundations-v2';
test.setTimeout(180000);
const route = '/learn/computing?topic=v2-assessment',
  t = nb.foundationsV2;
const items = [
  ...t.extraItems,
  ...nb.foundations.transferItems
    .filter((i) => i.id !== 'shortfall')
    .map((i) => (i.id === 'commitment' ? { ...i, question: t.commitmentQuestion } : i)),
];
const read = (page: Page) => page.evaluate((key) => localStorage.getItem(key), key);
const facts = async (page: Page) => v2Facts(JSON.parse((await read(page))!));
async function start(page: Page) {
  await page.goto(route);
  await page.getByRole('button', { name: t.beginAssessment, exact: true }).click();
  await page.getByLabel(items[0]!.question, { exact: true }).fill('3');
}
async function leave(page: Page) {
  await openCloudPart(page, 'provisioning');
  await expect(page).toHaveURL(/topic=virtualization/);
}
async function answerAll(page: Page, wrong = false) {
  for (const c of v2Criteria) {
    const item = items.find((i) => i.id === c.id)!;
    if (c.id === 'shortfall')
      await page.getByLabel(item.question, { exact: true }).fill(wrong ? '3' : '2');
    else
      await page
        .getByRole('group', { name: item.question, exact: true })
        .getByLabel(item.choices.find(([id]) => id === c.answer)![1], { exact: true })
        .check();
  }
  await page.getByRole('button', { name: t.sendAnswers, exact: true }).click();
}
async function authorities(page: Page) {
  return page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(([k]) => /sandbox|technical|progress|xp/i.test(k)),
    ),
  );
}

test('owner assessment navigation durably aids and abandons without submission while reload and same-assessment routes preserve drafts', async ({
  page,
}) => {
  await start(page);
  const old = await read(page),
    world = await authorities(page);
  await page.reload();
  await expect(page.getByLabel(items[0]!.question, { exact: true })).toHaveValue('3');
  expect(await read(page)).toBe(old);
  await page.evaluate(() => history.pushState({}, '', location.href + '#same-assessment'));
  expect((await facts(page)).active).toBe(true);
  await leave(page);
  const closed = await facts(page);
  expect(closed).toMatchObject({
    active: false,
    submissions: [],
    abandoned: [{ answers: { shortfall: '3' }, assisted: true }],
  });
  expect(
    JSON.parse((await read(page))!)
      .events.slice(-3)
      .map((e: { kind: string }) => e.kind),
  ).toContain('abandon');
  await page.goBack();
  await expect(page.locator('.v2-abandoned')).toContainText(a.abandonedNote);
  await page.getByRole('button', { name: t.retry, exact: true }).click();
  await answerAll(page);
  expect((await facts(page)).submissions[0]).toMatchObject({ assisted: true, retry: true });
  expect(await authorities(page)).toEqual(world);
});

test('owner browser Back Forward and unsupported-navigation fallback close only intentional exits', async ({
  page,
  browser,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'navigation', { value: undefined, configurable: true }),
  );
  await page.goto('/learn/computing?topic=provisioning');
  await expect(page.locator('.related-activities')).toHaveCount(0);
  await page
    .locator('#course-activities-computing > li > a[href$="topic=resource-bridge"]')
    .click();
  await page.locator('.related-activities summary').click();
  await page.getByRole('link', { name: a.assessment, exact: true }).click();
  await page.getByRole('button', { name: t.beginAssessment, exact: true }).click();
  await page.goBack();
  await expect(page).toHaveURL(/topic=resource-bridge/);
  await expect.poll(async () => (await facts(page)).active).toBe(false);
  expect((await facts(page)).abandoned).toHaveLength(1);
  await page.goBack();
  await expect(page).toHaveURL(/topic=provisioning/);
  await page.goForward();
  await expect(page).toHaveURL(/topic=resource-bridge/);
  await page.goForward();
  await expect(page.locator('.v2-abandoned')).toBeVisible();
  await page.reload();
  expect((await facts(page)).abandoned).toHaveLength(1);
  const native = await page.context().newPage();
  await native.goto('/learn/computing?topic=provisioning');
  await expect(native.locator('.related-activities')).toHaveCount(0);
  await native
    .locator('#course-activities-computing > li > a[href$="topic=resource-bridge"]')
    .click();
  await native.locator('.related-activities summary').click();
  await native.getByRole('link', { name: a.assessment, exact: true }).click();
  await native.getByRole('button', { name: t.retry, exact: true }).click();
  await native.goBack();
  await expect.poll(async () => (await facts(native)).active).toBe(false);
  expect((await facts(native)).abandoned).toHaveLength(2);
  await native.close();
  const deniedContext = await browser.newContext();
  await deniedContext.addInitScript(() =>
    Object.defineProperty(window, 'navigation', { value: undefined, configurable: true }),
  );
  const denied = await deniedContext.newPage();
  await denied.goto('/learn/computing?topic=provisioning');
  await expect(denied.locator('.related-activities')).toHaveCount(0);
  await denied
    .locator('#course-activities-computing > li > a[href$="topic=resource-bridge"]')
    .click();
  await denied.locator('.related-activities summary').click();
  await denied.getByRole('link', { name: a.assessment, exact: true }).click();
  await denied.getByRole('button', { name: t.beginAssessment, exact: true }).click();
  const saved = await read(denied);
  await denied.evaluate((key) => {
    const old = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw Error('denied');
      old.call(this, k, v);
    };
  }, key);
  await denied.goBack();
  await expect(denied).toHaveURL(/topic=resource-bridge/);
  await expect(denied.getByRole('dialog', { name: a.leaveFailedTitle })).toBeVisible();
  await expect(denied.locator('.foundations-v2')).toHaveCount(0);
  await expect(denied.getByText(t.topics.provisioning.text, { exact: true })).toHaveCount(0);
  await denied.keyboard.press('Escape');
  await expect(denied.locator('.foundations-v2')).toHaveCount(0);
  expect(await read(denied)).toBe(saved);
  expect((await facts(denied)).active).toBe(true);
  await deniedContext.close();
});

test('owner denied exit and Journal aid fail closed and stale tabs cannot turn an exit into a new first', async ({
  page,
  context,
  browser,
}) => {
  await start(page);
  const before = await read(page);
  await page.evaluate((key) => {
    const old = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw Error('denied');
      old.call(this, k, v);
    };
  }, key);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page.locator('.portal-dialog .knowledge-journal, .portal-dialog .foundations-v2'),
  ).toHaveCount(0);
  expect(await read(page)).toBe(before);
  await page.keyboard.press('Escape');
  await openCloudPart(page, 'provisioning');
  await expect(page.getByRole('dialog', { name: a.leaveFailedTitle })).toBeVisible();
  expect(await read(page)).toBe(before);
  expect((await facts(page)).active).toBe(true);
  await page.reload();
  await expect(page.getByLabel(items[0]!.question, { exact: true })).toHaveValue('3');
  const other = await context.newPage();
  await other.goto(route);
  await other.getByLabel(items[0]!.question, { exact: true }).fill('4');
  await expect.poll(async () => (await read(page))!).toContain('"4"');
  await openCloudPart(page, 'provisioning');
  await expect(page.getByRole('dialog', { name: a.leaveFailedTitle })).toBeVisible();
  expect((await facts(page)).active).toBe(true);
  expect((await facts(page)).submissions).toEqual([]);
  await other.close();
  const isolated = await browser.newContext();
  const idle = await isolated.newPage();
  await idle.goto('/learn/services?topic=iaas&version=2&activity=practical');
  await expect(
    idle.locator('.practical-entry').getByRole('button', { name: labsNb.launch, exact: true }),
  ).toBeEnabled();
  const competing = JSON.stringify(applyV2(freshV2(), { kind: 'begin' }));
  await idle.evaluate(
    ({ key, raw, label }) => {
      localStorage.setItem(key, raw);
      // Same-task race: no storage event/render is allowed before the explicit click.
      [...document.querySelectorAll<HTMLButtonElement>('.practical-entry button')]
        .find((b) => b.textContent === label)!
        .click();
    },
    { key, raw: competing, label: labsNb.launch },
  );
  await expect(idle.getByRole('dialog')).toHaveCount(0);
  await expect(idle.locator('.practical-entry')).toHaveCount(0);
  await expect(
    idle.getByRole('heading', { name: managementNb.accessTitle, exact: true }),
  ).toBeVisible();
  await isolated.close();
});

test('owner guided PaaS resume shares independent safety and SavvyShark returns after explicit assessment exit', async ({
  page,
}) => {
  await page.goto('/learn/services?topic=paas&version=2&activity=practical');
  const lab = page.locator('.practical-entry');
  await lab.getByRole('button', { name: labsNb.launch, exact: true }).click();
  // Native briefing has its own explicit Start; opening it alone creates no session.
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Start/, exact: false })
    .last()
    .click();
  await expect(page).toHaveURL(/\/portal/);
  const session = await page.evaluate(() => localStorage.getItem('azurelab.practical-labs.v1'));
  await page.goto(route);
  await page.getByRole('button', { name: t.beginAssessment, exact: true }).click();
  // Another tab must not abandon this attempt merely by opening the lab lesson.
  const other = await page.context().newPage();
  await other.goto('/learn/services?topic=paas&version=2&activity=practical');
  await expect(
    other.locator('.practical-entry').getByRole('button', { name: labsNb.resume, exact: true }),
  ).toBeDisabled();
  await expect(other.locator('.practical-blocked')).toContainText(a.labBlocked);
  await other.close();
  await page.reload();
  await expect(page.locator('.v2-assessment form')).toBeVisible();

  await openCloudPart(page, 'provisioning');
  await expect(page).toHaveURL(/topic=virtualization/);
  expect((await facts(page)).active).toBe(false);
  await page.goto('/learn/services?topic=paas&version=2&activity=practical');
  await page
    .locator('.practical-entry')
    .getByRole('link', { name: labsNb.resume, exact: true })
    .click();
  await expect(page).toHaveURL(/\/portal/);
  await page
    .getByRole('button', { name: /SavvyShark/ })
    .first()
    .click();
  await expect(page.getByText(a.labBlocked, { exact: true })).toHaveCount(0);
  await expect(page.locator('.portal-guidance-menu')).toBeVisible();
  expect(session).not.toBeNull();
  if (session)
    expect(
      await page.evaluate(() => localStorage.getItem('azurelab.practical-labs.v1')),
    ).not.toBeNull();
});

test('owner progressive feedback uses readable answers and immutable historic first through retry', async ({
  page,
  browser,
}) => {
  await start(page);
  await answerAll(page, true);
  const first = (await facts(page)).submissions[0];
  await expect(page.locator('.v2-feedback header h3')).toBeFocused();
  await expect(page.locator('.v2-feedback header h3')).toBeInViewport();
  await expect(page.locator('.v2-feedback header')).toContainText(a.first);
  await expect(page.locator('.v2-feedback header')).toContainText('10 / 11');
  await expect(page.locator('.v2-review-areas')).toContainText(t.topics['v2-capacity'].title);
  const details = page.locator('.v2-feedback-items > details');
  await expect(details).toHaveCount(11);
  for (const item of items) {
    const detail = details.filter({ hasText: item.question });
    await detail.locator('summary').click();
    await expect(detail).toContainText(item.explanation);
    await expect(detail.locator('.v2-feedback-detail > p').first()).not.toHaveText(
      /^(finite|allocation|customer|spot)$/,
    );
    await detail.locator('summary').click();
  }
  await page.getByRole('button', { name: t.retry, exact: true }).click();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect.poll(async () => (await facts(page)).assisted).toBe(true);
  await page.keyboard.press('Escape');
  await answerAll(page);
  expect((await facts(page)).submissions[0]).toEqual(first);
  await expect(page.locator('.v2-feedback > header').first()).toContainText(a.assistedPractice);
  await page.reload();
  expect((await facts(page)).submissions[0]).toEqual(first);

  const bounded = await browser.newContext();
  const capped = await bounded.newPage();
  let full = applyV2(freshV2(), { kind: 'begin' })!;
  full = { ...full, schema: 3, lifecycle: '1.0.0' };
  full = applyV2(full, { kind: 'abandon', lifecycle: '1.0.0', reason: 'navigation' })!;
  full = applyV2(full, { kind: 'begin' })!;
  const correct = Object.fromEntries(v2Criteria.map((c) => [c.id, c.answer]));
  while (full.events.length < 600)
    full = applyV2(full, {
      kind: 'draft',
      answers: { ...correct, shortfall: String((full.events.length % 2) + 1) },
    })!;
  await bounded.addInitScript(({ key, raw }) => localStorage.setItem(key, raw), {
    key,
    raw: JSON.stringify(full),
  });
  await capped.goto(route);
  await capped.getByLabel(items[0]!.question, { exact: true }).fill('3');
  await expect(capped.getByText(a.historyFull, { exact: true })).toBeVisible();
  await expect(capped.getByLabel(items[0]!.question, { exact: true })).toBeDisabled();
  await expect(capped.getByRole('button', { name: t.sendAnswers, exact: true })).toBeEnabled();
  const persistedDraft = (await facts(capped)).draft;
  await capped.getByRole('button', { name: t.sendAnswers, exact: true }).click();
  expect((await facts(capped)).submissions[0]!.answers).toEqual(persistedDraft);
  expect((await facts(capped)).active).toBe(false);
  expect((await facts(capped)).submissions[0]!.retry).toBe(true);
  await bounded.close();
});

test('owner secondary destinations explain purpose preserve normal next and never begin an assessment', async ({
  page,
}) => {
  for (const [path, expected] of [
    ['/learn/computing?topic=resource-bridge', route],
    ['/learn/benefits?topic=availability', '/learn/benefits?topic=assessment'],
    ['/learn/services?topic=paas&version=2', '/learn/services?topic=assessment'],
  ]) {
    await page.goto(path!);
    await expect(page.locator('.related-transfer')).toHaveCount(0);
    const disclosure = page.locator('.related-activities');
    await expect(disclosure).not.toHaveAttribute('open');
    await disclosure.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(disclosure.getByRole('link', { name: a.assessment, exact: true })).toHaveAttribute(
      'href',
      expected!,
    );
    await expect(disclosure).toContainText(a.assessmentPurpose);
    await expect(disclosure).toContainText(a.observationsPurpose);
    await expect(page.locator('.course-nav-next a')).toHaveCount(1);
  }
  for (const track of ['benefits', 'services']) {
    await page.goto(`/learn/${track}?topic=summary${track === 'services' ? '&version=2' : ''}`);
    await expect(page.locator('.related-transfer')).toHaveCount(0);
    await expect(page.locator('.course-nav-next a')).toHaveAttribute(
      'href',
      new RegExp(`/learn/${track}\\?topic=transfer`),
    );
    await page.locator('.course-nav-next a').click();
    await expect(page.locator('.transfer-workspace')).toBeVisible();
  }
  expect((await facts(page)).submissions).toEqual([]);
  expect((await facts(page)).active).toBe(false);
  expect(
    JSON.parse((await read(page))!).events.some((e: { kind: string }) => e.kind === 'begin'),
  ).toBe(false);
});

test('owner feedback short desktop keyboard reflow footer clearance Axe and reduced motion preserve readable content', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page);
  await answerAll(page, true);
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
    [800, 700],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    const summary = page.locator('.v2-feedback-items > details').first().locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(summary).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(
      await page
        .locator('.v2-feedback')
        .evaluate((el) => el.getBoundingClientRect().right <= innerWidth),
    ).toBe(true);
    await page.getByRole('button', { name: t.retry, exact: true }).scrollIntoViewIfNeeded();
    const button = await page.getByRole('button', { name: t.retry, exact: true }).boundingBox(),
      footer = await page.locator('.course-step-navigation').boundingBox();
    expect(button!.y + button!.height).toBeLessThanOrEqual(footer!.y);
    await page.screenshot({ path: info.outputPath(`feedback-${width}x${height}.png`) });
    await summary.focus();
    await page.keyboard.press('Enter');
  }
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
