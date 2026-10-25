'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { CourseStore } from '@/domain/course/store';
import { courseKey } from '@/domain/course/model';
const Context = createContext<CourseStore | null>(null);
export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new CourseStore({
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
        removeItem: (k) => localStorage.removeItem(k),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === courseKey) store.changed();
    };
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', store.clear);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', store.clear);
    };
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useCourse() {
  const store = useContext(Context);
  if (!store) throw Error('CourseProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...view, store };
}
