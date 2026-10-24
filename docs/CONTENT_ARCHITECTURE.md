# Local curriculum and evidence architecture

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
