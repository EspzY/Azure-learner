# AzureLab 3.1B.1

## Desktop learning refinement

The actual course now has one persistent Previous/Next bar, full-width responsibility comparison and an original relational public/private/hybrid diagram. The existing lab differentiates controls to operate from information to inspect. SavvyShark exposes objective, reason, action and expected result; only the hint is optional. Completed practice says **Gå tilbake til laboratoriet**, with **Fortsett undervisningen** as the course action. No simulator, evidence, XP or storage schema was changed. See the [refinement handoff](docs/FOUNDATIONS_31B_HANDOFF.md#31b1-implemented-refinement) and [verification](docs/PROJECT_STATUS.md).

## Current course integration

The ordinary course defaults to **Foundations v2**: open `/`, choose **Describe cloud computing**, and begin with a browser requesting a shop page. Server cutaway, finite-host VM budget, provisioning control/workload lanes and explained capacity prediction precede the retained responsibility/deployment/use-case/metering/pricing investigations. The same Portal lab starts from the practical bridge and returns to that unit. The temporary review promotion is removed; the noindex proof remains an archive.

Old `topic=capacity|responsibility|models|placement|metering|pricing|assessment|summary` links deliberately open labelled v1. Existing learners choose resume or separate v2; old evidence/XP does not migrate. New observations pin content/model/rubric2.0.0. Human beginner, Azure-SME and learning-effectiveness review remain outstanding. See [implemented handoff](docs/FOUNDATIONS_31B_HANDOFF.md), [coverage](docs/CURRICULUM_COVERAGE.md) and [actual verification](docs/PROJECT_STATUS.md). Historical3.1A statements below describe the prior delivery.

## Historical3.1A design candidate (superseded above)

At that phase the course remained unchanged. The [beginner audit](docs/BEGINNER_LEARNING_AUDIT.md), [pedagogy blueprint](docs/FOUNDATIONS_PEDAGOGY_BLUEPRINT.md), [visual system](docs/VISUAL_LEARNING_SYSTEM.md), [complete storyboard](docs/FOUNDATIONS_31A_STORYBOARD.md) and [3.1B handoff](docs/FOUNDATIONS_31B_HANDOFF.md) specify a prerequisite-first redesign for review. A review-only `/design/foundations-31a` proof, visibly linked near the top of the course landing, demonstrates server inspection and an explained capacity prediction; it writes no learning progress or XP. It is not a production-module upgrade. Desktop1920×1080/1440×900/1366×768 is now the permanent priority; existing smaller-screen access is preserved, dedicated mobile polish deferred. Human novice, Azure-SME and visual acceptance remain pending.

An independent **course-driven Azure learning environment** with an integrated **Azure Portal-inspired training simulator**. `/` opens `/learn`; `/portal` is the shared laboratory and free sandbox. SavvyShark guides real controls at authored practical steps and returns to the exact lesson. The [course experience](docs/COURSE_FIRST_PRODUCT_EXPERIENCE.md), [guide engine](docs/GUIDED_SANDBOX_ENGINE.md), [mascot integration](docs/SAVVYSHARK_INTEGRATION.md) and [session contract](docs/COURSE_LAB_ORCHESTRATION.md) describe the new orchestration. Official module order, all original theory, six computing investigations and separate independent evidence are preserved. Benefits remains planned. It runs entirely in your browser without Azure credentials or cloud costs. All operations are simulated; AzureLab is not affiliated with Microsoft.

## Playable scope

- Operational shell with local service/resource search, collapsible navigation, breadcrumbs, contextual commands, subscriptions, resource groups, All resources, App Services/plans, properties, notifications and actual operation history.
- Staged Basics / supported Tags explanation / Review + create. A shared deterministic engine validates scope, names, metadata/resource locations, Linux learning plan, app hosting and a custom Web-location denial. Rejected resources never appear as successful inventory.
- Complete original **Describe cloud service types** material, nine-layer responsibility comparison, three justified guided cases, source links and a changed independent build. The original six-unit **Describe cloud computing** module and its investigations/assessments remain available.
- Exact module/topic return, optional guided companion pane, contextual journal, live XYFlow architecture and equivalent semantic node/relationship inspection. XP, guided practice and first unaided task observations remain distinct.

This is a bounded supported subset, not Azure Portal parity: no sign-in, Azure connection, real SKUs/prices, tags persistence, runtime deployment, app health, networking or billing. The [reference checklist](docs/PORTAL_REFERENCE_FIDELITY.md) identifies matches, approximations and exclusions. Human Azure-professional, SME and learner review remain outstanding.

The RPG-first direction has been superseded. Its validated technical/content/state investment is preserved; the historical game is isolated at `/legacy/rpg`, the SVG comparison at `/legacy-expedition`. Neither appears in ordinary Portal navigation. Normal Portal use requires no WebGL and loads no game assets. The verified parent branch remains available for comparison; no production release or merge is performed.

Start with the [product strategy](docs/PORTAL_PRODUCT_STRATEGY.md), [learning manuscript/walkthrough](docs/PORTAL_LEARNING_EXPERIENCE.md), [shared state architecture](docs/PORTAL_SANDBOX_ARCHITECTURE.md), [interactive visualizations](docs/INTERACTIVE_VISUALIZATIONS.md) and [actual status/results](docs/PROJECT_STATUS.md). The 30-competency [professional journey](docs/LEARNING_JOURNEY.md) remains a roadmap, not a claim of implemented courses.

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

`check` runs route generation/type checking, ESLint, Prettier, documentation validation, asset integrity, unit tests and the production build. `npm run docs:check` verifies required Markdown, local links/images and heading targets without fetching external URLs; it is included in `check` and CI. Playwright starts its own production server on port 3000; stop any existing server first. Linux CI installs dependencies with `npx playwright install --with-deps chromium`. Raw reports/screenshots are ignored under `test-results/` and `playwright-report/`; reviewed evidence is kept in `docs/screenshots/`.

Unit tests cover unchanged domain rules, corruption recovery, XP deduplication, projection/relationship invariants and documentation failures. Chromium E2E covers the integrated mission, invalid/duplicate commands, visible creation, quiz retries, reload/replay, camera navigation, keyboard/dialog behavior, mobile, reduced motion, accessibility and external-request boundaries. See [project status](docs/PROJECT_STATUS.md) for actual results and screenshots. CI repeats checks on PRs; local passes do not imply remote passes.

## Structure

```text
src/app/                     App Router pages, layout and design tokens
src/components/              App shell, progression provider and shared visuals
src/content/nb.ts            Bokmål UI, original explanations and questions
src/domain/                  Pure simulation, assessment, progression + tests
src/domain/portal/           Portal projections, service content/evidence and replay adapter
src/features/portal/         Integrated Portal shell, learning, create/list/graph/reference views
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

No general distribution license has been selected; public visibility does not grant a general reuse license. Microsoft materials/trademarks and dependencies retain their respective terms. Our teaching copy and questions are original; external sources are referenced, not imported. The original ambient audio has a file-specific CC0 dedication, recorded alongside the existing licensed game assets in the [asset register](docs/ASSET_REGISTER.md); this does not license the application source.
