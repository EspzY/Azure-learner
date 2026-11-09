import { describe, it, expect } from 'vitest';
import { execute, freshWorld, replay, canonical, parseRequest } from './laboratory/v34/domain';
import {
  laboratoryModel,
  type Command,
  type Entry,
  type ComputeCommand,
} from './laboratory/v34/contract';
import { analysePolicy, analyseRoutes } from './laboratory/v34/analysis';
import * as frozen from './laboratory/v33/domain';
import { endpointProjection } from './laboratory/v34/projection';
import * as engine from './laboratory/engine';
function ready(prefix = '10.30.1.0/24') {
  let world = freshWorld();
  const entries: Entry[] = [];
  const s = {
    get world() {
      return world;
    },
    entries,
    run(command: Command, revision = world.revision) {
      const request = {
        commandId: 'compute-' + (entries.length + 1),
        expectedRevision: revision,
        command,
      };
      const r = execute(world, request, entries.length + 1);
      entries.push({ model: laboratoryModel, attempt: world.attempt, request, receipt: r.receipt });
      world = r.world;
      return r.receipt;
    },
  };
  const group = s.run({
    type: 'CreateGroup',
    name: 'rg-compute',
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
  }).addedIds[0]!;
  const vnet = s.run({
    type: 'CreateVirtualNetwork',
    name: 'vnet-compute',
    groupId: group,
    region: 'norwayeast',
    addressSpace: '10.30.0.0/16',
  }).addedIds[0]!;
  const subnet = s.run({
    type: 'CreateSubnet',
    name: 'snet-app',
    vnetId: vnet,
    addressPrefix: prefix,
  }).addedIds[0]!;
  const command: ComputeCommand = {
    type: 'CreateVirtualMachine',
    name: 'vm-app-01',
    groupId: group,
    region: 'norwayeast',
    image: 'ubuntu-22.04-gen2',
    size: 'Standard_D2s_v4',
    subnetId: subnet,
    privateIpAddress: '10.30.1.10',
    allocation: 'Static',
    nsgId: 'none',
    osDiskSku: 'StandardSSD_LRS',
    osDiskSizeGiB: '128',
  };
  return { s, group, vnet, subnet, command };
}
describe('Compute3.4 atomic configuration and frozen networking', () => {
  it('creates exactly one VM/NIC/disk with one original receipt/revision, same origins and inverse references', () => {
    const { s, command } = ready(),
      old = canonical(s.world),
      revision = s.world.revision;
    const r = s.run(command),
      w = s.world;
    expect(r.outcome).toBe('accepted');
    expect(r.addedIds).toEqual([w.vms[0]!.id, w.nics[0]!.id, w.disks[0]!.id]);
    expect(r.afterCount - r.beforeCount).toBe(3);
    expect(w.revision).toBe(revision + 1);
    expect(w.nextId).toBe(7);
    expect(w.vms[0]).toMatchObject({
      nicId: w.nics[0]!.id,
      osDiskId: w.disks[0]!.id,
      origin: r.commandId,
    });
    expect(w.nics[0]).toMatchObject({
      name: 'vm-app-01-nic',
      privateIpAddress: command.privateIpAddress,
      allocation: 'Static',
      origin: r.commandId,
    });
    expect(w.disks[0]).toMatchObject({
      name: 'vm-app-01-os',
      sku: 'StandardSSD_LRS',
      sizeGiB: 128,
      osType: 'Linux',
      origin: r.commandId,
    });
    expect(replay(s.entries)).toEqual(w);
    expect(canonical(replay(s.entries, 3)!)).toBe(old);
    expect(engine.replay(s.entries, laboratoryModel)).toEqual(w);
    const corrupted = structuredClone(s.entries);
    corrupted[3]!.receipt.addedIds.pop();
    expect(replay(corrupted)).toBeNull();
  });
  it.each([
    [{ privateIpAddress: '10.30.1.0' }, 'reserved-private-ip'],
    [{ privateIpAddress: '10.30.1.3' }, 'reserved-private-ip'],
    [{ privateIpAddress: '10.30.1.255' }, 'reserved-private-ip'],
    [{ privateIpAddress: '10.30.2.10' }, 'outside-subnet'],
    [{ privateIpAddress: 'x' }, 'invalid-private-ip'],
    [{ region: 'eastus' }, 'invalid-region'],
    [{ region: 'westeurope' }, 'incompatible-association'],
    [{ subnetId: 'missing' }, 'invalid-parent'],
    [{ groupId: 'missing' }, 'invalid-parent'],
    [{ image: 'ubuntu-arm64' }, 'unsupported-profile'],
    [{ size: 'Standard_D2s_v5' }, 'unsupported-profile'],
    [{ allocation: 'Dynamic' }, 'unsupported-profile'],
    [{ osDiskSku: 'Premium_LRS' }, 'unsupported-profile'],
    [{ osDiskSizeGiB: '127' }, 'unsupported-profile'],
    [{ name: '-invalid' }, 'invalid-name'],
    [{ image: 'windows-2022-gen2', name: 'windows-name-longer-than-15' }, 'invalid-name'],
    [{ adminPassword: 'never-accepted' }, 'unsupported-field'],
    [{ nsgId: 'missing' }, 'invalid-parent'],
  ])('rejects %j atomically (%s)', (changes, code) => {
    const { s, command } = ready(),
      before = canonical(s.world);
    const r = s.run({ ...command, ...changes } as ComputeCommand);
    expect(r.code).toBe(code);
    expect(canonical(s.world)).toBe(before);
    expect(r.addedIds).toEqual([]);
    if (parseRequest(s.entries.at(-1)!.request)) expect(replay(s.entries)).toEqual(s.world);
    else expect(replay(s.entries)).toBeNull();
  });
  it('shares existing NIC duplicate-name/IP and NSG scope rules rather than copying them', () => {
    const { s, command, group, vnet, subnet } = ready();
    const nsg = s.run({
      type: 'CreateNetworkSecurityGroup',
      name: 'nsg-app',
      groupId: group,
      region: 'norwayeast',
    }).addedIds[0]!;
    expect(s.run({ ...command, nsgId: nsg }).outcome).toBe('accepted');
    expect(s.world.nics[0]).toMatchObject({
      nsgId: nsg,
      associationOrigin: s.world.vms[0]!.origin,
    });
    const before = canonical(s.world);
    expect(s.run({ ...command, name: 'vm-02' }).code).toBe('duplicate-private-ip');
    expect(s.run({ ...command, privateIpAddress: '10.30.1.11' }).code).toBe('duplicate-name');
    expect(canonical(s.world)).toBe(before);
    expect(
      s.run({
        type: 'CreateNetworkInterface',
        groupId: group,
        vnetId: vnet,
        subnetId: subnet,
        name: 'standalone',
        region: 'norwayeast',
        privateIpAddress: '10.30.1.11',
        allocation: 'Static',
      }).outcome,
    ).toBe('accepted');
    expect(s.run({ ...command, name: 'vm-03', privateIpAddress: '10.30.1.11' }).code).toBe(
      'duplicate-private-ip',
    );
    expect(
      s.run({
        ...command,
        image: 'windows-2022-gen2',
        size: 'Standard_D4s_v4',
        name: 'win-02',
        osDiskSizeGiB: '256',
        privateIpAddress: '10.30.1.12',
      }).outcome,
    ).toBe('accepted');
    expect(s.world.disks[1]).toMatchObject({ osType: 'Windows', sizeGiB: 256 });
  });
  it('validates same subscription, permits separate compatible RG, and atomically rejects incompatible NSG', () => {
    const { s, command } = ready();
    const other = s.run({
      type: 'CreateGroup',
      name: 'rg-other',
      subscriptionId: 'sub-app',
      metadataRegion: 'norwayeast',
    }).addedIds[0]!;
    expect(s.run({ ...command, groupId: other }).code).toBe('incompatible-association');
    const nsg = s.run({
      type: 'CreateNetworkSecurityGroup',
      name: 'nsg-other',
      groupId: other,
      region: 'norwayeast',
    }).addedIds[0]!;
    const before = canonical(s.world);
    expect(s.run({ ...command, nsgId: nsg }).code).toBe('incompatible-association');
    expect(canonical(s.world)).toBe(before);
    const compatible = s.run({
      type: 'CreateGroup',
      name: 'rg-compatible',
      subscriptionId: 'sub-shared',
      metadataRegion: 'westeurope',
    }).addedIds[0]!;
    expect(s.run({ ...command, groupId: compatible }).outcome).toBe('accepted');
  });
  it('rejects a full /29 without a partial bundle, enforces total/VM/NIC limits and stale revision', () => {
    const { s, command } = ready('10.30.1.0/29');
    for (const suffix of [4, 5, 6])
      expect(
        s.run({ ...command, name: `vm-${suffix}`, privateIpAddress: `10.30.1.${suffix}` }).outcome,
      ).toBe('accepted');
    const before = canonical(s.world);
    expect(s.run({ ...command, privateIpAddress: '10.30.1.6' }).code).toBe('duplicate-private-ip');
    expect(s.run({ ...command, privateIpAddress: '10.30.1.7' }).code).toBe('reserved-private-ip');
    expect(canonical(s.world)).toBe(before);
    expect(s.run(command, 0).code).toBe('stale-revision');
    const { s: q, command: c } = ready();
    for (let i = 0; i < 8; i++)
      expect(q.run({ ...c, name: `vm-${i}`, privateIpAddress: `10.30.1.${10 + i}` }).outcome).toBe(
        'accepted',
      );
    expect(q.run({ ...c, name: 'vm-over', privateIpAddress: '10.30.1.30' }).code).toBe('capacity');
  });
  it('retains original historical VM configuration through reset, and reuses read-only route/policy analysis', () => {
    const { s, command } = ready();
    s.run(command);
    s.run({ ...command, name: 'vm-app-02', privateIpAddress: '10.30.1.11' });
    const before = canonical(s.world),
      w = s.world,
      input = {
        sourceNicId: w.nics[0]!.id,
        destinationNicId: w.nics[1]!.id,
        protocol: 'Tcp',
        sourcePort: '50000',
        destinationPort: '443',
      };
    expect(analysePolicy(w, input)).toMatchObject({
      ok: true,
      analysis: { model: laboratoryModel, route: { model: laboratoryModel } },
    });
    expect(analyseRoutes(w, command.subnetId, '10.30.1.11')).toMatchObject({
      ok: true,
      analysis: { model: laboratoryModel },
    });
    expect(canonical(s.world)).toBe(before);
    const count = s.entries.length,
      ids = s.run({ type: 'ResetWorkspace' }).removedIds;
    expect(ids).toContain(w.vms[0]!.id);
    expect(ids).toContain(w.nics[0]!.id);
    expect(ids).toContain(w.disks[0]!.id);
    expect(s.world.vms).toEqual([]);
    expect(s.world.disks).toEqual([]);
    expect(s.world.nics).toEqual([]);
    expect(s.world.attempt).toBe(2);
    expect(replay(s.entries, count)).toEqual(w);
    expect(replay(s.entries)).toEqual(s.world);
  });
  it('keeps3.3 unsupported VM receipts and World exactly frozen', () => {
    const { s, command } = ready();
    const old = endpointProjection(s.world),
      r = frozen.execute(
        old,
        { commandId: 'old-vm', expectedRevision: old.revision, command } as never,
        4,
      );
    expect(r.receipt).toMatchObject({
      outcome: 'unsupported',
      code: 'unsupported-capability',
      addedIds: [],
      beforeRevision: 3,
      afterRevision: 3,
    });
    expect(r.world).toBe(old);
    expect(
      engine.execute(old, { commandId: 'old-vm', expectedRevision: old.revision, command }, 4),
    ).toEqual(r);
    expect(engine.models).toEqual([
      'laboratory@3.0.0',
      'laboratory@3.1.0',
      'laboratory@3.2.0',
      'laboratory@3.3.0',
      'laboratory@3.4.0',
      'laboratory@3.5.0',
      'laboratory@3.6.0',
      'laboratory@3.7.0',
      'laboratory@3.8.0',
    ]);
  });
  it('counts VM and disk resources in delegated shared capacity checks and never commits beyond96', () => {
    const { s, command, group, vnet } = ready();
    expect(s.run(command).code).toBe('created');
    for (let n = 0; n < 2; n++) {
      const nsg = s.run({
        type: 'CreateNetworkSecurityGroup',
        name: `nsg-${n}`,
        groupId: group,
        region: 'norwayeast',
      }).addedIds[0]!;
      const table = s.run({
        type: 'CreateRouteTable',
        name: `rt-${n}`,
        groupId: group,
        region: 'norwayeast',
      }).addedIds[0]!;
      for (let k = 0; k < 16; k++) {
        expect(
          s.run({
            type: 'CreateSecurityRule',
            nsgId: nsg,
            name: `rule-${k}`,
            direction: 'Inbound',
            priority: String(100 + k),
            protocol: 'Tcp',
            source: '*',
            sourcePort: '*',
            destination: '*',
            destinationPort: '443',
            access: 'Allow',
          }).outcome,
        ).toBe('accepted');
        expect(
          s.run({
            type: 'CreateRoute',
            routeTableId: table,
            name: `route-${k}`,
            addressPrefix: `192.0.${k}.0/24`,
            nextHopType: 'None',
          }).outcome,
        ).toBe('accepted');
      }
    }
    for (let n = 2; n <= 23; n++)
      expect(
        s.run({
          type: 'CreateSubnet',
          vnetId: vnet,
          name: `snet-${n}`,
          addressPrefix: `10.30.${n}.0/24`,
        }).outcome,
      ).toBe('accepted');
    const before = canonical(s.world);
    expect(
      s.run({
        type: 'CreateSubnet',
        vnetId: vnet,
        name: 'snet-over',
        addressPrefix: '10.30.24.0/24',
      }).code,
    ).toBe('capacity');
    expect(s.run({ ...command, name: 'vm-over', privateIpAddress: '10.30.1.11' }).code).toBe(
      'capacity',
    );
    expect(canonical(s.world)).toBe(before);
    expect(replay(s.entries)).toEqual(s.world);
  });
  it('reuses NIC capacity and generated NIC name collision with no partial VM or disk', () => {
    const { s, command, group, vnet, subnet } = ready();
    const nic = (name: string, ip: string): Command => ({
      type: 'CreateNetworkInterface',
      name,
      groupId: group,
      vnetId: vnet,
      subnetId: subnet,
      region: 'norwayeast',
      privateIpAddress: ip,
      allocation: 'Static',
    });
    expect(s.run(nic('vm-app-01-nic', '10.30.1.20')).outcome).toBe('accepted');
    expect(s.run(command)).toMatchObject({
      code: 'duplicate-name',
      field: 'nicName',
      addedIds: [],
    });
    for (let n = 1; n < 16; n++)
      expect(s.run(nic(`nic-${n}`, `10.30.1.${20 + n}`)).outcome).toBe('accepted');
    const before = canonical(s.world);
    expect(s.run({ ...command, name: 'fresh-vm' }).code).toBe('capacity');
    expect(canonical(s.world)).toBe(before);
  });
});
