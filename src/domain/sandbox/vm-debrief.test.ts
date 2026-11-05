import { describe, expect, it } from 'vitest';
import { execute, freshEngine, type Command } from './model';
import {
  applyMission,
  freshMissions,
  missionEvaluation,
  missionFacts,
  missionAnswerIds,
  infrastructureRequirements,
  type MissionEvent,
  type MissionSession,
} from './missions';
import { vmDebrief } from './vm-debrief';
import { SandboxStore, sandboxKey } from './store';

function fixture(
  mode: MissionSession['mode'] = 'guided',
  changes: {
    image?: string;
    profile?: string;
    disk?: string;
    scope?: string;
    inspect?: boolean;
    explain?: boolean;
  } = {},
) {
  let engine = freshEngine();
  let save = freshMissions();
  const send = (command: Command) => {
    const commandId = `diag-${engine.ledger.length + 1}`;
    engine = execute(engine, {
      commandId,
      expectedWorldRevision: engine.world.revision,
      command,
    }).engine;
    return engine.ledger.at(-1)!.receipt;
  };
  const event = (e: MissionEvent) => {
    const next = applyMission(save, e);
    if (!next) throw Error(JSON.stringify(e));
    save = next;
  };
  event({ type: 'start', mission: 'infrastructure', mode, attempt: 1, boundary: null });
  const expected = infrastructureRequirements(mode);
  const group = send({
    type: 'CreateGroup',
    name: 'rg-diagnostic',
    subscriptionId: changes.scope ?? expected.subscriptionId,
    metadataRegion: 'norwayeast',
  }).addedIds[0]!;
  const receipt = send({
    type: 'CreateVmBundle',
    groupId: group,
    name: 'vm-diagnostic',
    region: 'northeurope',
    image: changes.image ?? expected.image,
    profile: changes.profile ?? expected.profile,
    dataDiskGiB: changes.disk ?? String(expected.dataDiskGiB),
    subnetId: '',
  });
  const vm = receipt.addedIds.find(
    (id) => engine.world.infrastructure.find((r) => r.id === id)?.kind === 'vm',
  )!;
  event({ type: 'select', target: vm });
  const current = () => missionFacts(save).current!;
  if (changes.inspect !== false)
    for (const ref of missionEvaluation(current(), engine, 1).refs)
      event({ type: 'inspect', ref: `resource:${ref}` });
  if (changes.inspect !== false) event({ type: 'inspect', ref: `receipt:${receipt.commandId}` });
  if (changes.explain !== false)
    for (const field of ['decision', 'reason'] as const)
      event({ type: 'answer', field, value: missionAnswerIds(current())[field][0]! });
  // Historical contract permits incomplete submission, including wrong answers/missing inspection.
  if (changes.explain === false) {
    event({ type: 'answer', field: 'decision', value: 'managed-guest' });
    event({ type: 'answer', field: 'reason', value: 'network-proven' });
  }
  event({ type: 'submit', through: receipt.commandId });
  const result = () => missionEvaluation(current(), engine, 1);
  return {
    send,
    event,
    current,
    result,
    engine: () => engine,
    save: () => save,
    vm,
    receipt,
    diagnostic: () => vmDebrief(current(), result()),
  };
}
describe('CC02 read-only VM debrief from original attempt/through', () => {
  it.each([
    [{ profile: 'small' }, ['profile']],
    [{}, []],
    [{ disk: '0' }, ['dataDiskGiB']],
    [{ image: 'windows-2022' }, ['image']],
    [{ scope: 'sub-app' }, ['subscriptionId']],
  ] as const)(
    'explains actual individual configuration fields and agrees with frozen evaluator: %j',
    (changes, fields) => {
      const f = fixture('guided', changes),
        before = JSON.stringify({ engine: f.engine(), save: f.save() });
      const d = f.diagnostic()!;
      expect(d.mismatches.map((r) => r.field)).toEqual(fields);
      expect(d.rows.every((r) => r.matches)).toBe(f.result().checks.requirements);
      expect(d.complete).toBe(f.result().complete);
      expect(d.receiptId).toBe(f.receipt.commandId);
      expect(JSON.stringify({ engine: f.engine(), save: f.save() })).toBe(before);
    },
  );
  it.each([{ inspect: false }, { explain: false }])(
    'separates creation and configuration from guided inspection/explanation: %j',
    (changes) => {
      const f = fixture('guided', changes);
      const d = f.diagnostic()!;
      expect(d.receiptId).toBe(f.receipt.commandId);
      expect(d.mismatches).toEqual([]);
      expect(d.complete).toBe(false);
      expect(d.remaining).toContain(changes.inspect === false ? 'attachments' : 'reason');
    },
  );
  it('uses independent mode requirements, never guided values or a new completion predicate', () => {
    const f = fixture('independent');
    expect(f.result().complete).toBe(true);
    expect(f.diagnostic()!.rows.map((r) => r.expected)).toEqual(
      Object.values(infrastructureRequirements('independent')),
    );
    expect(f.diagnostic()!.rows.every((r) => r.matches)).toBe(true);
    const wrong = fixture('independent', {
      image: 'ubuntu-22-04',
      profile: 'standard',
      scope: 'sub-shared',
    });
    expect(wrong.diagnostic()!.mismatches.map((r) => r.field)).toEqual([
      'image',
      'profile',
      'subscriptionId',
    ]);
  });
  it('holds original result after later deletion and replacement with different configuration', () => {
    const f = fixture('guided', { profile: 'small' }),
      pinned = f.diagnostic(),
      oldSave = JSON.stringify(f.save());
    f.send({ type: 'DeleteVmBundle', vmId: f.vm });
    expect(f.engine().world.infrastructure.some((r) => r.id === f.vm)).toBe(false);
    f.send({
      type: 'CreateVmBundle',
      groupId: pinned!.resource!.groupId,
      name: 'vm-new-correct',
      region: 'northeurope',
      image: 'ubuntu-22-04',
      profile: 'standard',
      dataDiskGiB: '32',
      subnetId: '',
    });
    expect(f.diagnostic()).toEqual(pinned);
    expect(JSON.stringify(f.save())).toBe(oldSave);
  });
  it('uses original archived attempt after reset, missing/corrupt archives never justify current resources', () => {
    const f = fixture('guided', { profile: 'small' }),
      values = new Map<string, string>();
    const store = new SandboxStore({
      getItem: (k) => values.get(k) ?? null,
      setItem: (k, v) => {
        values.set(k, v);
      },
      removeItem: (k) => {
        values.delete(k);
      },
    });
    store.load();
    for (const entry of f.engine().ledger)
      expect(store.dispatch({ kind: 'command', request: entry.request, bindResult: false })).toBe(
        true,
      );
    expect(store.restart()).toBe(true);
    const archive = store.engineFor(1)!;
    expect(vmDebrief(f.current(), missionEvaluation(f.current(), archive, 1))).toEqual(
      f.diagnostic(),
    );
    expect(
      vmDebrief(f.current(), missionEvaluation(f.current(), store.getSnapshot().attempt.engine, 2)),
    ).toBeNull();
    expect(store.restart()).toBe(true);
    expect(store.engineFor(1)).toBeUndefined();
    expect(
      vmDebrief(f.current(), missionEvaluation(f.current(), store.getSnapshot().attempt.engine, 3)),
    ).toBeNull();
    const raw = JSON.parse(values.get(sandboxKey)!);
    raw.archive[0].commands = [{ bad: true }];
    values.set(sandboxKey, JSON.stringify(raw));
    store.load();
    expect(store.getSnapshot().issue).toBe('corrupt');
  });
  it('rejects a missing or corrupt replay instead of reconstructing technical success', () => {
    const f = fixture();
    const broken = structuredClone(f.engine());
    broken.ledger[1]!.receipt.addedIds = ['wrong-vm'];
    expect(vmDebrief(f.current(), missionEvaluation(f.current(), broken, 1))).toBeNull();
    expect(
      vmDebrief(
        { ...f.current(), through: 'absent' },
        missionEvaluation({ ...f.current(), through: 'absent' }, f.engine(), 1),
      ),
    ).toBeNull();
  });
  it('retains incomplete first submission through explicit correct guided retry', () => {
    const f = fixture('guided', { profile: 'small' }),
      first = f.current(),
      prefix = structuredClone(f.save());
    f.event({
      type: 'start',
      mission: 'infrastructure',
      mode: 'guided',
      attempt: 1,
      boundary: f.receipt.commandId,
    });
    const r = f.send({
      type: 'CreateVmBundle',
      groupId: f.diagnostic()?.resource?.groupId ?? f.engine().world.groups.at(-1)!.id,
      name: 'vm-retry',
      region: 'northeurope',
      image: 'ubuntu-22-04',
      profile: 'standard',
      dataDiskGiB: '32',
      subnetId: '',
    });
    f.event({ type: 'select', target: r.addedIds[0]! });
    for (const id of missionEvaluation(f.current(), f.engine(), 1).refs)
      f.event({ type: 'inspect', ref: `resource:${id}` });
    f.event({ type: 'inspect', ref: `receipt:${r.commandId}` });
    for (const field of ['decision', 'reason'] as const)
      f.event({ type: 'answer', field, value: missionAnswerIds(f.current())[field][0]! });
    f.event({ type: 'submit', through: r.commandId });
    expect(f.result().complete).toBe(true);
    expect(f.save().events.slice(0, prefix.events.length)).toEqual(prefix.events);
    expect(
      vmDebrief(first, missionEvaluation(first, f.engine(), 1))!.mismatches.map((r) => r.field),
    ).toEqual(['profile']);
  });
  it('does not reveal a live unsubmitted independent comparison or invent another mission result', () => {
    const f = fixture('independent');
    expect(vmDebrief({ ...f.current(), status: 'active' }, f.result())).toBeNull();
    expect(vmDebrief({ ...f.current(), mission: 'platform' }, f.result())).toBeNull();
    expect(vmDebrief({ ...f.current(), status: 'abandoned' }, f.result())).toBeNull();
  });
  it('never substitutes a newer VM for an absent historical target or upgrades missing explanations', () => {
    const f = fixture();
    const unrelated = { ...f.current(), target: 'different-vm' };
    const result = missionEvaluation(unrelated, f.engine(), 1);
    const diagnostic = vmDebrief(unrelated, result)!;
    expect(diagnostic.resource).toBeNull();
    expect(diagnostic.receiptId).toBeNull();
    expect(diagnostic.complete).toBe(false);
    expect(diagnostic.rows.every((row) => row.actual === null)).toBe(true);
    const unfinished = {
      ...f.current(),
      status: 'active' as const,
      answers: { decision: null, reason: null },
    };
    const activeResult = missionEvaluation(unfinished, f.engine(), 1);
    expect(activeResult.checks.decision).toBe(false);
    expect(activeResult.checks.reason).toBe(false);
    expect(activeResult.complete).toBe(false);
    expect(vmDebrief(unfinished, activeResult)).toBeNull();
  });
});
