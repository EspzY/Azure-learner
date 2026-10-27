# AZ-900 — prioritert, avgrenset PR-plan

## P01 implementation update2026-10-27

Core Part A is implemented as the next ordinary course module with three separately versioned objectives and physical failure/dependency model. The complete core module remains partial until P02/PR23 supplies resources/resource groups, subscriptions, management groups and hierarchy. No future operational failover, AZ-104/AZ-305 functionality or full module evidence is implemented. [Scope and authored manuscript](CORE_ARCHITECTURE_PHYSICAL.md); actual tests/review/delivery belong to PROJECT_STATUS and the new Draft PR.

## P00 implementation update — 2026-10-27

P00 is now implemented as a versioned FC08 supplement in the existing course, with no Functions operational engine or old evidence migration. See [manuscript and compatibility](SERVERLESS_FOUNDATIONS.md), [updated matrix](AZ900_COVERAGE_MATRIX.md) and PROJECT_STATUS for actual checks and outstanding human gates. The following plan remains historical prioritization; P01/P02 core architecture are next and are not implemented by P00.

Planversjon 1.0.0, 2026-10-26. Grunnlag er [den faktiske dekningsmatrisen](AZ900_COVERAGE_MATRIX.md) og [gap-analysen](AZ900_GAP_ANALYSIS.md), ikke antall eksisterende kort eller modultitler. **Ingen PR nedenfor er implementert eller automatisk autorisert av denne planen.** Nye stablede implementeringsgrener avtales separat; ingen merge eller produksjonsdeploy.

## Prioriteringslogikk og avhengigheter

Hvert tiltak er vurdert etter eksamensrelevans, læringsverdi, nødvendige forutsetninger, eksisterende gjenbruk og varig kostnad. Rekkefølgen er en anbefalt hovedsekvens, ikke et estimat i uker. Unngå kunstige poengsummer for nytte. Prioritering kan endres når menneskelig review finner feil; offentlige mål/kilder sjekkes på nytt ved oppstart.

| Bølge | PR-er   | Begrunnelse                                                                                                                                             | Avhengighet                                                                                                               |
| ----- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1     | P00–P02 | Lukk eksplisitt serverless-hull; bygg den første nye modulens fysiske og organisatoriske fundament. Høy gjenbruk, liten ny motor.                       | Nåværende cloud-forutsetninger; P02 følger P01.                                                                           |
| 2     | P03–P05 | Bedre uavhengige bevis i de tre eksisterende modulene; kostnadsstyring gir tidlig bredde i det 30–35 %-vektede området; compute sammenlignes utover VM. | P00, P01/P02; nye itemversjoner isoleres.                                                                                 |
| 3     | P06–P09 | Nettverks- og lagringsgrunnlag for det største eksamensområdet; tydelige fagvisualiseringer fremfor nye operasjonelle plattformer.                      | P01/P02; P07 etter P06, P09 etter P08.                                                                                    |
| 4     | P10–P14 | Identity, access, governance, tools og monitoring knytter sammen scopes, kostnader, konfigurasjon og drift.                                             | P02 og P06; P11 etter P10; P12 etter P11; P13 etter P02; P14 etter P05/P06.                                               |
| 5     | P15–P16 | Syntese av sikkerhet og realistiske flytte-/migreringsvalg.                                                                                             | P10/P11/P14; P16 etter P08/P09 og nettverk.                                                                               |
| 6     | P17–P18 | Versjonert diagnostikk og original bank med ekte transfer/human-review-gater. Ingen readiness-løfte på ufullstendig grunnlag.                           | P17 kan bygges med testfixtures etter at kontrakten er godkjent; full diagnostikk P18 krever alle forutgående fagområder. |

P13/P14 kan trekkes frem når forutsetningene er dekket, for å balansere architecture og management. Rekkefølgen er utviklingsrekkefølge; studentens Learn-navigasjon skal fortsatt følge verifisert offisiell modulstruktur. En halv modul merkes som delvis tilgjengelig; uferdige vurderinger skal ikke fremstå som støttet.

## Felles aksept for hver fag-PR

1. Originalt manuskript før komponentarbeid: A–H-lagene fra [Content Standards](CONTENT_STANDARDS.md), nøkkelord før bruk, kilde-/versjons-/dato-ID og spesifikke misforståelser. Ingen Learn-/eksamensspørsmål kopieres.
2. Hvert mål får teaching → relevant practice → nytt selvstendig scenario → rationale for hvert plausibelt alternativ. Alle mål/fasetter i PR-scope skal fremgå i matrisen; delvis arbeid beholdes PARTIAL.
3. Course-/Journal-/SavvyShark-presentasjonen bruker samme innholdskilde og semantisk alternativ. Nytt stoff er synlig fra ordinær preview-root, aldri bare en skjult proof-rute. Desktop 1920×1080, 1440×900 og 1366×768 prioriteres.
4. Ingen endring av gamle svar, førsteforsøk, evidence, XP eller replay. Nytt innhold får eksplisitt versjons-/kompatibilitetskontrakt. Gammel fullføring blir ikke bevis for nye mål. Nye overlays/sidecar-observasjoner må gjennomgås før kode; ikke krev at gamle Foundations v1/v2 bytes skrives om.
5. Rene deterministiske regler for nye konseptmodeller; enheter/antakelser forklares før tall. Guidet/hjelp/retry skilles fra første unaided. Ingen egentlig Azure-drift, API, konto eller prisdata.
6. `npm run check`, audit/curriculum/docs/assets, produksjons-E2E, negative modell-/vurderings-/lagringstester, keyboard/Axe, actual preview/SHA og inspiserte skjermbilder. Relevante gamle assertions beholdes. Kvalifisert SME og novice/IT-review registreres separat som utført eller utestående.

## P00 — Serverless som komplett, avgrenset tillegg

- **Mål:** `1.1.07`; forbered `2.2.01`. Reserver `FC08` som mulig lokal ID, men registrer den først ved implementering og ID-review. Definer serverless uten å hevde fravær av fysisk server, automatisk gratis tomgang eller samme billing/scaling for alle tjenester.
- **Elevaktivitet:** Sammenlign en hendelsesutløst kort jobb med en langvarig, OS-avhengig prosess. Manipuler en tydelig syntetisk hendelse/utførelseskjede; identifiser provider-/kundeoppgaver og velg løsning i to nye situasjoner. Vis planavhengige begrensninger før vurdering.
- **Gjenbruk:** Current Foundations prerequisite-figurer, ansvarsmatrise, Journal, SavvyShark og første/hjelp/retry-mønstre. [Functions-kilden](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview) må sjekkes på nytt; en Functions-plan er et eksempel, ikke definisjonen av alle serverless-produkter.
- **Grenser / kostnad:** Liten konseptmodell, ingen ny Azure-ressurs eller Functions-host. Ikke migrer gamle fullføringer, og ikke merk dagens module-complete som nytt serverless-bevis. Ingen ekte pris eller ytelse. Lav motorkostnad, moderat forfatterskap/review.
- **Tester:** Trigger→modellert utførelse, deterministisk limit, kundekode/data/access, ingen bevis ved animasjon; feil «ingen server»/«alltid null tomgangskostnad»; nye versus tidligere observerte oppgaver og isolert save/reload.
- **Aksept:** Full A–F på serverless-raden, to begrunnede endrede oppgaver, forståelig forbindelse fra cloud computing til compute-valg. Gamle stores/forsøk identiske. Menneskelig fag-/læringsreview rapporteres uten automatisk godkjenning.

## P01 — Core architecture A: fysisk infrastruktur og feilgrenser

- **Mål:** `2.1.01–03`; region, zone, datasenter, regionspar og sovereign-begrensninger. Dette er første halvdel av den anbefalte **første nye fulle modulen**.
- **Elevaktivitet:** Undersøk datacenter→zone→region som fysisk/geografisk modell, velg separat sammenligning av regionspar og sovereign-miljø; forutsi hvilken konfigurasjon som faktisk berøres av en avgrenset feil. En ny kravsituasjon krever begrunnet valg uten guidet markering.
- **Gjenbruk:** Eksisterende regionegenskaper, pedagogiske SVG-kontroller og Benefits sin forklaring av routing/dependencies. Regioner tegnes adskilt fra management-hierarkiet.
- **Grenser / kostnad:** Ingen faktiske failover- eller HA-kommandoer. Ikke alle regioner har par; sonestøtte er tjeneste-/regionspesifikk; par innebærer ikke automatisk app-recovery. Moderat visualiseringsarbeid, ingen ny operasjonell motor.
- **Tester:** Ikke-paret region som moteksempel, manglende zonestøtte, fysisk versus management-parent, vurdering av feilgrense, keyboard/lesbar teori. Source checks mot reliability-dokumentasjon på implementeringsdato.
- **Aksept:** Alle navngitte fasetter har forklart mekanisme og ny-kontekst vurdering. Ingen usann generell failoverpåstand. Modul merkes fortsatt delvis tilgjengelig inntil P02.

## P02 — Core architecture B: scopes, lifecycle og relasjoner

- **Mål:** `2.1.04–07`; kompletter core-modulen. Tenantidentitet, Tenant root group, management groups, subscriptions, RG/resources, policy-scope og lifecycle. Detaljert RBAC-utøvelse venter til P11.
- **Elevaktivitet:** Bygg/undersøk en semantisk hierarchy-modell, forklar hvilke ressurser som bør dele lifecycle, og bruk eksisterende RG/plan/app-lab. Sammenlign containment, hosting og location. Et teknisk gyldig feil subscription-valg skal feile scenarioet uten fabrikkert permissionsfeil.
- **Gjenbruk:** Live Architecture, `scopeCopy`, eksisterende inventory/skjemaer, metadata-location-/dependency-/policyreceipts og lab→eksakt kursretur.
- **Grenser / kostnad:** Ingen operativ management-group-, tenant- eller rollesimulator. Konseptmodellen må ikke duplisere autoritativ inventory. Moderat undervisningsarbeid og god eksisterende teknisk gjenbruk.
- **Tester:** Ikke-nestet RG, subscription-boundary, feil lifecycle-valg, RG-metadata versus resource location, containment versus hosting, post-boundary selvstendig evidens og gammel lagring.
- **Aksept:** Alle syv core-punkter samlet tilgjengelige med egne vurderingsspor. En elev kan forklare hele hierarkiet i et nytt scenario, ikke bare åpne grafnoder. Modulens faktiske kvalitet vurderes før videre skalering.

## P03 — Bedre transfer og feedback i nåværende Cloud concepts

- **Mål:** `1.1.03–04,06`, `1.2.01–04`, `1.3.04`. Lukk de konkrete D/E-hullene uten å redusere manuskriptene.
- **Elevaktivitet:** Nye tilfeller som gjør public riktig, velger commitment eller avbrytbar kapasitet, krever ekte HA/scaling-/dependency-diagnose, skiller governance fra security og velger ferdig SaaS ut fra forretningskrav. Ingen spørsmålstekst som allerede gir diagnose eller feilretting.
- **Gjenbruk:** Modeller/figurer, eksisterende guidet/first/help/retry og togyldige-arkitekturer-prinsippet.
- **Grenser / kostnad:** Originalt innholdsarbeid, ikke en ny modellplattform. Gammel first submission og rubric må forbli replaybar; ny task family/version kan ikke overskrive den.
- **Tester:** Plausible distraktorer med egen begrunnelse; minst to strukturelt ulike konteks­ter per målgruppe; ingen løsning før commit; aid/retry/reload og gammel versjon.
- **Aksept:** Hver av de åtte radene har sine manglende fasetter vurdert uten forhåndssvar. Feedback knyttes til faktisk valg. SME må vurdere vanskelighetsgrad og ledende formuleringer.

## P04 — Cost management: fra bruk til estimat og styring

- **Mål:** `3.1.01–04`; driverne type/tier/region/bruk/traffic/licensing/offer, Pricing Calculator, Cost Management og tags.
- **Elevaktivitet:** Sammenlign to scenarioestimater, skill estimat fra etterfølgende analyse/budsjettvarsel og velg taggstruktur. Guided gjennomgang av offentlig kalkulator kan ha lokal datert illustrasjon som alternativ; grunnforklaringen må være i AzureLab.
- **Gjenbruk:** Metering/pricing, inventarets type/location, scope-modell og visuell sammenligningsbenk.
- **Grenser / kostnad:** Ingen live fakturering/pris-API, ingen «budget stopper alt»-påstand. Ikke innfør tags som ny resource command bare for å fylle UI; konseptuell øvelse er førstevalg. Moderat manuskript-/illustrasjonskostnad.
- **Tester:** Estimat versus faktisk kostnad, tomgang/overføring, ingen price-truth fra syntetiske tall, tags uten automatisk arv/autorisasjon, selvstendig beslutning og source-date.
- **Aksept:** Alle fire mål forklart og anvendt; alle tall merket. Calculator-utforskning har reelt pedagogisk steg, ikke bare en lenke.

## P05 — Compute og hosting uten nye driftsmotorer

- **Mål:** `2.2.01–04`; VM/container/Functions, VMSS/availability sets/Virtual Desktop og hostingmuligheter.
- **Elevaktivitet:** Inspiser guest/image/runtime/trigger-modeller, sammenlign hva som skaleres og hvem som vedlikeholder det; velg en egnet type i nye krav. Forklar disk/NIC/subnet-behov etter den eksisterende VM-labben.
- **Gjenbruk:** VM-/PaaS-laber og receipts, P00, responsibility-modell og Architecture.
- **Grenser / kostnad:** Ingen AKS, VMSS, AVD eller Functions-operasjonell motor, orkestrering eller faktiske remote sessions. Moderat innholdsarbeid; kontrollert modellutvidelse.
- **Tester:** Container er ikke VM; Functions er ikke universell hosting; availability set versus scale set, guest-maintenance og dependency-rationale, ikke bare inspected-ID.
- **Aksept:** Alle navngitte alternativer har kontraster og egen vurdering. Eksisterende bundle atomisitet, innstillinger og policy uendret.

## P06 — Nettverk A: VNet, subnet, peering og DNS

- **Mål:** Navngitte VNet/subnet/peering/DNS-fasetter i `2.2.05`.
- **Elevaktivitet:** Følg et logisk kilde→navn→mål-forløp, endre adresse-/koblingsvalg og forutsi en avgrenset konsekvens. Skill DNS-navneoppslag fra nettverkstilgang.
- **Gjenbruk:** Faktiske NIC/VNet/subnet-konfigurasjoner som inspeksjonsgrunnlag, eksisterende typed graph og semantisk liste.
- **Grenser / kostnad:** Separat merket konseptmodell, ingen påstått faktisk packet engine, NSG/routing/peering commands eller DNS-resolver. Moderat modell-/figurarbeid.
- **Tester:** Subnet-medlemskap versus hosting/containment, ikke-overlappende eksempel, peering ikke «alt blir automatisk transitive», DNS-svar er ikke tillatelse.
- **Aksept:** De fire fasettene kan forklares og anvendes i nytt scenario; øvrige networking-fasetter er fortsatt åpne til P07.

## P07 — Nettverk B: hybridforbindelser og endpoints

- **Mål:** VPN Gateway/ExpressRoute i `2.2.05`, hele `2.2.06`.
- **Elevaktivitet:** Velg forbindelse ut fra krav, spor forskjellen mellom navneoppslag, offentlig endpoint og private IP-tilgang i konseptmodellen; forklar gjenværende tilgangskontroller.
- **Gjenbruk:** P06 og fysiske/geografiske skiller fra P01.
- **Grenser / kostnad:** Ingen tunnel, ExpressRoute-bestilling, private DNS eller automatisk sikkerhetsgaranti. Moderat authored sammenligning.
- **Tester:** Privat IP er ikke automatisk autorisasjon; ExpressRoute må ikke forenkles til universell kryptering; public endpoint er ikke automatisk anonym tilgang.
- **Aksept:** Begge eksamenspunkter har komplette navngitte fasetter og uavhengig begrunnelse uten faktiske Azure-tilkoblinger.

## P08 — Storage A: kontoer og tjenester

- **Mål:** `2.3.01,04`; Blob/Files/Queues/Tables, konto-/tjeneste-/typevalg.
- **Elevaktivitet:** Fordel objekt, filshare, asynkron melding og nøkkelbasert tabulært datasett til passende tjeneste; undersøk kontoavgrensninger og differensier disk fra Blob.
- **Gjenbruk:** Forklarende inspeksjon, typerelasjoner, datalifecycle og Journal.
- **Grenser / kostnad:** Ingen Storage API, database, SAS-generation eller filopplasting. Moderat modell-/innholdsarbeid; kontoalternativer må datokontrolleres.
- **Tester:** Filsystem versus objekt, kø versus tabell, støttede kontotype-/tjenestekombinasjoner og plausible alternativer.
- **Aksept:** Tjenestene velges i nye scenarioer og konto/type forklares; Managed disks godskrives ikke som alle Storage services.

## P09 — Storage B: tiers og redundans

- **Mål:** `2.3.02–03`; Hot/Cool/Cold/Archive, LRS/ZRS/GRS/GZRS og read-access-varianter.
- **Elevaktivitet:** Velg tier fra tilgangs-/hentebehov og redundans fra definerte feilgrenser. Sammenlign tilgjengelighet, kopiering og gjenoppretting med tydelige modellforutsetninger.
- **Gjenbruk:** P01 fysisk infrastruktur og P08 konto-/tjenestemodell.
- **Grenser / kostnad:** Ingen replikasjon, virkelige retrieval-tider/priser eller oppdiktede RPO/SLA. Redundans er ikke backup mot logisk sletting. Moderat fagreview; tjenesteavhengige grenser er viktige.
- **Tester:** Asynkron geo-kopiering kan ha datatap ved feil; sekundær lesing er et eget valg; archive begrenser umiddelbar lesing; ingen universelle garantier.
- **Aksept:** Alle tier-/redundansfasetter vises med avveining, kilde og ny-kontekst vurdering.

## P10 — Identity-grunnlag

- **Mål:** `2.4.01–03`; Entra ID versus Domain Services, SSO/MFA/passwordless og eksterne identiteter.
- **Elevaktivitet:** Følg identitet→autentisering→tilgang som forskjellige spørsmål, sammenlign directory-/authbehov og ekstern samarbeidssituasjon.
- **Gjenbruk:** Tenant-scope-forklaring og retained identity/access fra Service Types. SaaS-lab er kontrast, ikke Azure-authmotor.
- **Grenser / kostnad:** Ingen konto, passord, MFA-kode, tenantopprettelse eller utstedelse av token. Originale abstrakte signaler, moderat innhold/figurarbeid.
- **Tester:** SSO er ikke MFA; passwordless er ikke automatisk ingen faktor; Domain Services er ikke synonym for Entra ID; ekstern gjest er ikke automatisk admin.
- **Aksept:** Alle navngitte autentiserings-/directoryfasetter forklares og vurderes i ny kontekst uten credentials.

## P11 — RBAC og Conditional Access

- **Mål:** `2.4.04–05` og støtte til security/governance.
- **Elevaktivitet:** Velg principal/role/scope etter et konkret least-privilege-behov, og vurder en separat signalkombinasjon for Conditional Access. Forklar hvorfor en tillatt ressurskonfigurasjon ikke beviser tilgang.
- **Gjenbruk:** Scope-graf, CB03 og P10; innsyn i eksisterende custom Policy som kontrast.
- **Grenser / kostnad:** Ingen ekte IAM, rolletildeling eller policy enforcement. Konseptuell beslutningsmodell med testet avgrensning; moderat kompleksitet.
- **Tester:** Entra directory roles versus Azure roles, arv/scope, autentisert versus autorisert, policy versus access, hjelp versus unaided.
- **Aksept:** Nye cases kan løses uten at guide viser rolle/scope-fasit. SaaS-produktroller teller aldri som Azure RBAC-bevis.

## P12 — Governance-verktøy og begrensninger

- **Mål:** `3.2.01–03`; Purview, Policy og locks.
- **Elevaktivitet:** Klassifiser datastyring, konfigurasjonskrav, autorisasjon og ressursbeskyttelse. Undersøk reelt eksisterende policyavslag og forutsi separate lock-konsekvenser i en merket konseptmodell.
- **Gjenbruk:** Custom Policy receipts/korreksjon og P02/P11.
- **Grenser / kostnad:** Ingen full Purview eller lock API. ReadOnly/CanNotDelete og control-/data-plane-unntak må kildegranskes, ikke gjøres til en for enkel universell blokkering.
- **Tester:** Lock er ikke backup eller RBAC; tillatt location betyr ikke full compliance; auditering versus deny; avvist kommando forblir uten mutation.
- **Aksept:** Alle tre formål kan velges/begrunnes i uavhengig situasjon. Ingen skjult endring i policyregler eller gamle receipts.

## P13 — Administrasjon og deployment

- **Mål:** Alle fem `3.3`-punkter.
- **Elevaktivitet:** Følg samme management-intensjon fra Portal, CLI/PowerShell og deklarativ fil til ARM; analyser et lite lokalt template-eksempel og velg Arc for egnet cross-environment-behov.
- **Gjenbruk:** CB04, resource-ID/dependency-graf, Portal og P02. Utvid manuskriptet fremfor å kalle det manglende fra null.
- **Grenser / kostnad:** Ingen ekte shell eller deployment. Bicep kan forklare forfatterskap, men ARM templates må fortsatt undervises eksplisitt. Arc er management, ikke automatisk migrering eller samme egenskaper overalt.
- **Tester:** Imperativ/deklarativ forskjell, klient versus management-layer, feil avhengighetsreferanse, Cloud Shell versus CLI/PowerShell og Arc-moteksempel.
- **Aksept:** Fem separate mål med komplette oppgaver/rationales. Den lokale simulatormotoren utgis aldri for ARM.

## P14 — Monitoring og diagnose på Fundamentals-nivå

- **Mål:** Alle `3.4`-punkter og relevante predictability-hull.
- **Elevaktivitet:** Klassifiser anbefaling, plattformhelse, ressurshelse, metrics/logs/traces og varsel. Undersøk et syntetisk signalsett og velg Advisor, Service Health eller Monitor med Log Analytics/alerts/Application Insights.
- **Gjenbruk:** Benefits dependency/trend og teknisk inspeksjon som navigasjonsmønster.
- **Grenser / kostnad:** Ingen innsamling av reelle data, ekte KQL-backend eller runtime-monitorering av den simulerte Web App. Krever tydelig separat syntetisk observasjonsfixture; moderat modellarbeid.
- **Tester:** Control-plane receipt versus telemetry, anbefaling versus hendelse, query versus alert, appfeil versus Azure-hendelse, ingen symptom i spørsmålet som røper løsning.
- **Aksept:** Alle navngitte produkter og signalroller har egen forklaring og transfer-case. Ingen oppdiktet faktisk apphelse.

## P15 — Sikkerhetsprinsipper og Defender for Cloud

- **Mål:** `2.4.06–08`; Zero Trust, defense in depth, Defender-formål.
- **Elevaktivitet:** Analyser et brudd i ett lag, velg komplementære kontroller og skill posture-anbefaling fra workload protection/garantert sikkerhet.
- **Gjenbruk:** P10/P11 identity/access og P14 signaler; Service Types retained ansvar.
- **Grenser / kostnad:** Ingen skanner, live sikkerhetsdata eller påstått angrepsdeteksjon. Konseptuell trussel-/lagmodell; moderat fagreview.
- **Tester:** Perimeter alene, blind intern tillit, least privilege alene som «hele Zero Trust», Defender som garanti, kilde-/versjonsgrenser.
- **Aksept:** Tre prinsipper/formål kan anvendes i nye cases, med plausible og forklarte alternativer. Tillegg om encryption/key management merkes separat Learn-stoff, ikke ny eksamensvekt.

## P16 — Filflytting og migrering

- **Mål:** `2.3.05–06`; AzCopy, Storage Explorer, File Sync, Azure Migrate og Data Box.
- **Elevaktivitet:** Velg verktøy etter engangsoverføring, grafisk inspeksjon, kontinuerlig filsynkronisering, oppdagelse/migreringsplan eller begrenset forbindelseskapasitet. Nye scenarioer krever avveining og forklaring.
- **Gjenbruk:** Storage-, nettverks- og cost-grunnlag og scenario-sammenligningsmønster.
- **Grenser / kostnad:** Ingen opplasting, nedlastet CLI, ordre eller migreringsløfte. Lav motorkostnad, moderat originalt innhold.
- **Tester:** Flytting versus sync, discovery versus datatransport, offline betyr ikke null planlegging/sikkerhet, eksempler uten ekte fil-/kundedata.
- **Aksept:** Alle fem verktøy har tydelig rolle/avgrensning og uavhengig valg.

## P17 — Diagnostikkmotor med gjennomgått kontrakt

- **Mål:** Infrastruktur i [Assessment Blueprint](AZ900_ASSESSMENT_BLUEPRINT.md); dette øker ikke curriculum coverage alene.
- **Elevaktivitet:** Kun reviewer/testfixtures til banken er godkjent; ingen full exam-readiness-visning på manglende fagdekning.
- **Gjenbruk:** Eksisterende first/help/retry, allowlist-navigation, validering/replay og lokale ikke-autoritære records. Ingen nye passgrenser/XP på gamle forsøk.
- **Grenser / kostnad:** Ingen backend, ekstern AI eller generisk scriptinterpreter. Typed original item/family-version, primærmål for vekting, låst levering og lokal databeskyttelse. Moderat til høy vurderings-/lagringskompleksitet.
- **Tester:** 40-item-formens 11/15/14-fordeling, manglende bank, duplikate/eksponerte familier, assistance, ufullført/reload/korrupt schema, ingen svar i metadata før levering.
- **Aksept:** Ingen «readiness» fra placeholders; alle diagnostiske konklusjoner har oppgave-/målgrunnlag og usikkerhet. UI merket under utvikling inntil P18.

## P18 — Original bank, transfer og menneskelig pilot

- **Mål:** Alle 57 rader, de 126 lokale fasettene og vurderingskvalitet. Ingen automatisk MATCH/COMPLETE fra itemantall.
- **Elevaktivitet:** Guidet trening adskilt fra første unseen/family-holdout, flere endrede kontekster og forsinket gjenhenting. Følg lenker tilbake til riktig teori uten å gjøre forsøket unaided igjen.
- **Gjenbruk:** P17 og faktisk undervisning/praksis fra P00–P16.
- **Grenser / kostnad:** Dette er flere reviewbare bankleveranser om nødvendig, ikke én gigantisk tekstdump. Menneskelig qualified SME, novice/IT-pilot og itemanalyse er reelle eksterne gater; ikke oppdiktet automatisk autoritet.
- **Tester:** Kilde-/mål-/misconception-bindinger, full rationale, rettferdig alternativrekkefølge, familieeksponering, vektet form, manglende mål og redirect til presis undervisning. Regression av all eldre læring.
- **Aksept:** Ekspertreview og pilot er dokumentert med faktisk utførende/dato/funn; alle åpne svakheter vises. Ingen Microsoft-logo/status, garanti, konvertering til Microsoft-skala eller offisiell sertifisering. Dersom menneskelig review ikke er utført, er dette fortsatt en review-kandidat.

## Klar anbefaling for neste implementeringsoppdrag

Bestill **P00 alene** som neste avgrensede implementering. Be om manuskript, kilde-/scope-review, hendelsesmodell, to nye scenarioer og eksplisitt lagrings-/evidensversjon før kode. Bestill deretter core architecture som **P01 og P02**, med full modulstatus først etter begge. Ikke utvid den operative simulatoren for å dekke ord i eksamenslisten når en bedre konseptmodell gir læringsmålet med lavere vedlikeholdskostnad.
