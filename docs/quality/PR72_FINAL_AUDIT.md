# Independent Final Audit — shared Portal entry

Reviewer: `shared_portal_final_audit` (separate agent; not the implementation author). Review start recorded in UTC: **2026-11-09T11:16:55Z**, after implementation finished **2026-11-09T11:16:06.027Z**. Reviewed branch: `codex/shared-portal-home-subscriptions`; verified base PR71: `0538b40cc51af634e71182014e65bdb932936c70`.

Reviewed payload fingerprint: **`0b23838280431c549040a35f8614e08a33db75ca9a37f6c57c54d8250bae2223`**. Independently recomputed the fingerprint and all 76 normalized snapshot file hashes from the actual filesystem: exact match, zero mismatches. No implementation changes were made by this reviewer. The only repository write is this excluded report.

**Disposition: independent six-domain audit complete; no BLOCKER or MAJOR found.** One minor presentation issue remains open. This disposition covers the first shared entry surface, not complete technical/course integration, exact-head complete candidate CI, strict release, public preview verification, or human acceptance.

## Scope and evidence method

Read the applicable AGENTS owner instructions, permanent quality/release/workflow/source/guidance contracts, [consolidation contract](../SHARED_PORTAL_CONSOLIDATION.md), [capability matrix](../SHARED_PORTAL_CAPABILITY_MATRIX.md), and the actual diff from verified PR71. Reviewed the shared Home, service catalogue/navigation, subscriptions, both scope projections, both original controller bindings, CSS, new tests, finite compatibility reader, and direct actual-file preservation guard.

The production server at `http://127.0.0.1:3000` was exercised with native Chromium. Reviewer artifacts use the unique directory `/workspace/azurelab-pr72/independent-audit-111655/`, separate from all author artifact destinations. No test assertion, retry, worker, timeout, skip, implementation, environment variable, credential, or external infrastructure was changed.

Independently executed:

- `vitest run src/features/portal/shared-shell.test.ts src/pr72-shared-portal-preservation.test.ts src/laboratory-pr71-preservation.test.ts`: **17/17 passed**, three files, exit 0. Covers every supported catalogue version, absent/unknown versions, real engine-backed scope/location projections, immutable input, direct actual PR71 blob preservation, import-only reader changes, and unchanged controller authorization/transport segments.
- Native Playwright, original baseline settings, existing server only, unique output: **7/7 passed without retry**, exit 0. All five new shared-entry tests plus unchanged original independent raw inspection/denied aid and free-mode active independent draft isolation. This includes real temporary creation/receipt/history/Studio navigation, course-v2 creation/exact return, real PostgreSQL create/reload/session isolation, historical 3.0 capability discovery, and keyboard/reduced-motion/Axe/short-window checks.
- Separate unchanged original `Portal guidance vm: minimized guide recovery and ordinary Portal return preserve the original session`: **1/1 passed without retry**, exit 0, its own output directory.
- Additional native UI probe: created two identically named Resource Groups in distinct `sub-shared`/`sub-app` scopes, then a Storage account in App Sandbox. Verified distinct group IDs and hrefs, exact scoped defaults, App-only resource membership, **West Europe resource location versus North Europe group metadata location**, exactly three explicit commands, and zero additional commands or course-localStorage byte changes during subsequent inspection. Actual results and screenshots are in `scopes-and-sizes.json` and `scopes-and-sizes.log`.
- `node scripts/quality-check.mjs`: passed. Independently checked stamped file hashes/fingerprint. This ordinary check is not strict release approval.

Read the actual author `check-stable.log`: full check passed 1111 Vitest/94 files, 24 Node tests, 503 curriculum checks, required contracts/format/assets, real isolated PostgreSQL suites, and normal production build. Read the separate author native logs showing 14/14 unchanged controls, 5/5 new desktop controls and 1/1 initial compact witness. These author runs were inspected, not rerun or misrepresented as reviewer executions. The full 468-case candidate profile remains a future exact-head CI gate.

## Six-domain observations

### Content and sources

The new copy accurately describes simulated subscriptions, no real Azure account/billing, session-only recents, and the absent Laboratory Web/plan family. It introduces no new course manuscript, assessment objective or Azure runtime claim. Read the actual retained Microsoft article bodies under the task source directory and recomputed their SHA-256 values: all three match [sources.json](../reviews/evidence/pr72/sources.json). Portal overview supports global shell/search/service-menu distinctions; the Resource Group article explicitly separates metadata location from resource regions; the subscription article describes real billing/permission operations which this UI expressly excludes. An authorization banner in the public HTML does not replace the actual readable article body; the relevant body was present and inspected.

Existing source/locale/domain bytes are protected by the direct base-file test. The capability matrix honestly distinguishes operative commands, inspection, pedagogical models and deferred lifecycle operations. It does not claim v2 Resource Group Delete UI, free Web/Policy operation, VM runtime, traffic, billing, or assessment attestation. Existing icon provenance/variant uncertainty is retained; there is no new icon or mascot asset or claim of pixel-exact current Azure Portal parity.

### Technical truth and architecture

The extraction is substantive: both routes render the same Home, service/navigation register and subscription components. Shared code does not mount course providers over Laboratory World, register commands, execute a competing rule engine, create subscription resources, or persist another inventory. The two small adapters read original identity and membership; data-plane/nested Lab rows are not counted as top-level resources. Stable IDs, rather than matching group names, determine links and scope membership.

Catalogue availability is explicit for 3.0–3.7 and fails closed for absent/unknown models. Course has its real Web/plan services and excludes operative free-only networking/Storage families; free mode states the Web/plan gap. Real 3.0 discovery remained frozen. Read-only Home/subscription/Properties/Studio navigation issued no commands in the independent UI probe. Real memory and PostgreSQL paths both passed; the latter survived reload and rejected an unrelated unauthenticated session.

The target architecture is credible as a staged direction, with one explicit workspace/capability projection and a versioned successor engine. **The desired final one-engine course/free architecture is not implemented here.** v2 and Laboratory still have different evaluators, request/receipt identities, resource semantics and learning ownership. Common controller/command facade, successor Web/plan/settings/Policy semantics, owned course workspace/evidence attestation and a versioned course pilot remain necessary. The proposal properly requires frozen replay, atomicity, idempotency, dependencies and both storage adapters before activation. A common catalogue must remain descriptive rather than authorization. No automatic migration, World conversion, receipt reinterpretation or free-client history promotion is justified by this delivery.

### Visual quality and accessibility

Inspected the real before-course Home/free Resource Groups entry and final paired Home/subscriptions/detail/Create images, plus new independent actual captures at **1920×1080, 1366×768 and 1024×500**. The existing production-browser case independently exercised **1440×900, 1024×768, 1024×500 and 800×700**, keyboard Enter/focus, reduced motion, horizontal-overflow checks and Axe. The common entry hierarchy is coherent in both modes. Course-only training controls and free-only temporary status are legible and separate.

Short windows require ordinary vertical scrolling: recents, scope members and the free status footer can lie below the initial viewport, while headings, native resource menu, essentials and available actions remain reachable. The inspected short Create form retained visible Review/Cancel and the explicit storage limitation. No release-blocking clipping, overlay or inaccessible critical text was observed. The independent same-name scope capture visibly separates resource location and Resource Group metadata location.

Reviewed the retained 208.5px pre-fix catalogue icon measurements and final 14/22px measurements. The actual selector now excludes icon spans, and the independent browser bound passes. A minor redundant-heading issue remains below. Automated Axe and screenshots do not establish screen-reader/usability quality or human visual approval.

### Assessment integrity

No bank, answer, rubric, assessment store, score, first submission, family, retry/abandon, completion, XP, course-domain or technical receipt authority changed. The direct actual-filesystem guard checks all PR71 tracked blobs except the explicit current release record and finite declared presentation/docs/import changes. It does not depend solely on old assertions seeing substituted historical bytes. Those reader changes are import-only, actual before/after hashes are finite and checked, and the independent test ran against the real files.

The unchanged original browser controls verified an actual active independent draft across free work and reload, neutral raw technical inspection without aid, durable aid denial withholding teaching, and exact assessment resume. A new common page does not bind a free workspace to an assessment or award evidence. Existing historical PARTIAL/content/psychometric findings and human learning validation are not closed by this presentation PR.

### Guidance and SavvyShark

Guidance targets are an explicit optional course-owned prop; free Home/menu has zero `[data-guide]` attributes and mounts no course coach/assessment/training layer. Existing controller navigation and teaching authorization remain byte-identical in the protected segment. The original minimized VM guide recovered focus/state, navigated the real group menu, survived history/reload and returned without rebinding the session. The new guided course journey retained its actual v2 mission coach, technical task and exact course return.

The independent raw-inspection control preserved the assessment draft and technical bytes, showed neutral active-independent status, withheld solution instructions, and failed closed when durable aid storage was denied. Shared subscription navigation does not itself Start, submit, answer or grant learning credit. No new guide authoring or mascot behavior is approved.

### Regression and delivery

The actual base diff leaves `src/domain`, `src/laboratory`, `database`, scripts, public assets, package files, CI workflow and locked PR71 evidence unchanged. All inherited E2E bodies remain byte-identical; only the two finite source-reader import bindings and one additional compact witness registration change historical test infrastructure. No worker/retry/timeout/skip setting changed. The direct preservation suite and fresh native checks corroborate that boundary.

Original development failures remain recorded, including icon stretching, guide-marker leakage and overlapping artifact-directory failures; corrected passing runs do not erase them. Known older Compute/Back/Axe/landing/resume/PG/timing/CI-budget causes remain **OPEN** absent causal evidence. This audit did not diagnose or close those causes.

## Findings and dispositions

| ID      | Severity | Status | Finding, reproduction and disposition                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------- | -------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SP72-01 | MINOR    | OPEN   | Subscription Overview repeats adjacent section labels: an `h2` and the visible table caption both say `Resource groups`; populated Resources repeats similarly. Reproduce by opening either subscription Overview after creating a group (and a top-level resource for the latter). Confirmed in the independent `app-membership.png` and final paired subscription images. `PortalSubscriptionDetails` supplies a heading and `PortalRecentResources` supplies the same caption. This adds visual repetition but does not obscure membership or controls. Consolidate the visible label/accessibility caption in a future presentation cleanup; no implementation fix was made during this audit. |

No BLOCKER/MAJOR was identified, and no serious finding was reclassified as an accepted limitation. The architecture and delivery boundaries below are scope/status facts rather than claimed completed work.

## Delivery limits

This is the **first coherent common Shell/Home/Subscriptions/catalogue/navigation delivery**. Resource forms/controllers and technical/course authorities are still distinct. Full one-engine integration, Web/plan successor semantics and versioned course evidence remain follow-up work. Temporary memory history is refresh-lost, client-owned and not durable assessment attestation; public persistent PostgreSQL remains intentionally unconfigured, while the existing local transactional path is verified.

At review time, complete candidate **468-case exact-head CI**, strict `quality:release`, and anonymous stable-preview **new full-SHA** root-to-course/free-Lab/action/return journeys have not been executed for this delivery. They remain mandatory delivery gates; neither the PR71 pass nor local targeted results substitute for them. No external infrastructure, credential/configuration change, migration, merge or production deploy was performed or authorized by this audit.

Qualified human SME, learning-effect/transfer, novice/IT usability, screen-reader and psychometric approval remain **unperformed**.
