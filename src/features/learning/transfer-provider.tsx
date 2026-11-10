'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { TransferStore } from '@/domain/curriculum/transfer-store';
import { transferFacts, transferKey } from '@/domain/curriculum/transfer';
const Context = createContext<TransferStore | null>(null);
export function TransferProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new TransferStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === transferKey) store.changed();
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
export function useTransfer() {
  const store = useContext(Context);
  if (!store) throw Error('TransferProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store, facts: transferFacts(view.save) };
}
