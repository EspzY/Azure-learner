import type { ChallengeOrigin } from './challenge-origin';
import type { LearningStorage } from '../curriculum/store';
import { serviceLearningKey, restoreServices, serviceFacts } from './learning';
import {
  applyChallenge2,
  challenge2Key,
  challenge2Facts,
  challenge2Limit,
  freshChallenge2,
  restoreChallenge2,
  type Challenge2Save,
} from './challenge-v2';
export class Challenge2Store {
  private view: {
    save: Challenge2Save;
    ready: boolean;
    issue: 'corrupt' | 'unsupported' | 'conflict' | 'unsaved' | 'limit' | null;
  } = { save: freshChallenge2(), ready: false, issue: null };
  private base: string | null = null;
  private generation = 0;
  private readonly serverView = this.view;
  private listeners = new Set<() => void>();
  constructor(private storage: LearningStorage) {}
  getSnapshot = () => this.view;
  getServerSnapshot = () => this.serverView;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  private publish = (v: typeof this.view) => {
    this.view = v;
    for (const fn of this.listeners) fn();
  };
  load = () => {
    ++this.generation;
    try {
      this.base = this.storage.getItem(challenge2Key);
      this.publish({ ...restoreChallenge2(this.base), ready: true });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    ++this.generation;
    try {
      if (this.storage.getItem(challenge2Key) !== this.base)
        this.publish({ ...this.view, ready: true, issue: 'conflict' });
      else if (!this.view.ready) this.publish({ ...this.view, ready: true, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  event = (raw: unknown) => {
    if (
      !this.view.ready ||
      (this.view.issue &&
        !(
          this.view.issue === 'limit' &&
          raw &&
          typeof raw === 'object' &&
          'kind' in raw &&
          ['aid', 'submit', 'abandon'].includes(String(raw.kind))
        ))
    )
      return false;
    let input = raw;
    if (raw && typeof raw === 'object' && 'kind' in raw && raw.kind === 'begin') {
      try {
        const old = restoreServices(this.storage.getItem(serviceLearningKey));
        if (old.issue || serviceFacts(old.save).active) {
          this.publish({ ...this.view, ready: true, issue: 'conflict' });
          return false;
        }
        input = {
          ...raw,
          prior: old.save.events.some((e) => e.kind === 'begin') ? 'documented' : 'none-recorded',
        };
      } catch {
        this.publish({ ...this.view, ready: true, issue: 'unsaved' });
        return false;
      }
    }
    const next = applyChallenge2(this.view.save, input);
    if (!next) {
      if (this.view.save.events.length >= challenge2Limit - 3)
        this.publish({ ...this.view, issue: 'limit' });
      return false;
    }
    if (next === this.view.save) return true;
    try {
      if (this.storage.getItem(challenge2Key) !== this.base) {
        this.publish({ ...this.view, ready: true, issue: 'conflict' });
        return false;
      }
      const encoded = JSON.stringify(next);
      this.storage.setItem(challenge2Key, encoded);
      if (this.storage.getItem(challenge2Key) !== encoded) throw Error('readback');
      this.base = encoded;
      this.publish({ save: next, ready: true, issue: null });
      return true;
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
      return false;
    }
  };
  // The pending Start is uncertain for every shared teaching/guidance guard.
  // A queued Start never exposes teaching before its eventual begin/aid ordering.
  begin = async (
    origin: ChallengeOrigin | null,
    boundary: string | null,
    attemptNumber: number,
  ) => {
    if (!this.view.ready || this.view.issue || challenge2Facts(this.view.save).active) return false;
    const generation = ++this.generation;
    this.publish({ ...this.view, ready: false });
    const start = () => {
      if (generation !== this.generation) return false;
      this.view = { ...this.view, ready: true };
      const accepted = this.event({ kind: 'begin', boundary, attemptNumber, origin });
      if (!accepted && !this.view.issue) this.publish({ ...this.view, issue: 'conflict' });
      return accepted;
    };
    try {
      return await (typeof navigator !== 'undefined' && navigator.locks
        ? navigator.locks.request(`${challenge2Key}:begin`, start)
        : start());
    } catch {
      if (generation === this.generation)
        this.publish({ ...this.view, ready: true, issue: 'unsaved' });
      return false;
    }
  };
  recover = () => {
    try {
      if (
        !this.view.ready ||
        !['corrupt', 'unsupported'].includes(this.view.issue ?? '') ||
        this.storage.getItem(challenge2Key) !== this.base
      ) {
        this.changed();
        return false;
      }
      this.storage.removeItem(challenge2Key);
      if (this.storage.getItem(challenge2Key) !== null) throw Error('readback');
      this.base = null;
      this.publish({ save: freshChallenge2(), ready: true, issue: null });
      return true;
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
      return false;
    }
  };
}
