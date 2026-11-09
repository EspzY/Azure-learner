import { afterEach, expect, it, vi } from 'vitest';
import { POST } from './app/api/laboratory/ephemeral/route';
import type { Request as LabRequest } from './laboratory/engine';
const req = (id: string): LabRequest => ({
  commandId: id,
  expectedRevision: 0,
  command: {
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'rg-' + id,
    metadataRegion: 'norwayeast',
  },
});
const bridge = async (_url: unknown, init?: RequestInit) =>
  POST(
    new Request('https://azurelab.example/api/laboratory/ephemeral', {
      ...init,
      headers: { ...init?.headers, Origin: 'https://azurelab.example', Host: 'azurelab.example' },
    }),
  );
async function client(fetcher: typeof bridge = bridge) {
  vi.resetModules();
  vi.stubGlobal('fetch', vi.fn(fetcher));
  return import('./features/laboratory/ephemeral-client');
}
afterEach(() => {
  vi.unstubAllGlobals();
});
it('serializes concurrent writes against actual current memory, records stale rejection and does not lose the accepted result', async () => {
  const c = await client(),
    original = await c.startEphemeral();
  const [a, b] = await Promise.all([
    c.ephemeralApi('command', req('one'), original.workspace),
    c.ephemeralApi('command', req('two'), original.workspace),
  ]);
  expect(a.receipt.outcome).toBe('accepted');
  expect(b.receipt.code).toBe('stale-revision');
  const s = await c.ephemeralApi('state');
  expect(s.world.groups).toHaveLength(1);
  expect(s.entries).toHaveLength(2);
  expect(vi.mocked(fetch).mock.calls.every(([, init]) => init?.credentials === 'omit')).toBe(true);
});
it('lost stateless response never advances memory; retry keeps original ID and appends exactly one received result', async () => {
  let lose = true;
  const c = await client(async (url, init) => {
    const response = await bridge(url, init);
    if (JSON.parse(String(init!.body)).action === 'command' && lose) {
      lose = false;
      throw Error('lost response');
    }
    return response;
  });
  const s = await c.startEphemeral();
  await expect(c.ephemeralApi('command', req('lost'), s.workspace)).rejects.toThrow(
    'server-result-unavailable',
  );
  expect((await c.ephemeralApi('state')).entries).toEqual([]);
  const recovered = await c.ephemeralApi('command', req('lost'), s.workspace);
  expect(recovered.receipt.commandId).toBe('lost');
  expect(recovered.entries).toHaveLength(1);
  const repeated = await c.ephemeralApi('command', req('lost'), s.workspace);
  expect(repeated.redelivered).toBe(true);
  expect(repeated.entries).toHaveLength(1);
});
it('a late command cannot overwrite an explicitly replaced workspace', async () => {
  let release!: (r: Response) => void, ready!: () => void;
  const waiting = new Promise<void>((r) => {
    ready = r;
  });
  const c = await client(async (url, init) => {
    const r = await bridge(url, init);
    if (JSON.parse(String(init!.body)).action === 'command') {
      ready();
      return new Promise<Response>((resolve) => {
        release = () => resolve(r);
      });
    }
    return r;
  });
  const a = await c.startEphemeral(),
    late = c.ephemeralApi('command', req('late'), a.workspace);
  const rejected = expect(late).rejects.toThrow('workspace-changed');
  await waiting;
  const b = await c.startEphemeral();
  release(new Response());
  await rejected;
  expect((await c.ephemeralApi('state')).workspace).toBe(b.workspace);
  expect((await c.ephemeralApi('state')).entries).toEqual([]);
});
it('inspection clones and failed positive-looking HTTP responses do not fabricate or mutate current memory', async () => {
  let invalid = false;
  const c = await client(async (url, init) =>
    invalid
      ? Response.json({ receipt: { outcome: 'accepted' }, world: {} }, { status: 503 })
      : bridge(url, init),
  );
  await c.startEphemeral();
  const s = await c.ephemeralApi('state');
  s.world.groups.push({
    id: 'forged',
    name: 'negative-test',
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
    origin: 'not-an-event',
  });
  expect((await c.ephemeralApi('state')).world.groups).toHaveLength(0);
  invalid = true;
  await expect(c.ephemeralApi('command', req('bad'))).rejects.toThrow('server-result-unavailable');
  expect((await c.ephemeralApi('state')).entries).toEqual([]);
});
