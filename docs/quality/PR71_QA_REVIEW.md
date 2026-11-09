# PR71 investigation, corrections and delivery evidence

## Verified baseline

Base PR70 `897bc783a3f49be8d9f561a819ee6816b10ed91d`; existing unapproved Draft71 head `ae671f1f24edf2e5e209188a9203435e32ba47f5`. Continue the same branch/PR. Original contract/workflow/source Git-blob map are retained under evidence/pr71/original. No merge or production deploy.

## Original CI failures

Quality112: TypeScript Buffer<ArrayBufferLike> versus NonSharedBuffer in tests/pr71-preservation.ts:30. The prior author corrected its explicit Buffer typing. Quality113/114 then failed formatting; Quality115 passed types/lint but failed Prettier on nine source/test files. Retained original logs are not green regression evidence. The successful temporary formatter workflow did not run the full gates and is removed from the candidate. Formatting uses the normal local check; the existing quality workflow, worker, retries, timeouts, assertions and historical witnesses are unchanged.

## Confirmed functional correction

The original production-built stateless route compared browser Origin against Next's internal request URL. A real127.0.0.1 browser Start returned403, while the same server accepted a manually supplied localhost Origin201. Retained before-origin output and original source establish the cause. The new route validates canonical browser Origin against actual HTTP Host, refuses foreign/cross-site/forwarded-host substitution, and permits HTTPS or loopbackHTTP. Unit tests include Next's internal-localhost/public-Host case; actual native Start must pass without a positive response mock.

Temporary receipt/Overview/reset copy previously implied server storage. It now distinguishes original evaluator output in document memory from PostgreSQL commit receipts. Strict action/snapshot/query shapes, full original replay, bounded next-response admission/reset reserve, document write serialization, generation fencing and uncertain-response retries are covered directly. Temporary evidence remains client-owned and is not course attestation. Server PostgreSQL, every frozen domain/SQL evaluator and course learning authority remain unchanged.

## Author test corrections and preserved red evidence

Early new browser tests initially targeted wrong existing labels/roles, used hard document navigation that correctly discarded temporary state, assumed one explanation on a composed course page, and expected receipt/analysis states different from actual existing UI. Original logs are retained. Corrections use actual Syntetisk tekst and lifecycle Review labels, exact combobox semantics, in-app resource links, explicit Networking→analysis navigation and Properties→latest receipt. No approved pre-PR71 test body/assertion or setting changes. A fixture boundary in the new budget unit test was corrected to reach the actual configured limit; the limit was not weakened.

## Regression scope and efficiency

Preserve all455 approved browser executions and substantive assertions. Six bounded desktop witnesses plus one compact witness give462 (414desktop/48compact). Original397/409/414/420/426/435/441/448/455 controls remain included. One actual-filesystem guard checks every base70 Git blob with finite reviewed presentation/transport exceptions and exact import-only assertion-reader adaptation. Pure House links leave complete old course controllers and their original /portal Sandbox destination intact after removing only the inserted link/import.

Use early targeted tests and one authoritative full CI, avoiding redundant full local browser reruns. No CI worker/retry/job-timeout expansion or test deletion. PR70's initial35-minute limit and older landing/resume, Compute/Back/Axe/PG timing causes remain open where no original trace establishes a cause. A green rerun alone does not resolve them.

## Delivery gates

Actual results, full check, post-stamp independent review, candidate-bound full CI/strict and anonymous exact-SHA root→functional temporary Laboratory→return are recorded separately on Draft71. Vercel Ready alone is not Gate7. PostgreSQL may remain unconfigured publicly; the explicit memory route must nevertheless function. Public persistence, cross-tab shared memory, abuse-tested broad public hosting, course-v3 migration, human SME/UX validation and actual Azure traffic are not delivered.

## Additional actual accessibility findings

The supplemental hub/spoke run first completed all four resource/analysis stages but its Axe harness used browser.newPage, which disallows the extra page Axe needs; it was corrected to an explicit browser.newContext without application changes. The subsequent real root audit and unchanged premium-landing desktop/actual-zoom tests exposed serious label-content-name mismatches: inner status/description text had become part of the full-card visible label while the existing accessible name remained concise. Real full-card overlay anchors now reference independent visible status/description semantically, without duplicate controls or hiding explanatory content from assistive technology. New root Axe assertions retain this regression. The unchanged compact shared-Portal test also exposed the missing visible server-unavailable alert role; the diagnostic now retains its original exact alert inside an explicitly named server-storage disclosure, while temporary Start remains available. Original14pass/3fail evidence is retained. These new findings are distinct from the older unresolved Axe timing cause.

## Completed local check

`npm run check` exited0 with1097 Vitest,24 Node tests, all required contract/curriculum/assets/legacy checks and normal production build. The existing local PostgreSQL17 container was restarted and its unmodified setup completed; no external resource or Vercel variable was changed. The complete candidate browser gate is separate. Corrected new native coverage is7/7 with zero retry. The original14/17 pass run is not reported as a complete pass; only the three affected original cases are repeated after their concrete fixes.

## Final local retests

After preserving the original server-storage alert and full recovery sentence in its explicitly scoped disclosure, the unchanged shared-Portal compact witness passed1/1. The two original root/real-zoom witnesses passed2/2 after the full-card semantic correction; the earlier14 unaffected targeted tests had already passed. Final `npm run check` again exited0 (1097 Vitest/24 Node/production build). Supplemental native hub/spoke→Firewall→forwarding/UDR→VM/NIC/disk→NSG→1433 Allow/3389 Deny→Studio→all six viewport captures/root Axe/refresh-loss completed5/5 in29.4s without retry. Its exact five-stage harness is retained separately from the extended public six-stage harness. These are local actual UI results, not full CI or public Gate7.
