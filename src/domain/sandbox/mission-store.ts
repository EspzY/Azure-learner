import {
  applyMission,
  freshMissions,
  missionFacts,
  missionKey,
  restoreMissions,
  type MissionSave,
} from './missions';
export interface MissionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
type Issue = 'corrupt' | 'unsupported' | 'unsaved' | 'conflict' | null;
export class MissionStore {
  private view: { save: MissionSave; ready: boolean; issue: Issue } = {
    save: freshMissions(),
    ready: false,
    issue: null,
  };
  private base: string | null = null;
  private readonly serverView = this.view;
  private listeners = new Set<() => void>();
  constructor(private storage: MissionStorage) {}
  getSnapshot = () => this.view;
  getServerSnapshot = () => this.serverView;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  private publish(view: typeof this.view) {
    this.view = view;
    for (const fn of this.listeners) fn();
  }
  load = () => {
    try {
      this.base = this.storage.getItem(missionKey);
      this.publish({ ...restoreMissions(this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(missionKey) !== this.base)
        this.publish({ ...this.view, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  prepareTeaching = () => {
    if (!this.view.ready || this.view.issue) return false;
    try {
      if (this.storage.getItem(missionKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
      return false;
    }
    const f = missionFacts(this.view.save);
    if (f.active && !f.assisted) {
      if (!this.event({ type: 'aid' })) return false;
      return !this.view.issue && missionFacts(this.view.save).assisted;
    }
    return true;
  };
  event = (raw: unknown) => {
    if (!this.view.ready || ['corrupt', 'unsupported', 'conflict'].includes(this.view.issue ?? ''))
      return false;
    const next = applyMission(this.view.save, raw);
    if (!next) return false;
    if (next === this.view.save) return true;
    let readable = true;
    try {
      if (this.storage.getItem(missionKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      readable = false;
    }
    try {
      if (!readable) throw Error('unreadable');
      const raw = JSON.stringify(next);
      this.storage.setItem(missionKey, raw);
      this.base = raw;
      this.publish({ save: next, ready: true, issue: null });
    } catch {
      this.publish({ save: next, ready: true, issue: 'unsaved' });
    }
    return true;
  };
  recoverInvalid = () => {
    if (!this.view.ready || !['corrupt', 'unsupported'].includes(this.view.issue ?? ''))
      return false;
    try {
      const current = this.storage.getItem(missionKey),
        restored = restoreMissions(current);
      if (current !== this.base || !restored.issue) {
        this.base = current;
        this.publish({ ...restored, ready: true });
        return false;
      }
      this.storage.removeItem(missionKey);
      this.base = null;
      this.publish({ save: freshMissions(), ready: true, issue: null });
      return true;
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
      return false;
    }
  };
  clear = () => {
    let issue: Issue = null;
    try {
      this.storage.removeItem(missionKey);
      this.base = null;
    } catch {
      issue = 'unsaved';
    }
    this.publish({ save: freshMissions(), ready: true, issue });
  };
}
