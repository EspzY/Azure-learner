import type { QuestionId } from '../domain/assessment';
import type { CreationError, Region, ScopeKind } from '../domain/simulation';

export const nb = {
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
      'Du har undersøkt tjenestemodeller på reisen. Nå skal valget bli en sammenhengende konfigurasjon. Teamet har egen webkode og vil slippe å drifte et gjeste-OS.',
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
