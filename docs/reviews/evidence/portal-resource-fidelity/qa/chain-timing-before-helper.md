# Whole integrated-chain timing: retained failures and actual trace-on controls

Read-only investigation9November2026. No repository, test, assertion, timeout, worker, retry or skip was changed. No browser/build probe was run by this investigator. All original traces and copies remain private outside checkouts; only selected fields are emitted into sanitized analyses. The earlier22.4-second pass has no retained trace and is not used for action comparisons.

## Finding

The retained33.3-second candidate failure is a **whole-case30000ms deadline**, not evidence of a long Virtual machines selector stall. Its browser trace records551 calls (550 complete) before stopping at `jzpa@1438`. The test-runner trace records that same click finishing normally in170.246ms, followed by VM creation, title/row icon checks, screenshot and course-byte assertion during teardown after the timeout. Those late records explain the later error-context DOM at revision15; they do not convert the failed execution into a pass.

Fresh trace-on controls provided by the author give an actual comparison: parent325 browser calls versus candidate584, an increase of259 calls. Their recorded browser-action spans differ by7.181seconds, and Before Hooks→After Hooks intervals differ by7.192seconds, matching the reported22.3→29.5-second increase. Both perform the same15 accepted technical commands through revision15 and32 Laboratory API requests. Summed API response time differs by only0.236seconds. The measured extra work lies principally in navigation/helper/browser-query traffic; no long missing selector, intercepted click, failed technical command or database bottleneck is demonstrated. CPU/scheduler causality is unmeasured and remains unknown.

## Actual evidence set

| Execution                        | Recorded outcome                |      Browser calls |                           Browser-action span |              Before Hooks→After Hooks | Laboratory API requests / summed response time |
| -------------------------------- | ------------------------------- | -----------------: | --------------------------------------------: | ------------------------------------: | ---------------------------------------------: |
| Retained candidate failure       | 30000ms deadline, reported33.3s | 551 (550 complete) | 30.255s, cutoff before VM navigation finishes | 30.412s until timeout teardown starts |        30 /1.103s before browser tracing stops |
| Fresh parent trace-on control    | Pass, reported22.3s             |   325/325 complete |                                       20.012s |                               20.457s |                                     32 /0.759s |
| Fresh candidate trace-on control | Pass, reported29.5s             |   584/584 complete |                                       27.193s |                               27.649s |                                     32 /0.994s |

The browser-action span begins with the browser fixture's first recorded action, so it is not identical to the reporter duration. The reporter includes fixture/artifact teardown; the hook interval separately identifies the recorded pre-teardown span. Action-duration sums may overlap, particularly response waits and clicks, and must not be added as an exact wall-time decomposition.

Failed trace SHA256 `e6193c725d90c46ab1666d63cd84d9be4a6a661d0b5273586fdeb8ad1aa464fb`; it matches the author's stable private original `portal-fidelity-private-evidence/final-visual-first-chain.trace.zip`.
Fresh parent trace SHA256 `c6e162c3854f8849d2e55226ebb0ae64c2416dbc936ba76962502d7f51183603`.
Fresh candidate trace SHA256 `682dddcc1d3b6939e81daec7b8ef900b59c04bf4dfe74a52ea824d5f2b9a7f26`.

The failed candidate and green candidate controls are not asserted to be byte-identical whole trees: the author reports a bounded3.9 RG-breadcrumb presentation correction before the fresh control, with helpers/assertions/settings unchanged. Parent and candidate intentionally have different approved service-navigation/test-helper adaptations. Therefore this is an observed execution-path comparison, not a controlled pure-renderer or CPU benchmark.

## Why the failure screenshot is later than the browser trace

- Test-runner timeout error is immediately followed by `After Hooks` at monotonic38753.623ms.
- Browser trace last snapshot is39102.456ms, still `view=subnet&id=subnet-14`; last network command in that trace is accepted CreateSubnet revision14.
- Test-runner record `jzpa@1438` Virtual machines click is39090.587→39260.833ms,170.246ms, without an error. It is already parented to context-fixture teardown.
- VM Create and its response/accepted-outcome assertion are then recorded; title icon, All resources navigation, actual VM-row icon, screenshot and final course-byte assertion are recorded through40546.968ms.
- Context closes42011.904→42041.514ms; error-context attaches42055.254ms. Its All resources DOM at revision15 with VM/NIC/disk is consequently later than the browser-trace cutoff.

These are recorded continuation events after failure. Neither the revision15 screenshot nor those post-deadline assertions supply an accepted whole-chain pass. The incomplete browser trace alone must not be described as a blocked Virtual machines link.

## Recorded action differences in the two green controls

| Browser method     | Parent | Candidate | Difference | Summed duration difference |
| ------------------ | -----: | --------: | ---------: | -------------------------: |
| expect             |    107 |       209 |       +102 |                    +2.224s |
| queryCount         |      0 |        96 |        +96 |                    +1.213s |
| click              |     66 |        90 |        +24 |                    +1.149s |
| isEditable         |      0 |        19 |        +19 |                    +0.256s |
| evaluateExpression |     18 |        28 |        +10 |                    +0.176s |
| isVisible          |     16 |        24 |         +8 |                    +0.114s |
| waitForSelector    |     32 |        35 |         +3 |                    +0.200s |
| getAttribute       |      0 |         1 |         +1 |                    +0.005s |
| selectOption       |      9 |         5 |         −4 |                    −0.196s |

All other method counts are unchanged. Total increase259 browser calls. Median click duration is **lower** in the candidate (88.371ms vs98.904ms); median expectation duration is also lower (12.881ms vs16.203ms). The candidate has only two actions above250ms: initial goto913.706ms and initial3.9 entry visibility1663.800ms. Every later action is below250ms. No completed candidate click or selector wait approaches the five-second assertion limit.

Concrete navigation/helper observations:

- Browser calls directly carrying a `service()` test stack increase112→301 (+189), with summed recorded duration2.920→7.079s. These are stack-linked observations, not an exclusive wall-time partition.
- Service click count increases16→40 (+24), which accounts for the entire click-count increase. Candidate uses ten All services clicks (eight favorite links plus two directory fallback clicks), seven actual parent-resource table-link clicks and seven parent-menu section clicks. The older parent used direct child-family service links instead.
- Of96 candidate queryCount calls,79 belong to navigation/context/disclosure inspection and17 check the group-create form. Parent has none of that method.
- Direct title-icon helper stack calls increase9→30; it performs ten title checks instead of three. Row-icon helper direct stack calls remain6. The additional automatic family assertions are real added observations, not evidence of a slow image-loading wait.
- Fill-helper adaptation includes19 isEditable observations for actual locked/preselected fields; selectOption calls decrease9→5 while fill calls remain17.

This identifies measurable extra native-navigation and helper-observation work. It is not a recommendation to remove any assertion or bypass parent context. Any subsequent helper/presentation optimization needs its own approved bounded change while preserving the complete original technical chain, ordinary controls, original assertions and all settings.

## Network and DOM blockers

Both green controls have the same32 Laboratory requests and the same15 accepted command sequence, including App Plan/Web App/synthetic deployment, PostgreSQL/database/binding, Front Door profile/endpoint/origin group/origin/route, VNet/subnet and VM. All are temporary Laboratory API calls; this case does not prove a real database connection/runtime.

Parent summed API duration758.531ms, maximum38.359ms. Candidate summed API duration994.492ms, maximum120.174ms. The retained failure has1103.235ms summed API duration before its browser trace cutoff, maximum237.630ms for the expected initial401 unstarted-state check; its slowest accepted command is CreateFrontDoor95.660ms. There is no recorded slow multi-second API/receipt response.

Failed candidate's longest completed action is initial3.9 entry visibility1506.570ms, followed by initial goto1015.758ms and landing click348.509ms. Every other completed action is at most247.550ms. Its final Virtual machines locator resolves to the expected real link; the later test-runner record completes the click. No intercepted-pointer, disabled, hidden or unstable-element retry is recorded as a final blocker.

The earlier `fidelity-native-corrected-launch.log` records a **different** failure waiting for a main-content Architecture Studio link. Its referenced `native-results/.../trace.zip` was absent at investigation time. That old log must not be merged into this later trace's timing explanation. The retained native-initial error-context is preserved separately and is not substituted for the missing trace. The earlier22.4-second pass is also not used as an invented trace baseline.

## Scope and next checks

The fresh comparison establishes substantially more browser orchestration in the candidate, with the same accepted technical command sequence and no demonstrated individual blocker. It does not establish the cause of all run-to-run variation, general CPU slowdown, or a source-domain defect. The failed run remains failed; a29.5-second green control alone is not timing-cause closure.

Root/Fidelity author retain ownership of any implementation decision. Preserve all assertions and settings, use the shared heavy lock for any new native/build/full-check work, and keep the full candidate execution/strict release requirement. This investigator performed only light read-only parsing and kept source untouched.

## Files

`provenance.json` and `control-provenance.json` bind exact private originals/copies and the original logs. Per-execution `actions.sanitized.json`, `network.sanitized.json`, `summary.sanitized.json` and `test-runner-timeline.sanitized.json` retain selected fields only. `control-comparison.sanitized.json`, `function-span-counts.sanitized.json` and `hook-spans.sanitized.json` retain the calculations. Raw ZIP/network data may contain ephemeral local session material; keep it private and publish only separately reviewed sanitized summaries.
