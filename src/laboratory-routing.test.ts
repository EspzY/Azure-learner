import { describe, it, expect } from 'vitest';
import {
  execute,
  freshWorld,
  replay,
  canonical,
  peeringStatus,
  resources,
} from './laboratory/v32/domain';
import { laboratoryModel, type Command, type Entry } from './laboratory/v32/contract';
import { analyseRoutes, defaults } from './laboratory/v32/analysis';
import * as engine from './laboratory/engine';
import * as old from './laboratory/v3/domain';
import * as A from './laboratory/v31/domain';
import golden from '../docs/reviews/evidence/pr64/frozen-golden.json';

function scenario() {
  let world = freshWorld();
  const entries: Entry[] = [];
  return {
    get world() {
      return world;
    },
    entries,
    run(command: Command, expectedRevision = world.revision) {
      const request = { commandId: `routing-${entries.length + 1}`, expectedRevision, command };
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
function ready() {
  const s = scenario();
  const accepted = (command: Command) => {
    const receipt = s.run(command);
    expect(receipt.outcome, canonical(receipt)).toBe('accepted');
    return receipt.addedIds[0]!;
  };
  const groupId = accepted({
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'rg-routing',
    metadataRegion: 'norwayeast',
  });
  const hub = accepted({
    type: 'CreateVirtualNetwork',
    groupId,
    name: 'vnet-hub',
    region: 'norwayeast',
    addressSpace: '10.0.0.0/16',
  });
  const app = accepted({
    type: 'CreateVirtualNetwork',
    groupId,
    name: 'vnet-app',
    region: 'norwayeast',
    addressSpace: '10.10.0.0/16',
  });
  const data = accepted({
    type: 'CreateVirtualNetwork',
    groupId,
    name: 'vnet-data',
    region: 'westeurope',
    addressSpace: '10.20.0.0/16',
  });
  const hubSubnet = accepted({
    type: 'CreateSubnet',
    vnetId: hub,
    name: 'snet-shared',
    addressPrefix: '10.0.1.0/24',
  });
  const appSubnet = accepted({
    type: 'CreateSubnet',
    vnetId: app,
    name: 'snet-app',
    addressPrefix: '10.10.1.0/24',
  });
  const dataSubnet = accepted({
    type: 'CreateSubnet',
    vnetId: data,
    name: 'snet-data',
    addressPrefix: '10.20.1.0/24',
  });
  return {
    ...s,
    get world() {
      return s.world;
    },
    accepted,
    groupId,
    hub,
    app,
    data,
    hubSubnet,
    appSubnet,
    dataSubnet,
  };
}
describe('3.2 peering, real parents, reciprocal projection and frozen historical dispatch', () => {
  it('replays the original golden3.0/3.1 requests, rejected capabilities and receipt bytes at every through boundary', () => {
    for (const fixture of golden.fixtures) {
      const entries = fixture.entries as engine.Entry[],
        model = fixture.model as engine.Model;
      expect(engine.replay(entries, model)).toEqual(fixture.world);
      for (let through = 0; through <= entries.length; through++) {
        const world = engine.replay(entries, model, through);
        expect(world).not.toBeNull();
        expect(world).toEqual(engine.replay(entries.slice(0, through), model));
      }
      for (const entry of entries.slice(3))
        expect(entry.receipt.code).toBe('unsupported-capability');
    }
  });
  it('requires two directions, supports cross-region, never invents spoke-to-spoke routes or receipts', () => {
    const s = ready();
    s.accepted({ type: 'CreateVnetPeering', vnetId: s.hub, remoteVnetId: s.app, name: 'hub-app' });
    expect(peeringStatus(s.world, s.world.peerings[0]!)).toBe('Initiated');
    const unpaired = analyseRoutes(s.world, s.hubSubnet, '10.10.1.5');
    expect(unpaired.ok && unpaired.analysis.selected.nextHop).toBe('None');
    for (const [vnetId, remoteVnetId, name] of [
      [s.app, s.hub, 'app-hub'],
      [s.hub, s.data, 'hub-data'],
      [s.data, s.hub, 'data-hub'],
    ] as const)
      s.accepted({ type: 'CreateVnetPeering', vnetId, remoteVnetId, name });
    expect(s.world.peerings.map((p) => peeringStatus(s.world, p))).toEqual(
      Array(4).fill('Connected'),
    );
    const before = canonical(s.world),
      history = canonical(s.entries);
    const hub = analyseRoutes(s.world, s.hubSubnet, '10.20.1.5');
    expect(hub.ok && hub.analysis.selected.nextHop).toBe('VnetPeering');
    const spoke = analyseRoutes(s.world, s.appSubnet, '10.20.1.5');
    expect(spoke.ok && spoke.analysis.selected.nextHop).toBe('None');
    expect(canonical(s.world)).toBe(before);
    expect(canonical(s.entries)).toBe(history);
    expect(replay(s.entries)).toEqual(s.world);
    expect(replay(s.entries, 7)?.peerings).toHaveLength(0);
  });
  it('denies self, missing parents, names, duplicates, overlap and advanced flags atomically', () => {
    const s = ready();
    s.accepted({ type: 'CreateVnetPeering', vnetId: s.hub, remoteVnetId: s.app, name: 'hub-app' });
    const overlap = s.accepted({
      type: 'CreateVirtualNetwork',
      groupId: s.groupId,
      name: 'overlap',
      region: 'norwayeast',
      addressSpace: '10.0.2.0/24',
    });
    for (const [command, code] of [
      [
        { type: 'CreateVnetPeering', vnetId: s.hub, remoteVnetId: s.hub, name: 'self' },
        'invalid-peering',
      ],
      [
        { type: 'CreateVnetPeering', vnetId: s.hub, remoteVnetId: 'group-1', name: 'wrong' },
        'invalid-parent',
      ],
      [
        { type: 'CreateVnetPeering', vnetId: s.hub, remoteVnetId: s.app, name: 'other' },
        'duplicate-peering',
      ],
      [
        { type: 'CreateVnetPeering', vnetId: s.hub, remoteVnetId: s.data, name: 'HUB-APP' },
        'duplicate-name',
      ],
      [
        { type: 'CreateVnetPeering', vnetId: s.hub, remoteVnetId: overlap, name: 'overlap' },
        'overlapping-vnets',
      ],
      [
        { type: 'CreateVnetPeering', vnetId: s.hub, remoteVnetId: s.data, name: 'bad/' },
        'invalid-name',
      ],
      [
        {
          type: 'CreateVnetPeering',
          vnetId: s.hub,
          remoteVnetId: s.data,
          name: 'advanced',
          allowGatewayTransit: 'true',
        },
        'unsupported-field',
      ],
    ] as const) {
      const before = canonical(s.world);
      expect(s.run(command as Command).code).toBe(code);
      expect(canonical(s.world)).toBe(before);
    }
    expect(replay(s.entries)).toEqual(s.world);
  });
  it('keeps unsupported Part B requests unsupported in original3.0/3.1 replay', () => {
    const request = {
      commandId: 'old-routing',
      expectedRevision: 0,
      command: {
        type: 'CreateRouteTable',
        groupId: 'group-1',
        region: 'norwayeast',
        name: 'rt-old',
      },
    } as const;
    for (const [model, domain] of [
      ['laboratory@3.0.0', old],
      ['laboratory@3.1.0', A],
    ] as const) {
      const result = domain.execute(domain.freshWorld() as never, request as never, 1);
      expect(result.receipt.outcome).toBe('unsupported');
      const entries = [{ model, attempt: 1, request, receipt: result.receipt }];
      expect(engine.replay(entries, model)).toEqual(domain.freshWorld());
      expect(engine.replay(entries, laboratoryModel)).toBeNull();
    }
  });
});
describe('authoritative route tables, namespace and compatible subnet associations', () => {
  it('supports explicit replacement, multi-subnet associations and disassociation without altering NSG state', () => {
    const s = ready();
    const table = s.accepted({
      type: 'CreateRouteTable',
      groupId: s.groupId,
      region: 'norwayeast',
      name: 'rt-app',
    });
    for (const subnetId of [s.hubSubnet, s.appSubnet])
      s.accepted({ type: 'AssociateSubnetRouteTable', subnetId, routeTableId: table });
    const nsg = s.accepted({
      type: 'CreateNetworkSecurityGroup',
      groupId: s.groupId,
      region: 'norwayeast',
      name: 'nsg-app',
    });
    s.accepted({ type: 'AssociateSubnetNsg', subnetId: s.appSubnet, nsgId: nsg });
    expect(s.world.subnets.find((x) => x.id === s.appSubnet)).toMatchObject({
      routeTableId: table,
      nsgId: nsg,
    });
    const second = s.accepted({
      type: 'CreateRouteTable',
      groupId: s.groupId,
      region: 'norwayeast',
      name: 'rt-other',
    });
    s.accepted({ type: 'AssociateSubnetRouteTable', subnetId: s.appSubnet, routeTableId: second });
    const result = s.run({ type: 'DisassociateSubnetRouteTable', subnetId: s.appSubnet });
    expect(result.code).toBe('updated');
    expect(s.world.subnets.find((x) => x.id === s.appSubnet)).toMatchObject({
      routeTableId: null,
      nsgId: nsg,
      routeAssociationOrigin: result.commandId,
    });
    expect(s.world.subnets.find((x) => x.id === s.hubSubnet)?.routeTableId).toBe(table);
    expect(replay(s.entries)).toEqual(s.world);
  });
  it('checks regional/subscription compatibility but permits a compatible different resource group', () => {
    const s = ready();
    const other = s.accepted({
      type: 'CreateGroup',
      subscriptionId: 'sub-shared',
      name: 'rg-other',
      metadataRegion: 'norwayeast',
    });
    const table = s.accepted({
      type: 'CreateRouteTable',
      groupId: other,
      region: 'norwayeast',
      name: 'rt-other',
    });
    s.accepted({ type: 'AssociateSubnetRouteTable', subnetId: s.appSubnet, routeTableId: table });
    expect(
      s.run({ type: 'AssociateSubnetRouteTable', subnetId: s.dataSubnet, routeTableId: table })
        .code,
    ).toBe('incompatible-association');
    const external = s.accepted({
      type: 'CreateGroup',
      subscriptionId: 'sub-app',
      name: 'rg-app',
      metadataRegion: 'norwayeast',
    });
    const incompatible = s.accepted({
      type: 'CreateRouteTable',
      groupId: external,
      region: 'norwayeast',
      name: 'rt-sub',
    });
    expect(
      s.run({
        type: 'AssociateSubnetRouteTable',
        subnetId: s.appSubnet,
        routeTableId: incompatible,
      }).code,
    ).toBe('incompatible-association');
  });
  it('validates exact next hops, CIDR, names, parents and duplicate prefix without partial mutations', () => {
    const s = ready(),
      table = s.accepted({
        type: 'CreateRouteTable',
        groupId: s.groupId,
        region: 'norwayeast',
        name: 'rt-test',
      });
    const route = {
      type: 'CreateRoute',
      routeTableId: table,
      name: 'block-data',
      addressPrefix: '10.20.0.0/16',
      nextHopType: 'None',
    } as const;
    s.accepted(route);
    const cases: [Command, string][] = [
      [{ ...route, name: 'other' }, 'duplicate-prefix'],
      [{ ...route, name: 'BLOCK-DATA', addressPrefix: '10.0.0.0/16' }, 'duplicate-name'],
      [{ ...route, name: 'bad', addressPrefix: '10.20.1.2/24' }, 'invalid-cidr'],
      [{ ...route, name: 'bad', routeTableId: s.groupId }, 'invalid-parent'],
      [{ ...route, name: 'bad', nextHopType: 'VirtualAppliance' }, 'unsupported-next-hop'],
      [{ ...route, name: 'bad', nextHopType: 'VirtualNetworkGateway' }, 'unsupported-next-hop'],
      [{ ...route, name: 'bad', nextHopType: 'VnetPeering' }, 'unsupported-next-hop'],
      [
        { ...route, name: 'bad', nextHopType: 'VirtualNetworkServiceEndpoint' },
        'unsupported-next-hop',
      ],
      [{ ...route, name: 'bad', nextHopIpAddress: '10.0.1.4' } as Command, 'unsupported-field'],
      [
        { type: 'AssociateSubnetRouteTable', subnetId: 'group-1', routeTableId: table },
        'invalid-parent',
      ],
      [{ type: 'DisassociateSubnetRouteTable', subnetId: s.appSubnet }, 'not-associated'],
    ];
    for (const [c, code] of cases) {
      const before = canonical(s.world);
      expect(s.run(c).code).toBe(code);
      expect(canonical(s.world)).toBe(before);
    }
    expect(replay(s.entries)).toEqual(s.world);
  });
  it('enforces the documented bounded VnetLocal profile when either side of an association is added', () => {
    const s = ready(),
      table = s.accepted({
        type: 'CreateRouteTable',
        groupId: s.groupId,
        region: 'norwayeast',
        name: 'rt-local',
      });
    s.accepted({
      type: 'CreateRoute',
      routeTableId: table,
      name: 'local-app',
      addressPrefix: '10.10.0.0/16',
      nextHopType: 'VnetLocal',
    });
    s.accepted({ type: 'AssociateSubnetRouteTable', subnetId: s.appSubnet, routeTableId: table });
    expect(
      s.run({ type: 'AssociateSubnetRouteTable', subnetId: s.hubSubnet, routeTableId: table }).code,
    ).toBe('unsupported-route-profile');
    expect(
      s.run({
        type: 'CreateRoute',
        routeTableId: table,
        name: 'outside',
        addressPrefix: '10.0.0.0/16',
        nextHopType: 'VnetLocal',
      }).code,
    ).toBe('unsupported-route-profile');
  });
});
describe('explainable read-only routing: LPM, source tie-break and bounded system rules', () => {
  it('supports cross-subscription peering while explicitly rejecting an ambiguous same-prefix peer topology in analysis', () => {
    const s = ready(),
      other = s.accepted({
        type: 'CreateGroup',
        name: 'rg-app',
        subscriptionId: 'sub-app',
        metadataRegion: 'northeurope',
      });
    const remote = s.accepted({
      type: 'CreateVirtualNetwork',
      groupId: other,
      name: 'cross-sub',
      region: 'northeurope',
      addressSpace: '192.168.0.0/16',
    });
    for (const [vnetId, remoteVnetId] of [
      [s.app, remote],
      [remote, s.app],
    ])
      s.accepted({
        type: 'CreateVnetPeering',
        vnetId: vnetId!,
        remoteVnetId: remoteVnetId!,
        name: 'cross',
      });
    const selected = analyseRoutes(s.world, s.appSubnet, '192.168.1.2');
    expect(selected.ok && selected.analysis.selected.nextHop).toBe('VnetPeering');
    expect(
      selected.ok &&
        selected.analysis.candidates.filter((x) => x.addressPrefix === '192.168.0.0/16'),
    ).toHaveLength(1);
    const duplicate = s.accepted({
      type: 'CreateVirtualNetwork',
      groupId: s.groupId,
      name: 'same-remote-space',
      region: 'norwayeast',
      addressSpace: '192.168.0.0/16',
    });
    for (const [vnetId, remoteVnetId] of [
      [s.app, duplicate],
      [duplicate, s.app],
    ])
      s.accepted({
        type: 'CreateVnetPeering',
        vnetId: vnetId!,
        remoteVnetId: remoteVnetId!,
        name: 'ambiguous',
      });
    expect(analyseRoutes(s.world, s.appSubnet, '192.168.1.2')).toEqual({
      ok: false,
      code: 'ambiguous-routes',
    });
  });
  it('prefers longer system routes over a broader UDR, and UDR over system on exact-prefix ties', () => {
    const s = ready();
    for (const [vnetId, remoteVnetId] of [
      [s.app, s.hub],
      [s.hub, s.app],
    ])
      s.accepted({
        type: 'CreateVnetPeering',
        vnetId: vnetId!,
        remoteVnetId: remoteVnetId!,
        name: 'direct',
      });
    const table = s.accepted({
      type: 'CreateRouteTable',
      groupId: s.groupId,
      region: 'norwayeast',
      name: 'rt-app',
    });
    s.accepted({
      type: 'CreateRoute',
      routeTableId: table,
      name: 'default-deny',
      addressPrefix: '0.0.0.0/0',
      nextHopType: 'None',
    });
    s.accepted({ type: 'AssociateSubnetRouteTable', subnetId: s.appSubnet, routeTableId: table });
    const run = (ip: string) => {
      const result = analyseRoutes(s.world, s.appSubnet, ip);
      expect(result.ok).toBe(true);
      if (!result.ok) throw Error();
      return result.analysis;
    };
    expect(run('10.0.1.7').selected).toMatchObject({
      nextHop: 'VnetPeering',
      source: 'System',
      addressPrefix: '10.0.0.0/16',
    });
    expect(run('10.10.1.7').selected.nextHop).toBe('VnetLocal');
    expect(run('8.8.8.8').selected).toMatchObject({ nextHop: 'None', source: 'User' });
    s.accepted({
      type: 'CreateRoute',
      routeTableId: table,
      name: 'block-hub',
      addressPrefix: '10.0.0.0/16',
      nextHopType: 'None',
    });
    const tied = run('10.0.1.7');
    expect(tied.selected.source).toBe('User');
    expect(tied.candidates.find((x) => x.nextHop === 'VnetPeering')?.reason).toBe('system-tie');
    s.accepted({
      type: 'CreateRoute',
      routeTableId: table,
      name: 'specific-internet',
      addressPrefix: '10.0.1.0/24',
      nextHopType: 'Internet',
    });
    expect(run('10.0.1.7').selected.addressPrefix).toBe('10.0.1.0/24');
    expect(run('10.0.1.7').traffic).toBe('not-evaluated');
  });
  it('includes current documented defaults, denies unsupported platform destinations and never mutates evidence', () => {
    const s = ready(),
      before = canonical(s.world);
    for (const ip of ['100.64.1.1', '157.59.1.1', '104.147.1.1', '104.146.1.1']) {
      const r = analyseRoutes(s.world, s.appSubnet, ip);
      expect(r.ok && r.analysis.selected.nextHop).toBe('None');
    }
    expect(defaults).toHaveLength(9);
    for (const ip of ['168.63.129.16', '127.0.0.1', '169.254.1.1', '224.1.1.1', '255.255.255.255'])
      expect(analyseRoutes(s.world, s.appSubnet, ip)).toEqual({
        ok: false,
        code: 'unsupported-destination',
      });
    expect(analyseRoutes(s.world, s.appSubnet, '10.01.0.1')).toEqual({
      ok: false,
      code: 'invalid-destination',
    });
    expect(analyseRoutes(s.world, s.hub, '8.8.8.8')).toEqual({ ok: false, code: 'invalid-source' });
    expect(canonical(s.world)).toBe(before);
  });
  it('replaces an exact reserved default with the local VNet prefix', () => {
    const s = scenario();
    s.run({
      type: 'CreateGroup',
      name: 'rg-wide',
      subscriptionId: 'sub-shared',
      metadataRegion: 'norwayeast',
    });
    s.run({
      type: 'CreateVirtualNetwork',
      groupId: 'group-1',
      name: 'vnet-wide',
      region: 'norwayeast',
      addressSpace: '10.0.0.0/8',
    });
    s.run({
      type: 'CreateSubnet',
      vnetId: 'vnet-2',
      name: 'snet-wide',
      addressPrefix: '10.2.0.0/24',
    });
    const r = analyseRoutes(s.world, 'subnet-3', '10.3.0.4');
    expect(
      r.ok && r.analysis.candidates.filter((x) => x.addressPrefix === '10.0.0.0/8'),
    ).toHaveLength(1);
    expect(r.ok && r.analysis.selected.nextHop).toBe('VnetLocal');
  });
});
describe('combined resource budget, reset and original through replay', () => {
  it('enforces per-table routes, peer count and the combined budget across older resource handlers', () => {
    const s = ready(),
      table = s.accepted({
        type: 'CreateRouteTable',
        groupId: s.groupId,
        name: 'rt-limit',
        region: 'norwayeast',
      });
    for (let i = 0; i < 16; i++)
      s.accepted({
        type: 'CreateRoute',
        routeTableId: table,
        name: 'route-' + i,
        addressPrefix: `203.0.113.${i}/32`,
        nextHopType: 'None',
      });
    const before = canonical(s.world);
    expect(
      s.run({
        type: 'CreateRoute',
        routeTableId: table,
        name: 'overflow',
        addressPrefix: '203.0.113.17/32',
        nextHopType: 'None',
      }).code,
    ).toBe('capacity');
    expect(canonical(s.world)).toBe(before);
    const second = s.accepted({
      type: 'CreateRouteTable',
      groupId: s.groupId,
      name: 'rt-second',
      region: 'norwayeast',
    });
    for (let i = 0; i < 16; i++)
      s.accepted({
        type: 'CreateRoute',
        routeTableId: second,
        name: 'route-' + i,
        addressPrefix: `203.0.114.${i}/32`,
        nextHopType: 'None',
      });
    const third = s.accepted({
      type: 'CreateRouteTable',
      groupId: s.groupId,
      name: 'rt-third',
      region: 'norwayeast',
    });
    expect(
      s.run({
        type: 'CreateRoute',
        routeTableId: third,
        name: 'global-limit',
        addressPrefix: '0.0.0.0/0',
        nextHopType: 'None',
      }).code,
    ).toBe('capacity');
    for (let i = 0; i < 5; i++)
      s.accepted({
        type: 'CreateVirtualNetwork',
        groupId: s.groupId,
        name: 'vnet-limit-' + i,
        region: 'norwayeast',
        addressSpace: `10.${30 + i}.0.0/16`,
      });
    const pairs = s.world.vnets.flatMap((v) =>
      s.world.vnets
        .filter((other) => other.id !== v.id)
        .map((other) => ({ vnetId: v.id, remoteVnetId: other.id })),
    );
    for (const [i, pair] of pairs.slice(0, 16).entries())
      s.accepted({ type: 'CreateVnetPeering', ...pair, name: 'peer-' + i });
    expect(s.run({ type: 'CreateVnetPeering', ...pairs[16]!, name: 'peer-overflow' }).code).toBe(
      'capacity',
    );
    // Capacity branch is evaluated against the same all-family projection used by receipts.
    const full = structuredClone(s.world);
    while (resources(full).length < 96)
      full.peerings.push({
        id: 'budget-' + resources(full).length,
        name: 'budget',
        vnetId: s.hub,
        remoteVnetId: s.app,
        allowVirtualNetworkAccess: true,
        origin: 'budget-fixture',
      });
    const result = execute(
      full,
      {
        commandId: 'capacity-old-handler',
        expectedRevision: full.revision,
        command: {
          type: 'CreateStorageAccount',
          groupId: s.groupId,
          name: 'capacitycheck',
          region: 'norwayeast',
          kind: 'StorageV2',
          sku: 'Standard_LRS',
        },
      },
      1,
    );
    expect(result.receipt.code).toBe('capacity');
    expect(result.world).toBe(full);
    expect(result.receipt.beforeCount).toBe(96);
  });
  it('preserves Storage, Part A and all original relations across old handlers; reset clears every family', () => {
    const s = ready();
    const table = s.accepted({
      type: 'CreateRouteTable',
      groupId: s.groupId,
      name: 'rt-hub',
      region: 'norwayeast',
    });
    s.accepted({ type: 'AssociateSubnetRouteTable', subnetId: s.hubSubnet, routeTableId: table });
    const account = s.accepted({
      type: 'CreateStorageAccount',
      groupId: s.groupId,
      name: 'routingstore',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
    });
    const container = s.accepted({
      type: 'CreateBlobContainer',
      accountId: account,
      name: 'texts',
      access: 'private',
    });
    s.accepted({
      type: 'CreateTextBlob',
      containerId: container,
      name: 'proof.txt',
      text: 'historical routing evidence',
      contentType: 'text/plain',
    });
    const before = structuredClone(s.world),
      through = s.entries.length;
    const reset = s.run({ type: 'ResetWorkspace' });
    expect(reset.removedIds).toEqual(resources(before).map((x) => x.id));
    expect(resources(s.world)).toHaveLength(0);
    expect(s.world.attempt).toBe(2);
    expect(s.world.nextId).toBe(before.nextId);
    expect(replay(s.entries, through)).toEqual(before);
    expect(replay(s.entries)).toEqual(s.world);
    const tampered = structuredClone(s.entries);
    tampered[through - 1]!.receipt.afterRevision++;
    expect(replay(tampered)).toBeNull();
    expect(
      s.run(
        { type: 'CreateRouteTable', groupId: s.groupId, region: 'norwayeast', name: 'stale' },
        0,
      ).code,
    ).toBe('stale-revision');
  });
});
