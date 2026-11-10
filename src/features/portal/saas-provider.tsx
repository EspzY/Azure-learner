'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { SaasStore } from '@/domain/sandbox/saas-store';
import { saasKey } from '@/domain/sandbox/saas';
const Context = createContext<SaasStore | null>(null);
export function SaasProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new SaasStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === saasKey || e.key === null) store.changed();
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
export function useSaas() {
  const store = useContext(Context);
  if (!store) throw Error('SaasProvider required');
  return {
    ...useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot),
    store,
  };
}
