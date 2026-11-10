import {
  applyPhysical,
  freshPhysical,
  physicalKey,
  restorePhysical,
  type PhysicalSave,
} from './architecture-physical';
export interface LearningStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}
export type LearningIssue = 'corrupt' | 'unsupported' | 'unsaved' | 'conflict' | null;
export class PhysicalStore {
  private view: { save: PhysicalSave; ready: boolean; issue: LearningIssue } = {
    save: freshPhysical(),
    ready: false,
    issue: null,
  };
  private base: string | null = null;
  private readonly serverView = this.view;
  getServerSnapshot = () => this.serverView;
  private listeners = new Set<() => void>();
  constructor(private storage: LearningStorage) {}
  getSnapshot = () => this.view;
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
      this.base = this.storage.getItem(physicalKey);
      this.publish({ ...restorePhysical(this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(physicalKey) !== this.base)
        this.publish({ ...this.view, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  event = (raw: unknown) => {
    if (!this.view.ready || ['corrupt', 'unsupported', 'conflict'].includes(this.view.issue ?? ''))
      return false;
    const next = applyPhysical(this.view.save, raw);
    if (!next) return false;
    if (next === this.view.save) return true;
    let readable = true;
    try {
      if (this.storage.getItem(physicalKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      readable = false;
    }
    try {
      if (!readable) throw Error('unreadable');
      const raw = JSON.stringify(next);
      this.storage.setItem(physicalKey, raw);
      this.base = raw;
      this.publish({ save: next, ready: true, issue: null });
    } catch {
      this.publish({ save: next, ready: true, issue: 'unsaved' });
    }
    return true;
  };
  /** Confirmation applies only to the same quarantined bytes, never a repaired record. */
  recoverInvalid = () => {
    if (!this.view.ready || !['corrupt', 'unsupported'].includes(this.view.issue ?? ''))
      return false;
    try {
      const current = this.storage.getItem(physicalKey);
      const restored = restorePhysical(current);
      if (current !== this.base || !restored.issue) {
        this.base = current;
        this.publish({ ...restored, ready: true });
        return false;
      }
      this.storage.removeItem(physicalKey);
      this.base = null;
      this.publish({ save: freshPhysical(), ready: true, issue: null });
      return true;
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
      return false;
    }
  };
  clear = () => {
    let issue: LearningIssue = null;
    try {
      this.storage.removeItem(physicalKey);
      this.base = null;
    } catch {
      issue = 'unsaved';
    }
    this.publish({ save: freshPhysical(), ready: true, issue });
  };
}
