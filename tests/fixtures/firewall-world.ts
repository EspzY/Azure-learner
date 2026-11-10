import { execute, freshWorld } from '../../src/laboratory/v35/domain';
import { laboratoryModel, type Command, type Entry } from '../../src/laboratory/v35/contract';
/** Test setup uses only actual deterministic commands; no injected positive World. */
export function firewallWorld() {
  let world = freshWorld();
  const entries: Entry[] = [];
  const s = {
    get world() {
      return world;
    },
    entries,
    run(command: Command, revision = world.revision) {
      const request = {
        commandId: 'firewall-test-' + (entries.length + 1),
        expectedRevision: revision,
        command,
      };
      const r = execute(world, request, entries.length + 1);
      entries.push({ model: laboratoryModel, attempt: world.attempt, request, receipt: r.receipt });
      world = r.world;
      return r.receipt;
    },
    create(command: Command) {
      const r = this.run(command);
      if (r.outcome !== 'accepted') throw Error(JSON.stringify({ command, r }));
      return r.addedIds[0]!;
    },
  };
  const group = s.create({
    type: 'CreateGroup',
    name: 'rg-firewall',
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
  });
  const vnet = (name: string, space: string) =>
    s.create({
      type: 'CreateVirtualNetwork',
      groupId: group,
      name,
      region: 'norwayeast',
      addressSpace: space,
    });
  const hub = vnet('vnet-hub', '10.0.0.0/16'),
    app = vnet('vnet-app', '10.10.0.0/16'),
    data = vnet('vnet-data', '10.20.0.0/16');
  const subnet = (vnetId: string, name: string, addressPrefix: string) =>
    s.create({ type: 'CreateSubnet', vnetId, name, addressPrefix });
  const hubSubnet = subnet(hub, 'AzureFirewallSubnet', '10.0.0.0/26'),
    appSubnet = subnet(app, 'snet-app', '10.10.1.0/24'),
    dataSubnet = subnet(data, 'snet-data', '10.20.1.0/24');
  const peer = (vnetId: string, remoteVnetId: string, name: string) =>
    s.create({ type: 'CreateVnetPeering', vnetId, remoteVnetId, name });
  const hubApp = peer(hub, app, 'hub-app'),
    appHub = peer(app, hub, 'app-hub'),
    hubData = peer(hub, data, 'hub-data'),
    dataHub = peer(data, hub, 'data-hub');
  for (const peeringId of [appHub, dataHub])
    s.run({ type: 'SetPeeringForwardedTraffic', peeringId, value: 'true' });
  const policy = s.create({
    type: 'CreateFirewallPolicy',
    groupId: group,
    name: 'fw-policy-hub',
    region: 'norwayeast',
    tier: 'Standard',
    threatIntelMode: 'Off',
  });
  const collectionGroup = s.create({
    type: 'CreateFirewallRuleCollectionGroup',
    policyId: policy,
    name: 'workloads',
    priority: '200',
  });
  const collection = s.create({
    type: 'CreateFirewallNetworkCollection',
    collectionGroupId: collectionGroup,
    name: 'allow-data',
    priority: '200',
    action: 'Allow',
  });
  const rule = s.create({
    type: 'CreateFirewallNetworkRule',
    collectionId: collection,
    name: 'app-sql',
    source: '10.10.1.0/24',
    destination: '10.20.1.0/24',
    protocol: 'Tcp',
    destinationPort: '1433',
  });
  const firewall = s.create({
    type: 'CreateAzureFirewall',
    groupId: group,
    name: 'fw-hub',
    region: 'norwayeast',
    subnetId: hubSubnet,
    policyId: policy,
    skuName: 'AZFW_VNet',
    skuTier: 'Standard',
  });
  const table = (name: string) =>
    s.create({ type: 'CreateRouteTable', groupId: group, name, region: 'norwayeast' });
  const appTable = table('rt-app'),
    dataTable = table('rt-data');
  const route = (routeTableId: string, name: string, addressPrefix: string) =>
    s.create({
      type: 'CreateFirewallRoute',
      routeTableId,
      name,
      addressPrefix,
      firewallId: firewall,
      nextHopIp: '10.0.0.4',
    });
  const appRoute = route(appTable, 'to-data', '10.20.0.0/16'),
    dataRoute = route(dataTable, 'to-app', '10.10.0.0/16');
  for (const [subnetId, routeTableId] of [
    [appSubnet, appTable],
    [dataSubnet, dataTable],
  ])
    s.run({ type: 'AssociateSubnetRouteTable', subnetId: subnetId!, routeTableId: routeTableId! });
  const vm = (name: string, subnetId: string, ip: string) =>
    s.create({
      type: 'CreateVirtualMachine',
      name,
      groupId: group,
      region: 'norwayeast',
      image: 'ubuntu-22.04-gen2',
      size: 'Standard_D2s_v4',
      subnetId,
      privateIpAddress: ip,
      allocation: 'Static',
      nsgId: 'none',
      osDiskSku: 'StandardSSD_LRS',
      osDiskSizeGiB: '128',
    });
  const appVm = vm('vm-app-01', appSubnet, '10.10.1.10'),
    dataVm = vm('vm-data-01', dataSubnet, '10.20.1.10');
  const appNic = s.world.vms.find((v) => v.id === appVm)!.nicId,
    dataNic = s.world.vms.find((v) => v.id === dataVm)!.nicId;
  const nsg = (name: string) =>
    s.create({ type: 'CreateNetworkSecurityGroup', groupId: group, name, region: 'norwayeast' });
  const appNsg = nsg('nsg-app'),
    dataNsg = nsg('nsg-data');
  for (const [subnetId, nsgId] of [
    [appSubnet, appNsg],
    [dataSubnet, dataNsg],
  ])
    s.run({ type: 'AssociateSubnetNsg', subnetId: subnetId!, nsgId: nsgId! });
  const securityRule = (nsgId: string, name: string, direction: string, destinationPort: string) =>
    s.create({
      type: 'CreateSecurityRule',
      nsgId,
      name,
      direction,
      priority: '200',
      protocol: 'Tcp',
      source: '10.10.1.0/24',
      sourcePort: '*',
      destination: '10.20.1.0/24',
      destinationPort,
      access: 'Allow',
    });
  securityRule(appNsg, 'send-data', 'Outbound', '*');
  securityRule(dataNsg, 'receive-sql', 'Inbound', '1433');
  const input = {
    sourceNicId: appNic,
    destinationNicId: dataNic,
    protocol: 'Tcp',
    sourcePort: '50000',
    destinationPort: '1433',
  };
  return {
    s,
    group,
    hub,
    app,
    data,
    hubSubnet,
    appSubnet,
    dataSubnet,
    hubApp,
    appHub,
    hubData,
    dataHub,
    policy,
    collectionGroup,
    collection,
    rule,
    firewall,
    appTable,
    dataTable,
    appRoute,
    dataRoute,
    appVm,
    dataVm,
    appNic,
    dataNic,
    appNsg,
    dataNsg,
    input,
  };
}
