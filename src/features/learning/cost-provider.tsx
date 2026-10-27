'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { CostStore } from '@/domain/curriculum/cost-store';
import { costFacts, costKey } from '@/domain/curriculum/cost';
const Context = createContext<CostStore | null>(null);
export function CostProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new CostStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === costKey) store.changed();
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
export function useCost() {
  const store = useContext(Context);
  if (!store) throw Error('CostProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: costFacts(view.save) };
}
