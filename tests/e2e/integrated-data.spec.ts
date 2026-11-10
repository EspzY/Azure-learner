import { test, expect, type Page } from '@playwright/test';
import { nb } from '../../src/content/nb';
import { laboratoryIntegratedDataNb as d } from '../../src/content/laboratory-integrated-data-nb';
import { dataTypes } from '../../src/laboratory/data/contract';
import {
  integratedApp,
  expectIntegratedTitleIcon,
  expectIntegratedRowIcon,
  integratedOperation,
  integratedWorld,
  startIntegrated,
  service,
  courseBytes,
  memoryResponse,
  storage,
} from './integrated-actions';
import { create, openResource } from './ephemeral-actions';

function countCommands(page: Page) {
  let count = 0;
  page.on('request', (request) => {
    if (
      request.method() === 'POST' &&
      request.url().endsWith('/api/laboratory/ephemeral') &&
      request.postDataJSON().action === 'command'
    )
      count++;
  });
  return () => count;
}

async function deniedDelete(page: Page, label: string, targetLabel: string, targetId: string) {
  await page.getByRole('button', { name: label, exact: true }).click();
  const form = page.locator('.lab-integrated-form');
  await expect(form.getByLabel(targetLabel, { exact: true })).toBeDisabled();
  await expect(form.getByLabel(targetLabel, { exact: true })).toHaveValue(targetId);
  const response = memoryResponse(page, 'review');
  await form.getByRole('button', { name: /^Review \+ (?:create|save|delete)$/ }).click();
  const review = await (await response).json();
  expect(review.preview).toMatchObject({ outcome: 'rejected', code: 'cascade-delete-unsupported' });
  await expect(form.getByRole('button', { name: 'Delete', exact: true })).toBeDisabled();
  await form.getByRole('button', { name: 'Cancel', exact: true }).click();
}

test('integrated Function App uses actual Storage and FC1 parents for HTTP and blob configuration analysis and rejects dependent deletion', async ({
  page,
}, info) => {
  const commands = countCommands(page);
  await startIntegrated(page);
  const before = await courseBytes(page);
  await create(page, storage.newGroup, { name: 'rg-integrated-functions' });
  await service(page, storage.accounts);
  const account = await create(page, storage.newAccount, { name: 'integratedfunctions' });
  const accountId = account.receipt.addedIds[0]!;
  await expectIntegratedTitleIcon(page, 'account');
  const container = await create(page, storage.newContainer, { name: 'function-inputs' });
  const containerId = container.receipt.addedIds[0]!;
  const blobText = '<script>window.functionInputExecuted=true</script> synthetic blob';
  const blob = await create(page, storage.newBlob, { name: 'input.txt', text: blobText });
  const blobId = blob.receipt.addedIds[0]!;
  await service(page, d.types.functionApp);
  const created = await integratedOperation(page, d.operations.CreateFunctionApp, {
    [d.fields.name]: 'functions-integrated',
    [d.fields.planName]: 'plan-functions-integrated',
    [d.fields.storageAccountId]: accountId,
    [d.fields.deploymentContainerId]: containerId,
  });
  await expectIntegratedTitleIcon(page, 'functionApp');
  const world = integratedWorld(created),
    app = world.data.functionApps[0]!,
    plan = world.data.functionPlans[0]!;
  expect(app).toMatchObject({
    storageAccountId: accountId,
    deploymentContainerId: containerId,
    planId: plan.id,
  });
  expect(plan).toMatchObject({ ownerAppId: app.id, sku: 'FC1', os: 'Linux', origin: app.origin });
  expect(created.receipt.addedIds).toEqual([plan.id, app.id]);
  await service(page, d.types.function);
  const configured = await integratedOperation(page, d.operations.CreateFunction, {
    [d.fields.appId]: app.id,
    [d.fields.name]: 'http-integrated',
    [d.fields.behavior]: 'echo-text',
  });
  const http = integratedWorld(configured).data.functions[0]!;
  expect(http).toMatchObject({
    appId: app.id,
    trigger: { kind: 'http', method: 'GET', route: '/hello', authLevel: 'anonymous' },
  });
  await service(page, d.types.function);
  await openResource(page, http.name);
  const httpAnalysis = page.getByRole('region', { name: d.invocation, exact: true });
  const writesBeforeHttp = commands();
  await httpAnalysis.getByLabel(d.inputText, { exact: true }).fill(blobText);
  await httpAnalysis.getByRole('button', { name: d.evaluate, exact: true }).click();
  await expect(httpAnalysis.getByRole('status')).toHaveText(d.status['configuration-consistent']);
  await expect(httpAnalysis.locator('pre')).toHaveText(blobText);
  expect(await page.evaluate(() => Object.hasOwn(window, 'functionInputExecuted'))).toBe(false);
  expect(commands()).toBe(writesBeforeHttp);
  await httpAnalysis.getByLabel(d.path, { exact: true }).fill('/api/not-configured');
  await expect(httpAnalysis.getByRole('status')).toHaveCount(0);
  await httpAnalysis.getByRole('button', { name: d.evaluate, exact: true }).click();
  await expect(httpAnalysis.getByText('http-trigger-not-matched', { exact: true })).toBeVisible();
  const changed = await integratedOperation(
    page,
    d.operations.UpdateFunction,
    {
      [d.fields.route]: '/changed',
      [d.fields.behavior]: 'static-text',
      [d.fields.responseText]: 'Changed synthetic output',
    },
    'Save',
  );
  expect(changed.receipt).toMatchObject({
    updatedIds: [http.id],
    integrationChange: { id: http.id, createOrigin: http.origin },
  });
  await expect(httpAnalysis.getByRole('status')).toHaveCount(0);
  await expect(httpAnalysis.getByLabel(d.path, { exact: true })).toHaveValue('/api/changed');
  await httpAnalysis.getByRole('button', { name: d.evaluate, exact: true }).click();
  await expect(httpAnalysis.locator('pre')).toHaveText('Changed synthetic output');
  const writesBeforeNoop = commands();
  await page.getByRole('button', { name: d.operations.UpdateFunction, exact: true }).click();
  const noopReview = memoryResponse(page, 'review');
  await page
    .locator('.lab-integrated-form')
    .getByRole('button', { name: /^Review \+ (?:create|save|delete)$/ })
    .click();
  expect((await (await noopReview).json()).preview.code).toBe('no-change');
  await expect(
    page.locator('.lab-integrated-form').getByRole('button', { name: 'Save', exact: true }),
  ).toBeDisabled();
  await page
    .locator('.lab-integrated-form')
    .getByRole('button', { name: 'Cancel', exact: true })
    .click();
  expect(commands()).toBe(writesBeforeNoop);
  await service(page, d.types.function);
  const blobFunction = await integratedOperation(page, d.operations.CreateFunction, {
    [d.fields.appId]: app.id,
    [d.fields.name]: 'blob-integrated',
    [d.fields.trigger]: 'blob-event',
    [d.fields.containerId]: containerId,
    [d.fields.behavior]: 'echo-text',
  });
  const handler = integratedWorld(blobFunction).data.functions.find(
    (row) => row.name === 'blob-integrated',
  )!;
  expect(handler.trigger).toEqual({ kind: 'blob-event', containerId });
  await service(page, d.types.function);
  await openResource(page, handler.name);
  const blobAnalysis = page.getByRole('region', { name: d.invocation, exact: true });
  const writesBeforeBlob = commands();
  await blobAnalysis.getByRole('combobox', { name: d.blob, exact: true }).selectOption(blobId);
  await blobAnalysis.getByRole('button', { name: d.evaluate, exact: true }).click();
  await expect(blobAnalysis.getByRole('status')).toHaveText(d.status['configuration-consistent']);
  await expect(blobAnalysis.locator('pre')).toHaveText(blobText);
  await expect(blobAnalysis).toContainText('not-performed');
  expect(commands()).toBe(writesBeforeBlob);
  await service(page, d.types.functionApp);
  await openResource(page, app.name);
  await deniedDelete(page, d.operations.DeleteFunctionApp, d.fields.appId, app.id);
  expect(commands()).toBe(writesBeforeBlob);
  expect(await courseBytes(page)).toBe(before);
  await page.screenshot({ path: info.outputPath('integrated-function-storage-dependencies.png') });
  await service(page, nb.portal.areas.resources);
  await expectIntegratedRowIcon(page, app.name, 'functionApp');
  await expectIntegratedRowIcon(page, 'integratedfunctions', 'account');
  await expectIntegratedRowIcon(page, plan.name, 'plan');
  await page.screenshot({
    path: info.outputPath('integrated-function-and-storage-family-row-icons.png'),
  });
  await service(page, nb.portal.areas.plans);
  await expect(
    page.getByRole('table').getByRole('link', { name: plan.name, exact: true }),
  ).toBeVisible();
});

test('integrated SQL binding distinguishes unknown hypothetical IP firewall allowance and changed server configuration without runtime claims', async ({
  page,
}, info) => {
  const commands = countCommands(page);
  const setup = await integratedApp(page, 'sql-binding');
  const app = integratedWorld(setup.app).webApps[0]!;
  await service(page, d.types.sqlServer);
  const created = await integratedOperation(page, d.operations.CreateSqlServer, {
    [d.fields.name]: 'sql-integrated-binding',
  });
  const server = integratedWorld(created).data.sqlServers[0]!;
  await expectIntegratedTitleIcon(page, 'sqlServer');
  await service(page, d.types.sqlDatabase);
  const databaseCreated = await integratedOperation(page, d.operations.CreateSqlDatabase, {
    [d.fields.serverId]: server.id,
    [d.fields.name]: 'applicationdb',
  });
  const database = integratedWorld(databaseCreated).data.sqlDatabases[0]!;
  await expectIntegratedTitleIcon(page, 'sqlDatabase');
  expect(database.serverId).toBe(server.id);
  await service(page, d.types.databaseConnection);
  const bound = await integratedOperation(page, d.operations.CreateDatabaseConnection, {
    [d.fields.appId]: app.id,
    [d.fields.databaseId]: database.id,
  });
  const binding = integratedWorld(bound).data.databaseConnections[0]!;
  expect(binding).toMatchObject({
    source: { id: app.id, type: 'Microsoft.Web/sites' },
    database: { id: database.id, type: dataTypes.sqlDatabase },
    tls: '1.2',
  });
  await service(page, d.types.databaseConnection);
  await openResource(page, binding.name);
  const analysis = page.getByRole('region', { name: d.analysis, exact: true });
  const writesBeforeAnalysis = commands();
  await expect(analysis.getByLabel(d.sourceIp, { exact: true })).toHaveValue('');
  await analysis.getByRole('button', { name: d.analyse, exact: true }).click();
  await expect(analysis.getByText('source-egress-ip-unknown', { exact: true })).toBeVisible();
  await expect(analysis.getByRole('status')).toHaveText(d.status.undetermined);
  await analysis.getByLabel(d.sourceIp, { exact: true }).fill('203.0.113.10');
  await expect(analysis.getByRole('status')).toHaveCount(0);
  await analysis.getByRole('button', { name: d.analyse, exact: true }).click();
  await expect(analysis.getByText('source-ip-not-allowed', { exact: true })).toBeVisible();
  expect(commands()).toBe(writesBeforeAnalysis);
  await service(page, d.types.databaseFirewallRule);
  const ruleCreated = await integratedOperation(page, d.operations.CreateDatabaseFirewallRule, {
    [d.fields.serverId]: server.id,
    [d.fields.name]: 'allow-hypothetical-input',
    [d.fields.startIp]: '203.0.113.10',
    [d.fields.endIp]: '203.0.113.10',
  });
  expect(integratedWorld(ruleCreated).data.databaseFirewallRules[0]).toMatchObject({
    type: dataTypes.sqlFirewallRule,
    server: { id: server.id, type: dataTypes.sqlServer },
  });
  await service(page, d.types.databaseConnection);
  await openResource(page, binding.name);
  await expect(analysis.getByRole('status')).toHaveCount(0);
  await analysis.getByLabel(d.sourceIp, { exact: true }).fill('203.0.113.10');
  await analysis.getByRole('button', { name: d.analyse, exact: true }).click();
  await expect(analysis.getByRole('status')).toHaveText(d.status['configuration-consistent']);
  await expect(analysis).toContainText('not-evaluated');
  await expect(analysis.getByText(d.notRuntime, { exact: true })).toBeVisible();
  await service(page, d.types.sqlServer);
  await openResource(page, server.name);
  const changed = await integratedOperation(
    page,
    d.operations.UpdateSqlServer,
    { [d.fields.publicNetworkAccess]: 'Disabled' },
    'Save',
  );
  expect(changed.receipt).toMatchObject({
    updatedIds: [server.id],
    integrationChange: {
      id: server.id,
      createOrigin: server.origin,
      before: { publicNetworkAccess: 'Enabled' },
      after: { publicNetworkAccess: 'Disabled' },
    },
  });
  await service(page, d.types.databaseConnection);
  await openResource(page, binding.name);
  await expect(analysis.getByRole('status')).toHaveCount(0);
  await analysis.getByRole('button', { name: d.analyse, exact: true }).click();
  await expect(analysis.getByText('public-endpoint-disabled', { exact: true })).toBeVisible();
  await expect(analysis.getByRole('status')).toHaveText(d.status['denied-by-configuration']);
  const writesBeforeDeniedDelete = commands();
  await service(page, d.types.sqlDatabase);
  await openResource(page, database.name);
  await deniedDelete(page, d.operations.DeleteSqlDatabase, d.fields.databaseId, database.id);
  expect(commands()).toBe(writesBeforeDeniedDelete);
  expect(await courseBytes(page)).toBe(setup.before);
  await page.screenshot({ path: info.outputPath('integrated-sql-binding-dependency.png') });
});
