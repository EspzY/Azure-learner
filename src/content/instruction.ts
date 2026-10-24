import { nb } from './nb';
import { units, type UnitId } from '@/domain/curriculum/manifest';
import type { NodeId } from '@/domain/rpg/story';
import type { CueId, TeachingSequence, TeachingBeat } from '@/domain/instruction/playback';
const make = (
  id: string,
  module: TeachingSequence['module'],
  objectives: readonly string[],
  sources: readonly string[],
  beats: TeachingBeat[],
): TeachingSequence => ({ id, version: '1.0.0', module, objectives, sources, beats });
export const welcomeSequence = make(
  'ida-cloud-arrival',
  'computing',
  ['FC01', 'FC02'],
  ['L01', 'L02'],
  nb.teaching.introduction.map((text, i) => ({
    id: `arrival-${i}`,
    text,
    speaker: 'guide',
    kind: i === 0 ? 'opening' : i === 3 ? 'mechanism' : i === 4 ? 'misconception' : 'explanation',
    camera: i === 0 ? 'two-shot' : 'speaker-close',
    cue: i === 3 ? 'flow' : undefined,
  })),
);
export const serviceSequence = make(
  'ida-service-comparison',
  'services',
  ['F01-service-model', 'F01-retained-responsibility'],
  ['S01', 'S12', 'S39'],
  nb.teaching.service.map((text, i) => ({
    id: `service-${i}`,
    text,
    speaker: 'guide',
    kind: i === 0 ? 'opening' : i < 5 ? 'demonstration' : i === 5 ? 'clarification' : 'reflection',
    camera: i >= 1 && i <= 4 ? 'demonstration' : 'speaker-close',
    cue: ({ 1: 'iaas', 2: 'paas', 3: 'paas', 4: 'saas' } as Record<number, CueId>)[i],
  })),
);
const noorSequence = make(
  'noor-platform-requirements',
  'technical',
  ['G01', 'C02'],
  ['S03', 'S12', 'S38'],
  nb.teaching.noor.map((text, i) => ({
    id: `noor-${i}`,
    text,
    speaker: 'engineer',
    kind: i === 0 ? 'opening' : 'explanation',
    camera: i === 0 ? 'two-shot' : 'over-shoulder',
  })),
);
export function sequenceForNode(node: NodeId): TeachingSequence | null {
  if (node === 'guide-welcome') return welcomeSequence;
  if (node === 'guide-purpose')
    return make(
      'ida-operational-purpose',
      'services',
      ['F01-service-model'],
      ['S01', 'S12'],
      [
        {
          id: 'purpose-operational',
          kind: 'explanation',
          speaker: 'guide',
          text: nb.teaching.service[0],
          camera: 'over-shoulder',
        },
        {
          id: 'purpose-team',
          kind: 'example',
          speaker: 'guide',
          text: nb.rpg.dialogue['guide-purpose'],
          camera: 'over-shoulder',
        },
      ],
    );
  if (node === 'guide-detail')
    return make(
      'ida-service-caveats',
      'services',
      ['F01-retained-responsibility'],
      ['S01', 'S12', 'S39'],
      [
        {
          id: 'detail-responsibility',
          kind: 'clarification',
          speaker: 'guide',
          text: nb.teaching.service[5],
          camera: 'speaker-close',
        },
        {
          id: 'detail-hosting',
          kind: 'mechanism',
          speaker: 'guide',
          text: nb.teaching.service[3],
          camera: 'speaker-close',
        },
      ],
    );
  if (node === 'installation') return serviceSequence;
  if (node === 'engineer-offer' || node === 'engineer-brief') return noorSequence;
  const text =
    node === 'engineer-progress' || node === 'engineer-reminder'
      ? nb.teaching.unfinished
      : node === 'engineer-built'
        ? nb.teaching.built
        : node === 'engineer-reported'
          ? nb.teaching.reported
          : null;
  return text
    ? make(
        node,
        'technical',
        ['G01'],
        ['S12'],
        [
          {
            id: `${node}-explain`,
            kind: 'explanation',
            text,
            speaker: 'engineer',
            camera: 'speaker-close',
          },
        ],
      )
    : null;
}
const sections = [
  'purpose',
  'terms',
  'mechanism',
  'azure',
  'example',
  'misconception',
  'limits',
] as const;
export function unitSequence(id: UnitId): TeachingSequence {
  const definition = units.find((u) => u.id === id)!;
  const cue: Record<UnitId, Record<(typeof sections)[number], CueId>> = {
    capacity: {
      purpose: 'flow',
      terms: 'flow',
      mechanism: 'capacity-owned',
      azure: 'capacity-cloud',
      example: 'capacity-owned',
      misconception: 'flow',
      limits: 'capacity-owned',
    },
    responsibility: {
      purpose: 'responsibility',
      terms: 'responsibility',
      mechanism: 'responsibility',
      azure: 'responsibility',
      example: 'responsibility',
      misconception: 'responsibility',
      limits: 'responsibility',
    },
    models: {
      purpose: 'deployment-models',
      terms: 'deployment-models',
      mechanism: 'deployment-models',
      azure: 'deployment-models',
      example: 'deployment-models',
      misconception: 'deployment-models',
      limits: 'deployment-models',
    },
    placement: {
      purpose: 'deployment-models',
      terms: 'deployment-models',
      mechanism: 'deployment-models',
      azure: 'deployment-models',
      example: 'deployment-models',
      misconception: 'deployment-models',
      limits: 'deployment-models',
    },
    metering: {
      purpose: 'idle',
      terms: 'idle',
      mechanism: 'idle',
      azure: 'idle',
      example: 'released',
      misconception: 'idle',
      limits: 'released',
    },
    pricing: {
      purpose: 'usage',
      terms: 'commitment',
      mechanism: 'commitment',
      azure: 'usage',
      example: 'usage',
      misconception: 'commitment',
      limits: 'usage',
    },
  };
  const kinds = [
    'explanation',
    'clarification',
    'mechanism',
    'clarification',
    'example',
    'misconception',
    'clarification',
  ] as const;
  return make(
    `cloud-computing-${id}`,
    'computing',
    definition.objectives,
    definition.sources,
    sections.flatMap((key, index) => {
      // All manuscript sentences are retained, grouped at natural boundaries for readable beats.
      const manuscript =
        key === 'terms'
          ? nb.foundations.units[id].terms.map(([term, meaning]) => `${term}: ${meaning}`).join(' ')
          : nb.foundations.units[id][key];
      const sentences = manuscript.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];
      const chunks: string[] = [];
      for (const sentence of sentences) {
        const last = chunks.at(-1);
        if (last && (last + sentence).split(/\s+/).length < 65)
          chunks[chunks.length - 1] = last + sentence;
        else chunks.push(sentence.trimStart());
      }
      return chunks.map((text, part) => ({
        id: `${id}-${key}-${part}`,
        kind: kinds[index]!,
        speaker: 'guide' as const,
        text,
        camera: 'demonstration' as const,
        cue: cue[id][key],
      }));
    }),
  );
}
