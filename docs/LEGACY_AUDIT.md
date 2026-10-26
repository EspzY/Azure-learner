# Legacy audit and controlled retirement

Date:2026-10-26. Base:PR15 `91f6cc4b04fbdc5dbcb5c25e3f0a71d2ac79b2b4`, itself stacked on PR14 `ef668244914eab6deaeb7418b7bb18e82225982f`. Remote refs were fetched and matched before creating `codex/legacy-cleanup`. No merge, production deployment or mutation of the two existing PRs is authorized.

## Scope and plan before implementation

The owner explicitly retires the RPG concept and requests one course-based product. Classification is based on routes and actual import consumers, not filenames. Remove retired experiences only after extracting shared logic. Keep original evidence, reducers, model versions and storage bytes unchanged. Old URLs may become fixed compatibility redirects; query parameters must not become external redirect destinations or learning evidence.

| Classification    | System / files                                                                                                  | Evidence and action                                                                                                                                                                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REMOVE            | `features/rpg`, `domain/rpg`, `/legacy/rpg`, `/expedition-3d` game destination, `public/game`                   | Third-person movement, WebGL, NPCs, cinematic shots, audio and orientation belong to the explicitly retired product. No current course requires a game renderer. Remove implementation/assets and game-only tests; provide fixed course redirect for bookmarks. |
| REMOVE            | Living Learning playback, `content/instruction`, `domain/instruction`                                           | Timed beats, voice-free narration, cue choreography and presentation preferences are RPG mechanisms. Current course teaching is explicit HTML/diagrams and does not use timed playback. Preserve shared investigations and curriculum metadata separately.      |
| REFACTOR          | `features/learning/session.tsx`                                                                                 | The current course imports `UnitInvestigation` / `VersionedInvestigation` from the same file as the RPG modal and player-runtime type. Extract these controls unchanged to a learning-owned file; remove only the game session wrapper.                         |
| REFACTOR          | Responsibility matrix in `domain/expedition.ts`                                                                 | Active Portal and Foundations recap use the same pure responsibility rules. Move those exact exports to the curriculum domain, preserving their assertions; retire route/detour/camera state separately.                                                        |
| REFACTOR          | `CurriculumTrail` styles imported from RPG CSS                                                                  | Current Journal/course still require the official source/mapping display. Move the used styles and preserve official metadata assertions. No content objective or assessment is removed.                                                                        |
| REMOVE            | Old SVG journey, organization workbench, scene-only Chapter01 UI, `/legacy-expedition`, `/explore`, `/missions` | Replaced by the actual shared Portal and course. Remove renderers, old navigation and scene-only tests. Keep the Chapter01 command/persistence/scenario contracts consumed by the current sandbox.                                                              |
| REMOVE            | Standalone `/design/foundations-31a` proof and its UI/test                                                      | Reviewed design is already the actual `/learn/computing` v2. Retain documentation history; redirect old proof URL to current course. Extract its capacity model if current v2 imports it.                                                                       |
| PRESERVE          | Course, Foundations v1/v2, Benefits, Service Types, Journal, SavvyShark, guided/independent labs                | Active App Router routes/imports and meaningful current browser coverage. No grading, event, version, award or replay changes.                                                                                                                                  |
| PRESERVE          | `domain/chapter01`, `domain/sandbox`, Portal learning/course/curriculum stores                                  | Current validated commands, frozen legacy-prefix replay, receipts and learning evidence depend on them. A Chapter01 filename is not evidence of dead code.                                                                                                      |
| PRESERVE          | Historical XP ledger and `/progress` read-only history                                                          | Owner requires earlier awards/data to survive. Retain history and explicit data controls; remove links to retired missions/game. Label the historical scope rather than upgrading evidence.                                                                     |
| PRESERVE / REVIEW | Small original simulation/assessment contracts and old raw storage                                              | Shared region/name validation remains active; historic rubric/data semantics must not change. Do not delete or migrate stored data on load. Any further removal of frozen pure contracts needs separate compatibility evidence.                                 |
| REMOVE            | Three/Fiber/type packages and game asset preparation/audio generators                                           | Exclusively used by retired renderer/pipeline. Keep XYFlow (active Architecture Explorer), mascot provenance/validation, current asset checks and all course/security gates.                                                                                    |

Implementation order: extract shared learning/rules/styles; detach root game providers; retire routes/UI/assets/packages; replace game-only tests with retirement/data-preservation coverage while retaining active assertions; update active documentation and mark historical documents as superseded; run complete retained quality suite and inspect the normal preview root.

## Confirmed CI evidence versus inference

PR15 Quality run40294835509, job121478245670, head91f6cc4:86 passed,20 skipped,2 failed. The actual log was inspected.

- `living-learning.spec.ts:136`: spatial synchronized service demonstration cannot find `[data-cue="flow"]` at line163, including retries. This is a retired 3D cue expectation, not a failed Portal command.
- `rpg.spec.ts:99`: first attempt exceeds180seconds in `page.screenshot` at line247; retries expect `from=rpg-g1` after gateway activation but remain at `/legacy/rpg` (line184).

These are confirmed failing assertions/locations. GPU/compositor timing and the reason the cue/transition was absent are **not** proven root causes by the log alone. The cleanup does not claim to repair the old game; it removes the explicitly retired runtime and its exclusive tests. Current equivalents for technical commands, saved work, Journal/source mapping and course navigation must continue to pass.

## Data and review boundary

Retirement does not remove browser storage automatically. Old game/journey/preferences may remain dormant. The existing explicit all-data deletion must still clear its documented categories even after game providers are gone; cleanup of key names is compatibility plumbing, never a migration or award. Original XP IDs, frozen Chapter01 snapshots, Foundations versions, independent help/first/retry records and current resource schemas remain intact.

Architecture/history manuscripts and old screenshots are evidence, not runtime dependencies. Preserve useful historical decisions with a clear retired-status note and correct active entry links. Uncertain future product proposals remain REVIEW; no new curriculum, account system, Azure service or rendering framework is introduced.

Verification results, removed inventory, final branch preview and remaining review items are recorded after implementation in PROJECT_STATUS and the delivery PR.

## Implemented inventory and preserved contracts

116 individually verified retired files were removed after the TypeScript module-resolution audit reported zero retained imports into that inventory. Shared CSS imports were inspected separately; the production build exposed one stale journey import, which was removed and added to the boundary guard. This removes game/NPC/camera/control/audio/onboarding code, SVG travel/detours, old organization/Chapter workbench presenters, standalone proof presenter, preparation scripts, runtime media and nine exclusive E2E files. Fixed redirect-only pages replace the retired entry implementations; there is no old runtime behind them.

Current ownership:

- `features/learning/investigation.tsx`: unchanged original UnitInvestigation/VersionedInvestigation, explicit predictions/probes/answers and causal feedback. The timed RPG wrapper is removed.
- `domain/curriculum/responsibility.ts` + its retained assertions: exact original ownership rules. Localized layer/manuscript copy moves to `nb.learningResponsibility`.
- `domain/curriculum/capacity.ts` + original tests; `features/learning/foundations-visuals.css`: current arithmetic/styles formerly owned by the proof. The pinned model identifier is unchanged. Copy is now named `nb.foundationsVisuals`, without changing its values.
- `features/portal/receipt-panel.tsx` and `receipts.css`: original causal receipt UI/styles used by the current Portal. Frozen `domain/chapter01` remains unchanged.
- `domain/curriculum/official.test.ts`: original metadata/source/status assertions moved from the removed playback test. CurriculumTrail owns its styles, not game CSS.
- `domain/retired-storage.ts`: old UI-provider reset keys only; Chapter01 remains a validated read/import source for SandboxStore. Ordinary loads never purge old keys. Explicit confirmed reset still removes the old categories, preventing their resources being reimported after a reset.

Original `domain/chapter01`, `domain/sandbox`, `domain/course`, `domain/portal`, progression, assessment, simulation and Foundations v1/store files have no diff. A value comparison against PR15 also confirmed unchanged active Foundations/Benefits/Services manuscripts, questions, lab instructions, official metadata and extracted layer explanations. Version2 receives no new observation/rubric/model version. Historical XP history remains at `/progress`, labelled as historical participation rather than current module mastery.

Three direct packages are removed: `three`, `@react-three/fiber`, `@types/three`; the lockfile loses18 entries including renderer-private Zustand, Rapier, meshoptimizer, WebXR typings and animation/helper dependencies. XYFlow and its current dependencies remain. Clean `npm ci` succeeds; `npm audit --json` reports0 vulnerabilities. No new service/package/runtime request is introduced.

## Test retirement policy

Remove only the nine browser files that open the retired game/SVG/proof/workbench: rpg, cinematic, orientation, living-learning, expedition, chapter01, learning, foundations and beginner-proof. Their56 project cases include the original two failures. Existing current `course`, `portal`, `foundations-v2`, `curriculum-expansion`, `practical-labs`, `ux-refinement` and `guided-learning-polish` files remain; their meaningful assertions are preserved. The intentional old redirect assertion now expects the fixed current destination. No new skip is introduced.

The70 net removed unit cases belong to retired gameplay/playback/scene/UI-coordinator contracts. Original capacity, responsibility and official metadata assertions are retained under current ownership. All current deterministic invalid-input, rejection/no-mutation, hosting, replay, migration, aid/first/retry, XP and corruption tests remain. Eight new browser cases exercise safe retired bookmarks, unchanged raw historical bytes and XP, validated Chapter01 resource import/reload, the original Journal/source display, explicit reset/cancel, denied storage and no game/external requests.

`npm run legacy:check` now runs in `check`/CI and rejects current source imports of retired modules, retired direct packages and shipped game media. It is a bounded source/dependency/asset guard, not a general unused-code analyzer or evidence of educational quality.

## Remaining REVIEW items

Keep small original pure scope/simulation/assessment contracts and historical text/source records conservatively: some types/name/region validation remain shared, and deleting frozen semantics is outside this cleanup. Generic shared style tokens are not removed through speculative filename/class-name heuristics. Historical Markdown and screenshots preserve review evidence; they do not advertise a supported second product. Further curriculum/art/UX expansion and human educational/SME/assistive-technology review are separate work, not prerequisites fabricated as passed here.

## Executed local verification — 2026-10-26

- `npm ci`:230packages installed; clean lockfile installation succeeds.
- `npm run check`:strict route/TypeScript, ESLint, formatting,58Markdown/local-link checks,61curriculum tests (subset), current mascot integrity, retired-runtime guard,146Vitest tests/15files,3documentation-validator fixtures and production build pass.
- `npm run test:e2e -- --config .artifacts/31a-discoverability.config.ts`:complete retained suite **43passed,17existing explicit desktop-duplicate skips,0failed**,3.5minutes. This ignored local config changes only baseURL/server port to3100 because an unrelated owner's application uses3000; checked-in CI still runs the unfiltered default suite.
- Includes current root/new Foundations/default/legacy version choice, Benefits, Service Types, SavvyShark brief/real targets, policy/no-mutation/correction, VM/Web/SaaS configuration, dependency/architecture inspection, guided vs independent first/help/retry, exact return, reload/resume, keyboard/reduced-motion, existing narrow/tablet and Axe assertions. The eight new retirement cases also pass on both projects.
- `npm audit --json`:0vulnerabilities;18lockfile entries removed. `git diff --check` passes. Staged secret-pattern/changed-request review is recorded with the final delivery.
- Actual generated screenshots inspected: course/briefing/Service Types at1920, Portal configuration at1440×900 and1366×768, actual graph and debrief. Retained samples: [course entry](screenshots/cleanup-course-1920.png), [real Portal with guide](screenshots/cleanup-portal-1440.png), [exact debrief](screenshots/cleanup-debrief.png). Full local synthetic-data traces/video/screenshots are ignored under `.artifacts/legacy-cleanup-evidence`.

Intermediate failures are not hidden: the first build exposed a stale journey CSS import; a later lint run found an unused variable in a temporary local audit script. Both were corrected before the final green `check`. The first complete E2E run was41passed/17skipped/2failed because a new test used the course's journal label for the historical Journal entry. The test now follows the actual history entry without removing its content/data assertions; all8new cases passed separately, then the full60-case suite passed as above. Existing current-product tests did not fail in those runs.

The original PR15 failures are eliminated from the current suite by retiring the systems they exclusively exercised, not by pretending to fix their GPU/cue behavior. PR14/15 retain their original history/status and are not changed. Protected branch-preview root/commit review and remote CI are reported separately in the new Draft PR; local passing checks alone are not a claim about the deployed commit or human educational effectiveness.
