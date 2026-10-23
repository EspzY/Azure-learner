import { expect, it } from 'vitest';
import { chapterKey, restoreChapter } from '@/domain/chapter01/persistence';
import { currentStage } from '@/domain/chapter01/scenario';
import { GuidedStore } from './store';

function fixture() {
  const data = new Map<string, string>([
    [
      'azurelab.progress.v1',
      '{"version":1,"completed":["organization-mission-v1","organization-check-v1"]}',
    ],
    ['azurelab.expedition.v1', 'untouched-expedition'],
  ]);
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
  return { data, storage };
}
const event = {
  kind: 'command',
  request: {
    commandId: 'create-group',
    expectedWorldRevision: 0,
    command: {
      type: 'CreateGroup',
      name: 'rg-app',
      metadataRegion: 'norwayeast',
      subscriptionId: 'sub-app',
    },
  },
  bindResult: true,
};
it('saves/replays guided work while preserving both legacy stores and awards', () => {
  const { data, storage } = fixture();
  const before = [...data.entries()];
  const store = new GuidedStore(storage);
  store.load();
  expect(store.dispatch(event)).toBe(true);
  const resumed = new GuidedStore(storage);
  resumed.load();
  expect(resumed.getSnapshot().attempt.engine.world.groups).toHaveLength(1);
  expect(resumed.getSnapshot().attempt).toEqual(store.getSnapshot().attempt);
  for (const [key, value] of before) expect(data.get(key)).toBe(value);
  store.restart();
  expect(store.getSnapshot().attemptNumber).toBe(2);
  expect(store.getSnapshot().attempt.engine.world.groups).toEqual([]);
  for (const [key, value] of before) expect(data.get(key)).toBe(value);
});
it('detects a stale tab before mutating or overwriting; export/reload is explicit', () => {
  const { data, storage } = fixture();
  const a = new GuidedStore(storage);
  const b = new GuidedStore(storage);
  a.load();
  b.load();
  a.dispatch(event);
  const saved = data.get(chapterKey);
  expect(b.dispatch(event)).toBe(false);
  expect(b.getSnapshot().issue).toBe('conflict');
  expect(b.getSnapshot().attempt.engine.world.groups).toEqual([]);
  expect(data.get(chapterKey)).toBe(saved);
  expect(restoreChapter(b.exportSnapshot()).status).toBe('valid');
  expect(b.restart()).toBe(false);
  b.load();
  expect(b.getSnapshot().attempt.engine.world.groups).toHaveLength(1);
});
it('handles denied reads/writes in memory and clears only chapter data explicitly', () => {
  const store = new GuidedStore({
    getItem: () => {
      throw new Error('blocked');
    },
    setItem: () => {
      throw new Error('blocked');
    },
    removeItem: () => {
      throw new Error('blocked');
    },
  });
  store.load();
  expect(store.getSnapshot().issue).toBe('unsaved');
  expect(store.dispatch(event)).toBe(true);
  expect(store.getSnapshot().attempt.engine.world.groups).toHaveLength(1);
  expect(store.getSnapshot().issue).toBe('unsaved');
  store.clear();
  expect(currentStage(store.getSnapshot().attempt)).toBe('responsibility');
  const { data, storage } = fixture();
  const working = new GuidedStore(storage);
  working.load();
  working.dispatch(event);
  working.clear();
  expect(data.has(chapterKey)).toBe(false);
  expect(data.get('azurelab.expedition.v1')).toBe('untouched-expedition');
});
it('quarantines corruption/unknown versions until explicit compatible restart', () => {
  for (const raw of ['{broken', '{"schemaVersion":99}']) {
    const { data, storage } = fixture();
    data.set(chapterKey, raw);
    const store = new GuidedStore(storage);
    store.load();
    expect(store.dispatch(event)).toBe(false);
    expect(data.get(chapterKey)).toBe(raw);
    expect(currentStage(store.getSnapshot().attempt)).toBe('responsibility');
    expect(store.restart()).toBe(true);
    expect(restoreChapter(data.get(chapterKey)!).status).toBe('valid');
  }
});
it('keeps a failed storage write in memory without claiming that a reload will restore it', () => {
  const { data, storage } = fixture();
  const store = new GuidedStore({
    ...storage,
    setItem: () => {
      throw new Error('quota');
    },
  });
  store.load();
  expect(store.getSnapshot().issue).toBeNull();
  expect(store.dispatch(event)).toBe(true);
  expect(store.getSnapshot().issue).toBe('unsaved');
  expect(store.getSnapshot().attempt.engine.world.groups).toHaveLength(1);
  expect(data.has(chapterKey)).toBe(false);
  expect(restoreChapter(store.exportSnapshot()).attempt.engine.world.groups).toHaveLength(1);
  const reloaded = new GuidedStore(storage);
  reloaded.load();
  expect(reloaded.getSnapshot().attempt.engine.world.groups).toEqual([]);
});
