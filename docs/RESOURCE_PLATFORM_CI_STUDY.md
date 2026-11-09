# Parallel resource development: integration and CI review

Prepared 9 November 2026. This review inspected `/workspace/Azure-learner` at `249833f7cb7ea41d3e411444ec3c4f83805d3a5f` (verified PR72 base for the parallel task). It does not authorize workflow activation, external infrastructure, credentials, migration, merge, deployment, or human approval. No source or workflow changes were made for this review.

## Recommended boundary

Keep three independent branches. A owns the successor model, transaction/replay integration and its operative App Plan/Web App/Deployment/Settings vertical. B and C deliver independently testable, pure resource libraries. They must not register commands, change the current engine/model, add UI, or create substitute stores to demonstrate their libraries.

Do not implement CI sharding in these product branches. Native four-way collection is feasible and conserves the complete current plan, but collection does not demonstrate runtime stability or a speedup. Activate a separately reviewed orchestration change only after isolation, receipt aggregation and negative gate controls exist and have been exercised.

| Branch         | Working tree                               | Owns                                                                                                                                                                                                                   | Must leave to A/integration                                                         |
| -------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| A: application | `/workspace/azurelab-parallel/application` | New model/version; App Plan, Web App, Deployment and Settings; central World/request/receipt/dispatch; repository/API/temporary adapter admission; additive SQL; actual Portal/Studio projection and integration tests | B/C library internals                                                               |
| B: delivery    | `/workspace/azurelab-parallel/delivery`    | Pure Front Door/Application Gateway types, validation, dependency declarations, immutable proposal/analysis functions, fixtures and unit tests in a new folder                                                         | Model registry, host command switch, SQL, repository, API, UI, course/store changes |
| C: data        | `/workspace/azurelab-parallel/data`        | Pure SQL/PostgreSQL/Function types, validation, dependency declarations, immutable proposal/analysis functions, fixtures and unit tests in a different new folder                                                      | The same shared host surfaces                                                       |

The following contract is a proposed integration interface, to be finalized once by A before cross-branch coupling. Paths for B/C should be agreed once, such as `src/laboratory/modules/application-delivery/` and `src/laboratory/modules/data-serverless/`. Do not put new tests under historically frozen `src/domain/` paths; PR58 already exposed that failure mode.

## Concrete shared integration contract

1. **One version owner.** A selects and registers one successor to `laboratory@3.7.0`; B/C do not create competing `3.8` registries. Existing workspaces stay pinned to their original model. Opening the Portal, changing a storage adapter, or importing a library never upgrades them.
2. **One World and one writer.** Each library owns typed resource records and a state slice inside the eventual successor World. It receives explicit immutable input; it never holds a second inventory, module singleton, provider, localStorage key, database connection or network client. A alone commits the successor World and original receipt.
3. **Pure module decision.** A suitable common shape is `evaluate(command, ownedState, readonlyHostContext) -> decision`. The accepted decision contains the proposed next owned state, typed resource/dependency changes and allocation count; a denial contains a bounded code and optional field. It does not perform a commit, increment host revision, append events, issue receipts, award XP or claim runtime execution. Host context exposes deterministic typed reads and an allocation proposal based on `nextId`, never a mutable counter or arbitrary callback that writes state.
4. **Stable identity.** Reserve command discriminants, resource type strings, collection names and ID prefixes once. Cross-module references use actual stable typed resource IDs with group/subscription/region checks. Do not infer a Web origin, SQL server, plan or storage resource from its display name. B/C tests can supply a typed read fixture without importing A's unfinished implementation.
5. **Host envelope.** A retains `commandId`, expected revision, sequence, attempt, model and workspace identity. It applies revision/shape/unknown-field checks before mutation and enforces the combined resource/event/byte budgets. Review runs the same validation without publishing state. One accepted operation increments revision once; one transaction records its complete result. Failed compound dependencies leave no partial resources.
6. **Original receipt semantics.** A maps module decisions into the successor's explicit receipt contract. Before/after and resource-change fields must describe the actual operation. Module tests do not manufacture host receipts or relabel a proposal as committed evidence. Duplicate command IDs and changed-payload conflicts stay owned by the existing repository/temporary transport semantics.
7. **Preserve slices on delegation.** When the successor delegates an inherited command to a frozen evaluator, explicitly preserve all new resource slices that the inherited operation does not change. Reset and group/resource dependency checks must deliberately cover the new slices. Spreading a legacy result into a successor World can otherwise erase additions or permit deletion of a referenced parent.
8. **Analyses stay bounded.** Module analyses are deterministic reads of declared configuration. Front Door/Gateway configuration is not measured connectivity or health; deployment configuration is not actual application runtime; SQL/Function configuration is not a live database, query execution or function invocation. Unsupported assumptions return an explicit unknown/unsupported result.
9. **No learning coupling.** Free technical resources do not create learner activities, assessment stores, mastery, first submissions, guidance or XP. Original course/v2 and frozen Laboratory histories remain readable/fullfillable. Any later course adapter needs its own authorized versioned evidence contract.

Current integration seams are `src/laboratory/engine.ts:18` (model list), `:29` (World), `:31` (latest Request), `:38` (parser), `:39` (fresh), `:55` (execute), `:75` (replay). A must handle all of them together: adding a model only to the list does not admit its commands or prove replay. The repository at `src/laboratory/v3/repository.ts` imports that dispatch and is already the transaction authority. The PG server and `src/app/api/laboratory/ephemeral/route.ts` separately admit models; the temporary endpoint currently explicitly accepts/verifies only `3.7`, including a strict model check in every replayed entry. UI capability/projection code also enumerates models explicitly.

Minimal integration verification is old-model golden replay plus successor validation/dependency/identity/budget/reset tests, then actual PG rollback/concurrency/idempotency and the corresponding temporary transport tests. Neither storage path should invent a second resource evaluator. UI assertions are required only where A makes real UI changes; B/C libraries can be tested directly.

## Preservation guards: actual blockers and safe adaptation

`src/pr72-shared-portal-preservation.test.ts` reads every original PR71 path and partitions it exactly once into technical/build, assets/docs, screenshots and locked evidence. It computes raw `git hash-object --no-filters` hashes, pins the finite approved file list and also checks all declared additions. It rejects ordinary changes to the engine, API, adapters, workflow, tests and documentation, even when the new user request authorizes them. New versions must therefore have an explicit current-base preservation layer; simply altering a historical manifest or hiding a new path is insufficient.

`tests/pr72-preservation.ts` is already a bounded reader: it checks current after-bytes and original before-bytes before returning historical bytes to old tests. `src/laboratory-pr71-preservation.test.ts` and `tests/pr71-preservation.ts` use that chain. Older preservation files keep their original substantive assertions. `src/pr72-ci-workflow.test.ts` is stronger than a loose YAML check: it requires the exact PR72 serial workflow reconstruction, exact browser wrapper bytes, and executes actual Bash status/SHA guards. A future sharding workflow necessarily conflicts with it and needs an explicitly bounded historical adapter plus new actual-workflow controls.

For the authorized A changes, the root's proposed `tests/resource-platform-preservation.ts` adapter is safe only under these conditions:

- Pin the new baseline to the complete `249833f7cb7ea41d3e411444ec3c4f83805d3a5f` tree. The historical image returned to PR72 tests is the original **current-base** bytes, which can then pass through the existing older chain.
- The new direct guard uses raw `node:fs` and raw Git, never the compatibility reader. It pins the finite approved paths and before/after identities, verifies all other original files unchanged, and checks new implementation/evidence files independently. No blanket folder/prefix exception replaces this check.
- Adapt an old test only by its exact import delta. Assert the complete adapted source equals the original source after that exact replacement; test bodies, assertion logic, settings and fixtures remain intact.
- An `execHistorical73` helper may intercept only the exact `git hash-object --no-filters -- <paths>` call shape needed by the old guard. For each approved changed path, first validate actual raw bytes against the new after binding and original baseline bytes against the before binding, then supply the baseline hash to that historical guard. Hash all untouched paths from their actual bytes. Unknown commands/flags must run raw or fail; never silently normalize them.
- Keep dependencies one-way: tests → reader → literal proof; new direct guard → raw filesystem/Git and proof. Never import the new guard from the reader, introduce a reader/guard cycle, or use the reader at runtime.
- Negative checks should expose a tampered after hash, unauthorized path, modified old assertion, unknown command form and actual filesystem mutation. Modifying the proof and the target together cannot become an unrestricted exemption because the direct guard pins the finite set and independent base identities.

B/C can add new library files and tests without adapting historical assertions if no original authority bytes change. Their release `preservedPaths` must still avoid protecting their own new folders. Historical evidence, old tests and all 468 browser assertions/settings stay preserved.

## Pure B/C release records without dummy UI or pedagogy

The existing validator is not automatically a pure-library schema. `scripts/quality-check.mjs:119` requires eight layer arrays per activity; `:150` requires an activity; `:151` requires manuscript modules only for `scope.kind === 'new-module'`; strict validation at `:230` requires inspected visual evidence. The current PR72 record also declares broad `src/laboratory/`, `database/` and `scripts/` prefixes preserved, so copying it for new library work makes strict snapshot validation fail for legitimate additions.

There is an honest existing precedent, so a validator change is unnecessary for these focused branches. The actual PR58 release at commit `081d74d` uses `scope.kind: platform-contract-and-preservation-tests`, `modules: []` and an activity whose limits say: **“Technical contract verification, not learner activity or a new competence.”** It maps technical documents/models/tests and unchanged assessment/SavvyShark preservation into the existing evidence fields. Its inspected images show the actual unchanged Portal. `docs/quality/PR58_FINAL_AUDIT.md` explicitly distinguishes those checks from new content, UI or learning validation. The early PR58 practice pointer was subsequently corrected after CI caught a new test under a frozen domain path; copy the pattern, never obsolete paths.

Recommended B/C record content:

| Existing field                  | Honest technical binding                                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `scope.kind` / description      | A bounded pure resource-library scope, not `new-module`; explicitly no operative registration/UI/learner activity                 |
| `sources` / claims / objectives | Actually reviewed official sources for supported semantics and explicit local simplifications, using engineering objective IDs    |
| `activities[].limits`           | State that this is a technical evidence binding, not learner practice, instruction, new assessment or competence                  |
| `theory`                        | Actual library contract/source-boundary document                                                                                  |
| `mechanism`                     | Actual library implementation and dependency/validation contract                                                                  |
| `practice`                      | Actual library unit and negative tests                                                                                            |
| `feedback`                      | Real denial/result/unsupported explanations and tests; no invented learner feedback flow                                          |
| `visual` / `accessible`         | Fresh inspected evidence of unchanged actual Portal, honestly labeled preservation; no image purporting to expose the new library |
| `assessment`                    | Raw current-base preservation proof for original assessment/store/first/help/retry/XP contracts                                   |
| `savvyshark`                    | Existing preserved guidance/mission context plus preservation proof; no fabricated new guidance                                   |
| `assessmentStatus`              | `unchanged-existing`                                                                                                              |
| `modules`                       | Empty; no new pedagogy was requested                                                                                              |

This retains the existing seven gates, all six independent audit domains, implementation-finished/stamp ordering, final complete candidate CI and strict release. Existing human review fields stay `unperformed`. New official-source review and fresh actual preservation images are work that still must be done; old PR58/PR72 images are not new branch execution evidence.

Replace broad preserved prefixes only as far as the actual branch scope requires: keep all existing `src/domain/`, course/features/app/content/asset authorities, frozen `v3`–`v37` directories, old engine/adapter/SQL files and historical evidence protected. Permit only the new agreed pure-library folder/test/docs additions. For A, enumerate exactly the authorized changed integration paths and preserve everything else with the independent raw-base guard. Do not drop the whole technical preservation boundary to admit one new folder or additive migration.

The current fingerprint includes `scope`, `sources`, `activities`, `modules`, `preservedPaths`, `gates` and changed-file hashes. Keeping new technical evidence inside these existing fields preserves fingerprint coverage without introducing unchecked extra metadata. A future explicit technical schema is a separate optional process change; it is not required for B/C and is not implemented here.

## Current CI and measured collection

`.github/workflows/ci.yml` currently has two serial jobs, each capped at 35 minutes:

1. `check` checks out immutable `github.sha`, publishes the actual matching HEAD, initializes its local PG service, runs the entire `npm run check` and `npm audit --audit-level=high`.
2. Required `verify` uses `if: always()`, rejects failed/skipped/cancelled prerequisites and empty/mismatched SHA, checks out the same actual SHA, initializes its own PG service, builds the historical review fixture, installs pinned Chromium, runs the fixed complete `scripts/verify-desktop-ci.mjs`, then immediately runs strict release against the actual PR base.

`package.json` retains `npm run test:e2e:desktop` as mandatory plan validation followed by the entire desktop configuration. `playwright.config.ts` has worker 1, CI retries 2, existing per-file timeouts and no overall test-suite timeout. The desktop config contains all desktop cases plus 49 exact compact witnesses. Preserve these settings and assertions.

Read-only local collection on the inspected base produced:

| Collection                 | Cases | Files represented | Observation                                                           |
| -------------------------- | ----: | ----------------: | --------------------------------------------------------------------- |
| Legacy                     |   838 |                 — | Both original desktop/mobile projects remain available                |
| Current complete candidate |   468 |                60 | 419 desktop + 49 compact; every collected expected status is `passed` |
| Native `--shard=1/4`       |   117 |                13 | Collection only, 3.906 seconds                                        |
| Native `--shard=2/4`       |   117 |                19 | Collection only, 3.608 seconds                                        |
| Native `--shard=3/4`       |   117 |                16 | Collection only, 3.988 seconds                                        |
| Native `--shard=4/4`       |   117 |                54 | Collection only, 3.782 seconds                                        |

The four case-identity sets were pairwise disjoint and their union exactly equaled the unselected 468-case plan. Identity included project, relative file, suite ancestry and title. The unselected collection took 2.925 seconds in that measurement. A separate `CI=true` collection confirmed worker 1, forbidOnly true, retries 2 for both projects, default per-test timeout 30,000 ms and globalTimeout 0. Explicit longer per-file timeouts remain in test source. A file can occur in more than one shard because the existing configuration is fully parallel; the case identity, not filename alone, is the conservation unit.

These observations prove collection conservation on this base. They do not prove browser execution, artifact isolation, equivalent assertion behavior, a future expanded case count, runtime balance, or a specific speedup. In particular shard 4 includes many compact cases; equal counts do not imply equal durations.

Retained PR72 timing evidence at `docs/reviews/evidence/pr72/failures/ci119-timing-comparison.json.raw` shows broad slowdown, including a 1.43 median ratio for matched non-Portal passing cases. The original cancellations and known Firewall retry remain open evidence. Sharding can distribute work; it does not establish or repair their cause.

## Job isolation requirements grounded in current code

The current workflow uses a separately instantiated pinned PostgreSQL 17 service in **each** job. App/browser work uses `azurelab_lab_ci`; Vitest integrations use `azurelab_lab_test_ci`. `scripts/laboratory-db.mjs` restricts setup to local dedicated names, creates the runtime/owner roles, applies cold migrations `001/002/008` and initializes the separate test database.

The integration suites explicitly fail on absent/nonlocal test URLs instead of skipping. Several stub `LAB_DATABASE_URL` to the isolated test URL in their test process. Normal tests create random anonymous workspaces; upgrade tests create random disposable test databases, apply actual historical migrations and drop those databases in `finally`. The `3.7` upgrade suite checks cold plus populated `3.2`–`3.6` paths and repeated setup. No hosted database is necessary or authorized.

Do not run multiple jobs against one shared database or one local PostgreSQL instance as a shortcut. `Repository.createSession` locks a shared admission row, limits admission to 100 sessions/minute and enforces a database-wide 2,048-workspace cap; runtime role/password setup is cluster-wide. Existing tests include intentionally denied writes and corruption injection into scoped workspaces. Job-level services isolate these shared mechanisms without weakening them. Local simultaneous branch tests would instead need separately owned PG clusters/ports and independently validated URLs; the current default 5432/3000 is not a parallel local harness.

Every browser job also needs its own checkout/work directory, `.next`, Next listener at its own isolated localhost:3000, browser contexts, output directory and reporter path. Per-test localStorage/cookies are in Playwright's normal isolated contexts; intentional same-context multi-tab races remain inside their original test. Preserve those tests unchanged.

`scripts/e2e-preview-build.mjs` is an explicit nonhosted historical Designlab fixture. It preserves actual Git SHA/environment SHA and changes only the spawned build's frozen historical review label. It rejects every `VERCEL`/`VERCEL_*` key. Every shard must build that same-revision fixture in its own job after the ordinary `check` build; do not spoof SHA, alter the runtime branch allowlist, reuse an uncontrolled `.next`, or treat fixture visuals as the public normal-build Gate 7. No learner/database state transfers between jobs.

Artifact isolation is a demonstrated requirement: `docs/reviews/evidence/pr72/failures/local-artifact-collision.log.raw` records trace ENOENT failures under a shared `native-results/.playwright-artifacts-*` path. Use unique run/attempt/shard directories and artifact names, not a shared `playwright-report` upload name for all jobs. Keep traces/screenshots/videos and raw logs for failed attempts and retries.

## Bounded future sharding design

Proposed graph: `check → browser matrix (1..4) → required verify aggregate/strict`. Every matrix job keeps worker 1, retries 2, all original timeout/skip policies and a 35-minute job cap. Four simultaneous jobs are additional parallel execution environments and must be explicitly adopted as such; they are not the unchanged PR72 serial allocation. Keep the legacy serial wrapper available during validation. `strategy.fail-fast: false` preserves diagnostic results from other shards; it never permits an aggregate pass after a failed shard.

### Ownership and artifacts

- The **planner** runs the unchanged full plan check, enumerates the current complete candidate plan and each native shard, canonicalizes identities and proves disjoint exact union before tests. It binds that plan to actual SHA, release fingerprint and configuration/source hashes. Do not hardcode 468 as the only completeness check: retain the original baseline and require the entire future plan including scoped additions.
- A **shard wrapper** owns one bounded shard index/total and executes the fixed current config with that native shard and approved reporters only. It accepts no arbitrary grep/project/file/list selectors, retry overrides or failure-masking shell. It writes only a `candidate-shard` result after child completion; it never updates the release record as `candidate-full-profile`.
- Each job uploads a uniquely named evidence bundle on success or failure: raw JSON/result log, blob report if used, actual test identities/final outcomes/retry attempts, build provenance, checked plan identity and an execution manifest. Keep original HTML/trace diagnostics; adding a machine-readable reporter must not remove them.
- The **aggregate verifier** checks out the same immutable SHA, reads the original reviewed release record, obtains the exact expected artifact set for this run/attempt and validates each bundle. Only that process can write the full candidate receipt, and only after every prerequisite and coverage check passes. Strict release follows immediately. Aggregate success and GitHub workflow success remain distinct from any public deployment check.

Proposed execution-manifest identity, all checked for equality rather than merely stored:

```text
schema/version; repository; workflow_ref/workflow SHA
event/tested Git SHA; actual checkout SHA; actual PR base SHA
GitHub run_id + run_attempt; shard index + total
review fingerprint; complete-plan digest; expected shard-plan digest
lockfile/config/test-source digests; pinned toolchain/browser identity
historical-fixture build provenance; artifact file digests
child exit/signal; reported final result; test identities and retry outcomes
```

Use relative paths in canonical identities. Include project, full suite/title path and repeat identity; reject ambiguous duplicates. Use actual reporters/runner results, not collection rows relabeled passed. A case is counted once at its final outcome; retries remain separately visible and cannot be summed as additional coverage. Preserve current successful-retry semantics and report flaky cases honestly. Missing, skipped, expected-failure or cancelled executions cannot satisfy currently expected-passed cases. If an inherited authorized skip exists in a future plan, pin its identity/reason explicitly; never create a broad skip allowance.

The aggregate must independently establish:

1. `check` and every expected matrix member terminated successfully; failed/skipped/cancelled/absent jobs fail required `verify`, including when GitHub would otherwise skip a dependent job. Keep `if: always()` plus an explicit fail-closed prerequisite guard.
2. Actual HEAD equals event SHA, prerequisite SHA, every shard's tested SHA and the receipt SHA. The PR event can use a synthetic merge SHA; distinguish that actual tested revision from PR `head_sha` and never mix them.
3. Every artifact has the same run, **run attempt**, base, reviewed fingerprint, complete plan, dependency/configuration and fixture identity. Require exactly indices 1..N, one bundle per index. A rerun of only failed jobs cannot silently mix previous-attempt evidence; either deliberately design and audit that policy or require a complete fresh attempt.
4. Reported test identity sets equal their independently collected expected shard sets; their disjoint union equals the independently collected complete plan. Reject duplicate bundles, missing tests, count-only substitution, foreign project tests and additional unexpected results.
5. Execution completed with successful final outcomes under unchanged worker/retry/timeout/assertion/skip settings. A child exit 0 alone is insufficient to establish union completeness. Results/errors/signals in machine output agree with process status.
6. Only then write a new aggregate-owned full-profile receipt bound to actual SHA/fingerprint and the aggregate evidence digest, and run strict release on that same snapshot/base. No shard JSON, merged HTML report or successful collection alone can write it.

Current `scripts/verify-desktop-ci.mjs` deliberately accepts no CLI selectors and owns exactly `npm run test:e2e:desktop`; its success contract cannot honestly describe a selected shard. Keep it intact for serial execution and add distinct shard/aggregate helpers, or version an explicitly reviewed new interface. Do not pass extra arguments to the existing wrapper or write its success receipt manually.

Current strict `scripts/quality-check.mjs:240` checks a valid 40-character receipt commit and matching fingerprint, but does **not itself compare that commit to actual HEAD**. The wrapper and CI guards currently establish that binding. A new aggregate must compare it explicitly; a receipt from another syntactically valid SHA must not pass. Likewise, a new sharded receipt should use an explicit validated aggregate provenance variant, not pretend one fixed unselected command ran. Keep the old fixed-command acceptance and all its negative fixtures intact.

### Minimum future files and negative gates

Only a separately reviewed CI change should touch `.github/workflows/ci.yml`, add plan/shard/aggregate helpers and reporters/tests, and extend strict receipt validation in `scripts/quality-check.mjs` plus `scripts/quality-check.test.mjs`. Any package reporter/script additions, finite preservation-reader imports and process docs belong in that same bounded diff. Existing product tests and bodies, Playwright config worker/retry/timeouts, historical evidence and public runtime guards remain preserved.

Extend actual-workflow negative tests rather than deleting `src/pr72-ci-workflow.test.ts` coverage. Execute the actual revised guards and reject omitted dependencies, skipped aggregate, selected commands, reversed strict order, `continue-on-error`, `|| true`, custom shell/default/env masks, stale check outputs and SHA mismatch. Add artifact/result negatives for a failed or signalled shard, absent/duplicate/wrong-total index, old run/attempt/SHA/fingerprint/base/fixture, changed plan/config, missing/duplicate/unexpected/skipped case, successful collection without execution, truncated/malformed report, mismatched file digest and unrelated artifact. These are concrete receipt-integrity risks; do not replace them with tests that merely repeat implementation literals.

Run a real complete candidate execution after those controls pass. Record per-job checkout/setup/build/browser/aggregate durations, retries/flakes, exact union and artifact identities. Compare total elapsed time and compute cost with the retained serial evidence. A native collection union alone does not justify activation, and a passing shard is not a completed product delivery.

## Commands actually executed for this review

- `node scripts/e2e-plan-check.mjs`: passed; legacy 838, unchanged desktop 419, compact 49, candidate 468, worker 1.
- Native Playwright JSON `--list` collections for the full desktop config and `--shard=1/4` through `4/4`: passed; exact disjoint union 468, 117 per shard. No browser tests were executed by these commands.
- `CI=true` full JSON collection: passed; worker 1, retries 2, expected original config.
- `node --test scripts/quality-check.test.mjs scripts/e2e-preview-build.test.mjs`: 13/13 passed, no skips. Existing false receipt/failed child/stale fingerprint/hosted fixture negatives retained.
- `npx vitest run src/pr72-ci-workflow.test.ts src/pr72-shared-portal-preservation.test.ts`: 12/12 passed in 2 files; 9.30 seconds. This verifies the original actual workflow and raw-base guards, not a proposed sharded workflow.

No PG setup, domain migration, full browser suite, new branch build, external source retrieval, external CI or production action was performed for this report. The report's source claims are inspection findings and local collection/targeted-test observations; future branch acceptance, sharding performance and human validation remain unclaimed.
