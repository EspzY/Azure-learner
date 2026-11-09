'use client';
/** Memory is this document's only workspace authority. The stateless server
 * replays the original engine, but provides no durable/assessment attestation. */
import type {
  Model,
  Request as LabRequest,
  Snapshot,
  CommandResult,
  Receipt,
} from '@/laboratory/engine';

let current: Snapshot | null = null;
let generation = 0;
let writes: Promise<void> = Promise.resolve();
const clone = (s: Snapshot) => structuredClone(s);
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
function validSnapshot(v: unknown): v is Snapshot & Record<string, unknown> {
  return (
    object(v) &&
    typeof v.workspace === 'string' &&
    object(v.world) &&
    typeof v.world.model === 'string' &&
    ['laboratory@3.7.0', 'laboratory@3.8.0'].includes(v.world.model) &&
    Number.isSafeInteger(v.world.revision) &&
    Array.isArray(v.entries) &&
    typeof v.historical === 'boolean'
  );
}
async function post(action: string, payload: Record<string, unknown>) {
  let response: Response, value: unknown;
  try {
    response = await fetch('/api/laboratory/ephemeral', {
      method: 'POST',
      cache: 'no-store',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
    });
    value = await response.json();
  } catch {
    throw Error('server-result-unavailable');
  }
  if (!object(value)) throw Error('server-result-unavailable');
  if (typeof value.error === 'string') throw Error(value.error);
  if (
    !response.ok &&
    !(
      response.status === 422 &&
      object(value.receipt) &&
      ['rejected', 'denied', 'unsupported'].includes(String(value.receipt.outcome))
    )
  )
    throw Error('server-result-unavailable');
  return value;
}
export function ephemeralActive() {
  return current !== null;
}
export async function startEphemeral(model: Model = 'laboratory@3.7.0'): Promise<Snapshot> {
  if (!['laboratory@3.7.0', 'laboratory@3.8.0'].includes(model)) throw Error('unsupported-model');
  const token = ++generation;
  const snapshot = await post('session', { model });
  if (token !== generation) throw Error('workspace-changed');
  if (!validSnapshot(snapshot) || snapshot.world.revision !== 0 || snapshot.entries.length !== 0)
    throw Error('server-result-unavailable');
  current = clone(snapshot);
  return clone(current);
}
type ReviewResult = { workspace: string; revision: number; preview: Receipt };
export function ephemeralApi(
  action: 'command',
  request: LabRequest,
  workspace?: string,
): Promise<CommandResult>;
export function ephemeralApi(action: 'state' | `state?${string}`): Promise<Snapshot>;
export function ephemeralApi(
  action: string,
  request?: unknown,
  workspace?: string,
): Promise<Snapshot | CommandResult | ReviewResult>;
export async function ephemeralApi(
  actionWithQuery: string,
  request?: unknown,
  workspace?: string,
): Promise<Snapshot | CommandResult | ReviewResult> {
  if (!current) throw Error('session-required');
  const [action, query] = actionWithQuery.split('?');
  if (action === 'session') {
    const value = (request ?? {}) as { model?: Model; newWorkspace?: boolean };
    return value.newWorkspace ? startEphemeral(value.model) : clone(current);
  }
  if (workspace && workspace !== current.workspace) throw Error('workspace-changed');
  if (action === 'state') {
    if (!query) return clone(current);
    const params = new URLSearchParams(query);
    if (
      params.size !== 1 ||
      !params.has('through') ||
      !/^(0|[1-9][0-9]*)$/.test(params.get('through') ?? '')
    )
      throw Error('invalid-through');
    const value = await post('state', {
      snapshot: current,
      workspace: current.workspace,
      through: Number(params.get('through')),
    });
    if (!validSnapshot(value) || value.workspace !== current.workspace)
      throw Error('server-result-unavailable');
    return value;
  }
  if (action === 'review') {
    const value = await post('review', {
      snapshot: current,
      workspace: workspace ?? current.workspace,
      request,
    });
    if (
      value.workspace !== current.workspace ||
      !Number.isSafeInteger(value.revision) ||
      !object(value.preview)
    )
      throw Error('server-result-unavailable');
    return value as ReviewResult;
  }
  if (action !== 'command') throw Error('invalid-request');
  const token = generation;
  const task = writes.then(async () => {
    const snapshot = current;
    if (!snapshot || token !== generation || (workspace && snapshot.workspace !== workspace))
      throw Error('workspace-changed');
    const result = await post('command', {
      snapshot,
      workspace: workspace ?? snapshot.workspace,
      request: request as LabRequest,
    });
    if (generation !== token || current?.workspace !== snapshot.workspace)
      throw Error('workspace-changed');
    if (
      !validSnapshot(result) ||
      result.workspace !== snapshot.workspace ||
      !object(result.receipt) ||
      result.receipt.commandId !== (request as LabRequest).commandId ||
      result.entries.length !== snapshot.entries.length + (result.redelivered === true ? 0 : 1)
    )
      throw Error('server-result-unavailable');
    current = clone({
      workspace: result.workspace,
      world: result.world,
      entries: result.entries,
      historical: false,
    });
    return result as unknown as CommandResult;
  });
  writes = task.then(
    () => undefined,
    () => undefined,
  );
  return task;
}
/** Same frozen analysis, selected by the explicitly active workspace adapter. */
export async function requestLaboratoryAnalysis(
  kind: 'analysis' | 'policy-analysis',
  params: URLSearchParams,
  workspace: string,
) {
  if (current) {
    if (current.workspace !== workspace) throw Error('workspace-changed');
    return post(kind, { snapshot: current, workspace, values: Object.fromEntries(params) });
  }
  const response = await fetch('/api/laboratory/' + kind + '?' + params, {
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { 'If-Laboratory-Workspace': workspace },
  });
  const value = await response.json();
  if (!response.ok || value.error) throw Error(value.error ?? 'server-result-unavailable');
  return value;
}
