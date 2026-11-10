import {
  applyV2,
  leaveV2,
  v2Facts,
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
  private commit(next: FoundationsV2Save, terminal = false): boolean {
    if (!this.view.ready || (this.view.issue && !(terminal && this.view.issue === 'limit')))
      return false;
    try {
      if (this.storage.getItem(foundationsV2Key) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
      if (next === this.view.save) return true;
      const raw = JSON.stringify(next);
      if (restoreV2(raw).issue) {
        this.publish({ ...this.view, issue: 'limit' });
        return false;
      }
      this.storage.setItem(foundationsV2Key, raw);
      if (this.storage.getItem(foundationsV2Key) !== raw) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
      this.base = raw;
      this.publish({ save: next, ready: true, issue: null });
      return true;
    } catch {
      // Never publish an optimistic draft/result/abandonment as durable evidence.
      this.publish({ ...this.view, issue: 'unsaved' });
      return false;
    }
  }
  event = (raw: unknown) => {
    const terminal =
      this.view.save.schema === 3 &&
      !!raw &&
      typeof raw === 'object' &&
      'kind' in raw &&
      ['aid', 'submit', 'abandon'].includes(String(raw.kind));
    if (!this.view.ready || (this.view.issue && !(terminal && this.view.issue === 'limit')))
      return false;
    const next = applyV2(this.view.save, raw);
    if (!next) {
      if (this.view.save.events.length >= 600) this.publish({ ...this.view, issue: 'limit' });
      return false;
    }
    return this.commit(next, terminal);
  };
  /** A single CAS/readback transaction: required aid precedes explicit abandonment. */
  leaveForNavigation = (expectedBegin: number, assistance: boolean) => {
    if (
      !this.view.ready ||
      (this.view.issue && this.view.issue !== 'limit') ||
      !v2Facts(this.view.save).active ||
      this.view.save.events.findLastIndex((e) => e.kind === 'begin') !== expectedBegin
    )
      return false;
    const next = leaveV2(this.view.save, assistance);
    return !!next && this.commit(next, true);
  };
  choose = (choice: 'v1' | 'v2') => this.commit({ ...this.view.save, choice });
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
