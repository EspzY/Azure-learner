import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { architectureNb as c, nb, serverlessNb, managementNb } from '../../src/content/nb';
import {
  physicalKey,
  freshPhysical,
  applyPhysical,
  physicalCriteria,
  physicalStudy,
  type PhysicalTopic,
} from '../../src/domain/curriculum/architecture-physical';
import {
  applyServerless,
  freshServerless,
  serverlessKey,
} from '../../src/domain/curriculum/serverless';
test.use({ trace: 'on', video: 'on', actionTimeout: 15000 });
test.setTimeout(120000);
async function audit(page: Page) {
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function protectedBytes(page: Page) {
  return page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(
        ([key]) =>
          ![
            'azurelab.learning.architecture-physical.v1',
            'azurelab.course.v1',
            'azurelab.guidance.milestones.v1',
          ].includes(key),
      ),
    ),
  );
}
async function topic(page: Page, id: PhysicalTopic) {
  const link = page
    .locator('.course-architecture-nav')
    .getByRole('link', { name: c.topics[id], exact: true });
  if (!(await link.isVisible()))
    await page.getByRole('button', { name: nb.course.learning, exact: true }).click();
  await link.click();
  await expect(page.locator('.physical-lesson h2').first()).toHaveText(c.topics[id]);
}
async function select(page: Page, label: string, value: string) {
  await page.getByRole('combobox', { name: label, exact: true }).selectOption(value);
}
async function run(page: Page, prediction = 'serving') {
  await select(page, c.prediction, prediction);
  await page.getByRole('button', { name: c.run, exact: true }).click();
}
async function closeMilestone(page: Page) {
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
}

test('ordinary root → full Part A teaching, three causal witnesses, first partial assessment, Journal and resume', async ({
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
  const before = await protectedBytes(page);
  if (info.project.name === 'desktop-chromium') {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: info.outputPath('physical-course-entry.png') });
    await page.setViewportSize({ width: 1440, height: 900 });
  }
  await page.getByRole('link', { name: c.open, exact: true }).click();
  await expect(page.locator('.physical-lesson h2').first()).toHaveText(c.topics.datacenters);
  await expect(
    page.getByRole('main').getByText(managementNb.available, { exact: false }).first(),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath('physical-current-lesson.png') });
  for (const section of Object.keys(physicalStudy) as (keyof typeof physicalStudy)[]) {
    await topic(page, section);
    await expect(
      page.getByRole('heading', { name: c.sections[section].title, exact: true }),
    ).toBeVisible();
    await page.getByRole('radio', { name: c.sections[section].choices[0][1], exact: true }).check();
  }
  await page.screenshot({ path: info.outputPath('physical-sovereign.png'), fullPage: true });
  await audit(page);
  await topic(page, 'explorer');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.brief.consequence);
  await audit(page);
  await page.keyboard.press('Escape');
  expect(
    await page.evaluate(
      (key) =>
        JSON.parse(localStorage.getItem(key)!).events.some(
          (e: { kind: string }) => e.kind === 'run',
        ),
      physicalKey,
    ),
  ).toBe(false);
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
  await select(page, c.failure, 'none');
  await run(page);
  await expect(page.locator('.pa-observation')).toContainText(c.states.serving);
  await page.screenshot({ path: info.outputPath('physical-normal.png'), fullPage: true });
  await select(page, c.failure, 'datacenter');
  await select(page, c.target, 'norwayeast:a1');
  await run(page);
  await expect(page.getByRole('dialog')).toContainText(c.milestones.loss.title);
  await page.screenshot({ path: info.outputPath('physical-loss-milestone.png') });
  await closeMilestone(page);
  await expect(page.locator('.pa-observation')).toContainText(c.states.unavailable);
  await expect(page.getByRole('button', { name: c.run, exact: true })).toBeFocused();
  await page.screenshot({ path: info.outputPath('physical-single-loss.png'), fullPage: true });
  await select(page, c.placement, 'multi-zone');
  await select(page, c.routing, 'healthy');
  await select(page, c.failure, 'zone');
  await select(page, c.target, 'norwayeast:a');
  await run(page);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.pa-observation')).toContainText(`${c.physical}: 1`);
  await expect(page.locator('.pa-observation')).toContainText(c.states.unavailable);
  await page.screenshot({ path: info.outputPath('physical-dependency-trap.png'), fullPage: true });
  await select(page, c.data, 'replicated');
  await run(page, 'unavailable');
  await expect(page.getByRole('dialog')).toContainText(c.milestones.resilience.title);
  await page.screenshot({ path: info.outputPath('physical-resilience-milestone.png') });
  await page.setViewportSize({ width: 1024, height: 500 });
  const region = page
    .getByRole('dialog')
    .getByRole('region', { name: nb.milestones.reading, exact: true });
  await region.focus();
  await page.keyboard.press('End');
  await expect(
    page.getByRole('dialog').locator('footer').getByRole('button', { name: c.close, exact: true }),
  ).toBeInViewport();
  await page.screenshot({ path: info.outputPath('physical-milestone-short.png') });
  await audit(page);
  await closeMilestone(page);
  await page.getByRole('radio', { name: c.explainChoices[1][1], exact: true }).check();
  await expect(page.getByRole('status').last()).toContainText(c.explainFeedback.pair);
  await page.getByRole('radio', { name: c.explainChoices[0][1], exact: true }).check();
  await expect(page.getByText(c.guidedDone, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByText(c.guidedDone, { exact: true })).toBeVisible();
  const sizes =
    info.project.name === 'desktop-chromium'
      ? [
          [1920, 1080],
          [1440, 900],
          [1366, 768],
          [1024, 768],
          [1024, 500],
        ]
      : [[393, 851]];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.pa-scene').scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`physical-explorer-${width}x${height}.png`) });
    await audit(page);
  }
  const recall = page.getByRole('button', {
    name: `${c.recall} · ${c.milestones.resilience.title}`,
    exact: true,
  });
  await recall.click();
  await closeMilestone(page);
  await topic(page, 'assessment');
  await page.getByRole('button', { name: c.begin, exact: true }).click();
  await expect(page.getByText(c.feedback, { exact: true })).toHaveCount(0);
  await page.locator('input[name="physical-zoneDesign"][value="apps"]').check();
  await page.reload();
  await expect(page.locator('input[name="physical-zoneDesign"][value="apps"]')).toBeChecked();
  for (const [id, criterion] of Object.entries(physicalCriteria)) {
    if (['facility', 'grouping'].includes(id))
      await select(page, c.questions[id as keyof typeof c.questions].label, criterion.answer);
    else
      await page
        .locator(
          `input[name="physical-${id}"][value="${id === 'zoneDesign' ? 'apps' : criterion.answer}"]`,
        )
        .check();
  }
  await page.getByRole('button', { name: c.submit, exact: true }).click();
  await expect(page.locator('.pa-feedback')).toContainText(c.questions.zoneDesign.feedback.apps);
  await page.screenshot({
    path: info.outputPath('physical-assessment-feedback.png'),
    fullPage: true,
  });
  await audit(page);
  const first = await page.evaluate(
    (key) =>
      JSON.parse(localStorage.getItem(key)!).events.find(
        (e: { kind: string }) => e.kind === 'submit',
      ),
    physicalKey,
  );
  await topic(page, 'summary');
  await expect(page.getByText(`${c.criterionCount}: 2/3`, { exact: false })).toBeVisible();
  await expect(page.getByText(c.boundary, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.zones.paragraphs[4]);
  await expect(page.getByRole('dialog')).toContainText(c.sections.sovereign.paragraphs[2]);
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('.physical-lesson h2').first()).toHaveText(c.topics.summary);
  expect(
    await page.evaluate(
      (key) =>
        JSON.parse(localStorage.getItem(key)!).events.find(
          (e: { kind: string }) => e.kind === 'submit',
        ),
      physicalKey,
    ),
  ).toEqual(first);
  expect(await protectedBytes(page)).toEqual(before);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('example regions, no-pair automatic recovery counterexamples, unknown placement and short keyboard layouts', async ({
  page,
}, info) => {
  await page.goto('/learn/architecture?topic=explorer');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
  await select(page, c.geography, 'norway');
  await select(page, c.region, 'norwaywest');
  await expect(page.getByText(c.restricted, { exact: true })).toBeVisible();
  await expect(
    page
      .getByRole('combobox', { name: c.placement, exact: true })
      .locator('option[value="multi-zone"]'),
  ).toHaveJSProperty('disabled', true);
  await select(page, c.geography, 'italy');
  await select(page, c.placement, 'multi-region');
  await select(page, c.secondary, 'westeurope');
  await select(page, c.data, 'replicated');
  await select(page, c.failure, 'region');
  await select(page, c.target, 'italynorth');
  await run(page);
  await expect(page.locator('.pa-observation')).toContainText(c.states.unavailable);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await select(page, c.routing, 'healthy');
  await run(page);
  await closeMilestone(page);
  await expect(page.locator('.pa-observation')).toContainText(c.states.serving);
  await expect(page.getByText(c.crossGeo, { exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath('physical-multiregion.png'), fullPage: true });
  await select(page, c.placement, 'nonzonal');
  await select(page, c.failure, 'zone');
  await select(page, c.target, 'italynorth:a');
  await run(page, 'uncertain');
  await expect(page.locator('.pa-observation')).toContainText(c.states.uncertain);
  await page.screenshot({ path: info.outputPath('physical-unknown.png'), fullPage: true });
  await page.setViewportSize({ width: 1024, height: 500 });
  await page.keyboard.press('Tab');
  await audit(page);
  await page.setViewportSize({ width: 393, height: 851 });
  await audit(page);
  await page.setViewportSize({ width: 1024, height: 768 });
  await page
    .locator('.physical-lesson')
    .evaluate((el) => ((el as HTMLElement).style.zoom = '1.25'));
  await audit(page);
});

test('isolated corrupt/future recovery, once-only history and real cross-tab independent shielding', async ({
  page,
  context,
}) => {
  await page.goto('/');
  const previous = JSON.stringify(
    applyServerless(freshServerless(), { kind: 'visit', topic: 'serverless-concept' }),
  );
  await page.evaluate(
    ({ key, oldKey, old }) => {
      localStorage.setItem(key, 'broken-physical');
      localStorage.setItem(oldKey, old);
    },
    { key: physicalKey, oldKey: serverlessKey, old: previous },
  );
  await page.goto('/portal?area=resources');
  const before = await protectedBytes(page);
  await page.getByRole('button', { name: c.repair, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.repairText);
  await page.keyboard.press('Escape');
  expect(await page.evaluate((key) => localStorage.getItem(key), physicalKey)).toBe(
    'broken-physical',
  );
  await page.getByRole('button', { name: c.repair, exact: true }).click();
  await page.getByRole('button', { name: c.repairConfirm, exact: true }).click();
  await expect(page.locator('[data-guidance-context="uncertain"]')).toHaveCount(0);
  expect(await protectedBytes(page)).toEqual(before);
  await page.evaluate(
    (key) => localStorage.setItem(key, JSON.stringify({ schema: 99 })),
    physicalKey,
  );
  await page.goto('/learn/architecture?topic=datacenters');
  await page.getByRole('button', { name: c.repair, exact: true }).click();
  await page.getByRole('button', { name: c.cancel, exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), physicalKey)).toBe(
    '{"schema":99}',
  );
  await page.getByRole('button', { name: c.repair, exact: true }).click();
  await page.getByRole('button', { name: c.repairConfirm, exact: true }).click();
  await topic(page, 'explorer');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
  await run(page);
  await expect(page.getByRole('dialog')).toBeVisible();
  const other = await context.newPage();
  await other.goto('/learn/architecture?topic=assessment');
  await other.getByRole('button', { name: c.begin, exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByText(c.blocked, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.reload, exact: true }).click();
  await expect(page.getByRole('button', { name: c.run, exact: true })).toBeDisabled();
  await other.getByRole('button', { name: c.reload, exact: true }).click();
  await other.getByRole('button', { name: c.abandon, exact: true }).click();
  await page.getByRole('button', { name: c.reload, exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  // The other tab also moved the shared, navigation-only course context. Recover
  // that independent stale writer through its existing UI before resuming guidance.
  await page.getByRole('button', { name: nb.course.reload, exact: true }).click();
  await expect(page.getByRole('button', { name: c.run, exact: true })).toBeEnabled();
  await page
    .getByRole('button', { name: `${c.recall} · ${c.milestones.loss.title}`, exact: true })
    .click();
  await closeMilestone(page);
  await other.close();
  expect(await page.evaluate((key) => localStorage.getItem(key), serverlessKey)).toBe(previous);
});

test('Part A first/help/retry/abandon survive old theory and Portal navigation without automatic hints', async ({
  page,
}) => {
  await page.goto('/learn/architecture?topic=assessment');
  await page.getByRole('button', { name: c.begin, exact: true }).click();
  await page.locator('input[name="physical-regions"][value="pair-only"]').check();
  await page.goto('/portal?area=resources');
  await expect(page.locator('.guided-lab-coach')).toHaveCount(0);
  expect(
    await page.evaluate(
      (key) =>
        JSON.parse(localStorage.getItem(key)!).events.some(
          (e: { kind: string }) => e.kind === 'aid',
        ),
      physicalKey,
    ),
  ).toBe(false);
  await page.goto('/learn/computing?topic=serverless-hosting');
  await expect(
    page.getByRole('heading', { name: serverlessNb.sections.hosting.title, exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      (key) =>
        JSON.parse(localStorage.getItem(key)!).events.some(
          (e: { kind: string }) => e.kind === 'aid',
        ),
      physicalKey,
    ),
  ).toBe(true);
  await page.goto('/learn/architecture?topic=assessment');
  await expect(page.locator('input[name="physical-regions"][value="pair-only"]')).toBeChecked();
  await expect(page.getByText(c.assisted, { exact: false }).first()).toBeVisible();
  await page.getByRole('button', { name: c.abandon, exact: true }).click();
  await page.getByRole('button', { name: c.retry, exact: true }).click();
  await expect(page.getByText(c.retryLabel, { exact: false })).toBeVisible();
  await page.getByRole('button', { name: c.abandon, exact: true }).click();
  await topic(page, 'summary');
  await expect(page.getByText(`${c.abandoned}: 2`, { exact: true })).toBeVisible();
});

test('final-audit regressions: summary aid, stale recovery and full-history terminal reserve preserve evidence', async ({
  page,
}) => {
  await page.goto('/learn/architecture?topic=assessment');
  const before = await protectedBytes(page);
  await page.getByRole('button', { name: c.begin, exact: true }).click();
  await page.locator('input[name="physical-zoneDesign"][value="apps"]').check();
  await topic(page, 'summary');
  await topic(page, 'assessment');
  await expect(page.locator('.pa-assessment [role="status"]')).toContainText(c.assisted);
  await expect(page.locator('input[name="physical-zoneDesign"][value="apps"]')).toBeChecked();
  for (const [id, rule] of Object.entries(physicalCriteria)) {
    const q = c.questions[id as keyof typeof physicalCriteria];
    if (['facility', 'grouping'].includes(id)) await select(page, q.label, rule.answer);
    else
      await page.locator('input[name="physical-' + id + '"][value="' + rule.answer + '"]').check();
  }
  await page.getByRole('button', { name: c.submit, exact: true }).click();
  await expect(page.locator('.pa-feedback')).toContainText(c.assisted);
  await topic(page, 'summary');
  await expect(page.locator('.pa-objectives section')).toHaveCount(3);
  for (const result of await page.locator('.pa-objectives section').all())
    await expect(result.locator('dd').last()).toHaveText(c.notYet);
  await topic(page, 'assessment');
  // A same-document repair has no storage event: confirmation itself must re-read.
  const valid = JSON.stringify(applyPhysical(freshPhysical(), { kind: 'begin' }));
  await page.evaluate((key) => localStorage.setItem(key, '{broken'), physicalKey);
  await page.reload();
  await page.getByRole('button', { name: c.repair, exact: true }).click();
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: physicalKey,
    raw: valid,
  });
  await page.getByRole('button', { name: c.repairConfirm, exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), physicalKey)).toBe(valid);
  await topic(page, 'assessment');
  await page.getByRole('button', { name: c.abandon, exact: true }).click();
  // At capacity, assistance and a terminal action remain possible without clearing history.
  let full = freshPhysical();
  for (let i = 0; i < 399; i++)
    full = applyPhysical(full, { kind: 'visit', topic: i % 2 ? 'regions' : 'zones' })!;
  full = applyPhysical(full, { kind: 'begin' })!;
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: physicalKey,
    raw: JSON.stringify(full),
  });
  await page.reload();
  await expect(page.getByText(c.limit, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: c.begin, exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: c.abandon, exact: true })).toBeEnabled();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: c.abandon, exact: true }).click();
  await page.reload();
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).events.length, physicalKey),
  ).toBe(402);
  await page.goto('/portal?area=resources');
  await expect(page.locator('[data-guidance-context="uncertain"]')).toHaveCount(0);
  expect(await protectedBytes(page)).toEqual(before);
});
