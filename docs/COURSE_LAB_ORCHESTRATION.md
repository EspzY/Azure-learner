# Course/lab orchestration

## Briefing boundary — 2026-10-26

A guided practical launch is now two actions: open mission, then explicitly start the existing session. Cancel does not choose a content version, create a session or write a command. The Benefits inspection bridge has its own shorter brief and retains its allowlisted exact origin; it creates no practical session. Valid resume bypasses repeated briefing. The legacy Service Types Web prerequisite launcher also briefs on first start; its predicates and course return are unchanged. [Audit](GUIDED_LEARNING_REFINEMENT.md).

For the current practical labs, `activity=practical` delegates focus to the actual practical activity after its stores are ready. The generic lesson-heading effect skips that activity. Cancellable settled-frame scrolling/focus preserves exact debrief/resume on navigation and reload without stealing focus during individual answers. Focus and route parameters are navigation only, never assessment evidence. See the [practical architecture](INTEGRATED_LABS_ARCHITECTURE.md) and [QA](PRACTICAL_LABS_QA.md).

## 3.2.1 practical sessions and evidence

New `azurelab.practical-labs.v1` / practical-labs@1 events pin kind, mode, allowlisted lesson origin, technical attempt and command-ID boundary. Stable lab/rubric/model/source definitions are in `domain/sandbox/practical.ts` and `content.ts`. Inspection references, reason drafts, explicit help, submit-through IDs and abandonment replay separately from inventory. Earlier sessions can be selected/resumed without replacing their boundary. First deliveries remain immutable; retries are new sessions. Versioning the definition/rubric requires a new content version, never reinterpretation.

Current technical findings replay the versioned operational ledger; old service/course rubrics now use model-aware receipt verification while preserving their original criteria. Independent VM/PaaS require new post-boundary resources; SaaS requires post-boundary departure actions. Successful prior guided configuration cannot pass a new task. Resets make references to another attempt unverifiable rather than inventing success; old answers remain stored. All evidence is local and unauthenticated.

PaaS without an app launches the existing real Web lab, reusing an eligible prior group and actual policy/hosting inspection. Its prerequisite stays resumable through the original pinned course session. Existing apps can be configured directly as guided practice. Return is `/learn/{allowlisted-module}?topic={origin}&activity=practical`, with section focus after hydration. Service Types practical links/returns explicitly retain version2, including a learner who previously chose the v1 archive; the old bytes are unchanged. Leaving unfinished keeps commands and session; unsubmitted form edits are transient. Benefits bridges carry their own originating topic. No independent task is started from URL parameters. [Architecture](INTEGRATED_LABS_ARCHITECTURE.md).

## 3.2 lab reuse and return

LabSession retains schema/version and adds only allowlisted navigation origins services-v1/services-v2 alongside computing-v2. Restore accepts historical sessions without origin. Origins do not affect validated technical predicates. Current/archive entry explicitly sets its own origin, so one course cannot accidentally return to the other version. A user may opt into a boundary-null session for accepted prior resources in the same replayed attempt. Policy and hosting inspections still need actual matching receipt/resource IDs; resources and old observations are not recreated or migrated. New independent assessment contexts suppress coaching highlights. See [architecture](CONTENT_ARCHITECTURE.md).

## 3.1B computing origin

The same lab starts at `/learn/computing?topic=resource-bridge`. Sessions may carry `origin: computing-v2`; old sessions keep their shape/service return. Guidance, inventory and receipt predicates are unchanged. Return selects the originating bridge with `activity=lab|debrief` and focuses the saved section. Origin cannot complete a module/assessment. Unfinished work remains resumable after reload. Unsubmitted form values are transient.

The course, Portal and live diagrams share the root ChapterProvider, LearningProvider and one ServiceStore. A minimal CourseProvider adds a separate `azurelab.course.v1` preference/session record; no original schema or award migrates. It holds an allowlisted resume topic and one bounded guided session with model version, technical attempt number, starting command boundary and validated inspection references. Resource state is never copied.

Explicit lab start pins the existing technical attempt and command boundary and opens the real `/portal` with a lab-context hint. URL hints alone cannot create a session or learning completion. Course return is a fixed allowlisted module/topic. Leaving retains valid world state; course shows unfinished/resumable versus actual guided-satisfied findings. Re-entry does not reset resources or teaching observations. Browser history preserves operational pages and course context. Reload restores committed resources and session; uncommitted form values are not promised. Direct free Portal entry has no forced activity or guide.

All persisted shapes, IDs, bounds, schema and technical references are validated. Unknown/corrupt records are quarantined; blocked storage reports memory-only state; compare-before-write detects stale tabs. Recovery clears only this new record, never old resources or awards. Global explicit deletion includes it. Technical restart invalidates missing prior lab evidence instead of inventing success. No local data is server-authoritative.

The existing independent task continues using its original first-submission/help/retry/abandon and replay boundaries. Entering course theory, journal or guided help during an active task records assistance; independent Portal operation has no coach highlights. Course navigation and reflection do not bypass that rubric. Test direct URLs, Back/Forward, interrupted/resumed lab, stale attempts and original saves.

The metadata-only overview does not mark assistance. It prioritizes an active independent task, then the saved course location, then an actual older computing unit, then the first unit. Full theory or an open journal records assistance even if storage finishes loading after the route/dialog mounted. A new guided lab cannot start while the service independent task is active; the course offers return to that task for explicit completion/abandonment. This avoids mixing guided navigation into an independent attempt silently.

Guided return and practice resume use allowlisted `activity=lab` / `activity=debrief` context according to actual findings. Once validated stores hydrate and route layout settles, the course scrolls/focuses its committed semantic section refs; this avoids returning above a long manuscript. Unknown activity values are ignored; requesting debrief without actual satisfaction cannot create success. Navigation context cannot mutate evidence or issue a command. Back/Forward/reload preserve the activity and lesson. Query context avoids accumulated fragments on repeated return. The debrief describes a permitted configuration without falsely claiming a post-denial correction when an already-correct plan was accepted first.

Browser localStorage is origin-bound. Old records remain compatible on the same origin; a different Vercel preview hostname has its own browser records. No automatic cross-origin/account migration is claimed.

## 3.1B.1 labels and navigation

The existing replayed `labFacts.complete` now projects **Gå tilbake til laboratoriet** as a secondary action and **Fortsett undervisningen** in the course bar. Incomplete work still offers **Fortsett praktisk lab**. No predicate/session migration was added. Course heading focus excludes the existing valid lab/debrief activity anchors so exact return remains authoritative. Summary/next navigation never submits an assessment or promotes a checkpoint.
