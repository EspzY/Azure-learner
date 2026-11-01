import { describe, it, expect } from 'vitest';
import { parseLocation, portalHref } from '../portal/model';
import { trust, depth, defender, securityContrasts } from '../../../tests/fixtures/security';
import {
  runTrust,
  runDepth,
  runDefender,
  securityLayers,
  runSecurity,
  validSecurityInput,
} from './security-model';
import {
  securityKey,
  securityLimit,
  securityItems,
  securityItemIds,
  securityManifest,
  securityFacts,
  securityGuidedFacts,
  securityWitnesses,
  securityGuidedAnswer,
  freshSecurity,
  applySecurity,
  restoreSecurity,
  evaluateSecurity,
  type SecurityGuide,
  type SecuritySave,
} from './security';
import { SecurityStore } from './security-store';
import { sandboxKey } from '../sandbox/store';
import { securityNb, securityItemsNb } from '../../content/nb';
const add = (s: SecuritySave, e: unknown) => {
  const n = applySecurity(s, e);
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
function guide(mission: SecurityGuide['mission']): SecurityGuide {
  return {
    id: 1,
    mission,
    runs: securityContrasts[mission].map((input) => ({ kind: 'run', input, prediction: 1 })),
    configuration: {},
    answer: securityGuidedAnswer[mission],
  };
}
describe('P15 read-only Portal context routing', () => {
  it('roundtrips all three views and rejects every competing context', () => {
    for (const view of ['trust', 'depth', 'defender']) {
      const p = parseLocation(new URLSearchParams('security=inspect&perspective=' + view));
      expect(p.security).toBe(view);
      expect(
        parseLocation(new URLSearchParams(portalHref(p, 'groups').split('?')[1])).security,
      ).toBe(view);
    }
    expect(parseLocation(new URLSearchParams('security=inspect')).security).toBe('defender');
    for (const extra of [
      'monitoring=inspect',
      'tools=intent',
      'governance=policy',
      'networking=inspect',
      'compute=inspect',
      'course=computing',
    ])
      expect(
        parseLocation(new URLSearchParams('security=inspect&' + extra)).security,
      ).toBeUndefined();
  });
});
describe('P15 pure security design and evidence boundaries', () => {
  it('rejects unknown fields and never invents actual security or World results', () => {
    expect(validSecurityInput({ ...trust(), world: {} })).toBe(false);
    expect(runSecurity({ kind: 'trust' })).toBeNull();
    for (const inputs of Object.values(securityContrasts))
      for (const input of inputs) {
        const r = runSecurity(input)!;
        expect(r).toMatchObject({
          synthetic: true,
          actualAccessDecision: false,
          actualCompromise: false,
          actualSecurityAssessment: false,
          actualAlert: false,
          actualRemediation: false,
          actualWorldMutation: false,
          securityGuaranteed: false,
        });
        expect(runSecurity(input)).toEqual(r);
      }
  });
  it('MFA, internal routing and least privilege are different contributions, never the whole strategy', () => {
    const a = runTrust(trust())!,
      b = runTrust(trust({ network: 'external' }))!;
    expect(a).toMatchObject({
      verificationDescribed: false,
      privilegeBounded: false,
      breachPrepared: false,
      permissionsGranted: false,
      networkTrustGranted: false,
      incidentConfirmed: false,
    });
    expect(b.verify).toEqual(a.verify);
    expect(b.outcome).toBe(a.outcome);
    expect(runTrust(trust({ scope: 'minimal', duration: 'task-bound' }))).toMatchObject({
      privilegeBounded: true,
      verificationDescribed: false,
      breachPrepared: false,
    });
    expect(runTrust(securityContrasts.trust.at(-1)!)).toMatchObject({
      outcome: 2,
      securityGuaranteed: false,
      actualAccessDecision: false,
      incidentConfirmed: false,
    });
    expect(runTrust(trust({ identity: 'unverified' }))?.outcome).toBe(0);
  });
  it('seven layers expose relevant causes, independent assumptions, failed controls and residual risk', () => {
    expect(securityLayers).toHaveLength(7);
    expect(runDepth(depth({ inspectedLayer: 'perimeter' }))?.inspectedRelevant).toBe(false);
    expect(runDepth(depth({ complementConfigured: true, failure: 'identity' }))).toMatchObject({
      primaryContribution: false,
      complementContribution: true,
      originalWeaknessStillPresent: true,
      attackSimulated: false,
      independenceIsAssumption: true,
    });
    expect(
      runDepth(
        depth({
          risk: 'host',
          primary: 'patch',
          complement: 'backup',
          complementConfigured: true,
          failure: 'compute',
        }),
      ),
    ).toMatchObject({
      primaryContribution: false,
      complementContribution: true,
      contribution: 'recovery',
      originalWeaknessStillPresent: true,
    });
    expect(
      runDepth(
        depth({
          risk: 'application',
          primary: 'app',
          complement: 'encrypt',
          complementConfigured: true,
        }),
      ),
    ).toMatchObject({
      primaryContribution: true,
      complementFits: false,
      complementContribution: false,
    });
    expect(
      runDepth(
        depth({
          risk: 'copy',
          primary: 'encrypt',
          complement: 'least',
          complementConfigured: true,
        }),
      ),
    ).toMatchObject({
      primaryContribution: true,
      complementContribution: true,
      remaining: 'authorized-use-and-key-risk',
    });
    expect(
      runDepth(depth({ primary: 'mfa', complement: 'least', complementConfigured: true }))
        ?.complementContribution,
    ).toBe(false);
  });
  it('Defender features require their own plan and known support, recommendations do not prove attacks', () => {
    expect(runDefender(defender())).toMatchObject({
      postureAvailable: true,
      advancedAvailable: false,
      workloadAvailable: false,
      recommendationVisible: true,
      alertVisible: false,
    });
    for (const resource of ['server', 'container', 'storage', 'database', 'app'] as const) {
      expect(
        runDefender(
          defender({
            resource,
            workloadPlan: true,
            feature: 'workload',
            followUp: 'investigate-evidence',
          }),
        ),
      ).toMatchObject({ alertVisible: true, followUpFits: true, actualCompromise: false });
      expect(
        runDefender(defender({ resource, workloadPlan: true, requirementsReady: false }))
          ?.alertVisible,
      ).toBe(false);
    }
    expect(runDefender(defender({ feature: 'risk-prioritization' }))?.advancedAvailable).toBe(
      false,
    );
    expect(
      runDefender(defender({ posturePlan: 'defender', feature: 'risk-prioritization' }))
        ?.advancedAvailable,
    ).toBe(true);
    expect(
      runDefender(defender({ posturePlan: 'none', recommendation: 'workload', workloadPlan: true }))
        ?.recommendationVisible,
    ).toBe(true);
    expect(runDefender(defender({ fresh: false }))?.recommendationVisible).toBe(false);
  });
  it('known no-record, unavailable evidence, notification and remediation are not invented', () => {
    expect(
      runDefender(
        defender({
          feature: 'workload',
          workloadPlan: true,
          alert: 'none',
          followUp: 'continue-observing',
        }),
      ),
    ).toMatchObject({
      noRecord: true,
      needsCoverage: false,
      followUpFits: true,
      noAlertsIsSafe: false,
    });
    expect(
      runDefender(
        defender({
          feature: 'workload',
          workloadPlan: true,
          alert: 'missing',
          followUp: 'confirm-coverage',
        }),
      ),
    ).toMatchObject({ noRecord: false, needsCoverage: true, followUpFits: true });
    expect(runDefender(defender({ followUp: 'close-as-remediated' }))).toMatchObject({
      followUpFits: false,
      actualRemediation: false,
    });
  });
  it('classic and Cloud risk score models remain distinct and no universal numerical score is invented', () => {
    expect(runDefender(defender())).toMatchObject({
      scoreModel: 'classic-control-based',
      scoreValue: null,
      scoreModelsIdentical: false,
      scoreIsSafetyProof: false,
      planIsScanProof: false,
    });
    expect(runDefender(defender({ scoreView: 'cloud-risk' }))).toMatchObject({
      scoreModel: 'cloud-risk-based',
      scoreValue: null,
      scoreIsSafetyProof: false,
    });
  });
  it('all three guided causal results require matched persisted contrasts and explicit explanation', () => {
    for (const m of ['trust', 'depth', 'defender'] as const) {
      const g = guide(m);
      expect(securityWitnesses(g).every(Boolean)).toBe(true);
      expect(securityGuidedFacts(g).complete).toBe(true);
      expect(securityGuidedFacts({ ...g, answer: null }).complete).toBe(false);
      expect(securityGuidedFacts({ ...g, runs: g.runs.slice(0, 1) }).complete).toBe(false);
      let save = add(freshSecurity(), { kind: 'mission', mission: m });
      for (const r of g.runs) save = add(save, r);
      save = add(save, { kind: 'explain', answer: securityGuidedAnswer[m] });
      expect(securityFacts(restoreSecurity(JSON.stringify(save)).save).completed).toHaveLength(1);
    }
  });
  it('navigation and a correct cause alone cannot grant guided credit; active assessment prevents model work', () => {
    let s = add(freshSecurity(), { kind: 'visit', topic: 'studio' });
    expect(securityFacts(s).completed).toHaveLength(0);
    s = add(s, { kind: 'mission', mission: 'defender' });
    expect(applySecurity(s, { kind: 'explain', answer: 0 })).toBeNull();
    s = add(s, { kind: 'begin', item: 'sp01' });
    expect(applySecurity(s, { kind: 'run', input: defender(), prediction: 2 })).toBeNull();
    expect(applySecurity(s, { kind: 'visit', topic: 'zero-trust' })).toBeNull();
  });
});
describe('P15 immutable assessment and durable replay', () => {
  it('evaluates the complete 72-pair relation, including valid alternative scoped and gateway architectures', () => {
    for (const id of securityItemIds)
      for (let d = 0; d < 3; d++)
        for (let r = 0; r < 3; r++)
          expect(evaluateSecurity(id, { decision: d, reason: r }).relation).toBe(
            securityItems[id].accepted.some(([a, b]) => a === d && b === r),
          );
    expect(securityItems.sp08.accepted).toHaveLength(2);
  });
  it('a correct decision with wrong reason fails and helped retry cannot rewrite the first', () => {
    const [decision, reason] = securityItems.sp01.accepted[0];
    let s = add(freshSecurity(), { kind: 'begin', item: 'sp01' });
    s = add(s, { kind: 'draft', answer: { decision, reason: (reason + 1) % 3 } });
    s = add(s, { kind: 'submit' });
    const first = JSON.stringify(securityFacts(s).firsts[0]);
    expect(evaluateSecurity('sp01', securityFacts(s).firsts[0]!.answer).relation).toBe(false);
    s = add(s, { kind: 'begin', item: 'sp01' });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'draft', answer: { decision, reason } });
    s = add(s, { kind: 'submit' });
    expect(JSON.stringify(securityFacts(s).firsts[0])).toBe(first);
    expect(securityFacts(s).current).toMatchObject({ retry: true, assisted: true });
  });
  it('reserves final durable draft/help/submit at event capacity', () => {
    let s = freshSecurity();
    while (s.events.length < securityLimit - 6)
      s = add(s, { kind: 'visit', topic: s.events.length % 2 ? 'zero-trust' : 'defender' });
    s = add(s, { kind: 'begin', item: 'sp01' });
    expect(applySecurity(s, { kind: 'visit', topic: 'encryption' })).toBeNull();
    s = add(s, { kind: 'draft', answer: { decision: 0, reason: 0 } });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'submit' });
    expect(restoreSecurity(JSON.stringify(s)).save).toEqual(s);
    expect(securityFacts(s).firsts[0]!.assisted).toBe(true);
    expect(applySecurity(s, { kind: 'begin', item: 'sp02' })).toBeNull();
  });
  it('rejects unknown versions, invalid/no-op replay and oversized bytes', () => {
    expect(restoreSecurity('{bad').issue).toBe('corrupt');
    expect(restoreSecurity('x'.repeat(600001)).issue).toBe('corrupt');
    expect(restoreSecurity(JSON.stringify({ ...freshSecurity(), model: '2.0.0' })).issue).toBe(
      'unsupported',
    );
    expect(
      restoreSecurity(JSON.stringify({ ...freshSecurity(), events: [{ kind: 'pause' }] })).issue,
    ).toBe('corrupt');
  });
  it('denied and stale writes cannot grant assistance or publish a newer draft', () => {
    const io = new Memory(),
      s = new SecurityStore(io);
    s.load();
    expect(s.event({ kind: 'begin', item: 'sp01' })).toBe(true);
    const raw = io.getItem(securityKey);
    io.fail = true;
    expect(s.prepareTeaching()).toBe(false);
    expect(io.getItem(securityKey)).toBe(raw);
    expect(securityFacts(s.getSnapshot().save).assisted).toBe(false);
    io.fail = false;
    s.load();
    io.setItem(
      securityKey,
      JSON.stringify(
        add(s.getSnapshot().save, { kind: 'draft', answer: { decision: 1, reason: 1 } }),
      ),
    );
    expect(s.event({ kind: 'aid' })).toBe(false);
    expect(s.getSnapshot().issue).toBe('conflict');
  });
  it('scoped recovery compares before deletion and preserves Sandbox and prior records', () => {
    const io = new Memory();
    io.setItem(securityKey, '{bad');
    io.setItem(sandboxKey, 'native');
    io.setItem('azurelab.learning.governance-compliance.v1', 'old');
    const s = new SecurityStore(io);
    s.load();
    io.setItem(securityKey, JSON.stringify(freshSecurity()));
    expect(s.recoverInvalid()).toBe(false);
    io.setItem(securityKey, '{bad');
    s.load();
    expect(s.recoverInvalid()).toBe(true);
    expect(io.getItem(sandboxKey)).toBe('native');
    expect(io.getItem('azurelab.learning.governance-compliance.v1')).toBe('old');
  });
  it('maps all three goals to different original contexts and source claims', () => {
    expect(securityKey).toBe('azurelab.learning.security-principles.v1');
    expect(securityManifest.certificationOverlay.slots).toHaveLength(3);
    for (const goal of Object.keys(securityManifest.objectives))
      expect(
        securityItemIds.filter((id) =>
          (securityItems[id].objectives as readonly string[]).includes(goal),
        ).length,
      ).toBeGreaterThanOrEqual(2);
    expect(securityNb.sections.depth.paragraphs.length).toBeGreaterThan(3);
    for (const id of securityItemIds) {
      expect(securityItemsNb[id].decisions).toHaveLength(3);
      expect(securityItemsNb[id].reasons).toHaveLength(3);
    }
  });
});
