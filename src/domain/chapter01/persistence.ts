import {
  chapterDefinition,
  freshAttempt,
  parseEvent,
  applyEvent,
  type Attempt,
  type Event,
} from './scenario';
export const chapterKey = 'azurelab.chapter01.guided.v1';
export interface Snapshot {
  schemaVersion: 1;
  scenarioVersion: '1.0.0';
  modelVersion: 'organization-web@1.0.0';
  storeRevision: number;
  attemptNumber: number;
  events: Event[];
}
export const snapshotOf = (
  attempt: Attempt,
  storeRevision: number,
  attemptNumber: number,
): Snapshot => ({
  schemaVersion: 1,
  scenarioVersion: chapterDefinition.version,
  modelVersion: chapterDefinition.modelVersion,
  storeRevision,
  attemptNumber,
  events: attempt.events,
});
export type Restoration =
  | { status: 'empty' | 'valid'; attempt: Attempt; snapshot: Snapshot }
  | { status: 'corrupt' | 'unsupported'; attempt: Attempt; snapshot: null };
export function restoreChapter(raw: string | null): Restoration {
  const empty = freshAttempt();
  if (raw === null) return { status: 'empty', attempt: empty, snapshot: snapshotOf(empty, 0, 1) };
  try {
    if (!raw || raw.length > 250_000) return { status: 'corrupt', attempt: empty, snapshot: null };
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value))
      return { status: 'corrupt', attempt: empty, snapshot: null };
    const data = value as Record<string, unknown>;
    if (
      data.schemaVersion !== 1 ||
      data.scenarioVersion !== chapterDefinition.version ||
      data.modelVersion !== chapterDefinition.modelVersion
    )
      return { status: 'unsupported', attempt: empty, snapshot: null };
    if (
      !Number.isSafeInteger(data.storeRevision) ||
      (data.storeRevision as number) < 0 ||
      !Number.isSafeInteger(data.attemptNumber) ||
      (data.attemptNumber as number) < 1 ||
      !Array.isArray(data.events) ||
      data.events.length > 500
    )
      return { status: 'corrupt', attempt: empty, snapshot: null };
    let attempt = empty;
    for (const rawEvent of data.events) {
      const event = parseEvent(rawEvent);
      if (!event) return { status: 'corrupt', attempt: empty, snapshot: null };
      const next = applyEvent(attempt, event);
      if (!next) return { status: 'corrupt', attempt: empty, snapshot: null };
      attempt = next;
    }
    return {
      status: 'valid',
      attempt,
      snapshot: snapshotOf(attempt, data.storeRevision as number, data.attemptNumber as number),
    };
  } catch {
    return { status: 'corrupt', attempt: empty, snapshot: null };
  }
}
