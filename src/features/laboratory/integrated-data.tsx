'use client';

import { useState } from 'react';
import type { World } from '@/laboratory/v39/contract';
import { dataContext } from '@/laboratory/v39/projection';
import {
  analyseDatabaseConnection,
  analyseFunctionInvocation,
  type DataAnalysis,
  type FunctionAnalysis,
} from '@/laboratory/data/analysis';
import {
  dataTypes as T,
  type DataCommand,
  type FunctionDefinition,
  type Resource,
} from '@/laboratory/data/contract';
import { laboratoryIntegratedDataNb as t } from '@/content/laboratory-integrated-data-nb';
import { PropertyList } from '@/features/portal/shared';
import {
  IntegratedResourceViews,
  type IntegratedFamily,
  type IntegratedOperation,
  type IntegratedResource,
  type IntegratedViewsProps,
} from './integrated-resource';

export const dataFieldLabels: Record<string, string> = t.fields;
type Choices = readonly [string, string][];
const choices = (rows: readonly { id: string; name: string }[]): Choices =>
  rows.map((row) => [row.id, `${row.name} · ${row.id}`]);
const values = (...items: string[]): Choices => items.map((value) => [value, value]);
const databases = (world: World) => [...world.data.postgresDatabases, ...world.data.sqlDatabases];
const servers = (world: World) => [...world.data.postgresServers, ...world.data.sqlServers];
const applications = (world: World) => [...world.webApps, ...world.data.functionApps];
const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const text = (value: unknown, fallback = '') =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value)
    : fallback;

function defaults(
  type: DataCommand['type'],
  world: World,
  resource?: IntegratedResource,
): Record<string, string> {
  const source = resource?.source ?? {},
    configuredTrigger = record(source.trigger),
    sourceReference = record(source.source),
    targetReference = record(source.database),
    serverReference = record(source.server),
    account = world.accounts.find((row) => row.kind === 'StorageV2' && row.sku === 'Standard_LRS'),
    target = databases(world).find((row) => row.id === targetReference.id) ?? databases(world)[0],
    postgres = type.includes('Postgres'),
    sql = type.includes('Sql'),
    parentServer = postgres
      ? world.data.postgresServers[0]
      : sql
        ? world.data.sqlServers[0]
        : servers(world)[0],
    app = world.data.functionApps.find((row) => row.id === source.appId),
    deployment = world.containers.find(
      (row) => row.accountId === account?.id && row.access === 'private',
    );
  return {
    groupId: resource?.groupId ?? account?.groupId ?? world.groups[0]?.id ?? '',
    name: '',
    region: resource?.region ?? account?.region ?? 'norwayeast',
    version: postgres ? '16' : '12.0',
    sku: postgres ? 'Standard_B1ms' : 'Basic',
    storageGiB: text(source.storageGiB, '32'),
    publicNetworkAccess: text(source.publicNetworkAccess, 'Enabled'),
    serverId:
      resource?.view === 'postgresServer' || resource?.view === 'sqlServer'
        ? resource.id
        : text(source.serverId, text(serverReference.id, parentServer?.id)),
    databaseId:
      resource?.view === 'postgresDatabase' || resource?.view === 'sqlDatabase'
        ? resource.id
        : (target?.id ?? ''),
    charset: 'UTF8',
    maxSizeGiB: '2',
    ruleId: resource?.view === 'databaseFirewallRule' ? resource.id : '',
    startIp: text(source.startIp, '203.0.113.10'),
    endIp: text(source.endIp, '203.0.113.10'),
    appId:
      resource?.view === 'functionApp'
        ? resource.id
        : text(
            source.appId,
            text(
              sourceReference.id,
              type.includes('DatabaseConnection')
                ? applications(world)[0]?.id
                : world.data.functionApps[0]?.id,
            ),
          ),
    planName: '',
    storageAccountId: text(source.storageAccountId, account?.id),
    deploymentContainerId: text(source.deploymentContainerId, deployment?.id),
    runtime: 'node22',
    enabled: text(source.enabled, 'true'),
    functionId: resource?.view === 'function' ? resource.id : '',
    trigger: text(configuredTrigger.kind, 'http'),
    method: text(configuredTrigger.method, configuredTrigger.kind === 'blob-event' ? '' : 'GET'),
    route: text(configuredTrigger.route, configuredTrigger.kind === 'blob-event' ? '' : '/hello'),
    containerId: text(configuredTrigger.containerId),
    behavior: text(source.behavior, 'static-text'),
    responseText: text(source.responseText, 'Hello from the synthetic function'),
    connectionId: resource?.view === 'databaseConnection' ? resource.id : '',
    databaseType: target?.type ?? T.postgresDatabase,
    settingName: text(source.settingName, 'APP_DATABASE'),
    tls: '1.2',
    ...(app ? { appId: app.id } : {}),
  };
}

function options(
  type: DataCommand['type'],
  field: string,
  world: World,
  resource?: IntegratedResource,
  current: Record<string, string> = {},
): Choices | undefined {
  const configuredTrigger = record(resource?.source.trigger),
    trigger = current.trigger ?? text(configuredTrigger.kind, 'http');
  switch (field) {
    case 'groupId':
      return choices(world.groups);
    case 'region':
      return values('norwayeast', 'westeurope', 'northeurope');
    case 'version':
      return values(type.includes('Postgres') ? '16' : '12.0');
    case 'sku':
      return values(type.includes('Postgres') ? 'Standard_B1ms' : 'Basic');
    case 'storageGiB':
      return values('32', '64');
    case 'maxSizeGiB':
      return values('2');
    case 'publicNetworkAccess':
      return values('Enabled', 'Disabled');
    case 'enabled':
      return values('true', 'false');
    case 'serverId':
      return choices(
        type.includes('Postgres')
          ? world.data.postgresServers
          : type.includes('Sql')
            ? world.data.sqlServers
            : servers(world),
      );
    case 'databaseId':
      return databases(world).map((row) => [row.id, `${row.name} · ${row.type} · ${row.id}`]);
    case 'databaseType':
      return values(T.postgresDatabase, T.sqlDatabase);
    case 'charset':
      return values('UTF8');
    case 'ruleId':
      return choices(world.data.databaseFirewallRules);
    case 'appId':
      return choices(
        type.includes('DatabaseConnection') ? applications(world) : world.data.functionApps,
      );
    case 'storageAccountId':
      return choices(
        world.accounts.filter((row) => row.kind === 'StorageV2' && row.sku === 'Standard_LRS'),
      );
    case 'deploymentContainerId':
      return choices(
        world.containers.filter(
          (row) =>
            row.access === 'private' &&
            row.accountId === (current.storageAccountId ?? text(resource?.source.storageAccountId)),
        ),
      );
    case 'runtime':
      return values('node22');
    case 'functionId':
      return choices(world.data.functions);
    case 'trigger':
      return [
        ['http', 'HTTP (synthetic, anonymous HTTPS)'],
        ['blob-event', 'Blob event (synthetic, explicitly selected input)'],
      ];
    case 'method':
      return trigger === 'blob-event' ? [['', t.notUsed]] : values('GET', 'POST');
    case 'containerId': {
      if (trigger === 'http') return [['', t.notUsed]];
      const app = world.data.functionApps.find(
        (row) => row.id === (current.appId ?? text(resource?.source.appId)),
      );
      return choices(world.containers.filter((row) => row.accountId === app?.storageAccountId));
    }
    case 'behavior':
      return values('static-text', 'echo-text');
    case 'connectionId':
      return choices(world.data.databaseConnections);
    case 'tls':
      return values('1.2');
    default:
      return undefined;
  }
}

function operation(type: DataCommand['type'], fields: readonly string[]): IntegratedOperation {
  return {
    type,
    label: t.operations[type],
    fields,
    fieldLabels: dataFieldLabels,
    availableIn: type.startsWith('Create') ? 'list' : 'resource',
    optionalFields: ['method', 'route', 'containerId', 'responseText'],
    lockedFields: [
      ...(type.startsWith('Create') ? [] : [fields[0]!]),
      ...(type.includes('DatabaseConnection') ? ['databaseType'] : []),
    ],
    defaults: (world, resource) => defaults(type, world, resource),
    options: (field, world, resource, current) => options(type, field, world, resource, current),
    change: (field, value, current, world) => {
      const next = { ...current, [field]: value };
      if (field === 'databaseId') {
        const database = databases(world).find((row) => row.id === value);
        next.databaseType = database?.type ?? '';
      }
      if (field === 'storageAccountId')
        next.deploymentContainerId =
          world.containers.find((row) => row.accountId === value && row.access === 'private')?.id ??
          '';
      if (field === 'trigger') {
        next.method = value === 'http' ? 'GET' : '';
        next.route = value === 'http' ? '/hello' : '';
        const app = world.data.functionApps.find((row) => row.id === next.appId);
        next.containerId =
          value === 'blob-event'
            ? (world.containers.find((row) => row.accountId === app?.storageAccountId)?.id ?? '')
            : '';
      }
      if (field === 'appId' && next.trigger === 'blob-event') {
        const app = world.data.functionApps.find((row) => row.id === value);
        next.containerId =
          world.containers.find((row) => row.accountId === app?.storageAccountId)?.id ?? '';
      }
      return next;
    },
  };
}

function project(
  view: string,
  rows: readonly (Resource & { type: string })[],
  parent: (source: Record<string, unknown>) => string = (source) => text(source.groupId),
): IntegratedResource[] {
  return rows.map((row) => {
    const source = { ...row } as Record<string, unknown>;
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      origin: row.origin,
      parentId: parent(source),
      groupId: row.groupId,
      region: row.region,
      source,
      view,
    };
  });
}

export const dataFamilies: IntegratedFamily[] = [
  {
    view: 'postgresServer',
    label: t.types.postgresServer,
    type: T.postgresServer,
    resources: (world) => project('postgresServer', world.data.postgresServers),
    operations: [
      operation('CreatePostgresServer', [
        'groupId',
        'name',
        'region',
        'version',
        'sku',
        'storageGiB',
        'publicNetworkAccess',
      ]),
      operation('UpdatePostgresServer', ['serverId', 'storageGiB', 'publicNetworkAccess']),
      operation('DeletePostgresServer', ['serverId']),
    ],
  },
  {
    view: 'postgresDatabase',
    label: t.types.postgresDatabase,
    type: T.postgresDatabase,
    resources: (world) =>
      project('postgresDatabase', world.data.postgresDatabases, (source) => text(source.serverId)),
    operations: [
      operation('CreatePostgresDatabase', ['serverId', 'name', 'charset']),
      operation('DeletePostgresDatabase', ['databaseId']),
    ],
  },
  {
    view: 'sqlServer',
    label: t.types.sqlServer,
    type: T.sqlServer,
    resources: (world) => project('sqlServer', world.data.sqlServers),
    operations: [
      operation('CreateSqlServer', ['groupId', 'name', 'region', 'version', 'publicNetworkAccess']),
      operation('UpdateSqlServer', ['serverId', 'publicNetworkAccess']),
      operation('DeleteSqlServer', ['serverId']),
    ],
  },
  {
    view: 'sqlDatabase',
    label: t.types.sqlDatabase,
    type: T.sqlDatabase,
    resources: (world) =>
      project('sqlDatabase', world.data.sqlDatabases, (source) => text(source.serverId)),
    operations: [
      operation('CreateSqlDatabase', ['serverId', 'name', 'sku', 'maxSizeGiB']),
      operation('DeleteSqlDatabase', ['databaseId']),
    ],
  },
  {
    view: 'databaseFirewallRule',
    label: t.types.databaseFirewallRule,
    type: T.postgresFirewallRule,
    resources: (world) =>
      project('databaseFirewallRule', world.data.databaseFirewallRules, (source) =>
        text(record(source.server).id),
      ),
    operations: [
      operation('CreateDatabaseFirewallRule', ['serverId', 'name', 'startIp', 'endIp']),
      operation('UpdateDatabaseFirewallRule', ['ruleId', 'startIp', 'endIp']),
      operation('DeleteDatabaseFirewallRule', ['ruleId']),
    ],
  },
  {
    view: 'functionPlan',
    label: t.types.functionPlan,
    type: T.functionPlan,
    resources: (world) => project('functionPlan', world.data.functionPlans),
    operations: [],
    analysis: () => <p>{t.functionPlanBoundary}</p>,
  },
  {
    view: 'functionApp',
    label: t.types.functionApp,
    type: T.functionApp,
    resources: (world) => project('functionApp', world.data.functionApps),
    operations: [
      operation('CreateFunctionApp', [
        'groupId',
        'name',
        'region',
        'planName',
        'storageAccountId',
        'deploymentContainerId',
        'runtime',
        'publicNetworkAccess',
      ]),
      operation('UpdateFunctionApp', ['appId', 'enabled', 'publicNetworkAccess']),
      operation('DeleteFunctionApp', ['appId']),
    ],
  },
  {
    view: 'function',
    label: t.types.function,
    type: T.function,
    resources: (world) => project('function', world.data.functions, (source) => text(source.appId)),
    operations: [
      operation('CreateFunction', [
        'appId',
        'name',
        'trigger',
        'method',
        'route',
        'containerId',
        'behavior',
        'responseText',
      ]),
      operation('UpdateFunction', [
        'functionId',
        'enabled',
        'method',
        'route',
        'containerId',
        'behavior',
        'responseText',
      ]),
      operation('DeleteFunction', ['functionId']),
    ],
    analysis: (world, workspace, resource) => (
      <FunctionConfigurationAnalysis
        key={`${workspace}:${world.model}:${world.revision}:${resource.id}`}
        world={world}
        workspace={workspace}
        resource={resource}
      />
    ),
  },
  {
    view: 'databaseConnection',
    label: t.types.databaseConnection,
    type: T.connection,
    resources: (world) =>
      project('databaseConnection', world.data.databaseConnections, (source) =>
        text(record(source.source).id),
      ),
    operations: [
      operation('CreateDatabaseConnection', [
        'appId',
        'databaseId',
        'databaseType',
        'settingName',
        'tls',
      ]),
      operation('UpdateDatabaseConnection', ['connectionId', 'databaseId', 'databaseType', 'tls']),
      operation('DeleteDatabaseConnection', ['connectionId']),
    ],
    analysis: (world, workspace, resource) => (
      <DatabaseConfigurationAnalysis
        key={`${workspace}:${world.model}:${world.revision}:${resource.id}`}
        world={world}
        workspace={workspace}
        resource={resource}
      />
    ),
  },
];

function AnalysisResult({ result }: { result: DataAnalysis | FunctionAnalysis }) {
  return (
    <div aria-live="polite">
      <p role="status">{t.status[result.status]}</p>
      <PropertyList
        items={[
          [t.resultCode, result.code],
          [t.workspace, result.workspace],
          [t.model, result.model],
          [t.revision, result.revision],
        ]}
      />
      {result.facts.length > 0 && (
        <>
          <h3>{t.facts}</h3>
          <PropertyList items={result.facts.map((fact) => [fact.name, fact.value])} />
        </>
      )}
      {'syntheticOutput' in result && result.syntheticOutput && (
        <>
          <h3>{t.output}</h3>
          <pre>{result.syntheticOutput.text}</pre>
        </>
      )}
      <h3>{t.references}</h3>
      <ul>
        {[...new Map(result.references.map((ref) => [`${ref.type}:${ref.id}`, ref])).values()].map(
          (ref) => (
            <li key={`${ref.type}:${ref.id}`}>
              <code>{ref.id}</code> · {ref.type}
            </li>
          ),
        )}
      </ul>
      <h3>{t.limitations}</h3>
      <ul>
        {result.limitations.map((limitation) => (
          <li key={limitation}>{limitation}</li>
        ))}
      </ul>
    </div>
  );
}

type AnalysisProps = { world: World; workspace: string; resource: IntegratedResource };
function DatabaseConfigurationAnalysis({ world, workspace, resource }: AnalysisProps) {
  const [sourceIp, setSourceIp] = useState(''),
    [result, setResult] = useState<DataAnalysis | null>(null);
  return (
    <section aria-label={t.analysis}>
      <h2>{t.analysis}</h2>
      <p>{t.bindingBoundary}</p>
      <form
        className="lab-form"
        onSubmit={(event) => {
          event.preventDefault();
          setResult(
            analyseDatabaseConnection(
              world.data,
              dataContext(world),
              { workspace, model: world.model, revision: world.revision },
              {
                connectionId: resource.id,
                ...(sourceIp.trim() ? { sourceIp: sourceIp.trim() } : {}),
              },
            ),
          );
        }}
      >
        <label>
          {t.sourceIp}
          <input
            maxLength={15}
            value={sourceIp}
            onChange={(event) => {
              setSourceIp(event.target.value);
              setResult(null);
            }}
          />
        </label>
        <p>{t.sourceIpHint}</p>
        <button type="submit">{t.analyse}</button>
      </form>
      {result &&
        result.workspace === workspace &&
        result.model === world.model &&
        result.revision === world.revision && <AnalysisResult result={result} />}
      <p>{t.notRuntime}</p>
    </section>
  );
}

function FunctionConfigurationAnalysis({ world, workspace, resource }: AnalysisProps) {
  const definition: FunctionDefinition | undefined = world.data.functions.find(
      (row) => row.id === resource.id,
    ),
    trigger = definition?.trigger,
    blobs = world.blobs.filter(
      (blob) => trigger?.kind === 'blob-event' && blob.containerId === trigger.containerId,
    );
  const [method, setMethod] = useState(trigger?.kind === 'http' ? trigger.method : 'GET'),
    [path, setPath] = useState(trigger?.kind === 'http' ? '/api' + trigger.route : ''),
    [transport, setTransport] = useState('HTTPS'),
    [inputText, setInputText] = useState(''),
    [blobId, setBlobId] = useState(blobs[0]?.id ?? ''),
    [result, setResult] = useState<FunctionAnalysis | null>(null);
  return (
    <section aria-label={t.invocation}>
      <h2>{t.invocation}</h2>
      <p>{t.boundary}</p>
      <form
        className="lab-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!trigger) return;
          setResult(
            analyseFunctionInvocation(
              world.data,
              dataContext(world),
              { workspace, model: world.model, revision: world.revision },
              trigger.kind === 'http'
                ? {
                    functionId: resource.id,
                    trigger: 'http',
                    method,
                    path,
                    transport,
                    text: inputText,
                  }
                : { functionId: resource.id, trigger: 'blob-event', blobId },
            ),
          );
        }}
      >
        {trigger?.kind === 'http' ? (
          <>
            <label>
              {t.method}
              <select
                value={method}
                onChange={(event) => {
                  setMethod(event.target.value as 'GET' | 'POST');
                  setResult(null);
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </label>
            <label>
              {t.path}
              <input
                required
                maxLength={120}
                value={path}
                onChange={(event) => {
                  setPath(event.target.value);
                  setResult(null);
                }}
              />
            </label>
            <label>
              {t.transport}
              <select
                value={transport}
                onChange={(event) => {
                  setTransport(event.target.value);
                  setResult(null);
                }}
              >
                <option value="HTTPS">HTTPS</option>
                <option value="HTTP">HTTP</option>
              </select>
            </label>
            <label>
              {t.inputText}
              <input
                maxLength={120}
                value={inputText}
                onChange={(event) => {
                  setInputText(event.target.value);
                  setResult(null);
                }}
              />
            </label>
          </>
        ) : (
          <label>
            {t.blob}
            <select
              required
              value={blobId}
              onChange={(event) => {
                setBlobId(event.target.value);
                setResult(null);
              }}
            >
              <option value="" disabled>
                {t.choose}
              </option>
              {blobs.map((blob) => (
                <option key={blob.id} value={blob.id}>
                  {blob.name} · {blob.id}
                </option>
              ))}
            </select>
          </label>
        )}
        {trigger?.kind === 'blob-event' && !blobs.length && <p>{t.noBlob}</p>}
        <button
          type="submit"
          disabled={!trigger || (trigger.kind === 'blob-event' && !blobs.length)}
        >
          {t.evaluate}
        </button>
      </form>
      {result &&
        result.workspace === workspace &&
        result.model === world.model &&
        result.revision === world.revision && <AnalysisResult result={result} />}
      <p>{t.notRuntime}</p>
    </section>
  );
}

export function DataViews(props: IntegratedViewsProps) {
  return <IntegratedResourceViews {...props} families={dataFamilies} />;
}
