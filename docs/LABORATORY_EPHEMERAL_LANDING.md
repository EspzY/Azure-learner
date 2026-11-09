# AzureLab landing, navigation and temporary Laboratory — PR71

Owner direction9 November2026. Base: verified PR70 `897bc783a3f49be8d9f561a819ee6816b10ed91d`. Continue the existing Draft71 branch. The original unapproved candidate `ae671f1f24edf2e5e209188a9203435e32ba47f5`, original contract, removed formatter workflow and failing CI evidence are retained separately; they are not final verification.

## Architecture decision

Keep the stateless Node adapter and current-document memory. Frozen Laboratory3.7 uses Node crypto for the original Blob SHA256. Running those exact rules through one bounded same-origin endpoint avoids a browser crypto shim, a second evaluator or historical engine edits. The endpoint is an execution/inspection adapter, not a new World store, authenticated session service or assessment authority.

- Explicit **Start midlertidig Sandbox uten lagring** creates an empty3.7 memory workspace. It is available even without PostgreSQL; no blocked503-only entry is required. Root navigation alone starts no session or command.
- The browser document owns the temporary snapshot. Ordinary in-app navigation retains it; browser reload clears it. Tabs have independent temporary workspaces. No localStorage, sessionStorage, IndexedDB, cookie or database stores temporary resources/history.
- Every request replays the entire supplied original3.7 command history and compares the resulting World. A forged receipt/World, malformed shape, unsupported version or mismatched workspace fails closed. Client-owned replayable evidence is not tamper-resistant attestation or course mastery: a client can construct a different valid history. Do not use it for course results, first/help/retry/abandon or XP.
- Session, Review, command, historical through, route analysis and NSG/Firewall analysis call the original frozen engine functions. All currently supported Storage, network, NIC, VM/disk, Firewall and lifecycle operations are available through the existing shared Portal. Unsupported services remain unsupported; course-v2 Web hosting is not invented in3.7.
- Fresh temporary workspaces support only3.7. Older versions remain readable/fullfillable through the untouched PostgreSQL path. This avoids exposing a new temporary3.5 history path with its known malformed-input replay limitation; no old3.5 history is repaired or reinterpreted.

## HTTP and memory boundaries

`POST /api/laboratory/ephemeral` never imports the PostgreSQL repository, returns Set-Cookie or persists state. It requires JSON, a valid same-origin Origin/actual HTTP Host and non-cross-site fetch metadata. Next may expose an internal localhost URL, so comparing Origin only to `request.url` was incorrect in the original candidate. An arbitrary forwarded-host override is not trusted. Responses are no-store; no credentials are sent by the temporary client.

Strict action/query/snapshot shapes, original request parsing and512-event replay bounds precede execution. Input is capped at786432bytes. Admission also bounds the **next** returned snapshot, with envelope/reset reserve, so the client cannot advance to a history too large to read or submit. Saturation fails with history-limit before memory changes. These are bounded controlled-preview safeguards, not a claim of global distributed rate limiting or large-traffic readiness.

Commands are serialized within this document and retain expectedRevision/commandId. Same ID/request returns the original receipt; conflicting redelivery fails. A rejected domain command returns its actual receipt without a partial resource change. Review and analysis never advance memory. A lost response does not prove a commit: the last received snapshot remains, and the same request can be evaluated again. Explicit workspace replacement invalidates older in-flight results. No cross-tab synchronization or server transaction guarantee is claimed for memory mode.

Temporary Overview, receipt, reset and footer wording states actual memory scope. It does not claim the server stored a receipt. Original Create-origin and historical before/after remain replayable until the document is discarded. Reset is an explicit original ResetWorkspace command and retains that document's command history; full history can be discarded explicitly by browser reload.

## Persistent and course preservation

Configured PostgreSQL continues through the unchanged original API, repository, row locks, commit/idempotency, owner cookies, Origin checks, migrations and all model dispatch. Memory starts only through an explicit choice and cannot write to a server-backed workspace. A persistent failure while an existing workspace is loaded remains an error; the application does not silently switch it to memory. Persistent and course reset do not clear temporary state; temporary reset cannot alter either authority.

All old course/domain/rubric/guidance/Journal/XP, frozen3.0–3.7 engines/SQL and locked PR70 evidence remain unchanged. The course header's original `/portal` Sandbox route is retained. Replacing that route with `/labs/laboratory` would bypass its old workspace/evidence and would not integrate the engines. Free Laboratory is reached from the real root card; **Til forsiden** gives a clear neutral return from course, guided Portal, free Portal and Studio.

## Landing and navigation

AZ-900 and the wider Laboratory card each contain one real, full-card link. Their former visible CTA buttons are removed without replacement. Planned AZ-104/AZ-305 remain noninteractive. Read-only progress, Course Hub resume priority and the unissued completion contract remain unchanged.

Cards share balanced compact dimensions, subtle cyan/lavender depth and a small decorative arrow. Ordinary activation uses a140ms presentation cue before the existing router navigation. Modifier clicks remain native; reduced motion removes the cue and movement. A restored page clears transient opening state. No animation registers progress, starts assessment or creates resources. Shared Home-link presentation has no learning/workspace provider. Product Home `/`, Course Hub `/learn` and each Portal's internal Home remain separate destinations.

## Verification and delivery

Actual negative and native checks cover incorrect original origin handling, malformed/tampered history, byte admission/reset, lost responses, current-document concurrency, stale scope, same-ID redelivery, real resource creation/inspection/edits, historical replay, route/NSG/Firewall analysis and reload loss. Database-backed tests remain required. Old455 witnesses and all substantive assertions/settings are retained. Full check, stamped independent final audit, full exact-head candidate CI/strict and actual anonymous root→functional Laboratory→return are separate required gates, recorded only when executed. A public Ready status is not functional evidence.

The [course integration plan](LABORATORY_COURSE_INTEGRATION_PLAN.md) is proposed work for owner review, not an implemented migration or a claim that course-v2 and3.7 are already one technical runtime. No external database, Vercel configuration, real Azure operation, merge or production deploy is part of this PR.
