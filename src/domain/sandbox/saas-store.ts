import { executeSaas, freshSaas, saasKey, type SaasEngine } from './saas';
import { parseRequest, type Request } from '../chapter01/model';
import type { StoragePort } from './store';
interface Save {
  schema: 1;
  model: 'fictional-admin@1';
  attempt: number;
  revision: number;
  commands: Request[];
  archive: Request[][];
}
const initial = (): Save => ({
  schema: 1,
  model: 'fictional-admin@1',
  attempt: 1,
  revision: 0,
  commands: [],
  archive: [],
});
function replay(commands: unknown): SaasEngine {
  if (!Array.isArray(commands) || commands.length > 400) throw Error('corrupt');
  let e = freshSaas();
  for (const raw of commands) {
    const r = parseRequest(raw);
    if (!r || e.ledger.some((entry) => entry.request.commandId === r.commandId))
      throw Error('corrupt');
    e = executeSaas(e, r).engine;
  }
  return e;
}
export function restoreSaas(raw: string) {
  if (raw.length > 500000) throw Error('corrupt');
  const save = JSON.parse(raw) as Save;
  if (!save || save.schema !== 1 || save.model !== 'fictional-admin@1') throw Error('unsupported');
  if (
    Object.keys(save).sort().join(',') !== 'archive,attempt,commands,model,revision,schema' ||
    !Number.isSafeInteger(save.attempt) ||
    save.attempt < 1 ||
    save.attempt > 100000 ||
    !Number.isSafeInteger(save.revision) ||
    save.revision < 0 ||
    !Array.isArray(save.archive) ||
    save.archive.length > 1
  )
    throw Error('corrupt');
  save.archive.forEach(replay);
  return { save, engine: replay(save.commands) };
}
export class SaasStore {
  private save = initial();
  private base: string | null = null;
  private view: { ready: boolean; engine: SaasEngine; attempt: number; issue: string | null } = {
    ready: false,
    engine: freshSaas(),
    attempt: 1,
    issue: null,
  };
  private server = this.view;
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
  private publish(engine: SaasEngine, issue: string | null = null) {
    this.view = { ready: true, engine, attempt: this.save.attempt, issue };
    this.listeners.forEach((f) => f());
  }
  load = () => {
    let raw: string | null;
    try {
      raw = this.port.getItem(saasKey);
    } catch {
      this.publish(this.view.engine, 'unsaved');
      return;
    }
    this.base = raw;
    try {
      const restored = raw === null ? { save: initial(), engine: freshSaas() } : restoreSaas(raw);
      this.save = restored.save;
      this.publish(restored.engine);
    } catch (e) {
      this.publish(
        this.view.engine,
        e instanceof Error && e.message === 'unsupported' ? 'unsupported' : 'corrupt',
      );
    }
  };
  changed = () => {
    try {
      if (this.port.getItem(saasKey) !== this.base) this.publish(this.view.engine, 'conflict');
    } catch {
      this.publish(this.view.engine, 'unsaved');
    }
  };
  private persist(save: Save, engine: SaasEngine) {
    try {
      if (this.port.getItem(saasKey) !== this.base) {
        this.publish(this.view.engine, 'conflict');
        return false;
      }
    } catch {
      /* memory mode */
    }
    if (!Number.isSafeInteger(save.revision) || save.attempt > 100000) {
      this.publish(this.view.engine, 'limit');
      return false;
    }
    let issue = null;
    const raw = JSON.stringify(save);
    if (raw.length > 500000) {
      this.publish(this.view.engine, 'limit');
      return false;
    }
    try {
      this.port.setItem(saasKey, raw);
      this.base = raw;
    } catch {
      issue = 'unsaved';
    }
    this.save = save;
    this.publish(engine, issue);
    return true;
  }
  dispatch = (r: Request) => {
    if (!this.view.ready || (this.view.issue && this.view.issue !== 'unsaved')) return false;
    const result = executeSaas(this.view.engine, r);
    if (result.engine === this.view.engine) return false;
    return this.persist(
      { ...this.save, revision: this.save.revision + 1, commands: [...this.save.commands, r] },
      result.engine,
    );
  };
  restart = () => {
    if (!this.view.ready || (this.view.issue && this.view.issue !== 'unsaved')) return false;
    return this.persist(
      {
        ...initial(),
        attempt: this.save.attempt + 1,
        revision: this.save.revision + 1,
        archive: [this.save.commands],
      },
      freshSaas(),
    );
  };
  clear = () => {
    this.save = initial();
    this.base = null;
    this.publish(freshSaas());
  };
  exportSnapshot = () => JSON.stringify(this.save, null, 2);
  engineFor = (attempt: number): SaasEngine | undefined => {
    if (attempt === this.save.attempt) return this.view.engine;
    const archived = this.save.archive[0];
    return attempt === this.save.attempt - 1 && archived ? replay(archived) : undefined;
  };
}
