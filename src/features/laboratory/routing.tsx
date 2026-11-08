'use client';
import { computeView as computeProjection, isFirewallWorld } from './capabilities';
import { laboratoryFirewallNb as f } from '@/content/laboratory-firewall-nb';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import type { World, Command } from '@/laboratory/v32/contract';
import type { Snapshot } from '@/laboratory/engine';
import type { Analysis } from '@/laboratory/v32/analysis';
import { routingProjection } from '@/laboratory/v33/projection';
import { endpointProjection } from '@/laboratory/v34/projection';
import { peeringStatus } from '@/laboratory/v32/peering';
import { laboratoryRoutingNb as r } from '@/content/laboratory-routing-nb';
import { laboratoryV3Nb as c } from '@/content/nb';
import { PropertyList } from '@/features/portal/shared';
import { PortalTable } from '@/features/portal/presentation';
export const routingFields: Record<string, string[]> = {
  CreateVnetPeering: ['vnetId', 'remoteVnetId', 'name'],
  CreateRouteTable: ['groupId', 'region', 'name'],
  CreateRoute: ['routeTableId', 'name', 'addressPrefix', 'nextHopType'],
  AssociateSubnetRouteTable: ['subnetId', 'routeTableId'],
  DisassociateSubnetRouteTable: ['subnetId'],
};
const href = (view: string, id?: string) =>
  '/labs/laboratory?' + new URLSearchParams({ view, ...(id ? { id } : {}) });
export function RoutingViews({
  world: w,
  view,
  id,
  begin,
  disabled,
  receipt,
  list,
}: {
  world:
    | World
    | import('@/laboratory/v33/contract').World
    | import('@/laboratory/v34/contract').World
    | import('@/laboratory/v35/contract').World
    | import('@/laboratory/v36/contract').World;
  view: string;
  id: string | null;
  begin: (type: Command['type']) => void;
  disabled: boolean;
  receipt: (id: string) => ReactNode;
  list: (type: string, rows: { id: string; name: string; origin: string }[]) => ReactNode;
}) {
  const table = w.routeTables.find((x) => x.id === id),
    route = w.routes.find((x) => x.id === id),
    peering = w.peerings.find((x) => x.id === id),
    subnet = w.subnets.find((x) => x.id === id);
  const vnetLink = (target: string) => (
    <Link href={href('vnet', target)}>{w.vnets.find((x) => x.id === target)?.name}</Link>
  );
  const peerTable = (parent: string) => (
    <>
      <p>{isFirewallWorld(w) ? f.peerNote : r.peeringNote}</p>
      {list(
        'peering',
        w.peerings.filter((p) => p.vnetId === parent),
      )}
      {!!w.peerings.filter((p) => p.remoteVnetId === parent).length && (
        <>
          <h3>{r.incoming}</h3>
          {list(
            'peering',
            w.peerings.filter((p) => p.remoteVnetId === parent),
          )}
        </>
      )}
    </>
  );
  return (
    <>
      {['routeTables', 'routeTable', 'route', 'peerings', 'peering', 'analysis'].includes(view) && (
        <p className="lab-network-boundary">{isFirewallWorld(w) ? f.routeNote : r.boundary}</p>
      )}
      {view === 'routeTables' && (
        <>
          <button disabled={disabled} onClick={() => begin('CreateRouteTable')}>
            {r.operations.CreateRouteTable}
          </button>
          {list('routeTable', w.routeTables)}
        </>
      )}
      {view === 'peerings' && id && w.vnets.some((x) => x.id === id) && (
        <>
          <h2>
            {w.vnets.find((x) => x.id === id)?.name} · {r.peerings}
          </h2>
          <button disabled={disabled} onClick={() => begin('CreateVnetPeering')}>
            {r.operations.CreateVnetPeering}
          </button>
          {peerTable(id)}
        </>
      )}
      {view === 'vnet' && id && (
        <p>
          <Link href={href('peerings', id)}>{r.peerings}</Link>
        </p>
      )}
      {view === 'peering' && peering && (
        <>
          <PropertyList
            items={[
              [c.id, peering.id],
              ['Lokalt VNet', vnetLink(peering.vnetId)],
              [r.fields.remoteVnetId, vnetLink(peering.remoteVnetId)],
              [
                'Status',
                peeringStatus(
                  isFirewallWorld(w)
                    ? routingProjection(endpointProjection(computeProjection(w)))
                    : w.model === 'laboratory@3.4.0'
                      ? routingProjection(endpointProjection(w))
                      : w.model === 'laboratory@3.3.0'
                        ? routingProjection(w)
                        : w,
                  peering,
                ),
              ],
              [r.fields.allowVirtualNetworkAccess, 'Aktivert'],
            ]}
          />
          {receipt(peering.origin)}
          <p>{isFirewallWorld(w) ? f.peerNote : r.peeringNote}</p>
          <p>
            <Link href={href('peerings', peering.remoteVnetId)}>Åpne peerings i eksternt VNet</Link>
          </p>
        </>
      )}
      {view === 'routeTable' && table && (
        <>
          <PropertyList
            items={[
              [c.id, table.id],
              [c.region, table.region],
              [
                c.group,
                <Link key="g" href={href('group', table.groupId)}>
                  {w.groups.find((x) => x.id === table.groupId)?.name}
                </Link>,
              ],
              [c.subscription, w.groups.find((x) => x.id === table.groupId)?.subscriptionId],
            ]}
          />
          {receipt(table.origin)}
          <p>{isFirewallWorld(w) ? f.routeNote : r.routeNote}</p>
          <h2>{r.routes}</h2>
          {list(
            'route',
            w.routes.filter((x) => x.routeTableId === table.id),
          )}
          <h2>Tilknyttede subnett</h2>
          {list(
            'subnet',
            w.subnets.filter((x) => x.routeTableId === table.id),
          )}
        </>
      )}
      {view === 'route' && route && (
        <>
          <PropertyList
            items={[
              [c.id, route.id],
              [
                r.table,
                <Link key="table" href={href('routeTable', route.routeTableId)}>
                  {w.routeTables.find((x) => x.id === route.routeTableId)?.name}
                </Link>,
              ],
              ['Adresseprefiks', route.addressPrefix],
              [
                r.fields.nextHopType,
                route.nextHopType === 'VirtualAppliance'
                  ? 'Virtual appliance · Azure Firewall'
                  : r.nextHops[route.nextHopType],
              ],
            ]}
          />
          {receipt(route.origin)}
          <p>{isFirewallWorld(w) ? f.routeNote : r.routeNote}</p>
        </>
      )}
      {view === 'subnet' && subnet && (
        <section className="lab-route-association" aria-label={r.table}>
          <h2>{r.table}</h2>
          <p>
            {subnet.routeTableId ? (
              <Link href={href('routeTable', subnet.routeTableId)}>
                {w.routeTables.find((x) => x.id === subnet.routeTableId)?.name}
              </Link>
            ) : (
              'Ingen Route Table tilknyttet'
            )}
          </p>
          {subnet.routeAssociationOrigin && receipt(subnet.routeAssociationOrigin)}
          <p>{r.association}</p>
          <p>
            <Link href={href('analysis', subnet.id)}>{r.analysis}</Link>
          </p>
        </section>
      )}
      {((view === 'routeTable' && !table) ||
        (view === 'route' && !route) ||
        (view === 'peering' && !peering) ||
        (view === 'peerings' && !w.vnets.some((x) => x.id === id))) && (
        <p role="status">{c.missing}</p>
      )}
    </>
  );
}
export function RouteAnalysis({
  snapshot,
  initialSource,
  initialNic,
  initialDestination,
  accept,
}: {
  snapshot: Snapshot;
  initialSource: string | null;
  initialNic?: string | null;
  initialDestination?: string | null;
  accept: (s: Snapshot) => void;
}) {
  const [source, setSource] = useState(initialSource ?? ''),
    [destination, setDestination] = useState(initialDestination ?? '10.20.1.5'),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [result, setResult] = useState<
      | ((
          | Analysis
          | import('@/laboratory/v33/route').RouteAnalysis
          | import('@/laboratory/v34/analysis').RouteAnalysis
          | import('@/laboratory/v35/analysis').RouteAnalysis
          | import('@/laboratory/v36/analysis').RouteAnalysis
        ) & { workspace: string })
      | null
    >(null);
  const current = useRef(snapshot);
  const mounted = useRef(true);
  useEffect(() => {
    current.current = snapshot;
  }, [snapshot]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (
      result &&
      result.workspace === snapshot.workspace &&
      result.revision === snapshot.world.revision
    ) {
      heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
      heading.current?.focus({ preventScroll: true });
    }
  }, [result, snapshot.workspace, snapshot.world.revision]);
  if (
    snapshot.world.model !== 'laboratory@3.2.0' &&
    snapshot.world.model !== 'laboratory@3.3.0' &&
    snapshot.world.model !== 'laboratory@3.4.0' &&
    !isFirewallWorld(snapshot.world)
  )
    return null;
  const nicContext =
    snapshot.world.model === 'laboratory@3.4.0' || isFirewallWorld(snapshot.world)
      ? snapshot.world.nics.find((x) => x.id === initialNic && x.subnetId === source)
      : undefined;
  const calculate = async () => {
    const workspace = snapshot.workspace;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(
        '/api/laboratory/analysis?' + new URLSearchParams({ subnetId: source, destination }),
        {
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { 'If-Laboratory-Workspace': workspace },
        },
      );
      const value = await response.json();
      if (!response.ok || value.error) throw Error(value.error ?? 'server-result-unavailable');
      if (
        !mounted.current ||
        value.workspace !== workspace ||
        current.current.workspace !== workspace
      )
        throw Error('workspace-changed');
      accept(value);
      setResult({ ...value.analysis, workspace });
    } catch (e) {
      const code = e instanceof Error ? e.message : '';
      setError(
        Object.hasOwn(r.codes, code)
          ? r.codes[code as keyof typeof r.codes]
          : Object.hasOwn(c.codes, code)
            ? c.codes[code as keyof typeof c.codes]
            : c.unavailable,
      );
    } finally {
      setBusy(false);
    }
  };
  const stale =
    result &&
    (result.workspace !== snapshot.workspace || result.revision !== snapshot.world.revision);
  return (
    <section className="lab-route-analysis">
      <p>{r.priority}</p>
      {nicContext && (
        <p>
          NIC:{' '}
          <Link href={href('nic', nicContext.id)}>
            {nicContext.name} · {nicContext.privateIpAddress} · {nicContext.id}
          </Link>
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void calculate();
        }}
      >
        <label>
          {r.source}
          <select
            disabled={busy}
            required
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setResult(null);
            }}
          >
            <option value="" disabled>
              Velg subnett
            </option>
            {snapshot.world.subnets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ·{' '}
                {snapshot.world.model !== 'laboratory@3.0.0' &&
                  snapshot.world.model !== 'laboratory@3.1.0' &&
                  snapshot.world.vnets.find((v) => v.id === s.vnetId)?.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {r.destination}
          <input
            disabled={busy}
            required
            maxLength={15}
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setResult(null);
            }}
          />
        </label>
        <button className="primary" disabled={busy}>
          {r.analyse}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      {stale && <p role="status">{r.stale}</p>}
      {result && !stale && (
        <>
          <h2 tabIndex={-1} ref={heading}>
            {r.computed}
          </h2>
          <PropertyList
            items={[
              [r.destination, result.destination],
              ['Valgt prefiks', result.selected.addressPrefix],
              ['Rutetype', result.selected.source === 'User' ? 'Brukerdefinert' : 'System'],
              [
                r.fields.nextHopType,
                result.selected.nextHop === 'VirtualAppliance'
                  ? 'Virtual appliance · ' + result.selected.nextHopIp
                  : r.nextHops[result.selected.nextHop],
              ],
              [c.revision, result.revision],
            ]}
          />
          <p className="lab-network-boundary">{r.traffic}</p>
          {!!result.inactivePeerings.length && (
            <p>
              {r.inactive} {result.inactivePeerings.join(', ')}
            </p>
          )}
          <PortalTable<Analysis['selected'] | import('@/laboratory/v35/analysis').Candidate>
            caption="Kandidatruter og begrunnelse"
            rows={result.candidates}
            empty={c.empty}
            columns={[
              { key: 'prefix', label: 'Prefiks', cell: (x) => <code>{x.addressPrefix}</code> },
              {
                key: 'source',
                label: 'Rutetype',
                cell: (x) => (x.source === 'User' ? 'Brukerdefinert' : 'System'),
              },
              {
                key: 'hop',
                label: r.fields.nextHopType,
                cell: (x) =>
                  x.nextHop === 'VirtualAppliance'
                    ? 'Virtual appliance · ' + x.nextHopIp
                    : r.nextHops[x.nextHop],
              },
              {
                key: 'reason',
                label: 'Hvorfor',
                cell: (x) => (
                  <>
                    {x.selected && <strong>Valgt. </strong>}
                    {r.reasons[x.reason]}
                    {x.origin && (
                      <>
                        {' '}
                        <Link href={href('history') + '&receipt=' + encodeURIComponent(x.origin)}>
                          {c.receipt}
                        </Link>
                      </>
                    )}
                  </>
                ),
              },
            ]}
          />
        </>
      )}
    </section>
  );
}
