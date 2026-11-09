import { ipv4 } from '../v31/ip';
import { dataTypes as T, type DataContext, type DataState, type ResourceRef } from './contract';

export type AnalysisIdentity = Readonly<{ workspace: string; model: string; revision: number }>;
type Status =
  'configuration-consistent' | 'denied-by-configuration' | 'undetermined' | 'unsupported';
export type DataAnalysis = {
  /** Null bindings mean the caller supplied no trustworthy analysis identity. */
  workspace: string | null;
  model: string | null;
  revision: number | null;
  status: Status;
  code: string;
  references: ResourceRef[];
  facts: readonly { name: string; value: string }[];
  limitations: readonly string[];
};
const dbLimits = [
  'Configuration analysis only; no DNS resolution, packets, SQL query or database runtime.',
  'Authentication, credentials, database roles and table permissions are not evaluated.',
  'Source IP is a hypothetical caller input, never a discovered App Service outbound IP.',
  'Only the modeled public endpoint/TLS/IP-range profile is evaluated; private endpoints are unsupported.',
] as const;
const functionLimits = [
  'Deterministic synthetic template evaluation; no JavaScript, Functions worker or external HTTP request runs.',
  'No actual event delivery, storage authentication, scale, latency or availability is verified.',
  'Only anonymous HTTPS HTTP triggers and explicitly selected modeled blob-event inputs are supported.',
] as const;
const result = (
  identity: AnalysisIdentity | null,
  status: Status,
  code: string,
  references: ResourceRef[],
  facts: { name: string; value: string }[],
  limitations: readonly string[],
): DataAnalysis => ({
  workspace: identity?.workspace ?? null,
  model: identity?.model ?? null,
  revision: identity?.revision ?? null,
  status,
  code,
  references: references.map((r) => ({ ...r })),
  facts,
  limitations,
});
/** Accept the JSON-object boundary, not arbitrary prototype/accessor-backed objects.
 * Copy descriptor values once so validation never calls a supplied getter or echoes
 * unrelated properties. Failed reflection on an adversarial object fails closed. */
function record(value: unknown): Record<string, unknown> | null {
  try {
    if (!value || typeof value !== 'object' || Object.getPrototypeOf(value) !== Object.prototype)
      return null;
    const copy: Record<string, unknown> = Object.create(null);
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string') return null;
      const property = Object.getOwnPropertyDescriptor(value, key);
      if (!property || !property.enumerable || !Object.hasOwn(property, 'value')) return null;
      copy[key] = property.value;
    }
    return copy;
  } catch {
    return null;
  }
}
const boundedString = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= 120 && value.isWellFormed() && !value.includes('\0');
function analysisIdentity(value: unknown): AnalysisIdentity | null {
  const input = record(value);
  if (
    !input ||
    Object.keys(input).sort().join(',') !== 'model,revision,workspace' ||
    !boundedString(input.workspace) ||
    input.workspace.trim().length === 0 ||
    !boundedString(input.model) ||
    input.model.trim().length === 0 ||
    typeof input.revision !== 'number' ||
    !Number.isSafeInteger(input.revision) ||
    input.revision < 0
  )
    return null;
  return { workspace: input.workspace, model: input.model, revision: input.revision };
}

/** Reads the same resource slice and caller-provided actual World projections.
 * A permitted IP range is not authentication or verified connectivity. */
export function analyseDatabaseConnection(
  state: DataState,
  context: DataContext,
  suppliedIdentity: unknown,
  suppliedInput: unknown,
): DataAnalysis {
  const identity = analysisIdentity(suppliedIdentity),
    input = record(suppliedInput);
  const refs: ResourceRef[] = [],
    facts: { name: string; value: string }[] = [];
  const finish = (status: Status, code: string) =>
    result(identity, status, code, refs, facts, dbLimits);
  if (!identity) return finish('unsupported', 'invalid-analysis-identity');
  if (
    !input ||
    Object.keys(input).some((k) => !['connectionId', 'sourceIp'].includes(k)) ||
    !Object.hasOwn(input, 'connectionId') ||
    !boundedString(input.connectionId) ||
    input.connectionId.length === 0 ||
    (Object.hasOwn(input, 'sourceIp') && !boundedString(input.sourceIp))
  )
    return finish('unsupported', 'invalid-analysis-input');
  const b = state.databaseConnections.find((b) => b.id === input.connectionId);
  if (!b) return finish('undetermined', 'connection-missing');
  refs.push({ id: b.id, type: b.type }, b.source, b.database);
  const source =
    state.functionApps.find((a) => a.id === b.source.id) ??
    context.applications.find((a) => a.id === b.source.id && a.type === b.source.type);
  const db =
    b.database.type === T.postgresDatabase
      ? state.postgresDatabases.find((d) => d.id === b.database.id)
      : b.database.type === T.sqlDatabase
        ? state.sqlDatabases.find((d) => d.id === b.database.id)
        : undefined;
  if (!source || !db)
    return finish('undetermined', !source ? 'source-missing' : 'database-missing');
  const server =
    db.type === T.postgresDatabase
      ? state.postgresServers.find((s) => s.id === db.serverId)
      : state.sqlServers.find((s) => s.id === db.serverId);
  if (!server) return finish('undetermined', 'server-missing');
  refs.push({ id: server.id, type: server.type });
  const sg = context.groups.find((g) => g.id === source.groupId),
    dg = context.groups.find((g) => g.id === db.groupId);
  if (!sg || !dg || sg.subscriptionId !== dg.subscriptionId)
    return finish('undetermined', 'scope-unverifiable');
  facts.push(
    { name: 'settingName', value: b.settingName },
    { name: 'endpointProfile', value: 'public' },
    { name: 'TLS', value: b.tls },
    { name: 'authentication', value: 'not-evaluated' },
  );
  if (!source.enabled) return finish('denied-by-configuration', 'source-disabled');
  if (server.publicNetworkAccess !== 'Enabled')
    return finish('denied-by-configuration', 'public-endpoint-disabled');
  if (b.tls !== '1.2') return finish('unsupported', 'unsupported-tls-profile');
  if (!Object.hasOwn(input, 'sourceIp')) return finish('undetermined', 'source-egress-ip-unknown');
  if (typeof input.sourceIp !== 'string') return finish('unsupported', 'invalid-source-ip');
  const ip = ipv4(input.sourceIp);
  if (ip === null || ip === 0 || ip >= 0xe0000000)
    return finish('unsupported', 'invalid-source-ip');
  facts.push({ name: 'hypotheticalSourceIp', value: input.sourceIp });
  const matching = state.databaseFirewallRules.filter(
    (r) =>
      r.server.id === server.id &&
      r.server.type === server.type &&
      ipv4(r.startIp) !== null &&
      ipv4(r.endIp) !== null &&
      ip >= ipv4(r.startIp)! &&
      ip <= ipv4(r.endIp)!,
  );
  if (!matching.length) return finish('denied-by-configuration', 'source-ip-not-allowed');
  refs.push(...matching.map((r) => ({ id: r.id, type: r.type })));
  facts.push({ name: 'matchedFirewallRuleIds', value: matching.map((r) => r.id).join(',') });
  return finish('configuration-consistent', 'modeled-public-network-requirements-satisfied');
}

export type InvocationInput =
  | {
      functionId: string;
      trigger: 'http';
      method: string;
      path: string;
      transport: string;
      text: string;
    }
  | { functionId: string; trigger: 'blob-event'; blobId: string };
export type FunctionAnalysis = DataAnalysis & {
  syntheticOutput: { contentType: 'text/plain'; text: string } | null;
};

/** A pure synthetic fixture evaluation, explicitly not an executed Azure Function. */
export function analyseFunctionInvocation(
  state: DataState,
  context: DataContext,
  suppliedIdentity: unknown,
  suppliedInput: unknown,
): FunctionAnalysis {
  const identity = analysisIdentity(suppliedIdentity),
    input = record(suppliedInput);
  const refs: ResourceRef[] = [],
    facts: { name: string; value: string }[] = [];
  const finish = (status: Status, code: string, text?: string): FunctionAnalysis => ({
    ...result(identity, status, code, refs, facts, functionLimits),
    syntheticOutput: text === undefined ? null : { contentType: 'text/plain', text },
  });
  if (!identity) return finish('unsupported', 'invalid-analysis-identity');
  if (!input || !boundedString(input.functionId) || input.functionId.length === 0)
    return finish('unsupported', 'invalid-analysis-input');
  const keys =
    input.trigger === 'http'
      ? ['functionId', 'trigger', 'method', 'path', 'transport', 'text']
      : input.trigger === 'blob-event'
        ? ['functionId', 'trigger', 'blobId']
        : [];
  if (
    keys.length === 0 ||
    Object.keys(input).sort().join(',') !== keys.sort().join(',') ||
    Object.values(input).some((v) => !boundedString(v))
  )
    return finish('unsupported', 'invalid-analysis-input');
  const f = state.functions.find((f) => f.id === input.functionId);
  if (!f) return finish('undetermined', 'function-missing');
  refs.push({ id: f.id, type: f.type });
  const a = state.functionApps.find((a) => a.id === f.appId);
  if (!a) return finish('undetermined', 'function-app-missing');
  refs.push({ id: a.id, type: a.type }, { id: a.planId, type: T.functionPlan });
  const plan = state.functionPlans.find((p) => p.id === a.planId && p.ownerAppId === a.id);
  const account = context.accounts.find((s) => s.id === a.storageAccountId),
    deployment = context.containers.find((c) => c.id === a.deploymentContainerId);
  if (!plan || !account || !deployment || deployment.accountId !== account.id)
    return finish('undetermined', 'required-storage-or-plan-missing');
  refs.push(
    { id: account.id, type: 'Microsoft.Storage/storageAccounts' },
    { id: deployment.id, type: 'local/blob-container' },
  );
  if (
    account.kind !== 'StorageV2' ||
    account.sku !== 'Standard_LRS' ||
    deployment.access !== 'private' ||
    account.region !== a.region ||
    plan.region !== a.region ||
    plan.sku !== 'FC1' ||
    plan.os !== 'Linux' ||
    !context.groups.some((g) => g.id === a.groupId) ||
    context.groups.find((g) => g.id === account.groupId)?.subscriptionId !==
      context.groups.find((g) => g.id === a.groupId)?.subscriptionId
  )
    return finish('undetermined', 'required-storage-profile-changed');
  if (!a.enabled || !f.enabled)
    return finish(
      'denied-by-configuration',
      !a.enabled ? 'function-app-disabled' : 'function-disabled',
    );
  if (input.trigger !== f.trigger.kind)
    return finish('denied-by-configuration', 'trigger-mismatch');
  let sourceText: string;
  if (input.trigger === 'http' && f.trigger.kind === 'http') {
    if (a.publicNetworkAccess !== 'Enabled')
      return finish('denied-by-configuration', 'public-endpoint-disabled');
    if (input.transport !== 'HTTPS') return finish('denied-by-configuration', 'https-required');
    if (!boundedString(input.method) || !boundedString(input.path) || !boundedString(input.text))
      return finish('unsupported', 'invalid-analysis-input');
    if (input.method !== f.trigger.method || input.path !== '/api' + f.trigger.route)
      return finish('denied-by-configuration', 'http-trigger-not-matched');
    facts.push(
      { name: 'method', value: input.method },
      { name: 'path', value: input.path },
      { name: 'authorizationProfile', value: 'anonymous' },
    );
    sourceText = input.text;
  } else if (input.trigger === 'blob-event' && f.trigger.kind === 'blob-event') {
    const b = context.blobs.find((b) => b.id === input.blobId);
    if (!b) return finish('undetermined', 'blob-missing');
    const c = context.containers.find((c) => c.id === b.containerId);
    if (!c || b.containerId !== f.trigger.containerId || c.accountId !== a.storageAccountId)
      return finish('denied-by-configuration', 'blob-event-source-not-matched');
    refs.push({ id: b.id, type: 'local/text-blob' }, { id: c.id, type: 'local/blob-container' });
    sourceText = b.text;
    facts.push({ name: 'eventDelivery', value: 'not-performed' });
  } else return finish('unsupported', 'unsupported-trigger-profile');
  return finish(
    'configuration-consistent',
    'synthetic-template-evaluated',
    f.behavior === 'static-text' ? f.responseText : sourceText,
  );
}
