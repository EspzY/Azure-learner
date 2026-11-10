'use client';
import { createContext, useContext, type ReactNode } from 'react';
import { requestLaboratoryAnalysis } from './ephemeral-client';
import { courseAnalysis } from './course-client';
export type PortalWorkspaceMode = 'free' | 'course-technical';
const free = { base: '/labs/laboratory', analysis: requestLaboratoryAnalysis };
const course = { base: '/labs/course-workspace', analysis: courseAnalysis };
const Navigation = createContext(free);
/** Presentation/transport scope only; no learning provider or alternative World. */
export function PortalWorkspaceContext({
  mode,
  children,
}: {
  mode: PortalWorkspaceMode;
  children: ReactNode;
}) {
  return (
    <Navigation.Provider value={mode === 'course-technical' ? course : free}>
      {children}
    </Navigation.Provider>
  );
}
export function useWorkspaceNavigation() {
  const value = useContext(Navigation);
  return {
    ...value,
    href: (view: string, id?: string) =>
      value.base + '?' + new URLSearchParams({ view, ...(id ? { id } : {}) }),
  };
}
