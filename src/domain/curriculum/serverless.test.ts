import { describe, it, expect } from 'vitest';
import {
  applyServerless,
  executeEvents,
  freshServerless,
  initialExecution,
  restoreServerless,
  serverlessCriteria,
  serverlessFacts,
  serverlessKey,
  serverlessManifest,
  serverlessTopics,
  serverlessActivities,
} from './serverless';
import { ServerlessStore } from './serverless-store';
import { serverlessNb as c } from '@/content/nb';
import { courseTopic } from '../course/model';
const right = Object.fromEntries(Object.entries(serverlessCriteria).map(([k, v]) => [k, v.answer]));
const add = (s: ReturnType<typeof freshServerless>, e: unknown) => {
  const n = applyServerless(s, e);
  expect(n).not.toBeNull();
  return n!;
};
describe('FC08 bounded execution mechanism, never Azure runtime', () => {
  it('conserves every event deterministically across all bounded inputs and situations', () => {
    for (const situation of ['warm', 'cold', 'code-error'] as const)
      for (let count = 0; count <= 12; count++)
        for (let slots = 1; slots <= 4; slots++)
          for (let rounds = 1; rounds <= 3; rounds++) {
            const input = { ...initialExecution, count, slots, rounds, situation },
              r = executeEvents(input)!;
            expect(r.completed + r.failed + r.pending).toBe(count);
            expect(r.events.filter((e) => e.round !== null)).toHaveLength(r.started);
            expect(executeEvents(input)).toEqual(r);
            expect(input).toEqual({ ...initialExecution, count, slots, rounds, situation });
          }
  });
  it('separates trigger from code failure and cold preparation from pending work', () => {
    expect(executeEvents({ ...initialExecution, count: 0, situation: 'cold' })).toMatchObject({
      started: 0,
      preparationRounds: 0,
    });
    expect(executeEvents(initialExecution)).toMatchObject({
      started: 4,
      completed: 4,
      pending: 3,
      failed: 0,
    });
    expect(executeEvents({ ...initialExecution, situation: 'cold' })).toMatchObject({
      started: 2,
      completed: 2,
      pending: 5,
    });
    const r = executeEvents({ ...initialExecution, situation: 'code-error' })!;
    expect(r.events[0]).toMatchObject({ round: 1, state: 'failed' });
    expect(r).toMatchObject({ started: 4, completed: 3, pending: 3, failed: 1 });
  });
  it('rejects malformed, negative, fractional, unbounded and unsupported input', () => {
    for (const v of [
      null,
      [],
      {},
      { ...initialExecution, count: -1 },
      { ...initialExecution, count: 13 },
      { ...initialExecution, slots: 0 },
      { ...initialExecution, rounds: 4 },
      { ...initialExecution, count: 1.5 },
      { ...initialExecution, event: 'azure-command' },
      { ...initialExecution, extra: true },
    ])
      expect(executeEvents(v)).toBeNull();
  });
});
describe('versioned learning observations and independent integrity', () => {
  it('never completes teaching/practice from visits, a run or old completion flags', () => {
    let s = freshServerless();
    for (const topic of serverlessTopics) s = add(s, { kind: 'visit', topic });
    s = add(s, { kind: 'run', input: initialExecution, prediction: 1 });
    expect(serverlessFacts(s)).toMatchObject({
      guided: false,
      taught: false,
      firstIndependent: undefined,
    });
    expect(restoreServerless(JSON.stringify({ ...s, complete: true })).issue).toBe('corrupt');
  });
  it('requires actual contrasting run witnesses and causal explanation for guided practice', () => {
    for (const situation of ['cold', 'code-error'] as const) {
      const one = add(
        add(freshServerless(), {
          kind: 'run',
          input: { ...initialExecution, situation },
          prediction: 0,
        }),
        { kind: 'explain', answer: 'code-result' },
      );
      expect(serverlessFacts(one).runs).toHaveLength(1);
      expect(serverlessFacts(one).guided).toBe(false);
    }
    let s = add(freshServerless(), { kind: 'run', input: initialExecution, prediction: 1 });
    s = add(s, { kind: 'explain', answer: 'code-result' });
    expect(serverlessFacts(s).guided).toBe(false);
    s = add(s, {
      kind: 'run',
      input: { ...initialExecution, situation: 'code-error' },
      prediction: 8,
    });
    expect(serverlessFacts(s).guided).toBe(true);
  });
  it('commits immutable first unaided answers before feedback; retry and assistance remain distinct', () => {
    let s = add(freshServerless(), { kind: 'begin' });
    expect(applyServerless(s, { kind: 'begin' })).toBeNull();
    expect(applyServerless(s, { kind: 'submit', answers: { webhook: 'functions' } })).toBeNull();
    s = add(s, { kind: 'submit', answers: { ...right, bill: 'zero' } });
    const first = serverlessFacts(s).submissions[0];
    s = add(s, { kind: 'begin' });
    s = add(s, { kind: 'aid' });
    s = add(s, { kind: 'submit', answers: right });
    const f = serverlessFacts(s);
    expect(f.submissions[0]).toEqual(first);
    expect(f.firstIndependent).toBe(false);
    expect(f.submissions[1]).toMatchObject({ retry: true, assisted: true });
  });
  it('abandon/reload/help cannot manufacture a new first attempt', () => {
    let s = add(freshServerless(), { kind: 'begin' });
    s = add(s, { kind: 'draft', answers: { webhook: 'vm' } });
    expect(serverlessFacts(restoreServerless(JSON.stringify(s)).save).draft).toEqual({
      webhook: 'vm',
    });
    s = add(s, { kind: 'abandon' });
    s = add(s, { kind: 'begin' });
    s = add(s, { kind: 'submit', answers: right });
    expect(serverlessFacts(s)).toMatchObject({ abandoned: 1, firstIndependent: false });
  });
  it('recognizes correct first unaided new scenarios without awarding XP', () => {
    const s = add(add(freshServerless(), { kind: 'begin' }), { kind: 'submit', answers: right });
    expect(serverlessFacts(s).firstIndependent).toBe(true);
    expect(s).not.toHaveProperty('xp');
    expect(restoreServerless(JSON.stringify(s)).save).toEqual(s);
  });
  it('quarantines unknown versions, invalid events, injected answers and limits', () => {
    expect(restoreServerless('{').issue).toBe('corrupt');
    expect(restoreServerless(JSON.stringify({ ...freshServerless(), rubric: '2.0.0' })).issue).toBe(
      'unsupported',
    );
    expect(
      restoreServerless(
        JSON.stringify({ ...freshServerless(), events: [{ kind: 'submit', answers: right }] }),
      ).issue,
    ).toBe('corrupt');
    expect(
      applyServerless(freshServerless(), { kind: 'run', input: initialExecution, prediction: NaN }),
    ).toBeNull();
    expect(
      applyServerless(
        {
          ...freshServerless(),
          events: Array(400).fill({ kind: 'visit', topic: 'serverless-concept' }),
        },
        { kind: 'begin' },
      ),
    ).toBeNull();
  });
});
describe('isolated safe storage and executable curriculum bindings', () => {
  const memory = () => {
    const data = new Map<string, string>();
    return {
      data,
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
      removeItem: (k: string) => {
        data.delete(k);
      },
    };
  };
  it('writes only supplement; preserves old Foundations, XP and Portal bytes', () => {
    const m = memory();
    for (const k of [
      'azurelab.learning.foundations.v1',
      'azurelab.learning.foundations.v2',
      'azurelab.sandbox.v2',
      'azurelab.progress.v1',
    ])
      m.data.set(k, 'existing bytes');
    const old = [...m.data];
    const s = new ServerlessStore(m);
    s.load();
    s.event({ kind: 'run', input: initialExecution, prediction: 3 });
    for (const [k, v] of old) expect(m.data.get(k)).toBe(v);
    const raw = m.data.get(serverlessKey);
    s.event({ kind: 'run', input: initialExecution, prediction: 3 });
    expect(m.data.get(serverlessKey)).toBe(raw);
    s.load();
    expect(serverlessFacts(s.getSnapshot().save).runs).toHaveLength(1);
  });
  it('stops stale writers and does not overwrite corrupt or unsupported data', () => {
    const m = memory(),
      a = new ServerlessStore(m),
      b = new ServerlessStore(m);
    a.load();
    b.load();
    a.event({ kind: 'begin' });
    expect(b.event({ kind: 'begin' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    b.load();
    expect(serverlessFacts(b.getSnapshot().save).active).toBe(true);
    m.setItem(serverlessKey, 'bad');
    a.load();
    expect(a.event({ kind: 'begin' })).toBe(false);
    expect(m.getItem(serverlessKey)).toBe('bad');
  });
  it('honestly retains memory-only progress on denied writes, with no hidden success restoration', () => {
    const m = memory(),
      s = new ServerlessStore({
        ...m,
        setItem: () => {
          throw Error('denied');
        },
      });
    s.load();
    expect(s.event({ kind: 'begin' })).toBe(true);
    expect(s.getSnapshot().issue).toBe('unsaved');
    expect(m.getItem(serverlessKey)).toBeNull();
    s.load();
    expect(serverlessFacts(s.getSnapshot().save).active).toBe(false);
  });
  it('registers objective, actual theory, wrong rationales, source and ordinary course routes', () => {
    expect(serverlessManifest.objective).toBe('FC08');
    expect(Object.keys(serverlessActivities)).toEqual(serverlessManifest.activities);
    expect(serverlessActivities['execute-serverless'].evaluate(initialExecution)).toEqual(
      executeEvents(initialExecution),
    );
    expect(serverlessManifest.humanSme).toBeNull();
    for (const topic of serverlessTopics) expect(courseTopic('computing', topic)).toBe(topic);
    for (const [id, q] of Object.entries(c.questions)) {
      expect(q.choices.map(([v]) => v)).toEqual(
        serverlessCriteria[id as keyof typeof serverlessCriteria].options,
      );
      for (const [value] of q.choices)
        expect((q.feedback as Record<string, string>)[value]).toBeTruthy();
    }
    for (const section of Object.values(c.sections)) {
      expect(section.paragraphs.every(Boolean)).toBe(true);
      for (const [value] of section.choices)
        expect((section.feedback as Record<string, string>)[value]).toBeTruthy();
    }
    expect(serverlessManifest.exam.preparationOnly).toBe('2.2.01');
  });
});
