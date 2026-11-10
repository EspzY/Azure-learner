# Foundations 3.1A — opening-module storyboard

Candidate manuscript1, 2026-10-25; **not owner-approved 3.1B production content**. Original Bokmål proposals below precede presentation work. Existing L1 manuscript remains the implemented reference; it is not overwritten. Dependency/terminology ownership: [pedagogy blueprint](FOUNDATIONS_PEDAGOGY_BLUEPRINT.md). Visual contracts V01–06: [visual system](VISUAL_LEARNING_SYSTEM.md). All new UI copy is ultimately localized in `src/content/nb.ts`.

## Sequence and evidence boundary

S01–S05 are the AzureLab prerequisite bridge, not extra Microsoft module objectives. S06–S12 cover the existing FC01–FC07 objectives; service types/naming are an explicit follow-up bridge. Content can be revisited directly. An experienced learner can attempt a separately labelled diagnostic without claiming guided exposure. Scenes are mental-model stages inside `/learn/computing`, not separate apps or compulsory cinematic clicks. Each retains a readable full text and semantic model. No narration/route/view event completes a criterion.

### S01 — A familiar request

- **Objective/prior/intention:** B01 distinguish browser/client and server request; everyday browsing only. Anchor teaching in one observed action before vocabulary.
- **Proposed learner text:** «Du åpner en produktside i nettbutikken. Nettleseren på PC-en din ber et annet program om innholdet. Denne beskjeden kaller vi en forespørsel, eller request. Programmet som ber, har rollen klient. Når tjenesten svarer med innhold, kan nettleseren vise siden. Svaret kan også fortelle at noe gikk galt.»
- **Visual/action/rule:** V01; Send, then optional manual trace. Finite explanatory states requested→application→response, no timers/real fetch. The path represents communication, not management containment.
- **Feedback/transition:** «Nettleseren sendte en beskjed. Den flyttet ikke programmet fra serveren til PC-en din.» Ask where the shop's server-side calculation occurs; next inspect that computer.
- **Misconception/source/access/acceptance:** Internet is not cloud by itself (L02). Original shop trace is a general-computing illustration, not measured protocol behavior. Ordered HTML list matches every highlighted stage. Learner can locate client/server and distinguish request/response without knowing HTTP/DNS.

### S02 — What is serving the page?

- **Objective/prior/intention:** B02 server/application distinction after B01. Separate physical object, software and service role.
- **Text:** «Serveren er her en fysisk datamaskin som leverer en tjeneste til andre. Applikasjonen er programvaren som utfører butikkens oppgaver. Den kan for eksempel finne produktopplysninger og lage et svar. Ordet server brukes også om programvare som tilbyr en tjeneste; i denne tegningen peker det på datamaskinen.»
- **Visual/action/rule:** V02 highlights chassis then application band. Toggle optional catalogue branch: «Noen løsninger henter data fra en database: organiserte data og programvare som lar oss lese og endre dem. En enkel statisk side kan leveres fra filer uten en egen database.» Toggle changes the illustrative lookup path only.
- **Feedback/transition:** Choosing “server is the webpage” shows device/software contrast. Move to why the computer cannot do unlimited work.
- **Misconception/source/access/acceptance:** General computing, BL01/BL02 support host/guest distinction later; do not infer every website uses a separate database. Native component list carries same explanation. Learner points to machine versus executing application and supplies a non-DB example.

### S03 — Inside the physical server

- **Objective/prior/intention:** B03 physical compute/memory/storage/OS; needs application and server. Establish finite resources before numbers.
- **Text:** «CPU-en utfører programmets instruksjoner. RAM er arbeidsminnet for data som brukes nå. Lagring beholder for eksempel bilder mellom arbeidsøkter. Nettverket lar maskinen utveksle beskjeder. Operativsystemet fordeler maskinens ressurser og lar applikasjonen kjøre. Mer lagringsplass gir ikke automatisk mer prosessorkraft.»
- **Visual/action/rule:** V02 real-looking cutaway; inspect CPU/RAM/storage/network/OS/app, each drawing matches native selection and example. No fake hardware utilization measurement.
- **Feedback/transition:** For confusing RAM/disk: «Arbeidskopien kan ligge i minnet mens den varige filen ligger på lagring.» Continue to sharing physical infrastructure.
- **Misconception/source/access/acceptance:** General simplified architecture, no benchmark/SKU; BL01/BL02 context. Semantic definition list and tactile-free buttons. Check which part executes instructions versus retains product photos, with causal explanation rather than part-name recall.

### S04 — One host, separate virtual computers

- **Objective/prior/intention:** B04 VM/hypervisor, needs B03/OS. Explain abstraction without unlimited capacity.
- **Text:** «Én fysisk vert kan kjøre flere virtuelle maskiner. Hver VM har tildelte virtuelle ressurser og sitt eget gjesteoperativsystem. Hypervisoren er laget som gjør dette mulig og styrer tilgangen til den fysiske verten. To virtuelle maskiner betyr ikke at vi har kjøpt to nye fysiske maskiner.»
- **Visual/action/rule:** V03; simplified host8 RAM units, guestA3/guestB3 initially. SetA5 → accepted total8; setB4 → requested9, reject without changing accepted8. These units are memory-budget teaching units, **distinct from workload bundles later**. No vCPU oversubscription/real isolation claim.
- **Feedback/transition:** «Forespørselen trenger mer enn denne modellens vert har tilgjengelig. En ny VM lager ikke mer fysisk minne.» Next examine who owns/prepares the host.
- **Misconception/source/access/acceptance:** BL01/BL02, source review before shipping. Cloud service implementations differ; the picture is not all-Azure internals. Native selects plus requested/accepted table. Learner can distinguish host/hypervisor/guest and reject9>8 for the stated model, without claiming real Hyper-V forbids every overcommit method.

### S05 — From procurement to provisioning

- **Objective/prior/intention:** FC01 and B05, needs B01–04. Teach control path separately from website traffic.
- **Text:** «I eget maskinrom må noen skaffe og klargjøre kapasiteten. En skyleverandør tilbyr definerte IT-tjenester fra infrastrukturen sin. Kunden ber om en støttet ressurs gjennom en administrasjonsflate eller et API, en programmatisk måte å sende forespørselen på. Å bestille og klargjøre ressursen kalles provisioning. Maskinvaren finnes fortsatt.»
- **Visual/action/rule:** V04 control/workload lanes. Compare manual procurement illustration versus provider configuration request; supported choice accepts, unavailable teaching capacity rejects explicitly. No measured delay/real Azure deployment. Azure VM is example, not implemented resource creation.
- **Feedback/transition:** Shop traffic is not a management order. «Bestillingen gir en konfigurasjon, ikke bevis på at butikkoden fungerer.» Then quantify one already-understood workload.
- **Misconception/source/access/acceptance:** L02/BL02, quotas/startup/provider supply caveats. Native ordered trace and clear control labels. Explain internet-connected traditional host versus service provisioning, and why cloud isn't infinite.

### S06 — Understand the capacity model before using it

- **Objective/prior/intention:** FC02, B03/B05/application; establish unit/period/assumptions before formula.
- **Text:** «Butikken har mer arbeid når kampanjen åpner. For å se forholdet mellom arbeid og kapasitet lager vi en enkel undervisningsmodell. Én arbeidspakke er en oppdiktet mengde arbeid som trenger én kapasitetsenhet i én hel undervisningstime. Den er ikke én kunde, HTTP-forespørsel, CPU-kjerne, VM eller Azure-størrelse. Hver time regnes for seg; arbeid flyttes ikke til neste time i denne modellen.»
- **Visual/action/rule:** One named hour09–10; demand2 and capacity6. Reveal served2, unused4, unmet0 with tile/rail/table. “Betjent” is work processed within the model interval; actual queue/latency excluded. Define demand/allocated/served only as those parts appear.
- **Feedback/transition:** «Vi hadde kapasitet igjen. Det er forskjellig fra at noen ikke fikk arbeidet sitt utført.» Ask why unused4 is not unmet4. Next changes only the workload.
- **Misconception/source/access/acceptance:** Original abstraction, no Azure source asserted for numbers. Formula/conservation in blueprint. Show text and quantities without motion. Learner explains one bundle, one period, allocation and both remainders before prediction.

### S07 — Predict, run, explain and compare

- **Objective/prior/intention:** FC02 with explicit prior S06; transfer a mental model, not copy a result.
- **Text before result:** «Nå kommer en annen dag: timene09–10,10–11,11–12,12–13 trenger3,3,8,3 arbeidspakker. Kapasiteten er6 i hver time. Hvor mange pakker blir ikke betjent i den travleste timen? Registrer en antakelse før du kjører. Den kan være feil; vi undersøker årsaken etterpå.»
- **Visual/action/rule:** V05 new fixture, no result text before commit. Run computes per-period conserved quantities. Capacity changes6→10 require a fresh prediction/run and mark prior result stale; compare executed snapshots with both assumptions labelled. No cost or cloud automatic-success mode.
- **Feedback:** On peak prediction2: «Det avgjørende er forskjellen i samme time:8−6=2. Ledig kapasitet tidligere kan ikke brukes på nytt her.» On prediction9/total: explain per-hour shortfall versus summed demand/idle. At10 show no unmet, more unused; no claim that more is always optimal.
- **Transition/misconception/source/access/acceptance:** Scalability is ability to change capacity under constraints, not enabled autoscaling. Original rules, L02 for cloud caveat. Native input/table/explicit Run; reduced motion parity. Separate versioned changed registration task tests count+causal criteria (blueprint); proof itself only demonstrates guided design, writes no evidence.

### S08 — Who does the work now?

- **Objective/prior/intention:** FC03, needs physical host/OS/provider. Responsibility is about tasks, not magically secured objects.
- **Text:** «Leverandøren kan drifte den fysiske plattformen. Teamet må fortsatt ta riktige valg for egne data, tilganger og klientmaskiner. Hvem som vedlikeholder operativsystem og runtime avhenger av tjenesten. Runtime er miljøet som kjører applikasjonskoden. Azure Virtual Machines og en App Service-plattform overlater ulike oppgaver til kunden.»
- **Visual/action/rule:** Reuse V06 reviewed matrix, first worked physical-host task then changed allocation of data/access/client protection. Existing model stays authority. Guide explains why the learner moved a task.
- **Feedback/transition:** Wrong provider-data answer distinguishes physical security from application authorization. «Vi må også velge hvilket miljø tjenestene skal leveres fra.»
- **Misconception/source/access/acceptance:** L03/S01/S12; endpoint here means customer device, not Azure private endpoint. Buttons and text matrix. Explain retained customer duty and service-dependent OS boundary; no security competence claim.

### S09 — Which cloud environment?

- **Objective/prior/intention:** FC04, needs provider/private organization identity intuitively; compare axes, not labels alone.
- **Text:** «Public cloud tilbys til flere kunder av en leverandør. Det gjør ikke kundedata offentlige. Private cloud er et skymiljø for én organisasjon og kan drives hos en tredjepart. Hybrid kobler sammen miljøer som må fungere sammen. Eierskap, hvem som bruker miljøet og faktisk integrasjon er viktigere enn adressen til bygget.»
- **Visual/action/rule:** Three labelled organization/provider boundaries; private “offsite exclusive” toggle keeps private classification; hybrid connection states “integration required”, no fake traffic. Distinguish service-type responsibility axis.
- **Feedback/transition:** Own building alone doesn't establish private cloud capabilities. Next choose from concrete requirements, not fashion.
- **Misconception/source/access/acceptance:** L04; no compliance guarantee. Equivalent relation list. Learner correctly classifies offsite exclusive self-service environment and explains why.

### S10 — Apply environment requirements

- **Objective/prior/intention:** FC05, needs S09 plus understanding of retained local app.
- **Text:** «Et kort arrangement, et krav om eksklusivt skymiljø og en ny nettfront som må bruke et beholdt lokalt system er tre forskjellige behov. Velg ut fra kravet som faktisk avgjør valget. Ingen modell er alltid billigst eller tryggest.»
- **Visual/action/rule:** Reuse three supported placement cases, each requires model **and constraint explanation**, not match only. Alternatives remain explicit; public cloud can have dedicated options, so exclusive case must specify an exclusive cloud platform under the fictional operator's remit.
- **Feedback/transition:** Name the unsatisfied requirement. Integration has operations/failure work; a line does not perform it. Next ask what the service meter counts.
- **Misconception/source/access/acceptance:** L04, original cases; no regulatory advice. Native selectors with spoken/typed rationale equivalent. Observe justified choice for all three, classify corrections as guided.

### S11 — What does consumption measure?

- **Objective/prior/intention:** FC06; needs allocation vs served, storage persistence. Separate customer work from billing dimension.
- **Text:** «En tjeneste kan måle tiden kapasitet er allokert, ikke bare antall besøkende. Null besøk betyr derfor ikke nødvendigvis null målt bruk. Å stoppe applikasjonen er heller ikke det samme som å frigi en ressurs. Lagring og andre tjenester kan fortsatt ha egne kostnader.»
- **Visual/action/rule:** Idle allocated6 across four hours then explicit compute release. Introduce a separate billing dimension explicitly: one teaching capacity unit can process one bundle/hour; six units allocated for four hours produce24 capacity-unit-hours while served work is0 bundles. Only then define2 invented credits per capacity-unit-hour. Do not relabel work-bundle totals as bundle-hours. Charge48 vs0 compute-only, storage/transfer excluded, no actual pricing.
- **Feedback/transition:** Meter follows its defined quantity. Define consumption, CapEx/OpEx as conceptual procurement/ongoing spending, not accounting advice. Then compare binding terms, not just unit price.
- **Misconception/source/access/acceptance:** L05/S32, budgets aren't automatic caps. Native meter table. Learner predicts idle charge from allocation and cannot infer every Azure bill ends after compute release.

### S12 — Pricing models and decisions

- **Objective/prior/intention:** FC07; S11 units, sum and commitment definition. Financial tradeoffs without fake prices.
- **Text:** «Fleksibel forbruksbetaling og en betalingsforpliktelse fordeler risiko forskjellig. Rabatt kan lønne seg ved jevnt, kvalifisert forbruk. Ubrukt binding kan koste mer ved usikkert behov. En reservation eller savings plan er et faktureringstilbud med vilkår, ikke en knapp som oppretter kapasitet. Spot kan avbrytes og passer ikke alle oppgaver.»
- **Visual/action/rule:** Preserve existing synthetic paired steady/uncertain examples and owned-capacity counterexample; introduce rates/flat commitment/overflow separately with units. No side-by-side verdict until both configurations run under same profile. No price API.
- **Feedback/transition:** Compare total not discounted unit alone. New independent module task commits all criteria before feedback; existing rubric remains accessible/version-pinned. Summary shows exposed/practiced/first-unaided/corrected separately; then recommends official Benefits (planned) or available Service Types without skipped credit.
- **Misconception/source/access/acceptance:** L06–08; commitments do not guarantee capacity, stop all charges or configure autoscaling. Table and derivation. Learner justifies flexible vs commitment vs interruptible option under changed workload; no retention/readiness/SME claim.

### S13 — Bridge into resource organization and naming

- **Objective/prior/intention:** G01 prerequisite application, not new FC completion. Needs provider/control boundary and subsequent service types. Explain scope before form field.
- **Text:** «I laboratoriet skal vi konfigurere ressurser, ikke bestille virkelige Azure-tjenester. En subscription er en administrasjons- og faktureringsgrense. En resource group samler relaterte ressurser for forvaltning. Den er ikke datamaskinen som kjører appen. Gruppens metadataregion er et annet valg enn hostingressursens sted.»
- **Visual/action/rule:** Existing typed hierarchy/architecture, geography as properties. In real name field inspect `rg-webapp-dev` tokens; native selected token explanation, optional convention warning separated from actual validation. No automatic rename/submission. Full naming contract in blueprint.
- **Feedback/transition:** `dev` changes a name, not security; valid unprefixed group allowed. Enter original course lab and return to exact debrief; preserve current source-backed policy/hosting workflows.
- **Misconception/source/access/acceptance:** S03/BL03–06; Azure-specific versus simulator subset displayed. No nested regions or implied tenant resource container. Semantic node/relation/field descriptions. Learner explains name parts and group location, then can perform unchanged validated operation.

## Review and Phase 3.1B handoff

The separate [implementation specification](FOUNDATIONS_31B_HANDOFF.md) owns files/contracts/migrations/tests. No work starts in 3.1B before a separate owner instruction.

Review candidate with (1) true beginner: think aloud from shop to peak prediction without outside coaching; (2) IT-experienced adult: skip elementary explanation, explain VM/provisioning limits and choose changed constraints; (3) qualified Azure SME: responsibility, naming, quota and pricing caveats; (4) keyboard/screen-reader reviewer. Ask the beginner to define a work bundle/hour **before** prediction and explain unused vs unmet **after** changing capacity. Record first wording, confidence, help, errors and elapsed confusion separately from correctness. Do not use “did you like it?” as a learning measure.

Unacceptable: learner thinks a tile is one user/CPU, a VM creates physical capacity, provider mode automatically scales everything, a name configures security, or corrected guided success means certification readiness. Revise the causal picture/wording and repeat with a new learner; never relabel coached answers as independent evidence. These exercises and delayed transfer/retention are **planned, not performed**. Owner design review, SME and learner acceptance remain open.
