'use client';
/**
 * Deliberately memory-only Laboratory session. No localStorage, IndexedDB or
 * cookies. Server checks every command against replayed versioned history, but
 * the browser owns the evidence: never use it for course credit or attestation.
 */
import type { Model, Request as LabRequest, Snapshot } from '@/laboratory/engine';

let current: Snapshot | null = null;
let writes: Promise<void> = Promise.resolve();

async function post(action: string, payload: Record<string, unknown>) {
  const response = await fetch('/api/laboratory/ephemeral', {
    method: 'POST',
    cache: 'no-store',
    credentials: 'omit',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
  const value = await response.json();
  if (value.error) throw Error(value.error);
  // Domain rejection can still carry the original rejected receipt.
  return value;
}
export function ephemeralActive() {
  return current !== null;
}
export async function startEphemeral(model: Model): Promise<Snapshot> {
  const snapshot = (await post('session', { model })) as Snapshot;
  current = snapshot;
  return snapshot;
}
export async function ephemeralApi(
  actionWithQuery: string,
  request?: unknown,
  workspace?: string,
) {
  if (!current) throw Error('session-required');
  const [action, query] = actionWithQuery.split('?');
  if (action === 'session') {
    const value = (request ?? {}) as { model?: Model; newWorkspace?: boolean };
    return value.newWorkspace ? startEphemeral(value.model ?? 'laboratory@3.7.0') : current;
  }
  if (workspace && workspace !== current.workspace) throw Error('workspace-changed');
  if (action === 'state') {
    if (!query) return current;
    const params = new URLSearchParams(query);
    if (params.size !== 1 || !params.has('through') || !/^(0|[1-9][0-9]*)$/.test(params.get('through') ?? ''))
      throw Error('invalid-through');
    return post('state', { snapshot: current, workspace: current.workspace,
      through: Number(params.get('through')) });
  }
  if (action === 'review')
    return post('review', { snapshot: current, workspace: workspace ?? current.workspace, request });
  if (action !== 'command') throw Error('invalid-request');

  const task = writes.then(async () => {
    const snapshot = current;
    if (!snapshot || (workspace && snapshot.workspace !== workspace))
      throw Error('workspace-changed');
    const result = await post('command', {
      snapshot, workspace: workspace ?? snapshot.workspace, request: request as LabRequest,
    });
    if (current?.workspace !== snapshot.workspace) throw Error('workspace-changed');
    current = { workspace: result.workspace, world: result.world,
      entries: result.entries, historical: false };
    return result;
  });
  writes = task.then(() => undefined, () => undefined);
  return task;
}

/** Same response shape as the existing analysis GETs, with no database writes. */
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
