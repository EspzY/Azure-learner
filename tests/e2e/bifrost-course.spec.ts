import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import { themeCopy } from '../../src/features/design/theme-copy';
import { sandboxKey } from '../../src/domain/sandbox/store';
import { storageKey } from '../../src/domain/progression';
import { foundationsV2Key, restoreV2, v2Facts } from '../../src/domain/curriculum/foundations-v2';

const technical = (page: Page) =>
  page.evaluate(({ world, xp }) => [localStorage.getItem(world), localStorage.getItem(xp)], {
    world: sandboxKey,
    xp: storageKey,
  });
async function theme(page: Page, mode: 'light' | 'dark') {
  await expect(page.locator('.course-shell')).toHaveCount(1);
  await page.getByLabel(themeCopy.label, { exact: true }).selectOption(mode);
  await expect(page.locator('html')).toHaveAttribute('data-bf-theme', mode);
}
async function accessible(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
}

for (const mode of ['light', 'dark'] as const) {
  test(`Bifrost ${mode} actual Hub question selected state real wrong correct feedback and Journal preserve original evidence`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/learn');
    await theme(page, mode);
    await expect(page.locator('.learn-hub-module')).toHaveCount(17);
    await expect(page.locator('.learn-hub-start .course-primary')).toHaveAttribute(
      'href',
      '/learn/computing?topic=intro-request',
    );
    await accessible(page);
    await page.screenshot({ path: info.outputPath(`${mode}-hub.png`) });
    const before = await technical(page);
    await page.locator('.learn-hub-start .course-primary').click();
    const check = page.locator('#cloud-part-intro-request .v2-check');
    await expect(check).toHaveCount(1);
    await expect(page.locator('#cloud-part-intro-request .proof-server')).toBeVisible();
    await page.getByRole('button', { name: nb.foundationsVisuals.send, exact: true }).click();
    await expect(page.locator('#cloud-part-intro-request .proof-causal')).toHaveText(
      nb.foundationsV2.traceSteps[0],
    );
    await page.screenshot({ path: info.outputPath(`${mode}-teaching-info.png`) });
    const item = nb.foundationsV2.checkItems['intro-request'];
    await expect(check.locator('[data-bf-result]')).toHaveCount(0);
    const browser = item.choices.find(([id]) => id === 'browser')![1];
    const server = item.choices.find(([id]) => id === 'server')![1];
    await check.getByLabel(browser, { exact: true }).check();
    await expect(check.locator('[data-bf-result]')).toHaveCount(0);
    expect(
      await check.getByLabel(browser, { exact: true }).evaluate((el) => {
        const row = el.closest('label')!;
        return getComputedStyle(row).backgroundColor;
      }),
    ).not.toBe(
      await check
        .getByLabel(server, { exact: true })
        .evaluate((el) => getComputedStyle(el.closest('label')!).backgroundColor),
    );
    await check.scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`${mode}-question-selected.png`) });
    await check.getByRole('button', { name: nb.foundationsV2.check, exact: true }).click();
    await expect(check.locator('[data-bf-result="incorrect"]')).toHaveText(item.wrong);
    await page.screenshot({ path: info.outputPath(`${mode}-question-wrong.png`) });
    await check.getByLabel(server, { exact: true }).check();
    await expect(check.locator('[data-bf-result="incorrect"]')).toHaveText(item.wrong);
    await check.getByRole('button', { name: nb.foundationsV2.check, exact: true }).click();
    await expect(check.locator('[data-bf-result="correct"]')).toHaveText(item.correct);
    await page.screenshot({ path: info.outputPath(`${mode}-question-correct.png`) });
    await accessible(page);
    await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
    await expect(page.locator('.bifrost-course-journal')).toBeVisible();
    await accessible(page);
    await page.screenshot({ path: info.outputPath(`${mode}-journal.png`) });
    await page.getByRole('dialog').press('Escape');
    await expect(page.getByRole('button', { name: nb.course.journal, exact: true })).toBeFocused();
    const facts = v2Facts(
      restoreV2(await page.evaluate((key) => localStorage.getItem(key), foundationsV2Key)).save,
    );
    expect(facts.submissions).toEqual([]);
    expect(facts.active).toBe(false);
    expect(await technical(page)).toEqual(before);
  });

  test(`Bifrost ${mode} existing module reading primitives retain original routes and no automatic assessment`, async ({
    page,
  }, info) => {
    await page.goto('/learn');
    await theme(page, mode);
    const before = await technical(page);
    for (const module of [
      'computing',
      'benefits',
      'services',
      'architecture',
      'compute',
      'networking',
      'connectivity',
      'storage',
      'storage-resilience',
      'identity',
      'access-control',
      'cost',
      'governance',
      'management-tools',
      'monitoring',
      'security',
      'migration',
    ]) {
      await page.goto(`/learn/${module}`);
      await expect(page.locator('.course-shell')).toHaveCount(1);
      await expect(page.locator('.course-shell')).toHaveAttribute('data-course-module', module);
      await expect(page.locator('.course-module-header h1')).toBeVisible();
      await expect(
        page.locator('.compute-assessment form, .v2-assessment form, .expanded-assessment form'),
      ).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await page.goto('/learn/benefits?topic=availability');
    const savvy = page.locator('.expanded-module .savvy');
    await expect(savvy).toBeVisible();
    await savvy.scrollIntoViewIfNeeded();
    await accessible(page);
    await page.screenshot({ path: info.outputPath(`${mode}-savvy.png`) });
    expect(await technical(page)).toEqual(before);
  });

  test(`Bifrost ${mode} compact keyboard reduced motion and native Portal Laboratory theme boundary remain usable`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/learn');
    await theme(page, mode);
    for (const viewport of [
      { width: 1024, height: 768 },
      { width: 1024, height: 500 },
      { width: 800, height: 700 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(page.locator('.learn-hub-start .course-primary')).toBeVisible();
      const select = page.getByLabel(themeCopy.label, { exact: true });
      await select.focus();
      await expect(select).toBeFocused();
      expect(await select.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
      await accessible(page);
      await page.screenshot({
        path: info.outputPath(`${mode}-hub-${viewport.width}x${viewport.height}.png`),
      });
    }
    for (const path of ['/portal', '/labs/laboratory']) {
      await page.goto(path);
      await expect(page.locator('.portal-header')).toBeVisible();
      await expect(
        page
          .locator('.portal-header')
          .locator('xpath=ancestor::*[contains(@class,"bifrost-learning")]'),
      ).toHaveCount(0);
      expect(
        await page.locator('.portal-header').evaluate((el) => getComputedStyle(el).fontFamily),
      ).toMatch(/Segoe UI/);
      expect(
        await page.locator('.portal-header').evaluate((el) => getComputedStyle(el).backgroundColor),
      ).toBe('rgb(0, 120, 212)');
      await expect(page.locator('.bifrost-theme-control')).toHaveCount(0);
    }
  });
}
