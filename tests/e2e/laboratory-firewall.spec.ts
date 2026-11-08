import { test, expect, type Page } from '@playwright/test';
import Axe from '@axe-core/playwright';
import { laboratoryV3Nb as c, nb } from '../../src/content/nb';
import { laboratoryNetworkNb as n } from '../../src/content/laboratory-networking-nb';
import { laboratoryRoutingNb as r } from '../../src/content/laboratory-routing-nb';
import { laboratoryEndpointsNb as e } from '../../src/content/laboratory-endpoints-nb';
import { laboratoryComputeNb as m } from '../../src/content/laboratory-compute-nb';
import { laboratoryFirewallNb as f } from '../../src/content/laboratory-firewall-nb';
import { revealLaboratoryLink, closeLaboratoryDrawer } from './laboratory-actions';
import type { Snapshot, CommandResult } from '../../src/laboratory/engine';
const label = (key: string) =>
  [f.fields, m.fields, e.fields, r.fields, n.fields, c.fields]
    .map((map) => (map as Record<string, string>)[key])
    .find(Boolean) ?? key;
const oldBytes = (page: Page) =>
  page.evaluate(() =>
    JSON.stringify(
      Object.entries(localStorage)
        .filter(([k]) => k.startsWith('azurelab.'))
        .sort(),
    ),
  );
async function start(page: Page) {
  await page.goto('/');
  await page
    .getByRole('link', {
      name: 'Åpne laboratoriet · AzureLab Laboratory, separat arbeidsområde',
      exact: true,
    })
    .click();
  const response = page.waitForResponse(
    (x) => x.url().endsWith('/api/laboratory/session') && x.request().method() === 'POST',
  );
  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })
    .selectOption('laboratory@3.5.0');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  const s: Snapshot = await (await response).json();
  expect(s.world.model).toBe('laboratory@3.5.0');
  await expect(page.getByRole('button', { name: c.newGroup, exact: true })).toBeVisible();
  return s;
}
async function service(page: Page, name: string) {
  const link = page
    .getByRole('navigation', { name: c.navigation, exact: true })
    .getByRole('link', { name, exact: true });
  await revealLaboratoryLink(page, link);
  await link.click();
  await closeLaboratoryDrawer(page);
  await expect(page.locator('.portal-title h1')).toHaveText(name);
}
async function fill(page: Page, fields: Record<string, string>) {
  for (const [key, value] of Object.entries(fields)) {
    const target = page
      .locator('.lab-form')
      .getByLabel(key === 'name' ? c.name : label(key), { exact: true });
    if (await target.evaluate((el) => el.tagName === 'SELECT')) await target.selectOption(value);
    else await target.fill(value);
  }
}
async function commit(page: Page, title?: string, apply = false) {
  await page.getByRole('button', { name: c.review, exact: true }).click();
  const review = page.getByRole('region', { name: c.review, exact: true });
  await expect(review).toContainText('Konfigurasjonen er validert');
  if (title === 'fw-hub')
    await page.screenshot({ path: test.info().outputPath('firewall-review.png') });
  const response = page.waitForResponse(
    (x) => x.url().endsWith('/api/laboratory/command') && x.request().method() === 'POST',
  );
  await review.getByRole('button', { name: apply ? n.apply : c.create, exact: true }).click();
  const result: CommandResult = await (await response).json();
  expect(result.receipt.outcome).toBe('accepted');
  if (title) await expect(page.locator('.portal-title h1')).toHaveText(title);
  return result;
}
async function create(page: Page, button: string, fields: Record<string, string>, apply = false) {
  await page.getByRole('button', { name: button, exact: true }).click();
  await fill(page, fields);
  if (button === f.operations.CreateAzureFirewall && fields.name === 'fw-hub')
    await page.screenshot({ path: test.info().outputPath('firewall-create.png') });
  return commit(page, fields.name, apply);
}
async function open(page: Page, name: string) {
  await page.getByRole('link', { name, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText(name);
}
async function baseFirewall(page: Page) {
  await start(page);
  const before = await oldBytes(page);
  let result = await create(page, c.newGroup, { name: 'rg-firewall' });
  const group = result.receipt.addedIds[0]!;
  const vn: Record<string, string> = {},
    sn: Record<string, string> = {};
  for (const [name, addressSpace, subname, addressPrefix] of [
    ['vnet-hub', '10.0.0.0/16', 'AzureFirewallSubnet', '10.0.0.0/26'],
    ['vnet-app', '10.10.0.0/16', 'snet-app', '10.10.1.0/24'],
    ['vnet-data', '10.20.0.0/16', 'snet-data', '10.20.1.0/24'],
  ]) {
    await service(page, n.vnets);
    result = await create(page, n.newVnet, { name: name!, addressSpace: addressSpace! });
    vn[name!] = result.receipt.addedIds[0]!;
    result = await create(page, n.newSubnet, { name: subname!, addressPrefix: addressPrefix! });
    sn[subname!] = result.receipt.addedIds[0]!;
  }
  await service(page, f.policies);
  result = await create(page, f.operations.CreateFirewallPolicy, { name: 'fw-policy-hub' });
  const policy = result.receipt.addedIds[0]!;
  result = await create(page, f.operations.CreateFirewallRuleCollectionGroup, {
    name: 'workloads',
    priority: '200',
  });
  const collectionGroup = result.receipt.addedIds[0]!;
  result = await create(page, f.operations.CreateFirewallNetworkCollection, {
    name: 'allow-data',
    priority: '200',
    action: 'Allow',
  });
  const collection = result.receipt.addedIds[0]!;
  result = await create(page, f.operations.CreateFirewallNetworkRule, {
    name: 'app-sql',
    source: '10.10.1.0/24',
    destination: '10.20.1.0/24',
    protocol: 'Tcp',
    destinationPort: '1433',
  });
  const rule = result.receipt.addedIds[0]!;
  await service(page, f.firewalls);
  result = await create(page, f.operations.CreateAzureFirewall, {
    name: 'fw-hub',
    subnetId: sn.AzureFirewallSubnet!,
    policyId: policy,
  });
  const firewall = result.receipt.addedIds[0]!,
    publicIp = result.receipt.addedIds[1]!;
  return {
    before,
    group,
    vn,
    sn,
    policy,
    collectionGroup,
    collection,
    rule,
    firewall,
    publicIp,
    result,
  };
}
async function topology(page: Page) {
  const s = await baseFirewall(page),
    peers: Record<string, string> = {};
  let result = s.result;
  for (const [local, remote, name] of [
    ['vnet-hub', 'vnet-app', 'hub-app'],
    ['vnet-app', 'vnet-hub', 'app-hub'],
    ['vnet-hub', 'vnet-data', 'hub-data'],
    ['vnet-data', 'vnet-hub', 'data-hub'],
  ]) {
    await service(page, n.vnets);
    await open(page, local!);
    await page.getByRole('link', { name: r.peerings, exact: true }).click();
    result = await create(page, r.operations.CreateVnetPeering, {
      name: name!,
      vnetId: s.vn[local!]!,
      remoteVnetId: s.vn[remote!]!,
    });
    peers[name!] = result.receipt.addedIds[0]!;
    if (name === 'app-hub' || name === 'data-hub') {
      await create(page, f.operations.SetPeeringForwardedTraffic, { value: 'true' }, true);
      await expect(page.locator('.portal-title h1')).toHaveText(name);
    }
  }
  const tables: Record<string, string> = {},
    routes: Record<string, string> = {};
  for (const [name, prefix, subnetName] of [
    ['rt-app', '10.20.0.0/16', 'snet-app'],
    ['rt-data', '10.10.0.0/16', 'snet-data'],
  ]) {
    await service(page, r.tables);
    result = await create(page, r.operations.CreateRouteTable, { name: name! });
    tables[name!] = result.receipt.addedIds[0]!;
    result = await create(page, r.operations.CreateRoute, {
      nextHopType: 'VirtualAppliance',
      name: 'to-' + (name === 'rt-app' ? 'data' : 'app'),
      addressPrefix: prefix!,
      firewallId: s.firewall,
      nextHopIp: '10.0.0.4',
    });
    routes[name!] = result.receipt.addedIds[0]!;
    await service(page, n.vnets);
    await open(page, name === 'rt-app' ? 'vnet-app' : 'vnet-data');
    await open(page, subnetName!);
    await create(
      page,
      r.operations.AssociateSubnetRouteTable,
      { routeTableId: tables[name!]! },
      true,
    );
  }
  const vms: Record<string, string> = {},
    nics: Record<string, string> = {};
  for (const [name, vnet, subnet, ip] of [
    ['vm-app-01', 'vnet-app', 'snet-app', '10.10.1.10'],
    ['vm-data-01', 'vnet-data', 'snet-data', '10.20.1.10'],
  ]) {
    await service(page, m.vms);
    result = await create(page, m.create, {
      name: name!,
      vnetId: s.vn[vnet!]!,
      subnetId: s.sn[subnet!]!,
      privateIpAddress: ip!,
    });
    vms[name!] = result.receipt.addedIds[0]!;
    nics[name!] = result.receipt.addedIds[1]!;
  }
  for (const [name, subnet, direction, port] of [
    ['nsg-app', 'snet-app', 'Outbound', '*'],
    ['nsg-data', 'snet-data', 'Inbound', '1433'],
  ]) {
    await service(page, n.nsgs);
    result = await create(page, n.newNsg, { name: name! });
    const nsg = result.receipt.addedIds[0]!;
    await create(page, n.newRule, {
      name: 'rule-' + name,
      direction: direction!,
      priority: '200',
      protocol: 'Tcp',
      source: '10.10.1.0/24',
      sourcePort: '*',
      destination: '10.20.1.0/24',
      destinationPort: port!,
      access: 'Allow',
    });
    await service(page, n.vnets);
    await open(page, name === 'nsg-app' ? 'vnet-app' : 'vnet-data');
    await open(page, subnet!);
    result = await create(page, n.associate, { nsgId: nsg }, true);
  }
  return { ...s, peers, tables, routes, vms, nics, result };
}
async function analyse(page: Page, nics: Record<string, string>, port = '1433') {
  await service(page, f.analysis);
  await page
    .getByRole('combobox', { name: e.source, exact: true })
    .selectOption(nics['vm-app-01']!);
  await page
    .getByRole('combobox', { name: e.destination, exact: true })
    .selectOption(nics['vm-data-01']!);
  await page.getByRole('textbox', { name: e.destinationPort, exact: true }).fill(port);
  await page.getByRole('button', { name: e.calculate, exact: true }).click();
  await expect(page.locator('[data-firewall-outcome]')).toBeVisible();
}
test('firewall native hub spoke inspection uses actual VM NICs, collection policy, original Firewall Public IP receipt and reload', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const s = await topology(page);
  await analyse(page, s.nics);
  await expect(page.locator('[data-firewall-outcome]')).toHaveAttribute(
    'data-firewall-outcome',
    'allowed-via-firewall',
  );
  await expect(page.locator('.lab-firewall-path')).toContainText(f.assessed);
  await expect(page.locator('.lab-firewall-path')).toContainText('app-sql');
  await page.screenshot({ path: info.outputPath('firewall-inspection-allow.png') });
  for (const height of [768, 500]) {
    await page.setViewportSize({ width: 1024, height });
    await page.locator('.lab-firewall-path').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-firewall-outcome]')).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: info.outputPath(`inspection-1024x${height}.png`) });
  }
  expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await analyse(page, s.nics, '3389');
  await expect(page.locator('[data-firewall-outcome]')).toHaveAttribute(
    'data-firewall-outcome',
    'denied-by-firewall',
  );
  await expect(page.locator('.lab-firewall-path')).toContainText(
    f.reasons['firewall-default-deny'],
  );
  await service(page, f.firewalls);
  await open(page, 'fw-hub');
  await expect(page.locator('#lab-main')).toContainText('10.0.0.4');
  await page.screenshot({ path: info.outputPath('firewall-overview.png') });
  await page.getByRole('link', { name: c.receipt, exact: true }).click();
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(s.firewall);
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(s.publicIp);
  await page.goBack();
  await expect(page.locator('.portal-title h1')).toHaveText('fw-hub');
  await page.reload();
  await expect(page.locator('.portal-title h1')).toHaveText('fw-hub');
  expect(await oldBytes(page)).toBe(s.before);
  const final = await page.request.get('/api/laboratory/state').then((r) => r.json());
  expect(final.world).toEqual(s.result.world);
  expect(final.entries).toEqual(s.result.entries);
});

test('firewall native source UDR forwarding and return mutations expose the actual incomplete or dropped leg without starting traffic', async ({
  page,
}, info) => {
  const s = await topology(page);
  await service(page, r.tables);
  await open(page, 'rt-data');
  await open(page, 'to-app');
  await create(page, f.operations.DeleteRoute, {}, true);
  await expect(page.locator('.portal-title h1')).toHaveText('rt-data');
  await analyse(page, s.nics);
  await expect(page.locator('[data-firewall-outcome]')).toHaveAttribute(
    'data-firewall-outcome',
    'incomplete',
  );
  await expect(page.locator('.lab-firewall-path')).toContainText(
    f.reasons['return-route-not-same-firewall'],
  );
  await page.screenshot({ path: info.outputPath('missing-return.png') });
  await service(page, r.tables);
  await open(page, 'rt-data');
  await create(page, r.operations.CreateRoute, {
    nextHopType: 'VirtualAppliance',
    name: 'to-app',
    addressPrefix: '10.10.0.0/16',
    firewallId: s.firewall,
    nextHopIp: '10.0.0.4',
  });
  await service(page, n.vnets);
  await open(page, 'vnet-data');
  await page.getByRole('link', { name: r.peerings, exact: true }).click();
  await open(page, 'data-hub');
  await create(page, f.operations.SetPeeringForwardedTraffic, { value: 'false' }, true);
  await analyse(page, s.nics);
  await expect(page.locator('.lab-firewall-path')).toContainText(
    f.reasons['destination-forwarding-disabled'],
  );
  await expect(page.locator('[data-firewall-outcome]')).toHaveAttribute(
    'data-firewall-outcome',
    'incomplete',
  );
  await service(page, r.tables);
  await open(page, 'rt-app');
  await open(page, 'to-data');
  await create(page, f.operations.DeleteRoute, {}, true);
  await analyse(page, s.nics);
  await expect(page.locator('[data-firewall-outcome]')).toHaveAttribute(
    'data-firewall-outcome',
    'routing-drop',
  );
  await expect(page.locator('.lab-firewall-path')).toContainText(f.reasons['source-route-none']);
  expect(await oldBytes(page)).toBe(s.before);
});

test('firewall native hierarchy priority default deny and NSG conflict retain concrete decisive rules and invalidate older analyses', async ({
  page,
}, info) => {
  const s = await topology(page);
  await analyse(page, s.nics);
  await expect(page.locator('[data-firewall-outcome]')).toHaveAttribute(
    'data-firewall-outcome',
    'allowed-via-firewall',
  );
  await service(page, n.nsgs);
  await open(page, 'nsg-data');
  await create(page, n.newRule, {
    name: 'deny-sql',
    direction: 'Inbound',
    priority: '100',
    protocol: 'Tcp',
    source: '*',
    sourcePort: '*',
    destination: '*',
    destinationPort: '1433',
    access: 'Deny',
  });
  await analyse(page, s.nics);
  await expect(page.locator('[data-firewall-outcome]')).toHaveAttribute(
    'data-firewall-outcome',
    'denied-by-nsg',
  );
  await expect(page.locator('.lab-firewall-path')).toContainText('deny-sql');
  await expect(page.locator('.lab-firewall-path')).toContainText('app-sql');
  await page.screenshot({ path: info.outputPath('nsg-firewall-conflict.png') });
  await service(page, f.policies);
  await open(page, 'fw-policy-hub');
  await open(page, 'workloads');
  await create(page, f.operations.CreateFirewallNetworkCollection, {
    name: 'deny-rdp',
    priority: '100',
    action: 'Deny',
  });
  await create(page, f.operations.CreateFirewallNetworkRule, {
    name: 'rdp-rule',
    source: '*',
    destination: '*',
    protocol: 'Tcp',
    destinationPort: '3389',
  });
  await analyse(page, s.nics, '3389');
  await expect(page.locator('[data-firewall-outcome]')).toHaveAttribute(
    'data-firewall-outcome',
    'denied-by-firewall',
  );
  await expect(page.locator('.lab-firewall-path')).toContainText('rdp-rule');
  await expect(page.locator('.lab-firewall-path')).toContainText('deny-rdp');
  await analyse(page, s.nics, '9999');
  await expect(page.locator('.lab-firewall-path')).toContainText(
    f.reasons['firewall-default-deny'],
  );
  expect(await oldBytes(page)).toBe(s.before);
});

test('firewall native rejected Review validates subnet name profile scope next hop rule expressions and priority without persisting phantom resources', async ({
  page,
}) => {
  const s = await baseFirewall(page),
    before = await page.request.get('/api/laboratory/state').then((r) => r.json());
  const denied = async (text: string) => {
    await page.getByRole('button', { name: c.review, exact: true }).click();
    const review = page.getByRole('region', { name: c.review, exact: true });
    await expect(review).toContainText(text);
    await expect(review.getByRole('button', { name: c.create, exact: true })).toBeDisabled();
    await page.getByRole('button', { name: c.cancel, exact: true }).click();
  };
  await service(page, f.firewalls);
  await page.getByRole('button', { name: f.operations.CreateAzureFirewall, exact: true }).click();
  await fill(page, { name: 'wrong-region', region: 'westeurope' });
  await denied(f.codes['incompatible-association']);
  await service(page, n.vnets);
  await open(page, 'vnet-hub');
  await page.getByRole('button', { name: n.newSubnet, exact: true }).click();
  await fill(page, { name: 'AzureFirewallSubnet', addressPrefix: '10.0.1.0/27' });
  await denied(f.codes['invalid-firewall-subnet']);
  await service(page, f.policies);
  await open(page, 'fw-policy-hub');
  await open(page, 'workloads');
  await page
    .getByRole('button', { name: f.operations.CreateFirewallNetworkCollection, exact: true })
    .click();
  await fill(page, { name: 'same-priority', priority: '200' });
  await denied(f.codes['priority-conflict']);
  await page
    .getByRole('button', { name: f.operations.CreateFirewallNetworkCollection, exact: true })
    .click();
  await fill(page, { name: 'bad-priority', priority: '65001' });
  await denied(f.codes['invalid-priority']);
  await open(page, 'allow-data');
  await page
    .getByRole('button', { name: f.operations.CreateFirewallNetworkRule, exact: true })
    .click();
  await fill(page, { name: 'bad-rule', source: 'Internet' });
  await denied(f.codes['invalid-firewall-rule']);
  const after = await page.request.get('/api/laboratory/state').then((r) => r.json());
  expect(after).toEqual(before);
  expect(await oldBytes(page)).toBe(s.before);
});

test('firewall native same IP in overlapping hubs cannot be resolved by inventory identity or falsely reported as inspected success', async ({
  page,
  context,
}, info) => {
  const s = await topology(page);
  await analyse(page, s.nics);
  await expect(page.locator('[data-firewall-outcome]')).toHaveAttribute(
    'data-firewall-outcome',
    'allowed-via-firewall',
  );
  const editor = await context.newPage();
  await editor.goto('/labs/laboratory');
  await service(editor, n.vnets);
  let result = await create(editor, n.newVnet, {
    name: 'vnet-other-hub',
    addressSpace: '10.0.0.0/24',
  });
  const hub = result.receipt.addedIds[0]!;
  result = await create(editor, n.newSubnet, {
    name: 'AzureFirewallSubnet',
    addressPrefix: '10.0.0.0/26',
  });
  const subnet = result.receipt.addedIds[0]!;
  await service(editor, f.firewalls);
  await create(editor, f.operations.CreateAzureFirewall, {
    name: 'fw-other',
    subnetId: subnet,
    policyId: s.policy,
  });
  for (const [local, remote, name] of [
    ['vnet-app', hub, 'app-other-hub'],
    ['vnet-other-hub', s.vn['vnet-app']!, 'other-hub-app'],
  ]) {
    await service(editor, n.vnets);
    await open(editor, local!);
    await editor.getByRole('link', { name: r.peerings, exact: true }).click();
    await create(editor, r.operations.CreateVnetPeering, { name: name!, remoteVnetId: remote! });
  }
  await expect(page.getByText(e.stale, { exact: true })).toBeVisible();
  await expect(page.locator('[data-firewall-outcome]')).toHaveCount(0);
  await editor.close();
  await analyse(page, s.nics);
  await expect(page.locator('[data-firewall-outcome]')).toHaveAttribute(
    'data-firewall-outcome',
    'incomplete',
  );
  await expect(page.locator('.lab-firewall-path')).toContainText(
    f.reasons['firewall-next-hop-not-direct'],
  );
  await expect(page.locator('.lab-firewall-path')).toContainText(f.incomplete);
  await page.screenshot({ path: info.outputPath('next-hop-wrong-hub.png') });
});

test('firewall compact native Policy Properties Review keyboard focus reduced motion Axe and short desktop keep real controls and evidence readable', async ({
  page,
}, info) => {
  const s = await baseFirewall(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await service(page, f.firewalls);
  await open(page, 'fw-hub');
  for (const size of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(size);
    await expect(page.locator('#lab-main')).toContainText('10.0.0.4');
    await expect(page.locator('.portal-title h1')).toHaveText('fw-hub');
    expect((await new Axe({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: info.outputPath(`firewall-${size.width}x${size.height}.png`) });
  }
  await page.getByRole('button', { name: nb.portalUi.properties, exact: true }).click();
  await expect(page.locator('.portal-properties')).toContainText(s.policy);
  await page.getByRole('link', { name: c.receipt, exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-portal-component="receipt"]')).toContainText(s.publicIp);
  await service(page, f.policies);
  await open(page, 'fw-policy-hub');
  await page
    .getByRole('button', { name: f.operations.CreateFirewallRuleCollectionGroup, exact: true })
    .click();
  await fill(page, { name: 'keyboard-group', priority: '65000' });
  await page.getByRole('button', { name: c.review, exact: true }).focus();
  await page.keyboard.press('Enter');
  const review = page.getByRole('region', { name: c.review, exact: true });
  await expect(review).toContainText('65000');
  await expect(review.getByRole('button', { name: c.create, exact: true })).toBeInViewport();
  expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  expect(await oldBytes(page)).toBe(s.before);
});

test('firewall native untouched dedicated subnet default matches posted Review and owning scope after an ordinary subnet in another group and region', async ({
  page,
}, info) => {
  await start(page);
  let result = await create(page, c.newGroup, { name: 'rg-ordinary-first' });
  const ordinaryGroup = result.receipt.addedIds[0]!;
  await service(page, n.vnets);
  await create(page, n.newVnet, {
    name: 'ordinary-first',
    groupId: ordinaryGroup,
    addressSpace: '10.70.0.0/16',
  });
  await create(page, n.newSubnet, { name: 'ordinary', addressPrefix: '10.70.1.0/24' });
  await service(page, f.policies);
  await create(page, f.operations.CreateFirewallPolicy, {
    name: 'incompatible-first-policy',
    groupId: ordinaryGroup,
  });
  await service(page, f.firewalls);
  await expect(
    page.getByRole('button', { name: f.operations.CreateAzureFirewall, exact: true }),
  ).toBeDisabled();
  await service(page, c.groups);
  result = await create(page, c.newGroup, { name: 'rg-hub-second' });
  const group = result.receipt.addedIds[0]!;
  await service(page, n.vnets);
  await create(page, n.newVnet, {
    name: 'hub-second',
    groupId: group,
    region: 'westeurope',
    addressSpace: '10.80.0.0/16',
  });
  result = await create(page, n.newSubnet, {
    name: 'AzureFirewallSubnet',
    addressPrefix: '10.80.0.0/26',
  });
  const subnet = result.receipt.addedIds[0]!;
  await service(page, f.policies);
  result = await create(page, f.operations.CreateFirewallPolicy, {
    name: 'policy-second',
    groupId: group,
    region: 'westeurope',
  });
  const policy = result.receipt.addedIds[0]!;
  await service(page, f.firewalls);
  await page.getByRole('button', { name: f.operations.CreateAzureFirewall, exact: true }).click();
  await fill(page, { name: 'fw-default' });
  await expect(
    page.locator('.lab-form').getByLabel(label('subnetId'), { exact: true }),
  ).toHaveValue(subnet);
  const previewResponse = page.waitForResponse((x) => x.url().endsWith('/api/laboratory/review'));
  await page.getByRole('button', { name: c.review, exact: true }).click();
  const response = await previewResponse;
  const posted = response.request().postDataJSON().command;
  expect(posted.subnetId).toBe(subnet);
  expect(posted.groupId).toBe(group);
  expect(posted.region).toBe('westeurope');
  expect(posted.policyId).toBe(policy);
  const review = page.getByRole('region', { name: c.review, exact: true });
  await expect(review).toContainText('Konfigurasjonen er validert');
  await page.screenshot({ path: info.outputPath('firewall-default-review.png') });
  const created = page.waitForResponse((x) => x.url().endsWith('/api/laboratory/command'));
  await review.getByRole('button', { name: c.create, exact: true }).click();
  result = await (await created).json();
  expect(result.receipt.outcome).toBe('accepted');
  expect(result.receipt.addedIds).toHaveLength(2);
  await expect(page.locator('.portal-title h1')).toHaveText('fw-default');
  await page.reload();
  await expect(page.locator('#lab-main')).toContainText('hub-second');
});

test('firewall shared Portal menu uses actual viewport during pending media delivery and Escape closes the drawer without technical writes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    const native = matchMedia.bind(window);
    const pending: (() => void)[] = [];
    const gate = {
      hold: false,
      release() {
        this.hold = false;
        for (const call of pending.splice(0)) call();
      },
    };
    (window as unknown as { __labMediaGate: typeof gate }).__labMediaGate = gate;
    window.matchMedia = (query) => {
      const media = native(query);
      if (query !== '(max-width:1100px)') return media;
      const add = media.addEventListener.bind(media),
        remove = media.removeEventListener.bind(media);
      const wrappers = new Map<EventListenerOrEventListenerObject, EventListener>();
      media.addEventListener = ((
        type: string,
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions,
      ) => {
        if (!listener) return;
        if (type !== 'change') return add(type, listener, options);
        const wrapped: EventListener = (event) => {
          const run = () =>
            typeof listener === 'function'
              ? listener.call(media, event)
              : listener.handleEvent(event);
          if (gate.hold) pending.push(run);
          else run();
        };
        wrappers.set(listener, wrapped);
        add(type, wrapped, options);
      }) as typeof media.addEventListener;
      media.removeEventListener = ((
        type: string,
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | EventListenerOptions,
      ) => {
        if (listener) remove(type, wrappers.get(listener) ?? listener, options);
      }) as typeof media.removeEventListener;
      return media;
    };
  });
  const initial = await start(page),
    before = await oldBytes(page);
  await page.evaluate(() => {
    (window as unknown as { __labMediaGate: { hold: boolean } }).__labMediaGate.hold = true;
  });
  await page.setViewportSize({ width: 1024, height: 500 });
  const nav = page.getByRole('navigation', { name: c.navigation, exact: true });
  await expect(nav).not.toBeVisible();
  await page.getByRole('button', { name: nb.portal.menu, exact: true }).click();
  await expect(nav).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(nav).not.toBeVisible();
  await page.getByRole('button', { name: nb.portal.menu, exact: true }).click();
  await expect(nav).toBeVisible();
  await closeLaboratoryDrawer(page);
  await expect(nav).not.toBeVisible();
  await page.evaluate(() => {
    (window as unknown as { __labMediaGate: { release: () => void } }).__labMediaGate.release();
  });
  // Recreate the old helper's stale decision: read desktop aria state after CSS
  // resized, then act after the real media event reaches React. A toggle opens
  // the drawer; the idempotent Escape close must dismiss that actual overlay.
  await page.setViewportSize({ width: 1440, height: 900 });
  const toggle = page.getByRole('button', { name: nb.portal.menu, exact: true });
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.evaluate(() => {
    (window as unknown as { __labMediaGate: { hold: boolean } }).__labMediaGate.hold = true;
  });
  await page.setViewportSize({ width: 1024, height: 500 });
  await expect(nav).not.toBeVisible();
  expect(await toggle.getAttribute('aria-expanded')).toBe('true');
  await page.evaluate(() => {
    (window as unknown as { __labMediaGate: { release: () => void } }).__labMediaGate.release();
  });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(nav).toBeVisible();
  await closeLaboratoryDrawer(page);
  await expect(nav).not.toBeVisible();
  const after = await page.request.get('/api/laboratory/state').then((r) => r.json());
  expect(after.world).toEqual(initial.world);
  expect(after.entries).toEqual(initial.entries);
  expect(await oldBytes(page)).toBe(before);
});
