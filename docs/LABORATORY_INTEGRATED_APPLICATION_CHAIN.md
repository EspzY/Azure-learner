# Integrated application chain — explicit Laboratory3.9

This successor integrates the existing Application, Delivery and Data/Functions modules into the one Laboratory command pipeline. It introduces no course content, mission, assessment, learning store, rubric, reward or SavvyShark guide. Existing course-v2 and Laboratory3.0–3.8 workspaces keep their original evaluators, requests and receipts. No workspace is migrated or upgraded.

The successor was registered only after PR75 Quality126 run42672514055 attempt3 completed all475 browser cases, aggregate and strict release on the exact baseline head at19:58:41UTC on9November2026. The new candidate still requires its own independent review, complete exact-head CI/strict release and actual anonymous preview verification. Author checks and pending native validation are recorded separately in [integration QA](quality/INTEGRATED_APPLICATION_CHAIN_QA.md).

## Existing modules and host ownership

The starting delivery files are copied exactly from PR73 commit `a19f9615e475faa3bd651debe13baedd6fa7b580`; the data files are copied exactly from PR74 commit `c571288cec6421b6818883ee4d3fd166f533c3b8`. The [provenance manifest](reviews/evidence/integrated-application-chain/module-provenance.json) records each source path and SHA256. The copied [delivery document](APPLICATION_DELIVERY_PLATFORM.md) and [data document](DATA_SERVERLESS_DOMAIN.md) describe those independent module deliveries and their original source verification. Their module-only status statements apply to those original deliveries; actual successor activation is described here.

`v39` owns the host adapter, typed command union and original receipts. Its World adds nested delivery/data slices around the unchanged3.8 records. A private3.8 projection is only input to the frozen inherited evaluator. The delivery/data modules return immutable proposals; they never allocate independent workspace revisions, persist a second inventory, issue committed technical receipts or replay an alternate ledger. The host uses the same original command ID, expected revision, monotonic ID counter and96-entity/512-event budgets.

Temporary mode and PostgreSQL mode use the same dispatcher and deterministic evaluator. Temporary snapshots remain document-owned, untrusted and replay-checked; they are not durable or authenticated evidence. PostgreSQL retains ownership checks, transaction locks, command redelivery/conflict handling, immutable events, rollback and commit-before-success. Missing public database configuration still produces503 for persistent mode; temporary functionality does not claim that persistent hosting was provisioned.

## Actual command families

The successor admits all40 delivery operations and all22 data/Functions operations supported by the original modules. This includes the Front Door profile, endpoint, origin group and synthetic probe, actual Web App origin, route, WAF custom policy/rule and security-policy association; private Application Gateway, backend pool, listener, probe, backend setting and routing rule; PostgreSQL flexible server/database and firewall rules; logical SQL server/database and firewall rules; Function App with its owned FC1 plan, synthetic HTTP/blob-event function; and typed nonsecret application/database binding.

Each supported module operation has native Create, Review, Save or Delete controls as appropriate. The FC1 plan is inspected independently but created/deleted only with its owning Function App. A profile without an update operation does not display an empty Edit control. Forms select actual current World IDs, retain typed database targets and bind Review/Save to workspace/model/revision. Changed configuration invalidates an old analysis or reviewed proposal.

The approved narrow Storage continuation adds only `DeleteStorageAccount` and `DeleteBlobContainer`. They require an empty resource and no actual modeled reference, checked before constructing a delta. Nonempty resources and Function dependencies are rejected; there is no force flag, implicit cascade, blob-delete command or Resource Group/general ARM delete interpreter. **Requiring an empty resource is a simulator restriction, not full Azure account/container deletion behavior.** These commands remain unsupported under every older model.

## Identity, ancestry and dependencies

| Resource/configuration                    | ARM/local parent                   | Separately modeled dependencies                                                                     |
| ----------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| Web App                                   | Its own Resource Group             | Actual App Service Plan in the same subscription; plan is hosting, never ARM parent                 |
| PostgreSQL/SQL database and firewall rule | Actual corresponding server        | Binding/firewall configuration remains distinct from authentication                                 |
| Front Door endpoint/origin group          | Actual Front Door profile          | Route references actual origin group; security policy references actual endpoint and WAF policy     |
| Front Door origin                         | Actual origin group                | Actual supported Web App ID; a database or invented backend snapshot cannot substitute              |
| Private Application Gateway               | Its own Resource Group             | Actual dedicated subnet/VNet in the supported same-subscription/region profile                      |
| Function App and FC1 plan                 | Their Resource Group               | Function App references its owned FC1 plan and actual Storage account/private deployment container  |
| Synthetic function                        | Actual Function App                | Blob-event profile references an actual container in its app's Storage account                      |
| Nonsecret database binding                | Actual source Web App/Function App | Exact typed PostgreSQL/SQL database ID; no credential, connection string or permission is generated |

Both command directions enforce one case-insensitive `Microsoft.Web/sites` name namespace across all Web/Function Apps in the local World. This preserves the conservative3.8 profile and does not query global Azure name availability. Shared `Microsoft.Web/serverfarms` plan names are case-insensitively unique within their Resource Group. A binding's setting name cannot collide with a Web App setting. The host blocks app/database/Storage deletion through actual configured references and validates dedicated gateway subnet reservations after inherited NIC/VM/Firewall/NSG/route-table proposals. Rejected proposals preserve the complete original World, revision and next ID. After module validation, the3.9 host compares nonnull data proposal before/after values canonically. PostgreSQL JSONB can reorder nested object keys, so a same-value HTTP Function update must emit the same `no-change` receipt as fresh replay before any commit. This is a new host boundary over the exact original module; it rewrites or repairs no historical model, request, receipt or workspace.

Create origin remains immutable. Updates retain identity and origin while recording distinct before/after change evidence. Deletes retain the original event chain and never reuse IDs. Reset clears every active family, retains original through-history and keeps increasing identity allocation. Architecture Studio and Portal inventory project that same World, including labeled hosting and configured-dependency relationships.

## Analysis limits and visible effects

Delivery analysis uses actual configured route patterns, endpoint/origin flags, supported WAF rules/mode and the declared synthetic application response/probe profile. Global Front Door/WAF records explicitly retain `region: 'global'`; their original technical receipts have `location: null`, not an invented regional location. Regional gateway resource projections retain the actual supported region. Create/Update receipts resolve that region; nested Delete proposals may retain `location: null` with their actual parent scope and original resource evidence. A WAF Prevention→Detection Save can change a modeled blocked result to configuration-consistent. Changing the configured probe path can make the result undetermined. These are deterministic configuration results, not measured HTTP responses, live health, TLS, DNS, packets or gateway runtime.

Database analysis uses an actual binding and typed database/server/firewall configuration. Omitted hypothetical source IP remains undetermined; the simulator never discovers or invents a Web App outbound IP. Explicit public-network denial, unmatched IP range and supported configured allow-range are separate results. Authentication, credentials, database roles, queries and successful use remain unevaluated.

Function analysis evaluates only declared synthetic static/echo text against an actual configured HTTP trigger or explicitly selected modeled blob. It executes no JavaScript, worker, network request or event delivery. Every result includes workspace/model/revision and actual resource references. A configuration-consistent result never claims verified runtime or reachability.

## Additive database continuation

`010-integrated-application-chain.sql` extends only the workspace/event model allowlists and rewrites no payload. Cold/repeated current setup is001→002→010. Existing003–009 installations add010. Do not reapply narrower003–009 constraints after a3.9 workspace exists. Original SQL001–009 bytes remain unchanged, including the original constraint replacement history.

New independent tests cover cold and populated3.8 databases, repeated setup, unchanged old model payloads, immutable model ownership, competing writers, original ID redelivery/collision, stale review, rollback, exact through replay/reset and Storage dependencies. The original475 browser cases and substantive assertions remain; only inherited3.8 Start setup explicitly selects its original model before the new recommended3.9 default. New scoped browser cases use ordinary controls and real original requests, with no positive World or receipt injection.

Managed Identity, Key Vault, Private Endpoints/DNS, generalized Monitor/Policy enforcement, real Azure infrastructure and one-engine course migration remain future work.
