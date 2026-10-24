import { expect, test, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ trace: 'on' });
test.setTimeout(60_000);

test('short laptop and narrow touch layouts keep travel and interrupted camera navigation usable', async ({
  page,
}, info) => {
  await page.setViewportSize(
    info.project.name.startsWith('mobile')
      ? { width: 360, height: 780 }
      : { width: 1280, height: 720 },
  );
  await page.goto('/legacy-expedition');
  await page.getByRole('button', { name: 'Begynn ekspedisjonen', exact: true }).click();
  await page.getByRole('button', { name: 'Ruteoversikt', exact: true }).click();
  await page.getByRole('button', { name: 'Infrastrukturporten', exact: true }).click();
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-stop', 'gateway');
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-moving', 'false');
  const stableCamera = await page.locator('.journey-landscape').getAttribute('data-camera');
  await page.getByRole('button', { name: 'Ruteoversikt', exact: true }).click();
  await page.getByRole('button', { name: 'Tilbake til nærvisning', exact: true }).click();
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-moving', 'false');
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-camera', stableCamera!);
  await expect(page.locator('.journey-console')).toHaveJSProperty('scrollTop', 0);
  await capture(page, info, 'expedition-compact-portal');
  await accessible(page);
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1)).toBe(
    true,
  );
});
async function capture(page: Page, info: TestInfo, name: string) {
  if (await page.locator('.journey-landscape').count())
    await expect(page.locator('.journey-landscape')).toHaveAttribute('data-moving', 'false');
  if (await page.locator('.camera-world').count()) {
    await page.locator('.camera-world').evaluate(async (node) => {
      await Promise.all(
        node.getAnimations().map((animation) => animation.finished.catch(() => {})),
      );
    });
    if (await page.locator('.context-inspector').count())
      await expect(page.locator('.context-inspector')).toHaveCSS('opacity', '1');
  }
  await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: true, scale: 'css' });
}
async function accessible(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    })),
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function resourceGroup(page: Page) {
  await page.getByRole('button', { name: 'Subscription Learning Sandbox', exact: true }).click();
  await page.getByRole('button', { name: 'Ny resource group', exact: true }).click();
  await page.getByLabel('Navn på resource group', { exact: true }).fill('rg-azurelab-dev');
  await page.getByLabel('Region for metadata', { exact: true }).selectOption('norwayeast');
  await page.getByRole('button', { name: 'Opprett i simuleringen', exact: true }).click();
}

test('a continuous expedition teaches, detours, corrects, enters a real world and returns with saved completion', async ({
  page,
}, info) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:3000') external.push(request.url());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/legacy-expedition');
  await expect(
    page.getByRole('button', { name: 'Begynn ekspedisjonen', exact: true }),
  ).toBeEnabled();
  await capture(page, info, 'expedition-arrival');
  await accessible(page);
  const initialCamera = await page.locator('.journey-landscape').getAttribute('data-camera');
  await page.getByRole('button', { name: 'Begynn ekspedisjonen', exact: true }).click();
  await expect(page).toHaveURL(/at=models/);
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-moving', 'false');
  expect(await page.locator('.journey-landscape').getAttribute('data-camera')).not.toBe(
    initialCamera,
  );
  await expect(page.locator('[data-layer="os"]')).toHaveAttribute('data-owner', 'customer');
  await page.getByRole('button', { name: 'PaaS', exact: true }).click();
  await expect(page.locator('[data-layer="os"]')).toHaveAttribute('data-owner', 'microsoft');
  await expect(page.locator('[data-layer="data"]')).toHaveAttribute('data-owner', 'customer');
  await page.getByRole('button', { name: 'Teknisk dybde', exact: true }).click();
  await expect(page.locator('.concept-explanation')).toContainText('gjeste-OS');
  await page.getByRole('button', { name: /^Runtime og middleware/ }).click();
  await expect(page.locator('.concept-explanation')).toContainText('Egen container');
  await capture(page, info, 'expedition-teaching');
  await accessible(page);
  const mainCamera = await page.locator('.journey-landscape').getAttribute('data-camera');
  await page.getByRole('button', { name: 'Ta avstikkeren', exact: true }).click();
  await expect(page).toHaveURL(/at=decision/);
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-moving', 'false');
  expect(await page.locator('.journey-landscape').getAttribute('data-camera')).not.toBe(mainCamera);
  await capture(page, info, 'expedition-detour-entry');
  await page.getByRole('radio', { name: 'IaaS Azure Virtual Machines', exact: true }).check();
  await page.getByRole('button', { name: 'Test beslutningen', exact: true }).click();
  await expect(page.locator('.detour-feedback')).toContainText('gjeste-OS-driften');
  await capture(page, info, 'expedition-detour');
  await accessible(page);
  await page.getByRole('button', { name: 'Endre svaret', exact: true }).click();
  await page.getByRole('radio', { name: 'PaaS Azure App Service', exact: true }).check();
  await page.getByRole('button', { name: 'Test beslutningen', exact: true }).click();
  await expect(page.locator('.detour-feedback')).toContainText('Beslutningen holder');
  await page.getByRole('button', { name: 'Tilbake til hovedruten', exact: true }).click();
  await expect(page).toHaveURL(/at=crossing/);
  await expect(page.locator('.journey-checkpoint')).toContainText('Øving gjennomført');
  await page.getByRole('button', { name: 'Ta avstikkeren', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Patche SaaS-leverandørens OS', exact: true }).check();
  await page.getByRole('button', { name: 'Kontroller ansvarsfordelingen', exact: true }).click();
  await expect(page.locator('.detour-feedback')).toContainText('stemmer ikke ennå');
  await page.getByRole('button', { name: 'Endre svaret', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Patche SaaS-leverandørens OS', exact: true }).uncheck();
  await page
    .getByRole('checkbox', { name: 'Klassifisere og beskytte kundedata', exact: true })
    .check();
  await page
    .getByRole('checkbox', { name: 'Administrere brukere og tilgang', exact: true })
    .check();
  await page.getByRole('button', { name: 'Kontroller ansvarsfordelingen', exact: true }).click();
  await expect(page.locator('.detour-feedback')).toContainText('Riktig grense');
  await page.getByRole('button', { name: 'Tilbake til hovedruten', exact: true }).click();
  await expect(page).toHaveURL(/at=gateway/);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
  await capture(page, info, 'expedition-portal');
  await accessible(page);
  await page.getByRole('button', { name: 'Gå inn i infrastrukturverdenen', exact: true }).click();
  await expect(page).toHaveURL(/explore\?journey=1/);
  await page.getByRole('button', { name: 'Finn subscription', exact: true }).click();
  await resourceGroup(page);
  await expect(page.locator('[data-scope-id="created-group-1"]')).toBeVisible();
  await expect(page.locator('.topbar .xp-pill')).toHaveText('80 XP');
  await capture(page, info, 'expedition-world');
  await page.getByRole('button', { name: 'Åpne kunnskapssjekk', exact: true }).click();
  for (const [i, answer] of [
    'Under en subscription',
    'Nei, ressursens region velges separat',
    'En tenant kan ha flere subscriptions; hver stoler på én tenant',
  ].entries()) {
    await page.getByRole('radio', { name: answer, exact: true }).check();
    await page
      .getByRole('button', {
        name: i < 2 ? 'Neste spørsmål' : 'Fullfør kunnskapssjekk',
        exact: true,
      })
      .click();
  }
  await page.getByRole('dialog').getByRole('button', { name: 'Lukk panelet', exact: true }).click();
  await page.getByRole('link', { name: 'Tilbake til ekspedisjonen', exact: true }).click();
  await expect(page).toHaveURL(/at=gateway/);
  await expect(page.locator('.portal-status')).toContainText(
    'Oppdrag og kunnskapssjekk gjennomført',
  );
  await expect(page.locator('.exp-gateway')).toHaveClass(/complete/);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('120 XP');
  await capture(page, info, 'expedition-return');
  await page.reload();
  await expect(page.locator('.portal-status')).toContainText(
    'Oppdrag og kunnskapssjekk gjennomført',
  );
  await page.getByRole('button', { name: 'Fortsett lagret arbeid', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-scope-id="created-group-1"]')).toBeVisible();
  await page.getByRole('link', { name: 'Tilbake til ekspedisjonen', exact: true }).click();
  await page.getByRole('button', { name: 'Ruteoversikt', exact: true }).click();
  await page.getByRole('button', { name: 'Beslutningsutsikten', exact: true }).click();
  await page.getByRole('button', { name: 'Test beslutningen', exact: true }).click();
  await expect(page.locator('.detour-feedback')).toContainText('Beslutningen holder');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('120 XP');
  await page.getByRole('button', { name: 'Tilbake til hovedruten', exact: true }).click();
  await page.goto('/legacy-expedition');
  await expect(page).toHaveURL(/at=crossing/);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('keyboard, reduced motion, interruption and browser history preserve predictable positions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/legacy-expedition');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Hopp til innhold', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Begynn ekspedisjonen', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-stop', 'models');
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-moving', 'false');
  await page.getByRole('button', { name: 'SaaS', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-layer="os"]')).toHaveAttribute('data-owner', 'microsoft');
  await page.getByRole('button', { name: 'Ta avstikkeren', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.journey-console')).toBeFocused();
  await page.goBack();
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-stop', 'models');
  await page.goForward();
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-stop', 'decision');
  await page.getByRole('button', { name: 'Tilbake uten å fullføre', exact: true }).click();
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-stop', 'models');
  await page.getByRole('button', { name: 'Ruteoversikt', exact: true }).click();
  await page.getByRole('button', { name: 'Infrastrukturporten', exact: true }).click();
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-moving', 'false');
  await accessible(page);
  await page.getByRole('button', { name: 'Gå inn i infrastrukturverdenen', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.goBack();
  await expect(page).toHaveURL(/at=gateway/);
  await expect(page.locator('.portal-status')).toContainText('Praktisk oppdrag tilgjengelig');
});

test('unfinished world work survives exit and reload, corruption is bounded, explicit deletion clears all categories', async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('azurelab.expedition.v1', '{broken');
      sessionStorage.setItem('seeded', '1');
    }
  });
  await page.goto('/legacy-expedition?at=gateway');
  await page.getByRole('button', { name: 'Gå inn i infrastrukturverdenen', exact: true }).click();
  await page.getByRole('button', { name: 'Finn subscription', exact: true }).click();
  await page.getByRole('link', { name: 'Tilbake til ekspedisjonen', exact: true }).click();
  await expect(page.locator('.portal-status')).toContainText('Praktisk oppdrag tilgjengelig');
  await page.getByRole('button', { name: 'Gå inn i infrastrukturverdenen', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await resourceGroup(page);
  await page.getByRole('link', { name: 'Tilbake til ekspedisjonen', exact: true }).click();
  await expect(page.locator('.portal-status')).toContainText('refleksjon gjenstår');
  await page.reload();
  await page.getByRole('button', { name: 'Fortsett lagret arbeid', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.scene-object')).toHaveCount(9);
  await page.getByRole('link', { name: 'Fremgang', exact: true }).click();
  await page.getByRole('button', { name: 'Slett lokal fremgang', exact: true }).click();
  await page.getByRole('button', { name: 'Slett fremgangen nå', exact: true }).click();
  await page.goto('/legacy-expedition');
  await expect(page).toHaveURL(/at=arrival/);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
  await page.goto('/explore');
  await expect(page.locator('.scene-object')).toHaveCount(8);
});
