import {
  applyCompute,
  freshCompute,
  restoreCompute,
  computeFacts,
  computeKey,
  type ComputeSave,
} from './compute';
interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
type Issue = 'corrupt' | 'unsupported' | 'unsaved' | 'conflict' | null;
/** Durable-only writes. Unsaved answers remain visible in controls only after a successful retry. */
export class ComputeStore {
  private view: { save: ComputeSave; ready: boolean; issue: Issue } = {
    save: freshCompute(),
    ready: false,
    issue: null,
  };
  private readonly serverView = this.view;
  private base: string | null = null;
  private listeners = new Set<() => void>();
  constructor(private storage: Storage) {}
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
      this.base = this.storage.getItem(computeKey);
      this.publish({ ...restoreCompute(this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(computeKey) !== this.base)
        this.publish({ ...this.view, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  event = (raw: unknown) => {
    if (!this.view.ready || this.view.issue) return false;
    const next = applyCompute(this.view.save, raw);
    if (!next) return false;
    try {
      if (this.storage.getItem(computeKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
      if (next === this.view.save) return true;
      const encoded = JSON.stringify(next);
      this.storage.setItem(computeKey, encoded);
      if (this.storage.getItem(computeKey) !== encoded) {
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
    const f = computeFacts(this.view.save);
    return !f.active || f.assisted || this.event({ kind: 'aid' });
  };
  recoverInvalid = () => {
    if (!['corrupt', 'unsupported'].includes(this.view.issue ?? '')) return false;
    try {
      const latest = this.storage.getItem(computeKey),
        restored = restoreCompute(latest);
      if (latest !== this.base || !restored.issue) {
        this.base = latest;
        this.publish({ ...restored, ready: true });
        return false;
      }
      this.storage.removeItem(computeKey);
      this.base = null;
      this.publish({ save: freshCompute(), ready: true, issue: null });
      return true;
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
      return false;
    }
  };
}
