# Cloud Concepts — uavhengig kvalitetsrevisjon

Ny gjennomgang 4. november 2026. Produktgrunnlag: PR52,
`527b95140917e75e83899f21e6b2291e01df0a7d`. Denne leveransen er en revisjon for
eiergjennomgang. Den endrer ingen undervisning, vurdering eller runtime-funksjon.

## Proveniens og gjenoppretting

**Originalrapporten ble ikke gjenopprettet.** Den tidligere oppgitte filen,
førsteinntrykkslåsen og PR53-kvalitetsbevisene finnes ikke i det tilgjengelige
miljøet. Rapporten nedenfor er en ny, separat datert gjennomgang. Den forsøker
ikke å gjenskape ukjent original ordlyd eller fremstille nye bevis som gamle.

Den ikke-destruktive undersøkelsen omfattet arbeidskatalog og worktrees, lokale
brancher, status, reflog, stash, ikke-refererte Git-objekter, dokumentutkast,
midlertidige filer og 386 ZIP-arkiver. De 29 ikke-refererte commitene var eldre
syntetiske PR-mergeobjekter. Ingen av dem, eller de 91 undersøkte tekstblobene,
inneholdt målrapportene. Gjeldende base var ren og korrekt; den planlagte
review-branchen og PR53 returnerte 404 på remote. Ingen opprydding eller sletting
ble utført.

Det finnes ingen tilgjengelig funksjon som kan koble til det tidligere tapte
executor-miljøet. Søkene beviser derfor ikke at originalarbeidet aldri eksisterte
eller er slettet der. Den opprinnelige PR53-metodepakken, miljøidentiteten og
rapportens kontrollsum er ukjent. Dette begrenser hva som kan sies om kontinuitet.

## Metode og uavhengighet

To separate AI-reviewere med fersk samtalekontekst undersøkte den offentlige
applikasjonen fra elevens grensesnitt. De mottok scope, preview-adresse og
instruks om å bevare bevis; de fikk ikke eierens tre P1-kandidater, tidligere
funn, fasit eller rubrics før sine første rapporter var låst. Vurderingsrevieweren
registrerte egne beslutninger og årsaker før nøkkelsammenligning. Undervisning
som måtte åpnes før praktiske oppgaver, er ført som eksponering.

Isolasjonen er prosedyremessig: agentene deler filsystem, men var instruert til
ikke å lese applikasjonskode, eldre rapporter, hverandres output eller fasit før
lås. Dette er ikke operativsystembasert tilgangsisolasjon. Hovedforfatteren
kjente eierens kandidater og er **ikke** en blind reviewer.

Førsterapportenes originale bytes, tidsstempler og SHA256-låser bevares separat.
Senere nøkkelsammenligning og målrettet undersøkelse føres i tillegg, uten å
omskrive førstevurderingen. Den avsluttende kvalitetskontrollen av selve
revisjonsleveransen skal være en tredje, separat review etter quality-stamp.

Dette er ekspertbasert AI-inspeksjon. Menneskelig nybegynnertest, kvalifisert
menneskelig Azure-SME, skjermleserbrukertest, psykometrisk validering og målt
læringsoverføring er ikke gjennomført. Ingen av disse kan utledes av grønne
tester eller en korrekt besvarelse.

## Hvordan dekning skal leses

- **Gjennomlest:** hele den oppgitte elevsynlige siden, inkludert nederste
  fagseksjoner. Dette betyr ikke at alle valg i alle modeller er prøvd.
- **Interaksjon prøvd:** navngitte parametere, handlinger og observerte resultater.
- **Blind vurdering:** elevens premisser og alternativer er lest og forslag låst
  før fasit/feedback; dette er ikke automatisk en faktisk browserinnlevering.
- **Teknisk kontroll:** navngitte kontrakter, kildefiler og tester; dette erstatter
  ikke en elevreise.
- **Ikke verifisert:** eksplisitte hull, ikke antatt støtte eller godkjenning.

## Låste førstevurderinger og senere sammenligning

| Reviewer / fase                     | Lås, UTC 4. november | Original rapport SHA256                                            | Lesekopi                                                                                |
| ----------------------------------- | -------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Læringsreise, første UI-gjennomgang | 06:42:10.556945      | `74bc7e716fe3c54421afe48ccfcd26e934d5c0ca8160869af1cc27d6483b5d0b` | [Førsteinntrykk](evidence/cloud-concepts-independent/cold-journey-first-report.txt)     |
| Vurderinger, før nøkler/feedback    | 06:36:22.836218      | `8aa0b46d8923debf2e246788c458549aceddf51d04eff83a5e2f6bb1e4d3673f` | [Blindrapport](evidence/cloud-concepts-independent/cold-assessment-first-report.txt)    |
| Ekstra, avgrenset historisk oppgave | 06:47:13.064         | `17abf48d73900b994a8d7120cc3f45fd41109e5822c16a75c685f42c3bfe5740` | [Separat blind solve](evidence/cloud-concepts-independent/legacy-cold-first-report.txt) |

De to brede førsterapportene omfattet ikke alle historiske vurderinger. En eldre
oppgave ble identifisert etter nøkkelinnsyn. Den fikk derfor en tredje, ny reviewer
som bare fikk den elevsynlige ruten og ingen tidligere funn/fasit. Den smale
førsterapporten verifiserte bare versjon 3.2.1 i Portal; full SHA ble kontrollert i
samme hosts ordinære root **etter** låsen, klokken 06:48:20.979. Dette er ført som
eget tillegg, uten å endre førstevurderingens korrekte forbehold.

Begge brede reviewere kontrollerte den fulle `527b951…`-SHA-en i offentlig
bygginformasjon før sitt arbeid. Alle førstefiler og låser er etterkontrollert med
SHA256. [Arkivregisteret](evidence/cloud-concepts-independent/archive-index.json)
angir originale filnavn, hashes, ZIP-medlemmer og daterte tillegg. ZIP-ene bevarer
originale rapporter, pakker, browserdrivere, tekst, bilder og logger. Lesekopiene
over har identiske bytes; de er ikke etterredigerte oversettelser. Originale
Microsoft-artikkeltekster distribueres ikke i disse arkivene.

## Faktisk elevsynlig dekning

Anonym offentlig PR52-preview ble brukt:
`https://azure-learner-git-codex-az900-cloud-comp-3bf852-espzys-projects.vercel.app`.
Browserbildene er nye bevis fra 4. november, ikke gjenbrukte PR42-bilder.

| Område                              | Faktisk gjennomgang                                                                                                                       | Viktig grense                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Anbefalt Computing inkl. Serverless | Alle 14 aktivitetsinnganger; 12 gjengitte undervisnings-/praksis-/Summary-sider lest, to independent-innganger uten start i reisereviewen | Ikke alle alternative modelltilstander eller lukkede kildeskuffer                  |
| Benefits                            | Alle 7 anbefalte innganger; 6 sidekropper lest, transfer-inngang uten start                                                               | Governance-/sustainability-modellene ble lest, ikke kjørt i cold-reisen            |
| Service Types                       | Alle 8 anbefalte innganger; 7 sidekropper lest, transfer-inngang uten start                                                               | Ikke alle alternative tabs/parameterkombinasjoner eller eldre v1-manuskript        |
| Samlet anbefalt reise               | 29 innganger: 25 gjennomleste gjengitte sider og 4 independent-innganger                                                                  | Dette er aktivitetsruter, ikke 29 mål eller fullføringer                           |
| Foundations v2-vurdering            | Alle 11 felt i registreringspiloten, løst før nøkkel                                                                                      | Ikke en faktisk innlevering i første review                                        |
| Serverless 1.0.0-vurdering          | To beslutning–årsaks-situasjoner og tre enkeltfelt, løst før nøkkel                                                                       | Felt og situasjoner summeres ikke til ett oppgaveantall                            |
| Benefits assessment 2.0.0           | Seks parvise situasjoner og kapasitetens tallfelt                                                                                         | Kilde-/rubricsammenlignet etter lås; ikke browserinnlevert av denne revieweren     |
| Service Types assessment 3.0.0      | Seks situasjoner; ett åpent valg har to faglig forsvarlige par                                                                            | To nøkkel-eksponerte kontrollinnleveringer etter lås                               |
| Terminal Cloud Transfer 1.0.0       | Alle 19 elevsynlige situasjoner, 20 foreslåtte par fordi `cc18` har to alternativer                                                       | Tre faktiske `cc18`-kontrollinnleveringer; ikke fullført alle 19 i browser         |
| Praktiske independent-prompter      | Fire mission-familier og tre eksisterende VM-/Web-/SaaS-labvarianter lest og løst som forslag                                             | Ikke sju praktiske fullføringer                                                    |
| Historiske vurderinger              | Eldre ordinær Services-v2-prompt åpnet; v1-arkiv/challenge inspisert; v1-challenge separat blindt løst                                    | Ingen full historisk populasjon eller rekonstruksjon av alle gamle saves           |
| Portal/SavvyShark                   | Faktisk RG/plan/app/policy/settings, guidet SaaS-lab og målrettet Web-/VM-oppfølging                                                      | Lokale syntetiske operasjoner; ikke Azure, kodekjøring eller reell tilgangsstyring |
| Hub/Summary/Journal                 | Alle tre kataloggrupper, representative Summary-tilstander, Journal-valg/scroll/Escape/fokusretur, Back/Forward/reload                    | Ikke alle Journal-innslag eller manuell cross-tab-matrise                          |

Den ordnede rutelisten, alle faktiske parametere og eksponeringer er bevart i
reisereviewerens originale `coverage.json` og `index.json` i arkivene.
Vurderingspakken inneholder ordrett elevtekst og alternativer før fasit. Historiske
teaching-versjoner, vanlige assessment-versjoner, terminal transfer, basic labs og
missions er **forskjellige kontrakter**, selv når de ligger i samme modul.

## Konklusjon og prioritering

Bevar de seks grunnøktene, den flate sidemenyen, de avgrensede årsaksmodellene og
skillet mellom teknisk kvittering, guidet arbeid og uassistert forståelse. Denne
gjennomgangen gir ikke grunnlag for å starte en ny generell kursombygging.

**CC-01 / eierens P1-A er reprodusert:** Computing-retur faller tilbake til første
aktivitet, og separat Hub-resume bytter kontekst til Services. **CC-03 / P1-C er
bekreftet som manglende premiss**, særlig i den eldre «OS-avhengig»-oppgaven;
dagens VM-mission har et smalere begrunnelsesgap. Dette er ikke en dokumentert
feilavvisning av en ferdig bygget alternativ plattform. **CC-02 / P1-B ble
reprodusert som P2-feedback-svakhet**, ikke som en P1-fullføringsfeil: feil profil
ble korrekt avvist som oppgavefullføring, et nytt riktig guidet forsøk lyktes,
og første resultat ble beholdt. To produktfunn prioriteres dermed som P1, fire
som P2, ett er en fortsatt uavklart P2-kandidat og ett er P3. Ingen P0 ble påvist.

[Funnregisteret](CLOUD_CONCEPTS_FINDINGS.md) gir reproduksjon og alvorlighet.
[Planen](CLOUD_CONCEPTS_REMEDIATION_PLAN.md) deler rettingene i små leveranser.
Ingen produktfunn er rettet eller lukket av at denne rapporten leveres.

De daterte post-lock-tilleggene kan leses direkte:
[retur og to VM-resultater](evidence/cloud-concepts-independent/journey-postlock.txt),
[nøkkel-/versjonssammenligning](evidence/cloud-concepts-independent/assessment-postlock.txt)
og [separat historisk premisskontroll](evidence/cloud-concepts-independent/legacy-postlock.txt).
Utvalgte uendrede browserbilder:
[Hub-resume](evidence/cloud-concepts-independent/images/web-hub-resume.png),
[IaaS-premiss](evidence/cloud-concepts-independent/images/iaas-mission-premise.png),
[ufullstendig VM-debrief](evidence/cloud-concepts-independent/images/vm-incomplete-debrief.png),
[korrekt guidet resultat og grenser](evidence/cloud-concepts-independent/images/vm-complete-detail.png)
og [vurdering ved 1024×500](evidence/cloud-concepts-independent/images/services-assessment-short.png).
Komplette tekst-/bildebevis og kontrollsummer finnes i arkivregisteret.

## Kvaliteter med konkret evidens

**Modellene gjør årsak og begrensning undersøkbar.** En minneforespørsel på 5+4 mot
8 undervisningsenheter ble avvist mens eksisterende 3+3 ble beholdt. Provisioning
ble avvist når støttet kapasitet ikke var bekreftet. Kapasitet seks mot ti ga i de
observerte kjøringene udekket toppbehov to mot null, samtidig som summert ubrukt
allokering steg fra ni til 23. Tallene er uttrykkelige modellantakelser, ikke
Azure-ytelse. Cold-journey 008–011 og tabellalternativet underbygger vurderingen.

**Forbruk og Serverless unngår sentrale snarveier.** Priseksperimentene ga
steady/usage 48 mot commitment 24, men uncertain/usage 8 mot commitment 24; den
siste kombinasjonen viste 20 ubrukte forpliktelsesperioder. Dette er pedagogiske
enheter. Serverless med sju hendelser/to plasser/to runder ga fire fullført og tre
ventende; kodefeil ga tre fullført, tre ventende og én feilet. Trigger er dermed
ikke likt vellykket resultat. Hosted plan, varm/allokert kapasitet og kundens
kode-/databehov omtales særskilt. Bevis: cold-journey 019–034.

**Benefits knytter tiltak til årsak.** Mer frontend-kapasitet ga fortsatt null
gjennomløp når den felles nødvendige avhengigheten var nede; gjenoppretting av
avhengigheten ga seks i modellen. En mal med feil verdi gjentok konfigurasjonen
konsekvent, men brøt tre erklærte standardkrav. Kapasitet, tilgjengelighet,
gjenoppretting og korrekt automatisering blandes ikke sammen. Bevis: 070–078.

**Portal gir etterprøvbar lokal praksis.** North Europe-planen ble avvist med
`policy-location-denied`, revision 2→2 og 7→7 objekter. «Endre konfigurasjon» og
West Europe ga akseptert revision 2→3; appen refererte den korrigerte planen.
APP_ENVIRONMENT ble først utkast, deretter Apply og vedvarende staging etter
reload. Policy-scope, gruppemedlemskap og hosting er ulike relasjoner. Dette er
inspeksjon av lokal konfigurasjon og receipts, ikke målt apphelse eller Azure-drift.
Bevis: cold-journey 055–066.

**SaaS-praksisen viser flere typer administrative konsekvenser.** En tredje
lisens ved 2/2 ble avvist uten revisjonsendring. Lisensfrigjøring/-tildeling,
blokkering, Member-rolle, teamdeling og datagjennomgang ga seks aksepterte lokale
operasjoner; historikken beholdt avslaget. Guidet forklaring, reload og kursretur
var konsistente. Modellen sier at blokkert login ikke tilbakekaller delte kopier.
Dette gir praktisk verdi, selv om den selvstendige Leo-varianten gir svakere
planleggingstransfer enn en reelt endret situasjon. Bevis: 105–115 og CC-06.

**Gyldige alternative arkitekturpar godtas faktisk.** Etter blindlåsen fikk
Services 3.0.0 to separate 6/6-kontrollinnleveringer: IaaS med gjestedrift og PaaS
med plattformdrift i den åpne situasjonen. `cc18` godtok begge riktige par; App
Service sammen med VM-ansvarsbegrunnelsen ga beslutning Ja / begrunnelse Nei.
Disse er nøkkel-eksponerte verifikasjoner, ikke nye blinde eller menneskelige
mestringsresultater. Alle 13 foreslåtte Benefits/Services-par og 20 terminal-par
stemte med nøkkelen. Ingen fasitfeil ble bekreftet i dette utvalget; det beviser
ikke hele bankens psykometriske kvalitet eller at CC-03 er uproblematisk.

**Historikk-/statusspråket er ofte nøkternt.** Besøkte sider ble ikke automatisk
guidet fullført. Benefits Summary skilte fem introduserte områder fra én
guidet bekreftet undersøkelse. Serverless hadde egen historikk uten independent-
observasjon. SaaS-debrief kalte resultatet guidet praksis, ikke selvstendig
mestring. Journal kunne velges/scrolle og Escape returnerte fokus til åpneren.
Bevis: cold-journey 036/080/096/098–103/115.

## Kritisk språk-, lærings- og UX-vurdering

Den faktiske konsolideringen har bedre faglig sammenheng enn et separat fullt
skjermbilde per kort provisioning-forklaring. Det er likevel mer å forbedre inne
i øktene. Ansvars-/forbruksresultater gjentar tekst som allerede er lest; noen
tekniske begreper krever at eleven kjenner prosjektets implementeringsspråk.
CC-04/05 viser ordrette eksempler og målte sidetilstander. Lengde alene er ikke
bevis på dårlig undervisning, og disse funnene gir ikke mandat til å fjerne
moteksempler eller dele de seks øktene opp igjen.

Praksis gjør enkelte beslutninger konkrete, men ikke all praksis undersøker ny
anvendelse. Den oppgitte offboarding-listen og åpenbart urimelige distraktorer er
begrenset transfer-evidens. Nye Benefits/Services-situasjoner er bedre der et
delvis sant alternativ må knyttes til det faktiske kravet. Bevar det skillet;
ikke kall alle oppgaver enten gode eller ugyldige.

Portal-guidens minimering gjorde en dekket kontroll tilgjengelig i kort vindu.
Det er en konkret liten friksjon, ikke bevis for tapt guide eller en generelt
ubrukelig Portal. Uventet tilbakevending til «Finn Resource groups» i cold-reisen
kan skyldes feil oppgavemetadata; årsaken ble ikke endelig isolert. Dette står
som kandidat, ikke en bekreftet generell state-machine-feil.

## Offisielle kilder og forholdet til Microsoft Learn

[Kildekontrollen](evidence/cloud-concepts-independent/source-check.json) registrerer
20 faktisk leste offentlige sider med URL, tittel, dato, HTTP-status, body-hash og
konkret påstand/avgrensning: aktuell AZ-900-study guide, de tre modulenes mål og
struktur, tolv offentlige faglige units samt delt ansvar, compute-valg, Functions
og App Service. Microsofts assessment-enheter og beskyttede figurer er utelatt.
En generell autorisasjonsbannertekst i noen HTML-maler hindret ikke offentlig
artikkeltilgang; ingen autentisering eller beskyttelse ble omgått.

- [Cloud Computing](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/):
  on-demand provisioning, ansvar, cloud-modeller og forbruk. Broad «pay for use»
  leses sammen med faktiske allokerings-/tjenestemålere, ikke som gratis idle-garanti.
- [Benefits](https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/):
  kapasitet, tilgjengelighet, reliability/predictability, sikkerhet/governance,
  administrerbarhet og betinget bærekraft. Ingen automatisk failover eller CO₂-gevinst.
- [Service Types](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/),
  [delt ansvar](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)
  og [compute-valg](https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree):
  konkrete krav og gjenværende ansvar må avgjøre valget; dette støtter CC-03.
- [Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)
  og [App Service](https://learn.microsoft.com/en-us/azure/app-service/overview):
  hostingplan/støtte kan endre idle-/oppstarts-/tilpasningsvilkår. Review-tillegget
  kontrollerte også Managed Instance-detaljer; en retting må ikke bruke generiske
  COM-/registry-/MSI-ord som universelt VM-only-premiss.

**AzureLabs begrunnede merverdi** i dette undersøkte forløpet er original norsk
sekvens, prediksjon→modell→årsak, persistent skille mellom første/hjelp/øving og
lokale administrative handlinger med inspeksjon av kvittering og relasjon.
Learn-enhetene som faktisk ble lest gir konsis tekst/video/diagram og egne
vurderingsinnganger. Sammenligningen gjelder disse sidene, ikke hele Microsoft
Learn. Det hevdes ikke at Learn mangler laber/interaktivitet generelt, at AzureLab
er bedre målt, eller at lokal simulator erstatter reell Azure-praksis.

## Teknisk bevaring og QA-grenser

[Bevaringskontrollen](evidence/cloud-concepts-independent/preservation.json) dekker
1659 allerede sporede filer byte for byte mot `527b951…`: blant annet alle 404
src-filer, 162 domain-filer, 54 testfiler, 53 public-filer, 15 scripts og eksisterende
CI-/konfigurasjonsfiler. Bare prosjektstatus og avgrenset release-metadata kan
endres blant eksisterende filer. Resten av leveransen er nye rapporter/bevis.
Ingen gammel rapport, rubric, event, learner record, World-schema, command,
technical receipt, XP eller kilde-/AZ-900-matrise er omtolket.

Anonyme testbrukere opprettet bevisst syntetiske lokale ressurser og læringsforsøk
for reproduksjon. Det er noe annet enn å endre simulatorens motor eller eksisterende
studenters historikk. Ren navigasjon må fortsatt kontrolleres separat fra slike
autoriserte lokale operasjoner.

Faktisk browserarbeid omfatter 1440×900 og representative 1024×500-tilstander,
tekst-/tabellalternativer, Journal-fokus og ett kortvindu med tastatur/reduced
motion. Axe på én Benefits-management-tilstand rapporterte null automatiske
brudd og ufullstendige kontrastkontroller; det er ikke en full tilgjengelighetsgodkjenning.
Hverken alle modellkombinasjoner, alle historiske saves, hele cross-tab-matrisen,
alle animasjoner/kontraster, mobil eller skjermleserbrukere er manuelt undersøkt.

Forsøk som traff selektorfeil, gammel SPA-tekst, avbrutte prefetch-kall og
`exec-server transport disconnected` er bevart i originale logger. De telles ikke
som vellykkede handlinger eller automatisk som applikasjonsfeil. En blokkert
valgfri Vercel-toolbar er ikke feil i vurderingsfeedback. Ingen retries, timeouts,
workers, skips eller assertions endres for å levere revisjonen.

Full `npm run check`, korrekt ny stamp og separat post-stamp rapportrevisjon
kreves også her. Den eksisterende komplette **351-profilen (318 desktop / 33
kompakt)** og streng release kjøres i autoritativ CI mot levert head. Historisk
PR52-CI er ikke PR53-bevis. Kjent Compute help→hosting→Back-ustabilitet forblir et
separat åpent teknisk punkt med mindre den faktisk diagnostiseres; en ren kjøring
lukker den ikke.

Resultatet av den separate rapportkontrollen føres i
[PR53 Final Audit](../quality/PR53_FINAL_AUDIT.md). Endelige CI-/streng-release-
og anonyme preview-/full-SHA-bevis føres på samme Draft PR53 etter at de faktisk
er utført. Ready eller en lokal test alene er ikke Gate 7. Ingen runtime-inngang
for rapportene legges til: eierens audit-only-grense bevares, og rapportene leses
fra Draft PR-ens filer.

57/57 beholdes som dokumentert authored-content coverage. Denne revisjonen
godkjenner ikke eksamensberedskap, bred designutrulling eller nye produktfaser.
Neste anbefalte avgrensede implementeringsoppdrag er CC-01, etter eierens
gjennomgang av funn og plan. Ingen merge eller produksjonsdeploy.
