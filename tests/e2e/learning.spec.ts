import { expect, test, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function checkAccessibility(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    })),
  ).toEqual([]);
}
async function settleScene(page: Page) {
  await page.locator('.camera-world').evaluate(async (node) => {
    await Promise.all(node.getAnimations().map((animation) => animation.finished.catch(() => {})));
  });
  if (await page.locator('.context-inspector').count())
    await expect(page.locator('.context-inspector')).toHaveCSS('opacity', '1');
}
async function capture(page: Page, info: TestInfo, name: string) {
  if (await page.locator('.camera-world').count()) await settleScene(page);
  await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: true, scale: 'css' });
}
async function selectSubscription(page: Page) {
  await page.getByRole('button', { name: 'Subscription Learning Sandbox', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Learning Sandbox', exact: true })).toBeVisible();
  await settleScene(page);
}
async function createGroup(page: Page) {
  await page.getByRole('button', { name: 'Ny resource group', exact: true }).click();
  await page.getByLabel('Navn på resource group', { exact: true }).fill('rg-azurelab-dev');
  await page.getByLabel('Region for metadata', { exact: true }).selectOption('norwayeast');
  await page.getByRole('button', { name: 'Opprett i simuleringen', exact: true }).click();
}
async function answerCheck(page: Page, correct: boolean) {
  const choices = correct
    ? [
        'Under en subscription',
        'Nei, ressursens region velges separat',
        'En tenant kan ha flere subscriptions; hver stoler på én tenant',
      ]
    : [
        'Direkte under en Azure-region',
        'Ja, alle ressurser arver gruppens region',
        'En subscription stoler på mange tenants samtidig',
      ];
  for (let i = 0; i < choices.length; i++) {
    await page.getByRole('radio', { name: choices[i]!, exact: true }).check();
    await page
      .getByRole('button', {
        name: i < 2 ? 'Neste spørsmål' : 'Fullfør kunnskapssjekk',
        exact: true,
      })
      .click();
  }
}

test('mission is playable inside the world; commands, errors, feedback, replay and XP are real', async ({
  page,
}, info) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:3000') external.push(request.url());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
  await capture(page, info, 'hub');
  await page.getByRole('link', { name: 'Gå inn i universet', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Oppdragsbrief' })).toBeVisible();
  await checkAccessibility(page);
  await page.getByRole('button', { name: 'Finn subscription', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Azure Universe / 01' })).toBeVisible();
  await expect(page.locator('.mission-hud')).toContainText('Finn og velg Learning Sandbox');
  await capture(page, info, 'scene');
  const before = await page.locator('.camera-world').getAttribute('style');
  await selectSubscription(page);
  expect(await page.locator('.camera-world').getAttribute('style')).not.toBe(before);
  await expect(page.locator('.mission-steps-compact .done')).toHaveCount(1);
  await capture(page, info, 'selected');
  await checkAccessibility(page);
  await page.getByRole('button', { name: 'Ny resource group', exact: true }).click();
  await page.getByLabel('Navn på resource group', { exact: true }).fill('bad/name');
  await page.getByRole('button', { name: 'Opprett i simuleringen', exact: true }).click();
  await expect(page.locator('#creation-error')).toContainText('gyldig navn');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
  await page.getByLabel('Navn på resource group', { exact: true }).fill('rg-azurelab-dev');
  await page.getByLabel('Region for metadata', { exact: true }).selectOption('norwayeast');
  await capture(page, info, 'command');
  await checkAccessibility(page);
  await page.getByRole('button', { name: 'Opprett i simuleringen', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('[data-scope-id="created-group-1"]')).toBeVisible();
  await expect(page.locator('[data-from="sub"][data-to="created-group-1"]')).toHaveCount(1);
  await expect(page.locator('#scene-node-created-group-1')).toBeFocused();
  await expect(page.locator('.scene-feedback')).toContainText('+80 XP');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('80 XP');
  await capture(page, info, 'created');
  await page
    .locator('.context-inspector')
    .getByRole('button', { name: 'Learning Sandbox', exact: true })
    .click();
  await createGroup(page);
  await expect(page.locator('#creation-error')).toContainText('allerede');
  await expect(page.locator('.scene-object')).toHaveCount(9);
  await page.getByRole('dialog').getByRole('button', { name: 'Lukk panelet', exact: true }).click();
  await page.getByRole('button', { name: 'Åpne kunnskapssjekk', exact: true }).click();
  await answerCheck(page, false);
  await expect(page.locator('.result-count')).toHaveText('0 / 3 riktige svar');
  await expect(page.locator('.answer-feedback')).toHaveCount(3);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('80 XP');
  await page.getByRole('button', { name: 'Prøv på nytt', exact: true }).click();
  await answerCheck(page, true);
  await expect(page.locator('.result-count')).toHaveText('3 / 3 riktige svar');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('120 XP');
  await checkAccessibility(page);
  await capture(page, info, 'knowledge-check');
  await page.getByRole('dialog').getByRole('button', { name: 'Lukk panelet', exact: true }).click();
  await page.getByRole('button', { name: 'Nullstill simulering', exact: true }).click();
  await page.getByRole('button', { name: 'Nullstill scenen', exact: true }).click();
  await expect(page.locator('.scene-object')).toHaveCount(8);
  await expect(page.locator('.mission-steps-compact .done')).toHaveCount(0);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('120 XP');
  await selectSubscription(page);
  await createGroup(page);
  await expect(page.locator('.scene-feedback')).toContainText('Ingen nye XP');
  await page.getByRole('button', { name: 'Åpne kunnskapssjekk', exact: true }).click();
  await answerCheck(page, true);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('120 XP');
  await page.reload();
  await expect(page.locator('.topbar .xp-pill')).toHaveText('120 XP');
  await expect(page.locator('.scene-object')).toHaveCount(8);
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('link', { name: 'Fremgang', exact: true }).click();
  await expect(page.locator('.milestone-list > div')).toHaveCount(2);
  await expect(page.getByText('Ikke vurdert', { exact: true })).toBeVisible();
  await expect(page.getByText('Ikke beregnet', { exact: true })).toBeVisible();
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('camera, contextual geography and diagram/list alternatives preserve meaning and accessibility', async ({
  page,
}, info) => {
  await page.goto('/explore');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
  await selectSubscription(page);
  await expect(page.locator('.context-inspector')).toContainText('Ikke regionalt');
  await page
    .locator('.context-inspector')
    .getByRole('button', { name: 'Lukk panelet', exact: true })
    .click();
  await page.getByRole('button', { name: 'Til oversikt', exact: true }).click();
  await expect(page.locator('.spatial-scene')).toHaveAttribute('data-camera', 'overview');
  await settleScene(page);
  if (page.viewportSize()!.width > 640) {
    const geometry = await page
      .locator('.object-subscription .prism-top')
      .first()
      .getAttribute('points');
    await page.getByRole('button', { name: 'Roter visningen mot høyre', exact: true }).click();
    await expect(page.locator('.object-subscription .prism-top').first()).not.toHaveAttribute(
      'points',
      geometry!,
    );
  }
  await page.getByRole('button', { name: 'Liste', exact: true }).click();
  await expect(page.locator('.scope-list button')).toHaveCount(8);
  await page.getByRole('button', { name: 'Resource group rg-webapp-dev', exact: true }).click();
  await expect(page.locator('.context-inspector')).toContainText('Norway East');
  await page.getByRole('button', { name: 'Sammenlign regioner', exact: true }).click();
  await expect(page.locator('.geography-layer')).toContainText('Norway East');
  await expect(page.locator('.geography-layer')).toContainText('West Europe');
  await checkAccessibility(page);
  await page.getByRole('button', { name: 'Lukk regionsammenligning', exact: true }).click();
  await page
    .locator('.context-inspector')
    .getByRole('button', { name: 'Lukk panelet', exact: true })
    .click();
  await page.getByRole('button', { name: 'Diagram', exact: true }).click();
  await expect(page.locator('.react-flow')).toBeVisible();
  await page
    .getByRole('button', { name: 'Microsoft Entra tenant AzureLab Directory', exact: true })
    .click();
  await expect(page.locator('.context-inspector')).toContainText('identitetskatalog');
  await page.getByText('Teknisk dybde', { exact: true }).click();
  await expect(page.locator('.technical-depth')).toContainText('ikke et geografisk sted');
  await checkAccessibility(page);
  for (const [route, label] of [
    ['/', 'hub-secondary'],
    ['/missions', 'missions'],
    ['/progress', 'progress'],
  ]) {
    await page.goto(route!);
    await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
    await capture(page, info, label!);
    await checkAccessibility(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('keyboard focus, native dialog trapping, escape and reduced motion work without spatial gestures', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/explore');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Hopp til innhold', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.locator('#scene-node-sub').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Learning Sandbox', exact: true })).toBeVisible();
  await expect(page.locator('.camera-world')).toHaveCSS('transition-duration', '0s');
  await page.getByRole('button', { name: 'Ny resource group', exact: true }).focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.getByLabel('Navn på resource group', { exact: true }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Lukk panelet', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(
    page.getByRole('button', { name: 'Opprett i simuleringen', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Ny resource group', exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('corrupted and unavailable storage remain usable; deleting learner data is explicit', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('azurelab.progress.v1', '{broken'));
  await page.goto('/progress');
  await expect(page.locator('.topbar .xp-pill')).toHaveText('0 XP');
  await page.getByRole('button', { name: 'Slett lokal fremgang', exact: true }).click();
  await page.getByRole('button', { name: 'Behold fremgangen', exact: true }).click();
  await page.getByRole('button', { name: 'Slett lokal fremgang', exact: true }).click();
  await page.getByRole('button', { name: 'Slett fremgangen nå', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Lokal fremgang er slettet.');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/explore');
  await expect(page.getByRole('status')).toContainText('tillater ikke lokal lagring');
  await selectSubscription(page);
  await createGroup(page);
  await expect(page.locator('.topbar .xp-pill')).toHaveText('80 XP');
});
