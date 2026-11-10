'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { sandboxKey, SandboxStore } from '@/domain/sandbox/store';
const Context = createContext<SandboxStore | null>(null);
export function SandboxProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new SandboxStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const sync = (e: StorageEvent) => {
      if (e.key === sandboxKey || e.key === null) store.changed();
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
export function useSandbox() {
  const store = useContext(Context);
  if (!store) throw Error('SandboxProvider required');
  useEffect(() => {
    store.refreshLegacyIfUncommitted();
  }, [store]);
  return {
    ...useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot),
    store,
  };
}
