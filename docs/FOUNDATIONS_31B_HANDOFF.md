# Phase 3.1B implementation specification — review candidate

## 3.2 compatible refinement

The prerequisite sequence, original complete prose, Foundation v1/v2 observations/rubrics and technical lab remain. Default responsibility visual is a focused three-incident physical/data/identity recap; the full operational matrix now belongs to Module3. This fixes cross-module comparison writes without migrating or reinterpreting historical records. The last course step now connects to available Benefits before Service Types; direct Portal entry from the existing resource bridge remains supported. Current content ownership is in [the progression audit](MODULE_01_02_03_PROGRESSION_AUDIT.md). Historical specifications below retain their original review record.

## 3.1B implemented handoff — supersedes candidate hold below

The owner explicitly authorized this phase on2026-10-25. It is an **actual course implementation candidate**, with human educational/SME acceptance still open. The earlier proposed design remains historical specification, not a description of missing functionality.

### Route and component mapping

| Entry                             | Before                                | Current                                                                                                                                                                                                  |
| --------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                               | Redirect `/learn`                     | Same redirect, single shell/providers                                                                                                                                                                    |
| Computing module entry / no topic | Capacity-first `FoundationsWorkspace` | `FoundationsV2`, browser/shop explanation and adjacent request diagram                                                                                                                                   |
| New topics                        | Only in isolated proof                | `intro-request`, `physical-server`, `virtualization`, `provisioning`, `capacity-basics`, `v2-capacity`, `v2-responsibility`, `v2-models`, `v2-placement`, `v2-metering`, `v2-pricing`, `resource-bridge` |
| Original topic links              | V1 lesson                             | Explicitly labelled v1 lesson, intact original store/rubric                                                                                                                                              |
| Assessment / summary              | V1 only                               | V1 remains; separate `v2-assessment` / `v2-summary`                                                                                                                                                      |
| `/design/foundations-31a`         | Promoted candidate                    | Noindex archive; temporary landing promotion removed                                                                                                                                                     |
| Portal group form                 | Name + validation hint                | Same field/command + advisory `rg`/workload/environment explanation and technical-rule distinction                                                                                                       |
| Guided lab return                 | Service-types practice                | Same original return, or allowlisted computing bridge origin with exact activity                                                                                                                         |

### Implemented storage and evidence contract

`azurelab.learning.foundations.v1` is not migrated or reinterpreted. Existing users see a version choice on new-course entry. Resume v1 preserves its active task/draft. Starting v2 explicitly states that new theory during an active v1 task is help; the old attempt is neither erased nor reclassified as a v2 attempt. Old deep links continue intentionally. No cross-origin Vercel-save migration is claimed.

The separate v2 record pins schema2, content/model/rubric2.0.0, version choice and at most600 finite events/220000 characters. Restore replays, never trusts imported completion. Compare-before-write stops stale tabs; corrupt/unsupported input is quarantined, denied writes warn/memory-only. Reset is version-scoped; global deletion clears the provider. Selection/resume/route is not competency evidence.

Meaningful events: request trace; physical part inspection; requested guest RAM (accepted allocation derived, rejection retains prior); supported/unavailable provisioning illustration; campaign prediction+allocation committed together; causal answers; later five original practice events through a v2-owned evaluator. All later full manuscripts remain. Guided completion needs demonstrations and correct explanations, not reading/navigation. The host-budget model is not the Azure command engine. Synthetic meters/prices remain explicitly incomplete; provider selection does not manufacture capacity.

Assessment2 has11 criteria: changed registration peak/unused intervals/same-allocation cause, finite host and original cloud/responsibility/deployment/consumption/pricing criteria. Registration demand1/7/4/2 at5 produces peak2 and unused4/0/1/3. Drafts restore; all answers commit before feedback; first/help/retry remain separate. No XP, Chapter01 completion, retention, exam readiness or SME approval.

### Reproducible real-product walkthrough

1. Open the branch preview root, enter Describe cloud computing. A new learner immediately sees the browser/shop scenario, not a glossary or capacity result.
2. Send the illustrative request, inspect its direction and answer the server-side calculation question. Try the incorrect option and read the causal response.
3. Inspect CPU/RAM/storage/network/OS/application. Explain working memory versus persistent files.
4. Assign VM A5 and B3 within host8, then request B4: requested9 is rejected, accepted5+3 stays. This is an explicit no-overcommit teaching assumption.
5. Compare procurement/control and shop traffic. Request supported and unavailable teaching capacity; no Azure operation occurs.
6. Read the invented work/hour unit and2/6 worked example. For new campaign3/3/8/3 predict peak before Run. Change6→10, predict/run again; old output is stale until executed. Compare actual snapshots and explain unused versus unmet.
7. Continue through all five retained official-objective investigations, including the same responsibility model, offsite-private counterexample, allocation/time units and pricing caveats. Summary distinguishes introduction and guided practice.
8. Open the resource bridge and start the real guided Portal lab. Search, create a valid unprefixed group such as `teamA`, inspect naming advice, encounter actual North Europe Web-policy rejection, inspect the receipt/policy, choose correction, create allowed plan/Web App, inspect hosting in live architecture.
9. Return to the exact computing bridge debrief; names/results are derived from actual inventory. Reload/Back/Forward retains context and valid work. Unfinished exit remains unfinished.
10. Attempt the separately labelled changed registration task. All11 answers are committed together before feedback; opening theory/journal during it records help. Revisit v1 deliberately to compare preserved historical evidence.
11. Open preview build information from learning footer: compare its SHA/branch with the delivered commit and stable Vercel branch alias. Authentication gates are not application passes; never change protection.

### Remaining validation boundaries

Desktop1920×1080/1440×900/1366×768 is primary. Existing mobile regressions remain, no dedicated new mobile system. Actual commands/results/screenshots belong to PROJECT_STATUS; this specification alone does not claim tests passed. Human beginner/IT/SME/assistive review and retention remain required. Benefits/new services/accounts/live APIs and production release are excluded.

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

## 3.1B.1 refinement plan — 2026-10-25

Before implementation, actual1920/1366 production-build captures confirmed: nested split columns make responsibility unnecessarily tall; v2-wide has no layout behavior; topology repeats prose without showing users/boundaries; navigation is after all content; guidance uses one ring and first-matching target regardless of semantics; rationale is hidden; completed lab still uses the unfinished resume label.

Bounded plan: (1) Course/FoundationsV2 choose existing explanation/model, full-width comparison or readable theory composition; (2) ResponsibilityExplorer retains authoritative ownership and shows selected layer plus changed owners together; (3) deployment visualization uses original SVG/HTML boundaries and a location-only private toggle, with semantic relation equivalents; (4) typed coach target intent/context gates actual action versus inspection resolution, no coordinates or automatic commands; (5) authored objective/why/action/expected-result remain visible, hint optional; (6) one persistent desktop navigator reserves measured space and focuses actual new content, preserves history and assessment drafts; (7) debrief labels derive from existing labFacts; (8) verify domain/content, production UI/keyboard/Axe, old progress, full relevant regressions, three desktop sizes and exact Vercel root/SHA.

No new persistence, curriculum module, simulator command/rule, asset, dependency, backend, AI or mobile redesign. Human visual/learning/accessibility acceptance stays separate from implementation checks. This plan records intent; PROJECT_STATUS will record actual delivered behavior and results.

## 3.1B.1 implemented refinement

The existing v2 route, content/model/rubric and store remain unchanged. `FoundationsV2` gives the responsibility and deployment comparisons full width instead of nesting a second split grid. Other lessons retain their task-specific paired visual/prose layouts. Full purpose/mechanism/Azure/example/misconception/limitations/terms remain below each model; all investigations and assessment evaluators are reused.

`ResponsibilityExplorer` uses the original nine-layer matrix and concrete service examples. Active service and layer are explicit, the same layer can be compared across three models and affected rows are marked with a textual change list. Core explanation is adjacent; existing service-specific depth remains visible in a full-width context row beneath the comparison. Inspecting/comparing has its original aid/participation semantics, never new mastery.

`CloudDeployment` is original local SVG/HTML with native buttons/checkboxes and a text equivalent. Public shows two separate customer usage relations to one provider platform; private changes host location while retaining exclusivity/classification; hybrid can expose/hide an illustrative integration requirement. No network, identity configuration or resource state is simulated by this view. Its controls are temporary presentation, not new saved learning events.

`CourseNavigation` replaces the old bottom links with one fixed desktop bar. A ResizeObserver reserves its actual height for both course content and the preview build footer in their shared learning surface; activities focus their committed heading below the sticky header after navigation/history. Exact lab/debrief anchors retain priority. Mobile retains a normal-flow bar. Assessment drafts, first-submission/help rules and old deep links are unchanged. Last activity can continue to the existing summary/course overview without completing it. Finished labs use a secondary revisit action and distinct teaching continuation; unfinished lab resume remains.

Reproduce: `/` → Describe cloud computing → responsibility → change service/inspect a layer → deployment models → move private offsite/inspect hybrid requirement → Next/Previous at document bottom → practical bridge → start real lab → inspect group/denial/policy → correct plan/app → inspect hosting → exact debrief → continue teaching. Use the same route after reload. See [actual verification](PROJECT_STATUS.md) and [guidance semantics](GUIDED_SANDBOX_ENGINE.md).

Exclusions: no new curriculum, rule, assessment, XP award, store/schema, service, media asset or dependency; no 3D/mobile redesign. Human beginner/SME/educational and owner visual acceptance are separate outstanding reviews.
