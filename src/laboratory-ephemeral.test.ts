import { describe, expect, it } from 'vitest';
import { POST } from './app/api/laboratory/ephemeral/route';
import type { Snapshot } from './laboratory/engine';

const url = 'https://azurelab.example/api/laboratory/ephemeral';
async function call(body: unknown, origin = 'https://azurelab.example') {
  const result = await POST(new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body),
  }));
  return { status: result.status, data: await result.json() };
}
const start = async () =>
  (await call({ action: 'session', model: 'laboratory@3.7.0' })).data as Snapshot;
const create = {
  commandId: 'temporary-group',
  expectedRevision: 0,
  command: { type: 'CreateGroup', subscriptionId: 'sub-shared',
    name: 'rg-temporary', metadataRegion: 'norwayeast' },
};
describe('stateless, untrusted Laboratory demonstration', () => {
  it('starts an independent latest-model workspace without a cookie or persisted state', async () => {
    const first = await call({ action: 'session', model: 'laboratory@3.7.0' });
    const second = await start();
    expect(first.status).toBe(201);
    expect(first.data.world.model).toBe('laboratory@3.7.0');
    expect(first.data.entries).toEqual([]);
    expect(first.data.workspace).not.toBe(second.workspace);
  });
  it('reviews without writing, then produces the original receipt and immutable historical replay', async () => {
    const empty = await start();
    const review = await call({ action: 'review', snapshot: empty,
      workspace: empty.workspace, request: create });
    expect(review.status).toBe(200);
    expect(review.data.preview.outcome).toBe('accepted');
    const result = await call({ action: 'command', snapshot: empty,
      workspace: empty.workspace, request: create });
    expect(result.data.receipt.outcome).toBe('accepted');
    expect(result.data.world.groups).toHaveLength(1);
    expect(result.data.entries).toHaveLength(1);
    const through = await call({ action: 'state', snapshot: result.data,
      workspace: empty.workspace, through: 0 });
    expect(through.data.world.groups).toHaveLength(0);
    expect(through.data.historical).toBe(true);
    const redelivered = await call({ action: 'command', snapshot: result.data,
      workspace: empty.workspace, request: create });
    expect(redelivered.data.redelivered).toBe(true);
    expect(redelivered.data.entries).toHaveLength(1);
    const reset = await call({ action: 'command', snapshot: result.data,
      workspace: empty.workspace, request: { commandId: 'reset-1', expectedRevision: 1,
        command: { type: 'ResetWorkspace' } } });
    expect(reset.data.receipt.outcome).toBe('accepted');
    expect(reset.data.world.groups).toHaveLength(0);
    expect(reset.data.entries).toHaveLength(2);
  });
  it('fails closed on forged data, stale workspace, conflicting command IDs and malformed inputs', async () => {
    const empty = await start();
    const forged = structuredClone(empty);
    (forged.world as { groups: unknown[] }).groups.push({ id: 'fake-resource' });
    expect((await call({ action: 'state', snapshot: forged, workspace: empty.workspace })).data.error)
      .toBe('unverifiable-history');
    expect((await call({ action: 'review', snapshot: empty, workspace: crypto.randomUUID(),
      request: create })).status).toBe(409);
    const after = (await call({ action: 'command', snapshot: empty,
      workspace: empty.workspace, request: create })).data;
    const conflict = await call({ action: 'command', snapshot: after,
      workspace: empty.workspace, request: { ...create, expectedRevision: 1 } });
    expect(conflict.status).toBe(409);
    expect(conflict.data.error).toBe('command-id-conflict');
    const invalid = await call({ action: 'command', snapshot: empty,
      workspace: empty.workspace, request: { ...create, command: { type: 'Unsupported' } } });
    expect(invalid.data.error ?? invalid.data.receipt?.outcome).not.toBe('accepted');
    expect((await call({ action: 'session' }, 'https://untrusted.example')).status).toBe(403);
  });
});
