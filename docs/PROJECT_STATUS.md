# Project status

Updated **2026-10-22**. Phase 1A delivers product/learning architecture for review on `feat/phase-0-foundation`, continuing [draft PR #1](https://github.com/EspzY/Azure-learner/pull/1). The running application remains Phase 0.5 at `db02abf`; no chapter/platform runtime implementation was added. Main remains unmerged; automatic branch previews through the existing integration are authorized. No production deployment or new services are authorized.

## Phase 1A — blueprint ready for review

Inspected README/engineering contract, architecture/decisions/learning/experience/security documents, domain and assessment functions, Workbench/renderers/content, local progression, tests and retained desktop/mobile output. The [Phase 0.5 Linux CI run](https://github.com/EspzY/Azure-learner/actions/runs/39849585882) was confirmed successful during this phase. That confirms defined software behavior, not educational effectiveness.

Seven new documents establish the proposal:

- [PRODUCT_BLUEPRINT.md](PRODUCT_BLUEPRINT.md): four alternatives, selected hybrid model, current implementation critique, experience architecture and professional demonstration rubric.
- [LEARNING_JOURNEY.md](LEARNING_JOURNEY.md): stable competency units/dependencies, nine domains and nine specialist tracks, beginner/experienced routes, evidence distinctions and credential-neutral mapping strategy.
- [EXPERIENCE_PATTERNS.md](EXPERIENCE_PATTERNS.md): twelve learning patterns with actions, state/observations, technical basis, evidence, representation and accessible equivalents.
- [SIMULATION_PLATFORM.md](SIMULATION_PLATFORM.md): six boundaries, narrow serialized contracts, rules/receipts, authoring, replay, checkpoint isolation, local migration and future trust boundaries.
- [CHAPTER_01_BLUEPRINT.md](CHAPTER_01_BLUEPRINT.md): first complete chapter with five connected outcomes, responsibility/scope/configuration interactions, controlled failure, two independent transfer variants, five criteria, promotion and V01–V16 acceptance vectors.
- [EXPERIENCE_BLUEPRINTS.md](EXPERIENCE_BLUEPRINTS.md): references A's canonical chapter specification; details B's private-access diagnosis using A's world and C's constraint-based architecture with explicit synthetic arithmetic and human review.
- [SOURCE_REGISTER.md](SOURCE_REGISTER.md): current official references, original-content/reference-only boundary, observed revisions/credential status and stale-review policy. AZ-204/AZ-500 retirement and AI-200/SC-500 scope are verified independently of core competency IDs.

Existing Markdown is updated where affected; canonical contracts replace superseded future-schema sketches, while implemented behavior and historical decisions remain distinct. AGENTS.md permanently gates Phase 1B on blueprint review and requires learning/action/state/evidence specifications. The existing docs checker now requires all seven blueprint documents, and its fixture test covers missing/empty mandatory Phase 1A files.

### Phase 1A verification

Executed on Windows / Node 24.18.0:

| Check                                                     | Actual Phase 1A result                                                                                                                                                 |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format` / `npm run format:check` within check    | Passed                                                                                                                                                                 |
| `npm run check`                                           | Passed strict typecheck, zero-warning ESLint, formatting, docs validation, unit tests and production build                                                             |
| `npm run docs:check`                                      | 19 Markdown documents and required/local links/headings/images passed                                                                                                  |
| `npm test` within check                                   | 30 existing Vitest tests + three documentation fixture tests passed; mandatory Phase 1A files covered by the fixture test                                              |
| Read-only Node blueprint sanity script                    | 30 competency units have known acyclic prerequisites; 51 source identifiers/references resolve; C's stated synthetic cost/capacity/recovery arithmetic assertions pass |
| `git diff --check` and runtime/dependency diff inspection | Passed; no changes under src, browser tests, package manifest or lockfile                                                                                              |

The staged `git diff --cached --check` passed, and the staged private-key/token/connection-key pattern scan found no matches. The read-only sanity script checks document consistency, not an implemented Azure engine. No new UI/learning behavior is implemented; Chapter 01 V01–V16, B/C outcomes, performance budgets and all human learning/SME/accessibility reviews remain specifications, not executed scenario tests. E2E/axe, fresh screenshots, clean installation and dependency audit were not rerun locally: interactions/dependencies are unchanged. Historical Phase 0.5 evidence below is kept separate. The PR's normal CI runs its own checks after push; this table does not claim their result for a future commit.

### Review decisions and risks

Owner review must precede full Phase 1B implementation. Confirm the hybrid journey/checkpoint model, bounded Chapter 01 scope and open-book independent evidence approach. Validate potential objective overload, transfer discrimination, multi-lens orientation, browser/local-storage conflicts and model fidelity with the planned human reviews. B/C's synthetic network/recovery/cost fixtures need their own source/model/SME validation before implementation. No learner study, external Azure validation, full mastery model or certification-readiness algorithm has been performed.

Next: review the blueprint, then authorize a bounded Phase 1B task using CHAPTER_01_BLUEPRINT.md and its test vectors. Phase 1C refactors only after that slice and authoring evidence. The current app and its known limitations remain below.

## Implemented in Phase 0.5

- A complete dark midnight/violet/magenta identity across control room, scene, missions and progress.
- A projected 2.5D scene: explicit x/y/z geometry, elevated platforms, identity beacon, service volumes, branch highlighting, camera yaw/pan/zoom/focus/overview and readable semantic node buttons.
- Scene-first viewport composition with desktop contextual inspector and mobile bottom sheet. XYFlow diagram and HTML list remain equivalent alternatives.
- Integrated mission brief → subscription selection → contextual resource-group command → actual visible new object/connection → sequential original knowledge check.
- Current-attempt HUD, creation feedback, first-time/replay XP distinction, scenario reset and native modal focus/Escape behavior.
- Permanent documentation duties in AGENTS.md; a focused EXPERIENCE_DESIGN.md; required-file/local-link/heading validation in the normal check/CI pipeline, with negative fixture tests.

## Preserved

The original domain simulation, assessment key/scoring, localStorage parser/provider and award IDs/values are unchanged. The same eight initial scopes, three supported regions, three new-group capacity, 80 mission XP and 40 check XP apply. Region remains separate from management hierarchy. Selection/camera changes never earn XP. Original teaching/question content, attribution, source review dates and exam mappings remain in place.

## Phase 0.5 verification — historical baseline

Executed on Windows / Node 24.18.0:

| Command/check                            | Actual result                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `npm ci`                                 | Clean lockfile installation passed; no dependency changes                                                                      |
| `npm run check`                          | Passed: strict route/type checking, ESLint with zero warnings, formatting, documentation gate, unit tests and production build |
| `npm test` (within check)                | 30 Vitest tests and three Node documentation-fixture tests passed                                                              |
| `npm run docs:check` (within check)      | All 12 Markdown documents, required files and local links passed                                                               |
| `npm run test:e2e`                       | Eight production Chromium cases passed: four desktop and four Pixel 7 mobile                                                   |
| axe scans (within E2E)                   | Zero violations in tested scene, inspector, brief/command, geography, diagram/list, assessment and supporting routes           |
| `npm audit --json`                       | Zero reported vulnerabilities across the locked dependency tree                                                                |
| Source/diff and secret-pattern review    | No secret findings or unintended runtime network clients; domain, progress provider and lockfile unchanged                     |
| Request assertions in full learning loop | Zero external requests and zero page errors on desktop/mobile                                                                  |

The browser suite verifies invalid/duplicate commands, visible new geometry and its connection, node focus, correct/incorrect assessment feedback, persisted 120 XP, reset/replay without repeat awards, query-linked briefing on reload, camera rotation/focus/overview, keyboard modal boundaries/Escape, reduced motion, storage corruption/denial and explicit data deletion. Tests caught and corrected a diagram pointer-target issue, modal Tab wrapping and the reopened briefing on mission-link reload; assertions were retained.

Phase 0 remains the verified baseline: 26 domain tests, six Chromium E2E cases and the first two Linux CI runs passed. The redesign extends that coverage instead of disabling assertions or accessibility rules.

## Visual review evidence

Actual production screenshots were inspected at **1440 × 960** and **412 × 839** CSS pixels. Reviewed the dimensional scene, subscription selection, command, visible created group/80 XP, control room and mobile assessment results. The final mobile HUD was compacted after review to expose the selected geometry. No horizontal document overflow was found in tested routes. Screenshots contain deterministic test data only.

| State                        | Desktop                                       | Mobile                                          |
| ---------------------------- | --------------------------------------------- | ----------------------------------------------- |
| Control room                 | [Hub](screenshots/desktop-hub.png)            | [Hub](screenshots/mobile-hub.png)               |
| Spatial scene                | [Scene](screenshots/desktop-scene.png)        | [Scene](screenshots/mobile-scene.png)           |
| Selected subscription        | [Inspector](screenshots/desktop-selected.png) | [Bottom sheet](screenshots/mobile-selected.png) |
| Mission command              | [Command](screenshots/desktop-command.png)    | [Command](screenshots/mobile-command.png)       |
| Created group + actual award | [Result](screenshots/desktop-created.png)     | [Result](screenshots/mobile-created.png)        |

Compare with the [Phase 0 baseline](screenshots/phase-0-before.png). Before: a flat diagram, article panels and form/quiz below. Now: a projected world with camera focus, contextual actions and observable state changes in one scene. This supports discovering relationships and applying them before expanding technical explanations.

## Boundaries and limitations

No Azure calls/resources, backend, authentication, database, Learn API client, analytics or new cloud setup. The original optional metadata adapter remains design-only. Preview publishing is through the pre-existing owner-approved Vercel integration; main/production are untouched.

The 2.5D renderer is a bounded schematic, not a physical model of Microsoft infrastructure or a general Azure simulation engine. Orthographic depth and distances do not describe geography or capacity. Geometry is intentionally simple; no WebGL/3D runtime or GPU fallback is needed. SVG foreignObject/native-dialog compatibility still needs broader browser and assistive-technology review.

Scenario/camera/current-attempt state is ephemeral. Only completion IDs persist locally; they are editable and best-effort across tabs. No multi-device sync, authoritative competence record, mastery/readiness calculation, English curriculum or additional Azure modules. Automated accessibility scans do not replace human screen-reader/touch testing.

## Documentation changed

README.md, AGENTS.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, LEARNING_DESIGN.md, DECISIONS.md, ROADMAP.md, SECURITY.md and this status file are maintained with the redesign. EXPERIENCE_DESIGN.md is new. MICROSOFT_LEARN.md and stable competency source records remain unchanged because no external integration or curriculum scope changed. Reviewed screenshots live under `docs/screenshots/` and raw test artifacts remain ignored.

## Baseline follow-up, incorporated into the new roadmap

The earlier scope/region follow-up is expanded into the connected Chapter 01 specification. Preserve the outstanding navigation, short-height/mobile and human screen-reader reviews as Phase 1B gates; do not call them completed because the blueprint exists. See [ROADMAP.md](ROADMAP.md).
