'use client';
import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react';
type Visibility = [boolean, Dispatch<SetStateAction<boolean>>];
const Context = createContext<Visibility | null>(null);
/** Presentation only, scoped to one Portal mount. Never stores or ends a learning session. */
export function PortalGuideVisibility({ children }: { children: React.ReactNode }) {
  return <Context.Provider value={useState(false)}>{children}</Context.Provider>;
}
export function usePortalGuideVisibility(): Visibility {
  const local = useState(false);
  return useContext(Context) ?? local;
}
