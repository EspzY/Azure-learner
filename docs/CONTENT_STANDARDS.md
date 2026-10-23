# Content authoring and acceptance contract

L1 / 1.0.0 / 2026-10-23. Applies to future conceptual and technical modules, including specialist tracks. [Content architecture](CONTENT_ARCHITECTURE.md) owns executable contracts; [coverage](CURRICULUM_COVERAGE.md) owns the audit. An NPC quest is a presentation, not a curriculum unit.

## Required manuscript before presentation code

Identify stable objectives, prerequisite understanding (including vocabulary), terminology, conceptual explanation, mechanism, relationships, Azure application, a reasoned worked example, misconceptions/counterexamples, accessible visual explanation, practical decisions, verification, changed transfer task, limitations and source IDs/review date. Explain unfamiliar words in place. Distinguish general cloud principles, Azure-specific facts and invented teaching assumptions. Write original Bokmål in `src/content/nb.ts`; never embed a remote lesson body or reproduce protected assessment questions.

Every objective must answer: what is taught, how the mechanism is made observable, what the learner does, what validates the response and what the evidence cannot establish. Dialogue needs natural concise beats; the total explanation must still be substantive. Essential mechanisms belong in the playable investigation, with a reusable structured journal for full explanations and revisits. External links verify/add depth; they cannot fill missing basic teaching.

## Separate acceptance dimensions

| Dimension               | Required evidence                                                                             | Insufficient substitute                    |
| ----------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Referenced              | Stable objective and authoritative source mapping                                             | Chapter title                              |
| Authored                | All manuscript layers and original explanations exist                                         | Source register or NPC definition          |
| Implemented             | Registered teaching and practice interaction works in spatial and semantic presentations      | Blueprint or renderer screenshot           |
| Assessed                | Authored rubric, changed task, immutable submitted answers and assistance history             | Visiting, reading or guessing until green  |
| Independent observation | First submitted changed-task criterion is correct without in-attempt aid; provenance retained | Corrected retry or guided completion       |
| Source reviewed         | URL, observed structure/version, review date and scope of factual cross-check                 | A working link alone                       |
| SME reviewed            | Named qualified reviewer, date, version, findings and disposition recorded                    | Author self-review or automated validation |
| Educationally validated | Appropriate learner study and transfer/retention observations                                 | Passing software tests                     |

No acceptance uses minimum word/slide/question counts. Review whether each objective can be explained and applied, including a counterexample. Local evidence is untrusted and scoped to a task; do not infer general competence, certification readiness or a mastery percentage. Feedback/hints/reference use during an assessment changes its classification; replay cannot erase the first attempt or produce unlimited rewards.

## Review workflow

1. Audit official objective/module/unit changes; pin a source snapshot date and map every objective separately.
2. Author manuscript and deterministic model assumptions before UI. Review the example arithmetic and boundary cases; document exclusions.
3. Bind reviewed content to bounded registered activities, never executable expressions/scripts in content. Validate references, prerequisites, complete sections and assessment implementations.
4. Run domain, persistence, content-integrity and browser gates; inspect actual readable desktop/mobile interactions. Report executed checks exactly.
5. Perform explicit author cross-check against sources. Keep human Azure-SME, accessibility and learner review outstanding until actually performed. A source-reviewed implementation candidate is not SME-approved production courseware.
6. Version material semantic changes, invalidate incompatible observations explicitly and retain old award ledgers. Commit manuscript, local content, tests and affected continuity docs together.

Future specialist units require the same layers with deeper configurations, diagnostic witnesses and architectural counterexamples. One F01 competency can contain several modules and many activities. Do not expand the catalogue to conceal an incomplete first module.
