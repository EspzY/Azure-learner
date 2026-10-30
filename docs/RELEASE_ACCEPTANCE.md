# Release acceptance og Independent Final Audit

Aktiv prosess for [QUALITY_CONTRACT G](QUALITY_CONTRACT.md). «Release» betyr her en verifisert Draft PR klar for eiergjennomgang; det autoriserer aldri merge eller produksjonsdeploy.

Eierens29 oktober2026-retning er konkretisert i [DEVELOPMENT_WORKFLOW](DEVELOPMENT_WORKFLOW.md): lokal testing er målrettet etter risiko, komplett godkjent CI mot eksakt head er autoritativ sluttregresjon, og uavhengig audit behandler alle seks domener med proporsjonal dybde. Nye/endrede regler, fasiter, navigasjon og databeskyttelse får relevante grundige kontroller. Uendrede deler bevares uten rutinemessig ny kilde-/fullreview-runde. `playwright.desktop.config.ts` er kun opt-in-forslag; default CI/testfordeling og strenge release-gater gjelder uendret inntil eiergodkjenning.

## Ett gjenbrukt kontrollsystem

`npm run check` beholder TypeScript/lint/format/docs/curriculum/assets/legacy/Vitest/build og legger til `quality:check`. Eksisterende AZ-900-audit beholdes uten ny analyse. Full `test:e2e` kjører mot produksjonsbygget med keyboard/reduced motion, Axe, kurser/laber, feil/retur/reload og lagringsregresjoner.

`quality/releases/current.json` er avgrenset leveransespor: scope/base, kilde-/claim-discovery, aktivitets-/teori-/feedback-/visual-/assessment-pekere, beskyttede kontrakter, faktiske tester og separat sluttrevisjon. Det er ikke runtime-innhold eller læringsdata. Nye moduler må dessuten registreres i det eksisterende curriculum-systemet; release-JSON kan ikke skape fake undervisning for å tilfredsstille validatoren.

## Daglig forløp

1. Verifiser oppdatert base og isolert branch; les kontrakt/relevante docs. Forfatt scoped source map/manuskript før UI.
2. Implementer med meningsfulle negative/domain/integrity/browser-tester tidlig; inspiser faktiske berørte desktop-/kompakt-/short-height-bilder underveis. Fullfør full check og grundige nye/berørte lokale kontroller; ikke dupliser komplett lokal regresjon som senere kjøres i autoritativ CI uten konkret grunn. Noter faktisk scope, exit og begrensninger.
3. Når implementeringen virker ferdig: `npm run quality:stamp -- --base <full-base-SHA>`. Det beregner normaliserte filhasher og nullstiller review til pending; kommandoen godkjenner ingenting.
4. Start en **separat** Independent Final Audit etter dette tidspunktet. Bruk om mulig en annen agent med fersk kontekst. Reviewer skal kritisk behandle faglig dybde/kilder, teknisk sannhet, visuelle resultater, oppgavekvalitet, SavvyShark og regresjoner. Konkret dybde følger risiko; uendrede domener får presis bevaringskontroll. En prosess-/visuell endring krever ikke ny full faglig vurdering av uendrede fasiter.
5. Dokumenter konkrete funn, alvorlighet, fix/bevis og relevante retester i `docs/quality/` og release-recordet. Alle blocker/major må være lukket med reell rettelse; ikke «accepted limitation» eller testskip. Revider implementeringsfingerprint og gjennomfør et oppfølgende uavhengig review hvis implementeringen endres.
6. `npm run quality:release -- --base <full-base-SHA>` skal bestå. Den avviser manglende/foreldet review, manglende/umappede endringer, brudd på deklarert bevaring, åpne blokkere og feil rekkefølge. Etter fixes kjøres berørte kontroller og begrunnet bredere testing; ikke automatisk alle lokale browserreiser. Komplett CI kreves på levert head.
7. Push/verifiser siste komplette CI, stabil branch-preview og faktisk SHA. Åpne root, følg synlig inngang, gjennomfør representative handlinger/retur og inspiser screenshot. Registrer faktisk ekstern gate på PR-en; den kan ikke bevises av en lokal JSON-flag. Kun eksplisitt autorisert, avgrenset offentlig tilgangsendring er tillatt etter [sikkerhets-/eksponeringskontroll](PUBLIC_ACCESS_REVIEW.md); ingen merge eller produksjonsdeploy uten separat godkjenning.

CI henter nødvendig Git-historikk og kjører den strenge release-gaten etter full check, avhengighetskontroll (`npm audit --audit-level=high`) og E2E, mot faktisk PR-base. Fremtidige implementation-endringer kan derfor ikke arve et gammelt fingerprint eller en annen PRs review. Ukjente ikke-Markdown-filer (også nye/root-byggkonfigurasjoner), kildekode, tester, assets, CI, kvalitetsdata og normative kontrakter er gate-relevante som standard. Bare rapport-Markdown/status og ordinære Markdown-nits er unntatt; kjørbare filer i rapportmapper er ikke unntatt. Isolerte negative validator-fixtures er skilt fra den løpende release-rapporten, mens denne rapporten fortsatt valideres positivt. Dokumentasjonsnits uten implementeringsendring trenger ikke en ny kodeaudit, men må fortsatt bestå relevante dokumentasjonskrav. Endring av selve normative kvalitetsdokumentene regnes som gate-relevant arbeid.

## Hva «independent» betyr og ikke betyr

Review-recordet skal oppgi implementation-finished/review-started, annen reviewer-identitet, type (`agent` eller faktisk menneske), versjonert filfingerprint, seks faglige reviewdomener, gjennomgåtte bevis, funn og retester. Siden dette er et lokalt repository kan ingen klientvalidator bevise en persons kvalifikasjon, at et menneske faktisk har lest noe eller at reviewer ikke lyver. Strukturelle/hash-/CI-kontroller gir håndhevbar sporbarhet og oppdager foreldede eller manglende bevis; de er ikke en sikker signatur eller menneskelig godkjenning.

Kildekontroll av author, separat agent-review, kvalifisert Azure-SME, novice/IT-usability, skjermleser-review og målt transfer er ulike gater. For PR20 skal de menneskelige feltene stå unperformed. Eksisterende PR19 PARTIAL-funn blir ikke løst av denne infrastrukturen.

## Gate6-spørsmål

Reviewer må utfordre: overfladisk/manglende teori; utdatert eller feil faktapåstand; motstridende forklaringer; oppdiktet runtime/visualisering; spørsmål som røper svaret eller bare tester ord; feil guide/mål; utilgjengelig kritisk tekst; misvisende completion/XP; manglende sammenheng med lab; faktisk svekkede regresjoner. Se både feil- og normalflyt, kildegrenser og faktiske browserbilder. En rapport alene uten kode-/test-/browserbevis er ikke nok.
