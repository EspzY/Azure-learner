# Learning design

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
