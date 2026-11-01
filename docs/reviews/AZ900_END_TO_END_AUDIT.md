# AzureLab — End-to-End AZ-900 Learning Journey Audit

**PR42 · 1. november 2026 · revisjon, ikke produktombygging.** Den faglige bredden er god; den anbefalte læringsflyten er ennå ikke like sammenhengende. Prioriter oppdragsnavigasjon, dialogplassering, forkunnskapsrekkefølge og vurderingssignaler før eksamensmotoren. Ingen bekreftet P0 i undersøkelsen. Fire P1 krever egne forbedringsleveranser eller eksplisitt eierdisposisjon.

[Reisekart](AZ900_LEARNING_JOURNEY_MAP.md) · [Prioritert implementeringsplan og pilot](AZ900_REMEDIATION_PLAN.md) · [Maskinlesbare bevis](evidence/audit42.json).

## Omfang og bevisgrenser

Undersøkt versjon: `4732f93dfcdd233dcb6d7acc2a4838ba7a292141`, verifisert mot remote base og den fulle SHA-en vist i applikasjonen. Anonym offentlig [PR41-preview](https://azure-learner-git-codex-az900-file-movem-438e7b-espzys-projects.vercel.app/), ikke produksjon. Nettleser: prosjektets Playwright 1.64.1 / Chromium 1248. Tidspunkter i bevisfilene er UTC; rapportdato er Europe/Oslo.

- **Full strukturell kartlegging:** tre stier, 17 modulruter, 19 pedagogiske deler inkludert innebygd Serverless og Core A/B; 205 forskjellige URL-er i standard aktivitetssekvenser og 12 ekstra kanoniske aktivitets-URL-er. Alle 217 er listet i bevisfilen. `case`, `perspective`, historisk `version` og lab-/oppdragskontekst er tilstander, ikke nye moduler.
- **Hele vurderingsstrukturen:** 152 beslutning–begrunnelse-scenarioer i 14 banker, 110 modul/familie-kombinasjoner og 1368 mulige svarpar. Dessuten åtte eldre skjemaer med 60 kriteriefelt: 57 valgfelt og tre tallfelt. Felt og scenarioer summeres ikke til ett «oppgaveantall».
- **Risikobasert faktisk nettleserarbeid:** eierforløp i Security, kilder på tvers av delene, oppdragsinnganger i åtte andre moduler, tre andre assessment-dialoger, Hub/Journal/resume, isolert korrupt lagring og faktisk lokal Portal-opprettelse/policyavslag. Blindreviewer åpnet i tillegg 28 scenarioer og sju eldre skjemaer. Dette er ikke manuell fullføring av alle 217 aktiviteter eller alle oppdrag.
- **Dybde:** forkunnskaper, manuskriptstruktur, modell-/oppdragsmønstre og vurderingsmetadata er gjennomgått på tvers av alle delene. Semantisk repetisjon og faglig diskriminering er kvalitative risikovurderinger av konkrete sammenligninger; ikke en ny linjevis Microsoft-kilderevisjon av alt tidligere innhold.

57/57 mål og 126 fasetter beholdes byte-uendret som authored-content coverage. Ingen elevmestring, eksamensberedskap, psykometrisk gyldighet eller menneskelig SME-/nybegynner-/skjermleservalidering er dokumentert gjennom denne revisjonen. Ingen runtime-kode, tester, rubrics, læringskontrakter, World, receipts eller XP endres.

## Det som bør bevares

Course Hub gir én forståelig start og tre stabile faglige stier. Del A/B/C-gruppering, direkte navigasjon og en egen lokal Sandbox er et godt fundament. Det er liten verdi i å erstatte dette med enda et dashboard.

De tekniske skillene er gjennomgående sterke: autentisering er ikke autorisasjon; DNS er ikke tilgang; konfigurasjon er ikke drift; anbefaling er ikke bekreftet hendelse; syntetiske observasjoner blir ikke ekte ressursdata. Modeller for adressetilhørighet, kø/redelivery, Archive/rehydrering, replikering, policykombinasjoner og telemetrivindu gir faktisk årsak–virkning. Historiske førstegangsresultater holdes adskilt fra hjelp og retry. Disse grensene må også bevares når UI forenkles.

SavvyShark har eksplisitt Start/Cancel, lagrede observasjoner og forklaringer som vilkår for guidet fullføring. Å åpne et Studio eller bruke Neste gir ikke automatisk kreditt. Faktiske Portal-handlinger og inspiserte kvitteringer gir en annen type praksis enn konseptmodeller. Ingen «klikkbar fasade» bør erstatte dette.

## Bekreftede eierfunn

### LJ-01 · P1 · OWNER-UX-01: Neste følger sideorden, ikke aktivt oppdrag

**Reproduksjon, ny lokal nettleserstate:** Hub → Security Part C → `?topic=missions` → første «Åpne SavvyShark-briefing» → `?topic=studio&perspective=trust`. Lenken åpner Studio; briefingen krever et nytt eksplisitt knappetrykk der. Start, velg prediksjon og kjør én observasjon uten å fullføre forklaringen. Trykk Neste: studenten sendes til `?topic=missions`. Oppdragslisten tilbyr deretter selvstendig anvendelse som Neste.

[Oppdragslisten etter delvis arbeid, 1440×900](screenshots/owner01-next-returns-list.png) viser konsekvensen: fremdriften i det aktive oppdraget styrer ikke hovedhandlingen. Forventet anbefalt handling er «Fortsett undersøkelsen» eller riktig gjenstående forklaring/debrief. Frivillig direkte navigasjon skal fortsatt være mulig.

**Hva som fungerer:** Back, Hub → reload → Fortsett gjenopptar nøyaktig `studio&perspective=trust`, med den lagrede observasjonen og uten fullføringskreditt. Etter validerte kontraster og korrekt forklaring registreres oppdraget fullført; Next er fremdeles oppdragslisten, og Hub anbefaler fremdeles dette Studio-perspektivet. Dette er et progresjons-/orienteringsproblem, ikke dokumentert tap av lagring.

**Aktiv independent:** ny `sp01` startes eksplisitt. Next åpner Summary. Når den faktisk er montert, er hjelp varig registrert (`assisted=true`); Journal beholder denne klassifiseringen og Hub peker tilbake til eksakt `assessment&case=sp01`. Ingen bekreftet uregistrert hjelp i dette forløpet. Et tidlig råøyeblikk rett etter URL-endringen viste gammel state; en oppfølgende kontroll ventet på faktisk lagrings-/renderingstilstand. Dette øyeblikket brukes ikke som bevis for en lekkasje.

**Årsak:** `SecurityMissions` lenker til et perspektiv, mens `course.tsx` og `CourseNavigation` beregner Neste fra en separat statisk emneliste. Navigasjonskomponenten mottar ikke oppdragsfasen. Native briefing og durabel guide fungerer hver for seg; forbindelsen til anbefalt neste steg mangler.

**Utbredelse:** nettleserkontroll av Compute, Networking, Storage, Identity, Cost, Governance, Tools og Monitoring viser samme separasjon mellom oppdragsinngang og statisk Neste. Studio-modulene peker tilbake til missions; Compute/Networking/Cost peker til neste faglige side. Disse åtte inngangene er åpnet, ikke fullført manuelt. Tidligere praktiske oppdrag har egne origin-/retur-/resume-kontrakter; de må inngå i rettingens tester, ikke erstattes med Studio-antakelser.

### UX-01 · P1 · OWNER-UX-03: vanlige dialoger havner i hjørnet

Security `?topic=assessment&case=sp01` → Start viser ordinær `PortalDialog` ved **x=0, y=0**:

| Viewport | Dialogbredde/høyde | Observasjon                                         |
| -------- | ------------------ | --------------------------------------------------- |
| 1440×900 | 750×564 px         | Øverst til venstre, stor ubrukt høyreside           |
| 1024×768 | 750×564 px         | Samme feilplassering                                |
| 1024×500 | 750×450 px         | Intern scroll finnes, men dialogen ligger i hjørnet |

[1440×900](screenshots/owner03-assessment-dialog-1440x900.png) · [1024×768](screenshots/owner03-assessment-dialog-1024x768.png) · [Kort vindu](screenshots/owner03-assessment-dialog-1024x500.png).

Storage, Identity og Monitoring har samme x=0/y=0 ved 1440×900. Global Journal har også feilplasseringen. Escape lukker Security-dialogen og gir fokus tilbake til Start; avbrutt start oppretter ikke et independent-forsøk. SavvySharks `GuidanceWindow` er derimot sentrert og har scroll ved kort vindu: [native briefing](screenshots/owner01-native-briefing.png).

**Årsak med isolert kontroll:** Course importerer faktisk `portal.css`. `.portal-dialog` angir bredde/max-height/overflow, men ingen eksplisitt automatisk margin. Global margin-reset gir beregnet margin 0. Kun midlertidig DOM-stil `margin:auto` flyttet kortvindudialogen fra (0,0) til (137,25), uten kildekodeendring. Dette underbygger CSS-årsak; det er ikke en manglende Course-import. Tilsiktede `.portal-side-panel` skal beholde sideplassering.

### UX-02 · P2 · OWNER-UX-02: åpne kildelister overtar leseflaten

Målt etter faktisk rendering ved **1440×900**, fersk state:

| Summary            | Offisielle lenker | Kildeseksjonens høyde |
| ------------------ | ----------------: | --------------------: |
| Compute            |                38 |                763 px |
| Networking A / B   |           19 / 20 |          435 / 450 px |
| Storage A / B / C  |      21 / 23 / 30 |    663 / 672 / 869 px |
| Identity A / B / C |      29 / 30 / 28 |   995 / 1014 / 920 px |
| Cost / Governance  |           29 / 36 |         524 / 1178 px |
| Tools / Monitoring |           40 / 34 |        1300 / 1117 px |

Security Zero Trust-teori viser tre relevante lenker på 175 px; Studio viser et mindre utvalg. Problemet er derfor størst i Summary og samleflater, ikke like stort på hver teoriside. [Faktisk kildeflate ved 1024×768](screenshots/owner02-open-sources-1024.png).

**Unntak og Journal:** Foundations v2 og Benefits/Services har allerede sammenlagte `details`-kilder. Serverless og Core har eldre åpne mønstre. Global Journal er betinget av besøkt innhold: fersk Journal hadde ingen `.compute-sources`; etter Security-besøk vises Security-kilder. Det er feil å påstå at enhver Journal alltid viser alle modulenes kildebanker. Modul-Journal samler teori og kilder; transfer-feedback viser oppgavespesifikke referanser etter levering.

**Anbefaling:** gjenbruk et tilgjengelig, som standard sammenlagt «Kilder og videre lesning»-mønster; behold kilde-ID, tittel, URL, kontroldato og claim-kart. La essensielle forbehold stå ved mekanismen. Samme komponent bør brukes i teori, Studio, Summary og relevante Journal-deler, innen eksisterende teaching-boundary.

## Pedagogisk helhetsvurdering

### LJ-02 · P1 · rekkefølgen følger faggrupper bedre enn forkunnskaper

Den ordinære Next-kjeden går Storage A → B → **Migration C** → Identity A → Access B → **Security C** → Cost → Governance → Tools → Monitoring.

Migration oppgir «Storage Part A/B, nettverksforbindelser, **datarettigheter og Management**» som forkunnskaper. Security oppgir «Identity Part A/B, networking, Storage, **governance og monitoring**». De uthevede fordypningene ligger senere i standardreisen. Dette er eksplisitte dokumenterte inversjoner, ikke bare at et valgfritt kryssreferert begrep dukker opp tidlig. [Migration-introduksjon](screenshots/sequence-migration-prerequisites-1024.png).

Bevar trestistrukturen som faglig innholdsoversikt. Anbefalt nybegynnerprogresjon bør kunne krysse stiene: grunnlag → arkitektur/compute/nettverk → Storage A/B → Identity A/B → Cost/Governance/Tools/Monitoring → Security-syntese → Migration-avslutning. Flytt anbefalingen og skriv korte broer før eventuell manuskriptomstrukturering. Direktevalg og gamle URL-er må bestå. Reisekartet viser konkrete begrepsforløp og alternativer.

### PD-01 · P2 · høy samlet belastning, men ikke grunnlag for blind forkorting

Den definerte teksttellingen gir omtrent **49 171 ord/tokens** i de 19 delenes seksjonsobjekter, inkludert begreper, eksempler og grenser. Separate kontrolltekster, feedback, kilder, praktiske arbeidsflater og historiske varianter er ikke med. Dette er et reproducerbart omfangsmål, ikke lesetid eller kognitiv belastning. 41 senere guidede preset-oppdrag kommer i tillegg til eldre typer guide-/labforløp; de er tilgjengelige muligheter, ikke 41 dokumenterte obligatoriske gjennomføringer.

Ingen identiske hele tekstpassasjer på minst 12 ord ble funnet i det avgrensede utdraget av lange teorifelt. Det avkrefter ikke mindre eller semantisk repetisjon. Den reelle gjentakelsen er ofte **formatet**: prediksjon → endre kontroller → kjør → kontrast → flervalg om årsak, etterfulgt av en ny beslutning–begrunnelse-vurdering. Dette er nyttig første gang og ved ny mekanisme, men bør ikke være standardoppskrift for hvert læringsmål.

Bevar nyttig tilbakekalling: ansvar fra Service Types utdypes i Compute; DNS fra Networking brukes i Private Endpoints; region/soner fra Core blir replikering i Storage; AuthN/AuthZ brukes til RBAC/CA og senere sikkerhetsarkitektur. Forkort gjentatte administrasjonsforbehold og flytt profesjonell detalj til tydelig fordypning. Eksempler på slik detalj er Cloud Shell-/ARM-begrensninger, File Sync change-detection, DataActions/NotActions, flere premium-account-familier og to Secure Score-visninger. De må fortsatt finnes, men trenger ikke alle lik visuell vekt ved første møte.

Intern terminologi finnes særlig i Studio-, Summary- og starttekster: «lagrede kontraster», «replay-ledger», «versjonerte» resultater og teknisk verifisering av historikk. Dette er presist for utvikleren, men kan forklares som «det du undersøkte», «tidligere svar» og «lagringen kan ikke bekreftes». Teorikartleggingen fant ikke at «durable replay» dominerer hele manuskriptet. Omfanget skal ikke overdrives.

### Visualiseringer og SavvyShark

De mest særegne mekanismene bør styre interaksjonen: kapasitetskurve, ansvarsmatrise, ressurs-/nettverkskjede, kø med redelivery, replikakart, rehydreringsfaser, scope-arv, policykombinasjon, telemetritidslinje og filmanifest. Flere sene Studio-er har like kontroller og resultatpaneler selv når mekanismene er forskjellige. Prioriter tydeligere aktive tilstander og ett endret premiss fremfor flere kort.

Briefingene i de senere modulene er typisk rundt 130–234 ord i den oppgitte kopistrukturen. Obligatoriske begrensninger er stort sett synlige, men hovedoppgaven konkurrerer med status-/modellforklaringer. Faktisk fullføring av Security viste observerte milepæler med årsak; det er ikke dokumentert at popups gjentas ved reload. Vi har heller ikke målt at SavvyShark avbryter mennesker «for ofte». Foreslå kort briefing med mål, neste handling og én grense, detaljene tilgjengelige ved behov, og behold dagens deduplisering. Mål avbruddsbelastningen i pilot før frekvens endres.

## AS-01 · P1 og AS-02 · P2: vurderingskvalitet og transfer

En separat reviewer fikk først en nøkkelfri risikopakke: to scenarioer per 14 banker (28/152), pluss fire eldre skjemaer med 34 kriteriefelt. Løsningen ble låst før nøkler og feedback: SHA-256 `ebcca6548c6f6ae93efd6bb5ba979a5ec408996339bc569238ae0cd90e67de19`. Pakkens SHA-256: `9a9850d969713f83e788d5edf0ebd3dfd0c06777de064194c2d7f25e53fb28b3`. Deretter ble svarpar, faktisk renderer, guided-overlapp og struktur kontrollert. Ingen nøkkelkonflikt eller feilavvist gyldig alternativ ble funnet i utvalget; dette er ikke et bevis for hele bankens gyldighet.

**AS-01:** alle fem valgfelt i Benefits og alle sju i Services godtar første egentlige alternativ i faktisk UI. En elev kan dermed treffe et gyldig Services-par med første alternativ både for arkitektur og begrunnelse. De gyldige parene er koblet (`iaas` + `os-team` eller `paas` + `platform-supported`), ikke fire fritt kombinerbare svar. Benefits har dessuten et eget tallfelt. Dette er et konkret systematisk svarsignal i sentral undervisning. [Gjeldende Benefits-rendering](screenshots/assessment-benefits-1440.png).

**AS-02:** senere banker er bedre posisjonsbalansert. Ordtall gir enkelte risikosignaler, eksempelvis entydig lengst korrekt begrunnelse i Compute 7/14 og Storage A 6/12. Det er ingen generell «velg lengst»-regel: faktisk linjebryting ga blant annet sp01 4/3/4 linjer, sp08 4/4/4 og fm10 4/3/4. Enkelte distraktorer kombinerer et rimelig verktøy med en tydelig feil konsekvens, slik at delkunnskap kan være nok. Når guided og independent deler terminologi og tydelige krav, kan gjenkjenning dekke over svak transfer selv med nye navn.

110 familier betyr ikke 110 ueksponerte oppgaver for en bestemt elev. Familieeksponering, hjelp og retry er allerede durabelt klassifisert; utvalget fastslår ikke at produktet har nok friske familier for en ny eksamensmotor. Bevar historikken. Ny assessment-kopi, alternativer, ID-mapping eller rubric krever eksplisitt versjon og egne regresjoner. Ikke bare omstokke nåværende numeriske svarindekser. Pilot må teste en ukjent anvendelseskontekst, ikke bare la erfarne agenter kjenne igjen produktene.

## UX sett fra tre brukerperspektiver

| Perspektiv           | Fungerer                                                          | Viktigste hinder                                                | Konsekvens                                                             |
| -------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Azure-nybegynner     | Rolig Hub, én start, tre stier, forklarende teori                 | Rekkefølgeinversjoner, tett fagspråk og statisk Neste           | Kan gå videre uten å forstå at en guidet forklaring gjenstår           |
| IT-erfaren, Azure-ny | Direkte moduler, konkrete tekniske modeller, fri Portal           | Repetitiv ramme og åpne kildelister                             | Må skrolle gjennom støtte-/rapporttekst for å finne mekanismen         |
| Tilbakevendende      | Eksakt independent- og delvis guide-resume; konservativ historikk | Fullført guide anbefales igjen; Journal er lang og feilplassert | Resume fungerer teknisk, men «hva bør jeg gjøre nå?» er mindre tydelig |

Disse er faglige heuristiske perspektiver, ikke observerte menneskelige testpersoner. Hub fikk Axe 0 og ingen horisontal overflow ved 1440×900, 1024×768 og 1024×500; første Tab nådde «Hopp til innhold». Reduced motion ble brukt i kortvinduet. Isolert korrupt Security-store ga «Historikk ikke bekreftet» og kontrollhandling, ikke oppdiktet fremgang. Start/Cancel/Escape og fokusretur ble kontrollert i Security. Ingen full skjermleser-, zoom- eller tastaturtest av alle aktiviteter påstås.

## Azure Portal Fidelity & Practical Learning Roadmap · OWNER-UX-04

### Dagens faktiske kapasitet

«Operativ» nedenfor betyr en definert lokal AzureLab-kommando med World/receipt, aldri ekte Azure.

| Tjeneste/område                                                   | Klassifisering              | Faktisk kapasitet og grense                                                                                                           |
| ----------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Resource Groups                                                   | Operativt støttet           | CreateGroup, DeleteEmptyGroup; subscription og metadataregion. Ingen generell cascade-delete                                          |
| App Service Plan / Web App                                        | Delvis operativt støttet    | CreatePlan/CreateWebApp med støttet profil, regionpolicy, samme-gruppe-hosting og planreferanse. Ingen deployet kode/runtime          |
| App settings                                                      | Delvis operativt støttet    | To støttede pedagogiske innstillinger; draft/apply og faktiske SetAppSettings-receipts. Ingen secrets eller virkelig appkonfigurasjon |
| VM                                                                | Delvis operativt støttet    | CreateVmBundle/DeleteVmBundle; image/profil/disk/nettverksrelasjoner. Ingen guest OS-drift, patching eller CPU-målinger               |
| OS-/datadisk, NIC, VNet, subnet                                   | Delvis operativt støttet    | Ekte lokale objekter/referanser via VM-bundle; inspeksjon. Ikke universelle selvstendige CRUD-/rutingsfunksjoner                      |
| Tenant, Management Groups, subscriptions                          | Read-only inspeksjon        | Faktisk fast hierarchy/scope; ingen tenant-, konto- eller subscription-opprettelse                                                    |
| Custom Web location Policy                                        | Delvis operativt støttet    | Eksisterende avgrenset assignment med faktisk request-time-avslag. Ingen generell policy-/assignment-/compliance-motor                |
| Peering, DNS, VPN, ExpressRoute, Private Endpoint                 | Ren konseptmodell           | Declared path/adresser/avhengigheter; ingen operative forbindelser eller DNS                                                          |
| Storage Account, Blob, Files, Queue, Table, tiers/redudans        | Ren konseptmodell           | Studio, kompatibilitet, struktur og konsekvenser; ingen operative accounts/data i Portal                                              |
| Entra, RBAC, CA, locks, Purview                                   | Ren konseptmodell           | Deklarerte identitets-/tilgangs-/styringsperspektiver, ingen administrative operasjoner                                               |
| Advisor, Service Health, Monitor, Defender                        | Ren konseptmodell           | Syntetiske funn/signaler, ingen faktisk innsamling eller hendelsesfeed                                                                |
| CLI, PowerShell, ARM/Bicep, Arc, filflytting/migrering            | Ren konseptmodell           | Illustrert intensjon og deterministiske eksempler, ingen runtime/API                                                                  |
| Full Marketplace, Azure SQL/Cosmos-administrasjon, Key Vault CRUD | Ikke representert operativt | Eventuell teori/kryssreferanse er ikke en navigerbar tjeneste med kommandoer                                                          |

**Faktisk nettleserbevis:** i ren lokal state opprettet `rg-audit-local` en godkjent receipt/revisjon 0→1. En Plan i North Europe ble avvist med `policy-location-denied`, revisjon 1→1 og ingen ny ressurs. Activity log viste begge operasjonene. Et senere besøk i Storage Studio beholdt Sandbox-bytes uendret. [Create-form](screenshots/portal-group-basics-1440.png) · [Faktisk kvittering](screenshots/portal-policy-denial-1440.png). Dette er et godt praktisk læringsgrunnlag.

### Visuell fidelity og søkbarhet

Dagens Portal har allerede sentrale offisielle Azure-ikoner med dokumentert lisens/proveniens; alle sju ikonene på den kontrollerte hjemmesiden hadde registerkobling og ingen missing-fallback. Den eldre Lucide-beslutningen er historisk og skal ikke feilaktig beskrives som dagens tjenesteikoner.

Sammenligning med Microsofts offentlige Portal-/Resource Group-referanser kontrollert 1. november 2026 viser gjenkjennelig global header/søk, meny, breadcrumbs, command bar, Project details/Resource details, Basics/Tags/Review + create og ressursmeny. Local-only-merket og de begrensede valgene er nødvendige ærlighetsmarkører. [AzureLab Home](screenshots/portal-home-1440.png). Dette er representativ struktur, ikke pikselidentitet eller et komplett Azure-grensesnitt.

Søk begrenses ærlig til støttede tjenester; Storage blir ikke til en falsk ressurseditor. På sikt bør All services gjøre skillet «kan opprettes her / kan bare undersøkes i kurset» mer direkte og lenke riktig, uten dekorative døde kontrollflater. Nettleserreisen dokumenterer ikke at en virkelig nybegynner intuitivt finner alt. Microsofts resource filters/saved views og tastatursnarveier er mer omfattende enn AzureLabs støttede utvalg; full paritet har lavere verdi enn flere meningsfulle, testbare øvelser.

**Aktuelle referanser:** [Portal overview](https://learn.microsoft.com/en-us/azure/azure-portal/azure-portal-overview), [preferences](https://learn.microsoft.com/en-us/azure/azure-portal/set-preferences), [Resource Groups](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal), [VM creation](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal), [App Service creation](https://learn.microsoft.com/en-us/azure/app-service/quickstart-dotnetcore), [Environment variables](https://learn.microsoft.com/en-us/azure/app-service/configure-common), [resource views](https://learn.microsoft.com/en-us/azure/azure-portal/manage-filter-resource-views), [shortcuts](https://learn.microsoft.com/en-us/azure/azure-portal/azure-portal-keyboard-shortcuts). Alle ni kilder inkludert gjeldende [studieguide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900) var offentlig tilgjengelige; claims, innholdshasher og grenser finnes i bevisfilen. Ingen autentisert ekte Portal eller beskyttet kilde ble åpnet.

**PR-01 · P2:** prioriter først bedre kobling fra eksisterende kurs til faktiske ressurs-/receipt-inspeksjoner, deretter en avgrenset Storage Account/container-modell. Selvstendig NIC/VNet-konfigurasjon og scopesikker RBAC gir senere AZ-104-verdi, men høyere kontraktkostnad. Ekte telemetri, Entra-login, Arc, VPN, filsynkronisering og generell ARM bør fortsatt være konseptuelle innen AZ-900. Detaljert verdi-/kost-/risikovurdering står i tiltaksplanen.

## Leveransestatus og beslutningsgrense

Produktfunnene er **åpne, dokumenterte forbedringsbehov**, ikke rettet i PR42. Auditens egen nøyaktighet, bevisbinding og prioritering får separat fersk sluttrevisjon etter quality-stamp; eventuelle BLOCKER/MAJOR i selve leveransen må lukkes før eiergjennomgang. Produkt-P1 og release-review-alvorlighet er forskjellige felt, ikke en omklassifisering for å omgå gater.

Full kandidat-QA, exact-head CI/streng release og PR42-previewstatus dokumenteres i release-recordet og Draft PR-en når de faktisk foreligger. PR41-browserbevis gjelder eksplisitt baseversjonen ovenfor. Ready alene godkjenner ingen ekstern gate. Ingen merge eller produksjonsdeploy. P17/P18 starter ikke før eieren har valgt oppfølgingsarbeid og P0/P1 er løst eller eksplisitt vurdert. Menneskelig pilot er foreslått, ikke gjennomført.
