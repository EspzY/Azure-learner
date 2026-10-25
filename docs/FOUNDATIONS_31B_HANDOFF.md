# Phase 3.1B implementation specification — review candidate

2026-10-25. **Do not implement this production plan until separately authorized.** 3.1A preserves the course and adds only an isolated proof. The [storyboard](FOUNDATIONS_31A_STORYBOARD.md), [first-use register](FOUNDATIONS_PEDAGOGY_BLUEPRINT.md#first-use-register) and [visual contracts](VISUAL_LEARNING_SYSTEM.md) together define the instructional specification; no developer should invent abbreviated substitute prose while writing components.

## Scope and concrete integration

1. Keep `/` → `/learn`, official module order, availability and `/portal` inventory unchanged. Add local prerequisite stages within computing, not a new official module or another home page. Canonical new topics use stable `intro-request`, `physical-server`, `virtualization`, `provisioning`, then versioned capacity/responsibility/models/placement/metering/pricing. Old `topic=capacity` stays valid for the preserved v1 lesson/history; an explicit learner action enters v2, never an implicit redirect that changes an in-progress assessment.
2. `src/content/nb.ts`: localize approved S01–13 manuscript, component terms, wrong-answer/causal feedback, journal entries and SavvyShark transitions. Keep original v1 text/keys and independent items for historical playback. Essential explanation is visible beside the model; optional detail adds depth, not missing fundamentals. `src/content/instruction.ts` may adapt beats but cannot emit evidence automatically.
3. `src/features/portal/learning.tsx` `FoundationsWorkspace`: retain v1 presenter; introduce a small v2 explanation/experiment presenter keyed by version, using actual `Course` navigation/provider rather than a parallel application. Reuse full journal and normal focus/history. `src/features/learning/session.tsx` continues serving archived v1; do not mutate the shared investigation semantics accidentally.
4. Build V01/V02/V03/V04 as bounded topic components and V05 as a model-backed timeline. Reuse proof geometry/tokens where human review supports them. HTML controls/table are authoritative accessible presentations; SVG is a synchronized projection. No WebGL, image service, drag-only action or frame loop. Reuse V06 existing reviewed responsibility matrix. Use a finite typed activity registry, not a remote expression/CMS interpreter.
5. Naming breakdown belongs in the actual `CreateResource` in `src/features/portal/create-resource.tsx`, attached to the existing `data-guide="group-name"` field and actual validation, not a mock. Keep course/lab return/session contract unchanged. `src/domain/simulation.ts:40` uses Unicode `L`/`N`; the official table specifically names decimal digits, so do not claim perfect Unicode parity. Resolve that discrepancy through a separately reviewed rule/version decision, not a silent regex change in this phase.

## Suggested bounded contracts

```ts
type TeachingStage = 'explain' | 'worked' | 'predict' | 'observed' | 'compare';
type CapacityInputV2 = {
  fixture: 'worked' | 'campaign' | 'registration-transfer';
  allocated: number; // allowlisted fixture bounds, never executable content
};
type CapacityObservationV2 = {
  contentVersion: '2.0.0';
  modelVersion: '2.0.0';
  input: CapacityInputV2;
  periodIds: readonly string[];
  demand: readonly number[];
  served: readonly number[];
  unused: readonly number[];
  unmet: readonly number[];
};
// Proposed authoring: objective/prerequisiteConceptIds, manuscriptKey,
// termFirstUses, visualKind, fixtureId, feedbackKey, sources, accessibleKey.
```

These are proposed types, not implemented engine claims. Exact allowed allocations and stage events must be pinned with reviewed fixtures before code. Preserve first prediction with fixture/configuration; a later selection marks previous output stale, not silently recomputed. Reset/view/navigation is non-evidentiary. Provider-versus-owned allocation uses the same calculation for equal inputs. No production-domain model update in 3.1A.

The VM teaching calculator must be distinct: host RAM8, integer guest assignments, no overcommit by explicit teaching assumption, reject requested total>8 without mutation. Do not overload workload-bundle units for memory, billing or Azure SKU dimensions. No promise of real VM creation.

## Evidence and migration decision

Do **not** edit the accepted schema/content/model/rubric1.0.0 interpretation of `azurelab.learning.foundations.v1`. Existing progress, first attempts, corrections and awards stay readable as **v1 observations**. Introduce a new isolated candidate `azurelab.learning.foundations.v2` only when a v2 implementation exists, with exact schema and reviewed bounded event replay. Reading preferences can suggest a stage, never transfer completion. There is no automatic equivalence between v1 FC01 and new prerequisite checks. Explicit reset only affects selected version. Retain current all-data-delete behavior plus the new key only after implemented.

Preserve an active v1 assessment on return, including help/first/retry classification. Opting into v2 while that assessment is active must explicitly finish/abandon or record assistance according to its existing contract; never quietly relabel its outcome. Unsupported/corrupt versions quarantine; denied storage stays memory-only; stale tabs stop writes. No server/account/cross-origin migration, imported score, new XP, certification readiness or Chapter01 promotion.

V2 coverage is a vector: authored, teaching available, practiced, first independent criterion, source reviewed, human SME. Do not mark implemented from storyboard rows. First unaided changed-task criteria must be version-pinned, committed before feedback and preserve assistance/retries. Retention is a future later task. Keep Benefits planned; no new Azure services.

## Implementation order and gates

| Increment                        | Deliverable and observable learning                                                    | Verification / human gate                                                                                                                       | Excluded                                                            |
| -------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 0: review                        | Owner selects candidate sequence, unit abstraction, naming bridge and evidence policy  | Beginner/IT/SME exercises in storyboard, record findings/version and disposition                                                                | Production rewrite before authorization                             |
| 1: prerequisite bridge           | Full S01–05 with V01–04; learner distinguishes client/app/host/VM/control request      | Source/manifest/first-use dependency tests, state counterexamples; desktop walkthrough and comprehension review                                 | All cloud services or hypervisor emulator                           |
| 2: capacity                      | S06–07, defined units, worked then novel prediction, executed-run comparison           | Conservation, stale result, prediction-before-result, equal input/equal output, invalid/boundary tests; three desktop sizes and 200% zoom       | Cloud autoscaler, real cost/TCO                                     |
| 3: official objective continuity | S08–12 retains substantial manuscript and all six objectives; separate v2 observations | Existing v1 regression plus new first/help/retry/resume/corruption; content author review and qualified SME                                     | Mastery/readiness/automatic official completion                     |
| 4: practical bridge              | S13 actual naming field and existing group/plan/app lab; exact return/debrief          | Actual valid unprefixed name, duplicate/scope rules, policy correction, receipt/graph invariant; original course/lab E2E                        | New Portal implementation or live resource operations               |
| 5: acceptance                    | Coherent complete module/versioned summary, prior learners keep history                | check/build/production E2E/Axe/docs/assets/curriculum/security; reviewed desktop evidence; true novice changed transfer and human accessibility | Mobile visual programme; retained competence claim from one sitting |

## Risks resolved and questions for review

Suggested next instruction **after candidate review**: “Implement Phase3.1B from the reviewed3.1A commit. Follow S01–S07 and V01–V05 first, using the full approved Bokmål manuscript, explicit units and separate worked/prediction fixtures. Validate with a beginner before expanding presentation. Then integrate S08–S12 while preserving every original official objective and source-backed caveat, followed by S13 in the actual guided Portal form. Keep v1 lessons, active assessments and awards readable and unmodified; implement separately versioned new evidence with reviewed replay/migration tests. Preserve course/lab returns and all technical rules. Benefits, new services, readiness claims and mobile redesign are excluded. Report code checks, desktop screenshots and human review findings separately.”

Resolved engineering boundaries: no inventory duplication, no storage writes by proof, no schema migration in3.1A, native course/lab route contract, no global renderer/animation dependency. Key open **design** decisions: does work-bundle language become clear with the hour illustration; is the prerequisite bridge too long for a novice; does the VM diagram create an overstrong security-isolation belief; do desktop side-by-side explanations split attention; which terms require the learner to articulate versus identify? Test these, not just preference ratings.

3.1B completion requires evidence of actual learner-facing depth, not all boxes ticked in a manifest. If human reviews remain unperformed, release status must say implementation candidate with those open gates. The next prompt should explicitly authorize only the reviewed bridge/capacity and versioned continuity first, preserving all technical/evidence contracts; expand other presenters only after that sequence is comprehensible.
