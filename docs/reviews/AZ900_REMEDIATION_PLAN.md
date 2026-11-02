# AZ-900 — prioritert forbedringsplan og menneskelig pilot

**1. november 2026 · forslag til separate leveranser, ikke forhåndsgodkjent implementering.** [Hovedrapport](AZ900_END_TO_END_AUDIT.md) · [Reisekart og flytstandard](AZ900_LEARNING_JOURNEY_MAP.md) · [Versjonsbundet evidens](evidence/audit42.json).

## Beslutningsrekkefølge

Ingen bekreftet P0 i det avgrensede, faktiske utvalget. **LJ-01, UX-01, LJ-02 og AS-01 er P1.** De bør løses eller eksplisitt vurderes før siste produktgjennomgang og P17/P18. P2 er målrettede forbedringer; de skal ikke bli en unnskyldning for å skrive om hele plattformen.

Anbefalt første leveranse er **Learning Flow & Guided Mission Navigation**. Deretter kan den lille dialogrettingen leveres separat, før kildeforenkling og mer omfattende curriculum-/assessment-arbeid. Fastsett rekkefølgen for nybegynnerreisen før store manuskriptkutt. Assessment-pakken må håndtere historikk fra starten. Portal-utvidelser kommer etter sentrale flyt-/vurderingsproblemer.

Alle funn var åpne produktfunn i PR42. PR43 implementerer nå avgrenset LJ-01 og PORTAL-GUIDE-01; se status nedenfor. Ingen av tiltakene nedenfor er implementert av audit-rapporten. Endelige PR-numre velges etter eiergjennomgang; vi reserverer ikke PR43–47 eller starter arbeid automatisk.

## Funnregister og testbare arbeidspakker

### LJ-01 · P1 · Learning Flow & Guided Mission Navigation

**PR43-status:** implementert og under endelig kandidatverifikasjon. Felles read-only navigasjonsprojeksjon bruker opprinnelige evaluatorer i 13 moderne moduler; eksplisitt briefing/Start, aktiv/pauset/årsaksfase, debrief/neste og eksakt independent-prioritet er skilt. Før/etter og faktisk testomfang finnes i [leveransekontrakten](../LEARNING_FLOW_GUIDANCE.md). Full CI/streng release og ekstern eksakt-SHA-verifikasjon rapporteres på Draft PR43; denne teksten alene lukker ikke leveransen. Ingen historisk completion eller manuskript endres.

- **Berørt:** Security `missions → studio&perspective=trust → missions`; samme statiske navigasjonsmønster i Compute, Networking, Storage, Identity, Cost, Governance, Tools og Monitoring. Tidligere praktiske oppdrag har egne origin-/returforløp.
- **Evidens:** anonym SHA `4732f93…`, én lagret run uten forklaring; Next gikk til missions. Etter gyldig fullføring er Next fortsatt missions og Hub anbefaler samme Studio. Back/reload/resume bevarer arbeidet. [Bilde](screenshots/owner01-next-returns-list.png), `owner01` og `breadth` i bevisfilen.
- **Konsekvens:** hovedhandlingen kan lede studenten bort fra gjenstående undersøkelse/forklaring. Teknisk lagring alene gir ikke sammenhengende pedagogisk progresjon.
- **Anbefaling:** videreutvikle eksisterende CourseNavigation med en anbefalt handling fra modulens faktiske guide-/assessment-status. Vis oppdragsnavn og gjenstående steg nær primærhandlingen. Etter ferdig guide: debrief → neste relevante oppdrag eller independent. Korriger «Åpne briefing»-kopi eller la den synlige inngangen faktisk åpne briefingen; Start skal fortsatt være eksplisitt.
- **Risiko:** management teaching-boundary, independent-shielding, stored guide/session, multi-tab-konflikt og eldre Portal-origin. Ingen ny global progress-motor eller ny fullføringsbetydning.
- **Akseptanse/tester:** ny og delvis Security-guide; lagret kontrast uten cause; fullført guide; aktiv unaided og assisted assessment; Back/Forward, Hub, reload og eksakt resume; scope recovery. Samme tilstandsmatrise med representative Compute-/Network-/Cost-arbeidsflater, nyere Studio og eldre praktisk mission/Web-lab. Frivillig direkte navigasjon forblir mulig og gir aldri kreditt. Manglende/avvist durable write må blokkere svarbærende hjelp. Verifiser fokus/scroll, 1440×900, 1024×768 og kort desktop. Utvid målrettet eksisterende E2E; full godkjent CI én gang på endelig kandidat.

### PORTAL-GUIDE-01 · gjenfinnbar veiledning

**Identifisert:** VM/PaaS-panelets eksisterende minimert-knapp fungerer. Bekreftet UX-/kontekstfeil: vanlig `/portal` mister nødvendige URL-parametere og viser ingen vei tilbake til gyldig lagret guide. Økten er ikke slettet. Fri Sandbox manglet generell orientering. Studio-eid veiledning som naturlig hører hjemme i kurset, og undertrykking ved independent/ukjent state, er tilsiktede grenser.

**PR43-retting:** permanent diskret SavvyShark-kontroll gjenåpner resident-panelet eller tilbyr eksplisitt kontekstretur. Fri Portal får orientering og eksisterende oppdragsinngang. Ugyldig teknisk forsøk får recovery fremfor automatisk rebinding. Minimering og recovery-lenker gir ingen kreditt, World-endring eller nye økter. Nøytral independent-status gir ingen hjelp; faktisk hjelp krever fortsatt opprinnelig durable klassifisering.

**Verifikasjon:** nye målrettede VM/PaaS/Compute/Networking-reiser, ressursnavigasjon, Back/Forward/reload, kursretur, reset, cross-tab og denied writes. Faktiske før/etter-bilder i [leveransekontrakten](../LEARNING_FLOW_GUIDANCE.md). Sluttstatus avhenger av separat review, eksakt-head full CI og faktisk ekstern brukerreise på Draft PR43. Større ny SavvyShark-plattform, generelle Portal-kapabiliteter og modalretting inngår ikke.

**Levert PR43-status:** LJ-01 og PORTAL-GUIDE-01 er verifisert på head `0d7905061ccd9bd0684a37cea895b0baad137c38`, [full265CI/strict](https://github.com/EspzY/Azure-learner/actions/runs/41353895601) og faktisk anonym full-SHA Gate7. Disse funnene gjenåpnes ikke av PR45.

### UX-01 · P1 · avgrenset normal-dialogretting

- **Berørt:** Security/Storage/Identity/Monitoring startbekreftelse og global Journal; felles `PortalDialog` uten tilsiktet sidepanel.
- **Evidens:** faktisk x=0/y=0, width750 ved 1440 og 1024; kortvindu max-height/scroll virker. [1440-bilde](screenshots/owner03-assessment-dialog-1440x900.png). Kun DOM-margin-auto ga x137/y25 ved 1024×500. Native GuidanceWindow er allerede sentrert. Notifications er bevisst høyrestilt sidepanel.
- **Konsekvens:** stor sentral brukerhandling ser feilplassert ut, med urolig bakgrunn/romfordeling; ingen dokumentert tastatur-/dataintegritetsfeil i det testede Security-forløpet.
- **Anbefaling:** eksplisitt viewport-sentrering for ordinær dialog, passende bredde/padding, max-height og intern scroll. Avgrens CSS mot `.portal-side-panel`. Ingen full ny modalplattform kreves.
- **Risiko:** global CSS/reset, Portal-blades, focus trap/retur, Escape, korte vinduer og lange starttekster.
- **Akseptanse/tester:** geometrisk sentrering ved 1440×900 og 1024×768; full obligatorisk tekst/knapper kan nås ved 1024×500 og zoom; Escape avbryter uten forsøk og returnerer fokus. Test normal dialog både på Course og Portal, Journal, native SavvyShark og uendret høyrestilt Notifications. Axe, keyboard og reduced motion. Ikke «fiks» riktige sidepaneler ved å sentrere alt.

**PR44 — implementert og lokalt retestet:** årsaken er bekreftet på PR43s offentlige full-SHA-preview: global margin0 på native dialog. Tre avgrensede CSS-linjer gir auto-margin bare til ordinære dialoger. Alle lokale akseptansekontroller består: fire assessments, Journal og Portal Help geometrisk sentrert; kortvindu, ekte200%browserzoom/forstørret tekst, fokus/Escape/Axe; uendrede sidepaneler/native guider/PR43 recovery; denied durable Journal og historisk first bevart. [Før/etter og avgrensning](../DIALOG_PLACEMENT.md). UX-01 er rettet i kandidaten; endelig leveranseaksept krever separat audit, eksakt-head274CI/strict og faktisk ekstern Gate7, dokumentert på Draft PR44. Ingen andre funn lukkes.

**Levert PR44-status:** UX-01 er verifisert på head `7775b0a22d0a5c88597c28b3df780b92425f3dce`, [full274CI/strict](https://github.com/EspzY/Azure-learner/actions/runs/41360582115), separat audit uten åpne BLOCKER/MAJOR og faktisk anonym full-SHA Gate7.

### LJ-02 · P1 · Curriculum Sequencing & Theory Consolidation, første trinn

- **Berørt:** standard overgang Storage B→Migration og Security→Cost, samt eksplisitte forkunnskaper i `migrationNb` og `securityNb`.
- **Evidens:** Migration forutsetter datarettigheter/Management, Security forutsetter Governance/Monitoring; disse delene kommer senere i dagens Next-kjede. Reisekartet viser faktisk og foreslått rekkefølge.
- **Konsekvens:** fullstendig nybegynner får syntese-/migreringsoppgaver før nødvendig fordypning, selv om innholdsoversikten er komplett.
- **Anbefaling:** behold Storage/Identity A/B/C i Course Hubs faglige gruppering, men anbefal Migration og Security som senere capstones på tvers av stier. Første patch bør begrenses til anbefaling, overgangstekst og Next-kjede. Deretter vurder valgfri profesjonell fordypning.
- **Risiko:** navigation metadata, aktive deep links og resume, ufrivillig omklassifisering av gamle resultater. Ikke bruk besøkt modul som ny «forutsetning fullført»-sperre.
- **Akseptanse/tester:** første Start for ny state; anbefalt sekvens har alle eksplisitte forutsetninger introdusert før capstones; IT-erfaren kan fortsatt åpne Migration direkte; aktiv assessment gjenopptas uansett ny anbefaling. Alle gamle Part A/B/C-URL-er, historiske førsvar og sidebar-state ved Back/Forward/reload består. Ingen ny authored-coverage-/mestringspåstand.

**PR45 — implementert kandidat, verifikasjon dokumenteres separat:** én typesikker anbefalt sekvens bruker alle17modulruter én gang. StorageB→IdentityA, AccessB→Cost, Monitoring→SecurityC→MigrationC→Hub; Forrige er symmetrisk. Katalogens tre stier og delgrupper består. Korte broer, to avsluttende markører og en nøktern avslutning gir orientering uten completion-/mestringspåstand. Eksisterende guided/independent/recovery-prioritet, gamle ruter/records, World/receipts/XP og rubrics er bevart. Kun tre gamle available-/navigasjonstekster er oppdatert. Se [implementasjon, målrettede retester og før/etter](../LEARNING_SEQUENCE.md). LJ-02 lukkes for denne avgrensede første etappen først når separat audit, faktisk eksakt-head281CI/strict og anonym Gate7 er bestått og dokumentert på Draft PR45. Ingen annen pedagogisk konsolidering eller menneskelig læringsvalidering påstås utført.

### AS-01 · P1 · Assessment Quality & Transfer, versjonert etterfølger

- **Berørt:** `/learn/benefits?topic=assessment`, `/learn/services?topic=assessment&version=2`.
- **Evidens:** blindreview pluss faktiske førstevalgsinnleveringer: Services første substantive alternativ i alle sju selects ga 7/7 kriterier; Benefits første alternativ i fem selects pluss separat løst tallfelt ga 6/6. [Review og relasjonelle matriser](evidence/audit42-assessment.json).
- **Konsekvens:** et sentralt independent-resultat kan oppnås via svarposisjon uten å skille de faglige alternativene.
- **Anbefaling:** lag en eksplisitt versjonert successor med faglig plausible alternativer og balansert forfatterrekkefølge eller stabilt lagret visningskart. Bevar gammel versjon for tidligere first/help/retry. Skill ny gjenkjenningssjekk fra reservert transfer. Ingen stille omstokking av gamle numeriske nøkler eller omskriving av first-records.
- **Risiko:** content/rubric-versioning, replay og familieeksponering. Services godtar bare koblede par IaaS/os-team eller PaaS/platform-supported, ikke alle fire kombinasjoner. Moderne banker lagrer numeriske indekser; gamle mapper må beholdes.
- **Akseptanse/tester:** all-first-strategi gir ikke systematisk fullt nytt resultat; reviewer løser faktisk sluttbank blindt før nøkler, utfordrer gyldige alternative par og posisjon/lengde/ordvalg. Test alle koblede par, gammel save/replay/feedback byte-semantikk, familieeksponering, delvis svar, abandon, help og assisted retry. Eldre førsteinnleveringer skal ikke vurderes på nytt mot nye alternativer. UI må vise hvilken vurderingsversjon et historisk resultat tilhører uten å belaste hovedlæringen med intern terminologi.

**PR46 — implementert versjonert retting:** Benefits2 og Services3 er ny standard med separate durable stores, stabile ID-er, seks beslutning/begrunnelse-situasjoner hver, eksplisitte historiske ruter og opprinnelig replay. Svake alternativer er substansielt revidert etter låst blindreview; alternative IaaS/PaaS-par og numerisk scenario vurderes kompatibelt. [Implementasjon og verifikasjonskontrakt](../ASSESSMENT_REFINEMENT.md). Endelig AS-01-lukking krever dokumentert post-stamp audit, eksakt-head290CI/streng release og faktisk anonym full-SHA Gate7 på Draft PR46. Historiske PR42-funn/bevis beholdes; AS-02, UX-02 og øvrige P2 er fortsatt åpne.

### UX-02 · P2 · Global UX Consistency: kilder og videre lesning

- **Berørt:** alle senere teori-/Studio-/Summary-/Journal-kildeflater; eldre Foundations/Benefits/Services har allerede sammenlagt mønster.
- **Evidens:** 40 lenker/1300px i Tools Summary og 36/1178px i Governance ved 1440×900; Security 28/920px. Fersk global Journal viser ikke alle modulbanker; besøkt modul kan legge til kilder.
- **Konsekvens:** støtteinformasjon konkurrerer med læringsoppgaven og gir mer scroll, særlig i kompakte PC-vinduer.
- **Anbefaling:** én felles tilgjengelig, sammenlagt kildeinngang med antall og diskret kontrolldato. Behold offisielle referanser/claim-bindinger og viktige faglige forbehold synlig ved modellen.
- **Risiko:** Journal/feedback kan være svarbærende. Kilde-/teorikomponent må fortsatt ligge innen korrekt assistance-boundary før den i det hele tatt monteres.
- **Akseptanse/tester:** collapsed som standard, tastaturåpning, semantisk summary/expanded-state, alle samme ID/URL/tittel/dato tilgjengelige ved åpning; ingen viktig forklaring skjult som «valgfri». Journal under aktiv independent registrerer hjelp varig før tilgang; 1024×500 og normal desktop, ingen overflow eller mistet fokus. Ingen omskriving av assessment-kopier som del av CSS-pakken.

**PR47 — implementert UX-02-kandidat:** Én native SourceDisclosure erstatter åpne bibliografier i 13 moderne moduler og relevante Core/Serverless/eldre kurs-/Portal-/Journal-flater. Alle kildebanker/claim mappings og historisk evidence er uendret. Målt synlig Summary-kildeareal er redusert 89,6–93,0 %, Journal-eksemplet 92,8 %. Obligatoriske modellgrenser forblir synlige, teaching boundaries består. [Omfang, før/etter og tester](../COLLAPSIBLE_SOURCES.md). **UX-02 lukkes først når separat audit, full296 eksakt-head CI/streng release og anonym full-SHA Gate7 er dokumentert på Draft PR47.** De daterte PR42-funnene beholdes; andre P2 og menneskelig validering gjenstår. LJ-01/PORTAL-GUIDE-01, UX-01, LJ-02 og AS-01 gjenåpnes ikke uten konkret regresjon. Neste eiergjennomgang prioriterer PD-01/AS-02/PR-01; ingen P17/P18.

### PD-01 · P2 · Curriculum Consolidation, andre trinn

- **Berørt:** hele reisens framing, korte forkunnskapsbroer, Summary-/starttekst og omfattende profesjonelle detaljseksjoner.
- **Evidens:** 49 171 avgrensede teoritokens, 41 senere preset-guider, samme prediksjon/run/kontrast/cause-format i mange moduler; konkrete gjentakelsespar i reisekartet. Ikke bevis for 41 obligatoriske oppdrag, optimal lengde eller for lang faktisk læringstid.
- **Konsekvens:** mulig tretthet og unødvendig teknisk belastning, selv med korrekt fagstoff. Krever menneskelig pilot før stor nedskjæring.
- **Anbefaling:** merk grunnlag/anvendelse/valgfri fordypning, bruk korte recall-broer og varier handling etter mekanisme. Samle «lokal modell»-rammen, behold konkrete begrensninger. Oppdater utdaterte «current/available»-overskrifter i prosjektdokumentasjonen uten å slette historikken; det nye reisekartet er datert nåbilde.
- **Risiko:** nødvendig teori gjøres utilsiktet valgfri, eller guidet credit endres. Gammel lagret observasjon beholder betydningen sin selv om elevteksten forenkles.
- **Akseptanse/tester:** claim/fasett→obligatorisk undervisning er fortsatt sporbar; ingen relevant mekanisme, moteksempel eller tilgangsgrense borte. Pilot kan forklare nye begreper og neste steg uten moderatorhjelp. Målrettede domene-/renderingstester ved faktisk endring, ingen masseomskriving kun for å nå et ordmål.

### AS-02 · P2 · transfer og diskriminering etter AS-01

- **Berørt:** hele banken; konkrete risikopar `nw12`, `sa02/sa12`, `cm10/campaign-pricing`, og eldre absolutte distraktorer.
- **Evidens:** separat blindutvalg 28/152; lengdemål over alle 152 gir risiko, men faktisk linjelengde avkrefter en universell «lengst er riktig»-regel. Ingen nøkkelfeil i utvalget. Semantisk overlapper enkelte ulike familier på tvers av stores.
- **Konsekvens:** korrekt lokalt svar er svakere bevis for ny anvendelse enn total oppgavetelling kan antyde.
- **Anbefaling:** behold korte begrepssjekker tydelig merket, reserver nye situasjoner med endrede krav/evidens og rimelige alternativer. Planlegg global semantisk exposure uten å slå sammen gammel familiehistorikk. Ikke start P17/P18 som en del av rettingen.
- **Risiko:** ny transfer-versjon sammenblandes med gammel recognition, eksponerte familier merkes friske, eller gyldig alternativ blir feilavvist.
- **Akseptanse/tester:** nøkkelfri final-bank review, gyldige alternativpar, teknisk kildegrunnlag, forskjell fra guided i beslutningsstruktur og ikke bare navn. Egen menneskelig ukjent oppgave/retensjon; ingen psykometrisk påstand uten relevante elevdata.

### PR-01 · P2 · Azure Portal Fidelity & Practical Capability Expansion

- **Berørt:** dagens Portal-kapasitet og forbindelsen fra kursmoduler til operativ praksis.
- **Evidens:** typed kommandoer/World, offentlig CreateGroup og originalt policyavslag/receipt, read-only Studio-bevaring, offisielle Microsoft-referanser og faktisk ikonregister. Store deler av AZ-900 er konseptuelle, ærlig merket.
- **Konsekvens:** god lokal ressurskjerne, men begrenset variasjon i praktiske arbeidsoppgaver sammenlignet med bredde i kurset.
- **Anbefaling:** velg én kapabilitet med høy elevverdi etter tabellen nedenfor. Ingen døde ikoner eller operativt utseende uten definerte lokale regler.
- **Risiko:** tekniske saves/receipts/World, versjoner, scope og kryssressursreferanser. Konseptmodeller må ikke bli en ny konkurrerende ressursdatabase.
- **Akseptanse/tester:** spesifiser kommando-/ressurstype, felt/avvisninger, idempotens, atomisitet, scope/dependencies, versjon og gamle saves/receipts før UI. Samme ressurs skal finnes i inventory/Overview/Properties/history. Oppdrag krever faktisk verifisert resultat. Ingen Azure API, betalt ressurs, credentials eller falsk runtime. Bruk daterte Microsoft-UI-referanser og korrekte ikoner.

## Portal-faser: elevverdi mot kostnad

Vurderingene er arkitektoniske estimater i lav/middels/høy, ikke tids-/kostnadsløfter.

| Kandidat                                               | Elevverdi / AZ-900                   | AZ-104/305-verdi              | Kostnad / kontraktrisiko  | Hva må modelleres ærlig? / ny praksis                                                                                                                                                            |
| ------------------------------------------------------ | ------------------------------------ | ----------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bedre kurs→eksisterende ressurs/receipt-inspeksjon     | Høy / høy                            | Middels                       | Lav–middels / lav         | Riktig origin/resume og faktisk inspeksjon. Variert diagnose/forholdskontroll uten nye World-typer                                                                                               |
| Avgrenset Storage Account + container/objektmetadata   | Høy / høy                            | Høy                           | Middels–høy / middels–høy | Account-type/service/scope, navnegrenser, container/objektmetadata, lokale kommandoer/replay. Ingen ekte opplasting/SAS eller påstått datatilgang. Ny praksis: organisering og korrekt kontovalg |
| Selvstendig VNet/subnet/NIC-konfigurasjon              | Middels–høy / høy                    | Høy                           | Høy / høy                 | CIDR/overlapp/referanser, deletion-konsekvenser, migreringsfri støtte for eksisterende VM-bundle; ikke faktisk trafikk. Ny praksis: reparer avhengighetsfeil                                     |
| Avgrenset resource lock-motor                          | Middels / middels                    | Høy                           | Middels–høy / høy         | Control-plane/action taxonomy, scope-arv, sletting og removal. Gamle receipts må beholde utfall; ikke fiktiv beskyttelse av data plane                                                           |
| Lokal principal/role/scope-motor                       | Middels / middels                    | Høy                           | Høy / svært høy           | Eksplisitt simulert identitet/role/permission/deny-kontrakt for støttede kommandoer, historisk replay og bootstrap. Senere egen arkitekturleveranse, ikke rask Portal-knapp                      |
| Flere listefiltre, snarveier og visninger              | Middels / middels                    | Middels                       | Lav–middels / lav         | Fungerende søk/filter/tastatur mot samme inventory, tydelig tilgjengelighetsstatus. Ingen full Microsoft-UI-paritet som selvstendig mål                                                          |
| Ekte Monitor/Defender/Arc/VPN/Entra eller generell ARM | Lav gevinst ved å late som / blandet | Høy for senere profesjonskurs | Svært høy / høy           | Bør foreløpig forbli konseptuell; faktisk runtime ville kreve separat autorisert infrastruktur og evidensgrenser                                                                                 |
| SQL/Cosmos/avanserte tjenester                         | Lavere før sentrale flytfunn er løst | Høy senere                    | Høy / høy                 | Krever egne data-/tilgangs-/operasjonskontrakter. Utsett til begrunnet AZ-104/AZ-305-/datakursleveranse                                                                                          |

## Pilotprotokoll — foreslått, ikke gjennomført

**Formål:** undersøke om en nybegynner finner og fullfører en sammenhengende læringsoppgave og overfører forståelsen til et nytt problem. Teknisk CI og agentreview kan ikke svare på dette.

**Rekruttering:** foreslå fire helt Azure-uerfarne, to IT-erfarne Azure-nybegynnere, én uavhengig Azure-fagperson og to personer som faktisk bruker skjermleser; roller kan overlappe. Dette er en kvalitativ første pilot, ikke en statistisk valideringsstudie. Deltakere bruker isolerte syntetiske profiler uten virkelige kontoer, credentials eller person-/arbeidsdata. Avtal samtykke, opptak, tilgang og slettetid før noen opptak.

**Økt på 60–75 minutter:**

1. Åpne root uten forklaring. Deltakeren beskriver hva AzureLab er, om det bruker ekte Azure, hvor læringen begynner og hvor Sandbox finnes. Observer første handling og forklaringsbehov.
2. Følg en kort relevant teoribro → modell → native SavvyShark-guide. Be deltakeren si hvilket oppdrag som er aktivt, hva som gjenstår, og hva Neste forventes å gjøre. Observer avbrudd, misforståelser, scroll og repetisjon; moderator gir ingen løsning.
3. Lukk/reload og gjenoppta. Åpne Journal og en tidligere besvarelse under et aktivt independent-forsøk. Be deltakeren forklare forskjellen på besøk, guidet arbeid, hjelp, retry og første innlevering; støtte må klassifiseres som hjelp.
4. Gjør én faktisk lokal Portal-oppgave, eksempelvis forklar et policyavslag og inspiser riktig kvittering. Be deltakeren skille lokal konfigurasjon fra faktisk applikasjonshelse.
5. Gi et nytt, på forhånd reservert scenario med endret krav/evidens uten produktnavn som hint. Registrer både beslutning og begrunnelse før feedback. Be om hva som fortsatt er ukjent. Frivillig ny oppgave etter 5–7 dager undersøker retensjon; ingen ny «frisk» familie om den allerede er eksponert.
6. Spør hva som var unødvendig, for teknisk, uklart eller nyttig. Sammenlign ikke hele den lange kursreisen ut fra én kort økt; senere lengre pilot må måle total belastning.

**Skjermleserøkt:** faktisk NVDA/JAWS/VoiceOver-bruker etter preferanse på desktop. Test overskriftsstruktur, sidebar-utvidelse, fokus/scroll etter klientnavigasjon, native dialog, Escape/fokusretur, tabellalternativ, kilde-details og tilbakemeldinger. Axe er supplement, ikke erstatning.

**SME-økt:** utfordre gyldige alternative løsninger, tekniske forbehold og om «grunnlag» versus «fordypning» er riktig prioritert. Ingen gjenbruk av beskyttede Microsoft-assessment-oppgaver.

**Registrering:** oppgaveløsning uten/med moderatorhjelp, feilnavigasjon, forventet versus faktisk Neste, gjenopptakelse, om konsept/faktisk ble skilt, årsaksforklaring og ukjent-risiko, antall avbrytelser og deltakernes vurdering. Tid registreres deskriptivt; ikke bruk et oppdiktet bestått-tidskrav. Moderatorhint logges som hjelp, aldri som unaided mestring.

**Stoppregel:** tap av gyldig lagring, utilgjengelig påkrevd kontroll eller svarlekkasje stopper oppgaven og blir P0-kandidat som krever konkret reproduksjon. Misforstått hovedflyt uten datatap blir P1-kandidat. Gjennomfør relevante rettinger og retest med friske oppgaver/deltakere; ikke gjenta eksponerte svar som bevis for transfer.

**Beslutning etter pilot:** velg de minste dokumenterte forbedringene. Full eksamensberedskap, psykometri og målt langsiktig læring krever egne studier og skal fortsatt stå uvalidert. P17/P18 krever nytt mandat etter gjennomgått audit og disposisjon av de viktigste P0/P1.
