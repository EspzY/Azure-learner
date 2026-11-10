import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { CommandResult, Entry } from '../../src/laboratory/engine';
import { laboratoryV3Nb as c, nb } from '../../src/content/nb';
import { laboratoryNetworkNb as n } from '../../src/content/laboratory-networking-nb';
import { laboratoryRoutingNb as r } from '../../src/content/laboratory-routing-nb';
import { laboratoryEndpointsNb as e } from '../../src/content/laboratory-endpoints-nb';
import { laboratoryComputeNb as m } from '../../src/content/laboratory-compute-nb';
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
  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })
    .selectOption('laboratory@3.4.0');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.getByRole('button', { name: c.newGroup, exact: true })).toBeVisible();
  expect((await state(page)).world.model).toBe('laboratory@3.4.0');
}
async function service(page: Page, name: string) {
  const link = page
    .getByRole('navigation', { name: c.navigation, exact: true })
    .getByRole('link', { name, exact: true });
  await revealLaboratoryLink(page, link);
  await link.click();
  await closeLaboratoryDrawer(page);
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
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('rg-compute');
  await commit(page, 'rg-compute');
  await service(page, n.vnets);
  await page.getByRole('button', { name: n.newVnet, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('vnet-compute');
  await page.getByRole('textbox', { name: n.addressSpace, exact: true }).fill('10.30.0.0/16');
  await commit(page, 'vnet-compute');
  await page.getByRole('button', { name: n.newSubnet, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('snet-app');
  await page.getByRole('textbox', { name: n.addressPrefix, exact: true }).fill('10.30.1.0/24');
  await commit(page, 'snet-app');
  await service(page, n.nsgs);
  await page.getByRole('button', { name: n.newNsg, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('nsg-app');
  await commit(page, 'nsg-app');
  const snapshot = await state(page);
  await page.goto('/labs/laboratory?view=subnet&id=' + snapshot.world.subnets[0].id);
  await page.getByRole('button', { name: n.associate, exact: true }).click();
  await commit(page, 'snet-app', true);
}
async function form(page: Page, name = 'vm-app-01', ip = '10.30.1.10') {
  await service(page, m.vms);
  await page.getByRole('button', { name: m.create, exact: true }).click();
  await page.getByRole('textbox', { name: c.name, exact: true }).fill(name);
  await page.getByRole('textbox', { name: e.fields.privateIpAddress, exact: true }).fill(ip);
}
test('compute native Linux atomic VM NIC disk Properties networking original receipt reload and through preserve authoritative identities', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await topology(page);
  const old = await bytes(page),
    before = await state(page);
  await form(page);
  await page.screenshot({ path: info.outputPath('vm-create.png') });
  await commit(page, 'vm-app-01');
  const created = await state(page),
    vm = created.world.vms[0],
    nic = created.world.nics[0],
    disk = created.world.disks[0];
  expect(created.entries.length - before.entries.length).toBe(1);
  expect(created.world.revision - before.world.revision).toBe(1);
  expect(created.entries.at(-1).receipt.addedIds).toEqual([vm.id, nic.id, disk.id]);
  await page.screenshot({ path: info.outputPath('vm-overview.png') });
  await page.getByRole('button', { name: nb.portalUi.properties, exact: true }).click();
  await expect(
    page.getByRole('link', {
      name: vm.nicId === nic.id ? `${nic.name} · ${nic.id}` : 'unexpected',
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole('link', { name: `${nic.name} · ${nic.id}`, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText(nic.name);
  await expect(page.getByRole('link', { name: vm.name, exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath('vm-nic.png') });
  await page.getByRole('link', { name: 'snet-app', exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText('snet-app');
  await page.getByRole('link', { name: 'vnet-compute', exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText('vnet-compute');
  await page.goBack();
  await expect(page.locator('.portal-title h1')).toHaveText('snet-app');
  await page.goBack();
  await expect(page.locator('.portal-title h1')).toHaveText(nic.name);
  await page.getByRole('link', { name: vm.name, exact: true }).click();
  await page.getByRole('button', { name: m.network, exact: true }).click();
  await page.getByRole('link', { name: m.route, exact: true }).click();
  await expect(page.getByText('NIC:', { exact: false })).toContainText(nic.name);
  await expect(page.getByRole('combobox', { name: r.source, exact: true })).toHaveValue(
    nic.subnetId,
  );
  await page.getByRole('textbox', { name: r.destination, exact: true }).fill('10.30.1.11');
  await page.getByRole('button', { name: r.analyse, exact: true }).click();
  await expect(page.getByRole('heading', { name: r.computed, exact: true })).toBeVisible();
  await page.goBack();
  await page.getByRole('link', { name: m.policy, exact: true }).click();
  await expect(page.getByRole('combobox', { name: e.source, exact: true })).toHaveValue(nic.id);
  await page.goBack();
  await page.getByRole('button', { name: nb.portal.overview, exact: true }).click();
  await page.getByRole('link', { name: disk.name, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText(disk.name);
  await page.screenshot({ path: info.outputPath('vm-os-disk.png') });
  await expect(page.getByRole('link', { name: vm.name, exact: true })).toBeVisible();
  await page.getByRole('link', { name: c.receipt, exact: true }).click();
  await page.getByText(c.details, { exact: true }).click();
  expect(JSON.parse((await page.locator('.lab-result pre').textContent())!)).toEqual(
    created.entries.at(-1),
  );
  await page.reload();
  expect(await state(page)).toEqual(created);
  expect(await bytes(page)).toBe(old);
  await service(page, m.vms);
  await page.screenshot({ path: info.outputPath('vm-list.png') });
  expect(
    (
      await page.request
        .get('/api/laboratory/state?through=' + before.entries.length)
        .then((r) => r.json())
    ).world,
  ).toEqual(before.world);
});
test('compute native Windows profile and invalid reserved duplicate IP name and region reviews never create partial bundles', async ({
  page,
}) => {
  await topology(page);
  const before = await state(page);
  await form(page);
  for (const [ip, code] of [
    ['10.30.1.1', 'reserved-private-ip'],
    ['10.30.2.10', 'outside-subnet'],
    ['not-ip', 'invalid-private-ip'],
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
    .fill('10.30.1.10');
  await page.getByRole('combobox', { name: c.region, exact: true }).selectOption('westeurope');
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await expect(page.getByRole('region', { name: c.review, exact: true })).toContainText(
    e.associationError,
  );
  expect(await state(page)).toEqual(before);
  await page.getByRole('combobox', { name: c.region, exact: true }).selectOption('norwayeast');
  await page
    .getByRole('combobox', { name: m.image, exact: true })
    .selectOption('windows-2022-gen2');
  await page.getByRole('combobox', { name: m.size, exact: true }).selectOption('Standard_D4s_v4');
  await page.getByRole('combobox', { name: m.osDiskSizeGiB, exact: true }).selectOption('256');
  await commit(page, 'vm-app-01');
  const created = await state(page);
  expect(created.world.disks[0]).toMatchObject({ osType: 'Windows', sizeGiB: 256 });
  await form(page, 'vm-app-02');
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await expect(page.getByRole('region', { name: c.review, exact: true })).toContainText(
    e.codes['duplicate-private-ip'],
  );
  expect(await state(page)).toEqual(created);
  await page.getByRole('textbox', { name: c.name, exact: true }).fill('vm-app-01');
  await page
    .getByRole('textbox', { name: e.fields.privateIpAddress, exact: true })
    .fill('10.30.1.11');
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await expect(page.getByRole('region', { name: c.review, exact: true })).toContainText(
    c.codes['duplicate-name'],
  );
  expect(await state(page)).toEqual(created);
});
test('compute native two-tab stale review and lost response recover original three-resource commit without duplicate VMs', async ({
  page,
  context,
}) => {
  await topology(page);
  const other = await context.newPage();
  await other.goto('/labs/laboratory');
  await form(page, 'vm-tab-01', '10.30.1.10');
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await form(other, 'vm-tab-02', '10.30.1.11');
  await commit(other, 'vm-tab-02');
  const stale = page.getByRole('region', { name: c.review, exact: true });
  await stale.getByRole('button', { name: c.create, exact: true }).click();
  await expect(page.locator('.lab-result')).toContainText(c.codes['stale-revision']);
  expect((await state(page)).world.vms).toHaveLength(1);
  await page.reload();
  await form(page, 'vm-tab-01', '10.30.1.10');
  await page.getByRole('button', { name: c.review, exact: true }).click();
  let original: CommandResult | undefined;
  await page.route(
    '**/api/laboratory/command',
    async (route) => {
      const response = await route.fetch();
      original = await response.json();
      await route.abort('failed');
    },
    { times: 1 },
  );
  await page
    .getByRole('region', { name: c.review, exact: true })
    .getByRole('button', { name: c.create, exact: true })
    .click();
  await expect(page.getByRole('button', { name: c.retry, exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.retry, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText('vm-tab-01');
  const recovered = await state(page);
  expect(recovered.world.vms).toHaveLength(2);
  expect(
    recovered.entries.filter((x: Entry) => x.request.commandId === original!.receipt.commandId),
  ).toHaveLength(1);
  expect(recovered.entries.at(-1).receipt).toEqual(original!.receipt);
  await other.reload();
  expect(await state(other)).toEqual(recovered);
});
test('compute explicit reset retains historical through and course bytes while earlier workspace model stays unchanged', async ({
  page,
  browser,
}) => {
  await page.goto('/learn');
  const old = await bytes(page);
  await topology(page);
  await form(page);
  await commit(page, 'vm-app-01');
  const before = await state(page);
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: c.confirmReset, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText(c.history);
  const after = await state(page);
  expect(after.world.vms).toEqual([]);
  expect(after.world.nics).toEqual([]);
  expect(after.world.disks).toEqual([]);
  expect(after.entries.at(-1).receipt.removedIds).toContain(before.world.vms[0].id);
  expect(
    (
      await page.request
        .get('/api/laboratory/state?through=' + before.entries.length)
        .then((r) => r.json())
    ).world,
  ).toEqual(before.world);
  expect(await bytes(page)).toBe(old);
  const isolated = await browser.newContext(),
    historical = await isolated.newPage();
  await historical.goto('/labs/laboratory');
  await historical.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();
  await historical
    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })
    .selectOption('laboratory@3.3.0');
  await historical.getByRole('button', { name: c.start, exact: true }).click();
  await expect(historical.getByRole('button', { name: c.newGroup, exact: true })).toBeVisible();
  expect((await state(historical)).world.model).toBe('laboratory@3.3.0');
  await historical.reload();
  expect((await state(historical)).world.model).toBe('laboratory@3.3.0');
  await expect(
    historical
      .getByRole('navigation', { name: c.navigation, exact: true })
      .getByRole('link', { name: m.vms, exact: true }),
  ).toHaveCount(0);
  expect((await state(page)).world.model).toBe('laboratory@3.4.0');
  await isolated.close();
});
test('compute compact native keyboard Properties networking focus reduced motion Axe and original three-resource receipt remain usable', async ({
  page,
}, info) => {
  await topology(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await form(page);
  await page.screenshot({ path: info.outputPath('vm-create-initial.png') });
  await page.setViewportSize({ width: 1024, height: 500 });
  const reviewAction = page.getByRole('button', { name: c.review, exact: true });
  await reviewAction.scrollIntoViewIfNeeded();
  const box = await reviewAction.boundingBox(),
    footer = await page.locator('footer.portal-footer').boundingBox();
  expect(box).not.toBeNull();
  expect(footer).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(footer!.y);
  await reviewAction.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: c.cancel, exact: true })).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('vm-create-1024x500.png') });
  await commit(page, 'vm-app-01');
  await form(page, 'vm-app-02', '10.30.1.11');
  await commit(page, 'vm-app-02');
  const before = await state(page);
  await service(page, m.vms);
  await page.getByRole('link', { name: 'vm-app-01', exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText('vm-app-01');
  for (const size of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(size);
    await closeLaboratoryDrawer(page);
    await page.getByRole('button', { name: m.network, exact: true }).click();
    await page.getByRole('link', { name: m.policy, exact: true }).click();
    await expect(page.getByRole('combobox', { name: e.source, exact: true })).toHaveValue(
      before.world.vms[0].nicId,
    );
    await page.getByRole('combobox', { name: e.source, exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('combobox', { name: e.destination, exact: true })).toBeFocused();
    await page
      .getByRole('combobox', { name: e.destination, exact: true })
      .selectOption(before.world.vms[1].nicId);
    await page.getByRole('button', { name: e.calculate, exact: true }).click();
    await expect(page.getByRole('heading', { name: e.result, exact: true })).toBeFocused();
    await expect(page.locator('.lab-policy-outcome')).toHaveText(
      e.statuses['allowed-by-modeled-network-policy'],
    );
    await expect(page.locator('.lab-policy-outcome')).toHaveAttribute(
      'data-outcome',
      'allowed-by-modeled-network-policy',
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: info.outputPath(`vm-policy-${size.width}x${size.height}.png`) });
    await page.goBack();
    await page.getByRole('button', { name: nb.portal.overview, exact: true }).click();
    await page.getByRole('link', { name: before.world.disks[0].name, exact: true }).click();
    await page.getByRole('button', { name: nb.portalUi.properties, exact: true }).click();
    await expect(
      page.getByRole('heading', { name: nb.portalUi.properties, level: 2, exact: true }),
    ).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`vm-disk-${size.width}x${size.height}.png`) });
    await page.getByRole('button', { name: nb.portal.overview, exact: true }).click();
    await page.getByRole('link', { name: 'vm-app-01', exact: true }).click();
  }
  expect(await state(page)).toEqual(before);
});
