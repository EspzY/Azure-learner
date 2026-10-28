import type { ComputeTopic } from './compute';
const definition = (
  family: string,
  objectives: ('CP01' | 'CP02' | 'CP03' | 'CP04')[],
  accepted: readonly (readonly [number, number])[],
  repeat: ComputeTopic,
  sources: string[],
) => ({
  family,
  objectives,
  accepted,
  repeat,
  sources,
  itemVersion: '1.0.0',
  variant: 'v1',
  rubricVersion: '1.0.0',
});
/** Item IDs/versions are separate from certification slots. Accepted relationships are not DOM metadata. */
export const computeItems = {
  cp01: definition('compute-control', ['CP01'], [[2, 0]], 'containers', ['PS11', 'PS24', 'PS25']),
  cp02: definition('compute-events', ['CP01'], [[0, 2]], 'functions', ['PS27', 'PS28']),
  cp03: definition('compute-lifecycle', ['CP01'], [[1, 0]], 'containers', ['PS21', 'PS24', 'PS25']),
  cp04: definition('vm-fleet', ['CP02'], [[1, 2]], 'options', ['PS14', 'PS15', 'PS16']),
  cp05: definition('vm-boundaries', ['CP02'], [[2, 1]], 'resilience', ['PS12', 'PS13']),
  cp06: definition('desktop-publication', ['CP02'], [[0, 2]], 'desktop', ['PS17', 'PS18']),
  cp07: definition('desktop-assignment', ['CP02'], [[1, 0]], 'desktop', ['PS18', 'PS19']),
  cp08: definition('vm-storage', ['CP03'], [[2, 1]], 'dependencies', ['PS11', 'PS32']),
  cp09: definition('vm-network', ['CP03'], [[0, 2]], 'dependencies', ['PS33', 'PS35']),
  cp10: definition('hosting-orchestration', ['CP04'], [[1, 0]], 'hosting', [
    'PS22',
    'PS23',
    'PS29',
  ]),
  cp11: definition('hosting-authorized-reuse', ['CP04'], [[0, 1]], 'hosting', [
    'PS20',
    'PS23',
    'PS30',
    'PS31',
  ]),
  cp12: definition(
    'hosting-batch',
    ['CP04'],
    [
      [0, 2],
      [2, 0],
    ],
    'hosting',
    ['PS06', 'PS23', 'PS37', 'PS38'],
  ),
  cp13: definition('vm-app-availability', ['CP02'], [[0, 1]], 'resilience', [
    'PS12',
    'PS14',
    'PS16',
  ]),
  cp14: definition('vm-configuration', ['CP03'], [[1, 2]], 'dependencies', [
    'PS11',
    'PS32',
    'PS33',
  ]),
} as const;
export type ComputeItemId = keyof typeof computeItems;
export const computeItemIds = Object.keys(computeItems) as ComputeItemId[];
export interface ComputeAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateCompute(item: ComputeItemId, answer: ComputeAnswer) {
  const d = computeItems[item],
    pairs: readonly (readonly [number, number])[] = d.accepted;
  const relation = pairs.some((p) => p[0] === answer.decision && p[1] === answer.reason);
  return {
    decision: pairs.some((p) => p[0] === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`compute.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
