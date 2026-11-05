# CC-02 — diagnostisk VM-debrief

PR56, 5. november 2026. Base PR55:
`fb229a977ef6fb0250ededbb0d35d5314951a31a`. Avgrenset read-only forbedring av
`mission=infrastructure` / `guest-control@1`, ikke en ny vurdering eller VM-motor.

## Før og etter

Faktisk reproduksjon brukte ordinær Services-inngang, eksplisitt guidet Start,
ny gruppe og en ny Ubuntu/Small/data32/Shared Sandbox-VM, original receipt,
ressursinspeksjoner og eksisterende faglige svar. Den aksepterte opprettelsen var
korrekt, men bare det samlede konfigurasjonskriteriet viste «Gjenstår». Den samme
neste-steg-teksten anbefalte selvstendig arbeid også ved ufullstendig resultat.

Ny debrief viser oppdragsstatus, faktisk teknisk opprettelse og det konkrete
avviket før videre detaljer. Small sammenlignes med Standard, med forklaring om
oppgavens modellerte allokering — ingen målt ytelse. Image, datadisk og subscription
vises samtidig som forventet/registrert/samsvar. Manglende inspeksjon eller faglig
forklaring vises separat, selv når konfigurasjonen passer.

Ufullført guided arbeid tilbyr **Forbered et nytt guidet forsøk**. Dette åpner
bare den eksisterende briefingen; Start kreves fortsatt og det gamle forsøket
beholdes. Fullført guided arbeid tilbyr modulens eksisterende selvstendige vurdering,
uten automatisk Start eller mestringspåstand. Øvrige forsøksvalg er sekundære.
Full opprinnelig kriterie-/svarfeedback og original receipt kan åpnes i native details.
Historiske innleveringer åpnes eksplisitt med fokus til den valgte debriefen.
Ingen ny persistent visningsstatus eller oppgavekreditt.

## Én autoritativ kravkilde

`infrastructureRequirements(mode)` er en ren uttrekking av de fire nøyaktig
samme uttrykkene fra `missionEvaluation`. Den opprinnelige evaluatoren bruker
nå denne funksjonen; sammenligningen leser samme funksjon. Guided er Ubuntu
22.04 / Standard / separat32GiB / Shared Sandbox. Independent er Windows2022 /
Small / separat32GiB / App Sandbox. Dette er frosne lokale undervisningskrav,
ikke Azure-SKU-er, ytelsestall eller en ny fasit.

`vmDebrief(session, result)` er bare presentasjon: den leser evaluatorens
`verifiable`, `checks`, `complete`, `receipts`, `world` og `chain`.
Den kan ikke opprette hendelser, innleveringer, fullføring, assistance eller XP.
Kilde-/schema-/rubric-/event-/answer-/attempt-/boundary-/through-betydning er uendret.
En normaliseringskontroll gjenskaper hele den tidligere `missions.ts` byte for
byte etter at bare uttrekkingen reverseres. Alle øvrige tekniske kontrakter og
hele det opprinnelige locale-prefikset er hashbeskyttet i
[bevaringsmanifestet](reviews/evidence/cc02/preservation.json).

## Riktig tidspunkt og ærlige evidenslenker

Den eksisterende `useMissionResult(session)` velger originalt teknisk forsøk
med `engineFor(attempt)` og lar `missionEvaluation` replaye til innleveringens
opprinnelige `through`. Diagnosen bruker **dette** `result.world`/`result.chain`,
aldri dagens inventory. Senere sletting, ny VM eller nytt teknisk forsøk endrer
ikke det historiske resultatet.

Ved arkivert forsøk vises verifiserte originale receipt-opplysninger, men ingen
lenke som kunne løse samme ID i et annet teknisk forsøk. Innen samme tekniske
forsøk kan den originale receipt åpnes. Ressurslenken er tydelig merket som
dagens Portal og brukes ikke som historisk bevis; ressursen kan være slettet.
En opprinnelig generisk Portal-melding kalte også allerede innlevert arbeid
«uverifiserbart». Den er rettet bare for faktisk referert infrastructure-evidens:
et innlevert snapshot i samme tekniske forsøk må kunne replayes, og etterspurt
receipt/ressurs må finnes i dette resultatets opprinnelige referanser. Først da,
med ready/ingen issue/ingen blokkert independent, vises nøytral beskjed om at
oppdraget er innlevert og at debriefen finnes i kurset. Ingen guide startes,
ingen oppdragsfullføring påstås. Andre tilfeller beholder eksisterende recovery.
Dette gjelder også første receipt etter et senere forsøk; nye ressurser eller
et annet teknisk forsøk kan ikke bekrefte koblingen.

Manglende eller ugyldig arkiv gir «Det tekniske resultatet kan ikke verifiseres»,
ingen sammenligning/suksess/foreslått retry basert på dagens ressurser og eksisterende
teknisk kontroll/recovery. Arkivet er fortsatt begrenset av den uendrede Sandbox-lagringen;
gamle bortfalte snapshots kan ikke oppfinnes igjen.

## Assistance og historisk integritet

Ny feedback monteres bare etter innlevering innen eksisterende MissionSafety,
ready/issue- og teaching-boundary. Aktiv independent i egen mission viser ikke
forventet/faktisk-tabellen før levering. Andre aktive/ukjente/stale kontekster
og avvist durable aid holder feedback lukket, også etter at den tidligere var åpen.
Historiske valgknapper åpner ikke gammel feedback under et nytt aktivt mission-forsøk.

Alle eksisterende stores, replay, first/help/retry/abandon, VM-kommandoer,
ressurs-ID-er, World, receipts, XP, PR54s origin/retur og PR55s Portal-v2 er bevart.
Kun eksisterende kravuttrykk er trukket ut; ingen ny autoritativ resultat-store.
Den historiske Windows-only-/kundekontrollnyansen i `guest-control@1` er fortsatt
et separat, dokumentert vurderingsforhold. Dette arbeidet endrer ikke dens premiss.

## Kontrollomfang og leveransegrenser

Målrettede domene- og browserkontroller dekker Small/Standard, feil image/scope,
manglende disk/inspeksjon/forklaring, mode-spesifikke krav, faktisk original receipt,
historisk replay etter sletting/reset, manglende/korrupt arkiv, immutable førsteforsøk,
eksplisitt retry, independent/Journal/avvist hjelp/cross-tab, fokus/keyboard/Axe/reduced
motion og1440×900/1024×768/1024×500 samt800×700 initial kompaktvisning.

Alle367 tidligere browserkjøringer beholdes. Sju nye desktopreiser og ett
begrunnet kompaktvitne gir375 (339desktop/36kompakt); valgfri legacy678.
Innstillinger, skips, retries, timeouts og worker-antall er uendret. Eksisterende
IaaS-regresjon åpner den nye sekundære native disclosure før sin uendrede independent-
handling; ingen gammel sikkerhetsassertion fjernes.

Full check, hashbundet separat final audit, eksakt-head komplett CI/streng release
og faktisk anonym Gate7 er separate leveransegater. Endelig status og faktiske
resultater skal leses på Draft PR56; Ready eller dette dokumentet beviser ingen
utført ekstern gate. Tidligere Compute-/Axe-ustabiliteter er ikke årsaksforklart
av denne rettingen. Menneskelig novice/SME/skjermleser- og læringseffektvalidering
er uutført. Ingen merge, produksjonsdeploy, P17/P18 eller bredere utrulling.
