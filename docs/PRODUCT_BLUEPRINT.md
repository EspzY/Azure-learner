# AzureLab product blueprint

Status: **Phase 1A proposal for owner review**, 2026-10-22. The running application remains Phase 0.5 at `db02abf`. None of the new chapters, persistence or platform contracts in this document is implemented. Full Phase 1B work requires blueprint review and authorization. This is the product decision document; [LEARNING_JOURNEY.md](LEARNING_JOURNEY.md) owns competencies, [EXPERIENCE_PATTERNS.md](EXPERIENCE_PATTERNS.md) owns learning mechanics, [SIMULATION_PLATFORM.md](SIMULATION_PLATFORM.md) owns system contracts and [CHAPTER_01_BLUEPRINT.md](CHAPTER_01_BLUEPRINT.md) owns the first implementation target.

## Assessment of the actual product

Inspected domain functions, Workbench/Assessment, content, progress provider, renderers, tests and the retained desktop/mobile screenshots. Phase 0.5's [Linux CI passed](https://github.com/EspzY/Azure-learner/actions/runs/39849585882). That is engineering evidence, not evidence that people learn effectively.

| Confirmed capability                                         | Product limitation and consequence                                                                                                                                                                                          |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pure immutable creation, runtime validation, fixed award IDs | `missionSatisfied` checks one name, parent ID and region. It cannot distinguish understanding from following the supplied answer.                                                                                           |
| Eight scopes, three permitted regions, three extra groups    | `Scope.kind = resource` has no provider type/configuration, hosting dependency, permission, policy, traffic, cost or health model. The displayed App Service is a scope illustration, not a provisioned hosting simulation. |
| Spatial selection, branch focus, inspector, list and XYFlow  | Selection mainly reveals information. Region comparison always selects the same `rg-app` example. The product does not ask learners to predict a result and test an alternative.                                            |
| Brief/create/check/reset overlays and current-attempt HUD    | Scenario steps, exact IDs, feedback and awards are coupled inside Workbench. A second mission would encourage copied component branches.                                                                                    |
| Three original questions with explanations and retries       | Immediate assisted recognition, with no unfamiliar transfer task, hypothesis log, delayed retrieval or independent-performance evidence. All-correct is a check rule, not a validated competence threshold.                 |
| Completion IDs survive reload; XP deduplicates               | World/answers/camera are ephemeral. There is no persistent environment, attempt record, checkpoint provenance or versioned migration of scenario state.                                                                     |
| Dark dimensional environment and accessible alternatives     | Desktop focus can crop labels; mobile HUD/inspector compete for space. Evidence is screenshots and Chromium/axe, not physical-device or human assistive-technology evaluation.                                              |
| Honest unassessed mastery/readiness                          | This honesty must survive a larger curriculum; adding percentages to the current ledger would fabricate evidence.                                                                                                           |

Preserve deterministic rules, language-neutral IDs, runtime validation, original content, native controls and the provider-free application. Reuse the renderer as one representation. Do not generalize `parentId` into a universal model of identity, containment, dependencies and traffic.

## Four product models considered

These are architectural judgments and testable product hypotheses, not measured rankings.

| Dimension                     | A: one persistent cloud universe                                             | B: interconnected competency worlds                                     | C: virtual-organization scenario operations                               | D: journey world + isolated scenario workspaces                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Educational effectiveness     | Strong accumulated causality; early mistakes can obscure the intended lesson | Topic-specific mental models; weak transfer unless bridges are authored | Excellent diagnosis/constraints; prerequisites can become implicit        | Explicit competency outcomes plus cross-chapter causal continuity and transfer variants                            |
| Progression                   | Visible growing estate, but resource count can masquerade as skill           | Clear skill graph; can become a content-completion map                  | Responsibility and task complexity increase; fragmented estate            | Versioned checkpoints show environment growth; evidence shows ability separately                                   |
| Engagement                    | Ownership/discovery; overwhelming late-game world                            | Many entry points; risk of disconnected mini-games                      | Authentic incidents; risk of forced corporate role play                   | Optional fictional continuity, consequential decisions and familiar environments in new contexts                   |
| Technical scalability         | Long-lived state migrations and combinatorial drift dominate                 | Independent models scale well; integration contracts multiply           | Bounded initial states; scenario-specific scripts can proliferate         | Frozen scenario inputs and small service models; explicit checkpoint adapters constrain combinations               |
| Authoring                     | Every chapter must tolerate every historical state                           | Reusable topic templates, expensive cross-world synthesis               | Fast bounded cases, but repeated bespoke orchestration                    | More upfront contracts/review, then reusable rules, patterns and fixtures                                          |
| Simulator                     | Large mutable estate and emergent interactions                               | Separate engines risk contradictory Azure behavior                      | Fixture + task scripts, often tied to mission UI                          | Shared domain kernels, declarative scenario data, isolated attempts, selective promotion                           |
| Beginners / experienced users | Guided growth helps beginners; experienced users inherit irrelevant setup    | Easy placement/branching; advanced integrated practice needs extra work | Experts can start at realistic problems; beginners need scaffolds         | Guided entry or diagnostic placement into the same outcomes; reference checkpoints prevent replaying prerequisites |
| Visual/interaction needs      | Huge navigable map risks decorative infrastructure                           | Each domain chooses a useful representation; coherence is hard          | Dense console/log tooling; weak exploration if only tickets               | Stable world orientation and selection semantics; spatial, flow, timeline and decision lenses per task             |
| Performance                   | Estate size/history grows; broad recalculation                               | Small scenes; navigation/context switching cost                         | Small fixtures/log sets, cheap replay                                     | Bounded active workspace and projections; journey archive loaded on demand                                         |
| Maintenance / enterprise      | Content updates can break personal worlds; shared worlds need concurrency    | Course ownership/localization manageable; cross-domain drift            | Good assessment isolation; organizational workflows can dominate learning | Versioned packages, private worlds and provenance; future organization policies sit outside the simulator          |

## Recommendation: a competency journey with a persistent reference world

Choose **D**. A small fictional service environment gives continuity, while every technical exercise runs in a fork of a named checkpoint. Competencies determine entry and recommendations. Scenario packages determine the supported technical problem. Representations expose its causality. An immutable evidence record describes what the learner demonstrated under which conditions.

This retains A's ownership, B's specialization and C's bounded technical rigor. It avoids making every incident mutate one increasingly fragile estate. It is more demanding to author than a collection of demos: authors must define provenance, admissible states, counterexamples and transfer tasks. That cost is justified by reliable repetition, comparable independent challenges and source updates that do not silently rewrite learner history. Superiority is conditional on the learner-review gates below; it is not yet validated by users.

The fictional organization, `lab-org`, operates a small service-request application. Its only narrative purpose is to supply requirements, an application/data lifecycle and later consequences. No characters, employer role assignments, fictional email backlog, mandatory story dialogue or real customer data. A learner can view a direct technical brief without narrative framing.

The proposed distinction is a revisitable learner-owned world, causal observations from a shared bounded model and explicit transfer/evidence provenance across chapters. Microsoft Learn also offers interactive labs and Applied Skills; AzureLab does not claim that learning by doing is unique to this product. It complements authoritative documentation and authorized real practice rather than reproducing official lessons or assessment labs.

| Layer                             | Persists?                                                                           | Learning purpose                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Competency/evidence history       | Append attempts with explicit assistance/version/trust; deletable                   | Distinguish guided success, transfer performance and retention            |
| Journey checkpoint                | Explicit learner promotion of a validated chapter result; immutable prior revisions | Revisit the same organization, explain change and attach later challenges |
| Practice/incident workspace       | Resumable draft, isolated from journey; reset/replay freely                         | Make mistakes without poisoning later prerequisites                       |
| Independent challenge             | Frozen unseen variant in a fresh workspace                                          | Test applying the concept without reproducing the demonstration           |
| Camera, selected lens, panels     | Optional local preference, never assessment evidence                                | Reduce orientation friction                                               |
| Prices, outages, live Azure state | Never silently imported                                                             | Use dated fixtures and explicit assumptions; preserve replay              |

Promotion is not mastery. Passing an assessment does not require promoting the learner's design. If prerequisites are absent, offer a clearly attributed reference checkpoint. Replaying a chapter never overwrites a main checkpoint without explicit selection; branches can coexist. No collaborative editing is needed for the first chapter. Exact persistence/conflict rules are in SIMULATION_PLATFORM.md.

## Coherent experience architecture

1. **Entry:** resume a workspace or choose a goal such as understand, build, diagnose or design. Show the actual next decision and evidence gap, rather than course-count statistics.
2. **Orientation:** an optional short control tutorial, simulation boundary and baseline diagnostic. Let experienced users attempt an unfamiliar task immediately. Tutorials do not award competence.
3. **World navigation:** a competency constellation connects capability clusters; selecting one reveals prerequisites and a runnable challenge, not a bookshelf of articles. Search/filter and a semantic prerequisite list are equivalent. Recommendations explain why they appear and can be bypassed.
4. **Mission selection:** inspect objective, required models, input checkpoint, supported actions, expected artifact and assistance mode. Preview future work honestly; only implemented packages launch.
5. **Active workspace:** retain world/checkpoint context and one compact objective. Switch between organization, connectivity, access, observation and decision lenses while preserving resource IDs, selection, command history and revision. Switching views never advances an objective.
6. **Explanation:** describe the observed outcome first; expose the causal rule, source and model boundary on demand. During independent work, withhold teaching hints until explicitly requested or after submission. Operational error messages remain available.
7. **Completion:** show the actual diff, rule witnesses, assistance and transfer result. Offer promote, practice a counterexample or return to the journey. XP and evidence occupy separate fields.
8. **Review/branching:** evidence history shows missing, assisted, independently demonstrated, stale or retention-due observations. Specialized paths connect to shared prerequisites. No fabricated overall mastery gauge.

The dark visual identity and dimensional orientation remain. An NSG should be inspected through a flow/rule trace; logs through a timeline/table; a business tradeoff through comparable design alternatives. A single 3D lens must not constrain curriculum design. Desktop permits dense side-by-side investigation. Mobile stages lens → decision → observation in a focused workspace with searchable lists and bottom sheets, preserving the same task and evidence. Neither requires precision dragging or color-only interpretation.

## Product feature admission contract

Every new feature/package must identify: **what is learned; what the learner does; which state changes; which observation proves the consequence; which independent evidence could refute apparent understanding**. A beautiful scene without a decision/consequence/evidence chain fails admission. The pattern catalog and chapter acceptance tables operationalize this rule.

Prioritize reusable concepts over service coverage counts. No unsupported Azure operation may silently succeed. Distinguish unsupported from incorrectly configured. Prefer a narrow model with a truthful boundary to plausible-looking invented platform behavior.

## Professional demonstration rubric

Planned evaluation, not performed. Score each dimension with a concrete observation: **0** broken/misleading, **1** works only with prompting or has material omissions, **2** accurate and independently usable within stated limits, **3** withstands a counterexample and the reviewer can explain the tradeoff. Scores describe this demonstration, not learner mastery or product validity.

| Dimension                 | Review exercise / evidence required for at least 2                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Technical credibility     | Predict a denied deployment and reconcile resource-group metadata versus resource/plan location using the rule/source; no false Azure claim |
| Learning depth            | Complete an unfamiliar variant and explain a changed constraint, rather than repeat names from a hint                                       |
| Interaction quality       | Execute a meaningful command, inspect before/after state and correct a failed decision without facilitator navigation                       |
| Mental models             | Distinguish identity association, management containment, hosting dependency and traffic; labels agree across views                         |
| Visual polish             | Selection stays legible, result is observable and overlays do not conceal the required action on desktop/mobile                             |
| Architectural consistency | Same command log produces the same state/evidence in spatial and list views; unsupported features are explicit                              |
| Performance               | Profile chapter fixtures at the agreed device/viewport budget; no input lost or control blocked while changing lenses                       |
| Usability/accessibility   | Keyboard-only loop, focus return, reduced motion, reflow and screen-reader task access work without scene gestures                          |
| Extensibility             | Author a transfer variant by changing reviewed data and fixtures without adding mission-specific JSX branches                               |
| Educational effectiveness | Learner states the causal rule and applies it in the transfer task; observed misconception and assistance are recorded                      |

Release gate: all dimensions at least 2, with **no unresolved technical, safety, accessibility or evidence-integrity blocker**. Do not average away a failed category. These thresholds are proposed acceptance criteria, not results of a validated research instrument.

### Planned human reviews

| Reviewer                      | Exercise                                                                                                              | Observe / record                                                                                      | Unacceptable outcome                                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Relative Azure beginner       | Chapter 01 guided mode, then fresh transfer; explain who patches the OS and where an app runs                         | Predictions before feedback; independent scope/region actions; assistance needed; controls discovered | Finishes by copying but cannot explain the location result or thinks local actions create Azure resources                                                  |
| Experienced IT engineer       | Skip tutorial; diagnostic placement; unfamiliar policy/location variant; later B incident from a reference checkpoint | Whether prior skills transfer; unhelpful gating; hypothesis → diagnostic → corrective change          | Forced beginner slideshow, arbitrary error or apparently successful broad permission/network bypass                                                        |
| Azure administrator/architect | Challenge rule boundaries and rejected configurations; trace B; compare two valid C designs                           | Technical counterexamples, Azure exceptions, assumption visibility, adequacy of witnesses             | Simulator teaches resource containment as network reachability, Owner as automatic secret-read access, backup as HA, or synthetic units as real prices/SLA |

Include a keyboard-only participant, a screen-reader user and a physical mobile-device review in the first implementation review. Obtain consent for notes; no analytics or session recording is implemented/authorized. Do not claim learning impact from one successful session. Revisit after repeated transfer/retention observations; assess whether corrections generalize beyond the exact scenario.

## Decisions, uncertainty and scope

The architecture is sufficiently specified to review, but several assumptions require evidence: whether persistent continuity improves transfer, whether switching lenses preserves orientation, and whether a compact chapter teaches five connected objectives without overload. The proposed placement and evidence labels need calibration with real learners. The renderer is reusable, but scaling limits are unmeasured beyond the current bounded scene.

Phase 1B must prove one chapter using small typed contracts; Phase 1C extracts a platform only after the chapter and a second authored variant expose real reuse. No generic plugin system, full Azure resource catalog, arbitrary code execution, AI grader, database, accounts or live integrations. See [ROADMAP.md](ROADMAP.md) for gates/exclusions and [SOURCE_REGISTER.md](SOURCE_REGISTER.md) for current source/lifecycle checks.
