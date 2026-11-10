import { describe, expect, it } from 'vitest';
import { execute, freshEngine, infrastructure, type Command, type Engine } from './model';
import {
  answerIds,
  missionAnswerIds,
  applyMission,
  diagnose,
  freshMissions,
  missionDefinitions,
  missionEvaluation,
  missionFacts,
  missionIds,
  missionKey,
  restoreMissions,
  type MissionEvent,
  type MissionId,
} from './missions';
import { MissionStore } from './mission-store';
import { missionSources } from './mission-sources';
import { missionsNb } from '@/content/nb';
function fixture() {
  let e = freshEngine();
  const send = (command: Command) => {
    const id = `test-${e.ledger.length + 1}`;
    e = execute(e, { commandId: id, expectedWorldRevision: e.world.revision, command }).engine;
    return e.ledger.at(-1)!.receipt;
  };
  const group = (subscriptionId = 'sub-shared') =>
    send({
      type: 'CreateGroup',
      name: `rg-${e.world.nextId}`,
      subscriptionId,
      metadataRegion: 'norwayeast',
    }).addedIds[0]!;
  const vm = (groupId: string, independent = false) =>
    send({
      type: 'CreateVmBundle',
      groupId,
      name: `vm-${e.world.nextId}`,
      region: 'northeurope',
      image: independent ? 'windows-2022' : 'ubuntu-22-04',
      profile: independent ? 'small' : 'standard',
      dataDiskGiB: '32',
      subnetId: '',
    });
  return { send, group, vm, engine: () => e };
}
function session(id: MissionId, e: Engine, mode: 'guided' | 'independent' = 'guided') {
  let save = freshMissions();
  const event = (event: MissionEvent) => {
    const next = applyMission(save, event);
    if (!next) throw Error(JSON.stringify(event));
    save = next;
  };
  event({
    type: 'start',
    mission: id,
    mode,
    attempt: 1,
    boundary: e.ledger.at(-1)?.receipt.commandId ?? null,
  });
  const current = () => missionFacts(save).current!;
  const inspect = (ids: string[], kind = 'resource') =>
    ids.forEach((id) => event({ type: 'inspect', ref: `${kind}:${id}` }));
  const answers = () => {
    for (const field of ['decision', 'reason'] as const)
      event({ type: 'answer', field, value: missionAnswerIds(current())[field][0]! });
  };
  return { event, current, inspect, answers, save: () => save };
}
describe('versioned practical missions — technical references, never a second inventory', () => {
  it('binds four distinct manuscripts to current objectives, sources and changed independent requirements', () => {
    expect(missionIds).toHaveLength(4);
    expect(missionIds.filter((id) => missionDefinitions[id].module === 'benefits')).toHaveLength(2);
    for (const id of missionIds) {
      const d = missionDefinitions[id],
        copy = missionsNb.missions[id];
      expect(d.sources.every((id) => !!missionSources[id])).toBe(true);
      expect(copy.goals.length).toBeGreaterThan(1);
      expect(copy.stages.length).toBeGreaterThan(2);
      expect(copy.independent).not.toBe(copy.scenario);
      for (const field of ['decision', 'reason'] as const)
        for (const option of answerIds[id][field])
          expect(Object.hasOwn(copy.choices, option)).toBe(true);
      for (const field of ['decision', 'reason'] as const)
        for (const option of missionAnswerIds({ mission: id, mode: 'independent' })[field])
          expect(Object.hasOwn(copy.choices, option)).toBe(true);
    }
  });
  it('computes declared failure propagation and routing from a real VM chain without mutation', () => {
    const f = fixture(),
      g = f.group(),
      r = f.vm(g),
      e = f.engine(),
      vm = infrastructure(e.world).find((v) => r.addedIds.includes(v.id) && v.kind === 'vm')!;
    const before = JSON.stringify(e);
    expect(
      diagnose(e.world, vm.id, {
        failure: 'subnet',
        copies: 2,
        isolation: 'shared',
        routing: 'balanced',
      })?.usable,
    ).toBe(0);
    expect(
      diagnose(e.world, vm.id, {
        failure: 'subnet',
        copies: 2,
        isolation: 'independent',
        routing: 'balanced',
      })?.usable,
    ).toBe(1);
    expect(
      diagnose(e.world, vm.id, { failure: 'os', copies: 2, isolation: 'shared', routing: 'single' })
        ?.usable,
    ).toBe(0);
    expect(
      diagnose(e.world, vm.id, {
        failure: 'os',
        copies: 2,
        isolation: 'shared',
        routing: 'balanced',
      })?.usable,
    ).toBe(1);
    expect(
      diagnose(e.world, vm.id, {
        failure: 'subnet',
        copies: 8,
        isolation: 'shared',
        routing: 'balanced',
      }),
    ).toBeNull();
    expect(
      diagnose(e.world, 'missing', {
        failure: 'os',
        copies: 1,
        isolation: 'shared',
        routing: 'single',
      }),
    ).toBeNull();
    expect(JSON.stringify(e)).toBe(before);
  });
  it('allows inspection reuse for diagnosis but requires real chain and two new model observations', () => {
    const f = fixture(),
      g = f.group(),
      r = f.vm(g),
      e = f.engine(),
      vm = infrastructure(e.world).find((v) => r.addedIds.includes(v.id) && v.kind === 'vm')!;
    const s = session('diagnose', e);
    s.event({ type: 'select', target: vm.id });
    s.answers();
    expect(missionEvaluation(s.current(), e, 1).complete).toBe(false);
    const refs = missionEvaluation(s.current(), e, 1).refs;
    s.inspect(refs);
    for (const isolation of ['shared', 'independent'] as const)
      s.event({
        type: 'run',
        run: {
          target: vm.id,
          through: e.ledger.at(-1)!.receipt.commandId,
          input: { failure: 'subnet', copies: 2, isolation, routing: 'balanced' },
          prediction: 0,
        },
      });
    const result = missionEvaluation(s.current(), e, 1);
    expect(result.complete).toBe(true);
    expect(result.reused).toBe(true);
    const independent = session('diagnose', e, 'independent');
    independent.event({ type: 'select', target: vm.id });
    independent.inspect(refs);
    independent.answers();
    expect(missionEvaluation(independent.current(), e, 1).checks.contrast).toBe(false);
  });
  it.each(['guided', 'independent'] as const)(
    'evaluates %s IaaS against its distinct new-build requirement',
    (mode) => {
      const f = fixture(),
        oldG = f.group(),
        old = f.vm(oldG),
        s = session('infrastructure', f.engine(), mode);
      s.event({ type: 'select', target: old.addedIds[0]! });
      s.answers();
      expect(missionEvaluation(s.current(), f.engine(), 1).complete).toBe(false);
      const g = mode === 'independent' ? f.group('sub-app') : oldG,
        receipt = f.vm(g, mode === 'independent');
      const vm = infrastructure(f.engine().world).find(
        (v) => receipt.addedIds.includes(v.id) && v.kind === 'vm',
      )!;
      s.event({ type: 'select', target: vm.id });
      s.inspect(missionEvaluation(s.current(), f.engine(), 1).refs);
      s.inspect([receipt.commandId], 'receipt');
      expect(missionEvaluation(s.current(), f.engine(), 1).complete).toBe(true);
      expect(missionEvaluation(s.current(), f.engine(), 2).verifiable).toBe(false);
    },
  );
  it('requires a same-group denied/corrected Web sequence and real inspection, never a historical denial', () => {
    const f = fixture(),
      g = f.group('sub-app'),
      s = session('governance', f.engine());
    const denied = f.send({
      type: 'CreatePlan',
      groupId: g,
      name: 'plan-rejected',
      region: 'northeurope',
      profile: 'linux-learning-v1',
    });
    expect(denied.code).toBe('policy-location-denied');
    expect(denied.addedIds).toEqual([]);
    const plan = f.send({
      type: 'CreatePlan',
      groupId: g,
      name: 'plan-allowed',
      region: 'westeurope',
      profile: 'linux-learning-v1',
    });
    const app = f.send({
      type: 'CreateWebApp',
      groupId: g,
      name: 'app-allowed',
      planId: plan.addedIds[0]!,
    });
    s.event({ type: 'select', target: app.addedIds[0]! });
    s.answers();
    s.inspect(missionEvaluation(s.current(), f.engine(), 1).refs);
    s.inspect([denied.commandId, plan.commandId], 'receipt');
    s.inspect(['policy-web-location'], 'policy');
    expect(missionEvaluation(s.current(), f.engine(), 1).complete).toBe(true);
    const later = session('governance', f.engine());
    later.event({ type: 'select', target: app.addedIds[0]! });
    later.answers();
    expect(missionEvaluation(later.current(), f.engine(), 1).checks.denied).toBe(false);
    const independent = session('governance', f.engine(), 'independent');
    independent.event({ type: 'select', target: app.addedIds[0]! });
    expect(missionEvaluation(independent.current(), f.engine(), 1).checks.typeCounterexample).toBe(
      false,
    );
  });
  it('does not treat drafts or previous settings as new work; requires ordered Apply and restoration on same app', () => {
    const f = fixture(),
      g = f.group('sub-app'),
      plan = f.send({
        type: 'CreatePlan',
        groupId: g,
        name: 'plan-platform',
        region: 'westeurope',
        profile: 'linux-learning-v1',
      }),
      app = f.send({
        type: 'CreateWebApp',
        groupId: g,
        name: 'app-platform',
        planId: plan.addedIds[0]!,
      }).addedIds[0]!;
    const s = session('platform', f.engine());
    s.event({ type: 'select', target: app });
    s.answers();
    const before = JSON.stringify(f.engine());
    s.event({
      type: 'draft',
      target: app,
      through: f.engine().ledger.at(-1)!.receipt.commandId,
      environment: 'staging',
      catalogMode: 'read-only',
    });
    expect(JSON.stringify(f.engine())).toBe(before);
    expect(missionEvaluation(s.current(), f.engine(), 1).complete).toBe(false);
    const read = f.send({
      type: 'SetAppSettings',
      appId: app,
      environment: 'staging',
      catalogMode: 'read-only',
    });
    expect(missionEvaluation(s.current(), f.engine(), 1).checks.restoration).toBe(false);
    const restored = f.send({
      type: 'SetAppSettings',
      appId: app,
      environment: 'staging',
      catalogMode: 'standard',
    });
    s.inspect(missionEvaluation(s.current(), f.engine(), 1).refs);
    s.inspect([read.commandId, restored.commandId], 'receipt');
    expect(missionEvaluation(s.current(), f.engine(), 1).complete).toBe(true);
    s.event({ type: 'submit', through: restored.commandId });
    const frozen = JSON.stringify(s.save());
    f.send({
      type: 'SetAppSettings',
      appId: app,
      environment: 'production',
      catalogMode: 'read-only',
    });
    expect(missionEvaluation(s.current(), f.engine(), 1).complete).toBe(true);
    expect(JSON.stringify(s.save())).toBe(frozen);
    expect(
      applyMission(s.save(), { type: 'answer', field: 'reason', value: 'running-proven' }),
    ).toBeNull();
    const retry = session('platform', f.engine(), 'independent');
    retry.event({ type: 'select', target: app });
    expect(missionEvaluation(retry.current(), f.engine(), 1).checks.production).toBe(false);
  });
  it('independent platform requires separate apps on one real plan, new writes and changed target draft; guided sequence cannot substitute', () => {
    const f = fixture(),
      group = f.group('sub-app');
    const plan = f.send({
      type: 'CreatePlan',
      groupId: group,
      name: 'plan-shared',
      region: 'westeurope',
      profile: 'linux-learning-v1',
    }).addedIds[0]!;
    const target = f.send({
      type: 'CreateWebApp',
      groupId: group,
      name: 'app-public',
      planId: plan,
    }).addedIds[0]!;
    const sibling = f.send({
      type: 'CreateWebApp',
      groupId: group,
      name: 'app-staging',
      planId: plan,
    }).addedIds[0]!;
    const s = session('platform', f.engine(), 'independent');
    s.event({ type: 'select', target });
    s.answers();
    expect(
      applyMission(s.save(), { type: 'answer', field: 'decision', value: 'managed-os' }),
    ).toBeNull();
    s.event({
      type: 'draft',
      target,
      through: f.engine().ledger.at(-1)!.receipt.commandId,
      environment: 'production',
      catalogMode: 'standard',
    });
    const production = f.send({
      type: 'SetAppSettings',
      appId: target,
      environment: 'production',
      catalogMode: 'standard',
    });
    expect(missionEvaluation(s.current(), f.engine(), 1).checks.isolation).toBe(false);
    const otherPlan = f.send({
      type: 'CreatePlan',
      groupId: group,
      name: 'plan-unrelated',
      region: 'westeurope',
      profile: 'linux-learning-v1',
    }).addedIds[0]!;
    const otherApp = f.send({
      type: 'CreateWebApp',
      groupId: group,
      name: 'app-unrelated',
      planId: otherPlan,
    }).addedIds[0]!;
    f.send({
      type: 'SetAppSettings',
      appId: otherApp,
      environment: 'staging',
      catalogMode: 'read-only',
    });
    expect(missionEvaluation(s.current(), f.engine(), 1).checks.isolation).toBe(false);
    const stage = f.send({
      type: 'SetAppSettings',
      appId: sibling,
      environment: 'staging',
      catalogMode: 'read-only',
    });
    const result = missionEvaluation(s.current(), f.engine(), 1);
    s.inspect(result.refs);
    s.inspect([production.commandId, stage.commandId], 'receipt');
    expect(missionEvaluation(s.current(), f.engine(), 1).complete).toBe(true);
    s.event({ type: 'submit', through: stage.commandId });
    const historical = session('platform', f.engine(), 'independent');
    historical.event({ type: 'select', target });
    historical.answers();
    historical.inspect(result.refs);
    historical.inspect([production.commandId, stage.commandId], 'receipt');
    expect(missionEvaluation(historical.current(), f.engine(), 1).complete).toBe(false);
    const guided = session('platform', f.engine());
    guided.event({ type: 'select', target });
    guided.answers();
    expect(missionEvaluation(guided.current(), f.engine(), 1).complete).toBe(false);
  });
  it('rejects malformed/unsupported input, missing references, arbitrary origins and records no evidence from visits', () => {
    const s = session('platform', freshEngine());
    for (const raw of [
      { type: 'visit' },
      { type: 'run', run: null },
      { type: 'inspect', ref: 'bad' },
      { type: 'select', target: '../../' },
      { type: 'answer', field: 'reason', value: 'forged' },
      { type: 'submit', through: null },
    ])
      expect(applyMission(s.save(), raw)).toBeNull();
    expect(restoreMissions('{').issue).toBe('corrupt');
    expect(restoreMissions('{"schema":2}').issue).toBe('unsupported');
    expect(restoreMissions(JSON.stringify(s.save())).save).toEqual(s.save());
    expect(
      applyMission(freshMissions(), {
        type: 'start',
        mission: 'platform',
        mode: 'guided',
        attempt: 1,
        boundary: null,
        origin: '/fake',
      }),
    ).toBeNull();
    s.event({ type: 'select', target: 'missing' });
    s.answers();
    expect(missionEvaluation(s.current(), freshEngine(), 1).complete).toBe(false);
  });
  it('reserves aid and terminal capacity and preserves first/help/retry/abandon without merging', () => {
    const s = session('diagnose', freshEngine(), 'independent');
    s.answers();
    while (s.save().events.length < 600)
      s.event({ type: 'select', target: s.save().events.length % 2 ? 'one' : 'two' });
    expect(
      applyMission(s.save(), { type: 'answer', field: 'reason', value: 'guaranteed' }),
    ).toBeNull();
    s.event({ type: 'aid' });
    s.event({ type: 'submit', through: null });
    expect(s.save().events).toHaveLength(602);
    expect(restoreMissions(JSON.stringify(s.save())).issue).toBeNull();
    expect(s.current().aided).toBe(true);
    expect(
      applyMission(s.save(), {
        type: 'start',
        mission: 'platform',
        mode: 'guided',
        attempt: 1,
        boundary: null,
      }),
    ).toBeNull();
  });
  it('reserves both missing final answers at the event boundary without permitting endless answer changes', () => {
    const s = session('diagnose', freshEngine(), 'independent');
    while (s.save().events.length < 600)
      s.event({ type: 'select', target: s.save().events.length % 2 ? 'one' : 'two' });
    s.answers();
    expect(
      applyMission(s.save(), { type: 'answer', field: 'decision', value: 'duplicate' }),
    ).toBeNull();
    s.event({ type: 'aid' });
    s.event({ type: 'submit', through: null });
    expect(s.save().events).toHaveLength(604);
    expect(restoreMissions(JSON.stringify(s.save())).issue).toBeNull();
    expect(s.current().status).toBe('submitted');
  });
  it('stale writes fail closed, denied help withholds teaching and scoped recovery cannot delete a newer valid save', () => {
    const values = new Map<string, string>([['sentinel', 'old-learner-and-XP']]);
    const port = {
      getItem: (k: string) => values.get(k) ?? null,
      setItem: (k: string, v: string) => {
        values.set(k, v);
      },
      removeItem: (k: string) => {
        values.delete(k);
      },
    };
    const a = new MissionStore(port),
      b = new MissionStore(port);
    a.load();
    b.load();
    expect(
      a.event({
        type: 'start',
        mission: 'platform',
        mode: 'independent',
        attempt: 1,
        boundary: null,
      }),
    ).toBe(true);
    expect(b.prepareTeaching()).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    b.load();
    const denied = new MissionStore({
      ...port,
      setItem: () => {
        throw Error('denied');
      },
    });
    denied.load();
    expect(denied.prepareTeaching()).toBe(false);
    expect(denied.getSnapshot().issue).toBe('unsaved');
    values.set(missionKey, '{');
    const recovery = new MissionStore(port);
    recovery.load();
    expect(recovery.getSnapshot().issue).toBe('corrupt');
    values.set(missionKey, JSON.stringify(a.getSnapshot().save));
    expect(recovery.recoverInvalid()).toBe(false);
    expect(recovery.getSnapshot().issue).toBeNull();
    expect(values.get('sentinel')).toBe('old-learner-and-XP');
    expect(missionFacts(recovery.getSnapshot().save).active).toBe(true);
    expect(recovery.prepareTeaching()).toBe(true);
    expect(missionFacts(recovery.getSnapshot().save).assisted).toBe(true);
    expect(missionFacts(a.getSnapshot().save).assisted).toBe(false);
  });
});
