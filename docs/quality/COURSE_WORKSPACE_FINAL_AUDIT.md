# Course workspace adapter independent final audit

Reviewer: `course-workspace-independent-final-auditor` (separate Codex agent `/root/course_workspace_final_audit`, not the implementer; agent review, not human approval).

Implementation finished: `2026-11-10T09:20:01.004Z`. Actual review started: `2026-11-10T09:20:35Z`. Review evidence closed: `2026-11-10T09:23:38Z`.

Reviewed base: PR80 `c2bce3efa2ed4a56c96b594a6731662663e597d1`. Branch: `codex/course-laboratory-engine-adapter`; HEAD was still the base, so this review identifies the stamped working-tree candidate, not a new commit SHA.

**Disposition: regression acceptance blocked by one open MAJOR.** No new runtime ownership, evidence-integrity, content, assessment or guidance blocker/major was found in this bounded source review. This is not complete release acceptance. Main/PR80 merge, infrastructure, secrets, Vercel changes and production deployment remain unauthorized.

## Source identity and scope

Independently reconstructed the changed-file set from native Git diff plus untracked files, read actual filesystem bytes, normalized text line endings and calculated SHA-256 without importing either preservation reader. All **42 files** and their individual hashes match `quality/releases/current.json`. The independently reconstructed fingerprint is:

```text
eb9ec7aa146400a5cabfb22c95f9478dc90047876c39808fc6539703000b33e2
```

Native Git blob checks also matched the finite source manifest: **21 declared edits, 21 additions, 3,251 preserved baseline paths**, no unknown actual paths and no byte mismatch. The quality record, this report and QA report are declared metadata exclusions; the project-status edit is still admitted by the raw-source manifest. Independent TypeScript AST comparison confirmed that both modified historical preservation files retain every original non-import statement. `git diff --check` passed.

The reviewed contract is [COURSE_LABORATORY_ADAPTER_V1](../COURSE_LABORATORY_ADAPTER_V1.md), with the existing [owner acceptance boundary](../BASELINE_OWNER_ACCEPTANCE.md). This adapter is an optional technical workbench and prerequisite for later integration. Existing graded AZ-900 tasks remain on v2 `/portal`; this delivery does **not** establish one-engine course grading or migrate old attempts.

## Six-domain review

| Domain     | Review and conclusion                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content    | The complete original locale, teaching, domain and source bytes are preserved. New workbench copy explicitly distinguishes technical evidence from assessment, XP and completion, and tells users that existing course tasks/results still use the original Portal. No new lesson, mission, rubric or coverage claim is introduced. No repeat historical curriculum/SME audit was performed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Technical  | Reviewed the course contract, API route, Repository, server, additive011, client, evidence panel and controller/context changes. Fixed `az900-technical@1` / model3.9, server-generated binding, separate HttpOnly cookie and repository-purpose predicate prevent free/course token interchange. Binding creation shares the original transaction. Commands retain the original engine, lock, canonical command-ID redelivery, stale-revision receipt and commit-before-response. The course transport preserves original rejected receipts at409/422. Capture accepts exactly captureId/revision/through plus owned workspace precondition; it replays committed server events and stores an immutable prefix/digest pointer. Reads re-resolve under ownership and verify original history/digest, including prefixes before Reset. Anonymous cookie possession is technical authorization; `learningAttempt:null` correctly avoids a learner/attempt identity claim. No new runtime major found. |
| Visual     | Independently opened all five actual PNGs and checked their SHA-256 values and dimensions against capture provenance: blob/checkpoint and Studio1440×960; Review1440×900,1024×768,1024×500. Technical labels, original escaped blob text/digest/receipt link and checkpoint boundary are legible. The Review focus ring and Save/Cancel remain visible above the resource layout, including the short viewport; no new overlap/clipping was observed in these frames. The existing graph/presentation is reused. These are image inspections plus inspected browser evidence, not an independent live-browser rerun or human UX/screen-reader validation.                                                                                                                                                                                                                                                                                                                                           |
| Assessment | All original stores, first/help/retry semantics, rubrics, Journal and XP bytes remain preserved. There is no assessment consumer for a client envelope. New tests cover strict pointer-only input and retained active v2 draft bytes; the technical evidence label makes no completion/grade claim. Later graded use still requires a separately approved authenticated learner/attempt adapter and owned server resolution.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Guidance   | No course provider, automatic mission, guide or SavvyShark layer is mounted by the new route. Shared navigation and analysis context keeps child resource links, Studio returns and server analyses scoped to the course workspace while reusing the original controller. Free ephemeral memory is never selected as course transport or an evidence fallback. Existing teaching/assistance contracts remain preserved rather than reinterpreted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Regression | Native actual-source admission precedes historical projections; frozen engine3.0–3.9, SQL001–010, original browsers/assertions and workflow bytes are preserved. The only old guard edits are reader imports. Targeted63/63, corrected guards15/15 and new browsers7/7 are supported by inspected logs. However, the second fullcheck is red with three unchanged preservation timeouts. Complete518-case same-head CI, strict release and new-head public preview verification remain pending.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## Findings

### CW-AUDIT-01 — MAJOR, OPEN: fullcheck preservation cost still exceeds unchanged limits

The actual second `npm run check` ended at **1501/1504 Vitest tests,117/120 files** after85.14s. Three original guards exceeded their unchanged5000ms limit:

- `src/features/landing/preservation.test.ts`: bounded original-source preservation,6642ms.
- `src/laboratory-remediation-preservation.test.ts`: frozen-engine/course/evidence preservation,7448ms.
- `src/laboratory-studio-preservation.test.ts`: original course/engine/SQL/receipt preservation,5871ms.

Node tests and build were not reached. The earlier fullcheck had1502/1504 with different preservation timeouts; the subsequent15/15 targeted pass therefore does not establish full-suite acceptance. Actual red logs are retained privately outside Git at `/workspace/azurelab-course-integration/evidence/fullcheck-first.log` and `fullcheck-second.log` (evidence directory0700).

The new helper's trust boundary is sound in the reviewed code: eager native actual-byte admission happens before any c2 parent projection; cached hashes are used only after admission and matching device/inode/size/nanosecond mtime+ctime signatures around a fresh native read; changed signatures trigger hashing; original assertions still hash returned bytes. Native negative tests reject changed old engine/assertion bytes, unknown additions and missing source. No trust bypass was found. Nevertheless, the added reader/signature layer sits under long historical read chains and its broad-run performance remains unaccepted; the precise timing cause is not established by this audit.

Required disposition: the primary implementer must resolve or establish the cause and obtain a real complete check at the existing assertions/timeouts/retries/settings. Do not weaken old checks or relabel a targeted pass as closure. Any implementation/helper change invalidates this fingerprint and requires a fresh stamp and proportionate independent follow-up. This finding was sent to the primary implementer during review.

## Verification actually performed or inspected

Performed by this reviewer: native42-file SHA-256/fingerprint reconstruction; full raw Git/blob union comparison against c2; independent AST comparison of the two changed old guards; PNG hash/dimension checks; visual inspection of all five images; `git diff --check`; source/contract/test review. No Vitest, PostgreSQL mutation or Playwright suite was launched by this reviewer, to avoid contending with the primary's serialized fullcheck.

Inspected existing actual execution evidence:

- `new-and-preservation-first.log`:63/63 across5 files, including actual local-PG integration, native admission, pointer/client negatives and old-parent guards.
- `preservation-efficient.log`:15/15 across3 files at the unchanged limits.
- `course-browser-third.log`:7/7 (6desktop+1compact),0retries,35.1s; real Storage controls, original receipt/reload/checkpoint/reset, Studio, free-memory/reset isolation, stale tabs/idempotence/foreign sessions, active old v2 draft preservation, negative503, keyboard/Axe/reduced motion and tested viewport changes. The negative503 browser witness intentionally mocks an unavailable response; server integration separately exercises missing configuration.
- Both fullcheck logs, including the original red outcomes. Second run passed typecheck/lint/format/docs/quality/curriculum/assets/legacy stages before the failing Vitest stage. No complete Node/build result is claimed.
- Earlier new-PG timeout and isolated156ms capture evidence; those green reruns do not establish a timing cause or close earlier observations.

The retained `.next/BUILD_ID` matched capture provenance `ePOvxTXwOzkh9S7Cf4Z1T`. Image hashes and the candidate source snapshot were independently verified; the screenshot journey itself was not regenerated by this reviewer. Capture provenance honestly identifies a normal working-tree production build before the final commit, not authoritative same-head CI/public evidence.

## Remaining acceptance limits

Complete authoritative **518-case CI (465desktop+53compact)** and strict release are pending, as is actual anonymous public root→visible workbench→return verification against the new full SHA. An unconfigured preview may honestly return503 for course persistence; this is not a successful hosted Storage/checkpoint journey. Seven-day anonymous session lifetime, lost-cookie recovery and lack of authenticated learner retention remain explicit limits.

Earlier baseline timing/Compute/Axe/paint findings, the initial new-PG timeout observation and development-tool audit findings are not blanket-closed by this review. Human SME, learning/transfer, usability and screen-reader validation remain unperformed. The source audit creates no merge, deployment or production-control approval.

## Affected follow-up — 10 November2026

Same independent reviewer: `course-workspace-independent-final-auditor`, separate agent `/root/course_workspace_final_audit`. The fresh implementation finished at `2026-11-10T09:36:51.839Z`; this affected follow-up actually started at `2026-11-10T09:42:05Z`, with evidence closed at `2026-11-10T09:44:07Z`. The initial audit, red finding and cutoff above are preserved as historical evidence.

**Current disposition: bounded source audit complete; CW-AUDIT-01 FIXED for this new fingerprint, with no open blocker/major found.** Complete same-head CI/aggregate/strict release and exact-head public verification remain separate pending delivery gates. This follow-up approves no merge, infrastructure/provider change, production operation or human learning claim.

### Fresh source identity and affected scope

Independently rebuilt the native Git changed/untracked path union, normalized actual bytes and recalculated all **43 snapshot hashes** and the fingerprint without importing the candidate readers. Both the file map and fingerprint match the fresh record:

```text
3f5e20c0f5fce03292b209e308d33b53148c049d035be81b0b0581335375182e
```

Native blob verification found **22 declared edits,21 additions,3,250 preserved c2 paths**, no unknown actual paths and no hash mismatch. The additional admitted baseline path is `tests/portal-fidelity-preservation.ts`. HEAD was still c2; this is the newly stamped working-tree candidate, not a new commit identity.

Independently compared the20 initially reviewed runtime/migration/setup files against their original audit SHA-256 values: all remain identical. Initial capture provenance and all five PNGs also remain identical. The affected changes are test-only admission/readers, their native guard, finite source manifest and the contract's historical-test appendix. This permits reuse of the original runtime, visual and learning-boundary review without another whole-project audit or browser run.

### Trust and assertion review

The final course reader natively validates the exact actual path union and every declared edit/addition before use. It returns unchanged files as freshly read actual bytes; it does not substitute c2 bytes for an undeclared base mutation. An edited file must match its approved current hash on each read before exact c2 projection. New paths are refused as historical paths; cached c2 buffers are copied defensively. The large admitted-byte cache and stat/hash approximation from superseded experiments are absent.

Traced the existing baseline admission through its complete path/hash validation: unchanged native bytes reach the original complete-baseline check; approved course edits reach that check only after finite hash admission. Baseline admission runs unconditionally as a module precondition before exposing historical readers. The Fidelity module likewise performs its existing complete validation before historical assertion bodies. A failed precondition throws during import and fails the suite; validation is not skipped or converted to a successful test.

Independent native TypeScript AST comparison confirms that the only extra non-import statements are exactly:

- `readPortalBaseline('AGENTS.md');` in `tests/baseline-preservation.ts`.
- `readFidelityHistory('AGENTS.md');` in `tests/portal-fidelity-preservation.ts`.

After removing those two exact final calls for comparison, every original statement/function/assertion matches c2. The original first-main guard still differs only in imports. The new native guard pins those initializer forms, independently hashes the whole actual candidate, retains old-engine/assertion/missing/unknown-path negatives and adds buffer/new-path checks. No runtime imports, old assertion changes, timeout/retry/worker changes or trust bypass were found.

### CW-AUDIT-01 closure evidence

Reviewed the retained unchanged-c2 comparison JSON:16/16, no pending/skipped tests, with the four long original bodies at2391/3604/2924/3960ms. The actual worker CPU profile attributes approximately2615ms to hashing,1420ms to reads and388ms to lstat, supporting the concrete duplicated-reader-cost investigation. These measurements do not establish the cause of unrelated old flakes or the original new-PG cold-time observation.

Reviewed both the superseded precondition experiment's26/27 red JSON and the final finite design's **27/27** JSON. The latter has no failed/pending tests; original landing/remediation/Studio/topology bodies are1468/2912/3046/2551ms at the unchanged5000ms limit. Thus the intermediate failure is retained and not relabelled as the final successful result.

Inspected `fullcheck-third.log` from its complete fixed command through successful normal production build: **1506/1506 Vitest across120files,72.38s;35/35 Node;503/503 curriculum**, and all type/lint/format/docs/quality/AZ-900/assets/legacy stages. The primary recorded process exit0. Unlike the prior red runs, Node and build were actually reached and completed. This complete pass, the finite reader correction and preserved original checks close **only CW-AUDIT-01** on the new fingerprint. The initial failure record remains valid for the old fingerprint.

### Six-domain follow-up and remaining limits

| Domain     | Follow-up disposition                                                                                                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content    | Complete for the bounded change. Original content/source bytes and workbench claims are unchanged; reviewed appendix accurately describes the revised test trust boundary. No human SME/learning approval. |
| Technical  | Complete. Runtime/SQL/setup bytes match the initial audit; affected reader trust was reviewed as above. No new major found.                                                                                |
| Visual     | Complete for this unchanged scope. Same provenance/five image bytes; initial visual inspection retained. No new image/browser run claimed.                                                                 |
| Assessment | Complete. Original stores/rubrics/Journal/XP and technical-only `learningAttempt:null` boundary remain unchanged. No one-engine grading or v2 migration claim.                                             |
| Guidance   | Complete. No runtime/provider/guide change since the initial review; neutral technical navigation remains separate from learning orchestration.                                                            |
| Regression | Complete for local source/check acceptance. CW-AUDIT-01 fixed by the reviewed correction and complete1506-test check. Full518-case candidate CI/aggregate/strict and public verification remain pending.   |

The inspected browser plan validates518 cases (465desktop+53compact),930 legacy cases and1worker; it is collection evidence, not execution. The earlier7/7 actual course browsers remain applicable to the independently verified unchanged runtime, and do not replace the complete candidate profile. The final normal build creates a new build identity; the retained images continue to identify their earlier actual build honestly.

Performed in this follow-up: independent43-file fingerprint/raw union and20-file runtime continuity checks, AST/helper review, image/provenance continuity checks, inspection of actual comparison/profile/targeted/fullcheck/plan evidence and `git diff --check`. No full suite, PostgreSQL mutation or browser run was launched by this reviewer. Earlier baseline timing/Compute/Axe/paint findings, moderate development-tool findings, unestablished PG timing and all human-validation limits remain open as previously documented.

## Affected follow-up — CI136 navigation helper

Same independent reviewer: `course-workspace-independent-final-auditor`, separate agent `/root/course_workspace_final_audit`. New implementation finished: `2026-11-10T10:12:08.288Z`. Actual follow-up start: `2026-11-10T10:12:43Z`. Evidence closed: `2026-11-10T10:19:45Z`.

**Current disposition: bounded source audit complete; CW-AUDIT-01 remains fixed and CW-AUDIT-05 below is fixed for the reviewed test-helper change. No open implementation blocker/major found.** Full current-head518-case CI/aggregate/strict release and exact-head public verification remain pending. The failed CI136 run remains failed; neither targeted success nor the earlier green CI check job replaces that complete delivery gate.

### Candidate identity and exact change

Independently reconstructed native changed/untracked paths, all43 snapshot SHA-256 values and the current fingerprint. File map and fingerprint match the fresh stamp:

```text
4e8f9e47a3f701a144327fce3172ba70a628104423dd62365d3d1a75413b36c6
```

Compared actual snapshot hashes against published head `807a2d0beb38699795657aae579b20471cfa7ed5`. Only `tests/e2e/course-workspace.spec.ts` and its source-manifest hash changed. Runtime, original engines/SQL/stores/assessment/guidance, previous reader correction, settings and inspected image/provenance bytes are unchanged. The native finite source union matches c2 plus its22 declared edits/21 additions, with no hash mismatch or unknown actual path.

An independent exact-text comparison proves that removing only three explanatory comment lines and the two new readiness assertions from the new test helper reproduces the complete807 browser file byte-for-byte. Every prior test/helper action and assertion remains. The helper now awaits the visible Laboratory frame and disappearance of its actual loading status before deciding whether the drawer needs toggling. It adds no delay, force-click, retry, timeout or worker change.

### CW-AUDIT-05 — MAJOR, FIXED: new helper mistook an unmounted Portal for a closed drawer

CI136/run `42793589155` checked published head807 through its synthetic merge revision. The inspected check log confirms1506 Vitest,35 Node,503 curriculum and successful build. Browser shard2 then failed the **new** free-memory/course-isolation test in its original attempt and both unchanged retries; its retained raw log records1failed/129passed. Complete CI acceptance was not achieved.

Independently read all three original trace ZIPs and the failure context under the private `evidence/ci136` directory. They establish the same causal sequence, rather than merely three generic timeouts. In the original trace:

- The landing Lab-card click starts at83377.405ms and returns at83444.972ms.
- `service()` calls navigation `isVisible()` at83446.622ms while frame snapshots still show `/`; it immediately returnsfalse because the Portal has not mounted.
- The helper then starts an auto-waiting menu click at83450.072ms. The free Portal arrives at83506.826ms with its menu already open and `aria-expanded=true`.
- That queued click closes it: the83514.005ms snapshot has `portal-collapsed` and `aria-expanded=false`. The following Resource groups link click waits until the unchanged30000ms test timeout.

Both retries independently show the same root-page visibility check followed by closing the newly arrived open Portal. This supports a specific synchronization error in the new test helper; it does not establish a product navigation or ownership defect, or explain earlier unrelated flakes.

The corrected native isolation trace provides the corresponding positive witness: visible-Laboratory expectation27845.782–27875.687ms, loading-status expectation27887.675–27891.796ms, navigation visibilitytrue at27894.870ms, then direct Resource groups click27914.861–27941.867ms. No menu toggle occurs in that return sequence. The original isolation/resource/reset/learning-byte assertions then complete successfully.

### Actual retest and six domains

The fourth fullcheck stopped at formatting in the excluded QA Markdown. That failure remains retained. Following the formatting correction, inspected `fullcheck-fifth.log` confirms the complete unchanged-source command through normal production build: **1506/1506 Vitest in120files,77.47s;35/35 Node;503/503 curriculum**, plus all mandatory source/type/lint/format/docs/quality/assets/legacy gates. The primary captured exit0.

Independently inspected `native-final.log`, `native-final.json` and the corrected isolation trace: **7/7 (6desktop+1compact),59.4s,1worker,all retry0**, with0skipped/0unexpected/0flaky. These are actual normal-build/local-PG executions, including the previously failing isolation journey. Tracing was enabled; this targeted run is not a complete518-case receipt.

| Domain     | Affected follow-up conclusion                                                                                                                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content    | Unchanged; reuse the prior bounded audit. No new lesson/source/claim.                                                                                                                                                              |
| Technical  | Runtime and evidence/ownership bytes unchanged. Trace review supports the precise test-helper cause and correction; no new runtime major found.                                                                                    |
| Visual     | Runtime and previously inspected images/provenance unchanged. New native accessibility/compact witness passed; no new visual or human-review claim is inferred.                                                                    |
| Assessment | All original first/help/retry/stores/rubrics/Journal/XP bytes and the technical-workbench/v2-grading boundary remain unchanged.                                                                                                    |
| Guidance   | No runtime, provider, guide or learning-orchestration change.                                                                                                                                                                      |
| Regression | New helper race fixed within its observed scope; all original test bytes/assertions retained. Complete local check and actual7-case retest pass. Current-head complete CI/aggregate/strict and public verification still required. |

Performed by this reviewer: native43-file fingerprint/raw-union and published-snapshot comparison; exact test-body preservation check; all three original failure-trace inspections; final positive isolation-trace/JSON inspection; fullcheck/CI-log review and `git diff --check`. No suite or browser was launched by this reviewer. Only this audit report was written. The original CI136 failure, both earlier fullcheck failures and all unrelated/human-validation limitations remain preserved.
