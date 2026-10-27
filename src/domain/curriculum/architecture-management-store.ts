import {
  applyManagement,
  freshManagement,
  managementFacts,
  managementKey,
  restoreManagement,
  type ManagementSave,
} from './architecture-management';
export interface LearningStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}
export type LearningIssue = 'corrupt' | 'unsupported' | 'unsaved' | 'conflict' | null;
export class ManagementStore {
  private view: { save: ManagementSave; ready: boolean; issue: LearningIssue } = {
    save: freshManagement(),
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
      this.base = this.storage.getItem(managementKey);
      this.publish({ ...restoreManagement(this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(managementKey) !== this.base)
        this.publish({ ...this.view, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  /** Read-only teaching may reveal answers. Reconcile first; never merge drafts or
   * label a rejected/unsaved aid write as an unaided learning opportunity. */
  prepareTeaching = () => {
    if (!this.view.ready || this.view.issue) return false;
    try {
      if (this.storage.getItem(managementKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
      return false;
    }
    const facts = managementFacts(this.view.save);
    if (facts.active && !facts.assisted) {
      if (!this.event({ kind: 'aid' })) return false;
      return !this.view.issue && managementFacts(this.view.save).assisted;
    }
    return true;
  };
  event = (raw: unknown) => {
    if (!this.view.ready || ['corrupt', 'unsupported', 'conflict'].includes(this.view.issue ?? ''))
      return false;
    const next = applyManagement(this.view.save, raw);
    if (!next) return false;
    if (next === this.view.save) return true;
    let readable = true;
    try {
      if (this.storage.getItem(managementKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      readable = false;
    }
    try {
      if (!readable) throw Error('unreadable');
      const raw = JSON.stringify(next);
      this.storage.setItem(managementKey, raw);
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
      const current = this.storage.getItem(managementKey);
      const restored = restoreManagement(current);
      if (current !== this.base || !restored.issue) {
        this.base = current;
        this.publish({ ...restored, ready: true });
        return false;
      }
      this.storage.removeItem(managementKey);
      this.base = null;
      this.publish({ save: freshManagement(), ready: true, issue: null });
      return true;
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
      return false;
    }
  };
  clear = () => {
    let issue: LearningIssue = null;
    try {
      this.storage.removeItem(managementKey);
      this.base = null;
    } catch {
      issue = 'unsaved';
    }
    this.publish({ save: freshManagement(), ready: true, issue });
  };
}
