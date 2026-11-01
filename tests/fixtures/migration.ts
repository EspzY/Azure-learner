import {
  initialMigration,
  type MethodInput,
  type SyncInput,
  type PlanningInput,
} from '../../src/domain/curriculum/migration-model';
export const method = (v: Partial<MethodInput> = {}) =>
  ({ ...initialMigration('method'), ...v }) as MethodInput;
export const sync = (v: Partial<SyncInput> = {}) =>
  ({ ...initialMigration('sync'), ...v }) as SyncInput;
export const planning = (v: Partial<PlanningInput> = {}) =>
  ({ ...initialMigration('planning'), ...v }) as PlanningInput;
const scheduled = { cadence: 'scheduled' as const, interface: 'scripted' as const };
const hybrid = {
  dataset: 'documents' as const,
  destination: 'files-smb' as const,
  cadence: 'hybrid' as const,
  tool: 'file-sync' as const,
};
const physical = { dependencies: true, strategy: 'physical' as const };
export const migrationContrasts = {
  method: [
    method(),
    method({ tool: 'explorer' }),
    method(scheduled),
    method({ ...scheduled, tool: 'explorer' }),
    method(hybrid),
    method({ ...hybrid, destination: 'files-nfs' }),
    method({ fidelity: 'required' }),
    method({ fidelity: 'required', fidelityChecked: true }),
  ],
  sync: [
    sync(),
    sync({ method: 'directional', deleteDestination: true }),
    sync({ method: 'directional' }),
    sync({ method: 'directional', direction: 'cloud-to-a' }),
    sync({ method: 'file-sync', scenario: 'concurrent' }),
    sync({ method: 'file-sync' }),
    sync({ method: 'file-sync', cloudTiering: true, localContent: false, connected: false }),
    sync({ method: 'file-sync', cloudTiering: true, localContent: false }),
  ],
  planning: [
    planning(),
    planning({ dependencies: true }),
    planning({ dependencies: true, assessmentFresh: false }),
    planning(physical),
    planning({ ...physical, phase: 'transported', transferVerified: true }),
    planning({
      ...physical,
      phase: 'validated',
      transferVerified: true,
      writersControlled: true,
      appValidated: true,
    }),
  ],
};
