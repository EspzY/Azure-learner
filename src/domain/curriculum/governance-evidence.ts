import type { Engine } from '../chapter01/model';
import { types } from '../chapter01/model';
import { replayEngine } from '../sandbox/replay';
import type { GovernanceGuide } from './governance';

/** Read-only original receipts, pinned attempt and ledger interval; no copied inventory. */
export function governancePolicyEvidence(
  g: GovernanceGuide,
  engine: Engine | undefined,
  attempt: number,
) {
  const checks = { policy: false, scope: false, denied: false, corrected: false, receipts: false };
  const empty = {
    verifiable: false,
    complete: false,
    checks,
    denied: null as string | null,
    corrected: null as string | null,
    group: null as string | null,
    plan: null as string | null,
  };
  if (g.mission !== 'policy' || g.attempt !== attempt || !engine || g.through === null)
    return empty;
  const index = (id: string | null) =>
    id === null ? -1 : engine.ledger.findIndex((x) => x.receipt.commandId === id);
  const start = index(g.boundary),
    end = index(g.through);
  if ((g.boundary !== null && start < 0) || end < 0 || end < start) return empty;
  const snapshot = replayEngine(engine, end + 1);
  if (!snapshot) return empty;
  const entries = engine.ledger.slice(start + 1, end + 1),
    inspected = (kind: string, id: string) => g.inspected.includes(`${kind}:${id}`);
  const policy = snapshot.world.policies.find((p) => p.id === 'policy-web-location');
  checks.policy =
    !!policy &&
    policy.scopeId === 'sub-app' &&
    policy.mode === 'all' &&
    policy.targetTypes.includes(types.plan) &&
    policy.targetTypes.includes(types.app) &&
    policy.allowedLocations.includes('westeurope') &&
    inspected('policy', policy.id);
  const rejected = entries.find(
    (x) =>
      x.receipt.operation === 'CreatePlan' &&
      x.receipt.code === 'policy-location-denied' &&
      x.receipt.outcome === 'rejected' &&
      !!policy &&
      x.receipt.policy?.assignmentId === policy.id &&
      x.receipt.policy?.assignmentScope === 'sub-app' &&
      x.receipt.addedIds.length === 0 &&
      x.receipt.beforeRevision === x.receipt.afterRevision &&
      x.receipt.beforeCount === x.receipt.afterCount &&
      inspected('receipt', x.receipt.commandId),
  );
  const accepted = rejected
    ? entries.find(
        (x) =>
          x.receipt.operation === 'CreatePlan' &&
          x.receipt.outcome === 'accepted' &&
          x.receipt.location === 'westeurope' &&
          x.request.command.name === rejected.request.command.name &&
          x.request.command.groupId === rejected.request.command.groupId &&
          x.request.command.profile === rejected.request.command.profile &&
          engine.ledger.indexOf(x) > engine.ledger.indexOf(rejected) &&
          inspected('receipt', x.receipt.commandId),
      )
    : undefined;
  const plan = accepted
    ? snapshot.world.resources.find(
        (r) => r.type === types.plan && accepted.receipt.addedIds.includes(r.id),
      )
    : undefined;
  const group = plan ? snapshot.world.groups.find((r) => r.id === plan.groupId) : undefined;
  checks.denied = !!rejected;
  checks.corrected =
    !!accepted && !!plan && plan.location === 'westeurope' && group?.subscriptionId === 'sub-app';
  checks.scope = !!group && inspected('resource', group.id) && inspected('resource', 'sub-app');
  checks.receipts = !!rejected && !!accepted;
  return {
    verifiable: true,
    complete: Object.values(checks).every(Boolean),
    checks,
    denied: rejected?.receipt.commandId ?? null,
    corrected: accepted?.receipt.commandId ?? null,
    group: group?.id ?? null,
    plan: plan?.id ?? null,
  };
}
