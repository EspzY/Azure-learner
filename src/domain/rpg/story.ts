import type { ServiceModel } from '@/domain/expedition';
export const dialogueVersion = '1.0.0' as const;
export type QuestionId = 'service' | 'ownership';
export type AnswerId =
  'iaas' | 'paas' | 'saas' | 'code-data-access' | 'guest-os' | 'provider-everything';
export type StoryEvent =
  | { kind: 'meet'; npc: 'guide' | 'engineer' }
  | { kind: 'model'; model: ServiceModel }
  | { kind: 'answer'; question: QuestionId; answer: AnswerId }
  | { kind: 'accept' }
  | { kind: 'report' };
export interface TechnicalContext {
  guidedBuilt: boolean;
  hasWork: boolean;
}
export interface Story {
  events: StoryEvent[];
}
export function correctAnswer(question: QuestionId, answer: AnswerId) {
  return question === 'service' ? answer === 'paas' : answer === 'code-data-access';
}
export function storyFacts(story: Story, technical: TechnicalContext) {
  const answers = story.events.filter(
    (e): e is Extract<StoryEvent, { kind: 'answer' }> => e.kind === 'answer',
  );
  const models = story.events.filter(
    (e): e is Extract<StoryEvent, { kind: 'model' }> => e.kind === 'model',
  );
  const challenge = (['service', 'ownership'] as const).every((q) => {
    const answer = answers.findLast((e) => e.question === q);
    return answer && correctAnswer(q, answer.answer);
  });
  const compared = new Set(models.map((e) => e.model)).size >= 2;
  const accepted = story.events.some((e) => e.kind === 'accept');
  const ready = accepted && challenge && compared && technical.guidedBuilt;
  return {
    model: models.at(-1)?.model ?? 'iaas',
    compared,
    challenge,
    accepted,
    canEnter: accepted && challenge && compared,
    ready,
    canDebrief: technical.guidedBuilt,
    reported: technical.guidedBuilt && story.events.some((e) => e.kind === 'report'),
  };
}
export function parseStoryEvent(raw: unknown): StoryEvent | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const e = raw as Record<string, unknown>;
  const keys = Object.keys(e).sort().join(',');
  if (e.kind === 'meet' && keys === 'kind,npc' && ['guide', 'engineer'].includes(String(e.npc)))
    return { ...e } as StoryEvent;
  if (
    e.kind === 'model' &&
    keys === 'kind,model' &&
    ['iaas', 'paas', 'saas'].includes(String(e.model))
  )
    return { ...e } as StoryEvent;
  if (
    e.kind === 'answer' &&
    keys === 'answer,kind,question' &&
    (e.question === 'service'
      ? ['iaas', 'paas', 'saas']
      : e.question === 'ownership'
        ? ['code-data-access', 'guest-os', 'provider-everything']
        : []
    ).includes(String(e.answer))
  )
    return { ...e } as StoryEvent;
  if ((e.kind === 'accept' || e.kind === 'report') && keys === 'kind')
    return { ...e } as StoryEvent;
  return null;
}
export const nodeIds = [
  'guide-welcome',
  'guide-purpose',
  'guide-mechanism',
  'guide-detail',
  'guide-expert',
  'installation',
  'service-question',
  'service-iaas',
  'service-saas',
  'service-good',
  'ownership-question',
  'ownership-os',
  'ownership-all',
  'ownership-good',
  'engineer-offer',
  'engineer-brief',
  'engineer-accepted',
  'engineer-reminder',
  'engineer-progress',
  'engineer-built',
  'engineer-reported',
  'portal-locked',
  'portal-ready',
] as const;
export type NodeId = (typeof nodeIds)[number];
type Condition = 'compared' | 'canEnter' | 'ready' | 'accepted' | 'canDebrief';
export interface Choice {
  id: string;
  next?: NodeId;
  effect?: StoryEvent;
  when?: Condition;
  action?: 'close' | 'installation' | 'enter' | 'reference';
}
export interface DialogueNode {
  speaker: 'guide' | 'engineer' | 'system';
  choices: Choice[];
  sources?: readonly string[];
  detail?: boolean;
}
export const dialogue: Record<NodeId, DialogueNode> = {
  'guide-welcome': {
    speaker: 'guide',
    choices: [
      { id: 'why', next: 'guide-purpose' },
      { id: 'experienced', next: 'guide-expert' },
      { id: 'leave', action: 'close' },
    ],
  },
  'guide-purpose': {
    speaker: 'guide',
    sources: ['S01'],
    choices: [
      { id: 'mechanism', next: 'guide-mechanism' },
      { id: 'demonstrate', action: 'installation' },
    ],
  },
  'guide-mechanism': {
    speaker: 'guide',
    sources: ['S01', 'S12'],
    choices: [
      { id: 'depth', next: 'guide-detail' },
      { id: 'demonstrate', action: 'installation' },
    ],
  },
  'guide-detail': {
    speaker: 'guide',
    detail: true,
    sources: ['S01', 'S12'],
    choices: [
      { id: 'demonstrate', action: 'installation' },
      { id: 'leave', action: 'close' },
    ],
  },
  'guide-expert': {
    speaker: 'guide',
    choices: [
      { id: 'demonstrate', action: 'installation' },
      { id: 'leave', action: 'close' },
    ],
  },
  installation: {
    speaker: 'guide',
    sources: ['S01', 'S12'],
    choices: [
      { id: 'challenge', next: 'service-question', when: 'compared' },
      { id: 'depth', next: 'guide-detail' },
      { id: 'leave', action: 'close' },
    ],
  },
  'service-question': {
    speaker: 'guide',
    sources: ['S01', 'S12'],
    choices: [
      {
        id: 'iaas',
        next: 'service-iaas',
        effect: { kind: 'answer', question: 'service', answer: 'iaas' },
      },
      {
        id: 'paas',
        next: 'service-good',
        effect: { kind: 'answer', question: 'service', answer: 'paas' },
      },
      {
        id: 'saas',
        next: 'service-saas',
        effect: { kind: 'answer', question: 'service', answer: 'saas' },
      },
    ],
  },
  'service-iaas': {
    speaker: 'guide',
    choices: [
      { id: 'retry', next: 'service-question' },
      { id: 'inspect', next: 'installation' },
    ],
  },
  'service-saas': {
    speaker: 'guide',
    choices: [
      { id: 'retry', next: 'service-question' },
      { id: 'inspect', next: 'installation' },
    ],
  },
  'service-good': {
    speaker: 'guide',
    choices: [{ id: 'responsibilities', next: 'ownership-question' }],
  },
  'ownership-question': {
    speaker: 'guide',
    sources: ['S01'],
    choices: [
      {
        id: 'customer-code',
        next: 'ownership-good',
        effect: { kind: 'answer', question: 'ownership', answer: 'code-data-access' },
      },
      {
        id: 'patch-os',
        next: 'ownership-os',
        effect: { kind: 'answer', question: 'ownership', answer: 'guest-os' },
      },
      {
        id: 'all-provider',
        next: 'ownership-all',
        effect: { kind: 'answer', question: 'ownership', answer: 'provider-everything' },
      },
    ],
  },
  'ownership-os': {
    speaker: 'guide',
    choices: [
      { id: 'retry-responsibility', next: 'ownership-question' },
      { id: 'inspect', next: 'installation' },
    ],
  },
  'ownership-all': {
    speaker: 'guide',
    choices: [
      { id: 'retry-responsibility', next: 'ownership-question' },
      { id: 'inspect', next: 'installation' },
    ],
  },
  'ownership-good': { speaker: 'guide', choices: [{ id: 'meet-engineer', action: 'close' }] },
  'engineer-offer': {
    speaker: 'engineer',
    choices: [
      { id: 'requirements', next: 'engineer-brief' },
      { id: 'leave', action: 'close' },
    ],
  },
  'engineer-brief': {
    speaker: 'engineer',
    sources: ['S03', 'S12', 'S38'],
    choices: [
      { id: 'accept', next: 'engineer-accepted', effect: { kind: 'accept' } },
      { id: 'model-reason', action: 'installation' },
      { id: 'leave', action: 'close' },
    ],
  },
  'engineer-accepted': {
    speaker: 'engineer',
    choices: [
      { id: 'leave', action: 'close' },
      { id: 'inspect', action: 'installation' },
    ],
  },
  'engineer-reminder': {
    speaker: 'engineer',
    choices: [
      { id: 'requirements', next: 'engineer-brief' },
      { id: 'leave', action: 'close' },
    ],
  },
  'engineer-progress': {
    speaker: 'engineer',
    choices: [
      { id: 'requirements', next: 'engineer-brief' },
      { id: 'leave', action: 'close' },
    ],
  },
  'engineer-built': {
    speaker: 'engineer',
    sources: ['S03', 'S12', 'S38'],
    choices: [
      { id: 'report', next: 'engineer-reported', effect: { kind: 'report' }, when: 'canDebrief' },
      { id: 'leave', action: 'close' },
    ],
  },
  'engineer-reported': {
    speaker: 'engineer',
    choices: [
      { id: 'depth', action: 'reference' },
      { id: 'leave', action: 'close' },
    ],
  },
  'portal-locked': { speaker: 'system', choices: [{ id: 'leave', action: 'close' }] },
  'portal-ready': {
    speaker: 'system',
    choices: [
      { id: 'enter', action: 'enter', when: 'canEnter' },
      { id: 'leave', action: 'close' },
    ],
  },
};
export function entryNode(
  target: 'guide' | 'engineer' | 'installation' | 'portal',
  story: Story,
  technical: TechnicalContext,
): NodeId {
  const facts = storyFacts(story, technical);
  if (target === 'portal') return facts.canEnter ? 'portal-ready' : 'portal-locked';
  if (target === 'installation') return 'installation';
  if (target === 'guide')
    return story.events.some((e) => e.kind === 'meet' && e.npc === 'guide')
      ? 'guide-expert'
      : 'guide-welcome';
  if (technical.guidedBuilt) return facts.reported ? 'engineer-reported' : 'engineer-built';
  if (technical.hasWork) return 'engineer-progress';
  if (facts.accepted) return technical.hasWork ? 'engineer-progress' : 'engineer-reminder';
  return 'engineer-offer';
}
