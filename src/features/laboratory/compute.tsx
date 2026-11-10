'use client';
import { useWorkspaceNavigation } from './workspace-context';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { World, Command } from '@/laboratory/v34/contract';
import { images, sizes } from '@/laboratory/v34/profiles';
import { laboratoryComputeNb as m } from '@/content/laboratory-compute-nb';
import { laboratoryV3Nb as c } from '@/content/nb';
import { laboratoryNetworkNb as n } from '@/content/laboratory-networking-nb';
import { PropertyList } from '@/features/portal/shared';
export const computeFields: Record<string, string[]> = {
  CreateVirtualMachine: [
    'groupId',
    'name',
    'region',
    'image',
    'size',
    'subnetId',
    'privateIpAddress',
    'allocation',
    'nsgId',
    'osDiskSku',
    'osDiskSizeGiB',
  ],
};
export function ComputeViews({
  world,
  view,
  id,
  begin,
  disabled,
  list,
  receipt,
  networking,
}: {
  world:
    | World
    | import('@/laboratory/v35/contract').World
    | import('@/laboratory/v36/contract').World
    | import('@/laboratory/v37/contract').World
    | import('@/laboratory/v38/contract').World
    | import('@/laboratory/v39/contract').World;
  view: string;
  id: string | null;
  begin: (type: Command['type']) => void;
  disabled: boolean;
  list: (type: string, rows: { id: string; name: string; origin: string }[]) => ReactNode;
  receipt: (origin: string) => ReactNode;
  networking: boolean;
}) {
  const { href } = useWorkspaceNavigation();

  const vm = world.vms.find((x) => x.id === id),
    disk = world.disks.find((x) => x.id === id);
  const owner = world.vms.find((x) => x.nicId === id || x.osDiskId === id);
  const nic = world.nics.find((x) => x.id === vm?.nicId),
    subnet = world.subnets.find((x) => x.id === nic?.subnetId),
    vnet = world.vnets.find((x) => x.id === subnet?.vnetId);
  const image = images.find((x) => x.id === vm?.image),
    size = sizes.find((x) => x.id === vm?.size);
  const resourceLink = (kind: string, target?: { id: string; name: string }) =>
    target ? <Link href={href(kind, target.id)}>{target.name}</Link> : '—';
  return (
    <>
      {((view === 'vm' && !vm) || (view === 'disk' && !disk)) && <p role="status">{c.missing}</p>}
      {view === 'vms' && (
        <>
          <p>{m.boundary}</p>
          <button
            disabled={disabled || !world.groups.length || !world.subnets.length}
            onClick={() => begin('CreateVirtualMachine')}
          >
            {m.create}
          </button>
          {list('vm', world.vms)}
        </>
      )}
      {view === 'disks' && (
        <>
          <p>{m.boundary}</p>
          {list('disk', world.disks)}
        </>
      )}
      {['nic', 'disk'].includes(view) && owner && (
        <PropertyList items={[[m.ownership, resourceLink('vm', owner)]]} />
      )}
      {view === 'vm' && vm && (
        <>
          <p>{m.boundary}</p>
          {networking ? (
            <>
              <h2>{m.network}</h2>
              <PropertyList
                items={[
                  ['Primary NIC', resourceLink('nic', nic)],
                  ['Private IPv4', nic?.privateIpAddress],
                  [n.subnet, resourceLink('subnet', subnet)],
                  [n.vnet, resourceLink('vnet', vnet)],
                  [
                    n.nsg,
                    resourceLink(
                      'nsg',
                      world.nsgs.find((x) => x.id === nic?.nsgId),
                    ),
                  ],
                ]}
              />
              {nic && (
                <p>
                  <Link href={href('policy', nic.id)}>{m.policy}</Link>
                </p>
              )}
              {nic && subnet && (
                <p>
                  <Link href={href('analysis', subnet.id) + '&nic=' + encodeURIComponent(nic.id)}>
                    {m.route}
                  </Link>
                </p>
              )}
              <p>{m.analysisNote}</p>
            </>
          ) : (
            <>
              <h2>{m.configuration}</h2>
              <PropertyList
                items={[
                  [c.id, vm.id],
                  [c.region, vm.region],
                  [
                    c.group,
                    resourceLink(
                      'group',
                      world.groups.find((x) => x.id === vm.groupId),
                    ),
                  ],
                  [c.subscription, world.groups.find((x) => x.id === vm.groupId)?.subscriptionId],
                  [m.image, image?.name],
                  [m.size, vm.size],
                  ['vCPU / GiB', size ? `${size.vcpus} / ${size.memoryGiB}` : '—'],
                  [m.architecture, image?.architecture],
                  [m.generation, image?.generation],
                  ['Primary NIC', resourceLink('nic', nic)],
                  [
                    m.disk,
                    resourceLink(
                      'disk',
                      world.disks.find((x) => x.id === vm.osDiskId),
                    ),
                  ],
                ]}
              />
              <details>
                <summary>{m.imageReference}</summary>
                <p>
                  <code>{image?.reference}</code>
                </p>
                <p>{m.imageNote}</p>
              </details>
            </>
          )}
          {receipt(vm.origin)}
        </>
      )}
      {view === 'disk' && disk && (
        <>
          <p>{m.boundary}</p>
          <PropertyList
            items={[
              [c.id, disk.id],
              ['Type', 'Microsoft.Compute/disks'],
              [c.region, disk.region],
              [
                c.group,
                resourceLink(
                  'group',
                  world.groups.find((x) => x.id === disk.groupId),
                ),
              ],
              [c.subscription, world.groups.find((x) => x.id === disk.groupId)?.subscriptionId],
              [m.osDiskSku, disk.sku],
              [m.osDiskSizeGiB, disk.sizeGiB],
              ['OS-type', disk.osType],
            ]}
          />
          {receipt(disk.origin)}
        </>
      )}
    </>
  );
}
