# Cloud Concepts — funnregister

Ny revisjon 4. november 2026 av produktgrunnlag
`527b95140917e75e83899f21e6b2291e01df0a7d`.
[Metode og dekning](CLOUD_CONCEPTS_INDEPENDENT_REVIEW.md) ·
[Prioritert plan](CLOUD_CONCEPTS_REMEDIATION_PLAN.md).

P1 betyr at forholdet bør avklares/rettes før videre bred utrulling av den berørte
læringsreisen. P2 er et konkret forbedringsbehov som kan følge senere. P3 er en
avgrenset UX-svakhet. Produktfunnene er revisjonens leveranse, ikke implementerte
rettinger eller påstander om tapt historikk. Eventuelle feil i selve rapporten
behandles separat i den avsluttende kvalitetskontrollen.

## CC-01 · P1 · Endret Web-oppgave mister Computing-returen

- **Eierkandidat:** P1-A. Bekreftet for den eldre Portal-utfordringen som fremdeles
  kan åpnes fra dagens Computing-lab, ikke automatisk for alle praktiske laber.
- **Rute/aktivitet:** `computing?topic=resource-bridge&activity=debrief` → «Prøv
  endrede krav uten veiledning» →
  `/portal?area=challenge&module=computing&topic=resource-bridge&mode=independent&course=1`.
- **Observasjon:** Portalens «Tilbake til kurset» peker til
  `/learn/computing?topic=intro-request`. Eleven kommer til første grunnøkt i stedet
  for opprinnelig praktisk kontekst. Dette er den observerte destinasjonen;
  rapporten påstår ikke at akkurat denne returknappen sendte eleven til Services.
  En separat Hub-resume peker derimot til
  `/portal?area=challenge&course=1&module=services&topic=practice`, og bytter synlig
  fagkontekst til Service Types mens samme forsøk fortsetter. Feil kursretur åpnet
  teori, og ved resume var det samme forsøket korrekt merket med registrert hjelp.
  Assistance-beskyttelsen fungerte; det var den uventede undervisningsavstikkeren
  som utløste den.
- **Reproduksjon:** Fullfør den ordinære Web-labben fra Computing med faktisk lokal
  gruppe/plan/app, åpne debrief og den endrede oppgaven, trykk eksplisitt Start og
  bruk kursreturen før innlevering. Gjenta med Back/Forward og reload. Nye postlock
  bevis 018–022 viser inngang, returadresse og faktisk destinasjon.
  Etter nye faktiske Shared/Norway East/North Europe-ressurser ble den allerede
  observerte Computing-URL-en åpnet igjen for å skille fullført retur fra Hub-driften.
  Innlevering oppfylte alle seks kriterier med den registrerte hjelpen beholdt;
  retur gikk fortsatt til første Computing-aktivitet. Back/Forward/reload beholdt
  samme første innlevering (postlock 028–033).
- **Årsak:** `parseLocation` i
  [Portal-modellen](../../src/domain/portal/model.ts) tillater ikke `resource-bridge`
  som topic og normaliserer den til `overview`. Portalens `nativeCourseReturn`
  bruker så `courseHref(computing, overview)`, som faller tilbake til
  `intro-request`. [Course](../../src/features/course/course.tsx) sender det riktige
  topic-navnet inn; feilen oppstår i tolkning/retur, ikke i undervisningens lenketekst.
  Course har dessuten en separat, fast Services/practice-adresse for gjenopptakelse
  av den gamle Portal-utfordringen, observert i postlock 024–025.
- **Konsekvens:** Oppgaven og lagringen kan være intakt samtidig som eleven mister
  arbeidsstedet. Det kan oppleves som om økten er borte. Det foreligger ikke bevis
  for at denne navigasjonen sletter ressurser eller tidligere innleveringer.
- **Anbefaling:** En liten, typesikker/allowlistet returprojeksjon som bevarer
  kanonisk Computing-opprinnelse gjennom challenge, ressursarbeid, retur og resume.
  Skill denne utfordringen fra `practice=paas` og `mission=platform`; de har andre
  opprinnelseskontrakter. Uavklart gammel opprinnelse skal gi ærlig recovery.
- **Historisk datarisiko:** Ikke endre gamle begin/boundary/attempt/submit/aid,
  svar eller rubrics for å reparere en lenke. Ikke gjett en historisk opprinnelse
  som ikke er lagret. Bevar durable assistance før eventuell undervisning vises.
  En aktiv independent kan trenge en nøytral retur-/fortsettstatus før beskyttet
  undervisning; en penere retur må ikke gjøre debrief eller teori til uregistrert hjelp.
- **Akseptanse:** Både delvis og innlevert oppgave returnerer riktig; reload,
  Back/Forward og Hub-resume bevarer forsøk og returkontekst; uregistrert hjelp,
  automatisk ny økt og navigasjonskreditt er utelukket. Feil/ukjent/stale lagring
  håndteres konservativt. Negative kontroller for Services, Benefits og nyere
  praktiske oppdrag må fortsatt returnere riktig.
- **Scope:** Første anbefalte, separate implementeringsleveranse etter eiergjennomgang:
  rett retur/resume for denne konkrete challenge-flyten, uten generell navigasjonsmotor.

## CC-02 · P2 · VM-debrief viser samlet avvik, men svak diagnose

- **Eierkandidat:** P1-B. Den rapporterte UX-svakheten er reprodusert; den er ikke
  påvist som feilaktig teknisk fullføring eller tapt historikk. Prioriteringen må
  skilles fra eierens opprinnelige P1-kandidatetikett.
- **Rute/aktivitet:** Services `iaas&activity=mission&version=2` → guidet
  `mission=infrastructure`, ikke den separate basic `practice=vm`-labben.
- **Observasjon:** En ny Ubuntu/Small/data32/Shared Sandbox-VM fikk en korrekt
  akseptert CreateVmBundle-kvittering. Oppgaven krever Standard. Etter eksplisitt
  inspeksjon av VM, OS-/datadisk, NIC, subnet og receipt samt riktig faglig
  refleksjon var bare «Image, profil, datadisk og subscription følger oppdraget»
  merket Gjenstår. Debriefen skilte dermed teknisk gyldighet fra oppgavekrav,
  men viste ikke hvilket felt som var feil, forventet/faktisk verdi eller en
  tydelig lenke til det aktuelle tekniske beviset. Samme generiske neste-steg-tekst
  anbefalte selvstendig vurdering/endrede krav selv etter dette ufullstendige resultatet.
  Et nytt guidet forsøk med Standard oppfylte alle kriteriene. Reload og historikk
  beholdt begge forsøk; første Small-innlevering ble ikke oppgradert av det nye
  resultatet. Revieweren vurderte derfor svakheten som medium/P2, med fungerende
  ny guidet gjennomføring, ikke som en bekreftet P1-blindvei.
- **Reproduksjon:** Start ny guidet infrastructure-mission, opprett den beskrevne
  VM-en med Small fremfor Standard, velg den, registrer de påkrevde inspeksjonene
  og receipt, lever riktig refleksjon. Postlock 046 viser terminalresultatet.
  Postlock 051/053/055 viser den korrekte andre innleveringen, reload og historikk.
  Ingen ressurs eller fullføring ble fabrikert for å fremprovosere tilstanden.
- **Årsak:** `evaluateMission` i
  [missions-domain](../../src/domain/sandbox/missions.ts) samler fire krav i én
  boolean. [MissionDebrief](../../src/features/course/missions.tsx) viser denne
  sjekklisten og samme `c.next` ved verifiserbar innlevering, uavhengig av
  `result.complete`. Den legger ikke frem feltvis forventet/faktisk konfigurasjon.
- **Konsekvens:** Eleven kan se at noe gjenstår, men må rekonstruere hvilket krav
  som sviktet og hvordan arbeidet bør fortsette. Kvitteringen er ikke feil, og
  systemet påstår ikke at den utilstrekkelige VM-en fullførte oppgaven.
- **Anbefaling:** Vis en kort ressurs-/receipt-oppsummering, deretter relevante
  forventet/faktisk-avvik og en tilstandsbestemt neste handling. Behold fullt
  debrief og skillet mellom teknisk opprettelse, guidet forståelse og independent.
- **Historisk datarisiko:** Ny fremstilling må bruke samme fryste attempt/through
  som original evaluering. Ikke revurder første innlevering mot en senere endret
  VM; ikke la retry overskrive avviket eller utsted ny teknisk receipt fra UI.
- **Akseptanse:** Korrekt og feil profil samt manglende inspeksjon/forklaring gir
  presis diagnose. Ufullstendig resultat anbefaler riktig videre undersøkelse;
  fullført guidet resultat sier hva det bekrefter og ikke bekrefter. Gammel
  innlevering/receipt beholdes etter nytt forsøk, reload og ressursendring.
- **Scope:** Liten, separat read-only feedback-retting. Ingen ny VM-motor,
  completion-regel, rubric eller automatisk ressursendring.

## CC-03 · P1 · IaaS-begrunnelse krever et usagt premiss

- **Eierkandidat:** P1-C. Bekreftet som et premiss-/vurderingsvaliditetsproblem;
  ingen bekreftet feil i teknisk VM-bygging eller tvungen Windows/Linux-utledning.
- **Primærrute:** Bevarte v1 `Independent challenge`,
  `/portal?area=challenge&module=services&topic=overview&mode=independent&course=1`.
  Den samme vurderingen finnes i Computing-flyten beskrevet i CC-01.
- **Observasjon:** Oppgaven spør «Hvilken modell passer OS-avhengig programvare?».
  Premisset sier bare at et annet krav gjelder «OS-avhengig programvare».
  Fasitfeltet er derimot `osModel === 'iaas'`, og feedback omtaler «OS-kontroll».
  En OS-avhengighet innebærer ikke nødvendigvis at kunden må kontrollere gjesten;
  en kompatibel administrert plattform kan støtte den aktuelle avhengigheten.
- **Blind kontroll:** Denne historiske oppgaven var ikke med i den første brede
  blindrapporten. Den ble identifisert etter nøkkelinnsyn. Derfor ble en **ny,
  separat** reviewer gitt bare den elevsynlige ruten. Før fasit låste revieweren
  IaaS som betinget forslag og påpekte nettopp manglende informasjon om gjestekontroll
  og plattformstøtte. Ingen gyldig alternativ plattform ble bygget eller innlevert
  i denne kontrollen; rapporten påstår ikke en observert feilavvisning.
- **Reproduksjon/kilde:** Les brief og dette spørsmålet uten tidligere fasit,
  sammenlign med [elevtekst](../../src/content/nb.ts), challenge-feltene ved linje
  2533/2541, og [historisk evaluator](../../src/domain/portal/learning.ts),
  `evaluateSubmission` ved linje 233. De gamle kriteriene beholdes i denne PR-en.
- **Beslektet, smalere forhold:** Dagens `infrastructure`-oppdrag beskriver en
  «Windows-only, planlagt kontrollprosess» og pålegger eksplisitt VM/disk/NIC.
  Windows/small/data32/App Sandbox stemmer med teknisk rubric. Men begrunnelsen
  hevder behov for «kontroll over gjeste-OS og egne pakker», som ikke følger av
  Windows-only alene. Det er en begrunnelsesglippe i en pålagt VM-oppgave, ikke
  bevis for at den nåværende ordinære Services 3.0.0-vurderingen avviser PaaS.
- **Konsekvens:** Eleven kan lære den uriktige snarveien «OS-avhengig = IaaS» eller
  gjette forfatterens forventning fremfor å vurdere konkrete krav.
  Nøkkelrevieweren vurderte premissproblemet som medium. Samlet P1-prioritering her
  gjelder vurderingsvaliditet i en utfordring som fortsatt åpnes fra den ordinære
  Computing-reisen, ikke en påstått kritisk motorfeil. Denne triagen endrer ikke
  reviewerens låste vurdering og bør inngå i eierens faglige risikovurdering.
- **Anbefaling:** En eksplisitt versjonert etterfølger må enten oppgi nødvendig
  gjestekontroll og dokumentert manglende støtte i den vurderte plattformen, eller
  godta begrunnede alternativer under de oppgitte premissene. En pålagt VM-øvelse
  kan heller spørre hvilket ansvar den valgte VM-en gir, uten å hevde unik nødvendighet.
- **Kildegrense:** [Delt ansvar](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)
  og [compute-valg](https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree)
  underbygger skillet. Dagens
  [App Service](https://learn.microsoft.com/en-us/azure/app-service/overview)
  støtter dessuten enkelte Windows-tilpasninger gjennom Managed Instance under
  bestemte vilkår. «Windows», COM, registry eller MSI er ikke universelt bevis for
  VM-only. Dette dokumenterer ikke at en ukjent driver/prosess faktisk støttes.
- **Historisk datarisiko:** Høy ved stille tekst-/fasitendring. Bevar
  `azurelab.portal.learning.v1` / `portal-transfer@1`, gamle ordlyder, førstesvar,
  assistanse og retry. Hold dette atskilt fra eldre v2
  `azurelab.learning.service-types.v2`, nyere assessment v3 og
  `azurelab.practical-missions.v1` / `guest-control@1`.
- **Akseptanse:** Nytt premiss kan løses blindt uten å låne informasjon fra fasit;
  riktig beslutning krever kompatibel begrunnelse; reelle alternativer aksepteres
  når premissene tillater dem. Gamle replay-/resultatfixturer er uendret. Ingen
  eksisterende Windows/Linux-valg eller førstesvar omklassifiseres.
- **Scope:** Egen liten versjonert retting etter eiergjennomgang. Nyere Services
  3.0.0 og terminal `cc18` skal beholde sine dokumentert gyldige IaaS/PaaS-par.

## CC-04 · P2 · Forklaring gjentas etter modellkjøring

- **Rute/aktivitet:** Computing `v2-responsibility` og `v2-metering`; tilsvarende
  dobbel forklaringsstruktur i Service Types `iaas`/`paas`/`saas`/`selection`.
- **Observasjon:** Etter «Kjør og sammenlign» vises blant annet avsnittene som
  begynner «Med Azure Virtual Machines vedlikeholder kunden normalt
  gjesteoperativsystemet» og «Teamet bruker en administrert webplattform» på nytt.
  De er allerede lest under Azure-forklaring/eksempel. Dokumenthøyden i den
  observerte ansvarstilstanden økte fra 3515 til 4055 CSS-piksler ved 1440×900.
  Dette er et mål på den konkrete siden, ikke læringstid eller kognitiv belastning.
- **Reproduksjon:** Les ansvarssidens Azure-avsnitt og eksempel, kjør
  sammenligningen, og sammenlign teksten under resultatet med teksten over.
  Gjenta med forbruksmodellen. Cold-journey 012–022 bevarer før/etter og tekst.
- **Konsekvens:** Ny modellinformasjon blir vanskeligere å skille fra gjentatt
  manuskript. De seks konsoliderte hovedøktene er fortsatt en hensiktsmessig
  struktur; funnet begrunner ikke å dele dem opp igjen.
- **Anbefaling:** Behold én full forklaring og la resultatdelen forklare det
  parameterendringen faktisk viste. Bevar moteksempler og nødvendige forbehold.
- **Historisk datarisiko:** Lav ved ren presentasjon; høyere dersom montering eller
  modellhandlinger samtidig endres. Gamle topic-ID-er, visit/observasjon og
  rubrics skal være uendret.
- **Akseptanse:** Samme modeller, tall, kilder og kontrolloppgaver; ingen dobbel
  worked example; resultatet kan finnes i korte vinduer; ingen nye besøk eller
  kreditt fra rendering.
- **Scope:** Én senere innholdspresentasjonsretting innen PD-01, med konkret
  før/etter-sammenligning. Ingen generell manuskriptforkorting nå.

## CC-05 · P2 · Intern terminologi i elevens hovedtekst

- **Rute/aktivitet:** Blant annet Services `practice` og praktiske oppdragsinnganger.
- **Observasjon:** Uttrykk som «retained kundeansvar», «post-boundary bundle»,
  «pinned technical attempt» og «gjennom-ID» konkurrerer med oppgavens faglige
  instruks. Kontrolldatoer og «Menneskelig Azure-fagreview gjenstår» gjentas også i
  flere nedre seksjoner. Førsterapportenes ordrette tekstbevis skiller dette fra
  de tilsiktede engelske Azure-tjenestenavnene.
- **Reproduksjon:** Les praktisk oppdragsinstruks, forklaring av teknisk startgrense
  og debrief sammenhengende, uten kildekode eller prosjektkontrakter tilgjengelig.
- **Konsekvens:** Eleven må tolke implementeringsspråk for å forstå hva som skal
  gjøres. Dette er en ekspertvurdering av lesbarhet, ikke målt norsk
  nybegynnerforståelse.
- **Anbefaling:** Bruk for eksempel «kundens gjenværende driftsoppgaver», «ny
  opprettelse etter oppgavestart» og «lagret operasjonshistorikk» i hovedtekst.
  Behold presis intern identitet i tekniske detaljer der den trengs.
- **Historisk datarisiko:** Ren elevtekst kan forbedres uten å endre eventbetydning.
  Premissendringer i vurderinger må derimot versjoneres og behandles separat.
- **Akseptanse:** Oppgaven kan forklares fra elevteksten alene; nødvendige
  begrensninger er synlige; interne ID-er og historiske resultater er bevart.
- **Scope:** Avgrenset norsk terminologi-/lesbarhetspassasje, etter eierprioritering.

## CC-06 · P2 · Gjenkjenning og svake distraktorer i enkelte refleksjoner

- **Rute/aktivitet:** Computing `v2-assessment`, Serverless-vurdering og de tre
  eksisterende uassisterte praktiske VM-/Web-/SaaS-labvariantene.
- **Observasjon:** Konkrete alternativer som «VM-er er uavhengige av maskinvare»,
  «VM er alltid billigst» og «Leverandøren overtar all applikasjonssikkerhet» kan
  avvises uten særlig situasjonsanalyse. I de tre observerte binære praktiske
  refleksjonene var den faglig forsvarlige ansvarsbeskrivelsen først; alternativet
  ga leverandøren åpenbart urimelig totalansvar. SaaS-varianten endrer Mina til Leo,
  men oppgir nesten hele den samme offboarding-handlingslisten.
- **Reproduksjon:** Åpne disse elevsynlige refleksjonene og sammenlign premiss,
  plausible alternativer og guidet handlingsliste. Blindrapporten og studentpakken
  er låst før fasit ble åpnet.
- **Konsekvens:** God støtte for kontroll av grunnbegreper og avgrenset utførelse,
  svakere evidens for selvstendig planlegging under nye krav. Dette er ikke bevis
  for en universell first-option-feil eller at alle nåværende vurderinger er svake.
- **Anbefaling:** Bevar nyttige begrepssjekker, men lag eventuelle etterfølgere med
  plausible delvis riktige alternativer og en faktisk endring i krav/evidens.
  Ikke bare omstokk svarposisjoner.
- **Historisk datarisiko:** Betydelig ved endring av oppgave, fasit eller
  visningskontrakt. Gamle førstesvar/rubrics/assistanse og familieeksponering må
  beholdes; nye varianter krever eksplisitt versjonering.
- **Akseptanse:** Ny blind solve før nøkkel, kompatible beslutnings-/årsakspar,
  plausible distraktorer, bevart gammel replay og negative posisjonstester.
- **Scope:** Senere avgrenset AS-02-oppfølging; ingen generell bankomskriving eller
  P17/P18.

## CC-07 · P2-kandidat · Praksisens forkunnskaper og recovery

- **Rute/aktivitet:** Computing `resource-bridge` → ordinær guidet Web-lab;
  sammenlignet med Services `practice`.
- **Observasjon:** Bridge tilbyr praksis før den dedikerte Service Types-modulen.
  Portalbriefingen ber om kjennskap til PaaS og «retained kundeansvar». En gyldig
  App Sandbox-gruppe med West Europe-metadata ble akseptert teknisk, men guiden
  vendte tilbake til «Finn Resource groups». Services-praksisen oppgir Norway East
  som oppgavekrav for gruppemetadata.
- **Reproduksjon:** Start fra bridge, opprett den teknisk gyldige gruppen med West
  Europe-metadata, og undersøk hva guide/kvittering sier. Cold-journey 037–067/095.
- **Konsekvens:** Gyldig ressurs og oppfylt læringsoppgave kan være forskjellige
  ting, men gjenstående krav forklares svakt. Den første gjennomgangen dokumenterer
  **ikke** en generell progresjonsbug: gruppen oppfylte ikke det senere leste
  oppgavekravet, og alle mellomliggende feltguide-tilstander ble ikke bevart.
- **Anbefaling:** Avklar nødvendig forkunnskap og vis konkret avvik mellom krav og
  faktisk konfigurasjon. Bevar praksis som tilbud; ikke innfør obligatoriske låser.
- **Historisk datarisiko:** Visningsretting er liten risiko; endring av oppgavekrav
  eller gammel lab-fullføring ville endre historisk betydning og er ikke autorisert.
- **Akseptanse:** Ny målrettet test av både riktig og feil metadata før implementering;
  teknisk aksept skilles fra oppgavekrav; trygg retur og ingen automatisk ny økt.
- **Scope:** Egen liten recovery-/forkunnskapsretting dersom årsaken bekreftes.
  Kandidaten skal ikke telles som en bekreftet generell motorfeil.

## CC-08 · P3 · Utvidet Portal-guide dekker kontroller i kort vindu

- **Rute/aktivitet:** Guidet Web-lab, Environment variables ved 1024×500.
- **Observasjon/reproduksjon:** Etter Apply og reload dekker den åpne guiden deler
  av arbeidsområdet og Architecture Explorer-kontrollen. Minimering gjorde den
  tiltenkte kontrollen tilgjengelig; gjenåpning var mulig. Cold-journey 064–065.
- **Konsekvens:** Friksjon i et kort desktop-vindu, ikke dokumentert tap av økt
  eller en Portal som er generelt ubrukelig.
- **Anbefaling:** Prøv en kompakt/dokket tilstand eller tydelig veiledning om
  minimering i denne visningen, uten nytt globalt guideframework.
- **Historisk datarisiko:** Lav for presentasjonspreferanse; ikke berør
  independent-undertrykking, forsøk eller tekniske startgrenser.
- **Akseptanse:** Nødvendige kontroller kan nås med tastatur i 1024×500; guiden kan
  minimeres/gjenåpnes; ingen nye læringshendelser fra visningstilstand.
- **Scope:** Senere liten layoutretting, ikke Stage 2–5 eller nye Portal-tjenester.
