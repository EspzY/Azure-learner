import { expect, test, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import { readingDuration } from '../../src/domain/instruction/playback';
test.use({
  trace: 'on',
  video: 'on',
  launchOptions: {
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--mute-audio',
    ],
  },
});
test.setTimeout(180000);
const t = nb.teaching;
async function begin(page: Page, semantic = false) {
  if (semantic) await page.route('**/game/people/character-female-a.glb', (r) => r.abort());
  await page.goto('/legacy/rpg');
  await expect(page.getByRole('button', { name: 'Ta kontroll', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
}
async function capture(page: Page, info: TestInfo, name: string) {
  await page.screenshot({ path: info.outputPath(`g13-${name}.png`), scale: 'css' });
}
const state = (page: Page) => page.locator('.instruction-controls').first();
const next = (page: Page) => page.getByRole('button', { name: t.skipBeat, exact: true });
async function finish(page: Page) {
  await page.getByRole('button', { name: t.skip, exact: true }).click();
}
test('continuous semantic teaching, readable control, official structure, stale timers and evidence boundaries', async ({
  page,
}, info) => {
  await begin(page, true);
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-renderer', 'failed');
  await page.getByRole('button', { name: 'Samhandle · Ida · skyguide', exact: true }).click();
  await expect(state(page)).toHaveAttribute('data-beat', 'arrival-0');
  await expect(page.locator('.rpg-dialogue-text')).toBeVisible();
  await page.clock.install();
  await page.getByRole('button', { name: t.pause, exact: true }).click();
  await page.clock.fastForward(120000);
  await expect(state(page)).toHaveAttribute('data-beat', 'arrival-0');
  await page.getByText(`${t.speed} · ${t.history}`, { exact: true }).click();
  await page.getByRole('combobox', { name: t.speed, exact: true }).selectOption('180');
  await page.getByRole('checkbox', { name: t.manual, exact: true }).check();
  await page.getByText(`${t.speed} · ${t.history}`, { exact: true }).click();
  await page.getByRole('button', { name: t.next, exact: true }).click();
  await expect(state(page)).toHaveAttribute('data-beat', 'arrival-1');
  await expect(page.locator('.rpg-dialogue-text')).toContainText(nb.official.path);
  await page.getByRole('button', { name: t.previous, exact: true }).click();
  await page.getByText(`${t.speed} · ${t.history}`, { exact: true }).click();
  await page.getByRole('button', { name: t.replay, exact: true }).click();
  await page.getByRole('button', { name: t.history, exact: true }).click();
  await expect(page.getByRole('list', { name: t.history })).toContainText(
    nb.teaching.introduction[0],
  );
  await page.getByRole('button', { name: t.back, exact: true }).click();
  await page.getByRole('checkbox', { name: t.manual, exact: true }).uncheck();
  await page.getByText(`${t.speed} · ${t.history}`, { exact: true }).click();
  await page.getByRole('button', { name: t.resume, exact: true }).click();
  await page.clock.fastForward(readingDuration(t.introduction[0], 180) + 200);
  await expect(state(page)).toHaveAttribute('data-beat', 'arrival-1');
  await page
    .locator('.instruction-references')
    .getByRole('button', { name: nb.foundations.journal, exact: true })
    .click();
  await expect(page.locator('.knowledge-journal')).toBeVisible();
  await page.locator('.knowledge-journal > .curriculum-trail > summary').click();
  await expect(page.locator('.knowledge-journal')).toContainText(nb.official.path);
  await expect(
    page.locator('.knowledge-journal').getByText(nb.official.planned, { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('.knowledge-journal').getByText(nb.official.servicesImplemented, { exact: true }),
  ).toBeVisible();
  await page.clock.fastForward(100000);
  await page.keyboard.press('Escape');
  await expect(state(page)).toHaveAttribute('data-beat', 'arrival-1');
  await next(page).click();
  await next(page).click();
  await expect(page.locator('[data-cue="flow"]')).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await capture(page, info, 'flow-semantic');
  await finish(page);
  await page.getByRole('button', { name: nb.foundations.launch, exact: true }).click();
  await page.getByRole('button', { name: nb.orientation.assisted, exact: true }).click();
  await expect(state(page)).toHaveAttribute('data-sequence', 'cloud-computing-capacity');
  await expect(page.locator('.learning-narration')).toContainText(
    nb.foundations.units.capacity.purpose,
  );
  await next(page).click();
  await next(page).click();
  await expect(page.locator('.instruction-illustration')).toBeVisible();
  await capture(page, info, 'capacity-example');
  await finish(page);
  await expect(
    page.getByRole('button', { name: nb.foundations.check, exact: true }),
  ).toBeDisabled();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('azurelab.learning.foundations.v1')!),
  );
  expect(
    saved.events.some((e: { kind: string }) =>
      ['probe', 'answer', 'submit-transfer'].includes(e.kind),
    ),
  ).toBe(false);
  await page.getByRole('button', { name: nb.foundations.close, exact: true }).click();
  await page.getByRole('button', { name: 'Noor · plattformingeniør', exact: true }).click();
  await page
    .getByRole('button', { name: 'Samhandle · Noor · plattformingeniør', exact: true })
    .click();
  await expect(state(page)).toHaveAttribute('data-beat', 'noor-0');
  // Leave just before Noor's timer expires; it must not advance a new Ida conversation.
  await page.clock.fastForward(readingDuration(t.noor[0], 180) - 500);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Ansvarsverkstedet', exact: true }).click();
  await page.getByRole('button', { name: 'Samhandle · Ansvarsverkstedet', exact: true }).click();
  await page.clock.fastForward(1000);
  await expect(state(page)).toHaveAttribute('data-beat', 'service-0');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Noor · plattformingeniør', exact: true }).click();
  await page
    .getByRole('button', { name: 'Samhandle · Noor · plattformingeniør', exact: true })
    .click();
  const game = await page.evaluate(() => JSON.parse(localStorage.getItem('azurelab.rpg.g1.v1')!));
  expect(game.events.some((e: { kind: string }) => e.kind === 'accept')).toBe(false);
  await finish(page);
  await page.getByRole('button', { name: /Jeg tar oppdraget/ }).click();
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'engineer-accepted');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test('actual spatial synchronized service demonstration is distinct from deliberate learner comparison', async ({
  page,
}, info) => {
  const external: string[] = [],
    errors: string[] = [];
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== 'http://127.0.0.1:3000') external.push(r.url());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await begin(page);
  await page.getByRole('button', { name: nb.rpg.navigate, exact: true }).click();
  await page.getByRole('button', { name: 'Gå til Ida · skyguide', exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', 'guide', {
    timeout: 35000,
  });
  await page.getByRole('button', { name: /Snakk med Ida/ }).click();
  await expect(page.locator('.speaker-anchor[data-bubble="true"]')).toBeVisible();
  await expect(page.locator('.speaker-anchor')).toHaveCSS('opacity', '1');
  const bubbleBounds = await page.locator('.speaker-anchor').boundingBox();
  expect(bubbleBounds!.x).toBeGreaterThanOrEqual(0);
  expect(bubbleBounds!.y).toBeGreaterThanOrEqual(0);
  expect(bubbleBounds!.x + bubbleBounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  await capture(page, info, 'speaker-bubble');
  await next(page).click();
  await next(page).click();
  await next(page).click();
  await expect(page.locator('[data-cue="flow"]')).toBeVisible();
  await capture(page, info, 'flow-spatial');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: nb.rpg.navigate, exact: true }).click();
  await page.getByRole('button', { name: 'Gå til Ansvarsverkstedet', exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', 'installation', {
    timeout: 35000,
  });
  await page.getByRole('button', { name: /Undersøk Ansvarsverkstedet/ }).click();
  await next(page).click();
  await expect(page.locator('[data-cue="iaas"]')).toBeVisible();
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-os-position')))
    .toBeGreaterThan(1);
  await page.getByText(`${t.speed} · ${t.history}`, { exact: true }).click();
  await page.getByRole('combobox', { name: t.speed, exact: true }).selectOption('180');
  await page.getByText(`${t.speed} · ${t.history}`, { exact: true }).click();
  await capture(page, info, 'iaas');
  // Real wall-clock automatic advance in the actual 3D renderer, not fake screenshots.
  await expect(page.locator('[data-cue="paas"]')).toBeVisible({ timeout: 45000 });
  await page.getByRole('button', { name: t.pause, exact: true }).click();
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-os-position')))
    .toBeLessThan(-1);
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-camera-shot', 'demonstration');
  await capture(page, info, 'paas');
  await page.locator('.cinematic-teaching-visual > .curriculum-trail > summary').click();
  await expect(page.locator('.cinematic-teaching-visual .curriculum-trail')).toContainText(
    nb.official.services,
  );
  await page.locator('.cinematic-teaching-visual > .curriculum-trail > summary').click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await next(page).click();
  await next(page).click();
  await expect(page.locator('[data-cue="saas"]')).toBeVisible();
  await capture(page, info, 'saas');
  await next(page).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-camera-shot', 'speaker-close');
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-camera-speaker', 'guide');
  await capture(page, info, 'ida-interprets');
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('azurelab.rpg.g1.v1')!));
  expect(before.events.filter((e: { kind: string }) => e.kind === 'model')).toHaveLength(0);
  await finish(page);
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-camera-shot', 'demonstration');
  await expect(page.getByRole('button', { name: /Prøv teamets beslutning/ })).toBeDisabled();
  await page.getByRole('button', { name: 'IaaS', exact: true }).click();
  await page.getByRole('button', { name: 'PaaS', exact: true }).click();
  await expect(page.getByRole('button', { name: /Prøv teamets beslutning/ })).toBeEnabled();
  await page.getByRole('button', { name: /Prøv teamets beslutning/ }).click();
  await page.getByRole('button', { name: /IaaS · Azure Virtual Machines/ }).click();
  await expect(page.locator('.rpg-dialogue-text')).toContainText('løser ikke ønsket');
  await capture(page, info, 'decision-feedback');
  await page.getByRole('button', { name: nb.foundations.launch, exact: true }).click();
  await page.getByRole('button', { name: nb.orientation.assisted, exact: true }).click();
  await expect(page.locator('.learning-dialogue')).toBeVisible();
  await next(page).click();
  await next(page).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-learning-projection', 'capacity');
  await page.getByRole('button', { name: t.pause, exact: true }).click();
  await capture(page, info, 'capacity-spatial');
  await page.getByRole('button', { name: nb.foundations.close, exact: true }).click();
  await page.getByRole('button', { name: nb.rpg.navigate, exact: true }).click();
  await page.getByRole('button', { name: 'Gå til Noor · plattformingeniør', exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', 'engineer', {
    timeout: 35000,
  });
  await page.getByRole('button', { name: /Snakk med Noor/ }).click();
  await capture(page, info, 'noor-teaches');
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator('.rpg-dialogue-text')).toBeVisible();
  const pause = await page.getByRole('button', { name: t.pause, exact: true }).boundingBox();
  expect(pause!.y).toBeGreaterThanOrEqual(0);
  expect(pause!.y + pause!.height).toBeLessThanOrEqual(390);
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-speaker-x')))
    .toBeLessThan(0.43);
  await capture(page, info, 'short-noor');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
test('local ambient opt-in, controls, persistence and cleanup without learner rewards', async ({
  page,
}, info) => {
  let audioRequests = 0;
  page.on('request', (r) => {
    if (r.url().endsWith('/game/audio/lysningen.wav')) audioRequests++;
  });
  await begin(page);
  expect(audioRequests).toBe(0);
  await page.getByRole('button', { name: nb.rpg.settings, exact: true }).click();
  await page.getByRole('button', { name: t.audio.enable, exact: true }).click();
  await expect(page.getByText(t.audio.ready, { exact: true })).toBeVisible();
  expect(audioRequests).toBe(1);
  await page.getByRole('slider', { name: t.audio.music, exact: true }).fill('0.35');
  await page.getByRole('slider', { name: t.audio.effects, exact: true }).fill('0.1');
  await page.getByRole('checkbox', { name: t.audio.mute, exact: true }).check();
  await expect(page.getByText(t.audio.off, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: t.audio.enable, exact: true }).click();
  expect(audioRequests).toBe(1);
  await capture(page, info, 'audio-controls');
  await page.reload();
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
  await page.getByRole('button', { name: nb.rpg.settings, exact: true }).click();
  await expect(page.getByRole('slider', { name: t.audio.music, exact: true })).toHaveValue('0.35');
  expect(audioRequests).toBe(1);
  await expect(page.getByText(t.audio.off, { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 844, height: 390 });
  const enableBounds = await page
    .getByRole('button', { name: t.audio.enable, exact: true })
    .boundingBox();
  expect(enableBounds!.width).toBeGreaterThan(30);
  await page.route('**/game/audio/lysningen.wav', (r) => r.abort());
  await page.getByRole('button', { name: t.audio.enable, exact: true }).click();
  await expect(page.getByText(t.audio.failed, { exact: true })).toBeVisible();
  await page.getByText(t.audio.failed, { exact: true }).scrollIntoViewIfNeeded();
  const close = await page
    .getByRole('button', { name: nb.universe.close, exact: true })
    .boundingBox();
  expect(close!.y).toBeGreaterThanOrEqual(0);
  expect(close!.y + close!.height).toBeLessThanOrEqual(390);
  await capture(page, info, 'audio-unavailable');
  await page.goto('/progress');
});
