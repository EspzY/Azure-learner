# Controlled shared-engine integration proposal

Proposed9 November2026; not implemented or approved by this document. The shared Portal presentation already exists. Course-v2 and Laboratory3.7 still have different resource/evidence authorities. A header redirect or copied inventory does not unify them.

## Boundaries to retain

| Layer           | Owner and contract                                                                                                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resource motor  | Existing version-bound typed commands, one World per workspace, dependencies/Policy, original receipt, deterministic historical through. Courses never copy or redefine resource state.                         |
| Portal / Studio | Same resource lists, creation/Review/Apply, Properties, relationships, original history and read-only diagnostics. Workspace adapter selects the actual authority; URL alone never authorizes a workspace.      |
| Workspace       | Explicit purpose and isolation: free temporary document, free server-owned session, or future course-bound server workspace. Model version is immutable; no automatic upgrade/import.                           |
| Learning layer  | Course/version/activity/attempt, mission requirements, SavvyShark, guided observations and separately versioned assessment/evidence adapter. No technical action alone implies understanding, XP or completion. |

The present temporary adapter is appropriate for free experiments, not durable assessment evidence. Its user-controlled history can be replay-valid while representing a different valid experiment. Course first submissions must not trust it as server attestation.

## Smallest safe implementation sequence

1. **Approve a course-workspace/evidence contract.** Add an explicit server-owned binding for courseId/contentVersion/activityId/attemptId and workspace/model, under real ownership checks. Define an evidence adapter version that reads original commands/receipts with boundary/through and pins exact IDs/revisions. Keep the existing free memory and free PostgreSQL purposes separate. Do not reuse PR54's old Portal-v1 origin sidecar as new assessment history.
2. **Pilot one new course-bound activity.** Prefer a new AZ-104 scenario once its learning contract exists; do not convert an active AZ-900 attempt. Provision initial resources through explicit registered commands, not World import. Use the same Portal controller and technical motor with an optional SavvyShark/mission layer. The course supplies scenario constraints; the motor owns validation/resources. Reset must preserve original events and cannot touch another purpose/workspace.
3. **Version its learning/evidence semantics.** A new rubric/store must name its supported technical model and evidence-adapter version. Explicit Start binds the actual authoritative workspace and attempt; navigation never starts it. Preserve immutable first, aid, retry and abandon, durable assistance denial, stale/cross-tab checks, Journal and exact Course Hub resume. Test technical acceptance versus pedagogical completion independently. An unavailable or wrong-version archive fails closed.
4. **Evaluate an optional AZ-900 successor after owner review.** Existing v2 missions, legacy Web/VM receipts, CC-01 origin, CC-03 assessment versions and CC-02 historical VM feedback remain readable/fullfillable under their original contracts. New course work may use a separately versioned successor; old answers are never rescored. Do not rename or reinterpret historical IDs/receipts.
5. **Consider data migration separately, if still useful.** First archive/hash original raw records and prove old replay. Require a versioned explicit mapping/provenance contract, user choice, rejection/recovery and original receipt retention. Different resource identities and command semantics cannot be inferred from matching names. No silent localStorage import, arbitrary World insertion or mixed write authority. Keeping old attempts in a read-only/fullfillable legacy adapter may be safer than migration.

## Acceptance before activation

A future course-bound pilot needs ownership/isolation and real persistent storage, original receipt/through replay, complete rollback/idempotency/revision tests, exact active-attempt resume, denied assistance, historical compatibility, one shared Portal/Studio experience and independent review on its own new contract. It must prove that free reset never affects course data and course reset never affects another workspace.

Do not claim universal course/Sandbox technical integration until such a pilot is implemented and verified. Current PR71 supplies a functional free3.7 workspace and shared navigation/presentation; it does not implement course-bound3.7 storage, new rubrics, new courses or migration.
