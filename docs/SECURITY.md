# Security and privacy

## Current boundary

Local educational prototype: no backend, authentication, organization accounts, Azure SDK, API adapter or real infrastructure execution. Dev/start bind to `127.0.0.1`. Fonts/icons/assets are local; external links open only after selection. The Next command entry point disables framework telemetry in dev, type generation, build and start, without a required environment file.

Headers restrict connections/assets to same-origin, deny framing, disable device permissions and set referrer/content-type policies. Next hydration/XYFlow currently require inline scripts/styles; `unsafe-eval` is development-only. This baseline is not a production CSP. A nonce/hash policy and deployment-specific review are required before hosting.

## Input and persistence

Phase 0.5 changes presentation only: projected SVG geometry and native HTML controls introduce no WebGL, remote assets, integrations or executable learner markup. Native dialog layers use the same validated domain commands; scene coordinates/camera are not trusted persistence or evidence. Modal focus/Escape and non-spatial alternatives are checked in browser tests. The documentation gate reads repository files only and never fetches external links; links escaping the checkout are rejected.

Only versioned completion IDs persist under `azurelab.progress.v1` in localStorage. No personal details, answers, tokens or resource configurations are saved. Data deletion requires explicit confirmation. Blocked storage falls back to memory with a visible notice; reload/navigation may lose such progress.

The parser rejects malformed/unsupported data, filters unknown IDs and deduplicates awards. XP derives from code-owned values. Creation validates names, supported regions, parent type, subscription-local uniqueness and sandbox capacity. React escapes displayed text; no HTML injection API is used.

LocalStorage can be edited, evicted, cleared or raced across tabs. It is not a secure achievement ledger. Future backends must verify attempts and deduplicate transactionally, never trust uploaded XP.

## Dependencies and secrets

Pin versions, commit lockfile, use `npm ci`, audit runtime and developer dependencies. Do not force major-version downgrades without review. `.gitignore` excludes secrets/env files, build output and learner/test artifacts. Inspect staged content before pushing. Findings and disposition are recorded in PROJECT_STATUS.md. CI is read-only and has no deployment credentials.

## Future boundary

Before accounts: session security, CSRF controls, schemas/rate limits, independent organization IDs, per-request membership authorization and isolation tests. Define export/deletion, retention and administrator visibility. Rankings require opt-in, pseudonyms, comparable conditions and withdrawal. Personal data does not implicitly become employer data.

No production resource creation, production deployment, paid service provisioning or real authentication is authorized in Phase 0. The owner explicitly approved automatic branch previews through the repository's existing Vercel integration during delivery. Report issues privately to the repository owner; no dedicated security inbox/process exists yet.
