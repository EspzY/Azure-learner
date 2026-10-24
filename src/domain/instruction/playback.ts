export type BeatKind =
  | 'opening'
  | 'explanation'
  | 'mechanism'
  | 'demonstration'
  | 'example'
  | 'misconception'
  | 'clarification'
  | 'reflection'
  | 'decision'
  | 'conclusion';
export type CueId =
  | 'deployment-models'
  | 'flow'
  | 'iaas'
  | 'paas'
  | 'saas'
  | 'capacity-owned'
  | 'capacity-cloud'
  | 'responsibility'
  | 'public'
  | 'private'
  | 'hybrid'
  | 'idle'
  | 'released'
  | 'usage'
  | 'commitment';
export interface TeachingBeat {
  id: string;
  kind: BeatKind;
  text: string;
  speaker: 'guide' | 'engineer';
  camera: 'two-shot' | 'speaker-close' | 'over-shoulder' | 'demonstration';
  cue?: CueId;
  wait?: 'interaction' | 'decision';
}
export interface TeachingSequence {
  id: string;
  version: '1.0.0';
  module: 'computing' | 'services' | 'technical';
  objectives: readonly string[];
  sources: readonly string[];
  beats: readonly TeachingBeat[];
}
export function readingDuration(text: string, speed: number) {
  const words = text.trim().split(/\s+/).length;
  const technical = (
    text.match(
      /Azure|IaaS|PaaS|SaaS|runtime|operativsystem|virtualisering|App Service|metadata/gi,
    ) ?? []
  ).length;
  return Math.max(
    7000,
    Math.ceil((words * 60000) / Math.max(80, Math.min(180, speed)) + technical * 350 + 2000),
  );
}
export interface Cursor {
  index: number;
  paused: boolean;
  generation: number;
  seen: number;
}
export type PlaybackAction =
  | { type: 'next' | 'previous' | 'replay' | 'skip' | 'pause' }
  | { type: 'elapsed'; generation: number };
export const initialCursor: Cursor = { index: 0, paused: false, generation: 0, seen: 0 };
// No learning imports/effects. A stale elapsed event cannot advance a later cursor.
export function playback(
  cursor: Cursor,
  action: PlaybackAction,
  sequence: TeachingSequence,
): Cursor {
  if (
    action.type === 'elapsed' &&
    (action.generation !== cursor.generation || cursor.paused || sequence.beats[cursor.index]?.wait)
  )
    return cursor;
  const index =
    action.type === 'previous'
      ? Math.max(0, cursor.index - 1)
      : action.type === 'skip'
        ? sequence.beats.length
        : action.type === 'next' || action.type === 'elapsed'
          ? Math.min(sequence.beats.length, cursor.index + 1)
          : cursor.index;
  return {
    index,
    paused: action.type === 'pause' ? !cursor.paused : cursor.paused,
    generation: cursor.generation + 1,
    seen:
      action.type === 'skip'
        ? cursor.seen
        : Math.max(cursor.seen, Math.min(index, sequence.beats.length - 1)),
  };
}
