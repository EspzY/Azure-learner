# PR50 — visual direction and implementation contract

Design phase, 2 November 2026. Base `4934408075fccdab944e629a108a0f23424ee3f8`. This is an interactive, preview-only candidate, not a replacement for the current course. No new learning, technical command, result or curriculum order is introduced. Human novice, Azure-SME, assistive-technology and measured learning validation remain unperformed.

## Two concrete candidates

Open **Designlab · to visuelle kandidater** below the ordinary Course Hub on this branch. `/learn/design-review` is enabled only by trusted existing branch/preview metadata; production and other branches cannot enable it through query parameters. The top switch retains the selected surface and actual Portal location.

| Direction       | Composition and identity                                                                                | Benefit                                                                                                    | Cost / risk                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| A — Kontinuitet | Light navigation rail, Manrope UI/display, three familiar catalog cards, cool reading surfaces          | Smallest visual departure; strong continuity with current AzureLab and Portal                              | The card catalog still has uneven density; less distinctive than B                                   |
| B — Feltbok     | Warm paper, navy rail, Source Serif 4 display type and Manrope UI, horizontal numbered subject chapters | More distinctive hierarchy, calmer long reading, clearly separates learning from the operational workspace | Larger headings cost initial viewport space; unfamiliar serif identity needs owner/novice validation |

**Recommended candidate: B, subject to owner review and the independent visual findings.** Carry over A's restrained control vocabulary. The recommendation is design judgment, not proof of learning improvement, commercial quality or award readiness. No random gradients, animated background, WebGL, new motion dependency or new application state engine is needed.

Both candidates implement Hub, module introduction, an actual VM manuscript, a bounded Container Studio, the original VM guide, a Course-to-Portal handoff, actual Portal resource inspection, and an honest Journal history selection. Nine links in the prototype sidebar are review views, **not** a new learning sequence. The catalog still reads the original three paths and seventeen canonical module labels. Only the Compute entry enters the prototype; all other modules open their current routes.

## Consistent quality comparison

These are reasoned candidate judgments against the same criteria, not measured learning or award scores. The independent reports retain critical findings and affected retests.

| Criterion          | A — Kontinuitet                                                               | B — Feltbok                                                                                  | Evidence / remaining condition                                                                                           |
| ------------------ | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Visual composition | Familiar light rail and compact three-card overview; less individual identity | Distinct paper/navy/serif hierarchy and horizontal catalog chapters; longer vertical catalog | Actual screenshots at1920/1440/1366/1024 and short height; owner must judge the density/type tradeoff                    |
| Interaction        | Shared explicit model run, native briefing, real Portal and reversible guide  | Same mechanisms; coherent difference between reading and operational workspace               | Actual local VM commands/receipt/return and keyboard/Back/reload; no artificial loading delay                            |
| Learning clarity   | Same original content and visible model boundaries                            | Same content with clearer display/body separation; no demonstrated comprehension advantage   | Guided observations/causal explanation and independent protection preserved; human novice testing absent                 |
| Technical quality  | Shared semantic controls, local fonts and scoped CSS                          | Same technical implementation; one extra local display font                                  | Axe, reduced-motion, short-window/125% CSS zoom, negative durable-aid and old-byte checks; real screen-reader/RUM absent |

## Composition and tokens

Scoped in `src/features/design-review/visual-review.css`. No broad production component rollout.

| System         | Contract                                                                                                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Color          | Navy ink `#142b3d`; paper `#f5f3ee`; white technical surfaces; action blue `#0865bd`; quiet teal `#0e706a`; no neon or decorative status colors                                                          |
| Type           | Local original licensed Manrope for UI/reading; local Source Serif 4 for B display headings only; Segoe UI/Arial and Georgia fallbacks. Portal retains its original operational type                     |
| Hierarchy      | Display headings scale with viewport; readable prose is bounded; small uppercase labels orient rather than replace headings. No fake completion percentage                                               |
| Rhythm         | 4/8/12/16/24/32/48 spacing vocabulary; chapter separators instead of a box around every paragraph; compact native controls in Portal                                                                     |
| Shape          | 10–12 px learning cards; 5 px fields/buttons; subtle borders; elevation restricted to the specimen panel, menus and native dialogs                                                                       |
| Reading        | Main explanation and terms/diagram form distinct columns; ordinary vertical scrolling; technical limits stay visible; existing SourceDisclosure stays closed by default                                  |
| State          | Actual guide, first/retry and storage state come from existing stores. No demonstration scores or fictional progress are prefilled                                                                       |
| Controls       | Native button/select/checkbox/dialog/details semantics; explicit labels, keyboard focus rings, reversible presentation actions                                                                           |
| Motion         | 220 ms position-only/5 px entrance on committed learning view; workspace content is immediate and fully opaque, no transform on fixed Portal ancestry; native immediate operations and history preserved |
| Reduced motion | All prototype transitions and animations disabled under `prefers-reduced-motion: reduce`; no delay in routing, command submission or feedback                                                            |

Fonts total **146,892 bytes** before HTTP compression. The existing 76,509-byte canonical PNG is used at or below native dimensions. Rejected art is lazy-loaded only in Character Bible; no master PNG is loaded during normal learning. Font bytes/licenses and every candidate master/variant are hash-pinned. These are asset measurements, not measured user performance. Target for rollout: no remote font/image dependency, no preventable image layout shift, bounded display font loading, no additional animation runtime. Actual browser observations are recorded with the review evidence; synthetic local timing is not a real-user performance study.

## Motion and continuity prototype

| Transition                  | Implemented behavior / preserved authority                                                                                                                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hub → introduction → theory | Scoped presentation navigation with full text contrast throughout motion, focus after the teaching boundary has actually mounted; ephemeral per-view scroll restoration for in-session Back/Forward                  |
| Theory → Studio             | Same shell, finite view transition; original pure container model; prediction and explicit Run; changed inputs remove the old result                                                                                 |
| Guide → briefing            | Original GuidanceWindow, explicit Start/Cancel, original mission event and technical boundary; opening/closing awards nothing                                                                                        |
| Guide minimization          | Optional portrait is reversible; native mission text and original guidance recovery remain available                                                                                                                 |
| Course → Portal             | Handoff names actual intended work, actual available VM and honest missing/uncertain states; no simulated loading ceremony or fabricated operation                                                                   |
| Resource navigation         | Same SandboxProvider and original Portal component. A presentation-only optional href adapter preserves allowlisted IDs, resource section, origin and technical attempt. Ordinary `/portal` uses identity navigation |
| Portal → guide              | Review bar always provides return to this candidate's guide; original Portal guide and recovery control remain native. Original course links may deliberately return to canonical teaching                           |
| Feedback → Journal          | Real pure model output or original guide feedback; Journal shows an explicitly partial projection of existing Compute, transfer and versioned Benefits/Services history                                              |
| Journal open/close          | Original PortalDialog and teaching boundary; native focus/Escape/scroll. Global canonical Journal remains the complete historical view                                                                               |

The prototype's Container inputs, open Journal and view scroll positions are intentionally ephemeral. Reload restores the URL and all **existing authoritative** resources/guide/assessment state; it does not pretend to persist an unsaved design model. Existing Course Hub resume still prioritizes active independent → guided → saved position. No new resume engine or completion fields.

## Demonstrable actual journey

1. Ordinary root → visible Designlab entry → compare A/B → Compute introduction → original VM explanation.
2. Studio: predict local-layer retention; run the existing pure model; change to external storage and rerun. Nothing enters World or the ledger.
3. Guide: open the original SavvyShark briefing. Cancel has no mission side effect. Explicit Start creates the existing Compute guide only.
4. Handoff → original Portal forms. Select App Sandbox and an actual Resource group; create one if necessary. Use the supported VM form and explicit Review + create/Create.
5. For the full original guided VM contract, prepare an eligible existing subnet first, then create the new Windows/standard/64 GiB VM reusing it **after** mission start. Inspect the seven required original references and provide the original cause. A VM with a newly created network is still a valid local operation but does not by itself complete that guide.
6. Inspect actual Properties, disk/NIC/subnet/VNet and the actual command receipt. No boot, CPU, network traffic, uptime or security claim follows.
7. Minimize/reopen native Portal guidance, return through the review bar, recall the same guide, inspect the actual history selection and complete global Journal in the current course if needed.

Use synthetic names only. No fake prepared positive learner results, credentials, external account or cloud operation. [Actual capability inventory](PORTAL_CAPABILITY_MATRIX.md) defines the boundary.

## Rollout after owner decision

| Bounded delivery              | Prerequisite and acceptance                                                                                                                                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Learning shell and reading | Owner chooses direction/type/spacing; keep original three paths, single real Start/Fortsett, contextual sidebar, original fixed footer and PR43 flow priority. Reuse tokens; production Hub progress must remain actual |
| 2. Studio/guide presentation  | Apply a representative bounded technical layout without changing model/rubric; test predicted/changed/unknown states, native briefing and short windows                                                                 |
| 3. Course-to-Portal frame     | Preserve actual origins/returns/independent neutrality. Review whether optional handoff is useful without adding friction to every lab                                                                                  |
| 4. Journal and feedback       | Port presentation only to the **complete** existing history, preserving every version and durable aid. Do not promote this partial specimen as the global Journal                                                       |
| 5. Character extension        | [Character Bible](SAVVYSHARK_CHARACTER_BIBLE.md); controlled illustrator/rig references, owner approval and fresh identity/alpha review before any new pose becomes active                                              |

No broad production rollout is authorized by this PR. Owner approval is needed for the visual direction, type identity, density tradeoff, handoff pattern and character master before those separate implementations. PR-01 B/C, PD-01, broader AS-02 and P17/P18 remain separate.

## Evidence and review

Actual baseline came from the anonymous PR49 preview with full displayed SHA. New screenshots, source retrieval records, character rejection reports, critical candidate review and final QA are retained under `docs/screenshots/visual-excellence/`, `docs/reviews/evidence/visual50-*` and `docs/quality/`. Public Microsoft reference screenshots were inspected privately and are not shipped. The original PNG/manifest, all previous domain/store/rubric/source bytes and original locale prefix are preserved. Automated tests cannot approve visual taste or human learning outcomes.

## Actual development verification

Full `npm run check` passed (624 Vitest,503 curriculum and20 Node checks plus build). Seven focused desktop cases and one actual800px compact Axe/control witness passed; all312 inherited executions remain in the authoritative320-case candidate (293desktop/27compact), with no worker/retry/timeout/skip change. The compact witness deliberately operates at its initial800px viewport, rather than immediately resizing away. Complete exact-head CI and strict release are still separate delivery gates.

The critical review found and drove real fixes: native briefing stylesheet restored; runtime/replacement/data semantics corrected in the figure; prediction/run moved above the diagram beside inputs; count/details agree for every Compute guide; both native lesson links and resident Portal guide return use the bounded identity-default presentation adapters; heading focus waits for teaching mount; contrast, heading order, landmark names and visible-name consistency corrected. No original event, rubric or command was changed. The complete local demo verified the original seven-reference VM guide, actual causal debrief, native resident return, Journal, unchanged first unaided Benefits submission, denied-aid shielding and exact partial-assessment resume. The six-check local report is explicitly not external Gate7 or deployed-SHA verification.

The final representative warm local Studio probe observed CLS0.05114, DOMContentLoaded35ms and load52ms, with cached local fonts and zero external app requests. Earlier warm development probes varied from CLS0.00027 to0.05114. Font swap and cold/RUM behavior need further measurement before rollout. This is one synthetic local observation, not a performance guarantee or improvement measurement. Font manifest bytes, not cached ResourceTiming body-size0, provide the asset-size evidence. All34 captured frames had zero horizontal overflow, including125% CSS zoom; CSS zoom is a reflow probe, not a claim of manual native browser-zoom testing.

Remaining design issues for owner discussion: result discovery still needs vertical scrolling in500px windows, compact prototype identity is less prominent, the42px review bar costs height, and the partial Journal has repeated track headings. They are visible prototype limits, not approved production patterns. The full Character Library remains incomplete and blocked; three real rejected specimens do not count as production-approved illustrations.

Final local QA retained one failed full-check run with three5000ms timeouts in unchanged Access/Identity/Refined replay tests after environment restart. Those65 targeted tests passed in2.11s; the subsequent unchanged-limit full check passed624/503/20 plus build. No timeout, retry, worker or assertion was relaxed. The final canonical build also passed the ten-surface A/B Axe matrix and all prior targeted tests; authoritative320-case CI and actual external Gate7 remain required.

## First candidate CI finding — corrected before final delivery

The first published head4ad1d42e4170b75f3a93d0dc67c64b61699d0527 completed full CI41516358518 with318 passes and2flaky executions: the new Studio Axe witness retried on desktop and compact. The log exposed real transient contrast loss from the whole-page opacity0.25→1 entrance, not an accepted stable result. No retry/timeout/worker/threshold was changed. Text opacity animation is removed; the learning entrance moves5px at full opacity and Portal is fully opaque immediately. The existing Axe test now pauses the authored animation at0ms, asserts computed opacity1 and that every authored opacity keyframe is absent/1, then scans. Waiting for the fade or forcing reduced motion would conceal the defect and is not used. A fresh stamp, independent affected audit, complete exact-head CI/strict and external full-SHA journey are required for the corrected candidate; the earlier green-with-retries receipt is historical only. Reduced-motion screenshots show the same final composition and remain valid.
