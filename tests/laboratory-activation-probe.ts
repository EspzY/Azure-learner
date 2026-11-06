/**
 * PR59 TEST-ONLY counterexample harness. Not imported by the application.
 * A green reproduction proves a candidate protocol INSUFFICIENT, not safe.
 * No Storage handlers, v3 World or production activation are registered here.
 */
import { chapterKey } from '../src/domain/chapter01/persistence';
import { SandboxStore, sandboxKey, type StoragePort } from '../src/domain/sandbox/store';

export const probeKey = 'azurelab.sandbox.v3';
export const probeModel = 'sandbox@3.0.0';
export interface Checkpoint {
  schema: 3;
  model: typeof probeModel;
  phase: 'prepared' | 'active-probe';
  epoch: string;
  sourceV2: string | null;
  sourceChapter: string | null;
  attemptNumber: number;
  // Exact authoritative old snapshot, not a reconstructed resource inventory.
  original: string;
}
export type ProbeResult =
  | { status: 'no-v3' | 'blocked'; reason: string }
  | { status: 'candidate-accepts'; checkpoint: Checkpoint };
const exactKeys = 'attemptNumber,epoch,model,original,phase,schema,sourceChapter,sourceV2';
function read(storage: StoragePort): Checkpoint | null {
  const raw = storage.getItem(probeKey);
  if (raw === null) return null;
  if (raw.length > 3_200_000) throw Error('corrupt');
  const value = JSON.parse(raw) as Checkpoint;
  if (value?.schema !== 3 || value?.model !== probeModel) throw Error('unsupported');
  if (
    Object.keys(value).sort().join(',') !== exactKeys ||
    !['prepared', 'active-probe'].includes(value.phase) ||
    !/^[a-zA-Z0-9_-]{1,64}$/.test(value.epoch) ||
    !Number.isSafeInteger(value.attemptNumber) ||
    value.attemptNumber < 1 ||
    value.attemptNumber > 100000 ||
    typeof value.original !== 'string' ||
    ![value.sourceV2, value.sourceChapter].every((s) => s === null || typeof s === 'string')
  )
    throw Error('corrupt');
  const restorePort: StoragePort = {
    getItem: (key) =>
      key === sandboxKey ? value.sourceV2 : key === chapterKey ? value.sourceChapter : null,
    setItem: () => {
      throw Error('read-only');
    },
    removeItem: () => {
      throw Error('read-only');
    },
  };
  const old = new SandboxStore(restorePort);
  old.load();
  if (
    old.getSnapshot().issue ||
    old.exportSnapshot() !== value.original ||
    old.getSnapshot().attemptNumber !== value.attemptNumber
  )
    throw Error('invalid-source');
  return value;
}
function sourceMatches(storage: StoragePort, value: Checkpoint) {
  return (
    storage.getItem(sandboxKey) === value.sourceV2 &&
    // Once v2 exists its own embedded legacy is authoritative; unrelated old
    // Chapter writes must not silently rebase it or invalidate its original prefix.
    (value.sourceV2 !== null || storage.getItem(chapterKey) === value.sourceChapter)
  );
}
export function inspectCandidate(storage: StoragePort): ProbeResult {
  try {
    const value = read(storage);
    if (!value) return { status: 'no-v3', reason: 'explicit preparation required' };
    if (!sourceMatches(storage, value)) return { status: 'blocked', reason: 'source-conflict' };
    if (value.phase !== 'active-probe') return { status: 'blocked', reason: 'prepared-recovery' };
    return { status: 'candidate-accepts', checkpoint: value };
  } catch (e) {
    return { status: 'blocked', reason: e instanceof Error ? e.message : 'unreadable' };
  }
}
/** Call only under a test Web Lock. This does not authorize production activation. */
export function prepareCandidate(storage: StoragePort, epoch: string, learningSafe: boolean) {
  if (!learningSafe || !/^[a-zA-Z0-9_-]{1,64}$/.test(epoch)) return false;
  try {
    if (storage.getItem(probeKey) !== null) return false;
    const sourceV2 = storage.getItem(sandboxKey);
    const sourceChapter = sourceV2 === null ? storage.getItem(chapterKey) : null;
    const old = new SandboxStore(storage);
    old.load();
    if (!old.getSnapshot().ready || old.getSnapshot().issue) return false;
    const value: Checkpoint = {
      schema: 3,
      model: probeModel,
      phase: 'prepared',
      epoch,
      sourceV2,
      sourceChapter,
      attemptNumber: old.getSnapshot().attemptNumber,
      original: old.exportSnapshot(),
    };
    if (!sourceMatches(storage, value) || storage.getItem(probeKey) !== null) return false;
    const raw = JSON.stringify(value);
    if (raw.length > 3_200_000) return false;
    storage.setItem(probeKey, raw);
    return storage.getItem(probeKey) === raw && sourceMatches(storage, value);
  } catch {
    return false;
  }
}
export function activateCandidate(storage: StoragePort, learningSafe: boolean) {
  if (!learningSafe) return false;
  try {
    const before = storage.getItem(probeKey);
    const value = read(storage);
    if (
      !value ||
      value.phase !== 'prepared' ||
      !sourceMatches(storage, value) ||
      storage.getItem(probeKey) !== before
    )
      return false;
    const raw = JSON.stringify({ ...value, phase: 'active-probe' });
    storage.setItem(probeKey, raw);
    return storage.getItem(probeKey) === raw && sourceMatches(storage, value);
  } catch {
    return false;
  }
}
