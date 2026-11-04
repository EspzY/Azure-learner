import { describe, it, expect, vi } from 'vitest';
import { freshEngine, execute, type Command } from '../chapter01/model';
import { requestFor, parseLocation, portalHref } from './model';
import {
  applyModuleEvent,
  freshServices,
  serviceLearningKey,
  restoreServices,
  serviceFacts,
  evaluateSubmission,
} from './learning';
import {
  applyChallenge2,
  challenge2Key,
  challenge2Facts,
  challenge2Projection,
  freshChallenge2,
  restoreChallenge2,
  evaluateChallenge2,
  challenge2Href,
  challenge2Return,
  type Challenge2Save,
  type Challenge2Answers,
} from './challenge-v2';
import { Challenge2Store } from './challenge-v2-store';
import { challengeOriginKey, challengeResumeHref, challengeReturnHref } from './challenge-origin';
import { challenge2Nb } from '@/content/nb';
const origin = { module: 'computing', topic: 'resource-bridge' } as const;
const start = {
  kind: 'begin',
  boundary: null,
  attemptNumber: 1,
  origin,
  prior: 'none-recorded',
} as const;
const valid: Challenge2Answers = {
  osModel: 'iaas',
  osReason: 'guest-lifecycle',
  platformModel: 'paas',
  platformReason: 'supported-platform',
  webModel: 'paas',
  reason: 'managed-platform',
  readyModel: 'saas',
  locationCause: 'plan',
  groupId: 'group-1',
  planId: 'plan-2',
  appId: 'app-3',
};
const append = (s: Challenge2Save, e: unknown) => {
  const n = applyChallenge2(s, e);
  expect(n).not.toBeNull();
  return n!;
};
function engine() {
  let e = freshEngine();
  for (const command of [
    {
      type: 'CreateGroup',
      name: 'rg-new',
      subscriptionId: 'sub-shared',
      metadataRegion: 'norwayeast',
    },
    {
      type: 'CreatePlan',
      name: 'plan-new',
      groupId: 'group-1',
      region: 'northeurope',
      profile: 'linux-learning-v1',
    },
    { type: 'CreateWebApp', name: 'app-new', groupId: 'group-1', planId: 'plan-2' },
  ] as Command[])
    e = execute(e, requestFor(e, command, e.ledger.length + 1)).engine;
  return e;
}
function submitted(answers: Challenge2Answers = valid) {
  let s = append(freshChallenge2(), start);
  s = append(s, { kind: 'draft', answers });
  return append(s, { kind: 'submit', through: 'portal-3' });
}
function fixture() {
  const memory = new Map<string, string>();
  let deny = false;
  const storage = {
    getItem: (k: string) => memory.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (deny) throw Error('denied');
      memory.set(k, v);
    },
    removeItem: (k: string) => {
      memory.delete(k);
    },
  };
  const store = new Challenge2Store(storage);
  store.load();
  return {
    memory,
    storage,
    store,
    deny: () => {
      deny = true;
    },
  };
}
describe('CC03 isolated versioned Web successor', () => {
  it('requires both explicit compatible pairs while reusing actual frozen Web receipt evaluation', () => {
    const e = engine(),
      s = submitted(),
      before = JSON.stringify(e);
    expect(evaluateChallenge2(challenge2Facts(s).submissions[0]!, e, 1)).toMatchObject({
      verifiable: true,
      correct: true,
    });
    expect(
      evaluateSubmission(serviceFacts(challenge2Projection(s)).submissions[0]!, e, 1).correct,
    ).toBe(true);
    expect(JSON.stringify(e)).toBe(before);
  });
  it('rejects every incompatible decision/reason combination for both changed-premise situations', () => {
    const e = engine();
    for (const [index, item] of challenge2Nb.items.entries())
      for (const [d] of item.decisions)
        for (const [r] of item.reasons) {
          const answers = {
            ...valid,
            ...(index === 0
              ? { osModel: d, osReason: r }
              : { platformModel: d, platformReason: r }),
          } as Challenge2Answers;
          const result = evaluateChallenge2(
            challenge2Facts(submitted(answers)).submissions[0]!,
            e,
            1,
          );
          expect(result.criteria[index === 0 ? 'os' : 'platform']).toBe(
            index === 0
              ? d === 'iaas' && r === 'guest-lifecycle'
              : d === 'paas' && r === 'supported-platform',
          );
        }
  });
  it('has no all-first/all-second/all-last/longest/shortest full-score concept strategy', () => {
    const e = engine();
    for (const method of ['first', 'second', 'last', 'longest', 'shortest']) {
      const a = { ...valid };
      challenge2Nb.items.forEach((q, i) => {
        const choose = (options: readonly (readonly [string, string])[]) =>
          method === 'first'
            ? options[0]![0]
            : method === 'second'
              ? options[1]![0]
              : method === 'last'
                ? options.at(-1)![0]
                : [...options].sort(
                    (a, b) => (method === 'longest' ? -1 : 1) * (a[1].length - b[1].length),
                  )[0]![0];
        if (i === 0) {
          a.osModel = choose(q.decisions) as 'iaas';
          a.osReason = choose(q.reasons) as 'guest-lifecycle';
        } else {
          a.platformModel = choose(q.decisions) as 'paas';
          a.platformReason = choose(q.reasons) as 'supported-platform';
        }
      });
      expect(
        evaluateChallenge2(challenge2Facts(submitted(a)).submissions[0]!, e, 1).correct,
        method,
      ).toBe(false);
    }
  });
  it('does not turn right conceptual answers into new technical work or accept old/reset/missing receipts', () => {
    const s = submitted(),
      sub = challenge2Facts(s).submissions[0]!;
    expect(evaluateChallenge2(sub, freshEngine(), 1).correct).toBe(false);
    expect(evaluateChallenge2({ ...sub, boundary: 'portal-3' }, engine(), 1).criteria.scope).toBe(
      false,
    );
    expect(evaluateChallenge2(sub, engine(), 2).verifiable).toBe(false);
    expect(evaluateChallenge2({ ...sub, through: 'missing' }, engine(), 1).correct).toBe(false);
  });
  it('replays separately, reconstructs exact draft/origin, and never accepts old/new schemas as each other', () => {
    let s = append(freshChallenge2(), start);
    s = append(s, { kind: 'draft', answers: { osModel: 'iaas', osReason: 'guest-lifecycle' } });
    expect(restoreChallenge2(JSON.stringify(s))).toEqual({ save: s, issue: null });
    expect(challenge2Facts(s)).toMatchObject({
      active: true,
      origin,
      draft: { osModel: 'iaas', osReason: 'guest-lifecycle' },
    });
    expect(restoreServices(JSON.stringify(s)).issue).toBe('unsupported');
    expect(restoreChallenge2(JSON.stringify(freshServices())).issue).toBe('unsupported');
  });
  it('preserves immutable first after help/retry/abandon and pins each new origin independently', () => {
    let s = submitted();
    const first = JSON.stringify(challenge2Facts(s).submissions[0]);
    s = append(s, {
      ...start,
      origin: { module: 'services', topic: 'practice' },
      prior: 'documented',
    });
    s = append(s, { kind: 'aid' });
    s = append(s, { kind: 'draft', answers: { osModel: 'paas' } });
    s = append(s, { kind: 'abandon' });
    expect(JSON.stringify(challenge2Facts(s).submissions[0])).toBe(first);
    expect(challenge2Facts(s).submissions[1]).toMatchObject({
      assisted: true,
      abandoned: true,
      origin: { module: 'services', topic: 'practice' },
    });
  });
  it('rejects invalid event fields, origin, order, answer IDs, and unsupported versions', () => {
    for (const e of [
      { ...start, origin: { module: 'computing', topic: 'overview' } },
      { ...start, extra: true },
      { kind: 'submit', through: 'portal-1' },
      { kind: 'draft', answers: {} },
      { kind: 'compare', model: 'iaas' },
    ])
      expect(applyChallenge2(freshChallenge2(), e)).toBeNull();
    const s = append(freshChallenge2(), start);
    expect(applyChallenge2(s, start)).toBeNull();
    for (const answers of [
      { osReason: 'made-up' },
      { platformModel: 'faas' },
      { platformReason: 'guest-lifecycle' },
      { unexpected: 'x' },
    ])
      expect(applyChallenge2(s, { kind: 'draft', answers })).toBeNull();
    expect(restoreChallenge2('{').issue).toBe('corrupt');
  });
  it('reserves terminal writes and remains bounded on exact replay', () => {
    let s = append(freshChallenge2(), start);
    for (let i = 1; i < 397; i++)
      s = append(s, { kind: 'draft', answers: { osModel: i % 2 ? 'paas' : 'iaas' } });
    expect(s.events).toHaveLength(397);
    expect(applyChallenge2(s, { kind: 'draft', answers: { osModel: 'iaas' } })).toBeNull();
    s = append(s, { kind: 'aid' });
    s = append(s, { kind: 'abandon' });
    expect(restoreChallenge2(JSON.stringify(s)).issue).toBeNull();
    expect(applyChallenge2(s, start)).toBeNull();
  });
  it('does not publish a failed durable begin/draft/aid/submit or modify old save/sidecar', () => {
    for (const kind of ['begin', 'draft', 'aid', 'submit', 'abandon']) {
      const f = fixture();
      f.memory.set(challengeOriginKey, 'old-only');
      if (kind !== 'begin') expect(f.store.event(start)).toBe(true);
      const before = JSON.stringify(f.store.getSnapshot().save);
      f.deny();
      const raw =
        kind === 'begin'
          ? start
          : kind === 'draft'
            ? { kind, answers: valid }
            : kind === 'submit'
              ? { kind, through: 'portal-3' }
              : { kind };
      expect(f.store.event(raw)).toBe(false);
      expect(JSON.stringify(f.store.getSnapshot().save)).toBe(before);
      expect(f.store.getSnapshot().issue).toBe('unsaved');
      expect(f.memory.get(challengeOriginKey)).toBe('old-only');
      expect(f.memory.has(serviceLearningKey)).toBe(false);
    }
  });
  it('fails closed on readback replacement and stale duplicate first writes', () => {
    const f = fixture(),
      b = new Challenge2Store(f.storage);
    b.load();
    expect(f.store.event(start)).toBe(true);
    expect(b.event(start)).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    const raw = f.memory.get(challenge2Key)!;
    expect(restoreChallenge2(raw).save.events).toHaveLength(1);
    const replacement = new Challenge2Store({
      ...f.storage,
      setItem: (k: string) => f.storage.setItem(k, '{}'),
    });
    replacement.load();
    const before = JSON.stringify(replacement.getSnapshot().save);
    expect(replacement.event({ kind: 'aid' })).toBe(false);
    expect(JSON.stringify(replacement.getSnapshot().save)).toBe(before);
  });
  it('blocks new Start for active/uncertain legacy history and labels documented prior exposure without migration', () => {
    const f = fixture();
    const old = applyModuleEvent(freshServices(), {
      kind: 'begin',
      boundary: null,
      attemptNumber: 1,
    })!;
    f.memory.set(serviceLearningKey, JSON.stringify(old));
    expect(f.store.event(start)).toBe(false);
    const finished = applyModuleEvent(old, { kind: 'abandon' })!;
    f.memory.set(serviceLearningKey, JSON.stringify(finished));
    f.store.load();
    expect(f.store.event(start)).toBe(true);
    expect(challenge2Facts(f.store.getSnapshot().save).prior).toBe('documented');
    expect(f.memory.get(serviceLearningKey)).toBe(JSON.stringify(finished));
    const g = fixture();
    g.memory.set(serviceLearningKey, 'bad');
    expect(g.store.event(start)).toBe(false);
  });
  it('scoped recovery cannot delete valid or cross-tab replaced new history or any old key', () => {
    const f = fixture();
    f.memory.set(challenge2Key, 'bad');
    f.memory.set(serviceLearningKey, 'unchanged');
    f.store.load();
    f.memory.set(challenge2Key, JSON.stringify(freshChallenge2()));
    expect(f.store.recover()).toBe(false);
    expect(f.memory.has(challenge2Key)).toBe(true);
    const g = fixture();
    g.memory.set(challenge2Key, 'bad');
    g.store.load();
    expect(g.store.recover()).toBe(true);
    expect(g.store.getSnapshot().issue).toBeNull();
    expect(f.memory.get(serviceLearningKey)).toBe('unchanged');
  });
  it('keeps version selection typed through supported Portal navigation without reusing teaching version or old origin', () => {
    const l = parseLocation(
      new URLSearchParams(
        'area=challenge&module=computing&topic=resource-bridge&assessment=updated&version=1&course=1',
      ),
    );
    expect(l.assessment).toBe('updated');
    expect(portalHref(l, 'resources')).toContain('assessment=updated');
    expect(parseLocation(new URLSearchParams('assessment=bogus')).assessment).toBeUndefined();
    expect(challenge2Href(origin)).toContain('assessment=updated');
    expect(challenge2Return(origin, true)).toContain(
      'topic=resource-bridge&activity=challenge-return&assessment=updated',
    );
    expect(challengeResumeHref(origin)).not.toContain('assessment');
    expect(challengeReturnHref(origin, false)).toContain('activity=debrief');
  });
  it('pending locked Start blocks help and a reload cancels stale queued work without begin', async () => {
    const f = fixture();
    let release: (() => void) | undefined;
    vi.stubGlobal('navigator', {
      locks: {
        request: (_name: string, work: () => boolean) =>
          new Promise<boolean>((resolve) => {
            release = () => {
              resolve(work());
            };
          }),
      },
    });
    try {
      const promise = f.store.begin(origin, null, 1);
      expect(f.store.getSnapshot().ready).toBe(false);
      expect(f.store.event({ kind: 'aid' })).toBe(false);
      f.store.load();
      release!();
      expect(await promise).toBe(false);
      expect(f.memory.has(challenge2Key)).toBe(false);
      expect(f.store.getSnapshot()).toMatchObject({ ready: true, issue: null });
    } finally {
      vi.unstubAllGlobals();
    }
  });
  it('two queued explicit Starts commit exactly one begin and never repin a winning new origin', async () => {
    const f = fixture(),
      b = new Challenge2Store(f.storage);
    b.load();
    let queue = Promise.resolve();
    vi.stubGlobal('navigator', {
      locks: {
        request: (_name: string, work: () => boolean) => {
          const result = queue.then(work);
          queue = result.then(() => {});
          return result;
        },
      },
    });
    try {
      const results = await Promise.all([
        f.store.begin(origin, null, 1),
        b.begin({ module: 'services', topic: 'practice' }, null, 1),
      ]);
      expect(results).toEqual([true, false]);
      const saved = restoreChallenge2(f.memory.get(challenge2Key)!);
      expect(saved.save.events).toHaveLength(1);
      expect(challenge2Facts(saved.save).origin).toEqual(origin);
      expect(b.getSnapshot().issue).toBe('conflict');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
