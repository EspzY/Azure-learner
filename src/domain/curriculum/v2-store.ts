import {
  applyV2,
  freshV2,
  foundationsV2Key,
  restoreV2,
  type FoundationsV2Save,
} from './foundations-v2';
export interface LearningStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}
export type LearningIssue = 'corrupt' | 'unsupported' | 'unsaved' | 'conflict' | 'limit' | null;
export class FoundationsV2Store {
  private view: { save: FoundationsV2Save; ready: boolean; issue: LearningIssue } = {
    save: freshV2(),
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
      this.base = this.storage.getItem(foundationsV2Key);
      this.publish({ ...restoreV2(this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(foundationsV2Key) !== this.base)
        this.publish({ ...this.view, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  event = (raw: unknown) => {
    if (
      !this.view.ready ||
      ['corrupt', 'unsupported', 'conflict', 'limit'].includes(this.view.issue ?? '')
    )
      return false;
    const next = applyV2(this.view.save, raw);
    if (!next) {
      if (this.view.save.events.length >= 600) this.publish({ ...this.view, issue: 'limit' });
      return false;
    }
    if (next === this.view.save) return true;
    let readable = true;
    try {
      if (this.storage.getItem(foundationsV2Key) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      readable = false;
    }
    try {
      if (!readable) throw Error('unreadable');
      const raw = JSON.stringify(next);
      this.storage.setItem(foundationsV2Key, raw);
      this.base = raw;
      this.publish({ save: next, ready: true, issue: null });
    } catch {
      this.publish({ save: next, ready: true, issue: 'unsaved' });
    }
    return true;
  };
  choose = (choice: 'v1' | 'v2') => {
    if (
      !this.view.ready ||
      ['corrupt', 'unsupported', 'conflict', 'limit'].includes(this.view.issue ?? '')
    )
      return false;
    const next = { ...this.view.save, choice };
    try {
      if (this.storage.getItem(foundationsV2Key) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
      const raw = JSON.stringify(next);
      this.storage.setItem(foundationsV2Key, raw);
      this.base = raw;
      this.publish({ save: next, ready: true, issue: null });
    } catch {
      this.publish({ save: next, ready: true, issue: 'unsaved' });
    }
    return true;
  };
  clear = () => {
    let issue: LearningIssue = null;
    try {
      this.storage.removeItem(foundationsV2Key);
      this.base = null;
    } catch {
      issue = 'unsaved';
    }
    this.publish({ save: freshV2(), ready: true, issue });
  };
}
