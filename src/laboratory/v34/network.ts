import { execute } from '../v33/domain';
import type { World as EndpointWorld, Request as EndpointRequest } from '../v33/contract';
import { endpointProjection } from './projection';
import { childNames } from './profiles';
import type { World, Request, ComputeCommand } from './contract';
/** One private proposal through the SAME frozen NIC/IP/scope/NSG validators.
 * Intermediate receipts are not ledger events. Caller commits all three resources or none. */
export function proposePrimaryNic(
  world: World,
  request: Request,
  command: ComputeCommand,
  sequence: number,
) {
  const subnet = world.subnets.find((x) => x.id === command.subnetId);
  const proposal: EndpointRequest = {
    commandId: request.commandId,
    expectedRevision: world.revision,
    command: {
      type: 'CreateNetworkInterface',
      groupId: command.groupId,
      name: childNames(command.name).nic,
      region: command.region,
      vnetId: subnet?.vnetId ?? '',
      subnetId: command.subnetId,
      privateIpAddress: command.privateIpAddress,
      allocation: command.allocation,
    },
  };
  let result = execute(endpointProjection(world), proposal, sequence);
  if (result.receipt.outcome !== 'accepted') return result;
  if (command.nsgId !== 'none') {
    const nicId = result.receipt.addedIds[0]!;
    result = execute(
      result.world,
      {
        commandId: request.commandId,
        expectedRevision: result.world.revision,
        command: { type: 'AssociateNicNsg', nicId, nsgId: command.nsgId },
      },
      sequence,
    );
  }
  return result as { world: EndpointWorld; receipt: typeof result.receipt };
}
