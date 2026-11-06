# Premium product entry · PR61

6 November 2026 · base PR60 `d567d19504ac33a27252d30e24385679287d3987`.

`/` is now AzureLab's actual product landing page, not a redirect. `/learn` remains the complete AZ-900 Course Hub and its original Start/Continue priority. No course manuscript, recommended sequence, rubric, assessment event, technical command or Laboratory persistence changes.

| Entry                              | Destination and honest state                                                                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZ-900 · Azure Fundamentals        | Real link `/learn`; available, or ongoing for a valid saved course position. Recovery uncertainty is shown honestly. The Hub remains the only resume selector. |
| AZ-104 · Azure Administrator       | Planned, no active link/button, course content or workspace.                                                                                                   |
| AZ-305 · Azure Solutions Architect | Planned, no active link/button, course content or workspace.                                                                                                   |
| AzureLab Laboratory                | Real link `/labs/laboratory`, explicitly separate free workspace. Never `/portal` or a fourth AZ course.                                                       |

The three AZ courses are not the three existing AZ-900 learning paths. Those paths and all17 AZ-900 routes remain unchanged. [Completion proposal](COURSE_COMPLETION_CONTRACT.md) is separate from existing assessment semantics; **no green whole-course status is issued**. Current card status is only position metadata, never inferred mastery. After the owner’s final simplification, each course card shows only code, name, status and one real action if available. No descriptions, repeated availability explanations or resume notes. The hero has only AzureLab plus one short sentence; Laboratory has one short separation sentence and its link. All database/setup details remain at the existing Laboratory destination and in documentation. No new backend availability probe is added at root.

## Visual and interaction scope

Local Manrope and the original AzureLab wordmark reuse the PR51 foundation. The owner’s final clean-landing instruction removes the large editorial marketing headline; Source Serif4 remains unchanged in the actual course. The original AzureLab brand geometry is reused. Navy `#0b1926`/`#142c3d`, warm text `#f5f3ee`, restrained cyan `#80d4da`, quiet borders and clear links distinguish product selection from the warm course and operational Portal. No external fonts, new mascot, image generation, giant menu, gamification, gradient effects or motion library. Only short hover/focus colour transitions; reduced motion disables them. The page never hides its text for entrance animation.

Three course columns where space allows, natural collapse below740px, height-aware spacing in short desktop windows. Following the owner’s additional instruction, the whole ordinary landing fits without scrolling at all five requested desktop sizes. At high browser zoom/narrow reflow, normal scrolling preserves all content and controls; nothing is clipped or globally hidden. Native links, article headings, skip link, visible focus, text plus icons for status and honest noninteractive planned cards. The Laboratory is a broad distinct section below courses. The reference image was not attached in this request; implementation follows the owner's textual direction without claiming a visual match to an unseen image.

The existing AppShell's plain-content branch now also includes `/`; no old rail, XP or Journal toolbar is added to the product landing. Its original assessment-navigation guard remains active and unchanged. Existing intentional abandonment/assistance rules still belong to their original contract; root adds no new event, auto-start, score, completion or technical action. Links disable speculative prefetch. The page does not call Laboratory APIs or create an anonymous session.

## Storage boundary and availability

AZ-900 still uses its original v1/v2 local stores. Free Laboratory3 still uses its own cookie and PostgreSQL authority. Root reads only existing course-position metadata. Neither navigation nor a card creates resources/attempts. Course reset uses existing local reset; free Lab reset uses its existing server command and cannot clear local course work. No import/migration or new reset behavior is introduced. Future AZ-104/305 workspaces require separate explicit course scope and cannot reuse the free Lab's history.

Public persistent Laboratory database remains **unconfigured** as documented by [PR60](LABORATORY_V3_SERVER.md). The Laboratory link opens the actual route; its existing unavailable state is retained. There is no localStorage fallback, fake Storage demo, automatic session creation, external database provisioning or secret distribution. Local/CI tests use PR60's dedicated PostgreSQL. Public entry/negative-state checks are not a passed public persistent Storage Gate7.

## Preservation and tests

All390 prior browser cases/assertions/settings are retained. Most old tests that previously relied on `/` redirect now explicitly open their unchanged subject, `/learn`; three legacy root entrances instead follow the real AZ-900 link. No technical/history/assistance assertions are removed. New root-specific tests verify actual product selection, readonly navigation, real active-independent Hub resume, actual free-Lab/course reset isolation, unavailable backend, corrupt/forged/cross-tab status, responsive keyboard/Axe/reduced motion, real browserzoom and the reserved complete display.

Six new desktop cases and one distinct initial compact witness produce397 =359desktop+38compact; optional legacy718. No worker/retry/timeout/skip/threshold increase. New bounded preservation readers validate current authorized deltas before older immutable-byte checks, with independent exact-body/route/prefix/config checks. Original review artifacts and the PR59 cutover/ABA blocker remain unchanged.

Actual production-build screenshots are committed below; separate independent audit remains a required delivery gate. Inspect1920×1080,1440×900,1024×768,1024×500,800×700 and native Chrome125/200% zoom. A test-only unpacked extension uses `chrome.tabs.setZoom/getZoom`; it is not shipped or an emulated CSS/pinch zoom. The complete status primitive's HTML fixture is clearly labeled test-only and404 in production. It does not claim a completed learner.

Full check, separate post-stamp audit, exact-head full CI/strict and anonymous deployed-root/fullSHA/course/Laboratory-entry verification remain distinct delivery evidence. Human UX/screen-reader/learning-effect validation is unperformed. No merge, production deployment or broader course redesign.

## Actual local evidence · 6 November 2026

| Production viewport | AZ-900 action bottom | Laboratory action bottom |       Document height |
| ------------------- | -------------------: | -----------------------: | --------------------: |
| 1920×1080           |                629px |                    747px | 1080px — no scrolling |
| 1440×900            |                539px |                    657px |  900px — no scrolling |
| 1024×768            |                473px |                    591px |  768px — no scrolling |
| 1024×500            |                322px |                    411px |  500px — no scrolling |
| 800×700             |                439px |                    557px |  700px — no scrolling |

[Before: actual PR60 public root/Hub](reviews/evidence/pr61/before-root-1440-900.png) · [After1440](reviews/evidence/pr61/landing-1440-900.png) · [After short desktop](reviews/evidence/pr61/landing-1024-500.png) · [800px complete selection](reviews/evidence/pr61/landing-laboratory-800-700.png). [Measurements](reviews/evidence/pr61/visual-measurements.json) and [provenance](reviews/evidence/pr61/visual-provenance.json) distinguish the historical before capture from new local production evidence. All five required viewport checks recorded Axe0, no horizontal overflow and document height equal to viewport height. The owner’s added no-scroll condition is asserted directly, including both actions and footer at1024×500. Final affected responsive desktop+compact and actual native zoom checks passed3/3 in17.5s; the initial renewed check caught a real2px overflow at1440×900, corrected by spacing without hiding content or weakening the assertion. Native browser zoom125/200% was tested with the real zoom API, overflow/keyboard/control visibility and Axe. No CSS/pinch zoom is represented as browser zoom.

Final clean production-browser batch: **7/7 passed,39.3s,0retries**, including all five no-scroll desktop sizes, real125/200%zoom/Axe/reduced motion, real active-independent draft/Hub resume, actual PostgreSQL bidirectional reset isolation and unknown/corrupt/cross-tab/unavailable-state controls. Fourteen landing/status/preservation unit checks passed after the copy simplification. Seven existing Course/legacy journeys also passed in56.7s before the final copy simplification; exact-head complete397 CI retains them all.

An earlier pre-cleanup batch had6passes and one unchanged30s Portal-navigation budget failure; the same unchanged case passed a subsequent isolated diagnostic in3.5s. This timing observation remains recorded, not declared fixed by the later7/7 result. The earlier two-pixel layout defect and accessible-name defect were actually corrected and rechecked. Authoritative full397 CI/strict and anonymous deployed-SHA landing verification remain pending. Older Compute/Axe/CC03 timing uncertainty also remains open.

Initial implementation testing found a real accessible-link-name mismatch; the accessible names now include the visible action text, and the corrected actual-page Axe checks passed. Two test-oracle issues (focus already on the same element after viewport change; missing UTF8 on test-only markup) were corrected without relaxing assertions. The historical preservation helper initially changed one quoted assertion import as well as its import line; the independent exact-body check caught it. Both original readers were restored and now differ only in the explicitly authorized single import. No old assertion, timeout, worker, retry or skip was removed or increased.
