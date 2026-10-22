# AzureLab

**AzureLab** (working title) is an interactive, simulation-first Microsoft Azure learning platform.

## Vision

Learn Azure by exploring, building, troubleshooting and explaining cloud architectures—not by clicking through passive slide decks. The experience should combine a professional visual cloud workbench, guided missions, evidence-based knowledge checks and practical progression from fundamentals to technical operations and architecture decisions.

## Current state

Repository initialized. **No application has been implemented yet.** The first Codex task is to establish the project architecture, development toolchain, documentation and a small verified vertical slice. See the bootstrap prompt supplied separately.

## Product principles

- **Learn by doing:** hands-on interactions before lengthy theory.
- **Technical correctness:** deterministic, testable simulation rules and clearly labeled simplifications.
- **Visual depth with purpose:** interactive architecture maps and subtle spatial layers, with accessible 2D fallbacks.
- **Trustworthy progress:** XP, mastery and certification-readiness are distinct measurements; no pay-to-progress or misleading guarantees.
- **Portable by design:** personal development remains separate from any potential employer deployment; no customer data or internal company materials.
- **Safe by default:** no hardcoded credentials, secrets, real Azure resources or paid services in the initial prototype.

## Intended initial stack

Next.js, TypeScript, Tailwind CSS, Vitest and Playwright, subject to verification and architectural evaluation by Codex. Supabase and Vercel are **future options**, not prerequisites for starting local development.

## Repository workflow

Use small reviewable changes, maintain `AGENTS.md` and `docs/`, and do not deploy, connect real Azure tenants, provision paid services, or merge changes without explicit owner approval.

This is an independent educational project and is not affiliated with or endorsed by Microsoft.
