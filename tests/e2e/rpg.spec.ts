import { expect, test, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { buildGuided } from './helpers/guided-build';
test.use({
  trace: 'on',
  video: 'on',
  launchOptions: {
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  },
});
test.setTimeout(180_000);
test.describe.configure({ mode: 'default' });
async function capture(page: Page, info: TestInfo, label: string) {
  if (await page.locator('.rpg-webgl .rpg-dialogue').count()) {
    await expect(page.locator('.rpg-world')).toHaveAttribute('data-camera-settled', 'true', {
      timeout: 12000,
    });
  }
  await page.screenshot({
    path: info.outputPath(`rpg-${label}.png`),
    fullPage: true,
    scale: 'css',
  });
}
async function start(page: Page) {
  await page.goto('/expedition-3d');
  await expect(page.getByRole('button', { name: 'Ta kontroll', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-renderer', 'webgl');
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-frames')))
    .toBeGreaterThan(5);
}
async function walkTo(page: Page, label: string, near: string) {
  await page
    .getByRole('button', { name: 'Orientering og tilgjengelig navigasjon', exact: true })
    .click();
  await page.getByRole('button', { name: `Gå til ${label}`, exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', near, { timeout: 35000 });
}
test('rendered composition and local frame measurements', async ({ page }, info) => {
  await start(page);
  await capture(page, info, 'composition');
  await page.keyboard.down('w');
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-player-z')))
    .toBeLessThan(9);
  await page.keyboard.up('w');
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-frames')), {
      timeout: 90000,
    })
    .toBeGreaterThan(240);
  await page.getByRole('button', { name: 'Innstillinger og hjelp', exact: true }).click();
  await page.getByText('Renderingsmåling', { exact: true }).click();
  await expect(page.getByTestId('render-measurement')).toContainText('Trekanter:');
  await expect
    .poll(async () =>
      Number(
        (await page.getByTestId('render-measurement').innerText()).match(/Tegnekall: (\d+)/)?.[1],
      ),
    )
    .toBeGreaterThan(0);
  const measurement = await page.getByTestId('render-measurement').innerText();
  expect(Number(measurement.match(/Tegnekall: (\d+)/)?.[1])).toBeLessThan(120);
  expect(Number(measurement.match(/Trekanter: (\d+)/)?.[1])).toBeLessThan(100000);
  await info.attach('software-rendering-measurement', {
    body: measurement,
    contentType: 'text/plain',
  });
  await capture(page, info, 'measurement');
  const adapted = (await page.locator('.rpg-world').getAttribute('data-dpr')) === '0.85';
  const quality = page.getByRole('combobox', { name: 'Grafikkvalitet', exact: true });
  await expect(quality).toBeVisible();
  await quality.selectOption('high');
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-shadows', 'true');
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-shadow-light', 'true');
  await quality.selectOption('auto');
  if (adapted) {
    await expect(page.locator('.rpg-world')).toHaveAttribute('data-dpr', '0.85');
    await expect(page.locator('.rpg-world')).toHaveAttribute('data-shadows', 'false');
    await expect(page.locator('.rpg-world')).toHaveAttribute('data-shadow-light', 'false');
  }
  await expect
    .poll(
      async () =>
        `${await page.locator('.rpg-world').getAttribute('data-shadows')}|${await page.locator('.rpg-world').getAttribute('data-shadow-light')}`,
    )
    .toMatch(/^(true\|true|false\|false)$/);
});
test('actual 3D movement, locomotion and two authored NPCs form a walkable learning area', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const external: string[] = [];
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== 'http://127.0.0.1:3000') external.push(r.url());
  });
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'azurelab.progress.v1',
      JSON.stringify({
        version: 1,
        completed: ['organization-mission-v1', 'organization-check-v1'],
      }),
    ),
  );
  await start(page);
  await expect(page.locator('.rpg-xp')).toHaveText('120 XP');
  await capture(page, info, 'arrival');
  const initial = Number(await page.locator('.rpg-world').getAttribute('data-player-z'));
  await page.keyboard.down('w');
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-player-z')), {
      timeout: 12000,
    })
    .toBeLessThan(initial - 1.5);
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-animation', 'walk');
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-feet-y')))
    .toBeCloseTo(0.012, 2);
  const leg = await page.locator('.rpg-world').getAttribute('data-leg-angle');
  await expect.poll(() => page.locator('.rpg-world').getAttribute('data-leg-angle')).not.toBe(leg);
  await capture(page, info, 'walking');
  await page.keyboard.up('w');
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-moving', 'false');
  await walkTo(page, 'Ida · skyguide', 'guide');
  await page.getByRole('button', { name: /Snakk med Ida/ }).click();
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'guide-welcome');
  await capture(page, info, 'guide');
  await page.getByRole('button', { name: /Hvorfor trenger vi tjenestemodeller/ }).click();
  await page.getByRole('button', { name: /Hva endres teknisk/ }).click();
  await expect(page.locator('.rpg-dialogue-text')).toContainText('vedlikeholder kunden gjeste-OS');
  await page.getByRole('button', { name: /Vis meg ansvarsverkstedet/ }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', 'installation', {
    timeout: 35000,
  });
  await page.getByRole('button', { name: /Undersøk Ansvarsverkstedet/ }).click();
  await page.getByRole('button', { name: 'IaaS', exact: true }).click();
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-os-position')))
    .toBeGreaterThan(1);
  await page.getByRole('button', { name: 'PaaS', exact: true }).click();
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-os-position')))
    .toBeLessThan(-1);
  await expect(page.locator('.rpg-model-feedback')).toContainText(
    'Microsoft drifter plattformens OS',
  );
  await capture(page, info, 'installation');
  await page.getByRole('button', { name: /Prøv teamets beslutning/ }).click();
  await page.getByRole('button', { name: /IaaS · Azure Virtual Machines/ }).click();
  await expect(page.locator('.rpg-dialogue-text')).toContainText('løser ikke ønsket');
  await page.getByRole('button', { name: /Vurder tjenestevalget på nytt/ }).click();
  await page.getByRole('button', { name: /PaaS · Azure App Service/ }).click();
  await page.getByRole('button', { name: /Hvilket ansvar beholder teamet/ }).click();
  await page.getByRole('button', { name: /Microsoft overtar alt sikkerhetsansvar/ }).click();
  await expect(page.locator('.rpg-dialogue-text')).toContainText('ikke at Microsoft overtar');
  await page.getByRole('button', { name: /Fordel ansvaret på nytt/ }).click();
  await page.getByRole('button', { name: /Egen kode, data, tilgang og konfigurasjon/ }).click();
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'ownership-good');
  await page.getByRole('button', { name: /Jeg vil møte ingeniøren/ }).click();
  await walkTo(page, 'Noor · plattformingeniør', 'engineer');
  await page.getByRole('button', { name: /Snakk med Noor/ }).click();
  await capture(page, info, 'engineer');
  await page.getByRole('button', { name: /Hva trenger appteamet/ }).click();
  await page.getByRole('button', { name: /Jeg tar oppdraget/ }).click();
  await page.getByRole('button', { name: /Avslutt samtalen/ }).click();
  await walkTo(page, 'Infrastrukturporten', 'portal');
  await capture(page, info, 'portal');
  await page.getByRole('button', { name: /Undersøk Infrastrukturporten/ }).click();
  await page.getByRole('button', { name: /Aktiver porten og gå inn/ }).click();
  await expect(page).toHaveURL(/from=rpg-g1/);
  await expect(page.locator('.scene-object')).toHaveCount(5);
  await page.getByRole('link', { name: 'Tilbake til 3D-ekspedisjonen', exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-renderer', 'webgl');
  await expect(page.getByRole('button', { name: 'Ta kontroll', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-player-z')))
    .toBeLessThan(-19);
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-quest', 'build');
  await walkTo(page, 'Noor · plattformingeniør', 'engineer');
  await page.getByRole('button', { name: /Snakk med Noor/ }).click();
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'engineer-reminder');
  await page.getByRole('button', { name: /Avslutt samtalen/ }).click();
  await walkTo(page, 'Infrastrukturporten', 'portal');
  await page.getByRole('button', { name: /Undersøk Infrastrukturporten/ }).click();
  await page.getByRole('button', { name: /Aktiver porten og gå inn/ }).click();
  await buildGuided(page);
  await capture(page, info, 'technical-work');
  await page.getByRole('link', { name: 'Tilbake til 3D-ekspedisjonen', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ta kontroll', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-quest', 'report');
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-player-z')))
    .toBeLessThan(-19);
  await capture(page, info, 'return');
  await walkTo(page, 'Noor · plattformingeniør', 'engineer');
  await page.getByRole('button', { name: /Snakk med Noor/ }).click();
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'engineer-built');
  await capture(page, info, 'engineer-evidence');
  await page.getByRole('button', { name: /Gå gjennom mitt veiledede arbeid/ }).click();
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'engineer-reported');
  await page.getByRole('button', { name: /Avslutt samtalen/ }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-quest', 'done');
  const persisted = await page.evaluate(() => localStorage.getItem('azurelab.chapter01.guided.v1'));
  await page.reload();
  await expect(page.getByRole('button', { name: 'Ta kontroll', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-quest', 'done');
  await expect(page.locator('.rpg-xp')).toHaveText('120 XP');
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', 'engineer');
  await page.getByRole('button', { name: /Snakk med Noor/ }).click();
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'engineer-reported');
  expect(await page.evaluate(() => localStorage.getItem('azurelab.chapter01.guided.v1'))).toBe(
    persisted,
  );
  await page.getByRole('button', { name: /Avslutt samtalen/ }).click();
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});

test('keyboard, touch controls, reduced motion and actual WebGL context loss preserve essential learning', async ({
  page,
}, info) => {
  await page.setViewportSize(
    info.project.name.startsWith('mobile')
      ? { width: 360, height: 640 }
      : { width: 1280, height: 720 },
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page);
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-reduced', 'true');
  const before = Number(await page.locator('.rpg-world').getAttribute('data-player-z'));
  const forward = page.getByRole('button', { name: 'Gå fremover', exact: true });
  await forward.focus();
  await page.keyboard.down('Enter');
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-player-z')))
    .toBeLessThan(before - 0.5);
  await page.keyboard.up('Enter');
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-moving', 'false');
  const beforePointer = Number(await page.locator('.rpg-world').getAttribute('data-player-z'));
  await forward.dispatchEvent('pointerdown', {
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
  });
  await expect
    .poll(async () => Number(await page.locator('.rpg-world').getAttribute('data-player-z')))
    .toBeLessThan(beforePointer - 0.5);
  await forward.dispatchEvent('pointerup', { pointerId: 1 });
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-moving', 'false');
  await walkTo(page, 'Ida · skyguide', 'guide');
  await page.locator('.rpg-viewport').focus();
  await page.keyboard.press('e');
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'guide-welcome');
  await page.keyboard.press('Escape');
  await expect(page.locator('.rpg-dialogue')).toHaveCount(0);
  await page.locator('canvas').evaluate((canvas) => {
    const gl = (canvas as HTMLCanvasElement).getContext('webgl2');
    if (!gl?.getExtension('WEBGL_lose_context'))
      throw new Error('Test renderer lacks context-loss extension');
    gl.getExtension('WEBGL_lose_context')!.loseContext();
  });
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-renderer', 'failed');
  await expect(
    page.getByRole('heading', { name: '3D-visningen kunne ikke åpnes', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Ida · skyguide', exact: true }).click();
  await page.getByRole('button', { name: 'Samhandle · Ida · skyguide', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'guide-expert');
  await capture(page, info, 'fallback-dialogue');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Ansvarsverkstedet', exact: true }).click();
  await page.getByRole('button', { name: 'Samhandle · Ansvarsverkstedet', exact: true }).click();
  await page.getByRole('button', { name: 'SaaS', exact: true }).click();
  await expect(page.locator('.rpg-model-feedback')).toContainText(
    'ikke en vert for vilkårlig egen webkode',
  );
  await page.keyboard.press('Escape');
  await capture(page, info, 'fallback');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Ta kontroll', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', 'guide');
});

test('asset failure and unsupported saved versions recover explicitly without erasing legacy evidence', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('azurelab.rpg.g1.v1', JSON.stringify({ schema: 99 }));
    localStorage.setItem(
      'azurelab.progress.v1',
      JSON.stringify({ version: 1, completed: ['organization-mission-v1'] }),
    );
  });
  await page.route('**/game/people/character-female-a.glb', (route) => route.abort());
  await page.goto('/expedition-3d');
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-renderer', 'failed', {
    timeout: 45000,
  });
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
  await expect(page.locator('.rpg-storage')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('azurelab.rpg.g1.v1'))).toContain('99');
  await page.getByRole('button', { name: 'Nullstill bare G1-spilldata', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('opptjent XP beholdes');
  await page.getByRole('button', { name: 'Nullstill G1-spilldata nå', exact: true }).click();
  await expect(page.locator('.rpg-storage')).toHaveCount(0);
  await expect(page.locator('.rpg-xp')).toHaveText('80 XP');
  await page.getByRole('button', { name: 'Ansvarsverkstedet', exact: true }).click();
  await page.getByRole('button', { name: 'Samhandle · Ansvarsverkstedet', exact: true }).click();
  for (let replay = 0; replay < 2; replay++) {
    await page.getByRole('button', { name: 'IaaS', exact: true }).click();
    await page.getByRole('button', { name: 'PaaS', exact: true }).click();
  }
  await expect(page.locator('.rpg-xp')).toHaveText('80 XP');
  await page.keyboard.press('Escape');
  await page.goto('/progress');
  await page.getByRole('button', { name: 'Slett lokal fremgang', exact: true }).click();
  await page.getByRole('button', { name: 'Slett fremgangen nå', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('azurelab.rpg.g1.v1'))).toBeNull();
});
