'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { SecurityStore } from '@/domain/curriculum/security-store';
import { securityFacts, securityKey } from '@/domain/curriculum/security';
type View = ReturnType<SecurityStore['getSnapshot']>;
const Context = createContext<{ store: SecurityStore; view: View } | null>(null);
export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new SecurityStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === securityKey) store.changed();
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
export function useSecurity() {
  const value = useContext(Context);
  if (!value) throw Error('SecurityProvider required');
  return { ...value.view, store: value.store, facts: securityFacts(value.view.save) };
}
