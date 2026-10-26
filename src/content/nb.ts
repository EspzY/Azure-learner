import type { QuestionId } from '../domain/assessment';
import type { CreationError, Region, ScopeKind } from '../domain/simulation';

export const nb = {
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
    search: 'Søk i ressurser, tjenester og kilder',
    searchPlaceholder: 'Søk i ressurser, tjenester og dokumentasjon',
    searchResults: 'Søkeresultater',
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
    services: 'AzureLab services',
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
    close: 'Lukk panelet',
    create: 'Create',
    review: 'Review + create',
    basics: 'Basics',
    tags: 'Tags',
    next: 'Next',
    previous: 'Previous',
    edit: 'Endre konfigurasjon',
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
    noGroup: 'Velg en ressursgruppe',
    noPlan: 'Ingen plan valgt',
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
    sequence: 'Sekvens',
    status: 'Status',
    added: 'Opprettet i modellen',
    rejected: 'Ikke opprettet',
    resourceState: 'Konfigurasjon registrert lokalt · kjøretid og helse er ikke vurdert',
    scope: 'Scope',
    parent: 'Parent',
    contains: 'Inneholder',
    viewResource: 'Åpne ressursen i portalen',
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
    profile: 'Size · treningsprofil',
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
    profile: 'Size · treningsprofil',
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
    osDisk: 'OS disk · obligatorisk',
    osNote:
      'Linux får 64 GiB og Windows 128 GiB i denne modellen. OS-disken inneholder oppstartssystemet. Dette er våre tildelinger, ikke Azure-minimum for alle images.',
    dataDisk: 'Data disk · varig lagring',
    noData: 'Ingen ekstra datadisk',
    dataNote:
      'En ekstra managed disk er separat fra OS-disk og RAM. Backup, krypteringsvalg og midlertidig disk er ikke modellert.',
    network: 'Virtual network / subnet',
    newNetwork: 'Opprett nytt treningsnettverk',
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
