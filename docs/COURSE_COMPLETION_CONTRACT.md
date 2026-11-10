# Course completion · proposed contract, not activated

PR61, 6 November 2026. **No whole-course completion policy, issuer or persistence is activated.** The green badge is a reusable display primitive, tested independently; the current production status projection cannot return `complete`. There is no new completion key, API, learner-store migration, scoring rule or assessment event.

## What is actually known today

`CourseStore` validates `azurelab.course.v1`, whose fields are schema, resume and the original Web-lab session. This records position/context, not completion. The course has17 module routes and57 authored AZ-900 objectives/126 facets. The authored matrix describes product coverage, not an individual learner's completed work. Root uses the existing validated CourseStore **read-only**: available course; ongoing when a valid saved position/lab exists; unknown when that record is conflicted/corrupt/unsupported/unsaved. Available does not assert that every other historical store is empty. Only `/learn` examines the complete original history to select authoritative Start/Continue and active-independent priority.

The existing records retain distinct instructional, guided, independent, first, assisted, retry, abandoned and technical evidence. There is no approved aggregate that establishes completion of every required part. Visiting all pages, a final resume URL, XP, one assessment, guided counts, a successful resource operation or a client `completed:true` flag cannot fill this gap. Root ignores alleged external completion records and URL flags. Its return type explicitly excludes `complete`.

## Proposed versioned boundary for future courses

Before enabling a badge, approve a separate **course-completion policy manifest**, not a new assessment rubric. Required identity:

| Field                   | Required meaning                                                                                                                                                                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Course ID               | One of AZ-900, AZ-104 or AZ-305; never an AZ-900 path or free Laboratory workspace.                                                                                                                                                      |
| Course content revision | Exact authored curriculum/content set; changes do not reinterpret older results.                                                                                                                                                         |
| Policy ID/version       | Explicitly approved finite policy, for example a future `az900-course-completion@1`. That example is currently **unapproved**.                                                                                                           |
| Required coverage       | Exact mandatory module/activity/item-family IDs, objective bindings and accepted original content/model/rubric versions. Optional work explicitly separated. No automatic semantic equivalence of old/new banks.                         |
| Evidence references     | Original store/session/item/family/attempt, immutable first/help/retry classification, relevant through-boundary, original technical attempt/receipt where actually required. References, not copied resource status or modified scores. |
| Evaluation              | Deterministic replay under that manifest, every required reference verified, explicit gaps/conflicts, and a result bound to the policy/content/evidence digest. A self-asserted `verified` boolean is insufficient.                      |
| Issuance/history        | Separate immutable in-app completion record with its evaluated references. Never edit old assessment/technical events or upgrade first submissions. No Microsoft credential, verified identity or certification claim.                   |

The issuer must reject unknown policies, unsupported versions, incomplete mappings, corrupt or missing evidence and failed durable writes. Opening a card or saved result never issues completion. Revalidation must use the original version and through-boundaries; later resource changes cannot become historical evidence. A later content release needs an explicit compatibility decision, not a silent upgrade or revocation of an old result.

## Concrete AZ-900 proposal for owner review

Use the existing recommended17-route sequence, with integrated supplements preserved:

| Route(s)                                          | Existing evidence that a future approved manifest would have to address                                                                                                                                              |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Computing                                         | Six consolidated foundational sessions, original v1/v2 history, integrated Serverless's separate record, actual Resource Bridge and Cloud Transfer. Optional older assessment links are not automatically mandatory. |
| Benefits                                          | Original teaching/causal models; preserved older assessment and versioned Benefits Assessment2.                                                                                                                      |
| Services                                          | Original service comparisons, practical missions and guided observations; older service assessments, current Assessment3, Portal-v1/archive and updated Portal Challenge2 remain separate banks.                     |
| Architecture                                      | Core A physical and Core B management each retain their own evidence/rubric.                                                                                                                                         |
| Compute                                           | Original declared models, actual VM dependency evidence, guided investigations and paired independent scenarios.                                                                                                     |
| Networking / Connectivity                         | Part A and B have separate model/guide/independent stores and actual technical references where required.                                                                                                            |
| Storage / Storage Resilience                      | Parts A/B preserve service-choice and resilience evidence separately from resource inventory.                                                                                                                        |
| Identity / Access Control                         | Parts A/B preserve identity and authorization evidence separately; no operating Entra/RBAC service is inferred.                                                                                                      |
| Cost / Governance / Management Tools / Monitoring | Four original module contracts, model contrasts, guides, paired decisions/reasons and actual supported evidence where used.                                                                                          |
| Security / Migration                              | Identity C and Storage C retain their original design/planning models and independent evidence.                                                                                                                      |

Recommended approval criteria, **not runtime scoring**:

1. Map every required taught facet to actual relevant instruction plus the original model/action/observation evidence appropriate to that facet. A visit alone is insufficient; no need to turn every explanatory paragraph into a forced click.
2. Require the selected existing guided investigations and practical work identified by the manifest, including their original cause/explanation and technical boundaries. Merely creating a VM or Storage account does not satisfy them. Free Laboratory work cannot count.
3. Require the selected independent application evidence under its original compatible decision/reason rules. Explicitly decide which banks/families are required and which are optional supplements. Do not silently demand both old and successor banks, all historical variants or a newly invented global score.
4. Decide how valid assisted retries contribute to **coursework completion**. A defensible proposal lets explicit successful retry/practice satisfy a coursework requirement while retaining the original wrong/assisted first result visibly. That must never become new unaided mastery evidence. Guided activity alone remains insufficient.
5. Verify all required records and no unresolved storage/recovery or incomplete required-attempt condition at issuance. Preserve first/help/retry/abandon and the historical version in Journal. A course badge does not establish exam readiness or measured learning effect.

The owner must approve the exact required IDs, historical-version equivalences and retry criterion before implementing the issuer. No arbitrary percentage/pass threshold is proposed here. Current data does not contain an approved module/whole-course receipt or a reliable complete-exposure map for every required instructional facet. Therefore PR61 awards **zero** whole-course completions, including to learners with extensive existing results.

AZ-104/AZ-305 need their own manifests and course-bound laboratory workspaces. They must not share completion, attempts or the free Laboratory's history. Their course content/workspaces are not implemented in PR61.

## What is implemented and tested

[Current projection](../src/features/landing/course-status.ts) and [display primitive](../src/features/landing/course-status-badge.tsx). Available/ongoing/unknown derive only from the existing validated position; complete is a prepared presentational variant, with green check **and text/accessible name** identifying in-app completion rather than Microsoft certification. It is exercised in unit rendering and a clearly labeled **test-only intercepted HTML fixture**, never a production route or invented positive course record. Unknown/corrupt/injected completion data cannot reach it through the actual root. Enabling it later requires the separately approved issuer above; no such contract is pretended to exist today.
