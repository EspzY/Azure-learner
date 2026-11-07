'use client';
import Link from 'next/link';
import type { ReactNode, RefObject } from 'react';
import type { World as PreviousWorld } from '@/laboratory/v31/contract';
import type { World as RoutingWorld } from '@/laboratory/v32/contract';
import type { Command } from '@/laboratory/engine';
import { subnetMetadata } from '@/laboratory/v31/ip';
import { defaultRules as defaults } from '@/laboratory/v31/default-rules';
import { laboratoryNetworkNb as n } from '@/content/laboratory-networking-nb';
import { laboratoryV3Nb as c } from '@/content/nb';
import { PropertyList } from '@/features/portal/shared';
export const networkFields: Record<string, string[]> = {
  CreateVirtualNetwork: ['groupId', 'name', 'region', 'addressSpace'],
  CreateSubnet: ['vnetId', 'name', 'addressPrefix'],
  CreateNetworkSecurityGroup: ['groupId', 'name', 'region'],
  CreateSecurityRule: [
    'nsgId',
    'name',
    'direction',
    'priority',
    'protocol',
    'source',
    'sourcePort',
    'destination',
    'destinationPort',
    'access',
  ],
  AssociateSubnetNsg: ['subnetId', 'nsgId'],
};
const href = (view: string, id?: string) =>
  '/labs/laboratory?' + new URLSearchParams({ view, ...(id ? { id } : {}) });

type Props = {
  world: PreviousWorld | RoutingWorld;
  view: string;
  id: string | null;
  begin: (type: Command['type']) => void;
  disabled: boolean;
  receipt: (id: string) => ReactNode;
  list: (type: string, rows: { id: string; name: string; origin: string }[]) => ReactNode;
  headingRef: RefObject<HTMLHeadingElement | null>;
  headings?: boolean;
  actions?: boolean;
};
export function NetworkViews({
  world: w,
  view,
  id,
  begin,
  disabled,
  receipt,
  list,
  headingRef,
  headings = true,
  actions = true,
}: Props) {
  const vnet = w.vnets.find((x) => x.id === id),
    subnet = w.subnets.find((x) => x.id === id),
    nsg = w.nsgs.find((x) => x.id === id),
    rule = w.securityRules.find((x) => x.id === id);
  const scope = (groupId: string) =>
    [
      [
        c.group,
        <Link key="group" href={href('group', groupId)}>
          {w.groups.find((g) => g.id === groupId)?.name}
        </Link>,
      ],
      [c.subscription, w.groups.find((g) => g.id === groupId)?.subscriptionId],
    ] as [string, ReactNode][];
  const heading = (name: string) =>
    headings ? (
      <h2 ref={headingRef} tabIndex={-1}>
        {name}
      </h2>
    ) : null;
  const create = (type: Command['type'], title: string) =>
    actions && (
      <button disabled={disabled} onClick={() => begin(type)}>
        {title}
      </button>
    );
  const table = (groupId: string) => (
    <div className="lab-rules-scroll" role="region" aria-label={n.rules} tabIndex={0}>
      <table className="lab-table">
        <caption>{n.rules}</caption>
        <thead>
          <tr>
            {[c.name, n.direction, n.priority, n.protocol, n.source, n.destination, n.access].map(
              (label) => (
                <th key={label}>{label}</th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {w.securityRules
            .filter((r) => r.nsgId === groupId)
            .sort((a, b) => a.direction.localeCompare(b.direction) || a.priority - b.priority)
            .map((r) => (
              <tr key={r.id}>
                <td>
                  <Link href={href('rule', r.id)}>{r.name}</Link>
                </td>
                <td>{r.direction}</td>
                <td>{r.priority}</td>
                <td>{r.protocol === '*' ? 'Any' : r.protocol}</td>
                <td>
                  {r.source}
                  <br />
                  {n.sourcePort}: {r.sourcePort}
                </td>
                <td>
                  {r.destination}
                  <br />
                  {n.destinationPort}: {r.destinationPort}
                </td>
                <td>{r.access}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {!w.securityRules.some((r) => r.nsgId === groupId) && <p>{n.noRules}</p>}
    </div>
  );
  return (
    <>
      {w.model === 'laboratory@3.1.0' &&
        ['vnets', 'nsgs', 'vnet', 'subnet', 'nsg', 'rule'].includes(view) && (
          <p className="lab-network-boundary">{n.boundary}</p>
        )}
      {view === 'vnets' && (
        <>
          {create('CreateVirtualNetwork', n.newVnet)}
          {list('vnet', w.vnets)}
        </>
      )}
      {view === 'nsgs' && (
        <>
          {create('CreateNetworkSecurityGroup', n.newNsg)}
          {list('nsg', w.nsgs)}
        </>
      )}
      {view === 'vnet' && vnet && (
        <>
          {heading(vnet.name)}
          <PropertyList
            items={[
              [c.id, vnet.id],
              [c.region, vnet.region],
              [n.addressSpace, vnet.addressSpace],
              ...scope(vnet.groupId),
            ]}
          />
          {receipt(vnet.origin)}
          {create('CreateSubnet', n.newSubnet)}
          {list(
            'subnet',
            w.subnets.filter((s) => s.vnetId === vnet.id),
          )}
        </>
      )}
      {view === 'subnet' &&
        subnet &&
        (() => {
          const parent = w.vnets.find((v) => v.id === subnet.vnetId)!,
            meta = subnetMetadata(subnet.addressPrefix)!;
          return (
            <>
              {heading(subnet.name)}
              <PropertyList
                items={[
                  [c.id, subnet.id],
                  [
                    n.vnet,
                    <Link key="vnet" href={href('vnet', parent.id)}>
                      {parent.name}
                    </Link>,
                  ],
                  [n.addressPrefix, subnet.addressPrefix],
                  [n.interval, `${meta.first} – ${meta.last}`],
                  [n.reserved, meta.reserved.join(', ')],
                  [n.usable, meta.usableCount],
                  [c.region, parent.region],
                  ...scope(parent.groupId),
                  [
                    n.nsg,
                    subnet.nsgId ? (
                      <Link key="nsg" href={href('nsg', subnet.nsgId)}>
                        {w.nsgs.find((g) => g.id === subnet.nsgId)?.name}
                      </Link>
                    ) : (
                      n.noNsg
                    ),
                  ],
                ]}
              />
              {receipt(subnet.origin)}
              {subnet.associationOrigin && (
                <p>
                  {n.associationReceipt}: {receipt(subnet.associationOrigin)}
                </p>
              )}
              {create('AssociateSubnetNsg', n.associate)}
              <p>{n.associationLimit}</p>
            </>
          );
        })()}
      {view === 'nsg' && nsg && (
        <>
          {heading(nsg.name)}
          <PropertyList items={[[c.id, nsg.id], [c.region, nsg.region], ...scope(nsg.groupId)]} />
          {receipt(nsg.origin)}
          {create('CreateSecurityRule', n.newRule)}
          {table(nsg.id)}
          <details className="lab-default-rules">
            <summary>{n.defaultRules}</summary>
            <p>{n.defaultNote}</p>
            <div
              className="lab-rules-scroll"
              role="region"
              aria-label={n.defaultRules}
              tabIndex={0}
            >
              <table className="lab-table">
                <caption>{n.defaultRules}</caption>
                <thead>
                  <tr>
                    {[
                      c.name,
                      n.direction,
                      n.priority,
                      n.protocol,
                      n.source,
                      n.destination,
                      n.access,
                    ].map((label) => (
                      <th key={label}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {defaults.map((r) => (
                    <tr key={r[0]}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                      <td>Any · ports *</td>
                      <td>{r[3]}</td>
                      <td>{r[4]}</td>
                      <td>{r[5]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          {list(
            'subnet',
            w.subnets.filter((s) => s.nsgId === nsg.id),
          )}
        </>
      )}
      {view === 'rule' && rule && (
        <>
          {heading(rule.name)}
          <PropertyList
            items={[
              [c.id, rule.id],
              [
                n.nsg,
                <Link key="nsg" href={href('nsg', rule.nsgId)}>
                  {w.nsgs.find((x) => x.id === rule.nsgId)?.name}
                </Link>,
              ],
              [n.direction, rule.direction],
              [n.priority, rule.priority],
              [n.protocol, rule.protocol === '*' ? 'Any' : rule.protocol],
              [n.source, rule.source],
              [n.sourcePort, rule.sourcePort],
              [n.destination, rule.destination],
              [n.destinationPort, rule.destinationPort],
              [n.access, rule.access],
            ]}
          />
          {receipt(rule.origin)}
        </>
      )}
      {((view === 'vnet' && !vnet) ||
        (view === 'subnet' && !subnet) ||
        (view === 'nsg' && !nsg) ||
        (view === 'rule' && !rule)) && <p role="status">{c.missing}</p>}
    </>
  );
}
