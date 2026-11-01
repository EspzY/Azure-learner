'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { AccessStore } from '@/domain/curriculum/access-control-store';
import { accessFacts, accessKey } from '@/domain/curriculum/access-control';
const Context = createContext<AccessStore | null>(null);
export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new AccessStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === accessKey) store.changed();
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
export function useAccess() {
  const store = useContext(Context);
  if (!store) throw Error('AccessProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: accessFacts(view.save) };
}
