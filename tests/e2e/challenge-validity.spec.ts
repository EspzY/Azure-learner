import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb, challenge2Nb as c } from '../../src/content/nb';
import {
  completeComputingLab,
  actualWeb,
  startUpdated,
  fillNew,
  technical,
  raw,
  backCourse,
  area,
  updatedKey,
  oldKey,
  computingNew,
  servicesNew,
} from './challenge-v2-actions';
const p = nb.portal;
const events = async (page: Page) =>
  JSON.parse((await raw(page))!).events as {
    kind: string;
    origin?: object;
    answers?: object;
    prior?: string;
  }[];
const oldSave = (active = false) => ({
  schema: 1,
  content: '1.0.0',
  rubric: 'portal-transfer@1',
  events: [
    { kind: 'begin', boundary: null, attemptNumber: 1 },
    ...(active
      ? [{ kind: 'draft', answers: { osModel: 'iaas' } }]
      : [
          {
            kind: 'draft',
            answers: {
              osModel: 'iaas',
              webModel: 'paas',
              reason: 'managed-platform',
              readyModel: 'saas',
              locationCause: 'plan',
            },
          },
          { kind: 'submit', through: 'portal-1' },
        ]),
  ],
});
async function deny(page: Page) {
  await page.evaluate((key) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw Error('cc55 denied');
      set.call(this, k, v);
    };
  }, updatedKey);
}
test('updated Computing Web assessment follows actual lab, explicit paired premises, technical receipts, neutral return and exact Hub resume', async ({
  page,
}, info) => {
  await completeComputingLab(page);
  await page.getByRole('button', { name: nb.course.startIndependent, exact: true }).click();
  await expect(page).toHaveURL(/assessment=updated/);
  await expect(page.getByRole('heading', { name: c.title, exact: true })).toBeVisible();
  expect(await raw(page)).toBeNull();
  const old = await raw(page, oldKey);
  await page.getByRole('button', { name: c.ui.start, exact: true }).click();
  await expect(page.locator('.portal-challenge-updated')).toContainText(c.ui.active);
  await page
    .getByRole('combobox', { name: c.ui.decision, exact: true })
    .first()
    .selectOption('iaas');
  const partial = await raw(page),
    world = await technical(page);
  await backCourse(page).click();
  await expect(page).toHaveURL(/resource-bridge&activity=challenge-return&assessment=updated/);
  await expect(page.getByRole('heading', { name: c.ui.neutralTitle, exact: true })).toBeFocused();
  expect(await raw(page)).toBe(partial);
  expect(await technical(page)).toEqual(world);
  await page.getByRole('link', { name: c.ui.resume, exact: true }).click();
  await expect(page).toHaveURL(/area=challenge.*assessment=updated/);
  await expect(
    page.getByRole('combobox', { name: c.ui.decision, exact: true }).first(),
  ).toHaveValue('iaas');
  await page.reload();
  await expect(
    page.getByRole('combobox', { name: c.ui.decision, exact: true }).first(),
  ).toHaveValue('iaas');
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start .course-primary')).toHaveAttribute(
    'href',
    /module=computing.*assessment=updated/,
  );
  await page.locator('.learn-hub-start .course-primary').click();
  await expect(page).toHaveURL(/module=computing.*assessment=updated/);
  expect(await raw(page)).toBe(partial);
  await actualWeb(page);
  await fillNew(page);
  await page.getByRole('button', { name: c.ui.submit, exact: true }).click();
  await expect(page.locator('.portal-submission')).toHaveAttribute('data-correct', 'true');
  await expect(page.locator('.portal-submission')).toContainText(c.ui.local);
  expect((await events(page)).filter((e) => e.kind === 'aid')).toHaveLength(0);
  expect(await raw(page, oldKey)).toBe(old);
  const completed = await raw(page),
    technicalDone = await technical(page);
  await page.screenshot({
    path: info.outputPath('updated-computing-result-1440.png'),
    fullPage: false,
  });
  await backCourse(page).click();
  await expect(page).toHaveURL(/resource-bridge&activity=debrief&assessment=updated/);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.ui.history);
  expect(await raw(page)).toBe(completed);
  expect(await technical(page)).toEqual(technicalDone);
});
test('updated Services origin and assessment selection survive resource navigation Back Forward reload and completed return', async ({
  page,
}) => {
  await completeComputingLab(page);
  await page.goto('/learn/services?topic=practice');
  await page.getByRole('button', { name: nb.course.startIndependent, exact: true }).click();
  await expect(page).toHaveURL(/module=services.*assessment=updated/);
  await page.getByRole('button', { name: c.ui.start, exact: true }).click();
  await expect(page.locator('.portal-challenge-updated')).toContainText(c.ui.active);
  await actualWeb(page);
  await fillNew(page);
  const saved = await raw(page),
    world = await technical(page);
  await area(page, 'activity');
  await expect(page).toHaveURL(/assessment=updated/);
  await page.goBack();
  await expect(page.locator('.portal[data-area]')).toHaveAttribute('data-area', 'challenge');
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas.challenge);
  await page.goForward();
  await expect(page.locator('.portal[data-area]')).toHaveAttribute('data-area', 'activity');
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas.activity);
  await page.reload();
  await expect(page.locator('.portal[data-area]')).toHaveAttribute('data-area', 'activity');
  await expect(page.locator('.portal-title h1')).toBeFocused();
  await area(page, 'challenge');
  await expect(
    page.getByRole('combobox', { name: c.ui.decision, exact: true }).first(),
  ).toHaveValue('iaas');
  expect(await raw(page)).toBe(saved);
  expect(await technical(page)).toEqual(world);
  await page.getByRole('button', { name: c.ui.submit, exact: true }).click();
  await expect(page.locator('.portal-submission')).toHaveAttribute('data-correct', 'true');
  await backCourse(page).click();
  await expect(page).toHaveURL(/services\?topic=practice&activity=lab&assessment=updated/);
});
test('wrong model with correct reason and right model with wrong reason fail and assisted retry never replaces first', async ({
  page,
}) => {
  await startUpdated(page);
  await actualWeb(page);
  await fillNew(page, 'rg-cc55', 'plan-cc55', 'app-cc55', true);
  await page.getByRole('button', { name: c.ui.submit, exact: true }).click();
  await expect(page.locator('.portal-submission')).toHaveAttribute('data-correct', 'false');
  await page.getByText(c.ui.details, { exact: true }).click();
  await expect(page.locator('.portal-submission')).toContainText(c.feedback.os);
  await expect(page.locator('.portal-submission')).toContainText(c.feedback.platform);
  const first = (await events(page)).slice();
  await page.getByRole('button', { name: c.ui.retry, exact: true }).click();
  await expect(page.locator('.portal-submission')).toHaveCount(0);
  await page.getByRole('button', { name: c.ui.aid, exact: true }).click();
  await expect(page.locator('.portal-submission')).toHaveCount(1);
  await fillNew(page);
  await page.getByRole('button', { name: c.ui.submit, exact: true }).click();
  expect((await events(page)).slice(0, first.length)).toEqual(first);
  await expect(page.locator('.portal-submission').last()).toContainText(c.ui.assisted);
  await page.reload();
  await expect(page.locator('.portal-submission').first()).toHaveAttribute('data-correct', 'false');
});
test('denied durable updated Start and assistance expose no success teaching Journal or prior legacy feedback', async ({
  page,
  context,
}) => {
  const failing = await context.newPage();
  await failing.goto(computingNew);
  await deny(failing);
  await failing.getByRole('button', { name: c.ui.start, exact: true }).click();
  await expect(failing.locator('.portal-challenge [role=alert]')).toContainText(c.ui.storage);
  expect(await raw(failing)).toBeNull();
  await failing.close();
  await page.goto(computingNew);
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: oldKey,
    value: oldSave(),
  });
  await page.reload();
  await page.getByRole('button', { name: c.ui.start, exact: true }).click();
  await expect(page.locator('.portal-challenge-updated')).toContainText(c.ui.active);
  const before = await raw(page),
    old = await raw(page, oldKey),
    world = await technical(page);
  await deny(page);
  await page.getByRole('link', { name: c.ui.legacy, exact: true }).click();
  await expect(
    page.getByRole('heading', { name: /Avklar lagret vurderingskontekst/ }),
  ).toBeVisible();
  await expect(page.locator('.portal-submission')).toHaveCount(0);
  expect(await raw(page)).toBe(before);
  expect(await raw(page, oldKey)).toBe(old);
  expect(await technical(page)).toEqual(world);
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start .course-primary')).toHaveAttribute(
    'href',
    /assessment=updated/,
  );
  await deny(page);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Avklar lagret');
  await expect(page.getByRole('dialog').locator('.knowledge-journal')).toHaveCount(0);
  expect((await events(page)).some((e) => e.kind === 'aid')).toBe(false);
});
test('historical active Portal v1 is continued by default and its draft origin and original rubric stay separate', async ({
  page,
}) => {
  await page.goto(
    '/portal?area=challenge&course=1&module=services&topic=practice&assessment=legacy',
  );
  await page.getByRole('button', { name: p.challenge.start, exact: true }).click();
  await expect(page.locator('.portal-challenge')).toContainText(p.challenge.active);
  await page.getByRole('combobox', { name: p.challenge.os, exact: true }).selectOption('iaas');
  const old = await raw(page, oldKey),
    pin = await raw(page, 'azurelab.portal.challenge-origin.v1');
  await page.goto('/portal?area=challenge&course=1&module=computing&topic=resource-bridge');
  await expect(page).toHaveURL(/assessment=legacy/);
  await expect(page.getByRole('combobox', { name: p.challenge.os, exact: true })).toHaveValue(
    'iaas',
  );
  expect(await raw(page)).toBeNull();
  await backCourse(page).click();
  await expect(page).toHaveURL(/services\?topic=practice&activity=challenge-return/);
  await page.getByRole('link', { name: 'Fortsett samme Web-oppgave', exact: true }).click();
  await expect(page).toHaveURL(/assessment=legacy/);
  expect(await raw(page, oldKey)).toBe(old);
  expect(await raw(page, 'azurelab.portal.challenge-origin.v1')).toBe(pin);
  await page.getByRole('button', { name: p.challenge.abandon, exact: true }).click();
  const terminal = await raw(page, oldKey);
  await page.getByRole('link', { name: c.ui.updated, exact: true }).click();
  await page.getByRole('button', { name: c.ui.start, exact: true }).click();
  await expect(page.locator('.portal-challenge-updated')).toContainText(c.ui.prior);
  expect(await raw(page, oldKey)).toBe(terminal);
  expect(await raw(page, 'azurelab.portal.challenge-origin.v1')).toBe(pin);
});
test('old submitted Portal v1 history and new version feedback require durable cross-version aid without regrading', async ({
  page,
}) => {
  await page.goto('/learn');
  const old = JSON.stringify(oldSave());
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key: oldKey,
    value: old,
  });
  await page.goto(computingNew);
  await page.getByRole('button', { name: c.ui.start, exact: true }).click();
  await expect(page.locator('.portal-challenge-updated')).toContainText(c.ui.prior);
  await page.getByRole('link', { name: c.ui.legacy, exact: true }).click();
  await expect(page.getByRole('region', { name: p.challenge.first, exact: true })).toBeVisible();
  expect((await events(page)).some((e) => e.kind === 'aid')).toBe(true);
  expect(await raw(page, oldKey)).toBe(old);
  expect(JSON.parse((await raw(page, oldKey))!).rubric).toBe('portal-transfer@1');
  await page.reload();
  expect(await raw(page, oldKey)).toBe(old);
});
test('updated cross-tab stale writes corrupt recovery and multiple active versions are explicit without World or origin replacement', async ({
  page,
  context,
}) => {
  await page.goto(computingNew);
  const second = await context.newPage();
  await second.goto(servicesNew);
  await page.evaluate((key) => {
    const state = window as unknown as { cc55Release?: () => void };
    void navigator.locks.request(
      key + ':begin',
      () =>
        new Promise<void>((resolve) => {
          state.cc55Release = resolve;
        }),
    );
  }, updatedKey);
  await expect
    .poll(() =>
      page.evaluate(() => typeof (window as unknown as { cc55Release?: () => void }).cc55Release),
    )
    .toBe('function');
  await page.getByRole('button', { name: c.ui.start, exact: true }).click();
  await second.getByRole('button', { name: c.ui.start, exact: true }).click();
  await expect(page.getByText(c.ui.loading, { exact: true })).toBeVisible();
  expect(await raw(page)).toBeNull();
  expect(await raw(second)).toBeNull();
  await page.evaluate(() => (window as unknown as { cc55Release: () => void }).cc55Release());
  await expect(page.locator('.portal-challenge-updated')).toContainText(c.ui.active);
  await expect(second.locator('.portal-challenge [role=alert]')).toContainText(c.ui.storage);
  const first = await raw(page),
    world = await technical(page);
  await expect(second.getByRole('button', { name: c.ui.start, exact: true })).toBeDisabled();
  expect(await raw(second)).toBe(first);
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: oldKey,
    value: oldSave(true),
  });
  await page.goto('/learn');

  await expect(page.getByRole('link', { name: c.ui.updated, exact: true }).first()).toHaveAttribute(
    'href',
    /assessment=updated/,
  );
  expect(await raw(page)).toBe(first);
  expect(await technical(page)).toEqual(world);
  const oldBefore = await raw(page, oldKey);
  await page.goto('/portal?area=challenge');
  await expect(page.getByRole('heading', { name: c.ui.conflict, exact: true })).toBeVisible();
  await expect(page).not.toHaveURL(/assessment=/);
  await expect(page.getByRole('link', { name: c.ui.resumeOld, exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: c.ui.resumeNew, exact: true })).toBeVisible();
  expect(await raw(page)).toBe(first);
  expect(await raw(page, oldKey)).toBe(oldBefore);
  await page.evaluate((key) => localStorage.setItem(key, 'bad'), updatedKey);
  await page.goto(computingNew);
  await expect(page.getByRole('button', { name: c.ui.start, exact: true })).toHaveCount(0);
  const old = await raw(page, oldKey);
  await page.getByRole('button', { name: c.ui.reset, exact: true }).first().click();
  await page.getByRole('button', { name: c.ui.reset, exact: true }).last().click();
  expect(await raw(page, oldKey)).toBe(old);
  expect(await technical(page)).toEqual(world);
  await second.close();
});
test('updated Web assessment desktop compact short-height keyboard focus reduced motion and Axe keep complete premises readable', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startUpdated(page);
  const world = await technical(page),
    saved = await raw(page);
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.getByRole('heading', { name: c.items[0].title, exact: true })).toBeVisible();
    await page.getByRole('button', { name: c.ui.submit, exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: c.ui.submit, exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page
      .getByRole('heading', { name: c.items[0].title, exact: true })
      .scrollIntoViewIfNeeded();
    await page.screenshot({
      path: info.outputPath(`updated-active-${viewport.width}-${viewport.height}.png`),
      fullPage: false,
    });
  }
  await page.getByRole('combobox', { name: c.ui.decision, exact: true }).first().focus();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('combobox', { name: c.ui.reason, exact: true }).first(),
  ).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await raw(page)).toBe(saved);
  expect(await technical(page)).toEqual(world);
  await expect(page.locator('body')).not.toContainText('wv2-01');
  await expect(page.locator('body')).not.toContainText('guest-lifecycle');
});
