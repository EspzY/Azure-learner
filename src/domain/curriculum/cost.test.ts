import { describe, expect, it } from 'vitest';
import {
  allocateCost,
  costAnalysis,
  costDataset,
  estimateCost,
  estimatePrediction,
  evaluateBudget,
  initialEstimate,
  initialTags,
  validBudget,
  validEstimate,
  validTags,
} from './cost-model';
import {
  applyCost,
  costFacts,
  costHref,
  costItems,
  costItemIds,
  costLimit,
  costManifest,
  costMilestoneFacts,
  costTopics,
  evaluateCostAttempt,
  freshCost,
  guidedCostFacts,
  restoreCost,
  type CostSave,
} from './cost';
import { CostStore } from './cost-store';
import { costSources, costStudySources } from './cost-sources';
import { costNb, costItemsNb } from '@/content/nb';
const apply = (s: CostSave, e: unknown) => {
  const n = applyCost(s, e);
  if (!n) throw Error('fixture');
  return n;
};
const storage = () => {
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
describe('P04 fixed pedagogical costs, not Azure billing', () => {
  it('uses explicit units and exact minor-unit totals', () => {
    const r = estimateCost(initialEstimate)!;
    expect(r.lines.map((l) => l.cents)).toEqual([72000, 1000, 100, 1000, 0, 0]);
    expect(r.cents).toBe(74100);
    expect(r.lines.every((l) => l.period === '30-day' && l.scope === 'app')).toBe(true);
    expect(estimateCost({ ...initialEstimate, hours: 240 })!.cents).toBe(26100);
    expect(estimatePrediction(initialEstimate, { ...initialEstimate, hours: 240 })).toBe('lower');
    expect(estimatePrediction(initialEstimate, { ...initialEstimate })).toBe('same');
  });
  it('retained storage and support survive zero compute hours', () => {
    const r = estimateCost({ ...initialEstimate, hours: 0, support: true })!;
    expect(r.lines.find((l) => l.id === 'compute')!.cents).toBe(0);
    expect(r.cents).toBe(14100);
    expect(
      estimateCost({ ...initialEstimate, hours: 0, pricing: 'reservation' })!.lines[0]!.cents,
    ).toBe(50400);
    expect(
      estimateCost({ ...initialEstimate, hours: 0, pricing: 'savings' })!.lines[0]!.cents,
    ).toBe(36000);
  });
  it('commitment benefits leave licensing/storage untouched; unused savings hours expire', () => {
    const p = estimateCost({ ...initialEstimate, license: true, pricing: 'payg' })!,
      r = estimateCost({ ...initialEstimate, license: true, pricing: 'reservation' })!;
    expect(p.lines.filter((l) => l.id !== 'compute')).toEqual(
      r.lines.filter((l) => l.id !== 'compute'),
    );
    expect(r.lines[0]!.cents).toBe(50400);
    // 720*0.50 commitment +240*(1 - 0.50/0.75)*1 PAYG remainder.
    expect(
      estimateCost({ ...initialEstimate, hours: 240, pricing: 'savings' })!.lines[0]!.cents,
    ).toBe(44000);
    expect(estimateCost({ ...initialEstimate, pricing: 'spot' })!.lines[0]!.cents).toBe(25200);
    expect(estimateCost({ ...initialEstimate, service: 'paas', pricing: 'spot' })).toBeNull();
  });
  it('region/class/count/quantity changes affect the declared drivers deterministically', () => {
    const i = {
      ...initialEstimate,
      count: 2,
      size: 'large' as const,
      region: 'north' as const,
      hours: 100,
      license: true,
    };
    expect(estimateCost(i)!.cents).toBe(54100);
    expect(estimateCost(i)).toEqual(estimateCost(i));
    expect(estimateCost({ ...i, service: 'paas' })!.lines[0]!.cents).toBe(72000);
  });
  it('rejects fractional/negative/unknown/oversized/coerced inputs', () => {
    for (const bad of [
      { hours: -1 },
      { hours: 721 },
      { hours: 1.5 },
      { count: 0 },
      { storage: 2001 },
      { egress: Infinity },
      { region: 'moon' },
      { support: 'true' },
      { service: { toString: () => 'vm' } },
      { surprise: 1 },
    ])
      expect(validEstimate({ ...initialEstimate, ...bad })).toBe(false);
    expect(estimateCost(null)).toBeNull();
    expect(validBudget({ scope: 'app', amount: 0, type: 'actual', percent: 80 })).toBe(false);
  });
  it('decomposes a dated increase and conserves group/scope totals', () => {
    expect(costDataset).toHaveLength(120);
    const all = costAnalysis('all');
    expect(all.cents).toBe(62700);
    expect(all.forecast).toBe(106700);
    const app = costAnalysis('app');
    expect(app.cents).toBe(43700);
    expect(app.forecast).toBe(78200);
    expect(app.groups.find((g) => g.key === 'compute')).toMatchObject({
      earlier: 8000,
      later: 32000,
      delta: 24000,
    });
    expect(costAnalysis('shared').cents + app.cents).toBe(all.cents);
    for (const dimension of ['component', 'service', 'scope', 'group'] as const)
      expect(costAnalysis('all', dimension).groups.reduce((s, g) => s + g.cents, 0)).toBe(
        all.cents,
      );
    expect(all.days[19]).toEqual({ day: 20, cents: 62700, projected: false });
    expect(all.days[29]).toEqual({ day: 30, cents: 106700, projected: true });
    expect(() => costAnalysis('invalid' as 'all')).toThrow();
  });
  it('distinguishes price, quantity and mix rather than hardcoded button totals', () => {
    const r = costDataset.filter((r) => r.resource === 'fixture-transfer');
    expect(new Set(r.map((x) => x.rateCents))).toEqual(new Set([20, 30]));
    expect(new Set(r.map((x) => x.quantity))).toEqual(new Set([2, 5]));
    expect(
      costDataset
        .filter((r) => r.resource === 'fixture-large' && r.day <= 10)
        .every((r) => r.cents === 0),
    ).toBe(true);
    expect(costDataset.every((r) => r.cents === r.quantity * r.rateCents)).toBe(true);
  });
  it('actual and forecast alerts have correct scope/threshold without operational effects', () => {
    const actual = evaluateBudget({ scope: 'app', amount: 600, percent: 80, type: 'actual' })!,
      forecast = evaluateBudget({ scope: 'app', amount: 600, percent: 100, type: 'forecast' })!;
    expect(actual).toMatchObject({
      observed: 43700,
      thresholdCents: 48000,
      triggered: false,
      resourcesStopped: false,
      emailsSent: 0,
    });
    expect(forecast).toMatchObject({
      observed: 78200,
      thresholdCents: 60000,
      triggered: true,
      resourcesStopped: false,
      emailsSent: 0,
    });
    expect(
      evaluateBudget({ scope: 'shared', amount: 600, percent: 100, type: 'forecast' })!.triggered,
    ).toBe(false);
    expect(
      evaluateBudget({ scope: 'app', amount: 437, percent: 100, type: 'actual' })!.triggered,
    ).toBe(true);
    expect(
      evaluateBudget({ scope: 'all', amount: 600, percent: 100, type: 'forecast' }),
    ).toBeNull();
  });
  it('report inheritance and conflict preference do not mutate resource tags or total cost', () => {
    const input = initialTags(),
      before = JSON.stringify(input),
      off = allocateCost(input)!,
      keep = allocateCost({ ...input, mode: 'keep-resource' })!,
      parent = allocateCost({ ...input, mode: 'prefer-parent' })!;
    expect(off.unassigned).toBe(16700);
    expect(keep.unassigned).toBe(0);
    expect(keep.rows.find((r) => r.id === 'fixture-plan')!.report.department).toBe('Finance');
    expect(parent.rows.find((r) => r.id === 'fixture-plan')!.report.department).toBe('Shared');
    expect(parent.rows.find((r) => r.id === 'fixture-plan')!.direct.department).toBe('Finance');
    expect(parent.rows.find((r) => r.id === 'fixture-transfer')!.emits).toBe(false);
    expect([off.cents, keep.cents, parent.cents]).toEqual([62700, 62700, 62700]);
    expect(JSON.stringify(input)).toBe(before);
    expect(validTags({ ...input, values: { ...input.values, secret: 'private' } })).toBe(false);
    expect(validTags({ ...input, mode: 'automatic-ARM-inheritance' })).toBe(false);
  });
});
describe('new isolated cost learning evidence', () => {
  it('does not attribute mixed parameter changes to compute time or credit them as the required contrast', () => {
    let s = apply(freshCost(), { kind: 'mission', mission: 'estimate' });
    s = apply(s, {
      kind: 'run',
      mission: 'estimate',
      input: initialEstimate,
      baseline: initialEstimate,
      prediction: 'same',
    });
    s = apply(s, {
      kind: 'run',
      mission: 'estimate',
      input: { ...initialEstimate, hours: 240, region: 'north' },
      baseline: initialEstimate,
      prediction: 'lower',
    });
    expect(costMilestoneFacts(s).time).toBe(false);
    expect(guidedCostFacts(costFacts(s).guide!).witnessed).toBe(false);
    const reordered = Object.fromEntries(
      Object.entries({ ...initialEstimate, hours: 240 }).reverse(),
    );
    s = apply(s, {
      kind: 'run',
      mission: 'estimate',
      input: reordered,
      baseline: initialEstimate,
      prediction: 'lower',
    });
    expect(costMilestoneFacts(s).time).toBe(true);
    expect(guidedCostFacts(costFacts(s).guide!).witnessed).toBe(true);
  });
  it('pins the prediction comparison and copies caller-owned input before replay', () => {
    const input = { ...initialEstimate };
    let s = apply(freshCost(), { kind: 'mission', mission: 'estimate' });
    s = apply(s, {
      kind: 'run',
      mission: 'estimate',
      input,
      baseline: { ...initialEstimate, hours: 120 },
      prediction: 'higher',
    });
    input.hours = 0;
    const event = s.events.at(-1)!;
    expect(event).toMatchObject({
      input: { hours: 720 },
      baseline: { hours: 120 },
      prediction: 'higher',
    });
    expect(restoreCost(JSON.stringify(s)).save).toEqual(s);
  });
  it('does not credit a visit, start, prediction or one model run as guided completion', () => {
    let s = apply(freshCost(), { kind: 'visit', topic: 'estimate' });
    s = apply(s, { kind: 'mission', mission: 'estimate' });
    s = apply(s, {
      kind: 'run',
      mission: 'estimate',
      input: initialEstimate,
      baseline: initialEstimate,
      prediction: 'lower',
    });
    expect(costFacts(s).completed).toEqual([]);
    expect(applyCost(s, { kind: 'explain', answer: 0 })).toBeNull();
    expect(costFacts(s).firsts).toEqual([]);
    s = apply(s, {
      kind: 'run',
      mission: 'estimate',
      input: { ...initialEstimate, hours: 240 },
      baseline: initialEstimate,
      prediction: 'lower',
    });
    expect(costMilestoneFacts(s).time).toBe(true);
    s = apply(s, { kind: 'explain', answer: 1 });
    expect(costFacts(s).completed).toEqual([]);
    s = apply(s, { kind: 'explain', answer: 0 });
    expect(costFacts(s).completed).toEqual(['estimate']);
    expect(restoreCost(JSON.stringify(s)).save).toEqual(s);
  });
  it('reserves a witnessed guided explanation at the work bound without permitting new work', () => {
    let s = freshCost();
    while (s.events.length < costLimit - 8)
      s = apply(s, {
        kind: 'visit',
        topic: s.events.length % 2 ? 'drivers' : 'introduction',
      });
    s = apply(s, { kind: 'mission', mission: 'estimate' });
    for (const hours of [720, 240])
      s = apply(s, {
        kind: 'run',
        mission: 'estimate',
        input: { ...initialEstimate, hours },
        baseline: initialEstimate,
        prediction: 'lower',
      });
    expect(s.events).toHaveLength(costLimit - 5);
    expect(guidedCostFacts(costFacts(s).guide!).witnessed).toBe(true);
    const prefix = structuredClone(s.events);
    for (const kind of ['run', 'configure'])
      expect(
        applyCost(s, {
          kind,
          mission: 'estimate',
          input: initialEstimate,
          baseline: initialEstimate,
          ...(kind === 'run' ? { prediction: 'same' } : {}),
        }),
      ).toBeNull();
    expect(applyCost(s, { kind: 'mission', mission: 'analysis' })).toBeNull();
    expect(applyCost(s, { kind: 'begin', item: 'cm01' })).toBeNull();
    s = apply(s, { kind: 'explain', answer: 1 });
    expect(costFacts(s).completed).toEqual([]);
    expect(applyCost(s, { kind: 'explain', answer: 1 })).toBe(s);
    s = apply(s, { kind: 'explain', answer: 0 });
    expect(costFacts(s).completed).toEqual(['estimate']);
    expect(s.events.slice(0, prefix.length)).toEqual(prefix);
    expect(costFacts(s).firsts).toEqual([]);
    expect(applyCost(s, { kind: 'explain', answer: 2 })).toBe(s);
    expect(restoreCost(JSON.stringify(s)).save).toEqual(s);
  });
  it('requires both budget contexts and actual tag/report contrasts', () => {
    let s = apply(freshCost(), { kind: 'mission', mission: 'budgets' });
    s = apply(s, {
      kind: 'run',
      mission: 'budgets',
      input: { scope: 'app', amount: 600, percent: 80, type: 'actual' },
      prediction: 'lower',
    });
    expect(guidedCostFacts(costFacts(s).guide!).witnessed).toBe(false);
    s = apply(s, {
      kind: 'run',
      mission: 'budgets',
      input: { scope: 'app', amount: 600, percent: 100, type: 'forecast' },
      prediction: 'higher',
    });
    expect(costMilestoneFacts(s).budget).toBe(true);
    s = apply(s, { kind: 'explain', answer: 2 });
    expect(costFacts(s).completed).toContain('budgets');
    s = apply(s, { kind: 'mission', mission: 'tags' });
    s = apply(s, { kind: 'run', mission: 'tags', input: initialTags(), prediction: 'same' });
    const i = initialTags();
    i.values['fixture-large'] = { department: 'Product', environment: 'Development' };
    i.values['fixture-disk'] = { department: 'Product', environment: 'Development' };
    for (const mode of ['keep-resource', 'prefer-parent'] as const)
      s = apply(s, { kind: 'run', mission: 'tags', input: { ...i, mode }, prediction: 'same' });
    s = apply(s, { kind: 'explain', answer: 0 });
    expect(costFacts(s).completed).toContain('tags');
  });
  it('rejects cross-mission runs, wrong inputs and false explanation transitions', () => {
    expect(
      applyCost(freshCost(), {
        kind: 'run',
        mission: 'estimate',
        input: initialEstimate,
        baseline: initialEstimate,
        prediction: 'same',
      }),
    ).toBeNull();
    const s = apply(freshCost(), { kind: 'mission', mission: 'analysis' });
    expect(
      applyCost(s, {
        kind: 'run',
        mission: 'estimate',
        input: initialEstimate,
        baseline: initialEstimate,
        prediction: 'same',
      }),
    ).toBeNull();
    expect(
      applyCost(s, {
        kind: 'run',
        mission: 'analysis',
        input: { scope: 'all', dimension: 'price' },
        prediction: 'same',
      }),
    ).toBeNull();
    expect(applyCost(s, { kind: 'explain', answer: 0 })).toBeNull();
  });
  it('evaluates all ninety decision/reason combinations and mismatches', () => {
    for (const id of costItemIds)
      for (let decision = 0; decision < 3; decision++)
        for (let reason = 0; reason < 3; reason++) {
          let s = apply(freshCost(), { kind: 'begin', item: id });
          s = apply(s, { kind: 'draft', answer: { decision, reason } });
          s = apply(s, { kind: 'submit' });
          const a = costFacts(s).current!,
            r = evaluateCostAttempt(a),
            expected = costItems[id].accepted;
          expect(r.relation).toBe(decision === expected[0] && reason === expected[1]);
          expect(r.decision).toBe(decision === expected[0]);
          expect(restoreCost(JSON.stringify(s)).save).toEqual(s);
        }
  });
  it('keeps firsts immutable and distinguishes aid, family exposure, retry and abandonment', () => {
    let s = apply(freshCost(), { kind: 'begin', item: 'cm01' });
    s = apply(s, { kind: 'draft', answer: { decision: 0, reason: 0 } });
    s = apply(s, { kind: 'submit' });
    const prefix = JSON.stringify(s.events);
    s = apply(s, { kind: 'begin', item: 'cm01' });
    s = apply(s, { kind: 'aid' });
    s = apply(s, { kind: 'draft', answer: { decision: 1, reason: 2 } });
    s = apply(s, { kind: 'submit' });
    expect(costFacts(s).firsts[0]).toMatchObject({
      assisted: false,
      retry: false,
      answer: { decision: 0, reason: 0 },
    });
    expect(costFacts(s).current).toMatchObject({ assisted: true, retry: true });
    expect(JSON.stringify(s.events.slice(0, 3))).toBe(prefix);
    s = apply(s, { kind: 'begin', item: 'cm02' });
    expect(costFacts(s).current!.retry).toBe(true);
    s = apply(s, { kind: 'abandon' });
    expect(costFacts(s).firsts).toHaveLength(1);
  });
  it('active assessment blocks guided side effects and requires complete answers', () => {
    const s = apply(freshCost(), { kind: 'begin', item: 'cm03' });
    expect(applyCost(s, { kind: 'mission', mission: 'estimate' })).toBeNull();
    expect(applyCost(s, { kind: 'submit' })).toBeNull();
    expect(applyCost(s, { kind: 'begin', item: 'cm04' })).toBeNull();
    expect(costFacts(s).completed).toEqual([]);
  });
  it('reserves terminal help and submit/abandon capacity at the actual boundary', () => {
    let s = apply(freshCost(), { kind: 'begin', item: 'cm01' });
    while (s.events.length < costLimit - 2)
      s = apply(s, { kind: 'draft', answer: { decision: s.events.length % 2, reason: 0 } });
    expect(applyCost(s, { kind: 'draft', answer: { decision: 2, reason: 1 } })).toBeNull();
    s = apply(s, { kind: 'aid' });
    s = apply(s, { kind: 'submit' });
    expect(s.events).toHaveLength(costLimit);
    expect(costFacts(s).active).toBe(false);
    expect(restoreCost(JSON.stringify(s)).issue).toBeNull();
    expect(applyCost(s, { kind: 'begin', item: 'cm02' })).toBeNull();
    const s2 = { ...s, events: s.events.slice(0, -1) };
    expect(applyCost(s2, { kind: 'abandon' })!.events).toHaveLength(costLimit);
  });
  it('rejects corrupt, unsupported, forged completion and impossible event order', () => {
    for (const raw of [
      '{',
      '[]',
      JSON.stringify({ ...freshCost(), extra: true }),
      JSON.stringify({ ...freshCost(), events: [{ kind: 'submit' }] }),
      JSON.stringify({
        ...freshCost(),
        events: [
          { kind: 'visit', topic: 'introduction' },
          { kind: 'visit', topic: 'introduction' },
        ],
      }),
    ])
      expect(restoreCost(raw).issue).toBe('corrupt');
    expect(restoreCost(JSON.stringify({ ...freshCost(), model: 'future' })).issue).toBe(
      'unsupported',
    );
    expect(restoreCost('x'.repeat(600001)).issue).toBe('corrupt');
  });
  it('durable write failure does not publish optimistic evidence', () => {
    const mem = storage(),
      s = new CostStore({
        ...mem,
        setItem: () => {
          throw Error('denied');
        },
      });
    s.load();
    expect(s.event({ kind: 'begin', item: 'cm01' })).toBe(false);
    expect(s.getSnapshot().issue).toBe('unsaved');
    expect(costFacts(s.getSnapshot().save).attempts).toEqual([]);
    expect(mem.data.size).toBe(0);
  });
  it('cross-tab stale writers do not overwrite a newer answer; reload is explicit', () => {
    const mem = storage(),
      a = new CostStore(mem),
      b = new CostStore(mem);
    a.load();
    b.load();
    expect(a.event({ kind: 'begin', item: 'cm01' })).toBe(true);
    expect(b.event({ kind: 'begin', item: 'cm02' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    b.load();
    expect(costFacts(b.getSnapshot().save).current!.item).toBe('cm01');
    expect(b.prepareTeaching()).toBe(true);
    a.changed();
    expect(a.getSnapshot().issue).toBe('conflict');
    a.load();
    expect(costFacts(a.getSnapshot().save).assisted).toBe(true);
  });
  it('compare-before-delete scoped recovery preserves a newer valid record and unrelated bytes', () => {
    const mem = storage();
    mem.setItem('azurelab.learning.cost-management.v1', '{');
    mem.setItem('old-record', 'unchanged');
    const s = new CostStore(mem);
    s.load();
    const newer = JSON.stringify(apply(freshCost(), { kind: 'begin', item: 'cm01' }));
    mem.setItem('azurelab.learning.cost-management.v1', newer);
    expect(s.recoverInvalid()).toBe(false);
    expect(mem.getItem('azurelab.learning.cost-management.v1')).toBe(newer);
    expect(mem.getItem('old-record')).toBe('unchanged');
  });
  it('denied help fails closed and read-back races are conflicts', () => {
    const mem = storage(),
      s = new CostStore(mem);
    s.load();
    s.event({ kind: 'begin', item: 'cm01' });
    const raw = mem.getItem('azurelab.learning.cost-management.v1');
    const denied = new CostStore({
      ...mem,
      setItem: () => {
        throw Error('denied');
      },
    });
    denied.load();
    expect(denied.prepareTeaching()).toBe(false);
    expect(mem.getItem('azurelab.learning.cost-management.v1')).toBe(raw);
    const raced = new CostStore({ ...mem, setItem: (k, v) => mem.setItem(k, v + ' ') });
    raced.load();
    expect(raced.event({ kind: 'aid' })).toBe(false);
    expect(raced.getSnapshot().issue).toBe('conflict');
  });
  it('registers real teaching, objective/family/source feedback, without XP or copied quiz', () => {
    expect(costManifest.certificationOverlay.slots).toEqual({
      '3.1.01': 'CM01',
      '3.1.02': 'CM02',
      '3.1.03': 'CM03',
      '3.1.04': 'CM04',
    });
    expect(costTopics.every((t) => costNb.topics[t])).toBe(true);
    for (const [topic, ids] of Object.entries(costStudySources)) {
      expect(topic in costNb.sections).toBe(true);
      for (const id of ids) expect(costSources[id]).toBeTruthy();
    }
    for (const id of costItemIds) {
      const copy = costItemsNb[id];
      expect(copy.decisions).toHaveLength(3);
      expect(copy.reasons).toHaveLength(3);
      expect(copy.feedback.flat()).toHaveLength(6);
      expect(costHref('assessment', id)).toMatch(/case=cm\d\d$/);
      for (const s of costItems[id].sources)
        expect(costSources[s as keyof typeof costSources]).toBeTruthy();
    }
    for (const objective of ['CM01', 'CM02', 'CM03', 'CM04'])
      expect(
        costItemIds.filter((id) =>
          (costItems[id].objectives as readonly string[]).includes(objective),
        ).length,
      ).toBeGreaterThanOrEqual(2);
    expect(costNb.synthetic).toContain('ikke faktiske Azure-priser');
    expect(costManifest.humanSme).toBeNull();
  });
});
