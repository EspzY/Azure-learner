# G1.2 — expedition progression and log

## G1.3 presentation-only additions

Exact official path/module titles now accompany the original local route; Lysningen remains the location and future path modules are honestly planned/partial. The log's evidence projection and all recommendation predicates are unchanged. Auto speech, skipped teaching, replay/history, visual cues and audio never create model/probe/answer/accept/report observations. Only deliberate existing actions do so. A separate presentation preference adds reading/music choices, not a seventh learning store. [Instructional engine](INSTRUCTIONAL_SEQUENCE_ENGINE.md) owns this distinction.

Implemented candidate, 2026-10-24. [Player onboarding](PLAYER_ONBOARDING.md) owns narrative and first-time UX. This is an orientation projection over existing evidence, not another quest engine or curriculum catalogue.

## Current route and availability

Recommended beginner route: welcome/Ida → Foundations 01 (six existing investigations, FC01–FC07) → IaaS/PaaS/SaaS responsibility workshop → Noor's application requirement → Infrastructure World → Noor debrief. Learners can select another available goal at any time. Selection changes wayfinding only; experienced direct entry never synthesizes prerequisites.

Only **Lysningen**, its real installation/two characters and the existing **Infrastructure World** are playable. The log's world overview groups the 30 stable competency IDs into future networking, compute/application/data, governance/security and operations/automation/architecture directions. Those entries have no fake links, completion flags or interactive gateways. App Service/scope/policy coverage within planned groups is explicitly the narrow existing subset. The log does not change the curriculum's granularity or certification overlay.

## Authoritative projection

`domain/rpg/expedition.ts` computes `expeditionFacts(learning, story, attempt)` from validated stores:

| Input                               | Projection                                                                                                                     | Never inferred                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| LearningSave replay / learningFacts | Six unit observations, actual last/next unfinished unit, separate submissions/help/draft and seven objective evidence rows     | Visits as practice, guided answers as independent competence |
| RPG storyFacts                      | Comparison, latest guided challenge result, accepted assignment, explicit report still supported by current technical findings | Acceptance as configured infrastructure                      |
| Chapter01 currentStage / findings   | Six current technical predicates, unfinished attempt, guided-built state                                                       | Full Chapter01 transfer or checkpoint promotion              |
| Legacy progress ledger              | Existing participation XP displayed separately                                                                                 | Prerequisite satisfaction, mastery or exam readiness         |

Statuses are **available**, **in progress**, **guided completed**, with unit **not started/introduction only/practice awaiting response** and separate first unaided or assisted changed-task observations. Orientation is always available, not a completed competency. An accepted assignment is in progress; after actual guided findings and an explicit report it is guided completed. A direct technical report never fabricates an acceptance observation. First unaided submission is reported as an assessment event, not blanket success: the expandable objective view retains each criterion's actual outcome. Unsubmitted drafts never become assessments. Planned content is unavailable, not locked by XP.

Recommendation priority: actual unfinished technical attempt → unreported satisfied guided findings → accepted assignment (remaining service reasoning or portal) → unfinished Foundations → service comparison/challenge → Noor acceptance → technical gateway → debrief. An explicit selected goal overrides the recommendation, including revisits. Meeting Ida clears the initial welcome target. Closing a satisfied guided activity clears its target; entering again from a built technical return recommends debrief. Selecting an available or completed destination never changes its evidence. The next recommendation is visible in the log even while following another goal. Technical work includes a responsibility observation before the first resource exists. Reset removes current findings and changes the projection; it cannot erase historical legacy awards.

The session resumes an unfinished last unit, otherwise the next incomplete unit. An active changed-task draft remains its own mode. The existing report observation now permits an explicit debrief of actual guided-built findings even without preliminary service/acceptance observations. It does not supply those missing observations; their statuses remain separate. Event/schema IDs and old data remain compatible. The log contains no copied score/completion state. Merely opening it, moving, choosing a goal, skipping or replaying an arrival produces no learning observation or XP. Journal/theory access during an active assessment still follows L1's help rules.

## Persistence and transitions

The five existing keys/schemas/replay contracts remain. A sixth, non-evidentiary preference key **azurelab.orientation.v1** stores exactly schema 1, seen:boolean and goal:allowlisted ID|null, capped at 500 characters. Runtime validation rejects unknown versions, extra keys and invalid goals. Invalid records are quarantined; denied/conflicting writes retain only in-memory preferences with a warning. Compare-before-write stops a stale tab from silently overwriting another preference. The explicit all-data deletion also removes this key while the RPG is unmounted. No migration of educational completion is required or performed.

Gateway entry saves the existing safe return context before transition. `/explore?chapter=01&from=rpg-g1` returns to `/expedition-3d?return=chapter01`; exiting does not complete an objective. Ordinary direct workbench return goes to the RPG. The historical `journey=1` origin alone opts into `/legacy-expedition?at=gateway`. A log goal selected from another route travels through an allowlisted `?goal=` presentation request, which the player confirms at arrival and the receiver then consumes with replace; reloading cannot reapply a stale query goal. It is not an Azure command or evidence import.

The shared log is available from game header/HUD, NPC and module surfaces, and the ordinary technical shell. Closing restores context/focus. Selecting another goal stops navigation and closes the current presentation; underlying stores remain. The scene reads only the selected target for a marker/distance cue and a transient arrival shot index. Frame rate, animation and marker proximity cannot award learning.

## Limits and acceptance

This is one station's route guidance, not a universal adaptive curriculum scheduler, completed diagnostic-placement system or multiplayer/account feature. Local evidence is editable and origin-scoped. Short screens require log scrolling; future hardware/accessibility/human comprehension studies remain outstanding. Validate real objectives, unfinished returns, direct entry, replay/resume, reset, invalid storage and XP invariants alongside actual screenshots. See [project status](PROJECT_STATUS.md) for executed verification.
