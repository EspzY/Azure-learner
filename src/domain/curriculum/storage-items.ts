import type { StorageTopic } from './storage';
const definition = (
  family: string,
  variant: string,
  objectives: ('SG01' | 'SG02' | 'SG03' | 'SG04')[],
  accepted: readonly (readonly [number, number])[],
  repeat: StorageTopic,
  sources: string[],
) => ({
  family,
  variant,
  objectives,
  accepted,
  repeat,
  sources,
  itemVersion: '1.0.0',
  rubricVersion: '1.0.0',
});
/** Original item relations. Never reinterpret historical firsts after later revisions. */
export const storageItems = {
  sa01: definition('object-file', 'http-media', ['SG01'], [[1, 2]], 'blob', [
    'SS09',
    'SS10',
    'SS19',
  ]),
  sa02: definition('shared-files', 'unchanged-smb-client', ['SG01'], [[0, 1]], 'files', [
    'SS11',
    'SS12',
  ]),
  sa03: definition('object-file', 'changed-mount-contract', ['SG01'], [[2, 0]], 'files', [
    'SS10',
    'SS11',
  ]),
  sa04: definition(
    'asynchronous-work',
    'visibility-expires-while-worker-alive',
    ['SG02'],
    [[1, 0]],
    'queues',
    ['SS13', 'SS14', 'SS15'],
  ),
  sa05: definition('keyed-data', 'two-part-key', ['SG02'], [[2, 1]], 'tables', ['SS16', 'SS17']),
  sa06: definition('keyed-data', 'relational-constraints', ['SG02'], [[0, 2]], 'tables', [
    'SS16',
    'SS17',
  ]),
  sa07: definition(
    'account-services',
    'premium-object-plus-queue',
    ['SG03'],
    [[2, 2]],
    'accounts',
    ['SS08', 'SS20'],
  ),
  sa08: definition('account-services', 'classic-nfs-plus-queue', ['SG03'], [[0, 1]], 'accounts', [
    'SS12',
    'SS21',
  ]),
  sa09: definition('account-services', 'blob-type-premium', ['SG03'], [[1, 0]], 'accounts', [
    'SS08',
    'SS10',
  ]),
  sa10: definition('disk-contract', 'vm-block-volume', ['SG04'], [[0, 2]], 'disks', ['SS18']),
  sa11: definition('disk-contract', 'external-object-export', ['SG04'], [[2, 1]], 'disks', [
    'SS10',
    'SS18',
    'SS19',
  ]),
  sa12: definition('shared-files', 'two-client-sharing', ['SG01', 'SG04'], [[1, 0]], 'disks', [
    'SS11',
    'SS18',
  ]),
} as const;
export type StorageItemId = keyof typeof storageItems;
export const storageItemIds = Object.keys(storageItems) as StorageItemId[];
export interface StorageAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateStorage(item: StorageItemId, answer: StorageAnswer) {
  const pairs: readonly (readonly [number, number])[] = storageItems[item].accepted;
  const relation = pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
  return {
    decision: pairs.some(([d]) => d === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`storage.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
