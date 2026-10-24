import { expect, test, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ trace: 'on' });
test.setTimeout(60_000);
const key = 'azurelab.chapter01.guided.v1';
const create = (page: Page) =>
  page.getByRole('button', { name: 'Registrer og bruk i oppdraget', exact: true });
const name = (page: Page) => page.getByLabel('Ressursnavn', { exact: true });
async function capture(page: Page, info: TestInfo, label: string) {
  if (await page.locator('.camera-world').count())
    await page.locator('.camera-world').evaluate(async (node) => {
      await Promise.all(node.getAnimations().map((a) => a.finished.catch(() => {})));
    });
  await page.screenshot({
    path: info.outputPath(`chapter-${label}.png`),
    fullPage: true,
    scale: 'css',
  });
}
async function accessible(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
async function group(page: Page, subscription = 'sub-app') {
  await page.getByRole('button', { name: 'Ny resource group', exact: true }).click();
  await name(page).fill('rg-application');
  await page
    .getByRole('combobox', { name: 'Subscription', exact: true })
    .selectOption(subscription);
  await page
    .getByRole('combobox', { name: 'Region for gruppemetadata', exact: true })
    .selectOption('norwayeast');
  await create(page).click();
}
async function predict(page: Page, wrong = false) {
  await page.getByRole('button', { name: 'Ny App Service plan', exact: true }).click();
  await page
    .getByRole('radio', {
      name: wrong
        ? 'Planen må arve gruppens metadatalokasjon'
        : 'Planlokasjon velges separat fra gruppemetadata',
      exact: true,
    })
    .check();
  await page
    .getByRole('radio', {
      name: wrong
        ? 'Webappen bruker gruppens metadatalokasjon'
        : 'Webappen bruker hosting-planens lokasjon',
      exact: true,
    })
    .check();
}
async function plan(page: Page, region: string) {
  await name(page).fill('plan-application');
  await page
    .getByRole('combobox', { name: 'Region for hosting-plan', exact: true })
    .selectOption(region);
  await create(page).click();
}
async function saved(page: Page) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), key);
}

test('guided build predicts, inspects an immutable policy denial, corrects hosting, persists and returns without a chapter award', async ({
  page,
}, info) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== 'http://127.0.0.1:3000') external.push(r.url());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/legacy-expedition?at=gateway');
  await page.evaluate(() => {
    localStorage.setItem(
      'azurelab.progress.v1',
      JSON.stringify({
        version: 1,
        completed: ['organization-mission-v1', 'organization-check-v1'],
      }),
    );
  });
  await page.reload();
  await expect(page.locator('.chapter-portal-status')).toContainText('Veiledet arbeid gjenstår');
  await page.getByRole('button', { name: 'Bygg applikasjonsplattformen', exact: true }).click();
  await expect(page).toHaveURL(/chapter=01/);
  await expect(page.locator('.scene-object')).toHaveCount(5);
  await capture(page, info, 'entry');
  await accessible(page);
  await page
    .locator('.chapter-brief')
    .getByRole('button', { name: 'Overfør tjenestevalget', exact: true })
    .click();
  await page
    .getByRole('combobox', { name: 'Tjenestemodell for teamet', exact: true })
    .selectOption('paas');
  await page
    .getByRole('combobox', { name: 'Hvem drifter plattformens OS?', exact: true })
    .selectOption('microsoft');
  await page
    .getByRole('combobox', {
      name: 'Hvem har ansvar for egen kode og kundens tilgangsvalg?',
      exact: true,
    })
    .selectOption('customer');
  await page.getByRole('button', { name: 'Bekreft operasjonelt ansvar', exact: true }).click();
  await expect(page.locator('.chapter-current-goal')).toContainText(
    'Velg riktig livssyklus og scope',
  );
  await group(page);
  await expect(page.locator('.scene-object')).toHaveCount(6);
  await expect(page.locator('.chapter-inspector')).toContainText('Norway East');
  await capture(page, info, 'group-selection');
  await predict(page, true);
  await capture(page, info, 'prediction');
  await accessible(page);
  const prePrediction = await saved(page);
  await page
    .getByRole('button', { name: 'Lagre prediksjon og undersøk planen', exact: true })
    .click();
  const predicted = await saved(page);
  await name(page).fill('plan-application');
  await page
    .getByRole('combobox', { name: 'Region for hosting-plan', exact: true })
    .scrollIntoViewIfNeeded();
  await capture(page, info, 'plan-configuration');
  expect(predicted.events.filter((e: { kind: string }) => e.kind === 'command')).toEqual(
    prePrediction.events.filter((e: { kind: string }) => e.kind === 'command'),
  );
  await plan(page, 'northeurope');
  await expect(page.locator('.chapter-receipt')).toHaveAttribute('data-outcome', 'rejected');
  await expect(page.locator('.receipt-cause')).toContainText('Web-ressursens lokasjon');
  await expect(page.locator('.chapter-receipt')).toContainText('policy-location-denied');
  await expect(page.locator('.chapter-receipt')).toContainText('1 → 1');
  await expect(page.locator('.scene-object')).toHaveCount(6);
  await expect(page.locator('.rejected-operation')).toHaveCount(1);
  await capture(page, info, 'policy-rejection');
  await accessible(page);
  await page.getByRole('button', { name: 'Undersøk gjeldende policy', exact: true }).click();
  await expect(page.locator('.chapter-policy-panel')).toContainText('policy-web-location');
  await expect(page.locator('.policy-highlighted')).toHaveAttribute('data-policy-scope', 'sub-app');
  await expect(page.locator('.chapter-policy-panel')).toContainText(
    'Resource groups er ikke måltypen',
  );
  await capture(page, info, 'policy-inspection');
  await accessible(page);
  await page.getByRole('button', { name: 'Ny App Service plan', exact: true }).click();
  await expect(name(page)).toHaveValue('plan-application');
  await plan(page, 'westeurope');
  await expect(page.locator('.scene-object')).toHaveCount(7);
  await expect(page.locator('.object-plan')).toHaveCount(1);
  await expect(page.locator('.chapter-inspector')).toContainText('West Europe');
  await expect(page.locator('.rejected-operation')).toHaveCount(0);
  await capture(page, info, 'corrected-plan');
  await page.getByRole('button', { name: 'Ny webapp', exact: true }).click();
  await name(page).fill('web-application');
  await page.getByRole('combobox', { name: 'Hosting-plan', exact: true }).selectOption('');
  await create(page).click();
  await expect(page.locator('.chapter-receipt')).toContainText('missing-plan');
  await expect(page.locator('.scene-object')).toHaveCount(7);
  await page.getByRole('button', { name: 'Endre konfigurasjon', exact: true }).click();
  await page.getByRole('combobox', { name: 'Hosting-plan', exact: true }).selectOption('plan-2');
  await expect(page.locator('.derived-location')).toContainText('West Europe');
  await create(page).click();
  await expect(page.locator('.scene-object')).toHaveCount(8);
  await expect(page.locator('.object-webapp')).toHaveCount(1);
  await expect(page.locator('.hosting-dependency')).toHaveAttribute('data-from', 'app-3');
  await expect(page.locator('.hosting-dependency')).toHaveAttribute('data-to', 'plan-2');
  await expect(page.locator('.chapter-inspector')).toContainText('Hosting-avhengighet');
  await capture(page, info, 'application-dependency');
  await accessible(page);
  await page.getByRole('button', { name: 'Lokasjoner', exact: true }).click();
  await expect(page.locator('.metadata-property')).toContainText('Norway East');
  await expect(page.locator('.resource-property')).toHaveCount(2);
  await expect(page.locator('.resource-property').first()).toContainText('West Europe');
  await capture(page, info, 'locations');
  await page.getByRole('button', { name: 'Forklar sammenhengen', exact: true }).click();
  await page
    .getByRole('radio', { name: 'Planlokasjon velges separat fra gruppemetadata', exact: true })
    .check();
  await page
    .getByRole('radio', { name: 'Webappen bruker hosting-planens lokasjon', exact: true })
    .check();
  await page
    .getByRole('radio', {
      name: 'Velg en tillatt ressurslokasjon; appen følger planen',
      exact: true,
    })
    .check();
  await page.getByRole('button', { name: 'Registrer årsaksforklaring', exact: true }).click();
  await expect(page.locator('.guided-build-result')).toContainText(
    'Veiledet konfigurasjon tilfredsstilt',
  );
  await expect(page.locator('.guided-build-result')).toContainText('ikke fullført');
  const completed = await saved(page);
  expect(completed.events.find((e: { kind: string }) => e.kind === 'prediction').placement).toBe(
    'metadata-forces-location',
  );
  await expect(page.locator('.topbar .xp-pill')).toHaveText('120 XP');
  await page.getByRole('link', { name: 'Tilbake til ekspedisjonen', exact: true }).click();
  await expect(page.locator('.journey-landscape')).toHaveAttribute('data-stop', 'gateway');
  await expect(page.locator('.chapter-portal-status')).toContainText(
    'Veiledet konfigurasjon tilfredsstilt',
  );
  await capture(page, info, 'return');
  await page.reload();
  await expect(page.locator('.chapter-portal-status')).toContainText(
    'Veiledet konfigurasjon tilfredsstilt',
  );
  await page.getByRole('button', { name: 'Bygg applikasjonsplattformen', exact: true }).click();
  await expect(page.locator('.scene-object')).toHaveCount(8);
  expect((await saved(page)).events).toEqual(completed.events);
  await page.getByRole('button', { name: 'Start øvingen på nytt', exact: true }).click();
  await page.getByRole('button', { name: 'Start nytt veiledet forsøk', exact: true }).click();
  await expect(page.locator('.scene-object')).toHaveCount(5);
  expect((await saved(page)).attemptNumber).toBe(2);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('120 XP');
  await page.getByRole('link', { name: 'Fremgang', exact: true }).click();
  await page.getByRole('button', { name: 'Slett lokal fremgang', exact: true }).click();
  await page.getByRole('button', { name: 'Slett fremgangen nå', exact: true }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBeNull();
  await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('compact keyboard and reduced-motion views preserve a valid wrong-subscription operation and unfinished return', async ({
  page,
}, info) => {
  await page.setViewportSize(
    info.project.name.startsWith('mobile')
      ? { width: 360, height: 780 }
      : { width: 1280, height: 720 },
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/explore?chapter=01&journey=1');
  const subscription = page.locator('#scene-node-sub-shared');
  await subscription.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.chapter-inspector h2')).toHaveText('Shared Sandbox');
  await expect(subscription).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.camera-world')).toHaveCSS('transition-duration', '0s');
  await group(page, 'sub-shared');
  await expect(page.locator('.scene-object')).toHaveCount(6);
  await expect(page.locator('.requirement-mismatch')).toContainText('Gyldig ressurs');
  await expect(page.locator('.chapter-current-goal')).not.toContainText(
    'Veiledet konfigurering klar',
  );
  await capture(page, info, 'compact-wrong-scope');
  await accessible(page);
  await page.getByRole('button', { name: 'Liste', exact: true }).click();
  await page.getByRole('button', { name: /Resource group rg-application/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.chapter-inspector')).toContainText('Shared Sandbox');
  await capture(page, info, 'compact-inspection');
  await page.getByRole('button', { name: 'Diagram', exact: true }).click();
  await expect(page.locator('.react-flow__node')).toHaveCount(6);
  await accessible(page);
  const work = await saved(page);
  await page.getByRole('link', { name: 'Tilbake til ekspedisjonen', exact: true }).click();
  await expect(page.locator('.chapter-portal-status')).toContainText('Veiledet arbeid gjenstår');
  await page.goBack();
  await expect(page.locator('.scene-object')).toHaveCount(6);
  expect((await saved(page)).events).toEqual(work.events);
});

test('choosing an allowed plan first still permits a real isolated denial without changing the accepted world', async ({
  page,
}) => {
  await page.goto('/explore?chapter=01');
  await group(page);
  await predict(page);
  await page
    .getByRole('button', { name: 'Lagre prediksjon og undersøk planen', exact: true })
    .click();
  await plan(page, 'westeurope');
  const before = (await saved(page)).events.filter((e: { kind: string }) => e.kind === 'command');
  await page.getByRole('button', { name: 'Lokasjonsregel', exact: true }).click();
  await page.getByRole('button', { name: 'Test avvist alternativ isolert', exact: true }).click();
  await expect(page.locator('.chapter-receipt')).toContainText('policy-location-denied');
  await expect(page.locator('.probe-notice')).toContainText('hovedverden uendret');
  await expect(page.locator('.scene-object')).toHaveCount(7);
  expect((await saved(page)).events.filter((e: { kind: string }) => e.kind === 'command')).toEqual(
    before,
  );
  await page.reload();
  await expect(page.locator('.scene-object')).toHaveCount(7);
  await page.getByRole('button', { name: 'Kvitteringer', exact: true }).click();
  await expect(page.locator('.probe-notice')).toBeVisible();
});

test('unknown stored versions are quarantined and concurrent tabs cannot overwrite guided work', async ({
  page,
  context,
}) => {
  await page.goto('/explore?chapter=01');
  await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ schemaVersion: 99 })), key);
  await page.reload();
  await expect(page.locator('.chapter-storage-issue')).toContainText(
    'ukjent scenario- eller modellversjon',
  );
  await expect(page.getByRole('button', { name: 'Ny resource group', exact: true })).toBeDisabled();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toContain('99');
  await page.getByRole('button', { name: 'Start øvingen på nytt', exact: true }).click();
  await page.getByRole('button', { name: 'Start nytt veiledet forsøk', exact: true }).click();
  const second = await context.newPage();
  await second.goto('/explore?chapter=01');
  await expect(
    second.getByRole('button', { name: 'Ny resource group', exact: true }),
  ).toBeEnabled();
  await group(page);
  await expect(second.locator('.chapter-storage-issue')).toContainText('annen fane');
  await expect(
    second.getByRole('button', { name: 'Ny resource group', exact: true }),
  ).toBeDisabled();
  await second.getByRole('button', { name: 'Last lagret versjon', exact: true }).click();
  await expect(second.locator('.scene-object')).toHaveCount(6);
  expect((await saved(second)).events).toEqual((await saved(page)).events);
});
