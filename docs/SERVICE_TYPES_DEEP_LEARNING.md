# Service Types — full original teaching specification

3.2 / reviewed2026-10-25. Authored before presentation. Competencies F01/G01/C01/G03; human SME and learner review not performed. Canonical Bokmål copy is nb.expansion; existing Service Types manuscripts are retained rather than duplicated here. Official sources and supplementary classifications: [register](FUNDAMENTALS_SUPPLEMENTARY_READING.md).

Fra modul 1 kjenner du ressursene og hvem som gjør deler av arbeidet. Modul 2 viste at kapasitet, recovery og styring må utformes. Nå skal du velge og begrunne konkrete servicegrenser: en VM du drifter, en støttet applikasjonsplattform eller et ferdig produkt. Den opprinnelige teorien og Portal-labben er beholdt; nye undersøkelser har egen versjon og egne observasjoner.

## overview — Fra ansvarsoversikt til operativt valg

ST01–ST04 · bruke grunnlaget til nye tekniske beslutninger.

**Forståelse før aktiviteten.** Repetisjon: et operativsystem forvalter maskinressurser; runtime kjører kode. Public/private/hybrid beskriver miljøer, mens IaaS/PaaS/SaaS beskriver leveransen og driftsgrensen.

**Grunnforklaring.** Et tjenestevalg bestemmer ikke bare hvor koden står. Det bestemmer hvilke konfigurasjoner teamet kan gjøre, hvilke driftsoppgaver det beholder og hvilke begrensninger det må akseptere. Vi bruker samme tekniske ansvarsmatrise som før, men går videre til komponenter og konkrete handlinger.

**Mekanisme.** Når en oppgave overtas av leverandøren, finnes laget fortsatt. En administrert runtime trenger fortsatt en støttet versjon og riktig applikasjonskonfigurasjon. En ferdig app trenger fortsatt brukere og datatilgang. Se derfor alltid på både hva tjenesten leverer, hva kunden styrer og hvilke krav arbeidslasten stiller.

**Azure og operativ anvendelse.** Azure Virtual Machines gir en gjest som kunden konfigurerer. App Service gir en støttet hostingplattform for webapplikasjoner. Microsoft 365 er et eksempel på ferdige samarbeidstjenester med egne administrasjons- og lisensgrenser. Den nøyaktige ansvarsgrensen må vurderes for den aktuelle tjenesten og konfigurasjonen.

**Gjennomarbeidet eksempel.** En leverandørvedlikeholdt OS-plattform hjelper teamet som vil slippe gjeste-OS. Det er likevel teamets oppgave å levere fungerende kode og egnede tilgangsvalg. En annen applikasjon krever en bestemt OS-driver; den kan trenge mer gjestekontroll. Ingen av kravene kan avgjøres ut fra et pent tjenesteikon.

**Misforståelse og moteksempel.** Service models er ikke en rangstige der SaaS alltid er best og IaaS alltid er gammeldags. Kontroll kan være nødvendig, og lavere driftsbyrde kan være verdifull. Det viktige er en dokumentert match mellom krav, tjenestestøtte og teamets evne til å drifte.

**Forutsetninger og grenser.** Sammenligningen konfigurerer ingen tjeneste. M1-observasjoner og historiske Service Types v1-svar blir ikke godskrevet som ny operativ læring. Eldre materiale er fremdeles tilgjengelig som merket arkiv.

**Terminology.** Driftsgrense: Hvilke oppgaver leverandøren utfører og hvilke kunden må utføre. Tjenestestøtte: Konfigurasjoner og bruksmåter den valgte tjenesten faktisk tillater.

**Learner sequence.** Bruk ansvarsoversikten som inngang til tekniske valg. Å kjenne eieren av OS er ikke nok til å velge en komplett løsning. Sammenlign de tre konkrete tjenestene. Les ett lag i hver og bruk deretter kontrollene i de tekniske undersøkelsene. Ansvar flyttes, men krav til kundens kode, data, tilgang og kompatibilitet gjenstår.

**Original guided application.** Hva må fortsatt avklares etter at du velger en plattform som drifter OS?

- fit: Krav, støttet runtime, kundekode, konfigurasjon og tilgang — Ja. Servicegrensen erstatter ikke den praktiske løsningsvurderingen.
- done: At alle tekniske valg allerede er riktige — En kategori eller ansvarsoversikt beviser ingen fungerende eller sikker konfigurasjon.

## iaas — Bygg en forståelig VM-konfigurasjon

ST01 · forklare komponenter og retained operations i IaaS.

**Forståelse før aktiviteten.** Du kjenner fysisk vert, gjeste-OS, CPU, RAM og lagring. vCPU er virtuell prosessorkapasitet; GiB er en minneenhet. NIC er et virtuelt nettverkskort som knytter VM-en til et nettverk.

**Grunnforklaring.** IaaS gir kontroll over en virtuell datamaskin uten at kunden må kjøpe vertsmaskinen. Denne kontrollen er nyttig når et program trenger bestemte OS-egenskaper. Men en VM-ressurs alene er ikke en ferdig applikasjonsplattform. Programmet trenger også passende gjest, runtime, data og nettverksvei.

**Mekanisme.** VM-størrelsen beskriver blant annet vCPU og minne. Gjesteoperativsystemet kjører innenfor denne tildelingen. En OS-disk og eventuell ekstra datalagring har andre roller enn RAM. Applikasjonsdata som skal beholdes, må ha egnet varig lagring og en begrunnet backup-/gjenopprettingsplan. Et NIC og nettverksoppsett er nødvendig for ønsket kommunikasjon; en public IP er ikke et universelt krav. Nettverksfiltrering, ruter, navneoppløsning og identitet må fortsatt utformes i den reelle løsningen.

**Azure og operativ anvendelse.** En Azure VM er en ARM-administrert ressurs med relaterte nettverks- og lagringsressurser. Microsoft driver verts- og virtualiseringslaget. Kunden velger gjeste-OS, installerer programvare og må planlegge patching, tilgang, backup og tilgjengelighet. Lift-and-shift kan bevare en eldre programvares OS-forutsetninger under flytting, men moderniserer ikke automatisk arkitektur eller drift. Dev/test kan bruke repeterbare gjestemiljøer, med samme behov for sikker konfigurasjon.

**Gjennomarbeidet eksempel.** Et eldre lagerprogram krever Windows og minst åtte GiB i vårt fiktive oppdrag. Det trenger installert runtime, varig applikasjonslagring og en avtalt nettverksvei. Sett sammen en plan og undersøk hvilke forutsetninger som mangler. Patching er et pågående driftsansvar, ikke en avkryssing som gjør maskinen permanent sikker.

**Misforståelse og moteksempel.** Mer vCPU løser ikke feil OS eller manglende runtime. RAM er ikke en erstatning for varig lagring. En konfigurasjon som passer disse forutsetningene, beviser heller ikke tilgjengelighet, korrekt backup eller at programmet kjører. Høy tilgjengelighet krever flere vurderinger enn størrelsen på gjesten.

**Forutsetninger og grenser.** Dette er en konseptuell konfigurasjonsmodell, ikke VM-provisionering i Portal. To/fire vCPU og fire/åtte GiB er undervisningsvalg, ikke SKU-er eller ytelsesmålinger. Appdata trenger varig lagring i oppdraget; dette er ikke et generelt forbud mot midlertidig lagring eller ephemeral OS-disker. Nettverksvalget uttrykker et krav som ikke implementeres som faktiske pakker, IP-er eller NSG-regler.

**Terminology.** vCPU: Virtuell prosessorkapasitet tildelt en gjest. NIC: Virtuelt nettverkskort som forbinder VM-en med et nettverk. Varig appdata: Data som skal beholdes utover en kort arbeidsøkt eller midlertidig disk.

**Learner sequence.** Avklar VM-ens forutsetninger og kundens driftsarbeid. En VM er én del av en løsning; kapasitet kan ikke erstatte manglende komponenter. Prøv først en ufullstendig plan. Rett OS, minne, appdata, nettverk og runtime, og velg en patch-plan. Modellen viser konkret hvilke krav som ikke passer. En passende plan vises som avklart, aldri som deployert eller frisk.

**Original guided application.** Programmet trenger en bestemt Windows-driver. Hva er en faglig relevant IaaS-begrunnelse?

- control: Gjesten gir nødvendig OS-kontroll, med retained patch-/tilgangsarbeid — Riktig. Kontrollen kan passe kravet, men teamet må også kunne drifte gjesten.
- managed: VM fjerner kundens OS-vedlikehold — VM flytter verten til leverandøren, men ikke gjesteansvaret.
- cpu: Flere CPU-kjerner gjør Linux kompatibelt med alle Windows-drivere — Kapasitet endrer ikke programmets OS-forutsetning.

## paas — Kode, runtime og hosting er ulike deler

ST02 · undersøke støttet plattform og retained applikasjonsarbeid.

**Forståelse før aktiviteten.** En hosting-plan er compute-grunnlaget som en app bruker. Runtime er programmiljøet som utfører koden. En applikasjonsinnstilling er konfigurert input til programmet, ikke selve programkoden.

**Grunnforklaring.** Teamet vil levere egen webkode og slippe gjeste-OS-drift. En støttet PaaS-plattform kan gjøre dette mulig. Det betyr ikke at vilkårlig programvare passer, eller at plattformen kan vite hvilke data og tilgangsregler applikasjonen trenger.

**Mekanisme.** Konseptuelt velger teamet en støttet plattform, tilrettelegger og tester en kodepakke, konfigurerer appen og gjør den tilgjengelig gjennom tjenestens støttede deployeringsmåter. Planen gir hostingressurser; appen er en egen ressurs som refererer planen. Flere apper kan dele en plan i Azure, slik at de også deler compute-egenskaper. Flytting, isolasjon, skalering og støttede plattformvalg må vurderes konkret. En ressurskvittering er ikke det samme som en ferdig kodeutrulling.

**Azure og operativ anvendelse.** Med App Service innebygde runtimes drifter Microsoft den underliggende OS-plattformen og den leverte runtime-en. Kunden vedlikeholder egen kode, data, støttet konfigurasjon og tilgang. Runtime-versjoner kan endres eller slutte å støttes, så appkompatibilitet må følges opp. Et kundelevert containerimage eller en egen runtime gir kunden mer innholdsvedlikehold. En OS-driver som krever gjestekontroll passer ikke automatisk i innebygget App Service-runtime.

**Gjennomarbeidet eksempel.** Prøv tre typer leveranse: støttet webkode, en runtime som plattformen ikke støtter og en OS-driver. Endre deretter appkonfigurasjon, databehandling og tilgangskrav. En større hosting-plan gjør ikke en usupportert runtime støttet. Når du har begrunnet plattformvalget, bruker du den virkelige lokale Portal-flyten til group, plan og Web App.

**Misforståelse og moteksempel.** Resource Group gir management og livssyklus, ikke compute. Metadataregionen bestemmer ikke automatisk planens lokasjon. I den støttede motoren avledes appens OS og lokasjon fra planreferansen. En avvist plan kan ikke være host. At en appkonfigurasjon er registrert, betyr ikke at vi har lastet opp, startet eller verifisert kode, DNS, nettverk eller apphelse.

**Forutsetninger og grenser.** Kompatibilitetsbildet er konseptuelt, med tre avgrensede pakkevalg. Det kjører ingen kode. Den separate Portal-motoren støtter Linux learning profile, ikke ekte SKU/runtime deployment. Den bruker samme gruppe for app og plan som modellgrense. Eksisterende teknisk arbeid kan gjenbrukes eksplisitt når den nåværende replayede historikken kan bekrefte det; ingen gamle læringssvar oppgraderes.

**Terminology.** Kodeutrulling: Å levere programvare gjennom en valgt og støttet deployeringsprosess. App Service plan: Hosting-compute som apper refererer, med OS/lokasjon og andre tjenestespesifikke egenskaper. Applikasjonskonfigurasjon: Verdier og valg programmet trenger; må håndteres sikkert av kunden.

**Learner sequence.** Skille plattformstøtte fra egen appkonfigurasjon. Administrert OS reduserer oppgaver, men fjerner ikke kompatibilitets- og applikasjonskrav. Sammenlign ikke-støttet pakke og støttet kode. Avklar konfigurasjon, data og tilgang før Portal-labben. Modellen forklarer hvorfor en pakke ikke passer eller hvilke kundevalg som gjenstår. Den viser aldri falsk runtime-helse.

**Original guided application.** En pakke trenger en runtime som valgt innebygd plattform ikke støtter. Hva bør teamet gjøre?

- verify: Undersøke støtte, tilpasse leveransen eller velge en annen egnet hostinggrense — Ja. Kompatibilitet må avklares før løsningen velges.
- bigger: Bare velge en større plan — Flere hostingressurser endrer ikke hvilke runtimes plattformen støtter.
- rg: Flytte Resource Group-metadata — Metadata-lokasjonen oppgraderer ikke runtime-støtte.

## saas — Administrer en ferdig tjeneste, ikke en gjesteplattform

ST03 · gjøre retained SaaS-kundeansvar konkret.

**Forståelse før aktiviteten.** En brukerkonto identifiserer noen i en tjeneste. En lisens eller tjenesteavtale gir bestemte bruksrettigheter. En administratorrolle gir administrasjonsmyndighet; den er ikke det samme som en lisens.

**Grunnforklaring.** Fjord-teamet tar i bruk en ferdig samarbeidstjeneste. Leverandøren vedlikeholder appplattformen. Teamet skal likevel velge hvem som skal bruke tjenesten, hvilke data som deles og hvem som får endre organisasjonens oppsett. Ingen av disse valgene avgjøres av at serverne er administrert.

**Mekanisme.** Organisasjonsinnstillinger kan gjelde mange brukere, mens tilgang til bestemte arbeidsområder eller dokumenter kan ha et smalere scope. En konto, en produktlisens og en administrasjonsrolle løser forskjellige behov. Et nytt medlem trenger relevant brukstilgang; det betyr ikke at vedkommende trenger administratorrolle. Ved avgang må tilganger og relevante data-/eierskapsrutiner følges opp. Databevaring, sletting og kontroll av tidligere deling er tjeneste- og kravavhengig.

**Azure og operativ anvendelse.** Microsoft 365 er et eksempel på en SaaS-familie, ikke en generell maskin der kunden installerer vilkårlig serverkode. Kunden forvalter blant annet brukere, rettigheter, deling, data og tjenesteinnstillinger. Faktiske administratorroller og lisenskrav varierer mellom produkter, abonnement og oppgaver. M365-organisasjon/tenant er heller ikke det samme som en Azure resource group eller vår produktorganisasjon.

**Gjennomarbeidet eksempel.** Mina trenger å samarbeide med teamet, ikke administrere hele organisasjonen. I den fiktive modellen krever bruk en aktiv konto og tildelt tjenestelisens. Teamdeling begrenser eksponeringen sammenlignet med alle-med-lenken. Undersøk for bred rolle og deling, korriger til det avtalte oppdraget, og se deretter hva modellens avgangsvalg gjør med bruken.

**Misforståelse og moteksempel.** En lisens gjør ikke brukeren til administrator. Leverandørpatching velger ikke riktige dokumentrettigheter. Å blokkere en konto er heller ikke dokumentasjon på at alle tidligere delinger og dataforpliktelser er håndtert. En tjeneste kan ha avanserte utvidelser uten å bli en generell PaaS for vilkårlig kode.

**Forutsetninger og grenser.** Fjord Samarbeid er en oppdiktet SaaS, ikke en kopi av Microsoft 365 admin center. Vi validerer bare aktiv/lisensiert bruker, en grov rolle og et delingsvalg. Ingen Entra-konto, ekte lisens, API, passord, datafil eller Microsoft tenant endres. Modellen gir ingen sikkerhets-/compliance-garanti.

**Terminology.** Brukerlisens: Avtalte rettigheter til å bruke bestemte tjenestefunksjoner. Administratorrolle: Myndighet til å administrere bestemte deler av en tjeneste. Delingsgrense: Hvem som kan få tilgang til bestemte data gjennom et valgt oppsett.

**Learner sequence.** Gi akkurat det avtalte samarbeidsbehovet og vurder avgang. Et ferdig produkt fjerner plattformdrift, ikke kundens tilgangsbeslutninger. Prøv et risikabelt oppsett, et aktivt lisensiert teammedlem uten bred adminrolle, og en avsluttet brukerkonto. Tilgang, overbrede rettigheter og deling vises som separate konsekvenser. Ingen faktisk konto blir endret.

**Original guided application.** Mina skal bare samarbeide i et avtalt team. Hvilket resonnement passer?

- least: Relevant brukerlisens, begrenset rolle og riktig datadeling må vurderes hver for seg — Ja. Konto, bruksrett og administrasjonsmyndighet er forskjellige dimensjoner.
- admin: Alle lisensierte brukere bør være administratorer — En lisens begrunner ikke større rettigheter enn oppgaven trenger.
- provider: Leverandøren bestemmer automatisk hvem som bør se teamets data — Kunden må ta egnede data- og tilgangsvalg innen tjenestens funksjoner.

## selection — Velg en løsning ut fra krav og driftsarbeid

ST04 · begrunne tjenestevalg og vurdere alternativer.

**Forståelse før aktiviteten.** Du har undersøkt VM-komponenter, plattformkompatibilitet og retained SaaS-administrasjon. Et krav beskriver hva løsningen må gjøre; en preferanse kan avveies mot andre hensyn.

**Grunnforklaring.** Et servicevalg er et argument om egnethet, ikke en konkurranse mellom etiketter. Kartlegg ufravikelige krav, eksisterende investeringer og teamets driftskapasitet før du velger. Noen situasjoner har flere forsvarlige svar, dersom forutsetningene faktisk oppfylles.

**Mekanisme.** En OS-avhengig agent kan trenge IaaS-kontroll. Egen webkode på en støttet runtime med ønske om mindre OS-drift kan passe PaaS. Behov for ferdig samarbeid kan passe SaaS, når produktfunksjoner, avtale og tilgangskrav støtter oppgaven. En virksomhet med et kompetent VM-driftsteam kan fortsatt ha et begrunnet IaaS-alternativ for egen kode. Valget må inkludere retained arbeid, ikke bare fordelen man ønsker.

**Azure og operativ anvendelse.** Reell Azure-design vurderer blant annet tjenestestøtte, identitet, data, nettverk, drift, skalering, recovery og kostnader. En eksisterende lokal integrasjon kan begrense migrering eller kreve hybrid samspill. Det betyr ikke at ordet hybrid avgjør om applikasjonsdelen skal være IaaS eller PaaS. Senere arkitekturmoduler går dypere i disse avhengighetene.

**Gjennomarbeidet eksempel.** Undersøk tre tydelige situasjoner og én med flere muligheter. For et OS-krav må begrunnelsen forklare gjestekontrollen. For en ferdig tjeneste må funksjonsbehovet faktisk passe produktet. I den åpne webkodesituasjonen godtas både VM med et team som tar gjestedriften, og støttet PaaS med tydelig retained apparbeid. En riktig etikett med feil begrunnelse er ikke et godt løsningsforslag.

**Misforståelse og moteksempel.** PaaS er ikke alltid billigst eller egnet for alle programmer. SaaS er ikke automatisk et alternativ til egen forretningslogikk. Å velge IaaS fordi det gir kontroll, uten å planlegge vedlikeholdet, utelater en vesentlig konsekvens. Vi lærer derfor hvilke forutsetninger som gjør svaret rimelig, ikke én universell rangering.

**Forutsetninger og grenser.** Scenariene er fiktive beslutningsoppgaver, ikke komplette løsningsarkitekturer eller pristilbud. Noen alternativer aksepteres bare når modell og begrunnelse passer sammen. Den nye uavhengige oppgaven har endrede krav og egen versjon. Historiske v1-forsøk og den eksisterende Portal-byggeoppgaven beholdes separat.

**Terminology.** Ufravikelig krav: Et behov løsningen må oppfylle, ikke bare en ønsket egenskap. Avveining: Et begrunnet valg der gevinster og ulemper vurderes sammen.

**Learner sequence.** Knytt servicegrense til det reelle kravet og retained arbeid. To løsninger kan være forsvarlige med forskjellige driftsforutsetninger. Prøv de tre tydelige kravene og den åpne situasjonen. Velg både modell og begrunnelse. Rimelige alternativer godtas når begrunnelsen samsvarer. Upassende kapabilitet eller utelatt drift gir konkret moteksempel.

**Original guided application.** Egen webkode støttes av PaaS, men teamet kan også drifte VM. Hvilket utsagn er faglig holdbart?

- tradeoff: Begge kan være egnet hvis kravet og retained driftsarbeid begrunnes — Ja. Vi må vurdere forutsetninger og arbeid, ikke kreve én kategori uten grunn.
- always: PaaS er alltid riktig uansett støtte og drift — En slik regel ignorerer konkrete begrensninger og krav.
- saas: Vilkårlig serverkode kan alltid lastes inn i et ferdig SaaS-produkt — Et ferdig produkt er ikke en generell hostingplattform for all kode.

## practice — Bruk og forklar den faktiske hostingkonfigurasjonen

ST02/ST04 med anvendt G01/C01 · undersøke group, plan, app og policy.

**Forståelse før aktiviteten.** Group organiserer management. Plan gir hosting. App refererer planen. Resource location og gruppemetadata er forskjellige egenskaper.

**Grunnforklaring.** Nå skal du gjøre arbeidsdelingen konkret i det fungerende lokale laboratoriet. Du oppretter eller gjenbruker dokumentert teknisk arbeid, leser en virkelig modellkvittering og undersøker appens hostingrelasjon. Dette er guided practice, ikke uavhengig mestring.

**Mekanisme.** Den samme motoren håndterer de reelle støttede Portal-skjemaene. Et policyavslag lager ingen plan. En app krever en gyldig plan, og appens OS/lokasjon avledes fra den. Gruppemedlemskap og hosting er ulike relasjoner. Etter arbeidet må du forklare hvorfor det passer ønsket om egen kode uten gjeste-OS-drift.

**Azure og operativ anvendelse.** App Service plan og Web App er separate Azure-ressurser med en hostingrelasjon. Den lokale Linux learning profile er en tydelig avgrensning. Ingen Azure-konto, SKU, runtime-deployering eller driftssignal opprettes.

**Gjennomarbeidet eksempel.** App Sandbox krever en ny eller eksisterende egnet lifecycle-gruppe med Norway East-metadata. Den custom Web-policyen avviser North Europe og tillater West Europe. Les scope og rule i kvitteringen og korriger ressurslokasjonen. Inspect app → plan separat fra app → group. En eksisterende replaybar lab kan fortsettes uten å lage nye like grupper.

**Misforståelse og moteksempel.** Tidligere guided teknisk konfigurasjon er ikke ny uavhengig læring. En ny versjon av kurset arver ikke gamle sammenligninger eller riktige svar. Når eksisterende ressurser brukes, beskriver debriefen dette som gjenbruk og etterkontroll, ikke som en ny deployering.

**Forutsetninger og grenser.** Bare den eksisterende bounded Portal-motoren utfører ressurskommandoer. Konseptuelle VM/SaaS-prøver bidrar ikke til inventaret. Historisk arbeid uten nødvendig replay/receipt kan ikke adopteres som ferdig. Du kan fortsette gyldig arbeid eller eksplisitt bruke teknisk restart i det eksisterende grensesnittet.

**Terminology.** Kvittering: Deterministisk resultat av en støttet teknisk kommando. Hostingrelasjon: Appens eksplisitte referanse til compute-planen som støtter den.

**Learner sequence.** Forklar den samme konfigurasjonen som laboratoriet faktisk viser. Teknisk arbeid og ny faglig begrunnelse er ulike evidenskilder. Start eller fortsett labben, undersøk policy og hosting, og begrunn deretter retained kundeansvar. Debrief viser faktiske ressursnavn. Versjon2 godkjenner ikke den anvendte delen uten både bekreftet lab og egen ny begrunnelse.

**Original guided application.** Hva er fortsatt teamets ansvar i dette innebygde App Service-eksemplet?

- retained: Egen kode, data, tilgang og støttet appkonfigurasjon — Ja. Registrert hosting flytter OS-oppgaver, ikke disse kundeoppgavene.
- none: Ingenting etter at Create er akseptert — En akseptert konfigurasjon kjører eller sikrer ikke automatisk kundens applikasjon.

## Changed independent scenario and criterion feedback

Nord-teamet har flere arbeidslaster: en agent med ufravikelig Windows-driver, en egenskrevet webtjeneste med en usupportert runtime, og en ferdig samarbeidstjeneste der en ansatt slutter. En annen webapp har både et kompetent VM-team og støttet PaaS som reelle alternativer. Begrunn de tekniske konsekvensene. Ingen arkitektur eller løsning er forhåndsvalgt.

### guest

Hvilken leveranse gir gjestekontroll for Windows-driveren?

- iaas: IaaS med nødvendig gjeste-OS
- saas: En vilkårlig ferdig SaaS

After committed submission: Gjestedriveren krever kontroll og kompatibelt OS; en ferdig produktfunksjon er ikke nok.

### patch

Hvem planlegger og følger opp gjeste-OS-patching i VM-alternativet?

- customer: Kunden
- provider: Leverandøren overtar alt gjestearbeid

After committed submission: Leverandørens fysiske drift fjerner ikke kundens retained gjestevedlikehold.

### runtime

Webtjenestens runtime støttes ikke av den valgte innebygde PaaS-plattformen. Neste faglige valg?

- adapt: Undersøk støtte og tilpasning eller en annen egnet hostinggrense
- size: Kjøp større plan som automatisk støtter alt

After committed submission: Kapasitet og runtime-støtte er forskjellige egenskaper.

### departure

Hva må kunden vurdere når SaaS-medarbeideren slutter?

- access: Tilgang, roller og relevante data-/delingsrutiner
- patch: Bare leverandørens OS-patch

After committed submission: Kunden styrer passende brukertilgang og oppfølging av egne data innen tjenestens funksjoner.

### architecture

Velg et forsvarlig alternativ for den siste webappen, gitt begge driftsmulighetene.

- iaas: VM med eget driftsteam
- paas: Støttet PaaS-plattform
- saas: Vilkårlig SaaS for all egen serverkode

After committed submission: Både IaaS og PaaS kan godtas her, men bare med en samsvarende begrunnelse i neste felt.

### reason

Begrunn den valgte arkitekturens retained arbeid.

- os-team: Teamet tar gjeste-OS, runtime og appdrift
- platform-supported: Plattformen støtter koden; kunden tar kode/data/tilgang og konfigurasjon
- no-work: Ingen kundeoppgaver gjenstår

After committed submission: VM-alternativet krever os-team. PaaS-alternativet krever platform-supported. Et tilfeldig kryss mellom modell og begrunnelse godtas ikke.

### hosting

Gruppen har Norway East-metadata; appen bruker en plan i West Europe. Hva begrunner appens lokasjon i denne modellen?

- plan: Den eksplisitte hosting-planreferansen
- group: Gruppens metadata flytter automatisk appen

After committed submission: Medlemskap bestemmer management; appens hostinglokasjon avledes fra planen.

## Design alternatives and acceptance

### Implemented operational2.0.0 contract

The ordinary Service Types route extends ServicesWorkspace; its original mechanism/example/misconception/limit prose remains visible. The nine-layer matrix occurs once at overview. IaaS/PaaS/SaaS each use a different operational representation instead of repeating that matrix. Explicit `version=1` retains the original titles, guided cases and independent Portal handoff. Old observations do not become new observations. Existing learners choose; a new learner's default v2 preference is navigation only.

- IaaS requires a fictional Windows workload with at least8GiB, persistent appdata, an understood NIC/network need, required runtime and an owned guest-patch plan. vCPU2/4 is selectable but no performance is inferred. The guest is distinct from the provider host and attached storage/network; missing and complete configurations are observed separately. Backup, availability and access planning are explained, not falsely implemented by six checks.
- PaaS contrasts unsupported runtime/OS-driver delivery with supported web code. Supported input still needs app configuration, appropriate access and data arrangements. This conceptual gate never deploys code. The actual plan/app/location/policy evidence comes from the unchanged Portal engine.
- SaaS separates active account, assigned service license, ordinary/admin authority and team/public-link sharing. Active licensed users may still have excessive authority or sharing; blocking departure does not retract previous copies or erase data obligations. This is a fictional administration model, not Microsoft365 API behavior.
- Service selection has OS-specific, supported custom web, ready product and open web/team cases. The open case accepts either IaaS with owned OS/runtime operations or PaaS with supported platform and retained customer work; crossed reasons are rejected. No service category is universally ranked best.
- Practice needs the actual current-attempt lab predicates (accepted group, allowed plan, dependent app, genuine denial and policy/hosting inspections) plus a new retained-responsibility response. Existing session resumes; explicit opt-in may reuse historical accepted resources in the same replayable attempt without duplicating setup or learning credit.

The independent changed scenario asks about a different legacy guest, patch ownership, incompatible runtime remediation, SaaS departure, a paired viable architecture/reason and plan-derived app location versus group metadata. Answers start blank, submissions are immutable, first/help/retry/abandon remain distinct. Original v1 changed-build evidence also remains available; neither is a general professional competence or exam-readiness verdict. Source bindings, false-completion counterexamples and persistent event replay are checked separately from pending human review.

Static illustrated prose was rejected because it cannot expose consequences; an unrestricted drag-and-drop scene was rejected because precision and decorative geometry do not establish understanding. Select task-specific original representations: route/component experiment for availability, incident/trend strip for diagnosis, real bounded receipt for policy, configuration matrix for repetition, resource-hour comparison for utilization, layered VM assembly, PaaS delivery pipeline and SaaS actor/access diagram. Native controls and complete prose are equivalent access. No 3D/dependency is introduced.

Each activity requires runtime-valid inputs, deterministic witnesses of the specified comparisons and a justified guided response; visits alone do not satisfy it. The summary shows introduced/practiced/independent separately. Independent answers commit before feedback; first/help/retry/abandon remain distinct. Numeric fixtures, source boundaries and invalid/counterexample cases are unit-tested. Verify each actual course model at1920×1080/1440×900/1366×768 with keyboard and Axe, preserved records, reload and real Portal return. No automated check establishes human comprehension or SME approval.
