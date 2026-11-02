import type { Track } from './expansion';
import {
  applyRefined,
  freshRefined,
  restoreRefined,
  refinedFacts,
  refinedKeys,
  type RefinedSave,
} from './refined-assessment';
interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
type Issue = 'corrupt' | 'unsupported' | 'unsaved' | 'conflict' | null;
/** Durable-only writes. Unsaved answers remain visible in controls only after a successful retry. */
export class RefinedStore {
  private view: { save: RefinedSave; ready: boolean; issue: Issue } = {
    save: freshRefined('benefits'),
    ready: false,
    issue: null,
  };
  private serverView = this.view;
  private base: string | null = null;
  private listeners = new Set<() => void>();
  constructor(
    public readonly track: Track,
    private storage: Storage,
  ) {
    this.view = { save: freshRefined(track), ready: false, issue: null };
    this.serverView = this.view;
  }
  private get key() {
    return refinedKeys[this.track];
  }
  getSnapshot = () => this.view;
  getServerSnapshot = () => this.serverView;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(view: typeof this.view) {
    this.view = view;
    for (const fn of this.listeners) fn();
  }
  load = () => {
    try {
      this.base = this.storage.getItem(this.key);
      this.publish({ ...restoreRefined(this.track, this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(this.key) !== this.base)
        this.publish({ ...this.view, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  event = (raw: unknown) => {
    if (!this.view.ready || this.view.issue) return false;
    const next = applyRefined(this.view.save, raw);
    if (!next) return false;
    try {
      if (this.storage.getItem(this.key) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
      if (next === this.view.save) return true;
      const encoded = JSON.stringify(next);
      this.storage.setItem(this.key, encoded);
      if (this.storage.getItem(this.key) !== encoded) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
      this.base = encoded;
      this.publish({ save: next, ready: true, issue: null });
      return true;
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
      return false;
    }
  };
  prepareTeaching = () => {
    if (!this.view.ready || this.view.issue) return false;
    this.changed();
    if (this.view.issue) return false;
    const f = refinedFacts(this.view.save);
    return !f.active || f.assisted || this.event({ kind: 'aid' });
  };
  recoverInvalid = () => {
    if (!['corrupt', 'unsupported'].includes(this.view.issue ?? '')) return false;
    try {
      const latest = this.storage.getItem(this.key),
        restored = restoreRefined(this.track, latest);
      if (latest !== this.base || !restored.issue) {
        this.base = latest;
        this.publish({ ...restored, ready: true });
        return false;
      }
      this.storage.removeItem(this.key);
      this.base = null;
      this.publish({ save: freshRefined(this.track), ready: true, issue: null });
      return true;
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
      return false;
    }
  };
}
