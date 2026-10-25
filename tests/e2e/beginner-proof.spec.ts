import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import { freshLearning, learningKey } from '../../src/domain/curriculum/foundations';

const t = nb.beginnerProof;
test.use({ trace: 'on' });
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
    if (new URL(r.url()).origin !== 'http://127.0.0.1:3000') external.push(r.url());
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

test('proof supports keyboard, reduced motion, zoom and remains outside course navigation', async ({
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
  await expect(page.locator('a[href="/design/foundations-31a"]')).toHaveCount(0);
  await page.goto('/');
  await expect(page).toHaveURL(/\/learn$/);
});
