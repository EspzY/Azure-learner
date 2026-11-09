/**
 * Untrusted, stateless demonstration endpoint. The browser owns the entire
 * ephemeral snapshot. No cookie, database, durable evidence or course credit.
 * Execute and inspect with the same versioned Laboratory domain functions.
 */
import { randomUUID } from 'node:crypto';
import {
  canonical,
  execute,
  freshWorld,
  parseRequest,
  replay,
  type Entry,
  type Request as LabRequest,
  type Snapshot,
} from '@/laboratory/engine';
import { limits } from '@/laboratory/v3/contract';
import { laboratoryModel as applicationModel } from '@/laboratory/v38/contract';
import {
  analyseRoutes as applicationRoutes,
  analysePolicy as applicationPolicy,
} from '@/laboratory/v38/analysis';
import { laboratoryModel as topologyModel } from '@/laboratory/v37/contract';
import {
  analyseRoutes as topologyRoutes,
  analysePolicy as topologyPolicy,
} from '@/laboratory/v37/analysis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const maxBytes = 786432;
const envelopeReserve = 8192;
const exact = (
  value: Record<string, unknown>,
  required: readonly string[],
  optional: readonly string[] = [],
) =>
  required.every((key) => Object.hasOwn(value, key)) &&
  Object.keys(value).every((key) => required.includes(key) || optional.includes(key));
class RequestError extends Error {
  constructor(
    public code: string,
    public status = 400,
  ) {
    super(code);
  }
}
function response(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
async function limitedJson(req: Request): Promise<unknown> {
  if (req.headers.get('content-type')?.split(';')[0]?.trim() !== 'application/json')
    throw new RequestError('json-required', 415);
  if (Number(req.headers.get('content-length') ?? 0) > maxBytes)
    throw new RequestError('request-too-large', 413);
  const reader = req.body?.getReader();
  if (!reader) throw new RequestError('invalid-request');
  let length = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const part = await reader.read();
    if (part.done) break;
    length += part.value.byteLength;
    if (length > maxBytes) {
      await reader.cancel();
      throw new RequestError('request-too-large', 413);
    }
    chunks.push(part.value);
  }
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
  } catch {
    throw new RequestError('invalid-json');
  }
}
const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown, max = 80): value is string =>
  typeof value === 'string' && value.length > 0 && value.length <= max;
function verified(value: unknown): Snapshot {
  if (
    !object(value) ||
    !exact(value, ['workspace', 'world', 'entries', 'historical']) ||
    !text(value.workspace, 36) ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      value.workspace,
    ) ||
    value.historical !== false ||
    !object(value.world) ||
    typeof value.world.model !== 'string' ||
    ![topologyModel, applicationModel].includes(value.world.model) ||
    !Array.isArray(value.entries) ||
    value.entries.length > limits.events
  )
    throw new RequestError('invalid-snapshot', 422);
  const world = value.world as unknown as Snapshot['world'];
  const entries = value.entries as Entry[];
  // All historical assertions are re-executed under their original model.
  if (
    entries.some(
      (item) =>
        !object(item) ||
        !exact(item, ['model', 'attempt', 'request', 'receipt']) ||
        item.model !== world.model,
    )
  )
    throw new RequestError('unverifiable-history', 422);
  try {
    const original = replay(entries, world.model);
    if (!original || canonical(original) !== canonical(world))
      throw new RequestError('unverifiable-history', 422);
  } catch {
    throw new RequestError('unverifiable-history', 422);
  }
  return { workspace: value.workspace, world, entries, historical: false };
}
function owned(snapshot: Snapshot, workspace: unknown) {
  if (workspace !== snapshot.workspace) throw new RequestError('workspace-changed', 409);
}
function command(raw: unknown) {
  const request = parseRequest(raw);
  if (!request) throw new RequestError('invalid-request');
  return request;
}
function analysis(snapshot: Snapshot, values: unknown, kind: 'analysis' | 'policy-analysis') {
  if (!object(values)) throw new RequestError('invalid-query');
  const world = snapshot.world;
  if (kind === 'analysis') {
    if (
      !exact(values, ['subnetId', 'destination']) ||
      !text(values.subnetId) ||
      !text(values.destination, 15)
    )
      throw new RequestError('invalid-query');
    const result =
      world.model === applicationModel
        ? applicationRoutes(world, values.subnetId, values.destination)
        : topologyRoutes(
            world as Extract<Snapshot['world'], { model: typeof topologyModel }>,
            values.subnetId,
            values.destination,
          );
    if (!result) throw new RequestError('unsupported-model', 422);
    if (!result.ok) throw new RequestError(result.code, 422);
    return response({
      ...snapshot,
      analysis: {
        ...result.analysis,
        model: world.model,
        workspace: snapshot.workspace,
      },
    });
  }
  const keys = [
    'sourceNicId',
    'destinationNicId',
    'protocol',
    'sourcePort',
    'destinationPort',
  ] as const;
  if (!exact(values, keys) || keys.some((k) => !text(values[k], k.endsWith('NicId') ? 80 : 10)))
    throw new RequestError('invalid-query');
  const packet = {
    sourceNicId: values.sourceNicId as string,
    destinationNicId: values.destinationNicId as string,
    protocol: values.protocol as string,
    sourcePort: values.sourcePort as string,
    destinationPort: values.destinationPort as string,
  };
  const result =
    world.model === applicationModel
      ? applicationPolicy(world, packet)
      : topologyPolicy(
          world as Extract<Snapshot['world'], { model: typeof topologyModel }>,
          packet,
        );
  if (!result) throw new RequestError('unsupported-model', 422);
  if (!result.ok) throw new RequestError(result.code, 422);
  return response({
    ...snapshot,
    analysis: {
      ...result.analysis,
      model: world.model,
      workspace: snapshot.workspace,
    },
  });
}
export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin');
    const incoming = new URL(req.url);
    // Next can use an internal URL host. The HTTP Host identifies the actual
    // browser-facing route; never trust an arbitrary forwarded-host override.
    if (incoming.search || incoming.hash) throw new RequestError('invalid-query');
    const host = req.headers.get('host') ?? incoming.host;
    let allowed = false;
    try {
      const source = new URL(origin ?? '');
      allowed =
        source.origin === origin &&
        source.host === host &&
        (source.protocol === 'https:' ||
          (source.protocol === 'http:' &&
            ['127.0.0.1', 'localhost', '[::1]'].includes(source.hostname)));
    } catch {
      /* malformed or missing origin */
    }
    if (!allowed || !['same-origin', 'none', null].includes(req.headers.get('sec-fetch-site')))
      throw new RequestError('origin-denied', 403);
    const value = await limitedJson(req);
    if (!object(value) || !text(value.action, 24)) throw new RequestError('invalid-request');
    const action = value.action;
    const shapes: Record<string, readonly string[]> = {
      session: ['action'],
      state: ['action', 'snapshot', 'workspace'],
      review: ['action', 'snapshot', 'workspace', 'request'],
      command: ['action', 'snapshot', 'workspace', 'request'],
      analysis: ['action', 'snapshot', 'workspace', 'values'],
      'policy-analysis': ['action', 'snapshot', 'workspace', 'values'],
    };
    const fields = Object.hasOwn(shapes, action) ? shapes[action] : undefined;
    if (
      !fields ||
      !exact(
        value,
        fields,
        action === 'session' ? ['model'] : action === 'state' ? ['through'] : [],
      )
    )
      throw new RequestError('invalid-request');
    if (action === 'session') {
      if (
        value.model !== undefined &&
        (typeof value.model !== 'string' ||
          ![topologyModel, applicationModel].includes(value.model))
      )
        throw new RequestError('unsupported-model', 422);
      return response(
        {
          workspace: randomUUID(),
          world: freshWorld(value.model === applicationModel ? applicationModel : topologyModel),
          entries: [],
          historical: false,
        },
        201,
      );
    }
    const snapshot = verified(value.snapshot);
    owned(snapshot, value.workspace);
    if (action === 'state') {
      if (value.through === undefined) return response(snapshot);
      if (
        !Number.isInteger(value.through) ||
        (value.through as number) < 0 ||
        (value.through as number) > snapshot.entries.length
      )
        throw new RequestError('invalid-through');
      const through = value.through as number;
      const world = replay(snapshot.entries, snapshot.world.model, through);
      if (!world) throw new RequestError('unverifiable-history', 422);
      return response({
        ...snapshot,
        world,
        entries: snapshot.entries.slice(0, through),
        historical: through !== snapshot.entries.length,
      });
    }
    if (action === 'analysis' || action === 'policy-analysis')
      return analysis(snapshot, value.values, action);
    const request: LabRequest = command(value.request);
    if (action === 'review')
      return response({
        workspace: snapshot.workspace,
        preview: execute(snapshot.world, request, snapshot.entries.length + 1).receipt,
        revision: snapshot.world.revision,
      });
    const original = snapshot.entries.find(
      (entry) => entry.request.commandId === request.commandId,
    );
    if (original) {
      if (canonical(original.request) !== canonical(request))
        throw new RequestError('command-id-conflict', 409);
      return response({ ...snapshot, receipt: original.receipt, redelivered: true });
    }
    if (
      snapshot.entries.length >=
      limits.events - (request.command.type === 'ResetWorkspace' ? 0 : 1)
    )
      throw new RequestError('history-limit', 409);
    const next = execute(snapshot.world, request, snapshot.entries.length + 1);
    const entry: Entry = {
      model: snapshot.world.model,
      attempt: snapshot.world.attempt,
      request,
      receipt: next.receipt,
    };
    const updated = { ...snapshot, world: next.world, entries: [...snapshot.entries, entry] };
    if (
      Buffer.byteLength(JSON.stringify(updated), 'utf8') >
      maxBytes - (request.command.type === 'ResetWorkspace' ? 4096 : envelopeReserve)
    )
      throw new RequestError('history-limit', 409);
    return response(
      { ...updated, receipt: next.receipt, redelivered: false },
      next.receipt.outcome === 'accepted' ? 200 : 422,
    );
  } catch (e) {
    if (e instanceof RequestError) return response({ error: e.code }, e.status);
    // An untrusted, memory-only payload must never expose exception details.
    return response({ error: 'server-result-unavailable' }, 503);
  }
}
