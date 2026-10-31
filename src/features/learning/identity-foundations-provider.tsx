'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { IdentityStore } from '@/domain/curriculum/identity-foundations-store';
import { identityFacts, identityKey } from '@/domain/curriculum/identity-foundations';
const Context = createContext<IdentityStore | null>(null);
export function IdentityProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new IdentityStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === identityKey) store.changed();
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
export function useIdentity() {
  const store = useContext(Context);
  if (!store) throw Error('IdentityProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: identityFacts(view.save) };
}
