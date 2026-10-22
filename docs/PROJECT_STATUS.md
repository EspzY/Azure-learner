# Project status

Updated **2026-10-22**. Phase 0 is implemented and locally verified on `feat/phase-0-foundation`, based on `main` at `d87fa85`. Delivery is draft PR #1; main remains unmerged. The original Git history is retained.

## Implemented

- Next.js App Router, strict TypeScript, Tailwind, shared shell and four Bokmål routes.
- Interactive XYFlow hierarchy, root-group/tenant distinction, inspector and keyboard/list alternative.
- Deterministic resource group creation with validation, replay and geography explanations.
- One guided mission, three original questions, answer feedback, reflection and 120 maximum local XP.
- Versioned local persistence, corruption recovery, storage denial notice and explicit deletion.
- Unit/E2E suites, CI definition and product/architecture/design/security documents.
- Official Learn API research and proposed adapter/domain contracts; integration remains disabled.

## Verification

Executed on Windows with Node **24.18.0** and npm **11.16.0**:

| Check                                 | Actual result                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `npm ci`                              | Clean install from lockfile passed                                                               |
| `npm run typecheck`                   | Passed, strict TypeScript and generated route types                                              |
| `npm run lint`                        | Passed, zero warnings                                                                            |
| `npm run format:check`                | Passed                                                                                           |
| `npm test`                            | 26 tests passed in two files                                                                     |
| `npm run build`                       | Passed; all four product routes prerendered                                                      |
| `npm run test:e2e`                    | 6 tests passed: 3 scenarios × desktop/mobile Chromium                                            |
| axe scans                             | No violations in tested graph/list, dashboard, mission, progress and completed assessment states |
| `npm audit --json`                    | Zero known vulnerabilities, including developer dependencies                                     |
| `npm audit --omit=dev --json`         | Zero known runtime vulnerabilities                                                               |
| Secret-pattern scan and source review | No findings; no credentials/env files introduced                                                 |
| External browser request assertions   | Zero unintended requests during the learning loop                                                |
| `git diff --check`                    | Passed                                                                                           |

The learning-loop tests cover node selection, geography, valid/duplicate creation, wrong-answer explanations, retry, reload, scenario reset and repeated completion without extra XP. Other scenarios cover keyboard activation, reduced motion, narrow viewport overflow, corrupted/denied storage and confirmed deletion. Dashboard, architecture map, mission and progress screenshots were visually inspected; captures/reports are ignored local outputs.

An initial development-only braces advisory chain was eliminated by replacing the incompatible Next ESLint preset with current core, TypeScript and React Hooks recommended rules. No forced Next downgrade or suppressed audit finding was used. See DECISIONS.md. Framework telemetry is disabled in the package command entry point.

CI repeats the quality gate and browser suite on Linux/Node 24 using pinned official Actions commits and read-only repository permissions. The first remote run for `ce70e73` passed. The latest run is visible on the PR. Human screen-reader testing, other browser engines and a complete WCAG audit were not executed.

## Automatic preview deployment clarification

After the first feature-branch push, GitHub revealed a pre-existing Vercel integration that automatically published a preview. No integration or Vercel project was created by this task. The owner subsequently explicitly approved automatic preview deployments. They are now allowed; production deployment and merging remain unauthorized. No deployment block or new cloud configuration is included. The app still requires no hosting account or credentials for local use.

A local development smoke run also revealed Next's automatic AGENTS.md injection and environment-specific next-env.d.ts updates. `agentRules: false` preserves the project-owned instructions, and the regenerated type file is ignored. Route generation recreates it on a fresh checkout.

## Limitations

No production deployment, merge, live authentication, provisioning, Learn API calls or account infrastructure. Approved automatic previews use the repository's pre-existing host integration. The simulator supports one subscription, three additional groups and three regions; no service deployment or policy engine. Architecture/answers reset on reload; completion IDs persist only in this browser. Local progress is editable and best-effort across tabs; no server integrity or multi-device sync. Mastery/readiness remain unassessed.

Automated Chromium testing is not a human accessibility audit or complete browser matrix. English, other modules, retention tests, achievements and rankings are deferred. Source objectives are reviewed snapshots. No distribution license has been chosen.

## Next

Phase 1: learner review plus one deterministic allowed-location troubleshooting scenario, independent assessment and content versioning. Cloud services/deployment remain outside scope until authorized. See ROADMAP.md.

## File inventory

Modified: `README.md`. Added:

```text
AGENTS.md
.gitattributes
.gitignore
.prettierignore
.prettierrc.json
.github/workflows/ci.yml
package.json
package-lock.json
tsconfig.json
next.config.ts
postcss.config.mjs
eslint.config.mjs
vitest.config.ts
playwright.config.ts
scripts/next.mjs
docs/PROJECT_STATUS.md
docs/PRODUCT_VISION.md
docs/ARCHITECTURE.md
docs/LEARNING_DESIGN.md
docs/DESIGN_SYSTEM.md
docs/SECURITY.md
docs/ROADMAP.md
docs/DECISIONS.md
docs/MICROSOFT_LEARN.md
src/app/layout.tsx
src/app/globals.css
src/app/page.tsx
src/app/explore/page.tsx
src/app/missions/page.tsx
src/app/progress/page.tsx
src/app/not-found.tsx
src/app/icon.svg
src/components/app-shell.tsx
src/components/architecture-art.tsx
src/components/icons.tsx
src/components/progress-provider.tsx
src/content/nb.ts
src/domain/simulation.ts
src/domain/simulation.test.ts
src/domain/assessment.ts
src/domain/progression.ts
src/domain/progression.test.ts
src/features/organization/scope-graph.tsx
src/features/organization/workbench.tsx
src/features/organization/assessment.tsx
tests/e2e/learning.spec.ts
```

`next-env.d.ts` is generated by Next and intentionally ignored.
