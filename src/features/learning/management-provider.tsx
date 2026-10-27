'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { ManagementStore } from '@/domain/curriculum/architecture-management-store';
import { managementKey, managementFacts } from '@/domain/curriculum/architecture-management';
const Context = createContext<ManagementStore | null>(null);
export function ManagementProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new ManagementStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === managementKey) store.changed();
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
export function useManagement() {
  const store = useContext(Context);
  if (!store) throw Error('ManagementProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: managementFacts(view.save) };
}
