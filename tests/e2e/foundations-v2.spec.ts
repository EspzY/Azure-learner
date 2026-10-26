import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import { v2Criteria, v2Topics, foundationsV2Key } from '../../src/domain/curriculum/foundations-v2';
import { learningKey, freshLearning, applyLearning } from '../../src/domain/curriculum/foundations';
const t = nb.foundationsV2,
  p = nb.portal,
  c = nb.course,
  f = nb.foundations;
test.use({ trace: 'on', video: 'on', actionTimeout: 15000 });
test.setTimeout(180000);
const capture = async (page: Page, info: TestInfo, name: string) =>
  page.screenshot({
    path: info.outputPath(`31b-${name}.png`),
    scale: 'css',
    fullPage: name === 'prediction' || name === 'comparison',
  });
const audit = async (page: Page) =>
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
async function step(page: Page, id: (typeof v2Topics)[number]) {
  await page
    .locator('.course-units')
    .getByRole('link', { name: t.topics[id].title, exact: true })
    .click();
  await expect(page.getByRole('heading', { name: t.topics[id].title, exact: true })).toBeVisible();
}
async function answer(page: Page, topic: keyof typeof t.checkItems, id: string) {
  const check = page.locator('.v2-check');
  const item = t.checkItems[topic];
  await check.getByLabel(item.choices.find(([value]) => value === id)![1], { exact: true }).check();
  await check.getByRole('button', { name: t.check, exact: true }).click();
}
async function area(page: Page, key: 'groups' | 'plans' | 'apps') {
  await page
    .getByRole('navigation', { name: p.navLabel, exact: true })
    .getByRole('link', { name: p.areas[key], exact: true })
    .click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas[key]);
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
}
async function commit(page: Page) {
  await page.locator('[data-guide="review"]').click();
  await page.locator('[data-guide="commit"]').click();
}
test('ordinary root delivers the whole v2 course, preserved objectives, actual lab, exact return and resume', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'desktop-chromium',
    'Desktop-first new composition; retained course mobile regressions run separately.',
  );
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.origin !== new URL(info.project.use.baseURL!).origin || /\.(glb|wav)$/.test(u.pathname))
      external.push(r.url());
  });
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto('/');
    await expect(page).toHaveURL(/\/learn$/);
    await expect(
      page.getByRole('link', { name: nb.foundationsVisuals.reviewAction, exact: true }),
    ).toHaveCount(0);
    await capture(page, info, `${width}-landing`);
    await page
      .getByRole('link', { name: `${c.open}: ${nb.official.computing}`, exact: true })
      .click();
    await expect(page).toHaveURL(/topic=intro-request/);
    await expect(
      page.getByRole('heading', { name: t.topics['intro-request'].title, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(nb.foundations.units.capacity.mechanism, { exact: true }),
    ).toHaveCount(0);
    await expect(page.locator('.proof-server')).toBeVisible();
    await capture(page, info, `${width}-request`);
    await audit(page);
  }
  await page.getByRole('button', { name: nb.foundationsVisuals.send, exact: true }).click();
  await answer(page, 'intro-request', 'browser');
  await expect(page.locator('.v2-check [role=status]')).toHaveText(
    t.checkItems['intro-request'].wrong,
  );
  await answer(page, 'intro-request', 'server');
  await step(page, 'physical-server');
  for (const id of ['ram', 'storage', 'os']) {
    const part = nb.foundationsVisuals.parts.find((p) => p.id === id)!;
    await page.getByRole('button', { name: new RegExp(`^${part.name}`) }).click();
    await expect(page.locator('.proof-part-detail')).toContainText(part.explanation);
  }
  await capture(page, info, 'server');
  await answer(page, 'physical-server', 'storage');
  await step(page, 'virtualization');
  await page.getByLabel(t.vm.a, { exact: true }).selectOption('5');
  await page.getByRole('button', { name: t.vm.apply, exact: true }).click();
  await page.getByLabel(t.vm.b, { exact: true }).selectOption('4');
  await page.getByRole('button', { name: t.vm.apply, exact: true }).click();
  await expect(page.getByRole('status')).toContainText(t.vm.denied);
  await expect(page.getByText(`${t.vm.accepted}: 5 + 3 / 8`, { exact: true })).toBeVisible();
  await capture(page, info, 'virtualization');
  await answer(page, 'virtualization', 'finite');
  await audit(page);
  await step(page, 'provisioning');
  await page.getByRole('button', { name: t.provision.request, exact: true }).click();
  await expect(page.getByRole('status')).toContainText(t.provision.accepted);
  await page.getByLabel(t.provision.available, { exact: true }).uncheck();
  await page.getByRole('button', { name: t.provision.request, exact: true }).click();
  await expect(page.getByRole('status')).toContainText(t.provision.denied);
  await answer(page, 'provisioning', 'control');
  await capture(page, info, 'provisioning');
  await step(page, 'capacity-basics');
  await expect(page.getByText(t.topics['capacity-basics'].detail, { exact: true })).toBeVisible();
  await answer(page, 'capacity-basics', 'unused');
  await step(page, 'v2-capacity');
  await expect(page.getByText(nb.foundationsVisuals.awaiting, { exact: true })).toBeVisible();
  await page.getByLabel(nb.foundationsVisuals.prediction, { exact: true }).fill('9');
  await page.getByRole('button', { name: nb.foundationsVisuals.run, exact: true }).click();
  await expect(page.getByText(nb.foundationsVisuals.correction, { exact: true })).toBeVisible();
  await capture(page, info, 'prediction');
  await page.getByLabel('10 pakker/time', { exact: true }).check();
  await expect(page.getByText(nb.foundationsVisuals.stale, { exact: true })).toBeVisible();
  await page.getByLabel(nb.foundationsVisuals.prediction, { exact: true }).fill('0');
  await page.getByRole('button', { name: nb.foundationsVisuals.run, exact: true }).click();
  await answer(page, 'v2-capacity', 'same-hour');
  await capture(page, info, 'comparison');
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.locator('.v2-lesson-heading').evaluate((el) =>
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 85,
        behavior: 'instant',
      }),
    );
    await page.screenshot({
      path: info.outputPath(`31b-${width}-capacity.png`),
      scale: 'css',
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
  await page.reload();
  await expect(page.locator('.proof-capacity')).toBeVisible();
  // Retain every original later manuscript, actual investigations and their causal answers.
  for (const unit of ['responsibility', 'models', 'placement', 'metering', 'pricing'] as const) {
    await step(page, `v2-${unit}`);
    for (const key of [
      'purpose',
      'mechanism',
      'azure',
      'example',
      'misconception',
      'limits',
    ] as const)
      await expect(
        page.locator('.v2-manuscript').getByText(f.units[unit][key], { exact: true }),
      ).toBeVisible();
    const run = () => page.getByRole('button', { name: f.run, exact: true }).click();
    if (unit === 'models') {
      for (const mode of ['public', 'private', 'hybrid']) {
        await page.getByLabel(f.topology, { exact: true }).selectOption(mode);
        await run();
      }
      await page.getByLabel(f.units.models.answers.private, { exact: true }).check();
    } else if (unit === 'metering') {
      await run();
      await page.getByLabel(f.released, { exact: true }).check();
      await run();
      await page.getByLabel(f.units.metering.answers.allocated, { exact: true }).check();
    } else if (unit === 'pricing') {
      for (const profile of ['steady', 'uncertain'])
        for (const price of ['usage', 'commitment']) {
          await page.getByLabel(f.profile, { exact: true }).selectOption(profile);
          await page.getByLabel(f.billing, { exact: true }).selectOption(price);
          await run();
        }
      await page.getByLabel(f.units.pricing.answers.usage, { exact: true }).check();
    } else {
      await run();
      for (const [i, value] of (unit === 'responsibility'
        ? ['provider', 'customer', 'customer']
        : ['public', 'private', 'hybrid']
      ).entries())
        await page
          .getByLabel((unit === 'responsibility' ? f.responsibilityTasks : f.placements)[i]!, {
            exact: true,
          })
          .selectOption(value);
    }
    await page.getByRole('button', { name: f.check, exact: true }).click();
  }
  await page.getByRole('link', { name: t.summary, exact: true }).click();
  await expect(page.getByText(t.complete, { exact: true })).toBeVisible();
  await step(page, 'resource-bridge');
  await page.getByRole('button', { name: c.startLab, exact: true }).click();
  const coach = page.getByRole('complementary', { name: c.guided, exact: true });
  await expect(page.locator('.portal-training-strip')).toContainText(nb.official.computing);
  await expect(coach).toHaveAttribute('data-step', 'find-groups');
  await expect(page.locator('.guide-target-ring')).toBeVisible();
  await capture(page, info, 'search');
  await page.getByRole('searchbox', { name: p.search, exact: true }).fill('Resource groups');
  await page
    .locator('.portal-search-results a[href^="/portal?"]')
    .filter({ hasText: 'Resource groups' })
    .click();
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await expect(coach).toHaveAttribute('data-step', 'subscription');
  await page.getByRole('combobox', { name: p.subscription, exact: true }).selectOption('sub-app');
  await expect(coach).toHaveAttribute('data-step', 'group-name');
  await page.getByText(nb.resourceNaming.title, { exact: true }).click();
  await expect(page.getByText(nb.resourceNaming.rules, { exact: true })).toBeVisible();
  await page.getByLabel(p.groupName, { exact: true }).fill('teamA');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('norwayeast');
  await capture(page, info, 'group-naming');
  await commit(page);
  await expect(page.locator('h1')).toHaveText('teamA');
  await area(page, 'plans');
  await page.getByRole('combobox', { name: p.group, exact: true }).selectOption({ label: 'teamA' });
  await page.getByLabel(p.name, { exact: true }).fill('plan-denied');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('northeurope');
  await commit(page);
  await expect(coach).toHaveAttribute('data-step', 'inspect-denial');
  await capture(page, info, 'denial');
  await coach.getByRole('button', { name: c.goPolicy, exact: true }).click();
  await area(page, 'plans');
  await expect(page.locator('h1')).not.toHaveText('plan-denied');
  await page.getByRole('combobox', { name: p.group, exact: true }).selectOption({ label: 'teamA' });
  await page.getByLabel(p.name, { exact: true }).fill('plan-v2');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('westeurope');
  await commit(page);
  await area(page, 'apps');
  await page.getByRole('combobox', { name: p.group, exact: true }).selectOption({ label: 'teamA' });
  await page.getByLabel(p.name, { exact: true }).fill('app-v2');
  await page
    .getByRole('combobox', { name: p.plan, exact: true })
    .selectOption({ label: 'plan-v2 · West Europe' });
  await commit(page);
  await coach.getByRole('button', { name: p.areas.architecture, exact: true }).click();
  await page.getByRole('button', { name: p.graph.list, exact: true }).click();
  await page
    .getByRole('button', {
      name: `app-v2 → plan-v2 · ${p.graph.relations['depends-on']}`,
      exact: true,
    })
    .click();
  await expect(coach).toHaveAttribute('data-step', 'complete');
  await capture(page, info, 'architecture');
  await coach.getByRole('link', { name: c.returnCourse, exact: true }).click();
  await expect(page).toHaveURL(/\/learn\/computing\?topic=resource-bridge&activity=debrief$/);
  await expect(page.locator('#lab-debrief')).toBeFocused();
  await expect(page.locator('#lab-debrief')).toContainText('app-v2');
  await capture(page, info, 'debrief');
  await page.reload();
  await expect(page.locator('#lab-debrief')).toContainText('teamA');
  await page.getByRole('link', { name: t.assessment, exact: true }).click();
  await page.getByRole('button', { name: t.beginAssessment, exact: true }).click();
  await expect(page.getByText(t.submitted, { exact: true })).toHaveCount(0);
  await capture(page, info, 'independent');
  const items = [
    ...t.extraItems,
    ...f.transferItems
      .filter((i) => i.id !== 'shortfall')
      .map((item) =>
        item.id === 'commitment' ? { ...item, question: t.commitmentQuestion } : item,
      ),
  ];
  for (const criterion of v2Criteria) {
    const item = items.find((i) => i.id === criterion.id)!;
    if (criterion.id === 'shortfall')
      await page.getByLabel(item.question, { exact: true }).fill('2');
    else
      await page
        .getByRole('group', { name: item.question, exact: true })
        .getByLabel(item.choices.find(([id]) => id === criterion.answer)![1], { exact: true })
        .check();
  }
  await page.reload();
  await expect(page.getByLabel(t.extraItems[0]!.question, { exact: true })).toHaveValue('2');
  await page.getByRole('button', { name: t.sendAnswers, exact: true }).click();
  await expect(page.getByText(t.first, { exact: true })).toBeVisible();
  await audit(page);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
test('v1 choice, old deep links and active answers survive; new evidence is isolated and keyboard journal restores focus', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'desktop-chromium',
    'Existing smaller-screen safeguards run in course regression.',
  );
  let old = applyLearning(freshLearning(), { kind: 'visit', unit: 'models' })!;
  old = applyLearning(old, { kind: 'begin-transfer' })!;
  old = applyLearning(old, { kind: 'draft', answers: { shortfall: '3' } })!;
  const raw = JSON.stringify(old);
  await page.addInitScript(
    ({ key, raw }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, raw);
    },
    { key: learningKey, raw },
  );
  await page.goto('/learn/computing');
  await expect(page.getByRole('heading', { name: t.chooseTitle, exact: true })).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), learningKey)).toBe(raw);
  await page.getByRole('button', { name: t.keepV1, exact: true }).click();
  await expect(page).toHaveURL(/topic=assessment/);
  await expect(
    page.getByLabel(f.transferItems.find((i) => i.id === 'shortfall')!.question, { exact: true }),
  ).toHaveValue('3');
  await page.getByRole('button', { name: t.switchV2, exact: true }).click();
  await expect(page).toHaveURL(/topic=intro-request/);
  await expect(
    page.getByRole('heading', { name: t.topics['intro-request'].title, exact: true }),
  ).toBeVisible();
  const preserved = JSON.parse(
    (await page.evaluate((key) => localStorage.getItem(key), learningKey))!,
  );
  expect(preserved.events.slice(0, old.events.length)).toEqual(old.events);
  expect(preserved.events.at(-1).kind).toBe('aid');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: c.journal, exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: c.journal, exact: true })).toBeFocused();
  await page.goto('/learn/computing?topic=capacity');
  await expect(page.getByText(t.legacy, { exact: true })).toBeVisible();
  await expect(page.getByText(f.units.capacity.mechanism, { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      (key) =>
        JSON.parse(localStorage.getItem(key)!).events.filter(
          (e: { kind: string }) => e.kind === 'submit',
        ).length,
      foundationsV2Key,
    ),
  ).toBe(0);
});
