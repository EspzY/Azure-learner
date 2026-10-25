'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, ArrowRight, ChevronRight, FlaskConical, Check, Menu } from 'lucide-react';
import { nb } from '@/content/nb';
import { officialLearning } from '@/domain/curriculum/official';
import { unitIds } from '@/domain/curriculum/manifest';
import { cases, evaluateCase } from '@/domain/portal/learning';
import { topics, portalHref, parseLocation, type PortalLocation } from '@/domain/portal/model';
import {
  courseHref,
  courseLabHref,
  courseTopic,
  labFacts,
  startLab,
  type CourseModule,
} from '@/domain/course/model';
import { useChapter } from '@/features/chapter01/provider';
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
import { useCourse } from './provider';
import { CourseNavigation } from './course-navigation';
import { FoundationsV2 } from '@/features/learning/foundations-v2';
import { useFoundationsV2 } from '@/features/learning/v2-provider';
import { isV2Topic, v2Topics } from '@/domain/curriculum/foundations-v2';
import '@/features/portal/portal.css';
import './course.css';
const c = nb.course;
const names = {
  computing: nb.official.computing,
  services: nb.official.services,
  benefits: nb.official.benefits,
};
export function Course({ module }: { module?: CourseModule }) {
  const query = useSearchParams(),
    router = useRouter(),
    course = useCourse(),
    learning = useLearning(),
    services = usePortalLearning(),
    chapter = useChapter(),
    v2 = useFoundationsV2();
  const topic = module ? courseTopic(module, query.get('topic')) : 'overview';
  const currentV2 = module === 'computing' && isV2Topic(topic);
  const hasV1 = learning.save.events.length > 0;
  const chooseVersion = currentV2 && hasV1 && v2.save.choice === null;
  const computingEntry =
    hasV1 && v2.save.choice === 'v1'
      ? courseHref('computing', learning.facts.active ? 'assessment' : learning.save.unit)
      : courseHref('computing', 'intro-request');
  const labTopic =
    (module === 'services' && topic === 'practice') ||
    (module === 'computing' && topic === 'resource-bridge');
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
      ['lab', 'debrief'].includes(query.get('activity') ?? '')
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
  const lab = labFacts(course.save.lab, chapter.attempt.engine, chapter.attemptNumber);
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
  const resumeHref = v2.facts.active
    ? courseHref('computing', 'v2-assessment')
    : services.facts.active
      ? '/portal?area=challenge&course=1&module=services&topic=practice'
      : learning.facts.active && v2.save.choice !== 'v2'
        ? courseHref('computing', 'assessment')
        : preferredResume
          ? (preferredResume.module === 'services' && preferredResume.topic === 'practice') ||
            (preferredResume.module === 'computing' && preferredResume.topic === 'resource-bridge')
            ? courseLabHref(lab.complete, course.save.lab?.origin)
            : courseHref(preferredResume.module, preferredResume.topic)
          : computingEntry;
  const navigate = (area: PortalLocation['area'], change: Partial<PortalLocation> = {}) => {
    if (area === 'learn')
      router.push(courseHref(change.module ?? module ?? 'services', change.topic ?? topic));
    else
      router.push(
        portalHref(parseLocation(new URLSearchParams()), area, {
          module: module ?? 'services',
          topic,
          course: true,
          ...change,
        }),
      );
  };
  const pathTopics: readonly string[] =
    module === 'computing' ? (currentV2 ? v2Topics : unitIds) : topics;
  const index = pathTopics.indexOf(topic);
  const location = parseLocation(
    new URLSearchParams({ area: 'learn', module: module ?? 'services', topic }),
  );
  const title = (m: CourseModule, t: string) =>
    m === 'services'
      ? nb.portal.lesson.sections[t as (typeof topics)[number]]?.title
      : (nb.foundationsV2.topics[t as (typeof v2Topics)[number]]?.title ??
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
        lab: { ...session, ...(module === 'computing' ? { origin: 'computing-v2' as const } : {}) },
      })
    )
      router.push('/portal?lab=web-platform&mode=guided&module=services&topic=practice');
  };
  return (
    <div className={`portal course-shell ${currentV2 ? 'course-v2' : ''}`}>
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
                          m.id === 'computing' ? computingEntry : courseHref('services', 'overview')
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
                              href={courseHref(module, t)}
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
                            {c.serviceProgress}:{' '}
                            {
                              cases.filter((id) => {
                                const e = services.facts.guided[id];
                                return e && evaluateCase(id, e.model, e.reason);
                              }).length
                            }{' '}
                            / 3 ·{' '}
                            {lab.complete
                              ? c.satisfied
                              : course.save.lab
                                ? c.unfinished
                                : c.available}
                          </p>
                        )}
                      </div>
                      {m.status === 'implemented' && (
                        <Link
                          href={
                            m.id === 'computing'
                              ? computingEntry
                              : courseHref('services', 'overview')
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
              <section className="course-future">
                <h2>{c.broader}</h2>
                <p>{c.broaderText}</p>
                <p>{c.participation}</p>
              </section>
            </>
          ) : (
            <>
              <div className="course-breadcrumb">
                <Link href="/learn">{c.overview}</Link>
                <ChevronRight size={14} />
                <span>{names[module]}</span>
              </div>
              <header className="course-module-header">
                <small>
                  {c.module} {module === 'computing' ? '01' : '03'} · {c.available}
                </small>
                <h1>{names[module]}</h1>
                <p>
                  {module === 'services'
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
                ) : module === 'computing' && currentV2 ? (
                  <FoundationsV2 key={topic} topic={topic} />
                ) : module === 'services' ? (
                  <ServicesWorkspace location={location} navigate={navigate} course />
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
              {labTopic && !chooseVersion && (
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
                      services.facts.active
                    }
                    onClick={begin}
                  >
                    {lab.complete
                      ? nb.refinement.revisitLab
                      : course.save.lab && lab.verifiable
                        ? c.resumeLab
                        : c.startLab}
                  </button>
                </section>
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
              {!chooseVersion && (
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
                          href: courseHref(module, pathTopics[index - 1]!),
                          title: title(module, pathTopics[index - 1]!)!,
                        }
                      : index < 0
                        ? {
                            href: courseHref(module, pathTopics.at(-1)!),
                            title: title(module, pathTopics.at(-1)!)!,
                          }
                        : undefined
                  }
                  next={
                    index >= 0 && index < pathTopics.length - 1
                      ? {
                          href: courseHref(module, pathTopics[index + 1]!),
                          title: title(module, pathTopics[index + 1]!)!,
                        }
                      : index === pathTopics.length - 1
                        ? {
                            href: currentV2 ? courseHref(module, 'v2-summary') : '/learn',
                            title: currentV2 ? nb.foundationsV2.summary : c.overview,
                          }
                        : undefined
                  }
                  continueTeaching={labTopic && lab.complete}
                  summary={topic.includes('summary')}
                />
              )}
            </>
          )}
          <footer className="course-footer">{nb.portal.boundary}</footer>
        </main>
      </div>
      {journal && (
        <PortalDialog title={c.journal} onClose={() => setJournal(false)}>
          {currentV2 ? (
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
