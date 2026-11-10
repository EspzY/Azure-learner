'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { ComputeStore } from '@/domain/curriculum/compute-store';
import { computeFacts, computeKey } from '@/domain/curriculum/compute';
const Context = createContext<ComputeStore | null>(null);
export function ComputeProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new ComputeStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === computeKey) store.changed();
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
export function useCompute() {
  const store = useContext(Context);
  if (!store) throw Error('ComputeProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: computeFacts(view.save) };
}
