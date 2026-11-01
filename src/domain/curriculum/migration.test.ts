import { describe, it, expect } from 'vitest';
import { parseLocation, portalHref } from '../portal/model';
import { method, sync, planning, migrationContrasts } from '../../../tests/fixtures/migration';
import {
  runMethod,
  runSync,
  runPlanning,
  runMigration,
  validMigrationInput,
} from './migration-model';
import {
  migrationKey,
  migrationLimit,
  migrationItems,
  migrationItemIds,
  migrationManifest,
  migrationFacts,
  migrationGuidedFacts,
  migrationWitnesses,
  migrationGuidedAnswer,
  freshMigration,
  applyMigration,
  restoreMigration,
  evaluateMigration,
  type MigrationGuide,
  type MigrationSave,
} from './migration';
import { MigrationStore } from './migration-store';
import { sandboxKey } from '../sandbox/store';
import { migrationNb, migrationItemsNb } from '../../content/nb';
const add = (s: MigrationSave, e: unknown) => {
  const n = applyMigration(s, e);
  expect(n).not.toBeNull();
  return n!;
};
class Memory {
  map = new Map<string, string>();
  fail = false;
  getItem = (k: string) => this.map.get(k) ?? null;
  setItem = (k: string, v: string) => {
    if (this.fail) throw Error('denied');
    this.map.set(k, v);
  };
  removeItem = (k: string) => {
    if (this.fail) throw Error('denied');
    this.map.delete(k);
  };
}
function guide(mission: MigrationGuide['mission']): MigrationGuide {
  return {
    id: 1,
    mission,
    runs: migrationContrasts[mission].map((input) => ({ kind: 'run', input, prediction: 1 })),
    configuration: {},
    answer: migrationGuidedAnswer[mission],
  };
}
describe('P16 Portal conceptual origin', () => {
  it('roundtrips method/sync/planning and rejects mixed inspect contexts', () => {
    for (const perspective of ['method', 'sync', 'planning']) {
      const p = parseLocation(new URLSearchParams('migration=inspect&perspective=' + perspective));
      expect(p.migration).toBe(perspective);
      expect(
        parseLocation(new URLSearchParams(portalHref(p, 'groups').split('?')[1])).migration,
      ).toBe(perspective);
    }
    for (const key of [
      'security',
      'monitoring',
      'tools',
      'governance',
      'networking',
      'compute',
      'mission',
      'practice',
      'bridge',
      'lab',
      'course',
    ]) {
      const p = parseLocation(new URLSearchParams('migration=inspect&' + key + '=inspect'));
      expect(p.migration).toBeUndefined();
    }
    expect(parseLocation(new URLSearchParams('migration=inspect')).migration).toBe('planning');
  });
});
describe('P16 pure method/manifest/planning boundaries', () => {
  it('divergent hybrid generations do not choose a source or overwrite newer cloud data', () => {
    const r = runSync(sync({ method: 'file-sync', scenario: 'target-newer' }))!;
    expect(r).toMatchObject({ conflict: true, outcome: 1, contentState: 'version-unresolved' });
    expect(r.rows[0]!.action).toBe('conflict-review');
    expect(r.rows[0]!.after).toEqual(r.rows[0]!.before);
  });
  it('disabling cloud tiering never invents bytes after partial recall', () => {
    for (const cloudTiering of [true, false]) {
      expect(
        runSync(sync({ method: 'file-sync', cloudTiering, localContent: false, connected: false }))
          ?.contentState,
      ).toBe('offline-unavailable');
      expect(
        runSync(sync({ method: 'file-sync', cloudTiering, localContent: false, connected: true }))
          ?.contentState,
      ).toBe('recall-required');
    }
  });
  it('rejects unknown fields, number strings and unsupported tools without World or actual file claims', () => {
    expect(validMigrationInput({ ...method(), world: {} })).toBe(false);
    expect(runMigration({ ...planning(), sizeGB: '20000' })).toBeNull();
    expect(runMigration({ ...method(), tool: 'azure-cli' })).toBeNull();
    for (const inputs of Object.values(migrationContrasts))
      for (const input of inputs) {
        const r = runMigration(input)!;
        expect(r).toMatchObject({
          synthetic: true,
          actualFileTransfer: false,
          actualSynchronization: false,
          actualMigration: false,
          actualIntegrityCheck: false,
          actualApplicationValidation: false,
          actualAzureReceipt: false,
          actualWorldMutation: false,
        });
        expect(runMigration(input)).toEqual(r);
      }
  });
  it('admits alternative file-copy workflows and separates unattended/hybrid/whole-workload roles', () => {
    expect(runMethod(method())?.candidates).toEqual(['azcopy', 'explorer']);
    expect(
      runMethod(method({ cadence: 'scheduled', interface: 'scripted', tool: 'explorer' }))
        ?.methodFits,
    ).toBe(false);
    expect(
      runMethod(
        method({
          dataset: 'documents',
          destination: 'files-smb',
          cadence: 'hybrid',
          tool: 'file-sync',
        }),
      )?.methodFits,
    ).toBe(true);
    expect(
      runMethod(
        method({
          dataset: 'documents',
          destination: 'files-nfs',
          cadence: 'hybrid',
          tool: 'file-sync',
        }),
      )?.methodFits,
    ).toBe(false);
    expect(
      runMethod(
        method({
          dataset: 'documents',
          destination: 'files-smb',
          cadence: 'hybrid',
          host: 'linux',
          tool: 'file-sync',
        }),
      )?.methodFits,
    ).toBe(false);
    expect(
      runMethod(
        method({ destination: 'files-nfs', host: 'windows', tool: 'azcopy', supported: true }),
      )?.methodFits,
    ).toBe(false);
    expect(
      runMethod(method({ destination: 'files-nfs', host: 'linux', tool: 'azcopy' }))?.methodFits,
    ).toBe(true);
    expect(runMethod(method({ dataset: 'application', tool: 'migrate' }))?.role).toBe(
      'workload-process',
    );
    expect(runMethod(method({ dataset: 'application', tool: 'databox' }))?.methodFits).toBe(false);
  });
  it('compatible tool and large dataset do not invent authorization, network or universal fidelity', () => {
    for (const missing of [
      { access: false },
      { network: false },
      { supported: false },
      { sourceStable: false },
    ])
      expect(runMethod(method(missing))).toMatchObject({
        methodFits: true,
        prerequisitesMet: false,
        outcome: 1,
      });
    expect(runMethod(method({ fidelity: 'required' }))).toMatchObject({
      needsFidelityReview: true,
      outcome: 1,
    });
    expect(runMethod(method({ fidelity: 'required', fidelityChecked: true }))).toMatchObject({
      fidelityMet: true,
      actualIntegrityCheck: false,
    });
    expect(runMethod(method({ volume: 'large' }))?.candidates).toContain('azcopy');
  });
  it('copy retains target-only data; directional deletion needs explicit selection and never reaches B', () => {
    const a = runSync(sync())!,
      b = runSync(sync({ method: 'directional' }))!,
      d = runSync(sync({ method: 'directional', deleteDestination: true }))!;
    expect(a.rows.find((x) => x.before.name === 'arkiv.txt')?.after.cloud).not.toBeNull();
    expect(b.rows.find((x) => x.before.name === 'arkiv.txt')?.after.cloud).not.toBeNull();
    expect(d.rows.find((x) => x.before.name === 'arkiv.txt')?.action).toBe('delete-target');
    for (const v of [a, b, d, runSync(sync({ method: 'directional', direction: 'cloud-to-a' }))!]) {
      expect(v.bTouched).toBe(false);
      expect(v.oneWay).toBe(true);
      expect(v.globalConsistencyProven).toBe(false);
    }
  });
  it('newer target and equal timestamps can retain a difference; manifest tokens are not real hashes', () => {
    expect(
      runSync(sync({ method: 'directional', scenario: 'target-newer' }))?.rows[0]?.action,
    ).toBe('keep-target');
    expect(
      runSync(sync({ method: 'directional', scenario: 'same-time-different' }))?.rows[0]?.action,
    ).toBe('keep-target');
    expect(
      runSync(
        sync({ method: 'directional', scenario: 'same-time-different', comparison: 'manifest' }),
      ),
    ).toMatchObject({ versionTokensAreHashes: false, actualIntegrityCheck: false });
    expect(
      runSync(
        sync({ method: 'directional', scenario: 'same-time-different', comparison: 'manifest' }),
      )?.rows[0]?.action,
    ).toBe('update');
    expect(
      runSync(sync({ method: 'copy', scenario: 'same-time-different', comparison: 'manifest' }))
        ?.rows[0]?.action,
    ).toBe('keep-target');
  });
  it('File Sync fixtures hold conflict/detection uncertainty and distinguish tiered namespace from offline content', () => {
    expect(runSync(sync({ method: 'file-sync', scenario: 'concurrent' }))).toMatchObject({
      conflict: true,
      outcome: 1,
      syncIsBackup: false,
    });
    expect(runSync(sync({ method: 'file-sync', scenario: 'concurrent' }))?.rows[0]?.action).toBe(
      'conflict-review',
    );
    expect(
      runSync(sync({ method: 'file-sync', scenario: 'cloud-change', detected: false }))?.rows[0]
        ?.action,
    ).toBe('pending-detection');
    expect(
      runSync(
        sync({ method: 'file-sync', cloudTiering: true, localContent: false, connected: false }),
      ),
    ).toMatchObject({ contentState: 'offline-unavailable', namespaceIsContent: false, outcome: 0 });
    expect(
      runSync(sync({ method: 'file-sync', cloudTiering: true, localContent: false }))?.contentState,
    ).toBe('recall-required');
    for (const row of runSync(sync({ access: false }))!.rows) expect(row.after).toEqual(row.before);
    expect(runSync(sync({ fidelity: 'required' }))?.outcome).toBe(1);
  });
  it('planning uses correct decimal units, a network lower bound and separate fictional physical premises', () => {
    const v = runPlanning(planning())!;
    expect(v.networkLowerBoundHours).toBeCloseTo(444.4444, 3);
    expect(v.networkRuledOut).toBe(true);
    expect(v.transport).toBe('ruled-out');
    expect(v.timeGuaranteed).toBe(false);
    expect(runPlanning(planning({ strategy: 'physical', deviceEligible: false }))?.transport).toBe(
      'unknown',
    );
    expect(runPlanning(planning({ strategy: 'physical', physicalHours: 360 }))?.transport).toBe(
      'ruled-out',
    );
    expect(runPlanning(planning({ strategy: 'physical' }))?.transport).toBe('candidate');
    expect(runPlanning(planning({ sizeGB: 100, windowHours: 8 }))?.transport).toBe('candidate');
  });
  it('discovery snapshot freshness, dependencies, cutover and app validation cannot be replaced by completed data transport', () => {
    const v = {
      dependencies: true,
      strategy: 'physical' as const,
      phase: 'validated' as const,
      transferVerified: true,
      writersControlled: true,
      appValidated: true,
    };
    expect(runPlanning(planning(v))).toMatchObject({
      planReady: true,
      dataCheckDeclared: true,
      cutoverReviewed: true,
      validationDeclared: true,
      actualMigration: false,
      actualApplicationValidation: false,
    });
    for (const missing of [
      { dependencies: false },
      { assessmentFresh: false },
      { compatible: false },
      { access: false },
      { writersControlled: false },
      { appValidated: false },
    ])
      expect(runPlanning(planning({ ...v, ...missing }))?.validationDeclared).toBe(false);
    expect(runPlanning(planning({ ...v, phase: 'transported' }))).toMatchObject({
      dataCheckDeclared: true,
      validationDeclared: false,
      transportIsApplicationMigration: false,
    });
  });
  it('all three guided causal results require matched persisted contrasts and explicit explanation', () => {
    for (const m of ['method', 'sync', 'planning'] as const) {
      const g = guide(m);
      expect(migrationWitnesses(g).every(Boolean)).toBe(true);
      expect(migrationGuidedFacts(g).complete).toBe(true);
      expect(migrationGuidedFacts({ ...g, answer: null }).complete).toBe(false);
      expect(migrationGuidedFacts({ ...g, runs: g.runs.slice(0, 1) }).complete).toBe(false);
      let save = add(freshMigration(), { kind: 'mission', mission: m });
      for (const r of g.runs) save = add(save, r);
      save = add(save, { kind: 'explain', answer: migrationGuidedAnswer[m] });
      expect(migrationFacts(restoreMigration(JSON.stringify(save)).save).completed).toHaveLength(1);
    }
  });
  it('navigation and a correct cause alone cannot grant guided credit; active assessment prevents model work', () => {
    let s = add(freshMigration(), { kind: 'visit', topic: 'studio' });
    expect(migrationFacts(s).completed).toHaveLength(0);
    s = add(s, { kind: 'mission', mission: 'planning' });
    expect(applyMigration(s, { kind: 'explain', answer: 0 })).toBeNull();
    s = add(s, { kind: 'begin', item: 'fm01' });
    expect(applyMigration(s, { kind: 'run', input: planning(), prediction: 2 })).toBeNull();
    expect(applyMigration(s, { kind: 'visit', topic: 'methods' })).toBeNull();
  });
});
describe('P16 immutable assessment and durable replay', () => {
  it('evaluates the complete 90-pair relation, including valid alternative Explorer access architectures', () => {
    for (const id of migrationItemIds)
      for (let d = 0; d < 3; d++)
        for (let r = 0; r < 3; r++)
          expect(evaluateMigration(id, { decision: d, reason: r }).relation).toBe(
            migrationItems[id].accepted.some(([a, b]) => a === d && b === r),
          );
    expect(migrationItems.fm02.accepted).toHaveLength(2);
    expect(migrationItems.fm10.accepted).toEqual([
      [1, 2],
      [2, 2],
    ]);
  });
  it('a correct decision with wrong reason fails and helped retry cannot rewrite the first', () => {
    const [decision, reason] = migrationItems.fm01.accepted[0];
    let s = add(freshMigration(), { kind: 'begin', item: 'fm01' });
    s = add(s, { kind: 'draft', answer: { decision, reason: (reason + 1) % 3 } });
    s = add(s, { kind: 'submit' });
    const first = JSON.stringify(migrationFacts(s).firsts[0]);
    expect(evaluateMigration('fm01', migrationFacts(s).firsts[0]!.answer).relation).toBe(false);
    s = add(s, { kind: 'begin', item: 'fm01' });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'draft', answer: { decision, reason } });
    s = add(s, { kind: 'submit' });
    expect(JSON.stringify(migrationFacts(s).firsts[0])).toBe(first);
    expect(migrationFacts(s).current).toMatchObject({ retry: true, assisted: true });
  });
  it('reserves final durable draft/help/submit at event capacity', () => {
    let s = freshMigration();
    while (s.events.length < migrationLimit - 6)
      s = add(s, { kind: 'visit', topic: s.events.length % 2 ? 'methods' : 'migrate' });
    s = add(s, { kind: 'begin', item: 'fm01' });
    expect(applyMigration(s, { kind: 'visit', topic: 'azcopy' })).toBeNull();
    s = add(s, { kind: 'draft', answer: { decision: 0, reason: 0 } });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'submit' });
    expect(restoreMigration(JSON.stringify(s)).save).toEqual(s);
    expect(migrationFacts(s).firsts[0]!.assisted).toBe(true);
    expect(applyMigration(s, { kind: 'begin', item: 'fm02' })).toBeNull();
  });
  it('rejects unknown versions, invalid/no-op replay and oversized bytes', () => {
    expect(restoreMigration('{bad').issue).toBe('corrupt');
    expect(restoreMigration('x'.repeat(600001)).issue).toBe('corrupt');
    expect(restoreMigration(JSON.stringify({ ...freshMigration(), model: '2.0.0' })).issue).toBe(
      'unsupported',
    );
    expect(
      restoreMigration(JSON.stringify({ ...freshMigration(), events: [{ kind: 'pause' }] })).issue,
    ).toBe('corrupt');
  });
  it('denied and stale writes cannot grant assistance or publish a newer draft', () => {
    const io = new Memory(),
      s = new MigrationStore(io);
    s.load();
    expect(s.event({ kind: 'begin', item: 'fm01' })).toBe(true);
    const raw = io.getItem(migrationKey);
    io.fail = true;
    expect(s.prepareTeaching()).toBe(false);
    expect(io.getItem(migrationKey)).toBe(raw);
    expect(migrationFacts(s.getSnapshot().save).assisted).toBe(false);
    io.fail = false;
    s.load();
    io.setItem(
      migrationKey,
      JSON.stringify(
        add(s.getSnapshot().save, { kind: 'draft', answer: { decision: 1, reason: 1 } }),
      ),
    );
    expect(s.event({ kind: 'aid' })).toBe(false);
    expect(s.getSnapshot().issue).toBe('conflict');
  });
  it('scoped recovery compares before deletion and preserves Sandbox and prior records', () => {
    const io = new Memory();
    io.setItem(migrationKey, '{bad');
    io.setItem(sandboxKey, 'native');
    io.setItem('azurelab.learning.governance-compliance.v1', 'old');
    const s = new MigrationStore(io);
    s.load();
    io.setItem(migrationKey, JSON.stringify(freshMigration()));
    expect(s.recoverInvalid()).toBe(false);
    io.setItem(migrationKey, '{bad');
    s.load();
    expect(s.recoverInvalid()).toBe(true);
    expect(io.getItem(sandboxKey)).toBe('native');
    expect(io.getItem('azurelab.learning.governance-compliance.v1')).toBe('old');
  });
  it('maps both scoped goals to different original contexts and source claims', () => {
    expect(migrationKey).toBe('azurelab.learning.file-movement-migration.v1');
    expect(migrationManifest.certificationOverlay.slots).toHaveLength(2);
    for (const goal of Object.keys(migrationManifest.objectives))
      expect(
        migrationItemIds.filter((id) =>
          (migrationItems[id].objectives as readonly string[]).includes(goal),
        ).length,
      ).toBeGreaterThanOrEqual(2);
    expect(migrationNb.sections.azcopy.paragraphs.length).toBeGreaterThan(3);
    for (const id of migrationItemIds) {
      expect(migrationItemsNb[id].decisions).toHaveLength(3);
      expect(migrationItemsNb[id].reasons).toHaveLength(3);
    }
  });
});
