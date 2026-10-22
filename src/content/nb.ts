import type { QuestionId } from '../domain/assessment';
import type { CreationError, Region, ScopeKind } from '../domain/simulation';

export const nb = {
  brand: 'AzureLab',
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
        text: 'Et appteam trenger en resource group i sin sandbox. Gå inn, finn riktig subscription og opprett gruppen. Identitet, styringsomfang og geografi må holdes fra hverandre.',
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
    portalSkills: 'G01 · F02 / scope, identitet og lokasjon',
    portalActions: 'Velg subscription → opprett resource group → reflekter',
    portalBoundary: 'Støtter tre simulerte grupper. Ingen Azure-operasjoner utføres.',
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
    phase: 'PHASE 1A.5',
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
      'Reiseposisjon, innsendte øvingssvar, simulerte ressurskommandoer og milepæler lagres på denne enheten. Ingen konto, sporing eller leaderboard. Nettleserdata kan endres eller slettes og er ikke et kompetansebevis.',
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
