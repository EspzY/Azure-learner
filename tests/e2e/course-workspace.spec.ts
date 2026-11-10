import { test, expect, type Page } from '@playwright/test';
import Axe from '@axe-core/playwright';
import { createHash, randomUUID } from 'node:crypto';
import { laboratoryV3Nb as c, nb } from '../../src/content/nb';
import { portalResourceContextNb as f } from '../../src/content/portal-resource-context-nb';
import { architectureStudioNb as studio } from '../../src/content/architecture-studio-nb';
import { startTemporary, create, courseBytes } from './ephemeral-actions';
const base = '/labs/course-workspace',
  api = '/api/course-laboratory/';
async function state(page: Page) {
  const r = await page.request.get(api + 'state');
  expect(r.status()).toBe(200);
  return r.json();
}
async function start(page: Page) {
  await page.goto('/learn');
  await page
    .getByRole('link', { name: 'Serverlagret kursarbeidsområde · teknisk', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Start serverlagret kursarbeidsområde', exact: true })
    .click();
  await expect(page.locator('.laboratory-workspace-status')).toContainText('laboratory@3.9.0');
}
async function service(page: Page, name: string) {
  // A card click starts an App Router transition. An absent landing-page nav
  // must not be mistaken for a collapsed Portal drawer: that would toggle the
  // arriving desktop Portal closed. Observe its rendered workspace first.
  await expect(page.locator('.laboratory-v3:visible')).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: c.loading })).toHaveCount(0);
  const nav = page.getByRole('navigation', { name: c.navigation, exact: true });
  if (!(await nav.isVisible()))
    await page.getByRole('button', { name: nb.portal.menu, exact: true }).click();
  const link = nav.getByRole('link', { name, exact: true }),
    disclosure = link.locator('xpath=ancestor::details[1]');
  if ((await disclosure.count()) && (await disclosure.getAttribute('open')) === null)
    await disclosure.locator('summary').click();
  await link.click();
  if (await page.evaluate(() => innerWidth <= 1100)) await page.keyboard.press('Escape');
}
async function group(page: Page, name = 'rg-course') {
  await service(page, c.groups);
  await page.getByRole('button', { name: c.newGroup, exact: true }).click();
  await page.getByRole('textbox', { name: f.groupName, exact: true }).fill(name);
  await commit(page, name);
}
async function commit(page: Page, name: string) {
  const native = (await page.locator('.lab-group-create:visible').count()) > 0;
  await page.getByRole('button', { name: native ? f.reviewCreate : c.review, exact: true }).click();
  const region = page.getByRole('region', { name: c.review, exact: true });
  await expect(region).toContainText(native ? f.validationNote : c.reviewNote);
  await region.getByRole('button', { name: c.create, exact: true }).click();
  await expect(page.locator('#lab-page-title')).toHaveText(name);
}
async function reset(page: Page) {
  await page.getByRole('button', { name: c.reset, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.confirmReset, exact: true }).click();
  await expect(page.locator('.lab-result')).toContainText(c.codes.updated);
}

test('persistent course vertical uses ordinary Portal Storage commands original receipts reload checkpoint and historical reset without learning events', async ({
  page,
}, info) => {
  await start(page);
  const old = await courseBytes(page);
  await expect(page.locator('.mission-coach,[data-guide]')).toHaveCount(0);
  const initial = await state(page);
  expect(initial.courseBinding).toMatchObject({
    profile: 'az900-technical@1',
    learningAttempt: null,
    model: 'laboratory@3.9.0',
  });
  await group(page);
  await page.getByRole('button', { name: c.newAccount, exact: true }).click();
  await page.getByRole('textbox', { name: /^Name/ }).fill('courseadapterstore');
  await commit(page, 'courseadapterstore');
  await page.getByRole('button', { name: c.newContainer, exact: true }).click();
  await page.getByRole('textbox', { name: /^Name/ }).fill('private-course');
  await commit(page, 'private-course');
  await page.getByRole('button', { name: c.newBlob, exact: true }).click();
  await page.getByRole('textbox', { name: /^Name/ }).fill('evidence.txt');
  const text = 'Original Å <script>window.__courseXss=1</script>';
  await page.getByRole('textbox', { name: new RegExp('^' + c.text) }).fill(text);
  await commit(page, 'evidence.txt');
  await expect(page.getByLabel(c.text, { exact: true })).toHaveText(text);
  expect(await page.evaluate(() => '__courseXss' in window)).toBe(false);
  await expect(page.locator('.portal-resource-main .portal-properties')).toContainText(
    createHash('sha256').update(text).digest('hex'),
  );
  const made = await state(page);
  expect(made.entries).toHaveLength(4);
  await page.getByRole('link', { name: c.receipt, exact: true }).click();
  await page.getByText(c.details, { exact: true }).click();
  await expect(page.locator('.lab-result pre')).toContainText('CreateTextBlob');
  await page.goBack();
  await expect(page.getByLabel(c.text, { exact: true })).toHaveText(text);
  const evidence = page.locator('.lab-course-evidence');
  await evidence.locator('summary').click();
  await evidence.getByRole('button', { name: 'Review teknisk evidens', exact: true }).click();
  expect((await state(page)).entries).toEqual(made.entries);
  await evidence.getByRole('button', { name: 'Lagre evidenspunkt', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Serververifisert evidenspunkt', exact: true }),
  ).toBeVisible();
  const id = new URL(page.url()).searchParams.get('evidence')!;
  expect(id).toMatch(/^[a-f0-9-]{36}$/);
  await page.reload();
  await expect(page.getByLabel(c.text, { exact: true })).toHaveText(text);
  await expect(evidence).toContainText(id);
  expect((await state(page)).entries).toEqual(made.entries);
  await page.screenshot({ path: info.outputPath('persistent-course-blob-evidence.png') });
  await service(page, studio.title);
  await expect(page.locator('.architecture-studio')).toHaveAttribute(
    'data-workspace',
    made.workspace,
  );
  await expect(page.locator('.architecture-studio')).toHaveAttribute('data-revision', '4');
  const writes: string[] = [];
  page.on('request', (r) => {
    if (r.method() === 'POST' && r.url().includes(api)) writes.push(r.url());
  });
  await page
    .locator('.portal-graph-toolbar')
    .getByRole('button', { name: studio.list, exact: true })
    .click();
  await page
    .getByRole('table', { name: studio.list, exact: true })
    .getByRole('button', { name: new RegExp('^courseadapterstore · ') })
    .click();
  const pane = page.getByRole('complementary', { name: studio.inspect, exact: true });
  await pane.getByRole('link', { name: studio.open, exact: true }).click();
  await expect(page).toHaveURL(/\/labs\/course-workspace\?/);
  await expect(page.locator('#lab-page-title')).toHaveText('courseadapterstore');
  await page.getByRole('link', { name: studio.back, exact: true }).click();
  await expect(page.locator('.architecture-studio')).toBeVisible();
  expect(writes).toEqual([]);
  await page.screenshot({ path: info.outputPath('course-shared-studio.png') });
  await reset(page);
  const after = await state(page);
  expect(after.world.groups).toEqual([]);
  expect(after.entries).toHaveLength(5);
  const archived = await page.request.get(api + 'evidence?id=' + id, {
    headers: { 'If-Laboratory-Workspace': made.workspace },
  });
  expect(archived.status()).toBe(200);
  const original = await archived.json();
  expect(original.snapshot.world).toEqual(made.world);
  expect(original.snapshot.entries).toEqual(made.entries);
  expect(original.evidence.binding.contextId).toBe(initial.courseBinding.contextId);
  expect(await courseBytes(page)).toBe(old);
});

test('free temporary memory and persistent course authority remain separate through navigation and independent resets', async ({
  page,
}) => {
  await startTemporary(page);
  await service(page, c.groups);
  await create(page, c.newGroup, { name: 'rg-free-memory' });
  const before = await courseBytes(page);
  await page.getByRole('link', { name: 'Til forsiden', exact: true }).click();
  await page.getByRole('link', { name: /AZ-900.*Azure Fundamentals/ }).click();
  await page
    .getByRole('link', { name: 'Serverlagret kursarbeidsområde · teknisk', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Start serverlagret kursarbeidsområde', exact: true })
    .click();
  await expect(page.locator('.laboratory-workspace-status')).toContainText('laboratory@3.9.0');
  const initial = await state(page);
  expect(initial.world.groups).toEqual([]);
  expect(initial.entries).toEqual([]);
  await group(page, 'rg-course-only');
  const made = await state(page);
  await page.getByRole('link', { name: 'Til forsiden', exact: true }).click();
  await page.getByRole('link', { name: /Åpne laboratoriet · AzureLab Laboratory/ }).click();
  await service(page, c.groups);
  await expect(page.getByRole('table')).toContainText('rg-free-memory');
  await expect(page.getByRole('table')).not.toContainText('rg-course-only');
  await reset(page);
  expect((await state(page)).entries).toEqual(made.entries);
  await page.goto(base + '?view=groups');
  await expect(page.getByRole('table')).toContainText('rg-course-only');
  await reset(page);
  expect((await state(page)).world.groups).toEqual([]);
  expect(await courseBytes(page)).toBe(before);
});

test('same course session tabs preserve stale Review rejection idempotency and server-resolved evidence ownership', async ({
  page,
  context,
  browser,
  baseURL,
}) => {
  await start(page);
  const initial = await state(page),
    other = await context.newPage();
  await other.goto(base + '?view=groups');
  await expect(other.getByRole('button', { name: c.newGroup, exact: true })).toBeVisible();
  for (const [p, name] of [
    [page, 'rg-one'],
    [other, 'rg-two'],
  ] as const) {
    if (p === page) await service(p, c.groups);
    await p.getByRole('button', { name: c.newGroup, exact: true }).click();
    await p.getByRole('textbox', { name: f.groupName, exact: true }).fill(name);
    await p.getByRole('button', { name: f.reviewCreate, exact: true }).click();
  }
  await page
    .getByRole('region', { name: c.review, exact: true })
    .getByRole('button', { name: c.create, exact: true })
    .click();
  await expect(page.locator('#lab-page-title')).toHaveText('rg-one');
  await other
    .getByRole('region', { name: c.review, exact: true })
    .getByRole('button', { name: c.create, exact: true })
    .click();
  await expect(other.locator('.lab-result')).toContainText(c.codes['stale-revision']);
  const made = await state(page);
  expect(made.world.groups.map((g: { name: string }) => g.name)).toEqual(['rg-one']);
  const original = made.entries.find(
      (e: { receipt: { outcome: string } }) => e.receipt.outcome === 'accepted',
    ).request,
    headers = { Origin: new URL(baseURL!).origin, 'If-Laboratory-Workspace': initial.workspace };
  const redelivered = await page.request.post(api + 'command', { headers, data: original });
  expect(redelivered.status()).toBe(200);
  expect((await redelivered.json()).redelivered).toBe(true);
  const conflict = await page.request.post(api + 'command', {
    headers,
    data: { ...original, command: { ...original.command, name: 'conflict' } },
  });
  expect(conflict.status()).toBe(409);
  const captured = await page.request.post(api + 'evidence', {
    headers,
    data: {
      captureId: randomUUID(),
      expectedRevision: made.world.revision,
      through: made.entries.length,
    },
  });
  expect(captured.status()).toBe(200);
  const id = (await captured.json()).evidence.id;
  const foreign = await browser.newContext({ baseURL });
  try {
    const f = await foreign.newPage();
    await start(f);
    const s = await state(f);
    expect(s.workspace).not.toBe(made.workspace);
    expect(s.world.groups).toEqual([]);
    expect(
      (
        await f.request.get(api + 'evidence?id=' + id, {
          headers: { 'If-Laboratory-Workspace': s.workspace },
        })
      ).status(),
    ).toBe(404);
  } finally {
    await foreign.close();
  }
  await other.close();
});

test('active original AZ900 first-help-retry draft remains byte-identical during neutral course-engine operations', async ({
  page,
}) => {
  const t = nb.foundationsV2,
    route = '/learn/computing?topic=v2-assessment';
  await page.goto(route);
  await page.getByRole('button', { name: t.beginAssessment, exact: true }).click();
  const question = t.extraItems[0]!.question;
  await page.getByLabel(question, { exact: true }).fill('3');
  const before = await courseBytes(page);
  // Explicit technical route is neutral inspection, not a new lesson or assessment.
  await page.goto(base);
  await page
    .getByRole('button', { name: 'Start serverlagret kursarbeidsområde', exact: true })
    .click();
  await expect(page.locator('.laboratory-workspace-status')).toContainText('laboratory@3.9.0');
  await group(page, 'rg-independent-neutral');
  expect(await courseBytes(page)).toBe(before);
  await page.goto(route);
  await expect(page.getByLabel(question, { exact: true })).toHaveValue('3');
  expect(await courseBytes(page)).toBe(before);
});

test('course authority unavailable is explicit and never accepts free temporary evidence or starts a fallback', async ({
  page,
}) => {
  const attempts: string[] = [];
  await page.route('**/api/course-laboratory/**', async (route) => {
    attempts.push(route.request().method());
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'backend-unavailable' }),
    });
  });
  await page.goto(base);
  await expect(page.locator('main').getByRole('alert')).toContainText(
    c.codes['backend-unavailable'],
  );
  await expect(
    page.getByRole('button', { name: 'Start serverlagret kursarbeidsområde', exact: true }),
  ).toBeDisabled();
  await expect(page.locator('.lab-temporary-entry')).toHaveCount(0);
  await expect(page.locator('.lab-course-evidence')).toHaveCount(0);
  expect(attempts.every((x) => x === 'GET')).toBe(true);
});

test('course workspace compact persistent Review evidence keyboard focus reduced motion and Axe retain readable isolated Portal controls', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page);
  await group(page, 'rg-accessible-course');
  const old = await courseBytes(page);
  await page.locator('.lab-course-evidence summary').focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Review teknisk evidens', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Lagre evidenspunkt', exact: true })).toBeVisible();
  expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  for (const size of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(size);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page
      .getByRole('button', { name: 'Lagre evidenspunkt', exact: true })
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByRole('button', { name: 'Lagre evidenspunkt', exact: true }),
    ).toBeInViewport();
    await page.screenshot({
      path: info.outputPath(`course-review-${size.width}-${size.height}.png`),
    });
  }
  await page.getByRole('button', { name: 'Lagre evidenspunkt', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Serververifisert evidenspunkt', exact: true }),
  ).toBeVisible();
  expect(await courseBytes(page)).toBe(old);
});
