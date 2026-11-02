# Recommended AZ-900 learning sequence — PR45 / LJ-02

## Problem and decision

Audit42 found real prerequisite inversions: StorageB led straight to Migration before Identity/Access and Management; AccessB led straight to Security before Governance/Monitoring. Anonymous PR44 preview `7775b0a22d0a5c88597c28b3df780b92425f3dce` reproduced StorageB→Migration and Monitoring→Hub. This is sequencing, not missing authored content or permission to change prior evidence.

The complete [audit prerequisite graph](reviews/AZ900_LEARNING_JOURNEY_MAP.md) supports the owner-proposed order. No adjustment was needed. Existing early conceptual references remain bridges: for example a tier cost driver does not require the whole later Cost module. CoreA/B and embedded Serverless remain in their original internal order. The19teaching parts share17canonical module routes.

Computing → Benefits → Service Types → Core Architecture A/B → Compute → NetworkingA → NetworkingB → StorageA → StorageB → IdentityA → IdentityB → Cost → Governance → Management Tools → Monitoring → SecurityC → MigrationC → Course Hub.

`course-sequence.ts` is one small typed, read-only definition over existing `CourseModule`/`courseHref`/`courseTopic`. Its introduction dependencies are navigation/audit metadata, never completion requirements. Tests compare the entire route set with canonical `moduleIds` and the unchanged catalogue, check each graph edge, finite connected Next traversal, reciprocal Previous, canonical entry/exit topics and final Hub. Course uses it only at module boundaries; internal activity order is preserved. Previous now points to the preceding module's actual canonical last activity, including separate Cloud Transfer and CoreB Summary.

| Boundary           | Before     | After               |
| ------------------ | ---------- | ------------------- |
| StorageB           | MigrationC | IdentityA           |
| IdentityB / Access | SecurityC  | Cost                |
| Monitoring         | Hub        | SecurityC           |
| SecurityC          | Cost       | MigrationC          |
| MigrationC         | IdentityA  | Hub / course ending |

## Product experience and safety

The three Course Hub subject groups are unchanged: Cloud Concepts; Azure Architecture & Services; Azure Management & Governance. StorageC remains in Storage, SecurityC in Identity/Access/Security. The small map explanation distinguishes catalogue from recommended travel; two existing module entries gain a closing-application caption. No fourth path, duplicated module, new navigation system or large panel. Every direct/deep link stays open without prerequisite locks.

Short context explains StorageB→Identity, Access→Cost/governance/administration, Monitoring→security synthesis, and Security→migration planning. Capstone introductions recommend preparation while keeping direct access explicit. Migration's ending offers Hub/repetition, existing header Journal and optional Sandbox without claiming mastery or exam readiness. No remaining learning activity is deleted. New orientation has a semantic `h2`/`data-activity-heading`, so the existing unmodified focus behavior lands on the brief transition in short windows instead of scrolling it away behind the later Summary heading.

PR43's original recommendation priority is unchanged: uncertain history/recovery, exact active independent context (including assisted state), then the original current-module guided projection, then static activity/module navigation. Active/cause/paused/completed guidance still uses existing stores/evaluators and explicit actions. A transition bridge is withheld while an authoritative recommended action has priority. Hub's original cross-module resume policy is preserved; no new global recency/progress engine. Navigating or reaching the ending creates no assessment/mission/completion credit. Historical version choices/URLs and original Servicesv1 terminal return/practical origins remain.

All domain/stores/providers, versioned rubrics, first/help/retry, World/receipts/XP, Portal/guide/Journal safeguards and PR44 modal source remain byte-preserved. All39old `nb.ts` exports were compared structurally: only `storageResilienceNb.available`, `identityNb.available`, `migrationNb.available` change, solely to correct old onward navigation/product-phase text. Every old assessment and substantive teaching object is otherwise unchanged. New orientation copy is isolated in `content/learning-journey.ts`; no broad manuscript revision or new57objective audit. The three old Identity/Security/Migration navigation tests now start from their correct predecessor and expect their new successor, retaining all source URLs, grouping, immutable records and resume assertions.

## Actual visual comparison

- StorageB1440: [before](screenshots/learning-sequencing/before-storage-resilience-1440.png) / [after](screenshots/learning-sequencing/after-storage-resilience-1440.png), Identity recommendation and concise identity/data-rights bridge.
- Monitoring1440: [before](screenshots/learning-sequencing/before-monitoring-1440.png) / [after](screenshots/learning-sequencing/after-monitoring-1440.png), clear transition to Security instead of Hub.
- [Security1024×768](screenshots/learning-sequencing/after-security-1024.png): closing synthesis and recommended preparation, direct access intact.
- [Migration ending1024×500](screenshots/learning-sequencing/after-migration-end-1024x500.png): modest ending/Hub/Sandbox links and reachable footer; long Summary remains scrollable.
- [Fresh Hub1440](screenshots/learning-sequencing/after-hub-1440.png): original three-column catalogue and one Start action, compact map explanation; closing captions sit on the existing entries further down.

Before images are actual anonymous base-preview captures with rendered full SHA verified. After images are candidate production rendering; local build SHA remains the base until publication. Final external proof must verify delivered SHA separately. Short/compact controls use existing scrolling/focus; no global footer/modal redesign. Human novice UX/screen-reader validation is unperformed.

## Risk-based verification and boundaries

New six desktop cases and one justified initial compact closing/navigation witness retain all274inherited executions: candidate281=259desktop+22compact; optional legacy518. All17canonical boundaries are exercised in actual browser, with explicit new destinations, reciprocal Previous and subject/sidebar context. Dedicated journeys cover fresh Start, free capstone access, active/paused same-session guide, immutable unaided first/exact draft/denied Journal aid, historical v1/v2 routes and actual native practical Portal return. Keyboard/focus/scroll, Back/Forward/reload, reduced motion and Axe cover desktop and1024×500. Original source/active-resume tests are adapted only for changed UI semantics.

Early compact test incorrectly assumed the inherited≤800px footer was fixed; keyboard focus now proves reachability before the unchanged viewport assertion. Early old-source journeys still started from the superseded predecessor; those origin/successor expectations were aligned with this explicit product change, not weakened. No retry/timeouts/workers/skips or critical assertion changes. An early unit-test inference error was corrected with an explicit return type; no model behavior changed.

Actual targeted exits, full check, post-stamp independent review, exact-head full CI/strict and anonymous Gate7 are separate proofs recorded on Draft PR45. Pending/collection/local results cannot substitute for final execution. Final reviewer challenges the graph, real navigation, guide/assessment priority, direct/legacy routes, Journal/history, ending and actual images; unchanged content/rubrics require preservation evidence, not a repeated full bank audit.

[Dependency follow-up](DEPENDENCY_FOLLOWUP.md) records12moderate development-tool entries rooted in minimatch, all exact chains/fix constraints and actual production audit0. No packages or audit thresholds change here. AS-01, UX-02 and remainingP2 remain open. LJ-02 is this first bounded sequence/continuity step, not full theory consolidation or measured learning validation. Human SME, noviceUX, screen-reader, psychometric and measured-learning work remain unperformed. No P17/P18, merge or production deploy. Next AS-01, then UX-02.

## Scoped source check

Reviewed2November2026: current [AZ-900 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900) confirms the existing three subject areas; [Portal overview](https://learn.microsoft.com/en-us/azure/azure-portal/azure-portal-overview) confirms existing graphical-management context. These sources do not prescribe AzureLab's navigation order. The prerequisite decision comes from audit42's actual graph/manuscripts and the owner's approved sequence, validated against real canonical routes. No new Azure product/assessment claim or curriculum coverage upgrade.

## First complete CI and precise correction

Actual full run [41401906187](https://github.com/EspzY/Azure-learner/actions/runs/41401906187) on `9633bd64831f287586a0a660e2f15969896ea744` ended280passed/1failed (16.8m). The old Identity route test still expected StorageB→Migration→Identity, despite the approved new sequence and correctly rendered Identity destination. Existing automatic retries also failed that same obsolete expectation; no passed candidate receipt was emitted and strict release did not run. This is a failed delivery run, not accepted regression proof.

The Identity test now checks StorageB→Identity and reciprocal Previous→StorageB, then Migration→Hub. Every original sidebar, Back/Forward/reload, Portal return and empty-completed/first assertion is retained. No app code, assertion strength, worker/retry/timeout/skip setting or profile count changes. A targeted actual retest, renewed stamp and separate revalidation precede a new complete exact-head281CI/strict run. The earlier public Gate7 verifies only its9633SHA until the corrected head is actually tested again.
