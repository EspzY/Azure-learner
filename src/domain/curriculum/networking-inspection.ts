import type { Engine } from '../chapter01/model';
import { replayEngine } from '../sandbox/replay';
import { vmChain } from '../sandbox/missions';
import { networkingGuidedAnswer, type NetworkingGuide } from './networking';
/** Read-only projection. Prior resources are valid fresh inspections, never new-build credit. */
export function networkingInspection(
  g: NetworkingGuide | undefined,
  engine: Engine,
  attempt: number,
) {
  const empty = {
    verifiable: false,
    chain: null,
    group: null,
    subscription: null,
    receipt: null,
    refs: [] as string[],
    newBuild: false,
    inspected: false,
    complete: false,
  } as const;
  if (!g || g.mission !== 'inspect' || g.attempt !== attempt) return empty;
  const boundary =
    g.boundary === null ? -1 : engine.ledger.findIndex((e) => e.receipt.commandId === g.boundary);
  if (g.boundary !== null && boundary < 0) return empty;
  const through =
    g.through === null
      ? engine.ledger.length
      : engine.ledger.findIndex((e) => e.receipt.commandId === g.through) + 1;
  if ((g.through !== null && through === 0) || through < boundary + 1) return empty;
  const replay = replayEngine(engine, through);
  if (!replay) return empty;
  const chain = vmChain(replay.world, g.target),
    live = vmChain(engine.world, g.target);
  if (!chain || !live || JSON.stringify(chain) !== JSON.stringify(live))
    return { ...empty, verifiable: true };
  const group = replay.world.groups.find((r) => r.id === chain.vm.groupId),
    subscription = replay.world.scopes.find(
      (r) => r.kind === 'subscription' && r.id === group?.subscriptionId,
    ),
    receipt =
      replay.ledger.find(
        (e) =>
          e.receipt.outcome === 'accepted' &&
          e.receipt.operation === 'CreateVmBundle' &&
          e.receipt.addedIds.includes(chain.vm.id),
      ) ?? null;
  if (!group || !subscription || !receipt) return { ...empty, verifiable: true };
  const refs = [
      chain.vm.id,
      chain.nic.id,
      chain.subnet.id,
      chain.vnet.id,
      group.id,
      subscription.id,
      receipt.receipt.commandId,
    ],
    inspected = refs.every((id) => g.inspected.includes(id)),
    receiptIndex = engine.ledger.findIndex(
      (e) => e.receipt.commandId === receipt.receipt.commandId,
    );
  return {
    verifiable: true,
    chain,
    group,
    subscription,
    receipt,
    refs,
    newBuild: receiptIndex > boundary,
    inspected,
    complete: inspected && g.answer === networkingGuidedAnswer.inspect,
  };
}
