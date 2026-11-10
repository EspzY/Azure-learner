import { describe, expect, it } from 'vitest';
import { storageNb, storageItemsNb } from '../../content/nb';
import {
  initialDesign,
  initialAccounts,
  initialDelivery,
  runDesign,
  runAccounts,
  runDelivery,
  validStorageInput,
  type StorageInput,
} from './storage-model';
import { StorageStore } from './storage-store';
import {
  storageKey,
  storageVersion,
  freshStorage,
  restoreStorage,
  applyStorage,
  storageFacts,
  storageGuidedFacts,
  storageMilestoneFacts,
  storageItems,
  storageItemIds,
  evaluateStorage,
  storageManifest,
  storageLimit,
  type StorageSave,
  type StorageMission,
} from './storage';
import { storageSources, storageStudySources, storageSourceReview } from './storage-sources';
import { prepareExistingTeaching } from './teaching-access';

const event = (s: StorageSave, e: unknown) => {
  const next = applyStorage(s, e);
  expect(next).not.toBeNull();
  return next!;
};
const answer = (decision: number, reason: number) => ({ decision, reason });
const memory = () => {
  const values = new Map<string, string>(),
    writes: string[] = [];
  let denied = false,
    deniedRead = false;
  return {
    values,
    writes,
    deny: (v = true) => {
      denied = v;
    },
    denyRead: (v = true) => {
      deniedRead = v;
    },
    getItem: (k: string) => {
      if (deniedRead) throw Error('denied read');
      return values.get(k) ?? null;
    },
    setItem: (k: string, v: string) => {
      if (denied) throw Error('denied write');
      values.set(k, v);
      writes.push(k);
    },
    removeItem: (k: string) => {
      if (denied) throw Error('denied delete');
      values.delete(k);
    },
  };
};
const run = (s: StorageSave, input: StorageInput) =>
  event(s, { kind: 'run', input, prediction: 1 });
const designGood = {
  ...initialDesign,
  services: { images: 'blob', documents: 'files', jobs: 'queue', metadata: 'table' },
} as const;
function witnessed(mission: StorageMission) {
  let s = event(freshStorage(), { kind: 'mission', mission });
  if (mission === 'design') {
    s = run(s, designGood);
    s = run(s, { ...designGood, imageAccess: 'smb' });
    s = run(s, {
      ...designGood,
      imageAccess: 'smb',
      services: { ...designGood.services, images: 'files' },
    });
  } else if (mission === 'accounts') {
    for (const input of [
      initialAccounts,
      { ...initialAccounts, account: 'gpv2' },
      { ...initialAccounts, account: 'gpv2', request: 'nfs' },
      { ...initialAccounts, account: 'fileSsd', request: 'nfs' },
      { ...initialAccounts, account: 'fileSsd', request: 'nfs', regionDeclared: false },
    ] as const)
      s = run(s, input);
  } else {
    s = run(s, initialDelivery);
    s = run(s, { ...initialDelivery, idempotent: true });
    s = run(s, { ...initialDelivery, payload: 'large' });
  }
  return s;
}
describe('documented service mechanisms and account boundaries', () => {
  it.each([
    ['gpv2', ['block', 'append', 'page', 'smb', 'queue', 'table']],
    ['block', ['block', 'append']],
    ['fileSsd', ['smb', 'nfs']],
    ['fileHdd', ['smb']],
    ['page', ['page']],
  ] as const)('%s supports only the independently declared request set', (account, expected) => {
    for (const request of [
      'block',
      'append',
      'page',
      'smb',
      'nfs',
      'queue',
      'table',
      'disk',
    ] as const) {
      const actual = runAccounts({ kind: 'accounts', account, request, regionDeclared: true })!;
      expect(actual.supported).toBe((expected as readonly string[]).includes(request));
      expect(actual.outcome).toBe(actual.supported ? 2 : 0);
    }
  });
  it('does not upgrade type compatibility to verified region, deployment or authorization', () => {
    expect(
      runAccounts({
        ...initialAccounts,
        account: 'fileSsd',
        request: 'nfs',
        regionDeclared: false,
      }),
    ).toMatchObject({ supported: true, qualified: false, outcome: 1 });
    expect(runAccounts({ ...initialAccounts, request: 'disk' })).toMatchObject({
      supported: false,
      outcome: 0,
    });
  });
  it('changes service suitability when the same images need mounted SMB access', () => {
    expect(runDesign(designGood)).toMatchObject({ matched: 4, requirementsMet: true });
    expect(runDesign({ ...designGood, imageAccess: 'smb' })).toMatchObject({
      matched: 3,
      requirementsMet: false,
    });
    expect(
      runDesign({
        ...designGood,
        imageAccess: 'smb',
        services: { ...designGood.services, images: 'files' },
      }),
    ).toMatchObject({ requirementsMet: true });
    expect(
      runDesign({
        ...designGood,
        services: { ...designGood.services, jobs: 'table', metadata: 'queue' },
      }),
    ).toMatchObject({ matched: 2, requirementsMet: false });
  });
  it('keeps redelivery, side effects and size rejection separate without a real queue', () => {
    expect(runDelivery(initialDelivery)).toMatchObject({ deliveries: 2, effects: 2, outcome: 1 });
    expect(runDelivery({ ...initialDelivery, idempotent: true })).toMatchObject({
      deliveries: 2,
      effects: 1,
      outcome: 2,
    });
    expect(runDelivery({ ...initialDelivery, payload: 'large' })).toMatchObject({
      accepted: false,
      deliveries: 0,
      effects: 0,
      outcome: 0,
      steps: [],
    });
  });
  it.each([
    null,
    {},
    { ...initialAccounts, account: '__proto__' },
    { ...initialAccounts, regionDeclared: 'yes' },
    { ...initialAccounts, token: 'secret' },
    { ...initialDesign, services: { images: 'blob' } },
    { ...initialDelivery, idempotent: 1 },
    { ...initialDelivery, kind: 'sql' },
  ])('rejects untrusted or fictitious runtime input %#', (input) =>
    expect(validStorageInput(input)).toBe(false),
  );
});
describe('guided causal evidence and terminal contracts', () => {
  it.each(['design', 'accounts', 'delivery'] as const)(
    '%s needs validated contrasts plus a causal explanation',
    (mission) => {
      const s = witnessed(mission),
        f = storageFacts(s),
        g = f.guide!;
      expect(storageGuidedFacts(g)).toMatchObject({ witnessed: true, complete: false });
      expect(f.completed).toEqual([]);
      const correct = { design: 1, accounts: 0, delivery: 2 }[mission];
      const final = event(s, { kind: 'explain', answer: correct });
      expect(storageFacts(final).completed).toEqual([mission]);
      expect(restoreStorage(JSON.stringify(final))).toEqual({ save: final, issue: null });
    },
  );
  it('navigation, configuration, repeated click and a good baseline do not manufacture completion', () => {
    let s = event(freshStorage(), { kind: 'visit', topic: 'blob' });
    s = event(s, { kind: 'mission', mission: 'design' });
    expect(applyStorage(s, { kind: 'explain', answer: 1 })).toBeNull();
    expect(applyStorage(s, { kind: 'configure', input: initialAccounts })).toBeNull();
    s = event(s, { kind: 'configure', input: designGood });
    expect(storageFacts(s).completed).toEqual([]);
    s = run(s, designGood);
    expect(storageGuidedFacts(storageFacts(s).guide!).witnessed).toBe(false);
  });
  it('pauses/resumes exact runs and configuration without visiting a fresh mission', () => {
    let s = event(freshStorage(), { kind: 'mission', mission: 'accounts' });
    s = event(s, { kind: 'configure', input: { ...initialAccounts, account: 'gpv2' } });
    s = run(s, initialAccounts);
    s = event(s, { kind: 'pause' });
    expect(storageFacts(s).guide).toBeUndefined();
    s = event(s, { kind: 'mission', mission: 'delivery' });
    s = event(s, { kind: 'resume', id: 1 });
    expect(storageFacts(s).guide).toMatchObject({
      id: 1,
      mission: 'accounts',
      configuration: { accounts: { account: 'gpv2' } },
      runs: [{ input: initialAccounts }],
    });
  });
  it('milestones require saved causal contrasts, not historic resource presence', () => {
    expect(storageMilestoneFacts(freshStorage())).toEqual({ accounts: false, delivery: false });
    expect(storageMilestoneFacts(witnessed('accounts')).accounts).toBe(true);
    expect(storageMilestoneFacts(witnessed('delivery')).delivery).toBe(true);
  });
  it('reserves draft/aid/submit capacity and never exceeds the bounded log', () => {
    let s = freshStorage();
    while (s.events.length < storageLimit - 6)
      s = event(s, { kind: 'visit', topic: s.events.length % 2 ? 'blob' : 'files' });
    s = event(s, { kind: 'begin', item: 'sa01' });
    expect(storageFacts(s).full).toBe(true);
    expect(applyStorage(s, { kind: 'mission', mission: 'design' })).toBeNull();
    s = event(s, { kind: 'draft', answer: answer(1, 2) });
    s = event(s, { kind: 'aid' });
    s = event(s, { kind: 'submit' });
    expect(storageFacts(s).firsts[0]).toMatchObject({ assisted: true, status: 'submitted' });
    expect(restoreStorage(JSON.stringify(s)).issue).toBeNull();
  });
});
describe('independent first/help/retry and durable replay', () => {
  it('every item requires the correct decision/reason relationship; never grades the decision alone', () => {
    for (const item of storageItemIds) {
      const pairs = storageItems[item].accepted as readonly (readonly [number, number])[];
      for (let d = 0; d < 3; d++)
        for (let r = 0; r < 3; r++)
          expect(evaluateStorage(item, answer(d, r)).relation).toBe(
            pairs.some(([x, y]) => x === d && y === r),
          );
      const [d, r] = pairs[0]!;
      expect(evaluateStorage(item, answer(d, (r + 1) % 3))).toMatchObject({
        decision: true,
        relation: false,
      });
    }
  });
  it('locks wrong firsts across helped retry, reload and sibling-family exposure', () => {
    let s = event(freshStorage(), { kind: 'begin', item: 'sa01' });
    expect(applyStorage(s, { kind: 'submit' })).toBeNull();
    s = event(s, { kind: 'draft', answer: answer(0, 0) });
    s = event(s, { kind: 'submit' });
    const first = JSON.stringify(storageFacts(s).firsts[0]);
    s = event(s, { kind: 'begin', item: 'sa01' });
    s = event(s, { kind: 'aid' });
    s = event(s, { kind: 'draft', answer: answer(1, 2) });
    s = event(s, { kind: 'submit' });
    expect(JSON.stringify(storageFacts(restoreStorage(JSON.stringify(s)).save).firsts[0])).toBe(
      first,
    );
    s = event(s, { kind: 'begin', item: 'sa03' });
    expect(storageFacts(s).current).toMatchObject({
      retry: true,
      assisted: false,
      status: 'active',
    });
  });
  it('records exposure even after abandon, and shields guided events during an active assessment', () => {
    let s = event(freshStorage(), { kind: 'begin', item: 'sa05' });
    for (const e of [
      { kind: 'mission', mission: 'design' },
      { kind: 'visit', topic: 'tables' },
      { kind: 'configure', input: initialAccounts },
    ])
      expect(applyStorage(s, e)).toBeNull();
    s = event(s, { kind: 'abandon' });
    s = event(s, { kind: 'begin', item: 'sa06' });
    expect(storageFacts(s).current?.retry).toBe(true);
  });
  it('rejects forged events, unknown versions, unknown properties and reinterpreted history', () => {
    for (const raw of [
      'bad',
      '[]',
      JSON.stringify({ ...freshStorage(), rubric: '2.0.0' }),
      JSON.stringify({ ...freshStorage(), world: {} }),
      JSON.stringify({ ...freshStorage(), events: [{ kind: 'aid' }] }),
      JSON.stringify({
        ...freshStorage(),
        events: [
          { kind: 'visit', topic: 'blob' },
          { kind: 'visit', topic: 'blob' },
        ],
      }),
    ])
      expect(restoreStorage(raw).issue).not.toBeNull();
    expect(restoreStorage(null)).toEqual({ save: freshStorage(), issue: null });
    expect(storageVersion).toBe('1.0.0');
  });
  it('writes only its isolated key, keeps durable aid, and preserves all unrelated bytes', () => {
    const m = memory();
    m.values.set('azurelab.learning.networking-foundations.v1', 'older bytes');
    m.values.set('azurelab.chapter01.guided.v1', 'technical bytes');
    const store = new StorageStore(m);
    store.load();
    expect(store.event({ kind: 'begin', item: 'sa01' })).toBe(true);
    expect(
      prepareExistingTeaching(store, storageKey, m.getItem, restoreStorage, storageFacts, () =>
        store.event({ kind: 'aid' }),
      ),
    ).toBe(true);
    expect(storageFacts(restoreStorage(m.getItem(storageKey)).save).assisted).toBe(true);
    expect(new Set(m.writes)).toEqual(new Set([storageKey]));
    expect(m.getItem('azurelab.learning.networking-foundations.v1')).toBe('older bytes');
    expect(m.getItem('azurelab.chapter01.guided.v1')).toBe('technical bytes');
  });
  it('denied aid cannot reveal teaching or rewrite the stored first draft', () => {
    const m = memory(),
      store = new StorageStore(m);
    store.load();
    store.event({ kind: 'begin', item: 'sa01' });
    const before = m.getItem(storageKey);
    m.deny();
    expect(
      prepareExistingTeaching(store, storageKey, m.getItem, restoreStorage, storageFacts, () =>
        store.event({ kind: 'aid' }),
      ),
    ).toBe(false);
    expect(m.getItem(storageKey)).toBe(before);
    expect(storageFacts(store.getSnapshot().save).assisted).toBe(false);
    expect(store.getSnapshot().issue).toBe('unsaved');
  });
  it('never merges concurrent drafts and reloads only the newer durable recording', () => {
    const m = memory(),
      a = new StorageStore(m),
      b = new StorageStore(m);
    a.load();
    a.event({ kind: 'begin', item: 'sa01' });
    b.load();
    b.event({ kind: 'draft', answer: answer(1, 2) });
    const newer = m.getItem(storageKey);
    expect(a.event({ kind: 'draft', answer: answer(0, 0) })).toBe(false);
    expect(a.getSnapshot().issue).toBe('conflict');
    expect(m.getItem(storageKey)).toBe(newer);
    a.load();
    expect(a.getSnapshot().issue).toBeNull();
    expect(storageFacts(a.getSnapshot().save).current?.answer).toEqual(answer(1, 2));
  });
  it('compare-before-delete recovery retains externally repaired or replaced data', () => {
    const m = memory();
    m.values.set(storageKey, 'broken');
    const store = new StorageStore(m);
    store.load();
    m.values.set(storageKey, JSON.stringify(freshStorage()));
    expect(store.recoverInvalid()).toBe(false);
    expect(m.getItem(storageKey)).toBe(JSON.stringify(freshStorage()));
    m.values.set(storageKey, 'still broken');
    store.load();
    expect(store.recoverInvalid()).toBe(true);
    expect(m.getItem(storageKey)).toBeNull();
    m.denyRead();
    store.load();
    expect(store.getSnapshot().issue).toBe('unsaved');
  });
});
describe('actual curriculum bindings', () => {
  it('maps only the two scoped slots and every item to authored teaching, rationale and checked sources', () => {
    expect(storageManifest.certificationOverlay.slots).toEqual(['2.3.01', '2.3.04']);
    expect(storageSourceReview.checked).toBe('2026-10-31');
    expect(storageSourceReview.protectedAssessment).toBe('excluded');
    for (const id of storageItemIds) {
      const definition = storageItems[id],
        copy = storageItemsNb[id];
      expect(copy.decisions).toHaveLength(3);
      expect(copy.reasons).toHaveLength(3);
      expect(copy.feedback[0]).toHaveLength(3);
      expect(copy.feedback[1]).toHaveLength(3);
      expect(storageNb.sections).toHaveProperty(definition.repeat);
      for (const source of definition.sources) expect(storageSources).toHaveProperty(source);
    }
    for (const sources of Object.values(storageStudySources))
      for (const id of sources)
        expect(storageSources[id][1]).toMatch(/^https:\/\/learn.microsoft.com\//);
    for (const objective of ['SG01', 'SG02', 'SG03', 'SG04'])
      expect(
        storageItemIds.filter((id) =>
          (storageItems[id].objectives as readonly string[]).includes(objective),
        ).length,
      ).toBeGreaterThanOrEqual(2);
  });
});
