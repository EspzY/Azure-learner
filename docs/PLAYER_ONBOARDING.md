# G1.2 — arrival and player orientation

Implemented candidate, 2026-10-24. This document owns arrival, narrative, agency and first-time review; [progression contracts](EXPEDITION_PROGRESSION.md) own the read-only log projection. Human first-time usability acceptance remains outstanding.

## Diagnosis

The L1 baseline has real teaching and technical rules, but the root opens a historical SVG journey, while the RPG presents controls and a service-model objective without explaining the station. The quest HUD ignores Foundations observations. Ida's module action starts walking immediately, and the player has no unified account of what has been introduced, practiced or configured. These are connected orientation defects, not missing visual effects.

## Arrival and purpose

`/` performs one Next server redirect to `/expedition-3d`. There is one game renderer and the existing root provider tree. The old SVG route is `/legacy-expedition`, absent from ordinary navigation. Internal historical travel/query/history stays within that route. Normal logos, home and technical return lead to the RPG. A workbench entered explicitly from the historical journey returns there; this exception cannot capture an ordinary RPG return.

New learners see three brief **manual, skippable** environmental compositions: station overview, people/workshop, infrastructure gateway. Each explains a part of the learning loop; there is no forced timer, player movement, learning observation or reward. **Ta kontroll** skips the remaining views at any point. Reduced motion selects the same shot immediately. The existing asset/context recovery provides equivalent semantic copy and controls. Replaying from the log does not reset pose or teaching; it is presentation only.

Lysningen is a safe fictional first station. A small application team is considering modernization. Ida explains cloud principles and investigations; Noor connects platform responsibilities to a custom web application without guest-OS operations. The brief explicitly says only this station and one bounded workbench are available. The wider professional universe is a plan, not an unlocked game.

After taking control the new learner's first target is Ida. Her welcome connects Foundations 01, responsibility comparison, Noor's requirement, the portal and return. The original mechanism/caveat dialogue, six-unit manuscript and actual simulator remain. The learner can ask about mechanisms, open the journey log or start an investigation. No extra NPC is introduced.

## Agency and wayfinding

The compact HUD shows the selected objective, destination, purpose and expandable log. A small ground marker and an actual distance/direction cue locate the selected place. Neither location nor travel counts as learning. Mobile keeps the destination/next action concise; the full purpose remains in the log.

Selecting a new learning destination opens a choice: **Jeg går dit selv** or **Vis meg veien**. The former changes the target without moving the character; the latter uses the existing collision-aware walking route. Movement keys, held touch controls, Escape or **Stopp gange** interrupt it. No ordinary journey action teleports the avatar. Native compass buttons explicitly labelled **Gå til …** retain the direct assisted-walking alternative. Semantic mode selects the equivalent place without pretending that it rendered physical travel.

Ida's Foundations action explains what the learner will predict, change, observe and justify; it identifies six guided units and a separate changed task. Assisted travel opens the selected investigation on arrival. Manual travel lets the player initiate it with E. The log can be opened from NPC dialogue, a learning session and the technical shell without losing those contexts. Closing a nested log restores the original modal; selecting a different destination explicitly leaves the current activity, preserving validated work.

## Returning and experienced learners

The arrival checks real lesson/story/technical history and a separate introduction preference. Missing preferences never force an existing learner through the new introduction; a valid older saved pose also counts as a visit, without creating learning evidence. A short return account names the actual last unit or unfinished/satisfied technical work; **Fortsett der det gir mening** selects the relevant activity. It does not claim the last experiment was successful. Module re-entry retains draft assessment and valid observations, choosing an unfinished last unit or the next unfinished unit. Technical return uses the established safe gateway pose.

An experienced player can skip the orientation, inspect any available content and select the technical gateway from the log. At the gateway an explicit direct-entry action opens the real workbench without manufacturing service-model answers, quest acceptance or prerequisite mastery. Noor's unfinished/built dialogue reads actual technical findings even for this route. The original guided game quest remains separately satisfiable; the log exposes any unreported requirements honestly.

## Accessibility and review

Semantic buttons, native modal focus/Escape and the existing non-WebGL alternative remain. Dialogue and modal input pause movement. Journal access is preserved in game, dialogue and workbench. Intro text uses readable responsive type, visible focus and a scrollable bounded caption for short landscape; the log keeps its close header visible while scrolling and uses native navigation, lists and expandable sections, not a precision map. No new rendering dependency, texture or effect.

Automated checks must cover redirect/history, no duplicate Canvas, intro skip/replay, no movement on manual selection, interruptible assisted walking, actual module/technical projection, invalid preferences, persisted work, keyboard/touch/reduced motion, fallback and narrow/short-height output. [Project status](PROJECT_STATUS.md) records commands and actual results, not inferred acceptance.

Planned human exercises (not performed):

1. **Azure novice, no external explanation:** arrive, describe AzureLab/Lysningen in their own words, meet Ida, find Foundations, run and explain an experiment, use the log when uncertain, leave/reload/resume. Record every pause, false inference, wrong destination and request for help against the owner's ten orientation questions.
2. **IT-experienced learner:** skip orientation, explain the distinction between Foundations and the practical quest, enter the workbench directly, leave unfinished, resume and identify what was actually demonstrated. Check that the log does not imply mastery from prior XP or skipped material.
3. Review mobile/keyboard/screen reader on physical devices. Reject confusing destination actions, unexplained movement, misleading completion, lost work or a return to the SVG root. Automated browser success is insufficient for these gates.

## First-time review rubric

All human outcomes below are **unperformed**, not passes. Record the participant's explanation, delay/confusion, attempted path, any coaching and an actionable defect. Do not coach before observing the first attempt.

| Owner question                              | Observable human exercise                                     | Automated evidence only                                           |
| ------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| What is AzureLab?                           | Explain the goal and local-simulation boundary after arrival  | Canonical route, visible purpose, one Canvas                      |
| Why Lysningen?                              | Relate the station to the application team's modernization    | Arrival and Ida context exist                                     |
| How do I move/interact?                     | Approach Ida voluntarily and start/close a conversation       | Actual pose movement, proximity, keyboard/touch and focus         |
| Who are Ida/Noor?                           | Describe their different roles                                | Correct attributed dialogue and contextual re-entry               |
| What can I learn here?                      | Name Foundations, service responsibility and practical work   | Six units and one real technical destination, future labels       |
| Where do I start?                           | Find and begin the recommended investigation without coaching | HUD/log/Ida actions and explicit walking choice                   |
| How do the two learning experiences differ? | Explain experiment versus Azure command/receipt work          | Separate store/evidence projection and contextual workbench brief |
| Why the next destination?                   | Explain what concept transfers into Noor's task               | Destination purpose and accepted-task recommendation              |
| How do I recover when uncertain?            | Open the log, find status, choose a useful action             | Native log, selected detail, available goal and journal access    |
| Can I leave and resume?                     | Re-enter after partial work and explain what remains          | Saved events/draft, gateway position and factual return context   |

## Reproducible review walk

Use a fresh isolated browser context for the new-player path; do not clear an owner's personal save. Run `npm run build`, then `npm run test:e2e -- --grep "canonical arrival"` for recorded desktop/mobile reproduction (stop an existing local server first).

1. Open `/`. Inspect the station, people/workshop and gateway views, or take control immediately. Confirm that the player pose and XP did not change during the introduction.
2. Open the active objective's wayfinding, select manual travel and confirm no walking starts. Choose assisted walking, interrupt it, then resume toward Ida. Start the conversation explicitly.
3. Ask about the learning journey. Open/close the log inside the conversation and return to the same beat. Inspect what is playable versus planned.
4. Choose Foundations 01. Read the experiment/recording explanation and choose how to reach it. Follow the complete [L1 learner walkthrough](FOUNDATIONS_01_CONTENT.md#reproducible-learner-walkthrough), retaining theory, wrong-answer feedback and the separate changed task.
5. Review actual evidence in the log, then select the service workshop, compare responsibility and answer its two guided questions. Talk to Noor about the custom-code/guest-OS requirement and accept the practical task.
6. Walk to the physical portal, enter the real workbench and follow [guided Chapter01](CHAPTER_01_GUIDED.md). Exit unfinished first; verify that the log and Noor acknowledge unfinished work. Resume, satisfy actual guided findings, return and discuss them explicitly.
7. Verify that the debrief reports guided work only. Revisit a prior objective and reload; the current pose, valid results and legacy XP remain. No repeat reward, independent Chapter01 claim or future playable region should appear.
8. Repeat with keyboard, reduced motion, a narrow/short screen and the semantic alternative. Use the experienced gateway entry separately; missing prerequisites must remain missing in the log even after technical debrief.
