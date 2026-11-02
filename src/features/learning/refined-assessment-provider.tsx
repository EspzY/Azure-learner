'use client';
import { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';
import { RefinedStore } from '@/domain/curriculum/refined-assessment-store';
import type { Track } from '@/domain/curriculum/expansion';
import { refinedKeys, refinedFacts } from '@/domain/curriculum/refined-assessment';
const Context = createContext<Record<Track, RefinedStore> | null>(null);
export function RefinedProvider({ children }: { children: React.ReactNode }) {
  const [stores] = useState(
    () =>
      Object.fromEntries(
        (['benefits', 'services'] as const).map((track) => [
          track,
          new RefinedStore(track, {
            getItem: (k) => localStorage.getItem(k),
            setItem: (k, v) => localStorage.setItem(k, v),
            removeItem: (k) => localStorage.removeItem(k),
          }),
        ]),
      ) as Record<Track, RefinedStore>,
  );
  useEffect(() => {
    Object.values(stores).forEach((s) => s.load());
    const changed = (e: StorageEvent) =>
      Object.values(stores).forEach((s) => {
        if (e.key === null || e.key === refinedKeys[s.track]) s.changed();
      });
    const clear = () => Object.values(stores).forEach((s) => s.load());
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', clear);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', clear);
    };
  }, [stores]);
  return <Context.Provider value={stores}>{children}</Context.Provider>;
}
export function useRefined(track: Track) {
  const stores = useContext(Context);
  if (!stores) throw Error('RefinedProvider required');
  const store = stores[track],
    view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: refinedFacts(view.save) };
}
