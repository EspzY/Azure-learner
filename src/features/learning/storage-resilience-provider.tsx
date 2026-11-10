'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { ResilienceStore } from '@/domain/curriculum/storage-resilience-store';
import { resilienceFacts, resilienceKey } from '@/domain/curriculum/storage-resilience';
const Context = createContext<ResilienceStore | null>(null);
export function ResilienceProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new ResilienceStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === resilienceKey) store.changed();
    };
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', store.load);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', store.load);
    };
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useResilience() {
  const store = useContext(Context);
  if (!store) throw Error('ResilienceProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: resilienceFacts(view.save) };
}
