import { describe, expect, it } from 'vitest';
import { nb } from '@/content/nb';
import {
  serviceSequence,
  sequenceForNode,
  unitSequence,
  welcomeSequence,
} from '@/content/instruction';
import { initialCursor, playback, readingDuration, type TeachingSequence } from './playback';
import { defaultPresentation, parsePresentation } from './preferences';
import { cueRegistry } from './cues';
import { unitIds } from '@/domain/curriculum/manifest';
import { officialLearning } from '@/domain/curriculum/official';
import { objectiveIds, sources } from '@/domain/curriculum/manifest';
import { experiment } from '@/domain/curriculum/foundations';
import { responsibility } from '@/domain/expedition';
describe('bounded teaching presentation', () => {
  it('binds versioned sequences to registered source/objective/cue identities', () => {
    const knownSources = new Set([...Object.keys(sources), 'S01', 'S03', 'S12', 'S38', 'S39']);
    const knownObjectives = new Set<string>([
      ...objectiveIds,
      'F01-service-model',
      'F01-retained-responsibility',
      'G01',
      'C02',
    ]);
    for (const sequence of [
      welcomeSequence,
      serviceSequence,
      sequenceForNode('engineer-offer')!,
      ...unitIds.map(unitSequence),
    ]) {
      expect(sequence.version).toBe('1.0.0');
      expect(sequence.sources.length).toBeGreaterThan(0);
      sequence.sources.forEach((id) => expect(knownSources.has(id)).toBe(true));
      sequence.objectives.forEach((id) => expect(knownObjectives.has(id)).toBe(true));
      sequence.beats.forEach((beat) => {
        expect(beat.text.trim()).not.toBe('');
        if (beat.cue) expect(cueRegistry[beat.cue]?.version).toBe(1);
      });
    }
  });
  it('retains every essential L1 manuscript sentence instead of replacing depth with short speech', () => {
    for (const id of unitIds) {
      const sequence = unitSequence(id);
      const normalized = (text: string) => text.replace(/\s+/g, '').trim();
      const expected = [
        'purpose',
        'terms',
        'mechanism',
        'azure',
        'example',
        'misconception',
        'limits',
      ]
        .map((k) =>
          k === 'terms'
            ? nb.foundations.units[id].terms
                .map(([term, meaning]) => `${term}: ${meaning}`)
                .join(' ')
            : nb.foundations.units[id][k as 'purpose'],
        )
        .join('');
      expect(normalized(sequence.beats.map((b) => b.text).join(''))).toBe(normalized(expected));
      expect(sequence.beats.length).toBeGreaterThanOrEqual(6);
      expect(sequence.objectives.length).toBeGreaterThan(0);
      expect(new Set(sequence.beats.map((b) => b.id)).size).toBe(sequence.beats.length);
      for (const beat of sequence.beats) expect(beat.cue && cueRegistry[beat.cue]).toBeTruthy();
    }
  });
  it('registers only reviewed local cues with actual model consequences and counterexamples', () => {
    expect(serviceSequence.beats.filter((b) => b.cue).map((b) => b.cue)).toEqual([
      'iaas',
      'paas',
      'paas',
      'saas',
    ]);
    expect(responsibility('iaas', 'os')).toBe('customer');
    expect(responsibility('paas', 'os')).toBe('microsoft');
    for (const m of ['iaas', 'paas', 'saas'] as const)
      expect(responsibility(m, 'data')).toBe('customer');
    const a = experiment(cueRegistry['capacity-owned'].input!),
      b = experiment(cueRegistry['capacity-cloud'].input!);
    expect(a.shortfall).toBe(4);
    expect(b.shortfall).toBe(0);
    expect(experiment(cueRegistry.idle.input!).cost).toBeGreaterThan(0);
    expect(experiment(cueRegistry.released.input!).cost).toBe(0);
    expect(experiment({ ...cueRegistry.usage.input!, mode: 'owned' }).cost).toBeLessThan(
      experiment(cueRegistry.usage.input!).cost,
    );
  });
  it('uses reading time and technical terms rather than one short timer', () => {
    expect(readingDuration('Hei.', 130)).toBe(7000);
    expect(readingDuration(nb.teaching.service[2], 80)).toBeGreaterThan(
      readingDuration(nb.teaching.service[2], 180),
    );
    expect(readingDuration(nb.teaching.service[2], 130)).toBeGreaterThan(20000);
  });
  it('cancels stale cursor tokens and never auto-resolves a decision', () => {
    const first = playback(initialCursor, { type: 'next' }, welcomeSequence);
    expect(playback(first, { type: 'elapsed', generation: 0 }, welcomeSequence)).toBe(first);
    const paused = playback(first, { type: 'pause' }, welcomeSequence);
    expect(
      playback(paused, { type: 'elapsed', generation: paused.generation }, welcomeSequence),
    ).toBe(paused);
    const decision: TeachingSequence = {
      ...welcomeSequence,
      beats: [{ ...welcomeSequence.beats[0]!, wait: 'decision' }],
    };
    expect(playback(initialCursor, { type: 'elapsed', generation: 0 }, decision)).toBe(
      initialCursor,
    );
    const skipped = playback(first, { type: 'skip' }, welcomeSequence);
    expect(skipped.index).toBe(welcomeSequence.beats.length);
    expect(skipped.seen).toBe(first.seen);
    expect(playback(skipped, { type: 'previous' }, welcomeSequence).index).toBe(
      welcomeSequence.beats.length - 1,
    );
    expect(Object.keys(skipped).sort()).toEqual(['generation', 'index', 'paused', 'seen']);
  });
  it('keeps explicit assessments and quest decisions outside instructional playback', () => {
    expect(sequenceForNode('guide-expert')).toBeNull();
    expect(sequenceForNode('guide-mechanism')).toBeNull();
    expect(sequenceForNode('guide-purpose')?.beats).toHaveLength(2);
    expect(sequenceForNode('service-question')).toBeNull();
    expect(sequenceForNode('ownership-question')).toBeNull();
    expect(sequenceForNode('portal-ready')).toBeNull();
    expect(sequenceForNode('engineer-offer')?.beats.at(-1)?.text).toContain('Vil du ta oppdraget');
  });
  it('pins official metadata, distinct local investigations and honest implementation states', () => {
    expect(officialLearning.reviewed).toBe('2026-10-24');
    expect(officialLearning.modules.map((m) => m.status)).toEqual([
      'implemented',
      'planned',
      'implemented',
    ]);
    expect(nb.official.officialUnits).toHaveLength(8);
    expect(officialLearning.unitMapping.pricing).toEqual([5]);
    expect(nb.official.certification).toBe('Microsoft Certified: Azure Fundamentals');
    expect(nb.official.path).toBe('Introduction to Cloud Infrastructure: Describe cloud concepts');
    expect(nb.official.boundary).toContain('ikke Microsoft Learn-fullføring');
  });
  it('validates presentation-only preferences without trusting stored success or unknown schema', () => {
    expect(parsePresentation(null)).toEqual(defaultPresentation);
    expect(
      parsePresentation(JSON.stringify({ ...defaultPresentation, manual: true, speed: 80 })),
    ).toMatchObject({ manual: true, speed: 80 });
    for (const raw of [
      '{',
      '[]',
      'x'.repeat(501),
      JSON.stringify({ ...defaultPresentation, schema: 2 }),
      JSON.stringify({ ...defaultPresentation, completed: true }),
      JSON.stringify({ ...defaultPresentation, music: 9 }),
      JSON.stringify({ ...defaultPresentation, speed: 1 }),
    ])
      expect(parsePresentation(raw)).toBeNull();
  });
});
