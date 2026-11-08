import { firewallWorld } from './firewall-world';
export function studioWorld(nearCapacity = false) {
  const f = firewallWorld();
  if (nearCapacity) {
    f.s.create({
      type: 'CreateNetworkSecurityGroup',
      name: 'nsg-' + 'a'.repeat(76),
      groupId: f.group,
      region: 'norwayeast',
    });
    const count = () =>
      Object.values(f.s.world).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0);
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
  }
  return f;
}
