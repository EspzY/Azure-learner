import { describe, it, expect } from 'vitest';
import { prepareExistingTeaching } from './teaching-access';
import { PhysicalStore } from './architecture-physical-store';
import {
  physicalKey,
  restorePhysical,
  physicalFacts,
  physicalCriteria,
  freshPhysical,
  applyPhysical,
} from './architecture-physical';
import { activeTeachingContexts } from '../../../tests/fixtures/active-teaching-contexts';
import { connectivityKey } from './connectivity';
const io = () => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, v: string) => {
      data.set(key, v);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
};
describe('shared teaching preflight for frozen assessment contracts', () => {
  it('validates fresh unaided fixtures for all eleven fixture-registered independent contexts', () => {
    const fixtures = activeTeachingContexts();
    expect(fixtures).toHaveLength(11);
    expect(new Set(fixtures.map((f) => f.key)).size).toBe(11);
    expect(fixtures.map((f) => f.key)).toContain(connectivityKey);
    for (const f of fixtures)
      expect(f.state(f.raw)).toMatchObject({ active: true, assisted: false });
  });
  it('holds conflicted Part A, preserves newer draft and requires durable aid after explicit reload', () => {
    const storage = io(),
      a = new PhysicalStore(storage),
      b = new PhysicalStore(storage);
    a.load();
    a.event({ kind: 'begin' });
    b.load();
    b.event({ kind: 'draft', answers: { zoneDesign: 'apps' } });
    const raw = storage.getItem(physicalKey);
    const prepare = () =>
      prepareExistingTeaching(a, physicalKey, storage.getItem, restorePhysical, physicalFacts, () =>
        a.event({ kind: 'aid' }),
      );
    expect(prepare()).toBe(false);
    expect(storage.getItem(physicalKey)).toBe(raw);
    a.load();
    expect(prepare()).toBe(true);
    expect(physicalFacts(a.getSnapshot().save).draft.zoneDesign).toBe('apps');
    const answers = Object.fromEntries(
      Object.entries(physicalCriteria).map(([k, v]) => [k, v.answer]),
    );
    a.event({ kind: 'submit', answers });
    expect(physicalFacts(a.getSnapshot().save).submissions[0]!.assisted).toBe(true);
    const first = storage.getItem(physicalKey);
    expect(prepare()).toBe(true);
    expect(storage.getItem(physicalKey)).toBe(first);
  });
  it('rejects unknown/corrupt bytes and never mutates submitted first', () => {
    const storage = io(),
      a = new PhysicalStore(storage);
    a.load();
    a.event({ kind: 'begin' });
    const prepare = () =>
      prepareExistingTeaching(a, physicalKey, storage.getItem, restorePhysical, physicalFacts, () =>
        a.event({ kind: 'aid' }),
      );
    for (const raw of ['{bad', JSON.stringify({ schema: 99 })]) {
      storage.data.set(physicalKey, raw);
      a.load();
      expect(prepare()).toBe(false);
      expect(storage.getItem(physicalKey)).toBe(raw);
    }
    const answers = Object.fromEntries(
      Object.entries(physicalCriteria).map(([k, v]) => [k, v.answer]),
    );
    const begun = applyPhysical(freshPhysical(), { kind: 'begin' })!;
    const completed = applyPhysical(begun, { kind: 'submit', answers })!;
    const raw = JSON.stringify(completed, null, 2);
    storage.data.set(physicalKey, raw);
    a.load();
    expect(prepare()).toBe(true);
    expect(storage.getItem(physicalKey)).toBe(raw);
    expect(physicalFacts(a.getSnapshot().save).submissions[0]!.assisted).toBe(false);
  });
  it('event=true in uncertain memory or denied read cannot grant teaching permission', () => {
    const storage = io();
    let readable = true,
      writable = true;
    const read = (key: string) => {
      if (!readable) throw Error('denied');
      return storage.getItem(key);
    };
    const a = new PhysicalStore({
      ...storage,
      getItem: read,
      setItem: (key, v) => {
        if (!writable) throw Error('denied');
        storage.setItem(key, v);
      },
    });
    a.load();
    a.event({ kind: 'begin' });
    const raw = storage.getItem(physicalKey);
    const prepare = () =>
      prepareExistingTeaching(a, physicalKey, read, restorePhysical, physicalFacts, () =>
        a.event({ kind: 'aid' }),
      );
    readable = false;
    expect(prepare()).toBe(false);
    readable = true;
    a.load();
    writable = false;
    expect(prepare()).toBe(false);
    expect(storage.getItem(physicalKey)).toBe(raw);
    expect(a.getSnapshot().issue).toBe('unsaved');
    writable = true;
    a.load();
    expect(prepare()).toBe(true);
    expect(physicalFacts(a.getSnapshot().save).assisted).toBe(true);
  });
});
