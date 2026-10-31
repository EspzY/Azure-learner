# Azure Storage Part A — accounts and services

P08 / PR33, authored31 October2026, based on verified PR32 `72ba60a46871d32991893efc1a61138a4f830f2d`. Scope is `2.3.01` and `2.3.04`; P09 tiers/redundancy and P16 movement/migration remain unchanged. No merge or production deployment.

## Source discovery before manuscript

Read the current AZ-900 study guide (skills measured20 July2026), the eight-unit Storage Learn module, its introduction, accounts, services and summary bodies. Redundancy, migration and movement units are explicitly later scope. The protected module assessment is excluded; no Microsoft questions or illustrations are copied. The accounts unit contains an embedded video: its presence is documented, not claimed as watched or an executed Azure sandbox. No paid account or cloud operation is used.

Actual public Microsoft Markdown bodies were retrieved with normal TLS on31 October2026. The body is readable without authentication; generic sign-in controls in the HTML shell do not imply article-body access is blocked. Source IDs and dates are registered in `storage-sources.ts` and the release record. Local research snapshots are ignored artifacts, not redistributed Microsoft manuscripts.

| Sources      | Applied claims and disposition                                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| SS01–06      | Study guide, module/unit discovery and bounded AZ-900 scope; reviewed-essential.                                                                    |
| SS07–08      | Account namespace, services, supported modern types and service/type/region qualifications; reviewed-essential.                                     |
| SS09–10      | Object/container/blob organization, block/append/page distinction and hierarchical-namespace qualification; reviewed-essential.                     |
| SS11–12,SS21 | Azure Files protocols and current management/account/media options; reviewed-essential.                                                             |
| SS13–15      | Queue/message relationship, asynchronous workers, at-least-once redelivery, no FIFO/exactly-once application guarantee; reviewed-essential/applied. |
| SS16–17      | Table/entities/properties, combined PartitionKey/RowKey identity, no relational joins or SQL engine; reviewed-essential.                            |
| SS18         | Managed block disks and real VM OS/data disk relationships; reviewed-essential. No SLA/performance/ephemeral-disk simulation.                       |
| SS19         | Account existence/public address is not anonymous Blob read permission; reviewed-essential. No token or access-control simulator.                   |
| SS20         | Account creation options and technical kind/SKU distinction; reviewed-applied reference only. No create/deploy controls.                            |

### Current-document qualifications

The general accounts/Learn table is a useful four-family introduction, not an exhaustive current Files deployment catalogue. Current Files management documentation distinguishes provisioned `FileStorage` accounts on SSD **or HDD**, pay-as-you-go `StorageV2` HDD shares, and top-level `Microsoft.FileShares` resources without an account (currently NFS). The compatibility studio explicitly models classic account-based shares and includes provisioned HDD file accounts as a fifth row. NFS requires SSD in this bounded account model; SMB/NFS can coexist as different shares in a suitable account, not both protocols on one share. Standalone Files is explained as an additional current option, outside the studio matrix rather than incorrectly rejected as nonexistent.

Premium page blobs support only page blobs; premium block blob accounts do not supply Queues/Tables/Files. Managed disks are not a fifth child service inside the learner's account. Legacy GPv1/Blob-only/classic accounts are dated historical context, not recommended new choices. The source contains both type-change restrictions and specific legacy upgrade exceptions: the course teaches no universal in-place conversion promise. Region/protocol/media/billing/feature compatibility must be checked for a real deployment; a declared educational assumption is never a live availability check. Redundancy variants and real pricing are deferred to P09.

## Original manuscript and learning sequence

One business context, **Fjordverk**, needs catalogue images, shared production documents, deferred image processing and flexible product metadata. The student first separates persisted data from compute that processes it and networking that transports it. One account may organize several service namespaces without making those data structures interchangeable or publicly readable.

The original Bokmål manuscript is authored in the appended `storageNb` export in `src/content/nb.ts` before presentation components. Each section defines terms, explains its mechanism, follows a concrete worked example, identifies wrong assumptions and states limits. Sequence: fundamentals → Blob → Files → Queue → Table → account options → managed disks → Workload Studio → guided work → new independent situations → Summary. Networking is a prerequisite for access/path distinctions; no previous Networking result is reinterpreted as Storage credit.

| Local objective | Teaching/mechanism                                                                       | New-context assessment responsibility                                      |
| --------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| SG01            | Blob/object versus shared file semantics; changed client access requirement              | Distinct media-delivery, mounted-file and changed shared-access decisions. |
| SG02            | Queue/worker redelivery versus Table/keyed entities; changed query/messaging constraints | New background-work, keyed-record and relational/broker counterexamples.   |
| SG03            | Account/service/media/protocol compatibility with declared region qualification          | Different premium/standard service combinations and NFS requirements.      |
| SG04            | Managed block volume versus account-organized data services                              | Actual read-only VM/disk context and independent disk/export comparisons.  |

## Model and evidence boundary

Storage Workload Studio is one surface with three coordinated perspectives: workload choice, account compatibility and data/service relationships. A deterministic message-lifecycle investigation adds producer → lease → worker side effect → missing delete → redelivery → delete. Application idempotency changes the side-effect count, never the number of deliveries. No real clock, queue worker, file, database, upload, Azure API, token or deployment exists.

Guided design requires saved correct choices for the four different needs and a changed image-access contrast. Compatibility requires unsupported and corrected account combinations and an explicitly unverified region contrast. The third mission exists because redelivery/idempotency is a different mechanism, not another service-name quiz. Each requires prediction, explicit run, validated witnesses and a causal explanation. Visits and control changes never complete work.

`azurelab.learning.storage-services.v1` pins schema1/content1.0.0/model1.0.0/rubric1.0.0. It reuses the existing bounded event/replay/durable store/provider patterns, first/help/retry/abandon and family exposure. Old stores and XP are not migrated. Raw input, ordering, log capacity/terminal reserve, stale writers and compare-before-delete recovery are validated. Conceptual snapshots remain outside World and technical receipts.

New independent context `storage` must be registered in shared teaching, Journal/Summary, mission safety/recovery, Course resume, existing guidance/Portal shielding and explicit all-data clear. Metadata browsing writes no assistance; actual answer-bearing teaching requires durable aid in every active context. Failed aid or uncertainty withholds teaching, including an already-open Journal.

## Course Hub integration

One ordinary Storage Part A row follows Networking under path02. No new promotional panel, fourth path or competing navigation. Existing contextual sidebar and Course bar handle all Storage activities. Part B remains planned. Exact module/activity state must survive client transitions, Back/Forward and reload; active independent resume retains its case.

## Verification and delivery record

Implementation, targeted domain/browser results, actual inspected images and independent post-stamp audit will be recorded before delivery. The inherited166-case desktop/compact baseline is extended by meaningful Storage tests; the legacy complete profile remains available. Full `npm run check`, production build, mandatory plan check, pinned Chromium and exact-head CI/strict release remain required. No repeated complete local regression is planned.

External Gate7 remains independently **BLOCKED** until the stable preview actually opens and displays the verified SHA through legitimate access. Ready status, local images and green CI are separate evidence. Human Azure SME, novice/usability, screen-reader and measured transfer reviews remain unperformed.

## Authored A–F scope and actual evidence

Only2.3.01/04 are revised: substantive original theory and limits (A/B), causal Studio investigations (C), changed independent contexts (D), paired grading and all-alternative counterfactual feedback (E), and current scoped official source checks (F). Other55 audit rows, including P09/P16, remain exact. COMPLETE describes authored content, never learner mastery or human approval.

Actual full local `check` exited0:378 Vitest,288 curriculum,17 Node fixtures,99 Markdown files/links and build. All14 new/affected production browser cases passed55.8s, exit0. The initial8-case process exited1 on fixture/selector issues; corrected3 passed12.9s, then the complete14 passed. The final bounded manuscript/table refinements received288 curriculum, lint/format/build and affected3-case20.3s plus2-case5.5s retests, all exit0. No complete local175 suite was duplicated.

Author review strengthened sa03 with simultaneous SMB editing and retained HTTPS publishing, and sa04 with visibility expiry while the first worker is alive plus separate job status. Worked examples use different service/failure-boundary fixtures from subsequent guided predictions. A systematic longest-correct-reason cue in the first draft was removed by reauthoring alternatives and matching feedback. This is not psychometric validation; separate blind decisions before keys remain required.

Actual personally inspected production images: [ordinary Hub row](screenshots/storage-services/hub-storage-entry-1440.png), [theory](screenshots/storage-services/theory-1440.png), [1920 design](screenshots/storage-services/design-1920.png), [1440 full matrix](screenshots/storage-services/account-matrix-1440.png), [message lifecycle](screenshots/storage-services/queue-lifecycle-1440.png), [1024 entity relationship](screenshots/storage-services/table-relationships-1024.png), [independent controls](screenshots/storage-services/independent-1024.png), [mixed-client feedback](screenshots/storage-services/feedback-sa03-1024x500.png) and [long-worker feedback](screenshots/storage-services/feedback-sa04-1024x500.png). All17 images include three native briefings and1366/1024/800 short windows. Short views use ordinary scrolling. Keyboard/focus/reduced-motion/Axe/document-overflow checks passed. Native browser zoom, human screen-reader/usability/learning studies remain unperformed.

All21 old content exports compare exactly after only six declared navigation/assistance metadata extensions. Technical World/commands/receipts, old models/stores/rubrics and XP are preserved. Direct short-view sa03/sa04 probes reject correct-decision/wrong-reason, accept correct pairs and preserve the exact first event prefix. Capture/probe processes exit0 without runtime errors or automatic external requests. Candidate175 exact-head CI and strict release remain mandatory; local images are not deployed-SHA evidence. External Gate7 remains separately SSO blocked.

Independent audit identified PR33-A11Y-01: inherited Portal hover styling made Storage primary-button white labels unreadable. A Storage-only hover rule now preserves white on dark blue without changing other modules. Production rebuild and the strengthened existing compact case passed10.8s, exit0: hovered-button Axe contrast and3px keyboard-focus checks at all six desktop/short viewports. The separate reviewer must verify this correction against the renewed stamp.
