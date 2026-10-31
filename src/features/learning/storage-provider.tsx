'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { StorageStore } from '@/domain/curriculum/storage-store';
import { storageFacts, storageKey } from '@/domain/curriculum/storage';
const Context = createContext<StorageStore | null>(null);
export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new StorageStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === storageKey) store.changed();
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
export function useStorage() {
  const store = useContext(Context);
  if (!store) throw Error('StorageProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: storageFacts(view.save) };
}
