import { describe, expect, it } from 'vitest';
import {
  allocations,
  campaignDemand,
  capacityProof,
  parsePrediction,
  workedDemand,
} from './capacity';
describe('isolated design-proof arithmetic', () => {
  it('conserves demand and allocation per hour, deterministically without mutation', () => {
    for (const allocation of allocations)
      for (let d = 0; d <= 12; d++) {
        const input = { allocation, demand: [d, 0, 12, 3] },
          copy = structuredClone(input);
        const result = capacityProof(input)!;
        expect(capacityProof(input)).toEqual(result);
        expect(input).toEqual(copy);
        for (const p of result.periods) {
          expect(p.served + p.unmet).toBe(p.demand);
          expect(p.served + p.unused).toBe(p.allocation);
        }
      }
  });
  it('separates worked and new scenarios and calculates the capacity tradeoff', () => {
    const worked = capacityProof({ allocation: 6, demand: workedDemand })!;
    const campaign = capacityProof({ allocation: 6, demand: campaignDemand })!;
    const expanded = capacityProof({ allocation: 10, demand: campaignDemand })!;
    expect(worked.peakUnmet).toBe(0);
    expect(worked.periods[0]!.unused).toBe(4);
    expect(campaign.peakUnmet).toBe(2);
    expect(campaign.unusedTotal).toBe(9);
    expect(expanded.peakUnmet).toBe(0);
    expect(expanded.unusedTotal).toBe(23);
    expect(campaign.periods[2]).toEqual({
      demand: 8,
      allocation: 6,
      served: 6,
      unused: 0,
      unmet: 2,
    });
  });
  it('rejects invalid shapes, values, allocations and predictions', () => {
    for (const raw of [
      null,
      [],
      {},
      { allocation: 5, demand: campaignDemand },
      { allocation: 6, demand: [1, 2, 3] },
      { allocation: 6, demand: [0, -1, 1, 2] },
      { allocation: 6, demand: [0, NaN, 1, 2] },
      { allocation: 6, demand: [0, 1.5, 1, 2] },
      { allocation: 6, demand: [0, '2', 1, 2] },
      { allocation: 6, demand: campaignDemand, success: true },
    ])
      expect(capacityProof(raw)).toBeNull();
    for (const raw of ['', '-1', '1.5', '13', ' 2', '2e0', '02'])
      expect(parsePrediction(raw)).toBeNull();
    expect(parsePrediction('0')).toBe(0);
    expect(parsePrediction('12')).toBe(12);
  });
});
