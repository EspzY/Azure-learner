# PR22 — Independent Final Audit

Reviewer: separate agent `/root/pr22_final_audit`, type **agent**. Initial review started **2026-10-27T07:18:28Z**, after implementation finished **2026-10-27T07:17:53.123Z**. Verified base/HEAD: `afe9692148fe277885e5625a15048a04e32a13d6`; branch `codex/az900-core-architecture-physical`. Review included the complete staged/working-tree implementation, new files, actual screenshots and release stamp, not only committed changes.

Initial reviewed fingerprint: **`bcde1cd7910238be4b4cbef85be0f3a12871262ee0e77d21de9a8a15a37817dd`** from `quality/releases/current.json`.

**Initial disposition: three open MAJOR findings; release acceptance withheld.** R1, R2 and R3 below require correction, affected retests, a new stamp and renewed independent review. This initial report was recorded at **2026-10-27T07:29:23Z**. The author began corrections while the reviewer completed the original production-browser run; current working-tree code is therefore already newer than the initial fingerprint. Nothing in this report approves that work in progress.

**Final renewed disposition:** R1, R2 and R3 are closed; no open BLOCKER/MAJOR for fingerprint `c64c953f71883d20ec48081e1d7bca3d2d40c593481bcd84b6d5c1bdd5ce08b0`. Renewed review began **2026-10-27T07:51:11Z**; see the renewed review below. Human and external delivery gates remain separate.

## Findings

### R1 — MAJOR: event capacity can permanently strand an active independent attempt

Initial locations: `src/domain/curriculum/architecture-physical.ts`, `applyPhysical` maximum400 check; `src/domain/curriculum/architecture-physical-store.ts`, `event` limit issue; `src/features/learning/physical.tsx`, `PhysicalAssessment` unsafe controls.

The same maximum applies to navigation, study, drafts, assistance and terminal events. A valid399-event record can accept `begin` as event400, then reject every draft, submit, aid and abandon. An already active attempt can also consume its final slot with a draft or visit. Reload preserves the active attempt; its next action hits the same cap. UI recovery exists only for corrupt/unsupported records, while `limit` disables the controls needed to end the attempt. The globally mounted physical context then also blocks guidance in other modules and Portal. An all-data reset would discard unrelated historical evidence and is not an acceptable escape.

An audit-only script transpiled the actual unchanged domain/store files into ignored artifacts, constructed399 alternating valid assessment/summary visits, loaded the real `PhysicalStore`, then called begin, abandon, reload and abandon. Actual output:

```json
{
  "proof": "capacity-lock",
  "begin": true,
  "abandon": false,
  "events": 400,
  "activeAfterReload": true,
  "issueAfterReload": null,
  "secondAbandon": false,
  "issueAfterSecondAbandon": "limit"
}
```

Required repair: keep a full valid record readable, prevent new unfinishable attempts, and ensure bounded assistance and terminal transitions can still be recorded for an existing attempt without rewriting old submissions/events. Test boundary counts, drafts/navigation exhausting capacity, reload, first/help classification and the effect on other courses' guidance. Merely increasing the cap postpones the defect.

### R2 — MAJOR: invalid-store recovery can delete a newer valid Part A record

Initial locations: `src/features/learning/physical-recovery.tsx`, confirmed `s.store.clear()`; `src/domain/curriculum/architecture-physical-store.ts`, unconditional `clear`.

The confirmation promises deletion of only the invalid or unknown Part A registration, but `clear()` removes the current key without re-reading or checking whether it still contains that invalid snapshot. Another writer can repair/write valid evidence after the original load and before confirmation. A normally delivered storage event changes the issue and usually unmounts the dialog, which reduces exposure; it does not protect the read/confirmation race or a same-document repair. The destructive handler itself has no stale-snapshot check.

Independent actual-store proof: load `{broken`, replace only the physical key with a valid1.0.0 record containing `begin`, then invoke the exact method used by the confirmation. Actual output:

```json
{
  "proof": "stale-invalid-recovery",
  "validBeforeClear": "{\"schema\":1,\"module\":\"core-physical\",\"content\":\"1.0.0\",\"model\":\"1.0.0\",\"rubric\":\"1.0.0\",\"events\":[{\"kind\":\"begin\"}]}",
  "currentAfterClear": null
}
```

Required repair: separate invalid recovery from the explicit global reset. Recovery must compare/re-read the current raw record, preserve/reload valid or changed records, and remove only the confirmed invalid/unknown snapshot. Test valid repair, changed invalid bytes, denied reads/removals and cancel. Local storage remains best effort; do not claim a distributed transaction or lock.

### R3 — MAJOR: instructional Summary access is unrecorded assistance

Initial locations: `src/domain/curriculum/architecture-physical.ts`, `physicalFacts` exempting assessment and summary visits; `src/features/course/course.tsx`, matching summary exemption; `src/features/learning/physical.tsx`, `PhysicalSummary` rendering witnesses and `c.task`.

While an independent attempt is active, Summary remains an unassisted destination but displays the guided causal solution: surviving app with missing data, an explicitly redundant usable path, and the instruction to configure copies and routing. These are directly relevant to the active zone-design/dependency decisions. The distinction between a status-only summary and teaching has not been maintained.

This was reproduced through the actual in-app production browser on isolated port3101: ordinary root → visible Part A entry → Explorer mission Start → wrong prediction and actual loss → independent Start → visible Summary link → read the causal witness/task copy → return to assessment. The active status still read **“Uten registrert hjelp”**. Submitting the ten correct answers then produced feedback classified **“Uten registrert hjelp”** with every criterion fulfilled. The original first classification therefore can certify an unassisted local observation after relevant instructional help.

Required repair: either suppress instructional/solution-bearing summary content during active independent work, or record assistance before exposing it. Preserve all existing first submissions and drafts. Add a browser regression from a new independent attempt through Summary and back, not only a pure event assertion.

## Six review domains

| Domain     | Initial finding                                                                                                                                                                                                                                  | Actual evidence examined                                                                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| content    | No additional factual BLOCKER/MAJOR found in the reviewed physical scope. Full Core remains partial3/7. Fixed tasks support bounded observations, not validated broad transfer.                                                                  | Full original manuscript; appended `architectureNb` explanations, terminology, counterexamples, task copy and all alternative rationales; source conflict resolution and official public bodies below.  |
| technical  | R1 and R2 are open MAJOR preservation/availability defects. The deterministic infrastructure calculation otherwise preserves explicit placement, dependency, routing and unknown state in the reviewed cases.                                    | Actual model/store/provider/recovery code; independent negative store proofs;18 scoped domain/guidance tests; production model and storage cases.                                                       |
| visual     | No additional BLOCKER/MAJOR in directly inspected desktop/compact images and actual IAB screens. Semantic table complements the diagram; critical text uses normal scroll rather than unreadable scaling.                                        | Actual1920,1440,1366,1024 and short milestone screenshots; current lesson and feedback capture; actual root, mission and loss modal. Axe/overflow/keyboard/zoom assertions ran in the production suite. |
| assessment | R3 is open MAJOR: solution-bearing summary help retains the first unassisted classification. Submitted feedback, partial criterion calculation, help/retry/abandon and immutable first records otherwise have real replay/tests.                 | All ten criteria and rationales; original fixed scenario manuscripts; manual correct submission after Summary exposure; wrong answer/partial feedback exercised by the independent production run.      |
| guidance   | Run-triggered milestones and conservative independent/uncertain shielding work in the exercised normal/cross-tab paths. R1 can leave shielding stuck; R3 violates the help boundary outside the modal itself.                                    | Actual `run`/claim code, versioned milestone register, history parsing and safety predicates; native mission/loss screenshot and operation; once-only/reload/cross-tab production cases.                |
| regression | No changed frozen Portal/Sandbox/Chapter/Foundations/Serverless domain contracts or lockfile in the inspected diff. R1 is a cross-module guidance regression risk; R2 is a Part A evidence loss risk. External delivery remains unverified here. | Actual additive manifest/official metadata/course/provider/Portal integration; protected-path diff produced no changes; isolated historic-byte assertions in desktop/mobile browser cases.              |

## Content and source challenge

Read the active AGENTS/README/PROJECT_STATUS and all five mandatory quality/content/source/guidance/release contracts, the complete [Part A manuscript](../CORE_ARCHITECTURE_PHYSICAL.md), relevant audit/roadmap/assessment material, actual model/renderer/course integration and tests. The module is reachable through the ordinary course and visibly identifies three implemented objectives, CA01–03/F02; it does not claim Part B or broad exam readiness.

Independently opened and read these official primary bodies on2026-10-27:

- [Core module and its physical unit](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/5-describe-azure-physical-infrastructure): seven objectives, scoped physical grouping and bounded unit content. The module's actual link resolved to unit5; one earlier direct unit2 lookup was unavailable and was not counted as a source review.
- [Regions overview](https://learn.microsoft.com/en-us/azure/reliability/regions-overview) and [region list](https://learn.microsoft.com/en-us/azure/reliability/regions-list): geography distinction, nonregional services, the five dated examples, Norway West's restricted/no-listed-zone status and Italy North's nonpaired status agree with the authored subset.
- [Paired/nonpaired regions](https://learn.microsoft.com/en-us/azure/reliability/regions-paired): the course correctly qualifies the Learn unit's broad recovery wording, retains asymmetric/cross-geography cases and does not infer app copies or failover from a pair.
- [Availability Zones](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview) and [zonal resource resiliency](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-zonal-resource-resiliency): one-or-more-datacenter grouping, logical subscription mapping, different zone/replica counts, nonzonal uncertainty and explicit workload dependencies agree with the original explanation.
- [Azure Government](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-welcome) and [21Vianet operations](https://learn.microsoft.com/en-us/azure/china/overview-operations): the course's separate operational environments, eligibility and service differences are appropriately qualified.

Generic authorization banners appeared above readable product-page bodies; no login/protection was bypassed. This was a targeted independent factual cross-check, not a claim to have repeated every author discovery link or to be a qualified Azure SME. No real resource creation, actual facility locations, runtime health, measured replication, timing, SLA or compliance guarantee was found in the reviewed model. The explicitly ready/equivalent data copies and ideal declared connections are model assumptions.

The Government task supplies the required environment explicitly, so it measures environment discrimination rather than independent legal suitability. The fixed recognition/decision/matching set is narrow; the manuscript/summary honestly leaves human rubric quality, novice usability and delayed transfer unvalidated. These are outstanding human gates, not waived acceptance claims.

## Actual verification and visual inspection

Reviewer-executed commands against the original implementation/build:

```text
npx vitest run src/domain/curriculum/architecture-physical.test.ts src/domain/guidance/milestones.test.ts
npm run quality:check
npm run az900:audit:check
node .artifacts/pr22-audit-proofs.mjs
npm run start -- --port 3101
npx playwright test tests/e2e/architecture-physical.spec.ts --config=.artifacts/pr22-review.config.ts
```

Results: **18/18** scoped domain/guidance tests passed; quality and57-objective/126-facet audit validators passed; audit proofs reproduced R1/R2; **8/8** unchanged production browser cases passed, **41.1s**, clean exit0. The ignored adapter reused the repository assertions/projects and isolated port3101 plus report/result paths. These green tests do not close the new negative cases. The author-reported full check182 Vitest/13 Node/92 curriculum and full79passed/17 inherited skips/0failed E2E were read as author evidence, not represented as independently rerun here.

Directly viewed actual [lesson](../screenshots/physical/physical-current-lesson.png), [1920 layout](../screenshots/physical/physical-explorer-1920x1080.png), [1440 layout](../screenshots/physical/physical-explorer-1440x900.png), [1366 layout](../screenshots/physical/physical-explorer-1366x768.png), [1024 layout](../screenshots/physical/physical-explorer-1024x768.png), [short milestone](../screenshots/physical/physical-milestone-short.png) and [wrong/partial feedback](../screenshots/physical/physical-assessment-feedback.png). Fault glyph/text and component chips distinguish affected from unaffected components. The full-page feedback capture includes sticky elements at its stitched scroll position; viewport captures establish layout. All contents below the minimum-desktop viewport require ordinary scrolling, which is documented and not hidden completion.

Actual IAB operation separately verified the ordinary root's visible entry, committed heading focus, native mission with explicit Start, wrong prediction followed by observed loss, scrollable loss explanation, independent entry, Summary exposure and committed feedback. No Azure operation or external communication was performed. Temporary audit tab was closed and only the reviewer-owned port3101 server was stopped at **2026-10-27T07:27:12Z**; unrelated port3000 was untouched.

An independent full-diff/snapshot recalculation later returned stale, correctly: the author's announced R1–R3 corrections had already changed six implementation files after the initial stamp. No final hash acceptance is claimed for that in-progress tree. Renewed review must independently verify the new complete changed-file snapshot and fingerprint after the fixes/build/tests/visual checks are finished.

## Initial outstanding acceptance (superseded by renewed review)

R1 **OPEN MAJOR**, R2 **OPEN MAJOR**, R3 **OPEN MAJOR** for the initial fingerprint. No implementation file, test assertion, skip, commit, deployment or release JSON was changed by this reviewer. Only this report and ignored review artifacts were written.

Required next step: concrete fixes and meaningful negative regressions, affected/full required suites, final production/visual checks, new stamp and renewed independent review. Latest remote CI, stable preview, intended SHA and actual root→work→return walkthrough remain separate delivery gates. Human SME, screen-reader-user review, novice/IT usability and measured transfer remain **unperformed**. This is an independent agent engineering audit, not human certification or permission to merge/deploy.

## Renewed final review

Renewed independent review began **2026-10-27T07:51:11Z**, after corrected implementation finished **2026-10-27T07:50:47.999Z**. Final reviewed fingerprint: **`c64c953f71883d20ec48081e1d7bca3d2d40c593481bcd84b6d5c1bdd5ce08b0`**. Same verified full base/HEAD and feature branch. The initial review and proofs above remain historical evidence for the superseded fingerprint.

The reviewer independently enumerated all actual changed and nonignored untracked paths, applied the quality script's explicit report/status exclusions, recomputed normalized hashes for **65** fingerprint-relevant files and called `validateSnapshot` against the full verified base. Computed fingerprint exactly matched the corrected record; **no snapshot errors**. The renewed audit did not rely on the author's snapshot assertion alone.

**Final disposition: independent agent engineering audit complete; R1, R2 and R3 CLOSED with concrete corrections and retests. No open BLOCKER/MAJOR finding was identified for the final fingerprint.** This is not human SME/UX/learning certification or a substitute for remote CI and exact-SHA preview delivery.

### Renewal R1 — capacity correction verified

Normal activity remains bounded at400 events, while one assistance observation and one terminal submit/abandon can use reserved capacity through402. `full` is a known read-only condition, not a global unsafe-storage issue. The UI exposes a clear capacity explanation and link to the existing assessment; new drafts/work/attempts are disabled at capacity, but existing complete drafts may submit and incomplete attempts may abandon. Replay validates the bounded extra event kinds. No original prefix is rewritten or purged.

Independent renewal proofs used the actual corrected model/store, transpiled into audit-only files outside the repository. At400 events an incomplete draft write was rejected without an issue; aid, repeated idempotent aid and abandon succeeded, reload showed inactive status,402 events and an unchanged400-event prefix. An unaided complete draft submitted at401 and retained its correct first observation; the same complete draft after Summary help submitted at402 as assisted and did not become first unaided. Both replayed successfully. New begin on a full inactive record was rejected with issue still null. The original full-capacity dead end therefore no longer occurs, and a safely ended full record no longer imposes uncertain guidance on the rest of the app. **R1 CLOSED**.

The bounded log still eventually stops accepting new practice. That is explicit product behavior, not unlimited history or a learning-completion claim; the record remains readable. The independent browser regression also opened Journal at capacity, recorded help, abandoned, reloaded402 events and returned to Portal without an uncertain-context notice, preserving protected historic bytes.

### Renewal R2 — stale recovery correction verified

The confirmation now calls `recoverInvalid`, separate from explicit global `clear`. Recovery checks that the issue is still corrupt/unsupported, reads and restores the current raw value and compares it with the quarantined base. Changed bytes or an already valid record are preserved/reloaded and return false. Only the same currently invalid snapshot is removed; read/remove failures return false and retain an unsaved warning.

Independent renewal proofs confirmed: a newer valid active record survives confirmation and becomes the loaded view; changed invalid bytes survive the stale confirmation; a fresh confirmation can remove those same invalid bytes; unrelated historic bytes remain exact. Separately injected denied reads and denied removals both preserved the invalid raw value and reported unsaved. The passed desktop/mobile regression exercised the actual native confirmation after a same-document valid repair, where no storage event exists to mask the bug. Existing cancellation, corrupt/future recovery and cross-tab tests still pass. **R2 CLOSED**.

This is conservative best-effort local-storage recovery, not a distributed compare-and-swap transaction. The implementation and report do not claim an atomic cross-tab lock.

### Renewal R3 — Summary assistance correction verified

Both `physicalFacts` and the Course-level assistance effect now treat active Summary exposure as help. The reserve path translates an instructional visit at capacity into an aid event before it can exhaust terminal capacity. The assessment introduction explicitly includes Summary among help-bearing destinations.

Independent pure replay confirmed a wrong draft remained intact after Summary, assistance became true before submit, an all-correct result did not become first unaided and a later retry did not alter the immutable first result. The real production regression starts a fresh independent attempt, stores a wrong draft, navigates through Summary and back, verifies assisted classification and the preserved draft, submits all criteria correctly, and checks all three objective first-unaided outcomes remain unregistered. That regression passed in both projects. **R3 CLOSED**.

### Existing visible-manuscript test correction

The only changed existing assertion locators in `tests/e2e/course.spec.ts` scope `.portal-manuscript` to `.portal-manuscript:visible`. The exact count of one, exact mechanism text and subsequent missing-mascot/navigation/keyboard/content assertions remain. There is no skip, first-match shortcut, changed expected text or weakened visible uniqueness requirement.

The reviewer independently read the preserved intermediate failure context and opened its actual trace ZIP with .NET. The trace contains an extra entire Course subtree under `DIV` with attributes `hidden=""` and `id="S:0"`; snapshots show two manuscript references while that second subtree is hidden. This corroborates a React streaming transport duplicate, not two displayed lessons. Scoping this UI assertion to displayed content is appropriate: zero or two visible manuscripts still fail. Both desktop/mobile versions of the corrected original test passed in the reviewer's own final run. The trace was treated as evidence, never instructions.

### Renewed commands and results

```text
node .artifacts/pr22-audit-snapshot.mjs
npx vitest run src/domain/curriculum/architecture-physical.test.ts src/domain/guidance/milestones.test.ts
node --input-type=module  [reviewer assertions supplied on stdin; transpiled runtime outside repo]
npm run start -- --port 3101
npx playwright test tests/e2e/architecture-physical.spec.ts tests/e2e/course.spec.ts --grep 'ordinary root|example regions|isolated corrupt|Part A first|final-audit regressions|original computing investigations' --config=.artifacts/pr22-review.config.ts
```

Actual results: exact65-file snapshot/fingerprint match with no errors; **21/21** physical/guidance tests passed; all expanded independent capacity/recovery/help assertions passed; **12/12** production browser cases passed with a clean process exit, **52.7s**. This comprises all ten final Part A cases plus both projects of the changed existing course test. The adapter retained original assertions/projects and only isolated the port and output locations. No extra full-suite rerun was needed after these targeted results; the author's completed185 Vitest/13 Node/95 curriculum/full81passed+17inheritedskips evidence is identified separately as author verification.

The Python launcher was unavailable when reading the stored trace. The reviewer used Windows' .NET ZIP APIs successfully instead; no Python trace read is claimed. A fresh IAB-tab attempt during renewal reported that the browser was unavailable, and inventory confirmed no browser surfaces. No manual browser renewal is claimed, no native window was taken over and no protection was bypassed. The reviewer's actual production Playwright run and generated browser images provide the renewed browser evidence. The original successful manual IAB review remains part of the initial audit.

### Renewed visual inspection and artifact locations

Directly inspected the final run's actual1920 model image, short scrollable milestone, full unknown-placement output and existing tablet course screenshot. Also extracted and viewed two actual browser frames from the final capacity regression trace, including the visible readable capacity explanation. The inherited brief loading frame is not mistaken for final state: the completed regression asserts the stable active/terminal and recovered Portal states. The earlier1920/1440/1366/1024 image inspection remains applicable because the scene/figure/CSS hashes are unchanged; the new banner is additionally inspected in the executed regression output. No human accessibility or UX approval is inferred.

Initial browser output was subsequently preserved by the author outside the repository, after the initial adapter accidentally nested a generated trace viewer under `.artifacts/.artifacts`. The generated viewer caused lint noise; no lint ignore or test was weakened. Actual preserved initial paths are `C:/Users/espen/.codex/visualizations/2026/10/22/01a1650d-a2a5-7483-8767-731edf7f83ab/pr22-independent-initial-report` and `pr22-independent-initial-results` in that same folder. The initial in-repository output paths above describe where that first run wrote, not their final location.

The renewed run wrote directly to `C:/Users/espen/.codex/visualizations/2026/10/22/01a1650d-a2a5-7483-8767-731edf7f83ab/pr22-independent-renewed-report` and `pr22-independent-renewed-results`; capacity images are `pr22-renewed-capacity-22372.jpeg` and `pr22-renewed-capacity-22569.jpeg` in that visualization root. Original React failure evidence is preserved there as `pr22-react-hidden-stream-trace.zip` and `pr22-react-hidden-stream-context.md`. Generated code was not added to the repository or quality snapshot.

Only the reviewer-owned production server on3101 was stopped, at **2026-10-27T07:55:11Z**; its runner had exited normally before shutdown. No new IAB tab was created in renewal and no unrelated port3000 process was touched.

### Final six-domain disposition

| Domain     | Final finding for corrected fingerprint                                                                                       | Concrete closure/review evidence                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| content    | No open BLOCKER/MAJOR. Original physical explanations/source qualifications retained; full Core stays partial3/7.             | Original manuscript and primary-source challenge above; actual final copy changes add honest capacity/help explanations. Human SME/transfer remains unperformed.         |
| technical  | R1/R2 closed. Bounded terminal/help reserve and conservative stale-invalid recovery preserve old event prefixes/raw bytes.    | Corrected actual domain/store code,21 scoped tests, independent full/partial/denied/replay proofs and real production regressions.                                       |
| visual     | No open BLOCKER/MAJOR in inspected actual output; no human UX or screen-reader approval.                                      | Final1920/short/unknown/tablet images, actual capacity trace frames, unchanged scene/CSS fingerprints and exercised geometry/Axe/keyboard/zoom paths.                    |
| assessment | R3 closed. Instructional Summary exposure now records assistance before first submission, including at capacity.              | Corrected domain/Course effects, preserved draft/first/retry proofs and the passed first-attempt desktop/mobile regression.                                              |
| guidance   | No open BLOCKER/MAJOR. Active independent shielding remains; a safely ended full record no longer creates global uncertainty. | Actual final milestone/history/safety code, cross-tab/reload/once-only cases and capacity→Journal→terminal→Portal browser assertions.                                    |
| regression | No open BLOCKER/MAJOR. Frozen domains/stores/XP/lockfile preserved; visible-scope test fix independently justified.           | Exact65-file snapshot match; unchanged protected paths; historic-byte assertions; actual original hidden-stream trace and both corrected existing test projects passing. |

R1 **CLOSED**, R2 **CLOSED**, R3 **CLOSED** for **`c64c953f71883d20ec48081e1d7bca3d2d40c593481bcd84b6d5c1bdd5ce08b0`**. Only the report and permitted release review fields are updated by the reviewer. Scope, author, source/claim records, tests, stamp, verification and implementation remain unchanged.

Engineering Gate6 is complete for this fingerprint. The parent must still run the strict release gate and verify latest remote CI/stable preview/intended SHA/root→visible work→return. Human Azure-SME, novice/IT UX, screen-reader-user and measured learning-transfer reviews remain **unperformed**. No merge or production-deployment authorization follows from this audit.
