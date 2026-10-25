import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import { unitIds } from '../../src/domain/curriculum/manifest';
const c = nb.course,
  p = nb.portal;
test.use({ trace: 'on', video: 'on', actionTimeout: 15000 });
test.setTimeout(180000);
const coach = (page: Page) => page.getByRole('complementary', { name: c.guided, exact: true });
async function capture(page: Page, info: TestInfo, name: string) {
  await page.screenshot({ path: info.outputPath(`course-${name}.png`), scale: 'css' });
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
test('course owns full theory, guided real controls, denial investigation, hosting, exact debrief and independent handoff', async ({
  page,
}, info) => {
  const errors: string[] = [],
    external: string[] = [],
    game: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.origin !== 'http://127.0.0.1:3000') external.push(r.url());
    if (/\.(glb|wav)(\?|$)|\/game\//.test(u.pathname)) game.push(r.url());
  });
  await page.goto('/');
  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByRole('heading', { name: c.title, exact: true })).toBeVisible();
  await expect(page.locator('.course-syllabus li').nth(0)).toContainText(nb.official.computing);
  await expect(page.locator('.course-syllabus li').nth(1)).toContainText(c.planned);
  await expect(page.locator('.course-syllabus li').nth(2)).toContainText(nb.official.services);
  await capture(page, info, 'landing');
  await audit(page);
  await page.getByRole('link', { name: `${c.open}: ${nb.official.services}`, exact: true }).click();
  await expect(page).toHaveURL(/\/learn\/services\?topic=overview/);
  await expect(
    page.getByText(nb.portal.lesson.sections.overview.mechanism, { exact: true }),
  ).toBeVisible();
  await capture(page, info, 'theory');
  const model = page.locator('.portal-model-choice');
  await model.getByRole('button', { name: /IAAS/ }).click();
  await expect(
    page.locator('.portal-layer-stack button').filter({ hasText: nb.expedition.layers.os.label }),
  ).toContainText(p.responsibility.customer);
  await model.getByRole('button', { name: /PAAS/ }).click();
  await expect(
    page.locator('.portal-layer-stack button').filter({ hasText: nb.expedition.layers.os.label }),
  ).toContainText(p.responsibility.microsoft);
  await model.getByRole('button', { name: /SAAS/ }).click();
  await capture(page, info, 'responsibility');
  await audit(page);
  await page.goto('/learn/services?topic=selection');
  const cases = page.locator('.portal-guided-case');
  await cases
    .first()
    .getByRole('combobox', { name: nb.portal.lesson.model, exact: true })
    .selectOption('saas');
  await cases
    .first()
    .getByRole('combobox', { name: nb.portal.lesson.reason, exact: true })
    .selectOption('ready-service');
  await cases.first().getByRole('button', { name: nb.portal.lesson.check, exact: true }).click();
  await expect(cases.first().getByRole('status')).toContainText(nb.portal.lesson.incorrect);
  await page
    .getByRole('navigation', { name: c.next, exact: true })
    .getByRole('link', { name: new RegExp(c.next) })
    .click();
  await expect(page).toHaveURL(/topic=practice/);
  await expect(page.getByText(c.labBridge, { exact: true })).toBeVisible();
  await page.getByRole('heading', { name: c.labTitle, exact: true }).scrollIntoViewIfNeeded();
  await capture(page, info, 'lab-introduction');
  await page.getByRole('button', { name: c.startLab, exact: true }).click();
  await expect(coach(page)).toHaveAttribute('data-step', 'find-groups');
  await expect(page.locator('.guide-target-ring')).toBeVisible();
  await capture(page, info, 'search-highlight');
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
  await page.getByRole('link', { name: c.returnCourse, exact: true }).first().click();
  await expect(page).toHaveURL(/\/learn\/services\?topic=practice/);
  await expect(page).toHaveURL(/&activity=lab$/);
  await expect(page.getByRole('status').filter({ hasText: c.unfinished })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: c.resumeLab, exact: true }).click();
  await expect(coach(page)).toHaveAttribute('data-step', 'create-plan');
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
  await coach(page).getByRole('button', { name: c.goPolicy, exact: true }).click();
  await expect(page.locator('h1')).toHaveText(p.areas.policy);
  await expect(page.locator('.portal-view')).toContainText('West Europe');
  await expect(coach(page)).toHaveAttribute('data-step', 'create-plan');
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
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('lab-debrief');
  await expect(page.locator('#lab-debrief')).toBeFocused();
  await expect(page).toHaveURL(/\/learn\/services\?topic=practice/);
  await expect(page.getByRole('heading', { name: c.debrief, exact: true })).toBeVisible();
  await page.getByRole('heading', { name: c.debrief, exact: true }).scrollIntoViewIfNeeded();
  await page.getByLabel(c.reflectionProvider, { exact: true }).check();
  await page.getByRole('button', { name: c.checkReflection, exact: true }).click();
  await expect(page.getByText(c.reflectionWrong, { exact: true })).toBeVisible();
  await page.getByLabel(c.reflectionData, { exact: true }).check();
  await page.getByRole('button', { name: c.checkReflection, exact: true }).click();
  await expect(page.getByText(c.reflectionCorrect, { exact: true })).toBeVisible();
  await capture(page, info, 'debrief');
  await audit(page);
  await page.goBack();
  await expect(coach(page)).toHaveAttribute('data-step', 'complete');
  await page.goForward();
  await expect(page.getByRole('heading', { name: c.debrief, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: c.debrief, exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.startIndependent, exact: true }).click();
  await expect(page.locator('.portal-challenge')).toBeVisible();
  await expect(coach(page)).toHaveCount(0);
  await page.getByRole('button', { name: p.challenge.start, exact: true }).click();
  await capture(page, info, 'independent');
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  expect(game).toEqual([]);
});
test('keyboard, reduced motion, target lifecycle, resize, journal focus and invalid context stay honest', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learn/services?topic=practice');
  await page.getByRole('button', { name: c.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: c.journal, exact: true })).toBeFocused();
  await page.getByRole('button', { name: c.startLab, exact: true }).focus();
  await expect(page.getByRole('button', { name: c.startLab, exact: true })).toHaveAttribute(
    'data-world-ready',
    'true',
  );
  await expect(page.getByRole('button', { name: c.startLab, exact: true })).toHaveAttribute(
    'data-course-ready',
    'true',
  );
  await expect(page.getByRole('button', { name: c.startLab, exact: true })).toHaveAttribute(
    'data-course-issue',
    '',
  );
  await expect(page.getByRole('button', { name: c.startLab, exact: true })).toBeEnabled();
  await page.getByRole('button', { name: c.startLab, exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(coach(page)).toHaveAttribute('data-step', 'find-groups');
  const search = page.locator('[data-guide="search"]');
  await expect(page.locator('.guide-target-ring')).toBeVisible();
  const ring = await page.locator('.guide-target-ring').boundingBox(),
    target = await search.boundingBox();
  expect(Math.abs(ring!.x - target!.x)).toBeLessThanOrEqual(5);
  await search.evaluate((el) => ((el as HTMLElement).style.display = 'none'));
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  await expect(coach(page)).toContainText(c.missing);
  await search.evaluate((el) => ((el as HTMLElement).style.display = ''));
  await expect(page.locator('.guide-target-ring')).toBeVisible();
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator('.guide-target-ring')).toBeVisible();
  await capture(page, info, 'short-guidance');
  await audit(page);
  await search.focus();
  await page.keyboard.type('Resource groups');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(coach(page)).toHaveAttribute('data-step', 'create-group');
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page.locator('[data-guide="region"]').scrollIntoViewIfNeeded();
  await capture(page, info, 'mobile-guidance');
  await audit(page);
  await page.goto('/learn');
  await expect(page.getByRole('link', { name: c.resume, exact: true })).toHaveAttribute(
    'href',
    '/learn/services?topic=practice&activity=lab',
  );
  await page.evaluate(() =>
    localStorage.setItem('azurelab.course.v1', '{"schema":1,"complete":true}'),
  );
  await page.reload();
  await expect(page.getByText(new RegExp(c.storeIssue))).toBeVisible();
  await expect(page.getByText(c.satisfied, { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: c.clear, exact: true }).click();
  await expect(page.getByRole('link', { name: c.begin, exact: true })).toBeVisible();
});
test('original computing investigations, direct module access, tablet/narrow navigation and missing mascot remain usable', async ({
  page,
  request,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/mascot/savvy-shark-default.png', (r) => r.abort());
  await page.goto('/learn/services?topic=overview');
  await expect(page.locator('.portal-manuscript')).toHaveCount(1);
  await expect(page.locator('.portal-manuscript')).toContainText(
    nb.portal.lesson.sections.overview.mechanism,
  );
  await expect(page.locator('.savvy').first()).toContainText(c.assistant);
  await page.goto('/learn/computing?topic=capacity');
  await page.setViewportSize({ width: 1024, height: 768 });
  for (const unit of unitIds) {
    await page.goto(`/learn/computing?topic=${unit}`);
    await expect(page.locator('.portal-manuscript')).toHaveCount(1);
    await expect(page.locator('.portal-manuscript')).toContainText(
      nb.foundations.units[unit].mechanism,
    );
    await expect(page.getByRole('button', { name: nb.foundations.run, exact: true })).toBeVisible();
  }
  await capture(page, info, 'tablet-computing');
  await audit(page);
  await page.goto('/learn');
  await expect(page.locator('.course-syllabus li').first()).toContainText(
    `${c.computingProgress}: 0 / 6`,
  );
  await expect(page.getByRole('link', { name: c.resume, exact: true })).toHaveAttribute(
    'href',
    '/learn/computing?topic=pricing',
  );
  await page.setViewportSize({ width: 320, height: 740 });
  await capture(page, info, 'narrow-course');
  await audit(page);
  expect((await request.get('/learn/benefits')).status()).toBe(404);
  await page.goto('/portal?lab=web-platform');
  await expect(coach(page)).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.goto('/portal?area=challenge');
  await page.getByRole('button', { name: p.challenge.start, exact: true }).click();
  await page.goto('/learn');
  await expect(page.getByRole('link', { name: p.continueChallenge, exact: true })).toHaveAttribute(
    'href',
    '/portal?area=challenge&course=1&module=services&topic=practice',
  );
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('azurelab.portal.learning.v1')!).events.some(
        (e: { kind: string }) => e.kind === 'aid',
      ),
    ),
  ).toBe(false);
  await page.goto('/learn/services?topic=paas');
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem('azurelab.portal.learning.v1')!).events.some(
          (e: { kind: string }) => e.kind === 'aid',
        ),
      ),
    )
    .toBe(true);
  expect(errors).toEqual([]);
});
