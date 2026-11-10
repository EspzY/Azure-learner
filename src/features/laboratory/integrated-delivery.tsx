'use client';

import { useState } from 'react';
import { regions } from '@/domain/simulation';
import type { World } from '@/laboratory/v39/contract';
import { deliveryContext } from '@/laboratory/v39/projection';
import {
  deliveryTypes as T,
  type DeliveryCommand,
  type DeliveryResource,
  type DeliveryState,
} from '@/laboratory/delivery/contract';
import { deliveryReferences, deliveryResources } from '@/laboratory/delivery/domain';
import {
  analyseApplicationGateway,
  analyseFrontDoor,
  type DeliveryAnalysis,
} from '@/laboratory/delivery/analysis';
import { laboratoryIntegratedDeliveryNb as t } from '@/content/laboratory-integrated-delivery-nb';
import { PropertyList } from '@/features/portal/shared';
import {
  IntegratedResourceViews,
  type IntegratedFamily,
  type IntegratedOperation,
  type IntegratedResource,
  type IntegratedViewsProps,
} from './integrated-resource';

type Choices = readonly [string, string][];
type Values = Record<string, string>;
type FamilyDefinition = {
  view: string;
  label: string;
  collection: keyof DeliveryState;
  type: DeliveryResource['type'];
  identity: string;
  operations: readonly [DeliveryCommand['type'], string][];
};

const definitions: readonly FamilyDefinition[] = [
  {
    view: 'frontDoor',
    label: 'Front Door profiles',
    collection: 'frontDoors',
    type: T.frontDoor,
    identity: 'profileId',
    operations: [
      ['CreateFrontDoor', 'groupId name sku'],
      ['DeleteFrontDoor', 'profileId'],
    ],
  },
  {
    view: 'frontDoorEndpoint',
    label: 'Front Door endpoints',
    collection: 'frontDoorEndpoints',
    type: T.endpoint,
    identity: 'endpointId',
    operations: [
      ['CreateFrontDoorEndpoint', 'profileId name enabled'],
      ['UpdateFrontDoorEndpoint', 'endpointId profileId enabled'],
      ['DeleteFrontDoorEndpoint', 'endpointId'],
    ],
  },
  {
    view: 'originGroup',
    label: 'Origin groups and synthetic probes',
    collection: 'originGroups',
    type: T.originGroup,
    identity: 'originGroupId',
    operations: [
      ['CreateOriginGroup', 'profileId name probePath'],
      ['UpdateOriginGroup', 'originGroupId profileId probePath'],
      ['DeleteOriginGroup', 'originGroupId'],
    ],
  },
  {
    view: 'frontDoorOrigin',
    label: 'Front Door origins',
    collection: 'origins',
    type: T.origin,
    identity: 'originId',
    operations: [
      ['CreateFrontDoorOrigin', 'originGroupId name webAppId enabled priority'],
      ['UpdateFrontDoorOrigin', 'originId originGroupId webAppId enabled priority'],
      ['DeleteFrontDoorOrigin', 'originId'],
    ],
  },
  {
    view: 'frontDoorRoute',
    label: 'Front Door routes',
    collection: 'deliveryRoutes',
    type: T.route,
    identity: 'routeId',
    operations: [
      ['CreateFrontDoorRoute', 'endpointId name originGroupId pattern enabled'],
      ['UpdateFrontDoorRoute', 'routeId endpointId originGroupId pattern enabled'],
      ['DeleteFrontDoorRoute', 'routeId'],
    ],
  },
  {
    view: 'frontDoorWafPolicy',
    label: 'Front Door WAF policies',
    collection: 'wafPolicies',
    type: T.waf,
    identity: 'policyId',
    operations: [
      ['CreateFrontDoorWafPolicy', 'groupId name mode'],
      ['UpdateFrontDoorWafPolicy', 'policyId groupId mode'],
      ['DeleteFrontDoorWafPolicy', 'policyId'],
    ],
  },
  {
    view: 'frontDoorWafRule',
    label: 'WAF custom rules',
    collection: 'wafRules',
    type: T.wafRule,
    identity: 'ruleId',
    operations: [
      ['CreateFrontDoorWafRule', 'policyId name priority operator value action enabled'],
      ['UpdateFrontDoorWafRule', 'ruleId policyId priority operator value action enabled'],
      ['DeleteFrontDoorWafRule', 'ruleId'],
    ],
  },
  {
    view: 'frontDoorSecurityPolicy',
    label: 'Front Door security policies',
    collection: 'securityPolicies',
    type: T.securityPolicy,
    identity: 'securityPolicyId',
    operations: [
      ['CreateFrontDoorSecurityPolicy', 'profileId endpointId wafPolicyId name'],
      ['UpdateFrontDoorSecurityPolicy', 'securityPolicyId profileId endpointId wafPolicyId'],
      ['DeleteFrontDoorSecurityPolicy', 'securityPolicyId'],
    ],
  },
  {
    view: 'applicationGateway',
    label: 'Application Gateways',
    collection: 'applicationGateways',
    type: T.gateway,
    identity: 'gatewayId',
    operations: [
      ['CreateApplicationGateway', 'groupId name region subnetId sku'],
      ['DeleteApplicationGateway', 'gatewayId'],
    ],
  },
  {
    view: 'gatewayBackendPool',
    label: 'Gateway backend pools',
    collection: 'backendPools',
    type: T.pool,
    identity: 'poolId',
    operations: [
      ['CreateGatewayBackendPool', 'gatewayId name webAppId'],
      ['UpdateGatewayBackendPool', 'poolId gatewayId webAppId'],
      ['DeleteGatewayBackendPool', 'poolId'],
    ],
  },
  {
    view: 'gatewayListener',
    label: 'Gateway HTTP listeners',
    collection: 'gatewayListeners',
    type: T.listener,
    identity: 'listenerId',
    operations: [
      ['CreateGatewayListener', 'gatewayId name port'],
      ['UpdateGatewayListener', 'listenerId gatewayId port'],
      ['DeleteGatewayListener', 'listenerId'],
    ],
  },
  {
    view: 'gatewayBackendSetting',
    label: 'Gateway HTTPS backend settings',
    collection: 'backendSettings',
    type: T.setting,
    identity: 'settingId',
    operations: [
      ['CreateGatewayBackendSetting', 'gatewayId name probeId'],
      ['UpdateGatewayBackendSetting', 'settingId gatewayId probeId'],
      ['DeleteGatewayBackendSetting', 'settingId'],
    ],
  },
  {
    view: 'gatewayProbe',
    label: 'Gateway synthetic probes',
    collection: 'gatewayProbes',
    type: T.probe,
    identity: 'probeId',
    operations: [
      ['CreateGatewayProbe', 'gatewayId name path'],
      ['UpdateGatewayProbe', 'probeId gatewayId path'],
      ['DeleteGatewayProbe', 'probeId'],
    ],
  },
  {
    view: 'gatewayRoutingRule',
    label: 'Gateway routing rules',
    collection: 'gatewayRules',
    type: T.gatewayRule,
    identity: 'ruleId',
    operations: [
      ['CreateGatewayRoutingRule', 'gatewayId name listenerId poolId settingId priority'],
      ['UpdateGatewayRoutingRule', 'ruleId gatewayId listenerId poolId settingId priority'],
      ['DeleteGatewayRoutingRule', 'ruleId'],
    ],
  },
];

/** An ephemeral display projection; the versioned World remains the resource authority. */
export function deliveryInventory(world: World): IntegratedResource[] {
  const all = deliveryResources(world.delivery);
  const scope = (resource: DeliveryResource): { groupId: string; region: string } => {
    if ('groupId' in resource) return { groupId: resource.groupId, region: resource.region };
    const parent = all.find((r) => r.id === deliveryReferences(resource)[0]?.id);
    return parent ? scope(parent) : { groupId: '', region: '' };
  };
  return all.map((resource) => ({
    id: resource.id,
    name: resource.name,
    type: resource.type,
    origin: resource.origin,
    parentId: deliveryReferences(resource)[0]?.id,
    ...scope(resource),
    source: { ...resource },
    view: definitions.find((d) => d.type === resource.type)!.view,
  }));
}

const choices = (rows: readonly { id: string; name: string }[]): Choices =>
  rows.map((r) => [r.id, `${r.name} · ${r.id}`]);

function deliveryOptions(
  definition: FamilyDefinition,
  operation: DeliveryCommand['type'],
  field: string,
  world: World,
  resource?: IntegratedResource,
  values: Values = {},
): Choices | undefined {
  if (resource && !operation.startsWith('Create') && field === definition.identity)
    return [[resource.id, `${resource.name} · ${resource.id}`]];
  const d = world.delivery,
    value = (key: string) => values[key] ?? String(resource?.source[key] ?? ''),
    selectedEndpoint = d.frontDoorEndpoints.find((e) => e.id === value('endpointId')),
    selectedGroup = d.originGroups.find((g) => g.id === value('originGroupId')),
    profileId = value('profileId') || selectedEndpoint?.profileId || selectedGroup?.profileId,
    profile = d.frontDoors.find((p) => p.id === profileId),
    gatewayId = value('gatewayId'),
    gateway = d.applicationGateways.find((g) => g.id === gatewayId),
    groupId = profile?.groupId || gateway?.groupId || value('groupId'),
    subscriptionId = world.groups.find((g) => g.id === groupId)?.subscriptionId;
  const sameSubscription = (candidateGroupId: string) =>
    !subscriptionId ||
    world.groups.find((g) => g.id === candidateGroupId)?.subscriptionId === subscriptionId;
  const inGateway = (rows: readonly { id: string; name: string; gatewayId: string }[]) =>
    choices(rows.filter((r) => !gatewayId || r.gatewayId === gatewayId));
  switch (field) {
    case 'groupId':
      return world.groups.map((g) => [g.id, `${g.name} · ${g.subscriptionId} · ${g.id}`]);
    case 'profileId':
      return choices(d.frontDoors);
    case 'endpointId':
      return choices(d.frontDoorEndpoints.filter((e) => !profileId || e.profileId === profileId));
    case 'originGroupId':
      return choices(d.originGroups.filter((g) => !profileId || g.profileId === profileId));
    case 'originId':
      return choices(d.origins);
    case 'routeId':
      return choices(d.deliveryRoutes);
    case 'policyId':
    case 'wafPolicyId':
      return choices(d.wafPolicies.filter((p) => sameSubscription(p.groupId)));
    case 'securityPolicyId':
      return choices(d.securityPolicies);
    case 'ruleId':
      return choices(definition.collection === 'wafRules' ? d.wafRules : d.gatewayRules);
    case 'webAppId':
      return choices(world.webApps.filter((a) => sameSubscription(a.groupId)));
    case 'gatewayId':
      return choices(d.applicationGateways);
    case 'poolId':
      return inGateway(d.backendPools);
    case 'listenerId':
      return inGateway(d.gatewayListeners);
    case 'settingId':
      return inGateway(d.backendSettings);
    case 'probeId':
      return inGateway(d.gatewayProbes);
    case 'subnetId':
      return world.subnets
        .filter((s) => {
          const vnet = world.vnets.find((v) => v.id === s.vnetId);
          return (
            !!vnet &&
            sameSubscription(vnet.groupId) &&
            (!value('region') || vnet.region === value('region'))
          );
        })
        .map((s) => {
          const vnet = world.vnets.find((v) => v.id === s.vnetId)!;
          return [s.id, `${vnet.name} / ${s.name} · ${s.addressPrefix} · ${s.id}`];
        });
    case 'region':
      return regions.map((region) => [region, region]);
    case 'sku':
      return definition.type === T.gateway
        ? [['Standard_v2', 'Standard_v2 · private-only configuration']]
        : [['Standard_AzureFrontDoor', 'Standard_AzureFrontDoor']];
    case 'enabled':
      return [
        ['true', 'Enabled'],
        ['false', 'Disabled'],
      ];
    case 'mode':
      return [
        ['Prevention', 'Prevention'],
        ['Detection', 'Detection'],
      ];
    case 'operator':
      return [
        ['Equal', 'Equal'],
        ['BeginsWith', 'BeginsWith'],
      ];
    case 'action':
      return [
        ['Block', 'Block'],
        ['Allow', 'Allow'],
      ];
    case 'port':
      return [
        ['80', '80'],
        ['8080', '8080'],
      ];
    default:
      return undefined;
  }
}

function operation(
  definition: FamilyDefinition,
  type: DeliveryCommand['type'],
  fieldString: string,
): IntegratedOperation {
  const fields = fieldString.split(' ');
  const parentField = {
    frontDoors: 'groupId',
    frontDoorEndpoints: 'profileId',
    originGroups: 'profileId',
    origins: 'originGroupId',
    deliveryRoutes: 'endpointId',
    wafPolicies: 'groupId',
    wafRules: 'policyId',
    securityPolicies: 'profileId',
    applicationGateways: 'groupId',
    backendPools: 'gatewayId',
    gatewayListeners: 'gatewayId',
    backendSettings: 'gatewayId',
    gatewayProbes: 'gatewayId',
    gatewayRules: 'gatewayId',
  }[definition.collection];
  return {
    type,
    label: t.operations[type],
    fields,
    availableIn: type.startsWith('Create') ? 'list' : 'resource',
    lockedFields: type.startsWith('Create')
      ? []
      : [definition.identity, ...fields.filter((field) => field === parentField)],
    fieldLabels: t.fields,
    defaults: (world, resource) => {
      const current = Object.fromEntries(
        Object.entries(resource?.source ?? {}).map(([key, value]) => [key, String(value)]),
      );
      const values: Values = {
        name: '',
        region: 'norwayeast',
        sku: definition.type === T.gateway ? 'Standard_v2' : 'Standard_AzureFrontDoor',
        enabled: 'true',
        priority: '1',
        probePath: '/health',
        path: '/health',
        pattern: '/*',
        mode: 'Prevention',
        operator: 'BeginsWith',
        value: '/blocked',
        action: 'Block',
        port: '80',
        ...current,
      };
      if (resource && !type.startsWith('Create')) values[definition.identity] = resource.id;
      for (const field of fields) {
        if (values[field] === undefined || values[field] === '') {
          const options = deliveryOptions(definition, type, field, world, resource, values);
          values[field] = options?.[0]?.[0] ?? values[field] ?? '';
        }
      }
      return values;
    },
    options: (field, world, resource, values) =>
      deliveryOptions(definition, type, field, world, resource, values),
    change: (field, _value, values, world) => {
      if (
        !['profileId', 'endpointId', 'originGroupId', 'gatewayId', 'groupId', 'region'].includes(
          field,
        )
      )
        return values;
      const next = { ...values };
      for (const key of fields) {
        if (
          key === field ||
          !key.endsWith('Id') ||
          (!type.startsWith('Create') && key === definition.identity)
        )
          continue;
        const options = deliveryOptions(definition, type, key, world, undefined, next);
        if (options && !options.some(([id]) => id === next[key])) next[key] = options[0]?.[0] ?? '';
      }
      return next;
    },
  };
}

function DeliveryAnalysisPanel({
  world,
  workspace,
  resource,
}: {
  world: World;
  workspace: string;
  resource: IntegratedResource;
}) {
  const endpointOptions = world.delivery.frontDoorEndpoints.filter((e) =>
    resource.type === T.frontDoor ? e.profileId === resource.id : e.id === resource.id,
  );
  const gateway = resource.type === T.gateway;
  const [endpointId, setEndpointId] = useState(endpointOptions[0]?.id ?? ''),
    [path, setPath] = useState('/health'),
    [port, setPort] = useState('80'),
    [result, setResult] = useState<DeliveryAnalysis | null>(null);
  const validBinding =
    result?.binding.workspace === workspace &&
    result.binding.model === world.model &&
    result.binding.revision === world.revision;
  const change = (update: () => void) => {
    update();
    setResult(null);
  };
  return (
    <section aria-label={t.analysis}>
      <h2>{t.analysis}</h2>
      <p>{gateway ? t.privateGateway : t.boundary}</p>
      {!gateway && !endpointOptions.length ? (
        <p>{t.noEndpoint}</p>
      ) : (
        <form
          className="lab-form"
          onSubmit={(event) => {
            event.preventDefault();
            const context = {
              ...deliveryContext(world),
              workspace,
              model: world.model,
              revision: world.revision,
            };
            setResult(
              gateway
                ? analyseApplicationGateway(
                    world.delivery,
                    { gatewayId: resource.id, protocol: 'Http', port, path },
                    context,
                  )
                : analyseFrontDoor(
                    world.delivery,
                    { endpointId, protocol: 'Https', path },
                    context,
                  ),
            );
          }}
        >
          <fieldset>
            <legend>{t.analysisInput}</legend>
            {!gateway && (
              <label>
                {t.endpoint}
                <select
                  aria-label={t.endpoint}
                  value={endpointId}
                  onChange={(event) => change(() => setEndpointId(event.target.value))}
                >
                  {endpointOptions.map((endpoint) => (
                    <option key={endpoint.id} value={endpoint.id}>
                      {endpoint.name} · {endpoint.id}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {gateway && (
              <label>
                {t.port}
                <select
                  aria-label={t.port}
                  value={port}
                  onChange={(event) => change(() => setPort(event.target.value))}
                >
                  <option value="80">80</option>
                  <option value="8080">8080</option>
                </select>
              </label>
            )}
            <label>
              {t.path}
              <input
                aria-label={t.path}
                value={path}
                maxLength={120}
                required
                onChange={(event) => change(() => setPath(event.target.value))}
              />
            </label>
            <button type="submit">{t.analyse}</button>
          </fieldset>
        </form>
      )}
      {result && validBinding && (
        <section aria-label={t.result} aria-live="polite">
          <h3>{t.statuses[result.status]}</h3>
          <PropertyList
            items={[
              ['Workspace', result.binding.workspace],
              ['Model', result.binding.model],
              ['Revision', result.binding.revision],
              ['Endpoint / gateway ID', result.resourceId],
              [t.path, path],
              ['Status', result.status],
              ['Selected route / rule ID', result.routeId ?? '—'],
              ['Eligible origin IDs', result.eligibleOriginIds.join(', ') || '—'],
              ['Web App backend IDs', result.backendIds.join(', ') || '—'],
              ['WAF policy ID', result.waf?.policyId ?? '—'],
              ['WAF rule ID', result.waf?.ruleId ?? '—'],
              ['WAF configured mode', result.waf?.mode ?? '—'],
              ['WAF action', result.waf?.action ?? '—'],
              ['Network policy', result.networkPolicy],
              ['Connectivity', result.connectivity],
            ]}
          />
          {result.steps.length > 0 && (
            <ol>
              {result.steps.map((step, index) => (
                <li key={`${step.type}:${step.resourceId}:${index}`}>
                  <code>{step.resourceId}</code>: {step.reason}
                </li>
              ))}
            </ol>
          )}
          {result.probes.length > 0 && (
            <>
              <h3>{t.probe}</h3>
              <ul>
                {result.probes.map((probe) => (
                  <li key={probe.originId}>
                    <code>{probe.webAppId}</code> · {probe.path} · {probe.result}: {probe.reason}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
      <p>{t.analysisLimit}</p>
    </section>
  );
}

export const deliveryFamilies: IntegratedFamily[] = definitions.map((definition) => ({
  view: definition.view,
  label: definition.label,
  type: definition.type,
  resources: (world) => deliveryInventory(world).filter((r) => r.type === definition.type),
  operations: definition.operations.map(([type, fields]) => operation(definition, type, fields)),
  ...(new Set<string>([T.frontDoor, T.endpoint, T.gateway]).has(definition.type)
    ? {
        analysis: (world: World, workspace: string, resource: IntegratedResource) => (
          <DeliveryAnalysisPanel
            key={`${workspace}:${world.model}:${world.revision}:${resource.id}`}
            world={world}
            workspace={workspace}
            resource={resource}
          />
        ),
      }
    : {}),
}));

export function DeliveryViews(props: IntegratedViewsProps) {
  return <IntegratedResourceViews {...props} families={deliveryFamilies} />;
}
