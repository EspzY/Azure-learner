import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';
import { studioWorld } from '../fixtures/studio-world';
import { architectureStudioNb as t } from '../../src/content/architecture-studio-nb';
import { laboratoryV3Nb as c, nb } from '../../src/content/nb';
import { laboratoryEndpointsNb as e } from '../../src/content/laboratory-endpoints-nb';
import { laboratoryFirewallNb as f } from '../../src/content/laboratory-firewall-nb';
import { revealLaboratoryLink, closeLaboratoryDrawer } from './laboratory-actions';
const studio = (page: Page) => page.locator('.architecture-studio');
async function seed(page: Page, near = false) {
  await page.goto('/labs/laboratory');
  await expect(page.getByRole('button', { name: c.start, exact: true })).toBeEnabled();
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.locator('.laboratory-workspace-status')).toContainText('laboratory@3.5.0');
  const initial = await (await page.request.get('/api/laboratory/state')).json();
  const fixture = studioWorld(near);
  // Setup executes actual owned server commands, never imports/injects a World or receipt.
  for (const entry of fixture.s.entries) {
    const response = await page.request.post('/api/laboratory/command', {
      headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': initial.workspace },
      data: entry.request,
    });
    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.receipt).toEqual(entry.receipt);
  }
  await page.getByRole('button', { name: c.refresh, exact: true }).click();
  const link = page
    .getByRole('navigation', { name: c.navigation, exact: true })
    .getByRole('link', { name: t.title, exact: true });
  await revealLaboratoryLink(page, link);
  await link.click();
  await closeLaboratoryDrawer(page);
  await expect(studio(page)).toHaveAttribute('data-revision', String(fixture.s.world.revision));
  return { ...fixture, workspace: initial.workspace };
}
async function analyse(page: Page, a: ReturnType<typeof studioWorld>, port = '1433') {
  await page
    .locator('.portal-graph-toolbar')
    .getByRole('button', { name: t.diagnostics, exact: true })
    .click();
  const form = page.locator('.studio-diagnostics .lab-policy-analysis');
  await form.getByRole('combobox', { name: e.source, exact: true }).selectOption(a.appNic);
  await form.getByRole('combobox', { name: e.destination, exact: true }).selectOption(a.dataNic);
  await form.getByRole('textbox', { name: e.destinationPort, exact: true }).fill(port);
  await form.getByRole('button', { name: e.calculate, exact: true }).click();
  return form;
}
async function state(page: Page) {
  return (await page.request.get('/api/laboratory/state')).json();
}
const storage = (page: Page) =>
  page.evaluate(() =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(localStorage)
          .filter(([k]) => k.startsWith('azurelab.'))
          .sort(([a], [b]) => a.localeCompare(b)),
      ),
    ),
  );

test('Studio live hub topology reuses server Firewall NSG routes and original resource Properties with URL-only return and no inspection writes', async ({
  page,
}) => {
  const a = await seed(page),
    before = await state(page),
    old = await storage(page),
    writes: string[] = [];
  page.on('request', (r) => {
    if (r.method() === 'POST' && r.url().includes('/api/laboratory/')) writes.push(r.url());
  });
  await expect(page.locator('.react-flow__node')).toHaveCount(
    Object.values(a.s.world).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0) + 1,
  );
  const canvas = page.locator('.studio-graph'),
    viewport = canvas.locator('.react-flow__viewport');
  const originalTransform = await viewport.getAttribute('style');
  await canvas.getByRole('button', { name: nb.explore.controls.zoomIn, exact: true }).click();
  await expect(viewport).not.toHaveAttribute('style', originalTransform!);
  const zoomed = await viewport.getAttribute('style'),
    area = await canvas.boundingBox();
  await page.mouse.move(area!.x + area!.width - 15, area!.y + 15);
  await page.mouse.down();
  await page.mouse.move(area!.x + area!.width - 65, area!.y + 40, { steps: 5 });
  await page.mouse.up();
  await expect(viewport).not.toHaveAttribute('style', zoomed!);
  const result = await analyse(page, a);
  await expect(result).toContainText(f.outcome['allowed-via-firewall']);
  await expect(page.locator('.studio-analysis-summary')).toContainText(
    f.outcome['allowed-via-firewall'],
  );
  await expect(page.locator('.studio-analysed')).not.toHaveCount(0);
  await page
    .locator('.portal-graph-toolbar')
    .getByRole('button', { name: t.list, exact: true })
    .click();
  await page
    .getByRole('table', { name: t.list, exact: true })
    .getByRole('button', { name: `vm-app-01 · ${a.appVm}`, exact: true })
    .click();
  const pane = page.getByRole('complementary', { name: t.inspect, exact: true });
  await expect(pane).toContainText(a.appNic);
  const saved = new URL(page.url()).searchParams;
  await pane.getByRole('link', { name: t.open, exact: true }).click();
  await expect(page.locator('#lab-page-title')).toHaveText('vm-app-01');
  await page.getByRole('link', { name: t.back, exact: true }).click();
  await expect(studio(page)).toBeVisible();
  expect(new URL(page.url()).searchParams.get('sselected')).toBe(a.appVm);
  expect(saved.get('sw')).toBe(a.workspace);
  for (const key of ['sx', 'sy', 'sz'])
    expect(new URL(page.url()).searchParams.get(key)).toBe(saved.get(key));
  await page.goBack();
  await expect(page.locator('#lab-page-title')).toHaveText('vm-app-01');
  await page.goForward();
  await expect(studio(page)).toBeVisible();
  await page.reload();
  await expect(studio(page)).toHaveAttribute('data-workspace', a.workspace);
  expect(await state(page)).toEqual(before);
  expect(await storage(page)).toBe(old);
  expect(writes).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('studio-hub-topology.png') });
});

test('Studio refresh invalidates a real changed forwarding path and shows the concrete NSG conflict without manufacturing policy success', async ({
  page,
}) => {
  const a = await seed(page);
  await analyse(page, a);
  await expect(page.locator('.studio-diagnostics')).toContainText(
    f.outcome['allowed-via-firewall'],
  );
  const second = await page.context().newPage();
  await second.goto('/labs/laboratory?view=peering&id=' + a.dataHub);
  await expect(second.locator('#lab-page-title')).toBeVisible();
  // Existing actual Apply is the authoritative edit; Studio has no write action.
  await second
    .getByRole('button', { name: f.operations.SetPeeringForwardedTraffic, exact: true })
    .click();
  await second.getByRole('combobox', { name: f.fields.value, exact: true }).selectOption('false');
  await second.getByRole('button', { name: c.review, exact: true }).click();
  await second.locator('.lab-review').getByRole('button', { name: 'Apply', exact: true }).click();
  await page.getByRole('button', { name: c.refresh, exact: true }).click();
  await expect(page.locator('.studio-analysed')).toHaveCount(0);
  await expect(page.locator('.studio-diagnostics .lab-policy-outcome')).toHaveCount(0);
  const broken = page.locator('.studio-diagnostics .lab-policy-analysis');
  await broken.getByRole('button', { name: e.calculate, exact: true }).click();
  await expect(broken).toContainText(f.outcome.incomplete);
  await expect(broken).toContainText(f.reasons['destination-forwarding-disabled']);
  await page.screenshot({ path: test.info().outputPath('studio-missing-forwarding.png') });
  await second.close();
  const now = await state(page);
  const apply = async (command: unknown) => {
    const r = await page.request.post('/api/laboratory/command', {
      headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': a.workspace },
      data: {
        commandId: crypto.randomUUID(),
        expectedRevision: (await state(page)).world.revision,
        command,
      },
    });
    expect(r.status()).toBe(200);
    expect((await r.json()).receipt.outcome).toBe('accepted');
  };
  expect(now.world.revision).toBeGreaterThan(a.s.world.revision);
  await apply({ type: 'SetPeeringForwardedTraffic', peeringId: a.dataHub, value: 'true' });
  await apply({
    type: 'CreateSecurityRule',
    nsgId: a.dataNsg,
    name: 'deny-sql',
    priority: '100',
    direction: 'Inbound',
    protocol: 'Tcp',
    source: '*',
    destination: '*',
    sourcePort: '*',
    destinationPort: '1433',
    access: 'Deny',
  });
  await page.getByRole('button', { name: c.refresh, exact: true }).click();
  const form = page.locator('.studio-diagnostics .lab-policy-analysis');
  await form.getByRole('button', { name: e.calculate, exact: true }).click();
  await expect(form).toContainText(f.outcome['denied-by-nsg']);
  await expect(form).toContainText('deny-sql');
  await expect(form).toContainText('app-sql');
  await expect(page.locator('[data-observation="nsg-deny"]')).toContainText('Bekreftet');
  await page.screenshot({ path: test.info().outputPath('studio-nsg-conflict.png') });
  const verified = await state(page);
  await page.route('**/api/laboratory/state', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'backend-unavailable' }),
    }),
  );
  await page.getByRole('button', { name: c.refresh, exact: true }).click();
  await expect(studio(page)).toHaveCount(0);
  await page.unroute('**/api/laboratory/state');
  expect(await state(page)).toEqual(verified);
  await page.getByRole('button', { name: c.refresh, exact: true }).click();
  await expect(studio(page)).toBeVisible();
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  await page.getByRole('button', { name: c.confirmReset, exact: true }).click();
  await expect(page.locator('.react-flow__node')).toHaveCount(0);
  expect((await state(page)).entries.slice(0, verified.entries.length)).toEqual(verified.entries);
  const studioLink = page
    .getByRole('navigation', { name: c.navigation, exact: true })
    .getByRole('link', { name: t.title, exact: true });
  await revealLaboratoryLink(page, studioLink);
  await studioLink.click();
  await closeLaboratoryDrawer(page);
  await expect(studio(page)).toBeVisible();
  await expect(page.locator('.react-flow__node')).toHaveCount(0);
  await page
    .locator('.portal-graph-toolbar')
    .getByRole('button', { name: t.diagnostics, exact: true })
    .click();
  await expect(page.getByRole('combobox', { name: e.source, exact: true })).toHaveValue('');
});

test('Studio duplicate names filters peering status and broad Allow observations retain actual scope and identity', async ({
  page,
}) => {
  const a = await seed(page);
  const add = async (command: unknown) => {
    const response = await page.request.post('/api/laboratory/command', {
      headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': a.workspace },
      data: {
        commandId: crypto.randomUUID(),
        expectedRevision: (await state(page)).world.revision,
        command,
      },
    });
    const result = await response.json();
    expect(result.receipt.outcome).toBe('accepted');
    return result.receipt.addedIds[0];
  };
  const group = await add({
    type: 'CreateGroup',
    name: 'other-scope',
    subscriptionId: 'sub-app',
    metadataRegion: 'norwayeast',
  });
  const duplicate = await add({
    type: 'CreateVirtualNetwork',
    name: 'vnet-app',
    groupId: group,
    region: 'norwayeast',
    addressSpace: '10.90.0.0/16',
  });
  await add({ type: 'CreateVnetPeering', name: 'one-way', vnetId: a.hub, remoteVnetId: duplicate });
  await add({
    type: 'CreateSecurityRule',
    nsgId: a.appNsg,
    name: 'broad-review',
    priority: '100',
    direction: 'Inbound',
    protocol: 'Tcp',
    source: '*',
    destination: '*',
    sourcePort: '*',
    destinationPort: '*',
    access: 'Allow',
  });
  await page.getByRole('button', { name: c.refresh, exact: true }).click();
  await page
    .locator('.portal-graph-toolbar')
    .getByRole('button', { name: t.list, exact: true })
    .click();
  const table = page.getByRole('table', { name: t.list, exact: true });
  await expect(table.getByRole('button', { name: new RegExp('^vnet-app ·') })).toHaveCount(2);
  await page.getByRole('combobox', { name: t.subscription, exact: true }).selectOption('sub-app');
  await expect(
    table.getByRole('button', { name: `vnet-app · ${duplicate}`, exact: true }),
  ).toBeVisible();
  await expect(table.getByRole('button', { name: `vnet-app · ${a.app}`, exact: true })).toHaveCount(
    0,
  );
  await expect(page.locator('[data-observation="peering-not-connected"]')).toContainText(
    'Initiated',
  );
  await expect(page.locator('[data-observation="broad-allow"]')).toContainText('Vurderingspunkt');
  await page.goto(
    '/labs/laboratory?' +
      new URLSearchParams({
        view: 'studio',
        sw: a.workspace,
        sgroup: 'missing',
        stype: 'unsupported',
      }),
  );
  await expect(studio(page)).toBeVisible();
  await expect(page.getByRole('combobox', { name: t.group, exact: true })).toHaveValue('');
  await expect(page.getByRole('combobox', { name: t.kind, exact: true })).toHaveValue('');
});

test('Studio near-capacity graph semantic list keyboard focus reduced motion Axe and short desktop remain usable without moving resource nodes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const a = await seed(page, true),
    before = await state(page);
  await expect(page.locator('.react-flow__node')).toHaveCount(97);
  await page
    .locator('.portal-graph-toolbar')
    .getByRole('button', { name: t.list, exact: true })
    .click();
  const table = page.getByRole('table', { name: t.list, exact: true });
  await expect(table.locator('tbody tr')).toHaveCount(97);
  await table.getByRole('button', { name: `vm-app-01 · ${a.appVm}`, exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('complementary', { name: t.inspect, exact: true })).toContainText(
    a.appVm,
  );
  const inspectorHeading = page
    .getByRole('complementary', { name: t.inspect, exact: true })
    .getByRole('heading', { name: 'vm-app-01', exact: true });
  await expect(inspectorHeading).toBeFocused();
  const focusBox = await inspectorHeading.boundingBox();
  expect(focusBox!.y).toBeGreaterThanOrEqual(40);
  expect(focusBox!.y + focusBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height - 35);
  await page
    .locator('.portal-graph-toolbar')
    .getByRole('button', { name: t.topology, exact: true })
    .click();
  await page.getByRole('button', { name: t.focus, exact: true }).click();
  const box = await page.locator(`[data-id="${a.appVm}"] .portal-graph-node`).boundingBox();
  expect(box?.width).toBeGreaterThan(200);
  const geometry = await page.locator('.portal-graph-node').evaluateAll((nodes) => {
    const rects = nodes.map((n) => {
      const r = n.getBoundingClientRect();
      return {
        id: n.closest('[data-id]')?.getAttribute('data-id'),
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        right: r.right,
        bottom: r.bottom,
      };
    });
    const overlaps = [];
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i]!,
          b = rects[j]!;
        if (
          Math.min(a.right, b.right) - Math.max(a.x, b.x) > 1 &&
          Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 1
        )
          overlaps.push([a.id, b.id]);
      }
    return { rects, overlaps };
  });
  writeFileSync(
    test.info().outputPath('studio-node-bounds.json'),
    JSON.stringify(geometry, null, 2),
  );
  expect(geometry.rects).toHaveLength(97);
  expect(geometry.rects.every((r) => r.width > 0 && r.height > 0)).toBe(true);
  expect(geometry.overlaps).toEqual([]);
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(viewport);
    await closeLaboratoryDrawer(page);
    await page.getByRole('button', { name: t.focus, exact: true }).click();
    const focused = await page.locator(`[data-id="${a.appVm}"] .portal-graph-node`).boundingBox(),
      graphBox = await page.locator('.studio-graph').boundingBox();
    expect(focused!.y).toBeGreaterThanOrEqual(graphBox!.y);
    expect(focused!.y + focused!.height).toBeLessThanOrEqual(graphBox!.y + graphBox!.height);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: test.info().outputPath(`studio-capacity-${viewport.width}-${viewport.height}.png`),
    });
  }
  expect(await state(page)).toEqual(before);
});

test('Studio unavailable backend remains empty and historical Storage workspace is inspected without upgrade or new analysis commands', async ({
  page,
  context,
}) => {
  await page.route('**/api/laboratory/state', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'backend-unavailable' }),
    }),
  );
  await page.goto('/labs/laboratory?view=studio');
  await expect(page.getByRole('button', { name: c.start, exact: true })).toBeDisabled();
  await expect(studio(page)).toHaveCount(0);
  expect((await context.cookies()).some((x) => x.name.includes('azurelab_lab'))).toBe(false);
  await page.unroute('**/api/laboratory/state');
  await page.reload();
  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })
    .selectOption('laboratory@3.0.0');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.locator('.laboratory-workspace-status')).toContainText('laboratory@3.0.0');
  await page.goto('/labs/laboratory?view=studio');
  await expect(studio(page)).toBeVisible();
  await page
    .locator('.portal-graph-toolbar')
    .getByRole('button', { name: t.diagnostics, exact: true })
    .click();
  await expect(studio(page)).toContainText(t.legacy);
  expect((await state(page)).world.model).toBe('laboratory@3.0.0');
});
