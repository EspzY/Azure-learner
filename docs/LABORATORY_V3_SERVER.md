# Laboratory v3 · server authority and first Storage vertical

## PR62 model extension — explicit new workspaces

The original PR60 contract below describes `laboratory@3.0.0`. [Networking Part A](LABORATORY_NETWORKING_PART_A.md) adds `laboratory@3.1.0` for newly started workspaces without changing historical3.0 JSON, events or receipts. One repository/server and the same tables remain authoritative; schema002 adds immutable workspace/model metadata and a matching event foreign key. Apply001 **then**002 explicitly; the local-only setup script does both, with its original remote refusal intact. Migration002 is transactional and rerunnable. No migration is performed by a request or build.

Updated UI Start requests3.1 explicitly; old session requests without model retain3.0 compatibility. Existing cookies resume their original workspace/model. Reset stays in that model. Historical3.0 users can retain Storage/history; networking starts in a separate new browser session, without replacing the old anonymous cookie. No in-place workspace upgrade or new workspace-switching authority is implemented.

The database-readiness review confirms local PostgreSQL17 and isolated CI; no external database, credentials, provider integration or Vercel variables are being configured. Runtime remains generic `pg` plus LAB_DATABASE_URL/LAB_ORIGIN and verified TLS for non-loopback. Future approved deployment applies both explicit migrations with an operator role; runtime retains least privilege. No changes to World/receipts/course history are required merely to choose a PostgreSQL host. Public persistent networking/Storage Gate7 is intentionally deferred until a separately approved database exists.

6 November 2026. PR60 on PR59 `cb99705b1b0650d2099f6c95f5c7e32776448483`.

**Implemented:** a new, isolated workspace at `/labs/laboratory`, discoverable through the ordinary Course Hub footer. Next.js Node Route Handlers use a dedicated PostgreSQL database/schema. Resource Group → Storage Account → private container → synthetic text blob can be created, inspected and read again after reload. These are AzureLab simulator objects; no Azure service, authentication, deployment, billing or learning credit is performed.

**Not a migration:** old `/portal`, `azurelab.sandbox.v2`, frozen Chapter01/sandbox2 replay and every course/assessment store retain their authority and bytes. A new session starts empty only after explicit Start. No old resources/receipts are imported. [PR59's blocker](LABORATORY_STAGE1_BLOCKER.md), [candidate cutover](LABORATORY_V3_ACTIVATION.md) and actual ABA evidence remain unchanged: historical migration is still unresolved. The isolated server architecture replaces that proposed strategy only for this new workspace.

## Authority and persistence

`src/laboratory/v3/contract.ts` pins `laboratory@3.0.0`. This is neither sandbox2 nor an upgraded interpretation of its ledger. The pure finite [domain](../src/laboratory/v3/domain.ts) creates deterministic World/receipts. Only the [repository](../src/laboratory/v3/repository.ts) persists them; the browser keeps a disposable rendered snapshot, never a second persistent inventory.

The dedicated database name starts `azurelab_lab_`; schema `laboratory_v3` is owned by NOLOGIN role `laboratory_v3_owner`. Runtime role `laboratory_v3_app` has narrowly granted access only to that schema. The migration is explicit/operator-run, never a request/build side effect. No Vercel filesystem persistence or browser database is used.

| Table        | Purpose                                                                                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workspaces` | Public UUID reference, hashed secret, seven-day expiry, authoritative World JSONB, event sequence and request-admission counters. UUID is not an access credential.                                   |
| `events`     | Append-only original model, attempt, request and Receipt, with unique workspace/commandId and workspace/sequence. Runtime cannot update/delete/truncate; an additional trigger rejects modifications. |
| `admission`  | Database-serialized global session-creation budget, independent of technical events.                                                                                                                  |

Every command runs on **one checked-out pg client in one transaction**: BEGIN → row `SELECT … FOR UPDATE` using the cookie hash → validate original ledger against replay → workspace precondition → commandId lookup → expectedRevision/domain rules → INSERT original event + UPDATE World/sequence → COMMIT → response. SQL parameters are bound. Row locking serializes same-workspace requests; the second writer sees the committed revision and receives an original `stale-revision` receipt if its expectation is outdated. SQL lock/deadlock/serialization failure gives an explicit conflict, never a claimed commit.

Identical commandId **and identical complete canonical request**, including expectedRevision, returns its original receipt and the **current** World. Reusing the ID with different input returns conflict without replacing the original. Validation/stale denials have original receipts but do not advance World revision; malformed/unauthorized transport input has no technical receipt. No positive response precedes commit. A lost response is honestly uncertain: retry the same command identity or refresh the authoritative history. No optimistic resource is shown.

Every read compares the stored World and sequence with deterministic replay of the complete original ledger. Unsupported/corrupt/missing evidence returns `unverifiable-history`; it cannot produce a fabricated empty/successful World. `GET state?through=N` replays the original first N events, including denials and explicit resets. It is not a lookup in today's resource configuration. Receipt fields reuse the original frozen Receipt **type**, without changing historical Receipt data or v1/v2 handlers. `model + attempt + commandId + sequence + before/after revision + request + addedIds/target` identify v3 evidence. SHA-256 of blob content is deterministic; this is not an Azure ETag or signed attestation.

## Session and request boundary

- Server generates 32 random bytes (256 bits), base64url, and stores only SHA-256 of the secret. No API accepts a session ID from URL/body/header. Queries and request fields are allowlisted.
- HTTPS uses `__Host-azurelab_lab_v3`, Secure, HttpOnly, SameSite=Strict, Path=/, seven-day Max-Age. Only loopback development HTTP uses the non-Secure `azurelab_lab_v3` cookie. An anonymous cookie is a bearer session, not a verified person or permanent certification record.
- Mutations require exact configured `LAB_ORIGIN`, JSON and non-cross-site Fetch Metadata. No CORS permission is returned. Responses are no-store/Vary Cookie/nosniff. The public UUID in `If-Laboratory-Workspace` is an additional stale-workspace precondition **after cookie authentication**, never an authorization selector. Create is pinned to its reviewed workspace; Reset confirmation pins workspace and revision. Observing a changed/expired session discards old previews/confirmation. An unnoticed cookie change is rejected by the server precondition, not silently retargeted.
- HTTP bodies are streamed and capped at 4096 bytes; requests have bounded scalar strings and exact operation fields. Per-workspace successful/admitted requests are limited to120/minute; new sessions to100/minute and2048 total rows. PostgreSQL lock/statement limits are3/5 seconds. These are small prototype budgets, not production abuse protection.
- Initial cookie creation is explicit and coordinated between new tabs using Web Locks. This only avoids a bootstrap cookie race; **database transactions**, not Web Locks/BroadcastChannel/localStorage, own write consistency. BroadcastChannel only tells sibling tabs to fetch authoritative state. A different workspace cookie invalidates pending commands through the UUID precondition.
- Unmodified old v2 code writes its old local key and has no v3 database credential. No v2 writer participates in v3 authority. This does **not** claim isolation against malicious same-origin JavaScript executing with the owner's browser session; same origin remains a trusted boundary. CSRF protects other origins, not an XSS payload on this origin.

Explicit Reset is a typed `ResetWorkspace` command in the same transaction/receipt model. It clears only this workspace's current resources, advances its attempt and revision, retains nextId and original event history, and requires confirmation. It does not touch old Portal/course data. There are512 events/session, with the last slot reserved for Reset; after exhaustion history stays readable. Reset does not erase receipts, renew expiry or bypass that budget. Expired sessions require a new explicit Start, not silent recovery. No automatic purge/retention job exists; an operator must plan expiry cleanup, backup/restore, monitoring and broader abuse controls before a wider hosted service. Losing the anonymous cookie loses access; there is no account recovery.

## Operative scope and limits

| Operation              | Supported input and effect                                                                                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CreateGroup`          | Existing local subscription choices `sub-shared`/`sub-app`, validated RG name and one of the three existing local regions. New group with original receipt.                                                              |
| `CreateStorageAccount` | Existing own group; derived subscription; StorageV2/Standard_LRS; local region; name3–24 lowercase ASCII letters/digits, unique within this workspace. No claim of real global Azure DNS-name availability.              |
| `CreateBlobContainer`  | Existing own account; private only; name3–63 lowercase letters/digits/hyphen, alphanumeric ends, no adjacent hyphens; unique per account. Private is configuration, **not** implemented RBAC/Entra/Blob authentication.  |
| `CreateTextBlob`       | Existing own container; create-only unique case-sensitive ASCII name1–64 `[A-Za-z0-9._-]`; well-formed UTF-8 text, no NUL; text/plain. Original text, computed byteLength and SHA-256. React renders escaped plain text. |

Stable IDs come from one nextId counter per workspace, not names or timestamps. Parent type/membership, exact fields, namespace, revision and budgets are validated **before** allocating any resource. Groups/accounts/containers/blobs are limited to8/8/16/32 respectively, overall96 objects,120 UTF-16 units/480 bytes per text and8192 stored text bytes. The per-family caps currently make the overall ceiling conservative/redundant. These are local training limits from the [Stage0 design](STORAGE_VERTICAL_DESIGN.md), not Azure service quotas.

No overwrite, delete/cascade, upload, arbitrary metadata maps, snapshots, tiering, replication, SAS/keys, RBAC, real networking, runtime or price simulation. No new Web/VM implementation in v3; those remain in the explicitly linked existing v2 Portal. Review produces a labeled preview with no event/World change; Create returns the committed original receipt. Inspect and navigation never create data, receipts, XP or assessment results. Stored rate counters are request-admission metadata, not technical actions.

## Local setup and reproducible verification

Requires Node as pinned by the repository, Docker/local PostgreSQL17 and two **dedicated disposable** databases. Local verification used image `postgres:17-bookworm@sha256:665dc7b37ac52a17e298511414c21d23ffa4e6a6ef6225b3e5d59c7afb35e994` bound only to127.0.0.1:55460. Wait for `pg_isready` before setup. Generate random local admin/runtime passwords; never commit them. Put these implemented requirements in ignored `.env.local` (values below are placeholders):

```dotenv
LAB_ADMIN_DATABASE_URL=postgresql://postgres:ADMIN_PASSWORD@127.0.0.1:55460/azurelab_lab_dev
LAB_DATABASE_URL=postgresql://laboratory_v3_app:RUNTIME_PASSWORD@127.0.0.1:55460/azurelab_lab_dev
LAB_TEST_ADMIN_DATABASE_URL=postgresql://postgres:ADMIN_PASSWORD@127.0.0.1:55460/azurelab_lab_test_local
LAB_TEST_DATABASE_URL=postgresql://laboratory_v3_app:RUNTIME_PASSWORD@127.0.0.1:55460/azurelab_lab_test_local
LAB_ORIGIN=http://127.0.0.1:3000
```

Use URL-encoded passwords of at least16 characters. `npm ci`, `npm run lab:db:setup`, `npm run dev`. The explicit setup script accepts only loopback/dedicated names; it creates the owner/runtime roles and optional isolated test database, applies [001.sql](../database/laboratory-v3/001.sql), grants least privilege and seeds **no resources**. It refuses arbitrary remote provisioning. Runtime needs only LAB_DATABASE_URL/LAB_ORIGIN; admin/test URLs are never frontend variables or public runtime requirements.

`npx vitest run src/laboratory-v3.test.ts src/laboratory-v3.integration.test.ts src/laboratory-v3-preservation.test.ts` uses a real, separately named local test database. Missing configuration fails rather than silently skips. Integration tests exercise concurrent commits, immutable originals, rollback after actual INSERT/UPDATE, isolated cookies, Origin and corruption. They do not substitute a mock transaction. The HTTP and pg clients use the isolated test DB, never the development browser World. Browser tests use the actual Next server/development database and normal UI controls; response interception in two tests only releases genuine concurrent requests or drops a **real committed** response.

CI starts its own pinned disposable PostgreSQL service, explicitly initializes separate app/test databases, runs the unchanged full check and all382 previous browser executions plus7 new desktop and1 compact = **390 (353 desktop/37 compact)**. Original workers/retries/timeouts/skips and release wrapper are retained. Three pinned dependencies are added, every old lock entry retained. Five historical preservation readers delegate only six precisely bounded, independently checked dependency/CI/footer/locale deltas; every previous test body/assertion and old proof remains intact. See [preservation](reviews/evidence/pr60/preservation.json) and [its independent controls](../src/laboratory-v3-preservation.test.ts).

## Preview and delivery boundary

**No external database was provisioned, reused or configured.** Public persistent Storage Gate7 is **BLOCKED**, not passed by local tests, CI or Vercel Ready. Without the two runtime environment variables the separate entry renders an explicit unavailable state with a return to existing Portal/course; it does not fall back to localStorage or a shared fake World.

For an actual public preview the owner must approve/provide a **new isolated** PostgreSQL database, owner-controlled migration credentials/role setup and server-only runtime credentials. Apply the schema with its owner, grant the runtime role, use verified TLS (`sslmode=verify-full`, trusted CA) for non-loopback connections, configure the exact HTTPS preview origin and size the provider's connection budget for the per-process pool(max5). Never copy local/CI credentials. Separate preview/production scope and retention/backups must be reviewed. Admin URLs should be absent from runtime. Then anonymously verify root → visible v3 entry → normal RG/account/container/blob creation → metadata/original receipt → reload/Back/Forward/negative tests on the exact deployed SHA before claiming public Storage Gate7.

Future ordinary Portal integration can use an explicit workspace selector and server-evidence adapter with model/attempt/through references. Existing assessments must continue to select their original verified v1/v2 history until a separately authorized versioned adapter exists. Nothing here migrates learning data, unifies completion or repairs historical cutover.

## Sources and evidence boundaries

The five actually reviewed Microsoft sources from [Stage0](reviews/evidence/laboratory-stage0/sources.json) remain the limited authority for account/container/Blob names, scope, planes and create-only simplification. Their original review dates are retained. New actual server-reference captures/hashes are in [PR60 sources](reviews/evidence/pr60/sources.json): PostgreSQL17 transactions/row locks, node-postgres single-client transactions, OWASP session management and CSRF. HTML response hashes are explicitly distinguished from extracted plain-text review-note hashes; node-postgres/OWASP originals returned403 and their official maintainer repository sources were actually read instead. These are implementation references, not AZ-900 teaching or human security certification. No protected Portal screenshot/code or complete source pages are redistributed.

Actual local browser evidence: [1440×900](reviews/evidence/pr60/blob-1440-900.png), [1024×500](reviews/evidence/pr60/blob-1024-500.png). Verification results and separate final audit must distinguish local complete Storage functionality, authoritative CI/strict release and the still blocked public persistent Storage journey. No human learning/SME/security usability validation is claimed.
