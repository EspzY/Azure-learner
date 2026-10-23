import { applyEvent, freshAttempt, parseEvent, type Attempt } from '@/domain/chapter01/scenario';
import { chapterKey, restoreChapter, snapshotOf } from '@/domain/chapter01/persistence';

export type StorageIssue =
  'corrupt' | 'unsupported' | 'conflict' | 'unsaved' | 'limit' | 'invalid-action' | null;
export interface StoreView {
  attempt: Attempt;
  ready: boolean;
  issue: StorageIssue;
  storeRevision: number;
  attemptNumber: number;
}
interface StoragePort {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}
export class GuidedStore {
  private view: StoreView = {
    attempt: freshAttempt(),
    ready: false,
    issue: null,
    storeRevision: 0,
    attemptNumber: 1,
  };
  private base: string | null = null;
  private listeners = new Set<() => void>();
  constructor(private storage: StoragePort) {}
  getSnapshot = () => this.view;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(next: StoreView) {
    this.view = next;
    for (const listener of this.listeners) listener();
  }
  load = () => {
    try {
      const raw = this.storage.getItem(chapterKey);
      const restored = restoreChapter(raw);
      this.base = raw;
      this.publish({
        attempt: restored.attempt,
        ready: true,
        issue:
          restored.status === 'corrupt' || restored.status === 'unsupported'
            ? restored.status
            : null,
        storeRevision: restored.snapshot?.storeRevision ?? 0,
        attemptNumber: restored.snapshot?.attemptNumber ?? 1,
      });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    try {
      if (this.storage.getItem(chapterKey) !== this.base)
        this.publish({ ...this.view, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  private canWrite(): 'ok' | 'blocked' | 'memory' {
    try {
      if (this.storage.getItem(chapterKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return 'blocked';
      }
      return 'ok';
    } catch {
      return 'memory';
    }
  }
  private save(next: StoreView, mode: 'ok' | 'memory') {
    const raw = JSON.stringify(snapshotOf(next.attempt, next.storeRevision, next.attemptNumber));
    if (raw.length > 250_000) {
      this.publish({ ...next, issue: 'limit' });
      return;
    }
    if (mode === 'memory') {
      this.publish({ ...next, issue: 'unsaved' });
      return;
    }
    try {
      this.storage.setItem(chapterKey, raw);
      this.base = raw;
      this.publish({ ...next, issue: null });
    } catch {
      this.publish({ ...next, issue: 'unsaved' });
    }
  }
  dispatch = (raw: unknown): boolean => {
    if (
      !this.view.ready ||
      ['corrupt', 'unsupported', 'conflict', 'limit'].includes(this.view.issue ?? '')
    )
      return false;
    const mode = this.canWrite();
    if (mode === 'blocked') return false;
    const event = parseEvent(raw);
    const next = event && applyEvent(this.view.attempt, event);
    if (!next) {
      this.publish({
        ...this.view,
        issue: this.view.attempt.events.length >= 500 ? 'limit' : 'invalid-action',
      });
      return false;
    }
    this.save({ ...this.view, attempt: next, storeRevision: this.view.storeRevision + 1 }, mode);
    return true;
  };
  restart = (): boolean => {
    if (!this.view.ready || this.view.issue === 'conflict') return false;
    const mode = this.canWrite();
    if (mode === 'blocked') return false;
    this.save(
      {
        attempt: freshAttempt(),
        ready: true,
        issue: null,
        storeRevision: this.view.storeRevision + 1,
        attemptNumber: this.view.attemptNumber + 1,
      },
      mode,
    );
    return true;
  };
  clear = () => {
    let issue: StorageIssue = null;
    try {
      this.storage.removeItem(chapterKey);
      this.base = null;
    } catch {
      issue = 'unsaved';
    }
    this.publish({
      attempt: freshAttempt(),
      ready: true,
      issue,
      storeRevision: 0,
      attemptNumber: 1,
    });
  };
  exportSnapshot = () =>
    JSON.stringify(
      snapshotOf(this.view.attempt, this.view.storeRevision, this.view.attemptNumber),
      null,
      2,
    );
}
