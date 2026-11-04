# CC-01 — Web-utfordring: retur og gjenopptakelse

PR54, 4. november 2026. Avgrenset retting på PR53-base
`0e96c991d5e735e6b217bed15f20a3d5ef765c98`.
Ingen nye oppdrag, rubrics, ressurser eller navigasjonsmotor.

## Bekreftet før-feil

Den offentlige PR53-previewen er kontrollert anonymt med full vist SHA.
Computing-lenken beholdt `module=computing`, men parseren forkastet
`topic=resource-bridge`. `courseHref` falt derfor tilbake til `intro-request`.
Hub brukte en separat fast Services/practice-adresse. Begge feilene er gjengitt i
[før-reproduksjonen](reviews/evidence/cc01/before-reproduction.json) og
[SHA-kontrollen](reviews/evidence/cc01/before-root-sha.json).
PR53s opprinnelige fullførte lab-/vurderingsbevis er bevart separat og uendret.

## Returkontrakt

- Bare Computing får det eksplisitte ekstra Portal-topicet `resource-bridge`.
  Ukjente topics og Services/resource-bridge normaliseres fortsatt konservativt.
- Før Start kan en eksplisitt, gyldig kurslenke angi returmål. Lenken oppretter
  ikke vurderingshendelser eller registrerer progresjon.
- Nye eksplisitte Start-handlinger binder opprinnelsen til det konkrete gamle
  `begin`-eventet. Hub og sikkerhetskonteksten leser samme read-only projeksjon.
- Aktivt forsøk returnerer til `activity=challenge-return`, en nøytral statusflate.
  Den monterer ikke undervisning, feedback, Journal eller visit-effekter.
  Studenten kan fortsette samme forsøk, eller bevisst åpne undervisning gjennom
  den eksisterende durable assistance-grensen.
- Etter innlevering/avbrudd er Computing-returen `resource-bridge&activity=debrief`.
  Services-returen er `practice&activity=lab`. De ordinære undervisningsgrensene
  gjelder fortsatt dersom en annen selvstendig vurdering er aktiv.
- Ukjent historisk opphav gir en nøytral vurderings-/kursinngang. Nåværende URL,
  `CourseSave.resume` og gammelt lab-opphav brukes ikke som bevis for hvor et
  tidligere vurderingsforsøk startet.
- Nyere `practice=paas`, `lab=web-platform`, `mission=platform`, Benefits-bridges,
  VM- og Studio-inspeksjoner beholder sine egne origin-/returkontrakter.

## Versjonert navigasjonsopplysning

`azurelab.portal.learning.v1` er fortsatt schema1/content1.0.0/rubric
`portal-transfer@1`, med identiske events, svar-ID-er, replay og evaluator.
Det finnes ingen migrering av gamle resultater.

Den lille separate nøkkelen `azurelab.portal.challenge-origin.v1` inneholder bare:
`schema:1`, siste begin-indeks, SHA-256 av den kanoniske vurderingsprefiksen til
og med begin, `committed` og et allowlistet modul/topic-par eller null.
Den inneholder ingen svar, resultater, poeng eller autorisasjon til undervisning.
Prefiksen binder metadata til samme historikk, tekniske attempt og boundary.
Det er navigasjonsevidens, ikke en sikker signatur eller bevis på brukeridentitet.
Bare siste forsøk har en slik navigasjonsopplysning; eldre forsøk får ikke et
konstruert opphav. Opprinnelig vurderingshistorikk forblir autoritativ.

Start bruker Web Locks der dette finnes, sammen med eksisterende compare-before-
write og readback. Metadata skrives først som pending; gammel begin skrives og
kontrolles; så bekreftes metadata. Avbrutt delskriving gir aldri en bekreftet
opprinnelse. Ved delvis lagring kan en faktisk varig begin finnes etter reload,
men opphavet blir da ukjent. UI krever eksplisitt innlasting ved usikker lagring.
Det gjøres ingen automatisk rollback, ny innlevering eller omskriving av events.

Den opprinnelige Computing-grensen med `only=core` utelot dessuten den eldre
Portal-vurderingen. Den målrettede avvist-aid-testen fant faktisk montert teori
uten durable hjelp på den uendrede offentlige basen
([før-bevis](reviews/evidence/cc01/before-denied-aid.json)). Denne konteksten er nå
inkludert i eksisterende teaching-preflight også på slike kursflater.

Den berørte gamle ServiceStore publiserer nå bare event-endringer etter bekreftet
varig skriving. Avvist eller ikke bekreftet draft/aid/submit/abandon publiseres
ikke som nytt gyldig resultat. UI beholder siste bekreftede minnetilstand og viser
lagringsfeil. Etter delvis skriving kan disken inneholde et faktisk event;
eksplisitt reload avgjør hva som er varig registrert. Den eksisterende undervisningspreflighten
håndhever fortsatt hjelp før beskyttet innhold kan monteres.
Tidligere svarbærende Portal-feedback er også skjermet under aktivt uassistert
arbeid; eksplisitt åpning krever den samme bekreftede aid-skrivingen.
Reset av denne vurderingslagringen fjerner også dens navigasjonsopplysning.

## Verifikasjon og grenser

Målrettet matrise dekker ekte Computing Web-lab og opprinnelig policy-avslag,
endret Web-vurdering, utkast, nøytral retur, Hub, Back/Forward/reload, innlevering,
Services, gammelt ukjent opphav, avbrudd, hjelp, kryssfane og avvist skriving.
1440×900, 1024×768, 1024×500 og kompakt vitne kontrollerer tastatur, fokus,
reduced motion, faktisk overflow og Axe. Rene retur-/resume-handlinger sammenligner
World-/receipt-/XP-lagring byte for byte.

Full check, separat post-stamp review, eksakt-head CI/streng release og anonym
Gate7 dokumenteres med faktisk resultat ved levering. Ingen av disse er bestått
bare fordi denne kontrakten finnes. Begge kjente browser-ustabiliteter fra PR53
(Compute help/Back og Guidance/Axe document-title) forblir åpne uten årsaksbevis.
Menneskelig nybegynner-, skjermleser- og læringseffektvalidering er ikke utført.
CC03 forblir P1; CC02 forblir P2. Ingen bredere utrulling eller P17/P18.

De tre tidligere tverrgående bevaringstestene bruker en eksplisitt
[CC01-endringslås](reviews/evidence/cc01/authorized-changes.json) for de autoriserte
Portal-/guard-filene. Både gammelt baseinnhold og nye kandidatbytes kontrolleres;
ingen historisk proof-fil eller rubric-hash er omskrevet. Alle øvrige gamle
bevaringskrav består uendret.

Alle nye retur-/lagrings-/historikketiketter ligger i `challengeReturnNb` i
`src/content/nb.ts`. Hele det tidligere innholdet på 1 488 942 byte er uendret;
bare den nye UI-eksporten er lagt til. Dette kontrolleres med lengde, SHA-256 og
eksakt byteprefiks, i tillegg til de tidligere manuskript-/rubric-låsene.
