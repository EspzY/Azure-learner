# CC-03 — versjonert Portal-vurdering

PR55, 4. november 2026. Base er PR54
`bb66ff2e5115d26304bb017295a9067c6f6fed5d`. Dette retter den ordinære
Portal-utfordringens manglende OS-premiss, ikke alle Cloud Concepts-vurderinger.
Ingen nye simulatorressurser, kommandoer, priser, rubrics for gamle forsøk eller XP.

## Faglig intensjon og avgrensning

Den eldre oppgaven sier bare «OS-avhengig programvare», mens `portal-transfer@1`
krever IaaS. OS-avhengighet alene avgjør ikke tjenestemodellen. Det nye paret
undersøker en tydelig ansvarsgrense og en relevant endring av driftskravet:

- **wv2-01:** Kunden må velge og vedlikeholde eget støttet gjeste-OS-image og
  selv styre oppdateringene. Leverandøradministrert gjeste-OS er uttrykkelig
  uforenlig med kravet. IaaS + kundestyrt OS-livssyklus er det kompatible paret.
  Dette gjelder gjesten, ikke kontroll over den fysiske Azure-verten.
- **wv2-02:** Kravet endres for samme program. App Service Managed Instance er
  gitt som verifisert kompatibel i valgt region/plantype; kunden godtar
  plattformens OS-vedlikehold og vil minimere gjestedrift. PaaS + verifisert
  plattformstøtte er det kompatible paret. IaaS kan gi kontroll, men oppfyller
  ikke det uttrykkelige ønsket om minst mulig gjeste-OS-arbeid like godt.

Begge krever riktig beslutning **og** kompatibel begrunnelse. Krysspar godtas
ikke. SaaS passer den separate ferdige samarbeidstjenesten, ikke erstatning av
programmets egen kode under de oppgitte premissene. Dette er en presis
nybegynnervurdering, ikke dokumentert profesjonell transfer eller psykometri.

Windows, COM, registry, MSI eller et generelt tilpasningsbehov brukes aldri
som universelt IaaS-bevis. Microsofts Managed Instance-dokumentasjon beskriver
støttede tilpasninger og samtidig plattformvedlikehold. Kunden vedlikeholder
fortsatt egen kode og selvinstallerte komponenter. Scenarioets kompatibilitet er
et originalt, syntetisk premiss; ingen virkelig Azure-app er testet eller deployet.

## Versjoner og ruter

| Kontrakt                | Autoritativ historikk                                                    | Valg                 |
| ----------------------- | ------------------------------------------------------------------------ | -------------------- |
| Tidligere Web-vurdering | `azurelab.portal.learning.v1`, schema1/content1.0.0/`portal-transfer@1`  | `assessment=legacy`  |
| Oppdatert Web-vurdering | `azurelab.portal.challenge.v2`, schema1/content2.0.0/`portal-transfer@2` | `assessment=updated` |

Undervisningens `version=1/2` beholder sin betydning. Service Types v2,
Services Assessment v3, Cloud Transfer/cc18 og `guest-control@1` forblir egne,
uendrede kontrakter. Nye og gamle svar blandes eller migreres ikke.

Uten eksplisitt assessment-valg er oppdatert vurdering standard, bortsett fra
et aktivt historisk Portal-v1-forsøk: det åpnes under sin opprinnelige kontrakt.
Valget festes til URL før videre støttet Portal-navigasjon. Ved to aktive
Portal-versjoner uten eksplisitt valg vises en nøytral velger; ingen versjon
velges automatisk og ingen vurdering begynner ved navigasjon. Andre samtidige
independent-kontekster inngår i eksisterende konflikt-/assistance-håndtering.
Et aktivt gammelt forsøk oppgraderes aldri ved åpning av ny standard.

## Gjenbruk av den faktiske tekniske motoren

Den nye reduceren projiserer sine validerte hendelser til den **uendrede**
Portal-v1-eventmodellen og gjenbruker `serviceFacts` og `evaluateSubmission`.
Den opprinnelige evaluatorens `service`, `ready`, `scope`, `hosting` og `cause`
beholdes. Den tvetydige `os` erstattes av wv2-01s par, og `platform` vurderer
wv2-02. Samlet resultat krever de sju kriteriene og verifiserbar teknisk replay.

Resource Group, plan og app må fortsatt være faktisk nye etter forsøksgrensen,
i originalt scope/region og med original hostingreferanse. `attemptNumber`,
`boundary` og `through` følger den eksisterende Sandbox-historikken. Ny lagring
inneholder referanser, ikke en ny World eller kopierte receipts. Konseptvalg
oppretter ingen VM eller Managed Instance og beviser ikke runtime.

## Retur, lagring og assistance

Ny `begin` lagrer allowlistet Computing/resource-bridge eller Services/practice,
eller ukjent opphav, i **sin egen** autoritative hendelse. Den gamle
`azurelab.portal.challenge-origin.v1` leses ikke som opphavsbevis for nytt forsøk.
PR54s gamle events, sidecar, hashbinding og rutehelpere er bevart.
Ny retur gjenbruker det samme nøytrale mønsteret med `assessment=updated`.
Hub, Portal og retur bruker samme nye facts; usikker state bekrefter ikke opphav.

Bare eksplisitt Start kan skrive begin. Start bruker en versjonsspesifikk Web
Lock der nettleseren støtter dette; mens den venter, er konteksten uavklart og
kan ikke autorisere teaching/guidance. Reload/recovery kansellerer stale køet
arbeid. Ellers brukes etablert compare-before-write/readback. Dette er avgrenset
lokal klientlagring, ikke en transaksjonell serverdatabase eller identitetsattest.

Alle writes publiseres først etter bekreftet readback. Ved delvis skriving kan et
faktisk event finnes på disk selv om UI rapporterer feil; eksplisitt reload
avgjør hva som er varig. Ingen automatisk rollback eller fiktiv suksess.
400 hendelser, tre reserverte terminalplasser, streng parsing/replay og scoped
recovery begrenser historikken. Recovery kan bare fjerne den ugyldige nye nøkkelen
etter ny sammenligning; gyldig historikk i annen fane og gamle nøkler beholdes.

Begin registrerer også om tidligere Portal-v1-forsøk er dokumentert. Dette
omskriver ikke gamle familier eller hevder at øvrige banker er ueksponerte.
«Første innlevering» gjelder uttrykkelig den oppdaterte versjonen. Senere arbeid,
hjelp og avbrudd bevarer første historiske innlevering. Ingen navigasjonskreditt.

Det nye independent-contextet inngår i eksisterende teaching-preflight,
Journal/history, Hub, mission safety, Portal/SavvyShark og eksplisitt all-data-reset.
Å åpne annen svarbærende versjon eller feedback krever korrekt durable aid før
innhold monteres. Avvist write og stale/ukjent lagring holder innholdet lukket.

## Kilder og blind kontroll

Fem offentlige Microsoft-produkt-/arkitektursider er faktisk lest. Se
[kilderecordene](reviews/evidence/cc03/source-records.json). Kontrolltid er 4. november 2026, ikke en oppdiktet dokumentdato. Managed Instance-siden hadde
ulike synlige datometadata i research- og direkte HTTP-versjonene; relevante
støtte-/vedlikeholdsgrenser samsvarte. Region-/SKU-lister hardkodes ikke som
universelle vilkår i vurderingen. Kildene er sammenlagt etter lovlig feedback.

En fersk, isolert AI-reviewer fikk bare elevpakken, ikke tidligere funn, fasit,
rubrics eller feedback. Første solve og revidert solve ble låst før nøkkelinnsyn.
Nøytrale item-ID-er, tydeligere kontrafaktisk ramme og praktiske instrukser rettet
konkrete funn. Begge aksepterte par samsvarte med den blinde løsningen. Den senere
feedbackkontrollen er eksplisitt nøkkelåpen. Originale pakker, tidsstempler og
hashes er bevart i [blindbevisene](reviews/evidence/cc03/blind/).
Dette er prosessisolert agentreview, ikke kvalifisert menneskelig SME-godkjenning.

Posisjons-/lengdeheuristikker og alle beslutnings-/begrunnelsespar testes.
Ingen all-first/all-second/all-last/lengst/kortest-strategi gir full uttelling.
Enkle begrepssignaler og beskjedent lokalt posisjonsmønster er fortsatt en
avgrensning; det påstås ingen empirisk item-diskriminering eller læringseffekt.

## Historisk VM-mission og leveransegater

Infrastructure-missionen pålegger allerede en VM-konfigurasjon med image,
profil, disk og NIC. Den er ikke en fri IaaS/PaaS-sammenligning. Dens smalere
begrunnelsesglippe om Windows-only er undersøkt, men `guest-control@1`, opprinnelig
tekst og tekniske kriterier er byte-uendret. En bedre fri tjenestevalgsoppgave
eller et endret selvstendig premiss må være en egen versjonert etterfølger.
Denne leveransen godkjenner ikke den historiske formuleringen som universell regel.

Målrettede resultater, faktiske bilder og opprinnelige feil finnes i
[CC03-bevismappen](reviews/evidence/cc03/). Full check, ny signering, separat final
audit, eksakt-head CI/streng release og anonym ekstern Gate7 er separate gater.
Endelig status følger [Draft PR55](https://github.com/EspzY/Azure-learner/pull/55);
Ready, lokal test eller denne kontrakten er ikke i seg selv bestått ekstern gate.
CC02 forblir P2. De eldre Compute help/Back- og Guidance/Axe document-title-flakene
er fortsatt årsaksuavklarte. Menneskelig SME-/novice-/skjermleser-/psykometrisk og
målt læringsvalidering er uutført. Ingen merge, produksjon eller bredere utrulling.
