export const milestonePreferenceKey = 'azurelab.guidance.milestones.v1';
export interface MilestonePreferences {
  schema: 1;
  seen: string[];
}
export const emptyMilestonePreferences = (): MilestonePreferences => ({ schema: 1, seen: [] });
const validKey = (key: unknown): key is string =>
  typeof key === 'string' && /^[\w@.:/-]{1,400}$/.test(key);
export function parseMilestonePreferences(raw: string | null): MilestonePreferences | null {
  if (raw === null) return emptyMilestonePreferences();
  try {
    if (raw.length > 110000) return null;
    const v = JSON.parse(raw);
    return v &&
      v.schema === 1 &&
      Object.keys(v).sort().join() === 'schema,seen' &&
      Array.isArray(v.seen) &&
      v.seen.length <= 256 &&
      v.seen.every(validKey) &&
      new Set(v.seen).size === v.seen.length
      ? v
      : null;
  } catch {
    return null;
  }
}
/** Persist BEFORE interruption. Fail closed when writes/history are unavailable or full. */
export function claimMilestone(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  key: string,
): 'claimed' | 'seen' | 'unavailable' {
  if (!validKey(key)) return 'unavailable';
  try {
    const saved = parseMilestonePreferences(storage.getItem(milestonePreferenceKey));
    if (!saved) return 'unavailable';
    if (saved.seen.includes(key)) return 'seen';
    if (saved.seen.length >= 256) return 'unavailable';
    storage.setItem(
      milestonePreferenceKey,
      JSON.stringify({ schema: 1, seen: [...saved.seen, key] }),
    );
    return 'claimed';
  } catch {
    return 'unavailable';
  }
}
