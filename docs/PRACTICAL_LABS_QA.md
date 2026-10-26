# Practical labs QA — 3.2.1

## Portal presentation regression — 2026-10-26

The current common shell/resource menus/form density/settings edit flow are covered by `portal-fidelity.spec.ts` at1920×1080,1440×900,1366×768,1024×768, while existing practical-labs/course/independent assertions remain. Settings tests now operate the real Edit/Save draft controls before the unchanged Apply/evidence checks. Navigation helpers reveal the new learning-tools disclosure rather than silently weakening assertions. [Actual full results](PROJECT_STATUS.md) and [reference comparison/screenshots/walkthrough](PORTAL_REFERENCE_FIDELITY.md). No new skip, resource semantics, rubric or XP. Human Azure-transfer/UX/educational approval remains pending.

Base: 943d0d1954022c466cf0c41261e40b623df98440. Branch: feat/321-integrated-practical-labs, stacked on feat/32-cloud-benefits-service-types. The exact final commit, Draft PR and protected branch-preview verification are associated with the owner delivery; no merge or production deployment. Implemented review candidate; qualified human acceptance remains pending.

## Executed engineering checks

The production-built application is tested locally on port3100, because an unrelated process owns3000. The ignored `.artifacts/31a-discoverability.config.ts` imports the unchanged Playwright configuration and changes only its local test directory/server port. No existing server is stopped. No new dependency was needed, so this phase did not perform a clean dependency reinstall; package-lock is unchanged.

- `npm run check`: typegen/strict TypeScript, ESLint, formatting, docs, curriculum, assets, all Vitest, docs-check fixtures and production build. 212Vitest in23files,67curriculum tests (a subset, not additional unique tests),3documentation fixtures and56Markdown files passed.
- Production Playwright course/Portal/foundations/curriculum/UX/practical regression:33passed,15desktop-only duplicate cases explicitly skipped in the mobile project. Existing assertions remain; one Portal receipt-persistence assertion intentionally follows the new sandbox.v2 key/commands while migration tests assert original bytes remain unchanged. The practical suite includes existing-v1 entry and explicit reset/resume fixtures.
- New practical suite: actual root→IaaS→VM and attachments→receipt→graph→exact debrief→PaaS policy denial/inspection/correction/settings→SaaS seat rejection/departure/history→Benefits real-policy bridge→return/reload. Changed VM, PaaS and SaaS independent tasks pass on actual new operations; old resources cannot pass a fresh boundary. No guide rings or premature solution criteria appear in independent mode.
- `npm audit --json`:0vulnerabilities across333dependencies. No dependency changes. Staged secret/external-request and diff review is recorded at finalization.

This is not a claim that every historical WebGL/game/browser suite ran locally. Their tests/CI remain; the current non-game suites and explicit archived semantic check are listed with final results. No human usability, live Azure transfer, production performance, SLA, carbon or qualified SME validation is claimed.

Reproduction (production build, local port override described above):

```sh
npm run check
npx playwright test --config=.artifacts/31a-discoverability.config.ts tests/e2e/practical-labs.spec.ts tests/e2e/course.spec.ts tests/e2e/portal.spec.ts tests/e2e/foundations-v2.spec.ts tests/e2e/curriculum-expansion.spec.ts tests/e2e/ux-refinement.spec.ts
```

During finalization, typechecking caught a duplicated JSX attribute and formatting caught an in-flight edit. Both were corrected; a command run against the stale build after the first failure was discarded as verification. Final runs use explicit failure guards. These transient failures are not hidden or counted as passes.

## Reproducible owner walkthrough

1. Open the ordinary branch-preview root. The actual course landing shows the three practical entries near the top. Choose **IaaS · Praktisk laboratorium** (or follow Module3→IaaS).
2. Read the purpose/requirements, start guided practice. Use the real Portal search/menu for Resource groups, create a group, then open Virtual machines→Create.
3. Choose subscription/group, a supported name, resource region, image/profile. Inspect disks (OS versus optional data) and new/reused subnet. Review validates without creating. Create commits one whole local bundle; inspect its receipt and return to the resource.
4. Follow the actual OS-disk and NIC/subnet references, explicitly inspect them, and open Architecture Explorer. Management membership, attachments and network structure differ; region is a property. Give the operational-responsibility reason and submit. Return restores the exact IaaS unit/activity; reload preserves supported progress.
5. Open PaaS. Without a prior app, the existing guide establishes group/plan/app. Submit the authored North Europe Web request, inspect the real rejection and Web-only policy, correct the plan location and select actual hosting. Inspect the relation, then open Environment variables. Apply staging/read-only; inspect saved values and return to the exact PaaS unit. With an existing app, configure it directly as guided practice.
6. Open SaaS. Try licensing Erin while both seats are used; inspect the rejected receipt. Release Mina's seat, license Erin, block Mina, remove her admin role, constrain sharing and record data review. Inspect actual history, explain retained customer duties, submit and return. This is a separate fictional product, not Azure Portal/Microsoft365.
7. Independent buttons start changed contexts with new technical boundaries. VM requires Windows/standard/data64 in Shared Sandbox; PaaS requires a new plan/app with production/read-only; SaaS departs Leo through new operations. Deliver before solution feedback. Explicit help changes assistance classification, not task requirements or an earlier result.
8. Benefits bridges open an actual relevant resource/receipt/policy/settings/architecture view with a fixed lesson return. They never turn the explanatory failure/sustainability model into telemetry or award completion.

## Visual and accessibility review

Implementing-agent screenshots were inspected at1920×1080,1440×900 and1366×768 for ordinary course entry, real VM forms, PaaS settings and SaaS history. Target bounds are checked after resizing/scrolling. Review corrected premature guided reasoning, ambiguous radio presentation, incorrect capture timing, unsupported per-NIC Create affordances and resource-parent details. Semantic controls, readable theory, native keyboard controls, reduced motion, existing narrow/tablet regressions and Axe checks remain. Browser traces/videos are reproducible through test configuration; no private browser profile or authentication token is exported.

Known limits: bounded training profiles/topologies; no individual networking management beyond the VM bundle; no VM update/remote execution; allowlisted app configuration only; fictional SaaS roles/capacity; transient unsubmitted form values; origin-bound localStorage; best-effort compare-before-write rather than distributed transactions; one prior archived attempt and explicit unverifiability beyond retained history. A passing local/assisted task is not professional competence or certification readiness.

### Inspected desktop evidence

Before: [3.2 conceptual IaaS](screenshots/32-iaas.png), [conceptual VM](screenshots/32-vm-1920.png), [SaaS teaching](screenshots/32-saas.png). The following are actual production-built application captures, not mockups. Small graph labels require supported zoom or semantic list inspection; long receipts/debriefs require normal vertical scrolling at1366×768.

| Current workflow                     | 1920×1080                                     | 1440×900                                      | 1366×768                                      |
| ------------------------------------ | --------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| Root course / visible entries        | [1920](screenshots/321-course-root-1920.png)  | [1440](screenshots/321-course-root-1440.png)  | [1366](screenshots/321-course-root-1366.png)  |
| VM Basics / actual anchored target   | [1920](screenshots/321-vm-basics-1920.png)    | [1440](screenshots/321-vm-basics-1440.png)    | [1366](screenshots/321-vm-basics-1366.png)    |
| Persisted App settings workflow      | [1920](screenshots/321-app-settings-1920.png) | [1440](screenshots/321-app-settings-1440.png) | [1366](screenshots/321-app-settings-1366.png) |
| SaaS actual history                  | [1920](screenshots/321-saas-history-1920.png) | [1440](screenshots/321-saas-history-1440.png) | [1366](screenshots/321-saas-history-1366.png) |
| Exact course return / actual debrief | [1920](screenshots/321-debrief-1920.png)      | [1440](screenshots/321-debrief-1440.png)      | [1366](screenshots/321-debrief-1366.png)      |

Technical consequences: [disks](screenshots/321-vm-disks.png), [network configuration](screenshots/321-vm-network.png), [invalid review](screenshots/321-vm-invalid-review.png), [atomic receipt](screenshots/321-vm-receipt.png), [actual NIC](screenshots/321-vm-nic.png), [live graph](screenshots/321-live-diagram.png), [semantic relations](screenshots/321-vm-architecture.png), [VM debrief](screenshots/321-vm-debrief.png), [Web policy rejection](screenshots/321-paas-policy-rejected.png), [policy inspection](screenshots/321-paas-policy-inspected.png), [SaaS capacity rejection](screenshots/321-saas-rejected.png), [Benefits practical reference](screenshots/321-benefits-real-policy.png).

The boundary explanation now explicitly distinguishes the retained conceptual VM experiment from the new persistent Portal lab. This avoids carrying the baseline's “no VM is created” statement over to the whole current learning unit. The manuscript and old evidence semantics are otherwise preserved. Visual inspection is by the implementing agent, not professional human acceptance.

The authenticated Vercel walkthrough found and corrected a presentation defect: VM dry-run Review used the saved-operation explanation. It now explicitly says that validation passed but nothing exists until Create. The browser regression checks the actual persisted command ledger remains free of VM creation before submission. This changes presentation, not domain behavior or evidence.

The same review found that the reused prerequisite Web coach's own exit link still used its historical generic practice origin. In a current practical session, it now receives the validated session's exact course return. An added browser assertion leaves through that coach and resumes the same PaaS lab; historical entry still uses its existing return policy.

Replay review also checks a new guided SaaS session against previously completed administrative state. If Erin is already licensed, the guide explains the saved state and explicit reset requirement rather than falsely saying she lacks a license. The production browser test repeats this case, confirms the capacity fixture after explicit reset and verifies that previous submissions remain in the event history. No additional reward is generated.

Exact return is also a focus/viewport contract. The general lesson-heading focus no longer competes with `activity=practical`. The practical activity owns cancellable settled-frame focus after all required stores are ready; reload uses the same policy. Browser assertions require the practical section to be focused and its heading in the viewport before evidence capture. Manually scrolling a screenshot cannot substitute for this assertion. Navigation/focus still creates no learning evidence.

## Human review gates — not performed

- Azure administrator/architect: challenge region/scope/topology rules, Web-only deny filter, disk roles, hosting/OS/configuration boundaries and no-execution claims.
- Portal expert: follow create/review/receipt/resource workflows and classify unfamiliar/simplified controls against current documentation, without demanding unsupported parity.
- Relative beginner: start from root without coaching, complete one lab and explain why the result follows; record confusion/missed prerequisites/navigation errors.
- Experienced engineer: run each changed task, deliberately reuse old resources, request help and inspect first-attempt classifications; identify misleading success or evidence.
- Accessibility reviewer: complete navigation, native forms, receipt inspection, diagram/list equivalent, reasoning and return using keyboard and a screen reader. Record focus order, announcements, zoom/reflow and confusion. Automated Axe checks do not substitute for this exercise.

Any false resource, lost old record, unsupported operation presented as Azure success, inaccessible essential control, hidden delivery, inaccurate debrief or falsely unaided result blocks acceptance. Educational depth/fidelity acceptance remains separate from engineering completion.
