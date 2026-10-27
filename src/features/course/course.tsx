'use client';
import { usePractical } from './practical-provider';
import { practicalHref } from '@/domain/sandbox/practical';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, ArrowRight, ChevronRight, FlaskConical, Check, Menu } from 'lucide-react';
import { labsNb, nb, serverlessNb, architectureNb } from '@/content/nb';
import { officialLearning } from '@/domain/curriculum/official';
import { unitIds } from '@/domain/curriculum/manifest';
import { topics, portalHref, parseLocation, type PortalLocation } from '@/domain/portal/model';
import {
  courseHref,
  courseLabHref,
  courseTopic,
  labFacts,
  startLab,
  type CourseModule,
} from '@/domain/course/model';
import { PracticalAssistance, PracticalOutcome } from './practical-lab';
import { useSandbox as useChapter } from '@/features/portal/sandbox-provider';
import { useLearning } from '@/features/learning/provider';
import { usePortalLearning } from '@/features/portal/learning-provider';
import {
  ServicesWorkspace,
  FoundationsWorkspace,
  ServiceReference,
  FoundationsReference,
} from '@/features/portal/learning';
import { PortalDialog } from '@/features/portal/shared';
import { ArchitectureExplorer } from '@/features/portal/architecture';
import { SavvyShark } from './savvy-shark';
import { MissionBriefing } from './mission-briefing';
import { useCourse } from './provider';
import { CourseNavigation } from './course-navigation';
import { ExpandedModule, ExpansionReference } from '@/features/learning/expanded-module';
import { useExpansion, ExpansionAssistance } from '@/features/learning/expansion-provider';
import { trackUnits } from '@/domain/curriculum/expansion';
import { manuscript } from '@/domain/curriculum/expansion-content';
import { FoundationsV2 } from '@/features/learning/foundations-v2';
import { useFoundationsV2 } from '@/features/learning/v2-provider';
import { isV2Topic, v2Topics } from '@/domain/curriculum/foundations-v2';
import '@/features/portal/portal.css';
import './course.css';
const c = nb.course;
import { useServerless } from '@/features/learning/serverless-provider';
import { ServerlessLesson } from '@/features/learning/serverless';
import { isServerlessTopic, serverlessTopics } from '@/domain/curriculum/serverless';
import { usePhysical } from '@/features/learning/physical-provider';
import { PhysicalLesson } from '@/features/learning/physical';
import { PhysicalCourseEntry } from '@/features/learning/physical-entry';
import { physicalTopics, type PhysicalTopic } from '@/domain/curriculum/architecture-physical';
const names = {
  architecture: architectureNb.title,
  computing: nb.official.computing,
  services: nb.official.services,
  benefits: nb.official.benefits,
};
export function Course({ module }: { module?: CourseModule }) {
  const practical = usePractical(),
    serverless = useServerless(),
    physical = usePhysical();
  const query = useSearchParams(),
    router = useRouter(),
    course = useCourse(),
    learning = useLearning(),
    services = usePortalLearning(),
    chapter = useChapter(),
    v2 = useFoundationsV2(),
    benefits = useExpansion('benefits'),
    service2 = useExpansion('services');
  const legacyServices =
    module === 'services' &&
    (query.get('version') === '1' ||
      (query.get('version') === null && service2.facts.choice === 'v1'));
  const serviceChoice =
    module === 'services' &&
    !legacyServices &&
    services.save.events.length > 0 &&
    service2.facts.choice === null;
  const serviceHref = (t: string) =>
    `${courseHref('services', t)}${legacyServices ? '&version=1' : query.get('version') === '2' ? '&version=2' : ''}`;
  const topic =
    legacyServices && !(topics as readonly string[]).includes(query.get('topic') ?? 'overview')
      ? 'overview'
      : module
        ? courseTopic(module, query.get('topic'))
        : 'overview';
  useEffect(() => {
    if (
      module === 'services' &&
      !legacyServices &&
      services.ready &&
      service2.ready &&
      !services.save.events.length &&
      service2.facts.choice === null
    )
      service2.store.event({ kind: 'choose', version: 'v2' });
  }, [
    module,
    legacyServices,
    services.ready,
    services.save.events.length,
    service2.ready,
    service2.facts.choice,
    service2.store,
  ]);
  const currentV2 = module === 'computing' && (isV2Topic(topic) || isServerlessTopic(topic));
  const hasV1 = learning.save.events.length > 0;
  const chooseVersion = currentV2 && hasV1 && v2.save.choice === null;
  const computingEntry =
    hasV1 && v2.save.choice === 'v1'
      ? courseHref('computing', learning.facts.active ? 'assessment' : learning.save.unit)
      : courseHref('computing', 'intro-request');
  const labTopic =
    (module === 'services' && topic === 'practice') ||
    (module === 'computing' && topic === 'resource-bridge');
  const [briefing, setBriefing] = useState(false);
  const [journal, setJournal] = useState(false),
    [menu, setMenu] = useState(false);
  const labRef = useRef<HTMLElement>(null),
    debriefRef = useRef<HTMLElement>(null),
    activityRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      !module ||
      !course.ready ||
      chooseVersion ||
      ['lab', 'debrief', 'practical'].includes(query.get('activity') ?? '')
    )
      return;
    let settled = 0;
    const frame = requestAnimationFrame(() => {
      settled = requestAnimationFrame(() => {
        const heading = activityRef.current?.querySelector<HTMLElement>(
          '[data-activity-heading], h2, h3',
        );
        if (heading) {
          heading.tabIndex = -1;
          heading.scrollIntoView({ block: 'start', behavior: 'instant' });
          heading.focus({ preventScroll: true });
        }
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settled);
    };
  }, [module, topic, course.ready, chooseVersion, query]);
  useEffect(() => {
    if (module && course.ready && !chooseVersion)
      course.store.update({ ...course.store.getSnapshot().save, resume: { module, topic } });
  }, [module, topic, course.ready, course.store, chooseVersion]);
  useEffect(() => {
    if ((!module && !journal) || chooseVersion) return;
    if (services.facts.active) services.store.event({ kind: 'aid' });
    if (
      learning.facts.active &&
      (journal || !(module === 'computing' && ['assessment', 'summary'].includes(topic)))
    )
      learning.store.event({ kind: 'aid' });
  }, [
    module,
    topic,
    journal,
    chooseVersion,
    services.facts.active,
    services.store,
    learning.facts.active,
    learning.store,
  ]);
  useEffect(() => {
    if (
      v2.facts.active &&
      (journal || (module && topic !== 'v2-assessment' && topic !== 'v2-summary'))
    )
      v2.store.event({ kind: 'aid' });
  }, [v2.facts.active, v2.store, module, topic, journal]);
  useEffect(() => {
    if (
      serverless.facts.active &&
      (journal || (module && topic !== 'serverless-assessment' && topic !== 'serverless-summary'))
    )
      serverless.store.event({ kind: 'aid' });
  }, [
    serverless.facts.active,
    serverless.ready,
    serverless.issue,
    serverless.store,
    journal,
    module,
    topic,
  ]);
  useEffect(() => {
    if (
      physical.facts.active &&
      (journal || (module && !(module === 'architecture' && topic === 'assessment')))
    )
      physical.store.event({ kind: 'aid' });
  }, [
    physical.facts.active,
    physical.ready,
    physical.issue,
    physical.store,
    journal,
    module,
    topic,
  ]);
  const lab = labFacts(course.save.lab, chapter.attempt.engine, chapter.attemptNumber);
  const existingSession = {
    ...startLab(chapter.attempt.engine, chapter.attemptNumber),
    boundary: null,
  };
  const existing = labFacts(existingSession, chapter.attempt.engine, chapter.attemptNumber);
  useEffect(() => {
    if (!course.ready || !chapter.ready || !labTopic) return;
    const scroll = () => {
      const activity = query.get('activity');
      if (activity === 'debrief' || activity === 'lab') {
        const target = activity === 'debrief' && lab.complete ? debriefRef.current : labRef.current;
        target?.scrollIntoView({ block: 'start', behavior: 'instant' });
        target?.focus({ preventScroll: true });
      }
    };
    let settledFrame = 0;
    const frame = requestAnimationFrame(() => {
      settledFrame = requestAnimationFrame(scroll);
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settledFrame);
    };
  }, [course.ready, chapter.ready, labTopic, lab.complete, query]);
  const preferredResume =
    course.save.resume ??
    (learning.save.events.length
      ? { module: 'computing' as const, topic: learning.save.unit }
      : null);
  const resumeHref =
    practical.current?.status === 'active'
      ? practicalHref(practical.current, chapter.attempt.engine)
      : physical.facts.active
        ? courseHref('architecture', 'assessment')
        : serverless.facts.active
          ? courseHref('computing', 'serverless-assessment')
          : v2.facts.active
            ? courseHref('computing', 'v2-assessment')
            : benefits.facts.active
              ? courseHref('benefits', 'assessment')
              : service2.facts.active
                ? courseHref('services', 'assessment')
                : services.facts.active
                  ? '/portal?area=challenge&course=1&module=services&topic=practice'
                  : learning.facts.active && v2.save.choice !== 'v2'
                    ? courseHref('computing', 'assessment')
                    : preferredResume
                      ? (preferredResume.module === 'services' &&
                          preferredResume.topic === 'practice') ||
                        (preferredResume.module === 'computing' &&
                          preferredResume.topic === 'resource-bridge')
                        ? courseLabHref(lab.complete, course.save.lab?.origin)
                        : courseHref(preferredResume.module, preferredResume.topic)
                      : computingEntry;
  const navigate = (area: PortalLocation['area'], change: Partial<PortalLocation> = {}) => {
    if (area === 'learn')
      router.push(courseHref(change.module ?? module ?? 'services', change.topic ?? topic));
    else
      router.push(
        portalHref(parseLocation(new URLSearchParams()), area, {
          module:
            module === 'benefits' || module === 'architecture'
              ? 'services'
              : (module ?? 'services'),
          topic,
          course: true,
          ...change,
        }),
      );
  };
  const pathTopics: readonly string[] =
    module === 'architecture'
      ? physicalTopics
      : module === 'benefits'
        ? [...trackUnits.benefits, 'summary']
        : module === 'computing'
          ? currentV2
            ? [...v2Topics.slice(0, -1), ...serverlessTopics, v2Topics.at(-1)!]
            : unitIds
          : legacyServices
            ? topics
            : [...trackUnits.services, 'summary'];
  const index = pathTopics.indexOf(topic);
  const location = parseLocation(
    new URLSearchParams({ area: 'learn', module: module ?? 'services', topic }),
  );
  const title = (m: CourseModule, t: string) =>
    m === 'architecture'
      ? architectureNb.topics[t as PhysicalTopic]
      : m === 'benefits'
        ? (manuscript('benefits', t)?.title ??
          (t === 'summary' ? nb.expansion.common.summary : nb.expansion.common.assessment))
        : m === 'services'
          ? legacyServices
            ? nb.portal.lesson.sections[t as (typeof topics)[number]]?.title
            : (manuscript('services', t)?.title ??
              (t === 'summary' ? nb.expansion.common.summary : nb.expansion.common.assessment))
          : (serverlessNb.topics[t as keyof typeof serverlessNb.topics] ??
            nb.foundationsV2.topics[t as (typeof v2Topics)[number]]?.title ??
            nb.foundations.units[t as (typeof unitIds)[number]]?.title);
  const begin = () => {
    if (services.facts.active) services.store.event({ kind: 'aid' });
    if (learning.facts.active) learning.store.event({ kind: 'aid' });
    const session =
      course.save.lab && lab.verifiable
        ? course.save.lab
        : startLab(chapter.attempt.engine, chapter.attemptNumber);
    if (
      course.store.update({
        ...course.save,
        lab: {
          ...session,
          origin:
            module === 'computing'
              ? 'computing-v2'
              : legacyServices
                ? 'services-v1'
                : 'services-v2',
        },
      })
    )
      router.push('/portal?lab=web-platform&mode=guided&module=services&topic=practice');
  };
  return (
    <div
      className={`portal course-shell ${module === 'architecture' || currentV2 || module === 'benefits' || (module === 'services' && !legacyServices) ? 'course-v2' : ''}`}
    >
      <ExpansionAssistance />
      <PracticalAssistance />
      <a className="portal-skip" href="#course-main">
        {nb.shell.skip}
      </a>
      <header className="course-header">
        <Link className="course-brand" href="/learn">
          <BookOpen size={23} />
          {c.brand}
          <small>{c.version}</small>
        </Link>
        <nav aria-label={c.home}>
          <Link href="/learn">{c.home}</Link>
          <Link href="/portal">
            <FlaskConical size={16} />
            {c.sandbox}
          </Link>
        </nav>
        <button
          type="button"
          onClick={() => {
            if (services.facts.active) services.store.event({ kind: 'aid' });
            if (practical.activeIndependent) practical.store.event({ type: 'aid' });
            setJournal(true);
          }}
        >
          {c.journal}
        </button>
      </header>
      <div className="course-layout">
        <aside className={`course-navigation ${menu ? 'course-menu-open' : ''}`}>
          <button
            className="course-menu-toggle"
            type="button"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Menu size={18} />
            {c.learning}
          </button>
          <div className="course-navigation-content">
            <small>{c.track}</small>
            <strong>{nb.official.certification}</strong>
            <p>{nb.official.exam}</p>
            <Link href="/learn">{c.overview}</Link>
            <h2>{nb.official.path}</h2>
            <ol>
              {officialLearning.modules.map((m, i) => (
                <li key={m.id}>
                  <span className="course-order">{i + 1}</span>
                  <div>
                    {m.status === 'implemented' ? (
                      <Link
                        aria-current={module === m.id ? 'page' : undefined}
                        href={
                          m.id === 'computing'
                            ? computingEntry
                            : courseHref(m.id, m.id === 'benefits' ? 'availability' : 'overview')
                        }
                        onClick={() => setMenu(false)}
                      >
                        {names[m.id]}
                      </Link>
                    ) : (
                      <>
                        <span>{names[m.id]}</span>
                        <small>{c.planned}</small>
                      </>
                    )}
                    {module === m.id && (
                      <ol className="course-units">
                        {pathTopics.map((t) => (
                          <li key={t}>
                            <Link
                              aria-current={topic === t ? 'step' : undefined}
                              href={module === 'services' ? serviceHref(t) : courseHref(module, t)}
                              onClick={() => setMenu(false)}
                            >
                              {title(module, t)}
                              {module === 'computing' &&
                                (currentV2
                                  ? v2.facts.guided(t as (typeof v2Topics)[number])
                                  : learning.facts.observations[t as (typeof unitIds)[number]]
                                      ?.guided) && (
                                  <Check
                                    size={14}
                                    aria-label={
                                      currentV2 ? nb.foundationsV2.practiced : c.satisfied
                                    }
                                  />
                                )}
                            </Link>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <PhysicalCourseEntry
              navigation
              active={module === 'architecture'}
              topic={topic}
              onNavigate={() => setMenu(false)}
            />
            <p className="course-navigation-note">{c.participation}</p>
          </div>
        </aside>
        <main id="course-main" className="course-main">
          {course.issue && (
            <div role="status" className="course-storage">
              <p>
                {c.storeIssue} ({course.issue})
              </p>
              <button type="button" onClick={course.store.load}>
                {c.reload}
              </button>
              {course.issue !== 'unsaved' && (
                <button type="button" onClick={course.store.clear}>
                  {c.clear}
                </button>
              )}
            </div>
          )}
          {v2.issue && (
            <div className="course-storage" role="status">
              <p>
                {nb.foundationsV2.storage} ({v2.issue})
              </p>
              <button type="button" onClick={v2.store.load}>
                {c.reload}
              </button>
              <button type="button" onClick={v2.store.clear}>
                {nb.foundationsV2.reset}
              </button>
            </div>
          )}
          {!module ? (
            <>
              <div className="course-intro">
                <small>{c.eyebrow}</small>
                <h1>{c.title}</h1>
                <p>{c.intro}</p>
                <div className="course-track">
                  <strong>{nb.official.certification}</strong>
                  <span>{nb.official.exam}</span>
                </div>
                <Link className="course-primary" href={resumeHref}>
                  {services.facts.active || learning.facts.active || v2.facts.active
                    ? nb.portal.continueChallenge
                    : preferredResume
                      ? c.resume
                      : c.begin}
                  <ArrowRight size={18} />
                </Link>
              </div>
              <section className="course-lab-discovery" aria-label={labsNb.discover}>
                <strong>{labsNb.discover}</strong>
                <p>{labsNb.discoverNote}</p>
                <nav>
                  {(['iaas', 'paas', 'saas'] as const).map((topic) => (
                    <Link
                      key={topic}
                      href={`/learn/services?topic=${topic}&activity=practical&version=2`}
                      onClick={() => service2.store.event({ kind: 'choose', version: 'v2' })}
                    >
                      {labsNb.models[topic]} · {labsNb.title}
                    </Link>
                  ))}
                </nav>
              </section>
              <section className="course-syllabus">
                <small>{c.path}</small>
                <h2>{nb.official.path}</h2>
                <p>{c.sequenceNote}</p>
                <ol>
                  {officialLearning.modules.map((m, i) => (
                    <li key={m.id} className={m.status === 'planned' ? 'syllabus-planned' : ''}>
                      <span className="syllabus-number">0{i + 1}</span>
                      <div>
                        <small>{m.status === 'planned' ? c.planned : c.available}</small>
                        <h3>{names[m.id]}</h3>
                        <p>{c[m.id]}</p>
                        {m.id === 'computing' && (
                          <>
                            <p>
                              {c.computingProgress}:{' '}
                              {v2Topics.filter((id) => v2.facts.guided(id)).length} / 11 ·{' '}
                              {nb.foundationsV2.badge}
                            </p>
                            <p>
                              <Link href={courseHref('computing', 'serverless-concept')}>
                                {serverlessNb.title}
                              </Link>{' '}
                              ·{' '}
                              {serverless.facts.guided
                                ? serverlessNb.practiceDone
                                : serverlessNb.no}
                            </p>
                            {hasV1 && (
                              <p>
                                {nb.foundationsV2.legacy} · {c.computingProgress}:{' '}
                                {
                                  unitIds.filter((id) => learning.facts.observations[id].guided)
                                    .length
                                }{' '}
                                / 6
                              </p>
                            )}
                          </>
                        )}
                        {m.id === 'services' && (
                          <p>
                            {nb.expansion.common.practiced}:{' '}
                            {
                              trackUnits.services.filter(
                                (unit) => unit !== 'practice' && service2.facts.guided(unit),
                              ).length
                            }{' '}
                            / 5 ·{' '}
                            {lab.complete
                              ? c.satisfied
                              : course.save.lab
                                ? c.unfinished
                                : c.available}
                          </p>
                        )}
                        {m.id === 'benefits' && (
                          <p>
                            {nb.expansion.common.practiced}:{' '}
                            {
                              trackUnits.benefits.filter((unit) => benefits.facts.guided(unit))
                                .length
                            }{' '}
                            / 5 · {nb.expansion.common.noNewEvidence}
                          </p>
                        )}
                      </div>
                      {m.status === 'implemented' && (
                        <Link
                          href={
                            m.id === 'computing'
                              ? computingEntry
                              : courseHref(m.id, m.id === 'benefits' ? 'availability' : 'overview')
                          }
                          aria-label={`${c.open}: ${names[m.id]}`}
                        >
                          <ArrowRight size={24} />
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
              <PhysicalCourseEntry />
              <section className="course-future">
                <h2>{c.broader}</h2>
                <p>{c.broaderText}</p>
                <p>{c.participation}</p>
              </section>
            </>
          ) : practical.activeIndependent && practical.current && !practical.current.aided ? (
            <section className="practical-entry">
              <small>{labsNb.independent}</small>
              <h1>{labsNb.lab[practical.current.kind].title}</h1>
              <p>{labsNb.lab[practical.current.kind].changed}</p>
              <Link
                className="course-primary"
                href={practicalHref(practical.current, chapter.attempt.engine)}
              >
                {labsNb.resume}
              </Link>
              <PracticalOutcome />
            </section>
          ) : (
            <>
              <div className="course-breadcrumb">
                <Link href="/learn">{c.overview}</Link>
                <ChevronRight size={14} />
                <span>{names[module]}</span>
              </div>
              <header className="course-module-header">
                <small>
                  {c.module}{' '}
                  {module === 'architecture'
                    ? '04'
                    : module === 'computing'
                      ? '01'
                      : module === 'benefits'
                        ? '02'
                        : '03'}{' '}
                  · {module === 'architecture' ? architectureNb.available : c.available}
                </small>
                <h1>{names[module]}</h1>
                <p>
                  {module === 'architecture'
                    ? architectureNb.intro
                    : module === 'benefits'
                      ? nb.expansion.benefits.intro
                      : module === 'services'
                        ? c.services
                        : currentV2
                          ? nb.foundationsV2.intro
                          : c.computing}
                </p>
              </header>
              {services.facts.active && (
                <p className="course-assessment-warning">
                  {c.activeAssessment}{' '}
                  <button
                    type="button"
                    onClick={() => navigate('challenge', { mode: 'independent', lab: undefined })}
                  >
                    {nb.portal.continueChallenge}
                  </button>
                </p>
              )}
              <div ref={activityRef} className="course-activity">
                {chooseVersion ? (
                  <section className="course-version-choice">
                    <h2>{nb.foundationsV2.chooseTitle}</h2>
                    <p>{nb.foundationsV2.chooseText}</p>
                    {learning.facts.active && <p>{nb.foundationsV2.activeWarning}</p>}
                    <button
                      type="button"
                      onClick={() => {
                        v2.store.choose('v1');
                        router.push(
                          courseHref(
                            'computing',
                            learning.facts.active ? 'assessment' : learning.save.unit,
                          ),
                        );
                      }}
                    >
                      {nb.foundationsV2.keepV1}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (learning.facts.active) learning.store.event({ kind: 'aid' });
                        v2.store.choose('v2');
                        router.push(courseHref('computing', 'intro-request'));
                      }}
                    >
                      {nb.foundationsV2.startV2}
                    </button>
                  </section>
                ) : module === 'architecture' ? (
                  <PhysicalLesson
                    key={topic}
                    topic={topic as PhysicalTopic}
                    guidanceBlocked={
                      [
                        learning,
                        v2,
                        services,
                        benefits,
                        service2,
                        practical,
                        chapter,
                        course,
                        serverless,
                        physical,
                      ].some((x) => !x.ready || !!x.issue) ||
                      learning.facts.active ||
                      v2.facts.active ||
                      services.facts.active ||
                      benefits.facts.active ||
                      service2.facts.active ||
                      serverless.facts.active ||
                      practical.activeIndependent
                    }
                  />
                ) : module === 'benefits' ? (
                  <ExpandedModule key={topic} track="benefits" topic={topic} />
                ) : module === 'computing' && isServerlessTopic(topic) ? (
                  <ServerlessLesson
                    key={topic}
                    topic={topic}
                    guidanceBlocked={
                      [
                        learning,
                        v2,
                        services,
                        benefits,
                        service2,
                        practical,
                        chapter,
                        course,
                        serverless,
                        physical,
                      ].some((x) => !x.ready || !!x.issue) ||
                      learning.facts.active ||
                      v2.facts.active ||
                      services.facts.active ||
                      benefits.facts.active ||
                      service2.facts.active ||
                      practical.activeIndependent ||
                      physical.facts.active
                    }
                  />
                ) : module === 'computing' && currentV2 ? (
                  <FoundationsV2 key={topic} topic={topic} />
                ) : module === 'services' ? (
                  serviceChoice ? (
                    <section className="course-version-choice">
                      <h2>{nb.expansion.common.choiceTitle}</h2>
                      <p>{nb.expansion.common.choiceText}</p>
                      <button
                        onClick={() => {
                          service2.store.event({ kind: 'choose', version: 'v1' });
                          router.push(`${courseHref('services', 'overview')}&version=1`);
                        }}
                      >
                        {nb.expansion.common.keepLegacy}
                      </button>
                      <button
                        onClick={() => service2.store.event({ kind: 'choose', version: 'v2' })}
                      >
                        {nb.expansion.common.startCurrent}
                      </button>
                    </section>
                  ) : (
                    <>
                      {legacyServices ? (
                        <section className="course-legacy-note">
                          <strong>{nb.expansion.common.legacy}</strong>
                          <p>{nb.expansion.common.legacyWarning}</p>
                          <button
                            onClick={() => {
                              service2.store.event({ kind: 'choose', version: 'v2' });
                              router.push(courseHref('services', 'overview'));
                            }}
                          >
                            {nb.expansion.common.viewCurrent}
                          </button>
                        </section>
                      ) : (
                        <Link href={`${courseHref('services', 'overview')}&version=1`}>
                          {nb.expansion.common.viewLegacy}
                        </Link>
                      )}
                      {['assessment', 'summary'].includes(topic) ? (
                        <ExpandedModule
                          key={topic}
                          track="services"
                          topic={topic}
                          technicalReady={lab.complete}
                        />
                      ) : (
                        <ServicesWorkspace
                          key={topic}
                          location={location}
                          navigate={navigate}
                          course
                          operational={!legacyServices}
                          extension={
                            !legacyServices ? (
                              <ExpandedModule
                                track="services"
                                topic={topic}
                                embedded
                                technicalReady={lab.complete}
                              />
                            ) : undefined
                          }
                        />
                      )}
                    </>
                  )
                ) : (
                  <>
                    <section className="course-legacy-note">
                      <strong>{nb.foundationsV2.legacy}</strong>
                      <p>{nb.foundationsV2.legacyNote}</p>
                      {learning.facts.active && <p>{nb.foundationsV2.activeWarning}</p>}
                      <button
                        onClick={() => {
                          v2.store.choose('v2');
                          router.push(courseHref('computing', 'intro-request'));
                        }}
                      >
                        {nb.foundationsV2.switchV2}
                      </button>
                    </section>
                    <FoundationsWorkspace location={location} navigate={navigate} />
                  </>
                )}
              </div>
              {labTopic && !chooseVersion && !serviceChoice && (
                <section
                  className="course-lab"
                  id="practical-lab"
                  ref={labRef}
                  tabIndex={-1}
                  aria-labelledby="course-lab-title"
                >
                  <span>{c.guided}</span>
                  <h2 id="course-lab-title">{c.labTitle}</h2>
                  <p>{c.labIntro}</p>
                  <p>{c.labBridge}</p>
                  <SavvyShark>
                    <p>{c.labExpect}</p>
                  </SavvyShark>
                  {!course.save.lab && existing.group && (
                    <div>
                      <p>{nb.expansion.common.existingLabNote}</p>
                      <button
                        onClick={() =>
                          course.store.update({
                            ...course.save,
                            lab: {
                              ...existingSession,
                              origin:
                                module === 'computing'
                                  ? 'computing-v2'
                                  : legacyServices
                                    ? 'services-v1'
                                    : 'services-v2',
                            },
                          })
                        }
                      >
                        {nb.expansion.common.existingLab}
                      </button>
                    </div>
                  )}
                  {course.save.lab && (
                    <p role="status">
                      {lab.complete
                        ? c.satisfied
                        : !lab.verifiable
                          ? c.guidance.unverifiable[1]
                          : c.unfinished}
                    </p>
                  )}
                  {lab.complete ? (
                    <section
                      className="course-debrief"
                      id="lab-debrief"
                      ref={debriefRef}
                      tabIndex={-1}
                      aria-label={c.debrief}
                    >
                      <h3>{c.debrief}</h3>
                      <p>{c.debriefText}</p>
                      <dl className="portal-properties">
                        <div>
                          <dt>{nb.portal.group}</dt>
                          <dd>{lab.group?.name}</dd>
                        </div>
                        <div>
                          <dt>{nb.portal.plan}</dt>
                          <dd>{lab.plan?.name}</dd>
                        </div>
                        <div>
                          <dt>{nb.portal.areas.apps}</dt>
                          <dd>{lab.app?.name}</dd>
                        </div>
                      </dl>
                      <Reflection />
                      <p>{c.notMastery}</p>
                      <button
                        type="button"
                        onClick={() =>
                          navigate('challenge', { mode: 'independent', lab: undefined })
                        }
                      >
                        {c.startIndependent}
                      </button>
                    </section>
                  ) : null}
                  <button
                    type="button"
                    className={lab.complete ? undefined : 'primary'}
                    data-course-ready={course.ready}
                    data-world-ready={chapter.ready}
                    data-course-issue={course.issue ?? ''}
                    disabled={
                      !course.ready ||
                      !chapter.ready ||
                      ['corrupt', 'unsupported', 'conflict'].includes(course.issue ?? '') ||
                      services.facts.active ||
                      benefits.facts.active ||
                      service2.facts.active
                    }
                    onClick={() =>
                      module === 'services' && !course.save.lab ? setBriefing(true) : begin()
                    }
                  >
                    {lab.complete
                      ? nb.refinement.revisitLab
                      : course.save.lab && lab.verifiable
                        ? c.resumeLab
                        : c.startLab}
                  </button>
                </section>
              )}
              {briefing && (
                <MissionBriefing
                  kind="paas"
                  onClose={() => setBriefing(false)}
                  onStart={() => {
                    setBriefing(false);
                    begin();
                  }}
                />
              )}
              {module === 'services' && topic !== 'practice' && (
                <details className="course-guide-note">
                  <summary>
                    {c.assistant} · {c.assistantRole}
                  </summary>
                  <SavvyShark compact>
                    <p>{c.theoryGuide}</p>
                  </SavvyShark>
                </details>
              )}
              {module === 'services' && topic === 'practice' && (
                <details>
                  <summary>{nb.portal.areas.hierarchy}</summary>
                  <ArchitectureExplorer
                    world={chapter.attempt.engine.world}
                    lens="hierarchy"
                    navigate={navigate}
                  />
                </details>
              )}
              {module === 'computing' && currentV2 && hasV1 && !chooseVersion && (
                <Link
                  href={courseHref(
                    'computing',
                    learning.facts.active ? 'assessment' : learning.save.unit,
                  )}
                >
                  {nb.foundationsV2.viewV1}
                </Link>
              )}
              {!chooseVersion && !serviceChoice && (
                <>
                  {((currentV2 && index === pathTopics.length - 1) ||
                    (module === 'benefits' && topic === 'summary')) && (
                    <SavvyShark compact>
                      <p>
                        {currentV2
                          ? nb.expansion.common.nextBenefits
                          : nb.expansion.common.nextServices}
                      </p>
                    </SavvyShark>
                  )}
                  <CourseNavigation
                    moduleName={names[module]}
                    current={
                      title(module, topic) ??
                      (topic.includes('summary')
                        ? nb.foundationsV2.summary
                        : nb.foundationsV2.assessment)
                    }
                    index={index}
                    count={pathTopics.length}
                    previous={
                      index > 0
                        ? {
                            href:
                              module === 'services'
                                ? serviceHref(pathTopics[index - 1]!)
                                : courseHref(module, pathTopics[index - 1]!),
                            title: title(module, pathTopics[index - 1]!)!,
                          }
                        : index < 0
                          ? {
                              href: courseHref(module, pathTopics.at(-1)!),
                              title: title(module, pathTopics.at(-1)!)!,
                            }
                          : module === 'architecture'
                            ? { href: courseHref('services', 'summary'), title: names.services }
                            : undefined
                    }
                    next={
                      index >= 0 && index < pathTopics.length - 1
                        ? {
                            href:
                              module === 'services'
                                ? serviceHref(pathTopics[index + 1]!)
                                : courseHref(module, pathTopics[index + 1]!),
                            title: title(module, pathTopics[index + 1]!)!,
                          }
                        : index === pathTopics.length - 1
                          ? {
                              href: currentV2
                                ? courseHref('benefits', 'availability')
                                : module === 'benefits'
                                  ? courseHref('services', 'overview')
                                  : module === 'services' && !legacyServices
                                    ? courseHref('architecture', 'datacenters')
                                    : '/learn',
                              title: currentV2
                                ? names.benefits
                                : module === 'benefits'
                                  ? names.services
                                  : module === 'services' && !legacyServices
                                    ? names.architecture
                                    : c.overview,
                            }
                          : undefined
                    }
                    continueTeaching={labTopic && lab.complete}
                    summary={topic.includes('summary')}
                  />
                </>
              )}
            </>
          )}
          <footer className="course-footer">{nb.portal.boundary}</footer>
        </main>
      </div>
      {journal && (
        <PortalDialog title={c.journal} onClose={() => setJournal(false)}>
          {module === 'architecture' || (!module && preferredResume?.module === 'architecture') ? (
            <PhysicalLesson topic="datacenters" journal />
          ) : module === 'benefits' ? (
            <ExpansionReference track="benefits" topic={topic} />
          ) : module === 'services' && !legacyServices ? (
            <ExpansionReference track="services" topic={topic} />
          ) : isServerlessTopic(topic) ? (
            <ServerlessLesson topic={topic} journal />
          ) : currentV2 ? (
            <FoundationsV2
              topic={['v2-assessment', 'v2-summary'].includes(topic) ? 'intro-request' : topic}
              journal
            />
          ) : module === 'computing' || (!module && preferredResume?.module === 'computing') ? (
            <FoundationsReference topic={topic} />
          ) : (
            <ServiceReference topic={topic} />
          )}
        </PortalDialog>
      )}
    </div>
  );
}
function Reflection() {
  const { save, store } = useCourse();
  const [answer, setAnswer] = useState('');
  const choice = save.lab?.reflection;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (save.lab && (answer === 'data' || answer === 'provider'))
          store.update({ ...save, lab: { ...save.lab, reflection: answer } });
      }}
    >
      <fieldset>
        <legend>{c.reflection}</legend>
        <label>
          <input
            type="radio"
            name="reflection"
            required
            checked={answer === 'data'}
            onChange={() => setAnswer('data')}
          />
          <span>{c.reflectionData}</span>
        </label>
        <label>
          <input
            type="radio"
            name="reflection"
            checked={answer === 'provider'}
            onChange={() => setAnswer('provider')}
          />
          <span>{c.reflectionProvider}</span>
        </label>
        <button type="submit">{c.checkReflection}</button>
      </fieldset>
      {choice && <p role="status">{choice === 'data' ? c.reflectionCorrect : c.reflectionWrong}</p>}
    </form>
  );
}
