import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { laboratoryProbeBundle, probeHtml, frozenBase } from '../laboratory-probe-bundle';

const key = 'azurelab.sandbox.v2';
const v3 = 'azurelab.sandbox.v3';
const route = '/__qa/laboratory-client';
const digest = (raw: string | null) =>
  createHash('sha256')
    .update(raw ?? '<absent>')
    .digest('hex');
const bundle = laboratoryProbeBundle();
test.beforeEach(async ({ context }) => {
  await context.route('**/__qa/laboratory-client', (r) =>
    r.fulfill({ contentType: 'text/html', body: probeHtml }),
  );
  await context.route('**/__qa/laboratory-probe.js', (r) =>
    r.fulfill({ contentType: 'application/javascript', body: bundle.js }),
  );
});
async function open(context: BrowserContext) {
  const page = await context.newPage();
  await page.goto(route);
  await expect(page.getByLabel('Probe result')).toContainText('"loaded": true');
  return page;
}
async function result(page: Page) {
  return JSON.parse((await page.getByLabel('Probe result').textContent())!);
}
async function create(page: Page, name: string) {
  await page.getByLabel('Resource Group name').fill(name);
  await page.getByRole('button', { name: 'Create using frozen PR58 store' }).click();
  await expect(page.getByLabel('Probe result')).toContainText('"accepted": true');
  const value = await result(page);
  expect(value.snapshot.attempt.engine.ledger.at(-1).receipt.outcome).toBe('accepted');
  return value;
}
async function raw(page: Page) {
  return page.evaluate((k) => localStorage.getItem(k), key);
}
async function prepare(page: Page) {
  await page.getByRole('button', { name: 'Prepare and test candidate activation' }).click();
  await expect(page.getByLabel('Probe result')).toContainText('"activated": true');
}
async function pauseWrite(context: BrowserContext, page: Page, name: string) {
  const session = await context.newCDPSession(page);
  await session.send('Debugger.enable');
  await page.getByLabel('Resource Group name').fill(name);
  await page.getByRole('button', { name: 'Pause next legacy write' }).click();
  const paused = new Promise<void>((resolve) => session.once('Debugger.paused', () => resolve()));
  const click = page.getByRole('button', { name: 'Create using frozen PR58 store' }).click();
  await paused;
  return async () => {
    await session.send('Debugger.resume');
    await click;
    await expect(page.getByLabel('Probe result')).toContainText('"accepted": true');
    const value = await result(page);
    await session.detach();
    return value;
  };
}
async function evidence(name: string, value: unknown) {
  const body = JSON.stringify(
    {
      base: frozenBase,
      captured: new Date().toISOString(),
      sourceHashes: bundle.hashes,
      ...(value as object),
    },
    null,
    2,
  );
  const path = test.info().outputPath(name);
  writeFileSync(path, body);
  await test.info().attach(name, { contentType: 'application/json', path });
}

test('Stage1 BLOCKER: genuine old writer ignores a new Web Lock and separate epoch, while a simple source change is detected', async ({
  context,
}) => {
  const old = await open(context);
  await create(old, 'rg-source');
  // A real old client loaded AFTER the source write, BEFORE activation.
  const writer = await open(context);
  const candidate = await open(context);
  await prepare(candidate);
  const savedV3 = await candidate.evaluate((k) => localStorage.getItem(k), v3);
  // Hold the actual new-client lock. The old frozen implementation never requests it.
  await candidate.evaluate(() => {
    const holder = window as unknown as { releaseProbe?: () => void; probeLocked?: boolean };
    void navigator.locks.request('azurelab.laboratory.writer.v3', async () => {
      holder.probeLocked = true;
      await new Promise<void>((resolve) => {
        holder.releaseProbe = resolve;
      });
    });
  });
  await expect
    .poll(() =>
      candidate.evaluate(() => (window as unknown as { probeLocked: boolean }).probeLocked),
    )
    .toBe(true);
  // No injected World/receipt: use the frozen writer through normal fixture controls.
  await writer.getByLabel('Resource Group name').fill('rg-fork');
  await writer.getByRole('button', { name: 'Create using frozen PR58 store' }).click();
  await expect(writer.getByLabel('Probe result')).toContainText('"accepted": true');
  const fork = await result(writer);
  expect(fork.snapshot.attempt.engine.world.groups.map((g: { name: string }) => g.name)).toEqual([
    'rg-source',
    'rg-fork',
  ]);
  await candidate.getByRole('button', { name: 'Inspect candidate checkpoint' }).click();
  expect((await result(candidate)).inspected).toEqual({
    status: 'blocked',
    reason: 'source-conflict',
  });
  expect(await candidate.evaluate((k) => localStorage.getItem(k), v3)).toBe(savedV3);
  await candidate.reload();
  await candidate.getByRole('button', { name: 'Inspect candidate checkpoint' }).click();
  expect((await result(candidate)).inspected).toEqual({
    status: 'blocked',
    reason: 'source-conflict',
  });
  await evidence('simple-fork.json', {
    oldWriteAccepted: fork.accepted,
    candidate: (await result(candidate)).inspected,
    v3Unchanged: true,
    conclusion:
      'Detection works for a persistent changed source; the new lock did not fence the old writer.',
  });
});

test('Stage1 BLOCKER: tombstone fencing can erase a genuine old accepted write between compare and fence', async ({
  context,
}) => {
  const writer = await open(context);
  const candidate = await open(context);
  const resume = await pauseWrite(context, writer, 'rg-lost');
  // The actual old store is paused AFTER compare-read. A separate epoch exists.
  await prepare(candidate);
  const accepted = await resume();
  const forkRaw = await raw(candidate);
  expect(accepted.snapshot.attempt.engine.world.groups[0].name).toBe('rg-lost');
  // This is the REJECTED tombstone candidate, not a production operation.
  await candidate.evaluate((k) => localStorage.setItem(k, '{"schema":3,"retired":true}'), key);
  await candidate.reload();
  expect(await raw(candidate)).toBe('{"schema":3,"retired":true}');
  const checkpoint = JSON.parse((await candidate.evaluate((k) => localStorage.getItem(k), v3))!);
  expect(checkpoint.sourceV2).toBeNull();
  expect(checkpoint.original).not.toContain('rg-lost');
  expect(await raw(candidate)).not.toBe(forkRaw);
  await evidence('tombstone-loss.json', {
    accepted: accepted.accepted,
    lostWriteHash: digest(forkRaw),
    checkpointHash: digest(JSON.stringify(checkpoint)),
    conclusion:
      'No durable copy of accepted rg-lost exists in the final keys. Reject tombstone fencing.',
  });
});

test('Stage1 BLOCKER: real old writers produce byte-identical ABA source after candidate reload and defeat full-source comparison', async ({
  context,
}) => {
  const first = await open(context);
  const divergent = await open(context);
  const repeated = await open(context);
  const candidate = await open(context);
  // Both genuine old stores pass their own compare while the key is absent.
  // Pausing uses CDP at the StoragePort boundary; no old source is modified.
  const resumeB = await pauseWrite(context, divergent, 'rg-divergent');
  const resumeA = await pauseWrite(context, repeated, 'rg-alpha');
  const initial = await create(first, 'rg-alpha');
  const sourceA = await raw(candidate);
  await prepare(candidate);
  const activeRaw = await candidate.evaluate((k) => localStorage.getItem(k), v3);
  // Browser shutdown/reload loses non-durable StorageEvent history legitimately.
  await candidate.close();
  const beta = await resumeB();
  const sourceB = await raw(first);
  expect(sourceB).not.toBe(sourceA);
  expect(beta.snapshot.attempt.engine.world.groups[0].name).toBe('rg-divergent');
  const alphaAgain = await resumeA();
  const sourceAgain = await raw(first);
  expect(sourceAgain).toBe(sourceA);
  expect(alphaAgain.raw).toBe(sourceA);
  expect(initial.snapshot.attempt.engine.ledger[0].request.commandId).toBe('portal-1');
  expect(beta.snapshot.attempt.engine.ledger[0].request.commandId).toBe('portal-1');
  expect(alphaAgain.snapshot.attempt.engine.ledger[0].request.commandId).toBe('portal-1');
  const reloaded = await open(context);
  await reloaded.getByRole('button', { name: 'Inspect candidate checkpoint' }).click();
  const inspected = (await result(reloaded)).inspected;
  // This EXPECTED SECURITY FAILURE is why Storage stays disabled.
  expect(inspected.status).toBe('candidate-accepts');
  expect(await reloaded.evaluate((k) => localStorage.getItem(k), v3)).toBe(activeRaw);
  await reloaded.screenshot({ path: test.info().outputPath('aba-counterexample.png') });
  await evidence('aba-reload.json', {
    origin: new URL(reloaded.url()).origin,
    clients: {
      legacy: 'unchanged PR58 SandboxStore and Portal requestFor',
      candidate: 'test-only schema3 checkpoint probe; no v3 simulator',
    },
    sourceA: { hash: digest(sourceA), raw: sourceA },
    sourceB: { hash: digest(sourceB), raw: sourceB },
    sourceAgain: { hash: digest(sourceAgain), raw: sourceAgain },
    divergentAccepted: beta.accepted,
    repeatedAccepted: alphaAgain.accepted,
    candidateAfterReload: inspected.status,
    storageActivated: false,
    conclusion:
      'Full byte comparison and Web Locks cannot prove no competing old fork existed. This candidate fails the activation gate; no production Storage is enabled.',
  });
});
