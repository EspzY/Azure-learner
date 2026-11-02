'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { ApplicationStore } from '@/domain/curriculum/application-store';
import { applicationFacts, applicationKey } from '@/domain/curriculum/application-transfer';
const Context = createContext<ApplicationStore | null>(null);
export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new ApplicationStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === applicationKey) store.changed();
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
export function useApplication() {
  const store = useContext(Context);
  if (!store) throw Error('ApplicationProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: applicationFacts(view.save) };
}
