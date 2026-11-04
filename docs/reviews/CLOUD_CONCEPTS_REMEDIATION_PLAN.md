# Cloud Concepts — prioritert oppfølgingsplan

4. november 2026. Plan for eiergjennomgang etter den nye
   [uavhengige revisjonen](CLOUD_CONCEPTS_INDEPENDENT_REVIEW.md).
   [Funnregisteret](CLOUD_CONCEPTS_FINDINGS.md) inneholder ruter, reproduksjon,
   konsekvens, anbefaling, historisk risiko og akseptansekriterier per funn.
   Ingen av rettingene nedenfor er implementert i audit-PR53.

## Beslutninger før videre utrulling

| Prioritet                           | Avgrenset leveranse                                                  | Hva som skal bevares                                                                              | Hva som må bevises                                                                                      |
| ----------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Først                               | CC-01: riktig retur og resume fra Computing-opprinnet Web-utfordring | Kanoniske/historiske ruter, samme aktive forsøk, teknisk startgrense, førstesvar og durable hjelp | Delvis/fullført, direkte kursretur og Hub, Back/Forward/reload; ingen falsk økt eller uregistrert teori |
| Deretter, egen P1-retting           | CC-03: eksplisitt premiss i ny IaaS-anvendelsesvariant               | Alle gamle ordlyder/rubrics/first-help-retry og aktive historiske forsøk                          | Ny blind solve, kompatible par, aktuelle plattformgrenser og byte-/replay-uendret gammel historikk      |
| Avgrenset P2 etter eierprioritering | CC-02: målrettet VM-debrief; riktig og feil profil er nå reprodusert | Samme tekniske evaluator, krav, through-/receipt-ID og veiledet klassifisering                    | Eleven ser hva kvitteringen bekrefter, hva som gjenstår og riktig neste handling                        |

P1 gjelder produktets videre berørte utrulling. En korrekt audit kan leveres med
åpne produktfunn; dette er ikke det samme som å godkjenne produktrettingene. Feil
i revisjonens egne bevis, proveniens eller konklusjoner må derimot rettes før
audit-leveransen godkjennes.

## Leveranse 1 — returkontekst, ikke ny navigasjonsmotor

Bevar original Computing-kontekst fra `resource-bridge` gjennom den konkrete eldre
Portal-utfordringen. Rett både allowlist/normalisering og den observerte faste
Services-adressen i Hub-resume. Gjenbruk eksisterende PortalLocation, courseHref og
autoritative stores. Ikke slå sammen nyere `practice=paas`, `mission=platform` og
den eldre `area=challenge`; de har ulike evidenskontrakter.

Testmatrisen skal inneholde før start, aktivt ufullført forsøk, fullført forsøk,
assistert forsøk, teknisk reset/manglende arkiv, to faner, reload og Back/Forward.
Rå lenkenavigasjon skal ikke opprette et forsøk eller endre boundary. Når en aktiv
independent møter teori/debrief/Journal, må gyldig durable hjelp fortsatt være
registrert før beskyttet innhold monteres. En nøytral returskjerm kan være riktigere
enn umiddelbart å vise svarbærende debrief. Gammel ukjent opprinnelse skal behandles
som ukjent, ikke som beviselig Services eller Computing.

## VM-oppfølging — forklar resultatet fra samme tekniske bevis

Rett bare faktisk bekreftet feedback-problem, med en read-only fremstilling av
eksisterende resultat. Skill ressursopprettelse fra oppgavekrav, registrerte
inspeksjoner, elevens forklaring og selvstendig forståelse. En akseptert
CreateVmBundle-kvittering kan være helt korrekt selv om valgt image/profil/disk/
scope ikke oppfyller undervisningsoppgaven.

Hvis forventet/faktisk konfigurasjon vises for en historisk innlevering, må den
komme fra det samme verifiserbare attempt-/through-øyeblikket som den opprinnelige
evalueringen. Dagens endrede eller slettede ressurs må ikke omskrive tidligere
resultat. Ukjent arkiv gir «kan ikke verifiseres», ikke vellykket oppgave. Ingen
ny completion, receipt, score eller XP. Før innlevering i independent skal slik
diagnostikk fortsatt respektere assistance-grensen.

## IaaS-oppfølging — versjonert premiss, ikke nytolket gammel fasit

Eieren bør velge om den nye oppgaven skal undersøke valg av tjenestemodell eller
gjennomføring av en uttrykkelig pålagt VM-konfigurasjon. Det er to forskjellige
vurderingsspørsmål. Ved tjenestevalg må nødvendig gjestekontroll og støttebegrensning
oppgis. Ved pålagt VM skal spørsmålet undersøke kundens ansvar og bevisgrense,
uten å forutsette at Windows-only gjør alle PaaS-alternativer umulige.

Bevar den eldre Portal-v1-vurderingen, den eldre ordinære v2-vurderingen, nyere
assessment v3, terminal transfer og praktiske missions som atskilte kontrakter.
Ikke bruk undervisningens `version=1/2` til å endre betydningen av en vurdering.
Eksakt ny identitet/lagringsløsning skal spesifiseres i implementeringsoppdraget;
denne planen innfører ingen schemaendring. Aktivt gammelt forsøk må kunne avsluttes
etter gammel kontrakt, og nye forsøk må ikke få falsk status som ueksponert eller
førstegangs uassistert etter tidligere hjelp.

Kontroller nye premisser mot faktisk produktdokumentasjon, særlig administrerte
Windows-plattformers støttede tilpasninger. Bevar de nåværende gyldige IaaS/PaaS-
parene i Services 3.0.0 og `cc18`. Ny student-only solve låses før nøkkelsammenligning;
et kosmetisk nytt navn eller ny svarposisjon er ikke bedre transfer.

## Senere, eierprioriterte forbedringer

| Funn  | Neste lille undersøkelse/leveranse                                               | Avgrensning                                                  |
| ----- | -------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| CC-04 | Fjern dokumentert dobbel forklaring og behold resultatspesifikk årsakstekst      | Ikke opphev seks økter, slett forbehold eller endre modeller |
| CC-05 | Norsk elevtekst med tekniske detaljer på riktig nivå                             | Premiss-/rubricendring må ut av ren copyretting              |
| CC-06 | Én liten versjonert etterfølger med reelt endrede krav og plausible distraktorer | Ingen generell bankomskriving; bevar gode begrepssjekker     |
| CC-07 | Reproduser riktig/feil gruppemetadata og forkunnskapsinngang                     | Kandidat, ikke bekreftet generell guide-state-bug            |
| CC-08 | Gjør kortvinduets dekkede Portal-kontroll tilgjengelig med bevart guide-recovery | Ingen ny guideplattform eller nye Portal-tjenester           |

## Menneskelig validering og videre beslutning

Gjennomfør en liten faktisk nybegynnerpilot på den rettede reisen: kan studenten
forklare resultatet, finne riktig arbeidssted igjen og forstå hvorfor valg endres?
Be en kvalifisert Azure-fagperson kontrollere konkrete premisser/alternativer og
en skjermleserbruker kontrollere representative oppgaver. Registrer reelle
deltakere, metode, samtykke og resultater før slik validering påstås gjennomført.
Tidsbruk, antall klikk, ekspertuttalelser og automatiske tester alene beviser
ikke læringseffekt eller psykometrisk gyldighet.

Ingen automatisk bred PD-01-/designutrulling, nye SavvyShark-assets, PR-01 B/C,
P17/P18 eller ny innholdsimplementering følger av denne revisjonen. Neste konkrete
anbefalte oppdrag er CC-01-returrettingen etter eierens godkjenning av funnene.

## PR54 — CC-01 implementeringsstatus

CC-01 er rettet lokalt med eksplisitt Computing-topic, forsøksbundet versjonert
navigasjonsopplysning, nøytral aktiv retur og samme read-only resume i Hub.
Gamle forsøk uten dokumentert opphav gjettes ikke. Også avvist hjelp på den
berørte Computing-undervisningen holdes nå lukket gjennom eksisterende
teaching-preflight. Selve v1-eventene, rubrikken og førsteinnleveringene er bevart.
Se [returkontrakten](../CC01_CHALLENGE_RETURN.md) for mekanisme og avgrensninger.

Status før publisering: målrettet retest gjennomført; endelig lukking av CC-01
avventer post-stamp uavhengig review, eksakt-head komplett CI/streng release og
faktisk anonym Gate7. Dette er ikke en omskriving av PR53s historiske funn.
CC-03 står fortsatt som P1, CC-02 som P2; øvrige prioriteter er uendret.

Leveransens endelige akseptansestatus følger [PR54s dokumenterte leveransegater](https://github.com/EspzY/Azure-learner/pull/54). CC-01 er lukket for dette
avgrensede scope først når disse faktiske gatene er bekreftet på levert SHA.
Inntil da er det implementert, ikke ferdig akseptert. Datert revisjonsevidens og
CC-03/CC-02s prioriteringer over er fortsatt uendret.
