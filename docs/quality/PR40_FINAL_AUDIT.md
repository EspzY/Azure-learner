# PR40 Independent Final Audit — P15

Independent implementation review **complete; no open BLOCKER or MAJOR**. Exact-head CI/strict release and deployed Gate7 remain pending. This is an agent review, not qualified human approval, release completion, a real security test, or permission to merge/deploy.

## Identity, timing and binding

- Reviewer: `security_p15_final_audit` (`agent`), separate from `codex-security-author`.
- Base: `385e76c1d544b992626d529dfca2130fbf01d42a`; branch: `codex/az900-security-principles`.
- Initial implementation stamp: `2026-11-01T15:21:42.251Z`; initial review started `2026-11-01T15:22:49Z`.
- Initial fingerprint: `0d477a38aa19f00353fc486d692e96cc0bf0f777f446eb65a40b249779f9f19e`.
- Final implementation stamp: `2026-11-01T15:33:58.227Z`; renewed delta review started `2026-11-01T15:34:29Z`; completed `2026-11-01T15:38:12.815876Z`.
- Final fingerprint: `ad3619f64feb63746c9c33ce7bd190493c4c51c2d8f7fd4a53e6d8ebbe13d914`. All 68 normalized snapshot hashes matched. Reconstructing the initially reviewed 67-file snapshot from staged bytes produced the exact original fingerprint above.

The only implementation deltas after the initial review were the two explicitly identified Identity A/B availability fields, the dated-source renderer and its regression, generated source-table metadata, and the accompanying Security documentation. Bank, key, model, guide, technical and P15 view bytes were unchanged. The matrix outside its dated-source block was byte-identical. These changed areas were reviewed after the final stamp; completed unchanged-domain work was retained.

## Sealed corrected-bank blind review

The first file opened was the supplied v4 packet. Before any keys, code, guide, source register, feedback, earlier review or quality record, I independently solved all 72 decision/reason pairs and recorded every choice, plausible alternative, causal rationale and cue/transfer challenge.

- Packet SHA-256: `643e57d5ec3b7048745552e31726b6d2c85c31e16134021518125aadcc9b7366`.
- Lock: `.artifacts/p15-final-v4-blind-security_p15_final_audit-20261101T152249Z.json`.
- Sealed at `2026-11-01T15:24:16.296422Z`, mode `0444`; SHA-256 `d18c8af1a5f04975b5fe8a36d8a74c843ef863e6940b00d474f772429012461d`.
- Seal was reported before keys were opened. It remained unchanged through both restamps.

| Case | Independently accepted decision/reason pairs (1-based) |
| ---- | ------------------------------------------------------ |
| sp01 | 3/1                                                    |
| sp02 | 1/3, 2/3                                               |
| sp03 | 2/2, 3/2                                               |
| sp04 | 2/1                                                    |
| sp05 | 2/2, 3/2                                               |
| sp06 | 1/2                                                    |
| sp07 | 3/3                                                    |
| sp08 | 2/3, 3/3                                               |

The actual final `securityItemsNb` packet fields matched exactly and all 72 judgments agreed with `security-items.ts`: 12 accepted pairs, 60 rejected. Valid direct/group, direct/gateway, app/gateway and parallel-work allocations are all accepted. They are alternatives to choose between, not an enumeration challenge.

I challenged answer-bearing titles, position, length, comprehensive wording, simplistic caution, repeated teaching contexts and implausible distractors. Correct reasons are longest in three cases, middle in one, shortest in four; correct positions are 1/3/2/1/2/2/3/3. Correct decisions also vary. No systematic shortcut was found. Plausible errors concern device identity, management/data permission, session/role lifetime, actual bypasses, offline key availability, later result authorization, posture/workload evidence, populations/models and resource attribution. Positive bounded reporting and parallel action are correct where supported, so blanket refusal is not a solution rule.

The changed device, offline/key, asynchronous result, subset/history and cross-resource contexts require substantive application. Time-bound Reader and specific Servers-plan cases remain near transfer. This fixed small bank has no psychometric or measured-transfer validation.

## Six review domains

### Content and sources

Read the actual nine-section Norwegian manuscript, layer primer, examples/limits, all final items/feedback, guide instructions, model rules and `docs/SECURITY_PRINCIPLES.md` against the engineering, A–F, workflow, guidance and release contracts. Original teaching connects earlier identity/access/network/storage/governance/monitoring without reinterpreting their evidence.

The current study-guide body names only Zero Trust, defense-in-depth and Defender purpose in scope **2.4.06–08**. Encryption/Key Vault is a named Learn supplement, not a fourth exam objective. Source bodies distinguish contextual AuthN/AuthZ, least privilege and assume-breach design; free Foundational CSPM, paid Defender CSPM and workload-specific plans; collection/integration/support prerequisites; recommendation versus alert; classic Azure-portal Secure Score versus risk-based Defender-portal Cloud Secure Score; and Key Vault object/access/rotation/version boundaries. The course computes neither a real nor an invented Microsoft score.

I inspected relevant actual passages across the 28 cached official bodies and checked all 28 cached hashes, canonical learner URL/title pairs and all 29 exact source records. SE29 is an explicit unavailable 404, excluded from learner links and replaced by SE09/SE12. The review used the same-day retrieved official archive; I did not claim a new live retrieval of every URL. The generated-table review-date defect was corrected and rechecked as finding 01.

**Explicit SEC02 A–F challenge:** all seven layers have visible original purposes, controls, risks, limits and complementary contributions (A/B); the saved password, host/recovery and app/data contrasts provide relevant activity and failure evidence (C). Independent sp04 adds a local-copy/key boundary while preserving three-day offline availability. Independent sp05 moves the authorization question to a later asynchronous result request and admits either an unavoidable contextual gateway or the application route (D). Existing private encrypted storage and an authorized worker do not cover that new end-user delivery boundary; detailed alternative/counterfactual feedback explains why (E). Official defense, Zero Trust and data/key sources bind these claims (F). This is sufficient scoped content/application for “describe the purpose” of defense in depth. I did **not** count SEC01-tagged sp03 as SEC02 independent evidence. It does not imply independently testing every layer, seven operational emulators or broad diagnostic mastery.

### Technical truth and persistence

The three deterministic declared perspectives never authenticate, authorize, execute CA/RBAC, scan, attack, encrypt, activate a plan, generate actual alerts, remediate or mutate Sandbox World/receipts. The layer model explicitly assumes failed layers and conditional independence; complementary contribution leaves residual exposure. Defender resource selection alone grants no plan/data coverage; absent evidence cannot mean safety; score values stay null.

Inspected strict validated replay, exact versions/keys, bounded events/JSON/runs, terminal reserve, saved contrasts, immutable first/help/retry/family/abandon, durable conflict handling and compare-before-delete recovery. Independent probes covered 144 plan/data/alert/score combinations, invalid replay and stale assistance. Actual Portal configuration and original receipts stay read-only context with no synthetic-control or guided-credit inference.

### Visual and accessibility

Personally viewed **all 20** committed `docs/screenshots/security/` production images: 1920/1440/1366/1024/800, short native Start/Cancel and feedback, mechanism flows, seven layers, failed-primary/residual contribution, missing evidence, score models, actual configuration and ordinary Portal. Text and purpose remain visible through normal vertical scrolling; compact controls reflow and native dialog actions stay accessible. Existing targeted keyboard/reduced-motion/Axe witnesses were inspected.

Also inspected my independent pinned-Chromium 1024×500 active-sp06 image. Its live probe found no horizontal overflow, page error or foreign request. The local production build predates the two final availability-copy corrections; those fields were source-reviewed and remain subject to final CI/deployed rendering verification. Automated witnesses and agent image inspection do not establish human UX or screen-reader validation.

### Assessment

The sealed bank review above was followed by actual-key/feedback evaluation. Detailed feedback distinguishes a valid decision from an invalid reason and explains each plausible alternative. Actual local browser probes accepted sp05's gateway and sp08's alternative allocation unaided, and rejected sp01's correct-decision/wrong-reason pair with the relevant causal feedback. An immutable first remains separate from assistance/retry; another active Security case withholds old feedback/history.

### SavvyShark and assistance

Read native explicit-start briefings, visible purpose/location/next-action/expected-observation copy, four matched witnesses per guide, causal synthesis, persisted milestones and deduplicated/manual recall. Independent deletion of **each essential run** in the 5/7/6-run guide sequences withheld completion. Empty runs or a causal choice alone also withheld credit; visits and configured controls do not complete a guide.

All **23** distinct teaching guards include Security. Course resume, Journal, Summary, feedback/history, mission recovery/safety and Portal automatic guidance preserve durable assistance and fail closed for unknown/conflicted state. Assisted-active mode still shields automatic solutions. My live probe preserved two earlier unaided submissions and an exact sp06 draft through root resume/reload, withheld Journal on denied aid without byte changes, then showed Journal only after aid was durably saved and retained assisted state after reload.

### Regression, preservation and delivery

Inspected the exact base diff and inherited test changes; no worker/retry/timeout/skip increase or assertion weakening was found. The guarded candidate retains 224 earlier browser executions and adds seven desktop plus one compact witness: **232 (214/18)**; optional legacy428 remains available.

Independently reran preservation successfully after the final delta: **35** earlier data exports, **2** functions, **8** explicit metadata paths, **54** unchanged objective rows, **127** protected patterns and byte-identical operative Portal suffix. Earlier manuscript/rubric/first/help/retry/World/receipt/XP meanings remain preserved. The historical monitoring Advisor paragraph was not altered by the availability correction.

Author verification includes actual full local `npm run check` exit0 (552 Vitest, 462 curriculum subset, 17 Node, 114 Markdown, TypeScript/lint/format/assets/legacy/build), affected desktop20, later desktop/compact delta3, and local all-three-guide/unaided-sp07/Journal/new-active-sp06 journey. These are local evidence. Postavailability bounded domain20/TypeScript/format/docs and source-date Node6/ESLint checks passed. I inspected the new meaningful source-specific/baseline/product-update test and its successful log. I did not rerun the complete local suite.

My additional independent domain and browser probes exited0. Two early browser harness assertions were corrected to await SPA navigation and match the actual combined status text; no product edit resulted. One hash-reconstruction harness needed a larger buffer for `nb.ts`; the successful reconstruction then exactly matched the original fingerprint.

## Findings and disposition

| ID           | Severity/status         | Finding, correction and retest                                                                                                                                                                                                                                                |
| ------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P15-FINAL-01 | MINOR / fixed           | Generated source dates used the baseline. Renderer now displays individual reviewed dates with baseline fallback, separately labels product dates and qualifies the introduction. Node6/ESLint passed; final delta/source block reviewed and other matrix sections unchanged. |
| P15-FINAL-02 | MINOR / fixed           | Author found stale Identity A/B availability. Exact two-field correction and eight-path preservation checked; affected bounded checks passed. Final rendering still belongs to exact-head CI/deployed verification.                                                           |
| P15-FINAL-03 | NOTE / accepted limit   | Fixed bank, near transfer in sp02/sp06 and bounded SEC02 independent breadth. No diagnostic, unseen-family or measured-transfer claim.                                                                                                                                        |
| P15-FINAL-04 | NOTE / unperformed      | Human Azure-SME, novice UX, screen-reader, psychometric, retention and learning validation. Keep unperformed.                                                                                                                                                                 |
| P15-FINAL-05 | NOTE / pending delivery | Full exact-head232 CI/strict plus actual anonymous ordinary-root/full-SHA/journey remain mandatory. Implementation audit does not waive them.                                                                                                                                 |

No BLOCKER or MAJOR remains. Implementation can proceed to the required Draft/CI/deployed verification steps. Release completion, real security assurance, merge and production deployment are not asserted or authorized.

## Evidence trail

Committed evidence is identified above and in the six-domain record using source/test/document/image paths. Local reviewer artifacts are `.artifacts/p15-final-audit-review.json`, `p15-final-audit-binding.json`, `p15-final-audit-domain-probe.json`, `p15-final-audit-source-probe.json`, `p15-final-audit-probe.json`, `p15-final-audit-wrongpair.json`, and the immutable blind lock/seal. They distinguish independent observations from author checks and retain the final snapshot and limits. The reviewer changed only this report and local audit artifacts; no implementation or `quality/releases/current.json` edits were made by the reviewer.
