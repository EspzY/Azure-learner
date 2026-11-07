import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { laboratoryV3Nb as c, nb } from '../../src/content/nb';
import { laboratoryNetworkNb as n } from '../../src/content/laboratory-networking-nb';
import { laboratoryEndpointsNb as e } from '../../src/content/laboratory-endpoints-nb';
import { revealLaboratoryLink, closeLaboratoryDrawer } from './laboratory-actions';
const state = (page: Page) => page.request.get('/api/laboratory/state').then((r) => r.json());
const bytes = (page: Page) =>
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
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.getByRole('button', { name: c.newGroup, exact: true })).toBeVisible();
  expect((await state(page)).world.model).toBe('laboratory@3.3.0');
}
async function service(page: Page, name: string) {
  const link = page
    .getByRole('navigation', { name: c.navigation, exact: true })
    .getByRole('link', { name, exact: true });
  await revealLaboratoryLink(page, link);
  await link.click();
  await closeLaboratoryDrawer(page);
}
async function choose(page: Page, label: string, part: string) {
  const select = page.getByRole('combobox', { name: label, exact: true }),
    option = select.locator('option').filter({ hasText: part });
  await select.selectOption((await option.first().getAttribute('value'))!);
}
async function commit(page: Page, name: string, apply = false) {
  await page.getByRole('button', { name: c.review, exact: true }).click();
  const review = page.getByRole('region', { name: c.review, exact: true });
  await expect(review).toContainText('Konfigurasjonen er validert');
  await review.getByRole('button', { name: apply ? n.apply : c.create, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText(name);
}
async function topology(page: Page) {
  await start(page);
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('rg-endpoints');
  await commit(page, 'rg-endpoints');
  await service(page, n.vnets);
  await page.getByRole('button', { name: n.newVnet, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('vnet-app');
  await page.getByRole('textbox', { name: n.addressSpace, exact: true }).fill('10.10.0.0/16');
  await commit(page, 'vnet-app');
  for (const [name, prefix] of [
    ['snet-web', '10.10.1.0/24'],
    ['snet-data', '10.10.2.0/24'],
  ]) {
    await service(page, n.vnets);
    await page.getByRole('link', { name: 'vnet-app', exact: true }).click();
    await page.getByRole('button', { name: n.newSubnet, exact: true }).click();
    await page.getByRole('textbox', { name: c.name, exact: true }).fill(name!);
    await page.getByRole('textbox', { name: n.addressPrefix, exact: true }).fill(prefix!);
    await commit(page, name!);
  }
  for (const [name, subnet, ip] of [
    ['nic-web', 'snet-web', '10.10.1.10'],
    ['nic-data', 'snet-data', '10.10.2.10'],
  ]) {
    await createNic(page, name!, subnet!, ip!);
    await commit(page, name!);
  }
}
async function createNic(page: Page, name: string, subnet: string, ip: string) {
  await service(page, e.nics);
  await page
    .getByRole('button', { name: e.operations.CreateNetworkInterface, exact: true })
    .click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill(name);
  await choose(page, n.subnet, subnet);
  await page.getByRole('textbox', { name: e.fields.privateIpAddress, exact: true }).fill(ip);
}
async function nsg(page: Page, name: string) {
  await service(page, n.nsgs);
  await page.getByRole('button', { name: n.newNsg, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill(name);
  await commit(page, name);
}
async function rule(
  page: Page,
  name: string,
  priority: string,
  port: string,
  access: string,
  source = '10.10.1.10',
  direction = 'Inbound',
  protocol = 'Tcp',
) {
  await page.getByRole('button', { name: n.newRule, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill(name);
  await page.getByRole('textbox', { name: n.priority, exact: true }).fill(priority);
  await page.getByRole('combobox', { name: n.direction, exact: true }).selectOption(direction);
  await page.getByRole('combobox', { name: n.protocol, exact: true }).selectOption(protocol);
  await page.getByRole('textbox', { name: n.source, exact: true }).fill(source);
  await page.getByRole('textbox', { name: n.destination, exact: true }).fill('10.10.2.10');
  await page.getByRole('textbox', { name: n.destinationPort, exact: true }).fill(port);
  await page.getByRole('combobox', { name: n.access, exact: true }).selectOption(access);
  await commit(page, name);
}
async function analyse(page: Page, port = '1433', source = 'nic-web', protocol = 'Tcp') {
  await service(page, e.analysis);
  await choose(page, e.source, source);
  await choose(page, e.destination, 'nic-data');
  await page.getByRole('combobox', { name: e.protocol, exact: true }).selectOption(protocol);
  await page.getByRole('textbox', { name: e.destinationPort, exact: true }).fill(port);
  await page.getByRole('button', { name: e.calculate, exact: true }).click();
  await expect(page.getByRole('heading', { name: e.result, exact: true })).toBeVisible();
}
test('endpoint Laboratory native NIC subnet and NIC NSG layers explain1433 allow3389 deny priority alternate source UDP receipts reload and disassociation without course writes', async ({
  page,
}, info) => {
  await page.goto('/learn');
  const old = await bytes(page);
  await topology(page);
  const nicUrl = page.url();
  await nsg(page, 'nsg-data');
  await rule(page, 'allow-database', '100', '1433', 'Allow');
  await service(page, n.nsgs);
  await page.getByRole('link', { name: 'nsg-data', exact: true }).click();
  await rule(page, 'deny-other', '200', '*', 'Deny', '10.10.1.0/24', 'Inbound', '*');
  await service(page, n.vnets);
  await page.getByRole('link', { name: 'vnet-app', exact: true }).click();
  await page.getByRole('link', { name: 'snet-data', exact: true }).click();
  await page.getByRole('button', { name: n.associate, exact: true }).click();
  await commit(page, 'snet-data', true);
  await analyse(page);
  await expect(page.locator('.lab-policy-outcome')).toHaveText(
    e.statuses['allowed-by-modeled-network-policy'],
  );
  await expect(page.locator('.lab-policy-layers')).toContainText('allow-database');
  await page.screenshot({ path: info.outputPath('policy-allow.png') });
  const before = await state(page);
  await analyse(page, '3389');
  await expect(page.locator('.lab-policy-outcome')).toHaveText(
    e.statuses['denied-by-modeled-network-policy'],
  );
  await expect(page.locator('.lab-policy-layers')).toContainText('deny-other');
  expect(await state(page)).toEqual(before);
  await analyse(page, '1433', 'nic-web', 'Udp');
  await expect(page.locator('.lab-policy-outcome')).toHaveText(
    e.statuses['denied-by-modeled-network-policy'],
  );
  await createNic(page, 'nic-other', 'snet-web', '10.10.1.11');
  await commit(page, 'nic-other');
  await analyse(page, '1433', 'nic-other');
  await expect(page.locator('.lab-policy-outcome')).toHaveText(
    e.statuses['denied-by-modeled-network-policy'],
  );
  await nsg(page, 'nsg-web');
  await rule(page, 'nic-block', '100', '1433', 'Deny');
  await page.goto(nicUrl);
  await page.getByRole('button', { name: e.operations.AssociateNicNsg, exact: true }).click();
  await choose(page, n.nsg, 'nsg-web');
  await commit(page, 'nic-data', true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('nic-nsg.png') });
  await analyse(page);
  await expect(page.locator('.lab-policy-outcome')).toHaveText(
    e.statuses['denied-by-modeled-network-policy'],
  );
  const layers = page.locator('.lab-policy-layers>li');
  await expect(layers.nth(2)).toContainText('Tillater');
  await expect(layers.nth(3)).toContainText('nic-block');
  await page.screenshot({ path: info.outputPath('policy-nic-deny.png') });
  await page
    .locator('.lab-policy-layers > li')
    .nth(3)
    .getByText('Regelrekkefølge og matchdetaljer', { exact: true })
    .click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const submitted = await state(page);
  await page.reload();
  await analyse(page);
  expect(await state(page)).toEqual(submitted);
  await page.goto(nicUrl);
  await page.getByRole('button', { name: e.operations.DisassociateNicNsg, exact: true }).click();
  await commit(page, 'nic-data', true);
  await analyse(page);
  await expect(page.locator('.lab-policy-outcome')).toHaveText(
    e.statuses['allowed-by-modeled-network-policy'],
  );
  await page.goto(nicUrl);
  await page
    .locator('.portal-resource-menu')
    .getByRole('button', { name: nb.portalUi.properties, exact: true })
    .click();
  await expect(page.locator('.portal-properties')).toContainText('10.10.2.10');
  await page.screenshot({ path: info.outputPath('nic-properties.png') });
  const latest = await state(page);
  const historical = await page.request.get(
    '/api/laboratory/state?through=' + submitted.entries.length,
  );
  expect((await historical.json()).world).toEqual(submitted.world);
  await page.goBack();
  await page.goForward();
  expect(await state(page)).toEqual(latest);
  expect(await bytes(page)).toBe(old);
});
test('endpoint Laboratory native invalid reserved duplicate IP incompatible region strict review and original receipts remain atomic', async ({
  page,
}) => {
  await topology(page);
  const before = await state(page);
  await createNic(page, 'nic-invalid', 'snet-web', '10.10.1.1');
  for (const [ip, code] of [
    ['not-ip', 'invalid-private-ip'],
    ['10.10.1.1', 'reserved-private-ip'],
    ['10.10.1.10', 'duplicate-private-ip'],
    ['10.10.2.50', 'outside-subnet'],
  ]) {
    await page.getByRole('textbox', { name: e.fields.privateIpAddress, exact: true }).fill(ip!);
    await page.getByRole('button', { name: c.review, exact: true }).click();
    const review = page.getByRole('region', { name: c.review, exact: true });
    await expect(review).toContainText(e.codes[code as keyof typeof e.codes]);
    await expect(review.getByRole('button', { name: c.create, exact: true })).toBeDisabled();
    expect(await state(page)).toEqual(before);
  }
  await page
    .getByRole('textbox', { name: e.fields.privateIpAddress, exact: true })
    .fill('10.10.1.12');
  await page.getByRole('combobox', { name: c.region, exact: true }).selectOption('westeurope');
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await expect(page.getByRole('region', { name: c.review, exact: true })).toContainText(
    e.associationError,
  );
  expect(await state(page)).toEqual(before);
  await page.getByRole('combobox', { name: c.region, exact: true }).selectOption('norwayeast');
  await commit(page, 'nic-invalid');
  const created = await state(page);
  await page.getByRole('link', { name: c.receipt, exact: true }).click();
  await page.getByText(c.details, { exact: true }).click();
  expect(JSON.parse((await page.locator('.lab-result pre').textContent())!)).toEqual(
    created.entries.at(-1),
  );
});
test('endpoint Laboratory real same-session tabs concurrent revision idempotency isolated cookie old v2 and read-only stale analysis stay conservative', async ({
  page,
  context,
  browser,
}) => {
  await topology(page);
  const original = await state(page),
    other = await context.newPage();
  await other.goto('/labs/laboratory');
  expect(await state(other)).toEqual(original);
  const requests = ['nic-a', 'nic-b'].map((name) => ({
    commandId: crypto.randomUUID(),
    expectedRevision: original.world.revision,
    command: {
      type: 'CreateNetworkInterface',
      name,
      groupId: original.world.groups[0].id,
      region: 'norwayeast',
      vnetId: original.world.vnets[0].id,
      subnetId: original.world.subnets[0].id,
      privateIpAddress: '10.10.1.12',
      allocation: 'Static',
    },
  }));
  const post = (p: Page, request: unknown) =>
    p.request
      .post('/api/laboratory/command', {
        headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': original.workspace },
        data: request,
      })
      .then((r) => r.json());
  const results = await Promise.all([post(page, requests[0]), post(other, requests[1])]);
  expect(results.map((x) => x.receipt.code).sort()).toEqual(['created', 'stale-revision']);
  const winner = results.find((x) => x.receipt.code === 'created')!,
    request = requests.find((x) => x.commandId === winner.receipt.commandId)!;
  expect((await post(page, request)).receipt).toEqual(winner.receipt);
  await other.reload();
  expect(await state(other)).toEqual(await state(page));
  const isolated = await browser.newContext();
  try {
    const outsider = await isolated.newPage();
    await outsider.goto('/labs/laboratory');
    expect((await state(outsider)).error).toBe('session-required');
  } finally {
    await isolated.close();
  }
  const old = await bytes(page);
  await other.goto('/portal?area=groups');
  await expect(other.locator('[data-portal-mode="course"]')).toBeVisible();
  const actual = await state(page);
  await analyse(page);
  expect(await state(page)).toEqual(actual);
  expect(await bytes(page)).toBe(old);
  // Hold an actual verified read while a supported command commits a newer revision in the other tab.
  await page.route('**/api/laboratory/policy-analysis?*', async (route) => {
    const response = await route.fetch();
    await post(other, {
      commandId: crypto.randomUUID(),
      expectedRevision: actual.world.revision,
      command: {
        type: 'CreateGroup',
        name: 'rg-new-revision',
        subscriptionId: 'sub-shared',
        metadataRegion: 'norwayeast',
      },
    });
    await page.getByRole('button', { name: c.refresh, exact: true }).click();
    await route.fulfill({ response });
  });
  await page.getByRole('button', { name: e.calculate, exact: true }).click();
  await expect(page.getByText(e.stale, { exact: true })).toBeVisible();
  await expect(page.locator('.lab-policy-outcome')).toHaveCount(0);
  await page.unroute('**/api/laboratory/policy-analysis?*');
});
test('endpoint Laboratory compact native keyboard Properties policy focus reduced motion Axe original receipts and short-height controls remain usable', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await topology(page);
  const before = await state(page);
  for (const size of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(size);
    await analyse(page);
    await expect(page.getByRole('heading', { name: e.result, exact: true })).toBeFocused();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: info.outputPath('policy-' + size.width + 'x' + size.height + '.png'),
    });
  }
  await page.getByRole('combobox', { name: e.protocol, exact: true }).focus();
  await page.keyboard.press('u');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox', { name: e.sourcePort, exact: true })).toBeFocused();
  expect(await state(page)).toEqual(before);
});

test('endpoint Laboratory duplicate NIC IP and parent names in different RGs expose exact scope before selection and preserve distinct policy outcomes', async ({
  page,
}, info) => {
  await start(page);
  async function scopedGroup(name: string) {
    await service(page, c.groups);
    await page.getByRole('button', { name: c.newGroup, exact: true }).click();
    await page.getByRole('textbox', { name: c.name, exact: true }).fill(name);
    await commit(page, name);
  }
  async function scopedNetwork(group: string) {
    await service(page, n.vnets);
    await page.getByRole('button', { name: n.newVnet, exact: true }).click();
    await page.getByRole('textbox', { name: c.name, exact: true }).fill('vnet-duplicate');
    await choose(page, c.group, group);
    await page.getByRole('textbox', { name: n.addressSpace, exact: true }).fill('10.90.0.0/16');
    await commit(page, 'vnet-duplicate');
    await page.getByRole('button', { name: n.newSubnet, exact: true }).click();
    await page.getByRole('textbox', { name: c.name, exact: true }).fill('subnet-duplicate');
    await page.getByRole('textbox', { name: n.addressPrefix, exact: true }).fill('10.90.1.0/24');
    await commit(page, 'subnet-duplicate');
  }
  async function scopedNic(name: string, group: string, ip: string) {
    await service(page, e.nics);
    await page
      .getByRole('button', { name: e.operations.CreateNetworkInterface, exact: true })
      .click();
    await page.getByRole('textbox', { name: c.name, exact: true }).fill(name);
    await choose(page, c.group, group);
    await choose(page, n.vnet, group);
    await choose(page, n.subnet, 'subnet-duplicate');
    await page.getByRole('textbox', { name: e.fields.privateIpAddress, exact: true }).fill(ip);
    await commit(page, name);
  }
  await scopedGroup('rg-identity-a');
  await scopedNetwork('rg-identity-a');
  await scopedNic('nic-duplicate', 'rg-identity-a', '10.90.1.10');
  await scopedNic('nic-source', 'rg-identity-a', '10.90.1.11');
  await scopedGroup('rg-identity-b');
  await scopedNetwork('rg-identity-b');
  await scopedNic('nic-duplicate', 'rg-identity-b', '10.90.1.10');
  const before = await state(page),
    a = before.world.groups.find((g: { name: string }) => g.name === 'rg-identity-a'),
    b = before.world.groups.find((g: { name: string }) => g.name === 'rg-identity-b'),
    nicA = before.world.nics.find(
      (x: { name: string; groupId: string }) => x.name === 'nic-duplicate' && x.groupId === a.id,
    ),
    nicB = before.world.nics.find(
      (x: { name: string; groupId: string }) => x.name === 'nic-duplicate' && x.groupId === b.id,
    );
  await service(page, e.analysis);
  await choose(page, e.source, 'nic-source');
  const select = page.getByRole('combobox', { name: e.destination, exact: true }),
    labels = await select.locator('option').filter({ hasText: 'nic-duplicate' }).allTextContents();
  expect(labels).toHaveLength(2);
  expect(new Set(labels).size).toBe(2);
  expect(labels[0]).toContain('rg-identity-a / sub-shared');
  expect(labels[1]).toContain('rg-identity-b / sub-shared');
  expect(labels[0]).toContain(nicA.id);
  expect(labels[1]).toContain(nicB.id);
  for (const [scope, target, status] of [
    ['rg-identity-a', nicA.id, 'allowed-by-modeled-network-policy'],
    ['rg-identity-b', nicB.id, 'undetermined'],
  ]) {
    await choose(page, e.destination, scope!);
    await page.getByRole('button', { name: e.calculate, exact: true }).click();
    await expect(page.locator('.lab-policy-outcome')).toHaveText(
      e.statuses[status as keyof typeof e.statuses],
    );
    await expect(page.locator('.portal-properties')).toContainText(target);
    await expect(page.locator('.portal-properties')).toContainText(scope!);
    await page.screenshot({ path: info.outputPath(scope! + '.png') });
  }
  expect(await state(page)).toEqual(before);
  await page.reload();
  await service(page, e.analysis);
  await choose(page, e.source, 'nic-source');
  await choose(page, e.destination, 'rg-identity-b');
  await page.getByRole('button', { name: e.calculate, exact: true }).click();
  await expect(page.locator('.lab-policy-outcome')).toHaveText(e.statuses.undetermined);
  await expect(page.locator('.portal-properties')).toContainText(nicB.id);
  expect(await state(page)).toEqual(before);
});
