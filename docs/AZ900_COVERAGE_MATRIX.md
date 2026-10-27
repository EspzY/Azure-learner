# AZ-900 — sporbar dekningsmatrise

> Generert fra [auditdata](audits/az900-2026-07-20.json) med `npm run az900:audit:check -- --write`. Rediger funnene i JSON; kontrollen avviser en utdatert matrise. Datafilen importeres aldri av læringsplattformen.

Kontrollert **2026-10-26**. Offisielt grunnlag: Skills measured **2026-07-20**, fortsatt gjeldende på kontrolldato. Koderevisjon: PR18, `codex/azure-portal-exact-icons`, commit `184b818a041919b9a6461310c3ba39074e020641`. Denne PR-en endrer ingen mål, rubrikk, elevregistrering eller simulatorregel.

Scoped update **P00**, 2026-10-27: 1.1.07, 2.2.01. Scoped serverless implementation. Other PR19 rows and their 2026-10-26 source review remain unchanged; no human approval.

Scoped update **P01**, 2026-10-27: 2.1.01, 2.1.02, 2.1.03. Only physical Part A2.1.01-03 re-audited. Other54 objective rows, especially2.1.04-07, retain previous semantics. No learner evidence upgrade or human approval.

Scoped update **P02**, 2026-10-27: 2.1.04, 2.1.05, 2.1.06, 2.1.07. Only four scoped management rows re-audited. Part A historical source/evidence semantics unchanged; combined module projects seven implemented objectives without learner upgrades. Human approval unperformed.

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
| 1. Describe cloud concepts                  | 25–30%         |          15 |        7 |       8 |       0 |          0 |
| 2. Describe Azure architecture and services | 35–40%         |          27 |        7 |       7 |      13 |          0 |
| 3. Describe Azure management and governance | 30–35%         |          15 |        0 |       8 |       7 |          0 |

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

## 1.1 Cloud computing

| Slot / stabil audit-ID                 | Krav (kort temaetikett)                    | Status   | A B C D E F | Eksisterende lokale mål     | Evidens | Neste PR |
| -------------------------------------- | ------------------------------------------ | -------- | ----------- | --------------------------- | ------- | -------- |
| 1.1.01<br>`az900.cloud.definition`     | Hva cloud computing innebærer              | COMPLETE | V V V V V V | FC01, FC02, F01             | F       | P17, P18 |
| 1.1.02<br>`az900.cloud.responsibility` | Delt operasjonelt ansvar                   | COMPLETE | V V V V V V | FC03, ST01, ST02, ST03, F01 | F, R, S | P17, P18 |
| 1.1.03<br>`az900.cloud.models`         | Public, private og hybrid cloud            | PARTIAL  | V V V P V V | FC04, F01                   | F       | P03      |
| 1.1.04<br>`az900.cloud.model-use`      | Bruksområder for hver deployment model     | PARTIAL  | V V V P V V | FC05, F01                   | F       | P03      |
| 1.1.05<br>`az900.cloud.consumption`    | Forbruk, allokering og måling              | COMPLETE | V V V V V V | FC06, F03                   | F       | P17, P18 |
| 1.1.06<br>`az900.cloud.pricing`        | PAYG, forpliktelser og avbrytbar kapasitet | PARTIAL  | V V V P V V | FC07, F03                   | F       | P03, P04 |
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

**Fasetter:** Public: PARTIAL; Private: COMPLETE; Hybrid: COMPLETE.

**Faktisk funn:** Modell/manuskript, valg og sammenkobling; uavhengig exclusive og integration gjelder private/hybrid.

**Rest / beslutning:** Ingen egen ny-kontekst public-avgrensning; fast toalternativtest gir begrenset bevisbredde.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.1.04 — Bruksområder for hver deployment model

**Fasetter:** Public-bruk: PARTIAL; Private-bruk: COMPLETE; Hybrid-bruk: COMPLETE.

**Faktisk funn:** Tre guidede plasseringstilfeller; endret oppgave vurderer privat eksklusivitet og reell hybridintegrasjon.

**Rest / beslutning:** Uavhengig valg som faktisk gjør public egnet mangler; ikke bare gjenkjenning av private/hybrid.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.1.05 — Forbruk, allokering og måling

**Fasetter:** Forbruk, allokering og måling: COMPLETE.

**Faktisk funn:** Tids-/kapasitetsmodell viser allokert tomgang, frigjøring og gjenværende kostnadstyper. Endret idle-kriterium krever allokert forbruk også uten trafikk; avviser trafikk-only.

**Rest / beslutning:** Ingen identifisert A–F-mangel på dette avgrensede AZ-900-nivået. Fast oppgavesett og menneskelig validering er fortsatt begrensninger.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/), [RES](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations), [SAV](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.1.06 — PAYG, forpliktelser og avbrytbar kapasitet

**Fasetter:** PAYG: COMPLETE; Reservation/savings commitment: PARTIAL; Spot: PARTIAL.

**Faktisk funn:** Original prismodell med eksplisitte undervisningstall; uncertain og commitment vurderer variabel bruk og ubrukt forpliktelse.

**Rest / beslutning:** Ingen selvstendig anbefaling av forpliktelse ved stabil bruk eller egnet avbrytbar jobb; Spot/kapasitetsforbehold må også vurderes.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/), [RES](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations), [SAV](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.1.07 — Serverless

**Fasetter:** Hendelser/utførelse: COMPLETE; Operasjonelt ansvar: COMPLETE; Hostingavhengig forbruk og skalering: COMPLETE.

**Faktisk funn:** P00: original theory and hosting boundaries, event→trigger→execution→output model with prediction, responsibility and two new decision scenarios with reasons and alternative feedback. Isolated replayed supplement; first/help/retry/abandon preserved.

**Rest / beslutning:** A–F documented for this scoped objective; qualified human SME, screen-reader, novice/IT usability and measured transfer remain unperformed. No claim that one learner or AZ-900 is mastered.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M01](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/), [FUNC](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview), [SL-FUNCTIONS](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview), [SL-HOSTING](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale), [SL-BINDINGS](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings), [SL-FLEX](https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan), [SL-RESPONSIBILITY](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 1.2 Benefits

| Slot / stabil audit-ID                                | Krav (kort temaetikett)                 | Status  | A B C D E F | Eksisterende lokale mål | Evidens | Neste PR      |
| ----------------------------------------------------- | --------------------------------------- | ------- | ----------- | ----------------------- | ------- | ------------- |
| 1.2.01<br>`az900.benefits.availability-scale`         | Tilgjengelighet og skalering            | PARTIAL | V V V P V V | CB01, F02, F03          | BA      | P03, P01      |
| 1.2.02<br>`az900.benefits.reliability-predictability` | Pålitelighet og forutsigbarhet          | PARTIAL | V V V P P V | CB02, F02, F03          | BR      | P03, P14      |
| 1.2.03<br>`az900.benefits.security-governance`        | Sikkerhet og styring som cloud-fordeler | PARTIAL | V V V P P V | CB03, G03, I01          | BG      | P03, P11, P12 |
| 1.2.04<br>`az900.benefits.manageability`              | Administrasjon av og i cloud            | PARTIAL | V V V P P V | CB04, A01               | BM      | P03, P13      |

### 1.2.01 — Tilgjengelighet og skalering

**Fasetter:** High availability: PARTIAL; Vertical/horizontal scaling: PARTIAL.

**Faktisk funn:** Kapasitet, feil og ruting kan endres før observasjon; unmet vurderer et nytt numerisk bortfall.

**Rest / beslutning:** Ny tallverdi alene vurderer ikke valg av HA-oppsett versus riktig skaleringstype; ingen variantfamilier.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M02](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.2.02 — Pålitelighet og forutsigbarhet

**Fasetter:** Reliability: PARTIAL; Predictability: PARTIAL.

**Faktisk funn:** Avhengighetsfeil og målt trend forklares; dependency/forecast evalueres separat.

**Rest / beslutning:** dependency-teksten røper at mer kapasitet ikke hjelper og peker mot restore. Mangler ny diagnose og begrunnelse av alle plausible alternativer.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M02](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.2.03 — Sikkerhet og styring som cloud-fordeler

**Fasetter:** Security benefit: PARTIAL; Governance benefit: PARTIAL.

**Faktisk funn:** Kundeansvar, least privilege, rolle/scope og custom location-deny; policy-spørsmålet avviser at én regel beviser alt.

**Rest / beslutning:** Denne ene moteksempeltesten vurderer ikke selvstendig skillet mellom sikkerhetsgevinst, tilgang og styring.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M02](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 1.2.04 — Administrasjon av og i cloud

**Fasetter:** Management of cloud: PARTIAL; Management in cloud: PARTIAL.

**Faktisk funn:** Manuell/repeterbar ønsket konfigurasjon; Portal/CLI/PowerShell/IaC beskrives.

**Rest / beslutning:** Endret template-spørsmål peker allerede på feil verdi. Ingen selvstendig kanalvalg eller feildiagnose med full alternativforklaring.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M02](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 1.3 Service types

| Slot / stabil audit-ID               | Krav (kort temaetikett)                | Status   | A B C D E F | Eksisterende lokale mål | Evidens | Neste PR |
| ------------------------------------ | -------------------------------------- | -------- | ----------- | ----------------------- | ------- | -------- |
| 1.3.01<br>`az900.services.iaas`      | IaaS og retained gjesteansvar          | COMPLETE | V V V V V V | ST01, C01, C02          | S, V    | P17, P18 |
| 1.3.02<br>`az900.services.paas`      | PaaS og retained applikasjonsansvar    | COMPLETE | V V V V V V | ST02, C01               | S, P    | P17, P18 |
| 1.3.03<br>`az900.services.saas`      | SaaS og retained produktadministrasjon | COMPLETE | V V V V V V | ST03, I01               | S       | P17, P18 |
| 1.3.04<br>`az900.services.use-cases` | Velge IaaS, PaaS eller SaaS fra krav   | PARTIAL  | V V V P P V | ST04, F01, R01          | S, L    | P03      |

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

**Fasetter:** IaaS-valg: COMPLETE; PaaS-valg: COMPLETE; SaaS-valg: PARTIAL.

**Faktisk funn:** Krav/tradeoff-modell; architecture+reason godtar begrunnet IaaS eller støttet PaaS. Det fortsatt tilgjengelige Portal-kompatibilitetsoppdraget vurderer også readyModel=saas for ferdig samarbeid; dette er et eget v1-spor.

**Rest / beslutning:** Current v2 vurderer SaaS-avgang, ikke et nytt SaaS-valg. Portal v1 har et smalt modellvalg, men gir bare kort kriterieforklaring, uten full årsak for plausible IaaS/PaaS-alternativer. Bevar dette bidraget; integrer bedre transfer/feedback i v2 uten å konvertere gamle svar.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M03](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

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

| Slot / stabil audit-ID                 | Krav (kort temaetikett)                                 | Status  | A B C D E F | Eksisterende lokale mål | Evidens             | Neste PR |
| -------------------------------------- | ------------------------------------------------------- | ------- | ----------- | ----------------------- | ------------------- | -------- |
| 2.2.01<br>`az900.compute.compare`      | VMs, containers og functions                            | PARTIAL | P P P P P P | C02, C03, C04           | S, V, SL            | P00, P05 |
| 2.2.02<br>`az900.compute.vm-options`   | VM, VM Scale Sets, availability sets og Virtual Desktop | PARTIAL | P P P P P P | C02                     | V                   | P05      |
| 2.2.03<br>`az900.compute.vm-resources` | Ressurser som støtter en VM                             | PARTIAL | V V V P P V | C02, N01, G02           | V                   | P05, P06 |
| 2.2.04<br>`az900.compute.hosting`      | Web apps, containers og VM-hosting                      | PARTIAL | P P P P P P | C01, C02, C03           | S, V, P             | P05      |
| 2.2.05<br>`az900.networking.services`  | VNet, subnet, peering, DNS, VPN Gateway og ExpressRoute | PARTIAL | P P P M P P | N01, N02, N03           | V, H                | P06, P07 |
| 2.2.06<br>`az900.networking.endpoints` | Public og private endpoints                             | MISSING | M M M M M N | N03                     | Ingen aktiv dekning | P07      |

### 2.2.01 — VMs, containers og functions

**Fasetter:** VM: COMPLETE; Containers: MISSING; Functions: COMPLETE.

**Faktisk funn:** VM/OS-kontroll er lært og anvendt. P00 now teaches Functions, event execution and Functions/VM control tradeoffs.

**Rest / beslutning:** Containers and complete three-way compute comparison remain missing. P00 does not complete this composite objective.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [FUNC](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview), [VM](https://learn.microsoft.com/en-us/azure/virtual-machines/overview), [SL-FUNCTIONS](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview), [SL-HOSTING](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale), [SL-BINDINGS](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings), [SL-FLEX](https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan), [SL-RESPONSIBILITY](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.2.02 — VM, VM Scale Sets, availability sets og Virtual Desktop

**Fasetter:** Azure VM: COMPLETE; VM Scale Sets: MISSING; Availability sets: MISSING; Azure Virtual Desktop: MISSING.

**Faktisk funn:** VM-bundle/vedlikeholdsansvar er reelt modellert.

**Rest / beslutning:** Tre andre alternativer mangler; ingen skala/fault-domain/desktop-sammenligning.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.2.03 — Ressurser som støtter en VM

**Fasetter:** VM/disks/NIC/VNet/subnet: PARTIAL.

**Faktisk funn:** Atomisk opprettelse, avhengighetsfeil, valg av eksisterende VNet og inspeksjon av OS/data disk og NIC.

**Rest / beslutning:** Uavhengig oppgave kontrollerer opprettelse og inspected-ID-er, ikke at studenten forklarer hvorfor hver avhengighet er nødvendig.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [VM](https://learn.microsoft.com/en-us/azure/virtual-machines/overview). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.2.04 — Web apps, containers og VM-hosting

**Fasetter:** Web Apps: COMPLETE; VM-hosting: PARTIAL; Container-hosting: MISSING.

**Faktisk funn:** Customkode/runtime-planvalg og VM-gjestekontroll er forklart.

**Rest / beslutning:** Container-alternativ og uavhengig sammenligning av alle hostingformene mangler.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [PLAN](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.2.05 — VNet, subnet, peering, DNS, VPN Gateway og ExpressRoute

**Fasetter:** VNet: PARTIAL; Subnet: PARTIAL; Peering: MISSING; Azure DNS: MISSING; VPN Gateway: MISSING; ExpressRoute: MISSING.

**Faktisk funn:** VNet/subnet/NIC-relasjoner og begrenset adressekonfigurasjon i VM-lab.

**Rest / beslutning:** Ingen komplett nettverksmekanisme eller selvstendig koblings-/navneoppslags-/hybridbeslutning; grafkant er ikke trafikk.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [M06](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.2.06 — Public og private endpoints

**Fasetter:** Public endpoint: MISSING; Private endpoint: MISSING.

**Faktisk funn:** Ingen authored endpoint-sammenligning eller vurdering. Fravær av en offentlig IP i VM-modellen er ikke undervisning om private endpoints.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M05](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/), [M06](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

## 2.3 Storage

| Slot / stabil audit-ID               | Krav (kort temaetikett)                   | Status  | A B C D E F | Eksisterende lokale mål | Evidens             | Neste PR |
| ------------------------------------ | ----------------------------------------- | ------- | ----------- | ----------------------- | ------------------- | -------- |
| 2.3.01<br>`az900.storage.services`   | Sammenligne Azure Storage services        | MISSING | M M M M M N | D01                     | Ingen aktiv dekning | P08      |
| 2.3.02<br>`az900.storage.tiers`      | Storage access tiers                      | MISSING | M M M M M N | D01                     | Ingen aktiv dekning | P09      |
| 2.3.03<br>`az900.storage.redundancy` | Storage redundancy                        | MISSING | M M M M M N | D01, O03                | Ingen aktiv dekning | P09      |
| 2.3.04<br>`az900.storage.accounts`   | Storage account options og storage types  | MISSING | M M M M M N | D01, G02                | Ingen aktiv dekning | P08      |
| 2.3.05<br>`az900.storage.file-tools` | Verktøy for filflytting og synkronisering | MISSING | M M M M M N | D01, R03                | Ingen aktiv dekning | P16      |
| 2.3.06<br>`az900.storage.migration`  | Migrering til Azure                       | MISSING | M M M M M N | R03, D01                | Ingen aktiv dekning | P16      |

### 2.3.01 — Sammenligne Azure Storage services

**Fasetter:** Blob: MISSING; Files: MISSING; Queues: MISSING; Tables: MISSING.

**Faktisk funn:** Managed disks i VM-lab er ikke undervisning om Storage-kontotjenestene.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M07](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.3.02 — Storage access tiers

**Fasetter:** Hot: MISSING; Cool: MISSING; Cold: MISSING; Archive: MISSING.

**Faktisk funn:** Ingen aktiv tiermodell, tilgangsmønster eller gjenhentingsscenario.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M07](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.3.03 — Storage redundancy

**Fasetter:** LRS: MISSING; ZRS: MISSING; GRS/RA-GRS: MISSING; GZRS/RA-GZRS: MISSING.

**Faktisk funn:** Generisk replika-/kapasitetsmodell dokumenterer ikke Azure Storage-redundans, failover eller datatapgrenser.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M07](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 2.3.04 — Storage account options og storage types

**Fasetter:** Account options: MISSING; Storage types: MISSING.

**Faktisk funn:** Ingen konto-/tjeneste-/ytelsesmodell. Diskprofile i VM er en annen kontekst.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M07](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

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

| Slot / stabil audit-ID            | Krav (kort temaetikett)             | Status  | A B C D E F | Eksisterende lokale mål | Evidens             | Neste PR |
| --------------------------------- | ----------------------------------- | ------- | ----------- | ----------------------- | ------------------- | -------- |
| 3.1.01<br>`az900.cost.drivers`    | Faktorer som påvirker cloud-kostnad | PARTIAL | P P V P P V | FC06, FC07, F03         | F                   | P04      |
| 3.1.02<br>`az900.cost.calculator` | Pricing Calculator                  | MISSING | M M M M M N | F03                     | Ingen aktiv dekning | P04      |
| 3.1.03<br>`az900.cost.management` | Cost Management capabilities        | MISSING | M M M M M N | F03, G04                | Ingen aktiv dekning | P04      |
| 3.1.04<br>`az900.cost.tags`       | Tags                                | MISSING | M M M M M N | G04                     | Ingen aktiv dekning | P04      |

### 3.1.01 — Faktorer som påvirker cloud-kostnad

**Fasetter:** Bruk/allokering/commitment: COMPLETE; Andre Azure-kostnadsdrivere: PARTIAL.

**Faktisk funn:** Tomgang, tidsenhet, måling og binding er undervist; ressurs-/regionsvalg har forklaring, men ingen full Azure-driveroppgave.

**Rest / beslutning:** Mangler samlet selvstendig sammenligning av resource type/tier/region/traffic/licensing/offer; syntetiske tall er ikke Azure-priser.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/), [RES](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations), [SAV](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.1.02 — Pricing Calculator

**Fasetter:** Estimere og sammenligne antakelser: MISSING.

**Faktisk funn:** Lokal hypotetisk prisberegning er ikke et besøk eller en undervisning om Pricing Calculator.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.1.03 — Cost Management capabilities

**Fasetter:** Analyse: MISSING; Budsjett: MISSING; Varsling og scope: MISSING.

**Faktisk funn:** Generisk budsjett-/trendomtale er ikke en Cost Management-modul eller operativ økonomioversikt.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

### 3.1.04 — Tags

**Fasetter:** Metadataformål: MISSING; Kostnads-/eierskapsorganisering: MISSING.

**Faktisk funn:** Tags finnes i roadmap/proposal, ikke et fullstendig aktivt fag- eller oppgavespor.

**Rest / beslutning:** Mangler egen forklaring, relevant mekanisme/praksis, uavhengig scenario og begrunnet vurdering for de angitte emnene.

**Kilder:** [EXAM](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900), [M09](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/). Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.

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

| ID                | Kilde og anvendelse                                                                                                                                                                                                                | Synlig versjon/dato               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| EXAM              | [Microsoft: Current 57 skill bullets, version and weights](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                                             | 2026-06-22                        |
| PA                | [Microsoft: Public assessment scope and limitations; no question bank accessed](https://learn.microsoft.com/en-us/credentials/certifications/practice-assessments-for-microsoft-certifications)                                    | 2026-10-16                        |
| FAQ               | [Microsoft: Practice assessment and third-party preparation boundaries](https://learn.microsoft.com/en-us/credentials/certifications/frequently-asked-questions)                                                                   | Rolling page; reviewed 2026-10-26 |
| P1                | [Microsoft: Three cloud-concept modules in official order](https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/)                                                                 | Rolling page; reviewed 2026-10-26 |
| P2                | [Microsoft: Five current architecture/service modules](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/)                                                                  | Rolling page; reviewed 2026-10-26 |
| P3                | [Microsoft: Four management/governance modules](https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/)                                                                                            | Rolling page; reviewed 2026-10-26 |
| PX                | [Microsoft: Eight additional guided projects, not an exam coverage definition](https://learn.microsoft.com/en-us/training/paths/introduction-cloud-infrastructure-apply-azure-skills-guided-projects/)                             | Rolling page; reviewed 2026-10-26 |
| M01               | [Microsoft: Cloud definition, responsibility, models, consumption; exam serverless not enumerated here](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/)                                                | Rolling page; reviewed 2026-10-26 |
| M02               | [Microsoft: Availability/scalability, reliability/predictability, security/governance, manageability; sustainability supplemental](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/)       | Rolling page; reviewed 2026-10-26 |
| M03               | [Microsoft: IaaS/PaaS/SaaS and use cases](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/)                                                                                                        | Rolling page; reviewed 2026-10-26 |
| M04               | [Microsoft: Physical infrastructure and management infrastructure](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/)                                                            | Rolling page; reviewed 2026-10-26 |
| M05               | [Microsoft: Current title: Describe Azure compute services; VM, AVD, containers, Functions, hosting; AI/ML/IoT/Edge supplemental](https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/)  | Rolling page; reviewed 2026-10-26 |
| M06               | [Microsoft: VNet, VPN, ExpressRoute, DNS; separate current networking module](https://learn.microsoft.com/en-us/training/modules/describe-azure-networking-services/)                                                              | Rolling page; reviewed 2026-10-26 |
| M07               | [Microsoft: Accounts, redundancy, services, migration and file movement](https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/)                                                                      | Rolling page; reviewed 2026-10-26 |
| M08               | [Microsoft: Directories, authentication, external access, CA, RBAC, trust, defense, Defender; encryption/key management supplemental](https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/) | Rolling page; reviewed 2026-10-26 |
| M09               | [Microsoft: Cost factors, calculator, cost management, tags and optimization](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/)                                                                  | Rolling page; reviewed 2026-10-26 |
| M10               | [Microsoft: Purview, Policy, locks; Service Trust Portal supplemental](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-azure-for-governance-compliance/)                                                | Rolling page; reviewed 2026-10-26 |
| M11               | [Microsoft: Portal, CLI/PowerShell, Arc, ARM; cross-check separate IaC exam bullet](https://learn.microsoft.com/en-us/training/modules/describe-features-tools-manage-deploy-azure-resources/)                                     | Rolling page; reviewed 2026-10-26 |
| M12               | [Microsoft: Advisor, Service Health, Monitor](https://learn.microsoft.com/en-us/training/modules/describe-monitoring-tools-azure/)                                                                                                 | Rolling page; reviewed 2026-10-26 |
| SR                | [Microsoft: Customer data, identities, access and service-specific shared tasks](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)                                                              | 2026-08-24                        |
| ARM               | [Microsoft: Control plane, scopes, group lifecycle and metadata location](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview)                                                                      | 2026-08-04                        |
| FUNC              | [Microsoft: Triggers/bindings and hosting-plan-dependent serverless behavior](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)                                                                          | 2026-09-21                        |
| REG               | [Microsoft: Regions, zone support and service-specific availability](https://learn.microsoft.com/en-us/azure/reliability/regions-overview)                                                                                         | Rolling page; reviewed 2026-10-26 |
| PAIR              | [Microsoft: Nonpaired regions and no automatic application failover](https://learn.microsoft.com/en-us/azure/reliability/regions-paired)                                                                                           | Rolling page; reviewed 2026-10-26 |
| PLAN              | [Microsoft: Plan compute/OS/region and app dependency](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans)                                                                                                 | Rolling page; reviewed 2026-10-26 |
| VM                | [Microsoft: Guest maintenance and associated resource configuration](https://learn.microsoft.com/en-us/azure/virtual-machines/overview)                                                                                            | Rolling page; reviewed 2026-10-26 |
| RES               | [Microsoft: Commitment discount, matching and utilization limits](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations)                                                    | Rolling page; reviewed 2026-10-26 |
| SAV               | [Microsoft: Eligible compute spend commitment, not a capacity guarantee](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview)                                                       | Rolling page; reviewed 2026-10-26 |
| IAAS              | [Microsoft: IaaS operational responsibility and use cases](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/2-describe-infrastructure-service)                                                      | Rolling page; reviewed 2026-10-26 |
| PAAS              | [Microsoft: PaaS retained code/data/access and service caveats](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/3-describe-platform-service)                                                       | Rolling page; reviewed 2026-10-26 |
| SAAS              | [Microsoft: SaaS application maintenance versus customer access/data](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/4-describe-software-service)                                                 | Rolling page; reviewed 2026-10-26 |
| SL-FUNCTIONS      | [Microsoft: Managed event-based code, physical hosting and use cases](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)                                                                                  | Rolling page; reviewed 2026-10-26 |
| SL-HOSTING        | [Microsoft: Plan-dependent scale, cold starts, timeout and billing qualifications](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale)                                                                        | Rolling page; reviewed 2026-10-26 |
| SL-BINDINGS       | [Microsoft: Exactly one trigger; optional bindings; invocation is not success](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings)                                                                | Rolling page; reviewed 2026-10-26 |
| SL-FLEX           | [Microsoft: On-demand and always-ready baseline, no universal free idle](https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan)                                                                            | Rolling page; reviewed 2026-10-26 |
| SL-RESPONSIBILITY | [Microsoft: Functions as PaaS and retained customer code/data/access](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)                                                                         | Rolling page; reviewed 2026-10-26 |
| AR01              | [Microsoft: AZ-900 Skills Measured](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                                                                                    | Rolling page; reviewed 2026-10-26 |
| AR02              | [Microsoft: Core architectural components module/units](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/)                                                                       | Rolling page; reviewed 2026-10-26 |
| AR03              | [Microsoft: Regions and geographies](https://learn.microsoft.com/en-us/azure/reliability/regions-overview)                                                                                                                         | Rolling page; reviewed 2026-10-26 |
| AR04              | [Microsoft: Region example metadata](https://learn.microsoft.com/en-us/azure/reliability/regions-list)                                                                                                                             | Rolling page; reviewed 2026-10-26 |
| AR05              | [Microsoft: Paired and nonpaired regions](https://learn.microsoft.com/en-us/azure/reliability/regions-paired)                                                                                                                      | Rolling page; reviewed 2026-10-26 |
| AR06              | [Microsoft: Availability Zones](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview)                                                                                                                   | Rolling page; reviewed 2026-10-26 |
| AR07              | [Microsoft: Zonal resource resiliency](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-zonal-resource-resiliency)                                                                                           | Rolling page; reviewed 2026-10-26 |
| AR08              | [Microsoft: Zone support by service](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-service-support)                                                                                                       | Rolling page; reviewed 2026-10-26 |
| AR09              | [Microsoft: Physical infrastructure and security](https://learn.microsoft.com/en-us/azure/security/fundamentals/physical-security)                                                                                                 | Rolling page; reviewed 2026-10-26 |
| AR10              | [Microsoft: Region selection](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-setup-guide/regions)                                                                                                    | Rolling page; reviewed 2026-10-26 |
| AR11              | [Microsoft: Azure Government](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-welcome)                                                                                                           | Rolling page; reviewed 2026-10-26 |
| AR12              | [Microsoft: Azure in China](https://learn.microsoft.com/en-us/azure/china/overview-operations)                                                                                                                                     | Rolling page; reviewed 2026-10-26 |
| AR13              | [Microsoft: Reliability and sovereignty](https://learn.microsoft.com/en-us/azure/reliability/concept-reliability-sovereignty)                                                                                                      | Rolling page; reviewed 2026-10-26 |
| AR14              | [Microsoft: Architecture/services path](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/)                                                                                 | Rolling page; reviewed 2026-10-26 |
| AM01              | [Microsoft: Current AZ-900 Skills Measured; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)                                     | Rolling page; reviewed 2026-10-26 |
| AM02              | [Microsoft: Core architectural components public module/units; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/)         | Rolling page; reviewed 2026-10-26 |
| AM03              | [Microsoft: Azure Resource Manager overview; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview)                                            | Rolling page; reviewed 2026-10-26 |
| AM04              | [Microsoft: Management groups overview; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/governance/management-groups/overview)                                                      | Rolling page; reviewed 2026-10-26 |
| AM05              | [Microsoft: Manage resource groups Portal; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal)                         | Rolling page; reviewed 2026-10-26 |
| AM06              | [Microsoft: Azure Policy overview; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/governance/policy/overview)                                                                      | Rolling page; reviewed 2026-10-26 |
| AM07              | [Microsoft: RBAC scope overview; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview)                                                          | Rolling page; reviewed 2026-10-26 |
| AM08              | [Microsoft: Entra tenant and subscription association; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/entra/fundamentals/how-subscriptions-associated-directory)                         | Rolling page; reviewed 2026-10-26 |
| AM09              | [Microsoft: CAF resource organization; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org)                        | Rolling page; reviewed 2026-10-26 |
| AM10              | [Microsoft: Azure Policy scope; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/scope)                                                                   | Rolling page; reviewed 2026-10-26 |
| AM11              | [Microsoft: Policy effect basics; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-basics)                                                         | Rolling page; reviewed 2026-10-26 |
| AM12              | [Microsoft: CAF management group design; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups)    | Rolling page; reviewed 2026-10-26 |
| AM13              | [Microsoft: CAF subscription design; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-subscriptions)            | Rolling page; reviewed 2026-10-26 |
| AM14              | [Microsoft: Billing accounts and scopes; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/view-all-accounts)                                          | Rolling page; reviewed 2026-10-26 |
| AM15              | [Microsoft: Resource providers and types; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types)                           | Rolling page; reviewed 2026-10-26 |
| AM16              | [Microsoft: Resource group deletion; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group)                                       | Rolling page; reviewed 2026-10-26 |
| AM17              | [Microsoft: Control plane and data plane; scoped qualifications in CORE_ARCHITECTURE_MANAGEMENT](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane)                           | Rolling page; reviewed 2026-10-26 |
| AM18              | [Microsoft: Explicit new-app shared plan in another group by resource ID; scoped Case B teaching](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-create)                                       | Rolling page; reviewed 2026-10-26 |
| AM19              | [Microsoft: Existing-app plan changes have additional webspace/region/OS constraints, not arbitrary move support](https://learn.microsoft.com/en-us/azure/app-service/app-service-plan-manage)                                     | Rolling page; reviewed 2026-10-26 |

Den offentlige Learn-skallet viste enkelte steder en authorization-melding samtidig som artikkelteksten var lesbar. Ingen tenant, tilgangskontroll eller innlogging ble omgått. Nettkildene er referanser, ikke runtime-avhengigheter.

## Begrensninger og videre bruk

- Dette er kilde-/kodeaudit med oppgavekritikk. Ingen kvalifisert menneskelig SME, novice/IT-brukerstudie eller målt læringsoverføring er gjennomført.
- Historiske manuskripter kan være mer omfattende enn den aktive lærerflaten; utilgjengelig historikk er ikke godskrevet. Arkiverte v1-oppgaver oppgraderer aldri v2-evidens.
- Kildesjekken er tilstrekkelig til gapkartlegging. Hvert nytt modulmanuskript må sjekkes mot sine tjenestespesifikke kilder på nytt før implementering.
- [Gap-analyse og Learn-struktur](AZ900_GAP_ANALYSIS.md), [avgrensede PR-er](AZ900_EXPANSION_ROADMAP.md) og [fremtidig vurderingsplan](AZ900_ASSESSMENT_BLUEPRINT.md) utdyper tiltakene. Ingen nye moduler eller prøveeksamen er implementert her.

Teknisk kontroll: `npm run az900:audit:check` verifiserer fullstendige slots, unike ID-er, kilder, fil-/symbolpekere, planreferanser og logisk COMPLETE-terskel. Den kan ikke avgjøre pedagogisk kvalitet eller om Microsoft endrer mål etter reviewdatoen.
