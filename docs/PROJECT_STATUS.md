# Project status

Updated **2026-10-23**. Phase 1A.5 implements the Azure Expedition on `feat/phase-0-foundation`, continuing [draft PR #1](https://github.com/EspzY/Azure-learner/pull/1) from Phase 1A blueprint commit `fde59291f0cd341df4b32be8f446f9b57128f70c`. Main remains unmerged; only existing automatic branch previews are authorized. No new infrastructure or production deployment.

## Phase 1A.5 — playable expedition

- Root is a continuous perspective journey, selected over constellation and layered-descent alternatives. Curved main-route travel, lateral detours, overview, revisits, interruption cancellation, history positions and exact gateway return are actual navigation state.
- Interactive eight-layer IaaS/PaaS/SaaS responsibility teaching has four directly accessible explanation depths, native owner/layer controls, service-specific caveats and official references.
- Two versioned original checks use different reasoning: service fit from requirements and multi-select retained SaaS responsibilities. Wrong/correct attempts have specific feedback, scene response and retry/return. Both are guided, award zero XP and do not establish independent competence.
- One major portal explicitly loads the existing organization world. Existing simulation, assessment and 80/40 XP rules are unchanged; new groups/edges are real state. Journey position, submitted answers, mission activation and accepted resource commands survive exit/reload through validated replay. Explicit deletion clears both learner stores; scenario reset retains historical awards.
- Future networking, operations and architecture landmarks are visibly unavailable. No full Chapter 01, new service simulator, independent transfer/mastery/readiness calculation or integration is implied.
- [JOURNEY_EXPERIENCE.md](JOURNEY_EXPERIENCE.md) contains the design evaluation, implemented contracts, walkthrough, sources, screenshots and limits. Affected continuity documents are updated; docs:check now requires this document and its negative fixture.

### Phase 1A.5 verification

Executed locally on Windows / Node 24.18.0. Final verification results are recorded below after the complete documentation/screenshot pass; earlier failures exposed and corrected noninteractive return-link inheritance, an accessible-name mismatch, streamed SVG hydration duplication, a test that escaped before world entry, retained console scroll between stops, and a race where immediate navigation could precede saved-position reconciliation. Travel/portal/return intents now persist before routing. Tests were retained; the legacy reload assertion now verifies nine persisted objects rather than eight reset objects, and the storage test explicitly waits for world loading.

| Check                                                 | Actual result                                                                                                                                                          |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`, `npm run lint`                   | Passed strict checking and zero-warning lint                                                                                                                           |
| `npm test`                                            | 48 Vitest tests + three documentation fixtures passed; route/camera/rules/attempts/corruption/replay/XP covered                                                        |
| `npm run build`                                       | Passed production build, all preserved routes                                                                                                                          |
| `npm run test:e2e`                                    | 16 production Chromium cases passed (27.8 s), including compact viewport/camera interruption, full journey and legacy regressions, axe, keyboard and reduced motion    |
| `npm audit --json`                                    | Registry audit passed with zero vulnerabilities after retry outside restricted network sandbox; lockfile/dependencies unchanged                                        |
| Formatting, docs validation, staged secret/diff check | npm run check and final docs/format passed; staged whitespace and secret-pattern scans passed (54 files, no matches), with no runtime fetch/XHR/WebSocket/beacon calls |

No clean reinstall was needed because manifests/lockfile are unchanged; CI runs `npm ci`. No unintended external app requests or page errors were observed by the full journey/legacy browser tests. Public Microsoft documentation research and npm audit are development-time requests; runtime remains same-origin only.

### Review and limitations

Fourteen screenshots across 1440 × 960, 1280 × 720, 412 × 839 and 360 × 780 were inspected as actual rendered evidence, not a learner usability study. Human Azure SME, screen-reader, physical-device, low-end performance and learning-effectiveness reviews are unperformed. Known bounds: one route/one world, assisted checks, no general scenario interpreter; unsubmitted/partial legacy quiz answers and current inspector/camera are transient; local tab sync is best-effort, not collaborative/authoritative. Historical portal completion can remain lit after a new practice reset, without completing the new attempt. Existing organization-world labels can crop at close mobile camera angles; list/diagram/overview remain available.

Next: review the expedition, then implement Chapter 01's scope/geography prediction, plan/app dependency, filtered policy failure/correction, changed independent transfer variants and explicit checkpoint promotion. Keep the existing route/portal loop and legacy regression coverage. Phase 1C extracts wider reuse only after chapter/authoring evidence.

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
