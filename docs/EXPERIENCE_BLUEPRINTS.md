# Three learning experience blueprints

Status: **proposed examples**, 2026-10-22. A is the sole first implementation target, specified in its own chapter document. B and C test whether the proposed architecture can support genuine engineering/design depth; they are not authorized implementation scope for Phase 1B and are not available in the app. All names, incidents, observations and numbers are fictional. Sources Sxx resolve in [SOURCE_REGISTER.md](SOURCE_REGISTER.md).

## A — From requirements to a governed application platform

Foundational L1–L2: connect responsibility, management scope, independent geographic placement, policy and hosting dependencies through decisions, a denied configuration, correction and an unfamiliar transfer. The full sequence, inputs, four commands, five criteria, two transfer variants, persistent export and V01–V16 test vectors are specified once in [CHAPTER_01_BLUEPRINT.md](CHAPTER_01_BLUEPRINT.md). It exports a learner-created `application-platform@1.0.0` checkpoint. B reuses that artifact rather than opening an unrelated toy world.

## B — Diagnose a private secret-access failure

### Outcome, context and prerequisites

Engineering/troubleshooting L3. The fictional service environment has acquired a diagnostic VM and a Key Vault. A secret-read probe fails. Restore access **only for the intended workload**, without enabling public access or broadening unrelated data permissions.

Objectives: N01/N02/N03, I01/I02 and O02. Prerequisites: scope/plane/role concepts, IP/DNS/new-connection NSG tracing, managed identity, basic VM operation and synthetic-log interpretation. Placement can supply these outcomes. This is not a beginner shortcut around those prerequisites. Sources S06/S08/S09/S10/S11/S22/S33; follow the provider documentation's network-versus-permission distinctions rather than treating every 403 as RBAC.

Start from A's explicit group/plan/app roles (learner checkpoint or labeled reference). A compatibility adapter adds a reviewed `private-diagnostics@1` fixture in a **fork**, preserving application IDs and earlier location decisions. The new VM is a diagnostic client, not an assertion that App Service lives inside that subnet. A later App Service VNet-integration model would be a separate capability. This is a persistent-environment extension, not an incident that mutates the main world invisibly.

### Fixed configuration and rule model

| Record          | Scenario value / meaning                                                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VNet / source   | `10.0.0.0/16`; VM NIC `10.0.1.4`, subnet `10.0.1.0/24`; fixed on-link route to private endpoint                                                                         |
| Destination     | Key Vault in explicit Azure RBAC mode; approved private endpoint `10.0.2.4`; public access disabled                                                                     |
| DNS             | Fixture service FQDN has a Private Link alias; private zone `privatelink.vaultcore.azure.net` contains the correct record but is **not linked** to source VNet          |
| Public result   | Synthetic public address `198.51.100.10` (documentation range, never contacted); reachable public endpoint rejects with a simulated `403 / ForbiddenByFirewall` witness |
| NSG             | Source-subnet outbound rule priority **200** denies TCP to `10.0.2.4:443`; supported VNet/default rules below it are explicitly present                                 |
| Intended caller | `mi-diag` has a valid synthetic identity assertion and control-plane Contributor only; no Key Vault secret data role                                                    |
| Operator        | `lab-operator` has a separate authored control-plane authorization fixture for permitted configuration/role changes; the VM identity does not grant itself roles        |
| Secret          | A synthetic record with no secret value; a successful get returns `available`, never a credential                                                                       |

Ordered new-connection probe: resolver → route/filter → service network admission → data authorization. Preserve a witness for each evaluated stage, and `not-reached` for later stages. Model this order as an explicit diagnostic abstraction, not a reproduction of every Azure request/error detail. No actual packet, DNS, token or Key Vault request executes.

1. Without the zone link, resolve the public fixture address; NSG private-address deny does not match. Public endpoint responds with the authored firewall rejection; data authorization is not established by that result.
2. After linking the zone, resolve `10.0.2.4`. New TCP connection matches outbound deny 200 and times out in the model. No HTTP result exists at this stage.
3. Add a narrow allow rule at **150** for source `10.0.1.4` → destination `10.0.2.4`, TCP/443. Lower number precedes 200. Do not use invalid custom priorities below 100.
4. The private request reaches the service but data operation is denied. Control-plane Contributor does not grant secret-read rights in RBAC mode. Assign Key Vault Secrets User at this vault to `mi-diag`; the operation succeeds.

Only the source-subnet outbound NSG is modeled; do not imply NSGs automatically filter a private endpoint's inbound interface without the relevant network-policy configuration. Probes always establish **new** connections; existing stateful-flow behavior is omitted. Role/DNS changes take effect at the next logical probe; real propagation/cache delays are omitted and disclosed. Key Vault legacy access policies, ABAC, deny assignments, custom DNS forwarding, TLS internals and packet-level TCP are unsupported.

### Full interaction sequence

| Step                   | User action                                                                                                  | State/observation                                                                                     | Feedback/explanation strategy                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Establish symptom    | Run the failing probe, save an initial hypothesis and expected observation                                   | Append probe result and prediction; world unchanged                                                   | Show the failed operation, caller and network path; no immediate worked solution                                                      |
| 2 Test name resolution | Inspect resolver/alias/zone/link records; compare resolved address with private endpoint                     | `dns.resolve` witness shows public target and missing VNet linkage                                    | On demand, explain that approved endpoint and correct record do not imply this caller's resolver uses the zone                        |
| 3 Correct DNS          | Link the existing zone to source VNet and run a new probe                                                    | World config changes; probe now resolves privately but stops at NSG deny 200                          | Reveal the next cause from its actual witness; do not claim DNS repair was ineffective merely because service is still unavailable    |
| 4 Trace filtering      | Evaluate ordered rules; predict which minimal allow changes the result; add it and probe                     | Receipt for allow rule; transport reaches service, then data-plane 403                                | Explain priority and the distinction between transport and authorization after observation                                            |
| 5 Investigate identity | Compare identity, plane/action and grants; choose a narrow data role                                         | `mi-diag` receives vault-scoped Secrets User; next secret get returns available                       | Managed identity authenticates; separate role grants the permitted operation. Sources and omitted Azure cases are one expansion away. |
| 6 Test safety          | Re-run intended get, unintended caller get, unintended caller's network flow and secret-set operation        | Positive success; unrelated caller/data write remain denied; other-source flow still matches NSG deny | Explain why positive reachability alone was insufficient. A broad network/role fix may be technically valid but fails the brief.      |
| 7 Transfer and handoff | Submit causal explanation; solve a fresh fault variant; optionally promote supported corrected configuration | Immutable per-criterion evidence; explicit checkpoint diff only after validation                      | Separate assisted diagnosis from independent transfer; preserve original main world unless promoted                                   |

Relevant model commands: LinkPrivateZone, AddNsgRule, AssignVaultRole, RunNewConnectionProbe and EvaluateDataAccess. They would be new registered service capabilities after model review, not arbitrary terminal commands. Diagnostic inputs use a constrained synthetic command console or equivalent selectors; no shell, external network or real token is accepted.

### Incorrect actions, evidence and transfer

- Enabling public access can make a public probe reachable but violates the explicit isolation requirement; report requirement failure, not a fake Azure denial.
- Granting Contributor again leaves data authorization denied. A broader Key Vault Administrator data role may work technically but fails least privilege. Do not secretly fail all noncanonical rule priorities if equivalent narrow filtering satisfies both probes.
- Linking the wrong zone/VNet changes state but leaves resolution wrong. The witness names the resolver actually used.
- A new rule with priority 250 remains behind deny 200. The trace shows the first matching rule; it does not award a cosmetic configuration check.
- Probing from another source or identity records a different context. A successful diagnostic-operator call cannot be substituted for the workload's call.

Criteria: (1) pre-change hypothesis tied to a discriminating observation; (2) private resolution for intended caller; (3) intended transport allowed while other-source flow is denied; (4) intended principal can get but not set a secret in this vault and unrelated principal cannot get; (5) no public/broad-grant bypass; (6) coherent cause sequence plus post-change verification. Machine findings cover explicit state/probe predicates; a human reviews the rationale. A final all-green diagram without causal evidence is not enough.

Transfer variants: one has correct DNS but a wrong NSG rule priority and valid data role; another has working network and a grant on a different vault. Both use fresh IDs and change the actual cause, not only labels. Independent open-book mode withholds teaching prescriptions before submission; exposed variants become practice. No command-count/speed scoring or fake mastery percentage.

### Visual specification, complexity and reuse

Use a network-flow lens, resolver/rule table, access trace and correlated observation timeline. Typed containment/identity context remains available but is not drawn as traffic. Highlight the **first evaluated failure** and label downstream stages untested, rather than painting every downstream resource broken. Inspect a receipt/record alongside its source and model limitation. Mobile steps through hypothesis, diagnostic context, result and correction; persistent source/destination/principal chips prevent context loss. A complete text trace/table path provides keyboard/screen-reader equivalence and static reduced-motion outcomes.

Complexity estimate: **high bounded engineering case**: roughly ten configuration record types, four probe stages, three independently authored faults, at least four positive/negative probes, two transfer fixtures and a compatibility adapter. No delivery estimate. Reuse scenario runner, command envelopes, receipts, checkpoint roles, evidence/hint handling, lens selection and localization. New investment is explicit DNS/NSG/Key Vault models and synthetic observations. Accept only after Azure peer review of errors/planes/omissions and independent learner diagnosis; A's schemas alone cannot prove this model correct.

## C — Design a recoverable service under constraints

### Outcome, context and prerequisites

Advanced L4: a fictional service is moving from a small app platform to an operated regional service. Evaluate feasible designs under demand, isolation, zone/region failure, data recovery and budget constraints. There is no universal best diagram. Prerequisites: R01-level preparation including C01, N04, I02, D02, O03 and A03 outcomes, or independent placement/reference checkpoint. Use A/B-derived roles if compatible, otherwise an explicitly labeled reference architecture. Sources S12/S15/S23/S24/S25/S32/S37.

The learner produces a versioned design, calculation/failure witnesses, an operating/recovery plan and a short ADR. Automated feasibility does not substitute for engineering rationale. All capacity, latency, recovery times and **cost units (CU)** below are original synthetic exercise inputs, **not Azure prices, SKU specifications, benchmarks, SLAs or promised failover behavior**. The implementation must display those assumptions beside every result.

### Frozen requirements and arithmetic

| Requirement/input      | Exercise value                                                                                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Demand                 | Normal 80 requests/s; burst 180 requests/s; one modeled app unit supports 100 requests/s                                                                                                       |
| Regional choices       | Two fixture regions within the permitted fictional data boundary; no assertion that a selected region assures legal compliance                                                                 |
| Availability challenge | Serve burst demand during either one zone failure **or** one primary-region loss; simultaneous independent failures are excluded                                                               |
| Recovery               | Region-loss RTO ≤30 logical minutes; observed lost commits ≤5 logical minutes; deletion recovery ≤60 logical minutes                                                                           |
| Latency                | Modeled p95 ≤100ms once the relevant steady/recovered configuration is active                                                                                                                  |
| Security               | No public data-service access; workload-specific read/write role, separate operator privilege; test an unrelated principal                                                                     |
| Cost                   | Baseline and allocated recovery peak ≤130 CU per exercise month; no conversion to currency                                                                                                     |
| Unit cost              | App unit 12; primary data service 20; zone-resilient data feature 8; asynchronous replica 16; backup 4; private connectivity 6 per used region; global routing 5                               |
| Failure fixture        | Zone loss removes the largest app allocation in one region; three-zone synthetic allocation loses `ceil(units/3)`; this is a pedagogical fixture, not user-controlled App Service zone pinning |
| Recovery fixture       | Data failover 10 min; adding a standby app unit 20 min; routing convergence 5 min; parallel stages complete at max(stage durations), then routing                                              |
| Data fixture           | Commits each logical minute; replica updates at ticks 0/5/10/15; failure at tick 12 loses two minutes. Backup at tick 10 restores into an alternate target in 15 min.                          |

A real Azure model would need measured workload capacity, availability/service-tier support, region/SKU constraints, failover semantics and actual pricing. It must not turn this arithmetic exercise into an asserted provider guarantee. Region pairing itself never triggers failover. Replica and backup serve distinct failure cases; deletion may replicate.

Recovery time here is the logical interval from injected failure to the recovered service predicate, including explicit recovery-stage durations and any authored/learner-added logical delay. The worked traces assume the runbook starts immediately; human thinking time is not a reaction-speed score. Deletion detected only at tick 15 and then restored in 15 minutes recovers at tick 30: 18 logical minutes after the tick-12 deletion. Record that full interval separately from the 15-minute restore operation. Neither result predicts a real operational RTO.

### Worked alternatives and observable tradeoffs

These are author fixtures for review, not the only solutions exposed to learners before independent submission.

| Design                                                                                                                          | Baseline arithmetic                  | Failure result                                                                                                                                                   | Feasibility / design discussion                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A: two units in one region, unprotected primary data, backup, private link                                                      | `2×12 +20 +4 +6 =54 CU`              | One modeled zone loss leaves 100 requests/s and no data-zone protection; region recovery fixture 80 min                                                          | Low cost but fails availability/RTO. A low cost badge must never imply a correct architecture.                                                                                       |
| B: primary 3 units, warm standby 1, zone-resilient primary data + async replica + backup, both private links, global routing    | `4×12 +20 +8 +16 +4 +2×6 +5 =113 CU` | Primary zone loss leaves 200 requests/s. Region loss: standby grows to 2; `max(20,10)+5 =25 min`; recovered capacity 200; peak allocated cost `5×12 +65 =125 CU` | Passes declared cases; standby scaling/runbook assumptions create operational risk. Synthetic p95 30ms normally / 95ms after recovery.                                               |
| C: active app pools 2+2, single-writer zone-resilient primary data + async replica + backup, both private links, global routing | Same 113 CU, peak 113                | Modeled zone loss leaves 300 total requests/s; region loss leaves 200 app capacity and data/routing recover in `10+5 =15 min`                                    | Also passes. Synthetic p95 30/80ms normally, 90ms recovered; greater normal cross-region traffic/operational complexity. Active applications do not imply active-active data writes. |

For B, 65 CU is the explicitly itemized non-app total (20+8+16+4+12+5); failed primary allocations remain counted during recovery in this fixture. Designs must show baseline and peak accounting. Alternative valid allocations are accepted if their tests meet constraints; do not compare design IDs to a hidden answer key. The three-zone allocation abstraction is not a universal Azure App Service instance-count rule. The current S37 service guidance takes precedence over stale troubleshooting references.

Backup test: at tick 12 delete a row; by tick 15 the deletion is replicated. A replica does not recover the row. Restore the tick-10 backup into an alternate target, verify row presence/consistency and explain the two-minute recovery point. Synthetic restore takes 15 minutes, meeting the exercise's deletion requirement. A failover success does not establish deletion recovery or zero data loss.

### Full interaction sequence

| Step                     | User action                                                                                                        | State/observation                                                                      | Technical feedback/evidence                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1 Interpret              | Classify hard constraints versus preferences; record unknowns and initial prediction                               | Save requirement interpretation and assumed design risks                               | Missing a recovery/security constraint remains visible; no points for drawing a fashionable architecture                  |
| 2 Construct alternatives | Configure region pools, data protection/replica/backup, identity/network boundary and routing                      | Save design revisions and derive synthetic dependency/cost view                        | Unsupported service combinations say unsupported; cost/latency assumptions remain inspectable                             |
| 3 Predict/test load      | Predict normal/burst capacity and costs, run bounded demand cases                                                  | Trace allocated capacity and failures; exact arithmetic/witnesses                      | Show which constraint failed and why; more units change cost as well as capacity                                          |
| 4 Inject failure         | Choose a zone fault, primary-region fault and deletion case; advance logical timeline and execute runbook          | Explicit failure/recovery state, lost-commit window and measured logical recovery time | Zone survival does not imply regional recovery; a backup cannot serve requests while restoration is pending               |
| 5 Compare and defend     | Select a feasible design, explain two tradeoffs, reject another with evidence and document uncertainty             | Versioned ADR plus scenario witnesses; free prose human-review-pending                 | No fabricated numerical architecture quality/readiness score; multiple valid outcomes                                     |
| 6 Independent redesign   | Receive a held-out constraint set, submit design/predictions before feedback, run required tests and defend result | Frozen independent evidence; optional explicit journey promotion after review          | New requirement can invalidate the previously preferred design. Known worked examples cannot count as unseen performance. |

Example independent constraint sets: burst rises to 260 requests/s with recovery budget 150 CU; or deletion recovery target becomes 10 minutes, making the 15-minute restore fixture inadequate. The latter may require an **evidence-backed infeasibility/escalation decision** rather than inventing an unsupported instant-restore feature. The rubric explicitly accepts a justified no-feasible-design conclusion only when all supported alternatives/constraints are accounted for. Authors must prove at least one intended successful solution or declare infeasibility as the learning objective.

### Assessment, visualization and implementation boundary

Automated criteria: all declared hard constraints evaluated; required load/fault/negative-access cases run; synthetic cost and recovery calculations correct; state transitions reproducible; no false zero-loss assertion. Independent status additionally needs an unseen constraint set and no teaching guidance before submission. Human rubric: requirement interpretation, quality of rejected alternatives, least-privilege rationale, operating/recovery plan, data-loss explanation and explicitly unvalidated assumptions. Free-text ADR quality is not inferred from a checklist or language-model score.

Use an architecture/dependency lens, alternative comparison table, cost/capacity calculation trace and recovery timeline. Spatial placement supplies orientation, never a scale model of distance/latency. A reviewer can select any result and inspect assumptions, rule/version and witness. Mobile compares one design with a pinned constraint at a time, with accessible tables/forms and an ordered timeline. No hover-only chart, precision layout score or animation-derived timing.

Complexity estimate: **high advanced case**, not a Phase 1B feature: multi-region capacity fixture, staged data/recovery model, access checks, at least three failure cases, two feasible design families, one infeasibility challenge and human ADR review. Reuse world roles, versioned scenarios, command/decision logs, lens projections, evidence/assistance and explicit promotion. New models need independent Azure/domain review and learner evaluation; synthetic arithmetic can teach tradeoffs but cannot validate production architecture. A future real-lab transition must replace assumptions with authorized measurement and provider-specific verification.
