import { expect, test, type Page } from '@playwright/test';
import Axe from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { nb } from '../../src/content/nb';
import { laboratoryIntegratedDeliveryNb as delivery } from '../../src/content/laboratory-integrated-delivery-nb';
import { laboratoryIntegratedDataNb as data } from '../../src/content/laboratory-integrated-data-nb';
import { portalResourceContextNb as copy } from '../../src/content/portal-resource-context-nb';
import { create, service as globalService } from './ephemeral-actions';
import {
  courseBytes,
  integratedOperation,
  integratedResponse,
  integratedWorld,
  service,
  startIntegrated,
  storage,
} from './integrated-actions';

const familyMatrix = JSON.parse(
  readFileSync(
    new URL(
      '../../docs/reviews/evidence/portal-resource-fidelity/family-matrix.json',
      import.meta.url,
    ),
    'utf8',
  ),
) as { families: { view: string; classification: string }[] };

const byId = (page: Page, id: string) =>
  page.locator(`table a[href$="id=${id}"], table a[href*="id=${id}&"]`);

test('Portal fidelity scopes same-named profile children by actual IDs and preserves direct historical links original receipts and neutral navigation', async ({
  page,
}, info) => {
  await startIntegrated(page, true);
  const before = await courseBytes(page);
  // One complete actual-DOM negative census replaces repeated helper detours.
  await globalService(page, nb.portal.areas.services);
  const catalogViews = await page
    .locator('[data-portal-component="service-directory"] a')
    .evaluateAll((links) =>
      links.map((link) => new URL((link as HTMLAnchorElement).href).searchParams.get('view')),
    );
  const navigationViews = await page
    .getByRole('navigation', { name: storage.navigation, exact: true })
    .locator('a')
    .evaluateAll((links) =>
      links.map((link) => new URL((link as HTMLAnchorElement).href).searchParams.get('view')),
    );
  expect(familyMatrix.families).toHaveLength(47);
  for (const root of [
    'frontDoor',
    'frontDoorWafPolicy',
    'applicationGateway',
    'postgresServer',
    'sqlServer',
    'sqlDatabase',
    'functionApp',
  ])
    expect(catalogViews).toContain(root);
  for (const family of familyMatrix.families) {
    if (
      ['child', 'configuration', 'data'].includes(family.classification) ||
      family.view === 'functionPlan'
    ) {
      expect(catalogViews, family.view).not.toContain(family.view);
      expect(navigationViews, family.view).not.toContain(family.view);
    }
  }
  await globalService(page, nb.portal.areas.home);

  const commands: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().endsWith('/api/laboratory/command'))
      commands.push(request.postData()!);
  });
  const firstGroup = await create(
    page,
    storage.newGroup,
    {
      name: 'same-scope-name',
      subscriptionId: 'sub-shared',
    },
    false,
    'persistent',
  );
  await globalService(page, 'Front Door profiles');
  let result = await integratedOperation(page, delivery.operations.CreateFrontDoor, {
    [delivery.fields.name]: 'same-profile-name',
    [delivery.fields.groupId]: firstGroup.receipt.addedIds[0]!,
  });
  const firstProfile = integratedWorld(result).delivery.frontDoors[0]!;
  await service(page, 'Front Door endpoints');
  result = await integratedOperation(page, delivery.operations.CreateFrontDoorEndpoint, {
    [delivery.fields.name]: 'same-endpoint-name',
    [delivery.fields.profileId]: firstProfile.id,
  });
  const firstEndpoint = integratedWorld(result).delivery.frontDoorEndpoints[0]!;
  await globalService(page, nb.portal.areas.groups);
  const secondGroup = await create(
    page,
    storage.newGroup,
    {
      name: 'same-scope-name',
      subscriptionId: 'sub-app',
    },
    false,
    'persistent',
  );
  await globalService(page, 'Front Door profiles');
  result = await integratedOperation(page, delivery.operations.CreateFrontDoor, {
    [delivery.fields.name]: 'same-profile-name',
    [delivery.fields.groupId]: secondGroup.receipt.addedIds[0]!,
  });
  const secondProfile = integratedWorld(result).delivery.frontDoors.find(
    (profile) => profile.groupId === secondGroup.receipt.addedIds[0],
  )!;
  await globalService(page, 'Front Door profiles');
  await expect(byId(page, secondProfile.id)).toHaveCount(1);
  await byId(page, secondProfile.id).click();
  await page
    .locator('[data-portal-component="resource-menu"]')
    .getByRole('button', { name: 'Endpoints', exact: true })
    .click();
  await expect(page.getByText(copy.empty, { exact: true })).toBeVisible();
  await expect(byId(page, firstEndpoint.id)).toHaveCount(0);
  await page
    .getByRole('button', { name: delivery.operations.CreateFrontDoorEndpoint, exact: true })
    .click();
  const form = page.locator('.lab-integrated-form');
  await expect(form.getByLabel(delivery.fields.profileId, { exact: true })).toBeDisabled();
  await expect(form.getByLabel(delivery.fields.profileId, { exact: true })).toHaveValue(
    secondProfile.id,
  );
  await form.getByLabel(delivery.fields.name, { exact: true }).fill('other-endpoint-name');
  const checked = integratedResponse(page, 'review');
  await form.getByRole('button', { name: copy.reviewCreate, exact: true }).click();
  expect((await (await checked).json()).preview.outcome).toBe('accepted');
  await expect(form.locator('.portal-properties')).toContainText('App Sandbox');
  const created = integratedResponse(page, 'command');
  await form.getByRole('button', { name: 'Create', exact: true }).click();
  result = await (await created).json();
  expect(result.receipt.outcome).toBe('accepted');
  await expect(form).toHaveCount(0);
  const secondEndpoint = integratedWorld(result).delivery.frontDoorEndpoints.find(
    (endpoint) => endpoint.profileId === secondProfile.id,
  )!;
  expect(secondEndpoint.id).not.toBe(firstEndpoint.id);
  const count = commands.length;
  await globalService(page, nb.portal.areas.resources);
  await expect(byId(page, firstProfile.id)).toHaveCount(1);
  await expect(byId(page, secondProfile.id)).toHaveCount(1);
  await expect(byId(page, firstEndpoint.id)).toHaveCount(0);
  await expect(byId(page, secondEndpoint.id)).toHaveCount(0);
  const search = page.locator('.portal-header input[type="search"]');
  await search.fill('same-profile-name');
  const firstHit = page.locator(`.portal-search-results a[href$="id=${firstProfile.id}"]`),
    secondHit = page.locator(`.portal-search-results a[href$="id=${secondProfile.id}"]`);
  await expect(firstHit).toHaveCount(1);
  await expect(secondHit).toHaveCount(1);
  await expect(firstHit).toContainText('Shared Sandbox');
  await expect(secondHit).toContainText('App Sandbox');
  await search.press('Escape');
  await page.goto(`/labs/laboratory?view=frontDoorEndpoint&id=${firstEndpoint.id}`);
  await expect(page.locator('.portal-title h1')).toHaveText(firstEndpoint.name);
  await expect(page.locator('[data-portal-component="essentials"]')).toContainText(
    'Shared Sandbox',
  );
  await expect(page.locator('pre:visible')).toHaveCount(0);
  await page.locator('[data-portal-component="technical-evidence"] > summary').click();
  const original = page.getByRole('link', { name: storage.receipt, exact: true });
  expect(
    new URL((await original.getAttribute('href'))!, page.url()).searchParams.get('receipt'),
  ).toBe(firstEndpoint.origin);
  await original.click();
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(
    firstEndpoint.origin,
  );
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(
    'CreateFrontDoorEndpoint',
  );
  expect(commands).toHaveLength(count);
  expect(await courseBytes(page)).toBe(before);
  await page.screenshot({ path: info.outputPath('same-name-parent-and-original-receipt.png') });
});

test('Portal fidelity native Review readable Overview keyboard reduced motion Axe and compact parent menus retain real configuration boundaries', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startIntegrated(page);
  const before = await courseBytes(page);
  const initialViewport = page.viewportSize()!;
  const breadcrumbs = page.locator('.portal-breadcrumbs');
  // Home intentionally hides its breadcrumb trail; its DOM still has one Home.
  await expect(breadcrumbs).not.toBeVisible();
  await expect(breadcrumbs.locator('button')).toHaveText([nb.portal.areas.home]);
  await expect(breadcrumbs.locator('a')).toHaveCount(0);

  await page.getByRole('button', { name: storage.newGroup, exact: true }).click();
  const groupForm = page.locator('.lab-group-create');
  await expect(
    breadcrumbs.getByRole('link', { name: nb.portal.areas.groups, exact: true }),
  ).toHaveAttribute('href', '/labs/laboratory?view=groups');
  await expect(breadcrumbs.locator('[aria-current="page"]')).toHaveText(copy.groupTitle);

  await expect(groupForm.locator('fieldset > label')).toHaveCount(3);
  expect(
    await groupForm
      .locator('fieldset > label')
      .evaluateAll((labels) => labels.map((label) => label.childNodes[0]?.textContent?.trim())),
  ).toEqual([storage.subscription, copy.groupName, storage.region]);
  await expect(
    groupForm.getByRole('heading', { level: 2, name: copy.resourceDetails, exact: true }),
  ).toBeVisible();
  expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  await groupForm.getByLabel(copy.groupName, { exact: true }).fill('rg-readable-review');
  await page.screenshot({
    path: info.outputPath(
      `resource-group-basics-${initialViewport.width}x${initialViewport.height}.png`,
    ),
  });
  const groupChecked = integratedResponse(page, 'review');
  await groupForm.getByRole('button', { name: copy.reviewCreate, exact: true }).click();
  expect((await (await groupChecked).json()).preview.outcome).toBe('accepted');
  const groupReview = page.getByRole('region', { name: storage.review, exact: true });
  await expect(groupReview.getByRole('status')).toHaveText(copy.validationPassed);
  await expect(groupReview.locator('pre:visible')).toHaveCount(0);
  for (const viewport of [
    initialViewport,
    { width: 1440, height: 900 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(viewport);
    await groupReview.getByRole('button', { name: 'Create', exact: true }).scrollIntoViewIfNeeded();
    await page.screenshot({
      path: info.outputPath(`resource-group-review-${viewport.width}x${viewport.height}.png`),
    });
  }
  await page.setViewportSize(initialViewport);
  const groupCreated = integratedResponse(page, 'command');
  await groupReview.getByRole('button', { name: 'Create', exact: true }).click();
  const group = await (await groupCreated).json();
  expect(group.receipt.outcome).toBe('accepted');
  await expect(groupForm).toHaveCount(0);
  await globalService(page, data.types.postgresServer);
  await page
    .getByRole('button', { name: data.operations.CreatePostgresServer, exact: true })
    .click();
  const form = page.locator('.lab-integrated-form');
  await expect(form.locator('h2')).toBeFocused();
  await form.getByLabel(data.fields.name, { exact: true }).fill('readable-server');
  const reviewed = integratedResponse(page, 'review');
  await form.getByRole('button', { name: copy.reviewCreate, exact: true }).click();
  const review = await (await reviewed).json();
  expect(review.preview.outcome).toBe('accepted');
  await expect(form.getByRole('heading', { name: copy.reviewCreate, exact: true })).toBeFocused();
  await expect(form.getByRole('status')).toHaveText(copy.validationPassed);
  await expect(form).toContainText('rg-readable-review');
  await expect(form.locator('pre:visible')).toHaveCount(0);
  await expect(form.locator('details[open]')).toHaveCount(0);
  await expect(form.locator('fieldset')).not.toBeVisible();
  await form.getByRole('button', { name: copy.previous, exact: true }).click();
  await expect(form.getByLabel(data.fields.name, { exact: true })).toHaveValue('readable-server');
  const secondReview = integratedResponse(page, 'review');
  await form.getByRole('button', { name: copy.reviewCreate, exact: true }).click();
  expect((await (await secondReview).json()).preview.outcome).toBe('accepted');
  const committed = integratedResponse(page, 'command');
  await form.getByRole('button', { name: 'Create', exact: true }).click();
  const result = await (await committed).json();
  expect(result.receipt.addedIds).toHaveLength(1);
  expect(result.world.revision).toBe(group.world.revision + 1);
  await expect(page.locator('.portal-title h1')).toHaveText('readable-server');
  await expect(page.locator('[data-portal-component="essentials"]')).toContainText(copy.localState);
  await expect(page.locator('pre:visible')).toHaveCount(0);
  const menu = page.locator('[data-portal-component="resource-menu"]');
  for (const name of ['Databases', 'Networking', 'Configuration', 'Properties'])
    await expect(menu.getByRole('button', { name, exact: true })).toBeVisible();
  for (const name of ['Identity', 'Access control (IAM)', 'Tags', 'Metrics'])
    await expect(menu.getByRole('button', { name, exact: true })).toHaveCount(0);
  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.locator('[data-portal-component="essentials"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: info.outputPath(`readable-overview-${viewport.width}x${viewport.height}.png`),
    });
  }
  await menu.getByRole('button', { name: 'Networking', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { level: 2, name: 'Networking', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: data.operations.CreateDatabaseFirewallRule, exact: true }),
  ).toBeVisible();
  const axe = await new Axe({ page }).analyze();
  expect(
    axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')),
  ).toEqual([]);
  expect(await courseBytes(page)).toBe(before);
});
