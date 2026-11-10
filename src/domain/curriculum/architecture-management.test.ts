import { describe, it, expect } from 'vitest';
import { managementNb as c } from '@/content/nb';
import { ManagementStore } from './architecture-management-store';
import {
  applyManagement,
  freshManagement,
  managementFacts,
  managementKey,
  managementStudy,
  managementCriteria,
  managementManifest,
  managementActivities,
  managementSources,
  restoreManagement,
  managementTopics,
  scopeFixture,
  initialScope,
  evaluateScope,
  managementHierarchy,
  ancestry,
  liveManagementObservation,
  type ManagementSave,
  type ManagementEvent,
} from './architecture-management';
import { freshEngine, execute } from '../sandbox/model';
import { courseHref, courseLabHref, restoreCourse, freshCourse } from '../course/model';
const apply = (s: ManagementSave, e: ManagementEvent) => {
  const n = applyManagement(s, e);
  expect(n).not.toBeNull();
  return n!;
};
const answers = Object.fromEntries(
  Object.entries(managementCriteria).map(([k, v]) => [k, v.answer]),
);
const io = () => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
    removeItem: (k: string) => {
      data.delete(k);
    },
  };
};
describe('Core management projection, cause and evidence', () => {
  it('projects real empty scopes with directory outside ARM ancestry', () => {
    const w = freshEngine().world,
      n = managementHierarchy(w);
    expect(n).toHaveLength(4);
    expect(ancestry(n, 'sub-app')).toEqual(['sub-app', 'mg-lab', 'root-lab']);
    expect(ancestry(n, w.identity.id)).toBeNull();
    expect(w.policies[0]!.scopeId).toBe('sub-app');
  });
  it('fails closed on unknown/broken/cyclic ancestry', () => {
    expect(ancestry(scopeFixture, 'missing')).toBeNull();
    expect(
      ancestry([{ id: 'a', name: 'a', kind: 'management', parentId: 'a', type: 'x' }], 'a'),
    ).toBeNull();
    expect(
      ancestry([{ id: 'a', name: 'a', kind: 'group', parentId: 'missing', type: 'x' }], 'a'),
    ).toBeNull();
  });
  it('separates descendants, type conditions and effect without any state mutation', () => {
    const before = JSON.stringify(scopeFixture);
    const r = evaluateScope(initialScope)!;
    expect(r.find((x) => x.id === 'dev-plan')!.status).toBe('denied');
    expect(r.find((x) => x.id === 'dev-vm')!.status).toBe('other-type');
    expect(r.find((x) => x.id === 'prod-plan')!.status).toBe('outside');
    const a = evaluateScope({ ...initialScope, scope: 'parent', effect: 'audit' })!;
    expect(a.filter((x) => x.status === 'denied')).toHaveLength(0);
    expect(a.find((x) => x.id === 'dev-plan')!.status).toBe('finding');
    expect(a.find((x) => x.id === 'prod-plan')!.status).toBe('compliant');
    expect(
      evaluateScope({ ...initialScope, effect: 'disabled' })!.find((x) => x.id === 'dev-plan')!
        .status,
    ).toBe('disabled');
    expect(JSON.stringify(scopeFixture)).toBe(before);
  });
  it('validates scope inputs and preserves type/region counterexamples', () => {
    for (const bad of [
      null,
      {},
      { ...initialScope, scope: 'sub-app' },
      { ...initialScope, effect: 'modify' },
      { ...initialScope, allowed: 'moon' },
      { ...initialScope, extra: true },
    ])
      expect(evaluateScope(bad)).toBeNull();
    expect(
      evaluateScope({ ...initialScope, allowed: 'northeurope' })!.filter(
        (x) => x.status === 'denied',
      ),
    ).toHaveLength(0);
    expect(
      evaluateScope({ ...initialScope, scope: 'dev-group', target: 'vm' })!.find(
        (x) => x.id === 'dev-vm',
      )!.inherited,
    ).toBe(true);
  });
  it('reads actual created membership/hosting and denial witnesses without adding rejected resources', () => {
    let e = freshEngine();
    const run = (command: Record<string, string>) => {
      e = execute(e, {
        commandId: 'mg-' + e.ledger.length,
        expectedWorldRevision: e.world.revision,
        command,
      }).engine;
    };
    run({
      type: 'CreateGroup',
      subscriptionId: 'sub-app',
      name: 'rg-management',
      metadataRegion: 'norwayeast',
    });
    const g = e.world.groups[0]!;
    run({
      type: 'CreatePlan',
      groupId: g.id,
      name: 'denied',
      region: 'northeurope',
      profile: 'linux-learning-v1',
    });
    expect(e.world.resources).toHaveLength(0);
    expect(liveManagementObservation(e).denial?.scope).toBe('sub-app');
    run({
      type: 'CreatePlan',
      groupId: g.id,
      name: 'allowed',
      region: 'westeurope',
      profile: 'linux-learning-v1',
    });
    const plan = e.world.resources[0]!;
    run({ type: 'CreateWebApp', groupId: g.id, name: 'management-app', planId: plan.id });
    const before = JSON.stringify(e),
      n = managementHierarchy(e.world),
      o = liveManagementObservation(e);
    expect(o.relation?.plan).toBe(plan.id);
    expect(ancestry(n, o.relation!.app)).toEqual([
      o.relation!.app,
      g.id,
      'sub-app',
      'mg-lab',
      'root-lab',
    ]);
    expect(n.filter((x) => x.kind === 'plan')).toHaveLength(1);
    expect(JSON.stringify(e)).toBe(before);
  });
  it('requires disjoint model comparisons, real-resource explanation and all theory checks; clicks do not complete', () => {
    let s = apply(freshManagement(), { kind: 'visit', topic: 'hierarchy' });
    expect(managementFacts(s).guided).toBe(false);
    s = apply(s, { kind: 'run', input: initialScope, prediction: 0 });
    s = apply(s, { kind: 'explain', answer: 'conditions' });
    expect(managementFacts(s).guided).toBe(false);
    s = apply(s, {
      kind: 'run',
      input: { ...initialScope, scope: 'parent', effect: 'audit' },
      prediction: 0,
    });
    expect(managementFacts(s).guided).toBe(false);
    s = apply(s, {
      kind: 'observe',
      app: 'app-1',
      plan: 'plan-2',
      group: 'group-3',
      subscription: 'sub-app',
      answer: 'distinct',
    });
    expect(managementFacts(s).guided).toBe(true);
    expect(managementFacts(s).objective('CA04').first).toBeFalsy();
  });
  it('rejects malformed observations, invalid predictions and answers', () => {
    for (const e of [
      {
        kind: 'observe',
        app: 'same',
        plan: 'same',
        group: 'g',
        subscription: 'sub-app',
        answer: 'distinct',
      },
      {
        kind: 'policy',
        command: 'x',
        scope: 'mg-lab',
        assignment: 'policy-web-location',
        location: 'northeurope',
      },
      { kind: 'run', input: initialScope, prediction: 5 },
      { kind: 'study', section: 'groups', answer: 'bogus' },
      { kind: 'submit', answers },
    ])
      expect(applyManagement(freshManagement(), e)).toBeNull();
  });
  it('preserves immutable first, explicit help, retry and abandoned first exposure', () => {
    let s = apply(freshManagement(), { kind: 'begin' });
    s = apply(s, { kind: 'draft', answers: { subscription: 'development' } });
    s = apply(s, { kind: 'submit', answers: { ...answers, subscription: 'development' } });
    const first = structuredClone(managementFacts(s).submissions[0]);
    s = apply(s, { kind: 'begin' });
    s = apply(s, { kind: 'submit', answers });
    expect(managementFacts(s).submissions[0]).toEqual(first);
    expect(managementFacts(s).submissions[1]!.retry).toBe(true);
    expect(managementFacts(s).objective('CA05').first).toBe(false);
    let abandoned = apply(freshManagement(), { kind: 'begin' });
    abandoned = apply(abandoned, { kind: 'abandon' });
    abandoned = apply(abandoned, { kind: 'begin' });
    abandoned = apply(abandoned, { kind: 'submit', answers });
    expect(managementFacts(abandoned).submissions[0]!.retry).toBe(true);
  });
  it('marks Summary and Journal-style aid before submission, preserves active draft', () => {
    let s = apply(freshManagement(), { kind: 'begin' });
    s = apply(s, { kind: 'draft', answers: { lifecycle: 'all' } });
    s = apply(s, { kind: 'visit', topic: 'core-summary' });
    expect(managementFacts(s).assisted).toBe(true);
    expect(managementFacts(s).draft.lifecycle).toBe('all');
    s = apply(s, { kind: 'submit', answers });
    expect(managementFacts(s).objective('CA04').first).toBe(false);
  });
  it('replays exact versions and rejects corrupt/future/oversized/forged structure', () => {
    let s = apply(freshManagement(), { kind: 'begin' });
    s = apply(s, { kind: 'submit', answers });
    expect(restoreManagement(JSON.stringify(s)).save).toEqual(s);
    for (const raw of ['{bad', JSON.stringify({ ...s, extra: 1 }), ' '.repeat(200001)])
      expect(restoreManagement(raw).issue).toBe('corrupt');
    expect(restoreManagement(JSON.stringify({ ...s, content: '2.0.0' })).issue).toBe('unsupported');
  });
  it('reserves help and terminal at event capacity, never traps active assessment', () => {
    let s = freshManagement();
    for (let i = 0; i < 398; i++)
      s = apply(s, { kind: 'visit', topic: i % 2 ? 'resources' : 'groups' });
    s = apply(s, { kind: 'begin' });
    s = apply(s, { kind: 'draft', answers });
    const prefix = structuredClone(s.events);
    expect(s.events).toHaveLength(400);
    expect(applyManagement(s, { kind: 'draft', answers: {} })).toBeNull();
    s = apply(s, { kind: 'visit', topic: 'core-summary' });
    expect(managementFacts(s).assisted).toBe(true);
    expect(applyManagement(s, { kind: 'aid' })).toBe(s);
    s = apply(s, { kind: 'submit', answers });
    expect(s.events).toHaveLength(402);
    expect(s.events.slice(0, 400)).toEqual(prefix);
    expect(restoreManagement(JSON.stringify(s)).issue).toBeNull();
    expect(applyManagement(s, { kind: 'begin' })).toBeNull();
  });
  it('refuses stale cross-tab writers while preserving all old keys', () => {
    const storage = io();
    for (const k of [
      'azurelab.learning.architecture-physical.v1',
      'azurelab.sandbox.v2',
      'azurelab.progress.v1',
      'azurelab.learning.foundations.v2',
    ])
      storage.data.set(k, 'old exact bytes');
    const before = [...storage.data];
    const a = new ManagementStore(storage),
      b = new ManagementStore(storage);
    a.load();
    b.load();
    expect(a.event({ kind: 'begin' })).toBe(true);
    expect(b.event({ kind: 'begin' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    for (const [k, v] of before) expect(storage.getItem(k)).toBe(v);
  });
  it('rechecks invalid recovery and cannot delete newer valid evidence', () => {
    const storage = io();
    storage.data.set(managementKey, '{bad');
    const store = new ManagementStore(storage);
    store.load();
    const newer = JSON.stringify(apply(freshManagement(), { kind: 'begin' }));
    storage.data.set(managementKey, newer);
    expect(store.recoverInvalid()).toBe(false);
    expect(storage.getItem(managementKey)).toBe(newer);
    expect(store.getSnapshot().issue).toBeNull();
    storage.data.set(managementKey, '{bad');
    store.load();
    storage.data.set(managementKey, '{different');
    expect(store.recoverInvalid()).toBe(false);
    expect(storage.getItem(managementKey)).toBe('{different');
    expect(store.recoverInvalid()).toBe(true);
  });
  it('withholds teaching on stale bytes; explicit reload preserves newer drafts before durable aid', () => {
    const storage = io(),
      a = new ManagementStore(storage),
      b = new ManagementStore(storage);
    a.load();
    a.event({ kind: 'begin' });
    b.load();
    b.event({ kind: 'draft', answers: { subscription: 'development' } });
    const newer = storage.getItem(managementKey);
    // Also covers the interval before the storage event is delivered.
    expect(a.prepareTeaching()).toBe(false);
    expect(a.getSnapshot().issue).toBe('conflict');
    expect(storage.getItem(managementKey)).toBe(newer);
    a.load();
    expect(a.prepareTeaching()).toBe(true);
    expect(managementFacts(a.getSnapshot().save).draft.subscription).toBe('development');
    expect(managementFacts(a.getSnapshot().save).assisted).toBe(true);
    expect(a.event({ kind: 'submit', answers })).toBe(true);
    expect(managementFacts(a.getSnapshot().save).submissions[0]!.assisted).toBe(true);
  });
  it('never merges teaching into a different attempt, immutable first or invalid latest record', () => {
    const storage = io(),
      a = new ManagementStore(storage),
      b = new ManagementStore(storage);
    a.load();
    a.event({ kind: 'begin' });
    b.load();
    b.event({ kind: 'submit', answers });
    const first = storage.getItem(managementKey);
    expect(a.prepareTeaching()).toBe(false);
    expect(storage.getItem(managementKey)).toBe(first);
    a.load();
    expect(a.prepareTeaching()).toBe(true);
    expect(storage.getItem(managementKey)).toBe(first);
    b.event({ kind: 'begin' });
    expect(a.prepareTeaching()).toBe(false);
    a.load();
    expect(a.prepareTeaching()).toBe(true);
    expect(managementFacts(a.getSnapshot().save).submissions[0]!.assisted).toBe(false);
    expect(managementFacts(a.getSnapshot().save).assisted).toBe(true);
    for (const raw of ['{bad', JSON.stringify({ schema: 99 })]) {
      storage.data.set(managementKey, raw);
      a.load();
      expect(a.prepareTeaching()).toBe(false);
      expect(storage.getItem(managementKey)).toBe(raw);
    }
  });
  it('denied reads/writes cannot permit teaching; full history still reserves real help and closure', () => {
    const storage = io();
    let read = true,
      write = true;
    const store = new ManagementStore({
      ...storage,
      getItem: (k) => {
        if (!read) throw Error('denied');
        return storage.getItem(k);
      },
      setItem: (k, v) => {
        if (!write) throw Error('denied');
        storage.setItem(k, v);
      },
    });
    let save = freshManagement();
    for (let i = 0; i < 398; i++)
      save = apply(save, { kind: 'visit', topic: i % 2 ? 'resources' : 'groups' });
    save = apply(save, { kind: 'begin' });
    save = apply(save, { kind: 'draft', answers });
    storage.data.set(managementKey, JSON.stringify(save));
    store.load();
    read = false;
    expect(store.prepareTeaching()).toBe(false);
    read = true;
    store.load();
    write = false;
    expect(store.prepareTeaching()).toBe(false);
    expect(store.getSnapshot().issue).toBe('unsaved');
    expect(storage.getItem(managementKey)).toBe(JSON.stringify(save));
    write = true;
    store.load();
    expect(store.prepareTeaching()).toBe(true);
    expect(store.getSnapshot().save.events).toHaveLength(401);
    expect(store.event({ kind: 'submit', answers })).toBe(true);
    expect(store.getSnapshot().save.events).toHaveLength(402);
    expect(managementFacts(store.getSnapshot().save).submissions[0]!.assisted).toBe(true);
  });
  it('keeps denied writes in explicitly uncertain memory', () => {
    const store = new ManagementStore({
      ...io(),
      setItem: () => {
        throw Error('denied');
      },
    });
    store.load();
    expect(store.event({ kind: 'begin' })).toBe(true);
    expect(store.getSnapshot().issue).toBe('unsaved');
    expect(managementFacts(store.getSnapshot().save).active).toBe(true);
  });
  it('maps complete authored theory, activities, independent reasons and official sources without human approval', () => {
    expect(managementManifest.objectives).toHaveLength(4);
    expect(managementManifest.humanSme).toBeNull();
    expect(Object.keys(managementActivities)).toEqual([...managementManifest.activities]);
    for (const [id, rule] of Object.entries(managementStudy)) {
      const text = c.sections[id as keyof typeof managementStudy];
      expect(text.choices.map((x) => x[0])).toEqual([...rule.options]);
      expect(text.paragraphs.length).toBeGreaterThan(2);
      for (const source of text.sources) expect(managementSources).toHaveProperty(source);
    }
    for (const [id, rule] of Object.entries(managementCriteria)) {
      const q = c.questions[id as keyof typeof managementCriteria];
      expect(q.choices.map((x) => x[0])).toEqual([...rule.options]);
      for (const [k] of q.choices) expect((q.feedback as Record<string, string>)[k]).toBeTruthy();
    }
  });
  it('extends allowlisted course navigation/return without changing existing lab origins', () => {
    for (const topic of managementTopics)
      expect(courseHref('architecture', topic)).toBe('/learn/architecture?topic=' + topic);
    expect(courseLabHref(false, 'architecture-management')).toBe(
      '/learn/architecture?topic=scope&activity=lab',
    );
    expect(courseLabHref(true, 'services-v2')).toBe(
      '/learn/services?topic=practice&activity=debrief',
    );
    const old = freshCourse();
    expect(restoreCourse(JSON.stringify(old)).save).toEqual(old);
  });
  it('keeps nested subnet ancestry distinct from group membership and actual VM dependencies', () => {
    let e = freshEngine();
    const send = (command: Record<string, string>) => {
      const r = execute(e, {
        commandId: 'nested-' + e.ledger.length,
        expectedWorldRevision: e.world.revision,
        command,
      });
      expect(r.receipt.outcome).toBe('accepted');
      e = r.engine;
    };
    send({
      type: 'CreateGroup',
      subscriptionId: 'sub-shared',
      name: 'rg-vm-scope',
      metadataRegion: 'norwayeast',
    });
    const group = e.world.groups[0]!;
    send({
      type: 'CreateVmBundle',
      groupId: group.id,
      name: 'vm-scope',
      region: 'northeurope',
      image: 'ubuntu-22-04',
      profile: 'small',
      dataDiskGiB: '32',
      subnetId: '',
    });
    const nodes = managementHierarchy(e.world),
      subnet = nodes.find((n) => n.kind === 'subnet')!,
      vnet = nodes.find((n) => n.kind === 'vnet')!,
      vm = nodes.find((n) => n.kind === 'vm')!;
    expect(ancestry(nodes, subnet.id)).toEqual([
      subnet.id,
      vnet.id,
      group.id,
      'sub-shared',
      'mg-lab',
      'root-lab',
    ]);
    expect(ancestry(nodes, vm.id)).toEqual([vm.id, group.id, 'sub-shared', 'mg-lab', 'root-lab']);
    expect(liveManagementObservation(e).denial).toBeNull();
  });
  it('names the actual Part B recovery/assessment target and never inherits physical-task instructions', () => {
    for (const key of [
      'reload',
      'repair',
      'repairTitle',
      'repairConfirm',
      'loading',
      'begin',
      'submit',
      'limit',
    ] as const) {
      expect(c[key]).toContain('Part B');
      expect(c[key]).not.toContain('Part A');
    }
    expect(c.repairText).toContain('Part A, Foundations');
    expect(c.aidText).toContain('ancestry');
    expect(c.aidText).not.toContain('recovery');
  });
});
