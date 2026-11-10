'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { ConnectivityStore } from '@/domain/curriculum/connectivity-store';
import { connectivityFacts, connectivityKey } from '@/domain/curriculum/connectivity';
const Context = createContext<ConnectivityStore | null>(null);
export function ConnectivityProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new ConnectivityStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === connectivityKey) store.changed();
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
export function useConnectivity() {
  const store = useContext(Context);
  if (!store) throw Error('ConnectivityProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: connectivityFacts(view.save) };
}
