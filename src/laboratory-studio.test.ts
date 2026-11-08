import { it, expect } from 'vitest';
import { firewallWorld } from '../tests/fixtures/firewall-world';
import { laboratoryInventory } from './features/laboratory/portal-adapter';
import {
  projectTopology,
  filterTopology,
  architectureObservations,
  diagnosticReferences,
  currentAnalysis,
  validStudioFilters,
} from './features/laboratory/studio-model';
import { analysePolicy } from './laboratory/v35/analysis';
import { canonical, replay, freshWorld, models, type Snapshot } from './laboratory/engine';
import { readStudio, studioContext, studioReturn } from './features/laboratory/studio-location';
function fixture() {
  const f = firewallWorld();
  const snapshot: Snapshot = {
    workspace: 'test-workspace',
    world: f.s.world,
    entries: f.s.entries,
    historical: false,
  };
  return { ...f, snapshot, rows: laboratoryInventory(snapshot.world) };
}
it('projects every actual resource exactly once with subscription scope and exact non-ambiguous typed relationships', () => {
  const f = fixture(),
    g = projectTopology(f.snapshot, f.rows);
  expect(new Set(g.nodes.map((n) => n.id)).size).toBe(g.nodes.length);
  expect(g.nodes.filter((n) => n.resource)).toHaveLength(f.rows.length);
  const edge = (from: string, to: string, kind: string) =>
    expect(g.edges.some((e) => e.from === from && e.to === to && e.kind === kind)).toBe(true);
  edge(f.appVm, f.appNic, 'vm-nic');
  edge(f.appNic, f.appSubnet, 'nic-subnet');
  edge(f.appSubnet, f.appNsg, 'subnet-nsg');
  edge(f.appSubnet, f.appTable, 'subnet-route-table');
  edge(f.firewall, f.hubSubnet, 'firewall-subnet');
  edge(f.firewall, f.policy, 'firewall-policy');
  edge(f.policy, f.collectionGroup, 'parent');
  edge(f.collectionGroup, f.collection, 'parent');
  edge(f.collection, f.rule, 'parent');
  expect(g.edges.find((e) => e.from === f.appHub && e.to === f.hub)?.status).toBe('Connected');
  expect(
    g.edges.every(
      (e) => g.nodes.some((n) => n.id === e.from) && g.nodes.some((n) => n.id === e.to),
    ),
  ).toBe(true);
  expect(g.edges.filter((e) => e.kind === 'vm-disk')).toHaveLength(2);
  expect(g.edges.filter((e) => e.kind === 'firewall-public-ip')).toHaveLength(1);
});
it('preserves Initiated direction without presenting peering as traffic or generating transitive edges', () => {
  const f = fixture();
  const other = f.s.create({
    type: 'CreateVirtualNetwork',
    name: 'one-way',
    groupId: f.group,
    region: 'norwayeast',
    addressSpace: '10.80.0.0/16',
  });
  const p = f.s.create({
    type: 'CreateVnetPeering',
    name: 'only-one',
    vnetId: f.hub,
    remoteVnetId: other,
  });
  const s = { ...f.snapshot, world: f.s.world, entries: f.s.entries },
    rows = laboratoryInventory(s.world),
    g = projectTopology(s, rows);
  expect(g.edges.find((e) => e.from === p && e.to === other)?.status).toBe('Initiated');
  expect(
    architectureObservations(s, rows, null, false).find((o) => o.resourceId === p)?.classification,
  ).toBe('review');
  expect(g.edges.some((e) => e.from === f.app && e.to === f.data)).toBe(false);
});
it('filters only the existing projection and keeps only edges whose endpoints are visible, without changing evidence', () => {
  const f = fixture(),
    before = canonical(f.snapshot),
    g = projectTopology(f.snapshot, f.rows);
  const a = filterTopology(g, { subscription: 'sub-shared', group: f.group, kind: 'vm' });
  expect(a.nodes.map((n) => n.id).sort()).toEqual([f.appVm, f.dataVm].sort());
  expect(a.edges).toEqual([]);
  expect(canonical(f.snapshot)).toBe(before);
});
it('keeps duplicate permitted resource names in different scopes distinct by ID and actual parents', () => {
  const f = fixture(),
    group = f.s.create({
      type: 'CreateGroup',
      name: 'other',
      subscriptionId: 'sub-app',
      metadataRegion: 'norwayeast',
    });
  const a = f.s.create({
    type: 'CreateStorageAccount',
    name: 'samename',
    groupId: f.group,
    region: 'norwayeast',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  // Account names are World-unique: use VNets, whose namespaces are actually per RG.
  const first = f.s.create({
    type: 'CreateVirtualNetwork',
    name: 'same-vnet',
    groupId: f.group,
    region: 'norwayeast',
    addressSpace: '10.70.0.0/16',
  });
  const second = f.s.create({
    type: 'CreateVirtualNetwork',
    name: 'same-vnet',
    groupId: group,
    region: 'norwayeast',
    addressSpace: '10.71.0.0/16',
  });
  const s = { ...f.snapshot, world: f.s.world, entries: f.s.entries },
    g = projectTopology(s, laboratoryInventory(s.world));
  expect(a).toBeTruthy();
  expect(first).not.toBe(second);
  expect(g.nodes.filter((n) => n.name === 'same-vnet')).toHaveLength(2);
  expect(g.edges.find((e) => e.to === first)?.from).toBe(f.group);
  expect(g.edges.find((e) => e.to === second)?.from).toBe(group);
  expect(g.nodes.find((n) => n.id === first)?.scope).not.toBe(
    g.nodes.find((n) => n.id === second)?.scope,
  );
});
it('uses actual server-result references and no competing evaluator; stale revision or workspace removes all diagnostics', () => {
  const f = fixture(),
    r = analysePolicy(f.s.world, f.input);
  expect(r.ok).toBe(true);
  if (!r.ok) throw Error(r.code);
  const result = { ...r.analysis, workspace: f.snapshot.workspace };
  expect(currentAnalysis(f.snapshot, result)).toBe(true);
  expect(diagnosticReferences(f.snapshot, result)).toContain(f.firewall);
  expect(diagnosticReferences(f.snapshot, result)).toContain(f.rule);
  const stale = {
    ...f.snapshot,
    world: { ...f.snapshot.world, revision: f.snapshot.world.revision + 1 },
  };
  expect(diagnosticReferences(stale, result)).toEqual([]);
  expect(currentAnalysis({ ...f.snapshot, workspace: 'another' }, result)).toBe(false);
});
it('reports concrete NSG and return findings only when the existing analysis actually supplies them; bypass requires explicit intent', () => {
  const f = fixture();
  f.s.create({
    type: 'CreateSecurityRule',
    nsgId: f.dataNsg,
    name: 'deny-sql',
    priority: '100',
    direction: 'Inbound',
    protocol: 'Tcp',
    source: '*',
    destination: '*',
    sourcePort: '*',
    destinationPort: '1433',
    access: 'Deny',
  });
  const s = { ...f.snapshot, world: f.s.world, entries: f.s.entries },
    r = analysePolicy(f.s.world, f.input);
  if (!r.ok) throw Error(r.code);
  const observations = architectureObservations(
    s,
    laboratoryInventory(s.world),
    { ...r.analysis, workspace: s.workspace },
    false,
  );
  expect(observations.filter((o) => o.type === 'nsg-deny')).toHaveLength(1);
  expect(observations.some((o) => o.type === 'return-incomplete')).toBe(false);
  expect(r.analysis.firewallPath.decision?.status).toBe('allow');
  expect(r.analysis.firewallPath.disposition).toBe('denied-by-nsg');
});
it('marks only actual fully broad custom Allows as review points, never a score or absence-of-NSG failure', () => {
  const f = fixture(),
    id = f.s.create({
      type: 'CreateSecurityRule',
      nsgId: f.appNsg,
      name: 'broad',
      priority: '101',
      direction: 'Inbound',
      protocol: 'Tcp',
      source: '*',
      destination: '*',
      sourcePort: '*',
      destinationPort: '*',
      access: 'Allow',
    });
  const s = { ...f.snapshot, world: f.s.world };
  expect(
    architectureObservations(s, laboratoryInventory(s.world), null, false).find(
      (o) => o.resourceId === id,
    ),
  ).toMatchObject({ type: 'broad-allow', classification: 'review' });
});
it('lays out a real near-capacity World without colliding node boxes and preserves deterministic historical replay', () => {
  const f = fixture();
  const count = () => laboratoryInventory(f.s.world).length;
  for (let i = 0; i < 30; i++)
    f.s.create({
      type: 'CreateSecurityRule',
      nsgId: i < 15 ? f.appNsg : f.dataNsg,
      name: 'capacity-rule-' + i,
      priority: String(300 + i),
      direction: 'Inbound',
      protocol: 'Udp',
      source: '10.70.0.0/16',
      destination: '10.10.1.0/24',
      sourcePort: '*',
      destinationPort: '53',
      access: 'Allow',
    });
  const accounts = [];
  for (let i = 0; i < 8 && count() < 96; i++)
    accounts.push(
      f.s.create({
        type: 'CreateStorageAccount',
        name: 'capaccount' + i,
        groupId: f.group,
        region: 'norwayeast',
        kind: 'StorageV2',
        sku: 'Standard_LRS',
      }),
    );
  const containers = [];
  for (let i = 0; i < 16 && count() < 96; i++)
    containers.push(
      f.s.create({
        type: 'CreateBlobContainer',
        accountId: accounts[0]!,
        name: 'container-' + i,
        access: 'private',
      }),
    );
  for (let i = 0; i < 32 && count() < 96; i++)
    f.s.create({
      type: 'CreateTextBlob',
      containerId: containers[0]!,
      name: 'blob-' + i,
      text: 'synthetic',
      contentType: 'text/plain',
    });
  expect(count()).toBe(96);
  const s = { ...f.snapshot, world: f.s.world, entries: f.s.entries },
    rows = laboratoryInventory(s.world),
    g = projectTopology(s, rows),
    h = projectTopology(s, [...rows].reverse());
  expect(new Set(g.nodes.map((n) => `${n.x}:${n.y}`)).size).toBe(g.nodes.length);
  expect(new Map(g.nodes.map((n) => [n.id, [n.x, n.y]]))).toEqual(
    new Map(h.nodes.map((n) => [n.id, [n.x, n.y]])),
  );
  expect(replay(s.entries, s.world.model)).toEqual(s.world);
  expect(g.nodes.filter((n) => n.resource)).toHaveLength(96);
});
it('reads old models without upgrading or inventing absent resource families', () => {
  for (const model of models) {
    const world = freshWorld(model),
      s: Snapshot = { world, workspace: model, entries: [], historical: true };
    expect(projectTopology(s, laboratoryInventory(world)).nodes).toEqual([]);
    expect(s.world.model).toBe(model);
  }
});
it('bounds URL-only state and never treats it as workspace ownership or an arbitrary return URL', () => {
  const p = new URLSearchParams({
    sw: 'own',
    sx: 'Infinity',
    sy: '0',
    sz: '1',
    sselected: 'id',
    ssub: 'sub-shared',
    studio: '1',
    evil: 'https://evil.test',
  });
  expect(readStudio(p, 'own').viewport).toBeUndefined();
  expect(readStudio(p, 'other').selected).toBe('');
  expect(studioReturn(p)).not.toContain('evil');
  expect(studioContext('/labs/laboratory?view=nic&id=nic-1', p)).toContain('studio=1');
  expect(studioContext('/labs/laboratory?view=nic', new URLSearchParams())).toBe(
    '/labs/laboratory?view=nic',
  );
});
it('adds a bypass observation only for the explicit intent and a return observation only for an actual server return diagnosis', () => {
  const f = fixture();
  f.s.run({ type: 'DeleteRoute', routeId: f.appRoute });
  f.s.create({
    type: 'CreateVnetPeering',
    name: 'direct-app-data',
    vnetId: f.app,
    remoteVnetId: f.data,
  });
  f.s.create({
    type: 'CreateVnetPeering',
    name: 'direct-data-app',
    vnetId: f.data,
    remoteVnetId: f.app,
  });
  let s = { ...f.snapshot, world: f.s.world, entries: f.s.entries };
  let r = analysePolicy(f.s.world, f.input);
  if (!r.ok) throw Error(r.code);
  let result = { ...r.analysis, workspace: s.workspace };
  expect(result.firewallPath.disposition).toBe('bypasses-firewall');
  expect(
    architectureObservations(s, laboratoryInventory(s.world), result, false).some(
      (o) => o.type === 'firewall-bypass-intent',
    ),
  ).toBe(false);
  expect(
    architectureObservations(s, laboratoryInventory(s.world), result, true).some(
      (o) => o.type === 'firewall-bypass-intent',
    ),
  ).toBe(true);
  const a = fixture();
  a.s.run({ type: 'DeleteRoute', routeId: a.dataRoute });
  s = { ...a.snapshot, world: a.s.world, entries: a.s.entries };
  r = analysePolicy(a.s.world, a.input);
  if (!r.ok) throw Error(r.code);
  result = { ...r.analysis, workspace: s.workspace };
  expect(
    architectureObservations(s, laboratoryInventory(s.world), result, false).some(
      (o) => o.type === 'return-incomplete',
    ),
  ).toBe(true);
});
it('includes actual selected UDR parent and VNet context without fabricating system-route resource nodes', () => {
  const f = fixture(),
    r = analysePolicy(f.s.world, f.input);
  if (!r.ok) throw Error(r.code);
  const refs = diagnosticReferences(f.snapshot, { ...r.analysis, workspace: f.snapshot.workspace });
  expect(refs).toContain(f.appTable);
  expect(refs).toContain(f.app);
  expect(refs).toContain(f.data);
  expect(refs.every((id) => f.rows.some((row) => row.id === id))).toBe(true);
});

it('ignores stale URL choices rather than rendering All with a hidden foreign filter', () => {
  const f = fixture();
  expect(
    validStudioFilters(f.rows, { subscription: 'foreign', group: 'missing', kind: 'unsupported' }),
  ).toEqual({ subscription: '', group: '', kind: '' });
  expect(
    validStudioFilters(f.rows, { subscription: 'sub-shared', group: f.group, kind: 'vm' }),
  ).toEqual({ subscription: 'sub-shared', group: f.group, kind: 'vm' });
});
it('distinguishes a NIC own Resource Group from its subnet association in another compatible Resource Group', () => {
  const f = fixture(),
    group = f.s.create({
      type: 'CreateGroup',
      name: 'rg-compute-only',
      subscriptionId: 'sub-shared',
      metadataRegion: 'norwayeast',
    });
  const nic = f.s.create({
    type: 'CreateNetworkInterface',
    name: 'nic-cross-group',
    groupId: group,
    region: 'norwayeast',
    vnetId: f.app,
    subnetId: f.appSubnet,
    privateIpAddress: '10.10.1.20',
    allocation: 'Static',
  });
  const s = { ...f.snapshot, world: f.s.world, entries: f.s.entries },
    g = projectTopology(s, laboratoryInventory(s.world));
  expect(g.edges.some((e) => e.from === group && e.to === nic && e.kind === 'membership')).toBe(
    true,
  );
  expect(
    g.edges.some((e) => e.from === nic && e.to === f.appSubnet && e.kind === 'nic-subnet'),
  ).toBe(true);
  expect(g.nodes.find((n) => n.id === nic)?.groupId).toBe(group);
});
