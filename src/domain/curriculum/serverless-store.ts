import {
  applyServerless,
  freshServerless,
  serverlessKey,
  restoreServerless,
  type ServerlessSave,
} from './serverless';
export interface LearningStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}
export type LearningIssue = 'corrupt' | 'unsupported' | 'unsaved' | 'conflict' | 'limit' | null;
export class ServerlessStore {
  private view: { save: ServerlessSave; ready: boolean; issue: LearningIssue } = {
    save: freshServerless(),
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
      this.base = this.storage.getItem(serverlessKey);
      this.publish({ ...restoreServerless(this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(serverlessKey) !== this.base)
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
    const next = applyServerless(this.view.save, raw);
    if (!next) {
      if (this.view.save.events.length >= 400) this.publish({ ...this.view, issue: 'limit' });
      return false;
    }
    if (next === this.view.save) return true;
    let readable = true;
    try {
      if (this.storage.getItem(serverlessKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      readable = false;
    }
    try {
      if (!readable) throw Error('unreadable');
      const raw = JSON.stringify(next);
      this.storage.setItem(serverlessKey, raw);
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
      this.storage.removeItem(serverlessKey);
      this.base = null;
    } catch {
      issue = 'unsaved';
    }
    this.publish({ save: freshServerless(), ready: true, issue });
  };
}
