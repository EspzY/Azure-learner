import { describe, expect, it } from 'vitest';
import {
  detourCompleted,
  detours,
  emptyExpedition,
  evaluateDetour,
  parseExpedition,
  recordAttempt,
  replayCommands,
  responsibility,
  routeGraph,
  stops,
  validAnswer,
} from './expedition';
import { initialSimulation, missionSatisfied } from './simulation';
import { awardProgress, emptyProgress, totalXp } from './progression';

describe('bounded expedition learning rules', () => {
  it('keeps route, detour and authored return references inside the supported route graph', () => {
    for (const route of Object.values(routeGraph)) {
      if (route.next) expect(stops).toContain(route.next);
      if (route.previous) expect(stops).toContain(route.previous);
    }
    for (const detour of detours) {
      expect(routeGraph[detour.trigger].kind).toBe('detour');
      expect(routeGraph[detour.trigger].next).toBe(detour.returnTo);
    }
  });
  it('changes operating responsibility without surrendering customer data and identity', () => {
    expect(responsibility('iaas', 'os')).toBe('customer');
    expect(responsibility('paas', 'os')).toBe('microsoft');
    expect(responsibility('paas', 'application')).toBe('shared');
    expect(responsibility('saas', 'application')).toBe('shared');
    expect(responsibility('paas', 'network')).toBe('shared');
    for (const model of ['iaas', 'paas', 'saas'] as const) {
      expect(responsibility(model, 'data')).toBe('customer');
      expect(responsibility(model, 'identity')).toBe('customer');
      expect(responsibility(model, 'settings')).toBe('customer');
      expect(responsibility(model, 'physical')).toBe('microsoft');
    }
  });
  it('distinguishes a service decision from exact multi-select ownership allocation', () => {
    expect(evaluateDetour('service-fit', 'paas')).toBe(true);
    expect(evaluateDetour('service-fit', 'iaas')).toBe(false);
    expect(evaluateDetour('service-fit', 'saas')).toBe(false);
    expect(evaluateDetour('retained-control', 'data,identity')).toBe(true);
    for (const wrong of ['', 'data', 'data,identity,os', 'os,physical'])
      expect(evaluateDetour('retained-control', wrong)).toBe(false);
    expect(validAnswer('retained-control', 'identity,data')).toBe(false);
    expect(validAnswer('retained-control', 'data,data')).toBe(false);
    expect(validAnswer('service-fit', '<script>')).toBe(false);
  });
  it('records attempts and preserves completion across bounded retries without awarding XP', () => {
    let state = recordAttempt(emptyExpedition, 'service-fit', 'iaas');
    expect(detourCompleted(state, 'service-fit')).toBe(false);
    state = recordAttempt(state, 'service-fit', 'paas');
    for (let i = 0; i < 100; i++) state = recordAttempt(state, 'service-fit', 'saas');
    expect(state.attempts['service-fit']).toHaveLength(20);
    expect(detourCompleted(parseExpedition(JSON.stringify(state)), 'service-fit')).toBe(true);
    expect(recordAttempt(state, 'service-fit', 'invalid')).toBe(state);
    expect(
      detours.every(
        (detour) => detour.reward === 0 && detour.assistance === 'explain-after-attempt',
      ),
    ).toBe(true);
    const progress = awardProgress(
      awardProgress(emptyProgress, 'organization-mission-v1'),
      'organization-mission-v1',
    );
    expect(totalXp(progress)).toBe(80);
  });
  it('does not infer learning completion from visiting every destination', () => {
    const state = { ...emptyExpedition, stop: 'horizon' as const };
    expect(detourCompleted(state, 'service-fit')).toBe(false);
    expect(missionSatisfied(replayCommands(state.commands))).toBe(false);
  });
});
describe('untrusted local expedition snapshots', () => {
  const command = { name: 'rg-azurelab-dev', region: 'norwayeast', subscriptionId: 'sub' };
  it('reconstructs the exact domain state using accepted commands only', () => {
    const state = parseExpedition(
      JSON.stringify({
        ...emptyExpedition,
        stop: 'gateway',
        model: 'paas',
        missionActive: true,
        commands: [command],
        simulation: { scopes: [{ id: 'forged' }] },
        xp: 9999,
      }),
    );
    expect(state.commands).toEqual([command]);
    expect(replayCommands(state.commands)).toEqual(replayCommands(state.commands));
    expect(missionSatisfied(replayCommands(state.commands))).toBe(true);
    expect(replayCommands(state.commands).scopes).toHaveLength(9);
    expect(state.stop).toBe('gateway');
  });
  it('retains a valid command prefix, rejects fabricated technical configurations and caps sizes', () => {
    const state = parseExpedition(
      JSON.stringify({
        ...emptyExpedition,
        commands: [command, { ...command, name: 'bad/name' }, { ...command, name: 'later' }],
      }),
    );
    expect(state.commands).toEqual([command]);
    for (const commands of [
      [{ ...command, region: 'moon' }],
      [{ ...command, subscriptionId: 'tenant' }],
      [command, command, command, command],
      [null],
    ]) {
      expect(parseExpedition(JSON.stringify({ ...emptyExpedition, commands })).commands).toEqual(
        [],
      );
    }
    expect(replayCommands([command, command])).toEqual(initialSimulation);
  });
  it.each([null, '', '{broken', 'null', '[]', '42', '{"version":2}', 'x'.repeat(24001)])(
    'fails safely for corrupt input %s',
    (raw) => expect(parseExpedition(raw)).toEqual(emptyExpedition),
  );
  it('filters forged completion/evidence and unsupported answer IDs rather than trusting scores', () => {
    const state = parseExpedition(
      JSON.stringify({
        ...emptyExpedition,
        stop: 'unknown',
        model: 'unknown',
        layer: 'unknown',
        missionActive: 'true',
        attempts: {
          'service-fit': [{ answer: 'iaas', correct: true }, null, { answer: 'unknown' }],
          'retained-control': [{ answer: 'data,identity', correct: false }],
        },
      }),
    );
    expect(state.stop).toBe('arrival');
    expect(state.model).toBe('iaas');
    expect(state.layer).toBe('os');
    expect(state.missionActive).toBe(false);
    expect(detourCompleted(state, 'service-fit')).toBe(false);
    expect(detourCompleted(state, 'retained-control')).toBe(true);
  });
});
