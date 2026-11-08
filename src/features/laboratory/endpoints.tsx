'use client';
import { isFirewallWorld } from './capabilities';
import { FirewallPathDetails } from './firewall';
import { laboratoryFirewallNb as f } from '@/content/laboratory-firewall-nb';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { TopologyAccess } from './topology-access';
import type { World, Command } from '@/laboratory/v33/contract';
import type { PolicyAnalysis } from '@/laboratory/v33/policy';
import type { Snapshot } from '@/laboratory/engine';
import { laboratoryComputeNb as m } from '@/content/laboratory-compute-nb';
import { laboratoryEndpointsNb as e } from '@/content/laboratory-endpoints-nb';
import { laboratoryRoutingNb as r } from '@/content/laboratory-routing-nb';
import { laboratoryNetworkNb as n } from '@/content/laboratory-networking-nb';
import { laboratoryV3Nb as c } from '@/content/nb';
import { PropertyList } from '@/features/portal/shared';
import { PortalTable } from '@/features/portal/presentation';
const href = (view: string, id?: string) =>
  '/labs/laboratory?' + new URLSearchParams({ view, ...(id ? { id } : {}) });
export const endpointFields: Record<string, string[]> = {
  CreateNetworkInterface: [
    'groupId',
    'name',
    'region',
    'vnetId',
    'subnetId',
    'privateIpAddress',
    'allocation',
  ],
  AssociateNicNsg: ['nicId', 'nsgId'],
  DisassociateNicNsg: ['nicId'],
};
export function EndpointViews({
  world,
  view,
  id,
  begin,
  disabled,
  list,
  receipt,
}: {
  world:
    | World
    | import('@/laboratory/v34/contract').World
    | import('@/laboratory/v35/contract').World
    | import('@/laboratory/v36/contract').World
    | import('@/laboratory/v37/contract').World;
  view: string;
  id: string | null;
  begin: (type: Command['type']) => void;
  disabled: boolean;
  list: (type: string, rows: { id: string; name: string; origin: string }[]) => ReactNode;
  receipt: (id: string) => ReactNode;
}) {
  const nic = world.nics.find((x) => x.id === id),
    subnet = world.subnets.find((x) => x.id === nic?.subnetId),
    vnet = world.vnets.find((x) => x.id === subnet?.vnetId);
  return (
    <>
      {view === 'nics' && (
        <>
          <p className="lab-network-boundary">
            {world.model === 'laboratory@3.4.0' || isFirewallWorld(world)
              ? m.nicBoundary
              : e.boundary}
          </p>
          <button disabled={disabled} onClick={() => begin('CreateNetworkInterface')}>
            {e.operations.CreateNetworkInterface}
          </button>
          {list('nic', world.nics)}
        </>
      )}
      {view === 'nic' && nic && (
        <div className="lab-endpoint-detail">
          <p className="lab-network-boundary">
            {world.model === 'laboratory@3.4.0' || isFirewallWorld(world)
              ? m.nicBoundary
              : e.boundary}
          </p>
          <PropertyList
            items={[
              [c.id, nic.id],
              [c.region, nic.region],
              [
                c.group,
                <Link key="g" href={href('group', nic.groupId)}>
                  {world.groups.find((g) => g.id === nic.groupId)?.name}
                </Link>,
              ],
              [c.subscription, world.groups.find((g) => g.id === nic.groupId)?.subscriptionId],
              [
                n.vnet,
                <Link key="v" href={href('vnet', vnet?.id)}>
                  {vnet?.name}
                </Link>,
              ],
              [
                n.subnet,
                <Link key="s" href={href('subnet', subnet?.id)}>
                  {subnet?.name}
                </Link>,
              ],
              [e.fields.privateIpAddress, nic.privateIpAddress],
              [e.fields.allocation, nic.allocation],
              [
                n.nsg,
                nic.nsgId ? (
                  <Link key="n" href={href('nsg', nic.nsgId)}>
                    {world.nsgs.find((x) => x.id === nic.nsgId)?.name}
                  </Link>
                ) : (
                  n.noNsg
                ),
              ],
            ]}
          />
          {receipt(nic.origin)}
          {nic.associationOrigin && (
            <p>
              {n.associationReceipt}: {receipt(nic.associationOrigin)}
            </p>
          )}
          <p>
            <Link href={href('policy', nic.id)}>{e.analysis}</Link>
          </p>
        </div>
      )}
      {(view === 'subnet' || view === 'nsg') && (
        <section>
          <h2>{e.nics}</h2>
          {list(
            'nic',
            world.nics.filter((x) => (view === 'subnet' ? x.subnetId === id : x.nsgId === id)),
          )}
        </section>
      )}
      {view === 'nic' && !nic && <p role="status">{c.missing}</p>}
    </>
  );
}
export type LaboratoryPolicyResult = (
  | PolicyAnalysis
  | import('@/laboratory/v34/analysis').PolicyAnalysis
  | import('@/laboratory/v35/analysis').PolicyAnalysis
  | import('@/laboratory/v36/analysis').PolicyAnalysis
  | import('@/laboratory/v37/analysis').PolicyAnalysis
) & { workspace: string };
export function PolicyAnalysisView({
  snapshot,
  initialSource,
  accept,
  onAnalysis,
}: {
  snapshot: Snapshot;
  initialSource: string | null;
  accept: (s: Snapshot) => void;
  onAnalysis?: (result: LaboratoryPolicyResult | null) => void;
}) {
  const [input, setInput] = useState({
      sourceNicId: initialSource ?? '',
      destinationNicId: '',
      protocol: 'Tcp',
      sourcePort: '50000',
      destinationPort: '1433',
    }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [result, setResult] = useState<LaboratoryPolicyResult | null>(null);
  useEffect(() => {
    onAnalysis?.(
      result &&
        result.workspace === snapshot.workspace &&
        result.model === snapshot.world.model &&
        result.revision === snapshot.world.revision
        ? result
        : null,
    );
  }, [onAnalysis, result, snapshot.workspace, snapshot.world.model, snapshot.world.revision]);
  const current = useRef(snapshot),
    mounted = useRef(true),
    heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    current.current = snapshot;
  }, [snapshot]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
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
    snapshot.world.model !== 'laboratory@3.3.0' &&
    snapshot.world.model !== 'laboratory@3.4.0' &&
    !isFirewallWorld(snapshot.world)
  )
    return null;
  const world = snapshot.world,
    stale =
      result && (result.workspace !== snapshot.workspace || result.revision !== world.revision);
  const calculate = async () => {
    const workspace = snapshot.workspace;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(
          '/api/laboratory/policy-analysis?' + new URLSearchParams(input),
          {
            credentials: 'same-origin',
            cache: 'no-store',
            headers: { 'If-Laboratory-Workspace': workspace },
          },
        ),
        value = await response.json();
      if (!response.ok || value.error) throw Error(value.error ?? 'server-result-unavailable');
      if (!mounted.current) return;
      if (value.workspace !== workspace || current.current.workspace !== workspace)
        throw Error('workspace-changed');
      // A late read must never replace a newer revision or label old inputs as current.
      if (value.world.revision < current.current.world.revision) throw Error('stale-analysis');
      accept(value);
      setResult({ ...value.analysis, workspace });
    } catch (err) {
      if (mounted.current) {
        const code = err instanceof Error ? err.message : '';
        setError(
          code === 'stale-analysis'
            ? e.stale
            : Object.hasOwn(e.codes, code)
              ? e.codes[code as keyof typeof e.codes]
              : Object.hasOwn(c.codes, code)
                ? c.codes[code as keyof typeof c.codes]
                : c.unavailable,
        );
      }
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  const endpoint = (id: string) => world.nics.find((x) => x.id === id);
  const nicLabel = (id: string) => {
    const nic = endpoint(id),
      subnet = world.subnets.find((x) => x.id === nic?.subnetId),
      vnet = world.vnets.find((x) => x.id === subnet?.vnetId),
      group = world.groups.find((x) => x.id === nic?.groupId);
    if (!nic) return id;
    const vm = isFirewallWorld(world) ? world.vms.find((v) => v.nicId === nic.id) : undefined;
    return `${vm ? vm.name + ' / ' : ''}${nic.name} · ${nic.privateIpAddress} · ${group?.name ?? nic.groupId} / ${group?.subscriptionId ?? '—'} · ${vnet?.name ?? '—'} / ${subnet?.name ?? nic.subnetId} · ${nic.region} · ${nic.id}`;
  };
  const set = (key: keyof typeof input, value: string) => {
    setInput({ ...input, [key]: value });
    setResult(null);
    setError('');
  };
  return (
    <section className="lab-policy-analysis">
      <p className="lab-network-boundary">{e.analysisNote}</p>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          void calculate();
        }}
      >
        <fieldset disabled={busy}>
          {(['sourceNicId', 'destinationNicId'] as const).map((key) => (
            <label key={key}>
              {key === 'sourceNicId' ? e.source : e.destination}
              <select required value={input[key]} onChange={(evt) => set(key, evt.target.value)}>
                <option value="" disabled>
                  Velg NIC
                </option>
                {world.nics.map((x) => (
                  <option key={x.id} value={x.id}>
                    {nicLabel(x.id)}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label>
            {e.protocol}
            <select value={input.protocol} onChange={(evt) => set('protocol', evt.target.value)}>
              <option value="Tcp">TCP</option>
              <option value="Udp">UDP</option>
            </select>
          </label>
          {(['sourcePort', 'destinationPort'] as const).map((key) => (
            <label key={key}>
              {e[key]}
              <input
                required
                maxLength={5}
                inputMode="numeric"
                value={input[key]}
                onChange={(evt) => set(key, evt.target.value)}
              />
            </label>
          ))}
          <button className="primary" type="submit">
            {e.calculate}
          </button>
        </fieldset>
      </form>
      {error && <p role="alert">{error}</p>}
      {stale && <p role="status">{e.stale}</p>}
      {result && !stale && (
        <>
          <h2 tabIndex={-1} ref={heading}>
            {e.result}
          </h2>
          {'firewallPath' in result && isFirewallWorld(world) ? (
            <FirewallPathDetails world={world} analysis={result} />
          ) : (
            <>
              <strong className="lab-policy-outcome" data-outcome={result.status}>
                {e.statuses[result.status]}
              </strong>
              <p>
                {'firewallPath' in result
                  ? (f.reasons[result.reason as keyof typeof f.reasons] ?? f.unknown)
                  : e.reasons[result.reason]}
              </p>
            </>
          )}
          {'accessChecks' in result && <TopologyAccess analysis={result} />}
          <PropertyList
            items={[
              [e.source, nicLabel(result.sourceNicId)],
              [e.destination, nicLabel(result.destinationNicId)],
              [
                e.protocol,
                `${result.packet.protocol} · ${result.packet.sourcePort} → ${result.packet.destinationPort}`,
              ],
              [c.revision, result.revision],
              [
                'Rute',
                result.route
                  ? `${result.route.selected.addressPrefix} → ${result.route.selected.nextHop === 'VirtualAppliance' ? 'Virtual appliance' : r.nextHops[result.route.selected.nextHop]}`
                  : (r.codes[result.routeError as keyof typeof r.codes] ?? 'Uavklart'),
              ],
            ]}
          />
          {!('firewallPath' in result) && (
            <p className="lab-network-boundary">
              Ingen trafikk er sendt. Dette bekrefter ikke at en VM eller tjeneste svarer.
            </p>
          )}
          <p>
            <Link href={href('analysis', result.sourceSubnetId)}>{r.analysis}</Link>
          </p>
          <ol className="lab-policy-layers">
            {result.layers.map((layer) => {
              const nsg = world.nsgs.find((x) => x.id === layer.nsgId),
                winner = layer.rules.find(
                  (x) => x.id === (layer.matchedRuleId ?? layer.uncertainRuleId),
                );
              return (
                <li key={layer.id}>
                  <h3>{e.layers[layer.id]}</h3>
                  <p>
                    <strong>{e.layerStatus[layer.status]}</strong>
                    {nsg && (
                      <>
                        {' '}
                        · <Link href={href('nsg', nsg.id)}>{nsg.name}</Link>
                      </>
                    )}
                  </p>
                  {winner && (
                    <p>
                      {layer.matchedRuleId ? 'Første match' : 'Første uavklarte regel'}:{' '}
                      <strong>{winner.name}</strong> · {winner.priority} · {winner.access}
                    </p>
                  )}
                  {layer.reason === 'earlier-layer' && <p>Et tidligere lag stoppet analysen.</p>}
                  {['routing', 'unsupported-path'].includes(layer.reason) && (
                    <p>Rutegrunnlaget tillater ikke videre policyevaluering.</p>
                  )}
                  {layer.associationOrigin && (
                    <p>
                      {n.associationReceipt}:{' '}
                      <Link
                        href={
                          href('history') +
                          '&receipt=' +
                          encodeURIComponent(layer.associationOrigin)
                        }
                      >
                        {c.receipt}
                      </Link>
                    </p>
                  )}
                  {!!layer.rules.length && (
                    <details>
                      <summary>Regelrekkefølge og matchdetaljer</summary>
                      <PortalTable
                        caption="Regelvurdering"
                        rows={layer.rules}
                        empty={c.empty}
                        columns={[
                          {
                            key: 'name',
                            label: 'Regel',
                            cell: (x) => (
                              <>
                                {x.name}
                                <small className="lab-rule-kind">
                                  {x.kind === 'custom' ? 'Brukerregel' : 'Fast standardregel'}
                                </small>
                                {x.origin && (
                                  <Link
                                    href={
                                      href('history') + '&receipt=' + encodeURIComponent(x.origin)
                                    }
                                  >
                                    {c.receipt}
                                  </Link>
                                )}
                              </>
                            ),
                          },
                          { key: 'priority', label: n.priority, cell: (x) => x.priority },
                          {
                            key: 'match',
                            label: 'Vurdering',
                            cell: (x) => (
                              <>
                                {e.matches[x.result]}
                                {x.checks.length > 0 && (
                                  <details>
                                    <summary>Femtuple og begrunnelse</summary>
                                    <p>
                                      {x.protocol} · {x.source}:{x.sourcePort} → {x.destination}:
                                      {x.destinationPort} · {x.access}
                                    </p>
                                    <ul>
                                      {x.checks.map((check) => (
                                        <li key={check.field}>
                                          {
                                            {
                                              protocol: e.protocol,
                                              source: n.source,
                                              destination: n.destination,
                                              sourcePort: e.sourcePort,
                                              destinationPort: e.destinationPort,
                                            }[check.field]
                                          }
                                          : {e.matches[check.result]} — {e.checks[check.reason]}
                                        </li>
                                      ))}
                                    </ul>
                                  </details>
                                )}
                              </>
                            ),
                          },
                        ]}
                      />
                    </details>
                  )}
                </li>
              );
            })}
          </ol>
        </>
      )}
    </section>
  );
}
