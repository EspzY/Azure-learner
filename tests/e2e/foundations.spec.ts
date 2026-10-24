import { installTeachingSkip } from './helpers/teaching-skip';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
const t = nb.foundations;
test.use({
  actionTimeout: 20000,
  trace: 'on',
  video: 'on',
  launchOptions: {
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  },
});
test.beforeEach(async ({ page }) => {
  await installTeachingSkip(page);
});

test.setTimeout(240000);
async function capture(page: Page, info: TestInfo, name: string) {
  if ((await page.locator('.rpg-world').getAttribute('data-renderer')) === 'webgl')
    await expect(page.locator('.rpg-world')).toHaveAttribute('data-camera-settled', 'true', {
      timeout: 15000,
    });
  await page.screenshot({ path: info.outputPath(`l1-${name}.png`), scale: 'css' });
}
async function begin(page: Page) {
  await page.goto('/legacy/rpg');
  await expect(page.getByRole('button', { name: 'Ta kontroll', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
}
async function startModule(page: Page) {
  await page
    .getByRole('button', { name: 'Orientering og tilgjengelig navigasjon', exact: true })
    .click();
  await page.getByRole('button', { name: 'Gå til Ida · skyguide', exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', 'guide', {
    timeout: 35000,
  });
  await page.getByRole('button', { name: /Snakk med Ida/ }).click();
  await page.getByRole('button', { name: t.launch, exact: true }).click();
  await page.getByRole('button', { name: nb.orientation.assisted, exact: true }).click();
  await expect(page.locator('.learning-dialogue')).toBeVisible({ timeout: 35000 });
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', 'installation');
}
async function run(page: Page) {
  await page.getByRole('button', { name: t.run, exact: true }).click();
}
async function answerTransfer(page: Page, values: string[]) {
  for (const [i, item] of t.transferItems.entries()) {
    if (item.id === 'shortfall')
      await page.getByRole('spinbutton', { name: item.question, exact: true }).fill(values[i]!);
    else await page.locator(`input[name="transfer-${item.id}"][value="${values[i]}"]`).check();
  }
}
async function next(page: Page, id: string) {
  await page.getByRole('button', { name: t.next, exact: true }).click();
  await expect(page.locator('[data-learning-unit]')).toHaveAttribute('data-learning-unit', id);
}
test('complete authored module, causal feedback, changed transfer, replay and persisted legacy evidence', async ({
  page,
}, info) => {
  const external: string[] = [],
    errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== 'http://127.0.0.1:3000') external.push(r.url());
  });
  await page.goto('/legacy-expedition');
  await page.evaluate(() =>
    localStorage.setItem(
      'azurelab.progress.v1',
      JSON.stringify({
        version: 1,
        completed: ['organization-mission-v1', 'organization-check-v1'],
      }),
    ),
  );
  await begin(page);
  await startModule(page);
  await expect(page.getByRole('button', { name: t.next, exact: true })).toBeDisabled();
  await page.getByLabel(t.predict, { exact: true }).fill('9');
  await run(page);
  await expect(page.locator('.learning-result')).toContainText('4');
  await expect(page.locator('.learning-result')).toContainText(`${t.predictionRecorded}: 9`);
  await capture(page, info, 'capacity');
  const z = await page.locator('.rpg-world').getAttribute('data-player-z');
  await page.keyboard.press('w');
  expect(await page.locator('.rpg-world').getAttribute('data-player-z')).toBe(z);
  await page.getByLabel(t.operation, { exact: true }).selectOption('cloud');
  await run(page);
  await page.getByLabel(t.profile, { exact: true }).selectOption('steady');
  await run(page);
  await page.getByLabel(t.operation, { exact: true }).selectOption('owned');
  await run(page);
  await expect(page.locator('.learning-totals')).toContainText('36');
  await page.getByText(t.units.capacity.answers.internet, { exact: true }).click();
  await page.getByRole('button', { name: t.check, exact: true }).click();
  await expect(page.locator('.learning-feedback')).toContainText('Nettverk gir tilgang');
  await page.getByText(t.units.capacity.answers.provisioning, { exact: true }).click();
  await page.getByRole('button', { name: t.check, exact: true }).click();
  await page.getByRole('button', { name: t.detail, exact: true }).click();
  await expect(page.getByRole('heading', { name: t.journal, exact: true })).toBeVisible();
  await expect(page.locator('.knowledge-journal')).toContainText('Virtualisering');
  await capture(page, info, 'journal');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: t.detail, exact: true })).toBeFocused();
  await next(page, 'responsibility');
  await run(page);
  await page.getByLabel(t.responsibilityTasks[0], { exact: true }).selectOption('provider');
  await page.getByLabel(t.responsibilityTasks[1], { exact: true }).selectOption('customer');
  await page.getByLabel(t.responsibilityTasks[2], { exact: true }).selectOption('customer');
  await page.getByRole('button', { name: t.check, exact: true }).click();
  await capture(page, info, 'responsibility');
  await next(page, 'models');
  for (const topology of ['public', 'private', 'hybrid']) {
    await page.getByLabel(t.topology, { exact: true }).selectOption(topology);
    await run(page);
  }
  await capture(page, info, 'hybrid');
  await page.getByText(t.units.models.answers.private, { exact: true }).click();
  await page.getByRole('button', { name: t.check, exact: true }).click();
  await next(page, 'placement');
  await run(page);
  for (const [i, value] of ['public', 'private', 'hybrid'].entries())
    await page.getByLabel(t.placements[i]!, { exact: true }).selectOption(value);
  await page.getByRole('button', { name: t.check, exact: true }).click();
  await next(page, 'metering');
  await run(page);
  await expect(page.locator('.learning-totals')).toContainText('48');
  await page.getByLabel(t.released, { exact: true }).check();
  await run(page);
  await expect(page.locator('.learning-totals')).toContainText('0');
  await page.getByText(t.units.metering.answers.allocated, { exact: true }).click();
  await page.getByRole('button', { name: t.check, exact: true }).click();
  await capture(page, info, 'metering');
  await next(page, 'pricing');
  for (const profile of ['steady', 'uncertain'])
    for (const pricing of ['usage', 'commitment']) {
      await page.getByLabel(t.profile, { exact: true }).selectOption(profile);
      await page.getByLabel(t.billing, { exact: true }).selectOption(pricing);
      await run(page);
    }
  await capture(page, info, 'pricing');
  await page.getByText(t.units.pricing.answers.usage, { exact: true }).click();
  await page.getByRole('button', { name: t.check, exact: true }).click();
  await page.getByRole('button', { name: t.summary, exact: true }).click();
  await expect(page.getByRole('heading', { name: t.guidedComplete, exact: true })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await capture(page, info, 'guided-summary');
  await page.getByRole('button', { name: t.back, exact: true }).click();
  await page.getByRole('button', { name: t.transfer, exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-learning-projection', 'brief');
  await page
    .getByRole('spinbutton', { name: t.transferItems[1]!.question, exact: true })
    .scrollIntoViewIfNeeded();
  await capture(page, info, 'independent-task');
  const correct = [
    'provisioning',
    '5',
    'customer',
    'private',
    'hybrid',
    'allocated',
    'usage',
    'paid',
  ];
  await answerTransfer(
    page,
    correct.map((v, i) => (i === 1 ? '4' : v)),
  );
  await page.getByRole('button', { name: t.submit, exact: true }).click();
  await expect(page.getByText(t.independent, { exact: true })).toBeVisible();
  await expect(page.locator('.learning-transfer')).toContainText('fem udekkede');
  await capture(page, info, 'transfer');
  await page.getByRole('button', { name: t.retry, exact: true }).click();
  await answerTransfer(page, correct);
  await page.getByRole('button', { name: t.submit, exact: true }).click();
  await expect(page.getByText(t.retryResult, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.back, exact: true }).click();
  await page.getByRole('button', { name: t.summary, exact: true }).click();
  await expect(page.locator('.learning-summary dl>div').nth(1)).toContainText(
    `${t.independentLabel}: ${t.pending}`,
  );
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('.arrival-caption')).toContainText(
    nb.orientation.foundationsResumeComplete,
  );
  await expect(page.locator('.arrival-caption')).not.toContainText(nb.orientation.remaining);
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', 'installation', {
    timeout: 15000,
  });
  await page.getByRole('button', { name: /Undersøk Ansvarsverkstedet/ }).click();
  await page.getByRole('button', { name: t.launch, exact: true }).click();
  await page.getByRole('button', { name: nb.orientation.assisted, exact: true }).click();
  await expect(page.locator('[data-learning-unit]')).toHaveAttribute(
    'data-learning-unit',
    'pricing',
  );
  await page.getByRole('button', { name: t.summary, exact: true }).click();
  await expect(page.getByRole('heading', { name: t.guidedComplete, exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.rpg-xp')).toContainText('120');
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('azurelab.learning.foundations.v1')!).events.filter(
          (e: { kind: string }) => e.kind === 'submit',
        ).length,
    ),
  ).toBe(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-camera-shot', 'exploration');
  const beforeMove = Number(await page.locator('.rpg-world').getAttribute('data-player-z'));
  await page.locator('.rpg-viewport').focus();
  await page.keyboard.down('w');
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-player-z')))
    .toBeLessThan(beforeMove - 0.1);
  await page.keyboard.up('w');
  await page.goto('/progress');
  expect(
    await page.evaluate(() => localStorage.getItem('azurelab.learning.foundations.v1')),
  ).not.toBeNull();
  await page.getByRole('button', { name: 'Slett lokal fremgang', exact: true }).click();
  await page.getByRole('button', { name: 'Slett fremgangen nå', exact: true }).click();
  expect(
    await page.evaluate(() => localStorage.getItem('azurelab.learning.foundations.v1')),
  ).toBeNull();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
test('non-WebGL learning, reference assistance, keyboard/reduced motion and contextual journal', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/game/people/character-female-a.glb', (route) => route.abort());
  await begin(page);
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-renderer', 'failed');
  await page.getByRole('button', { name: 'Samhandle · Ida · skyguide', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: t.launch, exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: nb.orientation.assisted, exact: true }).click();
  await expect(page.locator('.learning-dialogue')).toBeVisible();
  await page.getByRole('button', { name: t.transfer, exact: true }).click();
  await page.getByRole('spinbutton', { name: t.transferItems[1]!.question, exact: true }).fill('2');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Ta kontroll', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
  await page.getByRole('button', { name: 'Samhandle · Ida · skyguide', exact: true }).click();
  await page.getByRole('button', { name: t.launch, exact: true }).click();
  await page.getByRole('button', { name: nb.orientation.assisted, exact: true }).click();
  await expect(
    page.getByRole('spinbutton', { name: t.transferItems[1]!.question, exact: true }),
  ).toHaveValue('2');
  await page
    .locator('.learning-dialogue')
    .getByRole('button', { name: t.journal, exact: true })
    .click();
  await expect(page.locator('.knowledge-journal')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByText(t.aid, { exact: true })).toBeVisible();
  const values = [
    'provisioning',
    '5',
    'customer',
    'private',
    'hybrid',
    'allocated',
    'usage',
    'paid',
  ];
  await answerTransfer(page, values);
  await page.getByRole('button', { name: t.submit, exact: true }).click();
  await expect(page.getByText(t.assisted, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.back, exact: true }).click();
  await page.getByRole('button', { name: t.summary, exact: true }).click();
  await expect(page.getByRole('heading', { name: t.incomplete, exact: true })).toBeVisible();
  await page.setViewportSize({ width: 844, height: 390 });
  await capture(page, info, 'short-fallback');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.goto('/explore?chapter=01');
  await page.getByRole('button', { name: t.journal, exact: true }).click();
  await expect(page.locator('.knowledge-journal')).toBeVisible();
  await page.keyboard.press('Escape');
  expect(page.url()).toContain('/explore?chapter=01');
  await page.goto('/legacy-expedition');
  await page.getByRole('button', { name: t.journal, exact: true }).click();
  await expect(page.locator('.knowledge-journal')).toBeVisible();
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
