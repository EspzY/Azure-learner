import { dialogueVersion, parseStoryEvent, type StoryEvent } from './story';
import { spawn, validPose, type Pose } from './world';
export const rpgKey = 'azurelab.rpg.g1.v1';
export interface GameSave {
  schema: 1;
  contentVersion: typeof dialogueVersion;
  pose: Pose;
  events: StoryEvent[];
  returnPending: boolean;
  quality: 'auto' | 'low' | 'high';
}
export const freshGame = (): GameSave => ({
  schema: 1,
  contentVersion: dialogueVersion,
  pose: { ...spawn },
  events: [],
  returnPending: false,
  quality: 'auto',
});
export function restoreGame(raw: string | null): {
  save: GameSave;
  issue: 'corrupt' | 'unsupported' | null;
} {
  if (raw === null) return { save: freshGame(), issue: null };
  try {
    if (raw.length > 64000) throw new Error('size');
    const o = JSON.parse(raw);
    if (o?.schema !== 1 || o.contentVersion !== dialogueVersion)
      return { save: freshGame(), issue: 'unsupported' };
    if (
      !validPose(o.pose) ||
      !Array.isArray(o.events) ||
      o.events.length > 200 ||
      typeof o.returnPending !== 'boolean' ||
      !['auto', 'low', 'high'].includes(o.quality)
    )
      throw new Error('schema');
    const events = o.events.map(parseStoryEvent);
    if (events.some((e: StoryEvent | null) => !e)) throw new Error('event');
    return {
      save: {
        schema: 1,
        contentVersion: '1.0.0',
        pose: { ...o.pose },
        events,
        returnPending: o.returnPending,
        quality: o.quality,
      },
      issue: null,
    };
  } catch {
    return { save: freshGame(), issue: 'corrupt' };
  }
}
