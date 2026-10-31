import type { QuestionId } from '../domain/assessment';
import type { CreationError, Region, ScopeKind } from '../domain/simulation';

export const nb = {
  milestones: {
    where: 'Hvor finner du kontrollen?',
    targetLocations: {
      search: 'Global search øverst i Portal-headeren.',
      'vm-image': 'Image i VM-skjemaets Basics-fane.',
      'vm-profile': 'Size / learning profile i VM-skjemaets Basics-fane.',
      'vm-disk': 'Data disk i VM-skjemaets Disks-fane.',
      'vm-network': 'Subnet i VM-skjemaets Networking-fane.',
      'vm-details': 'VM-ressursens Overview og tilknyttede ressurser.',
      'inspect-practical': 'Undersøk ressurs i oversikten til labbens valgte ressurs.',
      settings: 'Environment variables → App settings i den aktuelle Web App-en.',
      groups: 'Resource groups i tjenestenavigasjonen.',
      create: 'Create i den aktuelle tjenestens command bar.',
      subscription: 'Subscription i opprettelsesskjemaets Project details.',
      name: 'Name eller Resource group name i opprettelsesskjemaets Basics.',
      region: 'Region i det aktuelle opprettelsesskjemaet.',
      group: 'Resource group i opprettelsesskjemaets Project details.',
      plan: 'App Service plan i Web App-skjemaet.',
      review: 'Review + create i opprettelsesskjemaet.',
      validation: 'Validation-resultatet i Review + create. Dette er inspeksjon, ikke Create.',
      commit: 'Create etter vellykket Review + create.',
      resource: 'Overview for ressursen som dette oppdraget undersøker.',
      receipt:
        'Operation receipt i arbeidsflaten for den aktuelle kommandoen. Tidligere operasjoner finnes i Activity log.',
      policy: 'Policy-visningen og den aktuelle regelens scope.',
      architecture: 'Architecture Explorer i AzureLab-verktøylinjen.',
      relationship: 'App → plan-relasjonen i Architecture Explorer.',
    },
    prerequisiteTitle: 'Dette trenger du å forstå først',
    prerequisites: {
      vm: 'Kjenn forskjellen mellom fysisk vert og gjeste-OS, RAM og lagring, og Resource group og resource location. Labben lar deg undersøke støttede disk- og nettverksavhengigheter.',
      paas: 'Kjenn PaaS og retained kundeansvar. En gruppe organiserer ressurser, en plan gir hosting, og appen refererer planen. Gruppemetadata og ressurslokasjon er ulike egenskaper.',
      saas: 'Kjenn forskjellen mellom ferdig programvare og egen kode. Lisens, administrasjonsrolle og datadeling er separate forhold, også når leverandøren driver applikasjonen.',
    },
    briefAction:
      'Start oppdraget åpner den beskrevne øvelsen og dens støttede kontroller. Tilbake til leksjonen lukker bare denne innledningen. Du oppretter ingen ressurs før du selv sender en gyldig teknisk handling.',
    briefRecallAction:
      'Fortsett undersøkelsen og Lukk oppdragsbrief tar deg tilbake til den pågående øvelsen. De utfører ingen ressursoperasjon og fullfører ingen læringsoppgave.',
    reading: 'Forklaring og observasjoner — rull ved behov',
    contextUnavailable:
      'SavvyShark-veiledningen er satt på pause fordi lagret vurderings- eller labkontekst er utdatert eller ikke kan verifiseres. Ingen løsningshjelp vises før konteksten er lest på nytt. Last inn lagret tilstand med knappen nedenfor; gyldige svar og teknisk arbeid slettes ikke.',
    library: 'SavvyShark · Faglige milepæler',
    open: 'Åpne forklaring',
    eyebrow: 'SAVVYSHARK · TEKNISK OBSERVASJON',
    cause: 'Hvorfor skjedde dette?',
    consequence: 'Hva betyr resultatet?',
    next: 'Hva undersøker du nå?',
    actual: 'Dette har simulatoren registrert',
    receipt: 'Operation receipt',
    scope: 'Resource group',
    region: 'Requested resource location',
    allowed: 'Tillatte lokasjoner i denne regelen',
    inventory: 'Modellobjekter før → etter',
    close: 'Tilbake til laboratoriet',
    defer: 'Lukk foreløpig',
    boundary:
      'Forklaringen gir verken XP, fullføring eller uavhengig kompetanse. Ingen handling utføres for deg.',
    storage:
      'Automatiske milepælsvinduer er slått av fordi visningshistorikken ikke kan lagres sikkert. Forklaringene kan fortsatt åpnes her.',
    policy: {
      title: 'Policyen avviste konfigurasjonen',
      main: 'Forespørselen er behandlet, men den ønskede App Service-planen ble ikke opprettet.',
      cause:
        'Den lokale custom Web-policyen sammenholder ressursens ønskede lokasjon med regelen på det aktuelle management-scopet. Avslaget skyldes den konfigurasjonen, ikke et oppfunnet innloggings- eller tillatelsesproblem.',
      consequence:
        'Kvitteringen viser samme ressursantall før og etter. Å endre Resource group-metadata flytter ikke planen og løser ikke denne Web-resource-regelen. Dette er en avgrenset treningspolicy, ikke alle Microsofts innebygde location policies.',
      next: 'Sammenlign Requested resource location, assignment scope og tillatte lokasjoner. Velg selv en korrigering i planskjemaet og undersøk den nye kvitteringen.',
    },
    vm: {
      title: 'En VM har faktiske avhengigheter',
      main: 'Den aksepterte lokale transaksjonen inneholder en VM med koblet OS-disk og nettverksgrensesnitt.',
      cause:
        'OS-disken inneholder gjestens operativsystem. NIC knytter VM-en til et subnet i et VNet. Disk attachment og NIC attachment er avhengigheter; Resource group-medlemskap er management-organisering.',
      consequence:
        'De viste navnene og koblingene kommer fra den replayede ressursmodellen. NIC-konfigurasjon beviser ingen nettverkstrafikk. En akseptert lokal VM-konfigurasjon betyr heller ikke at et operativsystem er startet eller at programvare kjører.',
      next: 'Åpne OS-disken og NIC fra ressursoversikten. Sammenlign avhengighetsreferanser, resource location og Resource group før du forklarer observasjonen i labben.',
    },
    roles: {
      vm: 'Virtual machine',
      osDisk: 'OS disk',
      nic: 'Network interface',
      subnet: 'Subnet',
      vnet: 'Virtual network',
    },
  },
  auditReview: {
    title: 'AZ-900-dekningsaudit — til gjennomgang',
    description:
      'Denne previewen leverer kartlegging og utviklingsplan. Kurs, vurderinger og simulator er uendret.',
    open: 'Les dekningsmatrisen og planen (GitHub, ny fane)',
  },
  portalUi: {
    missingIcon: 'Ikonreferanse mangler – rapporter dette avviket.',
    allLocations: 'All locations',
    resourceDetails: 'Resource details',
    planDetails: 'App Service Plan details',
    nextTags: 'Next : Tags >',
    showValue: 'Show value',
    hideValue: 'Hide value',
    hideValues: 'Hide values',
    training: 'TRAINING SIMULATOR',
    services: 'Services',
    documentation: 'Documentation',
    create: 'Create a resource',
    favorites: 'FAVORITES',
    learningTools: 'AzureLab learning tools',
    learningLayer: 'Learning context',
    navigate: 'Navigate',
    serviceSearch: 'Search services',
    resourceSearch: 'Search this resource',
    general: 'General',
    settings: 'Settings',
    properties: 'Properties',
    essentials: 'Essentials',
    disks: 'Disks',
    networking: 'Networking',
    related: 'Related resources',
    localId: 'Local resource ID',
    show: 'Show values',
    edit: 'Edit',
    saveDraft: 'Apply',
    cancel: 'Cancel',
    editSetting: 'Edit application setting',
    settingsDraft:
      'Endringer er bare et utkast til du velger Apply. Bare de to dokumenterte treningsinnstillingene støttes; ingen hemmeligheter eller faktisk restart.',
    appearance: 'Portal appearance',
    menuBehavior: 'Portal menu behavior',
    docked: 'Docked',
    flyout: 'Flyout',
    preferenceScope:
      'Visningsvalget gjelder denne Portal-økten. Ingen lærings- eller ressursdata endres.',
    noCommands: 'No matching commands',
    closeMenu: 'Close portal menu',
    moreServices: 'More services',
    localResult: 'Simulated configuration recorded',
    localResultNote:
      'Konfigurasjonen er registrert i den lokale simulatoren. Dette er ikke et Azure-deployment eller bekreftet kjøretid.',
    notificationEmpty: 'No operations in this local attempt.',
    type: 'Resource type',
    value: 'Value',
    location: 'Location',
  },

  learningResponsibility: {
    modelNotes: {
      iaas: 'IaaS: Microsoft drifter fysisk infrastruktur. Kunden vedlikeholder blant annet gjeste-OS, runtime og egen kode.',
      paas: 'PaaS: Microsoft drifter plattformens OS og innebygde runtime. Kunden har egen kode, data, tilgang og konfigurasjon. Nettverksoppgaver avhenger av tjenesten.',
      saas: 'SaaS: Leverandøren drifter applikasjonen. Kunden må fortsatt styre brukere, data og egne innstillinger. Dette er ikke en vert for vilkårlig egen webkode.',
    },
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
  },

  expansion: {
    common: {
      version: '3.2',
      current: 'Ny undervisning',
      legacy: 'Service Types v1 · historisk versjon',
      choiceTitle: 'Behold historikken og velg undervisningsversjon',
      choiceText:
        'Du har Service Types v1-observasjoner. De bevares som historiske data. Noen gamle sammenligninger kan mangle kildekontekst. Versjon2 bruker egne aktiviteter og vurderinger; ingen gammel aktivitet oppgraderes.',
      keepLegacy: 'Åpne historisk v1',
      startCurrent: 'Start Service Types versjon 2',
      viewLegacy: 'Se bevart Service Types v1',
      viewCurrent: 'Tilbake til nåværende Service Types',
      legacyWarning:
        'Dette er den bevarte v1-undervisningen og dens opprinnelige vurderinger. Den er ikke den utvidede operative versjonen.',
      nextBenefits:
        'Du kjenner nå cloud-ressursene. Fortsett med hvilke driftsfordeler de kan gi, og hvilke betingelser som må være oppfylt.',
      nextServices:
        'Du har undersøkt kapasitet, recovery og styring. Neste modul gjør servicegrensene konkrete gjennom VM-, plattform- og SaaS-valg.',
      beginnerRecap: 'Grunnlaget: hvem gjør hvilken oppgave?',
      recapNote:
        'Her fordeler vi grunnleggende fysisk arbeid, data og klientansvar. Full operativ service-sammenligning og nye konfigurasjonsvalg følger i modul 3.',
      recapCases: [
        ['physical', 'En fysisk vert må vedlikeholdes'],
        ['data', 'Teamets kundedata deles for bredt'],
        ['identity', 'En ansatt skal ikke lenger ha tilgang'],
      ],
      recapDeep: 'Undersøk den operative service-sammenligningen',
      prerequisite: 'Før du undersøker',
      mechanism: 'Mekanismen',
      azure: 'I Azure og i drift',
      worked: 'Gjennomarbeidet eksempel',
      counterexample: 'Misforståelse og moteksempel',
      limits: 'Forutsetninger og modellgrenser',
      terms: 'Begreper i denne undersøkelsen',
      goal: 'Mål',
      why: 'Hvorfor dette er viktig',
      action: 'Gjør dette',
      expect: 'Forventet observasjon',
      run: 'Kjør undersøkelsen',
      prediction: 'Forutsi utførte jobber per minutt',
      predictionHelp:
        'Skriv et heltall før resultatet vises. Hypotesen lagres, også hvis den er feil.',
      invalid: 'Kontroller de avgrensede verdiene og fyll inn en gyldig prediksjon.',
      pending:
        'Konfigurasjonen er endret. Kjør igjen for å se resultatet av akkurat disse valgene.',
      compare: 'Prøver du har utført',
      required: 'Observasjoner før veiledet godkjenning',
      check: 'Begrunn observasjonen',
      correct: 'Begrunnelsen passer',
      wait: 'Utfør de angitte undersøkelsene først. Å åpne siden gir ingen øvingsgodkjenning.',
      introduced: 'Introdusert',
      practiced: 'Veiledet undersøkt',
      notYet: 'Ikke bekreftet',
      summary: 'Observasjoner og neste steg',
      summaryNote:
        'Dette er lokale observasjoner fra avgrensede oppgaver. Introduksjon, guided practice og første uavhengige svar er separate. Ingen XP, offisiell Learn-fullføring, mestringsprosent eller eksamensberedskap beregnes.',
      assessment: 'Endret uavhengig oppgave',
      begin: 'Start egen besvarelse',
      submit: 'Lever hele besvarelsen',
      cancel: 'Avslutt forsøket uten innlevering',
      cancelled: 'Avsluttet uten innlevering',
      cancelledNote:
        'Avsluttede forsøk er bevart; et senere forsøk er ikke en ny førsteinnlevering.',
      draft: 'Svarutkast lagres. Ingen fasit vises før en faktisk innlevering.',
      assisted: 'Hjelp registrert i forsøket',
      first: 'Første innlevering uten registrert hjelp',
      retry: 'Nytt forsøk · øving etter tidligere forsøk',
      firstAssisted: 'Første innlevering med registrert hjelp',
      submitted:
        'Innleveringen er registrert før tilbakemeldingen vises. Kontroller eventuelle lagringsvarsler.',
      hint: 'Vis prinsippstøtte (registreres som hjelp)',
      hintText:
        'Følg den nødvendige funksjonen gjennom komponenter, avhengigheter og driftsansvar. Skill riktig konfigurasjon fra kapasitet, tilgjengelighet og sikkerhet.',
      noAssessment: 'Ingen innlevering i denne versjonen',
      newAttempt: 'Prøv en ny besvarelse',
      choose: 'Velg selv',
      sources: 'Kilder og valgfri fordypning',
      review: 'Kilder kontrollert 25. oktober 2026 · menneskelig Azure-SME-review gjenstår',
      storage:
        'Denne modulens lagring trenger oppmerksomhet. Tidligere gyldig arbeid er ikke slettet.',
      reload: 'Les lagret modul på nytt',
      reset: 'Nullstill bare denne modulens observasjoner',
      confirmReset: 'Bekreft sletting av denne modulens lokale observasjoner',
      memory: 'Skriving ble avvist. Arbeidet finnes bare i minnet til denne fanen.',
      legacyResults: 'Historiske v1-svar beholdes separat',
      noNewEvidence:
        'Å lese, navigere eller bruke en annen moduls visualisering gir ingen godskriving her.',
      existingLab: 'Gjenbruk dokumentert teknisk arbeid',
      existingLabNote:
        'Du kan undersøke tidligere aksepterte ressurser og kvitteringer i denne tekniske økten. Ingen gamle læringsobservasjoner flyttes til den nye versjonen.',
      technicalRequired:
        'Den praktiske delen krever både den nye begrunnelsen og bekreftet faktisk labkonfigurasjon med inspeksjoner.',
      technicalReady: 'Labkonfigurasjon og inspeksjoner bekreftet i gjeldende tekniske økt',
      technicalMissing: 'Teknisk grunnlag er ikke fullstendig bekreftet i gjeldende økt.',
      preview: 'Konfigurasjonsskisse · kjør undersøkelsen for validert tilbakemelding',
      vm: {
        host: 'Leverandørens fysiske vert',
        boundary: 'Virtuell gjest · kundens programvarestakk',
        os: 'Gjeste-OS',
        resources: 'Tildelte ressurser',
        runtime: 'Runtime og vedlikehold',
        needs:
          'Oppdrag: Windows, åtte GiB, varige appdata og avklart drift. vCPU er et eget valg; vi måler ikke ytelse.',
        disk: 'Separat appdata',
        nic: 'Kommunikasjon',
      },
      platform: {
        input: 'Kundens leveranse',
        gate: 'Plattformens kompatibilitetsgrense',
        runtime: 'Støttet innebygd runtime',
        retained: 'Kundevalg som fortsatt må avklares',
        blocked: 'Denne leveransen passer ikke den valgte innebygde plattformen',
        allowed: 'Leveransen passer denne modellens plattformkrav',
      },
      saasModel: {
        provider: 'Ferdig samarbeidsfunksjon · leverandøren drifter appen',
        person: 'Mina',
        entry: 'Konto og tjenestelisens',
        authority: 'Bruk eller administrasjon',
        data: 'Delingsgrense',
        departed: 'Konto avsluttet · vurder tidligere delinger separat',
      },
      choiceModel: {
        requirements: 'Kravene kommer først',
        legacy: 'Windows-agent med behov for gjeste-OS-kontroll',
        custom: 'Egen støttet webkode uten ønske om gjeste-OS-drift',
        ready: 'Ferdig samarbeid uten egen appkode',
        open: 'Webkode og team som kan velge begge driftsmodeller',
        boundary: 'Valgt tjenestegrense',
        reason: 'Teamets begrunnelse',
        evaluate: 'Undersøk om både tjenestegrensen og begrunnelsen svarer på kravene.',
      },
      resumeAssessment: 'Fortsett aktiv besvarelse',
      guidedComplete: 'Alle nødvendige veiledede aktiviteter er bekreftet',
      guidedIncomplete: 'Veiledet løp har fortsatt ubekreftede aktiviteter',
      foundationRecord: 'Foundations-observasjoner beholdes i sine opprinnelige versjoner.',
      labels: {
        instances: 'Antall instanser',
        size: 'Kapasitet per instans · jobber/min',
        demand: 'Etterspørsel · jobber/min',
        failed: 'Feil på første instans',
        routing: 'Trafikkrute',
        incident: 'Hva har endret seg?',
        remedy: 'Tiltak som undersøkes',
        subscription: 'Mål-subscription for forespørselen',
        region: 'Ønsket Web-lokasjon',
        method: 'Konfigurasjonsmetode',
        a: 'Miljø A',
        b: 'Miljø B',
        c: 'Miljø C',
        template: 'Malverdi',
        profile: 'Funksjonens behov',
        capacity: 'Kapasitet per kopi',
        hours: 'Timer på per døgn',
        copies: 'Antall kopier',
        guest: 'Gjesteoperativsystem',
        ram: 'Minne · GiB',
        cpu: 'vCPU',
        disk: 'Appdata',
        network: 'Nettverkskrav',
        runtime: 'Nødvendig runtime',
        patch: 'Gjestevedlikehold',
        package: 'Applikasjonsleveranse',
        config: 'Appkonfigurasjon',
        access: 'Apptilgang',
        data: 'Datahåndtering',
        user: 'Kontoens status',
        role: 'Rolle for Mina',
        sharing: 'Dokumentdeling',
        license: 'Tjenestelisens',
        scenario: 'Kravsituasjon',
        model: 'Tjenestemodell',
        reason: 'Faglig begrunnelse',
      },
      values: {
        none: 'Ingen feil',
        one: 'Første instans nede',
        single: 'Fast til første instans',
        balanced: 'Bruk friske kopier',
        capacity: 'Økt etterspørsel',
        instance: 'Instansfeil',
        dependency: 'Felles avhengighet nede',
        trend: 'Stigende belastning',
        scale: 'Øk webkapasiteten',
        reroute: 'Bruk en frisk alternativ instans',
        restore: 'Gjenopprett avhengigheten',
        observe: 'Overvåk trend og planlegg margin',
        manual: 'Tre manuelle valg',
        template: 'Én gjentatt malverdi',
        dev: 'Dev · bare åtte arbeidstimer',
        critical: 'Kritisk · hele døgnet',
        linux: 'Linux',
        windows: 'Windows',
        persistent: 'Varig datalagring',
        temporary: 'Midlertidige appdata',
        configured: 'Nettverksbehov avklart',
        missing: 'Mangler',
        installed: 'Installert/avklart',
        planned: 'Planlagt og eid av teamet',
        ignored: 'Ikke planlagt',
        supported: 'Støttet webkode',
        unsupported: 'Runtime ikke støttet',
        driver: 'Krever OS-driver',
        set: 'Nødvendige innstillinger avklart',
        restricted: 'Tilgangskrav avklart',
        public: 'Tilgang ikke avgrenset for oppdraget',
        active: 'Aktiv medarbeider',
        departed: 'Avsluttet/blokkert konto',
        user: 'Vanlig bruker',
        admin: 'Hele tjenestens administrator',
        team: 'Bare avtalt team',
        everyone: 'Alle med lenken',
        assigned: 'Tildelt',
        unlicensed: 'Ingen',
        legacy: 'OS-spesifikk agent',
        custom: 'Egen webkode, ingen gjeste-OS-drift',
        ready: 'Ferdig samarbeid',
        open: 'Webkode med to driftsmuligheter',
        iaas: 'IaaS',
        paas: 'PaaS',
        saas: 'SaaS',
        'os-team': 'Teamet tar gjeste-OS og programvarestakken',
        'platform-supported': 'Støttet plattform, kunden tar kode/data/tilgang',
        'ready-service': 'Ferdig funksjon, kunden styrer bruk og data',
      },
      results: {
        served: 'Utført arbeid',
        unmet: 'Udekket behov',
        available: 'Tilgjengelig kapasitet',
        unused: 'Ubrukt allokering',
        allocated: 'Kapasitetstimer',
        utilization: 'Utnyttelse',
        undefined: 'Ikke definert',
        consistent: 'Like verdier',
        violations: 'Avvik fra standard',
        yes: 'Ja',
        no: 'Nei',
        requirements: 'Avklarte krav',
        risks: 'Gjenværende forhold',
        noGuarantee:
          'Et passende undervisningsoppsett er ikke bevis på deployering, helse eller sikkerhet.',
        provider: 'Leverandørens fysiske vert og virtualisering',
        guest: 'Kundens gjest og arbeidslast',
        instance: 'Applikasjonsinstans',
        alternative: 'Alternativ instans',
        storage: 'Appdata på disk',
        network: 'NIC og nettverksvei',
        platform: 'Administrert hosting-plan',
        application: 'Kundens kode og konfigurasjon',
        dependency: 'Kritisk avhengighet',
        route: 'Trafikkvalg',
        client: 'Brukerens arbeid',
        observations: 'Frosne observasjoner · ingen levende telemetry',
        role: 'Administrasjonsmyndighet',
        sharing: 'Dataeksponering',
        canUse: 'Kan bruke tjenesten i modellen',
        consistentWrong: 'Oppsettet er likt, men standarden er brutt.',
        drift: 'Manuelle verdier avviker fra hverandre og/eller standarden.',
        aligned: 'Oppsettet passer de avgrensede oppdragskravene.',
        failed: 'Dette valget retter ikke den aktuelle årsaken.',
        capacityFixed:
          'Økt kapasitet dekker denne etterspørselen. Det er ingen test av andre feil.',
        capacityLimited: 'Etterspørselen er større enn tilgjengelig kapasitet.',
        instanceFixed: 'En frisk alternativ instans er nå nåbar gjennom modellens rute.',
        instanceDown: 'Den faste veien ender fortsatt i en sviktet instans.',
        dependencyFixed:
          'Den nødvendige avhengigheten er gjenopprettet i situasjonen; test hele flyten i en virkelig løsning.',
        dependencyDown: 'Felles avhengighet holder flyten stengt selv om webkapasiteten er stor.',
        trendPlanned:
          'Observasjon og plan er forbedret. Kapasiteten er ikke automatisk økt; trenden har fortsatt ingen margin i siste prøve.',
        trendUnplanned: 'Siste prøve bruker hele kapasiteten. Ingen planlagt oppfølging er valgt.',
        resourceSaving:
          'Modellert ressursbruk må sammenholdes med udekket behov. Resultatet er ikke energi eller utslipp.',
        permission: 'Autorisasjon er forutsatt; RBAC er ikke evaluert.',
        security: 'Ingen sikkerhets- eller compliance-konklusjon følger av kvitteringen.',
        fork: 'Engangskopi av den eksisterende motoren · ikke Portal-inventar',
        policyScope: 'Tildelt policy-scope',
        applies: 'Forespørselen er innenfor scope',
        outside: 'Forespørselen er utenfor scope',
        physical: 'Fysiske lag finnes fortsatt; ingen gjest er provisionert her.',
        vmMissing: {
          os: 'Programmet trenger Windows i oppdraget.',
          ram: 'Programmet trenger minst åtte GiB i oppdraget.',
          disk: 'Appdata må ligge på varig lagring.',
          network: 'Kommunikasjonsbehovet mangler avklart nettverksvei.',
          runtime: 'Programmet trenger installert runtime.',
          patch: 'Teamet mangler plan for gjestevedlikehold.',
        },
        paasCause: {
          unsupported:
            'Valgt innebygd plattform støtter ikke denne runtime-en. Mer compute retter ikke kompatibilitet.',
          driver:
            'Denne leveransen krever OS-kontroll som den valgte innebygde plattformen ikke tilbyr.',
          configuration:
            'Støttet kode alene er ikke nok; kundevalg for innstillinger, tilgang og data gjenstår.',
          fit: 'Støtte og kundevalg passer de avgrensede kravene. Ingen kode er deployert eller kjørt.',
        },
        saasCause: {
          inactive:
            'Kontoen kan ikke bruke tjenesten i modellen. Tidligere deling og dataforpliktelser må likevel vurderes.',
          unlicensed:
            'En aktiv konto uten nødvendig tjenestelisens oppfyller ikke denne modellens bruksvilkår.',
          admin: 'Samarbeidsoppgaven trenger ikke administrasjon av hele tjenesten.',
          sharing: 'Alle-med-lenken er bredere enn det avtalte teambehovet.',
          fit: 'Aktiv, lisensiert bruker med avgrenset rolle/deling passer samarbeidskravet. Det er ingen generell sikkerhetsgodkjenning.',
        },
      },
      witnesses: {
        baseline: 'Observer én frisk instans med kapasitet åtte',
        singleFailure: 'Observer den samme enkeltinstansen etter feil',
        redundant: 'Observer to instanser, balansert rute og én feil',
        capacity: 'Undersøk et kapasitetstiltak',
        instance: 'Undersøk en korrigert feilrute',
        dependency: 'Undersøk en gjenopprettet avhengighet',
        trend: 'Undersøk trend og oppfølging',
        denied: 'Observer faktisk location-policyavslag',
        allowed: 'Observer tillatt lokasjon under samme scope',
        otherScope: 'Sammenlign det andre scope-et',
        manual: 'Observer manuelle konfigurasjonsavvik',
        rightTemplate: 'Observer riktig gjentatt mal',
        wrongTemplate: 'Observer konsekvent feil mal',
        devAlways: 'Undersøk stor døgnallokering for dev',
        devScheduled: 'Undersøk mindre arbeidsdag-plan for dev',
        critical: 'Test tidsplanen mot kritisk døgnbehov',
        incomplete: 'Undersøk en ufullstendig VM-plan',
        complete: 'Avklar alle støttede VM-forutsetninger',
        incompatible: 'Undersøk en ikke-støttet plattformleveranse',
        supported: 'Avklar støttet kode og retained kundevalg',
        risky: 'Undersøk for brede SaaS-valg',
        safe: 'Avklar avtalt bruker, lisens, rolle og deling',
        departure: 'Undersøk avgang/blokkert konto',
        legacy: 'Begrunn OS-spesifikt krav',
        custom: 'Begrunn egen kode uten OS-drift',
        ready: 'Begrunn ferdig tjeneste',
        open: 'Begrunn en rimelig åpen løsning',
        iaas: 'Sammenlign IaaS i modul 3',
        paas: 'Sammenlign PaaS i modul 3',
        saas: 'Sammenlign SaaS i modul 3',
      },
    },
    benefits: {
      intro:
        'Du vet nå hvordan skyen tilbyr ressurser. Nettbutikken vår trenger også å tåle feil, håndtere endringer og styres forsvarlig. Vi undersøker hva skyegenskaper kan gi — og hvilke valg teamet må gjøre for å få nytte av dem. Ingen undersøkelse her lager eller overvåker virkelige ressurser.',
      units: {
        availability: {
          title: 'Kapasitet er ikke det samme som tilgjengelighet',
          objective: 'CB01 · skille vertikal/horizontal skalering, redundans og tilgjengelighet.',
          prerequisite:
            'Fra modul 1 kjenner du server, ressurskapasitet og etterspørsel. En instans er én kjørende kopi av en applikasjonskomponent. Redundans betyr at flere kopier kan overta arbeid.',
          intuition:
            'Butikken kan ha en kraftig server som håndterer hele kampanjen, men likevel stoppe hvis akkurat den serveren svikter. Tilgjengelighet handler om at den nødvendige funksjonen kan brukes når den trengs. High availability er bevisste tiltak for å redusere avbrudd. Det er et annet spørsmål enn hvor mange oppgaver maskinen rekker når alt virker.',
          mechanism:
            'Vertikal skalering endrer kapasiteten til en instans, for eksempel ved å velge mer CPU eller minne. Horisontal skalering endrer antallet instanser. Flere kopier hjelper først når trafikken faktisk kan nå dem og applikasjonen tillater parallell behandling. En fast rute til den første instansen blir fortsatt et enkelt feilpunkt. Redundans må også omfatte nødvendige data og andre avhengigheter; ekstra webservere retter ikke alle feil.',
          azure:
            'Azure gir tjenester og konfigurasjoner for skalering og redundans. Hvilke muligheter som finnes, avhenger av tjeneste, tier og arkitektur. Elasticity er å tilpasse kapasiteten opp og ned når behovet endres. Autoskalering trenger regler, grenser, signaler og tid til å gjøre kapasiteten klar; den lager ikke øyeblikkelig eller ubegrenset kapasitet. En SLA beskriver et bestemt tjenesteløfte med vilkår og eventuelle rettsmidler. Den er ikke en måling av din applikasjons tilgjengelighet eller et løfte om null nedetid.',
          example:
            'Anta én undervisningsinstans som kan behandle fire jobber per minutt, og etterspørsel på seks. Når vi øker instansstørrelsen til åtte, kan den håndtere alle seks så lenge den virker. Dette løser kapasitetsproblemet i denne modellen. Nå skal du selv forutsi hva som skjer når denne ene instansen svikter, og sammenligne med flere mindre kopier og en rute som bruker friske kopier.',
          misconception:
            'To instanser betyr ikke automatisk dobbel tilgjengelighet. Samme strømforsyning, dataavhengighet eller feil i trafikkstyringen kan ramme begge. Omvendt kan én større instans gi bedre kapasitet uten å tåle tap av instansen. Vi beregner derfor observerbar kapasitet etter feil, ikke en oppdiktet Azure-SLA.',
          limits:
            'En jobb er en oppdiktet arbeidsmengde. Hver instans kan behandle fire eller åtte slike jobber per minutt. Jobber deles perfekt mellom tilgjengelige instanser; kø, oppstartstid, tilstand, data, kostnad og latency er utelatt. Feilen rammer den første instansen. Fast rute bruker bare den første; balansert rute bruker de friske. Dette er en forklaringsmodell, ikke en lastbalanserer eller virkelig feiltest.',
          terms: [
            ['Instans', 'En kopi av en komponent som kan behandle arbeid.'],
            ['Enkelt feilpunkt', 'En nødvendig del som alene kan stoppe hele funksjonen.'],
            ['Headroom', 'Ledig kapasitet som kan absorbere mer arbeid eller tap av en kopi.'],
          ],
          goal: 'Undersøk forskjellen mellom kapasitet og feilmargin.',
          why: 'En større maskin og en ekstra kopi løser forskjellige problemer.',
          action:
            'Kjør en frisk enkeltinstans. Forutsi deretter utført arbeid med feil, og sammenlign med to instanser og balansert rute.',
          expect:
            'Bare kapasitet som fortsatt kan nås etter feilen, bidrar. Resultatet viser utført og udekket arbeid.',
          question:
            'En kraftigere enkeltinstans dekker trafikken. Hva må undersøkes før teamet kan si at løsningen tåler instansfeil?',
          choices: [
            [
              'recovery',
              'Alternative kopier, trafikkrute og nødvendige avhengigheter',
              'Ja. Nok kapasitet uten feil er ikke det samme som en fungerende vei etter feil.',
            ],
            [
              'size',
              'Bare mer minne på samme instans',
              'Mer minne kan bedre kapasitet, men hjelper ikke når den eneste instansen er nede.',
            ],
            [
              'cloud',
              'At ressursen ligger i en offentlig sky',
              'Skyleverandørens infrastruktur fjerner ikke behovet for å utforme og teste hele applikasjonsflyten.',
            ],
          ],
        },
        reliability: {
          title: 'Finn årsaken før du velger tiltak',
          objective: 'CB02 · forklare pålitelighet, recovery og forutsigbarhet.',
          prerequisite:
            'Du kjenner instans, kapasitet og trafikkrute. En avhengighet er en annen tjeneste som en nødvendig funksjon trenger, for eksempel lageroppslag før et kjøp.',
          intuition:
            'Et raskt produktbilde er ikke nok hvis kunden ikke kan fullføre kjøpet. Vi må følge den viktige brukerflyten. Reliability handler her om å tåle feil og gjenopprette funksjonen på en planlagt måte. Tilgjengelighet beskriver om funksjonen kan brukes; recovery beskriver hvordan vi får den tilbake etter avbrudd.',
          mechanism:
            'Den samme synlige feilen kan ha ulike årsaker. For mye arbeid kan overskride kapasitet. En instans kan ha sviktet. En felles datatjeneste kan være utilgjengelig selv om alle webkopiene virker. En stigende belastning kan varsle at kapasiteten snart blir for liten. Et tiltak må påvirke den delen som faktisk begrenser flyten. Mer webkapasitet reparerer ikke lagerdatatjenesten. En ekstra region krever også fungerende data, identitet, trafikkvalg og en testet bytteprosess.',
          azure:
            'Azure Monitor kan samle relevante signaler, og varsler kan gjøre avvik synlige når de er riktig konfigurert. Observasjoner, hypoteser, tiltak og kontroll av resultatet er en driftsprosess; et dashboard utfører ikke hele prosessen. Well-Architected Framework fremhever blant annet avhengigheter, redundans, recovery og testing. Test både tap og tilbakeføring, og kontroller at reservekapasitet faktisk er tilgjengelig. Vi oppretter ingen Monitor-ressurs her.',
          example:
            'I en rolig periode betjener butikken to jobber per minutt; senere fire og seks. Med kapasitet seks ser alt håndterbart ut i siste prøve, men det er ingen margin igjen. En trend er ikke i seg selv bevis på avbrudd. Teamet bør måle videre og planlegge tiltak før neste topp. I eksperimentet undersøker du også andre hendelser der samme kapasitetsøkning ikke hjelper.',
          misconception:
            'Forutsigbarhet betyr ikke garanti. Ytelsesplanlegging bygger på målinger og lasttester; endret kode eller avhengigheter kan endre behovet. Kostnadsplanlegging bygger på faktiske målere, priser, ressursnivå, dataoverføring og bruksmønster. Kalkulatorer og budsjetter hjelper, men et budsjett er ikke automatisk en av/på-bryter. Et estimat er ikke en faktura.',
          limits:
            'Hendelsene er frosne undervisningssituasjoner. Kapasitetsproblemet har etterspørsel ti og kapasitet seks; ekstra kapasitet øker den til tolv. De andre situasjonene har etterspørsel seks. En gjenopprettet avhengighet eller korrigert rute åpner den modellerte veien. Trenden er to/fire/seks uten feil. Ingen virkelige logger, tid til recovery, priser eller regional failover simuleres.',
          terms: [
            ['Kritisk flyt', 'En ende-til-ende-funksjon virksomheten trenger.'],
            ['Recovery', 'Å gjenopprette en nødvendig funksjon etter feil.'],
            ['Prognose', 'Et begrunnet anslag basert på forutsetninger og observasjoner.'],
          ],
          goal: 'Velg et tiltak som endrer riktig årsak.',
          why: 'Mer kapasitet hjelper bare hvis det er kapasiteten som begrenser.',
          action:
            'Undersøk alle fire hendelsene. Sammenlign en feil behandling med tiltaket som påvirker den aktuelle årsaken.',
          expect:
            'En sviktende felles avhengighet kan holde flyten stengt selv med flere webressurser. Trend-planlegging endrer beredskapen, ikke allerede målt trafikk.',
          question:
            'Begge webinstansene virker, men felles lageroppslag er nede. Hva er den relevante undersøkelsen?',
          choices: [
            [
              'dependency',
              'Undersøk og gjenopprett avhengigheten og test hele kjøpsflyten',
              'Ja. Flyten trenger lageroppslaget; flere friske webkopier erstatter det ikke.',
            ],
            [
              'scale',
              'Øk alltid webkapasiteten',
              'Det endrer ikke den feilede lageravhengigheten i denne situasjonen.',
            ],
            [
              'region',
              'Anta at en ekstra region automatisk løser alt',
              'Regional spredning alene konfigurerer ikke data, trafikk eller recovery.',
            ],
          ],
        },
        governance: {
          title: 'Tillatelse, policy og sikkerhet er forskjellige spørsmål',
          objective: 'CB03 · skille tilgang, organisasjonsregler og teknisk beskyttelse.',
          prerequisite:
            'En subscription og en resource group er management-scope. En identitet representerer en bruker eller arbeidslast. Autorisasjon bestemmer hva identiteten får gjøre.',
          intuition:
            'Teamet må både kunne utføre arbeid og følge virksomhetens regler. En bruker kan ha lov til å opprette en ressurs, men likevel be om en konfigurasjon som bryter en policy. Og en akseptert konfigurasjon kan fremdeles ha sårbar kode eller uforsvarlige tilgangsvalg. Ett grønt resultat kan ikke svare på alle tre spørsmålene.',
          mechanism:
            'Azure RBAC knytter en principal, en rolle og et scope sammen. Rollen beskriver handlinger; scopet avgrenser hvor de gjelder. Minste privilegium betyr å gi nødvendig tilgang fremfor unødvendig brede rettigheter. Azure Policy vurderer ressurs- eller handlingsegenskaper opp mot definerte regler ved aktuelle scope. Policy kan blant annet brukes til standardisering, revisjon og håndheving; hvilke effekter som gjelder avhenger av definisjonen. Vi viser bare én egendefinert location-deny-regel.',
          azure:
            'I den eksisterende AzureLab-motoren er App Sandbox tildelt en Web-lokasjonsregel som bare tillater West Europe for støttede plan/app-ressurser. Gruppens metadata i Norway East er en annen egenskap og omfattes ikke av denne regelen. Shared Sandbox har ikke samme assignment. Undersøk scope, type, forespurt lokasjon og begrunnelse før du endrer noe. En gyldig forespørsel i et annet scope kan få et annet resultat.',
          example:
            'En autorisert utvikler ønsker en Web-plan i North Europe under App Sandbox. En avgrenset kopi av den virkelige lokale motoren vurderer dette i undersøkelsen. Du sammenligner deretter en tillatt lokasjon og det andre scope-et. Kvitteringen forklarer resultatet. Kopien endrer ikke portalens inventar, og demonstrasjonen utfører ingen faktisk Azure-operasjon.',
          misconception:
            'At en ressurs følger en lokasjonsregel, beviser ikke at data behandles lovlig eller at hele løsningen er sikker. Compliance handler om dokumentert oppfyllelse av relevante krav; dette krever mer enn én teknisk innstilling. Leverandørens sikkerhetsmekanismer erstatter heller ikke kundens ansvar for data, kode og tilgang. Ikke gi større rolle bare for å omgå et policyavslag.',
          limits:
            'Undersøkelsen antar at aktøren er autorisert; RBAC, rettigheter, data-residency, personvern og compliance evalueres ikke. Den gjenbruker den registrerte custom Web-policyen på en engangskopi. Dette er ikke alle Azure Policy built-ins, effekter eller tillatelsesmodeller. Ressursene fra prøven blir ikke Portal-ressurser.',
          terms: [
            ['Principal', 'En bruker, gruppe eller arbeidsidentitet som kan gis tilgang.'],
            ['Rolle og scope', 'Hva en identitet kan gjøre, og hvor tilgangen gjelder.'],
            [
              'Governance',
              'Beslutninger, standarder og oppfølging som styrer ressursbruk og risiko.',
            ],
          ],
          goal: 'Forklar hvorfor samme Web-forespørsel kan få ulikt resultat.',
          why: 'Organisatorisk tillatelse til konfigurasjon er forskjellig fra brukerens rettigheter og appens sikkerhet.',
          action:
            'Prøv begge lokasjoner i App Sandbox, og sammenlign med Shared Sandbox. Les de faktiske modellkvitteringene.',
          expect:
            'Et avslag beholder aktive objekter uendret. Å bytte metadataregion er ikke en korreksjon av planens resource location.',
          question: 'En plan blir tillatt av lokasjonsregelen. Hva vet vi da?',
          choices: [
            [
              'policy',
              'Denne forespørselen oppfyller akkurat den vurderte regelen',
              'Riktig. Rolle, sikker kode og bredere krav trenger egne vurderinger.',
            ],
            [
              'secure',
              'Hele appen er sikker og compliant',
              'Den ene policyen undersøker verken kode, brukertilgang eller alle relevante krav.',
            ],
            [
              'role',
              'Alle brukere har fått administratorrettigheter',
              'En tillatt ressurskonfigurasjon tildeler ingen roller.',
            ],
          ],
        },
        management: {
          title: 'Gjenta en konfigurasjon — også feil kan gjentas',
          objective: 'CB04 · skille styring av ressurser fra metodene som styrer dem.',
          prerequisite:
            'En konfigurasjon er et sett med ønskede egenskaper. En standard er et krav teamet har bestemt, ikke en automatisk garanti fra skyen.',
          intuition:
            'Noor skal klargjøre tre undervisningsmiljøer som skal følge samme regionale standard. Hun kan sette hvert felt manuelt, eller bruke ett gjenbrukbart konfigurasjonsgrunnlag. Begge metodene krever gjennomgang. Et program kan gjenta en feil mer konsekvent enn et menneske.',
          mechanism:
            'Management of the cloud handler om hva vi styrer: ressurser, konfigurasjon, kapasitet, helse og avvik. Management in the cloud handler om hvordan vi styrer: Portal gir et grafisk arbeidsområde; CLI og PowerShell sender kommandoer; API-er er programmerbare grensesnitt. Infrastructure as code beskriver ønsket infrastruktur i filer som kan versjoneres og gjennomgås. Bicep og ARM templates er eksempler på deklarative beskrivelser i Azure. De er ikke det samme som en skjerm, et shell eller et overvåkingssignal.',
          azure:
            'Azure Resource Manager gir et felles management-lag for støttede ressursoperasjoner. Flere klienter kan be om samme slags endring, mens validering og styringsregler fortsatt gjelder. Azure Monitor og varsler kan vise tilstand eller utløse en konfigurert arbeidsflyt, men å samle et signal er ikke automatisk å forstå eller rette årsaken. Automatisering trenger avgrensninger, tilgang, feilbehandling og kontroll av konsekvensene.',
          example:
            'Standarden i vår øvelse er West Europe for alle tre miljøene. Ett manuelt avvik gjør resultatet inkonsistent. En mal kan sette samme region tre ganger. Velger du en feil malregion, blir alle tre konsekvent feil mot standarden. Sammenlign både likhet mellom miljøene og oppfyllelse av kravet; det er to forskjellige observasjoner.',
          misconception:
            'IaC betyr ikke at alt som står i filen er sikkert eller hensiktsmessig. Versjonskontroll gjør endringen sporbar, ikke automatisk korrekt. En parameter kan være feil. En plan må gjennomgås, valideres og testes før den brukes. Konsistens, policy-etterlevelse og driftstilstand er ulike dimensjoner.',
          limits:
            'Tre regionfelt og én malverdi er en oppdiktet konfigurasjonssammenligning. Vi kjører ingen CLI, PowerShell, Bicep, ARM eller deployering og endrer ikke Portal-ressurser. Samme verdi kopieres deterministisk; rekkefølge, avhengigheter, drift detection, nettverksfeil og rettighetsmotor er ikke modellert.',
          terms: [
            ['CLI', 'Et kommandolinjegrensesnitt til en tjeneste.'],
            ['Deklarativ', 'Beskriver ønsket sluttkonfigurasjon fremfor alle håndgrep.'],
            ['Konfigurasjonsavvik', 'En egenskap som avviker fra den bestemte standarden.'],
          ],
          goal: 'Skille repeterbarhet fra riktig konfigurasjon.',
          why: 'Én dårlig parameter kan forplante seg til mange miljøer.',
          action:
            'Kjør et manuelt blandet oppsett, en riktig mal og en konsekvent feil mal. Sammenlign avvikene.',
          expect:
            'Resultatet viser både like verdier og antall brudd på standarden. En jevn rad er ikke alltid en riktig rad.',
          question:
            'Tre miljøer er like, men alle har feil region mot standarden. Hvilken konklusjon passer?',
          choices: [
            [
              'review',
              'Gjennomgå og korriger mal/parameter før ny bruk',
              'Ja. Automatiseringen har vært konsekvent, men grunnlaget var feil.',
            ],
            [
              'consistent',
              'Likhet beviser at standarden er oppfylt',
              'Likhet sier ingenting om hvilken verdi kravet faktisk krever.',
            ],
            [
              'manual',
              'Manuell konfigurering er alltid sikrere',
              'Begge metoder kan gi feil. Repeterbarhet og review må kombineres.',
            ],
          ],
        },
        sustainability: {
          title: 'Reduser unødvendig ressursbruk uten å fjerne funksjonen',
          objective: 'CB05 · forklare ressursutnyttelse og avgrense bærekraftspåstander.',
          prerequisite:
            'Du kjenner allokert kapasitet, utført arbeid og udekket behov. En kapasitetstime er her én oppdiktet kapasitetenhet holdt tilgjengelig i én time.',
          intuition:
            'Et utviklingsmiljø trenger kanskje bare kapasitet i arbeidsdagen, mens butikkens kritiske funksjon trengs hele døgnet. Begge kan ha ledig kapasitet. Det er fornuftig å redusere unødvendig bruk, men å slå av feil miljø er ingen god optimalisering. Først må teamet forstå når funksjonen faktisk må være tilgjengelig.',
          mechanism:
            'Right-sizing tilpasser ressursnivået til et begrunnet behov med passende margin. Planlagt stans kan redusere unødvendig allokering i et miljø som ikke skal brukes om natten. Flere kopier kan være nødvendig for feilmargin, men øker også ressursfotavtrykket. Effektiv kode, passende lagring, mindre unødvendig dataflyt og velvalgt observabilitet påvirker også ressursbruk. CPU-utnyttelse alene beskriver ikke hele bildet.',
          azure:
            'Azure gir muligheter for ressursvalg, skaleringsregler og planlagt drift. Valg må passe tjenestens faktiske egenskaper: å stoppe en prosess er ikke nødvendigvis det samme som å frigjøre alle fakturerte ressurser. Vedlikehold, datalagring og nettverk kan fortsatt ha konsekvenser. Bruk målte behov og dokumenterte målere for å avgjøre hva som kan reduseres. Ingen Azure-pris, energi eller utslippsfaktor inngår i denne øvelsen.',
          example:
            'Et tenkt utviklingsmiljø brukes åtte timer daglig. Åtte enheter gjennom tjuefire timer gir 192 kapasitetstimer, før vi vurderer nyttig arbeid. Det tallet er et ressursbudsjett i en undervisningsmodell, ikke kWh. Undersøk selv en mindre plan som bare er på i arbeidsdagen. Bytt deretter til den kritiske døgnfunksjonen og se hvorfor samme tidsplan får en annen konsekvens.',
          misconception:
            'Lavere kostnad eller høyere utnyttelsesgrad er ikke i seg selv et verifisert miljøresultat. Energiforbruk, strømproduksjonens utslippsintensitet, maskinvare, datamengder, grenser og måleperiode må vurderes. En cloud-løsning kan fortsatt være overdimensjonert. Ikke fjern nødvendig redundans bare for å få et penere utnyttelsestall.',
          limits:
            'Utviklingsbehovet er to undervisningsjobber per time i åtte timer; kritisk behov er to i alle tjuefire. Kapasitet er fire eller åtte per kopi, én eller to kopier, på i åtte eller tjuefire timer. Avstengte timer gir ingen kapasitet. Resultatene er jobber og kapasitetstimer, ikke energi, penger eller CO₂. Endringer er ikke virkelige driftsplaner.',
          terms: [
            ['Right-sizing', 'Velge ressursnivå etter behov og begrunnet margin.'],
            ['Kapasitetstime', 'Én hypotetisk kapasitetenhet allokert i én time.'],
            [
              'Miljøfotavtrykk',
              'Konsekvenser som krever flere data enn denne ressursmodellen har.',
            ],
          ],
          goal: 'Finn ressursbesparelse som fortsatt oppfyller funksjonskravet.',
          why: 'En effektiv plan må både unngå unødvendig allokering og dekke riktig tilgjengelighetsvindu.',
          action:
            'Sammenlign døgnallokering og arbeidsdag for dev. Test også arbeidsdag-planen på den kritiske funksjonen.',
          expect:
            'Kapasitetstimer kan reduseres, men en kritisk funksjon mister arbeid når miljøet er av. Ingen utslippsverdi beregnes.',
          question: 'Øvelsen viser færre kapasitetstimer. Hva kan du faglig konkludere?',
          choices: [
            [
              'measure',
              'Modellert allokering er redusert; miljøeffekt krever flere målinger',
              'Ja. Vi har regnet ressursenheter under tydelige forutsetninger, ikke målt utslipp.',
            ],
            [
              'carbon',
              'CO₂-utslipp er redusert med samme prosent',
              'Det finnes ingen utslippsfaktor, energimåling eller full systemgrense i modellen.',
            ],
            [
              'off',
              'Alle produksjonsmiljøer bør slås av om natten',
              'En funksjon som trengs hele døgnet, mister tilgjengelighet med den tidsplanen.',
            ],
          ],
        },
      },
      assessment: {
        brief:
          'En ny timebestillingstjeneste har tre instanser som hver kan utføre tre undervisningsjobber per minutt. Etterspørselen er sju. Én instans svikter; balansert ruting bruker de to friske. Senere stopper en felles godkjenningstjeneste. Teamet har også en konsekvent feil regional mal og et utviklingsmiljø som bare brukes på dagtid. Besvar hele situasjonen uten løsningsmarkeringer. Dette er én avgrenset oppgave, ikke profesjonell kompetanse eller eksamensberedskap.',
        items: [
          {
            id: 'unmet',
            question: 'Hvor mange jobber per minutt er udekket etter instansfeilen?',
            choices: [],
            explanation:
              'To friske instanser × tre = seks tilgjengelige jobber per minutt. Etterspørsel sju gir ett udekket behov.',
          },
          {
            id: 'dependency',
            question:
              'Mer webkapasitet hjelper ikke når den felles godkjenningstjenesten er nede. Hva må undersøkes?',
            choices: [
              ['restore', 'Avhengigheten og en testet gjenopprettingsvei'],
              ['scale', 'Bare størrelsen på webinstansene'],
            ],
            explanation:
              'Den kritiske flyten trenger godkjenning. Tiltaket må påvirke den feilede avhengigheten, ikke bare friske komponenter.',
          },
          {
            id: 'policy',
            question: 'En tillatt ressurskonfigurasjon dokumenterer …',
            choices: [
              ['one-rule', 'oppfyllelse av den vurderte regelen, ikke full sikkerhet/compliance'],
              ['all', 'automatisk sikker kode, rettigheter og compliance'],
            ],
            explanation: 'Rolle, policy og teknisk sikkerhet er ulike vurderinger.',
          },
          {
            id: 'template',
            question: 'Alle miljøene bruker samme, men feil, malverdi. Hva endrer du?',
            choices: [
              ['review', 'Gjennomgå og korriger konfigurasjonsgrunnlaget'],
              ['nothing', 'Ingenting, fordi miljøene er like'],
            ],
            explanation: 'Konsistens gjør en feil repeterbar; den gjør ikke verdien korrekt.',
          },
          {
            id: 'sustainability',
            question:
              'Du kan redusere dev-allokering om natten. Hva mangler for et utslippsestimat?',
            choices: [
              ['data', 'Energi, utslippsfaktorer og definert systemgrense'],
              ['none', 'Ingenting; kapasitetstimer er allerede CO₂'],
            ],
            explanation: 'Ressursenhetene kan sammenlignes i modellen, men er ikke en miljømåling.',
          },
          {
            id: 'forecast',
            question: 'Hvilken begrunnelse gir et bedre kostnadsestimat?',
            choices: [
              ['usage', 'Målt bruk, relevante målere/priser og usikre framtidsforutsetninger'],
              ['sla', 'En tilgjengelighets-SLA gir en fast regning'],
            ],
            explanation:
              'Tilgjengelighetsvilkår bestemmer ikke alle forbruksmålere eller fremtidig bruk.',
          },
        ],
      },
    },
    services: {
      intro:
        'Fra modul 1 kjenner du ressursene og hvem som gjør deler av arbeidet. Modul 2 viste at kapasitet, recovery og styring må utformes. Nå skal du velge og begrunne konkrete servicegrenser: en VM du drifter, en støttet applikasjonsplattform eller et ferdig produkt. Den opprinnelige teorien og Portal-labben er beholdt; nye undersøkelser har egen versjon og egne observasjoner.',
      units: {
        overview: {
          title: 'Fra ansvarsoversikt til operativt valg',
          objective: 'ST01–ST04 · bruke grunnlaget til nye tekniske beslutninger.',
          prerequisite:
            'Repetisjon: et operativsystem forvalter maskinressurser; runtime kjører kode. Public/private/hybrid beskriver miljøer, mens IaaS/PaaS/SaaS beskriver leveransen og driftsgrensen.',
          intuition:
            'Et tjenestevalg bestemmer ikke bare hvor koden står. Det bestemmer hvilke konfigurasjoner teamet kan gjøre, hvilke driftsoppgaver det beholder og hvilke begrensninger det må akseptere. Vi bruker samme tekniske ansvarsmatrise som før, men går videre til komponenter og konkrete handlinger.',
          mechanism:
            'Når en oppgave overtas av leverandøren, finnes laget fortsatt. En administrert runtime trenger fortsatt en støttet versjon og riktig applikasjonskonfigurasjon. En ferdig app trenger fortsatt brukere og datatilgang. Se derfor alltid på både hva tjenesten leverer, hva kunden styrer og hvilke krav arbeidslasten stiller.',
          azure:
            'Azure Virtual Machines gir en gjest som kunden konfigurerer. App Service gir en støttet hostingplattform for webapplikasjoner. Microsoft 365 er et eksempel på ferdige samarbeidstjenester med egne administrasjons- og lisensgrenser. Den nøyaktige ansvarsgrensen må vurderes for den aktuelle tjenesten og konfigurasjonen.',
          example:
            'En leverandørvedlikeholdt OS-plattform hjelper teamet som vil slippe gjeste-OS. Det er likevel teamets oppgave å levere fungerende kode og egnede tilgangsvalg. En annen applikasjon krever en bestemt OS-driver; den kan trenge mer gjestekontroll. Ingen av kravene kan avgjøres ut fra et pent tjenesteikon.',
          misconception:
            'Service models er ikke en rangstige der SaaS alltid er best og IaaS alltid er gammeldags. Kontroll kan være nødvendig, og lavere driftsbyrde kan være verdifull. Det viktige er en dokumentert match mellom krav, tjenestestøtte og teamets evne til å drifte.',
          limits:
            'Sammenligningen konfigurerer ingen tjeneste. M1-observasjoner og historiske Service Types v1-svar blir ikke godskrevet som ny operativ læring. Eldre materiale er fremdeles tilgjengelig som merket arkiv.',
          terms: [
            ['Driftsgrense', 'Hvilke oppgaver leverandøren utfører og hvilke kunden må utføre.'],
            [
              'Tjenestestøtte',
              'Konfigurasjoner og bruksmåter den valgte tjenesten faktisk tillater.',
            ],
          ],
          goal: 'Bruk ansvarsoversikten som inngang til tekniske valg.',
          why: 'Å kjenne eieren av OS er ikke nok til å velge en komplett løsning.',
          action:
            'Sammenlign de tre konkrete tjenestene. Les ett lag i hver og bruk deretter kontrollene i de tekniske undersøkelsene.',
          expect:
            'Ansvar flyttes, men krav til kundens kode, data, tilgang og kompatibilitet gjenstår.',
          question: 'Hva må fortsatt avklares etter at du velger en plattform som drifter OS?',
          choices: [
            [
              'fit',
              'Krav, støttet runtime, kundekode, konfigurasjon og tilgang',
              'Ja. Servicegrensen erstatter ikke den praktiske løsningsvurderingen.',
            ],
            [
              'done',
              'At alle tekniske valg allerede er riktige',
              'En kategori eller ansvarsoversikt beviser ingen fungerende eller sikker konfigurasjon.',
            ],
          ],
        },
        iaas: {
          title: 'Bygg en forståelig VM-konfigurasjon',
          objective: 'ST01 · forklare komponenter og retained operations i IaaS.',
          prerequisite:
            'Du kjenner fysisk vert, gjeste-OS, CPU, RAM og lagring. vCPU er virtuell prosessorkapasitet; GiB er en minneenhet. NIC er et virtuelt nettverkskort som knytter VM-en til et nettverk.',
          intuition:
            'IaaS gir kontroll over en virtuell datamaskin uten at kunden må kjøpe vertsmaskinen. Denne kontrollen er nyttig når et program trenger bestemte OS-egenskaper. Men en VM-ressurs alene er ikke en ferdig applikasjonsplattform. Programmet trenger også passende gjest, runtime, data og nettverksvei.',
          mechanism:
            'VM-størrelsen beskriver blant annet vCPU og minne. Gjesteoperativsystemet kjører innenfor denne tildelingen. En OS-disk og eventuell ekstra datalagring har andre roller enn RAM. Applikasjonsdata som skal beholdes, må ha egnet varig lagring og en begrunnet backup-/gjenopprettingsplan. Et NIC og nettverksoppsett er nødvendig for ønsket kommunikasjon; en public IP er ikke et universelt krav. Nettverksfiltrering, ruter, navneoppløsning og identitet må fortsatt utformes i den reelle løsningen.',
          azure:
            'En Azure VM er en ARM-administrert ressurs med relaterte nettverks- og lagringsressurser. Microsoft driver verts- og virtualiseringslaget. Kunden velger gjeste-OS, installerer programvare og må planlegge patching, tilgang, backup og tilgjengelighet. Lift-and-shift kan bevare en eldre programvares OS-forutsetninger under flytting, men moderniserer ikke automatisk arkitektur eller drift. Dev/test kan bruke repeterbare gjestemiljøer, med samme behov for sikker konfigurasjon.',
          example:
            'Et eldre lagerprogram krever Windows og minst åtte GiB i vårt fiktive oppdrag. Det trenger installert runtime, varig applikasjonslagring og en avtalt nettverksvei. Sett sammen en plan og undersøk hvilke forutsetninger som mangler. Patching er et pågående driftsansvar, ikke en avkryssing som gjør maskinen permanent sikker.',
          misconception:
            'Mer vCPU løser ikke feil OS eller manglende runtime. RAM er ikke en erstatning for varig lagring. En konfigurasjon som passer disse forutsetningene, beviser heller ikke tilgjengelighet, korrekt backup eller at programmet kjører. Høy tilgjengelighet krever flere vurderinger enn størrelsen på gjesten.',
          limits:
            'Dette er en konseptuell konfigurasjonsmodell, ikke VM-provisionering i Portal. To/fire vCPU og fire/åtte GiB er undervisningsvalg, ikke SKU-er eller ytelsesmålinger. Appdata trenger varig lagring i oppdraget; dette er ikke et generelt forbud mot midlertidig lagring eller ephemeral OS-disker. Nettverksvalget uttrykker et krav som ikke implementeres som faktiske pakker, IP-er eller NSG-regler.',
          terms: [
            ['vCPU', 'Virtuell prosessorkapasitet tildelt en gjest.'],
            ['NIC', 'Virtuelt nettverkskort som forbinder VM-en med et nettverk.'],
            [
              'Varig appdata',
              'Data som skal beholdes utover en kort arbeidsøkt eller midlertidig disk.',
            ],
          ],
          goal: 'Avklar VM-ens forutsetninger og kundens driftsarbeid.',
          why: 'En VM er én del av en løsning; kapasitet kan ikke erstatte manglende komponenter.',
          action:
            'Prøv først en ufullstendig plan. Rett OS, minne, appdata, nettverk og runtime, og velg en patch-plan.',
          expect:
            'Modellen viser konkret hvilke krav som ikke passer. En passende plan vises som avklart, aldri som deployert eller frisk.',
          question:
            'Programmet trenger en bestemt Windows-driver. Hva er en faglig relevant IaaS-begrunnelse?',
          choices: [
            [
              'control',
              'Gjesten gir nødvendig OS-kontroll, med retained patch-/tilgangsarbeid',
              'Riktig. Kontrollen kan passe kravet, men teamet må også kunne drifte gjesten.',
            ],
            [
              'managed',
              'VM fjerner kundens OS-vedlikehold',
              'VM flytter verten til leverandøren, men ikke gjesteansvaret.',
            ],
            [
              'cpu',
              'Flere CPU-kjerner gjør Linux kompatibelt med alle Windows-drivere',
              'Kapasitet endrer ikke programmets OS-forutsetning.',
            ],
          ],
        },
        paas: {
          title: 'Kode, runtime og hosting er ulike deler',
          objective: 'ST02 · undersøke støttet plattform og retained applikasjonsarbeid.',
          prerequisite:
            'En hosting-plan er compute-grunnlaget som en app bruker. Runtime er programmiljøet som utfører koden. En applikasjonsinnstilling er konfigurert input til programmet, ikke selve programkoden.',
          intuition:
            'Teamet vil levere egen webkode og slippe gjeste-OS-drift. En støttet PaaS-plattform kan gjøre dette mulig. Det betyr ikke at vilkårlig programvare passer, eller at plattformen kan vite hvilke data og tilgangsregler applikasjonen trenger.',
          mechanism:
            'Konseptuelt velger teamet en støttet plattform, tilrettelegger og tester en kodepakke, konfigurerer appen og gjør den tilgjengelig gjennom tjenestens støttede deployeringsmåter. Planen gir hostingressurser; appen er en egen ressurs som refererer planen. Flere apper kan dele en plan i Azure, slik at de også deler compute-egenskaper. Flytting, isolasjon, skalering og støttede plattformvalg må vurderes konkret. En ressurskvittering er ikke det samme som en ferdig kodeutrulling.',
          azure:
            'Med App Service innebygde runtimes drifter Microsoft den underliggende OS-plattformen og den leverte runtime-en. Kunden vedlikeholder egen kode, data, støttet konfigurasjon og tilgang. Runtime-versjoner kan endres eller slutte å støttes, så appkompatibilitet må følges opp. Et kundelevert containerimage eller en egen runtime gir kunden mer innholdsvedlikehold. En OS-driver som krever gjestekontroll passer ikke automatisk i innebygget App Service-runtime.',
          example:
            'Prøv tre typer leveranse: støttet webkode, en runtime som plattformen ikke støtter og en OS-driver. Endre deretter appkonfigurasjon, databehandling og tilgangskrav. En større hosting-plan gjør ikke en usupportert runtime støttet. Når du har begrunnet plattformvalget, bruker du den virkelige lokale Portal-flyten til group, plan og Web App.',
          misconception:
            'Resource Group gir management og livssyklus, ikke compute. Metadataregionen bestemmer ikke automatisk planens lokasjon. I den støttede motoren avledes appens OS og lokasjon fra planreferansen. En avvist plan kan ikke være host. At en appkonfigurasjon er registrert, betyr ikke at vi har lastet opp, startet eller verifisert kode, DNS, nettverk eller apphelse.',
          limits:
            'Kompatibilitetsbildet er konseptuelt, med tre avgrensede pakkevalg. Det kjører ingen kode. Den separate Portal-motoren støtter Linux learning profile, ikke ekte SKU/runtime deployment. Den bruker samme gruppe for app og plan som modellgrense. Eksisterende teknisk arbeid kan gjenbrukes eksplisitt når den nåværende replayede historikken kan bekrefte det; ingen gamle læringssvar oppgraderes.',
          terms: [
            [
              'Kodeutrulling',
              'Å levere programvare gjennom en valgt og støttet deployeringsprosess.',
            ],
            [
              'App Service plan',
              'Hosting-compute som apper refererer, med OS/lokasjon og andre tjenestespesifikke egenskaper.',
            ],
            [
              'Applikasjonskonfigurasjon',
              'Verdier og valg programmet trenger; må håndteres sikkert av kunden.',
            ],
          ],
          goal: 'Skille plattformstøtte fra egen appkonfigurasjon.',
          why: 'Administrert OS reduserer oppgaver, men fjerner ikke kompatibilitets- og applikasjonskrav.',
          action:
            'Sammenlign ikke-støttet pakke og støttet kode. Avklar konfigurasjon, data og tilgang før Portal-labben.',
          expect:
            'Modellen forklarer hvorfor en pakke ikke passer eller hvilke kundevalg som gjenstår. Den viser aldri falsk runtime-helse.',
          question:
            'En pakke trenger en runtime som valgt innebygd plattform ikke støtter. Hva bør teamet gjøre?',
          choices: [
            [
              'verify',
              'Undersøke støtte, tilpasse leveransen eller velge en annen egnet hostinggrense',
              'Ja. Kompatibilitet må avklares før løsningen velges.',
            ],
            [
              'bigger',
              'Bare velge en større plan',
              'Flere hostingressurser endrer ikke hvilke runtimes plattformen støtter.',
            ],
            [
              'rg',
              'Flytte Resource Group-metadata',
              'Metadata-lokasjonen oppgraderer ikke runtime-støtte.',
            ],
          ],
        },
        saas: {
          title: 'Administrer en ferdig tjeneste, ikke en gjesteplattform',
          objective: 'ST03 · gjøre retained SaaS-kundeansvar konkret.',
          prerequisite:
            'En brukerkonto identifiserer noen i en tjeneste. En lisens eller tjenesteavtale gir bestemte bruksrettigheter. En administratorrolle gir administrasjonsmyndighet; den er ikke det samme som en lisens.',
          intuition:
            'Fjord-teamet tar i bruk en ferdig samarbeidstjeneste. Leverandøren vedlikeholder appplattformen. Teamet skal likevel velge hvem som skal bruke tjenesten, hvilke data som deles og hvem som får endre organisasjonens oppsett. Ingen av disse valgene avgjøres av at serverne er administrert.',
          mechanism:
            'Organisasjonsinnstillinger kan gjelde mange brukere, mens tilgang til bestemte arbeidsområder eller dokumenter kan ha et smalere scope. En konto, en produktlisens og en administrasjonsrolle løser forskjellige behov. Et nytt medlem trenger relevant brukstilgang; det betyr ikke at vedkommende trenger administratorrolle. Ved avgang må tilganger og relevante data-/eierskapsrutiner følges opp. Databevaring, sletting og kontroll av tidligere deling er tjeneste- og kravavhengig.',
          azure:
            'Microsoft 365 er et eksempel på en SaaS-familie, ikke en generell maskin der kunden installerer vilkårlig serverkode. Kunden forvalter blant annet brukere, rettigheter, deling, data og tjenesteinnstillinger. Faktiske administratorroller og lisenskrav varierer mellom produkter, abonnement og oppgaver. M365-organisasjon/tenant er heller ikke det samme som en Azure resource group eller vår produktorganisasjon.',
          example:
            'Mina trenger å samarbeide med teamet, ikke administrere hele organisasjonen. I den fiktive modellen krever bruk en aktiv konto og tildelt tjenestelisens. Teamdeling begrenser eksponeringen sammenlignet med alle-med-lenken. Undersøk for bred rolle og deling, korriger til det avtalte oppdraget, og se deretter hva modellens avgangsvalg gjør med bruken.',
          misconception:
            'En lisens gjør ikke brukeren til administrator. Leverandørpatching velger ikke riktige dokumentrettigheter. Å blokkere en konto er heller ikke dokumentasjon på at alle tidligere delinger og dataforpliktelser er håndtert. En tjeneste kan ha avanserte utvidelser uten å bli en generell PaaS for vilkårlig kode.',
          limits:
            'Fjord Samarbeid er en oppdiktet SaaS, ikke en kopi av Microsoft 365 admin center. Vi validerer bare aktiv/lisensiert bruker, en grov rolle og et delingsvalg. Ingen Entra-konto, ekte lisens, API, passord, datafil eller Microsoft tenant endres. Modellen gir ingen sikkerhets-/compliance-garanti.',
          terms: [
            ['Brukerlisens', 'Avtalte rettigheter til å bruke bestemte tjenestefunksjoner.'],
            ['Administratorrolle', 'Myndighet til å administrere bestemte deler av en tjeneste.'],
            [
              'Delingsgrense',
              'Hvem som kan få tilgang til bestemte data gjennom et valgt oppsett.',
            ],
          ],
          goal: 'Gi akkurat det avtalte samarbeidsbehovet og vurder avgang.',
          why: 'Et ferdig produkt fjerner plattformdrift, ikke kundens tilgangsbeslutninger.',
          action:
            'Prøv et risikabelt oppsett, et aktivt lisensiert teammedlem uten bred adminrolle, og en avsluttet brukerkonto.',
          expect:
            'Tilgang, overbrede rettigheter og deling vises som separate konsekvenser. Ingen faktisk konto blir endret.',
          question: 'Mina skal bare samarbeide i et avtalt team. Hvilket resonnement passer?',
          choices: [
            [
              'least',
              'Relevant brukerlisens, begrenset rolle og riktig datadeling må vurderes hver for seg',
              'Ja. Konto, bruksrett og administrasjonsmyndighet er forskjellige dimensjoner.',
            ],
            [
              'admin',
              'Alle lisensierte brukere bør være administratorer',
              'En lisens begrunner ikke større rettigheter enn oppgaven trenger.',
            ],
            [
              'provider',
              'Leverandøren bestemmer automatisk hvem som bør se teamets data',
              'Kunden må ta egnede data- og tilgangsvalg innen tjenestens funksjoner.',
            ],
          ],
        },
        selection: {
          title: 'Velg en løsning ut fra krav og driftsarbeid',
          objective: 'ST04 · begrunne tjenestevalg og vurdere alternativer.',
          prerequisite:
            'Du har undersøkt VM-komponenter, plattformkompatibilitet og retained SaaS-administrasjon. Et krav beskriver hva løsningen må gjøre; en preferanse kan avveies mot andre hensyn.',
          intuition:
            'Et servicevalg er et argument om egnethet, ikke en konkurranse mellom etiketter. Kartlegg ufravikelige krav, eksisterende investeringer og teamets driftskapasitet før du velger. Noen situasjoner har flere forsvarlige svar, dersom forutsetningene faktisk oppfylles.',
          mechanism:
            'En OS-avhengig agent kan trenge IaaS-kontroll. Egen webkode på en støttet runtime med ønske om mindre OS-drift kan passe PaaS. Behov for ferdig samarbeid kan passe SaaS, når produktfunksjoner, avtale og tilgangskrav støtter oppgaven. En virksomhet med et kompetent VM-driftsteam kan fortsatt ha et begrunnet IaaS-alternativ for egen kode. Valget må inkludere retained arbeid, ikke bare fordelen man ønsker.',
          azure:
            'Reell Azure-design vurderer blant annet tjenestestøtte, identitet, data, nettverk, drift, skalering, recovery og kostnader. En eksisterende lokal integrasjon kan begrense migrering eller kreve hybrid samspill. Det betyr ikke at ordet hybrid avgjør om applikasjonsdelen skal være IaaS eller PaaS. Senere arkitekturmoduler går dypere i disse avhengighetene.',
          example:
            'Undersøk tre tydelige situasjoner og én med flere muligheter. For et OS-krav må begrunnelsen forklare gjestekontrollen. For en ferdig tjeneste må funksjonsbehovet faktisk passe produktet. I den åpne webkodesituasjonen godtas både VM med et team som tar gjestedriften, og støttet PaaS med tydelig retained apparbeid. En riktig etikett med feil begrunnelse er ikke et godt løsningsforslag.',
          misconception:
            'PaaS er ikke alltid billigst eller egnet for alle programmer. SaaS er ikke automatisk et alternativ til egen forretningslogikk. Å velge IaaS fordi det gir kontroll, uten å planlegge vedlikeholdet, utelater en vesentlig konsekvens. Vi lærer derfor hvilke forutsetninger som gjør svaret rimelig, ikke én universell rangering.',
          limits:
            'Scenariene er fiktive beslutningsoppgaver, ikke komplette løsningsarkitekturer eller pristilbud. Noen alternativer aksepteres bare når modell og begrunnelse passer sammen. Den nye uavhengige oppgaven har endrede krav og egen versjon. Historiske v1-forsøk og den eksisterende Portal-byggeoppgaven beholdes separat.',
          terms: [
            ['Ufravikelig krav', 'Et behov løsningen må oppfylle, ikke bare en ønsket egenskap.'],
            ['Avveining', 'Et begrunnet valg der gevinster og ulemper vurderes sammen.'],
          ],
          goal: 'Knytt servicegrense til det reelle kravet og retained arbeid.',
          why: 'To løsninger kan være forsvarlige med forskjellige driftsforutsetninger.',
          action:
            'Prøv de tre tydelige kravene og den åpne situasjonen. Velg både modell og begrunnelse.',
          expect:
            'Rimelige alternativer godtas når begrunnelsen samsvarer. Upassende kapabilitet eller utelatt drift gir konkret moteksempel.',
          question:
            'Egen webkode støttes av PaaS, men teamet kan også drifte VM. Hvilket utsagn er faglig holdbart?',
          choices: [
            [
              'tradeoff',
              'Begge kan være egnet hvis kravet og retained driftsarbeid begrunnes',
              'Ja. Vi må vurdere forutsetninger og arbeid, ikke kreve én kategori uten grunn.',
            ],
            [
              'always',
              'PaaS er alltid riktig uansett støtte og drift',
              'En slik regel ignorerer konkrete begrensninger og krav.',
            ],
            [
              'saas',
              'Vilkårlig serverkode kan alltid lastes inn i et ferdig SaaS-produkt',
              'Et ferdig produkt er ikke en generell hostingplattform for all kode.',
            ],
          ],
        },
        practice: {
          title: 'Bruk og forklar den faktiske hostingkonfigurasjonen',
          objective: 'ST02/ST04 med anvendt G01/C01 · undersøke group, plan, app og policy.',
          prerequisite:
            'Group organiserer management. Plan gir hosting. App refererer planen. Resource location og gruppemetadata er forskjellige egenskaper.',
          intuition:
            'Nå skal du gjøre arbeidsdelingen konkret i det fungerende lokale laboratoriet. Du oppretter eller gjenbruker dokumentert teknisk arbeid, leser en virkelig modellkvittering og undersøker appens hostingrelasjon. Dette er guided practice, ikke uavhengig mestring.',
          mechanism:
            'Den samme motoren håndterer de reelle støttede Portal-skjemaene. Et policyavslag lager ingen plan. En app krever en gyldig plan, og appens OS/lokasjon avledes fra den. Gruppemedlemskap og hosting er ulike relasjoner. Etter arbeidet må du forklare hvorfor det passer ønsket om egen kode uten gjeste-OS-drift.',
          azure:
            'App Service plan og Web App er separate Azure-ressurser med en hostingrelasjon. Den lokale Linux learning profile er en tydelig avgrensning. Ingen Azure-konto, SKU, runtime-deployering eller driftssignal opprettes.',
          example:
            'App Sandbox krever en ny eller eksisterende egnet lifecycle-gruppe med Norway East-metadata. Den custom Web-policyen avviser North Europe og tillater West Europe. Les scope og rule i kvitteringen og korriger ressurslokasjonen. Inspect app → plan separat fra app → group. En eksisterende replaybar lab kan fortsettes uten å lage nye like grupper.',
          misconception:
            'Tidligere guided teknisk konfigurasjon er ikke ny uavhengig læring. En ny versjon av kurset arver ikke gamle sammenligninger eller riktige svar. Når eksisterende ressurser brukes, beskriver debriefen dette som gjenbruk og etterkontroll, ikke som en ny deployering.',
          limits:
            'Bare den eksisterende bounded Portal-motoren utfører ressurskommandoer. Konseptuelle VM/SaaS-prøver bidrar ikke til inventaret. Historisk arbeid uten nødvendig replay/receipt kan ikke adopteres som ferdig. Du kan fortsette gyldig arbeid eller eksplisitt bruke teknisk restart i det eksisterende grensesnittet.',
          terms: [
            ['Kvittering', 'Deterministisk resultat av en støttet teknisk kommando.'],
            ['Hostingrelasjon', 'Appens eksplisitte referanse til compute-planen som støtter den.'],
          ],
          goal: 'Forklar den samme konfigurasjonen som laboratoriet faktisk viser.',
          why: 'Teknisk arbeid og ny faglig begrunnelse er ulike evidenskilder.',
          action:
            'Start eller fortsett labben, undersøk policy og hosting, og begrunn deretter retained kundeansvar.',
          expect:
            'Debrief viser faktiske ressursnavn. Versjon2 godkjenner ikke den anvendte delen uten både bekreftet lab og egen ny begrunnelse.',
          question: 'Hva er fortsatt teamets ansvar i dette innebygde App Service-eksemplet?',
          choices: [
            [
              'retained',
              'Egen kode, data, tilgang og støttet appkonfigurasjon',
              'Ja. Registrert hosting flytter OS-oppgaver, ikke disse kundeoppgavene.',
            ],
            [
              'none',
              'Ingenting etter at Create er akseptert',
              'En akseptert konfigurasjon kjører eller sikrer ikke automatisk kundens applikasjon.',
            ],
          ],
        },
      },
      assessment: {
        brief:
          'Nord-teamet har flere arbeidslaster: en agent med ufravikelig Windows-driver, en egenskrevet webtjeneste med en usupportert runtime, og en ferdig samarbeidstjeneste der en ansatt slutter. En annen webapp har både et kompetent VM-team og støttet PaaS som reelle alternativer. Begrunn de tekniske konsekvensene. Ingen arkitektur eller løsning er forhåndsvalgt.',
        items: [
          {
            id: 'guest',
            question: 'Hvilken leveranse gir gjestekontroll for Windows-driveren?',
            choices: [
              ['iaas', 'IaaS med nødvendig gjeste-OS'],
              ['saas', 'En vilkårlig ferdig SaaS'],
            ],
            explanation:
              'Gjestedriveren krever kontroll og kompatibelt OS; en ferdig produktfunksjon er ikke nok.',
          },
          {
            id: 'patch',
            question: 'Hvem planlegger og følger opp gjeste-OS-patching i VM-alternativet?',
            choices: [
              ['customer', 'Kunden'],
              ['provider', 'Leverandøren overtar alt gjestearbeid'],
            ],
            explanation:
              'Leverandørens fysiske drift fjerner ikke kundens retained gjestevedlikehold.',
          },
          {
            id: 'runtime',
            question:
              'Webtjenestens runtime støttes ikke av den valgte innebygde PaaS-plattformen. Neste faglige valg?',
            choices: [
              ['adapt', 'Undersøk støtte og tilpasning eller en annen egnet hostinggrense'],
              ['size', 'Kjøp større plan som automatisk støtter alt'],
            ],
            explanation: 'Kapasitet og runtime-støtte er forskjellige egenskaper.',
          },
          {
            id: 'departure',
            question: 'Hva må kunden vurdere når SaaS-medarbeideren slutter?',
            choices: [
              ['access', 'Tilgang, roller og relevante data-/delingsrutiner'],
              ['patch', 'Bare leverandørens OS-patch'],
            ],
            explanation:
              'Kunden styrer passende brukertilgang og oppfølging av egne data innen tjenestens funksjoner.',
          },
          {
            id: 'architecture',
            question:
              'Velg et forsvarlig alternativ for den siste webappen, gitt begge driftsmulighetene.',
            choices: [
              ['iaas', 'VM med eget driftsteam'],
              ['paas', 'Støttet PaaS-plattform'],
              ['saas', 'Vilkårlig SaaS for all egen serverkode'],
            ],
            explanation:
              'Både IaaS og PaaS kan godtas her, men bare med en samsvarende begrunnelse i neste felt.',
          },
          {
            id: 'reason',
            question: 'Begrunn den valgte arkitekturens retained arbeid.',
            choices: [
              ['os-team', 'Teamet tar gjeste-OS, runtime og appdrift'],
              [
                'platform-supported',
                'Plattformen støtter koden; kunden tar kode/data/tilgang og konfigurasjon',
              ],
              ['no-work', 'Ingen kundeoppgaver gjenstår'],
            ],
            explanation:
              'VM-alternativet krever os-team. PaaS-alternativet krever platform-supported. Et tilfeldig kryss mellom modell og begrunnelse godtas ikke.',
          },
          {
            id: 'hosting',
            question:
              'Gruppen har Norway East-metadata; appen bruker en plan i West Europe. Hva begrunner appens lokasjon i denne modellen?',
            choices: [
              ['plan', 'Den eksplisitte hosting-planreferansen'],
              ['group', 'Gruppens metadata flytter automatisk appen'],
            ],
            explanation:
              'Medlemskap bestemmer management; appens hostinglokasjon avledes fra planen.',
          },
        ],
      },
    },
  },
  refinement: {
    activity: 'Aktivitet',
    of: 'av',
    assessmentPosition: 'Separat vurdering',
    current: 'Nå',
    continueTeaching: 'Fortsett undervisningen',
    revisitLab: 'Gå tilbake til laboratoriet',
    why: 'Hvorfor dette er viktig',
    action: 'Gjør dette nå',
    expect: 'Dette vil du se',
    inspectTarget: 'Informasjon å undersøke',
    actionTarget: 'Kontroll å bruke',
    locateInspection: 'Vis informasjonen',
    missingInspection:
      'Informasjonen er ikke tilgjengelig i denne visningen. Åpne ressursoversikten, operasjonen eller relasjonen som steget beskriver. Ingen annen overskrift markeres som erstatning.',
    changes: 'Når du bytter tjeneste',
    unchanged: 'Ansvarsfordelingen er uendret for dette laget.',
    responsibilityPrompt:
      'Velg en konkret tjeneste øverst. Undersøk et lag, og sammenlign hvem som utfører oppgaven. Lagene finnes fortsatt når driftsansvaret flyttes.',
    comparison: 'Samme lag, tre tjenesteeksempler',
    selectedLayer: 'Laget du undersøker',
    actual: 'Fra dette forsøket',
    serviceNuance: 'Tjenestespesifikke forbehold og teknisk dybde',
    expectations: {
      'find-groups':
        'Søket viser den støttede tjenesten. Når du åpner den, ser du gruppene i treningsmiljøet.',
      'create-group':
        'Basics åpnes med subscription, gruppenavn og metadataregion. Ingen ressurs opprettes ved å åpne skjemaet.',
      subscription:
        'Den valgte subscription følger gruppen og avgjør hvilket management-scope ressursene tilhører.',
      'group-name':
        'Ditt navn vises i Review. Et gyldig navn uten rg-prefiks er også tillatt; navnet setter ingen sikkerhetsregel.',
      metadata:
        'Gruppens metadata registreres i Norway East. Planens og appens lokasjon blir et separat valg.',
      'review-group':
        'Forhåndskontrollen viser den faktiske forespørselen og eventuelle feil. Gruppen finnes først etter en akseptert Create.',
      'commit-group':
        'En akseptert kvittering legger gruppen til i inventaret. Et avslag beholder ressursstatus uendret.',
      'inspect-group':
        'Oversikten viser den opprettede gruppens subscription og metadata. Neste ressurs, hosting-planen, vil gi compute i modellen.',
      'create-plan':
        'Planens eget skjema viser blant annet gruppemedlemskap, Linux-profil og ressurslokasjon.',
      'plan-group':
        'Planen blir medlem av denne gruppen ved aksept. Appens hosting blir en annen, eksplisitt relasjon.',
      'plan-name':
        'Review vil vise dette navnet og den støttede profilen. Navnet skaper verken kapasitet eller en prisavtale.',
      'plan-region':
        'Den egendefinerte treningspolicyen kan avvise ønsket lokasjon. Kvitteringen forklarer hvorfor; en avvist plan opprettes ikke.',
      'review-plan':
        'Den ønskede lokasjonen vises før innsending. Les kontrollen; Create er fortsatt en egen handling.',
      'commit-plan':
        'Du får en faktisk modellkvittering: akseptert konfigurasjon eller avslag med regel, scope og lokasjon.',
      'inspect-denial':
        'I operasjonen ser du ønsket lokasjon, policyen og uendret ressursantall. Policyvisningen gir grunnlaget for korreksjonen.',
      'inspect-policy':
        'Assignment scope og tillatte lokasjoner viser hvilken egenskap som må endres. Gruppens metadata løser ikke en Web-lokasjonsregel.',
      'correct-plan':
        'En tillatt konfigurasjon kan bli akseptert som en ny plan. Det tidligere avslaget beholdes i operasjonshistorikken.',
      'create-app':
        'Appskjemaet krever en eksisterende, akseptert plan. Samme resource group alene oppretter ingen hosting-avhengighet.',
      'app-group':
        'Denne modellen bruker samme gruppe for app og plan. Valget endrer ikke planens eksisterende lokasjon.',
      'app-name':
        'Navnet identifiserer appkonfigurasjonen i modellen. Det er ikke et globalt kontrollert DNS-navn.',
      hosting:
        'Appens viste OS og ressurslokasjon avledes fra den valgte planen. Gruppens metadataregion flytter ikke appen.',
      'review-app':
        'Review viser både gruppemedlemskapet og den valgte planen, slik at du kan kontrollere to forskjellige relasjoner.',
      'commit-app':
        'En akseptert kvittering legger appkonfigurasjonen til i inventaret. Den bekrefter ikke kjørende kode eller driftstilstand.',
      'inspect-app':
        'Planreferansen og appens avledede egenskaper stemmer med den samme ressursstatusen i Architecture Explorer.',
      architecture:
        'Gruppen, den aksepterte planen og appen vises sammen. Det avviste forsøket finnes bare i operasjonshistorikken.',
      relationship:
        'Relasjonsinspektøren viser app → plan som hosting-avhengighet, adskilt fra gruppemedlemskap og geografiske egenskaper.',
      complete:
        'Kurset viser en debrief med de faktiske ressursnavnene. Gyldig teknisk arbeid bevares; uavhengig vurdering er separat.',
      unverifiable:
        'Kurset viser at historikken ikke kan bekreftes. Manglende kvitteringer blir aldri erstattet av et fullført-flagg.',
      'fix-validation':
        'Når du retter det angitte feltet og åpner Review igjen, kjøres den samme faktiske forhåndskontrollen på nytt.',
    },
    topology: {
      title: 'Hvem bruker miljøet — og hvem kobler det sammen?',
      select: 'Undersøk en deployment-modell',
      models: { public: 'Public cloud', private: 'Private cloud', hybrid: 'Hybrid cloud' },
      orgA: 'Organisasjon A',
      orgB: 'Organisasjon B',
      provider: 'Skyleverandør',
      operator: 'Ekstern operatør',
      local: 'Organisasjonens lokasjon',
      external: 'Operatørens lokasjon',
      publicPlatform: 'Leverandørstyrt cloud-plattform',
      dedicated: 'Dedikert cloud-miljø',
      localWorkload: 'Beholdt lokalt system',
      serviceA: 'A sitt tjenesteutvalg',
      serviceB: 'B sitt tjenesteutvalg',
      use: 'Bruker tjenester',
      exclusive: 'Bare organisasjon A',
      relationship: 'Vis behovet for integrasjon',
      integration: 'Nødvendig samspill · illustrasjon',
      separate: 'To miljøer alene beskriver ingen hybridintegrasjon.',
      offsite: 'Vis private cloud hos ekstern operatør',
      publicExplanation:
        'A og B bruker tjenester fra en leverandørstyrt plattform. Deling av leverandørens infrastruktur betyr ikke at A får tilgang til B sine data. Identitet, isolasjon og tilgang må håndteres for de aktuelle tjenestene.',
      privateExplanation:
        'Bare organisasjon A bruker dette cloud-miljøet. Flytt miljøet til en ekstern operatør: bruksgrensen og private-klassifiseringen består. Operatørens og kundens konkrete driftsoppgaver må fortsatt avklares.',
      hybridExplanation:
        'A beholder et lokalt system som den nye cloud-tjenesten må fungere sammen med. Den viste forbindelsen uttrykker dette kravet. Nettverk, identitet, dataflyt og drift må faktisk utformes; illustrasjonen konfigurerer ingen av dem.',
      unchanged: 'Fortsatt private cloud · eksklusivt for A',
      boundary:
        'Stiplet ramme viser hvem miljøet tilhører eller hvem som kan bruke det. Linjer viser illustrative bruks- eller integrasjonsrelasjoner, ikke management-scope eller simulert nettverkstrafikk.',
      textView: 'De samme relasjonene som tekst',
      publicRelations:
        'A → leverandørens tjenester for A. B → leverandørens tjenester for B. Plattformen betjener flere kunder; data er ikke dermed offentlige.',
      privateRelations:
        'A → ett dedikert cloud-miljø for A. Lokasjonen kan være egen eller ekstern; B har ingen bruksrelasjon i dette eksempelet.',
      hybridRelations:
        'A sitt lokale system ↔ A sin tjeneste hos skyleverandøren. Samspillet er et arkitekturkrav, ikke et bevis på at integrasjonen virker.',
    },
  },
  foundationsV2: {
    noAssessment: 'Ingen innsendt endret oppgave',

    traceNext: 'Følg neste del av forespørselen',
    traceSteps: [
      'Klienten sender forespørselen.',
      'Serverens applikasjon behandler den.',
      'Svaret kan brukes av nettleseren.',
    ],
    commitmentQuestion:
      'Hva må registreringspiloten forstå før den bruker modellens forpliktelsestall?',
    database: 'Valgfritt oppslag i database',
    badge: 'GRUNNLAG · VERSJON 2',
    intro:
      'Start med en nettside du kjenner. Undersøk maskinen bak den, før vi bruker dette grunnlaget til cloud computing, driftsansvar og kostnadsvalg.',
    legacy: 'Arkivert Foundations v1 · beholdt læringshistorikk',
    legacyNote:
      'Du leser den opprinnelige versjonen. Svar, første forsøk og XP er beholdt. Ny undervisning har et separat læringsspor.',
    chooseTitle: 'Fortsett der du var, eller begynn med den nye forklaringen',
    chooseText:
      'Du har registrert arbeid i Foundations v1. Ingenting flyttes til v2 eller godskrives på nytt. V2 begynner med nettleser, server og datamaskin før cloud computing.',
    activeWarning:
      'Du har et uferdig v1-vurderingsforsøk. Å åpne ny teori registreres som hjelp i dette forsøket; svarutkast og første svar beholdes.',
    keepV1: 'Fortsett min opprinnelige v1',
    startV2: 'Begynn Foundations v2 med separat historikk',
    switchV2: 'Åpne gjeldende undervisning (v2)',
    viewV1: 'Se min bevarte v1-historikk',
    introduced: 'Introdusert',
    practiced: 'Veiledet øvd',
    notYet: 'Ikke øvd ferdig',
    check: 'Undersøk begrunnelsen',
    guidedNote:
      'Dette er veiledet læring. Retting og forklaringer gir ikke uavhengig kompetanse eller XP.',
    summary: 'Dine observasjoner · Foundations v2',
    summaryNote:
      'Lesing, modellkjøring, veiledede svar og første selvstendige oppgave vises hver for seg. Dette er ikke en mestringsprosent, Microsoft-fullføring eller eksamensklarhet.',
    complete: 'Alle veiledede undervisnings- og øvingsvilkår er oppfylt.',
    incomplete: 'Noen veiledede øvingsvilkår gjenstår. Du kan gå direkte tilbake til dem.',
    assessment: 'Endret oppgave · registreringspiloten',
    assessmentIntro:
      'Et lokalt arrangement skal åpne nettregistrering. Fire like undervisningstimer trenger 1, 7, 4 og 2 arbeidspakker. Allokert kapasitet er 5 pakker per time. Hver time regnes separat. Svar på alle spørsmål før du ser resultat og forklaring. Oppgaven bruker modellene du har undersøkt, men en annen arbeidsmengde.',
    assessmentRules:
      'Første innsendte svar beholdes. Teori eller journal under forsøket registreres som hjelp. Senere forsøk er øving; ingen XP eller generell mestring gis. Du kan gå direkte til oppgaven uten å få godskrevet undervisningen.',
    beginAssessment: 'Start endret oppgave',
    continueAssessment: 'Fortsett uferdig v2-oppgave',
    submitted: 'Alle svar er registrert før tilbakemelding.',
    first: 'Første oppgaveobservasjon uten registrert hjelp',
    assisted: 'Oppgaveobservasjon med registrert hjelp',
    retry: 'Nytt øvingsforsøk',
    aid: 'Hjelp er registrert i dette forsøket.',
    sendAnswers: 'Lever alle svar',
    journal: 'Les hele teorien for dette steget',
    sources: 'Kilder og modellgrenser',
    storage:
      'V2-lagringen er utilgjengelig eller må gjenopprettes. Ingen v1-data eller tekniske ressurser er slettet.',
    reset: 'Nullstill bare Foundations v2',
    topics: {
      'intro-request': {
        title: 'Du åpner en produktside',
        objective: 'Skille nettleseren fra programmet som svarer.',
        text: 'Du åpner en produktside i nettbutikken. Nettleseren på PC-en din ber et annet program om innholdet. Denne beskjeden kaller vi en forespørsel, eller request. Programmet som ber, har rollen klient. Når tjenesten svarer med innhold, kan nettleseren vise siden. Svaret kan også fortelle at noe gikk galt.',
        detail:
          'Butikkens server-side applikasjon kan for eksempel beregne en pris. Nettleseren viser svaret og kan også kjøre egen klientkode. Her følger vi bare én forenklet forespørsel. Pilene er meldinger, ikke Azure-scope eller målt nettverkstrafikk. En internettforbindelse gjør ikke automatisk en datamaskin til en skytjeneste.',
      },
      'physical-server': {
        title: 'Inne i serveren',
        objective: 'Skille fysisk maskinvare, operativsystem og applikasjon.',
        text: 'Serveren er her en fysisk datamaskin som leverer en tjeneste til andre. Applikasjonen er programvaren som utfører butikkens oppgaver: finne produktopplysninger og lage et svar. Ordet server brukes også om programvare som tilbyr en tjeneste; i denne tegningen peker det på datamaskinen.',
        detail:
          'CPU-en utfører programmets instruksjoner. RAM er arbeidsminnet for data som brukes nå. Lagring beholder for eksempel bilder mellom arbeidsøkter. Nettverket lar maskinen utveksle beskjeder. Operativsystemet fordeler maskinens ressurser og lar applikasjonen kjøre. Mer lagringsplass gir ikke automatisk mer prosessorkraft. Arbeidskopien kan ligge i minnet mens den varige filen ligger på lagring.',
      },
      virtualization: {
        title: 'Én vert, flere virtuelle maskiner',
        objective: 'Forstå at virtuelle ressurser har fysisk backing.',
        text: 'Én fysisk vert kan kjøre flere virtuelle maskiner, forkortet VM. Hver VM har tildelte virtuelle ressurser og sitt eget gjesteoperativsystem. Hypervisoren er laget som gjør dette mulig og styrer tilgangen til den fysiske verten. To virtuelle maskiner betyr ikke at vi har kjøpt to nye fysiske maskiner.',
        detail:
          'I denne undervisningsmodellen har verten et RAM-budsjett på 8 minneenheter. Hver VM tildeles et helt antall enheter, uten overcommit. Enheter her er kun et minnebudsjett, ikke arbeidspakkene vi bruker senere. Ekte hypervisorer kan ha andre minne- og planleggingsmekanismer. Illustrasjonen lover verken full sikkerhetsisolasjon eller at alle Azure-tjenester bruker samme oppbygning.',
      },
      provisioning: {
        title: 'Fra innkjøp til provisioning',
        objective: 'Skille en administrasjonsbestilling fra besøk i nettbutikken.',
        text: 'I eget maskinrom må noen skaffe og klargjøre kapasiteten. En skyleverandør tilbyr definerte IT-tjenester fra infrastrukturen sin. Kunden ber om en støttet ressurs gjennom en administrasjonsflate eller et API: en programmatisk måte å sende forespørselen på. Å bestille og klargjøre ressursen kalles provisioning. Maskinvaren finnes fortsatt.',
        detail:
          'En Azure Virtual Machine er ett eksempel på en konfigurert virtuell ressurs. Bestillingen går til administrasjonssystemet, ikke til butikkens produktside. Tilgang, kvoter (tillatt ressursmengde), tilgjengelig kapasitet og oppstart kan begrense leveransen. Akseptert konfigurasjon beviser ikke at butikkoden fungerer. Modellen oppretter ingen VM og måler ingen Azure-ventetid.',
      },
      'capacity-basics': {
        title: 'Én time. En tydelig enhet.',
        objective: 'Forklare behov, allokering og ubrukt kapasitet før regning.',
        text: 'Butikken har mer arbeid når kampanjen åpner. For å se forholdet mellom arbeid og kapasitet lager vi en enkel undervisningsmodell. Én arbeidspakke er en oppdiktet mengde arbeid som trenger én kapasitetsenhet i én hel undervisningstime. Den er ikke én kunde, HTTP-forespørsel, CPU-kjerne, VM eller Azure-størrelse.',
        detail:
          'Hver time regnes for seg; arbeid flyttes ikke til neste time i denne modellen. Behov er etterspurt arbeid. Allokert kapasitet er det som er satt av. Behandlet arbeid er det minste av behov og kapasitet. Behov 2 og kapasitet 6 gir behandlet 2, ubrukt 4 og udekket 0. Ubrukt kapasitet betyr at mer arbeid kunne vært behandlet, ikke at 4 pakker ble avvist.',
      },
      'v2-capacity': {
        title: 'Forutsi kampanjedagen',
        objective: 'Registrere en antakelse, kjøre og forklare en ny arbeidsmengde.',
        text: 'Nå kommer en annen dag: timene 09–10, 10–11, 11–12 og 12–13 trenger 3, 3, 8 og 3 arbeidspakker. Kapasiteten gjelder hver time. Hvor mange pakker blir ikke behandlet i den travleste timen? Registrer en antakelse før du kjører. Den kan være feil; vi undersøker årsaken etterpå.',
        detail:
          'Etter kjøringen: endre bare kapasiteten og prøv igjen. Sammenlign to faktisk utførte kjøringer. Samme allokering gir samme behandlet arbeid uansett om maskinen eies eller kapasiteten bestilles fra en leverandør. Cloud innebærer ikke automatisk skalering; endring krever en støttet konfigurasjon innen grenser. Denne modellen beregner ikke pris, kø, CPU-belastning eller svartid.',
      },
      'v2-responsibility': {
        title: 'Hvem gjør arbeidet nå?',
        objective: 'Skille leverandørdrift fra kundens gjenværende ansvar.',
        text: 'Leverandøren kan drifte den fysiske plattformen. Teamet må fortsatt ta riktige valg for egne data, tilganger og klientmaskiner. Hvem som vedlikeholder operativsystem og runtime avhenger av tjenesten. Runtime er miljøet som kjører applikasjonskoden.',
        detail:
          'Azure Virtual Machines og en App Service-plattform overlater ulike oppgaver til kunden. Sammenlign konkrete tjenester i modellen; farger alene er ikke en sikkerhetsgaranti. Endpoint betyr her kundens enhet, ikke Azure Private Endpoint.',
      },
      'v2-models': {
        title: 'Public, private og hybrid cloud',
        objective: 'Skille bruksgrenser fra byggets adresse.',
        text: 'Public cloud tilbys til flere kunder av en leverandør. Det gjør ikke kundedata offentlige. Private cloud er et skymiljø for én organisasjon og kan drives hos en tredjepart. Hybrid kobler sammen miljøer som må fungere sammen.',
        detail:
          'Eierskap, hvem som bruker miljøet og faktisk integrasjon er viktigere enn adressen til bygget. Eget maskinrom alene etablerer ikke selvbetjening og andre cloud-egenskaper. Cloud-modell og IaaS/PaaS/SaaS er forskjellige akser: tilgang til miljøet og fordeling av driftsoppgaver.',
      },
      'v2-placement': {
        title: 'Velg miljø ut fra kravet',
        objective: 'Begrunne tre plasseringer med avgjørende behov.',
        text: 'Et kort arrangement, et krav om eksklusivt skymiljø og en ny nettfront som må bruke et beholdt lokalt system er tre forskjellige behov. Velg ut fra kravet som faktisk avgjør valget. Ingen modell er alltid billigst eller tryggest.',
        detail:
          'Eksklusivitetscaset forutsetter en hel cloud-plattform under organisasjonens rammer, ikke bare én dedikert ressurs i public cloud. Hybrid krever integrasjon og driftsarbeid; en tegnet forbindelse konfigurerer ikke nettverk eller identitet. Begrunn både valgt miljø og hvilket krav alternativet ikke oppfyller.',
      },
      'v2-metering': {
        title: 'Hva måler forbruket?',
        objective: 'Skille allokert tid fra nyttig trafikk.',
        text: 'En tjeneste kan måle tiden kapasitet er allokert, ikke bare antall besøkende. Null besøk betyr derfor ikke nødvendigvis null målt bruk. Å stoppe applikasjonen er heller ikke det samme som å frigi en ressurs. Lagring og andre tjenester kan fortsatt ha egne kostnader.',
        detail:
          'Nå innfører vi en annen måleenhet: kapasitetstimer. Én kapasitetsenhet kan i undervisningsmodellen behandle én arbeidspakke per time. 6 enheter allokert i 4 timer er 24 kapasitetstimer selv om 0 pakker behandles. Med en oppdiktet sats på 2 kreditter per kapasitetstime blir beregning 48. Frigitt compute gir 0 i bare denne måleren; lagring og overføring er utelatt. Dette er ingen Azure-pris.',
      },
      'v2-pricing': {
        title: 'Prismodeller og risiko',
        objective: 'Vurdere samlet forpliktelse, nyttig bruk og avbrudd.',
        text: 'Fleksibel forbruksbetaling og en betalingsforpliktelse fordeler risiko forskjellig. Rabatt kan lønne seg ved jevnt, kvalifisert forbruk. Ubrukt binding kan koste mer ved usikkert behov. En reservation eller savings plan er et faktureringstilbud med vilkår, ikke en knapp som oppretter kapasitet.',
        detail:
          'Spot kan avbrytes og passer ikke alle oppgaver. Sammenlign totalen under samme etterspørsel, ikke bare en rabattert enhetspris. I de bevarte undervisningseksemplene koster binding 24 kreditter for fire timer med inntil 6 kapasitetsenheter per time, pluss 2 per overskytende kapasitetstime. Forbruksbetaling er 2 per allokert kapasitetstime. Dette er oppdiktede, ufullstendige antakelser, ikke priser eller kapasitetsgarantier.',
      },
      'resource-bridge': {
        title: 'Fra forståelse til Portal-laboratoriet',
        objective: 'Knytte provisioning og ansvar til scope og hosting.',
        text: 'I laboratoriet skal vi konfigurere ressurser, ikke bestille virkelige Azure-tjenester. En subscription er en administrasjons- og faktureringsgrense. En resource group samler relaterte ressurser for forvaltning. Den er ikke datamaskinen som kjører appen. Gruppens metadataregion er et annet valg enn hostingressursens sted.',
        detail:
          'Appteamet har egen webkode og vil slippe gjesteoperativsystem. Først undersøker neste modul hvilke fordeler kapasitet, recovery og styring kan gi. Deretter forklarer Describe cloud service types hvorfor en App Service-lignende plattform er relevant. Vi bruker det samme Portal-laboratoriet: group, plan, Web App, policyavslag, retting og hostingrelasjon. Navigasjon gir ingen godskriving av de neste modulene.',
      },
    },
    checkItems: {
      'intro-request': {
        question: 'Hvor utføres butikkens server-side prisberegning i dette eksempelet?',
        choices: [
          ['browser', 'All programvare flyttes til nettleseren'],
          ['server', 'Applikasjonen på serveren behandler den'],
        ],
        correct:
          'Server-side programmet behandler forespørselen og sender et svar. Nettleseren kan ha egen klientkode, men har ikke overtatt serverprogrammet.',
        wrong: 'Nettleseren sender en beskjed. Den flytter ikke serverprogrammet til PC-en din.',
      },
      'physical-server': {
        question:
          'Produktbilder skal beholdes mellom arbeidsøkter. Hva skiller dette fra arbeidskopien som brukes nå?',
        choices: [
          ['ram', 'Bare RAM beholder bildene varig'],
          ['storage', 'Lagring beholder filen; RAM er arbeidsflate'],
        ],
        correct:
          'Den varige filen ligger på lagring; en arbeidskopi kan ligge i RAM under behandlingen.',
        wrong:
          'RAM er arbeidsminne. Lagring er den varige delen i denne modellen; mer diskplass er heller ikke mer prosessorkraft.',
      },
      virtualization: {
        question: 'VM A bruker 5 av vertens 8 minneenheter. Hvorfor avvises 4 til VM B her?',
        choices: [
          ['new-memory', 'Det finnes ingen felles fysisk begrensning'],
          ['finite', '5 + 4 overstiger vertens fysiske undervisningsbudsjett'],
        ],
        correct:
          'Hypervisoren fordeler en begrenset vert. Den nye VM-en skaper ikke fysisk RAM. Reelle overcommit-mekanismer er utenfor modellen.',
        wrong:
          'Virtuelle maskiner har fysisk backing. I denne uttrykkelige modellen uten overcommit kan ikke 9 enheter allokeres fra 8.',
      },
      provisioning: {
        question: 'Hvilken handling ber administrasjonssystemet om en ny ressurs?',
        choices: [
          ['traffic', 'En kunde åpner en produktside'],
          ['control', 'Teamet sender en støttet konfigurasjonsbestilling'],
        ],
        correct:
          'Dette er kontroll-/administrasjonsbanen. En kundeforespørsel bruker applikasjonen; den bestiller ikke infrastrukturen.',
        wrong:
          'En produktside er applikasjonstrafikk. Provisioning er en separat administrasjonsoperasjon med egne grenser.',
      },
      'capacity-basics': {
        question: 'Behov 2 og kapasitet 6 gir fire ubrukte plasser. Hva betyr de?',
        choices: [
          ['unmet', 'Fire etterspurte pakker ble ikke behandlet'],
          ['unused', 'Modellen kunne behandlet fire pakker til'],
        ],
        correct: 'Ubrukt = allokert − behandlet. Udekket = behov − behandlet. Her er udekket 0.',
        wrong:
          'Skill kapasitet som ikke trengtes fra arbeid som ikke ble behandlet. Bare to pakker ble etterspurt.',
      },
      'v2-capacity': {
        question:
          'Hvorfor kan ledig kapasitet i første time ikke dekke topptimens manglende arbeid her?',
        choices: [
          ['carry', 'Ledige plasser lagres automatisk til neste time'],
          ['same-hour', 'Hver time beregnes separat uten overføring av arbeid'],
        ],
        correct:
          'Modellen har ingen kø eller overføring mellom timer. Mer kapasitet reduserer udekket arbeid, men kan gi mer ubrukt kapasitet.',
        wrong:
          'Timer kan ikke låne kapasitet av hverandre i denne modellen. Et reelt system med kø ville trengt en annen modell.',
      },
    },
    vm: {
      host: 'Fysisk vert · RAM-budsjett 8',
      hypervisor: 'Hypervisor · fordeler vertens ressurser',
      guest: 'Gjeste-OS + applikasjon',
      a: 'Minneenheter til VM A',
      b: 'Minneenheter til VM B',
      apply: 'Prøv minnetildelingen',
      accepted: 'Akseptert tildeling',
      requested: 'Forespurt tildeling',
      denied: 'Avvist: totalen overstiger 8. Den aksepterte tildelingen er uendret.',
      ok: 'Tildelingen passer innen vertens budsjett.',
      unit: 'minneenheter',
    },
    provision: {
      owned: 'Eget maskinrom',
      cloud: 'Leverandørens tjeneste',
      mode: 'Hvem klargjør kapasiteten?',
      available: 'Støttet kapasitet tilgjengelig',
      unavailable: 'Undervisningskapasitet utilgjengelig',
      request: 'Send konfigurasjonsbestilling',
      control: 'Administrasjonsbane',
      workload: 'Applikasjonsbane',
      result: 'Bestillingsresultat',
      accepted:
        'Akseptert: modellen tildelte en støttet konfigurasjon. Ingen app er testet eller deployet.',
      denied: 'Avvist: ingen kapasitet tildelt i denne kjøringen.',
      local: 'Anskaff maskin → installer OS → klargjør applikasjonen',
      provider: 'Kunde ber → leverandør validerer → støttet konfigurasjon eller avslag',
      traffic: 'Nettleser → butikkens program → svar. Denne banen bestiller ingen ressurs.',
    },
    privateOffsite: 'Vis private cloud hos ekstern operatør',
    privateExplanation:
      'Fortsatt private cloud: én organisasjon bruker denne cloud-plattformen eksklusivt. Flyttingen av bygget endrer ikke bruksgrensen.',
    modelIntro:
      'Eksperimenter som bestiller en bestemt kapasitet per time er undervisningsantakelser, ikke en innebygd autoskalerer. Leverandørvalg alene endrer ikke gjennomstrømning ved lik allokering.',
    bridgeAction: 'Fortsett til service types og det eksisterende laboratoriet',
    bridgeResume: 'Tilbake fra laboratoriet · se den faktiske debriefen',
    bridgeReturn: 'Tilbake til cloud computing · praktisk kobling',
    build: 'Bygginformasjon · forhåndsvisning',
    branch: 'Gren',
    commit: 'Commit',
    local: 'Lokal kjøring · identifikator ikke oppgitt',
    extraItems: [
      {
        id: 'shortfall',
        question: 'Hvor mange pakker er udekket i pilotens travleste time?',
        choices: [],
        explanation:
          'Time 2 trenger 7, mens kapasiteten er 5. Udekket er 7 − 5 = 2; andre timer kan ikke låne bort kapasitet.',
      },
      {
        id: 'unused',
        question: 'I hvilke timer finnes ubrukt kapasitet?',
        choices: [
          ['2', 'Bare time 2'],
          ['1,3,4', 'Time 1, 3 og 4'],
          ['1,2,3,4', 'Alle fire'],
        ],
        explanation:
          'Behov 1/7/4/2 mot kapasitet 5 gir ubrukt 4/0/1/3: totalt 8 potensielle pakker over fire timer.',
      },
      {
        id: 'cause',
        question:
          'Den samme faste kapasiteten kjøpes fra en leverandør. Hva skjer med behandlet arbeid i denne modellen?',
        choices: [
          ['provider', 'Alt arbeid behandles automatisk fordi det er cloud'],
          ['allocation', 'Samme allokering og behov gir samme behandlet arbeid'],
        ],
        explanation:
          'Procurement endrer ikke regnestykket min(behov, kapasitet). Skalering krever en ny tildeling; modellen lover ingen automatisk kapasitet.',
      },
      {
        id: 'host',
        question: 'Hvorfor gir en ekstra VM ikke ubegrenset fysisk RAM?',
        choices: [
          ['infinite', 'VM-er er uavhengige av maskinvare'],
          ['finite', 'VM-ressurser må understøttes av en begrenset fysisk vert'],
        ],
        explanation:
          'Hypervisoren forvalter fysisk backing. VM-antall er ikke det samme som fysisk kapasitet; den forenklede budsjettmodellen har ingen overcommit.',
      },
    ],
  },
  resourceNaming: {
    title: 'Forstå navnet · en konvensjon, ikke et krav',
    intro:
      'Eksempelet rg-webapp-dev kan leses som type – arbeidslast – miljø. Du bestemmer selv navnet; veilederen endrer eller sender det ikke.',
    parts: [
      ['rg', 'Vanlig forkortelse for resource group. Azure krever ikke dette prefikset.'],
      ['webapp', 'Prosjektet eller arbeidslasten gjør det lettere å finne relaterte ressurser.'],
      [
        'dev / test / prod',
        'Development, testing og production. Ordene beskriver hensikt; de oppretter ikke sikkerhet, isolasjon eller et produksjonsmiljø.',
      ],
    ],
    rulesTitle: 'Navneregler · teknisk validering',
    rules:
      'Resource group-navn er unike innen subscription, 1–90 tegn, uten punktum til slutt. Azure dokumenterer Unicode-bokstaver, desimalsifre, understrek, bindestrek, parenteser og punktum. Et navn som teamA er lovlig uten rg- eller miljøkode.',
    limit:
      'Simulatoren bruker sin eksisterende validator. Dens Unicode-tallkategori er litt bredere enn den offisielle desimalsifferregelen; dette er ikke full Azure-paritet. Review viser faktiske ugyldige navn og duplikater. Navnekonvensjonen gir ingen ekstra valideringsregel.',
  },
  foundationsVisuals: {
    reviewBadge: 'REVIEWKANDIDAT · IKKE EN FULLFØRT LÆRINGSMODUL',
    reviewTitle: 'AzureLab 3.1A — Forhåndsvis nytt læringsdesign',
    reviewDescription:
      'Undersøk et kandidatdesign for Describe cloud computing. Dagens læringsmodul er uendret. Designprøven lagrer ikke læringsresultater, vurderinger eller XP. Du kan gå tilbake til kurset og sammenligne.',
    reviewAction: 'Åpne designprøven',
    brand: 'AzureLab',
    badge: 'DESIGNPRØVE · 3.1A',
    exit: 'Tilbake til dagens kurs',
    notice:
      'En isolert designprøve. Ingen kursfullføring, XP eller lagring. Dagens kurs er uendret.',
    eyebrow: 'FØR VI SNAKKER OM SKYEN',
    title: 'Fra nettbutikk til datakraft',
    intro:
      'Hva er det egentlig som gjør arbeidet når du åpner en nettside? Følg én forespørsel, undersøk maskinen og prøv en tydelig avgrenset kapasitetsmodell.',
    nav: 'Designprøvens undervisningssekvens',
    stages: ['En kjent situasjon', 'Inne i serveren', 'Forstå modellen', 'Forutsi og undersøk'],
    next: 'Gå videre',
    previous: 'Tilbake',
    stage: 'Del',
    objective: 'Dette skal du forstå',
    titles: [
      'Du åpner en produktside',
      'En server er en datamaskin med en oppgave',
      'Én time. En tydelig enhet.',
      'Hva skjer når kampanjen åpner?',
    ],
    purposes: [
      'Skille nettleseren på din PC fra programmet som svarer et annet sted.',
      'Skille fysisk maskinvare fra programvaren som bruker den.',
      'Forstå hva tallene betyr før vi bruker dem til å forutsi noe.',
      'Bruke modellen på et nytt behov og forklare resultatet.',
    ],
    explanations: [
      'Nettleseren ber butikkens tjeneste om en produktside. Den som ber, har rollen klient. Beskjeden kaller vi en forespørsel, eller request. Et program på serveren behandler den og sender et svar tilbake. Nettleseren bruker svaret til å vise innholdet.',
      'I denne illustrasjonen er serveren en fysisk datamaskin som leverer en tjeneste. Applikasjonen er programvaren som utfører butikkens oppgaver. Operativsystemet lar programmet bruke maskinens ressurser. Velg en del for å se hva den bidrar med.',
      'Vi teller oppdiktede, like store arbeidspakker. Kapasiteten forteller hvor mange pakker modellen kan behandle i én undervisningstime. Behov er antallet vi ber om. Allokert betyr at kapasiteten er satt av og tilgjengelig. Med kapasitet til seks pakker og behov for to kan modellen behandle begge. Vi kunne behandlet fire pakker til: ubrukt kapasitet, ikke udekket behov.',
      'Vi sammenligner fire like undervisningstimer på en kampanjedag. Behovet er tre, tre, åtte og tre arbeidspakker. Kapasiteten du velger gjelder hver time. Forutsi hvor mange pakker som ikke blir behandlet i den travleste timen. Kjør deretter modellen.',
    ],
    mentor: [
      'Legg merke til retningen: Nettleseren ber. Tjenesten svarer. Vi simulerer ikke ekte nettverkstrafikk.',
      'Applikasjonen og serveren er forskjellige ting. Programmet trenger en maskin, men er ikke selve maskinen.',
      'En arbeidspakke er ikke én kunde, HTTP-forespørsel, CPU-kjerne, VM eller Azure-størrelse. Enheten gjør bare forholdet mellom behov og kapasitet synlig.',
      'Kapasiteten endrer seg ikke automatisk med trafikken. Du velger en ny fordeling og kjører på nytt. Dette er ikke en modell av Azure-autoskalering.',
    ],
    send: 'Send en forespørsel',
    replay: 'Følg forespørselen på nytt',
    trace:
      'Nettleseren ba om innhold → applikasjonen behandlet forespørselen → et svar ble sendt tilbake.',
    websiteNote:
      'En enkel nettside kan leveres fra filer. Ikke alle nettsider trenger en egen database. En database brukes når programmet trenger organiserte data det kan hente eller endre.',
    client: 'DIN PC · KLIENT',
    browser: 'Nettleser',
    product: 'Nettbutikk',
    productLine: 'En produktside',
    server: 'BUTIKKENS FYSISKE SERVER',
    request: 'Forespørsel om innhold',
    requestLabel: 'Forespørsel',
    response: 'Svar tilbake til nettleseren',
    responseLabel: 'Svar',
    pathNote: 'Forenklet meldingsflyt · ingen målt tid',
    selectPart: 'Undersøk serverens deler',
    parts: [
      {
        id: 'cpu',
        name: 'CPU',
        role: 'Utfører instruksjoner',
        explanation:
          'Prosessoren utfører instruksjonene i programmet. Butikkens produktberegning trenger prosessortid. Mer diskplass gjør ikke i seg selv at CPU-en utfører flere instruksjoner.',
      },
      {
        id: 'ram',
        name: 'RAM',
        role: 'Arbeidsminne',
        explanation:
          'RAM holder data som programmet arbeider med akkurat nå. Det er en arbeidsflate, ikke varig arkivering. Produktlisten kan ligge her mens programmet lager et svar.',
      },
      {
        id: 'storage',
        name: 'Lagring',
        role: 'Beholder data',
        explanation:
          'Lagring beholder for eksempel produktbilder mellom arbeidsøkter. Den er forskjellig fra arbeidsminnet. En database er en måte å organisere og bruke lagrede data på, ikke navnet på all lagring.',
      },
      {
        id: 'network',
        name: 'Nettverk',
        role: 'Utveksler beskjeder',
        explanation:
          'Nettverkstilkoblingen lar serveren motta forespørsler og sende svar. En internettforbindelse alene gjør ikke en eid maskin til en skytjeneste.',
      },
      {
        id: 'os',
        name: 'Operativsystem',
        role: 'Forvalter maskinens ressurser',
        explanation:
          'Operativsystemet håndterer blant annet prosesser, minne og enheter slik at programmer kan kjøre. Det er programvare, ikke enda en fysisk komponent i kabinettet.',
      },
      {
        id: 'app',
        name: 'Applikasjon',
        role: 'Utfører butikkens oppgave',
        explanation:
          'Applikasjonen er programvaren som for eksempel finner produktinformasjon og lager et svar. Den bruker operativsystemet og maskinvaren; den er ikke en fysisk server.',
      },
    ],
    software: 'PROGRAMVARE',
    hardware: 'MASKINVARE · ENDELIGE RESSURSER',
    singleHour: 'Gjennomarbeidet eksempel · kl. 09–10',
    periods: ['09–10', '10–11', '11–12', '12–13'],
    period: 'Undervisningstime',
    numericTable: 'Vis de samme verdiene i tabell',
    demand: 'Behov',
    allocation: 'Allokert kapasitet',
    served: 'Behandlet',
    unused: 'Ubrukt kapasitet',
    unmet: 'Udekket behov',
    bundles: 'arbeidspakker',
    unit: 'Arbeidspakker i hver undervisningstime',
    assumptions: 'Modellens forutsetninger',
    limits:
      'Hver time regnes separat. Udekket arbeid flyttes ikke til neste time. Reelle systemer har blant annet køer, ulike jobbstørrelser og flaskehalser. Her beregner vi verken responstid, CPU-belastning, priser eller faktisk Azure-kapasitet.',
    allocationLabel: 'Tilgjengelig kapasitet hver time',
    allocationUnit: 'pakker/time',
    prediction: 'Din prediksjon: udekkede pakker i den travleste timen',
    predictionHint:
      'Skriv et helt tall fra 0 til 12. Den nye kampanjens resultat vises først etter kjøring.',
    run: 'Registrer prediksjon og kjør',
    awaiting: 'Behovet er kjent. Resultatet er ennå ikke beregnet i visningen.',
    stale:
      'Kapasiteten er endret. Forrige resultat er satt til side; registrer en ny prediksjon og kjør igjen.',
    invalid: 'Skriv et helt tall fra 0 til 12 før du kjører.',
    result: 'Det modellen faktisk beregnet',
    causal:
      'I topptimen ber vi om 8 pakker. Modellen kan behandle høyst den allokerte kapasiteten. Forskjellen er udekket behov; ledig plass i andre timer kan ikke dekke den her.',
    predictionWas: 'Du forutsa',
    observed: 'Modellen viser',
    correction:
      'Forskjellen er nyttig å undersøke. Sammenlign behov og kapasitet i samme time, ikke summen av alle timene.',
    matched: 'Prediksjonen samsvarer med dette forsøket. Forklar også hvorfor resultatet oppstår.',
    peak: 'Udekket i topptimen',
    totalUnused: 'Sum ubrukt kapasitet',
    unusedUnit: 'pakker over fire timer',
    compare: 'Forrige kjøring',
    compareNote:
      'Begge kjøringer bruker den samme kampanjen. Mer allokert kapasitet kan redusere udekket behov, men etterlate mer ubrukt kapasitet. Ingen pris er beregnet.',
    reflection: 'Hva forteller ubrukt kapasitet oss?',
    reflectChoices: [
      'Modellen kunne håndtert mer arbeid i de timene.',
      'Arbeid ble nødvendigvis avvist i de timene.',
    ],
    reflectFeedback: [
      'Ja. Ubrukt kapasitet er forskjellen mellom tilgjengelig og behandlet arbeid. Udekket behov er noe annet: forespurt arbeid som ikke ble behandlet.',
      'Ikke nødvendigvis. Ubrukt betyr at kapasitet var tilgjengelig uten å bli brukt. Avvist eller udekket arbeid må undersøkes ved å sammenligne behov med kapasitet.',
    ],
    continuation:
      'Neste designsteg: virtualisering og bestilling gjennom en skyleverandør. Disse delene er spesifisert, men ikke implementert i prøven.',
    references: 'Kilder og avgrensning',
    sourceNote:
      'Original illustrasjon og oppdiktet kapasitetsmodell. Microsoft-kildene under støtter den senere sky- og virtualiseringsforklaringen, ikke tallene eller en Azure-pris.',
    sources: [
      {
        name: 'Describe cloud computing',
        url: 'https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/',
      },
      {
        name: 'Virtual machines in Azure',
        url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/overview',
      },
    ],
  },
  course: {
    brand: 'AzureLab',
    version: '3.2.1',
    home: 'Læringsreisen',
    sandbox: 'Fri Portal-sandbox',
    learning: 'Kursinnhold',
    journal: 'Knowledge Journal',
    eyebrow: 'DIN AZURE-LÆRINGSREISE',
    title: 'Forstå skyen. Bygg med innsikt.',
    intro:
      'Lær prinsippene, undersøk tekniske modeller og bruk dem i en simulert Azure Portal. Du trenger ingen Azure-konto, og ingenting opprettes i skyen.',
    track: 'Startspor · grunnleggende Azure',
    path: 'Aktiv læringssti',
    module: 'Modul',
    available: 'Tilgjengelig',
    planned: 'Planlagt · ikke tilgjengelig',
    sequence: 'Din første læringssti',
    sequenceNote:
      'Følg anbefalt rekkefølge, eller åpne en tilgjengelig modul direkte. Hopp over materiale uten å få det registrert som lært.',
    computing:
      'Forstå cloud computing, ansvar, public/private/hybrid cloud og forbruksmodeller gjennom seks fullstendige undersøkelser.',
    benefits:
      'Undersøk tilgjengelighet, skalerbarhet, pålitelighet, forutsigbarhet, sikkerhet, governance, manageability og sustainability gjennom fem sammenhengende undersøkelser og en endret egenoppgave.',
    services:
      'Undersøk IaaS, PaaS og SaaS. Begrunn tjenestevalg, konfigurer en applikasjonsplattform og forklar resultatet.',
    open: 'Åpne modul',
    begin: 'Begynn med cloud computing',
    resume: 'Fortsett der du slapp',
    next: 'Neste aktivitet',
    previous: 'Forrige aktivitet',
    current: 'Du er her',
    overview: 'Kursoversikt',
    broader: 'Videre mot profesjonell Azure-kompetanse',
    broaderText:
      'Nettverk, identitet, sikkerhet, applikasjoner, drift og arkitektur hører til den langsiktige kompetansereisen. Disse kursene er planlagt, ikke tilgjengelige laboratorier.',
    progress: 'Faktiske læringsobservasjoner',
    computingProgress: 'Veiledede undersøkelser',
    serviceProgress: 'Begrunnede tjenestecaser',
    participation:
      'Lesing og navigasjon er orientering, ikke bevis på forståelse. Lokale AzureLab-resultater er ikke Microsoft Learn-fullføring eller eksamensberedskap.',
    guided: 'Guided Lab · veiledet praksis',
    independent: 'Independent Challenge',
    free: 'Free Sandbox',
    labTitle: 'Praktisk lab · fra ressursgruppe til webplattform',
    labIntro:
      'Et fiktivt applikasjonsteam vil beholde egen HTTP-kode og slippe å vedlikeholde gjesteoperativsystemet. Du skal organisere ressursene, etablere hosting og undersøke en teknisk avvisning.',
    labBridge:
      'En Resource Group er et anvendt forkunnskapstema fra Azure resource organization. Å lage gruppen alene fullfører ikke et offisielt Service Types-læringsmål. Planen og webappen gjør arbeidsdelingen i PaaS konkret.',
    labExpect:
      'Du bruker den fungerende treningsportalen: søk, velg scope, konfigurer, kontroller Review + create og send selv. SavvyShark forklarer kontrollene; motoren bestemmer resultatet.',
    startLab: 'Start praktisk lab',
    resumeLab: 'Fortsett praktisk lab',
    returnCourse: 'Tilbake til kurset',
    leaveLab: 'Avslutt labvisningen',
    unfinished:
      'Labben er påbegynt, men de nødvendige tekniske resultatene og inspeksjonene er ikke alle bekreftet. Du kan fortsette fra den lagrede tekniske tilstanden.',
    satisfied: 'Veiledet lab fullført',
    debrief: 'Dette konfigurerte og undersøkte du',
    debriefText:
      'Du organiserte ressursene i App Sandbox, undersøkte en faktisk avvisning fra treningspolicyen, valgte en tillatt ressurslokasjon og knyttet webappen til en gyldig plan. Gruppens metadata er i Norway East; hosting er i West Europe. Dette er registrert konfigurasjon, ikke utrullet kode eller bekreftet drift.',
    reflection: 'Refleksjon · hva gjenstår hos kunden i dette App Service-eksemplet?',
    reflectionData: 'Egen kode, kundedata, tilgang og støttet konfigurasjon',
    reflectionProvider: 'Ingenting; PaaS overtar alle sikkerhets- og driftsvalg',
    checkReflection: 'Undersøk begrunnelsen',
    reflectionCorrect:
      'Ja. Plattformens OS-arbeid flyttes, men teamet må fortsatt vedlikeholde kode og velge forsvarlig tilgang, datahåndtering og konfigurasjon.',
    reflectionWrong:
      'Administrert plattform opphever ikke kundens ansvar. Sammenlign OS-laget med kode, tilgang og data; de flyttes ikke samlet til leverandøren.',
    notMastery:
      'Dette er veiledet praksis. Den uavhengige oppgaven har endrede krav og egen vurderingshistorikk; ingen profesjonell mestring eller full Chapter 01-fullføring er påstått.',
    startIndependent: 'Prøv endrede krav uten veiledning',
    activeAssessment:
      'Du har en aktiv uavhengig oppgave. Å åpne teori eller starte veiledning registreres som hjelp i den oppgaven.',
    storeIssue:
      'Kurskonteksten kan ikke lagres eller verifiseres. Tidligere teknisk arbeid er ikke slettet.',
    reload: 'Les lagringen på nytt',
    clear: 'Nullstill bare kurskontekst',
    assistant: 'SavvyShark',
    assistantRole: 'Din kontekstuelle læringsguide',
    minimize: 'Minimer veiledningen',
    expand: 'Vis veiledningen',
    hint: 'Valgfritt hint',
    locate: 'Finn kontrollen',
    missing:
      'Kontrollen er ikke synlig her. Følg den beskrevne navigasjonen, åpne portalmenyen ved behov, eller bruk Finn kontrollen. Ingen handling utføres automatisk.',
    why: 'Hvorfor dette steget?',
    alternative:
      'Du kan utforske trygt. Gå tilbake til den beskrevne siden for å fortsette; utforskning fullfører ikke teknisk arbeid.',
    currentStep: 'Nå i labben',
    target: 'Aktuell kontroll',
    inspect: 'Inspiser i Architecture Explorer',
    goGroups: 'Åpne Resource groups',
    goPlans: 'Åpne App Service plans',
    goApps: 'Åpne App Services',
    goReceipt: 'Åpne avvist operasjon',
    goPolicy: 'Undersøk policyen',
    savedContext: 'Kursstedet huskes. Du kan komme tilbake hit fra laboratoriet.',
    theoryGuide:
      'Undersøk eksemplet før du velger: VM gir gjeste-OS-kontroll, innebygd App Service-runtime flytter plattformarbeid, og Microsoft 365 tilbyr en ferdig tjeneste. Det er kravene og ansvaret som avgjør.',
    modelGuide: {
      iaas: 'I VM-eksemplet beholder kunden gjeste-OS, runtime og kode. Mer kontroll gir mer vedlikeholdsarbeid.',
      paas: 'I dette App Service-eksemplet driver leverandøren OS og innebygd runtime. Egen kode, data og tilgang er fortsatt kundens oppgaver.',
      saas: 'Microsoft 365 er en ferdig tjeneste. Kunden må fortsatt konfigurere brukere, tilgang og data; SaaS er ikke vilkårlig hosting av egen serverkode.',
    },
    guidance: {
      'fix-validation': [
        'Undersøk forhåndskontrollen',
        'Les den faktiske valideringsårsaken. Gå tilbake til Basics og rett feltet før Create.',
        'En ugyldig eller duplisert forespørsel blir ikke en ressurs. Kapasitetsgrenser og støttede felt er en del av den avgrensede modellen.',
        'Feilen vises ved Review + create. Du må selv rette konfigurasjonen.',
      ],
      'find-groups': [
        'Finn Resource groups',
        'Skriv Resource groups i globalt søk og åpne tjenesten. Du kan også bruke portalmenyen.',
        'Vi forbereder plattformen for teamets applikasjon. En resource group samler relaterte ressurser for management under en subscription; den gir ingen server eller compute-kapasitet. Søk åpner tjenesten uten å opprette noe.',
        'Bruk søkefeltet øverst. Piltast ned og Enter åpner et treff.',
      ],
      'create-group': [
        'Opprett en livssyklusgruppe',
        'Velg Create i Resource groups. Du skal opprette en ny gruppe for teamets plattform.',
        'Gruppen gir management-scope og felles livssyklus, ikke compute eller fysisk plassering.',
        'Create åpner den reelle simulerte konfigurasjonen.',
      ],
      subscription: [
        'Velg treningssubscription',
        'Velg App Sandbox. Shared Sandbox er gyldig i modellen, men oppfyller ikke dette teamets krav.',
        'Subscription bestemmer management-grensen og hvilken treningspolicy som gjelder.',
        'Se etter Subscription under Project details.',
      ],
      'group-name': [
        'Gi gruppen et navn',
        'Skriv et eget gyldig navn for applikasjonsteamets nye Resource Group.',
        'Navnet identifiserer gruppen innen valgt subscription. rg betyr resource group; prosjekt og dev/test/prod kan gjøre hensikten lettere å lese. Dette er valgfrie konvensjoner, ikke nye Azure-navnekrav. En duplikat avvises.',
        'Bruk for eksempel et kort navn med bokstaver og bindestrek.',
      ],
      metadata: [
        'Velg metadata-region',
        'Velg Norway East for gruppens metadata, slik oppdraget krever.',
        'Metadata-lokasjonen bestemmer ikke hvor plan og app må ligge. Du undersøker ressurslokasjon separat etterpå.',
        'Dette er Region på Resource Group, ikke på hosting-planen.',
      ],
      'review-group': [
        'Kontroller før du oppretter',
        'Åpne Review + create og kontroller navn, subscription og metadata-region.',
        'Review er en forhåndskontroll. Ingen ressurs er opprettet ennå.',
        'Du kan gå tilbake til Basics og rette felt.',
      ],
      'commit-group': [
        'Send den faktiske operasjonen',
        'Les valideringen. Velg Create selv når konfigurasjonen stemmer med oppdraget.',
        'Bare en akseptert CreateGroup-kvittering endrer verden. En rød validering må rettes først.',
        'Feil subscription kan være teknisk gyldig, men feil for oppdraget.',
      ],
      'inspect-group': [
        'Undersøk gruppen',
        'Se subscription og metadata i ressursoversikten.',
        'Gruppeegenskaper beskriver management, ikke en server.',
        'Neste steg er en App Service plan.',
      ],
      'create-plan': [
        'Gå fra organisering til hosting',
        'Åpne App Service plans og velg Create. Bruk den nye gruppen.',
        'Planen representerer hosting-compute; den er en ressurs i gruppen, ikke gruppen selv.',
        'Opprett planen separat før webappen.',
      ],
      'plan-group': [
        'Plasser hosting-planen i gruppen',
        'Velg gruppen du nettopp opprettet i App Sandbox.',
        'Medlemskap bestemmer management/livssyklus. Hosting-avhengigheten kommer først når appen refererer planen.',
        'En annen gyldig gruppe fullfører ikke denne labkonfigurasjonen.',
      ],
      'plan-name': [
        'Navngi den nye planen',
        'Gi planen et gyldig, nytt navn.',
        'Treningsmodellen støtter Linux-profilen som vises; det er ikke en pris-SKU eller et runtime-løfte.',
        'Bruk et navn med bokstaver, tall og bindestrek.',
      ],
      'plan-region': [
        'Prøv en annen ressurslokasjon',
        'Velg North Europe for denne første planen, gjennomgå og send forsøket. Undersøk resultatet før du retter.',
        'Dette er en kontrollert undersøkelse av den egendefinerte Web-policyen. Gruppens metadata er en annen egenskap.',
        'Operasjonen kan bli avvist. En avvist plan må ikke brukes som eksisterende host.',
      ],
      'review-plan': [
        'Kontroller planforespørselen',
        'Åpne Review + create og kontroller den ønskede ressurslokasjonen.',
        'Input-kontroll og gjeldende policy er forskjellige steg. Treningspolicyen evalueres ved eksplisitt Create.',
        'Review oppretter ingen hosting-ressurs.',
      ],
      'commit-plan': [
        'Observer et teknisk resultat',
        'Velg Create selv og undersøk kvitteringen.',
        'Motoren evaluerer scope, navn, profil og policy deterministisk. Bare aksepterte ressurser vises som inventar.',
        'En avvist operasjon har uendret ressursantall og revisjon.',
      ],
      'inspect-denial': [
        'Undersøk hvorfor planen ble avvist',
        'Åpne den avviste operasjonen og følg lenken til policyen.',
        'Kvitteringen identifiserer måltype, scope, ønsket lokasjon og regel. Det finnes ingen utrullet plan fra dette forsøket.',
        'Sammenlign requested location med allowed locations.',
      ],
      'inspect-policy': [
        'Finn en begrunnet korreksjon',
        'Les assignment scope, target types og tillatt ressurslokasjon. Gå så til App Service plans og opprett en korrigert plan.',
        'Policyen gjelder Web-ressurser i App Sandbox. Å endre Resource Group-metadata løser ikke denne avvisningen.',
        'Velg selv en ressurslokasjon som oppfyller den viste regelen.',
      ],
      'correct-plan': [
        'Rett ressurskonfigurasjonen',
        'Velg en lokasjon som er tillatt av policyen du undersøkte.',
        'Du endrer planens ressurslokasjon. Gruppens metadata beholdes og er fortsatt gyldige.',
        'Gå tilbake til policyoversikten hvis du er usikker på regelen.',
      ],
      'create-app': [
        'Gi applikasjonen en host',
        'Åpne App Services og velg Create. Knytt den nye appen til den godkjente planen.',
        'En Web App trenger en gyldig hosting-avhengighet. At den deler gruppe med en plan er ikke tilstrekkelig.',
        'Region og OS avledes fra planen, ikke fra Resource Group.',
      ],
      'app-group': [
        'Velg appens management-gruppe',
        'Velg samme gruppe som den godkjente planen i denne avgrensede modellen.',
        'AzureLab støtter her hosting innen samme gruppe. Dette er en modellgrense, ikke alle Azure-muligheter.',
        'Velg gruppen fra denne labben.',
      ],
      'app-name': [
        'Navngi webappen',
        'Skriv et eget gyldig navn for den nye webappen.',
        'Dette registrerer konfigurasjon. AzureLab kontrollerer ikke et globalt DNS-navn eller kjører applikasjonskode.',
        'Bruk et annet navn enn planens.',
      ],
      hosting: [
        'Velg den faktiske hosting-planen',
        'Velg planen som ble akseptert etter korreksjonen.',
        'Planreferansen bestemmer appens compute, OS og ressurslokasjon. En avvist plan kan ikke velges.',
        'Se at appens viste lokasjon følger planen.',
      ],
      'review-app': [
        'Kontroller avhengigheten',
        'Åpne Review + create og kontroller gruppe og hosting-plan.',
        'Medlemskap og hosting er to forskjellige relasjoner som må stemme samtidig.',
        'Ingen app er opprettet før du sender Create.',
      ],
      'commit-app': [
        'Opprett støttet appkonfigurasjon',
        'Velg Create selv når validering og planreferanse er riktige.',
        'Et akseptert resultat bekrefter modellert konfigurasjon, ikke sikkerhet, tilgjengelighet eller runtime-helse.',
        'Manglende eller ugyldig plan gir et faktisk dependency-avslag.',
      ],
      'inspect-app': [
        'Undersøk konfigurasjonen',
        'Se appens planreferanse og avledede lokasjon.',
        'Egenskapene kommer fra samme ressursstatus som arkitekturdiagrammet.',
        'Åpne Architecture Explorer for å se relasjonene.',
      ],
      architecture: [
        'Se hva du faktisk bygget',
        'Åpne Architecture Explorer. Undersøk gruppen, planen og webappen.',
        'Diagrammet er en projeksjon av faktiske ressurser; det legger ikke til en avvist plan.',
        'Du kan bruke den semantiske relasjonslisten uten presisjonsklikking.',
      ],
      relationship: [
        'Skill hosting fra medlemskap',
        'Velg webappens Hosting-avhengighet til planen, i diagrammet eller Liste og relasjoner.',
        'App og plan er medlemmer i gruppen. Appen er i tillegg avhengig av planens compute. Regionene er egenskaper, ikke management-nivåer.',
        'Velg den grønne hosting-relasjonen eller den tilsvarende knappen i listen.',
      ],
      complete: [
        'Knytt praksisen til teorien',
        'De nødvendige tekniske resultatene og inspeksjonene er bekreftet. Gå tilbake til kurset for debrief og refleksjon.',
        'Dette er veiledet praksis i PaaS og ressursorganisering. Det er ikke uavhengig mestring.',
        'Ressursene og labkonteksten beholdes ved retur.',
      ],
      unverifiable: [
        'Tidligere teknisk historikk kan ikke bekreftes',
        'Det tekniske forsøket er startet på nytt eller nødvendig historikk mangler. Gå tilbake til kurset og start en ny lab ved behov.',
        'Lokale UI-flagg kan ikke gjøre manglende kvitteringer til vellykket teknisk arbeid.',
        'Tidligere lærings- og XP-historikk er ikke slettet.',
      ],
    },
  },
  portal: {
    brand: 'AzureLab',
    directory: 'AzureLab Directory',
    referencePublisher: 'Microsoft Learn',
    version: '3.2.1',
    simulation: 'SIMULERING',
    environment: 'Lokalt treningsmiljø · ingen Azure-tilkobling',
    menu: 'Åpne eller lukk portalmenyen',
    search: 'Search resources, services, and docs',
    searchPlaceholder: 'Search resources, services, and docs',
    searchResults: 'Search results',
    noResults: 'Ingen treff i det støttede treningsutvalget.',
    areas: {
      home: 'Home',
      services: 'All services',
      subscriptions: 'Subscriptions',
      groups: 'Resource groups',
      resources: 'All resources',
      apps: 'App Services',
      vms: 'Virtual machines',
      settings: 'Environment variables',
      plans: 'App Service plans',
      activity: 'Activity log',
      resource: 'Overview',
      create: 'Create a resource',
      learn: 'Learning workspace',
      responsibility: 'Responsibility explorer',
      hierarchy: 'Resource hierarchy',
      architecture: 'Architecture Explorer',
      policy: 'Policy',
      challenge: 'Independent challenge',
    },
    navLabel: 'Portalmeny',
    favourites: 'Tjenester',
    understand: 'Forstå sammenhengene',
    learning: 'Læring',
    serviceHint: 'Støttede tjenester i denne simulatoren',
    unavailable: 'Ikke tilgjengelig i treningsmodellen',
    unavailableServices:
      'VM, disk og NIC/VNet/subnet er begrensede treningsmodeller. Storage accounts, IAM, priser, Cloud Shell og Marketplace er ikke implementert.',
    homeTitle: 'Velkommen til AzureLab',
    homeIntro: 'Lær prinsippene. Øv i en simulert portal. Undersøk hvorfor konfigurasjonen virker.',
    services: 'Azure services',
    recent: 'Recently visited resources',
    recentHint:
      'Ressurser du har åpnet i denne økten. Inventaret gjenopprettes separat fra tekniske kommandoer.',
    noRecent: 'Ingen ressurser besøkt i denne økten.',
    training: 'Aktiv læringskontekst',
    startLearning: 'Åpne læringsarbeidsområdet',
    continueChallenge: 'Fortsett den endrede oppgaven',
    openPractice: 'Åpne veiledet praksis',
    returnLearning: 'Tilbake til læringen',
    journal: 'Kunnskapsjournal',
    notifications: 'Notifications',
    resetTechnical: 'Start nytt teknisk forsøk',
    resetWarning:
      'Dette nullstiller det delte tekniske forsøket: ressurser, operasjoner og gamle veiledede funn. Læringshistorikk og XP beholdes. Tidligere Portal-innleveringers tekniske referanser blir utilgjengelige. Et aktivt uavhengig forsøk registreres som avbrutt. Eksporter ved behov før du bekrefter.',
    exportTechnical: 'Eksporter teknisk forsøk',
    confirmReset: 'Bekreft nytt teknisk forsøk',
    notificationCount: 'Operasjoner i den lokale historikken',
    close: 'Close',
    create: 'Create',
    review: 'Review + create',
    basics: 'Basics',
    tags: 'Tags',
    next: 'Next',
    previous: 'Previous',
    edit: 'Edit configuration',
    validation: 'Validation',
    valid: 'Feltkontroll bestått. Policy vurderes ved Create.',
    invalid: 'Feltkontrollen fant en feil. Rett konfigurasjonen før Create.',
    tagsUnsupported:
      'Tags er utenfor denne modellversjonen. Ingen tag-felt tas imot eller forkastes i det skjulte. I Azure kan tags organisere ressurser, men de endrer ikke management scope eller hosting.',
    createTitles: {
      vm: 'Create a virtual machine',
      group: 'Create a resource group',
      plan: 'Create App Service Plan',
      app: 'Create Web App',
    },
    projectDetails: 'Project details',
    instanceDetails: 'Instance details',
    subscription: 'Subscription',
    group: 'Resource group',
    name: 'Name',
    groupName: 'Resource group name',
    region: 'Region',
    metadata: 'Metadata region',
    resourceLocation: 'Resource location',
    type: 'Type',
    os: 'Operating System',
    profile: 'Learning profile',
    plan: 'App Service plan',
    app: 'Web App',
    locationNote:
      'Resource group-regionen gjelder gruppens metadata. Ressursene kan ha andre lokasjoner.',
    planNote:
      'Linux learning profile v1 er en avgrenset undervisningskonfigurasjon, ikke en Azure-SKU, pris eller kapasitetsspesifikasjon.',
    appNote:
      'Webappen refererer en plan. OS og resource location avledes fra planen. Runtime, kodepublisering, DNS, nettverk og helse er ikke simulert.',
    createNote:
      'Review endrer ingen ressurser. Bare Create sender en kommando til den lokale motoren. Ingen deployering eller fakturering skjer i Azure.',
    nameNote:
      'Gruppenavn følger den delte valideringen. Plan/app bruker modellens konvensjon: liten bokstav først, deretter bokstaver, tall eller bindestrek, 3–40 tegn. Ingen global DNS-sjekk.',
    noGroup: 'Select a resource group',
    noPlan: 'Select a hosting plan',
    noResource: 'Ingen ressurser i dette utvalget.',
    noOperations: 'Ingen tekniske kommandoer er registrert ennå.',
    filter: 'Filter by name or type',
    allSubscriptions: 'All subscriptions',
    allTypes: 'All types',
    refresh: 'Refresh',
    resources: 'Resources',
    properties: 'Properties',
    overview: 'Overview',
    operations: 'Operations',
    inspect: 'Undersøk',
    inspectReceipt: 'Åpne teknisk kvittering',
    operation: 'Operation',
    outcome: 'Result',
    revision: 'World revision',
    sequence: 'Sequence',
    status: 'Status',
    added: 'Opprettet i modellen',
    rejected: 'Ikke opprettet',
    resourceState: 'Konfigurasjon registrert lokalt · kjøretid og helse er ikke vurdert',
    scope: 'Scope',
    parent: 'Parent',
    contains: 'Inneholder',
    viewResource: 'Go to resource',
    viewArchitecture: 'Vis i Architecture Explorer',
    relatedLearning: 'Les mekanismen',
    supported: 'Støttet utvalg',
    limitations: 'Modellgrenser',
    boundary:
      'AzureLab er uavhengig av Microsoft. Dette er original undervisning og lokal simulering, ikke Azure Portal, Microsoft Learn-fullføring eller en sertifisering.',
    technicalLimits:
      'To subscriptions, maksimalt åtte grupper, åtte VM-er og 96 scope/ressursobjekter i sandbox v2. Avgrenset Web-hosting, VM/disk/NIC/VNet/subnet og App settings. Ingen faktiske SKU-er, priser, tillatelser, gjestekjøring, apphelse eller nettverkstrafikk. Historisk kapittel v1 har sine opprinnelige grenser.',
    storage: 'Lagring trenger oppmerksomhet. Gyldig tidligere arbeid er ikke slettet.',
    reload: 'Les lagret tilstand på nytt',
    resetModule: 'Nullstill bare denne modulens observasjoner',
    confirmModuleReset: 'Bekreft sletting av modulobservasjoner',
    resetConfirm:
      'Dette fjerner denne modulens lokale svar og forsøk. Ressurser, andre modulers resultater og XP beholdes. Fortsette?',
    source: 'Offisielle kilder',
    reviewed: 'Kilder kontrollert 24. oktober 2026 · menneskelig Azure-fagreview gjenstår',
    modes: { learn: 'Learn', guided: 'Guided Practice', independent: 'Independent Challenge' },
    modeHints: {
      learn:
        'Full teori, eksempler og interaktive forklaringer. Lesing alene er ikke praktisk gjennomføring.',
      guided:
        'Veiledet arbeid med kontekst og årsaksforklaring. Dette er øving, ikke uavhengig mestring.',
      independent:
        'Endret krav uten fremgangsmåte. Teori, sammenligning eller hint under forsøket registreres som hjelp.',
    },
    pane: 'Veiledning',
    showPane: 'Vis veiledning',
    hidePane: 'Skjul veiledning',
    paneWidth: 'Bredde på læringspanelet',
    focusLearning: 'Les teorien i full bredde',
    guidedBrief:
      'Et fiktivt applikasjonsteam vil beholde egen HTTP-kode, men slippe gjeste-OS-drift. Bruk App Sandbox. Gruppens metadata skal være i Norway East. Undersøk Web-policyen før du velger hosting-region.',
    guidedSteps: [
      'Velg en tjenestemodell og begrunn driftsansvaret i læringsarbeidsområdet.',
      'Åpne Resource groups → Create. Velg subscription, navn og metadata-region. Kontroller Review + create før Create.',
      'Opprett en App Service plan. Et forsøk i North Europe under App Sandbox avvises av den modellerte Web-policyen. Undersøk den faktiske kvitteringen og scope før du retter regionen.',
      'Opprett en Web App som refererer den godkjente planen. Undersøk medlemskap og hosting hver for seg i Architecture Explorer.',
      'Gå tilbake til teorien og prøv den endrede oppgaven. Guided-resultater blir ikke til uavhengig kompetanse.',
    ],
    lesson: {
      title: 'Describe cloud service types',
      subtitle: 'Original AzureLab-modul · fire læringsmål · F01 med praktisk G01/C01/G03',
      objectives: [
        'Forklare IaaS og arbeidet kunden beholder.',
        'Forklare PaaS og grensene til en administrert plattform.',
        'Forklare SaaS og kundens gjenværende data- og tilgangsansvar.',
        'Velge en tjenestemodell ut fra faktiske krav og begrunne avveiningen.',
      ],
      terms: [
        [
          'Tjenestemodell',
          'Fordelingen av hvilke driftsoppgaver kunden utfører og hvilke leverandøren utfører.',
        ],
        ['Operativsystem', 'Programvare som forvalter blant annet prosesser, minne og enheter.'],
        ['Runtime', 'Miljø og biblioteker som kjører applikasjonskode.'],
        ['Virtualisering', 'Avgrensning av virtuelle maskiner eller miljøer på fysisk kapasitet.'],
        ['Hosting', 'Compute og plattform som en applikasjon bruker for å kjøre.'],
        [
          'Scope',
          'Et avgrenset management-område, for eksempel subscription eller resource group.',
        ],
      ],
      sections: {
        overview: {
          title: 'Tjenestemodeller er en fordeling av arbeid',
          intro:
            'En applikasjon trenger fysisk compute, avgrensning mellom miljøer, operativsystem, runtime, kode, konfigurasjon, identitet og data. Når vi velger en tjenestemodell, velger vi hvilket arbeid vi vil gjøre selv, og hvilke funksjoner vi vil kjøpe som en tjeneste.',
          mechanism:
            'Leverandøren kan drive flere av lagene uten at de forsvinner. IaaS gir kontroll over et gjestemiljø. PaaS tilbyr en støttet plattform for egen kode. SaaS tilbyr en ferdig applikasjon. Data, brukerrettigheter og riktig konfigurasjon krever fortsatt kundens vurderinger. Kunde, leverandør og delt eller tjenesteavhengig ansvar vises separat i utforskeren.',
          example:
            'Tenk på tre behov: en eldre agent trenger OS-kontroll; et team har egen webkode, men ønsker mindre plattformdrift; et kontor trenger ferdig e-post og samarbeid. Det er kravene og arbeidet teamet vil beholde som skiller valgene, ikke hvilken tjeneste som høres mest moderne ut.',
          misconception:
            'Public, private og hybrid cloud beskriver deployment-miljøet. IaaS, PaaS og SaaS beskriver en annen akse: tjeneste og operativt ansvar. Public cloud kan for eksempel tilby både IaaS og PaaS.',
          limits:
            'Modellene er et sammenligningsverktøy. Den nøyaktige grensen må sjekkes for tjenesten, konfigurasjonen og avtalen. Ingen modell garanterer riktig kode, sikkerhet, tilgjengelighet eller lavest pris.',
        },
        iaas: {
          title: 'IaaS · kontroll over gjesteoperativsystemet',
          intro:
            'Infrastructure as a Service passer når kunden trenger et avgrenset datamaskinmiljø og selv vil kontrollere det som installeres der. Azure Virtual Machines er eksemplet vårt. En VM er en virtuell datamaskin, ikke en ferdig fungerende applikasjon.',
          mechanism:
            'Microsoft driver den fysiske infrastrukturen, sikkerheten rundt datasenteret og virtualiseringsplattformen. Kunden konfigurerer og vedlikeholder gjeste-OS, runtime, egen applikasjon og mange nettverks- og sikkerhetsinnstillinger. Patch-planlegging, tilgang, backupvalg og applikasjonens funksjon må fortsatt håndteres. Opprettet VM er ikke bevis på nettverkstilgang eller frisk applikasjon.',
          example:
            'En eldre agent forutsetter en bestemt OS-konfigurasjon. Teamet kan ha behov for IaaS-kontroll ved en lift-and-shift-flytting, eller for å gjenskape et etablert testmiljø. Kontrollen har en kostnad i driftsarbeid: teamet må planlegge oppdateringer og vedlikehold i gjesten.',
          misconception:
            'Hvis teamets krav er å slutte å vedlikeholde gjeste-OS, løser ikke en flytting til VM dette kravet. Vertsmiljøet ble flyttet, men gjesteoperativsystemet er fortsatt kundens oppgave. IaaS er heller ikke automatisk rimeligere enn de andre alternativene.',
          limits:
            'Ansvarssammenligningen og konfigurasjonsundersøkelsen er konseptuelle. Den separate praktiske labben nedenfor oppretter lagrede VM-, disk- og nettverksreferanser i den lokale Portal-simulatoren. Ingen VM kjører, og NSG-regler eller forbindelse er ikke simulert. Administrative muligheter, operativsystemstøtte og sikkerhetskrav må vurderes i den faktiske tjenesten.',
        },
        paas: {
          title: 'PaaS · egen kode på en administrert plattform',
          intro:
            'Platform as a Service lar et team levere egen kode til en støttet plattform, med færre plattformoppgaver enn i en VM. Vårt konkrete eksempel er Azure App Service med innebygget runtime. Runtime er miljøet og bibliotekene som kjører koden.',
          mechanism:
            'I dette eksemplet driver Microsoft plattformens operativsystem og den innebygde runtime-en. Kunden vedlikeholder egen webkode og data, velger støttet konfigurasjon og styrer tilgang. Nettverks- og applikasjonsoppgaver kan være delte. En kundelevert container har en annen grense: kunden må vedlikeholde det som er inni imaget. Administrert plattform betyr ikke feilfri kode eller automatisk riktig sikkerhet.',
          example:
            'Applikasjonsteamet har egen HTTP-kode og ønsker å slippe gjeste-OS-drift. En støttet App Service-løsning passer denne arbeidsdelingen. En App Service plan representerer hosting-compute med blant annet OS og region. Webappen må referere den planen. En resource group organiserer management og livssyklus; den er ikke en server eller hosting-plan.',
          misconception:
            'Gruppemetadata i Norway East bestemmer ikke hosting-regionen. I modellen følger appens lokasjon planen, som kan ligge i West Europe. Å slette planreferansen fjerner ikke behovet for hosting. Å velge PaaS beviser heller ikke at autoskalering, backup eller overvåking er konfigurert.',
          limits:
            'Bare Linux learning profile v1 støttes her. Det er ingen faktisk SKU, pris, runtime-deployering eller SLA. Azure har flere hostingmuligheter enn modellen; samme-gruppe-kravet er en uttrykkelig simulatorgrense, ikke et generelt Azure-forbud.',
        },
        saas: {
          title: 'SaaS · bruk og konfigurer en ferdig applikasjon',
          intro:
            'Software as a Service leverer en ferdig applikasjon gjennom støttede funksjoner. Microsoft 365 er et egnet eksempel for produktivitet og samarbeid. Teamet bruker og administrerer tjenesten fremfor å vedlikeholde dens gjesteoperativsystem og runtime.',
          mechanism:
            'Leverandøren driver applikasjonsplattformen og vedlikeholder tjenestens programvare. Kunden må fortsatt ta ansvar for egne data, brukere, rettigheter, deling og konfigurasjon. Kundeinnstillinger og leverandørens applikasjonsdrift er forskjellige oppgaver; derfor har applikasjonslaget en tjenesteavhengig grense i sammenligningen.',
          example:
            'Et lite kontor trenger ferdig e-post, dokumentdeling og møter. Et SaaS-alternativ kan løse bruksbehovet uten at kontoret bygger en tilsvarende applikasjon. De må likevel administrere hvem som har tilgang til hvilke data og hvilke innstillinger organisasjonen trenger.',
          misconception:
            'At leverandøren vedlikeholder tjenesten betyr ikke at kunden kan gi vilkårlig tilgang uten risiko. Det betyr heller ikke at et eget serverprogram kan lastes opp som om SaaS var en generell hosting-plan. Utvidelsesmuligheter er ikke det samme som valgfri runtime.',
          limits:
            'Ingen Microsoft 365-administrasjon, lisens, identitet eller databeskyttelse simuleres. Sammenligningen forklarer ansvar og brukstilfelle, ikke en garanti for personvern eller sikkerhet.',
        },
        selection: {
          title: 'Velg ut fra kravene',
          intro:
            'Begynn med det teamet faktisk må levere: ferdig funksjon eller egen kode? Trenger det OS-kontroll? Hvilket arbeid kan og vil det beholde? Vurder deretter støttede plattformfunksjoner, eksisterende investeringer og operasjonell kapasitet.',
          mechanism:
            'En riktig begrunnelse knytter et konkret krav til en tjenestegrense. «Mer moderne» eller «leverandøren gjør alt» er ikke en forklaring. Sammenlign operativsystem med data og tilgang: plattformdrift kan flyttes, mens organisatoriske valg blir igjen hos kunden.',
          example:
            'For vår egen HTTP-kode uten gjeste-OS-drift er en støttet PaaS-plattform relevant. For en OS-avhengig legacy-agent kan IaaS-kontroll være avgjørende. For ferdig samarbeid er et SaaS-brukstilfelle naturlig. Det finnes ingen universell rangering som erstatter disse kravene.',
          misconception:
            'Et korrekt tjenestenavn med feil begrunnelse er ufullstendig forståelse. Cloud service types er heller ikke en trapp alle virksomheter må gå opp. Flere modeller kan eksistere samtidig og dekke forskjellige behov.',
          limits:
            'Valgene nedenfor er originale, avgrensede oppgaver. Tilbakemelding gjør dem til veiledet øving. Den senere endrede oppgaven registrerer første innsending og hjelp separat, uten å hevde generell mestring.',
        },
        practice: {
          title: 'Fra tjenestevalg til hosting og scope',
          intro:
            'Det fiktive teamet skal organisere en applikasjonsplattform i App Sandbox. Metadata for resource group skal ligge i Norway East. Teamet beholder egen webkode og vil slippe gjeste-OS-drift. Hosting-regionen må vurderes separat.',
          mechanism:
            'En custom Web-policy er tildelt App Sandbox. Den modellerer deny bare for Microsoft.Web/serverfarms og Microsoft.Web/sites utenfor West Europe. Resource groups er utelatt etter type. Et avslag endrer operasjonshistorikken, men ikke ressursinventaret. Dette er en authored treningsregel, ikke alle Azures built-in lokasjonspolicyer.',
          example:
            'Et planforsøk i North Europe gir en kvittering med scope, type, ønsket lokasjon, aktuell constraint og uendret world revision. Undersøk årsaken og rett Web-ressursens region. Opprett deretter en app som refererer den godkjente planen; undersøk medlemskap, hosting og lokasjoner i arkitekturvisningen.',
          misconception:
            'Å endre gruppens metadata er ikke en rettelse av denne Web-resource-policyen. Et avvist planforsøk gir heller ingen gyldig vert som en app kan bruke. En plan kan eksistere selv om en senere app-kommando feiler.',
          limits:
            'Modellen validerer konfigurasjon og avhengighet. Den publiserer ikke kode og måler ingen apphelse, trafikk, sikkerhet eller Azure-kostnad. Tre grupper er en treningsgrense, ikke en Azure-kvote.',
        },
      },
      headings: {
        mechanism: 'Slik virker det',
        example: 'Gjennomarbeidet eksempel',
        misconception: 'Misforståelse og moteksempel',
        limits: 'Avgrensning',
        terms: 'Begreper og sammenhenger',
      },
      guided: 'Tre krav · velg og begrunn',
      model: 'Tjenestemodell',
      reason: 'Begrunnelse',
      check: 'Kontroller valget',
      compared: 'Modeller undersøkt bevisst',
      guidedComplete:
        'Veiledede sammenligninger og kravvalg registrert. Dette er ikke uavhengig mestring.',
      guidedIncomplete:
        'Gjennomfør sammenligningen og begrunn alle tre kravvalg. Å lese eller åpne siden er ikke gjennomføring.',
      cases: {
        legacy:
          'En agent krever kontroll over et bestemt gjesteoperativsystem og installerte systemkomponenter.',
        custom: 'Et team har egen webkode, men ønsker ikke å vedlikeholde gjesteoperativsystemet.',
        ready: 'Et kontor vil ta i bruk ferdig e-post og samarbeid, ikke utvikle en egen løsning.',
      },
      reasons: {
        'os-control': 'Arbeidslasten krever kontroll over gjeste-OS.',
        'managed-platform': 'Teamet leverer egen kode på en støttet, administrert plattform.',
        'ready-service': 'Behovet er en ferdig applikasjon med støttede funksjoner.',
      },
      feedback: {
        legacy:
          'Se etter kontroll over gjeste-OS. En ferdig tjeneste eller begrenset runtime gir ikke automatisk den kontrollen agenten krever.',
        custom:
          'En VM beholder gjeste-OS-arbeidet. Ferdig samarbeid er ikke hosting for vilkårlig egen kode. Knytt valget til en støttet administrert plattform.',
        ready:
          'Behovet er ferdig funksjon, ikke en plattform dere skal bygge tilsvarende programvare på. Kunden må likevel styre data og tilgang.',
      },
      correct: 'Valget og begrunnelsen passer kravet.',
      incorrect: 'Undersøk kravet og begrunnelsen på nytt.',
    },
    responsibility: {
      title: 'Hvem gjør arbeidet?',
      intro:
        'Sammenlign tjenestene og velg et lag. Fordelingen endres; de tekniske lagene forsvinner ikke.',
      virtualization: 'Virtualisering og isolasjon',
      examples: {
        iaas: 'Azure Virtual Machines',
        paas: 'Azure App Service · innebygget runtime',
        saas: 'Microsoft 365',
      },
      layer: 'Lag',
      owner: 'Operativt ansvar',
      customer: 'Kunden',
      microsoft: 'Leverandøren',
      shared: 'Delt / tjenesteavhengig',
      details: 'Hvorfor denne grensen?',
      virtualizationNote:
        'Microsoft driver virtualiseringsplattformen i disse tre eksemplene. I IaaS kontrollerer kunden gjeste-OS; det er et annet lag.',
      networkLabel: 'Tjenestens nettverkslag',
      notes: {
        physical:
          'Fysisk maskinvare, datasenter og drift av underlaget ligger hos leverandøren i disse skytjenestene.',
        os: 'Følg gjeste-OS: kundens arbeid i VM-eksemplet, plattformarbeid hos leverandøren i innebygget App Service-runtime og SaaS.',
        runtime:
          'Runtime kjører koden. VM-kunden vedlikeholder den selv; en innebygget PaaS-runtime drives av plattformen. Kundeleverte containere har andre vedlikeholdsgrenser.',
        application:
          'Skill egen kode, støttet konfigurasjon og leverandørens kjøretjeneste. PaaS-kunden vedlikeholder sin kode; SaaS-leverandøren vedlikeholder den ferdige tjenesten.',
        network:
          'Leverandøren driver fysisk nettverk. Kundens logiske nettverksvalg og sikkerhetsinnstillinger avhenger av tjenesten; PaaS er ikke automatisk privat eller riktig avgrenset. SaaS-fordelingen her viser tjenestens nettverkslag. Kundens enheter, lokale nettverk og tilgangsbeslutninger er fortsatt kundens ansvar og er ikke overført til leverandøren.',
        settings:
          'Kunden velger riktig støttet konfigurasjon. En administrert tjeneste kjenner ikke automatisk organisasjonens behov.',
        identity:
          'Kunden må styre brukere, roller og tilgang. Plattformdrift alene avgjør ikke hvem som bør få tilgang.',
        data: 'Kunden må forstå dataenes bruk, rettigheter og beskyttelsesbehov. Leverandørdrift overfører ikke alle organisatoriske datavurderinger.',
      },
    },
    referenceTitles: {
      S01: 'Shared responsibility · fordeling av ansvar',
      S12: 'App Service plans · hosting, OS og lokasjon',
      S39: 'App Service · oppdatering av OS og runtime',
      P03: 'Resource groups · opprett og administrer',
      P04: 'App Service plan · opprett og administrer',
      P08: 'Describe infrastructure as a service',
      P09: 'Describe platform as a service',
      P10: 'Describe software as a service',
    },
    graph: {
      title: 'Arkitekturen følger det faktiske inventaret',
      diagram: 'Interaktiv arkitektur',
      list: 'Liste og relasjoner',
      legend: 'Relasjonstyper',
      node: 'Komponent',
      relation: 'Relasjon',
      location: 'Lokasjon er en egenskap, aldri et management-nivå.',
      inspectRelation: 'Undersøk relasjonen',
      select: 'Velg en komponent eller relasjon.',
      types: {
        tenant: 'Microsoft Entra tenant',
        root: 'Tenant root group',
        management: 'Management group',
        subscription: 'Subscription',
        group: 'Resource group',
        plan: 'App Service plan',
        app: 'Web App',
        vm: 'Virtual machine',
        disk: 'Managed disk',
        nic: 'Network interface',
        vnet: 'Virtual network',
        subnet: 'Subnet',
        policy: 'Policy assignment',
      },
      relations: {
        'disk-attachment': 'Disktilknytning',
        'nic-attachment': 'NIC-tilknytning',
        'subnet-member': 'NIC i subnet',
        'vnet-parent': 'Subnet i VNet',
        'identity-authority': 'Identitetstilknytning',
        'management-parent': 'Management parent',
        'resource-member': 'Ressursmedlemskap',
        'depends-on': 'Hosting-avhengighet',
        'policy-scope': 'Policy gjelder ved scope',
      },
      explanations: {
        'disk-attachment':
          'VM refererer en OS- eller datadisk. Dette er varig lagring, ikke RAM, backup eller bevis på at gjesten kjører.',
        'nic-attachment':
          'VM refererer et nettverkskort. Dette alene beviser ikke tilkobling eller sikker trafikk.',
        'subnet-member':
          'NIC er knyttet til et subnet. IP-tildeling, NSG, ruter og trafikk er utenfor modellen.',
        'vnet-parent':
          'Subnet er et barn av VNet. Dette er en nettverksstruktur, ikke et geografisk management-nivå.',
        'identity-authority':
          'Entra tenant er identitetsautoriteten knyttet til directory/scope. Dette er ikke en fysisk eller geografisk ressursbeholder.',
        'management-parent':
          'Management-scope organiserer administrasjon. Gruppen tilhører subscription; geografi ligger i egne egenskaper.',
        'resource-member':
          'Ressursen er medlem av en resource group for management/livssyklus. Gruppen tilbyr ikke compute.',
        'depends-on':
          'Webappen refererer denne App Service-planen og bruker modellens hosting-compute, OS og lokasjon. Medlemskap alene erstatter ikke denne referansen.',
        'policy-scope':
          'Den custom tildelingen gjelder Web-plan/app-lokasjon under dette subscription-scope. Resource group-metadata er utelatt etter ressurstype.',
      },
    },
    challenge: {
      title: 'Et nytt team · samme tekniske modell',
      abandon: 'Avslutt forsøket uten innlevering',
      abandoned: 'Avbrutt forsøk · ingen teknisk vurdering eller mestring registrert.',
      brief:
        'Et nytt team trenger en ny, egen HTTP-applikasjon uten gjeste-OS-vedlikehold. Bruk Shared Sandbox. Gruppemetadata skal være i Norway East, men hosting skal være i North Europe. Bygg ny gruppe, plan og app i dette forsøket; velg egne navn. To andre krav gjelder OS-avhengig programvare og ferdig samarbeid. Du får kravene, ikke konfigurasjonstrinnene.',
      start: 'Start endret oppgave',
      submit: 'Lever vurderingsgrunnlaget',
      retry: 'Start et øvingsforsøk',
      active: 'Oppgaven pågår. Ressursarbeidet og svarutkastet lagres.',
      assisted: 'Hjelp er registrert i dette forsøket.',
      unassisted:
        'Ingen registrert hjelp i dette forsøket. Dette attesterer ikke identitet eller hva du brukte utenfor AzureLab.',
      os: 'Hvilken modell passer OS-avhengig programvare?',
      web: 'Hvilken modell passer teamets egen HTTP-kode?',
      ready: 'Hvilken modell passer ferdig samarbeid?',
      reason: 'Hva begrunner valget for HTTP-koden?',
      cause: 'Hva avgjør appens resource location?',
      causes: {
        plan: 'Den refererte hosting-planens lokasjon.',
        metadata: 'Alltid resource groupens metadata-region.',
        'policy-everywhere': 'Én global policy bestemmer lokasjonen i alle subscriptions.',
      },
      references: 'Velg de faktiske ressursene du bygget',
      first: 'Første innsending',
      retryResult: 'Senere innsending · øving',
      noSubmission: 'Ingen innsending. Skjermbesøk og konfigurasjon alene er ikke en vurdering.',
      passed: 'Alle kriteriene for denne avgrensede oppgaven er oppfylt.',
      failed: 'Noen kriterier er ikke oppfylt.',
      unverifiable:
        'Den refererte tekniske historikken er ikke tilgjengelig. Teknisk resultat kan ikke bekreftes.',
      criteria: {
        service: 'Egen kode uten gjeste-OS-drift: PaaS med plattformbegrunnelse.',
        os: 'OS-kontroll: IaaS passer det endrede kravet.',
        ready: 'Ferdig samarbeid: SaaS passer bruksbehovet.',
        scope: 'Ny gruppe i Shared Sandbox med metadata i Norway East.',
        hosting: 'Ny plan/app i samme gruppe, North Europe og faktisk hosting-referanse.',
        cause: 'Appens lokasjon følger hosting-planen, ikke gruppemetadata.',
      },
      notMastery:
        'Dette er lokale kriterieobservasjoner for en endret oppgave. Første svar, hjelp og retries beholdes. Ingen XP, Chapter 01-fullføring, generell mestring eller eksamensklarhet tildeles.',
      history: 'Innsendingshistorikk',
      required: 'Velg et svar',
    },
  },
  official: {
    certification: 'Microsoft Certified: Azure Fundamentals',
    exam: 'AZ-900: Microsoft Azure Fundamentals',
    path: 'Introduction to Cloud Infrastructure: Describe cloud concepts',
    computing: 'Describe cloud computing',
    benefits: 'Describe the benefits of using cloud services',
    services: 'Describe cloud service types',
    label: 'Offisiell læringssti · AzureLabs originale undervisning',
    certificationLabel: 'Sertifisering',
    pathLabel: 'Learning path',
    moduleLabel: 'Module',
    unitLabel: 'AzureLab-undersøkelse',
    learningUnitLabel: 'Learning unit',
    activityLabel: 'AzureLab-aktivitet · anvendelse',
    officialUnits: [
      'Introduction to Microsoft Azure Fundamentals',
      'Introduction to cloud computing',
      'What is cloud computing',
      'Describe the shared responsibility model',
      'Define cloud models',
      'Describe the consumption-based model',
      'Module assessment',
      'Summary',
    ],
    mapping: 'Offisielle enheter · flere AzureLab-undersøkelser kan belyse samme enhet',
    serviceUnits: [
      'Introduction',
      'Describe Infrastructure as a Service',
      'Describe Platform as a Service',
      'Describe Software as a Service',
      'Module assessment',
      'Summary',
    ],
    references:
      'Offisielle kildelenker · dette er ikke læringsaktiviteter eller lokal modulfullføring.',
    implemented:
      'Tilgjengelig original undervisning · seks undersøkelser og separat endret oppgave',
    servicesImplemented:
      'Operativ Service Types-undervisning · fire mål, konfigurasjonsøving, Portal-lab og separat endret oppgave',
    benefitsImplemented: 'Fem Benefits-undersøkelser og separat endret oppgave i kurset',
    planned: 'Planlagt · ikke tilgjengelig',
    partial: 'Delvis undervisning · ikke en komplett modul',
    boundary:
      'Resultatene er lokale AzureLab-observasjoner, ikke Microsoft Learn-fullføring, Microsoft XP eller en sertifisering. AzureLab er uavhengig og ikke godkjent av Microsoft.',
    reviewed: 'Offisielle navn og modulstruktur kontrollert 25. oktober 2026',
  },
  foundations: {
    title: 'Fra maskinrom til skytjenester',
    module: 'Describe cloud computing',
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
      CreateVmBundle: 'Opprett VM og avhengigheter',
      DeleteVmBundle: 'Fjern VM og eksklusive avhengigheter',
      SetAppSettings: 'Oppdater App settings',
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
      updated:
        'Innstillingene er lagret i den lokale modellen. Ingen kode eller omstart ble kjørt.',
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
    { href: '/learn', label: 'Kurs', icon: 'dashboard' },
    { href: '/portal', label: 'Portal', icon: 'explore' },
    { href: '/progress', label: 'Fremgang', icon: 'progress' },
  ],
  shell: {
    close: 'Lukk',

    workspace: 'DITT LÆRINGSROM',
    path: 'Azure-læring',
    pathTag: 'Læringssti · første steg',
    local: 'Lokal prototype',
    simulation: 'Simulert miljø',
    safe: 'Ingen Azure-tilkobling',
    guest: 'Lokal utforsker',
    account: 'Fremgang på denne enheten',
    skip: 'Hopp til innhold',
    footer: 'Et uavhengig læringsprosjekt. Ikke tilknyttet Microsoft.',
    phase: 'Kurs og Portal',
    release: 'Lokal læring',
    storageError:
      'Nettleseren tillater ikke lokal lagring. Fremgangen beholdes bare mens denne siden er åpen.',
    loading: 'Laster lokal fremgang …',
    xp: 'XP',
    level: 'Nivå 1 · Utforsker',
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
  progress: {
    continue: 'Tilbake til kurset',
    historical: 'Historisk aktivitet',
    planned: 'Planlagt',

    eyebrow: 'DIN LÆRINGSREISE',
    title: 'Historisk aktivitet og lokale data',
    intro:
      'Her beholdes XP fra den tidligere ressursgruppeøvelsen. Dagens kurs viser egne læringsobservasjoner og vurderinger i modulene.',
    xp: 'Erfaringspoeng',
    xpText:
      'Historisk deltakelse: inntil 80 + 40 XP. Dette er ikke en måling av mestring i dagens kurs.',
    mastery: 'Demonstrert mestring',
    masteryValue: 'Ikke vurdert',
    masteryText: 'Krever flere selvstendige oppgaver, variasjon og øvelse over tid.',
    readiness: 'Eksamensberedskap',
    readinessValue: 'Ikke beregnet',
    readinessText: 'Krever bred emnedekning, retensjon og uavhengige vurderinger.',
    history: 'Dine milepæler',
    empty: 'Reisen starter med én handling.',
    emptyText: 'Ingen historiske XP-aktiviteter er registrert. Du kan fortsette i dagens kurs.',
    mission: 'Resource group opprettet riktig',
    assessment: 'Kunnskapssjekk: 3 av 3 riktige',
    certification: 'Et fundament for videre læring',
    certText:
      'Dagens kurs dekker avgrensede Azure Fundamentals-emner. Historiske XP dokumenterer ikke dagens modulfullføring eller eksamensberedskap.',
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
export const labsNb = {
  boolean: { yes: 'Ja', no: 'Nei' },
  cancelled: 'Avbrutt forsøk · ingen fullføring eller vurdert mestring.',
  attempts: 'Forsøk og leveringer · historikk',
  debrief: 'Dette ble faktisk konfigurert og undersøkt',
  debriefLabels: {
    osDiskGiB: 'OS-disk',
    dataDiskGiB: 'Ekstra datadisk',
    resource: 'Ressurs',
    image: 'Image',
    profile: 'Treningsprofil',
    resourceLocation: 'Ressursregion',
    group: 'Resource group',
    metadataLocation: 'Gruppens metadataregion',
    plan: 'Hosting-plan',
    environment: 'APP_ENVIRONMENT',
    catalogMode: 'CATALOG_MODE',
    account: 'Konto',
    role: 'Rolle',
    licensed: 'Lisens tildelt',
    blocked: 'Innlogging blokkert',
    sharing: 'Deling',
  },
  models: { iaas: 'IaaS', paas: 'PaaS', saas: 'SaaS' },
  receipt: 'Undersøk operasjonskvitteringen',
  fields: {
    kind: 'Ressurstype',
    image: 'Image',
    profile: 'Size · training profile',
    osDiskId: 'OS disk',
    dataDiskId: 'Data disk',
    nicId: 'Network interface',
    role: 'Diskrolle',
    gib: 'Allokert lagring (GiB)',
    subnetId: 'Subnet',
    vnetId: 'Virtual network',
    addressSpace: 'Address space',
    addressPrefix: 'Address prefix',
  },
  domainMessages: {
    networkRegion:
      'VM og det refererte nettverket må ha samme ressursregion. Gruppens metadataregion løser ikke denne relasjonen.',
    networkScope:
      'Den refererte VM-/nettverksressursen mangler eller kan ikke brukes innenfor modellens subscription-grense. Dette er ingen test av Azure-tillatelser.',
    networkGroup:
      'Gjenbruk av nettverk i en annen resource group er utenfor denne modellen, selv om en slik Azure-konfigurasjon kan være gyldig. Ingen delressurs ble opprettet.',
    capacity:
      'Sandbox v2 støtter åtte grupper, åtte VM-er og maksimalt 96 scope/ressursobjekter. Et VM-sett må få plass samlet. Dette er treningsgrenser, ikke Azure-kvoter.',
    vmDeleted:
      'VM og eksklusive avhengigheter er fjernet. Delte nettverksressurser kan være beholdt.',
    vmName:
      'VM-navnet må følge treningsutvalget på 3–15 små bokstaver, tall og bindestrek, med bokstav først og bokstav/tall sist. Dette er ikke hele Azures navneregel.',
    vmProfile:
      'Image, størrelse eller diskvalg er utenfor det støttede treningsutvalget. Ingen del av VM-settet ble opprettet.',
    settings:
      'Innstillingen er utenfor de to ufarlige nøklene og verdiene som denne appmodellen støtter. Dette er ikke en generell App Service-begrensning.',
  },
  discover: 'Nye praktiske labber · servicetyper',
  discoverNote:
    'Lagrede VM-ressurser, App settings og separat SaaS-administrasjon. Åpne en undervisningsenhet og se formålet før du begynner.',
  feedback: {
    vm: 'VM-konfigurasjonen gir en virtuell gjest. Microsofts drift av verten erstatter ikke kundens patching og programvaredrift. NIC/subnet er referanser; ruter, filtrering og tilkobling er ikke testet.',
    paas: 'App settings er verdier som kundens kode må lese. Plattformen drifter OS, men skriver, tester eller sikrer ikke kundens kode og data gjennom denne konfigurasjonen.',
    saas: 'Lisens og administratorrolle er forskjellige tilganger. Blokkering regulerer fremtidig innlogging i modellen, men beviser ikke at tidligere økter eller delte kopier er fjernet.',
  },
  title: 'Praktisk laboratorium',
  guided: 'Veiledet praksis',
  independent: 'Selvstendig oppgave',
  free: 'Fri øving',
  launch: 'Start praktisk lab',
  restartUnavailable: 'Avslutt utilgjengelig kontekst og start nytt labforsøk',
  resume: 'Fortsett labben',
  challenge: 'Start endret, selvstendig oppgave',
  return: 'Tilbake til undervisningen',
  inspect: 'Undersøk konfigurasjonen',
  architecture: 'Undersøk faktisk arkitektur',
  history: 'Operasjonshistorikk',
  submit: 'Lever begrunnelse og konfigurasjon',
  abandon: 'Avslutt forsøket uten levering',
  hint: 'Vis veiledning (registreres som hjelp)',
  complete:
    'Veiledet praksis er bekreftet mot de lagrede operasjonene. Dette er ikke uavhengig mestring.',
  pending: 'Ikke alle tekniske krav og undersøkelser er bekreftet ennå.',
  independentResult: 'Lokalt oppgaveresultat — ikke sertifiseringsberedskap',
  aided: 'Med registrert hjelp',
  unaided: 'Uten registrert hjelp i dette forsøket',
  first: 'Første levering beholdes. Et nytt forsøk registreres separat.',
  unverifiable:
    'Referansene kan ikke etterprøves i dette tekniske forsøket. Tidligere besvarelse beholdes, men ny fullføring godskrives ikke.',
  storage:
    'Lokal lagring trenger oppmerksomhet. Ved unsaved er arbeidet bare i minnet; ved konflikt eller ukjent format må du laste inn gjeldende data før endringer.',
  reason: 'Forklar driftsgrensen',
  wrong:
    'Konfigurasjon og begrunnelse må vurderes separat. Undersøk de gjenstående kravene før et nytt forsøk.',
  reasons: {
    vm: [
      [
        'customer-os',
        'Kunden må vedlikeholde gjeste-OS og programvare; et NIC beviser ikke nettverksforbindelse.',
      ],
      ['cloud-handles-all', 'En registrert VM gjør at Microsoft overtar all programvaredrift.'],
    ],
    paas: [
      [
        'customer-code',
        'Plattformen drifter OS, men kunden må levere kode som leser innstillingene og beskytte data og tilgang.',
      ],
      ['provider-code', 'App settings gjør at plattformen skriver og tester kundens kode.'],
    ],
    saas: [
      [
        'retained-access',
        'Kunden styrer brukere, rettigheter og deling; blokkering henter ikke tilbake kopier som allerede er delt.',
      ],
      ['license-is-admin', 'En lisens gir automatisk administratortilgang og sikrer alle data.'],
    ],
  },
  lab: {
    vm: {
      title: 'IaaS · En VM med virkelige lokale avhengigheter',
      purpose:
        'Fra komponentvalg til en lagret konfigurasjon. Opprett en VM med OS-disk, NIC, VNet og subnet. Undersøk hvorfor RAM, varig lagring og nettverk har forskjellige roller.',
      task: 'Opprett en støttet VM i en valgt gruppe. Undersøk deretter OS-disken, nettverksreferansen og arkitekturen. Ingen maskin startes og ingen tilkobling testes.',
      changed:
        'Et eldre program krever Windows og åtte GiB RAM. Opprett en NY Windows-VM med standardprofil og 64 GiB datadisk i Shared Sandbox etter oppgavestart. Undersøk den og begrunn hvem som patcher gjesten. Konfigurasjonen beviser ikke tilgjengelighet.',
    },
    paas: {
      title: 'PaaS · Fra hosting til applikasjonsinnstillinger',
      purpose:
        'Bruk den eksisterende Web-labben til å etablere gruppe, hosting-plan og app. Deretter lagrer du en faktisk konfigurasjonsendring som kundens kode må kunne bruke.',
      task: 'Opprett eller bruk en støttet Web App. Åpne Environment variables og lagre APP_ENVIRONMENT=staging og CATALOG_MODE=read-only. Undersøk appen og hosting-relasjonen. Ingen kode, omstart eller helse måles.',
      changed:
        'Opprett en NY plan og Web App etter oppgavestart. Lagre production og read-only i appens innstillinger. Undersøk appen og forklar hva kunden fortsatt må gjøre. Bruk Portal-kontrollene uten løsningsmarkeringer.',
    },
    saas: {
      title: 'SaaS · Administrer et fiktivt samarbeidssystem',
      purpose:
        'Ferdig programvare fjerner ikke arbeidet med brukere, lisenser, minste privilegium og datadeling. Denne separate produktlabben er ikke Azure ARM eller en Microsoft 365-kopi.',
      task: 'Undersøk lisensgrensen ved å forsøke å tildele Erin en lisens mens begge plassene er brukt. Frigjør Minas plass og tildel Erin. Mina slutter: blokker innlogging, fjern administratorrollen, begrens deling til team og registrer datagjennomgang. Undersøk historikken.',
      changed:
        'Leo slutter. Gjennomfør blokkering, fjern lisensen, sett rollen til member, bekreft teamdeling og registrer datagjennomgang med NYE handlinger etter oppgavestart. Forklar hvorfor tidligere delte kopier ikke dermed er hentet tilbake.',
    },
  },
  vm: {
    title: 'Create a virtual machine',
    tabs: ['Basics', 'Disks', 'Networking', 'Review + create'],
    note: 'Lokal undervisningskonfigurasjon. Ingen Azure-maskin opprettes. Image- og kapasitetsprofilene er et begrenset treningsutvalg, ikke en Marketplace- eller SKU-katalog.',
    image: 'Image',
    profile: 'Size · training profile',
    profiles: { small: 'Small · 2 vCPU / 4 GiB RAM', standard: 'Standard · 4 vCPU / 8 GiB RAM' },
    images: {
      'ubuntu-22-04': 'Ubuntu Server 22.04 · Linux',
      'windows-2022': 'Windows Server 2022',
    },
    units:
      'vCPU beskriver virtuell prosessorkapasitet. GiB er en minne-/lagringsenhet. RAM brukes av kjørende arbeid; disk beholder data uavhengig av RAM.',
    name: 'Virtual machine name',
    naming:
      'Treningsutvalg: 3–15 små bokstaver, tall og bindestrek; bokstav først og bokstav/tall sist. Azure har egne regler for ressursnavn og OS-hostname. Dette er et snevrere undervisningsutvalg.',
    osDisk: 'OS disk',
    osNote:
      'Linux får 64 GiB og Windows 128 GiB i denne modellen. OS-disken inneholder oppstartssystemet. Dette er våre tildelinger, ikke Azure-minimum for alle images.',
    dataDisk: 'Data disks',
    noData: 'No additional data disk',
    dataNote:
      'En ekstra managed disk er separat fra OS-disk og RAM. Backup, krypteringsvalg og midlertidig disk er ikke modellert.',
    network: 'Virtual network / subnet',
    newNetwork: 'Create new training network',
    networkNote:
      'Nytt VNet: 10.42.0.0/16; subnet: 10.42.1.0/24. En NIC knytter VM til subnet. Gjenbruk støttes her bare i samme gruppe og region. Ingen Public IP, NSG, IP-tildeling, SSH/RDP eller trafikk testes.',
    review:
      'Hele ressurssettet valideres før én atomisk opprettelse. Avslag oppretter ingen delressurser. Gruppens metadataregion tvinger ikke VM-ens ressursregion.',
    reviewValid:
      'Validering bestått. Ingen ressurser er opprettet ennå. Velg Create for å lagre hele ressurssettet i den lokale simulatoren.',
    dependencies: 'Tilknyttede ressurser',
    cleanup: 'Fjern VM og eksklusive treningsavhengigheter',
    cleanupNote:
      'Eksplisitt lokal opprydding. Delte subnet/VNet beholdes. Dette er ikke en gjengivelse av alle Azure-slettevalg.',
    noGroup:
      'Opprett først en resource group i ønsket subscription. Gå deretter tilbake til Virtual machines.',
    accepted:
      'Konfigurasjonen er lagret. VM, disk og nettverksobjekter finnes i samme inventar. Ingen gjest eller applikasjon kjører.',
  },
  settings: {
    title: 'Environment variables',
    subtitle: 'App settings',
    environment: 'APP_ENVIRONMENT',
    catalog: 'CATALOG_MODE',
    apply: 'Apply',
    note: 'Dette er ufarlige innstillinger for vår fiktive app. De er ikke innebygde Azure-brytere. Appens kode må lese dem. Ingen hemmeligheter skal legges inn.',
    mechanism:
      'I virkelig App Service injiseres App settings som miljøvariabler, og en endring kan starte appen på nytt. Her lagres bare konfigurasjonen; ingen kode eller omstart kjøres.',
    saved: 'Lagrede innstillinger',
    none: 'Ingen App settings er lagret for denne appen.',
  },
  criteria: {
    vm: 'VM i riktig treningsprofil og scope',
    os: 'Gyldig OS-disk',
    nic: 'NIC og subnet-referanse',
    settings: 'Riktig, faktisk innstillingsendring',
    hosting: 'Gyldig hosting-plan',
    newPlan: 'Ny hosting-plan etter oppgavestart',
    newApp: 'Ny app etter oppgavestart',
    blocked: 'Avsluttet innlogging',
    role: 'Begrenset rolle',
    license: 'Frigjort lisens',
    sharing: 'Teamdeling',
    dataReview: 'Eksplisitt datagjennomgang',
    seatRejection: 'Undersøkt lisensgrense',
    newLicense: 'Erin har lisens',
  },
  yes: 'Bekreftet',
  no: 'Gjenstår',
  search: 'Finn tjenesten med det virkelige søkefeltet. Du kan også bruke tjenestemenyen.',
  guide: {
    group:
      'Velg Resource groups og opprett en gruppe i ønsket subscription. Metadataregionen er ikke VM-lokasjonen.',
    createVm:
      'Finn Virtual machines. Åpne Create og konfigurer gjesten, diskene og nettverksreferansen før du oppretter.',
    inspectVm:
      'Åpne den opprettede VM-en. Følg OS-disk og NIC/subnet, og sammenlign medlemskap med tekniske avhengigheter.',
    web: 'Den eksisterende Web-labben etablerer en støttet plan og app. Du kan undersøke policyavslaget, rette ressursregionen og bruke den faktiske hosting-referansen.',
    settings:
      'Åpne appen, velg Environment variables, og lagre staging / read-only med Apply. Verdiene endrer konfigurasjonen, ikke programkode.',
    explain:
      'Undersøk ressursen og gi din begrunnelse. En godkjent operasjon viser konfigurasjon, ikke fungerende eller sikker drift.',
  },
  bridge: {
    open: 'Åpne relevant praktisk visning',
    mode: 'Faglig undersøkelse · ingen automatisk læringsuttelling',
    title: 'Se dette i den praktiske modellen',
    note: 'Den forklarende modellen over beholdes. Denne overgangen viser lagret konfigurasjon og relasjoner, ikke målt drift, failover, SLA, sikkerhetsnivå eller utslipp.',
    availability: 'Undersøk VM-profil og avhengigheter — ikke en HA-test',
    reliability: 'Følg faktiske hosting- og ressursavhengigheter',
    governance: 'Undersøk Web-policy, avslag og korreksjon',
    management: 'Endre App settings og undersøk operasjonskvitteringen',
    sustainability: 'Undersøk valgt kapasitet — ingen karbonberegning',
  },
  saas: {
    title: 'Samarbeidsrom · fiktiv SaaS-administrasjon',
    requested: 'Forespurt verdi',
    replay:
      'Erin har allerede lisens i det lagrede oppsettet. Dette nye forsøket trenger en ny observasjon av lisensgrensen. Velg «Start nytt SaaS-forsøk» for å undersøke startoppsettet igjen. Tidligere leveringer beholdes.',
    guidance: {
      capacity:
        'Erin mangler lisens. Velg Erin og forsøk å tildele en mens begge plassene er brukt. Kvitteringen forklarer grensen uten å endre roller eller kontoen.',
      release:
        'Mina skal slutte. Velg Mina og frigjør lisensen. En lisensplass blir tilgjengelig; administratorrollen og innloggingen endres ikke automatisk.',
      assign:
        'Velg Erin og tildel den ledige lisensen. Kontroller at rollen fortsatt er Member: produktbruk og administrasjon er ulike rettigheter.',
      block:
        'Gå tilbake til Mina og blokker innlogging. Dette setter modellens kontogrense; det beviser ikke at tidligere økter eller kopier er borte.',
      role: 'Mina har fortsatt administrasjonsrettigheter. Velg Member og lagre rollen. Kontroller at lisensvalget ikke utførte denne endringen for deg.',
      sharing:
        'Begrens delingen til teamet og lagre. Dette endrer modellens delingsvalg, ikke kopier som noen allerede har tatt ut.',
      data: 'Vurder dataeierskap og oppbevaring ved fratreden. Registrer gjennomgangen; ingen virkelige filer flyttes eller slettes her.',
      inspect:
        'Åpne Operasjonshistorikk og undersøk de faktiske avslagene og endringene. Bekreft undersøkelsen før du begrunner driftsansvaret.',
      reflect:
        'Du har konfigurert og undersøkt endringene. Forklar hvilke kundens oppgaver som fortsatt består, og lever begrunnelsen.',
    },
    note: 'Eget lokalt produkt med to lisensplasser. Ikke Azure Portal, Microsoft 365, fakturering eller virkelig tilgangsstyring.',
    users: 'Brukere',
    license: 'Lisens',
    role: 'Rolle',
    blocked: 'Innlogging blokkert',
    sharing: 'Deling',
    data: 'Datagjennomgang ved fratreden',
    names: { mina: 'Mina', leo: 'Leo', erin: 'Erin' },
    roles: {
      member: 'Member · eget innhold',
      'support-admin': 'Support admin · hjelpe med kontoer',
      'service-admin': 'Service admin · endre produktets administrasjon',
    },
    licensed: 'Tildelt',
    unlicensed: 'Ikke tildelt',
    assign: 'Tildel lisens',
    release: 'Frigjør lisens',
    block: 'Blokker innlogging',
    unblock: 'Tillat innlogging',
    team: 'Bare team',
    link: 'Alle med lenken',
    saveRole: 'Lagre rolle',
    saveSharing: 'Lagre deling',
    review: 'Registrer datagjennomgang',
    capacity: 'Lisensplasser brukt',
    retained:
      'Lisens er ikke administratorrettighet. Blokkering fjerner ikke automatisk lisenser eller data. Undersøk eierskap, oppbevaring og tidligere delte kopier i en virkelig tjeneste; denne modellen kan ikke bevise at alle økter er avsluttet.',
    reasons: {
      updated: 'Endringen er registrert i den fiktive produktmodellen.',
      invalid: 'Ugyldig bruker, verdi eller forespørselsformat. Ingen endring.',
      'seats-full':
        'Begge lisensplassene er brukt. Frigjør en plass før du tildeler en ny. Roller endres ikke av lisensen.',
      stale: 'Gammel revisjon. Last inn gjeldende tilstand før ny handling.',
      conflict: 'Kommando-ID har allerede annet innhold.',
      unsupported: 'Operasjonen er utenfor produktmodellen.',
      limit: 'Historikkgrensen er nådd. Eksporter eller start et nytt lokalt forsøk.',
    },
    reset: 'Start nytt SaaS-forsøk',
    resetConfirm:
      'Dette starter et nytt lokalt SaaS-forsøk. Forrige forsøk arkiveres; læringshistorikk og XP beholdes. Et pågående labforsøk markeres avbrutt og en ny kontekst starter mot den nye tilstanden.',
    confirmReset: 'Bekreft nytt forsøk',
    export: 'Eksporter lokal historikk',
  },
} as const;
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

export function operationExplanation(receipt: {
  ruleId: string;
  code: keyof typeof nb.chapter.errors;
}) {
  if (receipt.ruleId === 'vm-dependency@2' && receipt.code === 'invalid-region')
    return labsNb.domainMessages.networkRegion;
  if (receipt.ruleId === 'vm-dependency@2' && receipt.code === 'invalid-parent')
    return labsNb.domainMessages.networkScope;
  if (receipt.ruleId === 'vm-dependency@2' && receipt.code === 'unsupported-capability')
    return labsNb.domainMessages.networkGroup;
  if (receipt.ruleId === 'vm-dependency@2' && receipt.code === 'deleted')
    return labsNb.domainMessages.vmDeleted;
  if (receipt.ruleId === 'capacity@2') return labsNb.domainMessages.capacity;
  if (receipt.ruleId === 'vm-profile@2' && receipt.code === 'invalid-name')
    return labsNb.domainMessages.vmName;
  if (receipt.ruleId === 'vm-profile@2' && receipt.code === 'unsupported-profile')
    return labsNb.domainMessages.vmProfile;
  if (receipt.ruleId === 'app-settings@2' && receipt.code === 'unsupported-profile')
    return labsNb.domainMessages.settings;
  return nb.chapter.errors[receipt.code];
}
export const learningPolishNb = {
  briefing: {
    eyebrow: 'SAVVYSHARK · OPPDRAGSBRIEF',
    title: 'Fra teori til teknisk undersøkelse',
    purpose: 'Hvorfor vi gjør dette',
    outcomes: 'Dette skal du forstå',
    route: 'Slik henger oppdraget sammen',
    observe: 'Se etter dette i portalen',
    start: 'Start oppdraget',
    cancel: 'Tilbake til leksjonen',
    recall: 'Se oppdraget',
    continue: 'Fortsett undersøkelsen',
    close: 'Lukk oppdragsbrief',
    boundary:
      'Lokal undervisningsmodell. Ingen handling når Azure. Veiledet arbeid er øvelse, ikke bevis på selvstendig kompetanse. Du kan gå tilbake til leksjonen uten å slette gyldig arbeid.',
    vm: {
      title: 'Bygg en VM — undersøk delene',
      why: 'IaaS gir kontroll over gjesteoperativsystemet. Nå kobler vi dette ansvaret til ressursene en virtuell maskin faktisk trenger. Fra Benefits undersøker vi også hvorfor én stor VM ikke alene beviser tilgjengelighet.',
      outcomes: [
        'Skille VM, OS-disk og nettverkstilknytning.',
        'Se at kapasitet og lokasjon er konfigurasjon, ikke målt ytelse eller driftssikkerhet.',
        'Begrunne hvilke driftsoppgaver kunden beholder.',
      ],
      stages: [
        'Finn Resource groups og velg et gyldig scope.',
        'Åpne Virtual machines. Undersøk Basics, Disks og Networking før Review + create.',
        'Opprett den støttede konfigurasjonen og undersøk VM, OS-disk og NIC.',
        'Begrunn observasjonen og gå tilbake til leksjonen.',
      ],
      observation:
        'Relaterte ressurser vises hver for seg. En vellykket lokal opprettelse sier ikke at et gjeste-OS kjører, at trafikk slipper gjennom eller at løsningen tåler feil.',
    },
    paas: {
      title: 'Fra kode til en støttet plattform',
      why: 'Applikasjonsteamet har egen webkode, men vil slippe å vedlikeholde gjeste-OS. Vi undersøker App Service-planen, webappen og konfigurasjonsarbeidet som fortsatt tilhører kunden.',
      outcomes: [
        'Skille resource group-medlemskap fra hostingavhengighet.',
        'Undersøke et faktisk policyavslag uten å opprette den avviste ressursen.',
        'Forklare hvorfor administrert OS ikke fjerner ansvar for kode, tilgang, data og konfigurasjon.',
      ],
      stages: [
        'Finn Resource groups med globalt søk og organiser ressursene.',
        'Forutsi lokasjon. Forsøk planopprettelse og undersøk kvitteringen ved avslag.',
        'Undersøk policyens scope, korriger ressurslokasjonen og knytt webappen til planen.',
        'Undersøk kundens konfigurasjon og relasjonene i Architecture Explorer. Begrunn og returner.',
      ],
      observation:
        'Resource group har en metadata-lokasjon. Webressursenes lokasjon og planavhengighet er andre egenskaper. Endret metadata-lokasjon opphever ikke en Web-location-policy.',
    },
    saas: {
      title: 'Administrer et ferdig produkt',
      why: 'Et SaaS-produkt leverer ferdig funksjonalitet. Teamet må likevel forvalte personer, lisenser, roller og deling. Dette undersøker vi i en separat, tydelig fiktiv administrasjonssandbox.',
      outcomes: [
        'Skille lisenskapasitet, brukertilgang og administratorrolle.',
        'Undersøke et avslag før en gyldig lisensfordeling.',
        'Forklare hvorfor blokkert pålogging ikke automatisk henter tilbake delte data.',
      ],
      stages: [
        'Undersøk brukerne og den avgrensede lisenskapasiteten.',
        'Prøv tildelingen og les den faktiske kvitteringen.',
        'Korriger lisens, rolle og deling. Håndter en som slutter.',
        'Undersøk resultatet, begrunn ansvaret og returner til leksjonen.',
      ],
      observation:
        'Lisens, rolle og datadeling løser forskjellige problemer. Modellen er ikke en kopi av Microsoft 365 Admin Center og utfører ingen identitets- eller databehandling hos en leverandør.',
    },
    paasSettings: {
      title: 'Undersøk webappen du allerede har',
      why: 'Det finnes allerede en webapp i den lagrede sandboxen. Du trenger ikke opprette alt på nytt. Nå undersøker vi hostingavhengigheten og konfigurasjonsarbeidet som kunden beholder i PaaS.',
      outcomes: [
        'Skille administrert plattform fra kundens appkonfigurasjon.',
        'Følge webappens virkelige referanse til hosting-planen.',
        'Begrunne hva lagret konfigurasjon beviser — og hva den ikke beviser.',
      ],
      stages: [
        'Åpne App Services og undersøk den lagrede webappen.',
        'Åpne Environment variables og velg den støttede kundekonfigurasjonen.',
        'Lagre og les den validerte operasjonen. Undersøk appen og arkitekturen.',
        'Begrunn driftsgrensen og returner til samme leksjon.',
      ],
      observation:
        'Konfigurasjonen lagres i samme inventory som plan og app. Modellen kjører ikke kode, gjør ikke restart og bekrefter ikke fungerende innlogging eller trafikk. Tidligere policykvitteringer kan undersøkes i Activity log.',
    },
    inspection: 'Undersøk før du konkluderer',
    inspectionWhy:
      'Knytt forklaringsmodellen fra Benefits til faktiske, støttede egenskaper i laboratoriet. Dette er inspeksjon, ikke en test av virkelig tilgjengelighet, sikkerhet eller energiforbruk.',
    inspectionStages: [
      'Finn egenskapen eller kvitteringen det vises til.',
      'Skille det som er konfigurert fra det som ikke er simulert.',
      'Gå tilbake til den samme leksjonen og sammenlign med teorien.',
    ],
  },
  guide: {
    group: [
      'Organiser først',
      'En resource group gir et scope for relaterte ressurser, ikke en fysisk maskin eller en region.',
      'Finn Resource groups, opprett eller velg en gyldig gruppe.',
      'Den nye gruppen vises i valgt subscription. Ingen VM er opprettet ennå.',
    ],
    basics: [
      'Velg gjestens forutsetninger',
      'Image og størrelse beskriver ulike egenskaper; mer CPU retter ikke feil operativsystem.',
      'Velg gruppe, navn, image og undervisningsprofil. Fortsett deretter til Disks.',
      'Basics endrer bare skjemaet. Ressurser opprettes først etter Review + create og Create.',
    ],
    disks: [
      'Skill minne fra varig lagring',
      'OS-disken er en egen ressurs. RAM og disk har forskjellige roller.',
      'Undersøk OS-disken og velg eventuell støttet datadisk. Gå videre til Networking.',
      'Se hvilke disker den samlede kommandoen vil opprette. Ingen lagring er opprettet ennå.',
    ],
    network: [
      'Undersøk tilknytningen',
      'NIC knytter VM-en til et subnett. En slik kobling beviser ikke at trafikk er tillatt.',
      'Undersøk nettverksvalg og gå til Review + create.',
      'Modellen viser NIC, subnett og VNet; den simulerer ikke IP-trafikk, DNS eller NSG-regler.',
    ],
    review: [
      'Kontroller før opprettelse',
      'Validering undersøker forespørselen; den er ikke en utført deployment.',
      'Les valideringen. Rett feil, eller velg Create når den er gyldig.',
      'Bare en akseptert kvittering legger ressurser i samme autoritative inventory.',
    ],
    inspectPaas: [
      'Undersøk appkonfigurasjon og hosting',
      'Appen er medlem av en resource group, men bruker planen som hosting-avhengighet. Innstillinger er et eget kundeansvar.',
      'Åpne appen nedenfor, les de lagrede innstillingene og planreferansen, og bekreft inspeksjonen.',
      'Sammenlign appens plan, avledede lokasjon og anvendte innstillinger med Architecture Explorer. Ingen kodekjøring eller restart er bekreftet.',
    ],
    inspect: [
      'Følg de faktiske relasjonene',
      'Medlemskap, diskavhengighet og nettverkstilknytning betyr forskjellige ting.',
      'Åpne ressursene nedenfor, les egenskapene og bekreft hver inspeksjon.',
      'Sammenlign VM, OS-disk og NIC før du begrunner kundens driftsansvar.',
    ],
    settings: [
      'Kunden konfigurerer fortsatt appen',
      'PaaS overtar plattformarbeid, men vet ikke hvilke applikasjonsvalg teamet trenger.',
      'Åpne webappens Environment variables og lagre den støttede konfigurasjonen.',
      'Den validerte innstillingskommandoen endrer lagret appkonfigurasjon. Ingen kode kjøres eller restart simuleres.',
    ],
    explain: [
      'Sett observasjonen i sammenheng',
      'En riktig konfigurasjon forklarer ikke alene hvorfor servicegrensen passer.',
      'Begrunn driftsansvaret og lever den veiledede øvelsen.',
      'Debriefen viser faktiske funn og retur til samme læringsaktivitet.',
    ],
    search: [
      'Finn riktig tjeneste',
      'Globalt søk finner tjenesteflaten; det oppretter ikke en ressurs.',
      'Søk etter Virtual machines og åpne tjenesten. Velg deretter Create.',
      'Skjemaet viser støttede valg. Bruk gjerne «Se oppdraget» for hele sammenhengen.',
    ],
    web: [
      'Bygg hostingavhengigheten',
      'En webapp må referere til en støttet plan. Gruppen er bare management scope.',
      'Følg App Service-labben, eller finn App Services for å undersøke eksisterende arbeid.',
      'Plan, app og kvitteringer kommer fra samme simulator. Ingen egen skygge-inventory brukes.',
    ],
  },
  visual: {
    configuration: 'MODELLSKISSE · VALGENE DINE',
    mechanism: 'ÅRSAK OG SAMMENHENG',
    scopes: { 'sub-app': 'App Sandbox', 'sub-shared': 'Shared Sandbox' },
    selectionNote:
      'Kontroll og driftsarbeid følger tjenestegrensen. Kravene avgjør hva som passer — dette er ikke en rangering fra dårligst til best.',
    retainedTasks: [
      'Gjeste-OS og applikasjon',
      'Kode og appkonfigurasjon',
      'Brukere, tilgang og data',
    ],
    result: 'VALIDERT UNDERVISNINGSRESULTAT',
    boundary: 'Forenklet forklaringsmodell · ingen virkelig drift, trafikk, pris eller måling',
    before: 'Forutsi først. Kjør undersøkelsen for å se beregnet konsekvens.',
    customer: 'KUNDENS ARBEID',
    provider: 'LEVERANDØRENS PLATTFORM',
    request: 'Arbeid inn',
    route: 'Trafikkvalg',
    copies: 'Applikasjonskopier',
    unit: 'jobber/min',
    copy: 'Kopi',
    failed: 'Sviktet',
    reachable: 'Valgt rute',
    unusedRoute: 'Ingen valgt rute',
    availability: 'Kapasitet hjelper bare når arbeidet kan nå en fungerende kopi.',
    dependency: 'Lageroppslag',
    application: 'Webapplikasjon',
    function: 'Fullføre kjøpet',
    incident: 'Hendelse',
    remedy: 'Foreslått tiltak',
    trend: 'Forfattet trend, ikke live målinger',
    reliability: 'Følg den nødvendige funksjonen. Et tiltak må påvirke årsaken som stopper den.',
    requestScope: 'Forespørselens scope',
    policy: 'Fast policy assignment',
    filter: 'Web-ressurser · lokasjonsregel',
    policyNote:
      'Scope avgjør om regelen gjelder. Ressurslokasjon avgjør om forespørselen passer regelen. Dette er ikke en tilgangs- eller nettverksregel.',
    template: 'Én parameterkilde',
    manual: 'Tre uavhengige valg',
    intended: 'Avtalt standard: West Europe',
    management: 'Gjentakelse gir konsistens — også når den samme feilaktige verdien gjentas.',
    required: 'Nødvendig tjenesteperiode',
    allocated: 'Valgt aktiv periode',
    day: '0 → 24 timer',
    efficiency:
      'Kapasitet × kopier × timer = tildelte kapasitets-timer. Dette er ikke energi eller CO₂.',
    guest: 'VIRTUELL GJEST',
    hardware: 'Fysisk vert + virtualisering',
    os: 'Gjeste-OS',
    runtime: 'Runtime og patch-plan',
    disk: 'Appdata på disk',
    memory: 'Flyktig RAM',
    nic: 'NIC → nettverk',
    vmNote:
      'VM-en bruker tildelt CPU og RAM. Disk og nettverk er separate avhengigheter; kunden må planlegge gjestens drift.',
    artifact: 'Teamets kodepakke',
    compatibility: 'Støttet runtime / plattformgrense',
    hosting: 'Administrert hosting',
    platformNote:
      'Leverandøren driver plattformen. Kunden må fortsatt levere kompatibel kode og riktige konfigurasjons-, tilgangs- og datavalg.',
    person: 'Person',
    account: 'Konto + lisens',
    product: 'Ferdig samarbeidsprodukt',
    authority: 'Administrasjonsmyndighet',
    sharing: 'Datadeling',
    saasNote:
      'Tilgang, myndighet og deling er tre ulike relasjoner. En lisens gjør ikke en bruker til administrator.',
    departure:
      'Avsluttet arbeidsforhold: undersøk tilgang OG tidligere deling. Delte kopier forsvinner ikke automatisk.',
  },
  resource: {
    essentials: 'Essentials · støttet konfigurasjon',
    relations: 'Relaterte ressurser',
    scope: 'Management scope',
    reference: 'Tekniske referanser',
    limitations: 'Drift, tilkobling, monitoring og tilgangsstyring er ikke simulert her.',
    discovery: 'Finn en støttet tjeneste',
    empty: 'Ingen ressurser er åpnet i denne lokale økten ennå.',
  },
} as const;
export const serverlessNb = {
  repair: 'Reparer bare serverless-lagringen',
  repairTitle: 'Nullstille serverless-tillegget?',
  repairText:
    'Den ugyldige eller ukjente serverless-registreringen kan ikke gjenopprettes ved vanlig innlasting. Bekreft bare hvis du vil slette de lokale serverless-svarene og modellkjøringene. Cloud Computing v1/v2, andre moduler, XP og Portal-ressurser beholdes. Avbryt beholder også serverless-dataene.',
  repairConfirm: 'Slett bare serverless-registreringen',
  blocked:
    'Veiledningen er satt på pause mens et selvstendig forsøk er aktivt eller læringskonteksten er usikker. Fortsett forsøket via kursoversikten, eller bruk Last inn igjen ved et lagringsvarsel. Ingen løsning vises automatisk.',
  invalid:
    'Bruk hele tall: 0–12 hendelser, 1–4 plasser og 1–3 runder. Prediksjonen må være et helt tall fra 0 til 12.',
  burstCaption: 'Illustrert aktivitetsmønster: stille perioder og korte topper. Ingen målt skala.',
  outcomesHeading: 'Dette skal du forstå',
  stagesHeading: 'Slik undersøker du modellen',
  loading: 'Laster serverless-registreringer …',
  badge: 'Cloud Computing · FC08 · Serverless-tillegg 1.0.0',
  title: 'Serverless: fra hendelse til resultat',
  topics: {
    'serverless-concept': 'Kode som venter på en hendelse',
    'serverless-mechanism': 'Event → Trigger → Execution → Result',
    'serverless-hosting': 'Ansvar, hosting og begrensninger',
    'serverless-explorer': 'Undersøk en hendelseskjede',
    'serverless-assessment': 'Selvstendig anvendelse · Serverless',
    'serverless-summary': 'Ditt serverless-grunnlag',
  },
  prerequisite:
    'Bygger på servere og VM-er, provisioning, delt ansvar, forbruk og prising. Du kan gå tilbake til disse temaene i kursmenyen. Ingen Azure-konto eller programmering er nødvendig.',
  objective:
    'Forklar mekanismen, undersøk en avgrenset modell og velg hosting ut fra nye krav. Dette tillegget har egne registreringer; tidligere Cloud Computing-resultater og XP endres ikke.',
  journal: 'Serverless i Kunnskapsjournalen',
  read: 'Les hele serverless-forklaringen',
  sections: {
    concept: {
      title: 'Når rapportene kommer i rykk og napp',
      paragraphs: [
        'Et dokumentarkiv mottar skannede rapporter. Hver ny fil må kontrolleres og få et miniatyrbilde. Mellom opplastingene finnes det ingen slike jobber. På en VM kan et program vente på arbeid, men teamet må velge maskinkapasitet, vedlikeholde gjesteoperativsystemet og drifte programprosessen.',
        'Serverless lar teamet levere kode og beskrive hva som skal utløse den, mens leverandøren håndterer serverne og den administrerte kjøreplattformen. Koden kjører fortsatt på fysiske prosessorer, i minne og på operativsystemer i datasentre. «Serverless» beskriver at du slipper å administrere disse serverne direkte, ikke at de forsvinner.',
        'Ved ujevn, hendelsesstyrt etterspørsel kan en slik tjeneste tildele utførelseskapasitet etter behov. Det er noe annet enn selv å holde en VM-prosess og gjeste-OS i drift. Du må fortsatt velge tjeneste og hostingplan, konfigurere løsningen og følge med på feil og bruk. Automatisk skalering betyr heller ikke ubegrenset kapasitet.',
        'PaaS og serverless er ikke konkurrerende bokser. PaaS beskriver hvilke driftsoppgaver plattformen overtar. Serverless beskriver en måte å tilby administrert kjøring og ofte hendelsesstyrt skalering på. Azure Functions er både et PaaS-eksempel og en sentral serverless-tjeneste. Andre eksempler finnes i Logic Apps og serverless-konfigurasjoner av Azure Container Apps; detaljene deres er ulike.',
        'En VM, App Service og Functions kan alle kjøre kundekode, men de tilbyr forskjellige kontrollflater. En VM gir kontroll over gjeste-OS. App Service administrerer plattformen for en webapplikasjon. Functions organiserer kode som funksjoner aktivert av triggers. Det riktige valget følger kravene, ikke hvilket produkt som er nyest.',
      ],
      check: 'Hva endres først og fremst når arkivet velger en serverless-tjeneste?',
      choices: [
        [
          'managed-servers',
          'Leverandøren håndterer serverdriften; kundens kode og konfigurasjon består.',
        ],
        ['no-servers', 'Det trengs ikke lenger fysiske servere.'],
        ['no-duties', 'Kunden slipper ansvar for data og applikasjon.'],
      ],
      feedback: {
        'managed-servers':
          'Ja. Driftsgrensen flyttes; fysisk databehandling og kundens applikasjonsansvar består.',
        'no-servers':
          'Koden trenger fortsatt CPU, minne og operativsystem. Forskjellen er hvem som administrerer serverne.',
        'no-duties':
          'Plattformdrift flyttes, men data, tilgang, kundekode og konfigurasjon må fortsatt forvaltes av kunden.',
      },
    },
    mechanism: {
      title: 'En trigger starter kode. Den garanterer ikke resultatet.',
      paragraphs: [
        'En hendelse (event) er noe som har skjedd: en fil ble lastet opp, en HTTP request kom inn, en melding kom i en kø eller et planlagt tidspunkt ble nådd. En trigger definerer hvordan funksjonen skal kalles. I Azure Functions har hver funksjon nøyaktig én trigger.',
        'Funksjonen er koden du har skrevet. En execution er én konkret kjøring av denne koden. Ved filopplasting kan en Blob-trigger sende filinformasjon til koden, som sjekker formatet og lager et miniatyrbilde. Resultatet kan lagres eller sendes videre. En konfigurert trigger beviser verken at koden har kjørt eller at et gyldig resultat finnes.',
        'Bindings kan koble inn- og utdata deklarativt til tjenester. Et output binding kan for eksempel skrive en melding til en kø. Slike bindings er valgfrie; koden kan i stedet bruke et SDK, et programbibliotek for tjenestetilgang. Begge tilnærminger trenger riktig identitet, tilgang og feilhåndtering. En trigger er ikke det samme som selve forretningslogikken.',
        'Azure Functions kan håndtere HTTP-forespørsler, nye filer i Blob Storage, kømeldinger og timer-utløste jobber. En kort skjemavalidering, bildebehandling eller planlagt opprydding er ulike eksempler. Et helt nettsted trenger ofte en annen applikasjonsstruktur, selv om HTTP-triggers også kan brukes til API-er.',
        'Samtidighet betyr hvor mange kjøringer som pågår samtidig. Hvis flere hendelser kommer enn tilgjengelig kapasitet kan behandle innen observasjonsvinduet, kan arbeid gjenstå. Virkelige triggers har ulike regler for buffering, gjentatt levering og retry. Design kode som tåler relevante gjentakelser; en lokal variabel er ikke et varig register over ferdige jobber.',
        'Et lite regneeksempel: To kømeldinger, én utførelsesplass og én jobb per runde trenger to runder i en varm, feilfri modell. En runde er her en oppdiktet arbeidsenhet, ikke et sekund. Utforskeren bruker andre inngangsverdier og beregner ikke Azure-ytelse.',
      ],
      check: 'Hva dokumenterer det at en trigger aktiveres?',
      choices: [
        ['invocation', 'At en kodekjøring utløses, ikke at koden lykkes.'],
        ['success', 'At et korrekt resultat allerede er lagret.'],
        ['binding-required', 'At et output binding må være konfigurert.'],
      ],
      feedback: {
        invocation:
          'Riktig skille. Koden og avhengighetene må lykkes før et gyldig resultat foreligger.',
        success:
          'Triggeren er starten på årsakskjeden. Kodefeil, avhengigheter og tilgang kan fortsatt hindre resultatet.',
        'binding-required':
          'Bindings er valgfrie. Koden kan bruke et SDK, og aktivering beviser ikke noen av disse utdataene.',
      },
    },
    hosting: {
      title: 'Administrert kjøring har fortsatt krav og kostnader',
      paragraphs: [
        'Microsoft håndterer fysisk infrastruktur, vertens operativsystem og den administrerte plattformen. Kunden skriver og tester funksjonskoden, beskytter applikasjonen og dens avhengigheter, forvalter data og identiteter og konfigurerer tilgang, triggers og hosting. Plattformoppdateringer retter ikke feil i din forretningslogikk.',
        'Tilstand er informasjon som skal huskes mellom kjøringer. Ikke stol på at lokale variabler eller midlertidige filer overlever en omstart eller blir delt mellom instanser. Bruk egnet varig lagring når informasjonen må bestå. Durable Functions tilbyr mønstre for tilstandsfulle arbeidsflyter; det betyr ikke at enhver vanlig funksjon automatisk bevarer tilstand.',
        'Cold start er forberedelse før en ny kjøreinstans kan behandle kode. Hostingplan, klargjort kapasitet, programkode og avhengigheter påvirker oppstarten. Det finnes ikke én universell oppstartstid for serverless. Ressursgrenser, samtidighet, kvoter og avhengigheter begrenser også skalering.',
        'Kjøretidsinnstillinger og plan påvirker hvor lenge arbeid kan utføres. En høy eller ubegrenset konfigurert timeout er ingen garanti mot omstart, plattformoppdatering eller nettverksgrenser. Lange jobber kan trenge asynkron oppdeling, varig tilstand og en plan som passer livssyklusen.',
        'Serverless er ikke alltid billigst. Ved vedvarende høy bruk kan dedikert kapasitet være relevant. Ved lange tomrom kan en forbruksmodell passe, men always-ready kapasitet, lagring og andre tjenester kan ha kostnader også når funksjonskoden er inaktiv. Kontroller den faktiske hosting- og prismodellen; her viser vi ingen Azure-priser.',
        'En arbeidsmengde som trenger en egen kjernedriver eller OS-verktøy med administratorrettigheter, kan kreve VM-kontroll. Kontinuerlig arbeid alene utelukker ikke Functions: noen løsninger passer Premium, Dedicated eller en annen struktur. For vanlige webapplikasjoner kan App Service være hensiktsmessig. Vurder kontroll, livssyklus, latency og drift samlet.',
      ],
      check: 'Hvilken kostnadspåstand tåler forskjellige Functions-hostingplaner?',
      choices: [
        [
          'plan-dependent',
          'Kostnader og tomgang avhenger av hostingvalg, klargjort kapasitet og tilknyttede tjenester.',
        ],
        ['all-free', 'Alle Functions-planer er gratis når ingen kode kjører.'],
        ['all-zero', 'Alle Functions-planer skalerer alltid til null.'],
      ],
      feedback: {
        'plan-dependent':
          'Ja. Utførelsesbasert forbruk er bare én modell; varm eller dedikert kapasitet og andre tjenester må også vurderes.',
        'all-free':
          'Premium har minimumskapasitet, Dedicated har allokert plan, og Flex always-ready har baseline. Lagring kan også koste.',
        'all-zero':
          'Flex on-demand kan skalere til null. Premium og Dedicated har andre kapasitetsmodeller; ikke generaliser.',
      },
    },
  },
  terms: [
    ['Event', 'En hendelse som kan aktivere en funksjon.'],
    ['Trigger', 'Regelen som starter en kodekjøring.'],
    ['Execution', 'Én kjøring av kundens funksjonskode.'],
    ['Concurrency', 'Antall samtidige kjøringer.'],
    ['Cold start', 'Forberedelse av kjøreinstans før kode kan behandles.'],
    ['State', 'Informasjon som må bevares mellom kjøringer.'],
  ],
  plans: [
    {
      name: 'Flex Consumption',
      scale: 'Hendelsesstyrt; on-demand kan skalere til null.',
      cost: 'Utførelse og minnebruk. Valgfritt always-ready gir baseline-kostnad.',
      limit:
        'Always-ready reduserer oppstartsventing; kvoter og arbeidsmengde begrenser faktisk skalering.',
    },
    {
      name: 'Premium',
      scale: 'Hendelsesstyrt med varm kapasitet.',
      cost: 'Minimum klargjort kapasitet faktureres også uten aktiv funksjonskode.',
      limit:
        'Varm kapasitet reduserer cold starts; det er ingen garanti for korrekt kode eller uavbrutt drift.',
    },
    {
      name: 'Dedicated',
      scale: 'Kapasitet i App Service plan; manuell skalering eller autoscale.',
      cost: 'Allokert plan, ikke universell betaling bare per execution.',
      limit:
        'Always On og egnet konfigurasjon er viktig for kontinuerlig Functions-host. Ingen universell scale-to-zero.',
    },
  ],
  planHeading: 'Samme Functions-kode, ulike hostingegenskaper',
  provider: 'Microsoft · plattformdrift',
  customer: 'Kunden · applikasjonsansvar',
  providerTasks: 'Fysiske verter, vertens OS og administrert kjøreplattform.',
  customerTasks: 'Kode, applikasjonssikkerhet, data, identitet, tilgang og konfigurasjon.',
  exampleLabel: 'Azure-eksempler, ikke operative funksjoner',
  brief: {
    title: 'Undersøk hva en trigger faktisk setter i gang',
    why: 'Arkivet vil behandle arbeid når hendelser kommer. Du skal skille aktivering, kapasitet og vellykket kode.',
    outcomes: [
      'Følg en hendelse gjennom trigger, kodekjøring og resultat.',
      'Sammenlign begrenset kapasitet med oppstart eller kodefeil.',
      'Forklar kundens ansvar selv når plattformen drifter serverne.',
    ],
    stages: [
      'Velg hendelser, plasser og observasjonsrunder.',
      'Forutsi fullført arbeid før du kjører modellen.',
      'Endre situasjonen, sammenlign og forklar årsaken.',
    ],
    observation:
      'En trigger kan starte en kjøring som feiler. Gjenstående arbeid er noe annet enn mislykket arbeid.',
  },
  start: 'Start undersøkelsen',
  briefOpen: 'SavvyShark · Les oppdraget',
  close: 'Lukk',
  cancel: 'Avbryt',
  briefAction:
    'Start åpner modellen. Avbryt eller Escape lukker uten å registrere læring. Modellen kjører bare når du velger Kjør.',
  boundary:
    'Pedagogisk modell · ingen Azure Function, Portal-ressurs, virkelig kodekjøring, pris eller ytelsesmåling.',
  explorerIntro:
    'Du skal sammenligne en varm referansekjøring med både fullført og ventende arbeid med en annen kjøring med oppstart eller kodefeil. Forklar deretter hvorfor triggeren ikke garanterer et resultat.',
  assumptions:
    'Antakelser: Alle hendelser ankommer før runde 1. Én plass behandler én jobb per runde. En runde er en oppdiktet arbeidsenhet, ikke tid i Azure. Kald oppstart bruker første runde; kodefeil rammer første startede jobb én gang. Ingen retry eller ny automatisk kapasitet. Felles innboks er en abstraksjon, ikke faktisk buffering for alle trigger-typer.',
  eventLabel: 'Hendelsestype',
  events: {
    upload: 'Fil lastes opp',
    http: 'HTTP request',
    queue: 'Kømelding',
    timer: 'Planlagt tidspunkt',
  },
  count: 'Antall hendelser',
  slots: 'Samtidige utførelsesplasser',
  rounds: 'Observasjonsrunder',
  situation: 'Utførelsessituasjon',
  situations: {
    warm: 'Varm, feilfri kode',
    cold: 'Ny instans · første runde klargjøres',
    'code-error': 'Kodefeil i første jobb',
  },
  prediction: 'Forutsi antall fullførte jobber',
  run: 'Kjør modellen',
  previous: 'Sist registrerte kjøring · inngangsverdiene er låst til dette resultatet',
  empty: 'Ingen kjøring ennå. Velg en prediksjon før resultatet beregnes.',
  event: 'Hendelse',
  trigger: 'Trigger',
  execution: 'Kodekjøring',
  output: 'Resultat',
  round: 'Runde',
  pending: 'Venter',
  completed: 'Fullført',
  failed: 'Feilet',
  started: 'Startet',
  prepared: 'Klargjøring',
  trace: 'Spor hver modellert hendelse',
  outputSaved: 'Modellert utdata',
  noOutput: 'Ingen utdata',
  notStarted: 'Ikke aktivert i vinduet',
  causal:
    'Fullført arbeid begrenses av plasser × tilgjengelige behandlingsrunder. Oppstart bruker en runde; feil gir ingen utdata for den berørte jobben. Ventende hendelser har ennå ikke startet. Dette er ikke Azure Functions sin skaleringsalgoritme.',
  compare: 'Sammenlign prediksjon og observasjon',
  predicted: 'Din prediksjon',
  observed: 'Modellen fullførte',
  guidedCheck: 'Hvorfor er en aktivert trigger utilstrekkelig som bevis på et vellykket resultat?',
  guidedChoices: [
    [
      'code-result',
      'Koden og avhengighetene må lykkes; kapasitet kan også gjøre at annet arbeid venter.',
    ],
    ['trigger-guarantee', 'Triggeren garanterer et korrekt resultat.'],
    ['no-servers', 'Det finnes ikke servere som kan feile.'],
  ],
  guidedFeedback: {
    'code-result':
      'Ja. Aktivering, faktisk kjøring og gyldige utdata er forskjellige trinn. Koden forblir kundens ansvar.',
    'trigger-guarantee':
      'En trigger starter arbeid. Se etter kodefeilen og manglende utdata i sporet; aktivering alene er ikke suksess.',
    'no-servers':
      'Koden kjører på fysisk infrastruktur. Administrert drift fjerner verken kodefeil eller avhengigheter.',
  },
  practice: 'Veiledet anvendelse',
  practiceDone: 'Begge kjøringsvitner og riktig årsaksforklaring er registrert.',
  practiceRemaining:
    'Gjenstår: sammenlign en varm, kapasitetsbegrenset referansekjøring med en annen oppstarts-/feilsituasjon, og svar på årsaksspørsmålet.',
  milestone: {
    title: 'Triggeren startet kundens kode',
    message:
      'Dette sporet viser modellert aktivering og utførelse uten at du konfigurerte en VM. Leverandøren håndterer kjøreplattformen; du har fortsatt ansvar for kode, data og tilgang.',
    limit:
      'Dette er et beregnet undervisningsresultat, ikke en Azure-receipt eller bekreftet drift. Undersøk nå forskjellen mellom ventende arbeid og kodefeil.',
    recall: 'SavvyShark · Gjenåpne serverless-milepælen',
  },
  storage:
    'Serverless-lagringen er usikker. Gamle registreringer overskrives ikke. Ulagret arbeid kan gå tapt ved reload. Last inn igjen for å kontrollere lagret innhold.',
  milestoneStorage:
    'Milepælhistorikken kunne ikke lagres eller leses sikkert. Ingen automatisk popup; forklaringen kan åpnes manuelt.',
  reload: 'Last inn serverless-data igjen',
  verify: 'Kontroller forståelsen',
  reviewed:
    'Kilder kontrollert 27. oktober 2026. Kvalifisert menneskelig SME- og læringsvalidering er utestående.',
  sources: 'Offisielle kilder og grenser',
  assessIntro:
    'Nye krav, uten trinnvis veiledning. Velg løsning OG begrunnelse i begge situasjoner, og vurder resultat, ansvar og prising. Alle svar leveres samlet før feedback. Ingen XP eller sertifiseringsstatus. Journal, undervisning eller eksplisitt hjelp under forsøket registreres som assistanse.',
  begin: 'Start selvstendig forsøk',
  submit: 'Lever alle svar',
  aid: 'Be om hjelp · registrerer assistanse',
  aidText:
    'Se etter arbeidsmengdens utløsning, behovet for gjeste-OS-kontroll og hostingplanens kapasitetsmodell. Hjelp er nå registrert; dette forsøket blir ikke unaided.',
  abandon: 'Avbryt forsøket',
  retry: 'Prøv igjen som øving',
  active: 'Aktivt forsøk · svarutkast lagres',
  assisted: 'Assistanse registrert',
  unaided: 'Uten registrert hjelp',
  retryLabel: 'Nytt forsøk er øving etter tidligere eksponering',
  abandoned: 'Avbrutte forsøk',
  feedback: 'Tilbakemelding etter innlevering',
  correct: 'Riktig',
  wrong: 'Undersøk begrunnelsen',
  cases: [
    {
      title: 'A · Ujevne webhook-varsler',
      text: 'Et team mottar uforutsigbare webhook-varsler fra en partner. Hvert varsel trenger en kort validering i egen kode og lagrer resultatet eksternt. Teamet vil slippe vedlikehold av gjesteoperativsystemet og trenger ikke OS-kontroll. De vil vurdere hostingplan og latency. Velg et hensiktsmessig utgangspunkt.',
    },
    {
      title: 'B · Agent med kjernedriver',
      text: 'Et industrielt analyseprogram skal drives kontinuerlig med en bestemt leverandørdriver i gjesteoperativsystemets kjerne og egne OS-diagnoseverktøy. Teamet kan vedlikeholde dette OS-et. Velg hosting som ivaretar disse kontrollkravene.',
    },
  ],
  questions: {
    webhook: {
      label: 'A · Hosting',
      choices: [
        ['functions', 'Azure Functions'],
        ['vm', 'Azure Virtual Machines'],
        ['saas', 'Ferdig SaaS'],
      ],
      feedback: {
        functions:
          'Functions passer korte hendelsesutløste kjøringer med egen kode; plan, tilgang og tilstand må fortsatt velges.',
        vm: 'VM kan kjøre kode, men gir gjeste-OS-drift teamet ikke trenger for denne avgrensede hendelsesjobben.',
        saas: 'Ferdig SaaS gir ikke i seg selv hosting for teamets egen valideringskode.',
      },
    },
    webhookReason: {
      label: 'A · Avgjørende begrunnelse',
      choices: [
        ['events', 'Kort kundekode aktiveres av hendelser uten behov for gjeste-OS-kontroll.'],
        ['free', 'Alle Functions-planer er gratis uten hendelser.'],
        ['no-security', 'Leverandøren overtar all applikasjonssikkerhet.'],
      ],
      feedback: {
        events:
          'Riktig begrunnelse knytter valg til arbeidsform og kontrollbehov, ikke et universelt prisløfte.',
        free: 'Always-ready, Premium og Dedicated kan ha baselinekostnad. Dette er ingen universell sparegaranti.',
        'no-security':
          'Kode, data og tilgang forblir kundens oppgaver også på en administrert plattform.',
      },
    },
    agent: {
      label: 'B · Hosting',
      choices: [
        ['functions', 'Azure Functions'],
        ['vm', 'Azure Virtual Machines'],
        ['app-service', 'Azure App Service'],
      ],
      feedback: {
        functions:
          'Functions gir ikke kontroll til å installere denne kjernedriveren i plattformens OS.',
        vm: 'VM gir nødvendig gjeste-OS-kontroll. Teamet overtar også vedlikehold og operasjonelt ansvar.',
        'app-service':
          'Administrert webhosting gir ikke den etterspurte administratorstyringen av gjeste-OS og kjernedriver.',
      },
    },
    agentReason: {
      label: 'B · Avgjørende begrunnelse',
      choices: [
        ['guest-control', 'Kravet om driver og OS-diagnostikk krever gjeste-OS-kontroll.'],
        ['continuous-impossible', 'Functions kan aldri brukes til langvarig arbeid.'],
        ['cheapest', 'VM er alltid billigst.'],
      ],
      feedback: {
        'guest-control':
          'Det spesifikke kontrollbehovet begrunner VM. Kontinuerlig drift alene avgjør ikke alle hostingvalg.',
        'continuous-impossible':
          'Noen lange jobber kan bruke egnet plan eller asynkron utforming. Kjernedriveren er det avgjørende moteksempelet her.',
        cheapest:
          'Kostnad avhenger av bruk, plan og drift. Ingen universell VM-prisfordel er vist.',
      },
    },
    result: {
      label: 'En trigger er konfigurert. Hva støtter påstanden om vellykket behandling?',
      choices: [
        ['trigger', 'Triggerkonfigurasjonen alene'],
        ['successful-output', 'Undersøkt vellykket kjøring med forventede utdata'],
        ['configured', 'At en hostingplan er valgt'],
      ],
      feedback: {
        trigger:
          'Konfigurasjon er bare en forutsetning, ikke bevis for kjøring eller korrekt kode.',
        'successful-output':
          'Et undersøkt resultat fra faktisk kjøring er sterkere enn konfigurasjon. Explorer-resultatet er likevel bare syntetisk.',
        configured: 'Hostingvalg gjør ikke programkoden korrekt og beviser ingen kjøring.',
      },
    },
    duties: {
      label: 'Hvem må beskytte kundens kode, data og tilgang i Functions?',
      choices: [
        ['customer', 'Kunden, innen plattformens ansvarsdeling'],
        ['provider', 'Bare Microsoft'],
        ['none', 'Ingen når triggeren virker'],
      ],
      feedback: {
        customer:
          'Microsoft drifter plattformen. Kunden forvalter fortsatt disse applikasjonsoppgavene.',
        provider:
          'Administrert OS er ikke det samme som overtatt ansvar for kundens kode og tilgang.',
        none: 'En fungerende trigger er ingen sikkerhets- eller databeskyttelsesgaranti.',
      },
    },
    bill: {
      label: 'En funksjon er inaktiv. Hva trenger du for å vurdere kostnaden?',
      choices: [
        ['zero', 'Ingen flere opplysninger; serverless er gratis'],
        ['plan', 'Hostingplan, varm/allokert kapasitet og tilknyttede tjenester'],
        ['executions-only', 'Bare antall executions, uansett plan'],
      ],
      feedback: {
        zero: 'Det kan finnes baseline- og lagringskostnader uten aktiv funksjonskode.',
        plan: 'Flex on-demand, always-ready, Premium og Dedicated har ulike kostnadsgrunnlag. Ingen faktisk pris beregnes her.',
        'executions-only':
          'Det overser blant annet klargjort eller dedikert kapasitet og relaterte tjenester.',
      },
    },
  },
  summary: 'Tilleggets observasjoner, ikke en ny fullføring av gamle Foundations-rubrikker',
  taught: 'Forklart og kontrollert',
  guided: 'Veiledet modell og årsaksforklaring',
  independent: 'Første selvstendige scenarioinnlevering',
  yes: 'Registrert',
  no: 'Ikke dokumentert ennå',
  independentYes:
    'Alle kriterier riktige i første innlevering uten registrert assistanse eller tidligere avbrudd',
  independentNo: 'Ingen slik observasjon. Se innleveringens konkrete kriterier; retry er øving.',
  summaryLimit:
    'Resultatene er lokale oppgaveobservasjoner. De beviser ikke generell Azure-kompetanse, Microsoft Learn-fullføring eller eksamensberedskap. Hele compute-sammenligningen, inkludert containers, er fortsatt delvis dekket.',
} as const;

/** Original Part A manuscript, authored before the presenter; no official completion claim. */
export const architectureNb = {
  title: 'Describe the core architectural components of Azure',
  path: 'Introduction to Cloud Infrastructure: Describe Azure architecture and services',
  part: 'Part A · Fysisk infrastruktur og feilgrenser',
  available: 'Part A · 3 av 7 delmål i Core Architecture',
  intro:
    'Du kjenner servere, virtuelle maskiner, ansvar og tilgjengelighet. Nå følger vi applikasjonen ned til bygningene og ut til regionene. Undersøk hvilken feil en plassering faktisk tåler — og hvilke avhengigheter som fortsatt kan stoppe tjenesten.',
  boundary:
    'Part A har egne observasjoner for fysisk arkitektur. Part B er tilgjengelig i samme kurs og har egne vurderinger av administrativ arkitektur. Resultater fra begge deler kreves i det samlede statusbildet; tidligere resultater oppgraderes ikke.',
  nextPart: 'Part B · Management groups, subscriptions, resource groups og management hierarchy',
  planned:
    'Part B er tilgjengelig i samme kurs. Fortsett med ressursorganisering, scopes og egne selvstendige oppgaver.',
  open: 'Åpne Core Architecture',
  prerequisite:
    'Bygger på fysisk server og virtualisering i Cloud Computing, ansvar i Service Types og forskjellen på kapasitet og tilgjengelighet i Benefits. Du kan gå tilbake i kursmenyen. Ingen Azure-konto er nødvendig.',
  objective:
    'Forklar fysisk plassering, skill feilgrenser og begrunn et arkitekturvalg. Dette er en konseptuell modell, adskilt fra Portalens lagrede ressurser.',
  topics: {
    datacenters: 'Maskinene trenger et sted å være',
    regions: 'Geography og region',
    zones: 'Soner er forskjellige feilgrenser',
    pairs: 'Regionpar er ikke en beredskapsplan',
    sovereign: 'Region eller separat skymiljø?',
    explorer: 'Azure Infrastructure Explorer',
    assessment: 'Selvstendig anvendelse · fysisk arkitektur',
    summary: 'Dine observasjoner · Part A',
  },
  sections: {
    datacenters: {
      title: 'Fra virtuell ressurs til fysisk avhengighet',
      paragraphs: [
        'En VM er virtuell, men instruksjonene utføres fortsatt av fysiske prosessorer og minne. Et datacenter er anlegget som rommer servere i rack, lagringsutstyr og nettverk. Compute utfører arbeid, storage bevarer informasjon, og networking knytter komponentene sammen. En virtuell ressurs er ikke en ny fysisk bygning.',
        'Fra tidligere vet du hvordan virtualisering deler og isolerer kapasitet. Under dette finnes vertsmaskinen og anlegget. Strøm holder utstyret i drift, kjøling fjerner varme, og nettverksforbindelser gjør tjenestene tilgjengelige. Fysisk sikring begrenser hvem som får tilgang til anlegget og utstyret. Microsoft håndterer disse fasilitetene; kundens ansvar for kode, data og tilgang består.',
        'En feilgrense beskriver hvilke komponenter som kan bli rammet av samme hendelse. En feil i én vert er mindre omfattende enn en hendelse som rammer et helt anlegg. Redundant strøm og nettverk reduserer noen risikoer, men er ikke et løfte om at din applikasjon har uavhengige kopier. To ressursnavn eller resource groups skaper ingen fysisk separasjon.',
        'Tenk på en rapporttjeneste med én API-kopi og én datakopi i samme fiktive anlegg. Hvis hele anlegget blir utilgjengelig, rammes begge. Flytter du bare en ny API-kopi til et annet anlegg, kan prosessen overleve mens tjenesten fortsatt mangler data. Tilgjengelighet må vurderes gjennom hele avhengighetskjeden.',
      ],
      terms: [
        ['Datacenter', 'Et fysisk anlegg med databehandling og nødvendig støtteinfrastruktur.'],
        [
          'Feilgrense',
          'Omfanget av en bestemt feil, for eksempel vert, anlegg, sone eller region.',
        ],
        ['Avhengighet', 'En komponent eller funksjon som en annen trenger for å virke.'],
      ],
      question:
        'To VM-er ligger i samme bygning, men i ulike resource groups. Hva gir dette i seg selv?',
      choices: [
        [
          'management',
          'Forskjellig management-organisering, ikke dokumentert fysisk feilseparasjon.',
          'Ja. Administrasjonsgrupperingen flytter ikke maskinene eller bygningen.',
        ],
        [
          'isolated',
          'Uavhengig strøm og kjøling for de to VM-ene.',
          'Nei. Resource groups bestemmer ikke fysisk strøm- eller kjølegrense.',
        ],
        [
          'safe',
          'En garanti mot at en anleggsfeil rammer begge.',
          'Nei. Begge kan være avhengige av det samme anlegget.',
        ],
      ],
    },
    regions: {
      title: 'Velg sted etter krav, ikke etter kartfarge',
      paragraphs: [
        'En Azure region er et geografisk lokalisert sett av datasentre og nettverksinfrastruktur. En geography grupperer regioner som en datalagringsgrense. Dette er geografiske begreper, ikke management-hierarkiet. Regionen er ikke underordnet resource group som en fysisk underavdeling. Gruppens metadataregion bestemmer heller ikke hvor alle medlemmene kjører.',
        'Azure har flere regioner for å tilby tjenester nær ulike brukere og gi muligheter for fysisk separasjon. Avstand kan påvirke nettverksforsinkelse, men nærhet alene avgjør ikke applikasjonens ytelse. Tjeneste, tier eller SKU, kapasitet, avhengigheter og konfigurasjon må også kontrolleres for den aktuelle regionen.',
        'Et datert eksempelutvalg: West Europe og North Europe hører til geography Europe. Norway East og Norway West hører til Norway. Italy North hører til Italy. Disse geography-navnene er Azure-begreper; kontinentet Europa er ikke identisk med geography Europe. I den kontrollerte listen har Norway East soner, Norway West mangler oppført sonestøtte og har begrenset tilgang, mens Italy North har soner uten et regionpar.',
        'Krav til data kan gjelde produksjonsdata, replikaer, sikkerhetskopier og andre behandlingsprosesser. Kontroller tjenestens faktiske vilkår og egenskaper; et regionsnavn gir ingen generell compliance-garanti. Noen tjenester er nonregional og velges ikke som én regional instans. Kartet vårt er et avgrenset undervisningsutvalg, ikke en sanntidskatalog eller oversikt over faktiske datasenteradresser.',
      ],
      terms: [
        ['Region', 'En lokalisert samling fysisk Azure-infrastruktur.'],
        ['Geography', 'En gruppering av regioner med en definert datalagringsgrense.'],
        ['Latency', 'Forsinkelse ved kommunikasjon; må vurderes for den faktiske arbeidsmengden.'],
      ],
      question:
        'Et team har valgt en region nær brukerne. Hva gjenstår før arkitekturvalget kan godtas?',
      choices: [
        [
          'requirements',
          'Kontroller tjenester, konfigurasjon, avhengigheter og relevante datakrav.',
          'Ja. Nærhet er bare ett hensyn; den bekrefter verken tjenestestøtte eller hele databehandlingen.',
        ],
        [
          'name',
          'Ingenting; regionnavnet garanterer tjenestetilbud og compliance.',
          'Nei. Regioner og tjenester har forskjellige egenskaper, og krav må undersøkes konkret.',
        ],
        [
          'group',
          'Velg samme metadataregion på resource group, så flyttes alle ressurser dit.',
          'Nei. Metadataregionen er en annen egenskap enn ressursenes lokasjon.',
        ],
      ],
    },
    zones: {
      title: 'En sone er en isolasjonsgrense, ikke en ekstra kopi',
      paragraphs: [
        'Availability Zones er fysisk adskilte grupper av ett eller flere datasentre i en region. Sonene har uavhengig strøm, kjøling og nettverk, slik at en avgrenset feil ikke behøver å ramme alle. Flere bygninger innenfor samme sone deler likevel den modellerte sonegrensen. En sone er ikke nødvendigvis én bygning.',
        'En zonal ressurs er plassert i én valgt logisk sone. Den kan være isolert fra feil i andre soner, men er sårbar for feil i sin egen. Lager du selv kopier i ulike soner, må også ruting, data og gjenoppretting fungere. En ekstra webserver reparerer ikke en utilgjengelig database.',
        'En zone-redundant tjeneste fordeler sine komponenter mellom soner og håndterer støttet sonegjenoppretting. Noen tjenester gjør dette automatisk, andre krever at du aktiverer en støttet konfigurasjon. Tilgjengelige regioner, SKU-er og tjenestenivåer kan begrense muligheten. En vanlig App Service plan i AzureLabs Portal konfigurerer ikke denne egenskapen.',
        'Nonzonal eller regional deployment gir deg ingen bestemt sonetilordning eller garanti om soneresiliens. Hvis en sone feiler, kan en slik ressurs være rammet. Dette er noe annet enn en nonregional tjeneste som Microsoft leverer på tvers av regioner. Modellen viser usikkerhet når den ikke kjenner plasseringen, fremfor å gjette at ressursen er trygg.',
        'Logiske sonenumre kan være mappet ulikt til fysiske soner mellom subscriptions. Zone 1 er derfor ikke en universell fysisk adresse. Antallet soner i regionen, soner brukt av tjenesten og antallet replikaer kan dessuten være forskjellig. Kontroller dokumentasjonen for den konkrete tjenesten, ikke bare om regionen viser sonestøtte.',
      ],
      terms: [
        ['Zonal', 'Ressursen er knyttet til én valgt sone.'],
        ['Zone-redundant', 'Tjenestens støttede komponenter er fordelt over soner.'],
        ['Nonzonal / regional', 'Ingen valgt eller lovet sonetilordning.'],
        ['Replica', 'En eksplisitt kopi; antallet er ikke det samme som antall soner.'],
      ],
      question:
        'En region har Availability Zones. Én zonal app og dens eneste datakopi ligger i Zone 1. Hva følger?',
      choices: [
        [
          'vulnerable',
          'Løsningen er fortsatt sårbar når dens egen sone rammes.',
          'Ja. Regionen tilbyr flere feilgrenser, men denne løsningen bruker bare én.',
        ],
        [
          'automatic',
          'Azure kopierer automatisk alle app- og datakomponenter til andre soner.',
          'Nei. Sonestøtte alene konfigurerer ikke alle tjenesters redundans.',
        ],
        [
          'labels',
          'Zone 1 betyr alltid samme bygning i alle subscriptions.',
          'Nei. Logiske sonenumre kan ha forskjellig fysisk mapping.',
        ],
      ],
    },
    pairs: {
      title: 'Skill plattformrelasjonen fra din arbeidsmengde',
      paragraphs: [
        'Et regionpar er en kobling Microsoft har definert mellom noen regioner. Enkelte tjenester bruker parene til geo-replikering, geo-redundans eller deler av disaster recovery. Du velger ikke et nytt offisielt regionpar ved å opprette to ressurser. En slik kobling er heller ikke en rute eller en kopi av din applikasjon.',
        'North Europe og West Europe er et dokumentert symmetrisk par. Italy North har ikke et regionpar. Noen par er asymmetriske: Brazil South peker mot South Central US, mens South Central US peker mot North Central US. Paret krysser da også Brazil-geography. Ikke lær at alle par er gjensidige eller alltid innen samme geography.',
        'En regionhendelse kan ramme flere soner samtidig. Skal arbeidsmengden fortsette i en annen region, må egnede appressurser, data, avhengigheter og trafikkstyring finnes og fungere der. Tjenestene kan tilby innebygde mekanismer, men de har egne vilkår og konfigurasjoner. Et regionpar garanterer ikke generell automatisk replikering, failover eller null datatap.',
        'Multiregion beskriver en arkitektur som bruker flere regioner. Den kan bruke parede, ikke-parede eller en kombinasjon av regioner når tjenestene og kravene tillater det. Geografiske krav, latency, tilgjengelig tjenestestøtte og driftskompleksitet må avveies. Denne øvelsen beregner ingen SLA, gjenopprettingstid eller replikeringstid.',
      ],
      terms: [
        ['Region pair', 'En Microsoft-definert relasjon som noen tjenester benytter.'],
        [
          'Multiregion',
          'En løsning som bruker flere regioner, med eksplisitte forbindelser og avhengigheter.',
        ],
        [
          'Failover',
          'Å flytte eller dirigere arbeid til en egnet alternativ løsning etter en feil.',
        ],
      ],
      question:
        'En applikasjon ligger i West Europe. Regionen har et par. Hva er allerede bekreftet?',
      choices: [
        [
          'relationship',
          'Bare parrelasjonen; appens replikering og failover må undersøkes separat.',
          'Ja. Regionmetadata er ikke en konfigurasjon av hele arbeidsmengdens recovery.',
        ],
        [
          'copy',
          'At North Europe allerede inneholder en oppdatert kopi av applikasjonen.',
          'Nei. En kopi må tilbys og konfigureres gjennom den aktuelle løsningen eller tjenesten.',
        ],
        [
          'unpaired',
          'At en ikke-paret region aldri kan inngå i en robust multiregion-løsning.',
          'Nei. Ikke-parede regioner kan brukes når tjenester og krav støtter designet.',
        ],
      ],
    },
    sovereign: {
      title: 'Et annet regionsnavn er ikke nødvendigvis et annet skymiljø',
      paragraphs: [
        'Azure public cloud tilbyr mange regioner. Azure Government og Azure operated by 21Vianet in China er separate, fysisk isolerte skymiljøer med egne operasjonelle grenser. En vanlig public-cloud-region blir ikke et slikt miljø fordi den ligger i et bestemt land.',
        'Azure Government er rettet mot kvalifiserte amerikanske myndighetsorganisasjoner og partnere. Miljøet har isolert amerikansk infrastruktur og særskilte operative og kontraktuelle rammer. Berettigelse, faktisk tjenestetilbud og nødvendige konfigurasjoner må bekreftes; navnet er ikke en generell sikkerhetsgaranti for enhver applikasjon.',
        'Azure i Kina er en fysisk separat instans som drives uavhengig av 21Vianet. Tjenester, funksjoner og endepunkter kan avvike fra global Azure. Å velge China som skymiljø er derfor mer enn å endre Region i en eksisterende public-cloud-konfigurasjon.',
        'Sovereignty handler også om kontroll over data og tilgang, ikke bare fysisk isolasjon. Azure public cloud har funksjoner som kan støtte slike krav. Velg miljø og region etter de faktiske kravene, inkludert replikaer, gjenoppretting og operasjonell tilgang. Kontroller dokumentasjon, avtaler og kvalifisert vurdering. Kurset gir ingen universell compliance-garanti eller juridisk godkjenning.',
      ],
      terms: [
        ['Sovereign environment', 'Et skymiljø med bestemte operative og jurisdiksjonelle rammer.'],
        [
          'Azure Government',
          'Separat Azure-miljø for kvalifiserte amerikanske myndigheter og partnere.',
        ],
        ['Azure in China', 'Separat instans drevet av 21Vianet.'],
      ],
      question: 'Er Norway East og Azure Government to likeverdige valg i samme Region-liste?',
      choices: [
        [
          'environment',
          'Nei. Den ene er en public-cloud-region; den andre er et separat miljø med egne krav.',
          'Riktig. Du må skille cloud environment fra region innenfor miljøet.',
        ],
        [
          'same',
          'Ja. Alle landregioner er egne sovereign clouds.',
          'Nei. Geografisk plassering og separat skymiljø er forskjellige dimensjoner.',
        ],
        [
          'guarantee',
          'Ja, og begge garanterer automatisk at alle applikasjoner er compliant.',
          'Nei. Kundens løsning og faktiske krav må fortsatt vurderes.',
        ],
      ],
    },
  },
  journal: 'Core Architecture Part A i Kunnskapsjournalen',
  backCourse: 'Tilbake til kursoversikten',
  choose: 'Velg en vurdering',
  asymmetricNote: 'Retningen er ikke en operativ replikeringsforbindelse',
  inspect: 'Undersøk et fysisk nivå',
  inspection: {
    geography: [
      'Geography',
      'Grupperer regioner som datalagringsgrense. Dette er ikke et management-scope; kontroller de faktiske tjenestevilkårene.',
    ],
    region: [
      'Region',
      'Samler lokalisert fysisk infrastruktur. Et regionbortfall kan ramme alle sonene der. Parrelasjonen oppretter ingen appkopi.',
    ],
    zone: [
      'Availability Zone',
      'Ett eller flere datasentre med egen strøm, kjøling og nettverk. De fiktive A/B/C-etikettene er ikke universelle Zone 1/2/3.',
    ],
    datacenter: [
      'Datacenter',
      'En bygnings-/anleggsgrense i modellen. To anlegg i samme sone kan tåle én anleggsfeil, men deler en mulig sonefeil.',
    ],
    hardware: [
      'Physical infrastructure',
      'Compute, storage og networking trenger strøm, kjøling og fysisk sikring. Kopier må dekke nødvendige avhengigheter, ikke bare app-prosessen.',
    ],
  },
  regionNames: {
    norwayeast: 'Norway East',
    norwaywest: 'Norway West',
    westeurope: 'West Europe',
    northeurope: 'North Europe',
    italynorth: 'Italy North',
  },
  pairLimit: 'Parmetadata, ikke replikerings- eller failover-forbindelse',
  dataAssumption: 'Klar ved observasjonen når valgt; ingen faktisk replikering målt',
  allReasons: 'Begrunnelser for alle alternativene',
  geography: 'Geography · eksempelutvalg',
  region: 'Primærregion',
  secondary: 'Sekundærregion',
  geographyNames: { norway: 'Norway', europe: 'Europe', italy: 'Italy' },
  reviewed: 'Eksempelmetadata kontrollert 27. oktober 2026 · ikke sanntid',
  restricted: 'Begrenset tilgang i Azure · bare konseptuell utforskning her',
  hasZones: 'Sonestøtte oppført',
  noZones: 'Ingen sonestøtte oppført',
  noPair: 'Ikke paret',
  pair: 'Dokumentert par',
  placement: 'Plassering av appkopier',
  placements: {
    single: 'Én plassering',
    'same-zone': 'To anlegg i samme sone',
    'multi-zone': 'Kopier i ulike soner',
    'multi-region': 'Kopier i to regioner',
    nonzonal: 'Nonzonal · ukjent fysisk plassering',
  },
  data: 'Datakopier',
  dataModes: { single: 'Bare én datakopi', replicated: 'Eksplisitte kopier ved appplasseringene' },
  routing: 'Ruting i undervisningsmodellen',
  routes: { primary: 'Bare primær appkopi', healthy: 'Bruk overlevende appkopier' },
  failure: 'Modellert hendelse',
  failures: {
    none: 'Ingen feil',
    datacenter: 'Ett datasenter utilgjengelig',
    zone: 'Én sone utilgjengelig',
    region: 'Én region utilgjengelig',
  },
  target: 'Feilens mål',
  prediction: 'Forutsi tjenestens resultat',
  states: {
    serving: 'En brukbar tjenestevei finnes',
    unavailable: 'Ingen brukbar tjenestevei',
    uncertain: 'Kan ikke avgjøres fra kjent plassering',
  },
  componentStates: { up: 'Ikke rammet', down: 'Rammet', unknown: 'Ukjent påvirkning' },
  run: 'Kjør feilscenarioet',
  draft: 'Forhåndsvisning av konfigurasjon · ingen kjøring registrert',
  observed: 'Siste registrerte resultat · beholdt med sine inngangsvalg',
  result: 'Modellens observasjon',
  yourPrediction: 'Din prediksjon',
  physical: 'Fysisk overlevende appkopier',
  usable: 'Brukbare appkopier',
  assumptions:
    'Modellgrenser: Tegnede anlegg A/B er fiktive. Hver illustrert sone har to anlegg kun for å forklare feilgrenser. Kopier er klare og logisk like ved observasjonen når du velger dem; ingen replikeringstid, quorum, datakorrupsjon, trafikk eller faktisk Azure-helse modelleres. Appen trenger både ruting og en tilgjengelig datakopi. I denne modellen er hver appkobling til hver konfigurert datakopi eksplisitt deklarert og tilgjengelig når kopien ikke er rammet; kopiene er logisk like ved observasjonen. Modellen beregner ingen SLA eller failover-tid.',
  crossGeo:
    'Regionvalgene krysser geography-grensen. Modellen forbyr det ikke; du må kontrollere om den faktiske løsningen og datakravene tillater det.',
  unknown:
    'Nonzonal plassering avslører ingen bestemt sone eller bygning. Derfor er påvirkningen ved mindre feil usikker. Dette er ikke dokumentert redundans.',
  locationLimit:
    'Skjematisk fysisk struktur · ingen kartkoordinater, faktisk datasenterinventar eller Azure-ressurser',
  table: 'Komponenter, fysisk plassering og faktisk modellpåvirkning',
  columns: [
    'Komponent',
    'Region',
    'Fysisk sone i modellen',
    'Fiktivt anlegg',
    'Påvirkning',
    'Avhengighet / ruting',
  ],
  app: 'App',
  dataCopy: 'Data',
  depends: 'Trenger tilgjengelige data',
  routed: 'Valgt av rutingen',
  notRouted: 'Ikke valgt av rutingen',
  facility: 'Fiktivt datasenter',
  zone: 'Fysisk sone',
  hardware: 'Compute · storage · networking',
  support: 'Strøm · kjøling · fysisk sikring',
  causes: {
    serving:
      'Minst én appkopi er både urammet, nådd av den valgte rutingen og koblet til en urammet datakopi i denne modellen.',
    unavailable:
      'Undersøk komponentradene: enten mangler appen, rutingen velger ingen overlevende kopi, eller den nødvendige datakopien er rammet. Et regionpar retter ingen av disse forholdene.',
    uncertain:
      'En eller flere nødvendige plasseringer er ukjente. En mindre feil kan ramme dem; modellen har ikke grunnlag for en garanti.',
  },
  controls: 'Valg før kjøring',
  practice: 'Veiledet modellundersøkelse',
  invalid:
    'Kombinasjonen er ikke støttet. Velg soner bare i en region med sonestøtte, forskjellige regioner for multiregion og et gyldig feilmål.',
  task: 'Sammenlign tre observasjoner: én plasserings feil, overlevende app med tapt data, og en brukbar vei med eksplisitte kopier og ruting. Prediker før hver kjøring. Avslutt med en årsaksforklaring.',
  steps: [
    'Én appplassering: undersøk en anleggsfeil.',
    'Fordel appkopier mellom soner, behold én datakopi og undersøk en sonefeil.',
    'Behold sonefeilen, konfigurer datakopier og ruting, og sammenlign resultatet.',
  ],
  reason: 'Feilseparasjon hjelper bare når alle nødvendige deler av tjenesteveien kan brukes.',
  actualGuide:
    'Endre plassering, datakopier og ruting i kontrollene over. Fargene i tegningen forklares også med tilstandstekst og komponenttabell. Resultatet nedenfor kommer alltid fra den sist registrerte kjøringen.',
  explain: 'Hvorfor kan en appkopi overleve uten at tjenesten er tilgjengelig?',
  explainChoices: [
    ['dependencies', 'Tjenesten trenger også en tilgjengelig datakopi og fungerende valgt ruting.'],
    ['pair', 'Regionparet kopierer automatisk resten av løsningen.'],
    ['zones', 'Enhver region med soner gjør alle ressursene høyt tilgjengelige.'],
  ],
  explainFeedback: {
    dependencies:
      'Ja. Fysisk overlevelse, avhengigheter og en brukbar tjenestevei er forskjellige observasjoner.',
    pair: 'Nei. Parrelasjonen oppretter verken kopier eller ruting for denne arbeidsmengden.',
    zones: 'Nei. Sonestøtte er en mulighet; konfigurasjonen og hele avhengighetskjeden avgjør.',
  },
  witnesses: [
    'Enkeltplassering rammet',
    'App overlever, men datavhengighet bryter tjenesten',
    'Eksplisitt redundant, brukbar tjenestevei',
  ],
  guidedDone:
    'Tre forskjellige modellvitner og riktig årsaksforklaring er registrert som veiledet praksis.',
  pending: 'Gjenstår',
  registered: 'Registrert',
  notYet: 'Ikke registrert',
  briefOpen: 'SavvyShark · Les infrastruktur-oppdraget',
  start: 'Start undersøkelsen',
  cancel: 'Avbryt',
  close: 'Lukk',
  brief: {
    title: 'Hvilken feil tåler arkitekturen din?',
    why: 'Arkivteamet har forstått cloud computing. Nå må de undersøke hvor kopier ligger og hva de faktisk er avhengige av. Du skal skille mellom at én komponent overlever og at tjenesten fortsatt kan brukes.',
    observe:
      'Følg anlegg, soner og regioner i tegningen. Prediker, kjør og sammenlign de eksplisitte plasseringene, datakopiene og rutingen.',
    consequence:
      'Start viser kontrollene. Avbryt eller Escape lukker uten kjøring eller læringsresultat. Bare Kjør registrerer din prediksjon og modellresultat.',
  },
  milestones: {
    loss: {
      title: 'En felles fysisk grense rammet løsningen',
      text: 'Den registrerte feilen rammet den valgte plasseringen. Flere navn eller management-grupper ville ikke skapt en uavhengig kopi. Se hvilke komponenter som deler feilmålet.',
    },
    resilience: {
      title: 'En brukbar vei består — fordi den er konfigurert',
      text: 'En komponent ble rammet, men modellen fant fortsatt en app med ruting og tilgjengelige data. Det skyldes de eksplisitte kopiene og forbindelsene, ikke regionens navn eller par.',
    },
  },
  recall: 'SavvyShark · Gjenåpne observasjon',
  milestoneLimit:
    'En syntetisk observasjon, ikke målt Azure-tilgjengelighet, bekreftet failover eller fullført kompetanse.',
  historyIssue:
    'Visningshistorikken kan ikke lagres trygt. Ingen automatisk popup gjentas; relevante forklaringer kan åpnes manuelt.',
  blocked:
    'Veiledningen er satt på pause fordi en uavhengig vurdering er aktiv eller lagret kontekst er usikker. Svarutkast og tidligere arbeid beholdes. Gå tilbake til vurderingen eller last gyldig tilstand på nytt.',
  storage:
    'Part A-lagringen er usikker. Ingenting i gamle kurs eller Portal slettes. Ved nektet lagring er nye handlinger bare i minnet.',
  reload: 'Les lagret Part A på nytt',
  repair: 'Reparer bare Part A-lagringen',
  repairTitle: 'Nullstille ugyldig Core Architecture Part A?',
  repairText:
    'Dette sletter bare den ugyldige eller ukjente Part A-registreringen. Foundations, Serverless, Benefits, Service Types, XP og Portal-ressurser beholdes. Avbryt/Escape beholder også Part A-dataene.',
  repairConfirm: 'Slett bare ugyldige Part A-data',
  limit:
    'Part A-historikken er full og beholdes lesbar. Nye øvelser og forsøk kan ikke registreres her. Et aktivt forsøk kan fortsatt leveres med et komplett lagret utkast eller avbrytes. Åpnet undervisning registreres fortsatt som hjelp. Andre kurs og Portal fungerer videre; ingen gamle resultater slettes.',
  limitReturn: 'Se aktiv vurdering eller tidligere resultat',
  loading: 'Laster validert Part A-historikk …',
  independent: 'Selvstendig anvendelse · nye krav',
  assessmentIntro:
    'Vurder tre nye situasjoner og begrunn beslutningene. Alle svar leveres samlet før feedback. Ingen trinnvise løsningshint vises. Å åpne Journal, undervisning, oppsummering eller eksplisitt hjelp under et aktivt forsøk registreres som assistanse; reload beholder utkastet.',
  scenarios: [
    {
      title: '1 · Bestillinger gjennom en sonefeil',
      text: 'En billettjeneste skal fortsatt ta imot bestillinger dersom én Availability Zone blir utilgjengelig. Den bruker API og nødvendige bookingdata. Regionen støtter relevante tjenester. Hele regionbortfall er ikke kravet i denne oppgaven. Velg en løsning og en begrunnelse.',
    },
    {
      title: '2 · Geografiske og operative krav',
      text: 'Et forskningsprosjekt har eksplisitt godkjent Italy North og West Europe for data og replikaer. De vil tåle regionbortfall når de aktuelle tjenestene og konfigurasjonene støtter det. Et separat amerikansk myndighetsprosjekt har fått et uttrykkelig krav om Azure Government og har bekreftet berettigelse. Vurder prosjektene ut fra hvert sitt krav.',
    },
    {
      title: '3 · Feilutredning i fysisk infrastruktur',
      text: 'To applikasjonskopier ligger i ulike datasentre innenfor samme Availability Zone. Et soneomfattende strøm-/nettverksproblem oppstår. Knytt komponentene til riktig fysisk nivå og forklar om kopiene er tilstrekkelig separert for denne feilen. De fysiske adressene er ikke offentliggjort.',
    },
  ],
  begin: 'Start selvstendig Part A-forsøk',
  submit: 'Lever alle Part A-svar',
  retry: 'Prøv igjen som øving',
  abandon: 'Avbryt forsøket',
  aid: 'Be om hjelp · registrerer assistanse',
  aidText:
    'Hjelp registrert. Undersøk hele tjenesteveien, skill regionmetadata fra konfigurert recovery og les de relevante undervisningsenhetene. Dette forsøket er nå assistert.',
  unaided: 'Uten registrert hjelp',
  assisted: 'Med registrert hjelp',
  retryLabel: 'Øving etter tidligere eksponering',
  active: 'Aktivt forsøk · svarutkast lagres',
  feedback: 'Feedback etter samlet innlevering',
  correct: 'Kriteriet oppfylt',
  wrong: 'Kriteriet ikke oppfylt',
  questions: {
    zoneDesign: {
      objective: 'CA02',
      scenario: 0,
      label: 'Plassering og tjenestevei',
      choices: [
        [
          'complete',
          'Fordel app og data på støttede soner, med egnet ruting og tjenestespesifikk recovery.',
        ],
        ['apps', 'Fordel bare API-kopiene; behold eneste database i én sone.'],
        ['same', 'Bruk to bygninger i samme sone og behold én rute.'],
      ],
      feedback: {
        complete:
          'Alle nødvendige deler må tåle den aktuelle sonefeilen. Tjenestenes faktiske støtte og konfigurasjoner må bekreftes.',
        apps: 'En overlevende API-kopi kan ikke ta bestillinger hvis nødvendige bookingdata er utilgjengelige.',
        same: 'Ulike bygninger i samme sone deler fortsatt den soneomfattende feilgrensen.',
      },
    },
    zoneReason: {
      objective: 'CA02',
      scenario: 0,
      label: 'Hvorfor dette omfanget?',
      choices: [
        [
          'region',
          'Kravet krever to regioner; sonene er bare kapasitetsgrupper uten egen feilseparasjon.',
        ],
        [
          'provider',
          'Regionens sonestøtte er tilstrekkelig; appens data og trafikk trenger ikke egne tiltak.',
        ],
        [
          'boundary',
          'En sonefeil krever uavhengige soner og hele avhengighetskjeden; regionfeil er et annet krav.',
        ],
      ],
      feedback: {
        boundary: 'Riktig feilgrense må motstås. Soneresiliens er ikke automatisk regionresiliens.',
        region:
          'Et regionpar erstatter ikke konfigurasjon. Støttet multizone-design kan møte det oppgitte sonekravet.',
        provider:
          'Ansvarsdelingen varierer med tjenesten; regionens soner alene konfigurerer ikke arbeidsmengden.',
      },
    },
    mapping: {
      objective: 'CA02',
      scenario: 0,
      label: 'To subscriptions bruker Zone 1. Hva kan konkluderes?',
      choices: [
        ['different', 'De ulike subscriptions dokumenterer at ressursene er fysisk separert.'],
        [
          'check',
          'Den fysiske mappingen må undersøkes; likt logisk nummer beviser ikke samme eller ulik fysisk sone.',
        ],
        ['same', 'Siden regionen er lik, peker begge Zone 1 til samme fysiske sone.'],
      ],
      feedback: {
        check:
          'Logisk til fysisk mapping kan variere. Administrasjonsgrenser gir ingen slik fysisk konklusjon alene.',
        same: 'Nummeret er logisk innen en subscription, ikke en universell adresse.',
        different: 'Ulike subscriptions kan ikke brukes som bevis på fysisk feilseparasjon.',
      },
    },
    regions: {
      objective: 'CA01',
      scenario: 1,
      label: 'Forskningsprosjektets regionvalg',
      choices: [
        [
          'configured',
          'De godkjente regionene kan brukes dersom tjenester, datakopier, ruting og recovery støtter kravene.',
        ],
        [
          'pair-only',
          'Avvis den godkjente kombinasjonen: applikasjonens andre region må være Microsofts oppførte partner.',
        ],
        [
          'pair-auto',
          'Velg et dokumentert regionpar og stol på parrelasjonen fremfor å konfigurere appens recovery.',
        ],
      ],
      feedback: {
        configured:
          'Et multiregion-design krever faktiske egenskaper og eksplisitt konfigurasjon. Et offisielt par er ikke et universelt krav.',
        'pair-only':
          'Ikke-parede regioner kan inngå i multiregion-design når tjenestene tillater det.',
        'pair-auto':
          'Parmetadata er ikke en automatisk kopi av arbeidsmengden eller dens routing/recovery.',
      },
    },
    regionReason: {
      objective: 'CA01',
      scenario: 1,
      label: 'Hva må godkjenningen av lokasjon omfatte?',
      choices: [
        [
          'primary',
          'Bare primærdataenes region; gjenopprettingskopier regnes utenfor lokasjonskravet.',
        ],
        [
          'label',
          'At begge regionene ligger i Europa, uten videre kontroll av tjenestenes behandling.',
        ],
        [
          'all-data',
          'Replikaer, backup, avhengigheter og faktisk tjenestebehandling må vurderes, ikke bare primærregionens navn.',
        ],
      ],
      feedback: {
        'all-data':
          'Hele databehandlingen må vurderes mot de faktiske kravene; ingen generell compliance-garanti følger av navnet.',
        primary: 'Dataflyt og gjenoppretting kan krysse grenser hvis de ikke inngår i designet.',
        label:
          'Et geografisk navn er ikke dokumentasjon for tjenestens eller kundens samlede forpliktelser.',
      },
    },
    sovereign: {
      objective: 'CA01',
      scenario: 1,
      label: 'Myndighetsprosjektets uttrykkelige miljøkrav',
      choices: [
        [
          'china',
          'Bruk Azure i Kina: en separat sky oppfyller samme operative miljøkrav som Azure Government.',
        ],
        [
          'government',
          'Undersøk og bruk det kvalifiserte Azure Government-miljøet med dets egne tjenester og operative rammer.',
        ],
        ['us-region', 'Velg en vanlig amerikansk public-cloud-region; det er samme miljø.'],
      ],
      feedback: {
        government:
          'Kravet navngir et separat miljø. Bekreftet berettigelse fritar ikke teamet fra å kontrollere tjenestene og konfigurasjonen.',
        'us-region':
          'Fysisk landplassering alene gjør ikke en public-cloud-region til Azure Government.',
        china:
          'Azure i Kina er et annet isolert miljø, drevet av 21Vianet, med andre operative grenser.',
      },
    },
    asymmetric: {
      objective: 'CA01',
      scenario: 1,
      label: 'En region peker til B, men B peker til C. Hva betyr det?',
      choices: [
        [
          'asymmetric',
          'Parrelasjonen kan være asymmetrisk; den definerer ikke i seg selv appkopier eller failover.',
        ],
        [
          'invalid',
          'B må behandles som en gjensidig partner til A selv om dokumentasjonen peker videre til C.',
        ],
        ['automatic', 'Parrelasjonene alene gir applikasjonen en tilgjengelig kopi i både B og C.'],
      ],
      feedback: {
        asymmetric:
          'Dette er en gyldig type regionpar. Undersøk tjenestens bruk av relasjonen separat.',
        invalid:
          'Azure dokumenterer asymmetriske par, blant annet Brazil South til South Central US.',
        automatic: 'Forbindelsen er metadata om et par, ikke en opprettet applikasjonsarkitektur.',
      },
    },
    facility: {
      objective: 'CA03',
      scenario: 2,
      label: 'Rack, lagring, nettverk, strøm og kjøling beskriver …',
      choices: [
        ['subscription', 'En Availability Zone som alltid består av nøyaktig dette ene anlegget'],
        ['pair', 'Hele regionen, uten skille mellom anlegg og regionale feilgrenser'],
        ['datacenter', 'Fysisk infrastruktur i et datacenter'],
      ],
      feedback: {
        datacenter: 'Et datacenter rommer både databehandlingsutstyr og støtteinfrastruktur.',
        subscription:
          'En Availability Zone kan omfatte flere slike anlegg. Utstyret og støttesystemene her beskriver et datacenter.',
        pair: 'Regionen samler datacenter-infrastruktur; den beskrevne bygningen er en mindre fysisk feilgrense.',
      },
    },
    grouping: {
      objective: 'CA03',
      scenario: 2,
      label: 'En Availability Zone grupperer …',
      choices: [
        ['groups', 'Én enkelt serververt, isolert fra andre verter i samme bygg'],
        ['facilities', 'Ett eller flere datasentre innenfor én region'],
        ['regions', 'Datacentre fordelt mellom to regioner som deler et regionpar'],
      ],
      feedback: {
        facilities:
          'Sonen grupperer fysisk infrastruktur med en egen feilgrense innenfor regionen.',
        regions: 'Flere regioner er et annet nivå enn soner i én region.',
        groups:
          'En vert er et lavere nivå. Sonen omfatter ett eller flere datasentre med uavhengig strøm, kjøling og nettverk.',
      },
    },
    fault: {
      objective: 'CA03',
      scenario: 2,
      label: 'Hvorfor er to bygninger ikke nok her?',
      choices: [
        [
          'shared-zone',
          'Begge ligger innenfor sonefeilens omfang; forskjellige bygninger beskytter ikke mot den beskrevne fellesfeilen.',
        ],
        [
          'one-building',
          'Fordi ulike bygningsnavn viser at begge må ligge i forskjellige regioner.',
        ],
        [
          'metadata',
          'Fordi en separat subscription må opprettes for at den andre bygningen skal tåle sonefeilen.',
        ],
      ],
      feedback: {
        'shared-zone':
          'Feilens omfang bestemmer hva som rammes. En mindre anleggsfeil og en hel sonefeil er forskjellige hendelser.',
        'one-building':
          'Bygningsnavn bestemmer ikke regionen. Her ligger begge anlegg innenfor den samme beskrevne sonen.',
        metadata:
          'En subscription er en administrativ grense. Den flytter ikke en bygning ut av den berørte fysiske sonen.',
      },
    },
  },
  summary: 'Part A-resultater · fysisk arkitektur, separat fra Part B',
  objectives: {
    CA01: 'Regioner, regionpar og sovereign environments',
    CA02: 'Availability Zones og konfigurasjonsvalg',
    CA03: 'Datasentre og fysisk feilgrense',
  },
  taught: 'Undervisningssjekker',
  guided: 'Veiledet feilundersøkelse',
  first: 'Første innlevering',
  noSubmission: 'Ingen innlevering ennå',
  criterionCount: 'Kriterier oppfylt',
  firstOutcome: 'Første uassisterte observasjon for dette målet',
  abandoned: 'Avbrutte forsøk',
  summaryLimit:
    'Dette er lokale, avgrensede oppgaveobservasjoner, ikke generell mestring, Microsoft Learn-fullføring, eksamensberedskap eller AZ-104/AZ-305-evidence. Retry overskriver ikke det første resultatet.',
  sources: 'Offisielle kilder og modellgrenser',
  sourceReview:
    'Kildene ble kontrollert 27. oktober 2026. Kvalifisert menneskelig SME-, UX-, skjermleser- og læringsvalidering er utestående.',
  mappingLabels: ['Subscription A · Zone 1', '→ B', 'Subscription B · Zone 1', '→ C'],
  mappingTitle: 'Eksempel: logiske tall er ikke fysiske adresser',
  mappingText:
    'Fiktiv mapping: Subscription A sin Zone 1 peker til fysisk B, mens Subscription B sin Zone 1 peker til fysisk C. Dette er et undervisningseksempel, ikke din Azure-mapping.',
  environmentNames: ['Azure public cloud', 'Azure Government', 'Azure in China · 21Vianet'],
  environmentDetails: [
    'Regionvalg og kontroller må møte faktiske krav. Public cloud kan støtte sovereignty-krav uten å være et separat isolert miljø.',
    'Isolert amerikansk miljø for kvalifiserte myndigheter og partnere. Egne operative krav og tjenestevariasjoner.',
    'Separat fysisk instans drevet av 21Vianet. Endepunkter og tjenestetilbud kan avvike.',
  ],
} as const;

export const managementNb = {
  accessTitle: 'Avklar lagret vurderingskontekst før undervisningen åpnes',
  accessText:
    'Forklarende innhold holdes tilbake mens en relevant vurderingskontekst kontrolleres eller er usikker. Les den aktuelle lagringen på nytt ved konflikt og åpne deretter undervisningen eller Journal igjen. Hjelp må være bekreftet lagret før et aktivt forsøk får se forklaringene. Ingen svarutkast eller tidligere innlevering slås sammen eller overskrives.',
  accessReload: 'Les lagret vurderingskontekst på nytt',
  accessReview: 'Åpne egen vurdering og lagringskontroll',
  accessContexts: {
    identity: 'Identity Foundations',
    resilience: 'Storage Part B',
    storage: 'Azure Storage Part A',
    connectivity: 'Networking Part B',
    networking: 'Networking Part A · selvstendig anvendelse',
    compute: 'Compute & Hosting · selvstendig anvendelse',
    cost: 'Cost Management · selvstendig anvendelse',
    transfer: 'Selvstendig Cloud Concepts-transfer',
    missions: 'Praktiske oppdrag',
    management: 'Core Architecture Part B',
    physical: 'Core Architecture Part A',
    serverless: 'Serverless',
    foundations: 'Foundations v1 (arkiv)',
    v2: 'Cloud Computing v2',
    legacyServices: 'Service Types v1 (arkiv)',
    benefits: 'Benefits',
    services: 'Service Types v2',
    practical: 'Praktisk independent lab',
  },
  ...architectureNb,
  storage:
    'Part B-lagringen er usikker. Part A og tidligere kurs-/Portal-data beholdes. Ved nektet lagring finnes nye handlinger bare i minnet.',
  reload: 'Les lagret Part B på nytt',
  repair: 'Reparer bare Part B-lagringen',
  repairTitle: 'Nullstille ugyldig Core Architecture Part B?',
  repairText:
    'Dette sletter bare den ugyldige eller ukjente Part B-registreringen. Part A, Foundations, Serverless, Benefits, Service Types, XP og Portal-ressurser beholdes. Avbryt/Escape beholder også Part B-dataene.',
  repairConfirm: 'Slett bare ugyldige Part B-data',
  limit:
    'Part B-historikken er full og beholdes lesbar. Nye øvelser og forsøk kan ikke registreres her. Et aktivt forsøk kan leveres med et komplett lagret utkast eller avbrytes. Åpnet undervisning registreres fortsatt som hjelp. Andre kurs og Portal fungerer videre; ingen tidligere resultater slettes.',
  loading: 'Laster validert Part B-historikk …',
  begin: 'Start selvstendig Part B-forsøk',
  submit: 'Lever alle Part B-svar',
  aidText:
    'Hjelp registrert. Undersøk ancestry, medlemskap og hosting, og skill administrativt scope fra fysisk plassering. Les de relevante Part B-enhetene. Dette forsøket er nå assistert.',

  hierarchyLimit:
    'AzureLabs undervisningsvisning av faktisk lokalt inventory. Dette er ikke en operativ Microsoft Portal-funksjon.',
  scopeNames: {
    root: 'Tenant root group',
    parent: 'Organisation',
    development: 'Development',
    production: 'Production',
    'dev-group': 'Development workload',
    'prod-group': 'Production workload',
    'dev-plan': 'Development plan',
    'prod-plan': 'Production plan',
    'dev-vm': 'Development VM',
    'prod-app': 'Production app',
  },
  targetNames: { plan: 'App Service plan', app: 'Web App', vm: 'Virtual machine' },
  directoryLabel: 'Microsoft Entra directory',
  relationLabels: {
    app: 'Web App',
    plan: 'App Service plan',
    group: 'Resource group',
    subscription: 'Subscription',
  },

  hierarchyTheory: [
    'Les strukturen fra identitetskontekst til scopes: Microsoft Entra directory → Tenant root management group → management groups → subscriptions → Resource groups → resources. Den første koblingen uttrykker directory-tilknytning; de administrative koblingene uttrykker ancestry eller medlemskap. Provider/type og location er egenskaper, ikke alternative management-parents.',
    'I Management Hierarchy velger du en faktisk node og følger dens direkte scope og ancestors. I Resource Relationships undersøker du hva en Web App eller VM teknisk trenger. En hostingpil gir ikke policy-inheritance. Geografi fra Part A er et tredje perspektiv: en region er verken subscriptionets parent eller child.',
    'Tom gruppe er fortsatt en gyldig administrativ beholder. En avvist operasjon legger ikke til en ressurs. Modellen leses på nytt fra replayet inventory etter opprettelse og reload; valg av node er navigasjon og gir ingen kompetanseregistrering.',
  ],
  scopeTheory: [
    'En policy definition beskriver en betingelse og effekt. En assignment tilordner den til et scope. Descendants kan ligge innenfor rekkevidden, men unntak og exemptions kan kvalifisere dette i ekte Azure. Type, mode og andre vilkår avgjør fortsatt om en ressurs er relevant. En regel for Microsoft.Web/serverfarms gjelder ikke automatisk en VM i samme gruppe.',
    'I vår avgrensede konseptmodell for nye create-forespørsler gir audit et funn uten blokkering, deny ville avvise et relevant brudd, og disabled evaluerer ikke regelen. Virkelig Azure Policy har flere effekter, moduser og evalueringsfaser. En deny sletter ikke automatisk eksisterende ressurser. Overlappende assignments vurderes etter sine betingelser; en child-regel erstatter ikke uten videre parent-regelen.',
    'Den faktiske AzureLab-policyen er en egendefinert deny på App Sandbox. Den gjelder støttede Web plan/app-typer utenfor West Europe. Gruppen kan ha metadata et annet sted. Den avviste kvitteringen viser assignment-scope og uendret inventory. Shared Sandbox ligger utenfor denne assignmenten. Konseptmodellen kan sammenligne en større scope eller annen effekt, men kan ikke skrive noen av valgene til Portalen.',
  ],
  assignmentDirect: 'Direkte assignment på denne noden',
  assignmentInherited: 'Assignment finnes i ancestry',
  assignmentOutside: 'Utenfor assignment-scope',

  part: 'Part B · Management infrastructure',
  available: 'Part A og B er tilgjengelige · resultater registreres separat',
  intro:
    'Forstå både fysisk Azure-infrastruktur og hvordan ressurser organiseres og styres. Part A og B danner ett kursområde med separate, versjonerte vurderinger.',
  prerequisite:
    'Forkunnskaper: Cloud Concepts, tjenestemodeller og Part A. Skill en konfigurert ressurs fra faktisk drift, og region fra administrativt scope.',
  objective:
    'CA04–07 · Resources, Resource groups, subscriptions, management groups og hierarchy. Ingen ny XP eller automatisk kompetanseoppgradering.',
  topics: {
    organization: 'Hvorfor et management-hierarki?',
    resources: 'Azure resources og providers',
    groups: 'Resource groups og livssyklus',
    subscriptions: 'Subscriptions og identitet',
    management: 'Management groups og root',
    hierarchy: 'Management Hierarchy Explorer',
    scope: 'Scope, policy og praktisk undersøkelse',
    'management-assessment': 'Part B · selvstendig anvendelse',
    'core-summary': 'Core Architecture · samlet resultat',
  },
  sections: {
    organization: {
      title: 'Først problemet: hvem eier hva?',
      paragraphs: [
        'Nordlys Drift har et utviklingsteam som eksperimenterer daglig, et produksjonsteam som drifter en bestillingstjeneste, og et plattformteam med felles infrastruktur. Uten bevisst organisering kan en teknisk gyldig ressurs havne under feil budsjett, eller en felles komponent bli forsøkt fjernet sammen med et midlertidig eksperiment. Flere regionsnavn løser ikke dette administrative problemet.',
        'Azure skiller mellom administrativt scope, identitet og fysisk plassering. Scope sier hvilke ressurser en administrativ tildeling kan nå. Identitet sier hvem som ber om tilgang. Region og Availability Zone beskriver geografisk plassering og feilgrenser. Strukturene kan beskrive samme ressurs uten å være samme relasjon.',
        'Vi skal følge faktiske ressurser i AzureLab, sammenligne medlemskap og avhengigheter, undersøke en avgrenset regel og bruke den ordinære Portalen. Et kortlivet demonstrasjonsmiljø kan ha felles livssyklus. En produksjonsdatabase bør ikke grupperes med demonstrasjonen bare fordi begge ligger i West Europe. Denne forskjellen er utgangspunktet for resten av Part B.',
      ],
      terms: [
        ['Scope', 'Omfanget en administrativ tildeling kan gjelde innenfor.'],
        ['Livssyklus', 'Når en ressurs opprettes, endres og avvikles.'],
      ],
      question: 'Hva trenger teamet å skille før ressursene organiseres?',
      choices: [
        ['separate', 'Identitet, administrativt ansvar og fysisk plassering.'],
        ['geography', 'Bare regionnavn; resten følger automatisk.'],
        ['automatic', 'Bare ressursnavn; navn konfigurerer styringen.'],
      ],
      feedback: {
        separate: 'Disse strukturene besvarer ulike spørsmål og må vurderes hver for seg.',
        geography: 'Regionvalg bestemmer ikke administrativt ansvar eller kostnadskontekst.',
        automatic: 'Et navn er nyttig for mennesker, men oppretter ikke policy eller tilgang.',
      },
      sources: ['AM02', 'AM09'],
    },
    resources: {
      title: 'Fra tjenestetype til faktisk ressurs',
      paragraphs: [
        'En Azure resource er en individuelt administrert instans representert gjennom Azure Resource Manager. En Virtual machine, dens Managed disk, et Virtual network, et App Service plan og en Web App er ulike ressurstyper. Resource Manager er administrasjonslaget. En resource provider implementerer operasjoner for en tjeneste. Microsoft.Compute/virtualMachines er provider-namespace og type, mens resource ID identifiserer en bestemt instans i dens scope.',
        'Konfigurasjon er ikke bevis på operativ drift. En akseptert VM-operasjon i AzureLab registrerer en modellert konfigurasjon og avhengigheter; den starter ikke et operativsystem eller måler trafikk. En Web App koblet til et plan beviser ikke at applikasjonskode er distribuert eller frisk. I ekte Azure er management/control-plane-operasjoner og faktisk bruk av tjenesten gjennom data plane forskjellige ting. AzureLab gjør ingen av delene mot Azure.',
        'De støttede arbeidslastressursene her tilhører Resource groups. Dette er ikke en universell regel for alle ARM-typer: også Resource groups, subscriptions og management groups er administrerbare ressursobjekter, og enkelte typer finnes på høyere scopes. En subnet er dessuten en underressurs av et Virtual network; dette betyr ikke at Resource groups kan nestes.',
        'En Web App trenger et App Service plan som hostingavhengighet. Gruppen inneholder ressursene for administrasjon. Medlemskap forklarer hvor noe administreres; hosting forklarer hva det trenger. Ekte Azure tillater enkelte avhengigheter på tvers av grupper når tjenesten støtter det. AzureLabs avgrensede Web-modell krever samme gruppe. Dette er en simulatorbegrensning, ikke en universell Azure-regel.',
      ],
      terms: [
        [
          'Resource provider',
          'Tjenestens navneområde og implementasjon av management-operasjoner.',
        ],
        ['Resource type', 'Typen objekt, for eksempel Microsoft.Web/sites.'],
        ['Resource ID', 'Identifikator for én ressurs med administrativ kontekst.'],
      ],
      question: 'Hva forteller Microsoft.Web/sites?',
      choices: [
        ['type', 'Provider og ressurstype, ikke om applikasjonen kjører.'],
        ['running', 'At applikasjonen kjører og er frisk.'],
        ['same', 'At alle Web Apps deler fysisk server.'],
      ],
      feedback: {
        type: 'Namespace/type beskriver hva som kan administreres. Drift må observeres separat.',
        running: 'En type eller vellykket lokal konfigurasjon beviser ikke kjørende kode.',
        same: 'Ressurstypen oppgir ikke fysisk plassering eller delt vert.',
      },
      sources: ['AM03', 'AM15', 'AM17'],
    },
    groups: {
      title: 'Resource groups: organiser etter livssyklus',
      paragraphs: [
        'En Resource group er en administrativ beholder for relaterte ressurser innenfor ett subscription. Hver av arbeidslastressursene som støttes her, tilhører én gruppe om gangen. Grupper kan ikke inneholde andre Resource groups. De gir et nyttig scope for administrasjon, relevante policy assignments og tilgangstildelinger. Medlemskap gir ikke automatisk alle brukere tilgang, arver ikke tags og oppretter ingen hostingavhengighet.',
        'Felles livssyklus betyr at ressursene forventes opprettet, endret og avviklet sammen. En midlertidig demonstrasjons Web App og dens dedikerte plan kan passe i samme gruppe. Et felles nettverk som flere varige tjenester trenger, kan ha en annen livssyklus. Gruppevalg krever derfor både oversikt over ansvar og eksplisitte tekniske avhengigheter.',
        'I ekte Azure vil sletting av en gruppe be om sletting av innholdet. Locks, backup-data, tillatelser og avhengigheter på tvers av grupper kan hindre eller komplisere resultatet. Det er ikke en ufarlig mappeoperasjon. AzureLab støtter bare den erklærte operasjonen for å slette tomme grupper, ikke en generell cascade-delete-øvelse.',
        'Gruppens Region brukes for metadata om gruppen. Den flytter ikke medlemmene. En gruppe med metadata i Norway East kan inneholde et App Service plan og en Web App i West Europe. Tjenestens egne lokasjonsregler gjelder fortsatt. ARM dokumenterer omruting av metadataforespørsler ved regional forstyrrelse; dette gir ingen generell garanti om applikasjonens tilgjengelighet, gjenopprettingstid eller datalagring.',
        'At to ressurser ligger i samme region, er derfor ikke alene et godt grupperingsprinsipp. Og at en Web App ligger i en gruppe, betyr ikke at den har et hostingplan. Det må finnes en reell, støttet planreferanse.',
      ],
      terms: [
        ['Membership', 'Ressursens administrative tilhørighet.'],
        [
          'Metadata-location',
          'Hvor metadata om gruppen lagres; ikke plasseringen til alle medlemmer.',
        ],
      ],
      question: 'Hva er et godt utgangspunkt for å gruppere et kortlivet eksperiment?',
      choices: [
        ['lifecycle', 'Beslektede ressurser som skal endres og avvikles sammen.'],
        ['region', 'Alle ressurser i samme region må dele gruppe.'],
        ['nested', 'Lag en Resource group inne i produksjonsgruppen.'],
      ],
      feedback: {
        lifecycle: 'Felles livssyklus og ansvar gir et begrunnet administrativt scope.',
        region: 'Én gruppe kan ha medlemmer i flere regioner; region er et annet begrep.',
        nested: 'Resource groups kan ikke nestes i hverandre.',
      },
      sources: ['AM03', 'AM05', 'AM16'],
    },
    subscriptions: {
      title: 'Subscription: riktig administrativ kontekst',
      paragraphs: [
        'Et subscription er en grense for ressursorganisering, governance, registrering av forbruk og tjenestegrenser. Resource groups tilhører subscriptions. Flere subscriptions kan skille arbeidslaster, miljøer, ansvar eller skaleringsbehov. Et gyldig navn og en tillatt region kompenserer ikke for feil subscription: ressursen vil tilhøre en annen administrativ og kostnadsmessig kontekst.',
        'Ett subscription har en tillitsrelasjon til én Microsoft Entra tenant for identitet. Én tenant kan være tilknyttet flere subscriptions. Directory inneholder identiteter; det er ikke en fakturakonto, en Resource group eller et fysisk datasenter. Azure-roller og Entra-roller har ulike ansvarsområder.',
        'Billing accounts, billing profiles og invoice sections avhenger av den kommersielle avtalen. Subscription er en enhet for forbruksregistrering, men innebærer ikke alltid én separat faktura. Å endre directory-tilknytning er heller ikke det samme som å endre fakturaeierskap. Her modelleres verken innlogging, fakturering, directory-overføring eller tilgangsadministrasjon.',
        'To subscriptions kan ha ressurser i samme region. Ett subscription kan inneholde ressurser i flere regioner. Administrativ oppdeling konfigurerer ikke fysisk feilseparasjon, replikering eller ruting. Velg riktig subscription først, deretter gruppe og støttet ressurskonfigurasjon. App Sandbox og Shared Sandbox er AzureLabs faktiske treningsscopes, ikke produksjonsabonnementer.',
      ],
      terms: [
        ['Subscription', 'Administrativt scope for ressurser, forbruk og styring.'],
        ['Microsoft Entra tenant', 'Identitetskontekst som et subscription er tilknyttet.'],
        ['Billing account', 'Kommersiell fakturakontekst, ikke et fysisk eller vanlig ARM-scope.'],
      ],
      question: 'Hvorfor må subscription velges selv når ressursen er teknisk gyldig?',
      choices: [
        ['context', 'Valget bestemmer administrativ og kostnadsmessig tilhørighet.'],
        ['physical', 'Hvert subscription er et separat datasenter.'],
        ['invoice', 'Hvert subscription gir alltid nøyaktig én separat faktura.'],
      ],
      feedback: {
        context: 'Teknisk validering og korrekt organisatorisk kontekst er forskjellige krav.',
        physical: 'Subscriptions er logiske administrative grenser, ikke datasentre.',
        invoice: 'Fakturagruppering avhenger av avtale og billing-struktur.',
      },
      sources: ['AM08', 'AM13', 'AM14'],
    },
    management: {
      title: 'Management groups: styr flere subscriptions',
      paragraphs: [
        'Management groups samler subscriptions under felles governance-scopes. De kan inneholde andre management groups og subscriptions. Hvert management group og subscription har én parent i dette hierarkiet, mens et management group kan ha flere children. Ressursene nås gjennom sine subscriptions og grupper; de plasseres ikke fysisk i et management group.',
        'En tenant har én Tenant root management group over sine management groups og subscriptions. Directory vises sammen med root for orientering, men Directory er identitetskontekst og root er et management group. I ekte Azure tilsvarer root-gruppens ID tenant-ID-en. AzureLabs root-lab er en lokal forenkling. En Entra-administrator har ikke dermed automatisk alle Azure-ressursrettigheter; Azure-roller og Entra-roller er forskjellige.',
        'Tildelinger på et management group kan rekke ned til underliggende scopes. Dette forenkler felles styring, men gir større konsekvenser ved feil. En regel for én utviklings-subscription bør ikke uten videre legges på root. En grunn, gjennomtenkt struktur er enklere å forstå enn en direkte kopi av hele organisasjonskartet. Regioner er heller ikke automatisk riktig management-struktur.',
        'Learning har både App Sandbox og Shared Sandbox under seg i AzureLab. Det oppretter ikke et felles nettverk eller en Availability Zone. Den faktiske, avgrensede Web-location-policyen er tilordnet App Sandbox, ikke Learning eller Tenant root group. Shared Sandbox er derfor utenfor akkurat denne tildelingen. Hypotetisk større scope kan undersøkes uten å endre den reelle policyen.',
      ],
      terms: [
        ['Tenant root group', 'Øverste management group innenfor tenantens hierarki.'],
        [
          'Inheritance',
          'En overordnet tildeling kan være relevant for underliggende scopes; vilkår og effekt må fortsatt vurderes.',
        ],
      ],
      question: 'Hvilken struktur beskriver management-hierarkiet riktig?',
      choices: [
        [
          'parent',
          'Én parent per subscription/management group; et management group kan ha flere children.',
        ],
        ['network', 'Felles management group oppretter nettverk mellom alle ressursene.'],
        ['automatic', 'En regel på parent avviser automatisk alle ressurstyper.'],
      ],
      feedback: {
        parent: 'Dette gir en entydig administrativ ancestry. Root er øverst.',
        network: 'Administrativ ancestry er ikke nettverkstilkobling.',
        automatic: 'Scope gir rekkevidde, men type, betingelse og effekt avgjør konsekvensen.',
      },
      sources: ['AM04', 'AM07', 'AM12'],
    },
  },
  questions: {
    subscription: {
      scenario: 0,
      label: 'Hvilket subscription oppfyller oppdraget?',
      choices: [
        ['development', 'Utviklings-subscriptionet; det godtar samme ressurs.'],
        ['production', 'Det utpekte produksjons-subscriptionet.'],
        ['region', 'Et hvilket som helst subscription i riktig region.'],
      ],
      feedback: {
        production: 'Ressursen må ligge innenfor det eksplisitt avtalte produksjonsansvaret.',
        development: 'Teknisk validering oppfyller ikke kravet til organisatorisk scope.',
        region: 'Region og subscription besvarer ulike krav.',
      },
    },
    subscriptionReason: {
      scenario: 0,
      label: 'Hvorfor er valget nødvendig?',
      choices: [
        ['invoice', 'Fordi ett subscription alltid gir én egen faktura.'],
        ['physical', 'Fordi subscriptions alltid ligger på ulike fysiske steder.'],
        ['boundary', 'For å følge styrings-, ressurs- og kostnadskonteksten.'],
      ],
      feedback: {
        boundary: 'Administrativ korrekthet er en egen dimensjon ved siden av teknisk gyldighet.',
        invoice: 'Billing-avtaler kan samle eller dele fakturering på andre måter.',
        physical: 'Fysisk feilseparasjon krever egne plassering-/arkitekturvalg.',
      },
    },
    lifecycle: {
      scenario: 1,
      label: 'Hvilken gruppering passer best?',
      choices: [
        ['all', 'Flytt den delte planen til appens gruppe og avvikle begge ved kampanjeslutt.'],
        ['separate-app', 'Egen gruppe for kampanjeappen; behold delt plan i plattformgruppen.'],
        ['location', 'Samle alle komponentene i én gruppe fordi de ligger i West Europe.'],
      ],
      feedback: {
        'separate-app':
          'Appen kan avvikles uten at planen som fortsatt hoster to andre apper følger dens livssyklus. Teknisk hosting er ikke krav om felles Resource group. Dette er et konseptvalg; AzureLabs avgrensede create-lab krever app og plan i samme gruppe.',
        all: 'Planen skal fortsatt hoste to andre apper. Appens avviklingsbehov kan ikke brukes som planens livssyklus.',
        location: 'Felles region krever ikke felles administrativ gruppe eller felles avvikling.',
      },
    },
    lifecycleReason: {
      scenario: 1,
      label: 'Hvorfor følger ikke planen kampanjeappens avvikling?',
      choices: [
        [
          'shared-lifetime',
          'Planen har fortsatt andre forbrukere; gruppemetadata flytter ikke deres hosting.',
        ],
        ['relocate', 'Alle medlemmer blir fysisk flyttet dit.'],
        ['hosting', 'Den oppretter automatisk hosting mellom app og plan.'],
      ],
      feedback: {
        'shared-lifetime':
          'Vurder faktisk deling og livssyklus, ikke bare en tegnet avhengighet. Gruppens metadata-region bestemmer verken planens plassering eller når andre apper skal avvikles.',
        relocate: 'Metadata-location flytter ikke ressurser.',
        hosting: 'Hosting krever en eksplisitt gyldig planreferanse.',
      },
    },
    assignment: {
      scenario: 2,
      label: 'Hvilke subscriptions ligger innenfor assignmentets rekkevidde?',
      choices: [
        ['both', 'Både Production og Research fordi de deler Tenant root group.'],
        ['none', 'Ingen, siden policy bare kan tilordnes Resource groups.'],
        ['platform', 'Production under Platform; ikke Research under søstergruppen.'],
      ],
      feedback: {
        both: 'En assignment på Platform arves nedover den grenen, ikke opp til root og videre ned i en søstergren.',
        none: 'Policy kan blant annet tilordnes management group- og subscription-scopes.',
        platform:
          'Production har Platform i sin ancestry; Research har bare den felles rooten, ikke Platform.',
      },
    },
    effect: {
      scenario: 2,
      label: 'Hvordan vurderes de tre beskrevne create-forespørslene av akkurat denne regelen?',
      choices: [
        ['deny-all', 'Alle avvises; deny på et management group gjelder hele directoryet.'],
        [
          'conditions',
          'Ingen av de tre avvises av denne regelen: location, type og ancestry gir ulike avgrensninger.',
        ],
        ['web', 'Bare Web-planen i Production avvises fordi West Europe ikke er tillatt.'],
      ],
      feedback: {
        conditions:
          'Production-VM-en er i tillatt North Europe; Web-planen der matcher ikke VM-typen; Research-VM-en er utenfor Platform-grenen. Andre regler kan fortsatt gjelde. Dette er ikke AzureLabs faktiske Web-deny.',
        'deny-all':
          'Deny gjelder først når assignmentets ancestry og alle vilkårene matcher. Søsken-grener omfattes ikke automatisk.',
        web: 'Location alene er utilstrekkelig: denne regelen retter seg mot Microsoft.Compute/virtualMachines, ikke Microsoft.Web/serverfarms.',
      },
    },
    physical: {
      scenario: 3,
      label: 'Hvilket prinsipp adresserer den beskrevne fysiske feilen?',
      choices: [
        ['subscriptions', 'To subscriptions alene, uten å endre plassering.'],
        ['groups', 'To Resource groups med samme ressurser i én sone.'],
        [
          'zones',
          'Adskilte soner med riktig konfigurert redundans og alle nødvendige avhengigheter.',
        ],
      ],
      feedback: {
        zones:
          'Fysisk feilgrense må møtes av en faktisk egnet arkitektur. Et enkelt navn eller scope er ikke nok.',
        subscriptions: 'Administrativ oppdeling flytter ikke komponentene.',
        groups: 'Grupper er ikke fysiske feilgrenser.',
      },
    },
    relation: {
      scenario: 3,
      label: 'Hvordan leser du identitet, styring og hosting korrekt?',
      choices: [
        [
          'distinct',
          'Directory gir identitetskontekst; grupper gir medlemskap; appens planreferanse gir hosting.',
        ],
        ['same', 'Alle pilene betyr samme fysiske plassering.'],
        ['identity', 'Directory er en ekstra region over subscriptions.'],
      ],
      feedback: {
        distinct: 'Dette skiller de ulike relasjonenes mening og konsekvenser.',
        same: 'Administrative og tekniske piler beskriver ikke automatisk geografi.',
        identity: 'Directory er ikke en fysisk region.',
      },
    },
  },
  scenarios: [
    {
      title: 'A · Produksjonsansvar',
      text: 'Et logistikkteam skal opprette en støttet ressurs for produksjon. Organisasjonen har utpekt Production som riktig subscription med egne budsjetter og styringskrav. Development ville også akseptert samme tekniske konfigurasjon.',
    },
    {
      title: 'B · Kampanje på delt hosting',
      text: 'En kampanjeapp skal avvikles etter en måned. Den bruker en eksisterende App Service plan som også hoster to varige apper og fortsatt må drives av plattformteamet. Alle ligger i samme subscription og West Europe; de støttede hostingvilkårene er oppfylt. Planen ligger allerede i en plattformgruppe. Den nye appgruppens metadata-location foreslås satt til North Europe. Vurder virkelig Azure-organisering; lokal create-lab støtter bare app og plan i samme gruppe.',
    },
    {
      title: 'C · Les en hypotetisk regel',
      text: 'Tenant root group har to søstergrupper: Platform med subscription Production, og Laboratory med subscription Research. Bare Platform har en hypotetisk deny-assignment: Microsoft.Compute/virtualMachines må ha location North Europe. Tre create-forespørsler undersøkes: en VM i Production/North Europe, et Web-plan i Production/West Europe, og en VM i Research/West Europe. Ingen andre regler inngår i oppgaven. Dette endrer ikke AzureLabs faktiske policy.',
    },
    {
      title: 'D · Sykehusets feilgrense',
      text: 'Et sykehus vil at en tjeneste skal tåle en hendelse som rammer én hel Availability Zone. Et forslag er bare å dele ressursene mellom to subscriptions og grupper, uten å endre fysisk plassering eller avhengigheter.',
    },
  ],
  journal: 'Core Architecture · felles Knowledge Journal',
  summary: 'Samlede, versjonerte observasjoner fra Part A og B',
  objectives: {
    CA04: 'Resources og Resource groups',
    CA05: 'Subscriptions',
    CA06: 'Management groups',
    CA07: 'Hierarchy og relasjonstyper',
  },
  guided: 'Veiledet scope- og ressursundersøkelse',
  assessmentIntro:
    'Fire nye situasjoner. Velg både en handling og dens begrunnelse. Første besvarelse beholdes. Journal, Summary og annen undervisning under et aktivt forsøk registreres som hjelp. Ingen automatisk løsningsveiledning vises.',
  hierarchyTitle: 'Azure Management Hierarchy Explorer',
  identity: 'Identitetskontekst · ingen ekstra ARM-parent',
  live: 'Faktisk replayet simulatorinventory',
  empty:
    'Ingen ressurser her ennå. Opprett dem i den ordinære Portalen; vi legger ikke til eksempelressurser i inventory.',
  selected: 'Valgt node',
  ancestors: 'Direkte scope → overordnede scopes',
  membership: 'Management Hierarchy',
  relationships: 'Resource Relationships',
  location: 'Location / gruppemetadata',
  policyTitle: 'Faktiske policy assignments',
  policyLimit:
    'Den faktiske egendefinerte deny gjelder App Sandbox og støttede Web-typer utenfor West Europe. Den er ikke tilordnet Learning. Her endres ingen policies.',
  portal: 'Åpne i ordinær Portal',
  expand: 'Åpne/lukk',
  noSelection: 'Velg en node for å undersøke type og ancestry.',
  relationsLimit:
    'Hosting og andre avhengigheter er separate fra group membership. En subnet er en underressurs av et Virtual network, men dens gruppe er fortsatt et administrativt scope. Ingen pil beviser nettverkstrafikk eller kjørende kode.',
  relationQuestion: 'Du har undersøkt faktisk Web App, gruppe og plan. Hva beskriver relasjonene?',
  relationChoices: [
    ['distinct', 'Gruppen gir administrativt medlemskap; appens referanse til plan gir hosting.'],
    ['same', 'Begge relasjonene betyr at ressursene er på samme fysiske server.'],
  ],
  relationFeedback:
    'Sammenlign app → group med app → plan. Ressurs-ID-ene kommer fra faktisk inventory; dette er veiledet praksis, ikke selvstendig vurdering.',
  scopeTitle: 'Scope & Policy Explorer',
  concept:
    'Ren konseptmodell · hypotetiske create-forespørsler · ingen Portal-endring eller kvittering',
  task: 'Forutsi konsekvensen før du kjører. Undersøk først Development + deny for et Web plan. Sammenlign deretter Organisation + audit, og forklar hvorfor scope alene ikke avgjør utfallet.',
  steps: [
    'Les faktisk hierarki og skill medlemskap fra hosting.',
    'Forutsi og kjør en avgrenset deny i Development.',
    'Sammenlign et overordnet audit-scope og les typevilkårene.',
    'Bruk faktisk Portal-lab og undersøk ressursrelasjoner før selvstendig vurdering.',
  ],
  scopeLabel: 'Assignment scope',
  targetLabel: 'Target resource type',
  effectLabel: 'Effect',
  allowedLabel: 'Tillatt location i modellen',
  prediction: 'Forutsig antall avviste forespørsler',
  run: 'Kjør scope-modellen',
  pendingPrediction: 'Velg 0–4. Resultatet vises først etter kjøring.',
  result: 'Sist lagrede modellobservasjon',
  unchanged: 'Kontrollene er endret. Tabellen gjelder den lagrede kjøringen, ikke de nye valgene.',
  row: 'Ressurs',
  inScope: 'Innenfor scope',
  typeMatch: 'Type matcher',
  condition: 'Utenfor tillatt location',
  outcome: 'Konsekvens',
  yes: 'Ja',
  no: 'Nei',
  statuses: {
    outside: 'Utenfor scope',
    'other-type': 'Annen type',
    disabled: 'Ikke evaluert',
    compliant: 'Vilkår ikke oppfylt',
    finding: 'Audit-funn · ikke blokkert',
    denied: 'Ville blitt avvist',
  },
  explain: 'Hvorfor kan to ressurser innenfor samme scope få ulikt resultat?',
  explainChoices: [
    ['conditions', 'Type, regelbetingelse og effekt vurderes i tillegg til ancestry.'],
    ['all', 'Alle descendants avvises uansett regel.'],
    ['physical', 'Scope bestemmer fysisk region.'],
  ],
  explainFeedback: {
    conditions: 'Riktig årsak: rekkevidde er nødvendig, men ikke tilstrekkelig for en deny.',
    all: 'Deny krever en relevant regel og oppfylt betingelse. Audit blokkerer ikke.',
    physical: 'Administrativ ancestry er ikke geografi.',
  },
  witnesses: [
    'Subscription-avgrenset deny undersøkt',
    'Overordnet audit sammenlignet',
    'Faktisk medlemskap og hosting forklart',
  ],
  guidedDone: 'Veiledet Part B-undersøkelse registrert. Dette er ikke selvstendig mestring.',
  brief: {
    title: 'SavvyShark · Hvem administrerer hva?',
    why: 'Du skal følge ressurser fra Directory til workload og skille administrativ styring fra fysisk plassering og hosting. Vi sammenligner en ren scope-modell med faktisk AzureLab-inventory.',
    observe:
      'Se på ancestry, typevilkår og effekt. En hypotetisk audit endrer ikke simulatorens faktiske App Sandbox-deny. Start åpner kontrollene; Avbryt lukker uten registrering.',
    consequence: 'Start/Avbryt oppretter ingen ressurser, vurderinger eller XP.',
  },
  start: 'Start veiledet undersøkelse',
  briefOpen: 'Åpne oppdraget igjen',
  actualGuide:
    'Velg scope og type, gjør en prediksjon og kjør. Les per-ressurs-resultatet før du sammenligner. Faktisk inventory undersøkes i Hierarchy Explorer.',
  milestones: {
    relation: {
      title: 'Medlemskap er ikke hosting',
      text: 'Den faktiske Web App har både en administrativ gruppe og en eksplisitt planreferanse. Dette er to ulike relasjoner. Ingen av dem beviser fysisk samlokalisering eller kjørende kode.',
    },
    policy: {
      title: 'Et avslag har et faktisk scope',
      text: 'Den replayede kvitteringen viser policy-web-location på App Sandbox. Den avviste konfigurasjonen opprettet ingen ressurs. Gruppens metadata-location endrer ikke Web-regelens ressursbetingelse.',
    },
  },
  milestoneLimit:
    'Historiske observasjoner er ikke nye tekniske kvitteringer eller uavhengig kompetanse.',
  portalBridge: 'Praktisk bro · bruk den eksisterende PaaS-labben',
  portalWhy:
    'Opprett eller gjenbruk en riktig gruppe i App Sandbox, undersøk et faktisk policyavslag og hostingrelasjonen etter korrigering. Dette øver scope i en støttet operasjon; det utvider ikke policy-motoren.',
  portalStart: 'Start eller fortsett faktisk Portal-lab',
  debrief: 'Tilbake fra Portal · undersøk faktisk resultat',
  debriefLimit:
    'Bare gyldig inventory og replayede kvitteringer gir tekniske observasjoner. Et tidligere gjennomført labforløp er fortsatt veiledet arbeid, ikke ny Part B-vurdering.',
  noPolicy: 'Ingen faktisk policy-deny er registrert i gjeldende simulatorforsøk.',
  observePolicy: 'Undersøk faktisk policykvittering',
  fullModule:
    'Hele Core Architecture: undervisning og praksis må vurderes sammen med hvert dels separate selvstendige resultat.',
  partA: 'Part A · fysisk infrastruktur',
  partB: 'Part B · administrativ struktur',
  notComplete: 'Ikke tilstrekkelig dokumentert ennå',
  boundedComplete: 'Alle avgrensede kriterier dokumentert i begge deler',
  resumeB: 'Fortsett Part B',
  summaryLimit:
    'Dette viser lokale, versjonerte og avgrensede observasjoner. Guided, første uassisterte resultat og retry er forskjellige. Ingen Microsoft Learn-fullføring, eksamensberedskap eller ny XP utledes.',
  sourceReview:
    'Offisielle kilder kontrollert 27. oktober 2026. Menneskelig SME-, UX-, skjermleser- og læringsvalidering er utestående.',
} as const;
export const missionsNb = {
  title: 'Praktiske oppdrag · fra forklaring til undersøkelse',
  intro:
    'Fire ulike oppdrag bygger på Benefits og Service Types. Undersøk reell lokal konfigurasjon, forklar konsekvensene og skill veiledet arbeid fra et nytt selvstendig forsøk.',
  start: 'Les SavvySharks oppdragsbrief',
  launch: 'Start oppdraget',
  cancel: 'Avbryt',
  recall: 'Se oppdraget igjen',
  resume: 'Fortsett oppdraget',
  independent: 'Start endret selvstendig oppdrag',
  independentMode: 'Selvstendig oppdrag',
  guided: 'Veiledet oppdrag',
  unaided: 'Uten registrert hjelp',
  aided: 'Assistert forsøk',
  retry: 'Start et nytt øvingsforsøk',
  return: 'Tilbake til oppdraget i kurset',
  portal: 'Arbeid i den ordinære Portalen',
  open: 'Åpne oppdraget',
  prerequisite: 'Før du begynner',
  purpose: 'Hvorfor dette følger etter teorien',
  objectives: 'Dette skal du utvikle',
  steps: 'Slik undersøker du problemet',
  observe: 'Hva teller som en observasjon?',
  briefingNotice:
    'Start oppretter bare en avgrenset lokal oppdragsøkt. Du sender selv alle tekniske kommandoer. Avbryt eller lukking starter ingenting og gir ingen progresjon, XP eller ressurser.',
  boundary:
    'AzureLab registrerer lokal konfigurasjon og avgrensede modellobservasjoner. Ingen handling når Azure; konfigurasjon beviser ikke drift, sikkerhet, compliance eller eksamensberedskap.',
  legacy: 'Eksisterende grunnlab · separat tidligere læringskontrakt',
  activeElsewhere:
    'Du har et aktivt oppdrag. Fortsett det, eller avbryt det eksplisitt før du starter et annet. Gyldige ressurser og tidligere innleveringer beholdes.',
  blocked:
    'En lærings- eller teknisk kontekst er aktiv eller usikker. Fullfør/avbryt vurderingen, eller last inn den aktuelle konteksten på nytt. Ingen reset av hele miljøet er nødvendig.',
  loading: 'Kontrollerer oppdrag og teknisk kontekst …',
  storage:
    'Oppdragslagringen er usikker. Svar og observasjoner er ikke nødvendigvis lagret. Ikke lukk siden før du har avklart dette.',
  memory:
    'Endringer finnes bare i denne fanens minne. De er ikke varig lagret og kan ikke brukes til å godkjenne uassistert undervisningshjelp.',
  reload: 'Last inn oppdragsdata på nytt',
  reloadContext: 'Last inn bare denne konteksten',
  reviewContext: 'Åpne kontekstens eksisterende recovery eller vurdering',
  recoveryContexts: {
    identity: 'Identity Foundations',
    resilience: 'Storage Part B',
    storage: 'Azure Storage Part A',
    connectivity: 'Networking Part B',
    networking: 'Networking Part A',
    missions: 'Practical Missions v1',
    transfer: 'Cloud Concepts-transfer',
    cost: 'Cost Management',
    compute: 'Compute & Hosting',
    management: 'Core Architecture Part B',
    physical: 'Core Architecture Part A',
    serverless: 'Serverless',
    foundations: 'Foundations v1',
    v2: 'Foundations v2',
    portal: 'Tidligere Portal-vurdering',
    benefits: 'Benefits',
    services: 'Service Types',
    practical: 'Tidligere praktisk lab',
    course: 'Kurskontekst',
    technical: 'Portal-ressurser og kvitteringer',
  },
  recover: 'Gjenopprett bare ugyldige oppdragsdata',
  confirm: 'Bekreft isolert gjenoppretting',
  recovery:
    'Dette fjerner bare den samme ugyldige oppdragsregistreringen. Nyere gyldige data, Portal, andre kurs og XP skal beholdes.',
  unverified:
    'Det tekniske forsøket eller referansene kan ikke verifiseres. Tidligere svar beholdes. Last inn riktig kontekst eller avbryt dette forsøket før et nytt; ikke tilskriv det fullføring.',
  selected: 'Valgt faktisk ressurs',
  choose: 'Velg en ressurs fra gjeldende inventory',
  select: 'Bruk denne ressursen i oppdraget',
  noSubject:
    'Ingen egnet ressurs finnes ennå. Opprett den selv gjennom støttede Portal-kontroller. Ingen eksempelressurs legges til automatisk.',
  createPlatform:
    'Begynn med Resource groups → Create, deretter App Service plans → Create og App Services → Create. Velg samme gruppe for plan/app i denne modellen og en planlokasjon tillatt av den faktiske Web-policyen. Velg deretter appen som oppdragets ressurs.',
  createVm:
    'Begynn med Resource groups → Create ved behov, deretter Virtual machines → Create. Følg oppdragets gjeste-, disk- og subscription-krav før Review + create. Velg den opprettede VM-en som oppdragets ressurs.',
  reused: 'Gjenbrukt konfigurasjon · ikke nyopprettet av dette oppdraget',
  fresh: 'Opprettet etter oppdragets tekniske startgrense',
  inspected: 'Observasjon registrert',
  inspect: 'Bekreft observasjonen i denne visningen',
  inspectResource: 'Undersøk faktisk ressurs',
  inspectReceipt: 'Undersøk faktisk kvittering',
  inspectPolicy: 'Undersøk faktisk policy',
  actual: 'Faktiske tekniske observasjoner',
  receipt: 'Operation receipt',
  commandBoundary: 'Teknisk startgrense',
  emptyBoundary: 'Før første kommando',
  attempt: 'Teknisk forsøk',
  noReceipts: 'Ingen kvitteringer er ennå knyttet til valgt oppdragsressurs.',
  now: 'Gjør dette nå',
  where: 'Hvor finner du kontrollen?',
  why: 'Hvorfor er dette relevant?',
  expect: 'Dette skal du observere',
  observed: 'Dette har simulatoren registrert',
  minimize: 'Minimer oppdragsveiledningen',
  expand: 'Åpne oppdragsveiledningen',
  help: 'Åpne undervisningshjelp · registrerer assistanse',
  abandon: 'Avbryt oppdragsforsøket · behold ressurser',
  reflect: 'Forklar beslutningen og konsekvensen',
  submit: 'Lever oppdragsrefleksjonen',
  draftSaved:
    'Svarutkastet følger dette forsøket. Innlevering fryser resultatets tekniske gjennom-ID; retry overskriver ikke første besvarelse.',
  capacity:
    'Oppdragsloggen har nådd grensen for vanlig arbeid. Manglende sluttsvar kan fortsatt fylles inn én gang; du kan levere eller avbryte trygt. Ingen eldre registreringer fjernes for å gi plass.',
  result: 'Oppdragsdebrief · verifiserbare observasjoner',
  complete: 'Kriteriene for dette avgrensede oppdraget er oppfylt',
  incomplete: 'Oppdraget har gjenstående kriterier',
  abandoned: 'Forsøket er avbrutt; gyldig teknisk arbeid beholdes',
  yes: 'Registrert',
  no: 'Gjenstår',
  history: 'Tidligere innleveringer og avbrudd',
  first: 'Første innlevering beholdes uendret. Veiledet resultat er ikke selvstendig kompetanse.',
  initial: 'Første innleveringsforsøk i denne modusen',
  attemptRetry: 'Nytt forsøk etter tidligere innlevering · erstatter ikke den første',
  rationale: 'Begrunnelser for alternativene · vises etter innlevering',
  next: 'Neste steg: bruk modulens selvstendige vurdering, eller prøv den endrede oppdragsvarianten. Oppdraget gir ingen ny XP og endrer ikke tidligere modulkriterier.',
  criteria: {
    subject: 'Faktisk egnet ressurs valgt',
    attachments: 'Relevante faktiske ressurser inspisert',
    newBuild: 'Ny VM opprettet etter startgrensen',
    receipt: 'VM-opprettelsens kvittering undersøkt',
    requirements: 'Image, profil, datadisk og subscription følger oppdraget',
    contrast: 'To påkrevde årsakskontraster kjørt i den eksplisitte konseptmodellen',
    denied: 'Nytt faktisk Web-policyavslag',
    corrected: 'Senere korrigert plan i samme gruppe og riktig subscription',
    newApp: 'Ny app på den korrigerte planen',
    scopeInspection: 'Subscription, gruppe, hosting og faktisk policy undersøkt',
    receipts: 'Begge relevante kvitteringer undersøkt',
    maintenance: 'Ny read-only-konfigurasjon lagret',
    restoration: 'Senere standard-konfigurasjon lagret på samme app',
    production: 'Ny production/standard Apply på valgt app',
    staging: 'Ny staging/read-only Apply på en annen faktisk app',
    isolation: 'To forskjellige apper på samme faktiske plan med ulike appinnstillinger',
    draft: 'Et faktisk endret, ikke anvendt vedlikeholdsutkast observert',
    decision: 'Faglig beslutning begrunnet',
    reason: 'Konsekvens og grenser forklart',
    metadata: 'Gruppemetadata og Web-lokasjon skilt',
    typeCounterexample: 'Ny VM utenfor West Europe demonstrerer Web-regelens typeavgrensning',
  },
  model: {
    title: 'Dependency Failure Investigation',
    vm: 'VM',
    disk: '↳ OS disk',
    network: '↳ NIC → subnet',
    limit:
      'Dette forsøket har 24 lagrede modellkjøringer. Du kan fortsatt inspisere, forklare og levere eller avbryte; et nytt forsøk overskriver ikke disse observasjonene.',
    note: 'Separat konseptmodell med referanser til din VM. Ingen ressurs feiler i Portalen. Vi antar at hvert erklært spor har fungerende kode og egne OS-disker/NIC-er; bare den valgte avhengigheten og rutingsregelen undersøkes. Ingen målt trafikk, failover, SLA eller sannsynlighet.',
    failure: 'Hypotetisk feil på spor 1',
    copies: 'Antall erklærte spor',
    isolation: 'Subnet-avhengighet for spor 2',
    routing: 'Erklært ruting',
    prediction: 'Forutsi brukbare spor etter feilen',
    choose: 'Velg 0, 1 eller 2 før kjøring',
    run: 'Kjør den konseptuelle feilmodellen',
    result: 'Sist lagrede modellobservasjon',
    path: 'Erklært spor',
    affected: 'Rammet av valgt feil',
    routed: 'Kan motta arbeid etter erklært ruting',
    usable: 'Brukbare spor',
    available: 'Teknisk upåvirkede spor',
    predicted: 'Din prediksjon',
    actual: 'Beregnet under disse antakelsene',
    stale:
      'Kontrollene er endret. Tabellen under gjelder fortsatt det lagrede input-snapshotet; gjør en ny prediksjon før kjøring.',
    failures: {
      os: 'OS-disk på spor 1 utilgjengelig',
      nic: 'NIC på spor 1 utilgjengelig',
      subnet: 'Subnet-avhengigheten på spor 1 utilgjengelig',
    },
    isolations: {
      shared: 'Samme subnet-avhengighet som spor 1',
      independent: 'Separat erklært subnet-avhengighet',
    },
    routings: { single: 'Bare spor 1 mottar arbeid', balanced: 'Begge spor kan motta arbeid' },
    yes: 'Ja',
    no: 'Nei',
    unused: 'Upåvirket, men ikke tilkoblet rutingen',
    explain:
      'Resultatet følger hele den erklærte kjeden. Et upåvirket spor hjelper ikke når rutingen fortsatt peker bare mot det tapte sporet. Ved delt subnet kan begge spor miste samme nødvendige avhengighet. Disse antakelsene oppretter ingen replika eller ruting i AzureLab.',
  },
  milestone: {
    title: 'En teknisk observasjon har en grense',
    settings:
      'To aksepterte SetAppSettings-kvitteringer viser vedlikeholdsverdi og senere gjenopprettet verdi på samme app. Dialogens Apply lagret bare et utkast. Verken kvitteringene eller de lagrede verdiene beviser at applikasjonen leste dem eller kjører.',
    diagnosis:
      'Den erklærte modellen ga ulike resultater da avhengighet eller ruting ble endret. En ekstra compute-kopi alene fjernet ikke hele feilbanen. Portalressursene er uendret; dette er en konseptuell undersøkelse, ikke målt tilgjengelighet.',
    recall: 'SavvyShark · gjenåpne oppdragsobservasjonen',
  },
  guidance: {
    choose: [
      'Velg en faktisk ressurs',
      'Åpne Virtual machines eller App Services; velg ressursen og bruk oppdragsknappen i veiledningen.',
      'Oppdraget må knyttes til en faktisk ressurs-ID. Gjenbruk merkes som gjenbruk, ikke nyopprettelse.',
    ],
    build: [
      'Bygg konfigurasjonen som kravene beskriver',
      'Bruk Resource groups ved behov og deretter tjenestens Create → Basics/Disks/Networking → Review + create → Create.',
      'Review validerer uten opprettelse. Bare din Create sender en kommando; bundle-kvitteringen må vise aksepterte avhengigheter.',
    ],
    inspect: [
      'Følg de faktiske referansene',
      'Åpne ressursene og de aktuelle Activity log-kvitteringene via oppdragslenkene. Bekreft observasjonen i den faktiske visningen.',
      'En relation viser tilknytning. Se OS-/datadisk, NIC/subnet eller app/plan og skill dette fra drift.',
    ],
    deny: [
      'Undersøk den avgrensede Web-regelen',
      'Åpne App Sandbox og Resource group; send selv planforespørselen utenfor West Europe og les Activity log → den avviste operasjonen → Policy.',
      'Avslag må ha korrekt måltype og scope, uendret revision og ingen ny ressurs. Gruppemetadata er en annen egenskap.',
    ],
    correct: [
      'Korriger ressurslokasjonen, og bekreft resultatet',
      'App Service plans → Create i samme gruppe; velg en location som den faktiske policyen tillater. Opprett så Web App på den aksepterte planen.',
      'Akseptert plan og app må følge det nye avslaget. En historisk ressurs eller annen akseptert kommando er ingen ny korreksjon.',
    ],
    settings: [
      'Skill utkast fra Apply',
      'Valgt Web App → Environment variables → App settings → Edit → Apply i dialogen (bare utkast). Velg deretter Apply på hovedsiden selv for å sende kommandoen.',
      'Oppdragsobservasjonen registrerer et endret utkast; den faktiske lagrede verdien nedenfor endres først når SetAppSettings aksepteres.',
    ],
    restore: [
      'Gjenopprett standard og sammenlign kvitteringene',
      'Samme apps Environment variables: endre CATALOG_MODE til standard, behold oppdragets environment og velg Apply. Undersøk begge Activity log-operasjoner.',
      'To ordnede aksepterte oppdateringer viser read-only → standard. Verken dette eller en draft beviser kjørende kode.',
    ],
    model: [
      'Returner og undersøk den erklærte feilmodellen',
      'Tilbake til oppdraget i kurset → Dependency Failure Investigation. Velg antakelser, forutsi og kjør to relevante kontraster.',
      'Modellen leser den valgte VM-kjeden, men feilen, kopien og rutingen er uttrykkelige antakelser. Portal-inventory endres ikke.',
    ],
    reflect: [
      'Knytt observasjon til årsak og grense',
      'Tilbake til oppdraget i kurset → Forklar beslutningen og konsekvensen → Lever oppdragsrefleksjonen.',
      'Ressurs-/receipt-krav og faglige begrunnelser vurderes sammen. Besøk, maskot og knapper gir ikke fullføring.',
    ],
  },
  missions: {
    diagnose: {
      title: 'Diagnose · følg den svake avhengigheten',
      bridge:
        'Reliability-teorien forklarer hvorfor hele avhengighetskjeden betyr noe. Nå skal du følge en faktisk VM-kjede og undersøke hvorfor mer compute alene ikke løser et delt avhengighetsproblem.',
      scenario:
        'En intern ekspedisjonstjeneste er rapportert utilgjengelig. Overleveringen inneholder en VM-konfigurasjon, men ingen helsetest. Finn hva konfigurasjonen faktisk viser før du foreslår tiltak.',
      prerequisites:
        'VM, OS-disk, NIC, subnet og forskjellen på konfigurasjon og kjøring. Repeter reliability-forklaringen over ved behov.',
      goals: [
        'Følg faktisk VM → OS-disk og VM → NIC → subnet.',
        'Forutsi hvordan en delt avhengighet påvirker erklærte kopier.',
        'Begrunn et tiltak uten å påstå målt tilgjengelighet.',
      ],
      stages: [
        'Velg eller opprett en faktisk VM og undersøk VM, OS-disk, NIC og subnet.',
        'Returner hit. Kjør to spor med delt subnet, balanced-ruting og hypotetisk subnet-feil.',
        'Sammenlign med separat erklært subnet. Forutsi før begge kjøringene.',
        'Forklar årsaken, lever refleksjonen og vurder modellens begrensninger.',
      ],
      observation:
        'Reelle ressursreferanser, eksplisitte inspeksjoner og to lagrede input/resultat-snapshots. Et nodebesøk eller en animasjon fullfører ikke oppdraget.',
      independent:
        'Ny situasjon: to erklærte spor har separate OS-disker. OS-disken på spor 1 blir utilgjengelig. Undersøk hvorfor en frisk kopi likevel kan være ubrukbar når bare spor 1 får arbeid. Sammenlign single og balanced-ruting med en prediksjon før hver kjøring. Inspiser den faktiske kjeden; ingen instruksjonsguide eller automatisk løsning vises.',
      decision: 'Hvilket tiltak adresserer en dokumentert felles avhengighet?',
      independentDecision:
        'Hvilket tiltak adresserer den observerte feilbanen når spor 2 har egen OS-disk, men bare spor 1 får arbeid?',
      reason: 'Hva kan undersøkelsen faktisk underbygge?',
      choices: {
        dependency: [
          'Vurder uavhengighet gjennom hele nødvendige kjeden og test ruting/avhengigheter.',
          'Tiltaket møter feilårsaken; flere kopier må også ha en brukbar end-to-end-bane.',
        ],
        'more-compute': [
          'Opprett alltid én ekstra VM; avhengighetene trenger ikke vurderes.',
          'En ekstra VM kan ha samme nødvendige avhengighet eller mangle ruting.',
        ],
        'new-group': [
          'Flytt bare ressursene til to Resource groups.',
          'Management-medlemskap skaper ingen fysisk eller operasjonell uavhengighet.',
        ],
        'declared-path': [
          'Konfigurasjonsreferanser og konsekvenser under erklærte antakelser; ikke faktisk oppetid.',
          'Portalen har ikke kjørt kode eller målt tilgjengelighet, og modellen har ingen ekte failover.',
        ],
        'azure-measured': [
          'At Azure-tjenesten faktisk opprettholdt all trafikk.',
          'Ingen trafikk eller helsedata ble målt.',
        ],
        guaranteed: [
          'En generell SLA-garanti for enhver app med to kopier.',
          'SLA og applikasjonsrobusthet avhenger av konkret tjeneste, design og konfigurasjon.',
        ],
      },
      feedback:
        'Faktiske konfigurasjonsreferanser og en separat feilmodell gir forskjellige typer observasjon. Bruk årsaken, ikke antallet ressursikoner, når du foreslår neste undersøkelse. Se kriteriene over for hva dette forsøket faktisk dokumenterer.',
    },
    governance: {
      title: 'Governance · undersøk avslag og korreksjon',
      bridge:
        'Et policybegrep blir nyttig når du kan følge regelen fra assignment-scope til forespørsel og faktisk kvittering. Nå sammenligner du et avslag med en målrettet korreksjon.',
      scenario:
        'Publiseringsteamet skal ha en Web App i App Sandbox. En kollega hevder at gruppens metadata-region kan brukes til å omgå Web-location-regelen. Undersøk påstanden gjennom støttede operasjoner.',
      prerequisites:
        'Subscription, gruppemetadata, planens resource location, hosting og den avgrensede Web-policyen. Acceptance er ikke sikkerhets- eller compliance-godkjenning.',
      goals: [
        'Les faktisk scope og typefilter.',
        'Sammenlign nytt avslag med senere korrigert plan og app i samme gruppe.',
        'Forklar hvilke krav aksepten kontrollerte og hvilke den ikke undersøkte.',
      ],
      stages: [
        'Bruk en gruppe i App Sandbox med metadata utenfor West Europe; opprett en om nødvendig.',
        'Send selv en ny planforespørsel utenfor West Europe. Undersøk kvittering og gjeldende policy.',
        'Korriger planens ressurslokasjon i samme gruppe. Opprett appen på denne aksepterte planen.',
        'Undersøk subscription, gruppe, plan, app og begge kvitteringer. Returner og begrunn resultatet.',
      ],
      observation:
        'Nye post-boundary kvitteringer må vise avslag uten added resource, deretter akseptert plan og app. Historiske avslag eller en annen akseptert operasjon teller ikke som ny korreksjon.',
      independent:
        'Ny revisjon: et team hevder at Web-regelen forbyr enhver ressurs utenfor West Europe. Undersøk en ny avvist plan, en senere korrigert plan/app og en ny støttet VM utenfor West Europe i App Sandbox. Inspiser også VM-kvitteringen som moteksempel til universalpåstanden. Bruk gruppemetadata utenfor West Europe. Begrunn hva aksepten sier om generell sikkerhet og compliance.',
      decision: 'Hva må korrigeres for denne Web-location-avvisningen?',
      reason: 'Hva demonstrerer den senere aksepterte operasjonen?',
      choices: {
        'resource-location': [
          'Den relevante Web-ressursens lokasjon, innenfor riktig subscription og typefilter.',
          'Den faktiske regelen sammenholder Web-ressursens location med assignmenten i App Sandbox.',
        ],
        'metadata-location': [
          'Bare gruppens metadata-region; planen trenger ingen endring.',
          'Gruppemetadata er ikke planens resource location og er ikke denne regelens target.',
        ],
        'other-subscription': [
          'Flytt arbeidet til Shared Sandbox, uansett teamets krav.',
          'Et scope utenfor assignmenten oppfyller ikke kravet om App Sandbox.',
        ],
        'bounded-check': [
          'At støttede tekniske krav og denne regelen ble tilfredsstilt; flere sikkerhetskontroller gjenstår.',
          'Kode, IAM, faktisk helse og alle compliance-krav er ikke evaluert av den lokale Web-regelen.',
        ],
        'secure-app': [
          'At applikasjonen nå er sårbarhetsfri og kjører sikkert.',
          'Ingen kodeanalyse eller kjøretid ble undersøkt.',
        ],
        'full-compliance': [
          'At alle regulatoriske krav er godkjent.',
          'En avgrenset policykontroll er ikke en generell compliance-revisjon.',
        ],
      },
      feedback:
        'Knytt requested location, ressurstype og assignment-scope til samme kvittering. Uendret revision ved avslag betyr at den avviste planen ikke ble lagt til.',
    },
    infrastructure: {
      title: 'IaaS · bygg for et konkret gjestekrav',
      bridge:
        'IaaS gir kontroll over gjesten. Nå må du begrunne hvorfor kontrollen trengs og velge en modellert konfigurasjon som følger et konkret arbeidsbehov.',
      scenario:
        'Et dokumentteam vedlikeholder en Linux-native konverterer og egne gjestepakker. Teamet trenger standard treningsprofil (4 vCPU / 8 GiB RAM), en separat 32 GiB datadisk og Shared Sandbox som administrativt ansvar.',
      prerequisites:
        'Image, vCPU/RAM som allokeringsenheter, OS-disk versus datadisk og NIC/subnet. Profilene er undervisningsantakelser, ikke ekte Azure-SKU-er eller ytelsesmålinger.',
      goals: [
        'Velg IaaS ut fra gjestekontroll, ikke bare tjenestenavn.',
        'Opprett en ny støttet VM med riktig image, profil, datadisk og scope.',
        'Inspiser avhengighetene og forklar beholdt operativt ansvar.',
      ],
      stages: [
        'Velg eller opprett gruppe i Shared Sandbox.',
        'Opprett en ny Ubuntu-VM med standard-profil og data32. Velg et gyldig nytt eller gjenbrukt subnet.',
        'Velg den nye VM-en for oppdraget og undersøk opprettelseskvitteringen.',
        'Inspiser VM, OS-disk, datadisk, NIC og subnet. Returner og forklar hva som fortsatt må driftes og testes.',
      ],
      observation:
        'En akseptert post-boundary bundle med faktiske dependencies. Gamle VM-er, eller ufullstendige avviste bundles, kan ikke tilfredsstille nybyggkravet.',
      independent:
        'Ny situasjon: en Windows-only, planlagt kontrollprosess trenger small treningsprofil (2 vCPU / 4 GiB), en separat 32 GiB datadisk og App Sandbox. Opprett ny konfigurasjon etter dette forsøks startgrense. Inspiser VM, OS-/datadisk, NIC, subnet og opprettelseskvittering. Velg tjenestemodell og begrunn drifts-/verifikasjonsgrensene selv.',
      decision: 'Hvorfor er IaaS relevant for dette arbeidsbehovet?',
      reason: 'Hva følger av den faktiske VM-konfigurasjonen?',
      choices: {
        'guest-control': [
          'Teamet trenger kontroll over gjeste-OS og egne pakker.',
          'IaaS tilbyr den nødvendige gjestekontrollen, med tilsvarende driftsansvar.',
        ],
        'managed-guest': [
          'Teamet vil overlate all gjestepatching til App Service.',
          'Det beskriver et administrert plattformvalg og dekker ikke det oppgitte gjestekravet.',
        ],
        'ready-app': [
          'Teamet trenger bare å kjøpe tilgang til en ferdig sluttbrukerapp.',
          'Det ville pekt mot SaaS, ikke den beskrevne egenstyrte prosessen.',
        ],
        'retained-operations': [
          'Kunden må fortsatt håndtere gjest, programvare, data og tilgang; NIC viser ikke bevist trafikk.',
          'Allokering og relasjoner er konfigurert; ingen gjesteprosess eller nettverksforbindelse er testet.',
        ],
        'provider-patches': [
          'Microsoft tar automatisk alt ansvar for denne VM-ens gjest og applikasjon.',
          'VM-gjest og egen programvare inngår fortsatt i kundens ansvar.',
        ],
        'network-proven': [
          'En NIC-referanse viser at konvertereren faktisk kan nå alle tjenester.',
          'En konfigurasjonsrelasjon er ikke en gjennomført trafikktest.',
        ],
      },
      feedback:
        'OS-disk og datadisk har ulike roller. Valgt RAM og vCPU er allokering; det finnes ingen måling av konvertererens throughput, boot eller tilgjengelighet her.',
    },
    platform: {
      title: 'PaaS · vedlikehold og gjenopprett konfigurasjon',
      bridge:
        'Å overlate gjeste-OS til en plattform fjerner ikke applikasjonsarbeidet. Nå skal du undersøke to virkelige konfigurasjonsendringer og forskjellen på utkast, Apply og faktisk drift.',
      scenario:
        'Katalogteamet har egen Web-kode og ønsker administrert gjeste-OS. Under et staging-vedlikehold skal CATALOG_MODE først være read-only, og deretter standard igjen. APP_ENVIRONMENT skal være staging i begge lagrede tilstander.',
      prerequisites:
        'PaaS, app → plan-hosting og Environment variables. APP_ENVIRONMENT og CATALOG_MODE er harmløse, fiktive appkonvensjoner; koden måtte selv lese dem.',
      goals: [
        'Begrunn App Service fremfor VM når gjeste-OS ikke skal administreres.',
        'Sammenlign faktisk lagret verdi med et endret utkast fra dialogens Apply.',
        'Apply vedlikehold og senere gjenoppretting på samme app; kontroller begge kvitteringene.',
      ],
      stages: [
        'Velg en faktisk app med gyldig plan. Opprett støttede avhengigheter selv om ingen finnes.',
        'Undersøk app, plan og gruppe. Hvis appen allerede er read-only, lagre standard først.',
        'Edit innstillingene til staging/read-only og velg dialogens Apply for å legge dem i utkastet. Dette endrer ikke simulatorens lagrede tilstand.',
        'Velg Apply selv og undersøk kvitteringen. Endre så til staging/standard, Apply og undersøk den andre kvitteringen.',
        'Returner og begrunn hvorfor lagret konfigurasjon ikke beviser kjørende applikasjonsatferd.',
      ],
      observation:
        'Et faktisk endret utkast etterfulgt av to ordnede, aksepterte SetAppSettings på samme app: read-only og standard. Tidligere verdier eller et uanvendt utkast fullfører ikke oppdraget.',
      independent:
        'Ny situasjon: en publiseringsapp og en intern staging-app skal dele hosting-plan, men ha ulike appinnstillinger. Velg publiseringsappen som oppdragsressurs. Lagre en ny APP_ENVIRONMENT=production / CATALOG_MODE=standard på den, og en ny staging/read-only på en annen app som refererer samme plan. Opprett den andre appen selv ved behov. Undersøk begge appene, felles plan, gruppe og begge nye kvitteringer. Et faktisk endret utkast på publiseringsappen må komme før dens Apply. Avgjør hvilket konfigurasjonsscope som gir forskjellige verdier uten å endre felles hosting.',
      independentQuestions: {
        decision: 'Hvor bør teamet konfigurere forskjellene mellom disse to appene?',
        reason: 'Hva underbygger de forskjellige lagrede verdiene på samme hosting-plan?',
      },
      independentFeedback:
        'App settings tilhører den enkelte appen. En felles plan representerer delte hostingressurser, ikke automatisk felles miljøvariabler. De faktiske app-ID-ene og nye kvitteringene viser separate konfigurasjoner; de beviser ikke runtime-isolasjon, trafikk eller korrekt kjørende kode.',
      decision: 'Hvorfor passer en App Service-type plattform her?',
      reason: 'Hva betyr de to aksepterte konfigurasjonsendringene?',
      choices: {
        'app-scope': [
          'På hver Web App, med egne verdier og en Apply på riktig app-ID.',
          'Innstillingene tilordnes hver app. Felles plan kan beholdes uten at appkonfigurasjon blir den samme.',
        ],
        'plan-scope': [
          'Bytt planens lokasjon for å skille miljøvariablene.',
          'Planlokasjon er hosting, ikke lagring av disse appspesifikke verdiene.',
        ],
        'group-scope': [
          'Endre gruppens metadata-region, så får appene ulike innstillinger.',
          'Gruppemetadata styrer verken appens konfigurasjonsverdier eller dens hosting-plan.',
        ],
        'isolated-config': [
          'Appene har forskjellig lagret konfigurasjon; kundekoden må fortsatt testes.',
          'To app-ID-er og Apply-kvitteringer viser konfigurasjon per app, ikke observert runtime-atferd.',
        ],
        'shared-values': [
          'Alle apper på samme plan arver automatisk identiske appinnstillinger.',
          'Hosting-relasjonen deler ikke disse appspesifikke innstillingene. Den observerte konfigurasjonen viser ulike verdier.',
        ],
        'live-isolation': [
          'At produksjons- og staging-trafikken er målt og fysisk isolert.',
          'AzureLab kjører ikke trafikk eller kode. En delt plan er heller ikke bevis for fysisk feilseparasjon.',
        ],
        'managed-os': [
          'Egen støttet appkode, mens leverandøren administrerer gjeste-OS.',
          'Dette er en relevant PaaS-begrunnelse; teamet beholder app- og databeslutninger.',
        ],
        'custom-kernel': [
          'Arbeidsbehovet krever at teamet bytter plattformens kernel selv.',
          'Det ville pekt mot større gjestekontroll, ikke denne administrerte plattformen.',
        ],
        'license-only': [
          'En lisens til en ferdig app erstatter teamets egen kode.',
          'En ferdig SaaS-app svarer ikke på behovet for å hoste denne koden.',
        ],
        'config-only': [
          'Lagrede verdier på riktig app; koden, data, tilgang og faktisk atferd må fortsatt valideres.',
          'AzureLab utfører ikke koden eller en restart. Kundens konfigurasjon og programvare er fortsatt kundens ansvar.',
        ],
        'running-proven': [
          'At katalogen faktisk blokkerte og senere godtok alle brukerhandlinger.',
          'Det finnes ingen kjørende katalog eller trafikkobservasjon i simulatoren.',
        ],
        'provider-code': [
          'At leverandøren nå også eier og kvalitetssikrer kundens kode.',
          'PaaS overfører ikke dette ansvaret for egen applikasjonskode.',
        ],
      },
      feedback:
        'To aksepterte receipts beviser en ordnet konfigurasjonsendring og restaurering, ikke at kundekoden utførte vedlikehold. Dialogens Apply til utkastet alene gjorde ingen av disse tekniske endringene.',
    },
  },
} as const;
export const transferNb = {
  selectSubmission: 'Velg en tidligere innlevering',
  noHistory: 'Ingen innleveringer er registrert i denne modulen ennå.',
  activeElsewhere:
    'Du har et aktivt transfer-forsøk. Fortsett der eller avbryt det før du åpner et annet tilfelle. Utkastet flyttes ikke til en annen modul.',
  modules: {
    computing: 'Cloud Computing',
    benefits: 'Cloud Benefits',
    services: 'Cloud Service Types',
  },
  criteria: 'Vurderte kriterier',
  decisionResult: 'Beslutningen møter kravene',
  relationResult: 'Begrunnelsen passer til beslutningen og kravene',
  yes: 'Ja',
  no: 'Nei',
  observations: 'Oppgitte observasjoner · konseptuell analyse, ikke målt Azure-runtime',
  diagrams: {
    routing: {
      source: 'Inngangspunkt',
      a: 'Instans A · feilet',
      b: 'Instans B · frisk',
      route: 'Konfigurert trafikkvei',
      unused: 'Ingen trafikkvei til B',
      data: 'Datatjeneste · tilgjengelig',
    },
    payment: {
      a: 'Web 1 · frisk',
      b: 'Web 2 · frisk',
      c: 'Web 3 · frisk',
      shared: 'Felles betalingstjeneste · svarer ikke',
      required: 'Ordrebekreftelse krever betalingsresultat',
    },
    drift: {
      desired: 'Ønsket verdi: 30 sekunder',
      past: 'Mandag: pipeline akseptert',
      change: 'Fredag: Portal-endring til 120 sekunder',
      now: 'Nå: pipeline viser fortsatt mandagens resultat',
    },
    memory: {
      available: 'Tilgjengelig RAM: 8 GB',
      required: 'Prosessens krav: 12 GB',
      note: 'Én udelelig prosess · CPU og disk har ledig kapasitet',
    },
  },
  preparationTitle: 'Før selvstendig anvendelse',
  preparation: {
    governance:
      'Authentication bekrefter identiteten: hvem eller hva logger inn? Authorization avgjør hvilke handlinger identiteten får utføre på et bestemt scope. En vellykket pålogging gir derfor ikke i seg selv endringsrettighet. Azure RBAC kan tildele en egnet rolle på et avgrenset scope. Azure Policy vurderer relevante konfigurasjons- eller handlingsbetingelser og er et annet kontrollspørsmål. Disse kontrollene erstatter ikke undersøkelse av sikker kode, datahåndtering eller samlet compliance.',
    management:
      'En mal beskriver ønsket konfigurasjon når den brukes. Hvis noen senere endrer en ressurs direkte i Portal, blir ikke nødvendigvis filen oppdatert eller den gamle verdien kontinuerlig håndhevet. Sammenlign faktisk tilstand med godkjent kilde, undersøk hvorfor avviket oppsto og rett kontrollert. En grønn historisk kjøring er en observasjon fra det tidspunktet; den beviser ikke dagens tilstand.',
  },
  title: 'Selvstendig anvendelse — Cloud Concepts',
  entry: 'Prøv kunnskapen i nye situasjoner',
  intro:
    'Velg en beslutning og en begrunnelse ut fra kravene i hvert tilfelle. Dette er et eget vurderingsspor; tidligere modulresultater og guidede oppdrag beholdes uendret.',
  scope: 'Ingen XP, Microsoft Learn-fullføring eller samlet eksamensberedskap utledes her.',
  briefingTitle: 'SavvyShark · Fra øvelse til egen beslutning',
  briefing:
    'Du møter nye krav, ikke en gjentakelse av oppdragene. Bruk det du vet om drift, ansvar og konsekvenser. Du kan starte uten å ha fullført alle praktiske oppdrag.',
  rules:
    'Begge valg må passe sammen. Tilbakemelding kommer etter innlevering. Å åpne forklaringer eller teori under et aktivt forsøk registrerer hjelp først. Et nytt forsøk i samme familie merkes retry, også etter avbrudd. Utkast lagres lokalt når lagringen fungerer.',
  start: 'Start selvstendig forsøk',
  resume: 'Fortsett utkast',
  cancel: 'Lukk introduksjonen',
  briefingOpen: 'Om selvstendig vurdering',
  decision: 'Din beslutning',
  reason: 'Din tekniske begrunnelse',
  submit: 'Lever beslutning og begrunnelse',
  abandon: 'Avbryt dette forsøket',
  help: 'Åpne teori og registrer hjelp',
  load: 'Last lagret vurdering på nytt',
  recovery: 'Nullstill bare den ugyldige transfer-registreringen',
  confirm: 'Bekreft isolert recovery',
  issue:
    'Vurderingen holdes tilbake fordi lagringen ikke er avklart. Last på nytt før du fortsetter. Ugyldige data kan bare nullstilles eksplisitt for dette vurderingssporet.',
  pending: 'Velg et tilfelle. Ingen vurdering starter ved sidebesøk.',
  draft: 'Aktivt utkast · lagret lokalt',
  aided: 'Forsøk med registrert hjelp',
  retry: 'Retry · familien er tidligere åpnet',
  unaided: 'Første uassisterte forsøk i familien',
  submitted: 'Innlevert resultat',
  passed: 'Beslutning og begrunnelse tilfredsstiller kravene',
  failed: 'Minst ett av valgene tilfredsstiller ikke kravene',
  feedback: 'Hvorfor dette resultatet?',
  decisive: 'Kravet som avgjør',
  alternatives: 'Vurdering av alternativene',
  selected: 'Ditt innleverte valg',
  when: 'Kunne vært gyldig dersom',
  misconception: 'Misforståelsen som må undersøkes',
  repeat: 'Repeter den relevante undervisningen',
  history: 'Tidligere innleveringer',
  currentFeedback: 'Aktuell innlevering',
  historyNote:
    'Bare innleverte svar vises. Første innlevering overskrives aldri. Senere familieeksponering er ikke et nytt usett førsteforsøk.',
  capacity:
    'Loggen nærmer seg grensen. Flere utkastendringer kan bli avvist; lever de lagrede valgene eller avbryt trygt. Andre modulers data berøres ikke.',
  capacityStart:
    'Grensen for nye forsøk er nådd. Tidligere innleveringer er bevart og kan leses. Ingen nye forsøk starter; du kan fortsatt fortsette undervisningen.',
  blockedDraft:
    'Endringen ble ikke lagret. Kontroller lagringsstatus og de synlige lagrede valgene før innlevering.',
  resultNote:
    'Dette gjelder bare dette scenarioet, ikke generell sertifiseringsmestring. Sammenlign begrunnelsene og repeter ved behov.',
  coachActive:
    'Les alle premissene. Velg selv; jeg viser ingen løsningshint mens du vurderer. Lagrede valg er et utkast fram til du leverer.',
  facts: 'Scenarioets premisser',
  choose: 'Velg et scenario',
  previous: 'Tilbake til undervisningen',
  families: {
    deployment: 'Plassering og kontroll',
    pricing: 'Prisvalg og risiko',
    availability: 'Kapasitet og tilgjengelighet',
    reliability: 'Gjenoppretting og forutsigbarhet',
    governance: 'Sikkerhet og styring',
    manageability: 'Styrbarhet og konfigurasjon',
    services: 'Tjenestevalg og driftsansvar',
  },
  items: {
    'public-information': {
      title: 'En ny publikasjonstjeneste',
      situation:
        'Et forlag skal publisere åpent lesestoff. Redaksjonen har lokale arkivservere, men den nye tjenesten verken leser eller skriver disse. En juridisk vurdering tillater de valgte dataene hos en ekstern skyleverandør i avtalt region. Teamet trenger rask etablering uten eksklusiv fysisk infrastruktur.',
      facts: [
        'Ingen integrasjon med arkivserverne i denne leveransen.',
        'Regionkravet er verifisert for den aktuelle tjenesten.',
        'Egen applikasjonskode er nødvendig, men gjeste-OS-kontroll er ikke et krav.',
      ],
      decisions: [
        'Koble privat og offentlig sky for denne arbeidslasten',
        'Bruk offentlig sky for denne arbeidslasten',
        'Bygg en skyplattform dedikert bare til forlaget',
      ],
      reasons: [
        'Dataene er regionale; derfor må selve skyplattformen være dedikert til denne organisasjonen.',
        'Teamet skal levere egen kode; det er dette som skiller privat fra offentlig deployment model.',
        'Arbeidslasten kan bruke leverandørens tilbud uten krav om eksklusivt miljø eller løpende lokal integrasjon.',
      ],
      decisive:
        'Kravene tillater public cloud; de lokale arkivserverne har ingen rolle i arbeidslasten. Valg av PaaS/IaaS er en separat tjenestemodellbeslutning.',
      decisionFeedback: [
        'En hybridkobling løser ikke et oppgitt integrasjonsbehov her.',
        'Public cloud tilfredsstiller disse premissene; sikker konfigurasjon og datakrav må fortsatt ivaretas.',
        'Et privat miljø tilfører et kontroll- og driftsbehov som ikke er etterspurt.',
      ],
      decisionWhen: [
        'Tjenesten måtte utveksle data kontinuerlig med privat sky.',
        'De samme eksplisitte premissene gjelder.',
        'Eksklusivitet eller særskilt infrastrukturkontroll var et faktisk krav.',
      ],
      reasonFeedback: [
        'Geografiske krav må kontrolleres per tjeneste; de bestemmer ikke alene deployment model.',
        'Egen kode kan kjøres i både offentlig og privat sky.',
        'Dette knytter beslutningen til de konkrete kravene, uten å gjøre gamle servere til et hybridpåbud.',
      ],
      reasonWhen: [
        'Den konkrete tjenesten ikke kunne oppfylle datakravet i public cloud.',
        'Et separat krav til eksklusivt miljø også var oppgitt.',
        'Ingen uoppgitt lokal avhengighet finnes.',
      ],
    },
    'exclusive-research': {
      title: 'Et nytt forskningsmiljø',
      situation:
        'Et forskningsinstitutt krever at skyplattformens infrastruktur er dedikert til bare instituttet og at teamet styrer plattformoppsettet. En kontraktspartner kan drifte datasenteret. Nettbasert selvbetjening og ressursdeling mellom instituttets egne prosjekter er planlagt; ingen offentlig sky skal kobles inn.',
      facts: [
        'Eksklusivitet gjelder én organisasjon.',
        'Lokasjonen kan være hos en ekstern driftsleverandør.',
        'Dette er en skyplattform, ikke bare én kjøpt server.',
      ],
      decisions: ['Private cloud', 'Public cloud', 'Hybrid cloud'],
      reasons: [
        'En dedikert sky for én organisasjon kan driftes utenfor egne lokaler uten å bli en offentlig sky.',
        'En ekstern driftsleverandør eier bygget; derfor må skyplattformen klassifiseres som offentlig.',
        'Flere interne prosjektmiljøer bruker infrastrukturen; derfor er dette en hybridmodell.',
      ],
      decisive:
        'Eksklusiviteten og plattformkontrollen peker mot private cloud. Eierskap til bygget er ikke definisjonen.',
      decisionFeedback: [
        'Private cloud samsvarer med den dedikerte skyplattformen.',
        'Det generelt tilgjengelige public-tilbudet er ikke det beskrevne eksklusive miljøet.',
        'Det er ikke beskrevet en sammenkobling av privat og offentlig sky.',
      ],
      decisionWhen: [
        'Eksklusiviteten og driftsansvaret er tilsiktet.',
        'Kravet om dedikert skyplattform ble fjernet.',
        'En offentlig sky ble koblet inn i en samlet løsning.',
      ],
      reasonFeedback: [
        'Dette skiller deployment model fra hvem som eier bygget.',
        'En tredjepart kan også drifte private cloud.',
        'Prosjekter eller tenants internt er ikke automatisk en hybridarkitektur.',
      ],
      reasonWhen: [
        'Det dedikerte miljøet tilbyr de beskrevne skyegenskapene.',
        'Leverandøren faktisk tilbød sin allment tilgjengelige offentlige sky.',
        'Prosjektene også brukte integrert public cloud.',
      ],
    },
    'integrated-production': {
      title: 'Produksjon og bestillinger',
      situation:
        'En fabrikk beholder en privat sky for produksjonsstyring. En ny offentlig skytjeneste skal ta imot bestillinger. Begge miljøer skal være i bruk og utveksle bestillingsstatus løpende gjennom en planlagt sikret forbindelse. Godkjente datatyper kan overføres; produksjonsstyringen skal bli i det private miljøet.',
      facts: [
        'Begge miljøene beholdes, ikke bare under en engangsflytting.',
        'Forbindelsen er et faktisk krav.',
        'Ingen antakelse om at forbindelsen automatisk er sikker.',
      ],
      decisions: [
        'Bare public cloud for hele systemet',
        'Bare private cloud for hele systemet',
        'En sammenkoblet hybridløsning',
      ],
      reasons: [
        'Miljøene har hver sitt abonnement; det administrative skillet er det som gjør løsningen hybrid.',
        'Privat og offentlig sky må inngå i ett samvirkende miljø med løpende integrasjon etter kravene.',
        'Forbindelsen inngår i en hybridmodell; dette erstatter egne kontroller av hvilke data som overføres.',
      ],
      decisive:
        'Den løpende koblingen mellom private cloud og public cloud er avgjørende, ikke at bedriften tilfeldigvis har servere fra før.',
      decisionFeedback: [
        'Dette bryter kravet om å beholde produksjonsstyringen privat.',
        'Dette utelater det uttrykkelig valgte offentlige mottaket.',
        'Hybrid beskriver den nødvendige kombinasjonen, men krever arbeid med identitet, nettverk og drift.',
      ],
      decisionWhen: [
        'Produksjonsstyringen også kunne flyttes.',
        'Mottaket også skulle ligge privat.',
        'Begge miljøene og integrasjonsbehovet beholdes.',
      ],
      reasonFeedback: [
        'Subscriptions er management-grenser, ikke hver sin deployment model.',
        'Begrunnelsen peker på den faktiske integrasjonen.',
        'En kobling er ingen sikkerhetsgaranti.',
      ],
      reasonWhen: [
        'Abonnementene representerte miljøer med ulike skymodeller som faktisk var koblet sammen.',
        'Den løpende samhandlingen er nødvendig.',
        'Tilgang fortsatt ble vurdert separat; den er ikke overflødig.',
      ],
    },
    'campaign-pricing': {
      title: 'Et kort arrangement',
      situation:
        'En ny billettjeneste skal drives i seks uker. Bruken er svært usikker og tjenesten kan bli avviklet etter arrangementet. Avbrudd midt i en bestilling aksepteres ikke. Det finnes ingen stabil grunnlast som kan forsvares utover perioden.',
      facts: [
        'Ingen reelle Azure-priser brukes i oppgaven.',
        'Sammenlign fleksibilitet og risiko, ikke bare rabatt.',
        'Lagring og andre tjenester kan fortsatt gi egne kostnader.',
      ],
      decisions: [
        'Langvarig kapasitets-/forbruksforpliktelse',
        'Pay-as-you-go for det usikre behovet',
        'Spot som eneste kapasitet for bestillinger',
      ],
      reasons: [
        'Lavere compute-pris veier opp for avbruddsrisiko selv når bestillingsflyten trenger kontinuitet.',
        'Bindingen bør dimensjoneres etter forventet topp; den ubrukte delen gir fortsatt tilsvarende verdi.',
        'Fleksibelt forbruk unngår den ubegrunnede langsiktige bindingen; avbruddsrisiko må vurderes separat.',
      ],
      decisive:
        'Kort og usikkert behov uten toleranse for avbrytbar kapasitet gir grunnlag for et fleksibelt tilbud, ikke automatisk en langsiktig rabattbinding.',
      decisionFeedback: [
        'En forpliktelse kan bli betalt selv om tjenesten opphører.',
        'Pay-as-you-go er egnet under disse premissene; budsjettering og oppfølging er fortsatt nødvendig.',
        'Eviction-risikoen passer ikke som eneste løsning for dette kravet.',
      ],
      decisionWhen: [
        'En dokumentert stabil grunnlast over avtaleperioden fantes.',
        'Den usikre varigheten og bruken gjelder.',
        'Arbeidet kunne avbrytes og gjenopptas uten å bryte kravet.',
      ],
      reasonFeedback: [
        'Rabatt endrer ikke konsekvensen av et avbrudd.',
        'Tilbudenes vilkår må kontrolleres; ubrukt binding kan koste.',
        'Dette vurderer både binding og avbruddsrisiko.',
      ],
      reasonWhen: [
        'Arbeidslasten faktisk tålte avbrudd.',
        'Et bestemt verifisert tilbud ga en slik rett; det kan ikke antas generelt.',
        'Forbruket virkelig er usikkert uten stabil grunnlast.',
      ],
    },
    'baseline-pricing': {
      title: 'En dokumentert grunnlast',
      situation:
        'En virksomhet har målt en stabil, kvalifisert compute-grunnlast og skal beholde den i hele den vurderte avtaleperioden. En kontrollert commitment gir lavere kostnad for denne delen enn pay-as-you-go etter de oppgitte vilkårene. Topper varierer. Tjenesten tåler ikke kapasitetsutkastelse.',
      facts: [
        'Tilbud, scope og kvalifisert bruk er kontrollert.',
        'Rabatten er en oppgaveforutsetning, ikke en Azure-prisliste.',
        'Ingen rabattordning konfigurerer høy tilgjengelighet.',
      ],
      decisions: [
        'Vurder commitment for grunnlasten og fleksibel betaling for toppene',
        'Betal bare pay-as-you-go uten å undersøke grunnlasten',
        'Flytt hele tjenesten til avbrytbar kapasitet',
      ],
      reasons: [
        'En reservation gir nødvendig kapasitet og dermed den redundansen denne tjenesten trenger.',
        'Forutsigbart kvalifisert forbruk kan utnytte bindingen; toppene trenger ikke bindes på samme måte.',
        'En savings plan kan bindes etter toppene fordi ubrukt timeforpliktelse kan flyttes til travlere timer.',
      ],
      decisive:
        'Forpliktelsen er relevant fordi den dokumenterte grunnlasten og vilkårene er kjent. Overbinding og runtime-tilgjengelighet er egne problemstillinger.',
      decisionFeedback: [
        'Dette avgrenser bindingen til den kjente lasten.',
        'Fleksibilitet er mulig, men overser den eksplisitt verifiserte besparelsen for stabil last.',
        'Kravet om å tåle eviction er ikke oppfylt.',
      ],
      decisionWhen: [
        'Premissene og tilbudets vilkår holder.',
        'Lasten eller varigheten ble for usikker til å forsvare binding.',
        'Arbeidet kunne håndtere avbrudd.',
      ],
      reasonFeedback: [
        'En billing-rabatt er ikke en redundansmekanisme.',
        'Begrunnelsen knytter bindingen til utnyttelse og risiko.',
        'Ubrukt timeforpliktelse i savings plan ruller ikke videre.',
      ],
      reasonWhen: [
        'Redundans også var eksplisitt konfigurert; rabatten gjør det ikke.',
        'Den stabile kvalifiserte bruken er dokumentert.',
        'Et separat tilbud faktisk hadde slike vilkår; dette kan ikke antas.',
      ],
    },
    'batch-pricing': {
      title: 'Et analyseprosjekt',
      situation:
        'Et analysearbeid deler jobben i små uavhengige deler og lagrer checkpoints. Det har romslig tidsfrist og kan vente på kapasitet. Teamet har testet gjenopptakelse etter avbrudd. Målet er å vurdere rimelig avbrytbar compute uten å love levering på et bestemt minutt.',
      facts: [
        'Resultater og checkpoints lagres separat.',
        'Kapasitet og pris kan variere.',
        'Ingen garanti for at frigitt kapasitet blir tilgjengelig igjen straks.',
      ],
      decisions: [
        'Bind maksimal kapasitet for flere år uten bruksdata',
        'Krev uavbrutt kapasitet for hver deljobb',
        'Vurder Spot for de avbrytbare deljobbene',
      ],
      reasons: [
        'Spot kan passe arbeid som faktisk håndterer eviction, variasjon i kapasitet og ventetid før gjenopptakelse.',
        'Spot passer fordi Azure opprettholder den nødvendige kapasiteten mens hele batchen kjøres ferdig.',
        'Checkpoints erstatter ekstern lagring; dermed er det bare den avbrytbare compute-prisen som betyr noe.',
      ],
      decisive:
        'Det er den testede avbruddstoleransen og tidsfleksibiliteten som gjør Spot relevant, ikke bare ønsket om lav pris.',
      decisionFeedback: [
        'Det finnes ikke grunnlag for en flerårig maksimal binding.',
        'Dette kan fungere teknisk, men utnytter ikke den beskrevne avbruddstoleransen når avbrytbar kapasitet skal vurderes.',
        'Spot er et relevant alternativ med eksplisitt eviction- og kapasitetsrisiko.',
      ],
      decisionWhen: [
        'En stabil flerårig last og riktig binding var dokumentert.',
        'Tidsfristen krevde uavbrutt kapasitet.',
        'De beskrevne checkpoints og toleransene faktisk fungerer.',
      ],
      reasonFeedback: [
        'Dette begrunner Spot med riktig arbeidslastmekanisme.',
        'Spot VMs har ingen slik HA-garanti.',
        'Checkpoint-lagring er fortsatt en ressurs med kostnader og beskyttelsesbehov.',
      ],
      reasonWhen: [
        'Risikoen passer arbeidslastens frist.',
        'Tilgjengelighet var ivaretatt med separat egnet design; Spot alene gir ikke garantien.',
        'Et konkret lagringstilbud ga null kostnad under bestemte vilkår, ikke som følge av checkpoints alene.',
      ],
    },
    'memory-capacity': {
      title: 'Analyse av en stor fil',
      situation:
        'En analyseprosess på én VM krever 12 GB arbeidsminne. Den har 8 GB tilgjengelig og kan ikke fordeles mellom prosesser uten omskriving. CPU og lagring har ledig kapasitet. Kravet nå er å få denne prosessen til å kjøre; feilredundans er et separat senere krav.',
      facts: [
        'GB betyr gigabyte arbeidsminne i denne oppgaven.',
        'Tallene er pedagogiske premisser, ikke en måling av Azure.',
        'Den oppgitte programutgaven er den eneste som kan brukes i denne leveransen.',
      ],
      decisions: [
        'Opprett to identiske 8 GB-instanser uten kodeendring',
        'Velg en egnet større minneprofil for den ene instansen',
        'Øk datadiskens størrelse uten å endre minneprofil',
      ],
      reasons: [
        'To instanser har samlet mer minne, så prosessen kan bruke summen uten at programmet endres.',
        'Mer diskplass kan brukes som samme type kapasitet som det uttrykkelige kravet til arbeidsminne.',
        'Vertikal skalering kan møte prosessens minnebehov, men skaper ikke alene feilredundans.',
      ],
      decisive: 'Bottleneck er minne i én udelelig prosess. Valget må møte dette konkrete behovet.',
      decisionFeedback: [
        'Flere små instanser løser ikke dette prosesskravet uten ny programdesign.',
        'En større egnet profil kan dekke behovet; tilgjengelig profil og endringskonsekvenser må kontrolleres.',
        'En større datadisk oppfyller ikke i seg selv det oppgitte kravet til fysisk arbeidsminne.',
      ],
      decisionWhen: [
        'Arbeidet kunne partisjoneres mellom instanser.',
        'Større egnet profil finnes og endringen er akseptabel.',
        'Begrensningen var diskplass og ikke arbeidsminne.',
      ],
      reasonFeedback: [
        'Horisontal skalering forutsetter at arbeidet faktisk kan fordeles.',
        'Lagringsplass er ikke det samme som tilgjengelig RAM for den udelelige prosessen.',
        'Dette skiller kapasitetsøkning fra høy tilgjengelighet.',
      ],
      reasonWhen: [
        'Applikasjonen var skrevet for distribuert behandling.',
        'Arbeidslastens krav gjaldt lagringsplass fremfor arbeidsminne.',
        'Minnebehovet og profilvalget stemmer.',
      ],
    },
    'route-replica': {
      title: 'Bestillinger etter et avbrudd',
      situation:
        'To stateless webinstanser har nok kapasitet og kan begge behandle forespørsler. Instans A feiler. B er frisk, men inngangspunktet sender fortsatt alle forespørsler til A. Datatjenesten er tilgjengelig. Begge instansene er allerede konfigurert.',
      facts: [
        'Klient → inngangspunkt → A eller B → datatjeneste.',
        'Observasjon: A feilet, B frisk, ruting peker bare på A.',
        'Dette er en konseptuell feilanalyse, ikke Portal-runtime.',
      ],
      decisions: [
        'Kontroller og rett helsesjekk/ruting til frisk instans',
        'Legg til mer minne på B uten å endre trafikkveien',
        'Opprett en tredje instans uten å koble den inn',
      ],
      reasons: [
        'En frisk replika er tilstrekkelig dokumentasjon; inngangspunktets konfigurasjon er et eget tema.',
        'Trafikken må faktisk nå en frisk instans for at redundansen skal gi den ønskede tilgjengeligheten.',
        'Større samlet compute-kapasitet vil avlaste A selv om inngangspunktet fortsatt velger bare A.',
      ],
      decisive: 'Tilgjengelig kapasitet er ikke nok når forespørslene ikke når den.',
      decisionFeedback: [
        'Dette retter den observerte svikten i trafikkveien.',
        'B har allerede nok kapasitet, men får ikke forespørsler.',
        'En ubenyttet ekstra instans endrer ikke rutingen.',
      ],
      decisionWhen: [
        'Det finnes en frisk, kompatibel mottaker som her.',
        'B faktisk var minnebegrenset etter korrekt ruting.',
        'Den nye instansen også fikk riktig trafikk og møtte et kapasitetsbehov.',
      ],
      reasonFeedback: [
        'En replika uten tilgjengelig trafikkvei gir ikke det forventede resultatet.',
        'Begrunnelsen knytter redundans til hele forespørselsforløpet.',
        'Et routingproblem er ikke et compute-kapasitetsproblem.',
      ],
      reasonWhen: [
        'Ruting og nødvendig tilstand også var verifisert.',
        'Helse og trafikkvei er undersøkt som her.',
        'Feilen faktisk skyldtes kapasitet i compute-leddet.',
      ],
    },
    'shared-payment': {
      title: 'Betaling i nettbutikken',
      situation:
        'En bestillingsløsning har tre friske webinstanser med god kapasitet. Alle må bruke én betalingstjeneste før ordren kan bekreftes. Betalingstjenesten svarer ikke. Teamet foreslår flere webinstanser som eneste tiltak.',
      facts: [
        'Alle webinstanser → samme nødvendige betalingstjeneste.',
        'Ingen alternativ betalingsvei er konfigurert.',
        'Ordrebekreftelse kan ikke rapporteres uten betalingsresultatet.',
      ],
      decisions: [
        'Skaler webdelen ut og rapporter full tilgjengelighet',
        'Del webinstansene mellom separate Resource groups og behold samme betalingsendepunkt',
        'Undersøk gjenoppretting eller en eksplisitt alternativ flyt for betaling',
      ],
      reasons: [
        'Flere webinstanser fordeler belastningen og gir dermed en ny uavhengig betalingsvei for hver kopi.',
        'En felles nødvendig avhengighet kan stoppe hele ordreflyten selv med ledig compute på alle instansene.',
        'Separate ressursgrupper isolerer betalingsavhengigheten, selv når alle instansene bruker samme endepunkt.',
      ],
      decisive:
        'Den delte sterke avhengigheten, ikke antall webinstanser, stopper den kritiske flyten.',
      decisionFeedback: [
        'Mer webkapasitet gir ikke et manglende betalingsresultat.',
        'Management-organisering endrer ikke den tekniske avhengigheten.',
        'Dette undersøker den faktiske feilkilden uten å late som automatisk failover finnes.',
      ],
      decisionWhen: [
        'Webkapasitet faktisk var flaskehalsen.',
        'Oppgaven gjaldt lifecycle-organisering.',
        'Gjenoppretting eller en godkjent alternativ prosess kan møte forretningskravet.',
      ],
      reasonFeedback: [
        'Skalering lager ingen ny betalingsavhengighet av seg selv.',
        'Dette forklarer forskjellen mellom redundante frontender og tilgjengelig ende-til-ende-flyt.',
        'Resource group membership velger ikke en annen tjeneste.',
      ],
      reasonWhen: [
        'Betalingsløsningen også ble endret med verifisert redundans.',
        'Alle bekreftelser faktisk trenger denne tjenesten.',
        'En separat konfigurert teknisk relasjon også ble endret.',
      ],
    },
    'parallel-demand': {
      title: 'Flere samtidige forespørsler',
      situation:
        'En tjeneste behandler uavhengige, stateless forespørsler. Etterspørselen har økt. Én instans er CPU-begrenset og bruker allerede den største godkjente profilen. Teamet har kontrollert at datatjeneste og nettverk har rom for den økte lasten. Inngangspunktet støtter fordeling til flere friske instanser. Målet er mer behandlingskapasitet innenfor disse rammene.',
      facts: [
        'Arbeidet kan fordeles mellom flere instanser uten delt prosessminne.',
        'En større profil er ikke et godkjent alternativ i dette scenarioet.',
        'Dette er en analyse av oppgitte forhold, ikke en ytelsesgaranti eller kjørt autoskalering.',
      ],
      decisions: [
        'Legg til like instanser og fordel forespørslene mellom dem',
        'Øk bare den eksisterende instansens profil utover godkjent grense',
        'Gi den eksisterende instansen større datadisk',
      ],
      reasons: [
        'Vertikal skalering fordeler forespørsler mellom flere instanser med samme profil.',
        'Horisontal skalering kan øke kapasiteten når arbeidet lar seg fordele og resten av kjeden tåler lasten.',
        'Mer lagringsplass øker kapasiteten for CPU-arbeidet som er oppgitt som flaskehals.',
      ],
      decisive:
        'Uavhengig arbeid, støttet trafikkfordeling og undersøkte avhengigheter gjør scale-out relevant. Dette er en annen situasjon enn én udelelig minnebegrenset prosess.',
      decisionFeedback: [
        'Dette adresserer CPU-kapasiteten ved å fordele arbeid til flere instanser. Resultatet må fortsatt testes.',
        'En større instans kan være en gyldig skaleringsform, men bryter den oppgitte profilgrensen her.',
        'Større disk løser ikke den observerte CPU-flaskehalsen.',
      ],
      decisionWhen: [
        'Arbeidet faktisk kan fordeles og avhengighetene fortsatt har tilstrekkelig kapasitet.',
        'En større egnet profil var godkjent og endringen oppfylte kravene.',
        'Den faktiske begrensningen gjaldt lagringsplass.',
      ],
      reasonFeedback: [
        'Flere instanser beskriver horisontal, ikke vertikal skalering.',
        'Dette begrunner valget med både arbeidsfordeling og hele den nødvendige kjeden.',
        'Lagringskapasitet og kapasitet til å utføre CPU-arbeid er ulike egenskaper.',
      ],
      reasonWhen: [
        'Du i stedet endret ressursprofilen til én instans; da var skaleringen vertikal.',
        'De eksplisitte forutsetningene er kontrollert som her.',
        'Observasjonen viste utilstrekkelig lagringsplass fremfor CPU-begrensning.',
      ],
    },
    'recovery-evidence': {
      title: 'Kan ordresystemet gjenopprettes?',
      situation:
        'Et team har backup og en applikasjonskopi i en annen region. Ingen har testet gjenoppretting, tilgang til hemmeligheter eller trafikkbytte. Ledelsen ønsker dokumentasjon på at ordreflyten kan gjenopptas med akseptabelt datatap etter en feil.',
      facts: [
        'Backup finnes, men siste gjenoppretting er ikke verifisert.',
        'Identitet, data og trafikk er nødvendige avhengigheter.',
        'Ingen gjenopprettingstid eller datatap er garantert i premissene.',
      ],
      decisions: [
        'Bruk regionnavnene som eneste dokumentasjon',
        'Test gjenopprettingsforløpet, data og avhengigheter mot avtalte mål',
        'Øk bare frontendenes størrelse',
      ],
      reasons: [
        'Reliability krever et fungerende gjenopprettingsforløp med data og avhengigheter, ikke bare at kopien finnes.',
        'Regionparet prioriterer gjenoppretting; derfor er applikasjonens trafikk og hemmeligheter allerede ivaretatt.',
        'Tjenestens SLA gir dokumentasjonen ledelsen trenger for organisasjonens datatap og gjenopprettingstid.',
      ],
      decisive:
        'Behovet er bevis for gjenoppretting av en hel flyt med definerte mål og testede avhengigheter.',
      decisionFeedback: [
        'Geografi alene viser ikke om løsningen kan startes og brukes.',
        'Dette kan avdekke manglende data, tilgang og trafikkvei før en reell feil.',
        'Compute-størrelse verifiserer ikke backup eller recovery.',
      ],
      decisionWhen: [
        'Spørsmålet bare var geografisk plassering.',
        'Testene gjøres sikkert med avtalte kriterier.',
        'Ytelse etter verifisert gjenoppretting var problemet.',
      ],
      reasonFeedback: [
        'Begrunnelsen krever observasjon av faktisk planlagt recovery.',
        'Applikasjonsfailover krever tjeneste- og løsningsspesifikt oppsett.',
        'En SLA er ikke en restore-test eller garanti for ønsket datatap.',
      ],
      reasonWhen: [
        'Gjenopprettingsmål og avhengigheter er eksplisitte.',
        'Den konkrete tjenesten og konfigurasjonen dokumenterte relevant automatikk, ikke bare regionparet.',
        'En egen test også beviste gjenoppretting; SLA alene gjør ikke det.',
      ],
    },
    'forecast-change': {
      title: 'Et budsjett etter en produktendring',
      situation:
        'Siste måneds bruk er kjent. Neste måned får produktet større filer og en ny brukergruppe. Økonomiansvarlig ønsker et kostnadsanslag og utviklerne ønsker jevn svartid. Ingen har målt den nye filbehandlingen.',
      facts: [
        'Historiske målinger gjelder den gamle arbeidslasten.',
        'Et estimat er ikke en garanti.',
        'Ytelse og kostnad må vurderes hver for seg.',
      ],
      decisions: [
        'Anta uendret kostnad og ytelse fordi forrige måned var stabil',
        'Bruk bare tjenestens SLA som budsjett',
        'Oppdater bruksantakelser, angi usikkerhet og test den nye belastningen',
      ],
      reasons: [
        'Usikker etterspørsel og endret ressursbruk påvirker prognosen; belastningstest kan undersøke ytelse.',
        'Autoskalering tilpasser kapasiteten; derfor kan det gamle totalbudsjettet beholdes uten nye bruksantakelser.',
        'En SLA beskriver avtalt tilgjengelighet og kan derfor brukes direkte som estimat for forbrukskostnaden.',
      ],
      decisive:
        'Endret arbeidsmengde gjør gamle observasjoner utilstrekkelige som eneste prognosegrunnlag.',
      decisionFeedback: [
        'Stabile historiske tall må suppleres med de nye kravene.',
        'Tilgjengelighetsvilkår er ikke en kostnadsprognose.',
        'Dette skiller prognose, usikkerhet og empirisk ytelsesundersøkelse.',
      ],
      decisionWhen: [
        'Arbeidslast og ressursbruk faktisk var uendret og usikkerheten fortsatt ble oppgitt.',
        'Behovet gjaldt tilgjengelighetsvilkår.',
        'Antakelser oppdateres når nye observasjoner foreligger.',
      ],
      reasonFeedback: [
        'Dette forklarer begge typer predictability uten å love et bestemt utfall.',
        'Mer kapasitet kan øke kostnaden; skalering er ingen fastprisgaranti.',
        'SLA og forbruksmåling har forskjellige formål.',
      ],
      reasonWhen: [
        'Forutsetninger og testgrenser er tydelige.',
        'Et særskilt verifisert fastpristilbud faktisk gjaldt, ikke på grunn av autoskalering.',
        'En separat prisliste og bruksmodell også var vurdert.',
      ],
    },
    'accepted-configuration': {
      title: 'En publisert kundetjeneste',
      situation:
        'En organisasjonsregel kontrollerer bare location for Web Apps i et bestemt abonnement. En ny app blir akseptert i en tillatt region. En gjennomgang finner at appens egen kode lar uvedkommende lese kundedata. Teamet hevder at policygodkjenningen beviser compliance.',
      facts: [
        'Regelen evaluerer location og aktuell ressurstype.',
        'Applikasjonstilgangen er ikke kontrollert av denne regelen.',
        'Ingen full compliance-revisjon er gjennomført.',
      ],
      decisions: [
        'Undersøk og rett datatilgangen; behold regionregelen som én av flere kontroller',
        'Avslutt sikkerhetsgjennomgangen siden opprettelsen ble godkjent',
        'Flytt appen til en annen tillatt region som eneste tiltak',
      ],
      reasons: [
        'Appen ble tillatt i riktig region; det samme resultatet viser at kundedataene har forsvarlig applikasjonstilgang.',
        'En avgrenset governance-kontroll kan være oppfylt samtidig som andre sikkerhetskrav brytes.',
        'Policyen er et compliance-verktøy; godkjent opprettelse dokumenterer derfor hele organisasjonens etterlevelse.',
      ],
      decisive:
        'Aksept viser bare at den relevante regelbetingelsen ikke avviste konfigurasjonen. Datatilgang krever andre tiltak.',
      decisionFeedback: [
        'Dette håndterer den faktiske sikkerhetsfeilen uten å forkaste governance.',
        'Akseptert ressurs er ikke bevis for sikker kode eller samlet compliance.',
        'Geografiflytting retter ikke den beskrevne tilgangsfeilen.',
      ],
      decisionWhen: [
        'Datatilgang undersøkes og resultatet verifiseres.',
        'Alle relevante sikkerhets- og compliancekrav også var uavhengig kontrollert.',
        'Problemet faktisk var en ikke-tillatt geografisk plassering.',
      ],
      reasonFeedback: [
        'Location og applikasjonsautorisasjon er ulike egenskaper.',
        'Dette avgrenser hva policyresultatet faktisk dokumenterer.',
        'Policy kan støtte governance, men én regel dekker ikke enhver plikt.',
      ],
      reasonWhen: [
        'En separat verifisert kodekontroll også var oppfylt; location alene er utilstrekkelig.',
        'Regelens scope, type og effekt er undersøkt.',
        'En full revisjon faktisk var utført mot alle krav; ikke fra én policy alene.',
      ],
    },
    'signed-in-operator': {
      title: 'Innlogget, men kan ikke endre',
      situation:
        'En driftsmedarbeider logger inn med godkjent identitet. Hun skal lese status i én testressursgruppe, men skal ikke endre produksjon. Pålogging lykkes. Et forslag er å gi Owner på hele abonnementet for å gjøre arbeidet enklere.',
      facts: [
        'Identiteten er bekreftet.',
        'Oppgaven krever bare lesing i test.',
        'Ingen ressursopprettelse eller policyendring er nødvendig.',
      ],
      decisions: [
        'Gi Owner på hele abonnementet',
        'Bruk en egnet leserolle på det nødvendige test-scope',
        'Endre bare den tillatte ressursregionen',
      ],
      reasons: [
        'Påloggingen bekrefter hvem medarbeideren er; den kan brukes som grunnlag for å gi bredere rettigheter enn lesing.',
        'Regionregelen avgrenser ressursbruken; dermed gir den også medarbeideren nødvendig tilgang til ressursgruppen.',
        'Autorisasjon bestemmer tillatte handlinger og scope; den bør tilpasses den konkrete leseoppgaven.',
      ],
      decisive:
        'Bekreftet identitet og tillatte handlinger er ulike spørsmål. Oppgaven trenger begrenset lesetilgang.',
      decisionFeedback: [
        'Owner gir langt bredere myndighet enn oppgaven trenger.',
        'Et tilpasset read-scope møter oppgaven med mindre tilgang.',
        'Location-regelen løser ikke behovet for leserettighet.',
      ],
      decisionWhen: [
        'Et særskilt godkjent administrativt behov krevde disse rettighetene.',
        'Rollen og scope faktisk gir nødvendig lesing.',
        'Problemet gjaldt ressursens location.',
      ],
      reasonFeedback: [
        'Pålogging bekrefter identitet, ikke alle tillatelser.',
        'Regler for ressurskonfigurasjon er ikke en RBAC-rolletildeling.',
        'Dette skiller authentication fra authorization.',
      ],
      reasonWhen: [
        'En separat rolletildeling også ga den aktuelle operasjonen.',
        'En separat rolletildeling faktisk ga lesetilgangen.',
        'Oppgaven og omfanget er kjent som her.',
      ],
    },
    'manual-drift': {
      title: 'Tre testmiljøer med ulike verdier',
      situation:
        'Mandag setter en gjennomgått mal timeout til 30 sekunder i tre miljøer. Fredag endrer en operatør ett miljø til 120 sekunder i Portal utenfor pipeline. Pipeline viser fortsatt grønt fra mandag. Teamet skal identifisere dagens avvik og undersøke endringen før noe overskrives.',
      facts: [
        'Ønsket verdi er 30 sekunder; siste pipeline-resultat er fra før endringen.',
        'Den versjonerte parameterfilen viser fortsatt 30 sekunder etter fredagens endring.',
        'Teamet har lesetilgang til både ressursverdiene og versjonshistorikken.',
      ],
      decisions: [
        'Bruk siste vellykkede pipeline-status som eneste tilstandskontroll',
        'Anta at Portal-endringen oppdaterte den versjonerte malen',
        'Sammenlign nåværende ressursverdier med kilden og undersøk endringen før kontrollert retting',
      ],
      reasons: [
        'Ønsket konfigurasjon og faktisk tilstand må sammenlignes; en tidligere mal-kjøring håndhever ikke senere endringer.',
        'Siste vellykkede pipeline-kjøring dokumenterer fortsatt dagens verdier selv etter en separat Portal-endring.',
        'Samme malfil for alle miljøer betyr at manuelle etterfølgende endringer allerede blir regnet som godkjente.',
      ],
      decisive:
        'Problemet er drift etter en tidligere korrekt kjøring. Et historisk grønt resultat beviser ikke dagens konfigurasjon.',
      decisionFeedback: [
        'Siste kjøring er eldre enn den observerte endringen og viser ikke dagens verdi.',
        'En direkte Portal-endring skriver ikke automatisk tilbake til den versjonerte malen.',
        'Dette bruker management of the cloud; Portal/CLI/API beskriver hvordan operasjonen utføres.',
      ],
      decisionWhen: [
        'Du bare skulle undersøke det historiske deploy-resultatet, ikke dagens tilstand.',
        'En eksplisitt kontrollert prosess faktisk hadde oppdatert og gjennomgått kilden.',
        'Malen og parameterne er godkjent, og resultatet kontrolleres.',
      ],
      reasonFeedback: [
        'Dette skiller en repeterbar opprettelse fra senere observasjon og kontroll av drift.',
        'En gammel status er historisk evidens og kan ikke utelukke en senere endring.',
        'Lik kilde utelukker ikke at faktisk tilstand er endret utenfor den kilden.',
      ],
      reasonWhen: [
        'Det finnes en definert ønsket tilstand og nye observasjoner som kan sammenlignes.',
        'Ingen senere endring kunne forekomme og formålet bare var historisk dokumentasjon.',
        'En godkjent prosess eksplisitt registrerte endringen i kilden.',
      ],
    },
    'repeatable-error': {
      title: 'Tre miljøer etter en pipeline-kjøring',
      situation:
        'En pipeline bruker samme mal og samme parameterfil i alle miljøer. En parameter peker på feil applikasjonsmiljø. Alle kjøringer lykkes teknisk og gjentar den uønskede verdien. Teamet vil øke antall automatiske kjøringer for å gjøre løsningen riktig.',
      facts: [
        'Alle tre inspeksjoner viser miljøverdien test.',
        'Endringsbestillingen krever produksjonsmiljøet; parameterfilen velger test.',
        'Dette er en analyse av konfigurasjon, ikke en faktisk ny pipeline-motor.',
      ],
      decisions: [
        'Rett og valider ønsket parameter, kjør kontrollert og inspiser resultatet',
        'Kjør samme feilaktige kilde oftere',
        'Bytt til API uten å endre parametere',
      ],
      reasons: [
        'Alle kjøringene er teknisk vellykkede; flere repetisjoner er derfor tilstrekkelig verifikasjon av miljøvalget.',
        'Automatisering gjentar kilden; konsistens og faglig korrekthet må vurderes separat.',
        'API-grensesnittet validerer ressurskommandoen og kjenner derfor også organisasjonens tilsiktede miljø.',
      ],
      decisive:
        'En repeterbar feil krever retting av ønsket tilstand, ikke bare en ny betjeningsmåte eller flere repetisjoner.',
      decisionFeedback: [
        'Dette retter årsaken og undersøker konsekvensen.',
        'Flere gjentakelser sprer samme feil.',
        'Transport-/betjeningsmåten endrer ikke den gale verdien.',
      ],
      decisionWhen: [
        'Korrekt miljøvalg er bekreftet og endringen testes.',
        'Kilden allerede var riktig og bare en midlertidig kjøringsfeil gjensto.',
        'API-kallet også brukte rettet konfigurasjon.',
      ],
      reasonFeedback: [
        'Teknisk suksess er ikke det samme som et riktig kravvalg.',
        'Dette forklarer hvorfor konsistens alene ikke er nok.',
        'API-validering kjenner ikke nødvendigvis organisasjonens intensjon.',
      ],
      reasonWhen: [
        'Verdien først ble korrigert og kontrollert.',
        'Kilden er den beskrevne feilårsaken.',
        'Et eksplisitt implementert krav faktisk ble validert; det kan ikke antas.',
      ],
    },
    'kernel-workload': {
      title: 'Et spesialisert beregningsverktøy',
      situation:
        'Et lisensiert verktøy krever en bestemt gjeste-OS-utgave og en støttet kernel-driver. Leverandøren støtter installasjon på en passende VM, men ikke på den vurderte administrerte webplattformen. Virksomheten har et team som kan sikre, oppdatere og drifte gjesteoperativsystemet.',
      facts: [
        'Kravenes OS- og driverstøtte er kontrollert i dette scenarioet.',
        'Verktøyet kan ikke erstattes av en ferdig tjeneste.',
        'Ingen påstand om at alle VM-er støtter alle drivere.',
      ],
      decisions: [
        'Velg ferdig samarbeids-SaaS',
        'Velg en støttet IaaS VM-konfigurasjon',
        'Velg den vurderte PaaS-webplattformen uten støtteendring',
      ],
      reasons: [
        'PaaS har en administrert runtime; dette gir teamet de samme kernel-endringsmulighetene som i en VM.',
        'Leverandøren vedlikeholder SaaS-stakken; kundens driver kan derfor plasseres der uten eget OS-arbeid.',
        'IaaS kan gi nødvendig gjeste-OS-kontroll, med beholdt ansvar for patching og sikker konfigurasjon.',
      ],
      decisive:
        'Det verifiserte OS-/driverbehovet og tilgjengelig driftskompetanse gjør IaaS egnet her.',
      decisionFeedback: [
        'Et ferdig samarbeidsprodukt leverer ikke den nødvendige spesialprogramvaren.',
        'En støttet VM møter kontrollbehovet; drift og tilgang forblir kundens oppgaver.',
        'Den oppgitte plattformen støtter ikke det nødvendige inngrepet.',
      ],
      decisionWhen: [
        'Den ferdige tjenesten faktisk løste forretningsbehovet uten spesialverktøyet.',
        'Image, driver, lisens og profil er støttet.',
        'Programmet ble tilpasset en støttet plattform uten driverkravet.',
      ],
      reasonFeedback: [
        'Managed plattform gir ikke generelt gjeste-kernel-kontroll.',
        'SaaS er en ferdig applikasjon, ikke generell OS-administrasjon.',
        'Dette kobler kontrollkravet til det operative ansvaret.',
      ],
      reasonWhen: [
        'En annen tjeneste eksplisitt tilbød slik kontroll; ikke som generell PaaS-egenskap.',
        'Et separat IaaS-miljø faktisk ble brukt, ikke SaaS alene.',
        'De oppgitte støttekravene er kontrollert.',
      ],
    },
    'ready-collaboration': {
      title: 'Samarbeid uten egen applikasjon',
      situation:
        'En liten forening trenger kalender, dokumentdeling og møter. Et vurdert abonnementprodukt dekker behovene og kan integreres med den støttede identitetsløsningen. Ingen særskilt egen kode kreves. Foreningen har ikke kapasitet til å vedlikeholde en egen applikasjon eller et gjeste-OS.',
      facts: [
        'Produktets funksjonalitet og integrasjon er allerede undersøkt.',
        'Foreningen må fortsatt styre medlemmer, tilgang og data.',
        'Dette er et tjenestevalg, ikke opprettelse av en ARM-ressurs.',
      ],
      decisions: [
        'Bruk den vurderte ferdige SaaS-tjenesten',
        'Bygg en ny applikasjon på en VM',
        'Bygg tilsvarende funksjonalitet på PaaS',
      ],
      reasons: [
        'Leverandøren vedlikeholder SaaS-applikasjonen og har derfor også ansvaret for å avgjøre foreningens medlemskap og datadeling.',
        'Ferdig funksjonalitet møter behovet uten egen programdrift; tilgang og data er fortsatt kundens ansvar.',
        'PaaS gir et komplett utviklingsmiljø; derfor er den ferdige møte- og kalenderfunksjonaliteten allerede levert.',
      ],
      decisive:
        'Kravet gjelder ferdig funksjonalitet og lite operativ kapasitet, ikke kontroll over egen kode eller OS.',
      decisionFeedback: [
        'Den kontrollerte SaaS-tjenesten passer behovet.',
        'Dette innfører applikasjons- og OS-drift som foreningen ikke kan bære.',
        'PaaS reduserer plattformdrift, men bygger ikke automatisk den ferdige applikasjonen.',
      ],
      decisionWhen: [
        'Funksjoner, datavilkår og identitetsintegrasjon fortsatt er egnet.',
        'Egen programvare og OS-kontroll faktisk var nødvendig, med driftskapasitet.',
        'Egen kode var nødvendig og utviklingskapasitet fantes.',
      ],
      reasonFeedback: [
        'Kundens medlemskap, deling og databruk må fortsatt styres.',
        'Dette knytter tjenestevalg til både funksjonalitet og gjenværende ansvar.',
        'En plattform er ikke det samme som en ferdig forretningsapplikasjon.',
      ],
      reasonWhen: [
        'En særskilt tjenesteavtale dekket en oppgave; kunden må likevel undersøke ansvaret.',
        'De undersøkte kravene er oppfylt.',
        'En separat ferdig applikasjon også ble levert som tjeneste.',
      ],
    },
    'two-valid-hosts': {
      title: 'Hosting for en ny webtjeneste',
      situation:
        'Et team har egen webkode som er støttet både på en VM og på den vurderte App Service-plattformen. Det er ikke behov for kernel-endringer. Teamet har kapasitet til begge driftsmodeller. Det finnes verken krav om minst mulig OS-drift eller full OS-kontroll; ønsket er et teknisk forsvarlig valg med ærlig ansvarsvurdering.',
      facts: [
        'Begge hostingalternativene oppfyller de oppgitte kodekravene.',
        'Ingen skjult kostnadsrangering skal antas.',
        'Et ferdig SaaS-produkt dekker ikke den egne koden.',
      ],
      decisions: [
        'Bruk SaaS som ikke støtter den egne koden',
        'Bruk App Service med støttet runtime',
        'Bruk en støttet VM-konfigurasjon',
      ],
      reasons: [
        'PaaS passer støttet kode og lar leverandøren håndtere plattform-OS; kunden beholder kode, data og tilgang.',
        'IaaS er gyldig med teamets driftskapasitet; kunden må drifte og oppdatere gjeste-OS.',
        'Begge hostingtjenestene validerer opprettelsen; dette resultatet dekker også kundens kode- og tilgangsansvar.',
      ],
      decisive:
        'To ulike beslutninger er gyldige, men bare med begrunnelsen som passer den valgte driftsmodellen.',
      decisionFeedback: [
        'Det foreslåtte produktet kan ikke levere den egne koden.',
        'App Service er faglig gyldig med riktig plattformbegrunnelse.',
        'VM er også faglig gyldig her med riktig vurdering av gjeste-OS-ansvaret.',
      ],
      decisionWhen: [
        'Et ferdig produkt faktisk kunne erstatte kodekravet.',
        'Støttet runtime og kundens applikasjonsansvar ivaretas.',
        'Støttet VM og kundens OS-drift ivaretas.',
      ],
      reasonFeedback: [
        'Dette er en korrekt begrunnelse for PaaS, men ikke for VM.',
        'Dette er en korrekt begrunnelse for IaaS, men ikke for PaaS.',
        'Teknisk aksept fjerner ikke kode-, data- og tilgangsansvar.',
      ],
      reasonWhen: [
        'Beslutningen er den støttede App Service-plattformen.',
        'Beslutningen er den støttede VM-en.',
        'Ingen av de beskrevne modellene gjør kunden ansvarsfri.',
      ],
    },
  },
} as const;
// P04 original teaching manuscript, authored before its presenter. No live prices/data.
export const costNb = {
  hierarchyPrerequisite: 'Subscription / Resource group',
  title: 'Describe cost management in Azure',
  path: 'Introduction to Cloud Infrastructure: Describe Azure management and governance',
  intro: 'Fra ressursvalg til økonomisk beslutning',
  overview:
    'Forstå kostnadsdrivere, bygg et begrunnet estimat, undersøk et avvik og fordel kostnader. Fire guidede undersøkelser og nye selvstendige situasjoner bruker tydelig fiktive data.',
  available: 'Første modul tilgjengelig · resten av læringsstien er planlagt',
  planned: ['Governance og compliance', 'Deployment og administrasjonsverktøy', 'Monitoring'],
  synthetic: 'Fiktive undervisningsdata – ikke faktiske Azure-priser eller registrerte kostnader.',
  currency: 'ØK',
  units:
    'ØK betyr øvelseskroner. Alle satser er oppdiktet. Denne modellen bruker 30 døgn × 24 timer = 720 timer per periode. En GB er en datamengde; GB-døgn er lagret mengde multiplisert med antall døgn. 1 000 operasjoner er én priset operasjonsenhet. Dette er ikke et universelt Azure-faktureringsintervall.',
  prerequisite:
    'Bygger på måling og prising i Cloud Computing, tjenestevalgene i Service Types og skillet mellom subscription, resource group og fysisk lokasjon. Gjenta de konkrete begrepene nedenfor ved behov.',
  topics: {
    introduction: 'Hvorfor koster løsningen penger?',
    drivers: 'Kostnadsdrivere og fakturerbart forbruk',
    estimate: 'Pricing Calculator · bygg og sammenlign',
    analysis: 'Cost Analysis · undersøk et avvik',
    budgets: 'Budgets · kostnad og prognose',
    tags: 'Tags · organisering og kostnadsfordeling',
    optimization: 'Optimalisering med driftskrav',
    assessment: 'Selvstendig økonomisk anvendelse',
    summary: 'Hva har du dokumentert?',
  },
  sections: {
    introduction: {
      title: 'Én applikasjon, flere økonomiske mekanismer',
      paragraphs: [
        'Et lite katalogteam skal tilby en nettapplikasjon. De vurderer en Virtual Machine eller egen kode i App Service, med lagring og trafikk. To løsninger kan ha like mange ressurser og likevel gi svært ulik kostnad. En ressurs er en administrativ enhet, ikke en universell faktureringsenhet.',
        'Begynn med behovet: når skal tjenesten være tilgjengelig, hvor mye arbeid skal utføres, hvilke data skal beholdes, og hva må teamet selv drifte? Deretter identifiseres tjenestene og deres målbare kostnadsdrivere. Et tall uten disse forutsetningene er vanskelig å etterprøve.',
        'Økonomiarbeidet har en krets: estimer før valget, observer kostnadsdata etter forbruk, undersøk avvik, gjør et begrunnet tiltak og kontroller konsekvensene. Et budsjett uttrykker organisasjonens plan. En prognose forsøker å si hvor trenden kan ende. Ingen av dem er en faktura.',
        'Du skal bruke fire lokale workbencher. De oppretter verken ressurser, budsjetter, tagger eller betaling i Azure. Egne Portal-ressurser kan gi kjent teknisk kontekst, men ikke oppdiktede driftstimer eller historiske regninger. Selvstendige scenarioer har andre krav enn de guidede undersøkelsene.',
      ],
      terms: [
        [
          'FinOps',
          'Samarbeid om økonomisk ansvar og verdi i skybruk, med tekniske og organisatoriske beslutninger.',
        ],
        ['Scope', 'Avgrensningen av hvilke kostnader eller ressurser en undersøkelse gjelder.'],
      ],
      example:
        'Et team estimerer en løsning før lansering. Senere øker trafikken. Et nytt estimat kan forklare en mulig endring, men registrerte kostnadsposter må undersøkes for å finne hva som faktisk bidro til avviket.',
      limit:
        'Kurset gir lokale, avgrensede læringsobservasjoner. Det gir ingen Microsoft Learn-fullføring, betalingsråd for en virkelig organisasjon eller garanti om eksamensberedskap.',
    },
    drivers: {
      title: 'Kapasitet, nyttig arbeid og fakturerbar mengde er forskjellige',
      paragraphs: [
        'Kapasitet er det løsningen kan levere. Nyttig arbeid er det applikasjonen faktisk får gjort. Fakturerbar mengde er det tjenestens prisregel måler. En allokert VM kan ha lav CPU-belastning, men fortsatt gi compute-kostnad. Å stoppe et program inne i operativsystemet er ikke nødvendigvis det samme som å deallokere compute gjennom Azure.',
        'Tjeneste og ressurstype avgjør hvilke målere som er relevante. En VM kan ha compute-tid, programvarelisens, disker og nettverk. En App Service plan representerer hostingkapasitet; en Web App-referanse til en plan betyr ikke at all lagring og alle tilleggstjenester er gratis. Storage kan prises etter kapasitet, operasjoner, tilgangsnivå og redundans. Ulike tjenester må derfor ikke gis samme prisformel.',
        'SKU og tier beskriver et tjenestetilbud, for eksempel kapasitet og egenskaper. Større profiler og andre tjenestenivåer kan endre kostnaden. Region påvirker tjenestetilbud og pris. Velg først en løsning som oppfyller krav til kapasitet, forsinkelse, databehandling og tilgjengelighet; en lavere regionspris opphever ikke disse kravene.',
        'Lagring kan bestå selv om compute ikke lenger er allokert. Disker, beholdte data, backup og andre tilknyttede tjenester må undersøkes separat. Antall operasjoner kan være en egen måler. Nettverkskostnad avhenger blant annet av retning, tjeneste, mengde og overføringsvei. En billing zone for båndbredde er ikke en Availability Zone. Ikke anta at all trafikk inn, ut eller mellom regioner har samme pris.',
        'Lisensiering, Marketplace-tilbud, support og avtale påvirker totalen. Et bilde med kommersiell programvare kan ha andre kostnader enn et alternativ uten den lisensen. Gyldige lisensfordeler krever egne vilkår. Tilbud kan gi inkluderte mengder eller rabatter. Kostnadsestimatet bør angi hva det inkluderer, og hva som må undersøkes videre.',
      ],
      terms: [
        ['Meter', 'En definert måler som knytter en bruksmengde til en prisregel.'],
        [
          'SKU / tier',
          'En bestemt ressursprofil eller et tjenestenivå med egne egenskaper og prisvilkår.',
        ],
      ],
      example:
        'Et annet, rent regneeksempel: 3 instanser × 100 allokerte timer × 2 ØK per instanstime = 600 ØK i compute. 40 GB lagring × 0,50 ØK per GB-periode = 20 ØK i tillegg. Halvert compute-tid endrer ikke automatisk den beholdte lagringsmengden.',
      limit:
        'Dette er oppdiktede satser. Modellen måler verken CPU, reelt arbeid, Azure-timer, lisensrettigheter eller energi. Den beviser ikke at en billigere profil kan utføre samme arbeid.',
    },
    estimate: {
      title: 'Et estimat er en etterprøvbar samling antakelser',
      paragraphs: [
        'Azure Pricing Calculator brukes til å undersøke forventet kostnad før man velger og oppretter tjenester. Legg til et produkt, velg relevant region, OS, størrelse eller tier, og oppgi forventede mengder. Standardverdier er utgangspunkt, ikke observasjoner av din applikasjon. Flere produkter må inngå når løsningen trenger flere tjenester.',
        'Kalkulatoren kobler produktets prisdata til de angitte konfigurasjonene og mengdene. Tidsbasert compute kan beregnes fra antall instanser og timer. Andre poster bruker andre enheter. Prisplaner og eventuelle forskuddsbeløp må vurderes sammen med løpende kostnad. Å legge et produkt til et estimat oppretter ingen ressurs.',
        'Bygg et lavt og et høyt forbrukstilfelle med samme driftskrav. Undersøk hva som faktisk endres i hver linje. Mangler databasen, diskene, utgående trafikk, lisens eller support, er ikke summen et komplett løsningsestimat. En mulig rabatt bør undersøkes etter at forbruk og støttevilkår er avklart.',
        'Den offentlige kalkulatoren kan brukes uten Azure-konto til produktvalg og estimat. Innlogging kan være nødvendig for lagring, deling eller avtalespesifikke priser. Ikke oppgi konto eller betalingsinformasjon for denne øvelsen. Faktisk pris kan avhenge av avtale, dato, valuta og bruk; et estimat er ingen faktura eller garantert pristilbud.',
      ],
      terms: [
        [
          'Estimated cost',
          'Beregnet fremtidig kostnad basert på valgte konfigurasjoner, satser og antakelser.',
        ],
        [
          'Forutsetning',
          'En eksplisitt antakelse som kan kontrolleres og endres, for eksempel antall allokerte timer.',
        ],
      ],
      example:
        'Legg compute, beholdt lagring og trafikk inn som egne poster. Endre én antakelse om gangen og behold begge alternativene. Da kan du forklare forskjellen uten å tilskrive hele endringen til antall ressurser.',
      limit:
        'Azure Cost Explorer nedenfor er vår egen undervisningsmodell. Den henter ikke Azure-priser og erstatter ikke Microsofts kalkulator eller avtalevilkår.',
    },
    analysis: {
      title: 'Fra forventning til registrerte kostnadsposter',
      paragraphs: [
        'Microsoft Cost Management hjelper en organisasjon å synliggjøre, analysere, følge opp og optimalisere kostnader. Cost Analysis brukes når spørsmålet er hva kostnadsdataene viser: velg scope og periode, grupper etter for eksempel tjeneste eller ressursgruppe, og filtrer for å undersøke en mulig årsak. En ny beregning i Pricing Calculator sier ikke hva som allerede har skjedd.',
        'Scope bestemmer hvilken del av organisasjonens kostnader du ser. Tilgjengelige scopes, datatyper og funksjoner avhenger av avtale og rettigheter. Billing account og management subscription er ikke samme begrep. En filtrert lav sum betyr ikke at kostnader utenfor filteret er borte. Sammenlign like lange og relevante perioder.',
        'Et avvik kan skyldes pris, mengde eller sammensetning. Flere instanstimer øker mengden. En endret sats kan gi mer kostnad uten mer arbeid. En større andel av en dyrere ressursklasse endrer miksen. Undersøk linjene og enhetene før du konkluderer. En stor nåværende post trenger ikke være posten med størst økning.',
        'Registrert actual cost i Cost Analysis betyr kostnadsdata som er kommet inn i perioden, i motsetning til en framtidsprognose. Data publiseres og bearbeides med forsinkelse som kan variere med tjeneste og tilbud. Åpen periodes beløp kan revideres. Ikke likestill disse postene med endelig faktura; blant annet kreditter, avgifter og enkelte kjøp kan behandles annerledes.',
        'Forecasting bruker tilgjengelig historikk og antakelser til å anslå framtidig utvikling. Endrede bruksmønstre og sent ankomne data gir usikkerhet. En prognose er verken en SLA, en betalingsforpliktelse eller en bekreftelse på hva neste faktura blir. Cost alerts og Azure Advisor kan gi oppfølgingssignaler; organisasjonen må undersøke og vurdere tiltakene.',
      ],
      terms: [
        [
          'Actual cost',
          'Registrerte kostnadsposter for en periode; åpen periodes data er ikke nødvendigvis endelig faktura.',
        ],
        [
          'Forecast',
          'En framskriving med usikkerhet, basert på historikk og en valgt beregningsmåte.',
        ],
      ],
      example:
        'Sammenlign dag 1–10 med dag 11–20 i vårt faste septemberdatasett. Filtrer på App Sandbox. Sammenlign compute-mengde, kapasitetsmiks og trafikkens sats hver for seg. Hver modellpost viser dato, mengde, enhet og sats.',
      limit:
        'Dataposter i benken er syntetiske observasjoner med en fast dato, ikke Azure-telemetri. Prognosen bruker vårt enkle siste 10 døgns gjennomsnitt, ikke Microsofts interne beregningsalgoritme.',
    },
    budgets: {
      title: 'Et budsjett synliggjør avvik; det stanser ikke forbruket',
      paragraphs: [
        'Et Azure-budget følger kostnader innen et valgt scope, eventuelt med filtre, i en definert periode. Velg først hvem og hva budsjettet gjelder. Deretter velges periode, beløp og terskler. Et månedsbudsjett og en årsprognose kan ikke sammenlignes direkte uten å avklare tidsvinduet.',
        'Et actual-varsel sammenligner akkumulert registrert kostnad med en prosent av budsjettet. Et forecast-varsel vurderer fremskrevet kostnad mot den valgte terskelen. Dermed kan en prognose varsle et kommende avvik selv om den registrerte kostnaden fortsatt er under grensen. Et lavt actual-beløp er heller ikke bevis på at alle nye kostnader har kommet inn.',
        'Varsler forutsetter at data er behandlet og budsjettet evaluert. De er ikke en sanntidsbryter. En organisasjon må ha mottakere, ansvar og en handlingsrutine. Den kan kontrollere endret bruk, vurdere kapasitet og ta en konkret beslutning som fortsatt ivaretar drift.',
        'Vanlige budsjettvarsler stopper ikke ressurser eller forbruk. Separat konfigurert automatisering kan knyttes til varsler, blant annet gjennom action groups ved støttede subscription- og resource group-scopes. Da er det den ekstra automatiseringen som gjør handlingen. Den må utvikles, testes og avgrenses; den følger ikke automatisk av budsjettbeløpet.',
      ],
      terms: [
        ['Budsjett', 'En planlagt økonomisk grense for et bestemt scope og tidsvindu.'],
        ['Terskel', 'Nivået som skal undersøkes, for eksempel 80 prosent av et månedsbudsjett.'],
      ],
      example:
        'I et separat regneeksempel er budsjettet 1 000 ØK og actual-terskelen 80 prosent: terskelbeløpet er 800 ØK. Registrert 700 ØK er under denne terskelen, mens en prognose 1 100 ØK kan begrunne et forecast-varsel på 100 prosent.',
      limit:
        'Benken oppretter ingen Azure-budget, sender ingen e-post og stanser ingen VM. Resultatet er bare en lokal demonstrasjon av sammenligning og riktig oppfølging.',
    },
    tags: {
      title: 'Metadata gir en rapportdimensjon, ikke en sikkerhetsgrense',
      paragraphs: [
        'En Azure-tag er et key-value-par. Environment=Production, Department=Finance, CostCenter=IT og Owner=Operations kan beskrive miljø, avdeling, kostnadsansvar og driftsansvar. Avtal hvilke nøkkelnavn og verdier som brukes, hvem som vedlikeholder dem og hvordan manglende verdier skal håndteres. Bruk organisatoriske roller framfor personopplysninger.',
        'Tags kan brukes til søk, filtrering, rapportering og automatiseringsutvalg. De kan klassifisere at en ressurs håndterer konfidensielle data, men håndhever ikke i seg selv tilgang, kryptering eller compliance. Sensitive opplysninger og hemmeligheter hører ikke hjemme i tags; metadata kan være synlig i rapporter, verktøy og eksport.',
        'Ressurser arver ikke automatisk Resource group- eller subscription-tags i ARM-ressursmodellen. Azure Policy kan kreve eller modifisere tags under bestemte regler; eksisterende ressurser kan kreve eksplisitt remediation. En slik policy er en annen mekanisme enn vanlig foreldre-/barn-organisering.',
        'Cost Management tag inheritance er en separat rapportfunksjon ved støttede avtaler og scopes. Den kan legge foreldre-metadata til underliggende usage records uten å endre selve ressursens tags. Konfliktvalg kan beholde ressursverdien eller foretrekke den arvede verdien. Se alltid hvilken dimensjon og datakilde du undersøker.',
        'Ikke alle ressurstyper støtter tags eller sender dem med til kostnadsrapporten. Vanlige ressurs-tags fyller heller ikke automatisk all tidligere forbrukshistorikk. Manglende metadata bør vises som ufordelt kostnad. Å skjule denne kategorien gir en misvisende lav avdelingssum, ikke lavere total kostnad.',
      ],
      terms: [
        ['Resource tag', 'Metadata på selve ressursen, adskilt fra dens tilgangsregler.'],
        [
          'Rapportarv',
          'Her: eksplisitt anvendelse av foreldre-tags på syntetiske kostnadsposter, uten ressursendring.',
        ],
      ],
      example:
        'Gruppen har Department=Product. Disken mangler Department. Før rapportarv blir diskens kostnad ufordelt. Etter eksplisitt rapportarv kan rapporten klassifisere posten som Product, mens diskens direkte tag fortsatt mangler.',
      limit:
        'Du redigerer et merket undervisningsdatasett, aldri faktiske Portal-tags. Case-sensitive verdier som Finance og finance kan splitte rapportering; taggnavn behandles annerledes av Azure-operasjoner. Bruk en konsekvent, dokumentert konvensjon.',
    },
    optimization: {
      title: 'Fjern sløsing før du binder deg til den',
      paragraphs: [
        'Optimalisering begynner med bruk og krav: hvilke ressurser er nødvendige, når trengs de, og hvilken kapasitet og tilgjengelighet kreves? Rightsizing er å velge en passende profil etter måling og testing. En lavere pris som gir utilstrekkelig minne, lengre svartid eller brudd på driftskrav er ikke en god økonomisk løsning.',
        'Undersøk ubrukt kapasitet og beholdte avhengigheter. Planlagt deallokering av egnet test-compute kan redusere compute-tid, mens disk, data og andre kostnader består. Ikke slett en tilsynelatende ubrukt ressurs uten å kontrollere eierskap, gjenoppretting og avhengigheter. Azure Advisor kan anbefale resize eller shutdown fra analyserte signaler; anbefalinger må vurderes i løsningens kontekst.',
        'Reservations er betalingsfordeler for matching bruk etter produktets vilkår, typisk over ett eller tre år. Ressurstype, region og andre egenskaper kan begrense bruken. En compute-reservasjon er ikke det samme som en kapasitetsreservasjon eller automatisk failover. Rabatt gir ingen garanti for utnyttelse; feil dimensjonert binding kan bli dyr selv med lav enhetspris.',
        'Azure savings plan for compute bygger på et fast timebeløp over ett eller tre år. Fordelen brukes på kvalifisert compute innen relevant scope, med større fleksibilitet på tvers av støttede tjenester og regioner. Ubrukt timeforpliktelse flyttes ikke til neste time. Bruk utover fordelen prises etter relevante vilkår. Programvare, nettverk og lagring er ikke automatisk dekket av denne compute-planen.',
        'Spot Virtual Machines bruker ledig kapasitet som kan trekkes tilbake. En jobb med checkpoints, testet restart og fleksibel ferdigstillelse kan passe; en eneste uavbrutt produksjonsinstans gjør det ikke. Ventetid, omkjøring, disker og databevaring må med i vurderingen. Ingen universell rabatt, tilgjengelighet eller sluttkostnad garanteres.',
        'Behold fleksibilitet når etterspørselen er usikker, og vurder en dokumentert, kvalifisert grunnlast før forpliktelse. Bruk kan endre seg etter kjøp. Følg derfor opp faktisk utnyttelse, prognoser, nye krav og kostnadsfordeling som en regelmessig arbeidsprosess, ikke et engangsvalg i kalkulatoren.',
      ],
      terms: [
        ['Rightsizing', 'Å tilpasse ressursprofil og antall til dokumenterte krav og belastning.'],
        [
          'Timeforpliktelse',
          'Beløp som må betales per time i planperioden, også når kvalifisert bruk er lavere.',
        ],
      ],
      example:
        'Et team fjerner en overdimensjonert profil før det vurderer forpliktelse. Deretter undersøker det en stabil, kvalifisert grunnlast og lar usikre topper være fleksible. Dette er en beslutningsrekkefølge, ikke en garantert spareprosent.',
      limit:
        'P04 kjøper ingen reservation eller savings plan, endrer ingen VM og implementerer ingen Advisor-motor. Flere tilbud finnes; sammenligningen gjelder de uttrykkelig beskrevne compute-alternativene.',
    },
  },
  theoryLabels: ['Begreper', 'Gjennomarbeidet eksempel', 'Grenser og moteksempel'],
  publicCalculator: {
    title: 'Valgfri overføring til Microsofts offentlige Pricing Calculator',
    steps: [
      'Åpne Products/Produkter og finn Virtual Machines. Legg produktet til et estimat uten å logge inn.',
      'Velg region, OS og egnet størrelse. Finn antall og timer; erstatt standardmengden med en uttrykkelig antakelse.',
      'Undersøk egne seksjoner for disker, operasjoner og Bandwidth. Legg til andre tjenester som løsningen trenger.',
      'Sammenlign totalsum og komponentposter når én antakelse endres. Finn hva som fortsatt mangler. Ikke opprett konto, lagre avtale eller kjøp noe.',
    ],
    note: 'Flyten ble kontrollert 27. oktober 2026. Språk og felter kan variere. Offentlig konfigurasjon fungerte uten innlogging; lagring/deling og avtalepriser kan kreve innlogging. Den lokale øvelsen er fullstendig uten ekstern aktivitet.',
    open: 'Åpne offentlig Pricing Calculator ↗',
  },
  controls: {
    service: 'Compute-tjeneste',
    count: 'Antall instanser',
    hours: 'Allokerte timer per instans',
    size: 'Kapasitetsklasse',
    region: 'Eksempelregion',
    pricing: 'Prismodell',
    storage: 'Beholdt lagring · GB per periode',
    operations: 'Lagringsoperasjoner · tusen',
    egress: 'Dataoverføring · GB per periode',
    license: 'Programvarelisens',
    support: 'Supporttillegg',
    scope: 'Kostnadsscope',
    group: 'Ressursgruppe i datasettet',
    prediction: 'Din prediksjon før kjøring',
    run: 'Beregn og observer',
    compare: 'Behold som sammenligning A',
    clear: 'Nullstill bare de usendte modellvalgene',
    options: {
      service: ['Virtual Machines', 'App Service plan'],
      size: ['Standard undervisningsprofil', 'Stor undervisningsprofil'],
      region: ['West Europe', 'North Europe'],
      pricing: [
        'Pay-as-you-go',
        'Reservation · kapasitetsforpliktelse',
        'Savings plan · timebeløp',
        'Spot · avbrytbar VM',
      ],
      license: ['Ingen ekstra lisens i modellen', 'Kommersiell tilleggslisens'],
      support: ['Ingen ekstra supportpost', 'Fast supportpost'],
      scope: ['Begge scopes', 'App Sandbox', 'Shared Sandbox'],
      group: ['Alle grupper', 'rg-catalog', 'rg-shared'],
      prediction: ['Velg en prediksjon', 'Lavere total', 'Uendret total', 'Høyere total'],
    },
    line: 'Kostnadselement',
    driver: 'Driver / enhet',
    quantity: 'Mengde',
    rate: 'Fiktiv sats',
    total: 'Beregnet ØK',
    fixed: 'Fast ØK',
    period: 'Periode',
    breakdown: 'Komponentbidrag · samme nullpunkt',
    subtotal: 'Samlet estimat',
    a: 'Sammenligning A',
    b: 'Gjeldende beregning B',
    change: 'Endring B − A',
    stale: 'Valgene er endret. Kjør igjen før du tolker resultatet.',
    noResult:
      'Forutsi først og kjør modellen. Parameterendringer alene er ikke en observert undersøkelse.',
  },
  components: {
    compute: 'Compute',
    license: 'Lisens',
    storage: 'Beholdt lagring',
    operations: 'Lagringsoperasjoner',
    egress: 'Dataoverføring',
    support: 'Support',
  },
  unitLabels: {
    'instance-hour': 'instanstime',
    'GB-period': 'GB-periode',
    'thousand-operations': '1 000 operasjoner',
    GB: 'GB',
    'GB-day': 'GB-døgn',
    period: 'periode',
  },
  serviceLabels: {
    vm: 'Virtual Machines',
    paas: 'App Service plan',
    storage: 'Storage',
    network: 'Bandwidth',
    support: 'Support',
  },
  workbench: {
    comparison:
      'Endre ett relevant vilkår. Første beregning sammenlignes med neste kjøring; du kan velge ny A fra en lagret beregning.',
    delta: 'Forskjell fra forrige sammenligningsgrunnlag',
    predicted: 'Prediksjon',
    observed: 'Beregnet observasjon',
    valid: 'Gyldig modellkjøring lagret',
    invalid: 'En modellverdi er utenfor de dokumenterte grensene.',
    incomplete: 'Følg undersøkelsene som er beskrevet over før du lagrer forklaringen.',
    copyDraft: 'Parameterutkast lagret · ingen ny observasjon før kjøring',
    selectResource: 'Valgfri teknisk referanse',
    noSelection: 'Bruk det fiktive caset',
    summary:
      'Sammenligningen forklarer de angitte antakelsene. Den beviser ikke runtime, faktisk Azure-forbruk eller fakturakostnad.',
    budgetBoth:
      'Undersøk actual 80 prosent og forecast 100 prosent med App Sandbox /600 ØK. Begge må kjøres eksplisitt.',
    tagsBoth:
      'Kjør først uten rapportarv. Klassifiser de to beskrevne postene, og undersøk så både behold ressursverdi og foretrekk gruppeverdi.',
    readRows: 'Vis datatabellen',
    allRows: 'Alle daterte poster i valgt scope',
    estimateNotes: 'Faste satser og regneregler · les før beregning',
    subheading: 'Undersøk, forutsi, beregn og forklar',
    recallUnsafe:
      'Automatisk forklaring er pauset fordi en annen vurdering eller lagring er aktiv/usikker. Bevar arbeidet og gå til riktig kontekst.',
    parent: 'Foreldre',
    location: 'Resource location',
    type: 'Type',
    name: 'Name',
  },
  modelNotes: [
    'Compute: instanser × allokerte timer × valgt fiktiv sats. Region påvirker bare compute-satsen i denne forenklingen.',
    'Storage: GB × 0,10 ØK per hel periode. Operasjoner: tusen × 0,05 ØK. Trafikk: GB × 0,20 ØK. Eventuell lisens: instanstimer × 0,20 ØK. Support: fast 120 ØK.',
    'Standard VM: 1 ØK/time, stor VM: 2. Standard plan: 1,50, stor plan: 3. North Europe-faktoren er her 1,20; dette er et oppdiktet prisforhold.',
    'Reservation: 70 prosent av valgt compute-sats for alle 720 timer per instans, uavhengig av valgt brukstid. Savings: 0,50 ØK per time per instans for alle 720 timer, med 75 prosent av valgt compute-sats brukt mot denne fordelen i hver av de modellerte aktive timene. Overskytende bruk beregnes til PAYG. Dette er regneeksempler, ikke Azure-tilbud.',
    'Spot: 35 prosent av VM-satsen i regneeksemplet. Kjøretid er en antakelse, ikke garantert kapasitet eller faktisk fremdrift. Spot er ikke et planvalg i denne benken.',
  ],
  scopeLabels: {
    app: 'App Sandbox',
    shared: 'Shared Sandbox',
    all: 'Begge scopes',
  },
  analysis: {
    title: 'Undersøk økningen før du foreslår tiltak',
    period: 'Fast datasett · 1.–20. september 2026',
    earlier: 'Dag 1–10',
    later: 'Dag 11–20',
    delta: 'Endring mellom like perioder',
    groupBy: 'Fordel etter',
    dimensions: ['Komponent', 'Tjenestetype', 'Subscription', 'Ressursgruppe'],
    detail: 'Dataposter · syntetisk registrert bruk',
    date: 'Dato',
    observed: 'Registrert i det syntetiske datasettet',
    forecast: 'Prognose til dag 30',
    budget: 'Budsjett',
    chart: 'Akkumulert kostnad, prognose og budsjett · ØK fra null',
    day: 'Dag',
    explanation:
      'Mengde: flere standard-VM-timer og mer lagring. Miks: stor VM brukes bare i siste periode. Pris og mengde: trafikken øker samtidig som den fiktive GB-satsen endres. Filtrering fjerner bare poster fra utvalget; den endrer ikke datasettet.',
    forecastRule:
      'Prognose = registrert dag 1–20 +10 × gjennomsnittet av dag 11–20. Den stiplede delen er beregnet framtid, ikke nye registrerte poster. Ingen skatt, kreditt eller faktura modelleres.',
    budgetAssumption:
      'Figurens budsjettlinje er en oppgitt, fiktiv sammenligningsgrense for valgt utvalg. Den er ikke et hentet Azure-budget.',
  },
  budget: {
    amount: 'Budsjett for 30-døgnsperioden · ØK',
    type: 'Varseltype',
    types: ['Actual · akkumulert', 'Forecast · prognose'],
    threshold: 'Terskel · prosent av budsjettet',
    evaluate: 'Undersøk terskelen',
    yes: 'Terskelen er nådd i modellen',
    no: 'Terskelen er ikke nådd i modellen',
    consequence:
      'Dette er et lokalt sammenligningsresultat. Ingen e-post, action group eller ressursstans utføres. Undersøk årsak og driftskrav før tiltak.',
  },
  tags: {
    resource: 'Syntetisk ressurs / kostnadspost',
    direct: 'Direkte Department',
    environment: 'Environment',
    parent: 'Gruppens Department',
    reporting: 'Rapportens Department',
    inheritance: 'Rapportarv i denne demonstrasjonen',
    modes: [
      'Av · bare direkte emitterte tags',
      'På · behold ressursverdi ved konflikt',
      'På · foretrekk gruppeverdi ved konflikt',
    ],
    department: 'Department',
    departments: ['Ufordelt', 'Product', 'Finance', 'Shared'],
    environments: ['Uavklart', 'Development', 'Production'],
    groupBy: 'Fordel kostnader etter',
    apply: 'Undersøk fordelingen',
    unassigned: 'Ufordelt',
    total: 'Samlet kostnad er uendret',
    unsupported:
      'Posten emitterer ikke direkte ressurs-tags i denne fixturen. Rapportarv kan likevel klassifisere rapportposten.',
    boundary:
      'Endringene gjelder bare dette datasettet. Ressurs-tags i Portal, tilgang og historiske Azure-usage records blir ikke endret.',
  },
  missions: {
    estimate: {
      title: 'Oppdrag A · begrunn et løsningsestimat',
      situation:
        'Katalogteamets testmiljø trenger én standard compute-enhet, 100 GB beholdt lagring og 50 GB trafikk. Første forslag bruker 720 allokerte timer. Teamet vurderer 240 timer når et testvindu er ferdig.',
      goal: 'Sammenlign minst to beregnede oppsett. Undersøk hvilken post som endres når compute-tiden reduseres, og hva som fortsatt består.',
      observe:
        'Beregn først én standard enhet med 720 timer, 100 GB beholdt lagring og 50 GB trafikk. Behold de andre valgene og beregn deretter 240 timer. Forutsi forskjellen og sammenlign linjene. Etter tidskontrasten kan du fritt sammenligne tjenester og prisalternativer.',
      question:
        'Hva kan du konkludere når compute-tiden reduseres, mens beholdt lagring og trafikk er like?',
      answers: [
        'Bare de tidsavhengige postene og eventuell forpliktelsesbruk kan endres; resten må vurderes separat.',
        'Alle kostnadsposter faller i samme forhold som compute-tiden.',
        'Den nye summen er en garantert Azure-faktura.',
      ],
      correct: 0,
      reason:
        'Sammenlign linjene: compute og eventuell timelisens følger tids-/prisregelen. Lagringsmengde og faste poster endres ikke av seg selv. Estimatet trenger fortsatt driftsmessige forutsetninger.',
    },
    analysis: {
      title: 'Oppdrag B · finn kostnadsavvikets årsak',
      situation:
        'Katalogteamet ser høyere syntetisk kostnad i dag 11–20 enn i dag 1–10. Shared Sandbox har et annet team. Analyseoppdraget gjelder App Sandbox, ikke hele organisasjonen.',
      goal: 'Velg riktig scope, sammenlign to like perioder og identifiser komponenten med størst økning. Undersøk mengde, sats og miks i de underliggende postene.',
      observe:
        'Filtrer App Sandbox og beregn en observasjon. Bruk komponentfordelingen og datatabellen. Velg tiltak ut fra faktisk forskjell, ikke bare høyeste total.',
      question: 'Hvilken undersøkelse begrunner et relevant første tiltak i dette datasettet?',
      answers: [
        'Flytt gruppemetadata; da slettes tidligere kostnader.',
        'Undersøk økte VM-timer og den nye store profilen mot arbeidskravene før tidsplan eller profil endres.',
        'Kjøp binding for hele økningen uten å undersøke bruken.',
      ],
      correct: 1,
      reason:
        'Den største endringen ligger i compute-mengde og miks. Trafikkens pris og mengde bidrar også. Rightsizing eller tidsplan krever at samme nødvendige arbeid fortsatt kan gjennomføres.',
    },
    budgets: {
      title: 'Oppdrag C · undersøk et kommende budsjettavvik',
      situation:
        'App Sandbox har et månedsbudsjett på 600 ØK. Teamet vurderer et actual-varsel på 80 prosent og et forecast-varsel på 100 prosent. Datasettet er oppdatert til dag 20.',
      goal: 'Velg App Sandbox og riktig periode. Sammenlign registrert kostnad, terskel og prognose. Undersøk begge varseltypene med samme budsjett.',
      observe:
        'Kjør begge vurderinger. Se hvilke beløp som sammenlignes, og hvorfor en fremtidig risiko kan være synlig før actual-terskelen er nådd.',
      question: 'Hva innebærer dette forecast-resultatet?',
      answers: [
        'Forbruket stanser automatisk ved 600 ØK.',
        'Hele månedsfakturaen er nå endelig beregnet.',
        'Trenden bør undersøkes og et tiltak vurderes; standardvarselet stanser ingen ressurs.',
      ],
      correct: 2,
      reason:
        'Actual og forecast bruker forskjellige beløp. Prognosen er en antakelse om resten av perioden. Et varsel gir grunnlag for oppfølging, ikke automatisk stans eller fakturafasit.',
    },
    tags: {
      title: 'Oppdrag D · gjør kostnadsfordelingen etterprøvbar',
      situation:
        'Rapporten skal vise Department og Environment. Katalogteamets store VM og disk mangler Department. Gruppemetadata sier Product; en delt plans direkte tag sier Finance, mens gruppen sier Shared.',
      goal: 'Klassifiser store VM og disk som Product/Development i det syntetiske datasettet. Sammenlign direkte tags med rapportarv og konfliktvalg. Behold synlig ufordelt kostnad.',
      observe:
        'Undersøk en fordeling før og etter klassifisering. Sammenlign de to arvevalgene og se at ressursverdien og rapportverdien kan være forskjellige. Summen skal fortsatt stemme.',
      question:
        'Hva viser det når gruppeverdien brukes i rapporten, men ressursens direkte tag er uendret?',
      answers: [
        'Kostnadsposten kan få rapportmetadata uten at ressursen arver ARM-tags eller får nye tilgangsregler.',
        'Azure har automatisk flyttet ressursen til gruppens region.',
        'Department gir avdelingen administratortilgang.',
      ],
      correct: 0,
      reason:
        'Rapportprojeksjon, ressursmetadata og autorisasjon er forskjellige mekanismer. Ufordelte poster må undersøkes, ikke skjules. Ingen tag endrer kostnadens størrelse i denne benken.',
    },
  },
  guided: {
    previous:
      'Du har et tidligere oppdrag av denne typen. Det lagrede arbeidet beholdes. En ny Start begynner likevel med standardoppsettet; den gjenopptar ikke den tidligere undersøkelsen.',
    switch:
      'Du har ett nåværende guidet oppdrag. Du kan fortsette det nedenfor. Starter du denne undersøkelsen, blir den det nye oppdraget. Tidligere arbeid beholdes. Du kan foreløpig bare gjenoppta det nåværende guidede oppdraget.',
    current: 'Nåværende guidet oppdrag:',
    continue: 'Fortsett nåværende guidede oppdrag',
    brief: 'Les SavvySharks oppdragsbrief',
    reviewNotice:
      'Dette er en gjenåpnet oppdragsforklaring. Lukk går tilbake til det lagrede arbeidet uten ny start, modellkjøring eller læringsgodskriving.',
    start: 'Start undersøkelsen',
    cancel: 'Tilbake uten å starte',
    recall: 'Les oppdraget igjen',
    prerequisite: 'Forkunnskaper',
    steps: 'Dette skal du undersøke',
    witness: 'Faktisk modellobservasjon',
    noWitness: 'Ingen gyldig kjøring er registrert ennå.',
    answer: 'Begrunn den guidede observasjonen',
    submit: 'Lagre veiledet forklaring',
    done: 'Veiledet undersøkelse bekreftet · ikke selvstendig mestring',
    missing: 'Undersøk de nødvendige kontrastene og velg en begrunnelse først.',
    notice:
      'Start åpner denne lokale undervisningsøvelsen. Avbryt lukker bare innledningen. Ingen Azure-ressurs, betaling, XP eller faglig fullføring opprettes av å åpne eller lukke briefingen.',
  },
  milestone: {
    title: 'Det samme estimatet har flere uavhengige kostnadsdrivere',
    text: 'To validerte beregninger viser lavere allokert compute-tid med uendret lagring og trafikk. De sistnevnte postene består. Prisforpliktelser kan også holde compute-betalingen oppe selv når aktiv tid reduseres.',
    budgetTitle: 'Prognosen krysser grensen før registrert kostnad',
    budgetText:
      'Begge terskelundersøkelsene gjelder samme scope og budsjett. Actual er under 80 prosent, mens beregnet sluttkostnad er over 100 prosent. Dette er et signal for undersøkelse; ingen ressurs stanses.',
    recall: 'SavvyShark · faglige observasjoner',
    notice:
      'Forklaringen kommer fra lagrede modellkjøringer, ikke Azure-drift. Åpning gir ingen læringsgodskriving.',
  },
  reference: {
    title: 'Faktisk Portal-konfigurasjon · separat referanse',
    text: 'Dette kommer fra ditt virkelige lokale simulator-inventory. Ingen kostnad er utledet fra det. Velg eventuelt en ressurs som case og oppgi egne hypotetiske mengder i benken.',
    empty:
      'Ingen relevant ressurs er opprettet. Bruk det komplette fiktive caset, eller opprett en ressurs senere i vanlig Portal.',
    open: 'Undersøk i Portal · ny fane',
    unsupported:
      'Teknisk lagring er usikker. Ingen tidligere konfigurasjon presenteres som bekreftet.',
    known: 'Kjent konfigurasjon',
    unknown: 'Ukjent: allokerte timer, faktisk trafikk, målt bruk, priser og faktura.',
  },
  assessment: {
    title: 'Nye økonomiske beslutningssituasjoner',
    intro:
      'Velg løsning og teknisk begrunnelse ut fra kravene. Tilfellet vises først etter lagret Start. Tidligere guided work eller gamle kursresultater gir ingen ny godkjenning.',
    case: 'Tilfelle',
    start: 'Start selvstendig tilfelle',
    decision: 'Din beslutning',
    reason: 'Din begrunnelse',
    submit: 'Lever beslutning og begrunnelse',
    abandon: 'Avslutt uten innlevering',
    help: 'Åpne teori og registrer hjelp',
    retry: 'Start nytt forsøk',
    rules:
      'Første innlevering beholdes. Forklaringer vises etter levering. Teori, Journal og historisk feedback under et aktivt forsøk registrerer hjelp før innholdet åpnes. Kjente familier merkes retry. Ingen XP eller eksamensscore.',
    result: 'Innlevert resultat',
    first: 'Første innlevering',
    assisted: 'Forsøk med registrert hjelp',
    unaided: 'Første uassisterte eksponering',
    retried: 'Retry · tidligere eksponering',
    draft: 'Lagret utkast',
    pass: 'Beslutning og begrunnelse passer sammen',
    fail: 'Undersøk det avgjørende kravet',
    alternatives: 'Hvorfor alternativene passer eller ikke passer',
    repeat: 'Gjenta denne undervisningsaktiviteten',
    history: 'Tidligere innleveringer',
    noFirst: 'Ingen innlevering registrert for dette tilfellet.',
    neutral:
      'Arbeid ut fra scenarioets krav. SavvyShark gir ingen løsning under denne vurderingen.',
  },
  summary: {
    title: 'Separate observasjoner, ikke en ny sertifisering',
    guided: 'Veiledede undersøkelser',
    submitted: 'Innleverte selvstendige tilfeller',
    firsts: 'Første innleveringer',
    visited: 'Undervisning åpnet · orientering',
    none: 'Ikke dokumentert ennå',
    boundary:
      'Disse lokale resultatene sier hvilke versjonerte aktiviteter du har utført. Assisted og retry erstatter aldri første innlevering. Ingen Microsoft-fullføring, ny XP eller exam readiness utledes.',
    next: 'Neste planlagte fagområde er Compute & Hosting. Øvrig Management & Governance er fortsatt planlagt.',
  },
  storage: {
    issue: 'Kostnadsmodulens læringslagring kan ikke bekreftes.',
    load: 'Last dette sporet på nytt',
    recover: 'Vurder isolert recovery',
    confirm: 'Bekreft: fjern bare ugyldig kostnadsrecord',
    capacity:
      'Historikken er full eller har reservert terminalkapasitet. Aktiv vurdering kan fullføres eller avbrytes; en allerede observert guidet øvelse kan lagre avsluttende forklaring mens det er plass. Tidligere svar beholdes. Ingen ny Start eller modellkjøring kan lagres her.',
    blocked:
      'Undervisning holdes tilbake til hjelp kan registreres trygt i alle aktive vurderinger.',
    failed: 'Handlingen kunne ikke lagres. Kontroller lagringsstatus; ingen ny progresjon påstås.',
    loading: 'Laster versjonert kostnadshistorikk …',
  },
  sources: 'Offisielle kilder · kontrollert 27. oktober 2026',
  human: 'Menneskelig Azure-SME-, UX-, skjermleser- og læringsoverføringsvalidering gjenstår.',
  assessmentActive: 'Et tilfelle er aktivt. Lever eller avslutt det før du starter et annet.',
  comparisonReference: 'Planlagt sammenligningsgrunnlag A',
  predictionContexts: {
    estimate:
      'Forutsi totalen i B sammenlignet med referanse A. Første referanse er det oppgitte standardcaset; ingen beregnet fasit vises før kjøring.',
    analysis: 'Forutsi totalen for dag 11–20 sammenlignet med dag 1–10 i valgt scope.',
    budgets:
      'Forutsi om beløpet for valgt varseltype blir lavere enn, likt eller høyere enn terskelbeløpet.',
    tags: 'Forutsi samlet kostnad etter metadataendringen sammenlignet med samme datasett før klassifisering.',
  },
  currentFeedback: 'Aktuell innlevering',
  historyFeedback: 'Valgt historisk innlevering',
  submissionClassification: 'Forsøkets klassifisering',
  tableHelp: 'Tabellen kan rulles sideveis ved behov. Fokuser tabellområdet og bruk piltastene.',
} as const;
export const costItemsNb = {
  cm01: {
    title: 'Arkivtjenestens beslutningsgrunnlag',
    problem:
      'Et arkivteam sammenligner to verifisert funksjonelle løsninger i samme periode. Begge har fire ARM-ressurser. Hvilket grunnlag trenger teamet for et økonomisk valg?',
    premises: [
      'Alternativ A har én liten compute-profil og stor, beholdt lagringsmengde. B har større compute-profil og mindre lagring.',
      'Region, trafikkvei, lisensvilkår og support er ennå ikke sammenstilt. Begge oppfyller de oppgitte lagrings- og svartidskravene.',
    ],
    decisions: [
      'Sammenlign compute-timer og compute-satser som samlet løsningskostnad.',
      'Sammenstill tjenestenes målere, satser og mengder, inkludert de ukjente tilleggspostene.',
      'Normaliser totalsummen etter antall ARM-ressurser før de to tilbudene sammenlignes.',
    ],
    reasons: [
      'Lik ressursstruktur gir et tilstrekkelig prisgrunnlag, selv om ressursenes størrelser er forskjellige.',
      'Mindre compute reduserer også kostnaden for beholdt lagring i samme forhold.',
      'Tjenestemiks og vilkår kan gi ulik sum selv når antall ressurser er likt.',
    ],
    decisive:
      'Samme ressursantall beskriver ikke mengde eller prisgrunnlag. Begge løsningenes relevante målere og antakelser må vurderes.',
    feedback: [
      [
        'Compute er én relevant post, men A har mer lagring. En compute-sammenligning er tilstrekkelig bare dersom øvrige relevante poster allerede er dokumentert like eller inkludert.',
        'Dette samler sammenlignbare antakelser for hele løsningen. Krav til drift og vilkår må fortsatt være oppfylt.',
        'Ressursantall normaliserer ikke forskjellige prisede mengder. Antall kan være en driver for en bestemt tjeneste, men er ingen felles løsningsenhet.',
      ],
      [
        'Samme administrasjonsstruktur sier ikke at lagringsmengde, målere og lisensvilkår er like. Den ville vært tilstrekkelig først dersom relevante prisforutsetninger også var like.',
        'Beholdt lagring kan prises separat fra compute. Samvariasjon måtte vært begrunnet i et konkret tilbud eller faktisk endret datamengde.',
        'Dette forklarer hvorfor hele tjenestesammensetningen må vurderes før økonomisk valg.',
      ],
    ],
  },
  cm02: {
    title: 'Et nytt testvindu',
    problem:
      'En testjobb har 2 instanser med PAYG i en oppdiktet modell. Allokert tid går fra 100 til 40 timer per instans. Disk beholdes hele perioden. Hva er det nye estimatet?',
    premises: [
      'Compute: 3 ØK per instanstime. Lagring: 50 GB ×0,40 ØK per GB-periode.',
      'Ingen annen kostnad, rabatt eller kapasitetsendring inngår. Jobben kan fortsatt gjennomføres i det nye testvinduet.',
    ],
    decisions: [
      '260 ØK: 240 compute og 20 beholdt lagring.',
      '140 ØK: 120 compute og 20 beholdt lagring.',
      '248 ØK: 240 compute og 8 beholdt lagring.',
    ],
    reasons: [
      'De 40 timene er løsningens totale instanstimer, og lagringsmengden er uendret.',
      'Begge instansenes timer må summeres, mens uendret GB-periode fortsatt prises.',
      'Alle opprinnelige kostnadsposter skaleres med det nye tidsforholdet 40/100.',
    ],
    decisive: '2 ×40 ×3 =240 ØK. Beholdt lagring gir 50 ×0,40 =20 ØK. Totalen er 260 ØK.',
    feedback: [
      [
        'Riktig under de fiktive forutsetningene: 2 × 40 × 3 + 50 × 0,40. Det er ikke en virkelig Azure-pris.',
        'Dette bruker 40 som samlet instanstid. Premisset er 40 per instans, så to instanser gir 80 instanstimer. Alternativet kunne passet én instans i 40 timer.',
        'Compute er riktig, men beholdt lagring er skalert ned uten endret mengde eller lagringsperiode. Det kunne passet dersom også priset lagringsmengde ble redusert til 40 prosent.',
      ],
      [
        'Antall instanser og tid per instans er separate størrelser. Timer for hele løsningen kunne vært 40, men det er ikke angitt her.',
        'Denne relasjonen bruker riktige enheter og skiller tidsbasert compute fra beholdt kapasitet.',
        'Tidsforholdet gjelder compute. En separat lagringspost følger sin egen mengde og periode, ikke automatisk compute-jobbens tidsvindu.',
      ],
    ],
  },
  cm03: {
    title: 'Lanseringsforslaget',
    problem:
      'En nettjeneste har en fullstendig dimensjonert hosting-plan i kalkulatoren. Den trenger også database, backup og forventet utgående trafikk. Hvordan bør budsjettforslaget utformes?',
    premises: [
      'Hosting-estimatet omfatter ikke databasen eller backup-tjenesten. Trafikkposten står med standardmengde, som avviker fra teamets prognose.',
      'Løsningen skal presenteres før opprettelse. Ingen registrerte forbrukskostnader finnes ennå.',
    ],
    decisions: [
      'Bruk hosting-estimatet med en udokumentert 20 prosent reserve for database, backup og trafikk.',
      'Bruk kostnaden fra en annen applikasjons siste faktura uten å justere tjenestemiks og bruk.',
      'Legg til nødvendige produkter og begrunnede bruksmengder; oppgi gjenværende usikkerhet.',
    ],
    reasons: [
      'Et estimat kombinerer valgte produkter og mengder; utelatte behov er ikke automatisk priset.',
      'En generell reservemargin erstatter egne antakelser for utelatte tjenester og trafikk.',
      'Historisk sum fra en annen løsning er et direkte estimat for denne løsningen selv når belastningen avviker.',
    ],
    decisive:
      'En korrekt compute-linje er ikke et fullstendig løsningsestimat. De øvrige behovene og usikkerheten må med.',
    feedback: [
      [
        'En begrunnet usikkerhetsreserve kan være nyttig etter at løsningen er modellert. En udokumentert prosent erstatter ikke de uttrykkelig manglende tjenestene.',
        'Historiske data kan kalibrere antakelser når scope, periode, vilkår og mengder er sammenlignbare. Her mangler denne tilpasningen.',
        'Dette gir et etterprøvbart løsningsestimat før opprettelse. Det er fortsatt ingen faktura eller garanti.',
      ],
      [
        'Dette er kalkulatorens rolle: relevante produkter og egne forutsetninger må inngå når de ikke er inkludert i hosting-produktet.',
        'En margin beskriver usikkerhet, men dokumenterer ikke hvilke målere eller mengder som mangler. En faglig dimensjonert reserve kan komme i tillegg.',
        'Historikk er nyttig grunnlag, men en annen tjenestemiks og trafikkmengde krever tilpasning. Faktura og framtidig estimat er forskjellige data.',
      ],
    ],
  },
  cm04: {
    title: 'Det regionale prosjektet',
    problem:
      'To estimater for et seksukersprosjekt viser ulike priser. Ett bruker feil region, en annen OS-lisens og 730 timer hver måned. Hva er en forsvarlig sammenligning?',
    premises: [
      'Det dokumenterte estimatgrunnlaget for begge compute-alternativene er 160 fakturerbare timer per måned og oppgitte regionkrav. Beholdt lagring beregnes separat. Ingen lisensfordel er bekreftet.',
      'Den laveste nominelle prisen gjelder regionen som ikke tilfredsstiller prosjektets krav.',
    ],
    decisions: [
      'Korriger region og lisens, men behold 730 timer som prosjektets antatte bruk uten å vurdere testvinduet.',
      'Bruk godkjent region, relevante lisensvilkår og begrunnede mengder i begge estimater.',
      'Korriger region og brukstid, men aktiver lisensfordelen før rettighetene er avklart.',
    ],
    reasons: [
      'En månedlig kalkulatorvisning betyr at alle tjenester må antas aktive hele måneden.',
      'Den eksisterende programvareinstallasjonen er tilstrekkelig dokumentasjon for rabattvalget i estimatet.',
      'Estimatets region, tidsmengde og lisensforutsetninger må beskrive en gjennomførbar løsning.',
    ],
    decisive:
      'Prisene gjelder forskjellige løsninger. Krav, timer og lisensvilkår må være riktige før differansen gir beslutningsverdi.',
    feedback: [
      [
        'Kontinuerlig allokering kunne begrunnet rundt en hel måned. Her angis 160 timer, så beholdt standardverdi må i det minste begrunnes og skilles fra forventet bruk.',
        'Dette sammenligner relevante løsninger og gyldige vilkår. Ukjente avtalerabatter må fortsatt merkes usikre.',
        'Lisensfordeler kan være relevante etter rettighetskontroll. Å redusere estimatet med en ubekreftet fordel gjør grunnlaget misvisende.',
      ],
      [
        'Kalenderperioden og priset allokeringstid er forskjellige størrelser. Kontinuerlig bruk er en mulig antakelse, ikke en konsekvens av visningen.',
        'Eksisterende installasjon dokumenterer ikke nødvendigvis rettighetene til det aktuelle tilbudet; vilkårene må undersøkes.',
        'Dette knytter hver parameter til krav og dokumenterte forutsetninger fremfor bare å velge lav sum.',
      ],
    ],
  },
  cm05: {
    title: 'En ny ukesrapport',
    problem:
      'En virksomhet vil forklare en kostnadsøkning i siste avsluttede uke. Hva er første relevante analysehandling?',
    premises: [
      'Det daterte syntetiske grunnlaget viser 80 ØK compute +20 ØK storage i første uke og 80 ØK compute +90 ØK storage i andre uke.',
      'Postene gjelder samme scope og like lange perioder. Storage-detaljene viser flere GB-døgn til uendret sats.',
    ],
    decisions: [
      'Undersøk storage-mengde, bevaringsbehov og postdetaljer i riktig Cost Analysis-scope.',
      'Bruk et nytt kalkulatorestimat som hovedforklaring på den siste registrerte ukens kostnadsøkning.',
      'Start med å redusere compute-profilen før lagringsforbrukets årsak og bevaringskrav undersøkes.',
    ],
    reasons: [
      'En lavere framtidig compute-pris forklarer hvordan den registrerte storage-økningen oppstod.',
      'Storage-mengden forklarer forskjellen; et mulig tiltak må samtidig ivareta bevaringskrav.',
      'Økt storage-kostnad viser alene at de nye dataene er unødvendige og kan slettes.',
    ],
    decisive:
      'Storage øker 70 ØK mens compute er uendret. Underliggende mengde og bevaringskrav må undersøkes før tiltak.',
    feedback: [
      [
        'Riktig analysegrunnlag og mekanisme. Større datamengde er ikke alene tillatelse til å slette nødvendige data.',
        'Kalkulatoren kan sammenligne framtidige løsninger. Den dokumenterer ikke årsaken til allerede registrerte poster i dette scopet.',
        'Compute er uendret i datasettet. Rightsizing kan være relevant etter en kapasitetsanalyse, men er ikke den identifiserte historiske årsaken.',
      ],
      [
        'Et framtidig prisvalg er en annen beslutning. Den daterte forskjellen gjelder flere GB-døgn til uendret sats.',
        'Dette forbinder faktisk datasett, enhet og driftsbehov, uten å anta at økt forbruk er feil.',
        'Forbruket kan være nødvendig. Sletting krever kontroll av formål, bevaringskrav og konsekvenser, ikke bare en prisøkning.',
      ],
    ],
  },
  cm06: {
    title: 'To varseltyper',
    problem:
      'Et månedsbudsjett for utviklingssubscription er 1 000 ØK. Registrert syntetisk kostnad er 600 ØK; prognosen er 1 250 ØK. Hva innebærer et forecast-varsel på 100 prosent?',
    premises: [
      'Et actual-varsel er satt til 80 prosent. Ingen action group eller annen automatisk handling er konfigurert.',
      'Prognosen forutsetter at det nye bruksmønsteret fortsetter. Data for enkelte tjenester kan komme med forsinkelse.',
    ],
    decisions: [
      'Rapporter at både actual 80 prosent og forecast 100 prosent er passert, og følg opp begge varslene.',
      'Rapporter at ingen terskel er passert fordi bare registrerte 600 ØK kan sammenlignes med begge varseltypene.',
      'Rapporter forecast 100 prosent som passert, actual 80 prosent som ikke passert, og undersøk utviklingen.',
    ],
    reasons: [
      'Forecast-beløpet brukes som registrert forbruk også ved evaluering av actual-terskelen.',
      'Hver varseltype bruker sitt eget grunnlag; prognose er usikker framtid og varsel er ikke en ressursstans.',
      'Forecast-terskelen bruker samme registrerte beløp som actual; framskrivingen er bare et diagram.',
    ],
    decisive: '1 250 er over 1 000; 600 er under 800. Varsel og tiltak er forskjellige mekanismer.',
    feedback: [
      [
        'Forecast-grensen er passert, men actual krever 800 ØK registrert kostnad. Prognosen skal ikke brukes som actual. Begge kunne vært passert ved minst 800 ØK actual og tilstrekkelig forecast.',
        'Dette bruker actual-grunnlaget også for forecast og mister det tidlige signalet. Prognosen kan passere sin terskel før registrerte kostnader gjør det.',
        'Dette skiller varseltypene. Teamet må undersøke antakelser og forsinkede data, ikke love en faktura eller automatisk handling.',
      ],
      [
        'De to typene er ulike sammenligninger. En prognose over 800 ØK betyr ikke at actual-terskelen er passert.',
        'Dette forklarer både resultatet og grensen: separat konfigurert automatisering kunne utført handlinger, men standardvarslet stopper ingenting.',
        'Framskrivingen er faktisk grunnlaget i dette forecast-varselet. Actual-varslet bruker registrerte kostnader.',
      ],
    ],
  },
  cm07: {
    title: 'Avdelingsrapportens datagrunnlag',
    problem:
      'En ressursgruppe har Department=Finance. En disk har ingen direkte Department-tag, og kostnadsrapporten har en ufordelt post. Rapportarv er ikke aktivert. Hva kan gjøres?',
    premises: [
      'Ressurstypen støtter direkte tags og kan sende dem til kostnadsdata. Posten gjelder en allerede behandlet periode.',
      'Teamet skal få riktig løpende kostnadsfordeling, uten å gi nye tilgangsrettigheter.',
    ],
    decisions: [
      'Tagg disken nå og behandle den allerede avsluttede periodens ufordelte beløp som umiddelbart korrigert.',
      'Undersøk direkte tagging og støttet rapportarv separat; behold uavklart historisk fordeling synlig.',
      'Tilordne en deny-regel for manglende Department og behandle den som utført tagging av den eksisterende disken.',
    ],
    reasons: [
      'Nye ressursmetadata gir i seg selv full og umiddelbar omklassifisering av tidligere kostnadsposter.',
      'Et policykrav om metadata er det samme som en allerede utført modify/remediation-handling.',
      'Direkte tags, policyeffekt og rapportmetadata må vurderes hver for seg; historisk støtte må undersøkes.',
    ],
    decisive:
      'Manglende direkte metadata og deaktivert rapportarv forklarer hvorfor gruppetagg alene ikke gir full fordeling.',
    feedback: [
      [
        'Direkte tagging kan forbedre framtidig klassifisering. Den dokumenterer ikke alene umiddelbar og full endring av en avsluttet rapportperiode.',
        'Dette gir en etterprøvbar strategi og en ærlig historisk rapport. Kontroller støttet scope, ressurs-/datastøtte og arvevalg før omfordeling loves.',
        'En deny-regel kan påvirke relevante framtidige operasjoner. Den er ikke i seg selv en utført modifikasjon av den eksisterende disken; modify/remediation er andre mekanismer.',
      ],
      [
        'Metadataoppdatering og behandling av kostnadsdata har ulike regler/tidspunkt. Historisk dekning krever en konkret kontroll.',
        'Effekten og en eventuell remediation må faktisk vurderes. Kravet alene dokumenterer ingen ressursendring.',
        'Dette skiller mekanismene og begrunner hvorfor ufordelt ikke bare skal skjules. Tags gir heller ingen ny RBAC-rolle.',
      ],
    ],
  },
  cm08: {
    title: 'To Department-verdier',
    problem:
      'En app har direkte Department=Research. Gruppen har Department=Shared. Rapporten viser Shared etter en eksplisitt Cost Management-arveinnstilling som foretrekker gruppeverdi. Hva kan teamet slutte?',
    premises: [
      'Ressursens faktiske Properties viser fortsatt Research. Brukerens tidligere tilgang er uendret.',
      'Rapportens sum er den samme, men beløpet ligger i en annen Department-kategori.',
    ],
    decisions: [
      'Behandle forskjellen som en flytting av ressursen til en ny resource group, og oppdater dependency-tegningen.',
      'Behandle Shared som ny direkte ressursverdi og legg RBAC-gruppens medlemskap til grunn for endringen.',
      'Avstem rapportens arveinnstilling mot uendrede ressursmetadata; undersøk klassifisering og tilgang separat.',
    ],
    reasons: [
      'Rapportarv kan endre kostnadspostens metadata uten en ARM-tag- eller RBAC-kommando.',
      'En annen Department-kategori dokumenterer at selve kostnadsbeløpet er redusert.',
      'Gruppens rapportverdi viser at en tagging-policy har skrevet om ressursens Properties.',
    ],
    decisive:
      'Observerte Properties og uendret totalsum viser en rapportklassifisering, ikke ny ressurskonfigurasjon eller beskyttelse.',
    feedback: [
      [
        'Resource group-medlemskap er en administrativ relasjon. En rapportverdi alene dokumenterer ingen flytting eller dependency-endring.',
        'Den faktiske Properties-verdien er fortsatt Research. Rapportmetadata gir heller ikke en RBAC-rolle; eventuell tilgangsendring måtte undersøkes separat.',
        'Dette forklarer forskjellen fra de observerte datalagene uten å tilskrive rapportarv en ressurskommando.',
      ],
      [
        'Dette er det korrekte skillet mellom ressursens direkte tags, rapportens berikelse og autorisasjon.',
        'Fordelingen endres, mens premisset sier at totalsummen er uendret. Kostnadsreduksjon krever en annen årsak.',
        'Policy kan påvirke tags gjennom egne effekter, men det er ingen slik observert endring her. Properties og den eksplisitte rapportinnstillingen støtter rapportarv.',
      ],
    ],
  },
  cm09: {
    title: 'Endret compute-miks',
    problem:
      'Et team har først fjernet ubrukt kapasitet. Kvalifisert compute-bruk er deretter stabil hver time, men flytter mellom støttede tjenester og regioner. Hvilket betalingsvalg er relevant å undersøke?',
    premises: [
      'Måling og tilbudsvilkår bekrefter en grunnlast som kan utnytte et moderat timebeløp gjennom planperioden.',
      'En fast reservasjon med smal produkt-/regionsmatching dekker ikke den planlagte blandingen. Lagring og nettverk er separate behov.',
    ],
    decisions: [
      'Sammenlign en moderat compute-savings-plan mot den bekreftede kvalifiserte timegrunnlasten.',
      'Dimensjoner én smalt matchet reservasjon fra toppbruken i den opprinnelige regionen.',
      'Dimensjoner compute-planens timebeløp etter compute, nettverk og lagring samlet.',
    ],
    reasons: [
      'En måneds gjennomsnittskostnad er tilstrekkelig for å utnytte hver timeforpliktelse, også når bruksmønsteret endres.',
      'Kvalifisert timebasert compute-forpliktelse kan passe den støttede miksen; øvrige poster og utnyttelsesrisiko består.',
      'De øvrige kostnadene kan regnes som compute-forbruk når ressursene deler samme resource group.',
    ],
    decisive:
      'Oppgaven gir stabil kvalifisert timebruk, men varierende støttet compute-miks. Det gjør en forsiktig spend-forpliktelse relevant å sammenligne.',
    feedback: [
      [
        'Relevant å undersøke under de dokumenterte premissene. Avtalens størrelser og vilkår må fortsatt kontrolleres; dette er ingen kjøpsanbefaling.',
        'En matching reservasjon kan passe stabil produktbruk. Her dekker ikke den smale produkt-/regionsmatchingen den oppgitte blandingen, og toppbruk er ikke automatisk en stabil grunnlast.',
        'Compute-planens kvalifiserte forbruk er ikke det samme som hele løsningen. Programvare, lagring og nettverk kan måtte prises separat.',
      ],
      [
        'Commitment brukes timevis uten overføring av ubrukt beløp. Samme månedssum kan ha svært ulik timeutnyttelse.',
        'Dette kobler stabil kvalifisert bruk og fleksibel støttet miks til betalingsmekanismen, med riktig avgrensning.',
        'Resource group-medlemskap endrer ikke hvilke forbruksmål som er kvalifisert for betalingsfordelen.',
      ],
    ],
  },
  cm10: {
    title: 'Prisvalg for tidskritisk behandling',
    problem:
      'En tjeneste skal behandle tidskritiske forespørsler uten støtte for gjenopptakelse etter avbrudd. Et rimelig Spot-tilbud foreslås som eneste compute. Hva bør teamet gjøre?',
    premises: [
      'Teamet har ikke en annen fungerende tjenestebane. Kapasitetsbehovet varierer, og ingen stabil forpliktelsesgrunnlast er dokumentert.',
      'En PAYG-profil er verifisert tilstrekkelig for det aktuelle arbeidet. Ingen av alternativene i oppgaven dokumenterer en full HA-arkitektur.',
    ],
    decisions: [
      'Bruk Spot som eneste compute og håndter en eventuell eviction med manuell gjenoppretting.',
      'Bruk dokumentert egnet PAYG-kapasitet nå, og undersøk bruk og rightsizing før nye bindinger.',
      'Reserver hele den målte toppkapasiteten for flere år før grunnlasten er dokumentert.',
    ],
    reasons: [
      'Lavere nominell timepris er tilstrekkelig beslutningsgrunnlag selv om avbrudd bryter arbeidskravet.',
      'Et observert kapasitetsmaksimum kan uten videre brukes som den vedvarende utnyttelsen i en betalingsforpliktelse.',
      'Prisvalg må møte avbruddskrav og dokumentert bruk; betalingsvalg alene beviser ikke høy tilgjengelighet.',
    ],
    decisive:
      'Spot-eviction og manglende restart/alternativ bane passer ikke de oppgitte kravene. Usikker bruk gir heller ikke grunnlag for full toppbinding.',
    feedback: [
      [
        'Spot kan passe avbrytbart eller gjenopptakbart arbeid. Her finnes verken tilstrekkelig restartstøtte eller en annen tjenestebane for tidskritiske forespørsler.',
        'Dette beholder dokumentert egnethet og fleksibilitet mens forbruket undersøkes. En robust HA-arkitektur krever fortsatt egne tiltak.',
        'En dokumentert stabil grunnlast kunne begrunnet en forpliktelse. Toppen i en varierende arbeidslast er ikke tilstrekkelig grunnlag for full flerårig binding.',
      ],
      [
        'Driftskrav må vurderes sammen med pris. Eviction-risikoen blir ikke borte fordi satsen er lav.',
        'Maksimum og vedvarende timebruk er forskjellige. Ubrukt forpliktelse kan koste penger uten tilsvarende nytte.',
        'Dette bevarer arbeidets faktiske krav og skiller betalingsmodell fra feiltoleranse.',
      ],
    ],
  },
} as const;
/** Original P05 manuscript, authored before the Compute presenters. */
export const computeNb = {
  courseOverview: 'Kursoversikt',
  milestoneNotice:
    'Forklaringen bygger på lagrede modellobservasjoner. Lukking eller gjenåpning endrer ingen ressurs, svar, XP eller fullføring.',
  avdInvestigation: {
    title: 'Undersøk publisering og kjøregrunnlag i AVD',
    situation:
      'Saksbehandlerne trenger en publisert Windows-applikasjon fra forskjellige enheter. Undersøk hvordan en workspace, application group, host pool og session hosts må henge sammen før et skrivebord eller en app kan tilbys.',
    goal: 'CP02: skille publiseringsobjekter, brukertilordning og deklarerte session hosts fra faktisk brukertilgang.',
    steps: [
      'Velg pooled/RemoteApp og undersøk de seks serviceobjektene.',
      'Forutsi og kjør med korrekt registrering, tilordning og minst én host.',
      'Sett antall hosts til null og sammenlign publisering med kjøregrunnlag.',
      'Fjern workspace-registrering eller prøv personal med RemoteApp, og forklar forskjellen.',
      'Sammenlign personal/full desktop med pooled/multi-session.',
    ],
    observe:
      'Kontroller resultatet for publisering, host-grunnlag og kombinasjon. En gyldig feed er ikke en testet Windows-sesjon.',
    why: 'En vanlig VM eller et workspace-navn alene oppretter ingen ferdig desktop-tjeneste.',
    where:
      'Bruk AVD-kontrollene nedenfor. Velg deretter de nummererte objektene for forklaring av hver relasjon.',
    debrief:
      'Sammenlign den sist lagrede publiseringskjeden med valgt host-antall. Undersøkelsen lagres i Hosting-forløpets modellhistorikk; den fullfører ikke Hosting-beslutningene eller en selvstendig vurdering.',
  },
  recallGuided: 'Gjenoppta lagret oppdragsforsøk',
  pauseGuided: 'Sett oppdraget på pause · behold arbeidet',
  diagram: {
    title: 'Undersøk mekanismen',
    original: 'Original forklaringsmodell · ikke en faktisk Azure-topologi',
    container: [
      'Registry / image',
      'Runtime',
      'Instans A',
      'Instans B',
      'Applikasjon + biblioteker',
      'Host-kernel · prosessisolasjon',
      'Eksplisitt datatjeneste',
    ],
    containerText:
      'Én distribuerbar imagepakke kan brukes til flere instanser. Prosessene deler kernel i dette vanlige oppsettet. Data kan ha en egen livssyklus utenfor instansene. Hyper-V-isolasjon er et dokumentert annet oppsett.',
    capacity: ['Én deklarert sone', 'FD0', 'FD1', 'FD2', 'UD0', 'UD1', 'VM'],
    capacityText:
      'Kolonnene viser fault domains; radene viser update domains. En fysisk feilgrense og en vedlikeholdsgruppe er forskjellige relasjoner. Flere soner gir en ytterligere fysisk grense; ingen av disse kantene er trafikk.',
    desktop: [
      'Workspace',
      'Application group',
      'Host pool',
      'Session hosts',
      'Desktop / RemoteApp',
    ],
    desktopText:
      'Workspace registrerer publiseringsgruppen. Gruppen peker til én host pool, som har session hosts. Brukerens tilordning og gyldig publisering er egne forutsetninger.',
    dependencies: [
      'Virtual Machine',
      'OS disk',
      'Data disk',
      'Network Interface',
      'Subnet',
      'Virtual Network',
    ],
    dependenciesText:
      'Disk- og NIC-tilknytning, subnettilhørighet og VNet-parent er tekniske relasjoner. Resource group og subscription er en separat administrativ kontekst.',
    layers: [
      [
        'Virtual Machine',
        'Fysisk host',
        'Hypervisor',
        'Guest OS + kernel',
        'Runtime + applikasjon',
      ],
      [
        'Container',
        'Fysisk / virtuell host',
        'Host-kernel + runtime',
        'Image → instans',
        'Applikasjonsprosess',
      ],
      [
        'Azure Functions',
        'Fysisk infrastruktur',
        'Administrert hostingplan',
        'Hendelse → trigger',
        'Funksjonskjøring',
      ],
    ],
  },
  vmCopy: {
    select: 'Velg faktisk VM som oppdragets subjekt',
    references: 'Faktiske ressurser og kvittering',
    inspected: 'Eksplisitt undersøkt',
    uninspected: 'Åpne i Portal og bekreft inspeksjon',
    newBuild: 'Ny korrekt VM etter oppdragsgrensen med gjenbrukt subnet er bekreftet.',
    notNew:
      'Denne VM-en eller kvitteringen oppfyller ikke alle nye oppdragskrav. Eldre ressurser er bare inspeksjonsgrunnlag.',
    show: 'Vis veiledning',
    hide: 'Minimer veiledning',
    forms: {
      group:
        'Resource group · Basics: velg App Sandbox og et eget Resource group name. Region angir hvor gruppens metadata lagres. Review + create kontrollerer utkastet; Create oppretter den lokale gruppen. Fortsett deretter til Virtual machines.',
      vm: 'Virtual machine · Kontroller først om gruppen har et egnet subnet i valgt region. Hvis ingen finnes: opprett en liten grunnlags-VM med nytt nettverk gjennom dette skjemaet, som forklart i briefingen. Den er en forutsetning, ikke indeksarbeideren. Opprett deretter indeksarbeideren: Basics: App Sandbox, samme gruppe/region, Windows og standard. Disks:64GiB data. Networking: velg det eksisterende subnettet. Review + create validerer; Create sender faktisk lokal kommando.',
      plan: 'Du oppretter et App Service plan. Dette er støttet Portal-arbeid, men inngår ikke i dette VM-oppdragets nybyggkrav. For å fortsette oppdraget: lukk skjemaet og åpne Virtual machines → Create.',
      app: 'Du oppretter en Web App. Dette er støttet Portal-arbeid, men inngår ikke i dette VM-oppdragets nybyggkrav. For å fortsette oppdraget: lukk skjemaet og åpne Virtual machines → Create.',
    },
    createWhy: {
      group:
        'VM-en trenger en ressursgruppe i riktig subscription. Gruppen gir administrativ tilhørighet; metadata-regionen plasserer ikke VM, disk eller nettverk fysisk. Gruppens opprettelse fullfører ikke VM-oppdraget.',
      vm: 'Dette skjemaet oppretter VM-konfigurasjonen og dens støttede avhengigheter atomisk. Oppdraget krever en ny accepted kvittering, gjenbrukt subnet og eksplisitt inspeksjon; opprettelse beviser ingen guest-boot eller applikasjonshelse.',
      plan: 'Et App Service plan er hostingkapasitet for Web Apps og erstatter ikke en VM med gjeste-OS. Veiledningen utfører ingen kommando eller feltendring for deg.',
      app: 'En Web App bruker et App Service plan. Denne hostingrelasjonen er en annen teknisk konfigurasjon enn oppdragets VM-/disk-/NIC-kjede. Veiledningen utfører ingen kommando eller feltendring for deg.',
    },
    openReference:
      'Åpne en faktisk referanse fra den valgte VM-kjeden eller dens accepted Activity log-kvittering før du bekrefter inspeksjon.',
    receipt: 'Åpne accepted receipt',
    noCommands: 'SavvyShark navigerer bare. Du velger felter og sender hver støttet kommando selv.',
    unverified: 'VM-resultat kan ikke verifiseres nå',
    uncertain:
      'Teknisk lagring er ikke klar eller har en konflikt. Historiske Compute-svar er beholdt, men VM-avledet status og samlet guidet antall holdes tilbake. Åpne Portal for dens avgrensede reload/recovery; ingen ressurser slettes her.',
  },
  assessmentActive:
    'Et annet Compute-forsøk er aktivt. Fortsett det låste scenarioet før du velger et nytt.',
  currentFeedback: 'Tilbakemelding på innlevert forsøk',
  historyFeedback: 'Tidligere innlevering · forklaringer',
  guided: {
    notice:
      'Start oppretter bare læringskontekst. Lukking gir ingen vurdering, XP eller teknisk ressurs.',
    cancel: 'Avbryt',
  },
  assessment: {
    title: 'Selvstendig Compute-anvendelse',
    intro:
      'Analyser en ny organisasjonssituasjon. Velg både beslutning og en faglig begrunnelse som passer valget.',
    rules:
      'Første besvarelse låses ved innlevering. Ingen fasit eller løsningsguide vises under arbeidet. Åpning av teori, Journal, Summary eller tidligere feedback krever varig registrert hjelp i alle aktive kontekster. Samme familie senere er retry, også etter avbrudd.',
    case: 'Velg scenario',
    result: 'Resultat for dette paret',
    decision: 'Din beslutning',
    reason: 'Din tekniske begrunnelse',
    draft: 'Varig lagret utkast',
    unaided: 'Første uassisterte forsøk',
    assisted: 'Med registrert hjelp',
    retried: 'Gjeneksponert familie / retry',
    first: 'Første innlevering',
    pass: 'Faglig forsvarlig beslutning og begrunnelse i denne situasjonen',
    fail: 'Beslutning og begrunnelse tilfredsstiller ikke kravene sammen',
    start: 'Start selvstendig forsøk',
    retry: 'Start nytt forsøk',
    submit: 'Lever beslutning og begrunnelse',
    abandon: 'Avbryt forsøket',
    help: 'Be om hjelp i relevant undervisning',
    neutral:
      'Vurder kravene, ikke plasseringen av svarene. Ingen teknisk ressurs opprettes når du leverer.',
    history: 'Undersøk tidligere innleveringer',
    alternatives: 'Alle alternativer og endrede forutsetninger',
    repeat: 'Repeter presis undervisningsaktivitet',
  },
  models: {
    container: {
      title: 'Container Execution Explorer',
      predictions: [
        'Velg prediksjon',
        'Ingen gyldig applikasjonsprosess etableres',
        'Prosessgrunnlag finnes, men den tidligere rapporten er tapt',
        'Prosessgrunnlag finnes, og den tidligere rapporten er beholdt',
      ],
      platform: 'Kjøremodell',
      platforms: ['Virtual Machine', 'Prosess-/Hyper-V-container', 'Azure Functions · konsept'],
      image: 'Egnet image kan hentes ved ny opprettelse',
      runtime: 'Kjøremiljøet er etablert',
      guestRequired: 'Egen administrerbar guest-kernel per instans er et krav',
      isolation: 'Deklarert containerisolasjon',
      host: 'Hvem driver containerens vertsplattform?',
      hosts: ['Administrert Azure-containerplattform', 'Container runtime på kundens egen VM'],
      responsibility: 'Ansvar for host-/guest-OS i valgt oppsett',
      customerHost: 'Kunden · containerformatet fjerner ikke VM-vertens OS-arbeid.',
      providerHost:
        'Leverandøren i dette administrerte oppsettet · kunden beholder image, kode, data og tilgang.',
      imageAnatomy: 'Innholdet i rapportgeneratorens image',
      imageLayers: [
        'report.py · applikasjonskode',
        'Python + nødvendige biblioteker · user-space',
        'Nødvendige basefiler · ingen egen guest-kernel',
        'Entrypoint · ønsket prosess ved instansstart',
      ],
      imageBoundary:
        'Denne pakken er et konkret Python-eksempel, ikke en universell oppskrift. Et lagret image kjører ingen prosess og inneholder ikke rapportfiler som oppstår senere.',
      lifecycle: 'Rapportens plassering og livssyklus',
      localLayer: 'A sitt skrivbare arbeidslag',
      reportFile: 'report.csv · opprettet etter image-bygging',
      currentInstance: 'A · samme deklarerte instans',
      currentData: 'Rapporten er beholdt på sitt erklærte lagringssted, uten instansbytte.',
      storedWithoutExecution:
        'Rapporten er beholdt; dette beviser ingen tilgjengelig applikasjonsprosess.',
      reportProducer: 'A · instansen som laget rapporten',
      reportWritten: 'Rapporten er skrevet til datatjenesten',
      replacement: 'B · ny instans fra samme image',
      externalData: 'Separat persistent datatjeneste',
      lostData: 'A sin rapport følger ikke med til B',
      retainedData: 'B kan bruke den eksplisitt beholdte rapporten',
      hostBoundary:
        'Isolasjon og driftsansvar er forskjellige valg. Figuren modellerer ingen faktisk kernel, prosess eller Azure-datatjeneste.',
      isolations: ['Process · delt host-kernel', 'Hyper-V · lett VM, egen kernel'],
      storage: 'Rapportens lagringssted',
      storages: ['Instansens skrivbare arbeidslag', 'Eksplisitt eksternt persistent lager'],
      action: 'Livssyklushendelse',
      actions: ['Undersøk eksisterende instans', 'Recreate · slett A og opprett B'],
      pipeline: ['Image / kode', 'Runtime / host', 'Instans', 'Applikasjonsprosess', 'Rapportdata'],
      ownGuest: 'Guest-OS administreres av kunden',
      kernel: 'Separat kernel i modellen',
      shared: 'Delt host-kernel i modellen',
      providerKernel:
        'Functions: kernel og host-isolasjon er ikke modellert; leverandøren håndterer kjøregrunnlaget.',
      functionCode:
        'Funksjonskode er forutsatt tilgjengelig; image-valget brukes ikke for denne kodebaserte Functions-modellen.',
      noProcess: 'Ingen modellert prosess: undersøk image, runtime og kontrollkrav.',
      lost: 'Ny instans er etablert, men rapporten i A sitt arbeidslag følger ikke med.',
      kept: 'Modellen har kjøregrunnlag og rapporten beholdes etter den erklærte hendelsen.',
      yes: 'Ja',
      no: 'Nei',
      data: 'Rapport beholdt',
      instance: 'Deklarert instans',
      note: 'A har allerede laget rapporten før undersøkelsen. Undersøk beholder A og krever ingen ny image-henting. Recreate sletter A før B forsøkes etablert; data i ekstern lagring slettes ikke dersom B mangler runtime eller image. Image og kode kjører ikke her. Ekstern lagring er en eksplisitt modellforutsetning, ikke konfigurert Azure Storage.',
    },
    capacity: {
      title: 'VM Capacity & Resilience Lab',
      mode: 'Plasserings-/administrasjonsmodell',
      modes: [
        'Én VM',
        'Availability set · FD/UD, ingen oppgitt sone',
        'VMSS Flexible · ingen oppgitt sone',
        'VM-er fordelt på tre soner',
      ],
      count: 'Deklarert instansantall · 1–6',
      demand: 'Behov · arbeidsenheter per intervall',
      auto: 'Aktiver oppgitt VMSS-regel før feil',
      rule: 'Regel: behov /10, rund opp, minst1 og maksimalt6 instanser. Den beregnes før feilen og reparerer ingenting etterpå.',
      failure: 'Modellert hendelse',
      failures: [
        'Ingen feil',
        'Én instans',
        'Fault domain',
        'Update domain · planlagt',
        'Deklarert fysisk feilgrense',
        'Hele regionen',
        'Felles datatjeneste',
      ],
      target: 'Hendelsens mål · nullbasert indeks',
      routing: 'Deklarert routing',
      routings: ['Bare første instans', 'Alle overlevende instanser'],
      data: 'Nødvendig data er tilgjengelig',
      units:
        'Én instans har10 fiktive arbeidsenheter per intervall. Dette er ikke vCPU, requests/second, Azure-autoscale eller en ytelsesmåling.',
      columns: ['Instans', 'Sone', 'FD', 'UD', 'Påvirket', 'Routet', 'Leverbar kapasitet'],
      metrics: [
        'Deklarerte instanser',
        'Overlevende instanser',
        'Leverbar kapasitet',
        'Udekket behov',
      ],
      none: 'Ingen UD i denne modellen',
      affected: 'Påvirket',
      survived: 'Overlever',
      note: 'Hver frisk, rutet instans gir10 pedagogiske arbeidsenheter per intervall. Bare zonal-alternativet oppgir Azure-soner1–3. Set/single/VMSS har ukjent Azure-sone; øvelsen antar eksplisitt én felles fysisk feilgrense med indeks0 for disse, uten å utlede dette fra tjenesten. Sone-/lokalitetsfeil bruker den deklarerte grensen. Ingen faktisk plassering, autoskalering, failover, trafikk, SLA eller helse er målt.',
      zonalLabel: 'Availability Zone',
      fixtureSite: 'Felles modellert lokalitet · ikke en oppgitt Azure-sone',
      unknownZone: 'Ikke oppgitt',
    },
    desktop: {
      title: 'Azure Virtual Desktop Explorer',
      pool: 'Host pool-type',
      pools: ['Personal', 'Pooled'],
      publication: 'Application group publiserer',
      publications: ['Full desktop', 'RemoteApp'],
      session: 'Valgt session-host-OS',
      sessions: ['Single-session', 'Multi-session'],
      linked: 'Application group er knyttet til workspace',
      assigned: 'Brukeren er tilordnet application group',
      hosts: 'Deklarerte session hosts · 0–4',
      nodes: [
        'Bruker',
        'Workspace',
        'Application group',
        'Host pool',
        'Session hosts',
        'Desktop / RemoteApp',
      ],
      details: [
        'Brukerens tilordning er en antakelse, ikke utført autentisering.',
        'Workspace grupperer application groups, ikke VM-kjerner eller applikasjonsfiler.',
        'Gruppen publiserer desktop eller apper fra én host pool.',
        'Pool samler session hosts med valgt tilordning.',
        'Disse VM-ene er kjøregrunnlaget; app/image og tilgang må være riktige.',
        'Feed og teknisk kjøregrunnlag er forskjellige kontrollpunkter.',
      ],
      relations: [
        'Tilordnes publiserte ressurser',
        'Registrerer application group',
        'Publiserer fra én host pool',
        'Samler session hosts',
        'Kjører app/skrivebord',
        'Leveranseform · ingen ekte sesjon',
      ],
      statuses: ['Tilordnet', 'Ikke tilordnet', 'Registrert', 'Mangler registrering'],
      invalid:
        'Den valgte personal/RemoteApp- eller personal/multi-session-kombinasjonen støttes ikke av denne modellen.',
      missing: 'Ressursen kan ikke publiseres med de deklarerte tilknytningene.',
      noHost: 'Publiseringen finnes, men ingen deklarert session host gir kjøregrunnlag.',
      ready:
        'Publisering og erklært host-grunnlag henger sammen. Ingen sesjon eller brukerrespons er testet.',
      inspect: 'Undersøk serviceobjekt',
      note: 'Original ARM-basert konseptmodell. Ingen AVD classic, innlogging, lisenssjekk, RDP eller sesjonsmåling.',
    },
    hosting: {
      title: 'Hosting Decision Studio',
      workload: 'Undersøk arbeidskravet',
      workloads: [
        'HTTP-kode, administrert webflate',
        'HTTP-image, administrert ingress og livssyklus',
        'Containerworkload med eget Kubernetes-API/controllerkrav',
        'Program med nødvendig guest-kernel-driver',
        'Omskrevet hendelsesfunksjon med ujevne ankomster',
      ],
      service: 'Velg hostingkandidat',
      services: [
        'Azure Virtual Machines',
        'Azure App Service',
        'Azure Functions',
        'Azure Container Instances',
        'Azure Container Apps',
        'Azure Kubernetes Service',
      ],
      reason: 'Begrunn kandidatens egenskap',
      reasons: [
        'Guest-OS og kernelkontroll er nødvendig.',
        'App Service hoster støttet webkode direkte; custom container er et alternativ i samme plattform.',
        'Funksjonskode aktiveres av relevante hendelser på egnet plan.',
        'En enkel containergruppe trenger ikke full orkestrering.',
        'Container Apps gir revisjonsbasert containerlivssyklus og ingress uten direkte Kubernetes-API.',
        'Direkte Kubernetes-API og orkestreringskontroll er et krav.',
      ],
      valid: 'Både kandidat og begrunnelse passer de oppgitte kravene.',
      wrongReason:
        'Kandidaten kan passe, men begrunnelsen beskriver ikke hvorfor dette valget virker.',
      wrongService:
        'Kandidaten oppfyller ikke alle erklærte krav. Undersøk kontroll, pakkeform og operasjonelt ansvar.',
      alternatives: 'Andre kandidater som oppfyller de samme avgrensede kravene',
      retained:
        'Kunden beholder kode/image, data, tilgang, applikasjonssikkerhet og korrekt konfigurasjon. Plan/tier/mode må kontrolleres før virkelig bruk.',
      counter:
        'Endre ett vesentlig krav og forutsi hvorfor kandidatsettet endres. Det er et nytt modelløyeblikk, ikke en omklassifisering av tidligere svar.',
      comparison: 'Kravfilter: hvorfor en kandidat beholdes eller faller bort',
      columns: ['Kandidat', 'Forutsetning som må endres', 'I dette eksempelet'],
      included: 'Oppfyller deklarerte krav',
      excluded: 'Utenfor oppgitt kravsett',
      qualified:
        'Tabellen vurderer bare de erklærte pedagogiske kravene. Den er ikke en full produktkatalog eller garanti for produksjonsegnethet.',
      mismatch: {
        format: 'Pakke-/kodeformatet passer ikke den avgrensede kandidaten.',
        guest: 'Kravet til egen guest-kernel/driver mangler.',
        kubernetes: 'Direkte Kubernetes-API og egne controllers er ikke tilgjengelig.',
        event: 'Arbeidsmåten krever den deklarerte Functions-modellen.',
        operations: 'Det oppgitte teamet vil unngå guest-/Kubernetes-drift.',
        ingress: 'En bar containergruppe er ikke den etterspurte integrerte HTTP-hostingflaten.',
      },
    },
  },
  missions: {
    vm: {
      title: 'A · Configure & Inspect an Indexing VM',
      situation:
        'Fjordarkiv trenger en ny Windows-basert indeksarbeider i App Sandbox. Den skal bruke standard undervisningsprofil, separat64GiB datadisk og et eksisterende egnet subnet. Teamet trenger en teknisk overlevering, ikke en påstand om at indekseringen kjører.',
      goal: 'CP03: begrunn konfigurasjonen og følg faktiske disk-/NIC-/subnet-/VNet-referanser etter en ny akseptert kommando.',
      steps: [
        'Undersøk krav og riktig App Sandbox Resource group.',
        'Finn et egnet subnet i samme gruppe/region. Hvis ingen finnes: opprett først en liten grunnlags-VM med nytt nettverk gjennom den vanlige Portal-formen. Den er en forutsetning, ikke indeksarbeideren.',
        'Opprett deretter ny Windows/standard/64GiB-VM og velg det eksisterende subnettet.',
        'Undersøk accepted receipt og hver faktisk ressursreferanse.',
        'Returner og forklar konfigurert versus kjørende/helseverifisert program.',
      ],
      observe:
        'Ny accepted bundle etter oppdragsstart, valgt gjenbrukt subnet og sju eksplisitt undersøkte referanser. Ingen bakgrunnsopprettelse eller global reset.',
      why: 'En VM er en sammensatt konfigurasjon; riktig navn og et grønt ikon er ikke nok.',
      where:
        'Bruk faktisk Portal → Resource groups / Virtual machines → Create, deretter Overview og relaterte ressurser.',
      debrief:
        'Den lokale kvitteringen og referansene dokumenterer støttet Windows-/disk-/nettverkskonfigurasjon. De dokumenterer ikke boot, programinstallasjon, backup, sikkerhet eller trafikk.',
    },
    container: {
      title: 'B · Container or Virtual Machine?',
      situation:
        'Et team kan distribuere en rapportgenerator som image. Rapporten må være tilgjengelig også etter at instansen erstattes. Ingen egen guest-kernel kreves i denne varianten.',
      goal: 'CP01: skille pakke, runtime, instans, prosess og persistent data, og begrunne når VM-kontroll ville endret valget.',
      steps: [
        'Undersøk container med recreate og rapport i instansens arbeidslag.',
        'Forutsi og kjør før du endrer lagringsforutsetningen.',
        'Velg eksternt persistent lager, forutsi og kjør på nytt.',
        'Undersøk image/runtime og guest-krav som alternative årsaker.',
        'Forklar hva som faktisk endret rapportens livssyklus.',
      ],
      observe:
        'To lagrede recreate-øyeblikk med gyldig containergrunnlag: først ephemeral tap, deretter eksplisitt beholdt data.',
      why: 'Et image er ingen backup av filer som oppstår etter oppstart.',
      where:
        'Kontrollene står rett over den koblede livssyklusfiguren og tilsvarende egenskapstabell.',
      debrief:
        'Du har sammenlignet to eksplisitte datalivssykluser, ikke kjørt eller lagret en ekte container. Kernel-/plattformansvar må fortsatt kvalifiseres.',
    },
    capacity: {
      title: 'C · Scale & Survive',
      situation:
        'En registreringstjeneste trenger kapasitet under etterspørsel og en avgrenset sonefeil. Teamet forveksler availability set, flere instanser og automatisk skalering.',
      goal: 'CP02: skille instansantall, FD/UD, soner og data/routing fra hverandre.',
      steps: [
        'Kjør availability set under den deklarerte felles fysiske feilen (målindeks0), og skill denne øvelsesforutsetningen fra kjent Azure-soneplassering.',
        'Sammenlign minst tre VM-er eksplisitt fordelt over soner ved feil i Zone1 (målindeks0), med nok kapasitet, data og balanced routing.',
        'Kjør VMSS-regelen med minst30 arbeidsenheter og ingen feil.',
        'Undersøk deretter felles datafeil eller primary-only routing.',
        'Forklar forskjellen mellom de observerte mekanismene.',
      ],
      observe:
        'Tre forskjellige lagrede årsaksøyeblikk: sonegrense, eksplisitt soneseparasjon og deklarert kapasitetsregel.',
      why: 'Mer compute kan løse behov uten å løse feilplassering eller avhengigheter.',
      where:
        'Velg modell, behov og hendelse før prediksjon; alle instansers sone/FD/UD står i tabellen.',
      debrief:
        'Resultatene følger den oppgitte modellen. Ingen ekte VMSS, SLA, automatisk failover eller apphelse er dokumentert.',
    },
    hosting: {
      title: 'D · Select Application Hosting',
      situation:
        'Et API-team skal først velge administrert hosting for et HTTP-image. Deretter tilkommer et ufravikelig krav om egne Kubernetes controllers. Undersøk hvorfor kandidatene endres.',
      goal: 'CP04: begrunn et hostingvalg, forstå retained responsibilities og sammenlign et reelt alternativ.',
      steps: [
        'Kjør HTTP-image-kravet med et faglig gyldig kandidat/begrunnelse-par.',
        'Undersøk minst én annen kandidat og dens ansvar.',
        'Bytt til Kubernetes-API/controllerkravet, begrunn og kjør.',
        'Undersøk AVD-publiseringskjeden i desktop-aktiviteten som et annet leveransebehov.',
        'Åpne eventuelt en faktisk VM eller Web App i Portal og skill inventory fra modellkandidater.',
      ],
      observe:
        'To lagrede gyldige beslutningspar med forskjellige kontrollkrav. AVD har egne semantiske observasjoner, uten falsk sesjon.',
      why: 'Pakkeform og ønsket kontrollflate er forskjellige krav.',
      where:
        'Krav, kandidat og begrunnelse velges over sammenligningen. AVD og faktisk Portal har synlige lenker.',
      debrief:
        'Flere kandidater kan være riktige når kravene tillater det. Endret kontrollbehov gir et nytt kandidatsett; kode, data, tilgang og konfigurasjon forblir kundeansvar.',
    },
  },
  milestone: {
    container: {
      title: 'Rapporten følger lagringsvalget, ikke image-navnet',
      text: 'De lagrede containerkjøringene viser recreate med og uten eksplisitt persistent lagring. Runtime-grunnlaget var gyldig i begge. Forskjellen i beholdt rapport skyldes datalivssyklus, ikke at et image automatisk arkiverer runtime-filer.',
    },
    capacity: {
      title: 'Flere instanser og feilseparasjon er forskjellige mekanismer',
      text: 'Du har lagrede undersøkelser av en deklarert felles fysisk feilgrense for set-eksemplet, eksplisitt soneseparert kapasitet og en VMSS-regel. Setets Azure-sone er ikke oppgitt. Resultatet følger øvelsens forutsetninger, avhengigheter og regelvalg; ingen tjenestenavn garanterer applikasjonstilgjengelighet.',
    },
  },
  title: 'Describe Azure compute services',
  path: 'Introduction to Cloud Infrastructure: Describe Azure architecture and services',
  overview:
    'Fra arbeidslast til kjørende kode: undersøk VM-er, containere, Functions, virtuelle skrivebord og hosting. Bygg én faktisk lokal VM-konfigurasjon og test avgrensede arkitekturmodeller før nye selvstendige situasjoner.',
  available:
    'Fire Compute-mål og Networking Part A og B er tilgjengelige med separate versjonerte resultater. Storage kommer senere. Lokal trening, ingen Azure-konto eller reelle ressurser.',
  prerequisites:
    'Forkunnskaper: fysiske servere og virtualisering, IaaS/PaaS, regioner og soner, management-hierarki og forbruksmodeller. Vi bygger videre på disse uten å endre tidligere resultater.',
  topics: {
    introduction: 'Oppdraget: fem ulike arbeidslaster',
    fundamentals: 'Hva kjører koden?',
    vm: 'Virtual Machines: guest og ressursprofil',
    dependencies: 'VM Resources & Dependencies',
    containers: 'Container Execution Explorer',
    functions: 'Functions i compute-landskapet',
    options: 'Velg VM-alternativ',
    resilience: 'VM Capacity & Resilience Lab',
    desktop: 'Azure Virtual Desktop Explorer',
    hosting: 'Hosting Decision Studio',
    context: 'AI, machine learning og IoT/Edge',
    missions: 'Guidede anvendelser',
    assessment: 'Selvstendig Compute-anvendelse',
    summary: 'Oppsummering og dokumenterte resultater',
  },
  labels: {
    terms: 'Begreper i denne forklaringen',
    example: 'Gjennomarbeidet eksempel',
    limits: 'Avgrensning og moteksempel',
    sources: 'Offisielle kilder · kontrollert 28. oktober 2026',
    model: 'Pedagogisk konseptmodell · ingen Azure-runtime',
    configured: 'Utkast til forutsetninger',
    observed: 'Sist lagrede observasjon',
    predicted: 'Din prediksjon',
    result: 'Modellens resultat',
    run: 'Kjør modellen',
    predict: 'Forutsi før kjøring',
    cause: 'Forklar årsaken',
    explain: 'Lagre årsaksforklaring',
    done: 'Guidet anvendelse dokumentert',
    pending: 'Ikke dokumentert ennå',
    begin: 'Åpne SavvyShark-briefing',
    start: 'Start dette oppdraget',
    cancel: 'Avbryt',
    recall: 'Gjenåpne briefing',
    next: 'Neste handling',
    where: 'Hvor finner du kontrollen?',
    why: 'Hvorfor gjør du dette?',
    expected: 'Hva skal du observere?',
    actual: 'Faktisk registrert',
    inspect: 'Bekreft undersøkt referanse',
    portal: 'Åpne faktisk Portal',
    return: 'Tilbake til Compute-oppdraget',
    all: 'Alle detaljer kan leses i tabellen',
    first: 'Første innlevering',
    aided: 'Med registrert hjelp',
    retry: 'Gjeneksponert familie / retry',
    unaided: 'Første uassisterte forsøk',
    guided: 'Guidede oppdrag',
    visited: 'Undervisningsaktiviteter åpnet',
    independent: 'Uavhengige innleveringer',
    classification: 'Forsøkstype og hjelp',
    noXp: 'Ingen XP, Microsoft Learn-fullføring eller exam readiness utledes.',
    human:
      'Kvalifisert menneskelig Azure-SME-, novice/IT-, UX-, skjermleser- og målt transfer-validering er ikke gjennomført.',
    switch:
      'Ett guidet oppdrag er nåværende. Gjenoppta et lagret oppdrag for å beholde dets forutsetninger og observasjoner, eller start et nytt forsøk. Pause og vanlig navigasjon sletter ikke arbeidet.',
    current: 'Fortsett nåværende oppdrag',
    notice:
      'Start oppretter bare en lokal læringskontekst. Avbryt og lukking endrer ingen ressurs eller vurdering. Modellkjøring og tekniske Portal-kommandoer krever egne eksplisitte handlinger.',
    predictionOptions: [
      'Velg prediksjon',
      'Ingen leverbar kapasitet / arbeid',
      'Noe arbeid eller kapasitet gjenstår',
      'Alle deklarerte krav dekkes',
    ],
    chooseCause: 'Velg årsaksforklaring',
  },
  storage: {
    loading: 'Laster versjonert Compute-arbeid …',
    title: 'Compute-lagring må avklares',
    text: 'Svar og forklaringer holdes tilbake når lagringen er usikker. Last inn gjeldende registrering; svarutkast fra ulike faner flettes aldri.',
    reload: 'Last inn Compute på nytt',
    recover: 'Gjenopprett bare ugyldige Compute-data',
    confirm: 'Bekreft isolert gjenoppretting',
    cancel: 'Behold data',
    capacity:
      'Ny aktivitet er stanset ved hendelsesgrensen. Et aktivt forsøk kan fortsatt lagre siste svar, registrere hjelp og levere eller avbryte. En allerede undersøkt guidet aktivitet kan avsluttes.',
    failed: 'Handlingen ble ikke varig lagret. Ingen faglig fullføring er registrert.',
    milestones:
      'Automatiske forklaringer er satt på pause fordi visningshistorikken ikke kan bekreftes. Arbeidet kan fortsette; forklaringen kan åpnes manuelt når konteksten er trygg.',
    unsafe:
      'Automatisk veiledning er skjermet under aktiv selvstendig vurdering eller usikker lagring. Åpne vurderings-/recovery-konteksten nedenfor.',
  },
  sections: {
    introduction: {
      title: 'Samme organisasjon, forskjellige kjørebehov',
      paragraphs: [
        'Fjordarkiv skal flytte flere arbeidslaster. En eldre indeksmotor trenger et bestemt Windows-miljø og en separat datadisk. Et publikumsteam eier en web-API. En analysegruppe leverer programmet som et container-image. Filopplastinger skal utløse korte valideringsjobber, mens saksbehandlere trenger en Windows-applikasjon fra flere enheter. Å kalle alt «en server» skjuler valgene som avgjør drift, sikkerhet og vedlikehold.',
        'Compute er kapasiteten som utfører instruksjonene i programmet. Koden trenger en prosessor, minne og et kjøremiljø, også når kunden ikke ser en VM. Hostingvalget bestemmer hvilke deler du selv konfigurerer og hvilke deler plattformen administrerer. Det påvirker hvordan programmet pakkes, starter, oppdateres og får kapasitet. Valget av region eller subscription svarer på andre spørsmål enn valg av kjøreplattform.',
        'I denne modulen følger vi kode gjennom flere tekniske lag. Du undersøker først VM og avhengigheter, deretter containerens livssyklus og Functions som hendelsesdrevet alternativ. Så skiller vi instansantall, fysisk feilseparasjon og applikasjonstilgjengelighet. Azure Virtual Desktop viser hvorfor levering av et skrivebord krever mer enn at én VM eksisterer. Til slutt velger du hosting ut fra konkrete krav, og begrunner nye beslutninger uten trinnvis hjelp.',
      ],
      terms: [
        ['Compute', 'Ressurser og tjenester som utfører programkode.'],
        ['Arbeidslast', 'Programmet, dataene, avhengighetene og driftskravene som skal løses.'],
        ['Hosting', 'Miljøet som tar imot og kjører programmet.'],
      ],
      example:
        'Et krav om egen Windows-driver kan peke mot VM. Et ferdig container-image uten guest-krav åpner flere alternativer. Et krav om å publisere én skrivebordsapp til ansatte handler om AVD, ikke bare om mer vCPU.',
      limit:
        'Vi oppretter bare støttede lokale VM-/Web-konfigurasjoner. Containers, VMSS, availability sets og AVD undersøkes som tydelig merkede modeller. Ingen programvare bootes eller kjøres i Azure.',
    },
    fundamentals: {
      title: 'Fra instruksjoner til et administrert kjøremiljø',
      paragraphs: [
        'En fysisk prosessor utfører instruksjoner, og RAM holder data tilgjengelig mens programmet arbeider. Operativsystemets kernel fordeler maskinressurser, håndterer prosesser og gir programmet tilgang til blant annet minne, filer og enheter. Et språk-runtime, for eksempel .NET eller en Java Virtual Machine, er et annet lag enn maskinvirtualisering. En Java Virtual Machine er derfor ikke det samme som en Azure Virtual Machine.',
        'I en Azure VM abstraherer virtualiseringslaget maskinvaren, og et guest-operativsystem gir programmet sitt miljø. I et vanlig prosessisolert containeroppsett får prosessen en isolert visning av utvalgte host-ressurser og deler hostens kernel. Functions tar imot funksjonskode i et administrert hendelsesmiljø. Alle trenger fysisk compute; forskjellen er hvilke enheter du distribuerer og hvilke driftsoppgaver du beholder.',
        'Se på livssyklusen før du velger. En kontinuerlig tjeneste må ha egnet tilgjengelig kjøreflate. En hendelsesjobb kan aktiveres av en trigger, men trenger fortsatt korrekt kode, datahåndtering og feilhåndtering. Et image eller en konfigurasjon beskriver ønsket utgangspunkt. Det er ikke en observasjon av en fungerende prosess. Opprettet infrastruktur, installert applikasjon og verifisert brukerrespons er tre forskjellige bevis.',
        'Mer allokert kapasitet koster normalt mer og hjelper bare når riktig ressurs er flaskehalsen. Et minnekrav løses ikke automatisk med flere små instanser, og en delt databasefeil forsvinner ikke ved å legge til compute. Repetisjon av et image forbedrer konsistens, men kan også gjenta samme feil. Teamets evne til å oppdatere, overvåke og validere løsningen er derfor et faktisk valgkriterium.',
      ],
      terms: [
        ['Kernel', 'Kjernen i operativsystemet, med kontroll over grunnleggende systemressurser.'],
        ['Runtime', 'Programmiljøet som laster eller utfører applikasjonskode.'],
        ['Livssyklus', 'Hvordan en enhet opprettes, oppdateres, erstattes og avsluttes.'],
      ],
      example:
        'Et .NET-program kan kjøre i en VM, i et container-image, i App Service eller som funksjonskode. Programmodell, nødvendige systemfunksjoner, triggerbehov og driftskrav avgjør hvilke av dem som passer.',
      limit:
        'IaaS/PaaS/serverless er ikke en rangstige der «mer administrert» alltid er bedre. Nettverk, data, sikkerhet, kompatibilitet og tjenesteplan må fortsatt vurderes.',
    },
    vm: {
      title: 'Virtual Machines: kontrollen følger ansvaret',
      paragraphs: [
        'En hypervisor gir flere VM-er virtuelle maskinressurser på fysisk infrastruktur. Hver VM har sitt guest-operativsystem med egen kernel. Microsoft håndterer fysisk host og virtualiseringsplattform. Kunden velger og vedlikeholder guest-miljø, installert programvare, data, tilgang og sikker konfigurasjon. VM er relevant når du trenger slike systemvalg, eller flytter et eksisterende program uten å endre hele programmodellen.',
        'Et VM image er utgangspunktet for operativsystem og eventuelt forhåndsinstallert programvare. Det er ikke en kjørende VM, og et gammelt image blir ikke sikkert bare fordi det kom fra en mal. Imageoppdateringer, patching og riktig softwaretilstand må inngå i driften. En VM size angir en ressursprofil med blant annet vCPU, RAM og begrensninger for disk/nettverk. En vCPU er en virtuell prosessorressurs; GiB beskriver datamengde, mens RAM og disk har forskjellige roller.',
        'Azure har størrelsesfamilier for ulike behov. CPU-tung behandling, stort minnebehov, lagringsintensiv behandling og GPU-arbeid kan kreve forskjellige profiler. Du velger en støttet SKU med bestemte kombinasjoner; du kan ikke anta at ethvert fritt vCPU/RAM-par kan bestilles. Region, kvoter, tilgjengelig kapasitet og kompatibilitet må vurderes separat. AzureLabs small og standard er egne undervisningsprofiler, ikke løfter om nåværende Azure-SKU, pris eller ytelse.',
        'Indekseringsoppdraget bruker Windows, standardprofilen og en separat64GiB datadisk i App Sandbox. Du må undersøke hvorfor disse kravene gjelder og bruke et eksisterende egnet subnet i samme gruppe og region etter simulatorens regler. Et annet tidligere oppdrag kan ha brukt Linux eller Shared Sandbox; det er ikke tilstrekkelig nytt bevis. En ny akseptert bundle etter oppdragsstart er nødvendig.',
      ],
      terms: [
        ['Hypervisor', 'Laget som virtualiserer fysisk maskinvare for VM-er.'],
        ['Guest OS', 'Operativsystemet inne i VM-en.'],
        [
          'vCPU og RAM',
          'Virtuell prosessorkapasitet og arbeidsminne; ikke diskvolum eller målt gjennomstrømning.',
        ],
      ],
      example:
        'En Windows-komponent som må installeres og vedlikeholdes på guest-nivå kan passe i en VM. Kunden må fortsatt planlegge oppdatering og gjenoppretting; et accepted Create-resultat bekrefter bare støttet konfigurasjon i AzureLab.',
      limit:
        'Ingen credentials, RDP, SSH, boot, guest-agent, indeksering eller helsemåling er støttet lokalt. Ingen offentlig IP er nødvendig for oppgaven eller modellert av simulatoren.',
    },
    dependencies: {
      title: 'VM-en er ett ledd i en faktisk ressurskjede',
      paragraphs: [
        'OS disk inneholder guest-operativsystemets lagrede filer. En data disk kan gi et separat blokkvolum for applikasjonsdata. En disk er ikke RAM, og en ekstra disk er ikke automatisk en sikkerhetskopi. Temporary/local lagring på relevante virkelige VM-størrelser har andre varighetsgrenser; ikke legg eneste kopi av viktige data der. Den lokale simulatoren modellerer OS-/datadiskreferanser, ikke filsystem, backup eller disk-I/O.',
        'En Network Interface, NIC, kobler VM-konfigurasjonen til et subnet i et Virtual Network. Følg kjeden VM→NIC→subnet→VNet og kontroller at referansene finnes. Dette viser konfigurerte relasjoner. Det er ikke en pakkeobservasjon, en åpen brannmur eller bevis på at tjenesten kan nås. Ekte Azure har blant annet IP-, sikkerhets- og rutingsforhold som ikke er operative i denne øvelsen. Public IP er valgfritt, ikke et universelt krav for enhver VM.',
        'Resource group og subscription gir den administrative konteksten. Region er en ressursplassering. Felles gruppemedlemskap gjør ikke en NIC til vert for en VM, og gruppens metadata-location flytter ikke diskene. I denne avgrensede motoren må valgt subnet være i samme gruppe og region som den nye VM-en. Det er en lokal støtteregel; ekte Azure kan støtte andre grupper for relaterte ressurser når de dokumenterte vilkårene er oppfylt.',
        'Når du sender CreateVmBundle, validerer motoren hele forespørselen før den legger til VM, nødvendige disker, NIC og eventuelt nettverksressurser. Avslag gir ingen delvis bundle. Bruk den aksepterte kvitteringen til å identifisere hva som faktisk ble opprettet. Åpne deretter hver referanse. Et historisk inventory kan brukes til undersøkelse, men kan ikke alene oppfylle kravet om en ny VM etter dette oppdragets tekniske startgrense.',
      ],
      terms: [
        [
          'OS disk / data disk',
          'Lagring for guest-system og separat lagring for applikasjonsdata.',
        ],
        ['NIC', 'Nettverksgrensesnitt med referanse til et subnet.'],
        [
          'Kvittering',
          'Replayed lokalt kommandoresultat, ikke en Azure-deployment eller driftstest.',
        ],
      ],
      example:
        'En akseptert VM kan peke til disk-7 og nic-9, mens nic-9 peker til subnet-4 og videre til vnet-3. Disse ID-ene må finnes i samme autoritative inventory; et diagram med oppdiktede noder er ikke inspeksjon.',
      limit:
        'Compute-modulen forklarer nødvendig nettverksrelasjon, men dekker ikke peering, DNS, VPN, ExpressRoute eller public/private endpoints. Disse forblir senere P06/P07-mål.',
    },
    containers: {
      title: 'Image er oppskriften; instansen er det som kjører',
      paragraphs: [
        'Et container-image pakker applikasjonen med nødvendige user-space-biblioteker, runtime og filinnhold. En språkruntime, som Python-tolken i vårt eksempel, kan være en del av pakken. Container runtime er en annen komponent: den etablerer containeren på hosten. Et registry lagrer og distribuerer images; Azure Container Registry er ett alternativ. Registryet utfører ikke applikasjonen. Container runtime bruker et egnet image for å etablere en instans som kan starte applikasjonsprosessen. Ett image kan derfor gi flere separate instanser, mens et image som bare er lagret ikke betyr at noen prosess kjører.',
        'Vanlige prosessisolerte containere deler kernel med host-operativsystemet. De får avgrensede visninger av for eksempel filer, prosesser og nettverk, samt ressursgrenser. De inneholder normalt ikke en egen guest-kernel slik en VM gjør. Dette betyr ikke at enhver container har samme sikkerhetsgrense. Windows Hyper-V-isolasjon bruker en lett VM og egen kernel; andre plattformer kan ha ytterligere grenser. Kompatibilitet, privilegier, imageinnhold og tjenestens modell må vurderes.',
        'En instans har eget skrivbart arbeidslag. Dersom den slettes og erstattes fra samme image, følger ikke tilfeldige nye filer i dette laget automatisk med. Data som skal overleve må ligge i eksplisitt egnet persistent lagring eller en separat datatjeneste. Restart av samme instans og recreate av en ny er ikke alltid samme operasjon. Explorer bruker bevisst recreate for å vise denne forskjellen, uten å generalisere alle tjenesters lagringsoppsett.',
        'Azure Container Instances passer til avgrenset container-/containergruppekjøring uten å bygge full orkestrering. Azure Container Apps gir en administrert applikasjonsplattform med blant annet revisjoner, ingress og konfigurerbar hendelses-/HTTP-skalering. Ikke alle scalere kan gå til null. AKS gir Kubernetes-objekter og kontrollmuligheter; Automatic og Standard flytter forskjellige driftsoppgaver. App Service kan også hoste custom containers for web-behov. Et container-image er dermed en pakkeform, ikke ett bestemt Azure-tjenestenavn.',
        'Kunden må holde applikasjon og egne imageavhengigheter oppdatert, gi minst nødvendige rettigheter og konfigurere data/tilgang riktig. En administrert plattform kan vedlikeholde hosten uten å rette sårbarheter i ditt image. Kjører kunden selv container runtime på sin egen VM, beholder kunden også VM-vertens OS-arbeid. Containerisolasjon og hvem som drifter hosten er forskjellige spørsmål. Samme image kan gjøre leveransen mer konsistent, men ulike secrets, lagring, kernelkrav og eksterne tjenester kan fortsatt gi forskjellig resultat. I modellen sammenligner du derfor både hostingansvar, kjørebehov og datalivssyklus.',
      ],
      terms: [
        ['Image', 'Distribuerbar, versjonert pakke; ikke en aktiv prosess.'],
        [
          'Runtime og instans',
          'Miljøet som etablerer containeren, og en konkret opprettet container.',
        ],
        [
          'Persistent lagring',
          'Eksplisitt datalagring med livssyklus som kan overleve instansbytte.',
        ],
      ],
      example:
        'En bildekonverterer kommer som image v3. To instanser kan utføre jobber fra samme pakke. Skriver de resultatet bare i sitt eget midlertidige arbeidslag, er ikke resultatet garantert beholdt når instansene erstattes. Et eksplisitt eksternt lager endrer den forutsetningen.',
      limit:
        'Explorer kjører ingen image, container, Docker-daemon eller Kubernetes. Valgt Hyper-V-modell illustrerer et dokumentert isolasjonsmoteksempel, ikke en valgbryter som alle Azure-containertjenester tilbyr.',
    },
    functions: {
      title: 'Functions flytter starten til en hendelse, ikke ansvaret bort',
      paragraphs: [
        'En melding, HTTP-forespørsel, filhendelse eller tidsplan kan aktivere en trigger i Azure Functions. Triggeren kobler hendelsen til funksjonskoden; koden utfører arbeidet og kan lagre eller sende et resultat. Dette bygger på Serverless Execution Explorer. Compute-valget gjelder nå om denne programmodellen faktisk passer arbeidslasten, sammenlignet med en kontinuerlig serverprosess eller en containerisert jobb.',
        'En jobb som validerer nye dokumenter kan egne seg for Functions når hendelser og tilstand håndteres bevisst. Et krav om egen kernel-driver eller et uendret OS-avhengig program kan kreve VM. En containerpakke kan være relevant når flere native biblioteker eller en bestemt programoppstart må leveres samlet. Functions kan også hostes i containere på støttede planer; «Functions versus container» er derfor ikke alltid gjensidig utelukkende kategorier.',
        'Hostingplanen bestemmer kapasitet, skalering, nettverksfunksjoner, oppstart og kostnadsmodell. Flex Consumption har hendelsesdrevet skalering og mulighet for always-ready. Premium holder varm kapasitet, mens Dedicated bruker kapasitet i App Service plan. Container Apps er et annet hostingspor for containeriserte funksjoner. Ikke overfør en påstand om tomgang eller kjørevarighet fra én plan til alle. Kundens kode må fortsatt tåle feil, eventuelle gjentatte leveranser og eksterne avhengigheter.',
        'Microsoft administrerer mye av kjøreplattformen, mens kunden eier riktig kode, data, rettigheter, konfigurasjon og applikasjonssikkerhet. Bruk eksisterende Serverless-modul for full prediksjon/kjøring/årsaksforklaring. Å følge en repetisjonslenke gir ingen ny Compute-vurdering og registreres som hjelp dersom et selvstendig forsøk er aktivt.',
      ],
      terms: [
        ['Trigger', 'Mekanismen som aktiverer en funksjon for en relevant hendelse.'],
        [
          'Hendelsesdrevet',
          'Arbeidet starter som følge av en hendelse, ikke bare fordi en server står på.',
        ],
        ['Hostingplan', 'Tjenestevalg som påvirker kjøring, kapasitet, kostnad og egenskaper.'],
      ],
      example:
        'En kømelding om ny fil kan starte validering og lagre resultat uten at studenten administrerer en egen VM. En vellykket modellkjøring beviser bare at den deklarerte undervisningskjeden er konsistent.',
      limit:
        'Det finnes ingen ny Functions-ressurs eller runtime i Portal. Ingen universell nullkost-, scale-to-zero-, cold-start- eller tidsgrense påstås.',
    },
    options: {
      title: 'Fire VM-behov som må holdes fra hverandre',
      paragraphs: [
        'En enkelt VM er en konkret compute-enhet med guest-ansvar. Virtual Machine Scale Sets, VMSS, samler administrasjonen av flere VM-instanser og kan bruke skaleringsprofiler, regler eller tidsplaner. Et availability set organiserer flere VM-er i fault/update domains. Azure Virtual Desktop publiserer skrivebord og applikasjoner til brukere gjennom egne serviceobjekter. Disse løser forskjellige problemer; de er ikke fire størrelser av samme VM.',
        'VMSS kan øke eller redusere instansantallet. Det er scale out/in, mens endring av én VMs størrelse er scale up/down. Flexible orchestration bruker standard Azure-VM-er og gir fleksibilitet i instanssammensetning innenfor dokumenterte vilkår. Uniform bruker en mer felles instansprofil og scale-set-spesifikke instansobjekter. Orchestration mode velges ved opprettelse og byttes ikke bare som en runtime-bryter. Ikke anta at «alle VMSS-instanser er identiske» beskriver alle Flexible-oppsett.',
        'Automatisk skalering må ha hensiktsmessige signaler, grenser og innstillinger. Flere instanser hjelper bare hvis applikasjonen kan bruke dem, data er tilgjengelige og trafikken kommer frem. Et scale set uten riktig regel er ikke automatisk et svar på enhver topp. Et scale set kan være regionalt, i én sone eller fordelt over soner; scale-set-medlemskap alene er ikke sonebeskyttelse.',
        'Microsofts tilgjengelige produktdokumentasjon anbefaler Flexible når behovet er bred VM-funksjonalitet og skalerbar administrasjon. Availability Zones gir større fysisk feilseparasjon enn et availability set. Det betyr ikke at en universell ny konfigurasjon passer alle regioner, SKU-er eller eldre applikasjoner. Vurder arbeidslast, plassering, støtte, data, routing og driftsbehov sammen.',
      ],
      terms: [
        ['VMSS', 'En administrert gruppe VM-instanser med relevante profil-/skaleringsmuligheter.'],
        ['Flexible / Uniform', 'Ulike orkestreringsmodeller, ikke en skala for programkvalitet.'],
        [
          'Availability set',
          'Logisk plassering over fault og update domains, uten automatisk kapasitetsøkning.',
        ],
      ],
      example:
        'En batchtjeneste som trenger flere like jobbarbeidere kan bruke VMSS med en valgt kapasitetsregel. Et stabilt par VM-er som må tåle én vedlikeholdsgruppe kan analyseres med availability-set-begrepene. Ansattes skrivebord krever AVD-publisering og tilgang i tillegg til session-host-VM-er.',
      limit:
        'Modulen konfigurerer ingen operative VMSS-, availability-set- eller AVD-ressurser. Den sammenligner virkemåter på AZ-900-nivå.',
    },
    resilience: {
      title: 'Kapasitet, plassering og en fungerende tjeneste er ulike ting',
      paragraphs: [
        'Fault domain, FD, betegner en gruppe som kan dele et fysisk feilpunkt som strøm eller nettverkssvitsj. Update domain, UD, grupperer enheter som kan restartes sammen ved planlagt vedlikehold. En maskinfeil i FD0 og et planlagt vedlikehold i UD0 er to forskjellige hendelser. Availability sets sprer VM-er for å begrense slike samtidige påvirkninger; de beskytter ikke i seg selv mot alle programfeil eller en hel regionshendelse.',
        'Availability Zones er fysisk adskilte grupper av datasentre innen en region, med egne sentrale forsyninger. To VM-er i forskjellige FD-er innen samme sone kan fortsatt rammes av en sonehendelse. VM-er over flere soner kan gi gjenværende kapasitet hvis de relevante data- og routingforutsetningene også er oppfylt. En hel regionshendelse rammer fortsatt alle de deklarerte sonene i den regionen. Dette bygger på Part A, uten å utlede failover fra et regionsnavn.',
        'I Capacity & Resilience Lab er én modellenhet arbeid en oppgitt mengde per undersøkelsesintervall. Den er verken requests/second, vCPU, en SLA eller en Azure-måling. Hver modellinstans har ti slike kapasitetsenheter. Du velger instansantall, behov, plassering, feil, routing og datatilgjengelighet. VMSS-regelen er vår enkle deklarerte regel: tilpass antallet til behovet innen én til seks instanser når regelen er aktivert. Azure har mer komplekse og konfigurerbare signaler, tidsvinduer og begrensninger.',
        'Etter kjøring teller modellen hvilke deklarerte instanser feilen treffer, og hvor mye kapasitet som kan leveres gjennom valgt routing og data. En levende compute-instans med utilgjengelig felles data gir ingen fungerende applikasjonssti i denne modellen. Et availability set kan bevare en VM uten å skape mer kapasitet. En skaleringsregel kan tilføre instanser uten å rette dårlig plassering. Sammenlign derfor prediksjonen med det konkrete øyeblikksbildet, ikke med et generelt grønt tjenesteikon.',
      ],
      terms: [
        ['Fault domain', 'En deklarert felles feilgrense.'],
        ['Update domain', 'En gruppe som kan påvirkes samtidig ved planlagt plattformvedlikehold.'],
        [
          'Leverbar kapasitet',
          'Gjenværende kapasitet som også har modellert nødvendig data og routing.',
        ],
      ],
      example:
        'Tre instanser gir tretti enheter før feil. Hvilke som gjenstår etter feil avhenger av deres plassering. Et fungerende svar krever dessuten at de overlevende kan nås og har nødvendige avhengigheter. Det neste forsøket bruker andre forutsetninger; regn på dem før kjøring.',
      limit:
        'Ingen faktisk autoscaling, load balancer, failover, SLA, responstid, maskinhelse eller gjenopprettingstid beregnes. Bare eksplisitt erklært undervisningstopologi og årsaksregler inngår.',
    },
    desktop: {
      title: 'Azure Virtual Desktop: publiser et arbeidsmiljø',
      paragraphs: [
        'Azure Virtual Desktop, AVD, leverer virtualiserte skrivebord og applikasjoner. Tenk på et saksbehandlerteam som må bruke samme Windows-program fra forskjellige enheter. Appen kjører på en session host; brukerens enhet presenterer den fjerne opplevelsen. Dette er en annen leveranse enn å gi administratorer tilgang til en vanlig VM. En VM alene oppretter ingen publisert AVD-tjeneste.',
        'En host pool samler registrerte session-host-VM-er. En application group bestemmer hvilke skrivebord eller applikasjoner som publiseres fra én host pool. En workspace grupperer og gjør disse application groups tilgjengelige i brukerens feed. Tilordning av riktig bruker og gyldig publisering er nødvendig før tjenesten kan tilby riktig ressurs. Workspace er ikke en fysisk VM eller en kopi av applikasjonen.',
        'Pooled desktops kan fordele brukere mellom session hosts, og egnede Windows multi-session-oppsett kan ha flere brukersesjoner på samme host. Personal knytter et skrivebord til en bestemt bruker. Single-session versus multi-session beskriver sesjonsegenskap, mens personal versus pooled beskriver host-pool-tilordning. En RemoteApp application group publiserer utvalgte applikasjoner og støttes med pooled host pools; full desktop kan brukes med personal eller pooled. Ikke anta at alle kombinasjoner er gyldige.',
        'Microsoft driver blant annet broker-/gateway-deler i tjenesten. Kunden må fortsatt ha egnede images, applikasjoner, session hosts, data/profiler, nettverk og tilgangskonfigurasjon. Nyere management-tilnærminger kan automatisere mer av host-livssyklusen; det gjør ikke kundens applikasjons- og sikkerhetsvalg irrelevante. Nettverks- og plasseringsdesign må passe organisasjonens krav. Classic-arbeidsflyter brukes ikke i denne modulen.',
        'Explorer lar deg undersøke workspace, application group, pool og hosts som en semantisk publiseringskjede. Fjern en tilordning eller en host-forutsetning og undersøk forskjellen mellom at en ressurs finnes i feeden og at den har et deklarert kjøregrunnlag. Alle tilganger og hosts her er antakelser. Modellen utfører ingen innlogging, Windows-sesjon, lisenssjekk eller måling av samtidige brukere.',
      ],
      terms: [
        ['Session host', 'VM-en der brukerens virtuelle desktop eller app kjøres.'],
        ['Host pool', 'Samling session hosts med valgt tilordningsmodell.'],
        [
          'Application group / workspace',
          'Publisering fra pool og gruppering av publiserte ressurser i feeden.',
        ],
      ],
      example:
        'En regnskapsapp skal leveres alene, ikke som full desktop. Undersøk pooled/RemoteApp, workspace-tilknytning og brukertilordning. Bytt deretter til personal/full desktop og forklar hvorfor objektvalget og brukeropplevelsen endres.',
      limit:
        'AVD er en administrert virtualiseringstjeneste med kundeadministrerte deler. Ingen AVD-ressurser legges i Portal-inventory, og et gyldig modellvalg beviser ingen faktisk brukertilgang.',
    },
    hosting: {
      title: 'Hosting velges fra krav, ikke fra en rangstige',
      paragraphs: [
        'Start med det arbeidslasten faktisk trenger. Må teamet styre guest-OS eller kernel? Leveres programmet som kode eller image? Er arbeidsformen HTTP, en kontinuerlig prosess eller separate hendelser? Trengs direkte Kubernetes-API? Hvem kan vedlikeholde løsningen? Disse kravene avgjør hvilke kandidater som skal undersøkes. Flere compute-tjenester kan inngå i samme løsning.',
        'Azure Virtual Machines gir guest-kontroll og tilsvarende driftsansvar. App Service gir en administrert web-/API-flate med støttede runtimes eller custom container. App Service plan beskriver blant annet OS, region og compute-kapasitet; flere apper kan dele planens instanser. Appinnstillinger er appkonfigurasjon, ikke endring av planens eier eller bevis på kjørende kode. Egenskaper som skalering, isolasjon og tilgjengelighet varierer med tier og oppsett.',
        'Functions passer til funksjonskode aktivert av relevante hendelser på en egnet plan. ACI gir enkel containerkjøring uten full flåteorkestrering. Container Apps tilbyr administrerte containerapplikasjoner og jobber, revisjoner og konfigurerbar skalering uten å gi direkte kontroll over Kubernetes-API. En Container Apps Job utfører en avgrenset oppgave og avslutter kjøringen. Den kan utløses manuelt, etter en tidsplan eller av hendelser; en opprettet jobbdefinisjon er ikke i seg selv en utført jobb. AKS er relevant når Kubernetes-objekter og kontroll er et faktisk krav; Automatic og Standard har ulike operasjonelle vilkår. Ikke velg AKS bare fordi et program kan pakkes som container.',
        'Kunden beholder kode/image, data, tilgang, avhengigheter og korrekt konfigurasjon på tvers av tjenestene. Plattformvalg erstatter ikke test av gjenoppretting eller sikkerhet. Kostnadsdrivere kan omfatte instanser, plan/tier, allokert tid, lagring, lisens og trafikk. Bruk Cost Management-forutsetningene til å sammenligne, uten å finne på en pris fra et tjenestenavn. Et billigere compute-lag er ikke nødvendigvis en lavere total driftskostnad.',
        'Hosting Decision Studio viser krav, beslutning og teknisk begrunnelse hver for seg. En riktig tjeneste med feil begrunnelse er ikke en faglig forsvarlig løsning. Når to kandidater oppfyller alle oppgitte krav, kan begge par godkjennes. Undersøk alternativet ved å endre ett avgjørende krav, for eksempel fra HTTP-kode til containerpakke eller fra administrert ingress til Kubernetes-API-kontroll. Den uavhengige vurderingen bruker andre beslutningsstrukturer enn den guidede undersøkelsen.',
      ],
      terms: [
        [
          'Retained responsibility',
          'Operative og sikkerhetsmessige oppgaver kunden fortsatt eier.',
        ],
        ['App Service plan', 'Compute-/hostingkontekst for en eller flere apper.'],
        [
          'Orkestrering',
          'Samordnet livssyklus og plassering av flere instanser; mer enn image-lagring.',
        ],
      ],
      example:
        'En containerisert HTTP-API uten Kubernetes-API-krav kan ha flere gyldige administrerte kandidater. Dersom egne Kubernetes controllers blir et ufravikelig krav, må kandidatene vurderes på nytt. Navnet på organisasjonen er uvesentlig; det endrede kravet er selve årsaken.',
      limit:
        'Hosting Studio velger ingen tjeneste for studenten og oppretter ingen ressurs. Eksisterende VM og Web App kan åpnes i den faktiske Portal for eksplisitt inspeksjon; andre alternativer er konseptuelle.',
    },
    context: {
      title: 'Learn-tillegg: hva slags løsning bruker compute?',
      paragraphs: [
        'Den offisielle Learn-modulen har også kategori-orientering om AI, machine learning og IoT/Edge. Dette er relevant kontekst, men ikke fire ekstra eksamensmål i P05. Forhåndsbygde AI-tjenester kan gi språk-, tale- eller dokumentfunksjoner gjennom API-er. Azure Machine Learning støtter arbeid med egne modeller, eksperimenter og modellivssyklus. Slike løsninger trenger fortsatt et bevisst compute- og datadesign.',
        'IoT-løsninger handler om enheter, telemetri og kommunikasjon. IoT Hub er et eksempel på tjeneste for kommunikasjon med enheter, mens Edge flytter noe behandling nær datakilden. En agentisk applikasjon er et mønster som kombinerer modell, kontekst og verktøy med applikasjonslogikk; det er ikke en egen grunnleggende compute-type ved siden av VM/container/Functions. Ingen slike tjenester eller autonome agenter opprettes i AzureLab.',
        'Når et tillegg eller en video foreslår en bestemt tjeneste, må tilgjengelighet, livssyklus og tekniske forutsetninger fortsatt kontrolleres. Denne modulen gir en avgrenset orientering, ikke AI-/IoT-kompetansebevis, konto eller operativ simulering. Vi kopierer ingen Learn-vurderingsspørsmål.',
      ],
      terms: [
        ['AI-tjeneste', 'En tjeneste som tilbyr bestemte modell-/analysefunksjoner.'],
        ['Machine learning', 'Arbeid med data, trening, evaluering og modellivssyklus.'],
        ['Edge', 'Behandling nær enheten eller datakilden, med egne driftskrav.'],
      ],
      example:
        'Et dokumentmottak kan kombinere en HTTP-flate, hendelsesbehandling og en dokumentanalyse-API. Det gjør ikke API, compute og datalagring til samme komponent.',
      limit:
        'Ingen nye eksamensslots, AI-/IoT-ressursmotorer eller løfter om gjeldende produktkatalog følger av orienteringen.',
    },
  },
  causes: {
    vm: {
      prompt:
        'Hva dokumenterer kombinasjonen av den nye kvitteringen og de sju undersøkte referansene?',
      choices: [
        'De to diskene viser at indeksprogrammet har både arbeidslag og en verifisert gjenopprettingskopi.',
        'Bundle-kvitteringen dokumenterer Windows/standard/64GiB-konfigurasjonen; disk/NIC/subnet-kjeden viser lagring og nettverkstilknytning. Dette verifiserer ikke installert indeksprogram eller restore.',
        'Det gjenbrukte subnettet viser at Windows-guestens indeksendepunkt kan nås fra resten av VNet.',
      ],
      feedback: [
        'En separat datadisk er fortsatt konfigurasjon, ikke en utført backup eller restore. Riktig for en annen situasjon ville krevd en dokumentert kopi og gjenopprettingsprøve.',
        'Dette skiller faktisk accepted konfigurasjon og tekniske referanser fra guest- og applikasjonstilstand som simulatoren ikke kjører.',
        'Subnet-referansen viser tilknytningen. Tilgjengelig endepunkt krever blant annet kjørende program og passende sikkerhet/ruting, som ikke er observert her.',
      ],
    },
    container: {
      prompt:
        'Begge kjøringer hadde gyldig image/runtime. Hvorfor endret rapportresultatet seg ved recreate?',
      choices: [
        'Den andre kjøringen etablerte et annet runtime-grunnlag, slik at rapporten kunne bygges inn i imagepakken før instansbyttet.',
        'Den administrerte hostens delte kernel bevarte det gamle arbeidslaget og monterte det i B.',
        'A sitt skrivbare lag ble fjernet i begge recreate-forsøk. Bare det eksplisitt eksterne lageret hadde en datalivssyklus uavhengig av A og kunne beholde rapporten for B.',
      ],
      feedback: [
        'De lagrede forutsetningene viser samme gyldige kjøregrunnlag. Ingen ny image-bygging eller arkivering av runtime-filer skjedde.',
        'Kernel-isolasjon er et annet forhold enn rapportens lagringssted. Modellen konfigurerte ingen gjenbruk av A sitt arbeidslag.',
        'Forskjellen følger datalagringen, ikke image-navnet, hostens vedlikehold eller at en prosess kunne etableres.',
      ],
    },
    capacity: {
      prompt:
        'Hvordan forklarer du de tre lagrede kontrastene uten å forveksle skalering med feilseparasjon?',
      choices: [
        'VMSS-regelen tok over når den modellerte lokaliteten feilet, og erstattet de berørte instansene før resultatet ble beregnet.',
        'Set-eksemplet manglet deklarert soneseparasjon og delte øvelsens fysiske feilgrense. Zonal plassering beholdt andre instanser med tilstrekkelig rutet kapasitet/data. VMSS-regelen endret antall før feilen; den reparerte ikke en felles avhengighet.',
        'Fault domains i set-eksemplet representerte ulike Availability Zones; det var bare instansantallet som gjorde det svakere.',
      ],
      feedback: [
        'Regelen er eksplisitt beregnet før feilen og modellerer ingen erstatning eller failover etterpå. Se den lagrede hendelsen og antallet.',
        'Dette kobler hvert utfall til sin deklarerte årsak. Setets Azure-sone er ukjent; den felles lokaliteten er en pedagogisk feilforutsetning, ikke en Azure-plasseringsgaranti.',
        'FD, UD og Availability Zones er forskjellige grenser. Flere instanser i samme antatte feilgrense er ikke eksplisitt soneseparasjon.',
      ],
    },
    hosting: {
      prompt: 'Hvorfor endret kandidatsettet seg da det andre kontrollkravet ble innført?',
      choices: [
        'HTTP-image kunne passe administrert web-/containerhosting. Egne Kubernetes controllers krever Kubernetes-kontrollflaten i AKS. Imageformatet var ikke tilstrekkelig beslutningsgrunnlag; kunden beholder kode, data og tilgang i begge tilfeller.',
        'Et HTTP-image må oversettes til en VM-image når det flyttes til en tjeneste med flere instanser.',
        'Valget mellom App Service og AKS avgjøres her av hvilken region ressursgruppen bruker til metadata.',
      ],
      feedback: [
        'Dette følger den faktiske kravendringen i de to lagrede beslutningsparene. Endret API-/kontrollbehov, ikke et tjenestenavn, avgrenser alternativene.',
        'Ingen VM-image-konvertering ble krevd. Det nye kravet gjelder controllers og Kubernetes API, ikke bare flere instanser eller pakkeformat.',
        'Metadata-location er administrativ informasjon. Den gir ingen Kubernetes API/controller-egenskap; relevante region-/tjenestebegrensninger måtte vært et eget krav.',
      ],
    },
  },
} as const;

export const computeItemsNb = {
  cp01: {
    title: 'Vedlikeholdsvinduet i verkstedet',
    problem:
      'En signert Linux-modul i kernel må beholdes under feilsøking av et måleprogram. Teamet må kunne velge kernelversjon og starte guest-operativsystemet på nytt. Hvilken kjøreflate oppfyller kontrollkravet?',
    premises: [
      'Programmet kan pakkes på nytt, men driverkravet kan ikke fjernes.',
      'Teamet har ansvar og kompetanse til guest-vedlikehold.',
    ],
    decisions: [
      'Prosessisolert container på en administrert plattform.',
      'Azure Functions på en egnet hendelsesplan.',
      'Azure Virtual Machine med kontroll over guest-miljøet.',
    ],
    reasons: [
      'En separat guest-kernel kan velges og vedlikeholdes av teamet, mens fysisk host fortsatt administreres av leverandøren.',
      'Driverens user-space-klient kan pakkes i et image og kobles til en administrert host med plattformens eksisterende kernel.',
      'En Hyper-V-isolert Windows-container har egen kernel og kan derfor brukes som erstatning for det oppgitte Linux-guest-miljøet.',
    ],
    decisive:
      'Det avgjørende kravet er kontroll over guest-kernel, ikke bare pakking av programfiler.',
    feedback: [
      [
        'En prosessisolert container deler normalt host-kernel. Den kan passe dersom driver-/kernelkravet fjernes eller plattformen uttrykkelig støtter nødvendig isolasjon og kompatibilitet.',
        'Functions er relevant for funksjonskode og hendelser; valgt plan gir ikke generell guest-administrasjon. Et endret hendelsesprogram uten kernelkravet ville være en annen situasjon.',
        'VM gir det nødvendige guest-kontrollnivået. Kunden beholder oppdatering, driver, applikasjon, tilgang og data.',
      ],
      [
        'Dette oppfyller den nødvendige guest-kontrollen. Kunden må fortsatt vedlikeholde program, driver og guest.',
        'Klientbiblioteket erstatter ikke den signerte kernel-modulen eller retten til å velge og restarte gjestens kernel. Uten kernelkravet kunne en støttet administrert container passe.',
        'Hyper-V-isolasjon er et reelt moteksempel til delt kernel, men gir ikke den etterspurte Linux-guest-administrasjonen eller valgfri kernel som en VM. Kontroller OS-/isolasjonsstøtte separat.',
      ],
    ],
  },
  cp02: {
    title: 'Varslet etter hver avsluttede ordre',
    problem:
      'Et system sender en melding for hver ferdig ordre. En liten, omskrevet kodefunksjon validerer meldingen og lagrer et varig resultat. Trafikken kommer i ujevne puljer. Ingen OS- eller containerkrav gjelder. Teamet ønsker en hendelsesmodell med lite infrastrukturarbeid.',
    premises: [
      'Idempotens og feilbehandling planlegges i koden.',
      'Planvalg og eventuell varm kapasitet må vurderes separat.',
    ],
    decisions: [
      'Azure Functions med relevant meldingstrigger og valgt hostingplan.',
      'En VM-flåte med en kontinuerlig køleserprosess og konfigurerte skaleringsregler.',
      'En ordinær kontinuerlig App Service-webprosess med en egen pollingløkke.',
    ],
    reasons: [
      'En kontinuerlig webprosess kan holde kjøregrunnlaget varmt og redusere oppstartspåvirkning ved neste meldingspulje.',
      'Et fast antall VM-er gjør kapasitetsplanleggingen enkel, men teamet må beholde guest- og prosessvedlikehold.',
      'Meldingen kan aktivere kode gjennom en trigger; korrekt behandling, data, tilgang og planvalg forblir eksplisitte kundeoppgaver.',
    ],
    decisive:
      'Kravene tillater en funksjonsmodell, men gir ingen universell kostnads- eller oppstartsgaranti.',
    feedback: [
      [
        'Dette møter ønsket om en hendelsesmodell uten egen kontinuerlig pollingprosess. Planens oppstart, kapasitet og kostnad må fortsatt velges.',
        'Dette kan behandle meldinger, men tilfører guest-/køleserdrift som ikke etterspørres. Et særlig OS- eller prosesskontrollkrav kunne begrunnet det.',
        'App Service kan hoste kontinuerlig kode, men en egen pollingløkke svarer dårligere på ønsket funksjons-/triggerarbeidsmåte. Et kontinuerlig webbehov kunne endret valget.',
      ],
      [
        'Varm kapasitet kan være relevant ved et eksplisitt latencykrav. Det er ikke et slikt krav her, og begrunner ikke i seg selv mer kontinuerlig drift.',
        'Dette beskriver en forsvarlig VM-avveining, men ikke hvorfor den oppfyller ønsket om lite infrastruktur- og prosessarbeid.',
        'Dette beskriver både aktiveringsmekanismen og ansvaret. Det lover ikke nullkost, identisk cold start eller feilfri behandling.',
      ],
    ],
  },
  cp03: {
    title: 'Arkivet er intakt, men den nye arbeideren mangler',
    problem:
      'En revisjonsjobb har lagret ferdige resultater i en separat datatjeneste. Etter et planlagt instansbytte bekrefter arkivkontrollen at resultatene fortsatt finnes. Den nye containerarbeideren kommer ikke opp: miljøloggen sier at imagets Linux-format ikke støttes av den valgte Windows-baserte prosessisolerte hosten. Hva bør endres først?',
    premises: [
      'Ingen egen guest-administrasjon kreves. Godkjent image er uforandret, og et kompatibelt Linux-containeroppsett er tilgjengelig.',
      'Arkivtilgang og bevarte resultater er allerede kontrollert. Oppgaven gjelder nytt kjøregrunnlag, ikke gjenoppretting av tapt data.',
    ],
    decisions: [
      'Bygg samme applikasjon på nytt med flere user-space-biblioteker, men behold hostens OS-/isolasjonsoppsett.',
      'Velg det støttede kompatible Linux-containeroppsettet og kontroller at runtime kan etablere instansen.',
      'Kopier de bevarte resultatene fra datatjenesten inn i en ny imageversjon før samme host forsøkes igjen.',
    ],
    reasons: [
      'Bevarte data og gyldig pakke er ikke nok for kjøring; hostens kernel-/isolasjonskompatibilitet må også passe imaget.',
      'Instansens arbeidslag kan brukes til å omgå en forskjell mellom imagets og hostens OS-grunnlag.',
      'En ny imageversjon med resultatfiler vil også gi det eksisterende runtime-oppsettet den manglende kernel-kompatibiliteten.',
    ],
    decisive:
      'De konkrete observasjonene utelukker tapt rapport som hovedproblem. Feilen gjelder kompatibelt kjøregrunnlag.',
    feedback: [
      [
        'Ekstra biblioteker kan løse manglende user-space-avhengigheter, men ikke den oppgitte OS-/kernel-kompatibiliteten. Det ville vært relevant ved en annen feilrapport.',
        'Dette adresserer feilen uten å flytte eller late som arkivet er tapt. Ingen faktisk containerkjøring utføres i denne vurderingen.',
        'Resultatene finnes allerede varig. Å bygge dem inn i et nytt image løser ikke den deklarerte host-kompatibiliteten og blander to livssykluser.',
      ],
      [
        'Dette kobler valget til de to ulike observasjonene: bevart data og manglende kompatibel execution-plattform.',
        'Arbeidslaget er instansens filområde, ikke en annen OS-kernel. Det kan være nyttig for midlertidige filer etter at instansen kan etableres.',
        'Pakkeversjonering endrer innholdet, men innebærer ikke at en inkompatibel host får den riktige kernel-/isolasjonsmodellen.',
      ],
    ],
  },
  cp04: {
    title: 'Arbeiderflåten gjennom døgnets topper',
    problem:
      'En tjeneste har fire VM-baserte jobbarbeidere. Jobbene kan fordeles mellom dem, og data ligger i en egnet ekstern tjeneste. Teamet trenger sentral instansadministrasjon og endret antall etter konfigurerte målinger, uten å kreve én fast identisk instanstype.',
    premises: [
      'Koden og køhåndteringen støtter flere samtidige arbeidere.',
      'Teamet må fremdeles velge min/maks og en hensiktsmessig skaleringsprofil/regler.',
    ],
    decisions: [
      'Et availability set med de fire VM-ene.',
      'Virtual Machine Scale Sets med Flexible orchestration og relevant skalering.',
      'Én større VM med samme samlede vCPU som de fire.',
    ],
    reasons: [
      'Fault/update domains kan redusere samtidig påvirkning fra enkelte hostfeil og vedlikehold uten å endre flåtens instansantall.',
      'En større size kan gi mer kapasitet per guest og redusere antall operativsystemer som må vedlikeholdes.',
      'VMSS gir flåteadministrasjon; Flexible bruker standard VM-er, og konfigurerte min/maks/regler avgjør endring i antall.',
    ],
    decisive: 'Kravet er både flåteadministrasjon og instansantall etter konfigurerte signaler.',
    feedback: [
      [
        'Availability sets adresserer fault/update-placement, men har ikke dette autoscale-/flåteoppsettet. Stabilt antall med vedlikeholdsseparasjon ville vært et annet krav.',
        'Dette er en relevant kandidat. Flexible er ikke et løfte om automatisk korrekt appskalering, og begrensninger må fortsatt kontrolleres.',
        'En større enkeltinstans kan hjelpe et ikke-distribuerbart minnebehov, men oppfyller ikke kravet til administrert instansantall her.',
      ],
      [
        'Dette begrunner availability-set-plassering, men dekker ikke kravet om endret antall etter målinger. Det kunne vært nok for et fast flåtebehov.',
        'Dette er en vertikal skaleringsavveining, men erstatter ikke den beskrevne flåtens samtidige arbeidere og sentrale antallsstyring.',
        'Dette kobler Flexible og skaleringsoppsett uten å love at tjenestenavn alene gir riktig tilgjengelighet eller kapasitet.',
      ],
    ],
  },
  cp05: {
    title: 'To appkopier under et vedlikeholdsvindu',
    problem:
      'Et availability set har seks VM-er. Appkopiene ligger på VM1 (FD0/UD0) og VM6 (FD2/UD0). VM2 (FD1/UD1) har ledig kapasitet og samme programgrunnlag. En planlagt oppdatering berører UD0. Én appkopi er nok til det oppgitte behovet. Hvilket tiltak retter den observerte felles vedlikeholdspåvirkningen?',
    premises: [
      'Begge kopier har tilgang til fungerende data og trafikkruting. Ingen Azure-soneplassering er oppgitt.',
      'Oppgaven gjelder hvor appkopier legges på eksisterende VM-er, ikke at studenten kan velge en VM sin UD manuelt.',
    ],
    decisions: [
      'Behold appkopiene fordi de eksisterende FD-verdiene allerede er forskjellige.',
      'Øk kapasiteten på VM1 og VM6, men behold begge appkopier på de samme VM-ene.',
      'Legg den ene appkopien på den tilgjengelige VM2 og valider at én kopi tåler den deklarerte belastningen.',
    ],
    reasons: [
      'Ulike fault domains skiller visse fysiske hostfeil, så eksisterende FD-fordeling er hovedkriteriet også for dette planlagte vinduet.',
      'De to opprinnelige kopiene deler update domain. Den oppgitte VM2 gir en annen UD for appkopien uten å hevde soneredundans.',
      'Mer kapasitet per guest kan gi rom for høyere belastning og er derfor det mest direkte tiltaket mot samtidig planlagt vedlikehold.',
    ],
    decisive:
      'Den aktuelle hendelsen følger UD, mens de to opprinnelige kopiene bare var fordelt mellom FD.',
    feedback: [
      [
        'FD-fordelingen er verdifull ved visse hostfeil, men begge appkopier ligger fortsatt i UD0 under dette vinduet. Ved en ren FD0-feil ville situasjonen vært annerledes.',
        'Større size kan hjelpe ved kapasitetsmangel, men begge valgte guests berøres fortsatt av UD0-hendelsen.',
        'Dette endrer appens fordeling til en faktisk oppgitt annen UD. Tilgjengelige data, ruting og tilstrekkelig kapasitet er eksplisitte forutsetninger.',
      ],
      [
        'FD og UD beskriver ulike påvirkninger. FD-forskjellen utelukker ikke det oppgitte samtidige UD-vinduet.',
        'Dette begrunner tiltaket. Plattformen tilordner UD; oppgaven gjenbruker en allerede observert VM og lover ingen regional/sonebeskyttelse.',
        'Kapasitet og vedlikeholdsgrense er ulike mekanismer. Mer kapasitet på to berørte guests holder ikke en kopi utenfor UD0.',
      ],
    ],
  },
  cp06: {
    title: 'Én feed virker, den andre gjør ikke det',
    problem:
      'To pooled host pools bruker samme kompatible image, men har hver sin RemoteApp application group: Regnskap og Innkjøp. Begge har fungerende session hosts. Regnskap er registrert i arbeidsflaten Kontor; Innkjøp er registrert i Pilot. Kari er tilordnet Innkjøp og bruker bare Kontor-feeden. Kollegene med Regnskap ser sin app der. Hvilken endring passer dersom Innkjøp skal leveres via den eksisterende Kontor-feeden?',
    premises: [
      'Karis tilordning og installert Innkjøp-program er kontrollert. Hun skal ikke få Regnskap-tilgang eller en ny host pool. Gruppene og workspace har kompatibelt deployment-scope/location.',
      'Organisasjonen tillater at Innkjøp-gruppen registreres i Kontor i stedet for Pilot. Dette er et gitt objektscenario, ikke innlogging eller en målt AVD-sesjon.',
    ],
    decisions: [
      'Registrer Innkjøp application group i Kontor-workspace og behold dens målrettede brukertilordning.',
      'Tilordne Kari til Regnskap application group fordi den har den fungerende Kontor-feeden.',
      'Legg til en session host i Innkjøp sin eksisterende pool uten å endre gruppens registrering.',
    ],
    reasons: [
      'Samme image i begge host pools gir en felles publiseringsgrense som gjør den fungerende appgruppen til feed for den andre.',
      'Flere session hosts er det relevante tiltaket når en allerede tilordnet app ikke finnes i den brukte feeden.',
      'Application groups har egne registrerings- og tilordningsrelasjoner; samme image i to host pools erstatter ikke gruppens workspace-registrering.',
    ],
    decisive:
      'Fungerende hosts og likt image er ikke den manglende publiseringsrelasjonen. Hver application group må være registrert i riktig workspace og ha korrekt tilordning.',
    feedback: [
      [
        'Dette adresserer forskjellen i de oppgitte objektrelasjonene uten å utvide Karis tilgang. En annen ønsket feed ville gitt et annet registreringsvalg.',
        'Dette utvider til feil appgruppe og løser ikke Innkjøp-publiseringen. Det kunne vært relevant bare dersom Kari faktisk skulle bruke Regnskap.',
        'Hosts er allerede tilgjengelige. Flere kunne løst deklarert kapasitetsmangel, men endrer ikke hvilken gruppe som publiseres i Kontor.',
      ],
      [
        'Et image bestemmer programgrunnlaget. Det deler ikke appgruppers registrering eller brukertilgang mellom host pools.',
        'Kapasitet kunne påvirket oppstart av en synlig app, men de oppgitte funnene gjelder hvilken feed gruppen er registrert i.',
        'Dette forklarer hvorfor riktig gruppe og riktig workspace må kobles, uten å love reell sesjon eller autentisering.',
      ],
    ],
  },
  cp07: {
    title: 'Spesialisten og skiftarbeiderne',
    problem:
      'En konstruktør trenger et fast personlig Windows-skrivebord med egne tilpasninger. Et annet team trenger et standardisert RemoteApp-verktøy for skiftarbeid. Hvilken plan skiller behovene riktig?',
    premises: [
      'Konstruktøren krever en fast tilordnet session host; en flyttbar brukerprofil på en tilfeldig vert er ikke tilstrekkelig.',
      'Skiftteamet trenger bare appvinduet og skal dele et standardisert host-grunnlag. Tilgang, profiler og apper må konfigureres separat.',
    ],
    decisions: [
      'Bruk pooled full desktop for begge grupper og la brukerprofiler håndtere konstruktørens tilpasninger.',
      'Bruk personal/full desktop for konstruktørens faste tildeling og pooled/RemoteApp for skiftteamets standardverktøy.',
      'Bruk personal/full desktop for alle, med en dedikert session host per skiftbruker.',
    ],
    reasons: [
      'Fast personlig host-tilordning, publisering av en app og antall samtidige sesjoner er forskjellige designvalg som må samsvare med hver gruppes krav.',
      'Et standardisert image og brukerprofiler gir samme faste vertstilknytning som en personal host pool.',
      'Dedikerte hosts holder brukermiljøene adskilt og gir forutsigbar vertstilknytning for en brukerspesifikk applikasjon.',
    ],
    decisive:
      'De to kravene gjelder forskjellige bruker- og publiseringsmodeller, ikke bare antall VM-er.',
    feedback: [
      [
        'Pooled/profiler kan passe et standardisert fleksibelt desktopbehov, men gir ikke konstruktørens krevde faste vertstilknytning og leverer mer enn skiftteamets appbehov.',
        'Dette møter de to ulike tildelings-/publiseringskravene. Pooled og multi-session er ikke synonymer; OS og profiler må fortsatt velges.',
        'Dette kunne passe dersom alle trengte dedikerte desktopmiljøer, men bryter skiftteamets oppgitte delings- og appkrav.',
      ],
      [
        'Dette begrunner inndelingen uten å slutte fra antall brukere til én universell AVD-modell.',
        'Profiler kan bevare brukerdata/innstillinger, men er ikke en garanti om en fast session host. Det eksplisitte kravet er derfor fortsatt ubesvart.',
        'Dedikerte hosts er et gyldig alternativ ved andre krav; begrunnelsen må også ta hensyn til den avtalte leveranseformen og delingen her.',
      ],
    ],
  },
  cp08: {
    title: 'Importjobben stopper før neste del er ferdig',
    problem:
      'En syntetisk undersøkelse av en VM viser en arbeidsmengde som trenger10GiB samtidig arbeidsminne. Valgt profil har8GiB RAM. Diskvolumene har80GiB ledig plass, og feilen er at prosessen ikke kan allokere mer minne. Hva er det mest relevante neste planleggingstiltaket?',
    premises: [
      'Programmet kan undersøkes for mindre samtidighet; diskplass og lagringsytelse er ikke den oppgitte flaskehalsen.',
      'Tallene er scenarioforutsetninger, ikke målt Azure-ytelse, priser eller en anbefaling av en virkelig SKU.',
    ],
    decisions: [
      'Utvid datadisken og behold programmet, samtidigheten og VM-profilen uendret.',
      'Velg et nyere OS-image og behold programmet, samtidigheten og VM-profilen uendret.',
      'Vurder lavere minnebehov/samtidighet eller en profil med nok RAM, og valider arbeidslasten etter endringen.',
    ],
    reasons: [
      'Et nyere OS-image kan inneholde minnehåndteringsrettelser, så imageoppdatering er det mest målrettede tiltaket mot den observerte feilen.',
      'Prosessens arbeidsminnebehov må sammenholdes med RAM; ledig diskplass og imagevalg er andre dimensjoner.',
      'Mer varig lagringsplass gir rom for flere importfiler og bør prioriteres før man undersøker den oppgitte allokeringsfeilen.',
    ],
    decisive:
      'Den observerte flaskehalsen er RAM. Velg tiltak for den relevante ressursen og valider programmet etterpå.',
    feedback: [
      [
        'Dette kan hjelpe ved fulle lagringsvolumer, men adresserer ikke den oppgitte10/8GiB-allokeringen når resten beholdes.',
        'Et nytt image kan løse dokumenterte OS-/kompatibilitetsfeil. Ingen slik årsak er oppgitt, og samme RAM/samtidighet gjenstår.',
        'Dette undersøker både programmet og riktig ressursdimensjon. Endringen må etterprøves; mer RAM beviser ikke at alle andre problemer er løst.',
      ],
      [
        'Softwarefeil kan forekomme, men uten et slikt funn er dette en annen hypotese enn den oppgitte minneallokeringen.',
        'Dette kobler den observerte begrensningen til et relevant tiltak uten å blande RAM, image og disk.',
        'Lagringsplanlegging er nyttig når volumet er begrensningen. Her er ledig plass allerede oppgitt og prosessen mangler arbeidsminne.',
      ],
    ],
  },
  cp09: {
    title: 'Gjenbruk av nettverk i en ny VM-bestilling',
    problem:
      'En bestilling må plassere VM-en i region B. Den refererer til en eksisterende NIC i region A. Teamet kan opprette nytt nettverksgrunnlag i B, men skal ikke flytte den gamle løsningen i A. Hvilket referansevalg bør undersøkes for den nye bestillingen?',
    premises: [
      'Begge miljøene har samme subscription. Valg av region B er et fast krav for denne arbeidslasten.',
      'Ingen offentlig IP, trafikkmåling eller programhelse er et premiss. AzureLabs smalere samme-gruppe-regel er en egen lokal støtteregel.',
    ],
    decisions: [
      'Bruk et egnet NIC/VNet/subnet-grunnlag i region B og kontroller de faktiske referansene og subscription.',
      'Flytt den eksisterende NIC-en til en Resource group med metadata-location B og behold referansen i bestillingen.',
      'Bruk region A og den eksisterende NIC-en som nettverksgrunnlag for VM-bestillingen.',
    ],
    reasons: [
      'Resource group-metadata er den relevante plasseringen for tilknyttede nettverksressurser, slik at administrativ regrouping er tilstrekkelig.',
      'Samme subscription og den eksisterende NIC-referansen gir et ferdig nettverksgrunnlag for den nye VM-bestillingen.',
      'VM/NIC har dokumenterte regionale og abonnementsrelasjoner; felles management-kontekst opphever ikke det faste plasseringskravet.',
    ],
    decisive:
      'NIC/VM har konkrete regionale og abonnementsrelasjoner. Navn og group metadata flytter ikke ressurser.',
    feedback: [
      [
        'Dette følger VM-kravet og undersøker hele den relevante kjeden. Det er konfigurasjon, ikke en bekreftet nettverksforbindelse.',
        'Administrativ flytting av gruppetilhørighet/metadata flytter ikke NIC-ens region. Ved bare en organisasjonsendring kunne regrouping vært relevant.',
        'Dette kunne vært teknisk relevant dersom region A var tillatt, men bryter det eksplisitte B-kravet i oppgaven.',
      ],
      [
        'Metadata-location beskriver gruppemetadata og endrer ikke ressursenes fysiske location.',
        'Gjenbruk kan være nyttig, men ikke når de konkrete VM/NIC-relasjonene eller arbeidslastens krav brytes.',
        'Dette begrunner valget med både tekniske relasjoner og det faste kravet, uten å hevde at konfigurasjonen beviser trafikk.',
      ],
    ],
  },
  cp10: {
    title: 'To komponenter, ett containerformat',
    problem:
      'En løsning har et HTTP-grensesnitt og en separat komponent som leverer egne Kubernetes controllers. HTTP-teamet har allerede en egnet App Service-containerplattform og har ikke ansvar for Kubernetes-objekter. Plattformteamet har en godkjent AKS-flate og ansvar for controller-komponenten. Begge komponenter leveres som images. Må containerformatet føre til én felles hostingplattform?',
    premises: [
      'Organisasjonen tillater separate plattformer og har avtalt grensesnitt mellom komponentene.',
      'HTTP-komponenten krever ikke Kubernetes API. Controller-komponenten kan ikke omskrives til en vanlig webprosess.',
    ],
    decisions: [
      'Flytt begge komponentene til HTTP-teamets App Service-plattform for å samle imageleveransen.',
      'Behold HTTP-komponenten på egnet App Service og controller-komponenten på AKS med hver sin ansvarlige eier.',
      'Flytt begge komponentene til AKS og legg Kubernetes-konfigurasjonen for HTTP-komponenten til HTTP-teamet.',
    ],
    reasons: [
      'Krav til kontrollflate og driftsansvar må vurderes per komponent; et felles imageformat krever ikke felles orkestreringsplattform.',
      'Samme distribusjonsformat gjør webhosting og controller-kjøring utbyttbare for de oppgitte komponentene.',
      'En felles Kubernetes-plattform samler rollout og nettverksmekanismer, slik at imageleveransen kan håndteres gjennom én samlet driftsmodell.',
    ],
    decisive:
      'Pakkeformat, kontrollflate og eierskap er separate forhold; det nye problemet gjelder komponentinndeling, ikke bare et enkelt tjenestenavn.',
    feedback: [
      [
        'Dette samler pakkeformat, men App Service gir ikke den oppgitte controller-kontrollflaten. Ved to vanlige webkomponenter kunne samling vært riktig.',
        'Dette møter de tekniske og organisatoriske kravene. Kommunikasjon, tilgang og data må fortsatt designes eksplisitt; bildet er ingen reell driftstest.',
        'Begge kunne teknisk hostes i Kubernetes, men dette forslaget bryter den faste ansvarsgrensen for HTTP-teamet. En ny plattformavtale kunne gjort det forsvarlig.',
      ],
      [
        'Dette begrunner inndelingen med de oppgitte kravene fremfor å anta at alle images trenger samme tjeneste.',
        'Image er en leveransepakke; det gir ikke enhver hostingplattform alle nødvendige API-er og kontrollmuligheter.',
        'Felles plattform er en reell avveining, men kan ikke uten videre erstatte den eksplisitte driftsavtalen i dette scenarioet.',
      ],
    ],
  },
  cp11: {
    title: 'Gjenbruk innenfor den godkjente hostinggrensen',
    problem:
      'Et nytt HTTP-image skal inn i en eksisterende godkjent App Service plan. Linux-/image-/region-/planstøtte og ledig kapasitet er kontrollert. Mandatet krever gjenbruk av denne planen; ny containerplattform eller guest-VM er ikke autorisert. Hvilket valg og hvilken begrunnelse følger det nye mandatet?',
    premises: [
      'Arbeidslasten trenger ingen Kubernetes API eller guest-OS-administrasjon.',
      'Denne vurderingen gjelder både teknisk egnethet og den eksplisitte driftsgrensen; et nytt miljø kan ikke forutsettes godkjent.',
    ],
    decisions: [
      'App Service med støttet custom container på den eksisterende planen.',
      'En ny VM som containerhost under det samme subscription.',
      'Azure Container Apps i et nytt administrert miljø.',
    ],
    reasons: [
      'Samme subscription er tilstrekkelig gjenbruk av administrativt scope, selv om en annen hostingressurs må opprettes.',
      'Den valgte plattformen støtter det kontrollerte imageoppsettet og lar appen knyttes til den konkrete eksisterende planen.',
      'Et nytt administrert containermiljø kan samle apprevisjoner og ingress, mens applikasjonen fortsatt leveres som image.',
    ],
    decisive:
      'Et generelt gyldig hostingalternativ er ikke tilstrekkelig når et konkret kompatibelt hostingobjekt og en operasjonell grense er bindende.',
    feedback: [
      [
        'Dette møter både teknisk støtte og det spesifikke gjenbrukskravet. Kapasitet, tilgang og appinnhold må fortsatt vedlikeholdes.',
        'VM kan kjøre containere, men gjenbruker ikke App Service-planen og introduserer guest-ansvar uten mandat. OS-kontroll og ny autorisasjon kunne endret valget.',
        'Dette kunne vært forsvarlig uten gjenbrukskravet og med godkjent nytt miljø. Det er ingen påstand om at Container Apps er generelt svakere.',
      ],
      [
        'Subscription er management-kontekst, ikke den konkrete hostingrelasjonen til en App Service plan.',
        'Dette begrunner riktig ressursrelasjon for valgt løsning og det kontrollerte kravet.',
        'Dette beskriver et reelt teknisk alternativ, men etablerer ikke relasjonen til den eksisterende App Service-planen som skal gjenbrukes. Uten dette mandatet kunne egenskapen begrunnet et annet valg.',
      ],
    ],
  },
  cp12: {
    title: 'Den avgrensede eksportjobben',
    problem:
      'Et team vil starte en containerisert eksport ved behov, skrive resultatet til et eksternt lager og avslutte kjøringen. De trenger ikke HTTP-ingress eller Kubernetes-API og har ikke kapasitet til å administrere en Kubernetes-plattform. Både en avgrenset containergruppe og en administrert jobb er tillatt. Velg en forsvarlig kandidat med en begrunnelse som passer akkurat den kandidaten.',
    premises: [
      'Teamet leverer et egnet image og kjenner ressurskravene.',
      'Tilgang og varig resultatlagring må fortsatt konfigureres.',
    ],
    decisions: [
      'Azure Container Apps Job med manuell utløsing.',
      'Etabler en egen AKS Standard-plattform for eksporten.',
      'Azure Container Instances.',
    ],
    reasons: [
      'En enkel containergruppe kan starte den avgrensede oppgaven og avsluttes med egnet restart policy; kunden må håndtere resultatlagring, tilgang og nødvendig oppfølging.',
      'Kubernetes Jobs beskriver fullføring og retry-policy gjennom deklarative objekter, og kan styre avslutning av batchkjøringen.',
      'En gjenbrukbar jobbdefinisjon kan starte en separat execution manuelt; execution avsluttes etter arbeidet, uten å bygge en egen Kubernetes-driftsflate.',
    ],
    decisive:
      'Det finnes et begrenset containerkjørebehov uten de ekstra kontroll-/skaleringskravene som kan begrunne større plattformer.',
    feedback: [
      [
        'Container Apps Job er et forsvarlig alternativ: en manuell jobb kjører en avgrenset oppgave. Image, tilgang, ressursgrenser og ekstern lagring må fortsatt konfigureres.',
        'AKS kan kjøre batcharbeid, men en egen Standard-plattform tilfører Kubernetes-ansvar uten et slikt krav og bryter den oppgitte driftsgrensen. Ved behov for egne Kubernetes-objekter og kompetanse til å drifte dem kunne dette vært relevant.',
        'ACI er en relevant kandidat for denne enkle gruppen. Det er ikke et løfte om alle egenskaper i en orkestrert applikasjonsplattform.',
      ],
      [
        'Dette beskriver det avgrensede ACI-valget, med eksplisitte ansvar. Det er ikke en påstand om samme objekt-/execution-modell som Container Apps Jobs.',
        'Kubernetes kan kjøre batchjobber, men dette begrunner en større driftsflate som bryter den oppgitte kapasiteten/autorisasjonen. Ved behov for egne Kubernetes-objekter og et ansvarlig plattformteam kunne det passe.',
        'Dette beskriver spesifikt ACA Job-konfigurasjon og dens separate execution. ACI kan også kjøre til avslutning, men det gir ikke den samme gjenbrukbare Job-objektmodellen.',
      ],
    ],
  },
  cp13: {
    title: 'Frisk kapasitet som ikke får arbeid',
    problem:
      'Et deklarert konseptscenario har tre friske app-VM-er fordelt over to soner. Hver kan håndtere10 arbeidsenheter per intervall. Etterspørselen er25. Data er tilgjengelig for alle, men den oppgitte rutingen sender alt arbeid til VM1; VM2 og VM3 mottar ingenting. Hvilket tiltak adresserer den dokumenterte begrensningen først?',
    premises: [
      'Applikasjonen kan fordele uavhengig arbeid mellom de tre. Ingen ny feil eller annen kapasitetsbegrensning er oppgitt.',
      'Tall og routing er eksplisitte modellforutsetninger, ikke Azure-trafikk, lastbalansering eller målt helse.',
    ],
    decisions: [
      'Endre den deklarerte rutingen til å fordele arbeidet over de tre eksisterende instansene, og undersøk deretter resultatet.',
      'Legg til en fjerde instans, men behold rutingen bare til VM1.',
      'Flytt VM2 og VM3 til VM1 sin sone, men behold samme ruting.',
    ],
    reasons: [
      'Samlet instanskapasitet over etterspørselen er tilstrekkelig grunnlag for levering i intervallet; flere instanser øker dette tilbudet.',
      'De30 deklarerte enhetene er bare leverbare dersom friske instanser faktisk får arbeid; her er den brukte stien begrenset til10.',
      'Samlokalisering i én sone kan redusere kommunikasjonsoverhead og er derfor det mest aktuelle kapasitetstiltaket her.',
    ],
    decisive:
      'Arbeidsfordelingen, ikke total frisk compute eller datatilgang, er den gitte begrensningen.',
    feedback: [
      [
        'Dette bruker kapasiteten som allerede finnes. Med balansert arbeid er30 større enn25 i den oppgitte modellen; det er ingen virkelig Azure-garanti.',
        'Dette kunne hjelpe hvis alle aktuelle instanser fikk arbeid og total kapasitet var for liten. Med bare VM1-ruting forblir leverbar modellkapasitet10.',
        'Dette endrer feilseparasjon uten å endre den oppgitte arbeidsfordelingen. Et eget latencykrav kunne gjort geografi relevant, men er ikke gitt.',
      ],
      [
        'Instansantallet er relevant, men overser den konkrete ruteobservasjonen. Kapasitet må kunne brukes før flere instanser er riktig forklaring.',
        'Dette knytter den strukturerte beregningen til rutingen og skiller tilbudt fra leverbar kapasitet.',
        'Ingen slik sone-/latencybegrensning er modellert. Samlokalisering kan dessuten redusere fysisk feilseparasjon.',
      ],
    ],
  },
  cp14: {
    title: 'To bestillinger, én eksisterende ressurs',
    problem:
      'Activity log viser accepted kommando A som opprettet vm-old med disk-old og nic-old. Senere kommando B for vm-new blir rejected, med tom addedIds og uendret world revision. Inventory inneholder bare vm-old-kjeden. Hvilken overlevering stemmer med disse samlede observasjonene?',
    premises: [
      'A og B gjelder samme Resource group, men forskjellige kommando-ID-er og VM-ID-er. Ingen ny kommando er akseptert etter B.',
      'Dette er AzureLabs deterministiske lokale kvitteringer, ikke asynkron Azure-deployment, guest-boot eller en driftstest.',
    ],
    decisions: [
      'Beskriv vm-new som under oppstart fordi en tidligere VM-bestilling i samme gruppe var accepted.',
      'Knytt den eksisterende kjeden til A, og rapporter at B ikke opprettet vm-new eller nye delressurser.',
      'Knytt disk-old og nic-old til B ved overlevering fordi de dekker de samme ressursrollene som B bestilte.',
    ],
    reasons: [
      'Gruppens siste bestillingshensikt er et tilstrekkelig subjekt for eldre kvitteringer når ressurstypene samsvarer.',
      'Ressursrollene kan gjenbrukes som bevis for en ny bestilling selv uten accepted referanser fra den bestillingen.',
      'Evidence må knyttes til kommando, utfall, ressurs-ID-er og startgrense; tidligere aksept dokumenterer ikke et senere avvist nybygg.',
    ],
    decisive:
      'Den nye slutningen krever korrekt provenance og avslag uten delvis opprettelse, ikke bare gjenkjenning av ordet receipt.',
    feedback: [
      [
        'Det finnes ingen slik pending/boot-tilstand i de oppgitte observasjonene. En senere faktisk accepted opprettelse kunne gitt nytt konfigurasjonsbevis.',
        'Dette samsvarer med begge kvitteringer og inventory. Det sier fremdeles ingenting om at programmet på vm-old kjører eller er sikkert.',
        'Eksisterende ressurser kan inspiseres som gamle ressurser, men kan ikke ommerkes som resultat av B. Faktisk støttet gjenbruk må fremgå av en gyldig kommando/referanse.',
      ],
      [
        'Felles gruppe er administrativ sammenheng, ikke bevis på at to kommandoer har samme subjekt eller resultat.',
        'Teknisk rolle er ikke identitet. Uten riktige referanser og accepted utfall skaper dette falsk nybygg-evidence.',
        'Dette begrunner den korrekte overleveringen og bevarer forskjellen mellom historisk konfigurasjon, avvist nytt arbeid og faktisk drift.',
      ],
    ],
  },
} as const;

export const networkingNb = {
  perspectives: [
    'Network Structure · faktisk Sandbox',
    'Address Design · konsept',
    'Peering Topology · konsept',
    'DNS & Connectivity · konsept',
  ],
  perspective: 'Velg perspektiv i Network Path Explorer',
  partA: 'Part A · VNet, Subnets, Peering & DNS',
  recallGuided: 'Gjenoppta lagret nettverksoppdrag',
  summaryBoundary:
    'Dette er Part A-resultater. VPN Gateway, ExpressRoute og public/private endpoints har egne resultater i Part B. En åpnet aktivitet eller et guidet resultat gir ingen ny uavhengig innlevering, hel Networking-fullføring eller eksamensberedskap.',
  pauseGuided: computeNb.pauseGuided,
  milestoneNotice: computeNb.milestoneNotice,
  labels: {
    ...computeNb.labels,
    model: 'Pedagogisk IPv4-/topologi-/DNS-modell · ingen pakker eller eksterne oppslag',
    return: 'Tilbake til Networking-oppdraget',
    predictionOptions: [
      'Velg prediksjon',
      'Ingen gyldig plan / intet navnesvar eller direkte grunnlag',
      'Delvis grunnlag; vei eller tilgang mangler',
      'Alle deklarerte modellkrav dekkes',
    ],
  },
  storage: {
    ...computeNb.storage,
    text: 'Forklaringer og faglige resultater holdes tilbake når lagringen er usikker. Ditt sist leste oppgaveutkast kan undersøkes uten endringer; last inn gjeldende registrering før videre arbeid. Svar fra ulike faner flettes aldri.',
    ownDraft: 'Sist leste oppgaveutkast · endring og innlevering sperret til trygg reload',
    loading: 'Laster versjonert Networking-arbeid …',
    title: 'Networking-lagring må avklares',
    reload: 'Last inn Networking på nytt',
    recover: 'Gjenopprett bare ugyldige Networking-data',
  },
  guided: { ...computeNb.guided },
  assessment: {
    ...computeNb.assessment,
    title: 'Selvstendig Networking-anvendelse',
    intro:
      'Undersøk nye nettverkskrav. Velg både beslutning og den tekniske begrunnelsen. Tidligere guidet arbeid gir ingen ny selvstendig vurderingskreditt.',
  },
  assessmentActive:
    'Et annet Networking-forsøk er aktivt. Fortsett det låste scenarioet før du velger et nytt.',
  currentFeedback: computeNb.currentFeedback,
  historyFeedback: computeNb.historyFeedback,
  missions: {
    inspect: {
      title: 'A · Investigate a Real AzureLab Network',
      situation:
        'Driftsteamet skal overta en eksisterende VM. Finn dens faktiske nettverksmedlemskap og skill dette fra administrativ organisering. Hvis miljøet er tomt, bygg en støttet bundle gjennom vanlig Portal først.',
      goal: 'NW01: følg VM → NIC → subnet → VNet og gruppens subscription uten å oppfinne IP-allokering eller trafikk.',
      steps: [
        'Start inspeksjonsforsøket eksplisitt.',
        'Velg en faktisk VM, eller opprett Resource group og VM med nytt nettverk i Portal.',
        'Undersøk VM, NIC, subnet, VNet, Resource group, subscription og kildens accepted receipt.',
        'Sammenlign medlemskap og faktiske prefixer.',
        'Returner og begrunn hva dette ikke dokumenterer.',
      ],
      why: 'En kvittering dokumenterer en konfigurasjon, ikke at en nettverkspakke eller et program virker.',
      where:
        'Faktisk Portal → Virtual machines → ressurs → relaterte ressurser. Inspeksjonspanelet viser hver eksakte referanse.',
      observe:
        'Sju eksplisitte inspeksjoner i samme tekniske forsøk. Eldre ressurser merkes gjenbrukt inspeksjon, aldri ny opprettelse.',
      debrief:
        'NIC-referansen knytter VM til subnet og VNet. Resource group og subscription er administrative scopes. Prefixene er faktiske; NIC-IP, DNS, routing og apphelse er ukjent.',
    },
    address: {
      title: 'B · Design a Valid Address Space',
      situation:
        'Nordverk trenger to separate subnet med minst 40 ordinært tilgjengelige IPv4-adresser hver innenfor 10.84.0.0/16. Første utkast overlapper.',
      goal: 'NW02: beregn containment, overlap og kapasitet med fem ordinært reserverte Azure-adresser.',
      steps: [
        'Undersøk første utkast og forutsi utfallet.',
        'Kjør det overlappende designet og les de beregnede intervallene.',
        'Rett data-subnettet slik at begge ligger innenfor VNet uten overlap og med nok adresser.',
        'Forutsi og kjør den rettede planen.',
        'Forklar hvorfor flere IP-adresser alene ikke løser overlap.',
      ],
      why: 'Et gyldig prefix må både ligge riktig og gi et entydig adresseområde.',
      where:
        'Address Design: VNet-prefix, App-subnet, Data-subnet og antall nødvendige adresser står over adressebåndet.',
      observe:
        'Et lagret ugyldig overlap og deretter et gyldig design med to tilstrekkelige subnet. Ingen VNet-kommando sendes.',
      debrief:
        'Containment, overlap og kapasitet er separate kontroller. De fem reserverte adressene gjelder det ordinære IPv4-subnettet i denne øvelsen, ikke alle tjenesters ekstra behov.',
    },
    peering: {
      title: 'C · Diagnose a Peering Problem',
      situation:
        'Utvikling A og analyse C har hver sin Connected-peering til plattform B. Teamet forventer at dette automatisk gir A en direkte vei til C.',
      goal: 'NW03: skille tosidig peering, ikke-overlappende adresser og direkte topologi fra transitivitet.',
      steps: [
        'Behold A↔B og B↔C, velg C som mål og forutsi resultatet.',
        'Kjør og undersøk hvorfor A↔C mangler.',
        'Konfigurer begge konseptuelle A/C-sider med deklarert vei og tillatelse; kjør på nytt.',
        'Bytt B til overlappende adresseområde og undersøk avvisningen for A/B.',
        'Forklar hvilke andre forutsetninger peering ikke løser.',
      ],
      why: 'Standardpeering er en eksplisitt relasjon mellom to VNet, ikke en automatisk transitiv nettverksruter.',
      where:
        'Peering Topology: seks navngitte sider, målnettverk og adresse-/scope-forutsetninger.',
      observe:
        'Lagret ikke-transitivt moteksempel, eksplisitt direkte vei og et overlap-avslag. Ingen ekte peering eller kvittering opprettes.',
      debrief:
        'Begge sider og riktig adresse-/subnet-omfang er nødvendig. DNS, ruting og applikasjonstilgang må fortsatt undersøkes særskilt.',
    },
    dns: {
      title: 'D · Resolve the Name, Then Diagnose the Path',
      situation:
        'En klient i A bruker archive.training.example for en intern tjeneste i B. Den private zonen har en A-record, men klientens VNet mangler link. Senere mangler dokumentert nettverksvei.',
      goal: 'NW04: skille zone-synlighet, record, adresse, logisk vei og deklarert tilgang.',
      steps: [
        'Bruk Private DNS og Azure-provided resolver uten link; forutsi og kjør.',
        'Legg til den konseptuelle resolution-linken og kjør med riktig record.',
        'Ta bort peering eller sett vei til ukjent; behold DNS-linken og kjør.',
        'Sammenlign et navnesvar med en udokumentert nettverksvei.',
        'Forklar hvorfor DNS-endringer ikke reparerer en manglende vei.',
      ],
      why: 'Navn blir til adresser før applikasjonen forsøker å bruke nettverket.',
      where:
        'DNS & Connectivity: zone, record og resolver står før separat topologi, vei og tillatelse.',
      observe:
        'Lagret mislykket oppslag og deretter korrekt adresse mens vei fortsatt ikke er dokumentert. Ingen faktisk DNS-query utføres.',
      debrief:
        'Private DNS-linker gir navneoppløsning under riktige resolverforutsetninger. De gir ingen peering, ruting eller applikasjonsautorisasjon.',
    },
  },
  causal: {
    inspect: [
      'Gruppen beviser at alle ressurser har samme nettverksvei.',
      'Referansene dokumenterer nettverkstilknytning og management-scope, men ingen NIC-IP, DNS eller trafikk.',
      'Accepted receipt betyr at applikasjonen har svart.',
    ],
    address: [
      'Containment og fravær av overlap må kontrolleres separat fra tilgjengelig adressekapasitet.',
      'En større VM gjør overlappende subnet gyldige.',
      'Alle adresser i CIDR-blokken kan alltid tildeles VM-er.',
    ],
    peering: [
      'DNS-records oppretter automatisk manglende A/C-peering.',
      'En Connected-side gir alltid begge retninger.',
      'Standardpeering er ikke transitiv; direkte tosidig relasjon og passende ikke-overlappende områder må finnes.',
    ],
    dns: [
      'Riktig DNS-svar garanterer en fungerende applikasjon.',
      'Zone-synlighet og record kan gi riktig adresse selv om topologi, vei eller tilgang fortsatt mangler.',
      'En Private DNS-link erstatter subnet og NIC.',
    ],
  },
  model: {
    address: 'Address Design · ordinære private IPv4-eksempler',
    bitTitle: 'IPv4 ·32 bitposisjoner',
    hostBits: 'Hostbiter i App-subnet',
    bitExplain:
      'De 32 posisjonene viser først VNet-prefixet, deretter eventuelle ekstra nettverksbiter i App-subnettet og til slutt dets hostbiter. Dette er bitroller, ikke de binære adresseverdiene. Intervalltabellen viser de eksakte adressene og begge subnettene.',
    peering: 'Peering Topology · standard VNet-peering',
    dns: 'DNS & Connectivity · deklarerte forutsetninger',
    vnet: 'VNet CIDR',
    app: 'App-subnet CIDR',
    data: 'Data-subnet CIDR',
    required: 'Nødvendige ordinært tilgjengelige adresser per subnet',
    syntax: 'Kanoniske IPv4-prefixer',
    privateRanges: 'Innenfor modellens private eksempelområder',
    contained: 'Begge subnet innenfor VNet',
    overlap: 'Overlappende subnet',
    subnetSize: 'Subnet minst /29',
    capacity: 'Nok ordinært tilgjengelige adresser',
    yes: 'Ja',
    no: 'Nei',
    unknown: 'Ukjent / ikke dokumentert',
    total: 'Totalt',
    available: 'Ordinært tilgjengelig',
    interval: 'Adresseintervall',
    reservation:
      'Første fire og siste adresse er reservert i ordinære Azure IPv4-subnet. /24 gir 256 totalt og 251 ordinært tilgjengelige. Ingen ekstra tjenestespesifikke allokeringer modelleres.',
    invalid: 'Planen oppfyller ikke alle deklarerte adressekrav. Se hver beregnet kontroll.',
    valid: 'Adresseplanen oppfyller de avgrensede kravene. Ingen ressurser er opprettet.',
    overlapToggle: 'B overlapper med A (10.84.0.0/17)',
    destination: 'Mål fra A',
    scope: 'Peering-omfang',
    scopes: ['Hele VNet (hovedeksempel)', 'Utvalgte subnet (kvalifikasjon)'],
    participating: 'Øvelsens kilde-/målsubnet deltar i valgt omfang',
    qualification:
      'Subnet peering har egne krav: registrert subscription, deltakende subnet i unike adresseområder på tvers av peering-lenker og dokumenterte begrensninger ved ruteannonsering/delegerte subnet/SKU-er. Enkelte øvrige adresseområder kan være gjenbrukt når de ikke deltar. Denne modellen bruker bare ikke-overlappende enkeltområder og evaluerer ikke full produktberettigelse. Konfigurasjon er dokumentert via CLI/PowerShell/API/ARM/Terraform, ikke som en operativ Portal-knapp her.',
    route: 'Logisk rutingforutsetning',
    routes: ['Eksplisitt deklarert', 'Ukjent'],
    access: 'Tilgangsforutsetning',
    accesses: ['Erklært tillatt', 'Erklært avvist', 'Ukjent'],
    sides: 'Konseptuelt konfigurerte peering-sider',
    statuses: {
      connected: 'Connected · begge sider',
      initiated: 'Initiated · én side',
      missing: 'Ingen direkte peering',
      overlap: 'Avvist adresseoverlap i standardeksemplet',
    },
    direct: 'Direkte tosidig relasjon',
    participatingResult: 'Riktig subnet-omfang',
    path: 'Dokumentert logisk modellvei',
    permitted: 'Alle deklarerte vei-/tilgangsforutsetninger oppfylt',
    peeringMissing:
      'Modellen finner ikke et direkte Connected-grunnlag for valgt mål. A↔B↔C gir ikke automatisk A↔C.',
    partial:
      'Noe grunnlag finnes, men modellkrav til adresse, vei eller tilgang er ikke dokumentert.',
    logical:
      'Modellen finner en tillatt logisk vei under de oppgitte forutsetningene. Ingen pakke, tjenestesvar eller autorisasjon er testet.',
    zone: 'DNS-tjenesteperspektiv',
    zones: ['Azure Private DNS', 'Azure Public DNS', 'Azure-provided intern DNS'],
    providedNote:
      'Azure-provided-perspektivet bruker et automatisk internt VM-navn i samme VNet og direkte Azure-provided resolver. Du undersøker tilstedeværelse av standardrecorden, ikke opprettelse av egne records i dette navnerommet. Custom forwarding og CNAME-øvelsene bruker egne private/offentlige zoner.',
    providedHostname: 'vm-b.[Azure-provided navnerom]',
    record: 'Lokal record-forutsetning',
    records: [
      'A → riktig IPv4',
      'CNAME → A → riktig IPv4',
      'Mangler record',
      'A → feil mål-IP',
      'CNAME-løkke (ugyldig kjede)',
    ],
    linked: 'Kilde-VNet har Private DNS resolution-link',
    resolver: 'Klientens resolvervalg',
    resolvers: ['Azure-provided DNS', 'Egendefinert DNS'],
    forwarding: 'Komplett fungerende forwarding/oppløsningsvei er eksplisitt forutsatt',
    sameVnet: 'Kilde og mål i samme VNet',
    peered: 'Direkte tosidig peering er eksplisitt forutsatt',
    publicNote:
      'Offentlig zone forutsetter korrekt delegasjon; 203.0.113.20 er en dokumentasjonsadresse. Privat eksempeladresse er 10.85.1.20. Ingen adresse er en virkelig AzureLab-NIC.',
    visible: 'Zonen er synlig for valgt resolver',
    resolved: 'Navneoppslag gir en adresse',
    correctDestination: 'Adressen peker til ment mål',
    topology: 'Deklarert topologigrunnlag',
    resolutionFail:
      'Modellen gir ikke et gyldig navnesvar. Undersøk zone-synlighet, resolver og record-kjede før nettverksveien.',
    dnsOnly:
      'Navneoppslaget gir en adresse, men nettverkstilgang til riktig mål er ikke dokumentert.',
    stages: [
      'Klient / hostname',
      'Zone og record',
      'Adresse',
      'Logisk nettverksvei',
      'Deklarert tilgang',
    ],
    noRun:
      'Ingen lagret modellkjøring ennå. Velg forutsetninger, forutsi og kjør. Figuren blir en observasjon først etter eksplisitt kjøring.',
    draftChanged:
      'Utkastet er endret siden sist lagrede kjøring. Resultatet nedenfor gjelder fortsatt den lagrede observasjonen.',
    snapshot: 'Lagrede kjøringer i dette oppdraget',
    outcome: ['Ikke oppfylt', 'Delvis dokumentert', 'Deklarerte krav oppfylt'],
  },
  inspection: {
    show: 'Vis nettverksoppdrag',
    hide: 'Minimer veiledning',
    title: 'Faktisk Network Structure · read-only Sandbox',
    choose: 'Velg faktisk VM',
    empty:
      'Ingen faktisk VM finnes. Opprett Resource group og en støttet VM med nytt nettverk i vanlig Portal; behold eksisterende arbeid.',
    reuse: 'Gjenbrukt ressurs: ny inspeksjon, ingen ny opprettelseskreditt.',
    newBuild: 'Ny lokal accepted bundle etter oppdragsstart. Ingen boot eller trafikk er testet.',
    missing:
      'Kjeden eller den festede tekniske grensen kan ikke bekreftes. Last inn samme Sandbox-forsøk; ingen observasjon godskrives.',
    unverified: 'Teknisk Sandbox må avklares før observasjoner og forklaringer kan vises.',
    fields: [
      'Virtual machine',
      'Network interface',
      'Subnet',
      'Virtual network',
      'Resource group',
      'Subscription',
      'Accepted receipt',
    ],
    prefix: 'Faktisk lagret prefix',
    noIp: 'NIC-IP er ikke allokert i den støttede modellen.',
    noTraffic: 'Ingen routing, DNS, NSG, pakke eller applikasjonstilgang er evaluert.',
    observed: 'Bekreft at du har undersøkt den viste faktiske referansen',
    counted: 'Eksplisitt undersøkte referanser',
    selected: 'Valgt oppdragsressurs',
    network: 'Nettverksmedlemskap',
    management: 'Administrativt medlemskap',
    receipt: 'Åpne faktisk kvittering',
    guide: {
      group:
        'Du er i Create resource group. Velg ønsket subscription, gruppenavn og metadata-region. Opprett gruppen før du går til Virtual machines → Create.',
      vm: 'Du er i Create a virtual machine. Velg en støttet konfigurasjon og riktig Resource group/region. Bruk et passende eksisterende subnet eller opprett nytt nettverk gjennom skjemaets Networking-valg.',
      otherCreate:
        'Dette skjemaet oppretter en annen ressurstype. Gå til Virtual machines → Create for oppdragets VM, eller returner uten å endre ressurser.',
      list: 'Åpne en faktisk VM fra Virtual machines eller opprett en støttet bundle hvis listen er tom.',
      resource:
        'Undersøk den faktiske ressursidentiteten og følg NIC → subnet → VNet. Bruk inspeksjonspanelets konkrete referanser.',
      receipt:
        'Les den valgte VM-ens faktiske accepted-kvittering. Kontroller command-ID, konfigurasjonsresultat og ressursreferanser før du bekrefter inspeksjonen.',
      activity:
        'Åpne den valgte VM-ens kildekvittering fra inspeksjonspanelet. Andre operasjoner i Activity log dokumenterer ikke denne VM-ens nettverksbundle.',
      done: 'Sju faktiske referanser er undersøkt. Returner til kurset og forklar skillet mellom konfigurasjon og trafikk.',
    },
    locations: {
      group: 'Create a resource group → Basics → Project details / Resource details.',
      vm: 'Create a virtual machine → Basics, Disks, Networking og Review + create.',
      otherCreate:
        'Dette er et annet opprettelsesskjema. Bruk Virtual machines → Create, eller returner til Networking uten å sende kommando.',
      activity:
        'Activity log → valgt kommandokvittering. Kontroller command-ID, outcome og faktiske ressursreferanser.',
      resource:
        'Valgt ressurs → Overview / Related resources. Inspeksjonspanelet lenker til hver eksakte referanse.',
      groups: 'Resource groups → Create, deretter Virtual machines → Create når gruppen finnes.',
      vms: 'Virtual machines → velg ressurs, eller Create hvis du trenger en støttet bundle.',
    },
    createReasons: {
      group:
        'Resource group gir administrativ subscription-/metadata-kontekst. Den oppretter ingen NIC, subnet eller nettverksvei.',
      vm: 'Den eksplisitte VM-kommandoen oppretter en atomisk bundle med faktiske NIC-/subnet-/VNet-avhengigheter.',
      other:
        'App Service-hosting og VM-nettverk er forskjellige relasjoner. Dette skjemaet dokumenterer ikke oppdragets NIC-kjede.',
    },
    openReference:
      'Åpne en av oppdragets konkrete ressurs- eller kvitteringsreferanser nedenfor før du bekrefter inspeksjon.',
  },
  milestone: {
    inspect: {
      title: 'En faktisk nettverkskjede, ingen oppdiktet trafikk',
      text: 'Den lagrede inspeksjonen følger VM, NIC, subnet, VNet, gruppe, subscription og accepted receipt i samme tekniske forsøk. Dette viser nettverkstilknytning og scope. Ingen NIC-IP, DNS, routing eller applikasjonssvar er dokumentert.',
    },
    peering: {
      title: 'Overlap er et adresseproblem før en logisk vei',
      text: 'Den lagrede standardpeering-undersøkelsen har overlappende A/B-prefixer. Modellen avviser den relasjonen. Flere peering-sider eller en DNS-record retter ikke adressekonflikten. Subnet peering har egne dokumenterte vilkår; modellen godkjenner ikke unntak automatisk.',
    },
    dns: {
      title: 'Riktig navn er ikke en dokumentert nettverksvei',
      text: 'Den lagrede DNS-kjøringen gir riktig adresse, men ikke tilstrekkelig erklært vei eller tilgang. Zone-link og record løser navnet; nettverkstopologi, ruting og tilgang er egne forutsetninger. Ingen virkelig query eller pakke er sendt.',
    },
  },
  title: 'Describe Azure networking services',
  path: 'Introduction to Cloud Infrastructure: Describe Azure architecture and services',
  overview:
    'Følg en faktisk VM til nettverket. Design adresseområder, undersøk peering og skill et DNS-svar fra en dokumentert nettverksvei.',
  available:
    'Networking Part A · VNet, subnet, adresser, peering og DNS er tilgjengelige. Part B med VPN Gateway, ExpressRoute og endpoints er også tilgjengelig med egne versjonerte resultater. Part A alene fullfører ikke hele Networking.',
  prerequisites:
    'Bygger på nettleser/server fra Cloud Computing, fysisk og administrativ arkitektur fra Core og VM/NIC-relasjoner fra Compute. IP, CIDR og DNS forklares her før de brukes. Ingen Azure-konto eller nettverksverktøy kreves.',
  topics: {
    introduction: 'Én applikasjon, flere nettverksbehov',
    fundamentals: 'Fra navn og adresse til kommunikasjon',
    vnet: 'Virtual Networks og logiske grenser',
    addressing: 'IP Addressing & CIDR Explorer',
    dependencies: 'Undersøk en faktisk VM-nettverkskjede',
    peering: 'VNet Peering · direkte forbindelser',
    dns: 'Azure DNS · navn før nettverksvei',
    explorer: 'Azure Network Path Explorer',
    missions: 'Guidede nettverksoppdrag',
    assessment: 'Selvstendig Networking-anvendelse',
    summary: 'Part A · oppsummering og dokumenterte resultater',
  },
  sections: {
    introduction: {
      title: 'Hva må være på plass før katalogen kan svare?',
      paragraphs: [
        'Nordverk har en webflate, en applikasjonsarbeider og en intern katalogtjeneste. Utviklerne har også et eget testmiljø. Et API-kall må finne riktig mottaker og en mulig vei dit; mottakeren må dessuten tillate handlingen og faktisk svare. At komponentene finnes i Azure er ikke nok.',
        'Fra Compute kjenner du en VM, et operativsystem og en applikasjonsprosess. Nå undersøker vi forbindelsen utover maskinen: VM-en bruker et nettverkskort, kortet er knyttet til et subnet, og subnettet er del av et virtuelt nettverk. Denne strukturen er en annen enn Resource group → subscription, og en annen enn region → Availability Zone.',
        'Et nettverksdesign svarer på hvilke adresser og forbindelser som skal finnes. Et sikkerhetsdesign svarer blant annet på hvilken trafikk og hvilke brukere som skal få tilgang. De henger sammen, men en tegnet forbindelse eller et vellykket navneoppslag beviser ingen av delene alene. Drift, ruting, sikkerhetsregler og applikasjonens egen autorisasjon kan fortsatt gi andre resultater.',
        'Du skal først lese faktisk lokal konfigurasjon, deretter undersøke eksplisitte eksempelnettverk. De faktiske AzureLab-nettverkene beholder sine opprinnelige prefixer. Ingen peering, DNS-record eller ny IP legges til dem. Eksempelmodellen lar deg sammenligne utfall uten å utgi seg for å sende en pakke i Azure.',
      ],
      terms: [
        ['Arbeidslast', 'Programmet, dataene og avhengighetene som utfører en oppgave.'],
        [
          'Nettverksvei',
          'Forbindelsene og rutingsforutsetningene som kan føre trafikk fra en kilde til en mottaker.',
        ],
        [
          'Konfigurasjon versus observasjon',
          'En lagret ressursrelasjon er kjent konfigurasjon. En faktisk respons ville krevd en separat driftsobservasjon.',
        ],
      ],
      example:
        'Webflaten finner katalogens navn, men katalogen svarer ikke. Undersøk først hvilket trinn som er kjent: riktig adresse, nettverksvei, tilgang og tjeneste er separate hypoteser. Ikke opprett mer compute bare fordi et oppslag returnerte et navn.',
      limit:
        'Portal-delen viser lokal, replayet konfigurasjon. Nettverksmodellen bruker syntetiske adresser og erklærte forutsetninger; den måler ingen trafikk, DNS-tid eller applikasjonshelse.',
    },
    fundamentals: {
      title: 'En adresse forteller hvor trafikken skal forsøkes sendt',
      paragraphs: [
        'Nettverkskommunikasjon flytter informasjon mellom endepunkter gjennom nettverksinfrastruktur. En IP-adresse brukes som kilde- eller destinasjonsadresse på nettverkslaget. Den er ikke et brukernavn, et passord eller en garanti for at et program lytter. Et forståelig navn, som archive.training.example, må ofte oversettes til en adresse før programmet forsøker forbindelsen.',
        'IPv4 skriver 32 biter som fire tall mellom0 og 255, atskilt med punktum. Hvert tall representerer åtte biter. Adressen10.84.2.10 er et eksempel fra det private10.0.0.0/8-området. Andre vanlige private områder er 172.16.0.0/12 og 192.168.0.0/16. Private adresser brukes innen private nettverk og rutes ikke direkte over det offentlige internettet.',
        'En privat adresse er ikke et sikkerhetsstempel. Trafikk kan komme fra andre sammenkoblede nettverk, og en feilkonfigurert tjeneste kan fortsatt være utsatt. Omvendt er et adresseområde skrevet med offentlige tall inne i et VNet ikke automatisk en offentlig eksponering. Her bruker vi bevisst bare avgrensede private eksempler; offentlig tilgang og endpoints behandles i Part B.',
        'DNS finner en adresse til et navn. Ruting bestemmer hvor trafikk mot adressen skal gå. Tilgangsregler kan tillate eller blokkere den, og applikasjonen kan kreve egen innlogging eller rettighet. Skill derfor «et navn ble oppløst» fra «en logisk vei er mulig» og fra «tjenesten svarte på en autorisert forespørsel». Ingen av de tre siste driftsforholdene måles av denne modellen.',
      ],
      terms: [
        ['IPv4', 'Et adresseformat med 32 biter og fire åttebits tall.'],
        [
          'Privat IP-adresse',
          'En adresse fra et privat område, beregnet for intern bruk og sammenkoblede private nettverk.',
        ],
        ['Kilde og destinasjon', 'Avsender og tiltenkt mottaker i den undersøkte forbindelsen.'],
        [
          'DNS',
          'Domain Name System: et navnesystem med blant annet koblinger mellom navn og IP-adresser.',
        ],
      ],
      example:
        'Et internt navn kan gi10.72.4.12 selv når klienten mangler en rute til 10.72.0.0/16. Oppslaget besvarer navnespørsmålet; det dokumenterer ikke veien.',
      limit:
        'Eksempeladresser tilhører undervisningsmodellen. En faktisk AzureLab-NIC har en subnetId, men ingen modellert privat IP-allokering.',
    },
    vnet: {
      title: 'En regional nettverksstruktur, ikke en Resource group',
      paragraphs: [
        'Azure Virtual Network, ofte kalt VNet, er et logisk isolert nettverk for Azure-ressurser. Du bestemmer adresseområder og subnett, og kan konfigurere forbindelser til andre nettverk. VNet er en regional ressurs: det hører til en region, men kan støtte ressurser fordelt mellom Availability Zones innen regionen. En sone er en fysisk feilgrense; et subnet er ikke en sone.',
        'Som andre ARM-ressurser er et VNet organisert i en Resource group og et subscription. Den administrative plasseringen gir management-kontekst. Subnett er underressurser i VNet. En VM bruker en NIC som er knyttet til et subnet i samme region som nettverkskortet. Vårt operative treningsutvalg krever i tillegg samme gruppe ved subnet-gjenbruk; det er en lokal avgrensning, ikke en universell regel om alle Azure-nettverksressurser.',
        'Standard nettverksmekanismer kan gi kommunikasjon mellom subnett i samme VNet, men dette er ikke en påstand om at alle tjenester godtar alle forespørsler. NSG-er, egendefinerte ruter, en nettverksappliance og applikasjonssikkerhet kan påvirke utfallet. Et subnet skaper ikke automatisk en sikkerhetsgrense bare ved å få et navn som «database».',
        'En vanlig Web App er heller ikke automatisk medlem av VM-ens subnet fordi de deler Resource group. Tjenester har egne integrasjons- og nettverksfunksjoner. I AzureLab modelleres Web App → App Service plan som hosting, og VM → NIC → subnet som nettverk. Ingen VNet-integrasjon for Web App utledes av den første relasjonen.',
        'Bruk Network Structure-perspektivet til å lese den faktiske VM-en og dens konkrete referanser. Vis Resource group og subscription ved siden av kjeden, ikke som om de var nettverkshopp. En avvist kommando legger ikke til manglende nettverksobjekter.',
      ],
      terms: [
        ['VNet', 'En regional logisk nettverksressurs med adresseområder og subnett.'],
        ['NIC', 'Network Interface: ressursen som knytter en VM til et subnet.'],
        ['Resource group', 'Administrativ gruppering og livssyklus, ikke en nettverksforbindelse.'],
        [
          'NSG',
          'Network Security Group: regler som kan filtrere trafikk. Ingen slik regelevaluering utføres her.',
        ],
      ],
      example:
        'En gruppe med metadata-location Norway East kan inneholde en North Europe-VM og dens North Europe-nettverk. Gruppens metadata-region flytter ikke VM eller VNet. Samme gruppemedlemskap oppretter heller ingen peering til et annet VNet.',
      limit:
        'Den faktiske sandboxen støtter én NIC-kjede per VM og faste treningsprefixer. Ingen trafikk, dynamisk IP-tildeling, NSG eller route table er implementert.',
    },
    addressing: {
      title: 'Et prefix avgrenser et sammenhengende adresseintervall',
      paragraphs: [
        'CIDR, Classless Inter-Domain Routing, skriver et nettverk som en nettverksadresse og en prefix-lengde, for eksempel 10.42.0.0/16. Tallet etter skråstreken forteller hvor mange av de 32 IPv4-bitene som identifiserer nettverket. Resten av bitene gir adresser innen intervallet. Flere prefix-biter gir et mindre adresseområde; et /25 er mindre enn et /24.',
        'Antall adresser i en IPv4-blokk er 2 opphøyd i antall gjenværende biter. /16 gir 2^16 = 65536 adresser, og /24 gir 2^8 = 256. 10.42.0.0/16 går fra 10.42.0.0 til 10.42.255.255. Subnettet 10.42.1.0/24 går fra 10.42.1.0 til 10.42.1.255 og ligger derfor helt innenfor VNet-området.',
        'Containment betyr at hele subnettintervallet ligger innenfor et av VNet-områdene. 10.43.1.0/24 ligger utenfor 10.42.0.0/16 selv om navnene ligner. Overlap betyr at to intervaller deler minst én adresse. 10.42.1.128/25 er en del av 10.42.1.0/24; de kan ikke brukes som to separate overlappende subnett i samme VNet.',
        'I vanlige Azure IPv4-subnett reserveres de første fire adressene og den siste. I 10.42.1.0/24 er det .0, .1, .2, .3 og .255. Det gir 251 adresser før andre tildelinger og eventuelle tjenestespesifikke behov. Den siste adressen reserveres selv om Azure ikke tilbyr vanlig broadcast-trafikk. Støttede subnettstørrelser og særskilte tjenester må fortsatt kontrolleres.',
        'Designøvelsen bruker kanoniske private nettverksprefixer med null i host-bitene og Azure-subnett fra /29 til de eksplisitte større eksemplene. Parseren forklarer feil fremfor å gjette hvilken blokk du mente. Å ha mange ledige adresser i et annet subnet hjelper ikke en NIC som skal tildeles i et fullt subnet. Planlegg begge fordeling og kapasitet.',
      ],
      terms: [
        ['Prefix-lengde', 'Antall nettverksbiter foran de frie adressebitene.'],
        ['Nettverksadresse', 'Første adresse i den kanoniske CIDR-blokken.'],
        ['Containment', 'Hele det mindre intervallet ligger inne i det større.'],
        ['Overlap', 'To adresseintervaller deler én eller flere adresser.'],
      ],
      example:
        'Et separat worked example: 192.168.40.0/26 har 64 adresser, fra .0 til .63. Med de fem vanlige Azure-reservasjonene gjenstår 59 før øvrige tildelinger. Dette eksemplet er ikke løsningen på subnettdesignet i oppdraget.',
      limit:
        'Dette er adresseplanlegging, ikke en IP-allokator. Beregnet antall ledige eksemplaradresser skrives aldri til faktiske AzureLab-NIC-er.',
    },
    dependencies: {
      title: 'Følg referansene som faktisk finnes',
      paragraphs: [
        'En VM-konfigurasjon refererer sin NIC. NIC-en har et subnetId; subnettet har et vnetId og et adresseprefix; VNet har et adresseområde. Du skal følge identitetene, ikke bare like navn. En ressurs i en annen gruppe kan ha et lignende navn uten å være denne VM-ens nettverksavhengighet.',
        'Inspeksjonen viser også gruppen og dens subscription som administrativt scope, samt den aksepterte kvitteringen som opprettet VM-bundlen. En eldre VM kan brukes som undersøkelsesgrunnlag. Det er gjenbruk av kjent konfigurasjon, ikke en ny opprettelse eller et nytt selvstendig resultat. Oppdraget krever nye eksplisitte inspeksjoner og en årsaksforklaring.',
        'Hvis inventaret er tomt, oppretter du selv en Resource group og en støttet VM gjennom den eksisterende Portal-flyten. VM-formens Networking kan opprette et nytt treningsnettverk. Ingen adresse- eller peeringkommando legges til i dette oppdraget. SavvyShark forklarer det faktiske skjemaet, og sender aldri en kommando for deg.',
        'To separate nye treningsnettverk kan begge ha10.42.0.0/16. De er fortsatt forskjellige ressurser med forskjellige identiteter. Lik adresseplan er ikke en peeringforbindelse, og overlappet er et problem for vanlig peering. Bruk det separate designscenarioet for å undersøke ikke-overlappende alternativer; ikke endre historiske prefixer for å få en penere figur.',
      ],
      terms: [
        ['Ressursreferanse', 'En konkret ID som knytter én modellert ressurs til en annen.'],
        [
          'Kvittering',
          'Resultatet fra en faktisk lokal støttet kommando, med scope, utfall og endring i inventory.',
        ],
        [
          'Gjenbrukt inspeksjon',
          'Ny læringsaktivitet som undersøker en eksisterende ressurs uten å påstå en ny teknisk opprettelse.',
        ],
      ],
      example:
        'En NIC refererer subnet-6, som igjen refererer vnet-5. En annen ressursgruppe med navnet «network» er ingen erstatning for disse ID-ene. Kontroller kjede og administrative scopes hver for seg.',
      limit:
        'At kjeden finnes dokumenterer ingen privat IP, rute, DNS-record, NSG-tillatelse eller respons fra applikasjonen. Teknisk lagringsusikkerhet skal holde også oppsummering av denne kjeden tilbake.',
    },
    peering: {
      title: 'Koble nettverk direkte uten å finne på videre transit',
      paragraphs: [
        'VNet Peering knytter Azure-nettverk sammen over Microsofts backbone. Peering i samme region og Global VNet Peering mellom regioner bruker det samme grunnprinsippet: de to nettverkene får en direkte nettverkskobling under tjenestens vilkår. De kan ligge i forskjellige subscriptions og, med nødvendige tillatelser, forskjellige tenants. Peering på tvers av separate Azure cloud-miljøer er ikke et generelt tillatt valg.',
        'I vanlig Resource Manager-peering konfigureres en peering på hver side. Bare første side gir Initiated; begge må være Connected før koblingen er etablert. De komplette adresseområdene må være ikke-overlappende. En likegyldig status eller en pil i en tegning er ikke bevis på en gyldig kobling.',
        'Vanlig peering er ikke automatisk transitiv. Har A peering med B og B med C, oppstår ingen A–C-forbindelse gjennom B av dette alene. En eksplisitt A–C-peering eller en separat riktig konfigurert rutingsløsning med for eksempel en NVA kan løse andre design. En innstilling for forwarded traffic skaper ikke selv en NVA eller en route table.',
        'En Connected-kobling fritar deg ikke fra ruting og tilgangskontroll. NSG-er og andre mekanismer kan fortsatt blokkere en flyt. Peering oppretter heller ikke appbrukere, tillatelser, en databaseavhengighet eller DNS-records. VPN Gateway er en annen forbindelsesmekanisme; gateway transit krever egne ressurser og innstillinger og behandles videre i Part B.',
        'Nyere subnet peering gir mulighet til å velge bestemte subnett fremfor alle subnett i hele VNet. Ved kildekontrollen krever den dokumenterte funksjonen subscription-allowlisting og konfigurasjon gjennom støttede API-/kodeverktøy, ikke en vanlig Portal-knapp. Derfor må du kontrollere hvilket omfang en konkret peering faktisk har. Vår hovedøvelse viser standard peering; et separat merket subnet-utvalg viser hvorfor et nytt subnet ikke alltid arver forbindelsen.',
      ],
      terms: [
        [
          'VNet Peering',
          'Direkte kobling mellom to Azure VNet, under adresse-, status- og tilgangsvilkår.',
        ],
        ['Global VNet Peering', 'Peering mellom Azure-regioner innen støttede cloud-miljøer.'],
        [
          'Ikke-transitiv',
          'To separate koblinger gjennom en tredje node lager ikke automatisk en direkte eller videresendt forbindelse.',
        ],
        [
          'NVA',
          'Network Virtual Appliance: en særskilt konfigurert nettverksfunksjon; den oppstår ikke av en peeringpil.',
        ],
      ],
      example:
        'I et worked example har et analyse-VNet og et lager-VNet egne ikke-overlappende områder og begge peering-sider Connected. Det dokumenterer koblingen. Om en bestemt SQL-forespørsel fungerer avhenger fortsatt av ruting, trafikkregler og applikasjonens rettigheter.',
      limit:
        'Modellen konfigurerer ingen faktisk peering, gateway eller NVA. Deklarert logisk vei er ingen sendt pakke, og en valgt tilgangsforutsetning er ingen reell NSG-evaluering.',
    },
    dns: {
      title: 'Navn, adresse, vei og tilgang er fire forskjellige spørsmål',
      paragraphs: [
        'Et domenenavn gir mennesker og programmer et stabilt navn å bruke. En DNS-zone forvalter records for et navneområde. En A-record kobler et navn til en IPv4-adresse. En CNAME-record peker i stedet til et annet navn, som deretter må løses videre. Et alias er ikke en kopi av en server, og et CNAME kan ikke bare erstatte alle andre record-typer på samme navn.',
        'Azure Public DNS hoster autoritative offentlige DNS-zoner og records. For at den offentlige navnehierarkiet skal bruke zonen, må delegasjonen peke til de riktige navneserverne. Å opprette en zone med et domenenavn kjøper ikke domenet og gjør deg ikke automatisk til eier. Azure DNS er ikke en generell domeneregistrar.',
        'Azure-provided DNS gir grunnleggende Azure-styrt navneoppløsning, blant annet mellom VM-er i samme VNet. Kunden velger ikke fritt de interne zone-navnene og record-livssyklusen i denne standardtjenesten. Den skal ikke forveksles med din egen private zone eller forventes å løse alle hostnavn på tvers av peering.',
        'Azure Private DNS lar deg forvalte egne private navneområder. Med Azure-provided DNS må et VNet være knyttet til den relevante private zonen for å bruke dens records. Et resolution-link er ikke det samme som automatisk registrering av VM-records: autoregistration er en egen innstilling. Flere VNet kan være knyttet til samme private zone uten at det i seg selv gir en applikasjonsrute mellom dem.',
        'Peering arver ikke automatisk en annen VNet sin Private DNS-link. Egendefinerte DNS-servere trenger også en passende oppløsningsstrategi. Azure DNS Private Resolver kan bruke inbound endpoints, outbound endpoints og forwarding rulesets til relevante Azure-/hybridoppslag uten VM-baserte DNS-servere. Den krever korrekt VNet-, subnet-, regel- og nettverkstilknytning; navnet på tjenesten er ingen automatisk forbindelse.',
        'I DNS-øvelsen velger du lokale eksempelrecords og en eksplisitt resolver-/zone-link-forutsetning. Se først om riktig navn blir til riktig adresse. Undersøk deretter om modellen kjenner en logisk nettverksvei og en erklært tillatelse. Et gyldig oppslag kan etterfølges av en ukjent vei eller avvist tilgang. Applikasjonens svar er fortsatt ikke testet.',
      ],
      terms: [
        ['DNS-zone', 'Et navneområde med administrerte DNS-records.'],
        ['A-record', 'Kobler et navn til en IPv4-adresse.'],
        ['CNAME', 'Et alias fra ett navn til et annet navn, ikke direkte til en IP.'],
        [
          'Private DNS zone link',
          'Knytter et VNet til en privat zone for navneoppløsning; registrering er et separat valg.',
        ],
        [
          'Private Resolver',
          'Administrert DNS-videresending/oppløsning med eksplisitte endpoints og regler; ikke en erstatning for nettverkstilkobling.',
        ],
      ],
      example:
        'I et separat worked example peker bill.training.example via CNAME til ledger.training.example, som har en A-record. Oppslaget må fullføre begge trinn. Selv et korrekt svar sier ingenting om klientens applikasjonsrolle eller en tjenestes helsetilstand.',
      limit:
        'Ingen eksterne navn spørres. Ingen DNS-zone, resolver, endpoint eller apprettighet opprettes i AzureLab Portal. Eksempel-IP-er er aldri faktiske NIC-data.',
    },
    explorer: {
      title: 'Finn det første trinnet som ikke er dokumentert',
      paragraphs: [
        'En feilsøking trenger mer enn ett grønt signal. Begynn med hvilken mottaker programmet mente å kontakte. Kontroller navneoppløsningen og om den returnerte adressen faktisk peker til denne mottakeren. En feil A-record kan gi et gyldig DNS-svar som peker til feil nettverk; ny peering ville ikke rettet den feilaktige navnekoblingen.',
        'Deretter undersøker du topologien. Samme VNet, en direkte Connected-peering og en ikke-transitiv toleddet figur er ulike situasjoner. Kontroller om nettverks- og subnet-omfanget omfatter kilden og målet. Hvis ruten eller tilgangsforutsetningen er ukjent, skal modellen si nettopp det i stedet for å feire en vellykket tilkobling.',
        'Endre én vesentlig forutsetning om gangen, forutsi utfallet og kjør den rene modellen. Sammenlign det lagrede resultatet med prediksjonen og forklar årsaken. Parameterendringer er utkast til neste undersøkelse; figuren over sist lagrede observasjon endres først ved eksplisitt kjøring.',
        'Les den faktiske VM-kjeden i et annet perspektiv. Den gir konkrete ressurs-ID-er, prefixer og scopes fra Sandbox, men ingen DNS- eller trafikksvar. Når de faste treningsprefixene overlapper, er dette et kontrollert moteksempel. Det separate konseptdesignet gir alternativer uten å omskrive faktiske ressurser eller historiske kvitteringer.',
      ],
      terms: [
        ['Prediksjon', 'Ditt forventede utfall før en lagret modellkjøring.'],
        ['Utkast', 'Valgte forutsetninger som ennå ikke er kjørt.'],
        [
          'Deklarert vei',
          'En logisk modellkonklusjon under oppgitte antakelser; ikke en nettverkstest.',
        ],
      ],
      example:
        'Hvis riktig navn gir riktig IP mens tilgang er «ukjent», er riktig konklusjon at navnet er løst og tilgangen ikke dokumentert. Endre ikke DNS bare for å få alle trinn til å se grønne ut.',
      limit:
        'Modellen evaluerer bare de viste IPv4-/topologi-/DNS-forutsetningene. Den er ikke en full Azure-rutetabell, DNS-cache, NSG-, IPv6-, VPN- eller endpoints-motor.',
    },
  },
} as const;

/** Original P06 transfer cases. Decision and causal reason are independently submitted. */
export const networkingItemsNb = {
  nw01: {
    title: 'Ny teamstruktur',
    problem:
      'En organisasjon samler to VM-er i én Resource group for felles kostnadsansvar. VM-ene har NIC-er i forskjellige VNet. Teamet ønsker en intern nettverksvei mellom dem uten å anta nye tekniske forbindelser.',
    premises: [
      'Kun management-organiseringen er endret.',
      'Ingen peering eller annen nettverksforbindelse er konfigurert.',
      'Program- og tilgangskrav må fortsatt undersøkes.',
    ],
    decisions: [
      'Samle VM-ene i App Sandbox og bruk det felles subscription-scope som grunnlag for intern kommunikasjon.',
      'Følg NIC → subnet → VNet, og planlegg den nødvendige nettverksforbindelsen.',
      'Samordne gruppens metadata-region med VM-ene og bruk denne regionale organiseringen som løsning på kommunikasjonsbehovet.',
    ],
    reasons: [
      'Et felles subscription samler ressurser under én management-grense, der organisasjonen kan fordele ansvar og følge opp ressursenes kostnader.',
      'Resource group-location angir hvor gruppens metadata lagres; ressursenes egne lokasjoner inngår i en annen del av organisasjonens ressursplan.',
      'Gruppe og subscription endrer ikke NIC-ens VNet eller forbindelsene mellom VNet.',
    ],
    decisive:
      'Kravet gjelder en nettverksvei. Den administrative endringen har ikke endret de to NIC-enes faktiske nettverkstilknytning.',
    feedback: [
      [
        'Samme subscription kan være et riktig administrativt valg, men oppretter ingen nettverksforbindelse. Det ville vært relevant hvis problemet gjaldt kostnads- eller management-grense.',
        'Riktig undersøkelse: følg faktiske referanser før en passende eksplisitt forbindelse og tilgang vurderes. Dette hevder ikke at forbindelsen allerede virker.',
        'Metadata-location kan være relevant for gruppens metadata, men endrer ikke VM-enes VNet. Et krav om metadatahåndtering ville gitt dette valget en annen rolle.',
      ],
      [
        'Faktisk egenskap, men ikke årsaken til en nettverksvei. Et subscription-scope svarer på et administrativt spørsmål.',
        'Faktisk metadata-egenskap, men ingen pakkerute. VM-er i gruppen kan ligge andre steder.',
        'Riktig årsak: NIC/subnet/VNet beskriver nettverkstilknytning, mens gruppe/subscription beskriver management-scope.',
      ],
    ],
  },
  nw02: {
    title: 'Fordel arbeidslasten mellom soner',
    problem:
      'Et team vil plassere to VM-er i forskjellige Availability Zones i samme region. Begge NIC-ene skal bruke det eksisterende regionale VNet-et. En kollega mener at hver sone trenger sitt eget VNet fordi datasentrene er fysisk adskilt.',
    premises: [
      'Regionen og de aktuelle VM-valgene støtter soner.',
      'NIC/subnet og VNet har riktig regional tilknytning.',
      'Applikasjonsredundans, ruting og faktisk tilgjengelighet må fortsatt konfigureres og vurderes separat.',
    ],
    decisions: [
      'Opprett ett VNet per sone for å la den logiske nettverksinndelingen følge den fysiske feilseparasjonen.',
      'Plasser VM-ene i forskjellige regioner, men behold de eksisterende regionale nettverksreferansene.',
      'Behold det regionale VNet-et, og bruk passende subnet/NIC-tilknytninger for begge soneplasserte VM-er.',
    ],
    reasons: [
      'VNet og subnet er regionale nettverksressurser som kan omfatte flere Availability Zones; VM-ens fysiske soneplassering krever derfor ikke et separat VNet.',
      'Availability Zones skiller fysisk adskilte grupper av datasentre med egne forutsetninger for strøm, kjøling og nettverk innenfor én Azure-region.',
      'Resource groups gir relaterte Azure-ressurser et felles administrativt scope.',
    ],
    decisive:
      'Et VNet er regionalt og strekker seg over sonene i regionen. Fysisk feilseparasjon krever ikke at hvert zonalt kjøregrunnlag får et eget VNet.',
    feedback: [
      [
        'Et VNet per sone er ikke et generelt teknisk krav. Separate VNet kan ha andre administrative/nettverksmessige formål, men soneskillet alene krever dem ikke.',
        'Et VNet er regionalt, så du kan ikke bare beholde samme regionale NIC/subnet-tilknytning når VM-en flyttes til en annen region. Et multiregion-design trenger egen nettverksplan.',
        'Riktig under premissene. Dette dokumenterer en gyldig nettverksorganisering, ikke automatisk redundans, trafikkruting eller apphelse.',
      ],
      [
        'Riktig årsak: regional nettverksstruktur og zonal fysisk plassering kan sameksistere uten ett VNet per sone.',
        'Fysisk adskillelse er riktig, men den alene beviser ikke at virtuelle nettverk skal deles etter samme grenser.',
        'Riktig management-egenskap, men den avgjør ikke hvilke soner et regionalt VNet kan omfatte.',
      ],
    ],
  },
  nw03: {
    title: 'Avdelingsutvidelsen',
    problem:
      'Et VNet har 10.64.0.0/20. Teamet vil legge til ett subnet på /24. Det eksisterende subnettet er 10.64.2.0/24. Hvilket utkast holder seg innenfor VNet uten å overlappe?',
    premises: [
      'Kanoniske nettverksprefixer brukes.',
      'Ingen andre subnet finnes.',
      'Kapasitetsbehovet passer i /24.',
    ],
    decisions: ['10.64.15.0/24', '10.64.16.0/24', '10.64.2.128/25'],
    reasons: [
      'Et /16 ville samlet flere /24-blokker i et større VNet-område, med mer plass til senere subnet og vekst i organisasjonens adresseplan.',
      'Et /20 slutter ved 10.64.15.255. Valgt /24 må ligge innenfor og ikke overlappe eksisterende subnet.',
      'Ved å øke prefix-lengden fra /24 til /25 deles en adresseblokk i mindre blokker, hver med færre hostbiter og færre tildelbare adresser.',
    ],
    decisive: '10.64.15.0/24 ligger helt innenfor /20 og deler ingen adresser med 10.64.2.0/24.',
    feedback: [
      [
        'Riktig. Siste adresse er 10.64.15.255, innenfor VNet. Et annet ledig /24 i intervallet ville også vært mulig dersom det var et tilbudt alternativ.',
        '10.64.16.0 er første adresse utenfor dette /20. Det kunne vært gyldig etter en eksplisitt adresseutvidelse og nye overlap-kontroller.',
        'Dette /25 er en del av eksisterende 10.64.2.0/24 og overlapper. Det kunne erstattet et design etter omlegging, ikke sameksistert slik premisset står.',
      ],
      [
        'Et større /16 ville gitt et annet intervall, men det er ikke den oppgitte konfigurasjonen. To like oktetter opphever ikke /20-grensen.',
        'Riktig intervall- og overlap-begrunnelse. Begge vilkår må holde.',
        'Mindre blokker er en reell størrelsesendring, men den tilbudte /25-blokken ligger fortsatt inne i et eksisterende subnet. Prefix-lengden alene gjør ikke dette parallelle subnettet gyldig.',
      ],
    ],
  },
  nw04: {
    title: 'Planlegg adressekapasitet',
    problem:
      'Et ledig privat VNet-område skal romme ett ordinært Azure IPv4-subnet for 28 NIC-adresser. Velg det minste av de tilbudte subnettene som gir nok ordinært tilgjengelige adresser.',
    premises: [
      'Ingen ekstra tjenestespesifikke allokeringer kreves.',
      'Fem adresser reserveres i dette ordinære subnettet.',
      'Alle tilbudte prefixer ligger riktig og overlapper ingen andre subnet.',
    ],
    decisions: ['/27', '/28', '/26'],
    reasons: [
      'Et /27 rommer 32 adresser. De fire som er til overs etter 28 NIC-er kan beholdes som felles reserve utenfor NIC-tildelingen.',
      'Et /28 bruker flere prefix-biter enn /27; den mer detaljerte inndelingen bør derfor gi plass til flere NIC-er i subnettet.',
      '64−5=59, mens 32−5=27. Dermed kreves /26 blant de tilbudte subnettene.',
    ],
    decisive:
      'Totalt antall er ikke det tildelbare antallet.28 overstiger de 27 ordinært tilgjengelige adressene i et /27.',
    feedback: [
      [
        '/27 gir 32−5=27, én for lite. Det ville passet ved høyst 27 nødvendige adresser under samme premisser.',
        '/28 gir 16−5=11. Det kunne vært et mindre behovsdesign, men dekker ikke 28.',
        '/26 gir 59 og er det minste tilstrekkelige blant disse tilbudene. Ekstra tjenestebehov ville krevd en ny vurdering.',
      ],
      [
        'Det ordinære /27-subnettet trenger fem reserverte adresser, ikke fire. 32−5=27 er mindre enn behovet på 28; reservasjonene kan ikke flyttes ut av subnettet i dette eksemplet.',
        'Lengre prefix gir færre hostbiter og dermed færre adresser, ikke flere.',
        'Riktig beregning og sammenligning. Dette er et ordinært undervisningssubnet, ikke en universell grense for alle Azure-tjenester.',
      ],
    ],
  },
  nw05: {
    title: 'Gjennomgå et prefixutkast',
    problem:
      'En plan sier at subnettet er 10.91.4.17/24. Verktøyet krever kanonisk nettverksadresse. Ingen andre subnet bruker 10.91.4.0/24.',
    premises: [
      'VNet er 10.91.0.0/16.',
      'Oppgaven gjelder subnet-prefixet, ikke valg av en NIC-adresse.',
      'Behold et /24 med samme adresseintervall.',
    ],
    decisions: [
      'Skriv 10.91.4.17/32 slik at den angitte adressen beholdes som hele subnettbeskrivelsen.',
      'Skriv 10.91.4.0/24 som nettverksadresse for det samme adresseintervallet.',
      'Behold 10.91.4.17/24; bruk adressens plassering i det private området som grunnlag for å godta prefixet.',
    ],
    reasons: [
      'Et /24 har åtte hostbiter. De nullstilles for å skrive blokkens nettverksadresse, mens /24-intervallet beholdes.',
      'En /24-blokk har 256 IPv4-adresser før Azure-reservasjoner og andre tildelinger regnes fra.',
      'Et /32 identifiserer én IPv4-adresse og brukes når en beskrivelse skal gjelde én bestemt host.',
    ],
    decisive:
      'Nettverksadressen og en mulig hostadresse har forskjellige roller. /24-grensen er .0 i dette tilfellet.',
    feedback: [
      [
        '/32 beskriver én adresse og oppfyller ikke samme subnetstørrelse eller det ordinære Azure-subnetkravet. Det har andre roller i nettverksbeskrivelser.',
        'Riktig kanonisk nettverksadresse. Dette tildeler ingen faktisk NIC en adresse.',
        'Privat adresseklasse gjør ikke hostbitene til en gyldig nettverksgrense. Et verktøy kan normalisere inndata, men dette krever kanonisk form.',
      ],
      [
        'Riktig mekanisme:8 hostbiter gir 256 adresser og en nettverksgrense ved .0.',
        'Riktig adressetall, men det avgjør ikke hvilken adresse som er den kanoniske nettverksgrensen. Hostbitene må fortsatt nullstilles.',
        'Riktig egenskap ved /32, men en enkeltadresse beholder ikke det etterspurte /24-intervallet. Dette kunne vært relevant for en hostspesifikk referanse, ikke dette subnettdesignet.',
      ],
    ],
  },
  nw06: {
    title: 'Ny partnerforbindelse',
    problem:
      'To VNet med ikke-overlappende adresseområder ligger i forskjellige subscriptions og regioner i samme Azure-sky. Tillatelser er avklart. Første side av en standardpeering er opprettet og viser Initiated.',
    premises: [
      'Det finnes ingen annen forbindelse mellom nettverkene.',
      'Begge parter ønsker direkte peering.',
      'DNS og applikasjonstilgang undersøkes senere.',
    ],
    decisions: [
      'Konfigurer den motsatte siden og bekreft Connected på begge.',
      'Opprett en A-record for partnerens app før den andre siden konfigureres.',
      'Flytt VNet til samme Resource group før statusen kan endres.',
    ],
    reasons: [
      'Global peering kan knytte VNet i forskjellige Azure-regioner sammen over Azure-nettverket når de nødvendige produktkravene er oppfylt.',
      'Resource groups organiserer relaterte ressursers administrative livssyklus.',
      'Initiated dekker første side. Connected krever den motsatte peering-siden i tillegg.',
    ],
    decisive:
      'Initiated etter første side er ikke det tosidige Connected-grunnlaget oppgaven krever.',
    feedback: [
      [
        'Riktig neste peeringhandling under premissene. Connected er fortsatt ikke en app-helsetest.',
        'En A-record kan løse et navn senere, men etablerer ikke manglende peering-side.',
        'Management-medlemskap er ikke peering. Samme gruppe ville ikke erstatte andre side og er ikke et generelt krav.',
      ],
      [
        'Riktig definisjon av global peering, men regionforskjellen forklarer ikke hvorfor statusen fortsatt er Initiated. Den manglende motsatte siden er avgjørende.',
        'Riktig administrativ egenskap, men gruppeplassering etablerer ingen peering-side. Et livssyklusproblem ville gjort dette relevant.',
        'Riktig: avklar begge sider og dokumenterte cross-scope-krav uten å anta DNS eller appautorisasjon.',
      ],
    ],
  },
  nw07: {
    title: 'Sammenkoble utvalgte miljøer',
    problem:
      'VNet A har 10.18.0.0/16 og 10.19.0.0/16. VNet B har 10.19.0.0/16 og 10.20.0.0/16. Bare app-subnettene i A sitt 10.18-område og B sitt 10.20-område trenger forbindelse. Teamet kan enten planlegge adresseendringer eller undersøke kvalifisert subnet peering.',
    premises: [
      'Ingen andre peering-lenker finnes i dette planeksemplet.',
      'De deltakende app-subnettene ligger i unike adresseområder; de overlappende 10.19-områdene deltar ikke i subnet-alternativet.',
      'Funksjonstilgang, tillatelser, ruteannonserings-/SKU-begrensninger og sikkerhetsforutsetninger må kontrolleres før virkelig bruk.',
      'Oppgaven gjelder forsvarlig planlegging, ingen operativ peering-godkjenning.',
    ],
    decisions: [
      'Planlegg ikke-overlappende hele VNet-områder og vurder standardpeering etter endringen.',
      'Godkjenn standard whole-VNet-peering som nettverkene står fordi app-subnettene er forskjellige.',
      'Undersøk subnet peering for de unike deltakende områdene med full kontroll av produktvilkårene.',
    ],
    reasons: [
      'Standardpeering omfatter hele VNet-områder. En kontrollert adresseomlegging kan fjerne overlappet.',
      'Subnet peering kan avgrense deltakelse til unike app-områder etter kontroll av funksjonens særvilkår.',
      'Global peering kan knytte VNet på tvers av Azure-regioner og subscriptions når tillatelser og tjenestens øvrige krav er avklart.',
    ],
    decisive:
      'To planretninger er forsvarlige med hver sin begrunnelse. Standardpeering kan ikke godkjennes som det står; nyere subnet peering må vurderes etter egne vilkår, ikke standardmodellens fulle omfang.',
    feedback: [
      [
        'Forsvarlig plan med standardpeering-begrunnelsen. Reell adresseomlegging krever kontrollert migrering og nye overlap-/avhengighetskontroller; ingen eksisterende data slettes her.',
        'Standardpeering omfatter hele adresseområdene, inkludert det felles 10.19-området. At bare app-subnettene er ulike gjør ikke dette whole-VNet-utkastet gyldig.',
        'Forsvarlig undersøkelse med subnet-scope-begrunnelsen. Dette er ikke en automatisk produksjonsgodkjenning: alle funksjons-, deltakelses-, rutings- og SKU-vilkår må avklares.',
      ],
      [
        'Riktig for den planlagte whole-VNet-omleggingen. Den forklarer ikke alene hvorfor de nåværende adressene kan beholdes i et selektivt subnet-alternativ.',
        'Riktig for selektiv subnet peering under premissene. Dette er et kvalifisert produkttilfelle utenfor den rene modellens konservative enkeltområdefixture.',
        'Riktig egenskap ved global peering, men en regionforskjell løser verken adresseoverlap eller valg av deltakende scope.',
      ],
    ],
  },
  nw08: {
    title: 'Et ekstra subnet',
    problem:
      'Et dokumentert subnet-peering-oppsett har eksplisitte lokale og eksterne deltakende subnet. Et nytt subnet er opprettet, men ikke med i listene. Teamet viser en synlig rute som bevis for fungerende peering.',
    premises: [
      'Gjeldende dokumentasjon beskriver særskilte krav og ruteannonseringsbegrensninger.',
      'Dette er ikke standard whole-VNet-peering.',
      'Oppgaven gir ingen faktiske pakke- eller tilgangsobservasjoner.',
    ],
    decisions: [
      'Bruk den viste effective route som godkjenning av tilgangen, og behold subnettet utenfor deltakelseslistene.',
      'Kontroller deltakelseslistene og funksjonens gjeldende begrensninger før en støttet endring.',
      'Legg standard whole-VNet-omfang til grunn fordi det nye subnettet tilhører et av VNet-ene som allerede er peert.',
    ],
    reasons: [
      'Deltakelseslistene avgrenser dette peering-oppsettet; en overannonsert rute beviser ikke trafikk fra subnettet.',
      'Standard whole-VNet-peering vurderer de tilknyttede nettverkenes adresseområder, også ved global peering.',
      'Effective routes samler rutene Azure beregner for et nettverksgrensesnitt, inkludert relevante systemruter og konfigurerte tilpasninger i nettverkstopologien.',
    ],
    decisive:
      'Gjeldende subnet-peering-dokumentasjon kvalifiserer både deltakelse og ruteannonsering. Ikke anta trafikk fra et rutefunn alene.',
    feedback: [
      [
        'Synlig rute er utilstrekkelig. Den dokumenterte funksjonen har kvalifikasjoner der ruter kan overannonseres uten fungerende trafikk.',
        'Riktig undersøkelse uten falsk operasjonell godkjenning. Reell konfigurasjon krever funksjonstilgang og dagens støttede verktøy/SKU-forbehold.',
        'Dette ignorerer nyere selektiv subnet-peering. Whole-VNet er hovedmodellen i AZ-900-undervisningen, men ikke en universell produktregel.',
      ],
      [
        'Riktig: deltakende scope, unikhet og aktuelle begrensninger må undersøkes, og en rute er ikke en trafikkmåling.',
        'Riktig om standardpeering, men scenarioet bruker eksplisitt subnet peering. Deltakelseslistene kan derfor ikke utledes av whole-VNet-regelen.',
        'Riktig rolle for rutetabellen, men den dokumenterte overannonseringsbegrensningen betyr at rutevisning alene ikke beviser levert trafikk fra dette subnettet.',
      ],
    ],
  },
  nw09: {
    title: 'Et offentlig tjenestenavn',
    problem:
      'En virksomhet eier et domene gjennom en registrar. Den oppretter en Azure Public DNS-zone og riktige records, men den offentlige delegasjonen peker fortsatt til gamle navneservere.',
    premises: [
      'Den gamle DNS-leverandøren returnerer fortsatt sine records.',
      'Oppgaven gjelder hvilken autoritativ zone offentlige klienter bruker.',
      'Nettverksvei og webserver er ikke endret.',
    ],
    decisions: [
      'Opprett en Private DNS-zone med de samme records og knytt den til webserverens VNet for å flytte de offentlige klientenes oppslag.',
      'Bestill en ny registrering av samme domene hos Azure DNS, slik at registrering og hosting samles hos den nye DNS-leverandøren.',
      'Flytt delegasjonen hos registratoren/foreldresonen til den kontrollerte Azure-zonens navneservere.',
    ],
    reasons: [
      'Private DNS-links gjør et privat navneområde tilgjengelig for oppløsning fra relevante VNet når resolverforutsetningene er på plass.',
      'Offentlig DNS følger NS-delegasjon til autoritative navneservere. En ny zone flytter ikke domenets delegasjon når records opprettes.',
      'Azure Public DNS lagrer og hoster records i autoritative zoner for domenenavn som virksomheten forvalter.',
    ],
    decisive:
      'Riktige records i en zone som ikke er delegert er ikke nok til å gjøre den til offentlig autoritet.',
    feedback: [
      [
        'En Private DNS-link gjelder privat oppløsning i relevante VNet, ikke delegasjon for offentlige klienter.',
        'Azure DNS er ikke en domeneregistrar. Det eksisterende eierskapet og registratorprosessen må brukes.',
        'Riktig type endring under premissene. TTL/cache og kontrollert overgang bør vurderes i virkelig drift; ingen live DNS endres her.',
      ],
      [
        'Riktig privat mekanisme, men oppgaven gjelder offentlige klienter og NS-delegasjon. En intern navneoppgave ville hatt andre krav.',
        'Riktig årsak. Navnet i en opprettet zone er ikke et bevis på eierskap eller aktiv delegasjon.',
        'Riktig hostingegenskap, men en opprettet zone er ikke automatisk delegert. Eierskap og delegasjon må håndteres separat.',
      ],
    ],
  },
  nw10: {
    title: 'Behold et klientnavn',
    problem:
      'Klientene bruker reports.training.example. Tjenesten flytter mellom verter, men det forvaltede kanoniske navnet service.training.example skal være stabilt. Teamet ønsker at klientnavnet følger dette navnets A-record.',
    premises: [
      'Dette er et ikke-apex-navn uten andre records på samme navn.',
      'Den kanoniske A-recorden forvaltes separat og er korrekt.',
      'Oppgaven gjelder aliasrelasjonen, ikke endring av nettverkstilgang.',
    ],
    decisions: [
      'Bruk CNAME fra reports til service; la oppslaget fortsette mot navnets forvaltede A-record.',
      'Bruk CNAME fra reports direkte til serverens nåværende IPv4-adresse.',
      'Opprett peering mellom klientens og tjenerens VNet, og bruk reports som navn på peering-forbindelsen.',
    ],
    reasons: [
      'TTL avgjør hvor lenge en DNS-record kan caches før en resolver må be om den på nytt; dette påvirker synligheten av senere oppdateringer.',
      'Peering kan gi privat kommunikasjon mellom to virtuelle nettverk.',
      'CNAME peker til et DNS-navn; en videre record må løses før klienten kjenner IP-adressen.',
    ],
    decisive:
      'Kravet er et navnealias som følger et annet navns adresse. Det er forskjellig fra en direkte A-record og fra en nettverksforbindelse.',
    feedback: [
      [
        'Riktig aliasretning og videre oppslag. Ved zone-apex eller samtidige andre recordtyper må et annet dokumentert design vurderes.',
        'CNAME-målet er et navn, ikke en IPv4-literal. En direkte IPv4-mapping ville vært en A-record med annet vedlikeholdsansvar.',
        'Peering kobler nettverk; den oppretter ikke dette DNS-aliaset.',
      ],
      [
        'TTL er relevant for oppdateringsforsinkelse/cache, men forklarer ikke hvorfor aliaset følger et annet navns A-record. Modellens DNS-cache er ikke simulert.',
        'Riktig nettverksegenskap, men den oppretter ikke navnealiaset. Den ville vært relevant dersom nettverksveien manglet.',
        'Riktig årsakskjede. Et ugyldig mål eller en løkke ville hindret et fullført navnesvar.',
      ],
    ],
  },
  nw11: {
    title: 'Egendefinert oppløsning',
    problem:
      'En VM bruker organisasjonens egne DNS-servere. Dens VNet er linked til en Azure Private DNS-zone, men de egne serverne har ingen passende videresending til en resolver som kan løse zonen.',
    premises: [
      'Recorden finnes i den private zonen.',
      'Teamet skal beholde egendefinert DNS.',
      'En faktisk fungerende forwarding-/resolverstrategi er ikke konfigurert.',
    ],
    decisions: [
      'Behold klientenes DNS-oppsett, og bruk VNet-linken som grunnlag for at de egne DNS-serverne nå kan løse zonen.',
      'Etabler og verifiser videresending fra egne DNS-servere til en resolver som kan løse zonen.',
      'Flytt VM-en og Private DNS-zonen til samme Resource group slik at navneoppslaget administreres fra ett felles scope.',
    ],
    reasons: [
      'Klienten spør de konfigurerte DNS-serverne. En VNet-link lager ingen manglende videresendingsregel hos disse serverne.',
      'Resource groups gir relaterte ressurser et felles scope for administrasjon, livssyklus og anvendelse av relevante styringsregler.',
      'Autoregistration kan vedlikeholde VM-records i en privat zone for et linked registration-VNet.',
    ],
    decisive:
      'Resolvervalget er et reelt trinn. En korrekt zone og VNet-link kan ikke erstatte manglende forwarding hos egendefinert DNS.',
    feedback: [
      [
        'En link overstyrer ikke klientens custom DNS-oppsett. Med Azure-provided resolver ville linkens rolle vært annerledes.',
        'Riktig undersøkelse og teknisk tiltak, for eksempel kvalifisert Private Resolver/forwarding med nødvendige nettverksforutsetninger. Ingen resolver opprettes i simulatoren.',
        'Resource group-medlemskap bestemmer ikke klientens DNS-spørsmål eller servernes videresending. En management group er dessuten et annet, overordnet administrativt scope.',
      ],
      [
        'Riktig årsak: følg faktisk spørringsvei og kvalifiser hver resolverforutsetning.',
        'Riktig management-egenskap, men den bestemmer ikke klientens resolvervalg eller forwarding.',
        'Autoregistration er relevant for record-livssyklus, men recorden finnes allerede. Den manglende oppløsningsveien hos custom DNS består.',
      ],
    ],
  },
  nw12: {
    title: 'Et korrekt svar fra navnetjenesten',
    problem:
      'Et kontrollert konseptscenario har riktig DNS-svar og deklarert nettverksvei til riktig server. Serveren returnerer avslag fordi klientens applikasjonsrolle mangler.',
    premises: [
      'IP-adressen er kontrollert mot ment mål.',
      'Ingen navne- eller topologifeil er oppgitt.',
      'Dette er en oppgitt scenarioobservasjon, ikke en målt AzureLab-pakke.',
    ],
    decisions: [
      'Undersøk og korriger applikasjonens autorisasjon etter behov.',
      'Opprett en ny CNAME til samme server og behold rettighetene.',
      'Utvid subnettet og behold applikasjonsrollene.',
    ],
    reasons: [
      'Et utvidet, gyldig subnet kan gi flere NIC-adresser og kapasitet for nye grensesnitt når den eksisterende adresseblokken er full.',
      'DNS-svar og vei er oppgitt gyldige; det observerte avslaget gjelder klientens applikasjonsrolle.',
      'CNAME kan beholde et stabilt klientnavn ved vertsbytte ved å la en annen, separat forvaltet DNS-record angi målets aktuelle IP-adresse.',
    ],
    decisive:
      'Problemet er et oppgitt autorisasjonsavslag. Ikke endre fungerende DNS eller adressering uten en relatert årsak.',
    feedback: [
      [
        'Riktig problemområde. Least privilege og reelle tilgangskrav må fortsatt styre endringen; det er ikke en anbefaling om å gi alle full tilgang.',
        'Aliaset peker til samme mål og endrer ikke klientens approlle. Det ville vært relevant hvis navnerelasjonen var problemet.',
        'Flere adresser retter ikke manglende approlle. Det ville vært relevant ved reell adressekapasitetsmangel.',
      ],
      [
        'Riktig ved adressekapasitetsmangel, men scenarioet dokumenterer allerede mål og vei. Flere adresser endrer ikke den manglende approllen.',
        'Riktig: lokaliser årsaken til den delen av kjeden som faktisk feiler.',
        'Riktig aliasbruk ved navneendring, men her er navnet korrekt og autorisasjonen avvist. DNS overfører ingen rettigheter.',
      ],
    ],
  },
} as const;

/** P07 original manuscript, authored after official source review 2026-10-29. */
export const connectivityNb = {
  partALink: 'Networking Part A · VNet, subnet, peering og DNS',
  partASummary: 'Se uendrede Part A-resultater',
  partAContext:
    'Part A-forkunnskaper og tidligere resultater beholdes separat. Å åpne denne delen oppretter ingen ny Part B-evidence.',
  actualContext: 'Lesbar faktisk Sandbox-kontekst',
  actualBoundary:
    'Dette er eksisterende VM-/NIC-konfigurasjon fra den autoritative Sandbox. Ingen faktisk VPN, ExpressRoute, Private Endpoint, privat IP-allokering eller Part B-fullføring utledes fra den.',
  actualEmpty:
    'Ingen faktisk VM finnes ennå. Konseptmodellene trenger ingen ressursopprettelse; Part A tilbyr den eksisterende støttede inspeksjonsflyten hvis du vil undersøke en faktisk kjede.',
  actualOpen: 'Undersøk den faktiske kjeden i Part A',
  actualUnverified: 'Sandbox må avklares før faktisk kontekst kan vises.',
  title: 'Azure Networking Part B · Hybrid Connectivity & Endpoints',
  path: networkingNb.path,
  partB: 'Part B · VPN Gateway, ExpressRoute & Public/Private Endpoints',
  overview:
    'Velg en hybrid forbindelse, undersøk transport og kryptering, og følg et tjenestenavn gjennom endpoint, nettverksvei og applikasjonstilgang.',
  available:
    'Part A og Part B danner én Networking-modul. Delene beholder egne versjonerte resultater. VNet, subnet, peering og DNS fra Part A er forkunnskaper; Part B legger til VPN Gateway, ExpressRoute og public/private endpoints. Innholdsdekning er ikke eksamensberedskap.',
  prerequisites:
    'Bygger på Part A: VNet, subnet, peering, DNS og forskjellen mellom navn, nettverksvei og tilgang. Core forklarer scope og region; Compute forklarer VM/NIC. Ingen Azure-konto, VPN-klient, provideravtale eller credentials kreves i denne lokale undervisningen.',
  perspective: 'Velg forbindelses- eller endpoint-perspektiv',
  perspectives: ['Hybrid Connectivity · konsept', 'Endpoint & DNS · konsept'],
  recallGuided: 'Gjenoppta lagret Part B-oppdrag',
  pauseGuided: computeNb.pauseGuided,
  milestoneNotice: computeNb.milestoneNotice,
  summaryBoundary:
    'Part B-observasjoner er adskilt fra tidligere Part A-svar. Et modellresultat dokumenterer bare den avgrensede konfigureringen og begrunnelsen. Ingen virkelig tunnel, providerforbindelse, DNS-query, tjenestehelse eller ny XP er produsert.',
  labels: {
    ...networkingNb.labels,
    model: 'Deterministisk konseptmodell · ingen Azure-forbindelse, query eller receipt',
    return: 'Tilbake til Networking Part B',
  },
  storage: {
    ...networkingNb.storage,
    title: 'Part B-lagring må avklares',
    loading: 'Laster versjonert Networking Part B-arbeid …',
    reload: 'Last inn Part B på nytt',
    recover: 'Gjenopprett bare ugyldige Part B-data',
  },
  guided: { ...networkingNb.guided },
  assessment: {
    ...networkingNb.assessment,
    title: 'Selvstendig Connectivity-anvendelse',
    neutral:
      'Velg begrunnelsen som forklarer beslutningen under akkurat disse premissene. En sann generell egenskap er ikke alene nok til å forklare det observerte problemet.',
    intro:
      'Undersøk nye transport-, endpoint- og tilgangskrav. Velg både beslutning og teknisk begrunnelse. Tidligere Part A-resultater eller guidet Part B-arbeid blir ikke en ny selvstendig førstegangsinnlevering.',
  },
  assessmentActive:
    'Et annet Part B-forsøk er aktivt. Fortsett det låste scenarioet før du velger et nytt.',
  currentFeedback: networkingNb.currentFeedback,
  historyFeedback: networkingNb.historyFeedback,
  topics: {
    introduction: 'Fra tilkoblet nettverk til brukbar tjeneste',
    vpn: 'VPN Gateway · site, klient og VNet',
    expressroute: 'ExpressRoute · privat transport og kryptering',
    endpoints: 'Public & Private Endpoints · separate innganger',
    'private-dns': 'Private Link DNS · klientens oppslagsvei',
    hybrid: 'Hybrid Connectivity Explorer',
    explorer: 'Endpoint & DNS Explorer',
    missions: 'Guidede Connectivity-oppdrag',
    assessment: 'Selvstendig Connectivity-anvendelse',
    summary: 'Networking Part B · dokumenterte resultater',
  },
  missions: {
    choose: {
      title: 'A · Velg en hybrid forbindelsesplan',
      situation:
        'Fjordverk skal knytte fabrikknettet til et Azure VNet. Transportkravet utelukker offentlig internett, og dataene skal også være kryptert ende til ende. Leverandørtilkobling kan etableres; begge krav må behandles.',
      goal: 'CN01–02: skille riktig tilkoblingsomfang, privat transport og ende-til-ende-kryptering.',
      steps: [
        'Start eksplisitt og les de deklarerte kravene.',
        'Forutsi og kjør en site-to-site VPN med krav om privat transport.',
        'Velg ExpressRoute med provider/gateway/ruting klare, men uten tilleggskryptering; forutsi og kjør.',
        'Velg IPsec for den deklarerte ende-til-ende-beskyttelsen og kjør igjen.',
        'Forklar hvorfor én egenskap ikke oppfyller det andre kravet.',
      ],
      why: 'En kryptert internettunnel og en privat providerforbindelse løser forskjellige transport- og beskyttelseskrav.',
      where:
        'Hybrid Connectivity Explorer → transport, site/klient-omfang, krav og krypteringsvalg.',
      observe:
        'Lagret kontrast mellom VPN, ukryptert ExpressRoute og ExpressRoute med eksplisitt IPsec. Ingen tunnel eller circuit opprettes.',
      debrief:
        'VPN beskytter en tunnel over sin underliggende vei; ExpressRoute velger privat providertransport. ExpressRoute alene er ikke kryptert. Den deklarerte IPsec-beskyttelsen er et eget planvalg, ikke en faktisk konfigurasjon.',
    },
    diagnose: {
      title: 'B · Finn den manglende hybridforutsetningen',
      situation:
        'En organisasjon har planlagt ExpressRoute og en kompatibel site-to-site reserve. Nettverksteamet vil vite om manglende rute eller bortfall av providerforbindelsen fortsatt gir en dokumentert vei.',
      goal: 'CN01–02: skille circuit, rute, VPN-underlag og eksplisitt reserve fra en tegnet forbindelse.',
      steps: [
        'Start og undersøk de enkelte avhengighetene.',
        'Sett ruting til ikke klar; forutsi og kjør.',
        'Gjenopprett den deklarerte ruten og sammenlign utfallet.',
        'Undersøk et circuit-bortfall med og uten en erklært klar VPN-reserve.',
        'Forklar hvilke krav en reservevei kan oppfylle, og hvilke den ikke arver.',
      ],
      why: 'Et circuit-navn eller en krypteringsinnstilling reparerer ikke en manglende rute; en internettreserve beholder ikke et krav om ingen offentlig transport.',
      where:
        'Hybrid Connectivity Explorer → circuit, rute, tunnel, reserve og tilgangsforutsetninger.',
      observe:
        'Et lagret manglende-grunnlag-utfall etterfølges av en dokumentert vei under rettede forutsetninger. Modellen lover ingen automatisk Azure-failover eller tid.',
      debrief:
        'Provider, gateway, routing og tunnelunderlag er forskjellige avhengigheter. En korrekt deklarert VPN-reserve kan bære kryptert trafikk når circuit svikter, men oppfyller ikke samtidig et absolutt krav om privat providertransport.',
    },
    endpoint: {
      title: 'C · Undersøk to innganger til samme tjeneste',
      situation:
        'En katalog har en Approved private endpoint. Teamet antar at dette alene stenger tjenestens offentlige inngang. Samtidig må de skille nettverkstilgang fra katalogens brukerrettigheter.',
      goal: 'CN03: sammenligne public/private endpoint og tjenestens separate public network access.',
      steps: [
        'Start og undersøk den private inngangen under deklarerte forutsetninger.',
        'Behold public network access aktivert og undersøk et offentlig oppslag/endpoint.',
        'Deaktiver den offentlige inngangen i konseptmodellen og kjør det offentlige forsøket igjen.',
        'Velg riktig privat oppslag/vei og bekreft at denne inngangen vurderes separat.',
        'Forklar hvorfor en privat inngang verken er et globalt offentlig avslag eller en applikasjonsrolle.',
      ],
      why: 'Private Endpoint er en separat tjenestetilknytning; offentlig nettverkstilgang og dataautorisasjon har egne kontroller.',
      where:
        'Endpoint & DNS Explorer → valgt inngang, DNS, Private Endpoint-status og public network access.',
      observe:
        'Lagrede private/offentlige utfall viser at public access er et separat valg. Ingen tjenesteinnstilling eller Sandbox-NIC endres.',
      debrief:
        'Approved Private Endpoint kan brukes med en dokumentert privat vei, men stenger ikke automatisk public endpoint. Nettverksgodkjenning gir heller ikke rett til å lese tjenestens data.',
    },
    dns: {
      title: 'D · Finn riktig adresse, så riktig vei',
      situation:
        'En klient skal bruke en privat tjenesteinngang. DNS-perspektivet velger først offentlig adresse. Etter retting må klienten fortsatt ha privat vei og nødvendige applikasjonsrettigheter.',
      goal: 'CN04: skille resolver-synlighet, adressevalg, endpoint, nettverksvei og autorisasjon.',
      steps: [
        'Start og undersøk det offentlige eller manglende DNS-svaret for privat hensikt.',
        'Rett den deklarerte private zone-/resolver-synligheten og kjør med manglende privat vei.',
        'Les at riktig privat adresse nå er kjent, mens forbindelsesgrunnlaget fortsatt mangler.',
        'Deklarer veien, men avvis applikasjonsrettigheten; kjør og sammenlign.',
        'Forklar hvilket lag som må korrigeres i hvert tilfelle.',
      ],
      why: 'DNS velger hvor forsøket sendes. Oppslaget kan ikke etablere en rute, godkjenne en Private Endpoint eller gi en bruker datarettighet.',
      where:
        'Endpoint & DNS Explorer → DNS-perspektiv, resolver, zone-link/forwarding, vei og appautorisasjon.',
      observe:
        'Lagret feil eller manglende adresse etterfølges av riktig privat adresse uten tilstrekkelig vei. Senere tilgangsutfall holdes adskilt.',
      debrief:
        'Et privat DNS-svar er navnebevis i modellen. Tilkoblingen trenger fortsatt riktig endpoint-status, privat nettverksvei og applikasjonsautorisasjon. Ingen faktisk resolver eller tjeneste er kontaktet.',
    },
  },
  causal: {
    choose: [
      'Privat providertransport og ende-til-ende-kryptering er separate krav; ExpressRoute trenger et eget passende krypteringslag.',
      'En internettunnel er privat providertransport fordi nyttelasten er kryptert.',
      'ExpressRoute krypterer automatisk alle data gjennom tjenestens navn.',
    ],
    diagnose: [
      'En circuit-registrering beviser at alle ruter og tjenester virker.',
      'En VPN-reserve arver automatisk providerforbindelsens private transportkrav.',
      'Underlag, rute og tilgang må være dokumentert; en deklarert reserve har sitt eget transport- og kravgrunnlag.',
    ],
    endpoint: [
      'Approved Private Endpoint gir alle brukere en applikasjonsrolle.',
      'Private Endpoint, public network access og applikasjonsautorisasjon er separate kontroller.',
      'En privat DNS-record deaktiverer automatisk public network access.',
    ],
    dns: [
      'Riktig DNS-adresse, endpoint-status, nettverksvei og applikasjonsrettighet må undersøkes som separate lag.',
      'Et privat DNS-svar viser at brukeren er autorisert og tjenesten har svart.',
      'En offentlig adresse kan alltid brukes som privat endpoint hvis vertsnavnet er riktig.',
    ],
  },
  milestone: {
    choose: {
      title: 'Privat transport er ikke automatisk kryptering',
      text: 'Den lagrede sammenligningen skiller en privat providervei fra ende-til-ende-kryptering. ExpressRoute uten et eget beskyttelseslag oppfyller ikke et eksplisitt krypteringskrav. Ingen virkelig circuit eller nøkkel er konfigurert.',
    },
    diagnose: {
      title: 'En reserve har sine egne forutsetninger',
      text: 'Det lagrede utfallet bygger på erklært tunnelunderlag, gateway, routing og reserve. En VPN-reserve er kryptert, men er ikke den samme private providertransporten. Modellen verifiserer ingen Azure-failover eller tjenestehelse.',
    },
    endpoint: {
      title: 'Den private inngangen stenger ikke den offentlige',
      text: 'Den lagrede kontrasten vurderer public network access separat fra Approved Private Endpoint. Ingen av inngangene gir automatisk datarettighet. Alle endringer er konseptuelle.',
    },
    dns: {
      title: 'Privat adresse funnet; veien må fortsatt finnes',
      text: 'Det lagrede oppslaget gir en privat eksempeladresse mens nettverksveien fortsatt mangler. DNS har valgt destinasjon, men oppretter ingen rute og gir ingen applikasjonsrolle.',
    },
  },
  model: {
    hybrid: 'Hybrid Connectivity Explorer · deklarerte forutsetninger',
    endpoint: 'Endpoint & DNS Explorer · navn, inngang og tilgang',
    labels: {
      transport: 'Transportvalg',
      vpnMode: 'VPN-omfang',
      demand: 'Hvem skal kobles til?',
      providerReady: 'Providerforbindelse er klar',
      gatewayReady: 'Riktig Azure-gateway er klar',
      tunnelReady: 'VPN-underlag og tunnel er klare',
      routeReady: 'Hybridrute er erklært klar',
      circuitUp: 'ExpressRoute circuit er oppe',
      backupReady: 'Kompatibel S2S VPN-reserve er erklært klar',
      requirePrivate: 'Krav: unngå offentlig internetttransport',
      requireEncryption: 'Krav: kryptering mellom erklærte tunnelendepunkter',
      direct: 'ExpressRoute Direct med MACsec-støtte er forutsatt',
      encryption: 'Ekstra beskyttelse på ExpressRoute',
      access: 'Deklarert hybridtilgang',
      endpoint: 'Tilsiktet tjenesteinngang',
      dns: 'Klientens DNS-resultat',
      resolver: 'Resolverperspektiv',
      linked: 'Klientens VNet har riktig private zone-link',
      forwarding: 'Fungerende resolver-/forwardingkjede er erklært',
      privateState: 'Private Endpoint-tilstand',
      path: 'Deklarert vei til valgt inngang',
      publicAccess: 'Tjenestens public network access',
      networkRule: 'Nettverkspolicy for den valgte inngangen',
      appAuth: 'Applikasjonsautorisasjon',
      response: 'Tjenestens responsforutsetning',
    },
    options: {
      transport: ['VPN Gateway', 'ExpressRoute'],
      vpnMode: ['Site-to-site', 'Point-to-site', 'VNet-to-VNet'],
      demand: ['Et helt lokalt nettverk', 'Én individuell klient', 'Et annet Azure VNet'],
      encryption: ['Ingen tilleggskryptering', 'IPsec ende til ende', 'MACsec på Direct-link'],
      access: ['Erklært tillatt', 'Erklært avvist', 'Ukjent'],
      endpoint: ['Public endpoint', 'Private Endpoint'],
      dns: ['Offentlig adresse', 'Privat adresse', 'Intet DNS-svar', 'Feil adresse'],
      resolver: ['Azure-provided DNS', 'Egendefinert / on-premises DNS'],
      privateState: ['Fraværende', 'Pending', 'Approved'],
      path: ['Deklarert vei finnes', 'Ingen vei', 'Ukjent'],
      networkRule: ['Erklært tillatt', 'Erklært avvist', 'Ukjent'],
      appAuth: ['Erklært autorisert', 'Erklært avvist', 'Ukjent'],
      publicAccess: ['Aktivert for alle nettverk', 'Deaktivert', 'Utvalgte nettverk'],
      response: ['Respons antas', 'Ukjent'],
    },
    resultLabel: {
      transportReady: 'Transportavhengigheter klare',
      modeFits: 'Omfang passer klientbehov',
      privateTransport: 'Transport uten offentlig internett',
      encrypted: 'Kryptering mellom erklærte tunnelendepunkter',
      linkEncrypted: 'Kun fysisk link kryptert',
      usedBackup: 'Deklarert VPN-reserve brukes',
      knownPath: 'Logisk vei dokumentert',
      permitted: 'Deklarert tilgang tillatt',
      requirementsMet: 'Alle eksplisitte modellkrav dekkes',
      resolved: 'DNS gir en adresse',
      endpointMatch: 'Adresse velger tilsiktet inngang',
      endpointReady: 'Endpoint klar for valgt subressurs',
      endpointControls: 'Inngangens deklarerte nettverkskontroller',
      applicationAllowed: 'Deklarert applikasjonsrettighet',
      networkAllowed: 'Samlet deklarert nettverksgrunnlag',
      authorized: 'Samlet deklarert tilgang',
      responseAssumed: 'Tjenestesvar er uttrykkelig antatt',
    },
    yes: 'Ja',
    no: 'Nei',
    unknown: 'Ukjent / ikke dokumentert',
    noRun: 'Ingen lagret modellkjøring ennå. Undersøk forutsetningene, forutsi og kjør eksplisitt.',
    draftChanged:
      'Utkastet er endret. Resultatet nedenfor gjelder fortsatt den sist lagrede kjøringen.',
    snapshot: 'Lagrede kjøringer i dette oppdraget',
    outcome: ['Ikke oppfylt', 'Delvis dokumentert', 'Alle deklarerte krav dekket'],
    stageLabels: [
      'Klient',
      'DNS-oppslag',
      'Adresse / endpoint',
      'Nettverksvei',
      'Nettverkstilgang',
      'Applikasjonsrettighet',
      'Antatt respons',
    ],
    actualEndpoint: 'DNS-valgt faktisk inngang i modellen',
    tunnelEncryption: 'Kryptert tunnel',
    transportMedium: 'Transportunderlag',
    microsoftTransport: 'Microsofts nettverk · VNet-to-VNet',
    onPrem: 'Lokalt nettverk / klient',
    provider: 'Connectivity provider',
    gateway: 'Azure gateway',
    vnet: 'Azure VNet',
    client: 'Klient / vertsnavn',
    service: 'Støttet tjeneste',
    ipsec: 'IPsec-tunnel',
    privateTransport: 'Privat providertransport',
    publicTransport: 'Offentlig internettunderlag',
    linkOnly: 'MACsec beskytter Direct-linken',
    noRuntime:
      'Dette er erklært logikk. Tunnelkryptering gjelder de erklærte klient-/gatewayendepunktene, ikke automatisk TLS helt til tjenesteprosessen. Ingen pakke, DNS-query, autentisering eller tjenestesvar er målt.',
  },
  sections: {
    introduction: {
      title: 'Fire forskjellige spørsmål før et program kan bruke tjenesten',
      paragraphs: [
        'Fjordverk har et fabrikknett, ingeniører på reise og en katalogtjeneste i Azure. Fabrikken trenger en nettverkstilknytning, den reisende trenger en klientforbindelse, og begge må velge riktig inngang til katalogen. Disse behovene er beslektet, men løses ikke av én nettverksknapp.',
        'Fra Part A kjenner du VM → NIC → subnet → VNet og DNS-navn som blir til en adresse. Et VNet kobler ikke automatisk fabrikken til Azure. Peering mellom Azure-nettverk gir heller ikke en VPN-klient til en bærbar PC. Vi legger derfor til transport, tunnel og tjenesteinngang uten å endre betydningen av tidligere observasjoner.',
        'Undersøk fire spørsmål i rekkefølge: Hvordan kommer klienten til Azure? Hvilken adresse velger DNS? Hvilket endpoint mottar forsøket? Hvilke nettverks- og applikasjonskontroller tillater handlingen? En feil på det siste trinnet blir ikke reparert ved å endre navnet som allerede ga riktig adresse.',
        'De nye utforskerne bruker navngitte eksempelnettverk, private dokumentasjonsforutsetninger og deterministiske regler. En grønn modellstatus betyr at disse erklærte kravene samsvarer. Den betyr ikke at Azure har opprettet en forbindelse, at en bruker er logget inn eller at en tjeneste faktisk svarte.',
      ],
      terms: [
        ['Hybrid tilkobling', 'En forbindelse mellom lokale nettverk eller klienter og Azure.'],
        ['Underlag', 'Nettverket forbindelsen bruker for å frakte trafikken.'],
        ['Endpoint', 'Tjenestens inngang der et klientforsøk kan mottas.'],
      ],
      example:
        'En klient får en privat katalogadresse, men kontoret mangler en rute til VNet-et. Adressevalget kan være riktig selv om forbindelsen ikke kan gjennomføres. Undersøk transporten fremfor å opprette en ny DNS-record.',
      limit:
        'Ingen modellkonfigurasjon blir en Sandbox-ressurs, teknisk receipt eller ny XP. Tidligere Part A-resultater blir ikke automatisk Part B-førsteinnleveringer.',
    },
    vpn: {
      title: 'VPN Gateway knytter et bestemt omfang til et VNet',
      paragraphs: [
        'Et Virtual Private Network bruker en kryptert tunnel over et underliggende nettverk. Krypteringen beskytter trafikken mellom tunnelens ender; underlaget må fortsatt kunne frakte den. Azure VPN Gateway er en type virtual network gateway som terminerer støttede VPN-forbindelser ved et Azure VNet.',
        'Site-to-site kobler et lokalt VPN-apparat til Azure-gatewayen med IPsec/IKE over offentlig internett. Det passer når et kontor eller datasenter trenger nettverkstilknytning. Point-to-site starter på én støttet klientmaskin, for eksempel en reisende ingeniørs bærbare PC. Den trenger ikke et VPN-apparat i hjemmenettverket; klientprofil, protokoll og autentisering må likevel være kompatible.',
        'Point-to-site støtter forskjellige protokoll- og klientkombinasjoner som OpenVPN, IKEv2 og SSTP. OpenVPN og SSTP er TLS-baserte, mens IKEv2 bruker IPsec; støttet klient og autentisering må passe den valgte protokollen. Autentisering kan omfatte sertifikat, Microsoft Entra ID eller RADIUS under dokumenterte kompatibilitetskrav. Ikke bruk den forenklede regelen at enhver VPN alltid bruker en delt nøkkel. Dette kurset konfigurerer ingen bruker, nøkkel eller klient.',
        'VNet-to-VNet kan bruke VPN-gatewayer og en IPsec/IKE-tunnel mellom Azure-nettverk. Produktdokumentasjonen beskriver denne trafikken over Microsofts nettverk. Det skiller seg fra det lokale nettverkets internettransport, og fra VNet Peering, som ikke krever en VPN-gateway for den direkte forbindelsen. Et krav om en bestemt kryptert gateway-tunnel kan derfor gi et annet valg enn vanlig peering.',
        'Gatewayen trenger en dedikert GatewaySubnet og riktige adresse-, rute- og enhetsforutsetninger. Ikke plasser den i det ordinære VM-subnettet bare fordi det allerede finnes. Flere tunneler deler gatewaykapasiteten; SKU, region, features og kompatibilitet må kontrolleres ved virkelig design. Den daterte produktoversikten anbefaler AZ-SKU-er og omtaler migrering av eldre VpnGw1–5; vi velger ingen live SKU eller måler ytelse.',
      ],
      terms: [
        ['Site-to-site', 'Tunnel mellom et lokalt nettverks VPN-enhet og Azure VPN Gateway.'],
        ['Point-to-site', 'Klientinitiert VPN fra én maskin til VNet-et.'],
        ['IPsec/IKE', 'Protokoller for beskyttet IP-trafikk og oppsett av sikkerhetsforbindelsen.'],
        [
          'GatewaySubnet',
          'Dedikert subnet for VNet-gatewayens ressurser, adskilt fra ordinære VM-subnett.',
        ],
      ],
      example:
        'Et lite servicekontor har flere arbeidsstasjoner som skal bruke et privat Azure-nett. Site-to-site kan knytte nettverket til Azure. En enkelt rådgiver på reise kan i stedet bruke point-to-site; å installere én klient kobler ikke automatisk hele servicekontorets nettverk.',
      limit:
        'Kryptering reparerer ikke et dødt internetunderlag, manglende ruting eller avvist applikasjonsrolle. Ingen virkelig tunnel, klientautentisering eller gateway opprettes her.',
    },
    expressroute: {
      title: 'Velg privat transport og beskyttelse hver for seg',
      paragraphs: [
        'ExpressRoute utvider et lokalt nettverk mot Microsofts cloud gjennom privat tilkobling, vanligvis med en connectivity provider. Trafikken på denne forbindelsen går ikke over offentlig internett. ExpressRoute Direct er en egen tilkoblingsmulighet for passende organisasjoner; den betyr ikke at providerrollen kan ignoreres i et vanlig providerbasert design.',
        'Et circuit er en logisk forbindelse. Providerens leveranse, riktig peering, ruting og tilknytning til Azure VNet er egne avhengigheter. Azure private peering brukes for VNet-ressurser og deres adresser. Microsoft peering brukes mot kvalifiserte Microsoft-tjenester med offentlig adressering og separate krav. Disse ExpressRoute-peerings er ikke det samme som Part A VNet Peering.',
        'Privat transport kan være riktig ved krav om å unngå internett og ved behov for mer forutsigbar forbindelse. Det er ingen garanti for en bestemt hastighet, latenstid eller tilgjengelig applikasjon. Sammenlign providerens kapasitet, leveransetid, circuit-/gateway- og datakostnader, geografisk rekkevidde og driftsansvar. Global Reach forbinder lokale steder via circuits; det er ikke et annet navn på alle Premium- eller globale tjenestetilganger.',
        'ExpressRoute-trafikk er ikke kryptert som standard. Et krav om privat transport er derfor forskjellig fra et krav om kryptert nyttelast. MACsec kan beskytte den fysiske linken ved ExpressRoute Direct, men er ikke universell ende-til-ende-beskyttelse for et provider-circuit. IPsec kan brukes som et eget ende-til-ende-lag; applikasjonens TLS er også et separat beskyttelseslag.',
        'Et circuit har redundant tilkobling ved peeringstedet, men organisasjonens lokale edge, last mile og provider kan fortsatt være felles feilgrenser. En kompatibel site-to-site VPN kan planlegges som reserve for private-peering/VNet-forbindelsen. Den må ha fungerende underlag, riktige ruter og preferanser. Den er ikke en universell automatisk reserve for alle tjenester gjennom Microsoft peering.',
      ],
      terms: [
        [
          'Connectivity provider',
          'Leverandøren som bidrar med den private forbindelsen mellom organisasjonen og Microsoft.',
        ],
        [
          'Circuit',
          'Logisk ExpressRoute-forbindelse med sitt eget kapasitets- og peeringgrunnlag.',
        ],
        ['Private peering', 'ExpressRoute-rutingsdomene mot VNet-ressurser.'],
        [
          'MACsec og IPsec',
          'Beskyttelse med forskjellig scope: fysisk link kontra en IP-tunnel mellom endepunkter.',
        ],
      ],
      example:
        'En organisasjon har allerede privat providertransport, men må beskytte data helt fra lokal gateway til Azure VNet. Å peke på ExpressRoute-navnet eller kun en fysisk MACsec-link dekker ikke alene det uttrykkelige ende-til-ende-kravet; et passende krypteringslag må inngå i planen.',
      limit:
        'Modellen evaluerer erklærte avhengigheter, ikke providerprovisjonering, BGP, live priser eller failovertid. Privat vei gir ingen automatisk brukerautorisasjon eller garanti om applikasjonssvar.',
    },
    endpoints: {
      title: 'En offentlig adresse er ikke en offentlig datatillatelse',
      paragraphs: [
        'Et public endpoint er en tjenesteinngang med offentlig adressering. Det gjør inngangen mulig å nå fra relevante nettverk under dens innstillinger; det betyr ikke at alle anonymt kan bruke dataene. En nettverksregel kan begrense kildene, og tjenesten kan kreve innlogging og en separat datarettighet.',
        'Et Private Endpoint er en nettverksgrensesnittressurs i et VNet med en privat IP fra subnettet, tilknyttet en støttet tjeneste eller subressurs gjennom Azure Private Link. Tjenesten har fortsatt sitt eget managed driftsmiljø. Den er ikke blitt en VM inne i subnettet, og ett endpoint betyr ikke automatisk privat tilgang til alle tjenestens underfunksjoner.',
        'Private Endpoint-forbindelsen må blant annet peke mot riktig støttet subressurs og ha Approved status. Pending betyr at godkjenningen mangler; DNS som viser en adresse gjør ikke Pending til Approved. Konsumerende klienter kan komme fra VNet-et, passende sammenkoblede VNet eller korrekt tilknyttede lokale nettverk, men må ha de nødvendige rutings- og tilgangsforutsetningene.',
        'Tjenestens public network access er et separat innstillingsområde. Å opprette Private Endpoint stenger ikke automatisk den offentlige inngangen. Azure Storage dokumenterer dette eksplisitt: kontroller public endpoint separat hvis kravet er bare privat tilgang. Dets offentlige firewall er heller ikke en universell regelmotor for alle private forbindelser eller alle Azure-tjenester.',
        'Nettverksgodkjenning og applikasjonsautorisasjon svarer på forskjellige spørsmål. Et Approved endpoint kan fortsatt avvise en bruker uten riktig rolle. Omvendt kan en gyldig bruker bli stoppet før applikasjonen fordi den offentlige inngangen er deaktivert eller en valgt nettverkspolicy avviser kilden. Identitetskontroll overstyrer ikke uten videre nettverkskontrollen.',
      ],
      terms: [
        [
          'Public endpoint',
          'Tjenesteinngang med offentlig IP-adressering og sine egne tilgangsforutsetninger.',
        ],
        [
          'Private Endpoint',
          'Privat NIC-tilknytning fra et konsumerende VNet til en støttet Private Link-tjeneste/subressurs.',
        ],
        [
          'Approved',
          'Tjenestetilknytningen er godkjent; dette gir ikke automatisk datarettighet til alle brukere.',
        ],
        ['Public network access', 'Tjenestens separate styring av den offentlige inngangen.'],
      ],
      example:
        'Et offentlig support-API krever en innlogget bruker med leserolle og en tillatt kilde. Offentlig adresse og navneoppslag kan være riktige selv når API-et avviser anonym bruk. Et privat endpoint til en annen tjeneste ville ikke løst det manglende brukersamtykket.',
      limit:
        'Tjenestestøtte, SKU, region, subressurs og policyfunksjoner varierer. Eksempel-NIC og endpoint-adresser finnes bare i konseptmodellen. Ingen Private Link-ressurs eller falsk Portal-knapp legges til.',
    },
    'private-dns': {
      title: 'Klientens DNS-perspektiv avgjør hvilken inngang den forsøker',
      paragraphs: [
        'En tjeneste kan beholde sitt vanlige hostname selv om klienten skal bruke en privat inngang. DNS-oppslaget kan følge en CNAME-kjede til en private-link-sone og få en privat A-record. Recorden må vise riktig endpoint-adresse for klientens perspektiv; en offentlig CNAME eller et vertsnavn alene beviser ingen privat tilkobling.',
        'Med Azure-provided DNS kan en riktig private DNS zone og relevant VNet-link gi klienten privat oppløsning. En sone som bare er linket til ett annet VNet blir ikke automatisk synlig i alle peered nettverk. Bruk samme relevante sone og riktige klientlinker i et slikt design, fremfor å skape konkurrerende navnerom uten forklaring.',
        'En lokal klient eller et VNet med egen DNS trenger en komplett, fungerende oppslagsvei. En Azure DNS Private Resolver eller en riktig plassert DNS-forwarder kan inngå. Den lokale serveren må kunne nå løsningen, og videresendingen må følge tjenestens anbefalte navnestruktur. Å skrive Azure sin interne resolveradresse på en klient uten denne veien gir ikke magisk navneoppløsning.',
        'Bruk tjenestens normale hostname og støttede forbindelsesinnstillinger. Ikke erstatt alle connection strings med privatelink-alias eller en rå privat IP: tjenestens forventede vertsnavn, sertifikat og tjenestespesifikke oppsett kan kreve at det vanlige navnet beholdes. Private DNS-konfigurasjon og subressursnavn må kontrolleres mot den aktuelle tjenesten.',
        'Når DNS nå gir riktig privat adresse, begynner et annet spørsmål: finnes en rute og en godkjent riktig endpoint-forbindelse, tillater nettverkskontrollene kilden, og har applikasjonen lov til å utføre handlingen? DNS reparerer ingen av disse lagene. Feilsøk det første trinnet som ikke har tilstrekkelig grunnlag, og behold tidligere korrekte observasjoner.',
      ],
      terms: [
        ['DNS-perspektiv', 'De navnesvarene klientens faktiske resolverkonfigurasjon kan gi.'],
        [
          'Private zone-link',
          'Knytter en privat DNS-zone til et VNet for den støttede oppløsningsveien.',
        ],
        [
          'Forwarding',
          'Videresending av navnespørsmål til en resolver som kan svare for riktig navnerom.',
        ],
        [
          'Subressurs',
          'Den konkrete tjenestedelen endpoint-et gjelder, for eksempel en støttet datainngang.',
        ],
      ],
      example:
        'Et kontor får offentlig adresse til en tjeneste som bare tillater den private inngangen. Etter riktig forwarding får samme normale hostname privat adresse. Hvis hybridruten fortsatt mangler, er DNS-rettingen reell, men forbindelsen er fortsatt ikke dokumentert.',
      limit:
        'Ingen reell resolver, cache, TTL, DNS-pakke eller hostname-kall kjøres. Offentlige og private eksempeladresser er modellerte, ikke allokeringer fra den faktiske Sandbox.',
    },
    hybrid: {
      title: 'Les transportens avhengigheter og feilgrenser',
      paragraphs: [
        'Hybrid Connectivity Explorer viser et lokalt nettverk eller en klient, et internetunderlag eller en providervei, gateway og VNet. VPN-omfanget må passe behovet: site, bruker eller annet VNet. Et ExpressRoute-circuit trenger ikke den samme tunnelen som en internet-VPN, men har egne provider-, peering- og rutingsforutsetninger.',
        'Før kjøring velger du hvilke krav organisasjonen faktisk stiller. «Ingen offentlig internetttransport» og «kryptering ende til ende» vises separat. VPN kan være kryptert og samtidig feile det første kravet. ExpressRoute kan være privat og samtidig feile det andre. MACsec vises som linkbeskyttelse i et Direct-scenario, ikke som et løfte om ende-til-ende-kryptering.',
        'Undersøk deretter et avbrudd. Et circuit-bortfall med en erklært kompatibel VPN-reserve kan gi en annen logisk vei under modellens regler. Hvis routing ikke er klar, eller en felles lokal avhengighet mangler, er det ikke nok at reservens navn er valgt. Hvilket krav som fortsatt dekkes må vurderes etter veiendringen.',
        'Forutsi før du kjører. Resultatet er bundet til de lagrede forutsetningene; hvis du senere endrer utkastet, tilhører det gamle resultatet fortsatt den gamle konfigurasjonen. En årsaksforklaring er nødvendig for guidet fullføring. Å se en animasjon, åpne en side eller klikke en transport gir ingen uavhengig vurderingskreditt.',
      ],
      terms: [
        [
          'Feilgrense',
          'En avhengighet eller et område der ett problem kan påvirke flere ellers separate forbindelser.',
        ],
        [
          'Deklarert reserve',
          'En uttrykkelig forutsatt kompatibel og klar alternativ vei, ikke en automatisk opprettet forbindelse.',
        ],
        [
          'Modellkrav',
          'De eksplisitte begrensningene og målene akkurat den lagrede kjøringen vurderer.',
        ],
      ],
      example:
        'To forbindelser deler samme kontorrouter. En feil i routeren kan ramme begge, selv om én vei er ExpressRoute og den andre er VPN. Vurder ende-til-ende-uavhengighet fremfor bare antall linjer i figuren.',
      limit:
        'Dette er en avgrenset regelmodell. Den regner ikke ekte BGP-valg, gateway-SKU-ytelse, rutekonvergens, kapasitet eller Azure-SLA.',
    },
    explorer: {
      title: 'Følg navnet gjennom adressen til en tillatelse',
      paragraphs: [
        'Endpoint & DNS Explorer lar deg undersøke hvert trinn: klientens hensikt, navnesvar, faktisk valgt inngang, deklarert nettverksvei, endpoint-status og nettverkskontroll, applikasjonsautorisasjon og antatt tjenesterespons. En korrekt adresse betyr bare at navnet har gitt et relevant mål.',
        'Velger DNS en offentlig adresse mens hensikten er privat tilkobling, skal modellen vise begge fakta. Oppslaget kan ha lykkes selv om det valgte endpoint-et ikke samsvarer med kravet. Public network access og nettverkspolicy kan deretter stoppe forsøket, uavhengig av at et Private Endpoint eksisterer.',
        'Velger DNS riktig privat adresse, undersøker modellen Approved-forutsetningen og den erklærte veien. En Pending-forbindelse, manglende vei og avvist applikasjonsrolle er forskjellige årsaker. Ikke vis alle som «DNS-feil», og ikke kall alle vellykkede navnesvar en vellykket applikasjonsforbindelse.',
        'Også tjenesteresponsen er en separat antakelse. Med riktige adresser, nettverkskontroller og rettigheter kan en faktisk tjeneste fortsatt være utilgjengelig. Modellen kan bare vise den responsen du uttrykkelig har forutsatt. Tabellen gjør kjeden lesbar uten farger eller grafiske piler.',
      ],
      terms: [
        [
          'Tilsiktet inngang',
          'Det public/private endpoint-et organisasjonens krav faktisk peker mot.',
        ],
        [
          'Valgt inngang',
          'Endpoint-et klientens modellerte navnesvar faktisk retter forsøket mot.',
        ],
        [
          'Autorisering',
          'Tjenestens avgjørelse om denne identiteten kan utføre den ønskede datahandlingen.',
        ],
      ],
      example:
        'En klient har korrekt privat adresse og tillatt nettverksvei, men rollen gir ikke skriverettighet. Å rette en DNS-record igjen løser ikke skriveretten. Behold det dokumenterte navnegrunnlaget og undersøk applikasjonsautorisasjonen.',
      limit:
        'DNS, policy og tjenesterespons er deklarerte fixtures. Ingen operativ nettverkshelse, identitet, faktisk tilgang eller produksjonsendring er validert.',
    },
  },
} as const;

/** Original P07 cases. Stable IDs and authored decision/reason relations; not an exam bank. */
export const connectivityItemsNb = {
  nc01: {
    title: 'Rådgiver på et skiftende nettverk',
    problem:
      'En rådgiver arbeider fra hotell og hjemmekontor. Bare den bærbare klienten skal bruke et privat Azure VNet. Organisasjonen kan installere en støttet klientprofil, men kontrollerer ikke en VPN-enhet på hvert lokalt nett.',
    premises: [
      'Klientens operativsystem og autentiseringsmetode kan matches med en støttet Azure-konfigurasjon.',
      'Internettforbindelse er tilgjengelig.',
      'Det er ikke et krav å koble hotellnettets øvrige enheter til Azure.',
    ],
    decisions: [
      'Bestill en ExpressRoute-circuit for hvert av hotellnettene brukeren besøker.',
      'Bruk site-to-site fra en sentral kontorrouter og anta at rådgiverens eksterne klient følger denne forbindelsen.',
      'Planlegg point-to-site fra den støttede klienten til Azure VPN Gateway.',
    ],
    reasons: [
      'En providerbasert forbindelse kan utvide et kontrollert organisasjonsnettverk mot Microsoft under leverandørens leveransekrav.',
      'Klientinitiert VPN passer én ekstern maskin uten krav om et lokalt VPN-apparat.',
      'En gateway kan dele kapasitet mellom flere kompatible tunneler til forskjellige steder eller klienter.',
    ],
    decisive:
      'Det er én flyttbar klient som skal kobles til. Point-to-site kan starte fra denne klienten; et kontors tunnel kobler ikke automatisk inn en ekstern hotellklient.',
    feedback: [
      [
        'Dette kan passe et kontrollert, fast lokalt nett med provideravtale. Her flytter én klient seg mellom nett organisasjonen ikke eier; circuit per hotell løser ikke klientkravet hensiktsmessig.',
        'Site-to-site kan knytte kontornettet til Azure, men rådgiveren befinner seg ikke på det nettet i premisset. En egen dokumentert klientvei måtte fortsatt etableres.',
        'Riktig under de oppgitte kompatibilitetsforutsetningene. P2S starter på klienten og krever ikke et VPN-apparat på hvert hotell.',
      ],
      [
        'Dette er en egenskap ved providertransport, men det gjør ikke skiftende hotellnett til kontrollerte lokale steder med circuit-leveranse.',
        'Riktig mekanisme: klientomfanget passer oppgaven. Protokoll, operativsystem og autentisering må fortsatt være kompatible.',
        'Kapasitetsdeling er relevant ved dimensjonering, men avgjør ikke hvordan en ekstern enkeltklient blir tilknyttet i dette tilfellet.',
      ],
    ],
  },
  nc02: {
    title: 'Kontoret skal kobles til som nettverk',
    problem:
      'En filial har tretti arbeidsstasjoner og en kompatibel VPN-enhet. Det lokale nettverket skal nå et Azure VNet gjennom en kryptert forbindelse. Internett kan brukes, og kravet gjelder hele filialnettet fremfor personlige klientprofiler.',
    premises: [
      'Riktige, ikke-overlappende adresseområder og nødvendige ruter kan planlegges.',
      'Filialen har et tilgjengelig internetunderlag.',
      'Ingen policy krever privat providertransport.',
    ],
    decisions: [
      'Planlegg en site-to-site-forbindelse mellom filialens VPN-enhet og Azure VPN Gateway.',
      'Installer én point-to-site-profil på en arbeidsstasjon og bruk den som dokumentasjon for hele filialens tilknytning.',
      'Opprett VNet Peering mellom filialens fysiske router og Azure VNet-et.',
    ],
    reasons: [
      'En individuell klient kan starte sin egen VPN-forbindelse med en kompatibel profil.',
      'Azure VNet Peering etablerer en direkte relasjon mellom virtuelle Azure-nettverk uten en VPN-gateway for selve peeringforbindelsen.',
      'Site-to-site kobler filialens VPN-enhet til Azure med IPsec/IKE og lar denne enheten være tunnelmotpart for nettverket.',
    ],
    decisive:
      'Kravet gjelder et helt lokalt nettverk med en VPN-enhet. S2S har riktig omfang; en enkelt P2S-profil eller en VNet-peering er ikke filialens nettverkstilknytning.',
    feedback: [
      [
        'Riktig under premissene. S2S knytter det lokale nettverkets enhet til Azure, mens routing og tilgang fortsatt må planlegges.',
        'P2S kan være riktig for enkelte fjernarbeidere. Én klients profil dokumenterer ikke en ferdig tilknytning for filialens øvrige arbeidsstasjoner.',
        'VNet Peering gjelder Azure VNet, ikke en vanlig fysisk filialrouter. Et annet Azure VNet kunne vært en relevant peeringmotpart.',
      ],
      [
        'Dette beskriver P2S, men forklarer ikke hvorfor hele filialens VPN-enhet skal være tunnelmotpart.',
        'Dette beskriver Azure-peering. Filialens fysiske router blir ikke et Azure VNet av å få en peeringbetegnelse.',
        'Riktig omfang og mekanisme. Internetunderlaget må fortsatt fungere, og gateway-/enhetsinnstillingene må være kompatible.',
      ],
    ],
  },
  nc03: {
    title: 'To Azure-nettverk med et tunnelkrav',
    problem:
      'To Azure VNet har ikke-overlappende områder. En revidert sikkerhetsstandard krever IPsec/IKE-beskyttelse på nettverkslaget mellom dem. Teamet sammenligner en applikasjonsbasert løsning med en gatewaybasert løsning.',
    premises: [
      'Begge VNet kan ha riktig konfigurerte kompatible gatewayer.',
      'Kravet gjelder nettverkslaget; applikasjonens TLS er et annet lag.',
      'Ingen lokal filial er med i denne forbindelsen.',
    ],
    decisions: [
      'Bruk VNet Peering og TLS i applikasjonene som organisasjonens eneste beskyttelseslag for denne forbindelsen.',
      'Planlegg en VNet-to-VNet VPN-forbindelse mellom gatewayene.',
      'Bruk en point-to-site-profil på én VM som erstatning for gatewayenes nettverk-til-nettverk-forbindelse.',
    ],
    reasons: [
      'VNet-to-VNet VPN gir en IPsec/IKE-tunnel mellom Azure VPN-gatewayer.',
      'En klientprofil gir en enkelt maskin mulighet til å starte en støttet VPN-forbindelse mot et VNet.',
      'Microsofts backbone brukes av flere Azure-forbindelser, og kan bære trafikk mellom regioner etter tjenestenes vilkår.',
    ],
    decisive:
      'VNet-to-VNet VPN følger kravet om IPsec/IKE-beskyttelse på nettverkslaget under de oppgitte gatewayforutsetningene. Peering med applikasjonens TLS beskytter et annet lag.',
    feedback: [
      [
        'Peering kombinert med TLS kan være en legitim arkitektur ved et krav om applikasjonskryptering. Her kreves IPsec/IKE på nettverkslaget; den tilbudte TLS-planen dekker et annet lag.',
        'Riktig. Gatewayene kan terminere VNet-to-VNet-tunnelen; dette hevder ingen faktisk opprettet eller målt tunnel.',
        'En enkeltklienttilkobling har et annet omfang og andre endepunkter. Den er ikke de to gatewayenes nettverk-til-nettverk-forbindelse.',
      ],
      [
        'Riktig mekanisme og termineringspunkt. Produktdokumentasjonen beskriver VNet-to-VNet-trafikk over Microsofts nettverk; ikke alle VPN-scenarier har offentlig internettunderlag.',
        'Dette er riktig om klientinitiert VPN, men klientprofilen er ikke de to gatewayenes tunnelkontrakt.',
        'Riktig som transportkontekst, men transportnettets navn alene beviser verken IPsec eller hvilken gateway som terminerer tunnelen.',
      ],
    ],
  },
  nc04: {
    title: 'Et fungerende circuit med en ny tjenestetype',
    problem:
      'Et eksisterende ExpressRoute-circuit bruker Azure private peering til VM-er i et VNet. Organisasjonen vil også nå en støttet Microsoft-tjeneste med offentlig adressering over circuit-et. VM-forbindelsen fungerer; den nye tjenestens tilgangskrav må vurderes separat.',
    premises: [
      'Den aktuelle tjenesten er kvalifisert for Microsoft peering.',
      'Nødvendig offentlig adresseeierskap og andre peeringkrav kan oppfylles.',
      'Det eksisterende circuit-et skal gjenbrukes der tjeneste- og providerkrav tillater det.',
    ],
    decisions: [
      'Opprett VNet Peering fra VM-nettet til tjenestens offentlige DNS-navn.',
      'Bruk den eksisterende private peering som bevis for at enhver offentlig Microsoft-tjeneste allerede er tilkoblet.',
      'Undersøk og planlegg Microsoft peering på circuit-et for den nye tjenesten.',
    ],
    reasons: [
      'Microsoft peering har et eget rutingsdomene for kvalifiserte offentlige Microsoft-tjenester; fungerende VNet private peering erstatter ikke den nye tjenestens peeringkrav.',
      'En circuit har delt kapasitet på tvers av peerings og en bestemt provider- og peeringtilknytning som inngår i kapasitetsplanleggingen.',
      'Private VNet-adresser beskriver et annet adresserings- og rutingsområde enn en klients vanlige offentlige tjenesteoppslag.',
    ],
    decisive:
      'Et circuit kan ha private peering og Microsoft peering med forskjellige rutingsdomener. At private peering når en VM betyr ikke at den nye offentlige tjenesten er dekket.',
    feedback: [
      [
        'VNet Peering knytter to Azure VNet, ikke et VNet til et offentlig tjenestenavn. Det kunne vært relevant for et annet Azure-nettverk i en endret oppgave.',
        'Private peering dekker ikke automatisk alle offentlige tjenester. Den fungerende VM-veien skal beholdes som et eget korrekt observasjonsgrunnlag.',
        'Riktig under tjenestens og providerens krav. Microsoft peering vurderes separat; dette er en planbeslutning, ikke en utført BGP-konfigurasjon.',
      ],
      [
        'Riktig begrunnelse for peeringvalget. Offentlig adressering er ikke det samme som offentlig internetttransport på en egnet ExpressRoute-vei.',
        'Dette er en faktisk circuit-egenskap, men kapasitetens deling velger ikke riktig rutingsdomene for den nye tjenesten.',
        'Adresseskillet er relevant kontekst, men alene sier det ikke hvilken støttet ExpressRoute-peering som skal planlegges.',
      ],
    ],
  },
  nc05: {
    title: 'Hva dekker den aktiverte MACsec-linken?',
    problem:
      'En organisasjon bruker ExpressRoute Direct med MACsec på linken til Microsoft. Et nytt krav gjelder kryptering fra lokal gateway helt til en gateway i Azure VNet. Revisjonen må sammenligne det nye kravet med beskyttelsens faktiske scope.',
    premises: [
      'Det eksisterende Direct-/MACsec-oppsettet er kompatibelt og fungerer.',
      'Kravet kan oppfylles med et passende IPsec-oppsett.',
      'Ruting og tilgangsregler må vurderes separat fra krypteringen.',
    ],
    decisions: [
      'Behold relevant linkbeskyttelse og planlegg et egnet ende-til-ende-IPsec-lag for det nye kravet.',
      'Registrer MACsec som tilstrekkelig ende-til-ende-beskyttelse fordi trafikken er kryptert på én fysisk link.',
      'Bruk bare applikasjonens TLS-forbindelser og avslutt undersøkelsen av gateway-til-gateway-beskyttelse.',
    ],
    reasons: [
      'ExpressRoute Direct gir et fysisk tilkoblingsalternativ med andre leveranseforutsetninger enn et vanlig provider-circuit.',
      'MACsec beskytter en link; IPsec kan beskytte den påkrevde ende-til-ende-tunnelen.',
      'Et hostname kan beholdes når DNS velger en annen tjenesteinngang, slik at klientens applikasjonskonfigurasjon vurderes separat.',
    ],
    decisive:
      'Det eksisterende MACsec-oppsettet har et linkscope. Kravet om beskyttelse helt mellom gatewayene trenger et passende ende-til-ende-lag; IPsec er ett slikt planlagt alternativ i premissene.',
    feedback: [
      [
        'Riktig under de eksplisitte premissene. MACsec og IPsec kan ha forskjellige og supplerende beskyttelsesområder.',
        'Linkkryptering er en reell beskyttelse, men dekker ikke automatisk hele den oppgitte ende-til-ende-strekningen. Dette valget ville passet et rent linkkrav.',
        'TLS kan beskytte applikasjonsforbindelser, men dokumenterer ikke automatisk beskyttelse mellom de to gatewayene. Et rent applikasjonskrav ville gitt dette valget en annen rolle.',
      ],
      [
        'Dette beskriver et tilkoblingsalternativ, men forklarer ikke hvorfor den nye gateway-til-gateway-strekningen trenger et eget beskyttelseslag.',
        'Riktig scopesammenligning. Hver beskyttelse må vurderes mot de faktiske endepunktene kravet angir.',
        'Dette er navne-/endpointkontekst, men DNS-egenskapen forklarer ingen MACsec- eller IPsec-beskyttelse.',
      ],
    ],
  },
  nc06: {
    title: 'Reserveplanen omfatter forskjellige peerings',
    problem:
      'En organisasjon bruker private peering til VNet-arbeidslaster og Microsoft peering til en kvalifisert offentlig tjeneste. Beredskapsplanen foreslår én site-to-site VPN som dokumentert universell reserve for begge trafikktypene ved circuit-bortfall.',
    premises: [
      'VPN-reserven er kompatibelt planlagt for VNet-rutene og har et uavhengig fungerende underlag.',
      'Den offentlige tjenesten nås gjennom Microsoft peering i normaldrift.',
      'Ingen annen reserve for den offentlige tjenesten er dokumentert.',
    ],
    decisions: [
      'Godkjenn reserveplanen for begge trafikktypene fordi de deler samme ExpressRoute-circuit.',
      'Avgrens den beskrevne VPN-reserven til private-peering/VNet-trafikken og planlegg den offentlige tjenestens alternativ separat.',
      'Deaktiver private peering, slik at Microsoft peering og VPN får samme destinasjonsomfang.',
    ],
    reasons: [
      'Redundante BGP-forbindelser ved et peeringsted kan bedre motstandskraft mot enkelte feil i det normale circuit-oppsettet.',
      'En site-to-site-tunnel bruker internettunderlaget selv om den beskytter trafikken med kryptering mellom tunnelendene.',
      'Den dokumenterte S2S-failovermekanismen for VNet private peering er ikke en generell reserve for Microsoft-peering-tjenester.',
    ],
    decisive:
      'Reserveomfanget må følge det dokumenterte rutings- og tjenestegrunnlaget. En korrekt VNet-reserve dokumenterer ikke samtidig en reserve for den offentlige Microsoft-peering-tjenesten.',
    feedback: [
      [
        'Felles circuit gir ikke felles automatisk failoveromfang. En universell godkjenning mangler tjenestens særskilte alternative vei.',
        'Riktig. Behold den dokumenterte VNet-reserven, og gjør den offentlige tjenestens beredskap til en eksplisitt separat designoppgave.',
        'Å fjerne den fungerende ExpressRoute private peering-forbindelsen endrer ikke hva en VPN-reserve støtter. Det ville i stedet fjerne deler av dagens forbindelsesgrunnlag.',
      ],
      [
        'Dette er en faktisk redundansegenskap ved circuit-et, men besvarer ikke hvilke tjenester den separate VPN-reserven dekker.',
        'Internettransporten er viktig ved policyvurdering av reserveveien, men den alene forklarer ikke skillet mellom de to peering-destinasjonene.',
        'Riktig tjeneste- og rutingsavgrensning. Den offentlige tjenesten trenger sin egen dokumenterte alternative tilgjengelighetsplan.',
      ],
    ],
  },
  nc07: {
    title: 'Gyldig bruker fra en ny kildeadresse',
    problem:
      'Et offentlig tjenesteendpoint krever en gyldig brukerrolle og tillatt nettverkskilde. Brukerrollen er kontrollert som gyldig, DNS gir forventet offentlig adresse, og nettverkspolicyen avviser klientens nye kildeadresse.',
    premises: [
      'Det er fortsatt et godkjent krav å bruke public endpoint.',
      'Klientens nye adresse kan vurderes etter organisasjonens nettverkspolicy.',
      'Tjenestens innlogging og rolle skal beholdes.',
    ],
    decisions: [
      'Fjern brukerautentiseringen, slik at den offentlige adressen kan brukes uten identitet.',
      'Undersøk den avviste kildeadressen og korriger nettverkstillatelsen dersom policyen godkjenner kilden.',
      'Bytt DNS til en vilkårlig privat IP uten å etablere en privat tjenestetilknytning.',
    ],
    reasons: [
      'Nettverkskilde og rolle er separate kontroller; den gyldige brukerrollen opphever ikke kildepolicyens nettverksavslag.',
      'Public endpoint bruker offentlig adressering og kan fremdeles kreve en applikasjonsidentitet med bestemte datarettigheter.',
      'En private DNS-zone kan gi interne klienter et eget navneperspektiv når riktig sone, record og resolvervei finnes.',
    ],
    decisive:
      'Det eksplisitt observerte avslaget gjelder nettverkskilden. Det krever kilde-/policyundersøkelse; å fjerne en allerede riktig identitetskontroll er ingen reparasjon.',
    feedback: [
      [
        'Autentiseringen er et eget oppfylt krav og skal ikke fjernes. Dette ville svekke tilgangsmodellen uten å rette nettverkspolicyens avslag.',
        'Riktig. Kilden må vurderes, ikke automatisk tillates. Et legitimt policyavslag kan også ende med at klienten må bruke en annen godkjent kilde.',
        'En privat adresse uten riktig endpoint og vei løser ikke det dokumenterte offentlige nettverkskravet. Privat design ville krevd en separat plan.',
      ],
      [
        'Riktig kausal forklaring på hvorfor den gyldige brukerrollen ikke løser den avviste kilden.',
        'Dette er sant om offentlig adressering og identitet, men sier alene ikke hvorfor nettopp kildepolicyen må undersøkes i dette hendelsesbildet.',
        'Dette er et annet navneperspektiv. Oppgaven har allerede et riktig offentlig DNS-svar og en spesifikk nettverksavvisning.',
      ],
    ],
  },
  nc08: {
    title: 'Privat drift og en ekstern samarbeidspartner',
    problem:
      'En tjeneste har en Approved private endpoint for interne arbeidslaster. En ekstern samarbeidspartner skal fortsatt bruke den autentiserte offentlige inngangen fra et avgrenset godkjent nett. Partneren har ingen privat nettverksvei. Teamet foreslår å deaktivere all offentlig tilgang straks.',
    premises: [
      'Tjenesten støtter den nødvendige kontrollen av offentlige kilder.',
      'Partnerens identitet og datarettigheter skal fortsatt kontrolleres.',
      'Kravet om ekstern offentlig tilgang er uttrykkelig beholdt.',
    ],
    decisions: [
      'Deaktiver public network access og anta at partneren får privat rute gjennom sin brukerrolle.',
      'Fjern Private Endpoint slik at begge klientgrupper må ha samme offentlige inngang.',
      'Behold den private inngangen og planlegg separat avgrenset offentlig nettverkstilgang med fortsatt partnerautorisasjon.',
    ],
    reasons: [
      'En godkjent Private Endpoint har en privat adresse fra konsumentens subnet og knytter denne inngangen til en støttet tjenestedel.',
      'Et offentlig DNS-oppslag kan gi en adresse selv om tjenestens nettverkskontroller senere avviser forbindelsen fra klienten.',
      'Separate private og offentlige innganger kan støtte forskjellige klientkrav; den interne private forbindelsen skaper ingen privat partnervei eller automatisk offentlig avslag.',
    ],
    decisive:
      'Kravene omfatter to forskjellige klientveier. Den private inngangen trenger ikke fjernes, og den offentlige kan ikke stenges uten å håndtere partnerens fortsatt gyldige krav.',
    feedback: [
      [
        'En brukerrolle skaper ingen privat rute. Å deaktivere offentlig tilgang kunne alene vært riktig ved et nytt krav om bare privat tilgang og en etablert partnervei. Rollens påståtte ruteeffekt ville fortsatt vært feil.',
        'Det offentlige partnerkravet krever ikke at den interne private inngangen fjernes. De to klientgruppenes innganger kan være forskjellige.',
        'Riktig under tjenestens støttede policyfunksjoner. Nettverksavgrensning og brukerautorisasjon må begge planlegges for den offentlige inngangen.',
      ],
      [
        'Dette beskriver den private ressursens egenskap, men besvarer ikke hvordan den eksterne partnerens offentlige behov skal ivaretas.',
        'Dette forklarer at DNS ikke er tilgang. Det alene velger ikke en plan som bevarer begge klientgruppenes ulike inngangskrav.',
        'Riktig kravbasert skille. En Private Endpoint gjør ikke public network access til et automatisk av/på-resultat.',
      ],
    ],
  },
  nc09: {
    title: 'En privat adresse med ventende samtykke',
    problem:
      'En klient får forventet privat IP, og nettverksteamets ruteundersøkelse har ikke funnet et avvik. I tjenesteeierens visning står Private Endpoint-forbindelsen som Pending, og klienten får ennå ikke brukt tjenesten.',
    premises: [
      'Den valgte tjenesten og subressursen støtter Private Endpoint.',
      'Tjenesteeieren kan vurdere forespørselen etter gjeldende policy.',
      'Ingen ny DNS-feil eller rutefeil er observert.',
    ],
    decisions: [
      'La riktig tjenesteeier vurdere og eventuelt godkjenne den ventende forbindelsen.',
      'Opprett et nytt Private Endpoint til samme tjenesteeier og bruk den nye forespørselen som om den allerede var aktiv.',
      'Flytt klientens Resource group slik at godkjenningen arves fra det nye management-scope.',
    ],
    reasons: [
      'Et hostname kan gi en privat adresse når klientens resolver ser den relevante sonen eller forwardingkjeden.',
      'Private Endpoint må være Approved før forbindelsen kan brukes; et korrekt navnesvar er ikke tjenesteeierens godkjenning.',
      'Resource groups gir administrative grenser for ressursenes organisering og livssyklus, adskilt fra deres fysiske plassering.',
    ],
    decisive:
      'Pending er en egen tjenestetilknytningsstatus. Den riktige eieren må vurdere samtykket; DNS- eller management-endringer kan ikke erstatte dette.',
    feedback: [
      [
        'Riktig neste undersøkelse. Godkjenning skal vurderes etter policy, ikke automatisk gis fordi klienten ønsker tilgang. Applikasjonsrettigheter må fortsatt ivaretas.',
        'En ny privat forespørsel kan være relevant når feil mål er valgt, men den er ikke automatisk aktiv. Den samme tjenesteeierens godkjenningsprosess må fortsatt håndteres.',
        'Management-organisering er ikke endpoint-godkjenning. En flytting må ha egne administrative grunner og gir ikke denne tjenestetilknytningen Approved status.',
      ],
      [
        'Dette forklarer det allerede riktige navnegrunnlaget, men ikke den fortsatt ventende tilknytningen.',
        'Riktig kausal forklaring: tilknytningssamtykke og DNS er separate lag.',
        'Dette er riktig om scope, men et administrativt scope er ikke samtykke fra den private-link-tjenestens eier.',
      ],
    ],
  },
  nc10: {
    title: 'Kontorets egen DNS skal finne den private inngangen',
    problem:
      'En lokal klient bruker organisasjonens DNS-server. Hybridforbindelsen til Azure er dokumentert, og tjenestens private zone er linket til et Azure VNet. Kontorets DNS har ingen forwarding mot en resolver som kan se denne sonen.',
    premises: [
      'Den private tjenesteinngangen er riktig støttet og Approved.',
      'En passende Azure-resolver eller forwarder kan etableres og nås.',
      'Tjenestens normale hostname skal beholdes.',
    ],
    decisions: [
      'Pek alle lokale klienter direkte på Azure sin interne DNS-IP uten å etablere en støttet oppslagsvei.',
      'Endre alle connection strings til rå privat IP og behandle dette som generell DNS-integrasjon.',
      'Planlegg en fungerende, tjenestetilpasset forwarding-/resolvervei fra lokal DNS til den linkede private sonen.',
    ],
    reasons: [
      'En VNet-link angir hvilken privat sone et Azure VNet kan bruke i den aktuelle oppløsningsmodellen.',
      'On-premises DNS trenger en nåbar resolverkjede som kan svare fra den private sonen.',
      'Et Approved endpoint bruker en privat subnet-adresse og kan nås fra riktig sammenkoblede nettverk under deres rutingsforutsetninger.',
    ],
    decisive:
      'Det lokale resolverperspektivet mangler en vei til sonen. En korrekt hybrid datapath eller Azure VNet-link alene etablerer ikke forwarding fra kontorets DNS.',
    feedback: [
      [
        'Azure sin interne resolveradresse er ikke en generell ekstern DNS-tjeneste for vilkårlige lokale nett. Det trengs en støttet, nåbar oppslagsarkitektur.',
        'En rå IP er ingen generell reparasjon og kan bryte tjenestens forventede hostname-/sertifikatoppsett. En kontrollert test ville ikke erstatte korrekt DNS-design.',
        'Riktig. Konfigurer både nåbarhet og riktig navnevidereføring etter tjenestens anbefalinger, fremfor å anta at den lokale DNS-serveren allerede ser Azure-sonen.',
      ],
      [
        'Dette er sant om Azure VNet-synlighet, men kontorets egen DNS får ikke automatisk denne sonens svar.',
        'Riktig mekanisme for klientens faktiske resolverplassering. Datavei, DNS-vei og tjenesteautorisering må fortsatt holdes adskilt.',
        'Dette beskriver endpointets dataforbindelse, men en dataforbindelse er ikke konfigurasjon av den lokale navneserverens forwarding.',
      ],
    ],
  },
  nc11: {
    title: 'Connection string under privat migrering',
    problem:
      'Et program flyttes til en støttet privat Storage-inngang. Migreringsutkastet erstatter kontoens vanlige tjenestehostname med endpointets private IP i connection string. Klientens DNS kan allerede gi riktig privat adresse til det vanlige tjenestenavnet.',
    premises: [
      'Private Endpoint er Approved; privat nettverksvei og brukerens datarettigheter er kontrollert.',
      'Tjenestens støttede oppsett bruker det normale tjenestehostname; dette navnet inngår i serveridentiteten som klienten validerer.',
      'Forbindelsen skal fortsatt bruke den private inngangen og beholde serveridentitetsvalideringen.',
    ],
    decisions: [
      'Bruk privatelink-aliaset som et nytt generelt tjenestehostname i alle connection strings.',
      'Behold det normale tjenestehostname i connection string og la den riktige private DNS-konfigurasjonen velge privat adresse.',
      'Behold den private IP-en som tjenestenavn og utelat kontrollen av forventet serveridentitet.',
    ],
    reasons: [
      'En privat DNS-zone kan inneholde A-records som peker på endpointets private adresse for klienter med riktig resolverperspektiv.',
      'En private endpoint-NIC hører til konsumentens subnet, og dens adresse identifiserer den private tjenestetilknytningen i dette nettverket.',
      'En privat adresse erstatter ikke tjenestens hostname-kontrakt; normalt tjenestenavn og privat DNS kan bevare både privat vei og forventet serveridentitet.',
    ],
    decisive:
      'Klientens adressevalg er allerede riktig gjennom det normale navnet. Behold tjenestens støttede hostname og identitetsvalidering; ikke gjør en rå IP eller privatelink-alias til universell erstatning for connection string.',
    feedback: [
      [
        'Et privatelink-navn kan inngå i DNS-kjeden, men er ikke derfor en generell ny connection string. Her krever det støttede tjenesteoppsettet at det normale hostname beholdes.',
        'Riktig. Den normale connection string kan beholdes mens korrekt DNS velger den private inngangen. Ingen offentlig datavei innføres av å beholde det vanlige tjenestenavnet.',
        'En rå privat IP er ikke en erstatning for den uttrykkelige hostname-kontrakten. Å fjerne serveridentitetskontrollen bryter dessuten oppgavens beskyttelseskrav.',
      ],
      [
        'Dette beskriver adresseoppslag, men forklarer ikke hvorfor applikasjonens støttede tjenestenavn og identitetsvalidering skal bevares.',
        'Dette er riktig om den private NIC-en, men dens adresse alene etablerer ikke hvilket servernavn applikasjonen forventer i forbindelsen.',
        'Riktig skille mellom adresse, tjenestenavn og serveridentitet. Private Endpoint endrer ikke automatisk applikasjonens støttede navnekontrakt.',
      ],
    ],
  },
  nc12: {
    title: 'En godkjent inngang til feil tjenestedel',
    problem:
      'En organisasjon har et Approved Private Endpoint for Blob-delen av en Storage-konto. Et nytt filbasert program skal bruke File-delen av samme konto. Teamet vil bruke det eksisterende endpointets godkjenning som dokumentasjon for den nye tjenestedelen.',
    premises: [
      'Den aktuelle kontotypen og File-tjenesten støtter det planlagte Private Endpoint-designet.',
      'Programmet trenger privat File-tilgang med tjenestens normale hostname.',
      'Korrekte DNS-, rute- og autorisasjonskrav må behandles for den nye inngangen.',
    ],
    decisions: [
      'Planlegg riktig File-subressurs med sin støttede private endpoint- og DNS-konfigurasjon.',
      'Bruk Blob-endpointets private IP som generell inngang til enhver tjeneste på kontoen.',
      'Flytt kontoen til samme Resource group som klienten for å gi Blob-endpointet File-omfang.',
    ],
    reasons: [
      'Et Private Endpoint gjelder den støttede målsubressursen; andre kontotjenester trenger sitt eget riktige forbindelsesgrunnlag.',
      'Et privat endpoint har et privat nettverksgrensesnitt i konsumentens subnet og et eget livsløp sammen med endpoint-ressursen.',
      'En felles Storage-konto samler relaterte tjenester og innstillinger som må vurderes mot kontoens dokumenterte type og funksjoner.',
    ],
    decisive:
      'Blob og File er forskjellige målsubressurser. Et godkjent endpoint for én av dem er ikke en universell privat inngang til alle kontotjenester.',
    feedback: [
      [
        'Riktig under konto- og tjenestestøtten i premissene. File trenger sin riktige private inngang og navnekonfigurasjon; Blob-konfigurasjonen blir ikke feil av at en ny tjenestedel kommer til.',
        'Dette forveksler kontoidentitet med endpointets konkrete subressurs. Det kunne vært relevant å gjenbruke den eksisterende Blob-inngangen for en ny Blob-klient, ikke generelt for File.',
        'Resource group påvirker administrativ organisering. Det endrer ikke endpointets målsubressurs fra Blob til File.',
      ],
      [
        'Riktig avgrensning av hva endpointets godkjenning og adresse faktisk gjelder.',
        'Dette beskriver konsumentressursen, men forklarer ikke hvorfor en annen tjenestedel trenger riktig separat målkonfigurasjon.',
        'Kontosammenhengen er reell, men samling i én konto opphever ikke de forskjellige endpoint-subressursene og DNS-kravene.',
      ],
    ],
  },
} as const;

/** Course Hub interface copy; existing teaching and assessment copy is unchanged. */
export const courseHubNb = {
  certification: 'Azure Fundamentals',
  paths: {
    cloud: {
      title: 'Cloud Concepts',
      description: 'Bygg grunnlaget: skyens prinsipper, fordeler og tjenestemodeller.',
    },
    architecture: {
      title: 'Azure Architecture & Services',
      description: 'Utforsk Azure fra infrastruktur til compute, nettverk, lagring og identitet.',
    },
    management: {
      title: 'Azure Management & Governance',
      description: 'Forstå kostnader, styring og verktøy for et Azure-miljø.',
    },
  },
  moduleLabels: {
    identity: 'Part A — Identity Foundations',
    'storage-resilience': 'Part B — Tiers & Redundancy',
    computing: 'Cloud computing',
    benefits: 'Benefits of cloud services',
    services: 'Cloud service types',
    architecture: 'Core Architecture',
    compute: 'Compute & Hosting',
    networking: 'Del A · Nettverksgrunnlag',
    connectivity: 'Del B · Hybrid og endpoints',
    storage: 'Storage Accounts & Services · Part A',
    cost: 'Cost Management',
  },
  networking: 'Networking',
  storage: 'Storage',
  identity: 'Identity, Access & Security',
  plannedModules: {
    architecture: [
      'Identity Part B — RBAC & Conditional Access (P11)',
      'Security Principles (P15)',
      'File Movement & Migration (P16)',
    ],
    management: ['Governance', 'Management Tools', 'Monitoring'],
  },
  recordLabels: {
    identity: 'Identity Foundations',
    resilience: 'Storage Part B',
    course: 'Kursposisjon',
    chapter: 'Sandbox',
    learning: 'Cloud computing · opprinnelig historikk',
    v2: 'Cloud computing',
    services: 'Tjenestelaber · opprinnelig historikk',
    benefits: 'Cloud benefits',
    service2: 'Cloud service types',
    serverless: 'Serverless',
    physical: 'Core Architecture · del A',
    management: 'Core Architecture · del B',
    transfer: 'Cloud Concepts · selvstendige vurderinger',
    practical: 'Praktiske tjenestelaber',
    missions: 'Praktiske oppdrag',
    compute: 'Compute & Hosting',
    networking: 'Networking · del A',
    connectivity: 'Networking · del B',
    storage: 'Azure Storage Part A',
    cost: 'Cost Management',
  },
  partA: 'Del A · Fysisk infrastruktur',
  partB: 'Del B · Organisering og styring',
  coreObservation: 'Veiledede observasjoner · A',
  coreObservationB: 'B',
  intro:
    'Lær Microsoft Azure gjennom teori, interaktive modeller og praktiske oppdrag i en simulert Azure Portal.',
  simulator: 'Lokal simulator · Ingen Azure-konto eller skykostnader.',
  navigation: 'Læringsstier og aktiviteter',
  activities: 'Aktiviteter',
  guidedObservation: 'Veiledet observasjon registrert',
  localHistory: 'Læringshistorikken lagres i denne nettleseren.',
  checkHistory: 'Kontroller læringshistorikken',
  loading: 'Henter lagret aktivitet …',
  historyUnknown:
    'Lagret fremdrift kan ikke bekreftes. Åpne den berørte aktiviteten for å kontrollere historikken.',
  historyUnknownShort: 'Historikk ikke bekreftet',
  reviewRecord: 'Kontroller aktivitet',
  activeAssessment: 'En selvstendig oppgave venter. Fortsett uten å åpne undervisningen.',
  savedPosition: 'Tilbake til din lagrede aktivitet.',
  firstModule: 'Begynn i sti 01 · Cloud computing',
  courseMap: 'LÆRINGSREISEN DIN',
  pathsTitle: 'Tre stier. Ett solid grunnlag.',
  pathsNote: 'Følg rekkefølgen, eller åpne en modul direkte.',
  availableModules: 'moduler tilgjengelig',
  availableModule: 'modul tilgjengelig',
  planned: 'Kommer senere',
  explorePath: 'Oppdrag og vurderinger',
  activityNote:
    'Undervisning, praktisk arbeid og selvstendige oppgaver har egen historikk. Du velger når du vil starte.',
  assessments: 'Selvstendige vurderinger',
  serviceLabs: 'Praktiske tjenestelaber',
  openLearning: 'Åpne undervisningen og oppdragene',
  historyAndSummary: 'Oppsummering og egen historikk',
  partBAssessment: 'Del B · Selvstendige vurderinger',
  partBSummary: 'Del B · Oppsummering og egen historikk',
  historyTitle: 'Din progresjon, med tydelige skiller',
  progressNote:
    'Veiledet praksis og selvstendige besvarelser registreres hver for seg. Å åpne en modul betyr ikke at den er fullført.',
  sandbox: 'Utforsk Sandbox fritt',
  noObservations: 'Ingen veiledede observasjoner ennå',
  guided: 'Veiledede observasjoner',
} as const;

/** Original P08 manuscript · isolated Storage1.0.0 · sources checked2026-10-31. */
export const storageNb = {
  actualContext: 'Faktiske VM- og diskreferanser i din Sandbox',
  actualBoundary:
    'Listen leser eksisterende autoritativ inventory. Ingen disk leses, monteres eller opprettes. Den konseptuelle konto-/datamodellen nedenfor er separat; en VM eller disk gir ikke Storage-kompetanse.',
  actualEmpty:
    'Ingen VM finnes i den gjeldende Sandboxen. Du kan lære diskforskjellen uten å opprette en. Eventuelt eksisterende arbeid er kun lesbar kontekst.',
  actualOpen: 'Åpne eksisterende Virtual machines',
  actualUnverified: 'Teknisk inventory kan ikke bekreftes før Sandbox-lagringen er avklart.',
  title: 'Azure Storage Part A · Accounts & Services',
  path: 'Azure Architecture & Services',
  overview:
    'Velg lagring etter data og tilgangsmønster. Undersøk fire tjenestemekanismer, støttede kontoalternativer og forskjellen fra VM-disker.',
  available:
    'Part A er tilgjengelig med egen versjonert historikk. Part B om access tiers og redundans kommer senere. Lokal konseptundervisning; ingen Storage Account eller data opprettes i Azure.',
  prerequisites:
    'Forkunnskaper: cloud-tjenester, VM-er og forskjellen mellom nettverksvei og autorisasjon fra Networking. Du trenger ingen Azure-konto. Vi definerer objekt, filshare, melding, entity og account før du bruker dem.',
  perspective: 'Perspektiver i Storage Workload Studio',
  recallGuided: 'Gjenoppta lagret Storage-oppdrag',
  pauseGuided: 'Sett oppdraget på pause',
  milestoneNotice:
    'Forklaringen bygger på lagrede, validerte modellresultater. Den er veiledning, ikke en selvstendig besvarelse eller en Azure-kvittering.',
  summaryBoundary:
    'Åpnet undervisning, dokumentert guidet arbeid og uavhengige innleveringer er forskjellige observasjoner. En korrigert retry endrer aldri første innlevering. Et godt svar her dokumenterer bare denne oppgaven, ikke generell Storage-mestring.',
  labels: {
    terms: 'Begreper i denne forklaringen',
    example: 'Gjennomarbeidet eksempel',
    limits: 'Avgrensning og moteksempel',
    sources: 'Offisielle kilder · kontrollert31 oktober2026',
    model:
      'Deterministisk konseptmodell · ingen API, opplasting, database, køarbeider, token, deployment eller receipt',
    configured: 'Utkast til forutsetninger',
    observed: 'Sist lagrede observasjon',
    predicted: 'Din prediksjon',
    result: 'Modellens resultat',
    run: 'Kjør modellen',
    predict: 'Forutsi før kjøring',
    cause: 'Forklar årsaken',
    explain: 'Lagre årsaksforklaring',
    done: 'Guidet anvendelse dokumentert',
    pending: 'Ikke dokumentert ennå',
    begin: 'Åpne SavvyShark-briefing',
    start: 'Start dette oppdraget',
    cancel: 'Avbryt',
    recall: 'Gjenåpne briefing',
    next: 'Neste handling',
    where: 'Hvor finner du kontrollen?',
    why: 'Hvorfor gjør du dette?',
    expected: 'Hva skal du observere?',
    actual: 'Faktisk registrert',
    inspect: 'Bekreft undersøkt referanse',
    portal: 'Åpne faktisk Portal',
    return: 'Tilbake til Storage Part A',
    all: 'Alle detaljer kan leses i tabellen',
    first: 'Første innlevering',
    aided: 'Med registrert hjelp',
    retry: 'Gjeneksponert familie / retry',
    unaided: 'Første uassisterte forsøk',
    guided: 'Guidede oppdrag',
    visited: 'Undervisningsaktiviteter åpnet',
    independent: 'Uavhengige innleveringer',
    classification: 'Forsøkstype og hjelp',
    noXp: 'Ingen XP, Microsoft Learn-fullføring eller exam readiness utledes.',
    human:
      'Kvalifisert menneskelig Azure-SME-, novice/IT-, UX-, skjermleser- og målt transfer-validering er ikke gjennomført.',
    switch:
      'Ett guidet oppdrag er nåværende. Gjenoppta et lagret oppdrag for å beholde dets forutsetninger og observasjoner, eller start et nytt forsøk. Pause og vanlig navigasjon sletter ikke arbeidet.',
    current: 'Fortsett nåværende oppdrag',
    notice:
      'Start lager bare en lokal guidet kontekst. Lukk og Avbryt starter ingenting. Forutsi og kjør eksplisitt; ingen ressurs eller fil opprettes.',
    predictionOptions: [
      'Velg prediksjon',
      'Kravene støttes ikke / demonstrasjonen avvises',
      'Delvis grunnlag eller gjentatt applikasjonseffekt',
      'Dekker de deklarerte modellkravene',
    ],
    chooseCause: 'Velg årsaksforklaring',
    relationships: 'Data- og tjenesterelasjoner',
    service: 'Velg lagringstjeneste',
    workload: 'Arbeidslastens krav',
    accounts: 'Kontotype og kompatibilitet',
    delivery: 'Asynkron arbeidstildeling',
    structure: 'Undersøk datastruktur',
    region: 'Region-/funksjonsstøtte er eksplisitt forutsatt i dette eksemplet',
    assumptions: 'Modellforutsetninger',
    account: 'Storage account-type',
    requested: 'Ønsket tjeneste / protokoll',
    imageAccess: 'Produktbildenes nye tilgangskrav',
    causalPending: 'Modellkontrastene må undersøkes før årsaksforklaring kan lagres.',
  },
  storage: {
    loading: 'Laster versjonert Storage-arbeid …',
    title: 'Storage-lagringen må avklares',
    text: 'Forklaringer og faglige resultater holdes tilbake når lagringen er usikker. Ditt sist leste oppgaveutkast kan undersøkes uten endringer; last inn gjeldende registrering før videre arbeid. Svar fra ulike faner flettes aldri.',
    reload: 'Last inn Storage på nytt',
    recover: 'Gjenopprett bare ugyldige Storage-data',
    confirm: 'Bekreft isolert gjenoppretting',
    cancel: 'Behold data',
    capacity:
      'Ny aktivitet er stanset ved hendelsesgrensen. Et aktivt forsøk kan fortsatt lagre siste svar, registrere hjelp og levere eller avbryte. En allerede undersøkt guidet aktivitet kan avsluttes.',
    failed: 'Handlingen ble ikke varig lagret. Ingen faglig fullføring er registrert.',
    milestones:
      'Automatiske forklaringer er satt på pause fordi visningshistorikken ikke kan bekreftes. Arbeidet kan fortsette; forklaringen kan åpnes manuelt når konteksten er trygg.',
    unsafe:
      'Automatisk veiledning er skjermet under aktiv selvstendig vurdering eller usikker lagring. Åpne vurderings-/recovery-konteksten nedenfor.',
    ownDraft: 'Sist leste oppgaveutkast · endring og innlevering sperret til trygg reload',
  },
  assessment: {
    title: 'Selvstendig Storage-anvendelse',
    intro:
      'Ta stilling til nye data-, klient-, konto- og applikasjonskrav. Lever både en beslutning og begrunnelsen for den. Tidligere VM-, Networking- eller guidede Storage-resultater gir ingen ny uavhengig førstegangsinnlevering.',
    rules:
      'Første besvarelse låses ved innlevering. Ingen fasit eller løsningsguide vises under arbeidet. Åpning av teori, Journal, Summary eller tidligere feedback krever varig registrert hjelp i alle aktive kontekster. Samme familie senere er retry, også etter avbrudd.',
    case: 'Velg scenario',
    result: 'Resultat for dette paret',
    decision: 'Din beslutning',
    reason: 'Din tekniske begrunnelse',
    draft: 'Varig lagret utkast',
    unaided: 'Første uassisterte forsøk',
    assisted: 'Med registrert hjelp',
    retried: 'Gjeneksponert familie / retry',
    first: 'Første innlevering',
    pass: 'Faglig forsvarlig beslutning og begrunnelse i denne situasjonen',
    fail: 'Beslutning og begrunnelse tilfredsstiller ikke kravene sammen',
    start: 'Start selvstendig forsøk',
    retry: 'Start nytt forsøk',
    submit: 'Lever beslutning og begrunnelse',
    abandon: 'Avbryt forsøket',
    help: 'Be om hjelp i relevant undervisning',
    neutral:
      'Vurder begge valgene under de oppgitte premissene. Ingen av valgene er forhåndsvalgt; riktig tjenestenavn med feil årsak godkjennes ikke.',
    history: 'Undersøk tidligere innleveringer',
    alternatives: 'Alle alternativer og endrede forutsetninger',
    repeat: 'Repeter presis undervisningsaktivitet',
  },
  assessmentActive:
    'Et annet Storage-scenario er aktivt. Gå tilbake til ditt eget varig lagrede utkast.',
  currentFeedback: 'Tilbakemelding på innlevert Storage-svar',
  historyFeedback: 'Historisk Storage-besvarelse',
  topics: {
    introduction: 'Lagring, data og kontoer',
    blob: 'Azure Blob Storage · objekter',
    files: 'Azure Files · delte filer',
    queues: 'Azure Queue Storage · asynkront arbeid',
    tables: 'Azure Table Storage · nøkkelbaserte entities',
    accounts: 'Storage account options · støttede kombinasjoner',
    disks: 'Managed disks · VM-volum og datatjenester',
    studio: 'Storage Workload Studio',
    missions: 'Guidede Storage-oppdrag',
    assessment: 'Selvstendig Storage-anvendelse',
    summary: 'Storage Part A · dokumenterte resultater',
  },
  missions: {
    design: {
      title: 'Design the Data Storage',
      situation:
        'Fjordverk har produktbilder for en HTTP-klient, et produksjonsprogram med SMB-filer, utsatt bildebehandling og metadata som finnes med kjente nøkler.',
      goal: 'Skill fire datakontrakter, og forklar et endret klientkrav.',
      steps: [
        'Velg tjenester for alle fire behovene. Forutsi og kjør til alle grunnkrav er undersøkt.',
        'Behold Blob for bildene, endre bildekravet til SMB og kjør kontrasten.',
        'Velg en tjeneste som støtter det nye bildekravet, forutsi og kjør igjen.',
        'Forklar hvorfor samme bildeinnhold kan kreve et annet tjenestevalg.',
      ],
      observe:
        'Se hver datatype, organisering, klientmekanisme og oppfylt/ikke oppfylt krav i resultatet. Riktig grunnsituasjon alene avslutter ikke oppdraget.',
      debrief:
        'Du har dokumentert at innholdstype alene ikke bestemmer tjenesten: tilgangsmønsteret endret et faglig riktig valg. Konto, tillatelser og faktisk dataflyt må fortsatt planlegges.',
      why: 'Et konsistent applikasjonsdesign må tilfredsstille hver datakontrakt og endrede krav, ikke bare samle alt på én konto.',
      where: 'I perspektivet Tjenestevalg: de fire tjenestevalgene, bildekravet og prediksjonen.',
    },
    accounts: {
      title: 'Investigate Account Compatibility',
      situation:
        'Teamet antar at en premium block blob-konto også kan gi køer og NFS-filshares. Region-/funksjonsstøtten er ikke undersøkt.',
      goal: 'Diagnostiser kontogrensen, finn støttede typer og skill støtte fra forutsetning.',
      steps: [
        'Undersøk Queue i premium block blobs og deretter i Standard GPv2.',
        'Undersøk NFS i GPv2 og deretter i en SSD-file-konto.',
        'Kjør den typekompatible NFS-kombinasjonen uten deklarert region-/funksjonsstøtte.',
        'Forklar hvorfor riktig type ikke alene beviser en fungerende deployment.',
      ],
      observe:
        'Matrix, støttede tjenestemekanismer og årsak følger samme lagrede input. Et uavklart regionalt grunnlag skal ikke bli et ubetinget grønt resultat.',
      debrief:
        'Du har skilt tjenestetype, kontofamilie, protokoll/media og regional forutsetning. Dette er en støttekontroll i en modell, ikke en opprettet ressurs eller en målt SLA.',
      why: 'Premium spesialiserer funksjoner; navnet gir ikke en superset av alle Storage-tjenester.',
      where:
        'I perspektivet Kontokompatibilitet: velg type, ønsket tjeneste/protokoll og den eksplisitte forutsetningen.',
    },
    delivery: {
      title: 'Når samme jobb leveres igjen',
      situation:
        'Bildeworkeren gjør jobb-42 ferdig og krasjer før den sletter meldingen. En ny worker kan motta samme jobb.',
      goal: 'Skill to leveringer fra antall applikasjonseffekter.',
      steps: [
        'Kjør den deklarerte krasjsekvensen uten idempotent applikasjonsbehandling.',
        'Kjør samme sekvens med den forutsatte varige idempotensmekanismen.',
        'Undersøk avvisning av en stor bildefil som kømelding; bruk en liten jobbreferanse.',
        'Forklar hvilken komponent som hindrer gjentatt sideeffekt.',
      ],
      observe:
        'Den eksplisitte hendelseslinjen viser usynlighet, krasj før sletting og ny levering. En applikasjonsmekanisme kan endre effekter mens antall leveringer er det samme.',
      debrief:
        'Du har observert en kømekanisme og en applikasjonsmekanisme hver for seg. I en virkelig løsning må idempotens og dataoppdateringer utformes sammen; køen lover ikke at en vilkårlig jobb skjer nøyaktig én gang.',
      why: 'Mottak, sideeffekt og sletting er ulike hendelser. Et krasj mellom dem er en viktig feilgrense.',
      where: 'I perspektivet Meldingslivsløp: meldingsinnhold, idempotens og prediksjon.',
    },
  },
  causal: {
    design: [
      'En container gir automatisk delte filoperasjoner når et objekt får filendelse.',
      'Datakontrakten styrer valget: HTTP-objekt, SMB-share, jobbkø og nøkkelbaserte entities løser ulike behov.',
      'Alle datatjenester blir like når de legges i samme account.',
    ],
    accounts: [
      'En typekompatibel kombinasjon må fortsatt kvalifiseres av protokoll, media, region og tilgang; premium er ikke universell støtte.',
      'Et premium-valg gir alle tjenester i GPv2 og alle regionale funksjoner.',
      'En vellykket støttekontroll beviser at en klient er autentisert og autorisert.',
    ],
    delivery: [
      'Queue Storage slutter å levere meldingen på nytt fordi programmet bruker en jobb-ID.',
      'En melding som er mottatt, er allerede slettet selv om workeren krasjer.',
      'Visibility og sletting styrer levering; den deklarerte idempotente applikasjonslogikken hindrer gjentatt effekt.',
    ],
  },
  milestone: {
    accounts: {
      title: 'SavvyShark · riktig tjeneste, feil kontotype',
      text: 'De lagrede kjøringene viser Queue avvist i premium block blobs og støttet i GPv2 under samme deklarerte forutsetninger. Kontofamilien endret funksjonsstøtten. Dette beviser ikke regional tilgjengelighet eller klienttilgang.',
    },
    delivery: {
      title: 'SavvyShark · to leveringer, én effekt',
      text: 'Begge lagrede krasjsekvenser leverte samme jobbreferanse to ganger. Bare applikasjonens deklarerte idempotensmekanisme endret effektene fra to til én. Køen har ikke fått en nøyaktig-én-gang-garanti.',
    },
  },
  model: {
    outcome: [
      'Oppfyller ikke kravene',
      'Delvis / uavklart / gjentatt effekt',
      'Oppfyller deklarerte modellkrav',
    ],
    snapshot: 'lagret modellkjøring',
    draftChanged:
      'Utkastet er endret. Resultatet nedenfor gjelder fortsatt sist lagrede input; forutsi og kjør på nytt for å undersøke endringen.',
    noRun:
      'Ingen modellkjøring er lagret i dette oppdraget. Velg en prediksjon og kjør eksplisitt.',
    boundary:
      'Konseptuelle eksempeldata · ingen teknisk inventory, kvittering eller faktisk Storage-runtime.',
    imageOptions: ['HTTPS-objekter', 'Montert SMB-filområde'],
    accountNames: {
      gpv2: 'Standard general-purpose v2',
      block: 'Premium block blobs',
      fileSsd: 'Provisioned SSD file shares · premium',
      fileHdd: 'Provisioned HDD file shares',
      page: 'Premium page blobs',
    },
    requestNames: {
      block: 'Block blobs',
      append: 'Append blobs',
      page: 'Page blobs',
      smb: 'Azure Files · SMB',
      nfs: 'Azure Files · NFS',
      queue: 'Azure Queue Storage',
      table: 'Azure Table Storage',
      disk: 'Managed disk',
    },
    services: {
      blob: 'Azure Blob Storage',
      files: 'Azure Files',
      queue: 'Azure Queue Storage',
      table: 'Azure Table Storage',
      disk: 'Managed disks',
      other: 'En annen datatjeneste',
    },
    workloads: {
      images: 'Produktbilder · binære objekter til en webklient',
      documents: 'Produksjonsdokumenter · delt filområde',
      jobs: 'Jobbreferanser · utsatt bildebehandling',
      metadata: 'Produktmetadata · oppslag med kjente nøkler',
    },
    supported: 'Støttes i den avgrensede account-modellen',
    unsupported: 'Støttes ikke av denne kontotypen',
    unverified: 'Type støtter forespørselen; region-/funksjonsgrunnlaget er ikke deklarert',
    declared: 'Region-/funksjonsstøtte er forutsatt, ikke kontrollert mot Azure',
    noAccess: 'Tjenestestøtte er ikke autorisasjon eller faktisk respons.',
    queueLabels: {
      payload: 'Innhold i den konseptuelle meldingen',
      pointer: 'Liten jobb-ID og Blob-referanse',
      large: 'Stor bildefil · overskrider meldingsgrensen',
      idempotent: 'Applikasjonen har en deklarert varig idempotensmekanisme',
      deliveries: 'Meldingsleveringer',
      effects: 'Applikasjonseffekter',
      rejected:
        'Meldingen avvises før levering i dette eksemplet. Et lite referansebudskap kan peke til bildefilen i Blob.',
      steps: [
        'Produsent legger inn jobb-42',
        'Worker A mottar; meldingen er midlertidig usynlig',
        'Worker A gjør sideeffekten, men krasjer før sletting',
        'Visibility-perioden utløper i den deklarerte sekvensen',
        'Worker B mottar samme jobb-ID',
        'Applikasjonen gjentar eller gjenkjenner effekten',
        'Worker B sletter meldingen etter behandling',
      ],
      deduplicated: 'Den deklarerte appmekanismen gjenkjenner jobb-42; ingen ny effekt.',
      repeated: 'Ingen idempotens er forutsatt; samme jobb gir en ny effekt.',
      assumption:
        'Eksplisitt modellforutsetning: krasj etter første sideeffekt og før sletting, deretter vellykket andre behandling/sletting. Idempotens antas varig og riktig koordinert med sideeffekten; AzureLab implementerer ingen virkelig applikasjonstransaksjon.',
    },
    structures: {
      blob: ['Storage Account', 'Blob Container · katalog', 'Block blob · ventil-07.jpg'],
      files: [
        'Storage Account · classic share',
        'File Share · produksjon',
        'Katalog og fil · tegninger/V07.dwg',
      ],
      queue: ['Storage Account', 'Queue · bildejobber', 'Message · jobb-42 med Blob-referanse'],
      table: ['Storage Account', 'Table · produkter', 'Entity · PartitionKey + RowKey'],
    },
    structureText: {
      blob: 'Container og objektnavn organiserer Blob-data. Et navn med skråstrek er ikke alene en montert filshare; et Data Lake-hierarki har egne vilkår.',
      files:
        'Classic account-basert File Share har fil- og katalogsemantikk. Microsoft.FileShares er en separat nyere management-modell, foreløpig NFS, uten konto som forelder.',
      queue:
        'Meldingen instruerer en worker og kan bli levert igjen. Bildet ligger ikke automatisk i køen; meldingen kan peke til det.',
      table:
        'Entities har forskjellige egenskaper, men et entydig par PartitionKey/RowKey. To like RowKey er lov i forskjellige partisjoner; dette er ikke en SQL-join.',
    },
    entities: [
      {
        PartitionKey: 'ventiler',
        RowKey: 'V07',
        egenskaper: 'Trykklasse=PN16',
      },
      {
        PartitionKey: 'motorer',
        RowKey: 'V07',
        egenskaper: 'Spenning=230V',
      },
    ],
    designColumns: [
      'Behov og datatype',
      'Valgt tjeneste',
      'Nødvendig mekanisme',
      'Observert samsvar',
    ],
    met: 'Kravet dekkes i modellen',
    notMet: 'Kravet dekkes ikke',
    yes: 'Ja',
    no: 'Nei',
    matrixRequests: ['block', 'append', 'page', 'smb', 'nfs', 'queue', 'table'],
    matrixCaption: 'Støtte i deklarerte moderne account-familier · classic account-baserte Files',
    matrixBoundary:
      'SS08/SS12/SS20/SS21 · media, protokoll og region kvalifiserer støtten. Microsoft.FileShares er en egen management-modell utenfor denne account-matrisen. Ingen av radene gjør en managed disk til et barn i din Storage Account.',
    relationshipLevels: ['Navnerom', 'Tjenestens samling', 'Lagret data'],
    entityCaption: 'Konseptuelle entities · samme RowKey, forskjellige partisjoner',
    properties: 'Eksempelegenskaper',
    noDisk: 'Ingen datadisk registrert',
    mechanisms: {
      blob: 'Navngitte objekter i containere, lest eller skrevet gjennom objektoperasjoner. Vanlig HTTPS-objekttilgang oppfyller ikke i seg selv et montert SMB-filkrav.',
      files:
        'Administrert share med filer, kataloger og valgt filprotokoll. Ikke en Queue-worker, SQL-motor eller automatisk objektpublisering.',
      queue:
        'Små arbeidsmeldinger som en konsument må behandle. Kan leveres igjen; erstatter ikke bildelager eller varig registerdatabase.',
      table:
        'Ikke-relasjonelle entities med PartitionKey/RowKey og egenskaper. Ingen generell SQL-join eller automatisk indeks på alle egenskaper.',
      disk: 'Blokkvolum for en VM-klient, ikke en account-basert objekt-/share-/kø-/tabellmekanisme.',
      other:
        'En annen tjeneste kan være riktig ved andre krav, eksempelvis relasjonelle SQL-behov. Ingen av grunnbehovene her krever det.',
    },
    designChanged: {
      http: 'Grunnkravet for bildene er navngitte HTTPS-objekter. Delte produksjonsfiler, arbeidsmeldinger og keyed metadata har egne mekanismer.',
      smb: 'Bildekravet er endret til et montert SMB-filområde. Samme bildebytes gjør ikke det gamle objektvalget til et riktig filshare-valg.',
    },
    accountReasons: {
      gpv2: 'Standard GPv2 tilbyr Blob-typene, Queue, Table og passende HDD/SMB Files i denne modellen. Classic Files NFS krever et annet egnet SSD-alternativ.',
      block:
        'Premium block blob-accounten tilbyr block/append blobs. Den har ikke Queue, Table, Files eller page blobs.',
      fileSsd:
        'En egnet provisioned SSD-file-account gir classic SMB- eller NFS-shares. Den tilbyr ikke Blob, Queue eller Table. Én share velger én protokoll.',
      fileHdd:
        'Provisioned HDD FileStorage er et aktuelt classic Files-alternativ, men gir ikke NFS i denne modellen. FileStorage er dermed ikke i seg selv synonymt med premium SSD.',
      page: 'Premium page blob-accounten er for page blobs. Navnet premium eller Blob gjør ikke block/append, Files, Queue eller Table støttet.',
    },
  },
  sections: {
    introduction: {
      title: 'Ett system trenger flere typer lagring',
      paragraphs: [
        'Fjordverk selger reservedeler og lager monteringsveiledninger. Produktbildene må kunne hentes av en nettapplikasjon. Ansatte og et eldre produksjonsprogram trenger felles dokumentfiler. Nye bilder skal behandles i bakgrunnen, og hvert produkt har egenskaper som varierer med produktfamilien. Dette er fire forskjellige krav til hvordan data brukes. Filendelsen alene avgjør ikke hvilken tjeneste som passer.',
        'Lagring bevarer data mellom operasjoner. Compute kjører programkoden som leser eller endrer data; nettverk gir en kommunikasjonsvei mellom komponenter. En kø utfører ikke bildebehandling, og et lagret bilde publiserer ikke seg selv. Vi må velge både datalagring, programlogikk og tilgang. Å plassere alt på VM-ens disk kan være mulig, men gjør ikke disken til en administrert objekt-, fil-, kø- eller tabelltjeneste.',
        'Et Storage Account gir en navne- og konfigurasjonsramme for støttede Azure Storage-tjenester. I en Standard general-purpose v2-konto kan Blob, Files, Queues og Tables eksistere med forskjellige tjenesteendepunkter. Kontoen er ikke selve filen eller meldingen. Under kontoens Blob-tjeneste finnes containere og blobs; andre tjenester har andre datastrukturer. Kontoens type, tjenestens funksjoner og arbeidslastens krav må passe sammen.',
        'Et offentlig adresserbart endepunkt er ikke det samme som anonym lesetilgang. Autorisasjon og nettverksinnstillinger må tillate forespørselen. Blob-data er ikke anonymt lesbare som følge av at en konto finnes. Å tillate anonym tilgang på kontonivå er heller ikke nok alene: en container må eksplisitt tillate slik lesing. Kontoens innstilling kan stenge dette. Kryptering av lagrede data erstatter ikke adgangskontroll.',
      ],
      terms: [
        [
          'Storage Account',
          'Navnerom og ramme for støttede datatjenester; ikke et universelt filsystem.',
        ],
        ['Tilgangsmønster', 'Hvordan klienten identifiserer, leser, deler og endrer data.'],
        ['Persistens', 'Data bevares uavhengig av en bestemt programkjøring.'],
      ],
      example:
        'Fjordverk kan starte med én standardkonto for bilder, SMB-dokumenter, jobbreferanser og produkt-entities. De trenger fremdeles separate datastrukturer og tillatelser. Et nytt NFS-krav kan føre til en egen filkonto; kontoantallet er et designvalg, ikke et mål på læring.',
      limit:
        'Dette er en deklarert læringsarkitektur. Ingen konto, fil, nettverksvei eller tilgang testes mot Azure. Tier-, redundans- og migreringsvalg hører til senere deler.',
    },
    blob: {
      title: 'Et objekt har innhold, navn og metadata',
      paragraphs: [
        'Azure Blob Storage lagrer objekter, kalt blobs. Et objekt kan være binære data som et bilde, en lydfil eller en eksport, eller tekst som en logg. «Ustrukturert» betyr at Blob-tjenesten ikke krever at innholdet følger et databaseskjema. Et JSON-dokument er fortsatt et objekt her; tjenesten gjør det ikke automatisk søkbart som relasjonelle rader.',
        'I account-modellen går relasjonen Storage Account → Blob Container → Blob. Containeren organiserer et sett objekter og er et relevant tilgangsområde. Klienten kan identifisere et objekt ved konto, container og objektnavn og bruke et API, vanligvis over HTTPS. Navnet katalog/bilde.jpg kan ligne en filsti. I et vanlig flatt navnerom er slike skillelinjer en del av navnet, ikke bevis for et montert filsystem.',
        'Block blobs passer for eksempel til bilder og dokumentobjekter. Append blobs er tilrettelagt for tilføying, mens page blobs støtter sidebaserte tilfeldige oppdateringer. Blob-type og account-type er forskjellige valg: en premium page blob-konto er ikke en premiumkonto for alle Blob-typer. Ikke velg en disk eller page blob bare fordi begge bruker blokker eller sider.',
        'Blob har også dokumenterte ekstra muligheter, blant annet Data Lake-hierarki, NFS3 og SFTP under bestemte vilkår. Det gjør ikke en vilkårlig Blob-konto til en SMB-share eller et ferdig datavarehus. I denne delen sammenligner vi et vanlig API-basert objektbehov med et eksisterende programs krav til delte filoperasjoner. En senere endring i klientkrav kan endre tjenestevalget.',
      ],
      terms: [
        ['Blob', 'Ett navngitt objekt med innhold og metadata.'],
        ['Container', 'En samling blobs i en konto; forskjellig fra en compute-container.'],
        ['Block / append / page', 'Forskjellige Blob-typer med ulike oppdateringsmekanismer.'],
      ],
      example:
        'Fjordverks nettsted henter produkter/ventil-07.jpg fra containeren katalog. Bildet kan skiftes ut ved å skrive et nytt objekt. Når produksjonsprogrammet senere krever en SMB-sti og filoperasjoner uten kodeendring, oppfyller ikke dette HTTPS-objektoppsettet kravet.',
      limit:
        'En URL beviser verken autorisasjon eller en offentlig publisert fil. Ingen opplasting, NFS-/SFTP-konfigurasjon, tier eller ytelsesgaranti simuleres.',
    },
    files: {
      title: 'En share gir en filorientert kontrakt',
      paragraphs: [
        'Azure Files tilbyr administrerte filshares. En klient monterer en share og arbeider med kataloger og filer gjennom en støttet filprotokoll. Det passer når et eksisterende program forventer filstier og fildelingssemantikk, eller flere klienter må bruke et felles filområde. Azure administrerer tjenesteinfrastrukturen; applikasjonens filbruk og tilgang må fortsatt utformes.',
        'SMB og NFS er protokoller, ikke forskjellige navn på Blob. SMB brukes blant annet av Windows-klienter og støttes også av relevante Linux-/macOS-klienter. NFS har andre filsystem- og tilgangsforutsetninger; her brukes en deklarert Linux-klient. En share velger SMB eller NFS. Begge kan finnes som forskjellige shares i en egnet konto, men én share tilbyr ikke begge protokollene samtidig.',
        'For classic file shares organiserer en Storage Account en File Share med filer og kataloger. Standard StorageV2 kan gi HDD-baserte pay-as-you-go SMB-shares. Nyere provisioned FileStorage-kontoer kan ha HDD eller SSD, men er bare for Files. NFS krever SSD i den account-baserte modellen vi undersøker. Derfor er «FileStorage» ikke alene det samme som «premium SSD» eller en garanti for NFS.',
        'Gjeldende produktdokumentasjon beskriver også Microsoft.FileShares: en share kan være en egen Azure-ressurs uten et Storage Account, foreløpig for NFS. Dette er en separat management-modell, ikke en feil i account-hierarkiet eller et sjette generisk datalager. Studioet avgrenser seg eksplisitt til classic account-baserte shares; i et faktisk design må modell, region, protokoll og funksjoner kontrolleres.',
        'En montert share krever riktig nettverk, autentisering og tillatelser. For SMB kan klientens nettverk for eksempel blokkere nødvendig protokolltrafikk. En share som finnes, er derfor ikke bevis for at alle ansatte kan åpne alle filer. Å dele et filområde er heller ikke i seg selv konfliktløsning for applikasjonens samtidige endringer.',
      ],
      terms: [
        ['File Share', 'Et administrert felles filområde med kataloger og filer.'],
        ['SMB / NFS', 'Filprotokoller med forskjellige klient- og tilgangsforutsetninger.'],
        [
          'Classic file share',
          'Account-basert Files-modell, forskjellig fra top-level Microsoft.FileShares.',
        ],
      ],
      example:
        'Fjordverks produksjonsprogram åpner og låser filer på en eksisterende SMB-sti. En Azure Files SMB-share passer klientkontrakten. En Blob Container med navn som ligner mapper er ikke en direkte erstatning uten å endre programmet. Med et nytt Linux/NFS-krav må teamet revurdere account, media og nettverk.',
      limit:
        'Tjenesten garanterer ikke at hvert eldre filprogram eller enhver region støtter ønsket kombinasjon. Vi monterer ingen share og implementerer ikke Azure File Sync eller migrering.',
    },
    queues: {
      title: 'Meldingen ber om arbeid; køen gjør ikke jobben',
      paragraphs: [
        'Azure Queue Storage lagrer meldinger mellom applikasjonskomponenter. En produsent legger inn en arbeidsbeskrivelse; en konsument henter meldingen og utfører kode som behandler arbeidet. Dette lar nettstedet gi respons før en bakgrunnsjobb er ferdig. Køen jevner ikke automatisk ut all kapasitet og starter ingen worker av seg selv; en applikasjon eller integrasjon må gjøre behandlingen.',
        'Relasjonen er Storage Account → Queue → Messages. En melding kan for eksempel inneholde jobb-ID og referansen til et bilde i Blob. Bildet behøver ikke flyttes inn i meldingen. Tjenestens meldingsgrense er64KB; encoding og nyttelast må vurderes. En stor bildefil er derfor ikke en passende kømelding. Selve bildedataene og status-/metadataregisteret kan ligge i andre tjenester.',
        'Når en worker mottar en melding, blir den normalt midlertidig usynlig for andre mottak. Den er ikke nødvendigvis slettet. Etter vellykket behandling må applikasjonen slette meldingen med riktig mottaksreferanse. Hvis workeren krasjer før slettingen, kan meldingen bli synlig og levert igjen etter visibility-perioden. Vi demonstrerer hendelsesrekkefølgen eksplisitt uten ekte klokke. Visibility kan også utløpe mens den første workeren fortsatt lever og arbeider. En langvarig jobb må håndtere denne risikoen; en passende fornyelse av usynlighetsperioden kan redusere samtidig mottak, men er ikke en varig nøyaktig-én-gang-garanti.',
        'En jobb kan allerede ha endret data før et krasj. En ny levering kan da gi en ekstra sideeffekt. Applikasjonen kan bruke en stabil jobb-ID og en varig idempotensstrategi slik at gjentatt arbeid ikke gjentar forretningseffekten. Dette må designes sammen med dataoppdateringene; et avkrysningsfelt i en ekte kø gir ikke en universell nøyaktig-én-gang-garanti. Studioets idempotens er en uttrykkelig forutsatt applikasjonsmekanisme.',
        'Storage queues gir ikke en generell FIFO-garanti og er ikke en SQL-/metadata-database. Azure Service Bus er en annen messaging-tjeneste med for eksempel sessions, duplicate detection og andre broker-funksjoner under relevante vilkår. Et krav til slike funksjoner må vurderes særskilt; heller ikke navnet på en broker beviser at en vilkårlig ekstern applikasjonseffekt skjer nøyaktig én gang.',
      ],
      terms: [
        [
          'Produsent / konsument',
          'Programdelen som legger inn arbeid, og programdelen som mottar og behandler det.',
        ],
        [
          'Visibility',
          'Midlertidig synlighet for mottak, forskjellig fra utført jobb og sletting.',
        ],
        [
          'Idempotent behandling',
          'En applikasjonsstrategi der gjentatt behandling av samme jobb ikke gjentar den ønskede sideeffekten.',
        ],
      ],
      example:
        'Fjordverk lagrer et bilde som Blob og legger en liten jobbreferanse i en Queue. I dette gjennomarbeidede eksemplet stopper worker A før den har gjort noen sideeffekt. Etter ny levering lager worker B miniatyrbildet og sletter meldingen: to leveringer, én effekt. Studioet undersøker en annen feilgrense, der første worker allerede har gjort sideeffekten. Forutsi selv hva som endres.',
      limit:
        'Køen utfører ikke bildebehandling, oppbevarer ikke automatisk en full jobbstatusdatabase og lover ikke FIFO eller nøyaktig-én-gang-applikasjonsutførelse. Ingen levende kø, worker, timer eller Functions-trigger kjører.',
    },
    tables: {
      title: 'Entities organiseres etter hvordan du finner dem igjen',
      paragraphs: [
        'Azure Table Storage er et nøkkel-/attributtlager for strukturerte, ikke-relasjonelle data. En table inneholder entities med navngitte egenskaper. Entities i samme table kan ha forskjellige egenskaper: en ventil kan ha trykklasse, mens en motor har spenning. Fleksibelt skjema fjerner ikke behovet for datavalidering og et gjennomtenkt tilgangsmønster i applikasjonen.',
        'Relasjonen er Storage Account → Table → Entities. Hver entity identifiseres entydig av kombinasjonen PartitionKey og RowKey innen tabellen. PartitionKey grupperer relaterte entities; RowKey identifiserer en entity innen denne partisjonen. Samme RowKey kan derfor finnes i forskjellige partisjoner. En stabil nøkkel som samsvarer med hvordan klienten finner produktet, kan gjøre direkte oppslag effektivt.',
        'Dersom klienten kjenner produktfamilie og produkt-ID, kan de brukes som et deklarert nøkkelpar. Dersom kravene i stedet er vilkårlige filtreringer og komplekse sammenkoblinger mellom flere datasett, må designet vurderes på nytt. Ikke anta at enhver egenskap automatisk får en sekundær indeks eller at et fleksibelt skjema gjør alle spørringer like effektive.',
        'En Table Storage-table er ikke en vanlig relasjonell SQL-tabell. Tjenesten tilbyr ikke SQL-motor med joins, foreign keys og stored procedures bare fordi den heter Table. Relasjonelle krav kan kreve en annen databasetjeneste. Azure Cosmos DB for Table er også et annet produkt med egne egenskaper; en kompatibel klientflate gjør ikke produktene eller ytelses-/indeksløftene like.',
      ],
      terms: [
        ['Entity', 'En samling typede egenskaper i en table.'],
        ['PartitionKey', 'Første del av nøkkelen og logisk gruppering av entities.'],
        ['RowKey', 'Unik innen en partisjon; sammen med PartitionKey identifiserer den entityen.'],
      ],
      example:
        'Fjordverk velger PartitionKey=ventiler og RowKey=V07. En annen entity kan være PartitionKey=motorer, RowKey=V07. De har samme RowKey, men forskjellige fullstendige nøkler. Trykklasse behøver ikke finnes på motoren. Et senere krav om SQL-joins mellom ordrelinjer, kunder og betalinger kan ikke dekkes ved bare å gi denne tabellen flere kolonner.',
      limit:
        'Modellen er en forklarende tabell med fiktive entities, ikke en kjørende database, målt partisjonering eller en SQL-/Cosmos-emulator. Kvoter og detaljerte transaksjonsgrenser er ikke en vurdert del her.',
    },
    accounts: {
      title: 'Kontotype er en funksjonsgrense, ikke et kvalitetsstempel',
      paragraphs: [
        'Begynn med tjenesten og arbeidslastens protokoll, datamekanisme og ytelsesbehov. Kontotypen bestemmer hvilke datatjenester som kan brukes sammen. Standard general-purpose v2 er et moderne allround-alternativ for Blob, Queue, Table og passende Azure Files-shares. Det betyr ikke at kontoen uten videre støtter alle protokoller, media, regioner og funksjoner i disse tjenestene.',
        'Premium block blobs er for block/append blobs og kan passe erklærte krav om SSD og lavere lagringslatens. Det er ikke en premiumkonto for Files, Queues og Tables. Premium page blobs er begrenset til page blobs. Et program som trenger block blobs, blir ikke kompatibelt ved å velge premium page blobs. Storage-typen beskriver dermed teknisk funksjon, ikke en universell rangering der dyrere alltid løser mer.',
        'For classic Files skiller vi provisioned SSD-file accounts, ofte presentert som premium file shares, fra provisioned HDD-file accounts. Begge er FileStorage-kontoer for bare file shares. SSD kan støtte passende SMB- eller NFS-shares; HDD er ikke NFS-alternativet i denne avgrensede modellen. Standard StorageV2 er et annet, pay-as-you-go HDD/SMB-alternativ. Dette kvalifiserer den forenklede firetype-tabellen i grunnleggende Learn-materiale. Gjeldende Files-dokumentasjon anbefaler provisioned accounts for nye classic file shares. GPv2-raden viser en støttet kombinasjon, ikke en generell anbefaling om dette som standard for nye Files-utrullinger.',
        'En account gir et eget navnerom, og hver støttet tjeneste har sitt endepunkt. Navne-, ytelses-, kostnads- og tilgangerfaring kan derfor begrunne flere kontoer, men én konto per fil er ikke nødvendig. Kryptering ved lagring opphever ikke autorisasjon, og en kjent endpoint-adresse gjør ikke data anonyme. På samme måte er «type støtter tjenesten» bare én del av en virkelig kompatibilitetskontroll.',
        'Kontotype, media, region, funksjoner, protokoll og valgt management-modell må kontrolleres mot aktuell dokumentasjon. Studioet viser «støttet under deklarerte forutsetninger» når region-/funksjonsstøtte uttrykkelig antas. Uten denne antakelsen viser det uavklart grunnlag. Det spør aldri Azure og gir ingen deploy-garanti. Legacy GPv1, Blob-only og classic ASM er historiske/migreringsrelaterte valg; nye eksempler bruker de moderne familiene. Enkelte legacy-upgrades har egne regler, ikke en universell fri konvertering mellom premiumtyper.',
      ],
      terms: [
        ['Account type', 'En støttet tjeneste-/funksjonskombinasjon; ikke synonymt med Blob-type.'],
        [
          'Media / performance',
          'For eksempel HDD eller SSD med egne begrensninger, ikke et målt SLA-løfte.',
        ],
        [
          'Deklarert forutsetning',
          'Noe modellen antar, ikke noe AzureLab har kontrollert i en region.',
        ],
      ],
      example:
        'Et team ønsker Table-entities i en provisioned HDD-file-account. Kontofamilien er bare for Files, så dette er ikke støttet selv om den bruker administrert lagring. Teamet beholder filkontoen til dokumentene og legger det nøkkelbaserte registeret i en egnet GPv2-konto. Studioet lar deg anvende samme kontrollmåte på andre tjeneste- og protokollkombinasjoner.',
      limit:
        'Ingen pris, SLA, regional katalog, redundansplan eller kontoendring simuleres. Faktiske tilgjengelige kombinasjoner kan endres. Access tiers og redundans undervises i Part B; flytting og migrering kommer senere.',
    },
    disks: {
      title: 'Et VM-volum og et objektlager har forskjellige klienter',
      paragraphs: [
        'Azure managed disks gir blokklagringsvolumer til Azure Virtual Machines. Operativsystemet bruker blokkenheten og oppretter et filsystem der det er relevant. En OS-disk støtter operativsystemet; datadisker kan brukes til applikasjonsdata. Applikasjonen som kjører i VM-en er compute, mens disken er lagring. Å konfigurere en disk er ikke bevis for at operativsystemet har startet eller skrevet data.',
        'Azure håndterer underliggende lagringskontoer for managed disks. Du velger ikke din egen Storage Account → Blob Container → Blob-kjede som forelder til den eksisterende managed disken. Det er fortsatt Azure-lagring, men en annen ressurs- og klientrelasjon. Ikke bland dette med historiske unmanaged VHD-er som kunne ligge som page blobs i en kundeadministrert konto.',
        'En databaseprosess i en VM kan trenge et blokknivåvolum for egne datafiler. En nettapplikasjon som skal hente eksportobjekter over HTTPS, kan i stedet bruke Blob. Å ha lagret en eksportfil inne i VM-filsystemet publiserer den ikke automatisk som Blob. Det krever en egen dataflyt som vi ikke utfører her. En vanlig tilkoblet managed disk blir heller ikke automatisk et administrert felles SMB-filområde for flere klienter.',
        'Sandbox-listen nedenfor viser kun faktisk eksisterende VM → OS-disk og VM → datadisk-referanser. Hvis ingen VM finnes, er det en ærlig tomtilstand. Ingen ressurs opprettes for å fylle diagrammet. Eksemplene i Studioet er fiktive data uten kobling til World. Midlertidig VM-lagring og særlige delte/ephemeral diskoppsett har egne vilkår; de er ikke en erstatning for den normale sammenligningen eller en skjult universell diskgaranti.',
      ],
      terms: [
        [
          'Block storage',
          'Lagring som eksponerer et blokknivåvolum til en klient som VM-ens operativsystem.',
        ],
        ['OS-disk / datadisk', 'Roller i VM-ens faktiske ressursrelasjoner.'],
        [
          'Managed disk',
          'Azure-administrert diskressurs; ikke en Blob Container i din egen konto.',
        ],
      ],
      example:
        'En VM behandler produksjonsdata på en managed datadisk. Ferdige bilder som eksterne klienter skal hente som navngitte objekter, hører til et annet tilgangsmønster. Studenten undersøker eksisterende diskreferanser og kan deretter begrunne et nytt Blob-valg uten at disken gir noen automatisk Storage-fullføring.',
      limit:
        'Vi leser kun inventory-referanser, ikke diskinnhold, gjestehelse, ytelse eller en faktisk filoverføring. Det finnes ingen ny diskkommando, receipt, XP eller migrering.',
    },
    studio: {
      title: 'Endre kravet og undersøk årsaken',
      paragraphs: [
        'Storage Workload Studio samler tjenestevalg, account-kompatibilitet og datarelasjoner i én undervisningsflate. Du forutsier et resultat, kjører et eksplisitt deterministisk eksempel og sammenligner den lagrede observasjonen med nåværende utkast. Å endre en kontroll uten ny kjøring endrer ikke det observerte resultatet.',
        'Fjordverks fire behov har forskjellige datakontrakter. Undersøk først grunnsituasjonen, deretter et endret krav om SMB-tilgang til produktbildene. Account-perspektivet viser hvorfor en riktig tjeneste kan være umulig i feil kontotype. Meldingsperspektivet skiller leveringer fra utførte forretningseffekter med en eksplisitt krasjsekvens. Relasjonsvisningen bruker forskjellige strukturer for hver tjeneste og holdes utenfor teknisk inventory.',
      ],
      terms: [
        ['Prediksjon', 'Din forventning før en eksplisitt kjøring.'],
        ['Observasjon', 'Resultatet av sist lagrede modellkjøring med dens egne forutsetninger.'],
      ],
      example:
        'Forutsi hva som skjer når premium block blobs kombineres med Queue. Kjør først den kombinasjonen og deretter samme tjeneste i GPv2. Hold tjenesten fast mens du endrer kontotypen, slik at forklaringen faktisk handler om kompatibilitet.',
      limit:
        'Dette er læringsmodeller, ikke en Azure Portal for Storage. En støttet kombinasjon beviser ikke autorisasjon eller en faktisk respons, og guidet arbeid er aldri selvstendig vurdering.',
    },
  },
  part: 'Part A · kontoer og tjenester',
} as const;

export const storageItemsNb = {
  sa01: {
    title: 'Lydarkivet skal nå nye klienter',
    problem:
      'Et museum tilbyr ferdige lydspor til nettlesere og en ny mobilklient. Filene byttes sjelden; begge klientene henter hvert spor ved en kjent objektadresse.',
    premises: [
      'Applikasjonen kan bruke HTTPS-baserte objektoperasjoner.',
      'Ingen klient trenger å montere et filområde eller endre deler av filen gjennom en filprotokoll.',
      'Tilgang til lydsporene skal fortsatt autoriseres.',
    ],
    decisions: [
      'Lagre sporene på en managed disk og dele diskreferansen.',
      'Bruk Blob Storage med containere og navngitte objekter.',
      'Bruk en Azure Files-share som begge klienter må montere.',
    ],
    reasons: [
      'Dataene er binære mediefiler, så klientene trenger en delt filprotokoll for å lese dem.',
      'Et globalt navnerom gjør objektadressen til en lesetillatelse.',
      'Klientene trenger navngitte objekter over et API, uten et montert filsystem.',
    ],
    decisive:
      'Objekttilgang over HTTPS er den avgjørende klientkontrakten. Konto og URL gir ikke anonym tilgang. En disk- eller shareløsning ville kreve andre klient-/tjenestekomponenter.',
    feedback: [
      [
        'En managed disk er et blokknivåvolum til en VM, ikke en objektadresse som de to klientene kan lese. Den passer hvis et VM-operativsystem trenger et volum.',
        'Blob organiserer sporene som objekter i en container og passer den deklarerte API-klienten. Autorisasjon må fremdeles håndteres.',
        'Files passer klienter som trenger monterte delte filer. Her ville det innføre en filprotokoll som ingen av klientene etterspør.',
      ],
      [
        'Filinnholdet avgjør ikke protokollen. Lyd kan ligge som Blob; en share blir relevant når klienten trenger delte filoperasjoner.',
        'En kjent offentlig adresse opphever ikke autorisasjon. Blob-data blir ikke anonyme av kontoopprettelse.',
        'Dette begrunner Blob-valget under disse premissene. Ved et senere krav om delte filoperasjoner må klientkontrakten vurderes på nytt.',
      ],
    ],
  },
  sa02: {
    title: 'Produksjonsprogram uten kodeendring',
    problem:
      'Et produksjonsprogram åpner og låser tegninger på en delt SMB-sti. To eksisterende Windows-klienter skal fortsette å bruke samme filoperasjoner.',
    premises: [
      'Klientene kan nå nødvendig nettverk og skal gis riktige tillatelser.',
      'Programmet skal ikke omskrives til objekt-API.',
      'Det kreves ikke NFS eller en blokk-enhet til én VM.',
    ],
    decisions: [
      'Velg en Azure Files SMB-share med støttet konto og tilgang.',
      'Legg tegningene i en vanlig Blob Container og behold klientkoden.',
      'Bruk en managed datadisk som automatisk felles SMB-tjeneste.',
    ],
    reasons: [
      'Objektnavn kan inneholde katalogstier, så Blob dekker de samme filoperasjonene som SMB.',
      'SMB-fildeling passer klientkontrakten; nettverk og rettigheter må kvalifiseres.',
      'Et managed blokkvolum har varige data, så flere klienter kan bruke det som samme SMB-share.',
    ],
    decisive:
      'SMB-filsystemkontrakten skal bevares. Files passer; Blob og en vanlig managed disk gir ikke automatisk den kontrakten.',
    feedback: [
      [
        'Files SMB kan bevare filorientert tilgang. Støttet konfigurasjon, klientnettverk og rettigheter må fremdeles være på plass.',
        'En vanlig API-basert Blob Container er ikke en SMB-share. Blob ville passe hvis programmet ble endret til objektoperasjoner.',
        'En disk kan brukes av en VM som driver en filserver, men det er ekstra compute og administrasjon; disken alene er ingen Azure Files-tjeneste.',
      ],
      [
        'Et objektnavn kan ligne en katalogsti uten å gi SMB-operasjoner eller fil-låsing. Blob passer objektklienter; en montert filkontrakt må støttes av en egnet filflate.',
        'Begrunnelsen kobler ønsket mekanisme til tjenesten uten å anta at en share automatisk gir alle tilgang.',
        'Flere klienter skaper ikke filserverfunksjon i en managed disk. Særlige delte diskoppsett krever egne vilkår og er ikke denne SMB-tjenesten.',
      ],
    ],
  },
  sa03: {
    title: 'Når arkivklienten endrer kontrakt',
    problem:
      'Et medieteam har hittil lest ferdige objektfiler via HTTPS. Et nytt redigeringsprogram må i stedet jobbe mot en montert SMB-sti og dele filer med de eksisterende redigeringsklientene.',
    premises: [
      'Programmet kan ikke omskrives til objektoperasjoner i denne leveransen.',
      'Det nye kravet gjelder delte filoperasjoner, ikke bare nedlasting av en ferdig fil.',
      'Eksisterende distribusjonsklienter må fortsatt bruke sine stabile HTTPS-objektadresser.',
    ],
    decisions: [
      'Behold samme Blob-oppsett fordi innholdet fortsatt er video.',
      'Flytt bare objektene til en premium page blob-konto.',
      'Tilby Azure Files SMB for redigeringen og behold en separat Blob-publiseringsflate.',
    ],
    reasons: [
      'Redigering og publisering trenger ulike klientkontrakter og en planlagt dataflyt.',
      'Premiumytelse kan erstatte de to klientenes ulike lagringsgrensesnitt.',
      'De opprinnelige objektene kan gjenbrukes, så publiseringskontrakten bør styre også SMB-klienten.',
    ],
    decisive:
      'Det nye SMB-redigeringskravet må kombineres med fortsatt HTTPS-objektdistribusjon. En egnet filflate og en eksplisitt separat publiseringsflyt dekker forskjellige behov; selve overføringen utføres ikke her.',
    feedback: [
      [
        'Et uendret objektoppsett dekker ikke kravet til monterte SMB-filer. Det kan fortsatt passe publisering av ferdige objekter.',
        'Page blobs er en Blob-type med annen oppdateringsmekanisme; premium page blobs gir ikke Azure Files SMB.',
        'Files SMB passer redigeringsklienten, mens Blob kan bevare de eksterne objektadressene. Tilgang og publisering/dataflyt må planlegges; de oppstår ikke automatisk.',
      ],
      [
        'Dette forklarer hvorfor et nytt klientkrav kan trenge en ekstra tjenesteflate uten at det gamle objektbehovet forsvinner.',
        'Premium er en funksjons-/ytelsesfamilie, ikke en automatisk protokolladapter.',
        'Samme bytes kan brukes gjennom forskjellige mekanismer. Kravene til klienttilgang må vurderes på nytt.',
      ],
    ],
  },
  sa04: {
    title: 'To aktive workers, samme import',
    problem:
      'En importjobb varer lenger enn meldingens visibility-periode. Worker A lever fortsatt og behandler data når worker B får den samme jobb-ID-en fra Queue. Klientene trenger også et varig sted å lese importstatus.',
    premises: [
      'Løsningen bruker Azure Queue Storage.',
      'Mottak og sletting er separate handlinger.',
      'Samme import skal ikke gi gjentatt forretningseffekt. En meldingstelling er ikke importens varige statusregister.',
    ],
    decisions: [
      'Slett ved mottak og behandle det som bevis på at importen er fullført.',
      'Behold køen, håndter visibility under arbeid og utform idempotens samt separat varig jobbstatus.',
      'Bruk bare Table-oppføringer og forvent automatisk arbeidstildeling uten claim-/workerlogikk.',
    ],
    reasons: [
      'Visibility kan utløpe før jobben er ferdig; jobbstatus og sideeffekt må håndteres i appen.',
      'Kølagring fram til sletting betyr at en mottatt melding dokumenterer ferdig arbeid.',
      'Et varig Table-register kan overta køens arbeidstildeling uten ny logikk.',
    ],
    decisive:
      'Ny levering er mulig også uten et krasj når visibility utløper. Applikasjonen må vurdere passende fornyelse og varig idempotens, og lagre jobbstatus separat fra køens meldingsantall. En lease er ingen garanti for nøyaktig én applikasjonseffekt.',
    feedback: [
      [
        'Sletting ved mottak kan miste arbeidsoppgaven dersom behandlingen feiler etterpå. Mottak eller fravær fra køen beviser ikke fullført import.',
        'Dette håndterer den lange jobbens synlighet, gjentatt effekt og status som separate ansvar. Varig idempotens må koordineres med dataoppdateringen; køen kan fremdeles levere igjen.',
        'Table kan lagre status-/idempotensdata, men starter ikke workers eller tildeler importjobber av seg selv. En egen arbeidstildelingsmekanisme måtte utformes.',
      ],
      [
        'Begrunnelsen adresserer både den utløpte visibility-perioden og skillet mellom kølevering, forretningseffekt og et eget statusregister.',
        'Meldingslagring og mottak dokumenterer ikke at importen er ferdig. Den første workeren kan fortsatt arbeide når visibility utløper; jobbstatus må styres av applikasjonens faktiske behandling.',
        'Table kan lagre status, men tildeler ikke arbeid uten applikasjons-/claimlogikk. Et statusregister kan supplere køen; det erstatter ikke kømekanismen ved navnevalg alene.',
      ],
    ],
  },
  sa05: {
    title: 'Enhetsregister med forskjellige egenskaper',
    problem:
      'Et teknisk register finner sensorer ved anleggskode og sensor-ID. Noen sensorer har måleområde, andre har firmwaretype; klienten kjenner begge identifikatorene før oppslaget.',
    premises: [
      'Det kreves ikke SQL-joins, foreign keys eller vilkårlige sekundærindekser.',
      'Anleggskoden og sensor-ID-en kan brukes som et stabilt nøkkelpar.',
      'Ulike anlegg kan ha samme lokale sensor-ID.',
    ],
    decisions: [
      'Bruk en Queue der mottak sletter en sensor etter oppslag.',
      'Bruk en Blob Container som automatisk oppretter relasjonelle indekser.',
      'Bruk Table Storage-entities med et begrunnet PartitionKey/RowKey-par.',
    ],
    reasons: [
      'RowKey brukes som et identifikatorfelt, så sensor-ID-en må være unik på tvers av alle anlegg.',
      'Kjente PartitionKey/RowKey-par gir entydige oppslag selv om entity-egenskapene varierer.',
      'Strukturerte entities gir relasjonelle joins uten nytt datadesign.',
    ],
    decisive:
      'Tilgangsmønsteret samsvarer med nøkkelbaserte entities. Samme RowKey kan brukes under forskjellige PartitionKey; hele paret er identiteten i tabellen.',
    feedback: [
      [
        'En kø er for arbeidsmeldinger, ikke varig tilfeldig oppslag i et sensorregister. Den kan varsle at en sensoroppdatering skal behandles.',
        'Blob kan lagre registereksporter som objekter, men lager ikke automatiske relasjonelle indekser i innholdet.',
        'Table passer det angitte ikke-relasjonelle oppslaget. Valg av nøkler og klientvalidering er applikasjonsansvar.',
      ],
      [
        'Unikheten gjelder nøkkelparet innen en table. En lokal sensor-ID kan derfor gjenbrukes for et annet anlegg.',
        'Begrunnelsen treffer både tilgangsmønsteret og variasjonen i egenskaper uten å gi Table SQL-egenskaper.',
        'Fleksible egenskaper betyr ikke at tjenesten har joins eller indekserer alle egenskaper. Et annet spørringsbehov kan kreve et annet datadesign.',
      ],
    ],
  },
  sa06: {
    title: 'Rapporten krever relasjonell sammenheng',
    problem:
      'Et økonomisystem trenger server-side SQL-joins mellom betalinger, ordrelinjer og kunder samt relasjonelle integritetsregler. Teamet foreslår Table Storage fordi dataene ser tabulære ut.',
    premises: [
      'SQL-mekanismen er et eksplisitt krav, ikke bare en foretrukket visningsform.',
      'Det er ikke avtalt å omskrive hele spørringsmodellen til nøkkelbasert NoSQL.',
      'Lagring som objekter eller arbeidsmeldinger oppfyller heller ikke dette kravet.',
    ],
    decisions: [
      'Vurder en egnet relasjonell databasetjeneste utenfor de fire account-tjenestene.',
      'Velg Table Storage og forvent at tabellnavnet innebærer en SQL-motor.',
      'Velg Queue Storage og la meldingsrekkefølgen håndtere foreign keys.',
    ],
    reasons: [
      'Økonomidata er strukturerte rader, så et fleksibelt entity-skjema dekker de relasjonelle kravene.',
      'En kø kan skille produsent fra konsument, så meldingsflyten håndhever referanser mellom postene.',
      'Et krav om SQL-joins og relasjonsregler oppfylles ikke av Table-tjenestens keyed entities.',
    ],
    decisive:
      'Det riktige valget kan ligge utenfor de fire tjenestene. Her er SQL-/relasjonskravet avgjørende; modulens tjenesteutvalg skal ikke tvinge frem et feil svar.',
    feedback: [
      [
        'En relasjonell tjeneste kan vurderes mot kravene; denne oppgaven lover ingen konkret databasekonfigurasjon eller migrering.',
        'Table passer kjente nøkkelbaserte oppslag og fleksible entities, men gir ikke de etterspurte SQL-mekanismene.',
        'Queue fordeler arbeid, men er ikke en database med foreign keys. Den kan inngå rundt en database uten å erstatte den.',
      ],
      [
        'Strukturerte egenskaper er ikke i seg selv relasjonell funksjonalitet. Mekanisme og spørringskrav må passe.',
        'En kø gir ikke referanseintegritet. Meldinger og databaseposter har forskjellige roller.',
        'Dette forklarer hvorfor en ellers nyttig NoSQL-tjeneste er feil under de endrede kravene.',
      ],
    ],
  },
  sa07: {
    title: 'Jobbkø ved siden av premiumobjekter',
    problem:
      'Et analyseverktøy bruker premium block blobs for mange små objektoperasjoner. Teamet vil nå lagre asynkrone jobbreferanser i en Queue og antar at samme premium account støtter det.',
    premises: [
      'Det eksisterende premiumbehovet for objektene skal beholdes.',
      'Køen trenger Azure Queue Storage, ikke en applikasjonsbygd kø inne i Blob.',
      'Region-/funksjonsstøtte for de valgte moderne account-typene forutsettes i eksemplet.',
    ],
    decisions: [
      'Slå på Queue i premium block blob-kontoen uten å endre type.',
      'Bytt den eksisterende kontoen til premium page blobs for å få Queue.',
      'Behold objektkontoen og bruk en Standard GPv2-konto for købehovet.',
    ],
    reasons: [
      'Premiumobjekter har høy lagringsytelse, så samme premiumkonto dekker også meldingsarbeidslasten.',
      'HTTPS gjør at page blobs og kømeldinger kan dele account-familie.',
      'Queue støttes av GPv2, mens premium block blobs dekker et annet tjenesteutvalg.',
    ],
    decisive:
      'Tjenestekompatibiliteten gjør en separat GPv2-konto til en forsvarlig løsning uten å oppheve det eksisterende premiumobjektkravet.',
    feedback: [
      [
        'Det finnes ingen modellert Queue-støtte i premium block blobs. Et tjenestenavn i en plan aktiverer ikke funksjonen.',
        'Premium page blobs støtter page blobs, ikke Queue. Den endringen dekker heller ikke det erklærte block-blob-behovet.',
        'Dette bevarer det første behovet og plasserer Queue i en type som støtter den under de deklarerte forutsetningene.',
      ],
      [
        'Premium er spesialisert, ikke en universell superset. Kontotype må kontrolleres per tjeneste.',
        'Felles HTTP-transport gjør ikke datastruktur eller tjenestestøtte lik.',
        'Begrunnelsen adresserer den faktiske typegrensen uten å hevde at kontoopprettelse beviser runtime eller adgang.',
      ],
    ],
  },
  sa08: {
    title: 'Linux-share og en separat kø',
    problem:
      'Et laboratorium trenger en classic Azure Files NFS-share til Linux-klienter og en Queue for bakgrunnsarbeid. Et provisioned HDD FileStorage-oppsett er foreslått for alt.',
    premises: [
      'Studioets account-baserte management-modell brukes.',
      'Nødvendig region-/funksjonsstøtte, nettverk og tillatelser for egnede typer er eksplisitt forutsatt.',
      'Kravene kan fordeles på mer enn én account.',
    ],
    decisions: [
      'Bruk egnet SSD-file-account for NFS og GPv2 for Queue.',
      'Bruk HDD-file-account for NFS og Queue i samme konto.',
      'Bruk premium block blobs for både NFS-file-share og Queue.',
    ],
    reasons: [
      'FileStorage gir samme protokollstøtte på HDD og SSD.',
      'NFS trenger egnet SSD Files-støtte her; Queue krever en annen støttet kontofamilie.',
      'Klientene har en fungerende nettverksvei, så kontoens tjenesteutvalg kan behandles som avklart.',
    ],
    decisive:
      'To forskjellige behov kan kreve forskjellige account-familier. Top-level Microsoft.FileShares er et annet dokumentert NFS-alternativ, men er ikke account-modellen i disse premissene.',
    feedback: [
      [
        'Dette dekker de to ulike tjenestemekanismene under de deklarerte vilkårene. SSD-file-accounten støtter ikke køen; derfor skilles de.',
        'HDD gjør ikke classic NFS støttet i modellen, og FileStorage er uansett bare for Files.',
        'Premium block blobs gir ikke de to forespurte tjenestene. Blob-spesifikke NFS-muligheter er ikke Azure Files NFS.',
      ],
      [
        'FileStorage er ikke ensbetydende med SSD, og file accounts tilbyr ikke Queue. Media og tjeneste må vurderes separat.',
        'Begrunnelsen kobler begge kravene til støttede tjenester, i stedet for å behandle premium som universell støtte.',
        'Nettverksvei kan være nødvendig, men endrer ikke hvilke tjenester accounttypen tilbyr.',
      ],
    ],
  },
  sa09: {
    title: 'Tilføying til objektlogger',
    problem:
      'Et system skal skrive append blobs og hente block blobs med et eksplisitt krav om premium SSD-objektlagring. Teamet har valgt en premium page blob-account.',
    premises: [
      'Det trengs ikke et VM-blokkvolum eller en montert file share.',
      'Kravet er Blob-typer: append og block, ikke page.',
      'Støtte i den valgte regionen for et egnet premiumalternativ forutsettes.',
    ],
    decisions: [
      'Behold premium page blobs for alle Blob-typer.',
      'Velg premium block blobs for det deklarerte objektbehovet.',
      'Velg en provisioned SSD-file-account fordi den også bruker SSD.',
    ],
    reasons: [
      'Premium block blobs støtter block og append; premium page blobs dekker page.',
      'SSD gir raskere lagringsoperasjoner, så en SSD-file-account kan utføre ønskede Blob-operasjoner.',
      'Alle valgene er Azure-lagring, så Blob-typen kan velges uavhengig av accountens tjenestestøtte.',
    ],
    decisive:
      'Både Blob-type og account-familie må passe. Samme media eller produktfamilienavn fjerner ikke den konkrete funksjonsgrensen.',
    feedback: [
      [
        'Premium page blobs passer page-baserte behov, men er ikke den erklærte block-/append-kombinasjonen.',
        'Dette dekker Blob-typene og det eksplisitte premiumobjektkravet under de oppgitte forutsetningene.',
        'SSD-file-accounten er for file shares, ikke Blob-operasjoner. Den kan passe et SSD-baserte filprotokollbehov.',
      ],
      [
        'Dette er den dokumenterte kompatibilitetsforskjellen som løser situasjonen.',
        'SSD beskriver media, ikke at tjenestene har identiske API-er eller datakontrakter.',
        'Accountfamilien kan begrense Blob-typen. Felles produktnavn er ikke nok for et korrekt design.',
      ],
    ],
  },
  sa10: {
    title: 'Databasefil inne i en VM',
    problem:
      'En databaseprosess kjører i en eksisterende VM og trenger et vedvarende blokknivåvolum for sine datafiler. Den skal ikke publisere filene direkte som objekter til webklienter.',
    premises: [
      'VM-størrelse, diskstøtte og antall tilkoblinger må være passende i et virkelig design.',
      'Prosessen forventer et volum som operativsystemet kan håndtere.',
      'Denne oppgaven ber ikke om en administrert database eller en eksportflyt.',
    ],
    decisions: [
      'Vurder en egnet managed datadisk til VM-en.',
      'Legg en Queue inn som VM-ens blokkenhet.',
      'Bruk en vanlig Blob Container som om den allerede var VM-ens datadisk.',
    ],
    reasons: [
      'OS-diskrelasjonen dokumenterer også de andre Storage-målene.',
      'Et Blob-objekt med databasefilens navn kan brukes som samme tilkoblede blokkvolum.',
      'VM-klienten trenger et blokkvolum; objekt- og meldingstjenester har andre I/O-kontrakter.',
    ],
    decisive:
      'Det eksplisitte volumkravet begrunner en managed disk-vurdering. Dette gir ingen automatisk kompetanse om account-tjenestene og ingen påstand om gjestehelse.',
    feedback: [
      [
        'En managed datadisk passer den angitte blokklagringsrollen; en faktisk løsning må fremdeles kvalifisere størrelse, type og VM-støtte.',
        'En kø lagrer arbeidsmeldinger, ikke blokker som operativsystemet kan bruke som disk.',
        'Blob kan lagre eksporter eller objekter, men en vanlig container er ikke allerede en tilkoblet datadisk.',
      ],
      [
        'En faktisk ressursrelasjon er kontekst, ikke bevis for at studenten forstår andre lagringsmekanismer.',
        'Filnavnet endrer ikke klientens I/O-kontrakt. Objektlagring og blokkvolum er forskjellige grensesnitt.',
        'Begrunnelsen skiller VM-volum fra account-organiserte datatjenester uten å hevde at disken har startet et operativsystem.',
      ],
    ],
  },
  sa11: {
    title: 'Eksporten skal ut av VM-klienten',
    problem:
      'Et rapportprogram i en VM produserer ferdige eksportfiler. Eksterne applikasjoner skal hente hver eksport via HTTPS med objektidentifikator; de skal ikke koble til VM-ens filsystem.',
    premises: [
      'VM-en har allerede en managed datadisk.',
      'Eksportene er ferdige objekter, ikke delte filer under samtidig redigering.',
      'En separat dataflyt og autorisasjon må etableres; den utføres ikke av denne oppgaven.',
    ],
    decisions: [
      'Send managed disk-ID-en til de eksterne klientene som objektadresse.',
      'Bytt datadisken til en Queue og la klientene hente blokker.',
      'Vurder Blob Storage for de ferdige eksportobjektene.',
    ],
    reasons: [
      'En varig eksportfil gir diskreferansen samme rolle som en objektadresse.',
      'Eksterne klienter trenger objektlesing; den eksisterende VM-disken gir ikke det grensesnittet.',
      'Et tilgjengelig navnerom gir eksportklientene den lesetilgangen de trenger.',
    ],
    decisive:
      'En eksisterende disk kan være riktig for intern produksjon, mens ferdige eksporter trenger en separat objektkontrakt. Ingen faktisk overføring eller offentlig publisering er gjennomført.',
    feedback: [
      [
        'Disk-ID er en ressursreferanse, ikke automatisk en autorisert eksport-URL for eksterne objektklienter.',
        'Queue lagrer arbeidsmeldinger. Den kan starte eksportarbeid, men erstatter ikke disken eller objektleveringen.',
        'Blob passer den nye objektlesingen. Overføring, publiseringsflyt og tilgang kommer i tillegg.',
      ],
      [
        'Protokollen i en klient lager ikke en ny datatjeneste rundt en disk. Det kreves en eksplisitt flyt eller tjeneste.',
        'Dette skiller datatjenestens egnethet fra faktisk dataflyt og autorisert tilgang.',
        'Account-eksistens gir ikke anonym Blob-lesing. Offentlig adresse og tillatelse er forskjellige forhold.',
      ],
    ],
  },
  sa12: {
    title: 'To klienter trenger et administrert filområde',
    problem:
      'To applikasjonsinstanser skal lese og skrive via et felles SMB-filområde. Forslaget er å opprette hver sin vanlige managed datadisk og anta at innholdet blir delt.',
    premises: [
      'Instansene forventer filshare-semantikk og har ikke en separat filserver-/klyngeløsning.',
      'Et særskilt Azure shared-disk-oppsett med egen applikasjonskoordinering er ikke del av kravet.',
      'Nødvendig Files-støtte, nettverk og tilgang må kvalifiseres.',
    ],
    decisions: [
      'Bruk hver sin disk og anta automatisk synkronisering.',
      'Vurder en Azure Files SMB-share for det felles filbehovet.',
      'Bruk en Table og anta at entities gir SMB-fil-låsing.',
    ],
    reasons: [
      'En share gir den delte SMB-kontrakten; separate blokkvolumer deler ikke innhold av seg selv.',
      'Administrert Azure-lagring synkroniserer filene mellom to disker.',
      'Filoversikten kan lagres som entities, så Table kan tilby de samme åpne-/låseoperasjonene som SMB.',
    ],
    decisive:
      'Kravet er en administrert delt filkontrakt. Eksistensen av managed disks oppretter verken en filshare eller automatisk synkronisering.',
    feedback: [
      [
        'Separate disker kan passe separate VM-volumer, men synkroniserer ikke data eller oppretter en SMB-tjeneste av seg selv.',
        'Files SMB er en relevant tjeneste for den ønskede delte filkontrakten under kvalifiserte forutsetninger.',
        'Table er for nøkkelbaserte entities, ikke en SMB-filshare. Det kan lagre metadata om filer uten å levere filprotokollen.',
      ],
      [
        'Dette begrunner tjenestevalget med klientmekanismen og beholder disk-/filshare-skillet.',
        'Administrert infrastruktur betyr ikke automatisk datasynkronisering mellom uavhengige volumer.',
        'Tabulære data gir ikke filsystemprotokoll eller fil-låsing bare ved å få et filrelatert navn.',
      ],
    ],
  },
} as const;
/** P09: original Bokmål manuscript. Part A's content and history are preserved. */
export const storageResilienceNb = {
  title: 'Storage Part B — Access Tiers & Redundancy',
  path: '02 — Azure Architecture & Services',
  part: 'Storage · Part B',
  perspective: 'Velg faglig undersøkelse',
  links: {
    title: 'Relevante forkunnskaper',
    partA: 'Storage Part A — tjenester og accounts',
    core: 'Core Architecture — Availability Zones',
    cost: 'Cost Management — bruk og total',
  },
  overview: 'Velg datatilgang og beskyttelse ut fra forskjellige behov.',
  prerequisites:
    'Bygg på Storage Part A: account, tjeneste og data er forskjellige nivåer. Core Architecture forklarer regioner og Availability Zones; Cost Management skiller enhetskostnad fra total bruk.',
  available:
    'To konseptuelle undersøkelser og nye selvstendige situasjoner. Resultatene tilhører Part B. File Movement & Migration kommer i P16.',
  topics: {
    introduction: 'Fra lagringstjeneste til tilgang og beskyttelse',
    tiers: 'Hot, Cool, Cold og Archive',
    lifecycle: 'Standardtier, lifecycle og rehydrering',
    redundancy: 'LRS, ZRS og geo-replikering',
    recovery: 'Sekundær lesing, failover og gjenoppretting',
    boundaries: 'Tjenestegrenser og kombinasjoner',
    studio: 'Tier & Resilience Studio',
    missions: 'Guidede undersøkelser',
    assessment: 'Selvstendig anvendelse',
    summary: 'Summary — Storage Part B',
  },
  sections: {
    introduction: {
      title: 'Fjordverk har valgt tjenester. Nå endrer behovene seg.',
      paragraphs: [
        'Fjordverk bruker Blob Storage til produktbilder, Azure Files til delte arbeidsdokumenter, Queue Storage til bakgrunnsarbeid og Table Storage til nøkkelbaserte produktdata. Det valget forklarer hvordan data brukes. Det svarer ikke alene på hvor raskt et gammelt bilde må kunne hentes, eller hva som skjer hvis en fysisk lokasjon blir utilgjengelig.',
        'To nye beslutninger følger. Access tier avveier lagringskostnad, brukskostnader og tilgangstilstand for relevante blobs. Redundans bestemmer hvordan data kopieres over fysiske feilgrenser. Et billig offline objekt kan ha flere geografiske kopier uten å kunne leses direkte. Et online objekt kan være raskt å lese så lenge den eneste berørte lokasjonen fungerer.',
        'Tilgjengelighet betyr at tjenesten kan brukes når den trengs. Varighet eller durability handler om at data bevares. Gjenoppretting betyr å få tilbake brukbare data eller funksjon etter en feil. Begrepene overlapper, men er ikke like: en bevart sekundær kopi kan kreve failover før skriving, og en korrekt replika kan inneholde en uønsket sletting.',
        'Fra Cost Management tar vi med totalperspektivet: antall GB, lagringsperiode, operasjoner, hentet datamengde, tier-endringer og eventuell tidlig avslutning påvirker kostnaden. Fra Core Architecture tar vi med at flere ressurser eller navn ikke beviser fysisk feilseparasjon. Her undersøker vi datakopier og betingelser, uten å opprette ressurser eller utføre Azure-operasjoner.',
      ],
      terms: [
        ['Access tier', 'En tilgangs- og kostnadsklasse for støttede Blob-data.'],
        [
          'Replika',
          'En vedlikeholdt datakopi, ikke automatisk en historisk gjenopprettingsversjon.',
        ],
        [
          'Feilgrense',
          'Omfanget som den deklarerte hendelsen rammer, for eksempel én lokasjon eller en hel region.',
        ],
      ],
      example:
        'Gamle kampanjebilder leses sjelden, men kundestøtte må hente dem mens kunden venter. Uavhengig av hvilken redundans Fjordverk velger, gjør dette kravet Archive uegnet som direkte leseflate. Et separat behov for regional beredskap må vurderes i tillegg.',
      limit:
        'Modellene antar datatyper, hendelser og støtte. De måler ikke Azure-tilgjengelighet, applikasjonshelse, priser eller faktisk replikering. Å åpne en side gir ingen faglig fullføring.',
    },
    tiers: {
      title: 'Online eller offline er en teknisk forskjell, ikke bare en prislapp',
      paragraphs: [
        'Hot er en online tier for data som leses eller endres ofte. Lagringskostnaden er relativt høy, mens tilgang og operasjoner normalt koster mindre enn i kjøligere tiers. Aktive produktbilder og datasett som bearbeides gjentatte ganger er typiske kandidater. Hot betyr ikke ubegrenset kapasitet, garantert responstid eller automatisk autorisasjon.',
        'Cool er også online. Data kan leses uten rehydrering, men lavere lagringskostnad byttes mot høyere kostnader ved tilgang og relevante operasjoner. For manuelt valgte Cool-blobs i standard GPv2 gjelder normalt en faktureringsperiode på minst 30 dager. En sjeldnere brukt rapport som må være tilgjengelig direkte, kan passe bedre her enn i Hot.',
        'Cold er online for data som brukes enda sjeldnere og fortsatt trenger rask gjenfinning. I standard GPv2 er den tilsvarende minimumsperioden90 dager. Cold er ikke et annet navn på Archive. En sjelden lesing utløser ikke først en overgang fra offline til online. Høyere hentekostnader og relevante tilgjengelighetsvilkår må likevel vurderes.',
        'Archive er offline. Selve blob-innholdet kan ikke leses eller endres på vanlig måte før rehydrering til Hot, Cool eller Cold er fullført. Det kan fortsatt være mulig å liste objektet og lese relevante egenskaper; en vellykket listing beviser derfor ikke lesbart innhold. Archive passer langsiktig, sjelden brukt materiale med fleksibel hentetid. Normal minimumsperiode er180 dager.',
        'Minimumsperiodene er faktureringsregler, ikke generelle tekniske låser. Hvis et objekt slettes, overskrives eller flyttes ut av en tier for tidlig, kan resterende periode bli belastet forholdsmessig. Et Cool-objekt som slettes etter 20 dager kan for eksempel få en tidlig-slettingskostnad for10 resterende dager. Retention/immutability er egne funksjoner og må ikke forveksles med denne betalingen. Soft delete kan påvirke når en sletting regnes som endelig.',
        'Velg etter forventet bruk, ikke bare hva som skjedde sist måned. En produktlansering kan gjøre sjeldne bilder aktive igjen. Lavest lagringskostnad er da ikke nødvendigvis lavest totalkostnad. I Studio bruker vi synlige, fiktive indekspoeng for å undersøke drivere. Tallene er verken Azure-priser, tilbud eller bevis for hvilken tier som alltid er billigst.',
      ],
      terms: [
        [
          'Online',
          'Innholdet krever ingen Archive-rehydrering før vanlig lesing; øvrige tilgangskrav gjelder fortsatt.',
        ],
        ['Offline', 'Archive-innhold må bringes til en online tier før det kan leses.'],
        [
          'Early deletion charge',
          'En mulig faktureringskonsekvens når data forlater tier før minimumsperioden er oppfylt.',
        ],
      ],
      example:
        'Et midlertidig datasett på 2 GiB brukes intensivt og kastes etter 12 dager. Cool har lavere lagringspris per dag enn Hot, men flere lesinger og eventuell fakturering for gjenstående minimumsperiode kan snu totalen. Det riktige spørsmålet er hvilken kombinasjon som dekker bruken og kostnadsdriverne.',
      limit:
        '30/90/180 gjelder de beskrevne manuelt styrte standard-blobbetingelsene. Legacy account-typer og Smart tier har andre forbehold. Dette er ikke universelle oppbevaringskrav for Azure Files, Queues, Tables eller managed disks.',
    },
    lifecycle: {
      title: 'En policy kan flytte data uten å forstå neste ukes bruk',
      paragraphs: [
        'En standard GPv2-account kan ha en standard online tier. Blobs uten eksplisitt tier arver innstillingen. Endres account-default, kan den derfor endre tier for disse blobene, med relevante operasjons- og hentekostnader. En blob med eksplisitt Hot blir ikke automatisk Cold fordi account-default endres til Cold. Archive kan ikke være vanlig account-default.',
        'Lifecycle management bruker deklarerte regler, filtre og betingelser, for eksempel tid siden endring eller siste tilgang når tilgangssporing er konfigurert. En regel kan flytte kvalifiserte block blobs til kjøligere tiers eller slette kvalifiserte objekter. Dette er periodisk behandling, ikke et presist tidspunkt eller en garanti om at data alltid er billigst lagret. Policybehandling og tilgangssporing kan gi kostnader selv om selve policyen ikke har en egen fast pris.',
        'Rehydrering er et eget forløp. Ved Set Blob Tier flyttes samme arkiverte blob til en online tier; innholdet er fortsatt offline mens forespørselen behandles. Ved Copy Blob opprettes en ny online kopi når kopieringen er ferdig, mens arkivkilden kan beholdes. Å beholde kilden kan unngå tidlig-slettingskostnad på den, men gir kostnader for kopiering, henting og to lagrede objekter. Ikke slett arkivkilden før kopieringen er bekreftet fullført.',
        'Rehydrering kan ta timer, og påvirkes blant annet av prioritet, størrelse, volum og kapasitet. Høy prioritet koster mer og er ikke et løfte om umiddelbar henting. Et synlig nytt objektnavn eller en registrert forespørsel er ikke bevis for at innholdet er online. Planlegg og kontroller fullføring. Studio har eksplisitte deklarerte tilstander; ingen klokke, kø eller Azure-henting kjører.',
        'Lifecycle management kan ikke rehydrere Archive-blobs til online. Dessuten endrer ikke Set Blob Tier objektets last-modified-tid. En gammel blob kan derfor bli kvalifisert for arkivering på nytt ved en senere policykjøring. Et passende vilkår basert på siste tier-endring, eller en ny kopi med ny last-modified-tid, kan motvirke denne sløyfen. Vilkårene må passe den faktiske policyen; rehydrering alene retter ikke reglene.',
        'Gjeldende Smart tier styrer støttede block blobs automatisk mellom Hot, Cool og Cold, uten Archive. Det krever standard GPv2 og zonal redundans: ZRS, GZRS eller RA-GZRS. Det er generelt tilgjengelig i offentlige skyregioner med slik støtte; Government/21Vianet er fortsatt preview ifølge den kontrollerte siden. Smart settes som account-default og tar ikke over blobs med eksplisitt tier. Objekter under 128 KiB forblir i Hot; tilgang kan flytte kvalifiserte objekter tilbake dit.',
        'Smart har egne faktureringsvilkår, blant annet overvåking av kvalifiserte objekter og unntak fra ordinære interne tier-overgangs-, early-deletion- og hentekostnader. Det gjør ikke alle operasjoner eller all lagring gratis. Støtte, konvertering og failover har egne begrensninger. Smart er kort produktkontekst, ikke et nytt AZ-900-mål eller en funksjon som Studio forsøker å emulere.',
      ],
      terms: [
        ['Inferred tier', 'Tier følger account-default fordi bloben ikke har en eksplisitt tier.'],
        [
          'Rehydration pending',
          'Henting er forespurt, men Archive-innholdet er ennå ikke klart for vanlig lesing.',
        ],
        [
          'Lifecycle condition',
          'En deklarert betingelse som må være oppfylt for en regelhandling.',
        ],
      ],
      example:
        'En juridisk eksport har ligget i Archive i 200 dager. En ny lesbar kopi kan brukes i en undersøkelse mens originalen beholdes. Hvis man i stedet endrer originalens tier, må en gammel last-modified-basert arkivregel vurderes: den kan ellers arkivere dataene på nytt ved senere kjøring.',
      limit:
        'Ingen faktisk policy, Copy Blob, Set Blob Tier eller Smart-motor opprettes. Premium block blob-accounts kan ikke bruke de vanlige Hot/Cool/Cold/Archive-overgangene på samme måte. Snapshot/versjon, immutability, encryption scopes og aktiverte funksjoner kan gi ytterligere grenser.',
    },
    redundancy: {
      title: 'Hvor mange kopier hjelper først når feilgrensen er kjent',
      paragraphs: [
        'Locally Redundant Storage, LRS, holder synkrone kopier innen én fysisk lokasjon i primærregionen. Kopiene beskytter mot for eksempel disk-, server- og rackfeil. Hvis en brann eller annen lokasjonsomfattende hendelse rammer alle kopiene, er tre kopier der ikke det samme som tre uavhengige feilgrenser. Account-navn og resource groups endrer ikke dette.',
        'Zone Redundant Storage, ZRS, replikerer synkront over minst tre Availability Zones i primærregionen. Sonene har separat strøm, kjøling og nettverk. En sone er en feilgrense og kan omfatte flere datacentre; diagrammet her viser representative steder, ikke faktiske Azure-bygninger. ZRS er relevant når data skal holdes i regionen og forbli tilgjengelige ved en sonehendelse. Nettverksoppdateringer og forbigående feil krever fortsatt hensyn i klienten.',
        'Synkron replikering knytter fullføring av en normal skriving til replikaene som deltar i den tilgjengelige konfigurasjonen. Det betyr ikke at kundens hele applikasjon kjører synkront eller at alle fremtidige feil er dekket. Når en sone er utilgjengelig, kan tjenesten fortsette med tilgjengelige soner etter sine regler. Vi modellerer ikke quorum, timing eller virkelige service-SLA-er.',
        'Geo Redundant Storage, GRS, bruker LRS i primærregionen og asynkron kopiering til en sekundærregion, som også har LRS. Geo-Zone Redundant Storage, GZRS, bruker i stedet ZRS i primærregionen før den asynkrone geo-kopieringen. Forskjellen mellom GRS og GZRS ligger derfor særlig i den primære feilseparasjonen, ikke i at sekundærregionen plutselig får ZRS.',
        'Asynkron betyr at en skriving kan være bekreftet i primærregionen før den finnes i sekundærregionen. Dersom primærregionen går tapt, kan nylige data mangle i sekundærkopien. Geo-redundans er derfor ikke en generell garanti om null datatap. Last Sync Time kan støtte en vurdering av hvilke tidligere skriv som er kopiert; den gjør ikke alle senere skriv sikre. Nye spesialfunksjoner kan ha egne vilkår, men vi antar ingen konkret RPO eller tidsgaranti her.',
        'Redundans velges for accounten og deles av de aktuelle lagringstjenestene som accounten eksponerer. Støtte avhenger samtidig av tjeneste, account-type og region. En GPv2-account kan for eksempel ha en RA-variant uten at Azure Files får samme sekundære lesemulighet som Blob. Behov for forskjellige redundansregler kan kreve separate accounts. Valget må kontrolleres mot produktstøtten, ikke bare et sekskolonners navneskjema.',
      ],
      terms: [
        ['LRS / ZRS', 'Lokal synkron kopiering versus synkron kopiering over Availability Zones.'],
        ['GRS / GZRS', 'LRS eller ZRS i primærregionen, asynkront til LRS i sekundærregionen.'],
        [
          'Asynkron geo-kopiering',
          'En sekundær kopi kan ligge etter allerede bekreftede primære skriv.',
        ],
      ],
      example:
        'Et laboratorium må holde aktive data innen én region, også ved tap av en sone. ZRS passer den fysiske feilgrensen bedre enn LRS. Hvis kravet senere blir en egen regional beredskapskopi, må geo-alternativ og tillatt datalokasjon vurderes i tillegg; ZRS alene flytter ingen data til en annen region.',
      limit:
        'Modellen bruker representative kopier, en deklarert hendelse og valgte versjoner. Den utleder ingen faktisk Azure-plassering, replikeringsforsinkelse, SLA, RPO eller applikasjonshelse fra diagrammet.',
    },
    recovery: {
      title: 'Bevart kopi, lesbar sekundær og fungerende applikasjon er forskjellige trinn',
      paragraphs: [
        'Vanlig GRS og GZRS gir ikke direkte lesing eller skriving mot sekundærregionen før relevant failover. RA-GRS og RA-GZRS legger til read access for støttede tjenester. Applikasjonen må bruke og være laget for sekundærendpointet og kunne håndtere at data kan være eldre. Account-navnets -secondary-suffiks er en annen inngang, ikke en automatisk klientomkobling eller en ny autorisasjon.',
        'RA betyr read access. Det er ikke sekundær skriveadgang. Før failover skrives data fortsatt mot primærregionen. En applikasjon kan derfor fortsette i en begrenset lesemodus fra en støttet sekundær mens nye skriv venter eller feiler. Hvilken applikasjonsatferd som er forsvarlig, avhenger av datakravene; en betalingsløsning kan ikke uten videre behandle et eldre saldoresultat som oppdatert.',
        'Failover er en separat operasjon og en beredskapsbeslutning. Ved relevant fullført account-failover blir den tidligere sekundærregionen ny primær, og tjenesteendpointene oppdateres. Det garanterer ikke umiddelbar applikasjonsgjenoppretting: DNS, retry, nettverk, tilgang, andre datalagre, compute og inkonsistente data må fortsatt håndteres. Studio viser bare at en operasjon ville være nødvendig; det utfører den ikke.',
        'Planlagt kundestyrt failover krever at begge regioners relevante tjenester er tilgjengelige og har et annet datatapsgrunnlag enn en uplanlagt katastrofe. Ved uplanlagt failover kan skriv som ikke nådde sekundærregionen gå tapt. Konfigurasjon og geo-beskyttelse etterpå må kontrolleres; ikke anta at den gamle beredskapen automatisk fortsetter. Microsoft-styrt failover er for ekstreme hendelser og bør ikke være kundens eneste plan.',
        'Redundans vedlikeholder dataenes gjeldende tilstand. En feilaktig sletting eller overskriving kan derfor bli kopiert til alle replikaene. En RA-variant eller en annen region er ikke en pålitelig historisk undo-funksjon. Etterslep er heller ingen uavhengig backup. Gjenoppretting etter logiske feil trenger relevante forberedte mekanismer, for eksempel versjonering, soft delete eller en beskyttet backup, med riktig oppbevaring og testet restore.',
        'En restoreplan må også avgrense hvilke data som skal erstattes. Hvis bare én container er slettet mens andre har nye skriv, kan en støttet selektiv restore til et kontrollert mål og validert tilbakeføring bevare de upåvirkede dataene. Å erstatte alt med en gammel kopi kan ellers skape et nytt datatap. En backup gir mulighet for å hente en tidligere tilstand under sine egne vilkår. Hvor uavhengig den er, avhenger blant annet av plassering, tilgang og beskyttelse mot sletting. Ikke kall en ekstra aktiv replika en fullverdig backup, og ikke anta at en snapshot i samme feil-/tilgangsgrense dekker alle trusler. Sikkerhet og gjenoppretting utfyller fysisk redundans.',
      ],
      terms: [
        ['RA-GRS / RA-GZRS', 'Geo-alternativer med sekundær lesetilgang for støttede tjenester.'],
        [
          'Failover',
          'En separat overgang der sekundærregionen kan bli ny primær under produktets vilkår.',
        ],
        ['Backup / restore', 'En beskyttet tidligere tilstand og en plan for å hente den tilbake.'],
      ],
      example:
        'En nettbutikk har RA-GRS og en kopiert katalogversjon, men en ny lagerjustering finnes bare i primærregionen når den blir utilgjengelig. Sekundær kan gi eldre kataloglesing hvis klienten er laget for det. Den kan ikke ta imot nye skriv før relevant failover, og et regionalt skifte tryller ikke frem den manglende justeringen.',
      limit:
        'Ingen faktisk failover, routing, DNS-endring, restore eller feilretting av appen simuleres. Fysisk kopibeskyttelse, endpoint-tilgjengelighet, dataversjon og applikasjonsresultat rapporteres hver for seg.',
    },
    boundaries: {
      title: 'To riktige enkeltvalg kan være en ugyldig kombinasjon',
      paragraphs: [
        'Hot, Cool, Cold og Archive gjelder relevante block blobs, med account- og funksjonsvilkår. De kan ikke ukritisk settes på append/page blobs, Azure Files, Queues, Tables eller managed disks. Premium block blob-accounts har egne ytelses-/kostnadsegenskaper og støtter ikke den vanlige tieringen. Files har egne media- og pris-/tilgangsmodeller; navnelikhet gjør dem ikke til samme Blob-mekanisme.',
        'Archive støttes med LRS, GRS og RA-GRS, men ikke ZRS, GZRS eller RA-GZRS. En organisasjon som krever zonal tilgjengelighet i primærregionen, kan derfor ikke bare kombinere Archive med ZRS. Den må for eksempel beholde relevante data online, skille datasett og beredskapsbehov, eller endre et krav etter en bevisst avveining. En account med arkiverte blobs har dessuten egne begrensninger ved redundansendringer; ingen universell ett-klikks konvertering loves.',
        'Standard GPv2 kan støtte alle seks redundansalternativer for Blob, Queue og Table i aktuelle regioner. Premium block blob-accounts støtter LRS/ZRS; premium page blob-accounts LRS. Region, aktive funksjoner og valgt tjeneste må kontrolleres særskilt. En avkrysset antakelse om regional støtte i Studio er nettopp en antakelse, ikke et oppslag mot Azure.',
        'Azure Files har tjenestespesifikke grenser. SSD-shares bruker LRS eller ZRS, mens geo-alternativer gjelder støttede HDD SMB-shares og kombinasjoner av account, billing model og region. Files tilbyr ikke sekundær RA-lesing før failover: shares i en RA-GRS/RA-GZRS-account behandles for dette formålet som GRS/GZRS. Det er forskjell på at account-konfigurasjonen finnes og at en bestemt tjeneste får funksjonen.',
        'Managed disks er fortsatt separate VM-volumer fra Part A. De har egne LRS/ZRS-alternativer og ingen GRS/RA-GRS på selve diskressursen. ZRS støttes for aktuelle Premium SSD og Standard SSD, ikke Ultra eller Premium SSD v2 etter den kontrollerte dokumentasjonen. Hvis VM-en også feiler, må compute og disktilknytning håndteres; force detach gjelder data disks under egne vilkår og er ingen automatisk oppstart av en frisk VM.',
        'Det riktige valget begynner dermed med data, tilgangskrav og feilgrense. Deretter kontrolleres støttet kombinasjon, gjenværende datarisiko og en faktisk beredskapsplan. Part A-resultater beviser ikke automatisk Part B-forståelse, og en vellykket konseptkjøring er ikke en Azure-deployment eller et nytt teknisk receipt.',
      ],
      terms: [
        ['Account-level setting', 'Felles konfigurasjon med tjenestespesifikke funksjonsgrenser.'],
        ['Støtteforutsetning', 'Account, datatype, region og funksjoner må passe sammen.'],
        ['Uavhengige valg', 'Tier og redundans løser ulike behov, men kan ha kombinasjonsgrenser.'],
      ],
      example:
        'Et prosjekt trenger både online data under en sonehendelse og langtidsarkiv. Å sette hele datasettet til Archive i en GZRS-account er ikke støttet. En bevisst oppdeling kan la aktive data få zonal beskyttelse og la et annet, langsomt tilgjengelig arkiv få en støttet account-konfigurasjon.',
      limit:
        'Explorer-tabellene er avgrensede eksempler på deklarerte, moderne kombinasjoner. De erstatter ikke regional produktkontroll, service-SKU-dokumentasjon eller en faktisk arkitekturgjennomgang.',
    },
    studio: {
      title: 'Undersøk en konsekvens før du velger',
      paragraphs: [
        'Tier & Lifecycle Explorer følger et deklarert datasett fra lagret tier til lesetilstand og fiktive kostnadsdrivere. Endre ett sentralt krav, gjør en ny prediksjon og kjør eksplisitt. Sammenlign de lagrede resultatene. Feltet for rehydrering er en deklarert fase i eksempelet, ikke en faktisk start- eller fullføringsknapp for Azure.',
        'Replication & Resilience Explorer viser representative replikaer, primær/sekundær region og valgt feilhendelse. Versjon2 er det siste bekreftede primære skrivet i eksempelet; en deklarert eldre sekundær har bare versjon 1. Tallene uttrykker en datatilstand, aldri minutter eller en målt RPO. Les tabellen som alternativ til kartet.',
        'Prediksjon, modellresultat og årsaksforklaring har forskjellige roller. En feil prediksjon er en anledning til å undersøke mekanismen. En guidet aktivitet fullføres først når de nødvendige kontrastene faktisk er lagret og en faglig forklaring er levert. En selvstendig vurdering har sin egen historikk og gir ingen automatisk hjelp fra Studio.',
      ],
      terms: [
        [
          'Indekspoeng',
          'Synlige, fiktive vekter for å sammenligne kostnadsdrivere under samme forutsetninger.',
        ],
        ['Deklarert fase', 'En valgt tilstand i et eksempel, ikke observert Azure-runtime.'],
      ],
      example:
        'Kjør samme sjeldent brukte datasett med Cold og Archive mens rask lesing kreves. Endre så kravet til fleksibel henting og undersøk Archive lagret → forespurt → deklarert rehydrert. Kostnad, støtte og lesbarhet kan nå gi forskjellige svar.',
      limit:
        'Ingen operativ lagring, ekte penger, faktisk replikering, tidspassasje, policykjøring, upload eller ressurskommando. Endring av kontrollene erstatter ikke siste lagrede resultat før en ny kjøring.',
    },
  },
  labels: {
    ...storageNb.labels,
    model: 'Deterministisk konseptmodell · ingen Azure-operasjon',
    tiers: 'Tier & Lifecycle Explorer',
    replication: 'Replication & Resilience Explorer',
    configured: 'Deklarert datasett og forutsetninger',
    predict: 'Forutsi konsekvensen under disse forutsetningene',
    predictionOptions: [
      'Velg en prediksjon',
      'Avvist kombinasjon / ingen deklarert leseflate',
      'Data kan bevares, men et krav eller en operasjon gjenstår',
      'Deklarerte krav passer innen modellgrensen',
    ],
    amount: 'Datamengde i GiB',
    usage: 'Tilgangsmønster',
    days: 'Dager i valgt tier før planlagt endring',
    retrieval: 'Krav til hentetid',
    change: 'Planlagt endring ved periodens slutt',
    service: 'Datatype / tjeneste',
    account: 'Account for tier-eksempelet',
    tier: 'Eksplisitt blob-tier',
    replicaTier: 'Datasettets tilgangstilstand',
    defaultTier: 'Account-default',
    assignment: 'Hvordan tier velges',
    phase: 'Deklarert rehydreringsfase',
    rule: 'Lifecycle-forutsetning for et gammelt objekt',
    redundancy: 'Redundans',
    target: 'Tjeneste / account-eksempel',
    failure: 'Deklarert feilhendelse',
    lag: 'Deklarert sekundær dataversjon',
    region: 'Forutsett relevant regional/feature-støtte i dette eksempelet',
    costs: 'Fiktive kostnadsdrivere — ikke Azure-priser',
    capacity: 'Lagring',
    access: 'Tilgang / henting',
    early: 'Resterende minimumsperiode',
    total: 'Sum indekspoeng',
    matrix: 'Støtte og replikeringsmekanisme',
    replicas: 'Representativt replikakart',
    secondary: 'Sekundærregion',
    primary: 'Primærregion',
    location: 'Plassering',
    version: 'Deklarert versjon',
    copyState: 'Tilstand etter hendelsen',
    primaryRead: 'Primær leseflate',
    secondaryRead: 'Sekundær leseflate før failover',
    secondaryWrite: 'Sekundær skriving før failover',
    failover: 'Behov for separat failover',
    loss: 'Ikke kopiert siste skriv',
    app: 'Applikasjonsgjenoppretting',
    compare: 'Lagrede kontraster i dette oppdraget',
    supported: 'Støttet under de oppgitte typevilkårene',
    unverified: 'Regional støtte er ikke verifisert',
    nextPart: 'Fortsett til planlagt File Movement & Migration (P16)',
  },
  options: {
    service: {
      block: 'Block blob',
      append: 'Append/page blob',
      files: 'Azure Files',
      queue: 'Queue Storage',
      table: 'Table Storage',
      disk: 'Managed disk',
    },
    account: { standard: 'Standard GPv2', premium: 'Premium block blob' },
    usage: {
      frequent: 'Hyppig / aktiv bruk',
      occasional: 'Sporadisk bruk',
      rare: 'Sjelden bruk — ingen planlagt lesing i indeksperioden',
    },
    retrieval: {
      immediate: 'Vanlig lesing uten rehydrering',
      flexible: 'Kan vente på rehydrering',
    },
    change: {
      keep: 'Behold uten planlagt utgang',
      delete: 'Slett',
      overwrite: 'Overskriv',
      tier: 'Flytt til en annen tier',
    },
    assignment: { explicit: 'Eksplisitt på blob', inherit: 'Arv account-default' },
    phase: {
      stored: 'Lagret i Archive / ingen rehydrering',
      pending: 'Rehydrering forespurt, ikke fullført',
      complete: 'Forutsett fullført rehydrering til Hot',
    },
    rule: {
      none: 'Ingen arkivregel i eksempelet',
      unguarded: 'Gammel last-modified kvalifiserer fortsatt',
      guarded: 'Relevant vilkår for tid siden tier-endring hindrer ny arkivering nå',
    },
    target: {
      blob: 'Standard GPv2 · block blob',
      queue: 'Standard GPv2 · Queue',
      table: 'Standard GPv2 · Table',
      premiumBlob: 'Premium block blob-account',
      filesHdd: 'Støttet klassisk HDD SMB-share',
      filesSsd: 'SSD file share',
      diskSsd: 'Støttet Standard/Premium SSD managed disk',
    },
    failure: {
      rack: 'Én disk / ett rack',
      datacenter: 'Én fysisk lokasjon i primærregionen',
      zone: 'Én primær Availability Zone',
      region: 'Hele primærregionen',
      deletion: 'Logisk sletting som har nådd replikaene',
    },
    lag: {
      older: 'Siste primærskriv er ikke kopiert til sekundær',
      current: 'Alle deklarerte eksempel-skriv er kopiert',
    },
  },
  model: {
    outcome: [
      'Kombinasjon/leseflate avvist',
      'Et krav eller en operasjon gjenstår',
      'Deklarerte krav passer',
    ],
    snapshot: 'lagret eksempel',
    noRun: 'Ingen modellobservasjon er kjørt i dette oppdraget.',
    draftChanged:
      'Kontrollene er endret. Resultatet nedenfor gjelder fortsatt forrige lagrede kjøring.',
    unsupported: 'Avvist kombinasjon',
    phaseOnlyArchive:
      'Rehydreringsfase og arkivregel gjelder bare eksplisitt Archive. Andre tiers bruker ingen slik fase; de irrelevante feltene er deaktivert.',
    onlineDataset: 'Online datasett (ingen Archive-fase)',
    scope:
      'Konseptuell modell. Ingen operativ Azure Storage, faktisk pris, RPO, replikering eller failover.',
    tierUnsupported:
      'Vanlige Blob access tiers støttes ikke for valgt datatype/account i dette eksempelet.',
    archiveConflict:
      'Archive støttes ikke med ZRS, GZRS eller RA-GZRS. Velg en støttet kombinasjon før videre vurdering.',
    typeConflict:
      'Valgt redundans støttes ikke av denne tjeneste-/account-typen i den avgrensede modellen.',
    regionUnknown:
      'Typevilkåret kan passe, men regional/feature-støtte er ikke verifisert. Ingen tilgjengelighetskonklusjon.',
    online:
      'Online: innholdet trenger ingen Archive-rehydrering. Identitet, nettverk og apprespons er fortsatt utenfor modellen.',
    offline: 'Lagret, men offline: Archive-innholdet kan ikke leses direkte.',
    pending: 'Forespurt, fortsatt offline: ingen garantert ferdigtid eller faktisk henting kjører.',
    rehydrated:
      'Deklarert rehydrert til Hot: online under denne antakelsen. Dette er ikke en observert Azure-fullføring.',
    overwriteBlocked:
      'Et offline Archive-innhold kan ikke overskrives som et online objekt. Rehydrering eller et separat nytt objekt må vurderes.',
    earlyNone: 'Ingen beregnet tidlig-utgangskostnad under akkurat disse eksempelvilkårene.',
    earlySome:
      'Planlagt utgang før minimumsperioden kan gi fakturering for resterende dager. Den er ikke en teknisk oppbevaringslås.',
    minimum: 'Minimumsperiode for den beskrevne standardtieringen',
    remaining: 'Resterende faktureringsdager',
    costAssumptions:
      'Fiktive vekter per GiB/30 dager: lagring Hot 40 / Cool 20 / Cold 10 / Archive 3; tilgang 1/4/10/25. Bruksvekt 40/2/0 for hyppig/sporadisk/sjelden. Sjelden forutsetter her ingen planlagt lesing i indeksperioden; en faktisk henting må tas med separat. Avrunding opp. Rehydrering har tillegg 25 per GiB i dette eksempelet. Verken valuta eller faktiske Azure-priser.',
    lifecycleRisk:
      'Det gamle last-modified-tidspunktet er fortsatt kvalifisert. En senere policykjøring kan arkivere dataene igjen.',
    lifecycleGuard:
      'Det deklarerte tier-alder-vilkåret hindrer ny arkivering nå. Verifiser riktig regel i en virkelig løsning.',
    lifecycleOffline:
      'Lifecycle management kan ikke rehydrere Archive-innholdet. En annen rehydreringshandling må planlegges.',
    filesRa:
      'Accountens RA-navn gir ikke Files sekundær lesetilgang. Denne HDD-sharen har GRS/GZRS-atferd før failover.',
    synchronous: 'Synkron kopiering i primærregionen',
    asynchronous: 'Asynkront til LRS i sekundærregionen',
    localOnly: 'Ingen sekundærregion konfigurert',
    exists: 'Bevart i det deklarerte eksempelet',
    unavailable: 'Rammet av fysisk hendelse',
    deleted: 'Slettingen er kopiert hit',
    readYes: 'Ja, som deklarert tjenesteleseflate — ikke bevist apprespons',
    readNo: 'Nei',
    notConfigured: 'Ingen slik sekundær',
    writeNo: 'Nei. RA gir ikke sekundær skriveadgang før relevant failover.',
    failoverNeeded:
      'Krever separat failover for ny primær/skriveadgang. Ikke utført eller tidfestet her.',
    failoverNotNeeded:
      'Ikke nødvendig for å bruke den gjenværende primærflaten i dette eksempelet.',
    restoreNeeded:
      'Failover henter ikke tilbake en tidligere tilstand når slettingen er replikert. Vurder forberedt historikk/backup og validert restore.',
    noRegionalCopy: 'Ingen sekundær kopi for regional gjenoppretting i denne konfigurasjonen.',
    pendingWrite:
      'Versjon2 finnes bare i primærregionen. Ved tap av den kan dette skrivet gå tapt.',
    caughtUp:
      'Bare de deklarerte eksempel-skrivene er kopiert. Asynkron geo-replikering gir fortsatt ingen generell null-datatapsgaranti.',
    deletion:
      'Alle aktive replikaer har den deklarerte slettingen. Redundans gjenoppretter ikke en tidligere tilstand.',
    appUnknown:
      'Ikke simulert. Compute, DNS, tilgang, retry og datakonsistens må vurderes separat.',
    physicalVsAccess:
      'Bevart kopi er ikke det samme som en tilgjengelig leseflate. Se versjon, RA-vilkår og Archive-tilstand hver for seg.',
    schematic:
      'Eget skjematisk kart: representative kopier og feilgrenser, ingen faktiske Azure-bygninger eller plasseringsdata.',
    noZero: 'Ingen generell garanti om null datatap fra asynkron replikering.',
  },
  missions: {
    tiers: {
      title: 'Choose the Right Storage Tier',
      situation:
        'Fjordverk beholder et sjeldent brukt block-blob-datasett i 120 dager, men trenger vanlig lesing. En kampanje endrer senere bruken; et separat langsiktig arkiv må undersøkes.',
      goal: 'Skill online tilgang, kostnadsdrivere, minimumsperiode og deklarert rehydrering. Undersøk også Archive mot zonal redundans.',
      where: 'Tier & Lifecycle Explorer, feltene og siste lagrede resultat nedenfor.',
      why: 'Et nytt krav kan endre hvilket valg som passer, selv når datamengden er den samme.',
      observe:
        'Lesetilstand, støttegrunnlag og fiktive kostnadsdrivere endres når forutsetningen endres.',
      steps: [
        'Velg Cold for et standard GPv2 block-blob-datasett med sjelden bruk,120 dager og krav om vanlig lesing. Forutsi og kjør; undersøk at Cold er online.',
        'Behold datasett og periode. Endre til hyppig bruk og sammenlign lagrede kjøringer med Cold og Hot. Forklar forskjellen i tilgangsdriveren.',
        'Undersøk Archive med LRS og fleksibel henting: lagret, forespurt og deklarert fullført rehydrering. Krev så vanlig lesing og se forskjell før/etter fullføring. Ingen virkelig henting kjører.',
        'Kjør Archive med ZRS og undersøk avvisningen. Forklar hvorfor et riktig tier-navn og et riktig redundansnavn ikke alltid kan kombineres.',
      ],
      debrief:
        'Du har skilt Cold online fra Archive offline, sammenlignet samme endrede bruk og undersøkt en reell støttebegrensning. Fiktive kostnader viser mekanismer, ikke en Azure-prisfasit.',
    },
    replication: {
      title: 'Protect the Data Against Failure',
      situation:
        'Fjordverk vil forstå hvilke data og leseflater som gjenstår ved lokasjons-, sone- og regionale hendelser. Siste primærskriv kan mangle i sekundærregionen.',
      goal: 'Skill fysisk kopibeskyttelse, sekundær lesing, failover, versjon og historisk gjenoppretting.',
      where: 'Replication & Resilience Explorer, replikakartet og den tilsvarende tabellen.',
      why: 'Et kart med flere kopier forklarer ikke alene om klienten kan lese eller om de nyeste dataene finnes.',
      observe:
        'ZRS endrer primær feilseparasjon; RA endrer sekundær lesing; ingen av dem gjør en replika til en historisk backup.',
      steps: [
        'Bruk standard GPv2 Blob, online og deklarert regional støtte. Kjør LRS med rackfeil og deretter sonehendelse. Sammenlign hva samme lokasjon beskytter mot.',
        'Kjør ZRS under samme sonehendelse. Undersøk forskjellen i primær replika- og lesetilstand.',
        'Kjør GRS og RA-GRS ved regional hendelse med et eldre sekundært datasett. Sammenlign sekundær lesing, manglende versjon 2 og fortsatt ingen sekundær skriving.',
        'Kjør en logisk sletting med RA-GZRS. Forklar hvorfor replikaene ikke gir en tidligere versjon og hva en separat gjenopprettingsplan må dekke.',
      ],
      debrief:
        'Du har undersøkt feilgrenser og tilgang hver for seg. En RA-leseflate kan vise eldre data; fullført failover og fungerende applikasjon er egne spørsmål. Replikert sletting trenger en annen gjenopprettingsmekanisme.',
    },
  },
  causal: {
    tiers: [
      'En tier gjelder først og fremst lagringsmengde; når data er kopiert til flere steder, blir hentetid og bruksfrekvens sekundære hensyn.',
      'Cold er online; Archive trenger rehydrering. Endret bruk påvirker totaldriverne, og Archive kan ikke kombineres med zonal redundans.',
      'En fullført rehydreringsforespørsel fastsetter både pris og senere tilgjengelighet, mens minimumsperiodene hindrer at objektet kan slettes.',
    ],
    replication: [
      'RA gjør sekundærdata lesbare og skrivbare, mens asynkron kopiering bare begrenser hvor raskt kunden ser en fullført failover.',
      'En ekstra region erstatter historiske versjoner fordi en logisk feil i primærregionen forblir lokal inntil en fysisk hendelse skjer.',
      'Feilgrenser, kopiert versjon og lesetilgang er ulike vilkår; RA gir ikke sekundær skriving, og replikaer kan inneholde samme sletting.',
    ],
  },
  milestone: {
    tiers: {
      title: 'En offline kopi er ikke en leseflate',
      text: 'De lagrede Archive-fasene viser forskjellen på forespurt og deklarert fullført rehydrering. Ingen faktisk Azure-henting er utført.',
    },
    replication: {
      title: 'Kopi, tilgang og versjon er ulike spørsmål',
      text: 'Du har sammenlignet GRS og RA-GRS ved samme regionale hendelse. Lesbar sekundær betyr verken siste skriv eller sekundær skriveadgang.',
    },
  },
  visual: {
    phaseTitle: 'Tre deklarerte faser — ikke en faktisk hentejobb',
    flowTitle: 'Årsakskjeden i eksempelet',
    write: 'Før hendelsen: primærskriv versjon 2 er bekreftet',
    sync: 'Synkron primærkopiering under valgt feilseparasjon',
    async: 'Asynkron geo-kopiering kan ligge etter',
    incident: 'Undersøk den deklarerte hendelsen',
    costTitle: 'Forhold mellom fiktive kostnadsdrivere',
  },
  units: { days: 'dager', copy: 'representativ kopi' },
  costLabels: {
    capacity: 'Lagring',
    access: 'Tilgang / henting',
    early: 'Tidlig utgang',
    rehydrate: 'Deklarert rehydrering',
    total: 'Sum indekspoeng',
  },
  matrixBoundary:
    'Avgrensede støttede eksempler, forutsatt aktuell region, billing model og funksjon. Archive krever i tillegg standard block blobs med LRS/GRS/RA-GRS. Files RA-account betyr ikke sekundær lesing. Ingen regional oppslagstjeneste.',
  matrixFiles: 'GRS/GZRS-atferd',
  matrixYes: 'Type støttet',
  matrixNo: 'Ikke støttet',
  comparisonBoundary:
    'Lagrede eksplisitte kjøringer. Kostnader sammenlignes bare under like datasett- og modellforutsetninger. Ingen faktisk Azure-tilstand.',
  storage: {
    ...storageNb.storage,
    text: 'Part B-historikken kan ikke brukes sikkert. Behold eldre data; last inn nyeste eller gjenopprett bare denne ugyldige Part B-kontrakten.',
  },
  assessment: {
    ...storageNb.assessment,
    intro:
      'Løs nye lagrings- og beredskapssituasjoner. Vurder beslutning og teknisk begrunnelse hver for seg; riktige ord uten riktig relasjon godkjennes ikke.',
  },
  assessmentActive: storageNb.assessmentActive,
  historyFeedback: storageNb.historyFeedback,
  currentFeedback: storageNb.currentFeedback,
  milestoneNotice: storageNb.milestoneNotice,
  pauseGuided: storageNb.pauseGuided,
  recallGuided: storageNb.recallGuided,
  summaryBoundary:
    'Besøk, guidede undersøkelser, første innleveringer, hjelp og retry er forskjellige observasjoner. Part A er en egen historikk; eldre resultat oppgraderes ikke. Dette er ikke målt eksamensberedskap eller menneskelig læringsvalidering.',
};

export const resilienceItemsNb = {
  rb01: {
    title: 'Sjelden inspeksjon med direkte innsyn',
    problem:
      'En produsent lagrer ferdige målepakker som standard block blobs. De leses svært sjelden, men en kontrollør må kunne åpne innholdet direkte. Hvilken kandidat passer best til det oppgitte prioriteringskravet?',
    premises: [
      'Data skal beholdes uendret i minst 150 dager. Account og region støtter alle aktuelle online tiers.',
      'Prioriter lavest lagringskostnad blant de navngitte online kandidatene. Sjeldne hentekostnader er akseptert; ingen konkret totalpris skal beregnes.',
    ],
    decisions: [
      'Cool, fordi det er en online kandidat med lavere hentekostnad enn Cold.',
      'Cold, fordi det beholder direkte tilgang med lavere lagringskostnad enn Cool.',
      'Archive, fordi minimumsperioden kan oppfylles ved å forlenge oppbevaringen.',
    ],
    reasons: [
      'Lavere hentekostnad skal veie tyngst når et datasett er stort, uavhengig av valgt prioritering.',
      'Oppbevaring over 90 dager gjør alle kjøligere tiers direkte lesbare uten noen rehydreringsfase.',
      'Cold er online; Archive krever rehydrering selv når oppbevaringsperioden er lang nok.',
    ],
    decisive:
      'Prioriteten er lagringskostnad blant online kandidater. Cold dekker det, uten å bli en universell totalkostnadsfasit.',
    feedback: [
      [
        'Cool kan fungere, men oppfyller ikke den uttrykte prioriteten mellom online kandidatene.',
        'Cold dekker online-kravet og den oppgitte lagringsprioriteten; hentekostnader er fortsatt relevante.',
        'Lengre oppbevaring retter ikke kravet om direkte lesing; Archive er fortsatt offline.',
      ],
      [
        'Datamengde alene overstyrer ikke kundens eksplisitte prioritet og tilgangsmønster.',
        'Minimumsperioden er en faktureringsregel, ikke en overgang fra Archive til online.',
        'Riktig: tierens tilgangstilstand og faktureringsperiode må vurderes separat.',
      ],
    ],
  },
  rb02: {
    title: 'Et kort analyseprosjekt med oppgitte satser',
    problem:
      'Et analysebyrå går fra sjeldent leste sluttrapporter til nye kortlevde mellomresultater med hyppig bruk. Hot, Cool og Cold sammenlignes for den nye jobben. Hvilket valg følger det oppgitte budsjettgrunnlaget?',
    premises: [
      'Standard GPv2 block blobs,14 dager før sletting. Umiddelbar lesing trengs hele perioden.',
      'Kun for dette fiktive tilbudet: Hot totalt80 indekspoeng; Cool70 pluss20 i early-deletion ved denne slettingen; Cold55 pluss50 i early-deletion ved denne slettingen. Ingen andre kostnader.',
    ],
    decisions: [
      'Cold, med55 indekspoeng når slettingen bestilles på dag14.',
      'Cool, med70 indekspoeng før minimumsperioden er utløpt.',
      'Hot, med80 indekspoeng under de oppgitte forutsetningene.',
    ],
    reasons: [
      'Regn med de oppgitte faktureringskonsekvensene: Cool90 og Cold105 overstiger Hot80.',
      'De oppgitte minimumsperiodene hindrer sletting til dag30 eller90, så prosjektet må velge Hot av tekniske grunner.',
      'Tidlig sletting blir først en kostnad hvis prosjektet rekker å lese data etter at slettingen ble bestilt.',
    ],
    decisive:
      'Et lavere utgangspunkt kan gi høyere total. Minimumsperiodene beskriver betalingen, ikke en generell slettingslås.',
    feedback: [
      [
        'Cold er også online, men det oppgitte tilbudet gir total105, ikke55.',
        'Cool er online, men den relevante tidlig-utgangskostnaden gjør den oppgitte totalen90.',
        'Riktig under det fiktive tilbudet; dette er ikke faktiske Azure-priser.',
      ],
      [
        'Riktig: inkluder alle eksplisitte kostnadsdrivere før du sammenligner totalene.',
        'Immutability kan gi tekniske sperrer, men det er ikke oppgitt her; early deletion er fakturering.',
        'Gebyrgrunnlaget følger tier/utgang/periode, ikke en slik ekstra lesing.',
      ],
    ],
  },
  rb03: {
    title: 'Arkivkilden må fortsatt være der',
    problem:
      'Et revisjonsteam må analysere et arkivert datasett og beholde originalen. Hvilken plan oppfyller kravene med minst tidlig-utgangskostnad på originalen?',
    premises: [
      'Originalen har vært i Archive i 70 dager i en støttet LRS-account. Analyse kan vente på fullført rehydrering.',
      'En ny online kopi og dens lagrings-/hentekostnad er akseptert. Originalen skal ikke slettes eller få endret tier nå.',
    ],
    decisions: [
      'Rehydrer ved kopiering til et nytt online objekt, og behold arkivkilden.',
      'Endre originalen til Cool, og flytt den tilbake når analysen er avsluttet.',
      'Kopier og behold arkivkilden; la analysen starte når destinasjonens navn vises.',
    ],
    reasons: [
      'Et opprettet destinasjonsnavn viser at innholdet er online og at analysen kan starte.',
      'En beholdt arkivkilde forlater ikke sin tier; den nye kopien må likevel bli ferdig og gir egne kostnader.',
      'En tilbakeflytting til Archive viderefører alltid den gamle minimumsperioden uten nye konsekvenser.',
    ],
    decisive:
      'Kopieringsmetoden kan beholde originalens tier og unngå tidlig utgang på den. Rehydrering er fortsatt et forløp med egen kostnad.',
    feedback: [
      [
        'Riktig: behold kilden, kontroller fullføring og ta med kostnader for kopi/henting/to objekter.',
        'Det endrer originalens tier og kan utløse tidlig-utgangskostnad, i strid med de eksplisitte kravene.',
        'Kilden beholdes, men et synlig destinasjonsnavn beviser ikke at rehydreringen er fullført og analysen kan lese innholdet.',
      ],
      [
        'Destinasjonen kan vises før rehydrering er ferdig. Behold kilden og kontroller fullføring før analyse.',
        'Riktig: ingen utgang på kilden betyr ikke at den nye online kopien er gratis eller umiddelbar.',
        'En ny tier-overgang er ikke en slik universell videreføring; planen bryter dessuten kildekravet.',
      ],
    ],
  },
  rb04: {
    title: 'En standardinnstilling med to ulike blob-grupper',
    problem:
      'Et lag bytter account-default fra Cool til Cold. Gruppe M hadde arvet default; gruppe N har eksplisitt Hot. Hvilken forventning er faglig riktig?',
    premises: [
      'Standard GPv2, støttet funksjon og region. Ingen annen policy eller eksplisitt tier-endring kjører.',
      'Vurder effekt av account-default, ikke en operasjon som er utført av AzureLab.',
    ],
    decisions: [
      'Ingen av gruppene følger Cold, fordi default bare brukes ved ny opplasting.',
      'Begge grupper følger Cold, fordi standardinnstillingen gjelder hele accounten.',
      'M følger Cold; N beholder sin eksplisitte Hot-tier under disse vilkårene.',
    ],
    reasons: [
      'Inferred tier følger default, mens en eksplisitt blob-tier overstyrer default-innstillingen.',
      'Alle blobs i samme account må bruke én tier, på samme måte som de deler en redundansinnstilling.',
      'Eksisterende blobs blir låst til første inferred tier frem til de slettes og opprettes på nytt.',
    ],
    decisive:
      'Tier-arv og account-level redundans er forskjellige mekanismer. Endring av default kan påvirke eksisterende inferred blobs.',
    feedback: [
      [
        'Default-endring kan også påvirke eksisterende inferred blobs, med relevante kostnadsvirkninger.',
        'En eksplisitt tier overstyrer denne defaulten; ikke bruk redundansregelen som tier-regel.',
        'Riktig: de to gruppene har ulike tier-grunnlag.',
      ],
      [
        'Riktig: undersøk om tier er inferred eller eksplisitt før du forutsier effekten.',
        'Én account kan inneholde blobs i forskjellige tiers; felles redundans betyr ikke felles tier.',
        'Inferred betyr nettopp at innstillingen arves, ikke at første verdi er permanent låst.',
      ],
    ],
  },
  rb05: {
    title: 'Online under sonefeil og sjeldne lesinger',
    problem:
      'En avdeling vil kjøle ned et sjeldent brukt datasett uten å svekke det gjeldende kravet om online tilgang ved en sonehendelse. Hvilken kandidat dekker de oppgitte grensene?',
    premises: [
      'Standard block blobs beholdes uendret over 200 dager. Region støtter valgene. Lavere lagringskostnad ønskes, men ingen bestemt totalpris er lovet.',
      'Kravet om zonal primærtilgjengelighet og vanlig lesing skal beholdes. Ingen separat arkivkopi inngår i oppdraget.',
    ],
    decisions: [
      'Cold med RA-GRS for online tilgang og en geografisk kopi.',
      'Cold med ZRS for dette online datasettet.',
      'Archive med GZRS for kombinert zonal og geo-beskyttelse.',
    ],
    reasons: [
      'GZRS gir flere feilgrenser og kan derfor brukes til Archive når minimumsperioden er lang nok.',
      'En online RA-sekundær erstatter automatisk behovet for primær soneseparasjon ved samme hendelse.',
      'Cold er online og støtter ZRS; Archive oppfyller verken direkte lesing eller den foreslåtte zonale kombinasjonen.',
    ],
    decisive:
      'Et støttet online tier-valg må beholde feilgrensen. Lengre oppbevaring opphever ikke Archive-begrensningene.',
    feedback: [
      [
        'Cold er online, men RA-GRS har LRS i primærregionen. Sekundær lesing erstatter ikke zonal primærtilgjengelighet.',
        'Riktig under de oppgitte vilkårene. Totalpris og faktisk apphelse krever egne vurderinger.',
        'Archive støttes ikke med GZRS, selv om GZRS ellers gir den ønskede primære feilseparasjonen.',
      ],
      [
        'Oppbevaringslengde endrer ikke støtten for Archive med GZRS.',
        'RA gir en annen leseflate for støttede online data, men endrer ikke LRS til ZRS i primærregionen.',
        'Riktig: tilgangstilstand og kombinasjonsstøtte er to kontroller, begge nødvendige.',
      ],
    ],
  },
  rb06: {
    title: 'Ingen data ut av regionen',
    problem:
      'En helsetjeneste vil tåle tap av én Availability Zone med fortsatt primær lesing og skriving. Hvilken navngitt konfigurasjon passer den oppgitte plasseringsgrensen?',
    premises: [
      'Alle aktive replikaer i denne løsningen skal være innen den valgte regionen. Standard GPv2 og zonal støtte er bekreftet.',
      'Uavhengig historisk gjenoppretting håndteres separat; velg bare fysisk redundans her.',
    ],
    decisions: [
      'ZRS, for synkron kopiering over primærregionens soner.',
      'LRS, for synkrone kopier i regionen med lavere kostnad.',
      'GRS, for en ekstra kopi i en geografisk adskilt feilgrense.',
    ],
    reasons: [
      'GRS bruker alltid tre soner i primærregionen og flytter bare data ut av regionen etter en feil.',
      'ZRS skiller primære soner uten å kreve en sekundærregion; lokal kopiering alene dekker ikke sonehendelsen.',
      'LRS har samme sonebeskyttelse som ZRS når alle kopiene har forskjellige diskidentiteter.',
    ],
    decisive:
      'Antall diskidentiteter og felles region er ikke tilstrekkelig. Feilseparasjonen må dekke sonen.',
    feedback: [
      [
        'Riktig: ZRS dekker den deklarerte primære feilgrensen innen regionen.',
        'LRS beskytter blant annet mot rackfeil, men ikke en hendelse som rammer hele den felles lokasjonen.',
        'GRS kopierer til en annen region og har LRS, ikke ZRS, som primærmekanisme.',
      ],
      [
        'GRS bruker LRS i primær og asynkron kopiering skjer også før en feil.',
        'Riktig: vurder både fysisk feilgrense og tillatt plassering.',
        'Ulike disker i samme fysiske lokasjon beviser ikke soneseparasjon.',
      ],
    ],
  },
  rb07: {
    title: 'To forskjellige katastrofekrav',
    problem:
      'En katalogtjeneste krever både fortsatt primærtilgang ved en sonehendelse og en kopi i en annen region for katastrofeberedskap. Hvilket forslag dekker begge?',
    premises: [
      'Støttet standard GPv2 med online blobs. Geo-kopiering er tillatt. Direkte sekundær lesing er ikke påkrevd.',
      'En regional katastrofe håndteres med egen failover-plan og akseptert asynkron datarisiko.',
    ],
    decisions: [
      'GZRS, siden primær ZRS kombineres med en asynkron geo-kopi.',
      'ZRS, siden kopier i tre soner dekker både zonal og regional katastrofe.',
      'RA-GRS, siden sekundær lesing også gir zonal primærtilgjengelighet.',
    ],
    reasons: [
      'Read access erstatter behovet for primær soneseparasjon når nye skriv kan fortsette mot sekundær.',
      'GZRS bruker også ZRS i sekundærregionen, slik at begge regioner alltid har identisk online tilstand.',
      'Primær ZRS og sekundær geo-kopi dekker ulike feilgrenser; app/failover og datarisiko må fortsatt planlegges.',
    ],
    decisive:
      'GZRS endrer primærmekanismen fra LRS til ZRS og beholder asynkron geo-kopiering. Sekundær bruker LRS.',
    feedback: [
      [
        'Riktig: GZRS dekker de to fysiske behovene uten å love umiddelbar regional appgjenoppretting.',
        'ZRS alene kopierer ikke til en annen region.',
        'RA-GRS gir en støttet sekundær leseflate, men primærmekanismen er fortsatt LRS.',
      ],
      [
        'RA gir ikke sekundær skriveadgang eller ZRS i primærregionen.',
        'Sekundær bruker LRS; asynkron kopiering gjør heller ikke versjonene alltid identiske.',
        'Riktig: mekanismene supplerer hverandre, og fjerner ikke behovet for beredskapsarbeid.',
      ],
    ],
  },
  rb08: {
    title: 'Lesemodus før en beslutning om failover',
    problem:
      'En transporttjeneste skal kunne vise en eldre statusoversikt når primærregionen er utilgjengelig, uten å utføre failover ennå. Hvilken plan kan dekke dette?',
    premises: [
      'Standard GPv2 Blob med online innhold. Eldre data er eksplisitt akseptert for denne lesemodusen.',
      'Klienten kan bruke sekundærendpointet. Nye skriv skal vente; mål er sekundær lesing før failover.',
    ],
    decisions: [
      'RA-GRS med sekundær lese-/skrivemodus for nye statusoppdateringer.',
      'GRS med sekundær lesemodus og ventende primære skriv.',
      'RA-GRS med sekundær lesemodus og ventende primære skriv.',
    ],
    reasons: [
      'En geografisk kopi er direkte lesbar så snart replikeringen har bekreftet en komplett eldre versjon.',
      'RA legger til sekundær lesing for støttet tjeneste; kopien kan være eldre og gir ikke sekundær skriving.',
      'RA utvider sekundær tilgang til både lesing og skriving når primærregionen slutter å svare.',
    ],
    decisive:
      'RA oppfyller et spesifikt sekundært lesebehov. Det er ikke automatisk klientomkobling, ferske data eller sekundær skriveadgang.',
    feedback: [
      [
        'RA gir ikke sekundær skriving før relevant fullført failover.',
        'GRS alene gir ikke slik direkte sekundær lesing før failover.',
        'Riktig: klientforutsetningen og akseptert eldre versjon gjør denne begrensede lesemodusen mulig.',
      ],
      [
        'Kopiert versjon og lesetillatelse er ulike vilkår; vanlig GRS får ikke RA av å være ajour.',
        'Riktig: vurder endpoint, RA, dataversjon og operasjonstype hver for seg.',
        'Bortfall av primær endrer ikke RA til en generell read/write-funksjon.',
      ],
    ],
  },
  rb09: {
    title: 'Riktig replikering av en feil sletting',
    problem:
      'En administrator har slettet én container i en RA-GZRS-account. Slettingen er kopiert til begge regioner. Hvordan kan dataene hentes tilbake uten å miste nyere arbeid i andre containere?',
    premises: [
      'En beskyttet backup innen oppbevaringsperioden støtter restore av valgt container til et kontrollert mål. Andre containere har viktige skriv etter backupen.',
      'Gjenværende nye data skal bevares. Både gjenopprettet innhold og applikasjon må valideres før normal bruk.',
    ],
    decisions: [
      'Utfør account-failover og bruk samme replikerte tilstand fra den andre regionen.',
      'Gjenopprett den slettede containeren til kontrollert mål, valider og før relevante data tilbake.',
      'Erstatt hele den aktive accountens data med backupens tilstand, og valider resultatet.',
    ],
    reasons: [
      'Replikaer kan kopiere sletting; avgrenset restore fra historikk kan bevare nyere upåvirkede data.',
      'En full tilbakeføring til backup gjør nyere upåvirkede skriv tilgjengelige fra samme historiske tidspunkt.',
      'En ny primærregion reverserer siste administrative dataendring fordi failover bytter historikk.',
    ],
    decisive:
      'Geografisk redundans og historisk gjenoppretting løser forskjellige feil. Verifisert restore er fortsatt nødvendig.',
    feedback: [
      [
        'Den oppgitte sekundærkopien har også slettingen; failover er ikke en undo-funksjon.',
        'Riktig: den deklarerte selektive restore-muligheten kan dekke slettingen uten å erstatte andre containeres nye skriv.',
        'En full erstatning kan få tilbake den slettede containeren, men ville overskrive nyere arbeid som skal bevares.',
      ],
      [
        'Riktig: beskyttelse mot fysisk svikt erstatter ikke en tidligere beskyttet tilstand.',
        'Backupen inneholder ikke skrivene som kom senere. Verifisering alene gjenoppretter ikke disse fra det gamle tidspunktet.',
        'Failover endrer roller/endpoint under sine vilkår, ikke automatisk datainnholdet til en eldre dato.',
      ],
    ],
  },
  rb10: {
    title: 'Filshare og VM-volum under samme sonekrav',
    problem:
      'Et produksjonsmiljø har en SSD SMB-share og en Standard SSD managed data disk. Begge trenger støttet zonal databeskyttelse. Hvilket forslag respekterer tjenestegrensene?',
    premises: [
      'Regionene og typene støtter ZRS. Den eksisterende VM-en står i den berørte sonen og svarer ikke; data disken inneholder arbeid som skal bevares.',
      'Miljøet skal beholde sine to lagringstjenester og kunne bruke de bevarte dataene når en egnet compute-flate er tilgjengelig.',
    ],
    decisions: [
      'ZRS på de støttede tjenestene, med separat plan for VM og data disk-tilknytning.',
      'RA-GZRS på begge; planlegg en ny VM med sekundær data disk fra geo-kopien.',
      'ZRS på begge; la den beskyttede datakopien håndtere oppstart av VM etter sonehendelsen.',
    ],
    reasons: [
      'En ZRS-datakopi holder også VM-ens kjøretilstand tilgjengelig i de gjenværende sonene.',
      'En RA-account gir alle tilknyttede tjenester samme sekundære lese- og skriveegenskaper.',
      'Disk-ZRS gjenstarter ikke VM-en, og Files/disks arver ikke Blob-tiers eller alle geo-/RA-egenskaper.',
    ],
    decisive:
      'Tjenestespesifikk ZRS-støtte er relevant. En beskyttet disk eller share er fortsatt ikke en frisk, korrekt tilknyttet applikasjon.',
    feedback: [
      [
        'Riktig under de deklarerte type-/regionvilkårene; compute og tilknytning krever egen plan.',
        'En ny VM alene retter ikke støtten: SSD Files og managed disks har ikke dette generelle geo-/RA-tilbudet.',
        'ZRS kan beskytte disse dataene under vilkårene, men gir ikke en generell automatisk oppstart av den berørte VM-en.',
      ],
      [
        'ZRS beskriver databeskyttelse; VM-ens kjøretilstand og tilknytning må vurderes separat.',
        'Files har ikke slik RA-lesing, managed disks har ikke RA-GZRS, og RA gir ikke sekundær skriving.',
        'Riktig: databeskyttelse, tjenestestøtte og applikasjonsgjenoppretting må skilles.',
      ],
    ],
  },
} as const;

// P10 original manuscript, authored after current source review and before presenter code.
export const identityNb = {
  milestoneNotice: storageNb.milestoneNotice,
  pauseGuided: storageNb.pauseGuided,
  recallGuided: 'Gjenoppta lagret Identity-oppdrag',
  assessmentActive:
    'Et annet Identity-scenario er aktivt. Gå tilbake til ditt varig lagrede utkast.',
  currentFeedback: 'Tilbakemelding på innlevert Identity-svar',
  historyFeedback: 'Historisk Identity-besvarelse',
  title: 'Microsoft Entra ID, Authentication & External Identities',
  path: '02 — Azure Architecture & Services',
  part: 'Identity, Access & Security · Part A',
  perspective: 'Velg perspektiv',
  overview: 'Fra hvem du er, til hvordan det bevises — og hva du får gjøre.',
  prerequisites:
    'Forkunnskaper: tenant/subscription/resource group fra Core Architecture og kundens identitets-/tilgangsansvar fra Service Types. Storage Part B forklarer at data kan være bevart og tilgjengelige uten at en bestemt bruker har tilgang.',
  available:
    'Tre konseptuelle undersøkelser, guidede oppdrag og nye selvstendige situasjoner. Conditional Access og Azure RBAC kommer i Part B (P11); Security-prinsipper kommer i P15.',
  topics: {
    introduction: 'Fra ressurser til identitet',
    directory: 'Microsoft Entra ID og tenant',
    domain: 'Microsoft Entra Domain Services',
    authentication: 'Authentication versus Authorization',
    sso: 'Single Sign-On',
    mfa: 'Multifactor Authentication',
    passwordless: 'Passwordless Authentication',
    external: 'External Identities',
    studio: 'Identity & Authentication Studio',
    missions: 'Guidede undersøkelser',
    assessment: 'Selvstendig anvendelse',
    summary: 'Summary — Identity Foundations',
  },
  sections: {
    introduction: {
      title: 'Fjordverk må vite hvem som ber om hva',
      paragraphs: [
        'Fjordverk har applikasjoner, nettverk og data i Azure. Ansatte bruker en prosjektapp og en rapportapp. Et eldre produksjonsprogram forventer et Windows-domene. En leverandør trenger innsyn i én prosjektflate, mens kunder skal registrere seg i en egen kundetjeneste. De samme lagringsvalgene svarer ikke på hvem disse menneskene er eller hva hver av dem skal få gjøre.',
        'En digital identitet er en representasjon i et system: identifikatorer og attributter knytter en person, en enhet eller en programvarearbeidslast til et objekt. En brukerkonto kan ha visningsnavn og innloggingsidentifikator. En gruppe samler identiteter for administrasjon. Et navn eller gruppemedlemskap er informasjon; den aktuelle tjenesten må fortsatt vurdere hvilke handlinger identiteten kan utføre.',
        'Vi skiller tre spørsmål. Katalogen organiserer identiteter. Autentisering kontrollerer bevis for den påståtte identiteten. Autorisasjon avgjør tilgang til en bestemt handling eller ressurs. Det er mulig å være riktig autentisert og likevel mangle tillatelse til rapporten. Vi følger dette skillet fra første eksempel til siste undersøkelse.',
        'Fra Core Architecture kjenner du tenant, subscription og resource group. Fra Service Types vet du at kunden fortsatt håndterer blant annet brukere, tilgang og applikasjonsansvar i relevante tjenester. Her lærer du identitetsmekanismene; full Conditional Access og Azure RBAC kommer i neste del. Studio er en deklarert konseptmodell, ikke et ekte innloggingssystem.',
      ],
      terms: [
        ['Identitet', 'En representasjon av hvem eller hva et system handler med.'],
        [
          'Credential',
          'Et legitimasjonsmiddel som kan brukes som identitetsbevis, ikke bare et brukernavn.',
        ],
        ['Principal', 'En identitet som et system kan gi tillatelser til.'],
      ],
      example:
        'En innleid tegner kan finnes som gjest i Fjordverks katalog og være riktig innlogget, men fortsatt få avslag på å endre en produksjonsordre. Vi må undersøke identitetsbeviset og den konkrete tillatelsen hver for seg.',
      limit:
        'Ingen konto, tenant, token, passord, MFA-kode eller rettighet opprettes. Besøk og navigasjon registrerer ingen faglig fullføring.',
    },
    directory: {
      title: 'En katalog og en tenant er en identitetsgrense',
      paragraphs: [
        'Microsoft Entra ID er Microsofts skybaserte tjeneste for identitets- og tilgangsstyring. Den lagrer katalogobjekter og kan være Identity Provider, forkortet IdP, for integrerte applikasjoner. En IdP verifiserer identitetsbevis og formidler et verifiserbart resultat til en applikasjon som stoler på den. Appen må være riktig integrert; en tilfeldig app får ikke SSO bare fordi organisasjonen bruker Azure.',
        'En Microsoft Entra-tenant er en egen forekomst med en katalog og organisasjonens identitetskonfigurasjon. Brukere, grupper og registrerte applikasjoner hører til denne identitetskonteksten. Brukerobjektet representerer personen; gruppen kan forenkle administrasjon, men er ikke selv bevis for at en bestemt app har gitt tilgang. Også enheter og programvare kan ha identiteter. Denne delen undersøker først og fremst menneskers innlogging.',
        'En Azure subscription er en administrativ ressurs- og faktureringskontekst med en tilknytning til én Entra-katalog. Flere subscriptions kan stole på samme tenant. En resource group samler Azure-ressurser for administrasjon og livssyklus; den er ikke en mappe med identiteter. En ny subscription trenger derfor ikke en ny tenant. Identitetsgrensen og ressursenes management-hierarki er forskjellige strukturer.',
        'Moderne apper kan integreres med standarder som OpenID Connect og SAML for innlogging. OpenID Connect bygger på OAuth 2.0, men OAuth-autorisasjon og innloggingsbevis er forskjellige formål. På dette nivået er poenget tillitsforholdet mellom appen og IdP-en. Vi utsteder ingen tokens og implementerer ingen protokoll.',
        'Microsoft driver Entra ID-plattformen. Fjordverk må fortsatt håndtere identiteters livssyklus, korrekt appintegrasjon, passende autentiseringsmetoder og tilganger. Når en ansatt slutter, er ikke det å ha en skybasert katalog en erstatning for å avslutte kontoens og applikasjonenes relevante tilgang.',
      ],
      terms: [
        ['Directory', 'Katalog med identitetsobjekter og relaterte opplysninger.'],
        ['Tenant', 'En avgrenset Entra-forekomst, adskilt fra ressursgrupper og subscriptions.'],
        [
          'Identity Provider',
          'Tjenesten som en integrert app stoler på for identitetsverifisering.',
        ],
      ],
      example:
        'Prosjektappen og rapportappen ligger i forskjellige subscriptions, men bruker samme workforce tenant for de ansattes identiteter. Felles tenant kan gi en samlet innloggingsopplevelse; tilgang til prosjektet blir likevel ikke automatisk tilgang til alle rapporter.',
      limit:
        'AzureLab sin eksisterende Directory/hierarkivisning er kun read-only kontekst for organisering. Den er ingen operativ Entra-katalog. Tenantflytting, rolleadministrasjon og tokenvalidering inngår ikke her.',
    },
    domain: {
      title: 'Et eldre domeneprogram trenger andre egenskaper',
      paragraphs: [
        'Tradisjonell Active Directory Domain Services, AD DS, bruker domenekontrollere til katalog- og domenetjenester. Domain join knytter en maskin til et domene. Group Policy brukes til å administrere relevante innstillinger. LDAP er en katalogprotokoll, mens Kerberos og NTLM er autentiseringsmekanismer som eldre apper kan være avhengige av. Entra ID er ikke i seg selv en vanlig AD DS-domenekontroller med disse egenskapene.',
        'Microsoft Entra Domain Services tilbyr et managed domain med domain join, Group Policy, LDAP og Kerberos/NTLM. Et støttet eldre program i Azure kan bruke disse domenetjenestene uten at Fjordverk selv drifter domenekontrollerne. Tjenesten har en egen domenekontekst og er ikke et synonym for Entra ID. Domain join og moderne SSO beskriver heller ikke samme handling.',
        'Microsoft administrerer blant annet domenekontrollerne, oppdateringer, plattformtilgjengelighet og plattformbackup. Kunden må fortsatt kontrollere nettverk/DNS, maskinenes domain join, relevante gruppepolicyer og organisasjonsenheter, identitets- og credential-forutsetninger og applikasjonens tillatelser. Managed betyr ikke at Microsoft overtar hele den gamle applikasjonen.',
        'Brukere, grupper og nødvendige credential-hasher synkroniseres én vei fra Entra ID til managed domain. Ved en hybrid løsning kan relevante objekter først synkroniseres fra lokal AD DS til Entra ID og derfra videre. Domain Services sender ikke endringer tilbake til Entra ID. Dokumentasjonen krever riktige Kerberos/NTLM-hasher; blant annet kan cloud-only-brukere måtte endre passord før de nødvendige hashene er tilgjengelige. I AzureLab oppgir vi bare om disse forutsetningene er klare, uten å behandle passord.',
        'Synkroniserte objekter kan ikke endres fritt fra managed domain. Egne objekter kan opprettes i støttede egendefinerte organisasjonsenheter, men blir ikke dermed synkronisert tilbake til Entra ID. Eksisterende lokal Group Policy, OU-hierarki og maskinobjekter flyttes heller ikke automatisk med brukerobjektene. Eksterne gjester uten tilgjengelige relevante credentials blir ikke automatisk brukbare domeneidentiteter.',
        'Et managed domain er ingen ubegrenset AD DS-erstatning. Full Domain/Enterprise Admin-kontroll og egendefinerte schema-utvidelser er ikke tilgjengelig på samme måte. Dersom et program krever slike egenskaper, må kravene vurderes mot tradisjonell kundedrevet AD DS eller endret programdesign. At to løsninger begge kan gjøre domain join beviser ikke at alle krav er oppfylt.',
      ],
      terms: [
        ['Managed domain', 'Domenetjenester der Microsoft drifter domenekontrollerne.'],
        [
          'LDAP / Kerberos / NTLM',
          'Katalog- og autentiseringsmekanismer som må skilles fra moderne app-SSO.',
        ],
        [
          'Enveissynkronisering',
          'Fra Entra ID til managed domain; ingen automatisk retur av domeneendringer.',
        ],
      ],
      example:
        'En uendret produksjonsapp krever LDAP-lesing og Kerberos. Domain Services kan passe under dokumenterte nettverks- og credential-forutsetninger. Et annet program krever leverandørens schema-utvidelse; det kravet kan gjøre samme managed domain uegnet selv om LDAP er støttet.',
      limit:
        'Studio antar eksplisitt en støttet Azure-arbeidslast og ferdig nettverk/DNS der det er oppgitt. Det oppretter ikke domene, maskin, konto eller synkronisering og lover ingen drift eller kompatibilitet utover de navngitte kravene.',
    },
    authentication: {
      title: 'Et identitetsbevis er ikke en tillatelse',
      paragraphs: [
        'Autentisering, AuthN, svarer på om identiteten er den den hevder å være. Et brukernavn alene er en påstand, ikke beviset. En autentiseringsmetode kan kontrollere et passord, en besittelse eller en lokal brukerbekreftelse. At et objekt finnes i katalogen betyr ikke at den som skriver navnet har bevist identiteten.',
        'Autorisasjon, AuthZ, avgjør hva den identiteten får gjøre: lese en prosjektfil, endre en ordre eller administrere et system. En app kan basere avgjørelsen på sine egne regler og relevant tildelt tilgang. Azure RBAC er én mekanisme for Azure-ressurser, ikke et synonym for alle apptillatelser. Vi implementerer ikke rolle- eller policymotor i denne delen.',
        'Innloggingsreisen har flere grenser: finnes riktig identitet, stoler appen på IdP-en, er valgt credential registrert og verifisert, oppfyller beviset det deklarerte autentiseringskravet, og er den konkrete apphandlingen tillatt? En vellykket første kontroll gjør ikke de neste overflødige. Et identitetsbevis kan være gyldig uten at et strengere MFA-krav er møtt.',
        'I Studio oppgis appens tilgang som tillatt, avvist eller ikke dokumentert. Et tillatt resultat er bare en antakelse i det valgte eksempelet. Ukjent tilgang forblir ukjent; vi konkluderer verken med tillatelse eller faktisk tjenestesvar. Ved manglende autentiseringsforutsetninger evalueres appens tilgang ikke.',
      ],
      terms: [
        ['AuthN', 'Verifikasjon av påstått identitet.'],
        ['AuthZ', 'Tillatelse til en konkret handling.'],
        ['Ikke dokumentert', 'En forutsetning mangler; modellen får ikke finne på utfallet.'],
      ],
      example:
        'En regnskapsmedarbeider bruker en riktig registrert passkey. Identitetsbeviset kan være sterkt og godkjent, mens appen avviser endring av en låst periode. Et nytt passord løser ikke nødvendigvis dette autorisasjonsspørsmålet.',
      limit:
        'Deklarerte krav er en undervisningsforutsetning. Dette er ingen ekte Entra sign-in, Conditional Access-vurdering eller håndhevet applikasjonstillatelse.',
    },
    sso: {
      title: 'SSO gjenbruker tillit og innloggingskontekst',
      paragraphs: [
        'Single Sign-On, SSO, lar brukeren få en sammenhengende innloggingsopplevelse på tvers av integrerte apper som stoler på samme identitetsleverandør. Brukeren åpner App A, blir verifisert hos Entra ID, og App B kan senere bruke en egnet eksisterende innloggingskontekst. Det krever appintegrasjon og gyldig kontekst; det betyr ikke at alle apper bruker samme passorddatabase.',
        'SSO kan redusere antall separate innlogginger og passord, men sier ikke i seg selv hvor sterkt identiteten ble bekreftet. En kontekst etablert med bare passord blir ikke til MFA fordi en annen app åpnes. En eksisterende MFA-kontekst kan derimot tilfredsstille et passende senere krav uten et nytt synlig popup-vindu under de oppgitte betingelsene.',
        'App B kan kreve et sterkere eller nyere identitetsbevis. Da kan ny verifikasjon være nødvendig selv om SSO er konfigurert. Varighet, session-kontroller, enhet og andre virkelige betingelser finnes, men modelleres ikke som en full policy. Her angir vi eksplisitt hvilken bevisstyrke den eksisterende konteksten kan brukes til.',
        'Etter innlogging må App B fortsatt avgjøre sin egen tilgang. SSO gjør det lettere å komme frem til denne avgjørelsen, men opphever den ikke. En felles identitetsleverandør betyr derfor verken felles administratorrettigheter eller at alle data kan leses.',
      ],
      terms: [
        ['SSO', 'Gjenbruk av en gyldig innloggingskontekst mellom integrerte apper.'],
        ['Tillitsforhold', 'Appen aksepterer identitetsbevis fra en bestemt IdP.'],
        ['Ny verifikasjon', 'Et sterkere krav kan kreve mer enn den eksisterende konteksten.'],
      ],
      example:
        'Fjordverks App A har etablert en enkeltfaktor-kontekst. App B stoler på samme IdP, men krever MFA. SSO-integrasjonen er fortsatt relevant; beviset må likevel styrkes før App B kan gå videre til sin separate tilgangskontroll.',
      limit:
        'Ingen session-cookie eller token produseres. Modellen antar gyldig tidsrom og korrekt appintegrasjon når dette er valgt; en gjenbrukt kontekst er ikke en garantert virkelig innlogging.',
    },
    mfa: {
      title: 'Uavhengige faktortyper er viktigere enn antall spørsmål',
      paragraphs: [
        'Multifactor Authentication, MFA, bruker minst to relevante faktortyper: noe du vet, noe du har, og noe du er. Et passord er knowledge. En registrert sikkerhetsnøkkel eller telefon er possession. Et biometrisk kjennetegn brukt som brukerbekreftelse er inherence. To passord eller et passord og et hemmelig spørsmål blir ikke to uavhengige faktortyper.',
        'MFA kan gjøre et lekket passord utilstrekkelig for å fullføre innlogging. Et passord pluss en korrekt ekstra verifikasjon fra en registrert enhet kan dekke to faktortyper. Forutsetningene betyr noe: å registrere en metode er ikke det samme som å bruke eller verifisere den i innloggingen.',
        'En sterk credential kan kombinere faktorer i én brukerhandling. En registrert FIDO2-passkey med lokal PIN eller biometrisk brukerbekreftelse kan oppfylle MFA uten et ekstra SMS-vindu. Antall skjermbilder eller tastetrykk er derfor ikke en god MFA-test. Vi undersøker bevisets egenskaper, ikke animasjonen.',
        'MFA reduserer risiko for visse angrep, men garanterer ikke sikkerhet. Koder og vanlige godkjenningsvarsler kan fortsatt utsettes for phishing eller manipulasjon. Gjenoppretting, metodevalg, brukeropplæring og applikasjonens tilgangskontroll er fortsatt viktige. Full risikobasert Conditional Access kommer senere.',
      ],
      terms: [
        ['Knowledge', 'Noe brukeren vet.'],
        ['Possession', 'Noe brukeren kontrollerer eller har.'],
        ['Inherence', 'Et biometrisk kjennetegn brukt på en relevant måte.'],
      ],
      example:
        'En intern app legger til et sikkerhetsspørsmål etter passordet. Antallet hemmeligheter øker, men begge er knowledge. En registrert besittelsesfaktor endrer derimot typen bevis. En lokal PIN som låser opp en device-bound nøkkel har en annen rolle enn et nytt serverpassord.',
      limit:
        'Vi ber aldri om passord, PIN, biometriske data eller MFA-koder. Modellen bruker deklarert verifikasjon og enkle faktorkategorier, ikke en sikkerhetssertifisering.',
    },
    passwordless: {
      title: 'Uten passord beskriver brukerreisen, ikke hele sikkerhetsnivået',
      paragraphs: [
        'Passwordless betyr at innloggingen kan gjennomføres uten å skrive et vanlig kontopassord. Det sier ikke alene hvor mange faktortyper som brukes, om metoden er phishing-resistent eller hvilke apper som støttes. En enkelt besittelsesbasert kode kan være passwordless, mens en riktig konfigurert nøkkel med lokal brukerbekreftelse kan gi et sterkere multifaktorbevis.',
        'Passkeys bygger på FIDO-standarder og offentlig-nøkkel-kryptografi. Credentialen bindes til riktig tjeneste/opprinnelse; en lokal PIN eller biometri kan bekrefte brukeren. Den private nøkkelen håndteres av autentikatoren og sendes ikke som et vanlig passord til en nettside. Passkeys kan være device-bound, for eksempel en sikkerhetsnøkkel, eller synkronisert under støttede leverandør- og Entra-betingelser. Støtte og policy må kontrolleres; her utføres ingen kryptografi.',
        'Windows Hello for Business kombinerer en enhetsspesifikk credential med lokal PIN eller biometri. PIN-en låser opp nøkkelen på den aktuelle enheten; den er ikke bare et nytt fjernpassord. Riktig registrering, enhet og brukerbekreftelse er forutsetninger. En Hello-kontekst er heller ikke et løfte om enhver mulig senere step-up-flyt.',
        'Microsoft Authenticator har forskjellige funksjoner. Passwordless phone sign-in bruker en registrert enhetsbundet credential med lokal bekreftelse og nummermatching. Vanlig MFA-push er en annen bruk. Passkeys i Authenticator er igjen en FIDO2-metode. At alle finnes i samme app gjør dem ikke sikkerhetsmessig identiske: vanlig phone sign-in/push skal ikke likestilles med FIDO2s phishing-resistens.',
        'SMS-basert first-factor sign-in finnes for utvalgte støttede Entra-brukere og apper. Det er et konkret moteksempel til at passwordless alltid er MFA: én kode som viser kontroll over telefonen gir ikke i seg selv to faktortyper. Den kontrollerte dokumentasjonen sier blant annet at denne first-factor-flyten ikke er kompatibel med Entra MFA og ikke støtter B2B-kontoer. Den anbefaler overgang til phishing-resistente metoder og varsler at Microsoft-levert SMS/voice, inkludert denne first-factor-flyten, avvikles 1. februar 2027. Dette er en datert sammenligning kontrollert 31. oktober 2026, ikke et råd om ny utrulling. Studio antar uttrykkelig en aktivert, støttet intern flyt når SMS-eksempelet velges.',
        'FIDO2-passkeys og Windows Hello for Business kan gi phishing-resistent autentisering under sine vilkår. Det betyr ikke at kontogjenoppretting, enhet, sesjon eller appdata er immune mot alle angrep. Velg metode etter faktisk støtte, brukerbekreftelse, risiko og behov, ikke bare merkelappen passwordless.',
      ],
      terms: [
        [
          'Passkey / FIDO2',
          'En opprinnelsesbundet nøkkelbasert credential under dokumenterte støttevilkår.',
        ],
        [
          'Lokal brukerbekreftelse',
          'PIN eller biometri låser opp enhetens credential; ingen slik kontroll utføres her.',
        ],
        [
          'Phishing-resistent',
          'Designet for å motstå relevante identitetsphishing-angrep; ingen universell sikkerhetsgaranti.',
        ],
      ],
      example:
        'En bedrift vil beskytte mot en falsk nettside som videresender koder. En registrert passkey med lokal brukerbekreftelse har andre egenskaper enn passwordless phone sign-in. Begge kan være uten kontopassord, men det avgjør ikke alene om det nye kravet er møtt.',
      limit:
        'Alle registrerings-, enhets- og verifikasjonsforutsetninger i Studio er erklærte. Ingen ekte passkey, biometri, Hello-innlogging, Authenticator-varsel, SMS eller token finnes i modellen.',
    },
    external: {
      title: 'Partner og kunde krysser forskjellige identitetsgrenser',
      paragraphs: [
        'En intern ansatt hører normalt til organisasjonens workforce tenant. En ekstern partner kan i stedet beholde sin identitet hos hjemmeorganisasjonens IdP og samarbeide om utvalgte ressurser. Resource tenant er organisasjonen som tilbyr ressursen; home tenant er partnerens hjemmekontekst. De er ikke to navn på samme katalog.',
        'B2B collaboration lar Fjordverk representere en ekstern samarbeidspartner i sin workforce-katalog, vanligvis som et guest user object. Partneren kan autentiseres med sin eksisterende støttede identitet. En invitasjon og eventuell innløsning/provisionering etablerer ikke automatisk alle apptillatelser, og gjester blir ikke administratorer gjennom gjestestatusen. I Studio angis en etablert gjesterepresentasjon som en forutsetning; ingen invitasjon sendes.',
        'External collaboration settings styrer blant annet hvem som kan invitere, tillatte/blokkerte invitasjonsdomener og gjesters kataloginnsyn. Cross-tenant access settings styrer inbound/outbound samarbeid med andre Entra-organisasjoner og relevant tillit til eksterne bevis. Å tillate en ny invitasjon og å tillate innlogging for en eksisterende gjest er forskjellige kontroller. En blokkering av nye domeneinvitasjoner tilbakekaller ikke i seg selv en allerede etablert gjests apprettigheter.',
        'B2B direct connect er en annen mekanisme: begge Entra-organisasjoner må konfigurere relevant gjensidig inbound/outbound tilgang. Den kontrollerte produktdokumentasjonen avgrenser bruken til Teams shared channels. Brukeren arbeider fra sin hjemmekontekst uten et vanlig gjesteobjekt i ressursorganisasjonen. Dette er ikke en universell løsning for innlogging til enhver egenutviklet app, og kanaltilgang gir ikke generell Azure- eller administratortilgang.',
        'For en kundevendt tjeneste med selvregistrering og egen kundelivssyklus tilbyr Microsoft Entra External ID customer identity and access management, CIAM, i en external tenant. Denne er atskilt fra workforce tenant og inneholder relevante kundeidentiteter, appregistreringer og brukerflyter. Kundeidentitet er ikke bare et nytt navn på en intern B2B-gjest. B2B kan også bruke støttede forbrukeridentiteter for samarbeid; det er formålet og tjenestekravene som avgjør, ikke bare e-postdomenet.',
        'En external tenant har andre støttede funksjoner enn en workforce tenant. Nåværende External ID må heller ikke beskrives som bare en omdøping av Azure AD B2C: de eksisterende B2C-tenantene og den nye kundeløsningen har egne produktgrenser. Det eldre Learn-uttrykket «formerly» kvalifiseres derfor av aktuell produktdokumentasjon. Nye B2C-kjøp ble avsluttet for nye kunder fra 1. mai 2025; migrering er utenfor denne delen.',
        'Uansett mekanisme må identitetsbevis, samarbeidsforutsetninger og konkret applikasjonstilgang undersøkes hver for seg. Et riktig partner- eller kundedesign beviser ikke at appen er sikker, at alle brukere kan lese interne data, eller at faktiske rettigheter finnes i AzureLab.',
      ],
      terms: [
        [
          'B2B collaboration',
          'Partneridentitet med representasjon i ressursens workforce-katalog.',
        ],
        [
          'B2B direct connect',
          'Gjensidig Entra-samarbeid for støttede Teams shared channels uten vanlig gjesteobjekt.',
        ],
        [
          'External tenant / CIAM',
          'Separat kundekontekst for kundevendte apper, brukerflyter og livssyklus.',
        ],
      ],
      example:
        'En leverandør skal inn i Fjordverks private prosjektapp og beholde sin arbeidsidentitet: B2B collaboration kan passe. Når Fjordverk senere lanserer selvregistrering for produktkunder i en separat kundetjeneste, gir en external tenant en annen passende grense. Shared-channel-arbeid mellom to Entra-organisasjoner må vurderes mot direct connect sine egne krav.',
      limit:
        'Valgene er deklarerte undervisningseksempler. Ingen tenant-ID, konto, gjest, invitasjon, Graph-kall, rettighet eller cross-tenant-konfigurasjon opprettes. P11 skal undervise tilgangskontroll videre.',
    },
    studio: {
      title: 'Undersøk krav, identitetsbevis og tilgang i tre perspektiver',
      paragraphs: [
        'Velg først katalog-/domeneegenskaper, deretter en innloggingsreise og til slutt en ekstern identitetsgrense. Start et guidet oppdrag, forutsi konsekvensen, kjør den deterministiske modellen og sammenlign lagrede observasjoner når ett krav endres.',
        'Det enkle resultatet viser hvor forløpet stopper og hva som fortsatt er ukjent. Tekniske detaljer og semantiske tabeller beskriver samme resultat. Endrede kontroller skriver ikke om en tidligere observasjon. Fullføring krever kontraster og en årsaksforklaring; riktig prediksjon alene er ikke selvstendig kompetanse.',
      ],
      terms: [
        ['Forutsetning', 'Et eksplisitt scenariofaktum, ikke en observert Azure-tilstand.'],
        ['Observasjon', 'Resultatet fra en lagret, eksplisitt modellkjøring.'],
      ],
      example:
        'Autentiser med en egnet metode og sett appens tilgang til «ikke dokumentert». Undersøk hvorfor identitetsbeviset kan være godkjent mens tilgang fortsatt må avklares. Endre bare appforutsetningen og sammenlign.',
      limit:
        'Ingen Conditional Access-/RBAC-motor, sanntid, tokenutstedelse eller faktisk applikasjonsrespons. Tekniske detaljer er et valgfritt tillegg; nødvendige instruksjoner og resultater vises alltid.',
    },
  },

  links: {
    title: 'Relevante forkunnskaper',
    core: 'Core Architecture — tenant og subscription',
    services: 'Service Types — kundens ansvar',
    storage: 'Storage Part B — tilgang og beskyttelse',
  },
  labels: {
    ...storageResilienceNb.labels,
    notice:
      'Start lagrer bare en lokal oppdragskontekst. Lukk og Avbryt starter ingenting. Forutsi og kjør eksplisitt; ingen identitet, credential, token eller rettighet opprettes.',
    predictionOptions: [
      'Velg prediksjon',
      'Et deklarert krav blir ikke oppfylt',
      'Et trinn eller en avklaring gjenstår',
      'De oppgitte kravene er møtt i modellen',
    ],
    directory: 'Directory & Legacy Requirements',
    journey: 'Sign-in Journey Explorer',
    external: 'External Collaboration Explorer',
    model: 'Deklarert konseptmodell — ingen ekte Entra-innlogging',
    configured: 'Deklarerte forutsetninger',
    noXp: 'Ingen XP eller automatisk kompetanse. Historikken tilhører bare denne delen.',
  },
  storage: {
    ...storageResilienceNb.storage,
    loading: 'Laster versjonert Identity-arbeid …',
    reload: 'Last inn Identity på nytt',
    recover: 'Gjenopprett bare ugyldige Identity-data',
    title: 'Identity-historikken må avklares',
    text: 'Identitetshistorikken kan ikke brukes sikkert. Last inn nyeste data, eller gjenopprett bare denne ugyldige kontrakten etter eksplisitt bekreftelse.',
  },
  assessment: {
    ...storageResilienceNb.assessment,
    title: 'Selvstendig Identity-anvendelse',
    neutral:
      'Vurder begge valgene under de oppgitte premissene. Ingen av valgene er forhåndsvalgt; riktig beslutning med feil teknisk årsak godkjennes ikke.',
    intro:
      'Løs nye identitets- og innloggingssituasjoner. Velg både beslutning og en kompatibel teknisk begrunnelse. Korrekt beslutning med feil årsak godkjennes ikke.',
  },
  summaryBoundary:
    'Besøk, guidede observasjoner, første innleveringer, hjelp og retry vises separat. Tidligere resultater oppgraderes ikke. Innholdsdekning er ikke målt forståelse, eksamensberedskap eller menneskelig godkjenning.',
  controls: {
    workload: 'Arbeidslastens krav',
    solution: 'Katalog-/domeneløsning',
    sync: 'Credential-/synkroniseringsforutsetning',
    change: 'Undersøkt endring i managed domain',
    identity: 'Identiteten finnes og er aktiv i riktig kontekst',
    trust: 'App B er integrert og stoler på oppgitt Entra-IdP',
    session: 'Gyldig innloggingskontekst fra App A',
    method: 'Valgt ny autentiseringsmetode',
    credential: 'Deklarert registrering og verifikasjon',
    requirement: 'Autentiseringskrav i dette eksempelet',
    access: 'Separat tilgang til apphandlingen',
    audience: 'Samarbeids-/kundebehov',
    approach: 'Valgt mekanisme',
    home: 'Hjemme-IdP / konfigurert kunde-IdP',
    guest: 'B2B-gjesterepresentasjon er allerede etablert',
    invitation: 'Ny B2B-invitasjon er tillatt',
    inbound: 'Relevant inbound samarbeid er tillatt',
    outbound: 'Relevant outbound samarbeid er tillatt',
    homeAuth: 'Identitetsbevis hos relevant IdP er verifisert',
  },
  options: {
    workload: {
      modern: 'Moderne app med OIDC/SAML',
      legacy: 'Uendret app med domain join, LDAP og Kerberos/NTLM',
      schema: 'Legacy-app som i tillegg krever egen schema-utvidelse',
    },
    solution: {
      entra: 'Microsoft Entra ID',
      managed: 'Microsoft Entra Domain Services',
      adds: 'Kundedrevet tradisjonell AD DS',
    },
    sync: {
      ready: 'Relevant identitet, hash og synkronisering er klargjort',
      pending: 'Nødvendige hash-/synkroniseringsforutsetninger mangler',
    },
    change: {
      none: 'Ingen katalogendring undersøkes',
      synced: 'Endre et synkronisert objekt i managed domain',
      local: 'Eget objekt i en støttet egendefinert OU',
    },
    session: {
      none: 'Ingen eksisterende kontekst',
      single: 'Egnet enkeltfaktor-kontekst',
      mfa: 'Egnet MFA-kontekst',
      resistant: 'Egnet phishing-resistent MFA-kontekst',
    },
    method: {
      password: 'Passord alene',
      'two-secrets': 'Passord + sikkerhetsfrase (to knowledge-bevis)',
      'password-otp': 'Passord + registrert besittelsesbasert kode',
      passkey: 'FIDO2-passkey + lokal PIN/biometri',
      hello: 'Windows Hello for Business + lokal PIN/biometri',
      authenticator: 'Authenticator passwordless phone sign-in + lokal bekreftelse',
      sms: 'Aktivert SMS first-factor sign-in i støttet intern app',
    },
    credential: {
      verified: 'Metoden er registrert og nødvendig bevis verifisert',
      unregistered: 'Nødvendig credential er ikke registrert',
      failed: 'Nødvendig bevis er ikke verifisert',
    },
    requirement: {
      single: 'Verifisert identitet',
      mfa: 'MFA med forskjellige faktortyper',
      resistant: 'Phishing-resistent MFA',
    },
    access: { allow: 'Deklarert tillatt', deny: 'Deklarert avvist', unknown: 'Ikke dokumentert' },
    audience: {
      partner: 'Partner i intern egenutviklet prosjektapp',
      customer: 'Selvregistrerte kunder i separat CIAM-kontekst',
      shared: 'Teams shared channel fra hjemmetenant uten gjest',
    },
    approach: {
      b2b: 'B2B collaboration',
      direct: 'B2B direct connect',
      customer: 'External ID i external tenant',
    },
    home: {
      entra: 'Annen Microsoft Entra-organisasjon',
      other: 'Annen støttet og konfigurert identitetsleverandør',
    },
  },
  model: {
    shortYes: 'Ja',
    identityAvailable: 'Identiteten er tilgjengelig i riktig kontekst.',
    identityMissing: 'Riktig identitet er ikke tilgjengelig.',
    appTrusted: 'App B er integrert og stoler på denne IdP-en.',
    appUntrusted: 'Det relevante tillitsforholdet til IdP-en mangler.',
    outcome: [
      'Et deklarert krav er ikke oppfylt',
      'Et trinn eller en avklaring gjenstår',
      'Oppgitte krav er møtt i konseptmodellen',
    ],
    snapshot: 'lagret konseptobservasjon',
    noRun: 'Ingen modellobservasjon er kjørt i dette oppdraget.',
    draftChanged: 'Forutsetningene er endret. Resultatet gjelder fortsatt siste lagrede kjøring.',
    scope:
      'Konseptuell og deterministisk. Ingen ekte Entra-innlogging, konto, credential, token, Graph, rettighet, policyvurdering eller apprespons.',
    yes: 'Ja, under de oppgitte premissene',
    no: 'Nei',
    na: 'Ikke relevant for denne mekanismen',
    unknown: 'Ikke dokumentert',
    directoryCauses: {
      capability:
        'Den valgte løsningen tilbyr ikke hele den navngitte kravkombinasjonen i dette eksempelet.',
      readonly:
        'Synkroniserte objekter kan ikke endres slik fra managed domain. Endre riktig kilde; en egen OU gir ikke retur-synkronisering.',
      sync: 'Legacy-egenskapene passer, men nødvendige credential-/synkroniseringsforutsetninger må klargjøres før identiteten kan brukes.',
      fit: 'De deklarerte katalog-/domenekravene passer. Dette er ikke en observert deployment eller innlogging.',
    },
    journeyCauses: {
      identity:
        'Identiteten er ikke tilgjengelig i riktig kontekst. Et metodenavn oppretter ikke identiteten.',
      trust: 'Appens relevante tillitsforhold mangler. Ingen gyldig appinnlogging kan utledes.',
      reused:
        'En eksisterende kontekst møter det deklarerte kravet. Den valgte nye metoden er ikke brukt i denne kjøringen.',
      credential:
        'Ny verifikasjon trengs, men den oppgitte registreringen eller verifikasjonen mangler.',
      strength:
        'Identitetsbeviset er verifisert, men møter ikke det erklærte autentiseringskravet.',
      verified:
        'Den nye metoden møter det erklærte autentiseringskravet. Undersøk apphandlingen separat.',
    },
    externalCauses: {
      purpose:
        'Mekanismen passer ikke hele det deklarerte samarbeids-/kundebehovet. Dette er ikke en universell rangering av tenanttyper.',
      'direct-scope':
        'Direct connect krever et støttet Teams shared-channel-scenario mellom Entra-organisasjoner.',
      cross:
        'Relevant tillatelse i begge organisasjoners retninger mangler. En gjest eller kanaltilordning opphever ikke dette.',
      invitation:
        'En nødvendig ny invitasjon er blokkert. Ingen representasjon er etablert eller opprettet her.',
      guest:
        'B2B trenger en etablert representasjon og relevante innløsningsforutsetninger. En tillatt invitasjon oppretter ikke objektet i modellen.',
      authentication: 'Samarbeidsforutsetningene passer, men identitetsbeviset er ikke verifisert.',
      ready:
        'De deklarerte samarbeids- og identitetsforutsetningene er møtt. Appens konkrete tilgang må fortsatt undersøkes.',
    },
    accessText: {
      'not-evaluated': 'Ikke evaluert: autentiserings-/samarbeidsforutsetninger er ikke oppfylt.',
      allowed:
        'Tillatt bare fordi denne apphandlingen er eksplisitt deklarert tillatt. Ingen faktisk tillatelse er opprettet.',
      denied: 'Identitetsbeviset kan være godkjent; denne apphandlingen er deklarert avvist.',
      unknown:
        'Identitetsbeviset kan være godkjent; relevant applikasjonstilgang er ikke dokumentert.',
    },
    factorNames: {
      knowledge: 'Knowledge — noe du vet',
      possession: 'Possession — noe du har',
      'knowledge-or-inherence': 'Lokal PIN eller biometri — brukerbekreftelse',
    },
    sessionNote:
      'Den eksisterende App A-konteksten har oppgitt bevisstyrke og antas gyldig for dette formålet. Ingen faktisk cookie eller token finnes.',
    methodAssumptions:
      'Passkey, Hello og Authenticator-eksemplene forutsetter registrert enhets-/nøkkelcredential og nødvendig lokal brukerbekreftelse når «verifisert» velges. En eventuell ny Hello-stepup forutsetter også FIDO2-aktivering og registrert passkey etter gjeldende produktvilkår. SMS forutsetter en aktivert, støttet intern first-factor-flyt; ikke B2B og ikke en universell MFA-metode.',
    directoryAssumptions:
      'Arbeidslasten antas å ha relevant nettverk/DNS. AD DS-alternativet forutsetter kundedrift og nødvendig kontroll. Ingen ekstra federation eller protokolloversettelse legges til løsningene.',
    externalAssumptions:
      'Partner betyr her en egen intern app. Shared betyr støttet Teams shared channel fra hjemmetenant uten gjest. Kunde betyr separat CIAM-livssyklus. Andre arkitekturer krever andre premisser. Cross-tenant-feltene gjelder Entra-til-Entra; eksisterende B2B-gjester mister ikke tilgang bare fordi nye invitasjoner blokkeres.',
    noAdmin: 'Gjeste-/kundestatus eller direct connect tildeler ingen administratorrettighet her.',
    syncDirection:
      'Entra ID → managed domain. Ingen synkronisering tilbake. Egne lokale OU-objekter blir ikke Entra-objekter.',
    noSyncClaim: 'Denne sammenligningen oppretter ingen tilkobling eller synkronisering.',
  },
  visual: {
    directoryTitle: 'Krav møter katalogegenskaper',
    journeyTitle: 'Fra påstått identitet til separat appavgjørelse',
    externalTitle: 'Hjemmekontekst, representasjon og ressursgrense',
    details: 'Åpne teknisk grunnlag og semantisk sammenligning',
    property: 'Egenskap / kontroll',
    result: 'Deklarert resultat',
    capability: 'Kravkombinasjon støttet',
    credentials: 'Credential-forutsetninger klare',
    write: 'Endring tillatt i undersøkt objekt',
    sync: 'Retning og kilde',
    modern: 'Moderne app-IdP alene',
    legacy: 'Domain join / LDAP / Kerberos / NTLM',
    schema: 'Egen AD DS-schema-kontroll',
    identity: 'Brukeridentitet',
    app: 'App B',
    idp: 'Microsoft Entra ID',
    proof: 'Nytt bevis eller egnet kontekst',
    authn: 'Autentiseringskrav',
    authz: 'Apphandling / AuthZ',
    proven: 'Identitetsbevis verifisert',
    homeProof: 'Identitetsbevis hos hjemme-/kunde-IdP er deklarert verifisert',
    collaborationReady: 'Katalog- og samarbeidsforutsetninger møtt',
    resourceAccepted: 'Bevis og forutsetninger akseptert i valgt ressurskontekst',
    requirements: 'Deklarert autentiseringskrav møtt',
    reused: 'Eksisterende kontekst brukt',
    methodUsed: 'Ny metode faktisk vurdert i modellen',
    factors: 'Metodens faktortyper',
    passwordless: 'Passwordless under oppgitt oppsett',
    mfa: 'Kan gi MFA-bevis under oppgitt oppsett',
    resistant: 'Phishing-resistent under oppgitt oppsett',
    methodTable: 'Metodeegenskaper — ingen faktisk verifikasjon',
    tenant: 'Ressursens tenantkonfigurasjon',
    workforce: 'Workforce tenant',
    externalTenant: 'External tenant',
    home: 'Partner / hjemme-IdP',
    customer: 'Kunde / konfigurert IdP',
    representation: 'Representasjon i ressurskatalog',
    guest: 'Etablert B2B-gjest nødvendig',
    noGuest: 'Ingen vanlig B2B-gjest nødvendig',
    customerObject: 'Kundeidentitet i egen external tenant',
    trust: 'Gjensidig relevant cross-tenant-tilgang',
    target: 'Separat app-/kanaltilgang',
    compare: 'Lagrede årsakskontraster',
    input: 'Valgte forutsetninger',
    inputDetails: 'Vis hele den lagrede forutsetningen',
    consequence: 'Konsekvens',
    administration: 'Administratorrettighet tildelt',
    truth: 'Ingen faktisk identitets-/apphandling er utført.',
  },
  missions: {
    directory: {
      title: 'Choose the Identity Architecture',
      situation:
        'Fjordverks moderne app og eldre produksjonsprogram har forskjellige protokoll- og driftskrav. Et nytt leverandørkrav gjør sammenligningen strengere.',
      goal: 'Skill Entra ID, managed domain og kundedrevet AD DS etter faktiske egenskaper og synkroniseringsgrenser.',
      where:
        'Directory & Legacy Requirements: krav, løsning, credential-forutsetning og undersøkt objekt.',
      why: 'Et felles produktnavn eller LDAP alene beviser ikke at hele arbeidslastkravet er møtt.',
      observe:
        'Resultatet skiller manglende egenskap, manglende credential-forutsetning og endring av synkronisert objekt.',
      steps: [
        'Kjør moderne app med Entra ID. Forutsi og undersøk hvilke egenskaper som dekker moderne appautentisering.',
        'Bytt til legacy-krav. Sammenlign Entra ID med Domain Services med klargjorte credential-/synkroniseringsforutsetninger.',
        'Undersøk samme legacy-krav med Domain Services: sammenlign manglende versus klargjorte credential-forutsetninger.',
        'Sammenlign endring av synkronisert objekt med eget lokalt OU-objekt i managed domain. Undersøk at lokal endring ikke betyr retur til Entra ID.',
        'Legg til schema-utvidelse i legacy-kravet. Sammenlign managed domain med kundedrevet AD DS.',
      ],
      debrief:
        'Du har sammenlignet egenskaper og kildegrenser. Managed domain kan dekke relevante legacy-krav uten at det får all AD DS-kontroll eller toveis synkronisering.',
    },
    journey: {
      title: 'Investigate a Sign-in Journey',
      situation:
        'Fjordverks App A og App B deler IdP. App B trenger sterkere bevis, og dens apprettigheter må vurderes separat.',
      goal: 'Undersøk faktortyper, egnet SSO-kontekst, passwordless og forskjellen på autentisering og apphandling.',
      where:
        'Sign-in Journey Explorer: eksisterende kontekst, metode, verifikasjon, krav og separat tilgang.',
      why: 'Antall innloggingsvinduer sier lite om bevisstyrke, og et godt identitetsbevis er ikke en apprettighet.',
      observe:
        'Flyten viser hvor beviset holder, hvor kravet stopper og om apphandlingen er tillatt, avvist eller ukjent.',
      steps: [
        'Med tilgjengelig identitet/tillit, ingen SSO-kontekst og verifisert metode: kjør to knowledge-hemmeligheter mot MFA-krav. Undersøk hvorfor kravet ikke møtes.',
        'Velg enkeltfaktor-kontekst fra App A og MFA-krav. Sammenlign passord med registrert/verifisert passkey og lokal brukerbekreftelse.',
        'Velg eksisterende MFA-kontekst mot MFA-krav. Undersøk at konteksten kan brukes uten at den valgte nye metoden vurderes.',
        'Med egnet nytt bevis: lagre avvist apphandling, endre bare apptilgang til tillatt og kjør igjen. Sammenlign AuthN og AuthZ.',
        'Fjern eksisterende kontekst. Sammenlign støttet SMS first-factor med registrert Hello og lokal brukerbekreftelse mot MFA-krav. Forklar faktorene.',
      ],
      debrief:
        'Du har skilt kontekst, faktortyper, metodeegenskaper og tilgang. Passwordless er ikke universell MFA; SSO er ikke en rettighet. Dette var ingen ekte sign-in.',
    },
    external: {
      title: 'Collaborate with an External Partner',
      situation:
        'Fjordverk samarbeider med en leverandør, lanserer en kundetjeneste og vurderer en Teams shared channel. De trenger forskjellige identitetsgrenser.',
      goal: 'Skill home/resource tenant, B2B-representasjon, kundekontekst og direct connect sine gjensidige forutsetninger.',
      where:
        'External Collaboration Explorer: formål, mekanisme, representasjon, samarbeid og apphandling.',
      why: 'At en person er ekstern bestemmer ikke alene hvordan identiteten skal organiseres eller hva personen får gjøre.',
      observe:
        'Du ser representasjonskrav, workforce/external-kontekst og separate identitets-/tilgangsresultater.',
      steps: [
        'Velg partner/B2B og verifisert hjemme-IdP. Kjør uten etablert gjest, så med etablert gjest og avvist apphandling. Undersøk forskjellen.',
        'Bytt til kundebehov med separat CIAM-livssyklus. Sammenlign B2B med External ID i external tenant under verifiserte forutsetninger.',
        'Velg Teams shared channel, direct connect og Entra-hjemmeorganisasjon. Sammenlign blokkert versus tillatt relevant outbound mens inbound er tillatt.',
        'Gå tilbake til etablert B2B-partner med tillatt samarbeid. Blokker nye invitasjoner og undersøk at eksisterende representasjon og autentisering kan bestå. Forklar separat apprettighet.',
      ],
      debrief:
        'Du har undersøkt formål, katalogrepresentasjon og samarbeidskontroller. En invitasjonsregel er ikke en komplett tilgangsregel, og en ekstern identitet blir ikke administrator av sin status.',
    },
  },
  causal: {
    directory: [
      'Når LDAP virker, blir krav til schema og credential-kilde bare driftsdetaljer som alle tre katalogene løser likt.',
      'Entra ID dekker moderne app-IdP, managed domain bestemte legacy-egenskaper; kilde, credential-forutsetninger og begrenset kontroll må vurderes separat.',
      'Egne OU-objekter etablerer toveis synkronisering og gjør managed domain til kilde for Entra ID.',
    ],
    journey: [
      'SSO viser at et ekstra appvindu er unødvendig, og gir derfor samme bevisstyrke uansett den første metoden.',
      'Passwordless fjerner kontopassordet og gir dermed samme faktortyper og phishing-egenskaper for de undersøkte metodene.',
      'Egnet kontekst og ulike faktortyper avgjør autentiseringskravet; apphandlingen har en separat tillatelse, og passwordless-metoder har ulike egenskaper.',
    ],
    external: [
      'Formål, representasjon og gjensidige samarbeidsvilkår er forskjellige fra autentisering og apprettighet; ekstern status gir ingen administratorrolle.',
      'En etablert gjest bruker ressursorganisasjonen som hjemmekatalog og arver dermed de ansattes interne tilgang.',
      'En kunde-tenant og B2B direct connect er alternative navn for samme gjesteflyt med de samme støttede appene.',
    ],
  },
  milestone: {
    directory: {
      title: 'Samme bruker er ikke samme protokoll',
      text: 'Lagrede kontraster viser Entra ID versus managed domain for legacy-kravet. Det er egenskapene og forutsetningene som endret utfallet, ikke en ekte deployment.',
    },
    journey: {
      title: 'Identitetsbevis og apphandling er forskjellige',
      text: 'Du har beholdt samme innloggingsforutsetninger og endret bare apphandlingen. AuthN kan være godkjent selv om AuthZ avviser handlingen.',
    },
    external: {
      title: 'Ekstern identitet trenger riktig grense',
      text: 'Lagrede partner-/kundekontraster viser hvorfor separat CIAM i external tenant ikke er samme løsning som B2B i workforce-katalogen.',
    },
  },
};

export const identityItemsNb = {
  if01: {
    title: 'Et nytt faktureringsskille',
    problem:
      'Et konsulenthus deler en eksisterende Azure subscription i to for å skille fakturering. De samme ansatte og interne appene fortsetter, og det er ikke bestilt en ny identitetsgrense. Hvilket utgangspunkt passer best?',
    premises: [
      'Begge subscriptions kan tilknyttes samme eksisterende Entra-tenant.',
      'Oppdraget ber om minst mulig ekstra identitetsadministrasjon; apprettigheter må fortsatt kontrolleres.',
    ],
    decisions: [
      'Opprett en ny workforce tenant og synkroniser de samme ansatte mellom tenantene.',
      'Behold eksisterende workforce tenant som katalog for begge subscriptions.',
      'Opprett egne brukerkontoer i den eksisterende tenanten for den nye subscriptionen.',
    ],
    reasons: [
      'Et nytt faktureringsskille krever at innloggingsbevis utstedes fra en annen katalog.',
      'Hver subscription trenger separate brukerobjekter for å holde ressursenes fakturering adskilt.',
      'Subscriptionenes ressurs-/faktureringsgrenser kan være ulike selv om identitetskatalogen er felles.',
    ],
    feedback: [
      [
        'En separat tenant kan være riktig ved selvstendig identitetsstyring, men innfører her synkroniserings-/tilgangsarbeid uten et slikt krav.',
        'Felles tenant dekker de oppgitte identitetsbehovene uten ekstra katalog. En egen tenant kan passe ved et uttrykkelig isolasjonskrav.',
        'Egne kontoer kan være relevant ved et uttrykkelig identitets- eller driftskrav. Et nytt faktureringsskille krever ikke i seg selv at de samme ansatte får nye brukerobjekter.',
      ],
      [
        'Separat fakturering er ikke i seg selv et krav om separat IdP. Ved et nytt isolasjonskrav må grensen vurderes igjen.',
        'Subscriptionens fakturering og brukerobjektenes identitet er forskjellige grenser. Samme tenant og brukerobjekt kan brukes på tvers under separate tilgangstildelinger.',
        'Dette skiller identity boundary fra management/billing og gir ingen automatisk ny apprettighet.',
      ],
    ],
    decisive:
      'En tenant kan være tilknyttet flere subscriptions. Den nye ressursgrensen endrer ikke alene hvem som må administreres som identiteter.',
  },
  if02: {
    title: 'Leverandørens schema-utvidelse',
    problem:
      'Et analysesystem skal flyttes uendret i denne fasen. Det bruker LDAP og krever en dokumentert egendefinert AD DS-schema-utvidelse. Organisasjonen tillater bare Microsoft-drevne domenekontrollere. Hvilken videre plan er faglig forsvarlig?',
    premises: [
      'Moderne appomskriving er utsatt; kunden har ikke mandat til å drifte egne domenekontrollere.',
      'Schema-utvidelsen er påkrevd. Vurder de tre underviste katalog-/domenealternativene uten nye tilleggstjenester.',
    ],
    decisions: [
      'Avklar endring av appkravet eller driftskravet før løsningen kan godkjennes.',
      'Bruk Entra Domain Services og legg leverandørattributtene i en egen OU.',
      'Bruk kundedrevet AD DS i Azure og la Microsoft overta domenedriften.',
    ],
    reasons: [
      'Et eget OU gir managed domain nødvendig schema-kontroll uten å endre driftsansvaret.',
      'Managed domain mangler schema-kontrollen; kundedrevet AD DS møter ikke driftskravet.',
      'AD DS i Azure beholder kundens schema-kontroll mens domenedriften blir Microsofts ansvar.',
    ],
    feedback: [
      [
        'Kravene kolliderer under de beskrevne egenskapene. Kundedrevet AD DS kan passe med et endret driftsmandat; managed domain kan passe hvis leverandøren fjerner schema-avhengigheten.',
        'En egen OU opphever ikke schema-begrensningen. Managed domain kunne passe et støttet legacy-program uten dette ekstra kravet.',
        'Å kjøre AD DS på Azure-VM-er overfører ikke domenedriften til Microsoft. Dette kunne være aktuelt hvis kunden aksepterer driftsansvaret.',
      ],
      [
        'OU-struktur og schema-kontroll er forskjellige egenskaper. En OU løser ikke den påkrevde utvidelsen.',
        'Dette knytter begge begrensningene til beslutningen. Ingen av de tre underviste alternativene oppfyller hele dette kravbildet slik det står.',
        'Dette blander IaaS-plattformansvar med kundens domene-/gjesteansvar. En separat driftstjeneste er ikke avtalt i premissene.',
      ],
    ],
    decisive:
      'En dokumentert egenskap er ikke nok når organisasjonens driftskrav utelukker løsningen. Avklar den motstridende forutsetningen i stedet for å tillegge et managed domain schema-kontroll eller Azure-VM-er Microsoft-drevet AD DS.',
  },
  if03: {
    title: 'En avdeling endres på feil sted',
    problem:
      'Et støttet legacy-program bruker et managed domain. En ansatt er synkronisert fra Entra ID. Teamet prøver å endre den synkroniserte brukerens avdelingsattributt i domenet og forventer at endringen kommer tilbake til Entra ID. Hva bør de gjøre?',
    premises: [
      'Entra ID er kilde for denne cloud-only-brukeren.',
      'Nettverk og nødvendige credential-hasher er klargjort; spørsmålet gjelder attributtets kilde.',
    ],
    decisions: [
      'Opprett et lokalt brukerobjekt i en egen OU og forvent at det erstatter Entra-objektet ved neste synkronisering.',
      'Installer Entra Connect i managed domain for å synkronisere brukerendringen tilbake til Entra ID.',
      'Endre det støttede kildeattributtet i Entra ID og la enveissynkroniseringen oppdatere managed domain.',
    ],
    reasons: [
      'Synkroniserte objekter har kilde i Entra ID; endringer i managed domain sendes ikke tilbake dit.',
      'Et lokalt OU-objekt blir kilde for det tidligere synkroniserte Entra-objektet når navnene samsvarer.',
      'Entra Connect oppretter den manglende retningen når det kjøres på managed-domain-maskiner.',
    ],
    feedback: [
      [
        'Lokale OU-objekter kan brukes lokalt under støttede vilkår, men blir ikke automatisk Entra-objekter eller erstatninger.',
        'Connect i managed domain er ikke en støttet returmekanisme til Entra ID.',
        'Riktig kilde må endres. For en hybrid bruker kan den autoritative kilden ligge i lokal AD DS; det er eksplisitt ikke premisset her.',
      ],
      [
        'Dette følger den dokumenterte retningen og begrensningen.',
        'Likhet i navn etablerer ingen slik eierskaps-/synkroniseringsrelasjon.',
        'Denne løsningen blander hybrid AD DS→Entra-synkronisering med en ikke støttet managed-domain-retur.',
      ],
    ],
    decisive:
      'Managed-domain-synkronisering er én vei. Å kunne opprette lokale objekter betyr ikke at synkroniserte objekter får en ny kilde.',
  },
  if04: {
    title: 'MFA virker, men to innlogginger gjenstår',
    problem:
      'Et reisebyrå bruker en intern Entra-integrert app og en leverandørapp med sin egen brukerkatalog. Begge krever og får gyldig MFA, men de ansatte logger inn separat. Leverandøren støtter integrasjon med Entra ID. Teamet vil redusere separate innlogginger og beholde MFA. Hvilken endring bør vurderes?',
    premises: [
      'Leverandørappen har ennå ingen tillitsrelasjon til organisasjonens Entra-IdP.',
      'Appenes konkrete tilgangskontroller skal beholdes; det er innloggingsarkitekturen som skal endres.',
    ],
    decisions: [
      'Legg til enda en MFA-metode i leverandørens eksisterende innlogging.',
      'Integrer leverandørappen for SSO med Entra ID og behold relevante MFA- og apptilgangskrav.',
      'Synkroniser samme kontopassord til leverandørkatalogen og behold separate innlogginger.',
    ],
    reasons: [
      'SSO krever at appene kan stole på felles identitetsbevis; MFA alene etablerer ikke denne tilliten.',
      'En ekstra faktortype oppretter en felles innloggingskontekst mellom uavhengige kataloger.',
      'Like passord gjør at leverandørappen kan gjenbruke den andre appens MFA-bevis.',
    ],
    feedback: [
      [
        'En ekstra metode kan styrke eller gi reserve for autentisering, men løser ikke den manglende tillitsrelasjonen mellom innloggingssystemene.',
        'Undersøk den støttede SSO-integrasjonen og behold separate krav til bevis og apphandlinger. Egnet kontekst kan da gjenbrukes; nye krav eller utløpt kontekst kan fortsatt gi en ny utfordring.',
        'Passordsynkronisering kan ha andre bruksområder, men identiske hemmeligheter gjør ikke to innlogginger til SSO eller overfører MFA-beviset.',
      ],
      [
        'Dette skiller hvordan appen stoler på en IdP fra hvor sterkt brukeren verifiseres. Hvis integrasjonen allerede var etablert, måtte kontekst og nye krav undersøkes i stedet.',
        'Faktortyper beskriver brukerbevis. Den støttede app-/IdP-integrasjonen må etableres separat.',
        'Kjennskap til samme passord er ikke en tillitsrelasjon mellom apper og gir ingen automatisk gjenbruk av MFA.',
      ],
    ],
    decisive:
      'MFA kan fungere i to isolerte innlogginger. Felles støttet IdP-tillit er et eget arkitekturvalg; verken MFA eller SSO erstatter appens tillatelser.',
  },
  if05: {
    title: 'To hemmeligheter fra forskjellige systemer',
    problem:
      'Et arkiv spør etter kontopassord og en personlig sikkerhetsfrase. Hemmelighetene lagres i forskjellige systemer, og begge er korrekt verifisert. Kravet er to forskjellige faktortyper. Hvilken endring møter dette?',
    premises: [
      'Det finnes ingen annen etablert innloggingskontekst.',
      'En registrert OATH-enhet er tilgjengelig, og passord pluss korrekt enhetskode er støttet i denne deklarerte flyten.',
    ],
    decisions: [
      'Behold de to hemmelighetene og krev at de oppdateres på forskjellige datoer.',
      'Behold passordet og flytt sikkerhetsfrasen til et eget utfordringsvindu.',
      'Erstatt sikkerhetsfrasen med verifikasjon fra den registrerte OATH-enheten.',
    ],
    reasons: [
      'To separate credential-lagre gjør at samme type hemmelighet blir to faktortyper.',
      'Passordet er knowledge, mens kontroll over den registrerte enheten gir possession.',
      'En endret dialogsekvens skiller besittelsesbeviset fra kunnskapsbeviset.',
    ],
    feedback: [
      [
        'Ulike oppdateringsdatoer kan påvirke håndtering, men endrer ikke faktorkategorien.',
        'Egen dialog kan endre brukeropplevelsen, men en hemmelig frase forblir knowledge.',
        'Dette tilfører en annen faktortype. Det er ikke en garanti mot alle phishing-angrep; et slikt strengere krav kan kreve en annen metode.',
      ],
      [
        'Lagringssted er ikke den avgjørende faktorkategorien.',
        'Dette er riktig skille under de oppgitte metode- og verifikasjonsforutsetningene.',
        'Dialoger er ikke possession. Et faktisk registrert besittelsesbevis ville være en annen forutsetning.',
      ],
    ],
    decisive:
      'Faktorene avgjøres av hva beviset representerer, ikke antall hemmeligheter, databaser eller vinduer.',
  },
  if06: {
    title: 'Vernet mot videresendt innloggingsbevis',
    problem:
      'Et team har passwordless phone sign-in i Authenticator med nummermatching og lokal PIN. Et nytt krav ber om opprinnelsesbundet phishing-resistent autentisering for en støttet webapp. En registrert FIDO2-passkey med lokal brukerbekreftelse er tilgjengelig. Hvilken metode passer det nye kravet?',
    premises: [
      'Metoden må møte det nye kravet, ikke bare være uten kontopassord.',
      'Registrering, brukerbekreftelse og appstøtte er klargjort for passkey-alternativet.',
    ],
    decisions: [
      'Bruk den registrerte FIDO2-passkeyen med lokal brukerbekreftelse.',
      'Behold passwordless phone sign-in med nummermatching som samme sikkerhetsegenskap.',
      'Bytt til passord pluss OATH-kode som den opprinnelsesbundne metoden.',
    ],
    reasons: [
      'Nummermatching gir phone sign-in samme opprinnelsesbinding som FIDO2 i denne appen.',
      'To faktortyper gir den etterspurte opprinnelsesbindingen uavhengig av metoden.',
      'FIDO2 binder beviset til tjenesten; phone sign-in og OATH-koder gjør ikke det.',
    ],
    feedback: [
      [
        'FIDO2 med de oppgitte vilkårene møter dette egenskapskravet. Kontogjenoppretting, enhet og appautorisasjon må fortsatt håndteres.',
        'Phone sign-in kan være en sterk passwordless-flyt, men må ikke likestilles med FIDO2s phishing-resistens. En passkey i Authenticator er en egen FIDO2-metode.',
        'Passord pluss kode kan møte MFA, men koden kan fortsatt phishing-videresendes; kravet her er strengere.',
      ],
      [
        'Nummermatching er nyttig, men etablerer ikke den samme protokollbindingen.',
        'MFA og phishing-resistens er relaterte, men forskjellige egenskaper.',
        'Dette skiller metodeegenskaper fra en felles passwordless-merkelapp.',
      ],
    ],
    decisive:
      'Metoden og dens bevisegenskaper avgjør om det nye kravet er møtt. Passwordless alene gir ikke en slik konklusjon.',
  },
  if07: {
    title: 'PIN-en er kjent, men jobb-PC-en er byttet',
    problem:
      'En ansatt har brukt Windows Hello for Business med lokal PIN på sin gamle jobb-PC. Etter maskinbytte husker personen PIN-en, men den nye PC-en har ikke fått noen Hello-credential for brukeren. Hva er et forsvarlig neste steg før Hello kan brukes der?',
    premises: [
      'Ingen Hello-nøkkel eller egnet innloggingskontekst er overført eller klargjort på den nye PC-en.',
      'Organisasjonen har en godkjent prosess for registrering og gjenoppretting; oppgaven ber ikke om å omgå den.',
    ],
    decisions: [
      'Klargjør Hello på den nye PC-en gjennom organisasjonens godkjente registreringsprosess.',
      'Bruk den gamle PIN-en som kontopassord i appens ordinære Entra-innlogging.',
      'Overfør bare PIN-en til den nye PC-en som tilstrekkelig eksisterende Hello-bevis.',
    ],
    reasons: [
      'Den huskede PIN-en kan alene bevise besittelse av credentialen på en hvilken som helst PC.',
      'Passwordless gjør at brukeren kan gjenbruke sin lokale PIN som et serververifisert kontopassord.',
      'Hello bruker en registrert enhetscredential; lokal PIN alene klargjør ikke denne på en ny PC.',
    ],
    feedback: [
      [
        'Bruk den godkjente prosessen til å etablere nødvendig credential og lokal brukerbekreftelse. Et allerede klargjort, støttet oppsett ville gitt et annet utgangspunkt.',
        'En Hello-PIN er ikke Entra-kontoens fjernpassord. Å kjenne den etablerer ikke et nytt serverpassord eller et nytt enhetsbevis.',
        'Det manglende er ikke bare et nytt PIN-felt. Registrering av en støttet enhetscredential må håndteres; ingen nøkkel finnes her etter premisset.',
      ],
      [
        'Kunnskap om en PIN kan ikke erstatte den manglende enhetscredentialen og dens registrering.',
        'Passwordless betyr ikke at en lokal brukerbekreftelse blir et portabelt kontopassord.',
        'Dette skiller lokal brukerbekreftelse fra den registrerte credentialen. Gjenoppretting og ny klargjøring må følge organisasjonens støttede prosess.',
      ],
    ],
    decisive:
      'En lokal PIN virker sammen med en klargjort credential. Maskinbytte endrer forutsetningene, selv om personen husker samme tall.',
  },
  if08: {
    title: 'Partneren er innlogget, men ser ikke rapporten',
    problem:
      'En etablert B2B-gjest bruker partnerens arbeidskonto i prosjektappen. I en ny rapportapp får personen «Ingen tilgang» etter innlogging. Hva bør undersøkes først?',
    premises: [
      'Rapportappen godtar gjestens autentisering, og relevante samarbeidsregler er oppfylt.',
      'Oppdraget gjelder lesing i rapportappen; gjesten skal ikke få katalogadministrasjon.',
    ],
    decisions: [
      'Kontroller om gjestens innsyn i Entra-katalogen må utvides til internt nivå.',
      'Kontroller rapportappens tildeling til det eksisterende gjesteobjektet.',
      'Kontroller om partnerens e-postdomene må tillates for en ny gjesteinvitasjon.',
    ],
    reasons: [
      'Nye invitasjonsregler gir en etablert gjest tilgang til flere interne apper.',
      'Gjestens kataloginnsyn avgjør hvilke interne rapportdata personen kan lese.',
      'Godkjent identitetsbevis erstatter ikke rapportappens tilgangskontroll.',
    ],
    feedback: [
      [
        'Kataloginnsyn kan være et eget behov, men gir ikke i seg selv rettigheten i rapportappen.',
        'Kontroller at riktig gjesteobjekt har nødvendig avgrenset rapporttilgang. Opplysningene viser at autentiseringen virker, men fastslår ennå ikke om tildelingen faktisk mangler. En ny app kan kreve egen tilgang selv når prosjektappen virker.',
        'Invitasjonsregler gjelder etablering av nye gjester. Her er representasjon og autentisering allerede på plass.',
      ],
      [
        'Dette blander ny invitasjon med apptildeling for et eksisterende objekt.',
        'Katalogens objektsynlighet og appens datarettighet er forskjellige kontroller.',
        'Dette følger den oppgitte home/resource-grensen og gjør ikke gjesten til administrator.',
      ],
    ],
    decisive:
      'Et eksisterende gjesteobjekt og godkjent autentisering er ikke en komplett apptillatelse.',
  },
  if09: {
    title: 'En kunde blir også prosjektpartner',
    problem:
      'En person har en privat kundekonto i selskapets external tenant for nettbutikken. Nå skal personen også arbeide som konsulent i en intern prosjektapp, med arbeidskonto fra sitt eget firma. Hvordan bør det nye samarbeidet etableres uten å endre kundekontoens formål?',
    premises: [
      'Prosjektappen skal fortsatt stole på selskapets workforce tenant; nettbutikkens kundeoppsett skal beholdes.',
      'Partnerfirmaet skal fortsatt forvalte arbeidslegitimasjonen. Samarbeidet gjelder avgrenset prosjektarbeid.',
    ],
    decisions: [
      'Flytt prosjektappens innlogging til kundetenanten og tildel den eksisterende kundeprofilen.',
      'Opprett en ny intern member-konto med et separat arbeidskontopassord hos ressursorganisasjonen.',
      'Bruk arbeidskontoen gjennom B2B i workforce-tenanten, med egen tildeling til prosjektappen.',
    ],
    reasons: [
      'Eksisterende kundeautentisering utgjør allerede en gjesterepresentasjon i selskapets workforce.',
      'Samme person kan ha ulike identiteter; en kundeprofil etablerer ikke workforce-samarbeid.',
      'En ny member-konto er nødvendig når en samarbeidspartner allerede har en konto i en external tenant.',
    ],
    feedback: [
      [
        'En kundevendt app kan bruke external tenant, men å flytte prosjektappen endrer den uttrykkelig beholdte tillitsgrensen og kundekontoens formål.',
        'En intern konto kan passe en ansatt i en annen situasjon. Her skal partneren beholde hjemmeorganisasjonens arbeidslegitimasjon og trenger ikke en ny intern identitet.',
        'Etabler relevant B2B-representasjon og avgrenset apptilgang med den støttede arbeidsidentiteten. Den separate private kundekontoen kan beholdes som kundeidentitet.',
      ],
      [
        'En konto i kundetenanten oppretter ikke et objekt eller en tillitsrelasjon i workforce-tenanten.',
        'Dette følger både personens to roller og tenantgrensene. Hvis oppgaven bare gjaldt nettbutikken, ville kundekonteksten fortsatt vært den relevante.',
        'Eksistensen av en kundeprofil krever ikke en ny intern member-konto. B2B kan bevare den oppgitte arbeidsidentiteten.',
      ],
    ],
    decisive:
      'Person, kundeidentitet og arbeidsidentitet er ikke samme katalogobjekt. Et nytt samarbeidsformål krever riktig representasjon og separat tilgang i ressurskonteksten.',
  },
  if10: {
    title: 'En shared channel stopper ved partnergrensen',
    problem:
      'En partnerbruker får ikke åpnet en Teams shared channel hos en annen Entra-organisasjon. Organisasjonene har valgt B2B direct connect. Hvilken gjenstående samarbeidskontroll er mest relevant?',
    premises: [
      'Brukeren er lagt til kanalen, og ressursorganisasjonens inbound tillater relevant direct connect.',
      'Øvrige tjenesteforutsetninger er oppfylt; løsningen skal fortsatt være shared channel fra brukerens hjemmekontekst.',
    ],
    decisions: [
      'Kontroller hjemmeorganisasjonens inbound direct connect fra ressursorganisasjonen.',
      'Inviter brukeren som B2B-gjest til teamet og tilby samarbeidet i en standardkanal.',
      'Kontroller hjemmeorganisasjonens outbound direct connect mot ressursorganisasjonen.',
    ],
    reasons: [
      'Hjemmeorganisasjonens inbound styrer brukerens tilgang til eksterne kanaler.',
      'Denne reisen krever ressursens inbound og hjemmeorganisasjonens outbound.',
      'Gjestetilgang til teamet beholder samme representasjon som B2B direct connect.',
    ],
    feedback: [
      [
        'Hjemmeorganisasjonens inbound gjelder når den mottar eksterne brukere til egne ressurser. Her skal dens bruker ut til en annen organisasjons kanal.',
        'B2B-gjest i en standardkanal kan passe et endret samarbeidsbehov, men endrer representasjon og reise i strid med dette premisset.',
        'Hjemmeorganisasjonens relevante outbound er ikke bekreftet i opplysningene. Kontroller denne retningen før en eventuell avgrenset endring vurderes.',
      ],
      [
        'Retningen må følge hvem som eier ressursen. Hjemmeorganisasjonens inbound åpner ikke dens brukers utreise.',
        'Dette er den relevante gjensidige grensen. Kanalmedlemskap og identitetsbevis erstatter ikke samarbeidskontrollen.',
        'Guest collaboration og direct connect er forskjellige mekanismer. En standardkanal kan være et alternativ ved et annet produktbehov.',
      ],
    ],
    decisive:
      'Den relevante uavklarte retningen er hjemmeorganisasjonens outbound mot ressursorganisasjonens inbound. Opplysningene beviser ikke en blokkering; de viser hva som må kontrolleres før en eventuell endring.',
  },
} as const;
