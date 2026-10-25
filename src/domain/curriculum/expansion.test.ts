import { describe, it, expect } from 'vitest';
import { experiment, validInput, activities } from './expansion-models';
import {
  fresh,
  apply,
  restore,
  facts,
  assess,
  expansionKeys,
  type Save,
  type Track,
} from './expansion';
import { ExpansionStore } from './expansion-store';
import { validateExpansion } from './expansion-content';
const run = (save: Save, event: unknown) => {
  const next = apply(save, event);
  expect(next).not.toBeNull();
  return next!;
};
const input = (unit: keyof typeof activities, change: Record<string, string | number> = {}) => ({
  ...activities[unit].initial,
  ...change,
});
describe('3.2 bounded teaching models (not actual Azure runtime)', () => {
  it('contrasts capacity with fault tolerance and routing, preserving demand conservation', () => {
    const n = experiment('availability', input('availability', { failed: 'one' }))!;
    expect(n.metrics.served).toBe(0);
    const parallel = experiment(
      'availability',
      input('availability', { instances: 2, size: 4, routing: 'balanced', failed: 'one' }),
    )!;
    expect(parallel.metrics).toMatchObject({ available: 4, served: 4, unmet: 2 });
    expect(
      experiment(
        'availability',
        input('availability', { instances: 2, size: 4, routing: 'single', failed: 'one' }),
      )!.metrics.served,
    ).toBe(0);
  });
  it('does not repair dependencies with compute or turn monitoring into extra capacity', () => {
    expect(
      experiment('reliability', input('reliability', { incident: 'dependency', remedy: 'scale' }))!
        .metrics.served,
    ).toBe(0);
    expect(
      experiment(
        'reliability',
        input('reliability', { incident: 'dependency', remedy: 'restore' }),
      )!.metrics.served,
    ).toBe(6);
    expect(
      experiment('reliability', input('reliability', { incident: 'trend', remedy: 'observe' }))!
        .metrics.available,
    ).toBe(6);
  });
  it('uses the actual location policy and preserves rejected fork state counts', () => {
    const no = experiment('governance', input('governance'))!.receipt!;
    expect(no.code).toBe('policy-location-denied');
    expect(no.afterCount).toBe(no.beforeCount);
    expect(
      experiment('governance', input('governance', { region: 'westeurope' }))!.receipt?.outcome,
    ).toBe('accepted');
    expect(
      experiment('governance', input('governance', { subscription: 'sub-shared' }))!.receipt
        ?.outcome,
    ).toBe('accepted');
  });
  it('distinguishes consistent wrong templates and functional efficiency tradeoffs', () => {
    expect(
      experiment('management', input('management', { method: 'template' }))!.metrics,
    ).toMatchObject({ consistent: 'yes', violations: 3 });
    expect(
      experiment('management', input('management', { method: 'template', template: 'westeurope' }))!
        .metrics.violations,
    ).toBe(0);
    expect(
      experiment('sustainability', input('sustainability', { capacity: 4, hours: 8 }))!.metrics,
    ).toMatchObject({ allocated: 32, served: 16, unmet: 0 });
    expect(
      experiment(
        'sustainability',
        input('sustainability', { profile: 'critical', capacity: 4, hours: 8 }),
      )!.metrics.unmet,
    ).toBe(32);
  });
  it('checks VM requirements, PaaS compatibility and SaaS retained controls without provisioning', () => {
    expect(experiment('iaas', input('iaas'))!.issues).toHaveLength(6);
    expect(
      experiment(
        'iaas',
        input('iaas', {
          guest: 'windows',
          ram: 8,
          disk: 'persistent',
          network: 'configured',
          runtime: 'installed',
          patch: 'planned',
        }),
      )!.witnesses,
    ).toContain('complete');
    expect(experiment('paas', input('paas', { package: 'driver' }))!.code).toBe('driver');
    expect(experiment('saas', input('saas', { user: 'departed' }))!.metrics.canUse).toBe('no');
    expect(
      experiment(
        'selection',
        input('selection', { scenario: 'open', model: 'iaas', reason: 'os-team' }),
      )!.witnesses,
    ).toContain('open');
    expect(
      experiment(
        'selection',
        input('selection', { scenario: 'open', model: 'paas', reason: 'platform-supported' }),
      )!.witnesses,
    ).toContain('open');
  });
  it('rejects invalid, extra, nonfinite and cross-model inputs', () => {
    for (const unit of Object.keys(activities) as (keyof typeof activities)[]) {
      expect(validInput(unit, activities[unit].initial)).toBe(true);
      expect(experiment(unit, { ...activities[unit].initial, arbitrary: true })).toBeNull();
    }
    expect(experiment('availability', input('availability', { instances: NaN }))).toBeNull();
    expect(experiment('availability', input('availability', { instances: 200 }))).toBeNull();
  });
});
describe('3.2 evidence, schema and storage boundaries', () => {
  it('binds all authored objectives, original feedback and sources', () =>
    expect(validateExpansion()).toEqual([]));
  it('does not award progress from visits and rejects premature answers/cross-module activity', () => {
    let s = run(fresh('benefits'), { kind: 'visit', unit: 'availability' });
    expect(facts(s).guided('availability')).toBe(false);
    expect(apply(s, { kind: 'answer', unit: 'availability', answer: 'recovery' })).toBeNull();
    expect(
      apply(s, { kind: 'run', unit: 'iaas', input: input('iaas'), prediction: null }),
    ).toBeNull();
    s = run(s, { kind: 'run', unit: 'availability', input: input('availability'), prediction: 6 });
    expect(facts(s).guidedComplete).toBe(false);
    expect(restore('services', JSON.stringify(s)).issue).toBeTruthy();
  });
  it('retains drafts, first answers, assistance, retries and abandoned attempts on replay', () => {
    let s = run(fresh('benefits'), { kind: 'begin' });
    s = run(s, { kind: 'draft', answers: { unmet: '1' } });
    expect(restore('benefits', JSON.stringify(s)).save).toEqual(s);
    s = run(s, { kind: 'aid' });
    const answers = {
      unmet: '1',
      dependency: 'restore',
      policy: 'one-rule',
      template: 'review',
      sustainability: 'data',
      forecast: 'usage',
    };
    s = run(s, { kind: 'draft', answers });
    s = run(s, { kind: 'submit' });
    expect(facts(s).submissions[0]?.assisted).toBe(true);
    s = run(s, { kind: 'begin' });
    s = run(s, { kind: 'abandon' });
    s = run(s, { kind: 'begin' });
    s = run(s, { kind: 'draft', answers });
    s = run(s, { kind: 'submit' });
    expect(facts(s).submissions[1]?.retry).toBe(true);
    expect(facts(s).attempts[1]?.status).toBe('abandoned');
    expect(facts(restore('benefits', JSON.stringify(s)).save).submissions).toEqual(
      facts(s).submissions,
    );
  });
  it('accepts two justified alternatives but rejects crossed reasoning', () => {
    expect(assess('services', { architecture: 'iaas', reason: 'os-team' }).architecture).toBe(true);
    expect(
      assess('services', { architecture: 'paas', reason: 'platform-supported' }).architecture,
    ).toBe(true);
    expect(assess('services', { architecture: 'paas', reason: 'os-team' }).architecture).toBe(
      false,
    );
  });
  it('quarantines corrupted and unsupported records without false completion', () => {
    expect(restore('benefits', '{').issue).toBe('corrupt');
    expect(restore('benefits', JSON.stringify({ ...fresh('benefits'), content: '99' })).issue).toBe(
      'unsupported',
    );
    expect(
      restore('services', JSON.stringify({ ...fresh('services'), complete: true })).issue,
    ).toBe('corrupt');
  });
  it('isolates stores, rejects stale-tab writes and preserves old keys under reset', () => {
    const map = new Map<string, string>([['azurelab.portal.learning.v1', 'legacy-bytes']]);
    const storage = {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => {
        map.set(k, v);
      },
      removeItem: (k: string) => {
        map.delete(k);
      },
    };
    const a = new ExpansionStore('benefits', storage),
      b = new ExpansionStore('benefits', storage),
      services = new ExpansionStore('services', storage);
    a.load();
    b.load();
    services.load();
    a.event({ kind: 'visit', unit: 'availability' });
    expect(b.event({ kind: 'begin' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    expect(services.getSnapshot().save.events).toEqual([]);
    a.clear();
    expect(map.get('azurelab.portal.learning.v1')).toBe('legacy-bytes');
    expect(map.has(expansionKeys.services)).toBe(false);
  });
  it('handles denied reads/writes and unknown event keys safely', () => {
    for (const track of ['benefits', 'services'] as Track[]) {
      const store = new ExpansionStore(track, {
        getItem: () => {
          throw Error('denied');
        },
        setItem: () => {
          throw Error('denied');
        },
        removeItem: () => {
          throw Error('denied');
        },
      });
      store.load();
      expect(store.getSnapshot().issue).toBe('unsaved');
      expect(store.event({ kind: 'begin' })).toBe(true);
      expect(store.getSnapshot().issue).toBe('unsaved');
      expect(apply(fresh(track), { kind: 'begin', complete: true })).toBeNull();
    }
  });
});
