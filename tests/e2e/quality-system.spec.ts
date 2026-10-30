import { openServiceLab } from './course-hub-actions';
import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb, labsNb as labs, learningPolishNb as polish } from '../../src/content/nb';
import { freshCourse, startLab } from '../../src/domain/course/model';
import { freshEngine } from '../../src/domain/sandbox/model';
import { freshV2, applyV2, foundationsV2Key } from '../../src/domain/curriculum/foundations-v2';
import { milestonePreferenceKey } from '../../src/domain/guidance/milestone-preferences';
const p = nb.portal,
  m = nb.milestones;
test.use({ trace: 'on', video: 'on', actionTimeout: 15000 });
test.setTimeout(180000);
const dialog = (page: Page) => page.locator('dialog[data-milestone]');
async function protectedRecords(page: Page) {
  return page.evaluate(
    (key) => Object.fromEntries(Object.entries(localStorage).filter(([k]) => k !== key)),
    milestonePreferenceKey,
  );
}
async function capture(page: Page, info: TestInfo, name: string) {
  await page.screenshot({ path: info.outputPath(`quality-${name}.png`), scale: 'css' });
}
async function readable(page: Page) {
  // Content existing in the DOM is insufficient: check rendered, unhidden, non-clipped instructions.
  const problems = await page
    .locator(
      'dialog[open] .milestone-body p, dialog[open] .milestone-facts dd, .coach-instruction dd',
    )
    .evaluateAll((nodes) =>
      nodes.flatMap((node) => {
        const e = node as HTMLElement,
          css = getComputedStyle(e),
          box = e.getBoundingClientRect();
        return !e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) ||
          box.width <= 0 ||
          box.height <= 0 ||
          e.scrollWidth > e.clientWidth + 1 ||
          parseFloat(css.fontSize) < 12 ||
          !!e.closest('details:not([open]),[hidden],[inert]')
          ? [e.textContent]
          : [];
      }),
    );
  expect(problems).toEqual([]);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function area(page: Page, name: keyof typeof p.areas) {
  const nav = page.getByRole('navigation', { name: p.navLabel, exact: true });
  if (!(await nav.isVisible()))
    await page.getByRole('button', { name: p.menu, exact: true }).click();
  await nav.getByRole('link', { name: p.areas[name], exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas[name]);
}
async function launch(page: Page, kind: 'vm' | 'paas') {
  await page.goto('/');
  await openServiceLab(page, kind === 'vm' ? 'iaas' : 'paas');
  const entry = page.locator('.practical-entry');
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem('azurelab.course.v1') ?? '{}').resume?.topic,
      ),
    )
    .toBe(kind === 'vm' ? 'iaas' : 'paas');
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem('azurelab.learning.service-types.v2') ?? '{}').events?.at(
            -1,
          )?.kind,
      ),
    )
    .toBe('visit');
  const before = await protectedRecords(page);
  await entry.getByRole('button', { name: labs.launch, exact: true }).click();
  const brief = page.getByRole('dialog');
  await expect(brief).toContainText(m.prerequisites[kind]);
  await expect(brief).toContainText(m.briefAction);
  await brief.getByRole('button', { name: polish.briefing.cancel, exact: true }).click();
  expect(await protectedRecords(page)).toEqual(before);
  await entry.getByRole('button', { name: labs.launch, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: polish.briefing.start, exact: true })
    .click();
  await expect(page).toHaveURL(/\/portal\?/);
}
async function group(page: Page) {
  await area(page, 'groups');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.createTitles.group);
  await page.getByRole('combobox', { name: p.subscription, exact: true }).selectOption('sub-app');
  await page.getByRole('textbox', { name: p.groupName, exact: true }).fill('rg-quality-dev');
  await expect(page.getByRole('combobox', { name: p.subscription, exact: true })).toHaveValue(
    'sub-app',
  );
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('norwayeast');
  await page.locator('[data-guide="review"]').click();
  await page.locator('[data-guide="commit"]').click();
}
test('new guided VM milestone is factual, dismissible, recallable and once-only across reload/history', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  const external: string[] = [];
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== new URL(info.project.use.baseURL!).origin)
      external.push(r.url());
  });
  await launch(page, 'vm');
  await group(page);
  await area(page, 'vms');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page.getByLabel(labs.vm.name, { exact: true }).fill('vm-quality');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('northeurope');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Disks', exact: true })
    .click();
  await page.getByRole('combobox', { name: labs.vm.dataDisk, exact: true }).selectOption('32');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: p.review, exact: true })
    .click();
  await page.locator('[data-guide="commit"]').click();
  await expect(page.locator('.portal-title h1')).toHaveText('vm-quality');
  await expect(dialog(page)).toHaveCount(0);
  await page.getByRole('button', { name: labs.inspect, exact: true }).click();
  await expect(dialog(page)).toBeVisible();
  await expect(dialog(page)).toHaveAttribute('data-milestone', 'vm-dependencies');
  await expect(dialog(page)).toContainText('vm-quality-os');
  await expect(dialog(page)).toContainText('vm-quality-nic');
  await expect(dialog(page)).toContainText(m.vm.consequence);
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  const saved = await protectedRecords(page);
  await readable(page);
  await capture(page, info, 'vm-milestone-1920');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog[open]'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog(page)).toHaveCount(0);
  expect(await protectedRecords(page)).toEqual(saved);
  const history = page.locator('.milestone-library');
  await history.locator('summary').click();
  await history.getByRole('button', { name: `${m.open} · ${m.vm.title}`, exact: true }).click();
  await expect(dialog(page)).toBeVisible();
  await dialog(page).getByRole('button', { name: m.close, exact: true }).click();
  expect(await protectedRecords(page)).toEqual(saved);
  await page.reload();
  await expect(history).toBeVisible();
  await expect(dialog(page)).toHaveCount(0);
  await area(page, 'vms');
  await page.goBack();
  await expect(history).toBeVisible();
  await expect(dialog(page)).toHaveCount(0);
  await page.evaluate(
    (key) => localStorage.setItem(key, '{"schema":99,"seen":[]}'),
    milestonePreferenceKey,
  );
  await page.reload();
  await expect(history).toBeVisible();
  await expect(dialog(page)).toHaveCount(0);
  await history.locator('summary').click();
  await history.getByRole('button', { name: `${m.open} · ${m.vm.title}`, exact: true }).click();
  await expect(dialog(page)).toBeVisible();
  await dialog(page).getByRole('button', { name: m.close, exact: true }).click();
  await expect(history.getByRole('status')).toHaveText(m.storage);
  expect(await page.evaluate((key) => localStorage.getItem(key), milestonePreferenceKey)).toBe(
    '{"schema":99,"seen":[]}',
  );
  const technicalBefore = await page.evaluate(() => localStorage.getItem('azurelab.sandbox.v2'));
  const other = await page.context().newPage();
  await other.goto('/portal');
  await other.evaluate((key) => localStorage.removeItem(key), milestonePreferenceKey);
  await expect(history.getByRole('status')).toHaveCount(0);
  await expect(dialog(page)).toHaveCount(0); // Repair does not retry a past interruption.
  await history.getByRole('button', { name: `${m.open} · ${m.vm.title}`, exact: true }).click();
  await expect(dialog(page)).toBeVisible();
  // Start a real independent assessment in the other tab while the milestone is open.
  await other.goto('/learn/computing?topic=v2-assessment');
  await other.getByRole('button', { name: nb.foundationsV2.beginAssessment, exact: true }).click();
  await expect(dialog(page)).toHaveCount(0);
  await expect(history).toHaveCount(0);
  await expect(page.locator('.practical-coach, .guided-coach, .guide-target-ring')).toHaveCount(0);
  const uncertainty = page.locator('[data-guidance-context="uncertain"]');
  await expect(uncertainty).toContainText(m.contextUnavailable);
  await capture(page, info, 'context-paused-1920');
  const independentRecord = await other.evaluate(
    (key) => localStorage.getItem(key),
    foundationsV2Key,
  );
  expect(
    JSON.parse(independentRecord!).events.some((e: { kind: string }) => e.kind === 'aid'),
  ).toBe(false);
  await uncertainty.getByRole('button', { name: p.reload, exact: true }).click();
  await expect(uncertainty).toHaveCount(0);
  await expect(
    page.locator('.practical-coach, .guided-coach, .guide-target-ring, .milestone-library'),
  ).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), foundationsV2Key)).toBe(
    independentRecord,
  );
  expect(await page.evaluate(() => localStorage.getItem('azurelab.sandbox.v2'))).toBe(
    technicalBefore,
  );
  await other.close();
  expect(external).toEqual([]);
});

test('policy milestone uses actual rejection, remains readable in short/compact layouts and never corrects for the learner', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await launch(page, 'paas');
  await group(page);
  await area(page, 'plans');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption({ label: 'rg-quality-dev' });
  await page.getByRole('textbox', { name: p.name, exact: true }).fill('plan-quality');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('northeurope');
  await page.locator('[data-guide="review"]').click();
  await page.locator('[data-guide="commit"]').click();
  await expect(page.locator('.chapter-receipt')).toHaveAttribute('data-outcome', 'rejected');
  await expect(dialog(page)).toHaveCount(0);
  await page.getByRole('button', { name: nb.course.goPolicy, exact: true }).click();
  await expect(dialog(page)).toBeVisible();
  await expect(dialog(page)).toHaveAttribute('data-milestone', 'policy-denial');
  await expect(dialog(page)).toContainText('North Europe');
  await expect(dialog(page)).toContainText('West Europe');
  await expect(dialog(page)).toContainText(m.policy.consequence);
  const saved = await protectedRecords(page);
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1024, height: 768 },
    { width: 800, height: 360 },
    { width: 390, height: 600 },
  ]) {
    await page.setViewportSize(viewport);
    await readable(page);
    await expect(dialog(page).locator('.mission-heading')).toBeInViewport();
    await expect(dialog(page).getByRole('button', { name: m.close, exact: true })).toBeInViewport();
    const reading = dialog(page).getByRole('region', { name: m.reading, exact: true });
    if (await reading.evaluate((e) => e.scrollHeight > e.clientHeight)) {
      await reading.focus();
      await reading.press('End');
      await expect.poll(() => reading.evaluate((e) => e.scrollTop)).toBeGreaterThan(0);
      await reading.press('Home');
      await expect.poll(() => reading.evaluate((e) => e.scrollTop)).toBe(0);
    }
    await capture(page, info, `policy-${viewport.width}x${viewport.height}`);
  }
  await dialog(page).getByRole('button', { name: m.close, exact: true }).click();
  expect(await protectedRecords(page)).toEqual(saved);
  await page.reload();
  await expect(page.locator('.milestone-library')).toBeVisible();
  await expect(dialog(page)).toHaveCount(0);
});

test('visible guidance rejects transparent, duplicated and modal-covered targets while keeping semantic navigation', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await launch(page, 'paas');
  const search = page.locator('[data-guide="search"]');
  await expect(page.locator('.coach-instruction')).toContainText(m.where);
  await expect(page.locator('.guide-target-ring')).toHaveCount(1);
  await search.evaluate((e) => {
    (e as HTMLElement).style.opacity = '0';
  });
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  await expect(page.locator('.coach-instruction')).toContainText(m.targetLocations.search);
  await search.evaluate((e) => {
    (e as HTMLElement).style.opacity = '';
    const duplicate = e.cloneNode() as HTMLElement;
    duplicate.id = 'duplicate-guide-target';
    e.parentElement!.append(duplicate);
  });
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  await page.evaluate(() => document.getElementById('duplicate-guide-target')!.remove());
  await expect(page.locator('.guide-target-ring')).toHaveCount(1);
  await page.getByRole('button', { name: p.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await readable(page);
  await capture(page, info, 'visible-guidance-1366');
});

test('active Foundations independent work suppresses all guidance despite a forged guided URL', async ({
  page,
}) => {
  const active = applyV2(freshV2(), { kind: 'begin' })!;
  await page.addInitScript(
    ({ active, course, key }) => {
      localStorage.setItem(key, JSON.stringify(active));
      localStorage.setItem('azurelab.course.v1', JSON.stringify(course));
    },
    {
      active,
      course: { ...freshCourse(), lab: startLab(freshEngine(), 1) },
      key: foundationsV2Key,
    },
  );
  await page.goto('/portal?area=home&lab=web-platform&mode=guided');
  await expect(page.locator('.portal-title h1')).toBeVisible();
  await expect(page.locator('.guided-coach')).toHaveCount(0);
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  await expect(page.locator('.milestone-library')).toHaveCount(0);
  await expect(dialog(page)).toHaveCount(0);
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).events, foundationsV2Key),
  ).toEqual(active.events);
});
