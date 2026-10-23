'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { freshGame, restoreGame, rpgKey, type GameSave } from '@/domain/rpg/persistence';
import { parseStoryEvent } from '@/domain/rpg/story';
import { gatewayReturn, validPose, type Pose } from '@/domain/rpg/world';

interface StoragePort {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}
type Issue = 'corrupt' | 'unsupported' | 'unsaved' | 'conflict' | 'limit' | null;
interface Snapshot {
  save: GameSave;
  ready: boolean;
  issue: Issue;
}
export class GameStore {
  private snapshot: Snapshot = { save: freshGame(), ready: false, issue: null };
  private base: string | null = null;
  private listeners = new Set<() => void>();
  constructor(private storage: StoragePort) {}
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(snapshot: Snapshot) {
    this.snapshot = snapshot;
    for (const listener of this.listeners) listener();
  }
  load = () => {
    try {
      this.base = this.storage.getItem(rpgKey);
      const restored = restoreGame(this.base);
      this.publish({ ...restored, ready: true });
    } catch {
      this.publish({ ...this.snapshot, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(rpgKey) !== this.base)
        this.publish({ ...this.snapshot, issue: 'conflict' });
    } catch {
      this.publish({ ...this.snapshot, issue: 'unsaved' });
    }
  };
  private write(save: GameSave) {
    if (
      !this.snapshot.ready ||
      ['corrupt', 'unsupported', 'conflict', 'limit'].includes(this.snapshot.issue ?? '')
    )
      return false;
    let readable = true;
    try {
      if (this.storage.getItem(rpgKey) !== this.base) {
        this.publish({ ...this.snapshot, issue: 'conflict' });
        return false;
      }
    } catch {
      readable = false;
    }
    const raw = JSON.stringify(save);
    try {
      if (!readable) throw new Error('unreadable');
      this.storage.setItem(rpgKey, raw);
      this.base = raw;
      this.publish({ save, ready: true, issue: null });
    } catch {
      this.publish({ save, ready: true, issue: 'unsaved' });
    }
    return true;
  }
  event = (raw: unknown) => {
    const event = parseStoryEvent(raw);
    if (!event) return false;
    const save = this.snapshot.save;
    if (save.events.length >= 200) {
      this.publish({ ...this.snapshot, issue: 'limit' });
      return false;
    }
    // Repeated model selection does not create an unbounded idle-event stream.
    const last = save.events.at(-1);
    if (last?.kind === 'model' && event.kind === 'model' && last.model === event.model) return true;
    return this.write({ ...save, events: [...save.events, event] });
  };
  position = (pose: Pose) => {
    if (!validPose(pose)) return false;
    const candidate = {
      x: Math.round(pose.x * 100) / 100,
      z: Math.round(pose.z * 100) / 100,
      yaw: pose.yaw,
    };
    // Rounding at a circular collision boundary must never make a valid pose unrestorable.
    const rounded = validPose(candidate) ? candidate : { ...pose };
    if (JSON.stringify(rounded) === JSON.stringify(this.snapshot.save.pose)) return true;
    return this.write({ ...this.snapshot.save, pose: rounded });
  };
  portal = () =>
    this.write({ ...this.snapshot.save, pose: { ...gatewayReturn }, returnPending: true });
  returned = () => {
    if (this.snapshot.save.returnPending)
      this.write({ ...this.snapshot.save, returnPending: false, pose: { ...gatewayReturn } });
  };
  quality = (quality: GameSave['quality']) =>
    ['auto', 'low', 'high'].includes(quality) && this.write({ ...this.snapshot.save, quality });
  clear = () => {
    let issue: Issue = null;
    try {
      this.storage.removeItem(rpgKey);
      this.base = null;
    } catch {
      issue = 'unsaved';
    }
    this.publish({ save: freshGame(), ready: true, issue });
  };
}
const Context = createContext<GameStore | null>(null);
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(
    () =>
      new GameStore({
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
      }),
  );
  useEffect(() => {
    store.load();
    const changed = (event: StorageEvent) => {
      if (event.key === rpgKey || event.key === null) store.changed();
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
export function useGame() {
  const store = useContext(Context);
  if (!store) throw new Error('GameProvider required');
  const view = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  return { ...view, store };
}
