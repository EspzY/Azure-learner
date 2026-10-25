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
import { FoundationsReviewEntry } from './foundations-review';
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
    chapter = useChapter();
  const topic = module ? courseTopic(module, query.get('topic')) : 'overview';
  const [journal, setJournal] = useState(false),
    [menu, setMenu] = useState(false);
  const labRef = useRef<HTMLElement>(null),
    debriefRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (module && course.ready)
      course.store.update({ ...course.store.getSnapshot().save, resume: { module, topic } });
  }, [module, topic, course.ready, course.store]);
  useEffect(() => {
    if (!module && !journal) return;
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
    services.facts.active,
    services.store,
    learning.facts.active,
    learning.store,
  ]);
  const lab = labFacts(course.save.lab, chapter.attempt.engine, chapter.attemptNumber);
  useEffect(() => {
    if (!course.ready || !chapter.ready || module !== 'services' || topic !== 'practice') return;
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
  }, [course.ready, chapter.ready, module, topic, lab.complete, query]);
  const preferredResume =
    course.save.resume ??
    (learning.save.events.length
      ? { module: 'computing' as const, topic: learning.save.unit }
      : null);
  const resumeHref = services.facts.active
    ? '/portal?area=challenge&course=1&module=services&topic=practice'
    : learning.facts.active
      ? courseHref('computing', 'assessment')
      : preferredResume
        ? preferredResume.module === 'services' && preferredResume.topic === 'practice'
          ? courseLabHref(lab.complete)
          : courseHref(preferredResume.module, preferredResume.topic)
        : courseHref('computing', 'capacity');
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
  const pathTopics: readonly string[] = module === 'computing' ? unitIds : topics;
  const index = pathTopics.indexOf(topic);
  const location = parseLocation(
    new URLSearchParams({ area: 'learn', module: module ?? 'services', topic }),
  );
  const title = (m: CourseModule, t: string) =>
    m === 'services'
      ? nb.portal.lesson.sections[t as (typeof topics)[number]]?.title
      : nb.foundations.units[t as (typeof unitIds)[number]]?.title;
  const begin = () => {
    if (services.facts.active) services.store.event({ kind: 'aid' });
    if (learning.facts.active) learning.store.event({ kind: 'aid' });
    const session =
      course.save.lab && lab.verifiable
        ? course.save.lab
        : startLab(chapter.attempt.engine, chapter.attemptNumber);
    if (course.store.update({ ...course.save, lab: session }))
      router.push('/portal?lab=web-platform&mode=guided&module=services&topic=practice');
  };
  return (
    <div className="portal course-shell">
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
                        href={courseHref(
                          m.id as CourseModule,
                          m.id === 'computing' ? 'capacity' : 'overview',
                        )}
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
                                learning.facts.observations[t as (typeof unitIds)[number]]
                                  ?.guided && <Check size={14} aria-label={c.satisfied} />}
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
          {!module ? (
            <>
              <div className="course-intro">
                <small>{c.eyebrow}</small>
                <h1>{c.title}</h1>
                <FoundationsReviewEntry />
                <p>{c.intro}</p>
                <div className="course-track">
                  <strong>{nb.official.certification}</strong>
                  <span>{nb.official.exam}</span>
                </div>
                <Link className="course-primary" href={resumeHref}>
                  {services.facts.active || learning.facts.active
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
                          <p>
                            {c.computingProgress}:{' '}
                            {unitIds.filter((id) => learning.facts.observations[id].guided).length}{' '}
                            / 6
                          </p>
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
                          href={courseHref(
                            m.id as CourseModule,
                            m.id === 'computing' ? 'capacity' : 'overview',
                          )}
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
                <p>{module === 'services' ? c.services : c.computing}</p>
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
              {module === 'services' ? (
                <ServicesWorkspace location={location} navigate={navigate} course />
              ) : (
                <FoundationsWorkspace location={location} navigate={navigate} />
              )}
              {module === 'services' && topic === 'practice' && (
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
                    className="primary"
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
                    {course.save.lab && lab.verifiable ? c.resumeLab : c.startLab}
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
              <nav className="course-step-navigation" aria-label={c.next}>
                {index > 0 && (
                  <Link href={courseHref(module, pathTopics[index - 1]!)}>
                    ← {c.previous}
                    <small>{title(module, pathTopics[index - 1]!)}</small>
                  </Link>
                )}
                {index >= 0 && index < pathTopics.length - 1 && (
                  <Link href={courseHref(module, pathTopics[index + 1]!)}>
                    {c.next} →<small>{title(module, pathTopics[index + 1]!)}</small>
                  </Link>
                )}
              </nav>
            </>
          )}
          <footer className="course-footer">{nb.portal.boundary}</footer>
        </main>
      </div>
      {journal && (
        <PortalDialog title={c.journal} onClose={() => setJournal(false)}>
          {module === 'computing' || (!module && preferredResume?.module === 'computing') ? (
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
