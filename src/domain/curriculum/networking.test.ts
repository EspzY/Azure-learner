import { describe, it, expect } from 'vitest';
import {
  ipv4,
  address,
  cidr,
  contains,
  overlaps,
  usable,
  runAddress,
  initialAddress,
  runPeering,
  initialPeering,
  runDns,
  initialDns,
  runNetwork,
  validNetworkInput,
} from './networking-model';
import {
  applyNetworking,
  freshNetworking,
  restoreNetworking,
  networkingFacts,
  networkingGuidedFacts,
  networkingMilestoneFacts,
  networkingKey,
  networkingItems,
  networkingItemIds,
  networkingManifest,
  evaluateNetworking,
  type NetworkingSave,
} from './networking';
import { NetworkingStore } from './networking-store';
import { networkingInspection } from './networking-inspection';
import { networkingNb, networkingItemsNb } from '@/content/nb';
import { networkingSources, networkingStudySources } from './networking-sources';
import { prepareExistingTeaching } from './teaching-access';
import { freshEngine, execute, type Engine, type Command } from '../sandbox/model';
import { parseLocation, portalHref } from '../portal/model';
const apply = (s: NetworkingSave, e: unknown) => {
  const n = applyNetworking(s, e);
  if (!n) throw Error('fixture');
  return n;
};
it('does not reveal causal answers through a shortest, middle or longest reason heuristic', () => {
  for (const rank of [0, 1, 2]) {
    const successes = networkingItemIds.filter((id) => {
      const ordered = networkingItemsNb[id].reasons
        .map((text, index) => ({ text, index }))
        .sort((a, b) => a.text.length - b.text.length);
      return networkingItems[id].accepted.some(([, reason]) => reason === ordered[rank]!.index);
    });
    expect(
      successes.length,
      `reason-length rank ${rank}: ${successes.join(',')}`,
    ).toBeLessThanOrEqual(6);
  }
});
function io() {
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
describe('P06 unsigned IPv4 and bounded address design', () => {
  it('handles entire address space without signed bitwise overflow', () => {
    expect(ipv4('255.255.255.255')).toBe(2 ** 32 - 1);
    expect(address(2 ** 32 - 1)).toBe('255.255.255.255');
    expect(cidr('0.0.0.0/0')).toMatchObject({ first: 0, last: 2 ** 32 - 1, total: 2 ** 32 });
    expect(cidr('128.0.0.0/1')).toMatchObject({ first: 2 ** 31, last: 2 ** 32 - 1 });
    for (const s of ['01.2.3.4', '256.0.0.1', '1.2.3', '-1.0.0.0', ' 1.2.3.4', '1e2.0.0.0'])
      expect(ipv4(s)).toBeNull();
    for (const s of [
      '10.42.1.17/24',
      '10.42.0.0/33',
      '10.42.0.0/-1',
      '10.42.0.0/024',
      '10.42.0.0/24/1',
    ])
      expect(cidr(s)).toBeNull();
  });
  it('computes inclusive containment, adjacency, overlap and ordinary reservations', () => {
    expect(contains('10.42.0.0/16', '10.42.1.0/24')).toBe(true);
    expect(contains('10.64.0.0/20', '10.64.16.0/24')).toBe(false);
    expect(overlaps('10.42.1.0/24', '10.42.1.128/25')).toBe(true);
    expect(overlaps('10.42.1.0/25', '10.42.1.128/25')).toBe(false);
    expect(usable('10.0.0.0/24')).toBe(251);
    expect(usable('10.0.0.0/27')).toBe(27);
    expect(usable('10.0.0.0/29')).toBe(3);
    expect(usable('10.0.0.0/30')).toBeNull();
  });
  it('separates syntax, model-private scope, containment, overlap and capacity', () => {
    expect(runAddress(initialAddress)).toMatchObject({ overlap: true, outcome: 0 });
    expect(runAddress({ ...initialAddress, data: '10.84.2.0/24' })).toMatchObject({
      overlap: false,
      contained: true,
      outcome: 2,
    });
    expect(runAddress({ ...initialAddress, data: '10.85.2.0/24' })).toMatchObject({
      contained: false,
      outcome: 0,
    });
    expect(runAddress({ ...initialAddress, data: '10.84.2.0/27' })).toMatchObject({
      capacity: false,
      outcome: 0,
    });
    expect(runAddress({ ...initialAddress, data: 'not-cidr' })).toMatchObject({
      syntax: false,
      outcome: 0,
    });
    expect(runAddress({ ...initialAddress, required: NaN })).toBeNull();
    expect(runAddress({ ...initialAddress, vnet: '203.0.113.0/24' })).toMatchObject({
      privateRanges: false,
      outcome: 0,
    });
  });
});
describe('P06 standard peering and explicit feature qualifications', () => {
  it('does not turn AB/BC into AC or treat one configured side as Connected', () => {
    expect(runPeering(initialPeering)).toMatchObject({ direct: false, outcome: 0 });
    expect(runPeering({ ...initialPeering, destination: 'b' })).toMatchObject({
      direct: true,
      permitted: true,
    });
    expect(runPeering({ ...initialPeering, destination: 'b', configured: ['ab'] })).toMatchObject({
      direct: false,
      links: expect.arrayContaining([expect.objectContaining({ pair: 'ab', status: 'initiated' })]),
    });
    expect(runPeering({ ...initialPeering, configured: ['ac', 'ca'] })).toMatchObject({
      direct: true,
      outcome: 2,
    });
  });
  it('rejects overlapping standard pairs even with both sides configured', () => {
    expect(runPeering({ ...initialPeering, overlap: true, destination: 'b' })).toMatchObject({
      direct: false,
      outcome: 0,
      links: expect.arrayContaining([
        expect.objectContaining({ pair: 'ab', conflict: true, status: 'overlap' }),
      ]),
    });
    expect(
      runPeering({ ...initialPeering, overlap: true, configured: ['ac', 'ca'] }),
    ).toMatchObject({ direct: true });
  });
  it('separates selected subnet scope, declared route and access, without claiming complete product eligibility', () => {
    const a = { ...initialPeering, destination: 'b', scope: 'selected', participating: false };
    expect(runPeering(a)).toMatchObject({ direct: true, subnet: false, permitted: false });
    expect(runPeering({ ...a, participating: true, route: 'unknown' })).toMatchObject({
      knownPath: false,
      outcome: 1,
    });
    expect(runPeering({ ...a, participating: true, access: 'deny' })).toMatchObject({
      knownPath: true,
      permitted: false,
      outcome: 1,
    });
    expect(networkingNb.model.qualification).toContain('ruteannonsering');
  });
});
describe('P06 DNS fixtures, never DNS queries or traffic', () => {
  it('requires private zone visibility even when application peering exists', () => {
    expect(runDns(initialDns)).toMatchObject({ visible: false, resolved: false, outcome: 0 });
    expect(runDns({ ...initialDns, linked: true })).toMatchObject({
      resolved: true,
      resolvedAddress: '10.85.1.20',
      outcome: 2,
    });
    expect(runDns({ ...initialDns, linked: true, peered: false })).toMatchObject({
      resolved: true,
      knownPath: false,
      outcome: 1,
    });
  });
  it('separates correct address, topology, route, access and unknown app response', () => {
    expect(runDns({ ...initialDns, linked: true, record: 'wrong' })).toMatchObject({
      resolved: true,
      correctDestination: false,
      outcome: 1,
    });
    expect(runDns({ ...initialDns, linked: true, route: 'unknown' })).toMatchObject({
      resolved: true,
      knownPath: false,
      outcome: 1,
    });
    expect(runDns({ ...initialDns, linked: true, access: 'deny' })).toMatchObject({
      knownPath: true,
      permitted: false,
      outcome: 1,
    });
    expect(runDns({ ...initialDns, linked: true, access: 'unknown' })).toMatchObject({
      permitted: false,
    });
  });
  it('models CNAME continuation, missing records and a loop, not arbitrary domain queries', () => {
    expect(runDns({ ...initialDns, linked: true, record: 'cname' })).toMatchObject({
      resolved: true,
      cnameChain: ['alias.training.example', 'archive.training.example'],
    });
    for (const record of ['missing', 'loop'])
      expect(runDns({ ...initialDns, linked: true, record })).toMatchObject({
        resolved: false,
        resolvedAddress: null,
      });
    expect(runDns({ ...initialDns, linked: true, hostname: 'external.example' })).toBeNull();
  });
  it('requires explicit custom forwarding and does not extend provided host resolution across VNet', () => {
    expect(runDns({ ...initialDns, linked: true, resolver: 'custom' })).toMatchObject({
      resolved: false,
    });
    expect(runDns({ ...initialDns, resolver: 'custom', forwarding: true })).toMatchObject({
      resolved: true,
    });
    expect(runDns({ ...initialDns, zone: 'provided' })).toMatchObject({ resolved: false });
    expect(runDns({ ...initialDns, zone: 'provided', sameVnet: true, record: 'cname' })).toBeNull();
    expect(runDns({ ...initialDns, zone: 'provided', sameVnet: true })).toMatchObject({
      resolved: true,
    });
    expect(runDns({ ...initialDns, zone: 'public', peered: false })).toMatchObject({
      resolvedAddress: '203.0.113.20',
      topology: true,
    });
  });
  it('rejects unbounded, malformed, extra-key and impossible enum inputs', () => {
    for (const input of [
      null,
      {},
      { ...initialAddress, app: 'x'.repeat(19) },
      { ...initialPeering, configured: ['ab', 'ab'] },
      { ...initialPeering, configured: ['ad'] },
      { ...initialDns, linked: 'yes' },
      { ...initialDns, access: 'automatic' },
      { ...initialDns, command: 'CreateDns' },
    ]) {
      expect(validNetworkInput(input)).toBe(false);
      expect(runNetwork(input)).toBeNull();
    }
  });
});
describe('P06 independent records and terminal integrity', () => {
  it('keeps scoped facets partial and requires separate causal item judgments', () => {
    expect(networkingManifest.certificationOverlay.slot).toBe('2.2.05');
    expect(networkingManifest.certificationOverlay.deferred).toContain('ExpressRoute');
    for (const objective of ['NW01', 'NW02', 'NW03', 'NW04'])
      expect(
        networkingItemIds.filter((id) =>
          (networkingItems[id].objectives as readonly string[]).includes(objective),
        ).length,
      ).toBeGreaterThanOrEqual(2);
    for (const id of networkingItemIds) {
      const d = networkingItems[id],
        copy = networkingItemsNb[id];
      expect(copy.feedback).toHaveLength(2);
      for (const a of copy.feedback) {
        expect(a).toHaveLength(3);
        expect(a.every((x) => x.length > 40)).toBe(true);
      }
      for (const source of d.sources) expect(source in networkingSources).toBe(true);
      for (let decision = 0; decision < 3; decision++)
        for (let reason = 0; reason < 3; reason++)
          expect(evaluateNetworking(id, { decision, reason }).relation).toBe(
            (d.accepted as readonly (readonly number[])[]).some(
              (p) => p[0] === decision && p[1] === reason,
            ),
          );
    }
    expect(evaluateNetworking('nw04', { decision: 2, reason: 0 }).relation).toBe(false);
    expect(evaluateNetworking('nw07', { decision: 0, reason: 0 }).relation).toBe(true);
    expect(evaluateNetworking('nw07', { decision: 2, reason: 1 }).relation).toBe(true);
    expect(evaluateNetworking('nw07', { decision: 0, reason: 1 }).relation).toBe(false);
    expect(evaluateNetworking('nw07', { decision: 2, reason: 0 }).relation).toBe(false);
    for (const [topic, ids] of Object.entries(networkingStudySources)) {
      expect(topic in networkingNb.sections).toBe(true);
      ids.forEach((id) => expect(id in networkingSources).toBe(true));
    }
  });
  it('locks first submissions and treats exposed variants/abandon as family retry', () => {
    let s = apply(freshNetworking(), { kind: 'begin', item: 'nw01' });
    s = apply(s, { kind: 'draft', answer: { decision: 1, reason: 0 } });
    s = apply(s, { kind: 'submit' });
    const first = structuredClone(networkingFacts(s).firsts[0]);
    s = apply(s, { kind: 'begin', item: 'nw02' });
    expect(networkingFacts(s).current?.retry).toBe(true);
    s = apply(s, { kind: 'aid' });
    s = apply(s, { kind: 'abandon' });
    s = apply(s, { kind: 'begin', item: 'nw01' });
    s = apply(s, { kind: 'draft', answer: { decision: 1, reason: 2 } });
    s = apply(s, { kind: 'submit' });
    expect(networkingFacts(s).firsts[0]).toEqual(first);
    expect(restoreNetworking(JSON.stringify(s))).toEqual({ save: s, issue: null });
  });
  it('reserves final answer, aid and terminal transitions at event capacity', () => {
    let s = freshNetworking();
    while (s.events.length < 794)
      s = apply(s, { kind: 'visit', topic: s.events.length % 2 ? 'vnet' : 'dns' });
    s = apply(s, { kind: 'begin', item: 'nw01' });
    while (s.events.length < 798)
      s = apply(s, { kind: 'draft', answer: { decision: s.events.length % 2, reason: 2 } });
    expect(applyNetworking(s, { kind: 'draft', answer: { decision: 2, reason: 2 } })).toBeNull();
    s = apply(s, { kind: 'aid' });
    s = apply(s, { kind: 'submit' });
    expect(s.events).toHaveLength(800);
    expect(restoreNetworking(JSON.stringify(s)).issue).toBeNull();
    expect(applyNetworking(s, { kind: 'begin', item: 'nw02' })).toBeNull();
  });
  it('rejects invalid replay, unknown versions, oversized content and no-op duplicated history', () => {
    for (const raw of [
      '{',
      JSON.stringify({ ...freshNetworking(), schema: 2 }),
      JSON.stringify({ ...freshNetworking(), content: 'future' }),
      JSON.stringify({ ...freshNetworking(), events: [{ kind: 'submit' }] }),
      JSON.stringify({ ...freshNetworking(), extra: 1 }),
      'x'.repeat(600001),
    ])
      expect(restoreNetworking(raw).issue).not.toBeNull();
    expect(applyNetworking(freshNetworking(), { kind: 'begin', item: 'cp01' })).toBeNull();
    expect(
      applyNetworking(freshNetworking(), {
        kind: 'mission',
        mission: 'inspect',
        attempt: null,
        boundary: null,
      }),
    ).toBeNull();
  });
  it('requires witnessed contrasting runs plus a causal reason; pause/resume never produces independent credit', () => {
    let s = apply(freshNetworking(), {
      kind: 'mission',
      mission: 'address',
      attempt: null,
      boundary: null,
    });
    expect(applyNetworking(s, { kind: 'explain', answer: 0 })).toBeNull();
    s = apply(s, { kind: 'configure', input: initialAddress });
    s = apply(s, { kind: 'run', input: initialAddress, prediction: 2 });
    s = apply(s, {
      kind: 'run',
      input: { ...initialAddress, data: '10.84.2.0/24' },
      prediction: 2,
    });
    expect(networkingGuidedFacts(networkingFacts(s).guide!).witnessed).toBe(true);
    s = apply(s, { kind: 'explain', answer: 1 });
    expect(networkingFacts(s).completed).toEqual([]);
    s = apply(s, { kind: 'explain', answer: 0 });
    const g = structuredClone(networkingFacts(s).guide);
    s = apply(s, { kind: 'pause' });
    s = apply(s, { kind: 'resume', id: g!.id });
    expect(networkingFacts(s).guide).toEqual(g);
    expect(networkingFacts(s).firsts).toEqual([]);
  });
  it('ties conceptual milestones to saved technical outcomes, not visits', () => {
    let s = apply(freshNetworking(), {
      kind: 'mission',
      mission: 'peering',
      attempt: null,
      boundary: null,
    });
    expect(networkingMilestoneFacts(s)).toEqual({ peering: false, dns: false });
    s = apply(s, {
      kind: 'run',
      input: { ...initialPeering, overlap: true, destination: 'b' },
      prediction: 0,
    });
    expect(networkingMilestoneFacts(s).peering).toBe(true);
  });
});
describe('P06 durable storage, teaching preflight and scoped recovery', () => {
  it('does not expose teaching on denied writes or stale drafts; successful aid is durable', () => {
    const storage = io(),
      a = new NetworkingStore(storage),
      b = new NetworkingStore(storage);
    a.load();
    b.load();
    a.event({ kind: 'begin', item: 'nw10' });
    expect(b.event({ kind: 'begin', item: 'nw09' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    const raw = storage.getItem(networkingKey),
      denied = new NetworkingStore({
        ...storage,
        setItem: () => {
          throw Error('denied');
        },
      });
    denied.load();
    expect(
      prepareExistingTeaching(
        denied,
        networkingKey,
        storage.getItem,
        restoreNetworking,
        networkingFacts,
        () => denied.event({ kind: 'aid' }),
      ),
    ).toBe(false);
    expect(storage.getItem(networkingKey)).toBe(raw);
    expect(a.prepareTeaching()).toBe(true);
    const c = new NetworkingStore(storage);
    c.load();
    expect(networkingFacts(c.getSnapshot().save).assisted).toBe(true);
  });
  it('compares before invalid recovery and leaves every older store untouched', () => {
    const storage = io();
    storage.data.set('azurelab.learning.compute-hosting.v1', 'old-bytes');
    storage.data.set(networkingKey, 'broken');
    const s = new NetworkingStore(storage);
    s.load();
    const newer = JSON.stringify(apply(freshNetworking(), { kind: 'begin', item: 'nw11' }));
    storage.data.set(networkingKey, newer);
    expect(s.recoverInvalid()).toBe(false);
    expect(storage.getItem(networkingKey)).toBe(newer);
    expect(storage.getItem('azurelab.learning.compute-hosting.v1')).toBe('old-bytes');
  });
  it('withholds after a readback race and never commits false unaided evidence', () => {
    const storage = io();
    let race = false;
    const s = new NetworkingStore({
      ...storage,
      setItem: (k, v) => {
        storage.setItem(k, v);
        if (race) storage.setItem(k, JSON.stringify(freshNetworking()));
      },
    });
    s.load();
    race = true;
    expect(s.event({ kind: 'begin', item: 'nw01' })).toBe(false);
    expect(s.getSnapshot().issue).toBe('conflict');
    expect(networkingFacts(s.getSnapshot().save).attempts).toHaveLength(0);
  });
});
describe('P06 actual inspection and navigation-only Portal origin', () => {
  it('isolates its origin from competing lab contexts and preserves it through navigation', () => {
    const p = parseLocation(new URLSearchParams('area=vms&networking=inspect'));
    expect(p.networking).toBe(true);
    expect(
      parseLocation(new URLSearchParams(portalHref(p, 'resource', { id: 'nic-1' }).split('?')[1]))
        .networking,
    ).toBe(true);
    for (const other of [
      'compute=vm',
      'mission=diagnose',
      'practice=vm',
      'course=1',
      'lab=web-platform',
      'bridge=reliability',
    ])
      expect(
        parseLocation(new URLSearchParams(`networking=inspect&${other}`)).networking,
      ).toBeUndefined();
  });
  it('uses actual references/receipt and labels historical reuse without inventing private IPs or changing the World', () => {
    let engine: Engine = freshEngine(),
      seq = 0;
    const command = (command: Command) => {
      const r = execute(engine, {
        commandId: `network-${++seq}`,
        expectedWorldRevision: engine.world.revision,
        command,
      });
      engine = r.engine;
      return r.receipt;
    };
    command({
      type: 'CreateGroup',
      subscriptionId: 'sub-shared',
      name: 'rg-network',
      metadataRegion: 'norwayeast',
    });
    const group = engine.world.groups[0]!.id;
    command({
      type: 'CreateVmBundle',
      groupId: group,
      name: 'network-vm',
      region: 'northeurope',
      image: 'ubuntu-22-04',
      profile: 'small',
      dataDiskGiB: '0',
      subnetId: '',
    });
    const vm = engine.world.infrastructure.find((r) => r.kind === 'vm')!;
    const prefix = JSON.stringify(engine),
      boundary = engine.ledger.at(-1)!.receipt.commandId;
    let s = apply(freshNetworking(), { kind: 'mission', mission: 'inspect', attempt: 1, boundary });
    s = apply(s, { kind: 'select', target: vm.id });
    let f = networkingInspection(networkingFacts(s).guide, engine, 1);
    expect(f).toMatchObject({ verifiable: true, newBuild: false, complete: false });
    expect(f.refs).toHaveLength(7);
    for (const ref of f.refs) s = apply(s, { kind: 'inspect', ref, through: boundary });
    s = apply(s, { kind: 'explain', answer: 1 });
    f = networkingInspection(networkingFacts(s).guide, engine, 1);
    expect(f.complete).toBe(true);
    expect(networkingInspection(networkingFacts(s).guide, engine, 2).verifiable).toBe(false);
    expect(
      networkingInspection({ ...networkingFacts(s).guide!, boundary: 'missing' }, engine, 1)
        .verifiable,
    ).toBe(false);
    expect(JSON.stringify(engine)).toBe(prefix);
    expect(f.chain?.nic).not.toHaveProperty('privateIp');
    expect(f.chain?.subnet).toMatchObject({ addressPrefix: '10.42.1.0/24' });
    expect(f.chain?.vnet).toMatchObject({ addressSpace: '10.42.0.0/16' });
    expect(networkingFacts(s).firsts).toEqual([]);
    const before = JSON.stringify(engine.world);
    expect(
      command({
        type: 'CreateVmBundle',
        groupId: group,
        name: 'invalid',
        region: 'moon',
        image: 'ubuntu-22-04',
        profile: 'small',
        dataDiskGiB: '0',
        subnetId: '',
      }).outcome,
    ).toBe('rejected');
    expect(JSON.stringify(engine.world)).toBe(before);
  });
});
