# Security Rule Lifecycle — Laboratory3.6

Base: PR68 `37f6083f09dda8fceae0ba78b80b2ac91874a9fd`. Scope: explicit new `laboratory@3.6.0` workspaces, four commands over existing custom NSG and Firewall network rules. No new Azure service, course, assessment, scoring or automatic remediation.

## Version and persistence

Models3.0–3.5 retain their original executors, parse/replay meanings, requests, resource IDs, snapshots and receipts. Existing workspaces are not upgraded. The current UI explicitly starts3.6; the previous model chooser and existing sessions remain usable with their original operations. At the existing groups/services entry, older models including3.5 can explicitly open a separate empty3.6 workspace through the existing confirmation/server session contract. It is not a migration or a general workspace switcher; original owned old-token history remains unchanged. New commands against an old model remain unsupported.

Additive SQL007 extends only the existing model constraints. Cold installation is001→002→007;007 supersedes the constraint-only003–006 in cold setup. Upgrade an existing002/003/004/005/006 database by applying007. Repeated current setup never applies a narrower old allowlist. Do not run old constraint-only setup over a populated newer database: its constraint validation must fail rather than rewrite data. Original SQL001–006 and the PostgreSQL repository/transaction implementation remain unchanged. No hosted database, credentials or Vercel configuration is introduced.

Workspace row locking, owner/session checks, expected revision, exact-request idempotent redelivery before stale-revision validation, append-only events, original receipts and commit-before-response remain the existing authority. Rejected commands preserve World; a Review produces no event/receipt commit. Explicit Save produces one event and at most one World-revision increment. Different payloads with the same command ID remain conflicts; a lost response can be recovered using the exact original request/ID.

## Four exact commands

| Command                   | Identity and parent preconditions      | Mutable configuration                                                                   |
| ------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| UpdateSecurityRule        | actual custom ruleId + its exact nsgId | direction, priority, protocol, source, sourcePort, destination, destinationPort, access |
| DeleteSecurityRule        | actual custom ruleId + its exact nsgId | removes only this active custom rule                                                    |
| UpdateFirewallNetworkRule | actual ruleId + its exact collectionId | source, destination, protocol, destinationPort                                          |
| DeleteFirewallNetworkRule | actual ruleId + its exact collectionId | removes only this nested rule                                                           |

Every required field must be present with its supported type; extra fields are rejected. Update is a complete replacement of the supported configuration, not an unchecked patch. Rule name, parent and stable ID are immutable in this simulator scope. Standard NSG rules are derived read-only policy rules, not editable World records; `default:` identities are expressly unsupported. Unknown/deleted IDs and a mismatched parent are rejected. A no-op update is rejected as `no-change`. Empty unknown property names are rejected explicitly, including on otherwise complete parser-admitted requests; their rejected receipt may retain `field:""`.

The new executor validates a private Create proposal with only the original target removed. This reuses the complete frozen validator: names/default protection, actual parent, priority/direction conflicts, literal IPv4/CIDR, single ports/wildcards, protocols and resource budgets. The proposal's allocated ID, receipt and World are discarded. Only the validated configuration is applied at the original array position, ID and Create-origin. This is neither a second write engine nor a persisted substitute World. Updates at a full rule budget remain possible because they replace one rule rather than create another.

NSG supports the existing100–4096 custom priorities, uniqueness within direction, TCP/UDP/Any and the existing literal single-address/prefix/port/wildcard subset. Lists, port ranges, ASGs and custom service-tag expressions remain unsupported. Default service-tag evaluation remains the original three-valued policy model; unknown is never invented Allow/Deny. Existing first-match/priority semantics are unchanged.

Firewall hierarchy stays Policy→Rule Collection Group→Network Rule Collection→Network Rule. Collection priority/action and group priority remain unchanged. Network rules have no individual action or priority. The local stable rule ID is an identity for nested configuration/evidence, **not a claim of a separate top-level ARM resource**. Its edit represents one atomic change to that existing policy's nested content. The existing L3/L4 subset remains TCP/UDP, one literal source/destination and a single destination port or wildcard. Inheritance, DNAT, application rules and advanced expressions remain unsupported. Empty collections/groups/policies are retained after deleting their last rule. The existing evaluator determines the next matching collection/rule or modeled default deny.

## Original evidence and replay

Create-origin is never overwritten. New3.6 lifecycle receipts add `updatedIds` and an immutable `change` projection: exact ID/name/parent/Create-origin, complete before configuration and complete after configuration (null for Delete). Existing command envelopes and receipt fields remain; inherited operations retain their original receipt shape. This extension belongs only to3.6, never to an older receipt replay.

Update preserves nextId and resource count. Delete lists exactly the removed ID, decrements active count by one and changes no parent/other rule. Later Create and Reset preserve the original monotonic identity counter, so deletion never reuses an ID. All original events/receipts remain available, including replay before/after Update, before/after Delete and before a later Reset. Missing or unverifiable history is an error, not reconstructed success from current resources.

The same frozen3.5 route/NSG/Firewall evaluators inspect updated3.6 configuration through a private read-only projection. All result model discriminants, including nested route results, bind to3.6 and the actual revision; no new policy matcher is introduced. Studio reprojects actual current rules and invalidates old analysis at revision changes. Removed rules disappear from active topology while their original evidence remains accessible.

### Deterministic rejected inputs in3.6

PostgreSQL JSONB does not preserve object insertion order. The new lifecycle executor selects the first unsupported field from a sorted key list, including the empty-string key by an explicit undefined check. For inherited commands only inside3.6, it evaluates a private canonical command copy before delegating to the frozen executor. The submitted Request object is not mutated or rewritten; valid inherited outcomes/receipts and actual World changes remain the same. This prevents rejected requests with multiple extra fields from producing a receipt that disagrees with later JSONB replay. Older executors remain byte-identical; no claim is made that their historical malformed-request failure mode or previously unverifiable records were repaired. The unreleased local adversarial failure remains original evidence, not silently corrected data.

## Portal flow

Only actual custom rule detail views in3.6 expose Edit/Delete. Original Properties/Create receipt/parent navigation are retained. Latest accepted lifecycle receipt is derived from the existing ledger, not a new last-modified store. Edit captures workspace, immutable model, revision, exact ID/name/parent and current configuration. Review uses the original server Review endpoint and displays its authoritative before/after values. An accepted Review replaces the editable fields with the comparison; Back to editing restores the unchanged draft and clears approval. The shared full-page minimum form height is explicitly removed inside this modal. Save uses the parent's existing command/pending-response path. Review is never treated as a commit.

Delete additionally requires a visible explicit confirmation for the pinned name/ID/scope. A changed revision invalidates the displayed approval; the server also rejects the old expected revision if a competing commit arrives before the client learns about it. Cookie/workspace changes are rejected by the existing workspace precondition. No name-based fallback or optimistic removal occurs. Cancel and reopen explicitly obtain current configuration; there is no silent rebase/overwrite.

History presents actual immutable change values, original Create receipt and parent links. An explicit read-only control loads both original through-boundaries from the same verified repository, exposing historical configuration or confirmed absence. It never borrows current state after deletion/reset. Studio provides the existing observation→resource→Portal→return navigation; no alternative write path is added to Studio.

## Official reference review —8 November2026

Actual retrieved bodies, response versions/dates and SHA256s are retained in PR69 evidence before final stamp.

- [Manage NSG](https://learn.microsoft.com/en-us/azure/virtual-network/manage-network-security-group): selecting a custom rule, changing settings and Save; explicit Delete; default rules cannot be deleted. Current Portal illustration/text is reference material, not tenant-parity approval.
- [NSG overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview): custom priorities100–4096, first-match, unique priority **and direction**, five-tuple/stateful Azure behavior. The management article's abbreviated uniqueness wording is read with this more precise direction qualification. This simulator still analyzes only hypothetical new initiations; no stateful runtime is added.
- [NSG ARM child resource](https://learn.microsoft.com/en-us/azure/templates/microsoft.network/networksecuritygroups/securityrules): parent NSG/name identity and properties. The simulator explicitly freezes name and parent and supports only its documented subset.
- [Firewall policy rule sets](https://learn.microsoft.com/en-us/azure/firewall/policy-rule-sets), [rule processing](https://learn.microsoft.com/en-us/azure/firewall/rule-processing): group/collection priorities, terminating collection actions, modeled network-only default deny. Broader real DNAT/application/inheritance processing is not implemented here.
- [Firewall ARM RCG contract](https://learn.microsoft.com/en-us/azure/templates/microsoft.network/firewallpolicies/rulecollectiongroups), observed2026-03-01 schema: `properties.ruleCollections`, filter collection `action` and nested `rules`; network-rule source/destination/protocol/ports, without a per-rule action/priority.

These are scoped technical references, not a new AZ-900 learning-content review. Human Azure SME, novice/UX, screen-reader and learning-effect validation remain unperformed. No packets are sent or VM reachability verified.

## Verification and open QA

Targeted pure, actual PostgreSQL and native Portal/Studio scenarios must cover full validation, Create-origin, before/after replay, default immutability, revision/ID conflicts, rollback, session change/isolation, reset, original receipts and all historical models. Preserve all441 prior browser controls and substantive assertions; historical setup explicitly chooses its original model. The final expanded profile is402desktop+46compact=448, with seven focused additions. Full check, separate post-stamp six-domain audit, exact-head complete CI/strict and actual anonymous full-SHA/expected503 remain distinct delivery evidence.

The first new combined five-path migration test exceeded its unchanged5000ms bound. It is split into independent migration-path cases with the same assertions and unchanged per-test timeout, not a higher bound or skipped path; original red log/source are retained. PR68's earlier landing duplication, CPU-constrained resume-readiness observation, older Compute/Axe/PG timing and35-minute CI-budget causes remain open unless specifically explained. A later green run is not a causal fix. Public functional Laboratory remains owner-approved unavailable without a database; local PostgreSQL and isolated CI are the functional environments.
