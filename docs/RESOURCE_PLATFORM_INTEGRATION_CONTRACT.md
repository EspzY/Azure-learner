# Resource Platform integration contract

Owner direction: 9 November 2026. All three branches start at verified PR72 `249833f7cb7ea41d3e411444ec3c4f83805d3a5f`. This is an operational simulator delivery; no new course task, mission, briefing, assessment, reward or SavvyShark guide is authorized.

## Authority and ownership

The existing common Portal presents one selected workspace. Laboratory's version dispatcher selects its exact frozen evaluator. Temporary and PostgreSQL storage adapters execute the same versioned domain; neither storage adapter defines resource rules. Historical course-v2 remains its own frozen authority until a separately approved course adapter exists. Shared presentation does not mean that historical course work already uses Laboratory.

| Track                    | Branch                                  | Exclusive responsibility                                                                                                                                 |
| ------------------------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A — Application Platform | `codex/laboratory-application-platform` | New explicit `laboratory@3.8.0`, engine/dispatch, additive database allowlist, transport capability, Portal/Studio integration and App Service lifecycle |
| B — Application Delivery | `codex/laboratory-application-delivery` | Pure Front Door/Application Gateway configuration slices, validation and read-only request analysis; no engine/store/dispatch                            |
| C — Data & Serverless    | `codex/laboratory-data-serverless`      | Pure database/Function configuration slices, validation and read-only connection/invocation analysis; no engine/store/dispatch                           |

Each track uses an isolated Git worktree. Only A changes critical common files. Integration and review must distinguish tested pure module behavior from registered engine operations and actual Portal functionality. A source module or test alone does not activate a Portal service.

## Resource identity and dependency boundary

Resource references contain a stable ID and an explicit supported resource type. A resolver obtains the referenced record from the selected authoritative World. It never resolves by display name, creates a copied inventory, trusts a client-supplied backend snapshot or searches another workspace. Identical names in different allowed scopes remain distinct.

The application view exposed to dependent modules is read-only and includes actual `id`, `name`, `type: Microsoft.Web/sites`, `groupId`, derived `subscriptionId`, `region`, configured enabled state, public-network setting, HTTPS-only setting and the configured synthetic application's health path/response status, when present. A synthetic response is declared simulator configuration, not a measurement of Azure health, code execution or an HTTP request sent to a server.

B and C take bounded resource context and state slices as parameters. They return immutable proposed slice changes plus affected stable IDs or an explicit validation denial. They do not increment an independent workspace revision, commit, issue original receipts, keep their own event ledger or implement a second replay dispatcher. New identities are allocated through the authoritative World's monotonic identity counter. Changes must remain atomic at the common engine boundary. Unknown fields and unsupported profiles fail closed with deterministic field selection independent of object-key order.

A database connection refers to actual modeled application and database identities. Configuration consistency, an explicit denial, and insufficient information are separate outcomes. No password, connection secret, managed identity token or real credential is needed or stored. Public access configuration does not establish functioning authentication or real reachability.

## Command, review and history

The existing request identity (`commandId`, `expectedRevision`, exact command payload) remains authoritative. Modules cannot bypass request parsing, revision checking, workspace ownership, event budgets or command-ID redelivery rules. Review computes a proposal without committing. Save must use the reviewed workspace/model/resource/revision and fail on stale state. A committed receipt is published only after the selected storage adapter has accepted the change; PostgreSQL returns it after transaction commit.

Create retains immutable origin. Update retains identity and create origin while producing a distinct immutable change event. Delete explicitly checks dependent resources; a required dependency cannot silently disappear. Reset clears the selected workspace's active state while retaining its historical event chain and monotonic identity allocation. Historical through-replay dispatches the original model, including unsupported commands. No silent migration of course-v2 or Laboratory3.0–3.7 is permitted.

## Analysis and Studio

Analyses bind workspace, model, revision, endpoint/resource identities and inputs. A World change invalidates old results. Portal and Architecture Studio project the same World. Studio cannot write through a second controller or infer missing resources from graph edges. App-to-plan, deployment/settings, delivery-origin/backend and database/function relationships are added only when their operations are genuinely integrated.

Allowed conclusions include configured routing, matching supported WAF policy, configured synthetic response, explicit access denial and consistent modeled dependencies. No result claims an Azure deployment, actual HTTP response, database query, VM boot, TCP handshake, real health probe, authentication or verified connectivity.

## Integration sequence and gates

1. A registers its new explicit model and usable App Service vertical; preserve all historical evaluator/receipt/SQL bytes and test cold plus historical database setup.
2. B/C complete pure module tests and official-source review against the agreed resource context. Their Draft PRs remain independent, without false catalogue exposure.
3. Once3.8 is delivered, freeze it. Integrate each passing module into an explicit successor of A's single command pipeline; never add handlers/fields retroactively to already issued3.8 workspaces. Agree the successor version and additive admission once through TrackA. Then verify atomicity, replay, idempotency, stale writes, capacity and deletion dependencies in temporary and PostgreSQL modes.
4. Add actual Create/Review/Apply/Properties/history/Studio controls for integrated operations; exercise real UI creation and before/after configuration effects.
5. Complete scoped/full checks, independent post-stamp review, exact-head CI/strict release and anonymous deployed full-SHA journeys. Report pending or blocked gates explicitly.

Course adapters, Private Endpoints, Key Vault, Managed Identity, generalized monitoring and Azure Policy enforcement are separate follow-ups. Their resource names or icons never imply working support. Full one-engine course integration remains unimplemented in this phase.
