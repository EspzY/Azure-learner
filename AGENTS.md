# AzureLab engineering contract

Read README.md, docs/PROJECT_STATUS.md and relevant existing architecture, experience and learning documents before work. Preserve Git history and use a feature branch; never merge or deploy without explicit owner approval.

## Product boundaries

- Simulation first. Never create Azure resources or imply that local actions reach Azure.
- No cloud credentials, live authentication, databases, analytics, employer/customer data or live Microsoft Learn integration in Phase 0.
- The owner approved automatic feature-branch preview deployments through the existing Vercel integration. This does not authorize production deployments, merges or new infrastructure.
- No environment variables without an implemented requirement. Never commit secrets or local learner data.
- Bokmål is the initial locale. Keep service names in English. All learner-facing copy belongs in src/content/nb.ts; domain identifiers must be locale independent.
- XP measures participation. Mastery requires evidence; exam readiness requires broader independent evidence. No pass guarantees or repeat XP for non-repeatable work.

## Implementation

- Next.js App Router, strict TypeScript, Tailwind and semantic HTML. Small feature components, pure domain functions, explicit state boundaries.
- Model geography separately from management hierarchy. Entra tenant is an identity boundary; include Tenant root group and document simplifications.
- Validate persisted input and commands at runtime. Treat localStorage as untrusted, versioned and best-effort. Local scores are not authoritative.
- Prefer accessible HTML controls alongside graph interaction. Support keyboard, touch, narrow viewports and reduced motion. Deferred capabilities must have honest preview states.
- Avoid speculative frameworks, decorative 3D, network dependencies, remote fonts and excessive abstractions.
- The primary experience is a dimensional, scene-first learning environment. Preserve native controls, the XYFlow diagram and equivalent list navigation. Spatial height is schematic scope depth, never geography or a physical Azure deployment.

## Required verification

`npm run docs:check` is mandatory and included in `npm run check` and CI. Review desktop/mobile scene, selection and mission screenshots after interaction changes; inspect actual output instead of accepting tests alone.

For meaningful code changes run npm run typecheck, npm run lint, npm run format:check, npm test and npm run build. Run npm run test:e2e against the production build for interaction changes where supported. Domain tests must cover invalid input, deterministic outcomes, progression deduplication and persistence corruption. E2E tests must exercise the playable learning loop, reload, replay, mobile and keyboard access.

Inspect staged changes for secrets and unintended external requests. Record actual commands and results; never report an unexecuted test as passed. If blocked, document the exact limitation. Do not broaden tests after passing without a new concern.

## Continuity

Documentation maintenance is mandatory for every development phase, without a separate owner request:

1. Inspect relevant existing Markdown before implementation.
2. Update affected Markdown whenever code, architecture, UX or behavior changes.
3. Add a focused document when a genuinely new subsystem needs it; avoid duplicate descriptions.
4. Record meaningful architectural decisions, retaining the history of superseded decisions.
5. Update project status with completed behavior, actual tests, limitations and next steps.
6. Commit documentation with the related code. Keep local Markdown/image links valid.
7. Never report work as fully complete while required documentation updates are missing.

Update docs/PROJECT_STATUS.md after meaningful work: shipped behavior, validation, limitations and next step. Keep ARCHITECTURE.md and DECISIONS.md consistent with actual code. Record official source URLs, source versions, review dates and licensing boundaries for content changes. Write original explanations and assessments; never copy proprietary practice questions.

Future organizations need explicit membership, server authorization, data isolation, privacy controls and opt-in, fair leaderboards. Do not repurpose an Azure Entra tenant ID as the product organization ID.
