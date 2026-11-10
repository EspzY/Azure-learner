import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  nb,
  computeNb as c,
  serverlessNb,
  hybridExperienceNb as h,
  refinedAssessmentNb,
} from '../../src/content/nb';
import { sandboxKey } from '../../src/domain/sandbox/store';
import { storageKey } from '../../src/domain/progression';
import { computeKey, computeFacts, restoreCompute } from '../../src/domain/curriculum/compute';
import { refinedKeys, refinedHref } from '../../src/domain/curriculum/refined-assessment';
import { inspectionFixture } from '../fixtures/portal-inspection';

const technical = (page: Page) =>
  page.evaluate(({ world, xp }) => [localStorage.getItem(world), localStorage.getItem(xp)], {
    world: sandboxKey,
    xp: storageKey,
  });
const facts = async (page: Page) =>
  computeFacts(
    restoreCompute(await page.evaluate((k) => localStorage.getItem(k), computeKey)).save,
  );
async function begin(page: Page) {
  await page.getByRole('button', { name: c.labels.begin, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
}
async function seed(page: Page) {
  const f = inspectionFixture();
  await page.addInitScript(
    ({ k, v }) => {
      if (!localStorage.getItem(k)) localStorage.setItem(k, v);
    },
    { k: sandboxKey, v: f.raw },
  );
  return f;
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function axe(page: Page) {
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
}

test('hybrid actual Hub preserves three paths seventeen modules and authoritative Start without fictional completion', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = window as Window & { hybridLayoutShift?: number };
    state.hybridLayoutShift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!shift.hadRecentInput) state.hybridLayoutShift! += shift.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/learn');
  await expect(page.locator('.course-hybrid')).toHaveAttribute('data-course-module', 'hub');
  await expect(page.locator('.learn-hub-path')).toHaveCount(3);
  await expect(page.locator('.learn-hub-module')).toHaveCount(17);
  await expect(page.locator('.learn-hub-start .course-primary')).toHaveAttribute(
    'href',
    '/learn/computing?topic=intro-request',
  );
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  expect(
    await page.evaluate(
      () =>
        (window as Window & { hybridLayoutShift?: number }).hybridLayoutShift ??
        Number.POSITIVE_INFINITY,
    ),
  ).toBeLessThan(0.1);
  const before = await technical(page);
  await page.locator('.learn-hub-module[data-module="compute"] a').click();
  await expect(page).toHaveURL(/learn\/compute/);
  await expect(page.locator('.course-module-header h1')).toHaveText(c.title);
  expect((await facts(page)).guide).toBeUndefined();
  expect(await technical(page)).toEqual(before);
  await page.goBack();
  await expect(page.locator('.learn-hub-path')).toHaveCount(3);
  expect(await technical(page)).toEqual(before);
});

test('Compute reading retains original manuscript examples limits and closed source selection with editorial identity and technical type', async ({
  page,
}) => {
  await page.goto('/learn/compute?topic=vm');
  for (const text of c.sections.vm.paragraphs)
    await expect(page.locator('.compute-theory')).toContainText(text);
  await expect(page.locator('.compute-worked')).toContainText(c.sections.vm.example);
  await expect(page.locator('.compute-boundary').first()).toContainText(c.sections.vm.limit);
  await expect(page.locator('.source-disclosure')).not.toHaveAttribute('open');
  const type = await page.evaluate(async () => {
    await document.fonts.ready;
    const family = (q: string) => getComputedStyle(document.querySelector(q)!).fontFamily;
    return {
      display: family('.course-module-header h1'),
      technical: family('.compute-lesson h2'),
      body: family('.compute-reading p'),
      loaded: document.fonts.status,
    };
  });
  expect(type.display).not.toBe(type.body);
  expect(type.technical).toBe(type.body);
  expect(type.loaded).toBe('loaded');
  await axe(page);
});

test('hybrid Container short-window keyboard result discovery uses accepted stored run and marks changed assumptions without technical writes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 500 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learn/compute?topic=containers');
  const before = await technical(page);
  await page.getByRole('button', { name: c.labels.begin, exact: true }).click();
  await page.getByRole('dialog').press('Escape');
  expect((await facts(page)).guide).toBeUndefined();
  await begin(page);
  await page.getByRole('button', { name: h.hidePortrait, exact: true }).click();
  await expect(page.locator('.compute-workbench .savvy img')).toHaveCount(0);
  await expect(page.locator('.compute-workbench .savvy')).toContainText(c.missions.container.where);
  await page.getByRole('button', { name: h.showPortrait, exact: true }).click();
  await expect(page.locator('.compute-workbench .savvy img')).toHaveAttribute(
    'src',
    '/mascot/savvy-shark-default.png',
  );
  await page.getByRole('combobox', { name: c.labels.predict, exact: true }).selectOption('1');
  await page.getByRole('button', { name: c.labels.run, exact: true }).click();
  const summary = page.locator('.compute-result-summary');
  await expect(summary).toBeInViewport();
  await expect(summary).toBeFocused();
  await expect(summary).toContainText(h.resultReady);
  const inspect = page.getByRole('button', { name: h.inspectResult, exact: true });
  expect(
    await inspect.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
    }),
  ).toBe(true);
  expect((await facts(page)).guide!.runs).toHaveLength(1);
  for (const width of [1024, 800]) {
    await page.setViewportSize({ width, height: 500 });
    await page.getByRole('button', { name: h.inspectResult, exact: true }).click();
    await expect(page.locator('.compute-observation')).toBeFocused();
    const title = page.locator('.compute-observation h4').first();
    await expect(title).toBeInViewport();
    const headerBox = await page.locator('.course-header').boundingBox();
    expect((await title.boundingBox())!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height);
  }
  await page.setViewportSize({ width: 1024, height: 500 });
  await page
    .getByRole('combobox', { name: c.models.container.storage, exact: true })
    .selectOption('external');
  await expect(summary).toContainText(c.labels.configured + ' ≠ ' + c.labels.observed);
  expect((await facts(page)).guide!.runs).toHaveLength(1);
  expect(await technical(page)).toEqual(before);
  await noOverflow(page);
  await axe(page);
});

test('actual Compute Portal inspection follows original VM dependencies receipt and both course returns without a Designlab frame', async ({
  page,
}) => {
  const f = await seed(page);
  await page.goto('/learn/compute?topic=dependencies');
  await begin(page);
  const guide = (await facts(page)).guide!.id,
    before = await technical(page);
  const bridge = page.locator('[data-inspection-context="vm"]');
  await bridge.getByRole('combobox').selectOption(f.vm.id);
  await bridge.getByRole('link').click();
  await expect(page).toHaveURL(/\/portal\?/);
  await expect(page.locator('.portal-title h1')).toHaveText(f.vm.name);
  await expect(page.locator('.ve-review-bar')).toHaveCount(0);
  expect((await page.locator('.portal-header').boundingBox())!.y).toBe(0);
  await page.getByRole('button', { name: c.vmCopy.hide, exact: true }).click();
  await page.locator('.portal-guidance-toggle').click();
  await expect(page.locator('.compute-portal-guide')).toBeVisible();
  await page
    .locator('.portal-resource-menu')
    .getByRole('button', { name: nb.portal.properties, exact: true })
    .click();
  await expect(page).toHaveURL(/view=properties/);
  await page.reload();
  await expect(page.locator('.portal-title h1')).toHaveText(f.vm.name);
  await page.getByRole('link', { name: nb.course.returnCourse, exact: true }).first().click();
  await expect(page).toHaveURL(/learn\/compute\?topic=dependencies/);
  expect((await facts(page)).guide!.id).toBe(guide);
  expect(await technical(page)).toEqual(before);
  await page.goBack();
  await expect(page.locator('.portal-title h1')).toHaveText(f.vm.name);
  await page
    .locator('.compute-portal-guide')
    .getByRole('link', { name: /Tilbake til Compute/ })
    .click();
  await expect(page).toHaveURL(/learn\/compute\?topic=dependencies/);
  expect((await facts(page)).guide!.id).toBe(guide);
  expect(await technical(page)).toEqual(before);
});

test('enhanced normal motion preserves full-opacity text fixed Portal and actionable controls at authored start middle and end', async ({
  page,
}) => {
  await seed(page);
  await page.addInitScript(() => {
    const qa = window as Window & { hybridHoldDestination?: boolean; hybridTargetQueries?: number };
    qa.hybridHoldDestination = true;
    qa.hybridTargetQueries = 0;
    const search = document.querySelector.bind(document);
    document.querySelector = ((selector: string) => {
      if (selector === '.portal[data-area]' && qa.hybridHoldDestination) {
        qa.hybridTargetQueries! += 1;
        return null;
      }
      return search(selector);
    }) as typeof document.querySelector;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      const a = animate.call(this, frames, options);
      if (this.classList.contains('experience-route-mark')) {
        a.pause();
        a.currentTime = 0;
      }
      return a;
    };
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/learn');
  const before = await technical(page);
  await page.locator('.learn-hub-module[data-module="compute"] a').click();
  await expect(page).toHaveURL(/learn\/compute/);
  await page
    .locator('.course-header nav')
    .getByRole('link', { name: nb.course.sandbox, exact: false })
    .click();
  await expect(page.locator('.portal-header')).toBeVisible();
  // Controlled late destination lookup reproduces the independently observed cold
  // Next/Suspense mount gap. The real Portal remains available throughout.
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as Window & { hybridTargetQueries?: number }).hybridTargetQueries ?? 0,
      ),
    )
    .toBeGreaterThan(0);
  expect(
    await page.locator('.experience-route-mark').evaluate((node) => node.getAnimations().length),
  ).toBe(0);
  await page.evaluate(() => {
    (window as Window & { hybridHoldDestination?: boolean }).hybridHoldDestination = false;
    const commit = document.createComment('QA destination commit');
    document.body.appendChild(commit);
    commit.remove();
  });
  await expect(page.locator('.experience-route-mark')).toHaveAttribute('data-running', 'true');
  await expect(page.locator('.experience-route-mark')).toHaveAttribute('data-mode', 'workspace');
  for (const ms of [0, 160, 320]) {
    const style = await page.evaluate((ms) => {
      const mark = document.querySelector('.experience-route-mark')!;
      const a = mark.getAnimations()[0];
      if (!a) throw Error('Expected actual enhanced handoff animation');
      a.currentTime = ms;
      const ancestors = [];
      for (
        let e: Element | null = document.querySelector('.portal-header');
        e;
        e = e.parentElement
      ) {
        const s = getComputedStyle(e);
        ancestors.push([s.opacity, s.transform, s.filter]);
      }
      return {
        ancestors,
        pointer: getComputedStyle(mark).pointerEvents,
        frames: (a.effect as KeyframeEffect).getKeyframes(),
        duration: a.effect!.getTiming().duration,
      };
    }, ms);
    expect(style.pointer).toBe('none');
    expect(style.duration).toBe(320);
    expect(style.ancestors.every(([o, t, f]) => o === '1' && t === 'none' && f === 'none')).toBe(
      true,
    );
    expect(style.frames.every((x) => x.opacity === undefined)).toBe(true);
    expect((await page.locator('.portal-header').boundingBox())!.y).toBe(0);
    await axe(page);
  }
  expect(await technical(page)).toEqual(before);
});

test('hybrid actual Hub and theory retain exact independent resume and denied durable assistance shielding', async ({
  page,
  context,
}) => {
  await seed(page);
  await page.goto(refinedHref('benefits'));
  await page.getByRole('button', { name: refinedAssessmentNb.ui.start, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: refinedAssessmentNb.ui.confirm, exact: true })
    .click();
  await page.locator('[data-refined-item="b-capacity"]').getByRole('textbox').fill('4');
  const raw = await page.evaluate((k) => localStorage.getItem(k), refinedKeys.benefits),
    before = await technical(page);
  await context.addInitScript((k) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, v) {
      if (key === k && JSON.parse(v).events?.at(-1)?.kind === 'aid')
        throw new DOMException('Denied', 'QuotaExceededError');
      return set.call(this, key, v);
    };
  }, refinedKeys.benefits);
  await page.goto('/learn/compute?topic=vm');
  await expect(page.locator('.compute-theory')).toHaveCount(0);
  await expect(page.locator('.course-activity')).toHaveCount(0);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog').locator('.compute-theory')).toHaveCount(0);
  await expect(page.getByRole('dialog').locator('.course-storage').first()).toBeVisible();
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.vm.paragraphs[0]);
  await page.getByRole('dialog').press('Escape');
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start .course-primary')).toHaveAttribute(
    'href',
    refinedHref('benefits'),
  );
  await page.locator('.learn-hub-start .course-primary').click();
  await expect(page).toHaveURL(refinedHref('benefits'));
  await page.reload();
  await expect(page.locator('[data-refined-item="b-capacity"]').getByRole('textbox')).toHaveValue(
    '4',
  );
  expect(await page.evaluate((k) => localStorage.getItem(k), refinedKeys.benefits)).toBe(raw);
  expect(await technical(page)).toEqual(before);
});

test('hybrid desktop compact type keyboard native Journal short-height and reduced motion retain usable real course controls', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learn');
  await expect(page.locator('.course-brand')).toContainText('AzureLab');
  await expect(page.locator('.learn-hub-start .course-primary')).toBeInViewport();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').press('Escape');
  await expect(page.getByRole('button', { name: nb.course.journal, exact: true })).toBeFocused();
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  await expect(page.locator('.course-brand')).toContainText('AzureLab');
  await noOverflow(page);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '';
  });
  await page.setViewportSize({ width: 1024, height: 500 });
  await page.locator('.learn-hub-module[data-module="compute"] a').click();
  expect(
    await page.locator('.experience-route-mark').evaluate((e) => getComputedStyle(e).display),
  ).toBe('none');
  const pathControl = page.locator('button[aria-controls="course-path-architecture"]');
  await pathControl.hover();
  expect(await pathControl.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
    // Owner-authorized presentation replacement: the strict hover equality now
    // uses the exact Bifrost neutral token, pinned by the foundation token tests.
    await pathControl.evaluate((el) => {
      const probe = document.createElement('span');
      probe.style.backgroundColor = 'var(--bfc-neutral-fade)';
      el.append(probe);
      const color = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return color;
    }),
  );
  await noOverflow(page);
  await axe(page);
});
