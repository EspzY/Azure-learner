/** Read-only display projection. Inputs are the existing verified snapshot and canonical inventory. */
import type { Snapshot } from '@/laboratory/engine';
import type { LaboratoryResource } from './portal-adapter';
import type { LaboratoryPolicyResult } from './endpoints';
import { architectureStudioNb as t } from '@/content/architecture-studio-nb';
export type RelationKind = keyof typeof t.edge;
export type StudioNode = {
  id: string;
  name: string;
  kind: string;
  typeName: string;
  subscriptionId: string;
  groupId: string;
  scope: string;
  x: number;
  y: number;
  resource: LaboratoryResource | null;
};
export type StudioEdge = {
  id: string;
  from: string;
  to: string;
  kind: RelationKind;
  status?: string;
};
export type Topology = {
  workspace: string;
  model: string;
  revision: number;
  nodes: StudioNode[];
  edges: StudioEdge[];
};
export type Filters = { subscription: string; group: string; kind: string };
export function projectTopology(snapshot: Snapshot, rows: readonly LaboratoryResource[]): Topology {
  const { world, workspace } = snapshot;
  const nodes: StudioNode[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    kind: r.kind,
    typeName: r.typeName,
    subscriptionId: r.subscriptionId,
    groupId: r.groupId,
    scope: `${r.subscriptionName} / ${r.groupName} · ${r.id}`,
    x: 0,
    y: 0,
    resource: r,
  }));
  for (const [id, name] of new Map(rows.map((r) => [r.subscriptionId, r.subscriptionName])))
    nodes.push({
      id: 'subscription:' + id,
      name,
      kind: 'subscription',
      typeName: 'Subscription',
      subscriptionId: id,
      groupId: '',
      scope: id,
      x: 0,
      y: 0,
      resource: null,
    });
  const edges: StudioEdge[] = [];
  const ids = new Set(nodes.map((n) => n.id));
  const add = (from: string, to: string, kind: RelationKind, status?: string) => {
    if (ids.has(from) && ids.has(to))
      edges.push({ id: `${kind}:${from}:${to}`, from, to, kind, ...(status ? { status } : {}) });
  };
  for (const r of rows) {
    if (r.category === 'resource' && r.parentId !== r.groupId) add(r.groupId, r.id, 'membership');
    if (r.view === 'group') add('subscription:' + r.subscriptionId, r.id, 'membership');
    else if (r.parentId) {
      if (r.view === 'nic') add(r.id, r.parentId, 'nic-subnet');
      else
        add(
          r.parentId,
          r.id,
          r.view === 'peering' ? 'peering' : r.parentId === r.groupId ? 'membership' : 'parent',
          r.status,
        );
    }
  }
  if (world.model !== 'laboratory@3.0.0')
    for (const s of world.subnets) {
      if (s.nsgId) add(s.id, s.nsgId, 'subnet-nsg');
      if ('routeTableId' in s && typeof s.routeTableId === 'string')
        add(s.id, s.routeTableId, 'subnet-route-table');
    }
  if ('peerings' in world)
    for (const p of world.peerings) {
      add(p.id, p.remoteVnetId, 'peering-target', rows.find((r) => r.id === p.id)?.status);
    }
  if ('nics' in world) for (const n of world.nics) if (n.nsgId) add(n.id, n.nsgId, 'nic-nsg');
  if ('vms' in world)
    for (const v of world.vms) {
      add(v.id, v.nicId, 'vm-nic');
      add(v.id, v.osDiskId, 'vm-disk');
    }
  if (world.model === 'laboratory@3.5.0') {
    for (const f of world.firewalls) {
      add(f.id, f.subnetId, 'firewall-subnet');
      add(f.id, f.policyId, 'firewall-policy');
      add(f.id, f.publicIpId, 'firewall-public-ip');
    }
    for (const r of world.routes)
      if (r.nextHopType === 'VirtualAppliance') add(r.id, r.firewallId, 'appliance-reference');
  }
  // Stable layered layout, no stored positions. Each RG gets disjoint rows; columns follow actual parents.
  let offset = 0;
  for (const subscription of nodes
    .filter((n) => !n.resource)
    .sort((a, b) => a.id.localeCompare(b.id))) {
    subscription.x = 0;
    subscription.y = offset;
    for (const group of world.groups
      .filter((g) => g.subscriptionId === subscription.subscriptionId)
      .toSorted((a, b) => a.id.localeCompare(b.id))) {
      const counters = new Map<number, number>();
      const members = nodes
        .filter((n) => n.groupId === group.id)
        .sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
      const depth = (id: string, seen = new Set<string>()): number => {
        if (seen.has(id)) return 2;
        seen.add(id);
        const r = rows.find((x) => x.id === id);
        return !r || r.view === 'group' ? 1 : r.parentId ? depth(r.parentId, seen) + 1 : 2;
      };
      const counts = new Map<number, number>();
      for (const n of members) {
        const d = depth(n.id);
        counts.set(d, (counts.get(d) ?? 0) + 1);
      }
      const starts = new Map<number, number>();
      let x = 290;
      for (const d of [...counts.keys()].sort((a, b) => a - b)) {
        starts.set(d, x);
        x += Math.ceil(counts.get(d)! / 8) * 290 + 60;
      }
      for (const node of members) {
        const d = depth(node.id),
          row = counters.get(d) ?? 0;
        counters.set(d, row + 1);
        node.x = starts.get(d)! + Math.floor(row / 8) * 290;
        node.y = offset + (row % 8) * 240;
      }
      offset += Math.min(8, Math.max(1, ...counts.values())) * 240 + 120;
    }
    offset += 80;
  }
  return { workspace, model: world.model, revision: world.revision, nodes, edges };
}
export function filterTopology(topology: Topology, filters: Filters): Topology {
  const nodes = topology.nodes.filter(
    (n) =>
      (!filters.subscription || n.subscriptionId === filters.subscription) &&
      (!filters.group || n.groupId === filters.group) &&
      (!filters.kind || n.resource?.view === filters.kind),
  );
  const ids = new Set(nodes.map((n) => n.id));
  return {
    ...topology,
    nodes,
    edges: topology.edges.filter((e) => ids.has(e.from) && ids.has(e.to)),
  };
}
export function currentAnalysis(
  snapshot: Snapshot,
  result: LaboratoryPolicyResult | null,
): result is LaboratoryPolicyResult {
  return (
    !!result &&
    result.workspace === snapshot.workspace &&
    result.model === snapshot.world.model &&
    result.revision === snapshot.world.revision
  );
}
export type Observation = {
  id: string;
  type: keyof typeof t.observationTypes;
  classification: keyof typeof t.classes;
  resourceId: string;
  reason: string;
  ruleId?: string;
};
export function architectureObservations(
  snapshot: Snapshot,
  rows: readonly LaboratoryResource[],
  analysis: LaboratoryPolicyResult | null,
  expectFirewall: boolean,
): Observation[] {
  const result: Observation[] = [];
  const add = (
    type: Observation['type'],
    classification: Observation['classification'],
    resourceId: string,
    reason: string,
    ruleId?: string,
  ) =>
    result.push({
      id: `${type}:${resourceId}`,
      type,
      classification,
      resourceId,
      reason,
      ...(ruleId ? { ruleId } : {}),
    });
  for (const r of rows)
    if (r.view === 'peering' && r.status === 'Initiated')
      add('peering-not-connected', 'review', r.id, t.reasons.peering);
  const w = snapshot.world;
  if ('securityRules' in w)
    for (const r of w.securityRules)
      if (
        r.access === 'Allow' &&
        r.source === '*' &&
        r.destination === '*' &&
        r.destinationPort === '*'
      )
        add('broad-allow', 'review', r.id, t.reasons.broad);
  if (w.model === 'laboratory@3.5.0')
    for (const r of w.firewallRules)
      if (
        r.source === '*' &&
        r.destination === '*' &&
        r.destinationPort === '*' &&
        w.firewallCollections.find((c) => c.id === r.collectionId)?.action === 'Allow'
      )
        add('broad-allow', 'review', r.id, t.reasons.broad);
  if (currentAnalysis(snapshot, analysis)) {
    for (const l of analysis.layers)
      if (l.status === 'deny' && l.matchedRuleId)
        add(
          'nsg-deny',
          'finding',
          rows.some((r) => r.id === l.matchedRuleId) ? l.matchedRuleId : (l.nsgId ?? l.resourceId),
          t.reasons.nsg,
          l.matchedRuleId,
        );
    if ('firewallPath' in analysis) {
      if (expectFirewall && analysis.firewallPath.disposition === 'bypasses-firewall')
        add('firewall-bypass-intent', 'finding', analysis.sourceNicId, t.reasons.bypass);
      if (analysis.reason.startsWith('return-') || analysis.reason === 'hub-return-path-missing')
        add(
          'return-incomplete',
          'unknown',
          analysis.destinationNicId,
          t.reasons.return + ' · ' + analysis.reason,
        );
    }
  }
  return result;
}
/** Resource references reported by the server; never a new route/policy evaluation. */
export function diagnosticReferences(
  snapshot: Snapshot,
  analysis: LaboratoryPolicyResult | null,
): string[] {
  if (!currentAnalysis(snapshot, analysis)) return [];
  const ids = [analysis.sourceNicId, analysis.sourceSubnetId];
  if ('vms' in snapshot.world) {
    const vm = snapshot.world.vms.find((v) => v.nicId === analysis.sourceNicId);
    if (vm) ids.unshift(vm.id);
  }
  const route = analysis.route?.selected;
  const includeRoute = (id: string) => {
    const row =
      'routes' in snapshot.world ? snapshot.world.routes.find((r) => r.id === id) : undefined;
    if (row) ids.push(row.routeTableId);
    ids.push(id);
  };
  if (route) includeRoute(route.id);
  if ('firewallPath' in analysis) {
    const p = analysis.firewallPath;
    ids.push(
      ...[
        p.firewallId,
        p.policyId,
        p.decision?.groupId,
        p.decision?.collectionId,
        p.decision?.matchedRuleId,
      ].filter((id): id is string => !!id),
    );
    for (const r of [
      p.forwardRoute,
      p.nextHopRoute,
      p.onwardRoute,
      p.returnRoute,
      p.returnNextHopRoute,
      p.hubReturnRoute,
    ])
      if (r) includeRoute(r.selected.id);
    ids.push(...p.receivingPeerings.map((p) => p.id));
  }
  for (const layer of analysis.layers)
    if (layer.status !== 'not-evaluated')
      ids.push(...[layer.nsgId, layer.matchedRuleId].filter((id): id is string => !!id));
  if ('subnets' in snapshot.world) {
    for (const id of [analysis.sourceSubnetId, analysis.destinationSubnetId]) {
      const subnet = snapshot.world.subnets.find((s) => s.id === id);
      if (subnet) ids.push(subnet.vnetId);
    }
  }
  ids.push(analysis.destinationSubnetId, analysis.destinationNicId);
  if ('vms' in snapshot.world) {
    const vm = snapshot.world.vms.find((v) => v.nicId === analysis.destinationNicId);
    if (vm) ids.push(vm.id);
  }
  const all = new Set(rowsIds(snapshot));
  return [...new Set(ids)].filter((id) => all.has(id));
}
function rowsIds(snapshot: Snapshot): string[] {
  return Object.values(snapshot.world).flatMap((v) =>
    Array.isArray(v)
      ? v.flatMap((x) => (x && typeof x === 'object' && 'id' in x ? [String(x.id)] : []))
      : [],
  );
}
/** A stale/foreign URL choice must not display All while silently filtering on a missing ID. */
export function validStudioFilters(rows: readonly LaboratoryResource[], filters: Filters): Filters {
  return {
    subscription: rows.some((r) => r.subscriptionId === filters.subscription)
      ? filters.subscription
      : '',
    group: rows.some((r) => r.groupId === filters.group) ? filters.group : '',
    kind: rows.some((r) => r.view === filters.kind) ? filters.kind : '',
  };
}
