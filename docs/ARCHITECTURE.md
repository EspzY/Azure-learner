# Architecture

## Implemented

Next.js App Router serves the preserved routes `/`, `/explore`, `/missions`, `/progress`. The root layout supplies `ProgressProvider`, `ExpeditionProvider` and the shared dark shell. Root is the perspective journey; Explore loads the browser-interactive workbench through a small `next/dynamic` boundary. [JOURNEY_EXPERIENCE.md](JOURNEY_EXPERIENCE.md) owns the implemented route/content/challenge/world-transition contract. No route handlers, server actions, databases, credentials or adapters exist.

```mermaid
flowchart LR
  Pages[App Router] --> Shell[Shell + ProgressProvider]
  Pages --> Journey[Journey + route and detour definitions]
  Journey --> Shared[ExpeditionProvider + validated command replay]
  Shared --> Workbench
  Pages --> Workbench[Organization workbench]
  Workbench --> Scene[Projected SVG scene + HTML controls]
  Workbench --> Graph[XYFlow diagram + HTML list alternatives]
  Workbench --> Commands[Inspector / native modal commands]
  Workbench --> Rules[Pure simulation + assessment rules]
  Workbench --> Awards[Progression awards]
  Awards --> Storage[Validated localStorage / memory fallback]
  Copy[Bokmål content] --> Workbench
```

- `domain/simulation.ts`: immutable scope records, stable IDs, bounded commands, error codes and mission predicate. No clock, randomness or network effects.
- `domain/assessment.ts`: stable answer IDs and an all-three-correct rule.
- `domain/progression.ts`: allowed award IDs, fixed XP and versioned parsing. XP derives from unique IDs, never stored numeric input.
- `scene-layout.ts` owns schematic x/y/z coordinates, projection and related-branch selection. `spatial-scene.tsx` owns geometry/camera state. No WebGL, GPU dependency or frame loop. Layout never derives from region. Solid edges show containment; dashed tenant-root links show identity association. Neither shows traffic or physical Azure placement.
- `Workbench` composes scene, XYFlow/list alternatives, contextual inspector, mission HUD and brief/create/check/reset overlays. Only validated commands mutate the existing simulation. Native dialogs manage modal focus; successful creation focuses the new node. Assessment presents the original questions sequentially with unchanged scoring.
- `ProgressProvider`: hydrates after mount, gates awards until ready, catches storage errors, listens for storage events and re-reads before awarding. It is best-effort, not transactional multi-tab persistence.
- Accepted resources, mission activation, submitted guided answers, route position/visits and completion IDs survive reload/navigation. Camera frames, selection/current-attempt HUD and incomplete legacy check answers remain transient. Scenario reset clears current commands/steps and retains XP. Previous awards do not imply successful current attempts. Explicit data deletion clears both stores.
- `domain/expedition.ts` owns typed route edges, versioned detour contracts/evaluators and runtime snapshot parsing. `route-geometry.ts` owns perspective coordinates and interruptible curve/side-route camera interpolation. Commands replay through existing rules; arbitrary persisted scopes/XP are ignored. Storage is best-effort, not transactional multi-tab editing.

Rendering alternatives, motion and responsive composition are described once in [EXPERIENCE_DESIGN.md](EXPERIENCE_DESIGN.md). The original simulation/assessment/XP rules remain unchanged; Phase 1A.5 adds a separate validated expedition snapshot and command replay.

## Documentation gate

`scripts/docs-check.mjs` checks required documents and ordinary inline/reference repository-local links, images and Markdown heading targets. It ignores fenced code and external URLs, prohibits links escaping the checkout and makes no network requests. Three Node fixture tests verify valid links and failure cases. `npm run check` includes this gate, so existing CI runs it before production builds/browser tests. It validates structure/links, not factual accuracy or every Markdown extension; source review remains necessary.

## Localization

UI and learning copy live in `content/nb.ts`; `<html lang="nb">` identifies the locale. Domain/answer IDs are language neutral. A future English dictionary can share the Bokmål shape with locale selection at the routing boundary. No translation selector is advertised. Example names and service names remain technical identifiers.

## Phase 1A proposed evolution — not implemented

The [product blueprint](PRODUCT_BLUEPRINT.md) selects a competency journey, persistent reference world and isolated scenario workspaces. [SIMULATION_PLATFORM.md](SIMULATION_PLATFORM.md) is now the canonical proposed contract for domain models, scenario orchestration, content, rendering, assessment, progression and local-to-account migration. It supersedes the generic Phase 0 schema sketches previously here; Git history retains them. No engine, storage format or runtime behavior was changed in Phase 1A.

Phase 1B should prove only the [first chapter](CHAPTER_01_BLUEPRINT.md): typed plan/app resources, a filtered policy subset, responsibility decisions, causal receipts, independent transfer and explicit local checkpoint promotion. Preserve legacy creation/progression behavior through an adapter. Phase 1C extracts registries/authoring validation after a working chapter and a second authored case demonstrate the actual reuse. Avoid a speculative generic platform rewrite.

Competencies and evidence have stable IDs/revisions; credential mappings are a separate overlay in [LEARNING_JOURNEY.md](LEARNING_JOURNEY.md). A completed local task is not an authenticated credential, a trusted performance record or a readiness calculation. Future account/organization storage requires per-request membership authorization, isolation tests, export/deletion and transactional unique awards; an Entra tenant ID never grants product organization membership. No backend is introduced by this proposal.

## Integrations and deployment

[MICROSOFT_LEARN.md](MICROSOFT_LEARN.md) defines a disabled future metadata adapter and source model. Supabase is not connected. A pre-existing Vercel/GitHub integration publishes branch previews; the owner explicitly approved automatic previews during delivery. Local development is independent of that hosting and requires no credentials. Production deployment and merge are not authorized. Provider-free domain rules preserve portability; enterprise deployment requires a separate security design.
