# Course Hub and learning navigation — PR32

## Scope and design decision

Verified base: `db09932a6105cbfa75bcfbb0dfa12a8a0bd813a6`, remote `codex/activate-desktop-ci`. This is a presentation/navigation change, not a new course engine, learning contract or teaching revision.

Actual production rendering on the base was inspected at1440×900 and1024×768. The first combined Cloud Concepts syllabus began at y2186 and y2393 respectively, below repeated Compute, Networking A/B, Cost, assessment, mission and lab promotions. The first page did not communicate the three-part AZ-900 structure. Existing Networking root images provide additional historical context, not current verification.

Two composition directions were considered:

1. A single continuous module index, with three section headings and inline activities. This is compact and searchable but makes the first view another long list, with weak distinction between the three learning areas.
2. Three equal learning-path cards under one start/resume action, with a module directory inside each path. Activity lists belong to the module and contextual sidebar. This establishes the whole course map on the first screen without repeating teaching descriptions or forcing earlier lessons.

Direction2 is selected. The three paths are parallel areas of one Azure Fundamentals journey. The first module remains Cloud computing; unimplemented modules are explicit, noninteractive planned content. The header keeps Sandbox and Journal as secondary destinations. The sidebar opens the active path/module and allows deliberate expansion of other paths and activities. Networking A/B appear under one module, while their URLs, stores and results remain separate. Core Architecture retains its A/B activity sequence and separate history.

## Progress and safety

The existing Course resume chain remains authoritative: active independent contexts take priority over ordinary saved location. Practical mission continuation is included using its existing origin. Navigation metadata never creates evidence. Counts describe existing guided observations only; they are not objective coverage, mastery or certification progress. Opening a module is a saved position, never completion. Unknown, unavailable or conflicted records suppress progress/resume claims and expose scoped reload/review destinations. The existing ManagementTeachingBoundary and Journal preflight remain intact.

No learning key, parser, rubric, answer, receipt, Sandbox World, command, XP or SavvyShark mechanism is changed. Existing content remains byte-preserved except separately appended interface copy. Full desktop CI and the ten justified compact witnesses remain mandatory; new UX cases extend that baseline. The legacy complete profile remains available. Browser evidence, scoped tests and independent audit results will be recorded before delivery. Vercel access remains separately blocked unless legitimately available; no merge or production deploy.

## Owner comparison and browser evidence

| View          | Before on verified base                                  | New production rendering                                                                          |
| ------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1440×900      | [First viewport](screenshots/course-hub/before-1440.png) | [First viewport](screenshots/course-hub/hub-1440x900.png)                                         |
| 1024×768      | [First viewport](screenshots/course-hub/before-1024.png) | [First viewport](screenshots/course-hub/hub-1024x768.png)                                         |
| Opened module | Separate long module navigation                          | [Networking B and its exact active step](screenshots/course-hub/navigation-networking-b-1024.png) |

The new path cards begin at y458 and y444 in the two comparison sizes, with all three path headings and first module links visible. This replaces the old combined-syllabus entry at y2186/y2393; it does not claim every activity fits above the fold. At1024×500 and800×700 normal vertical scrolling remains intentional. The primary action stays visible; a compact PC window has an explicit course-menu toggle. No mobile product work was added.

Personally inspected production frames also cover [1920×1080](screenshots/course-hub/hub-1920x1080.png), [1366×768](screenshots/course-hub/hub-1366x768.png), [800×700](screenshots/course-hub/hub-800x700.png) and [1024×500](screenshots/course-hub/hub-1024x500.png). Browser tests exercise keyboard collapse/expand, exact deep links, focus and scroll, reduced motion, Axe, Sandbox return, conflicts, corrupt records, durable Journal help and denied help. All15 independent contexts have exact root-resume coverage without metadata assistance or evidence writes; existing non-completing visit/version-choice events are allowed only after explicit navigation.

The approved baseline grows from150 to156 desktop cases while all ten compact witnesses remain. CI therefore executes166 cases. The optional complete desktop/Pixel7 plan contains312 (the original300 plus the same six new cases on each project). Plan validation still checks exact identity, no lost desktop cases, explicit compact witnesses and worker1. Neither collection nor screenshots alone are credited as full CI or independent learning validation.

## Preservation boundary

`src/domain/`, existing learning/Portal components and providers, command/inventory/receipt code, all existing manifests/items/sources/rubrics, assets, package/lockfile and both Playwright configs remain byte-identical to the verified base. `src/content/nb.ts` retains its entire original teaching/assessment prefix; only a separate Course Hub interface-copy export is appended. Existing E2E changes address replaced promotional-panel selectors, the new explicit path expansion and new observation labels; existing technical, assessment, assistance and persistence assertions remain. No new skips, retries, timeout increases or dependencies.

No new teaching, question bank, source review, measured learning result, human usability/SME/screen-reader acceptance or full mobile-device validation is claimed. Public availability remains separately blocked by Vercel SSO and absent project-settings access. No merge or production deployment is authorized or performed.

The final short-lesson refinement keeps an already-visible activity heading in place while focusing it. Offscreen headings still scroll into view. The active path and module remain available in the sticky sidebar; the exact active step is visible. Additional actual frames: [Core B navigation](screenshots/course-hub/navigation-core-b-1440.png) and [CSS125% zoom at1024×768](screenshots/course-hub/hub-zoom-125.png). The latter passed Axe and had no horizontal document overflow; it is CSS zoom evidence, not a claimed native-browser zoom or screen-reader study.

## Concrete independent-audit corrections

PR32-01: a conflicted guided v2 record initially left an old observed marker in expanded sidebar activities even though the Hub correctly withheld progress. Sidebar observations now use the same full ready/no-issue history condition as the Hub. The regression proves a valid guided marker, a newer cross-tab record, removal of the stale marker and progress claim without overwriting newer bytes, and reappearance only after explicit reload.

The audit also identified a pre-existing release incompatibility: the strict validator only recognized the legacy `npm run test:e2e` label despite owner approval of the guarded desktop command. The validator now also accepts freshly executed `npm run test:e2e:desktop` evidence bound to the candidate fingerprint and tested SHA. Plans, selectors, pending results, historical scope and wrong fingerprints fail. The optional legacy command remains accepted.

CI's browser execution line invokes `scripts/verify-desktop-ci.mjs`. This wrapper owns exactly the complete guarded command, with no selectable arguments. It preserves failure/signal and emits no receipt on failure. Only its own child exit0 replaces the candidate verification entry in runner `current.json`, binding actual checked-out git revision and stamped fingerprint; then the existing strict release step runs. This mutable verification field is already outside the implementation fingerprint. It does not alter sources, review, selections, browser install, retries, skips, timeouts, workers or artifact handling. The receipt records browser execution, not a premature claim that the subsequent release/entire CI passed. A GitHub synthetic merge revision is reported as tested revision; workflow head SHA separately identifies the delivered PR head.

Before that CI execution, local strict preflight must honestly report the missing candidate full-profile evidence; implementation audit may accept while delivery stays pending. Historical base160 never substitutes for candidate166. Final delivery requires the actual full candidate suite and strict release to complete in GitHub CI. This prevents a duplicate full local run or a metadata-only commit/rerun just to label a not-yet-executed suite passed.

The corrected [conflict rendering](screenshots/course-hub/conflict-progress-withheld.png) was personally inspected: the expanded sidebar no longer displays stale guided evidence. Resume corrections additionally ensure all independent contexts precede guided continuation, guided practical/mission continuation precedes an ordinary saved page, an isolated active guided practical session is labeled Continue, and an active original v1 assessment remains resumable after choosing v2. No saved choice, old event, first attempt or rubric is reinterpreted. Exact guided PaaS routing retains its existing `lab=web-platform` parameter.

## First complete CI attempt and root-lab correction

[Initial candidate run41057739758](https://github.com/EspzY/Azure-learner/actions/runs/41057739758) on `7b901da559d9d35952daafd8f21622d479379a02` was cancelled at the unchanged35-minute deadline after repeated waits for removed Cost promotional text and lab links now inside a collapsed path. It did not complete166, emit a passed candidate receipt or run strict release. This was a real failed delivery attempt, not a passed or still-pending run.

The omitted common test entrances now follow the real module row and explicitly expanded Cloud path. The original lab link labels and hrefs are retained within the secondary directory. The original root's explicit `choose v2` action is also preserved only on an actual current-lab click; extracting the links had lost that callback. Expanding the path does not select a version. The genuine-v1 regression now proves exact current-choice/old-learning/chapter bytes before the click, current v2 choice after it, and unchanged historical bytes after real lab/reload. No saved result/rubric/XP or resource command is migrated or reinterpreted.

All21 previously affected original Cost/Portal/practical/quality cases passed locally in2.5m, process exit0 without retries. All original technical, assistance, first/history and guidance assertions remain; the new shared discovery helper adds an exact original-href assertion. Earlier four complete Cloud Computing/Benefits/Service Types/Serverless journeys also passed in2.8m. Neither focused run substitutes for the complete corrected166-case GitHub CI. No timeout/retry/skip increase or assertion weakening was used.
