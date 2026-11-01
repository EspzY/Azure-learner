# Learning Flow & SavvyShark Guidance Recovery — PR43

Base: `0e9ab6d7def350df4ae8d4822169dc243ac0c4ec`. Avgrenset retting av LJ-01 og PORTAL-GUIDE-01 etter [helhetsrevisjonen](reviews/AZ900_END_TO_END_AUDIT.md). Ingen ny undervisning, assessment, global progresjonsmotor eller operativ Portal-funksjon.

## Hva som var galt

CourseNavigation valgte neste topic fra en statisk liste. Securitys delvise `trust`-undersøkelse ble derfor sendt fra Studio til oppdragslisten, selv om lagret arbeid manglet kontraster eller årsaksforklaring. Oppdragslenken lovet briefing, men åpnet bare Studio. Tidligere lagring fungerte; hovedhandlingen brukte den ikke.

Portal hadde flere fagspesifikke guider som krevde gyldige URL-parametere og lagret oppdrags-/forsøkskontekst. VM-/PaaS-guidens eksisterende minimerte knapp kunne gjenåpnes. Derimot hadde vanlig `/portal` ingen synlig inngang til den lagrede guiden når URL-konteksten manglet. Dette er en bekreftet gjenfinnings-/kontekstfeil i UX, ikke dokumentert sletting av øktdata. Fri Sandbox hadde heller ingen generell orienteringsinngang. Independent-, konflikt- og lagringsundertrykking er tilsiktet sikkerhet og beholdes.

## Minste gjenbrukbare løsning

`learning-flow.ts` projiserer eksisterende provider-facts og modulens opprinnelige evaluatorer til anbefalte handlinger. `GuidedLearning` er en lokal lesemodell rundt Course/Portal, uten persistent state, events eller parallelle completion-data. Native VM-/nettverksinspeksjon og faktisk Policy-/Tools-praksis bruker sine eksisterende tekniske verifiseringspredikater; klikk og URL gir ingen kreditt.

| Dokumentert tilstand                              | Primærhandling                                                                |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| Ikke startet                                      | Start undersøkelsen → briefing, fortsatt eksplisitt Start/Avbryt              |
| Aktiv, nødvendige observasjoner mangler           | Fortsett undersøkelsen → riktig oppdrag og arbeidsflate                       |
| Påkrevde observasjoner finnes, forklaring mangler | Fullfør årsaksforklaringen → eksisterende årsaksfelt                          |
| Fullført etter opprinnelig evaluator              | Debrief forblir synlig; neste relevante guide eller selvstendig anvendelse    |
| Pauset                                            | Gjenoppta samme økt via opprinnelig resume-event, aldri en ny mission         |
| Annet aktivt oppdrag i modulen                    | Synlig navn og retur til dets faktiske perspektiv                             |
| Aktiv selvstendig vurdering                       | Eksakt vurderingskontekst prioriteres, også når den er assistert              |
| Ukjent/konflikt/ugyldig teknisk forsøk            | Kontroller historikken; ingen oppdiktet fullføring eller automatisk rebinding |

Ny repetisjon arver ikke tidligere completion. Cost har ingen pause/resume-event og får ingen ny slik kontrakt. Når flere pauser finnes, velges senest lagrede økt i den aktuelle modulen. Hub bruker eksisterende autoritativ modul-/resume-prioritet og den avledede guided-destinasjonen; det innføres ingen ny global tidslinje for konkurrerende moduler.

Oppdragsoversikten viser Ikke startet, Pågår, Pauset eller faktisk fullført guidet undersøkelse/tilgjengelig repetisjon. Et eksplisitt `brief=<mission>`-lenkeintent forbrukes én gang og åpner riktig native briefing først når eksisterende safety-grense tillater det. Vanlig Studio-besøk, reload, Back eller retur oppretter ikke en økt eller gjentatte popups. Start er fremdeles eksplisitt. Direkte navigasjon til annen teori/modul er fortsatt fri og gir ingen faglig kreditt.

## Portal: én gjenkjennelig inngang, eksisterende guider

Headeren har en diskret **SavvyShark**-kontroll. Den gjenåpner det minimerte resident-panelet med fokus, eller viser relevant oppdragsnavn/retur. Minimering er bare en lokal visningstilstand; den sletter, avslutter eller starter ingen økt. Reload viser eksisterende guide som før uten ny briefing.

| Kontekst                                       | Oppførsel                                                                                |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Eldre Web-lab, praktisk VM/PaaS, eldre mission | Opprinnelig resident-guide og origin-/attempt-kontrakt beholdes                          |
| Compute VM / Networking-inspeksjon             | Resident-guide bare ved verifiserbar opprinnelig teknisk kontekst                        |
| Vanlig Portal med gyldig lagret arbeid         | Eksplisitte lenker gjenoppretter riktig URL; ingen automatisk valgt mission              |
| Studio-eid nyere oppdrag                       | Forklarer at veiledningen fortsetter i Studio; Portal er faktisk lokal ressurskontekst   |
| Nytt teknisk forsøk eller usikker kobling      | Kontroller oppdragskonteksten; gammel guide bindes ikke til nytt forsøk                  |
| Fri Sandbox uten oppdrag                       | Kort orientering og lenke til eksisterende guidet praksis; ingen falsk aktiv mission     |
| Aktiv independent                              | Nøytral status/retur; ingen løsningsguide og ingen hjelp registrert ved kun statusåpning |
| Ukjent/korrupt/stale provider                  | Eksisterende scoped recovery, før svarbærende innhold                                    |

Nøytral status erstatter ikke en undervisningsgrense. Journal, Summary og faktisk hjelp følger fortsatt eksisterende durable assistance-kontrakter. En avvist write gir ikke tilgang til hjelp eller en vellykket Start/Resume. Eksisterende eldre kurs-Resume kan legitimt skrive sitt opprinnelige resume-event; det er adskilt fra de nye rent visuelle Portal-kontrollene.

## Bevaring og kontrollomfang

Alle `src/domain/`, `src/content/`, `public/`, kommandoer, receipts, World, XP, gamle store-skjemaer, rubrics og first/help/retry-records er bytebevart. Assessment-banken er uendret og får ingen ny blind/faglig audit i denne UX-leveransen. Historisk fullføring revurderes ikke. Ingen nye pakker, API-er, Azure-operasjoner eller persistent visningspreferanse.

Målrettet ny E2E dekker eksplisitt start i alle 13 moderne moduler: Compute, Networking A/B, Storage A/B/C, Identity A/B, Security C, Cost, Governance, Management og Monitoring. Dyp Security-flyt dekker delvis arbeid, alle kontraster, årsaksforklaring, debrief, neste oppdrag, pause, annen aktivitet, Hub, Back/Forward og reload. Portal-matrisen dekker VM/PaaS, native Compute/Networking, minimering, normal rute, ressursnavigasjon, eksisterende kursretur og teknisk reset. Independent/durable denial/cross-tab, immutable first ved assisted retry og World/XP-bevaring testes separat. Eldre Web-/mission-origin og Journal-retur kontrolleres gjennom berørte eksisterende regresjoner.

Én ny begrunnet kompakt-kjøring av tastatur/Axe/short-height/reduced-motion-vitnet utvider bevart 241-baseline til **265 kjøringer: 245 desktop + 20 kompakt**. Valgfri full profil er 490; ingen full mobilduplisering kreves. Planen er ikke bevis på utført kandidat-CI. Endelig eksakt-head CI, streng release, separat post-stamp review og anonym deployet SHA/brukerreise dokumenteres på Draft PR43 før levering.

Før/etter: [gammel Security 1440](screenshots/learning-flow/before-security-1440.png), [ny delvis guide 1440](screenshots/learning-flow/after-security-1440x900.png), [ny 1024](screenshots/learning-flow/after-security-1024x768.png), [årsak før videreføring](screenshots/learning-flow/after-cause-1440.png), [Portal minimert](screenshots/learning-flow/after-portal-minimized-1440.png), [gjenfunnet guide](screenshots/learning-flow/after-portal-restored-1440.png), [normal Portal-retur](screenshots/learning-flow/after-portal-recovery-1440.png), [kort PC-vindu](screenshots/learning-flow/after-portal-recovery-1024x500.png). Bildene er faktisk rendering; før-versjonen er PR42s offentlige preview, etter-versjonen kandidatens produksjonsbygg.

## Første CI og avgrenset korrigering

Første komplette kandidat-CI på `1a9562ddab03912691a8690d080ebdfcb024f544` (run41350350079) ga **261 bestått / 4 feilet**, ingen passed-receipt og ingen streng release. To Storage-tester forventet retur til samme fullførte guide. De forventer nå neste ufullførte perspektiv (Part A: design etter delivery; Part B: replication etter tiers), med de opprinnelige immutable-save-/World-/observasjonskontrollene bevart. Det er UI-semantikk, ingen ny completion-betydning.

Portal-testen feilet i både desktop- og kompaktprosjektet ved sin eksisterende 320px/Arial-grense: den nye headerkontrollen ga scrollWidth356 mot clientWidth320. Reprodusert på den publiserte første SHA-en. Kun den nye kontrollen komprimeres til en gjenkjennelig mascot-knapp med bevart tilgjengelig navn ved svært smale vinduer; menyen holdes innenfor viewport. Faktisk retest målte320/320. Det eksisterende desktop-oppsettet og den gamle breddeassertionen består. Den nye keyboard/Axe-testen undersøker også akkurat denne kontrollens meny ved samme grense. Dette bevarer en tidligere regresjon, uten ny mobilproduktutbygging.

Første320px-korrigering fikk fem berørte desktop-tester og to kompaktkontroller, alle bestått uten retry; lint,11 domenetester og produksjonsbygg/TypeScript bestod. Separat etterkontroll fant deretter at menyen fortsatt ble klippet ved601–800px selv når dokumentbredden var korrekt: x=-161,7/y50 mens headeren var90px høy. Menyposisjonen følger derfor nå Portalens eksisterende800px-grense uavhengig av knappens600px-labelgrense. Faktisk800px-retest viste x12/y96/width380, under headeren og innenfor vinduet. Den samme keyboard-testen kontrollerer menygrenser, header og fokus ved320/600/601/640/700/768/800/801/1024, med Axe ved320 og800. Den bestod på både desktop- og kompaktprosjektet uten retry (13,2s/12,1s testtid), og produksjonsbygg/TypeScript og målrettet lint bestod igjen. Nytt stamp, separat etterkontroll, ny full eksakt-head CI/streng release og ekstern SHA/brukerreise kreves før levering. De tidligere offentlige bevisene gjelder sin oppgitte SHA og blir ikke automatisk oppgradert.

## Grenser og neste steg

Fagspesifikke motorer og dagens neste-steg-instruksjoner er bevart; felles footer viser fasen og riktig mål, mens detaljert nødvendig kontroll vises i eksisterende guide. Flere lagrede oppdrag velges eksplisitt i Portal; ingen global automatisk konkurranseavgjørelse. Menneskelig novice UX-, skjermleser- og læringseffektvalidering er ikke gjennomført. Axe og agentinspeksjon erstatter ikke disse.

LJ-01/PORTAL-GUIDE-01 behandles avgrenset. UX-01 — Dialog Placement & Modal Consistency er neste forbedringsfase; LJ-02, AS-01 og UX-02 gjenstår. Hele helhetsrevisjonen er ikke lukket. Ingen P17/P18, merge eller produksjonsdeploy.
