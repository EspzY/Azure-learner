import { refinedAssessmentNb as c } from '@/content/nb';
import type { Track } from './expansion';
export const refinedKeys = {
  benefits: 'azurelab.learning.benefits-assessment.v2',
  services: 'azurelab.learning.service-types-assessment.v3',
} as const;
export const refinedVersion = (track: Track) => (track === 'benefits' ? '2.0.0' : '3.0.0');
export const refinedHref = (track: Track, legacy = false) =>
  `/learn/${track}?topic=assessment${track === 'services' ? '&version=2' : ''}&assessment=${legacy ? 'legacy' : 'updated'}`;
export const refinedItems = (track: Track) => c.items[track];
export type RefinedItem = ReturnType<typeof refinedItems>[number];
export type ItemAnswer = { decision?: string; reason?: string; number?: string };
export type RefinedAnswers = Record<string, ItemAnswer>;
export type RefinedEvent =
  | { kind: 'begin' | 'aid' | 'submit' | 'abandon' }
  | { kind: 'answer'; item: string; field: keyof ItemAnswer; value: string };
export type RefinedSave = {
  schema: 1;
  track: Track;
  content: string;
  rubric: string;
  presentation: string;
  events: RefinedEvent[];
};
export const refinedLimit = 800;
export const freshRefined = (track: Track): RefinedSave => ({
  schema: 1,
  track,
  content: refinedVersion(track),
  rubric: refinedVersion(track),
  presentation: refinedVersion(track),
  events: [],
});
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v: object, keys: string[]) =>
  Object.keys(v).sort().join(',') === [...keys].sort().join(',');
export function gradeRefined(track: Track, answers: RefinedAnswers) {
  return refinedItems(track).map((item) => {
    const answer = answers[item.id] ?? {};
    const rule = c.feedback[item.id];
    const pair = rule.pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
    return {
      id: item.id,
      correct:
        pair &&
        (item.id !== 'b-capacity' ||
          (/^\d{1,3}$/.test(answer.number ?? '') && Number(answer.number) === 5)),
    };
  });
}
export function completeRefined(track: Track, answers: RefinedAnswers) {
  return refinedItems(track).every((i) => {
    const a = answers[i.id];
    return a?.decision && a?.reason && (i.id !== 'b-capacity' || /^\d{1,3}$/.test(a.number ?? ''));
  });
}
export interface RefinedAttempt {
  number: number;
  status: 'active' | 'submitted' | 'abandoned';
  assisted: boolean;
  retry: boolean;
  answers: RefinedAnswers;
  result: ReturnType<typeof gradeRefined> | null;
}
export function refinedFacts(save: RefinedSave) {
  const attempts: RefinedAttempt[] = [];
  for (const e of save.events) {
    if (e.kind === 'begin')
      attempts.push({
        number: attempts.length + 1,
        status: 'active',
        assisted: false,
        retry: attempts.length > 0,
        answers: {},
        result: null,
      });
    else {
      const a = attempts.at(-1)!;
      if (e.kind === 'answer')
        a.answers = { ...a.answers, [e.item]: { ...a.answers[e.item], [e.field]: e.value } };
      if (e.kind === 'aid') a.assisted = true;
      if (e.kind === 'abandon') a.status = 'abandoned';
      if (e.kind === 'submit') {
        a.status = 'submitted';
        a.result = gradeRefined(save.track, a.answers);
      }
    }
  }
  const current = attempts.at(-1) ?? null;
  return {
    attempts,
    current,
    active: current?.status === 'active',
    assisted: current?.assisted ?? false,
    submissions: attempts.filter((a) => a.status === 'submitted'),
    first: attempts.find((a) => a.status === 'submitted') ?? null,
  };
}
export function applyRefined(save: RefinedSave, raw: unknown): RefinedSave | null {
  if (!object(raw) || save.events.length >= refinedLimit) return null;
  const f = refinedFacts(save);
  let event: RefinedEvent;
  if (raw.kind === 'answer') {
    if (
      !exact(raw, ['kind', 'item', 'field', 'value']) ||
      !f.active ||
      typeof raw.value !== 'string'
    )
      return null;
    const item = refinedItems(save.track).find((i) => i.id === raw.item);
    if (
      !item ||
      typeof raw.field !== 'string' ||
      !['decision', 'reason', 'number'].includes(raw.field)
    )
      return null;
    if (raw.field === 'number') {
      if (item.id !== 'b-capacity' || !/^\d{0,3}$/.test(raw.value)) return null;
    } else {
      const options = raw.field === 'decision' ? item.decisions : item.reasons;
      if (raw.value !== '' && !options.some((o) => o.id === raw.value)) return null;
    }
    if (save.events.length >= refinedLimit - 3) return null;
    event = raw as RefinedEvent;
  } else {
    if (!exact(raw, ['kind']) || !['begin', 'aid', 'submit', 'abandon'].includes(String(raw.kind)))
      return null;
    event = raw as RefinedEvent;
    if (event.kind === 'begin') {
      if (f.active || save.events.length >= refinedLimit - 3) return null;
    } else if (!f.active) return null;
    if (event.kind === 'aid' && f.assisted) return save;
    if (event.kind === 'submit' && !completeRefined(save.track, f.current!.answers)) return null;
  }
  return { ...save, events: [...save.events, event] };
}
export function restoreRefined(
  track: Track,
  raw: string | null,
): { save: RefinedSave; issue: 'corrupt' | 'unsupported' | null } {
  const bad = (issue: 'corrupt' | 'unsupported') => ({ save: freshRefined(track), issue });
  if (raw === null) return { save: freshRefined(track), issue: null };
  if (raw.length > 220000) return bad('corrupt');
  try {
    const v: unknown = JSON.parse(raw);
    if (!object(v) || !exact(v, ['schema', 'track', 'content', 'rubric', 'presentation', 'events']))
      return bad('corrupt');
    if (
      v.schema !== 1 ||
      v.track !== track ||
      v.content !== refinedVersion(track) ||
      v.rubric !== refinedVersion(track) ||
      v.presentation !== refinedVersion(track)
    )
      return bad('unsupported');
    if (!Array.isArray(v.events) || v.events.length > refinedLimit) return bad('corrupt');
    let save = freshRefined(track);
    for (const e of v.events) {
      const next = applyRefined(save, e);
      if (!next || next === save) return bad('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return bad('corrupt');
  }
}
