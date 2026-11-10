# Laboratory v3 · aktiveringsprotokoll og beslutningsgrense

6. november 2026. Kandidat under PR59, fra PR58 `a667b26276cc7a1bbed9aa9203cf431eb9001ada`. **Kandidaten er forkastet etter faktisk ABA-reproduksjon; Storage er ikke aktivert.** Se [blocker og testbevis](LABORATORY_STAGE1_BLOCKER.md). Dette dokumentet skiller en foreslått protokoll fra faktisk levert funksjonalitet.

## Autoritet og frosne epoker

Neste modell er `sandbox@3.0.0`, schema3, nøkkel `azurelab.sandbox.v3`. Chapter01 og sandbox2 replayes av sine originale funksjoner. Overgangen bevarer det validerte Chapter-prefikset, hele sandbox2-ledgeren, World, infrastructure, appSettings, nextId, revision og technical attempt. Ingen ny kommando, receipt, assessment, abandon, completion eller XP opprettes ved aktivering. `continueEngine` brukes bare for Chapter→2, aldri for 2→3.

En v3-record må inneholde eksakt original v2-raw (og Chapter-raw når v2 mangler), original arkivert attempt, en eksplisitt v2-ledgergrense og de nye v3-requestene. Nye kommandoer dispatches bare etter denne grensen. Et gammelt unsupported Storage-request beholder sin opprinnelige receipt; dagens handler må aldri brukes på dette prefikset. Historisk `through` velger riktig opprinnelig epoke.

## Ikke destruktiv writer-fencing

En allerede lastet v2-klient bruker bare v2-nøkkelen. Den deltar ikke i Web Locks, en ny epochmarkør eller BroadcastChannel. Vi kan derfor ikke love at den gamle klienten slutter å skrive.

**Ikke overskriv v2-kilden med en tombstone.** En gammel skriver kan være pausert etter sin compare-read. Dens aksepterte write kan lande mellom siste kildekontroll og tombstone-write, deretter bli overskrevet uten at noen varig spor finnes etter reload. Readback og en separat lås løser ikke dette.

Kandidatprotokollen lar derfor v2-kildens bytes være urørt. Etter aktivering er de kun en overvåket kilde, aldri en alternativ autoritet for v3. Enhver endring, sletting eller ulesbarhet stopper v3. Ingen automatisk import, merge, fallback eller reset. Original raw ligger også i v3-recorden; en avvikende v2-record må kunne eksporteres separat som en fork. V3 må bevare sine egne bytes og alle fork-bytes før eksplisitt recovery.

Nye klienter må samarbeide om en eksklusiv Web Lock. Manglende Web Locks betyr ingen aktivering. Første aktivering krever eksplisitt handling, ingen aktiv guidet eller selvstendig økt og lesbar, validert lagring. Andre nye faner er read-only til de eksplisitt får writer-lease. En leser må fortsatt validere kilden før teknisk evidens kan brukes.

1. Under writer-lease: les v3, v2 og eventuell Chapter-kilde. Ukjent/korrupt v3 blokkerer, aldri fallback til v2.
2. Valider opprinnelig v1/v2 og arkiver. Sammenlign kildene igjen. Skriv schema3 `prepared` med original raw og epoch-ID; readback må være eksakt.
3. Kontroller uendret kilde, uendret prepared-record og uendret learning safety. Skriv `active`; readback og ny kildekontroll må lykkes før Storage eksponeres.
4. Før og etter hver ny write og ved load/storage-event: kontroller både originalkilden og v3-basen. Bare eksakt durable readback publiseres som suksess. Konflikt setter tilstanden til blokkert; behold dataene.
5. Reload av `prepared`, quota/avvist write eller readbackfeil gir recovery, aldri automatisk aktivering. Aktiv v3 uten originalkilde eller med endret kilde gir konflikt. V3 som forsvinner etter observert aktivering må ikke bli en tom v2-suksess.

Dette er detect-and-quarantine av gamle skrivere, ikke en lineærbar flerklienttransaksjon. En gammel klient kan kort vise sin egen aksept før storage-event når den nye klienten. En v3-lesing kan bli stale umiddelbart etter siste kontroll. Ingen garanti gjelder manuell manipulering av alle lokale nøkler eller eksplisitt all-data-sletting. Disse grensene må vises ærlig; historisk evidens må ikke leses fra feil fork.

## Aktiveringsgate

Før runtime aktiveres må faktiske gamle PR58-kilder kjøres mot samme origin som kandidatklienten, inkludert kontrollert pause etter compare-read, under/etter aktivering, reload og stale nye skrivere. Verifiser også prepared recovery, korrupt/unsupported/manglende state, readback, quota, technical attempts, aktive læringsgrenser og frosne receipts. En tynn testklient kan bruke den uendrede gamle implementasjonen; den må ikke tilføye samarbeid med v3. To preview-domener er ikke bevis.

**Stopregel:** Hvis en kandidat tillater stille tap, feil autoritetsvalg, uverifiserbar historikk fremstilt som gyldig eller utilstrekkelig testet recovery, forblir Storage deaktivert. Lever blocker, faktisk testresultat og konkret neste tiltak. Ikke kall en protokoll ferdig bare fordi dens normale flyt består.
