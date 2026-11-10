import { test, expect, chromium, type Page } from '@playwright/test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import Axe from '@axe-core/playwright';
import { landingNb as t } from '../../src/content/nb';
import { laboratoryEphemeralNb as temporary } from '../../src/content/laboratory-ephemeral-nb';

const visualKey = 'azurelab.visual-theme.v1';
const appearance = (page: Page) => page.getByRole('combobox', { name: 'Utseende', exact: true });
const workBytes = (page: Page) =>
  page.evaluate(
    (key) =>
      JSON.stringify(
        Object.fromEntries(
          Object.entries(localStorage)
            .filter(([name]) => name.startsWith('azurelab.') && name !== key)
            .sort(([a], [b]) => a.localeCompare(b)),
        ),
      ),
    visualKey,
  );

for (const theme of ['light', 'dark'] as const) {
  test(`Bifrost landing ${theme} uses the supplied palette with readable whole-card choices at desktop sizes`, async ({
    page,
  }, info) => {
    await page.goto('/');
    await appearance(page).selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-bf-theme', theme);
    await page.evaluate(() => document.fonts.ready);
    const palette = await page.locator('.azurelab-landing').evaluate((root) => {
      const css = getComputedStyle(root);
      return {
        base: css.getPropertyValue('--bfc-base').trim(),
        theme: css.getPropertyValue('--bfc-theme').trim(),
      };
    });
    expect(palette).toEqual(
      theme === 'light'
        ? { base: '#f3f3f6', theme: '#631cce' }
        : { base: '#071627', theme: '#ad8aff' },
    );
    await expect(page.getByText(t.description, { exact: true })).toBeVisible();
    await expect(page.locator('.landing-course')).toHaveCount(3);
    await expect(page.locator('.landing-course-available a')).toHaveCount(1);
    await expect(page.locator('.landing-laboratory a')).toHaveCount(1);
    await expect(
      page.locator(
        '.landing-course:not(.landing-course-available) a, .landing-course:not(.landing-course-available) button',
      ),
    ).toHaveCount(0);
    await expect(page.locator('.landing-status-complete')).toHaveCount(0);
    for (const [width, height] of [
      [1920, 1080],
      [1440, 900],
      [1024, 768],
      [1024, 500],
      [800, 700],
    ]) {
      await page.setViewportSize({ width: width!, height: height! });
      expect(
        await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          height: document.documentElement.scrollHeight,
        })),
      ).toEqual({ overflow: false, height });
      await expect(page.getByRole('link', { name: t.az900Link, exact: true })).toBeInViewport();
      await expect(page.getByRole('link', { name: t.labLink, exact: true })).toBeInViewport();
      await page.screenshot({ path: info.outputPath(`bifrost-${theme}-${width}-${height}.png`) });
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect((await new Axe({ page }).analyze()).violations).toEqual([]);
    await page.setViewportSize({ width: 320, height: 700 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('link', { name: t.labLink, exact: true }).focus();
    await expect(page.getByRole('link', { name: t.labLink, exact: true })).toBeInViewport();
    expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  });
}

test('Bifrost theme defaults to system and remembers only a visual preference across reload and tabs', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(appearance(page)).toHaveValue('system');
  await expect(page.locator('html')).toHaveAttribute('data-bf-theme', 'dark');
  expect(await page.evaluate((key) => localStorage.getItem(key), visualKey)).toBeNull();
  const before = await workBytes(page);
  await appearance(page).selectOption('light');
  await page.reload();
  await expect(appearance(page)).toHaveValue('light');
  await expect(page.locator('html')).toHaveAttribute('data-bf-theme', 'light');
  const other = await context.newPage();
  await other.goto('/');
  await appearance(other).selectOption('dark');
  await expect(appearance(page)).toHaveValue('dark');
  await expect(page.locator('html')).toHaveAttribute('data-bf-theme', 'dark');
  await appearance(page).selectOption('system');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-bf-theme', 'light');
  expect(await workBytes(page)).toBe(before);
  await other.close();
});

test('Bifrost blocked visual storage remains usable and honest with keyboard and reduced motion', async ({
  page,
}) => {
  await page.addInitScript((key) => {
    const read = Storage.prototype.getItem;
    const write = Storage.prototype.setItem;
    Storage.prototype.getItem = function (name) {
      if (name === key) throw new DOMException('Denied', 'SecurityError');
      return read.call(this, name);
    };
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('Denied', 'SecurityError');
      return write.call(this, name, value);
    };
  }, visualKey);
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  await page.goto('/');
  await appearance(page).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-bf-theme', 'dark');
  await expect(page.locator('.bifrost-theme-storage-note')).toHaveText(
    'Valget brukes her, men kan ikke lagres i nettleseren.',
  );
  const before = await workBytes(page);
  const course = page.getByRole('link', { name: t.az900Link, exact: true });
  const lab = page.getByRole('link', { name: t.labLink, exact: true });
  await course.focus();
  await page.keyboard.press('Tab');
  await expect(lab).toBeFocused();
  await lab.hover();
  expect(await lab.evaluate((link) => getComputedStyle(link.parentElement!).transform)).toBe(
    'none',
  );
  await course.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/learn');
  expect(await workBytes(page)).toBe(before);
});

test('Bifrost palette changes leave the actual course and free Azure Portals identical even beneath a learning wrapper', async ({
  page,
}, info) => {
  for (const route of ['/portal', '/labs/laboratory']) {
    await page.goto(route);
    if (route === '/labs/laboratory') {
      await page.getByRole('button', { name: temporary.start, exact: true }).click();
    }
    const portal = page.locator('.portal[data-portal-mode]:visible');
    await expect(portal).toHaveCount(1);
    await expect(portal.locator('.portal-header')).toBeVisible();
    await portal.evaluate((root) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'bifrost-learning';
      wrapper.style.fontFamily = 'var(--bf-font-open-sans)';
      root.before(wrapper);
      wrapper.append(root);
    });
    const styles = () =>
      portal.evaluate((root) =>
        [root, ...root.querySelectorAll('header, main, input, button, select')].map((node) => {
          const css = getComputedStyle(node);
          return {
            tag: node.tagName,
            font: css.fontFamily,
            background: css.backgroundColor,
            color: css.color,
            border: css.borderColor,
            scheme: css.colorScheme,
          };
        }),
      );
    await page.evaluate(() => {
      document.documentElement.dataset.bfTheme = 'light';
    });
    const light = await styles();
    await page.evaluate(() => {
      document.documentElement.dataset.bfTheme = 'dark';
    });
    expect(await styles()).toEqual(light);
    expect(light[0]!.font).toContain('Segoe UI');
    expect(light[0]!.scheme).toBe('light');
    await page.screenshot({
      path: info.outputPath(`bifrost-boundary-${route === '/portal' ? 'course' : 'free'}.png`),
    });
  }
});

test('Bifrost remembered light and dark render before hydration with no runtime font dependency', async ({
  browser,
}, info) => {
  for (const theme of ['light', 'dark'] as const) {
    const context = await browser.newContext({ colorScheme: theme === 'light' ? 'dark' : 'light' });
    const page = await context.newPage();
    const remoteFonts: string[] = [];
    page.on('request', (request) => {
      if (
        request.resourceType() === 'font' &&
        new URL(request.url()).origin !== new URL(info.project.use.baseURL!).origin
      )
        remoteFonts.push(request.url());
    });
    await context.addInitScript(({ key, theme }) => localStorage.setItem(key, theme), {
      key: visualKey,
      theme,
    });
    // Keep inline pre-paint initialization and SSR; prevent React hydration.
    await page.route(/\/_next\/static\/chunks\/.*\.js$/, (route) => route.abort());
    await page.route(/\.(?:woff2|ttf)(?:\?|$)/, (route) => route.abort());
    await page.goto(info.project.use.baseURL!, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-bf-theme', theme);
    await expect(page.getByRole('heading', { name: t.brand, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: t.az900Link, exact: true })).toHaveAttribute(
      'href',
      '/learn',
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(remoteFonts).toEqual([]);
    expect((await new Axe({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({
      path: info.outputPath(`bifrost-before-hydration-fonts-blocked-${theme}.png`),
    });
    await context.close();
  }
});

test('Bifrost native browser zoom125 and200 keeps both theme choices readable without horizontal overflow', async ({
  browserName,
}, info) => {
  expect(browserName).toBe('chromium');
  const directory = await mkdtemp(join(tmpdir(), 'azurelab-bifrost-zoom-'));
  const extension = resolve('tests/fixtures/landing-zoom-extension');
  const context = await chromium.launchPersistentContext(directory, {
    channel: 'chromium',
    headless: true,
    viewport: { width: 1440, height: 900 },
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
  });
  try {
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    const page = context.pages()[0] ?? (await context.newPage());
    const origin = info.project.use.baseURL!;
    await page.goto(origin);
    for (const theme of ['light', 'dark']) {
      await appearance(page).selectOption(theme);
      for (const zoom of [1.25, 2]) {
        const actual = await worker.evaluate(
          async ({ factor, origin }) => {
            const chrome = (
              globalThis as unknown as {
                chrome: {
                  tabs: {
                    query: (query: object) => Promise<{ id: number; url: string }[]>;
                    setZoom: (id: number, value: number) => Promise<void>;
                    getZoom: (id: number) => Promise<number>;
                  };
                };
              }
            ).chrome;
            const tab = (await chrome.tabs.query({})).find((tab) => tab.url.startsWith(origin));
            await chrome.tabs.setZoom(tab!.id, factor);
            return chrome.tabs.getZoom(tab!.id);
          },
          { factor: zoom, origin },
        );
        expect(actual).toBe(zoom);
        await expect.poll(() => page.evaluate(() => innerWidth)).toBe(Math.round(1440 / zoom));
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        for (const name of [t.az900Link, t.labLink]) {
          const link = page.getByRole('link', { name, exact: true });
          await link.focus();
          await expect(link).toBeInViewport();
        }
        expect((await new Axe({ page }).analyze()).violations).toEqual([]);
        const cdp = await context.newCDPSession(page);
        const capture = await cdp.send('Page.captureScreenshot', {
          format: 'png',
          fromSurface: false,
        });
        await writeFile(
          info.outputPath(`bifrost-native-zoom-${theme}-${zoom}.png`),
          Buffer.from(capture.data, 'base64'),
        );
        await cdp.detach();
      }
    }
  } finally {
    await context.close();
    await rm(directory, { recursive: true, force: true });
  }
});
