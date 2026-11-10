import { describe, it, expect } from 'vitest';
import { intent, change, arc, toolsContrasts } from '../../../tests/fixtures/management-tools';
import { runIntent, runChange, runArc, runTools, validToolsInput } from './management-tools-model';
import {
  toolsKey,
  toolsLimit,
  toolsItems,
  toolsItemIds,
  toolsManifest,
  toolsFacts,
  toolsGuidedFacts,
  toolsWitnesses,
  toolsGuidedAnswer,
  freshTools,
  applyTools,
  restoreTools,
  evaluateTools,
  type ToolsGuide,
  type ToolsSave,
} from './management-tools';
import { ToolsStore } from './management-tools-store';
import { toolsNativeEvidence } from './management-tools-evidence';
import { SandboxStore, sandboxKey } from '../sandbox/store';
import { toolsItemsNb, toolsNb } from '../../content/nb';
import { toolsSources, toolsSourceReview } from './management-tools-sources';
const add = (s: ToolsSave, e: unknown) => {
  const n = applyTools(s, e);
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
function guide(mission: 'intent' | 'change' | 'arc'): ToolsGuide {
  return {
    id: 1,
    mission,
    attempt: mission === 'intent' ? 1 : null,
    boundary: null,
    through: null,
    inspected: [],
    runs: toolsContrasts[mission].map((input) => ({ kind: 'run', input, prediction: 1 })),
    configuration: {},
    answer: toolsGuidedAnswer[mission],
  };
}
function native() {
  const io = new Memory(),
    store = new SandboxStore(io);
  store.load();
  let id = 0;
  const command = (command: Record<string, string>) => {
    expect(
      store.dispatch({
        kind: 'command',
        request: {
          commandId: `tools-test-${++id}`,
          expectedWorldRevision: store.getSnapshot().attempt.engine.world.revision,
          command,
        },
      }),
    ).toBe(true);
    return store.getSnapshot().attempt.responses.at(-1)!;
  };
  const ge = command({
    type: 'CreateGroup',
    subscriptionId: 'sub-app',
    name: 'rg-tools',
    metadataRegion: 'norwayeast',
  });
  const group = ge.addedIds[0]!;
  const pe = command({
    type: 'CreatePlan',
    groupId: group,
    name: 'plan-tools',
    region: 'westeurope',
    profile: 'linux-learning-v1',
  });
  const plan = pe.addedIds[0]!;
  const ae = command({ type: 'CreateWebApp', groupId: group, planId: plan, name: 'app-tools' });
  const app = ae.addedIds[0]!;
  const g = guide('intent');
  g.through = ae.commandId;
  g.inspected = [
    'resource:sub-app',
    ...[group, plan, app].map((x) => 'resource:' + x),
    ...[ge, pe, ae].map((x) => 'receipt:' + x.commandId),
    'dependency:' + app,
  ];
  return { io, store, g, group, plan, app, ge, pe, ae, engine: store.getSnapshot().attempt.engine };
}
describe('P13 distinct management tools and declared prerequisites', () => {
  it('does not equate Cloud Shell with a particular command syntax', () => {
    expect(runIntent(intent({ tool: 'cli', host: 'cloud-pwsh' }))?.ready).toBe(true);
    expect(runIntent(intent({ tool: 'powershell', host: 'cloud-bash' }))).toMatchObject({
      ready: false,
      outcome: 0,
    });
    expect(runIntent(intent({ tool: 'powershell', host: 'cloud-pwsh' }))?.ready).toBe(true);
  });
  it('requires a locally installed CLI but hosted tool installation is declared preinstalled', () => {
    expect(runIntent(intent())?.ready).toBe(false);
    expect(runIntent(intent({ installed: true }))?.ready).toBe(true);
    expect(runIntent(intent({ host: 'cloud-bash' }))?.ready).toBe(true);
  });
  it('a definition can be authored without selecting a shell runtime, but submission prerequisites stay separate', () => {
    expect(
      runIntent(intent({ tool: 'bicep', host: 'browser', authenticated: false })),
    ).toMatchObject({
      definition: true,
      ready: false,
      prerequisites: { hostCompatible: true },
      actualRequest: false,
    });
  });
  it('has no single always-best tool and preserves the intended subscription and RG metadata region', () => {
    for (const input of toolsContrasts.intent.slice(1)) {
      expect(runIntent(input)).toMatchObject({
        ready: true,
        provider: 'Microsoft.Resources',
        requestScope: 'subscription',
        groupMetadataRegion: 'norwayeast',
        actualReceipt: false,
        actualApplicationHealth: false,
      });
    }
  });
  it('missing permission, provider, policy or lock prerequisites cannot become success', () => {
    for (const key of ['authorized', 'providerReady', 'policyAllows', 'lockAllows'] as const)
      expect(runIntent(intent({ installed: true, [key]: false }))?.ready).toBe(false);
  });
});
describe('P13 typed declarative references and change uncertainty', () => {
  it('ARM resourceId alone does not order creation of a new referenced plan', () => {
    expect(runChange(change())).toMatchObject({
      referenceValid: true,
      missingOrder: true,
      ready: false,
    });
    expect(runChange(change({ order: 'explicit' }))).toMatchObject({
      ready: true,
      effectiveOrder: 'explicit',
    });
  });
  it('a Bicep symbolic reference derives ordering while a cyclic graph stays invalid', () => {
    expect(runChange(change({ syntax: 'bicep' }))).toMatchObject({ implicit: true, ready: true });
    expect(runChange(change({ syntax: 'bicep', order: 'cycle' }))).toMatchObject({
      cycle: true,
      ready: false,
    });
  });
  it('an already existing declared plan needs no new-plan deployment edge', () => {
    expect(runChange(change({ baseline: 'dev' }))).toMatchObject({
      planNew: false,
      missingOrder: false,
      ready: true,
    });
  });
  it('a dependency cannot repair a dangling or absent-scope reference', () => {
    for (const binding of ['dangling', 'wrong-scope'] as const)
      for (const syntax of ['arm', 'bicep'] as const)
        expect(runChange(change({ binding, syntax, order: 'explicit' }))).toMatchObject({
          referenceValid: false,
          structureValid: false,
          ready: false,
        });
  });
  it('compares each existing resource independently when only the app reference changes', () => {
    for (const binding of ['dangling', 'wrong-scope'] as const) {
      const input = change({ baseline: 'dev', binding, order: 'explicit' }),
        result = runChange(input)!;
      expect(result).toMatchObject({
        referenceValid: false,
        structureValid: false,
        ready: false,
        actualDeployment: false,
      });
      expect(result.changes.map((x) => x.change)).toEqual(['no-change', 'modify']);
      expect(result.changes[0]!.before).toEqual(result.changes[0]!.desired);
      expect(result.changes[1]!.before).not.toEqual(result.changes[1]!.desired);
      expect(
        runChange({ ...input, evaluation: 'unresolved' })!.changes.map((x) => x.change),
      ).toEqual(['unknown', 'unknown']);
    }
  });
  it('parameters affect desired names and selected fields; incremental retains old resources', () => {
    const base = change({ baseline: 'dev', order: 'explicit' });
    expect(runChange(base)?.changes.every((x) => x.change === 'no-change')).toBe(true);
    expect(
      runChange({ ...base, costCenter: 'sales' })?.changes.every((x) => x.change === 'modify'),
    ).toBe(true);
    const next = runChange({ ...base, stage: 'prod' })!;
    expect(next.changes.every((x) => x.change === 'create')).toBe(true);
    expect(next.retainedOld).toEqual(['plan-fjord-dev', 'fjord-dev']);
  });
  it('an unresolved preview never asserts a definite NoChange or successful deployment', () => {
    const r = runChange(change({ baseline: 'dev', evaluation: 'unresolved' }))!;
    expect(r).toMatchObject({ ready: false, previewUnresolved: true, actualDeployment: false });
    expect(r.changes.every((x) => x.change === 'unknown')).toBe(true);
  });
  it('a valid definition does not bypass authorization, provider registration or governance', () => {
    for (const key of ['authorized', 'providerReady', 'policyAllows', 'lockAllows'] as const)
      expect(runChange(change({ syntax: 'bicep', [key]: false }))?.ready).toBe(false);
  });
});
describe('P13 Arc is a resource-specific administrative representation', () => {
  it('generic Arc Servers does not relocate an external workload', () => {
    expect(runArc(arc({ approach: 'servers' }))).toMatchObject({
      physical: 'onprem',
      represented: true,
      migrated: false,
      actualOnboarding: false,
      actualAgent: false,
    });
  });
  it('ordinary Azure VMs use native management, not generic Arc Servers onboarding', () => {
    expect(runArc(arc({ resource: 'azure-vm', approach: 'servers' }))?.correctApproach).toBe(false);
    expect(runArc(arc({ resource: 'azure-vm', approach: 'native' }))?.capabilityReady).toBe(true);
  });
  it('a generic representation does not offer the underlying cloud VM resize operation', () => {
    expect(
      runArc(arc({ resource: 'othercloud-server', approach: 'servers', capability: 'resize-vm' })),
    ).toMatchObject({ represented: true, supported: false, capabilityReady: false });
  });
  it('selects Kubernetes and data integrations with their own declared prerequisites', () => {
    expect(
      runArc(arc({ resource: 'onprem-kubernetes', approach: 'servers' }))?.correctApproach,
    ).toBe(false);
    expect(
      runArc(
        arc({
          resource: 'onprem-kubernetes',
          approach: 'kubernetes',
          capability: 'gitops',
          extension: false,
        }),
      ),
    ).toMatchObject({ supported: true, extensionNeeded: true, capabilityReady: false });
    expect(
      runArc(
        arc({
          resource: 'sql-mi',
          approach: 'data',
          capability: 'sql-service',
          prerequisites: false,
        }),
      )?.capabilityReady,
    ).toBe(false);
  });
  it('a disconnected representation persists, without promising a fresh Azure change or halting local Flux', () => {
    expect(runArc(arc({ approach: 'servers', connected: false }))).toMatchObject({
      represented: true,
      stale: true,
      available: false,
      capabilityReady: false,
      localReconciliation: 'not-evaluated',
      actualApplicationHealth: false,
    });
  });
});
describe('P13 stored causal work and original technical proof', () => {
  it('rejects arbitrary code, unknown fields and runtime values', () => {
    expect(validToolsInput({ ...intent(), command: 'az login' })).toBe(false);
    expect(validToolsInput({ ...change(), binding: 'evaluate-code' })).toBe(false);
    expect(validToolsInput({ ...arc(), connected: 'yes' })).toBe(false);
    expect(runTools({ kind: 'cli' })).toBeNull();
  });
  it('credits matched causal contrasts, not visits or arbitrary click sequences', () => {
    for (const mission of ['change', 'arc'] as const)
      expect(toolsGuidedFacts(guide(mission)).complete).toBe(true);
    expect(toolsFacts(add(freshTools(), { kind: 'visit', topic: 'studio' })).completed).toEqual([]);
    const g = guide('change');
    g.runs[1]!.input = change({ order: 'explicit', stage: 'prod' });
    expect(toolsWitnesses(g)[0]).toBe(false);
  });
  it('requires explicit native inspections of new group/plan/app and their original receipts/dependency', () => {
    const x = native(),
      raw = x.io.getItem(sandboxKey);
    const proof = toolsNativeEvidence(x.g, x.engine, 1);
    expect(proof).toMatchObject({
      verifiable: true,
      complete: true,
      group: x.group,
      plan: x.plan,
      app: x.app,
    });
    expect(toolsGuidedFacts(x.g).complete).toBe(false);
    expect(toolsGuidedFacts(x.g, proof.complete).complete).toBe(true);
    expect(x.io.getItem(sandboxKey)).toBe(raw);
  });
  it('fails closed for old, future, wrong-attempt, missing and forged technical prefixes', () => {
    const x = native();
    expect(toolsNativeEvidence({ ...x.g, boundary: x.ae.commandId }, x.engine, 1).complete).toBe(
      false,
    );
    expect(toolsNativeEvidence(x.g, x.engine, 2).complete).toBe(false);
    expect(toolsNativeEvidence(x.g, undefined, 1).complete).toBe(false);
    expect(toolsNativeEvidence({ ...x.g, through: 'future' }, x.engine, 1).verifiable).toBe(false);
    const forged = structuredClone(x.engine);
    forged.ledger[0]!.receipt.addedIds = ['invented'];
    expect(toolsNativeEvidence(x.g, forged, 1).complete).toBe(false);
  });
  it('missing original receipt or explicit dependency inspection withholds guided credit', () => {
    const x = native();
    for (const ref of ['dependency:' + x.app, 'receipt:' + x.pe.commandId])
      expect(
        toolsNativeEvidence(
          { ...x.g, inspected: x.g.inspected.filter((v) => v !== ref) },
          x.engine,
          1,
        ).complete,
      ).toBe(false);
  });
  it('a conceptual run cannot mutate World, receipts, XP or an older learning key', () => {
    const x = native();
    x.io.setItem('azurelab.learning.governance-compliance.v1', 'old');
    const before = JSON.stringify([...x.io.map]);
    for (const list of Object.values(toolsContrasts)) for (const input of list) runTools(input);
    expect(JSON.stringify([...x.io.map])).toBe(before);
  });
});
describe('P13 immutable assessment and durable replay', () => {
  it('evaluates the complete 90-pair relation, including both valid reviewed IaC architectures', () => {
    for (const id of toolsItemIds)
      for (let d = 0; d < 3; d++)
        for (let r = 0; r < 3; r++)
          expect(evaluateTools(id, { decision: d, reason: r }).relation).toBe(
            toolsItems[id].accepted.some(([a, b]) => a === d && b === r),
          );
    expect(toolsItems.mt07.accepted).toHaveLength(2);
  });
  it('a correct decision with wrong reason fails and helped retry cannot rewrite the first', () => {
    const [decision, reason] = toolsItems.mt01.accepted[0];
    let s = add(freshTools(), { kind: 'begin', item: 'mt01' });
    s = add(s, { kind: 'draft', answer: { decision, reason: (reason + 1) % 3 } });
    s = add(s, { kind: 'submit' });
    const first = JSON.stringify(toolsFacts(s).firsts[0]);
    expect(evaluateTools('mt01', toolsFacts(s).firsts[0]!.answer).relation).toBe(false);
    s = add(s, { kind: 'begin', item: 'mt01' });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'draft', answer: { decision, reason } });
    s = add(s, { kind: 'submit' });
    expect(JSON.stringify(toolsFacts(s).firsts[0])).toBe(first);
    expect(toolsFacts(s).current).toMatchObject({ retry: true, assisted: true });
  });
  it('reserves final durable draft/help/submit at event capacity', () => {
    let s = freshTools();
    while (s.events.length < toolsLimit - 6)
      s = add(s, { kind: 'visit', topic: s.events.length % 2 ? 'portal' : 'arc' });
    s = add(s, { kind: 'begin', item: 'mt01' });
    expect(applyTools(s, { kind: 'visit', topic: 'shell' })).toBeNull();
    s = add(s, { kind: 'draft', answer: { decision: 0, reason: 0 } });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'submit' });
    expect(restoreTools(JSON.stringify(s)).save).toEqual(s);
    expect(toolsFacts(s).firsts[0]!.assisted).toBe(true);
    expect(applyTools(s, { kind: 'begin', item: 'mt02' })).toBeNull();
  });
  it('rejects unknown versions, invalid/no-op replay and oversized bytes', () => {
    expect(restoreTools('{bad').issue).toBe('corrupt');
    expect(restoreTools('x'.repeat(600001)).issue).toBe('corrupt');
    expect(restoreTools(JSON.stringify({ ...freshTools(), model: '2.0.0' })).issue).toBe(
      'unsupported',
    );
    expect(
      restoreTools(JSON.stringify({ ...freshTools(), events: [{ kind: 'pause' }] })).issue,
    ).toBe('corrupt');
  });
  it('denied and stale writes cannot grant assistance or publish a newer draft', () => {
    const io = new Memory(),
      s = new ToolsStore(io);
    s.load();
    expect(s.event({ kind: 'begin', item: 'mt01' })).toBe(true);
    const raw = io.getItem(toolsKey);
    io.fail = true;
    expect(s.prepareTeaching()).toBe(false);
    expect(io.getItem(toolsKey)).toBe(raw);
    expect(toolsFacts(s.getSnapshot().save).assisted).toBe(false);
    io.fail = false;
    s.load();
    io.setItem(
      toolsKey,
      JSON.stringify(
        add(s.getSnapshot().save, { kind: 'draft', answer: { decision: 1, reason: 1 } }),
      ),
    );
    expect(s.event({ kind: 'aid' })).toBe(false);
    expect(s.getSnapshot().issue).toBe('conflict');
  });
  it('scoped recovery compares before deletion and preserves Sandbox and prior records', () => {
    const io = new Memory();
    io.setItem(toolsKey, '{bad');
    io.setItem(sandboxKey, 'native');
    io.setItem('azurelab.learning.governance-compliance.v1', 'old');
    const s = new ToolsStore(io);
    s.load();
    io.setItem(toolsKey, JSON.stringify(freshTools()));
    expect(s.recoverInvalid()).toBe(false);
    io.setItem(toolsKey, '{bad');
    s.load();
    expect(s.recoverInvalid()).toBe(true);
    expect(io.getItem(sandboxKey)).toBe('native');
    expect(io.getItem('azurelab.learning.governance-compliance.v1')).toBe('old');
  });
  it('maps all five scoped goals to two different reviewed contexts and current source claims', () => {
    expect(toolsKey).toBe('azurelab.learning.management-tools.v1');
    expect(toolsManifest.certificationOverlay.slots).toHaveLength(5);
    expect(Object.keys(toolsSources)).toHaveLength(40);
    expect(toolsSourceReview).toBeTruthy();
    for (const objective of Object.keys(toolsManifest.objectives))
      expect(
        toolsItemIds.filter((id) =>
          (toolsItems[id].objectives as readonly string[]).includes(objective),
        ).length,
      ).toBeGreaterThanOrEqual(2);
    for (const id of toolsItemIds) {
      expect(toolsItemsNb[id].decisions).toHaveLength(3);
      expect(toolsItemsNb[id].reasons).toHaveLength(3);
    }
    expect(toolsNb.sections.copilot.paragraphs.length).toBeGreaterThan(0);
  });
});
