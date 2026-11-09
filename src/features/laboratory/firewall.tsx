'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { World as PreviousWorld, Command } from '@/laboratory/v35/contract';
type World =
  | PreviousWorld
  | import('@/laboratory/v36/contract').World
  | import('@/laboratory/v37/contract').World
  | import('@/laboratory/v38/contract').World;
import type { PolicyAnalysis as PreviousAnalysis } from '@/laboratory/v35/analysis';
import { laboratoryFirewallNb as f } from '@/content/laboratory-firewall-nb';
import { laboratoryV3Nb as c } from '@/content/nb';
import { PropertyList } from '@/features/portal/shared';
import { PortalTable } from '@/features/portal/presentation';
type PolicyAnalysis =
  | PreviousAnalysis
  | import('@/laboratory/v36/analysis').PolicyAnalysis
  | import('@/laboratory/v37/analysis').PolicyAnalysis
  | import('@/laboratory/v38/analysis').PolicyAnalysis;
const href = (view: string, id?: string) =>
  '/labs/laboratory?' + new URLSearchParams({ view, ...(id ? { id } : {}) });
export function firewallDefaults(
  world: World,
  id: string | null,
  type?: import('@/laboratory/engine').Command['type'],
) {
  const policy = world.firewallPolicies.find((p) => p.id === id) ?? world.firewallPolicies[0],
    group = world.firewallGroups.find((p) => p.id === id) ?? world.firewallGroups[0],
    collection = world.firewallCollections.find((p) => p.id === id) ?? world.firewallCollections[0],
    fw = world.firewalls.find((p) => p.id === id) ?? world.firewalls[0],
    peering = world.peerings.find((p) => p.id === id) ?? world.peerings[0];
  const subnet =
    type === 'CreateAzureFirewall'
      ? (world.subnets.find((s) => s.id === id && s.name === 'AzureFirewallSubnet') ??
        world.subnets.find((s) => s.name === 'AzureFirewallSubnet'))
      : undefined;
  const vnet = world.vnets.find((v) => v.id === subnet?.vnetId);
  const scope = world.groups.find((g) => g.id === vnet?.groupId);
  const compatiblePolicy =
    vnet &&
    scope &&
    world.firewallPolicies.find(
      (p) =>
        p.region === vnet.region &&
        world.groups.find((g) => g.id === p.groupId)?.subscriptionId === scope.subscriptionId,
    );
  return {
    policyId: policy?.id ?? '',
    collectionGroupId: group?.id ?? '',
    collectionId: collection?.id ?? '',
    firewallId: fw?.id ?? '',
    peeringId: peering?.id ?? '',
    routeId: world.routes.find((r) => r.id === id)?.id ?? '',
    nextHopIp: fw?.privateIpAddress ?? '',
    value: String(peering?.allowForwardedTraffic ?? false),
    tier: 'Standard',
    threatIntelMode: 'Off',
    skuName: 'AZFW_VNet',
    skuTier: 'Standard',
    action: 'Allow',
    ...(type === 'CreateAzureFirewall'
      ? {
          subnetId: subnet?.id ?? '',
          groupId: vnet?.groupId ?? '',
          region: vnet?.region ?? '',
          policyId: compatiblePolicy?.id ?? '',
        }
      : {}),
  };
}
export function firewallOptions(world: World, key: string): [string, string][] | undefined {
  const choices = (rows: { id: string; name: string }[]) =>
    rows.map((x) => [x.id, x.name + ' · ' + x.id] as [string, string]);
  const map: Record<string, [string, string][]> = {
    groupId: world.groups.map((g) => [g.id, g.name + ' · ' + g.subscriptionId]),
    region: [
      ['norwayeast', 'Norway East'],
      ['westeurope', 'West Europe'],
      ['northeurope', 'North Europe'],
    ],
    policyId: choices(world.firewallPolicies),
    collectionGroupId: choices(world.firewallGroups),
    collectionId: choices(world.firewallCollections),
    firewallId: world.firewalls.map((x) => [
      x.id,
      x.name + ' · ' + x.privateIpAddress + ' · ' + x.id,
    ]),
    peeringId: world.peerings.map((x) => [
      x.id,
      x.name + ' · ' + x.vnetId + ' → ' + x.remoteVnetId,
    ]),
    routeId: choices(world.routes),
    subnetId: world.subnets
      .filter((s) => s.name === 'AzureFirewallSubnet')
      .map((s) => [
        s.id,
        (world.vnets.find((v) => v.id === s.vnetId)?.name ?? s.vnetId) +
          ' / ' +
          s.name +
          ' · ' +
          s.addressPrefix,
      ]),
    routeTableId: choices(world.routeTables),
    tier: [['Standard', 'Standard']],
    threatIntelMode: [['Off', 'Off · ikke modellert']],
    skuName: [['AZFW_VNet', 'VNet-based']],
    skuTier: [['Standard', 'Standard']],
    action: [
      ['Allow', 'Allow'],
      ['Deny', 'Deny'],
    ],
    value: [
      ['false', 'Av · ikke tillat mottak av videresendt trafikk'],
      ['true', 'På · tillat mottak fra eksternt VNet'],
    ],
    protocol: [
      ['Tcp', 'TCP'],
      ['Udp', 'UDP'],
    ],
  };
  return map[key];
}
export function FirewallViews({
  world,
  view,
  id,
  begin,
  disabled,
  list,
  receipt,
}: {
  world: World;
  view: string;
  id: string | null;
  begin: (type: Command['type']) => void;
  disabled: boolean;
  list: (type: string, rows: { id: string; name: string; origin: string }[]) => ReactNode;
  receipt: (id: string) => ReactNode;
}) {
  const fw = world.firewalls.find((x) => x.id === id),
    policy = world.firewallPolicies.find((x) => x.id === id),
    group = world.firewallGroups.find((x) => x.id === id),
    collection = world.firewallCollections.find((x) => x.id === id),
    rule = world.firewallRules.find((x) => x.id === id),
    pip = world.publicIps.find((x) => x.id === id),
    peering = world.peerings.find((x) => x.id === id),
    route = world.routes.find((x) => x.id === id);
  const link = (kind: string, target?: { id: string; name: string }) =>
    target ? (
      <Link href={href(kind, target.id)}>
        {target.name} · {target.id}
      </Link>
    ) : (
      '—'
    );
  const button = (type: Command['type'], available = true) => (
    <button disabled={disabled || !available} onClick={() => begin(type)}>
      {f.operations[type as keyof typeof f.operations]}
    </button>
  );
  return (
    <>
      {view === 'firewalls' && (
        <>
          <p>{f.boundary}</p>
          {button(
            'CreateAzureFirewall',
            !!world.firewallPolicies.length &&
              world.subnets.some((s) => s.name === 'AzureFirewallSubnet'),
          )}
          {list('firewall', world.firewalls)}
        </>
      )}
      {view === 'firewallPolicies' && (
        <>
          <p>{f.policyNote}</p>
          {button('CreateFirewallPolicy', !!world.groups.length)}
          {list('firewallPolicy', world.firewallPolicies)}
        </>
      )}
      {view === 'publicIps' && (
        <>
          <p>{f.publicNote}</p>
          {list('publicIp', world.publicIps)}
        </>
      )}
      {view === 'firewall' && fw && (
        <>
          <p>{f.boundary}</p>
          <PropertyList
            items={[
              [c.id, fw.id],
              [
                c.group,
                link(
                  'group',
                  world.groups.find((g) => g.id === fw.groupId),
                ),
              ],
              [c.region, fw.region],
              [c.subscription, world.groups.find((g) => g.id === fw.groupId)?.subscriptionId],
              ['Deployment / tier', fw.skuName + ' / ' + fw.skuTier],
              [
                'Hub VNet',
                link(
                  'vnet',
                  world.vnets.find(
                    (v) => v.id === world.subnets.find((s) => s.id === fw.subnetId)?.vnetId,
                  ),
                ),
              ],
              [
                'Subnet',
                link(
                  'subnet',
                  world.subnets.find((s) => s.id === fw.subnetId),
                ),
              ],
              ['Private IPv4', fw.privateIpAddress],
              [
                f.fields.publicIpId,
                link(
                  'publicIp',
                  world.publicIps.find((p) => p.id === fw.publicIpId),
                ),
              ],
              [
                f.fields.policyId,
                link(
                  'firewallPolicy',
                  world.firewallPolicies.find((p) => p.id === fw.policyId),
                ),
              ],
            ]}
          />
          <p>{f.privateNote}</p>
          {receipt(fw.origin)}
          <p>
            <Link href={href('policy')}>{f.analysis}</Link>
          </p>
        </>
      )}
      {view === 'firewallPolicy' && policy && (
        <>
          <p>{f.policyNote}</p>
          <PropertyList
            items={[
              [c.id, policy.id],
              [c.region, policy.region],
              [
                c.group,
                link(
                  'group',
                  world.groups.find((g) => g.id === policy.groupId),
                ),
              ],
              ['Tier', policy.tier],
              ['Threat intelligence', policy.threatIntelMode],
            ]}
          />
          {receipt(policy.origin)}
          <h2>{f.groups}</h2>
          {button('CreateFirewallRuleCollectionGroup')}
          {list(
            'firewallGroup',
            world.firewallGroups.filter((x) => x.policyId === policy.id),
          )}
          <h2>{f.firewalls}</h2>
          {list(
            'firewall',
            world.firewalls.filter((x) => x.policyId === policy.id),
          )}
        </>
      )}
      {view === 'firewallGroup' && group && (
        <>
          <PropertyList
            items={[
              [c.id, group.id],
              [
                f.fields.policyId,
                link(
                  'firewallPolicy',
                  world.firewallPolicies.find((p) => p.id === group.policyId),
                ),
              ],
              ['Priority', group.priority],
            ]}
          />
          {receipt(group.origin)}
          <h2>{f.collections}</h2>
          {button('CreateFirewallNetworkCollection')}
          {list(
            'firewallCollection',
            world.firewallCollections.filter((x) => x.collectionGroupId === group.id),
          )}
        </>
      )}
      {view === 'firewallCollection' && collection && (
        <>
          <p>{f.policyNote}</p>
          <PropertyList
            items={[
              [c.id, collection.id],
              [
                f.fields.collectionGroupId,
                link(
                  'firewallGroup',
                  world.firewallGroups.find((g) => g.id === collection.collectionGroupId),
                ),
              ],
              ['Priority', collection.priority],
              [f.fields.action, collection.action],
            ]}
          />
          {receipt(collection.origin)}
          <h2>{f.rules}</h2>
          {button('CreateFirewallNetworkRule')}
          {list(
            'firewallRule',
            world.firewallRules.filter((x) => x.collectionId === collection.id),
          )}
        </>
      )}
      {view === 'firewallRule' && rule && (
        <>
          <PropertyList
            items={[
              [c.id, rule.id],
              [
                f.fields.collectionId,
                link(
                  'firewallCollection',
                  world.firewallCollections.find((g) => g.id === rule.collectionId),
                ),
              ],
              ['Source', rule.source],
              ['Destination', rule.destination],
              ['Protocol', rule.protocol],
              ['Destination port', rule.destinationPort],
            ]}
          />
          <p>{f.policyNote}</p>
          {receipt(rule.origin)}
        </>
      )}
      {view === 'publicIp' && pip && (
        <>
          <p>{f.publicNote}</p>
          <PropertyList
            items={[
              [c.id, pip.id],
              [c.region, pip.region],
              [
                c.group,
                link(
                  'group',
                  world.groups.find((g) => g.id === pip.groupId),
                ),
              ],
              ['SKU / tier', pip.sku + ' / ' + pip.tier],
              ['Allocation', pip.allocation],
              ['IP version', pip.ipVersion],
              ['Public address', f.unallocated],
              [
                'Firewall',
                link(
                  'firewall',
                  world.firewalls.find((x) => x.publicIpId === pip.id),
                ),
              ],
            ]}
          />
          {receipt(pip.origin)}
        </>
      )}
      {view === 'peering' && peering && (
        <>
          <h2>{f.fields.allowForwardedTraffic}</h2>
          <p>{f.peerNote}</p>
          <PropertyList
            items={[[f.fields.allowForwardedTraffic, peering.allowForwardedTraffic ? 'På' : 'Av']]}
          />
          {button('SetPeeringForwardedTraffic')}
          {peering.forwardingOrigin && receipt(peering.forwardingOrigin)}
        </>
      )}
      {view === 'route' && route && (
        <>
          <p>{f.routeNote}</p>
          {route.nextHopType === 'VirtualAppliance' && (
            <PropertyList
              items={[
                [
                  f.fields.firewallId,
                  link(
                    'firewall',
                    world.firewalls.find((f) => f.id === route.firewallId),
                  ),
                ],
                [f.fields.nextHopIp, route.nextHopIp],
              ]}
            />
          )}{' '}
          {button('DeleteRoute')}
        </>
      )}
      {view === 'subnet' && id && (
        <>
          <h2>{f.firewalls}</h2>
          {list(
            'firewall',
            world.firewalls.filter((f) => f.subnetId === id),
          )}
        </>
      )}
    </>
  );
}
export function FirewallPathDetails({
  world,
  analysis,
}: {
  world: World;
  analysis: PolicyAnalysis;
}) {
  const path = analysis.firewallPath,
    fw = world.firewalls.find((x) => x.id === path.firewallId),
    decision = path.decision;
  const resourceLink = (view: string, id: string, name?: string) => (
    <Link href={href(view, id)}>{name ?? id}</Link>
  );
  const denied = analysis.layers.find((l) => l.status === 'deny'),
    nsgRule = denied?.rules.find((r) => r.id === denied.matchedRuleId);
  return (
    <section className="lab-firewall-path" aria-label={f.result}>
      <strong
        className="lab-policy-outcome"
        data-outcome={analysis.status}
        data-firewall-outcome={path.disposition}
      >
        {f.outcome[path.disposition]}
      </strong>
      <p>{f.reasons[analysis.reason as keyof typeof f.reasons] ?? f.unknown}</p>
      {decision?.matchedRuleId && (
        <p>
          {f.matchedRule}:{' '}
          <strong>
            {resourceLink(
              'firewallRule',
              decision.matchedRuleId,
              world.firewallRules.find((r) => r.id === decision.matchedRuleId)?.name,
            )}
          </strong>{' '}
          ·{' '}
          {resourceLink(
            'firewallCollection',
            decision.collectionId!,
            world.firewallCollections.find((c) => c.id === decision.collectionId)?.name,
          )}{' '}
          · {decision.status === 'allow' ? 'Allow' : 'Deny'}
        </p>
      )}
      {nsgRule && denied && (
        <p>
          {f.decisiveNsg}: <strong>{resourceLink('rule', nsgRule.id, nsgRule.name)}</strong> ·{' '}
          {nsgRule.priority} · {nsgRule.access}
        </p>
      )}
      <p className="lab-network-boundary">{f.noTraffic}</p>
      {fw && (
        <PropertyList
          items={[
            [f.fields.firewallId, resourceLink('firewall', fw.id, fw.name)],
            [
              f.fields.policyId,
              resourceLink(
                'firewallPolicy',
                fw.policyId,
                world.firewallPolicies.find((p) => p.id === fw.policyId)?.name,
              ),
            ],
          ]}
        />
      )}
      <p>{path.configurationPathAssessed ? f.assessed : f.incomplete}</p>
      <details>
        <summary>{f.pathDetails}</summary>
        <ol>
          {(
            [
              [f.forward, path.forwardRoute],
              [f.nextHop, path.nextHopRoute],
              [f.onward, path.onwardRoute],
              [f.back, path.returnRoute],
              [f.returnNextHop, path.returnNextHopRoute],
              [f.hubBack, path.hubReturnRoute],
            ] as const
          ).map(([title, route]) => (
            <li key={title}>
              <strong>{title}</strong>
              <p>
                {route
                  ? `${route.selected.addressPrefix} → ${route.selected.nextHop}${route.selected.nextHopIp ? ' · ' + route.selected.nextHopIp : ''}`
                  : f.unassessed}
              </p>
              {route?.selected.resourceId && route.selected.nextHop !== 'VirtualAppliance' && (
                <p>
                  {resourceLink(
                    'vnet',
                    route.selected.resourceId,
                    world.vnets.find((v) => v.id === route.selected.resourceId)?.name,
                  )}
                </p>
              )}
              {route && (
                <Link
                  href={
                    href('analysis', route.subnetId) +
                    '&destination=' +
                    encodeURIComponent(route.destination)
                  }
                >
                  {route.subnetId} · {f.pathDetails}
                </Link>
              )}
            </li>
          ))}
        </ol>
        {path.receivingPeerings.length > 0 && (
          <ul>
            {path.receivingPeerings.map((p) => (
              <li key={p.id}>
                {resourceLink('peering', p.id, world.peerings.find((x) => x.id === p.id)?.name)} ·{' '}
                {p.direction === 'forward' ? f.forward : f.back} · {f.fields.allowForwardedTraffic}:{' '}
                {p.allowForwardedTraffic ? f.yes : f.no}
              </li>
            ))}
          </ul>
        )}
        <p>{f.returnNote}</p>
      </details>
      {decision && (
        <details>
          <summary>{f.trace}</summary>
          <p>
            {decision.reason === 'default-deny'
              ? f.reasons['firewall-default-deny']
              : decision.reason === 'missing-policy'
                ? f.unknown
                : ''}
          </p>
          <PortalTable
            caption={f.trace}
            rows={decision.trace.map((x) => ({ ...x, id: x.ruleId }))}
            empty={c.empty}
            columns={[
              {
                key: 'group',
                label: f.groupPriority,
                cell: (x) => (
                  <>
                    {resourceLink(
                      'firewallGroup',
                      x.groupId,
                      world.firewallGroups.find((g) => g.id === x.groupId)?.name,
                    )}{' '}
                    · {x.groupPriority}
                  </>
                ),
              },
              {
                key: 'collection',
                label: f.collectionPriority,
                cell: (x) => (
                  <>
                    {resourceLink(
                      'firewallCollection',
                      x.collectionId,
                      world.firewallCollections.find((g) => g.id === x.collectionId)?.name,
                    )}{' '}
                    · {x.collectionPriority} · {x.action}
                  </>
                ),
              },
              {
                key: 'rule',
                label: f.ruleLabel,
                cell: (x) =>
                  resourceLink(
                    'firewallRule',
                    x.ruleId,
                    world.firewallRules.find((g) => g.id === x.ruleId)?.name,
                  ),
              },
              {
                key: 'match',
                label: f.matchLabel,
                cell: (x) => (
                  <>
                    {x.matched ? f.yes : f.no}
                    <small>
                      {Object.entries(x.checks)
                        .map(([key, v]) => key + ': ' + (v ? f.yes : f.no))
                        .join(' · ')}
                    </small>
                  </>
                ),
              },
            ]}
          />
        </details>
      )}
    </section>
  );
}
