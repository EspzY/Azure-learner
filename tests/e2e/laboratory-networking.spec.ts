import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { laboratoryNetworkNb as n } from '../../src/content/laboratory-networking-nb';
import { laboratoryV3Nb as c } from '../../src/content/nb';
const model = 'laboratory@3.1.0';
async function start(page: Page) {
  await page.goto('/');
  await page
    .getByRole('link', {
      name: 'Åpne laboratoriet · AzureLab Laboratory, separat arbeidsområde',
      exact: true,
    })
    .click();
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.getByRole('link', { name: n.vnets, exact: true })).toBeVisible();
}
async function fill(page: Page, values: Record<string, string>) {
  for (const [name, value] of Object.entries(values))
    await page.getByRole('textbox', { name, exact: true }).fill(value);
}
async function commit(page: Page, name: string, apply = false) {
  await page.getByRole('button', { name: c.review, exact: true }).click();
  const region = page.getByRole('region', { name: c.review, exact: true });
  await expect(region).toContainText(c.reviewNote);
  await region.getByRole('button', { name: apply ? n.apply : c.create, exact: true }).click();
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
}
async function group(page: Page) {
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await fill(page, { [c.name]: 'rg-network' });
  await commit(page, 'rg-network');
}
async function vnet(page: Page) {
  await page.getByRole('button', { name: n.newVnet, exact: true }).click();
  await fill(page, { [c.name]: 'vnet-app', [n.addressSpace]: '10.20.0.0/16' });
  await commit(page, 'vnet-app');
}
async function subnet(page: Page, name = 'snet-web', cidr = '10.20.1.0/24') {
  await page.getByRole('button', { name: n.newSubnet, exact: true }).click();
  await fill(page, { [c.name]: name, [n.addressPrefix]: cidr });
  await commit(page, name);
}
async function nsg(page: Page) {
  await page.getByRole('link', { name: n.nsgs, exact: true }).click();
  await page.getByRole('button', { name: n.newNsg, exact: true }).click();
  await fill(page, { [c.name]: 'nsg-web' });
  await commit(page, 'nsg-web');
}
async function rule(page: Page, name = 'allow-https') {
  await page.getByRole('button', { name: n.newRule, exact: true }).click();
  await fill(page, { [c.name]: name });
  await commit(page, name);
}
const state = (page: Page) => page.request.get('/api/laboratory/state').then((r) => r.json());
const bytes = (page: Page) =>
  page.evaluate(() =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(localStorage)
          .filter(([k]) => k.startsWith('azurelab.'))
          .sort(([a], [b]) => a.localeCompare(b)),
      ),
    ),
  );
test('network Laboratory actual VNet two subnets NSG rule association Storage parent receipts and reload share one authoritative World', async ({
  page,
}, info) => {
  await start(page);
  const before = await bytes(page);
  await group(page);
  await vnet(page);
  await subnet(page);
  await page.getByRole('link', { name: 'vnet-app', exact: true }).click();
  await subnet(page, 'snet-data', '10.20.2.0/24');
  await nsg(page);
  await rule(page);
  await page.getByRole('link', { name: n.vnets, exact: true }).click();
  await page.getByRole('link', { name: 'vnet-app', exact: true }).click();
  await page.getByRole('link', { name: 'snet-web', exact: true }).click();
  await page.getByRole('button', { name: n.associate, exact: true }).click();
  await commit(page, 'snet-web', true);
  await expect(page.locator('.portal-properties')).toContainText('nsg-web');
  await expect(page.locator('.portal-properties')).toContainText('251');
  await expect(page.locator('.portal-properties')).toContainText('10.20.1.255');
  const original = await state(page);
  expect(original.world.model).toBe(model);
  expect(original.world.subnets).toHaveLength(2);
  expect(original.world.subnets[0].nsgId).toBe(original.world.nsgs[0].id);
  expect(original.entries).toHaveLength(7);
  await page.screenshot({ path: info.outputPath('subnet-associated.png') });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'snet-web', exact: true })).toBeVisible();
  expect(await state(page)).toEqual(original);
  await page.getByRole('link', { name: 'nsg-web', exact: true }).click();
  await expect(page.getByRole('link', { name: 'allow-https', exact: true })).toBeVisible();
  await page.getByText(n.defaultRules, { exact: true }).first().click();
  await expect(page.locator('.lab-default-rules')).toContainText('65500');
  expect(await page.locator('.lab-default-rules button,input,select').count()).toBe(0);
  await page.screenshot({ path: info.outputPath('nsg-rules.png') });
  await page.getByRole('link', { name: 'allow-https', exact: true }).click();
  await page.getByRole('link', { name: c.receipt, exact: true }).click();
  await page.getByText(c.details, { exact: true }).click();
  await expect(page.locator('.lab-result pre')).toContainText('CreateSecurityRule');
  await expect(page.locator('.lab-result pre')).toContainText(model);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'allow-https', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.locator('.lab-result')).toContainText(c.committed);
  await page.getByRole('link', { name: c.accounts, exact: true }).click();
  await page.getByRole('button', { name: c.newAccount, exact: true }).click();
  await fill(page, { [c.name]: 'networkstorage' });
  await commit(page, 'networkstorage');
  expect((await state(page)).world.vnets).toEqual(original.world.vnets);
  expect((await state(page)).world.accounts).toHaveLength(1);
  expect(await bytes(page)).toBe(before);
});
test('network Laboratory invalid overlap outside CIDR and duplicate directional priority explain rejection without partial creation', async ({
  page,
}) => {
  await start(page);
  await group(page);
  await vnet(page);
  await page.goto('/labs/laboratory?view=subnet&id=vnet-2');
  await expect(page.getByRole('status')).toContainText(c.missing);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'vnet-app', exact: true })).toBeVisible();
  await subnet(page);
  await page.getByRole('link', { name: 'vnet-app', exact: true }).click();
  const before = await state(page);
  await page.getByRole('button', { name: n.newSubnet, exact: true }).click();
  await fill(page, { [c.name]: 'overlap', [n.addressPrefix]: '10.20.1.128/25' });
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await expect(page.locator('.lab-review')).toContainText(n.codes['overlapping-subnet']);
  await expect(
    page.locator('.lab-review').getByRole('button', { name: c.create, exact: true }),
  ).toBeDisabled();
  await fill(page, { [n.addressPrefix]: '10.21.0.0/24' });
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await expect(page.locator('.lab-review')).toContainText(n.codes['outside-address-space']);
  expect(await state(page)).toEqual(before);
  await page.getByRole('button', { name: c.cancel, exact: true }).click();
  await nsg(page);
  await rule(page);
  await page.getByRole('link', { name: 'nsg-web', exact: true }).click();
  const rules = await state(page);
  await page.getByRole('button', { name: n.newRule, exact: true }).click();
  await fill(page, { [c.name]: 'duplicate-priority' });
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await expect(page.locator('.lab-review')).toContainText(n.codes['priority-conflict']);
  await expect(
    page.locator('.lab-review').getByRole('button', { name: c.create, exact: true }),
  ).toBeDisabled();
  expect(await state(page)).toEqual(rules);
  await page.getByRole('combobox', { name: n.direction, exact: true }).selectOption('Outbound');
  await commit(page, 'duplicate-priority');
  expect((await state(page)).world.securityRules).toHaveLength(2);
});
test('network Laboratory two real tabs persist competing commands stale denial and original command redelivery without lost network state', async ({
  page,
  context,
}) => {
  await start(page);
  await group(page);
  await vnet(page);
  const other = await context.newPage();
  await other.goto(page.url());
  for (const [p, name, prefix] of [
    [page, 'first', '10.20.1.0/24'],
    [other, 'second', '10.20.2.0/24'],
  ] as const) {
    await p.getByRole('button', { name: n.newSubnet, exact: true }).click();
    await fill(p, { [c.name]: name, [n.addressPrefix]: prefix });
    await p.getByRole('button', { name: c.review, exact: true }).click();
    await expect(
      p.locator('.lab-review').getByRole('button', { name: c.create, exact: true }),
    ).toBeEnabled();
  }
  const queued: import('@playwright/test').Route[] = [];
  await context.route('**/api/laboratory/command', async (route) => {
    queued.push(route);
    if (queued.length === 2) await Promise.all(queued.map((r) => r.continue()));
  });
  await Promise.all(
    [page, other].map((p) =>
      p.locator('.lab-review').getByRole('button', { name: c.create, exact: true }).click(),
    ),
  );
  await expect.poll(async () => (await state(page)).entries.length).toBe(4);
  await context.unroute('**/api/laboratory/command');
  const actual = await state(page);
  expect(actual.world.subnets).toHaveLength(1);
  expect(
    actual.entries
      .slice(2)
      .map((e: { receipt: { code: string } }) => e.receipt.code)
      .sort(),
  ).toEqual(['created', 'stale-revision']);
  const accepted = actual.entries
    .slice(2)
    .find((e: { receipt: { code: string } }) => e.receipt.code === 'created');
  const r = await context.request.post('/api/laboratory/command', {
    headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': actual.workspace },
    data: accepted.request,
  });
  expect((await r.json()).receipt).toEqual(accepted.receipt);
  expect((await state(page)).entries).toEqual(actual.entries);
  await other.reload();
  await expect(other.locator('.lab-model-note')).toContainText(model);
});
test('network Laboratory existing3.0 cookie retains original Storage history unsupported networking and model through explicit reset', async ({
  page,
  context,
}) => {
  const session = await context.request.post('/api/laboratory/session', {
    headers: { Origin: 'http://127.0.0.1:3000' },
    data: {},
  });
  expect(session.status()).toBe(201);
  await page.goto('/labs/laboratory');
  await expect(page.getByText(n.legacy, { exact: true })).toBeVisible();
  expect(await page.getByRole('link', { name: n.vnets, exact: true }).count()).toBe(0);
  await group(page);
  const before = await state(page);
  expect(before.world.model).toBe('laboratory@3.0.0');
  const unsupported = await context.request.post('/api/laboratory/command', {
    headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': before.workspace },
    data: {
      commandId: 'historic-network',
      expectedRevision: 1,
      command: {
        type: 'CreateVirtualNetwork',
        groupId: 'group-1',
        name: 'old',
        region: 'norwayeast',
        addressSpace: '10.20.0.0/16',
      },
    },
  });
  expect(unsupported.status()).toBe(422);
  const rejected = await unsupported.json();
  expect(rejected.receipt.code).toBe('unsupported-capability');
  await page.reload();
  expect((await state(page)).entries[1]).toEqual(rejected.entries[1]);
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.confirmReset, exact: true }).click();
  await expect(page.locator('.lab-result')).toContainText(c.codes.updated);
  expect((await state(page)).world.model).toBe('laboratory@3.0.0');
  const through = await (await context.request.get('/api/laboratory/state?through=1')).json();
  expect(through.world).toEqual(before.world);
});
test('network Laboratory short desktop keyboard focus reduced motion Axe resource forms and reset keep historical receipts accessible', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page);
  await group(page);
  await vnet(page);
  await subnet(page);
  await nsg(page);
  await rule(page);
  for (const [width, height] of [
    [1440, 900],
    [1024, 768],
    [1024, 500],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.getByRole('link', { name: 'nsg-web', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'nsg-web', exact: true })).toBeFocused();
    await page.getByRole('button', { name: n.newRule, exact: true }).focus();
    await page.keyboard.press('Enter');
    await fill(page, { [c.name]: 'keyboard-rule', [n.priority]: '200' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`network-form-${width}-${height}.png`) });
    await page.getByRole('button', { name: c.cancel, exact: true }).click();
    await page.getByRole('link', { name: 'allow-https', exact: true }).click();
  }
  const before = await state(page);
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.confirmReset, exact: true }).click();
  await expect(page.locator('.lab-result')).toContainText(c.codes.updated);
  const after = await state(page);
  expect(after.world.vnets).toEqual([]);
  expect(after.world.nsgs).toEqual([]);
  expect(after.entries.slice(0, -1)).toEqual(before.entries);
  const history = await (
    await page.request.get('/api/laboratory/state?through=' + before.entries.length)
  ).json();
  expect(history.world).toEqual(before.world);
});

test('network Laboratory duplicate parent names expose RG subscription and region before an explicit correct NSG association', async ({
  page,
}) => {
  await start(page);
  await group(page);
  await vnet(page);
  await subnet(page);
  await nsg(page);
  await page.getByRole('link', { name: c.groups, exact: true }).click();
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await fill(page, { [c.name]: 'rg-network' });
  await page.getByRole('combobox', { name: c.subscription, exact: true }).selectOption('sub-app');
  await commit(page, 'rg-network');
  await page.getByRole('button', { name: n.newVnet, exact: true }).click();
  const groups = await page
    .getByRole('combobox', { name: c.group, exact: true })
    .locator('option')
    .allTextContents();
  expect(groups).toContain('rg-network · sub-shared');
  expect(groups).toContain('rg-network · sub-app');
  await fill(page, { [c.name]: 'vnet-app' });
  await commit(page, 'vnet-app');
  await subnet(page);
  await page.getByRole('link', { name: 'rg-network', exact: true }).click();
  await page.getByRole('button', { name: n.newNsg, exact: true }).click();
  await fill(page, { [c.name]: 'nsg-web' });
  await commit(page, 'nsg-web');
  const actual = await state(page),
    target = actual.world.subnets[1],
    expected = actual.world.nsgs[1];
  await page.goto('/labs/laboratory?view=subnet&id=' + target.id);
  await page.getByRole('button', { name: n.associate, exact: true }).click();
  const nsgs = page.getByRole('combobox', { name: n.nsg, exact: true });
  const labels = await nsgs.locator('option').allTextContents();
  expect(labels).toContain('nsg-web · rg-network · sub-shared · norwayeast');
  expect(labels).toContain('nsg-web · rg-network · sub-app · norwayeast');
  const subnets = await page
    .getByRole('combobox', { name: n.subnet, exact: true })
    .locator('option')
    .allTextContents();
  expect(subnets).toContain('snet-web · vnet-app · rg-network · sub-shared · norwayeast');
  expect(subnets).toContain('snet-web · vnet-app · rg-network · sub-app · norwayeast');
  await nsgs.selectOption(expected.id);
  await commit(page, 'snet-web', true);
  const after = await state(page);
  expect(after.world.subnets[1].nsgId).toBe(expected.id);
  expect(after.world.subnets[0].nsgId).toBeNull();
});
