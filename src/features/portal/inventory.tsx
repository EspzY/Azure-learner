'use client';
import { useId, useState } from 'react';
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
import { PropertyList, type Navigate } from './shared';
const p = nb.portal;
export function ResourceTable({
  world,
  navigate,
  area,
  rows: provided,
}: {
  world: World;
  navigate: Navigate;
  area?: Area;
  rows?: InventoryRow[];
}) {
  const [query, setQuery] = useState(''),
    [subscription, setSubscription] = useState(''),
    [kind, setKind] = useState('');
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
  const rows = filterInventory(base, query, subscription, kind);
  return (
    <section className="portal-resource-list">
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
        {area !== 'subscriptions' && (
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
      </div>
      <div className="portal-table-scroll" tabIndex={0}>
        <table>
          <caption>
            {p.resources} · {rows.length}
          </caption>
          <thead>
            <tr>
              <th scope="col">{p.name}</th>
              <th scope="col">{p.type}</th>
              <th scope="col">{p.group}</th>
              <th scope="col">{area === 'groups' ? p.metadata : p.resourceLocation}</th>
              <th scope="col">{p.subscription}</th>
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
                    {r.name}
                  </button>
                </td>
                <td>{p.graph.types[r.kind]}</td>
                <td>{world.groups.find((g) => g.id === r.groupId)?.name ?? '—'}</td>
                <td>
                  {r.location ? regionLabels[r.location as keyof typeof regionLabels] : '—'}
                  {r.kind === 'group' && <small>{p.metadata}</small>}
                </td>
                <td>{world.scopes.find((s) => s.id === r.subscriptionId)?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && <p className="portal-empty">{p.noResource}</p>}
    </section>
  );
}
export function ResourceDetails({
  world,
  id,
  navigate,
  children,
}: {
  world: World;
  id: string;
  navigate: Navigate;
  children?: React.ReactNode;
}) {
  const sectionId = useId();
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
  const goTo = (suffix: string) => {
    const el = document.getElementById(`${sectionId}-${suffix}`);
    el?.scrollIntoView({ block: 'start', behavior: 'instant' });
    el?.focus({ preventScroll: true });
  };
  const members = resourceInventory(world).filter((r) =>
    row?.kind === 'subscription' ? r.subscriptionId === id : r.groupId === id,
  );
  return (
    <div className="portal-resource-overview">
      <nav className="portal-resource-menu" aria-label={`${name} · ${p.overview}`}>
        <strong>{name}</strong>
        <button type="button" onClick={() => goTo('essentials')}>
          {p.overview}
        </button>
        {children && (
          <button type="button" onClick={() => goTo('relations')}>
            {polish.resource.relations}
          </button>
        )}
        <button type="button" onClick={() => navigate('activity', { id })}>
          {p.areas.activity}
        </button>
        <button type="button" onClick={() => navigate('architecture', { id })}>
          {p.areas.architecture}
        </button>
        <button type="button" onClick={() => navigate('learn', { topic: 'practice' })}>
          {p.relatedLearning}
        </button>
        {row?.kind === 'app' && (
          <button type="button" onClick={() => navigate('settings', { id })}>
            {labsNb.settings.title}
          </button>
        )}
        <small>{polish.resource.limitations}</small>
      </nav>
      <div className="portal-resource-main">
        <h2 id={`${sectionId}-essentials`} tabIndex={-1}>
          {polish.resource.essentials}
        </h2>
        <PropertyList
          items={[
            [p.name, name],
            [
              p.type,
              row
                ? p.graph.types[row.kind]
                : scope
                  ? p.graph.types[scope.kind]
                  : p.graph.types.tenant,
            ],
            [p.status, p.resourceState],
            [
              p.subscription,
              row?.subscriptionId ? (
                <button
                  type="button"
                  onClick={() => navigate('resource', { id: row.subscriptionId })}
                >
                  {world.scopes.find((s) => s.id === row.subscriptionId)?.name}
                </button>
              ) : undefined,
            ],
            [
              p.group,
              row?.groupId ? (
                <button type="button" onClick={() => navigate('resource', { id: row.groupId })}>
                  {world.groups.find((g) => g.id === row.groupId)?.name}
                </button>
              ) : undefined,
            ],
            [
              row?.kind === 'group' ? p.metadata : p.resourceLocation,
              row?.location ? regionLabels[row.location as keyof typeof regionLabels] : '—',
            ],
            ...(row?.kind === 'app'
              ? [
                  [
                    p.plan,
                    row.planId ? (
                      <button
                        type="button"
                        onClick={() => navigate('resource', { id: row.planId })}
                      >
                        {world.resources.find((r) => r.id === row.planId)?.name}
                      </button>
                    ) : (
                      '—'
                    ),
                  ] as const,
                ]
              : []),
            [
              p.parent,
              parentId ? (
                <button type="button" onClick={() => navigate('resource', { id: parentId })}>
                  {parentName}
                </button>
              ) : (
                '—'
              ),
            ],
            ...(vm?.kind === 'vm'
              ? ([
                  [labsNb.fields.image, labsNb.vm.images[vm.image]],
                  [labsNb.fields.profile, labsNb.vm.profiles[vm.profile]],
                ] as const)
              : []),
          ]}
        />
        {row?.kind === 'group' && <p className="portal-inline-info">{p.locationNote}</p>}
        {row?.kind === 'app' && <p>{p.appNote}</p>}
        {row?.kind === 'plan' && <p>{p.planNote}</p>}
        {(row?.kind === 'group' || row?.kind === 'subscription') && (
          <>
            <h2>{p.resources}</h2>
            <ResourceTable world={world} navigate={navigate} rows={members} />
          </>
        )}
        {children && (
          <div className="portal-related-details">
            <h2 id={`${sectionId}-relations`} tabIndex={-1}>
              {polish.resource.relations}
            </h2>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
