# SavvyShark guidance standard

## Part B observed insights — PR23

management-relations and management-policy are1.0.0 conceptual guidance definitions. Automatic claims require a new saved causal explanation against actual app/group/plan references or inspection of an actual replayed App Sandbox deny with no added resource. Live qualification is rechecked for recall. Guided safe contexts only; native mission/blur, dedup, reopen, storage uncertainty and independent shielding remain. Explicit start/cancel changes no technical/evidence truth. Critical instructions remain expanded. [Boundaries](CORE_ARCHITECTURE_MANAGEMENT.md).

Versjon1.0.0. Aktiv F1–F5/Gate4-kontrakt; [GUIDED_SANDBOX_ENGINE](GUIDED_SANDBOX_ENGINE.md) og [SAVVYSHARK_INTEGRATION](SAVVYSHARK_INTEGRATION.md) beholder eksisterende guide-/assetdetaljer. Ingen chatbot, kommandoagent, ny maskot eller ny læringsautoritet.

## F1 — Mission

Behold native mission briefing med rolig blå palett og subtil backdrop blur. Vis hva/hvorfor, forkunnskaper, læringsutbytte, hovedsteg, konkret observasjon og forventet teknisk forståelse. Forklar Start/Fortsett/Avbryt før handling. Åpning/lukking/recall er presentasjon; eksplisitt Start bruker det eksisterende lab-start-kontraktet, ikke en ny completion-flag. Resume skal ikke starte samme introduksjon automatisk igjen.

## F2 — Versioned milestones

`domain/guidance/milestones.ts` er et lite typed register med stabile ID-er, versjon, eksisterende kompetanse-/source-ID-er, faktiske replay-betingelser og authored auto-intent. Det kjører ingen nye Azure-regler. Original copy i nb.ts forklarer hovedpoeng, årsak, konsekvens, neste elevhandling og observerte faktiske verdier.

Første to implementerte eksempler:

| ID                    | Faktisk grunnlag                                                                                                     | Første automatiske visning                                              | Viktig grense                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| policy-denial@1.0.0   | Replayed rejected plan-request i den aktuelle guidede gruppen med policy-witness, uendret revision og ingen addedIds | Eleven åpner Policy etter en ny relevant rejection i denne Portal-økten | Aldri fabrikkert avslag eller universell built-in-policy; ingen automatisk korreksjon. |
| vm-dependencies@1.0.0 | Accepted post-boundary VM-bundle; faktiske OS-disk/NIC/subnet/VNet-referanser finnes                                 | Eleven inspiserer den nye VM-en eksplisitt                              | Ingen OS-boot, nettverkstrafikk, programhelse eller lab-fullføring påstås.             |

Historisk arbeid ved mount/reload gir bare manuell recall. Auto er maks én gang per milestone-versjon/guidet kontekst/teknisk attempt; gjentatte avslag eller Back/Forward åpner ikke samme forklaring igjen. Før et auto-vindu åpnes, lagres bare visningsnøkkelen i det isolerte `azurelab.guidance.milestones.v1`. Den er aldri evidence eller inventory. Lukk, utsett og gjenåpne gir ingen XP/progresjon.

Usikker/ukjent/korrupt/full eller nektet UI-lagring gir ingen auto-popup og overskrives ikke. Eleven kan fortsatt åpne forklaringen manuelt og får synlig lagringsforklaring. Eksplisitt all-data-reset rydder også denne nøkkelen. Gyldig ekstern reparasjon eller eksplisitt reset rydder et gammelt lagringsvarsel; reparasjon baseliner eksisterende receipts og prøver ikke et gammelt avbrudd automatisk igjen. En vellykket manuell claim verifiserer og oppdaterer varselet. Cross-tab bruker oppdatert seen-historikk før claim; dette er best-effort lokal UI-deduplisering, ikke distribuert låsing eller autoritativ elevdata.

Kun ett modalvindu skal være aktivt. Nye milepæler venter på at en eksisterende native dialog lukkes; de oppstår fra gyldig tilstand/inspeksjon, aldri timer eller animasjon. Å forlate gyldig kontekst/endre attempt eller gå inn i en uavhengig oppgave skal fjerne forklaringen. En tidligere dialog skal ikke gjenoppstå når man kommer tilbake.

## F3/F4 — Contextual guide og synlighet

Obligatorisk oppgave, hvorfor, handling, kontrollens plass og forventet observasjon er vanlig synlig tekst; bare ekstra hint og frivillig milestone-historikk kan være collapsed. Minimering er et eksplisitt elevvalg med synlig gjenåpne-kontroll. Veiledning må bygge på gyldig origin/session, faktisk inventory/replayed receipts og formens nåværende tab/validation.

Action-target må være en aktiv faktisk kontroll i riktig kontekst. Inspection er roligere og ikke villedende klikkbart. Manglende, tvetydig, gjennomsiktig, skjult, deaktivert, modal-obskurert eller urelatert mål skal ikke få ring. Vis semantisk forklaring og trygg navigasjon/Locate når mulig. Locate scroller/fokuserer, aldri klikker eller sender.

Native dialog/fokus/Escape og korrekt return gjelder. Mission og milestone deler fast synlig topp/bunn og en navngitt, fokuserbar rulleregion for hele forklaringen. Tastatur kan rulle innholdet uten å miste knappene i korte/kompakte vinduer og ved zoom. Lange kvitteringer testes mot sin synlige, utildekkede del, ikke bare et mulig offscreen midtpunkt. Test skjulte ancestors, overflow, sticky/footer, normal scroll/resize, feil target, alternativ navigasjon og reload. En DOM-tekst som finnes er ikke nødvendigvis lesbar; bruk målte bounding boxes, faktisk hit-testing og inspeksjon av bilder.

## F5 — Independent

Alle aktive uavhengige kontekster (Foundations v1/v2, Benefits, current/compatibility Service Types og practical) sperrer automatiske milepæler og løsningshighlight. En query-string kan ikke autorisere veiledning mot aktiv vurdering. Siden eksisterende stores med vilje beholder gammel view ved cross-tab-konflikt, sperres all automatisk veiledning også mens en vurderings-/lab-/teknisk kontekst er ulastet eller har issue. Åpne milepæler lukkes. Et synlig kontekstvarsel gir read-only gjeninnlasting av de eksisterende stores, uten å slette eller oppgradere gamle svar. Dette endrer ingen store-kontrakt. Milestone-recall er også skjermet i denne fasen, selv etter aid; eksisterende eksplisitt help beholder sin gjeldende klassifisering. Free sandbox starter ingen undervisning eller belønning. Ingen maskot setter svar eller sender ressurskommandoer.

## Utvidelse og testing

Nytt milestone-innhold trenger source-/objectivebinding, negative fixture, replay-/scope-/attempt-test, kopi med årsak/konsekvens/grenser og keyboard-/no-repeat-/independent-/modal-test. Revider versjonen ved vesentlig fagendring. Å legge til navnet i registeret er ikke implementert undervisning eller dokumentert læring. [Release-gater](RELEASE_ACCEPTANCE.md) og separat sluttgjennomgang er obligatoriske.
