import { test, expect, type Page, type TestInfo, type BrowserContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
import {
  nb,
  computeNb,
  managementNb,
  refinedAssessmentNb,
  serverlessNb,
} from '../../src/content/nb';
import { themeCopy } from '../../src/features/design/theme-copy';
import { sandboxKey } from '../../src/domain/sandbox/store';
import { storageKey } from '../../src/domain/progression';
import { foundationsV2Key, restoreV2, v2Facts } from '../../src/domain/curriculum/foundations-v2';
import { revealPortalLink } from './portal-actions';

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

const stored = (page: Page) =>
  page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(([key]) => key !== 'azurelab.visual-theme.v1'),
    ),
  );
async function denyVisualPreference(context: BrowserContext) {
  await context.addInitScript(() => {
    const get = Storage.prototype.getItem;
    const set = Storage.prototype.setItem;
    Storage.prototype.getItem = function (key) {
      if (key === 'azurelab.visual-theme.v1')
        throw new DOMException('denied visual preference', 'SecurityError');
      return get.call(this, key);
    };
    Storage.prototype.setItem = function (key, value) {
      if (key === 'azurelab.visual-theme.v1')
        throw new DOMException('denied visual preference', 'SecurityError');
      return set.call(this, key, value);
    };
  });
}
test('Bifrost blocked appearance preference remains honest readable and within 320px in both themes', async ({
  browser,
}, info) => {
  const results = [];
  for (const mode of ['light', 'dark'] as const) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: 'light',
    });
    try {
      await denyVisualPreference(context);
      const page = await context.newPage();
      await page.goto(`${info.project.use.baseURL}/learn`);
      const note = page.locator('.course-header .bifrost-theme-storage-note');
      await expect(note).toHaveText(themeCopy.unavailable);
      const beforeTheme = await stored(page);
      const beforeTechnical = await technical(page);
      await theme(page, mode);
      await expect(note).toHaveText(themeCopy.unavailable);
      expect(await stored(page)).toEqual(beforeTheme);
      const appearances = [];
      for (const width of [1440, 320]) {
        await page.setViewportSize({ width, height: width === 320 ? 700 : 900 });
        const metrics = await note.evaluate((el) => {
          const style = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          const luminance = (color: string) => {
            const channels = color
              .match(/[\d.]+/g)!
              .slice(0, 3)
              .map(Number)
              .map((n) => {
                const value = n / 255;
                return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
              });
            return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
          };
          const values = [luminance(style.color), luminance(style.backgroundColor)].sort(
            (a, b) => b - a,
          );
          return {
            width: document.documentElement.scrollWidth,
            viewport: innerWidth,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            viewportHeight: innerHeight,
            text: el.textContent,
            color: style.color,
            background: style.backgroundColor,
            contrast: (values[0]! + 0.05) / (values[1]! + 0.05),
            clipped: el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight,
          };
        });
        expect(metrics.width).toBeLessThanOrEqual(width);
        expect(metrics.left).toBeGreaterThanOrEqual(0);
        expect(metrics.right).toBeLessThanOrEqual(width);
        expect(metrics.top).toBeGreaterThanOrEqual(0);
        expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewportHeight);
        expect(metrics.clipped).toBe(false);
        expect(metrics.contrast).toBeGreaterThanOrEqual(4.5);
        await accessible(page);
        await page.screenshot({
          path: info.outputPath(`after-${mode}-appearance${width === 320 ? '-320' : ''}.png`),
        });
        appearances.push(metrics);
      }
      expect(await stored(page)).toEqual(beforeTheme);
      expect(await technical(page)).toEqual(beforeTechnical);
      results.push({ mode, appearances, learningBytesUnchanged: true });
    } finally {
      await context.close();
    }
  }
  await writeFile(
    info.outputPath('appearance-storage-metrics.json'),
    `${JSON.stringify({ capturedAt: new Date().toISOString(), results }, null, 2)}\n`,
  );
});
test('Bifrost real independent Start and denied Journal keep the guard closed and recovery readable in both themes', async ({
  browser,
}, info) => {
  const results = [];
  for (const mode of ['light', 'dark'] as const) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: 'light',
    });
    try {
      await denyVisualPreference(context);
      const page = await context.newPage();
      await page.goto(`${info.project.use.baseURL}/learn`);
      const note = page.locator('.course-header .bifrost-theme-storage-note');
      await expect(note).toHaveText(themeCopy.unavailable);
      const beforeTechnical = await technical(page);
      await theme(page, mode);
      const appearance = await note.evaluate((el) => ({
        color: getComputedStyle(el).color,
        background: getComputedStyle(el).backgroundColor,
      }));
      await page.setViewportSize({ width: 1024, height: 500 });
      await page.goto(
        `${info.project.use.baseURL}/learn/benefits?topic=assessment&assessment=updated`,
      );
      await theme(page, mode);
      await page.getByRole('button', { name: refinedAssessmentNb.ui.start, exact: true }).click();
      await page
        .getByRole('dialog')
        .getByRole('button', { name: refinedAssessmentNb.ui.confirm, exact: true })
        .click();
      await expect(page.locator('.expanded-assessment form select')).toHaveCount(12);
      await expect(page.locator('[data-bf-result], .expanded-result')).toHaveCount(0);
      const key = 'azurelab.learning.benefits-assessment.v2';
      const saved = await page.evaluate((name) => localStorage.getItem(name), key);
      expect(saved).toBeTruthy();
      const beforeDenial = await stored(page);
      await page.evaluate((deniedKey) => {
        const set = Storage.prototype.setItem;
        Storage.prototype.setItem = function (name, value) {
          if (name === deniedKey)
            throw new DOMException('denied learning assistance', 'QuotaExceededError');
          return set.call(this, name, value);
        };
      }, key);
      await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
      const warning = page.locator('.bifrost-course-journal .management-lesson > .course-storage');
      await expect(warning).toBeVisible();
      await expect(warning.locator('h2')).toHaveCount(1);
      await expect(
        page.locator(
          '.portal-dialog .knowledge-journal, .portal-dialog .foundations-v2, .portal-dialog .expanded-reference',
        ),
      ).toHaveCount(0);
      expect(await page.evaluate((name) => localStorage.getItem(name), key)).toBe(saved);
      expect(await stored(page)).toEqual(beforeDenial);
      const journal = await warning.evaluate((el) => ({
        color: getComputedStyle(el).color,
        background: getComputedStyle(el).backgroundColor,
        text: el.textContent,
        children: [...el.querySelectorAll('h2, h3, p')].map((child) => ({
          color: getComputedStyle(child).color,
          background: getComputedStyle(child).backgroundColor,
          text: child.textContent,
        })),
      }));
      for (const child of journal.children) {
        expect(child.color).toBe(journal.color);
        expect(child.background).toBe(journal.background);
      }
      const recovery = warning.getByRole('button', {
        name: managementNb.accessReload,
        exact: true,
      });
      await expect(recovery).toBeVisible();
      await recovery.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await expect(recovery).toBeFocused();
      const recoveryStyle = await recovery.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          color: style.color,
          background: style.backgroundColor,
          border: style.borderColor,
          focus: style.outlineColor,
          outline: style.outlineStyle,
        };
      });
      expect(journal.color).toBe(appearance.color);
      expect(journal.background).toBe(appearance.background);
      expect(recoveryStyle.color).toBe(journal.color);
      expect(recoveryStyle.background).toBe(journal.background);
      expect(recoveryStyle.border).toBe(journal.color);
      expect(recoveryStyle.focus).toBe(journal.color);
      expect(recoveryStyle.outline).toBe('solid');
      await accessible(page);
      await page.screenshot({ path: info.outputPath(`after-${mode}-denied-journal.png`) });
      await page.keyboard.press('Escape');
      expect(await stored(page)).toEqual(beforeDenial);
      expect(await technical(page)).toEqual(beforeTechnical);
      results.push({
        mode,
        journal,
        recoveryStyle,
        learningBytesUnchangedAfterDenial: true,
      });
    } finally {
      await context.close();
    }
  }
  await writeFile(
    info.outputPath('journal-storage-metrics.json'),
    `${JSON.stringify({ capturedAt: new Date().toISOString(), results }, null, 2)}\n`,
  );
});
async function accessible(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
}

async function nativeReview(page: Page, mode: 'light' | 'dark', info: TestInfo, scope = 'native') {
  const navigation = page.getByRole('navigation', { name: nb.portal.navLabel, exact: true });
  const groups = navigation.getByRole('link', { name: nb.portal.areas.groups, exact: true });
  await revealPortalLink(page, groups);
  await groups.click();
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: nb.portal.create, exact: true })
    .click();
  const create = page.locator('.portal-create');
  await expect(create).toBeVisible();
  const before = await technical(page);
  const name = page.getByLabel(nb.portal.groupName, { exact: true });
  expect(await name.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Segoe UI/);
  expect(await name.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
    'rgb(255, 255, 255)',
  );
  expect(
    await page
      .locator('.portal:not(.course-shell)')
      .evaluate((el) => getComputedStyle(el).colorScheme),
  ).toBe('light');
  await name.fill('rg-bifrost-visual-check');
  await page
    .getByRole('combobox', { name: nb.portal.subscription, exact: true })
    .selectOption('sub-app');
  await page
    .getByRole('combobox', { name: nb.portal.region, exact: true })
    .selectOption('norwayeast');
  await page.screenshot({ path: info.outputPath(`${mode}-${scope}-create.png`) });
  await create
    .locator('.portal-create-tabs')
    .getByRole('button', { name: nb.portal.review, exact: true })
    .click();
  await expect(create.locator('.portal-review')).toContainText(nb.portal.valid);
  expect(
    await create
      .locator('.portal-create-footer')
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe('rgb(255, 255, 255)');
  await accessible(page);
  await page.screenshot({ path: info.outputPath(`${mode}-${scope}-review.png`) });
  await create
    .locator('.portal-create-footer')
    .getByRole('button', { name: nb.portal.close, exact: true })
    .click();
  await expect(create).toHaveCount(0);
  expect(await technical(page)).toEqual(before);
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
    await check
      .getByRole('button', { name: nb.foundationsV2.check, exact: true })
      .evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.screenshot({ path: info.outputPath(`${mode}-question-selected.png`) });
    await check.getByRole('button', { name: nb.foundationsV2.check, exact: true }).click();
    await expect(check.locator('[data-bf-result="incorrect"]')).toHaveText(item.wrong);
    await check
      .locator('[data-bf-result="incorrect"]')
      .evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.screenshot({ path: info.outputPath(`${mode}-question-wrong.png`) });
    await check.getByLabel(server, { exact: true }).check();
    await expect(check.locator('[data-bf-result="incorrect"]')).toHaveText(item.wrong);
    await check.getByRole('button', { name: nb.foundationsV2.check, exact: true }).click();
    await expect(check.locator('[data-bf-result="correct"]')).toHaveText(item.correct);
    await check
      .locator('[data-bf-result="correct"]')
      .evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
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
    const assumptions = page.locator('.expanded-assumptions');
    await assumptions.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.screenshot({ path: info.outputPath(`${mode}-warning.png`) });
    const savvy = page.locator('.expanded-module .savvy');
    await expect(savvy).toBeVisible();
    await savvy.scrollIntoViewIfNeeded();
    await accessible(page);
    await page.screenshot({ path: info.outputPath(`${mode}-savvy.png`) });
    expect(await technical(page)).toEqual(before);
  });

  test(`Bifrost ${mode} original numeric refined select and Compute assessment fields remain neutral and readable before Submit`, async ({
    browser,
  }, info) => {
    for (const family of ['foundations', 'refined', 'compute'] as const) {
      const viewport =
        family === 'foundations'
          ? { width: 1024, height: 500 }
          : family === 'refined'
            ? { width: 1024, height: 768 }
            : { width: 800, height: 700 };
      const context = await browser.newContext({ viewport });
      try {
        const page = await context.newPage();
        await page.goto(`${info.project.use.baseURL}/learn`);
        await theme(page, mode);
        const before = await technical(page);
        const route =
          family === 'foundations'
            ? '/learn/computing?topic=v2-assessment'
            : family === 'refined'
              ? '/learn/benefits?topic=assessment&assessment=updated'
              : '/learn/compute?topic=assessment&case=cp01';
        await page.goto(`${info.project.use.baseURL}${route}`);
        if (family === 'foundations') {
          await page
            .getByRole('button', { name: nb.foundationsV2.beginAssessment, exact: true })
            .click();
        } else if (family === 'refined') {
          await page
            .getByRole('button', { name: refinedAssessmentNb.ui.start, exact: true })
            .click();
          await page.screenshot({ path: info.outputPath(`${mode}-${family}-start-dialog.png`) });
          await accessible(page);
          await page
            .getByRole('dialog')
            .getByRole('button', { name: refinedAssessmentNb.ui.confirm, exact: true })
            .click();
        } else {
          await page.getByRole('button', { name: computeNb.assessment.start, exact: true }).click();
          await page.screenshot({ path: info.outputPath(`${mode}-${family}-start-dialog.png`) });
          await accessible(page);
          await page
            .getByRole('dialog')
            .getByRole('button', { name: computeNb.assessment.start, exact: true })
            .click();
        }
        const form = page.locator(
          family === 'foundations'
            ? '.v2-assessment form'
            : family === 'refined'
              ? '.expanded-assessment form'
              : '.compute-assessment form',
        );
        await expect(form).toBeVisible();
        if (family === 'foundations')
          await expect(form.locator('input[type="number"]')).toHaveCount(1);
        if (family === 'refined') await expect(form.locator('select')).toHaveCount(12);
        if (family === 'compute') await expect(form.locator('fieldset')).toHaveCount(2);
        await expect(page.locator('[data-bf-result], .v2-feedback, .compute-feedback')).toHaveCount(
          0,
        );
        const control = form.locator('input, select').nth(0);
        if (family === 'compute')
          await expect(page.locator('.compute-assessment > header h3')).toBeFocused();
        await control.focus();
        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('Tab');
        await expect(control).toBeFocused();
        expect(await control.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
        await accessible(page);
        await form
          .locator('fieldset')
          .nth(0)
          .evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await page.screenshot({ path: info.outputPath(`${mode}-${family}-before-submit.png`) });
        expect(await technical(page)).toEqual(before);
      } finally {
        await context.close();
      }
    }
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
      if (path === '/portal') await nativeReview(page, mode, info);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/learn/compute?topic=dependencies');
    const beforeGuide = await technical(page);
    await page
      .locator('.compute-workbench')
      .getByRole('button', { name: computeNb.labels.begin, exact: true })
      .click();
    await accessible(page);
    await page
      .getByRole('dialog')
      .getByRole('button', { name: serverlessNb.start, exact: true })
      .click();
    await page
      .locator('.compute-workbench .compute-actions')
      .getByRole('link', { name: `${computeNb.labels.portal} · Resource groups`, exact: true })
      .click();
    await expect(page).toHaveURL(/\/portal\?.*compute=vm/);
    await page.reload();
    const guide = page.locator('.compute-portal-guide');
    await expect(guide).toHaveClass(/bifrost-guide-island/);
    const toggle = guide.locator('.compute-guide-toolbar button');
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
    await expect(
      guide.getByRole('heading', { name: computeNb.missions.vm.title, exact: true }),
    ).toBeVisible();
    await expect(guide).toContainText(computeNb.vmCopy.noCommands);
    expect(await guide.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
      mode === 'light' ? 'rgb(255, 255, 255)' : 'rgb(15, 33, 51)',
    );
    expect(
      await page.locator('.portal-header').evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe('rgb(0, 120, 212)');
    await accessible(page);
    await page.screenshot({ path: info.outputPath(`${mode}-resident-savvy.png`) });
    await nativeReview(page, mode, info, 'resident-native');
    expect(await technical(page)).toEqual(beforeGuide);
    await page.goto('/labs/laboratory');
    await expect(page.locator('.bifrost-guide-island, .savvy')).toHaveCount(0);
  });
}
