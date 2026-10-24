'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  defaultPresentation,
  parsePresentation,
  presentationKey,
  type PresentationPreferences,
} from '@/domain/instruction/preferences';
import { AmbientAudio } from './ambient';
import { nb } from '@/content/nb';
const Context = createContext<{
  preferences: PresentationPreferences;
  update: (change: Partial<PresentationPreferences>) => void;
  audio: AmbientAudio;
  enable: () => void;
  playing: boolean;
  failed: boolean;
  issue: boolean;
} | null>(null);
export function PresentationProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState(defaultPresentation);
  const [audio] = useState(() => new AmbientAudio());
  const [issue, setIssue] = useState(false),
    [playing, setPlaying] = useState(false),
    [failed, setFailed] = useState(false);
  const raw = useRef<string | null>(null),
    writable = useRef(true),
    current = useRef(preferences);
  useEffect(() => {
    audio.mount();
    try {
      raw.current = localStorage.getItem(presentationKey);
      const parsed = parsePresentation(raw.current);
      if (parsed) {
        current.current = parsed;
        setPreferences(parsed);
      } else {
        writable.current = false;
        setIssue(true);
      }
    } catch {
      writable.current = false;
      setIssue(true);
    }
    const visibility = () => audio.update(current.current, !document.hidden);
    const clear = () => {
      current.current = { ...defaultPresentation };
      setPreferences(current.current);
      audio.update(current.current, true);
      setPlaying(false);
      raw.current = null;
      writable.current = true;
      setIssue(false);
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('azurelab:clear', clear);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('azurelab:clear', clear);
      audio.dispose();
    };
  }, [audio]);
  function update(change: Partial<PresentationPreferences>) {
    const next = parsePresentation(JSON.stringify({ ...current.current, ...change }));
    if (!next) return;
    current.current = next;
    setPreferences(next);
    audio.update(next, !document.hidden);
    if (!writable.current) return;
    try {
      if (localStorage.getItem(presentationKey) !== raw.current) {
        writable.current = false;
        setIssue(true);
        return;
      }
      raw.current = JSON.stringify(next);
      localStorage.setItem(presentationKey, raw.current);
    } catch {
      writable.current = false;
      setIssue(true);
    }
  }
  async function enable() {
    const next = { ...current.current, muted: false };
    try {
      await audio.enable(next);
      update({ muted: false });
      setPlaying(true);
      setFailed(false);
    } catch {
      setFailed(true);
      setPlaying(false);
    }
  }
  return (
    <Context.Provider value={{ preferences, update, audio, enable, playing, failed, issue }}>
      {children}
    </Context.Provider>
  );
}
export function usePresentation() {
  const c = useContext(Context);
  if (!c) throw Error('PresentationProvider required');
  return c;
}
export function AudioControls() {
  const p = usePresentation(),
    t = nb.teaching.audio;
  return (
    <fieldset className="audio-settings">
      <legend>{t.title}</legend>
      <p>{t.hint}</p>
      <button type="button" onClick={p.enable}>
        {t.enable}
      </button>
      <label>
        <input
          type="checkbox"
          checked={p.preferences.muted}
          onChange={(e) => p.update({ muted: e.target.checked })}
        />
        {t.mute}
      </label>
      {(['music', 'effects'] as const).map((id) => (
        <label key={id}>
          {t[id]}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={p.preferences[id]}
            onChange={(e) => p.update({ [id]: Number(e.target.value) })}
          />
        </label>
      ))}
      <p role="status">
        {p.failed ? t.failed : p.playing && !p.preferences.muted ? t.ready : t.off}
      </p>
      {p.issue && <p role="status">{nb.teaching.preferencesIssue}</p>}
    </fieldset>
  );
}
