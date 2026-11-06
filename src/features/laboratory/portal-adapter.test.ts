import { expect, it } from 'vitest';
import { freshWorld, execute, type World, type Command } from '@/laboratory/engine';
import { laboratoryInventory } from './portal-adapter';

function fixture(model: 'laboratory@3.0.0' | 'laboratory@3.1.0') {
  let world = freshWorld(model),
    sequence = 0;
  const run = (command: Command) => {
    const result = execute(
      world,
      { commandId: `display-${++sequence}`, expectedRevision: world.revision, command },
      sequence,
    );
    expect(result.receipt.outcome).toBe('accepted');
    world = result.world;
    return result.receipt.addedIds[0]!;
  };
  const group = run({
    type: 'CreateGroup',
    name: 'rg-display',
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
  });
  const account = run({
    type: 'CreateStorageAccount',
    groupId: group,
    name: 'displaystorage',
    region: 'westeurope',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  const container = run({
    type: 'CreateBlobContainer',
    accountId: account,
    name: 'private-data',
    access: 'private',
  });
  const blob = run({
    type: 'CreateTextBlob',
    containerId: container,
    name: 'record.txt',
    text: 'Synthetic <script>text</script>',
    contentType: 'text/plain',
  });
  return {
    get world() {
      return world;
    },
    run,
    group,
    account,
    container,
    blob,
  };
}
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) freeze(item);
    Object.freeze(value);
  }
  return value;
}

it('projects original3.0 Storage with actual parent scope and account region without manufacturing network resources', () => {
  const f = fixture('laboratory@3.0.0'),
    before = JSON.stringify(f.world);
  const rows = laboratoryInventory(freeze(f.world));
  expect(rows.map((r) => r.view)).toEqual(['group', 'account', 'container', 'blob']);
  expect(rows.find((r) => r.id === f.blob)).toMatchObject({
    category: 'data',
    parentId: f.container,
    groupId: f.group,
    subscriptionId: 'sub-shared',
    location: 'westeurope',
  });
  expect(rows.find((r) => r.id === f.account)?.source).toBe(f.world.accounts[0]);
  expect(rows.find((r) => r.id === f.blob)?.source).toBe(f.world.blobs[0]);
  expect(JSON.stringify(f.world)).toBe(before);
});

it('derives network subresources and cross-RG association scope from the same3.1 World while retaining original origin and source identity', () => {
  const f = fixture('laboratory@3.1.0');
  const other = f.run({
    type: 'CreateGroup',
    name: 'rg-security',
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
  });
  const vnet = f.run({
    type: 'CreateVirtualNetwork',
    name: 'vnet-display',
    groupId: f.group,
    region: 'norwayeast',
    addressSpace: '10.20.0.0/16',
  });
  const subnet = f.run({
    type: 'CreateSubnet',
    name: 'snet-display',
    vnetId: vnet,
    addressPrefix: '10.20.1.0/24',
  });
  const nsg = f.run({
    type: 'CreateNetworkSecurityGroup',
    name: 'nsg-display',
    groupId: other,
    region: 'norwayeast',
  });
  const rule = f.run({
    type: 'CreateSecurityRule',
    name: 'allow-https',
    nsgId: nsg,
    direction: 'Inbound',
    priority: '100',
    protocol: 'Tcp',
    source: '*',
    sourcePort: '*',
    destination: '*',
    destinationPort: '443',
    access: 'Allow',
  });
  f.run({ type: 'AssociateSubnetNsg', subnetId: subnet, nsgId: nsg });
  const world = f.world as Extract<World, { model: 'laboratory@3.1.0' }>,
    before = JSON.stringify(world);
  const rows = laboratoryInventory(freeze(world));
  expect(rows).toHaveLength(9);
  expect(rows.filter((r) => r.category === 'resource').map((r) => r.view)).toEqual([
    'account',
    'vnet',
    'nsg',
  ]);
  expect(rows.find((r) => r.id === subnet)).toMatchObject({
    category: 'subresource',
    groupId: f.group,
    parentId: vnet,
    location: 'norwayeast',
    origin: world.subnets[0]!.origin,
  });
  expect(rows.find((r) => r.id === rule)).toMatchObject({
    category: 'subresource',
    groupId: other,
    parentId: nsg,
    groupName: 'rg-security',
  });
  expect(rows.find((r) => r.id === subnet)?.source).toBe(world.subnets[0]);
  expect(world.subnets[0]!.nsgId).toBe(nsg);
  expect(JSON.stringify(world)).toBe(before);
});

it('does not invent default resources, parents or successful evidence for an empty World', () => {
  expect(laboratoryInventory(freshWorld('laboratory@3.0.0'))).toEqual([]);
  expect(laboratoryInventory(freshWorld('laboratory@3.1.0'))).toEqual([]);
});
