import { accessContrasts } from '../../../tests/fixtures/access';
import { describe, it, expect } from 'vitest';
import {
  initialAccess,
  runRbac,
  runConditional,
  validAccessInput,
  scopePath,
  sandboxScopeContext,
  roles,
  roleAllows,
  type RbacInput,
  type ConditionalInput,
} from './access-control-model';
import {
  accessItems,
  accessItemIds,
  accessKey,
  accessLimit,
  accessTopics,
  freshAccess,
  applyAccess,
  accessFacts,
  restoreAccess,
  evaluateAccess,
  accessWitnesses,
  accessGuidedAnswer,
  accessMissions,
  type AccessSave,
} from './access-control';
import { AccessStore } from './access-control-store';
import { accessNb, accessItemsNb } from '../../content/nb';
import { accessSources } from './access-control-sources';
import { guidedFixture } from '../chapter01/model';
const r = (change: Partial<RbacInput> = {}) =>
  ({ ...initialAccess('rbac'), ...change }) as RbacInput;
const c = (change: Partial<ConditionalInput> = {}) =>
  ({ ...initialAccess('conditional'), ...change }) as ConditionalInput;
const add = (s: AccessSave, e: unknown) => {
  const next = applyAccess(s, e);
  expect(next).not.toBeNull();
  return next!;
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
describe('P11 declared RBAC semantics', () => {
  it('requires correct principal and declared group membership', () => {
    expect(runRbac(r())?.allowed).toBe(true);
    expect(runRbac(r({ assignment: 'group', member: false }))?.allowed).toBe(false);
    expect(runRbac(r({ assignment: 'group', member: true }))?.allowed).toBe(true);
    expect(runRbac(r({ principal: 'managed', assignment: 'user' }))?.allowed).toBe(false);
    expect(runRbac(r({ principal: 'managed', assignment: 'managed' }))?.allowed).toBe(true);
  });
  it('inherits downward, never upward, sideways or into another subscription', () => {
    for (const scope of ['mg', 'sub-app', 'rg-app', 'vm'])
      expect(runRbac(r({ scope }))?.allowed).toBe(true);
    for (const scope of ['sub-shared', 'rg-other', 'container'])
      expect(runRbac(r({ scope }))?.allowed).toBe(false);
    expect(runRbac(r({ scope: 'vm', target: 'rg-app' }))?.allowed).toBe(false);
    expect(scopePath(r().context, 'vm').map((n) => n.id)).toEqual([
      'mg',
      'sub-app',
      'rg-app',
      'vm',
    ]);
  });
  it('does not make Contributor Owner or Reader a writer', () => {
    expect(runRbac(r({ action: 'modify-vm' }))?.allowed).toBe(false);
    expect(runRbac(r({ role: 'contributor', action: 'modify-vm' }))?.allowed).toBe(true);
    expect(runRbac(r({ role: 'contributor', action: 'assign-role' }))?.allowed).toBe(false);
    for (const role of ['owner', 'rbac-admin'] as const)
      expect(runRbac(r({ role, action: 'assign-role' }))?.allowed).toBe(true);
    expect(runRbac(r({ role: 'rbac-admin', action: 'modify-vm' }))?.allowed).toBe(false);
    expect(runRbac(r({ role: 'entra-admin' }))?.allowed).toBe(false);
  });
  it('qualifies management/data routes and indirect possibilities', () => {
    for (const role of ['reader', 'contributor', 'owner', 'vm-contributor'] as const)
      expect(runRbac(r({ role, target: 'container', action: 'read-blob' }))?.allowed).toBe(false);
    expect(
      runRbac(r({ role: 'blob-reader', target: 'container', action: 'read-blob' }))?.allowed,
    ).toBe(true);
    expect(
      runRbac(r({ role: 'blob-reader', target: 'container', action: 'read-blob', route: 'other' })),
    ).toMatchObject({ withinModel: false, outcome: 1 });
    expect(runRbac(r({ role: 'owner', action: 'read-blob' }))?.outcome).toBe(1);
  });
  it('NotActions does not deny other grants; explicit deny remains distinct', () => {
    expect(runRbac(r({ role: 'custom-no-delete', action: 'delete-vm' }))?.allowed).toBe(false);
    expect(
      runRbac(r({ role: 'custom-no-delete', second: 'contributor', action: 'delete-vm' }))?.allowed,
    ).toBe(true);
    expect(
      runRbac(
        r({ role: 'custom-no-delete', second: 'contributor', action: 'delete-vm', deny: true }),
      ),
    ).toMatchObject({ covered: true, allowed: false, cause: 'deny' });
  });
  it('keeps additive generic-resource grants and uncertainty independent of role order', () => {
    for (const role of roles)
      for (const second of roles) {
        const input = r({ role, second, scope: 'rg-app', target: 'account', action: 'view' });
        const forward = runRbac(input)!,
          reversed = runRbac({ ...input, role: second, second: role })!;
        for (const key of ['withinModel', 'covered', 'allowed', 'cause', 'outcome'] as const)
          expect(forward[key], `${role}+${second}: ${key}`).toEqual(reversed[key]);
      }
    for (const [role, second] of [
      ['vm-contributor', 'reader'],
      ['reader', 'vm-contributor'],
    ] as const)
      expect(
        runRbac(r({ role, second, scope: 'rg-app', target: 'account', action: 'view' })),
      ).toMatchObject({
        grantingRoles: ['reader'],
        withinModel: true,
        allowed: true,
        outcome: 2,
        cause: 'allowed',
      });
    for (const [role, second] of [
      ['vm-contributor', 'none'],
      ['none', 'vm-contributor'],
    ] as const)
      expect(
        runRbac(r({ role, second, scope: 'rg-app', target: 'account', action: 'view' })),
      ).toMatchObject({ withinModel: false, allowed: false, outcome: 1, cause: 'outside' });
  });
  it('shows breadth without inventing a unique universal minimum', () => {
    const broad = runRbac(r({ role: 'owner', scope: 'mg', action: 'modify-vm' }))!,
      narrow = runRbac(r({ role: 'vm-contributor', scope: 'vm', action: 'modify-vm' }))!;
    expect(broad.allowed && narrow.allowed).toBe(true);
    expect(broad.scopeBreadth).toBeGreaterThan(narrow.scopeBreadth);
    expect(narrow.scopeBreadth).toBe(1);
  });
  it('captures read-only actual ancestry without changing World', () => {
    const world = structuredClone(guidedFixture);
    world.groups.push({
      id: 'rg-actual',
      name: 'actual-group',
      subscriptionId: 'sub-app',
      metadataLocation: 'westeurope',
    });
    const before = JSON.stringify(world);
    const context = sandboxScopeContext(world, 'rg-actual')!;
    expect(context.origin).toBe('sandbox');
    expect(context.nodes.some((n) => n.id === 'rg-actual')).toBe(true);
    expect(runRbac(r({ context, target: 'rg-actual', scope: 'sub-app' }))?.allowed).toBe(true);
    expect(JSON.stringify(world)).toBe(before);
    expect(sandboxScopeContext(world, 'missing')).toBeNull();
  });
});
describe('P11 bounded Conditional Access', () => {
  it('combines applicable MFA and device requirements', () => {
    expect(runConditional(c())).toMatchObject({ status: 'requirements', caMet: false });
    expect(runConditional(c({ compliant: true }))).toMatchObject({ caMet: true, combined: false });
  });
  it('a Grant cannot override a Block; report-only never enforces', () => {
    const s = c({ compliant: true });
    s.policyB = { ...s.policyB, control: 'block' };
    expect(runConditional(s)).toMatchObject({ status: 'blocked', blocked: true });
    s.policyB.state = 'report';
    const report = runConditional(s)!;
    expect(report.caMet).toBe(true);
    expect(report.policies[1]).toMatchObject({ would: 'block', reportOnly: true, enforced: false });
  });
  it('supports within-policy OR without changing cross-policy AND', () => {
    const s = c({ mfa: true, compliant: false });
    s.policyA.control = 'either';
    expect(runConditional(s)?.caMet).toBe(false);
    s.policyB.state = 'off';
    expect(runConditional(s)?.caMet).toBe(true);
    s.mfa = false;
    expect(runConditional(s)?.policies[0]?.would).toBe('either-needed');
    s.policyA.control = 'both';
    expect(runConditional(s)?.policies[0]?.would).toBe('both-needed');
    s.compliant = true;
    expect(runConditional(s)?.policies[0]?.would).toBe('mfa-needed');
  });
  it('targets identity/app/location and per-policy exclusions', () => {
    const s = c({ mfa: false, compliant: false });
    s.policyA.audience = 'team';
    s.policyB.state = 'off';
    s.member = false;
    expect(runConditional(s)).toMatchObject({ status: 'not-applicable', combined: false });
    s.member = true;
    expect(runConditional(s)?.status).toBe('requirements');
    s.policyA.app = 'project';
    expect(runConditional(s)?.status).toBe('not-applicable');
    s.policyA.app = 'all';
    s.policyA.location = 'outside';
    s.location = 'known';
    expect(runConditional(s)?.status).toBe('not-applicable');
    s.subject = 'emergency';
    s.location = 'outside';
    expect(runConditional(s)?.policies[0]?.excluded).toBe(true);
    s.policyB.state = 'on';
    s.policyB.excludeEmergency = false;
    expect(runConditional(s)?.status).toBe('requirements');
  });
  it('does not substitute CA or known location for first factor or resource rights', () => {
    expect(
      runConditional(c({ authenticated: false, compliant: true, authorization: 'vm-contributor' }))
        ?.status,
    ).toBe('authentication');
    const a = c({ compliant: true });
    expect(runConditional(a)).toMatchObject({ caMet: true, combined: false });
    a.authorization = 'vm-contributor';
    expect(runConditional(a)?.combined).toBe(true);
    a.mfa = false;
    expect(runConditional(a)).toMatchObject({ caMet: false, combined: false });
    expect(runConditional(a)?.rbac.allowed).toBe(true);
    a.authorization = 'none';
    expect(runConditional(a)?.rbac.allowed).toBe(false);
  });
  it('does not claim universal access without policies or ordinary workload coverage', () => {
    const s = c();
    s.policyA.state = 'off';
    s.policyB.state = 'off';
    expect(runConditional(s)).toMatchObject({
      status: 'not-applicable',
      caMet: true,
      combined: false,
    });
    for (const subject of ['service', 'managed'] as const)
      expect(runConditional(c({ subject }))).toMatchObject({
        supported: false,
        caMet: false,
        status: 'outside',
        outcome: 1,
      });
    expect(runConditional(c({ app: 'project', compliant: true }))?.outcome).toBe(1);
  });
  it('never claims a runtime, token, actual operation or application response', () => {
    expect(runConditional(c())).toMatchObject({
      actualSignIn: false,
      tokenIssued: false,
      actualOperation: false,
      appResponse: null,
    });
    expect(runRbac(r())).toMatchObject({ actualOperation: false, appResponse: null });
  });
  it('rejects extra/unknown/invalid/cyclic model input', () => {
    for (const bad of [
      null,
      {},
      [],
      { ...r(), world: {} },
      { ...r(), scope: 'missing' },
      { ...r(), role: 'admin' },
      { ...c(), mfa: 1 },
      { ...c(), policyA: { ...c().policyA, newControl: true } },
    ])
      expect(validAccessInput(bad)).toBe(false);
    const s = r();
    s.context.nodes[0]!.parent = 'vm';
    expect(validAccessInput(s)).toBe(false);
  });
});
describe('P11 evidence and content integrity', () => {
  it('grades all72 independently specified answer relations including wrong reasons', () => {
    const locked: Record<string, number[][]> = {
      ab01: [[1, 2]],
      ab02: [[2, 0]],
      ab03: [[0, 1]],
      ab04: [
        [0, 1],
        [2, 1],
      ],
      ab05: [[1, 0]],
      ab06: [[0, 2]],
      ab09: [[1, 2]],
      ab10: [[0, 0]],
    };
    accessItemIds.forEach((id) => {
      for (let d = 0; d < 3; d++)
        for (let reason = 0; reason < 3; reason++)
          expect(evaluateAccess(id, { decision: d, reason }).relation).toBe(
            locked[id]!.some(([a, b]) => d === a && reason === b),
          );
    });
  });
  it('requires actual saved matched contrasts plus a cause for both guides', () => {
    for (const mission of accessMissions) {
      let s = add(freshAccess(), { kind: 'mission', mission });
      for (const input of accessContrasts[mission])
        s = add(s, { kind: 'run', input, prediction: 0 });
      expect(accessWitnesses(accessFacts(s).guide!).every(Boolean)).toBe(true);
      expect(accessFacts(s).completed).toEqual([]);
      s = add(s, { kind: 'explain', answer: accessGuidedAnswer[mission] });
      expect(accessFacts(s).completed).toEqual([mission]);
      expect(restoreAccess(JSON.stringify(s)).issue).toBeNull();
    }
  });
  it('does not infer a causal pair when principal or another policy also changes', () => {
    let s = add(freshAccess(), { kind: 'mission', mission: 'rbac' });
    s = add(s, { kind: 'run', input: r(), prediction: 0 });
    s = add(s, {
      kind: 'run',
      input: r({ action: 'modify-vm', assignment: 'other' }),
      prediction: 0,
    });
    expect(accessWitnesses(accessFacts(s).guide!)[0]).toBe(false);
  });
  it('never awards guide completion by visit or correct prediction alone', () => {
    let s = add(freshAccess(), { kind: 'visit', topic: 'studio' });
    expect(accessFacts(s).completed).toEqual([]);
    s = add(s, { kind: 'mission', mission: 'rbac' });
    s = add(s, { kind: 'run', input: r(), prediction: 2 });
    expect(accessFacts(s).completed).toEqual([]);
    expect(accessWitnesses(accessFacts(s).guide!).every(Boolean)).toBe(false);
  });
  it('preserves unaided first through helped retry and separate Part A bytes', () => {
    const old = 'azurelab.learning.identity-foundations.v1',
      m = new Memory();
    m.setItem(old, 'preserved');
    const store = new AccessStore(m);
    store.load();
    expect(store.event({ kind: 'begin', item: 'ab01' })).toBe(true);
    expect(store.event({ kind: 'draft', answer: { decision: 1, reason: 0 } })).toBe(true);
    expect(store.event({ kind: 'submit' })).toBe(true);
    const first = JSON.stringify(accessFacts(store.getSnapshot().save).firsts);
    store.event({ kind: 'begin', item: 'ab01' });
    store.prepareTeaching();
    store.event({ kind: 'draft', answer: { decision: 1, reason: 2 } });
    store.event({ kind: 'submit' });
    expect(JSON.stringify(accessFacts(store.getSnapshot().save).firsts)).toBe(first);
    expect(m.getItem(old)).toBe('preserved');
    expect(accessFacts(store.getSnapshot().save).attempts[1]).toMatchObject({
      assisted: true,
      retry: true,
    });
  });
  it('denied/stale writes cannot publish assistance or overwrite a newer save', () => {
    const m = new Memory(),
      a = new AccessStore(m),
      b = new AccessStore(m);
    a.load();
    b.load();
    a.event({ kind: 'begin', item: 'ab01' });
    expect(b.event({ kind: 'begin', item: 'ab02' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    m.fail = true;
    expect(a.prepareTeaching()).toBe(false);
    expect(accessFacts(a.getSnapshot().save).assisted).toBe(false);
  });
  it('keeps maximum-size bounded scope logs replayable before the JSON parser envelope', () => {
    let s = add(freshAccess(), { kind: 'mission', mission: 'rbac' });
    const input = r();
    const ids = new Map(
      input.context.nodes.map((n, i) => [n.id, String(i).padStart(3, '0') + 'x'.repeat(157)]),
    );
    input.context.nodes = input.context.nodes.map((n) => ({
      ...n,
      id: ids.get(n.id)!,
      name: 'n'.repeat(160),
      parent: n.parent ? ids.get(n.parent)! : null,
    }));
    const parent = ids.get('rg-app')!;
    for (let i = 0; i < 6; i++)
      input.context.nodes.push({
        id: 'extra' + i + 'x'.repeat(154),
        name: 'n'.repeat(160),
        parent,
        kind: 'resource',
      });
    input.scope = ids.get('sub-app')!;
    input.target = ids.get('vm')!;
    expect(validAccessInput(input)).toBe(true);
    while (!accessFacts(s).full)
      s = add(s, {
        kind: 'configure',
        input: { ...input, role: s.events.length % 2 ? 'reader' : 'contributor' },
      });
    const raw = JSON.stringify(s);
    expect(raw.length).toBeLessThan(600000);
    expect(restoreAccess(raw)).toEqual({ save: s, issue: null });
    expect(applyAccess(s, { kind: 'configure', input })).toBeNull();
  });
  it('scoped recovery compares before delete and never clears another contract', () => {
    const m = new Memory();
    m.setItem(accessKey, 'broken');
    m.setItem('azurelab.learning.identity-foundations.v1', 'old');
    const a = new AccessStore(m);
    a.load();
    m.setItem(accessKey, JSON.stringify(freshAccess()));
    expect(a.recoverInvalid()).toBe(false);
    expect(m.getItem(accessKey)).not.toBeNull();
    expect(m.getItem('azurelab.learning.identity-foundations.v1')).toBe('old');
  });
  it('enforces replay/version/extra fields and terminal reserve', () => {
    let s = freshAccess();
    while (s.events.length < accessLimit - 6)
      s = add(s, { kind: 'visit', topic: s.events.length % 2 ? 'rbac' : 'scope' });
    s = add(s, { kind: 'begin', item: 'ab02' });
    s = add(s, { kind: 'draft', answer: { decision: 2, reason: 0 } });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'submit' });
    expect(restoreAccess(JSON.stringify(s)).issue).toBeNull();
    for (const v of [
      { ...s, model: '2.0.0' },
      { ...s, world: {} },
      { ...s, events: [{ kind: 'aid' }] },
    ])
      expect(restoreAccess(JSON.stringify(v)).issue).not.toBeNull();
  });
  it('pins original goal sources, topics, option-specific feedback and contextual copy', () => {
    expect(Object.keys(accessItemsNb)).toEqual(accessItemIds);
    for (const id of accessItemIds) {
      const item = accessItems[id],
        copy = accessItemsNb[id];
      expect(copy.decisions).toHaveLength(3);
      expect(copy.reasons).toHaveLength(3);
      expect(copy.feedback[0]).toHaveLength(3);
      expect(copy.feedback[1]).toHaveLength(3);
      expect(accessTopics).toContain(item.repeat);
      for (const source of item.sources) expect(accessSources).toHaveProperty(source);
    }
    for (const s of [
      accessNb.storage.loading,
      accessNb.storage.reload,
      accessNb.storage.recover,
      accessNb.currentFeedback,
      accessNb.historyFeedback,
    ])
      expect(s).toMatch(/Access Control/);
    expect(roles.every((role) => typeof roleAllows(role, 'view', 'vm') === 'boolean')).toBe(true);
  });
});
