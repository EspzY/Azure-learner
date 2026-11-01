import type { MigrationTopic } from './migration';
export const migrationItems = {
  fm01: {
    family: 'movement-rollback-content-versus-timestamp-and-retention',
    variant: 'movement-rollback-content-versus-timestamp-and-retention-constraints-v1',
    objectives: ['MOVE01'],
    repeat: 'azcopy',
    sources: ['FM04', 'FM05', 'FM06', 'FM09'],
    accepted: [[1, 0]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  fm02: {
    family: 'movement-management-plus-data-versus-scoped-data-access',
    variant: 'movement-management-plus-data-versus-scoped-data-access-constraints-v1',
    objectives: ['MOVE01'],
    repeat: 'explorer',
    sources: ['FM08', 'FM05', 'FM17'],
    accepted: [
      [0, 1],
      [2, 1],
    ],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  fm03: {
    family: 'movement-partial-recall-and-policy-change-offline-boundary',
    variant: 'movement-partial-recall-and-policy-change-offline-boundary-constraints-v1',
    objectives: ['MOVE01'],
    repeat: 'file-sync',
    sources: ['FM09', 'FM16', 'FM17', 'FM32', 'FM35'],
    accepted: [[2, 2]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  fm04: {
    family: 'movement-new-share-version-and-smb-preservation',
    variant: 'movement-new-share-version-and-smb-preservation-constraints-v1',
    objectives: ['MOVE01'],
    repeat: 'azcopy',
    sources: ['FM05', 'FM07', 'FM19', 'FM21'],
    accepted: [[1, 1]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  fm05: {
    family: 'migration-configuration-import-matches-as-is-assessment',
    variant: 'migration-configuration-import-matches-as-is-assessment-constraints-v1',
    objectives: ['MOVE02'],
    repeat: 'migrate',
    sources: ['FM11', 'FM12', 'FM36', 'FM37'],
    accepted: [[0, 0]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  fm06: {
    family: 'migration-complementary-physical-server-and-separate-archive',
    variant: 'migration-complementary-physical-server-and-separate-archive-constraints-v1',
    objectives: ['MOVE02'],
    repeat: 'migrate',
    sources: ['FM11', 'FM12', 'FM13', 'FM29'],
    accepted: [[1, 2]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  fm07: {
    family: 'migration-full-stage-time-and-availability-offset',
    variant: 'migration-full-stage-time-and-availability-offset-constraints-v1',
    objectives: ['MOVE02'],
    repeat: 'databox',
    sources: ['FM13', 'FM14', 'FM23', 'FM24'],
    accepted: [[0, 1]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  fm08: {
    family: 'migration-delta-capture-versus-write-fence',
    variant: 'migration-delta-capture-versus-write-fence-constraints-v1',
    objectives: ['MOVE02'],
    repeat: 'validation',
    sources: ['FM11', 'FM12', 'FM13', 'FM24', 'FM37'],
    accepted: [
      [1, 2],
      [2, 2],
    ],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  fm09: {
    family: 'movement-graphical-approval-to-unattended-pipeline',
    variant: 'movement-graphical-approval-to-unattended-pipeline-v1',
    objectives: ['MOVE01'],
    repeat: 'methods',
    sources: ['FM04', 'FM05', 'FM08', 'FM21'],
    accepted: [[2, 0]],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
  fm10: {
    family: 'movement-retired-server-relationship-cache-and-one-off-directional-job',
    variant: 'movement-retired-server-relationship-cache-and-one-off-directional-job-v1',
    objectives: ['MOVE01'],
    repeat: 'file-sync',
    sources: ['FM04', 'FM05', 'FM07', 'FM09', 'FM10', 'FM16', 'FM17', 'FM32', 'FM35'],
    accepted: [
      [1, 2],
      [2, 2],
    ],
    itemVersion: '1.0.0',
    rubricVersion: '1.0.0',
  },
} as const;
export type MigrationItemId = keyof typeof migrationItems;
export const migrationItemIds = Object.keys(migrationItems) as MigrationItemId[];
export interface MigrationAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateMigration(item: MigrationItemId, answer: MigrationAnswer) {
  const pairs: readonly (readonly [number, number])[] = migrationItems[item].accepted;
  const relation = pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
  return {
    decision: pairs.some(([d]) => d === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`migration.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
export const migrationRepeats: Record<MigrationItemId, MigrationTopic> = Object.fromEntries(
  migrationItemIds.map((id) => [id, migrationItems[id].repeat]),
) as Record<MigrationItemId, MigrationTopic>;
