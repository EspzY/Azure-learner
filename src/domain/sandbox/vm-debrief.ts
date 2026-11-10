import type { MissionSession, missionEvaluation } from './missions';
import { infrastructureRequirements } from './missions';

type Result = ReturnType<typeof missionEvaluation>;
/** Presentation only. The caller supplies the very same attempt/through replay as evaluation.
 * Never accepts current inventory, writes events, or grants completion/assistance. */
export function vmDebrief(session: MissionSession, result: Result) {
  if (
    session.mission !== 'infrastructure' ||
    session.status !== 'submitted' ||
    !result.verifiable ||
    !result.world
  )
    return null;
  const required = infrastructureRequirements(session.mode),
    chain = result.chain,
    actual = {
      image: chain?.vm.image ?? null,
      profile: chain?.vm.profile ?? null,
      dataDiskGiB: chain?.data?.kind === 'disk' ? chain.data.gib : null,
      subscriptionId:
        result.world.groups.find((g) => g.id === chain?.vm.groupId)?.subscriptionId ?? null,
    };
  const rows = (Object.keys(required) as (keyof typeof required)[]).map((field) => ({
    field,
    expected: required[field],
    actual: actual[field],
    matches: actual[field] === required[field],
  }));
  return {
    rows,
    mismatches: rows.filter((r) => !r.matches),
    // These are the original evaluator's predicates and references, not a second rubric.
    complete: result.complete,
    receiptId: result.checks.newBuild ? (result.receipts[0] ?? null) : null,
    resource: chain?.vm ?? null,
    remaining: Object.keys(result.checks).filter((id) => !result.checks[id]),
  };
}
