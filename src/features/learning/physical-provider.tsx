'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { PhysicalStore } from '@/domain/curriculum/architecture-physical-store';
import { physicalKey, physicalFacts } from '@/domain/curriculum/architecture-physical';
const Context = createContext<PhysicalStore | null>(null);
export function PhysicalProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new PhysicalStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === physicalKey) store.changed();
    };
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', store.clear);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', store.clear);
    };
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function usePhysical() {
  const store = useContext(Context);
  if (!store) throw Error('PhysicalProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: physicalFacts(view.save) };
}
