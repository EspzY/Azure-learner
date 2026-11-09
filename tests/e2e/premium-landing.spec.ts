import { test, expect, chromium, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { landingNb as t, laboratoryV3Nb as lab, nb, challenge2Nb } from '../../src/content/nb';
import { CourseStatusBadge } from '../../src/features/landing/course-status-badge';
import { startUpdated, servicesNew, updatedKey } from './challenge-v2-actions';
const az900 = (page: Page) => page.getByRole('link', { name: t.az900Link, exact: true });
const freeLab = (page: Page) => page.getByRole('link', { name: t.labLink, exact: true });
const bytes = (page: Page) =>
  page.evaluate(() =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(localStorage)
          .filter(([k]) => k.startsWith('azurelab.'))
          .sort(([a], [b]) => a.localeCompare(b)),
      ),
    ),
  );
async function root(page: Page) {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: t.coursesTitle, exact: true })).toBeVisible();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: t.brand, exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}
async function createGroup(page: Page) {
  await page.getByRole('button', { name: lab.newGroup, exact: true }).click();
  await page.getByRole('textbox', { name: /^Name/ }).fill('rg-independent-landing');
  await page.getByRole('button', { name: lab.review, exact: true }).click();
  await page.locator('.lab-review').getByRole('button', { name: lab.create, exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'rg-independent-landing', exact: true }),
  ).toBeVisible();
}

test('landing actual root has three distinct courses honest planned states and a separate v3 laboratory without storage or session writes', async ({
  page,
  context,
}) => {
  const requests: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/api/laboratory/')) requests.push(r.method());
  });
  await root(page);
  await expect(page.locator('.landing-course')).toHaveCount(3);
  await expect(page.locator('.landing-planned')).toHaveCount(2);
  for (const code of ['AZ-104', 'AZ-305']) {
    const card = page.locator('article', { has: page.getByText(code, { exact: true }) });
    await expect(card).toContainText(t.planned);
    await expect(card.locator('a,button')).toHaveCount(0);
  }
  await expect(az900(page)).toHaveAttribute('href', '/learn');
  await expect(freeLab(page)).toHaveAttribute('href', '/labs/laboratory');
  await expect(page.locator('a[href="/portal"]')).toHaveCount(0);
  await expect(page.locator('.landing-status-complete')).toHaveCount(0);
  const before = await bytes(page);
  await az900(page).click();
  await expect(page).toHaveURL('/learn');
  await expect(page.getByRole('heading', { name: nb.course.title, exact: true })).toBeVisible();
  expect(await bytes(page)).toBe(before);
  await page.goBack();
  await expect(az900(page)).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL('/learn');
  expect(await bytes(page)).toBe(before);
  expect(requests).toEqual([]);
  expect((await context.cookies()).some((c) => c.name.includes('lab_v3'))).toBe(false);
});

test('landing delegates actual active independent draft resume to unchanged Course Hub and does not start submit or assist it', async ({
  page,
}) => {
  await page.goto('/learn/services?topic=practice');
  await expect(page.locator('.course-shell')).toBeVisible();
  await startUpdated(page, servicesNew);
  await page
    .getByRole('combobox', { name: challenge2Nb.ui.decision, exact: true })
    .first()
    .selectOption('iaas');
  const original = await bytes(page);
  const saved = await page.evaluate((key) => localStorage.getItem(key), updatedKey);
  await root(page);
  await expect(page.locator('.landing-status')).toContainText(t.status['in-progress']);
  expect(await bytes(page)).toBe(original);
  await az900(page).click();
  const next = page.locator('.learn-hub-start .course-primary');
  await expect(next).toBeEnabled();
  const destination = new URL((await next.getAttribute('href'))!, 'http://127.0.0.1:3000');
  expect(destination.pathname).toBe('/portal');
  expect(destination.searchParams.get('assessment')).toBe('updated');
  expect(destination.searchParams.get('module')).toBe('services');
  await next.click();
  await expect(page.locator('.portal-challenge-updated')).toContainText(challenge2Nb.ui.active);
  await expect(
    page.getByRole('combobox', { name: challenge2Nb.ui.decision, exact: true }).first(),
  ).toHaveValue('iaas');
  expect(await page.evaluate((key) => localStorage.getItem(key), updatedKey)).toBe(saved);
  await page.reload();
  await expect(page.locator('.portal-challenge-updated')).toContainText(challenge2Nb.ui.active);
  expect(await page.evaluate((key) => localStorage.getItem(key), updatedKey)).toBe(saved);
});

test('landing connects actual independent server workspace and preserves both directions of course versus laboratory reset', async ({
  page,
  context,
}) => {
  await root(page);
  const emptyCourse = await bytes(page);
  await freeLab(page).click();
  await page.getByRole('button', { name: lab.start, exact: true }).click();
  await createGroup(page);
  expect(await bytes(page)).toBe(emptyCourse);
  const serverBefore = await (await context.request.get('/api/laboratory/state')).json();
  await page.getByRole('link', { name: lab.course, exact: true }).click();
  await page.goto('/learn/computing?topic=intro-request');
  await expect(page.locator('.v2-explanation').first()).toBeVisible();
  await page.goto('/progress');
  await page.getByRole('button', { name: nb.progress.reset, exact: true }).click();
  await page.getByRole('button', { name: nb.progress.confirm, exact: true }).click();
  await expect(page.getByRole('status')).toHaveText(nb.progress.resetDone);
  expect(await (await context.request.get('/api/laboratory/state')).json()).toEqual(serverBefore);
  await page.goto('/learn/computing?topic=physical-server');
  await expect(page.locator('.v2-explanation').first()).toBeVisible();
  await root(page);
  const courseBefore = await bytes(page);
  await freeLab(page).click();
  await expect(page.getByRole('button', { name: lab.reset, exact: true })).toBeEnabled();
  await page.getByRole('button', { name: lab.reset, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: lab.confirmReset, exact: true })
    .click();
  await expect(page.locator('.lab-result')).toContainText(lab.codes.updated);
  expect(await bytes(page)).toBe(courseBefore);
  const after = await (await context.request.get('/api/laboratory/state')).json();
  expect(after.workspace).toBe(serverBefore.workspace);
  expect(after.world.groups).toEqual([]);
  expect(after.entries).toHaveLength(serverBefore.entries.length + 1);
  await page.reload();
  await expect(page.locator('.lab-result')).toContainText(lab.codes.updated);
  expect(await bytes(page)).toBe(courseBefore);
});

test('landing unavailable backend and corrupt forged or cross-tab course status never create fake completion or fallback World', async ({
  page,
  context,
}) => {
  const mutations: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/api/laboratory/') && r.method() === 'POST') mutations.push(r.url());
  });
  await root(page);
  const other = await context.newPage();
  await other.goto('/learn/computing?topic=intro-request');
  // React streaming may briefly retain a hidden copy of the same course tree.
  // Require exactly one visible, committed lesson; duplicate visible UI still fails.
  const visibleCourse = other.locator('.course-shell:visible');
  await expect(visibleCourse).toHaveCount(1);
  await expect(visibleCourse).toHaveAttribute('data-course-module', 'computing');
  await expect(visibleCourse).toHaveAttribute('data-course-topic', 'intro-request');
  await expect(visibleCourse.locator('.cloud-chapter:visible')).toHaveCount(1);
  await expect(page.locator('.landing-status')).toContainText(t.status.unknown);
  await other.close();
  await page.reload();
  await expect(page.locator('.landing-status')).toContainText(t.status['in-progress']);
  await page.evaluate(() => {
    localStorage.setItem('azurelab.course.v1', '{corrupt');
    localStorage.setItem(
      'azurelab.course-completion.v1',
      JSON.stringify({ schema: 1, completed: true, verified: true, course: 'AZ-900' }),
    );
  });
  await page.reload();
  await expect(page.locator('.landing-status')).toContainText(t.status.unknown);
  await expect(page.locator('.landing-status-complete')).toHaveCount(0);
  const before = await bytes(page);
  await page.route('**/api/laboratory/state', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'backend-unavailable' }),
    }),
  );
  await freeLab(page).click();
  await expect(page.locator('.lab-alert')).toContainText(lab.codes['backend-unavailable']);
  await expect(page.getByRole('button', { name: lab.start, exact: true })).toBeDisabled();
  expect(await bytes(page)).toBe(before);
  expect(mutations).toEqual([]);
  await page.goBack();
  await expect(page.locator('.landing-status-complete')).toHaveCount(0);
});

test('landing responsive keyboard short desktop status semantics reduced motion and Axe preserve primary choices', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await root(page);
  await page.evaluate(() => document.fonts.ready);
  const sizes: [number, number][] =
    info.project.name === 'compact-chromium'
      ? [[1024, 500]]
      : [
          [1920, 1080],
          [1440, 900],
          [1024, 768],
          [1024, 500],
          [800, 700],
        ];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => scrollTo(0, 0));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const action = await az900(page).boundingBox();
    expect(action!.y + action!.height).toBeLessThanOrEqual(height);
    const labAction = await freeLab(page).boundingBox();
    expect(labAction!.y + labAction!.height).toBeLessThanOrEqual(height);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(
      height,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`landing-${width}-${height}.png`) });
    await az900(page).focus();
    await page.keyboard.press('Tab');
    await expect(freeLab(page)).toBeFocused();
    await expect(freeLab(page)).toBeInViewport();
  }
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/labs/laboratory');
  await page.goBack();
  await expect(az900(page)).toBeVisible();
  const css = await page
    .locator('link[rel="stylesheet"]')
    .evaluateAll((nodes) => nodes.map((n) => n.outerHTML).join(''));
  const badges = ['available', 'in-progress', 'complete']
    .map((status) =>
      renderToStaticMarkup(
        createElement(CourseStatusBadge, {
          status: status as 'available' | 'in-progress' | 'complete',
        }),
      ),
    )
    .join('<br>');
  await page.route('**/__qa/landing-status', (route) =>
    route.fulfill({
      contentType: 'text/html; charset=utf-8',
      body: `<!doctype html><html lang="nb"><head><meta charset="utf-8"><title>Test av statuspresentasjon</title>${css}</head><body><main class="azurelab-landing bifrost-learning"><h1>Isolert UI-test – ingen kursfullføring registrert</h1>${badges}</main></body></html>`,
    }),
  );
  await page.goto('/__qa/landing-status');
  await expect(
    page.getByRole('status', { name: t.statusNames.complete, exact: true }),
  ).toContainText(t.status.complete);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('status-presentation-only.png') });
});

test('landing actual browser zoom at125 and200 percent retains course and Laboratory actions without overflow', async ({
  browserName,
}, info) => {
  expect(browserName).toBe('chromium');
  const directory = await mkdtemp(join(tmpdir(), 'azurelab-landing-zoom-'));
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
    await page.goto('http://127.0.0.1:3000/');
    await expect(az900(page)).toBeVisible();
    for (const zoom of [1.25, 2]) {
      const actual = await worker.evaluate(async (factor) => {
        const c = (
          globalThis as unknown as {
            chrome: {
              tabs: {
                query: (q: object) => Promise<{ id: number; url: string }[]>;
                setZoom: (id: number, factor: number) => Promise<void>;
                getZoom: (id: number) => Promise<number>;
              };
            };
          }
        ).chrome;
        const tab = (await c.tabs.query({})).find((t) => t.url === 'http://127.0.0.1:3000/');
        await c.tabs.setZoom(tab!.id, factor);
        return c.tabs.getZoom(tab!.id);
      }, zoom);
      expect(actual).toBe(zoom);
      await expect.poll(() => page.evaluate(() => innerWidth)).toBe(Math.round(1440 / zoom));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await az900(page).focus();
      await expect(az900(page)).toBeInViewport();
      await freeLab(page).focus();
      await expect(freeLab(page)).toBeInViewport();
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      // Native zoom requires the browser surface, not Playwright's CSS-pixel clip.
      const cdp = await context.newCDPSession(page);
      const capture = await cdp.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: false,
      });
      await writeFile(
        info.outputPath(`browser-zoom-${zoom}.png`),
        Buffer.from(capture.data, 'base64'),
      );
      await cdp.detach();
    }
  } finally {
    await context.close();
    await rm(directory, { recursive: true, force: true });
  }
});
