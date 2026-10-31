# AZ-900 — sporbar dekningsmatrise

> Generert fra [auditdata](audits/az900-2026-07-20.json) med `npm run az900:audit:check -- --write`. Rediger funnene i JSON; kontrollen avviser en utdatert matrise. Datafilen importeres aldri av læringsplattformen.

Opprinnelig audit kontrollert **2026-10-26**. Offisielt grunnlag: Skills measured **2026-07-20**. Koderevisjon: PR18, `codex/azure-portal-exact-icons`, commit `184b818a041919b9a6461310c3ba39074e020641`. Den opprinnelige PR19-auditen var read-only. Senere implementerte tillegg er dokumentert som daterte scoped updates nedenfor; historiske rubrics og læringsregistreringer beholdes med sin opprinnelige betydning.

Scoped update **P00**, 2026-10-27: 1.1.07, 2.2.01. Scoped serverless implementation. Other PR19 rows and their 2026-10-26 source review remain unchanged; no human approval.

Scoped update **P01**, 2026-10-27: 2.1.01, 2.1.02, 2.1.03. Only physical Part A2.1.01-03 re-audited. Other54 objective rows, especially2.1.04-07, retain previous semantics. No learner evidence upgrade or human approval.

Scoped update **P02**, 2026-10-27: 2.1.04, 2.1.05, 2.1.06, 2.1.07. Only four scoped management rows re-audited. Part A historical source/evidence semantics unchanged; combined module projects seven implemented objectives without learner upgrades. Human approval unperformed.

Scoped update **PR25-P03**, 2026-10-27: 1.1.03, 1.1.04, 1.1.06, 1.2.01, 1.2.02, 1.2.03, 1.2.04, 1.3.04. Scoped A–F content re-review: eight former PARTIAL rows now COMPLETE through retained substantive teaching/models and19 new versioned independent cases with specific feedback and official source checks. Cloud concepts15/15 content coverage; no old evidence upgrade, learner competence, exam readiness or human approval is inferred.

Scoped update **PR26-P04**, 2026-10-27: 3.1.01, 3.1.02, 3.1.03, 3.1.04. Four cost objectives re-reviewed A–F with original full teaching, four workbenches, ten independent cases and official claims. Optimization taught as extra Learn objective, not a new exam slot. No learner mastery or readiness inferred.

Scoped update **PR27-P05**, 2026-10-28: 2.2.01, 2.2.02, 2.2.03, 2.2.04. Four Compute rows re-reviewed against actual original manuscript, four distinct applications,14 new decision/reason cases, specific counterfactual feedback and official source qualifications. Networking2.2.05–06 unchanged; no readiness or human validation inferred.

Scoped update **PR28-P06**, 2026-10-28: 2.2.05. Only VNet, Subnet, Peering and Azure DNS facets have implemented scoped A–F coverage.2.2.05 remains PARTIAL for VPN Gateway/ExpressRoute;2.2.06 unchanged. No exam-readiness or human learning approval.

Scoped update **PR29-P07**, 2026-10-29: 2.2.05, 2.2.06. P07 scoped A–F content coverage for VPN Gateway/ExpressRoute and public/private endpoints composes with P06. Historical PartA evidence/rubrics unchanged; content COMPLETE is not learner mastery, human validation or external Gate7 approval.

Scoped update **PR33-P08**, 2026-10-31: 2.3.01, 2.3.04. Only two scoped Storage rows re-reviewed A–F: service/data contracts, current account/media/protocol compatibility, independent decision/reason contexts and original feedback. P09/P16 and55 other rows unchanged. No historical learner upgrade or human approval.

Scoped update **PR34-P09**, 2026-10-31: 2.3.02, 2.3.03. Only two P09 rows re-reviewed A–F: access/relative-cost/lifecycle and physical replication/secondary/recovery mechanisms, original paired independent contexts and current sources. P08/P16 and55 other objective rows preserved. Human validation unperformed; authored content is not learner mastery.

## Metode og terskel

Alle **57 offisielle kulepunkter** er egne rader, fordelt på 11 underområder. Sammensatte krav er dessuten delt i 126 navngitte kontrollfasetter. Fasettene er en lokal auditinndeling, ikke Microsofts spørsmålstall eller en ekstra eksamensvekt. Slot angir rekkefølgen i den daterte studieguideversjonen; stabile `az900.*`-ID-er er audit-/plan-ID-er, foreløpig ikke nye runtime-kompetanser.

| Kriterium | Hva er kontrollert?                                                                      |
| --------- | ---------------------------------------------------------------------------------------- |
| A         | Original, tilgjengelig teori som forklarer målet tilstrekkelig.                          |
| B         | Mekanisme, relasjoner, avhengigheter og viktige grenser.                                 |
| C         | Relevant faktisk aktivitet: konseptmodell, beslutning eller støttet lab.                 |
| D         | Ny-kontekst oppgave uten forhåndsløsning; første forsøk/hjelp må skilles.                |
| E         | Teknisk begrunnelse for riktig svar og plausible feil; bare resultatetikett teller ikke. |
| F         | Fagpåstander sammenholdt med relevante offisielle kilder og datert spor.                 |

**V** = tilstrekkelig dokumentert for dette avgrensede målet; **P** = delvis; **M** = mangler; **U** = uavklart; **N** = ingen implementert fagpåstand å kildegodkjenne. F=V er en kildekontroll utført av implementerende agent, aldri menneskelig SME-godkjenning.

**COMPLETE** krever V i A–F og ingen udekkede fasetter. **PARTIAL** betyr reelt bidrag, men minst ett vesentlig krav mangler. **MISSING** betyr ingen målrettet aktiv dekning; en forutsetning, ikon eller fremtidsplan er ikke dekning. **UNVERIFIED** brukes ved uløst faktisk eierskap/tilgjengelighet/kildetvil. Ingen rader trenger den siste kategorien etter denne gjennomgangen; menneskelig review er likevel ikke utført for noen modul.

D=V betyr at en relevant selvstendig oppgave finnes, ikke at enhver elev har bestått eller at oppgavebanken har psykometrisk gyldighet. Faste og enkle todelte oppgaver begrenser overføringsbevis. Kategoriene gjelder tilgjengelig opplæring, ikke elevscore, offisiell Learn-fullføring eller sannsynlighet for å bestå.

## Målbare resultater per eksamensområde

| Område                                      | Offisiell vekt | Kulepunkter | COMPLETE | PARTIAL | MISSING | UNVERIFIED |
| ------------------------------------------- | -------------- | ----------: | -------: | ------: | ------: | ---------: |
| 1. Describe cloud concepts                  | 25–30%         |          15 |       15 |       0 |       0 |          0 |
| 2. Describe Azure architecture and services | 35–40%         |          27 |       17 |       2 |       8 |          0 |
| 3. Describe Azure management and governance | 30–35%         |          15 |        4 |       7 |       4 |          0 |

Dette er antall auditerte krav, ikke en samlet deknings-/beståttprosent. Offisiell områdevekting kan ikke fordeles likt på kulepunktene eller brukes til å omregne disse tallene til exam readiness.

## Evidence-register

Profilene under gir faktisk kilde/manuskript, mekanisme, tilgjengelig komponent, vurdering og regresjonstester. Hver kravrad presiserer relevant kriterium og hull; en test i en delt profil beviser ikke alle målene i profilen. `nb.ts` inneholder aktive og historiske tekster. De oppgitte v2-/Benefits-/lab-forløpene og det fortsatt tilgjengelige Portal-kompatibilitetsoppdraget teller der de faktisk bidrar. Gamle resultater konverteres ikke til v2-evidens. De 30 profesjonelle kompetansene er grove planområder, ikke 30 implementerte kurs.

### Evidens F

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `foundationsV2:`; [src/content/nb.ts](../src/content/nb.ts) → `foundations:`.
- Mekanisme: [src/domain/curriculum/foundations-v2.ts](../src/domain/curriculum/foundations-v2.ts) → `v2Bindings`; [src/domain/curriculum/foundations.ts](../src/domain/curriculum/foundations.ts) → `transferCriteria`.
- Lærerflate: [src/features/learning/foundations-v2.tsx](../src/features/learning/foundations-v2.tsx) → `FoundationsV2`.
- Vurdering: [src/domain/curriculum/foundations-v2.ts](../src/domain/curriculum/foundations-v2.ts) → `v2Criteria`.
- Tester: [src/domain/curriculum/foundations-v2.test.ts](../src/domain/curriculum/foundations-v2.test.ts), [tests/e2e/foundations-v2.spec.ts](../tests/e2e/foundations-v2.spec.ts).
- Grense: Current v2; no inherited v1 evidence. Row names exact relevant criteria. Fixed task set, no unseen item families.

### Evidens R

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `responsibility:`.
- Mekanisme: [src/domain/curriculum/responsibility.ts](../src/domain/curriculum/responsibility.ts) → `responsibility`.
- Lærerflate: [src/features/portal/responsibility.tsx](../src/features/portal/responsibility.tsx) → `Responsibility`.
- Vurdering: [src/domain/curriculum/expansion.ts](../src/domain/curriculum/expansion.ts) → `services:`; [src/domain/sandbox/practical.ts](../src/domain/sandbox/practical.ts) → `evaluatePractical`.
- Tester: [src/domain/curriculum/responsibility.test.ts](../src/domain/curriculum/responsibility.test.ts), [src/domain/curriculum/expansion.test.ts](../src/domain/curriculum/expansion.test.ts), [src/domain/sandbox/practical.test.ts](../src/domain/sandbox/practical.test.ts).
- Grense: Selected VM/App Service/fictional SaaS examples, not identical assignments for every cloud service.

### Evidens BA

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `availability:`.
- Mekanisme: [src/domain/curriculum/expansion-models.ts](../src/domain/curriculum/expansion-models.ts) → `availability:`.
- Lærerflate: [src/features/learning/expanded-module.tsx](../src/features/learning/expanded-module.tsx) → `Experiment`.
- Vurdering: [src/domain/curriculum/expansion.ts](../src/domain/curriculum/expansion.ts) → `unmet:`.
- Tester: [src/domain/curriculum/expansion.test.ts](../src/domain/curriculum/expansion.test.ts), [tests/e2e/curriculum-expansion.spec.ts](../tests/e2e/curriculum-expansion.spec.ts).
- Grense: Synthetic capacity/fault/routing, not Azure SLA or deployed availability.

### Evidens BR

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `reliability:`.
- Mekanisme: [src/domain/curriculum/expansion-models.ts](../src/domain/curriculum/expansion-models.ts) → `reliability:`.
- Lærerflate: [src/features/learning/expanded-module.tsx](../src/features/learning/expanded-module.tsx) → `Experiment`.
- Vurdering: [src/domain/curriculum/expansion.ts](../src/domain/curriculum/expansion.ts) → `dependency:`.
- Tester: [src/domain/curriculum/expansion.test.ts](../src/domain/curriculum/expansion.test.ts), [tests/e2e/curriculum-expansion.spec.ts](../tests/e2e/curriculum-expansion.spec.ts).
- Grense: Dependency and forecast demonstrations; independent prompt partly reveals diagnosis.

### Evidens BG

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `governance:`.
- Mekanisme: [src/domain/curriculum/expansion-models.ts](../src/domain/curriculum/expansion-models.ts) → `governance:`.
- Lærerflate: [src/features/learning/expanded-module.tsx](../src/features/learning/expanded-module.tsx) → `GuidedAnswer`.
- Vurdering: [src/domain/curriculum/expansion.ts](../src/domain/curriculum/expansion.ts) → `policy:`.
- Tester: [src/domain/curriculum/expansion.test.ts](../src/domain/curriculum/expansion.test.ts), [tests/e2e/curriculum-expansion.spec.ts](../tests/e2e/curriculum-expansion.spec.ts).
- Grense: One custom configuration rule; assumed authorization, no full RBAC/security posture engine.

### Evidens BM

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `management:`.
- Mekanisme: [src/domain/curriculum/expansion-models.ts](../src/domain/curriculum/expansion-models.ts) → `management:`.
- Lærerflate: [src/features/learning/expanded-module.tsx](../src/features/learning/expanded-module.tsx) → `Experiment`.
- Vurdering: [src/domain/curriculum/expansion.ts](../src/domain/curriculum/expansion.ts) → `template:`.
- Tester: [src/domain/curriculum/expansion.test.ts](../src/domain/curriculum/expansion.test.ts), [tests/e2e/curriculum-expansion.spec.ts](../tests/e2e/curriculum-expansion.spec.ts).
- Grense: Three-field declarative comparison; not a Bicep/ARM/CLI execution environment.

### Evidens S

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `services:`.
- Mekanisme: [src/domain/curriculum/expansion-models.ts](../src/domain/curriculum/expansion-models.ts) → `selection:`.
- Lærerflate: [src/features/learning/expanded-module.tsx](../src/features/learning/expanded-module.tsx) → `ExpandedAssessment`.
- Vurdering: [src/domain/curriculum/expansion.ts](../src/domain/curriculum/expansion.ts) → `assess`; [src/domain/sandbox/practical.ts](../src/domain/sandbox/practical.ts) → `evaluatePractical`.
- Tester: [src/domain/curriculum/expansion.test.ts](../src/domain/curriculum/expansion.test.ts), [src/domain/sandbox/practical.test.ts](../src/domain/sandbox/practical.test.ts), [tests/e2e/practical-labs.spec.ts](../tests/e2e/practical-labs.spec.ts).
- Grense: Current service-types v2; old v1 questions do not automatically satisfy its evidence.

### Evidens H

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `scopeCopy`; [src/content/nb.ts](../src/content/nb.ts) → `graph:`.
- Mekanisme: [src/domain/portal/model.ts](../src/domain/portal/model.ts) → `resource`.
- Lærerflate: [src/features/portal/architecture.tsx](../src/features/portal/architecture.tsx) → `Architecture`; [src/features/portal/infrastructure-details.tsx](../src/features/portal/infrastructure-details.tsx) → `Resource`.
- Vurdering: [src/domain/sandbox/practical.ts](../src/domain/sandbox/practical.ts) → `evaluatePractical`.
- Tester: [src/domain/portal/portal.test.ts](../src/domain/portal/portal.test.ts), [src/domain/sandbox/practical.test.ts](../src/domain/sandbox/practical.test.ts), [tests/e2e/portal-fidelity.spec.ts](../tests/e2e/portal-fidelity.spec.ts).
- Grense: Live graph/inspection and valid operations; no independent hierarchy/lifecycle explanation rubric.

### Evidens V

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `labsNb`; [src/content/nb.ts](../src/content/nb.ts) → `iaas:`.
- Mekanisme: [src/domain/sandbox/model.ts](../src/domain/sandbox/model.ts) → `CreateVmBundle`.
- Lærerflate: [src/features/portal/vm-form.tsx](../src/features/portal/vm-form.tsx) → `Vm`; [src/features/portal/infrastructure-details.tsx](../src/features/portal/infrastructure-details.tsx) → `Resource`.
- Vurdering: [src/domain/sandbox/practical.ts](../src/domain/sandbox/practical.ts) → `evaluatePractical`.
- Tester: [src/domain/sandbox/sandbox.test.ts](../src/domain/sandbox/sandbox.test.ts), [src/domain/sandbox/practical.test.ts](../src/domain/sandbox/practical.test.ts), [tests/e2e/practical-labs.spec.ts](../tests/e2e/practical-labs.spec.ts).
- Grense: Atomic bounded bundle and disk/NIC/VNet/subnet relations, no VMSS/AVD/guest OS/traffic.

### Evidens P

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `paas:`; [src/content/nb.ts](../src/content/nb.ts) → `practice:`.
- Mekanisme: [src/domain/sandbox/model.ts](../src/domain/sandbox/model.ts) → `CreateWebApp`.
- Lærerflate: [src/features/portal/create-resource.tsx](../src/features/portal/create-resource.tsx) → `Create`; [src/features/portal/app-settings.tsx](../src/features/portal/app-settings.tsx) → `App`.
- Vurdering: [src/domain/sandbox/practical.ts](../src/domain/sandbox/practical.ts) → `evaluatePractical`.
- Tester: [src/domain/sandbox/sandbox.test.ts](../src/domain/sandbox/sandbox.test.ts), [src/domain/sandbox/practical.test.ts](../src/domain/sandbox/practical.test.ts), [tests/e2e/practical-labs.spec.ts](../tests/e2e/practical-labs.spec.ts).
- Grense: Supported Linux plan/app and allowlisted settings; no real hosting/deploy/availability/cost.

### Evidens PORTAL

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `portal:`.
- Mekanisme: [src/domain/portal/model.ts](../src/domain/portal/model.ts) → `parse`.
- Lærerflate: [src/features/portal/portal.tsx](../src/features/portal/portal.tsx) → `Portal`.
- Vurdering: [src/domain/sandbox/practical.ts](../src/domain/sandbox/practical.ts) → `evaluatePractical`.
- Tester: [tests/e2e/portal.spec.ts](../tests/e2e/portal.spec.ts), [tests/e2e/portal-fidelity.spec.ts](../tests/e2e/portal-fidelity.spec.ts), [tests/e2e/practical-labs.spec.ts](../tests/e2e/practical-labs.spec.ts).
- Grense: Authentic local workflows are application evidence, not by themselves complete instruction on management tools.

### Evidens L

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `challenge:`.
- Mekanisme: [src/domain/portal/learning.ts](../src/domain/portal/learning.ts) → `evaluateSubmission`.
- Lærerflate: [src/features/portal/learning.tsx](../src/features/portal/learning.tsx) → `IndependentChallenge`; [src/features/portal/portal.tsx](../src/features/portal/portal.tsx) → `navigate('challenge'`.
- Vurdering: [src/domain/portal/learning.ts](../src/domain/portal/learning.ts) → `ready: a.readyModel === 'saas'`; [src/domain/portal/learning.ts](../src/domain/portal/learning.ts) → `scope:`.
- Tester: [src/domain/portal/portal.test.ts](../src/domain/portal/portal.test.ts), [tests/e2e/portal.spec.ts](../tests/e2e/portal.spec.ts).
- Grense: Still reachable Portal independent compatibility task, not an inaccessible archive. Narrow fixed model-choice/scope predicates and per-criterion feedback; frozen v1 observations do not upgrade current v2 evidence.

### Evidens SL

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `serverlessNb`; [docs/SERVERLESS_FOUNDATIONS.md](../docs/SERVERLESS_FOUNDATIONS.md) → `Complete original teaching manuscript`.
- Mekanisme: [src/domain/curriculum/serverless.ts](../src/domain/curriculum/serverless.ts) → `executeEvents`.
- Lærerflate: [src/features/learning/serverless.tsx](../src/features/learning/serverless.tsx) → `ExecutionTrace`.
- Vurdering: [src/domain/curriculum/serverless.ts](../src/domain/curriculum/serverless.ts) → `serverlessCriteria`.
- Tester: [src/domain/curriculum/serverless.test.ts](../src/domain/curriculum/serverless.test.ts), [tests/e2e/serverless.spec.ts](../tests/e2e/serverless.spec.ts).
- Grense: Concept model, no Functions runtime/resources/prices; two fixed original scenarios, no general mastery or human SME/transfer approval.

### Evidens PA

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `architectureNb`; [docs/CORE_ARCHITECTURE_PHYSICAL.md](../docs/CORE_ARCHITECTURE_PHYSICAL.md) → `Original teaching manuscript`.
- Mekanisme: [src/domain/curriculum/architecture-physical.ts](../src/domain/curriculum/architecture-physical.ts) → `evaluateInfrastructure`.
- Lærerflate: [src/features/learning/physical.tsx](../src/features/learning/physical.tsx) → `PhysicalExplorer`; [src/features/learning/physical-visual.tsx](../src/features/learning/physical-visual.tsx) → `InfrastructureScene`.
- Vurdering: [src/domain/curriculum/architecture-physical.ts](../src/domain/curriculum/architecture-physical.ts) → `physicalCriteria`.
- Tester: [src/domain/curriculum/architecture-physical.test.ts](../src/domain/curriculum/architecture-physical.test.ts), [tests/e2e/architecture-physical.spec.ts](../tests/e2e/architecture-physical.spec.ts).
- Grense: Concept model, dated5-region subset, fictional facilities, explicit copies/routing and unknown placement. No Portal/resource/runtime/failover/SLA claim. Fixed original cases, no human SME/UX/transfer approval. Full Core Architecture remains partial pending Part B.

### Evidens PB

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `managementNb`; [docs/CORE_ARCHITECTURE_MANAGEMENT.md](../docs/CORE_ARCHITECTURE_MANAGEMENT.md) → `Original teaching manuscript`.
- Mekanisme: [src/domain/curriculum/architecture-management.ts](../src/domain/curriculum/architecture-management.ts) → `evaluateScope`; [src/domain/curriculum/architecture-management.ts](../src/domain/curriculum/architecture-management.ts) → `managementHierarchy`.
- Lærerflate: [src/features/learning/management.tsx](../src/features/learning/management.tsx) → `HierarchyExplorer`.
- Vurdering: [src/domain/curriculum/architecture-management.ts](../src/domain/curriculum/architecture-management.ts) → `managementCriteria`.
- Tester: [src/domain/curriculum/architecture-management.test.ts](../src/domain/curriculum/architecture-management.test.ts), [tests/e2e/architecture-management.spec.ts](../tests/e2e/architecture-management.spec.ts).
- Grense: Actual replayed inventory read-only, pure separate counterfactual rules, fixed original changed-context tasks and reason feedback. No generic policy/RBAC/MG operation, human SME/UX/learning approval or historical evidence conversion.

### Evidens TR

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `transferNb`.
- Mekanisme: [src/domain/curriculum/transfer.ts](../src/domain/curriculum/transfer.ts) → `transferItems`.
- Lærerflate: [src/features/learning/cloud-transfer.tsx](../src/features/learning/cloud-transfer.tsx) → `TransferAssessment`.
- Vurdering: [src/domain/curriculum/transfer.ts](../src/domain/curriculum/transfer.ts) → `evaluateTransfer`.
- Tester: [src/domain/curriculum/transfer.test.ts](../src/domain/curriculum/transfer.test.ts), [tests/e2e/cloud-transfer.spec.ts](../tests/e2e/cloud-transfer.spec.ts).
- Grense: Independent original decision/reason pairs; versioned new evidence. Human validation unperformed. Old teaching/theory profiles retained.

### Evidens CO

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `costNb`.
- Mekanisme: [src/domain/curriculum/cost-model.ts](../src/domain/curriculum/cost-model.ts) → `estimateCost`; [src/domain/curriculum/cost.ts](../src/domain/curriculum/cost.ts) → `guidedCostFacts`.
- Lærerflate: [src/features/learning/cost-workbench.tsx](../src/features/learning/cost-workbench.tsx) → `CostWorkbench`; [src/features/learning/cost.tsx](../src/features/learning/cost.tsx) → `CostLesson`.
- Vurdering: [src/domain/curriculum/cost.ts](../src/domain/curriculum/cost.ts) → `evaluateCostAttempt`; [src/features/learning/cost-assessment.tsx](../src/features/learning/cost-assessment.tsx) → `CostAssessment`.
- Tester: [src/domain/curriculum/cost.test.ts](../src/domain/curriculum/cost.test.ts), [tests/e2e/cost-management.spec.ts](../tests/e2e/cost-management.spec.ts).
- Grense: Original synthetic economic model, four guided investigations and ten independent structured decision/reason cases. No real costs/invoices, operative budgets/tags, XP, prior evidence upgrade, exam readiness or human approval.

### Evidens CP

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `computeNb`.
- Mekanisme: [src/domain/curriculum/compute-model.ts](../src/domain/curriculum/compute-model.ts) → `runCapacity`; [src/domain/curriculum/compute-vm.ts](../src/domain/curriculum/compute-vm.ts) → `computeVmFacts`.
- Lærerflate: [src/features/learning/compute.tsx](../src/features/learning/compute.tsx) → `ComputeLesson`; [src/features/learning/compute-visuals.tsx](../src/features/learning/compute-visuals.tsx) → `ComputeModelResult`.
- Vurdering: [src/domain/curriculum/compute-items.ts](../src/domain/curriculum/compute-items.ts) → `evaluateCompute`; [src/features/learning/compute-assessment.tsx](../src/features/learning/compute-assessment.tsx) → `ComputeAssessment`.
- Tester: [src/domain/curriculum/compute.test.ts](../src/domain/curriculum/compute.test.ts), [tests/e2e/compute-hosting.spec.ts](../tests/e2e/compute-hosting.spec.ts).
- Grense: Original scoped theory, four guides and14 separate-context cases; no runtime, XP/evidence migration, psychometric readiness or human approval. ACI source-access limitation documented with available official alternatives.

### Evidens NP

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `networkingNb`.
- Mekanisme: [src/domain/curriculum/networking-model.ts](../src/domain/curriculum/networking-model.ts) → `runPeering`; [src/domain/curriculum/networking-inspection.ts](../src/domain/curriculum/networking-inspection.ts) → `networkingInspection`.
- Lærerflate: [src/features/learning/networking.tsx](../src/features/learning/networking.tsx) → `NetworkingLesson`; [src/features/learning/networking-visuals.tsx](../src/features/learning/networking-visuals.tsx) → `NetworkingModelResult`.
- Vurdering: [src/domain/curriculum/networking-items.ts](../src/domain/curriculum/networking-items.ts) → `evaluateNetworking`; [src/features/learning/networking-assessment.tsx](../src/features/learning/networking-assessment.tsx) → `NetworkingAssessment`.
- Tester: [src/domain/curriculum/networking.test.ts](../src/domain/curriculum/networking.test.ts), [tests/e2e/networking-foundations.spec.ts](../tests/e2e/networking-foundations.spec.ts).
- Grense: P06 four named facets only. Separate guided/first/help/retry/abandon, frozen operational inventory and own durable store. No networking traffic, full composite completion/readiness or human approval.

### Evidens NC

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `connectivityNb`.
- Mekanisme: [src/domain/curriculum/connectivity-model.ts](../src/domain/curriculum/connectivity-model.ts) → `runHybrid`; [src/domain/curriculum/connectivity.ts](../src/domain/curriculum/connectivity.ts) → `connectivityManifest`.
- Lærerflate: [src/features/learning/connectivity.tsx](../src/features/learning/connectivity.tsx) → `ConnectivityLesson`; [src/features/learning/connectivity-visuals.tsx](../src/features/learning/connectivity-visuals.tsx) → `ConnectivityModelResult`.
- Vurdering: [src/domain/curriculum/connectivity-items.ts](../src/domain/curriculum/connectivity-items.ts) → `evaluateConnectivity`; [src/features/learning/connectivity-assessment.tsx](../src/features/learning/connectivity-assessment.tsx) → `ConnectivityAssessment`.
- Tester: [src/domain/curriculum/connectivity.test.ts](../src/domain/curriculum/connectivity.test.ts), [tests/e2e/networking-connectivity.spec.ts](../tests/e2e/networking-connectivity.spec.ts).
- Grense: P07 scoped authored coverage only. Separate first/help/retry/abandon and private transport/encryption/DNS/path/auth layers. No old evidence upgrade, actual cloud execution, readiness or human learning approval.

### Evidens ST

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `storageNb`.
- Mekanisme: [src/domain/curriculum/storage-model.ts](../src/domain/curriculum/storage-model.ts) → `runAccounts`; [src/domain/curriculum/storage.ts](../src/domain/curriculum/storage.ts) → `storageManifest`.
- Lærerflate: [src/features/learning/storage.tsx](../src/features/learning/storage.tsx) → `StorageLesson`; [src/features/learning/storage-visuals.tsx](../src/features/learning/storage-visuals.tsx) → `StorageModelResult`.
- Vurdering: [src/domain/curriculum/storage-items.ts](../src/domain/curriculum/storage-items.ts) → `evaluateStorage`; [src/features/learning/storage-assessment.tsx](../src/features/learning/storage-assessment.tsx) → `StorageAssessment`.
- Tester: [src/domain/curriculum/storage.test.ts](../src/domain/curriculum/storage.test.ts), [tests/e2e/storage-services.spec.ts](../tests/e2e/storage-services.spec.ts).
- Grense: P08 authored content coverage, not learner mastery/human acceptance. Separate1.0.0 history; no Storage runtime/receipts/XP. Newer Files account/media/management qualifications applied; P09/P16 unchanged.

### Evidens SR

- Manuskript: [src/content/nb.ts](../src/content/nb.ts) → `storageResilienceNb`.
- Mekanisme: [src/domain/curriculum/storage-resilience-model.ts](../src/domain/curriculum/storage-resilience-model.ts) → `runTiers`; [src/domain/curriculum/storage-resilience.ts](../src/domain/curriculum/storage-resilience.ts) → `resilienceManifest`.
- Lærerflate: [src/features/learning/storage-resilience.tsx](../src/features/learning/storage-resilience.tsx) → `ResilienceLesson`; [src/features/learning/storage-resilience-visuals.tsx](../src/features/learning/storage-resilience-visuals.tsx) → `ResilienceModelResult`.
- Vurdering: [src/domain/curriculum/storage-resilience-items.ts](../src/domain/curriculum/storage-resilience-items.ts) → `evaluateResilience`; [src/features/learning/storage-resilience-assessment.tsx](../src/features/learning/storage-resilience-assessment.tsx) → `ResilienceAssessment`.
- Tester: [src/domain/curriculum/storage-resilience.test.ts](../src/domain/curriculum/storage-resilience.test.ts), [tests/e2e/storage-resilience.spec.ts](../tests/e2e/storage-resilience.spec.ts).
- Grense: P09 scoped authored A–F only, not mastery/exam readiness/human efficacy. Two causal models/missions, original paired transfer, independent1.0.0 history. No Azure runtime/price/RPO/failover/XP. P08/P16 unchanged.

## 1.1 Cloud computing

| Slot / stabil audit-ID                 | Krav (kort temaetikett)                    | Status   | A B C D E F | Eksisterende lokale mål     | Evidens | Neste PR |
| -------------------------------------- | ------------------------------------------ | -------- | ----------- | --------------------------- | ------- | -------- |
| 1.1.01<br>`az900.cloud.definition`     | Hva cloud computing innebærer              | COMPLETE | V V V V V V | FC01, FC02, F01             | F       | P17, P18 |
| 1.1.02<br>`az900.cloud.responsibility` | Delt operasjonelt ansvar                   | COMPLETE | V V V V V V | FC03, ST01, ST02, ST03, F01 | F, R, S | P17, P18 |
| 1.1.03<br>`az900.cloud.models`         | Public, private og hybrid cloud            | COMPLETE | V V V V V V | FC04, F01                   | F, TR   | P03      |
| 1.1.04<br>`az900.cloud.model-use`      | Bruksområder for hver deployment model     | COMPLETE | V V V V V V | FC05, F01                   | F, TR   | P03      |
| 1.1.05<br>`az900.cloud.consumption`    | Forbruk, allokering og måling              | COMPLETE | V V V V V V | FC06, F03                   | F       | P17, P18 |
| 1.1.06<br>`az900.cloud.pricing`        | PAYG, forpliktelser og avbrytbar kapasitet | COMPLETE | V V V V V V | FC07, F03                   | F, TR   | P03, P04 |
| 1.1.07<br>`az900.cloud.serverless`     | Serverless                                 | COMPLETE | V V V V V V | FC08, C04, F01              | SL      | P00, P05 |

### 1.1.01 — Hva cloud computing innebærer

**Fasetter:** Hva cloud computing innebærer: COMPLETE.

**Faktisk funn:** Browser/server, fysisk kapasitet, virtualisering og provisioning før cloud-begrepet; kontrollerte undersøkelser. V2 service-kriteriet skiller bestilt kapasitet fra bare internett eller fravær av maskinvare.

**Rest / beslutning:** Ingen identifisert A–F-mangel på dette avgrensede AZ-900-nivået. Fast oppgavesett og menneskelig validering er fortsatt begrensninger.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.1.02 — Delt operasjonelt ansvar

**Fasetter:** Delt operasjonelt ansvar: COMPLETE.

**Faktisk funn:** Ni inspiserbare lag og tjenestespesifikke forbehold; duties, patch, runtime og departure samt nye VM/PaaS/SaaS-oppgaver skiller kundeoppgaver fra plattformdrift. Riktig og feil begrunnes.

**Rest / beslutning:** Ingen identifisert A–F-mangel på dette avgrensede AZ-900-nivået. Fast oppgavesett og menneskelig validering er fortsatt begrensninger.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/), [SR](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility), [IAAS](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/2-describe-infrastructure-service), [PAAS](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/3-describe-platform-service), [SAAS](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/4-describe-software-service). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.1.03 — Public, private og hybrid cloud

**Fasetter:** Public: COMPLETE; Private: COMPLETE; Hybrid: COMPLETE.

**Faktisk funn:** Modell/manuskript, valg og sammenkobling; uavhengig exclusive og integration gjelder private/hybrid. P03: nye strukturelt forskjellige beslutning/begrunnelse-scenarioer, spesifikk feedback for alle alternativer, presis repetisjon og isolert v1-evidence.

**Rest / beslutning:** Ingen dokumentert scoped A–F-innholdsmangel etter P03: tidligere teori/modeller beholdt, nye beslutning/begrunnelse-familier med minst to ulike kontekster, feedback og kilder. Menneskelig SME, vanskelighetsgrad og læringsoverføring er fortsatt utestående og er ikke eksamensberedskap.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/), [TR01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [TR02](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/5-define-cloud-models). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.1.04 — Bruksområder for hver deployment model

**Fasetter:** Public-bruk: COMPLETE; Private-bruk: COMPLETE; Hybrid-bruk: COMPLETE.

**Faktisk funn:** Tre guidede plasseringstilfeller; endret oppgave vurderer privat eksklusivitet og reell hybridintegrasjon. P03: nye strukturelt forskjellige beslutning/begrunnelse-scenarioer, spesifikk feedback for alle alternativer, presis repetisjon og isolert v1-evidence.

**Rest / beslutning:** Ingen dokumentert scoped A–F-innholdsmangel etter P03: tidligere teori/modeller beholdt, nye beslutning/begrunnelse-familier med minst to ulike kontekster, feedback og kilder. Menneskelig SME, vanskelighetsgrad og læringsoverføring er fortsatt utestående og er ikke eksamensberedskap.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/), [TR01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [TR02](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/5-define-cloud-models). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.1.05 — Forbruk, allokering og måling

**Fasetter:** Forbruk, allokering og måling: COMPLETE.

**Faktisk funn:** Tids-/kapasitetsmodell viser allokert tomgang, frigjøring og gjenværende kostnadstyper. Endret idle-kriterium krever allokert forbruk også uten trafikk; avviser trafikk-only.

**Rest / beslutning:** Ingen identifisert A–F-mangel på dette avgrensede AZ-900-nivået. Fast oppgavesett og menneskelig validering er fortsatt begrensninger.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/), [RES](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations), [SAV](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.1.06 — PAYG, forpliktelser og avbrytbar kapasitet

**Fasetter:** PAYG: COMPLETE; Reservation/savings commitment: COMPLETE; Spot: COMPLETE.

**Faktisk funn:** Original prismodell med eksplisitte undervisningstall; uncertain og commitment vurderer variabel bruk og ubrukt forpliktelse. P03: nye strukturelt forskjellige beslutning/begrunnelse-scenarioer, spesifikk feedback for alle alternativer, presis repetisjon og isolert v1-evidence.

**Rest / beslutning:** Ingen dokumentert scoped A–F-innholdsmangel etter P03: tidligere teori/modeller beholdt, nye beslutning/begrunnelse-familier med minst to ulike kontekster, feedback og kilder. Menneskelig SME, vanskelighetsgrad og læringsoverføring er fortsatt utestående og er ikke eksamensberedskap.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/), [RES](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations), [SAV](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview), [TR03](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/6-describe-consumption-based-model), [TR10](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations), [TR11](https://learn.microsoft.com/en-us/azure/virtual-machines/spot-vms), [TR12](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.1.07 — Serverless

**Fasetter:** Hendelser/utførelse: COMPLETE; Operasjonelt ansvar: COMPLETE; Hostingavhengig forbruk og skalering: COMPLETE.

**Faktisk funn:** P00: original theory and hosting boundaries, event→trigger→execution→output model with prediction, responsibility and two new decision scenarios with reasons and alternative feedback. Isolated replayed supplement; first/help/retry/abandon preserved.

**Rest / beslutning:** A–F documented for this scoped objective; qualified human SME, screen-reader, novice/IT usability and measured transfer remain unperformed. No claim that one learner or AZ-900 is mastered.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/), [FUNC](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview), [SL-FUNCTIONS](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview), [SL-HOSTING](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale), [SL-BINDINGS](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings), [SL-FLEX](https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan), [SL-RESPONSIBILITY](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 1.2 Benefits

| Slot / stabil audit-ID                                | Krav (kort temaetikett)                 | Status   | A B C D E F | Eksisterende lokale mål | Evidens | Neste PR      |
| ----------------------------------------------------- | --------------------------------------- | -------- | ----------- | ----------------------- | ------- | ------------- |
| 1.2.01<br>`az900.benefits.availability-scale`         | Tilgjengelighet og skalering            | COMPLETE | V V V V V V | CB01, F02, F03          | BA, TR  | P03, P01      |
| 1.2.02<br>`az900.benefits.reliability-predictability` | Pålitelighet og forutsigbarhet          | COMPLETE | V V V V V V | CB02, F02, F03          | BR, TR  | P03, P14      |
| 1.2.03<br>`az900.benefits.security-governance`        | Sikkerhet og styring som cloud-fordeler | COMPLETE | V V V V V V | CB03, G03, I01          | BG, TR  | P03, P11, P12 |
| 1.2.04<br>`az900.benefits.manageability`              | Administrasjon av og i cloud            | COMPLETE | V V V V V V | CB04, A01               | BM, TR  | P03, P13      |

### 1.2.01 — Tilgjengelighet og skalering

**Fasetter:** High availability: COMPLETE; Vertical/horizontal scaling: COMPLETE.

**Faktisk funn:** Kapasitet, feil og ruting kan endres før observasjon; unmet vurderer et nytt numerisk bortfall. P03: nye strukturelt forskjellige beslutning/begrunnelse-scenarioer, spesifikk feedback for alle alternativer, presis repetisjon og isolert v1-evidence.

**Rest / beslutning:** Ingen dokumentert scoped A–F-innholdsmangel etter P03: tidligere teori/modeller beholdt, nye beslutning/begrunnelse-familier med minst to ulike kontekster, feedback og kilder. Menneskelig SME, vanskelighetsgrad og læringsoverføring er fortsatt utestående og er ikke eksamensberedskap.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M02](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/), [TR04](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/2-high-availability-scalability-cloud), [TR13](https://learn.microsoft.com/en-us/azure/well-architected/reliability/failure-mode-analysis). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.2.02 — Pålitelighet og forutsigbarhet

**Fasetter:** Reliability: COMPLETE; Predictability: COMPLETE.

**Faktisk funn:** Avhengighetsfeil og målt trend forklares; dependency/forecast evalueres separat. P03: nye strukturelt forskjellige beslutning/begrunnelse-scenarioer, spesifikk feedback for alle alternativer, presis repetisjon og isolert v1-evidence.

**Rest / beslutning:** Ingen dokumentert scoped A–F-innholdsmangel etter P03: tidligere teori/modeller beholdt, nye beslutning/begrunnelse-familier med minst to ulike kontekster, feedback og kilder. Menneskelig SME, vanskelighetsgrad og læringsoverføring er fortsatt utestående og er ikke eksamensberedskap.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M02](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/), [TR05](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/3-reliability-predictability-cloud), [TR13](https://learn.microsoft.com/en-us/azure/well-architected/reliability/failure-mode-analysis). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.2.03 — Sikkerhet og styring som cloud-fordeler

**Fasetter:** Security benefit: COMPLETE; Governance benefit: COMPLETE.

**Faktisk funn:** Kundeansvar, least privilege, rolle/scope og custom location-deny; policy-spørsmålet avviser at én regel beviser alt. P03: nye strukturelt forskjellige beslutning/begrunnelse-scenarioer, spesifikk feedback for alle alternativer, presis repetisjon og isolert v1-evidence.

**Rest / beslutning:** Ingen dokumentert scoped A–F-innholdsmangel etter P03: tidligere teori/modeller beholdt, nye beslutning/begrunnelse-familier med minst to ulike kontekster, feedback og kilder. Menneskelig SME, vanskelighetsgrad og læringsoverføring er fortsatt utestående og er ikke eksamensberedskap.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M02](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/), [TR06](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/4-security-governance-cloud), [TR14](https://learn.microsoft.com/en-us/azure/governance/policy/overview), [TR15](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview), [TR16](https://learn.microsoft.com/en-us/entra/fundamentals/identity-fundamental-concepts). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.2.04 — Administrasjon av og i cloud

**Fasetter:** Management of cloud: COMPLETE; Management in cloud: COMPLETE.

**Faktisk funn:** Manuell/repeterbar ønsket konfigurasjon; Portal/CLI/PowerShell/IaC beskrives. P03: nye strukturelt forskjellige beslutning/begrunnelse-scenarioer, spesifikk feedback for alle alternativer, presis repetisjon og isolert v1-evidence.

**Rest / beslutning:** Ingen dokumentert scoped A–F-innholdsmangel etter P03: tidligere teori/modeller beholdt, nye beslutning/begrunnelse-familier med minst to ulike kontekster, feedback og kilder. Menneskelig SME, vanskelighetsgrad og læringsoverføring er fortsatt utestående og er ikke eksamensberedskap.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M02](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/), [TR07](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/5-manageability-cloud), [TR17](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/overview). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 1.3 Service types

| Slot / stabil audit-ID               | Krav (kort temaetikett)                | Status   | A B C D E F | Eksisterende lokale mål | Evidens  | Neste PR |
| ------------------------------------ | -------------------------------------- | -------- | ----------- | ----------------------- | -------- | -------- |
| 1.3.01<br>`az900.services.iaas`      | IaaS og retained gjesteansvar          | COMPLETE | V V V V V V | ST01, C01, C02          | S, V     | P17, P18 |
| 1.3.02<br>`az900.services.paas`      | PaaS og retained applikasjonsansvar    | COMPLETE | V V V V V V | ST02, C01               | S, P     | P17, P18 |
| 1.3.03<br>`az900.services.saas`      | SaaS og retained produktadministrasjon | COMPLETE | V V V V V V | ST03, I01               | S        | P17, P18 |
| 1.3.04<br>`az900.services.use-cases` | Velge IaaS, PaaS eller SaaS fra krav   | COMPLETE | V V V V V V | ST04, F01, R01          | S, L, TR | P03      |

### 1.3.01 — IaaS og retained gjesteansvar

**Fasetter:** IaaS og retained gjesteansvar: COMPLETE.

**Faktisk funn:** Substantielt manuskript og gjestestakk; guest/patch i ny kontekst og Windows VM-bundle med inspektérbare disk/NIC-avhengigheter. Ingen ekte VM kjører.

**Rest / beslutning:** Ingen identifisert A–F-mangel på dette avgrensede AZ-900-nivået. Fast oppgavesett og menneskelig validering er fortsatt begrensninger.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M03](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/), [IAAS](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/2-describe-infrastructure-service), [VM](https://learn.microsoft.com/en-us/azure/virtual-machines/overview), [SR](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.3.02 — PaaS og retained applikasjonsansvar

**Fasetter:** PaaS og retained applikasjonsansvar: COMPLETE.

**Faktisk funn:** Runtime-kompatibilitet og OS-ansvar, plan/app-relasjon og egen kode/data/access. runtime/hosting samt ny plan/app/settings etter uavhengig boundary.

**Rest / beslutning:** Ingen identifisert A–F-mangel på dette avgrensede AZ-900-nivået. Fast oppgavesett og menneskelig validering er fortsatt begrensninger.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M03](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/), [PAAS](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/3-describe-platform-service), [PLAN](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans), [SR](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.3.03 — SaaS og retained produktadministrasjon

**Fasetter:** SaaS og retained produktadministrasjon: COMPLETE.

**Faktisk funn:** Ferdig produkt versus plattform; lisens, rolle, blokkering og data ved avgang er separate handlinger. departure og endret fiktiv admin-oppgave krever faktisk beslutning og begrunnelse.

**Rest / beslutning:** Ingen identifisert A–F-mangel på dette avgrensede AZ-900-nivået. Fast oppgavesett og menneskelig validering er fortsatt begrensninger.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M03](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/), [SAAS](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/4-describe-software-service), [SR](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.3.04 — Velge IaaS, PaaS eller SaaS fra krav

**Fasetter:** IaaS-valg: COMPLETE; PaaS-valg: COMPLETE; SaaS-valg: COMPLETE.

**Faktisk funn:** Krav/tradeoff-modell; architecture+reason godtar begrunnet IaaS eller støttet PaaS. Det fortsatt tilgjengelige Portal-kompatibilitetsoppdraget vurderer også readyModel=saas for ferdig samarbeid; dette er et eget v1-spor. P03: nye strukturelt forskjellige beslutning/begrunnelse-scenarioer, spesifikk feedback for alle alternativer, presis repetisjon og isolert v1-evidence.

**Rest / beslutning:** Ingen dokumentert scoped A–F-innholdsmangel etter P03: tidligere teori/modeller beholdt, nye beslutning/begrunnelse-familier med minst to ulike kontekster, feedback og kilder. Menneskelig SME, vanskelighetsgrad og læringsoverføring er fortsatt utestående og er ikke eksamensberedskap.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M03](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/), [TR08](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/2-describe-infrastructure-service), [TR09](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/3-describe-platform-service), [TR18](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/4-describe-software-service). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 2.1 Core architectural components

| Slot / stabil audit-ID                           | Krav (kort temaetikett)                    | Status   | A B C D E F | Eksisterende lokale mål | Evidens     | Neste PR |
| ------------------------------------------------ | ------------------------------------------ | -------- | ----------- | ----------------------- | ----------- | -------- |
| 2.1.01<br>`az900.architecture.regions`           | Regions, region pairs og sovereign regions | COMPLETE | V V V V V V | F02, CA01               | H, P, V, PA | P01      |
| 2.1.02<br>`az900.architecture.zones`             | Availability zones                         | COMPLETE | V V V V V V | F02, CA02               | PA          | P01      |
| 2.1.03<br>`az900.architecture.datacenters`       | Azure datacenters                          | COMPLETE | V V V V V V | F02, CA03               | PA          | P01      |
| 2.1.04<br>`az900.architecture.resources-groups`  | Resources og resource groups               | COMPLETE | V V V V V V | G01, G04, CA04          | H, P, L, PB | P02      |
| 2.1.05<br>`az900.architecture.subscriptions`     | Subscriptions                              | COMPLETE | V V V V V V | G01, G04, CA05          | H, L, PB    | P02      |
| 2.1.06<br>`az900.architecture.management-groups` | Management groups                          | COMPLETE | V V V V V V | G01, G04, CA06          | H, PB       | P02      |
| 2.1.07<br>`az900.architecture.hierarchy`         | Hierarki og relasjonstyper                 | COMPLETE | V V V V V V | G01, G02, CA07          | H, L, PB    | P02      |

### 2.1.01 — Regions, region pairs og sovereign regions

**Fasetter:** Regions/resource location: COMPLETE; Region pairs: COMPLETE; Sovereign regions: COMPLETE.

**Faktisk funn:** P01 Part A: original complete teaching, causal physical/dependency explorer, original changed scenarios with reasons/matching, committed alternative feedback and current official source qualification.

**Rest / beslutning:** Scoped A-F content coverage implemented; qualified human SME/UX/learning validation and broad transfer remain unperformed. No full-core completion or higher-level evidence. Part B remains unavailable.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M04](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [REG](https://learn.microsoft.com/en-us/azure/reliability/regions-overview), [PAIR](https://learn.microsoft.com/en-us/azure/reliability/regions-paired), [AR01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [AR02](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [AR03](https://learn.microsoft.com/en-us/azure/reliability/regions-overview), [AR04](https://learn.microsoft.com/en-us/azure/reliability/regions-list), [AR05](https://learn.microsoft.com/en-us/azure/reliability/regions-paired), [AR06](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview), [AR07](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-zonal-resource-resiliency), [AR08](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-service-support), [AR09](https://learn.microsoft.com/en-us/azure/security/fundamentals/physical-security), [AR10](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-setup-guide/regions), [AR11](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-welcome), [AR12](https://learn.microsoft.com/en-us/azure/china/overview-operations), [AR13](https://learn.microsoft.com/en-us/azure/reliability/concept-reliability-sovereignty), [AR14](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.1.02 — Availability zones

**Fasetter:** Fysisk feilgrense: COMPLETE; Zone-støtte og ressursvalg: COMPLETE.

**Faktisk funn:** P01 Part A: original complete teaching, causal physical/dependency explorer, original changed scenarios with reasons/matching, committed alternative feedback and current official source qualification.

**Rest / beslutning:** Scoped A-F content coverage implemented; qualified human SME/UX/learning validation and broad transfer remain unperformed. No full-core completion or higher-level evidence. Part B remains unavailable.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M04](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [REG](https://learn.microsoft.com/en-us/azure/reliability/regions-overview), [AR01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [AR02](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [AR03](https://learn.microsoft.com/en-us/azure/reliability/regions-overview), [AR04](https://learn.microsoft.com/en-us/azure/reliability/regions-list), [AR05](https://learn.microsoft.com/en-us/azure/reliability/regions-paired), [AR06](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview), [AR07](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-zonal-resource-resiliency), [AR08](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-service-support), [AR09](https://learn.microsoft.com/en-us/azure/security/fundamentals/physical-security), [AR10](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-setup-guide/regions), [AR11](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-welcome), [AR12](https://learn.microsoft.com/en-us/azure/china/overview-operations), [AR13](https://learn.microsoft.com/en-us/azure/reliability/concept-reliability-sovereignty), [AR14](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.1.03 — Azure datacenters

**Fasetter:** Fysisk datasenter: COMPLETE; Relasjon til region og zone: COMPLETE.

**Faktisk funn:** P01 Part A: original complete teaching, causal physical/dependency explorer, original changed scenarios with reasons/matching, committed alternative feedback and current official source qualification.

**Rest / beslutning:** Scoped A-F content coverage implemented; qualified human SME/UX/learning validation and broad transfer remain unperformed. No full-core completion or higher-level evidence. Part B remains unavailable.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M04](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [REG](https://learn.microsoft.com/en-us/azure/reliability/regions-overview), [AR01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [AR02](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [AR03](https://learn.microsoft.com/en-us/azure/reliability/regions-overview), [AR04](https://learn.microsoft.com/en-us/azure/reliability/regions-list), [AR05](https://learn.microsoft.com/en-us/azure/reliability/regions-paired), [AR06](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview), [AR07](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-zonal-resource-resiliency), [AR08](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-service-support), [AR09](https://learn.microsoft.com/en-us/azure/security/fundamentals/physical-security), [AR10](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-setup-guide/regions), [AR11](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-welcome), [AR12](https://learn.microsoft.com/en-us/azure/china/overview-operations), [AR13](https://learn.microsoft.com/en-us/azure/reliability/concept-reliability-sovereignty), [AR14](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.1.04 — Resources og resource groups

**Fasetter:** Resources: COMPLETE; Resource groups/lifecycle: COMPLETE.

**Faktisk funn:** P02 original full theory, actual inventory hierarchy/membership/dependency investigation, explicit scope/type/condition/effect model, four changed independent contexts with reasons and specific alternative feedback; reviewed official qualifications.

**Rest / beslutning:** Scoped A–F implementation pointers; qualified human SME/UX/screen-reader/learning transfer remain unperformed. Fixed tasks are bounded evidence, not exam readiness.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M04](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [ARM](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview), [AM01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [AM02](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [AM03](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview), [AM04](https://learn.microsoft.com/en-us/azure/governance/management-groups/overview), [AM05](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal), [AM06](https://learn.microsoft.com/en-us/azure/governance/policy/overview), [AM07](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview), [AM08](https://learn.microsoft.com/en-us/entra/fundamentals/how-subscriptions-associated-directory), [AM09](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org), [AM10](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/scope), [AM11](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-basics), [AM12](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups), [AM13](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-subscriptions), [AM14](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/view-all-accounts), [AM15](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types), [AM16](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group), [AM17](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane), [AM18](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-create), [AM19](https://learn.microsoft.com/en-us/azure/app-service/app-service-plan-manage). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.1.05 — Subscriptions

**Fasetter:** Subscription boundary/billing: COMPLETE.

**Faktisk funn:** P02 original full theory, actual inventory hierarchy/membership/dependency investigation, explicit scope/type/condition/effect model, four changed independent contexts with reasons and specific alternative feedback; reviewed official qualifications.

**Rest / beslutning:** Scoped A–F implementation pointers; qualified human SME/UX/screen-reader/learning transfer remain unperformed. Fixed tasks are bounded evidence, not exam readiness.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M04](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [ARM](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview), [AM01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [AM02](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [AM03](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview), [AM04](https://learn.microsoft.com/en-us/azure/governance/management-groups/overview), [AM05](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal), [AM06](https://learn.microsoft.com/en-us/azure/governance/policy/overview), [AM07](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview), [AM08](https://learn.microsoft.com/en-us/entra/fundamentals/how-subscriptions-associated-directory), [AM09](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org), [AM10](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/scope), [AM11](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-basics), [AM12](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups), [AM13](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-subscriptions), [AM14](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/view-all-accounts), [AM15](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types), [AM16](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group), [AM17](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.1.06 — Management groups

**Fasetter:** Tenant root/management groups: COMPLETE.

**Faktisk funn:** P02 original full theory, actual inventory hierarchy/membership/dependency investigation, explicit scope/type/condition/effect model, four changed independent contexts with reasons and specific alternative feedback; reviewed official qualifications.

**Rest / beslutning:** Scoped A–F implementation pointers; qualified human SME/UX/screen-reader/learning transfer remain unperformed. Fixed tasks are bounded evidence, not exam readiness.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M04](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [ARM](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview), [AM01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [AM02](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [AM03](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview), [AM04](https://learn.microsoft.com/en-us/azure/governance/management-groups/overview), [AM05](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal), [AM06](https://learn.microsoft.com/en-us/azure/governance/policy/overview), [AM07](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview), [AM08](https://learn.microsoft.com/en-us/entra/fundamentals/how-subscriptions-associated-directory), [AM09](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org), [AM10](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/scope), [AM11](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-basics), [AM12](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups), [AM13](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-subscriptions), [AM14](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/view-all-accounts), [AM15](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types), [AM16](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group), [AM17](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.1.07 — Hierarki og relasjonstyper

**Fasetter:** MG/subscription/RG hierarchy: COMPLETE; Membership versus hosting/location: COMPLETE.

**Faktisk funn:** P02 original full theory, actual inventory hierarchy/membership/dependency investigation, explicit scope/type/condition/effect model, four changed independent contexts with reasons and specific alternative feedback; reviewed official qualifications.

**Rest / beslutning:** Scoped A–F implementation pointers; qualified human SME/UX/screen-reader/learning transfer remain unperformed. Fixed tasks are bounded evidence, not exam readiness.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M04](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [ARM](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview), [AM01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [AM02](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/), [AM03](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview), [AM04](https://learn.microsoft.com/en-us/azure/governance/management-groups/overview), [AM05](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal), [AM06](https://learn.microsoft.com/en-us/azure/governance/policy/overview), [AM07](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview), [AM08](https://learn.microsoft.com/en-us/entra/fundamentals/how-subscriptions-associated-directory), [AM09](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org), [AM10](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/scope), [AM11](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-basics), [AM12](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups), [AM13](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-subscriptions), [AM14](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/view-all-accounts), [AM15](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types), [AM16](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group), [AM17](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 2.2 Compute and networking

| Slot / stabil audit-ID                 | Krav (kort temaetikett)                                 | Status   | A B C D E F | Eksisterende lokale mål                           | Evidens      | Neste PR |
| -------------------------------------- | ------------------------------------------------------- | -------- | ----------- | ------------------------------------------------- | ------------ | -------- |
| 2.2.01<br>`az900.compute.compare`      | VMs, containers og functions                            | COMPLETE | V V V V V V | C02, C03, C04, CP01                               | S, V, SL, CP | P00, P05 |
| 2.2.02<br>`az900.compute.vm-options`   | VM, VM Scale Sets, availability sets og Virtual Desktop | COMPLETE | V V V V V V | C02, CP02                                         | V, CP        | P05      |
| 2.2.03<br>`az900.compute.vm-resources` | Ressurser som støtter en VM                             | COMPLETE | V V V V V V | C02, N01, G02, CP03                               | V, CP        | P05, P06 |
| 2.2.04<br>`az900.compute.hosting`      | Web apps, containers og VM-hosting                      | COMPLETE | V V V V V V | C01, C02, C03, CP04                               | S, V, P, CP  | P05      |
| 2.2.05<br>`az900.networking.services`  | VNet, subnet, peering, DNS, VPN Gateway og ExpressRoute | COMPLETE | V V V V V V | N01, N02, N03, NW01, NW02, NW03, NW04, CN01, CN02 | V, H, NP, NC | P06, P07 |
| 2.2.06<br>`az900.networking.endpoints` | Public og private endpoints                             | COMPLETE | V V V V V V | N03, CN03, CN04                                   | NC           | P07      |

### 2.2.01 — VMs, containers og functions

**Fasetter:** VM: COMPLETE; Containers: COMPLETE; Functions: COMPLETE.

**Faktisk funn:** CP01: Full VM/container/Functions mechanism and isolation/lifecycle qualifications; guided container recreate/external-data contrast. Independent cp01–03 change guest-kernel, event and lifecycle requirements, with decision/reason feedback.

**Rest / beslutning:** No scoped A–F content gap identified by author review. Finite recognition-based cases and conceptual simplifications remain; qualified human SME/novice/UX/screen-reader and measured transfer validation unperformed. Structural coverage is not exam readiness.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [FUNC](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview), [VM](https://learn.microsoft.com/en-us/azure/virtual-machines/overview), [SL-FUNCTIONS](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview), [SL-HOSTING](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale), [SL-BINDINGS](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings), [SL-FLEX](https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan), [SL-RESPONSIBILITY](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility), [PS01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [PS02](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [PS03](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/1-introduction), [PS04](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/2-virtual-machines), [PS05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/4-virtual-desktop), [PS06](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/5-containers), [PS07](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/6-functions), [PS08](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/12a-describe-ai-ml-iot-edge-services), [PS09](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/7-describe-application-hosting-options), [PS10](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/14-summary), [PS11](https://learn.microsoft.com/en-us/azure/virtual-machines/overview), [PS20](https://learn.microsoft.com/en-us/azure/container-apps/overview), [PS21](https://learn.microsoft.com/en-us/azure/container-apps/start-containers), [PS22](https://learn.microsoft.com/en-us/azure/aks/what-is-aks), [PS23](https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree), [PS24](https://learn.microsoft.com/en-us/virtualization/windowscontainers/about/containers-vs-vm), [PS25](https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container), [PS26](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro), [PS27](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview), [PS28](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale), [PS34](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility), [PS31](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.2.02 — VM, VM Scale Sets, availability sets og Virtual Desktop

**Fasetter:** Azure VM: COMPLETE; VM Scale Sets: COMPLETE; Availability sets: COMPLETE; Azure Virtual Desktop: COMPLETE.

**Faktisk funn:** CP02: VM/VMSS Flexible versus Uniform/availability sets FD-UD versus zones/ARM AVD fully taught. Deterministic capacity/failure/routing/data and substantial AVD publication exploration. Independent cp04–07 and cp13 test fleet, fault/update boundaries, desktop publication/assignment and dependency counterexample.

**Rest / beslutning:** No scoped A–F content gap identified by author review. Finite recognition-based cases and conceptual simplifications remain; qualified human SME/novice/UX/screen-reader and measured transfer validation unperformed. Structural coverage is not exam readiness.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [PS01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [PS02](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [PS03](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/1-introduction), [PS04](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/2-virtual-machines), [PS05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/4-virtual-desktop), [PS06](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/5-containers), [PS07](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/6-functions), [PS08](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/12a-describe-ai-ml-iot-edge-services), [PS09](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/7-describe-application-hosting-options), [PS10](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/14-summary), [PS11](https://learn.microsoft.com/en-us/azure/virtual-machines/overview), [PS12](https://learn.microsoft.com/en-us/azure/virtual-machines/availability), [PS13](https://learn.microsoft.com/en-us/azure/virtual-machines/availability-set-overview), [PS14](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview), [PS15](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes), [PS16](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview), [PS17](https://learn.microsoft.com/en-us/azure/virtual-desktop/overview), [PS18](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology), [PS19](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience), [PS34](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.2.03 — Ressurser som støtter en VM

**Fasetter:** VM/disks/NIC/VNet/subnet: COMPLETE.

**Faktisk funn:** CP03: OS image/profile, vCPU/RAM, OS/data disks and NIC/subnet/VNet/management relations taught. New Windows/standard64App build requires explicit reused subnet, accepted post-boundary receipt and seven real inspections. Independent cp08/cp09/cp14 change memory/storage, regional attachment and configuration-versus-runtime conditions.

**Rest / beslutning:** No scoped A–F content gap identified by author review. Finite recognition-based cases and conceptual simplifications remain; qualified human SME/novice/UX/screen-reader and measured transfer validation unperformed. Structural coverage is not exam readiness.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [VM](https://learn.microsoft.com/en-us/azure/virtual-machines/overview), [PS01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [PS02](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [PS03](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/1-introduction), [PS04](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/2-virtual-machines), [PS05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/4-virtual-desktop), [PS06](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/5-containers), [PS07](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/6-functions), [PS08](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/12a-describe-ai-ml-iot-edge-services), [PS09](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/7-describe-application-hosting-options), [PS10](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/14-summary), [PS11](https://learn.microsoft.com/en-us/azure/virtual-machines/overview), [PS32](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview), [PS33](https://learn.microsoft.com/en-us/azure/virtual-network/network-overview), [PS34](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility), [PS35](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.2.04 — Web apps, containers og VM-hosting

**Fasetter:** Web Apps: COMPLETE; VM-hosting: COMPLETE; Container-hosting: COMPLETE.

**Faktisk funn:** CP04: Requirement-led VM/App Service/Functions/ACI/ACA/AKS hosting and retained responsibilities. Guided two-constraint Studio, optional actual Portal inspection. Independent cp10–12 include orchestration requirement, multiple valid HTTP and batch choices with candidate-specific rationale and counterfactuals.

**Rest / beslutning:** No scoped A–F content gap identified by author review. Finite recognition-based cases and conceptual simplifications remain; qualified human SME/novice/UX/screen-reader and measured transfer validation unperformed. Structural coverage is not exam readiness.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [PLAN](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans), [PS01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [PS02](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [PS03](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/1-introduction), [PS04](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/2-virtual-machines), [PS05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/4-virtual-desktop), [PS06](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/5-containers), [PS07](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/6-functions), [PS08](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/12a-describe-ai-ml-iot-edge-services), [PS09](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/7-describe-application-hosting-options), [PS10](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/14-summary), [PS11](https://learn.microsoft.com/en-us/azure/virtual-machines/overview), [PS20](https://learn.microsoft.com/en-us/azure/container-apps/overview), [PS21](https://learn.microsoft.com/en-us/azure/container-apps/start-containers), [PS22](https://learn.microsoft.com/en-us/azure/aks/what-is-aks), [PS23](https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree), [PS24](https://learn.microsoft.com/en-us/virtualization/windowscontainers/about/containers-vs-vm), [PS25](https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container), [PS26](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro), [PS27](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview), [PS28](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale), [PS29](https://learn.microsoft.com/en-us/azure/app-service/overview), [PS30](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans), [PS31](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container), [PS34](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility), [PS36](https://learn.microsoft.com/en-us/training/modules/host-a-web-app-with-azure-app-service/), [PS37](https://learn.microsoft.com/en-us/azure/container-apps/jobs), [PS38](https://learn.microsoft.com/en-us/azure/container-instances/container-instances-restart-policy). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.2.05 — VNet, subnet, peering, DNS, VPN Gateway og ExpressRoute

**Fasetter:** VNet: COMPLETE; Subnet: COMPLETE; Peering: COMPLETE; Azure DNS: COMPLETE; VPN Gateway: COMPLETE; ExpressRoute: COMPLETE.

**Faktisk funn:** P06 prerequisite facets plus P07 original VPN/ExpressRoute and endpoint/DNS teaching, deterministic causal models, four guided investigations, changed independent contexts and all-alternative feedback. Scoped A–F mapping in NETWORKING_CONNECTIVITY; separate versioned evidence.

**Rest / beslutning:** Content coverage only; no actual Azure tunnels/circuits/endpoints/traffic or certification-readiness claim. Human SME/UX/screen-reader/learning transfer remains unperformed. PR28 external preview gate remains SSO-blocked.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [M06](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/), [NS01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [NS02](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/), [NS03](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/1-introduction), [NS04](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/2-virtual-network), [NS05](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/5-domain-name-system), [NS06](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview), [NS07](https://learn.microsoft.com/en-us/azure/virtual-network/network-overview), [NS08](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq), [NS09](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview), [NS10](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-peering), [NS11](https://learn.microsoft.com/en-us/azure/virtual-network/how-to-configure-subnet-peering), [NS12](https://learn.microsoft.com/en-us/azure/dns/dns-overview), [NS13](https://learn.microsoft.com/en-us/azure/dns/private-dns-overview), [NS14](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances), [NS15](https://learn.microsoft.com/en-us/azure/dns/dns-private-resolver-overview), [NS16](https://learn.microsoft.com/en-us/azure/dns/dns-zones-records), [NS17](https://learn.microsoft.com/en-us/azure/dns/private-dns-virtual-network-links), [NS18](https://learn.microsoft.com/en-us/azure/dns/private-dns-scenarios), [NS19](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/7-summary), [NCS01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [NCS02](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/), [NCS03](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/1-introduction), [NCS04](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/2-virtual-network), [NCS05](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/3-virtual-private-networks), [NCS06](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/4-expressroute), [NCS07](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/5-domain-name-system), [NCS08](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/7-summary), [NCS09](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways), [NCS10](https://learn.microsoft.com/en-us/azure/vpn-gateway/design), [NCS11](https://learn.microsoft.com/en-us/azure/vpn-gateway/point-to-site-about), [NCS12](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-introduction), [NCS13](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-about-encryption), [NCS14](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-circuit-peerings), [NCS15](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-howto-coexist-resource-manager), [NCS16](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview), [NCS17](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns-integration), [NCS18](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns), [NCS19](https://learn.microsoft.com/en-us/azure/storage/common/storage-private-endpoints), [NCS20](https://learn.microsoft.com/en-us/azure/storage/common/storage-network-security). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.2.06 — Public og private endpoints

**Fasetter:** Public endpoint: COMPLETE; Private endpoint: COMPLETE.

**Faktisk funn:** P06 prerequisite facets plus P07 original VPN/ExpressRoute and endpoint/DNS teaching, deterministic causal models, four guided investigations, changed independent contexts and all-alternative feedback. Scoped A–F mapping in NETWORKING_CONNECTIVITY; separate versioned evidence.

**Rest / beslutning:** Content coverage only; no actual Azure tunnels/circuits/endpoints/traffic or certification-readiness claim. Human SME/UX/screen-reader/learning transfer remains unperformed. PR28 external preview gate remains SSO-blocked.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [M06](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/), [NCS01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [NCS02](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/), [NCS03](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/1-introduction), [NCS04](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/2-virtual-network), [NCS05](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/3-virtual-private-networks), [NCS06](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/4-expressroute), [NCS07](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/5-domain-name-system), [NCS08](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/7-summary), [NCS09](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways), [NCS10](https://learn.microsoft.com/en-us/azure/vpn-gateway/design), [NCS11](https://learn.microsoft.com/en-us/azure/vpn-gateway/point-to-site-about), [NCS12](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-introduction), [NCS13](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-about-encryption), [NCS14](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-circuit-peerings), [NCS15](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-howto-coexist-resource-manager), [NCS16](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview), [NCS17](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns-integration), [NCS18](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns), [NCS19](https://learn.microsoft.com/en-us/azure/storage/common/storage-private-endpoints), [NCS20](https://learn.microsoft.com/en-us/azure/storage/common/storage-network-security). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 2.3 Storage

| Slot / stabil audit-ID               | Krav (kort temaetikett)                   | Status   | A B C D E F | Eksisterende lokale mål | Evidens             | Neste PR |
| ------------------------------------ | ----------------------------------------- | -------- | ----------- | ----------------------- | ------------------- | -------- |
| 2.3.01<br>`az900.storage.services`   | Sammenligne Azure Storage services        | COMPLETE | V V V V V V | D01, SG01, SG02, SG04   | ST                  | P08      |
| 2.3.02<br>`az900.storage.tiers`      | Storage access tiers                      | COMPLETE | V V V V V V | D01                     | SR                  | P09      |
| 2.3.03<br>`az900.storage.redundancy` | Storage redundancy                        | COMPLETE | V V V V V V | D01, O03                | SR                  | P09      |
| 2.3.04<br>`az900.storage.accounts`   | Storage account options og storage types  | COMPLETE | V V V V V V | D01, G02, SG03, SG04    | ST                  | P08      |
| 2.3.05<br>`az900.storage.file-tools` | Verktøy for filflytting og synkronisering | MISSING  | M M M M M N | D01, R03                | Ingen aktiv dekning | P16      |
| 2.3.06<br>`az900.storage.migration`  | Migrering til Azure                       | MISSING  | M M M M M N | R03, D01                | Ingen aktiv dekning | P16      |

### 2.3.01 — Sammenligne Azure Storage services

**Fasetter:** Blob: COMPLETE; Files: COMPLETE; Queues: COMPLETE; Tables: COMPLETE.

**Faktisk funn:** P08 original Storage manuscript, one Workload Studio with differentiated data structures, three causal investigations, changed decision/reason cases and specific all-alternative feedback. Current Files HDD/SSD/top-level management qualifications and managed-disk boundary are explicit.

**Rest / beslutning:** Authored A–F content coverage only; no actual API/upload/account/database/queue/runtime or mastery/readiness/human-learning approval. P09/P16 remain deferred; external Gate7 separately SSO-blocked.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M07](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/), [STG01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [STG02](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/), [STG03](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/1-introduction), [STG04](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/2-accounts), [STG05](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/4-describe-azure-storage-services), [STG06](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/9-summary), [STG07](https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction), [STG08](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview), [STG09](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-overview), [STG10](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction), [STG11](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-introduction), [STG12](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-planning), [STG13](https://learn.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction), [STG14](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted), [STG15](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/web-queue-worker), [STG16](https://learn.microsoft.com/en-us/azure/storage/tables/table-storage-overview), [STG17](https://learn.microsoft.com/en-us/rest/api/storageservices/Understanding-the-Table-Service-Data-Model), [STG18](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview), [STG19](https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-configure), [STG20](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create), [STG21](https://learn.microsoft.com/en-us/azure/storage/files/files-management-concepts). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.3.02 — Storage access tiers

**Fasetter:** Hot: COMPLETE; Cool: COMPLETE; Cold: COMPLETE; Archive: COMPLETE.

**Faktisk funn:** Original substansiell tier-/lifecycle-/rehydreringsundervisning med Cold online, Archive offline, standard GPv2-minimumsperioder som fakturering, default/eksplisitt, aktuelle Smart-forbehold og tjenestegrenser. Deterministiske lagrede kontraster, fiktive kostnadsdrivere og endrede selvstendige beslutning/begrunnelse-kontekster rb01–05.

**Rest / beslutning:** Ingen innholdsgap identifisert i scoped forfattergjennomgang A–F. Full innholdsdekning er ikke målt læringseffekt eller eksamensberedskap; menneskelig SME/UX/skjermleser/transfer uutført. Separat sluttrevisjon og leveransegater dokumenteres på PR34.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M07](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/), [SRG01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [SRG02](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/), [SRG03](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview), [SRG05](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview), [SRG06](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview), [SRG07](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-smart), [SRG09](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/1-introduction), [SRG10](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/2-accounts), [SRG12](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/4-describe-azure-storage-services), [SRG13](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/9-summary), [SRG16](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-feature-support-in-storage-accounts), [SRG19](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/), [SRG20](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-policy-structure). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.3.03 — Storage redundancy

**Fasetter:** LRS: COMPLETE; ZRS: COMPLETE; GRS/RA-GRS: COMPLETE; GZRS/RA-GZRS: COMPLETE.

**Faktisk funn:** Alle seks alternativer forklares med primær LRS/ZRS, asynkron sekundær LRS, RA-lesing uten sekundærskriving, separat failover, dataversjon og logisk sletting versus restore. Replikakart/tabell og lagrede feilhendelser, originale kombinerte krav/selektiv restore/tjenestegrenser rb05–10. Region, Files, managed disks og Archive-forbehold eksplisitte.

**Rest / beslutning:** Ingen innholdsgap identifisert i scoped forfattergjennomgang A–F. Full innholdsdekning er ikke målt læringseffekt eller eksamensberedskap; menneskelig SME/UX/skjermleser/transfer uutført. Separat sluttrevisjon og leveransegater dokumenteres på PR34.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M07](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/), [SRG01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [SRG02](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/), [SRG04](https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy), [SRG08](https://learn.microsoft.com/en-us/azure/storage/common/storage-disaster-recovery-guidance), [SRG09](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/1-introduction), [SRG10](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/2-accounts), [SRG11](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/3-redundancy), [SRG13](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/9-summary), [SRG14](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-redundancy), [SRG15](https://learn.microsoft.com/en-us/azure/storage/files/files-redundancy), [SRG17](https://learn.microsoft.com/en-us/azure/storage/blobs/data-protection-overview), [SRG18](https://learn.microsoft.com/en-us/azure/storage/files/files-management-concepts), [SRG19](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/), [SRG21](https://learn.microsoft.com/en-us/azure/storage/common/last-sync-time-get), [SRG22](https://learn.microsoft.com/en-us/azure/storage/common/storage-failover-customer-managed-unplanned), [SRG23](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.3.04 — Storage account options og storage types

**Fasetter:** Account options: COMPLETE; Storage types: COMPLETE.

**Faktisk funn:** P08 original Storage manuscript, one Workload Studio with differentiated data structures, three causal investigations, changed decision/reason cases and specific all-alternative feedback. Current Files HDD/SSD/top-level management qualifications and managed-disk boundary are explicit.

**Rest / beslutning:** Authored A–F content coverage only; no actual API/upload/account/database/queue/runtime or mastery/readiness/human-learning approval. P09/P16 remain deferred; external Gate7 separately SSO-blocked.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M07](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/), [STG01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [STG02](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/), [STG03](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/1-introduction), [STG04](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/2-accounts), [STG05](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/4-describe-azure-storage-services), [STG06](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/9-summary), [STG07](https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction), [STG08](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview), [STG09](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-overview), [STG10](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction), [STG11](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-introduction), [STG12](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-planning), [STG13](https://learn.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction), [STG14](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted), [STG15](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/web-queue-worker), [STG16](https://learn.microsoft.com/en-us/azure/storage/tables/table-storage-overview), [STG17](https://learn.microsoft.com/en-us/rest/api/storageservices/Understanding-the-Table-Service-Data-Model), [STG18](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview), [STG19](https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-configure), [STG20](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create), [STG21](https://learn.microsoft.com/en-us/azure/storage/files/files-management-concepts). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.3.05 — Verktøy for filflytting og synkronisering

**Fasetter:** AzCopy: MISSING; Storage Explorer: MISSING; Azure File Sync: MISSING.

**Faktisk funn:** Ingen undervisning eller anvendt sammenligning av de tre verktøyene.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M07](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.3.06 — Migrering til Azure

**Fasetter:** Azure Migrate: MISSING; Azure Data Box: MISSING.

**Faktisk funn:** Ingen tilgjengelig migreringssekvens eller beslutningsoppgave.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M07](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 2.4 Identity, access and security

| Slot / stabil audit-ID                        | Krav (kort temaetikett)           | Status  | A B C D E F | Eksisterende lokale mål | Evidens             | Neste PR |
| --------------------------------------------- | --------------------------------- | ------- | ----------- | ----------------------- | ------------------- | -------- |
| 2.4.01<br>`az900.identity.directories`        | Entra ID og Entra Domain Services | PARTIAL | P P P M P P | I01, G01                | H                   | P10      |
| 2.4.02<br>`az900.identity.authentication`     | SSO, MFA og passwordless          | MISSING | M M M M M N | I01                     | Ingen aktiv dekning | P10      |
| 2.4.03<br>`az900.identity.external`           | External identities               | MISSING | M M M M M N | I01                     | Ingen aktiv dekning | P10      |
| 2.4.04<br>`az900.identity.conditional-access` | Conditional Access                | MISSING | M M M M M N | I03                     | Ingen aktiv dekning | P11      |
| 2.4.05<br>`az900.identity.rbac`               | Azure RBAC                        | PARTIAL | P P P M P P | I01, G01                | BG, H               | P11      |
| 2.4.06<br>`az900.security.zero-trust`         | Zero Trust                        | MISSING | M M M M M N | I03                     | Ingen aktiv dekning | P15      |
| 2.4.07<br>`az900.security.defense`            | Defense in depth                  | MISSING | M M M M M N | I03                     | Ingen aktiv dekning | P15      |
| 2.4.08<br>`az900.security.defender`           | Microsoft Defender for Cloud      | MISSING | M M M M M N | I03, O01                | Ingen aktiv dekning | P15      |

### 2.4.01 — Entra ID og Entra Domain Services

**Fasetter:** Microsoft Entra ID: PARTIAL; Microsoft Entra Domain Services: MISSING.

**Faktisk funn:** Tenant som identity boundary og skille fra management/geografi nevnes korrekt.

**Rest / beslutning:** Tenant-node er ikke full directory-/auth-undervisning; Domain Services og selvstendig sammenligning mangler.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M08](https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.4.02 — SSO, MFA og passwordless

**Fasetter:** SSO: MISSING; MFA: MISSING; Passwordless: MISSING.

**Faktisk funn:** Fiktiv SaaS-rolle/lisens er ikke autentiseringsmekanisme eller innlogging.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M08](https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.4.03 — External identities

**Fasetter:** Ekstern identitet og samarbeid: MISSING.

**Faktisk funn:** Ingen forklaring eller ny-kontekst tilgangsbeslutning.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M08](https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.4.04 — Conditional Access

**Fasetter:** Signal: MISSING; Policybeslutning: MISSING; Access controls: MISSING.

**Faktisk funn:** Custom resource-location Policy i Portal er ikke Entra Conditional Access.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M08](https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.4.05 — Azure RBAC

**Fasetter:** Principal/role/scope: PARTIAL.

**Faktisk funn:** CB03 forklarer hvem/hva/hvor og forskjellen fra konfigurasjonskrav.

**Rest / beslutning:** Ingen uavhengig Azure-rolle/scope-beslutning; SaaS-produktroller og antatt autorisasjon i labben er ikke Azure RBAC-engine/evidens.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M08](https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.4.06 — Zero Trust

**Fasetter:** Verify explicitly: MISSING; Least privilege: MISSING; Assume breach: MISSING.

**Faktisk funn:** Least privilege alene er ikke full Zero Trust-modell eller vurdering.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M08](https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.4.07 — Defense in depth

**Fasetter:** Lagdelte kontroller: MISSING; Feil i ett lag: MISSING.

**Faktisk funn:** Ansvarsstakken er ikke en undervisningsmodell for lagdelt sikkerhetsforsvar.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M08](https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.4.08 — Microsoft Defender for Cloud

**Fasetter:** Posture: MISSING; Workload protection: MISSING.

**Faktisk funn:** Ingen egen leksjon, inspektérbar modell eller beslutningsoppgave.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M08](https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 3.1 Cost management

| Slot / stabil audit-ID            | Krav (kort temaetikett)             | Status   | A B C D E F | Eksisterende lokale mål | Evidens | Neste PR |
| --------------------------------- | ----------------------------------- | -------- | ----------- | ----------------------- | ------- | -------- |
| 3.1.01<br>`az900.cost.drivers`    | Faktorer som påvirker cloud-kostnad | COMPLETE | V V V V V V | CM01                    | F, CO   | P04      |
| 3.1.02<br>`az900.cost.calculator` | Pricing Calculator                  | COMPLETE | V V V V V V | CM02                    | CO      | P04      |
| 3.1.03<br>`az900.cost.management` | Cost Management capabilities        | COMPLETE | V V V V V V | CM03                    | CO      | P04      |
| 3.1.04<br>`az900.cost.tags`       | Tags                                | COMPLETE | V V V V V V | CM04                    | CO      | P04      |

### 3.1.01 — Faktorer som påvirker cloud-kostnad

**Fasetter:** Bruk/allokering/commitment: COMPLETE; Andre Azure-kostnadsdrivere: COMPLETE.

**Faktisk funn:** Full driver mechanism and two independent contexts (cm01–02), six separate cost components and qualified optimization.

**Rest / beslutning:** A–F content coverage documented; finite original item bank and synthetic exercises. Qualified human SME, UX, screen-reader and learning transfer remain unperformed.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/), [RES](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations), [SAV](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview), [CS01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [CS02](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/), [CS03](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/2-describe-factors-affect-costs-azure), [CS08](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/1-introduction), [CS09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/9-summary), [CS14](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data), [CS27](https://azure.microsoft.com/en-us/pricing/details/bandwidth/), [CS29](https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.1.02 — Pricing Calculator

**Fasetter:** Estimere og sammenligne antakelser: COMPLETE.

**Faktisk funn:** Original calculator teaching plus anonymous public calculator workflow observed, bounded local estimate and independent assumption cases cm03–04.

**Rest / beslutning:** A–F content coverage documented; finite original item bank and synthetic exercises. Qualified human SME, UX, screen-reader and learning transfer remain unperformed.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/), [CS01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [CS02](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/), [CS04](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/3-compare-pricing-total-cost-of-ownership-calculators), [CS08](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/1-introduction), [CS09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/9-summary), [CS10](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/pricing-calculator), [CS28](https://azure.microsoft.com/pricing/calculator/), [CS29](https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.1.03 — Cost Management capabilities

**Fasetter:** Analyse: COMPLETE; Budsjett: COMPLETE; Varsling og scope: COMPLETE.

**Faktisk funn:** Dated actual synthetic records, grouped increase, explicit forecast/threshold contrast, scope and independent cases cm05–06.

**Rest / beslutning:** A–F content coverage documented; finite original item bank and synthetic exercises. Qualified human SME, UX, screen-reader and learning transfer remain unperformed.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/), [CS01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [CS02](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/), [CS05](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/6-describe-azure-tool), [CS08](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/1-introduction), [CS09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/9-summary), [CS11](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management), [CS12](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/quick-acm-cost-analysis), [CS13](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets), [CS14](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data), [CS24](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/group-filter), [CS26](https://learn.microsoft.com/en-us/training/paths/control-spending-manage-bills/), [CS29](https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.1.04 — Tags

**Fasetter:** Metadataformål: COMPLETE; Kostnads-/eierskapsorganisering: COMPLETE.

**Faktisk funn:** Direct resource metadata, Policy modification and reporting inheritance taught separately; classify dataset and independent cases cm07–08.

**Rest / beslutning:** A–F content coverage documented; finite original item bank and synthetic exercises. Qualified human SME, UX, screen-reader and learning transfer remain unperformed.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/), [CS01](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [CS02](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/), [CS06](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/7-describe-purpose-of-tags), [CS08](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/1-introduction), [CS09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/9-summary), [CS15](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources), [CS16](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-support), [CS17](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/enable-tag-inheritance), [CS23](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-policies), [CS24](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/group-filter), [CS29](https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 3.2 Governance and compliance

| Slot / stabil audit-ID               | Krav (kort temaetikett) | Status  | A B C D E F | Eksisterende lokale mål | Evidens             | Neste PR |
| ------------------------------------ | ----------------------- | ------- | ----------- | ----------------------- | ------------------- | -------- |
| 3.2.01<br>`az900.governance.purview` | Microsoft Purview       | MISSING | M M M M M N | G03, I03                | Ingen aktiv dekning | P12      |
| 3.2.02<br>`az900.governance.policy`  | Azure Policy            | PARTIAL | P V V P P P | G03, CB03               | BG, P               | P12      |
| 3.2.03<br>`az900.governance.locks`   | Resource locks          | MISSING | M M M M M N | G04                     | Ingen aktiv dekning | P12      |

### 3.2.01 — Microsoft Purview

**Fasetter:** Data governance purpose: MISSING.

**Faktisk funn:** Ingen tilgjengelig undervisning om Purview; generell governance erstatter ikke produktformålet.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M10](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-azure-for-governance-compliance/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.2.02 — Azure Policy

**Fasetter:** Policyformål og virkninger: PARTIAL.

**Faktisk funn:** Reell lokal custom Web-location-deny med scope/receipt og korrigering; avvisning oppretter ingen ressurs.

**Rest / beslutning:** Én authored regel og one-rule-spørsmål dekker ikke selvstendig formål/effect/compliance-versus-access. Må ikke omtales som alle built-in location policies.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M10](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-azure-for-governance-compliance/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.2.03 — Resource locks

**Fasetter:** CanNotDelete: MISSING; ReadOnly: MISSING; Scope og begrensninger: MISSING.

**Faktisk funn:** Ingen støttet lock-handling eller læringsscenario. Ikke foreslå en operativ låsemotor før den gir merverdi.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M10](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-azure-for-governance-compliance/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 3.3 Management and deployment

| Slot / stabil audit-ID              | Krav (kort temaetikett)                    | Status  | A B C D E F | Eksisterende lokale mål | Evidens    | Neste PR |
| ----------------------------------- | ------------------------------------------ | ------- | ----------- | ----------------------- | ---------- | -------- |
| 3.3.01<br>`az900.management.portal` | Azure Portal som administrasjonsverktøy    | PARTIAL | P V V V P P | CB04, A01               | BM, PORTAL | P13      |
| 3.3.02<br>`az900.management.shells` | Cloud Shell, Azure CLI og Azure PowerShell | PARTIAL | P P M M P P | CB04, A01               | BM         | P13      |
| 3.3.03<br>`az900.management.arc`    | Azure Arc                                  | PARTIAL | P P M M M P | FC04, R02               | F          | P13      |
| 3.3.04<br>`az900.management.iac`    | Infrastructure as code                     | PARTIAL | P P V P P P | CB04, A01               | BM         | P13      |
| 3.3.05<br>`az900.management.arm`    | ARM og ARM templates                       | PARTIAL | P P P M P V | G02, A01                | BM, H      | P13      |

### 3.3.01 — Azure Portal som administrasjonsverktøy

**Fasetter:** Webbasert management: PARTIAL.

**Faktisk funn:** Arbeidsflyt fra søk/liste til Review/Create/Overview, faktisk lokal command/evidence og kursretur.

**Rest / beslutning:** UI-fidelity er sterk praksis, men mangler samlet forklaring/sammenligning av Portalens rolle versus andre management-klienter.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M11](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-manage-deploy-azure-resources/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.3.02 — Cloud Shell, Azure CLI og Azure PowerShell

**Fasetter:** Cloud Shell: MISSING; Azure CLI: PARTIAL; Azure PowerShell: PARTIAL.

**Faktisk funn:** CB04 gir korte originale definisjoner av CLI/PowerShell og felles API.

**Rest / beslutning:** Ingen Cloud Shell-forklaring, gjennomarbeidet kommandoeksempel eller uavhengig verktøyvalg. Ikke kjør ekte shell/Azure.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M11](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-manage-deploy-azure-resources/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.3.03 — Azure Arc

**Fasetter:** Hybrid/cross-environment management: PARTIAL.

**Faktisk funn:** models.azure nevner styring av miljøer gjennom Arc og avviser automatisk flytting av workload.

**Rest / beslutning:** En kort korrekt kobling er ikke komplett Arc-undervisning; mekanisme, grenser og selvstendig scenario mangler.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M11](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-manage-deploy-azure-resources/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.3.04 — Infrastructure as code

**Fasetter:** Deklarativ ønsket tilstand og review: PARTIAL.

**Faktisk funn:** Original fil-/manuell-konfigurasjonsmodell med feil som må oppdages.

**Rest / beslutning:** Mangler selvstendig deklarativ-versus-imperativ/repeterbarhet-beslutning og dybde; template-spørsmålet røper feilens art.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M11](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-manage-deploy-azure-resources/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.3.05 — ARM og ARM templates

**Fasetter:** ARM control plane: PARTIAL; ARM templates: PARTIAL.

**Faktisk funn:** Kort felles management-layer og JSON/Bicep-kobling, ekte lokalt resource-ID-/dependency-system.

**Rest / beslutning:** Lokal motor er ikke ARM; mangler gjennomarbeidet request/declarative-template-forklaring og ny-kontekst vurdering.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M11](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-manage-deploy-azure-resources/), [ARM](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 3.4 Monitoring

| Slot / stabil audit-ID                      | Krav (kort temaetikett)              | Status  | A B C D E F | Eksisterende lokale mål | Evidens             | Neste PR |
| ------------------------------------------- | ------------------------------------ | ------- | ----------- | ----------------------- | ------------------- | -------- |
| 3.4.01<br>`az900.monitoring.advisor`        | Azure Advisor                        | MISSING | M M M M M N | O01, R01                | Ingen aktiv dekning | P14      |
| 3.4.02<br>`az900.monitoring.service-health` | Azure Service Health                 | MISSING | M M M M M N | O01, O02                | Ingen aktiv dekning | P14      |
| 3.4.03<br>`az900.monitoring.monitor`        | Azure Monitor og tilknyttede verktøy | PARTIAL | P P M M P P | O01, O02                | BR, BM              | P14      |

### 3.4.01 — Azure Advisor

**Fasetter:** Personlige anbefalinger: MISSING.

**Faktisk funn:** Ingen egen Advisor-undervisning, anbefalingsmodell eller avgrensningsoppgave.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M12](https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.4.02 — Azure Service Health

**Fasetter:** Azure status: MISSING; Service Health: MISSING; Resource Health: MISSING.

**Faktisk funn:** Lokal Activity log/command receipt er ikke en Azure-tjenestehendelse eller Service Health.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M12](https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.4.03 — Azure Monitor og tilknyttede verktøy

**Fasetter:** Azure Monitor: PARTIAL; Log Analytics: MISSING; Alerts: PARTIAL; Application Insights: MISSING.

**Faktisk funn:** Reliability/manageability nevner målinger, Monitor og varsler som observasjonsgrunnlag.

**Rest / beslutning:** Ingen metrics/logs/traces-modell, KQL-/logginspeksjon, alertbeslutning eller App Insights-forklaring. Ikke konverter simuleringskvitteringer til oppdiktet driftstelemetri.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M12](https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## Daterte offisielle kilder

Alle lenker ble kontrollert 2026-10-26. «Page updated» er bare registrert der siden oppgav dette; det er ikke automatisk reviewdato. Module/unit-struktur og relevante tekniske forklaringer er lest; ingen komplette Learn-leksjoner eller beskyttede spørsmål er kopiert. Microsofts offentlige Practice Assessment-beskrivelse ble lest; selve innloggede oppgavebanken ble ikke åpnet.

| ID                | Kilde og anvendelse                                                                                                                                                                                                                                                                                                                                          | Synlig versjon/dato               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| EXAM              | [Microsoft: Current 57 skill bullets, version and weights](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                                                                                                                                                                       | 2026-06-22                        |
| PA                | [Microsoft: Public assessment scope and limitations; no question bank accessed](https://learn.microsoft.com/en-us/credentials/certifications/practice-assessments-for-microsoft-certifications)                                                                                                                                                              | 2026-10-16                        |
| FAQ               | [Microsoft: Practice assessment and third-party preparation boundaries](https://learn.microsoft.com/en-us/credentials/certifications/frequently-asked-questions)                                                                                                                                                                                             | Rolling page; reviewed 2026-10-26 |
| P1                | [Microsoft: Three cloud-concept modules in official order](https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/)                                                                                                                                                                                           | Rolling page; reviewed 2026-10-26 |
| P2                | [Microsoft: Five current architecture/service modules](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/)                                                                                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| P3                | [Microsoft: Four management/governance modules](https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/)                                                                                                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| PX                | [Microsoft: Eight additional guided projects, not an exam coverage definition](https://learn.microsoft.com/en-us/training/paths/introduction-cloud-infrastructure-apply-azure-skills-guided-projects/)                                                                                                                                                       | Rolling page; reviewed 2026-10-26 |
| M01               | [Microsoft: Cloud definition, responsibility, models, consumption; exam serverless not enumerated here](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/)                                                                                                                                                                          | Rolling page; reviewed 2026-10-26 |
| M02               | [Microsoft: Availability/scalability, reliability/predictability, security/governance, manageability; sustainability supplemental](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/)                                                                                                                                 | Rolling page; reviewed 2026-10-26 |
| M03               | [Microsoft: IaaS/PaaS/SaaS and use cases](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/)                                                                                                                                                                                                                                  | Rolling page; reviewed 2026-10-26 |
| M04               | [Microsoft: Physical infrastructure and management infrastructure](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/)                                                                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| M05               | [Microsoft: Current title: Describe Azure compute services; VM, AVD, containers, Functions, hosting; AI/ML/IoT/Edge supplemental](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/)                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| M06               | [Microsoft: VNet, VPN, ExpressRoute, DNS; separate current networking module](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/)                                                                                                                                                                                        | Rolling page; reviewed 2026-10-26 |
| M07               | [Microsoft: Accounts, redundancy, services, migration and file movement](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/)                                                                                                                                                                                                | Rolling page; reviewed 2026-10-26 |
| M08               | [Microsoft: Directories, authentication, external access, CA, RBAC, trust, defense, Defender; encryption/key management supplemental](https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/)                                                                                                                           | Rolling page; reviewed 2026-10-26 |
| M09               | [Microsoft: Cost factors, calculator, cost management, tags and optimization](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/)                                                                                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| M10               | [Microsoft: Purview, Policy, locks; Service Trust Portal supplemental](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-azure-for-governance-compliance/)                                                                                                                                                                          | Rolling page; reviewed 2026-10-26 |
| M11               | [Microsoft: Portal, CLI/PowerShell, Arc, ARM; cross-check separate IaC exam bullet](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-manage-deploy-azure-resources/)                                                                                                                                                               | Rolling page; reviewed 2026-10-26 |
| M12               | [Microsoft: Advisor, Service Health, Monitor](https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/)                                                                                                                                                                                                                           | Rolling page; reviewed 2026-10-26 |
| SR                | [Microsoft: Customer data, identities, access and service-specific shared tasks](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)                                                                                                                                                                                        | 2026-08-24                        |
| ARM               | [Microsoft: Control plane, scopes, group lifecycle and metadata location](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview)                                                                                                                                                                                                | 2026-08-04                        |
| FUNC              | [Microsoft: Triggers/bindings and hosting-plan-dependent serverless behavior](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)                                                                                                                                                                                                    | 2026-09-21                        |
| REG               | [Microsoft: Regions, zone support and service-specific availability](https://learn.microsoft.com/en-us/azure/reliability/regions-overview)                                                                                                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| PAIR              | [Microsoft: Nonpaired regions and no automatic application failover](https://learn.microsoft.com/en-us/azure/reliability/regions-paired)                                                                                                                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| PLAN              | [Microsoft: Plan compute/OS/region and app dependency](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans)                                                                                                                                                                                                                           | Rolling page; reviewed 2026-10-26 |
| VM                | [Microsoft: Guest maintenance and associated resource configuration](https://learn.microsoft.com/en-us/azure/virtual-machines/overview)                                                                                                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| RES               | [Microsoft: Commitment discount, matching and utilization limits](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations)                                                                                                                                                                              | Rolling page; reviewed 2026-10-26 |
| SAV               | [Microsoft: Eligible compute spend commitment, not a capacity guarantee](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview)                                                                                                                                                                                 | Rolling page; reviewed 2026-10-26 |
| IAAS              | [Microsoft: IaaS operational responsibility and use cases](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/2-describe-infrastructure-service)                                                                                                                                                                                | Rolling page; reviewed 2026-10-26 |
| PAAS              | [Microsoft: PaaS retained code/data/access and service caveats](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/3-describe-platform-service)                                                                                                                                                                                 | Rolling page; reviewed 2026-10-26 |
| SAAS              | [Microsoft: SaaS application maintenance versus customer access/data](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/4-describe-software-service)                                                                                                                                                                           | Rolling page; reviewed 2026-10-26 |
| SL-FUNCTIONS      | [Microsoft: Managed event-based code, physical hosting and use cases](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)                                                                                                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| SL-HOSTING        | [Microsoft: Plan-dependent scale, cold starts, timeout and billing qualifications](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale)                                                                                                                                                                                                  | Rolling page; reviewed 2026-10-26 |
| SL-BINDINGS       | [Microsoft: Exactly one trigger; optional bindings; invocation is not success](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings)                                                                                                                                                                                          | Rolling page; reviewed 2026-10-26 |
| SL-FLEX           | [Microsoft: On-demand and always-ready baseline, no universal free idle](https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan)                                                                                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| SL-RESPONSIBILITY | [Microsoft: Functions as PaaS and retained customer code/data/access](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)                                                                                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| AR01              | [Microsoft: AZ-900 Skills Measured](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                                                                                                                                                                                              | Rolling page; reviewed 2026-10-26 |
| AR02              | [Microsoft: Core architectural components module/units](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/)                                                                                                                                                                                                 | Rolling page; reviewed 2026-10-26 |
| AR03              | [Microsoft: Regions and geographies](https://learn.microsoft.com/en-us/azure/reliability/regions-overview)                                                                                                                                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| AR04              | [Microsoft: Region example metadata](https://learn.microsoft.com/en-us/azure/reliability/regions-list)                                                                                                                                                                                                                                                       | Rolling page; reviewed 2026-10-26 |
| AR05              | [Microsoft: Paired and nonpaired regions](https://learn.microsoft.com/en-us/azure/reliability/regions-paired)                                                                                                                                                                                                                                                | Rolling page; reviewed 2026-10-26 |
| AR06              | [Microsoft: Availability Zones](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview)                                                                                                                                                                                                                                             | Rolling page; reviewed 2026-10-26 |
| AR07              | [Microsoft: Zonal resource resiliency](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-zonal-resource-resiliency)                                                                                                                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| AR08              | [Microsoft: Zone support by service](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-service-support)                                                                                                                                                                                                                                 | Rolling page; reviewed 2026-10-26 |
| AR09              | [Microsoft: Physical infrastructure and security](https://learn.microsoft.com/en-us/azure/security/fundamentals/physical-security)                                                                                                                                                                                                                           | Rolling page; reviewed 2026-10-26 |
| AR10              | [Microsoft: Region selection](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-setup-guide/regions)                                                                                                                                                                                                                              | Rolling page; reviewed 2026-10-26 |
| AR11              | [Microsoft: Azure Government](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-welcome)                                                                                                                                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| AR12              | [Microsoft: Azure in China](https://learn.microsoft.com/en-us/azure/china/overview-operations)                                                                                                                                                                                                                                                               | Rolling page; reviewed 2026-10-26 |
| AR13              | [Microsoft: Reliability and sovereignty](https://learn.microsoft.com/en-us/azure/reliability/concept-reliability-sovereignty)                                                                                                                                                                                                                                | Rolling page; reviewed 2026-10-26 |
| AR14              | [Microsoft: Architecture/services path](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/)                                                                                                                                                                                                           | Rolling page; reviewed 2026-10-26 |
| AM01              | [Microsoft: Current AZ-900 Skills Measured; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                                                                                                                               | Rolling page; reviewed 2026-10-26 |
| AM02              | [Microsoft: Core architectural components public module/units; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/)                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| AM03              | [Microsoft: Azure Resource Manager overview; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview)                                                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| AM04              | [Microsoft: Management groups overview; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/governance/management-groups/overview)                                                                                                                                                                                | Rolling page; reviewed 2026-10-26 |
| AM05              | [Microsoft: Manage resource groups Portal; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal)                                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| AM06              | [Microsoft: Azure Policy overview; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/governance/policy/overview)                                                                                                                                                                                                | Rolling page; reviewed 2026-10-26 |
| AM07              | [Microsoft: RBAC scope overview; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview)                                                                                                                                                                                    | Rolling page; reviewed 2026-10-26 |
| AM08              | [Microsoft: Entra tenant and subscription association; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/entra/fundamentals/how-subscriptions-associated-directory)                                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| AM09              | [Microsoft: CAF resource organization; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org)                                                                                                                                                  | Rolling page; reviewed 2026-10-26 |
| AM10              | [Microsoft: Azure Policy scope; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/scope)                                                                                                                                                                                             | Rolling page; reviewed 2026-10-26 |
| AM11              | [Microsoft: Policy effect basics; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-basics)                                                                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| AM12              | [Microsoft: CAF management group design; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups)                                                                                                                              | Rolling page; reviewed 2026-10-26 |
| AM13              | [Microsoft: CAF subscription design; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-subscriptions)                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| AM14              | [Microsoft: Billing accounts and scopes; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/view-all-accounts)                                                                                                                                                                    | Rolling page; reviewed 2026-10-26 |
| AM15              | [Microsoft: Resource providers and types; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types)                                                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| AM16              | [Microsoft: Resource group deletion; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group)                                                                                                                                                                 | Rolling page; reviewed 2026-10-26 |
| AM17              | [Microsoft: Control plane and data plane; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane)                                                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| AM18              | [Microsoft: Explicit new-app shared plan in another group by resource ID; scoped Case B teaching](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-create)                                                                                                                                                                 | Rolling page; reviewed 2026-10-26 |
| AM19              | [Microsoft: Existing-app plan changes have additional webspace/region/OS constraints, not arbitrary move support](https://learn.microsoft.com/en-us/azure/app-service/app-service-plan-manage)                                                                                                                                                               | Rolling page; reviewed 2026-10-26 |
| TR01              | [Microsoft: P03 AZ-900 Study Guide · Skills measured 2026-07-20; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                                                                                                         | Rolling page; reviewed 2026-10-26 |
| TR02              | [Microsoft: P03 Define cloud models; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/5-define-cloud-models)                                                                                                                                                                | Rolling page; reviewed 2026-10-26 |
| TR03              | [Microsoft: P03 Describe the consumption-based model; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/6-describe-consumption-based-model)                                                                                                                                  | Rolling page; reviewed 2026-10-26 |
| TR04              | [Microsoft: P03 High availability and scalability; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/2-high-availability-scalability-cloud)                                                                                                                    | Rolling page; reviewed 2026-10-26 |
| TR05              | [Microsoft: P03 Reliability and predictability; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/3-reliability-predictability-cloud)                                                                                                                          | Rolling page; reviewed 2026-10-26 |
| TR06              | [Microsoft: P03 Security and governance; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/4-security-governance-cloud)                                                                                                                                        | Rolling page; reviewed 2026-10-26 |
| TR07              | [Microsoft: P03 Manageability; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/5-manageability-cloud)                                                                                                                                                        | Rolling page; reviewed 2026-10-26 |
| TR08              | [Microsoft: P03 IaaS responsibility and scenarios; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/2-describe-infrastructure-service)                                                                                                                                | Rolling page; reviewed 2026-10-26 |
| TR09              | [Microsoft: P03 PaaS responsibility and scenarios; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/3-describe-platform-service)                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| TR10              | [Microsoft: P03 Azure Reservations; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations)                                                                                                                                                    | Rolling page; reviewed 2026-10-26 |
| TR11              | [Microsoft: P03 Azure Spot Virtual Machines; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/azure/virtual-machines/spot-vms)                                                                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| TR12              | [Microsoft: P03 Savings plans overview; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview)                                                                                                                                                          | Rolling page; reviewed 2026-10-26 |
| TR13              | [Microsoft: P03 Failure mode analysis; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/azure/well-architected/reliability/failure-mode-analysis)                                                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| TR14              | [Microsoft: P03 Azure Policy overview; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/azure/governance/policy/overview)                                                                                                                                                                                           | Rolling page; reviewed 2026-10-26 |
| TR15              | [Microsoft: P03 Azure RBAC overview; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview)                                                                                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| TR16              | [Microsoft: P03 Identity and access management concepts; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/entra/fundamentals/identity-fundamental-concepts)                                                                                                                                                         | Rolling page; reviewed 2026-10-26 |
| TR17              | [Microsoft: P03 ARM template overview; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/overview)                                                                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| TR18              | [Microsoft: P03 SaaS responsibility and scenarios; claim/qualification mapping in CLOUD_CONCEPTS_TRANSFER](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/4-describe-software-service)                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| CS01              | [Microsoft: Four pinned cost skills, no separate optimization exam slot; current Skills measured 2026-07-20. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                                                                                        | Rolling page; reviewed 2026-10-26 |
| CS02              | [Microsoft: Eight units, five learning goals including optimization; no protected assessment copied. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/)                                                                                                                                        | Rolling page; reviewed 2026-10-26 |
| CS03              | [Microsoft: Service/type/tier, location, usage and offer affect cost; billing meters differ. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/2-describe-factors-affect-costs-azure)                                                                                                           | Rolling page; reviewed 2026-10-26 |
| CS04              | [Microsoft: Select products and assumptions, aggregate estimated services; estimate is not invoice. Historical TCO slug retained by Learn. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/3-compare-pricing-total-cost-of-ownership-calculators)                                             | Rolling page; reviewed 2026-10-26 |
| CS05              | [Microsoft: Cost visibility, analysis, budgets and optimization; budget alerts alone do not stop resources. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/6-describe-azure-tool)                                                                                                            | Rolling page; reviewed 2026-10-26 |
| CS06              | [Microsoft: Key-value classification for grouping and reporting, not authorization or automatic ARM inheritance. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/7-describe-purpose-of-tags)                                                                                                  | Rolling page; reviewed 2026-10-26 |
| CS07              | [Microsoft: Rightsizing, reservations, savings plans and Spot are conditional options, not universal savings. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/7a-describe-cost-optimization-options)                                                                                          | Rolling page; reviewed 2026-10-26 |
| CS08              | [Microsoft: Prior cloud knowledge and cost learning objectives/prerequisites. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/1-introduction)                                                                                                                                                 | Rolling page; reviewed 2026-10-26 |
| CS09              | [Microsoft: Summary and additional path; broken /learn/paths link resolved through /training/paths. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/9-summary)                                                                                                                                | Rolling page; reviewed 2026-10-26 |
| CS10              | [Microsoft: Calculator product/region/tier/usage configuration and estimate assumptions, optional login operations. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/pricing-calculator)                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| CS11              | [Microsoft: Analyze, monitor and optimize costs; billing roles/offer types affect availability and scope. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management)                                                                                                                       | Rolling page; reviewed 2026-10-26 |
| CS12              | [Microsoft: Scope, grouping and filtering of recorded cost data; corrected URL via official overview. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/quick-acm-cost-analysis)                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| CS13              | [Microsoft: Actual/forecast thresholds, periods and notifications; separately configured action groups/automation, not default stop. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets)                                                                                         | Rolling page; reviewed 2026-10-26 |
| CS14              | [Microsoft: Recorded data can be delayed and revised; actual/amortized/invoice concepts are distinct. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data)                                                                                                                           | Rolling page; reviewed 2026-10-26 |
| CS15              | [Microsoft: Resource tags do not automatically inherit; not all types support tags, avoid sensitive values. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources)                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| CS16              | [Microsoft: Service-dependent tag and cost-report support; no universal tagging or cost-record guarantee. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-support)                                                                                                                                | Rolling page; reviewed 2026-10-26 |
| CS17              | [Microsoft: Reporting inheritance enriches cost records without mutating resource tags; supported EA/MCA/MPA and conflict preferences. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/enable-tag-inheritance)                                                                                            | Rolling page; reviewed 2026-10-26 |
| CS18              | [Microsoft: Reservations are conditional billing discounts for eligible configuration, not runtime/capacity guarantees. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations)                                                                                           | Rolling page; reviewed 2026-10-26 |
| CS19              | [Microsoft: Savings plan scope varies; this module explicitly teaches compute hourly monetary commitment, no claim it is only plan. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview)                                                                                         | Rolling page; reviewed 2026-10-26 |
| CS20              | [Microsoft: Spot capacity is interruptible; eviction/availability constraints and retained disks matter. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/virtual-machines/spot-vms)                                                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| CS21              | [Microsoft: Eligible compute discount application, unused hourly commitment does not roll forward, ancillary costs separate. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/discount-application)                                                                                                 | Rolling page; reviewed 2026-10-26 |
| CS22              | [Microsoft: Advisor recommendations need utilization/workload/reliability validation; smaller is not automatically correct. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/advisor/advisor-cost-recommendations)                                                                                                                       | Rolling page; reviewed 2026-10-26 |
| CS23              | [Microsoft: Policy can modify tagging with appropriate remediation; not automatic resource-group tag inheritance. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-policies)                                                                                                                       | Rolling page; reviewed 2026-10-26 |
| CS24              | [Microsoft: Grouping/filter capabilities and billing scopes are offer-dependent; synthetic scope is a bounded analogue. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/group-filter)                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| CS25              | [Microsoft: Right-size first, reservation configuration commitment versus flexible eligible compute spend; no purchase in product. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/decide-between-savings-plan-reservation)                                                                        | Rolling page; reviewed 2026-10-26 |
| CS26              | [Microsoft: Supplementary spending path reviewed; advanced Power BI, payment, partner billing and purchasing deferred. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/training/paths/control-spending-manage-bills/)                                                                                                                         | Rolling page; reviewed 2026-10-26 |
| CS27              | [Microsoft: Transfer path/direction and billing geography affect rates; billing zones are not Availability Zones, no live prices imported. Claim map: COST_MANAGEMENT.](https://azure.microsoft.com/en-us/pricing/details/bandwidth/)                                                                                                                        | Rolling page; reviewed 2026-10-26 |
| CS28              | [Microsoft: Actual anonymous product→VM→region/Linux/200hours and separate disk/traffic workflow inspected; Save/Share unavailable unsigned. Claim map: COST_MANAGEMENT.](https://azure.microsoft.com/pricing/calculator/)                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| CS29              | [Microsoft: Third official path has four modules; cost module alone implemented, remaining modules planned. Claim map: COST_MANAGEMENT.](https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/)                                                                                                                             | Rolling page; reviewed 2026-10-26 |
| PS01              | [Microsoft: Four pinned compute skills; networking remains separate. July20 2026 Skills measured, not a readiness measure. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                 | Rolling page; reviewed 2026-10-26 |
| PS02              | [Microsoft: Nine current units and five Learn learning goals. Public teaching/summary read; protected assessment not accessed or copied. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/)                               | Rolling page; reviewed 2026-10-26 |
| PS03              | [Microsoft: Different organizations require different code, OS and operational-control boundaries. Prerequisites link to existing Cloud Concepts. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/1-introduction)        | Rolling page; reviewed 2026-10-26 |
| PS04              | [Microsoft: VM guest OS, size and disks; VMSS and availability sets are distinct options; no automatic application availability. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/2-virtual-machines)                     | Rolling page; reviewed 2026-10-26 |
| PS05              | [Microsoft: AVD desktop/application delivery; personal and pooled host pools differ from single/multi-session. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/4-virtual-desktop)                                        | Rolling page; reviewed 2026-10-26 |
| PS06              | [Microsoft: Image versus container instance/runtime; ACI/ACA/AKS identify different hosting and orchestration scopes. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/5-containers)                                      | Rolling page; reviewed 2026-10-26 |
| PS07              | [Microsoft: Functions event/trigger/code; billing, scale and cold-start depend on selected hosting plan. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/6-functions)                                                    | Rolling page; reviewed 2026-10-26 |
| PS08              | [Microsoft: AI, machine learning and IoT/Edge are contextual Learn categories, not additional scoped AZ900 skill slots. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/12a-describe-ai-ml-iot-edge-services)            | Rolling page; reviewed 2026-10-26 |
| PS09              | [Microsoft: Web Apps, containers and VMs meet different hosting requirements; managed hosting retains customer responsibilities. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/7-describe-application-hosting-options) | Rolling page; reviewed 2026-10-26 |
| PS10              | [Microsoft: Current module learning-goal summary and linked supplemental App Service module; no assessment question reused. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/14-summary)                                  | Rolling page; reviewed 2026-10-26 |
| PS11              | [Microsoft: VMs provide guest-level control, images and declared compute profiles; configuration does not prove app execution. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-machines/overview)                                                                      | Rolling page; reviewed 2026-10-26 |
| PS12              | [Microsoft: Availability choices have different fault boundaries; zones, sets and scale sets do not guarantee end-to-end uptime. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-machines/availability)                                                                | Rolling page; reviewed 2026-10-26 |
| PS13              | [Microsoft: Availability sets distribute VMs across fault/update domains; not zones or autoscale. Current recommendation qualifies Flexible/zonal alternatives. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-machines/availability-set-overview)                    | Rolling page; reviewed 2026-10-26 |
| PS14              | [Microsoft: VMSS manages VM instances; explicit capacity/scaling configuration is necessary. More instances do not repair shared dependencies. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview)                                            | Rolling page; reviewed 2026-10-26 |
| PS15              | [Microsoft: Flexible and Uniform orchestration differ; Flexible supports standard VM flexibility and has no availability-set update domains. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes)        | Rolling page; reviewed 2026-10-26 |
| PS16              | [Microsoft: Autoscale uses configured metric/rule/schedule assumptions. Our bounded pre-failure arithmetic is not the Azure algorithm. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview)               | Rolling page; reviewed 2026-10-26 |
| PS17              | [Microsoft: AVD uses ARM objects and customer-configured host/application/access responsibilities; no classic workflow or actual login. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-desktop/overview)                                                              | Rolling page; reviewed 2026-10-26 |
| PS18              | [Microsoft: Workspace, application group, host pool, session host, personal/pooled and RemoteApp/full-desktop relationships. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)                                                                      | Rolling page; reviewed 2026-10-26 |
| PS19              | [Microsoft: AVD control-plane services differ from session hosts; publication/assignment is not evidence of a user session or host health. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)                                    | Rolling page; reviewed 2026-10-26 |
| PS20              | [Microsoft: ACA offers managed container apps, revisions and configurable scaling; not every rule scales to zero and no direct Kubernetes API. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/container-apps/overview)                                                        | Rolling page; reviewed 2026-10-26 |
| PS21              | [Microsoft: Container images package user-space dependencies; persistent data and platform compatibility need explicit design. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/container-apps/start-containers)                                                                | Rolling page; reviewed 2026-10-26 |
| PS22              | [Microsoft: AKS provides Kubernetes capabilities. Automatic and Standard shift different node/infrastructure operational duties. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/aks/what-is-aks)                                                                              | Rolling page; reviewed 2026-10-26 |
| PS23              | [Microsoft: Compute selection is requirement-driven, including orchestration, guest control, continuous hosting and events; no universal ranking. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree)                 | Rolling page; reviewed 2026-10-26 |
| PS24              | [Microsoft: Process-isolated containers commonly share a host kernel; image is not a running process and not the same isolation boundary as a VM. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/virtualization/windowscontainers/about/containers-vs-vm)                           | Rolling page; reviewed 2026-10-26 |
| PS25              | [Microsoft: Windows Hyper-V container isolation has a lightweight VM/kernel boundary; this is a qualified counterexample, not a universal Azure switch. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)         | Rolling page; reviewed 2026-10-26 |
| PS26              | [Microsoft: ACR stores/distributes container artifacts; registry alone does not execute the application or provide persistent app data. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro)                                           | Rolling page; reviewed 2026-10-26 |
| PS27              | [Microsoft: Functions runs event-triggered code; it does not universally replace long-lived workloads requiring guest control. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)                                                             | Rolling page; reviewed 2026-10-26 |
| PS28              | [Microsoft: Flex Consumption, Premium and Dedicated have different scaling/idle/cost/start properties. Contradictory retirement text not used for questions. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale)                                  | Rolling page; reviewed 2026-10-26 |
| PS29              | [Microsoft: Standard App Service supports managed web/API hosting and supported code/custom container options; not a general guest-OS replacement. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/app-service/overview)                                                       | Rolling page; reviewed 2026-10-26 |
| PS30              | [Microsoft: App Service plan defines compute/location/OS/tier context; multiple apps may share plan compute, with tier-specific limitations. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans)                                               | Rolling page; reviewed 2026-10-26 |
| PS31              | [Microsoft: App Service custom-container persistence is explicitly configured; arbitrary writable instance-layer data is not durable after recreate. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container)                                   | Rolling page; reviewed 2026-10-26 |
| PS32              | [Microsoft: Managed OS and data disks serve different roles; additional storage does not substitute for RAM or an appropriate OS image. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview)                                               | Rolling page; reviewed 2026-10-26 |
| PS33              | [Microsoft: VM/NIC/subnet/VNet relationships have location/subscription constraints. Older IP-default details are not taught as current universal defaults. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-network/network-overview)                                  | Rolling page; reviewed 2026-10-26 |
| PS34              | [Microsoft: Customer retains application/code/image/data/access/security configuration; provider-host management does not secure customer content automatically. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)                  | Rolling page; reviewed 2026-10-26 |
| PS35              | [Microsoft: Actual Azure Portal VM Basics/Disks/Networking/Review-create workflow. Local form is bounded, with no credentials/IP/guest execution. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal)                                  | Rolling page; reviewed 2026-10-26 |
| PS36              | [Microsoft: Supplemental App Service prerequisite/create/review/summary inspected; live coding/deployment and account exercises excluded from local operative scope. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/training/modules/host-a-web-app-with-azure-app-service/)        | Rolling page; reviewed 2026-10-26 |
| PS37              | [Microsoft: ACA Jobs have finite manual/scheduled/event-triggered executions. Creating job configuration differs from starting an execution; access/data/retry remain explicit. Independent original educational model; no measured Azure runtime or human approval.](https://learn.microsoft.com/en-us/azure/container-apps/jobs)                           | Rolling page; reviewed 2026-10-26 |
| PS38              | [Microsoft: Run-to-completion and explicit restart policies differ from a reusable ACA Job/execution. Never qualifies successful exit, not a universal no-retry guarantee; no task is executed locally.](https://learn.microsoft.com/en-us/azure/container-instances/container-instances-restart-policy)                                                     | Rolling page; reviewed 2026-10-26 |
| NS01              | [Microsoft: Four named facets of composite2.2.05; VPN Gateway/ExpressRoute and2.2.06 remain deferred, no readiness claim.](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                                                                                                       | Rolling page; reviewed 2026-10-26 |
| NS02              | [Microsoft: Seven-unit module, six public framing/teaching/summary units read; protected assessment excluded.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/)                                                                                                                                                       | Rolling page; reviewed 2026-10-26 |
| NS03              | [Microsoft: Resource communication and prerequisite networking concepts; basic access control is context, no NSG engine.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/1-introduction)                                                                                                                              | Rolling page; reviewed 2026-10-26 |
| NS04              | [Microsoft: Virtual networks, subnets, routing/filtering distinction and peering at Fundamentals depth.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/2-virtual-network)                                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| NS05              | [Microsoft: DNS name/record resolution, Azure-provided/public/private distinction with product qualifications.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/5-domain-name-system)                                                                                                                                  | Rolling page; reviewed 2026-10-26 |
| NS06              | [Microsoft: VNet/subnets are regional and span Availability Zones; management scope is separate. Older default-outbound assertions are excluded.](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)                                                                                                                         | Rolling page; reviewed 2026-10-26 |
| NS07              | [Microsoft: Actual VM/NIC/subnet/VNet references and region constraints; no local allocated IP or runtime. Older public-IP defaults excluded.](https://learn.microsoft.com/en-us/azure/virtual-network/network-overview)                                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| NS08              | [Microsoft: IPv4 intervals, canonical network prefix, containment/overlap, ordinary first-four/last reservations and minimum /29 subnet; extra allocations/IPv6 excluded.](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq)                                                                                                     | Rolling page; reviewed 2026-10-26 |
| NS09              | [Microsoft: Standard/global/cross-subscription peering, private backbone and topology; no implicit DNS/authorization.](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview)                                                                                                                                             | Rolling page; reviewed 2026-10-26 |
| NS10              | [Microsoft: Both sides Connected, nonoverlapping standard ranges, nontransitivity, explicit service chaining rather than automatic NVA/UDR.](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-peering)                                                                                                                         | Rolling page; reviewed 2026-10-26 |
| NS11              | [Microsoft: Selected subnet peering, allowlisting/tool prerequisites, participating address-space uniqueness, reuse of nonparticipating ranges, route over-advertisement/delegation/AVNM/SKU qualifications. Bounded fixture is not full feature eligibility.](https://learn.microsoft.com/en-us/azure/virtual-network/how-to-configure-subnet-peering)      | Rolling page; reviewed 2026-10-26 |
| NS12              | [Microsoft: Public/private/managed resolution products have distinct purposes; no copied Traffic Manager/Policy service promises.](https://learn.microsoft.com/en-us/azure/dns/dns-overview)                                                                                                                                                                 | Rolling page; reviewed 2026-10-26 |
| NS13              | [Microsoft: Private zone visibility via explicit links or qualified resolver path; forward resolution does not require application peering.](https://learn.microsoft.com/en-us/azure/dns/private-dns-overview)                                                                                                                                               | Rolling page; reviewed 2026-10-26 |
| NS14              | [Microsoft: Azure-provided same-VNet host resolution versus cross-VNet/private/custom resolver strategy; chosen resolver matters.](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances)                                                                                                      | Rolling page; reviewed 2026-10-26 |
| NS15              | [Microsoft: Managed DNS Private Resolver inbound/outbound endpoints and forwarding rulesets need explicit network/configuration prerequisites.](https://learn.microsoft.com/en-us/azure/dns/dns-private-resolver-overview)                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| NS16              | [Microsoft: Zone/domain/delegation, A versus CNAME continuation/limitations, no domain purchase or live query; TTL not simulated.](https://learn.microsoft.com/en-us/azure/dns/dns-zones-records)                                                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| NS17              | [Microsoft: Resolution links versus registration/autoregistration; no policy or routing effect from a DNS link.](https://learn.microsoft.com/en-us/azure/dns/private-dns-virtual-network-links)                                                                                                                                                              | Rolling page; reviewed 2026-10-26 |
| NS18              | [Microsoft: Single/cross-VNet/split-horizon examples; article warns example .1/.2 are not ordinary assignable VM addresses. Original fixtures use .20.](https://learn.microsoft.com/en-us/azure/dns/private-dns-scenarios)                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| NS19              | [Microsoft: P06 summary, Network Foundations supplementary discovery; implementation-depth deployment material is deferred, not new objective credit.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/7-summary)                                                                                                      | Rolling page; reviewed 2026-10-26 |
| NCS01             | [Microsoft: Current AZ-900 scope 2.2.05 and 2.2.06; content coverage is separate from learner achievement.](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| NCS02             | [Microsoft: Seven-unit module structure, all six public units reviewed; protected assessment excluded.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/)                                                                                                                                                              | Rolling page; reviewed 2026-10-26 |
| NCS03             | [Microsoft: Networking purpose and prerequisite context; not a full routing/security engine.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/1-introduction)                                                                                                                                                          | Rolling page; reviewed 2026-10-26 |
| NCS04             | [Microsoft: Public/private endpoint distinction and VNet prerequisites, with product qualifications.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/2-virtual-network)                                                                                                                                               | Rolling page; reviewed 2026-10-26 |
| NCS05             | [Microsoft: S2S/P2S/VNet-to-VNet distinctions, qualified by current product transport/authentication documentation.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/3-virtual-private-networks)                                                                                                                       | Rolling page; reviewed 2026-10-26 |
| NCS06             | [Microsoft: Private provider connectivity and service purpose; global scope requires SKU/geography qualifications.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/4-expressroute)                                                                                                                                    | Rolling page; reviewed 2026-10-26 |
| NCS07             | [Microsoft: Name resolution is distinct from network path and authorization.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/5-domain-name-system)                                                                                                                                                                    | Rolling page; reviewed 2026-10-26 |
| NCS08             | [Microsoft: Module framing and further reading, not copied assessment material.](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/7-summary)                                                                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| NCS09             | [Microsoft: VPN gateway encrypted tunnel types, gateway requirements and dated SKU constraints; no live throughput promise.](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways)                                                                                                                                              | Rolling page; reviewed 2026-10-26 |
| NCS10             | [Microsoft: Gateway topology, S2S public internet versus VNet-VNet Microsoft-network transport, compatible devices/routes.](https://learn.microsoft.com/en-us/azure/vpn-gateway/design)                                                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| NCS11             | [Microsoft: P2S individual client, supported protocols/authentication and compatibility, not universal preshared-key use.](https://learn.microsoft.com/en-us/azure/vpn-gateway/point-to-site-about)                                                                                                                                                          | Rolling page; reviewed 2026-10-26 |
| NCS12             | [Microsoft: ER private transport, provider role, circuit redundancy, independent end-to-end failure boundaries and costs without invented rates.](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-introduction)                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| NCS13             | [Microsoft: ER is not encrypted by default; MACsec Direct link scope differs from end-to-end IPsec.](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-about-encryption)                                                                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| NCS14             | [Microsoft: ER private peering versus Microsoft peering and VNet Peering; service/geography prerequisites.](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-circuit-peerings)                                                                                                                                                              | Rolling page; reviewed 2026-10-26 |
| NCS15             | [Microsoft: S2S coexistence/backup requires configured compatible private-peering routes; no universal automatic backup.](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-howto-coexist-resource-manager)                                                                                                                                  | Rolling page; reviewed 2026-10-26 |
| NCS16             | [Microsoft: PE private NIC/service subresource/approval and service-specific limits, no automatic application authorization.](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview)                                                                                                                                                | Rolling page; reviewed 2026-10-26 |
| NCS17             | [Microsoft: Client-visible DNS and reachable resolver/forwarding path; no automatic on-premises Azure internal DNS access.](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns-integration)                                                                                                                                           | Rolling page; reviewed 2026-10-26 |
| NCS18             | [Microsoft: Service-specific private DNS zones and subresource requirements; fixture is not universal deployment configuration.](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns)                                                                                                                                                  | Rolling page; reviewed 2026-10-26 |
| NCS19             | [Microsoft: Storage concrete example: PE creation does not disable public endpoint; approval/DNS/subresource/auth remain separate.](https://learn.microsoft.com/en-us/azure/storage/common/storage-private-endpoints)                                                                                                                                        | Rolling page; reviewed 2026-10-26 |
| NCS20             | [Microsoft: Storage firewall controls public endpoint; identity/data roles remain independent, no generic private firewall claim.](https://learn.microsoft.com/en-us/azure/storage/common/storage-network-security)                                                                                                                                          | Rolling page; reviewed 2026-10-26 |
| STG01             | [Microsoft: Current dated AZ-900 scope2.3.01 and2.3.04; other Storage objectives deferred.](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| STG02             | [Microsoft: Eight-unit Learn structure and scoped discovery; no protected assessment reuse.](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/)                                                                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| STG03             | [Microsoft: Storage prerequisites and accounts/services relationship.](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/1-introduction)                                                                                                                                                                                    | Rolling page; reviewed 2026-10-26 |
| STG04             | [Microsoft: Introductory modern account/service families; qualified by newer Files docs.](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/2-accounts)                                                                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| STG05             | [Microsoft: Blob, Files, Queue, Table and managed block disks as different data contracts.](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/4-describe-azure-storage-services)                                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| STG06             | [Microsoft: Module summary and explicit later tier/redundancy/movement/migration scope.](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/9-summary)                                                                                                                                                                       | Rolling page; reviewed 2026-10-26 |
| STG07             | [Microsoft: Storage namespace/data services versus compute/network and access boundaries.](https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction)                                                                                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| STG08             | [Microsoft: Modern account families, premium specialization and region/feature qualifications.](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)                                                                                                                                                                             | Rolling page; reviewed 2026-10-26 |
| STG09             | [Microsoft: Blob object semantics and conditional NFS/SFTP/Data Lake capabilities.](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-overview)                                                                                                                                                                                            | Rolling page; reviewed 2026-10-26 |
| STG10             | [Microsoft: Container/blob organization and block/append/page distinctions.](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)                                                                                                                                                                                               | Rolling page; reviewed 2026-10-26 |
| STG11             | [Microsoft: Files shares and protocol-specific client contracts.](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-introduction)                                                                                                                                                                                                          | Rolling page; reviewed 2026-10-26 |
| STG12             | [Microsoft: SMB/NFS, media and management-model qualifications; one protocol per share.](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-planning)                                                                                                                                                                                       | Rolling page; reviewed 2026-10-26 |
| STG13             | [Microsoft: Queue/message relationship and small reference payloads.](https://learn.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction)                                                                                                                                                                                                    | Rolling page; reviewed 2026-10-26 |
| STG14             | [Microsoft: At-least-once delivery/no FIFO, Queue versus Service Bus; no exactly-once application guarantee.](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted)                                                                                                                    | Rolling page; reviewed 2026-10-26 |
| STG15             | [Microsoft: Producer/worker/data flow and failure/idempotency boundary.](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/web-queue-worker)                                                                                                                                                                                    | Rolling page; reviewed 2026-10-26 |
| STG16             | [Microsoft: NoSQL entity/key/attribute data versus relational requirements.](https://learn.microsoft.com/en-us/azure/storage/tables/table-storage-overview)                                                                                                                                                                                                  | Rolling page; reviewed 2026-10-26 |
| STG17             | [Microsoft: PartitionKey+RowKey identity, different entity properties and key-based access.](https://learn.microsoft.com/en-us/rest/api/storageservices/Understanding-the-Table-Service-Data-Model)                                                                                                                                                          | Rolling page; reviewed 2026-10-26 |
| STG18             | [Microsoft: Managed block disks, OS/data disk roles and separate VM relationships.](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview)                                                                                                                                                                                         | Rolling page; reviewed 2026-10-26 |
| STG19             | [Microsoft: No anonymous Blob access merely from account creation or public address.](https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-configure)                                                                                                                                                                                 | Rolling page; reviewed 2026-10-26 |
| STG20             | [Microsoft: Modern account type/kind/performance distinctions; no create operation implemented.](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create)                                                                                                                                                                              | Rolling page; reviewed 2026-10-26 |
| STG21             | [Microsoft: Current FileStorage HDD/SSD, GPv2 pay-as-you-go and separate top-level NFS Files management.](https://learn.microsoft.com/en-us/azure/storage/files/files-management-concepts)                                                                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| SRG01             | [Microsoft: Current dated AZ-900 scoped storage tier/redundancy bullets. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                                                                        | Rolling page; reviewed 2026-10-26 |
| SRG02             | [Microsoft: Official Storage module has8 units; only scoped public teaching units used. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/)                                                                                                | Rolling page; reviewed 2026-10-26 |
| SRG03             | [Microsoft: Online/manual standard GPv2 tiers, minimum periods, inherited/default assignment and Archive eligibility. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)                                                                          | Rolling page; reviewed 2026-10-26 |
| SRG04             | [Microsoft: Primary LRS/ZRS, geo/RA boundaries, service/account support and Archive exclusion. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy)                                                                                                   | Rolling page; reviewed 2026-10-26 |
| SRG05             | [Microsoft: Archive pending/completion, copy versus Set Tier, source retention, cost and rearchiving. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/blobs/archive-rehydrate-overview)                                                                                     | Rolling page; reviewed 2026-10-26 |
| SRG06             | [Microsoft: Policy conditions, periodic execution, no Archive rehydration and premium/feature limits. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview)                                                                                  | Rolling page; reviewed 2026-10-26 |
| SRG07             | [Microsoft: Current eligible Smart GPv2/zonal block blobs, online-only, explicit tiers, cloud and billing exceptions. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-smart)                                                                             | Rolling page; reviewed 2026-10-26 |
| SRG08             | [Microsoft: Planned/unplanned failover, endpoint/DNS, last-sync uncertainty and remaining application work. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/common/storage-disaster-recovery-guidance)                                                                      | Rolling page; reviewed 2026-10-26 |
| SRG09             | [Microsoft: Scoped introduction and IT prerequisite; other Storage objectives deferred. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/1-introduction)                                                                                  | Rolling page; reviewed 2026-10-26 |
| SRG10             | [Microsoft: Account/type/redundancy context qualified by current Files product source. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/2-accounts)                                                                                       | Rolling page; reviewed 2026-10-26 |
| SRG11             | [Microsoft: Six variants and asynchronous/secondary-access introduction; no generic15-minute promise credited. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/3-redundancy)                                                             | Rolling page; reviewed 2026-10-26 |
| SRG12             | [Microsoft: Four access tiers in Learn; other service content remains Part A. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/4-describe-azure-storage-services)                                                                         | Rolling page; reviewed 2026-10-26 |
| SRG13             | [Microsoft: Module scope/summary; assessment and P16 content not credited. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/9-summary)                                                                                                    | Rolling page; reviewed 2026-10-26 |
| SRG14             | [Microsoft: Managed disk LRS/ZRS, supported SSD types, force-detach data disk and separate VM recovery. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-redundancy)                                                                                          | Rolling page; reviewed 2026-10-26 |
| SRG15             | [Microsoft: Files HDD SMB geo versus SSD LRS/ZRS, no Files RA before failover. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/files/files-redundancy)                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| SRG16             | [Microsoft: Premium block tier restriction and function-specific support qualifications. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-feature-support-in-storage-accounts)                                                                                 | Rolling page; reviewed 2026-10-26 |
| SRG17             | [Microsoft: Replication versus logical history, protected backup/selective restore under declared support. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/blobs/data-protection-overview)                                                                                  | Rolling page; reviewed 2026-10-26 |
| SRG18             | [Microsoft: Current classic FileStorage HDD/SSD/account and top-level Files/protocol distinctions preserved. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/files/files-management-concepts)                                                                               | Rolling page; reviewed 2026-10-26 |
| SRG19             | [Microsoft: Second official path and Storage module relationship; no other module credited. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/)                                                                      | Rolling page; reviewed 2026-10-26 |
| SRG20             | [Microsoft: TierToArchive conditions and last-tier-change guard; no Archive rehydration via lifecycle. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-policy-structure)                                                                         | Rolling page; reviewed 2026-10-26 |
| SRG21             | [Microsoft: Last Sync Time covers earlier writes; later writes may be absent, no fixed RPO. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/common/last-sync-time-get)                                                                                                      | Rolling page; reviewed 2026-10-26 |
| SRG22             | [Microsoft: Separate unplanned promotion, asynchronous data loss and post-failover protection changes. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/storage/common/storage-failover-customer-managed-unplanned)                                                                  | Rolling page; reviewed 2026-10-26 |
| SRG23             | [Microsoft: Availability Zones are logical groups of physical sites; do not infer actual buildings or app resilience. No actual Azure interaction, protected items, copied figures or human approval.](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview)                                                                      | Rolling page; reviewed 2026-10-26 |

Den offentlige Learn-skallet viste enkelte steder en authorization-melding samtidig som artikkelteksten var lesbar. Ingen tenant, tilgangskontroll eller innlogging ble omgått. Nettkildene er referanser, ikke runtime-avhengigheter.

## Begrensninger og videre bruk

- Dette er kilde-/kodeaudit med oppgavekritikk. Ingen kvalifisert menneskelig SME, novice/IT-brukerstudie eller målt læringsoverføring er gjennomført.
- Historiske manuskripter kan være mer omfattende enn den aktive lærerflaten; utilgjengelig historikk er ikke godskrevet. Arkiverte v1-oppgaver oppgraderer aldri v2-evidens.
- Kildesjekken er tilstrekkelig til gapkartlegging. Hvert nytt modulmanuskript må sjekkes mot sine tjenestespesifikke kilder på nytt før implementering.
- [Gap-analyse og Learn-struktur](AZ900_GAP_ANALYSIS.md), [avgrensede PR-er](AZ900_EXPANSION_ROADMAP.md) og [fremtidig vurderingsplan](AZ900_ASSESSMENT_BLUEPRINT.md) utdyper tiltakene. Ingen nye moduler eller prøveeksamen er implementert her.

Teknisk kontroll: `npm run az900:audit:check` verifiserer fullstendige slots, unike ID-er, kilder, fil-/symbolpekere, planreferanser og logisk COMPLETE-terskel. Den kan ikke avgjøre pedagogisk kvalitet eller om Microsoft endrer mål etter reviewdatoen.
