import { describe, expect, it } from 'vitest';
import { architectureNb as c } from '@/content/nb';
import { PhysicalStore } from './architecture-physical-store';
import {
  applyPhysical,
  evaluateInfrastructure,
  facilities,
  failureTargets,
  freshPhysical,
  initialInfrastructure,
  physicalActivities,
  physicalCriteria,
  physicalFacts,
  physicalKey,
  physicalManifest,
  physicalSources,
  physicalStudy,
  physicalTopics,
  regionExamples,
  restorePhysical,
  validInfrastructure,
  type ExampleRegion,
  type InfrastructureInput,
  type PhysicalEvent,
  type PhysicalSave,
} from './architecture-physical';
import { courseHref, freshCourse, restoreCourse } from '../course/model';
import { officialLearning, officialPhysical } from './official';
const apply = (s: PhysicalSave, e: PhysicalEvent) => {
  const next = applyPhysical(s, e);
  expect(next).not.toBeNull();
  return next!;
};
const answers = Object.fromEntries(
  Object.entries(physicalCriteria).map(([id, c]) => [id, c.answer]),
);
const warm = { ...initialInfrastructure, failure: 'none', target: 'none' } as const;
const trap = {
  ...initialInfrastructure,
  placement: 'multi-zone',
  data: 'single',
  routing: 'healthy',
  failure: 'zone',
  target: 'norwayeast:a',
} as const;
const redundant = { ...trap, data: 'replicated' } as const;
function storage() {
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
}
describe('Part A physical mechanisms remain separate from operational Azure', () => {
  it('narrows failure propagation from facility to zone to region, including multiple facilities per zone', () => {
    const single = evaluateInfrastructure(initialInfrastructure)!;
    expect(single.status).toBe('unavailable');
    expect(single.apps[0]!.state).toBe('down');
    expect(single.sites.filter((s) => s.state === 'down')).toHaveLength(1);
    const zone = evaluateInfrastructure({
      ...initialInfrastructure,
      failure: 'zone',
      target: 'norwayeast:a',
    })!;
    expect(zone.sites.filter((s) => s.state === 'down')).toHaveLength(2);
    const region = evaluateInfrastructure({
      ...initialInfrastructure,
      failure: 'region',
      target: 'norwayeast',
    })!;
    expect(region.sites.filter((s) => s.state === 'down')).toHaveLength(6);
    expect(
      evaluateInfrastructure({
        ...warm,
        placement: 'same-zone',
        data: 'replicated',
        routing: 'healthy',
        failure: 'datacenter',
        target: 'norwayeast:a1',
      })!.status,
    ).toBe('serving');
    expect(
      evaluateInfrastructure({
        ...warm,
        placement: 'same-zone',
        data: 'replicated',
        routing: 'healthy',
        failure: 'zone',
        target: 'norwayeast:a',
      })!.status,
    ).toBe('unavailable');
  });
  it('separates surviving app process, data dependency and configured routing', () => {
    const r = evaluateInfrastructure(trap)!;
    expect(r.physicalSurvivors).toBe(1);
    expect(r.usable).toEqual([]);
    expect(r.status).toBe('unavailable');
    expect(r.data[0]!.state).toBe('down');
    expect(evaluateInfrastructure(redundant)!.status).toBe('serving');
    expect(evaluateInfrastructure({ ...redundant, routing: 'primary' })!.status).toBe(
      'unavailable',
    );
    expect(
      r.relations.some(
        (x) => x.type === 'requires-data' && x.from === 'app-2' && x.to === 'data-1',
      ),
    ).toBe(true);
  });
  it('never infers region replication or failover from pair metadata, including nonpaired and restricted examples', () => {
    expect(regionExamples.northeurope.pair).toBe('westeurope');
    expect(regionExamples.italynorth.pair).toBeNull();
    expect(regionExamples.norwaywest.restricted).toBe(true);
    const paired = {
      ...warm,
      region: 'westeurope',
      secondary: 'northeurope',
      failure: 'region',
      target: 'westeurope',
    } as const;
    expect(evaluateInfrastructure(paired)!.components).toHaveLength(2);
    expect(evaluateInfrastructure(paired)!.status).toBe('unavailable');
    const nonpaired = {
      ...paired,
      region: 'italynorth',
      secondary: 'westeurope',
      placement: 'multi-region',
      data: 'replicated',
      routing: 'healthy',
      target: 'italynorth',
    } as const;
    expect(evaluateInfrastructure(nonpaired)!.status).toBe('serving');
    expect(evaluateInfrastructure({ ...nonpaired, routing: 'primary' })!.status).toBe(
      'unavailable',
    );
    expect(evaluateInfrastructure({ ...nonpaired, data: 'single' })!.status).toBe('unavailable');
  });
  it('retains genuine uncertainty for nonzonal placement under smaller faults', () => {
    const zonal = evaluateInfrastructure({ ...initialInfrastructure, placement: 'nonzonal' })!;
    expect(zonal.apps[0]!.facility).toBeNull();
    expect(zonal.status).toBe('uncertain');
    expect(
      evaluateInfrastructure({
        ...initialInfrastructure,
        placement: 'nonzonal',
        failure: 'zone',
        target: 'norwayeast:a',
      })!.status,
    ).toBe('uncertain');
    expect(
      evaluateInfrastructure({
        ...initialInfrastructure,
        placement: 'nonzonal',
        failure: 'region',
        target: 'norwayeast',
      })!.status,
    ).toBe('unavailable');
    expect(evaluateInfrastructure({ ...warm, placement: 'nonzonal' })!.status).toBe('serving');
  });
  it('validates unsupported geography/failure/placement combinations without inventing results', () => {
    for (const input of [
      null,
      [],
      {},
      { ...initialInfrastructure, region: 'unknown' },
      { ...initialInfrastructure, secondary: 'unknown' },
      { ...initialInfrastructure, placement: 'failover' },
      { ...initialInfrastructure, data: true },
      { ...initialInfrastructure, routing: 'auto' },
      { ...initialInfrastructure, target: 'westeurope:a1' },
      { ...initialInfrastructure, extra: true },
      {
        ...initialInfrastructure,
        region: 'norwaywest',
        placement: 'multi-zone',
        target: 'norwaywest:d1',
      },
      { ...initialInfrastructure, region: 'norwaywest', failure: 'zone', target: 'norwaywest:a' },
      { ...initialInfrastructure, placement: 'multi-region', secondary: 'norwayeast' },
    ]) {
      expect(validInfrastructure(input)).toBe(false);
      expect(evaluateInfrastructure(input)).toBeNull();
    }
    expect(facilities('norwaywest').every((s) => s.zone === null)).toBe(true);
  });
  it('derives deterministic results and honest state/relations across all bounded supported inputs', () => {
    let checked = 0;
    for (const region of Object.keys(regionExamples) as ExampleRegion[])
      for (const placement of [
        'single',
        'same-zone',
        'multi-zone',
        'multi-region',
        'nonzonal',
      ] as const)
        for (const data of ['single', 'replicated'] as const)
          for (const routing of ['primary', 'healthy'] as const)
            for (const failure of ['none', 'datacenter', 'zone', 'region'] as const) {
              const draft = {
                region,
                secondary: region === 'northeurope' ? 'westeurope' : 'northeurope',
                placement,
                data,
                routing,
                failure,
              } satisfies Omit<InfrastructureInput, 'target'>;
              for (const target of failureTargets(draft)) {
                const input = { ...draft, target };
                if (!validInfrastructure(input)) continue;
                checked++;
                const r = evaluateInfrastructure(input)!;
                expect(r).toEqual(evaluateInfrastructure(structuredClone(input)));
                expect(r.components.map((c) => c.id).length).toBe(
                  new Set(r.components.map((c) => c.id)).size,
                );
                for (const id of r.usable) {
                  expect(r.routed).toContain(id);
                  expect(r.apps.find((a) => a.id === id)?.state).toBe('up');
                  expect(r.data.some((d) => d.state === 'up')).toBe(true);
                }
                if (r.status === 'serving') expect(r.usable.length).toBeGreaterThan(0);
                if (failure === 'region')
                  expect(
                    r.components
                      .filter((c) => c.region === target)
                      .every((c) => c.state === 'down'),
                  ).toBe(true);
              }
            }
    expect(checked).toBeGreaterThan(1000);
  });
});
describe('Part A evidence and compatibility', () => {
  it('requires three different actual witnesses and causal reasoning, never visits or a single run', () => {
    let s = freshPhysical();
    for (const topic of physicalTopics) s = apply(s, { kind: 'visit', topic });
    expect(physicalFacts(s).guided).toBe(false);
    for (const input of [initialInfrastructure, trap, redundant]) {
      const alone = apply(apply(freshPhysical(), { kind: 'run', input, prediction: 'serving' }), {
        kind: 'explain',
        answer: 'dependencies',
      });
      expect(physicalFacts(alone).guided).toBe(false);
      s = apply(s, { kind: 'run', input, prediction: 'unavailable' });
    }
    expect(physicalFacts(s).guided).toBe(false);
    s = apply(s, { kind: 'explain', answer: 'pair' });
    expect(physicalFacts(s).guided).toBe(false);
    s = apply(s, { kind: 'explain', answer: 'dependencies' });
    expect(physicalFacts(s).guided).toBe(true);
    expect(physicalFacts(s).objective('CA01').first).toBeUndefined();
  });
  it('commits input/prediction snapshots and recomputes rather than trusting success flags', () => {
    const input = { ...initialInfrastructure };
    const s = apply(freshPhysical(), { kind: 'run', input, prediction: 'serving' });
    input.routing = 'healthy';
    expect(physicalFacts(s).runs[0]!.input.routing).toBe('primary');
    expect(restorePhysical(JSON.stringify(s)).save).toEqual(s);
    expect(restorePhysical(JSON.stringify({ ...s, complete: true })).issue).toBe('corrupt');
    expect(
      applyPhysical(s, {
        kind: 'run',
        input: initialInfrastructure,
        prediction: 'serving',
        result: 'serving',
      }),
    ).toBeNull();
    expect(applyPhysical(s, s.events.at(-1))).toBe(s);
  });
  it('keeps immutable first criteria, partial objective outcomes, help/retry and abandon distinct', () => {
    let s = apply(freshPhysical(), { kind: 'begin' });
    s = apply(s, { kind: 'draft', answers: { zoneDesign: 'apps' } });
    expect(restorePhysical(JSON.stringify(s)).save).toEqual(s);
    expect(physicalFacts(s).submissions).toHaveLength(0);
    s = apply(s, { kind: 'submit', answers: { ...answers, zoneDesign: 'apps' } });
    const first = structuredClone(physicalFacts(s).submissions[0]);
    expect(physicalFacts(s).objective('CA02').first).toBe(false);
    expect(physicalFacts(s).objective('CA01').first).toBe(true);
    s = apply(s, { kind: 'begin' });
    s = apply(s, { kind: 'aid' });
    s = apply(s, { kind: 'submit', answers });
    expect(physicalFacts(s).submissions[1]).toMatchObject({ assisted: true, retry: true });
    expect(physicalFacts(s).submissions[0]).toEqual(first);
    expect(physicalFacts(s).objective('CA02').first).toBe(false);
    let abandoned = apply(apply(freshPhysical(), { kind: 'begin' }), { kind: 'abandon' });
    abandoned = apply(apply(abandoned, { kind: 'begin' }), { kind: 'submit', answers });
    expect(physicalFacts(abandoned).objective('CA03').first).toBe(false);
  });
  it('marks relevant in-attempt study as aid and rejects incomplete or orphaned submissions', () => {
    let s = apply(freshPhysical(), { kind: 'begin' });
    expect(applyPhysical(s, { kind: 'submit', answers: { zoneDesign: 'complete' } })).toBeNull();
    expect(applyPhysical(s, { kind: 'draft', answers: { madeup: 'complete' } })).toBeNull();
    expect(applyPhysical(s, { kind: 'begin' })).toBeNull();
    s = apply(s, { kind: 'visit', topic: 'regions' });
    expect(physicalFacts(s).assisted).toBe(true);
    s = apply(s, { kind: 'submit', answers });
    expect(physicalFacts(s).objective('CA01').first).toBe(false);
    expect(applyPhysical(freshPhysical(), { kind: 'submit', answers })).toBeNull();
  });
  it('quarantines corrupt/future/other-module records and invalid replay without altering raw bytes', () => {
    for (const raw of [
      '{',
      'null',
      '[]',
      'x'.repeat(200001),
      JSON.stringify({ ...freshPhysical(), events: [{ kind: 'submit', answers }] }),
      JSON.stringify({
        ...freshPhysical(),
        events: Array(401).fill({ kind: 'visit', topic: 'summary' }),
      }),
    ])
      expect(restorePhysical(raw).issue).not.toBeNull();
    expect(restorePhysical(JSON.stringify({ ...freshPhysical(), schema: 2 })).issue).toBe(
      'unsupported',
    );
    expect(
      restorePhysical(JSON.stringify({ ...freshPhysical(), module: 'serverless' })).issue,
    ).toBe('unsupported');
    const io = storage();
    io.data.set(physicalKey, '{broken');
    const store = new PhysicalStore(io);
    store.load();
    expect(store.event({ kind: 'begin' })).toBe(false);
    expect(io.getItem(physicalKey)).toBe('{broken');
  });
  it('preserves all other stores and provides explicit isolated recovery, conflict and denied-write behavior', () => {
    const io = storage();
    for (const key of [
      'azurelab.learning.serverless.v1',
      'azurelab.learning.foundations.v1',
      'azurelab.learning.foundations.v2',
      'azurelab.learning.benefits.v1',
      'azurelab.learning.service-types.v2',
      'azurelab.sandbox.v2',
      'azurelab.progress.v1',
    ])
      io.data.set(key, 'historic exact bytes');
    const old = [...io.data];
    const a = new PhysicalStore(io),
      b = new PhysicalStore(io);
    a.load();
    b.load();
    expect(a.event({ kind: 'visit', topic: 'regions' })).toBe(true);
    expect(b.event({ kind: 'begin' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    b.load();
    expect(b.event({ kind: 'begin' })).toBe(true);
    a.clear();
    expect(io.getItem(physicalKey)).toBeNull();
    for (const [key, value] of old) expect(io.getItem(key)).toBe(value);
    const denied = new PhysicalStore({
      ...io,
      setItem: () => {
        throw Error('denied');
      },
    });
    denied.load();
    expect(denied.event({ kind: 'run', input: initialInfrastructure, prediction: 'serving' })).toBe(
      true,
    );
    expect(denied.getSnapshot().issue).toBe('unsaved');
    expect(denied.getSnapshot().save.events).toHaveLength(1);
  });
  it('reserves assistance and terminal events at capacity without stranding an assessment or blocking other courses', () => {
    let full = freshPhysical();
    for (let i = 0; i < 399; i++)
      full = apply(full, { kind: 'visit', topic: i % 2 ? 'regions' : 'zones' });
    full = apply(full, { kind: 'begin' });
    const prefix = structuredClone(full.events);
    expect(full.events).toHaveLength(400);
    const io = storage();
    io.data.set(physicalKey, JSON.stringify(full));
    const store = new PhysicalStore(io);
    store.load();
    expect(store.event({ kind: 'draft', answers: {} })).toBe(false);
    expect(store.getSnapshot().issue).toBeNull();
    expect(store.event({ kind: 'abandon' })).toBe(true);
    store.load();
    expect(physicalFacts(store.getSnapshot().save).active).toBe(false);
    expect(store.getSnapshot().issue).toBeNull();
    expect(store.event({ kind: 'begin' })).toBe(false);
    expect(store.getSnapshot().issue).toBeNull();
    expect(store.getSnapshot().save.events.slice(0, 400)).toEqual(prefix);
    // Reading a worked summary at capacity must still record assistance.
    const helped = apply(full, { kind: 'visit', topic: 'summary' });
    expect(helped.events).toHaveLength(401);
    expect(physicalFacts(helped).assisted).toBe(true);
    expect(applyPhysical(helped, { kind: 'aid' })).toBe(helped);
    const done = apply(helped, { kind: 'submit', answers });
    expect(done.events).toHaveLength(402);
    expect(restorePhysical(JSON.stringify(done)).save).toEqual(done);
    expect(physicalFacts(done).objective('CA02').first).toBe(false);
    expect(physicalFacts(done).submissions[0]!.assisted).toBe(true);
    expect(applyPhysical(done, { kind: 'begin' })).toBeNull();
    expect(done.events.slice(0, 400)).toEqual(prefix);
  });
  it('revalidates quarantined bytes at confirmation and never clears a newer valid or different record', () => {
    const io = storage();
    io.data.set(physicalKey, '{broken');
    const stale = new PhysicalStore(io);
    stale.load();
    const valid = JSON.stringify(apply(freshPhysical(), { kind: 'begin' }));
    io.data.set(physicalKey, valid);
    expect(stale.recoverInvalid()).toBe(false);
    expect(io.getItem(physicalKey)).toBe(valid);
    expect(physicalFacts(stale.getSnapshot().save).active).toBe(true);
    expect(stale.getSnapshot().issue).toBeNull();
    io.data.set(physicalKey, '{old');
    stale.load();
    io.data.set(physicalKey, '{new');
    expect(stale.recoverInvalid()).toBe(false);
    expect(io.getItem(physicalKey)).toBe('{new');
    expect(stale.recoverInvalid()).toBe(true);
    expect(io.getItem(physicalKey)).toBeNull();
    io.data.set(physicalKey, valid);
    stale.load();
    expect(stale.recoverInvalid()).toBe(false);
    expect(io.getItem(physicalKey)).toBe(valid);
  });
  it('classifies solution-bearing summary exposure as assistance before the first submission', () => {
    let save = apply(freshPhysical(), { kind: 'begin' });
    save = apply(save, { kind: 'draft', answers: { zoneDesign: 'apps' } });
    save = apply(save, { kind: 'visit', topic: 'summary' });
    expect(physicalFacts(save).assisted).toBe(true);
    expect(physicalFacts(save).draft).toEqual({ zoneDesign: 'apps' });
    save = apply(save, { kind: 'submit', answers });
    expect(physicalFacts(save).submissions[0]!.assisted).toBe(true);
    expect(physicalFacts(save).objective('CA01').first).toBe(false);
  });
  it('binds every objective, study, rationale, source and explicit activity while keeping the full module partial', () => {
    expect(physicalManifest.competency).toBe('F02');
    expect(physicalManifest.remainingObjectives).toEqual(['2.1.04', '2.1.05', '2.1.06', '2.1.07']);
    expect(officialPhysical.status).toBe('partial');
    expect(officialLearning.modules).toHaveLength(3);
    expect(physicalManifest.humanSme).toBeNull();
    expect(Object.keys(physicalActivities)).toEqual([...physicalManifest.activities]);
    expect(Object.keys(physicalSources)).toHaveLength(14);
    for (const [section, rule] of Object.entries(physicalStudy)) {
      const text = c.sections[section as keyof typeof physicalStudy];
      expect(text.paragraphs.length).toBeGreaterThan(2);
      expect(text.choices.map((x) => x[0])).toEqual([...rule.options]);
      expect(text.choices.some((x) => x[0] === rule.answer)).toBe(true);
    }
    for (const [id, rule] of Object.entries(physicalCriteria)) {
      const question = c.questions[id as keyof typeof physicalCriteria];
      expect(question.objective).toBe(rule.objective);
      expect(question.choices.map((x) => x[0]).sort()).toEqual([...rule.options].sort());
      for (const option of rule.options)
        expect((question.feedback as Record<string, string>)[option]).toBeTruthy();
    }
    const answerPositions = Object.entries(physicalCriteria).map(([id, rule]) =>
      c.questions[id as keyof typeof physicalCriteria].choices.findIndex(
        ([key]) => key === rule.answer,
      ),
    );
    expect(new Set(answerPositions).size).toBe(3);
    const old = JSON.stringify({
      ...freshCourse(),
      resume: { module: 'computing', topic: 'serverless-concept' },
    });
    expect(JSON.stringify(restoreCourse(old).save)).toBe(old);
    expect(courseHref('architecture', 'bad')).toBe('/learn/architecture?topic=datacenters');
    expect(
      restoreCourse(
        JSON.stringify({ ...freshCourse(), resume: { module: 'architecture', topic: 'explorer' } }),
      ).issue,
    ).toBeNull();
    expect(physicalFacts(freshPhysical()).submissions).toEqual([]);
  });
});
