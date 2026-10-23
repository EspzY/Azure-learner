import { expect, test, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.use({
  trace: 'on',
  video: 'on',
  launchOptions: {
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  },
});
test.setTimeout(180000);
async function shot(page: Page, info: TestInfo, name: string, intent: string) {
  const world = page.locator('.rpg-world');
  await expect(world).toHaveAttribute('data-camera-width', String(page.viewportSize()!.width));
  await expect(world).toHaveAttribute('data-camera-height', String(page.viewportSize()!.height));
  await expect(world).toHaveAttribute('data-camera-shot', intent);
  await expect(world).toHaveAttribute('data-camera-settled', 'true', { timeout: 15000 });
  await page.screenshot({ path: info.outputPath(`cinematic-${name}.png`), scale: 'css' });
}
async function approach(page: Page, name: string, id: string) {
  await page
    .getByRole('button', { name: 'Orientering og tilgjengelig navigasjon', exact: true })
    .click();
  await page.getByRole('button', { name: `Gå til ${name}`, exact: true }).click();
  await expect(page.locator('.rpg-world')).toHaveAttribute('data-near', id, { timeout: 35000 });
  await page
    .getByRole('button', {
      name: new RegExp(
        id === 'guide'
          ? 'Snakk med Ida'
          : id === 'engineer'
            ? 'Snakk med Noor'
            : 'Undersøk Ansvarsverkstedet',
      ),
    })
    .click();
}
async function framing(page: Page) {
  const world = page.locator('.rpg-world');
  expect(Number(await world.getAttribute('data-speaker-top'))).toBeGreaterThan(0.025);
  expect(Number(await world.getAttribute('data-speaker-y'))).toBeLessThan(
    Number(await world.getAttribute('data-dialogue-top')),
  );
  expect(Number(await world.getAttribute('data-speaker-x'))).toBeGreaterThan(0.06);
  expect(Number(await world.getAttribute('data-speaker-x'))).toBeLessThan(0.94);
  const viewport = page.viewportSize()!;
  const subtitle = await page.locator('.rpg-dialogue-text').boundingBox();
  expect(subtitle!.x).toBeGreaterThanOrEqual(0);
  expect(subtitle!.x + subtitle!.width).toBeLessThanOrEqual(viewport.width);
  expect(subtitle!.y + subtitle!.height).toBeLessThanOrEqual(viewport.height);
}
test('cinematic speakers, framing, focus, workshop and exploration restoration', async ({
  page,
}, info) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== 'http://127.0.0.1:3000') external.push(r.url());
  });
  await page.goto('/expedition-3d');
  await expect(page.getByRole('button', { name: 'Ta kontroll', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  await page.getByRole('button', { name: 'Ta kontroll', exact: true }).click();
  await approach(page, 'Ida · skyguide', 'guide');
  const world = page.locator('.rpg-world');
  await shot(page, info, 'ida-two-shot', 'two-shot');
  await framing(page);
  await expect(page.locator('.cinematic-dialogue')).toHaveAttribute('open', '');
  expect(await page.locator('.command-dialog').count()).toBe(0);
  await expect(world).toHaveAttribute('data-player-visible', 'true');
  await expect(world).toHaveAttribute('data-camera-speaker', 'guide');
  const before = await world.getAttribute('data-player-z');
  await page.keyboard.press('w');
  expect(await world.getAttribute('data-player-z')).toBe(before);
  await expect(page.getByRole('button', { name: /Hvorfor trenger vi/ })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('button', { name: /Jeg kjenner grunnlaget/ })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await shot(page, info, 'ida-shoulder', 'over-shoulder');
  await framing(page);
  await page.getByRole('button', { name: /Hva endres teknisk/ }).click();
  await shot(page, info, 'ida-close', 'speaker-close');
  await framing(page);
  await expect(world).toHaveAttribute('data-player-visible', 'false');
  await expect
    .poll(async () =>
      Math.abs(
        Number(await world.getAttribute('data-guide-facing')) -
          Number(await world.getAttribute('data-guide-target')),
      ),
    )
    .toBeLessThan(0.05);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: /Vis meg ansvarsverkstedet/ }).click();
  await expect(page.locator('.rpg-viewport')).toBeFocused();
  await expect(world).toHaveAttribute('data-near', 'installation', { timeout: 35000 });
  await page.getByRole('button', { name: /Undersøk Ansvarsverkstedet/ }).click();
  await page.getByRole('button', { name: 'IaaS', exact: true }).click();
  await page.getByRole('button', { name: 'PaaS', exact: true }).click();
  await expect
    .poll(async () => Number(await world.getAttribute('data-os-position')))
    .toBeLessThan(-1);
  await shot(page, info, 'workshop', 'demonstration');
  expect(Number(await world.getAttribute('data-workshop-top'))).toBeGreaterThan(0.03);
  expect(Number(await world.getAttribute('data-workshop-bottom'))).toBeLessThan(
    Number(await world.getAttribute('data-dialogue-top')) + 0.03,
  );
  const originalViewport = page.viewportSize()!;
  await page.setViewportSize({ width: 844, height: 390 });
  await shot(page, info, 'workshop-landscape', 'demonstration');
  expect(Number(await world.getAttribute('data-workshop-top'))).toBeGreaterThan(0.03);
  expect(Number(await world.getAttribute('data-workshop-right'))).toBeLessThan(
    Number(await world.getAttribute('data-dialogue-left')),
  );
  await page.setViewportSize(originalViewport);
  await shot(page, info, 'workshop-restored', 'demonstration');
  await page.getByRole('button', { name: 'Teknisk fordypning og kilde', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Tilbake til samtalen', exact: true }),
  ).toBeFocused();
  await page
    .getByRole('combobox', { name: 'Undersøk et ansvarslag', exact: true })
    .selectOption('data');
  await expect(page.locator('[data-layer="data"]')).toHaveAttribute('data-owner', 'customer');
  await expect(world).toHaveAttribute('data-highlighted-layer', 'data');
  expect(Number(await world.getAttribute('data-layer-intensity'))).toBeGreaterThan(1);
  await shot(page, info, 'workshop-journal', 'demonstration');
  await page.keyboard.press('Escape');
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'installation');
  await expect(page.getByRole('button', { name: /Prøv teamets beslutning/ })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.cinematic-dialogue')).toHaveCount(0);
  await expect(world).toHaveAttribute('data-camera-shot', 'exploration');
  await expect(page.getByRole('button', { name: /Undersøk Ansvarsverkstedet/ })).toBeFocused();
  await page.keyboard.down('w');
  await expect(world).toHaveAttribute('data-moving', 'true');
  await page.keyboard.up('w');
  await approach(page, 'Noor · plattformingeniør', 'engineer');
  await shot(page, info, 'noor-two-shot', 'two-shot');
  await framing(page);
  await page.getByRole('button', { name: /Hva trenger appteamet/ }).click();
  await shot(page, info, 'noor-brief', 'over-shoulder');
  await framing(page);
  await page.getByRole('button', { name: /Jeg tar oppdraget/ }).click();
  await expect(page.locator('.rpg-dialogue')).toHaveAttribute('data-node', 'engineer-accepted');
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: /Snakk med Noor/ }).click();
  await expect(world).toHaveAttribute('data-camera-transition', 'immediate');
  await shot(page, info, 'noor-reminder', 'speaker-close');
  await framing(page);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 844, height: 390 });
  expect((await world.boundingBox())!.height).toBeLessThanOrEqual(390);
  await page.getByRole('button', { name: /Snakk med Noor/ }).click();
  await shot(page, info, 'landscape', 'speaker-close');
  await framing(page);
  await page.getByRole('button', { name: 'Større samtaletekst', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Større samtaletekst', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await shot(page, info, 'landscape-large', 'speaker-close');
  await framing(page);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
