export const awards = { 'organization-mission-v1': 80, 'organization-check-v1': 40 } as const;
export type AwardId = keyof typeof awards;
export interface Progress {
  version: 1;
  completed: AwardId[];
}
export const emptyProgress: Progress = { version: 1, completed: [] };
export const storageKey = 'azurelab.progress.v1';

export function awardProgress(progress: Progress, id: AwardId): Progress {
  return progress.completed.includes(id)
    ? progress
    : { version: 1, completed: [...progress.completed, id] };
}
export function totalXp(progress: Progress): number {
  return [...new Set(progress.completed)].reduce((sum, id) => sum + awards[id], 0);
}
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value !== 'object' ||
      value === null ||
      !('version' in value) ||
      value.version !== 1 ||
      !('completed' in value) ||
      !Array.isArray(value.completed)
    )
      return emptyProgress;
    const completed = value.completed.filter(
      (id): id is AwardId => typeof id === 'string' && Object.hasOwn(awards, id),
    );
    return { version: 1, completed: [...new Set(completed)] };
  } catch {
    return emptyProgress;
  }
}
