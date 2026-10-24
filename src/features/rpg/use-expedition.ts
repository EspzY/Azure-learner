'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { useGame } from './game-provider';
import { useLearning } from '@/features/learning/provider';
import { OrientationStore } from '@/domain/rpg/orientation-store';
import { useChapter } from '@/features/chapter01/provider';
import { expeditionFacts, orientationKey } from '@/domain/rpg/expedition';

export function useExpeditionFacts() {
  const game = useGame(),
    learning = useLearning(),
    chapter = useChapter();
  return {
    ...expeditionFacts(learning.save, game.save, chapter.attempt),
    ready: game.ready && learning.ready && chapter.ready,
  };
}
export function useOrientation() {
  const [store] = useState(
    () =>
      new OrientationStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  useEffect(() => {
    store.load();
    const sync = (e: StorageEvent) => {
      if (e.key === orientationKey || e.key === null) store.load();
    };
    window.addEventListener('storage', sync);
    window.addEventListener('azurelab:clear', store.clear);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('azurelab:clear', store.clear);
    };
  }, [store]);
  return { ...view, store };
}
