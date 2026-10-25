# Local curriculum and evidence architecture

## 3.2.1 operational activity bindings

Existing curricular manuscripts/manifests and conceptual evidence are retained. Added bounded `labDefinitions` map ST01–ST04 to versioned technical models, rubrics, source records, supported commands and explicit exclusions. Bokmål operational copy is `labsNb` in the canonical nb.ts. The [qualitative matrix](FUNDAMENTALS_LAB_COVERAGE.md) separates theory, conceptual experiments, operational practice and changed tasks. Structural validation does not promote human SME status. Existing completion rules remain unchanged; new lab evidence is a separate event record, without XP or Microsoft completion.

## 3.2 implemented curriculum records

The current first path contains computing, benefits and services in official order (metadata reviewed2026-10-25). The new [manuscripts](CLOUD_BENEFITS_CONTENT.md) and [Service Types deepening](SERVICE_TYPES_DEEP_LEARNING.md) precede the presentation implementation. `nb.expansion` is the learner-facing manuscript, terms, instructions, assumptions, misconception feedback and assessment items. `expansion-content.ts` links CB01–CB05/ST01–ST04 to existing competencies and reviewed source IDs B10–B14/T10–T23. Its integrity check verifies sections, required experiments, source links, objective-to-assessment mappings and orphan content/items; this does not prove instructional adequacy or human review.

Benefits content/rubric1.0.0 and operational Service Types content/rubric2.0.0 use model1.0.0 and separate schema1 event records. Each unit exposes prerequisite→mechanism→Azure example→worked example→assumptions→experiment→causal result→reasoned application. The summary reports introduced and guided observations separately from changed-context first/help/retry submissions. A guided Portal result is not independently assessed by merely reading it. Human SME and learner-study fields remain null. Legacy service content/evidence remains v1; no automatic reinterpretation or migration.

## 3.1B implemented content/evidence2.0.0

Current course consumes `v2Bindings` in `domain/curriculum/foundations-v2.ts`: topics, S01–13, visuals, B01–B05/FC01–FC07/G01 and sources. `nb.foundationsV2` owns the complete prerequisite manuscript, causal checks and changed items. Later units preserve every purpose/mechanism/Azure/example/misconception/limit paragraph and term. The proof is no longer the delivery mechanism.

`azurelab.learning.foundations.v2` pins schema2/content/model/rubric2.0.0. Replay recomputes observations; imported success flags are invalid. V1 stays separate. Request/inspection/memory/provision/capacity/check events distinguish exposure, action and explanation. The later evaluator runs only on v2-owned events. Assessment answers are drafted then committed together; first/help/retry remain. No XP/readiness/retention/SME status. [Handoff](FOUNDATIONS_31B_HANDOFF.md) specifies compatibility.

## 3.1A candidate, not a curriculum migration

The isolated `/design/foundations-31a` proof uses localized copy, inline original SVG and a pure `domain/design-proof/capacity` calculator. It imports no learning-store hooks or command dispatch and is not registered as a curriculum activity. Existing root providers restore their stores; no new key/version/evidence/XP is written. Candidate prerequisite IDs B01–B05 do not become implemented official objectives. [Handoff](FOUNDATIONS_31B_HANDOFF.md) proposes explicit v1 preservation and separately versioned future observations; no mapper or v2 store exists yet. [Audit](BEGINNER_LEARNING_AUDIT.md) separates substantive authored coverage from inadequate beginner scaffolding.

## Course-first refinement — 2026-10-25

ServicesWorkspace and FoundationsWorkspace are reused directly in course routes, preserving full manuscript/investigations. Versioned guide definitions bind objective/source IDs, expected context, semantic targets, observable actions, validators and return to original nb.ts explanations/reasons/hints. UI observations guide presentation; replayed resources/receipts and validated inspection references determine guided satisfaction. Resume preferences are not evidence. [Guide architecture](GUIDED_SANDBOX_ENGINE.md) owns this bounded adapter, not a CMS.

## Portal service-types extension — 2026-10-24

The Portal reboot retains the six-unit foundations manuscript, evaluators, evidence and storage. `domain/portal/content.ts` maps ST01–ST04 to original sections, three justified guided cases, changed criteria and dated primary sources. `validateServiceContent` rejects missing/orphaned teaching, incomplete objective bindings, absent feedback, assessment bindings and invalid source records. `curriculum:check` runs this alongside prior integrity tests. Browser tests separately verify the declared activities; structure alone proves neither instructional completeness nor SME review.

The new `service-types@1.0.0` record stores deliberate comparisons, model-plus-reason decisions, assessment start boundary/technical attempt number, assistance, draft and submission references. It reconstructs the selected technical prefix from shared receipts. Old/missing attempt history cannot certify a new build. First answers and help remain distinct from retries; no XP/mastery/readiness is derived. [Manuscript and objective map](PORTAL_LEARNING_EXPERIENCE.md) and [state contract](PORTAL_SANDBOX_ARCHITECTURE.md) own this extension; historical content architecture remains below.

## G1.3 metadata overlay and narrative delivery

The local hierarchy and 30 competency IDs are unchanged. domain/curriculum/official.ts records reviewed credential/path/module identity and explicit many-to-one mapping of six original investigations to the official eight-unit cloud module; no official lesson body is imported. UI uses exact English titles from nb.official with Bokmål explanation. Benefits is planned, service types partial. Local guided results do not claim Learn completion. Every existing purpose/mechanism/Azure/example/misconception/limit sentence is delivered by a versioned unit sequence as well as the journal; integrity tests compare the full manuscript, not word quotas. Sequence cursor/demo preferences are separate from replayed evidence. [Sequence engine](INSTRUCTIONAL_SEQUENCE_ENGINE.md) specifies implementation.

## G1.2 navigation consumes content evidence

The Expedition Log reads learningFacts and existing Chapter01/story predicates; it cannot complete units or author its own rubric. Six unit states and seven objective observations remain distinct from journey destinations. Module re-entry retains active changed-task drafts and an unfinished last unit or next unfinished unit. Opening the log is orientation; journal/instruction assistance rules remain unchanged. [Progression](EXPEDITION_PROGRESSION.md) owns selection/persistence. The L1 manuscript, evaluators, source-review status and all existing teaching depth are preserved.

L1 / version 1.0.0 / 2026-10-23. This is a bounded local curriculum implementation, not a CMS or universal lesson interpreter. [Standards](CONTENT_STANDARDS.md), [first manuscript](FOUNDATIONS_01_CONTENT.md) and [coverage audit](CURRICULUM_COVERAGE.md) have distinct responsibilities.

## Hierarchy and ownership

Competency track → learning region → chapter → module → unit → teaching/practice/assessment activity. The existing 30 IDs remain capabilities, not lesson IDs. `F01` spans several modules; `F03` supplies consumption/capacity outcomes. Certification mappings are dated overlays. No exam code is a parent content identifier.

`src/domain/curriculum/manifest.ts` is the typed, versioned local manifest: hierarchy, objectives, prerequisites, activity bindings, source records and separate author/source/SME statuses. `src/content/nb.ts` owns original manuscripts, terms, worked examples, dialogue, feedback and journal labels. `src/domain/curriculum/foundations.ts` owns the pure bounded teaching model, validation and objective-level observations. React presents those results; the 3D scene is a projection, never an assessment source. Existing Azure command/rule/receipt systems remain unchanged.

## Contracts

Each unit declares objective IDs, required concepts/terms, source IDs, prerequisite unit IDs, teaching/practice/assessment activity IDs, manuscript key and explicit limitations. An explicit activity registry (not generated from declared promises) binds an allowlisted interaction kind to an implemented evaluator/presenter; no arbitrary remote scripts, HTML or learner code executes. The integrity gate checks unique IDs, valid hierarchy/prerequisites, no cycles, required objective coverage, source/review records, complete manuscript sections, assessment items/explanations and orphan/missing activity bindings. It cannot evaluate prose quality or certify that a renderer teaches effectively; browser and human review remain separate.

Coverage is a vector, not one percentage: referenced, authored, teaching implemented, practice implemented, assessment available, source cross-checked, human SME reviewed. Learner evidence adds introduced, practiced, guided-correct and first independent criterion outcome. Availability is not learner performance. Historical RPG/Chapter observations are never upgraded to new-module evidence.

## Sequence and replay

The six unit sequence uses stable IDs and registered deterministic activities. Learners may inspect/revisit any unit. Guided completion requires each unit's actual experiment witnesses and correct application response; merely advancing dialogue cannot satisfy it. The separate changed-context assessment can be entered before instruction by an experienced learner. All answers are committed together before feedback. Unsubmitted bounded answer drafts are replayed on resume and cannot create submitted evidence; the changed shortfall is a constructed integer (0–40), not a multiple-choice recognition item. In-attempt journal/instruction access marks assistance. First submissions remain immutable; later submissions are retained as retry practice, not freshly independent evidence. Guided completion and assessment completion remain separate. No L1 XP or exam-readiness output is introduced.

The isolated `azurelab.learning.foundations.v1` save pins schema/content/model/rubric versions, position and bounded allowlisted events. Restoration replays events and recomputes observations/results; stored success flags/scores are rejected. Invalid/unknown versions are quarantined, never silently promoted. Denied storage uses memory with a warning; stale-tab conflicts stop writing until explicit recovery. Reset affects this module only; existing all-data deletion includes the new key. The four older stores/schemas and awards are untouched. There is no implicit migration from G1 dialogue completion. Future content-version migration needs an explicit reviewed mapper and tests; unsupported versions currently require explicit reset.

## Journal and contexts

One shared, semantic journal supports unit navigation, terminology, mechanism, examples, misconceptions, limitations and source links. It opens over the current route/dialogue without navigating away, restores focus and retains current game/workbench state. Opening it while an independent attempt is active records assistance. Reading alone earns no observation of practice or competence. WebGL failure retains the same local content and controls; the journal can always be read without the Canvas.

The RPG module is entered explicitly through Ida or the installation. Existing G1 service-model dialogue/quest remains a connected follow-up. The teaching installation projects capacity/demand or responsibility state; synthetic geometry does not create Azure resources. Root journey/workbench journal access is context-preserving. No database, credentials, Learn API, analytics, external font or runtime content request is required.

## Extension boundary

New reviewed units can reuse manuscript/journal/evidence contracts and register a bounded presenter/evaluator. Networking, identity or operations require their own validated models; the capacity model must not impersonate them. Future accounts would synchronize versioned local attempts with server authorization and provenance, not trust imported local scores. Organizational membership and confidential data remain out of scope.

The renderer shows a neutral installation while the changed task or summary is active; an earlier guided plot must not imply the new task's state or reveal its prediction. Returning to study restores the current unit's actual recorded probe. Draft answer events are bounded, validated and non-evidentiary.

Browser storage is origin-scoped. Different Vercel preview domains do not automatically share saves; no cross-origin import, account synchronization or learner identity is introduced.
