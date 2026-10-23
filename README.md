# AzureLab

**Learn Azure by using it.** An independent, simulation-first learning workbench, initially in Norwegian Bokmål. AzureLab combines architecture exploration, practical assignments and original knowledge checks. It is not affiliated with or endorsed by Microsoft.

## Phase 1B.1: build, predict and recover

The expedition's Infrastructure gateway now offers **Bygg applikasjonsplattformen**, a playable guided technical world. Choose operational responsibility, organize an application group, record a location prediction, investigate a real modeled policy denial, correct a Linux learning App Service plan and create a webapp linked to it. Resource membership, hosting dependency, group metadata and resource location remain distinct. The scene, diagram, list and receipts project actual immutable state; nothing is deployed to Azure.

Open `/explore?chapter=01` directly, or enter through the journey. Work resumes from a versioned, validated command/learning-event log; restarting replaces only this guided attempt. The legacy introduction and 80/40 XP remain available and unchanged. Guided configuration does **not** complete Chapter 01, award chapter XP, establish independent proficiency or promote a journey checkpoint. Those are Phase 1B.2 requirements. [Implementation, walkthrough and screenshots](docs/CHAPTER_01_GUIDED.md) define the exact supported subset and limits.

## Preserved Azure Expedition

Root now opens a continuous perspective journey: travel a curved route, change responsibilities in an eight-layer teaching structure, take two different guided detours and enter the actual infrastructure workbench through its gateway. Return, resume resources and revisit without duplicate rewards. Future landmarks are explicitly unavailable. [Journey experience](docs/JOURNEY_EXPERIENCE.md) documents alternatives, architecture, a walkthrough and reviewed desktop/mobile screenshots. This is a bounded journey proof, not the complete Chapter 01 or evidence of independent mastery. The preserved technical world includes:

- A viewport-sized workbench shares the expedition's identity, local world state and progress providers.
- A projected 2.5D Azure Universe with elevated scope platforms, service volumes, camera focus/pan/zoom/orbit, branch highlighting and contextual desktop/mobile inspectors. Heights are schematic scope depth, not physical Azure geography.
- Distinct identity/containment links and a separate region comparison. XYFlow diagram and HTML list modes provide equivalent non-spatial selection, inspection and commands.
- Contextual explanations that separate identity, management scope and geography. The example App Service deliberately has a different region from its resource group's metadata.
- One integrated mission: brief → identify subscription → contextual command → visible new group/connection → three-step original knowledge check. Existing deterministic rules still award 80 + 40 XP once and allow three new groups.
- Versioned local progression with validated storage, repeat-safe awards, explicit deletion and an in-memory fallback when storage is unavailable.
- Honest previews for future content. Mastery and exam readiness remain **not assessed**.

Nothing connects to Azure, creates infrastructure, authenticates users or calls Microsoft Learn APIs. No cloud credentials or environment file is needed. Position, submitted guided answers and accepted resource commands persist separately from completion IDs; replay revalidates commands on reload. Unsubmitted/partial legacy quiz answers remain transient. This is an educational simplification, not an Azure emulator.

## Phase 1A: blueprint for review

The broader proposed product model combines a persistent reference world with isolated scenario workspaces and a competency graph beyond Fundamentals. Phase 1A.5 implements a narrow journey/return foundation; full workspaces and independent transfer remain proposed. Start with the [product blueprint](docs/PRODUCT_BLUEPRINT.md), [learning journey](docs/LEARNING_JOURNEY.md), [interaction patterns](docs/EXPERIENCE_PATTERNS.md), [simulation contracts](docs/SIMULATION_PLATFORM.md) and [first chapter specification](docs/CHAPTER_01_BLUEPRINT.md). [Three experience blueprints](docs/EXPERIENCE_BLUEPRINTS.md) span foundations, engineering diagnosis and advanced design; the [source register](docs/SOURCE_REGISTER.md) records current references.

These remain specifications for complete chapters, not verified learning outcomes. The owner authorized the Phase 1A.5 expedition and Phase 1B.1 guided technical subset; Phase 1B.2 completes the remaining transfer/assessment/promotion scope. No service integration, account or infrastructure was added. See [project status](docs/PROJECT_STATUS.md) and the [staged roadmap](docs/ROADMAP.md) for actual verification and review gates.

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
src/domain/chapter01/        Bounded Web model, guided definition, receipts and replay
src/features/organization/   Projected scene/camera, XYFlow alternative, commands and assessment
src/features/journey/        Perspective route/camera, teaching, detours and shared local world state
src/features/chapter01/      Operational scene adapter, contextual controls and guided local store
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
