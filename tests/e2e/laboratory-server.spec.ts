import { revealLaboratoryLink } from './laboratory-actions';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { laboratoryV3Nb as c, nb } from '../../src/content/nb';
import { portalResourceContextNb as fidelity } from '../../src/content/portal-resource-context-nb';
async function start(page: Page) {
  await page.goto('/learn');
  await page.getByRole('link', { name: c.entry, exact: true }).click();
  await expect(page.getByRole('heading', { name: c.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.getByRole('button', { name: c.newGroup, exact: true })).toBeVisible();
}
async function commit(page: Page, name: string) {
  const nativeGroup = (await page.locator('.lab-group-create:visible').count()) > 0;
  await page
    .getByRole('button', { name: nativeGroup ? fidelity.reviewCreate : c.review, exact: true })
    .click();
  const review = page.getByRole('region', { name: c.review, exact: true });
  await expect(review).toContainText(nativeGroup ? fidelity.validationNote : c.reviewNote);
  await review.getByRole('button', { name: c.create, exact: true }).click();
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
}
async function group(page: Page, name = 'rg-v3') {
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await expect(page.locator('.lab-form')).toBeVisible();
  const nativeGroup = (await page.locator('.lab-group-create:visible').count()) > 0;
  await page
    .getByRole('textbox', { name: nativeGroup ? fidelity.groupName : /^Name/, exact: nativeGroup })
    .fill(name);
  await commit(page, name);
}
async function storage(page: Page, text = 'Synthetic Å report <script>window.__labXss=1</script>') {
  await group(page);
  await page.getByRole('button', { name: c.newAccount, exact: true }).click();
  await page.getByRole('textbox', { name: /^Name/ }).fill('storagev3demo');
  await commit(page, 'storagev3demo');
  await page.getByRole('button', { name: c.newContainer, exact: true }).click();
  await page.getByRole('textbox', { name: /^Name/ }).fill('private-reports');
  await commit(page, 'private-reports');
  await page.getByRole('button', { name: c.newBlob, exact: true }).click();
  await page.getByRole('textbox', { name: /^Name/ }).fill('report.txt');
  await page.getByRole('textbox', { name: new RegExp('^' + c.text) }).fill(text);
  await commit(page, 'report.txt');
  return text;
}
const oldBytes = (page: Page) =>
  page.evaluate(() =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(localStorage)
          .filter(([k]) => k.startsWith('azurelab.'))
          .sort(([a], [b]) => a.localeCompare(b)),
      ),
    ),
  );

test('server Laboratory actual Storage chain commits escaped text metadata original receipts reload parent history and explicit reset without old-store writes', async ({
  page,
}, info) => {
  await start(page);
  const before = await oldBytes(page);
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await expect(page.locator('.lab-form')).toBeVisible();
  const nativeGroup = (await page.locator('.lab-group-create:visible').count()) > 0;
  await page
    .getByRole('textbox', { name: nativeGroup ? fidelity.groupName : /^Name/, exact: nativeGroup })
    .fill('!invalid');
  await page
    .getByRole('button', { name: nativeGroup ? fidelity.reviewCreate : c.review, exact: true })
    .click();
  await expect(page.locator('.lab-review')).toContainText(c.codes['invalid-name']);
  await expect(
    page.locator('.lab-review').getByRole('button', { name: c.create, exact: true }),
  ).toBeDisabled();
  const empty = await (await page.request.get('/api/laboratory/state')).json();
  expect(empty.world.revision).toBe(0);
  expect(empty.entries).toEqual([]);
  await page.getByRole('button', { name: c.cancel, exact: true }).click();
  const text = await storage(page);
  await expect(page.getByLabel(c.text, { exact: true })).toHaveText(text);
  await expect(page.locator('.portal-properties')).toContainText(
    createHash('sha256').update(text).digest('hex'),
  );
  expect(await page.evaluate(() => '__labXss' in window)).toBe(false);
  await page.reload();
  await expect(page.getByLabel(c.text, { exact: true })).toHaveText(text);
  await page.screenshot({ path: info.outputPath('server-blob.png') });
  await page.getByRole('link', { name: c.receipt, exact: true }).click();
  await page.getByText(c.details, { exact: true }).click();
  await expect(page.locator('.lab-result pre')).toContainText('CreateTextBlob');
  await expect(page.locator('.lab-result pre')).toContainText('blob-4');
  await page.goBack();
  await expect(page.getByLabel(c.text, { exact: true })).toHaveText(text);
  await page.getByRole('link', { name: 'private-reports', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'private-reports', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByLabel(c.text, { exact: true })).toHaveText(text);
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'private-reports', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'storagev3demo', exact: true }).click();
  await page.getByRole('link', { name: 'rg-v3', exact: true }).click();
  await page.getByRole('link', { name: c.receipt, exact: true }).first().click();
  await expect(page.locator('.lab-result')).toContainText(c.committed);
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText(c.resetNote);
  await dialog.getByRole('button', { name: c.confirmReset, exact: true }).click();
  await expect(page.locator('.lab-result')).toContainText(c.codes.updated);
  await revealLaboratoryLink(page, page.getByRole('link', { name: c.groups, exact: true }));
  await page.getByRole('link', { name: c.groups, exact: true }).click();
  await expect(page.getByRole('table')).toContainText(c.empty);
  expect(await oldBytes(page)).toBe(before);
});

test('server Laboratory two actual tabs with same cookie reject stale writer without lost update and preserve original idempotency', async ({
  page,
  context,
}) => {
  await start(page);
  const other = await context.newPage();
  await other.goto('/labs/laboratory');
  await expect(other.getByRole('button', { name: c.newGroup, exact: true })).toBeVisible();
  for (const [p, name] of [
    [page, 'rg-alpha'],
    [other, 'rg-beta'],
  ] as const) {
    await p.getByRole('button', { name: c.newGroup, exact: true }).click();
    await expect(p.locator('.lab-form')).toBeVisible();
    const nativeGroup = (await p.locator('.lab-group-create:visible').count()) > 0;
    await p
      .getByRole('textbox', {
        name: nativeGroup ? fidelity.groupName : /^Name/,
        exact: nativeGroup,
      })
      .fill(name);
    await p
      .getByRole('button', { name: nativeGroup ? fidelity.reviewCreate : c.review, exact: true })
      .click();
    await expect(
      p
        .getByRole('region', { name: c.review })
        .getByRole('button', { name: c.create, exact: true }),
    ).toBeEnabled();
  }
  const queued: {
    route: import('@playwright/test').Route;
    body: unknown;
    headers: Record<string, string>;
  }[] = [];
  await context.route('**/api/laboratory/command', async (route) => {
    queued.push({
      route,
      body: route.request().postDataJSON(),
      headers: route.request().headers(),
    });
    if (queued.length === 2) await Promise.all(queued.map((q) => q.route.continue()));
  });
  await Promise.all([
    page
      .getByRole('region', { name: c.review })
      .getByRole('button', { name: c.create, exact: true })
      .click(),
    other
      .getByRole('region', { name: c.review })
      .getByRole('button', { name: c.create, exact: true })
      .click(),
  ]);
  await expect
    .poll(async () => {
      const r = await context.request.get('/api/laboratory/state');
      return (await r.json()).entries.length;
    })
    .toBe(2);
  const state = await (await context.request.get('/api/laboratory/state')).json();
  expect(state.world.groups).toHaveLength(1);
  expect(state.world.revision).toBe(1);
  expect(state.entries.map((e: { receipt: { code: string } }) => e.receipt.code).sort()).toEqual([
    'created',
    'stale-revision',
  ]);
  await context.unroute('**/api/laboratory/command');
  const accepted = state.entries.find(
    (e: { receipt: { code: string } }) => e.receipt.code === 'created',
  );
  const repeated = await context.request.post('/api/laboratory/command', {
    headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': state.workspace },
    data: accepted.request,
  });
  expect(repeated.status()).toBe(200);
  expect((await repeated.json()).redelivered).toBe(true);
  await page.getByRole('button', { name: c.refresh, exact: true }).click();
  await other.getByRole('button', { name: c.refresh, exact: true }).click();
  expect((await (await context.request.get('/api/laboratory/state')).json()).entries).toHaveLength(
    2,
  );
});

test('server Laboratory lost response after real commit remains uncertain then retries same request without duplicate World or receipt', async ({
  page,
  context,
}) => {
  await start(page);
  let intercepted = false;
  await page.route('**/api/laboratory/command', async (route) => {
    if (!intercepted) {
      intercepted = true;
      const result = await route.fetch();
      expect(result.status()).toBe(200);
      await route.abort('failed');
    } else await route.continue();
  });
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await expect(page.locator('.lab-form')).toBeVisible();
  const nativeGroup = (await page.locator('.lab-group-create:visible').count()) > 0;
  await page
    .getByRole('textbox', { name: nativeGroup ? fidelity.groupName : /^Name/, exact: nativeGroup })
    .fill('rg-uncertain');
  await page
    .getByRole('button', { name: nativeGroup ? fidelity.reviewCreate : c.review, exact: true })
    .click();
  await page
    .getByRole('region', { name: c.review })
    .getByRole('button', { name: c.create, exact: true })
    .click();
  await expect(page.locator('.lab-alert')).toContainText(c.codes['server-result-unavailable']);
  await page.getByRole('button', { name: c.retry, exact: true }).click();
  await expect(page.getByRole('heading', { name: 'rg-uncertain', exact: true })).toBeVisible();
  const state = await (await context.request.get('/api/laboratory/state')).json();
  expect(state.entries).toHaveLength(1);
  expect(state.world.groups).toHaveLength(1);
});

test('server Laboratory private sessions cookies Origin and unknown session-ID inputs cannot select another workspace', async ({
  page,
  browser,
  context,
}) => {
  await start(page);
  await group(page, 'rg-private');
  const state = await (await context.request.get('/api/laboratory/state')).json();
  const cookie = (await context.cookies()).find((x) => x.name === 'azurelab_lab_v3')!;
  expect(cookie.httpOnly).toBe(true);
  expect(cookie.sameSite).toBe('Strict');
  expect(await page.evaluate(() => document.cookie)).not.toContain(cookie.value);
  const stranger = await browser.newContext();
  try {
    const second = await stranger.newPage();
    await start(second);
    const own = await (await stranger.request.get('/api/laboratory/state')).json();
    expect(own.workspace).not.toBe(state.workspace);
    expect(own.world.groups).toHaveLength(0);
    const forbidden = await stranger.request.post('/api/laboratory/command', {
      headers: { Origin: 'http://127.0.0.1:3000', 'If-Laboratory-Workspace': state.workspace },
      data: { commandId: 'foreign', expectedRevision: 0, command: { type: 'ResetWorkspace' } },
    });
    expect(forbidden.status()).toBe(409);
    const csrf = await context.request.post('/api/laboratory/session', {
      headers: { Origin: 'https://attacker.invalid' },
      data: {},
    });
    expect(csrf.status()).toBe(403);
    expect(
      (await stranger.request.get('/api/laboratory/state?sessionId=' + state.workspace)).status(),
    ).toBe(400);
  } finally {
    await stranger.close();
  }
});

test('server Laboratory compact native keyboard short-height reduced motion Axe and actual Blob read remain usable', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page);
  await storage(page, 'Synthetic compact report');
  for (const size of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(size);
    await expect(page.getByLabel(c.text, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: info.outputPath(`blob-${size.width}-${size.height}.png`) });
  }
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
  const reset = page.getByRole('button', { name: c.reset, exact: true });
  await reset.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(reset).toBeFocused();
});

test('server Laboratory separate v3 workspace leaves actual old v2 Portal writer and historical local records intact', async ({
  page,
  context,
}) => {
  await start(page);
  await group(page, 'rg-server-only');
  const serverBefore = await (await context.request.get('/api/laboratory/state')).json();
  const old = await context.newPage();
  await old.goto('/portal?area=groups');
  await old
    .locator('.portal-commandbar')
    .getByRole('button', { name: nb.portal.create, exact: true })
    .click();
  await old.getByRole('textbox', { name: nb.portal.groupName, exact: true }).fill('rg-v2-only');
  await old
    .getByRole('combobox', { name: nb.portal.subscription, exact: true })
    .selectOption('sub-shared');
  await old
    .getByRole('combobox', { name: nb.portal.region, exact: true })
    .selectOption('norwayeast');
  await old.locator('[data-guide="review"]').click();
  await old.locator('[data-guide="commit"]').click();
  await expect(old.getByRole('heading', { name: 'rg-v2-only', exact: true })).toBeVisible();
  const v2 = await oldBytes(old);
  const serverAfter = await (await context.request.get('/api/laboratory/state')).json();
  expect(serverAfter).toEqual(serverBefore);
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.confirmReset, exact: true }).click();
  await expect(page.locator('.lab-result')).toContainText(c.codes.updated);
  expect(await oldBytes(old)).toBe(v2);
  await old.reload();
  await expect(old.getByRole('heading', { name: 'rg-v2-only', exact: true })).toBeVisible();
});

test('server Laboratory changed session invalidates reviewed intent and never retargets stale Create or Reset to replacement workspace', async ({
  page,
  context,
}) => {
  await start(page);
  const replaceSession = async () => {
    const response = await context.request.post('/api/laboratory/session', {
      headers: { Origin: 'http://127.0.0.1:3000' },
      data: { newWorkspace: true },
    });
    expect(response.status()).toBe(201);
    return response.json();
  };
  const reviewGroup = async (name: string) => {
    await page.getByRole('button', { name: c.newGroup, exact: true }).click();
    await expect(page.locator('.lab-form')).toBeVisible();
    const nativeGroup = (await page.locator('.lab-group-create:visible').count()) > 0;
    await page
      .getByRole('textbox', {
        name: nativeGroup ? fidelity.groupName : /^Name/,
        exact: nativeGroup,
      })
      .fill(name);
    await page
      .getByRole('button', { name: nativeGroup ? fidelity.reviewCreate : c.review, exact: true })
      .click();
    await expect(page.locator('.lab-review')).toBeVisible();
  };
  const refresh = page.getByRole('button', { name: c.refresh, exact: true });
  await reviewGroup('rg-original-review');
  const a = await (await context.request.get('/api/laboratory/state')).json();
  const b = await replaceSession();
  expect(b.workspace).not.toBe(a.workspace);
  await refresh.click();
  await expect(page.locator('.lab-alert')).toContainText(c.codes['workspace-changed']);
  await expect(page.locator('.lab-review')).toHaveCount(0);
  expect((await (await context.request.get('/api/laboratory/state')).json()).entries).toEqual([]);
  await refresh.click();
  await expect(page.locator('.lab-alert')).toHaveCount(0);
  await reviewGroup('rg-stale-create');
  // Hold real state reads: the stale view has not yet observed the cookie replacement.
  await page.route('**/api/laboratory/state', (route) => route.abort());
  await replaceSession();
  await page.locator('.lab-review').getByRole('button', { name: c.create, exact: true }).click();
  await expect(page.locator('.lab-alert')).toContainText(c.codes['workspace-changed']);
  expect((await (await context.request.get('/api/laboratory/state')).json()).entries).toEqual([]);
  await page.unroute('**/api/laboratory/state');
  await refresh.click();
  await expect(page.locator('.lab-alert')).toContainText(c.codes['workspace-changed']);
  await refresh.click();
  await expect(page.locator('.lab-alert')).toHaveCount(0);
  await group(page, 'rg-reset-original');
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.route('**/api/laboratory/state', (route) => route.abort());
  await replaceSession();
  const other = await context.newPage();
  await other.goto('/labs/laboratory');
  await expect(other.getByRole('button', { name: c.newGroup, exact: true })).toBeVisible();
  await group(other, 'rg-reset-replacement');
  await page.getByRole('dialog').getByRole('button', { name: c.confirmReset, exact: true }).click();
  await expect(page.locator('.lab-alert')).toContainText(c.codes['workspace-changed']);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const final = await (await context.request.get('/api/laboratory/state')).json();
  expect(final.world.groups.map((g: { name: string }) => g.name)).toEqual(['rg-reset-replacement']);
  expect(final.world.attempt).toBe(1);
  expect(final.entries).toHaveLength(1);
  await other.close();
});
