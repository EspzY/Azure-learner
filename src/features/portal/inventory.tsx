'use client';
import { useState } from 'react';
import { labsNb, nb, regionLabels } from '@/content/nb';
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
}: {
  world: World;
  id: string;
  navigate: Navigate;
}) {
  const row = inventory(world).find((r) => r.id === id),
    scope = world.scopes.find((s) => s.id === id),
    identity = world.identity.id === id ? world.identity : null;
  if (!row && !scope && !identity) return <p>{p.noResource}</p>;
  const name = row?.name ?? scope?.name ?? identity!.name;
  const members = resourceInventory(world).filter((r) =>
    row?.kind === 'subscription' ? r.subscriptionId === id : r.groupId === id,
  );
  return (
    <div className="portal-resource-overview">
      <div className="portal-resource-menu">
        <strong>{name}</strong>
        <button type="button" aria-current="page">
          {p.overview}
        </button>
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
        <small>{p.technicalLimits}</small>
      </div>
      <div className="portal-resource-main">
        <h2>{p.properties}</h2>
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
            [p.subscription, world.scopes.find((s) => s.id === row?.subscriptionId)?.name],
            [p.group, world.groups.find((g) => g.id === row?.groupId)?.name],
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
              row?.parentId ?? scope?.parentId ?? row?.groupId ?? row?.subscriptionId ?? '—',
            ],
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
      </div>
    </div>
  );
}
