import { describe, expect, it } from 'vitest';
import { finalQualityNb as copy, networkingNb } from '@/content/nb';
import {
  initialPeering,
  runPeering,
  type PeeringInput,
} from '@/domain/curriculum/networking-model';
import { initialDesktop, runDesktop } from '@/domain/curriculum/compute-model';
import { peeringResultText } from './final-quality-feedback';

describe('diagnostic display over the unchanged models', () => {
  it('explains overlap on selected A–B even while A–C is Connected', () => {
    const input: PeeringInput = {
      ...initialPeering,
      configured: ['ab', 'ba', 'bc', 'cb', 'ac', 'ca'],
      overlap: true,
      destination: 'b',
    };
    const snapshot = JSON.stringify(input),
      before = runPeering(input);
    expect(before?.links.find((l) => l.pair === 'ac')?.status).toBe('connected');
    expect(before?.links.find((l) => l.pair === 'ab')?.status).toBe('overlap');
    expect(peeringResultText(input)).toBe(copy.peering.overlap);
    expect(peeringResultText(input)).not.toContain('A–C');
    expect(runPeering(input)).toEqual(before);
    expect(JSON.stringify(input)).toBe(snapshot);
  });

  it('distinguishes actual missing side, nontransitivity, scope, route and access causes', () => {
    const connected: PeeringInput = {
      ...initialPeering,
      configured: ['ab', 'ba', 'bc', 'cb'],
      destination: 'b',
      overlap: false,
      scope: 'whole',
      route: 'declared',
      access: 'allow',
    };
    const cases: [Partial<PeeringInput>, string, number][] = [
      [{ configured: [] }, copy.peering.missing, 0],
      [{ configured: ['ab'] }, copy.peering.oneSide, 0],
      [{ destination: 'c' }, networkingNb.model.peeringMissing, 0],
      [{ scope: 'selected', participating: false }, copy.peering.subnet, 0],
      [{ route: 'unknown' }, copy.peering.route, 1],
      [{ access: 'deny' }, copy.peering.denied, 1],
      [{ access: 'unknown' }, copy.peering.unknown, 1],
    ];
    for (const [changes, explanation, outcome] of cases) {
      const input = { ...connected, ...changes };
      expect(peeringResultText(input)).toBe(explanation);
      expect(runPeering(input)?.outcome).toBe(outcome);
    }
    expect(runPeering(connected)?.permitted).toBe(true);
  });

  it('labels the original AVD outcomes without implying a running desktop', () => {
    const base = { ...initialDesktop, linked: true, assigned: true };
    for (const [changes, outcome, published, backed] of [
      [{ linked: false }, 0, false, false],
      [{ hosts: 0 }, 1, true, false],
      [{ hosts: 2 }, 2, true, true],
    ] as const) {
      const result = runDesktop({ ...base, ...changes });
      expect(result).toMatchObject({ outcome, published, backed });
      expect(copy.avdPredictions[outcome + 1]).toContain(
        outcome === 0 ? 'ikke oppfylt' : outcome === 1 ? 'uten deklarert' : 'med deklarert',
      );
    }
  });
});
