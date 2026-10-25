import {
  applyModuleEvent,
  freshServices,
  restoreServices,
  serviceLearningKey,
  type ServiceSave,
} from './learning';
import type { LearningStorage } from '../curriculum/store';
export class ServiceStore {
  private view: {
    save: ServiceSave;
    ready: boolean;
    issue: 'corrupt' | 'unsupported' | 'conflict' | 'unsaved' | 'limit' | null;
  } = { save: freshServices(), ready: false, issue: null };
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
      this.base = this.storage.getItem(serviceLearningKey);
      this.publish({ ...restoreServices(this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(serviceLearningKey) !== this.base)
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
    const next = applyModuleEvent(this.view.save, raw);
    if (!next) {
      if (this.view.save.events.length >= 400) this.publish({ ...this.view, issue: 'limit' });
      return false;
    }
    if (next === this.view.save) return true;
    let readable = true;
    try {
      if (this.storage.getItem(serviceLearningKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      readable = false;
    }
    try {
      if (!readable) throw Error('read');
      const raw = JSON.stringify(next);
      this.storage.setItem(serviceLearningKey, raw);
      this.base = raw;
      this.publish({ save: next, ready: true, issue: null });
    } catch {
      this.publish({ save: next, ready: true, issue: 'unsaved' });
    }
    return true;
  };
  clear = () => {
    let issue: typeof this.view.issue = null;
    try {
      this.storage.removeItem(serviceLearningKey);
      this.base = null;
    } catch {
      issue = 'unsaved';
    }
    this.publish({ save: freshServices(), ready: true, issue });
  };
}
