/** Read-only navigation projection. Session truth stays in the existing learning stores. */
export type GuidePhase = 'new' | 'active' | 'cause' | 'complete' | 'paused' | 'unavailable';
export interface GuideDestination {
  id: string;
  title: string;
  href: string;
  phase: GuidePhase;
  current: boolean;
  session: number | null;
  completedBefore: boolean;
  resume?: () => boolean;
}
export interface GuidedModule {
  id: string;
  ready: boolean;
  issue: string | null;
  guides: GuideDestination[];
  assessment: string;
}
export interface FlowAction {
  href: string;
  label: string;
  title: string;
  kind: 'brief' | 'work' | 'cause' | 'resume' | 'next' | 'assessment' | 'recovery';
  activate?: () => boolean;
}
export const flowCopy = {
  start: 'Start undersøkelsen',
  work: 'Fortsett undersøkelsen',
  cause: 'Fullfør årsaksforklaringen',
  resume: 'Gjenoppta undersøkelsen',
  next: 'Neste guidede oppdrag',
  assessment: 'Fortsett til selvstendig anvendelse',
  activeAssessment: 'Fortsett vurderingen',
  recovery: 'Kontroller læringshistorikken',
  new: 'Ikke startet',
  active: 'Pågår',
  complete: 'Fullført guidet undersøkelse · tilgjengelig for repetisjon',
  paused: 'Pauset undersøkelse',
  unavailable: 'Oppdragskonteksten må kontrolleres',
  open: 'Åpne SavvyShark-briefing',
  review: 'Se undersøkelsen igjen',
  resumeFailed: 'Undersøkelsen kunne ikke gjenopptas. Kontroller lagringen før du fortsetter.',
} as const;
export const briefingHref = (guide: GuideDestination) =>
  `${guide.href}&brief=${encodeURIComponent(guide.id)}`;
export const latestPausedGuide = (module: GuidedModule) =>
  module.guides
    .filter((g) => g.phase === 'paused')
    .sort((a, b) => (b.session ?? 0) - (a.session ?? 0))[0];

/** Direct navigation remains free. Only the recommended primary action changes. */
export function guidedNext(
  module: GuidedModule,
  topic: string,
  perspective?: string | null,
): FlowAction | undefined {
  if (!module.ready || module.issue)
    return {
      href: module.guides[0]?.href ?? module.assessment,
      label: flowCopy.recovery,
      title: flowCopy.unavailable,
      kind: 'recovery',
    };
  const current = module.guides.find((g) => g.current && g.phase !== 'complete');
  const selected =
    module.guides.find((g) => g.id === perspective) ??
    module.guides.find(
      (g) =>
        g.current &&
        new URL(g.href, 'https://azurelab.invalid').searchParams.get('topic') === topic,
    ) ??
    module.guides.find(
      (g) => new URL(g.href, 'https://azurelab.invalid').searchParams.get('topic') === topic,
    );
  const guide =
    current ??
    selected ??
    (topic === 'missions'
      ? (latestPausedGuide(module) ?? module.guides.find((g) => g.phase === 'new'))
      : undefined);
  if (!guide) return undefined;
  if (guide.phase === 'unavailable')
    return { href: guide.href, label: flowCopy.recovery, title: guide.title, kind: 'recovery' };
  if (guide.phase === 'paused' && guide.resume)
    return {
      href: guide.href + '#guided-work',
      label: flowCopy.resume,
      title: guide.title,
      kind: 'resume',
      activate: guide.resume,
    };
  if (guide.phase === 'new')
    return { href: briefingHref(guide), label: flowCopy.start, title: guide.title, kind: 'brief' };
  if (guide.phase === 'complete') {
    const next = module.guides.find((g) => g.phase !== 'complete' && !g.completedBefore);
    return next
      ? { href: next.href, label: flowCopy.next, title: next.title, kind: 'next' }
      : {
          href: module.assessment,
          label: flowCopy.assessment,
          title: 'Nytt selvstendig forsøk starter først når du velger Start.',
          kind: 'assessment',
        };
  }
  return {
    href: guide.href + (guide.phase === 'cause' ? '#guided-cause' : '#guided-work'),
    label: guide.phase === 'cause' ? flowCopy.cause : flowCopy.work,
    title: guide.title,
    kind: guide.phase === 'cause' ? 'cause' : 'work',
  };
}

export function guidedResume(module: GuidedModule | undefined): string | undefined {
  if (!module?.ready || module.issue) return undefined;
  const active = module.guides.find((g) => g.current);
  if (active)
    return active.phase === 'complete'
      ? guidedNext(
          module,
          new URL(active.href, 'https://azurelab.invalid').searchParams.get('topic')!,
          active.id,
        )?.href
      : active.href;
  return latestPausedGuide(module)?.href;
}

export interface GuideSession {
  id: number;
  mission: string;
  runs: readonly unknown[];
}
interface Source<G extends GuideSession> {
  ready: boolean;
  issue: string | null;
  facts: { guide?: G; guided: G[]; completed: readonly string[] };
  store: { event(e: unknown): boolean };
}
/** Uses existing replay/evaluators, including the native evidence predicates. No new completion state. */
export function projectGuides<G extends GuideSession, K extends G['mission']>(
  id: string,
  source: Source<G>,
  ids: readonly K[],
  titles: Record<K, { title: string }>,
  href: (id: K) => string,
  assessment: string,
  evaluate: (g: G) => { witnessed: boolean; complete: boolean; valid?: boolean },
  resumeSupported = true,
): GuidedModule {
  return {
    id,
    ready: source.ready,
    issue: source.issue,
    assessment,
    guides: ids.map((mission): GuideDestination => {
      const active = source.facts.guide?.mission === mission ? source.facts.guide : undefined;
      const session = active ?? source.facts.guided.filter((g) => g.mission === mission).at(-1);
      const result = session ? evaluate(session) : null;
      const valid = result?.valid !== false;
      const completedBefore = source.facts.completed.includes(mission) || !!result?.complete;
      const paused = !!session && !active && resumeSupported;
      return {
        id: mission,
        title: titles[mission].title,
        href: href(mission),
        current: !!active,
        session: session?.id ?? null,
        completedBefore,
        phase:
          !source.ready || source.issue || !valid
            ? 'unavailable'
            : result?.complete
              ? 'complete'
              : paused
                ? 'paused'
                : active
                  ? result?.witnessed
                    ? 'cause'
                    : 'active'
                  : 'new',
        ...(paused && valid
          ? { resume: () => source.store.event({ kind: 'resume', id: session!.id }) }
          : {}),
      };
    }),
  };
}
