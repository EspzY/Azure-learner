import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb, labsNb as labs, learningPolishNb as c } from '../../src/content/nb';
test.use({ trace: 'on', video: 'on', actionTimeout: 15000 });
test.setTimeout(150000);
async function stores(page: Page) {
  return page.evaluate(() =>
    Object.fromEntries(
      Object.keys(localStorage)
        .filter((k) => k.startsWith('azurelab.'))
        .sort()
        .map((k) => [k, localStorage.getItem(k)]),
    ),
  );
}
async function capture(page: Page, info: TestInfo, name: string) {
  await page.screenshot({ path: info.outputPath(`guided-${name}.png`), scale: 'css' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
test('ordinary root → Benefits → mission briefing → real Portal → exact return, with no briefing evidence', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'desktop-chromium',
    'Desktop-first composition; existing narrow regressions retained.',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== new URL(info.project.use.baseURL!).origin)
      external.push(r.url());
  });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await page
    .getByRole('link', { name: `${nb.course.open}: Benefits of cloud services`, exact: true })
    .click();
  await expect(page).toHaveURL(/learn\/benefits\?topic=availability/);
  const start = page
    .locator('.practical-entry')
    .getByRole('button', { name: labs.launch, exact: true });
  await expect(start).toBeEnabled();
  const saved = await stores(page);
  await start.click();
  await expect(page.getByRole('dialog')).toContainText(c.briefing.vm.title);
  for (const size of [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
  ]) {
    await page.setViewportSize(size);
    await expect(
      page.getByRole('dialog').getByRole('button', { name: c.briefing.start, exact: true }),
    ).toBeInViewport();
    await capture(page, info, `briefing-${size.width}`);
  }
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(start).toBeFocused();
  expect(await stores(page)).toEqual(saved);
  await start.press('Enter');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.briefing.start, exact: true })
    .click();
  await expect(page).toHaveURL(/portal\?area=home&practice=vm/);
  await expect(page.locator('.portal-training-strip')).toContainText(nb.official.benefits);
  await expect(page.locator('.portal-home-training')).toContainText(labs.lab.vm.purpose);
  await expect(
    page
      .locator('.portal-home-training')
      .getByRole('button', { name: nb.portal.startLearning, exact: true }),
  ).toHaveCount(0);
  const coach = page.locator('.practical-coach');
  for (const title of [nb.refinement.why, nb.refinement.action, nb.refinement.expect])
    await expect(coach.getByText(title, { exact: true })).toBeVisible();
  const beforeRecall = await stores(page);
  await coach.getByRole('button', { name: c.briefing.recall, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.briefing.continue, exact: true })
    .click();
  expect(await stores(page)).toEqual(beforeRecall);
  await page
    .getByRole('searchbox', { name: nb.portal.search, exact: true })
    .fill('Resource groups');
  await page
    .locator('.portal-search-results a')
    .filter({ hasText: nb.portal.areas.groups })
    .first()
    .click();
  await capture(page, info, 'guided-discovery');
  await page
    .locator('.portal-training-strip')
    .getByRole('link', { name: nb.course.returnCourse, exact: true })
    .click();
  await expect(page).toHaveURL(/learn\/benefits\?topic=availability&activity=practical/);
  await expect(page.locator('.practical-entry')).toBeFocused();
  await page.reload();
  await expect(
    page.locator('.practical-entry').getByRole('link', { name: labs.resume, exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.practical-entry')).not.toContainText(labs.complete);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
test('semantic mechanism figures preserve prediction gating and accessible controls', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'Three desktop reference sizes.');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/learn/benefits?topic=availability');
  await expect(page.locator('.learning-visual')).toHaveCount(1);
  await expect(page.locator('.expanded-controls button.primary')).toBeEnabled();
  await expect(page.locator('.lv-pending')).toBeVisible();
  await expect(page.locator('.lv-outcome')).toHaveCount(0);
  const form = page.locator('.expanded-controls');
  await form
    .getByRole('combobox', { name: nb.expansion.common.labels.failed, exact: true })
    .selectOption('one');
  await page.getByLabel(nb.expansion.common.prediction, { exact: true }).fill('6');
  await form.getByRole('button', { name: nb.expansion.common.run, exact: true }).click();
  await expect(page.locator('.lv-outcome')).toContainText(
    `${nb.expansion.common.results.served}: 0`,
  );
  await form
    .getByRole('combobox', { name: nb.expansion.common.labels.instances, exact: true })
    .selectOption('2');
  await expect(page.locator('.lv-outcome')).toHaveCount(0);
  const cases = [
    ['benefits', 'availability'],
    ['benefits', 'reliability'],
    ['benefits', 'governance'],
    ['benefits', 'management'],
    ['benefits', 'sustainability'],
    ['services', 'iaas'],
    ['services', 'paas'],
    ['services', 'saas'],
    ['services', 'selection'],
  ];
  for (const [module, unit] of cases) {
    await page.goto(`/learn/${module}?topic=${unit}`);
    const figure = page.locator(`[data-visual="${unit}"]`);
    await expect(figure).toBeVisible();
    for (const width of unit === 'availability' || unit === 'saas' ? [1920, 1440, 1366] : [1920]) {
      await page.setViewportSize({
        width,
        height: width === 1920 ? 1080 : width === 1440 ? 900 : 768,
      });
      await figure.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await capture(page, info, `${unit}-${width}`);
    }
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await expect(page.locator('.expanded-controls select').first()).toBeEnabled();
  }
});
