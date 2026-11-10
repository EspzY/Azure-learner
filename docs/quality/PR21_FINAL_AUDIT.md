# PR21 — Independent Final Audit

Reviewer: separate agent `/root/pr21_final_audit`, type **agent**. Initial review started **2026-10-27T05:15:50Z**, after implementation finished **2026-10-27T05:15:26.601Z**. Base verified as `0f9cacad116a1d236a2edf6dcaa5ee0ab5fe4bda`; branch `codex/az900-serverless-foundations`. HEAD was still the base, so the review included the complete staged/working-tree implementation, new files, screenshots and the unstaged release stamp, not merely committed changes.

Initial reviewed fingerprint: `62a350fabf0b78751b90768a841e24e5087ae622d980c2776590e70787d39f32` from `quality/releases/current.json`.

**Final disposition: independent engineering review completed; no open BLOCKER/MAJOR findings for fingerprint `eb511613f2a637cf0c045e214b9c745fd363d17e3de1df5f13803ae99d6f8948`.** M1, M2 and M3 are corrected and closed with evidence below. Earlier fingerprints remain superseded. Qualified human reviews and external delivery verification remain separate outstanding gates. The reviewer's scoped browser runner reported all eight test outcomes as successful but was interrupted during a teardown hang; its process exit is not claimed as passed.

## Findings

### M1 — MAJOR: one run falsely satisfied both guided witnesses

Initial location: `src/domain/curriculum/serverless.ts:191`–198; displayed claim in `src/content/nb.ts:4539`, used by `src/features/learning/serverless.tsx:449`.

The initial guided predicate searched for a run with completed and pending work, then separately for any non-warm run with started work. The same cold or code-error run could satisfy both predicates. A learner could therefore skip the requested comparison and still receive “Begge kjøringsvitner og riktig årsaksforklaring er registrert.” This was an observable evidence-integrity defect, despite no XP being issued.

Independent pure-model reproduction on the initial implementation:

```ts
let save = applyServerless(freshServerless(), {
  kind: 'run',
  input: { ...initialExecution, situation: 'cold' },
  prediction: 0,
})!;
save = applyServerless(save, { kind: 'explain', answer: 'code-result' })!;
// Actual output: runs.length === 1, guided === true
```

The reviewer also reproduced this through the ordinary production course at `http://127.0.0.1:3101/`: root → Describe cloud computing → Undersøk en hendelseskjede → explicit mission Start → cold, seven events/two slots/two rounds, prediction zero → Run → close milestone → correct causal answer. The browser visibly asserted both witnesses after that sole run. The screenshot was directly inspected in the review tool.

The author changed the first predicate to require a **warm** capacity-limited successful reference, retained the distinct non-warm predicate, clarified the instructions, and added negative single-cold/single-error domain checks plus a browser negative. This makes the witness categories disjoint. The reviewer inspected those changes, independently ran the 13-test serverless domain suite, reproduced the repaired cold/error predicates and observed both the negative cold browser test and positive warm-plus-error course browser test report success on the final production build. **CLOSED** for the final fingerprint.

### M2 — MINOR: source IDs differed between manuscript and executable records

Initial location: source table in `docs/SERVERLESS_FOUNDATIONS.md`, rows SL07–SL09. The manuscript grouped Premium/Dedicated under SL07, called reliability SL08 and grouped responsibility/compute under SL09. The actual manifest/release instead used SL07 Premium, SL08 Dedicated, SL09 reliability, SL10 responsibility, SL11 compute and SL12 Logic Apps. The URLs were relevant, but a stable source ID could denote different material across the records.

The author split the manuscript into SL07–SL12 matching the manifest/release. The reviewer reread the actual corrected table and checked the final stamped bytes. **CLOSED** for the final fingerprint.

### M3 — MAJOR: invalid supplement storage could strand existing lab guidance

The author raised this during delivery review, and the reviewer independently confirmed the mechanism. In the pre-recovery staged source, `src/features/portal/portal.tsx` includes serverless among `guidanceContexts`, correctly suppressing guidance for corrupt/unsupported data; its uncertainty notice only reloads stores. `src/features/learning/serverless.tsx` likewise offered only `store.load`. `ServerlessStore.load` restores the same invalid raw value repeatedly. No isolated UI reset for the supplement was present.

Consequently, corruption or an unknown version in a newly added optional key could indefinitely disable previously working Portal guides. Reload cannot repair it; requiring DevTools or global data deletion would be a material availability/preservation regression. Fail-closed suppression is correct, but an explicit scoped recovery path is required. This is classified MAJOR, not waived as a conservative limitation.

The working-tree correction adds `ServerlessRecovery` in the Portal uncertainty notice and normal supplement course, with a native confirmation dialog, meaningful delete/cancel copy and only `ServerlessStore.clear` as its confirmed mutation. It is absent inside Journal to avoid a nested dialog. The reviewer read the full component, both integration sites, copy, store and the repository test for Escape/cancel, corrupt/unsupported data, scoped deletion, reload and preserved old bytes.

Independent isolated in-memory reproduction using the actual transpiled domain/store modules confirmed both corrupt and unsupported values remain unchanged/unsafe after ordinary load/reload, while explicit `clear` removes only the supplement key, clears that issue and preserves the other raw learning/XP bytes. No production learner data was touched. The reviewer then executed the actual final production recovery test in both desktop and mobile projects: Escape/cancel retained the corrupt/unknown value, explicit confirm removed only that key, the Portal uncertainty notice cleared, reload retained valid historic Foundations v2 bytes, and Axe/overflow assertions passed. The reviewer inspected the actual recovery screenshots. **CLOSED** for the final fingerprint.

## Intermediate renewal and concrete browser limitation

The first renewal began **2026-10-27T05:30:36Z**, after the second implementation finish at **2026-10-27T05:30:20.236Z**, against fingerprint `bb1ecda9fc4e1aaef140ef1ff08058f69944c9a43353462b1420f947fd0a58e8`. All 47 actual gate-relevant changed paths matched the snapshot, all file hashes matched and the reviewer recomputed the same fingerprint. The independent pure-model reproduction now returned false for one cold run and one code-error run, and true when each was combined with a warm capacity-limited reference. The reviewer reran the serverless suite: **13/13 passed**.

No post-fix manual browser interaction was completed in this intermediate renewal. The in-app browser returned `Browser is not available: iab`; browser inventory was empty. Native Chrome application discovery worked, but the following window binding/activation/state request hung until the parent interrupted it. No new Chrome test tab, navigation, model run or deletion was sent. This failed attempt is not counted as browser validation. The reviewer's own isolated production server on port3102 was stopped at **2026-10-27T05:51:25Z**; no other process was stopped, and no reviewer-created Chrome test tab existed to close.

Recovery changes superseded this intermediate fingerprint. No approval attaches to it. Further browser verification will use the existing repository Playwright tests against the renewed production build and actual inspected screenshots; the stalled native mechanism will not be repeated.

## Final renewed review

The post-recovery renewal began **2026-10-27T05:58:26Z** against candidate `7ce89aea814a55f4392d4e7f1f5f44c468c47d9396dfd9e4a9e4b2367cb34c8f`, finished **2026-10-27T05:58:23.128Z**. A final documentation-only correction replaced two malformed arrows in the source manuscript with readable ASCII arrows. The reviewer reread those corrected lines and began the final hash renewal at **2026-10-27T06:00:38Z**, after final implementation finish **2026-10-27T06:00:01.691Z**.

Final reviewed fingerprint: **`eb511613f2a637cf0c045e214b9c745fd363d17e3de1df5f13803ae99d6f8948`**. The reviewer independently enumerated the full actual diff and untracked files, applied the quality script's documented report/status exclusions, recalculated all 49 normalized file hashes and the fingerprint, and called `validateSnapshot` against the full verified base: **no snapshot errors**. The only intervening change during browser execution was the two documentation arrows; application code, tests and production build were identical.

Reviewer-executed final browser command:

```text
npx playwright test tests/e2e/serverless.spec.ts --config .artifacts/pr21-final-audit.config.ts
```

The ignored adapter reused the unchanged repository config, test file, assertions and both projects, changing only the isolated port to3103 and the result/report destinations. It ran the real production build. All **8** tests emitted `ok`: desktop and mobile recovery, full root/course/model/assessment/Journal/resume loop, corrupt-history/single-cold negative/cross-tab shielding, and independent context preservation. Actual screenshots and video/trace artifacts were generated under `.artifacts/pr21-final-audit-results/`.

The runner then stalled during termination after the eighth successful test outcome. No listener remained on3103. A read-only process lookup was denied by the environment. After bounded checks, the reviewer interrupted only that own execution session at **2026-10-27T06:00:48Z**, which returned exit1. **This command is recorded as eight successful browser test outcomes with teardown interrupted, not a clean successful process exit.** The author's separate full suite and scoped suite are reported as exit0 by the author; those exits are not represented as reviewer-executed. No repeated native UI attempt was made.

The reviewer directly inspected the new final committed recovery image and short milestone image, plus the independent run's actual desktop recovery, 1920×1080 explorer and narrow393×851 explorer outputs. These supplement the complete original nine-image inspection; unchanged bytes retain that earlier direct inspection. The recovery dialog states the exact deletion scope and retained data and exposes cancel/close/confirm without clipping in the inspected desktop image. The narrow figure retains the vertical event/trigger/execution/result relationship.

Final independent retests after the last stamp: `npx vitest run src/domain/curriculum/serverless.test.ts` **13/13 passed**; `npm run docs:check` **passed,71 Markdown files**; `npm run quality:check` **passed**; `git diff --check` **passed**. Earlier pure-model checks confirmed `guided:false` for one cold or code-error run and `guided:true` only after adding the required warm reference. The isolated recovery reproduction confirmed both invalid-version paths and byte preservation as described under M3.

| Review domain | Final engineering finding                                                                                                               | Principal evidence                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| content       | No open blocker/major; substantive bounded FC08 theory and honest limits retained. Human depth/transfer validation remains unperformed. | Complete manuscript/nb.ts reading, source checks, corrected final source table/arrows, actual Journal/course output.                                |
| technical     | M1 and M3 corrected; no new runtime/resource/receipt or old contract mutation found.                                                    | Actual model/store code, independent negative/positive reproductions,13 domain tests, snapshot/preserved-path checks.                               |
| visual        | No open blocker/major in inspected images and automated geometry/Axe scope. No human UX or screen-reader approval.                      | Original complete screenshot inspection, final recovery/short image, independent production desktop/narrow screenshots and browser assertions.      |
| assessment    | First/help/retry/abandon distinctions and committed feedback remain intact; no general mastery claim.                                   | Actual criteria/replay reading, original manual correct/wrong submission and final browser loop.                                                    |
| guidance      | Actual-run milestones, context shielding and explicit safe recovery confirmed in scope.                                                 | Actual final desktop/mobile browser outcomes for no-repeat, single-cold negative, cross-tab/independent suppression and recovery.                   |
| regression    | No open blocker/major; scope remains additive to frozen data/rubrics/XP. External delivery remains pending.                             | 49-file final hash match, original nb.ts-prefix/protected-path checks, actual historic-byte browser assertions and unchanged source/test contracts. |

M1 **closed**, M2 **closed**, M3 **closed**. No new blocker/major was found in the renewed implementation. This is an agent engineering review for the stated fingerprint, not a claim of clean reviewer runner exit, human educational acceptance, production approval or external CI/preview completion.

## Six review domains

### Content

Read the full original `serverlessNb` theory, terms, examples, plans, instructions, original assessment choices and all alternative rationales, alongside the manuscript and relevant quality/curriculum contracts. The actual content explains physical servers, the management boundary, PaaS overlap, event/trigger/execution/output, optional bindings, retained responsibility, state, plan-dependent startup/cost and counterexamples. Units and assumptions precede the arithmetic; the two-message worked example does not disclose the seven-event prediction result.

The scope is suitable for the bounded “describe serverless” supplement after pricing. The task changes include webhook customer code and an OS-driver control requirement. These are fixed, fairly close applications of the taught principles, with several absolute distractors; they provide bounded local task observations, not demonstrated broad transfer. A novice/IT pilot must still test whether learners reason from the constraints rather than recognize wording. No content-volume or green-test proxy was used as approval.

### Technical

Read the pure model, exact input validation, versioned event grammar, deterministic replay, save restoration, store, provider and presenter. Counts conserve input across completed/failed/pending; cold preparation and code failure have distinct effects. Results recompute from saved input, and unsent control changes do not rewrite the prior result. No Function resource, Azure invocation, synthetic engine receipt or Portal inventory was added. The active resource/receipt and Foundations engines remain untouched.

M1 was the material defect. The bounded model remains explicitly synthetic: the common inbox does not promise universal trigger buffering/retry, rounds are not Azure time, and concurrency is not a real autoscale implementation. Store inspection and the targeted tests cover invalid events, unknown/corrupt versions, stale writes, denied writes, isolated keys and immutable submissions. The client cannot prove anti-tampering or authoritative competence.

### Visual

Directly opened and inspected all nine actual PNGs under `docs/screenshots/serverless`: explorer at 1920×1080, 1440×900, 1366×768, 1024×768 and 1024×500; hosting; independent feedback; milestone; short milestone. The diagrams distinguish pending/completed/failed work, the trace has a text/table equivalent, and hosting qualifications remain readable. The full-page hosting/feedback captures include sticky elements at their captured scroll position; they are content evidence, not pixel-parity measurements. Short-dialog footer and scroll-region presentation are visibly usable.

Also interacted with the actual local production browser, read its accessibility tree, inspected its screenshot after M1 reproduction, verified heading focus, explicit mission start and restoration of focus to Run on milestone close. Checked that the ordinary course contains the supplement after pricing, that the Journal contains the full theory/sources without model controls, and that the existing resource bridge remains reachable. No new blocker/major visual defect was found in that inspected scope. This is agent engineering inspection, not human UX or screen-reader acceptance.

### Assessment

Read every criterion and feedback alternative, the begin/draft/submit/aid/abandon transitions and derived first/retry flags. Tested one deliberately wrong hosting choice together with correct reason/other criteria in the actual production browser. There was no pre-submit feedback; all answers committed together, and the resulting feedback distinguished the wrong VM choice from the correct event-based reasoning and correct OS-control choice. Persisted first submissions are append-only; later help/retry/abandon cannot create a new first unaided observation. Navigation/read/milestones do not award XP or satisfy old rubrics.

The two cases are original bounded decisions, not an exam bank or a validated holdout assessment. Seven fixed choice criteria cannot establish general Azure mastery. The explicit limits and continued PARTIAL status for 2.2.01 are appropriate. No further blocker/major assessment defect was found.

### Guidance

Read the mission/milestone frame, actual recomputed trace trigger, PR20 milestone-history reuse, once-only claim, denied/corrupt history handling, manual recall, context shielding and course/Portal assistance integration. Mission open/close/Start does not emit a run or completion. Automatic explanation is claimed before display; it requires actual started work and safe context. Active or uncertain assessment/store contexts suppress the automatic guidance and close open presentation. Portal entry points include the new supplement in independent shielding without changing technical commands.

The actual browser confirmed explicit start, factual counts, clear no-runtime boundary, native close/focus return and ordinary Journal reuse. The new tests were read for corrupt history, other-tab assessment/conflict, no-repeat and suppressed coaching. In the initial pass those browser tests were read rather than reviewer-executed; final scoped outcomes and the teardown limitation are recorded above. The initial author suite remains separate evidence.

### Regression

Reviewed the full diff against the verified base, including audit data, generated matrix, package script, providers, navigation, reset key, course/Portal integration and all new staged files. `git ls-files --others --exclude-standard` was empty before this report. A reviewer-executed comparison found the normalized entire original `nb.ts` to be an exact prefix of the new file. A scoped `git diff --exit-code` was empty for Chapter01, Sandbox, Portal domain, progression, Foundations v1/v2 model/store and lockfile. No old E2E assertion or skip was weakened; the changed existing audit assertion reflects seven rather than six COMPLETE rows, and the new e2e file is additive.

The audit update changes only the scoped serverless/Functions contributions and keeps 2.2.01 PARTIAL. COMPLETE content coverage remains distinct from learner evidence, tests and qualified human review. No runtime network/service/dependency/asset addition was found. External CI, exact deployed SHA and stable preview verification are still delivery work, outside this local audit.

## Independent source checks

On 2026-10-27 the reviewer fetched and read public bodies from these official sources independently of the author's notes. Each displayed a generic authorization banner while still returning the public article; no authentication/protection was bypassed.

- [AZ-900 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900): July 20, 2026 scope still names serverless separately and retains the composite containers/VM/functions comparison.
- [Functions hosting](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale): plan choice changes scale/resources/cost; Premium and Dedicated are relevant to continuous/longer-running work. The implementation avoids relying on the inconsistent legacy Linux retirement wording.
- [Flex Consumption](https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan): scale-to-zero/on-demand differs from optional always-ready capacity, with concurrency/workload qualifications.
- [Triggers and bindings](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings): one trigger per function; optional input/output bindings; SDK alternative. Invocation is not evidence of correct business output.
- [Performance and reliability](https://learn.microsoft.com/en-us/azure/azure-functions/performance-reliability): plan/timeouts, dependencies, stateless/idempotent design and durable communication qualifications support the bounded manuscript claims.

These are scoped agent fact checks, not a full operational Functions lab, exhaustive rereview of every linked source, or qualified Azure SME signoff.

## Reviewer-executed controls

- `npx vitest run src/domain/curriculum/serverless.test.ts` — **13/13 passed** after the M1 source/test edits arrived in the shared tree. This does not validate the stale initial production build.
- Pure Node import/reproduction above on the initial implementation — **reproduced M1**, one run yielded `guided:true`.
- `npm run az900:audit:check` — **passed**, 57 objectives/126 facets and generated matrix valid.
- `npm run quality:check` — **passed** structure/source/activity bindings; no approval inferred.
- `git diff --check` — **passed**.
- Protected-path `git diff --exit-code` and original `nb.ts` prefix comparison — **passed** as described above.
- Actual local production browser on isolated port 3101 — root/visible course/supplement/mission/model/M1/independent correct-and-wrong feedback/Journal/existing bridge inspected. Only the reviewer's own server was started and stopped; port3000 and other processes were untouched. The temporary browser tab was closed.

The reviewer did not rerun the whole check/E2E suite in the initial pass, and does not claim the author's reported full-suite results as independently executed. The scoped final browser execution and its teardown limitation are recorded above. No learner production data, implementation file, approval state, commit or push was changed by the reviewer. The only additional non-report file is an ignored local Playwright port/output adapter.

## Explicit remaining gates

Qualified human Azure SME review, novice and IT-experienced usability review, assistive-technology/screen-reader review and measured learning/retention/transfer validation remain **unperformed**. Agent review, Axe assertions and screenshots do not satisfy them. The final independent engineering renewal is complete for the fingerprint stated above; latest external CI/stable-preview/root/SHA/browser verification is still required before owner delivery. The scoped runner teardown interruption remains an explicit tooling limitation.
