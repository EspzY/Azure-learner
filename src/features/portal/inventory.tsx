'use client';
import { useId, useRef, useState } from 'react';
import { labsNb, nb, regionLabels, learningPolishNb as polish } from '@/content/nb';
import { infrastructure } from '@/domain/sandbox/model';
import {
  filterInventory,
  inventory,
  resourceInventory,
  type Area,
  type InventoryRow,
} from '@/domain/portal/model';
import type { World } from '@/domain/chapter01/model';
import { ServiceIcon } from './service-icon';
import { PropertyList, type Navigate } from './shared';
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
  return (
    <section className="portal-resource-list">
      {!compact && (
        <div className="portal-list-filters">
          <label>
            {p.filter}
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <label>
            {p.subscription}
            <select value={subscription} onChange={(e) => setSubscription(e.target.value)}>
              <option value="">{p.allSubscriptions}</option>
              {world.scopes
                .filter((s) => s.kind === 'subscription')
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </label>
          {!['subscriptions', 'groups', 'plans', 'apps', 'vms'].includes(area ?? '') && (
            <label>
              {p.type}
              <select value={kind} onChange={(e) => setKind(e.target.value)}>
                <option value="">{p.allTypes}</option>
                {(['group', 'plan', 'app', 'vm', 'disk', 'nic', 'vnet', 'subnet'] as const)
                  .filter((k) => base.some((row) => row.kind === k))
                  .map((k) => (
                    <option key={k} value={k}>
                      {p.graph.types[k]}
                    </option>
                  ))}
              </select>
            </label>
          )}
          {area !== 'subscriptions' && (
            <label>
              {nb.portalUi.location}
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">{nb.portalUi.allLocations}</option>
                {[...new Set(base.map((r) => r.location).filter(Boolean))].map((region) => (
                  <option key={region} value={region}>
                    {regionLabels[region as keyof typeof regionLabels]}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
      <div className="portal-table-scroll" tabIndex={0}>
        <table>
          <caption>
            {p.resources} · {rows.length}
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                aria-sort={sort === 'name' ? (descending ? 'descending' : 'ascending') : 'none'}
              >
                <button type="button" onClick={() => orderBy('name')}>
                  {p.name}
                  <span aria-hidden="true">
                    {' '}
                    {sort === 'name' ? (descending ? '↓' : '↑') : '↕'}
                  </span>
                </button>
              </th>
              {area === 'groups' && <th scope="col">{p.subscription}</th>}
              {area !== 'groups' && (
                <th
                  scope="col"
                  aria-sort={sort === 'kind' ? (descending ? 'descending' : 'ascending') : 'none'}
                >
                  <button type="button" onClick={() => orderBy('kind')}>
                    {p.type}
                  </button>
                </th>
              )}
              {area !== 'groups' && <th scope="col">{p.group}</th>}
              <th
                scope="col"
                aria-sort={sort === 'location' ? (descending ? 'descending' : 'ascending') : 'none'}
              >
                <button type="button" onClick={() => orderBy('location')}>
                  {nb.portalUi.location}
                </button>
              </th>
              {area !== 'groups' && <th scope="col">{p.subscription}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <button
                    type="button"
                    className="portal-resource-link"
                    onClick={() => navigate('resource', { id: r.id })}
                  >
                    <ServiceIcon kind={r.kind} />
                    {r.name}
                  </button>
                </td>
                {area === 'groups' && (
                  <td>{world.scopes.find((s) => s.id === r.subscriptionId)?.name}</td>
                )}
                {area !== 'groups' && <td>{p.graph.types[r.kind]}</td>}
                {area !== 'groups' && (
                  <td>{world.groups.find((g) => g.id === r.groupId)?.name ?? '—'}</td>
                )}
                <td>
                  <span title={r.kind === 'group' ? p.locationNote : undefined}>
                    {r.location ? regionLabels[r.location as keyof typeof regionLabels] : '—'}
                  </span>
                  {r.kind === 'group' && area !== 'groups' && <small>{p.metadata}</small>}
                </td>
                {area !== 'groups' && (
                  <td>{world.scopes.find((s) => s.id === r.subscriptionId)?.name}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
}: {
  world: World;
  id: string;
  navigate: Navigate;
  children?: (view: ResourceView) => React.ReactNode;
  settings?: boolean;
  commands?: React.ReactNode;
}) {
  const sectionId = useId(),
    content = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<
    'overview' | 'properties' | 'relations' | 'disks' | 'network'
  >('overview');
  const [query, setQuery] = useState('');
  const row = inventory(world).find((r) => r.id === id),
    scope = world.scopes.find((s) => s.id === id),
    identity = world.identity.id === id ? world.identity : null;
  if (!row && !scope && !identity) return <p>{p.noResource}</p>;
  const name = row?.name ?? scope?.name ?? identity!.name;
  const vm = infrastructure(world).find((r) => r.id === id && r.kind === 'vm');
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
    setSection(next);
    requestAnimationFrame(() => content.current?.focus({ preventScroll: true }));
  };
  const matches = (label: string) => label.toLowerCase().includes(query.toLowerCase());
  const menuButton = (key: typeof section, label: string) =>
    matches(label) && (
      <button
        key={key}
        type="button"
        aria-current={!settings && section === key ? 'page' : undefined}
        onClick={() => {
          select(key);
          if (settings) navigate('resource', { id });
        }}
      >
        <ServiceIcon
          kind={
            key === 'overview'
              ? (row?.kind ?? scope?.kind ?? 'tenant')
              : key === 'disks'
                ? 'disk'
                : key === 'network'
                  ? 'vnet'
                  : key === 'relations'
                    ? 'related'
                    : 'properties'
          }
        />
        {label}
      </button>
    );
  const source =
    infrastructure(world).find((r) => r.id === id) ??
    world.resources.find((r) => r.id === id) ??
    world.groups.find((r) => r.id === id) ??
    scope ??
    identity;
  return (
    <div className="portal-resource-overview">
      <nav className="portal-resource-menu" aria-label={`${name} · ${p.overview}`}>
        <strong>
          <ServiceIcon kind={row?.kind ?? scope?.kind ?? 'tenant'} />
          {name}
        </strong>
        <label className="portal-menu-search">
          <span className="sr-only">{nb.portalUi.resourceSearch}</span>
          <input
            type="search"
            placeholder={nb.portalUi.resourceSearch}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {menuButton('overview', p.overview)}
        {matches(p.areas.activity) && (
          <button type="button" onClick={() => navigate('activity', { id })}>
            <ServiceIcon kind="activity" />
            {p.areas.activity}
          </button>
        )}
        <details open>
          <summary>{nb.portalUi.settings}</summary>
          {menuButton('properties', nb.portalUi.properties)}
          {children && menuButton('relations', nb.portalUi.related)}
          {vm && menuButton('disks', nb.portalUi.disks)}
          {vm && menuButton('network', nb.portalUi.networking)}
          {row?.kind === 'app' && matches(labsNb.settings.title) && (
            <button
              type="button"
              aria-current={settings ? 'page' : undefined}
              onClick={() => navigate('settings', { id })}
            >
              <ServiceIcon kind="settings" />
              {labsNb.settings.title}
            </button>
          )}
        </details>
        <details className="portal-resource-learning">
          <summary>{nb.portalUi.learningTools}</summary>
          <button type="button" onClick={() => navigate('architecture', { id })}>
            {p.areas.architecture}
          </button>
          <button type="button" onClick={() => navigate('learn', { topic: 'practice' })}>
            {p.relatedLearning}
          </button>
        </details>
        <small>{polish.resource.limitations}</small>
      </nav>
      <div className="portal-resource-main" ref={content} tabIndex={-1}>
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
                    [
                      labsNb.fields[key as keyof typeof labsNb.fields] ?? key,
                      String(value),
                    ] as const,
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
      </div>
    </div>
  );
}
