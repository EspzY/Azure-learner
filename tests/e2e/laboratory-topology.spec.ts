import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { topologyWorld, routeUpdate } from '../fixtures/topology-world';
import type { Command } from '../../src/laboratory/v37/contract';
import { laboratoryV3Nb as c } from '../../src/content/nb';
import { laboratoryRemediationNb as t } from '../../src/content/laboratory-remediation-nb';
import { laboratoryTopologyNb as x } from '../../src/content/laboratory-topology-nb';
import { laboratoryRoutingNb as routingCopy } from '../../src/content/laboratory-routing-nb';
import { laboratoryEndpointsNb as e } from '../../src/content/laboratory-endpoints-nb';
import { laboratoryFirewallNb as f } from '../../src/content/laboratory-firewall-nb';
import { architectureStudioNb as st } from '../../src/content/architecture-studio-nb';
const state = async (page: Page) => (await page.request.get('/api/laboratory/state')).json();
const url = (view: string, id?: string) =>
  '/labs/laboratory?' + new URLSearchParams({ view, ...(id ? { id } : {}) });
async function apply(page: Page, command: Command) {
  const a = await state(page),
    r = await page.request.post('/api/laboratory/command', {
      headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': a.workspace },
      data: { commandId: crypto.randomUUID(), expectedRevision: a.world.revision, command },
    });
  expect(r.status()).toBe(200);
  const b = await r.json();
  expect(b.receipt.outcome).toBe('accepted');
  return b.receipt;
}
async function seed(page: Page) {
  await page.goto('/labs/laboratory');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.locator('.laboratory-workspace-status')).toContainText('laboratory@3.7.0');
  const a = topologyWorld(),
    before = await state(page);
  for (const entry of a.s.entries) {
    const r = await page.request.post('/api/laboratory/command', {
      headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': before.workspace },
      data: entry.request,
    });
    expect(r.status()).toBe(200);
    expect((await r.json()).receipt).toEqual(entry.receipt);
  }
  return { ...a, workspace: before.workspace };
}
async function diagnose(page: Page, a: ReturnType<typeof topologyWorld>) {
  await page.goto(url('studio'));
  const form = page.locator('.studio-diagnostics .lab-policy-analysis');
  if (!(await form.isVisible()))
    await page
      .locator('.portal-graph-toolbar')
      .getByRole('button', { name: st.diagnostics, exact: true })
      .click();
  await form.getByRole('combobox', { name: e.source, exact: true }).selectOption(a.appNic);
  await form.getByRole('combobox', { name: e.destination, exact: true }).selectOption(a.dataNic);
  await form.getByRole('textbox', { name: e.destinationPort, exact: true }).fill('1433');
  await form.getByRole('button', { name: e.calculate, exact: true }).click();
  return form;
}
async function edit(
  page: Page,
  kind: 'route' | 'peering',
  id: string,
  fields: Record<string, string>,
) {
  await page.goto(url(kind, id));
  const title = kind === 'route' ? x.editRoute : x.editPeering;
  await page
    .locator('.lab-rule-lifecycle')
    .getByRole('button', { name: title, exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: title, exact: true });
  for (const [key, value] of Object.entries(fields)) {
    const name = x.fields[key as keyof typeof x.fields];
    if (['nextHopType', 'firewallId', 'value'].includes(key))
      await dialog.getByRole('combobox', { name, exact: true }).selectOption(value);
    else await dialog.getByRole('textbox', { name, exact: true }).fill(value);
  }
  return dialog;
}
async function review(page: Page) {
  const dialog = page.getByRole('dialog'),
    before = await state(page);
  await dialog.getByRole('button', { name: t.review, exact: true }).click();
  await expect(dialog.getByRole('button', { name: t.save, exact: true })).toBeEnabled();
  await expect(dialog.locator('.lab-rule-review h3')).toBeFocused();
  expect(await state(page)).toEqual(before);
  return dialog;
}
async function save(page: Page) {
  await page.getByRole('dialog').getByRole('button', { name: t.save, exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
}
test('topology Studio wrong route opens the actual UDR native Review Save repairs Firewall next hop and LPM with stable identity original receipts and no course credit', async ({
  page,
}) => {
  const a = await seed(page),
    original = a.s.world.routes.find((r) => r.id === a.route)!;
  await apply(page, routeUpdate(a, 'None'));
  const before = await state(page),
    course = await page.evaluate(() => JSON.stringify(localStorage));
  await expect(await diagnose(page, a)).toContainText(f.outcome['routing-drop']);
  await page.screenshot({ path: test.info().outputPath('topology-before-route-drop-studio.png') });
  await page
    .locator('[data-observation="route-blocks-modeled-flow"]')
    .getByRole('button', { name: `${original.name} · ${original.id}`, exact: true })
    .click();
  await page
    .getByRole('complementary', { name: st.inspect, exact: true })
    .getByRole('link', { name: st.open, exact: true })
    .click();
  await expect(page).toHaveURL(
    (value) =>
      value.searchParams.get('view') === 'route' && value.searchParams.get('id') === a.route,
  );
  await page
    .locator('.lab-rule-lifecycle')
    .getByRole('button', { name: x.editRoute, exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: x.editRoute, exact: true });
  await dialog
    .getByRole('combobox', { name: x.fields.nextHopType, exact: true })
    .selectOption('VirtualAppliance');
  await dialog
    .getByRole('combobox', { name: x.fields.firewallId, exact: true })
    .selectOption(a.firewall);
  await review(page);
  await expect(dialog.getByRole('table')).toContainText(a.firewall);
  await expect(dialog.getByRole('table')).toContainText(a.s.world.firewalls[0]!.privateIpAddress);
  await page.screenshot({ path: test.info().outputPath('topology-route-review-firewall.png') });
  await save(page);
  let after = await state(page);
  expect(after.world.routes.find((r: { id: string }) => r.id === a.route)).toEqual(original);
  expect(after.entries.slice(0, before.entries.length)).toEqual(before.entries);
  await page.locator('.studio-return a').click();
  await expect(page.locator('[data-observation="route-blocks-modeled-flow"]')).toHaveCount(0);
  await expect(await diagnose(page, a)).toContainText(f.outcome['allowed-via-firewall']);
  await page.screenshot({ path: test.info().outputPath('topology-after-firewall-studio.png') });
  await edit(page, 'route', a.route, { addressPrefix: '10.99.0.0/16' });
  await review(page);
  await save(page);
  await expect(await diagnose(page, a)).toContainText(f.outcome['routing-drop']);
  await edit(page, 'route', a.route, { addressPrefix: '10.20.1.0/24' });
  await review(page);
  await save(page);
  after = await state(page);
  expect(after.world.routes.find((r: { id: string }) => r.id === a.route)).toMatchObject({
    id: a.route,
    name: original.name,
    origin: original.origin,
    routeTableId: original.routeTableId,
    addressPrefix: '10.20.1.0/24',
  });
  await expect(await diagnose(page, a)).toContainText(f.outcome['allowed-via-firewall']);
  await expect(page.locator('.studio-diagnostics')).toContainText('10.20.1.0/24');
  await page.reload();
  expect(await state(page)).toEqual(after);
  await page.goBack();
  await page.goForward();
  expect(await state(page)).toEqual(after);
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(course);
});
test('topology native complete route validation rejects shared-table incompatible subnet prefix duplicate malformed and arbitrary appliance without a partial write', async ({
  page,
}) => {
  const a = await seed(page);
  await apply(page, {
    type: 'AssociateSubnetRouteTable',
    subnetId: a.dataSubnet,
    routeTableId: a.appTable,
  });
  await apply(page, {
    type: 'CreateRoute',
    routeTableId: a.appTable,
    name: 'existing-prefix',
    addressPrefix: '10.77.0.0/16',
    nextHopType: 'None',
  });
  const before = await state(page);
  let dialog = await edit(page, 'route', a.route, {
    addressPrefix: '10.10.1.0/24',
    nextHopType: 'VnetLocal',
  });
  await dialog.getByRole('button', { name: t.review, exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText(
    routingCopy.codes['unsupported-route-profile'],
  );
  await expect(dialog.getByRole('button', { name: t.save, exact: true })).toBeDisabled();
  expect(await state(page)).toEqual(before);
  await dialog.getByRole('button', { name: t.cancel, exact: true }).click();
  dialog = await edit(page, 'route', a.route, { addressPrefix: '10.20.1.1/24' });
  await dialog.getByRole('button', { name: t.review, exact: true }).click();
  await expect(dialog.getByRole('alert')).toBeVisible();
  await expect(dialog.getByRole('button', { name: t.save, exact: true })).toBeDisabled();
  expect(await state(page)).toEqual(before);
  await dialog.getByRole('button', { name: t.cancel, exact: true }).click();
  dialog = await edit(page, 'route', a.route, { addressPrefix: '10.77.0.0/16' });
  await dialog.getByRole('button', { name: t.review, exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText(routingCopy.codes['duplicate-prefix']);
  expect(await state(page)).toEqual(before);
  await dialog.getByRole('button', { name: t.cancel, exact: true }).click();
  dialog = await edit(page, 'route', a.route, { nextHopIp: '10.0.0.99' });
  await dialog.getByRole('button', { name: t.review, exact: true }).click();
  await expect(dialog.getByRole('alert')).toBeVisible();
  expect(await state(page)).toEqual(before);
});
test('topology explicit subnet NSG disassociation retains NSG rules original association history and Studio removes only the actual attachment without a security score', async ({
  page,
}) => {
  const a = await seed(page),
    before = await state(page);
  await page.goto(url('subnet', a.appSubnet));
  await page
    .locator('.lab-rule-lifecycle')
    .getByRole('button', { name: x.disassociate, exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: x.disassociate, exact: true });
  await expect(dialog).toContainText(x.detachNote);
  await dialog.getByRole('button', { name: t.review, exact: true }).click();
  await expect(dialog.getByRole('button', { name: x.disassociate, exact: true })).toBeDisabled();
  expect(await state(page)).toEqual(before);
  await dialog.getByRole('checkbox').check();
  await dialog.getByRole('button', { name: x.disassociate, exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const after = await state(page),
    entry = after.entries.at(-1);
  expect(after.world.subnets.find((s: { id: string }) => s.id === a.appSubnet).nsgId).toBeNull();
  expect(after.world.nsgs).toEqual(before.world.nsgs);
  expect(after.world.securityRules).toEqual(before.world.securityRules);
  expect(after.world.nics).toEqual(before.world.nics);
  const form = await diagnose(page, a);
  await expect(form).toContainText(e.layerStatus['not-associated']);
  await expect(page.locator('.studio-inspector')).not.toContainText('Security Score');
  await page.goto(url('history') + '&receipt=' + entry.receipt.commandId);
  await page.getByRole('button', { name: t.verify, exact: true }).click();
  await expect(page.getByRole('status')).toContainText(t.verified);
  await page.screenshot({
    path: test.info().outputPath('topology-subnet-disassociation-history.png'),
  });
  const historic = await page.request.get('/api/laboratory/state?through=' + before.entries.length);
  expect((await historic.json()).world).toEqual(before.world);
  await page.reload();
  expect(await state(page)).toEqual(after);
});
test('topology peering access native edit keeps Connected remote flags and forwarding separate and revises server diagnostics conservatively without writes from inspection', async ({
  page,
}) => {
  const a = await seed(page),
    before = await state(page),
    original = before.world.peerings.find((p: { id: string }) => p.id === a.appHub);
  await edit(page, 'peering', a.appHub, { value: 'false' });
  await review(page);
  await save(page);
  const after = await state(page);
  expect(after.world.peerings.find((p: { id: string }) => p.id === a.appHub)).toMatchObject({
    ...original,
    allowVirtualNetworkAccess: false,
    accessOrigin: after.entries.at(-1).receipt.commandId,
  });
  expect(after.world.peerings.filter((p: { id: string }) => p.id !== a.appHub)).toEqual(
    before.world.peerings.filter((p: { id: string }) => p.id !== a.appHub),
  );
  await expect(page.locator('main')).toContainText('Connected');
  await expect(page.locator('main')).toContainText('Deaktivert');
  const form = await diagnose(page, a);
  await expect(form.locator('.lab-topology-access')).toContainText(x.accessLimit);
  await expect(form).toContainText(f.outcome.incomplete);
  await page.screenshot({ path: test.info().outputPath('topology-disabled-peering-studio.png') });
  expect(await state(page)).toEqual(after);
  await edit(page, 'peering', a.appHub, { value: 'true' });
  await review(page);
  await save(page);
  await expect(await diagnose(page, a)).toContainText(f.outcome['allowed-via-firewall']);
});
test('topology two native editors reject stale Save idempotent redelivery and changed workspace without lost update or fake success', async ({
  page,
  context,
}) => {
  const a = await seed(page),
    other = await context.newPage();
  await edit(page, 'route', a.route, { nextHopType: 'None' });
  await review(page);
  await edit(other, 'route', a.route, { nextHopType: 'Internet' });
  await review(other);
  // Hold only invalidation GETs: the original pinned Save still reaches the
  // real server after a competing commit, without any positive state injection.
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await other.route('**/api/laboratory/state', async (route) => {
    await gate;
    await route.continue();
  });
  let after!: Awaited<ReturnType<typeof state>>;
  try {
    await save(page);
    after = await state(page);
    const denied = other.waitForResponse(
      (r) => r.url().endsWith('/api/laboratory/command') && r.request().method() === 'POST',
    );
    await other.getByRole('dialog').getByRole('button', { name: t.save, exact: true }).click();
    const response = await denied;
    expect(response.status()).toBe(409);
    const result = await response.json();
    expect(result.receipt.code).toBe('stale-revision');
    expect(result.world).toEqual(after.world);
    await expect(other.locator('.lab-result')).toContainText(c.codes['stale-revision']);
  } finally {
    release();
    await other.unrouteAll({ behavior: 'wait' });
  }
  const final = await state(page);
  expect(final.world).toEqual(after.world);
  const original = after.entries.at(-1).request;
  const response = await page.request.post('/api/laboratory/command', {
    headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': a.workspace },
    data: original,
  });
  expect(response.status()).toBe(200);
  expect((await response.json()).receipt).toEqual(after.entries.at(-1).receipt);
  expect((await state(page)).world).toEqual(after.world);
  await other.close();
  await edit(page, 'route', a.route, { nextHopType: 'Internet' });
  await review(page);
  const replacement = await page.request.post('/api/laboratory/session', {
    headers: { Origin: 'http://127.0.0.1:3000' },
    data: { model: 'laboratory@3.7.0', newWorkspace: true },
  });
  expect(replacement.status()).toBe(201);
  await page.getByRole('dialog').getByRole('button', { name: t.save, exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('main')).toContainText(c.codes['workspace-changed']);
  const empty = await state(page);
  expect(empty.workspace).not.toBe(a.workspace);
  expect(empty.entries).toEqual([]);
  expect(empty.world.routes).toEqual([]);
});
test('topology native short desktop Review keyboard focus reduced motion Axe and pinned disassociation preserve actual resource evidence', async ({
  page,
}) => {
  const a = await seed(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await edit(page, 'route', a.route, { nextHopType: 'None' });
  const dialog = await review(page);
  await expect(dialog.getByRole('textbox')).toHaveCount(0);
  await dialog.getByRole('button', { name: t.backEdit, exact: true }).click();
  await expect(
    dialog.getByRole('textbox', { name: x.fields.addressPrefix, exact: true }),
  ).toBeFocused();
  expect(
    await dialog.getByRole('combobox', { name: x.fields.nextHopType, exact: true }).inputValue(),
  ).toBe('None');
  await review(page);
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(viewport);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(dialog.getByRole('button', { name: t.save, exact: true })).toBeInViewport();
    await page.screenshot({
      path: test.info().outputPath(`topology-review-${viewport.width}-${viewport.height}.png`),
    });
  }
  await save(page);
  await page.goto(url('subnet', a.appSubnet));
  await page
    .locator('.lab-rule-lifecycle')
    .getByRole('button', { name: x.disassociate, exact: true })
    .click();
  await page.getByRole('dialog').getByRole('button', { name: t.review, exact: true }).click();
  await expect(
    page.getByRole('dialog').getByRole('button', { name: x.disassociate, exact: true }),
  ).toBeDisabled();
  await page.getByRole('dialog').getByRole('checkbox').focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('dialog').getByRole('checkbox')).toBeChecked();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('topology-disassociate-1024-500.png') });
});
