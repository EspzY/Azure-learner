'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { MissionStore } from '@/domain/sandbox/mission-store';
import { missionFacts, missionKey } from '@/domain/sandbox/missions';
const Context = createContext<MissionStore | null>(null);
export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new MissionStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const sync = (e: StorageEvent) => {
      if (e.key === missionKey || e.key === null) store.changed();
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
export function useMissions() {
  const store = useContext(Context);
  if (!store) throw Error('MissionProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, ...missionFacts(view.save) };
}
