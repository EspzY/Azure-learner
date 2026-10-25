'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { practicalFacts, practicalKey } from '@/domain/sandbox/practical';
import { PracticalStore } from '@/domain/sandbox/practical-store';
const Context = createContext<PracticalStore | null>(null);
export function PracticalProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new PracticalStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const sync = (e: StorageEvent) => {
      if (e.key === practicalKey || e.key === null) store.changed();
    };
    window.addEventListener('storage', sync);
    window.addEventListener('azurelab:clear', store.clear);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('azurelab:clear', store.clear);
    };
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function usePractical() {
  const store = useContext(Context);
  if (!store) throw Error('PracticalProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, ...practicalFacts(view.save), store };
}
