import {
  challengeBegin,
  challengeOriginKey,
  challengePrefix,
  readChallengeOrigin,
  validChallengeOrigin,
  type ChallengeOrigin,
} from './challenge-origin';
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
    origin?: ChallengeOrigin | null;
    originReady?: boolean;
    originIssue?: 'conflict' | 'unsaved' | null;
    ready: boolean;
    issue: 'corrupt' | 'unsupported' | 'conflict' | 'unsaved' | 'limit' | null;
  } = { save: freshServices(), ready: false, issue: null };
  private base: string | null = null;
  private originBase: string | null = null;
  private originGeneration = 0;
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
      this.originBase = this.storage.getItem(challengeOriginKey);
      this.publish({
        ...restoreServices(this.base),
        ready: true,
        origin: null,
        originReady: false,
      });
      void this.resolveOrigin();
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
    }
  };
  changed = () => {
    ++this.originGeneration;
    try {
      if (this.storage.getItem(serviceLearningKey) !== this.base)
        this.publish({ ...this.view, issue: 'conflict', origin: null, originReady: true });
      else if (this.storage.getItem(challengeOriginKey) !== this.originBase)
        this.publish({ ...this.view, origin: null, originReady: true, originIssue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  event = (raw: unknown) => {
    if (
      !this.view.ready ||
      ['corrupt', 'unsupported', 'conflict', 'limit', 'unsaved'].includes(this.view.issue ?? '')
    )
      return false;
    const next = applyModuleEvent(this.view.save, raw);
    if (!next) {
      if (this.view.save.events.length >= 400) this.publish({ ...this.view, issue: 'limit' });
      return false;
    }
    if (next === this.view.save) return true;
    try {
      if (this.storage.getItem(serviceLearningKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict', origin: null });
        return false;
      }
      const serialized = JSON.stringify(next);
      this.storage.setItem(serviceLearningKey, serialized);
      if (this.storage.getItem(serviceLearningKey) !== serialized) throw Error('readback');
      this.base = serialized;
      if (raw && typeof raw === 'object' && 'kind' in raw && raw.kind === 'begin')
        ++this.originGeneration;
      this.publish({
        ...this.view,
        save: next,
        ready: true,
        issue: null,
        ...(raw && typeof raw === 'object' && 'kind' in raw && raw.kind === 'begin'
          ? { origin: null, originReady: true }
          : {}),
      });
      return true;
    } catch {
      this.publish({ ...this.view, issue: 'unsaved', origin: null });
      return false;
    }
  };

  private resolveOrigin = async () => {
    const generation = ++this.originGeneration;
    const save = this.view.save,
      record = readChallengeOrigin(this.originBase);
    let origin: ChallengeOrigin | null = null;
    try {
      if (
        !this.view.issue &&
        record?.committed &&
        record.begin === challengeBegin(save) &&
        record.prefix === (await challengePrefix(save, record.begin))
      )
        origin = record.origin;
      if (generation === this.originGeneration) {
        if (
          this.storage.getItem(serviceLearningKey) !== this.base ||
          this.storage.getItem(challengeOriginKey) !== this.originBase
        ) {
          this.publish({ ...this.view, origin: null, originReady: true, originIssue: 'conflict' });
        } else this.publish({ ...this.view, origin, originReady: true, originIssue: null });
      }
    } catch {
      if (generation === this.originGeneration)
        this.publish({ ...this.view, origin: null, originReady: true, originIssue: 'unsaved' });
    }
  };
  // Only new explicit challenge starts pin origin. Existing v1 events and replay stay unchanged.
  beginChallenge = async (
    origin: ChallengeOrigin | null,
    boundary: string | null,
    attemptNumber: number,
  ) => {
    const start = async () => {
      if (
        !this.view.ready ||
        this.view.issue ||
        this.view.originIssue ||
        (origin !== null && !validChallengeOrigin(origin))
      )
        return false;
      const save = this.view.save;
      const next = applyModuleEvent(save, { kind: 'begin', boundary, attemptNumber });
      if (!next) {
        if (save.events.length >= 400) this.publish({ ...this.view, issue: 'limit' });
        return false;
      }
      try {
        const prefix = await challengePrefix(next);
        // Recheck after the digest, before either durable write. Stale tabs cannot repin.
        if (
          this.view.save !== save ||
          this.storage.getItem(serviceLearningKey) !== this.base ||
          this.storage.getItem(challengeOriginKey) !== this.originBase
        ) {
          this.publish({ ...this.view, issue: 'conflict', origin: null });
          return false;
        }
        const pending = JSON.stringify({
          schema: 1,
          begin: challengeBegin(next),
          prefix,
          committed: false,
          origin,
        });
        this.storage.setItem(challengeOriginKey, pending);
        if (this.storage.getItem(challengeOriginKey) !== pending) throw Error('origin write');
        const raw = JSON.stringify(next);
        this.storage.setItem(serviceLearningKey, raw);
        if (this.storage.getItem(serviceLearningKey) !== raw) throw Error('begin write');
        this.base = raw;
        const committed = JSON.stringify({ ...JSON.parse(pending), committed: true });
        this.storage.setItem(challengeOriginKey, committed);
        if (
          this.storage.getItem(challengeOriginKey) !== committed ||
          this.storage.getItem(serviceLearningKey) !== raw
        )
          throw Error('commit write');
        this.originBase = committed;
        ++this.originGeneration;
        this.publish({
          save: next,
          ready: true,
          issue: null,
          origin,
          originReady: true,
          originIssue: null,
        });
        return true;
      } catch {
        // No optimistic success. A partial transaction is recovered from the original event log.
        this.publish({
          ...this.view,
          issue: 'unsaved',
          origin: null,
          originReady: true,
          originIssue: 'unsaved',
        });
        return false;
      }
    };
    try {
      return await (typeof navigator !== 'undefined' && navigator.locks
        ? navigator.locks.request(`${serviceLearningKey}:begin`, start)
        : start());
    } catch {
      this.publish({ ...this.view, issue: 'unsaved', origin: null, originReady: true });
      return false;
    }
  };
  clear = () => {
    ++this.originGeneration;
    let issue: typeof this.view.issue = null;
    try {
      this.storage.removeItem(serviceLearningKey);
      this.storage.removeItem(challengeOriginKey);
      this.originBase = null;
      this.base = null;
    } catch {
      issue = 'unsaved';
    }
    this.publish({
      save: freshServices(),
      ready: true,
      issue,
      origin: null,
      originReady: true,
      originIssue: null,
    });
  };
}
