# AzureLab

**Learn Azure by using it.** An independent, simulation-first learning workbench, initially in Norwegian Bokmål. AzureLab combines architecture exploration, practical assignments and original knowledge checks. It is not affiliated with or endorsed by Microsoft.

## Phase 0: a playable foundation

- A responsive dashboard and navigation for Oversikt, Utforsk, Oppdrag and Fremgang.
- An interactive XYFlow architecture: Entra tenant → Tenant root group → management group → subscription → resource groups → resources. Keyboard-operable nodes and an equivalent list view.
- Contextual explanations that separate identity, management scope and geography. The example App Service deliberately has a different region from its resource group's metadata.
- A deterministic sandbox: create up to three resource groups; complete the specified assignment for 80 XP; answer three original questions correctly for 40 XP.
- Versioned local progression with validated storage, repeat-safe awards, explicit deletion and an in-memory fallback when storage is unavailable.
- Honest previews for future content. Mastery and exam readiness remain **not assessed**.

Nothing connects to Azure, creates infrastructure, authenticates users or calls Microsoft Learn APIs. No cloud credentials or environment file is needed. Only completion IDs persist; the architecture resets on reload. This is an educational simplification, not an Azure emulator.

## Run locally

Use Node.js **22.13 or newer** (Node 24 recommended) and npm:

```sh
npm ci
npm run dev
```

Open [AzureLab locally](http://127.0.0.1:3000). The server binds to loopback. For a production preview, stop the development server, run `npm run build`, then `npm run start`.

## Verify

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

`check` runs route generation/type checking, ESLint, Prettier, Vitest and the production build. Playwright starts its own production server on port 3000; stop any existing server first. Linux CI installs system dependencies with `npx playwright install --with-deps chromium`. Reports/screenshots are ignored under `test-results/` and `playwright-report/`.

Unit tests cover domain rules, corruption recovery and XP deduplication. Chromium E2E covers desktop/mobile, the learning loop, wrong answers, replay, persistence, keyboard operation, reduced motion, accessibility scans and absence of external browser requests. See [project status](docs/PROJECT_STATUS.md) for results actually executed. CI repeats checks on PRs; a local pass does not imply a remote CI pass.

## Structure

```text
src/app/                     App Router pages, layout and design tokens
src/components/              App shell, progression provider and shared visuals
src/content/nb.ts            Bokmål UI, original explanations and questions
src/domain/                  Pure simulation, assessment, progression + tests
src/features/organization/   Architecture graph, inspector, task and knowledge check
tests/e2e/                   Desktop/mobile production browser tests
docs/                        Product, design, architecture, safety and continuity
```

Next.js App Router, strict TypeScript, Tailwind CSS 4, React, XYFlow, Lucide icons, Vitest, Playwright, ESLint and Prettier. Versions are pinned with a committed lockfile. No remote fonts, imagery, analytics or production SDKs.

## Direction and boundaries

XP records participation; independent performance and retention must support future mastery and certification readiness. No passing guarantees, copied practice assessments, employer data or internal integrations. Supabase and Vercel are future options, not dependencies. Enterprise accounts must be separate from personal data. Microsoft Learn integration is disabled; only a future authenticated metadata adapter is designed.

Read [AGENTS.md](AGENTS.md), [architecture](docs/ARCHITECTURE.md), [learning design](docs/LEARNING_DESIGN.md), [Learn API research](docs/MICROSOFT_LEARN.md), [security](docs/SECURITY.md), [decisions](docs/DECISIONS.md) and [roadmap](docs/ROADMAP.md). Use feature branches, preserve history and update project status. No merging, deployment or provisioning without explicit owner authorization.

## License

No distribution license has been selected; public visibility does not grant a general reuse license. Microsoft materials/trademarks and dependencies retain their respective terms. Our teaching copy and questions are original; external sources are referenced, not imported.
