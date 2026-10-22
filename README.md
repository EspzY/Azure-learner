# AzureLab

**Learn Azure by using it.** An independent, simulation-first learning workbench, initially in Norwegian Bokmål. AzureLab combines architecture exploration, practical assignments and original knowledge checks. It is not affiliated with or endorsed by Microsoft.

## Phase 0.5: enter the Azure Universe

- A dark control room launches a viewport-sized simulation, with a shared violet/magenta identity across all four routes.
- A projected 2.5D Azure Universe with elevated scope platforms, service volumes, camera focus/pan/zoom/orbit, branch highlighting and contextual desktop/mobile inspectors. Heights are schematic scope depth, not physical Azure geography.
- Distinct identity/containment links and a separate region comparison. XYFlow diagram and HTML list modes provide equivalent non-spatial selection, inspection and commands.
- Contextual explanations that separate identity, management scope and geography. The example App Service deliberately has a different region from its resource group's metadata.
- One integrated mission: brief → identify subscription → contextual command → visible new group/connection → three-step original knowledge check. Existing deterministic rules still award 80 + 40 XP once and allow three new groups.
- Versioned local progression with validated storage, repeat-safe awards, explicit deletion and an in-memory fallback when storage is unavailable.
- Honest previews for future content. Mastery and exam readiness remain **not assessed**.

Nothing connects to Azure, creates infrastructure, authenticates users or calls Microsoft Learn APIs. No cloud credentials or environment file is needed. Only completion IDs persist; the architecture resets on reload. This is an educational simplification, not an Azure emulator.

## Phase 1A: blueprint for review

The running app above is unchanged. The proposed product model combines a persistent reference world with isolated, versioned scenario workspaces and a competency graph that extends beyond Fundamentals. Start with the [product blueprint](docs/PRODUCT_BLUEPRINT.md), [learning journey](docs/LEARNING_JOURNEY.md), [interaction patterns](docs/EXPERIENCE_PATTERNS.md), [simulation contracts](docs/SIMULATION_PLATFORM.md) and [first chapter specification](docs/CHAPTER_01_BLUEPRINT.md). [Three experience blueprints](docs/EXPERIENCE_BLUEPRINTS.md) span foundations, engineering diagnosis and advanced design; the [source register](docs/SOURCE_REGISTER.md) records current technical/credential references.

These are implementation specifications with deterministic test vectors and proposed architecture, not shipped chapters or verified learning outcomes. Owner review must precede full Phase 1B implementation. No new frontend, service integration, account or infrastructure was added. See [project status](docs/PROJECT_STATUS.md) and the [staged roadmap](docs/ROADMAP.md) for actual verification and review gates.

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

`check` runs route generation/type checking, ESLint, Prettier, documentation validation, unit tests and the production build. `npm run docs:check` verifies required Markdown, local links/images and heading targets without fetching external URLs; it is included in `check` and CI. Playwright starts its own production server on port 3000; stop any existing server first. Linux CI installs dependencies with `npx playwright install --with-deps chromium`. Raw reports/screenshots are ignored under `test-results/` and `playwright-report/`; reviewed evidence is kept in `docs/screenshots/`.

Unit tests cover unchanged domain rules, corruption recovery, XP deduplication, projection/relationship invariants and documentation failures. Chromium E2E covers the integrated mission, invalid/duplicate commands, visible creation, quiz retries, reload/replay, camera navigation, keyboard/dialog behavior, mobile, reduced motion, accessibility and external-request boundaries. See [project status](docs/PROJECT_STATUS.md) for actual results and screenshots. CI repeats checks on PRs; local passes do not imply remote passes.

## Structure

```text
src/app/                     App Router pages, layout and design tokens
src/components/              App shell, progression provider and shared visuals
src/content/nb.ts            Bokmål UI, original explanations and questions
src/domain/                  Pure simulation, assessment, progression + tests
src/features/organization/   Projected scene/camera, XYFlow alternative, commands and assessment
scripts/docs-check.mjs       Required-document and local-link validation
tests/e2e/                   Desktop/mobile production browser tests
docs/                        Product, design, architecture, safety and continuity
```

Next.js App Router, strict TypeScript, Tailwind CSS 4, React, XYFlow, Lucide icons, Vitest, Playwright, ESLint and Prettier. Versions are pinned with a committed lockfile. No remote fonts, imagery, analytics or production SDKs.

## Direction and boundaries

XP records participation; independent performance and retention must support future mastery and certification readiness. No passing guarantees, copied practice assessments, employer data or internal integrations. Supabase is a future option. An existing Vercel integration provides owner-approved automatic branch previews; hosting is not required to run locally. Enterprise accounts must be separate from personal data. Microsoft Learn integration is disabled; only a future authenticated metadata adapter is designed.

Read [AGENTS.md](AGENTS.md), [experience design](docs/EXPERIENCE_DESIGN.md), [architecture](docs/ARCHITECTURE.md), [learning design](docs/LEARNING_DESIGN.md), [Learn API research](docs/MICROSOFT_LEARN.md), [security](docs/SECURITY.md), [decisions](docs/DECISIONS.md) and [roadmap](docs/ROADMAP.md). Documentation maintenance is mandatory for every phase and is committed with related code. Use feature branches and preserve history. No merging, production deployment or provisioning without explicit owner authorization.

## License

No distribution license has been selected; public visibility does not grant a general reuse license. Microsoft materials/trademarks and dependencies retain their respective terms. Our teaching copy and questions are original; external sources are referenced, not imported.
