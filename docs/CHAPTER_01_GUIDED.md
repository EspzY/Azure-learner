# Chapter 01 guided implementation

G1 adds a caller-preserving entry from the physical game portal at `/expedition-3d`. `from=rpg-g1` changes only the return link and leaves all technical/scenario/replay rules intact. [Gameplay architecture](GAMEPLAY_ARCHITECTURE.md) owns the saved game pose, NPC quest and return contract. A satisfied guided result supplies Noor's contextual response; it is not independent or full chapter completion.

Phase 1B.1, 2026-10-23. This focused document owns the implemented technical workspace contract. The full learning target and V01–V16 remain in [CHAPTER_01_BLUEPRINT.md](CHAPTER_01_BLUEPRINT.md); independent transfer, assessment classification, participation award and checkpoint promotion are Phase 1B.2 scope.

## Technical model

`domain/chapter01/model.ts` adds `organization-web@1.0.0` alongside the unchanged legacy simulation. A shared Resource Group name predicate is extracted without changing legacy validation. The frozen guided scaffold contains an identity authority, root/custom management group, App/Shared Sandbox subscriptions, no initial Web resources and one custom assignment at App Sandbox.

Four registered commands create a group, delete an empty group, create a Linux learning plan, or create an app referencing a same-group plan. Resource IDs and revisions advance only on accepted mutations. App OS/location derive from its plan. Group metadata never supplies a Web resource's location. Names, region/profile combinations, uniqueness and active capacity are explicit chapter restrictions, not provider-wide capability or DNS checks.

The custom mode-all policy targets only `Microsoft.Web/serverfarms` and `Microsoft.Web/sites` below `sub-app`, allowing West Europe. Group metadata is excluded by resource type. Denial never inserts the requested resource or changes world revision/ID sequence. Existing resources are not moved/deleted; a separate finding can report noncompliance. Cross-group hosting and cascading deletion are explicitly unsupported, not claims that Azure forbids them. No health, code delivery, traffic, costs or actual deployment are modeled.

Receipts identify command/operation/type/scope, requested or derived region, rule/version, policy witness, before/after revision/count and added/removed IDs. Input, parent/name, dependency/profile, policy and capacity checks have deterministic teaching precedence; this is not Azure's internal evaluation order. Same ID/payload returns the original receipt; conflicting reuse and stale world revisions reject without world mutation. Unknown operations/fields never become generic successful nodes.

`scenario.ts` holds the typed `chapter-01-guided@1.0.0` definition and registered objective evaluators (the guided instance of the blueprint's `chapter-01` family). Responsibility, role bindings, immutable first prediction, receipt/policy inspection, an optional isolated deny probe and structured causal explanations are separate event types. Prediction does not mutate technical state. A prior plan request or probe makes a later prediction post-result; it cannot be relabeled as pre-result. Guided findings are recomputed from current role bindings; they are never latched by selecting a node. A wrong original prediction stays recorded; corrected explanations can satisfy guided practice without rewriting it into independent evidence.

`persistence.ts` serializes only pinned versions, store revision, attempt number and bounded events under `azurelab.chapter01.guided.v1`. It replays rather than trusting stored worlds, receipts, completion or XP. Bad events/references, unknown versions and oversized input return a safe incomplete attempt with a recovery status. Legacy award/expedition stores are not migrated or overwritten. No chapter award exists in this phase.

## Playable learning sequence

The Infrastructure gateway's primary action loads `/explore?journey=1&chapter=01`; the legacy activity stays available as the secondary action and through `/explore`. Both return to the same gateway. The guided world's six objectives are selectable investigation targets, not a locked slideshow. Technical configuration remains permitted independently of whether a task finding is met.

| Learner decision                                          | Validated operation / state                                                       | Observable consequence and explanation                                                                                                  | Recorded understanding                                                                   |
| --------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Carry the earlier service choice into this workload       | Separate responsibility event: model, OS operator and customer-code/access owner  | Feedback explains PaaS fit; mismatched answers keep the objective unmet                                                                 | Assisted responsibility observation; no resource mutation                                |
| Select a subscription, name/lifecycle and metadata region | `CreateGroup`; explicit create-and-bind intent                                    | Group appears under the actual parent; valid Shared Sandbox group receives a requirement mismatch, never a fabricated permission denial | Group role references the actual ID; target scope and metadata checked separately        |
| Predict placement before creating the plan                | First prediction event, outside world state                                       | Original answer remains inspectable even if wrong; no pre-result correctness reveal                                                     | Timing relative to real requests/probes retained; not unaided evidence                   |
| Try a plan in North Europe                                | Actual `CreatePlan` → custom policy denial                                        | Crossed amber footprint outside inventory, receipt/witness, unchanged revision and object count                                         | Receipt inspection plus applicable-policy observation                                    |
| Investigate and correct region                            | Inspect assignment at App Sandbox; `CreatePlan` in West Europe                    | Scope shield and filter explain the cause; accepted compute plates appear, metadata remains Norway East                                 | Current supported plan binding; changing group metadata is not offered as a false remedy |
| Choose app's hosting reference                            | `CreateWebApp`; absent plan rejects, existing same-group plan derives OS/location | App code-window appears with directed violet app → plan edge, distinct from dotted group membership                                     | Actual dependency/configuration checked; no runtime health claim                         |
| Compare locations and explain the repair                  | Location lens plus structured explanation event                                   | Metadata/plan/app values appear in scene and console; wrong causal explanations retain the unmet objective                              | Guided correction recorded separately from original prediction                           |

Purpose → mechanism → Azure-specific nuance/limits → official reference is available in native expandable technical detail. The brief intentionally omits the later allowed-region answer. Policy inspection exposes it when investigating. A learner choosing West Europe immediately can run **Test avvist alternativ isolert**: an actual North Europe request runs on a disposable copy, with a deterministic unused probe name. The resulting receipt is labeled isolated and main-world resources/revision remain intact.

Six registered predicates recompute `guided-built` only when responsibility, target group, pre-result prediction, inspected denial/policy, actual bound plan/app and causal explanation fit. This is **guided configuration satisfied**, not chapter completion, a frozen assessment submission, independent performance, mastery or a promoted journey checkpoint. Zero new XP is awarded; historical legacy XP does not satisfy any new finding.

## Rendering and interaction contract

`projection.ts` maps the same domain world into SVG, XYFlow and a semantic HTML list. The tenant remains an identity authority; root/custom group/subscriptions/groups are scopes. Resources are group members; app → plan is a hosting prerequisite, not containment or network traffic. Solid management, dotted membership, magenta identity and directed violet hosting links differ. The policy shield/amber rejected footprint are annotations, never inventory records. Geometry changes neither location nor technical validity.

Selecting a node focuses/highlights it and exposes its actual relationships/properties. Selecting a relationship inspects its endpoint. The location lens shows group metadata and resource location simultaneously. Native contextual commands submit one supported operation; results create actual scene geometry or a rejected-operation marker, not a fake deployment/progress animation. Receipts remain reopenable in the event tray. Plan and app models have different silhouettes.

Desktop uses a viewport scene and scrolling operational console. Mobile preserves a scene above a scrolling console; horizontally scrollable objective/tool rows remain keyboard reachable. Camera framing uses actual scene aspect, includes the selected app's plan, and provides overview/focus/zoom/yaw/pan. Reduced motion removes camera interpolation without changing state. Small spatial labels may require zoom or the readable inspector/list; close camera angles can crop unrelated objects. No precise dragging is required. Native dialogs retain focus/Escape behavior for reset/deletion.

## Persistence, compatibility and recovery

`GuidedStore` has an injected storage port and stable snapshots. `ChapterProvider` lives beside the two legacy providers, so journey status and technical world share one guided attempt. Save after each valid learning event/command; unsubmitted forms, selected inspector and camera are transient. Derived resources, receipts and findings replay from the frozen fixture and accepted event format; no learner-provided serialized world is trusted.

- **Ordinary exit/reload:** retain the guided log and reconstruct identical technical outcomes; return position is `gateway`. A reopened receipt may default to the latest one.
- **Restart:** explicit confirmation replaces the current guided attempt, increments attempt number, clears its commands/prediction/observations and keeps expedition/legacy awards. Prior guided attempts are not archived in this phase; the dialog explains replacement. Export diagnostic JSON before restarting if needed.
- **Legacy compatibility:** `azurelab.progress.v1` and `azurelab.expedition.v1` are untouched by this store. There is no invented conversion of legacy completion into new chapter evidence. Existing 80/40 deduplication remains authoritative for local participation only.
- **Corruption/unknown version:** quarantine the saved raw data and show an incomplete safe state. Block new technical mutations until explicit compatible restart. No automatic success or reward migration.
- **Stale tab:** storage events and a raw-base check before mutation detect changed saved state. Stop writes, retain current in-memory work and offer local export plus explicit load of the other version. Comparison/write is not atomic; simultaneous races remain a limitation.
- **Denied read/write or size/history limit:** show memory-only/limit status, retain exportable in-memory work and never claim reload durability. Limits are 500 events/commands and 250,000 characters; active world is three groups/16 entities. These are simulator restrictions, not Azure quotas.
- **Explicit all-data deletion:** the progress page's confirmed clear event clears all three categories. No data leaves the browser; exported JSON is diagnostic and has no import/authoritative trust path.

## Reproducible walkthrough

1. Open the journey, use route overview to reach **Infrastrukturporten**, then **Bygg applikasjonsplattformen**. Inspect the brief; choose PaaS, Microsoft for platform OS and customer for code/access.
2. Choose **Ny resource group**. Register `rg-application` in App Sandbox, metadata Norway East. Inspect its actual scope relationship.
3. Choose **Ny App Service plan**. Record both location predictions; an incorrect original answer is allowed and retained. Register `plan-application`, North Europe, fixed Linux learning profile.
4. Inspect the denied receipt: Web type, group scope, North Europe, `allowed-web-location@1`, `policy-location-denied`, unchanged revision/count. Choose **Undersøk gjeldende policy** and inspect assignment/filter/West Europe.
5. Reopen plan configuration, retain the name and change resource region to West Europe. Observe actual plan creation with group metadata still Norway East.
6. Choose **Ny webapp**, name `web-application`, explicitly choose no plan to see a dependency rejection. **Endre konfigurasjon**, choose `plan-application`, register and inspect app → plan versus group membership.
7. Compare **Lokasjoner** and original prediction. **Forklar sammenhengen**: independently placed plan, plan-derived app location, correction of the resource's location. The result is labeled guided only.
8. Return to the expedition, reload and re-enter. Resources/events persist and no new XP appears. Restart the guided attempt: five scaffold objects remain; earlier expedition/legacy awards survive.

## Verification and acceptance-vector coverage

Milestone A was committed after `npm run check` passed (75 Vitest + three docs fixtures). Integration adds store and projection tests and production browser coverage; [PROJECT_STATUS.md](PROJECT_STATUS.md) records the final commands/results and actual visual review. Tests preserve the existing 16 browser cases/assertions. New cases cover the guided loop, wrong subscription, first-correct-region fork, stale tabs, unsupported storage version, reload/reset/all-category deletion, keyboard, reduced motion, mobile/short height and axe. Browser traces/screenshots are reproducible from `npm run test:e2e` under `test-results/` (ignored).

- **V01–V07, V09–V10:** implemented scoped command/receipt/requirement behaviors, tested with positive and negative inputs.
- **V08:** lower-level existing-noncompliance/new-request counterexample tested; the independent transfer fixture/UI is deferred.
- **V11:** shared projection/typed-relation invariants and scene/list/diagram interaction verified; not a claim that independent assessment is equivalent across representations yet.
- **V12/V14:** guided replay/reset, legacy preservation/deduplication and no chapter awards verified; frozen evidence/checkpoint history and new chapter-award/import migration are deferred.
- **V16:** corruption, unknown/oversized versions/logs, malformed references, denied reads/writes, duplicate/stale requests and detected tab conflicts tested. Atomic cross-tab editing is not provided.
- **V13/V15 and full-chapter completion:** independent assistance classification, immutable transfer submission, explicit promotion and checkpoint replay remain Phase 1B.2. No all-V01–V16 completion claim.

## Visual evidence

The screenshots below are real production-browser output, not mockups or a human usability study. Viewport review includes 1440 × 960, 1280 × 720, 412 × 839 and 360 × 780. Source explanations and technical results must also be reviewed by an Azure SME and learners before educational release.

| Desktop                                                                     | Mobile / compact                                                            |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [World entry](screenshots/chapter01-desktop-entry.png)                      | [World entry](screenshots/chapter01-mobile-entry.png)                       |
| [Resource selection](screenshots/chapter01-desktop-group-selection.png)     | [Compact inspection](screenshots/chapter01-mobile-compact-inspection.png)   |
| [Location prediction](screenshots/chapter01-desktop-prediction.png)         | [Plan configuration](screenshots/chapter01-mobile-plan-configuration.png)   |
| [Policy rejection](screenshots/chapter01-desktop-policy-rejection.png)      | [Policy rejection](screenshots/chapter01-mobile-policy-rejection.png)       |
| [Policy investigation](screenshots/chapter01-desktop-policy-inspection.png) | [Policy investigation](screenshots/chapter01-mobile-policy-inspection.png)  |
| [Corrected plan](screenshots/chapter01-desktop-corrected-plan.png)          | [App dependency](screenshots/chapter01-mobile-application-dependency.png)   |
| [App dependency](screenshots/chapter01-desktop-application-dependency.png)  | [Return](screenshots/chapter01-mobile-return.png)                           |
| [Location comparison](screenshots/chapter01-desktop-locations.png)          | [Short-height scene](screenshots/chapter01-desktop-compact-wrong-scope.png) |

Known bounds: one guided fixture, no arbitrary resource update/move/plan deletion, no full Azure Policy/provider runtime, no code/health/network/cost simulation, no account migration or archived attempt/submission/checkpoint, no independent mastery/retention/readiness. Human learning effectiveness, SME, screen-reader and physical-device/performance reviews are unperformed.

## Source and trust boundary

S01/S03/S04/S07/S12/S38 resolve in [SOURCE_REGISTER.md](SOURCE_REGISTER.md). Public Microsoft plan, group and deny-effect documentation was rechecked 2026-10-23. Explanations and exercises are original, reference-only; no lesson, assessment or API response is imported. Local records remain editable/unverified participation, not authenticated proficiency.
