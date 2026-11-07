import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { laboratoryV3Nb as c } from '../../src/content/nb';
import { laboratoryNetworkNb as n } from '../../src/content/laboratory-networking-nb';
import { laboratoryRoutingNb as r } from '../../src/content/laboratory-routing-nb';
import { revealLaboratoryLink, closeLaboratoryDrawer } from './laboratory-actions';
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
async function start(page: Page) {
  await page.goto('/');
  await page
    .getByRole('link', {
      name: 'Åpne laboratoriet · AzureLab Laboratory, separat arbeidsområde',
      exact: true,
    })
    .click();
  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })
    .selectOption('laboratory@3.2.0');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.getByRole('button', { name: c.newGroup, exact: true })).toBeVisible();
}
async function commit(page: Page, name: string, apply = false) {
  await page.getByRole('button', { name: c.review, exact: true }).click();
  const review = page.getByRole('region', { name: c.review, exact: true });
  await expect(review).toContainText('Konfigurasjonen er validert');
  await review.getByRole('button', { name: apply ? n.apply : c.create, exact: true }).click();
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
}
async function group(page: Page) {
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('rg-routing');
  await commit(page, 'rg-routing');
}
async function service(page: Page, name: string) {
  const link = page
    .getByRole('navigation', { name: c.navigation, exact: true })
    .getByRole('link', { name, exact: true });
  await revealLaboratoryLink(page, link);
  await link.click();
  await closeLaboratoryDrawer(page);
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
}
async function vnet(page: Page, name: string, address: string) {
  await service(page, n.vnets);
  await page.getByRole('button', { name: n.newVnet, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill(name);
  await page.getByRole('textbox', { name: n.addressSpace, exact: true }).fill(address);
  await commit(page, name);
}
async function subnet(page: Page, name: string, address: string) {
  await page.getByRole('button', { name: n.newSubnet, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill(name);
  await page.getByRole('textbox', { name: n.addressPrefix, exact: true }).fill(address);
  await commit(page, name);
}
async function peer(page: Page, local: string, remote: string, name: string) {
  await service(page, n.vnets);
  await page.getByRole('link', { name: local, exact: true }).click();
  await page.getByRole('link', { name: r.peerings, exact: true }).click();
  await page.getByRole('button', { name: r.operations.CreateVnetPeering, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill(name);
  const select = page.getByRole('combobox', { name: r.fields.remoteVnetId, exact: true });
  const option = select.locator('option').filter({ hasText: remote });
  await select.selectOption((await option.getAttribute('value')) ?? '');
  await commit(page, name);
}
async function routeTable(page: Page) {
  await service(page, r.tables);
  await page.getByRole('button', { name: r.operations.CreateRouteTable, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('rt-app');
  await commit(page, 'rt-app');
}
async function route(page: Page, name: string, prefix: string, hop = 'None') {
  await page.getByRole('button', { name: r.operations.CreateRoute, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill(name);
  await page.getByRole('textbox', { name: n.addressPrefix, exact: true }).fill(prefix);
  await page.getByRole('combobox', { name: r.fields.nextHopType, exact: true }).selectOption(hop);
  await commit(page, name);
}
async function analysis(page: Page, sourceName: string, destination: string) {
  await service(page, r.analysis);
  const select = page.getByRole('combobox', { name: r.source, exact: true });
  const option = select.locator('option').filter({ hasText: sourceName });
  await select.selectOption((await option.getAttribute('value')) ?? '');
  await page.getByRole('textbox', { name: r.destination, exact: true }).fill(destination);
  await page.getByRole('button', { name: r.analyse, exact: true }).click();
  await expect(page.getByRole('heading', { name: r.computed, exact: true })).toBeVisible();
}
test('routing Laboratory native hub and spokes reciprocal peering routes association LPM receipts and reload remain one authoritative World', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await start(page);
  const old = await bytes(page);
  await group(page);
  await vnet(page, 'vnet-hub', '10.0.0.0/16');
  await subnet(page, 'snet-shared', '10.0.1.0/24');
  await vnet(page, 'vnet-app', '10.10.0.0/16');
  await subnet(page, 'snet-app', '10.10.1.0/24');
  await vnet(page, 'vnet-data', '10.20.0.0/16');
  await subnet(page, 'snet-data', '10.20.1.0/24');
  await peer(page, 'vnet-hub', 'vnet-app', 'hub-app');
  await expect(page.locator('.portal-properties')).toContainText('Initiated');
  await peer(page, 'vnet-app', 'vnet-hub', 'app-hub');
  await expect(page.locator('.portal-properties')).toContainText('Connected');
  await info.attach('peering-connected', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  await peer(page, 'vnet-hub', 'vnet-data', 'hub-data');
  await peer(page, 'vnet-data', 'vnet-hub', 'data-hub');
  await analysis(page, 'snet-app', '10.20.1.5');
  await expect(page.locator('.portal-properties')).toContainText('None');
  await analysis(page, 'snet-app', '10.0.1.5');
  await expect(page.locator('.portal-properties')).toContainText('VNet peering');
  await info.attach('hub-spoke-direct-route', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  await routeTable(page);
  await route(page, 'default-deny', '0.0.0.0/0');
  await service(page, n.vnets);
  await page.getByRole('link', { name: 'vnet-app', exact: true }).click();
  await page.getByRole('link', { name: 'snet-app', exact: true }).click();
  await page
    .getByRole('button', { name: r.operations.AssociateSubnetRouteTable, exact: true })
    .click();
  await commit(page, 'snet-app', true);
  const original = await state(page);
  await analysis(page, 'snet-app', '10.0.1.5');
  await expect(page.locator('.portal-properties')).toContainText('VNet peering');
  await expect(page.getByRole('table')).toContainText('lengre prefiks');
  await service(page, r.tables);
  await page.getByRole('link', { name: 'rt-app', exact: true }).click();
  await route(page, 'block-hub', '10.0.0.0/16');
  await page.getByRole('link', { name: 'rt-app', exact: true }).click();
  await info.attach('route-table-associated', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  await analysis(page, 'snet-app', '10.0.1.5');
  await expect(page.locator('.portal-properties')).toContainText('Brukerdefinert');
  await expect(page.getByRole('table')).toContainText('brukerdefinerte ruten har prioritet');
  await expect(page.getByText(r.traffic, { exact: true })).toBeVisible();
  await info.attach('route-selection', { body: await page.screenshot(), contentType: 'image/png' });
  const before = await state(page);
  await page.reload();
  await analysis(page, 'snet-app', '10.0.1.5');
  expect((await state(page)).entries).toEqual(before.entries);
  expect(before.world.peerings).toHaveLength(4);
  expect(original.world.model).toBe('laboratory@3.2.0');
  await page.getByRole('link', { name: c.receipt, exact: true }).last().click();
  await expect(page.locator('.lab-result')).toContainText(c.committed);
  await page.getByText(c.details, { exact: true }).click();
  await expect(page.locator('.lab-result pre')).toContainText('CreateRoute');
  await page.goBack();
  await expect(page.getByRole('heading', { name: r.analysis, exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.locator('.lab-result')).toBeVisible();
  expect(await bytes(page)).toBe(old);
});
test('routing Laboratory overlapping peering duplicate direction invalid routes and incompatible association fail without partial creation', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await start(page);
  await group(page);
  await vnet(page, 'vnet-hub', '10.0.0.0/16');
  await subnet(page, 'snet-shared', '10.0.1.0/24');
  await vnet(page, 'vnet-overlap', '10.0.2.0/24');
  await service(page, n.vnets);
  await page.getByRole('link', { name: 'vnet-hub', exact: true }).click();
  await page.getByRole('link', { name: r.peerings, exact: true }).click();
  await page.getByRole('button', { name: r.operations.CreateVnetPeering, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('overlap');
  const remote = page.getByRole('combobox', { name: r.fields.remoteVnetId, exact: true });
  await remote.selectOption('vnet-4');
  const before = await state(page);
  await page.getByRole('button', { name: c.review, exact: true }).click();
  const review = page.getByRole('region', { name: c.review, exact: true });
  await expect(review).toContainText(r.codes['overlapping-vnets']);
  await expect(review.getByRole('button', { name: c.create, exact: true })).toBeDisabled();
  expect((await state(page)).entries).toEqual(before.entries);
  await page.getByRole('button', { name: c.cancel, exact: true }).click();
  await routeTable(page);
  await page.getByRole('button', { name: r.operations.CreateRoute, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('bad-prefix');
  await page.getByRole('textbox', { name: n.addressPrefix, exact: true }).fill('10.20.1.5/24');
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await expect(review).toContainText(n.codes['invalid-cidr']);
  await expect(review.getByRole('button', { name: c.create, exact: true })).toBeDisabled();
  expect((await state(page)).world.routes).toEqual([]);
  await service(page, r.tables);
  await page.getByRole('button', { name: r.operations.CreateRouteTable, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('rt-incompatible');
  await page.getByRole('combobox', { name: c.region, exact: true }).selectOption('westeurope');
  await commit(page, 'rt-incompatible');
  const configured = await state(page);
  const wrongTable = configured.world.routeTables.find(
    (t: { name: string }) => t.name === 'rt-incompatible',
  );
  await service(page, n.vnets);
  await page.getByRole('link', { name: 'vnet-hub', exact: true }).click();
  await page.getByRole('link', { name: 'snet-shared', exact: true }).click();
  await page
    .getByRole('button', { name: r.operations.AssociateSubnetRouteTable, exact: true })
    .click();
  await page.getByRole('combobox', { name: r.table, exact: true }).selectOption(wrongTable.id);
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await expect(review).toContainText(r.associationError);
  await expect(review).not.toContainText('NSG');
  await expect(review.getByRole('button', { name: n.apply, exact: true })).toBeDisabled();
  expect((await state(page)).entries).toEqual(configured.entries);
  await info.attach('route-association-denial', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  // Real rejected request produces its original append-only receipt; it is not a simulated UI result.
  const denied = await page.request.post('/api/laboratory/command', {
    headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': configured.workspace },
    data: {
      commandId: 'route-association-denied',
      expectedRevision: configured.world.revision,
      command: {
        type: 'AssociateSubnetRouteTable',
        subnetId: 'subnet-3',
        routeTableId: wrongTable.id,
      },
    },
  });
  expect(denied.status()).toBe(422);
  const originalDenial = await denied.json();
  expect(originalDenial.world).toEqual(configured.world);
  await page.getByRole('button', { name: c.refresh, exact: true }).click();
  await service(page, c.history);
  await page.getByRole('link', { name: 'route-association-denied', exact: true }).click();
  await expect(page.locator('.lab-result')).toContainText(r.associationError);
  await expect(page.locator('.lab-result')).not.toContainText('NSG');
  await page.getByText(c.details, { exact: true }).click();
  expect(JSON.parse(await page.locator('.lab-result pre').innerText())).toEqual(
    originalDenial.entries.at(-1),
  );
  const s = await state(page),
    request = {
      commandId: 'same-routing-id',
      expectedRevision: s.world.revision,
      command: {
        type: 'CreateRouteTable',
        groupId: 'group-1',
        region: 'norwayeast',
        name: 'rt-idempotent',
      },
    };
  const call = (body: unknown) =>
    page.request.post('/api/laboratory/command', {
      headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': s.workspace },
      data: body,
    });
  const a = await call(request),
    b = await call(request);
  expect((await a.json()).receipt).toEqual((await b.json()).receipt);
  expect(
    (await call({ ...request, command: { ...request.command, name: 'different' } })).status(),
  ).toBe(409);
});
test('routing Laboratory two tabs stale revisions reset and original through preserve workspace and isolate another anonymous session', async ({
  page,
  context,
  browser,
}) => {
  await start(page);
  await group(page);
  await vnet(page, 'vnet-hub', '10.0.0.0/16');
  await subnet(page, 'snet-shared', '10.0.1.0/24');
  await routeTable(page);
  const before = await state(page),
    tab = await context.newPage();
  await tab.goto('/labs/laboratory');
  await expect(tab.locator('.lab-model-note')).toContainText(String(before.world.revision));
  const requests = ['a', 'b'].map((name) => ({
    commandId: 'route-concurrent-' + name,
    expectedRevision: before.world.revision,
    command: {
      type: 'CreateRoute',
      routeTableId: before.world.routeTables[0].id,
      name,
      addressPrefix: name === 'a' ? '10.10.0.0/16' : '10.20.0.0/16',
      nextHopType: 'None',
    },
  }));
  const responses = await Promise.all(
    [page, tab].map((p, i) =>
      p.request.post('/api/laboratory/command', {
        headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': before.workspace },
        data: requests[i],
      }),
    ),
  );
  expect(responses.map((r) => r.status()).sort()).toEqual([200, 409]);
  const committed = await state(page);
  await tab.reload();
  expect((await state(tab)).world).toEqual(committed.world);
  const isolated = await browser.newContext();
  const other = await isolated.newPage();
  await start(other);
  expect((await state(other)).entries).toEqual([]);
  await isolated.close();
  await page.reload();
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.confirmReset, exact: true }).click();
  await expect.poll(async () => (await state(page)).world.attempt).toBe(2);
  const reset = await state(page);
  expect(reset.world.peerings).toEqual([]);
  expect(reset.world.routeTables).toEqual([]);
  expect(reset.entries.slice(0, committed.entries.length)).toEqual(committed.entries);
  const historical = await page.request.get(
    '/api/laboratory/state?through=' + committed.entries.length,
  );
  expect((await historical.json()).world).toEqual(committed.world);
  await tab.close();
});
test('routing Laboratory compact native analysis keyboard reduced motion Axe properties review and original receipts stay accessible', async ({
  page,
}, info) => {
  await start(page);
  await group(page);
  await vnet(page, 'vnet-hub', '10.0.0.0/16');
  await subnet(page, 'snet-shared', '10.0.1.0/24');
  const before = await state(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await service(page, r.analysis);
  const source = page.getByRole('combobox', { name: r.source, exact: true });
  await source.selectOption('subnet-3');
  let release!: () => void, observed!: () => void;
  const held = new Promise<void>((resolve) => {
      release = resolve;
    }),
    started = new Promise<void>((resolve) => {
      observed = resolve;
    });
  await page.route(
    '**/api/laboratory/analysis?*',
    async (route) => {
      const response = await route.fetch();
      observed();
      await held;
      await route.fulfill({ response });
    },
    { times: 1 },
  );
  await page.getByRole('button', { name: r.analyse, exact: true }).click();
  await started;
  await expect(source).toBeDisabled();
  await expect(page.getByRole('textbox', { name: r.destination, exact: true })).toBeDisabled();
  release();
  await expect(page.getByRole('heading', { name: r.computed, exact: true })).toBeFocused();
  for (const size of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(size);
    await analysis(page, 'snet-shared', '8.8.8.8');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow).toBe(false);
    await expect(page.getByRole('heading', { name: r.computed, exact: true })).toBeFocused();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await info.attach(`routing-${size.width}-${size.height}`, {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
    const destination = page.getByRole('textbox', { name: r.destination, exact: true });
    await destination.focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: r.analyse, exact: true })).toBeFocused();
  }
  expect((await state(page)).entries).toEqual(before.entries);
  await expect(page.locator('[data-icon-missing]')).toHaveCount(0);
  await expect(page.locator('[data-guide]')).toHaveCount(0);
  await expect(page.locator('.portal')).toHaveAttribute('data-portal-mode', 'laboratory');
  await expect(page.getByRole('link', { name: 'Til kurset', exact: true })).toHaveAttribute(
    'href',
    '/learn',
  );
});
