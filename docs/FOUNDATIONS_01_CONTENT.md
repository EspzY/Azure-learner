# Foundations 01 — Hva er cloud computing?

## G1.3 delivery manuscript refinement — 2026-10-24

All six original unit manuscripts below and their nb.foundations purpose/mechanism/Azure/example/misconception/limit paragraphs are retained verbatim as original AzureLab material. content/instruction binds complete sections into natural sentence groups (never truncation); tests compare normalized complete text. Each unit ends in the same deliberate investigation/application; no automatic answer or changed-task submission.

New original nb.teaching scripts are authored before presentation: ida-cloud-arrival covers fictional context, exact official path/module, on-premises capacity, provisioning/virtualization, quotas and the investigation bridge (FC01/02, L01/02); ida-service-comparison covers IaaS OS/runtime, built-in App Service platform, hosting dependency/location, ready-made SaaS, container/network/data/access caveats and independent comparison (S01/S12/S39); noor-platform-requirements covers custom code/no guest OS, scope/lifecycle, metadata/hosting separation, policy receipts and explicit acceptance (S03/S12/S38). Incorrect-answer feedback remains the original specific branches. [Engine specification](INSTRUCTIONAL_SEQUENCE_ENGINE.md) describes pause/action boundaries and reviewed cues; the full localized script is in nb.ts, not hardcoded JSX. No new assessment rubric/version migration or human SME approval.

Original authored manuscript and executable teaching specification, **1.0.0**, 2026-10-23. Source cross-check by the implementing author; qualified human SME and learner review **not performed**. This is a complete local implementation candidate, not approved production courseware. Six Microsoft module objectives are mapped below; the on-premises comparison is an additional prerequisite objective. No Microsoft lesson or protected question is reproduced.

## Scope and learning contract

Track cloud foundations → region Lysningen → chapter cloud decisions → module `foundations-01`. Competencies **F01/F03**. Prerequisites: everyday application use; define server, application, data, capacity, demand, operating system, network and provider in the journal. No earlier Azure completion is required. IaaS/PaaS/SaaS is the existing follow-up, not a replacement for this module. Serverless, resilience design, Azure billing execution, real autoscaling and compliance validation remain outside this module.

| Objective                   | Unit           | Teaching → learner action → evidence                                                                                                                                   |
| --------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FC01 cloud computing        | capacity       | Service provisioning versus physical procurement → compare two demand profiles/operating choices → predict shortage and explain provider provisioning                  |
| FC02 on-premises comparison | capacity       | Ownership, capacity procurement and utilization → compare fixed six-slot and provisioned capacity → distinguish capacity from demand                                   |
| FC03 shared responsibility  | responsibility | Provider/customer duties with endpoints and retained data/access responsibilities → allocate physical/data/device controls → corrected allocations are guided evidence |
| FC04 deployment models      | models         | Public/private/hybrid and separation from service models → change topology → reject the server-room-equals-private-cloud misconception                                 |
| FC05 deployment use cases   | placement      | Choose from explicit exclusivity/integration/variable-demand requirements → allocate three workloads → rationale-specific feedback                                     |
| FC06 consumption            | metering       | Billing meter versus useful traffic; release versus idle → compare idle allocated and released slots → identify why idle provisioned compute may still incur charges   |
| FC07 pricing                | pricing        | Pay-as-you-go, commitment and interruption tradeoffs → compare stable/uncertain profiles → choose a billing approach from uncertainty and interruption tolerance       |

## Fictional setting and numerical assumptions

Noor's fictional team operates a small booking application. Ida helps investigate capacity before the existing practical App Service assignment. Four equal teaching periods; one slot serves one unit of demand per period, instantly and perfectly within this model. Profiles: campaign `[2,2,10,2]`, steady `[6,6,6,6]`, uncertain `[0,0,0,4]`. Fixed owned capacity is six or ten slots. A deliberate cloud-provisioning choice allocates exactly demand each period, using only the frozen profiles above. This is an authored idealized provisioning schedule, **not automatic Azure scaling**.

Owned-period cost for the entire four-period window is `4 × fixed capacity + 12` teaching units. Cloud pay-as-you-go is `2 × sum(allocated slots)`. A hypothetical six-slot commitment costs `4 × 6 + 2 × sum(max(demand − 6,0))`. Commitment is paid even when unused. These are **synthetic teaching units, never currency/Azure prices**. No storage, transfer, licenses, migration, tax, personnel valuation, discounts, performance/latency, procurement time, quotas, region availability or real billing rounding is calculated. Owned cost includes a fixed invented 12-unit operating allowance. It is not TCO advice.

Campaign with six owned slots: four unmet demand units. Compute explicitly: demand 16, allocated 24, served 12, idle 12, shortage 4; utilization 50%, cost 36. Ten owned slots: served16, allocated40, idle24, cost52. Explicit cloud schedule: served16, allocated16, idle0, cost32. Steady six-owned: cost36 versus cloud48; the owned alternative is cheaper within these assumptions. Uncertain demand: pay-as-you-go8 versus commitment24. A reservation discount is not a capacity deployment or guarantee. Numbers never determine a universally correct deployment model.

## Unit capacity — Fra maskinrom til tjenester

**Foundational explanation.** En applikasjon er programvaren brukeren møter. Den trenger prosessorkraft, minne, lagring og nettverk. En server leverer noe av denne kapasiteten. Etterspørsel er arbeidet brukerne ber om; kapasitet er hvor mye systemet kan håndtere. De to er ikke det samme. Cloud computing gjør slike IT-ressurser tilgjengelige som tjenester gjennom nettverk, med bestilling og administrasjon via programvare. En nettside blir ikke i seg selv en skyplattform fordi den kan nås på internett.

**Mechanism.** I et eget maskinrom må noen planlegge, kjøpe, installere og drifte maskiner før ekstra kapasitet er tilgjengelig. For lite kapasitet kan gi kø eller avvisning; for mye binder penger i ledige ressurser. En skyleverandør har en større felles infrastruktur og tilbyr avgrensede ressurser fra denne gjennom en kontrollflate. Virtualisering kan dele fysisk kapasitet mellom isolerte miljøer. Kunden bestiller en tjeneste og en støttet konfigurasjon. Fysiske maskiner finnes fortsatt; ansvaret og bestillingsmekanismen endres. Tilgjengelig kapasitet, kvoter og oppstartstid setter grenser.

**Azure and example.** I Azure kan et team be om en VM eller en administrert tjeneste uten selv å montere serveren. Det betyr ikke at en app skalerer automatisk, eller at en vellykket konfigurasjon beviser at appen virker. I vår kampanje trenger teamet ti plasser i én periode og to ellers. Seks faste plasser gir fire udekkede behov i toppen. Ti faste plasser dekker toppen, men står mye ledig ellers. Når eleven velger vår eksplisitte skyplan, bestilles kapasitet for hver periode. Ingen virkelig Azure-operasjon utføres.

**Dialogue and interaction.** Ida: «Teamet har plass til seks samtidige arbeidsenheter. Kampanjen trenger ti. Undersøk forskjellen mellom å eie kapasitet og å bestille den som en tjeneste.» Learner predicts shortage before running the experiment. Installation shows four demand/allocated/served columns; unmet work is amber, unused capacity muted. Change campaign/steady and owned/provisioned; compare actual results. Ida explains why fixed capacity does not follow demand and why provisioning needs a deliberate decision. Follow-ups: physical location of cloud hardware, why internet access alone is insufficient, quota/startup caveat.

**Misconception/verification.** Original guided question: What makes the cloud alternative different? Correct: provider-operated resources ordered through a service/control interface. Incorrect «bare en server med internett» receives the networking-versus-provisioning distinction; «ingen fysiske maskiner» receives the physical-host explanation. Require both profiles and both operating choices plus a recorded prediction and correct response. Prediction history is retained even if wrong. No clicking-through completion.

## Unit responsibility — Hvem gjør arbeidet?

**Explanation and mechanism.** Ansvar handler om hvem som må konfigurere, vedlikeholde og kontrollere en oppgave. I eget maskinrom dekker virksomheten hele stakken, selv om leverandører kan utføre arbeid på kontrakt. I offentlig sky drifter leverandøren den fysiske plattformen. Kunden må fortsatt beskytte sine data, identiteter, tilgangsvalg og det kunden selv kontrollerer. En leverandørs sikring av datasenteret retter ikke opp en feil delingsregel i applikasjonen.

**Azure application.** Med Azure Virtual Machines må kunden normalt vedlikeholde gjesteoperativsystemet. Med en passende App Service-plattform håndterer Microsoft underliggende OS/plattform; kundens kode, konfigurasjon og tilgangsvalg må fortsatt forvaltes. Ansvarsfordelingen avhenger av tjenesten og kontrollen, ikke bare ordet «sky». Egne containerinnhold krever fortsatt vedlikehold. Klient-PC-er og telefoner som bruker tjenesten forsvinner ikke fra risikobildet; kunden må beskytte endepunktene. En grov ansvarsmatrise er veiledning, ikke juridisk garanti.

**Worked example and interaction.** Ida: «Vi flytter ikke kundedataenes eier når vi flytter maskinene. Fordel tre konkrete oppgaver.» For a managed public-cloud app, assign physical host maintenance to provider, data/access decisions and customer endpoint protection to customer. The installation visibly moves actual responsibility plates; expose the original IaaS/PaaS/SaaS comparison as follow-up. A wrong data/provider allocation explains that physical protection does not validate application authorization. A wrong endpoint allocation explains that a customer's laptop remains outside the provider's operated platform. Guided correction is assisted evidence; no new XP.

**Boundary.** This small task does not certify endpoint configuration, security/compliance or every service's responsibility contract. Journal includes definition of OS, identity, authorization and the distinction between provider operation and customer control. Source L03/S01; follow-up S12.

## Unit models — Hvor og for hvem?

**Explanation.** Public, private og hybrid beskriver hvordan skymiljøet tilbys og kombineres. IaaS, PaaS og SaaS beskriver tjenesten og ansvarsgrensen. Spørsmålene er forskjellige. En private cloud trenger ikke stå i eget bygg; et dedikert miljø kan driftes hos en tredjepart. Et låst serverrom uten tjenestebasert bestilling er ikke automatisk en private cloud.

**Mechanism.** En public cloud tilbyr tjenester til mange kunder fra en leverandørstyrt plattform. Deling av fysisk infrastruktur betyr ikke at kundenes data er offentlig tilgjengelige. Isolasjon, identitet og tilgangskontroller må fortsatt utformes. En private cloud er for én organisasjon og tilbyr skyegenskaper innenfor den grensen. Den gir kontroll, men krever kapasitet, kompetanse og drift. Hybrid kombinerer private/on-premises miljøer og offentlig sky med en faktisk integrasjon, som dataflyt eller felles forvaltning. To tilfeldige apper på ulike steder er ikke i seg selv en ferdig integrert hybridarkitektur.

**Azure/example.** Teamet kan bruke Azure til en offentlig tilgjengelig nettfront mens et eldre system forblir lokalt og integreres med fronten. Nettverk, identitet, data og feilgrenser må da planlegges. Azure Arc er et eksempel på forvaltning på tvers av miljøer; det flytter ikke automatisk arbeidslasten eller gjør alle Azure-tjenester lokale. Flere offentlige skyleverandører kalles multicloud, som ikke er et synonym for private cloud eller hybrid.

**Interaction and feedback.** Change the installation topology between public/private/hybrid; labelled boundary and connector change, without creating fake network traffic. Ida asks whether a dedicated third-party self-service environment can be private cloud. Correct yes: exclusivity and operating model matter, not street address. Incorrect «bare eget bygg» explains the hosting distinction. Require inspecting all three topologies and solving the counterexample. Journal diagram has equivalent native labelled relations. Source L04.

## Unit placement — Krav før preferanser

**Explanation/mechanism.** Et valg starter med krav: hvem må kontrollere hva, hvilke data kan flyttes, hvor mye varierer lasten, og hvilken drift kan teamet håndtere? Public cloud gir tilgang til tjenester og kapasitet uten eget innkjøp av den fysiske plattformen. Det opphever ikke krav til sikkerhet, koststyring eller tilgjengelig kapasitet. Private cloud kan passe et dokumentert behov for eksklusivt miljø når organisasjonen har driftskompetanse. Hybrid kan støtte en trinnvis overgang eller et system som må bli lokalt, men legger til integrasjonsarbeid og flere feilkilder.

**Worked cases.** A temporary public event with no exclusive-hardware requirement is a plausible public-cloud choice. A team explicitly requiring an exclusively used cloud platform with its own operational team can choose private cloud, including a dedicated offsite provider. A booking frontend that must integrate with an existing local production system suggests hybrid. None proves legal compliance, SLA or lower cost. If the local system can later be retired, the hybrid choice should be revisited rather than preserved as a badge.

**Dialogue/task.** Ida: «Ikke velg skytype etter hvor moderne den høres ut. Knytt hvert valg til et krav.» Assign three workloads to public/private/hybrid using select controls and a visible topology. Feedback names the failed requirement, not only “wrong”. Public-for-exclusive explains the authored isolation requirement, not a false claim that all public-cloud options lack dedicated capacity. Private-for-temporary explains unnecessary operational commitment; hybrid-for-exclusive distinguishes a connected mix from exclusivity. Each example is a bounded best-fit exercise, not universal architecture advice. Require all three justifications through task selections. Source L04.

## Unit metering — Forbruk er ikke det samme som trafikk

**Explanation/mechanism.** Forbruksbasert betaling knytter kostnad til en måleenhet over tid: kapasitetstimer, lagrede data, forespørsler eller overføring, avhengig av tjenesten. Kundens nyttige arbeid og leverandørens faktureringsmåler er ikke nødvendigvis like. En allokert VM kan bruke fakturerbar beregningskapasitet selv uten besøkende. Å stoppe en prosess er ikke det samme som å frigi ressursen. Andre komponenter, som lagring, kan fortsette å koste selv når beregning er frigitt.

**Azure/example.** CapEx er investering, som kjøp av maskiner. OpEx er løpende drift, som tjenesteforbruk. Dette er en grunnmodell for å forstå kostnadsstruktur, ikke regnskapsråd; avtaler og regnskapsregler må vurderes konkret. Azure-tjenester har forskjellige målere og livssykluser. En budsjettvarsling er ikke et automatisk forbruksstopp. Bruk faktiske tjenestevilkår og målinger ved reelle beslutninger.

**Installation and task.** Four zero-demand periods, six explicitly allocated cloud slots: synthetic charge48 despite no useful work. Release all slots: compute-only teaching charge0. Storage/transfer are omitted, not declared free. Learner toggles allocated/released, observes available/idle slots and meter, and answers why zero traffic did not mean zero compute charge. Incorrect «sky er alltid gratis uten trafikk» points to the allocated-capacity meter. Require both experiments and the causal response. Ida: «Se på hva måleren teller. Ikke bare på hva brukeren gjør.» Source L05; source S32 for budgets.

## Unit pricing — Fleksibilitet har vilkår

**Explanation/mechanism.** Pay-as-you-go gir lavere binding når behovet er usikkert, men ikke nødvendigvis lavest enhetspris. En forpliktelse kan gi rabatt på kvalifisert bruk mot risikoen for å betale for noe som ikke brukes. Reservations og savings plans er faktureringstilbud med egne regler; de er ikke knapper som oppretter eller automatisk skalerer kapasitet. Reservation gjelder samsvarende ressursbruk; savings plan knytter rabatt til en avtalt timebasert pengeforpliktelse for kvalifisert bruk. Vilkår og produktdekning må sjekkes.

**Example/counterexample.** For steady six-slot demand, our invented commitment24 is cheaper than pay-as-you-go48. For uncertain `[0,0,0,4]`, the same commitment24 is more expensive than pay-as-you-go8. Existing owned steady capacity36 can also beat cloud48 under our deliberately incomplete assumptions. Spot can suit restartable work because capacity may be reclaimed; a critical job that cannot tolerate interruption must not be selected only because its quoted unit cost is low. None of these examples represents an actual Azure quote or comprehensive TCO.

**Interaction.** Compare both demand profiles and pricing switches; preview total allocated versus billed commitment, unused commitment and overflow. Ida explains the difference between billing commitment and capacity. Guided question: for an uncertain non-interruptible short campaign, which choice avoids a fixed commitment and eviction risk? Pay-as-you-go is best in the authored constraints; commitment and Spot get different explanations. Journal covers monitoring usage before commitments and excluded cost components. Sources L06/L07/L08.

## Changed independent application — museum booking pilot

One frozen original task, rubric1.0.0, eight criteria mapped to all objectives. Different demand `[1,1,9,1]` and a four-slot fixed system. No worked solution, per-item validation or hints during the active attempt. Commit all answers before feedback. The shortage answer is a constructed bounded integer, not a provided multiple-choice option. Draft answers survive exit/reload without becoming a submission. Journal/instruction access during the attempt records assistance visibly. The first submitted answer set is immutable; retries are practice. Prior instruction does not by itself invalidate an independent task; help during that task does. Local data cannot prove identity or external independence.

1. Identify service-based provisioning rather than an internet-connected server (FC01).
2. Predict unmet demand at the peak: five units, not total demand or idle capacity (FC02).
3. Allocate customer data/access/endpoint duties to customer despite provider host operation (FC03).
4. Classify an exclusive third-party self-service cloud as private (FC04).
5. Choose hybrid for the pilot that must integrate with the retained local collection system (FC05).
6. Explain why an idle allocated VM can remain metered (FC06).
7. Select pay-as-you-go for unknown short-lived non-interruptible demand (FC07).
8. Recognize that unused commitment can still be paid, and that the synthetic result is not an Azure quote (FC07).

After submission show each criterion, chosen answer, correct/incorrect causal explanation and assistance/retry classification. Do not report a mastery percentage. The unit summary separately lists introduced, practiced, guided-correct and first unaided criterion observations. A passed independent task can support a narrowly labelled diagnostic result without falsely claiming guided work was performed. Module guided completion requires all six practical predicates; independent review remains a separate status. Neither awards XP or completes Chapter01.

## Source mapping and review

Reviewed 2026-10-23. L01 is the [module index](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/) with six objectives/eight units. L02 [cloud mechanism](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/3-what-cloud-compute) maps FC01/02; L03 [shared responsibility](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility) maps FC03; L04 [deployment models](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/5-define-cloud-models) maps FC04/05; L05 [consumption](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/6-describe-consumption-based-model) maps FC06. L06 [pricing options](https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/7a-describe-cost-optimization-options), L07 [Reservations](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations), L08 [savings plans](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview) map FC07. Existing S12 and S32 support explicit caveats. External content is reference-only; no live Platform API or copied assessment.

Author cross-check: all six official module objectives plus on-premises prerequisite have explanatory mechanisms, worked/counterexamples, practical decisions, original feedback and changed-task criteria. The current AZ-900 study guide also names serverless; it is explicitly **not covered** here. Source documents describe more than this bounded installation. Arithmetic, wording and objective bindings require automated checks plus actual interface review. Human SME/beginner/experienced-engineer reviews remain open; success in this fixture cannot establish retained or professional competence.

## Implementing-author content review — 2026-10-23

This is a source/arithmetic/implementation review, not a qualified independent SME review. Cross-checks performed:

- L01 six official objectives map to FC01/03–07; FC02 is the explicitly added prerequisite. Serverless from the exam overlay remains excluded. All six units contain purpose, mechanism, Azure behavior, worked example, misconception, limitations and source mapping in the actual local journal.
- L02/04: physical cloud hardware remains real; internet access alone is insufficient; private cloud can be offsite; public does not mean public customer data; hybrid needs integration. The installation illustrates these boundaries without pretending to configure network connectivity.
- L03/S12: retained customer data/access/devices, service-specific OS boundary and container caveat are preserved. The first module introduces the boundary; service-type breadth remains a follow-up gap.
- L05/S32: allocation differs from useful traffic, compute release does not imply every charge stops, and budgets are not automatic spending caps.
- L06–08: commitments are billing offers, not deployment/scaling guarantees; unused commitment and Spot interruption risk have distinct explanations. Synthetic costs are labelled and explicitly omit TCO components. Paired cases include an owned-capacity and pay-as-you-go counterexample.
- Pure tests verify the declared arithmetic, invalid/unsupported inputs, event order, first numeric/assisted/retry evidence and corrupt/conflicting storage. Browser tests exercise actual content, controls, journal, submission and resume; they cannot validate understanding.

Outstanding: named Azure-SME review, beginner explanation/transfer study, experienced-engineer challenge review, delayed retention, human accessibility and representative-device review. Fixed client-visible answer keys are suitable for local practice, not secure exams. External assistance and learner identity cannot be authenticated. No mastery percentage or exam readiness can be inferred.

## Reproducible learner walkthrough

1. Open /expedition-3d, choose Ta kontroll, approach Ida (or use orientation-assisted walking), initiate conversation and choose Undersøk cloud computing med Ida. The player walks to the real installation. Semantic mode provides the same teaching when WebGL is unavailable.
2. Predict a shortage, run both campaign/steady loads with owned/cloud choices and compare the four results. Deliberately choose the internet-only explanation, inspect correction, then justify service provisioning. Open/close the journal and retain the current investigation.
3. Allocate physical/data/client duties; inspect public/private/hybrid; apply the three workload constraints. Run idle allocated and released compute, then compare steady/uncertain loads under both price models. Each unit requires its actual observations plus a correct causal response before guided progression.
4. Review the seven objective rows. Enter the museum pilot without seeing item feedback, construct the numeric shortage and make the remaining decisions. Journal use records help; all answers commit together. Retry is explicitly practice and never replaces the first criterion record.
5. Exit/reload during an unfinished draft or after submission; re-enter through the installation and resume. Return to the existing service-model/Noor quest at any time. The original technical work and awards are preserved. Module reset affects only this module; explicit all-data deletion includes it.

Actual commands/results and reviewed screenshots live in [project status](PROJECT_STATUS.md), keeping this manuscript focused on educational behavior.
