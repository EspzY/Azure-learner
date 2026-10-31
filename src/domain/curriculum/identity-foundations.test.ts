import { describe, it, expect } from 'vitest';
import { identityNb as c, identityItemsNb } from '../../content/nb';
import {
  runDirectory,
  runJourney,
  runExternal,
  runIdentity,
  validIdentityInput,
  methods,
  type IdentityInput,
} from './identity-foundations-model';
import {
  freshIdentity,
  applyIdentity,
  restoreIdentity,
  identityFacts,
  identityGuidedFacts,
  identityGuidedAnswer,
  identityMilestoneFacts,
  identityKey,
  identityLimit,
  identityManifest,
  identityItems,
  identityItemIds,
  evaluateIdentity,
  type IdentitySave,
  type IdentityMission,
} from './identity-foundations';
import { IdentityStore } from './identity-foundations-store';
import { identitySources, identityStudySources } from './identity-foundations-sources';
import { freshStorage, storageKey } from './storage';
import { prepareExistingTeaching } from './teaching-access';
import { directory, journey, external, identityContrasts } from '../../../tests/fixtures/identity';
const event = (s: IdentitySave, e: unknown) => {
  const next = applyIdentity(s, e);
  expect(next).not.toBeNull();
  return next!;
};
const run = (s: IdentitySave, input: IdentityInput) =>
  event(s, { kind: 'run', input, prediction: 0 });
function witnessedIdentity(mission: IdentityMission) {
  let s = event(freshIdentity(), { kind: 'mission', mission });
  for (const input of identityContrasts[mission]) s = run(s, input);
  return s;
}
function memory() {
  const values = new Map<string, string>();
  let denied = false;
  return {
    values,
    deny: (v = true) => {
      denied = v;
    },
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (denied) throw Error('denied');
      values.set(k, v);
    },
    removeItem: (k: string) => {
      if (denied) throw Error('denied');
      values.delete(k);
    },
  };
}
describe('declared directory, authentication and external boundaries', () => {
  it('compares modern/legacy/schema capabilities without equating Entra ID and Domain Services', () => {
    expect(runDirectory(directory)).toMatchObject({
      compatible: true,
      ready: true,
      actualDeployment: false,
    });
    expect(runDirectory({ ...directory, workload: 'legacy' })).toMatchObject({
      compatible: false,
      cause: 'capability',
    });
    expect(runDirectory({ ...directory, workload: 'legacy', solution: 'managed' })).toMatchObject({
      compatible: true,
      ready: true,
    });
    expect(runDirectory({ ...directory, workload: 'schema', solution: 'managed' })).toMatchObject({
      compatible: false,
    });
    expect(runDirectory({ ...directory, workload: 'schema', solution: 'adds' })).toMatchObject({
      compatible: true,
    });
  });
  it('retains credential prerequisites, read-only synchronized objects and no reverse sync', () => {
    expect(
      runDirectory({ ...directory, workload: 'legacy', solution: 'managed', sync: 'pending' }),
    ).toMatchObject({ compatible: true, ready: false, cause: 'sync' });
    expect(
      runDirectory({ ...directory, workload: 'legacy', solution: 'managed', change: 'synced' }),
    ).toMatchObject({ writeAllowed: false, ready: false, syncBack: false });
    expect(
      runDirectory({ ...directory, workload: 'legacy', solution: 'managed', change: 'local' }),
    ).toMatchObject({ writeAllowed: true, syncBack: false });
  });
  it('does not turn two knowledge secrets or single-factor SSO into MFA', () => {
    expect(runJourney({ ...journey, method: 'two-secrets' })).toMatchObject({
      identityProven: true,
      requirementsMet: false,
      method: { factors: ['knowledge'], mfa: false },
      access: 'not-evaluated',
    });
    expect(runJourney({ ...journey, session: 'single' })).toMatchObject({
      identityProven: true,
      requirementsMet: false,
      reused: false,
    });
    expect(runJourney({ ...journey, session: 'single', method: 'passkey' })).toMatchObject({
      requirementsMet: true,
      reused: false,
      access: 'unknown',
    });
  });
  it('reuses only sufficient declared context and never claims a fresh credential check', () => {
    expect(runJourney({ ...journey, session: 'mfa', credential: 'failed' })).toMatchObject({
      requirementsMet: true,
      reused: true,
      methodChecked: false,
      evidence: 'mfa',
    });
    expect(
      runJourney({ ...journey, session: 'mfa', credential: 'failed', requirement: 'resistant' }),
    ).toMatchObject({ requirementsMet: false, reused: false });
    expect(runJourney({ ...journey, session: 'resistant', identity: false })).toMatchObject({
      identityProven: false,
      requirementsMet: false,
    });
    expect(runJourney({ ...journey, session: 'resistant', trust: false })).toMatchObject({
      identityProven: false,
      requirementsMet: false,
    });
  });
  it('keeps successful identity, declared MFA and separate unknown/denied/allowed action apart', () => {
    for (const [access, result] of [
      ['unknown', 'unknown'],
      ['deny', 'denied'],
      ['allow', 'allowed'],
    ] as const)
      expect(runJourney({ ...journey, method: 'passkey', access })).toMatchObject({
        identityProven: true,
        requirementsMet: true,
        access: result,
        actualSignIn: false,
        tokenIssued: false,
        appResponse: null,
      });
    expect(
      runJourney({ ...journey, method: 'passkey', credential: 'unregistered', access: 'allow' }),
    ).toMatchObject({ identityProven: false, requirementsMet: false, access: 'not-evaluated' });
  });
  it('does not equate passwordless, MFA and phishing resistance', () => {
    expect(runJourney({ ...journey, method: 'sms' })).toMatchObject({
      identityProven: true,
      requirementsMet: false,
      method: { passwordless: true, mfa: false, resistant: false },
    });
    expect(
      runJourney({ ...journey, method: 'authenticator', requirement: 'resistant' }),
    ).toMatchObject({
      identityProven: true,
      requirementsMet: false,
      method: { passwordless: true, mfa: true, resistant: false },
    });
    for (const method of ['passkey', 'hello'] as const)
      expect(runJourney({ ...journey, method, requirement: 'resistant' })).toMatchObject({
        requirementsMet: true,
        method: { mfa: true, resistant: true },
      });
  });
  it('requires registration/verifiable declared credential independently of method names', () => {
    for (const method of methods)
      for (const credential of ['unregistered', 'failed'] as const)
        expect(
          runJourney({ ...journey, method, credential, requirement: 'single', access: 'allow' }),
        ).toMatchObject({ identityProven: false, requirementsMet: false, access: 'not-evaluated' });
  });
  it('keeps B2B representation, home authentication and app permissions separate', () => {
    expect(runExternal(external)).toMatchObject({
      homeProof: true,
      resourceAccepted: false,
      guestRequired: true,
      representationReady: false,
      accountCreated: false,
    });
    expect(runExternal({ ...external, guest: true, access: 'deny' })).toMatchObject({
      ready: true,
      resourceAccepted: true,
      access: 'denied',
      adminGranted: false,
    });
    expect(
      runExternal({ ...external, guest: true, homeAuth: false, access: 'allow' }),
    ).toMatchObject({ resourceAccepted: false, access: 'not-evaluated' });
  });
  it('does not conflate invitation controls with existing guest access or cross-tenant blocks', () => {
    expect(runExternal({ ...external, invitation: false })).toMatchObject({
      invitationBlocked: true,
      ready: false,
    });
    expect(runExternal({ ...external, guest: true, invitation: false })).toMatchObject({
      invitationBlocked: false,
      ready: true,
    });
    expect(runExternal({ ...external, guest: true, outbound: false })).toMatchObject({
      ready: false,
      crossAllowed: false,
    });
    expect(
      runExternal({ ...external, guest: true, home: 'other', outbound: false, inbound: false }),
    ).toMatchObject({ ready: true, crossRequired: false });
  });
  it('distinguishes separate customer lifecycle and workforce collaboration', () => {
    expect(runExternal({ ...external, audience: 'customer', guest: true })).toMatchObject({
      fit: false,
      tenant: 'workforce',
      ready: false,
    });
    expect(runExternal({ ...external, audience: 'customer', approach: 'customer' })).toMatchObject({
      fit: true,
      tenant: 'external',
      guestRequired: false,
      crossRequired: false,
      resourceAccepted: true,
      adminGranted: false,
    });
  });
  it('bounds direct connect to declared shared-channel support and both relevant directions', () => {
    const d = { ...external, audience: 'shared', approach: 'direct' } as const;
    expect(runExternal(d)).toMatchObject({
      ready: true,
      guestRequired: false,
      accountCreated: false,
    });
    for (const change of [
      { home: 'other' },
      { outbound: false },
      { inbound: false },
      { audience: 'partner' },
    ])
      expect(runExternal({ ...d, ...change })?.ready).toBe(false);
  });
  it.each([
    null,
    {},
    { kind: 'signin' },
    { ...journey, token: 'pretend' },
    { ...journey, identity: 'true' },
    { ...directory, world: {} },
    { ...external, home: 'unknown' },
  ])('rejects invalid/operative payloads atomically: %j', (input) => {
    expect(validIdentityInput(input)).toBe(false);
    expect(runIdentity(input)).toBeNull();
  });
});
describe('isolated causal progress, first/help/retry and durable evidence', () => {
  it.each(['directory', 'journey', 'external'] as const)(
    '%s requires real persisted contrasts and a correct cause',
    (mission) => {
      let s = witnessedIdentity(mission);
      expect(identityGuidedFacts(identityFacts(s).guide!)).toMatchObject({
        witnessed: true,
        complete: false,
      });
      s = event(s, { kind: 'explain', answer: identityGuidedAnswer[mission] });
      expect(identityFacts(s).completed).toEqual([mission]);
      expect(restoreIdentity(JSON.stringify(s))).toEqual({ save: s, issue: null });
    },
  );
  it('does not complete via navigation, configurations, repeated identical baselines or comparing different datasets', () => {
    let s = event(freshIdentity(), { kind: 'visit', topic: 'directory' });
    s = event(s, { kind: 'mission', mission: 'directory' });
    s = event(s, { kind: 'configure', input: directory });
    expect(applyIdentity(s, { kind: 'explain', answer: 1 })).toBeNull();
    expect(identityFacts(s).completed).toEqual([]);
    s = run(s, directory);
    s = run(s, directory);
    expect(identityGuidedFacts(identityFacts(s).guide!).witnesses[1]).toBe(false);
  });
  it('pause/resume, milestones and terminal reserve use saved status, not old Part A evidence', () => {
    let s = witnessedIdentity('directory');
    const before = JSON.stringify(identityFacts(s).guide);
    s = event(s, { kind: 'pause' });
    expect(identityFacts(s).guide).toBeUndefined();
    s = event(s, { kind: 'resume', id: 1 });
    expect(JSON.stringify(identityFacts(s).guide)).toBe(before);
    expect(identityMilestoneFacts(freshIdentity())).toEqual({
      directory: false,
      journey: false,
      external: false,
    });
    expect(identityMilestoneFacts(s).directory).toBe(true);
    while (s.events.length < identityLimit - 5)
      s = event(s, { kind: 'visit', topic: s.events.length % 2 ? 'directory' : 'domain' });
    while (s.events.length < identityLimit - 1)
      s = event(s, { kind: 'explain', answer: s.events.length % 2 ? 0 : 2 });
    expect(
      applyIdentity(s, {
        kind: 'explain',
        answer: identityFacts(s).guide?.answer === 0 ? 2 : 0,
      }),
    ).toBeNull();
    s = event(s, { kind: 'explain', answer: 1 });
    expect(identityFacts(s).completed).toEqual(['directory']);
    expect(restoreIdentity(JSON.stringify(s)).issue).toBeNull();
  });
  it('grades all90 pairs against independently locked indexes and refuses correct decision/wrong rationale', () => {
    const locked = [
      [1, 2],
      [0, 1],
      [2, 0],
      [1, 0],
      [2, 1],
      [0, 2],
      [0, 2],
      [1, 2],
      [2, 1],
      [2, 1],
    ];
    identityItemIds.forEach((item, i) => {
      for (let d = 0; d < 3; d++)
        for (let r = 0; r < 3; r++)
          expect(evaluateIdentity(item, { decision: d, reason: r }).relation).toBe(
            d === locked[i]![0] && r === locked[i]![1],
          );
    });
  });
  it('keeps first event prefix immutable through helped retry and sibling exposure after abandon', () => {
    let s = event(freshIdentity(), { kind: 'begin', item: 'if01' });
    s = event(s, { kind: 'draft', answer: { decision: 1, reason: 0 } });
    s = event(s, { kind: 'submit' });
    const prefix = JSON.stringify(s.events),
      first = JSON.stringify(identityFacts(s).firsts);
    s = event(s, { kind: 'begin', item: 'if01' });
    s = event(s, { kind: 'aid' });
    s = event(s, { kind: 'draft', answer: { decision: 1, reason: 2 } });
    s = event(s, { kind: 'submit' });
    expect(JSON.stringify(identityFacts(s).firsts)).toBe(first);
    expect(JSON.stringify(s.events.slice(0, 3))).toBe(prefix);
    s = event(s, { kind: 'begin', item: 'if06' });
    s = event(s, { kind: 'abandon' });
    s = event(s, { kind: 'begin', item: 'if07' });
    expect(identityFacts(s).current?.retry).toBe(true);
    expect(applyIdentity(s, { kind: 'mission', mission: 'directory' })).toBeNull();
  });
  it('reserves final draft/aid/submit at capacity and validates strict replay/version pins', () => {
    let s = freshIdentity();
    while (s.events.length < identityLimit - 6)
      s = event(s, { kind: 'visit', topic: s.events.length % 2 ? 'directory' : 'external' });
    s = event(s, { kind: 'begin', item: 'if04' });
    expect(identityFacts(s).full).toBe(true);
    s = event(s, { kind: 'draft', answer: { decision: 2, reason: 0 } });
    s = event(s, { kind: 'aid' });
    s = event(s, { kind: 'submit' });
    expect(identityFacts(s).firsts[0]).toMatchObject({ assisted: true, status: 'submitted' });
    expect(restoreIdentity(JSON.stringify(s)).issue).toBeNull();
    for (const bad of [
      '[]',
      'bad',
      JSON.stringify({ ...s, rubric: '2.0.0' }),
      JSON.stringify({ ...freshIdentity(), world: {} }),
      JSON.stringify({ ...freshIdentity(), events: [{ kind: 'aid' }] }),
      JSON.stringify({
        ...freshIdentity(),
        events: [
          { kind: 'visit', topic: 'directory' },
          { kind: 'visit', topic: 'directory' },
        ],
      }),
    ])
      expect(restoreIdentity(bad).issue).not.toBeNull();
  });
  it('isolates Part A bytes, rejects denied aid/stale writers and compares before scoped deletion', () => {
    const m = memory(),
      old = JSON.stringify(freshStorage());
    m.values.set(storageKey, old);
    m.values.set('azurelab.sandbox.v2', 'technical bytes');
    const a = new IdentityStore(m),
      b = new IdentityStore(m);
    a.load();
    b.load();
    expect(a.event({ kind: 'begin', item: 'if01' })).toBe(true);
    expect(b.event({ kind: 'visit', topic: 'directory' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    m.deny();
    expect(
      prepareExistingTeaching(a, identityKey, m.getItem, restoreIdentity, identityFacts, () =>
        a.event({ kind: 'aid' }),
      ),
    ).toBe(false);
    expect(identityFacts(restoreIdentity(m.values.get(identityKey)!).save).assisted).toBe(false);
    m.deny(false);
    a.load();
    expect(a.prepareTeaching()).toBe(true);
    expect(a.getSnapshot().save.events.at(-1)).toEqual({ kind: 'aid' });
    m.values.set(identityKey, '{bad');
    a.load();
    const newer = JSON.stringify(freshIdentity());
    m.values.set(identityKey, newer);
    expect(a.recoverInvalid()).toBe(false);
    expect(m.getItem(identityKey)).toBe(newer);
    expect(m.getItem(storageKey)).toBe(old);
    expect(m.getItem('azurelab.sandbox.v2')).toBe('technical bytes');
  });
  it('binds substantive original theory, every scenario/feedback/source and both scoped objectives', () => {
    expect(identityManifest.certificationOverlay.slots).toEqual(['2.4.01', '2.4.02', '2.4.03']);
    expect(c.assessment.title).toMatch(/Identity/);
    for (const text of [
      c.recallGuided,
      c.assessmentActive,
      c.currentFeedback,
      c.historyFeedback,
      c.storage.loading,
      c.storage.reload,
      c.storage.recover,
    ]) {
      expect(text).toMatch(/Identity/);
      expect(text).not.toMatch(/Storage/);
    }
    expect(c.labels.predictionOptions.join(' ')).not.toMatch(/applikasjonseffekt/);
    expect(Object.keys(identityItemsNb)).toEqual(identityItemIds);
    for (const id of identityItemIds) {
      const item = identityItems[id],
        copy = identityItemsNb[id];
      expect(copy.decisions).toHaveLength(3);
      expect(copy.reasons).toHaveLength(3);
      expect(copy.feedback[0]).toHaveLength(3);
      expect(copy.feedback[1]).toHaveLength(3);
      for (const source of item.sources) expect(identitySources).toHaveProperty(source);
      expect(c.sections).toHaveProperty(item.repeat);
    }
    for (const objective of Object.keys(identityManifest.objectives))
      expect(
        identityItemIds.filter((id) =>
          (identityItems[id].objectives as readonly string[]).includes(objective),
        ).length,
      ).toBeGreaterThanOrEqual(2);
    for (const ids of Object.values(identityStudySources))
      for (const id of ids)
        expect(identitySources[id][1]).toMatch(/^https:\/\/learn.microsoft.com\//);
  });
});
