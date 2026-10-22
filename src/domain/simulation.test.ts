import { describe, expect, it } from 'vitest';
import { createResourceGroup, initialSimulation, missionSatisfied } from './simulation';

const command = { name: 'rg-azurelab-dev', region: 'norwayeast', subscriptionId: 'sub' };
describe('resource group simulation', () => {
  it('creates deterministic state without mutating input', () => {
    const before = JSON.stringify(initialSimulation);
    const first = createResourceGroup(initialSimulation, command);
    expect(first).toEqual(createResourceGroup(initialSimulation, command));
    expect(JSON.stringify(initialSimulation)).toBe(before);
    expect(first.ok).toBe(true);
    if (!first.ok) throw new Error('Expected success');
    expect(first.created).toEqual({
      id: 'created-group-1',
      kind: 'group',
      label: command.name,
      region: command.region,
      parentId: 'sub',
    });
    expect(missionSatisfied(first.state)).toBe(true);
  });
  it.each(['', 'bad/name', 'name.', 'a'.repeat(91), 'spaces inside', '<script>'])(
    'rejects invalid name %s',
    (name) => {
      expect(createResourceGroup(initialSimulation, { ...command, name })).toEqual({
        ok: false,
        error: 'invalid-name',
      });
    },
  );
  it.each(['rg-æøå', 'demo_(test).1', 'a'.repeat(90)])(
    'accepts supported Azure group naming %s',
    (name) => {
      expect(createResourceGroup(initialSimulation, { ...command, name }).ok).toBe(true);
    },
  );
  it('trims names and checks case-insensitive uniqueness within subscription', () => {
    expect(createResourceGroup(initialSimulation, { ...command, name: ' RG-WEBAPP-DEV ' })).toEqual(
      { ok: false, error: 'duplicate' },
    );
    const otherSubscription = {
      ...initialSimulation,
      scopes: [
        ...initialSimulation.scopes,
        { id: 'other-sub', kind: 'subscription' as const, label: 'Other', parentId: 'mg' },
      ],
    };
    expect(
      createResourceGroup(otherSubscription, {
        ...command,
        name: 'rg-webapp-dev',
        subscriptionId: 'other-sub',
      }).ok,
    ).toBe(true);
  });
  it('rejects unsupported regions and non-subscription parents', () => {
    expect(createResourceGroup(initialSimulation, { ...command, region: 'moon' })).toEqual({
      ok: false,
      error: 'invalid-region',
    });
    for (const subscriptionId of ['rg-app', 'tenant', 'mg', 'missing'])
      expect(createResourceGroup(initialSimulation, { ...command, subscriptionId })).toEqual({
        ok: false,
        error: 'invalid-parent',
      });
  });
  it('requires all mission conditions rather than any created group', () => {
    expect(missionSatisfied(initialSimulation)).toBe(false);
    for (const variant of [
      { ...command, name: 'rg-other' },
      { ...command, region: 'westeurope' },
    ]) {
      const result = createResourceGroup(initialSimulation, variant);
      if (!result.ok) throw new Error('Expected success');
      expect(missionSatisfied(result.state)).toBe(false);
    }
  });
  it('bounds the sandbox and allows replay from the same initial state', () => {
    let state = initialSimulation;
    for (let i = 1; i <= 3; i++) {
      const result = createResourceGroup(state, { ...command, name: `rg-${i}` });
      if (!result.ok) throw new Error('Expected success');
      state = result.state;
    }
    expect(createResourceGroup(state, command)).toEqual({ ok: false, error: 'limit' });
    expect(createResourceGroup(initialSimulation, command).ok).toBe(true);
  });
  it('keeps resource geography separate from group metadata', () => {
    const app = initialSimulation.scopes.find((item) => item.id === 'app')!;
    const group = initialSimulation.scopes.find((item) => item.id === app.parentId)!;
    expect(app.region).toBe('westeurope');
    expect(group.region).toBe('norwayeast');
  });
});
