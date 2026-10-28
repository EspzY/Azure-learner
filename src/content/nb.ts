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
    'Fire Compute-mål er tilgjengelige. Networking og Storage kommer senere. Lokal trening, ingen Azure-konto eller reelle ressurser.',
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
