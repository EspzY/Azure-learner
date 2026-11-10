# Future customer-scenario contract — proposal only

No scenario engine, endpoint, bootstrap/import, assessment version or provisioning command is implemented in PR68.

A future immutable `scenario-definition@1` should bind scenario ID/version, supported exact Laboratory model, customer requirements/constraints, optional network intents, authored tasks/objectives, allowed operation set, evidence/rubric versions and capability prerequisites. Reference resource aliases must include actual scope/type and resolve to committed IDs, never global name matching. An expected connection records source/destination aliases, protocol/ports and whether Firewall inspection is a business requirement. An architecture reference is not a universal answer.

Start-environment provisioning needs a separately approved, server-authorized, versioned contract. It must validate a trusted typed command manifest against the declared frozen engine and budgets, authorize the owned course/scenario workspace, and execute real commands through the same transaction/revision/idempotency and original-receipt authority. No direct arbitrary JSON World insert is acceptable. Exact command identities, setup actor/provenance, original accepted/denied receipts and the completed setup boundary must be retained. Setup operations are not learner actions or assessment credit. Partial/failed setup must be explicit; no fictitious ready environment or silent reset.

The contract must specify atomicity for the complete setup before activation. Existing individual-command transactions do not themselves guarantee a multi-command scenario transaction. Either an explicitly versioned atomic manifest operation is approved, or a conservative recoverable preparation lifecycle with visible incomplete state and auditable compensation is designed and tested. PR68 promises neither implementation.

A future scenario attempt binds definition/model/workspace/technical attempt, the verified post-setup boundary, immutable first submission, persisted drafts, aid/abandon/retry and original submission through. Evidence refers to actual commands/resources/receipts and read-only analyses at a fixed revision. Rubrics are separately versioned; an architecture observation is not automatic mastery, compliance or XP. Historical results replay against their original definition/rubric/engine.

Scenario reset must be an explicit owned action. It preserves original technical and assessment histories, archives the old attempt and provisions any new start environment through approved real evidence-producing operations. Never overwrite firsts, old receipts or snapshots. Competing tabs, stale requests, command redelivery, interrupted setup, budget exhaustion and unavailable/corrupt evidence fail conservatively.

Before authoring a modernization task, validate it against [the remediation matrix](LABORATORY_REMEDIATION_CAPABILITIES.md). Today create/inspect is much broader than update/delete. State exactly what a learner can change and prove; otherwise a detection exercise must not be sold as an executable modernization task.

Future course-bound server workspaces and versioned course/evidence adapters require owner approval. No AZ-900 v2 migration or reuse of a free anonymous Lab session as certification history is implied.
