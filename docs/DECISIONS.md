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

## Dependency compatibility refinement

The initial Next ESLint preset introduced an unpatched development-only braces advisory and peer constraints that excluded ESLint 10. Replaced it with current ESLint core, TypeScript ESLint and React Hooks recommended rules, with Prettier handling formatting and axe covering browser accessibility checks. This removed that chain without a forced Next downgrade. Framework-specific lint rules are not enabled; production builds and browser tests cover the implemented Next integration. The small `scripts/next.mjs` entry point disables framework telemetry for all package commands without requiring user environment configuration.

Revisit with learner evidence or concrete constraints. Security boundary/scope changes need updated decisions and appropriate owner authorization.
