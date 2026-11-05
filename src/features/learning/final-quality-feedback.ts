import { finalQualityNb, networkingNb } from '@/content/nb';
import { runPeering, type PeeringInput } from '@/domain/curriculum/networking-model';

/** Explain the selected pair's existing result; never changes the model or its outcome. */
export function peeringResultText(input: PeeringInput) {
  const result = runPeering(input)!;
  const pair = result.links.find((link) => link.pair === `a${input.destination}`)!;
  const copy = finalQualityNb.peering;
  if (pair.conflict) return copy.overlap;
  if (pair.status === 'initiated') return copy.oneSide;
  if (pair.status === 'missing')
    return input.destination === 'c' &&
      result.links.filter((link) => link.pair !== 'ac').every((link) => link.status === 'connected')
      ? networkingNb.model.peeringMissing
      : copy.missing;
  if (!result.subnet) return copy.subnet;
  if (!result.knownPath) return copy.route;
  if (input.access === 'deny') return copy.denied;
  if (input.access === 'unknown') return copy.unknown;
  return networkingNb.model.logical;
}
