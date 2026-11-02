import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  nb,
  securityNb as c,
  securityItemsNb,
  serverlessNb,
  labsNb,
  learningPolishNb,
} from '../../src/content/nb';
import { journeyNb as j } from '../../src/content/learning-journey';
import { recommendedModules } from '../../src/features/course/course-sequence';
import { courseHref, courseKey, type CourseModule } from '../../src/domain/course/model';
import { securityKey, securityFacts, securityItems } from '../../src/domain/curriculum/security';
import { sandboxKey } from '../../src/domain/sandbox/store';
import { openCoursePath } from './course-hub-actions';
const next = (p: Page) => p.locator('.course-nav-next a');
const raw = (p: Page, k = securityKey) => p.evaluate((k) => localStorage.getItem(k), k);
const end = (m: CourseModule) =>
  courseHref(
    m,
    m === 'architecture'
      ? 'core-summary'
      : ['computing', 'benefits', 'services'].includes(m)
        ? 'transfer'
        : 'summary',
  );
async function boundary(p: Page, m: CourseModule, expected: string) {
  await p.goto(end(m));
  await expect(next(p)).toHaveAttribute('href', expected);
  if (m in j.transitions)
    await expect(p.locator('.course-journey-context')).toContainText(
      j.transitions[m as keyof typeof j.transitions],
    );
  if (m === 'storage-resilience')
    await expect(p.locator('.resilience-summary')).not.toContainText('Fortsett med File Movement');
  // The inherited compact layout uses normal document flow; keyboard focus reveals its footer.
  await next(p).focus();
  await expect(next(p)).toBeFocused();
  await expect(next(p)).toBeInViewport();
  await next(p).click();
  await p.waitForURL(expected);
  await expect(p.locator('.course-nav-previous a')).toHaveAttribute('href', end(m));
  const heading = p.locator('.course-activity').locator('[data-activity-heading],h2,h3').first();
  await expect(heading).toBeFocused();
  await expect(heading).toBeInViewport();
}
async function noCredit(p: Page) {
  const events = await p.evaluate(() =>
    Object.keys(localStorage)
      .filter((k) => k.startsWith('azurelab.learning.'))
      .flatMap((k) => (JSON.parse(localStorage.getItem(k)!).events ?? []) as { kind: string }[]),
  );
  expect(
    events.filter((e) =>
      ['submit', 'begin', 'begin-transfer', 'start', 'mission', 'explain', 'help'].includes(e.kind),
    ),
  ).toEqual([]);
}

test('New learner starts Computing and catalogue retains three freely accessible subject paths', async ({
  page,
}) => {
  await page.goto('/learn');
  const start = page.locator('.learn-hub-start .course-primary');
  await expect(start).toHaveAttribute('href', '/learn/computing?topic=intro-request');
  await expect(page.locator('.learn-hub-path')).toHaveCount(3);
  await expect(page.locator('.learn-hub-journey-note')).toHaveText(j.catalogNote);
  await expect(page.locator('.learn-hub-closing')).toHaveCount(2);
  const architecture = page.locator('#learn-hub-architecture-title').locator('..');
  for (const m of ['migration', 'security'])
    await expect(architecture.locator(`[data-module="${m}"]`)).toHaveCount(1);
  await start.click();
  await page.waitForURL('/learn/computing?topic=intro-request');
  for (const m of recommendedModules.slice(0, 5)) {
    const target = recommendedModules[recommendedModules.indexOf(m) + 1]!;
    await boundary(
      page,
      m,
      courseHref(
        target,
        target === 'benefits'
          ? 'availability'
          : target === 'services'
            ? 'overview'
            : target === 'architecture'
              ? 'datacenters'
              : 'introduction',
      ),
    );
  }
  await noCredit(page);
});

test('Infrastructure boundaries introduce Identity and Management before cross-subject applications', async ({
  page,
}) => {
  for (const [m, target] of [
    ['networking', 'connectivity'],
    ['connectivity', 'storage'],
    ['storage', 'storage-resilience'],
    ['storage-resilience', 'identity'],
    ['identity', 'access-control'],
    ['access-control', 'cost'],
    ['cost', 'governance'],
    ['governance', 'management-tools'],
  ] as const) {
    await boundary(page, m, courseHref(target, 'introduction'));
    await expect(page.locator('.course-units [aria-current="step"]')).toHaveAttribute(
      'href',
      courseHref(target, 'introduction'),
    );
  }
  await noCredit(page);
  expect(await raw(page, sandboxKey)).toBeNull();
});

test('Closing journey desktop compact short-height keyboard focus and honest ending remain accessible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learn/monitoring?topic=summary');
  // Also exercises the initial approved compact viewport, before the desktop-height sweep.
  await expect(page.locator('.course-journey-context')).toContainText(j.transitions.monitoring);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const [m, target] of [
    ['management-tools', 'monitoring'],
    ['monitoring', 'security'],
    ['security', 'migration'],
  ] as const)
    await boundary(page, m, courseHref(target, 'introduction'));
  await page.setViewportSize({ width: 1024, height: 500 });
  await expect(page.locator('.course-journey-context')).toContainText(j.introductions.migration);
  await page.goto(end('migration'));
  await expect(next(page)).toHaveAttribute('href', '/learn');
  const focused = page.locator('.course-activity [data-activity-heading]').first();
  await expect(focused).toBeFocused();
  const box = await focused.boundingBox(),
    footer = await page.locator('.course-step-navigation').boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(footer!.y);
  await expect(page.locator('.migration-summary')).not.toContainText('Neste produktfase');
  await expect(page.locator('.course-journey-context')).toContainText(j.transitions.migration);
  await expect(page.locator('.course-journey-context')).toBeInViewport();
  await expect(page.locator('.course-journey-context nav')).toHaveAccessibleName(j.finish);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await next(page).focus();
  await expect(next(page)).toBeFocused();
  await page.keyboard.press('Enter');
  await page.waitForURL('/learn');
  await openCoursePath(page, 'architecture');
  const migration = page.locator('[data-module="migration"] a');
  await migration.click();
  await page.waitForURL(/\/learn\/migration/);
  await page.goBack();
  await page.waitForURL('/learn');
  await page.goForward();
  await page.waitForURL(/\/learn\/migration/);
  await page.reload();
  await expect(page.locator('.course-tree-module a[aria-current="page"]')).toHaveAttribute(
    'href',
    /\/learn\/migration/,
  );
  await noCredit(page);
});

test('Active and paused guided work still outrank module boundaries without a new session', async ({
  page,
}) => {
  await page.goto('/learn/security?topic=missions');
  await page.locator('.compute-mission-list article').first().getByRole('link').click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
  const facts = async () => securityFacts(JSON.parse((await raw(page))!));
  await expect.poll(async () => (await facts()).guide?.mission).toBe('trust');
  await page
    .locator('.security-workbench')
    .getByRole('combobox', { name: c.labels.predict, exact: true })
    .selectOption('1');
  await page
    .locator('.security-workbench')
    .getByRole('button', { name: c.labels.run, exact: true })
    .click();
  await expect(page.locator('.compute-observation')).toBeVisible();
  if (await page.getByRole('dialog').isVisible()) await page.keyboard.press('Escape');
  const session = (await facts()).guide!.id;
  await page.goto(end('security'));
  await expect(next(page)).toHaveAttribute('data-flow-action', 'work');
  await expect(next(page)).toHaveAttribute('href', /perspective=trust#guided-work$/);
  await expect(page.locator('.course-journey-context')).toHaveCount(0);
  await next(page).click();
  await page.getByRole('button', { name: c.pauseGuided, exact: true }).click();
  await expect(next(page)).toHaveAttribute('data-flow-action', 'resume');
  await page.locator('.course-overview-link').click();
  await page.waitForURL('/learn');
  await page.locator('.learn-hub-start .course-primary').click();
  await next(page).click();
  expect((await facts()).guide?.id).toBe(session);
  expect((await facts()).completed).toEqual([]);
  expect((await facts()).firsts).toEqual([]);
  expect(await raw(page, sandboxKey)).toBeNull();
});

test('Independent resume immutable first and denied Journal assistance survive the new sequence', async ({
  page,
}) => {
  await page.addInitScript((key) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key && sessionStorage.getItem('deny-sequence-aid') === 'yes') throw Error('denied');
      return set.call(this, k, v);
    };
  }, securityKey);
  const begin = async (item: string) => {
    await page.goto('/learn/security?topic=assessment&case=' + item);
    await page.getByRole('button', { name: c.assessment.start, exact: true }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: c.assessment.start, exact: true })
      .click();
  };
  await begin('sp01');
  const pair = securityItems.sp01.accepted[0]!;
  await page
    .getByRole('radio', { name: securityItemsNb.sp01.decisions[pair[0]]!, exact: true })
    .check();
  await page
    .getByRole('radio', { name: securityItemsNb.sp01.reasons[pair[1]]!, exact: true })
    .check();
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  const facts = async () => securityFacts(JSON.parse((await raw(page))!));
  await expect.poll(async () => (await facts()).firsts.length).toBe(1);
  const first = JSON.stringify((await facts()).firsts[0]);
  await begin('sp08');
  await page.getByRole('radio', { name: securityItemsNb.sp08.decisions[0], exact: true }).check();
  await page.locator('.course-overview-link').click();
  await page.waitForURL('/learn');
  await expect(page.locator('.learn-hub-start .course-primary')).toHaveAttribute(
    'href',
    '/learn/security?topic=assessment&case=sp08',
  );
  await page.reload();
  await page.locator('.learn-hub-start .course-primary').click();
  await expect(
    page.getByRole('radio', { name: securityItemsNb.sp08.decisions[0], exact: true }),
  ).toBeChecked();
  expect((await facts()).assisted).toBe(false);
  await page.evaluate(() => sessionStorage.setItem('deny-sequence-aid', 'yes'));
  const before = await raw(page);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog').locator('.security-lesson')).toHaveCount(0);
  expect(await raw(page)).toBe(before);
  await page.keyboard.press('Escape');
  expect(JSON.stringify((await facts()).firsts[0])).toBe(first);
  expect(await raw(page, sandboxKey)).toBeNull();
});

test('Historical Computing and Services deep links practical briefing and Portal return remain compatible', async ({
  page,
}) => {
  for (const route of [
    '/learn/computing?topic=capacity',
    '/learn/computing?topic=serverless-summary',
    '/learn/services?topic=overview&version=1',
    '/learn/services?topic=overview&version=2',
  ]) {
    await page.goto(route);
    await expect(page.locator('.course-activity')).toBeVisible();
    await expect(page).toHaveURL(route);
  }
  await page.goto('/learn/services?topic=iaas&activity=practical&version=2');
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: labsNb.launch, exact: true })
    .click();
  await expect(page.locator('dialog.mission-briefing')).toBeVisible();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: learningPolishNb.briefing.start, exact: true })
    .click();
  await page.waitForURL(/practice=vm/);
  await expect(page.locator('.guided-coach')).toBeVisible();
  const session = await raw(page, 'azurelab.practical-labs.v1');
  const back = page.getByRole('link', { name: nb.course.returnCourse, exact: true });
  await back.click();
  await expect(page).toHaveURL(/\/learn\/services\?topic=iaas.*activity=practical/);
  expect(await raw(page, 'azurelab.practical-labs.v1')).toBe(session);
  expect(await raw(page, sandboxKey)).toBeNull();
  expect(await raw(page, courseKey)).not.toBeNull();
});
