import type { QuestionId } from '../domain/assessment';
import type { CreationError, Region, ScopeKind } from '../domain/simulation';

export const nb = {
  orientation: {
    log: 'Ekspedisjonslogg',
    logHint: 'Hvorfor du er her · hva du gjør · hvor du går videre',
    chapter: 'Lysningen · Fra cloud computing til applikasjonsplattform',
    premise:
      'Et fiktivt applikasjonsteam skal modernisere en liten serverløsning. Her undersøker du valgene før du bygger en simulert plattform sammen med Noor.',
    purpose:
      'Lær å forstå, konfigurere og etter hvert feilsøke cloud-systemer. Lysningen er første stasjon. Det du gjør her er lokalt og simulert; ingen handling oppretter noe i Azure.',
    intro: [
      {
        title: 'Velkommen til AzureLab',
        text: 'Dette er Lysningen, første stasjon i en ekspedisjon gjennom cloud-teknologi. Du skal forstå, konfigurere og etter hvert feilsøke cloud-systemer. Her kan du prøve og ta feil uten å endre ekte infrastruktur.',
      },
      {
        title: 'Møt menneskene. Undersøk systemene.',
        text: 'Ida hjelper deg å forstå cloud computing. Ved installasjonen gjør du eksperimenter og forklarer resultatene. Noor knytter teorien til et applikasjonsteam. Loggen viser neste steg; journalen lar deg vende tilbake til teorien.',
      },
      {
        title: 'Forstå først. Bygg og undersøk etterpå.',
        text: 'Portalen åpner en teknisk arbeidsbenk med ressurser, policy-avslag og hosting-avhengigheter. Kom tilbake for en debrief. Foreløpig er denne stasjonen og én arbeidsbenk spillbare; resten av universet er planlagt.',
      },
    ],
    nextView: 'Se neste del av Lysningen',
    begin: 'Ta kontroll',
    skip: 'Hopp over introduksjonen',
    replay: 'Se ankomsten på nytt',
    introHint: 'Kort orientering · ingen læringspoeng. Du styrer selv når du går videre.',
    takeControl:
      'Gå fritt med WASD eller piltastene. Gå nær en person og trykk E. På berøring bruker du retningsknappene. Kompasset tilbyr assistert gange; loggen hjelper når du er usikker.',
    returning: 'Velkommen tilbake til Lysningen',
    resume: 'Fortsett der det gir mening',
    reorient: 'Finn tråden i ekspedisjonsloggen',
    noHistory:
      'Du har ikke registrert arbeid i RPG-oppdraget, Foundations 01 eller den veiledede arbeidsbenken ennå. Start gjerne hos Ida, eller velg en erfaren inngang i loggen.',
    remembered: 'Sist åpnet læringsenhet:',
    remaining: 'Neste uferdige undersøkelse:',
    technicalResume:
      'Du har påbegynt teknisk arbeid. Arbeidsbenken beholder det gyldige forsøket; du kan gå tilbake og fortsette uten å starte på nytt.',
    technicalBuilt:
      'De seks veiledede funnene i arbeidsbenken er oppfylt. Se hva de viser, og snakk med Noor. Dette er ikke fullført Chapter 01 eller uavhengig kompetanse.',
    foundationsResumeComplete:
      'Alle seks Foundations-undersøkelser er veiledet gjennomført. Følg neste anbefalte mål i loggen, eller gjenbesøk teorien og den separate endrede oppgaven. Veiledet gjennomføring er ikke uavhengig kompetanse.',
    modelsResume:
      'Du har begynt å sammenligne service-modeller. Loggen skiller mellom modellvalg, veiledede svar og teknisk arbeid.',
    metGuideResume:
      'Du har møtt Ida. Du kan fortsette samtalen eller velge Foundations 01 i loggen; møtet i seg selv fullfører ingen læringsmål.',
    metEngineerResume:
      'Du har møtt Noor. Les kravene sammen med ham, eller velg Foundations 01 i loggen. Oppdraget er ikke automatisk mottatt eller utført.',
    serviceResume:
      'Du har mottatt Noor sitt oppdrag. Loggen viser hvilke veiledede deler som faktisk er gjort, og hva du kan undersøke videre.',
    states: {
      available: 'Tilgjengelig',
      'in-progress': 'Påbegynt',
      'guided-completed': 'Veiledet gjennomført',
    },
    steps: {
      welcome: {
        title: 'Møt Ida i Lysningen',
        why: 'Få oversikt over stasjonen og hvorfor teamets valg trenger både teori og praksis.',
        action: 'Snakk med Ida',
        skills: 'Orientering. Samtale og ankomst gir ingen læringsbevis.',
      },
      foundations: {
        title: 'Foundations 01 — forstå cloud computing',
        why: 'Undersøk eierskap, kapasitet, deployment-modeller og forbruk før du velger en plattform.',
        action: 'Undersøk installasjonen med Ida',
        skills:
          'Seks enheter: kapasitet, delt ansvar, public/private/hybrid, plassering, forbruk og prismodeller.',
      },
      service: {
        title: 'Velg driftsansvar — IaaS, PaaS og SaaS',
        why: 'Når du forstår cloud computing, kan du vurdere hvem som drifter OS, runtime, kode og data.',
        action: 'Sammenlign service-modeller ved verkstedet',
        skills:
          'Sammenlign minst to modeller og begrunn teamets valg i de to veiledede spørsmålene.',
      },
      assignment: {
        title: 'Møt Noor og applikasjonsteamets behov',
        why: 'Teamet har egen webkode og vil slippe gjeste-OS. Noor forklarer hva dere skal konfigurere og undersøke.',
        action: 'Snakk med Noor',
        skills:
          'Knytt driftsansvar til et konkret teknisk oppdrag. Aksept er ikke gjennomført arbeid.',
      },
      infrastructure: {
        title: 'Bygg, forutsi og rett i Infrastructure World',
        why: 'Bruk teorien til scope, resource group, lokasjon, policy og App Service-avhengigheter.',
        action: 'Gå til portalen og åpne arbeidsbenken',
        skills:
          'Veiledet simulering. Gyldige kommandoer, avslag og forklaringer lagres og kan gjenopptas.',
      },
      debrief: {
        title: 'Tilbake til Noor — undersøk det du gjorde',
        why: 'Skill mellom hva oppsettet viser, hva du forklarte med hjelp og hva som ennå ikke er vurdert uavhengig.',
        action: 'Snakk med Noor om resultatene',
        skills:
          'Full Chapter 01-transfer og checkpoint er ikke implementert. Debrief gir ingen ny XP.',
      },
    },
    wayfinding: 'Veivisning til målet',
    directions: { forward: 'Fremover', back: 'Bakover', left: 'Mot venstre', right: 'Mot høyre' },
    moduleBrief:
      'Du skal forutsi, endre et avgrenset scenario, kjøre eksperimentet og begrunne resultatet. Hver av de seks enhetene krever bestemte eksperimenter og et veiledet svar. Til slutt viser oppsummeringen hvert læringsmål. Den endrede oppgaven er et separat forsøk, ikke en del av veiledet fullføring. Ingen nye XP gis for modulen.',
    recommended: 'Anbefalt nå',
    selected: 'Valgt mål',
    changeGoal: 'Velg dette målet',
    manual: 'Jeg går dit selv',
    assisted: 'Vis meg veien',
    travelTitle: 'Velg hvordan du går videre',
    travelHint:
      'Målet markeres. Du kan gå selv, eller la figuren følge en trygg gangrute. Piltaster/WASD, stoppknappen eller Escape avbryter assistert gange.',
    routeActive: 'Assistert gange pågår',
    stop: 'Stopp gange',
    routeArrived: 'Fremme ved målet — samhandle når du er klar.',
    goBack: 'Tilbake til utforsking',
    startActivity: 'Åpne aktiviteten her',
    world: 'Hvor er jeg i AzureLab?',
    here: 'Spillbar region',
    supported: 'Spillbar teknisk verden',
    planned: 'Planlagt · ikke spillbart',
    future: [
      {
        title: 'Nettverk og tilkobling',
        ids: 'N01–N04',
        text: 'IP, DNS, filtrering, private forbindelser og trafikkundersøkelser.',
      },
      {
        title: 'Applikasjoner, compute og data',
        ids: 'C01–C04 · D01–D03',
        text: 'VM, containere, integrasjon og data. Bare den avgrensede App Service-arbeidsbenken finnes nå.',
      },
      {
        title: 'Identitet, sikkerhet og governance',
        ids: 'G01–G04 · I01–I03',
        text: 'Tilgang, policy og sikkerhetsgrenser. Nå finnes bare Chapter 01 sitt avgrensede scope/policy-utvalg.',
      },
      {
        title: 'Drift, automasjon og arkitektur',
        ids: 'O01–O03 · A01–A03 · R01–R03',
        text: 'Diagnose, IaC, pålitelighet og faglige arkitekturvalg.',
      },
    ],
    overviewHint:
      'F01–F03 er grunnlaget. De 30 kompetanseområdene kan romme flere moduler og spesialistløp. Ingen fremtidig region er låst opp av XP. Sertifisering er en separat kartlegging.',
    evidence: 'Det som faktisk er registrert',
    units: 'Foundations 01 · undersøkelser',
    objectiveDetail: 'Objektiver og forklaringer',
    notStarted: 'Ikke startet',
    introduced: 'Introdusert · ikke øvd ferdig',
    practiced: 'Eksperimentvilkår prøvd · svar gjenstår',
    independent: 'Første endrede oppgave levert uten registrert hjelp',
    assistedSubmission: 'Endret oppgave levert med registrert hjelp',
    noAssessment: 'Ingen innsendt endret oppgave',
    assessmentActive: 'Uferdig endret oppgave · svarutkast beholdes',
    assessmentLimit:
      'Dette er lokale oppgaveobservasjoner, ikke generell mestring, identitetskontroll eller eksamensklarhet. Åpner du teori eller journal under et aktivt forsøk, registreres hjelp.',
    technicalWorld: 'Infrastructure World',
    technical: 'Chapter 01 · veiledede funn',
    technicalNone: 'Ingen veiledet konfigurasjon er fullført ennå.',
    optional: 'Valgfri fordypning og erfaren inngang',
    journal: 'Les teorien uten å spille samtaler på nytt',
    expert: 'Jeg vil direkte til teknisk arbeid',
    expertHint:
      'Velg portalen som mål. Du kan åpne den tilgjengelige arbeidsbenken uten grunnkurset; dette registrerer ingen forkunnskap eller fullført modul.',
    directEntry: 'Åpne arbeidsbenken uten grunnkurs',
    debriefUnfinished:
      'Arbeidet er ikke ferdig. Fortsett ved portalen når du vil; gyldige kommandoer og observasjoner beholdes.',
    handoff:
      'Du er i Noor sitt veiledede praktiske oppdrag. Her undersøker du scope, lokasjon, policy og hosting. Returner til Lysningen for debrief; denne arbeidsbenken fullfører ikke hele læringsreisen.',
    prefShort: 'Orienteringsvalg: bare i denne økten',
    prefIssue:
      'Orienteringsvalget kunne ikke lagres trygt. Læringslagrene er urørt; du kan fortsette i denne økten.',
    welcomeIda:
      'Velkommen til Lysningen. Jeg er Ida, læringsguiden din. Vi følger et applikasjonsteam fra egne servere til en begrunnet cloud-plattform. Start med Foundations 01 ved installasjonen; så sammenligner vi driftsansvar før Noor gir deg et praktisk oppdrag.',
    returnIda:
      'Vi kan fortsette der du er i læringen. Ekspedisjonsloggen viser de faktiske undersøkelsene og neste anbefalte steg. Vil du fortsette Foundations 01, utforske driftsansvar eller spørre om mekanismen?',
    bridge: 'Se læringsreisen sammen med Ida',
  },
  foundations: {
    title: 'Fra maskinrom til skytjenester',
    module: 'Cloud computing · Foundations 01',
    launch: 'Undersøk cloud computing med Ida',
    journal: 'Kunnskapsjournal',
    journalHint: 'Teknisk referanse. Lesing alene registrerer ikke praktisk forståelse.',
    close: 'Tilbake til der jeg var',
    investigate: 'Undersøk installasjonen',
    next: 'Neste undersøkelse',
    previous: 'Forrige undersøkelse',
    summary: 'Se læringsobservasjoner',
    transfer: 'Prøv et ukjent oppdrag',
    transferIntro:
      'Museet åpner en bookingpilot. Behovet er [1, 1, 9, 1], mens det lokale systemet har fire plasser per periode. Et eldre samlingssystem må beholdes lokalt og integreres med nettfronten. Piloten har ukjent levetid og tåler ikke avbrudd. Besvar hele oppdraget før du får tilbakemelding.',
    transferRules:
      'Første innlevering bevares. Journal eller undervisning under oppdraget registreres som hjelp. Senere forsøk er øving. Oppgaven gir avgrensede observasjoner, ikke bevis på generell kompetanse.',
    submit: 'Lever hele oppdraget',
    retry: 'Nytt øvingsforsøk',
    back: 'Tilbake til undersøkelsen',
    independent: 'Første innlevering uten registrert hjelp i oppgaven',
    assisted: 'Innlevering med hjelp i oppgaven',
    retryResult: 'Gjentakelse · øving etter tilbakemelding',
    aid: 'Hjelp er registrert i dette oppdraget.',
    submitted: 'Innleveringen er lagret. Se begrunnelsen for hvert kriterium.',
    select: 'Velg et svar',
    correct: 'Begrunnet riktig svar',
    incorrect: 'Undersøk begrunnelsen og prøv igjen',
    pending: 'Ikke observert',
    introduced: 'Introdusert',
    practiced: 'Praktisert',
    guided: 'Guidet oppgave løst',
    independentLabel: 'Riktig i første oppgave uten registrert hjelp',
    guidedComplete: 'Alle seks guidede undersøkelser er løst.',
    incomplete: 'Modulen har fortsatt uløste guidede undersøkelser.',
    evidenceHint:
      'Ingen XP eller sertifiseringsberedskap beregnes her. Guidet gjennomføring, uavhengige oppgaveobservasjoner og varig kompetanse er forskjellige ting. Fagperson- og lærerevaluering gjenstår.',
    reviewed:
      'Kilder kontrollert 23. oktober 2026 · Innhold 1.0.0 · Menneskelig Azure-fagreview gjenstår',
    sources: 'Offisielle kilder',
    sourcePublisher: 'Microsoft Learn',
    definition: 'Begreper før du begynner',
    askMechanism: 'Spør Ida: Hvorfor skjer dette?',
    observations: {
      shortfall:
        'Se den ravfargede delen: det er behov som den faste kapasiteten ikke dekker. Mer trafikk oppretter ikke flere maskiner. Vi må velge hvordan kapasiteten skal økes.',
      owned:
        'Her dekker den eide kapasiteten behovet. Betalingen følger den faste kapasiteten, ikke trafikken. Sammenlign samme last i skyen før du konkluderer; ledig kapasitet og driftsantakelsene betyr noe.',
      provisioned:
        'Nå følger kapasiteten den planen du valgte å bestille. Dette er en eksplisitt undervisningsplan, ikke automatisk Azure-skalering. I praksis må oppstart, kvoter og skalering konfigureres og vurderes.',
      retained:
        'Ansvarsplatene viser en administrert plattform. Microsoft håndterer underliggende OS, men kundens data, tilgangsvalg og klienter trenger fortsatt kundens oppfølging.',
      public:
        'Leverandøren tilbyr tjenester til flere kunder. Det gjør ikke kundedata offentlige. Tilgang, isolasjon og riktig konfigurasjon må fortsatt planlegges.',
      private:
        'Denne grensen er avsatt til én organisasjon. Den kan ligge hos tredjepart, men trenger fortsatt en skybasert tjenestemodell og noen som drifter den.',
      hybrid:
        'To miljøer må virke sammen. Forbindelsen her betyr et behov for integrasjon; den beviser ikke at nettverk, identitet eller dataflyt er konfigurert.',
      metered:
        'Ingen nyttig trafikk, men plasser er fortsatt allokert. Måleren teller allokeringen. Det er derfor kostnad og besøkstall ikke trenger å følge hverandre.',
      released:
        'Beregningen er frigitt i modellen, så denne forbruksmåleren er null. Det sier ingenting om lagring, andre ressurser eller en eventuell betalingsforpliktelse.',
      flexible:
        'Forbruksbetaling følger den allokerte bruken. Ved usikker eller kortvarig etterspørsel kan det unngå ubrukt binding, men følg med på samlet kostnad.',
      wasted:
        'Her er deler av forpliktelsen ubrukte, men de betales fortsatt. Sammenlign med forbruksbetaling på samme last. Rabatt på enhetsprisen er ikke det samme som en lavere total.',
      committed:
        'Det jevne grunnforbruket utnytter denne forpliktelsen. Sammenlign likevel samme last uten binding, og kontroller hvilke kostnader og avtalevilkår modellen utelater.',
    },
    roleFeedback: [
      'Leverandøren driver den fysiske verten i denne offentlige administrerte plattformen.',
      'Kunden må bestemme og kontrollere data og tilgang. Fysisk leverandørsikkerhet erstatter ikke dette.',
      'Kundens PC-er og telefoner trenger kundens klientvern også når appen ligger i Azure.',
    ],
    placementFeedback: [
      'Dette korte arrangementet har ikke krav om eget eksklusivt skymiljø. Public cloud er det begrunnede utgangspunktet her.',
      'Kravet er et eksklusivt skymiljø med tilgjengelig driftsteam. Private cloud passer dette avgrensede kravsettet.',
      'Den beholdte lokale tjenesten og den integrerte skyfronten danner et hybridmiljø. En strek alene utfører ikke integrasjonsarbeidet.',
    ],
    purpose: 'Hvorfor dette finnes',
    mechanism: 'Slik virker det',
    azure: 'I Azure',
    example: 'Gjennomarbeidet eksempel',
    misconception: 'Misforståelse og moteksempel',
    limits: 'Modellens grenser',
    detail: 'Åpne hele forklaringen i journalen',
    run: 'Kjør og sammenlign',
    predict: 'Forutsi udekket behov før kjøring',
    predictionRecorded: 'Første registrerte forutsigelse',
    predictionHint:
      'Forutsigelsen beholdes også når den er feil. Resultatet kan undersøkes og forklares etterpå.',
    check: 'Begrunn observasjonen',
    needProbe: 'Utfør de viste sammenligningene før den guidede oppgaven kan godkjennes.',
    practiceRequirements: {
      capacity:
        'Kjør begge lastene med begge kapasitetsvalg: kampanje og jevn last, eid og eksplisitt skybestilling. Sammenlign fire resultater.',
      responsibility:
        'Kjør ansvarssammenligningen. Fordel deretter fysisk drift, data/tilgang og klientbeskyttelse.',
      models: 'Vis alle tre miljømodellene og undersøk grensen mellom dem.',
      placement: 'Undersøk topologien og velg miljø for hvert av de tre kravsettene.',
      metering: 'Kjør både inaktiv, allokert kapasitet og frigitt kapasitet. Sammenlign måleren.',
      pricing:
        'Kjør både jevn og usikker last med begge prismodeller. Sammenlign fire resultater og se hva ubrukt forpliktelse betyr.',
    },
    assumptions:
      'Undervisningsmodell: fire like perioder, én plass per behovsenhet. Eiet: 4 × kapasitet + 12. Sky: 2 × allokerte plasser. Forpliktelse: 24 + 2 × plasser over seks. Tallene er oppdiktede undervisningsenheter, ikke kroner eller Azure-priser. Ingen automatisk Azure-skalering simuleres.',
    assumptionTitle: 'Se modellantakelser og avgrensninger',
    synthetic:
      'Oppdiktede undervisningsenheter · ikke Azure-priser. Fire like perioder; ingen virkelig skalering eller deployering.',
    exclusions:
      'Lagring, overføring, lisenser, skatt, migrering, personalkostnader, kvoter, oppstartstid og virkelig fakturering er utelatt. Resultatene er ikke en fullstendig totalkostnadsvurdering.',
    profile: 'Etterspørsel',
    profiles: {
      campaign: 'Kampanje · 2 / 2 / 10 / 2',
      steady: 'Jevn · 6 / 6 / 6 / 6',
      uncertain: 'Usikker · 0 / 0 / 0 / 4',
      idle: 'Ingen nyttig trafikk · 0 / 0 / 0 / 0',
    },
    operation: 'Kapasitetsvalg',
    owned: 'Eid, fast kapasitet',
    cloud: 'Bestill kapasitet per periode',
    fixed: 'Fast kapasitet',
    billing: 'Undervisningens prismodell',
    unusedCommitment: 'Ubrukt forpliktelse · plassperioder',
    overflow: 'Bruk over forpliktelsen · plassperioder',
    usage: 'Betal for allokerte plasser',
    commitment: 'Betal en seks-plassers forpliktelse',
    released: 'Frigi all beregningskapasitet',
    demand: 'Behov',
    allocated: 'Allokert',
    served: 'Betjent',
    shortage: 'Udekket behov',
    idle: 'Ledig kapasitet',
    cost: 'Undervisningsenheter',
    period: 'Periode',
    topology: 'Miljømodell',
    public: 'Public cloud',
    private: 'Private cloud',
    hybrid: 'Hybrid cloud',
    localBoundary: 'Organisasjonens miljø',
    providerBoundary: 'Leverandørens tjenesteplattform',
    integration: 'Krever planlagt integrasjon',
    responsibilityTasks: [
      'Drift av fysisk vert',
      'Data og tilgangsvalg',
      'Beskyttelse av kundens klienter',
    ],
    customer: 'Kunden',
    provider: 'Leverandøren',
    placements: [
      'Midlertidig offentlig arrangement uten eksklusivitetskrav',
      'Eksklusivt skymiljø med eget driftsteam',
      'Nettfront som må integreres med beholdt lokalt system',
    ],
    reset: 'Nullstill bare denne modulen',
    resetQuestion:
      'Slette modulens undersøkelser og innleveringer? Eksisterende ekspedisjon, teknisk arbeid og XP beholdes.',
    confirmReset: 'Ja, slett moduldata',
    issue: {
      corrupt:
        'Moduldata kunne ikke valideres og er satt til side. Ingen fullføring er gjenopprettet.',
      unsupported: 'Denne lagrede innholdsversjonen støttes ikke. Ingen resultater er migrert.',
      unsaved:
        'Modulen fortsetter i minnet. Lagring er ikke bekreftet; en reload kan miste nye observasjoner.',
      conflict:
        'En annen fane endret moduldata. Nye lagringer er stoppet for å unngå overskriving.',
      limit: 'Grensen på 500 observasjoner er nådd. Beholdt historikk er ikke slettet.',
    },
    reloadSave: 'Les lagrede moduldata på nytt',
    objectives: {
      FC01: 'Forklare cloud computing',
      FC02: 'Skille eierskap, behov og kapasitet',
      FC03: 'Fordele ansvar',
      FC04: 'Skille public, private og hybrid',
      FC05: 'Velge miljø fra krav',
      FC06: 'Forklare forbruksmåleren',
      FC07: 'Sammenligne prismodeller og binding',
    },
    units: {
      capacity: {
        title: 'Fra maskinrom til tjenester',
        spoken:
          'Seks plasser i maskinrommet. Ti bestillinger på toppen. Se hva som faktisk mangler, og hva som står ledig. Sky endrer bestillingsmåten; den fjerner ikke de fysiske maskinene.',
        terms: [
          ['Server', 'En datamaskin eller avgrenset virtuell maskin som leverer arbeid til andre.'],
          ['Kapasitet', 'Hvor mye arbeid systemet kan håndtere i et tidsrom.'],
          ['Etterspørsel', 'Arbeidet brukerne ber systemet utføre.'],
          ['Virtualisering', 'Teknikk som deler fysisk kapasitet i avgrensede virtuelle miljøer.'],
        ],
        purpose:
          'En applikasjon er programvaren brukeren møter. Den trenger prosessorkraft, minne, lagring og nettverk. Cloud computing tilbyr slike IT-ressurser som tjenester gjennom nettverk, med bestilling og administrasjon via programvare. En nettside er ikke en skyplattform bare fordi den kan nås på internett.',
        mechanism:
          'I et eget maskinrom må noen planlegge, kjøpe, installere og drifte maskiner før ekstra kapasitet er tilgjengelig. For lite kapasitet kan gi kø eller avvisning. For mye binder penger i ledige ressurser. En leverandør har en større fysisk infrastruktur og tilbyr avgrensede ressurser gjennom en kontrollflate. Virtualisering kan dele kapasiteten mellom isolerte miljøer. Kunden bestiller en støttet konfigurasjon; maskinene finnes fortsatt. Kvoter, tilgjengelig kapasitet og oppstartstid setter grenser.',
        azure:
          'Azure tilbyr blant annet virtuelle maskiner, lagring og administrerte applikasjonstjenester. Kunden trenger ikke montere den fysiske serveren for å be om en ressurs. Det betyr verken at appen automatisk skalerer eller at en vellykket konfigurasjon beviser at applikasjonen virker. Vår installasjon viser en eksplisitt bestillingsplan, ikke en virkelig Azure-deployering.',
        example:
          'Kampanjen trenger [2, 2, 10, 2] plasser. Seks faste plasser gir fire udekkede behov i toppen. Ti faste plasser dekker toppen, men står mye ledig ellers. Bestilling etter behov gir 16 allokerte plassperioder mot 24 for seks faste plasser. Ved jevn last er eid kapasitet derimot rimeligere i våre antakelser: 36 mot 48 undervisningsenheter. Dette er et moteksempel til at offentlig sky alltid er billigst.',
        misconception:
          'Internettforbindelse alene gjør ikke en tradisjonell server til cloud computing. Det sentrale her er hvordan kapasitet tilbys og forvaltes som tjeneste. Skykapasitet er heller ikke uendelig eller automatisk tilpasset applikasjonen. Autoskalering krever støttede funksjoner og riktig konfigurasjon.',
        limits:
          'Plassene er kapasitetsenheter, ikke VM-er, CPU-kjerner eller Azure-SKU-er. Ingen kølengde, responstid, oppstart, feil eller reell fakturering beregnes.',
        question:
          'Hva skiller den viste skytjenesten fra bare å koble en eid server til internett?',
        answers: {
          provisioning: 'Ressurser fra en leverandørplattform bestilles og forvaltes som tjenester',
          internet: 'Det holder at serveren har internett',
          'no-hardware': 'Det finnes ikke fysiske maskiner i skyen',
        },
        feedback: {
          provisioning:
            'Riktig begrunnelse: bestillings- og driftsmodellen endres. Maskinvaren finnes fortsatt, og kapasitet må bestilles innenfor tjenestens grenser.',
          internet:
            'Nettverk gir tilgang, men sier ikke hvordan ressurser tilbys, isoleres eller bestilles. En tradisjonell server kan ha internett uten en skybasert tjenestemodell.',
          'no-hardware':
            'Skyen kjører på fysiske maskiner. Leverandøren driver dem; kunden bestiller avgrensede ressurser gjennom en tjeneste.',
        },
      },
      responsibility: {
        title: 'Hvem gjør arbeidet?',
        spoken:
          'Leverandøren kan drifte maskinene. Det bestemmer ikke hvem som får se kundedataene dine. Fordel tre oppgaver for en administrert applikasjon, og følg ansvarsgrensen.',
        terms: [
          [
            'Operativsystem',
            'Programvaren som forvalter maskinens ressurser og kjører programmer.',
          ],
          ['Identitet', 'En representasjon av en bruker eller arbeidslast.'],
          [
            'Administrert tjeneste',
            'Leverandøren drifter avtalte plattformdeler, mens kunden fortsatt styrer det tjenesten overlater til kunden.',
          ],
          [
            'IaaS / PaaS / SaaS',
            'Infrastructure, Platform og Software as a Service: infrastruktur, plattform og ferdig programvare som tjenester. Ansvarsgrensene undersøkes videre i det eksisterende serviceverkstedet.',
          ],
          ['Tilgangsstyring', 'Regler som avgjør hva en identitet får gjøre.'],
          [
            'Endepunkt',
            'Her: en klient-PC eller telefon som bruker tjenesten. Ikke et nettverksendepunkt i Azure.',
          ],
        ],
        purpose:
          'Ansvar betyr hvem som må konfigurere, vedlikeholde og kontrollere en oppgave. I eget maskinrom dekker virksomheten hele stakken, selv om kontraktører kan utføre arbeid. I offentlig sky drifter leverandøren den fysiske plattformen. Kunden må fortsatt beskytte data, identiteter, tilgangsvalg og det kunden selv kontrollerer.',
        mechanism:
          'Ansvarsgrensen følger den konkrete tjenesten og kontrollen. Når leverandøren håndterer fysisk sikkerhet, strøm og vertsdrift, kan kunden fortsatt velge en feil delingsregel eller sårbar kode. Leverandørens sikring av datasenteret retter ikke disse valgene. Klientene som kobler seg til tjenesten trenger også beskyttelse. Ansvar kan være delt; det er ikke ett enkelt spørsmål om hvem som har ansvar for all sikkerhet.',
        azure:
          'Med Azure Virtual Machines vedlikeholder kunden normalt gjesteoperativsystemet. Med en passende App Service-plattform håndterer Microsoft underliggende OS og plattform. Kundens kode, data, innstillinger og tilgang må fortsatt forvaltes. Egne containerinnhold trenger fortsatt vedlikehold. Kundens PC-er og telefoner blir ikke driftet av Microsoft bare fordi appen flyttes til Azure.',
        example:
          'Teamet bruker en administrert webplattform. En fysisk disk må erstattes: leverandøren håndterer verten. En ansatt slutter: kunden må fjerne riktig tilgang. En bærbar PC blir stjålet: organisasjonen må ha egnede klient- og tilgangskontroller. Tre hendelser har ulike ansvar selv om de berører samme applikasjon.',
        misconception:
          'PaaS betyr ikke at alle sikkerhetsoppgaver overføres. En generell matrise er veiledning, ikke juridisk garanti eller en fullstendig liste over kontroller. Se tjenestens spesifikke vilkår og det kunden faktisk kan konfigurere.',
        limits:
          'Installasjonen viser utvalgte ansvarsområder. Den konfigurerer ikke klientvern, autentisering, kryptering eller samsvar. IaaS/PaaS/SaaS-verkstedet er en tilknyttet videre undersøkelse.',
        question: 'Fordel ansvar for den administrerte offentlige webplattformen.',
        answers: {},
        feedback: {
          correct:
            'Fysisk vert ligger hos leverandøren. Data/tilgang og kundens klienter krever fortsatt kundens arbeid.',
          wrong:
            'Skill drift av leverandørens vert fra kontrollene kunden eier: data, tilgangsvalg og klientbeskyttelse blir ikke automatisk ivaretatt av plattformen.',
        },
      },
      models: {
        title: 'Hvor og for hvem?',
        spoken:
          'Miljømodell og tjenestemodell svarer på ulike spørsmål. Se hvordan public, private og hybrid endrer grensene. Et dedikert miljø kan være private cloud også utenfor eget bygg.',
        terms: [
          ['Public cloud', 'Tjenester som en skyleverandør tilbyr til flere kunder.'],
          ['Private cloud', 'Et skymiljø brukt eksklusivt av én organisasjon.'],
          [
            'Hybrid cloud',
            'Et sammenkoblet miljø som kombinerer offentlig sky med private eller lokale miljøer.',
          ],
          ['Multicloud', 'Bruk av flere offentlige skyleverandører.'],
        ],
        purpose:
          'Public, private og hybrid beskriver hvordan skymiljøer tilbys og kombineres. IaaS, PaaS og SaaS beskriver tjenestetype og ansvarsgrense. Spørsmålene er forskjellige. En private cloud trenger ikke stå i eget bygg; en tredjepart kan drifte et dedikert miljø for organisasjonen.',
        mechanism:
          'Public cloud tilbyr tjenester fra en leverandørstyrt plattform til flere kunder. Delt fysisk infrastruktur betyr ikke offentlig tilgjengelige kundedata: isolasjon, identitet og tilgangskontroll må fortsatt utformes. Private cloud tilbyr skyegenskaper innenfor én organisasjons eksklusive miljø og krever kapasitet og driftskompetanse. Hybrid krever en planlagt sammenkobling, eksempelvis dataflyt og identitet mellom lokal drift og offentlig sky. To tilfeldige apper på forskjellige steder er ikke en ferdig hybridarkitektur.',
        azure:
          'Azure kan brukes til nettfronten mens et eldre lokalt system beholdes og integreres. Nettverk, identitet, dataflyt og feilgrenser må planlegges. Azure Arc er et eksempel på forvaltning på tvers av miljøer; det flytter ikke automatisk arbeidslasten og gjør ikke alle Azure-tjenester lokale. Multicloud beskriver flere offentlige leverandører, ikke nødvendigvis hybrid.',
        example:
          'En tredjepart drifter en eksklusiv selvbetjent skyplattform for en enkelt organisasjon. Den kan være private cloud selv om serverne står hos tredjeparten. Hvis organisasjonen også integrerer dette miljøet med Azure, oppstår et hybridmiljø. Tjenestevalget kan samtidig være IaaS eller en administrert plattform.',
        misconception:
          'Et låst serverrom er ikke automatisk private cloud. Eksklusivitet alene beskriver hvem som bruker miljøet; skyegenskaper som tjenestebasert bestilling må også vurderes. Public cloud betyr ikke at data må være offentlige.',
        limits:
          'Grensefiguren viser begreper og en nødvendig integrasjon, ikke en ferdig nettverksforbindelse eller sikkerhetsgaranti.',
        question:
          'En tredjepart drifter en eksklusiv selvbetjent skyplattform for én organisasjon. Hvilken miljømodell passer?',
        answers: {
          private: 'Private cloud, selv om den står hos tredjepart',
          public: 'All drift hos tredjepart er public cloud',
          'building-only': 'Private cloud krever organisasjonens eget bygg',
        },
        feedback: {
          private:
            'Ja. Eksklusiv bruk og skyens driftsmodell er avgjørende. Adressen til datasenteret er ikke definisjonen.',
          public:
            'Tredjepartsdrift avgjør ikke alene. Et eksklusivt skymiljø for én organisasjon kan fortsatt være private cloud.',
          'building-only':
            'Private cloud kan driftes utenfor eget bygg. Eierskap, eksklusivitet og tjenestemodell må skilles fra fysisk adresse.',
        },
      },
      placement: {
        title: 'Krav før preferanser',
        spoken:
          'Velg ikke miljø etter hvilket som høres mest moderne ut. Sammenlign tre konkrete krav. Hvilket valg løser problemet, og hvilket ekstra arbeid følger med?',
        terms: [
          [
            'Arbeidslast',
            'Applikasjonen, dataene og avhengighetene som sammen leverer en funksjon.',
          ],
          [
            'Integrasjon',
            'En planlagt måte systemer utveksler data eller samordner funksjoner på.',
          ],
          ['Eksklusivitet', 'At miljøet er avsatt til én organisasjon.'],
        ],
        purpose:
          'Start med krav: hva må kontrolleres, hvilke data kan flyttes, hvor mye varierer lasten og hvilken drift kan teamet håndtere? Miljøvalget skal møte disse kravene. Ingen modell er universelt best, billigst eller sikrest.',
        mechanism:
          'Public cloud gir tilgang til tjenester uten eget fysisk innkjøp, men krever koststyring og sikker konfigurasjon. Private cloud kan passe et dokumentert krav om eksklusivt miljø når organisasjonen har driftskompetanse. Hybrid kan støtte en trinnvis overgang eller et system som må bli lokalt, men legger til integrasjon, identitetsarbeid og flere feilkilder. Et diagram med en strek gjør ikke dette arbeidet ferdig.',
        azure:
          'En midlertidig nettfront i Azure kan bruke leverandørens tjenester. Hvis fronten trenger et lokalt produksjonssystem, må dataflyt, forbindelser og tilgang vurderes. Azure tilbyr også dedikerte løsninger; øvelsens valg må derfor ikke tolkes som at offentlig sky aldri kan tilby dedikert maskinvare.',
        example:
          'Et kort offentlig arrangement uten eksklusivitetskrav peker mot public cloud. Et uttrykkelig eksklusivt skymiljø med eget driftsteam peker mot private cloud. En nettfront som må integreres med et beholdt lokalt system peker mot hybrid. Hvis det lokale systemet senere avvikles, bør hybridbehovet vurderes på nytt.',
        misconception:
          'Hybrid er ikke automatisk sikrere, og private cloud er ikke automatisk et samsvarsbevis. Et privat miljø uten riktig kontroll kan fortsatt lekke data. Public cloud kan være et godt valg uten at det fritar kunden for ansvar.',
        limits:
          'Dette er avgrensede best-fit-situasjoner. Øvelsen erstatter ikke juridisk vurdering, dataklassifisering, nettverksdesign, anskaffelsesprosess eller kostanalyse.',
        question: 'Knytt hvert kravsett til et begrunnet miljøvalg.',
        answers: {},
        feedback: {
          correct:
            'Valgene følger kravene: midlertidig offentlig tjeneste → public; eksklusivt skymiljø → private; beholdt lokalt system med integrert nettfront → hybrid.',
          wrong:
            'Se hvilket krav som mangler dekning: et kort arrangement krever ikke eget eksklusivt driftssystem; eksklusiv skybruk er private i dette eksemplet; beholdt lokal drift pluss integrert skyfront krever hybrid.',
        },
      },
      metering: {
        title: 'Forbruk er ikke trafikk',
        spoken:
          'Null besøkende, men seks allokerte plasser. Hvorfor går måleren fortsatt? Frigi kapasiteten og sammenlign. Det er forskjell på nyttig arbeid og det tjenesten fakturerer.',
        terms: [
          [
            'Måleenhet',
            'Størrelsen som faktureringen teller, for eksempel kapasitetstid eller lagrede data.',
          ],
          ['Allokere', 'Sette av en ressurs til bruk.'],
          ['CapEx', 'Investering, eksempelvis kjøp av maskiner.'],
          ['OpEx', 'Løpende drift, eksempelvis betaling for tjenesteforbruk.'],
        ],
        purpose:
          'Forbruksbasert betaling knytter kostnad til målt bruk over tid. Måleren kan telle kapasitetstimer, lagring, forespørsler eller overføring. Kundens nyttige arbeid er ikke nødvendigvis den fakturerte enheten. Dermed kan lav trafikk og kostnader eksistere samtidig.',
        mechanism:
          'En allokert VM kan bruke fakturerbar beregningskapasitet uten besøkende. Å stoppe en prosess er ikke det samme som å frigi ressursen. Andre deler, som lagring, kan fortsette å koste selv etter at beregning er frigitt. Kostnadsstyring krever både forståelse av måleren og riktig livssyklus for hver ressurs.',
        azure:
          'Azure-tjenester har ulike målere og regler for stopp og frigjøring. Sjekk tjenestespesifikk dokumentasjon før reelle valg. Budsjettvarsler stopper ikke automatisk forbruk. CapEx/OpEx forklarer kostnadsstruktur på grunnnivå, men er ikke regnskapsråd: avtaler og regler må vurderes konkret.',
        example:
          'I fire perioder er behovet null, men seks skyplasser står allokert. Vår beregningsmåler teller 24 plassperioder og gir 48 undervisningsenheter. Ved eksplisitt frigjøring blir denne beregningsmåleren null. Ingen av resultatene sier at lagring, nettverk eller alle fakturalinjer er gratis.',
        misconception:
          '«Betal for det du bruker» betyr ikke alltid «betal bare når en sluttbruker besøker appen». Det avhenger av hva tjenesten måler. En inaktiv ressurs kan fortsatt være bestilt og fakturerbar.',
        limits:
          'Bare undervisningens kapasitet regnes. Dette er ikke en Azure-faktura, kostnadsestimator eller automatisk oppryddingsoperasjon.',
        question: 'Hvorfor ga null trafikk fortsatt utslag på beregningsmåleren før frigjøring?',
        answers: {
          allocated: 'Kapasitet var fortsatt allokert; måleren teller plassperioder',
          traffic: 'Skyen tar alltid bare betalt for besøkende',
          'everything-free': 'Frigjort beregning betyr at alle andre tjenester også er gratis',
        },
        feedback: {
          allocated:
            'Riktig. Den viste måleren teller allokering, ikke besøk. Etter frigjøring er denne beregningsdelen null; andre kostnader er ikke vurdert.',
          traffic:
            'Måleenheten varierer. Her telles allokerte plasser over tid. Seks inaktive plasser er fortsatt satt av.',
          'everything-free':
            'Vi frigir bare beregningskapasiteten i denne modellen. Lagring og andre målere kan fortsette å gi kostnad i en virkelig løsning.',
        },
      },
      pricing: {
        title: 'Fleksibilitet har vilkår',
        spoken:
          'En lavere enhetspris kan kreve en forpliktelse. Sammenlign jevn og usikker last før du velger. En faktureringsrabatt er ikke det samme som ny kapasitet.',
        terms: [
          [
            'Pay-as-you-go',
            'Betaling for kvalifisert bruk uten den langsiktige forpliktelsen i eksemplet.',
          ],
          ['Forpliktelse', 'Avtale om betaling eller kvalifisert ressursbruk over en periode.'],
          ['Spot', 'Prisalternativ for ledig kapasitet som leverandøren kan ta tilbake.'],
          [
            'Totalkostnad',
            'Alle relevante kostnader gjennom løsningens levetid, ikke bare én prislinje.',
          ],
        ],
        purpose:
          'Pay-as-you-go gir fleksibilitet når behovet er usikkert, men ikke nødvendigvis lavest enhetspris. En forpliktelse kan gi rabatt mot risikoen for å betale for noe som ikke brukes. Valget avhenger av stabilitet, varighet, vilkår og avbruddstoleranse.',
        mechanism:
          'Reservations gjelder samsvarende ressursbruk. Savings plans knytter rabatt til en avtalt timebasert pengeforpliktelse for kvalifisert bruk. Tilbudene har egne regler og endrer ikke i seg selv ressursens kjøretid eller oppretter kapasitet. Ubrukt forpliktelse kan være bortkastet betaling. Spot kan passe arbeid som kan starte på nytt når kapasitet tas tilbake; lav pris alene gjør det ikke egnet for avbruddskritisk arbeid.',
        azure:
          'Azure har disse ulike faktureringstilbudene med bestemte produkt- og matchingsregler. Kontroller aktuelle vilkår, støttede tjenester og målt forbruk før en faktisk forpliktelse. Undervisningens seks-plassers avtale er bare en illustrasjon av binding, ikke en modell av et bestemt Azure-tilbud eller en prisgaranti.',
        example:
          'Jevn last bruker seks plasser i alle fire perioder: hypotetisk forpliktelse 24 mot forbruksbetaling 48. Usikker last [0, 0, 0, 4] gir derimot forpliktelse 24 mot forbruksbetaling 8. Eide seks plasser gir 36 ved jevn last i den andre sammenligningen. Resultatet favoriserer altså ikke alltid samme alternativ.',
        misconception:
          'En reservation-rabatt er ikke en bestilling som automatisk oppretter eller skalerer servere. «Sky er alltid billigere» og «rabatt er alltid billigere» ignorerer utnyttelse, binding og utelatte kostnader. Spot er ikke en gratis rabatt uten operasjonell risiko.',
        limits:
          'Ingen virkelig Azure-pris, rabattprosent, valuta, kontraktslengde eller TCO beregnes. Fire undervisningsperioder er ikke fire Azure-faktureringsperioder.',
        question:
          'En kort kampanje har ukjent levetid og tåler ikke at kapasitet tas tilbake. Hva unngår både fast forpliktelse og Spot-avbrudd i dette eksemplet?',
        answers: {
          usage: 'Pay-as-you-go, med oppfølging av faktisk forbruk',
          commitment: 'En stor forpliktelse uansett fremtidig bruk',
          spot: 'Spot uten hensyn til avbrudd',
        },
        feedback: {
          usage:
            'Dette passer de oppgitte kravene. Fleksibiliteten unngår en fast ubrukt forpliktelse; forbruket må fortsatt måles og styres.',
          commitment:
            'Forpliktelsen betales selv når behovet faller bort. Undersøk stabilt kvalifisert grunnforbruk før du binder deg.',
          spot: 'Spot-kapasitet kan tas tilbake. Arbeid som ikke tåler avbrudd må ikke velges bare på grunn av lav enhetspris.',
        },
      },
    },
    transferItems: [
      {
        id: 'service',
        question: 'Hva gjør pilotens kapasitet til en skytjeneste?',
        choices: [
          ['provisioning', 'Leverandørressurser tilbys og bestilles som tjenester'],
          ['internet', 'Det finnes en internettkabel'],
          ['no-hardware', 'Det finnes ingen maskinvare'],
        ],
        explanation:
          'Bestillings- og driftsmodellen er forskjellen. Internett alene er ikke nok; maskinvare finnes fortsatt.',
      },
      {
        id: 'shortfall',
        question: 'Hvor mange behovsenheter mangler de fire faste plassene i periodens topp på ni?',
        choices: [
          ['0', '0'],
          ['4', '4'],
          ['5', '5'],
          ['9', '9'],
        ],
        explanation:
          'Ni behov minus fire plasser gir fem udekkede behovsenheter i toppen. Det er verken samlet etterspørsel eller ledig kapasitet.',
      },
      {
        id: 'duties',
        question:
          'Hvem må fortsatt forvalte kundens data, tilgangsvalg og klientbeskyttelse når leverandøren drifter verten?',
        choices: [
          ['customer', 'Kunden'],
          ['provider', 'Leverandøren overtar alle disse oppgavene'],
        ],
        explanation:
          'Leverandørens vertsdrift overtar ikke kundens data-, tilgangs- eller klientkontroller.',
      },
      {
        id: 'exclusive',
        question:
          'Et eksklusivt selvbetjent skymiljø for museet står hos tredjepart. Hvilken modell beskriver det?',
        choices: [
          ['public', 'Public cloud'],
          ['private', 'Private cloud'],
          ['hybrid', 'Hybrid bare fordi adressen er ekstern'],
        ],
        explanation:
          'Eksklusivt skymiljø for én organisasjon kan være private cloud hos tredjepart. Ekstern adresse beviser ikke public eller hybrid.',
      },
      {
        id: 'integration',
        question:
          'Nettfronten i offentlig sky må integreres med samlingssystemet som beholdes lokalt. Hva beskriver helheten?',
        choices: [
          ['public', 'Bare public cloud'],
          ['private', 'Bare private cloud'],
          ['hybrid', 'Hybrid, med reelt integrasjonsarbeid'],
        ],
        explanation:
          'Kombinasjonen av offentlig sky og integrert beholdt lokalt miljø er hybrid. Nettverk, identitet og dataflyt må planlegges.',
      },
      {
        id: 'idle',
        question:
          'Piloten har ingen besøkende i natt, men beregningsressursen er fortsatt allokert. Hvorfor kan beregningskostnaden fortsette?',
        choices: [
          ['traffic', 'All sky faktureres bare per besøkende'],
          ['allocated', 'Måleren kan telle allokert kapasitet over tid'],
        ],
        explanation:
          'Null nyttig trafikk betyr ikke null allokering. Den relevante tjenestens måleenhet avgjør hva som faktureres.',
      },
      {
        id: 'uncertain',
        question:
          'Ukjent levetid og ingen toleranse for tilbakekalt kapasitet: hvilket utgangspunkt passer?',
        choices: [
          ['commitment', 'Bind stor kapasitet uten bruksdata'],
          ['usage', 'Pay-as-you-go og følg forbruket'],
          ['spot', 'Spot selv om avbrudd ikke tåles'],
        ],
        explanation:
          'Forbruksbetaling unngår den faste forpliktelsen. Spot kan avbrytes; binding krever bedre grunnlag i stabil bruk.',
      },
      {
        id: 'commitment',
        question: 'Hva må museet forstå før det bruker installasjonens forpliktelsestall?',
        choices: [
          ['free', 'Ubrukt forpliktelse er gratis og tallene er Azure-priser'],
          ['paid', 'Ubrukt forpliktelse kan betales; tallene er bare undervisningsantakelser'],
        ],
        explanation:
          'Binding kan koste uten nyttig bruk. Våre enheter er ikke priser, valuta eller et konkret Azure-tilbud.',
      },
    ],
  },
  brand: 'AzureLab',
  rpg: {
    title: 'Lysningen',
    subtitle: 'AZURELAB / EKSPEDISJON G1',
    region: 'KYSTSTASJON 01',
    returnToWorld: 'Tilbake til 3D-ekspedisjonen',
    exit: 'Til sammenligningsreisen',
    loading: 'Klargjør stasjonen og figurene …',
    loadHint: 'Lokale, lisensierte modeller. Ingen Azure-tilkobling.',
    welcome: 'Velkommen til Lysningen',
    welcomeText:
      'Følg stien. Møt Ida ved ankomstplassen, undersøk ansvarsverkstedet og finn ingeniør Noor ved porten.',
    begin: 'Ta kontroll',
    controls: 'WASD / piltaster · E for samhandling · Esc for å stoppe',
    moveArea: 'Spillflate. Bruk WASD eller piltaster for å gå. E åpner nærmeste samhandling.',
    move: 'Bevegelse',
    forward: 'Gå fremover',
    back: 'Gå bakover',
    left: 'Gå mot venstre',
    right: 'Gå mot høyre',
    stop: 'Stopp bevegelsen',
    interact: 'Samhandle',
    approach: 'Gå nærmere en person eller installasjon',
    places: {
      guide: 'Ida · skyguide',
      installation: 'Ansvarsverkstedet',
      engineer: 'Noor · plattformingeniør',
      portal: 'Infrastrukturporten',
    },
    speakers: { guide: 'Ida', engineer: 'Noor', system: 'Infrastrukturporten' },
    roles: { guide: 'SKYGUIDE', engineer: 'PLATTFORMINGENIØR', system: 'TEKNISK TRENINGSVERDEN' },
    talk: 'Snakk med',
    use: 'Undersøk',
    distance: 'm unna',
    navigate: 'Orientering og tilgjengelig navigasjon',
    navigateHint:
      'Velg et sted for å gå dit langs stien. Du kan avbryte med en bevegelsestast eller Esc.',
    walkTo: 'Gå til',
    semantic: 'Bruk tekstbasert spillalternativ',
    spatial: 'Tilbake til 3D-verdenen',
    alternative: 'Samtaler og oppdrag uten 3D',
    alternativeHint:
      'Velg et sted, snakk med personene og bruk verkstedet. Dette er et likeverdig læringsalternativ; det registrerer ingen romlig ferdighet.',
    focusPlace: 'Velg sted',
    settings: 'Innstillinger og hjelp',
    close: 'Lukk',
    quality: 'Grafikkvalitet',
    qualities: { auto: 'Automatisk', low: 'Lav · uten skygger', high: 'Høy · myke skygger' },
    motion:
      'Redusert bevegelse følger enhetens innstilling. Samtaler gir umiddelbart kameraskifte når dette er valgt.',
    fallback: '3D-visningen kunne ikke åpnes',
    fallbackText:
      'WebGL eller en modell er utilgjengelig. Alle samtaler, verkstedvalg og det tekniske oppdraget er fortsatt tilgjengelige i tekstalternativet.',
    retry: 'Prøv 3D på nytt',
    lost: 'Grafikkonteksten ble avbrutt. Bruk alternativet eller prøv å laste 3D på nytt.',
    retryStorage: 'Last lagret spill',
    resetStorage: 'Nullstill bare G1-spilldata',
    storage: {
      corrupt:
        'Spillagringen er skadet. Ingen quest blir godkjent fra disse dataene. Bruk tekstalternativet eller nullstill G1-data for et nytt forsøk.',
      unsupported:
        'Denne spillagringen har en ukjent versjon. Tidligere tekniske øvinger og XP er bevart.',
      unsaved: 'Arbeidet er bare i minnet. Lagring er avvist; omlasting kan miste spillposisjonen.',
      conflict:
        'En annen fane har endret spillagringen. Nye lagrede endringer er stanset. Last lagret spill eksplisitt før du fortsetter.',
      limit: 'Samtalehistorikken har nådd grensen. Tekniske resultater og tidligere XP beholdes.',
    },
    quest: 'ET GRUNNLAG FOR EGEN KODE',
    questLabel: 'Veiledet oppdrag',
    objectives: {
      meet: 'Møt Ida eller Noor. Undersøk hvorfor teamet vil bruke en plattform.',
      compare: 'Sammenlign minst to tjenestemodeller i ansvarsverkstedet.',
      challenge: 'Bruk kravene og fordel ansvaret i samtalen med Ida.',
      accept: 'Finn Noor og ta imot appteamets oppdrag.',
      build: 'Gå gjennom porten. Bygg og undersøk den veiledede applikasjonsplattformen.',
      report: 'Gå tilbake til Noor og forklar hva som endret konfigurasjonen.',
      done: 'Veiledet oppdrag gjennomgått. Selvstendig vurdering av Chapter 01 gjenstår.',
    },
    guided: 'Veiledet øving · ingen nye XP eller uavhengig mestring',
    portalActivating: 'Porten kobler til den lokale øvingsverdenen …',
    installationTitle: 'Hvem drifter laget?',
    compareHint:
      'Bytt modell og se lagene flytte seg mellom leverandør- og kundesiden. Undersøk deretter begrunnelsen.',
    owners: { customer: 'KUNDEN', microsoft: 'MICROSOFT', shared: 'DELT / TJENESTEAVHENGIG' },
    modelNotes: {
      iaas: 'IaaS: Microsoft drifter fysisk infrastruktur. Kunden vedlikeholder blant annet gjeste-OS, runtime og egen kode.',
      paas: 'PaaS: Microsoft drifter plattformens OS og innebygde runtime. Kunden har egen kode, data, tilgang og konfigurasjon. Nettverksoppgaver avhenger av tjenesten.',
      saas: 'SaaS: Leverandøren drifter applikasjonen. Kunden må fortsatt styre brukere, data og egne innstillinger. Dette er ikke en vert for vilkårlig egen webkode.',
    },
    detail: 'Teknisk fordypning og kilde',
    cinematic: {
      conversation: 'Samtale',
      response: 'Ditt svar',
      instruction: '↑ ↓ velg · Enter svar · Esc avslutt',
      journal: 'Feltnotater',
      back: 'Tilbake til samtalen',
      inspect: 'Undersøk et ansvarslag',
      textSize: 'Større samtaletekst',
      system: 'Systemmelding · ikke en replikk',
      demonstration: 'Ida veileder · ansvarsverkstedet',
      layerHint:
        'Laget lyser i modellen. Eierskapet følger valgt tjenestemodell; dette er ikke et Azure management-scope.',
    },
    spoken: {
      'guide-welcome':
        'Jeg heter Ida. Velkommen til Lysningen. Her undersøker vi hva som faktisk endres når et team velger en skytjeneste. Hvor vil du begynne?',
      'guide-purpose':
        'Teamet har egen webkode. Noen må drifte servere, OS, runtime og applikasjon. Tjenestemodellen fordeler dette arbeidet. Hvor mye vil teamet drifte selv?',
      'guide-mechanism':
        'Med en VM vedlikeholder kunden gjeste-OS og runtime. App Service lar teamet levere egen kode uten samme OS-drift. SaaS er en ferdig applikasjon. La oss se forskjellen.',
      'guide-detail':
        'Abstraksjon flytter oppgaver. Data, identiteter og forsvarlig konfigurasjon trenger fortsatt kundens arbeid. Feltnotatene forklarer tjenestegrensene og container-unntaket nærmere.',
      'guide-expert':
        'La oss undersøke mekanismen direkte. Du kan sammenligne modellene og prøve teamets beslutning. Å hoppe over introduksjonen registrerer ingen tidligere kompetanse.',
      installation:
        'Bytt modell og følg OS-laget. Hvem må drifte det nå? Data og tilgang trenger fortsatt kundens arbeid. Velg et lag hvis du vil undersøke grensen nærmere.',
      'service-iaas':
        'En VM kan kjøre koden, men kunden vedlikeholder fortsatt gjeste-OS og runtime. Det løser ikke ønsket om mindre OS-drift. Sammenlign OS-laget med PaaS.',
      'service-saas':
        'Her vil teamet kjøre egen webkode. SaaS leverer en ferdig applikasjon, ikke automatisk en generell hosting-plattform for den koden.',
      'service-good':
        'PaaS passer disse kravene, og App Service er et aktuelt eksempel. Teamet må fortsatt undersøke tjenestegrensene. Valget garanterer ikke sikkerhet eller tilgjengelighet.',
      'ownership-os':
        'Microsoft forvalter plattformens OS i dette eksemplet. Kunden vedlikeholder egen kode og tilgang. Med en egen container må kunden også vedlikeholde containerinnholdet.',
      'ownership-all':
        'En forvaltet plattform betyr ikke at Microsoft overtar alle sikkerhetsvalg. Data, identiteter, konfigurasjon og egen kode trenger fortsatt kundens arbeid.',
      'ownership-good':
        'Ja. Kode, data, tilgang og konfigurasjon er fortsatt kundens oppgaver. Du har begrunnet valget med veiledning. Noor kan knytte dette til faktisk konfigurasjon.',
      'engineer-offer':
        'Hei, jeg er Noor. Teamet beholder egen webkode, men vil slippe gjeste-OS-drift. Kan du hjelpe meg å organisere plattformen og undersøke en lokasjonsregel?',
      'engineer-brief':
        'Bruk App Sandbox og en resource group med felles livssyklus. Gruppemetadata skal være i Norway East. Bygg en Linux App Service plan og en webapp. Undersøk hva som bestemmer hosting-lokasjonen.',
      'engineer-accepted':
        'Oppdraget er ditt. Begrunn tjeneste- og ansvarsvalget ved verkstedet, og gå gjennom porten. Simulatoren oppretter bare lokale læringsressurser. Kom tilbake når du har undersøkt konfigurasjonen.',
      'engineer-reminder':
        'Alle de veiledede kravene er ennå ikke tilfredsstilt. Gyldig arbeid er bevart. Bruk kvitteringene og lokasjonsvisningen til å finne det som gjenstår.',
      'engineer-progress':
        'Jeg ser registrert arbeid, men ikke alle veiledede betingelser er tilfredsstilt. En gruppe alene bekrefter ikke hosting eller årsaksforståelse. Fortsett med det gyldige arbeidet.',
      'engineer-built':
        'Den validerte øvingen har riktig scope, plan, hosting-avhengighet og veiledede undersøkelser. Forklaringen knytter avslaget til ressurslokasjon. Skal vi gå gjennom funnene?',
      'engineer-reported':
        'Vi har gått gjennom det veiledede grunnlaget. Chapter 01 er fortsatt ikke selvstendig vurdert eller fullt fullført. Neste steg må prøve ideene med endrede krav, uten løsningen først.',
      'portal-locked':
        'Ta imot Noors oppdrag, sammenlign modellene og begrunn tjenestevalg og kundeansvar. Besøk og animasjoner alene åpner ikke porten.',
      'portal-ready':
        'Spillposisjonen lagres ved porten. Gå inn, bygg og undersøk. «Tilbake til 3D-ekspedisjonen» fører deg hit igjen. Gyldig uferdig arbeid beholdes.',
    },
    source: 'Microsoft Learn · referanse',
    planSource: 'Microsoft Learn · App Service plan',
    resetExplanation:
      'Dette fjerner bare G1-posisjon, samtaleobservasjoner og spilloppdrag. Azure-simulering, den tidligere ekspedisjonen og opptjent XP beholdes.',
    confirmReset: 'Nullstill G1-spilldata nå',
    mechanism:
      'Lagene er en ansvarsmodell, ikke Azure management-scopes eller fysisk geografi. App Service bygger på en plan med OS/region; en resource group erstatter ikke denne hosting-avhengigheten.',
    caveat:
      'Innebygget App Service-runtime og en kundelevert container har forskjellige vedlikeholdsoppgaver. Kunden vedlikeholder selv containerinnholdet. PaaS fjerner ikke kundens sikkerhetsansvar, og SaaS fjerner ikke behovet for tilgangsstyring.',
    choices: {
      why: 'Hvorfor trenger vi tjenestemodeller?',
      experienced: 'Jeg kjenner grunnlaget. La meg undersøke.',
      leave: 'Avslutt samtalen',
      mechanism: 'Hva endres teknisk?',
      demonstrate: 'Vis meg ansvarsverkstedet',
      depth: 'La oss gå dypere',
      challenge: 'Prøv teamets beslutning',
      iaas: 'IaaS · Azure Virtual Machines',
      paas: 'PaaS · Azure App Service',
      saas: 'SaaS · en ferdig applikasjon',
      retry: 'Vurder tjenestevalget på nytt',
      inspect: 'Undersøk lagene igjen',
      responsibilities: 'Hvilket ansvar beholder teamet?',
      'customer-code': 'Egen kode, data, tilgang og konfigurasjon',
      'patch-os': 'Patche plattformens gjeste-OS',
      'all-provider': 'Microsoft overtar alt sikkerhetsansvar',
      'retry-responsibility': 'Fordel ansvaret på nytt',
      'meet-engineer': 'Jeg vil møte ingeniøren',
      requirements: 'Hva trenger appteamet?',
      accept: 'Jeg tar oppdraget',
      'model-reason': 'La oss begrunne tjenestevalget først',
      report: 'Gå gjennom mitt veiledede arbeid',
      enter: 'Aktiver porten og gå inn',
    },
    dialogue: {
      'guide-welcome':
        'Jeg heter Ida. Dette er Lysningen: et sted for å undersøke skyteknologi før du bruker den i virkeligheten. Du styrer hvor du går. Jeg hjelper deg å se hva som faktisk endres når et team velger en skytjeneste.',
      'guide-purpose':
        'Tenk på et team med egen webkode. Noen må drifte fysiske servere, operativsystem, runtime og applikasjon. IaaS, PaaS og SaaS fordeler disse oppgavene forskjellig. Modellvalget handler om kontroll og arbeid – ikke om hvor mange serverikoner vi tegner.',
      'guide-mechanism':
        'Med en VM vedlikeholder kunden gjeste-OS og runtime. App Service tilbyr en forvaltet applikasjonsplattform, slik at teamet kan levere egen kode uten samme OS-drift. SaaS leverer en ferdig applikasjon. Den er ikke automatisk riktig sted å kjøre teamets egen kode.',
      'guide-detail':
        'Abstraksjon flytter oppgaver, men fjerner ikke ansvar. Kunden må beskytte data, styre identiteter og velge forsvarlig konfigurasjon i alle modellene. Se lagene i verkstedet. Delt-markeringen betyr at grensene må undersøkes for den konkrete tjenesten, ikke at begge parter gjør nøyaktig samme arbeid.',
      'guide-expert':
        'Da bruker vi tiden på mekanismen. Ved verkstedet kan du sammenligne modellene direkte og ta en kravbasert beslutning. Du hopper over forklaringen, ikke over beviskrav: ingen tidligere kompetanse blir registrert av dette valget.',
      installation:
        'Dette er ansvarsverkstedet. Teknikkens lag blir stående, men operatøren endres. Velg minst to modeller og følg spesielt OS, runtime, egen kode og data. Jeg kommenterer modellen du velger. Deretter undersøker vi appteamets behov.',
      'service-question':
        'Teamet har egen webkode og trenger en plattform for å kjøre den. De vil ikke vedlikeholde gjeste-OS. Hvilket alternativ passer dette avgrensede behovet best?',
      'service-iaas':
        'En VM kan kjøre koden, men kunden må fortsatt vedlikeholde gjeste-OS og runtime. Det løser ikke ønsket om mindre OS-drift. Se OS-laget når du bytter fra IaaS til PaaS, og vurder kravet på nytt.',
      'service-saas':
        'En ferdig SaaS-applikasjon kan være riktig hvis teamet vil erstatte løsningen. Her vil de kjøre egen webkode. SaaS-begrepet lover ikke en generell hosting-plattform for den. Undersøk forskjellen mellom applikasjonen og plattformen.',
      'service-good':
        'PaaS er et godt tjenestemodellvalg for disse kravene. App Service er et aktuelt eksempel. Det er ikke en automatisk garanti for sikkerhet, tilgjengelighet eller at alle applikasjoner støttes. Teamet må fortsatt undersøke plattformens grenser.',
      'ownership-question':
        'Teamet velger en App Service med innebygget runtime. Hvilken oppgavegruppe er fortsatt kundens ansvar?',
      'ownership-os':
        'I dette PaaS-eksemplet forvalter Microsoft plattformens OS. Kunden trenger fortsatt blant annet å vedlikeholde egen kode og konfigurere tilgang. For en kundelevert container kommer ansvar for innholdet i containeren i tillegg.',
      'ownership-all':
        'En forvaltet plattform betyr ikke at Microsoft overtar alle sikkerhetsvalg. Uforsvarlige tilgangsregler eller svak egen kode blir ikke riktige av å kjøre i PaaS. Data, identiteter og konfigurasjon trenger kundens arbeid.',
      'ownership-good':
        'Ja. Kunden beholder kode-, data-, tilgangs- og konfigurasjonsoppgaver. Du har begrunnet en beslutning med veiledning. Det registreres som øving, ikke uavhengig mestring. Noor kan nå knytte dette til en faktisk teknisk konfigurasjon.',
      'engineer-offer':
        'Hei, jeg er Noor. Appteamet har valgt å beholde egen webkode. Jeg trenger hjelp til å organisere et PaaS-grunnlag og forstå hva en lokasjonsregel gjør med konfigurasjonen. Vil du se kravene?',
      'engineer-brief':
        'Vi bruker App Sandbox og en resource group med felles livssyklus. Gruppemetadata skal være i Norway East. Undersøk selv hva som bestemmer hosting-lokasjonen. Bygg en støttet Linux App Service plan, koble en webapp til den og finn årsaken hvis en forespørsel blir avvist.',
      'engineer-accepted':
        'Oppdraget er ditt. Sammenlign modellene ved verkstedet og begrunn tjeneste- og ansvarsvalget. Deretter åpner porten vår eksisterende tekniske simulator. Den oppretter bare lokale læringsressurser. Kom tilbake til meg når du har undersøkt konfigurasjonen.',
      'engineer-reminder':
        'Jeg har fortsatt ikke en veiledet konfigurasjon som tilfredsstiller alle oppdragskravene. Porten beholder gyldig arbeid når du går ut. Bruk kvitteringer og lokasjonsvisning til å forklare hva som eventuelt gjenstår.',
      'engineer-progress':
        'Jeg ser faktisk registrert arbeid i den tekniske øvingen, men de veiledede betingelsene er ikke samlet tilfredsstilt. En opprettet gruppe alene bekrefter ikke riktig hosting eller årsaksforståelse. Fortsett i porten; du trenger ikke kaste gyldig arbeid.',
      'engineer-built':
        'Den validerte øvingen viser en gruppe i riktig scope, en støttet plan, en app som bruker planen og de veiledede undersøkelsene. Forklaringen knytter avslaget til ressurslokasjonen, ikke til gruppemetadata. Vi kan gå gjennom dette som veiledet arbeid.',
      'engineer-reported':
        'Vi har gått gjennom det veiledede grunnlaget. Du har undersøkt hvorfor korreksjonen virket. Ingen appkode kjører her, og Chapter 01 er fortsatt ikke selvstendig vurdert eller fullt fullført. Neste steg må prøve de samme ideene med endrede krav, uten å gi deg løsningen først.',
      'portal-locked':
        'Dette oppdraget starter med Noor og ansvarsverkstedet. Ta imot kravet, sammenlign minst to modeller og begrunn tjenestemodell og kundeansvar. Besøk og animasjoner alene åpner ikke oppdraget.',
      'portal-ready':
        'Porten åpner den eksisterende veiledede tekniske verdenen. Spillposisjonen lagres ved porten. Bygg, forutsi og undersøk konfigurasjonen; bruk deretter «Tilbake til 3D-ekspedisjonen». Uferdig gyldig arbeid beholdes.',
    },
    metrics: 'Renderingsmåling',
    metricsHint:
      'Lokale rammetider fra denne økten. Ikke en måling av representative mobiltelefoner eller læringseffekt.',
    fps: 'Bilder/s',
    calls: 'Tegnekall',
    triangles: 'Trekanter',
    samples: 'Måleprøver',
    worldSign: 'LYSNINGEN',
    workshopSign: 'ANSVARSVERKSTEDET',
    portalSign: 'INFRASTRUKTUR',
  },
  chapter: {
    title: 'Bygg, forutsi og rett opp',
    sector: 'INFRASTRUKTUR / CHAPTER 01 · VEILEDET',
    entry: 'Bygg applikasjonsplattformen',
    legacy: 'Til introduksjonsmiljøet',
    legacyStatus: 'Tidligere introduksjonsøving',
    return: 'Tilbake til ekspedisjonen',
    bridge:
      'Her kan du overføre kunnskap om tjenestemodeller til en sammenhengende konfigurasjon. Teamet har egen webkode og vil slippe å drifte et gjeste-OS.',
    brief: 'Teamets krav',
    requirements:
      'App Sandbox · felles livssyklus · gruppemetadata i Norway East. Webappens hosting og en lokasjonsregel må undersøkes underveis.',
    boundary: 'Lokal konfigurasjonssimulering. Ingen kode kjører, ingen Azure-ressurser opprettes.',
    guidedOnly:
      'Veiledet bygging. En selvstendig utfordring kommer senere. Dette arbeidet gir ingen nye XP.',
    guidedBuilt: 'Veiledet konfigurasjon tilfredsstilt',
    guidedPending: 'Veiledet arbeid gjenstår',
    transferPending: 'Chapter 01 er ikke fullført eller vurdert som selvstendig mestret.',
    choose: 'Velg en komponent for å undersøke eller konfigurere den.',
    objective: 'Aktuelt undersøkelsesmål',
    tools: 'Verktøy i verdenen',
    stages: {
      responsibility: 'Overfør tjenestevalget',
      organize: 'Velg riktig livssyklus og scope',
      predict: 'Forutsi lokasjonen før resultatet',
      investigate: 'Undersøk et policyavslag',
      construct: 'Koble plan og webapp',
      explain: 'Forklar årsaken',
      'guided-built': 'Veiledet konfigurering klar',
    },
    goals: {
      responsibility: 'Bekreft hvem som drifter OS og egen kode i den valgte plattformen.',
      organize:
        'Opprett eller bind en gruppe i App Sandbox med metadata i Norway East. Andre gyldige grupper er tillatt, men dekker ikke teamets krav.',
      predict:
        'Gruppemetadata er på plass. Registrer hva du tror bestemmer planens og appens lokasjon før du prøver en plan.',
      investigate:
        'Undersøk en avvist Web-konfigurasjon og lokasjonsregelen. Har du allerede valgt en tillatt lokasjon? Prøv moteksemplet isolert.',
      construct:
        'Opprett en støttet Linux-plan og en webapp som bruker den samme planen i appgruppen.',
      explain: 'Sammenlign metadata og hosting. Forklar hvilken konfigurasjon som rettet avslaget.',
      'guided-built':
        'Det støttede byggverket og de veiledede forklaringene passer kravene. Selvstendig overføring gjenstår.',
    },
    inspect: 'Inspeksjon',
    responsibility: 'Tjenestevalg',
    prediction: 'Prediksjon',
    policy: 'Lokasjonsregel',
    locations: 'Lokasjoner',
    receipts: 'Kvitteringer',
    explanation: 'Forklar sammenhengen',
    spatial: 'Romlig',
    diagram: 'Diagram',
    list: 'Liste',
    views: 'Representasjon av teknisk tilstand',
    newGroup: 'Ny resource group',
    newPlan: 'Ny App Service plan',
    newApp: 'Ny webapp',
    create: 'Registrer og bruk i oppdraget',
    cancel: 'Tilbake til inspeksjon',
    editConfiguration: 'Endre konfigurasjon',
    name: 'Ressursnavn',
    subscription: 'Subscription',
    group: 'Resource group',
    metadata: 'Region for gruppemetadata',
    planRegion: 'Region for hosting-plan',
    hostingPlan: 'Hosting-plan',
    noPlan: 'Ingen valgt plan · undersøk manglende avhengighet',
    profile: 'Linux · linux-learning-v1',
    profileNote:
      'Navngitt læringsprofil; ingen reell SKU, pris eller regional tilgjengelighet bekreftes.',
    nameNote:
      'Plan/app: liten bokstav først, deretter små bokstaver, tall eller bindestrek; 3–40 tegn. Kapittelkonvensjon, ikke alle Azure-navneregler.',
    bindGroup: 'Bruk som appgruppe',
    bindPlan: 'Bruk som hosting-plan',
    bindApp: 'Bruk som applikasjon',
    selectedRole: 'Knyttet til oppdraget',
    mismatch:
      'Gyldig ressurs, men feil scope eller metadata for dette oppdraget. Ingen Azure-tillatelse er avslått.',
    noGroup: 'Opprett eller velg en resource group først.',
    deleteGroup: 'Slett tom gruppe',
    deleteText:
      'Dette fjerner den tomme gruppen i den lokale øvingen. Andre grupper og tidligere XP beholdes.',
    deleteConfirm: 'Fjern den tomme gruppen',
    reset: 'Start øvingen på nytt',
    resetText:
      'Dette erstatter gjeldende kommandoer, prediksjon og observasjoner med et nytt veiledet forsøk. Reisen og tidligere XP beholdes. Dette er ingen selvstendig innlevering.',
    resetConfirm: 'Start nytt veiledet forsøk',
    model: 'Tjenestemodell for teamet',
    osOwner: 'Hvem drifter plattformens OS?',
    codeOwner: 'Hvem har ansvar for egen kode og kundens tilgangsvalg?',
    microsoft: 'Microsoft',
    customer: 'Kunden',
    confirmModel: 'Bekreft operasjonelt ansvar',
    modelFeedback:
      'Kravet gjelder egen kode uten gjeste-OS-drift. PaaS passer her; Microsoft drifter plattformens OS, kunden har fortsatt kode-, konfigurasjons- og tilgangsoppgaver.',
    predictionTitle: 'Stopp før du ser resultatet',
    predictionIntro:
      'Gruppens metadata er i Norway East. Må en hosting-plan i gruppen derfor ligge i Norway East? Hva vil bestemme appens lokasjon?',
    placementQuestion: 'Forholdet mellom gruppemetadata og planlokasjon',
    appLocationQuestion: 'Hva bestemmer webappens lokasjon?',
    independent: 'Planlokasjon velges separat fra gruppemetadata',
    forced: 'Planen må arve gruppens metadatalokasjon',
    planDetermines: 'Webappen bruker hosting-planens lokasjon',
    groupDetermines: 'Webappen bruker gruppens metadatalokasjon',
    savePrediction: 'Lagre prediksjon og undersøk planen',
    predictionSaved: 'Prediksjonen ble lagret før resultatet; Azure-tilstanden er uendret.',
    predictionRecorded: 'Din opprinnelige prediksjon',
    predictionLate:
      'Prediksjonen kom etter et planforsøk. Start et nytt veiledet forsøk for å registrere den før resultatet.',
    predictAgain:
      'Den første prediksjonen beholdes. Forklaringen etter forsøket kan vise hva du har lært.',
    operationRejected: 'Avvist forsøk · ingen ressurs opprettet',
    inspectRejected: 'Undersøk avvist operasjon',
    operationAccepted: 'Konfigurasjon registrert',
    operationUnsupported: 'Utenfor modellen',
    outcomes: { accepted: 'Registrert', rejected: 'Avvist', unsupported: 'Ikke støttet' },
    operations: {
      CreateGroup: 'Opprett resource group',
      DeleteEmptyGroup: 'Slett tom resource group',
      CreatePlan: 'Opprett App Service plan',
      CreateWebApp: 'Opprett webapp',
      unknown: 'Ukjent operasjon',
    },
    receiptTitle: 'Teknisk årsak og tilstand',
    targetType: 'Ressurstype',
    operation: 'Operasjon',
    requestedLocation: 'Forespurt / avledet lokasjon',
    scope: 'Mål-scope',
    revision: 'Verdensrevisjon',
    inventory: 'Aktive objekter',
    rule: 'Modellregel',
    unchanged: 'Ingen ressurs ble lagt til. Tidligere godkjente operasjoner står fortsatt.',
    added: 'Nye objekt-ID-er',
    removed: 'Fjernede objekt-ID-er',
    noReceipts: 'Utfør en teknisk handling for å undersøke en ekte modellkvittering.',
    inspectReceipt: 'Undersøk kvittering',
    showPolicy: 'Undersøk gjeldende policy',
    customPolicy: 'Egendefinert læringspolicy',
    policyScope: 'Tildelt scope',
    policyTypes: 'Gjelder bare Web-typer',
    policyAllowed: 'Tillatte ressurslokasjoner',
    policyMode: 'Resource Manager mode: all',
    policyExpression: 'Web-type + lokasjon utenfor tillatt liste → deny',
    policyExcluded:
      'Resource groups er ikke måltypen. Gruppemetadata er derfor ikke en løsning på dette ressurslokasjonsavslaget.',
    policyNuance:
      'Dette er en avgrenset, forfattet regel inspirert av Azure Policy. Den er ikke den generelle innebygde Allowed locations-policyen og er ingen garanti for dataresidens.',
    policyExisting:
      'Deny kan stoppe nye forespørsler. Eksisterende ressurser flyttes eller slettes ikke av regelen; de kan være uten samsvar.',
    probe: 'Test avvist alternativ isolert',
    probeNote:
      'Et faktisk CreatePlan-forsøk i North Europe kjøres i en forkastbar kopi. Din godkjente plan og verden endres ikke.',
    probeReceipt: 'Isolert policyforsøk · hovedverden uendret',
    remedy: 'Hvilket felt retter denne Web-lokasjonskonflikten?',
    fixResource: 'Velg en tillatt ressurslokasjon; appen følger planen',
    fixMetadata: 'Flytt gruppens metadata',
    breakDependency: 'Fjern appens planreferanse',
    saveExplanation: 'Registrer årsaksforklaring',
    explanationWrong:
      'Undersøk kvitteringen og hosting-avhengigheten. Metadata flytter ikke planen; en webapp trenger fortsatt en støttet plan.',
    explanationGood:
      'Forklaringen stemmer med den modellerte tilstanden. Dette er veiledet evidens, ikke en uavhengig vurdering.',
    metadataValue: 'Gruppens metadatalokasjon',
    resourceValue: 'Ressursens lokasjon',
    derivedLocation: 'Avledet fra hosting-plan',
    noResourceYet: 'Ingen slik ressurs er registrert ennå',
    compareNote:
      'Norway East beskriver her gruppemetadata. Hosting-planen plasserer Web-ressursene; ingen region er et management-scope.',
    relationLabels: {
      'identity-authority': 'Identitetsautoritet',
      'management-parent': 'Management-scope',
      'resource-member': 'Ressursmedlemskap',
      'depends-on': 'Hosting-avhengighet · app → plan',
    },
    kindLabels: {
      tenant: 'Microsoft Entra tenant',
      root: 'Tenant root group',
      management: 'Management group',
      subscription: 'Subscription',
      group: 'Resource group',
      plan: 'App Service plan',
      app: 'Webapp',
    },
    supported: 'Støttet konfigurasjon',
    health: 'Kjøretid, kodeleveranse, helse og nettverk er ikke modellert.',
    depth: 'Teknisk fordypning',
    intuition: 'Formål',
    mechanism: 'Mekanisme',
    nuance: 'Grenser og moteksempler',
    source: 'Microsoft-kilde · gjennomgått 23.10.2026',
    topics: {
      scope: {
        purpose: 'En gruppe samler ressurser som teamet vil forvalte gjennom samme livssyklus.',
        mechanism:
          'Gruppen har én subscription som management-parent. Ressurser er medlemmer av gruppen. Entra-katalogen angir identitet, ikke fysisk plassering.',
        nuance:
          'Begge sandbox-subscriptions kan brukes i modellen. En gyldig opprettelse i Shared Sandbox dekker likevel ikke appteamets krav om App Sandbox. Tilgangskontroll simuleres ikke.',
        url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal',
      },
      hosting: {
        purpose:
          'Planen beskriver hosting-ressursene. Webappen er applikasjonskonfigurasjonen som bruker dem.',
        mechanism:
          'Planen velger OS og region. Appen refererer til en faktisk støttet plan og får samme OS/lokasjon. Begge er egne ressursmedlemmer av gruppen; app → plan er en annen relasjon.',
        nuance:
          'Modellen støtter bare Linux-profilen og samme gruppe. Azure kan støtte hosting over gruppegrenser; denne øvingen svarer eksplisitt «ikke støttet». Ingen appkode kjører etter opprettelse.',
        url: 'https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans',
      },
      location: {
        purpose: 'Hvor styringsmetadata lagres og hvor en ressurs ligger er forskjellige spørsmål.',
        mechanism:
          'En gruppe med metadata i Norway East kan inneholde en hosting-plan i West Europe. Webappens region følger planen, ikke gruppefeltet.',
        nuance:
          'Gruppens metadata er ikke en instruks om å flytte eksisterende ressurser. Modellen tilbyr ingen metadataendring eller ressursflytting. Geografisk plassering vises som egne egenskaper.',
        url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal',
      },
      policy: {
        purpose:
          'Styringsregler avgrenser hvilke ellers gyldige konfigurasjoner som kan registreres.',
        mechanism:
          'Tildelingen ved App Sandbox undersøker Web-plan/app-type og ressurslokasjon. North Europe avvises av akkurat denne regelen; West Europe er tillatt.',
        nuance:
          'Gruppemetadata inngår ikke i typefilteret. Et avslag oppretter ingenting. En ny deny-regel flytter eller sletter ikke eksisterende ressurser. Full Azure Policy-evaluering er utenfor modellen.',
        url: 'https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-deny',
      },
    },
    errors: {
      created:
        'Konfigurasjonen er registrert i den lokale modellen. Dette bekrefter ikke at kode kjører.',
      deleted: 'Den tomme gruppen er fjernet fra dette forsøket.',
      'invalid-envelope': 'Forespørselen har ugyldig kommando-ID, revisjon eller format.',
      'invalid-command': 'Kommandoen mangler et påkrevd tekstfelt.',
      'invalid-name':
        'Navnet følger ikke de støttede reglene. Gruppen bruker Resource Group-reglene; Web-navn bruker kapittelkonvensjonen.',
      'invalid-region': 'Regionen er ikke en av de tre støttede fixture-regionene.',
      'invalid-parent': 'Det angitte management-scope finnes ikke eller har feil type.',
      'duplicate-name': 'Navnet finnes allerede for denne typen i det støttede navneomfanget.',
      'missing-plan':
        'Ingen støttet hosting-plan finnes med denne referansen. Gruppen og tidligere godkjente ressurser er uendret.',
      'policy-location-denied':
        'Web-ressursens lokasjon bryter den gjeldende tildelingen. Undersøk policyens scope, typefilter og tillatte regioner.',
      'unsupported-capability':
        'Denne Azure-operasjonen er utenfor kapittelmodellen. Ingen operasjon ble utført.',
      'unsupported-field':
        'Et ekstra konfigurasjonsfelt er utenfor modellen. Appens lokasjon kan for eksempel ikke velges uavhengig av planen.',
      'unsupported-profile':
        'Bare linux-learning-v1 støttes. Dette sier ikke hvilke Azure-profiler som faktisk finnes.',
      'cross-group-hosting':
        'Hosting på tvers av resource groups er utenfor denne modellen; det er ikke et generelt Azure-forbud.',
      'cascade-delete-unsupported':
        'Gruppen inneholder ressurser. Kaskadesletting er ikke modellert.',
      capacity:
        'Kapitlets grense er tre aktive grupper og 16 scope/ressursobjekter. Dette er ikke en Azure-kvote.',
      'stale-revision':
        'Kommandoen bygger på en gammel verdensrevisjon. Les gjeldende tilstand og prøv med ny kommando-ID.',
      'command-id-conflict':
        'Samme kommando-ID ble brukt med et annet innhold. Den opprinnelige operasjonen beholdes.',
      'history-limit':
        'Forsøkets kommandogrense er nådd. Eksporter arbeidet eller start et nytt forsøk.',
    },
    storage: {
      corrupt:
        'Lagrede kapitteldata kunne ikke valideres. Ingen tidligere gjennomføring er godkjent. Dataene beholdes til du velger å starte på nytt.',
      unsupported:
        'Lagringen bruker en ukjent scenario- eller modellversjon. Den spilles ikke av med dagens regler.',
      conflict:
        'En annen fane har endret lagringen. Ditt arbeid beholdes i minnet; nye handlinger er stanset for å unngå overskriving. Eksporter gjerne før du laster den andre versjonen.',
      unsaved:
        'Arbeidet er bare i minnet. Nettleseren avviste lesing eller lagring; omlasting kan miste endringene.',
      limit: 'Forsøket har nådd lagrings-/hendelsesgrensen. Eksporter eller start et nytt forsøk.',
      'invalid-action':
        'Handlingen kunne ikke brukes på den nåværende tilstanden. Undersøk valgt scope og prøv igjen.',
    },
    loadSaved: 'Last lagret versjon',
    export: 'Eksporter mitt veiledede arbeid',
    recovered: 'Start en ny, kompatibel lokaløving',
    saved: 'Lagret lokalt · uverifisert',
    attempt: 'Veiledet forsøk',
  },
  expedition: {
    title: 'Azure-ekspedisjonen',
    sector: 'EKSPEDISJON 01 / FRA ABSTRAKSJON TIL INFRASTRUKTUR',
    scene: 'Reise gjennom Azure-kunnskap',
    local: 'Lokal læringsverden · ingen Azure-tilkobling',
    map: 'Ruteoversikt',
    mapClose: 'Tilbake til nærvisning',
    orientation: 'Reis direkte til et stopp',
    travel: 'Reiser mot',
    back: 'Forrige stopp',
    begin: 'Begynn ekspedisjonen',
    continue: 'Fortsett reisen',
    inspect: 'Undersøk ansvaret',
    detour: 'Ta avstikkeren',
    return: 'Tilbake til hovedruten',
    leave: 'Tilbake uten å fullføre',
    retry: 'Endre svaret',
    validate: 'Test beslutningen',
    allocate: 'Kontroller ansvarsfordelingen',
    portal: 'Gå inn i infrastrukturverdenen',
    portalEntering: 'Åpner infrastrukturverdenen',
    worldReturn: 'Tilbake til ekspedisjonen',
    quickEntry: 'Gå inn i universet',
    experienced: 'Kjenner du grunnlaget? Gå direkte til praktisk arbeid.',
    future: 'Ikke spillbar ennå',
    guided: 'Veiledet øving · ingen mestringsvurdering',
    reward: 'Ingen XP for avstikkere. Det praktiske oppdraget gir inntil 120 XP én gang.',
    saved: 'Arbeidet lagres på denne enheten.',
    storageFailure:
      'Reisen er bare lagret i minnet. Nettleseren avviste lokal lagring; omlasting kan miste arbeidet.',
    source: 'Microsoft-kilder · gjennomgått 22.10.2026',
    sourceResponsibility: 'Shared responsibility',
    sourceRuntime: 'App Service: OS & runtime',
    journeyNotGeography:
      'Landskapet viser læringsprogresjon, ikke Azure-regioner eller ressursplassering.',
    controls:
      'Bruk stoppkontrollene for å reise. Oversikten viser hele ruten. Alle handlinger kan utføres med tastatur.',
    stops: {
      arrival: {
        label: 'Utgangspunkt',
        title: 'Et nytt perspektiv på skyen.',
        text: 'Hvem drifter hva når du flytter en applikasjon til skyen? Følg signalet til ansvarsverkstedet. Prøv et valg, se konsekvensen og ta kunnskapen med inn i en faktisk simulering.',
      },
      models: {
        label: 'Ansvarsverkstedet',
        title: 'Samme behov. Ulikt ansvar.',
        text: 'Bytt mellom tjenestemodellene. Lagene skifter eierskap. Velg et lag for å undersøke hva teamet faktisk må gjøre.',
      },
      decision: {
        label: 'Beslutningsutsikten',
        title: 'Velg en plattform for teamet.',
        text: 'Et team har egen webkode og trenger en administrert plattform. De vil konfigurere appen, men ikke patche gjeste-OS. Hvilken modell passer dette behovet best?',
      },
      crossing: {
        label: 'Krysningspunktet',
        title: 'Mindre drift. Fortsatt ansvar.',
        text: 'En administrert plattform overtar driftsoppgaver. Det fritar ikke teamet fra å beskytte det de kontrollerer. Neste avstikker tester denne grensen i en ferdig SaaS-tjeneste.',
      },
      ownership: {
        label: 'Ansvarsstasjonen',
        title: 'Hva beholder kunden?',
        text: 'En organisasjon tar i bruk en ferdig SaaS-applikasjon. Marker alle oppgavene kunden fortsatt har ansvar for blant de fire nedenfor. Se hvilke signaler som forblir hos kunden.',
      },
      gateway: {
        label: 'Infrastrukturporten',
        title: 'Fra forståelse til handling.',
        text: 'Et appteam har egen webkode og vil slippe gjeste-OS-drift. Bygg et PaaS-grunnlag, undersøk et lokasjonsavslag og koble appen til en hosting-plan.',
      },
      horizon: {
        label: 'Neste horisont',
        title: 'Herfra forgrener verden seg.',
        text: 'Du kan vende tilbake og eksperimentere. Nettverk, drift og arkitektur er kommende fagområder; de fjerne landemerkene er foreløpig ikke spillbare.',
      },
    },
    models: {
      iaas: {
        label: 'IaaS',
        example: 'Azure Virtual Machines',
        summary: 'Du trenger kontroll over operativsystemet. Teamet får flere driftsoppgaver.',
        application:
          'Et eldre system krever en bestemt OS-konfigurasjon. En VM gir kontroll, men teamet må planlegge patching, hardening og appdrift.',
      },
      paas: {
        label: 'PaaS',
        example: 'Azure App Service',
        summary:
          'Plattformen driftes for deg. Egen kode og applikasjonsvalg er fortsatt ditt arbeid.',
        application:
          'Webteamet leverer kode til App Service med innebygd runtime. Plattformen håndterer OS; teamet tester avhengigheter og velger støttet runtime-versjon.',
      },
      saas: {
        label: 'SaaS',
        example: 'Microsoft 365',
        summary:
          'Du tar i bruk ferdig programvare. Tilgang, innstillinger og informasjon trenger fortsatt eiere.',
        application:
          'En ny medarbeider skal få riktig tilgang til samarbeidsverktøyet. At programvaren er ferdig, bestemmer ikke hvilke dokumenter personen bør se.',
      },
    },
    owners: { customer: 'Kunden', microsoft: 'Microsoft', shared: 'Delt ansvar' },
    layers: {
      physical: {
        label: 'Fysisk infrastruktur',
        detail:
          'Datasenter, fysisk nettverk, verter og virtualiseringslag driftes av leverandøren i disse skymodellene.',
      },
      os: {
        label: 'Operativsystem',
        detail:
          'I IaaS styrer du gjeste-OS. Med administrert PaaS og SaaS ligger plattformens OS-drift hos leverandøren.',
      },
      runtime: {
        label: 'Runtime og middleware',
        detail:
          'Her viser PaaS en innebygd App Service-runtime. Egen container eller opplastet runtime har andre vedlikeholdsgrenser; ikke overfør dette bildet ukritisk.',
      },
      application: {
        label: 'Applikasjon',
        detail:
          'Applikasjonsansvar er delt i PaaS og SaaS. Leverandøren drifter deler av løsningen; kunden har fortsatt ansvar for blant annet egen kode, tilgang eller konfigurasjon.',
      },
      network: {
        label: 'Nettverkskontroller',
        detail:
          'IaaS krever egne nettverksvalg. PaaS deler kontrollene med plattformen. SaaS-leverandøren drifter tjenestens nettverk; klienttilgang må fortsatt vurderes.',
      },
      settings: {
        label: 'Konfigurasjon',
        detail:
          'En standardinnstilling er et utgangspunkt. Kunden må velge passende innstillinger og kontrollere at de dekker virksomhetens behov.',
      },
      identity: {
        label: 'Brukere og tilgang',
        detail:
          'Kunden bestemmer hvem som skal få tilgang. Administrert identitetsinfrastruktur opphever ikke behovet for å opprette, avgrense og fjerne brukertilgang.',
      },
      data: {
        label: 'Kundedata',
        detail:
          'Kunden må klassifisere og beskytte informasjonen og vurdere lagring, tilgang og styringskrav i alle modellene.',
      },
    },
    levels: ['Intuisjon', 'Mekanisme', 'Teknisk dybde', 'Anvendelse'],
    mechanism:
      'Følg det valgte laget i stabelen. Endring av modell flytter driftsansvaret, mens data, tilgang og kundens innstillinger blir igjen hos kunden.',
    nuance:
      'Forenklet ansvarsmodell, ikke en kontrakt eller garanti. Tjeneste, driftsmodell og konfigurasjon avgjør detaljene. Høyere abstraksjon betyr ikke automatisk høyere sikkerhet.',
    selection: 'Valgt ansvarslag',
    checkTitles: {
      'service-fit': 'Avstikker 01 / tjenestevalg',
      'retained-control': 'Avstikker 02 / ansvarsfordeling',
    },
    choices: {
      data: 'Klassifisere og beskytte kundedata',
      identity: 'Administrere brukere og tilgang',
      os: 'Patche SaaS-leverandørens OS',
      physical: 'Vedlikeholde leverandørens fysiske verter',
    },
    decisionFeedback: {
      iaas: 'En VM kan kjøre koden, men teamet beholder gjeste-OS-driften. Det bryter med kravet om å slippe OS-patching. Undersøk PaaS og prøv igjen.',
      paas: 'PaaS passer det oppgitte behovet. App Service med innebygd runtime lar teamet levere egen kode mens plattformen drifter OS. Kode, avhengigheter, tilgang og konfigurasjon trenger fortsatt eiere.',
      saas: 'SaaS gir en ferdig applikasjon. Her trenger teamet en plattform for egen webkode. Undersøk forskjellen mellom å bruke programvare og å levere en app.',
    },
    allocationGood:
      'Riktig grense: data og brukertilgang krever kundens arbeid også i SaaS. Leverandøren vedlikeholder tjenestens OS og fysiske verter. Andre kundeoppgaver finnes, men inngår ikke i disse fire valgene.',
    allocationBad:
      'Fordelingen stemmer ikke ennå. Data og brukertilgang forblir hos kunden. Tjenestens OS og fysiske verter driftes av SaaS-leverandøren. Endre markeringene og se signalene oppdateres.',
    correct: 'Beslutningen holder',
    incorrect: 'Undersøk grensen på nytt',
    recorded:
      'Svaret er registrert som veiledet øving. Du kan prøve igjen; dette er ikke bevis på selvstendig kompetanse.',
    checkDone: 'Øving gjennomført',
    checkOpen: 'Øving gjenstår',
    portalReady: 'Praktisk oppdrag tilgjengelig',
    portalPartial: 'Resource group opprettet · refleksjon gjenstår',
    portalComplete: 'Oppdrag og kunnskapssjekk gjennomført',
    portalSkills: 'Scope · lokasjon · hosting · styringsregler',
    portalActions: 'Forutsi → bygg → undersøk avslaget → rett opp',
    portalBoundary: 'Lokal konfigurasjonssimulering. Ingen Azure-operasjoner utføres.',
    resume: 'Fortsett lagret arbeid',
    landmarks: { network: 'Nettverk', operations: 'Drift og innsikt', architecture: 'Arkitektur' },
    milestone: 'Gjennomførte øvinger',
    completionNote:
      'Gjennomføring og XP viser deltakelse. Selvstendig vurdering og varig mestring er ikke implementert.',
    worldLoading: 'Laster den lokale infrastrukturverdenen …',
  },
  tagline: 'Fra nysgjerrighet til kompetanse.',
  universe: {
    title: 'Azure Universe',
    sector: 'SEKTOR 01 / RESSURSORGANISERING',
    sceneLabel: 'Romlig Azure-miljø',
    spatial: 'Romlig',
    diagram: 'Diagram',
    list: 'Liste',
    discover: 'Velg en komponent. Se sammenhengen.',
    depthNote: 'Skjematisk dybde · ikke geografi',
    camera: 'Kamerakontroller',
    overview: 'Til oversikt',
    focus: 'Fokuser valgt element',
    rotateLeft: 'Roter visningen mot venstre',
    rotateRight: 'Roter visningen mot høyre',
    help: 'Dra for å flytte · velg for å fokusere',
    keyboardHelp:
      'Tastatur: Tab og Enter velger. På scenen flytter piltaster kameraet; +/− zoomer og Home viser oversikten.',
    close: 'Lukk panelet',
    inspect: 'KOMPONENTINSPEKSJON',
    more: 'Teknisk dybde',
    relationships: 'Tilknyttede komponenter',
    goParent: 'Utforsk overordnet',
    children: 'Utforsk innhold',
    create: 'Ny resource group',
    compare: 'Sammenlign regioner',
    compareOff: 'Skjul regioner',
    metadata: 'Metadata',
    location: 'Ressurs',
    geographyTitle: 'Samme gruppe. Ulike plasseringer.',
    geographyText:
      'Norway East lagrer gruppens metadata. App Service ligger i West Europe. Regionvisning endrer ikke hierarkiet.',
    geographyClose: 'Lukk regionsammenligning',
    missionReady: 'DITT NESTE OPPDRAG',
    missionActive: 'OPPDRAG AKTIVT',
    missionTitle: 'Et hjem for applikasjonen',
    start: 'Start oppdrag',
    resume: 'Fortsett oppdrag',
    brief: 'Oppdragsbrief',
    briefText:
      'Teamet skal bygge en applikasjon. Finn riktig subscription og klargjør et sted for ressursene.',
    targetName: 'rg-azurelab-dev',
    targetSubscription: 'Learning Sandbox',
    targetRegion: 'Norway East',
    accept: 'Finn subscription',
    goalSelect: 'Finn og velg Learning Sandbox i scenen.',
    goalCreate: 'Opprett rg-azurelab-dev med metadata i Norway East.',
    goalReflect: 'Gruppen er på plass. Forklar valgene dine.',
    goalDone: 'Oppdrag og kunnskapssjekk fullført.',
    stepSelect: 'Finn scope',
    stepCreate: 'Bygg',
    stepCheck: 'Forklar',
    check: 'Åpne kunnskapssjekk',
    missionReplay: 'Øv igjen',
    createdTitle: 'Resource group opprettet',
    missionSuccess: 'Riktig navn, riktig scope, riktig metadataregion.',
    replaySuccess: 'Godt gjennomført igjen. Tidligere XP beholdes.',
    noAward:
      'Gruppen er opprettet, men oppdraget krever navnet rg-azurelab-dev og metadata i Norway East. Nullstill scenen hvis du må bruke samme navn på nytt.',
    commandEyebrow: 'LOKAL KOMMANDO / RESOURCE GROUP',
    commandScope: 'Plasseres under',
    commandNote: 'Regionen gjelder metadata for gruppen. Ressurser får sin egen plassering.',
    award80: '+80 XP',
    award40: '+40 XP',
    awardNone: 'Ingen nye XP',
    saved: 'Milepæl lagret på denne enheten',
    reset: 'Nullstill simulering',
    resetText: 'Alle nye grupper fjernes fra scenen. Milepæler og XP beholdes.',
    resetConfirm: 'Nullstill scenen',
    cancel: 'Avbryt',
    missionHint: 'Et hint fra kontrollrommet',
    sceneContext: 'Identitet og administrasjon',
    sourceDate: 'Faglig gjennomgått 22.10.2026',
    listHelp: 'Samme komponenter, uten romlige bevegelser. Velg en rad for detaljer og handlinger.',
    newObject: 'Ny i simuleringen',
    assessmentCount: 'Spørsmål',
    nextQuestion: 'Neste spørsmål',
    finishCheck: 'Fullfør kunnskapssjekk',
    backQuestion: 'Forrige spørsmål',
    checkAward: 'Kunnskapssjekk fullført. 40 XP tildeles én gang.',
  },
  hub: {
    eyebrow: 'KONTROLLROM / AZURE FUNDAMENTALS',
    title: 'Et univers å forstå.',
    subtitle: 'Din sandbox er klar. Neste steg er ditt.',
    enter: 'Gå inn i universet',
    mission: 'Klar for ditt første oppdrag?',
    continue: 'Fortsett utforskningen',
    missionText: 'Gi applikasjonsteamet et hjem i Azure. Finn riktig scope. Bygg. Forklar hvorfor.',
    active: 'KLAR TIL Å STARTE',
    complete: 'GJENNOMFØRT · KAN REPETERES',
    journey: 'DIN LÆRINGSBANE',
    current: 'Ressursorganisering',
    future: 'Nettverk og forbindelser',
    planned: 'Under planlegging',
    pathHint: 'Et praktisk fundament. Ingen vurdert eksamensberedskap.',
    milestone: 'Milepæler nådd',
    next: 'NESTE HANDLING',
    duration: 'Ca. 10–15 min',
    sceneCaption: 'DIN LOKALE AZURE-SANDBOX',
    regionNote: 'Identitet. Styring. Ressurser. Se hvordan alt henger sammen.',
  },
  notFound: {
    title: 'Her var det ingen ressurser.',
    description: 'Siden finnes ikke. Du kan fortsette å utforske fra oversikten.',
    back: 'Tilbake til oversikten',
  },
  metadata: {
    title: 'AzureLab — Lær Azure ved å bruke det',
    description: 'Utforsk Azure gjennom interaktive arkitekturer og trygge, lokale simuleringer.',
  },
  nav: [
    { href: '/', label: 'Ekspedisjon', icon: 'dashboard' },
    { href: '/explore', label: 'Utforsk', icon: 'explore' },
    { href: '/missions', label: 'Oppdrag', icon: 'missions' },
    { href: '/progress', label: 'Fremgang', icon: 'progress' },
  ],
  shell: {
    workspace: 'DITT LÆRINGSROM',
    path: 'Azure-ekspedisjonen',
    pathTag: 'Læringssti · første steg',
    local: 'Lokal prototype',
    simulation: 'Simulert miljø',
    safe: 'Ingen Azure-tilkobling',
    guest: 'Lokal utforsker',
    account: 'Fremgang på denne enheten',
    skip: 'Hopp til innhold',
    footer: 'Et uavhengig læringsprosjekt. Ikke tilknyttet Microsoft.',
    phase: 'PHASE 1B.1',
    release: 'v1B.1',
    storageError:
      'Nettleseren tillater ikke lokal lagring. Fremgangen beholdes bare mens denne siden er åpen.',
    loading: 'Laster lokal fremgang …',
    xp: 'XP',
    level: 'Nivå 1 · Utforsker',
  },
  dashboard: {
    eyebrow: 'BYGG FORSTÅELSE. ETT LAG OM GANGEN.',
    title: 'Din neste oppdagelse\nstarter her.',
    intro:
      'Bli kjent med Azure fra innsiden. Utforsk sammenhenger, ta valg og se hva som skjer — i et trygt, simulert miljø.',
    cta: 'Åpne Azure-universet',
    secondary: 'Se ditt første oppdrag',
    heroLabel: 'ET LITE UNIVERS. STORE SAMMENHENGER.',
    heroCaption: 'Identitet → styring → ressurser',
    stat1: 'Praktisk oppdrag',
    stat2: 'Interaktivt univers',
    stat3: 'Mulige XP',
    section: 'Lær ved å gjøre',
    sectionSub: 'Et fundament du kan bygge videre på.',
    module: '01 / AZURE FUNDAMENTALS',
    moduleTitle: 'Hvordan henger Azure sammen?',
    moduleText:
      'Fra Entra tenant til den enkelte ressursen. Se strukturen, undersøk hvert nivå og bygg din første resource group.',
    moduleTags: ['Grunnleggende', 'Ca. 10–15 min', 'Interaktivt'],
    continue: 'Utforsk strukturen',
    missionTitle: 'Et hjem for applikasjonen',
    missionText: 'Et utviklingsteam trenger orden i Azure. Kan du plassere ressursene riktig?',
    missionCta: 'Se oppdraget',
    next: 'VIDERE PÅ REISEN',
    future: 'Nettverk som gir mening',
    futureText:
      'Virtual networks, subnets og trafikkflyt. Neste del av universet er under planlegging.',
    preview: 'Planlagt',
    philosophy: 'Forstå hvorfor. Ikke bare hvordan.',
    philosophyText:
      'XP viser aktivitet. Ferdigheter bygges gjennom praktisk arbeid, refleksjon og øvelse over tid.',
  },
  explore: {
    eyebrow: 'INTERAKTIVT UNIVERS / 01',
    title: 'Alt har sin plass.',
    intro:
      'Utforsk hvordan Azure organiseres. Velg et element i kartet for å forstå rollen det har.',
    map: 'Arkitekturkart',
    list: 'Listevisning',
    canvas: 'Interaktivt Azure-hierarki',
    mapHint: 'Velg en node · Dra bakgrunnen for å panorere',
    hierarchy: 'Administrasjonshierarki',
    geography: 'Region ≠ hierarkinivå',
    regionNote: 'En region sier hvor. Hierarkiet sier hvem som styrer og hva som hører sammen.',
    inspector: 'UTFORSK ET ELEMENT',
    role: 'Rolle i arkitekturen',
    nuance: 'Verdt å forstå',
    parent: 'Overordnet',
    identity: 'Identitetstilknytning',
    region: 'Ressursregion',
    metadataRegion: 'Region for metadata',
    noRegion: 'Ikke regionalt',
    regionCompare: 'Se forskjellen i praksis',
    regionExample:
      'rg-webapp-dev har metadata i Norway East. App Service i gruppen ligger i West Europe. Gruppens region flytter ikke ressursen.',
    sources: 'Faglig grunnlag',
    sourceLink: 'Azure Resource Manager hos Microsoft Learn',
    create: 'Opprett resource group',
    reset: 'Nullstill simulering',
    resetNote: 'Simuleringen er nullstilt. Opptjent XP beholdes.',
    emptyRegion: 'Geografisk plassering er en egen dimensjon.',
    nodeList: 'Velg et element',
    status: 'Eksempelarkitektur',
    created: 'Opprettet lokalt',
    rootRelation: 'Entra tenant · identitet',
    keyboard: 'Bruk Tab og Enter, eller velg Listevisning. Kartet kan zoomes med knappene.',
    controls: {
      zoomIn: 'Zoom inn',
      zoomOut: 'Zoom ut',
      fit: 'Tilpass kartet',
      interactive: 'Veksle kartinteraksjon',
    },
  },
  mission: {
    eyebrow: 'OPPDRAG 01',
    title: 'Et hjem for applikasjonen',
    intro:
      'Et utviklingsteam skal samle ressursene til en ny applikasjon. Klargjør en resource group i teamets sandbox, og forklar hvordan organisering skiller seg fra geografi.',
    time: '10–15 minutter',
    reward: '80 XP + 40 XP',
    level: 'Grunnleggende',
    context: 'DITT OPPDRAG',
    instructions:
      'Opprett rg-azurelab-dev under Learning Sandbox. Velg Norway East som region for gruppens metadata.',
    objective:
      'Du øver på å skille identitet, styringsnivåer og regioner, og å plassere en resource group under riktig subscription.',
    steps: [
      'Undersøk hierarkiet i arkitekturkartet',
      'Opprett resource group med riktig navn og region',
      'Begrunn valgene dine i kunnskapssjekken',
    ],
    open: 'Åpne arbeidsbenken',
    createTitle: 'Gi ressursene en sammenheng',
    name: 'Navn på resource group',
    nameHelp:
      '1–90 tegn: bokstaver, tall, bindestrek, understrek, parenteser og punktum. Kan ikke slutte med punktum.',
    subscription: 'Subscription',
    region: 'Region for metadata',
    submit: 'Opprett i simuleringen',
    simulationNote: 'Kun lokal simulering. Ingen Azure-ressurser eller kostnader opprettes.',
    hint: 'Vis et hint',
    hintText:
      'Resource groups opprettes under en subscription. Skriv rg-azurelab-dev og velg Norway East. Regionvalget bestemmer hvor gruppens metadata lagres.',
    success:
      'Oppdrag utført! Gruppen ligger under Learning Sandbox, med metadata i Norway East. 80 XP tildeles én gang.',
    createdOther:
      'Gruppen er opprettet i kartet. Sammenlign navn og region med oppdraget for å fullføre.',
    already: 'Oppdraget er tidligere fullført. Du kan øve igjen; XP tildeles bare første gang.',
    check: 'Neste steg: test forståelsen',
    completed: 'Fullført lokalt',
    active: 'Klar til å utforske',
    futureTitle: 'Neste oppdrag bygges her',
    futureText:
      'Nettverk, tilgang og feilsøking kommer i senere faser. Denne prototypen har ett spillbart oppdrag.',
  },
  assessment: {
    eyebrow: 'KUNNSKAPSSJEKK',
    title: 'Kan du forklare sammenhengen?',
    intro:
      'Tre originale spørsmål om det du nettopp utforsket. Alle tre må være riktige for 40 XP. Du kan prøve igjen.',
    submit: 'Sjekk svarene',
    retry: 'Prøv på nytt',
    correct: 'Riktig',
    incorrect: 'Se nærmere på dette',
    passed: '3 av 3 riktige. Godt første steg!',
    failed: 'Du har mer å utforske.',
    result: 'riktige svar',
    evidence:
      'Dette er en liten øvelse med umiddelbar tilbakemelding. Resultatet dokumenterer ikke selvstendig mestring eller eksamensberedskap.',
    prerequisite: 'Fullfør oppgaven i simuleringen for å åpne kunnskapssjekken.',
    reflection:
      'Ta et øyeblikk: Hvorfor kan en resource group og ressursene i den ha forskjellige regioner?',
  },
  progress: {
    eyebrow: 'DIN LÆRINGSREISE',
    title: 'Små steg. Varig forståelse.',
    intro: 'Fremgangen lagres i denne nettleseren. Du trenger ingen konto for å starte.',
    xp: 'Erfaringspoeng',
    xpText: 'Aktivitet og gjennomføring. Maksimalt 120 XP i denne prototypen.',
    mastery: 'Demonstrert mestring',
    masteryValue: 'Ikke vurdert',
    masteryText: 'Krever flere selvstendige oppgaver, variasjon og øvelse over tid.',
    readiness: 'Eksamensberedskap',
    readinessValue: 'Ikke beregnet',
    readinessText: 'Krever bred emnedekning, retensjon og uavhengige vurderinger.',
    history: 'Dine milepæler',
    empty: 'Reisen starter med én handling.',
    emptyText: 'Utforsk hierarkiet og fullfør ditt første oppdrag. Milepælene dine vil vises her.',
    mission: 'Resource group opprettet riktig',
    assessment: 'Kunnskapssjekk: 3 av 3 riktige',
    certification: 'Et fundament for videre læring',
    certText:
      'Første modul er knyttet til ressursorganisering i AZ-900. Læringsstier for AZ-104 og AZ-305 er planlagt. Ingen estimater eller løfter om bestått eksamen.',
    privacy: 'Dine data, på denne enheten',
    privacyText:
      'Reiseposisjon, øvingssvar, tekniske kommandoer, prediksjoner, undersøkelser og milepæler lagres på denne enheten. Ingen konto, sporing eller leaderboard. Nettleserdata kan endres eller slettes og er ikke et kompetansebevis.',
    reset: 'Slett lokal fremgang',
    cancel: 'Behold fremgangen',
    confirm: 'Slett fremgangen nå',
    confirmText:
      'Dette sletter reiseposisjon, øvingssvar, simulerte ressurser, milepæler og XP på denne enheten. Handlingen kan ikke angres.',
    resetDone: 'Lokal fremgang er slettet.',
  },
} as const;

export const regionLabels: Record<Region, string> = {
  norwayeast: 'Norway East',
  westeurope: 'West Europe',
  northeurope: 'North Europe',
};
export const scopeCopy: Record<ScopeKind, { label: string; role: string; nuance: string }> = {
  tenant: {
    label: 'Microsoft Entra tenant',
    role: 'En egen identitetskatalog for brukere, grupper og applikasjoner. En tenant kan være knyttet til flere subscriptions.',
    nuance:
      'Tenant er identitetsgrensen, ikke et geografisk sted. En subscription stoler på én Entra tenant om gangen. Entra-roller og Azure RBAC-roller er ulike.',
  },
  root: {
    label: 'Root management group',
    role: 'Tenant root group er toppen av management group-hierarkiet i denne katalogen.',
    nuance:
      'Alle management groups og subscriptions i katalogen samles under én rot. Tenant og root management group er forskjellige begreper; koblingen i kartet viser identitetstilknytning.',
  },
  management: {
    label: 'Management group',
    role: 'Samler subscriptions for felles styring gjennom Azure Policy og Azure RBAC.',
    nuance:
      'Hver management group har én overordnet. Egne management groups er valgfrie; en subscription kan ligge rett under roten. Alle i gruppen må stole på samme Entra tenant.',
  },
  subscription: {
    label: 'Subscription',
    role: 'En avgrensning for administrasjon, fakturering og ressursbruk. Inneholder resource groups.',
    nuance:
      'En subscription har én overordnet management group og er knyttet til én Entra tenant om gangen. Subscriptions er ikke bundet til én region. Tenantbytte har konsekvenser for tilgang.',
  },
  group: {
    label: 'Resource group',
    role: 'Samler relaterte ressurser som skal administreres gjennom en felles livssyklus. Gruppen tilhører én subscription.',
    nuance:
      'Regionen gjelder gruppens metadata. Ressursene kan ligge i andre regioner. Resource groups kan ikke nestes. Azure støtter også ressurstyper på andre scopes; her viser vi vanlige tjenester i grupper.',
  },
  resource: {
    label: 'Azure resource',
    role: 'En konkret tjenesteinstans, for eksempel en webapp eller en storage account. I dette eksemplet tilhører hver ressurs én resource group.',
    nuance:
      'Ressursens region er separat fra gruppens metadataregion. Ikke alle Azure-tjenester er regionale. Linjene i dette kartet viser organisering, ikke nettverk eller datatrafikk.',
  },
};
export const creationErrors: Record<CreationError, string> = {
  'invalid-name': 'Bruk et gyldig navn på 1–90 tegn uten punktum til slutt.',
  'invalid-region': 'Velg en av regionene som støttes i simuleringen.',
  'invalid-parent': 'En resource group må ligge under en subscription.',
  duplicate: 'Denne subscription har allerede en resource group med dette navnet.',
  limit:
    'Denne lille simuleringen støtter tre nye grupper. Nullstill kartet for å øve igjen; XP beholdes.',
};
export const questions: {
  id: QuestionId;
  prompt: string;
  options: { id: string; text: string; explanation: string }[];
}[] = [
  {
    id: 'parent',
    prompt: 'Hvor oppretter du en resource group?',
    options: [
      {
        id: 'region',
        text: 'Direkte under en Azure-region',
        explanation:
          'Regioner beskriver geografisk plassering. En resource group tilhører en subscription.',
      },
      {
        id: 'subscription',
        text: 'Under en subscription',
        explanation: 'Riktig. Subscription er gruppens overordnede administrasjonsscope.',
      },
      {
        id: 'group',
        text: 'Inne i en annen resource group',
        explanation: 'Resource groups kan ikke nestes. Begge gruppene må tilhøre en subscription.',
      },
    ],
  },
  {
    id: 'geography',
    prompt: 'Gruppens metadata er i Norway East. Må en App Service i gruppen også være der?',
    options: [
      {
        id: 'same',
        text: 'Ja, alle ressurser arver gruppens region',
        explanation:
          'Gruppens region bestemmer plasseringen av metadata, ikke regionen til hver ressurs.',
      },
      {
        id: 'independent',
        text: 'Nei, ressursens region velges separat',
        explanation:
          'Riktig. App Service kan ligge i West Europe selv om gruppens metadata ligger i Norway East. Policy og tjenestestøtte kan begrense valgene.',
      },
      {
        id: 'move',
        text: 'Nei, Azure flytter automatisk gruppens metadata',
        explanation:
          'Å velge ressursregion flytter ikke gruppens metadata. De to plasseringene er separate.',
      },
    ],
  },
  {
    id: 'tenant',
    prompt: 'Hva beskriver forholdet mellom subscriptions og Microsoft Entra tenant?',
    options: [
      {
        id: 'many-directories',
        text: 'En subscription stoler på mange tenants samtidig',
        explanation:
          'En subscription er knyttet til én Entra tenant om gangen. Ekstern tilgang er et annet spørsmål.',
      },
      {
        id: 'one-each',
        text: 'En tenant kan bare ha én subscription',
        explanation:
          'En tenant kan være knyttet til flere subscriptions med separate fakturerings- og administrasjonsgrenser.',
      },
      {
        id: 'one-directory',
        text: 'En tenant kan ha flere subscriptions; hver stoler på én tenant',
        explanation:
          'Riktig. Flere subscriptions kan dele identitetskatalog. Alle subscriptions under samme management group må stole på samme tenant.',
      },
    ],
  },
];
