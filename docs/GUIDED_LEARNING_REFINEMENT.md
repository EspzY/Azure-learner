# Guided learning refinement — audit and implementation plan

Review date: 2026-10-26. Status: implemented in the ordinary course; executed checks and outstanding review gates are recorded in PROJECT_STATUS. This changes the ordinary course and shared Portal, not a separate review route.

## Audit

Module 1 introduces a mechanism beside an explanatory model before asking for a prediction. Benefits and Service Types retain substantive manuscripts and deterministic investigations, but several figures compress the mechanism into generic rectangles. The availability figure does not clearly distinguish unreachable capacity from failed capacity. The SaaS figure does not explain the separate license, role and sharing relationships. Practical entry currently starts a session immediately; task, purpose and completion criteria are scattered between the lesson and coach. The practical coach names a broad task but does not consistently explain the current action and its expected observation.

## Selected implementation

1. A purpose-built, native-modal SavvyShark mission briefing precedes explicit guided start. It explains purpose, learning outcomes, major stages, observations and model boundaries. Cancel is presentation only. Resume does not repeatedly interrupt; learners can reopen the mission. Independent work keeps its existing unassisted requirements and receives no solution highlights.
2. The contextual coach presents action, reason and observation separately, deriving its phase from real navigation, form state and validated findings. Informational inspection uses a quieter treatment than an actionable target. Mission recall is user initiated; no repeated automatic milestone popups.
3. Replace generic experiment figures with task-specific SVG/HTML explanations: routed application capacity, dependency diagnosis, scoped policy evaluation, template propagation, capacity-hours, VM components, managed hosting and SaaS access. Configuration previews remain distinct from results computed only after explicit experiment submission. Keep the original manuscripts, rules, assessments and evidence.
4. Improve supported resource inspection with a contextual navigation column, Essentials, working parent/dependency links and clear configuration-only status. Do not add unsupported operational controls.
5. Verify the normal root/course/lab/return path on a production build and the final branch preview. Inspect desktop captures at 1920×1080, 1440×900 and 1366×768. Structural checks and screenshots do not establish learning effectiveness or human Portal fidelity acceptance.

## Internal Portal reference comparison

The owner supplied two real Portal screenshots for internal review only. They and their infrastructure information must not enter the repository.

| Reference feature                                | Existing match / gap                                                                                                                | Educational consequence and scoped response                                                                                          |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Home global search, favorites/service navigation | Shared search and service navigation already work                                                                                   | Preserve actual discovery controls; do not imitate unsupported services with dead buttons.                                           |
| Home service discovery and recent resources      | Supported services and real history exist; empty state is sparse                                                                    | Keep supported discovery and make resource discovery explicit, without fabricating history.                                          |
| Resource-specific navigation beside Essentials   | Existing contextual column already works; properties expose opaque parent IDs and related inspection sits outside the resource pane | Retain the contextual navigation; integrate readable linked scope/dependency properties and related inspection in the resource pane. |
| Linked disks, network and configuration          | Actual VM bundle and hosting dependencies exist                                                                                     | Expose the real related objects and keep relation meanings distinct.                                                                 |
| Command bar / settings / monitoring / security   | Only a bounded subset is modeled                                                                                                    | Keep supported actions functional. Explicitly exclude power state, guest access, monitoring, IAM and live security claims.           |

No pixel-perfect, Microsoft-affiliated or measured parity claim is made. New artwork, dependencies, runtime services and simulation schema changes are unnecessary.

## Learning and state boundaries

Benefits CB01–CB05 concern capacity versus availability, diagnosis/recovery, governance, management consistency and resource efficiency. Service Types ST01–ST04 concern operating boundaries, VM dependencies, platform compatibility and ready-made software administration. Practical labs are bridges to these objectives, not complete proof of the official module. Existing source mappings remain in [supplementary reading](FUNDAMENTALS_SUPPLEMENTARY_READING.md), [benefits manuscript](CLOUD_BENEFITS_CONTENT.md) and [service types manuscript](SERVICE_TYPES_DEEP_LEARNING.md).

Briefing visibility, camera-free visual presentation and resource navigation are never learning evidence. No store version, XP rule, domain command or assessment rubric is replaced. All learner-facing copy is authored in src/content/nb.ts. Human novice/IT learner review and qualified SME review remain outstanding.

## Implemented visual contracts

| Investigation            | What the learner changes / sees                                                                | Meaning and preserved validation                                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Availability · CB01      | Number/size of copies, failure and routing; working, failed and unselected paths               | Capacity counts only along reachable working copies. The explicit prediction precedes served/unmet results. No SLA is calculated.                      |
| Reliability · CB02       | Incident and proposed remedy beside the application/dependency chain                           | Only the existing correct remedy removes the causal failure marker after Run. The trend is labelled authored observations, not telemetry.              |
| Governance · CB03        | Request scope/location versus a fixed Web-policy assignment                                    | Applicability and requested configuration are separate. The existing unsaved engine-fork receipt decides acceptance; no security/permission guarantee. |
| Manageability · CB04     | Independent region choices or one parameter source feeding three configurations                | Consistency can propagate a wrong standard. The existing evaluator retains that counterexample. No real template is deployed.                          |
| Sustainability · CB05    | Required and selected active-hour lanes; capacity × copies × hours                             | Existing allocated/served/unmet/unused capacity-hour results remain, not measured energy, emissions or prices.                                         |
| IaaS · ST01              | Host cutaway with guest OS, allocated CPU/RAM, separate disk and NIC                           | Native controls expose the existing six prerequisite checks. No guest deployment or performance is inferred.                                           |
| PaaS · ST02              | Customer artifact crosses a platform compatibility boundary; retained config/access/data below | Unsupported package/driver shows a failure mark only after evaluation. Compatibility is not cured by more capacity.                                    |
| SaaS · ST03              | Person → account/license → product; separate authority and sharing branches                    | License is not administrator authority; modeled denied access is visible after Run. Departure explanation preserves data-sharing caveats.              |
| Service selection · ST04 | Requirement and three operating boundaries                                                     | Existing scenario/reason evaluator decides the match. No universally best category or new mastery measure.                                             |

The existing shared responsibility explorer is reused rather than duplicated. Full introductory, mechanism, Azure, example, limitations and misconception manuscripts remain. Native controls, descriptive captions and result text provide an accessible equivalent; color and arrows are not the only information.

## Reproducible review

1. Open the branch preview root. Choose **Describe the benefits of using cloud services**, then availability. Read assumptions, predict and run; compare failed single routing with reachable redundant copies.
2. Use **Åpne relevant praktisk visning** for an inspection-only brief, or **Start praktisk lab** for the full VM exercise. Cancel once: no session or evidence should be added. Explicit Start opens the actual Portal; the contextual coach explains reason/action/observation.
3. Create a group and VM through the existing native controls. Compare dry Review with the accepted receipt, then follow VM/OS-disk/NIC links. Inspect and justify before returning to the exact practical activity. Reload and resume; recall the mission without restarting.
4. From Service Types open PaaS practice. A new environment uses the existing group → policy denial → policy inspection → corrected plan → app flow. Existing web work receives a settings-specific mission. Inspect actual settings and hosting/management/location relationships, then debrief.
5. Open SaaS practice. It explicitly enters a separate fictional admin lab. Encounter the real license rejection, correct configuration and justify customer responsibilities. Replays preserve earlier submissions and do not issue XP.
6. Start an independent changed-context task: no automatic mission solution, coach or highlights. Existing first/help/retry classification remains authoritative.

For human review, give a novice and an experienced IT learner these objectives without step-by-step coaching. Ask why they entered each lab, which observations support the concept and what the simulator cannot prove. Record wrong turns, unexpected focus, unclear controls and mistaken mastery claims as defects. These exercises have **not** been performed by human participants.

## Executed verification — 2026-10-26

- `npm run check`: strict TypeScript, ESLint, formatting, documentation/local links (57 files), curriculum subset (67 tests), registered assets, Vitest (216 tests /24 files), three documentation fixtures and production build passed. No dependency changed, so reinstall was not required.
- Production-built broad browser regression: `npx playwright test --config .artifacts/31a-discoverability.config.ts tests/e2e/guided-learning-polish.spec.ts tests/e2e/practical-labs.spec.ts tests/e2e/course.spec.ts tests/e2e/curriculum-expansion.spec.ts tests/e2e/portal.spec.ts tests/e2e/foundations-v2.spec.ts tests/e2e/ux-refinement.spec.ts` — **35 passed,17 explicitly skipped desktop duplicates** in the mobile project.
- After final visual label/composition refinement, `npm run check` passed again and the affected `guided-learning-polish`, `practical-labs`, `curriculum-expansion` production browser suites passed **15 tests /11 explicit desktop-duplicate skips**. Existing assertions remain; explicit briefing confirmation was added at intentional launch points.
- Axe, keyboard/reduced-motion, real target geometry/mount/resize, actual invalid/valid operations, denial/policy correction, architecture, unchanged legacy bytes/XP, interrupted/replayed labs and exact course return/reload are exercised. Brief cancel/recall asserts unchanged local stores. Independent tasks retain no automatic guide/highlights. External runtime requests are asserted absent.
- `npm audit --json`: zero vulnerabilities. Common private-key/GitHub-token/AWS-key pattern scan: zero matches in the patch; staged review and `git diff --check` accompany final delivery. These are bounded checks, not security certification.
- Earlier runs found and corrected a contrast/style collision, dialog placement, duplicate dependency links and premature test locators during hydration. A strict phase-key type error and an overly broad test-confirmation insertion were corrected. Failed intermediate runs are not counted as passes.
- Local browser traces/videos are generated under ignored test-results and retained locally. Normal root navigation and exact deployed branch/SHA must additionally be inspected on Vercel; remote evidence is recorded in the Draft PR and delivery, not inferred from local tests.

## Inspected desktop evidence

Implementing-agent inspection, not owner/learner visual acceptance. All nine final figures were inspected; representative 1920×1080,1440×900 and1366×768 output was compared. Existing [availability](screenshots/32-availability.png) and [SaaS](screenshots/32-saas.png) captures show the earlier generic treatment. Current generated AzureLab evidence:

- [Mission1920](screenshots/guided-briefing-1920.png), [minimum-desktop mission](screenshots/guided-briefing-1366.png), [PaaS mission](screenshots/guided-paas-mission-1920.png), [SaaS mission](screenshots/guided-saas-mission-1920.png).
- [Availability1440](screenshots/guided-availability-1440.png), [SaaS relationships](screenshots/guided-saas-1920.png), [service boundary comparison](screenshots/guided-selection-1920.png).
- [Actual Essentials/dependencies](screenshots/guided-resource-inspection-1920.png), [actual policy denial](screenshots/guided-policy-rejection-1920.png), [exact debrief return1440](screenshots/guided-return-1440.png).

The source Portal reference images are intentionally absent. New art/assets were not required. Dialogs and detailed content can scroll in shorter viewports; no dedicated mobile redesign or physical-device performance certification is claimed. Human novice/IT walkthrough, screen-reader usability and qualified Azure/Portal SME review remain outstanding. No independent mastery, Microsoft completion or full Portal parity is inferred from these tests.
