import { chapterKey, restoreChapter } from '../chapter01/persistence';
import type { Request, Receipt } from '../chapter01/model';
import {
  continueEngine,
  execute,
  freshEngine,
  modelVersion,
  parseRequest,
  type Engine,
} from './model';

export const sandboxKey = 'azurelab.sandbox.v2';
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
interface SavedAttempt {
  legacy: string | null;
  attemptNumber: number;
  commands: Request[];
}
interface Save extends SavedAttempt {
  schema: 2;
  model: typeof modelVersion;
  revision: number;
  archive: SavedAttempt[];
}
export interface SandboxView {
  ready: boolean;
  issue: 'corrupt' | 'unsupported' | 'conflict' | 'unsaved' | 'limit' | 'invalid-action' | null;
  attemptNumber: number;
  storeRevision: number;
  attempt: { engine: Engine; events: unknown[]; responses: Receipt[] };
}
const initialSave = (): Save => ({
  schema: 2,
  model: modelVersion,
  revision: 0,
  legacy: null,
  attemptNumber: 1,
  commands: [],
  archive: [],
});
const initialView = (): SandboxView => ({
  ready: false,
  issue: null,
  attemptNumber: 1,
  storeRevision: 0,
  attempt: { engine: freshEngine(), events: [], responses: [] },
});
function restoreAttempt(a: SavedAttempt) {
  if (
    !a ||
    Object.keys(a).sort().join(',') !== 'attemptNumber,commands,legacy' ||
    (a.legacy !== null && typeof a.legacy !== 'string') ||
    !Number.isSafeInteger(a.attemptNumber) ||
    a.attemptNumber < 1 ||
    a.attemptNumber > 100000 ||
    !Array.isArray(a.commands) ||
    a.commands.length > 400
  )
    throw Error('corrupt');
  const old = restoreChapter(a.legacy);
  if (old.status === 'corrupt' || old.status === 'unsupported') throw Error(old.status);
  let engine = continueEngine(old.attempt.engine);
  for (const raw of a.commands) {
    const request = parseRequest(raw);
    if (!request || engine.ledger.some((e) => e.request.commandId === request.commandId))
      throw Error('corrupt');
    const next = execute(engine, request);
    if (next.engine.ledger.length !== engine.ledger.length + 1) throw Error('corrupt');
    engine = next.engine;
  }
  return {
    engine,
    events: [...old.attempt.events, ...a.commands],
    responses: engine.ledger.map((e) => e.receipt),
  };
}
export function restoreSandbox(raw: string) {
  if (raw.length > 1_500_000) throw Error('corrupt');
  const s = JSON.parse(raw) as Save;
  if (!s || s.schema !== 2 || s.model !== modelVersion) throw Error('unsupported');
  if (
    Object.keys(s).sort().join(',') !==
      'archive,attemptNumber,commands,legacy,model,revision,schema' ||
    !Number.isSafeInteger(s.revision) ||
    s.revision < 0 ||
    !Array.isArray(s.archive) ||
    s.archive.length > 1
  )
    throw Error('corrupt');
  for (const a of s.archive) restoreAttempt(a);
  const attempt = restoreAttempt({
    legacy: s.legacy,
    attemptNumber: s.attemptNumber,
    commands: s.commands,
  });
  return { save: s, attempt };
}
export class SandboxStore {
  private view = initialView();
  private server = this.view;
  private save = initialSave();
  private base: string | null = null;
  private listeners = new Set<() => void>();
  constructor(private storage: StoragePort) {}
  getSnapshot = () => this.view;
  getServerSnapshot = () => this.server;
  subscribe = (f: () => void) => {
    this.listeners.add(f);
    return () => {
      this.listeners.delete(f);
    };
  };
  private publish(v: SandboxView) {
    this.view = v;
    this.listeners.forEach((f) => f());
  }
  load = () => {
    try {
      this.storage.getItem(sandboxKey);
    } catch {
      this.publish({ ...this.view, ready: true, issue: 'unsaved' });
      return;
    }
    try {
      this.base = this.storage.getItem(sandboxKey);
      if (this.base === null) {
        const legacy = this.storage.getItem(chapterKey),
          old = restoreChapter(legacy);
        if (!old.snapshot) throw Error(old.status);
        this.save = { ...initialSave(), legacy, attemptNumber: old.snapshot.attemptNumber };
      } else this.save = restoreSandbox(this.base).save;
      const attempt = restoreAttempt({
        legacy: this.save.legacy,
        attemptNumber: this.save.attemptNumber,
        commands: this.save.commands,
      });
      this.publish({
        ready: true,
        issue: null,
        attemptNumber: this.save.attemptNumber,
        storeRevision: this.save.revision,
        attempt,
      });
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
      if (this.storage.getItem(sandboxKey) !== this.base)
        this.publish({ ...this.view, issue: 'conflict' });
    } catch {
      this.publish({ ...this.view, issue: 'unsaved' });
    }
  };
  refreshLegacyIfUncommitted = () => {
    if (this.base === null && this.save.commands.length === 0 && this.view.issue !== 'unsaved')
      this.load();
  };
  private persist(save: Save, attempt: SandboxView['attempt']) {
    try {
      if (this.storage.getItem(sandboxKey) !== this.base) {
        this.publish({ ...this.view, issue: 'conflict' });
        return false;
      }
    } catch {
      /* Best-effort memory mode; never claim durability. */
    }
    if (!Number.isSafeInteger(save.revision) || save.attemptNumber > 100000) {
      this.publish({ ...this.view, issue: 'limit' });
      return false;
    }
    const raw = JSON.stringify(save);
    if (raw.length > 1_500_000) {
      this.publish({ ...this.view, issue: 'limit' });
      return false;
    }
    let issue: SandboxView['issue'] = null;
    try {
      this.storage.setItem(sandboxKey, raw);
      this.base = raw;
    } catch {
      issue = 'unsaved';
    }
    this.save = save;
    this.publish({
      ready: true,
      issue,
      attemptNumber: save.attemptNumber,
      storeRevision: save.revision,
      attempt,
    });
    return true;
  }
  dispatch = (raw: unknown) => {
    if (
      !this.view.ready ||
      ['corrupt', 'unsupported', 'conflict', 'limit'].includes(this.view.issue ?? '')
    )
      return false;
    const value = raw as { kind?: string; request?: unknown };
    const request = value?.kind === 'command' ? parseRequest(value.request) : null;
    if (!request) {
      this.publish({ ...this.view, issue: 'invalid-action' });
      return false;
    }
    const prior = this.view.attempt.engine,
      result = execute(prior, request);
    if (result.engine === prior) {
      if (result.receipt.code === 'command-id-conflict')
        this.publish({
          ...this.view,
          attempt: {
            ...this.view.attempt,
            responses: [...this.view.attempt.responses, result.receipt],
          },
        });
      return true;
    }
    if (this.save.commands.length >= 400) {
      this.publish({ ...this.view, issue: 'limit' });
      return false;
    }
    return this.persist(
      {
        ...this.save,
        revision: this.save.revision + 1,
        commands: [...this.save.commands, request],
      },
      {
        engine: result.engine,
        events: [...this.view.attempt.events, request],
        responses: [...this.view.attempt.responses, result.receipt],
      },
    );
  };
  restart = () => {
    if (!this.view.ready || ['corrupt', 'unsupported', 'conflict'].includes(this.view.issue ?? ''))
      return false;
    const previous = {
      legacy: this.save.legacy,
      commands: this.save.commands,
      attemptNumber: this.save.attemptNumber,
    };
    const next = {
      ...initialSave(),
      revision: this.save.revision + 1,
      attemptNumber: this.save.attemptNumber + 1,
      archive: [previous],
    };
    return this.persist(next, { engine: freshEngine(), events: [], responses: [] });
  };
  exportSnapshot = () => JSON.stringify(this.save, null, 2);
  engineFor = (attemptNumber: number): Engine | undefined => {
    if (attemptNumber === this.view.attemptNumber) return this.view.attempt.engine;
    const archived = this.save.archive.find((a) => a.attemptNumber === attemptNumber);
    return archived ? restoreAttempt(archived).engine : undefined;
  };
  clear = () => {
    this.base = null;
    this.save = initialSave();
    this.publish({ ...initialView(), ready: true });
  };
}
