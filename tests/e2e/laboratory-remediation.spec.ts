import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { remediationWorld } from '../fixtures/remediation-world';
import { laboratoryV3Nb as c } from '../../src/content/nb';
import { laboratoryRemediationNb as t } from '../../src/content/laboratory-remediation-nb';
import { laboratoryNetworkNb as n } from '../../src/content/laboratory-networking-nb';
import { laboratoryEndpointsNb as e } from '../../src/content/laboratory-endpoints-nb';
import { laboratoryFirewallNb as f } from '../../src/content/laboratory-firewall-nb';
import { architectureStudioNb as st } from '../../src/content/architecture-studio-nb';
import type { Command } from '../../src/laboratory/v36/contract';

const state = async (page: Page) => (await page.request.get('/api/laboratory/state')).json();
async function apply(page: Page, command: Command) {
  const before = await state(page);
  const response = await page.request.post('/api/laboratory/command', {
    headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': before.workspace },
    data: { commandId: crypto.randomUUID(), expectedRevision: before.world.revision, command },
  });
  expect(response.status()).toBe(200);
  const result = await response.json();
  expect(result.receipt.outcome).toBe('accepted');
  return result.receipt;
}
async function seed(page: Page) {
  await page.goto('/labs/laboratory');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.locator('.laboratory-workspace-status')).toContainText('laboratory@3.6.0');
  const before = await state(page),
    a = remediationWorld();
  for (const entry of a.s.entries) {
    const response = await page.request.post('/api/laboratory/command', {
      headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': before.workspace },
      data: entry.request,
    });
    expect(response.status()).toBe(200);
    expect((await response.json()).receipt).toEqual(entry.receipt);
  }
  return { ...a, workspace: before.workspace };
}
async function open(page: Page, view: string, id: string) {
  await page.goto('/labs/laboratory?' + new URLSearchParams({ view, id }));
  await expect(
    page.locator('.lab-rule-lifecycle').getByRole('button', { name: t.edit, exact: true }),
  ).toBeEnabled();
}
async function edit(page: Page, fields: Record<string, string>) {
  await page
    .locator('.lab-rule-lifecycle')
    .getByRole('button', { name: t.edit, exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: t.editing, exact: true });
  for (const [key, value] of Object.entries(fields)) {
    const name = n.fields[key as keyof typeof n.fields];
    if (['direction', 'protocol', 'access'].includes(key))
      await dialog.getByRole('combobox', { name, exact: true }).selectOption(value);
    else await dialog.getByRole('textbox', { name, exact: true }).fill(value);
  }
  const before = await state(page);
  await dialog.getByRole('button', { name: t.review, exact: true }).click();
  await expect(dialog.getByRole('button', { name: t.save, exact: true })).toBeEnabled();
  await expect(dialog.getByText(t.reviewNote, { exact: true })).toBeVisible();
  expect(await state(page)).toEqual(before);
  await expect(dialog.locator('.lab-rule-review h3')).toBeFocused();
  return dialog;
}
async function save(page: Page) {
  await page.getByRole('dialog').getByRole('button', { name: t.save, exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
}
async function analyse(page: Page, a: ReturnType<typeof remediationWorld>, port: string) {
  const form = page.locator('.studio-diagnostics .lab-policy-analysis');
  if (!(await form.isVisible()))
    await page
      .locator('.portal-graph-toolbar')
      .getByRole('button', { name: st.diagnostics, exact: true })
      .click();
  await form.getByRole('combobox', { name: e.source, exact: true }).selectOption(a.appNic);
  await form.getByRole('combobox', { name: e.destination, exact: true }).selectOption(a.dataNic);
  await form.getByRole('textbox', { name: e.destinationPort, exact: true }).fill(port);
  await form.getByRole('button', { name: e.calculate, exact: true }).click();
  return form;
}
async function broaden(page: Page, a: ReturnType<typeof remediationWorld>) {
  const r = a.s.world.securityRules.find((x) => x.id === a.dataRule)!;
  await apply(page, {
    type: 'UpdateSecurityRule',
    ruleId: r.id,
    nsgId: r.nsgId,
    priority: String(r.priority),
    direction: r.direction,
    protocol: r.protocol,
    source: r.source,
    sourcePort: r.sourcePort,
    destination: r.destination,
    destinationPort: '*',
    access: r.access,
  });
  await apply(page, {
    type: 'UpdateFirewallNetworkRule',
    ruleId: a.rule,
    collectionId: a.collection,
    source: '*',
    destination: '*',
    protocol: 'Tcp',
    destinationPort: '*',
  });
}

test('remediation Studio observation opens the actual NSG rule and native Review Save narrows policy without changing original identity or course storage', async ({
  page,
}) => {
  const a = await seed(page);
  await broaden(page, a);
  const original = a.s.world.securityRules.find((r) => r.id === a.appRule)!;
  await apply(page, {
    type: 'UpdateSecurityRule',
    ruleId: original.id,
    nsgId: original.nsgId,
    priority: '300',
    direction: 'Outbound',
    protocol: 'Tcp',
    source: '*',
    sourcePort: '*',
    destination: '*',
    destinationPort: '*',
    access: 'Deny',
  });
  await open(page, 'rule', a.appRule);
  await page.goto('/labs/laboratory?view=nsg&id=' + a.appNsg);
  await page.getByRole('button', { name: n.operations.CreateSecurityRule, exact: true }).click();
  await page.getByRole('textbox', { name: c.fields.name, exact: true }).fill('broad-remediation');
  await page
    .getByRole('combobox', { name: n.fields.direction, exact: true })
    .selectOption('Outbound');
  await page.getByRole('textbox', { name: n.fields.destinationPort, exact: true }).fill('*');
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await page.locator('.lab-review').getByRole('button', { name: c.create, exact: true }).click();
  const created = await state(page),
    rule = created.world.securityRules.find(
      (r: { name: string }) => r.name === 'broad-remediation',
    );
  expect(rule).toBeTruthy();
  const storage = await page.evaluate(() => JSON.stringify(localStorage));
  await page.goto('/labs/laboratory?view=studio');
  await expect(await analyse(page, a, '3389')).toContainText(f.outcome['allowed-via-firewall']);
  await page.screenshot({ path: test.info().outputPath('nsg-before-broad-studio.png') });
  await page
    .locator('[data-observation="broad-allow"]')
    .getByRole('button', { name: `broad-remediation · ${rule.id}`, exact: true })
    .click();
  await page
    .getByRole('complementary', { name: st.inspect, exact: true })
    .getByRole('link', { name: st.open, exact: true })
    .click();
  await edit(page, { source: '10.10.1.10', destination: '10.20.1.10', destinationPort: '1433' });
  await page.screenshot({ path: test.info().outputPath('nsg-review-diff.png') });
  await save(page);
  const after = await state(page),
    changed = after.world.securityRules.find((r: { id: string }) => r.id === rule.id);
  expect(changed).toEqual({
    ...rule,
    source: '10.10.1.10',
    destination: '10.20.1.10',
    destinationPort: '1433',
  });
  expect(after.entries.slice(0, created.entries.length)).toEqual(created.entries);
  await page.locator('.studio-return a').click();
  await expect(
    page
      .locator('[data-observation="broad-allow"]')
      .getByRole('button', { name: `broad-remediation · ${rule.id}`, exact: true }),
  ).toHaveCount(0);
  await expect(await analyse(page, a, '1433')).toContainText(f.outcome['allowed-via-firewall']);
  await expect(await analyse(page, a, '3389')).toContainText(f.outcome['denied-by-nsg']);
  await expect(page.locator('.studio-diagnostics')).toContainText(original.name);
  await expect(page.getByText(c.missing, { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(storage);
  await page.reload();
  expect(await state(page)).toEqual(after);
  await page.screenshot({ path: test.info().outputPath('nsg-after-narrow-studio.png') });
  await apply(page, {
    type: 'UpdateSecurityRule',
    ruleId: rule.id,
    nsgId: rule.nsgId,
    direction: rule.direction,
    priority: String(rule.priority),
    protocol: rule.protocol,
    source: '10.10.1.11',
    sourcePort: rule.sourcePort,
    destination: '10.20.1.10',
    destinationPort: '1433',
    access: rule.access,
  });
  await page.getByRole('button', { name: c.refresh, exact: true }).click();
  await expect(page.locator('.studio-diagnostics .lab-policy-outcome')).toHaveCount(0);
  await expect(page.locator('.architecture-studio')).toHaveAttribute(
    'data-revision',
    String(after.world.revision + 1),
  );
});

test('remediation Firewall native edit and delete preserve nested collection action priority and original Create receipt with default deny and remaining rule matching', async ({
  page,
}) => {
  const a = await seed(page);
  await broaden(page, a);
  const before = await state(page);
  await page.goto('/labs/laboratory?view=studio');
  await expect(await analyse(page, a, '3389')).toContainText(f.outcome['allowed-via-firewall']);
  await page.screenshot({ path: test.info().outputPath('firewall-before-broad-analysis.png') });
  await open(page, 'firewallRule', a.rule);
  await expect(page.locator('.lab-rule-lifecycle')).toContainText(t.nested);
  const dialog = await edit(page, {
    source: '10.10.1.10',
    destination: '10.20.1.10',
    destinationPort: '1433',
  });
  await expect(dialog.getByRole('combobox', { name: 'Action', exact: true })).toHaveCount(0);
  await expect(dialog.getByRole('textbox', { name: 'Priority', exact: true })).toHaveCount(0);
  await save(page);
  await page.goto('/labs/laboratory?view=studio');
  await expect(await analyse(page, a, '1433')).toContainText(f.outcome['allowed-via-firewall']);
  await expect(await analyse(page, a, '3389')).toContainText(f.outcome['denied-by-firewall']);
  const remaining = await apply(page, {
    type: 'CreateFirewallNetworkRule',
    collectionId: a.collection,
    name: 'remaining-sql',
    source: '10.10.1.10',
    destination: '10.20.1.10',
    protocol: 'Tcp',
    destinationPort: '1433',
  });
  await open(page, 'firewallRule', a.rule);
  await page
    .locator('.lab-rule-lifecycle')
    .getByRole('button', { name: t.remove, exact: true })
    .click();
  const removal = page.getByRole('dialog', { name: t.deleting, exact: true });
  await removal.getByRole('button', { name: t.review, exact: true }).click();
  await expect(removal.getByRole('button', { name: t.remove, exact: true })).toBeDisabled();
  await removal.getByRole('checkbox').check();
  await removal.getByRole('button', { name: t.remove, exact: true }).click();
  await expect(page.locator('.lab-rule-history')).toContainText(a.rule);
  await page
    .locator('.lab-rule-history')
    .getByRole('button', { name: t.verify, exact: true })
    .click();
  await expect(page.locator('.lab-rule-history')).toContainText(t.verified);
  const after = await state(page);
  for (const key of ['firewallPolicies', 'firewallGroups', 'firewallCollections', 'firewalls']) {
    expect(before.world[key], key).toBeDefined();
    expect(after.world[key], key).toEqual(before.world[key]);
  }
  expect(after.world.firewallRules.map((r: { id: string }) => r.id)).toEqual(remaining.addedIds);
  await page
    .locator('.lab-rule-history')
    .getByRole('link', { name: t.original, exact: true })
    .click();
  await expect(page.locator('.lab-result')).toContainText(a.s.world.firewallRules[0]!.origin);
  await page.goto('/labs/laboratory?view=studio');
  await expect(page.locator(`.react-flow__node[data-id="${a.rule}"]`)).toHaveCount(0);
  await expect(await analyse(page, a, '1433')).toContainText('remaining-sql');
  await expect(await analyse(page, a, '3389')).toContainText(f.outcome['denied-by-firewall']);
  await page.screenshot({ path: test.info().outputPath('firewall-after-delete-analysis.png') });
});

test('remediation NSG Delete confirmation exact identity read-only Review historical through reset and original receipt remain verifiable', async ({
  page,
}) => {
  const a = await seed(page);
  await open(page, 'rule', a.dataRule);
  const before = await state(page);
  await page
    .locator('.lab-rule-lifecycle')
    .getByRole('button', { name: t.remove, exact: true })
    .click();
  let dialog = page.getByRole('dialog', { name: t.deleting, exact: true });
  for (const value of [a.workspace, 'laboratory@3.6.0', a.dataRule, a.dataNsg, 'receive-sql'])
    await expect(dialog).toContainText(value);
  await dialog.getByRole('button', { name: t.review, exact: true }).click();
  expect(await state(page)).toEqual(before);
  await expect(dialog.getByRole('button', { name: t.remove, exact: true })).toBeDisabled();
  await page.keyboard.press('Escape');
  expect(await state(page)).toEqual(before);
  await page
    .locator('.lab-rule-lifecycle')
    .getByRole('button', { name: t.remove, exact: true })
    .click();
  dialog = page.getByRole('dialog', { name: t.deleting, exact: true });
  await dialog.getByRole('button', { name: t.review, exact: true }).click();
  await dialog.getByRole('checkbox').check();
  await dialog.getByRole('button', { name: t.remove, exact: true }).click();
  const history = page.locator('.lab-rule-history');
  await expect(history).toContainText(t.removed);
  const after = await state(page),
    deletion = after.entries.at(-1);
  expect(deletion.receipt.removedIds).toEqual([a.dataRule]);
  expect(after.entries.slice(0, before.entries.length)).toEqual(before.entries);
  await page.reload();
  await page.route('**/api/laboratory/state?through=*', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'backend-unavailable' }),
    }),
  );
  await history.getByRole('button', { name: t.verify, exact: true }).click();
  await expect(history).toContainText(t.historyUnavailable);
  await expect(history.getByText(t.verified, { exact: true })).toHaveCount(0);
  expect(await state(page)).toEqual(after);
  await page.unroute('**/api/laboratory/state?through=*');
  await history.getByRole('button', { name: t.verify, exact: true }).click();
  await expect(history).toContainText(t.verified);
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  await page.getByRole('button', { name: c.confirmReset, exact: true }).click();
  await page.goto(
    '/labs/laboratory?' +
      new URLSearchParams({ view: 'history', receipt: deletion.receipt.commandId }),
  );
  await history.getByRole('button', { name: t.verify, exact: true }).click();
  await expect(history).toContainText(t.verified);
  await history.locator('details').nth(0).locator('summary').click();
  await expect(history.locator('details').nth(0)).toContainText(a.dataRule);
  await history.locator('details').nth(1).locator('summary').click();
  await expect(history.locator('details').nth(1)).toContainText(t.missingHistoricalRule);
  expect((await state(page)).entries.slice(0, after.entries.length)).toEqual(after.entries);
  await page.screenshot({
    path: test.info().outputPath('deleted-nsg-historical-replay-after-reset.png'),
  });
});

test('remediation two native editors preserve pinned revisions reject stale saves and replay identical command IDs without lost updates', async ({
  page,
  context,
}) => {
  const a = await seed(page),
    second = await context.newPage();
  await open(page, 'rule', a.dataRule);
  await open(second, 'rule', a.dataRule);
  const d1 = await edit(page, { destinationPort: '1444' });
  const d2 = await edit(second, { destinationPort: '1555' });
  await expect(d1).toContainText(a.workspace);
  const sent = page.waitForRequest(
    (r) => r.url().endsWith('/api/laboratory/command') && r.method() === 'POST',
  );
  await save(page);
  const command = (await sent).postDataJSON(),
    winner = await state(page);
  await second.bringToFront();
  await expect(d2).toContainText(t.stale);
  await expect(d2.getByRole('button', { name: t.save, exact: true })).toBeDisabled();
  await expect(d2.getByRole('table', { name: t.diff, exact: true })).toContainText('1555');
  expect(await state(second)).toEqual(winner);
  const headers = { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': a.workspace };
  const redelivery = await page.request.post('/api/laboratory/command', { headers, data: command });
  expect((await redelivery.json()).redelivered).toBe(true);
  const conflict = await page.request.post('/api/laboratory/command', {
    headers,
    data: { ...command, command: { ...command.command, destinationPort: '1666' } },
  });
  expect(conflict.status()).toBe(409);
  const stale = await page.request.post('/api/laboratory/command', {
    headers,
    data: {
      ...command,
      commandId: crypto.randomUUID(),
      command: { ...command.command, destinationPort: '1555' },
    },
  });
  expect(stale.status()).toBe(409);
  expect((await stale.json()).receipt.code).toBe('stale-revision');
  expect((await state(page)).world).toEqual(winner.world);
  await d2.getByRole('button', { name: t.cancel, exact: true }).click();
  await open(page, 'rule', a.dataRule);
  await open(second, 'rule', a.dataRule);
  await edit(page, { destinationPort: '1777' });
  const oldReview = await edit(second, { destinationPort: '1888' });
  // Delay only invalidation reads, not the command or server authority. This
  // exercises Save before the other tab learns about the real competing commit.
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await second.route('**/api/laboratory/state', async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await save(page);
    const committed = await state(page);
    const rejected = second.waitForResponse(
      (r) => r.url().endsWith('/api/laboratory/command') && r.request().method() === 'POST',
    );
    await oldReview.getByRole('button', { name: t.save, exact: true }).click();
    const result = await rejected;
    expect(result.status()).toBe(409);
    const body = await result.json();
    expect(body.receipt.code).toBe('stale-revision');
    expect(body.world).toEqual(committed.world);
    await expect(second.locator('.lab-result')).toContainText(c.codes['stale-revision']);
    expect((await state(page)).world).toEqual(committed.world);
  } finally {
    release();
    await second.unrouteAll({ behavior: 'wait' });
  }
  await second.close();
});

test('remediation explicit new workspace preserves original3.5 rules receipts and course storage while creating empty3.6 only after confirmation', async ({
  page,
  playwright,
}) => {
  await page.goto('/labs/laboratory');
  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })
    .selectOption('laboratory@3.5.0');
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.locator('.laboratory-workspace-status')).toContainText('laboratory@3.5.0');
  const group = await apply(page, {
    type: 'CreateGroup',
    name: 'old-scope',
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
  });
  const nsg = await apply(page, {
    type: 'CreateNetworkSecurityGroup',
    name: 'old-nsg',
    groupId: group.addedIds[0]!,
    region: 'norwayeast',
  });
  const rule = await apply(page, {
    type: 'CreateSecurityRule',
    name: 'old-allow',
    nsgId: nsg.addedIds[0]!,
    direction: 'Inbound',
    priority: '200',
    protocol: 'Tcp',
    source: '*',
    sourcePort: '*',
    destination: '*',
    destinationPort: '1433',
    access: 'Allow',
  });
  const original = await state(page),
    storage = await page.evaluate(() => JSON.stringify(localStorage));
  const retained = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:3000',
    storageState: await page.request.storageState(),
  });
  try {
    await page.goto('/labs/laboratory?view=rule&id=' + rule.addedIds[0]);
    await expect(page.locator('#lab-page-title')).toHaveText('old-allow');
    await expect(page.locator('.lab-rule-lifecycle')).toHaveCount(0);
    await page.goto('/labs/laboratory?view=groups');
    await page.getByRole('button', { name: t.newWorkspace, exact: true }).click();
    let dialog = page.getByRole('dialog', { name: t.newWorkspace, exact: true });
    await expect(dialog).toContainText(t.newWorkspaceNote);
    expect(await state(page)).toEqual(original);
    await page.keyboard.press('Escape');
    expect(await state(page)).toEqual(original);
    await page.getByRole('button', { name: t.newWorkspace, exact: true }).click();
    dialog = page.getByRole('dialog', { name: t.newWorkspace, exact: true });
    await dialog.getByRole('button', { name: t.newWorkspace, exact: true }).click();
    await expect(page.locator('.laboratory-workspace-status')).toContainText('laboratory@3.6.0');
    const next = await state(page);
    expect(next.workspace).not.toBe(original.workspace);
    expect(next.entries).toEqual([]);
    expect(next.world.groups).toEqual([]);
    expect(await (await retained.get('/api/laboratory/state')).json()).toEqual(original);
    expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(storage);
  } finally {
    await retained.dispose();
  }
});

test('remediation compact native Review keyboard focus reduced motion Axe pinned delete and short desktop preserve readable rule evidence', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const a = await seed(page);
  await open(page, 'rule', a.dataRule);
  const initial = await state(page);
  await page
    .locator('.lab-rule-lifecycle')
    .getByRole('button', { name: t.edit, exact: true })
    .click();
  const validation = page.getByRole('dialog', { name: t.editing, exact: true });
  await validation.getByRole('button', { name: t.review, exact: true }).click();
  await expect(validation).toContainText(t.noChange);
  await expect(validation.getByRole('button', { name: t.save, exact: true })).toBeDisabled();
  await validation.getByRole('textbox', { name: n.fields.priority, exact: true }).fill('99');
  await validation.getByRole('button', { name: t.review, exact: true }).click();
  await expect(validation).toContainText(n.codes['invalid-priority']);
  await expect(validation.getByRole('button', { name: t.save, exact: true })).toBeDisabled();
  expect(await state(page)).toEqual(initial);
  await validation.getByRole('button', { name: t.cancel, exact: true }).click();
  const dialog = await edit(page, { destinationPort: '1444' });
  await dialog.getByRole('button', { name: t.backEdit, exact: true }).click();
  await expect(
    dialog.getByRole('combobox', { name: n.fields.direction, exact: true }),
  ).toBeFocused();
  await expect(
    dialog.getByRole('textbox', { name: n.fields.destinationPort, exact: true }),
  ).toHaveValue('1444');
  expect(await state(page)).toEqual(initial);
  await dialog.getByRole('button', { name: t.review, exact: true }).click();
  await expect(dialog.getByRole('button', { name: t.save, exact: true })).toBeEnabled();
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(viewport);
    const button = dialog.getByRole('button', { name: t.save, exact: true });
    await button.focus();
    await expect(button).toBeFocused();
    const box = await button.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: test.info().outputPath(`remediation-review-${viewport.width}-${viewport.height}.png`),
    });
  }
  await dialog.getByRole('button', { name: t.cancel, exact: true }).click();
  await page
    .locator('.lab-rule-lifecycle')
    .getByRole('button', { name: t.remove, exact: true })
    .focus();
  await page.keyboard.press('Enter');
  const remove = page.getByRole('dialog', { name: t.deleting, exact: true });
  await remove.getByRole('button', { name: t.review, exact: true }).click();
  await remove.getByRole('checkbox').focus();
  await page.keyboard.press('Space');
  await expect(remove.getByRole('checkbox')).toBeChecked();
  await page.screenshot({
    path: test.info().outputPath('remediation-delete-confirmation-1024-500.png'),
  });
  await page.keyboard.press('Escape');
  expect(await state(page)).toEqual(initial);
});
