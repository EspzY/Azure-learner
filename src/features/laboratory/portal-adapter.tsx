'use client';
import { isFirewallWorld } from './capabilities';

import { useState } from 'react';
import Link from 'next/link';
import type { World } from '@/laboratory/engine';
import { nb, regionLabels, laboratoryV3Nb as c } from '@/content/nb';
import { portalWorkspaceNb as copy } from '@/content/portal-workspace-nb';
import { ServiceIcon } from '@/features/portal/service-icon';
import { peeringState } from './capabilities';
import { PortalListFilters, PortalTable, type PortalColumn } from '@/features/portal/presentation';

export type LaboratoryResource = {
  readonly id: string;
  readonly name: string;
  readonly view: keyof typeof copy.resourceKinds;
  readonly kind: string;
  readonly typeName: string;
  readonly category: 'scope' | 'resource' | 'subresource' | 'data';
  readonly groupId: string;
  readonly groupName: string;
  readonly subscriptionId: string;
  readonly subscriptionName: string;
  readonly location: string;
  readonly locationName: string;
  readonly parentId?: string;
  readonly origin: string;
  readonly source: Readonly<object>;
  readonly status?: string;
};
const subscriptionName = (id: string) =>
  id === 'sub-shared' ? 'Shared Sandbox' : id === 'sub-app' ? 'App Sandbox' : id;

/** Ephemeral display projection. Never an inventory authority or a v2 World conversion. */
export function laboratoryInventory(world: World): readonly LaboratoryResource[] {
  const rows: LaboratoryResource[] = [];
  const add = (
    view: LaboratoryResource['view'],
    source: { id: string; name: string; origin: string },
    groupId: string,
    region: string,
    parentId?: string,
    status?: string,
  ) => {
    const group = world.groups.find((g) => g.id === groupId);
    rows.push({
      id: source.id,
      name: source.name,
      view,
      kind:
        view === 'appPlan'
          ? 'plans'
          : view === 'webApp'
            ? 'apps'
            : ['appDeployment', 'appSetting'].includes(view)
              ? 'settings'
              : view === 'group'
                ? 'groups'
                : ['rule', 'route'].includes(view)
                  ? 'properties'
                  : view,
      typeName: copy.resourceKinds[view],
      category:
        view === 'group'
          ? 'scope'
          : [
                'account',
                'vnet',
                'nsg',
                'routeTable',
                'nic',
                'vm',
                'disk',
                'firewall',
                'firewallPolicy',
                'publicIp',
                'appPlan',
                'webApp',
              ].includes(view)
            ? 'resource'
            : ['container', 'blob'].includes(view)
              ? 'data'
              : 'subresource',
      groupId,
      groupName: group?.name ?? groupId,
      subscriptionId: group?.subscriptionId ?? '',
      subscriptionName: subscriptionName(group?.subscriptionId ?? ''),
      location: region,
      locationName: regionLabels[region as keyof typeof regionLabels] ?? region,
      parentId,
      origin: source.origin,
      source,
      ...(status ? { status } : {}),
    });
  };
  for (const group of world.groups) add('group', group, group.id, group.metadataRegion);
  for (const account of world.accounts)
    add('account', account, account.groupId, account.region, account.groupId);
  for (const container of world.containers) {
    const account = world.accounts.find((a) => a.id === container.accountId);
    if (account) add('container', container, account.groupId, account.region, account.id);
  }
  for (const blob of world.blobs) {
    const container = world.containers.find((x) => x.id === blob.containerId);
    const account = world.accounts.find((x) => x.id === container?.accountId);
    if (container && account) add('blob', blob, account.groupId, account.region, container.id);
  }
  if (world.model !== 'laboratory@3.0.0') {
    for (const vnet of world.vnets) add('vnet', vnet, vnet.groupId, vnet.region, vnet.groupId);
    for (const subnet of world.subnets) {
      const vnet = world.vnets.find((x) => x.id === subnet.vnetId);
      if (vnet) add('subnet', subnet, vnet.groupId, vnet.region, vnet.id);
    }
    for (const nsg of world.nsgs) add('nsg', nsg, nsg.groupId, nsg.region, nsg.groupId);
    for (const rule of world.securityRules) {
      const nsg = world.nsgs.find((x) => x.id === rule.nsgId);
      if (nsg) add('rule', rule, nsg.groupId, nsg.region, nsg.id);
    }
  }
  if (
    world.model === 'laboratory@3.2.0' ||
    world.model === 'laboratory@3.3.0' ||
    world.model === 'laboratory@3.4.0' ||
    isFirewallWorld(world)
  ) {
    for (const table of world.routeTables)
      add('routeTable', table, table.groupId, table.region, table.groupId);
    for (const route of world.routes) {
      const table = world.routeTables.find((x) => x.id === route.routeTableId);
      if (table) add('route', route, table.groupId, table.region, table.id);
    }
    for (const peering of world.peerings) {
      const vnet = world.vnets.find((x) => x.id === peering.vnetId);
      if (vnet)
        add(
          'peering',
          peering,
          vnet.groupId,
          vnet.region,
          vnet.id,
          peeringState(world, peering.id),
        );
    }
  }
  if (
    world.model === 'laboratory@3.3.0' ||
    world.model === 'laboratory@3.4.0' ||
    isFirewallWorld(world)
  )
    for (const nic of world.nics) add('nic', nic, nic.groupId, nic.region, nic.subnetId);
  if (world.model === 'laboratory@3.4.0' || isFirewallWorld(world)) {
    for (const vm of world.vms) add('vm', vm, vm.groupId, vm.region, vm.groupId);
    for (const disk of world.disks) add('disk', disk, disk.groupId, disk.region, disk.groupId);
  }
  if (isFirewallWorld(world)) {
    for (const x of world.firewalls) add('firewall', x, x.groupId, x.region, x.groupId);
    for (const x of world.publicIps) add('publicIp', x, x.groupId, x.region, x.groupId);
    for (const x of world.firewallPolicies)
      add('firewallPolicy', x, x.groupId, x.region, x.groupId);
    for (const x of world.firewallGroups) {
      const p = world.firewallPolicies.find((p) => p.id === x.policyId);
      if (p) add('firewallGroup', x, p.groupId, p.region, p.id);
    }
    for (const x of world.firewallCollections) {
      const g = world.firewallGroups.find((g) => g.id === x.collectionGroupId),
        p = world.firewallPolicies.find((p) => p.id === g?.policyId);
      if (g && p) add('firewallCollection', x, p.groupId, p.region, g.id);
    }
    for (const x of world.firewallRules) {
      const c = world.firewallCollections.find((c) => c.id === x.collectionId),
        g = world.firewallGroups.find((g) => g.id === c?.collectionGroupId),
        p = world.firewallPolicies.find((p) => p.id === g?.policyId);
      if (c && p) add('firewallRule', x, p.groupId, p.region, c.id);
    }
  }
  if (world.model === 'laboratory@3.8.0') {
    for (const p of world.plans) add('appPlan', p, p.groupId, p.region, p.groupId);
    for (const a of world.webApps) add('webApp', a, a.groupId, a.region, a.groupId);
    for (const d of world.deployments) {
      const a = world.webApps.find((a) => a.id === d.webAppId);
      if (a) add('appDeployment', d, a.groupId, a.region, a.id);
    }
    for (const s of world.settings) {
      const a = world.webApps.find((a) => a.id === s.webAppId);
      if (a) add('appSetting', s, a.groupId, a.region, a.id);
    }
  }
  return rows;
}

export function LaboratoryResourceList({
  rows,
  groups = false,
  href,
}: {
  rows: readonly LaboratoryResource[];
  groups?: boolean;
  href: (view: string, id?: string) => string;
}) {
  const [query, setQuery] = useState(''),
    [subscription, setSubscription] = useState(''),
    [kind, setKind] = useState(''),
    [location, setLocation] = useState(''),
    [sort, setSort] = useState<'name' | 'typeName' | 'locationName'>('name'),
    [descending, setDescending] = useState(false);
  const order = (key: typeof sort) => {
    if (sort === key) setDescending(!descending);
    else {
      setSort(key);
      setDescending(false);
    }
  };
  const choices = (
    id: 'subscriptionId' | 'view' | 'location',
    name: 'subscriptionName' | 'typeName' | 'locationName',
  ) => [...new Map(rows.map((r) => [r[id], { id: r[id], name: r[name] }])).values()];
  const selected = rows
    .filter(
      (r) =>
        `${r.name} ${r.typeName}`.toLowerCase().includes(query.toLowerCase()) &&
        (!subscription || r.subscriptionId === subscription) &&
        (!kind || r.view === kind) &&
        (!location || r.location === location),
    )
    .sort((a, b) => {
      const comparison =
        a[sort].localeCompare(b[sort], 'en', { numeric: true, sensitivity: 'base' }) ||
        a.id.localeCompare(b.id);
      return descending ? -comparison : comparison;
    });
  const sorted = (key: typeof sort): 'ascending' | 'descending' | 'none' =>
    sort === key ? (descending ? 'descending' : 'ascending') : 'none';
  const columns: PortalColumn<LaboratoryResource>[] = [
    {
      key: 'name',
      label: (
        <>
          {nb.portal.name}
          <span aria-hidden="true"> {sort === 'name' ? (descending ? '↓' : '↑') : '↕'}</span>
        </>
      ),
      sort: sorted('name'),
      onSort: () => order('name'),
      cell: (r) => (
        <Link className="portal-resource-link" href={href(r.view, r.id)}>
          <ServiceIcon kind={r.kind} />
          {r.name}
        </Link>
      ),
    },
    ...(rows.some((r) => r.status)
      ? [{ key: 'status', label: 'Status', cell: (r: LaboratoryResource) => r.status ?? '—' }]
      : []),
    ...(groups
      ? [
          {
            key: 'subscription',
            label: nb.portal.subscription,
            cell: (r: LaboratoryResource) => r.subscriptionName,
          },
        ]
      : [
          {
            key: 'kind',
            label: nb.portal.type,
            sort: sorted('typeName'),
            onSort: () => order('typeName'),
            cell: (r: LaboratoryResource) => r.typeName,
          },
          { key: 'group', label: nb.portal.group, cell: (r: LaboratoryResource) => r.groupName },
        ]),
    {
      key: 'location',
      label: nb.portalUi.location,
      sort: sorted('locationName'),
      onSort: () => order('locationName'),
      cell: (r) => (
        <span title={groups ? nb.portal.locationNote : undefined}>{r.locationName}</span>
      ),
    },
    ...(!groups
      ? [
          {
            key: 'subscription',
            label: nb.portal.subscription,
            cell: (r: LaboratoryResource) => r.subscriptionName,
          },
        ]
      : []),
  ];
  return (
    <section className="portal-resource-list">
      <PortalListFilters
        query={query}
        onQuery={setQuery}
        subscription={subscription}
        onSubscription={setSubscription}
        subscriptions={choices('subscriptionId', 'subscriptionName')}
        kind={kind}
        onKind={groups ? undefined : setKind}
        kinds={choices('view', 'typeName')}
        location={location}
        onLocation={setLocation}
        locations={choices('location', 'locationName')}
      />
      <PortalTable
        rows={selected}
        columns={columns}
        caption={
          <>
            {nb.portal.resources} · {selected.length}
          </>
        }
        empty={c.empty}
      />
    </section>
  );
}
