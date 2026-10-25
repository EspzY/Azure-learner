# Cloud Benefits — full original teaching specification

3.2 / reviewed2026-10-25. Authored before presentation. Competencies F02/F03; human SME and learner review not performed. Canonical Bokmål copy is nb.expansion; existing Service Types manuscripts are retained rather than duplicated here. Official sources and supplementary classifications: [register](FUNDAMENTALS_SUPPLEMENTARY_READING.md).

Du vet nå hvordan skyen tilbyr ressurser. Nettbutikken vår trenger også å tåle feil, håndtere endringer og styres forsvarlig. Vi undersøker hva skyegenskaper kan gi — og hvilke valg teamet må gjøre for å få nytte av dem. Ingen undersøkelse her lager eller overvåker virkelige ressurser.

## availability — Kapasitet er ikke det samme som tilgjengelighet

CB01 · skille vertikal/horizontal skalering, redundans og tilgjengelighet.

**Forståelse før aktiviteten.** Fra modul 1 kjenner du server, ressurskapasitet og etterspørsel. En instans er én kjørende kopi av en applikasjonskomponent. Redundans betyr at flere kopier kan overta arbeid.

**Grunnforklaring.** Butikken kan ha en kraftig server som håndterer hele kampanjen, men likevel stoppe hvis akkurat den serveren svikter. Tilgjengelighet handler om at den nødvendige funksjonen kan brukes når den trengs. High availability er bevisste tiltak for å redusere avbrudd. Det er et annet spørsmål enn hvor mange oppgaver maskinen rekker når alt virker.

**Mekanisme.** Vertikal skalering endrer kapasiteten til en instans, for eksempel ved å velge mer CPU eller minne. Horisontal skalering endrer antallet instanser. Flere kopier hjelper først når trafikken faktisk kan nå dem og applikasjonen tillater parallell behandling. En fast rute til den første instansen blir fortsatt et enkelt feilpunkt. Redundans må også omfatte nødvendige data og andre avhengigheter; ekstra webservere retter ikke alle feil.

**Azure og operativ anvendelse.** Azure gir tjenester og konfigurasjoner for skalering og redundans. Hvilke muligheter som finnes, avhenger av tjeneste, tier og arkitektur. Elasticity er å tilpasse kapasiteten opp og ned når behovet endres. Autoskalering trenger regler, grenser, signaler og tid til å gjøre kapasiteten klar; den lager ikke øyeblikkelig eller ubegrenset kapasitet. En SLA beskriver et bestemt tjenesteløfte med vilkår og eventuelle rettsmidler. Den er ikke en måling av din applikasjons tilgjengelighet eller et løfte om null nedetid.

**Gjennomarbeidet eksempel.** Anta én undervisningsinstans som kan behandle fire jobber per minutt, og etterspørsel på seks. Når vi øker instansstørrelsen til åtte, kan den håndtere alle seks så lenge den virker. Dette løser kapasitetsproblemet i denne modellen. Nå skal du selv forutsi hva som skjer når denne ene instansen svikter, og sammenligne med flere mindre kopier og en rute som bruker friske kopier.

**Misforståelse og moteksempel.** To instanser betyr ikke automatisk dobbel tilgjengelighet. Samme strømforsyning, dataavhengighet eller feil i trafikkstyringen kan ramme begge. Omvendt kan én større instans gi bedre kapasitet uten å tåle tap av instansen. Vi beregner derfor observerbar kapasitet etter feil, ikke en oppdiktet Azure-SLA.

**Forutsetninger og grenser.** En jobb er en oppdiktet arbeidsmengde. Hver instans kan behandle fire eller åtte slike jobber per minutt. Jobber deles perfekt mellom tilgjengelige instanser; kø, oppstartstid, tilstand, data, kostnad og latency er utelatt. Feilen rammer den første instansen. Fast rute bruker bare den første; balansert rute bruker de friske. Dette er en forklaringsmodell, ikke en lastbalanserer eller virkelig feiltest.

**Terminology.** Instans: En kopi av en komponent som kan behandle arbeid. Enkelt feilpunkt: En nødvendig del som alene kan stoppe hele funksjonen. Headroom: Ledig kapasitet som kan absorbere mer arbeid eller tap av en kopi.

**Learner sequence.** Undersøk forskjellen mellom kapasitet og feilmargin. En større maskin og en ekstra kopi løser forskjellige problemer. Kjør en frisk enkeltinstans. Forutsi deretter utført arbeid med feil, og sammenlign med to instanser og balansert rute. Bare kapasitet som fortsatt kan nås etter feilen, bidrar. Resultatet viser utført og udekket arbeid.

**Original guided application.** En kraftigere enkeltinstans dekker trafikken. Hva må undersøkes før teamet kan si at løsningen tåler instansfeil?

- recovery: Alternative kopier, trafikkrute og nødvendige avhengigheter — Ja. Nok kapasitet uten feil er ikke det samme som en fungerende vei etter feil.
- size: Bare mer minne på samme instans — Mer minne kan bedre kapasitet, men hjelper ikke når den eneste instansen er nede.
- cloud: At ressursen ligger i en offentlig sky — Skyleverandørens infrastruktur fjerner ikke behovet for å utforme og teste hele applikasjonsflyten.

## reliability — Finn årsaken før du velger tiltak

CB02 · forklare pålitelighet, recovery og forutsigbarhet.

**Forståelse før aktiviteten.** Du kjenner instans, kapasitet og trafikkrute. En avhengighet er en annen tjeneste som en nødvendig funksjon trenger, for eksempel lageroppslag før et kjøp.

**Grunnforklaring.** Et raskt produktbilde er ikke nok hvis kunden ikke kan fullføre kjøpet. Vi må følge den viktige brukerflyten. Reliability handler her om å tåle feil og gjenopprette funksjonen på en planlagt måte. Tilgjengelighet beskriver om funksjonen kan brukes; recovery beskriver hvordan vi får den tilbake etter avbrudd.

**Mekanisme.** Den samme synlige feilen kan ha ulike årsaker. For mye arbeid kan overskride kapasitet. En instans kan ha sviktet. En felles datatjeneste kan være utilgjengelig selv om alle webkopiene virker. En stigende belastning kan varsle at kapasiteten snart blir for liten. Et tiltak må påvirke den delen som faktisk begrenser flyten. Mer webkapasitet reparerer ikke lagerdatatjenesten. En ekstra region krever også fungerende data, identitet, trafikkvalg og en testet bytteprosess.

**Azure og operativ anvendelse.** Azure Monitor kan samle relevante signaler, og varsler kan gjøre avvik synlige når de er riktig konfigurert. Observasjoner, hypoteser, tiltak og kontroll av resultatet er en driftsprosess; et dashboard utfører ikke hele prosessen. Well-Architected Framework fremhever blant annet avhengigheter, redundans, recovery og testing. Test både tap og tilbakeføring, og kontroller at reservekapasitet faktisk er tilgjengelig. Vi oppretter ingen Monitor-ressurs her.

**Gjennomarbeidet eksempel.** I en rolig periode betjener butikken to jobber per minutt; senere fire og seks. Med kapasitet seks ser alt håndterbart ut i siste prøve, men det er ingen margin igjen. En trend er ikke i seg selv bevis på avbrudd. Teamet bør måle videre og planlegge tiltak før neste topp. I eksperimentet undersøker du også andre hendelser der samme kapasitetsøkning ikke hjelper.

**Misforståelse og moteksempel.** Forutsigbarhet betyr ikke garanti. Ytelsesplanlegging bygger på målinger og lasttester; endret kode eller avhengigheter kan endre behovet. Kostnadsplanlegging bygger på faktiske målere, priser, ressursnivå, dataoverføring og bruksmønster. Kalkulatorer og budsjetter hjelper, men et budsjett er ikke automatisk en av/på-bryter. Et estimat er ikke en faktura.

**Forutsetninger og grenser.** Hendelsene er frosne undervisningssituasjoner. Kapasitetsproblemet har etterspørsel ti og kapasitet seks; ekstra kapasitet øker den til tolv. De andre situasjonene har etterspørsel seks. En gjenopprettet avhengighet eller korrigert rute åpner den modellerte veien. Trenden er to/fire/seks uten feil. Ingen virkelige logger, tid til recovery, priser eller regional failover simuleres.

**Terminology.** Kritisk flyt: En ende-til-ende-funksjon virksomheten trenger. Recovery: Å gjenopprette en nødvendig funksjon etter feil. Prognose: Et begrunnet anslag basert på forutsetninger og observasjoner.

**Learner sequence.** Velg et tiltak som endrer riktig årsak. Mer kapasitet hjelper bare hvis det er kapasiteten som begrenser. Undersøk alle fire hendelsene. Sammenlign en feil behandling med tiltaket som påvirker den aktuelle årsaken. En sviktende felles avhengighet kan holde flyten stengt selv med flere webressurser. Trend-planlegging endrer beredskapen, ikke allerede målt trafikk.

**Original guided application.** Begge webinstansene virker, men felles lageroppslag er nede. Hva er den relevante undersøkelsen?

- dependency: Undersøk og gjenopprett avhengigheten og test hele kjøpsflyten — Ja. Flyten trenger lageroppslaget; flere friske webkopier erstatter det ikke.
- scale: Øk alltid webkapasiteten — Det endrer ikke den feilede lageravhengigheten i denne situasjonen.
- region: Anta at en ekstra region automatisk løser alt — Regional spredning alene konfigurerer ikke data, trafikk eller recovery.

## governance — Tillatelse, policy og sikkerhet er forskjellige spørsmål

CB03 · skille tilgang, organisasjonsregler og teknisk beskyttelse.

**Forståelse før aktiviteten.** En subscription og en resource group er management-scope. En identitet representerer en bruker eller arbeidslast. Autorisasjon bestemmer hva identiteten får gjøre.

**Grunnforklaring.** Teamet må både kunne utføre arbeid og følge virksomhetens regler. En bruker kan ha lov til å opprette en ressurs, men likevel be om en konfigurasjon som bryter en policy. Og en akseptert konfigurasjon kan fremdeles ha sårbar kode eller uforsvarlige tilgangsvalg. Ett grønt resultat kan ikke svare på alle tre spørsmålene.

**Mekanisme.** Azure RBAC knytter en principal, en rolle og et scope sammen. Rollen beskriver handlinger; scopet avgrenser hvor de gjelder. Minste privilegium betyr å gi nødvendig tilgang fremfor unødvendig brede rettigheter. Azure Policy vurderer ressurs- eller handlingsegenskaper opp mot definerte regler ved aktuelle scope. Policy kan blant annet brukes til standardisering, revisjon og håndheving; hvilke effekter som gjelder avhenger av definisjonen. Vi viser bare én egendefinert location-deny-regel.

**Azure og operativ anvendelse.** I den eksisterende AzureLab-motoren er App Sandbox tildelt en Web-lokasjonsregel som bare tillater West Europe for støttede plan/app-ressurser. Gruppens metadata i Norway East er en annen egenskap og omfattes ikke av denne regelen. Shared Sandbox har ikke samme assignment. Undersøk scope, type, forespurt lokasjon og begrunnelse før du endrer noe. En gyldig forespørsel i et annet scope kan få et annet resultat.

**Gjennomarbeidet eksempel.** En autorisert utvikler ønsker en Web-plan i North Europe under App Sandbox. En avgrenset kopi av den virkelige lokale motoren vurderer dette i undersøkelsen. Du sammenligner deretter en tillatt lokasjon og det andre scope-et. Kvitteringen forklarer resultatet. Kopien endrer ikke portalens inventar, og demonstrasjonen utfører ingen faktisk Azure-operasjon.

**Misforståelse og moteksempel.** At en ressurs følger en lokasjonsregel, beviser ikke at data behandles lovlig eller at hele løsningen er sikker. Compliance handler om dokumentert oppfyllelse av relevante krav; dette krever mer enn én teknisk innstilling. Leverandørens sikkerhetsmekanismer erstatter heller ikke kundens ansvar for data, kode og tilgang. Ikke gi større rolle bare for å omgå et policyavslag.

**Forutsetninger og grenser.** Undersøkelsen antar at aktøren er autorisert; RBAC, rettigheter, data-residency, personvern og compliance evalueres ikke. Den gjenbruker den registrerte custom Web-policyen på en engangskopi. Dette er ikke alle Azure Policy built-ins, effekter eller tillatelsesmodeller. Ressursene fra prøven blir ikke Portal-ressurser.

**Terminology.** Principal: En bruker, gruppe eller arbeidsidentitet som kan gis tilgang. Rolle og scope: Hva en identitet kan gjøre, og hvor tilgangen gjelder. Governance: Beslutninger, standarder og oppfølging som styrer ressursbruk og risiko.

**Learner sequence.** Forklar hvorfor samme Web-forespørsel kan få ulikt resultat. Organisatorisk tillatelse til konfigurasjon er forskjellig fra brukerens rettigheter og appens sikkerhet. Prøv begge lokasjoner i App Sandbox, og sammenlign med Shared Sandbox. Les de faktiske modellkvitteringene. Et avslag beholder aktive objekter uendret. Å bytte metadataregion er ikke en korreksjon av planens resource location.

**Original guided application.** En plan blir tillatt av lokasjonsregelen. Hva vet vi da?

- policy: Denne forespørselen oppfyller akkurat den vurderte regelen — Riktig. Rolle, sikker kode og bredere krav trenger egne vurderinger.
- secure: Hele appen er sikker og compliant — Den ene policyen undersøker verken kode, brukertilgang eller alle relevante krav.
- role: Alle brukere har fått administratorrettigheter — En tillatt ressurskonfigurasjon tildeler ingen roller.

## management — Gjenta en konfigurasjon — også feil kan gjentas

CB04 · skille styring av ressurser fra metodene som styrer dem.

**Forståelse før aktiviteten.** En konfigurasjon er et sett med ønskede egenskaper. En standard er et krav teamet har bestemt, ikke en automatisk garanti fra skyen.

**Grunnforklaring.** Noor skal klargjøre tre undervisningsmiljøer som skal følge samme regionale standard. Hun kan sette hvert felt manuelt, eller bruke ett gjenbrukbart konfigurasjonsgrunnlag. Begge metodene krever gjennomgang. Et program kan gjenta en feil mer konsekvent enn et menneske.

**Mekanisme.** Management of the cloud handler om hva vi styrer: ressurser, konfigurasjon, kapasitet, helse og avvik. Management in the cloud handler om hvordan vi styrer: Portal gir et grafisk arbeidsområde; CLI og PowerShell sender kommandoer; API-er er programmerbare grensesnitt. Infrastructure as code beskriver ønsket infrastruktur i filer som kan versjoneres og gjennomgås. Bicep og ARM templates er eksempler på deklarative beskrivelser i Azure. De er ikke det samme som en skjerm, et shell eller et overvåkingssignal.

**Azure og operativ anvendelse.** Azure Resource Manager gir et felles management-lag for støttede ressursoperasjoner. Flere klienter kan be om samme slags endring, mens validering og styringsregler fortsatt gjelder. Azure Monitor og varsler kan vise tilstand eller utløse en konfigurert arbeidsflyt, men å samle et signal er ikke automatisk å forstå eller rette årsaken. Automatisering trenger avgrensninger, tilgang, feilbehandling og kontroll av konsekvensene.

**Gjennomarbeidet eksempel.** Standarden i vår øvelse er West Europe for alle tre miljøene. Ett manuelt avvik gjør resultatet inkonsistent. En mal kan sette samme region tre ganger. Velger du en feil malregion, blir alle tre konsekvent feil mot standarden. Sammenlign både likhet mellom miljøene og oppfyllelse av kravet; det er to forskjellige observasjoner.

**Misforståelse og moteksempel.** IaC betyr ikke at alt som står i filen er sikkert eller hensiktsmessig. Versjonskontroll gjør endringen sporbar, ikke automatisk korrekt. En parameter kan være feil. En plan må gjennomgås, valideres og testes før den brukes. Konsistens, policy-etterlevelse og driftstilstand er ulike dimensjoner.

**Forutsetninger og grenser.** Tre regionfelt og én malverdi er en oppdiktet konfigurasjonssammenligning. Vi kjører ingen CLI, PowerShell, Bicep, ARM eller deployering og endrer ikke Portal-ressurser. Samme verdi kopieres deterministisk; rekkefølge, avhengigheter, drift detection, nettverksfeil og rettighetsmotor er ikke modellert.

**Terminology.** CLI: Et kommandolinjegrensesnitt til en tjeneste. Deklarativ: Beskriver ønsket sluttkonfigurasjon fremfor alle håndgrep. Konfigurasjonsavvik: En egenskap som avviker fra den bestemte standarden.

**Learner sequence.** Skille repeterbarhet fra riktig konfigurasjon. Én dårlig parameter kan forplante seg til mange miljøer. Kjør et manuelt blandet oppsett, en riktig mal og en konsekvent feil mal. Sammenlign avvikene. Resultatet viser både like verdier og antall brudd på standarden. En jevn rad er ikke alltid en riktig rad.

**Original guided application.** Tre miljøer er like, men alle har feil region mot standarden. Hvilken konklusjon passer?

- review: Gjennomgå og korriger mal/parameter før ny bruk — Ja. Automatiseringen har vært konsekvent, men grunnlaget var feil.
- consistent: Likhet beviser at standarden er oppfylt — Likhet sier ingenting om hvilken verdi kravet faktisk krever.
- manual: Manuell konfigurering er alltid sikrere — Begge metoder kan gi feil. Repeterbarhet og review må kombineres.

## sustainability — Reduser unødvendig ressursbruk uten å fjerne funksjonen

CB05 · forklare ressursutnyttelse og avgrense bærekraftspåstander.

**Forståelse før aktiviteten.** Du kjenner allokert kapasitet, utført arbeid og udekket behov. En kapasitetstime er her én oppdiktet kapasitetenhet holdt tilgjengelig i én time.

**Grunnforklaring.** Et utviklingsmiljø trenger kanskje bare kapasitet i arbeidsdagen, mens butikkens kritiske funksjon trengs hele døgnet. Begge kan ha ledig kapasitet. Det er fornuftig å redusere unødvendig bruk, men å slå av feil miljø er ingen god optimalisering. Først må teamet forstå når funksjonen faktisk må være tilgjengelig.

**Mekanisme.** Right-sizing tilpasser ressursnivået til et begrunnet behov med passende margin. Planlagt stans kan redusere unødvendig allokering i et miljø som ikke skal brukes om natten. Flere kopier kan være nødvendig for feilmargin, men øker også ressursfotavtrykket. Effektiv kode, passende lagring, mindre unødvendig dataflyt og velvalgt observabilitet påvirker også ressursbruk. CPU-utnyttelse alene beskriver ikke hele bildet.

**Azure og operativ anvendelse.** Azure gir muligheter for ressursvalg, skaleringsregler og planlagt drift. Valg må passe tjenestens faktiske egenskaper: å stoppe en prosess er ikke nødvendigvis det samme som å frigjøre alle fakturerte ressurser. Vedlikehold, datalagring og nettverk kan fortsatt ha konsekvenser. Bruk målte behov og dokumenterte målere for å avgjøre hva som kan reduseres. Ingen Azure-pris, energi eller utslippsfaktor inngår i denne øvelsen.

**Gjennomarbeidet eksempel.** Et tenkt utviklingsmiljø brukes åtte timer daglig. Åtte enheter gjennom tjuefire timer gir 192 kapasitetstimer, før vi vurderer nyttig arbeid. Det tallet er et ressursbudsjett i en undervisningsmodell, ikke kWh. Undersøk selv en mindre plan som bare er på i arbeidsdagen. Bytt deretter til den kritiske døgnfunksjonen og se hvorfor samme tidsplan får en annen konsekvens.

**Misforståelse og moteksempel.** Lavere kostnad eller høyere utnyttelsesgrad er ikke i seg selv et verifisert miljøresultat. Energiforbruk, strømproduksjonens utslippsintensitet, maskinvare, datamengder, grenser og måleperiode må vurderes. En cloud-løsning kan fortsatt være overdimensjonert. Ikke fjern nødvendig redundans bare for å få et penere utnyttelsestall.

**Forutsetninger og grenser.** Utviklingsbehovet er to undervisningsjobber per time i åtte timer; kritisk behov er to i alle tjuefire. Kapasitet er fire eller åtte per kopi, én eller to kopier, på i åtte eller tjuefire timer. Avstengte timer gir ingen kapasitet. Resultatene er jobber og kapasitetstimer, ikke energi, penger eller CO₂. Endringer er ikke virkelige driftsplaner.

**Terminology.** Right-sizing: Velge ressursnivå etter behov og begrunnet margin. Kapasitetstime: Én hypotetisk kapasitetenhet allokert i én time. Miljøfotavtrykk: Konsekvenser som krever flere data enn denne ressursmodellen har.

**Learner sequence.** Finn ressursbesparelse som fortsatt oppfyller funksjonskravet. En effektiv plan må både unngå unødvendig allokering og dekke riktig tilgjengelighetsvindu. Sammenlign døgnallokering og arbeidsdag for dev. Test også arbeidsdag-planen på den kritiske funksjonen. Kapasitetstimer kan reduseres, men en kritisk funksjon mister arbeid når miljøet er av. Ingen utslippsverdi beregnes.

**Original guided application.** Øvelsen viser færre kapasitetstimer. Hva kan du faglig konkludere?

- measure: Modellert allokering er redusert; miljøeffekt krever flere målinger — Ja. Vi har regnet ressursenheter under tydelige forutsetninger, ikke målt utslipp.
- carbon: CO₂-utslipp er redusert med samme prosent — Det finnes ingen utslippsfaktor, energimåling eller full systemgrense i modellen.
- off: Alle produksjonsmiljøer bør slås av om natten — En funksjon som trengs hele døgnet, mister tilgjengelighet med den tidsplanen.

## Changed independent scenario and criterion feedback

En ny timebestillingstjeneste har tre instanser som hver kan utføre tre undervisningsjobber per minutt. Etterspørselen er sju. Én instans svikter; balansert ruting bruker de to friske. Senere stopper en felles godkjenningstjeneste. Teamet har også en konsekvent feil regional mal og et utviklingsmiljø som bare brukes på dagtid. Besvar hele situasjonen uten løsningsmarkeringer. Dette er én avgrenset oppgave, ikke profesjonell kompetanse eller eksamensberedskap.

### unmet

Hvor mange jobber per minutt er udekket etter instansfeilen?

After committed submission: To friske instanser × tre = seks tilgjengelige jobber per minutt. Etterspørsel sju gir ett udekket behov.

### dependency

Mer webkapasitet hjelper ikke når den felles godkjenningstjenesten er nede. Hva må undersøkes?

- restore: Avhengigheten og en testet gjenopprettingsvei
- scale: Bare størrelsen på webinstansene

After committed submission: Den kritiske flyten trenger godkjenning. Tiltaket må påvirke den feilede avhengigheten, ikke bare friske komponenter.

### policy

En tillatt ressurskonfigurasjon dokumenterer …

- one-rule: oppfyllelse av den vurderte regelen, ikke full sikkerhet/compliance
- all: automatisk sikker kode, rettigheter og compliance

After committed submission: Rolle, policy og teknisk sikkerhet er ulike vurderinger.

### template

Alle miljøene bruker samme, men feil, malverdi. Hva endrer du?

- review: Gjennomgå og korriger konfigurasjonsgrunnlaget
- nothing: Ingenting, fordi miljøene er like

After committed submission: Konsistens gjør en feil repeterbar; den gjør ikke verdien korrekt.

### sustainability

Du kan redusere dev-allokering om natten. Hva mangler for et utslippsestimat?

- data: Energi, utslippsfaktorer og definert systemgrense
- none: Ingenting; kapasitetstimer er allerede CO₂

After committed submission: Ressursenhetene kan sammenlignes i modellen, men er ikke en miljømåling.

### forecast

Hvilken begrunnelse gir et bedre kostnadsestimat?

- usage: Målt bruk, relevante målere/priser og usikre framtidsforutsetninger
- sla: En tilgjengelighets-SLA gir en fast regning

After committed submission: Tilgjengelighetsvilkår bestemmer ikke alle forbruksmålere eller fremtidig bruk.

## Design alternatives and acceptance

### Executable model1.0.0 contracts

All choices are finite native controls and exact-key runtime validated; unknown inputs cannot produce an observation. Availability supports1/2/3 instances,4/8 jobs/min each,6/10 jobs/min demand, no failure/first-instance failure and fixed-first/healthy-copy routing. Available capacity is either the reachable first instance or all healthy reachable copies. Served=min(demand,available), unmet=max(demand−available,0), unused=max(available−demand,0). The first model output is withheld until a learner submits a numeric prediction. Required comparisons are a healthy size8 single instance, its failure, and two size4 copies with healthy routing after failure. None implies an Azure SLA.

Reliability requires four distinct diagnoses: demand needs capacity, instance failure needs another reachable copy, failed common dependency needs that dependency recovered, and a frozen2/4/6 trend against capacity6 needs observation/planning. Monitoring does not add capacity. The diagram presents the selected/alternative path, not an actual repair/deployment. Governance runs CreateGroup then CreatePlan against the original seeded engine in memory; App Sandbox/North Europe is denied without inventory growth, App Sandbox/West Europe accepted, Shared Sandbox outside this assignment accepted. The diagram reads assignment scope/allowed locations from the existing fixture and never moves the policy to the selected subscription. RBAC is assumed, not evaluated.

Manageability compares A/B/C with a West Europe standard: manual drift, a repeated West Europe template and repeated wrong North Europe template. Equal values are not necessarily correct. Sustainability assumes two jobs/hour for eight dev hours or24 critical hours. Allocated capacity-hours=capacity×copies×hours; serving depends on the required time window. Dev4×1×8 allocates32 and serves16; leaving capacity8 on24 hours allocates192 for the same16. An eight-hour critical schedule misses32 jobs. These are synthetic resource units, not monetary, energy or carbon measurements.

Each witness is a validated submitted configuration; guidance also requires the authored applied answer. The changed independent task instead uses three capacity3 copies, demand7 and one failure: available6/unmet1. It combines an unrelated failed approval dependency, policy acceptance, wrong repeated configuration, environmental data limits and forecast reasoning. First submission is committed before any explanation; theory/hints during an active attempt mark assistance, subsequent attempts remain retries and cancelled attempts are retained. The summary separates introduced/practiced/independent observations. See [record architecture](CONTENT_ARCHITECTURE.md).

Static illustrated prose was rejected because it cannot expose consequences; an unrestricted drag-and-drop scene was rejected because precision and decorative geometry do not establish understanding. Select task-specific original representations: route/component experiment for availability, incident/trend strip for diagnosis, real bounded receipt for policy, configuration matrix for repetition, resource-hour comparison for utilization, layered VM assembly, PaaS delivery pipeline and SaaS actor/access diagram. Native controls and complete prose are equivalent access. No 3D/dependency is introduced.

Each activity requires runtime-valid inputs, deterministic witnesses of the specified comparisons and a justified guided response; visits alone do not satisfy it. The summary shows introduced/practiced/independent separately. Independent answers commit before feedback; first/help/retry/abandon remain distinct. Numeric fixtures, source boundaries and invalid/counterexample cases are unit-tested. Verify each actual course model at1920×1080/1440×900/1366×768 with keyboard and Axe, preserved records, reload and real Portal return. No automated check establishes human comprehension or SME approval.
