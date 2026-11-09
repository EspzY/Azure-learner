'use client';

import { createContext, useContext, useEffect, useState, useId } from 'react';
import { visualThemeKey } from './theme-init';
import { themeCopy } from './theme-copy';

export type VisualThemePreference = 'light' | 'dark' | 'system';
type VisualThemeState = {
  preference: VisualThemePreference;
  unavailable: boolean;
  choose: (value: VisualThemePreference) => void;
};
const ThemeContext = createContext<VisualThemeState | null>(null);
export function parseVisualTheme(value: unknown): VisualThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system';
}
function applyTheme(preference: VisualThemePreference) {
  document.documentElement.dataset.bfTheme =
    preference === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : preference;
}

export function BifrostThemeProvider({ children }: { children: React.ReactNode }) {
  // Identical server/first-client markup. The head loader owns first paint.
  const [preference, setPreference] = useState<VisualThemePreference>('system');
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const read = () => {
      let value: VisualThemePreference = 'system';
      let failed = false;
      try {
        value = parseVisualTheme(localStorage.getItem(visualThemeKey));
      } catch {
        failed = true;
      }
      setPreference(value);
      setUnavailable(failed);
      applyTheme(value);
    };
    queueMicrotask(read);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const systemChanged = () => {
      // The current in-memory preference also works when storage is denied.
      setPreference((current) => {
        if (current === 'system') applyTheme(current);
        return current;
      });
    };
    const storageChanged = (event: StorageEvent) => {
      if (event.key === visualThemeKey || event.key === null) read();
    };
    media.addEventListener('change', systemChanged);
    window.addEventListener('storage', storageChanged);
    return () => {
      media.removeEventListener('change', systemChanged);
      window.removeEventListener('storage', storageChanged);
    };
  }, []);
  const choose = (value: VisualThemePreference) => {
    setPreference(value);
    applyTheme(value);
    try {
      localStorage.setItem(visualThemeKey, value);
      setUnavailable(localStorage.getItem(visualThemeKey) !== value);
    } catch {
      setUnavailable(true);
    }
  };
  return (
    <ThemeContext.Provider value={{ preference, unavailable, choose }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useContext(ThemeContext);
  const id = useId();
  if (!theme) throw new Error('ThemeToggle requires BifrostThemeProvider');
  return (
    <div className={`bifrost-theme-control ${className}`}>
      <label htmlFor={id}>{themeCopy.label}</label>
      <select
        id={id}
        value={theme.preference}
        onChange={(event) => theme.choose(parseVisualTheme(event.target.value))}
        aria-describedby={theme.unavailable ? `${id}-storage` : undefined}
      >
        <option value="system">{themeCopy.system}</option>
        <option value="light">{themeCopy.light}</option>
        <option value="dark">{themeCopy.dark}</option>
      </select>
      <span className="bifrost-theme-storage-note" id={`${id}-storage`} aria-live="polite">
        {theme.unavailable ? themeCopy.unavailable : null}
      </span>
    </div>
  );
}
