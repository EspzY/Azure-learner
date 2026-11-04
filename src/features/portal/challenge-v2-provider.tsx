'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { Challenge2Store } from '@/domain/portal/challenge-v2-store';
import { challenge2Key, challenge2Facts } from '@/domain/portal/challenge-v2';
const Context = createContext<Challenge2Store | null>(null);
export function Challenge2Provider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new Challenge2Store({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === challenge2Key) store.changed();
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
export function useChallenge2() {
  const store = useContext(Context);
  if (!store) throw Error('Challenge2Provider required');
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...state, store, facts: challenge2Facts(state.save) };
}
