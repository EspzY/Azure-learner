import { describe, it, expect } from 'vitest';
import {
  initialChoose,
  initialDiagnose,
  initialEndpoint,
  initialDns,
  initialConnectivity,
  runHybrid,
  runEndpoint,
  runConnectivity,
  validConnectivityInput,
  type ConnectivityInput,
} from './connectivity-model';
import {
  applyConnectivity,
  freshConnectivity,
  restoreConnectivity,
  connectivityFacts,
  connectivityGuidedFacts,
  connectivityMilestoneFacts,
  connectivityKey,
  connectivityItems,
  connectivityItemIds,
  evaluateConnectivity,
  connectivityManifest,
  type ConnectivitySave,
} from './connectivity';
import { ConnectivityStore } from './connectivity-store';
import { prepareExistingTeaching } from './teaching-access';
import { networkingKey, freshNetworking } from './networking';
import { connectivityNb, connectivityItemsNb } from '@/content/nb';
import { connectivitySources, connectivityStudySources } from './connectivity-sources';
const apply = (save: ConnectivitySave, event: unknown) => {
  const next = applyConnectivity(save, event);
  if (!next) throw Error('invalid fixture');
  return next;
};
const storage = () => {
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
describe('P07 hybrid transport, encryption and declared path', () => {
  it('keeps internet site VPN encrypted but unsuitable for a private-transport mandate', () => {
    expect(runHybrid(initialChoose)).toMatchObject({
      medium: 'internet',
      encrypted: true,
      privateTransport: false,
      knownPath: true,
      requirementsMet: false,
      outcome: 1,
    });
    expect(runHybrid({ ...initialChoose, requirePrivate: false })).toMatchObject({ outcome: 2 });
  });
  it('does not claim universal internet underlay for VNet-to-VNet VPN', () => {
    expect(runHybrid({ ...initialChoose, vpnMode: 'vnet', demand: 'vnet' })).toMatchObject({
      medium: 'microsoft',
      encrypted: true,
      modeFits: true,
      privateTransport: true,
      outcome: 2,
    });
  });
  it('distinguishes whole-site, individual client and VNet connection requirements', () => {
    const mode = { site: 's2s', user: 'p2s', vnet: 'vnet' } as const;
    for (const demand of ['site', 'user', 'vnet'] as const)
      for (const vpnMode of ['s2s', 'p2s', 'vnet'] as const)
        expect(
          runHybrid({ ...initialChoose, requirePrivate: false, demand, vpnMode })?.modeFits,
        ).toBe(mode[demand] === vpnMode);
    expect(
      runHybrid({ ...initialChoose, transport: 'expressroute', demand: 'user' })?.modeFits,
    ).toBe(false);
  });
  it('does not turn private ExpressRoute into automatic end-to-end encryption', () => {
    const i = { ...initialChoose, transport: 'expressroute' as const };
    expect(runHybrid(i)).toMatchObject({
      privateTransport: true,
      encrypted: false,
      knownPath: true,
      requirementsMet: false,
      outcome: 1,
    });
    expect(runHybrid({ ...i, requireEncryption: false })).toMatchObject({
      requirementsMet: true,
      outcome: 2,
    });
    expect(runHybrid({ ...i, encryption: 'ipsec' })).toMatchObject({
      encrypted: true,
      requirementsMet: true,
    });
    expect(runHybrid({ ...i, encryption: 'ipsec', tunnelReady: false })).toMatchObject({
      encrypted: false,
      requirementsMet: false,
    });
  });
  it('limits MACsec to configured Direct link scope, never an end-to-end guarantee', () => {
    const i = {
      ...initialChoose,
      transport: 'expressroute' as const,
      encryption: 'macsec' as const,
    };
    expect(runHybrid(i)).toMatchObject({
      linkEncrypted: false,
      encrypted: false,
      encryptionConfigured: false,
    });
    expect(runHybrid({ ...i, direct: true })).toMatchObject({
      linkEncrypted: true,
      encrypted: false,
      encryptionConfigured: true,
      requirementsMet: false,
    });
  });
  it('requires every declared underlay/gateway/routing/access prerequisite', () => {
    const valid = { ...initialChoose, requirePrivate: false };
    for (const field of ['gatewayReady', 'tunnelReady', 'routeReady'] as const)
      expect(runHybrid({ ...valid, [field]: false })?.requirementsMet).toBe(false);
    for (const access of ['deny', 'unknown'] as const)
      expect(runHybrid({ ...valid, access })?.permitted).toBe(false);
    for (const field of ['providerReady', 'circuitUp', 'gatewayReady', 'routeReady'] as const)
      expect(
        runHybrid({
          ...initialChoose,
          transport: 'expressroute',
          encryption: 'ipsec',
          [field]: false,
        })?.requirementsMet,
      ).toBe(false);
  });
  it('uses a deliberately configured backup while retaining routing and policy constraints', () => {
    expect(runHybrid(initialDiagnose)).toMatchObject({
      usedBackup: false,
      knownPath: false,
      outcome: 0,
    });
    expect(runHybrid({ ...initialDiagnose, backupReady: true })).toMatchObject({
      usedBackup: true,
      medium: 'internet',
      encrypted: true,
      privateTransport: false,
      outcome: 2,
    });
    expect(
      runHybrid({ ...initialDiagnose, backupReady: true, requirePrivate: true })?.requirementsMet,
    ).toBe(false);
    expect(
      runHybrid({ ...initialDiagnose, backupReady: true, tunnelReady: false })?.knownPath,
    ).toBe(false);
    expect(runHybrid({ ...initialDiagnose, backupReady: true, routeReady: false })?.knownPath).toBe(
      false,
    );
  });
});
describe('P07 independent DNS, endpoint, network and application stages', () => {
  it('permits authenticated public connectivity without claiming anonymous access', () => {
    const i = {
      ...initialEndpoint,
      endpoint: 'public' as const,
      dns: 'public' as const,
      privateState: 'absent' as const,
    };
    expect(runEndpoint(i)).toMatchObject({
      resolved: true,
      actualEndpoint: 'public',
      authorized: true,
      responseAssumed: false,
      outcome: 2,
    });
    expect(runEndpoint({ ...i, appAuth: 'deny' })).toMatchObject({
      resolved: true,
      networkAllowed: true,
      authorized: false,
    });
    expect(runEndpoint({ ...i, publicAccess: 'disabled' })).toMatchObject({
      resolved: true,
      networkAllowed: false,
    });
    expect(
      runEndpoint({ ...i, publicAccess: 'selected', networkRule: 'unknown' })?.networkAllowed,
    ).toBe(false);
  });
  it('keeps public access setting independent from Approved private endpoint connectivity', () => {
    for (const publicAccess of ['enabled', 'disabled', 'selected'] as const)
      expect(runEndpoint({ ...initialEndpoint, publicAccess })).toMatchObject({
        endpointMatch: true,
        endpointReady: true,
        networkAllowed: true,
        authorized: true,
      });
    for (const privateState of ['absent', 'pending'] as const)
      expect(runEndpoint({ ...initialEndpoint, privateState })).toMatchObject({
        resolved: true,
        endpointReady: false,
        networkAllowed: false,
      });
  });
  it('does not infer DNS visibility from a configured private entry or a route', () => {
    expect(runEndpoint({ ...initialDns, dns: 'private' })).toMatchObject({
      resolved: false,
      actualEndpoint: null,
      outcome: 0,
    });
    expect(runEndpoint({ ...initialDns, dns: 'private', linked: true })).toMatchObject({
      resolved: true,
      resolvedAddress: '10.87.4.12',
    });
    expect(
      runEndpoint({ ...initialDns, dns: 'private', linked: true, resolver: 'custom' }),
    ).toMatchObject({ resolved: false });
    expect(
      runEndpoint({ ...initialDns, dns: 'private', resolver: 'custom', forwarding: true }),
    ).toMatchObject({ resolved: true });
  });
  it('preserves a DNS answer while distinguishing wrong destination, route and authorization failures', () => {
    expect(runEndpoint(initialDns)).toMatchObject({
      resolved: true,
      actualEndpoint: 'public',
      endpointMatch: false,
      networkAllowed: false,
    });
    expect(runEndpoint({ ...initialDns, publicAccess: 'enabled' })).toMatchObject({
      resolved: true,
      actualEndpoint: 'public',
      endpointMatch: false,
      networkAllowed: true,
      authorized: true,
      requirementsMet: false,
      outcome: 1,
    });
    expect(
      runEndpoint({ ...initialDns, publicAccess: 'enabled', response: 'assumed' }),
    ).toMatchObject({
      networkAllowed: true,
      authorized: true,
      responseAssumed: true,
      endpointMatch: false,
      requirementsMet: false,
      outcome: 1,
    });
    expect(
      runEndpoint({ ...initialEndpoint, endpoint: 'public', response: 'assumed' }),
    ).toMatchObject({
      actualEndpoint: 'private',
      networkAllowed: true,
      authorized: true,
      responseAssumed: true,
      endpointMatch: false,
      requirementsMet: false,
      outcome: 1,
    });
    expect(runEndpoint({ ...initialEndpoint, dns: 'wrong' })).toMatchObject({
      resolved: true,
      resolvedAddress: '10.99.8.12',
      actualEndpoint: null,
      endpointMatch: false,
    });
    expect(runEndpoint({ ...initialEndpoint, path: false })).toMatchObject({
      resolved: true,
      endpointReady: true,
      endpointControls: true,
      applicationAllowed: true,
      knownPath: false,
      networkAllowed: false,
      authorized: false,
    });
    expect(runEndpoint({ ...initialEndpoint, networkRule: 'deny' })).toMatchObject({
      knownPath: true,
      networkAllowed: false,
    });
    expect(runEndpoint({ ...initialEndpoint, appAuth: 'deny' })).toMatchObject({
      networkAllowed: true,
      authorized: false,
    });
  });
  it('never converts declared authorization into an observed service response', () => {
    expect(runEndpoint(initialEndpoint)).toMatchObject({
      authorized: true,
      responseAssumed: false,
    });
    expect(runEndpoint({ ...initialEndpoint, response: 'assumed' })).toMatchObject({
      responseAssumed: true,
    });
    expect(runEndpoint({ ...initialEndpoint, response: 'assumed', appAuth: 'deny' })).toMatchObject(
      { responseAssumed: false },
    );
  });
  it('rejects unknown/extra/undefined fields and does not mutate fixtures', () => {
    for (const fixture of [initialChoose, initialDiagnose, initialEndpoint, initialDns]) {
      const raw = JSON.stringify(fixture);
      expect(validConnectivityInput(fixture)).toBe(true);
      runConnectivity(fixture);
      expect(JSON.stringify(fixture)).toBe(raw);
      expect(runConnectivity({ ...fixture, extra: 'World' })).toBeNull();
      for (const field of Object.keys(fixture)) {
        const missing = { ...fixture } as Record<string, unknown>;
        delete missing[field];
        expect(validConnectivityInput(missing)).toBe(false);
      }
    }
    for (const raw of [
      null,
      [],
      true,
      'vpn',
      { ...initialChoose, gatewayReady: 1 },
      { ...initialEndpoint, response: 'actual' },
      { ...initialDns, dns: 'live' },
    ])
      expect(runConnectivity(raw)).toBeNull();
    const clone = initialConnectivity('choose');
    clone.kind = 'diagnose';
    expect(initialChoose.kind).toBe('choose');
  });
});
const guidedInputs: Record<'choose' | 'diagnose' | 'endpoint' | 'dns', ConnectivityInput[]> = {
  choose: [
    initialChoose,
    { ...initialChoose, transport: 'expressroute' },
    { ...initialChoose, transport: 'expressroute', encryption: 'ipsec' },
  ],
  diagnose: [
    initialDiagnose,
    { ...initialDiagnose, backupReady: true },
    { ...initialDiagnose, backupReady: true, routeReady: false },
  ],
  endpoint: [
    initialEndpoint,
    { ...initialEndpoint, publicAccess: 'disabled' },
    { ...initialEndpoint, publicAccess: 'disabled', endpoint: 'public', dns: 'public' },
  ],
  dns: [
    initialDns,
    { ...initialDns, dns: 'private', linked: true, path: false },
    { ...initialDns, dns: 'private', linked: true, path: true, appAuth: 'deny' },
  ],
};
describe('P07 versioned original assessment and explicit guided evidence', () => {
  it('binds all original cases to specific alternatives, sources, repeat lessons and distinct variants', () => {
    expect(Object.keys(connectivityItemsNb).sort()).toEqual([...connectivityItemIds].sort());
    expect(Object.keys(connectivityNb.topics)).toEqual(connectivityManifest.teaching);
    expect(connectivityManifest.humanSme).toBeNull();
    const variants = new Set<string>();
    for (const id of connectivityItemIds) {
      const item = connectivityItems[id],
        copy = connectivityItemsNb[id];
      variants.add(`${item.family}:${item.variant}`);
      expect(item.repeat in connectivityNb.topics).toBe(true);
      expect(copy.decisions).toHaveLength(3);
      expect(copy.reasons).toHaveLength(3);
      expect(copy.feedback).toHaveLength(2);
      for (const feedback of copy.feedback) {
        expect(feedback).toHaveLength(3);
        for (const text of feedback) expect(text.trim().length).toBeGreaterThan(0);
      }
      for (const source of item.sources) expect(source in connectivitySources).toBe(true);
      expect(copy.problem.trim().length).toBeGreaterThan(0);
      expect(copy.premises.length).toBeGreaterThan(0);
    }
    expect(variants.size).toBe(connectivityItemIds.length);
    for (const ids of Object.values(connectivityStudySources))
      for (const id of ids)
        expect(new URL(connectivitySources[id][1]).hostname).toBe('learn.microsoft.com');
    for (const mission of connectivityManifest.activities)
      expect(connectivityNb.causal[mission]).toHaveLength(3);
  });
  it('does not reveal every cause through a fixed shortest, middle or longest reason position', () => {
    for (const rank of [0, 1, 2]) {
      const matches = connectivityItemIds.filter((id) => {
        const order = connectivityItemsNb[id].reasons
          .map((text, index) => ({ text, index }))
          .sort((a, b) => a.text.length - b.text.length);
        return connectivityItems[id].accepted.some(([, r]) => r === order[rank]!.index);
      });
      expect(matches.length, `reason length rank${rank}: ${matches.join(',')}`).toBeLessThanOrEqual(
        8,
      );
    }
  });
  it('requires both fixed decision and compatible reason in all 108 combinations', () => {
    for (const id of connectivityItemIds)
      for (let decision = 0; decision < 3; decision++)
        for (let reason = 0; reason < 3; reason++) {
          expect(evaluateConnectivity(id, { decision, reason }).relation).toBe(
            connectivityItems[id].accepted.some(([d, r]) => d === decision && r === reason),
          );
        }
    for (const objective of Object.keys(connectivityManifest.objectives))
      expect(
        connectivityItemIds.filter((id) =>
          (connectivityItems[id].objectives as readonly string[]).includes(objective),
        ).length,
      ).toBeGreaterThanOrEqual(2);
  });
  it('preserves immutable firsts and classifies help, retry and abandoned family exposure', () => {
    let s = apply(freshConnectivity(), { kind: 'begin', item: 'nc01' });
    s = apply(s, { kind: 'draft', answer: { decision: 2, reason: 0 } });
    s = apply(s, { kind: 'submit' });
    const first = structuredClone(connectivityFacts(s).firsts[0]);
    s = apply(s, { kind: 'begin', item: 'nc02' });
    expect(connectivityFacts(s).current?.retry).toBe(true);
    s = apply(s, { kind: 'aid' });
    s = apply(s, { kind: 'abandon' });
    s = apply(s, { kind: 'begin', item: 'nc01' });
    s = apply(s, { kind: 'draft', answer: { decision: 2, reason: 1 } });
    s = apply(s, { kind: 'submit' });
    expect(connectivityFacts(s).firsts[0]).toEqual(first);
    expect(restoreConnectivity(JSON.stringify(s))).toEqual({ save: s, issue: null });
  });
  it.each(['choose', 'diagnose', 'endpoint', 'dns'] as const)(
    'requires three saved causal contrasts for %s, not navigation',
    (mission) => {
      let s = apply(freshConnectivity(), { kind: 'mission', mission });
      expect(applyConnectivity(s, { kind: 'explain', answer: 0 })).toBeNull();
      for (const [index, input] of guidedInputs[mission].entries()) {
        s = apply(s, { kind: 'run', input, prediction: 1 });
        expect(connectivityGuidedFacts(connectivityFacts(s).guide!).witnessed).toBe(index === 2);
      }
      const correct = { choose: 0, diagnose: 2, endpoint: 1, dns: 0 }[mission];
      s = apply(s, { kind: 'explain', answer: (correct + 1) % 3 });
      expect(connectivityFacts(s).completed).toEqual([]);
      s = apply(s, { kind: 'explain', answer: correct });
      expect(connectivityFacts(s).completed).toEqual([mission]);
      const g = structuredClone(connectivityFacts(s).guide);
      s = apply(s, { kind: 'pause' });
      s = apply(s, { kind: 'resume', id: g!.id });
      expect(connectivityFacts(s).guide).toEqual(g);
      expect(connectivityFacts(s).firsts).toEqual([]);
      expect(restoreConnectivity(JSON.stringify(s)).issue).toBeNull();
    },
  );
  it('requires real saved contrast for milestones and rejects cross-mission runs', () => {
    let s = apply(freshConnectivity(), { kind: 'mission', mission: 'diagnose' });
    expect(connectivityMilestoneFacts(s)).toEqual({ diagnose: false, dns: false });
    expect(applyConnectivity(s, { kind: 'run', input: initialChoose, prediction: 0 })).toBeNull();
    s = apply(s, { kind: 'run', input: initialDiagnose, prediction: 0 });
    expect(connectivityMilestoneFacts(s).diagnose).toBe(false);
    s = apply(s, { kind: 'run', input: { ...initialDiagnose, backupReady: true }, prediction: 2 });
    expect(connectivityMilestoneFacts(s).diagnose).toBe(true);
  });
  it('reserves answer, durable help and terminal capacity with strict full replay', () => {
    let s = freshConnectivity();
    while (s.events.length < 794)
      s = apply(s, { kind: 'visit', topic: s.events.length % 2 ? 'vpn' : 'endpoints' });
    s = apply(s, { kind: 'begin', item: 'nc01' });
    while (s.events.length < 798)
      s = apply(s, { kind: 'draft', answer: { decision: s.events.length % 2, reason: 1 } });
    expect(applyConnectivity(s, { kind: 'draft', answer: { decision: 2, reason: 1 } })).toBeNull();
    s = apply(s, { kind: 'aid' });
    s = apply(s, { kind: 'submit' });
    expect(s.events).toHaveLength(800);
    expect(restoreConnectivity(JSON.stringify(s)).issue).toBeNull();
    expect(applyConnectivity(s, { kind: 'begin', item: 'nc02' })).toBeNull();
  });
  it('retains a causal correction at the guided event bound despite wrong answers or pause attempts', () => {
    let s = apply(freshConnectivity(), { kind: 'mission', mission: 'choose' });
    for (const input of guidedInputs.choose) s = apply(s, { kind: 'run', input, prediction: 1 });
    while (s.events.length < 795)
      s = apply(s, { kind: 'visit', topic: s.events.length % 2 ? 'vpn' : 'endpoints' });
    expect(applyConnectivity(s, { kind: 'pause' })).toBeNull();
    while (s.events.length < 799)
      s = apply(s, { kind: 'explain', answer: s.events.length % 2 ? 1 : 2 });
    expect(applyConnectivity(s, { kind: 'explain', answer: 1 })).toBeNull();
    s = apply(s, { kind: 'explain', answer: 0 });
    expect(s.events).toHaveLength(800);
    expect(connectivityFacts(s).completed).toEqual(['choose']);
    expect(restoreConnectivity(JSON.stringify(s)).issue).toBeNull();
  });
  it('rejects corrupt, future, duplicated no-op and incorrectly ordered history without changing Part A', () => {
    const old = JSON.stringify(freshNetworking());
    for (const raw of [
      '{',
      JSON.stringify({ ...freshConnectivity(), schema: 2 }),
      JSON.stringify({ ...freshConnectivity(), events: [{ kind: 'submit' }] }),
      JSON.stringify({ ...freshConnectivity(), extra: 1 }),
      'x'.repeat(600001),
    ])
      expect(restoreConnectivity(raw).issue).not.toBeNull();
    const first = apply(freshConnectivity(), { kind: 'begin', item: 'nc01' });
    expect(applyConnectivity(first, { kind: 'mission', mission: 'choose' })).toBeNull();
    expect(applyConnectivity(first, { kind: 'visit', topic: 'vpn' })).toBeNull();
    expect(applyConnectivity(first, { kind: 'submit' })).toBeNull();
    expect(
      restoreConnectivity(
        JSON.stringify({
          ...freshConnectivity(),
          events: [
            { kind: 'visit', topic: 'vpn' },
            { kind: 'visit', topic: 'vpn' },
          ],
        }),
      ).issue,
    ).toBe('corrupt');
    expect(JSON.stringify(freshNetworking())).toBe(old);
  });
});
describe('P07 durable storage and independent teaching integrity', () => {
  it('blocks stale writes and requires durably recorded help before teaching', () => {
    const io = storage(),
      a = new ConnectivityStore(io),
      b = new ConnectivityStore(io);
    a.load();
    b.load();
    expect(a.event({ kind: 'begin', item: 'nc01' })).toBe(true);
    expect(b.event({ kind: 'begin', item: 'nc02' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    const raw = io.getItem(connectivityKey),
      denied = new ConnectivityStore({
        ...io,
        setItem: () => {
          throw Error('denied');
        },
      });
    denied.load();
    expect(
      prepareExistingTeaching(
        denied,
        connectivityKey,
        io.getItem,
        restoreConnectivity,
        connectivityFacts,
        () => denied.event({ kind: 'aid' }),
      ),
    ).toBe(false);
    expect(io.getItem(connectivityKey)).toBe(raw);
    expect(a.prepareTeaching()).toBe(true);
    const loaded = new ConnectivityStore(io);
    loaded.load();
    expect(connectivityFacts(loaded.getSnapshot().save).assisted).toBe(true);
  });
  it('does not publish an unaided result on denied storage or a readback race', () => {
    const io = storage();
    let race = false;
    const a = new ConnectivityStore({
      ...io,
      setItem: (k, v) => {
        io.setItem(k, v);
        if (race) io.setItem(k, JSON.stringify(freshConnectivity()));
      },
    });
    a.load();
    race = true;
    expect(a.event({ kind: 'begin', item: 'nc01' })).toBe(false);
    expect(a.getSnapshot().issue).toBe('conflict');
    expect(connectivityFacts(a.getSnapshot().save).attempts).toEqual([]);
    const denied = new ConnectivityStore({
      ...io,
      getItem: () => {
        throw Error('denied');
      },
    });
    denied.load();
    expect(denied.getSnapshot().issue).toBe('unsaved');
    expect(denied.prepareTeaching()).toBe(false);
  });
  it('compares before scoped recovery and never clears a newer valid save or Part A bytes', () => {
    const io = storage();
    io.setItem(networkingKey, 'frozen-part-a');
    io.setItem(connectivityKey, 'broken');
    const a = new ConnectivityStore(io);
    a.load();
    const newer = JSON.stringify(apply(freshConnectivity(), { kind: 'begin', item: 'nc10' }));
    io.setItem(connectivityKey, newer);
    expect(a.recoverInvalid()).toBe(false);
    expect(io.getItem(connectivityKey)).toBe(newer);
    expect(io.getItem(networkingKey)).toBe('frozen-part-a');
    io.setItem(connectivityKey, 'broken');
    a.load();
    expect(a.recoverInvalid()).toBe(true);
    expect(io.getItem(networkingKey)).toBe('frozen-part-a');
  });
});
