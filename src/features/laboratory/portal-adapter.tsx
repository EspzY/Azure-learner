'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { World } from '@/laboratory/engine';
import { nb, regionLabels, laboratoryV3Nb as c } from '@/content/nb';
import { portalWorkspaceNb as copy } from '@/content/portal-workspace-nb';
import { ServiceIcon } from '@/features/portal/service-icon';
import { peeringStatus } from '@/laboratory/v32/peering';
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
      kind: view === 'group' ? 'groups' : ['rule', 'route'].includes(view) ? 'properties' : view,
      typeName: copy.resourceKinds[view],
      category:
        view === 'group'
          ? 'scope'
          : ['account', 'vnet', 'nsg', 'routeTable'].includes(view)
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
  if (world.model === 'laboratory@3.2.0') {
    for (const table of world.routeTables)
      add('routeTable', table, table.groupId, table.region, table.groupId);
    for (const route of world.routes) {
      const table = world.routeTables.find((x) => x.id === route.routeTableId);
      if (table) add('route', route, table.groupId, table.region, table.id);
    }
    for (const peering of world.peerings) {
      const vnet = world.vnets.find((x) => x.id === peering.vnetId);
      if (vnet)
        add('peering', peering, vnet.groupId, vnet.region, vnet.id, peeringStatus(world, peering));
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
