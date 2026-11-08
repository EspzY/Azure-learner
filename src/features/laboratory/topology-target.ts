import type { Snapshot, Command } from '@/laboratory/engine';
import { laboratoryTopologyNb as t } from '@/content/laboratory-topology-nb';
type Target = {
  resource: { id: string; name: string; origin: string };
  parentId: string;
  canEdit: boolean;
  canDelete: boolean;
  title: string;
  note: string;
  config: Record<string, string>;
};
export function topologyTarget(snapshot: Snapshot, view: string, id: string): Target | null {
  const w = snapshot.world;
  if (w.model !== 'laboratory@3.7.0') return null;
  if (view === 'route') {
    const r = w.routes.find((x) => x.id === id);
    return r
      ? {
          resource: r,
          parentId: r.routeTableId,
          canEdit: true,
          canDelete: false,
          title: t.editRoute,
          note: t.routeNote,
          config: {
            addressPrefix: r.addressPrefix,
            nextHopType: r.nextHopType,
            firewallId: r.nextHopType === 'VirtualAppliance' ? r.firewallId : '',
            nextHopIp: r.nextHopType === 'VirtualAppliance' ? r.nextHopIp : '',
          },
        }
      : null;
  }
  if (view === 'peering') {
    const p = w.peerings.find((x) => x.id === id);
    return p
      ? {
          resource: p,
          parentId: p.vnetId,
          canEdit: true,
          canDelete: false,
          title: t.editPeering,
          note: t.peeringNote,
          config: { value: String(p.allowVirtualNetworkAccess) },
        }
      : null;
  }
  if (view === 'subnet') {
    const s = w.subnets.find((x) => x.id === id);
    return s
      ? {
          resource: s,
          parentId: s.vnetId,
          canEdit: false,
          canDelete: !!s.nsgId,
          title: t.disassociate,
          note: t.detachNote,
          config: { nsgId: s.nsgId ?? '' },
        }
      : null;
  }
  return null;
}
export const topologyKeys = (view: string, values: Record<string, string>) =>
  view === 'route'
    ? [
        'addressPrefix',
        'nextHopType',
        ...(values.nextHopType === 'VirtualAppliance' ? ['firewallId', 'nextHopIp'] : []),
      ]
    : view === 'peering'
      ? ['value']
      : [];
export function topologyCommand(
  view: string,
  id: string,
  parentId: string,
  values: Record<string, string>,
): Command {
  if (view === 'route')
    return {
      type: 'UpdateRoute',
      routeId: id,
      routeTableId: parentId,
      addressPrefix: values.addressPrefix!,
      nextHopType: values.nextHopType!,
      ...(values.nextHopType === 'VirtualAppliance'
        ? { firewallId: values.firewallId!, nextHopIp: values.nextHopIp! }
        : {}),
    };
  if (view === 'peering')
    return {
      type: 'SetPeeringVirtualNetworkAccess',
      peeringId: id,
      vnetId: parentId,
      value: values.value!,
    };
  return { type: 'DisassociateSubnetNsg', subnetId: id, nsgId: values.nsgId! };
}
