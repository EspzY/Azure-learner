'use client';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { GovernanceStore } from '@/domain/curriculum/governance-store';
import {
  governanceFacts,
  governanceKey,
  type GovernanceGuide,
} from '@/domain/curriculum/governance';
import { governancePolicyEvidence } from '@/domain/curriculum/governance-evidence';
import { useSandbox } from '@/features/portal/sandbox-provider';
type View = ReturnType<GovernanceStore['getSnapshot']>;
const Context = createContext<{
  store: GovernanceStore;
  view: View;
  facts: ReturnType<typeof governanceFacts>;
  policyEvidence: (g: GovernanceGuide) => ReturnType<typeof governancePolicyEvidence>;
  technicalReady: boolean;
} | null>(null);
export function GovernanceProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new GovernanceStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === governanceKey) store.changed();
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
      cache = new Map<string, ReturnType<typeof governancePolicyEvidence>>();
    const policyEvidence = (g: GovernanceGuide) => {
      const key = `${g.id}|${g.boundary}|${g.through}|${g.inspected.join(';')}`;
      const old = cache.get(key);
      if (old) return old;
      const proof = governancePolicyEvidence(
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
      facts: governanceFacts(view.save, (g) => policyEvidence(g).complete),
      policyEvidence,
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
export function useGovernance() {
  const value = useContext(Context);
  if (!value) throw Error('GovernanceProvider required');
  return {
    ...value.view,
    store: value.store,
    facts: value.facts,
    policyEvidence: value.policyEvidence,
    technicalReady: value.technicalReady,
  };
}
