import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb, serverlessNb as c } from '../../src/content/nb';
import { serverlessKey, serverlessCriteria } from '../../src/domain/curriculum/serverless';
import { freshV2, applyV2, foundationsV2Key } from '../../src/domain/curriculum/foundations-v2';
test.use({ trace: 'on', video: 'on', actionTimeout: 15000 });
test.setTimeout(120000);

test('corrupt supplement has explicit scoped recovery from Portal and course, preserving old bytes', async ({
  page,
}, info) => {
  await page.goto('/');
  const old = JSON.stringify(applyV2(freshV2(), { kind: 'visit', topic: 'intro-request' }));
  await page.evaluate(
    ({ key, oldKey, old }) => {
      localStorage.setItem(key, 'corrupt-serverless');
      localStorage.setItem(oldKey, old);
    },
    { key: serverlessKey, oldKey: foundationsV2Key, old },
  );
  await page.goto('/portal?area=resources');
  const before = await protectedBytes(page);
  await page.getByRole('button', { name: c.repair, exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await expect(page.getByRole('dialog')).toContainText(c.repairText);
  await audit(page);
  await page.screenshot({ path: info.outputPath('serverless-recovery.png') });
  await page.keyboard.press('Escape');
  expect(await page.evaluate((key) => localStorage.getItem(key), serverlessKey)).toBe(
    'corrupt-serverless',
  );
  await page.getByRole('button', { name: c.repair, exact: true }).click();
  await page.getByRole('button', { name: c.repairConfirm, exact: true }).click();
  await expect(page.locator('[data-guidance-context="uncertain"]')).toHaveCount(0);
  expect(await protectedBytes(page)).toEqual(before);
  expect(await page.evaluate((key) => localStorage.getItem(key), serverlessKey)).toBeNull();
  await page.reload();
  expect(await page.evaluate((key) => localStorage.getItem(key), foundationsV2Key)).toBe(old);
  await page.evaluate(
    (key) => localStorage.setItem(key, JSON.stringify({ schema: 99 })),
    serverlessKey,
  );
  await page.goto('/learn/computing?topic=serverless-concept');
  await page.getByRole('button', { name: c.repair, exact: true }).click();
  await page.getByRole('button', { name: c.cancel, exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), serverlessKey)).toBe(
    '{"schema":99}',
  );
  await page.getByRole('button', { name: c.repair, exact: true }).click();
  await page.getByRole('button', { name: c.repairConfirm, exact: true }).click();
  await expect(page.getByRole('button', { name: c.repair, exact: true })).toHaveCount(0);
  expect(await protectedBytes(page)).toEqual(before);
});
async function topic(page: Page, id: string) {
  const link = page
    .locator('.course-units')
    .getByRole('link', { name: c.topics[id as keyof typeof c.topics], exact: true });
  if (!(await link.isVisible()))
    await page.getByRole('button', { name: nb.course.learning, exact: true }).click();
  await link.click();
  await expect(page.locator('.serverless-lesson h2')).toHaveText(
    c.topics[id as keyof typeof c.topics],
  );
}
async function audit(page: Page) {
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function protectedBytes(page: Page) {
  return page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(
        ([k]) =>
          ![
            'azurelab.learning.serverless.v1',
            'azurelab.guidance.milestones.v1',
            'azurelab.course.v1',
          ].includes(k),
      ),
    ),
  );
}
test('root course → complete serverless teaching, prediction, milestone, independent feedback, Journal and resume', async ({
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
  await page
    .getByRole('link', { name: `${nb.course.open}: ${nb.official.computing}`, exact: true })
    .click();
  await expect(
    page.getByRole('heading', {
      name: nb.foundationsV2.topics['intro-request'].title,
      exact: true,
    }),
  ).toBeVisible();
  const before = await protectedBytes(page);
  await topic(page, 'serverless-concept');
  for (const section of ['concept', 'mechanism', 'hosting'] as const) {
    if (section !== 'concept') await topic(page, `serverless-${section}`);
    await expect(
      page.getByRole('heading', { name: c.sections[section].title, level: 3, exact: true }),
    ).toBeVisible();
    await page.getByRole('radio', { name: c.sections[section].choices[0][1], exact: true }).check();
  }
  await page.screenshot({ path: info.outputPath('serverless-hosting.png'), fullPage: true });
  await audit(page);
  await topic(page, 'serverless-explorer');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  let dialog = page.getByRole('dialog');
  await expect(dialog).toContainText(c.brief.why);
  await audit(page);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  expect(
    (
      await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).events, serverlessKey)
    ).some((e: { kind: string }) => e.kind === 'run'),
  ).toBe(false);
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('spinbutton', { name: c.prediction, exact: true }).fill('3');
  await page.getByRole('button', { name: c.run, exact: true }).click();
  dialog = page.getByRole('dialog');
  await expect(dialog).toContainText(c.milestone.title);
  await expect(dialog).toContainText(c.milestone.limit);
  await page.screenshot({ path: info.outputPath('serverless-milestone.png') });
  await page.setViewportSize({ width: 1024, height: 500 });
  const reading = dialog.getByRole('region', { name: nb.milestones.reading, exact: true });
  await reading.focus();
  await page.keyboard.press('End');
  await expect(
    dialog.locator('footer').getByRole('button', { name: c.close, exact: true }),
  ).toBeInViewport();
  await page.screenshot({ path: info.outputPath('serverless-milestone-short.png') });
  await page.setViewportSize({ width: 1440, height: 900 });
  await audit(page);
  await page.keyboard.press('Escape');
  await expect(page.locator('.sl-observation')).toContainText(`${c.observed}: 4`);
  await expect(page.getByRole('button', { name: c.run, exact: true })).toBeFocused();
  await page.getByRole('combobox', { name: c.situation, exact: true }).selectOption('code-error');
  await page.getByRole('spinbutton', { name: c.prediction, exact: true }).fill('2');
  await page.getByRole('button', { name: c.run, exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.sl-observation')).toContainText(`${c.failed}: 1`);
  await page.getByRole('radio', { name: c.guidedChoices[1][1], exact: true }).check();
  await expect(page.getByRole('status').last()).toContainText(
    c.guidedFeedback['trigger-guarantee'],
  );
  await page.getByRole('radio', { name: c.guidedChoices[0][1], exact: true }).check();
  await expect(page.getByText(c.practiceDone, { exact: true })).toBeVisible();
  await page.reload();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText(c.practiceDone, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.milestone.recall, exact: true }).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
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
    await page.locator('.sl-pipeline').scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`serverless-explorer-${width}x${height}.png`) });
    await audit(page);
  }
  await topic(page, 'serverless-assessment');
  await page.getByRole('button', { name: c.begin, exact: true }).click();
  await expect(page.getByText(c.feedback, { exact: true })).toHaveCount(0);
  await page.locator('input[name="webhook"][value="vm"]').check();
  await page.reload();
  await expect(page.locator('input[name="webhook"][value="vm"]')).toBeChecked();
  for (const [id, criterion] of Object.entries(serverlessCriteria))
    await page
      .locator(`input[name="${id}"][value="${id === 'webhook' ? 'vm' : criterion.answer}"]`)
      .check();
  await page.getByRole('button', { name: c.submit, exact: true }).click();
  await expect(page.getByRole('heading', { name: c.feedback, exact: true })).toBeVisible();
  await expect(page.locator('.sl-feedback')).toContainText(c.questions.webhook.feedback.vm);
  const first = await page.evaluate(
    (key) =>
      JSON.parse(localStorage.getItem(key)!).events.find(
        (e: { kind: string }) => e.kind === 'submit',
      ),
    serverlessKey,
  );
  await page.screenshot({
    path: info.outputPath('serverless-independent-feedback.png'),
    fullPage: true,
  });
  await page.getByRole('button', { name: c.retry, exact: true }).click();
  await page.getByRole('button', { name: c.aid, exact: true }).click();
  await expect(page.getByText(c.aidText, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.abandon, exact: true }).click();
  await topic(page, 'serverless-summary');
  await expect(page.getByText(c.independentNo, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.hosting.paragraphs[1]);
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('.serverless-lesson h2')).toHaveText(c.topics['serverless-summary']);
  expect(
    await page.evaluate(
      (key) =>
        JSON.parse(localStorage.getItem(key)!).events.find(
          (e: { kind: string }) => e.kind === 'submit',
        ),
      serverlessKey,
    ),
  ).toEqual(first);
  expect(await protectedBytes(page)).toEqual(before);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('corrupt display history suppresses auto, recall is safe, and second-tab assessment discards open presentation', async ({
  page,
  context,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('azurelab.guidance.milestones.v1', 'unreadable'),
  );
  await page.goto('/learn/computing?topic=serverless-explorer');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('combobox', { name: c.situation, exact: true }).selectOption('cold');
  await page.getByRole('spinbutton', { name: c.prediction, exact: true }).fill('4');
  await page.getByRole('button', { name: c.run, exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByText(c.milestoneStorage, { exact: true })).toBeVisible();
  await page.getByRole('radio', { name: c.guidedChoices[0][1], exact: true }).check();
  await expect(page.getByText(c.practiceRemaining, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.milestone.recall, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const other = await context.newPage();
  await other.goto('/learn/computing?topic=serverless-assessment');
  await other.getByRole('button', { name: c.begin, exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: c.briefOpen, exact: true })).toHaveCount(0);
  await other.getByRole('button', { name: c.abandon, exact: true }).click();
  // The first tab intentionally retains a conflict until safe explicit reload. It never replays the old interruption.
  await page.getByRole('button', { name: c.reload, exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await other.close();
});

test('independent active/conflicted context suppresses coaching, preserves draft and historic data', async ({
  page,
  context,
}) => {
  await page.goto('/learn/computing?topic=serverless-assessment');
  await page.getByRole('button', { name: c.begin, exact: true }).click();
  await page.locator('input[name="agent"][value="vm"]').check();
  await page.goto('/portal?area=resources');
  expect(
    await page.evaluate(
      (key) =>
        JSON.parse(localStorage.getItem(key)!).events.some(
          (e: { kind: string }) => e.kind === 'aid',
        ),
      serverlessKey,
    ),
  ).toBe(false);
  await page.goto('/portal?area=responsibility');
  await expect
    .poll(() =>
      page.evaluate(
        (key) =>
          JSON.parse(localStorage.getItem(key)!).events.some(
            (e: { kind: string }) => e.kind === 'aid',
          ),
        serverlessKey,
      ),
    )
    .toBe(true);
  await page.goto('/learn/computing?topic=serverless-assessment');
  await expect(page.locator('input[name="agent"][value="vm"]')).toBeChecked();
  const other = await context.newPage();
  await other.goto('/learn/computing?topic=serverless-explorer');
  await expect(other.getByRole('button', { name: c.start, exact: true })).toBeDisabled();
  await expect(other.getByRole('button', { name: c.briefOpen, exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.locator('input[name="agent"][value="vm"]')).toBeChecked();
  await other.close();
});
