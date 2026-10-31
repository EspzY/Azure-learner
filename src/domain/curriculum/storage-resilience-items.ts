import type { ResilienceTopic } from './storage-resilience';
const definition = (
  family: string,
  variant: string,
  objectives: ('STB01' | 'STB02')[],
  pair: readonly [number, number],
  repeat: ResilienceTopic,
  sources: string[],
) => ({
  family,
  variant,
  objectives,
  accepted: [pair],
  repeat,
  sources,
  itemVersion: '1.0.0',
  rubricVersion: '1.0.0',
});
/** Original fixed first-attempt relations. No historical rubric is reinterpreted. */
export const resilienceItems = {
  rb01: definition('tier-selection', 'rare-online-priority', ['STB01'], [1, 2], 'tiers', [
    'SB03',
    'SB12',
  ]),
  rb02: definition('tier-selection', 'short-project-total', ['STB01'], [2, 0], 'tiers', ['SB03']),
  rb03: definition('archive-workflow', 'retain-early-source', ['STB01'], [0, 1], 'lifecycle', [
    'SB03',
    'SB05',
  ]),
  rb04: definition(
    'tier-inheritance',
    'existing-inferred-explicit',
    ['STB01'],
    [2, 0],
    'lifecycle',
    ['SB03', 'SB07'],
  ),
  rb05: definition(
    'combined-constraints',
    'online-zone-retained',
    ['STB01', 'STB02'],
    [1, 2],
    'boundaries',
    ['SB03', 'SB04'],
  ),
  rb06: definition('physical-boundary', 'single-region-zone', ['STB02'], [0, 1], 'redundancy', [
    'SB04',
    'SB23',
  ]),
  rb07: definition('physical-boundary', 'zone-and-region', ['STB02'], [0, 2], 'redundancy', [
    'SB04',
    'SB08',
  ]),
  rb08: definition('secondary-access', 'read-before-failover', ['STB02'], [2, 1], 'recovery', [
    'SB04',
    'SB08',
    'SB21',
  ]),
  rb09: definition('recovery-boundary', 'propagated-deletion', ['STB02'], [1, 0], 'recovery', [
    'SB04',
    'SB17',
  ]),
  rb10: definition('service-boundary', 'ssd-share-and-disk', ['STB02'], [0, 2], 'boundaries', [
    'SB14',
    'SB15',
    'SB18',
  ]),
} as const;
export type ResilienceItemId = keyof typeof resilienceItems;
export const resilienceItemIds = Object.keys(resilienceItems) as ResilienceItemId[];
export interface ResilienceAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateResilience(item: ResilienceItemId, answer: ResilienceAnswer) {
  const pairs: readonly (readonly [number, number])[] = resilienceItems[item].accepted;
  const relation = pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
  return {
    decision: pairs.some(([d]) => d === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`resilience.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
