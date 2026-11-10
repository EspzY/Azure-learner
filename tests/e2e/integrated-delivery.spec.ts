import { nb } from '../../src/content/nb';
import { expect, test, type Page } from '@playwright/test';
import { laboratoryIntegratedDeliveryNb as d } from '../../src/content/laboratory-integrated-delivery-nb';
import { architectureStudioNb as studio } from '../../src/content/architecture-studio-nb';
import { laboratoryNetworkNb as network } from '../../src/content/laboratory-networking-nb';
import type { DeliveryCommand } from '../../src/laboratory/delivery/contract';
import { create } from './ephemeral-actions';
import {
  courseBytes,
  integratedApp,
  startIntegrated,
  expectIntegratedTitleIcon,
  expectIntegratedRowIcon,
  integratedOperation,
  integratedResponse,
  integratedWorld,
  service,
  storage,
} from './integrated-actions';

async function deliveryOperation(
  page: Page,
  family: string,
  type: DeliveryCommand['type'],
  values: Record<string, string>,
) {
  await service(page, family);
  return integratedOperation(
    page,
    d.operations[type],
    Object.fromEntries(
      Object.entries(values).map(([field, value]) => [
        d.fields[field as keyof typeof d.fields] ?? field,
        value,
      ]),
    ),
  );
}

async function openDelivery(page: Page, family: string, name: string) {
  await service(page, family);
  await page.getByRole('table').getByRole('link', { name, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText(name);
}

async function analyse(page: Page, path: string) {
  const panel = page.getByRole('region', { name: d.analysis, exact: true });
  await panel.getByRole('textbox', { name: d.path, exact: true }).fill(path);
  await panel.getByRole('button', { name: d.analyse, exact: true }).click();
  return panel.getByRole('region', { name: d.result, exact: true });
}

function committedCommands(page: Page) {
  const commands: string[] = [];
  page.on('request', (request) => {
    if (
      request.url().endsWith('/api/laboratory/ephemeral') &&
      request.method() === 'POST' &&
      request.postDataJSON().action === 'command'
    )
      commands.push(request.postData()!);
  });
  return commands;
}

test('integrated Front Door native WAF Prevention and Detection changes affect the actual configured delivery chain', async ({
  page,
}, info) => {
  const commands = committedCommands(page),
    ready = await integratedApp(page, 'delivery-waf'),
    base = integratedWorld(ready.configured),
    app = base.webApps[0]!,
    groupId = base.groups[0]!.id;
  const profileResult = await deliveryOperation(page, 'Front Door profiles', 'CreateFrontDoor', {
      name: 'afd-delivery-waf',
      groupId,
    }),
    profile = integratedWorld(profileResult).delivery.frontDoors[0]!;
  const endpointResult = await deliveryOperation(
      page,
      'Front Door endpoints',
      'CreateFrontDoorEndpoint',
      { name: 'endpoint-delivery-waf', profileId: profile.id },
    ),
    endpoint = integratedWorld(endpointResult).delivery.frontDoorEndpoints[0]!;
  const groupResult = await deliveryOperation(
      page,
      'Origin groups and synthetic probes',
      'CreateOriginGroup',
      { name: 'origins-delivery-waf', profileId: profile.id, probePath: '/health' },
    ),
    originGroup = integratedWorld(groupResult).delivery.originGroups[0]!;
  await deliveryOperation(page, 'Front Door origins', 'CreateFrontDoorOrigin', {
    name: 'origin-delivery-waf',
    originGroupId: originGroup.id,
    webAppId: app.id,
  });
  await deliveryOperation(page, 'Front Door routes', 'CreateFrontDoorRoute', {
    name: 'route-delivery-waf',
    endpointId: endpoint.id,
    originGroupId: originGroup.id,
    pattern: '/*',
  });
  const wafResult = await deliveryOperation(
      page,
      'Front Door WAF policies',
      'CreateFrontDoorWafPolicy',
      { name: 'DeliveryWaf', groupId, mode: 'Prevention' },
    ),
    waf = integratedWorld(wafResult).delivery.wafPolicies[0]!;
  await expectIntegratedTitleIcon(page, 'waf');
  await deliveryOperation(page, 'WAF custom rules', 'CreateFrontDoorWafRule', {
    name: 'block-delivery-path',
    policyId: waf.id,
    priority: '10',
    operator: 'BeginsWith',
    value: '/blocked',
    action: 'Block',
  });
  const secured = await deliveryOperation(
    page,
    'Front Door security policies',
    'CreateFrontDoorSecurityPolicy',
    {
      name: 'security-delivery-waf',
      profileId: profile.id,
      endpointId: endpoint.id,
      wafPolicyId: waf.id,
    },
  );
  expect(secured.receipt).toMatchObject({
    outcome: 'accepted',
    addedIds: [integratedWorld(secured).delivery.securityPolicies[0]!.id],
  });
  await openDelivery(page, 'Front Door endpoints', endpoint.name);
  const count = commands.length,
    blocked = await analyse(page, '/blocked');
  await expect(blocked).toContainText('blocked-by-waf');
  await expect(blocked).toContainText(waf.id);
  await expect(blocked).toContainText('Prevention');
  await expect(blocked).toContainText('laboratory@3.9.0');
  await expect(blocked).toContainText('not-verified');
  expect(commands).toHaveLength(count);
  await openDelivery(page, 'Front Door WAF policies', waf.name);
  const changed = await integratedOperation(
    page,
    d.operations.UpdateFrontDoorWafPolicy,
    { [d.fields.mode]: 'Detection' },
    'Save',
  );
  expect(changed.receipt).toMatchObject({
    outcome: 'accepted',
    updatedIds: [waf.id],
    integrationChange: {
      id: waf.id,
      createOrigin: waf.origin,
      before: { mode: 'Prevention' },
      after: { mode: 'Detection' },
    },
  });
  await openDelivery(page, 'Front Door endpoints', endpoint.name);
  await expect(page.getByRole('region', { name: d.result, exact: true })).toHaveCount(0);
  const afterChange = commands.length,
    consistent = await analyse(page, '/blocked');
  await expect(consistent).toContainText('configuration-consistent');
  await expect(consistent).toContainText('Detection');
  await expect(consistent).toContainText(app.id);
  await expect(consistent).toContainText('not-verified');
  await expect(page.getByText(d.analysisLimit, { exact: true })).toBeVisible();
  expect(commands).toHaveLength(afterChange);
  await page.screenshot({ path: info.outputPath('front-door-detection-analysis.png') });
  await page.locator('[data-portal-component="technical-evidence"] > summary').click();
  const originalReceipt = page.getByRole('link', { name: storage.receipt, exact: true });
  const originalLocation = new URL((await originalReceipt.getAttribute('href'))!, page.url());
  expect(originalLocation.pathname).toBe('/labs/laboratory');
  expect(originalLocation.searchParams.get('view')).toBe('history');
  expect(originalLocation.searchParams.get('receipt')).toBe(endpoint.origin);
  await originalReceipt.click();
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(
    'CreateFrontDoorEndpoint',
  );
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(endpoint.origin);
  expect(await courseBytes(page)).toBe(ready.before);
  await service(page, nb.portal.areas.resources);
  await expectIntegratedRowIcon(page, waf.name, 'waf');
  await page.screenshot({ path: info.outputPath('integrated-waf-family-row-icon.png') });
});

test('integrated private Application Gateway native configuration uses real subnet backend probe listener and routing references', async ({
  page,
}, info) => {
  const commands = committedCommands(page),
    ready = await integratedApp(page, 'delivery-gateway'),
    base = integratedWorld(ready.configured),
    app = base.webApps[0]!,
    groupId = base.groups[0]!.id;
  await service(page, network.vnets);
  await create(page, network.newVnet, {
    name: 'vnet-delivery-gateway',
    addressSpace: '10.6.0.0/16',
  });
  const subnetResult = await create(page, network.newSubnet, {
      name: 'subnet-delivery-gateway',
      addressPrefix: '10.6.1.0/24',
    }),
    subnet = integratedWorld(subnetResult).subnets[0]!;
  const gatewayResult = await deliveryOperation(
      page,
      'Application Gateways',
      'CreateApplicationGateway',
      {
        name: 'gateway-delivery',
        groupId,
        region: app.region,
        subnetId: subnet.id,
      },
    ),
    gateway = integratedWorld(gatewayResult).delivery.applicationGateways[0]!;
  await expectIntegratedTitleIcon(page, 'applicationGateway');
  expect(gateway).toMatchObject({
    subnetId: subnet.id,
    privateIp: '10.6.1.254',
    networkIsolation: true,
  });
  const poolResult = await deliveryOperation(
      page,
      'Gateway backend pools',
      'CreateGatewayBackendPool',
      { name: 'pool-delivery', gatewayId: gateway.id, webAppId: app.id },
    ),
    pool = integratedWorld(poolResult).delivery.backendPools[0]!;
  const probeResult = await deliveryOperation(
      page,
      'Gateway synthetic probes',
      'CreateGatewayProbe',
      { name: 'probe-delivery', gatewayId: gateway.id, path: '/health' },
    ),
    probe = integratedWorld(probeResult).delivery.gatewayProbes[0]!;
  const listenerResult = await deliveryOperation(
      page,
      'Gateway HTTP listeners',
      'CreateGatewayListener',
      { name: 'listener-delivery', gatewayId: gateway.id, port: '80' },
    ),
    listener = integratedWorld(listenerResult).delivery.gatewayListeners[0]!;
  const settingResult = await deliveryOperation(
      page,
      'Gateway HTTPS backend settings',
      'CreateGatewayBackendSetting',
      { name: 'setting-delivery', gatewayId: gateway.id, probeId: probe.id },
    ),
    setting = integratedWorld(settingResult).delivery.backendSettings[0]!;
  await deliveryOperation(page, 'Gateway routing rules', 'CreateGatewayRoutingRule', {
    name: 'rule-delivery',
    gatewayId: gateway.id,
    listenerId: listener.id,
    poolId: pool.id,
    settingId: setting.id,
    priority: '100',
  });
  await openDelivery(page, 'Application Gateways', gateway.name);
  const count = commands.length,
    consistent = await analyse(page, '/health');
  await expect(consistent).toContainText('configuration-consistent');
  await expect(consistent).toContainText(app.id);
  await expect(consistent).toContainText('not-verified');
  await expect(page.getByText(d.privateGateway, { exact: true })).toBeVisible();
  expect(commands).toHaveLength(count);
  await openDelivery(page, 'Gateway synthetic probes', probe.name);
  const changed = await integratedOperation(
    page,
    d.operations.UpdateGatewayProbe,
    { [d.fields.path]: '/unmodeled' },
    'Save',
  );
  expect(changed.receipt).toMatchObject({
    updatedIds: [probe.id],
    integrationChange: { id: probe.id, createOrigin: probe.origin, after: { path: '/unmodeled' } },
  });
  await openDelivery(page, 'Application Gateways', gateway.name);
  const afterChange = commands.length,
    undetermined = await analyse(page, '/health');
  await expect(undetermined).toContainText('undetermined');
  await expect(undetermined).toContainText('modeled-non-200');
  await expect(undetermined).toContainText('not-verified');
  await page.screenshot({ path: info.outputPath('private-gateway-probe-analysis.png') });
  await service(page, studio.title);
  await page.getByRole('button', { name: studio.list, exact: true }).click();
  await page
    .getByRole('table', { name: studio.list, exact: true })
    .getByRole('button', { name: `${gateway.name} · ${gateway.id}`, exact: true })
    .click();
  await expect(page.locator('.studio-inspector')).toContainText(subnet.name);
  await page.getByRole('link', { name: studio.open, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText(gateway.name);
  await page.locator('[data-portal-component="technical-evidence"] > summary').click();
  const originalReceipt = page.getByRole('link', { name: storage.receipt, exact: true });
  const originalLocation = new URL((await originalReceipt.getAttribute('href'))!, page.url());
  expect(originalLocation.pathname).toBe('/labs/laboratory');
  expect(originalLocation.searchParams.get('view')).toBe('history');
  expect(originalLocation.searchParams.get('receipt')).toBe(gateway.origin);
  await originalReceipt.click();
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(
    'CreateApplicationGateway',
  );
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(gateway.origin);
  expect(commands).toHaveLength(afterChange);
  expect(await courseBytes(page)).toBe(ready.before);
});

test('Portal fidelity native WAF association retains its pinned policy after a cross-subscription profile callback without committing rejected Review', async ({
  page,
}) => {
  await startIntegrated(page);
  const before = await courseBytes(page),
    commands = committedCommands(page);
  await create(page, storage.newGroup, { name: 'rg-policy-original' });
  await service(page, 'Front Door WAF policies');
  const original = await integratedOperation(page, d.operations.CreateFrontDoorWafPolicy, {
    [d.fields.name]: 'OriginalPinnedWaf',
    [d.fields.mode]: 'Prevention',
  });
  const waf = integratedWorld(original).delivery.wafPolicies[0]!;
  await service(page, 'Front Door profiles');
  const originalProfile = await integratedOperation(page, d.operations.CreateFrontDoor, {
    [d.fields.name]: 'original-pinned-profile',
  });
  await page
    .locator('[data-portal-component="resource-menu"]')
    .getByRole('button', { name: 'Endpoints', exact: true })
    .click();
  await integratedOperation(page, d.operations.CreateFrontDoorEndpoint, {
    [d.fields.name]: 'original-pinned-endpoint',
  });

  // A policy-context create must not silently switch its pinned WAF policy when
  // the original profile-change callback chooses another subscription's options.
  await service(page, nb.portal.areas.groups);
  const otherGroup = await create(page, storage.newGroup, {
    name: 'rg-other-waf-scope',
    subscriptionId: 'sub-app',
  });
  await service(page, 'Front Door profiles');
  const otherProfile = await integratedOperation(page, d.operations.CreateFrontDoor, {
    [d.fields.groupId]: otherGroup.receipt.addedIds[0]!,
    [d.fields.name]: 'other-waf-profile',
  });
  const otherProfileId = otherProfile.receipt.addedIds[0]!;
  await page
    .locator('[data-portal-component="resource-menu"]')
    .getByRole('button', { name: 'Endpoints', exact: true })
    .click();
  const otherEndpoint = await integratedOperation(page, d.operations.CreateFrontDoorEndpoint, {
    [d.fields.profileId]: otherProfileId,
    [d.fields.name]: 'other-waf-endpoint',
  });
  await service(page, 'Front Door WAF policies');
  await integratedOperation(page, d.operations.CreateFrontDoorWafPolicy, {
    [d.fields.groupId]: otherGroup.receipt.addedIds[0]!,
    [d.fields.name]: 'OtherScopeWaf',
    [d.fields.mode]: 'Prevention',
  });
  await openDelivery(page, 'Front Door WAF policies', waf.name);
  await page
    .locator('[data-portal-component="resource-menu"]')
    .getByRole('button', { name: 'Front Door associations', exact: true })
    .click();
  await page
    .getByRole('button', { name: d.operations.CreateFrontDoorSecurityPolicy, exact: true })
    .click();
  const form = page.locator('.lab-integrated-form');
  await form.getByLabel(d.fields.name, { exact: true }).fill('pinned-policy-attempt');
  await expect(form.getByLabel(d.fields.profileId, { exact: true })).toHaveValue(
    originalProfile.receipt.addedIds[0]!,
  );
  await form.getByLabel(d.fields.profileId, { exact: true }).selectOption(otherProfileId);
  await expect(form.getByLabel(d.fields.wafPolicyId, { exact: true })).toBeDisabled();
  await expect(form.getByLabel(d.fields.wafPolicyId, { exact: true })).toHaveValue(waf.id);
  await expect(form.getByLabel(d.fields.endpointId, { exact: true })).toHaveValue(
    otherEndpoint.receipt.addedIds[0]!,
  );
  const beforePinnedReview = commands.length,
    reviewed = integratedResponse(page, 'review');
  await form.getByRole('button', { name: 'Review + create', exact: true }).click();
  const reviewResponse = await reviewed,
    envelope = reviewResponse.request().postDataJSON();
  expect(envelope.request.command).toMatchObject({
    profileId: otherProfileId,
    endpointId: otherEndpoint.receipt.addedIds[0]!,
    wafPolicyId: waf.id,
  });
  expect((await reviewResponse.json()).preview).toMatchObject({
    outcome: 'rejected',
    code: 'incompatible-association',
  });
  await expect(form.getByRole('button', { name: 'Create', exact: true })).toBeDisabled();
  await form.getByRole('button', { name: 'Cancel', exact: true }).click();
  expect(commands).toHaveLength(beforePinnedReview);
  expect(await courseBytes(page)).toBe(before);
});
