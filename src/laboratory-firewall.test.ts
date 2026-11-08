import { describe, it, expect } from 'vitest';
import { firewallWorld } from '../tests/fixtures/firewall-world';
import { analysePolicy, analyseRoutes, evaluateFirewallPolicy } from './laboratory/v35/analysis';
import { canonical, replay, parseRequest, resources } from './laboratory/v35/domain';
import type { Command } from './laboratory/v35/contract';
describe('Firewall3.5 authoritative configuration and composed analysis', () => {
  it('A: creates Firewall/PIP atomically and assesses exact two-spoke selected forward/return path without reverse initiation rules', () => {
    const { s, input, firewall, appHub, dataHub, hubApp } = firewallWorld(),
      before = canonical(s.world),
      a = analysePolicy(s.world, input);
    expect(a.ok).toBe(true);
    if (!a.ok) return;
    expect(a.analysis.status).toBe('allowed-by-modeled-network-policy');
    expect(a.analysis.firewallPath).toMatchObject({
      disposition: 'allowed-via-firewall',
      configurationPathAssessed: true,
      firewallId: firewall,
      decision: { status: 'allow' },
      receivingPeerings: [
        { id: dataHub, direction: 'forward', allowForwardedTraffic: true },
        { id: appHub, direction: 'return', allowForwardedTraffic: true },
      ],
    });
    expect(s.world.peerings.find((p) => p.id === hubApp)?.allowForwardedTraffic).toBe(false);
    expect(s.world.firewalls[0]?.privateIpAddress).toBe('10.0.0.4');
    expect(s.world.publicIps[0]).toMatchObject({
      address: null,
      sku: 'Standard',
      allocation: 'Static',
    });
    const receipt = s.entries.find(
      (e) => e.request.command.type === 'CreateAzureFirewall',
    )!.receipt;
    expect(receipt.addedIds).toEqual([firewall, s.world.publicIps[0]!.id]);
    expect(receipt.afterRevision - receipt.beforeRevision).toBe(1);
    expect(canonical(s.world)).toBe(before);
    expect(replay(s.entries)).toEqual(s.world);
  });
  it('B/G: explicit collection Deny and unmatched default deny remain different terminating decisions', () => {
    const { s, input, collectionGroup } = firewallWorld();
    const deny = s.create({
      type: 'CreateFirewallNetworkCollection',
      collectionGroupId: collectionGroup,
      name: 'deny-rdp',
      priority: '100',
      action: 'Deny',
    });
    s.create({
      type: 'CreateFirewallNetworkRule',
      collectionId: deny,
      name: 'rdp',
      source: '*',
      destination: '*',
      protocol: 'Tcp',
      destinationPort: '3389',
    });
    for (const [destinationPort, reason] of [
      ['3389', 'firewall-denied'],
      ['9999', 'firewall-default-deny'],
    ]) {
      const a = analysePolicy(s.world, { ...input, destinationPort: destinationPort! });
      expect(a.ok && a.analysis.reason).toBe(reason);
      expect(a.ok && a.analysis.firewallPath.disposition).toBe('denied-by-firewall');
    }
  });
  it('C: removing source UDR exposes actual default routing drop rather than invented spoke transit', () => {
    const { s, input, appRoute } = firewallWorld();
    s.run({ type: 'DeleteRoute', routeId: appRoute });
    const a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.reason).toBe('source-route-none');
    expect(a.ok && a.analysis.status).toBe('dropped-by-modeled-routing');
  });
  it('D: only the receiving spoke forwarding flags satisfy the two directions', () => {
    const { s, input, dataHub, hubData } = firewallWorld();
    s.run({ type: 'SetPeeringForwardedTraffic', peeringId: dataHub, value: 'false' });
    s.run({ type: 'SetPeeringForwardedTraffic', peeringId: hubData, value: 'true' });
    const a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.reason).toBe('destination-forwarding-disabled');
    expect(a.ok && a.analysis.status).toBe('undetermined');
  });
  it('E: missing return route never becomes a positive configuration-path result', () => {
    const { s, input, dataRoute } = firewallWorld();
    s.run({ type: 'DeleteRoute', routeId: dataRoute });
    const a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.reason).toBe('return-route-not-same-firewall');
    expect(a.ok && a.analysis.firewallPath.configurationPathAssessed).toBe(false);
  });
  it('F: original NSG first-match deny remains decisive after Firewall Allow', () => {
    const { s, input, dataNsg } = firewallWorld();
    const id = s.create({
      type: 'CreateSecurityRule',
      nsgId: dataNsg,
      name: 'deny-sql',
      direction: 'Inbound',
      priority: '100',
      protocol: 'Tcp',
      source: '*',
      sourcePort: '*',
      destination: '*',
      destinationPort: '1433',
      access: 'Deny',
    });
    const a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.firewallPath.decision?.status).toBe('allow');
    expect(a.ok && a.analysis.firewallPath.disposition).toBe('denied-by-nsg');
    expect(a.ok && a.analysis.layers[2]?.matchedRuleId).toBe(id);
  });
  it('selected local/direct peering routes are reported as bypass, not inspected firewall success', () => {
    const { s, input, app, data, appRoute, dataRoute } = firewallWorld();
    s.run({ type: 'DeleteRoute', routeId: appRoute });
    s.run({ type: 'DeleteRoute', routeId: dataRoute });
    s.create({ type: 'CreateVnetPeering', vnetId: app, remoteVnetId: data, name: 'app-data' });
    s.create({ type: 'CreateVnetPeering', vnetId: data, remoteVnetId: app, name: 'data-app' });
    const a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.firewallPath.disposition).toBe('bypasses-firewall');
    expect(a.ok && a.analysis.firewallPath.configurationPathAssessed).toBe(false);
  });
  it('reuses LPM: a more-specific None shadows the appliance route and preserves all candidate provenance', () => {
    const { s, input, appTable, appSubnet } = firewallWorld();
    s.create({
      type: 'CreateRoute',
      routeTableId: appTable,
      name: 'drop-host',
      addressPrefix: '10.20.1.10/32',
      nextHopType: 'None',
    });
    const r = analyseRoutes(s.world, appSubnet, '10.20.1.10');
    expect(r.ok && r.analysis.selected.nextHop).toBe('None');
    expect(
      r.ok &&
        r.analysis.candidates.some(
          (c) => c.nextHop === 'VirtualAppliance' && c.reason === 'shorter-prefix',
        ),
    ).toBe(true);
    expect(analysePolicy(s.world, input).ok).toBe(true);
  });
  it('group priority wins before collection priority; a higher group terminates and rules have no invented priorities/actions', () => {
    const { s, input, policy } = firewallWorld();
    const g = s.create({
        type: 'CreateFirewallRuleCollectionGroup',
        policyId: policy,
        name: 'first-group',
        priority: '100',
      }),
      c = s.create({
        type: 'CreateFirewallNetworkCollection',
        collectionGroupId: g,
        name: 'last-in-group',
        priority: '65000',
        action: 'Deny',
      }),
      rule = s.create({
        type: 'CreateFirewallNetworkRule',
        collectionId: c,
        name: 'deny-all',
        source: '*',
        destination: '*',
        protocol: 'Tcp',
        destinationPort: '*',
      });
    const a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.firewallPath.decision?.matchedRuleId).toBe(rule);
    expect(s.world.firewallRules[0]).not.toHaveProperty('priority');
    expect(s.world.firewallRules[0]).not.toHaveProperty('action');
  });
  it('rejects unknown per-rule action/priority instead of weakening hierarchy', () => {
    const { s, collection } = firewallWorld();
    const before = canonical(s.world);
    const c = {
      type: 'CreateFirewallNetworkRule',
      collectionId: collection,
      name: 'bad',
      source: '*',
      destination: '*',
      protocol: 'Tcp',
      destinationPort: '1433',
      action: 'Allow',
    } as unknown as Command;
    expect(s.run(c).code).toBe('unsupported-field');
    expect(canonical(s.world)).toBe(before);
  });
  it('validates literal addresses, canonical CIDR, supported protocol/ports, bounds and duplicate collection priorities atomically', () => {
    const { s, collection, collectionGroup } = firewallWorld();
    for (const bad of [
      { source: 'Internet' },
      { destination: '10.20.1.1/24' },
      { protocol: 'Icmp' },
      { destinationPort: '0' },
      { destinationPort: '1-65535' },
    ]) {
      const before = canonical(s.world);
      expect(
        s.run({
          type: 'CreateFirewallNetworkRule',
          collectionId: collection,
          name: 'invalid',
          source: '*',
          destination: '*',
          protocol: 'Tcp',
          destinationPort: '1433',
          ...bad,
        }).code,
      ).toBe('invalid-firewall-rule');
      expect(canonical(s.world)).toBe(before);
    }
    expect(
      s.run({
        type: 'CreateFirewallNetworkCollection',
        collectionGroupId: collectionGroup,
        name: 'duplicate-priority',
        priority: '200',
        action: 'Deny',
      }).code,
    ).toBe('priority-conflict');
  });
  it('rejects arbitrary next-hop IP, unsupported scope and dedicated endpoint/NSG use', () => {
    const { s, appTable, firewall, hub, hubSubnet, group, appNsg } = firewallWorld();
    expect(
      s.run({
        type: 'CreateFirewallRoute',
        routeTableId: appTable,
        name: 'wrong-ip',
        addressPrefix: '10.21.0.0/16',
        firewallId: firewall,
        nextHopIp: '10.0.0.5',
      }).code,
    ).toBe('invalid-next-hop');
    expect(s.run({ type: 'AssociateSubnetNsg', subnetId: hubSubnet, nsgId: appNsg }).code).toBe(
      'dedicated-subnet',
    );
    expect(
      s.run({
        type: 'CreateNetworkInterface',
        groupId: group,
        name: 'bad-nic',
        region: 'norwayeast',
        vnetId: hub,
        subnetId: hubSubnet,
        privateIpAddress: '10.0.0.5',
        allocation: 'Static',
      }).code,
    ).toBe('dedicated-subnet');
  });
  it('reset preserves through replay/original receipts and rejects tampered archives; stale and invalid requests cannot change World', () => {
    const { s, input } = firewallWorld();
    const before = structuredClone(s.world),
      through = s.entries.length,
      original = canonical(s.entries);
    expect(
      s.run(
        { type: 'SetPeeringForwardedTraffic', peeringId: s.world.peerings[0]!.id, value: 'true' },
        0,
      ).code,
    ).toBe('stale-revision');
    expect(s.world).toEqual(before);
    s.run({ type: 'ResetWorkspace' });
    expect(resources(s.world)).toEqual([]);
    expect(replay(s.entries, through)).toEqual(before);
    expect(canonical(s.entries.slice(0, through))).toBe(original);
    const bad = structuredClone(s.entries);
    bad[0]!.receipt.code = 'invalid-name';
    expect(replay(bad)).toBeNull();
    expect(
      parseRequest({
        commandId: 'bad',
        expectedRevision: 0,
        command: { type: 'CreateAzureFirewall', x: () => {} },
      }),
    ).toBeNull();
    expect(analysePolicy(before, input).ok).toBe(true);
  });
  it('missing policy cannot fabricate default-deny certainty or a valid positive result', () => {
    const { s, input } = firewallWorld();
    expect(
      evaluateFirewallPolicy(s.world, 'missing', {
        sourceIp: '10.10.1.10',
        destinationIp: '10.20.1.10',
        protocol: 'Tcp',
        sourcePort: 1234,
        destinationPort: 1433,
      }).status,
    ).toBe('undetermined');
    const a = analysePolicy(s.world, { ...input, sourceNicId: 'missing' });
    expect(a).toEqual({ ok: false, code: 'invalid-source-nic' });
  });
  it.each([
    ['source', '10.0.0.0/16'],
    ['source', '10.0.0.0/24'],
    ['return', '10.0.0.0/16'],
    ['return', '10.0.0.0/24'],
  ])(
    'rejects ambiguous/wrong actual next-hop hub identity on %s with overlapping %s',
    (side, prefix) => {
      const { s, input, group, policy, app, data } = firewallWorld();
      const hub = s.create({
        type: 'CreateVirtualNetwork',
        groupId: group,
        name: 'vnet-other-hub',
        region: 'norwayeast',
        addressSpace: prefix!,
      });
      const subnet = s.create({
        type: 'CreateSubnet',
        vnetId: hub,
        name: 'AzureFirewallSubnet',
        addressPrefix: '10.0.0.0/26',
      });
      s.create({
        type: 'CreateAzureFirewall',
        groupId: group,
        name: 'fw-other',
        region: 'norwayeast',
        subnetId: subnet,
        policyId: policy,
        skuName: 'AZFW_VNet',
        skuTier: 'Standard',
      });
      const spoke = side === 'source' ? app : data;
      s.create({ type: 'CreateVnetPeering', vnetId: spoke, remoteVnetId: hub, name: 'other-hub' });
      s.create({
        type: 'CreateVnetPeering',
        vnetId: hub,
        remoteVnetId: spoke,
        name: 'other-spoke',
      });
      const a = analysePolicy(s.world, input);
      expect(a.ok && a.analysis.firewallPath.configurationPathAssessed).toBe(false);
      expect(a.ok && a.analysis.reason).toBe(
        side === 'source' ? 'firewall-next-hop-not-direct' : 'return-firewall-next-hop-not-direct',
      );
      expect(replay(s.entries)).toEqual(s.world);
    },
  );
  it('return receiving flag cannot be replaced by hub outgoing setting; default-only NSG stays unknown', () => {
    const { s, input, appHub, hubApp, group, appSubnet } = firewallWorld();
    s.run({ type: 'SetPeeringForwardedTraffic', peeringId: appHub, value: 'false' });
    s.run({ type: 'SetPeeringForwardedTraffic', peeringId: hubApp, value: 'true' });
    let a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.reason).toBe('source-forwarding-disabled');
    s.run({ type: 'SetPeeringForwardedTraffic', peeringId: appHub, value: 'true' });
    const n = s.create({
      type: 'CreateNetworkSecurityGroup',
      name: 'defaults-only',
      groupId: group,
      region: 'norwayeast',
    });
    s.run({ type: 'AssociateSubnetNsg', subnetId: appSubnet, nsgId: n });
    a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.reason).toBe('nsg-undetermined');
    expect(
      a.ok &&
        a.analysis.layers
          .slice(2)
          .every((l) => l.status === 'not-evaluated' && l.reason === 'earlier-layer'),
    ).toBe(true);
  });
  it('a higher-priority reverse-new-initiation Deny does not fabricate a failed established-response requirement', () => {
    const { s, input, collectionGroup } = firewallWorld();
    const c = s.create({
      type: 'CreateFirewallNetworkCollection',
      name: 'reverse-new-deny',
      collectionGroupId: collectionGroup,
      priority: '100',
      action: 'Deny',
    });
    s.create({
      type: 'CreateFirewallNetworkRule',
      name: 'reverse-initiation',
      collectionId: c,
      source: '10.20.1.0/24',
      destination: '10.10.1.0/24',
      protocol: 'Tcp',
      destinationPort: '*',
    });
    const a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.firewallPath.configurationPathAssessed).toBe(true);
  });
  it('selected return shadow and conservative next-hop resolution cannot be replaced by merely existing routes', () => {
    const { s, input, dataTable, appTable } = firewallWorld();
    s.create({
      type: 'CreateRoute',
      name: 'return-host-drop',
      routeTableId: dataTable,
      addressPrefix: '10.10.1.10/32',
      nextHopType: 'None',
    });
    let a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.reason).toBe('return-route-not-same-firewall');
    s.create({
      type: 'CreateRoute',
      name: 'next-hop-drop',
      routeTableId: appTable,
      addressPrefix: '10.0.0.4/32',
      nextHopType: 'None',
    });
    a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.reason).toBe('firewall-next-hop-not-direct');
  });
  it('specific spoke routes plus default appliance UDR preserve direct next-hop lookup; default alone does not defeat private system drop', () => {
    const { s, input, appTable, dataTable, firewall, appRoute } = firewallWorld();
    for (const routeTableId of [appTable, dataTable])
      s.create({
        type: 'CreateFirewallRoute',
        routeTableId,
        name: 'default',
        addressPrefix: '0.0.0.0/0',
        firewallId: firewall,
        nextHopIp: '10.0.0.4',
      });
    let a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.firewallPath.configurationPathAssessed).toBe(true);
    s.run({ type: 'DeleteRoute', routeId: appRoute });
    a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.reason).toBe('source-route-none');
  });
  it('source NSG denial marks later layers as stopped by earlier policy, never as a fictitious routing failure', () => {
    const { s, input, appNsg } = firewallWorld();
    s.create({
      type: 'CreateSecurityRule',
      nsgId: appNsg,
      name: 'source-deny',
      direction: 'Outbound',
      priority: '100',
      protocol: 'Tcp',
      source: '*',
      sourcePort: '*',
      destination: '*',
      destinationPort: '1433',
      access: 'Deny',
    });
    const a = analysePolicy(s.world, input);
    expect(a.ok && a.analysis.firewallPath.disposition).toBe('denied-by-nsg');
    expect(a.ok && a.analysis.layers.slice(2).every((l) => l.reason === 'earlier-layer')).toBe(
      true,
    );
  });
  it('dedicated subnet is versioned, exact-case, minimum26 and rejects other reserved services; invalid profile/scope never creates a partial Firewall', () => {
    const { s, group, policy } = firewallWorld(),
      v = s.create({
        type: 'CreateVirtualNetwork',
        groupId: group,
        name: 'other-vnet',
        region: 'norwayeast',
        addressSpace: '10.50.0.0/16',
      });
    for (const [name, addressPrefix, code] of [
      ['azurefirewallsubnet', '10.50.0.0/26', 'invalid-name'],
      ['AzureFirewallSubnet', '10.50.0.0/27', 'invalid-firewall-subnet'],
      ['GatewaySubnet', '10.50.0.0/26', 'unsupported-profile'],
    ]) {
      const before = canonical(s.world);
      expect(
        s.run({ type: 'CreateSubnet', vnetId: v, name: name!, addressPrefix: addressPrefix! }).code,
      ).toBe(code);
      expect(canonical(s.world)).toBe(before);
    }
    const subnet = s.create({
        type: 'CreateSubnet',
        vnetId: v,
        name: 'AzureFirewallSubnet',
        addressPrefix: '10.50.0.0/26',
      }),
      command = {
        type: 'CreateAzureFirewall',
        groupId: group,
        name: 'other-fw',
        region: 'norwayeast',
        subnetId: subnet,
        policyId: policy,
        skuName: 'AZFW_VNet',
        skuTier: 'Standard',
      } as const;
    for (const bad of [
      { skuTier: 'Basic' },
      { skuName: 'AZFW_Hub' },
      { region: 'westeurope' },
      { name: 'a'.repeat(51) },
      { policyId: 'missing' },
    ]) {
      const before = canonical(s.world);
      expect(s.run({ ...command, ...bad }).outcome).not.toBe('accepted');
      expect(canonical(s.world)).toBe(before);
    }
  });
  it('shared capacity includes every new family and bundle atomically while allowing existing association Apply at the limit', () => {
    const { s, group, policy, collectionGroup, collection, appSubnet, appNsg } = firewallWorld();
    const hub = s.create({
        type: 'CreateVirtualNetwork',
        groupId: group,
        name: 'capacity-hub',
        region: 'norwayeast',
        addressSpace: '10.50.0.0/16',
      }),
      subnet = s.create({
        type: 'CreateSubnet',
        vnetId: hub,
        name: 'AzureFirewallSubnet',
        addressPrefix: '10.50.0.0/26',
      });
    for (let n = 0; n < 15; n++)
      s.create({
        type: 'CreateFirewallRuleCollectionGroup',
        policyId: policy,
        name: 'extra-group-' + n,
        priority: String(1000 + n),
      });
    for (let n = 0; n < 23; n++)
      s.create({
        type: 'CreateFirewallNetworkCollection',
        collectionGroupId: collectionGroup,
        name: 'extra-collection-' + n,
        priority: String(1000 + n),
        action: 'Allow',
      });
    while (resources(s.world).length < 95)
      s.create({
        type: 'CreateFirewallNetworkRule',
        collectionId: collection,
        name: 'extra-rule-' + resources(s.world).length,
        source: '*',
        destination: '*',
        protocol: 'Tcp',
        destinationPort: '*',
      });
    const before = canonical(s.world);
    expect(
      s.run({
        type: 'CreateAzureFirewall',
        groupId: group,
        name: 'capacity-fw',
        region: 'norwayeast',
        subnetId: subnet,
        policyId: policy,
        skuName: 'AZFW_VNet',
        skuTier: 'Standard',
      }).code,
    ).toBe('capacity');
    expect(canonical(s.world)).toBe(before);
    s.create({
      type: 'CreateNetworkInterface',
      groupId: group,
      name: 'last-nic',
      region: 'norwayeast',
      vnetId: s.world.subnets.find((x) => x.id === appSubnet)!.vnetId,
      subnetId: appSubnet,
      privateIpAddress: '10.10.1.11',
      allocation: 'Static',
    });
    expect(resources(s.world)).toHaveLength(96);
    expect(
      s.run({
        type: 'CreateFirewallPolicy',
        groupId: group,
        name: 'over-budget',
        region: 'norwayeast',
        tier: 'Standard',
        threatIntelMode: 'Off',
      }).code,
    ).toBe('capacity');
    expect(s.run({ type: 'AssociateSubnetNsg', subnetId: appSubnet, nsgId: appNsg }).code).toBe(
      'updated',
    );
    expect(replay(s.entries)).toEqual(s.world);
  });
});
