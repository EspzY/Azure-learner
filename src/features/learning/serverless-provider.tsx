'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { ServerlessStore } from '@/domain/curriculum/serverless-store';
import { serverlessKey, serverlessFacts } from '@/domain/curriculum/serverless';
const Context = createContext<ServerlessStore | null>(null);
export function ServerlessProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new ServerlessStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === serverlessKey) store.changed();
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
export function useServerless() {
  const store = useContext(Context);
  if (!store) throw Error('ServerlessProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: serverlessFacts(view.save) };
}
