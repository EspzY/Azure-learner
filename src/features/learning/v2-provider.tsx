'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { FoundationsV2Store } from '@/domain/curriculum/v2-store';
import { foundationsV2Key, v2Facts } from '@/domain/curriculum/foundations-v2';
const Context = createContext<FoundationsV2Store | null>(null);
export function FoundationsV2Provider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new FoundationsV2Store({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === foundationsV2Key) store.changed();
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
export function useFoundationsV2() {
  const store = useContext(Context);
  if (!store) throw Error('FoundationsV2Provider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: v2Facts(view.save) };
}
