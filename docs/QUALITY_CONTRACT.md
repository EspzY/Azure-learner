# Permanent Quality & Learning Engineering Contract

Normgivende eierkontrakt, versjon **1.0.0**, innført med PR20. Gjelder alle fremtidige Fundamentals- og profesjonelle leveranser. AGENTS.md krever at den leses før arbeid. Ved konflikt har ny eksplisitt eierinstruksjon forrang; denne aktive kontrakten erstatter ikke frosne tekniske/evidenskontrakter eller eierens desktop-first-prioritet. Historiske RPG/Living Learning-tekster er ikke aktive krav.

AzureLab skal utvikle forståelse gjennom original teori, presise fagvisualiseringer, autentisk avgrenset Portal-praksis og uavhengig anvendelse. En modul blir ikke ferdig av en tittel, kildehenvisning, skjerm eller grønn test. Det kreves en separat sluttgjennomgang etter implementering. Å øke antall moduler er aldri et mål som kan erstatte kvalitet.

## Arbeidsmetode og proporsjonalt kontrollomfang — eierinstruks29 oktober2026

[DEVELOPMENT_WORKFLOW](DEVELOPMENT_WORKFLOW.md) skiller permanente kvalitetskrav fra testfordeling, risikobasert review og effektiv arbeidsflyt. Bruk tidlige målrettede domene-/browser-/visuelle kontroller, full check før leveranse og komplett godkjent CI på riktig commit som autoritativ regresjon. Gjenta ikke full lokal suite eller nær identisk review etter små rettelser uten konkret risiko/funn. Alle seks reviewdomener behandles; dybden følger faktisk endring, og uendrede domener dokumenteres med bevaringsbevis. Blokkere/MAJOR, dataintegritet, assistance, teknisk sannhet og faktiske visuelle/eksterne bevis kan aldri fravikes. Desktop er primærplattform; kompakt, tastatur og tilgjengelighet skal bevares uten automatisk duplisering av alle lange brukerreiser. Ny testfordeling er foreløpig en eksplisitt opt-in-kandidat; gjeldende CI gjelder inntil eiergodkjenning. Dette reduserer ikke kravene A–I.

## A — Faglig dybde

Hver ny modul må ha forkunnskaper og stabile mål; definert terminologi; grundig konseptforklaring; mekanisme/relasjoner; hvorfor/når-bruk; Azure-eksempler og worked example; begrensninger/misforståelser/moteksempler; relevant interaktiv visualisering, simulering eller fagøvelse; nytt selvstendig scenario; begrunnelse av riktige og plausible gale svar; verifiserbare kilder. Substans vurderes mot målet, aldri etter ord-, kort- eller spørsmålsantall.

[CONTENT_STANDARDS](CONTENT_STANDARDS.md) beholder detaljkravene. [CONTENT_QA_STANDARD](CONTENT_QA_STANDARD.md) operasjonaliserer dem og A–F-terskelen fra PR19 uten ny AZ-900-audit. Essential teaching skal finnes i kurset, med Journal for repetisjon; valgfrie eksterne lenker erstatter ikke manglende undervisning. Gammelt innhold som fortsatt er PARTIAL blir ikke godkjent av denne kontrakten.

## B — Kilder før manuskript

Følg [SOURCE_COVERAGE_PROTOCOL](SOURCE_COVERAGE_PROTOCOL.md): gjeldende study guide → stier → alle relevante moduler/enhetssider innen scope → faktisk lenket tillegg/utvidbare seksjoner/videre lesning/forkunnskaper → produkt-/arkitekturdokumentasjon → offisielle demonstrasjoner og tilgjengelige øvingsmiljøer. Registrer tittel, URL, versjon/kontrolldato, mål, konkrete kontrollerte påstander, grenser og tilgjengelighet. Kontroller forskjeller og daterte eksempler; ikke lær bort gamle universelle regler når nyere produktdokumentasjon kvalifiserer dem.

BLOCKED/UNVERIFIED-kilder kan ikke alene godkjenne en påstand. Undersøk offisielle alternativer og oppgi gjenværende usikkerhet. Ingen innlogging/tilgangskontroll omgås. En fungerende URL eller automatisk referansetest er ikke faktasjekk eller komplett undervisning.

## C — Original vurdering og transfer

Oppgaver kobles til stabile kompetanse-/mål-ID-er, rubric-/itemversjon, misforståelser, kilder og forklaring per plausibelt alternativ. Et nytt scenario må endre relevante krav/beslutningsstruktur; nye navn eller tall alene er ikke robust transfer. Første unaided levering, hjelp, retry, avbrudd og tidligere familieeksponering må holdes adskilt. Gamle svar/rubrikker oppgraderes ikke automatisk.

[AZ900_ASSESSMENT_BLUEPRINT](AZ900_ASSESSMENT_BLUEPRINT.md) er eksisterende plan. Fremtidig motor skal kunne støtte single choice, multiple response, matching, drag-and-drop med tastatur-/listealternativ, ordering/build list, situasjonsoppgaver, case studies, interaktive tekniske beslutninger og senere simulatoroppgaver. Dette er planlagte formatkontrakter, ikke implementerte features i PR20. Microsofts offentlige exam sandbox og dens dokumentasjon er interaksjonsreferanse, aldri en spørsmålskilde. Ingen beskyttede practice-spørsmål, eksamensdumper eller omskrivninger av slike. Tredjepart er eventuelt lovlig kontekst, ikke verifisert sannhet.

## D — Forklarende visuell kvalitet

Velg representasjon etter mekanismen. Vis faktiske relasjoner, årsak/virkning, parametere og konsekvens av endring; skill konfigurert, validert, avvist og faktisk observert. Bevar lese-/tekstalternativ, semantiske kontroller og konsekvent typografi. Generiske bokser er ikke nok når en presis flow, matrix, tidslinje eller avhengighetsmodell kreves. Teknisk korrekt, men pedagogisk utydelig innhold skal revideres.

Inspiser faktiske produksjonsbilder ved1920×1080,1440×900,1366×768 og relevante kompakte/korte vinduer. Bevar eksisterende narrow-regresjoner; ny mobilproduktutvikling er ikke automatisk pålagt. Test forklaringen sammen med modellen, kontrast/fokus, skjult tekst, zoom, clipping, overflow, sticky footer, scroll og reduced motion. Tester beviser ikke profesjonell kunst-/UX-kvalitet eller læringseffekt.

## E — Portal-fidelity og teknisk sannhet

Nye operative flater krever daterte virkelige Microsoft-referanser og sammenlignede browserbilder. Bruk sentralt ikonregister og lisens/proveniens; ingen skjult generisk fallback. Bevar engelske korrekte service-/feltnavn, hierarki, faktisk opprettelse/konfigurasjon, typed dependencies og felles inventory/Overview/Properties/history. Konfigurasjon er ikke drift; grafkant er ikke trafikk; lokal receipt er ikke Azure-deployment. Ingen falske kontroller, reell Azure-kommunikasjon, credentials eller betaling.

[PORTAL_ICONOGRAPHY](PORTAL_ICONOGRAPHY.md), [PORTAL_REFERENCE_FIDELITY](PORTAL_REFERENCE_FIDELITY.md) og [INTEGRATED_LABS_ARCHITECTURE](INTEGRATED_LABS_ARCHITECTURE.md) beholder detaljene. Senere legitim domeneutvidelse skal versjoneres og bevare tidligere gyldige regler/receipts/saves; PR20 utvider ikke domenet.

## F — SavvyShark

[SAVVYSHARK_GUIDANCE_STANDARD](SAVVYSHARK_GUIDANCE_STANDARD.md) er den aktive F1–F5-kontrakten: mission briefing med subtil blur, pedagogiske milepæler, dynamisk faktisk guide, synlige obligatoriske instruksjoner og ingen automatisk solution-help i independent mode. Fortsett/Start/Avbryt må ha tydelige konsekvenser. Maskoten kan observere og navigere, aldri konfigurere, svare eller belønne på elevens vegne.

## G — Syv obligatoriske gater

| Gate                      | Bevis og håndheving                                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 Source Integrity        | Scope, discovery, tilgjengelighet og claim→mål→kilde; offline struktur-/referansecheck pluss faktisk forfatterkildesjekk.                              |
| 2 Curriculum Integrity    | Forkunnskaper/manuskript/mekanisme/moteksempel/aktivitet/nytt scenario/feedback; eksisterende curriculum-validatorer og scoped release-bindinger.      |
| 3 Simulation Integrity    | Rene regler, ugyldige requests, atomisitet, avvisning, dependencies, receipts, replay, gamle bytes og lagring; bevar full domene-/E2E-suite.           |
| 4 SavvyShark Integrity    | Briefing, faktisk trigger/guide, mål, alternativ navigasjon, feil, reload, once-only, focus og alle independent-kontekster.                            |
| 5 Visual & Accessibility  | Produksjonsbrowser, inspiserte bilder/referanser, lesbarhet, keyboard/Axe, clipping/zoom/scroll/modal og reduced motion.                               |
| 6 Independent Final Audit | Ny kritisk post-implementation review-pass, helst separat agent/fersk kontekst. Hashbundet review, eksplisitte funn/disposisjon og relevante retester. |
| 7 Delivery Verification   | Full suite, grønn siste CI, stabil preview med eksakt SHA, root→synlig arbeid→faktiske handlinger→retur, oppdaterte docs og ærlige begrensninger.      |

[RELEASE_ACCEPTANCE](RELEASE_ACCEPTANCE.md) beskriver kommandoene, skillet mellom `quality:check` og den strenge `quality:release`-gaten og det aktuelle release-recordet. Strukturell kontroll kan ikke vurdere forklaringsdybde, faglig sannhet, estetikk eller menneskelig transfer. Disse må utfordres i den separate review-pass-en og markeres som menneskelig uvaliderte der det er tilfelle.

Release-blokkerende funn skal rettes og berørte tester kjøres på nytt. Ingen skips, slettede tester eller svakere assertions for å skjule feil. Dokumentert lavere prioritet kan stå åpen som begrensning; blokkere/major kan ikke omklassifiseres til «akseptert» bare for å levere.

## H — Kompetanser og sertifiseringer

Kompetanse-ID-er er locale-/sertifiseringsuavhengige. Eksamen er en versjonert overlay med forskjellige nivåer/dybde/rubric for eksempel AZ-900/AZ-104/AZ-305. Ett område kan trenge flere moduler. Tidligere v1/v2-, guided- eller Fundamentals-resultater blir ikke automatisk nye eller høyere kompetansebevis. XP er deltakelse; lokale resultater er ikke autoritativ sertifisering eller passgaranti.

## I — Permanent prosjektintegrasjon

Kontrakten er obligatorisk fra AGENTS, README, CI og release-records. Gjenbruk docs/assets/curriculum/audit/legacy/domain/browser-kontrollene; ikke bygg en parallell kursmotor eller CMS. Endrede filer, kilder, faktiske tester og begrensninger må følge implementeringen. Faglig forfatterreview, separat agentreview, kvalifisert menneskelig SME og lærerstudie er fire forskjellige påstander. Ingen automatikk får registrere de siste to som bestått.
