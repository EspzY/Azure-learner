import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import {
  applyLearning,
  freshLearning,
  learningKey,
  restoreLearning,
} from '../../src/domain/curriculum/foundations';
import { transferCriteria } from '../../src/domain/curriculum/manifest';
import { applyEvent, freshAttempt } from '../../src/domain/chapter01/scenario';
import { chapterKey, snapshotOf, restoreChapter } from '../../src/domain/chapter01/persistence';
import {
  applyModuleEvent,
  freshServices,
  restoreServices,
  serviceLearningKey,
} from '../../src/domain/portal/learning';
import { courseKey, freshCourse } from '../../src/domain/course/model';
import { storageKey, totalXp } from '../../src/domain/progression';

const t = nb.beginnerProof;
test.use({ trace: 'on' });
test('archived noindex proof remains isolated after ordinary-course integration', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'Desktop-first review evidence.');
  let learning = applyLearning(freshLearning(), { kind: 'begin-transfer' })!;
  learning = applyLearning(learning, {
    kind: 'submit',
    answers: Object.fromEntries(
      transferCriteria.map((c) => [c.id, c.id === 'shortfall' ? '4' : c.answer]),
    ),
  })!;
  learning = applyLearning(learning, { kind: 'begin-transfer' })!;
  learning = applyLearning(learning, { kind: 'draft', answers: { shortfall: '3' } })!;
  const technical = applyEvent(freshAttempt(), {
    kind: 'command',
    bindResult: false,
    request: {
      commandId: 'review-seed-group',
      expectedWorldRevision: 0,
      command: {
        type: 'CreateGroup',
        subscriptionId: 'sub-app',
        name: 'rg-review-preserved',
        metadataRegion: 'norwayeast',
      },
    },
  })!;
  expect(technical.responses[0]?.outcome).toBe('accepted');
  let services = applyModuleEvent(freshServices(), {
    kind: 'begin',
    boundary: 'review-seed-group',
    attemptNumber: 1,
  })!;
  services = applyModuleEvent(services, { kind: 'draft', answers: { webModel: 'iaas' } })!;
  services = applyModuleEvent(services, { kind: 'submit', through: 'review-seed-group' })!;
  services = applyModuleEvent(services, {
    kind: 'begin',
    boundary: 'review-seed-group',
    attemptNumber: 1,
  })!;
  services = applyModuleEvent(services, { kind: 'draft', answers: { webModel: 'paas' } })!;
  const progress = {
    version: 1 as const,
    completed: ['organization-mission-v1', 'organization-check-v1'] as (
      'organization-mission-v1' | 'organization-check-v1'
    )[],
  };
  expect(totalXp(progress)).toBe(120);
  const records = {
    [learningKey]: JSON.stringify(learning),
    [chapterKey]: JSON.stringify(snapshotOf(technical, 1, 1)),
    [serviceLearningKey]: JSON.stringify(services),
    [courseKey]: JSON.stringify({
      ...freshCourse(),
      resume: { module: 'computing', topic: 'models' },
    }),
    [storageKey]: JSON.stringify(progress),
  };
  expect(restoreLearning(records[learningKey]).save).toEqual(learning);
  expect(restoreChapter(records[chapterKey]).status).toBe('valid');
  expect(restoreServices(records[serviceLearningKey]).save).toEqual(services);
  await page.addInitScript((seed) => {
    if (sessionStorage.getItem('review-fixture-ready')) return;
    for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, value);
    sessionStorage.setItem('review-fixture-ready', 'yes');
  }, records);
  const snapshot = () => page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()));
  const before = JSON.stringify(Object.entries(records).sort());
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto('/');
    await expect(page).toHaveURL(/\/learn$/);
    await expect(page.getByRole('link', { name: t.reviewAction, exact: true })).toHaveCount(0);
    expect(await snapshot()).toBe(before);
    await page.goto('/design/foundations-31a');
    await expect(page).toHaveURL(/\/design\/foundations-31a$/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await page.getByRole('button', { name: t.send, exact: true }).click();
    await expect(page.getByRole('status')).toHaveText(t.trace);
    await page.getByRole('navigation', { name: t.nav }).getByRole('button').nth(3).click();
    await page.getByLabel(t.prediction, { exact: true }).fill('9');
    await page.getByRole('button', { name: t.run, exact: true }).click();
    await expect(page.getByText(t.correction, { exact: true })).toBeVisible();
    expect(await snapshot()).toBe(before);
    await page.getByRole('link', { name: t.exit, exact: true }).click();
    await expect(page).toHaveURL(/\/learn$/);
    await expect(page.getByRole('link', { name: t.reviewAction, exact: true })).toHaveCount(0);
    expect(await snapshot()).toBe(before);
    await page.reload();
    await expect(page.getByRole('link', { name: t.reviewAction, exact: true })).toHaveCount(0);
    expect(await snapshot()).toBe(before);
  }
});
test('isolated beginner proof explains, predicts, calculates and compares without learner-state writes', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'desktop-chromium',
    '3.1A desktop design proof; existing mobile regression remains intact.',
  );
  const external: string[] = [],
    errors: string[] = [];
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== new URL(info.project.use.baseURL!).origin)
      external.push(r.url());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  const existing = freshLearning();
  existing.unit = 'models';
  existing.events.push({ kind: 'visit', unit: 'models' });
  await page.addInitScript(({ key, save }) => localStorage.setItem(key, JSON.stringify(save)), {
    key: learningKey,
    save: existing,
  });
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto('/design/foundations-31a');
    await expect(page.getByRole('heading', { name: t.titles[0], exact: true })).toBeVisible();
    const before = await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()));
    await page.getByRole('button', { name: t.send, exact: true }).click();
    await expect(page.getByRole('status')).toHaveText(t.trace);
    await page.screenshot({ path: info.outputPath(`31a-${width}-request.png`) });
    await page.getByRole('button', { name: t.next, exact: true }).click();
    await page.getByRole('button', { name: new RegExp(`^${t.parts[1].name}`) }).click();
    await expect(page.getByRole('status')).toContainText(t.parts[1].explanation);
    await page.screenshot({ path: info.outputPath(`31a-${width}-server.png`) });
    await page.getByRole('button', { name: t.next, exact: true }).click();
    await page.getByText(t.numericTable, { exact: true }).click();
    await expect(page.getByRole('table')).toContainText(t.unit);
    await expect(page.getByRole('table')).toBeVisible();
    await page.getByText(t.numericTable, { exact: true }).click();
    await page.screenshot({ path: info.outputPath(`31a-${width}-worked.png`) });
    await page.getByRole('button', { name: t.next, exact: true }).click();
    await expect(page.getByText(t.awaiting, { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: t.result, exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: t.run, exact: true }).click();
    await expect(page.getByRole('alert').filter({ hasText: t.invalid })).toHaveText(t.invalid);
    await page.getByLabel(t.prediction, { exact: true }).fill('9');
    await page.getByRole('button', { name: t.run, exact: true }).click();
    await expect(page.getByText(t.correction, { exact: true })).toBeVisible();
    await expect(page.locator('.proof-summary')).toContainText('2');
    await page.screenshot({ path: info.outputPath(`31a-${width}-result.png`), fullPage: true });
    await page.getByRole('radio', { name: /10/ }).check();
    await expect(page.getByRole('heading', { name: t.result, exact: true })).toHaveCount(0);
    await expect(page.getByText(t.stale, { exact: true })).toBeVisible();
    await page.getByLabel(t.prediction, { exact: true }).fill('0');
    await page.getByRole('button', { name: t.run, exact: true }).click();
    await expect(page.getByText(t.matched, { exact: true })).toBeVisible();
    await expect(page.locator('.proof-summary')).toContainText('23');
    await expect(page.locator('.proof-comparison')).toContainText('6');
    await page.getByRole('button', { name: t.reflectChoices[1], exact: true }).click();
    await expect(page.getByRole('status')).toHaveText(t.reflectFeedback[1]);
    await page.getByRole('button', { name: t.reflectChoices[0], exact: true }).click();
    await expect(page.getByRole('status')).toHaveText(t.reflectFeedback[0]);
    await page.screenshot({ path: info.outputPath(`31a-${width}-comparison.png`), fullPage: true });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()))).toBe(
      before,
    );
  }
  await page.reload();
  await expect(page.getByRole('heading', { name: t.titles[0], exact: true })).toBeVisible();
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('proof supports keyboard, reduced motion, zoom and returns to the reviewable course', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'Desktop-first design scope.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/design/foundations-31a');
  const stage = page.getByRole('navigation', { name: t.nav }).getByRole('button').nth(1);
  await stage.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: t.titles[1], exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: new RegExp(`^${t.parts[0].name}`) })).toBeFocused();
  await page.keyboard.press('Space');
  await expect(
    page.getByRole('button', { name: new RegExp(`^${t.parts[0].name}`) }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => {
    document.documentElement.style.zoom = '2';
  });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('31a-zoom.png'), fullPage: true });
  await page.getByRole('link', { name: t.exit, exact: true }).click();
  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByRole('link', { name: t.reviewAction, exact: true })).toHaveCount(0);
  await page.goto('/');
  await expect(page).toHaveURL(/\/learn$/);
});
