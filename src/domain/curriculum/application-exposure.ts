import { networkingKey, restoreNetworking, networkingFacts } from './networking';
import { storageKey, restoreStorage, storageFacts } from './storage';
import { costKey, restoreCost, costFacts } from './cost';
import { transferKey, restoreTransfer, transferFacts } from './transfer';
import type { ApplicationExposure, ApplicationGroup, ExposureBank } from './application-transfer';

/** Explicit conservative relatedness, not a semantic matcher or a change to old family IDs.
 * Pinned in the NEW begin only. Absence in these local records never proves unseen knowledge. */
export function applicationExposure(
  group: ApplicationGroup,
  read: (key: string) => string | null,
): ApplicationExposure {
  const result: ApplicationExposure = { related: [], uncertain: [] };
  const check = (bank: ExposureBank, known: () => boolean | null) => {
    try {
      const value = known();
      if (value === null) result.uncertain.push(bank);
      else if (value) result.related.push(bank);
    } catch {
      result.uncertain.push(bank);
    }
  };
  if (group === 'networking')
    check('networking', () => {
      const r = restoreNetworking(read(networkingKey));
      if (r.issue) return null;
      const f = networkingFacts(r.save);
      return (
        f.attempts.some((a) => a.family === 'network-dns') ||
        f.guided.some((g) => g.mission === 'dns')
      );
    });
  if (group === 'storage')
    check('storage', () => {
      const r = restoreStorage(read(storageKey));
      if (r.issue) return null;
      const f = storageFacts(r.save);
      return (
        f.attempts.some((a) => ['shared-files', 'object-file'].includes(a.family)) ||
        f.guided.some((g) => g.mission === 'design')
      );
    });
  if (group === 'cost') {
    check('cost', () => {
      const r = restoreCost(read(costKey));
      if (r.issue) return null;
      const f = costFacts(r.save);
      return (
        f.attempts.some((a) => a.family === 'optimization') ||
        f.guided.some((g) => g.mission === 'estimate')
      );
    });
    check('cloud-transfer', () => {
      const r = restoreTransfer(read(transferKey));
      return r.issue ? null : transferFacts(r.save).attempts.some((a) => a.family === 'pricing');
    });
  }
  result.related.sort();
  result.uncertain.sort();
  return result;
}
