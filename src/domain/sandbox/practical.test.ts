import { describe, expect, it } from 'vitest';
import { labDefinitions, saasGuideStep } from './practical';
import { PracticalStore } from './practical-store';
import { practicalReview, practicalSources } from './content';
import { execute, freshEngine, type Engine } from './model';
import { freshSaas, executeSaas, replaySaas } from './saas';
import { restoreSaas, SaasStore } from './saas-store';
import {
  freshPractical,
  applyPractical,
  practicalFacts,
  evaluatePractical,
  restorePractical,
} from './practical';
const vm = {
  type: 'CreateVmBundle',
  groupId: 'group-1',
  name: 'vm-transfer',
  region: 'northeurope',
  image: 'windows-2022',
  profile: 'standard',
  dataDiskGiB: '64',
  subnetId: '',
};
function send(e: Engine, command: Record<string, string>) {
  return execute(e, {
    commandId: `c-${e.ledger.length}`,
    expectedWorldRevision: e.world.revision,
    command,
  }).engine;
}
describe('actual post-boundary evidence', () => {
  it('explicit reset preserves abandoned/first history and starts context against the actual new attempt', () => {
    const data = new Map<string, string>();
    const store = new PracticalStore({
      getItem: (k) => data.get(k) ?? null,
      setItem: (k, v) => {
        data.set(k, v);
      },
      removeItem: (k) => {
        data.delete(k);
      },
    });
    store.load();
    store.event({
      type: 'start',
      kind: 'saas',
      mode: 'independent',
      origin: { module: 'services', topic: 'saas' },
      attempt: 1,
      boundary: null,
    });
    store.event({ type: 'aid' });
    expect(store.restartContext(2)).toBe(true);
    const facts = practicalFacts(store.getSnapshot().save);
    expect(facts.sessions[0]).toMatchObject({ status: 'abandoned', attempt: 1, aided: true });
    expect(facts.current).toMatchObject({
      status: 'active',
      attempt: 2,
      aided: false,
      mode: 'independent',
      boundary: null,
    });
    expect(restorePractical(JSON.stringify(store.getSnapshot().save))).toEqual(
      store.getSnapshot().save,
    );
    expect(saasGuideStep({}, false)).toBe('capacity');
    expect(saasGuideStep({ seatRejection: true }, false)).toBe('release');
    expect(
      saasGuideStep(
        {
          seatRejection: true,
          license: true,
          newLicense: true,
          blocked: true,
          role: true,
          sharing: true,
          dataReview: true,
        },
        false,
      ),
    ).toBe('inspect');
  });

  it('requires a new PaaS plan and app after the boundary, not a guided plan reused with a new app', () => {
    let e = send(freshEngine(), {
      type: 'CreateGroup',
      subscriptionId: 'sub-shared',
      name: 'rg-paas',
      metadataRegion: 'norwayeast',
    });
    e = send(e, {
      type: 'CreatePlan',
      groupId: 'group-1',
      name: 'plan-old',
      region: 'northeurope',
      profile: 'linux-learning-v1',
    });
    let s = applyPractical(freshPractical(), {
      type: 'start',
      kind: 'paas',
      mode: 'independent',
      origin: { module: 'services', topic: 'paas' },
      attempt: 1,
      boundary: e.ledger.at(-1)!.request.commandId,
    })!;
    e = send(e, { type: 'CreateWebApp', groupId: 'group-1', name: 'app-new', planId: 'plan-2' });
    e = send(e, {
      type: 'SetAppSettings',
      appId: 'app-3',
      environment: 'production',
      catalogMode: 'read-only',
    });
    expect(
      evaluatePractical(practicalFacts(s).current, e, 1, freshSaas(), 1).criteria.newPlan,
    ).toBe(false);
    e = send(e, {
      type: 'CreatePlan',
      groupId: 'group-1',
      name: 'plan-new',
      region: 'northeurope',
      profile: 'linux-learning-v1',
    });
    e = send(e, { type: 'CreateWebApp', groupId: 'group-1', name: 'app-second', planId: 'plan-4' });
    e = send(e, {
      type: 'SetAppSettings',
      appId: 'app-5',
      environment: 'production',
      catalogMode: 'read-only',
    });
    s = applyPractical(s, { type: 'inspect', id: 'app-5' })!;
    s = applyPractical(s, { type: 'reason', value: 'customer-code' })!;
    // The evaluator selects the eligible new plan/app configuration, not an earlier partial attempt.
    expect(
      evaluatePractical(practicalFacts(s).current, e, 1, freshSaas(), 1).criteria.newPlan,
    ).toBe(true);
  });
  it('pins implemented operations, objective/rubric versions and reviewed original source mappings without fabricating SME review', () => {
    expect(practicalReview.humanSme).toBeNull();
    for (const definition of Object.values(labDefinitions)) {
      expect(definition.id).toMatch(/@1$/);
      expect(definition.rubric).toMatch(/@1$/);
      expect(definition.objectives).toContain('ST04');
      for (const source of definition.sources)
        expect(practicalSources[source]).toMatch(/^https:\/\/learn.microsoft.com\//);
      expect(definition.supported.length).toBeGreaterThan(0);
      expect(definition.unavailable.length).toBeGreaterThan(0);
    }
  });
  it('resumes an earlier interrupted guided lab without rewriting its boundary or observations', () => {
    let s = applyPractical(freshPractical(), {
      type: 'start',
      kind: 'vm',
      mode: 'guided',
      origin: { module: 'services', topic: 'iaas' },
      attempt: 1,
      boundary: null,
    })!;
    s = applyPractical(s, { type: 'inspect', id: 'vm-1' })!;
    s = applyPractical(s, {
      type: 'start',
      kind: 'saas',
      mode: 'guided',
      origin: { module: 'services', topic: 'saas' },
      attempt: 1,
      boundary: null,
    })!;
    s = applyPractical(s, { type: 'resume', id: 1 })!;
    expect(practicalFacts(s).current).toMatchObject({
      id: 1,
      kind: 'vm',
      boundary: null,
      inspected: ['vm-1'],
    });
    expect(restorePractical(JSON.stringify(s))).toEqual(s);
    expect(applyPractical(s, { type: 'resume', id: 999 })).toBeNull();
  });
  it('does not upgrade guided resources; snapshots first submission, help/retry and version boundaries', () => {
    let engine = send(freshEngine(), {
      type: 'CreateGroup',
      name: 'rg-transfer',
      subscriptionId: 'sub-shared',
      metadataRegion: 'norwayeast',
    });
    engine = send(engine, vm);
    let save = applyPractical(freshPractical(), {
      type: 'start',
      kind: 'vm',
      mode: 'independent',
      origin: { module: 'services', topic: 'iaas' },
      attempt: 1,
      boundary: engine.ledger.at(-1)!.request.commandId,
    })!;
    const current = () => practicalFacts(save).current!;
    expect(evaluatePractical(current(), engine, 1, freshSaas(), 1).configured).toBe(false);
    engine = send(engine, { ...vm, name: 'vm-new-task' });
    const newVm = engine.world.infrastructure.filter((r) => r.kind === 'vm').at(-1)!;
    if (newVm.kind !== 'vm') throw Error('fixture');
    for (const id of [newVm.id, newVm.osDiskId, newVm.nicId])
      save = applyPractical(save, { type: 'inspect', id })!;
    save = applyPractical(save, { type: 'reason', value: 'customer-os' })!;
    save = applyPractical(save, {
      type: 'submit',
      through: engine.ledger.at(-1)!.request.commandId,
    })!;
    expect(evaluatePractical(current(), engine, 1, freshSaas(), 1).complete).toBe(true);
    expect(applyPractical(save, { type: 'reason', value: 'cloud-handles-all' })).toBeNull();
    expect(evaluatePractical(current(), engine, 2, freshSaas(), 1).verifiable).toBe(false);
    const first = current();
    save = applyPractical(save, {
      type: 'start',
      kind: 'vm',
      mode: 'independent',
      origin: { module: 'services', topic: 'iaas' },
      attempt: 1,
      boundary: engine.ledger.at(-1)!.request.commandId,
    })!;
    save = applyPractical(save, { type: 'aid' })!;
    expect(practicalFacts(save).sessions[0]).toEqual(first);
    expect(practicalFacts(save).activeIndependent).toBe(true);
    expect(practicalFacts(save).current!.aided).toBe(true);
    expect(restorePractical(JSON.stringify(save))).toEqual(save);
    expect(
      applyPractical(save, {
        type: 'start',
        kind: 'saas',
        mode: 'guided',
        origin: { module: 'services', topic: 'saas' },
        attempt: 1,
        boundary: null,
      }),
    ).toBeNull();
  });
  it.each([
    '{',
    '{"schema":2}',
    '{"schema":1,"content":"practical-labs@1","events":[{"type":"inspect","id":"vm-1"}]}',
  ])('rejects malformed or orphan practical events: %s', (raw) =>
    expect(() => restorePractical(raw)).toThrow(),
  );
});
describe('fictional SaaS administration', () => {
  it('enforces seats, separates role/license and blocks without deleting data or license', () => {
    let e = freshSaas();
    const send = (type: string, userId: string, value: string) => {
      const r = executeSaas(e, {
        commandId: `s-${e.ledger.length}`,
        expectedWorldRevision: e.state.revision,
        command: { type, userId, value },
      });
      e = r.engine;
      return r;
    };
    const denied = send('SetLicense', 'erin', 'yes');
    expect(denied.receipt.reason).toBe('seats-full');
    expect(e.state.revision).toBe(0);
    send('SetLicense', 'mina', 'no');
    send('SetLicense', 'erin', 'yes');
    expect(e.state.accounts.find((a) => a.id === 'erin')!.role).toBe('member');
    send('SetBlocked', 'leo', 'yes');
    expect(e.state.accounts.find((a) => a.id === 'leo')!.licensed).toBe(true);
    expect(e.state.accounts.find((a) => a.id === 'leo')!.dataReviewed).toBe(false);
    const before = e.state;
    expect(send('SetRole', 'leo', 'global-admin').receipt.reason).toBe('invalid');
    expect(e.state).toBe(before);
    expect(send('RemoteLogin', 'leo', 'yes').receipt.outcome).toBe('unsupported');
    expect(replaySaas(e)?.state).toEqual(e.state);
    const old = e.ledger[0]!;
    expect(executeSaas(e, old.request).engine).toBe(e);
    expect(
      executeSaas(e, {
        ...old.request,
        command: { type: 'SetLicense', userId: 'leo', value: 'yes' },
      }).receipt.reason,
    ).toBe('conflict');
    expect(
      executeSaas(e, {
        commandId: 'stale',
        expectedWorldRevision: 0,
        command: { type: 'SetRole', userId: 'leo', value: 'member' },
      }).receipt.reason,
    ).toBe('stale');
  });
  it('requires changed-context departure operations after an independent boundary', () => {
    let e = freshSaas(),
      save = applyPractical(freshPractical(), {
        type: 'start',
        kind: 'saas',
        mode: 'independent',
        origin: { module: 'services', topic: 'saas' },
        attempt: 1,
        boundary: null,
      })!;
    for (const [type, value] of [
      ['SetBlocked', 'yes'],
      ['SetLicense', 'no'],
      ['SetRole', 'member'],
      ['SetSharing', 'team'],
      ['ReviewDepartureData', 'reviewed'],
    ])
      e = executeSaas(e, {
        commandId: `s-${e.ledger.length}`,
        expectedWorldRevision: e.state.revision,
        command: { type: type!, userId: 'leo', value: value! },
      }).engine;
    save = applyPractical(save, { type: 'inspect', id: 'leo' })!;
    save = applyPractical(save, { type: 'reason', value: 'retained-access' })!;
    expect(evaluatePractical(practicalFacts(save).current, freshEngine(), 1, e, 1).complete).toBe(
      true,
    );
    save = applyPractical(save, { type: 'abandon' })!;
    expect(evaluatePractical(practicalFacts(save).current, freshEngine(), 1, e, 1).complete).toBe(
      false,
    );
  });
  it('validates and replays saved commands; rejects unknown schemas and stale tab writes', () => {
    const data = new Map<string, string>(),
      port = {
        getItem: (k: string) => data.get(k) ?? null,
        setItem: (k: string, v: string) => {
          data.set(k, v);
        },
        removeItem: (k: string) => {
          data.delete(k);
        },
      };
    const a = new SaasStore(port),
      b = new SaasStore(port);
    a.load();
    b.load();
    a.dispatch({
      commandId: 'a',
      expectedWorldRevision: 0,
      command: { type: 'SetBlocked', userId: 'mina', value: 'yes' },
    });
    b.dispatch({
      commandId: 'b',
      expectedWorldRevision: 0,
      command: { type: 'SetBlocked', userId: 'leo', value: 'yes' },
    });
    expect(b.getSnapshot().issue).toBe('conflict');
    const raw = a.exportSnapshot();
    expect(restoreSaas(raw).engine.state.accounts[0]!.blocked).toBe(true);
    a.restart();
    expect(restoreSaas(a.exportSnapshot()).save.archive).toHaveLength(1);
    for (const bad of [
      '{',
      '{"schema":3}',
      raw.replace('SetBlocked', 'RunAnything').replace('"value": "yes"', '"value": {}'),
    ])
      expect(() => restoreSaas(bad)).toThrow();
  });
});
