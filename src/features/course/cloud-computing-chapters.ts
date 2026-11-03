import { v2Topics, type V2Topic } from '@/domain/curriculum/foundations-v2';
import { serverlessTopics } from '@/domain/curriculum/serverless';

/** Pedagogical navigation only. Original topics and evidence contracts are unchanged. */
export const cloudChapters = [
  {
    topic: 'intro-request',
    title: 'Fra nettside til fysisk server',
    objective: 'Følg en forespørsel og undersøk maskinen som kjører programmet som svarer.',
    members: ['intro-request', 'physical-server'],
    connection:
      'En forespørsel behandles av et program. Programmet bruker prosessor, minne og lagring på en fysisk maskin. Nå skal vi se hvordan flere virtuelle maskiner kan dele denne maskinen.',
    guide: null,
  },
  {
    topic: 'virtualization',
    title: 'Virtualisering og bestilling av skykapasitet',
    objective:
      'Undersøk hvordan en fysisk vert deles, og hva det betyr å bestille en ressurs som tjeneste.',
    members: ['virtualization', 'provisioning'],
    connection:
      'Virtuelle ressurser har fysiske grenser. Provisioning er en bestilling til administrasjonssystemet; den er forskjellig fra forespørselen til butikkens applikasjon. I neste økt undersøker vi om den tildelte kapasiteten dekker etterspørselen.',
    guide:
      'Prøv først en minnetildeling som verten ikke kan oppfylle. Sammenlign deretter med en avvist bestilling nedenfor. Begge har grenser, men modellene undersøker forskjellige mekanismer.',
  },
  {
    topic: 'capacity-basics',
    title: 'Kapasitet og etterspørsel',
    objective: 'Bruk én tydelig enhet, forutsi udekket behov og sammenlign to egne kjøringer.',
    members: ['capacity-basics', 'v2-capacity'],
    connection:
      'Kapasitet og etterspørsel må sammenlignes innen samme time. Mer kapasitet kan redusere udekket behov og samtidig øke ubrukt kapasitet. Leverandørens kapasitet fritar heller ikke kunden fra ansvar; det er temaet i neste økt.',
    guide:
      'Forutsi den travleste timen før du kjører. Endre deretter bare allokeringen og forklar forskjellen mellom udekket behov og ubrukt kapasitet ut fra de to kjøringene.',
  },
  {
    topic: 'v2-responsibility',
    title: 'Ansvar når infrastrukturen blir en tjeneste',
    objective: 'Sammenlign konkrete tjenester og finn kundens gjenværende oppgaver.',
    members: ['v2-responsibility'],
    connection:
      'Hvem som drifter et lag avhenger av tjenesten. Data og tilgang krever fortsatt kundens valg. Dette er en annen akse enn public, private og hybrid cloud, som vi undersøker videre.',
    guide: null,
  },
  {
    topic: 'v2-models',
    title: 'Cloud-modeller og valg av miljø',
    objective: 'Koble public, private og hybrid cloud til krav som faktisk avgjør plasseringen.',
    members: ['v2-models', 'v2-placement'],
    connection:
      'Velg miljø ut fra bruksgrense, eksklusivitet og integrasjonsbehov. Et byggs adresse avgjør ikke cloud-modellen. Neste økt skiller målt forbruk fra nyttig arbeid og undersøker betalingsrisiko.',
    guide: null,
  },
  {
    topic: 'v2-metering',
    title: 'Forbruk, betaling og risiko',
    objective: 'Se hva som måles, og vurder betaling og forpliktelser under endret etterspørsel.',
    members: ['v2-metering', 'v2-pricing'],
    connection:
      'Målt ressursbruk og nyttig arbeid er forskjellige størrelser. En rabatt eller lav enhetspris avgjør ikke totalen alene. Serverless bygger videre på ansvar, ressursbruk og planavhengige grenser.',
    guide: null,
  },
] as const satisfies readonly {
  topic: V2Topic;
  title: string;
  objective: string;
  members: readonly V2Topic[];
  connection: string;
  guide: string | null;
}[];
export type CloudChapter = (typeof cloudChapters)[number];
export const cloudChapterFor = (topic: string) =>
  cloudChapters.find((chapter) => (chapter.members as readonly string[]).includes(topic));
export const cloudRecommendedTopics: readonly string[] = [
  ...cloudChapters.map((chapter) => chapter.topic),
  ...serverlessTopics,
  'resource-bridge',
  'transfer',
];
/** Historical deep links resolve in place, never rewrite the persisted resume. */
export const cloudNavigationTopic = (topic: string) => cloudChapterFor(topic)?.topic ?? topic;
export const cloudOriginalTopics = [
  ...v2Topics.slice(0, -1),
  ...serverlessTopics,
  v2Topics.at(-1)!,
  'transfer',
] as const;
