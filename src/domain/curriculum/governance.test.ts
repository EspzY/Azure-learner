import { describe, it, expect } from 'vitest';
import { data, policy, locks, governanceContrasts } from '../../../tests/fixtures/governance';
import {
  runData,
  runPolicy,
  runLocks,
  validGovernanceInput,
  scopeChain,
  lockOperations,
} from './governance-model';
import {
  governanceKey,
  governanceLimit,
  governanceItems,
  governanceItemIds,
  governanceManifest,
  governanceFacts,
  governanceGuidedFacts,
  governanceWitnesses,
  governanceGuidedAnswer,
  freshGovernance,
  applyGovernance,
  restoreGovernance,
  evaluateGovernance,
  type GovernanceGuide,
  type GovernanceSave,
} from './governance';
import { GovernanceStore } from './governance-store';
import { governancePolicyEvidence } from './governance-evidence';
import { SandboxStore, sandboxKey } from '../sandbox/store';
import { governanceItemsNb, governanceNb } from '../../content/nb';
import { governanceSources, governanceSourceReview } from './governance-sources';
const add = (s: GovernanceSave, event: unknown) => {
  const n = applyGovernance(s, event);
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
function native() {
  const io = new Memory(),
    store = new SandboxStore(io);
  store.load();
  let id = 0;
  const command = (c: Record<string, string>) => {
    expect(
      store.dispatch({
        kind: 'command',
        request: {
          commandId: `gov-test-${++id}`,
          expectedWorldRevision: store.getSnapshot().attempt.engine.world.revision,
          command: c,
        },
      }),
    ).toBe(true);
    return store.getSnapshot().attempt.responses.at(-1)!;
  };
  command({
    type: 'CreateGroup',
    subscriptionId: 'sub-app',
    name: 'rg-governance',
    metadataRegion: 'norwayeast',
  });
  const group = store.getSnapshot().attempt.engine.world.groups[0]!;
  const denied = command({
      type: 'CreatePlan',
      groupId: group.id,
      name: 'plan-governance',
      region: 'northeurope',
      profile: 'linux-learning-v1',
    }),
    accepted = command({
      type: 'CreatePlan',
      groupId: group.id,
      name: 'plan-governance',
      region: 'westeurope',
      profile: 'linux-learning-v1',
    });
  return { io, store, group, denied, accepted, engine: store.getSnapshot().attempt.engine };
}
function guide(mission: 'data' | 'policy' | 'locks'): GovernanceGuide {
  return {
    id: 1,
    mission,
    attempt: mission === 'policy' ? 1 : null,
    boundary: null,
    through: null,
    inspected: [],
    runs: governanceContrasts[mission].map((input) => ({ kind: 'run', input, prediction: 1 })),
    configuration: {},
    answer: governanceGuidedAnswer[mission],
  };
}
describe('P12 metadata is separate from source access', () => {
  it('requires registered metadata and declared catalog permission for discovery', () => {
    expect(runData(data())?.discoverable).toBe(false);
    expect(
      runData(data({ registered: true, catalogAccess: false, sourceAuthorized: true }))
        ?.discoverable,
    ).toBe(false);
    expect(runData(data({ registered: true }))?.discoverable).toBe(true);
  });
  it('classification alone grants neither data access nor security/compliance proof', () => {
    const result = runData(data({ registered: true, classification: 'business' }));
    expect(result).toMatchObject({
      classified: true,
      declaredSourceAuthorized: false,
      actualRead: false,
      actualScan: false,
      securityProven: false,
      complianceProven: false,
    });
  });
  it('uses declared dataset-specific ownership and lineage without running a pipeline', () => {
    expect(
      runData(data({ asset: 'customer', owner: 'finance', classification: 'business' })),
    ).toMatchObject({ accountable: false, classified: false });
    const before = data({
      registered: true,
      classification: 'business',
      owner: 'finance',
      glossary: true,
      lineage: true,
    });
    expect(runData(before)).toMatchObject({
      curated: true,
      declaredSourceAuthorized: false,
      outcome: 1,
    });
    expect(runData({ ...before, sourceAuthorized: true })).toMatchObject({
      curated: true,
      declaredSourceAuthorized: true,
      actualRead: false,
      outcome: 2,
    });
  });
});
describe('P12 policy consequences under declared Resource Manager rules', () => {
  it('Audit observes a matching deviation without Deny enforcement', () => {
    expect(runPolicy(policy())).toMatchObject({
      nonCompliant: true,
      blocked: false,
      state: 'non-compliant',
      actualReceipt: false,
    });
    expect(runPolicy(policy({ effect: 'deny' }))).toMatchObject({
      nonCompliant: true,
      blocked: true,
    });
  });
  it('requires scope and target type; group metadata is not the checked resource location', () => {
    expect(runPolicy(policy({ effect: 'deny', resourceScope: 'rg-shared' }))).toMatchObject({
      inScope: false,
      blocked: false,
      state: 'not-applicable',
    });
    expect(runPolicy(policy({ effect: 'deny', resourceType: 'vm' }))).toMatchObject({
      typeMatches: false,
      blocked: false,
    });
    expect(
      runPolicy(policy({ effect: 'deny', resourceScope: 'rg-shared', assignment: 'mg-lab' }))
        ?.blocked,
    ).toBe(true);
  });
  it('keeps exclusions, tracked exemptions and expiry distinct', () => {
    expect(runPolicy(policy({ effect: 'deny', excluded: 'rg-app' }))).toMatchObject({
      excluded: true,
      state: 'excluded',
      evaluated: false,
      blocked: false,
    });
    for (const exemption of ['waiver', 'mitigated'] as const)
      expect(runPolicy(policy({ effect: 'deny', exemption }))).toMatchObject({
        exempt: true,
        state: 'exempt',
        blocked: false,
      });
    expect(runPolicy(policy({ effect: 'deny', exemption: 'expired' }))).toMatchObject({
      exempt: false,
      blocked: true,
    });
  });
  it('a pending evaluation does not invent compliance', () => {
    expect(runPolicy(policy({ location: 'westeurope', evaluationReady: false }))).toMatchObject({
      state: 'pending',
      evaluated: false,
      outcome: 1,
    });
    expect(runPolicy(policy({ location: 'westeurope' }))).toMatchObject({
      state: 'compliant',
      outcome: 2,
    });
  });
  it('Deny evaluation of an existing resource does not delete or correct it', () => {
    expect(runPolicy(policy({ effect: 'deny', phase: 'existing' }))).toMatchObject({
      state: 'non-compliant',
      blocked: false,
      actualOperation: false,
      actualRemediation: false,
    });
  });
  it('DoNotEnforce is not disabled or an automatic exemption', () => {
    expect(runPolicy(policy({ effect: 'deny', enforcement: false }))).toMatchObject({
      state: 'non-compliant',
      evaluated: true,
      blocked: false,
    });
    expect(runPolicy(policy({ effect: 'disabled' }))).toMatchObject({
      state: 'disabled',
      evaluated: false,
      blocked: false,
    });
  });
  it('Modify does not universally relocate a resource or require task identity for request tags', () => {
    expect(runPolicy(policy({ effect: 'modify' }))).toMatchObject({
      supported: false,
      state: 'unsupported',
      modifyRequest: false,
    });
    expect(
      runPolicy(policy({ effect: 'modify', rule: 'tag', identityReady: false })),
    ).toMatchObject({ modifyRequest: true, actualOperation: false });
  });
  it('existing supported remediation needs explicit task/identity and still does not prove completed repair', () => {
    const v = policy({ effect: 'modify', rule: 'tag', phase: 'existing', identityReady: true });
    expect(runPolicy(v)).toMatchObject({
      needsRemediation: true,
      remediationEligible: false,
      state: 'non-compliant',
    });
    expect(runPolicy({ ...v, remediationRequested: true })).toMatchObject({
      remediationEligible: true,
      state: 'non-compliant',
      actualRemediation: false,
    });
    expect(
      runPolicy({ ...v, remediationRequested: true, identityReady: false })?.remediationEligible,
    ).toBe(false);
  });
  it('DINE requires appropriate related rule, evaluation and deployment permissions', () => {
    expect(runPolicy(policy({ effect: 'deploy' }))?.supported).toBe(false);
    expect(
      runPolicy(
        policy({ effect: 'deploy', rule: 'related', evaluationReady: false, identityReady: true }),
      ),
    ).toMatchObject({ state: 'pending', wouldDeploy: false });
    expect(
      runPolicy(policy({ effect: 'deploy', rule: 'related', identityReady: true })),
    ).toMatchObject({ wouldDeploy: true, blocked: false, actualDeployment: false });
    expect(
      runPolicy(
        policy({
          effect: 'deploy',
          rule: 'related',
          phase: 'existing',
          enforcement: false,
          remediationRequested: true,
          identityReady: true,
        }),
      ),
    ).toMatchObject({ remediationEligible: true, wouldDeploy: false, actualRemediation: false });
  });
});
describe('P12 management locks do not become permissions or backup', () => {
  it('CanNotDelete permits modification but denies relevant resource deletion', () => {
    expect(runLocks(locks())?.allowed).toBe(true);
    expect(runLocks(locks({ operation: 'delete-vm' }))).toMatchObject({
      lockBlocked: true,
      allowed: false,
      backupCreated: false,
      actualLock: false,
    });
  });
  it('ReadOnly blocks management POST, including VM start and account ListKeys', () => {
    expect(runLocks(locks({ lock: 'readonly', operation: 'start-vm' }))).toMatchObject({
      method: 'POST',
      lockBlocked: true,
    });
    expect(
      runLocks(
        locks({ lock: 'readonly', scope: 'account', target: 'account', operation: 'list-keys' }),
      ),
    ).toMatchObject({ method: 'POST', lockBlocked: true });
  });
  it('data deletion remains separate and requires its own declared authorization', () => {
    const v = locks({
      lock: 'readonly',
      scope: 'account',
      target: 'account',
      operation: 'delete-blob',
    });
    expect(runLocks(v)).toMatchObject({
      dataPlane: true,
      lockBlocked: false,
      allowed: true,
      actualOperation: false,
    });
    expect(runLocks({ ...v, authorized: false })).toMatchObject({
      allowed: false,
      cause: 'authorization',
    });
  });
  it('inherits downward and preserves whole-group protection without upward inheritance', () => {
    expect(scopeChain('vm')).toEqual(['mg-lab', 'sub-app', 'rg-app', 'vm']);
    expect(
      runLocks(locks({ scope: 'vm', target: 'account', operation: 'delete-account' }))?.lockBlocked,
    ).toBe(false);
    expect(
      runLocks(locks({ scope: 'vm', target: 'rg-app', operation: 'delete-group' })),
    ).toMatchObject({ lockBlocked: true, descendantBlock: true });
    expect(
      runLocks(locks({ scope: 'vm', target: 'rg-shared', operation: 'delete-group' }))?.lockBlocked,
    ).toBe(false);
  });
  it('all relevant locks combine independently of their order; a child cannot override ReadOnly', () => {
    for (const operation of lockOperations) {
      const v = locks({
        lock: 'readonly',
        scope: 'sub-app',
        second: 'delete',
        secondScope: 'vm',
        operation,
      });
      const a = runLocks(v)!,
        b = runLocks({
          ...v,
          lock: v.second,
          scope: v.secondScope,
          second: v.lock,
          secondScope: v.scope,
        })!;
      expect([a.allowed, a.lockBlocked, a.cause]).toEqual([b.allowed, b.lockBlocked, b.cause]);
    }
    expect(
      runLocks(locks({ lock: 'readonly', scope: 'sub-app', second: 'delete', secondScope: 'vm' }))
        ?.allowed,
    ).toBe(false);
  });
  it('unsupported resource/operation pairs remain outside, not universal access', () => {
    expect(runLocks(locks({ target: 'account', operation: 'start-vm' }))).toMatchObject({
      supported: false,
      allowed: false,
      outcome: 1,
      cause: 'outside',
    });
  });
});
describe('P12 actual references and causal learning history', () => {
  it('rejects unknown fields, fictitious resource types and invalid control values', () => {
    expect(validGovernanceInput({ ...data(), token: 'fake' })).toBe(false);
    expect(validGovernanceInput({ ...policy(), effect: 'allow' })).toBe(false);
    expect(validGovernanceInput({ ...locks(), scope: 'mg-lab' })).toBe(false);
    expect(validGovernanceInput({ ...policy(), evaluationReady: 'yes' })).toBe(false);
  });
  it('matches declared contrasts and never credits navigation or unrelated inputs', () => {
    for (const mission of ['data', 'locks'] as const)
      expect(governanceGuidedFacts(guide(mission)).complete).toBe(true);
    const g = guide('data');
    g.runs[1] = { ...g.runs[1]!, input: data({ registered: true, catalogAccess: false }) };
    expect(governanceWitnesses(g)[0]).toBe(false);
    expect(
      governanceFacts(add(freshGovernance(), { kind: 'visit', topic: 'studio' })).completed,
    ).toEqual([]);
  });
  it('verifies native denied/corrected receipts without changing technical bytes', () => {
    const x = native(),
      before = x.io.getItem(sandboxKey),
      g = guide('policy');
    expect(x.denied).toMatchObject({
      code: 'policy-location-denied',
      addedIds: [],
      beforeRevision: x.denied.afterRevision,
      beforeCount: x.denied.afterCount,
    });
    g.through = x.accepted.commandId;
    g.inspected = [
      'policy:policy-web-location',
      'resource:sub-app',
      `resource:${x.group.id}`,
      `receipt:${x.denied.commandId}`,
      `receipt:${x.accepted.commandId}`,
    ];
    const proof = governancePolicyEvidence(g, x.engine, 1);
    expect(proof).toMatchObject({ verifiable: true, complete: true });
    expect(governanceGuidedFacts(g).complete).toBe(false);
    expect(governanceGuidedFacts(g, proof.complete).complete).toBe(true);
    expect(x.io.getItem(sandboxKey)).toBe(before);
  });
  it('old/future/missing or forged technical references cannot complete a new investigation', () => {
    const x = native(),
      g = guide('policy');
    g.through = x.accepted.commandId;
    g.inspected = [
      'policy:policy-web-location',
      'resource:sub-app',
      `resource:${x.group.id}`,
      `receipt:${x.denied.commandId}`,
      `receipt:${x.accepted.commandId}`,
    ];
    expect(
      governancePolicyEvidence({ ...g, boundary: x.accepted.commandId }, x.engine, 1).complete,
    ).toBe(false);
    expect(governancePolicyEvidence(g, x.engine, 2).complete).toBe(false);
    expect(governancePolicyEvidence(g, undefined, 1).complete).toBe(false);
    expect(
      governancePolicyEvidence({ ...g, through: 'future-receipt' }, x.engine, 1).verifiable,
    ).toBe(false);
    const forged = structuredClone(x.engine);
    forged.ledger[1]!.receipt.afterCount++;
    expect(governancePolicyEvidence(g, forged, 1).verifiable).toBe(false);
  });
  it('pins a new, isolated version and only the three scoped goals', () => {
    expect(governanceKey).toBe('azurelab.learning.governance-compliance.v1');
    expect(governanceManifest.certificationOverlay.slots).toEqual(['3.2.01', '3.2.02', '3.2.03']);
    expect(governanceItemIds).toHaveLength(9);
    for (const id of governanceItemIds) {
      const item = governanceItems[id];
      expect(governanceItemsNb[id].feedback.flat()).toHaveLength(6);
      for (const source of item.sources) expect(source in governanceSources).toBe(true);
    }
    expect(governanceNb.assessment.intro).toContain('hele valget');
    expect(Object.keys(governanceSourceReview.claims)).toHaveLength(36);
  });
  it('grades every decision/reason pair and preserves a wrong first through helped retry', () => {
    for (const id of governanceItemIds)
      for (let d = 0; d < 3; d++)
        for (let r = 0; r < 3; r++)
          expect(evaluateGovernance(id, { decision: d, reason: r }).relation).toBe(
            governanceItems[id].accepted.some(([a, b]) => a === d && b === r),
          );
    let s = add(freshGovernance(), { kind: 'begin', item: 'gc01' });
    s = add(s, { kind: 'draft', answer: { decision: 2, reason: 0 } });
    s = add(s, { kind: 'submit' });
    const first = JSON.stringify(governanceFacts(s).firsts[0]);
    s = add(s, { kind: 'begin', item: 'gc01' });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'draft', answer: { decision: 2, reason: 1 } });
    s = add(s, { kind: 'submit' });
    expect(JSON.stringify(governanceFacts(s).firsts[0])).toBe(first);
    expect(governanceFacts(s).current).toMatchObject({ retry: true, assisted: true });
  });
  it('reserves durable draft/help/terminal events at capacity and replays the final first submission', () => {
    let s = freshGovernance();
    while (s.events.length < governanceLimit - 6)
      s = add(s, { kind: 'visit', topic: s.events.length % 2 ? 'policy' : 'locks' });
    s = add(s, { kind: 'begin', item: 'gc04' });
    expect(applyGovernance(s, { kind: 'visit', topic: 'purview' })).toBeNull();
    s = add(s, { kind: 'draft', answer: { decision: 1, reason: 2 } });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'submit' });
    expect(restoreGovernance(JSON.stringify(s)).save).toEqual(s);
    expect(governanceFacts(s).firsts[0]).toMatchObject({ assisted: true });
    expect(applyGovernance(s, { kind: 'begin', item: 'gc05' })).toBeNull();
  });
  it('rejects invalid/no-op replay, oversized input and unsupported historical versions', () => {
    expect(restoreGovernance('{bad').issue).toBe('corrupt');
    expect(restoreGovernance('x'.repeat(600001)).issue).toBe('corrupt');
    expect(restoreGovernance(JSON.stringify({ ...freshGovernance(), model: '2.0.0' })).issue).toBe(
      'unsupported',
    );
    expect(
      restoreGovernance(JSON.stringify({ ...freshGovernance(), events: [{ kind: 'pause' }] }))
        .issue,
    ).toBe('corrupt');
  });
  it('durable denied/stale writes never publish answers, aid or another key deletion', () => {
    const io = new Memory(),
      store = new GovernanceStore(io);
    store.load();
    expect(store.event({ kind: 'begin', item: 'gc01' })).toBe(true);
    const before = io.getItem(governanceKey);
    io.fail = true;
    expect(store.prepareTeaching()).toBe(false);
    expect(io.getItem(governanceKey)).toBe(before);
    expect(governanceFacts(store.getSnapshot().save).assisted).toBe(false);
    io.fail = false;
    store.load();
    io.setItem(
      governanceKey,
      JSON.stringify(
        add(store.getSnapshot().save, { kind: 'draft', answer: { decision: 1, reason: 1 } }),
      ),
    );
    expect(store.event({ kind: 'aid' })).toBe(false);
    expect(store.getSnapshot().issue).toBe('conflict');
  });
  it('scoped recovery compares raw bytes before deleting and preserves technical/P11 records', () => {
    const io = new Memory();
    io.map.set(governanceKey, '{bad');
    io.map.set(sandboxKey, 'native');
    io.map.set('azurelab.learning.access-control.v1', 'old');
    const store = new GovernanceStore(io);
    store.load();
    io.map.set(governanceKey, JSON.stringify(freshGovernance()));
    expect(store.recoverInvalid()).toBe(false);
    expect(io.getItem(governanceKey)).not.toBeNull();
    io.map.set(governanceKey, '{bad');
    store.load();
    expect(store.recoverInvalid()).toBe(true);
    expect(io.getItem(sandboxKey)).toBe('native');
    expect(io.getItem('azurelab.learning.access-control.v1')).toBe('old');
  });
});
