'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { LearningStore } from '@/domain/curriculum/store';
import { learningFacts, learningKey } from '@/domain/curriculum/foundations';
import type { UnitId } from '@/domain/curriculum/manifest';
import { KnowledgeJournal } from './journal';
const Context = createContext<{
  store: LearningStore;
  openJournal: (unit?: UnitId) => void;
  journalOpen: boolean;
} | null>(null);
export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new LearningStore({
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
      }),
  );
  const [journal, setJournal] = useState<UnitId | null>(null);
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === learningKey || e.key === null) store.changed();
    };
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', store.clear);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', store.clear);
    };
  }, [store]);
  const openJournal = (unit?: UnitId) => {
    if (learningFacts(store.getSnapshot().save).active) store.event({ kind: 'aid' });
    setJournal(unit ?? store.getSnapshot().save.unit);
  };
  return (
    <Context.Provider value={{ store, openJournal, journalOpen: journal !== null }}>
      {children}
      {journal && (
        <KnowledgeJournal unit={journal} onUnit={setJournal} onClose={() => setJournal(null)} />
      )}
    </Context.Provider>
  );
}
export function useLearning() {
  const ctx = useContext(Context);
  if (!ctx) throw Error('LearningProvider required');
  const view = useSyncExternalStore(
    ctx.store.subscribe,
    ctx.store.getSnapshot,
    ctx.store.getServerSnapshot,
  );
  return { ...ctx, ...view, facts: learningFacts(view.save) };
}
