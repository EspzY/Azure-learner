import { test, expect } from '@playwright/test';
import Axe from '@axe-core/playwright';
import {
  t,
  c,
  temp,
  n,
  e,
  m,
  f,
  startTemporary,
  service,
  openResource,
  fill,
  create,
  memoryResponse,
  courseBytes,
} from './ephemeral-actions';
import { laboratoryRemediationNb as life } from '../../src/content/laboratory-remediation-nb';
import { nb, challenge2Nb } from '../../src/content/nb';
import { startUpdated, servicesNew, updatedKey } from './challenge-v2-actions';

test('landing launches actual 3.7 Laboratory without a database, then returns to root', async ({
  page,
  context,
}, info) => {
  // A negative backend response only; positive state must come from real commands.
  await page.route('**/api/laboratory/state', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: '{"error":"backend-unavailable"}',
    }),
  );
  await page.goto('/');
  const before = await courseBytes(page);
  await startTemporary(page);
  await create(page, c.newGroup, { name: 'rg-preview-memory' });
  await service(page, c.accounts);
  await create(page, c.newAccount, { name: 'previewmemory71' });
  await create(page, c.newContainer, { name: 'private-text' });
  const text = '<script>window.notExecuted=true</script> æøå';
  const made = await create(page, c.newBlob, { name: 'sample.txt', text });
  await expect(page.locator('#lab-main')).toContainText(text);
  expect(await page.evaluate(() => Object.hasOwn(window, 'notExecuted'))).toBe(false);
  await expect(page.locator('#lab-main')).toContainText(made.world.blobs[0]!.sha256);
  await page.getByRole('link', { name: c.receipt, exact: true }).click();
  await expect(page.locator('.lab-result')).toContainText(temp.accepted);
  await expect(page.locator('.lab-result')).not.toContainText(c.committed);
  await page.screenshot({ path: info.outputPath('memory-original-blob-receipt.png') });
  await page.getByRole('link', { name: 'Til forsiden', exact: true }).click();
  await expect(page).toHaveURL('/');
  await page.getByRole('link', { name: t.labLink, exact: true }).click();
  await service(page, c.accounts);
  await openResource(page, 'previewmemory71');
  await openResource(page, 'private-text');
  await openResource(page, 'sample.txt');
  await expect(page.locator('#lab-main')).toContainText(text);
  expect(await courseBytes(page)).toBe(before);
  expect((await context.cookies()).some((x) => x.name.includes('lab_v3'))).toBe(false);
  await page.reload();
  await expect(page.getByRole('button', { name: temp.start, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'sample.txt', exact: true })).toHaveCount(0);
});

test('memory Networking Compute NSG route and Studio use original resources and invalidate analysis after a real rule correction', async ({
  page,
}, info) => {
  await startTemporary(page);
  await create(page, c.newGroup, { name: 'rg-network-memory' });
  await service(page, n.vnets);
  await create(page, n.newVnet, { name: 'vnet-memory', addressSpace: '10.30.0.0/16' });
  let made = await create(page, n.newSubnet, { name: 'snet-web', addressPrefix: '10.30.1.0/24' });
  const web = made.receipt.addedIds[0]!;
  await service(page, n.vnets);
  await openResource(page, 'vnet-memory');
  made = await create(page, n.newSubnet, { name: 'snet-data', addressPrefix: '10.30.2.0/24' });
  const data = made.receipt.addedIds[0]!;
  await service(page, n.nsgs);
  made = await create(page, n.newNsg, { name: 'nsg-data' });
  const nsg = made.receipt.addedIds[0]!;
  made = await create(page, n.newRule, {
    name: 'allow-sql',
    priority: '200',
    direction: 'Inbound',
    protocol: 'Tcp',
    source: '10.30.1.0/24',
    destination: '10.30.2.0/24',
    destinationPort: '1433',
    access: 'Allow',
  });
  const rule = made.receipt.addedIds[0]!;
  await service(page, n.nsgs);
  await openResource(page, 'nsg-data');
  await create(page, n.newRule, {
    name: 'deny-other',
    priority: '300',
    direction: 'Inbound',
    protocol: '*',
    source: '*',
    destination: '*',
    destinationPort: '*',
    access: 'Deny',
  });
  await service(page, n.vnets);
  await openResource(page, 'vnet-memory');
  await openResource(page, 'snet-data');
  await create(page, n.associate, { nsgId: nsg }, true);
  await service(page, m.vms);
  made = await create(page, m.create, {
    name: 'vm-web',
    subnetId: web,
    privateIpAddress: '10.30.1.10',
  });
  const source =
    made.world.model === 'laboratory@3.7.0'
      ? made.world.vms.find((v) => v.name === 'vm-web')!.nicId
      : '';
  await service(page, m.vms);
  made = await create(page, m.create, {
    name: 'vm-data',
    subnetId: data,
    privateIpAddress: '10.30.2.10',
  });
  if (made.world.model !== 'laboratory@3.7.0') throw Error('model');
  const destination = made.world.vms.find((v) => v.name === 'vm-data')!.nicId;
  await page.getByRole('button', { name: m.network, exact: true }).click();
  await page.getByRole('link', { name: m.policy, exact: true }).click();
  await page.getByRole('combobox', { name: e.source, exact: true }).selectOption(source);
  await page.getByRole('combobox', { name: e.destination, exact: true }).selectOption(destination);
  await page.getByRole('textbox', { name: e.destinationPort, exact: true }).fill('1433');
  await page.getByRole('button', { name: e.calculate, exact: true }).click();
  await expect(page.locator('[data-firewall-outcome]')).toHaveAttribute(
    'data-firewall-outcome',
    'bypasses-firewall',
  );
  await expect(page.locator('#lab-main')).toContainText('allow-sql');
  await service(page, 'Architecture Studio');
  await expect(page.locator('.architecture-studio')).toContainText('vm-web');
  await page.screenshot({ path: info.outputPath('memory-compute-studio.png') });
  await service(page, n.nsgs);
  await openResource(page, 'nsg-data');
  await openResource(page, 'allow-sql');
  await expect(page.locator('.portal-title h1')).toHaveText('allow-sql');
  await page.getByRole('button', { name: life.edit, exact: true }).click();
  await fill(page, { destinationPort: '3389' }, '.lab-rule-fields');
  await page.getByRole('dialog').getByRole('button', { name: life.review, exact: true }).click();
  await expect(page.locator('.lab-rule-review')).toContainText('3389');
  const changed = memoryResponse(page, 'command');
  await page.getByRole('button', { name: life.save, exact: true }).click();
  expect((await (await changed).json()).receipt.updatedIds).toEqual([rule]);
  await expect(page.locator('.portal-properties')).toContainText('3389');
  await page.getByRole('link', { name: life.latest, exact: true }).click();
  await expect(page.locator('.lab-result')).toContainText(temp.result);
  await expect(page.locator('.lab-result')).toContainText('3389');
  await service(page, 'Network Policy Analysis');
  await page.getByRole('combobox', { name: e.source, exact: true }).selectOption(source);
  await page.getByRole('combobox', { name: e.destination, exact: true }).selectOption(destination);
  await page.getByRole('textbox', { name: e.destinationPort, exact: true }).fill('1433');
  const analysed = memoryResponse(page, 'policy-analysis');
  await page.getByRole('button', { name: e.calculate, exact: true }).click();
  expect((await (await analysed).json()).analysis.status).toBe('denied-by-modeled-network-policy');
  await expect(page.locator('#lab-main')).toContainText('deny-other');
});

test('memory Firewall policy nested rule Review Update Delete and historical replay keep original identities and receipts', async ({
  page,
}, info) => {
  await startTemporary(page);
  await create(page, c.newGroup, { name: 'rg-fw-memory' });
  await service(page, n.vnets);
  await create(page, n.newVnet, { name: 'vnet-hub', addressSpace: '10.0.0.0/16' });
  let made = await create(page, n.newSubnet, {
    name: 'AzureFirewallSubnet',
    addressPrefix: '10.0.0.0/26',
  });
  const subnet = made.receipt.addedIds[0]!;
  await service(page, f.policies);
  made = await create(page, f.operations.CreateFirewallPolicy, { name: 'policy-memory' });
  const policy = made.receipt.addedIds[0]!;
  await create(page, f.operations.CreateFirewallRuleCollectionGroup, {
    name: 'workloads',
    priority: '200',
  });
  await create(page, f.operations.CreateFirewallNetworkCollection, {
    name: 'allow-data',
    priority: '200',
    action: 'Allow',
  });
  made = await create(page, f.operations.CreateFirewallNetworkRule, {
    name: 'app-sql',
    source: '10.10.0.0/16',
    destination: '10.20.0.0/16',
    protocol: 'Tcp',
    destinationPort: '1433',
  });
  const rule = made.receipt.addedIds[0]!,
    origin = made.receipt.commandId;
  await service(page, f.firewalls);
  made = await create(page, f.operations.CreateAzureFirewall, {
    name: 'fw-hub',
    subnetId: subnet,
    policyId: policy,
  });
  await expect(page.locator('#lab-main')).toContainText('10.0.0.4');
  await page.screenshot({ path: info.outputPath('memory-firewall-overview.png') });
  await page.getByRole('link', { name: c.receipt, exact: true }).click();
  await expect(page.locator('.lab-result')).toContainText(made.receipt.addedIds[1]!);
  await service(page, f.policies);
  await openResource(page, 'policy-memory');
  await openResource(page, 'workloads');
  await openResource(page, 'allow-data');
  await openResource(page, 'app-sql');
  await expect(page.locator('.portal-title h1')).toHaveText('app-sql');
  await page.getByRole('button', { name: life.edit, exact: true }).click();
  await fill(page, { destinationPort: '3389' }, '.lab-rule-fields');
  await page.getByRole('dialog').getByRole('button', { name: life.review, exact: true }).click();
  const updated = memoryResponse(page, 'command');
  await page.getByRole('button', { name: life.save, exact: true }).click();
  expect((await (await updated).json()).receipt.updatedIds).toEqual([rule]);
  await expect(page.locator('.portal-properties')).toContainText('3389');
  await page.getByRole('link', { name: life.latest, exact: true }).click();
  await expect(page.locator('.lab-result')).toContainText('3389');
  await page.getByRole('button', { name: life.verify, exact: true }).click();
  await expect(page.locator('.lab-rule-history')).toContainText(life.verified);
  await service(page, f.policies);
  await openResource(page, 'policy-memory');
  await openResource(page, 'workloads');
  await openResource(page, 'allow-data');
  await openResource(page, 'app-sql');
  await page.getByRole('button', { name: life.remove, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: life.review, exact: true }).click();
  await page.getByRole('dialog').getByRole('checkbox').check();
  const deleted = memoryResponse(page, 'command');
  await page.getByRole('dialog').getByRole('button', { name: life.remove, exact: true }).click();
  const result = await (await deleted).json();
  expect(result.receipt.removedIds).toEqual([rule]);
  expect(result.world.firewalls).toHaveLength(1);
  await page.getByRole('link', { name: life.original, exact: true }).click();
  await expect(page).toHaveURL(new RegExp('receipt=' + origin));
  await expect(page.locator('.lab-result')).toContainText('1433');
  await expect(page.locator('.lab-result')).toContainText(temp.evidence);
});

test('memory lost response retry separate tabs and reset preserve course bytes without database writes or shared session', async ({
  page,
  context,
}) => {
  await page.goto('/learn/computing?topic=intro-request');
  await expect(page.locator('.course-shell:visible')).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const value = JSON.parse(
          localStorage.getItem('azurelab.learning.foundations.v2') ?? 'null',
        );
        return (
          value?.events?.some(
            (event: { kind: string; topic: string }) =>
              event.kind === 'visit' && event.topic === 'intro-request',
          ) ?? false
        );
      }),
    )
    .toBe(true);
  const before = await courseBytes(page);
  await startTemporary(page);
  const commands: string[] = [];
  let lost = true;
  page.on('request', (request) => {
    if (request.url().endsWith('/api/laboratory/command')) commands.push(request.url());
  });
  await page.route('**/api/laboratory/ephemeral', async (route) => {
    if (route.request().postDataJSON().action === 'command' && lost) {
      lost = false;
      const actual = await route.fetch();
      expect(actual.status()).toBe(200);
      await route.abort('failed');
    } else await route.continue();
  });
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await fill(page, { name: 'rg-retry-memory' });
  await page.getByRole('button', { name: c.review, exact: true }).click();
  await page
    .getByRole('region', { name: c.review, exact: true })
    .getByRole('button', { name: c.create, exact: true })
    .click();
  await expect(page.locator('.lab-alert')).toBeVisible();
  const repeated = memoryResponse(page, 'command');
  await page.getByRole('button', { name: c.retry, exact: true }).click();
  const received = await (await repeated).json();
  expect(received.entries).toHaveLength(1);
  await expect(page.locator('.portal-title h1')).toHaveText('rg-retry-memory');
  const other = await context.newPage();
  const separate = await startTemporary(other);
  expect(separate.workspace).not.toBe(received.workspace);
  await create(other, c.newGroup, { name: 'rg-other-tab' });
  await page.bringToFront();
  await service(page, c.groups);
  await expect(page.locator('#lab-main')).not.toContainText('rg-other-tab');
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(temp.reset);
  const reset = memoryResponse(page, 'command');
  await page.getByRole('dialog').getByRole('button', { name: c.confirmReset, exact: true }).click();
  const cleared = await (await reset).json();
  expect(cleared.world.groups).toEqual([]);
  expect(cleared.entries).toHaveLength(2);
  expect(commands).toEqual([]);
  expect(await courseBytes(page)).toBe(before);
  await other.close();
});

test('course navigation keeps guided origins separate while making free Lab discoverable', async ({
  page,
}) => {
  await page.goto('/learn');
  await expect(page.getByRole('link', { name: nb.course.sandbox, exact: true })).toHaveAttribute(
    'href',
    '/portal',
  );
  await page.getByRole('link', { name: 'Til forsiden', exact: true }).click();
  await expect(page).toHaveURL('/');
  await page.goto('/learn/services?topic=practice');
  await startUpdated(page, servicesNew);
  const state = await page.evaluate((key) => localStorage.getItem(key), updatedKey);
  await page
    .locator('.portal-header:visible')
    .getByRole('link', { name: 'Til forsiden', exact: true })
    .click();
  await expect(page).toHaveURL('/');
  await page.getByRole('link', { name: t.az900Link, exact: true }).click();
  await expect(page.locator('.learn-hub-start .course-primary')).toHaveAttribute(
    'href',
    /assessment=updated/,
  );
  expect(await page.evaluate((key) => localStorage.getItem(key), updatedKey)).toBe(state);
  await page.locator('.learn-hub-start .course-primary').click();
  await expect(page.locator('.portal-challenge-updated')).toContainText(challenge2Nb.ui.active);
  expect(await page.evaluate((key) => localStorage.getItem(key), updatedKey)).toBe(state);
  await page
    .locator('.portal-header:visible')
    .getByRole('link', { name: 'Til forsiden', exact: true })
    .click();
  await startTemporary(page);
  await service(page, 'Architecture Studio');
  await page.getByRole('link', { name: 'Til forsiden', exact: true }).click();
  await expect(page).toHaveURL('/');
  expect(await page.evaluate((key) => localStorage.getItem(key), updatedKey)).toBe(state);
});

test('compact landing is readable with keyboard access and reduced motion', async ({
  page,
  context,
}, info) => {
  await page.goto('/');
  await expect(page.locator('.landing-course')).toHaveCount(3);
  await expect(page.locator('.landing-course-available a')).toHaveCount(1);
  await expect(page.getByText(t.openCourse, { exact: true })).toHaveCount(0);
  await expect(page.getByText(t.openLab, { exact: true })).toHaveCount(0);
  for (const code of ['AZ-104', 'AZ-305'])
    await expect(
      page.locator('article', { has: page.getByText(code, { exact: true }) }).locator('a,button'),
    ).toHaveCount(0);
  const card = page.getByRole('link', { name: t.az900Link, exact: true });
  const box = await card.boundingBox();
  expect(box).not.toBeNull();
  await card.hover();
  expect(await card.evaluate((el) => getComputedStyle(el.parentElement!).cursor)).toBe('pointer');
  const popup = context.waitForEvent('page');
  await card.click({ modifiers: ['Control'] });
  const tab = await popup;
  await expect(tab).toHaveURL('/learn');
  await tab.close();
  await expect(page).toHaveURL('/');
  await card.click({ position: { x: 8, y: 8 } });
  await expect(page).toHaveURL('/learn');
  await page.getByRole('link', { name: 'Til forsiden', exact: true }).click();
  await expect(page.locator('.azurelab-landing')).not.toHaveAttribute('data-opening');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of info.project.name === 'compact-chromium'
    ? [
        [800, 700],
        [1024, 500],
      ]
    : [
        [1920, 1080],
        [1440, 900],
        [1024, 768],
        [1024, 500],
        [800, 700],
      ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.getByRole('link', { name: t.labLink, exact: true }).hover();
    expect(
      await page
        .getByRole('link', { name: t.labLink, exact: true })
        .evaluate((el) => getComputedStyle(el).transform),
    ).toBe('none');
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= innerWidth &&
          document.documentElement.scrollHeight <= innerHeight,
      ),
    ).toBe(true);
    await page.screenshot({ path: info.outputPath(`landing-clean-${width}-${height}.png`) });
  }
  expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 1024, height: 500 });
  await page.getByRole('link', { name: t.labLink, exact: true }).focus();
  await expect(page.getByRole('link', { name: t.labLink, exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: temp.start, exact: true }).click();
  await expect(page.locator('.laboratory-workspace-status')).toContainText(temp.status);
  await expect(page.getByRole('link', { name: 'Til forsiden', exact: true })).toBeVisible();
  expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('memory-compact-home.png') });
});
