import {
  applyMonitoring,
  freshMonitoring,
  restoreMonitoring,
  monitoringFacts,
  monitoringKey,
  type MonitoringSave,
} from './monitoring';
interface Monitoring {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
type Issue = 'corrupt' | 'unsupported' | 'unsaved' | 'conflict' | null;
/** Durable-only writes. Unsaved answers remain visible in controls only after a successful retry. */
export class MonitoringStore {
  private view: { save: MonitoringSave; ready: boolean; issue: Issue } = {
    save: freshMonitoring(),
    ready: false,
    issue: null,
  };
  private readonly serverView = this.view;
  private base: string | null = null;
  private listeners = new Set<() => void>();
  constructor(private access: Monitoring) {}
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
      this.base = this.access.getItem(monitoringKey);
      this.publish({ ...restoreMonitoring(this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.access.getItem(monitoringKey) !== this.base)
        this.publish({ ...this.view, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  event = (raw: unknown) => {
    if (!this.view.ready || this.view.issue) return false;
    const next = applyMonitoring(this.view.save, raw);
    if (!next) return false;
    try {
      if (this.access.getItem(monitoringKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
      if (next === this.view.save) return true;
      const encoded = JSON.stringify(next);
      this.access.setItem(monitoringKey, encoded);
      if (this.access.getItem(monitoringKey) !== encoded) {
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
    const f = monitoringFacts(this.view.save);
    return !f.active || f.assisted || this.event({ kind: 'aid' });
  };
  recoverInvalid = () => {
    if (!['corrupt', 'unsupported'].includes(this.view.issue ?? '')) return false;
    try {
      const latest = this.access.getItem(monitoringKey),
        restored = restoreMonitoring(latest);
      if (latest !== this.base || !restored.issue) {
        this.base = latest;
        this.publish({ ...restored, ready: true });
        return false;
      }
      this.access.removeItem(monitoringKey);
      this.base = null;
      this.publish({ save: freshMonitoring(), ready: true, issue: null });
      return true;
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
      return false;
    }
  };
}
