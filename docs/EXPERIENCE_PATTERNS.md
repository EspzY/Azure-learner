# Experience patterns and evidence design

Status: proposed reusable mechanics, version 1.0.0, 2026-10-22. Phase 0.5 implements parts of P01/P04 and an assisted recognition check, not this catalog. Each pattern specifies a learning problem, physical action, state transition/observation, technical basis, evidence and accessible representation. Sources Sxx resolve in [SOURCE_REGISTER.md](SOURCE_REGISTER.md). Full examples are in [EXPERIENCE_BLUEPRINTS.md](EXPERIENCE_BLUEPRINTS.md); A is specified once in [CHAPTER_01_BLUEPRINT.md](CHAPTER_01_BLUEPRINT.md).

## Common learning loop

**Orient → predict → act → inspect the consequence → explain → change a condition → transfer → revisit.** Discovering the system precedes explanation, but a brief names the actual constraint and available tools. Prediction is a saved hypothesis, not a prerequisite article. Feedback follows a modeled consequence, exposes a causal witness and invites a corrective experiment. Explanations expand from outcome to rule to exceptions/source. A diagram animation only illustrates the result already computed by the domain.

Every proposed interaction uses the same attempt identity and resource IDs. UI selection is not technical progress. Read-only diagnostics may add observation records to an attempt, but never mutate the simulated world or earn XP. A failed command is a useful observable event, not an arbitrary penalty. No countdowns, click rewards, ornamental collectibles or precision tests.

## Pattern catalog

### P01 — Spatial system exploration with prediction

- **Problem:** learners confuse identity, containment, location and dependency because they see one undifferentiated tree.
- **Action/state:** choose a relation lens; predict which resources a scope change would affect; select a scope and inspect actual ancestors/descendants. Store prediction/observation in the attempt; selection alone changes presentation state only.
- **Observation/correctness:** typed edges distinguish tenant identity association, management containment and hosting dependency; geography is a separate projection. No implied traffic along containment edges. Rules G01/G02 follow S03–S06.
- **Evidence:** apply the relationship to an unfamiliar subscription/resource; a chosen node is not sufficient evidence. Explain a scope that would remain unaffected.
- **Representation/access:** dimensional scene for orientation, labeled relation-specific diagram for dense topology; native hierarchical list with parent/child/dependency fields and equivalent predict/inspect controls. All edge meaning is available in text.

### P02 — Service-model and responsibility comparison

- **Problem:** memorized IaaS/PaaS/SaaS labels do not explain operational ownership or service suitability.
- **Action/state:** assign responsibility rows for a specified workload; change its hosting choice, then revise OS, code, configuration, identities and data responsibilities. Save a decision record, not a pretend infrastructure deployment.
- **Observation/correctness:** the selected model changes the modeled operational boundary. For a custom App Service application Microsoft operates the underlying platform/OS; the customer still owns application code/configuration and data/access decisions (S01/S12). Avoid an oversimplified universal owner for ambiguous shared rows; scenario specifies them.
- **Evidence:** justify a hosting selection against a changed requirement and correctly allocate the critical responsibilities; code/data ownership cannot be inferred from merely selecting PaaS.
- **Representation/access:** compact comparison matrix and boundary animation; native table/selects/radio groups, readable difference summary, no drag-only sorting or color-only owner.

### P03 — Guided architecture construction

- **Problem:** learners recognize service names but do not understand dependencies or construction order.
- **Action/state:** choose components from a bounded supported set, attach a valid parent/dependency and issue creation commands. Each accepted command changes world revision and adds typed resources/relations.
- **Observation/correctness:** unsupported parent, missing hosting plan or invalid combination is rejected with affected IDs; a plan remains after a later web-app failure. Layout connectors derive from resulting state, not manually drawn decorative links (S03/S05/S12).
- **Evidence:** reconstruct a variant with different IDs and one changed dependency; provide the reason the initial order failed. A final successful scene alone is insufficient.
- **Representation/access:** spatial assembly plus dependency diagram; Add/select-parent/select-plan controls and ordered resource list. Snapping/dragging is optional; same commands/validation in every representation.

### P04 — Configuration and deployment simulation

- **Problem:** learners cannot separate input validity, permissions/policy, service compatibility and successful state mutation.
- **Action/state:** configure one resource, predict the outcome, submit a validated command, inspect receipt and diff, and retry a revised command if necessary. Validation rejects unknown fields/types instead of coercing arbitrary input.
- **Observation/correctness:** the receipt names a specific rule and state revision. Denial does not add the requested resource. Earlier successful commands are not silently undone. The supported evaluation order is documented as a teaching subset, not the Azure request pipeline (S05/S07/S12).
- **Evidence:** choose a technically effective correction under changed constraints and explain an ineffective alternative. Syntax correction alone is not understanding.
- **Representation/access:** compact contextual command, resource diff and event timeline. Native labeled forms, field-linked errors, status announcements and focus return; step-by-step mobile panels retain visible requirement/context.

### P05 — Network traffic investigation

- **Problem:** topology drawings hide DNS, route/filter, transport and service-access causes.
- **Action/state:** choose source, destination and protocol/port; run a new-connection probe; inspect resolver/route/NSG witnesses; edit a supported rule/link and probe again. Edits mutate configuration; probes only append observations.
- **Observation/correctness:** DNS can resolve to the wrong endpoint; an ordered NSG deny can prevent connection; a reachable service can still reject data access. Lower numeric NSG priority is evaluated first, and explicit supported defaults apply (S08–S10/S33). No actual packets or DNS requests leave the browser.
- **Evidence:** repair a changed failure and retain an explicit forbidden-flow negative test. Allow-any is not accepted just because the positive probe works.
- **Representation/access:** flow diagram with labeled stage trace, optionally moving particles representing already calculated outcomes. Equivalent ordered trace/rule table, keyboard-selectable probes and static reduced-motion result. No spatial gesture or animation timing is assessed.

### P06 — Resource dependency and blast-radius analysis

- **Problem:** management grouping is mistaken for runtime coupling and change impact.
- **Action/state:** predict impact, inspect dependency edges, stage a stop/remove/change of a modeled dependency in an isolated workspace, then compare service observations. Only supported changes mutate world state; hypothetical inspection remains a dry run.
- **Observation/correctness:** dependent health follows the explicit service model, not arbitrary proximity or shared resource-group membership. App/plan capacity may be shared; unrelated resources remain unaffected (S05/S12).
- **Evidence:** identify the smallest safe change and a counterexample that should not fail. Later test an unfamiliar dependency graph.
- **Representation/access:** dependency graph/diff with clear edge direction (dependent → required); searchable dependency table and affected-resource list. Give a confirmation for destructive simulated changes where it helps comprehension, not a fake production warning.

### P07 — Identity and permissions investigation

- **Problem:** authenticated, network-reachable or resource-admin status is confused with data authorization.
- **Action/state:** select a principal/operation/scope/plane, evaluate access, inspect matching grants, and make a narrow supported role assignment. Configuration changes the access graph; evaluation adds a witness.
- **Observation/correctness:** principal, action, scope and plane all matter. Managed identity alone is not a grant. In B's explicit Key Vault RBAC mode, control-plane Contributor does not authorize reading secret contents (S06/S11/S22). Unsupported ABAC/deny/legacy-policy cases return unsupported, not a guessed allow.
- **Evidence:** justify the minimal role/scope, pass the intended operation and keep an unrelated principal denied. Record any teaching hints.
- **Representation/access:** access path and effective-permission table, with a text explanation of why a grant applies or does not. Native principal/operation selectors and role controls; no visually inferred privilege.

### P08 — Troubleshooting and incident diagnosis

- **Problem:** learners copy a fix without forming or testing a causal hypothesis.
- **Action/state:** register a suspected cause, choose diagnostics, compare predictions with observations, change one supported configuration, and run positive/negative regression probes. Optional logical fault events advance only through explicit scenario events/ticks.
- **Observation/correctness:** symptoms and logs are generated from the same model; identical commands/fixture versions reproduce outcomes. A failed hypothesis is preserved as learning evidence. B uses deterministic DNS/filter/authorization faults, not random incident theater.
- **Evidence:** independently resolve an unseen cause, provide a supported causal explanation and verify no isolation regression. Do not grade command count or speed as understanding; exploratory diagnostics are legitimate engineering.
- **Representation/access:** hypothesis notebook + incident timeline + relevant flow/access view; equivalent forms, ordered observations and filterable tables. All tools have explicit labels and focus behavior. Synthetic logs are always labeled.

### P09 — Log, monitoring and telemetry exploration

- **Problem:** learners conflate missing data, correlation and causation, or configure alerts without an actionable signal.
- **Action/state:** enable a supported diagnostic source, advance fixture ticks, select/query bounded synthetic records, correlate request/change IDs and configure a threshold/action rule. Collection configuration changes future generated observations; enabling it does not invent earlier logs.
- **Observation/correctness:** metrics/logs/traces have named producers and known gaps; an alert is emitted only when the defined window/predicate is satisfied (S19/S20). A teaching query subset must reject unsupported syntax; it is not full KQL.
- **Evidence:** identify needed telemetry, find a disconfirming record and select an alert that detects the incident without the authored noise cases. Diagnose a different timeline after guidance.
- **Representation/access:** timeline, table and restrained metric plot; accessible table/query builder, described thresholds, ordered events and text summaries. Chart color or hovering is never the only source of data.

### P10 — Cost and performance tradeoff experiment

- **Problem:** cheaper/faster/more instances are treated as universal improvements, ignoring constraints and failure scope.
- **Action/state:** change supported capacity, demand, replication or topology parameters; save a prediction; run a scenario and compare capacity/recovery/cost witnesses. No live billing or load test is performed.
- **Observation/correctness:** arithmetic uses a versioned **synthetic** unit/capacity fixture. Counts and assumptions are visible. No resource pricing, physical latency, SLA or failover guarantee is inferred from it; budgets are alerts rather than automatic service stops (S23/S24/S32).
- **Evidence:** meet hard constraints under a new demand/failure and identify residual risk; an attractive chart or lowest cost alone does not pass.
- **Representation/access:** comparable alternatives, a capacity/failure timeline and an assumptions panel; equivalent numeric inputs, constraint table and calculation trace. Reduced motion preserves all values/results.

### P11 — Architecture comparison and decisions

- **Problem:** learners optimize for a favorite service without connecting choices to business/operating requirements.
- **Action/state:** build or select alternatives, assign constraints, run fault/capacity cases, record an ADR and defend a rejected alternative. Design versions and evidence change; promoting one to the journey is explicit and separate from assessment.
- **Observation/correctness:** feasibility is evaluated from stated rules; multiple designs may pass. Security/recovery/operational tradeoffs remain visible; workload design differs from landing-zone governance (S23–S27).
- **Evidence:** hard-constraint witnesses plus a human-reviewed rationale, operating plan and uncertainty. Structured selections can check coverage; no string matching or AI grader pretends to evaluate free-text engineering quality.
- **Representation/access:** side-by-side architecture/diff and constraint comparison; mobile switches alternatives without losing the selected constraint, with equivalent tables and decision form.

### P12 — Independent challenge and delayed transfer

- **Problem:** successful imitation is mistaken for durable, generalizable competence.
- **Action/state:** start a fresh named variant, predict an outcome, act without teaching hints, submit an immutable attempt and later attempt a changed case. The workspace is isolated; assessment never mutates the journey automatically.
- **Observation/correctness:** normal operational errors/diagnostics stay available. Explanatory teaching feedback is buffered until submission; requesting a hint makes the attempt assisted from that point. Variants change a meaningful constraint/cause, not only labels.
- **Evidence:** per-criterion witnesses, pre-feedback prediction/reason, guidance timing, variant exposure and result. The same revealed variant is practice thereafter. Delayed retrieval is a separately dated observation, not an assumed decay score.
- **Representation/access:** the task-appropriate lenses plus a submission/review layer, equivalent native controls, no timing/precision penalties. State allowed references clearly: professional open-book challenges may permit sources while forbidding guided solutions. Record `referenceMode` separately from hints; accessibility/glossary/representation changes do not reduce independence.

## Feedback and evidence contract

A feedback record needs outcome code, affected entity IDs, observation/witness IDs, explanation key, source IDs and a model-boundary note. Guided feedback can offer a next experiment; independent feedback describes operational failure without prescribing the solution until submission. Always distinguish invalid input, technically rejected command, valid-but-requirement-violating result, unsupported action and incomplete evidence. Do not use a green check for an unsupported or unassessed operation.

Assess predictions **before** showing the result, actions during the task, and reasoning on a changed condition. Use all three where a concept requires them. A final state can be reached by trial and error; that may demonstrate recovery but does not alone prove the causal explanation. Store criterion-level witnesses rather than a universal numeric score. Free reflection is optional human evidence; never mark it correct because it contains a keyword.

Assistance is time-stamped relative to the logical action sequence. Operational diagnostics and permitted documentation are tools, not covert solution hints. Showing a worked solution/teaching hint marks the subsequent performance assisted. Feedback after submission does not rewrite the submitted attempt, but disqualifies reuse of the same variant as unseen. Local evidence remains editable/untrusted and cannot back an organizational credential without later server verification.

## Cohesion and authoring rules

Every lens displays checkpoint/attempt, selected resource, active relation type, simulated status and relevant model limitations. Selection and resource IDs survive lens switches; presentation coordinates never enter evaluation. Notifications describe an actual receipt; ambient movement never fabricates operations. Navigation returns to a resumable workspace, with an explicit reset/fork/promote choice instead of silent loss/overwrite.

Authors supply a brief, objectives, misconceptions, at least one counterexample, source/rule records, a correct trace, an incorrect trace, an unfamiliar transfer variant, an accessibility path and acceptance tests. A reviewer must be able to ask a technical counterexample and find a documented outcome or explicit unsupported boundary. The [professional rubric](PRODUCT_BLUEPRINT.md#professional-demonstration-rubric) and roadmap are release gates, not completed user research.
