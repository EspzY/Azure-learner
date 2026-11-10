# Laboratory Stage1 · aktiveringsgate BLOKKERT

6. november 2026 · PR59 · base `a667b26276cc7a1bbed9aa9203cf431eb9001ada`.

**Storage aktiveres ikke.** PR59 leverer en konkret [protokollkandidat](LABORATORY_V3_ACTIVATION.md), kjørbare moteksempler og denne blocker-rapporten i henhold til eierens stopregel. Ingen sandbox3-motor, Storage-handler, Portal-tjeneste, migrering eller ny kursfunksjon er aktivert. Dette er ikke en ferdig Storage-vertikal. En bestått reproduksjon nedenfor betyr at en protokollsvikt er bevist, ikke at aktiveringskravet er bestått.

## LP59-ACT-01 · gammel skriver kan skjule en fork etter reload

**Alvorlighet:** blocker for Storage-aktivering. Ikke en ny feil introdusert i produksjonskoden: alle eksisterende produksjonsfiler bevares byteidentisk.

Frosset `SandboxStore.persist` leser v2-nøkkelen, sammenligner med egen base og utfører deretter en separat `setItem`. Den har ingen lås eller readback. Portalens faktiske `requestFor` bruker `portal-${sequence}`; flere faner på samme utgangspunkt kan derfor lage samme commandId og samme storeRevision for ulike kommandoer. En senere gammel skriver kan også sette tilbake nøyaktig de opprinnelige bytene. Verken en ny v3-nøkkel, full kildehash eller en Web Lock som den gamle klienten ikke ber om kan bevise at ingen slik fork har eksistert.

### Faktisk reproduksjon på samme origin

Tre gamle testklienter A/B/C bruker **uendrede PR58-kilder** til SandboxStore, parser, execute, persistence, replay og Portal requestFor. Bundleren kontrollerer hver importert historisk kilde mot den fulle base-SHA-en før kjøring. En fjerde side kjører den **nye testproben**, ikke en produksjonsklar v3-simulator. Alle deler én Playwright BrowserContext/origin/localStorage. Ingen positive World-objekter eller receipts injiseres.

1. B og C laster samme tomme v2-utgangspunkt. Begge trykker eksplisitt Create og passerer den gamle skriverens virkelige compare-read.
2. CDP pauser bare utføringen ved StoragePort-grensen rett før den virkelige `localStorage.setItem`. Gamle implementasjonsbytes og validering endres ikke. Dette er en deterministisk tidsplan for en smal race, ikke måling av hvor ofte den skjer.
3. A oppretter `rg-alpha` via den gamle skriveren. V2-recorden kalles S0. Kommandoen er `portal-1`, storeRevision1, World revision1, `group-1`.
4. Kandidatproben lagrer S0 og forbereder/aktiverer sitt testcheckpoint under en virkelig Web Lock. Kandidatsiden lukkes; den kan derfor ikke beholde senere StorageEvents i minnet.
5. B fortsetter sin allerede påbegynte gamle write. `rg-divergent` aksepteres med samme commandId/revisjon/resource-ID, men andre World-bytes S1.
6. C fortsetter sin allerede påbegynte write av `rg-alpha`. Resultatet S2 er **byteidentisk med S0**, inkludert lagret revision og commandId.
7. Kandidaten åpnes igjen. Både v3-checkpointet og v2-kilden matcher sine opprinnelige bytes. Kandidatens eksakte sammenligning godtar tilstanden, selv om B fikk en annen akseptert teknisk World og denne historikken nå mangler i de varige nøklene.

[Maskinlesbar faktisk kjøring](reviews/evidence/laboratory-stage1/aba-reload.json) inneholder S0/S1/S2, hasher, source-hasher, origin og tidspunkt. [Faktisk testbilde](reviews/evidence/laboratory-stage1/aba-counterexample.png) viser proben som feilaktig godtar etter reload. Bildet er **ikke** et bilde av fungerende Storage.

Dette omtales som ABA: A→B→A i de observerte bytene. En digest eller ekstra sammenligning av samme record skiller ikke den siste A fra den første. Tekniske forsøk og kursreferanser bruker i dag attempt/boundary/through/commandId, ikke en varig identitet for alle konkurrerende grener. Vi kan ikke trygt kalle den tapte grenen opprinnelig evidens eller rekonstruere den fra dagens World.

### Andre forkastede varianter

| Kandidat                                          | Faktisk kontroll                                                               | Resultat                                                                                                                                                                                                                                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Separat v3-nøkkel + ny Web Lock                   | Virkelig gammel skriver oppretter en ekstra RG mens ny klient holder låsen     | Gammel write aksepteres. Ved vedvarende endret v2-kilde oppdager proben konflikten og blokkerer også etter reload. Dette dekker ikke ABA. [Bevis](reviews/evidence/laboratory-stage1/simple-fork.json).                                                                         |
| Erstatt v2 med tombstone                          | Gammel write pauses etter compare; får fullføre; ny klient setter så tombstone | Den aksepterte gamle World-en overskrives. Etter reload finnes ingen kopi av denne fork-en i checkpointet eller v2-nøkkelen. Dette er demonstrasjon av den forkastede rekkefølgen, ikke implementert overgang. [Bevis](reviews/evidence/laboratory-stage1/tombstone-loss.json). |
| Behold v2 urørt og sammenlign hele originalkilden | Virkelig gammel A/B/C-skrivekode + ny checkpointprobe, samme origin, reload    | S0→S1→S0 skjuler forken. **Aktiveringsgaten består ikke.**                                                                                                                                                                                                                      |

Web Locks samordner klienter som ber om samme lås. BroadcastChannel og StorageEvent hjelper levende samarbeidende klienter, men er ikke et varig arkiv over hendelser som en lukket eller gjenlastet klient ikke fikk behandlet. Vi påstår ikke at alle mulige nettleserprotokoller er motbevist; disse konkrete kandidatene er utilstrekkelige, og ingen tilfredsstillende erstatning er verifisert her.

## Hva som faktisk er testet

| Område              | Faktisk verifikasjon / grense                                                                                                                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Original v1/v2      | Eksisterende Stage0-golden har17 originale receipts og14 continuation-Worlds. Nye kontroller bevarer alle169 domenefiler og eksakt v1/v2-replay, historisk unsupported Storage, current/arkivert attempt, VM og appSettings. Ingen v3-kommando-epoke er implementert eller testgodkjent. |
| Checkpointprobe     | Eksplisitt prepare/activate; readback; avvist/quota/discarded write; korrupt/unsupported state; endret/manglende kilde; konkurrerende preparation; prepared recovery. `active-probe` er med vilje en testetikett, ingen autorisasjon for en tjeneste.                                    |
| Mixed version       | Tre faktiske browserreproduksjoner med original gammel skriver og ny testprobe på samme origin. CDP kontrollerer tidsplan; den gamle skriveren får ikke nye fencing-regler. Ingen separate preview-domener brukes som konfliktbevis.                                                     |
| Aktive læringsløp   | Alle historiske kurs-/assessment-/assistance-/origin-/debrief-filer er bytebevart. Den nye probens `learningSafe`-parameter er bare en testforutsetning; **ingen komplett v3-adapter for aktive økter er implementert eller validert**. Eksisterende kritisk CI-regresjon beholdes.      |
| Ikke verifisert     | V3-runtime, ny epoch-dispatch, operative Storage-kommandoer, v3 historical through, v3-arkiver, produksjons-recovery, writer-lease-UI og ny/gammel læringsøkt under reell aktivering. Disse kan ikke krediteres som bestått.                                                             |
| Produksjonsbevaring | [Manifest](reviews/evidence/laboratory-stage1/preservation.json) kontrollerer alle1889 tidligere filer utenom additiv prosjektstatus og mutable current release. Ingen gammel test, timeout, retry, worker, skip, QA-terskel eller dependency endres.                                    |

De nye browsernavnene begynner med **Stage1 BLOCKER** for å hindre at en grønn CI tolkes som bestått Storage-gate. Full CI/streng release verifiserer den avgrensede test-/dokumentasjonsleveransen, aldri operativ Stage1. Ekstern Gate7 skal kontrollere den uendrede applikasjonen på levert SHA; lokale probe-bevis må ikke omtales som offentlig Storage-testing.

## Neste avgrensede leveranse og beslutning

Før Storage bygges må vi velge og verifisere en writer-/historikkgrense som tåler ikke-samarbeidende gamle klienter. En ny modell/key alene er ikke nok.

1. Vurder en eksplisitt kompatibilitets-/cutoverfase som gjør alle **tillatte** skrivere epoch-bevisste, med én virkelig felles commit-grense og uforanderlig historisk evidens. Dokumenter hvordan gamle allerede lastede klienter faktisk utelukkes; en oppfordring om å lukke faner er ikke teknisk bevis.
2. Alternativt må en mer omfattende autoritets-/isolasjonsgrense vurderes separat. Serverbasert CAS eller en kontrollert isolert cutover krever eget design/scope; denne PR-en provisionerer ingen backend, ny origin eller datalagring.
3. Erstatt kandidatproben med implementert versjons-/replay-/recovery-kontrakt. Kjør de samme moteksemplene på nytt. En retting må **avvise eller varig bevare/karantenere** den avvikende forken, ikke slette reproduksjonen eller godta den som ufarlig.
4. Verifiser alle aktive attempt-/assistance-/origin-/first-/historikkgrenser før aktivering. Deretter kan én Storage-vertikal implementeres med de tre kommandoene og hele Portal-kjeden fra [Stage0-designet](STORAGE_VERTICAL_DESIGN.md). DeleteEmptyGroup og samlet kapasitet må inkludere nye barn bare i den nye epoken.

Ingen nye Storage-operasjoner støttes i denne leveransen. Nærmeste nyttige operative vertikal er fortsatt account→privat container→create-only syntetisk tekstblob, etter at denne blocker-en er løst. Ingen ny kursbank eller simulatorfunksjon er startet for å skjule at aktiveringen er blokkert.

## Kilder og begrensninger

Browserpåstandene er faktisk kontrollert6. november2026: [StorageEvent](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event), [Web Locks](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API), [setItem/QuotaExceededError](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem) og [Microsofts localStorage-inspeksjon](https://learn.microsoft.com/en-us/microsoft-edge/devtools/storage/localstorage). Respons/tittel/kontrolldato/hash finnes i [kildeloggen](reviews/evidence/laboratory-stage1/sources.json). Ingen komplette dokumentasjonssider distribueres. Storage-navn/control/data-plane er fortsatt det uendrede Stage0-forslaget, ingen ny Azure-fagpåstand eller undervisning.

Dette er syntetiske kontrollerte AI-/ingeniørtester, ingen menneskelig UX-/SME-/tilgjengelighetsvalidering eller frekvensmåling av races. Tidligere Compute-/Axe-ustabiliteter og den uendrede CC03-terminaltidsgrensen er ikke lukket av senere grønne kjøringer. Ingen merge eller produksjonsdeploy.
