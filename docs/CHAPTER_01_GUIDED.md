# Chapter 01 guided implementation

Phase 1B.1, 2026-10-23. This focused document owns the implemented technical workspace contract. The full learning target and V01–V16 remain in [CHAPTER_01_BLUEPRINT.md](CHAPTER_01_BLUEPRINT.md); independent transfer, assessment classification, participation award and checkpoint promotion are Phase 1B.2 scope.

## Milestone A — verified technical model

`domain/chapter01/model.ts` adds `organization-web@1.0.0` alongside the unchanged legacy simulation. A shared Resource Group name predicate is extracted without changing legacy validation. The frozen guided scaffold contains an identity authority, root/custom management group, App/Shared Sandbox subscriptions, no initial Web resources and one custom assignment at App Sandbox.

Four registered commands create a group, delete an empty group, create a Linux learning plan, or create an app referencing a same-group plan. Resource IDs and revisions advance only on accepted mutations. App OS/location derive from its plan. Group metadata never supplies a Web resource's location. Names, region/profile combinations, uniqueness and active capacity are explicit chapter restrictions, not provider-wide capability or DNS checks.

The custom mode-all policy targets only `Microsoft.Web/serverfarms` and `Microsoft.Web/sites` below `sub-app`, allowing West Europe. Group metadata is excluded by resource type. Denial never inserts the requested resource or changes world revision/ID sequence. Existing resources are not moved/deleted; a separate finding can report noncompliance. Cross-group hosting and cascading deletion are explicitly unsupported, not claims that Azure forbids them. No health, code delivery, traffic, costs or actual deployment are modeled.

Receipts identify command/operation/type/scope, requested or derived region, rule/version, policy witness, before/after revision/count and added/removed IDs. Input, parent/name, dependency/profile, policy and capacity checks have deterministic teaching precedence; this is not Azure's internal evaluation order. Same ID/payload returns the original receipt; conflicting reuse and stale world revisions reject without world mutation. Unknown operations/fields never become generic successful nodes.

`scenario.ts` holds the typed guided definition and registered objective evaluators. Responsibility, role bindings, immutable first prediction, receipt/policy inspection, an optional isolated deny probe and structured causal explanations are separate event types. Predication does not mutate technical state. Guided findings are recomputed from current role bindings; they are never latched by selecting a node. A wrong original prediction stays recorded; corrected explanations can satisfy guided practice without rewriting it into independent evidence.

`persistence.ts` serializes only pinned versions, store revision, attempt number and bounded events under `azurelab.chapter01.guided.v1`. It replays rather than trusting stored worlds, receipts, completion or XP. Bad events/references, unknown versions and oversized input return a safe incomplete attempt with a recovery status. Legacy award/expedition stores are not migrated or overwritten. No chapter award exists in this phase.

At this milestone the model/scenario/replay core is implemented and unit-tested; the interactive chapter UI and browser persistence coordination are not connected yet. Actual milestone commands: strict TypeScript passed; 75 Vitest tests plus three documentation fixtures passed. Remaining verification is recorded in [PROJECT_STATUS.md](PROJECT_STATUS.md) as integration proceeds.

## Source and trust boundary

S01/S03/S04/S07/S12/S38 resolve in [SOURCE_REGISTER.md](SOURCE_REGISTER.md). Public Microsoft plan, group and deny-effect documentation was rechecked 2026-10-23. Explanations and exercises are original, reference-only; no lesson, assessment or API response is imported. Local records remain editable/unverified participation, not authenticated proficiency.
