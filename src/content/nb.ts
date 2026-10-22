import type { QuestionId } from '../domain/assessment';
import type { CreationError, Region, ScopeKind } from '../domain/simulation';

export const nb = {
  brand: 'AzureLab',
  tagline: 'Fra nysgjerrighet til kompetanse.',
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
    { href: '/', label: 'Oversikt', icon: 'dashboard' },
    { href: '/explore', label: 'Utforsk', icon: 'explore' },
    { href: '/missions', label: 'Oppdrag', icon: 'missions' },
    { href: '/progress', label: 'Fremgang', icon: 'progress' },
  ],
  shell: {
    workspace: 'DITT LÆRINGSROM',
    path: 'Azure Fundamentals',
    pathTag: 'Læringssti · første steg',
    local: 'Lokal prototype',
    simulation: 'Simulert miljø',
    safe: 'Ingen Azure-tilkobling',
    guest: 'Lokal utforsker',
    account: 'Fremgang på denne enheten',
    skip: 'Hopp til innhold',
    footer: 'Et uavhengig læringsprosjekt. Ikke tilknyttet Microsoft.',
    phase: 'PHASE 0',
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
      'Bare fullførte milepæler lagres. Ingen konto, sporing eller leaderboard. Nettleserdata kan endres eller slettes og er ikke et kompetansebevis.',
    reset: 'Slett lokal fremgang',
    cancel: 'Behold fremgangen',
    confirm: 'Slett fremgangen nå',
    confirmText: 'Dette sletter de lokale milepælene og XP. Handlingen kan ikke angres.',
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
