'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { ServiceStore } from '@/domain/portal/store';
import { serviceFacts, serviceLearningKey } from '@/domain/portal/learning';
const Context = createContext<ServiceStore | null>(null);
export function PortalLearningProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new ServiceStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === serviceLearningKey || e.key === null) store.changed();
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
export function usePortalLearning() {
  const store = useContext(Context);
  if (!store) throw Error('PortalLearningProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  return { ...view, store, facts: serviceFacts(view.save) };
}
