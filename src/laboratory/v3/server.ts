import { laboratoryModel as firewallModel } from '../v35/contract';
import { laboratoryModel as remediationModel } from '../v36/contract';
import {
  analyseRoutes as analyseRemediationRoutes,
  analysePolicy as analyseRemediationPolicy,
} from '../v36/analysis';
import {
  analyseRoutes as analyseFirewallRoutes,
  analysePolicy as analyseFirewallPolicy,
} from '../v35/analysis';
import { laboratoryModel as computeModel } from '../v34/contract';
import {
  analyseRoutes as analyseComputeRoutes,
  analysePolicy as analyseComputePolicy,
} from '../v34/analysis';
import 'server-only';
import { Pool } from 'pg';
import { Repository, LabError } from './repository';
import { parseRequest, models, type Model } from '../engine';
import { laboratoryModel as routingModel } from '../v32/contract';
import { analyseRoutes } from '../v32/analysis';
import { laboratoryModel as endpointModel } from '../v33/contract';
import { analyseRoutes as analyseEndpointRoutes } from '../v33/route';
import { analysePolicy } from '../v33/policy';
let pool: Pool | undefined;
function config() {
  const connectionString = process.env.LAB_DATABASE_URL,
    raw = process.env.LAB_ORIGIN;
  if (!connectionString || !raw) throw new LabError('backend-unavailable', 503);
  const origin = new URL(raw),
    db = new URL(connectionString);
  if (
    origin.origin !== raw ||
    !['http:', 'https:'].includes(origin.protocol) ||
    (origin.protocol !== 'https:' &&
      !['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname)) ||
    !['postgres:', 'postgresql:'].includes(db.protocol) ||
    !/^\/azurelab_lab_[a-z0-9_]+$/.test(db.pathname) ||
    db.username !== 'laboratory_v3_app'
  )
    throw new LabError('backend-unavailable', 503);
  if (
    !['localhost', '127.0.0.1', '[::1]'].includes(db.hostname) &&
    db.searchParams.get('sslmode') !== 'verify-full'
  )
    throw new LabError('backend-unavailable', 503);
  return {
    connectionString,
    origin: origin.origin,
    secure: origin.protocol === 'https:',
    cookie: origin.protocol === 'https:' ? '__Host-azurelab_lab_v3' : 'azurelab_lab_v3',
  };
}
function token(req: Request, name: string) {
  const values = (req.headers.get('cookie') ?? '')
    .split(';')
    .map((v) => v.trim())
    .filter((v) => v.startsWith(name + '='));
  if (values.length !== 1) return '';
  return values[0]!.slice(name.length + 1);
}
function json(value: unknown, status = 200, cookie?: string) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      Vary: 'Cookie',
      'X-Content-Type-Options': 'nosniff',
      ...(cookie ? { 'Set-Cookie': cookie } : {}),
    },
  });
}
async function body(req: Request) {
  if (req.headers.get('content-type')?.split(';')[0]?.trim() !== 'application/json')
    throw new LabError('json-required', 415);
  if (Number(req.headers.get('content-length') ?? 0) > 4096)
    throw new LabError('request-too-large', 413);
  const reader = req.body?.getReader();
  if (!reader) throw new LabError('invalid-request', 400);
  let length = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const next = await reader.read();
    if (next.done) break;
    length += next.value.byteLength;
    if (length > 4096) {
      await reader.cancel();
      throw new LabError('request-too-large', 413);
    }
    chunks.push(next.value);
  }
  try {
    return JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)),
    ) as unknown;
  } catch {
    throw new LabError('invalid-json', 400);
  }
}
export async function handle(
  req: Request,
  action: 'session' | 'state' | 'review' | 'command' | 'analysis' | 'policy-analysis',
) {
  try {
    const cfg = config(),
      origin = req.headers.get('origin'),
      site = req.headers.get('sec-fetch-site');
    if (
      (req.method !== 'GET' && origin !== cfg.origin) ||
      (origin !== null && origin !== cfg.origin) ||
      site === 'cross-site'
    )
      throw new LabError('origin-denied', 403);
    const url = new URL(req.url);
    const queryKeys =
      action === 'state'
        ? ['through']
        : action === 'analysis'
          ? ['subnetId', 'destination']
          : action === 'policy-analysis'
            ? ['sourceNicId', 'destinationNicId', 'protocol', 'sourcePort', 'destinationPort']
            : [];
    if (
      [...url.searchParams.keys()].some((k) => !queryKeys.includes(k)) ||
      queryKeys.some((k) => url.searchParams.getAll(k).length > 1)
    )
      throw new LabError('invalid-query', 400);
    if (!pool) {
      pool = new Pool({
        connectionString: cfg.connectionString,
        max: 5,
        connectionTimeoutMillis: 3000,
        idleTimeoutMillis: 10000,
        allowExitOnIdle: true,
      });
      pool.on('error', () => {
        console.error('Laboratory database connection unavailable');
      });
    }
    const repo = new Repository(pool);
    const session = token(req, cfg.cookie);
    if (action === 'session') {
      const value = await body(req);
      if (
        !value ||
        typeof value !== 'object' ||
        Array.isArray(value) ||
        Object.keys(value).some((k) => !['newWorkspace', 'model'].includes(k)) ||
        ('newWorkspace' in value && value.newWorkspace !== true) ||
        ('model' in value && !models.includes(value.model as Model))
      )
        throw new LabError('invalid-request', 400);
      if (session && !('newWorkspace' in value)) {
        try {
          return json(await repo.read(session));
        } catch (e) {
          if (!(e instanceof LabError) || e.code !== 'session-required') throw e;
        }
      }
      const created = await repo.createSession(
        'model' in value ? (value.model as Model) : undefined,
      );
      return json(
        created.snapshot,
        201,
        `${cfg.cookie}=${created.token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800${cfg.secure ? '; Secure' : ''}`,
      );
    }
    if (!/^[A-Za-z0-9_-]{43}$/.test(session)) throw new LabError('session-required', 401);
    if (action === 'state') {
      const value = url.searchParams.get('through');
      if (value !== null && !/^(0|[1-9][0-9]{0,3})$/.test(value))
        throw new LabError('invalid-through', 400);
      return json(await repo.read(session, value === null ? undefined : Number(value)));
    }
    if (action === 'analysis') {
      const subnetId = url.searchParams.get('subnetId'),
        destination = url.searchParams.get('destination');
      if (!subnetId || subnetId.length > 80 || !destination || destination.length > 15)
        throw new LabError('invalid-query', 400);
      const snapshot = await repo.read(session);
      if (req.headers.get('If-Laboratory-Workspace') !== snapshot.workspace)
        throw new LabError('workspace-changed', 409);
      if (
        snapshot.world.model !== routingModel &&
        snapshot.world.model !== endpointModel &&
        snapshot.world.model !== computeModel &&
        snapshot.world.model !== firewallModel &&
        snapshot.world.model !== remediationModel
      )
        throw new LabError('unsupported-model', 422);
      const result =
        snapshot.world.model === routingModel
          ? analyseRoutes(snapshot.world, subnetId, destination)
          : snapshot.world.model === endpointModel
            ? analyseEndpointRoutes(snapshot.world, subnetId, destination)
            : snapshot.world.model === computeModel
              ? analyseComputeRoutes(snapshot.world, subnetId, destination)
              : snapshot.world.model === firewallModel
                ? analyseFirewallRoutes(snapshot.world, subnetId, destination)
                : analyseRemediationRoutes(snapshot.world, subnetId, destination);
      if (!result.ok) throw new LabError(result.code, 422);
      return json({
        ...snapshot,
        analysis:
          snapshot.world.model === firewallModel || snapshot.world.model === remediationModel
            ? { ...result.analysis, workspace: snapshot.workspace }
            : result.analysis,
      });
    }
    if (action === 'policy-analysis') {
      const values = Object.fromEntries(queryKeys.map((k) => [k, url.searchParams.get(k)]));
      if (queryKeys.some((k) => !values[k] || values[k]!.length > (k.endsWith('NicId') ? 80 : 10)))
        throw new LabError('invalid-query', 400);
      const snapshot = await repo.read(session);
      if (req.headers.get('If-Laboratory-Workspace') !== snapshot.workspace)
        throw new LabError('workspace-changed', 409);
      if (
        snapshot.world.model !== endpointModel &&
        snapshot.world.model !== computeModel &&
        snapshot.world.model !== firewallModel &&
        snapshot.world.model !== remediationModel
      )
        throw new LabError('unsupported-model', 422);
      const input = {
        sourceNicId: values.sourceNicId!,
        destinationNicId: values.destinationNicId!,
        protocol: values.protocol!,
        sourcePort: values.sourcePort!,
        destinationPort: values.destinationPort!,
      };
      const result =
        snapshot.world.model === endpointModel
          ? analysePolicy(snapshot.world, input)
          : snapshot.world.model === computeModel
            ? analyseComputePolicy(snapshot.world, input)
            : snapshot.world.model === firewallModel
              ? analyseFirewallPolicy(snapshot.world, input)
              : analyseRemediationPolicy(snapshot.world, input);
      if (!result.ok) throw new LabError(result.code, 422);
      return json({
        ...snapshot,
        analysis:
          snapshot.world.model === firewallModel || snapshot.world.model === remediationModel
            ? { ...result.analysis, workspace: snapshot.workspace }
            : result.analysis,
      });
    }
    const request = parseRequest(await body(req));
    if (!request) throw new LabError('invalid-request', 400);
    const expectedWorkspace = req.headers.get('If-Laboratory-Workspace');
    if (!expectedWorkspace || !/^[a-f0-9-]{36}$/.test(expectedWorkspace))
      throw new LabError('workspace-precondition-required', 400);
    if (action === 'review') return json(await repo.review(session, request, expectedWorkspace));
    const result = await repo.command(session, request, expectedWorkspace);
    return json(
      result,
      result.receipt.outcome === 'accepted'
        ? 200
        : result.receipt.code === 'stale-revision'
          ? 409
          : 422,
    );
  } catch (e) {
    if (e instanceof LabError) return json({ error: e.code }, e.status);
    if (
      e &&
      typeof e === 'object' &&
      'code' in e &&
      ['55P03', '40001', '40P01'].includes(String(e.code))
    )
      return json({ error: 'concurrent-request' }, 409);
    // Do not expose connection strings, SQL, parameters, stack or cookie values.
    return json({ error: 'server-result-unavailable' }, 503);
  }
}
