'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  awardProgress,
  emptyProgress,
  parseProgress,
  storageKey,
  type AwardId,
  type Progress,
} from '@/domain/progression';
import { nb } from '@/content/nb';

const ProgressContext = createContext<{
  progress: Progress;
  ready: boolean;
  storageFailed: boolean;
  award: (id: AwardId) => void;
  clear: () => void;
} | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(emptyProgress);
  const [ready, setReady] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);
  const current = useRef(emptyProgress);

  useEffect(() => {
    function read() {
      try {
        current.current = parseProgress(localStorage.getItem(storageKey));
        setProgress(current.current);
      } catch {
        setStorageFailed(true);
      }
      setReady(true);
    }
    read();
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) read();
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const save = useCallback((next: Progress) => {
    current.current = next;
    setProgress(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setStorageFailed(true);
    }
  }, []);
  const award = useCallback(
    (id: AwardId) => {
      // Re-read at action time so another open tab's completed awards are retained.
      let latest = current.current;
      try {
        latest = parseProgress(localStorage.getItem(storageKey));
      } catch {
        /* Memory fallback. */
      }
      save(
        awardProgress(
          {
            version: 1,
            completed: [...new Set([...latest.completed, ...current.current.completed])],
          },
          id,
        ),
      );
    },
    [save],
  );
  const clear = useCallback(() => save(emptyProgress), [save]);

  return (
    <ProgressContext.Provider value={{ progress, ready, storageFailed, award, clear }}>
      {storageFailed && (
        <div role="status" className="storage-warning">
          {nb.shell.storageError}
        </div>
      )}
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('ProgressProvider is required');
  return context;
}
