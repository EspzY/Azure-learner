# Complete candidate browser verification across isolated jobs

This is bounded execution maintenance for the owner-requested Resource Platform work. It changes CI allocation and complete-evidence verification. It changes no application resource rule, historical evaluator, technical receipt, teaching, assertion, worker, retry, timeout or skip.

## Why this change is necessary

The retained serial Application runs reached the existing 35-minute browser-job cap twice. Quality123 completed 450/475 unique cases. Final [Quality125](https://github.com/EspzY/Azure-learner/actions/runs/42658647646), on Application head `8f734b69561c4de711c2ccee23345e63778943a3` and actual tested merge `cc4f4b6035a6eccdabb38582bbfd191ed3517485`, completed 474/475: all 425 desktop and 49/50 compact, zero observed failed attempts/retries. The job was cancelled before the remaining case completed, before any full-profile receipt and before strict release. Dependency download was fast in that run. These are incomplete failures, not 474 or 450 substitutes for acceptance.

[Original retained output](reviews/evidence/parallel-resource-platform/ci/verify-job-129305439723-FINAL-8f734b69-CANCELLED.log.raw), [machine counts](reviews/evidence/parallel-resource-platform/ci/analysis-FINAL-8f734b69-CANCELLED.json), [terminal job metadata](reviews/evidence/parallel-resource-platform/ci/jobs-FINAL-CANCELLED.json) and [capture provenance](reviews/evidence/parallel-resource-platform/ci/capture-provenance.json) remain reviewable. The original captures remain outside the checkout; committed raw logs normalize only CRLF to LF, with both hashes recorded.

The prior [collection study](RESOURCE_PLATFORM_CI_STUDY.md) establishes the isolation and receipt risks. The final 475-case plan also had an exact four-shard collection union, 119/119/119/118. Collection proves no browser execution or speedup. Neither sharding nor a later green run establishes the cause of earlier Compute, Axe, hydration, runner slowdown or public scripted timeouts.

## Active job graph

`check → browser[1..4] → verify`

- `check` retains the complete `npm run check`, isolated PostgreSQL integration suites, normal production build and `npm audit --audit-level=high`. It publishes the actual immutable checkout SHA and current positive run attempt.
- Each browser matrix member has its own pinned PostgreSQL 17 service, dedicated checkout, runtime/test databases, same-revision historical review build, Next process, Chromium contexts, output and artifact directories. Four jobs can execute simultaneously; each keeps one Playwright worker and the unchanged configuration/retry/test-timeout/skip rules. Every job retains a 35-minute cap. `fail-fast: false` retains the other jobs' diagnostics after a failure and never permits acceptance of a failed union.
- Required `verify` uses `always()`, requires both prerequisite results to be successful, checks exact event/check/actual SHA and the current run attempt, downloads the four uniquely named bundles, independently verifies the complete execution union, and immediately invokes the original strict-release command against the actual PR base.

Aggregate has no database or application server: it validates evidence and recollects test identities. Browser mutations only occur inside the original tests against that job's isolated backend. No learner or World data is shared among jobs. This increases simultaneous environments and compute; it does not increase workers in a test process or promise a runtime bound.

## Planner, runner and evidence ownership

The unchanged mandatory `scripts/e2e-plan-check.mjs` still checks the complete desktop plan and justified compact witnesses against the legacy collection. The new planner independently collects the current full plan and all four native shards. Identity includes the project, relative source location, full suite/title ancestry and repetition identity. It rejects ambiguous identities and requires the shards to be disjoint and to have exactly the full plan's union. Case counts are observations, not a hardcoded permission to omit future additions.

`scripts/e2e-shard-runner.mjs` accepts no CLI selectors. Its only shard choice is an integer 1–4 from the fixed CI matrix. It owns the historical same-revision fixture build and runs the current desktop configuration with its native shard. The original Playwright configuration, HTML report, raw log, actual JSON results, retry attempts and traces remain available. A failed child, signal, malformed report, skipped/unexpected result or incomplete collection cannot create successful evidence. The runner never writes the release record or a full-profile receipt.

Artifacts use `browser-RUN_ID-RUN_ATTEMPT-INDEX`, each containing one bundle. Their fixed ignored local parent is `.artifacts/ci-shards/`. Upload runs on success or failure, uses an exact bundle path and errors on missing files. It does not upload `.env`, database secrets or the checkout. Download uses the current run/attempt and preserves the distinct artifact directories. Retention is seven days, so CI logs and PR delivery notes must record actual results before expiration; absence of an expired trace is not a causal investigation.

## Fail-closed complete aggregate

`scripts/e2e-shard-aggregate.mjs` independently establishes all of the following before writing complete candidate evidence:

1. Check and every browser matrix member terminated successfully in this workflow attempt. Failed/skipped/cancelled prerequisites, absent output or stale check attempt fail.
2. Actual checkout equals the immutable event SHA and successful check output. The actual tested PR merge SHA remains distinct from the delivered PR head.
3. Exactly four artifacts have the expected names and indices. Every bundle agrees on repository, run, attempt, base, SHA, reviewed fingerprint, source/configuration/toolchain identities and historical build fixture provenance.
4. Retained report files match their hashes; actual executed identities exactly equal the independently collected shard plan. Their disjoint union equals the complete plan. Missing, extra, duplicate, skipped, wrong-project, expected-failure or nonexecuted collection rows do not qualify.
5. Child completion, final case outcomes, report errors and retry records agree. Existing successful-retry semantics remain; flaky cases and original failures must be reported honestly.

Only then does aggregate record the successful required same-SHA/current-attempt GitHub check job as explicit `candidate-ci-check` evidence for `npm run check`, write `.artifacts/ci-shards/aggregate.json` and an explicit `candidate-full-profile` verification entry with command `node scripts/e2e-shard-aggregate.mjs`. This does not pretend that one unselected serial child ran. The entry binds actual SHA, current fingerprint and retained aggregate evidence. Strict validation synchronously rechecks this evidence and actual HEAD; a plausible hash or count alone cannot pass. Strict release runs immediately afterwards. Workflow success and public preview verification remain separate gates.

A rerun of only failed jobs cannot mix old-attempt bundles with a new attempt. **Rerun the complete workflow.** The fixed old `scripts/verify-desktop-ci.mjs` and `npm run test:e2e:desktop` remain available unchanged for complete serial execution and keep their existing acceptance and negative tests.

## Preservation and required validation

The old PR72 serial workflow test keeps every original substantive assertion through a finite hash-bounded historical reader. New tests inspect the actual active workflow and execute its real Bash guards. The current raw filesystem preservation guard admits only enumerated CI/quality/documentation paths in addition to the already reviewed Application integration paths. All historical evaluator, SQL, course, asset, rubric, learning-store and browser-test bytes remain frozen, except the previously documented explicit model selection and import-only historical adapters.

New negative tests exercise invalid prerequisites/attempts/SHA, missing or stale artifacts, malformed/truncated reports, hash/config/fixture mismatches, duplicate/missing/extra/skipped executions, selected commands and failure masking. Every old quality fixture and substantive assertion remains. A fresh full check, post-stamp separate audit, actual complete new-head matrix/aggregate/strict and anonymous exact-head normal-preview journey are required. No local fixture, collection or synthetic negative-test report is credited as actual CI acceptance.

Implementation, targeted results, audit and delivery results are recorded in [Application QA](quality/APPLICATION_PLATFORM_QA.md), [separate final audit](quality/APPLICATION_PLATFORM_FINAL_AUDIT.md) and Draft PR75. Until the new workflow actually completes, this is a candidate allocation, not a passed release or a solved timing guarantee. No merge, production deployment, external infrastructure or credential change is authorized.

## Local timing failures remain open

The first complete local invocation of this amendment passed1,171/1,172 Vitest cases but hit the unchanged5-second historical topology-preservation timer at6.114seconds. An isolated repeat reached6.628seconds. A later instrumented diagnostic passed3/3 in2.66seconds without a source change; instrumentation did not attach to the worker, so it is not a causal explanation. A strace diagnostic again failed at5.667seconds and confirmed83 successful Git processes, with observer overhead explicitly unresolved. An outside-only batched-read experiment saved roughly0.54seconds but did not explain the full variance; no new cache, parser or historical-helper change was implemented.

A second complete local invocation failed a different unchanged5-second Serverless conservation test at5.532seconds during curriculum checking (502/503 passed). Neither invocation reached the remaining Node tests/normal build, so neither is a completed whole local pass. Original logs and read-only findings are retained; later successful targeted tests or actual CI do not close these causes. No threshold, assertion, worker or retry changes are permitted.

The repository's whole-check entry remains pending. Actual CI must run the complete literal `npm run check` and dependency audit successfully before any browser job can be admitted. Only after that exact prerequisite and all four executed shards pass may aggregate record actual check and browser evidence. A local pending/failed check is never manually relabeled as passed, and failed/skipped/cancelled CI prerequisites cannot write either entry. Exact-head complete CI and strict release remain the delivery authority.

The later complete unchanged local command passed **1,172 Vitest in100files,35Node,503curriculum, real isolated PostgreSQL and the normal production build**, with no source/assertion/threshold change to obtain the pass. The51focusedtechnical cases and35Node tests also passed separately. The earlier failures, including an initial48/51focused run with three unchanged5-second timers, remain retained; timing causes are still OPEN. Successful local execution does not replace authoritative new-head CI. The checked-in check entry deliberately remains CI-pending and will be replaced only by actual successful prerequisite/full-union evidence.
