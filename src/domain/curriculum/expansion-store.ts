import { apply, fresh, restore, expansionKeys, type Track, type Save } from './expansion';
import type { LearningStorage } from './store';
export class ExpansionStore {
  private view: {
    save: Save;
    ready: boolean;
    issue: 'corrupt' | 'unsupported' | 'conflict' | 'unsaved' | 'limit' | null;
  };
  private readonly serverView: typeof this.view;
  private base: string | null = null;
  private listeners = new Set<() => void>();
  constructor(
    readonly track: Track,
    private storage: LearningStorage,
  ) {
    this.view = { save: fresh(track), ready: false, issue: null };
    this.serverView = this.view;
  }
  getSnapshot = () => this.view;
  getServerSnapshot = () => this.serverView;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  private publish = (value: typeof this.view) => {
    this.view = value;
    this.listeners.forEach((fn) => fn());
  };
  load = () => {
    try {
      this.base = this.storage.getItem(expansionKeys[this.track]);
      this.publish({ ...restore(this.track, this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(expansionKeys[this.track]) !== this.base)
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
    const next = apply(this.view.save, raw);
    if (!next) {
      if (this.view.save.events.length >= 600) this.publish({ ...this.view, issue: 'limit' });
      return false;
    }
    if (next === this.view.save) return true;
    let readable = true;
    try {
      if (this.storage.getItem(expansionKeys[this.track]) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      readable = false;
    }
    try {
      if (!readable) throw Error('read');
      const raw = JSON.stringify(next);
      this.storage.setItem(expansionKeys[this.track], raw);
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
      this.storage.removeItem(expansionKeys[this.track]);
      this.base = null;
    } catch {
      issue = 'unsaved';
    }
    this.publish({ save: fresh(this.track), ready: true, issue });
  };
}
