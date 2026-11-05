# AZ-900 · intern Release Candidate-beslutning

5. november 2026 · PR57 · baseline PR56 `a3f1b575b2eb5b257fd455fec1a73b30a38706f4`.

**Produktgjennomgangen anbefaler en begrenset, fasilitert internpilot.** Ingen ny bekreftet åpen P0/P1 er etablert. Den separate strukturkontrollen av alle 186 aktiviteter i de 16 øvrige rutene er også fullført uten påvist alvorlig strukturell hindring. Ni konkrete presentasjonsfunn er rettet; tillatte P2/P3 er prioritert og eksplisitt utsatt. Teknisk RC-aksept krever i tillegg siste-head CI/streng release og faktisk anonym Gate7. De endelige, SHA-bundne kvitteringene føres i [PR57s leveransebevis](https://github.com/EspzY/Azure-learner/pull/57); denne filen er ingen automatisk godkjenning.

## Konkret ferdiggrense

| Kriterium                                                 | Grunnlag / avgrensning                                                                                                                                                                                                          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. 57 mål dekket                                          | Eksisterende authored-content-matrise og audit/curriculum-kontroller beholdes. Ingen ny faglig målstruktur eller mestringskreditt.                                                                                              |
| 2. Tre hovedområder avsluttende gjennomgått               | Cloud Concepts PR53 med rettinger PR54–56; nye kalde PR57-prøver omfatter alle 14 øvrige ruter og 171 anbefalte sider.                                                                                                          |
| 3. Ingen kjent åpen blokkerende P0/P1                     | Ingen ny etablert i utført prøve. CC-01/02/03 behandles som leverte rettinger, ikke gjenåpnet uten regresjon. Dette er ikke bevis for at ingen uoppdagede feil finnes.                                                          |
| 4–5. Sammenhengende anbefalt reise og forståelige moduler | 200 kanoniske aktivitetsruter og 17 modulgrenser maskinkontrolleres; faktiske innganger, modeller, feedback, Summary/Journal og returer er risikobasert prøvd. Aktiv guide/independent har fortsatt egen autoritativ prioritet. |
| 6. Forsvarlige aktuelle vurderinger                       | Egne svar låst før feedback i de nye representative prøvene; gyldige alternativer akseptert. Historiske arkiver er bevart og tydelig versjonert; ingen påstand om ny total bank-/psykometrisk validering.                       |
| 7–8. Historikk, hjelp, recovery, Sandbox, Hub og Journal  | Samme domener, stores, rubrics og World/commands/receipts/XP; eksakte byte-/replay-/UI-regresjoner beholdes. Ingen ny progress engine eller dataflytting.                                                                       |
| 9. Tilgjengelighet                                        | Representative tastatur/fokus/short-height/reduced-motion/Axe-prøver; konkret Monitoring-heading og bygginfo-landemerke rettet. Ingen full manuell WCAG-/skjermlesergodkjenning.                                                |
| 10. Faktisk teknisk sluttaksept                           | Full check → stamp → separat sluttreview → komplett autoritativ siste-head CI/streng release → anonym ordinær root/full-SHA/bruksreise. Må leses fra PR57s faktiske kvitteringer, ikke Ready-status eller en lokal passed-flag. |
| 11. Produktgrenser dokumentert                            | Lokal, redigerbar nettleserhistorikk; konseptmodeller er ikke Azure-runtime; støttede ressurser og kildegrenser er eksplisitte.                                                                                                 |
| 12. Internpilot gjennomførbar                             | Kaldprøvene og faktisk demo-preflight fant ingen alvorlig hindring for en fasilitert pilot. Reell novice/IT/SME-/tilgjengelighetspilot er fortsatt ikke utført.                                                                 |

En **intern Release Candidate** betyr at dette avgrensede produktet kan prøves internt under de oppgitte grensene. Det betyr ikke produksjonsgodkjenning, Microsoft-sertifisering, attestert brukeridentitet eller dokumentert læringseffekt.

## Hva som leveres og hva vi stopper med

Undervisning, årsaksmodeller, praktiske lokale oppdrag, versjonerte vurderinger, historikk, hjelp og kursretur utgjør det ferdige AZ-900-grunnlaget. [Den nye gjennomgangen](reviews/AZ900_FINAL_PRODUCT_REVIEW.md) dokumenterer nøyaktig lest kontra faktisk kjørt; alle inputkombinasjoner og oppgavefamilier er ikke testet manuelt på nytt.

Utsett bevisst repetisjon/terminologi, enkelte eldre distraktorer, endpoint-boilerplate og kort Portal-guide utover de konkrete rettingene. De krever ikke kosmetisk perfeksjon før internpilot. Fortsett separat teknisk oppfølging av gamle Compute-/Axe-flaker og moderate lint-avhengigheter. Ingen av disse lukkes av senere grønn CI. Se [restlisten](reviews/AZ900_FINAL_PRODUCT_REVIEW.md) og [dependency-oppfølgingen](DEPENDENCY_FOLLOWUP.md).

Neste eierbeslutning er å akseptere den SHA-verifiserte RC-en og avtale en liten menneskelig pilot med konkrete lærings-/bruksspørsmål. Etter aksept flyttes hovedinnsatsen til [Laboratory Platform](LABORATORY_PLATFORM_HANDOVER.md). Ikke start en generell ny AZ-900-auditrunde, P17/P18, alle designsteg eller en ny Portal-motor automatisk.

## Segmentstruktur og avgrenset restarbeid

[Den separate konsolideringsmatrisen](reviews/AZ900_PEDAGOGICAL_CONSOLIDATION_REVIEW.md) er gjennomført etter de uendrede kalde rapportene. Den klassifiserer alle 186 aktiviteter: 158 A behold, 16 B i åtte par, fem C som synlige seksjoner og sju D som sekundære oppslag/allerede merket tillegg. Ingen vurdering eller operativ forsøksgrense foreslås slått sammen.

Forslaget er 186→166 anbefalte oppføringer utenom Computing, tilsvarende 200→180 samlet dersom eieren senere vedtar alt; PR57 har fortsatt 200. Tretten stopp kan inngå i faglig større økter, og sju oppslag flyttes bare sekundært. Dette er ingen målt klikk-, tids- eller læringsgevinst. Nye samlesider må prototypetestes; dynamisk Neste omgår allerede noen kart. Behold Benefits, Service Types og Storage A/B strukturelt. Ingen ny større konsolidering er påvist nødvendig før RC. Eieren skal gjennomgå forslaget før avgrenset senere implementering; Laboratory Platform trenger ikke vente på kosmetisk perfeksjon.

## Demonstrasjon 9. november

[Kort klikkemanus og trygg ren oppstart](AZ900_DEMO_GUIDE.md) er prøvd gjennom faktisk anonym offentlig PR56-root: kapasitetsmodell, ressursgruppe → Web-plan → Web App, Policy-avslag/korrigering, VM Small/Standard-debrief, Journal og korrekt kursretur. Bruk den verifiserte PR57-previewen når dens siste leveransegater er bestått. Behold den kjente PR56-previewen som SHA-kontrollert reserve; ikke bruk produksjonsdeploy som demonstrasjonsløsning.

## Datert dependency-oppfølging for PR57

Den eldre dependency-rapporten er en bytebundet historisk kontroll og beholdes uendret. Dagens status registreres her for å skille den fra tidligere observerte tolv oppføringer.

### PR57 recheck — 5 November 2026

The actual saved PR57 audit payloads, [full audit](reviews/evidence/pr57/npm-audit.json.txt) and [production audit](reviews/evidence/pr57/npm-audit-production.json.txt), report **10 moderate development package entries, 0 high/critical and 0 production vulnerabilities**. The full report has one direct advisory and propagated lint-tool entries; these are not ten independent application vulnerabilities. `package.json` and `package-lock.json` are unchanged against the PR56 baseline. The earlier 12-entry reports in the [historical note](DEPENDENCY_FOLLOWUP.md) remain dated history: **12→10 is a changed reported count, not a dependency correction or remediation claim**.

The advisory remains [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), minimatch globparts-amplification denial of service / CWE-405. The current payload identifies affected minimatch versions `>=7.0.0 <11.0.1`; the corrected version remains **11.0.1**. The installed version in that note is **10.2.6**, with these existing development-tool chains:

- AzureLab → `eslint@10.13.0` → `minimatch@10.2.6`.
- AzureLab → `eslint@10.13.0` → `@eslint/config-array@0.23.5` → `minimatch@10.2.6`.
- AzureLab → `typescript-eslint@8.72.0` → `@typescript-eslint/typescript-estree@8.72.0` → `minimatch@10.2.6`.

The ten currently reported entries are `@eslint/config-array`, `@eslint/js`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `@typescript-eslint/type-utils`, `@typescript-eslint/typescript-estree`, `@typescript-eslint/utils`, `eslint`, `minimatch` and `typescript-eslint`. The historical note’s earlier table is preserved as the PR45 observation, not silently rewritten to the current count.

The current `fixAvailable` metadata proposes `eslint@9.39.5`, `@eslint/js@9.39.5` and `typescript-eslint@8.36.0` with `isSemVerMajor: true` on the relevant entries; other entries say only `true`. Those automatic suggestions are different from the older linked report and are **not an accepted or applied upgrade plan**. The root corrected minimatch version lies outside the consumers' recorded 10.x ranges. Separate maintenance must verify compatible upstream lint-tool releases adopting the corrected version, or a narrowly reviewed override with configuration/lint regression evidence. No force-fix, package update, lockfile change, audit suppression or threshold change is performed in PR57.

Production audit0 does not prove universal safety, and a later green CI does not remediate this advisory. Track the development/CI availability risk separately; escalate only if new severity or application-reachability evidence warrants it. PR57's product/structure documentation is not a dependency fix, and its final technical CI/strict-release/anonymous-Gate7 acceptance remains separately pending at this update.

## Historisk tiltaksplan og aktuell beslutning

Den bytebundne historiske AZ-900-tiltaksplanen er bevart uendret. Dette RC-notatet, det nye funnregisteret og konsolideringsmatrisen er den daterte statusen for PR57. Ingen gammel observasjon omtolkes eller merkes lukket av disse nye rapportene.
