import { describe, expect, it } from 'vitest';
import {
  entityCount,
  execute,
  freshEngine,
  guidedFixture,
  policyFindings,
  relations,
  types,
  type Command,
  type Engine,
} from './model';
import {
  applyEvent,
  chapterDefinition,
  currentStage,
  findings,
  freshAttempt,
  objectiveEvaluators,
  type Attempt,
  type Event,
} from './scenario';
import { restoreChapter, snapshotOf } from './persistence';

function send(
  engine: Engine,
  command: Command | Record<string, unknown>,
  commandId = `c-${engine.ledger.length + 1}`,
  expectedWorldRevision = engine.world.revision,
) {
  return execute(engine, { commandId, expectedWorldRevision, command });
}
const groupCommand = {
  type: 'CreateGroup',
  name: 'rg-application',
  metadataRegion: 'norwayeast',
  subscriptionId: 'sub-app',
} as const;
const planCommand = {
  type: 'CreatePlan',
  groupId: 'group-1',
  name: 'plan-application',
  region: 'westeurope',
  profile: 'linux-learning-v1',
} as const;
const appCommand = {
  type: 'CreateWebApp',
  groupId: 'group-1',
  name: 'app-application',
  planId: 'plan-2',
} as const;
const grouped = () => send(freshEngine(), groupCommand).engine;
function add(a: Attempt, event: Event) {
  const next = applyEvent(a, event);
  expect(next).not.toBeNull();
  return next!;
}
function command(a: Attempt, c: Command) {
  return add(a, {
    kind: 'command',
    request: {
      commandId: `c-${a.events.length + 1}`,
      expectedWorldRevision: a.engine.world.revision,
      command: { ...c },
    },
    bindResult: true,
  });
}
function completeGuided() {
  let a = add(freshAttempt(), {
    kind: 'responsibility',
    model: 'paas',
    os: 'microsoft',
    code: 'customer',
  });
  a = command(a, groupCommand);
  a = add(a, {
    kind: 'prediction',
    placement: 'metadata-forces-location',
    appLocation: 'group-determines-app-location',
  });
  a = command(a, { ...planCommand, region: 'northeurope' });
  a = add(a, { kind: 'inspect-receipt', commandId: a.responses.at(-1)!.commandId });
  a = add(a, { kind: 'inspect-policy' });
  a = command(a, planCommand);
  a = command(a, appCommand);
  return add(a, {
    kind: 'explain',
    placement: 'metadata-independent',
    appLocation: 'plan-determines-app-location',
    remedy: 'policy-targets-resource-location',
  });
}
describe('organization-web@1 domain vectors', () => {
  it('V01/V07: accepts both subscriptions while scenario requirements remain separate', () => {
    const { engine, receipt } = send(freshEngine(), groupCommand);
    expect(receipt.outcome).toBe('accepted');
    expect(receipt.afterRevision).toBe(1);
    expect(engine.world.groups[0]).toMatchObject({
      subscriptionId: 'sub-app',
      metadataLocation: 'norwayeast',
    });
    let a = command(freshAttempt(), { ...groupCommand, subscriptionId: 'sub-shared' });
    expect(a.responses[0]!.outcome).toBe('accepted');
    expect(objectiveEvaluators['group-in-target-scope@1'](a)).toBe(false);
    a = command(a, groupCommand);
    expect(objectiveEvaluators['group-in-target-scope@1'](a)).toBe(true);
  });
  it.each([
    [{ ...groupCommand, name: 'bad/name' }, 'invalid-name'],
    [{ ...groupCommand, metadataRegion: 'moon' }, 'invalid-region'],
    [{ ...groupCommand, subscriptionId: 'tenant-lab' }, 'invalid-parent'],
    [{ ...groupCommand, name: 42 }, 'invalid-command'],
    [{ type: 'toString' }, 'unsupported-capability'],
    [{ type: 'MoveResource' }, 'unsupported-capability'],
    [{ ...groupCommand, sku: 'unimplemented' }, 'unsupported-field'],
  ])('V02: rejects or explicitly excludes malformed/unsupported command %j', (cmd, code) => {
    const engine = freshEngine();
    const result = send(engine, cmd as Record<string, unknown>);
    expect(result.receipt.code).toBe(code);
    expect(result.engine.world).toBe(engine.world);
    expect(result.receipt.addedIds).toEqual([]);
    expect(result.receipt.afterCount).toBe(entityCount(engine.world));
  });
  it('V03: denial carries a causal policy witness and changes neither world revision nor resource sequence', () => {
    const engine = grouped();
    const result = send(engine, { ...planCommand, region: 'northeurope' });
    expect(result.receipt).toMatchObject({
      code: 'policy-location-denied',
      operation: 'CreatePlan',
      targetType: types.plan,
      scopeId: 'group-1',
      location: 'northeurope',
      beforeRevision: 1,
      afterRevision: 1,
      addedIds: [],
      policy: {
        assignmentId: 'policy-web-location',
        assignmentScope: 'sub-app',
        targetType: types.plan,
        requestedLocation: 'northeurope',
        allowedLocations: ['westeurope'],
      },
    });
    expect(result.engine.world).toBe(engine.world);
    expect(result.engine.world.nextId).toBe(2);
    expect(result.engine.world.resources).toEqual([]);
  });
  it('V04/V06: resources have separate locations, explicit membership and dependent-to-plan edges', () => {
    const plan = send(grouped(), planCommand).engine;
    const app = send(plan, appCommand).engine;
    expect(app.world.groups[0]!.metadataLocation).toBe('norwayeast');
    expect(app.world.resources).toEqual([
      expect.objectContaining({
        id: 'plan-2',
        type: types.plan,
        location: 'westeurope',
        os: 'linux',
      }),
      expect.objectContaining({
        id: 'app-3',
        type: types.app,
        planId: 'plan-2',
        location: 'westeurope',
        groupId: 'group-1',
        os: 'linux',
      }),
    ]);
    expect(relations(app.world)).toContainEqual({
      kind: 'depends-on',
      from: 'app-3',
      to: 'plan-2',
    });
    expect(relations(app.world)).toContainEqual({
      kind: 'resource-member',
      from: 'app-3',
      to: 'group-1',
    });
    expect(relations(app.world)).toContainEqual({
      kind: 'identity-authority',
      from: 'sub-app',
      to: 'tenant-lab',
    });
    expect(app.world.revision).toBe(3);
  });
  it('V05: missing or wrong-type plan rejects without removing prior resources', () => {
    const engine = send(grouped(), planCommand).engine;
    for (const planId of ['missing', 'group-1', 'tenant-lab']) {
      const result = send(engine, { ...appCommand, planId });
      expect(result.receipt.code).toBe('missing-plan');
      expect(result.engine.world).toBe(engine.world);
      expect(result.engine.world.resources).toHaveLength(1);
    }
  });
  it('excludes groups from the Web policy and does not mistake metadata changes for a remedy', () => {
    for (const metadataRegion of ['norwayeast', 'westeurope', 'northeurope']) {
      const engine = send(freshEngine(), { ...groupCommand, metadataRegion }).engine;
      expect(engine.world.groups).toHaveLength(1);
      expect(send(engine, { ...planCommand, region: 'northeurope' }).receipt.code).toBe(
        'policy-location-denied',
      );
    }
    const shared = send(freshEngine(), { ...groupCommand, subscriptionId: 'sub-shared' }).engine;
    expect(send(shared, { ...planCommand, region: 'northeurope' }).receipt.outcome).toBe(
      'accepted',
    );
  });
  it('V08 domain counterexample: existing noncompliance is not deletion; a new app is evaluated independently', () => {
    const engine = send(grouped(), planCommand).engine;
    const changed = {
      ...engine,
      world: {
        ...engine.world,
        policies: engine.world.policies.map((p) => ({
          ...p,
          allowedLocations: ['northeurope' as const],
        })),
      },
    };
    expect(policyFindings(changed.world)).toHaveLength(1);
    const result = send(changed, appCommand);
    expect(result.receipt.code).toBe('policy-location-denied');
    expect(result.engine.world).toBe(changed.world);
    expect(result.engine.world.resources).toHaveLength(1);
  });
  it('V09: deduplicates delivery using a canonical payload and rejects conflicting IDs', () => {
    const first = send(freshEngine(), groupCommand, 'delivery-1');
    const duplicate = send(
      first.engine,
      {
        name: groupCommand.name,
        type: groupCommand.type,
        subscriptionId: 'sub-app',
        metadataRegion: 'norwayeast',
      },
      'delivery-1',
      0,
    );
    expect(duplicate.engine).toBe(first.engine);
    expect(duplicate.receipt).toBe(first.receipt);
    const conflict = send(first.engine, { ...groupCommand, name: 'different' }, 'delivery-1', 0);
    expect(conflict.receipt.code).toBe('command-id-conflict');
    expect(conflict.engine).toBe(first.engine);
  });
  it('V10: stale requests, duplicates and unsupported profile/cross-group/delete behavior are explicit', () => {
    const engine = grouped();
    expect(send(engine, { ...groupCommand, name: 'RG-APPLICATION' }).receipt.code).toBe(
      'duplicate-name',
    );
    expect(send(engine, planCommand, 'stale', 0).receipt.code).toBe('stale-revision');
    expect(send(engine, { ...planCommand, profile: 'windows' }).receipt.code).toBe(
      'unsupported-profile',
    );
    const planned = send(engine, planCommand).engine;
    const other = send(planned, { ...groupCommand, name: 'rg-other' }).engine;
    expect(send(other, { ...appCommand, groupId: 'group-3' }).receipt).toMatchObject({
      code: 'cross-group-hosting',
      outcome: 'unsupported',
    });
    expect(send(planned, { type: 'DeleteEmptyGroup', groupId: 'group-1' }).receipt.code).toBe(
      'cascade-delete-unsupported',
    );
    expect(
      send(engine, { type: 'DeleteEmptyGroup', groupId: 'group-1' }).engine.world.groups,
    ).toEqual([]);
    expect(send(planned, { ...appCommand, region: 'norwayeast' }).receipt.code).toBe(
      'unsupported-field',
    );
  });
  it('V10: caps active groups and total entities using chapter limits, not Azure quotas', () => {
    let engine = grouped();
    engine = send(engine, { ...groupCommand, name: 'rg-b' }).engine;
    engine = send(engine, { ...groupCommand, name: 'rg-c' }).engine;
    expect(send(engine, { ...groupCommand, name: 'rg-d' }).receipt.code).toBe('capacity');
    while (entityCount(engine.world) < 16)
      engine = send(engine, { ...planCommand, name: `plan-${engine.world.nextId}` }).engine;
    expect(send(engine, { ...planCommand, name: 'over-capacity' }).receipt.code).toBe('capacity');
  });
  it('records deterministic receipts and never mutates the frozen fixture', () => {
    const before = JSON.stringify(guidedFixture);
    expect(send(grouped(), { ...planCommand, region: 'northeurope' })).toEqual(
      send(grouped(), { ...planCommand, region: 'northeurope' }),
    );
    expect(JSON.stringify(guidedFixture)).toBe(before);
    expect(
      send(freshEngine(), {
        type: 'CreatePlan',
        groupId: 'group-1',
        name: 'No',
        region: 'westeurope',
        profile: 'linux-learning-v1',
      }).receipt.outcome,
    ).toBe('rejected');
    expect(execute(freshEngine(), null).receipt.code).toBe('invalid-envelope');
  });
});
describe('guided orchestration and safe replay', () => {
  it('V12 subset: replays every command, decision, denial and causal witness identically without XP', () => {
    const attempt = completeGuided();
    expect(currentStage(attempt)).toBe('guided-built');
    expect(chapterDefinition.award).toBeNull();
    expect(findings(attempt).every((f) => f.met)).toBe(true);
    const restored = restoreChapter(JSON.stringify(snapshotOf(attempt, 15, 2)));
    expect(restored.status).toBe('valid');
    expect(restored.attempt).toEqual(attempt);
    expect(currentStage(freshAttempt())).toBe('responsibility');
    expect(attempt.prediction?.placement).toBe('metadata-forces-location'); // Original misconception retained, not rewritten as success.
  });
  it('records predictions outside technical state and detects post-result predictions', () => {
    const a = command(freshAttempt(), groupCommand);
    const predicted = add(a, {
      kind: 'prediction',
      placement: 'metadata-independent',
      appLocation: 'plan-determines-app-location',
    });
    expect(predicted.engine).toBe(a.engine);
    expect(predicted.prediction?.beforeResult).toBe(true);
    expect(
      applyEvent(predicted, {
        kind: 'prediction',
        placement: 'metadata-forces-location',
        appLocation: 'group-determines-app-location',
      }),
    ).toBeNull();
    const late = add(command(a, planCommand), {
      kind: 'prediction',
      placement: 'metadata-independent',
      appLocation: 'plan-determines-app-location',
    });
    expect(late.prediction?.beforeResult).toBe(false);
  });
  it('uses an isolated actual policy probe if correct resources were built first', () => {
    const a = command(command(freshAttempt(), groupCommand), {
      ...planCommand,
      name: 'probe-location',
    });
    const probe = add(a, { kind: 'probe', groupId: 'group-1' });
    expect(probe.engine).toBe(a.engine);
    expect(probe.responses.at(-1)).toMatchObject({ probe: true, code: 'policy-location-denied' });
    expect(probe.engine.world.resources).toHaveLength(1);
    const late = add(probe, {
      kind: 'prediction',
      placement: 'metadata-independent',
      appLocation: 'plan-determines-app-location',
    });
    expect(late.prediction?.beforeResult).toBe(false);
    const earlyProbe = add(command(freshAttempt(), groupCommand), {
      kind: 'probe',
      groupId: 'group-1',
    });
    expect(
      add(earlyProbe, {
        kind: 'prediction',
        placement: 'metadata-independent',
        appLocation: 'plan-determines-app-location',
      }).prediction?.beforeResult,
    ).toBe(false);
  });
  it('does not latch guided success when role bindings later violate lifecycle/scope requirements', () => {
    let a = completeGuided();
    a = command(a, { ...groupCommand, name: 'rg-another', subscriptionId: 'sub-shared' });
    expect(currentStage(a)).toBe('organize');
    expect(findings(a).find((f) => f.id === 'construct')?.met).toBe(false);
    expect(applyEvent(a, { kind: 'bind', role: 'plan', id: 'group-1' })).toBeNull();
  });
  it.each([null, 'broken', '[]', '{}', 'x'.repeat(250001)])(
    'V16: malformed/unsupported data cannot silently become completion (%s)',
    (raw) => {
      const restored = restoreChapter(raw);
      expect(currentStage(restored.attempt)).toBe('responsibility');
      expect(restored.status).not.toBe('valid');
    },
  );
  it('V16: validates versions, all events and references; ignores forged derived state', () => {
    const snapshot = snapshotOf(completeGuided(), 20, 1);
    for (const data of [
      { ...snapshot, modelVersion: 'unknown' },
      { ...snapshot, schemaVersion: 99 },
      { ...snapshot, storeRevision: -1 },
      { ...snapshot, events: [...snapshot.events, { kind: 'bind', role: 'app', id: 'ghost' }] },
      {
        ...snapshot,
        events: [
          {
            kind: 'command',
            request: {
              commandId: 'bad',
              expectedWorldRevision: 0,
              command: { type: 'CreateGroup', name: {} },
            },
            bindResult: true,
          },
        ],
      },
    ]) {
      const restored = restoreChapter(JSON.stringify(data));
      expect(restored.status).not.toBe('valid');
      expect(currentStage(restored.attempt)).toBe('responsibility');
    }
    const forged = restoreChapter(
      JSON.stringify({
        ...snapshotOf(freshAttempt(), 0, 1),
        completed: true,
        xp: 100,
        engine: snapshot,
      }),
    );
    expect(currentStage(forged.attempt)).toBe('responsibility');
  });
});
