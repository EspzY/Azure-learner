import { describe, it, expect } from 'vitest';
import golden from '../docs/reviews/evidence/pr62/laboratory30-golden.json';
import {
  execute,
  freshWorld,
  replay,
  parseRequest,
  canonical,
  resources,
} from './laboratory/v31/domain';
import { laboratoryModel, type World, type Command, type Entry } from './laboratory/v31/contract';
import { cidr, ipv4, privateSpace, subnetMetadata } from './laboratory/v31/ip';
import * as legacy from './laboratory/v3/domain';
import { replay as versionReplay } from './laboratory/engine';
function scenario() {
  let world = freshWorld();
  const entries: Entry[] = [];
  return {
    get world() {
      return world;
    },
    entries,
    run(command: Command) {
      const request = {
        commandId: 'cmd-' + (entries.length + 1),
        expectedRevision: world.revision,
        command,
      };
      const result = execute(world, request, entries.length + 1);
      entries.push({
        model: laboratoryModel,
        attempt: world.attempt,
        request,
        receipt: result.receipt,
      });
      world = result.world;
      return result.receipt;
    },
  };
}
const group: Command = {
  type: 'CreateGroup',
  subscriptionId: 'sub-shared',
  name: 'rg-net',
  metadataRegion: 'norwayeast',
};
const vnet: Command = {
  type: 'CreateVirtualNetwork',
  groupId: 'group-1',
  name: 'vnet-app',
  region: 'norwayeast',
  addressSpace: '10.20.0.0/16',
};
const subnet: Command = {
  type: 'CreateSubnet',
  vnetId: 'vnet-2',
  name: 'snet-web',
  addressPrefix: '10.20.1.0/24',
};
const nsg: Command = {
  type: 'CreateNetworkSecurityGroup',
  groupId: 'group-1',
  name: 'nsg-web',
  region: 'norwayeast',
};
const rule: Command = {
  type: 'CreateSecurityRule',
  nsgId: 'nsg-4',
  name: 'allow-https',
  direction: 'Inbound',
  priority: '100',
  protocol: 'Tcp',
  source: '*',
  sourcePort: '*',
  destination: '10.20.1.0/24',
  destinationPort: '443',
  access: 'Allow',
};
function ready() {
  const s = scenario();
  for (const c of [group, vnet, subnet, nsg]) expect(s.run(c).outcome).toBe('accepted');
  return s;
}
describe('strict IPv4 and finite private address-space contract', () => {
  it.each([
    '10.20.1.7/24',
    '10.020.0.0/16',
    '10.0.0/16',
    '256.0.0.0/16',
    '10.0.0.0/33',
    '10.0.0.0/-1',
    '10.0.0.0/016',
    ' 10.0.0.0/8',
    '10.0.0.0/8 ',
    '::/64',
    '10.0.0.0/8/8',
  ])('rejects noncanonical IPv4 CIDR %s', (value) => expect(cidr(value)).toBeNull());
  it('handles unsigned boundaries without JavaScript signed bit overflow', () => {
    expect(ipv4('255.255.255.255')).toBe(4294967295);
    expect(cidr('0.0.0.0/0')).toMatchObject({ first: 0, last: 4294967295, size: 4294967296 });
    expect(cidr('255.255.255.255/32')).toMatchObject({ size: 1 });
    expect(privateSpace('172.16.0.0/12')).toBe(true);
    expect(privateSpace('192.168.0.0/16')).toBe(true);
    for (const x of ['0.0.0.0/0', '172.0.0.0/8', '100.64.0.0/10', '203.0.113.0/24', '10.0.0.0/30'])
      expect(privateSpace(x), x).toBe(false);
  });
  it('shows five reserved addresses as metadata, never allocating IPs', () => {
    expect(subnetMetadata('10.20.1.0/24')).toEqual({
      first: '10.20.1.0',
      last: '10.20.1.255',
      reserved: ['10.20.1.0', '10.20.1.1', '10.20.1.2', '10.20.1.3', '10.20.1.255'],
      usableCount: 251,
    });
    expect(subnetMetadata('10.20.1.0/29')?.usableCount).toBe(3);
    expect(subnetMetadata('10.20.1.0/30')).toBeNull();
  });
});
it('creates stable actual parent/scope relationships and an original authoritative association', () => {
  const s = ready();
  expect(s.run(rule).code).toBe('created');
  expect(s.run({ type: 'AssociateSubnetNsg', subnetId: 'subnet-3', nsgId: 'nsg-4' }).code).toBe(
    'updated',
  );
  expect(s.world.subnets[0]).toMatchObject({ nsgId: 'nsg-4', associationOrigin: 'cmd-6' });
  expect(s.world.securityRules[0]).toMatchObject({ id: 'rule-5', priority: 100, nsgId: 'nsg-4' });
  expect(resources(s.world).map((r) => r.id)).toEqual([
    'group-1',
    'vnet-2',
    'subnet-3',
    'nsg-4',
    'rule-5',
  ]);
  expect(s.world.nextId).toBe(6);
  expect(s.world.revision).toBe(6);
});
it('accepts adjacent subnets and rejects contained overlap, containing overlap and outside ranges atomically', () => {
  const s = ready();
  for (const [name, addressPrefix, code] of [
    ['adjacent', '10.20.2.0/24', 'created'],
    ['same', '10.20.1.0/24', 'overlapping-subnet'],
    ['inside', '10.20.1.128/25', 'overlapping-subnet'],
    ['around', '10.20.0.0/16', 'overlapping-subnet'],
    ['outside', '10.21.0.0/24', 'outside-address-space'],
    ['hostbits', '10.20.4.1/24', 'invalid-cidr'],
    ['small', '10.20.4.0/30', 'invalid-cidr'],
  ] as const) {
    const before = canonical(s.world);
    expect(s.run({ ...subnet, name, addressPrefix }).code).toBe(code);
    if (code !== 'created') expect(canonical(s.world)).toBe(before);
  }
});
it('keeps disconnected VNet address spaces independent; subnet names are scoped and case-insensitive', () => {
  const s = ready();
  expect(s.run({ ...vnet, name: 'other' }).code).toBe('created');
  expect(s.run({ ...subnet, vnetId: 'vnet-5' }).code).toBe('created');
  expect(s.run({ ...subnet, name: 'SNET-WEB', addressPrefix: '10.20.5.0/24' }).code).toBe(
    'duplicate-name',
  );
  expect(s.run({ ...vnet, name: 'VNET-APP' }).code).toBe('duplicate-name');
});
it.each([
  '!bad',
  'a.',
  'a-',
  '_bad',
  'a'.repeat(81),
  'GatewaySubnet',
  'AzureBastionSubnet',
  'AzureFirewallSubnet',
  'AzureFirewallManagementSubnet',
  'RouteServerSubnet',
])('rejects invalid or explicitly unsupported subnet name %s', (name) => {
  const s = ready();
  expect(s.run({ ...subnet, name, addressPrefix: '10.20.4.0/24' }).outcome).not.toBe('accepted');
});
it('checks Azure name boundaries and exact parent types', () => {
  const s = scenario();
  s.run(group);
  expect(s.run({ ...vnet, name: 'a' }).code).toBe('invalid-name');
  expect(s.run({ ...vnet, name: 'a'.repeat(64) }).code).toBe('created');
  expect(s.run({ ...vnet, name: 'a'.repeat(65) }).code).toBe('invalid-name');
  expect(s.run({ ...nsg, name: 'n' }).code).toBe('created');
  expect(s.run({ ...vnet, groupId: 'nsg-3' }).code).toBe('invalid-parent');
  expect(s.run({ ...subnet, vnetId: 'group-1' }).code).toBe('invalid-parent');
  expect(s.run({ ...nsg, region: 'moon' }).code).toBe('invalid-region');
  expect(s.run({ ...nsg, groupId: 'missing' }).code).toBe('invalid-parent');
});
it('requires unique names per NSG and priority per direction, including both boundary priorities', () => {
  const s = ready();
  expect(s.run({ ...rule, priority: '100' }).code).toBe('created');
  expect(s.run({ ...rule, name: 'second', priority: '100' }).code).toBe('priority-conflict');
  expect(s.run({ ...rule, name: 'outbound', direction: 'Outbound', priority: '100' }).code).toBe(
    'created',
  );
  expect(
    s.run({
      ...rule,
      name: 'highest-number',
      priority: '4096',
      sourcePort: '0',
      destinationPort: '65535',
      protocol: '*',
    }).code,
  ).toBe('created');
  expect(s.run({ ...rule, name: 'ALLOW-HTTPS', priority: '200' }).code).toBe('duplicate-name');
});
it.each(['99', '4097', '0100', '100.5', 'NaN', '100 ', '0'])(
  'rejects invalid priority %s',
  (priority) => {
    const s = ready();
    expect(s.run({ ...rule, priority }).code).toBe('invalid-priority');
  },
);
it.each([
  { source: 'Internet' },
  { source: 'VirtualNetwork' },
  { source: '10.0.0.0/8,192.168.0.0/16' },
  { source: '10.20.0.1/16' },
  { destination: '::/0' },
  { sourcePort: '80-90' },
  { destinationPort: '80,443' },
  { destinationPort: '65536' },
  { protocol: 'Icmp' },
  { direction: 'Both' },
  { access: 'Audit' },
])('rejects unsupported rule syntax %j', (delta) => {
  const s = ready();
  const before = canonical(s.world);
  const rejected = s.run({ ...rule, ...delta });
  expect(rejected.code).toBe('invalid-rule');
  expect(rejected.field).toBe(Object.keys(delta)[0]);
  expect(canonical(s.world)).toBe(before);
});
it('rejects unknown fields, unsupported operations, reserved default names and missing NSGs', () => {
  const s = ready();
  expect(s.run({ ...rule, publicAccess: 'true' } as Command).code).toBe('unsupported-field');
  expect(s.run({ ...rule, name: 'AllowVnetInBound' }).code).toBe('unsupported-profile');
  expect(s.run({ ...rule, nsgId: 'vnet-2' }).code).toBe('invalid-parent');
  expect(s.run({ type: 'EffectiveRoutes' } as unknown as Command).code).toBe(
    'unsupported-capability',
  );
  expect(s.run({ type: 'ResetWorkspace', scope: 'all' } as Command).code).toBe('unsupported-field');
  expect(
    parseRequest({
      commandId: 'x',
      expectedRevision: 0,
      command: { type: 'CreateVirtualNetwork', addressSpace: ['10/8'] },
    }),
  ).toBeNull();
});
it('allows cross-RG same-region/subscription association but rejects other region/subscription or wrong parent', () => {
  const s = ready();
  s.run({ ...group, name: 'rg-other' });
  s.run({ ...nsg, groupId: 'group-5', name: 'nsg-other' });
  expect(s.run({ type: 'AssociateSubnetNsg', subnetId: 'subnet-3', nsgId: 'nsg-6' }).code).toBe(
    'updated',
  );
  s.run({ ...nsg, name: 'nsg-region', region: 'westeurope' });
  expect(s.run({ type: 'AssociateSubnetNsg', subnetId: 'subnet-3', nsgId: 'nsg-7' }).code).toBe(
    'incompatible-association',
  );
  s.run({ ...group, name: 'rg-app', subscriptionId: 'sub-app' });
  s.run({ ...nsg, name: 'nsg-subscription', groupId: 'group-8' });
  expect(s.run({ type: 'AssociateSubnetNsg', subnetId: 'subnet-3', nsgId: 'nsg-9' }).code).toBe(
    'incompatible-association',
  );
  expect(s.run({ type: 'AssociateSubnetNsg', subnetId: 'vnet-2', nsgId: 'nsg-6' }).code).toBe(
    'invalid-parent',
  );
  expect(s.world.subnets[0]?.nsgId).toBe('nsg-6');
});
it('reuses Storage in the same model, preserves original replay at association/reset through and never mutates input', () => {
  const s = ready();
  const frozen = structuredClone(s.world);
  s.run({
    type: 'CreateStorageAccount',
    groupId: 'group-1',
    name: 'netstorage',
    region: 'norwayeast',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  s.run({
    type: 'CreateBlobContainer',
    accountId: 'storage-5',
    name: 'private',
    access: 'private',
  });
  s.run({
    type: 'CreateTextBlob',
    containerId: 'container-6',
    name: 'proof.txt',
    text: '<safe> Å',
    contentType: 'text/plain',
  });
  expect(s.world.blobs[0]?.id).toBe('blob-7');
  expect(s.world.vnets).toEqual(frozen.vnets);
  expect(s.world.model).toBe(laboratoryModel);
  expect(s.entries.at(-1)?.receipt.beforeCount).toBe(6);
  expect(s.entries.at(-1)?.receipt.afterCount).toBe(7);
  const beforeReset = structuredClone(s.world);
  const receipt = s.run({ type: 'ResetWorkspace' });
  expect(receipt.removedIds).toHaveLength(7);
  expect(resources(s.world)).toEqual([]);
  expect(s.world.nextId).toBe(8);
  expect(s.world.attempt).toBe(2);
  expect(replay(s.entries, 7)).toEqual(beforeReset);
  expect(replay(s.entries)).toEqual(s.world);
  const tampered = structuredClone(s.entries);
  tampered[0]!.receipt.code = 'updated';
  expect(replay(tampered)).toBeNull();
  expect(versionReplay(s.entries, 'laboratory@3.0.0')).toBeNull();
});
it('keeps the historical3.0 unsupported networking result byte-identical and rejects mixed model replay', () => {
  const w = legacy.freshWorld(),
    request = {
      commandId: 'historical-unsupported',
      expectedRevision: 0,
      command: { type: 'CreateVirtualNetwork', name: 'legacy' } as never,
    };
  const before = legacy.execute(w, request, 1);
  expect(before.receipt.code).toBe('unsupported-capability');
  const entry = {
    model: 'laboratory@3.0.0' as const,
    attempt: 1,
    request,
    receipt: before.receipt,
  };
  expect(versionReplay([entry], 'laboratory@3.0.0')).toEqual(w);
  expect(versionReplay([entry], laboratoryModel)).toBeNull();
  expect(legacy.execute(w, request, 1)).toEqual(before);
});
it('enforces finite resource/rule budgets and keeps accepted/rejected executions read-only on source World', () => {
  const s = ready();
  for (let i = 0; i < 16; i++)
    expect(s.run({ ...rule, name: 'r' + i, priority: String(100 + i) }).code).toBe('created');
  expect(s.run({ ...rule, name: 'overflow', priority: '400' }).code).toBe('capacity');
  const before = structuredClone(s.world);
  const request = {
    commandId: 'readonly',
    expectedRevision: s.world.revision,
    command: { ...nsg, name: 'new' },
  };
  execute(s.world, request, s.entries.length + 1);
  expect(s.world).toEqual(before);
  const atCapacity = {
    ...s.world,
    blobs: Array.from({ length: 96 - resources(s.world).length }, (_, i) => ({
      id: 'budget' + i,
      name: 'b' + i,
      containerId: 'c',
      text: '',
      contentType: 'text/plain' as const,
      byteLength: 0,
      sha256: '',
      origin: 'budget',
    })),
  } as World;
  expect(resources(atCapacity)).toHaveLength(96);
  expect(
    execute(atCapacity, { ...request, command: { ...vnet, name: 'too-many' } }, 100).receipt.code,
  ).toBe('capacity');
});

it('replays the pinned original3.0 Storage and unsupported-networking golden without receipt or snapshot reinterpretation', () => {
  const entries = golden.entries as unknown as import('./laboratory/v3/contract').Entry[];
  expect(legacy.replay(entries)).toEqual(golden.world);
  expect(versionReplay(entries, 'laboratory@3.0.0')).toEqual(golden.world);
  expect(versionReplay(entries, laboratoryModel)).toBeNull();
  for (const through of [0, 1, 4, 5])
    expect(versionReplay(entries, 'laboratory@3.0.0', through)).toEqual(
      legacy.replay(entries, through),
    );
});

it('enforces the shared96-object budget with a fully reachable valid mixed-family World', () => {
  const s = scenario();
  s.run(group);
  for (let i = 0; i < 8; i++)
    expect(s.run({ ...vnet, name: 'network' + i }).outcome).toBe('accepted');
  const parent = s.world.vnets[0]!.id;
  for (let i = 0; i < 24; i++)
    expect(
      s.run({ ...subnet, vnetId: parent, name: 'subnet' + i, addressPrefix: `10.20.${i}.0/24` })
        .outcome,
    ).toBe('accepted');
  for (let i = 0; i < 8; i++)
    expect(s.run({ ...nsg, name: 'security' + i }).outcome).toBe('accepted');
  for (let i = 0; i < 32; i++)
    expect(
      s.run({
        ...rule,
        nsgId: s.world.nsgs[Math.floor(i / 16)]!.id,
        name: 'rule' + i,
        priority: String(100 + i),
      }).outcome,
    ).toBe('accepted');
  for (let i = 0; i < 8; i++)
    expect(
      s.run({
        type: 'CreateStorageAccount',
        groupId: 'group-1',
        name: 'account' + i,
        region: 'norwayeast',
        kind: 'StorageV2',
        sku: 'Standard_LRS',
      }).outcome,
    ).toBe('accepted');
  for (let i = 0; i < 15; i++)
    expect(
      s.run({
        type: 'CreateBlobContainer',
        accountId: s.world.accounts[0]!.id,
        name: 'container' + i,
        access: 'private',
      }).outcome,
    ).toBe('accepted');
  expect(resources(s.world)).toHaveLength(96);
  const before = canonical(s.world);
  expect(
    s.run({
      type: 'CreateTextBlob',
      containerId: s.world.containers[0]!.id,
      name: 'too-many.txt',
      text: 'small',
      contentType: 'text/plain',
    }).code,
  ).toBe('capacity');
  expect(canonical(s.world)).toBe(before);
  expect(replay(s.entries)).toEqual(s.world);
});
