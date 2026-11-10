import type { Engine } from '../chapter01/model';
import { replayEngine } from '../sandbox/replay';
import { vmChain } from '../sandbox/missions';
import { computeGuidedAnswer, type ComputeGuide } from './compute';
/** Read-only receipt/ancestry projection. Never sends a command or copies inventory. */
export function computeVmFacts(g: ComputeGuide | undefined, engine: Engine, attempt: number) {
  const empty = {
    verifiable: false,
    chain: null,
    receipt: null,
    newBuild: false,
    inspected: false,
    complete: false,
  } as const;
  if (!g || g.mission !== 'vm' || g.attempt !== attempt) return empty;
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
  const chain = vmChain(replay.world, g.target);
  if (!chain) return { ...empty, verifiable: true };
  const receipt =
    replay.ledger
      .slice(boundary + 1)
      .find(
        (e) =>
          e.receipt.outcome === 'accepted' &&
          e.receipt.operation === 'CreateVmBundle' &&
          e.receipt.addedIds.includes(chain.vm.id),
      ) ?? null;
  const cmd = receipt?.request.command;
  const group = replay.world.groups.find((x) => x.id === chain.vm.groupId);
  // Valid replay proves it existed before this command; prerequisites may be built
  // after mission start. A new learner never needs a reset or historical World.
  const existingSubnet =
    !!cmd?.subnetId &&
    chain.subnet.id === cmd.subnetId &&
    !receipt?.receipt.addedIds.includes(chain.subnet.id);
  const data = chain.data;
  const newBuild =
    !!receipt &&
    chain.vm.image === 'windows-2022' &&
    chain.vm.profile === 'standard' &&
    data?.kind === 'disk' &&
    data.gib === 64 &&
    group?.subscriptionId === 'sub-app' &&
    existingSubnet;
  const refs = [
    chain.vm.id,
    chain.os.id,
    chain.nic.id,
    chain.subnet.id,
    chain.vnet.id,
    ...(data ? [data.id] : []),
    ...(receipt ? [receipt.receipt.commandId] : []),
  ];
  const inspected = refs.length === 7 && refs.every((id) => g.inspected.includes(id));
  return {
    verifiable: true,
    chain,
    receipt,
    newBuild,
    inspected,
    complete: newBuild && inspected && g.answer === computeGuidedAnswer.vm,
  };
}
