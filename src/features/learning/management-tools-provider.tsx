'use client';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { ToolsStore } from '@/domain/curriculum/management-tools-store';
import { toolsFacts, toolsKey, type ToolsGuide } from '@/domain/curriculum/management-tools';
import { toolsNativeEvidence } from '@/domain/curriculum/management-tools-evidence';
import { useSandbox } from '@/features/portal/sandbox-provider';
type View = ReturnType<ToolsStore['getSnapshot']>;
const Context = createContext<{
  store: ToolsStore;
  view: View;
  facts: ReturnType<typeof toolsFacts>;
  nativeEvidence: (g: ToolsGuide) => ReturnType<typeof toolsNativeEvidence>;
  technicalReady: boolean;
} | null>(null);
export function ToolsProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new ToolsStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === toolsKey) store.changed();
    };
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', store.load);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', store.load);
    };
  }, [store]);
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot),
    technical = useSandbox();
  const value = useMemo(() => {
    const ready = technical.ready && !technical.issue,
      cache = new Map<string, ReturnType<typeof toolsNativeEvidence>>();
    const nativeEvidence = (g: ToolsGuide) => {
      const key = `${g.id}|${g.boundary}|${g.through}|${g.inspected.join(';')}`;
      const old = cache.get(key);
      if (old) return old;
      const proof = toolsNativeEvidence(
        g,
        ready && g.attempt !== null
          ? g.attempt === technical.attemptNumber
            ? technical.attempt.engine
            : technical.store.engineFor(g.attempt)
          : undefined,
        g.attempt ?? 0,
      );
      cache.set(key, proof);
      return proof;
    };
    return {
      store,
      view,
      facts: toolsFacts(view.save, (g) => nativeEvidence(g).complete),
      nativeEvidence,
      technicalReady: ready,
    };
  }, [
    store,
    view,
    technical.ready,
    technical.issue,
    technical.store,
    technical.attempt.engine,
    technical.attemptNumber,
  ]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useTools() {
  const value = useContext(Context);
  if (!value) throw Error('ToolsProvider required');
  return {
    ...value.view,
    store: value.store,
    facts: value.facts,
    nativeEvidence: value.nativeEvidence,
    technicalReady: value.technicalReady,
  };
}
