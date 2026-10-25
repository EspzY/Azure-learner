import {
  applyPractical,
  freshPractical,
  practicalFacts,
  practicalKey,
  restorePractical,
  type PracticalEvent,
} from './practical';
import type { StoragePort } from './store';
export class PracticalStore {
  private view = { ready: false, save: freshPractical(), issue: null as string | null };
  private server = this.view;
  private base: string | null = null;
  private listeners = new Set<() => void>();
  constructor(private port: StoragePort) {}
  getSnapshot = () => this.view;
  getServerSnapshot = () => this.server;
  subscribe = (f: () => void) => {
    this.listeners.add(f);
    return () => {
      this.listeners.delete(f);
    };
  };
  private publish(view: typeof this.view) {
    this.view = view;
    this.listeners.forEach((f) => f());
  }
  load = () => {
    try {
      this.base = this.port.getItem(practicalKey);
      this.publish({ ready: true, save: restorePractical(this.base), issue: null });
    } catch (e) {
      this.publish({
        ...this.view,
        ready: true,
        issue: e instanceof Error && e.message === 'unsupported' ? 'unsupported' : 'corrupt',
      });
    }
  };
  changed = () => {
    try {
      if (this.port.getItem(practicalKey) !== this.base)
        this.publish({ ...this.view, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  event = (event: PracticalEvent) => {
    if (!this.view.ready || (this.view.issue && this.view.issue !== 'unsaved')) return false;
    const save = applyPractical(this.view.save, event);
    if (!save) {
      this.publish({
        ...this.view,
        issue: this.view.save.events.length >= 400 ? 'limit' : 'invalid-action',
      });
      return false;
    }
    if (save === this.view.save) return true;
    try {
      if (this.port.getItem(practicalKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      /* memory */
    }
    const raw = JSON.stringify(save);
    let issue = null;
    try {
      this.port.setItem(practicalKey, raw);
      this.base = raw;
    } catch {
      issue = 'unsaved';
    }
    this.publish({ ready: true, save, issue });
    return true;
  };
  restartContext = (attempt: number) => {
    const current = practicalFacts(this.view.save).current;
    if (!current) return false;
    if (current.status === 'active' && !this.event({ type: 'abandon' })) return false;
    return this.event({
      type: 'start',
      kind: current.kind,
      mode: current.mode,
      origin: current.origin,
      attempt,
      boundary: null,
    });
  };
  clear = () => {
    this.base = null;
    this.publish({ ready: true, save: freshPractical(), issue: null });
  };
}
