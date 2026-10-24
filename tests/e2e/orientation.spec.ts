import { installTeachingSkip } from './helpers/teaching-skip';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import {
  freshLearning,
  initialProbe,
  applyLearning,
} from '../../src/domain/curriculum/foundations';
import { freshAttempt, applyEvent } from '../../src/domain/chapter01/scenario';
import { snapshotOf } from '../../src/domain/chapter01/persistence';
import { freshGame } from '../../src/domain/rpg/persistence';
const t = nb.orientation;
test.use({
  trace: 'on',
  video: 'on',
  launchOptions: {
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  },
});
test.beforeEach(async ({ page }) => {
  await installTeachingSkip(page);
});

test.setTimeout(180000);
async function capture(page: Page, info: TestInfo, name: string) {
  if (await page.locator('.rpg-world[data-renderer="webgl"]').count())
    await expect(page.locator('.rpg-world')).toHaveAttribute('data-camera-settled', 'true', {
      timeout: 15000,
    });
  await page.screenshot({ path: info.outputPath(`g12-${name}.png`), scale: 'css' });
}
const log = (page: Page) => page.getByRole('button', { name: t.log, exact: true }).first();
async function control(page: Page) {
  await expect(page.getByRole('button', { name: t.begin, exact: true })).toBeEnabled({
    timeout: 45000,
  });
  await page.getByRole('button', { name: t.begin, exact: true }).click();
}
test('canonical arrival, intentional walking, curriculum bridge, log, resume and browser history', async ({
  page,
}, info) => {
  const external: string[] = [],
    errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== 'http://127.0.0.1:3000') external.push(r.url());
  });
  await page.goto('/');
  await expect(page).toHaveURL(/\/expedition-3d$/);
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: t.intro[0].title, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: t.nextView, exact: true })).toBeEnabled({
    timeout: 45000,
  });
  await capture(page, info, 'first-entry');
  const spawn = await page.locator('.rpg-world').getAttribute('data-player-z');
  await page.getByRole('button', { name: t.nextView, exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-arrival-shot', '1');
  await capture(page, info, 'intro-people');
  await page.getByRole('button', { name: t.nextView, exact: true }).click();
  await expect(page.getByRole('heading', { name: t.intro[2].title, exact: true })).toBeVisible();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-arrival-shot', '2');
  await capture(page, info, 'intro-gateway');
  expect(await page.locator('.rpg-world').getAttribute('data-player-z')).toBe(spawn);
  await control(page);
  await expect(page.locator('.expedition-hud')).toContainText(t.steps.welcome.title);
  await page
    .locator('.expedition-hud')
    .getByRole('button', { name: t.wayfinding, exact: true })
    .click();
  await page.getByRole('button', { name: t.manual, exact: true }).click();
  expect(await page.locator('.rpg-world').getAttribute('data-player-z')).toBe(spawn);
  await page
    .locator('.expedition-hud')
    .getByRole('button', { name: t.wayfinding, exact: true })
    .click();
  await page.getByRole('button', { name: t.assisted, exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-moving', 'true');
  await page.locator('.rpg-viewport').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-moving', 'false');
  expect(Number(await page.locator('.rpg-world').getAttribute('data-player-z'))).toBeGreaterThan(7);
  await capture(page, info, 'guided-navigation');
  await page
    .locator('.expedition-hud')
    .getByRole('button', { name: t.wayfinding, exact: true })
    .click();
  await page.getByRole('button', { name: t.assisted, exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', 'guide', {
    timeout: 35000,
  });
  await page.getByRole('button', { name: /Snakk med Ida/ }).click();
  await expect(page.locator('.rpg-dialogue-text')).toContainText(nb.official.computing);
  await capture(page, info, 'npc-welcome');
  await page.getByRole('button', { name: t.bridge, exact: true }).click();
  await page
    .locator('.expedition-route nav')
    .getByRole('button', { name: new RegExp(t.steps.assignment.title) })
    .click();
  await expect(page.locator('.expedition-log')).toContainText(t.steps.assignment.why);
  await capture(page, info, 'expedition-log');
  await page.getByRole('button', { name: new RegExp(t.changeGoal) }).focus();
  await page.keyboard.press('Tab');
  const evidenceSummary = page
    .locator('.expedition-log > details')
    .filter({ has: page.getByText(t.evidence, { exact: true }) })
    .first()
    .locator('summary')
    .first();
  await expect(evidenceSummary).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await expect(page.locator('.expedition-log').getByText(t.world, { exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.expedition-regions')).toContainText('N01–N04');
  await expect(page.locator('.expedition-regions')).toContainText(t.planned);
  await capture(page, info, 'world-overview');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.locator('.rpg-dialogue')).toBeVisible();
  await page.getByRole('button', { name: nb.foundations.launch, exact: true }).click();
  const before = await page.locator('.rpg-world').getAttribute('data-player-z');
  await expect(page.getByRole('heading', { name: t.travelTitle, exact: true })).toBeVisible();
  expect(await page.locator('.rpg-world').getAttribute('data-player-z')).toBe(before);
  await page.getByRole('button', { name: t.assisted, exact: true }).click();
  await expect(page.locator('.learning-dialogue')).toBeVisible({ timeout: 35000 });
  await page.getByLabel(nb.foundations.predict, { exact: true }).fill('4');
  await page.getByRole('button', { name: nb.foundations.run, exact: true }).click();
  await page.keyboard.press('Escape');
  await capture(page, info, 'active-objective');
  await page.reload();
  await expect(page.getByRole('heading', { name: t.returning, exact: true })).toBeVisible({
    timeout: 45000,
  });
  await expect(page.locator('.arrival-caption')).toContainText(nb.foundations.units.capacity.title);
  await capture(page, info, 'returning');
  await control(page);
  await log(page).click();
  await expect(page.locator('.expedition-evidence').first()).toContainText(t.introduced);
  await page.getByText(t.optional, { exact: true }).click();
  await page.getByRole('button', { name: t.replay, exact: true }).click();
  await expect(page.getByRole('heading', { name: t.intro[0].title, exact: true })).toBeVisible();
  await control(page); // replay/skip never resets the real lesson
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('azurelab.learning.foundations.v1')!).events.some(
        (e: { kind: string }) => e.kind === 'probe',
      ),
    ),
  ).toBe(true);
  await page.goto('/progress');
  await page.getByRole('link', { name: 'AzureLab', exact: true }).first().click();
  await expect(page).toHaveURL(/\/expedition-3d$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/progress$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/expedition-3d$/);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('saved learning and technical work, invalid preferences, semantic orientation and direct portal', async ({
  page,
}, info) => {
  const lesson = applyLearning(applyLearning(freshLearning(), { kind: 'visit', unit: 'models' })!, {
    kind: 'probe',
    unit: 'models',
    input: { ...initialProbe, topology: 'hybrid' },
    prediction: 0,
  })!;
  const attempt = applyEvent(freshAttempt(), {
    kind: 'responsibility',
    model: 'paas',
    os: 'microsoft',
    code: 'customer',
  })!;
  await page.addInitScript(
    ({ lesson, chapter }) => {
      if (!localStorage.getItem('g12-fixture')) {
        localStorage.setItem('azurelab.learning.foundations.v1', JSON.stringify(lesson));
        localStorage.setItem('azurelab.chapter01.guided.v1', JSON.stringify(chapter));
        localStorage.setItem('azurelab.orientation.v1', '{"schema":99,"seen":true,"goal":"fake"}');
        localStorage.setItem('g12-fixture', 'yes');
      }
    },
    { lesson, chapter: snapshotOf(attempt, 1, 1) },
  );
  await page.route('**/game/people/character-female-a.glb', (r) => r.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: t.returning, exact: true })).toBeVisible({
    timeout: 45000,
  });
  await expect(page.locator('.arrival-caption')).toContainText(t.technicalResume);
  await control(page);
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-renderer', 'failed');
  await log(page).click();
  await expect(page.locator('.expedition-detail')).toContainText(t.steps.infrastructure.title);
  await page.getByRole('button', { name: new RegExp(t.changeGoal) }).click();
  await page.getByRole('button', { name: t.assisted, exact: true }).click();
  await page.getByRole('button', { name: 'Samhandle · Infrastrukturporten', exact: true }).click();
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'portal-locked');
  await page.getByRole('button', { name: t.directEntry, exact: true }).click();
  await expect(page).toHaveURL(/from=rpg-g1/);
  await expect(page.locator('.chapter-brief')).toContainText(t.handoff);
  await capture(page, info, 'technical-handoff');
  await page.getByRole('button', { name: t.log, exact: true }).click();
  await expect(page.locator('.expedition-log')).toContainText(t.technicalResume);
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: nb.rpg.returnToWorld, exact: true }).click();
  await control(page);
  await expect(
    page.getByRole('button', { name: 'Infrastrukturporten', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Noor · plattformingeniør', exact: true }).click();
  await page
    .getByRole('button', { name: 'Samhandle · Noor · plattformingeniør', exact: true })
    .click();
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'engineer-progress');
  await capture(page, info, 'unfinished-debrief');
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 844, height: 390 });
  await log(page).click();
  await capture(page, info, 'short-log');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await page.reload();
  await control(page);
  expect(await page.evaluate(() => localStorage.getItem('azurelab.orientation.v1'))).toContain(
    '"schema":99',
  );
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('azurelab.learning.foundations.v1')!).events,
    ),
  ).toHaveLength(2);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('azurelab.chapter01.guided.v1')!).events,
    ),
  ).toHaveLength(1);
  await page.goto('/legacy-expedition');
  await expect(page.locator('.journey-landscape')).toBeVisible();
  await page.getByRole('link', { name: 'AzureLab', exact: true }).first().click();
  await expect(page).toHaveURL(/\/expedition-3d$/);
});

test('older position-only saves receive orientation without restarting or awarding learning', async ({
  page,
}) => {
  const game = { ...freshGame(), pose: { x: 0, z: 9, yaw: Math.PI } };
  await page.addInitScript(
    (game) => localStorage.setItem('azurelab.rpg.g1.v1', JSON.stringify(game)),
    game,
  );
  await page.route('**/game/people/character-female-a.glb', (r) => r.abort());
  await page.goto('/expedition-3d?goal=infrastructure');
  await expect(page.getByRole('heading', { name: t.returning, exact: true })).toBeVisible({
    timeout: 45000,
  });
  await expect(page.getByRole('button', { name: t.nextView, exact: true })).toHaveCount(0);
  await control(page);
  await expect(page).toHaveURL(/\/expedition-3d$/);
  await expect(page.getByRole('heading', { name: t.travelTitle, exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.manual, exact: true }).click();
  await log(page).click();
  await expect(page.locator('.expedition-evidence').first()).not.toContainText(
    t.states['guided-completed'],
  );
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('azurelab.rpg.g1.v1')!).pose.z),
  ).toBe(9);
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('azurelab.rpg.g1.v1')!).events),
  ).toEqual([]);
  expect(
    await page.evaluate(() => localStorage.getItem('azurelab.learning.foundations.v1')),
  ).toBeNull();
});
