# PR44 Independent Final Audit — UX-01

**Disposition:** accept the stamped implementation for Draft publication; no open BLOCKER/MAJOR or new product defect found. Full exact-head274CI/strict and actual anonymous final-SHA Gate7 remain required before owner-review delivery. This audit does not claim those pending delivery gates passed.

- Reviewer: `codex-pr44-independent-final-auditor` (separate agent; author `codex-dialog44-author`).
- Review: `2026-11-01T23:05:03Z` → `2026-11-01T23:07:24.957Z`, after implementation `2026-11-01T23:04:40.925Z`.
- Base: `0d7905061ccd9bd0684a37cea895b0baad137c38`.
- Fingerprint: `f0b3f54efcc12e07aea4a35744c6410d19079b5109895088cc771728a7e93102`. All13 stamped hashes independently match the payload and computed fingerprint.

## Actual review and findings

**Content:** no new curriculum, Azure product, source-coverage or mastery claim. Independent byte comparison of401 original source/test files finds only `portal.css` changed. All manuscripts, assessment banks/rubrics, stores/providers, commands, receipts and prior tests remain identical. Sources are correctly limited: Portal overview supports graphical management; CSS/native semantics use MDN and actual browser evidence. No redundant complete content/bank audit was performed.

**Technical:** application delta is exactly three CSS lines, `.portal-dialog:not(.portal-side-panel) { margin:auto; }`. Existing native `showModal()`, generated title, inert background, Escape/cancel and cleanup focus restoration remain untouched. The selector explicitly excludes side panels rather than depending on fragile cascade order. Existing width/max-height/overflow/backdrop/sticky header remain. No coordinate positioning, state, schema, engine or dependency changes.

**Visual/accessibility:** inspected all seven committed before/after images. Independent browser counterfactual at1440×900 gives centered x345/y168,w750,h563.984375; inline margin0 reproduces x0/y0 on the same box; removing the inline override restores identical centered geometry. At1024×500 the450px-high dialog retains25px top/bottom space, keyboard focus scrolls Start into view, and the long Journal scrolls using End. Repeated Tab/Shift+Tab does not reach underlying interactive controls; native traversal can briefly focus body, so the probe distinguishes that from background-control leakage. Escape returns to the launcher. Screenshot evidence shows balanced space, unchanged readable typography and actions. Human screen-reader/novice UX validation remains unperformed.

**Assessment:** fresh execution verifies four independent-start dialogs at three sizes, modal/title/focus, Cancel/Escape and no newly created attempt. Explicit Start/unaided first submission remains required. The dedicated Journal regression proves a denied durable assistance write withholds protected lesson content and retains the exact draft; permitted later access records assistance without changing the saved first. Banks and historical meanings are byte-preserved.

**Guidance:** Notifications/Appearance remain right anchored with margin0, under the Portal header. Native GuidanceWindow/MissionBriefing retain their own centering and Start/Cancel. PR43 recovery menu remains bounded at320/800 and keyboard-recoverable. Nonempty actual local RG/receipt World bytes remain identical after ordinary overlays, side panels and canceled native briefings. Earlier author9 affected VM/PaaS/Compute/Networking/short-window/denied-cross-tab journeys were inspected; no guide code changed.

**Regression:** auditor independently ran all8 new desktop tests:8/8,36.8s,exit0; justified compact witness1/1,10.6s,exit0. This includes actual Chromium200%browserzoom plus doubled text, Axe, reduced motion, short windows, first/assistance and distinct overlay geometry. Own four-check counterfactual/focus/short/Journal probe passed. Author full `npm run check` exit0 log inspected (583Vitest,482curriculum,18Node,123docs/build). Compact selection only adds its exact new witness; all old tests/settings remain. Plan274=253desktop+21compact, legacy506 retained. No retries/workers/timeouts/skips increased.

## Limitations and delivery note

`PR44-AUDIT-N01` — NOTE, open delivery dependency: actual exact-head complete274CI and its strict release, followed by anonymous full-SHA external journey, are pending at audit completion. Local passing tests and this review cannot substitute for them. No merge or production deploy authorized/performed by this reviewer.

Long Journal content and wider curriculum/assessment/source-consolidation findings remain separate roadmap work. LJ-01/PORTAL-GUIDE-01 are not reopened. SME, novice UX, screen-reader, psychometric and measured-learning human validation remain unperformed. No assertion of exam readiness.

Reviewer artifacts outside the repository: `auditor-preservation.json`, `auditor-desktop.log`, `auditor-compact.log`, `auditor-probe.json` under `/workspace/azurelab-pr44`. An initial standalone focus probe over-constrained native body focus; it was corrected to reject underlying controls while allowing the native body transition, then passed. No product change resulted.
