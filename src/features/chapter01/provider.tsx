'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { chapterKey } from '@/domain/chapter01/persistence';
import { GuidedStore } from './store';

const Context = createContext<GuidedStore | null>(null);
export function ChapterProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new GuidedStore({
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
      }),
  );
  useEffect(() => {
    store.load();
    const sync = (event: StorageEvent) => {
      if (event.key === chapterKey || event.key === null) store.changed();
    };
    window.addEventListener('storage', sync);
    window.addEventListener('azurelab:clear', store.clear);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('azurelab:clear', store.clear);
    };
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useChapter() {
  const store = useContext(Context);
  if (!store) throw new Error('ChapterProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store };
}
