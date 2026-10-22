'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  emptyExpedition,
  expeditionKey,
  parseExpedition,
  replayCommands,
  type Expedition,
} from '@/domain/expedition';
import { nb } from '@/content/nb';

const ExpeditionContext = createContext<{
  state: Expedition;
  simulation: ReturnType<typeof replayCommands>;
  ready: boolean;
  update: (change: (state: Expedition) => Expedition) => void;
} | null>(null);

export function ExpeditionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(emptyExpedition);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const current = useRef(emptyExpedition);
  const update = useCallback((change: (state: Expedition) => Expedition) => {
    const next = change(current.current);
    current.current = next;
    setState(next);
    try {
      localStorage.setItem(expeditionKey, JSON.stringify(next));
    } catch {
      setFailed(true);
    }
  }, []);
  useEffect(() => {
    const read = () => {
      try {
        current.current = parseExpedition(localStorage.getItem(expeditionKey));
      } catch {
        setFailed(true);
      }
      setState(current.current);
      setReady(true);
    };
    const reset = () => update(() => emptyExpedition);
    const sync = (event: StorageEvent) => {
      if (event.key === expeditionKey || event.key === null) read();
    };
    read();
    window.addEventListener('storage', sync);
    window.addEventListener('azurelab:clear', reset);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('azurelab:clear', reset);
    };
  }, [update]);
  return (
    <ExpeditionContext.Provider
      value={{ state, simulation: replayCommands(state.commands), ready, update }}
    >
      {failed && (
        <div className="storage-warning" role="note">
          {nb.expedition.storageFailure}
        </div>
      )}
      {children}
    </ExpeditionContext.Provider>
  );
}
export function useExpedition() {
  const value = useContext(ExpeditionContext);
  if (!value) throw new Error('ExpeditionProvider required');
  return value;
}
