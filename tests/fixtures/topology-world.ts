import { remediationWorld } from './remediation-world';
import { execute, freshWorld } from '../../src/laboratory/v37/domain';
import { laboratoryModel, type Command, type Entry } from '../../src/laboratory/v37/contract';
/** All positive resources come from registered commands, including test seeds. */
export function topologyWorld() {
  const f = remediationWorld();
  let world = freshWorld();
  const entries: Entry[] = [];
  const s = {
    get world() {
      return world;
    },
    entries,
    run(command: Command, revision = world.revision) {
      const request = {
        commandId: 'topology-' + (entries.length + 1),
        expectedRevision: revision,
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
    create(command: Command) {
      const r = this.run(command);
      if (r.outcome !== 'accepted') throw Error(JSON.stringify(r));
      return r.addedIds[0]!;
    },
  };
  for (const e of f.s.entries) {
    const r = s.run(e.request.command);
    if (r.outcome !== 'accepted') throw Error(JSON.stringify(r));
  }
  const route = world.routes.find((r) => r.routeTableId === f.appTable)!.id;
  return { ...f, s, route };
}
export function routeUpdate(
  f: ReturnType<typeof topologyWorld>,
  nextHopType = 'VirtualAppliance',
): Command {
  return {
    type: 'UpdateRoute',
    routeId: f.route,
    routeTableId: f.appTable,
    addressPrefix: '10.20.0.0/16',
    nextHopType,
    ...(nextHopType === 'VirtualAppliance'
      ? { firewallId: f.firewall, nextHopIp: f.s.world.firewalls[0]!.privateIpAddress }
      : {}),
  };
}
