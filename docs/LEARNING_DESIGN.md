# Learning design

This file describes the **implemented legacy organization activity**. Phase 1A.5 adds the [expedition teaching and two guided detours](JOURNEY_EXPERIENCE.md), using requirement selection and responsibility allocation rather than repeating the legacy three-question component. All three checks are guided, not independent assessment. Phase 1A's wider competency graph, evidence distinctions and source lifecycle are proposed in [LEARNING_JOURNEY.md](LEARNING_JOURNEY.md), reusable mechanics in [EXPERIENCE_PATTERNS.md](EXPERIENCE_PATTERNS.md), and the first complete chapter in [CHAPTER_01_BLUEPRINT.md](CHAPTER_01_BLUEPRINT.md). The complete chapters/platform and independent evidence designs have not been implemented or evaluated with learners. Keep this legacy activity's validated rules/results separate from the new specification.

## Guided technical extension — Phase 1B.1

The [implemented chapter subset](CHAPTER_01_GUIDED.md) bridges the journey's service choice into operational responsibility, lifecycle/scope choice, a recorded pre-result prediction, policy/dependency investigation, correction and causal explanation. A valid Shared Sandbox operation remains valid while failing the task requirement. The original prediction is retained even if wrong; a later guided explanation can demonstrate correction without rewriting that history. A learner choosing the permitted region immediately can inspect a real denied request on an isolated fork without damaging the main configuration.

Purpose, mechanism, Azure nuance/limits and official sources are available at the relevant inspector, location comparison and policy investigation. Hints, repeat explanations and model feedback are guided assistance. Six findings indicate the current configuration/observations fit this guided task; they are neither the complete five-criterion transfer rubric nor independent competence. No chapter XP/promotion occurs. Follow-up Phase 1B.2 must implement unfamiliar transfer, evidence classification and explicit checkpoint handoff before Chapter 01 can be called complete. Learner/SME effectiveness reviews remain pending.

## Resource organization v1

**Context:** a team needs an application resource group in a sandbox subscription. **Outcome:** explain identity, management containment and regional placement without conflating them.

1. Enter the scene and accept a short mission brief. Identify Learning Sandbox and discover creation in its contextual actions.
2. Explore actual parent/child relationships through focus and branch highlighting. Tenant-root remains a dashed identity association. Technical caveats are progressively disclosed in the inspector.
3. Compare `rg-webapp-dev` metadata in Norway East with App Service in West Europe using the region layer. Geometry does not move; location labels expose the separate dimension.
4. Create `rg-azurelab-dev` with metadata in Norway East through a scene command. Name, scope and region remain the same deterministic success conditions. The object and relationship appear visibly; wrong configurations do not award the mission.
5. Answer the original questions one at a time, review every selected answer's explanation, and reflect on why group/resource locations differ. Scoring and award IDs are unchanged.

The loop is discover → interact → observe → understand → apply → reflect. Explanations follow relevant actions. Hints still deliberately disclose this introductory solution. Invalid commands retain associated feedback; valid but wrong configurations remain visible with a correction/reset prompt. The sandbox supports three new groups; reset clears current-attempt steps and preserves historical awards. The original unit-tested domain implementation is retained.

## Accuracy and simplifications

Entra tenant is an identity boundary, distinct from Tenant root group. Each subscription trusts one tenant at a time; one tenant may support several subscriptions. A custom management group is optional; subscriptions can sit directly under the root. Entra roles differ from Azure RBAC. Tenant administration is not automatic resource access.

Groups cannot nest. Ordinary services are shown within groups; some Azure resource types exist at other scopes. Geography is a separate property, not a hierarchy level. No policies, moves, billing, availability, deployment validation or residency guarantees are modeled. Choosing a region is not a compliance assessment.

## Rewards and evidence

| Activity                  | XP      | Interpretation                 |
| ------------------------- | ------- | ------------------------------ |
| Exact mission conditions  | 80 once | Guided configuration completed |
| All three answers correct | 40 once | Immediate assisted check       |
| Replays                   | 0 extra | Practice encouraged            |
| Reading/selecting a node  | 0       | Interaction is not competence  |

Phase 0 collects no formal mastery evidence. Hints and immediate feedback limit the assessment. Future evidence needs unfamiliar scenarios, independent performance, delayed retrieval and broader coverage. Completion never automatically implies mastery or exam readiness. No streaks/rankings exist.

## Official competency references

Reviewed **2026-10-22**. These narrow mappings do not represent complete coverage. Summaries are original; official documents control scope.

| Exam   | Observed objectives effective from | Relationship                                         | Source                                                                                                    |
| ------ | ---------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| AZ-900 | 2026-07-20                         | Primary mapping: resource organization and hierarchy | [Study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900) |
| AZ-104 | 2026-04-17                         | Future identity/governance administration            | [Study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104) |
| AZ-305 | 2026-04-17                         | Future governance design decisions                   | [Study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-305) |

AZ-305 is part of the Azure Solutions Architect Expert credential; that exam alone is not the entire requirement. See [credential prerequisites](https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect). No credential or exam outcome is guaranteed.

Technical registry, reviewed **2026-10-22**, Microsoft documentation, reference-only use:

- [Management groups](https://learn.microsoft.com/en-us/azure/governance/management-groups/overview): parent/root relationships and directory association.
- [Resource Manager](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview): management scopes and grouping.
- [Resource groups](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal): metadata location.

All teaching text/questions are original. No practice assessment was copied, scraped or embedded. Future sources record attribution, licensing disposition, source version, review date and competency mapping. Re-review relevant sources when changing content and before certification-aligned releases; mark stale mappings until reconciled.

The [source register](SOURCE_REGISTER.md) rechecks these dates and adds current retired/new credentials, Applied Skills and specialist references for Phase 1A. Its versioned overlay policy supersedes using these three exam codes as the product's curriculum boundary. The existing immediate check remains assisted evidence only; no historical completion is upgraded into independent performance.
