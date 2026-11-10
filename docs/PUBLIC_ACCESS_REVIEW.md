# Public AzureLab — scoped access review

Owner authorization29 October2026 requests anonymous access to the ordinary AzureLab site. This supersedes the earlier blanket no-protection-change instruction only within that explicit scope. Merge and production deployment still require separate approval.

## Confirmed state

- PR29 implementation is unchanged at `0d9b96ed73780ec881bf3dac20ccc71cba97a9cf`; its complete Quality CI is green.
- The actual [PR29 stable preview](https://azure-learner-git-codex-az900-networking-4d14de-espzys-projects.vercel.app/) returned HTTP302 to Vercel SSO with normal TLS validation. Vercel Ready is deployment status, not proof of anonymous access or displayed application SHA.
- A default-trust browser in the current managed environment also stopped at certificate-authority validation before the app. No browser journey/SHA is credited.
- Available GitHub tools can read commit/deployment status but cannot inspect or change Vercel project protection/domains. A Vercel integration was found but is not yet confirmed connected. No setting has been changed.

A bounded static inspection of the current repository source found no App Router request handlers, middleware/server actions, tracked environment files or matches for private-key/GitHub-token/AWS-access-ID patterns. The only `process.env` reader is the course layout, exposing validated commit/branch/preview metadata. This is a limited current-source observation, not a security guarantee or inspection of the actual production/older deployed versions.

## Required read-only inventory before a setting change

Identify the actual ordinary production/custom domain and deployment SHA; preview/branch/immutable aliases; project/team protection inheritance; authentication/password/domain-exception scope; and older deployments still reachable by alias. Do not guess the public domain from a project name. Record actual state without copying secrets or authentication cookies.

Inspect the target application for client-exposed credentials, server routes, environment-dependent services, write operations, telemetry and learner-data boundaries. Prior preservation evidence does not substitute for checking the actual target version. AzureLab's local simulated resources are not private Azure credentials or live deployments, but old previews still need their own exposure assessment.

## Change and verification boundary

- Prefer an ordinary-site/domain-specific public scope while keeping feature/older previews protected. Do not disable project/team protection broadly without an explicit reviewed exposure decision.
- If the provider only offers a setting that also exposes older previews, stop the dependent change and present exact domains/versions/risks and the smallest alternative. Do not infer authorization for all historical deployments.
- Retain no Azure secrets, paid resources, learner-data migration, merge or production deploy.
- After an authorized scoped change, use a new unauthenticated browser context without Vercel/session cookies. Open the normal root, verify full displayed SHA and a representative visible course/model/SavvyShark/independent/reload/Journal journey. Check protected previews still require access.
- Record anonymous HTTP status, actual browser result, deployed SHA, screenshots and remaining limitations separately from Ready/CI. Keep Gate7 BLOCKED until the app journey is actually verified.

**Current disposition: BLOCKED on confirmed Vercel settings access and actual domain/protection inventory.** The next action is secure Vercel connection; no credentials/tokens need to be pasted into chat. Course Hub design can be prepared independently, but public accessibility is not claimed complete.
