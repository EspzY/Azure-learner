'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { labsNb, nb, regionLabels, learningPolishNb as polish } from '@/content/nb';
import { infrastructure } from '@/domain/sandbox/model';
import {
  filterInventory,
  inventory,
  resourceInventory,
  type Area,
  type InventoryRow,
  type ResourceSection,
} from '@/domain/portal/model';
import type { World } from '@/domain/chapter01/model';
import { ServiceIcon } from './service-icon';
import { PropertyList, type Navigate } from './shared';
import {
  PortalListFilters,
  PortalTable,
  PortalResourceLayout,
  PortalResourceMenu,
  type PortalColumn,
  type ResourceMenuItem,
} from './presentation';
const p = nb.portal;
export function ResourceTable({
  world,
  navigate,
  area,
  rows: provided,
  compact = false,
}: {
  world: World;
  navigate: Navigate;
  area?: Area;
  rows?: InventoryRow[];
  compact?: boolean;
}) {
  const [query, setQuery] = useState(''),
    [subscription, setSubscription] = useState(''),
    [kind, setKind] = useState(''),
    [location, setLocation] = useState(''),
    [sort, setSort] = useState<'name' | 'kind' | 'location'>('name'),
    [descending, setDescending] = useState(false);
  const supported = inventory(world);
  const base =
    provided ??
    supported.filter((r) =>
      area === 'groups'
        ? r.kind === 'group'
        : area === 'subscriptions'
          ? r.kind === 'subscription'
          : area === 'plans'
            ? r.kind === 'plan'
            : area === 'apps'
              ? r.kind === 'app'
              : area === 'vms'
                ? r.kind === 'vm'
                : r.kind !== 'subscription' && r.kind !== 'group',
    );
  const rows = filterInventory(base, query, subscription, kind)
    .filter((r) => !location || r.location === location)
    .sort((a, b) => {
      const order =
        String(a[sort] ?? '').localeCompare(String(b[sort] ?? ''), 'en', {
          numeric: true,
          sensitivity: 'base',
        }) || a.id.localeCompare(b.id);
      return descending ? -order : order;
    });
  const orderBy = (key: typeof sort) => {
    if (key === sort) setDescending(!descending);
    else {
      setSort(key);
      setDescending(false);
    }
  };
  const columns: PortalColumn<InventoryRow>[] = [
    {
      key: 'name',
      label: (
        <>
          {p.name}
          <span aria-hidden="true"> {sort === 'name' ? (descending ? '↓' : '↑') : '↕'}</span>
        </>
      ),
      sort: sort === 'name' ? (descending ? 'descending' : 'ascending') : 'none',
      onSort: () => orderBy('name'),
      cell: (r) => (
        <button
          type="button"
          className="portal-resource-link"
          onClick={() => navigate('resource', { id: r.id })}
        >
          <ServiceIcon kind={r.kind} />
          {r.name}
        </button>
      ),
    },
    ...(area === 'groups'
      ? [
          {
            key: 'subscription',
            label: p.subscription,
            cell: (r: InventoryRow) => world.scopes.find((s) => s.id === r.subscriptionId)?.name,
          },
        ]
      : [
          {
            key: 'kind',
            label: p.type,
            sort:
              sort === 'kind'
                ? descending
                  ? ('descending' as const)
                  : ('ascending' as const)
                : ('none' as const),
            onSort: () => orderBy('kind'),
            cell: (r: InventoryRow) => p.graph.types[r.kind],
          },
          {
            key: 'group',
            label: p.group,
            cell: (r: InventoryRow) => world.groups.find((g) => g.id === r.groupId)?.name ?? '—',
          },
        ]),
    {
      key: 'location',
      label: nb.portalUi.location,
      sort: sort === 'location' ? (descending ? 'descending' : 'ascending') : 'none',
      onSort: () => orderBy('location'),
      cell: (r) => (
        <>
          <span title={r.kind === 'group' ? p.locationNote : undefined}>
            {r.location ? regionLabels[r.location as keyof typeof regionLabels] : '—'}
          </span>
          {r.kind === 'group' && area !== 'groups' && <small>{p.metadata}</small>}
        </>
      ),
    },
    ...(area !== 'groups'
      ? [
          {
            key: 'subscription',
            label: p.subscription,
            cell: (r: InventoryRow) => world.scopes.find((s) => s.id === r.subscriptionId)?.name,
          },
        ]
      : []),
  ];
  return (
    <section className="portal-resource-list">
      {!compact && (
        <PortalListFilters
          query={query}
          onQuery={setQuery}
          subscription={subscription}
          onSubscription={setSubscription}
          subscriptions={world.scopes.filter((s) => s.kind === 'subscription')}
          kind={kind}
          onKind={
            !['subscriptions', 'groups', 'plans', 'apps', 'vms'].includes(area ?? '')
              ? setKind
              : undefined
          }
          kinds={(['group', 'plan', 'app', 'vm', 'disk', 'nic', 'vnet', 'subnet'] as const)
            .filter((k) => base.some((r) => r.kind === k))
            .map((k) => ({ id: k, name: p.graph.types[k] }))}
          location={location}
          onLocation={area !== 'subscriptions' ? setLocation : undefined}
          locations={[...new Set(base.map((r) => r.location).filter(Boolean))].map((region) => ({
            id: region!,
            name: regionLabels[region as keyof typeof regionLabels],
          }))}
        />
      )}
      <PortalTable
        rows={rows}
        columns={columns}
        caption={
          <>
            {p.resources} · {rows.length}
          </>
        }
      />
      {!rows.length && <p className="portal-empty">{p.noResource}</p>}
    </section>
  );
}

export type ResourceView = 'all' | 'disks' | 'network';
export function ResourceDetails({
  world,
  id,
  navigate,
  children,
  settings = false,
  commands,
  view = 'overview',
  evidence,
}: {
  world: World;
  id: string;
  navigate: Navigate;
  children?: (view: ResourceView) => React.ReactNode;
  settings?: boolean;
  commands?: React.ReactNode;
  view?: ResourceSection;
  evidence?: React.ReactNode;
}) {
  const sectionId = useId(),
    content = useRef<HTMLDivElement>(null);
  const vm = infrastructure(world).find((r) => r.id === id && r.kind === 'vm');
  const section = (view === 'disks' || view === 'network') && !vm ? 'overview' : view;
  const previous = useRef(section);
  useEffect(() => {
    if (previous.current === section) return;
    previous.current = section;
    const frame = requestAnimationFrame(() => content.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [section]);
  const row = inventory(world).find((r) => r.id === id),
    scope = world.scopes.find((s) => s.id === id),
    identity = world.identity.id === id ? world.identity : null;
  if (!row && !scope && !identity) return <p>{p.noResource}</p>;
  const name = row?.name ?? scope?.name ?? identity!.name;
  const parentId = row?.parentId ?? scope?.parentId ?? row?.groupId ?? row?.subscriptionId;
  const parentName =
    inventory(world).find((r) => r.id === parentId)?.name ??
    world.scopes.find((s) => s.id === parentId)?.name ??
    (parentId === world.identity.id ? world.identity.name : parentId);
  const members = resourceInventory(world).filter((r) =>
    row?.kind === 'subscription' ? r.subscriptionId === id : r.groupId === id,
  );
  const items: (readonly [string, React.ReactNode])[] = [
    ...(row?.groupId
      ? [
          [
            p.group,
            <button
              key="group"
              type="button"
              onClick={() => navigate('resource', { id: row.groupId })}
            >
              {world.groups.find((g) => g.id === row.groupId)?.name}
            </button>,
          ] as const,
        ]
      : []),
    [p.status, p.resourceState],
    [
      row?.kind === 'group' ? p.metadata : p.resourceLocation,
      row?.location ? regionLabels[row.location as keyof typeof regionLabels] : '—',
    ],
    ...(row?.subscriptionId
      ? [
          [
            p.subscription,
            <button
              key="subscription"
              type="button"
              onClick={() => navigate('resource', { id: row.subscriptionId })}
            >
              {world.scopes.find((s) => s.id === row.subscriptionId)?.name}
            </button>,
          ] as const,
        ]
      : []),
    ...(row?.kind === 'app'
      ? [
          [
            p.plan,
            row.planId ? (
              <button type="button" onClick={() => navigate('resource', { id: row.planId })}>
                {world.resources.find((r) => r.id === row.planId)?.name}
              </button>
            ) : (
              '—'
            ),
          ] as const,
        ]
      : []),
    ...(!row?.groupId
      ? [
          [
            p.parent,
            parentId ? (
              <button type="button" onClick={() => navigate('resource', { id: parentId })}>
                {parentName}
              </button>
            ) : (
              '—'
            ),
          ] as const,
        ]
      : []),
    ...(vm?.kind === 'vm'
      ? ([
          [labsNb.fields.image, labsNb.vm.images[vm.image]],
          [labsNb.fields.profile, labsNb.vm.profiles[vm.profile]],
        ] as const)
      : []),
  ];
  const select = (next: typeof section) => {
    navigate('resource', { id, view: next });
  };
  const menuItem = (key: typeof section, label: string): ResourceMenuItem => ({
    key,
    label,
    icon:
      key === 'overview'
        ? (row?.kind ?? scope?.kind ?? 'tenant')
        : key === 'disks'
          ? 'disk'
          : key === 'network'
            ? 'vnet'
            : key === 'relations'
              ? 'related'
              : 'properties',
    active: !settings && section === key,
    settings: key !== 'overview',
    onSelect: () => select(key),
  });
  const menuItems: ResourceMenuItem[] = [
    menuItem('overview', p.overview),
    {
      key: 'activity',
      label: p.areas.activity,
      icon: 'activity',
      onSelect: () => navigate('activity', { resource: id }),
    },
    menuItem('properties', nb.portalUi.properties),
    ...(children ? [menuItem('relations', nb.portalUi.related)] : []),
    ...(vm
      ? [menuItem('disks', nb.portalUi.disks), menuItem('network', nb.portalUi.networking)]
      : []),
    ...(row?.kind === 'app'
      ? [
          {
            key: 'settings',
            label: labsNb.settings.title,
            icon: 'settings',
            settings: true,
            active: settings,
            onSelect: () => navigate('settings', { id }),
          },
        ]
      : []),
  ];
  const source =
    infrastructure(world).find((r) => r.id === id) ??
    world.resources.find((r) => r.id === id) ??
    world.groups.find((r) => r.id === id) ??
    scope ??
    identity;
  return (
    <PortalResourceLayout
      contentRef={content}
      menu={
        <PortalResourceMenu
          name={name}
          icon={row?.kind ?? scope?.kind ?? 'tenant'}
          items={menuItems}
          learning={
            <>
              {' '}
              <details className="portal-resource-learning">
                <summary>{nb.portalUi.learningTools}</summary>
                <button type="button" onClick={() => navigate('architecture', { id })}>
                  {p.areas.architecture}
                </button>
                <button type="button" onClick={() => navigate('learn', { topic: 'practice' })}>
                  {p.relatedLearning}
                </button>
              </details>
            </>
          }
          footer={polish.resource.limitations}
        />
      }
    >
      {commands}
      {settings ? (
        children?.('all')
      ) : section === 'properties' ? (
        <section>
          <h2>{nb.portalUi.properties}</h2>
          <PropertyList
            items={[
              [nb.portalUi.localId, id],
              ...Object.entries(source ?? {}).map(
                ([key, value]) =>
                  [labsNb.fields[key as keyof typeof labsNb.fields] ?? key, String(value)] as const,
              ),
            ]}
          />
        </section>
      ) : (
        <>
          {section === 'overview' && (
            <>
              <h2 id={`${sectionId}-essentials`}>{nb.portalUi.essentials}</h2>
              <div className="portal-essentials">
                <PropertyList items={items.slice(0, 4)} />
                <PropertyList items={items.slice(4)} />
              </div>
              {row?.kind === 'group' && <p className="portal-inline-info">{p.locationNote}</p>}
              {row?.kind === 'app' && <p>{p.appNote}</p>}
              {row?.kind === 'plan' && <p>{p.planNote}</p>}
              {(row?.kind === 'group' || row?.kind === 'subscription') && (
                <>
                  <h2>{p.resources}</h2>
                  <ResourceTable world={world} navigate={navigate} rows={members} />
                </>
              )}
            </>
          )}
          {children && (
            <div className="portal-related-details">
              <h2>
                {section === 'disks'
                  ? nb.portalUi.disks
                  : section === 'network'
                    ? nb.portalUi.networking
                    : nb.portalUi.related}
              </h2>
              {children(section === 'disks' || section === 'network' ? section : 'all')}
            </div>
          )}
        </>
      )}
      {evidence}
    </PortalResourceLayout>
  );
}
