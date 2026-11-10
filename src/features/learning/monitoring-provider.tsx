'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { MonitoringStore } from '@/domain/curriculum/monitoring-store';
import { monitoringFacts, monitoringKey } from '@/domain/curriculum/monitoring';
type View = ReturnType<MonitoringStore['getSnapshot']>;
const Context = createContext<{ store: MonitoringStore; view: View } | null>(null);
export function MonitoringProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new MonitoringStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === monitoringKey) store.changed();
    };
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', store.load);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', store.load);
    };
  }, [store]);
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return <Context.Provider value={{ store, view }}>{children}</Context.Provider>;
}
export function useMonitoring() {
  const value = useContext(Context);
  if (!value) throw Error('MonitoringProvider required');
  return { ...value.view, store: value.store, facts: monitoringFacts(value.view.save) };
}
