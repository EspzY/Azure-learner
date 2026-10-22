# Decisions

Initial decisions dated **2026-10-22**.

| ID  | Decision                                  | Rationale/consequence                                                                               |
| --- | ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 001 | Next App Router + strict TypeScript       | Clear routing and future server boundary, no premature backend. Separate lint/type/build gates.     |
| 002 | Pure domain rules                         | Stable commands and outcomes without randomness, clocks or SDK effects.                             |
| 003 | XYFlow + native node buttons + HTML list  | Accessible graph interaction without building a graph engine. Retain attribution.                   |
| 004 | 2D only                                   | Layers and connections explain current concepts; no learning case for WebGL.                        |
| 005 | Tailwind 4 + semantic CSS tokens          | Consistent visual language without a large UI framework; system fonts avoid downloads.              |
| 006 | Bokmål dictionary                         | Technical IDs remain stable across future translations.                                             |
| 007 | Persist completion IDs, derive XP         | Duplicate-safe participation rewards; no claim of authoritative competence.                         |
| 008 | 80 mission XP + 40 check XP               | Simple deterministic rules, free retries; mastery/readiness unassessed.                             |
| 009 | Separate scenario reset and data deletion | Practice preserves awards; explicit deletion clears them.                                           |
| 010 | Include root management group             | Tenant identity differs from management scope; dashed identity link avoids conflation.              |
| 011 | Learn integration disabled                | Authenticated metadata API with unvalidated terms/auth prerequisites; document future adapter only. |
| 012 | No Supabase/Vercel setup                  | Unnecessary for learning proof; provider-free logic preserves portability.                          |
| 013 | Vitest + production Playwright            | Domain invariants plus real desktop/mobile behavior, accessibility and external-request boundary.   |
| 014 | Read-only CI, pinned versions             | Repeatable review without deployment credentials; track dev/runtime advisories separately.          |

## Phase 0.5 — immersive experience reset

These decisions supersede the presentation choices in 003/004 while retaining their history and the tested domain rules.

| ID  | Decision                                           | Rationale/consequence                                                                                                                                               |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 015 | Orthographic 2.5D SVG from explicit x/y/z geometry | Real model volume, height, yaw and depth ordering without a GPU dependency or render loop. CSS 3D and R3F tradeoffs are recorded in EXPERIENCE_DESIGN.md.           |
| 016 | Semantic label buttons; XYFlow/list alternatives   | Selection, parent/child navigation and creation remain available without spatial gestures. Upright labels remain readable.                                          |
| 017 | Scene HUD + native modal commands                  | Mission flow stays inside the world; focus trap/Escape and restored node focus remain native. Short explanations expand on demand.                                  |
| 018 | Preserve all pure domain/progression rules         | No aesthetic rewrite of validated state, scoring, storage or reward IDs. Current-attempt steps remain separate from saved milestones.                               |
| 019 | Midnight/violet/magenta identity                   | Complete design-system reset; cyan communicates technical relationships, not decorative glow everywhere.                                                            |
| 020 | Mandatory docs gate and documentation continuity   | Required files and local links checked in CI; tests prove failures are detected. Source accuracy still needs review. Docs commit with their related implementation. |

## Phase 1A — product and learning architecture (proposed)

These are recommendations for owner review, not implemented platform capabilities. Full Phase 1B implementation is gated on that review. They extend 015–020 without changing the running Phase 0.5 renderer/domain rules.

| ID  | Proposed decision                                                                  | Reason / consequence                                                                                                                                                        |
| --- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 021 | Competency journey + persistent reference world + isolated scenario forks          | Combines continuity with specialization, safe repetition and comparable transfer; alternatives/risk are evaluated in PRODUCT_BLUEPRINT.md.                                  |
| 022 | Stable competency IDs; versioned credential overlay                                | Exam retirements/replacements do not restructure the curriculum. Current official status/dates and licensing boundaries live in SOURCE_REGISTER.md.                         |
| 023 | Six system boundaries and typed relation meanings                                  | Separate domain, scenarios, content, rendering, assessment and progression; identity/containment/dependency/traffic cannot share one inferred edge meaning.                 |
| 024 | Small authored data contracts before a general platform                            | Phase 1B proves Chapter 01; Phase 1C extracts reuse using real authoring evidence. No expression interpreter, remote plugins or arbitrary code execution.                   |
| 025 | Predictions, causal witnesses and unfamiliar transfer                              | Guided task success and immediate recognition cannot establish independent or retained understanding. No fabricated mastery/readiness percentage.                           |
| 026 | Explicit checkpoint promotion and provenance                                       | Practice/transfer cannot silently corrupt the journey. Reference fixtures do not become learner-created history. Local evidence remains untrusted.                          |
| 027 | Task-specific lenses retain a coherent dark environment                            | Spatial organization, responsibility matrix, flow/access traces, timelines and comparisons serve different learning problems. Renderer complexity is not educational depth. |
| 028 | First chapter connects service responsibility, scope, location, policy and hosting | A bounded PaaS vertical slice with two transfer variants and explicit test vectors; later network/advanced examples remain design-only.                                     |
| 029 | Professional demonstration rubric and human gates                                  | Tests establish defined behavior, not learning effectiveness or full Azure fidelity. Technical, learner and assistive-technology reviews must be recorded separately.       |

## Dependency compatibility refinement (Phase 0)

The initial Next ESLint preset introduced an unpatched development-only braces advisory and peer constraints that excluded ESLint 10. Replaced it with current ESLint core, TypeScript ESLint and React Hooks recommended rules, with Prettier handling formatting and axe covering browser accessibility checks. This removed that chain without a forced Next downgrade. Framework-specific lint rules are not enabled; production builds and browser tests cover the implemented Next integration. The small `scripts/next.mjs` entry point disables framework telemetry for all package commands without requiring user environment configuration.

## Delivery clarifications

The first branch push exposed an existing Vercel auto-preview integration. The owner explicitly approved automatic preview deployments after being informed. This does not authorize production deployment, merge or new infrastructure. No new Vercel account/project/configuration was created. A local dev check exposed Next's instruction-file injection; `agentRules: false` keeps AGENTS.md owned by this project, while generated next-env.d.ts is ignored to avoid environment-dependent Git changes.

Revisit with learner evidence or concrete constraints. Security boundary/scope changes need updated decisions and appropriate owner authorization.

## Phase 1A.5 decisions — 2026-10-23

| ID  | Decision                                                               | Reason and boundary                                                                                                                                                                                               |
| --- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 030 | Cinematic expedition over constellation/layered descent                | Continuous orientation, side detours and stable world return; alternatives/tradeoffs in JOURNEY_EXPERIENCE.md. Overview remains an accessible/direct-entry alternative.                                           |
| 031 | Perspective SVG for journey; orthographic SVG/XYFlow/list inside world | Meaningful travel and task-specific technical inspection without WebGL/dependencies. No idle frame loop; rendering cannot decide technical outcomes.                                                              |
| 032 | Typed route graph and versioned allowlisted detour evaluators          | Two different mechanisms with authored trigger/return, original localized content, assistance/retry policy and exact fixtures. No remote expressions or universal engine.                                         |
| 033 | Separate expedition snapshot with accepted-command replay              | Preserve valid unfinished world work and URL/history position. Cap/validate input; keep legacy award ledger and explicit reset versus deletion. Local data remains untrusted; concurrent tabs can overwrite work. |
| 034 | Guided detours earn zero XP and no independent competence              | Corrective feedback supplies assistance. Existing 80/40 awards stay repeat-safe; visits, animations and model switching earn nothing.                                                                             |
| 035 | Client-load the measured interactive workbench                         | Dynamic loading avoids competing inert streamed SVG/control copies during hydration, with an honest accessible loading state. Retain /explore and browser navigation.                                             |

Decision 030 supersedes the Phase 0.5 control-room entry. Decisions about the resource world's projection, deterministic rules and accessible alternatives remain valid. This owner-authorized slice does not implement the complete Chapter 01 or its independent transfer/promotion contracts.
