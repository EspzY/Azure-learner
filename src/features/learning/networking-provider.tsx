'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { NetworkingStore } from '@/domain/curriculum/networking-store';
import { networkingFacts, networkingKey } from '@/domain/curriculum/networking';
const Context = createContext<NetworkingStore | null>(null);
export function NetworkingProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new NetworkingStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === networkingKey) store.changed();
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
export function useNetworking() {
  const store = useContext(Context);
  if (!store) throw Error('NetworkingProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: networkingFacts(view.save) };
}
