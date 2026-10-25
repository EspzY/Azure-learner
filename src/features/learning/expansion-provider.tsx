'use client';
import { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ExpansionStore } from '@/domain/curriculum/expansion-store';
import { expansionKeys, facts, type Track } from '@/domain/curriculum/expansion';
const Context = createContext<Record<Track, ExpansionStore> | null>(null);
export function ExpansionProvider({ children }: { children: React.ReactNode }) {
  const [stores] = useState(
    () =>
      Object.fromEntries(
        (['benefits', 'services'] as const).map((track) => [
          track,
          new ExpansionStore(track, {
            getItem: (k) => localStorage.getItem(k),
            setItem: (k, v) => localStorage.setItem(k, v),
            removeItem: (k) => localStorage.removeItem(k),
          }),
        ]),
      ) as Record<Track, ExpansionStore>,
  );
  useEffect(() => {
    Object.values(stores).forEach((s) => s.load());
    const changed = (e: StorageEvent) =>
      Object.values(stores).forEach((s) => {
        if (e.key === null || e.key === expansionKeys[s.track]) s.changed();
      });
    const clear = () => Object.values(stores).forEach((s) => s.clear());
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', clear);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', clear);
    };
  }, [stores]);
  return <Context.Provider value={stores}>{children}</Context.Provider>;
}
export function useExpansion(track: Track, technicalReady = false) {
  const stores = useContext(Context);
  if (!stores) throw Error('ExpansionProvider required');
  const store = stores[track],
    view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: facts(view.save, technicalReady) };
}
/** Mounted inside the existing page Suspense: no route/provider duplication. */
export function ExpansionAssistance() {
  const path = usePathname(),
    query = useSearchParams(),
    benefits = useExpansion('benefits'),
    services = useExpansion('services');
  useEffect(() => {
    for (const module of [benefits, services]) {
      const own =
        path === `/learn/${module.store.track}` &&
        query.get('topic') === 'assessment' &&
        query.get('version') !== '1';
      const metadata = path === '/learn';
      const operational =
        path === '/portal' &&
        !query.get('lab') &&
        !['learn', 'responsibility', 'hierarchy'].includes(query.get('area') ?? 'home');
      if (module.facts.active && !own && !metadata && !operational)
        module.store.event({ kind: 'aid' });
    }
  }, [path, query, benefits, services]);
  return null;
}
