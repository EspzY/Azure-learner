/** Isolated 3.1A illustration: no commands, persistence or learning evidence. */
export const proofVersion = 'capacity-proof@1' as const;
export const allocations = [4, 6, 10] as const;
export type Allocation = (typeof allocations)[number];
export const workedDemand = [2, 2, 2, 2] as const;
export const campaignDemand = [3, 3, 8, 3] as const;
export function capacityProof(raw: unknown) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const input = raw as Record<string, unknown>;
  if (
    Object.keys(input).sort().join(',') !== 'allocation,demand' ||
    !allocations.includes(input.allocation as Allocation) ||
    !Array.isArray(input.demand) ||
    input.demand.length !== 4 ||
    input.demand.some((d) => typeof d !== 'number' || !Number.isInteger(d) || d < 0 || d > 12)
  )
    return null;
  const allocation = input.allocation as Allocation;
  const periods = input.demand.map((demand: number) => ({
    demand,
    allocation,
    served: Math.min(demand, allocation),
    unused: Math.max(0, allocation - demand),
    unmet: Math.max(0, demand - allocation),
  }));
  return {
    version: proofVersion,
    allocation,
    periods,
    peakUnmet: Math.max(...periods.map((p) => p.unmet)),
    unusedTotal: periods.reduce((sum, p) => sum + p.unused, 0),
  };
}
export type ProofResult = NonNullable<ReturnType<typeof capacityProof>>;
export function parsePrediction(raw: string): number | null {
  return /^(0|[1-9]|1[0-2])$/.test(raw) ? Number(raw) : null;
}
