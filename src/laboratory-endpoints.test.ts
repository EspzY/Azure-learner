import { describe, it, expect } from 'vitest';
import { execute, freshWorld, replay, canonical, resources } from './laboratory/v33/domain';
import { laboratoryModel, type Command, type Entry } from './laboratory/v33/contract';
import {
  analysePolicy,
  addressMatch,
  evaluateLayer,
  type Layer,
  type Packet,
} from './laboratory/v33/policy';
import { analyseRoutes } from './laboratory/v33/route';
import * as frozen from './laboratory/v32/domain';
import { routingProjection } from './laboratory/v33/projection';
import * as engine from './laboratory/engine';
function scenario() {
  let world = freshWorld();
  const entries: Entry[] = [];
  return {
    get world() {
      return world;
    },
    entries,
    run(command: Command, expectedRevision = world.revision) {
      const request = { commandId: 'endpoint-' + (entries.length + 1), expectedRevision, command };
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
  const accepted = (c: Command) => {
    const r = s.run(c);
    expect(r.outcome, canonical(r)).toBe('accepted');
    return r.addedIds[0]!;
  };
  const group = accepted({
    type: 'CreateGroup',
    name: 'rg-network',
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
  });
  const vnet = accepted({
    type: 'CreateVirtualNetwork',
    name: 'vnet-app',
    groupId: group,
    region: 'norwayeast',
    addressSpace: '10.10.0.0/16',
  });
  const web = accepted({
      type: 'CreateSubnet',
      name: 'snet-web',
      vnetId: vnet,
      addressPrefix: '10.10.1.0/24',
    }),
    data = accepted({
      type: 'CreateSubnet',
      name: 'snet-data',
      vnetId: vnet,
      addressPrefix: '10.10.2.0/24',
    });
  const nic = (
    name: string,
    subnetId = web,
    privateIpAddress = '10.10.1.10',
    groupId = group,
    vnetId = vnet,
  ): Command => ({
    type: 'CreateNetworkInterface',
    name,
    subnetId,
    privateIpAddress,
    groupId,
    vnetId,
    region: 'norwayeast',
    allocation: 'Static',
  });
  const source = accepted(nic('nic-web')),
    destination = accepted(nic('nic-data', data, '10.10.2.10'));
  const nsg = (name: string) =>
    accepted({ type: 'CreateNetworkSecurityGroup', name, groupId: group, region: 'norwayeast' });
  const rule = (
    nsgId: string,
    name: string,
    priority: string,
    access: 'Allow' | 'Deny',
    overrides: Partial<Extract<Command, { type: 'CreateSecurityRule' }>> = {},
  ) =>
    accepted({
      type: 'CreateSecurityRule',
      nsgId,
      name,
      priority,
      access,
      direction: 'Inbound',
      protocol: 'Tcp',
      source: '10.10.1.10',
      sourcePort: '*',
      destination: '10.10.2.10',
      destinationPort: '1433',
      ...overrides,
    });
  const analyse = (
    sourceNicId = source,
    destinationNicId = destination,
    protocol = 'Tcp',
    sourcePort = '50000',
    destinationPort = '1433',
  ) => {
    const r = analysePolicy(s.world, {
      sourceNicId,
      destinationNicId,
      protocol,
      sourcePort,
      destinationPort,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) throw Error(r.code);
    return r.analysis;
  };
  return {
    ...s,
    get world() {
      return s.world;
    },
    accepted,
    group,
    vnet,
    web,
    data,
    source,
    destination,
    nic,
    nsg,
    rule,
    analyse,
  };
}
describe('static NIC identity, ancestry and address allocation', () => {
  it('creates independent NICs with only supported fields and deterministic original receipts', () => {
    const s = ready();
    expect(s.world.nics).toHaveLength(2);
    expect(s.world.nics[0]).toMatchObject({
      id: s.source,
      subnetId: s.web,
      privateIpAddress: '10.10.1.10',
      allocation: 'Static',
      ipVersion: 'IPv4',
      primary: true,
      nsgId: null,
      associationOrigin: null,
    });
    expect(s.world.nics[0]).not.toHaveProperty('macAddress');
    expect(s.world.nics[0]).not.toHaveProperty('vmId');
    expect(replay(s.entries)).toEqual(s.world);
    expect(engine.replay(s.entries, laboratoryModel)).toEqual(s.world);
  });
  it.each(['10.10.1.0', '10.10.1.1', '10.10.1.2', '10.10.1.3', '10.10.1.255'])(
    'rejects Azure-reserved private address %s without mutation',
    (ip) => {
      const s = ready(),
        before = canonical(s.world);
      expect(s.run(s.nic('reserved', s.web, ip)).code).toBe('reserved-private-ip');
      expect(canonical(s.world)).toBe(before);
    },
  );
  it.each(['010.10.1.4', '10.10.1', '256.10.1.4', '10.10.1.4/24', '10.10.1.4 ', '::1'])(
    'rejects noncanonical IPv4 %s',
    (ip) => {
      const s = ready();
      expect(s.run(s.nic('bad', s.web, ip)).code).toBe('invalid-private-ip');
    },
  );
  it('checks outside/collision/name/profile/unknown fields and stale revision atomically', () => {
    const s = ready();
    const oldRequest = {
      commandId: 'old-stale',
      expectedRevision: 0,
      command: {
        type: 'CreateGroup' as const,
        name: 'stale-group',
        subscriptionId: 'sub-shared',
        metadataRegion: 'norwayeast',
      },
    };
    const oldReceipt = frozen.execute(routingProjection(s.world), oldRequest, 99).receipt;
    expect(execute(s.world, oldRequest, 99)).toEqual({
      world: s.world,
      receipt: {
        ...oldReceipt,
        ruleId: oldReceipt.ruleId.replace('@3.2', '@3.3'),
        beforeCount: resources(s.world).length,
        afterCount: resources(s.world).length,
      },
    });
    expect(
      execute(s.world, { ...oldRequest, command: { type: 'ResetWorkspace' } }, 99).receipt
        .targetType,
    ).toBe('local/workspace');
    const cases: [Command, string][] = [
      [s.nic('outside', s.web, '10.10.2.10'), 'outside-subnet'],
      [s.nic('collision'), 'duplicate-private-ip'],
      [s.nic('NIC-WEB', s.web, '10.10.1.11'), 'duplicate-name'],
      [s.nic('a'.repeat(81), s.web, '10.10.1.11'), 'invalid-name'],
      [{ ...s.nic('dynamic'), allocation: 'Dynamic' } as Command, 'unsupported-profile'],
      [{ ...s.nic('bad'), macAddress: 'invented' } as unknown as Command, 'unsupported-field'],
      [{ ...s.nic('bad'), subnetId: s.vnet } as Command, 'invalid-parent'],
      [{ ...s.nic('bad'), vnetId: s.group } as Command, 'invalid-parent'],
    ];
    for (const [c, code] of cases) {
      const before = canonical(s.world);
      expect(s.run(c).code).toBe(code);
      expect(canonical(s.world)).toBe(before);
    }
    expect(s.run(s.nic('stale'), 0).code).toBe('stale-revision');
    expect(replay(s.entries)).toEqual(s.world);
  });
  it('handles /29 boundaries, case-insensitive RG name scope, cross-RG compatibility and cross-sub/region denial', () => {
    const s = ready(),
      small = s.accepted({
        type: 'CreateSubnet',
        name: 'small',
        vnetId: s.vnet,
        addressPrefix: '10.10.3.0/29',
      });
    for (const last of [4, 5, 6]) s.accepted(s.nic('small-' + last, small, '10.10.3.' + last));
    expect(s.run(s.nic('last', small, '10.10.3.7')).code).toBe('reserved-private-ip');
    const other = s.accepted({
      type: 'CreateGroup',
      name: 'rg-other',
      metadataRegion: 'westeurope',
      subscriptionId: 'sub-shared',
    });
    s.accepted(s.nic('nic-web', s.web, '10.10.1.11', other));
    const foreign = s.accepted({
      type: 'CreateGroup',
      name: 'rg-sub',
      metadataRegion: 'norwayeast',
      subscriptionId: 'sub-app',
    });
    expect(s.run(s.nic('wrong-sub', s.web, '10.10.1.12', foreign)).code).toBe(
      'incompatible-association',
    );
    expect(
      s.run({ ...s.nic('wrong-region', s.web, '10.10.1.12'), region: 'westeurope' } as Command)
        .code,
    ).toBe('incompatible-association');
    expect(s.run({ ...s.nic('unknown-region'), region: 'moon' } as Command).code).toBe(
      'invalid-region',
    );
  });
  it('keeps identical private addresses scoped to their actual subnet and rejects a fabricated route to the other overlapping VNet', () => {
    const s = ready(),
      vnet = s.accepted({
        type: 'CreateVirtualNetwork',
        name: 'vnet-other',
        groupId: s.group,
        region: 'norwayeast',
        addressSpace: '10.10.0.0/16',
      }),
      subnet = s.accepted({
        type: 'CreateSubnet',
        name: 'snet-other',
        vnetId: vnet,
        addressPrefix: '10.10.2.0/24',
      }),
      other = s.accepted(s.nic('nic-other', subnet, '10.10.2.10', s.group, vnet));
    const result = s.analyse(s.source, other);
    expect(result.route?.selected.nextHop).toBe('VnetLocal');
    expect(result.status).toBe('undetermined');
    expect(result.reason).toBe('unsupported-path');
    expect(result.layers.every((l) => l.status === 'not-evaluated')).toBe(true);
  });
});
describe('one original NSG program across subnet and NIC layers', () => {
  it('explains TCP1433 allow, TCP3389 deny, exact source IP and protocol/port priority differences', () => {
    const s = ready(),
      webNsg = s.nsg('nsg-web'),
      dataNsg = s.nsg('nsg-data');
    s.accepted({ type: 'AssociateSubnetNsg', subnetId: s.web, nsgId: webNsg });
    s.accepted({ type: 'AssociateSubnetNsg', subnetId: s.data, nsgId: dataNsg });
    const allow = s.rule(dataNsg, 'allow-sql', '100', 'Allow'),
      deny = s.rule(dataNsg, 'deny-rest', '200', 'Deny', {
        source: '10.10.1.0/24',
        destinationPort: '*',
        protocol: '*',
      });
    const result = s.analyse();
    expect(result.status).toBe('allowed-by-modeled-network-policy');
    expect(result.layers.map((l) => l.id)).toEqual([
      'source-nic-outbound',
      'source-subnet-outbound',
      'destination-subnet-inbound',
      'destination-nic-inbound',
    ]);
    expect(result.layers.map((l) => l.status)).toEqual([
      'not-associated',
      'allow',
      'allow',
      'not-associated',
    ]);
    expect(result.layers[2]?.matchedRuleId).toBe(allow);
    expect(result.layers[2]?.rules.find((r) => r.id === deny)?.result).toBe('not-evaluated');
    const blocked = s.analyse(s.source, s.destination, 'Tcp', '50000', '3389');
    expect(blocked.status).toBe('denied-by-modeled-network-policy');
    expect(blocked.layers[2]?.matchedRuleId).toBe(deny);
    expect(blocked.layers[3]?.status).toBe('not-evaluated');
    const alternate = s.accepted(s.nic('nic-alt', s.web, '10.10.1.11'));
    expect(s.analyse(alternate).layers[2]?.matchedRuleId).toBe(deny);
    expect(s.analyse(s.source, s.destination, 'Udp').layers[2]?.matchedRuleId).toBe(deny);
    expect(result.traffic).toBe('not-sent');
    expect(result.connectivity).toBe('not-verified');
  });
  it('applies destination subnet before destination NIC, and NIC Allow cannot override a prior subnet Deny', () => {
    const s = ready(),
      subnetNsg = s.nsg('subnet'),
      nicNsg = s.nsg('nic');
    s.rule(subnetNsg, 'deny-sql', '100', 'Deny');
    s.rule(nicNsg, 'allow-sql', '100', 'Allow');
    s.accepted({ type: 'AssociateSubnetNsg', subnetId: s.data, nsgId: subnetNsg });
    s.accepted({ type: 'AssociateNicNsg', nicId: s.destination, nsgId: nicNsg });
    const result = s.analyse();
    expect(result.layers[2]?.status).toBe('deny');
    expect(result.layers[3]?.status).toBe('not-evaluated');
    expect(result.layers[3]?.rules).toEqual([]);
  });
  it('adds NIC inbound restriction after a subnet Allow and explicitly disassociates without changing the earlier result', () => {
    const s = ready(),
      subnetNsg = s.nsg('data'),
      nicNsg = s.nsg('nic');
    s.rule(subnetNsg, 'allow-sql', '100', 'Allow');
    const deny = s.rule(nicNsg, 'deny-sql', '100', 'Deny');
    s.accepted({ type: 'AssociateSubnetNsg', subnetId: s.data, nsgId: subnetNsg });
    const before = structuredClone(s.world),
      through = s.entries.length;
    expect(s.analyse().status).toBe('allowed-by-modeled-network-policy');
    const association = s.run({ type: 'AssociateNicNsg', nicId: s.destination, nsgId: nicNsg });
    expect(association.code).toBe('updated');
    expect(s.analyse().layers[3]?.matchedRuleId).toBe(deny);
    expect(s.analyse().layers[2]?.status).toBe('allow');
    expect(s.world.nics.find((n) => n.id === s.destination)?.associationOrigin).toBe(
      association.commandId,
    );
    s.accepted({ type: 'DisassociateNicNsg', nicId: s.destination });
    expect(s.analyse().status).toBe('allowed-by-modeled-network-policy');
    expect(replay(s.entries, through)).toEqual(before);
    expect(s.run({ type: 'DisassociateNicNsg', nicId: s.destination }).code).toBe('not-associated');
    expect(replay(s.entries)).toEqual(s.world);
  });
  it('applies source NIC outbound before source subnet outbound, matching both ports and exact direction', () => {
    const s = ready(),
      nicNsg = s.nsg('source-nic'),
      subnetNsg = s.nsg('source-subnet');
    const allow = s.rule(nicNsg, 'out-allow', '100', 'Allow', {
      direction: 'Outbound',
      sourcePort: '50000',
    });
    const deny = s.rule(subnetNsg, 'out-deny', '100', 'Deny', { direction: 'Outbound' });
    s.rule(nicNsg, 'in-deny', '100', 'Deny', { direction: 'Inbound' });
    s.accepted({ type: 'AssociateNicNsg', nicId: s.source, nsgId: nicNsg });
    s.accepted({ type: 'AssociateSubnetNsg', subnetId: s.web, nsgId: subnetNsg });
    const result = s.analyse();
    expect(result.layers[0]?.matchedRuleId).toBe(allow);
    expect(result.layers[1]?.matchedRuleId).toBe(deny);
    expect(result.layers[2]?.status).toBe('not-evaluated');
    expect(result.layers[0]?.rules.some((r) => r.name === 'in-deny')).toBe(false);
    const otherPort = s.analyse(s.source, s.destination, 'Tcp', '50001');
    expect(
      otherPort.layers[0]?.rules
        .find((r) => r.id === allow)
        ?.checks.find((c) => c.field === 'sourcePort')?.result,
    ).toBe('no-match');
    expect(otherPort.layers[0]?.matchedRuleId).toContain('AllowVnetOutBound');
  });
  it('validates NIC NSG region, subscription, parent type and atomic explicit replacement', () => {
    const s = ready(),
      good = s.nsg('good'),
      another = s.nsg('another'),
      foreign = s.accepted({
        type: 'CreateNetworkSecurityGroup',
        groupId: s.group,
        name: 'foreign-region',
        region: 'westeurope',
      });
    s.accepted({ type: 'AssociateNicNsg', nicId: s.source, nsgId: good });
    const before = canonical(s.world);
    expect(s.run({ type: 'AssociateNicNsg', nicId: s.source, nsgId: foreign }).code).toBe(
      'incompatible-association',
    );
    expect(canonical(s.world)).toBe(before);
    expect(s.run({ type: 'AssociateNicNsg', nicId: s.web, nsgId: good }).code).toBe(
      'invalid-parent',
    );
    s.accepted({ type: 'AssociateNicNsg', nicId: s.source, nsgId: another });
    expect(s.world.nics.find((n) => n.id === s.source)?.nsgId).toBe(another);
  });
});
describe('conservative default service-tag knowledge, not a private-IP or public-IP heuristic', () => {
  it('proves local/direct-peer inclusion only and returns explicit unknown for all unsupported tag knowledge', () => {
    const s = ready();
    expect(addressMatch(s.world, s.vnet, 'VirtualNetwork', '10.10.2.10').result).toBe('match');
    for (const ip of ['10.99.1.10', '192.168.1.1', '8.8.8.8'])
      expect(addressMatch(s.world, s.vnet, 'VirtualNetwork', ip)).toEqual({
        result: 'unknown',
        reason: 'virtual-network-tag-incomplete',
      });
    for (const ip of ['8.8.8.8', '10.10.2.10'])
      expect(addressMatch(s.world, s.vnet, 'Internet', ip)).toEqual({
        result: 'unknown',
        reason: 'internet-tag-unsupported',
      });
    expect(addressMatch(s.world, s.vnet, 'AzureLoadBalancer', '168.63.129.16')).toEqual({
      result: 'unknown',
      reason: 'platform-probe-unsupported',
    });
    expect(addressMatch(s.world, s.vnet, 'AzureCloud', '8.8.8.8').result).toBe('unknown');
  });
  it('does not turn an uncertain earlier default Allow into a fabricated final Deny', () => {
    const s = ready(),
      nsg = s.nsg('unknown');
    const layer: Layer = {
      id: 'destination-subnet-inbound',
      resourceId: s.data,
      vnetId: s.vnet,
      direction: 'Inbound',
      nsgId: nsg,
      associationOrigin: null,
      status: 'not-evaluated',
      reason: 'routing',
      matchedRuleId: null,
      uncertainRuleId: null,
      rules: [],
    };
    const packet: Packet = {
      sourceIp: '10.99.1.10',
      destinationIp: '10.10.2.10',
      protocol: 'Tcp',
      sourcePort: 50000,
      destinationPort: 1433,
    };
    const result = evaluateLayer(s.world, layer, packet);
    expect(result.status).toBe('undetermined');
    expect(result.uncertainRuleId).toContain('AllowVnetInBound');
    expect(result.matchedRuleId).toBeNull();
    expect(result.rules.find((r) => r.name === 'DenyAllInBound')?.result).toBe('not-evaluated');
    s.rule(nsg, 'definite-deny', '100', 'Deny', {
      source: '*',
      destination: '*',
      destinationPort: '*',
    });
    expect(evaluateLayer(s.world, layer, packet).status).toBe('deny');
  });
});
describe('routing and policy are separate, with actual endpoint topology', () => {
  it('returns known routing drop for None and unknown for Internet even if all NSG conditions could Allow', () => {
    const s = ready(),
      table = s.accepted({
        type: 'CreateRouteTable',
        groupId: s.group,
        region: 'norwayeast',
        name: 'rt-web',
      });
    s.accepted({ type: 'AssociateSubnetRouteTable', subnetId: s.web, routeTableId: table });
    s.accepted({
      type: 'CreateRoute',
      routeTableId: table,
      name: 'drop-data',
      addressPrefix: '10.10.2.0/24',
      nextHopType: 'None',
    });
    let result = s.analyse();
    expect(result.status).toBe('dropped-by-modeled-routing');
    expect(result.layers.every((l) => l.status === 'not-evaluated')).toBe(true);
    const other = s.accepted({
      type: 'CreateRouteTable',
      groupId: s.group,
      region: 'norwayeast',
      name: 'rt-internet',
    });
    s.accepted({
      type: 'CreateRoute',
      routeTableId: other,
      name: 'internet-data',
      addressPrefix: '10.10.2.0/24',
      nextHopType: 'Internet',
    });
    s.accepted({ type: 'AssociateSubnetRouteTable', subnetId: s.web, routeTableId: other });
    result = s.analyse();
    expect(result.status).toBe('undetermined');
    expect(result.reason).toBe('unsupported-path');
    expect(result.route?.selected.nextHop).toBe('Internet');
  });
  it('requires direct reciprocal peering and never derives transitive spoke policy access', () => {
    const s = ready(),
      hub = s.accepted({
        type: 'CreateVirtualNetwork',
        groupId: s.group,
        name: 'vnet-hub',
        region: 'norwayeast',
        addressSpace: '10.0.0.0/16',
      }),
      remote = s.accepted({
        type: 'CreateVirtualNetwork',
        groupId: s.group,
        name: 'vnet-remote',
        region: 'westeurope',
        addressSpace: '10.20.0.0/16',
      }),
      subnet = s.accepted({
        type: 'CreateSubnet',
        vnetId: remote,
        name: 'snet-remote',
        addressPrefix: '10.20.1.0/24',
      }),
      nic = s.accepted({
        ...s.nic('nic-remote', subnet, '10.20.1.10', s.group, remote),
        region: 'westeurope',
      } as Command);
    for (const [a, b] of [
      [s.vnet, hub],
      [hub, s.vnet],
      [hub, remote],
      [remote, hub],
    ])
      s.accepted({ type: 'CreateVnetPeering', vnetId: a!, remoteVnetId: b!, name: 'peer-' + b });
    expect(s.analyse(s.source, nic).status).toBe('dropped-by-modeled-routing');
    s.accepted({ type: 'CreateVnetPeering', vnetId: s.vnet, remoteVnetId: remote, name: 'direct' });
    expect(s.analyse(s.source, nic).status).toBe('dropped-by-modeled-routing');
    s.accepted({ type: 'CreateVnetPeering', vnetId: remote, remoteVnetId: s.vnet, name: 'direct' });
    const nsg = s.nsg('shared-policy');
    s.accepted({ type: 'AssociateNicNsg', nicId: s.source, nsgId: nsg });
    expect(s.analyse(s.source, nic).status).toBe('allowed-by-modeled-network-policy');
    expect(addressMatch(s.world, s.vnet, 'VirtualNetwork', '10.20.1.10').result).toBe('match');
  });
  it('rejects invalid inputs and self-endpoint semantics without claiming any connection, and never mutates evidence', () => {
    const s = ready(),
      input = {
        sourceNicId: s.source,
        destinationNicId: s.destination,
        protocol: 'Tcp',
        sourcePort: '50000',
        destinationPort: '1433',
      },
      before = canonical(s.world),
      events = canonical(s.entries);
    for (const [changes, code] of [
      [{ sourceNicId: s.web }, 'invalid-source-nic'],
      [{ destinationNicId: 'absent' }, 'invalid-destination-nic'],
      [{ protocol: 'Icmp' }, 'unsupported-protocol'],
      [{ sourcePort: '65536' }, 'invalid-port'],
      [{ destinationPort: '01433' }, 'invalid-port'],
    ] as const)
      expect(analysePolicy(s.world, { ...input, ...changes })).toEqual({ ok: false, code });
    expect(s.analyse(s.source, s.source).reason).toBe('self-endpoint-unsupported');
    expect(analyseRoutes(s.world, s.web, '10.10.2.10').ok).toBe(true);
    s.analyse();
    expect(canonical(s.world)).toBe(before);
    expect(canonical(s.entries)).toBe(events);
  });
});
describe('same World budgets, reset and version-bound original replay', () => {
  it('enforces NIC and whole-World capacity using actual valid commands, retaining all receipts and through snapshots', () => {
    const s = ready();
    for (let i = 2; i < 16; i++) s.accepted(s.nic('nic-' + i, s.web, '10.10.1.' + (10 + i)));
    expect(s.run(s.nic('nic-limit', s.web, '10.10.1.100')).code).toBe('capacity');
    const nsgs = Array.from({ length: 8 }, (_, i) => s.nsg('nsg-' + i));
    for (let i = 0; i < 32; i++)
      s.rule(nsgs[Math.floor(i / 16)]!, 'rule-' + i, String(100 + i), 'Allow');
    const tables = Array.from({ length: 8 }, (_, i) =>
      s.accepted({
        type: 'CreateRouteTable',
        groupId: s.group,
        name: 'rt-' + i,
        region: 'norwayeast',
      }),
    );
    for (let i = 0; resources(s.world).length < 96; i++)
      s.accepted({
        type: 'CreateRoute',
        routeTableId: tables[Math.floor(i / 16)]!,
        name: 'route-' + i,
        addressPrefix: `203.0.113.${i}/32`,
        nextHopType: 'None',
      });
    const before = canonical(s.world);
    expect(
      s.run({
        type: 'CreateStorageAccount',
        groupId: s.group,
        name: 'overcapacity',
        region: 'norwayeast',
        kind: 'StorageV2',
        sku: 'Standard_LRS',
      }).code,
    ).toBe('capacity');
    expect(canonical(s.world)).toBe(before);
    const original = structuredClone(s.world),
      through = s.entries.length;
    const reset = s.run({ type: 'ResetWorkspace' });
    expect(reset.removedIds).toEqual(resources(original).map((x) => x.id));
    expect(resources(s.world)).toEqual([]);
    expect(s.world.attempt).toBe(2);
    expect(s.world.nextId).toBe(original.nextId);
    expect(replay(s.entries, through)).toEqual(original);
    expect(replay(s.entries)).toEqual(s.world);
  });
  it('does not reinterpret an originally unsupported NIC under frozen3.2', () => {
    const request = {
      commandId: 'historical-nic',
      expectedRevision: 0,
      command: { type: 'CreateNetworkInterface', name: 'old' },
    } as never;
    const result = frozen.execute(frozen.freshWorld(), request, 1);
    expect(result.receipt.code).toBe('unsupported-capability');
    const entries = [
      { model: 'laboratory@3.2.0', attempt: 1, request, receipt: result.receipt },
    ] as engine.Entry[];
    expect(engine.replay(entries, 'laboratory@3.2.0')).toEqual(frozen.freshWorld());
    expect(engine.replay(entries, laboratoryModel)).toBeNull();
  });
});
