import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  nb,
  managementNb as b,
  architectureNb as a,
  serverlessNb,
  learningPolishNb as polish,
} from '../../src/content/nb';
import {
  managementKey,
  managementCriteria,
  managementStudy,
  freshManagement,
  applyManagement,
  type ManagementTopic,
} from '../../src/domain/curriculum/architecture-management';
import { SandboxStore, sandboxKey } from '../../src/domain/sandbox/store';
import { acknowledgeMilestone } from './portal-actions';
import { activeTeachingContexts } from '../fixtures/active-teaching-contexts';
import { physicalCriteria, physicalKey } from '../../src/domain/curriculum/architecture-physical';
const c = nb.course,
  p = nb.portal;
test.use({ trace: 'on', video: 'on', actionTimeout: 15000 });
test.setTimeout(210000);
const coach = (page: Page) => page.getByRole('complementary', { name: c.guided, exact: true });
async function capture(page: Page, info: TestInfo, name: string) {
  await page.screenshot({ path: info.outputPath(`management-${name}.png`), scale: 'css' });
}
async function modelShot(page: Page, info: TestInfo, name: string) {
  const scene = page.locator('.ma-scope-structure');
  await scene.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
  await scene.screenshot({ path: info.outputPath(name) });
}
async function audit(page: Page) {
  const a = await new AxeBuilder({ page }).analyze();
  expect(
    a.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
}
async function area(page: Page, key: 'groups' | 'plans' | 'apps' | 'architecture') {
  const nav = page.getByRole('navigation', { name: p.navLabel, exact: true });
  const link = nav.getByRole('link', { name: p.areas[key], exact: true });
  if (!(await link.isVisible()))
    await page.getByRole('button', { name: p.menu, exact: true }).click();
  await link.click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas[key]);
}
async function review(page: Page) {
  await page.locator('[data-guide="review"]').click();
  await expect(page.locator('[data-guide="validation"]')).toContainText(p.valid);
  await page.locator('[data-guide="commit"]').click();
}

async function go(page: Page, topic: ManagementTopic) {
  const nav = page.locator('.course-architecture-nav');
  const link = nav.getByRole('link', { name: b.topics[topic], exact: true });
  if (!(await link.isVisible()))
    await page.getByRole('button', { name: c.learning, exact: true }).click();
  await link.click();
  await expect(page.locator('.management-lesson > header h2')).toHaveText(b.topics[topic]);
}
async function oldBytes(page: Page) {
  return page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(
        ([k]) =>
          ![
            'azurelab.learning.architecture-management.v1',
            'azurelab.course.v1',
            'azurelab.guidance.milestones.v1',
            'azurelab.sandbox.v2',
          ].includes(k),
      ),
    ),
  );
}
test('ordinary root → Part A/B theory → actual lab → hierarchy/policy → independent → common Journal and resume', async ({
  page,
}, info) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== new URL(info.project.use.baseURL!).origin)
      external.push(r.url());
  });
  await page.goto('/');
  await expect(page).toHaveURL(/\/learn$/);
  if (info.project.name === 'desktop-chromium')
    await page.setViewportSize({ width: 1920, height: 1080 });
  await capture(page, info, 'root');
  await page.getByRole('link', { name: a.open, exact: true }).click();
  await expect(page.locator('.physical-lesson > header h2')).toHaveText(a.topics.datacenters);
  const old = await oldBytes(page);
  await go(page, 'organization');
  for (const section of Object.keys(managementStudy) as (keyof typeof managementStudy)[]) {
    await go(page, section);
    const text = b.sections[section];
    await expect(page.getByText(text.paragraphs[0], { exact: true })).toBeVisible();
    await page
      .getByRole('radio', {
        name: text.choices.find(([id]) => id === managementStudy[section].answer)![1],
        exact: true,
      })
      .check();
  }
  await capture(page, info, 'theory');
  await go(page, 'scope');
  await page.getByRole('button', { name: b.start, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await audit(page);
  await capture(page, info, 'mission');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
  await page.getByRole('combobox', { name: b.prediction, exact: true }).selectOption('0');
  await page.getByRole('button', { name: b.run, exact: true }).click();
  await expect(page.locator('.ma-scope table')).toContainText(b.statuses.denied);
  await modelShot(page, info, 'management-scope-deny-model.png');
  await expect(page.locator('.ma-scope')).toContainText(b.result + ': 1');
  await page.getByRole('combobox', { name: b.scopeLabel, exact: true }).selectOption('parent');
  await page.getByRole('combobox', { name: b.effectLabel, exact: true }).selectOption('audit');
  await page.getByRole('combobox', { name: b.prediction, exact: true }).selectOption('0');
  await page.getByRole('button', { name: b.run, exact: true }).click();
  await page.getByRole('radio', { name: b.explainChoices[0][1], exact: true }).check();
  await modelShot(page, info, 'management-scope-audit-model.png');
  await capture(page, info, 'scope-result');
  await audit(page);
  await page.getByRole('button', { name: b.portalStart, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: polish.briefing.start, exact: true })
    .click();
  await expect(page).toHaveURL(/lab=web-platform/);
  await expect(page.locator('.portal-training-strip')).toContainText(a.title);
  const search = page.getByRole('searchbox', { name: p.search, exact: true });
  await search.fill('Resource groups');
  await page
    .locator('.portal-search-results')
    .locator('a[href^="/portal?"]', { hasText: 'Resource groups' })
    .click();
  await expect(coach(page)).toHaveAttribute('data-step', 'create-group');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await expect(coach(page)).toHaveAttribute('data-step', 'subscription');
  await page.getByRole('combobox', { name: p.subscription, exact: true }).selectOption('sub-app');
  await expect(coach(page)).toHaveAttribute('data-step', 'group-name');
  await page.getByRole('textbox', { name: p.groupName, exact: true }).fill('rg-course');
  await expect(coach(page)).toHaveAttribute('data-step', 'metadata');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('norwayeast');
  await expect(coach(page)).toHaveAttribute('data-step', 'review-group');
  if (page.viewportSize()!.width <= 800) {
    await coach(page).getByRole('button', { name: c.locate, exact: true }).click();
    await expect(page.locator('[data-guide="review"]')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('.guide-target-ring')).toBeVisible();
    await expect(page.locator('[data-guide="review"]')).toBeFocused();
    await page.locator('[data-guide="review"]').evaluate(
      (el) =>
        new Promise<void>((resolve) => {
          let last = NaN,
            stable = 0;
          const sample = () => {
            const top = el.getBoundingClientRect().top;
            stable = Math.abs(top - last) < 0.1 ? stable + 1 : 0;
            last = top;
            if (stable >= 3) resolve();
            else requestAnimationFrame(sample);
          };
          requestAnimationFrame(sample);
        }),
    );
    await expect
      .poll(async () => {
        const target = await page.locator('[data-guide="review"]').boundingBox(),
          ring = await page.locator('.guide-target-ring').boundingBox();
        return target && ring ? Math.abs(target.y - 4 - ring.y) : Infinity;
      })
      .toBeLessThan(2);
  }
  await capture(page, info, 'group-configuration');
  await audit(page);
  await review(page);
  await expect(page.locator('h1')).toHaveText('rg-course');
  await expect(coach(page)).toHaveAttribute('data-step', 'inspect-group');
  await expect(coach(page)).toHaveAttribute('data-target-kind', 'inspection');
  await expect(page.locator('.guide-target-ring')).toHaveAttribute('data-kind', 'inspection');
  await expect(page.locator('[data-guide="resource"]')).toHaveJSProperty('tagName', 'H1');
  await capture(page, info, 'group-inspection');
  await page.getByRole('link', { name: c.returnCourse, exact: true }).first().click();
  await expect(page).toHaveURL(/\/learn\/architecture\?topic=scope/);
  await expect(page).toHaveURL(/&activity=lab$/);
  await expect(page.getByText(b.debriefLimit, { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: b.portalStart, exact: true }).click();
  await expect(coach(page)).toHaveAttribute('data-step', 'create-plan');
  await expect(page.locator('.guide-target-ring')).toHaveCount(0); // home is not the plans list
  await area(page, 'apps');
  await expect(page.locator('.guide-target-ring')).toHaveCount(0); // unrelated Create must never be highlighted
  await area(page, 'plans');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption({ label: 'rg-course' });
  await page.getByRole('textbox', { name: p.name, exact: true }).fill('plan-denied');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('northeurope');
  await capture(page, info, 'plan-configuration');
  await review(page);
  await expect(coach(page)).toHaveAttribute('data-step', 'inspect-denial');
  await expect(page.locator('.portal-view')).toContainText(
    nb.chapter.errors['policy-location-denied'],
  );
  await capture(page, info, 'denial');
  await expect(page.locator('.guide-target-ring')).toHaveAttribute('data-kind', 'inspection');
  await coach(page).getByRole('button', { name: c.goPolicy, exact: true }).click();
  await acknowledgeMilestone(page, 'policy-denial');
  await expect(page.locator('h1')).toHaveText(p.areas.policy);
  await expect(page.locator('.portal-view')).toContainText('West Europe');
  await expect(coach(page)).toHaveAttribute('data-step', 'inspect-policy');
  await expect(page.locator('.guide-target-ring')).toHaveAttribute('data-target', 'policy');
  await expect(page.locator('.guide-target-ring')).toHaveAttribute('data-kind', 'inspection');
  await capture(page, info, 'policy-inspection');
  await expect(coach(page).locator('.coach-observed')).toContainText(nb.chapter.inventory);
  await area(page, 'plans');
  await expect(page.locator('table')).not.toContainText('plan-denied');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption({ label: 'rg-course' });
  await page.getByRole('textbox', { name: p.name, exact: true }).fill('plan-course');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('westeurope');
  await review(page);
  await expect(page.locator('h1')).toHaveText('plan-course');
  await capture(page, info, 'corrected-plan');
  await area(page, 'apps');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption({ label: 'rg-course' });
  await page.getByRole('textbox', { name: p.name, exact: true }).fill('app-course');
  await expect(coach(page)).toHaveAttribute('data-step', 'hosting');
  await page
    .getByRole('combobox', { name: p.plan, exact: true })
    .selectOption({ label: 'plan-course · West Europe' });
  await capture(page, info, 'app-hosting');
  await review(page);
  await expect(page.locator('h1')).toHaveText('app-course');
  await expect(coach(page)).toHaveAttribute('data-step', 'inspect-app');
  await coach(page).getByRole('button', { name: p.areas.architecture, exact: true }).click();
  await expect(page.locator('.react-flow__node')).toHaveCount(6);
  await coach(page).getByRole('button', { name: c.minimize, exact: true }).click();
  await page.getByRole('button', { name: nb.explore.controls.fit, exact: true }).click();
  await capture(page, info, 'architecture-live');
  await coach(page).getByRole('button', { name: c.expand, exact: true }).click();
  await page.getByRole('button', { name: p.graph.list, exact: true }).click();
  await page
    .getByRole('button', {
      name: `app-course → plan-course · ${p.graph.relations['depends-on']}`,
      exact: true,
    })
    .click();
  await expect(coach(page)).toHaveAttribute('data-step', 'complete');
  await capture(page, info, 'architecture');
  await audit(page);
  await coach(page).getByRole('link', { name: c.returnCourse, exact: true }).click();
  await expect(page).toHaveURL(/&activity=debrief$/);

  await expect(page).toHaveURL(/\/learn\/architecture\?topic=scope&activity=debrief$/);
  await expect(page.locator('#management-lab-debrief')).toBeFocused();
  await expect(page.locator('.ma-tree')).toContainText('rg-course');
  await page.getByRole('radio', { name: b.relationChoices[0][1], exact: true }).check();
  await expect(page.getByRole('dialog')).toContainText(b.milestones.relation.text);
  await capture(page, info, 'relation-milestone');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: new RegExp('^' + b.observePolicy) }).click();
  await expect(page.getByRole('dialog')).toContainText(b.milestones.policy.text);
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.ma-tree')).toContainText('app-course');
  await go(page, 'hierarchy');
  await expect(page.locator('[data-icon-missing]')).toHaveCount(0);
  await page.locator('.ma-tree').getByRole('button', { name: 'app-course', exact: true }).click();
  await expect(page.locator('.ma-inspector')).toContainText(b.assignmentInherited);
  await audit(page);
  await capture(page, info, 'hierarchy');
  await go(page, 'management-assessment');
  await page.getByRole('button', { name: b.begin, exact: true }).click();
  for (const [id, rule] of Object.entries(managementCriteria)) {
    const q = b.questions[id as keyof typeof managementCriteria];
    await page
      .getByRole('radio', { name: q.choices.find(([key]) => key === rule.answer)![1], exact: true })
      .check();
  }
  await capture(page, info, 'assessment');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: b.submit, exact: true }).click();
  await expect(page.locator('.pa-feedback')).toContainText(b.unaided);
  await capture(page, info, 'feedback');
  await go(page, 'core-summary');
  await expect(page.getByText(b.notComplete, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(b.sections.subscriptions.paragraphs[1]);
  await expect(page.getByRole('dialog')).toContainText(a.sections.zones.paragraphs[0]);
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('.management-lesson > header h2')).toHaveText(b.topics['core-summary']);
  await expect(await oldBytes(page)).toEqual(old);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('assessment Summary/Journal assistance, first result and retries remain distinct', async ({
  page,
}) => {
  await page.goto('/learn/architecture?topic=management-assessment');
  await page.getByRole('button', { name: b.begin, exact: true }).click();
  const first = b.questions.subscription;
  await page.getByRole('radio', { name: first.choices[1][1], exact: true }).check();
  await go(page, 'scope');
  await expect(page.getByRole('button', { name: b.portalStart, exact: true })).toBeDisabled();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await go(page, 'core-summary');
  await go(page, 'management-assessment');
  await expect(page.getByRole('status')).toContainText(b.assisted);
  await expect(page.getByRole('radio', { name: first.choices[1][1], exact: true })).toBeChecked();
  await page.getByRole('button', { name: b.abandon, exact: true }).click();
  await page.getByRole('button', { name: b.retry, exact: true }).click();
  await page.getByRole('button', { name: c.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(b.scopeTheory[0]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('status')).toContainText(b.assisted);
  await page.reload();
  await expect(page.getByRole('status')).toContainText(b.assisted);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByRole('link', { name: a.open, exact: true })).toHaveAttribute(
    'href',
    '/learn/architecture?topic=management-assessment',
  );
});

test('capacity termination, stale recovery and isolated invalid data', async ({ page }) => {
  let full = freshManagement();
  for (let i = 0; i < 398; i++)
    full = applyManagement(full, { kind: 'visit', topic: i % 2 ? 'resources' : 'groups' })!;
  full = applyManagement(full, { kind: 'begin' })!;
  const answers = Object.fromEntries(
    Object.entries(managementCriteria).map(([k, v]) => [k, v.answer]),
  );
  full = applyManagement(full, { kind: 'draft', answers })!;
  await page.addInitScript(
    ({ key, raw }) => {
      if (!sessionStorage.getItem('seed-management')) {
        localStorage.setItem(key, raw);
        sessionStorage.setItem('seed-management', '1');
      }
    },
    { key: managementKey, raw: JSON.stringify(full) },
  );
  await page.goto('/learn/architecture?topic=management-assessment');
  await go(page, 'core-summary');
  await go(page, 'management-assessment');
  await expect(page.getByRole('status').filter({ hasText: b.active })).toContainText(b.assisted);
  await page.getByRole('button', { name: b.submit, exact: true }).click();
  await expect(page.locator('.pa-feedback')).toBeVisible();
  await page.reload();
  await expect(page.locator('.pa-feedback')).toContainText(b.assisted);
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).events.length,
      managementKey,
    ),
  ).toBe(402);
  await page.evaluate((key) => localStorage.setItem(key, '{broken'), managementKey);
  await page.reload();
  const before = await oldBytes(page);
  await page.getByRole('button', { name: b.repair, exact: true }).click();
  const newer = JSON.stringify(applyManagement(freshManagement(), { kind: 'begin' }));
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: managementKey,
    raw: newer,
  });
  await page
    .getByRole('dialog')
    .getByRole('button', { name: b.repairConfirm, exact: true })
    .click();
  expect(await page.evaluate((key) => localStorage.getItem(key), managementKey)).toBe(newer);
  await expect(page.getByRole('status').filter({ hasText: b.active })).toBeVisible();
  expect(await oldBytes(page)).toEqual(before);
});

test('desktop sizes, compact keyboard, reduced motion and complete visible instructions', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learn/architecture?topic=hierarchy');
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
  ] as const) {
    await page.setViewportSize({ width, height });
    await audit(page);
    await page.screenshot({ path: info.outputPath('hierarchy-' + width + 'x' + height + '.png') });
  }
  await go(page, 'scope');
  await page.getByRole('button', { name: b.start, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText(b.brief.observe);
  await audit(page);
  await dialog.getByRole('button', { name: serverlessNb.start, exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('combobox', { name: b.scopeLabel, exact: true })).toBeVisible();
  await audit(page);
});

test('cross-tab assessment shielding and corrupt Part B cannot mutate Part A or prior saved work', async ({
  page,
  context,
}) => {
  await page.goto('/learn/architecture?topic=management-assessment');
  await page.getByRole('button', { name: b.begin, exact: true }).click();
  const before = await oldBytes(page);
  const other = await context.newPage();
  await other.goto('/learn/architecture?topic=scope');
  await expect(other.getByRole('button', { name: b.start, exact: true })).toBeDisabled();
  await expect(other.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.management-lesson .course-storage')).toContainText('conflict');
  await expect(page.getByRole('button', { name: b.submit, exact: true })).toBeDisabled();
  await other.close();
  await page.reload();
  await expect(page.getByRole('status').filter({ hasText: b.active })).toContainText(b.assisted);
  expect(await oldBytes(page)).toEqual(before);
  await page.getByRole('button', { name: b.abandon, exact: true }).click();
  await page.evaluate(
    (key) => localStorage.setItem(key, JSON.stringify({ schema: 99 })),
    managementKey,
  );
  await page.reload();
  await expect(page.locator('.management-lesson .course-storage')).toContainText('unsupported');
  await page.getByRole('button', { name: b.repair, exact: true }).click();
  await page.keyboard.press('Escape');
  expect(await page.evaluate((key) => localStorage.getItem(key), managementKey)).toBe(
    JSON.stringify({ schema: 99 }),
  );
  expect(await oldBytes(page)).toEqual(before);
});

test('conflicted Journal, Summary and theory cannot expose unrecorded help; explicit reconcile preserves drafts', async ({
  page,
  context,
}, info) => {
  for (const surface of ['journal', 'core-summary', 'management'] as const) {
    await page.goto('/learn/architecture?topic=management-assessment');
    await page
      .getByRole('button', { name: surface === 'journal' ? b.begin : b.retry, exact: true })
      .click();
    const other = await context.newPage();
    await other.goto('/learn/architecture?topic=management-assessment');
    await other
      .getByRole('radio', { name: b.questions.subscription.choices[0][1], exact: true })
      .check();
    await expect(page.locator('.management-lesson .course-storage')).toContainText('conflict');
    const before = await page.evaluate((key) => localStorage.getItem(key), managementKey);
    if (surface === 'journal') {
      await page.getByRole('button', { name: c.journal, exact: true }).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
    } else {
      const link = page
        .locator('.course-architecture-nav')
        .getByRole('link', { name: b.topics[surface], exact: true });
      if (!(await link.isVisible()))
        await page.getByRole('button', { name: c.learning, exact: true }).click();
      await link.click();
      await expect(page.getByRole('heading', { name: b.accessTitle, exact: true })).toBeVisible();
      await expect(
        page.getByText(b.sections.management.paragraphs[0], { exact: true }),
      ).toHaveCount(0);
      await expect(page.getByText(b.notComplete, { exact: true })).toHaveCount(0);
    }
    expect(await page.evaluate((key) => localStorage.getItem(key), managementKey)).toBe(before);
    await capture(page, info, 'conflict-held-' + surface);
    await page
      .getByRole('button', { name: surface === 'journal' ? b.reload : b.accessReload, exact: true })
      .click();
    if (surface === 'journal') {
      await expect(page.getByRole('status').filter({ hasText: b.active })).toContainText(b.unaided);
      await page.getByRole('button', { name: c.journal, exact: true }).click();
      await expect(page.getByRole('dialog')).toContainText(b.scopeTheory[0]);
      await page.keyboard.press('Escape');
    }
    await go(page, 'management-assessment');
    await expect(page.getByRole('status').filter({ hasText: b.active })).toContainText(b.assisted);
    await expect(
      page.getByRole('radio', { name: b.questions.subscription.choices[0][1], exact: true }),
    ).toBeChecked();
    for (const [id, criterion] of Object.entries(managementCriteria))
      await page
        .getByRole('radio', {
          name: b.questions[id as keyof typeof managementCriteria].choices.find(
            ([key]) => key === criterion.answer,
          )![1],
          exact: true,
        })
        .check();
    await page.getByRole('button', { name: b.submit, exact: true }).click();
    await expect(page.locator('.pa-feedback')).toContainText(b.assisted);
    await other.close();
  }
  await page.getByRole('button', { name: b.retry, exact: true }).click();
  await page.getByRole('button', { name: c.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(b.scopeTheory[0]);
  const other = await context.newPage();
  await other.goto('/learn/architecture?topic=management-assessment');
  await other
    .getByRole('radio', { name: b.questions.subscription.choices[0][1], exact: true })
    .check();
  await expect(page.getByRole('dialog')).toContainText(b.accessText);
  await expect(page.getByRole('dialog').getByText(b.scopeTheory[0], { exact: true })).toHaveCount(
    0,
  );
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: b.reload, exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: b.active })).toContainText(b.assisted);
  await other.close();
  await audit(page);
});

test('shared Core teaching and Journal shield every active or uncertain independent context', async ({
  browser,
}, info) => {
  for (const fixture of activeTeachingContexts()) {
    const context = await browser.newContext({ baseURL: info.project.use.baseURL });
    const first = await context.newPage();
    await first.goto('/');
    await first.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
      key: fixture.key,
      raw: fixture.raw,
    });
    await first.reload();
    const other = await context.newPage();
    await other.goto('/');
    const newer = JSON.stringify(JSON.parse(fixture.raw), null, 2);
    await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
      key: fixture.key,
      raw: newer,
    });
    const entry = first
      .locator('.course-navigation')
      .getByRole('link', { name: a.title, exact: true });
    if (!(await entry.isVisible()))
      await first.getByRole('button', { name: c.learning, exact: true }).click();
    await entry.click();
    await expect(first.getByRole('heading', { name: b.accessTitle, exact: true })).toBeVisible();
    await expect(
      first.getByText(a.sections.datacenters.paragraphs[0], { exact: true }),
    ).toHaveCount(0);
    await first.getByRole('button', { name: c.journal, exact: true }).click();
    if (fixture.key === managementKey) await expect(first.getByRole('dialog')).toHaveCount(0);
    else {
      await expect(first.getByRole('dialog')).toContainText(b.accessText);
      await expect(
        first.getByRole('dialog').getByText(a.sections.zones.paragraphs[0], { exact: true }),
      ).toHaveCount(0);
      await first.keyboard.press('Escape');
    }
    expect(await first.evaluate((key) => localStorage.getItem(key), fixture.key)).toBe(newer);
    await first
      .getByRole('button', {
        name: fixture.key === physicalKey ? a.reload : b.accessReload,
        exact: true,
      })
      .click();
    await expect(
      first.getByText(a.sections.datacenters.paragraphs[0], { exact: true }),
    ).toBeVisible();
    await expect
      .poll(
        async () =>
          fixture.state(await first.evaluate((key) => localStorage.getItem(key), fixture.key))
            .assisted,
      )
      .toBe(true);
    await first.getByRole('button', { name: c.journal, exact: true }).click();
    await expect(first.getByRole('dialog')).toContainText(a.sections.zones.paragraphs[0]);
    await expect(first.getByRole('dialog')).toContainText(b.scopeTheory[0]);
    await first.keyboard.press('Escape');
    await first.reload();
    expect(
      fixture.state(await first.evaluate((key) => localStorage.getItem(key), fixture.key)).assisted,
    ).toBe(true);
    await context.close();
  }
});

test('conflicted Part A cannot read common Journal, while own independent form and immutable first remain valid', async ({
  page,
  context,
}, info) => {
  await page.goto('/learn/architecture?topic=assessment');
  await page.getByRole('button', { name: a.begin, exact: true }).click();
  const other = await context.newPage();
  await other.goto('/learn/architecture?topic=assessment');
  await other.locator('input[name="physical-zoneDesign"][value="apps"]').check();
  await expect(page.locator('.physical-lesson .course-storage')).toContainText('conflict');
  await page.getByRole('button', { name: c.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(b.accessText);
  await expect(
    page.getByRole('dialog').getByText(a.sections.zones.paragraphs[0], { exact: true }),
  ).toHaveCount(0);
  await capture(page, info, 'part-a-conflict-held-journal');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: a.reload, exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: a.active })).toContainText(a.unaided);
  await expect(page.locator('input[name="physical-zoneDesign"][value="apps"]')).toBeChecked();
  for (const [id, criterion] of Object.entries(physicalCriteria)) {
    const matching = page.getByRole('combobox', {
      name: a.questions[id as keyof typeof physicalCriteria].label,
      exact: true,
    });
    if (await matching.count()) await matching.selectOption(criterion.answer);
    else await page.locator(`input[name="physical-${id}"][value="${criterion.answer}"]`).check();
  }
  await page.getByRole('button', { name: a.submit, exact: true }).click();
  await expect(page.locator('.pa-feedback')).toContainText(a.unaided);
  const first = await page.evaluate((key) => localStorage.getItem(key), physicalKey);
  await page.getByRole('button', { name: a.retry, exact: true }).click();
  await page.getByRole('button', { name: c.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(a.sections.zones.paragraphs[0]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('status').filter({ hasText: a.active })).toContainText(a.assisted);
  const now = await page.evaluate((key) => localStorage.getItem(key), physicalKey);
  expect(JSON.parse(now!).events.slice(0, JSON.parse(first!).events.length)).toEqual(
    JSON.parse(first!).events,
  );
  await other.close();
  await audit(page);
});

test('stale own A/B feedback is withheld when another tab starts retry; help and immutable first remain honest', async ({
  browser,
}, info) => {
  for (const part of ['physical', 'management'] as const) {
    const context = await browser.newContext({ baseURL: info.project.use.baseURL });
    const page = await context.newPage(),
      text = part === 'physical' ? a : b,
      key = part === 'physical' ? physicalKey : managementKey,
      path =
        '/learn/architecture?topic=' +
        (part === 'physical' ? 'assessment' : 'management-assessment'),
      criteria = part === 'physical' ? physicalCriteria : managementCriteria,
      questions = (part === 'physical' ? a.questions : b.questions) as Record<
        string,
        { label: string }
      >;
    await page.goto(path);
    await page.getByRole('button', { name: text.begin, exact: true }).click();
    for (const [id, criterion] of Object.entries(criteria)) {
      const combo = page.getByRole('combobox', { name: questions[id]!.label, exact: true });
      if (await combo.count()) await combo.selectOption(criterion.answer);
      else await page.locator(`input[name="${part}-${id}"][value="${criterion.answer}"]`).check();
    }
    await page.getByRole('button', { name: text.submit, exact: true }).click();
    await expect(page.locator('.pa-feedback')).toContainText(text.unaided);
    const first = await page.evaluate((key) => localStorage.getItem(key), key);
    const other = await context.newPage();
    await other.goto(path);
    await other.getByRole('button', { name: text.retry, exact: true }).click();
    await expect(page.locator('.physical-lesson .course-storage')).toContainText('conflict');
    await expect(page.locator('.pa-feedback')).toHaveCount(0);
    await expect(other.getByRole('status').filter({ hasText: text.active })).toContainText(
      text.unaided,
    );
    await page.getByRole('button', { name: text.reload, exact: true }).click();
    await expect(page.locator('.pa-feedback')).toHaveCount(0);
    await page.getByRole('button', { name: c.journal, exact: true }).click();
    await expect(page.getByRole('dialog')).toContainText(b.scopeTheory[0]);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('status').filter({ hasText: text.active })).toContainText(
      text.assisted,
    );
    await page.reload();
    await expect(page.getByRole('status').filter({ hasText: text.active })).toContainText(
      text.assisted,
    );
    const after = await page.evaluate((key) => localStorage.getItem(key), key);
    expect(JSON.parse(after!).events.slice(0, JSON.parse(first!).events.length)).toEqual(
      JSON.parse(first!).events,
    );
    await context.close();
  }
});

test('maximum supported group inventory remains one live readable hierarchy across desktop widths', async ({
  page,
}, info) => {
  const memory = new Map<string, string>(),
    store = new SandboxStore({
      getItem: (k) => memory.get(k) ?? null,
      setItem: (k, v) => {
        memory.set(k, v);
      },
      removeItem: (k) => {
        memory.delete(k);
      },
    });
  store.load();
  let serial = 0;
  const command = (value: Record<string, string>) => {
    const accepted = store.dispatch({
      kind: 'command',
      request: {
        commandId: 'dense-' + serial++,
        expectedWorldRevision: store.getSnapshot().attempt.engine.world.revision,
        command: value,
      },
    });
    expect(accepted).toBe(true);
    const receipt = store.getSnapshot().attempt.engine.ledger.at(-1)!.receipt;
    expect(receipt.outcome, JSON.stringify({ value, receipt })).toBe('accepted');
  };
  for (let i = 0; i < 8; i++) {
    command({
      type: 'CreateGroup',
      subscriptionId: i % 2 ? 'sub-shared' : 'sub-app',
      name: 'rg-organization-' + i,
      metadataRegion: 'norwayeast',
    });
    const g = store.getSnapshot().attempt.engine.world.groups.at(-1)!;
    command({
      type: 'CreatePlan',
      groupId: g.id,
      name: 'plan-organization-' + i,
      region: 'westeurope',
      profile: 'linux-learning-v1',
    });
    const plan = store.getSnapshot().attempt.engine.world.resources.at(-1)!;
    command({
      type: 'CreateWebApp',
      groupId: g.id,
      name: 'app-organization-' + i,
      planId: plan.id,
    });
    if (i === 0)
      command({
        type: 'CreateVmBundle',
        groupId: g.id,
        name: 'vm-dense',
        region: 'northeurope',
        image: 'ubuntu-22-04',
        profile: 'small',
        dataDiskGiB: '32',
        subnetId: '',
      });
  }
  await page.addInitScript(({ key, raw }) => localStorage.setItem(key, raw), {
    key: sandboxKey,
    raw: store.exportSnapshot(),
  });
  await page.goto('/learn/architecture?topic=hierarchy');
  await expect(page.locator('.ma-tree')).toContainText('app-organization-7');
  await expect(page.locator('[data-icon-missing]')).toHaveCount(0);
  await page
    .locator('.ma-tree')
    .getByRole('button', { name: 'rg-organization-0', exact: true })
    .click();
  await expect(page.locator('.ma-inspector')).toContainText('App Sandbox');
  await page.getByRole('button', { name: b.expand + ': rg-organization-0', exact: true }).click();
  await expect(
    page.locator('.ma-tree').getByRole('button', { name: 'vm-dense', exact: true }),
  ).toBeHidden();
  await page.getByRole('button', { name: b.expand + ': rg-organization-0', exact: true }).click();
  await expect(
    page.locator('.ma-tree').getByRole('button', { name: 'vm-dense', exact: true }),
  ).toBeVisible();
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.locator('.ma-hierarchy-layout').scrollIntoViewIfNeeded();
    await audit(page);
    if (info.project.name === 'desktop-chromium')
      await page.screenshot({
        path: info.outputPath('management-dense-' + width + 'x' + height + '.png'),
      });
  }
  await page.reload();
  expect(await page.evaluate((key) => localStorage.getItem(key), sandboxKey)).toBe(
    store.exportSnapshot(),
  );
  await expect(page.locator('.ma-tree')).toContainText('app-organization-7');
});
