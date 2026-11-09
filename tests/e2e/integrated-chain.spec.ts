import { test, expect } from '@playwright/test';
import Axe from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import { laboratoryNetworkNb as network } from '../../src/content/laboratory-networking-nb';
import { laboratoryComputeNb as compute } from '../../src/content/laboratory-compute-nb';
import { laboratoryIntegratedDataNb as data } from '../../src/content/laboratory-integrated-data-nb';
import { laboratoryIntegratedDeliveryNb as delivery } from '../../src/content/laboratory-integrated-delivery-nb';
import {
  integratedApp,
  integratedIconFiles,
  integratedFamilyKinds,
  expectIntegratedTitleIcon,
  expectIntegratedRowIcon,
  integratedOperation,
  integratedWorld,
  service,
  courseBytes,
  memoryResponse,
  integratedResponse,
  startIntegrated,
  storage,
} from './integrated-actions';
import { create } from './ephemeral-actions';

test('integrated3.9 default native Portal forms commit the actual app PostgreSQL binding FrontDoor chain and one Studio authority', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const base = await integratedApp(page, 'integrated-chain'),
    app = integratedWorld(base.app).webApps[0]!;
  const expectedIcons = integratedFamilyKinds;
  await service(page, nb.portal.areas.services);
  const actualIcons = await page
    .locator('[data-portal-component="service-directory"]')
    .locator('a')
    .evaluateAll((links) =>
      links.map((link) => {
        const icon = link.querySelector('[data-icon]'),
          image = link.querySelector('img');
        return {
          view: new URL((link as HTMLAnchorElement).href).searchParams.get('view'),
          kind: icon?.getAttribute('data-icon'),
          family: icon?.getAttribute('data-icon-source'),
          src: image?.getAttribute('src'),
          loaded: image ? image.complete && image.naturalWidth > 0 : true,
        };
      }),
    );
  const globalFamilies = new Set([
    'frontDoor',
    'frontDoorWafPolicy',
    'applicationGateway',
    'postgresServer',
    'sqlServer',
    'sqlDatabase',
    'functionApp',
  ]);
  for (const [view, kind] of Object.entries(expectedIcons)) {
    const row = actualIcons.find((row) => row.view === view);
    if (!globalFamilies.has(view)) {
      expect(row, `${view} belongs in resource context, not All services`).toBeUndefined();
      await expect(
        page
          .getByRole('navigation', { name: storage.navigation, exact: true })
          .locator(`a[href*="view=${view}&"], a[href$="view=${view}"]`),
      ).toHaveCount(0);
      continue;
    }
    expect(row, view).toMatchObject({
      kind,
      family: kind === 'settings' ? 'fluent' : 'azure',
      loaded: true,
    });
    expect(row?.kind, view).not.toBe('resources');
    if (kind !== 'settings')
      expect(row?.src, view).toBe('/icons/azure/' + integratedIconFiles[kind]);
  }
  await service(page, data.types.postgresServer);
  let made = await integratedOperation(page, data.operations.CreatePostgresServer, {
    [data.fields.name]: 'chain-postgres',
  });
  const server = integratedWorld(made).data.postgresServers[0]!;
  await expectIntegratedTitleIcon(page, 'postgresServer');
  await service(page, data.types.postgresDatabase);
  made = await integratedOperation(page, data.operations.CreatePostgresDatabase, {
    [data.fields.name]: 'appdata',
    [data.fields.serverId]: server.id,
  });
  const database = integratedWorld(made).data.postgresDatabases[0]!;
  await service(page, data.types.databaseConnection);
  made = await integratedOperation(page, data.operations.CreateDatabaseConnection, {
    [data.fields.appId]: app.id,
    [data.fields.databaseId]: database.id,
    [data.fields.settingName]: 'APP_DATABASE',
  });
  const binding = integratedWorld(made).data.databaseConnections[0]!;
  await page
    .getByRole('region', { name: data.analysis, exact: true })
    .getByRole('button', { name: data.analyse, exact: true })
    .click();
  await expect(page.getByRole('region', { name: data.analysis, exact: true })).toContainText(
    'source-egress-ip-unknown',
  );
  await service(page, 'Front Door profiles');
  made = await integratedOperation(page, delivery.operations.CreateFrontDoor, {
    [delivery.fields.name]: 'chain-frontdoor',
  });
  const profile = integratedWorld(made).delivery.frontDoors[0]!;
  await expectIntegratedTitleIcon(page, 'frontDoor');
  await service(page, 'Front Door endpoints');
  made = await integratedOperation(page, delivery.operations.CreateFrontDoorEndpoint, {
    [delivery.fields.name]: 'chain-endpoint',
    [delivery.fields.profileId]: profile.id,
  });
  const endpoint = integratedWorld(made).delivery.frontDoorEndpoints[0]!;
  await service(page, 'Origin groups and synthetic probes');
  made = await integratedOperation(page, delivery.operations.CreateOriginGroup, {
    [delivery.fields.name]: 'chain-origins',
    [delivery.fields.profileId]: profile.id,
  });
  const group = integratedWorld(made).delivery.originGroups[0]!;
  await service(page, 'Front Door origins');
  made = await integratedOperation(page, delivery.operations.CreateFrontDoorOrigin, {
    [delivery.fields.name]: 'chain-origin',
    [delivery.fields.originGroupId]: group.id,
    [delivery.fields.webAppId]: app.id,
  });
  expect(made.receipt.integrationChange).toMatchObject({
    createOrigin: made.receipt.commandId,
    after: { webAppId: app.id },
  });
  await service(page, 'Front Door routes');
  made = await integratedOperation(page, delivery.operations.CreateFrontDoorRoute, {
    [delivery.fields.name]: 'chain-route',
    [delivery.fields.endpointId]: endpoint.id,
    [delivery.fields.originGroupId]: group.id,
  });
  await service(page, 'Front Door endpoints');
  await page.getByRole('link', { name: endpoint.name, exact: true }).click();
  const analysis = page.getByRole('region', { name: delivery.analysis, exact: true });
  await analysis.getByRole('button', { name: delivery.analyse, exact: true }).click();
  await expect(analysis).toContainText(delivery.statuses['configuration-consistent']);
  await expect(analysis).toContainText('not-verified');
  expect(integratedWorld(made).data.databaseConnections[0]!.source.id).toBe(app.id);
  expect(integratedWorld(made).data.databaseConnections[0]!.database.id).toBe(database.id);
  expect(made.entries.every((entry) => entry.receipt.outcome === 'accepted')).toBe(true);
  await page.screenshot({ path: info.outputPath('integrated-chain-1440x900.png') });
  await service(page, nb.portal.areas.resources);
  await expectIntegratedRowIcon(page, server.name, 'postgresServer');
  await expectIntegratedRowIcon(page, profile.name, 'frontDoor');
  for (const name of ['chain-postgres', 'chain-frontdoor', app.name])
    await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
  await service(page, 'Architecture Studio');
  await expect(page.locator('.architecture-studio')).toContainText(binding.name);
  await expect(page.locator('.architecture-studio')).toContainText('chain-origin');
  await expect(page.locator('.architecture-studio')).toContainText(app.name);
  await service(page, network.vnets);
  await create(page, network.newVnet, {
    name: 'vnet-icon-regression',
    addressSpace: '10.88.0.0/16',
  });
  await create(page, network.newSubnet, {
    name: 'compute-icon-regression',
    addressPrefix: '10.88.1.0/24',
  });
  await service(page, compute.vms);
  await create(page, compute.create, {
    name: 'vm-icon-regression',
    privateIpAddress: '10.88.1.10',
  });
  await expectIntegratedTitleIcon(page, 'vm');
  await service(page, nb.portal.areas.resources);
  await expectIntegratedRowIcon(page, 'vm-icon-regression', 'vm');
  await page.screenshot({
    path: info.outputPath('integrated-official-family-and-inherited-row-icons.png'),
  });
  expect(await courseBytes(page)).toBe(base.before);
});

test('integrated3.9 compact native Review keyboard focus reduced motion Axe and short desktop keep typed configuration readable', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const initialViewport = page.viewportSize()!;
  if (info.project.name === 'compact-chromium')
    expect(initialViewport).toEqual({ width: 800, height: 700 });
  await startIntegrated(page);
  const before = await courseBytes(page);
  await create(page, storage.newGroup, { name: 'rg-integrated-access' });
  await service(page, data.types.postgresServer);
  await page
    .getByRole('button', { name: data.operations.CreatePostgresServer, exact: true })
    .click();
  await expect(page.locator('.lab-integrated-form h2')).toBeFocused();
  await page
    .locator('.lab-integrated-form')
    .getByLabel(data.fields.name, { exact: true })
    .fill('accessible-postgres');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('SELECT');
  const reviewed = memoryResponse(page, 'review');
  await page
    .locator('.lab-integrated-form')
    .getByRole('button', { name: /^Review \+ (?:create|save|delete)$/ })
    .click();
  expect((await (await reviewed).json()).preview.outcome).toBe('accepted');
  await expect(
    page
      .locator('.lab-integrated-form')
      .getByRole('heading', { name: 'Review + create', exact: true }),
  ).toBeFocused();
  await page.screenshot({
    path: info.outputPath(
      `integrated-initial-${initialViewport.width}x${initialViewport.height}.png`,
    ),
  });
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(viewport);
    await page
      .locator('.lab-integrated-form')
      .getByRole('button', { name: 'Create', exact: true })
      .scrollIntoViewIfNeeded();
    await expect(
      page.locator('.lab-integrated-form').getByRole('button', { name: 'Create', exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath(`integrated-review-${viewport.width}x${viewport.height}.png`),
    });
  }
  const axe = await new Axe({ page }).analyze();
  expect(
    axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')),
  ).toEqual([]);
  await page
    .locator('.lab-integrated-form')
    .getByRole('button', { name: 'Cancel', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: data.operations.CreatePostgresServer, exact: true }),
  ).toBeFocused();
  expect(await courseBytes(page)).toBe(before);
});

test('integrated3.9 native empty Storage deletion blocks Function dependencies and lands on original committed delete receipts', async ({
  page,
}, info) => {
  await startIntegrated(page);
  const before = await courseBytes(page);
  await create(page, storage.newGroup, { name: 'rg-storage-lifecycle' });
  await service(page, storage.accounts);
  const account = await create(page, storage.newAccount, { name: 'lifecyclestorage' });
  const container = await create(page, storage.newContainer, { name: 'deployment' });
  await service(page, data.types.functionApp);
  const fn = await integratedOperation(page, data.operations.CreateFunctionApp, {
    [data.fields.name]: 'lifecycle-functions',
    [data.fields.planName]: 'lifecycle-hosting',
  });
  await service(page, storage.accounts);
  await page.getByRole('link', { name: 'lifecyclestorage', exact: true }).click();
  await page.getByRole('link', { name: 'deployment', exact: true }).click();
  await page.getByRole('button', { name: 'Delete blob container', exact: true }).click();
  const denied = memoryResponse(page, 'review');
  await page
    .locator('.lab-integrated-form')
    .getByRole('button', { name: /^Review \+ (?:create|save|delete)$/ })
    .click();
  expect((await (await denied).json()).preview.code).toBe('resource-in-use');
  await expect(
    page.locator('.lab-integrated-form').getByRole('button', { name: 'Delete', exact: true }),
  ).toBeDisabled();
  await page
    .locator('.lab-integrated-form')
    .getByRole('button', { name: 'Cancel', exact: true })
    .click();
  await service(page, data.types.functionApp);
  await page.getByRole('link', { name: 'lifecycle-functions', exact: true }).click();
  const removedApp = await integratedOperation(
    page,
    data.operations.DeleteFunctionApp,
    {},
    'Delete',
  );
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(
    'DeleteFunctionApp',
  );
  expect(integratedWorld(removedApp).data.functionPlans).toEqual([]);
  await service(page, storage.accounts);
  await page.getByRole('link', { name: 'lifecyclestorage', exact: true }).click();
  await page.getByRole('link', { name: 'deployment', exact: true }).click();
  const removedContainer = await integratedOperation(page, 'Delete blob container', {}, 'Delete');
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(
    'DeleteBlobContainer',
  );
  expect(removedContainer.receipt.integrationChange?.createOrigin).toBe(
    integratedWorld(container).containers[0]!.origin,
  );
  await service(page, storage.accounts);
  await page.getByRole('link', { name: 'lifecyclestorage', exact: true }).click();
  const removedAccount = await integratedOperation(page, 'Delete storage account', {}, 'Delete');
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(
    'DeleteStorageAccount',
  );
  expect(removedAccount.receipt.integrationChange?.createOrigin).toBe(
    integratedWorld(account).accounts[0]!.origin,
  );
  expect(integratedWorld(removedAccount).accounts).toEqual([]);
  expect(integratedWorld(removedAccount).nextId).toBe(integratedWorld(fn).nextId);
  await page.getByRole('link', { name: account.receipt.commandId, exact: true }).click();
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(
    'CreateStorageAccount',
  );
  expect(await courseBytes(page)).toBe(before);
  await page.screenshot({
    path: info.outputPath('integrated-original-storage-create-after-delete.png'),
  });
});
test('integrated3.9 PostgreSQL native reload and same-value Function Review preserve verifiable JSONB history before a real configuration change', async ({
  page,
}, info) => {
  await startIntegrated(page, true);
  const before = await courseBytes(page);
  await integratedOperation(
    page,
    storage.newGroup,
    { [storage.name]: 'rg-persistent-noop' },
    storage.create,
  );
  await service(page, storage.accounts);
  await integratedOperation(
    page,
    storage.newAccount,
    { [storage.name]: 'persistnoopstorage' },
    storage.create,
  );
  await integratedOperation(
    page,
    storage.newContainer,
    { [storage.name]: 'deployment' },
    storage.create,
  );
  await service(page, data.types.functionApp);
  await integratedOperation(page, data.operations.CreateFunctionApp, {
    [data.fields.name]: 'persistent-noop-functions',
    [data.fields.planName]: 'persistent-noop-hosting',
  });
  await service(page, data.types.function);
  const configured = await integratedOperation(page, data.operations.CreateFunction, {
    [data.fields.name]: 'http-persistent-noop',
    [data.fields.responseText]: 'Persistent synthetic output',
  });
  const fn = integratedWorld(configured).data.functions[0]!;
  const loaded = page.waitForResponse(
    (response) =>
      response.request().method() === 'GET' && response.url().endsWith('/api/laboratory/state'),
  );
  await page.reload();
  const jsonb = await (await loaded).json();
  expect(jsonb.world.model).toBe('laboratory@3.9.0');
  expect(jsonb.entries).toHaveLength(configured.entries.length);
  await expect(page.locator('.portal-title h1')).toHaveText(fn.name);
  await page.getByRole('button', { name: data.operations.UpdateFunction, exact: true }).click();
  const review = integratedResponse(page, 'review');
  await page
    .locator('.lab-integrated-form')
    .getByRole('button', { name: /^Review \+ (?:create|save|delete)$/ })
    .click();
  expect((await (await review).json()).preview).toMatchObject({
    outcome: 'rejected',
    code: 'no-change',
    beforeRevision: jsonb.world.revision,
    afterRevision: jsonb.world.revision,
  });
  await expect(
    page.locator('.lab-integrated-form').getByRole('button', { name: 'Save', exact: true }),
  ).toBeDisabled();
  await page
    .locator('.lab-integrated-form')
    .getByRole('button', { name: 'Cancel', exact: true })
    .click();
  const changed = await integratedOperation(
    page,
    data.operations.UpdateFunction,
    { [data.fields.responseText]: 'Changed persistent synthetic output' },
    'Save',
  );
  expect(changed.receipt.integrationChange).toMatchObject({
    id: fn.id,
    createOrigin: fn.origin,
    before: { responseText: 'Persistent synthetic output' },
    after: { responseText: 'Changed persistent synthetic output' },
  });
  expect(changed.entries).toHaveLength(configured.entries.length + 1);
  await page.reload();
  await expect(page.locator('.portal-title h1')).toHaveText(fn.name);
  await expect(
    page.getByText('Changed persistent synthetic output', { exact: true }),
  ).toBeVisible();
  expect(await courseBytes(page)).toBe(before);
  await page.screenshot({ path: info.outputPath('integrated-pg-jsonb-noop-and-real-change.png') });
});
