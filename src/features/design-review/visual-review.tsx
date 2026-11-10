'use client';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Braces,
  ChevronRight,
  ClipboardList,
  Compass,
  FlaskConical,
  Layers3,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { nb, computeNb as computeCopy, visualReviewNb as c } from '@/content/nb';
import { coursePaths, moduleLabels } from '@/features/course/course-outline';
import { courseHref, courseTopic } from '@/domain/course/model';
import { computeHref, computeGuidedFacts } from '@/domain/curriculum/compute';
import { computeVmFacts } from '@/domain/curriculum/compute-vm';
import {
  initialContainer,
  runContainer,
  type ContainerInput,
  type Outcome,
} from '@/domain/curriculum/compute-model';
import { inventory, portalHref, parseLocation } from '@/domain/portal/model';
import { useCompute } from '@/features/learning/compute-provider';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { useMissionSafetyContexts } from '@/features/course/mission-context';
import { ManagementTeachingBoundary } from '@/features/learning/management-access';
import { ComputeVmLesson } from '@/features/learning/compute-vm';
import { ComputeSources } from '@/features/learning/compute';
import { ComputeConceptFigure } from '@/features/learning/compute-visuals';
import { ApplicationHistory } from '@/features/learning/application-transfer';
import { RefinedHistory } from '@/features/learning/refined-assessment';
import { Portal } from '@/features/portal/portal';
import { PortalDialog } from '@/features/portal/shared';
import { ServiceIcon } from '@/features/portal/service-icon';
import { CharacterGallery, CharacterPortrait } from './character';
import {
  directions,
  surfaces,
  directionFrom,
  surfaceFrom,
  visualHref,
  visualPortalHref,
  type Direction,
  type Surface,
} from './model';
import '@/features/course/course.css';
import '@/features/learning/compute.css';
import '@/features/learning/serverless.css';
import './visual-review.css';

const icons = [
  Compass,
  Layers3,
  BookOpen,
  FlaskConical,
  ClipboardList,
  ArrowRight,
  Braces,
  BookOpen,
  Sparkles,
];
const demoSurfaces = surfaces.filter((s) => s !== 'character' && s !== 'workspace');

function ReviewBar({
  direction,
  surface,
  nativePortal,
}: {
  direction: Direction;
  surface: Surface;
  nativePortal: string;
}) {
  return (
    <div className="ve-review-bar" role="region" aria-label={c.review}>
      <span>
        <b>{c.review}</b>
        <span>{c.reviewNote}</span>
      </span>
      <nav aria-label={c.review}>
        {directions.map((d) => (
          <Link
            key={d}
            href={
              surface === 'workspace' ? visualPortalHref(nativePortal, d) : visualHref(d, surface)
            }
            scroll={false}
            aria-current={d === direction ? 'true' : undefined}
          >
            {c.directions[d]}
          </Link>
        ))}
      </nav>
      <Link href={surface === 'workspace' ? visualHref(direction, 'guide') : '/learn'}>
        {surface === 'workspace' ? c.backGuide : c.returnCourse}
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}
function Brand({ direction }: { direction: Direction }) {
  return (
    <Link className="ve-brand" href={visualHref(direction, 'hub')} scroll={false}>
      <span aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <path d="M5 25L16 5l11 20M9 19h14M5 28h22" />
        </svg>
      </span>
      <strong>{nb.brand}</strong>
      <small>{c.fundamentals}</small>
    </Link>
  );
}
function ViewLink({
  direction,
  surface,
  children,
  primary = false,
}: {
  direction: Direction;
  surface: Surface;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const href =
    surface === 'workspace'
      ? visualPortalHref('/portal?area=groups&compute=vm', direction)
      : visualHref(direction, surface);
  return (
    <Link
      className={primary ? 've-button ve-button-primary' : 've-button ve-button-quiet'}
      href={href}
      scroll={false}
    >
      {children}
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}

export function VisualReview() {
  const query = useSearchParams();
  const direction = directionFrom(query.get('direction')),
    surface = surfaceFrom(query.get('surface'));
  const [journal, setJournal] = useState(false),
    [nav, setNav] = useState(false);
  const positions = useRef(new Map<string, number>()),
    current = useRef(surface);
  const canonical = parseLocation(new URLSearchParams(query.toString()));
  const nativePortal = portalHref(canonical, canonical.area, canonical);
  useEffect(() => {
    const onPop = () => positions.current.set(current.current, window.scrollY);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    current.current = surface;
  }, [surface]);
  const savePosition = (e: React.MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest('a');
    if (anchor?.getAttribute('href')?.startsWith('/learn/design-review'))
      positions.current.set(surface, window.scrollY);
  };
  if (surface === 'workspace')
    return (
      <div
        className="visual-review visual-review-workspace"
        data-direction={direction}
        onClickCapture={savePosition}
      >
        <ReviewBar direction={direction} surface={surface} nativePortal={nativePortal} />
        <div className="ve-workspace-entry">
          <Portal
            navigation={{
              href: (href) => visualPortalHref(href, direction),
              courseReturn: visualHref(direction, 'guide'),
            }}
          />
        </div>
      </div>
    );
  return (
    <div className="visual-review" data-direction={direction} onClickCapture={savePosition}>
      <ReviewBar direction={direction} surface={surface} nativePortal={nativePortal} />
      <header className="ve-header">
        <a className="ve-skip" href="#ve-main">
          {nb.shell.skip}
        </a>

        <Brand direction={direction} />
        <span className="ve-brand-context">{c.brandSub}</span>
        <div>
          <span className="ve-environment">
            <span aria-hidden="true" /> {c.local}
          </span>
          <button className="ve-journal-trigger" onClick={() => setJournal(true)}>
            <BookOpen size={17} aria-hidden="true" />
            {nb.course.journal}
          </button>
          <button
            className="ve-menu-trigger"
            aria-expanded={nav}
            aria-controls="ve-review-nav"
            aria-label={c.navLabel}
            onClick={() => setNav(!nav)}
          >
            {nav ? <PanelLeftClose /> : <PanelLeftOpen />}
          </button>
        </div>
      </header>
      <div className="ve-layout">
        <aside
          aria-label={c.demoContext}
          className={'ve-sidebar ' + (nav ? 've-sidebar-open' : '')}
          id="ve-review-nav"
        >
          <span className="ve-eyebrow">{c.eyebrow}</span>
          <strong>{c.demoContext}</strong>
          <nav aria-label={c.navLabel}>
            {surfaces.map((s, i) => {
              const Icon = icons[i]!;
              return (
                <Link
                  key={s}
                  href={
                    s === 'workspace'
                      ? visualPortalHref('/portal?area=groups&compute=vm', direction)
                      : visualHref(direction, s)
                  }
                  scroll={false}
                  aria-current={surface === s ? 'page' : undefined}
                  onClick={() => setNav(false)}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{c.surfaceNames[s]}</span>
                  <small>{String(i + 1).padStart(2, '0')}</small>
                </Link>
              );
            })}
          </nav>
          <div className="ve-sidebar-note">
            <ShieldCheck size={18} aria-hidden="true" />
            <p>{c.viewOnly}</p>
            <Link href="/learn">
              {c.returnCourse}
              <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
        <main className="ve-main" id="ve-main" tabIndex={-1}>
          <ManagementTeachingBoundary identity={'visual-review:' + surface}>
            <div className="ve-page" key={surface}>
              <PageEntrance positions={positions} surface={surface} />
              <div className="ve-breadcrumb">
                <Link href={visualHref(direction, 'hub')} scroll={false}>
                  Azure Fundamentals
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span>{c.surfaceNames[surface]}</span>
              </div>
              {surface === 'hub' ? (
                <Hub direction={direction} />
              ) : surface === 'introduction' ? (
                <Introduction direction={direction} />
              ) : surface === 'theory' ? (
                <Theory direction={direction} />
              ) : surface === 'studio' ? (
                <Studio />
              ) : surface === 'guide' ? (
                <Guide direction={direction} />
              ) : surface === 'handoff' ? (
                <Handoff direction={direction} />
              ) : surface === 'journal' ? (
                <JournalLanding onOpen={() => setJournal(true)} />
              ) : (
                <CharacterGallery />
              )}
              {surface !== 'character' && (
                <ReviewNavigation direction={direction} surface={surface} />
              )}
              <footer className="ve-page-footer">
                <span>AzureLab</span>
                <p>{c.footer}</p>
              </footer>
            </div>
          </ManagementTeachingBoundary>
        </main>
      </div>
      {journal && (
        <ManagementTeachingBoundary identity="visual-review-journal">
          <PortalDialog title={nb.course.journal} onClose={() => setJournal(false)}>
            <JournalBody />
          </PortalDialog>
        </ManagementTeachingBoundary>
      )}
    </div>
  );
}

function PageEntrance({
  positions,
  surface,
}: {
  positions: React.RefObject<Map<string, number>>;
  surface: Surface;
}) {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: positions.current.get(surface) ?? 0, behavior: 'instant' });
      document.querySelector<HTMLElement>('[data-ve-heading]')?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [positions, surface]);
  return null;
}
function Hub({ direction }: { direction: Direction }) {
  return (
    <>
      <section className="ve-hero">
        <div className="ve-hero-copy">
          <span className="ve-eyebrow">
            {c.eyebrow} <span className="ve-eyebrow-rule" />
          </span>
          <h1 data-ve-heading tabIndex={-1}>
            {direction === 'continuity' ? c.aTitle : c.bTitle}
          </h1>
          <p className="ve-lead">{c.heroText}</p>
          <div className="ve-hero-action">
            <ViewLink direction={direction} surface="introduction" primary>
              {c.demo}
            </ViewLink>
            <small>{c.demoContext}</small>
          </div>
          <p className="ve-small-note">{c.contentNotMastery}</p>
        </div>
        <div className="ve-hero-visual">
          <div className="ve-hero-grid" aria-hidden="true" />
          <div className="ve-hero-notebook">
            <span className="ve-micro">{c.heroMicro}</span>
            <div className="ve-hero-art">
              <div className="ve-hero-plate">
                <ServiceIcon kind="vm" size={42} />
              </div>
              <span className="ve-hero-edge" />
              <div className="ve-hero-plate ve-hero-plate-small">
                <ServiceIcon kind="disk" size={28} />
                <ServiceIcon kind="nic" size={28} />
              </div>
            </div>
            <span className="ve-hero-caption">{computeCopy.sections.dependencies.title}</span>
            <span className="ve-hero-notebook-bottom">
              <span>01</span>
              <ArrowDown size={16} />
            </span>
          </div>
          <div className="ve-hero-character">
            <CharacterPortrait />
            <div>
              <strong>SavvyShark</strong>
              <small>{c.coachRole}</small>
            </div>
          </div>
        </div>
      </section>
      <section className="ve-catalog">
        <header className="ve-section-heading">
          <div>
            <span className="ve-eyebrow">{c.available}</span>
            <h2>{c.catalog}</h2>
          </div>
          <p>{c.catalogNote}</p>
        </header>
        <div className="ve-paths">
          {coursePaths.map((path) => (
            <article className="ve-path" key={path.id}>
              <header>
                <span className="ve-path-number">{path.number}</span>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
              </header>
              <div>
                {path.modules.map((group) => (
                  <section key={group.title} className="ve-module-group">
                    <h4>{group.title}</h4>
                    {group.parts.map((part) => (
                      <Link
                        key={part}
                        href={
                          part === 'compute'
                            ? visualHref(direction, 'introduction')
                            : courseHref(part, courseTopic(part, null))
                        }
                        scroll={part === 'compute' ? false : undefined}
                      >
                        <span>{moduleLabels[part]}</span>
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    ))}
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
function Introduction({ direction }: { direction: Direction }) {
  const s = computeCopy.sections.introduction;
  return (
    <>
      <section className="ve-module-hero">
        <div>
          <span className="ve-eyebrow">{c.moduleIntro}</span>
          <h1 data-ve-heading tabIndex={-1}>
            {computeCopy.title}
          </h1>
          <p className="ve-lead">{computeCopy.overview}</p>
          <ViewLink direction={direction} surface="theory" primary>
            {c.readTheory}
          </ViewLink>
        </div>
        <aside>
          <span>{c.chapter}</span>
          <ComputeConceptFigure topic="dependencies" />
          <p>{computeCopy.prerequisites}</p>
        </aside>
      </section>
      <section className="ve-intro-content">
        <div>
          <span className="ve-eyebrow">{c.chapter}</span>
          <h2>{s.title}</h2>
          {s.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="ve-truth-note">
            <strong>{computeCopy.labels.limits}</strong>
            <p>{s.limit}</p>
          </div>
        </div>
        <aside className="ve-activity-index">
          <h3>{c.demoContext}</h3>
          {(['theory', 'studio', 'guide', 'handoff', 'journal'] as const).map((view, i) => (
            <Link key={view} href={visualHref(direction, view)} scroll={false}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <strong>{c.surfaceNames[view]}</strong>
              <ArrowRight size={16} />
            </Link>
          ))}
          <p>{c.moduleNote}</p>
        </aside>
      </section>
    </>
  );
}
function Theory({ direction }: { direction: Direction }) {
  const s = computeCopy.sections.vm;
  return (
    <>
      <header className="ve-reading-heading">
        <span className="ve-eyebrow">{c.chapter} / 01</span>
        <h1 data-ve-heading tabIndex={-1}>
          {s.title}
        </h1>
        <p className="ve-lead">{c.readingNote}</p>
      </header>
      <div className="ve-reading-layout">
        <article className="ve-reading">
          {s.paragraphs.map((p, i) => (
            <p className={i === 0 ? 've-reading-opening' : undefined} key={p}>
              {p}
            </p>
          ))}
          <section className="ve-worked" id="ve-example">
            <span className="ve-eyebrow">{computeCopy.labels.example}</span>
            <h2>{computeCopy.missions.vm.title}</h2>
            <p>{s.example}</p>
          </section>
          <section className="ve-truth-note" id="ve-limits">
            <strong>{computeCopy.labels.limits}</strong>
            <p>{s.limit}</p>
          </section>
          <ComputeSources topic="vm" />
        </article>
        <aside className="ve-reading-aside">
          <div>
            <span className="ve-eyebrow">{c.onPage}</span>
            <a href="#ve-example">
              {computeCopy.labels.example}
              <ArrowDown size={14} />
            </a>
            <a href="#ve-limits">
              {computeCopy.labels.limits}
              <ArrowDown size={14} />
            </a>
          </div>
          <section>
            <ComputeConceptFigure topic="vm" />
            <h2>{computeCopy.labels.terms}</h2>
            <dl>
              {s.terms.map(([term, meaning]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{meaning}</dd>
                </div>
              ))}
            </dl>
          </section>
          <ViewLink direction={direction} surface="studio">
            {c.exploreStudio}
          </ViewLink>
        </aside>
      </div>
    </>
  );
}
function Studio() {
  const t = computeCopy.models.container;
  const [input, setInput] = useState<ContainerInput>(initialContainer),
    [last, setLast] = useState<ContainerInput | null>(null),
    [prediction, setPrediction] = useState<Outcome | null>(null);
  const change = (next: ContainerInput) => {
    setInput(next);
    setLast(null);
  };
  const result = last ? runContainer(last) : null;
  return (
    <>
      <header className="ve-studio-heading">
        <span className="ve-eyebrow">{c.studioEyebrow}</span>
        <h1 data-ve-heading tabIndex={-1}>
          {c.studioTitle}
        </h1>
        <p className="ve-lead">{c.studioLead}</p>
      </header>
      <div className="ve-studio">
        <section className="ve-studio-controls">
          <h2>{c.modelInput}</h2>
          <label>
            {t.storage}
            <select
              value={input.storage}
              onChange={(e) =>
                change({ ...input, storage: e.target.value as ContainerInput['storage'] })
              }
            >
              <option value="ephemeral">{t.storages[0]}</option>
              <option value="external">{t.storages[1]}</option>
            </select>
          </label>
          <label>
            {t.action}
            <select
              value={input.action}
              onChange={(e) =>
                change({ ...input, action: e.target.value as ContainerInput['action'] })
              }
            >
              <option value="inspect">{t.actions[0]}</option>
              <option value="recreate">{t.actions[1]}</option>
            </select>
          </label>
          <label className="ve-checkbox">
            <input
              type="checkbox"
              checked={input.runtime}
              onChange={(e) => change({ ...input, runtime: e.target.checked })}
            />
            {t.runtime}
          </label>
          <label className="ve-checkbox">
            <input
              type="checkbox"
              checked={input.image}
              onChange={(e) => change({ ...input, image: e.target.checked })}
            />
            {t.image}
          </label>
          <p className="ve-control-note">{t.note}</p>
        </section>
        <section className="ve-model-run">
          <div>
            <h2>{c.modelPrediction}</h2>
            <label>
              {computeCopy.labels.predict}
              <select
                value={prediction ?? ''}
                onChange={(e) =>
                  setPrediction(e.target.value === '' ? null : (Number(e.target.value) as Outcome))
                }
              >
                {t.predictions.map((x, i) => (
                  <option key={x} value={i === 0 ? '' : i - 1}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            className="ve-button ve-button-primary"
            disabled={prediction === null}
            onClick={() => setLast({ ...input })}
          >
            {c.modelRun}
            <ArrowRight size={17} />
          </button>
        </section>
        <section className="ve-studio-canvas">
          <h2>{c.modelFigure}</h2>
          <ContainerFigure input={last ?? input} executed={!!last} />
          <div className="ve-model-result" role="status">
            {result ? (
              <>
                <strong>{c.result}</strong>
                <p>{result.outcome === 0 ? t.noProcess : result.outcome === 1 ? t.lost : t.kept}</p>
              </>
            ) : (
              <p>{c.modelPending}</p>
            )}
          </div>
        </section>
      </div>
      <p className="ve-model-boundary">
        <ShieldCheck size={18} />
        {c.modelOnly}
      </p>
    </>
  );
}
function ContainerFigure({ input, executed }: { input: ContainerInput; executed: boolean }) {
  const id = useId(),
    t = computeCopy.models.container,
    r = executed ? runContainer(input) : null;
  const recreate = input.action === 'recreate';
  return (
    <figure className="ve-container-figure">
      <svg viewBox="0 0 660 390" role="img" aria-labelledby={id}>
        <title id={id}>{t.lifecycle}</title>
        <defs>
          <marker
            id={id + 'arrow'}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0 0L6 3L0 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </marker>
        </defs>
        <path
          className="ve-model-grid"
          d="M25 56H635M25 112H635M25 168H635M25 224H635M25 280H635M25 336H635M85 35V360M205 35V360M325 35V360M445 35V360M565 35V360"
        />
        <g className="ve-image-plate">
          <path d="M250 44L338 21L426 44L338 69Z" />
          <path d="M250 44V91L338 116L426 91V44L338 69V116" />
          <text x="338" y="83" textAnchor="middle">
            {t.pipeline[0]}
          </text>
        </g>
        <path className="ve-model-flow" d="M338 118V128" />
        <g className="ve-runtime-plate">
          <rect x="235" y="128" width="206" height="36" rx="7" />
          <text x="338" y="151" textAnchor="middle">
            {t.pipeline[1]} · {input.runtime ? t.yes : t.no}
          </text>
        </g>
        <path
          className="ve-model-flow"
          d={recreate ? 'M338 164V176H510V184' : 'M338 164V184'}
          markerEnd={'url(#' + id + 'arrow)'}
        />
        {recreate ? (
          <>
            <g className={'ve-instance ' + (executed ? 've-instance-prior' : '')}>
              <rect x="65" y="190" width="205" height="84" rx="10" />
              <text x="88" y="221">
                A
              </text>
              <text x="88" y="248">
                {t.reportProducer}
              </text>
            </g>
            <g className={'ve-instance ' + (r?.created ? 've-instance-current' : '')}>
              <rect x="405" y="190" width="205" height="84" rx="10" />
              <text x="428" y="221">
                B
              </text>
              <text x="428" y="248">
                {!executed ? '…' : r?.created ? t.yes : t.no}
              </text>
            </g>
          </>
        ) : (
          <g className={'ve-instance ' + (r?.created ? 've-instance-current' : '')}>
            <rect x="225" y="190" width="225" height="84" rx="10" />
            <text x="248" y="221">
              A
            </text>
            <text x="248" y="248">
              {t.currentInstance}
            </text>
          </g>
        )}
        <path
          className="ve-data-connector"
          data-retained={r?.retained}
          d={
            !recreate
              ? 'M338 274V317'
              : input.storage === 'external'
                ? 'M167 274V317H510V274'
                : 'M166 274V317'
          }
        />
        <g className="ve-data-plate">
          <rect x="66" y="319" width="544" height="48" rx="8" />
          <text x="338" y="348" textAnchor="middle">
            {input.storage === 'external' ? t.externalData : t.localLayer}
          </text>
        </g>
      </svg>
      <figcaption>
        <strong>{recreate ? t.actions[1] : t.actions[0]}</strong>
        <br />
        {t.hostBoundary}
      </figcaption>
      <details className="ve-text-alternative">
        <summary>{c.modelTable}</summary>
        <table>
          <thead>
            <tr>
              <th>{c.modelPart}</th>
              <th>{c.modelMeaning}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{t.imageAnatomy}</th>
              <td>{t.imageBoundary}</td>
            </tr>
            <tr>
              <th>{t.pipeline[1]}</th>
              <td>{input.runtime ? t.yes : t.no}</td>
            </tr>
            <tr>
              <th>{t.storage}</th>
              <td>{input.storage === 'external' ? t.storages[1] : t.storages[0]}</td>
            </tr>
            <tr>
              <th>{t.action}</th>
              <td>{recreate ? t.actions[1] : t.actions[0]}</td>
            </tr>
            <tr>
              <th>{c.result}</th>
              <td>
                {!r
                  ? c.modelPending
                  : r.outcome === 0
                    ? t.noProcess
                    : r.outcome === 1
                      ? t.lost
                      : t.kept}
              </td>
            </tr>
          </tbody>
        </table>
      </details>
    </figure>
  );
}
function Guide({ direction }: { direction: Direction }) {
  const compute = useCompute(),
    technical = useSandbox(),
    contexts = useMissionSafetyContexts();
  const [collapsed, setCollapsed] = useState(false);
  const safe = contexts.every((x) => x.state.ready && !x.state.issue && !x.active);
  const g = compute.facts.guide?.mission === 'vm' ? compute.facts.guide : undefined;
  const f = computeVmFacts(g, technical.attempt.engine, technical.attemptNumber);
  return (
    <>
      <header className="ve-guide-heading">
        <span className="ve-eyebrow">{c.guideEyebrow}</span>
        <h1 data-ve-heading tabIndex={-1}>
          {c.guideTitle}
        </h1>
        <p className="ve-lead">{c.guideLead}</p>
      </header>
      <div className="ve-guide-layout">
        <div className="ve-live-mission">
          <ComputeVmLesson
            headingLevel={2}
            portalLink={(href) => visualPortalHref(href, direction)}
          />
          {g && safe && (
            <ViewLink direction={direction} surface="handoff" primary>
              {c.workspace}
            </ViewLink>
          )}
        </div>
        <aside className={'ve-coach ' + (collapsed ? 've-coach-minimized' : '')}>
          <header>
            <strong>SavvyShark</strong>
            <button onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed}>
              {collapsed ? c.showCharacter : c.hideCharacter}
            </button>
          </header>
          {!collapsed && (
            <>
              <CharacterPortrait
                phase={f.complete ? 'checklist' : g ? 'thinking' : 'welcome'}
                ready={safe}
                independent={!safe}
              />
              <span className="ve-eyebrow">{c.coachRole}</span>
            </>
          )}
          <p>
            {!safe || !technical.ready || technical.issue
              ? c.guideUnknown
              : g
                ? f.complete
                  ? c.guideDone
                  : c.guideActive
                : compute.facts.guide
                  ? c.guideOther
                  : c.guideNoStart}
          </p>
          <p className="ve-small-note">{c.characterNote}</p>
        </aside>
      </div>
    </>
  );
}
function Handoff({ direction }: { direction: Direction }) {
  const t = useSandbox();
  const safe = t.ready && !t.issue;
  const vms = safe ? inventory(t.attempt.engine.world).filter((x) => x.kind === 'vm') : [];
  const [selected, setSelected] = useState('');
  const vm = vms.find((x) => x.id === selected) ?? vms[0];
  return (
    <>
      <header className="ve-handoff-heading">
        <span className="ve-eyebrow">{c.handoffEyebrow}</span>
        <h1 data-ve-heading tabIndex={-1}>
          {c.handoffTitle}
        </h1>
        <p className="ve-lead">{c.handoffLead}</p>
      </header>
      <div className="ve-handoff">
        <section>
          <span className="ve-eyebrow">{c.workspaceContext}</span>
          <ol>
            {c.handoffSteps.map((x, i) => (
              <li key={x}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <p>{x}</p>
              </li>
            ))}
          </ol>
          <ViewLink direction={direction} surface="workspace" primary>
            {c.workspace}
          </ViewLink>
          <p className="ve-small-note">{c.handoffLimit}</p>
        </section>
        <aside className="ve-resource-preview">
          <div className="ve-resource-preview-top">
            <ServiceIcon kind="vm" size={38} />
            <span>{c.resource}</span>
          </div>
          {!safe ? (
            <>
              <p role="status">{c.technicalUnknown}</p>
              <button className="ve-button" onClick={t.store.load}>
                {c.reload}
              </button>
            </>
          ) : vm ? (
            <>
              <label>
                {c.chooseVm}
                <select value={vm.id} onChange={(e) => setSelected(e.target.value)}>
                  {vms.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </label>
              <h2>{vm.name}</h2>
              <dl>
                <div>
                  <dt>{c.group}</dt>
                  <dd>
                    {t.attempt.engine.world.groups.find((g) => g.id === vm.groupId)?.name ??
                      vm.groupId}
                  </dd>
                </div>
                <div>
                  <dt>{c.region}</dt>
                  <dd>{vm.location}</dd>
                </div>
              </dl>
              <Link
                className="ve-button"
                href={visualPortalHref(
                  '/portal?area=resource&compute=vm&id=' + encodeURIComponent(vm.id),
                  direction,
                )}
                scroll={false}
              >
                {c.inspect}
                <ArrowRight size={17} />
              </Link>
            </>
          ) : (
            <>
              <h2>Virtual Machine</h2>
              <p>{c.noVm}</p>
            </>
          )}
          <p className="ve-resource-preview-note">{c.portalNote}</p>
        </aside>
      </div>
    </>
  );
}
function JournalLanding({ onOpen }: { onOpen: () => void }) {
  const compute = useCompute(),
    technical = useSandbox();
  const safe = compute.ready && !compute.issue && technical.ready && !technical.issue;
  return (
    <>
      <header className="ve-journal-heading">
        <span className="ve-eyebrow">{c.journalEyebrow}</span>
        <h1 data-ve-heading tabIndex={-1}>
          {c.journalTitle}
        </h1>
        <p className="ve-lead">{c.journalLead}</p>
      </header>
      <section className="ve-journal-summary">
        <div>
          <BookOpen size={34} />
          <h2>{c.journalOpen}</h2>
          <p>{c.journalLimit}</p>
          <button className="ve-button ve-button-primary" onClick={onOpen}>
            {c.journalOpen}
            <ArrowRight size={17} />
          </button>
        </div>
        <aside>
          <span className="ve-eyebrow">{computeCopy.title}</span>
          <dl>
            <div>
              <dt>{c.journalGuide}</dt>
              <dd>{safe ? compute.facts.guided.length : '—'}</dd>
            </div>
            <div>
              <dt>{c.journalFirsts}</dt>
              <dd>{safe ? compute.facts.firsts.length : '—'}</dd>
            </div>
          </dl>
          <p>{c.noSyntheticResults}</p>
        </aside>
      </section>
    </>
  );
}
function JournalBody() {
  const compute = useCompute(),
    technical = useSandbox();
  const safe = compute.ready && !compute.issue && technical.ready && !technical.issue;
  return (
    <div className="ve-journal-body">
      <p>{c.journalLimit}</p>
      <section>
        <h3>{c.journalGuide}</h3>
        {!safe ? (
          <p>{c.guideUnknown}</p>
        ) : compute.facts.guided.length ? (
          <ul>
            {compute.facts.guided.map((g, i) => {
              const f = computeVmFacts(g, technical.attempt.engine, technical.attemptNumber);
              return (
                <li key={i}>
                  <strong>{computeCopy.missions[g.mission].title}</strong>
                  <p>
                    {g.mission === 'vm'
                      ? f.complete
                        ? c.guideDone
                        : computeCopy.labels.pending
                      : computeGuidedFacts(g).complete
                        ? computeCopy.labels.done
                        : computeCopy.labels.pending}
                  </p>
                  {g.mission === 'vm' && (
                    <small>
                      {c.savedObservations}: {g.inspected.length}
                    </small>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>{c.noRecords}</p>
        )}
      </section>
      <section>
        <h3>{c.journalFirsts}</h3>
        {safe && compute.facts.firsts.length ? (
          <ul>
            {compute.facts.firsts.map((a) => (
              <li key={a.id}>
                <Link href={computeHref('assessment', a.item)}>{a.item}</Link> ·{' '}
                {a.assisted
                  ? computeCopy.labels.aided
                  : a.retry
                    ? computeCopy.labels.retry
                    : computeCopy.labels.unaided}
              </li>
            ))}
          </ul>
        ) : (
          <p>{c.journalEmpty}</p>
        )}
      </section>
      <section>
        <h3>{c.journalOther}</h3>
        <ApplicationHistory />
        <RefinedHistory track="benefits" />
        <RefinedHistory track="services" />
      </section>
      <section>
        <h3>{c.journalSources}</h3>
        <ComputeSources />
      </section>
    </div>
  );
}
function ReviewNavigation({ direction, surface }: { direction: Direction; surface: Surface }) {
  const index = demoSurfaces.indexOf(surface as Exclude<Surface, 'workspace' | 'character'>);
  const previous = demoSurfaces[index - 1],
    next = demoSurfaces[index + 1];
  return (
    <nav className="ve-review-navigation" aria-label={c.previousView + ' / ' + c.nextView}>
      {previous ? (
        <Link href={visualHref(direction, previous)} scroll={false}>
          <ArrowLeft size={17} />
          <span>
            <small>{c.previousView}</small>
            {c.surfaceNames[previous]}
          </span>
        </Link>
      ) : (
        <span />
      )}
      <p>{c.viewOnly}</p>
      {next ? (
        <Link href={visualHref(direction, next)} scroll={false}>
          <span>
            <small>{c.nextView}</small>
            {c.surfaceNames[next]}
          </span>
          <ArrowRight size={17} />
        </Link>
      ) : (
        <Link href={visualHref(direction, 'hub')} scroll={false}>
          {c.surfaceNames.hub}
          <ArrowRight size={17} />
        </Link>
      )}
    </nav>
  );
}
