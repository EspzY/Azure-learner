# Course Laboratory adapter v1 — bounded technical integration

Owner-authorized continuation from verified PR80 `c2bce3efa2ed4a56c96b594a6731662663e597d1`. Main merge remains blocked pending [owner production-control confirmation](BASELINE_OWNER_ACCEPTANCE.md) and explicit approval. One main agent, one implementation PR. The frozen baseline is a release-acceptance PR, not a second active implementation stream; this necessary dependency is explicit until main is approved.

This implements the workspace/command/evidence prerequisite from [the existing integration proposal](LABORATORY_COURSE_INTEGRATION_PLAN.md), **before** any pedagogical pilot. No new mission, assessment, learning scenario, SavvyShark assignment, content version or rubric is defined. Existing `/portal` and AZ-900 stores/attempts remain original and fulfillable. No v2 data is imported or renamed.

## Technical vertical

An explicit optional AZ-900 technical workspace uses the existing Laboratory Portal/controller and `laboratory@3.9.0`. It is a course-scoped resource workbench, not a learning activity or a successor assessment. Resource Group → Storage Account → private Container → Text Blob → original receipt → persistent reload → immutable technical evidence checkpoint is the verification journey, not a learner mission. The same registered commands, validation, resource IDs within their workspace, receipts and replay are used in free and course purposes.

The shared Portal selects a transport and navigation base; it never defines another World/evaluator. Course analysis uses the same original analysis dispatch and server snapshot as its commands. Scope identity is validated on the server, never inferred from a URL or copied into a client inventory. Free temporary memory may remain active in the document, but cannot answer a course request or produce course evidence.

## Versioned ownership

`course-workspace@1` binds a server-generated context ID, workspace ID, fixed integration profile `az900-technical@1`, course key `az900`, model3.9 and initial technical boundary. Its learning-attempt binding is explicitly absent: this is not first submission, retry or a new content version. Anonymous HttpOnly course-session possession authorizes this technical workspace; it is not a verified student identity or certification history. Later graded use requires an approved authenticated learner/attempt/evidence adapter, not a trust upgrade of a JSON response.

An additive011 migration adds an immutable workspace purpose (`free` by default for original rows), an append-only course binding and append-only evidence checkpoint pointers. Existing World/event/request/receipt JSON is not rewritten. Old schema tests remain supported for free workspaces; the optional purpose column is read through the row's JSON projection. Course creation fails closed if011 is absent. Model3.0–3.9 evaluators and SQL001–010 stay unchanged; no model3.10 is needed for a storage/access adapter.

The existing anonymous session expires after seven days. This delivery does not establish long-term learner identity, certification retention, recovery after lost cookies or hosted production readiness; none of these may be inferred from a persistent technical checkpoint.

Separate cookie names and repository purpose checks protect both directions. A free endpoint must reject a course token even if placed in the free cookie; a course endpoint must reject free tokens and missing/cross-session ownership. Changing the URL cannot switch an existing workspace's purpose. Creation of the empty World and its course binding is one transaction. A missing or corrupt binding is unverifiable, never a free fallback.

## Command and evidence boundaries

Course command/Review requests retain the original typed request and workspace precondition. The existing repository row lock, canonical command-ID redelivery, stale-revision receipt, event insert, snapshot update and commit-before-response remain the single command process. No learning-store write is performed. Explicit Reset uses the original technical command and preserves original events/checkpoints; it is not abandon or a new first attempt.

`course-evidence@1` is a server-created immutable pointer to an authorized binding, original event prefix/through, replayed attempt/revision and deterministic digest. Capture accepts only a capture ID, expected revision and through boundary, plus the workspace precondition. It cannot accept a World, entry array, receipt, score or client claim. Capture/read replays the original database events and validates the prefix/digest. A client-presented envelope alone is never evidence: consumers must resolve its ID under the server ownership check. No new receipt fields or copied technical results store are introduced.

Same capture ID and exact capture request returns the original checkpoint; changed parameters conflict. Checkpoints remain readable through their original boundary after later updates/reset. Missing, tampered, foreign or unsupported evidence fails closed. Capture is an explicit metadata write, not an Azure command, receipt or resource revision. Ordinary navigation, Review, graph inspection and evidence reads create no technical event/checkpoint or learning result.

## Required acceptance

Real PostgreSQL tests must prove cold011/repeat setup and upgrade of populated3.9; immutable old rows/models/receipts; both-purpose ownership; two sessions/tabs; same-engine receipt parity; concurrent/stale/idempotent commands; transaction rollback; original through/reset; checkpoint idempotence/tamper/foreign/invalid-input rejection; and refusal of client-owned temporary history. Browser tests must exercise real Portal controls, persistent reload, receipt/checkpoint retrieval, course/free reset isolation, unchanged old assessment evidence, scoped links/Studio/diagnostics, backend503 without course fallback, keyboard/Axe/reduced motion and compact desktop.

All511 inherited browser cases/assertions/settings remain. New evidence/results and independent audit must describe actual execution. Public free temporary Laboratory remains usable without PostgreSQL; the new course authority is locally/CI verified and honestly unavailable in an unconfigured public preview. No external database, secrets/Vercel changes, main merge or production deployment.

## Historical test preconditions

The native course-source guard independently reads and hashes the whole actual candidate against c2 plus the finite reviewed delta; mutation/unknown-path tests never use a parent view. Historical assertions receive their pinned c2/older files only through the bounded test reader. Its startup checks the exact current path union and native hashes of every declared edit/addition. Unchanged files pass through as actual native bytes, and the original complete baseline admission checks all base paths before exposing parent views. Edited bytes must match the approved current hash before c2 projection. New paths cannot masquerade as historical ones. Baseline and Fidelity admission now run as explicit mandatory module preconditions: failure aborts the suite, and every original assertion/helper body remains. This avoids duplicating the entire335MB unchanged tree in each new reader layer; no large byte cache, runtime import, changed timeout/worker/retry or skipped source check is introduced.
