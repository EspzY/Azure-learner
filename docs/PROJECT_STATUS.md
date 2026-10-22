# Project status

Updated **2026-10-22**. Phase 0.5 is implemented and locally verified on `feat/phase-0-foundation`, continuing [draft PR #1](https://github.com/EspzY/Azure-learner/pull/1) from Phase 0 head `a39e143`. Main remains unmerged; the repository's existing automatic preview integration is authorized. No production deployment or new services are authorized. The PR checks identify the latest remote CI/preview result; local validation below does not assert remote completion.

## Implemented in Phase 0.5

- A complete dark midnight/violet/magenta identity across control room, scene, missions and progress.
- A projected 2.5D scene: explicit x/y/z geometry, elevated platforms, identity beacon, service volumes, branch highlighting, camera yaw/pan/zoom/focus/overview and readable semantic node buttons.
- Scene-first viewport composition with desktop contextual inspector and mobile bottom sheet. XYFlow diagram and HTML list remain equivalent alternatives.
- Integrated mission brief → subscription selection → contextual resource-group command → actual visible new object/connection → sequential original knowledge check.
- Current-attempt HUD, creation feedback, first-time/replay XP distinction, scenario reset and native modal focus/Escape behavior.
- Permanent documentation duties in AGENTS.md; a focused EXPERIENCE_DESIGN.md; required-file/local-link/heading validation in the normal check/CI pipeline, with negative fixture tests.

## Preserved

The original domain simulation, assessment key/scoring, localStorage parser/provider and award IDs/values are unchanged. The same eight initial scopes, three supported regions, three new-group capacity, 80 mission XP and 40 check XP apply. Region remains separate from management hierarchy. Selection/camera changes never earn XP. Original teaching/question content, attribution, source review dates and exam mappings remain in place.

## Verification for this phase

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

## Next

Validate spatial navigation, short mobile/landscape layouts, keyboard and screen readers with learners, then add one deterministic allowed-location troubleshooting scenario and independent assessment. Keep the content catalogue and cloud-service scope bounded. See [ROADMAP.md](ROADMAP.md).
