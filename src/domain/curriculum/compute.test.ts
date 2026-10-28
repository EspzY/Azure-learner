import { describe, it, expect } from 'vitest';
import {
  initialContainer,
  initialCapacity,
  initialDesktop,
  runContainer,
  runCapacity,
  runDesktop,
  runHosting,
  hostingCandidates,
  validComputeInput,
  type CapacityInput,
} from './compute-model';
import {
  applyCompute,
  computeFacts,
  computeItems,
  computeItemIds,
  computeKey,
  computeManifest,
  computeMilestoneFacts,
  computeGuidedFacts,
  computeGuidedAnswer,
  computeTopics,
  freshCompute,
  restoreCompute,
  evaluateCompute,
  type ComputeSave,
} from './compute';
import { ComputeStore } from './compute-store';
import { computeVmFacts } from './compute-vm';
import { parseLocation, portalHref } from '../portal/model';
import { computeNb, computeItemsNb } from '@/content/nb';
import { computeSources, computeStudySources } from './compute-sources';
import { freshEngine, execute, type Engine, type Command } from '../sandbox/model';
const apply = (s: ComputeSave, e: unknown) => {
  const n = applyCompute(s, e);
  if (!n) throw Error('fixture');
  return n;
};
function storage() {
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
}
describe('P05 compute mechanisms, never an Azure runtime', () => {
  it('separates image, runtime, process and data lifetime', () => {
    expect(runContainer({ ...initialContainer, runtime: false })).toMatchObject({
      created: false,
      instance: null,
      outcome: 0,
    });
    expect(runContainer({ ...initialContainer, image: false })).toMatchObject({ created: false });
    expect(runContainer(initialContainer)).toMatchObject({
      created: true,
      retained: false,
      instance: 'instance-B',
      ownKernel: false,
      outcome: 1,
    });
    expect(runContainer({ ...initialContainer, storage: 'external' })).toMatchObject({
      retained: true,
      outcome: 2,
    });
    expect(runContainer({ ...initialContainer, action: 'inspect' })).toMatchObject({
      retained: true,
      instance: 'instance-A',
    });
    expect(runContainer({ ...initialContainer, host: 'customer-vm' })).toMatchObject({
      hostResponsibility: 'customer',
      ownKernel: false,
    });
    expect(runContainer(initialContainer)).toMatchObject({ hostResponsibility: 'provider' });
  });
  it('qualifies process versus Hyper-V isolation and guest control', () => {
    expect(runContainer({ ...initialContainer, image: false, action: 'inspect' })).toMatchObject({
      created: true,
      retained: true,
      instance: 'instance-A',
    });
    expect(
      runContainer({ ...initialContainer, runtime: false, storage: 'external' }),
    ).toMatchObject({ created: false, retained: true, outcome: 0 });
    expect(runContainer({ ...initialContainer, isolation: 'hyperv' })).toMatchObject({
      ownKernel: true,
      ownGuest: false,
    });
    expect(runContainer({ ...initialContainer, guestRequired: true })).toMatchObject({
      compatible: false,
    });
    expect(
      runContainer({ ...initialContainer, platform: 'vm', guestRequired: true }),
    ).toMatchObject({ ownKernel: true, ownGuest: true, compatible: true });
    expect(
      runContainer({ ...initialContainer, platform: 'functions', guestRequired: true }),
    ).toMatchObject({ compatible: false });
    expect(
      runContainer({ ...initialContainer, platform: 'functions', image: false }),
    ).toMatchObject({ created: true });
  });
  it('models declared capacity, explicit scale rule and correct fault boundaries', () => {
    expect(runCapacity(initialCapacity)).toMatchObject({
      count: 1,
      capacity: 10,
      unmet: 10,
      outcome: 1,
    });
    expect(
      runCapacity({ ...initialCapacity, mode: 'set', count: 3, failure: 'zone' }),
    ).toMatchObject({ surviving: 0, capacity: 0 });
    expect(
      runCapacity({ ...initialCapacity, mode: 'zones', count: 3, failure: 'zone' }),
    ).toMatchObject({ surviving: 2, capacity: 20, outcome: 2 });
    expect(
      runCapacity({ ...initialCapacity, mode: 'set', count: 3, failure: 'fault' }),
    ).toMatchObject({ surviving: 2 });
    expect(
      runCapacity({ ...initialCapacity, mode: 'set', count: 3, failure: 'update' }),
    ).toMatchObject({ surviving: 1 });
    expect(runCapacity({ ...initialCapacity, mode: 'vmss', auto: true, demand: 40 })).toMatchObject(
      { count: 4, capacity: 40, outcome: 2 },
    );
    expect(
      runCapacity({ ...initialCapacity, mode: 'vmss', auto: false, demand: 40 }),
    ).toMatchObject({ count: 1, capacity: 10, outcome: 1 });
    expect(
      runCapacity({ ...initialCapacity, mode: 'vmss', auto: true, demand: 40, failure: 'region' }),
    ).toMatchObject({ count: 4, surviving: 0, capacity: 0 });
  });
  it('cannot turn surviving compute into available app paths without data/routing', () => {
    expect(
      runCapacity({
        ...initialCapacity,
        mode: 'zones',
        count: 3,
        failure: 'zone',
        routing: 'primary',
      }),
    ).toMatchObject({ surviving: 2, capacity: 0 });
    expect(runCapacity({ ...initialCapacity, mode: 'zones', count: 3, data: false })).toMatchObject(
      { surviving: 3, capacity: 0 },
    );
    expect(
      runCapacity({ ...initialCapacity, mode: 'zones', count: 3, failure: 'data' }),
    ).toMatchObject({ surviving: 3, capacity: 0 });
  });
  it('conserves deterministic bounded capacity over a crossed input space', () => {
    let cases = 0;
    for (const mode of ['single', 'set', 'vmss', 'zones'] as const)
      for (const count of [1, 2, 3, 4, 5, 6])
        for (const failure of [
          'none',
          'instance',
          'fault',
          'update',
          'zone',
          'region',
          'data',
        ] as const)
          for (const target of [0, 1, 2])
            for (const auto of [false, true])
              for (const routing of ['primary', 'balanced'] as const) {
                const i: CapacityInput = {
                  ...initialCapacity,
                  mode,
                  count,
                  failure,
                  target,
                  auto,
                  routing,
                  demand: 25,
                };
                const r = runCapacity(i);
                if (!r) continue;
                cases++;
                expect(r).toEqual(runCapacity(i));
                expect(r.capacity).toBe(r.instances.reduce((n, x) => n + x.capacity, 0));
                expect(r.served + r.unmet).toBe(i.demand);
                expect(r.capacity).toBeLessThanOrEqual(r.surviving * 10);
                if (failure === 'region' || failure === 'data') expect(r.capacity).toBe(0);
              }
    expect(cases).toBeGreaterThan(500);
  });
  it('distinguishes AVD publication, host backing and supported combinations', () => {
    expect(runDesktop(initialDesktop)).toMatchObject({
      compatible: true,
      published: true,
      backed: true,
      outcome: 2,
    });
    expect(runDesktop({ ...initialDesktop, linked: false })).toMatchObject({
      published: false,
      outcome: 0,
    });
    expect(runDesktop({ ...initialDesktop, assigned: false })).toMatchObject({ published: false });
    expect(runDesktop({ ...initialDesktop, hosts: 0 })).toMatchObject({
      published: true,
      backed: false,
      outcome: 1,
    });
    expect(runDesktop({ ...initialDesktop, pool: 'personal' })).toMatchObject({
      compatible: false,
    });
    expect(
      runDesktop({
        ...initialDesktop,
        pool: 'personal',
        publication: 'desktop',
        session: 'single',
      }),
    ).toMatchObject({ compatible: true });
  });
  it('accepts multiple hosting candidates only with compatible technical reasons', () => {
    expect(hostingCandidates('web-image')).toEqual(['app-service', 'container-apps']);
    expect(hostingCandidates('cluster-api')).toEqual(['aks']);
    expect(hostingCandidates('guest-driver')).toEqual(['vm']);
    expect(
      runHosting({ kind: 'hosting', workload: 'web-image', service: 'app-service', reason: 'web' }),
    ).toMatchObject({ outcome: 2 });
    expect(
      runHosting({
        kind: 'hosting',
        workload: 'web-image',
        service: 'container-apps',
        reason: 'managed-container',
      }),
    ).toMatchObject({ outcome: 2 });
    expect(
      runHosting({
        kind: 'hosting',
        workload: 'web-image',
        service: 'container-apps',
        reason: 'web',
      }),
    ).toMatchObject({ decision: true, reason: false, outcome: 1 });
  });
  it('keeps hypothetical shared sites separate from unknown nonzonal Azure placement', () => {
    for (const mode of ['single', 'set', 'vmss'] as const) {
      const r = runCapacity({ ...initialCapacity, mode, count: mode === 'single' ? 1 : 3 })!;
      expect(r.instances.every((x) => x.zone === null && x.site === 0)).toBe(true);
    }
    const r = runCapacity({ ...initialCapacity, mode: 'zones', count: 3 })!;
    expect(r.instances.map((x) => x.zone)).toEqual([0, 1, 2]);
    expect(
      runCapacity({ ...initialCapacity, mode: 'set', count: 3, failure: 'zone' })!.surviving,
    ).toBe(0);
  });
  it('requires the actual mission causal relation and rejects each plausible wrong explanation', () => {
    const runs = {
      container: [initialContainer, { ...initialContainer, storage: 'external' }],
      capacity: [
        { ...initialCapacity, mode: 'set', count: 3, failure: 'zone' },
        { ...initialCapacity, mode: 'zones', count: 3, demand: 10, failure: 'zone' },
        { ...initialCapacity, mode: 'vmss', auto: true, demand: 30 },
      ],
      hosting: [
        { kind: 'hosting', workload: 'web-image', service: 'app-service', reason: 'web' },
        { kind: 'hosting', workload: 'cluster-api', service: 'aks', reason: 'kubernetes' },
      ],
    };
    for (const mission of ['container', 'capacity', 'hosting'] as const) {
      let s = apply(freshCompute(), { kind: 'mission', mission, attempt: null, boundary: null });
      for (const input of runs[mission]) s = apply(s, { kind: 'run', input, prediction: 2 });
      expect(computeGuidedFacts(computeFacts(s).guide!).witnessed).toBe(true);
      for (let answer = 0; answer < 3; answer++) {
        const trial = apply(s, { kind: 'explain', answer });
        expect(computeGuidedFacts(computeFacts(trial).guide!).complete).toBe(
          answer === computeGuidedAnswer[mission],
        );
      }
      expect(computeNb.causes[mission].choices).toHaveLength(3);
    }
    expect(evaluateCompute('cp11', { decision: 2, reason: 2 }).relation).toBe(false);
    expect(evaluateCompute('cp11', { decision: 0, reason: 1 }).relation).toBe(true);
    expect(evaluateCompute('cp12', { decision: 0, reason: 2 }).relation).toBe(true);
    expect(evaluateCompute('cp12', { decision: 2, reason: 0 }).relation).toBe(true);
    expect(evaluateCompute('cp12', { decision: 2, reason: 2 }).relation).toBe(false);
  });
  it('rejects malformed, unknown, unbounded and coerced model input', () => {
    for (const v of [
      null,
      [],
      {},
      { ...initialContainer, image: 'true' },
      { ...initialContainer, host: 'automatic-security' },
      { ...initialContainer, unknown: 1 },
      { ...initialCapacity, demand: -1 },
      { ...initialCapacity, demand: Infinity },
      { ...initialCapacity, count: 1.5 },
      { ...initialCapacity, auto: true },
      { ...initialDesktop, hosts: 5 },
    ])
      expect(validComputeInput(v)).toBe(false);
  });
});
describe('P05 isolated replay and independent evidence', () => {
  it('requires actual witnessed models plus causal explanation, never visit/click', () => {
    let s = apply(freshCompute(), {
      kind: 'mission',
      mission: 'container',
      attempt: null,
      boundary: null,
    });
    expect(computeFacts(s).completed).toEqual([]);
    expect(applyCompute(s, { kind: 'explain', answer: 0 })).toBeNull();
    s = apply(s, { kind: 'run', input: initialContainer, prediction: 2 });
    s = apply(s, {
      kind: 'run',
      input: { ...initialContainer, storage: 'external' },
      prediction: 2,
    });
    expect(computeMilestoneFacts(s).container).toBe(true);
    expect(computeFacts(s).completed).toEqual([]);
    s = apply(s, { kind: 'explain', answer: computeGuidedAnswer.container });
    expect(computeGuidedFacts(computeFacts(s).guide!).complete).toBe(true);
    expect(applyCompute(s, { kind: 'explain', answer: computeGuidedAnswer.container })).toBe(s);
    expect(restoreCompute(JSON.stringify(s))).toEqual({ save: s, issue: null });
  });
  it('has changed contexts, versions, source links and complete per-option feedback for every objective', () => {
    expect(computeManifest.certificationOverlay.slots).toEqual({
      '2.2.01': 'CP01',
      '2.2.02': 'CP02',
      '2.2.03': 'CP03',
      '2.2.04': 'CP04',
    });
    for (const objective of ['CP01', 'CP02', 'CP03', 'CP04'])
      expect(
        computeItemIds.filter((id) =>
          (computeItems[id].objectives as readonly string[]).includes(objective),
        ).length,
      ).toBeGreaterThanOrEqual(2);
    for (const id of computeItemIds) {
      const d = computeItems[id],
        copy = computeItemsNb[id];
      expect(copy.decisions).toHaveLength(3);
      expect(copy.reasons).toHaveLength(3);
      expect(copy.feedback.every((a) => a.length === 3 && a.every((x) => x.length > 20))).toBe(
        true,
      );
      for (const source of d.sources) expect(source in computeSources).toBe(true);
      for (let a = 0; a < 3; a++)
        for (let b = 0; b < 3; b++) {
          const r = evaluateCompute(id, { decision: a, reason: b });
          expect(r.relation).toBe(
            (d.accepted as readonly (readonly number[])[]).some((p) => p[0] === a && p[1] === b),
          );
          if (!r.relation) expect(r.misconceptions.length).toBeGreaterThan(0);
        }
    }
    expect(evaluateCompute('cp11', { decision: 0, reason: 2 }).relation).toBe(false);
    for (const [topic, ids] of Object.entries(computeStudySources)) {
      expect(topic in computeNb.sections).toBe(true);
      ids.forEach((id) => expect(id in computeSources).toBe(true));
    }
    expect(computeManifest.humanSme).toBeNull();
  });
  it('locks firsts and family exposure while separating aid, retry and abandon', () => {
    let s = apply(freshCompute(), { kind: 'begin', item: 'cp11' });
    s = apply(s, { kind: 'draft', answer: { decision: 0, reason: 2 } });
    s = apply(s, { kind: 'submit' });
    const first = structuredClone(computeFacts(s).firsts[0]);
    s = apply(s, { kind: 'begin', item: 'cp11' });
    s = apply(s, { kind: 'aid' });
    s = apply(s, { kind: 'draft', answer: { decision: 0, reason: 1 } });
    s = apply(s, { kind: 'submit' });
    expect(computeFacts(s).firsts[0]).toEqual(first);
    expect(computeFacts(s).current).toMatchObject({
      assisted: true,
      retry: true,
      status: 'submitted',
    });
    s = apply(s, { kind: 'begin', item: 'cp12' });
    s = apply(s, { kind: 'abandon' });
    s = apply(s, { kind: 'begin', item: 'cp12' });
    expect(computeFacts(s).current?.retry).toBe(true);
    expect(
      applyCompute(s, { kind: 'mission', mission: 'hosting', attempt: null, boundary: null }),
    ).toBeNull();
  });
  it('preserves terminal capacity through800 and causal guided ending at normal bound', () => {
    let s = freshCompute();
    while (s.events.length < 793)
      s = apply(s, { kind: 'visit', topic: s.events.length % 2 ? 'vm' : 'containers' });
    s = apply(s, { kind: 'begin', item: 'cp01' });
    while (s.events.length < 798)
      s = apply(s, { kind: 'draft', answer: { decision: s.events.length % 2, reason: 0 } });
    expect(applyCompute(s, { kind: 'draft', answer: { decision: 2, reason: 0 } })).toBeNull();
    s = apply(s, { kind: 'aid' });
    s = apply(s, { kind: 'submit' });
    expect(s.events).toHaveLength(800);
    expect(restoreCompute(JSON.stringify(s)).issue).toBeNull();
    expect(applyCompute(s, { kind: 'begin', item: 'cp02' })).toBeNull();
    let g = apply(freshCompute(), {
      kind: 'mission',
      mission: 'container',
      attempt: null,
      boundary: null,
    });
    g = apply(g, { kind: 'run', input: initialContainer, prediction: 1 });
    g = apply(g, {
      kind: 'run',
      input: { ...initialContainer, storage: 'external' },
      prediction: 2,
    });
    while (g.events.length < 795)
      g = apply(g, { kind: 'visit', topic: g.events.length % 2 ? 'vm' : 'containers' });
    g = apply(g, { kind: 'explain', answer: computeGuidedAnswer.container });
    expect(computeFacts(g).completed).toEqual(['container']);
  });
  it('rejects unknown versions, impossible replay, extra keys and oversized records', () => {
    for (const raw of [
      '{',
      JSON.stringify({ ...freshCompute(), schema: 2 }),
      JSON.stringify({ ...freshCompute(), events: [{ kind: 'submit' }] }),
      JSON.stringify({ ...freshCompute(), surprise: 1 }),
      'x'.repeat(600001),
    ])
      expect(restoreCompute(raw).issue).not.toBeNull();
    expect(applyCompute(freshCompute(), { kind: 'begin', item: 'old-result' })).toBeNull();
    expect(applyCompute(freshCompute(), { kind: 'visit', topic: 'hidden' })).toBeNull();
    expect(computeTopics).toContain('assessment');
  });
  it('fails closed on denied writes, stale tabs and compare-before-delete recovery', () => {
    const s = storage();
    s.data.set('old-learning', 'immutable');
    const a = new ComputeStore(s),
      b = new ComputeStore(s);
    a.load();
    b.load();
    expect(a.event({ kind: 'begin', item: 'cp01' })).toBe(true);
    expect(b.event({ kind: 'begin', item: 'cp02' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    const prefix = s.data.get(computeKey);
    const denied = new ComputeStore({
      ...s,
      setItem: () => {
        throw Error('denied');
      },
    });
    denied.load();
    expect(denied.prepareTeaching()).toBe(false);
    expect(s.data.get(computeKey)).toBe(prefix);
    expect(denied.getSnapshot().issue).toBe('unsaved');
    s.data.set(computeKey, 'broken');
    const recovery = new ComputeStore(s);
    recovery.load();
    s.data.set(computeKey, prefix!);
    expect(recovery.recoverInvalid()).toBe(false);
    expect(s.data.get(computeKey)).toBe(prefix);
    expect(s.data.get('old-learning')).toBe('immutable');
  });
  it('does not merge drafts and durable assistance survives reload', () => {
    const s = storage(),
      store = new ComputeStore(s);
    store.load();
    store.event({ kind: 'begin', item: 'cp06' });
    store.event({ kind: 'draft', answer: { decision: 0, reason: null } });
    expect(store.prepareTeaching()).toBe(true);
    const next = new ComputeStore(s);
    next.load();
    expect(computeFacts(next.getSnapshot().save).current).toMatchObject({
      assisted: true,
      answer: { decision: 0, reason: null },
    });
    s.data.set(computeKey, JSON.stringify(freshCompute()));
    store.changed();
    expect(store.event({ kind: 'submit' })).toBe(false);
    expect(computeFacts(store.getSnapshot().save).current?.answer.decision).toBe(0);
  });
});
describe('P05 resumable missions', () => {
  it('allowlists navigation-only Compute origin and refuses competing legacy lab contexts', () => {
    const location = parseLocation(new URLSearchParams('area=vms&compute=vm'));
    expect(location.compute).toBe(true);
    expect(
      parseLocation(new URLSearchParams(portalHref(location, 'architecture').split('?')[1]))
        .compute,
    ).toBe(true);
    for (const extra of [
      'mission=diagnose',
      'practice=vm',
      'bridge=reliability',
      'lab=web-platform',
      'course=1',
    ])
      expect(parseLocation(new URLSearchParams(`compute=vm&${extra}`)).compute).toBeUndefined();
    expect(parseLocation(new URLSearchParams('compute=unsupported')).compute).toBeUndefined();
  });
  it('pauses and resumes exact saved work without new boundaries or assessment credit', () => {
    let s = apply(freshCompute(), {
      kind: 'mission',
      mission: 'container',
      attempt: null,
      boundary: null,
    });
    s = apply(s, { kind: 'configure', input: { ...initialContainer, storage: 'external' } });
    s = apply(s, { kind: 'run', input: initialContainer, prediction: 1 });
    const original = structuredClone(computeFacts(s).guide!);
    s = apply(s, { kind: 'pause' });
    expect(computeFacts(s).guide).toBeUndefined();
    s = apply(s, { kind: 'mission', mission: 'vm', attempt: 2, boundary: 'actual-boundary' });
    const vm = structuredClone(computeFacts(s).guide!);
    s = apply(s, { kind: 'resume', id: original.id });
    expect(computeFacts(s).guide).toEqual(original);
    s = apply(s, { kind: 'resume', id: vm.id });
    expect(computeFacts(s).guide).toEqual(vm);
    expect(restoreCompute(JSON.stringify(s)).save).toEqual(s);
    expect(computeFacts(s).firsts).toEqual([]);
    expect(applyCompute(s, { kind: 'resume', id: 799 })).toBeNull();
    s = apply(s, { kind: 'begin', item: 'cp01' });
    expect(applyCompute(s, { kind: 'pause' })).toBeNull();
    expect(applyCompute(s, { kind: 'resume', id: original.id })).toBeNull();
  });
});
describe('P05 actual VM witness, frozen operational engine', () => {
  it('requires a new atomic accepted VM, real reused subnet and all referenced inspections', () => {
    let engine: Engine = freshEngine(),
      seq = 0;
    const command = (command: Command) => {
      const r = execute(engine, {
        commandId: `compute-${++seq}`,
        expectedWorldRevision: engine.world.revision,
        command,
      });
      engine = r.engine;
      return r.receipt;
    };
    command({
      type: 'CreateGroup',
      subscriptionId: 'sub-app',
      name: 'rg-compute',
      metadataRegion: 'norwayeast',
    });
    const group = engine.world.groups[0]!.id;
    command({
      type: 'CreateVmBundle',
      groupId: group,
      name: 'seed',
      region: 'northeurope',
      image: 'ubuntu-22-04',
      profile: 'small',
      dataDiskGiB: '0',
      subnetId: '',
    });
    const subnet = engine.world.infrastructure.find((r) => r.kind === 'subnet')!.id,
      boundary = engine.ledger.at(-1)!.receipt.commandId;
    const bad = JSON.stringify(engine.world);
    expect(
      command({
        type: 'CreateVmBundle',
        groupId: group,
        name: 'invalid',
        region: 'moon',
        image: 'windows-2022',
        profile: 'standard',
        dataDiskGiB: '64',
        subnetId: subnet,
      }).outcome,
    ).toBe('rejected');
    expect(JSON.stringify(engine.world)).toBe(bad);
    const receipt = command({
      type: 'CreateVmBundle',
      groupId: group,
      name: 'indexer',
      region: 'northeurope',
      image: 'windows-2022',
      profile: 'standard',
      dataDiskGiB: '64',
      subnetId: subnet,
    });
    expect(receipt.outcome).toBe('accepted');
    const vm = engine.world.infrastructure.find(
      (r) => r.kind === 'vm' && receipt.addedIds.includes(r.id),
    )!;
    let save = apply(freshCompute(), { kind: 'mission', mission: 'vm', attempt: 1, boundary });
    save = apply(save, { kind: 'select', target: vm.id });
    let f = computeVmFacts(computeFacts(save).guide, engine, 1);
    expect(f).toMatchObject({ newBuild: true, complete: false });
    const chain = f.chain!;
    for (const ref of [
      chain.vm.id,
      chain.os.id,
      chain.data!.id,
      chain.nic.id,
      chain.subnet.id,
      chain.vnet.id,
      receipt.commandId,
    ])
      save = apply(save, { kind: 'inspect', ref, through: receipt.commandId });
    save = apply(save, { kind: 'explain', answer: 0 });
    expect(computeVmFacts(computeFacts(save).guide, engine, 1).complete).toBe(false);
    save = apply(save, { kind: 'explain', answer: computeGuidedAnswer.vm });
    f = computeVmFacts(computeFacts(save).guide, engine, 1);
    expect(f.complete).toBe(true);
    expect(computeVmFacts(computeFacts(save).guide, engine, 2).verifiable).toBe(false);
    expect(
      computeVmFacts({ ...computeFacts(save).guide!, boundary: receipt.commandId }, engine, 1)
        .newBuild,
    ).toBe(false);
    expect(applyCompute(save, { kind: 'select', target: 'another-vm' })).toBeNull();
  });
});
