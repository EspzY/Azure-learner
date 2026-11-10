# PR69 production visual review

Author inspected real local production-build images with PostgreSQL. Shared Portal header/navigation/resource shell and original components remain; no parallel security dashboard. Actual Microsoft Learn NSG reference images and retrieval/hash/version records are retained in `docs/reviews/evidence/pr69/sources/`. The article was fetched8 November2026; its public Portal images have2022 Last-Modified, so these are not claimed as live authenticated2026 tenant captures. Correct service/field names, custom/default distinction and nested Firewall collection semantics were compared; not a numeric visual-similarity or full Portal-parity claim.

- 1440×900: pinned actual name/ID/parent/workspace/model/reviewed revision and complete supported before/after table. Accepted Review replaces editable fields, keeps the noncommit explanation and permits explicit Back to editing with draft/focus retained.
- 1024×768: normal modal vertical scroll; fixed footer actions remain usable, fields and scope identities wrap.
- 1024×500: vertical scroll is necessary; not all identity/comparison rows fit simultaneously. Save/Delete/Cancel remain in the viewport; native keyboard, focus, Axe, reduced motion and no horizontal page overflow passed. Delete requires the explicit target checkbox; Escape/Cancel are read-only.

Actual Studio→rule→Portal Edit→Review→Save→Studio before/after cases use the same stable resource identity. Original/current policy rules and technical revision remain explicit; a modeled policy Allow is not VM reachability. Historical before/after/deletion/reset uses actual through-replay, with a visible failure when history cannot be verified. All screenshot files are actual captures, not generated mockups or injected positive World state. No human novice/UX/screen-reader/learning-effect approval.

Images: `docs/reviews/evidence/pr69/screens/`. Detailed scenarios/assertions: `tests/e2e/laboratory-remediation.spec.ts`. Original failed iterations/timing evidence and disclosed authentication-token redaction: [QA investigation](PR69_QA_INVESTIGATION.md). Independent final review is a separate post-stamp gate.
