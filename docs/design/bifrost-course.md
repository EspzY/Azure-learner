# Bifrost course presentation

This track applies the supplied Bifrost reference to the existing AZ-900 Course Hub, course navigation, reading, native question controls, permitted feedback, Journal and existing SavvyShark panels. It stacks on the shared Bifrost foundation and landing. It adds no course, topic, assessment, guide, scenario, mission or learning authority.

The reference is the supplied `1-azurelab-bifrost-demo.html`, SHA256 `5d4b57efd595915c9295e2f6d159029bf79bb3a07737529236f5c757f268d7de`. Its purple header, pale selected navigation, separate question surface, modest card radii and status fade/contrast pairs inform the actual product. Its illustrative completed state and preselected correct answer are not copied into runtime learning state.

## Presentation and boundaries

`bifrost-course.css` scopes its rules to `.bifrost-learning.course-shell`. This distinction matters because the existing course also has the historical `.portal` class. The actual simulator Portal and free Laboratory do not receive this wrapper. Their Azure blue header, Segoe UI, native controls and light color scheme remain independent of the visual theme. `bifrost-guidance.css` targets only existing pedagogical briefing/milestone dialogs and the existing Knowledge Journal content.

The header reuses the shared exact brand mark and real, labelled native theme selector. Theme preferences use the foundation's separate visual preference key and default to the system preference. Course navigation, topic IDs, URLs, sequence, original readiness/resume projections, and all existing event handlers and authorization branches remain authoritative.

Question options remain native radio/checkbox controls with their original IDs, names, order, required rules and keyboard behavior. Selection is purple and does not claim correctness. The Foundations prerequisite check gets an icon and color only inside its already permitted original `last.kind === 'check'` result branch. Both still derive from the original submitted `last.answer` comparison. Selecting a different option retains the previous submitted feedback until the next original Submit action. Other feedback and partial/unknown histories retain their original criteria, text and display rules; no overall success or course completion is inferred.

The original SavvyShark PNG, dimensions, fallback behavior, authored teaching text, durable assistance boundary, independent-mode suppression and Start/Cancel semantics are retained. The panel uses spacing, typography and the shared theme. It never answers, submits, configures or awards on the learner's behalf. No SavvyShark is added to the free Laboratory.

The shared font policy is documented in [Bifrost provenance](bifrost-source-provenance.json). The Satoshi token uses an installed Satoshi face when available; the repository serves the approved local Open Sans fallback. Proprietary Satoshi binaries are not redistributed. The display hierarchy therefore uses the approved token and weights while retaining this explicit fidelity limitation.

## Author verification

The author uses a native production server on port 3005, a dedicated local PostgreSQL namespace, unchanged browser worker/retry/timeout settings, and an external temporary targeted test configuration. No test fixture injects a positive assessment, completion, guide or receipt state.

The first production browser pair found real contrast defects: the theme label on the purple header, inherited white activity disclosures in dark mode and old dark footer text. A subsequent diagnostic CSS-overlay scan over actual course routes exposed additional inherited small text, source summaries, guidance status and panel backgrounds. Those diagnostic frames are not final production evidence. The source fixes were rebuilt and the six production checks passed without an overlay or retries. Final polish then made the prerequisite Submit action primary, improved Journal reading width/close-icon contrast and removed unnecessary nested boxes inside SavvyShark.

The extended before-Submit checks initially exposed two harness mistakes: a noncanonical Compute query parameter and pointer-driven focus being treated as keyboard focus. They were corrected without a product change. A separate completed production probe then passed light mode and found a real dark-mode Start-dialog defect: the refined assessment title used `#f3f3f6` against the legacy white header, measuring 1.1:1. The [original defect frame](../screenshots/bifrost-course/before-dark-refined-start-dialog.png) is retained separately. The correction skins only dialogs identified by existing pedagogical brief content or the refined assessment parent; the ordinary native Portal dialog skin is excluded. Mission step-number text uses the shared theme contrast token.

The final scoped production batch is pending. Its eight cases cover:

- Both themes: the real Hub, original request action, selected-but-unsubmitted question, actual wrong and correct submissions, unchanged technical/XP bytes and Journal focus return.
- Both themes: all 17 existing module routes and the actual SavvyShark and model-limit warning panels.
- Both themes: original explicit Start actions for numeric, refined select and Compute two-field assessment forms at 1024×500, 1024×768 and 800×700, with no answers or submissions.
- Both themes: keyboard focus, Axe, reduced motion and reflow at 1440×900, 1024×768, 1024×500 and 800×700, plus the actual Portal/Laboratory theme boundary. The native Resource group Create blade and Review tab are inspected through the original controls and closed without Create; technical/XP bytes remain unchanged.

The only changed inherited browser expectation replaces the historical sidebar hover literal `rgb(41,73,94)` with a strict equality against the resolved shared `--bfc-neutral-fade` token. The foundation separately pins the exact supplied light/dark token values. The real hover interaction and all behavioral assertions remain. No existing case, assertion, worker, retry, timeout or skip is removed.

The inspected frames below come from the six completed production cases after the final product polish, without diagnostic styles. The correct/wrong frames use real original UI submissions and deliberately scroll the existing result into view.

| Actual surface                            | Light                                                                 | Dark                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Course Hub                                | [1440×900](../screenshots/bifrost-course/light-hub.png)               | [1440×900](../screenshots/bifrost-course/dark-hub.png)               |
| Teaching and original request observation | [Info](../screenshots/bifrost-course/light-teaching-info.png)         | [Info](../screenshots/bifrost-course/dark-teaching-info.png)         |
| Selected, before Submit                   | [Question](../screenshots/bifrost-course/light-question-selected.png) | [Question](../screenshots/bifrost-course/dark-question-selected.png) |
| Actual submitted wrong answer             | [Feedback](../screenshots/bifrost-course/light-question-wrong.png)    | [Feedback](../screenshots/bifrost-course/dark-question-wrong.png)    |
| Actual submitted correct answer           | [Feedback](../screenshots/bifrost-course/light-question-correct.png)  | [Feedback](../screenshots/bifrost-course/dark-question-correct.png)  |
| Existing Journal                          | [Journal](../screenshots/bifrost-course/light-journal.png)            | [Journal](../screenshots/bifrost-course/dark-journal.png)            |
| Existing SavvyShark panel                 | [Panel](../screenshots/bifrost-course/light-savvy.png)                | [Panel](../screenshots/bifrost-course/dark-savvy.png)                |
| Original model assumptions and limits     | [Warning](../screenshots/bifrost-course/light-warning.png)            | [Warning](../screenshots/bifrost-course/dark-warning.png)            |
| Short desktop                             | [1024×500](../screenshots/bifrost-course/light-hub-1024x500.png)      | [1024×500](../screenshots/bifrost-course/dark-hub-1024x500.png)      |
| Compact reflow                            | [800×700](../screenshots/bifrost-course/light-hub-800x700.png)        | [800×700](../screenshots/bifrost-course/dark-hub-800x700.png)        |

Final base-bound raw preservation, full check, independent post-stamp audit, exact-head complete CI/strict release and anonymous deployed-SHA verification remain separate delivery gates coordinated by the parent track. Human novice/IT learner, Azure SME, UX, screen-reader and measured learning-effect validation are unperformed.
