import { describe, it, expect } from 'vitest';
import { parseLocation, portalHref } from '../portal/model';
import {
  evidence,
  health,
  telemetry,
  monitoringContrasts,
} from '../../../tests/fixtures/monitoring';
import {
  runEvidence,
  runHealth,
  runTelemetry,
  runMonitoring,
  validMonitoringInput,
} from './monitoring-model';
import {
  monitoringKey,
  monitoringLimit,
  monitoringItems,
  monitoringItemIds,
  monitoringManifest,
  monitoringFacts,
  monitoringGuidedFacts,
  monitoringWitnesses,
  monitoringGuidedAnswer,
  freshMonitoring,
  applyMonitoring,
  restoreMonitoring,
  evaluateMonitoring,
  type MonitoringGuide,
  type MonitoringSave,
} from './monitoring';
import { MonitoringStore } from './monitoring-store';
import { sandboxKey } from '../sandbox/store';
import { monitoringNb, monitoringItemsNb } from '../../content/nb';
const add = (s: MonitoringSave, e: unknown) => {
  const n = applyMonitoring(s, e);
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
function guide(mission: MonitoringGuide['mission']): MonitoringGuide {
  return {
    id: 1,
    mission,
    runs: monitoringContrasts[mission].map((input) => ({ kind: 'run', input, prediction: 1 })),
    configuration: {},
    answer: monitoringGuidedAnswer[mission],
  };
}
describe('P14 Portal navigation preserves its originating conceptual view', () => {
  it('roundtrips all three views, rejects mixed contexts and retains old inspect links', () => {
    for (const perspective of ['evidence', 'health', 'telemetry']) {
      const p = parseLocation(new URLSearchParams('monitoring=inspect&perspective=' + perspective));
      expect(p.monitoring).toBe(perspective);
      expect(
        parseLocation(new URLSearchParams(portalHref(p, 'groups').split('?')[1])).monitoring,
      ).toBe(perspective);
    }
    expect(parseLocation(new URLSearchParams('monitoring=inspect')).monitoring).toBe('telemetry');
    expect(
      parseLocation(new URLSearchParams('monitoring=inspect&tools=intent')).monitoring,
    ).toBeUndefined();
    expect(
      parseLocation(new URLSearchParams('monitoring=inspect&tools=intent')).tools,
    ).toBeUndefined();
  });
});
describe('P14 pure observation mechanisms', () => {
  it('rejects unknown fields and never infers real runtime from any declared observation', () => {
    expect(validMonitoringInput({ ...telemetry(), world: {} })).toBe(false);
    expect(runMonitoring({ kind: 'telemetry', signal: 'memory' })).toBeNull();
    for (const inputs of Object.values(monitoringContrasts))
      for (const input of inputs) {
        const r = runMonitoring(input)!;
        expect(r).toMatchObject({
          synthetic: true,
          actualTelemetry: false,
          actualNotification: false,
          actualRemediation: false,
          actualAzureIncident: false,
          actualWorldMutation: false,
        });
        expect(runMonitoring(input)).toEqual(r);
      }
  });
  it('separates recommendation categories, wrong source, missing and stale evidence', () => {
    for (const category of [
      'cost',
      'security',
      'reliability',
      'performance',
      'operations',
    ] as const) {
      const x = evidence({ question: `${category}-review` });
      expect(runEvidence(x)).toMatchObject({ supported: true, category, confirmedOutage: false });
      expect(runEvidence({ ...x, fresh: false })?.supported).toBe(false);
    }
    expect(runEvidence(evidence())?.supported).toBe(false);
    expect(
      runEvidence(evidence({ tool: 'log-analytics', signal: 'correlated-records' }))?.supported,
    ).toBe(true);
  });
  it('personal scope is independent of public notice; region correlation cannot prove cause', () => {
    expect(runHealth(health())).toMatchObject({
      relevant: true,
      globalVisible: false,
      healthAvailable: true,
      appFailureObserved: true,
      platformCauseConfirmed: false,
      applicationHealthyProven: false,
    });
    for (const change of [
      { subscription: 'shared' },
      { region: 'northeurope' },
      { resourceType: 'vm' },
    ] as const)
      expect(runHealth(health(change))?.relevant).toBe(false);
    expect(runHealth(health({ event: 'maintenance' }))?.maintenanceDowntimeProven).toBe(false);
  });
  it('Unknown, unsupported and historical health are not an invented current outage', () => {
    expect(runHealth(health({ health: 'unknown' }))).toMatchObject({
      healthUnavailable: false,
      currentHealth: 'unknown',
    });
    expect(runHealth(health({ supported: false }))?.currentHealth).toBe('unknown');
    expect(runHealth(health({ inspection: 'after' }))).toMatchObject({
      eventActive: false,
      currentHealth: 'unknown',
      appSignalMissing: true,
    });
  });
  it('uses the chosen exclusive-left window, equal weighting, strict threshold and aggregation', () => {
    expect(runTelemetry(telemetry({ aggregation: 'average' }))).toMatchObject({
      observedAggregate: 66,
      conditionMet: false,
      validCount: 5,
    });
    expect(
      runTelemetry(telemetry({ window: 3, aggregation: 'average' }))?.observedAggregate,
    ).toBeCloseTo(220 / 3);
    expect(
      runTelemetry(telemetry({ threshold: 50, window: 3, aggregation: 'maximum' }))?.conditionMet,
    ).toBe(true);
    expect(runTelemetry(telemetry({ fixture: 'quiet', threshold: 50 }))?.conditionMet).toBe(false);
    expect(
      runTelemetry(
        telemetry({ window: 3, aggregation: 'average', fixture: 'morning' }),
      )?.selected.map((p) => p.minute),
    ).toEqual(['08:03', '08:04', '08:05']);
    expect(
      runTelemetry(telemetry({ aggregation: 'maximum', threshold: 70 }))?.observedAggregate,
    ).toBe(90);
  });
  it('NULL remains missing, available aggregate is separate from the teaching coverage gate', () => {
    const r = runTelemetry(
      telemetry({ coverage: 'gap', aggregation: 'average', rule: 'enabled' }),
    )!;
    expect(r.points[4]?.value).toBeNull();
    expect(r.observedAggregate).toBe(62.5);
    expect(r.conditionMet).toBeNull();
    expect(r.assessment).toBe('insufficient-data');
    expect(runTelemetry(telemetry({ coverage: 'none' }))?.observedAggregate).toBeNull();
    expect(
      runTelemetry(telemetry({ signal: 'duration', instrumented: false }))?.metricAvailable,
    ).toBe(false);
  });
  it('condition, configured matching rule and notification route are separate and never remediation', () => {
    expect(runTelemetry(telemetry())).toMatchObject({
      conditionMet: true,
      fired: false,
      assessment: 'not-configured',
    });
    expect(runTelemetry(telemetry({ rule: 'disabled' }))?.fired).toBe(false);
    expect(runTelemetry(telemetry({ rule: 'enabled', ruleSignal: 'duration' }))?.assessment).toBe(
      'different-signal',
    );
    expect(runTelemetry(telemetry({ rule: 'enabled' }))).toMatchObject({
      fired: true,
      notificationPath: false,
    });
    expect(runTelemetry(telemetry({ rule: 'enabled', actionGroup: true }))).toMatchObject({
      notificationPath: true,
      actualNotification: false,
      actualRemediation: false,
      userResponse: 'not-modeled',
    });
  });
  it('workspace routing and instrumentation cannot be invented from no rows; filters do not create rules', () => {
    expect(runTelemetry(telemetry())).toMatchObject({
      logsAvailable: false,
      records: [],
      queryCreatesRule: false,
    });
    const r = runTelemetry(telemetry({ routed: true, filter: 'errors' }))!;
    expect(r.records).toHaveLength(1);
    expect(r.records[0]?.code).toBe('500');
    expect(runTelemetry(telemetry({ routed: true, access: false }))?.logsAvailable).toBe(false);
    expect(
      runTelemetry(telemetry({ logSource: 'application', instrumented: true, routed: false }))
        ?.traceRows,
    ).toHaveLength(3);
    expect(
      runTelemetry(
        telemetry({
          logSource: 'application',
          instrumented: true,
          fixture: 'quiet',
          filter: 'errors',
        }),
      ),
    ).toMatchObject({
      logsAvailable: true,
      records: [],
      traceRows: [],
      traceCauseConfirmed: false,
    });
  });
  it('all three guided causal results require matched persisted contrasts and explicit explanation', () => {
    for (const m of ['evidence', 'health', 'telemetry'] as const) {
      const g = guide(m);
      expect(monitoringWitnesses(g).every(Boolean)).toBe(true);
      expect(monitoringGuidedFacts(g).complete).toBe(true);
      expect(monitoringGuidedFacts({ ...g, answer: null }).complete).toBe(false);
      expect(monitoringGuidedFacts({ ...g, runs: g.runs.slice(0, 1) }).complete).toBe(false);
      let save = add(freshMonitoring(), { kind: 'mission', mission: m });
      for (const r of g.runs) save = add(save, r);
      save = add(save, { kind: 'explain', answer: monitoringGuidedAnswer[m] });
      expect(monitoringFacts(restoreMonitoring(JSON.stringify(save)).save).completed).toHaveLength(
        1,
      );
    }
  });
  it('navigation and a correct cause alone cannot grant guided credit; active assessment prevents model work', () => {
    let s = add(freshMonitoring(), { kind: 'visit', topic: 'studio' });
    expect(monitoringFacts(s).completed).toHaveLength(0);
    s = add(s, { kind: 'mission', mission: 'telemetry' });
    expect(applyMonitoring(s, { kind: 'explain', answer: 0 })).toBeNull();
    s = add(s, { kind: 'begin', item: 'md01' });
    expect(applyMonitoring(s, { kind: 'run', input: telemetry(), prediction: 2 })).toBeNull();
    expect(applyMonitoring(s, { kind: 'visit', topic: 'advisor' })).toBeNull();
  });
});
describe('P14 immutable assessment and durable replay', () => {
  it('evaluates the complete 72-pair relation, including both valid reviewed correlated investigation views', () => {
    for (const id of monitoringItemIds)
      for (let d = 0; d < 3; d++)
        for (let r = 0; r < 3; r++)
          expect(evaluateMonitoring(id, { decision: d, reason: r }).relation).toBe(
            monitoringItems[id].accepted.some(([a, b]) => a === d && b === r),
          );
    expect(monitoringItems.md06.accepted).toHaveLength(2);
  });
  it('a correct decision with wrong reason fails and helped retry cannot rewrite the first', () => {
    const [decision, reason] = monitoringItems.md01.accepted[0];
    let s = add(freshMonitoring(), { kind: 'begin', item: 'md01' });
    s = add(s, { kind: 'draft', answer: { decision, reason: (reason + 1) % 3 } });
    s = add(s, { kind: 'submit' });
    const first = JSON.stringify(monitoringFacts(s).firsts[0]);
    expect(evaluateMonitoring('md01', monitoringFacts(s).firsts[0]!.answer).relation).toBe(false);
    s = add(s, { kind: 'begin', item: 'md01' });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'draft', answer: { decision, reason } });
    s = add(s, { kind: 'submit' });
    expect(JSON.stringify(monitoringFacts(s).firsts[0])).toBe(first);
    expect(monitoringFacts(s).current).toMatchObject({ retry: true, assisted: true });
  });
  it('reserves final durable draft/help/submit at event capacity', () => {
    let s = freshMonitoring();
    while (s.events.length < monitoringLimit - 6)
      s = add(s, { kind: 'visit', topic: s.events.length % 2 ? 'advisor' : 'health' });
    s = add(s, { kind: 'begin', item: 'md01' });
    expect(applyMonitoring(s, { kind: 'visit', topic: 'logs' })).toBeNull();
    s = add(s, { kind: 'draft', answer: { decision: 0, reason: 0 } });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'submit' });
    expect(restoreMonitoring(JSON.stringify(s)).save).toEqual(s);
    expect(monitoringFacts(s).firsts[0]!.assisted).toBe(true);
    expect(applyMonitoring(s, { kind: 'begin', item: 'md02' })).toBeNull();
  });
  it('rejects unknown versions, invalid/no-op replay and oversized bytes', () => {
    expect(restoreMonitoring('{bad').issue).toBe('corrupt');
    expect(restoreMonitoring('x'.repeat(600001)).issue).toBe('corrupt');
    expect(restoreMonitoring(JSON.stringify({ ...freshMonitoring(), model: '2.0.0' })).issue).toBe(
      'unsupported',
    );
    expect(
      restoreMonitoring(JSON.stringify({ ...freshMonitoring(), events: [{ kind: 'pause' }] }))
        .issue,
    ).toBe('corrupt');
  });
  it('denied and stale writes cannot grant assistance or publish a newer draft', () => {
    const io = new Memory(),
      s = new MonitoringStore(io);
    s.load();
    expect(s.event({ kind: 'begin', item: 'md01' })).toBe(true);
    const raw = io.getItem(monitoringKey);
    io.fail = true;
    expect(s.prepareTeaching()).toBe(false);
    expect(io.getItem(monitoringKey)).toBe(raw);
    expect(monitoringFacts(s.getSnapshot().save).assisted).toBe(false);
    io.fail = false;
    s.load();
    io.setItem(
      monitoringKey,
      JSON.stringify(
        add(s.getSnapshot().save, { kind: 'draft', answer: { decision: 1, reason: 1 } }),
      ),
    );
    expect(s.event({ kind: 'aid' })).toBe(false);
    expect(s.getSnapshot().issue).toBe('conflict');
  });
  it('scoped recovery compares before deletion and preserves Sandbox and prior records', () => {
    const io = new Memory();
    io.setItem(monitoringKey, '{bad');
    io.setItem(sandboxKey, 'native');
    io.setItem('azurelab.learning.governance-compliance.v1', 'old');
    const s = new MonitoringStore(io);
    s.load();
    io.setItem(monitoringKey, JSON.stringify(freshMonitoring()));
    expect(s.recoverInvalid()).toBe(false);
    io.setItem(monitoringKey, '{bad');
    s.load();
    expect(s.recoverInvalid()).toBe(true);
    expect(io.getItem(sandboxKey)).toBe('native');
    expect(io.getItem('azurelab.learning.governance-compliance.v1')).toBe('old');
  });
  it('maps all three goals to different original contexts and source claims', () => {
    expect(monitoringKey).toBe('azurelab.learning.monitoring-diagnostics.v1');
    expect(monitoringManifest.certificationOverlay.slots).toHaveLength(3);
    for (const goal of Object.keys(monitoringManifest.objectives))
      expect(
        monitoringItemIds.filter((id) =>
          (monitoringItems[id].objectives as readonly string[]).includes(goal),
        ).length,
      ).toBeGreaterThanOrEqual(2);
    expect(monitoringNb.sections.insights.paragraphs.length).toBeGreaterThan(3);
    for (const id of monitoringItemIds) {
      expect(monitoringItemsNb[id].decisions).toHaveLength(3);
      expect(monitoringItemsNb[id].reasons).toHaveLength(3);
    }
  });
});
