import { it, expect } from 'vitest';
import { topologyWorld, routeUpdate } from '../tests/fixtures/topology-world';
import { execute, replay, parseRequest, canonical, resources } from './laboratory/v37/domain';
import { analysePolicy, analyseRoutes } from './laboratory/v37/analysis';
import type { Command } from './laboratory/v37/contract';
const packet = (f: ReturnType<typeof topologyWorld>) => ({
  sourceNicId: f.s.world.vms.find((v) => v.name === 'vm-app-01')!.nicId,
  destinationNicId: f.s.world.vms.find((v) => v.name === 'vm-data-01')!.nicId,
  protocol: 'Tcp',
  sourcePort: '50000',
  destinationPort: '1433',
});
it.each([false, true])(
  'disabled unselected direct peering cannot give false default-tag Allow through another Firewall route, reverse%s',
  (reverse) => {
    const f = topologyWorld();
    const p = f.s.create({
      type: 'CreateVnetPeering',
      vnetId: f.app,
      remoteVnetId: f.data,
      name: 'app-data',
    });
    const q = f.s.create({
      type: 'CreateVnetPeering',
      vnetId: f.data,
      remoteVnetId: f.app,
      name: 'data-app',
    });
    expect(
      f.s.run({
        type: 'SetPeeringVirtualNetworkAccess',
        peeringId: p,
        vnetId: f.app,
        value: 'false',
      }).outcome,
    ).toBe('accepted');
    if (reverse)
      expect(
        f.s.run({
          type: 'SetPeeringVirtualNetworkAccess',
          peeringId: q,
          vnetId: f.data,
          value: 'false',
        }).outcome,
      ).toBe('accepted');
    // A literal custom Allow still has all its actual prerequisites; an unused
    // disabled direct peering is not an invented general topology prohibition.
    expect(analysePolicy(f.s.world, packet(f))).toMatchObject({
      ok: true,
      analysis: { firewallPath: { disposition: 'allowed-via-firewall' } },
    });
    expect(
      f.s.run({ type: 'DeleteSecurityRule', ruleId: f.appRule, nsgId: f.appNsg }).outcome,
    ).toBe('accepted');
    expect(analysePolicy(f.s.world, packet(f))).toMatchObject({
      ok: true,
      analysis: {
        status: 'undetermined',
        virtualNetworkTagScope: 'undetermined-disabled-peering',
        accessChecks: expect.arrayContaining([
          expect.objectContaining({ peeringId: p, allowVirtualNetworkAccess: false }),
        ]),
        firewallPath: { disposition: 'incomplete', configurationPathAssessed: false },
      },
    });
    expect(replay(f.s.entries)).toEqual(f.s.world);
  },
);
it('updates one stable route atomically across all four next-hop profiles, preserves original Create and exact before/after/reset replay', () => {
  const f = topologyWorld(),
    original = f.s.world.routes.find((r) => r.id === f.route)!,
    before = structuredClone(f.s.world),
    boundary = f.s.entries.length;
  const nextId = before.nextId,
    count = before.routes.length;
  for (const hop of ['Internet', 'None', 'VnetLocal', 'VirtualAppliance']) {
    const command = routeUpdate(f, hop);
    if (command.type === 'UpdateRoute' && hop === 'VnetLocal')
      command.addressPrefix = '10.10.1.0/24';
    const r = f.s.run(command);
    expect(r).toMatchObject({
      outcome: 'accepted',
      addedIds: [],
      removedIds: [],
      updatedIds: [f.route],
      topologyChange: { id: f.route, createOrigin: original.origin, parentId: f.appTable },
    });
    expect(f.s.world.routes.find((x) => x.id === f.route)).toMatchObject({
      id: original.id,
      name: original.name,
      origin: original.origin,
      routeTableId: original.routeTableId,
      nextHopType: hop,
    });
    expect(f.s.world.nextId).toBe(nextId);
    expect(f.s.world.routes).toHaveLength(count);
    expect(replay(f.s.entries)).toEqual(f.s.world);
  }
  expect(replay(f.s.entries, boundary)).toEqual(before);
  expect(
    f.s.entries.find((e) => e.request.commandId === original.origin)!.receipt.addedIds,
  ).toContain(f.route);
  const updated = structuredClone(f.s.world),
    through = f.s.entries.length;
  f.s.run({ type: 'ResetWorkspace' });
  expect(replay(f.s.entries, through)).toEqual(updated);
  expect(replay(f.s.entries)).toEqual(f.s.world);
});
it('changes selected LPM prefix and actual Firewall path without changing the route ID', () => {
  const f = topologyWorld(),
    input = packet(f);
  expect(analysePolicy(f.s.world, input)).toMatchObject({
    ok: true,
    analysis: { firewallPath: { disposition: 'allowed-via-firewall' } },
  });
  expect(f.s.run(routeUpdate(f, 'None')).outcome).toBe('accepted');
  expect(analysePolicy(f.s.world, input)).toMatchObject({
    ok: true,
    analysis: { status: 'dropped-by-modeled-routing' },
  });
  const c = routeUpdate(f, 'None');
  if (c.type === 'UpdateRoute') c.addressPrefix = '10.99.0.0/16';
  expect(f.s.run(c).outcome).toBe('accepted');
  expect(analyseRoutes(f.s.world, f.appSubnet, '10.20.1.10')).toMatchObject({
    ok: true,
    analysis: { selected: { id: 'default:10.0.0.0/8' } },
  });
  expect(f.s.run(routeUpdate(f)).outcome).toBe('accepted');
  expect(analysePolicy(f.s.world, input)).toMatchObject({
    ok: true,
    analysis: {
      model: 'laboratory@3.7.0',
      firewallPath: {
        disposition: 'allowed-via-firewall',
        forwardRoute: { selected: { id: f.route, firewallId: f.firewall } },
      },
    },
  });
});
it('validates every subnet sharing a table and rejects an incompatible local prefix atomically', () => {
  const f = topologyWorld();
  expect(
    f.s.run({ type: 'AssociateSubnetRouteTable', subnetId: f.dataSubnet, routeTableId: f.appTable })
      .outcome,
  ).toBe('accepted');
  const before = canonical(f.s.world),
    c = routeUpdate(f, 'VnetLocal');
  if (c.type === 'UpdateRoute') c.addressPrefix = '10.10.1.0/24';
  expect(f.s.run(c)).toMatchObject({ outcome: 'unsupported', code: 'unsupported-route-profile' });
  expect(canonical(f.s.world)).toBe(before);
  expect(replay(f.s.entries)).toEqual(f.s.world);
});
it.each([
  [{ addressPrefix: '10.20.1.1/24' }, 'invalid-cidr'],
  [{ nextHopType: 'VirtualNetworkGateway' }, 'unsupported-next-hop'],
  [{ firewallId: 'deleted-firewall' }, 'invalid-parent'],
  [{ nextHopIp: '10.0.0.9' }, 'invalid-next-hop'],
  [{ routeId: 'deleted-route' }, 'invalid-parent'],
  [{ routeTableId: 'deleted-table' }, 'invalid-parent'],
] as const)('rejects invalid complete route replacement %j without mutation', (overrides, code) => {
  const f = topologyWorld(),
    before = canonical(f.s.world);
  const command = { ...routeUpdate(f), ...overrides } as Command;
  // Non-appliance shapes intentionally omit appliance-only fields.
  if (command.type === 'UpdateRoute' && command.nextHopType !== 'VirtualAppliance') {
    delete command.firewallId;
    delete command.nextHopIp;
  }
  expect(f.s.run(command).code).toBe(code);
  expect(canonical(f.s.world)).toBe(before);
  expect(replay(f.s.entries)).toEqual(f.s.world);
});
it('rejects duplicate prefix, foreign parent, no-op and appliance metadata on non-appliance routes', () => {
  const f = topologyWorld();
  const dup = f.s.create({
    type: 'CreateRoute',
    routeTableId: f.appTable,
    name: 'duplicate-test',
    addressPrefix: '10.77.0.0/16',
    nextHopType: 'None',
  });
  const before = canonical(f.s.world);
  for (const [patch, code] of [
    [{ addressPrefix: '10.77.0.0/16' }, 'duplicate-prefix'],
    [{ routeTableId: f.dataTable }, 'incompatible-association'],
    [{}, 'no-change'],
    [{ nextHopType: 'None' }, 'unsupported-field'],
  ] as const) {
    expect(f.s.run({ ...routeUpdate(f), ...patch } as Command).code).toBe(code);
    expect(canonical(f.s.world)).toBe(before);
  }
  expect(f.s.world.routes.some((r) => r.id === dup)).toBe(true);
});
it('disassociates only the exact subnet NSG, retains original evidence and changes existing policy layers without a security score', () => {
  const f = topologyWorld(),
    before = structuredClone(f.s.world),
    nsg = f.s.world.subnets.find((s) => s.id === f.appSubnet)!.nsgId!;
  // Original fixture may attach NIC NSGs instead; attach a subnet explicitly.
  expect(
    f.s.run({ type: 'AssociateSubnetNsg', subnetId: f.appSubnet, nsgId: nsg || f.appNsg }).outcome,
  ).toBe('accepted');
  const original = f.s.world.subnets.find((s) => s.id === f.appSubnet)!,
    through = f.s.entries.length;
  expect(
    f.s.run({ type: 'DisassociateSubnetNsg', subnetId: f.appSubnet, nsgId: original.nsgId! }),
  ).toMatchObject({
    outcome: 'accepted',
    topologyChange: { before: { nsgId: original.nsgId }, after: { nsgId: null } },
  });
  expect(f.s.world.nsgs).toEqual(before.nsgs);
  expect(f.s.world.securityRules).toEqual(before.securityRules);
  expect(f.s.world.nics).toEqual(before.nics);
  expect(analysePolicy(f.s.world, packet(f))).toMatchObject({
    ok: true,
    analysis: {
      layers: expect.arrayContaining([
        expect.objectContaining({ id: 'source-subnet-outbound', status: 'not-associated' }),
      ]),
    },
  });
  expect(replay(f.s.entries, through)?.subnets.find((s) => s.id === f.appSubnet)?.nsgId).toBe(
    original.nsgId,
  );
  expect(
    f.s.run({ type: 'DisassociateSubnetNsg', subnetId: f.appSubnet, nsgId: original.nsgId! }).code,
  ).toBe('not-associated');
});
it.each([true, false])(
  'changes only the owned directional access flag; Connected and forwarding remain distinct; disabled profile is conservative %s',
  (reverse) => {
    const f = topologyWorld(),
      id = reverse ? f.hubApp : f.appHub,
      p = f.s.world.peerings.find((p) => p.id === id)!,
      before = structuredClone(f.s.world),
      through = f.s.entries.length;
    const r = f.s.run({
      type: 'SetPeeringVirtualNetworkAccess',
      peeringId: id,
      vnetId: p.vnetId,
      value: 'false',
    });
    expect(r.outcome).toBe('accepted');
    expect(f.s.world.peerings.find((x) => x.id === id)).toMatchObject({
      ...p,
      allowVirtualNetworkAccess: false,
      accessOrigin: r.commandId,
    });
    expect(f.s.world.peerings.filter((x) => x.id !== id)).toEqual(
      before.peerings.filter((x) => x.id !== id),
    );
    expect(analysePolicy(f.s.world, packet(f))).toMatchObject({
      ok: true,
      analysis: {
        status: 'undetermined',
        accessEvaluation: 'undetermined',
        firewallPath: { configurationPathAssessed: false, disposition: 'incomplete' },
      },
    });
    expect(replay(f.s.entries, through)).toEqual(before);
    expect(
      f.s.run({
        type: 'SetPeeringVirtualNetworkAccess',
        peeringId: id,
        vnetId: p.vnetId,
        value: 'true',
      }).outcome,
    ).toBe('accepted');
    expect(analysePolicy(f.s.world, packet(f))).toMatchObject({
      ok: true,
      analysis: { firewallPath: { disposition: 'allowed-via-firewall' } },
    });
  },
);
it.each([0, 1, 2, 3])(
  'unknown keys/empty keys/key order never make new history unverifiable, case%s',
  (index) => {
    const f = topologyWorld(),
      p = f.s.world.peerings[0]!,
      commands: Command[] = [
        routeUpdate(f),
        { type: 'DisassociateSubnetNsg', subnetId: f.appSubnet, nsgId: f.appNsg },
        {
          type: 'SetPeeringVirtualNetworkAccess',
          peeringId: p.id,
          vnetId: p.vnetId,
          value: 'false',
        },
        {
          type: 'CreateGroup',
          subscriptionId: 'sub-shared',
          name: 'bad-group',
          metadataRegion: 'norwayeast',
        },
      ];
    for (const extras of [{ z: 'x', action: 'x' }, { action: 'x', z: 'x' }, { '': 'x' }]) {
      const before = canonical(f.s.world),
        command = { ...commands[index], ...extras } as Command,
        request = { commandId: 'probe', expectedRevision: f.s.world.revision, command };
      expect(parseRequest(request)).not.toBeNull();
      const original = JSON.stringify(request),
        r = f.s.run(command);
      expect(r.outcome).toBe('unsupported');
      expect(canonical(f.s.world)).toBe(before);
      expect(JSON.stringify(request)).toBe(original);
      expect(replay(JSON.parse(canonical(f.s.entries)))).toEqual(f.s.world);
    }
  },
);
it('rejects stale Update and tampered change receipts and keeps inherited security lifecycle on3.7', () => {
  const f = topologyWorld(),
    before = canonical(f.s.world);
  expect(f.s.run(routeUpdate(f, 'None'), f.s.world.revision - 1).code).toBe('stale-revision');
  expect(canonical(f.s.world)).toBe(before);
  f.s.run(routeUpdate(f, 'None'));
  const tampered = structuredClone(f.s.entries);
  tampered.at(-1)!.receipt.topologyChange!.before.nextHopType = 'Internet';
  expect(replay(tampered)).toBeNull();
  expect(
    f.s.run({ type: 'DeleteFirewallNetworkRule', ruleId: f.rule, collectionId: f.collection })
      .outcome,
  ).toBe('accepted');
  expect(replay(f.s.entries)).toEqual(f.s.world);
  const r = execute(
    f.s.world,
    {
      commandId: 'not-started',
      expectedRevision: f.s.world.revision,
      command: { type: 'DeletePeering', peeringId: f.hubApp } as never,
    },
    f.s.entries.length + 1,
  );
  expect(r.receipt.outcome).toBe('unsupported');
  expect(r.world).toBe(f.s.world);
});

it.each([
  ['sub-shared', 'westeurope'],
  ['sub-app', 'norwayeast'],
])(
  'rejects actual incompatible appliance scope%s/%s without a partial route update',
  (subscriptionId, region) => {
    const f = topologyWorld(),
      group = f.s.create({
        type: 'CreateGroup',
        name: 'foreign',
        subscriptionId,
        metadataRegion: region,
      }),
      table = f.s.create({
        type: 'CreateRouteTable',
        groupId: group,
        name: 'foreign-table',
        region,
      }),
      route = f.s.create({
        type: 'CreateRoute',
        routeTableId: table,
        name: 'foreign-route',
        addressPrefix: '10.20.0.0/16',
        nextHopType: 'None',
      });
    const before = canonical(f.s.world),
      c = routeUpdate(f);
    if (c.type !== 'UpdateRoute') throw Error('type');
    expect(f.s.run({ ...c, routeId: route, routeTableId: table })).toMatchObject({
      outcome: 'rejected',
      code: 'incompatible-association',
    });
    expect(canonical(f.s.world)).toBe(before);
    expect(replay(f.s.entries)).toEqual(f.s.world);
  },
);
it('actual route deletion retains old through receipt, rejects update of removed ID and never retargets a same-named replacement', () => {
  const f = topologyWorld(),
    original = f.s.world.routes.find((r) => r.id === f.route)!,
    through = f.s.entries.length;
  expect(f.s.run({ type: 'DeleteRoute', routeId: original.id }).outcome).toBe('accepted');
  const replacement = f.s.create({
    type: 'CreateRoute',
    routeTableId: original.routeTableId,
    name: original.name,
    addressPrefix: original.addressPrefix,
    nextHopType: 'None',
  });
  expect(replacement).not.toBe(original.id);
  const before = canonical(f.s.world);
  expect(f.s.run(routeUpdate(f)).code).toBe('invalid-parent');
  expect(canonical(f.s.world)).toBe(before);
  expect(replay(f.s.entries, through)?.routes.find((r) => r.id === original.id)).toEqual(original);
  expect(replay(f.s.entries)).toEqual(f.s.world);
});
it('actual resource projection keeps disabled peering identity/configuration and original origins without mutating World', () => {
  const f = topologyWorld(),
    p = f.s.world.peerings[0]!;
  f.s.run({
    type: 'SetPeeringVirtualNetworkAccess',
    peeringId: p.id,
    vnetId: p.vnetId,
    value: 'false',
  });
  const before = canonical(f.s.world),
    actual = f.s.world.peerings.find((x) => x.id === p.id)!;
  expect(resources(f.s.world).find((x) => x.id === p.id)).toBe(actual);
  expect(actual.allowVirtualNetworkAccess).toBe(false);
  expect(actual.origin).toBe(p.origin);
  expect(canonical(f.s.world)).toBe(before);
});
it('rejects wrong peering owner, invalid boolean, missing association and foreign NSG without changing any resource', () => {
  const f = topologyWorld(),
    p = f.s.world.peerings[0]!,
    before = canonical(f.s.world);
  for (const [command, code] of [
    [
      {
        type: 'SetPeeringVirtualNetworkAccess',
        peeringId: p.id,
        vnetId: p.remoteVnetId,
        value: 'false',
      },
      'incompatible-association',
    ],
    [
      { type: 'SetPeeringVirtualNetworkAccess', peeringId: p.id, vnetId: p.vnetId, value: 'yes' },
      'unsupported-profile',
    ],
    [
      {
        type: 'SetPeeringVirtualNetworkAccess',
        peeringId: 'missing',
        vnetId: p.vnetId,
        value: 'false',
      },
      'invalid-parent',
    ],
    [
      { type: 'DisassociateSubnetNsg', subnetId: f.appSubnet, nsgId: f.dataNsg },
      'incompatible-association',
    ],
  ] as const) {
    expect(f.s.run(command as Command).code).toBe(code);
    expect(canonical(f.s.world)).toBe(before);
  }
  expect(replay(f.s.entries)).toEqual(f.s.world);
});
