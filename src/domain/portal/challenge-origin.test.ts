import { describe, it, expect, vi } from 'vitest';
import { ServiceStore } from './store';
import {
  applyModuleEvent,
  freshServices,
  restoreServices,
  serviceFacts,
  serviceLearningKey,
} from './learning';
import { parseLocation, portalHref } from './model';
import {
  challengeOriginKey,
  challengeOriginFromLocation,
  challengeResumeHref,
  challengeReturnHref,
  readChallengeOrigin,
} from './challenge-origin';

const computing = { module: 'computing', topic: 'resource-bridge' } as const;
const services = { module: 'services', topic: 'practice' } as const;
function fixture() {
  const memory = new Map<string, string>();
  const storage = {
    getItem: (k: string) => memory.get(k) ?? null,
    setItem: (k: string, v: string) => {
      memory.set(k, v);
    },
    removeItem: (k: string) => {
      memory.delete(k);
    },
  };
  const store = new ServiceStore(storage);
  store.load();
  return { memory, storage, store };
}
const settled = async (store: ServiceStore) =>
  vi.waitFor(() => expect(store.getSnapshot().originReady).toBe(true));
describe('CC-01 attempt-bound return evidence, never scoring evidence', () => {
  it('preserves only the explicit Computing topic; unrelated and invalid topics stay rejected', () => {
    const location = parseLocation(
      new URLSearchParams('area=challenge&course=1&module=computing&topic=resource-bridge'),
    );
    expect(location.topic).toBe('resource-bridge');
    expect(challengeOriginFromLocation(location)).toEqual(computing);
    expect(parseLocation(new URLSearchParams('module=services&topic=resource-bridge')).topic).toBe(
      'overview',
    );
    expect(
      parseLocation(new URLSearchParams('module=computing&topic=../resource-bridge')).topic,
    ).toBe('overview');
    expect(
      challengeOriginFromLocation(parseLocation(new URLSearchParams('area=challenge'))),
    ).toBeNull();
    expect(challengeOriginFromLocation({ ...location, practice: 'paas' })).toBeNull();
    expect(challengeOriginFromLocation({ ...location, mission: 'platform' })).toBeNull();
    const next = parseLocation(
      new URLSearchParams(portalHref(location, 'resources').split('?')[1]),
    );
    expect(challengeOriginFromLocation(next)).toEqual(computing);
  });
  it('pins explicit Start to the original unchanged begin and survives draft, aid, submission and reload', async () => {
    const { store, memory, storage } = fixture();
    expect(await store.beginChallenge(computing, 'portal-4', 1)).toBe(true);
    expect(JSON.parse(memory.get(serviceLearningKey)!)).toEqual(
      applyModuleEvent(freshServices(), { kind: 'begin', boundary: 'portal-4', attemptNumber: 1 }),
    );
    const pin = memory.get(challengeOriginKey);
    store.event({ kind: 'draft', answers: { osModel: 'iaas' } });
    store.event({ kind: 'aid' });
    store.event({ kind: 'submit', through: 'portal-7' });
    expect(memory.get(challengeOriginKey)).toBe(pin);
    const reload = new ServiceStore(storage);
    reload.load();
    await settled(reload);
    expect(reload.getSnapshot().origin).toEqual(computing);
    expect(serviceFacts(reload.getSnapshot().save).submissions[0]).toMatchObject({
      assisted: true,
      answers: { osModel: 'iaas' },
    });
    expect(challengeReturnHref(computing, false)).toBe(
      '/learn/computing?topic=resource-bridge&activity=debrief',
    );
  });
  it('does not invent origin from old events or a current Services/Computing URL', async () => {
    const { store, storage } = fixture();
    store.event({ kind: 'begin', boundary: null, attemptNumber: 1 });
    const raw = storage.getItem(serviceLearningKey);
    const reload = new ServiceStore(storage);
    reload.load();
    await settled(reload);
    expect(reload.getSnapshot().origin).toBeNull();
    expect(storage.getItem(serviceLearningKey)).toBe(raw);
    expect(challengeResumeHref(null)).toBe('/portal?area=challenge&mode=independent');
    expect(challengeReturnHref(null, true)).toBe('/learn?activity=challenge-return');
  });
  it('retains a documented Services origin and does not change original firsts on assisted retry', async () => {
    const { store, storage } = fixture();
    await store.beginChallenge(services, null, 1);
    store.event({ kind: 'draft', answers: { osModel: 'iaas' } });
    store.event({ kind: 'submit', through: 'portal-1' });
    const first = serviceFacts(store.getSnapshot().save).submissions[0];
    await store.beginChallenge(computing, 'portal-1', 1);
    store.event({ kind: 'aid' });
    store.event({ kind: 'abandon' });
    const restored = restoreServices(storage.getItem(serviceLearningKey));
    expect(restored.issue).toBeNull();
    expect(serviceFacts(restored.save).submissions[0]).toEqual(first);
    expect(serviceFacts(restored.save).submissions[1]).toMatchObject({
      assisted: true,
      abandoned: true,
    });
    expect(challengeResumeHref(services)).toContain('module=services&topic=practice');
  });
  it('rejects stale second starts without overwriting the winning origin or begin', async () => {
    const { store: a, storage } = fixture();
    const b = new ServiceStore(storage);
    b.load();
    const result = await Promise.all([
      a.beginChallenge(computing, null, 1),
      b.beginChallenge(services, null, 1),
    ]);
    expect(result.filter(Boolean)).toHaveLength(1);
    expect(serviceFacts(restoreServices(storage.getItem(serviceLearningKey)).save).active).toBe(
      true,
    );
    expect(JSON.parse(storage.getItem(serviceLearningKey)!).events).toHaveLength(1);
    expect(readChallengeOrigin(storage.getItem(challengeOriginKey))?.origin).toEqual(
      result[0] ? computing : services,
    );
  });
  it('a metadata-only cross-tab change withholds the origin until explicit reload', async () => {
    const { store, storage } = fixture();
    await store.beginChallenge(computing, null, 1);
    storage.setItem(challengeOriginKey, '{}');
    store.changed();
    expect(store.getSnapshot()).toMatchObject({ origin: null, originIssue: 'conflict' });
    expect(serviceFacts(store.getSnapshot().save).active).toBe(true);
  });
  it.each(['origin', 'begin', 'commit', 'readback'])(
    'does not claim successful Start after a rejected %s write',
    async (failure) => {
      const { memory, storage } = fixture();
      let writes = 0;
      const broken = new ServiceStore({
        ...storage,
        setItem: (key, raw) => {
          writes++;
          if (writes === { origin: 1, begin: 2, commit: 3, readback: 2 }[failure]) {
            if (failure === 'readback') return;
            throw Error('denied');
          }
          storage.setItem(key, raw);
        },
      });
      broken.load();
      expect(await broken.beginChallenge(computing, null, 1)).toBe(false);
      expect(broken.getSnapshot()).toMatchObject({ issue: 'unsaved', origin: null });
      const reload = new ServiceStore(storage);
      reload.load();
      await settled(reload);
      expect(reload.getSnapshot().origin).toBeNull();
      expect(serviceFacts(reload.getSnapshot().save).submissions).toHaveLength(0);
      expect(
        [...memory.keys()].every((k) => [serviceLearningKey, challengeOriginKey].includes(k)),
      ).toBe(true);
    },
  );
  it('withholds origin for corrupt, pending, mismatched and unsupported metadata', async () => {
    for (const mutate of [
      (v: Record<string, unknown>) => ({ ...v, committed: false }),
      (v: Record<string, unknown>) => ({ ...v, prefix: '0'.repeat(64) }),
      (v: Record<string, unknown>) => ({ ...v, schema: 2 }),
      (v: Record<string, unknown>) => ({
        ...v,
        origin: { module: 'computing', topic: 'intro-request' },
      }),
    ]) {
      const { store, storage } = fixture();
      await store.beginChallenge(computing, null, 1);
      storage.setItem(
        challengeOriginKey,
        JSON.stringify(mutate(JSON.parse(storage.getItem(challengeOriginKey)!))),
      );
      const reload = new ServiceStore(storage);
      reload.load();
      await settled(reload);
      expect(reload.getSnapshot().origin).toBeNull();
      expect(serviceFacts(reload.getSnapshot().save).active).toBe(true);
    }
  });
  it('denied draft/aid/submit/abandon writes never publish unrecorded evidence or results', async () => {
    for (const event of [
      { kind: 'draft', answers: { osModel: 'iaas' } },
      { kind: 'aid' },
      { kind: 'submit', through: 'portal-1' },
      { kind: 'abandon' },
    ]) {
      const { store, storage } = fixture();
      await store.beginChallenge(computing, null, 1);
      const broken = new ServiceStore({
        ...storage,
        setItem: () => {
          throw Error('denied');
        },
      });
      broken.load();
      const before = broken.getSnapshot().save;
      expect(broken.event(event)).toBe(false);
      expect(broken.getSnapshot().save).toBe(before);
      expect(serviceFacts(broken.getSnapshot().save)).toMatchObject({
        active: true,
        assisted: false,
        submissions: [],
      });
    }
  });
  it('global clear removes only the learning and navigation keys', async () => {
    const { store, memory } = fixture();
    await store.beginChallenge(computing, null, 1);
    memory.set('azurelab.progress.v1', 'awards');
    memory.set('world', 'unchanged');
    store.clear();
    expect(store.getSnapshot()).toMatchObject({
      origin: null,
      originReady: true,
      originIssue: null,
    });
    expect(memory.get(challengeOriginKey)).toBeUndefined();
    expect(memory.get(serviceLearningKey)).toBeUndefined();
    expect(memory.get('world')).toBe('unchanged');
    expect(memory.get('azurelab.progress.v1')).toBe('awards');
  });
});
