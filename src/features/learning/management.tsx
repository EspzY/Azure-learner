'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { managementNb as c, architectureNb } from '@/content/nb';
import {
  managementCriteria,
  managementStudy,
  managementSources,
  managementHierarchy,
  ancestry,
  scopeFixture,
  initialScope,
  evaluateScope,
  liveManagementObservation,
  type ManagementTopic,
  type ManagementSection,
  type ManagementCriterion,
  type ScopeInput,
  type HierarchyNode,
} from '@/domain/curriculum/architecture-management';
import { useManagement } from './management-provider';
import { usePhysical } from './physical-provider';
import { PhysicalLesson } from './physical';
import { ManagementRecovery } from './management-recovery';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { ArchitectureExplorer } from '@/features/portal/architecture';
import { ServiceIcon } from '@/features/portal/service-icon';
import { GuidanceWindow } from '@/features/course/guidance-window';
import { SavvyShark } from '@/features/course/savvy-shark';
import {
  claimMilestone,
  milestonePreferenceKey,
  parseMilestonePreferences,
} from '@/domain/guidance/milestone-preferences';
import { conceptMilestones } from '@/domain/guidance/milestones';
import type { Navigate } from '@/features/portal/shared';
import './physical.css';
import './management.css';
export function ManagementLesson({
  topic,
  journal = false,
  guidanceBlocked = false,
  onLab,
}: {
  topic: ManagementTopic;
  journal?: boolean;
  guidanceBlocked?: boolean;
  onLab?: () => void;
}) {
  const s = useManagement(),
    query = useSearchParams(),
    bridge = useRef<HTMLElement>(null);
  useEffect(() => {
    if (topic !== 'scope' || !query.get('activity')) return;
    const frame = requestAnimationFrame(() => {
      bridge.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
      bridge.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [topic, query]);
  useEffect(() => {
    if (s.ready && !journal) s.store.event({ kind: 'visit', topic });
  }, [s.ready, s.store, topic, journal]);
  return (
    <article className="physical-lesson management-lesson" aria-label={c.part}>
      <header>
        <small>{c.part} · 1.0.0</small>
        <h2 data-activity-heading tabIndex={-1}>
          {journal ? c.journal : c.topics[topic]}
        </h2>
        <p>{c.objective}</p>
      </header>
      {s.issue && (
        <div className="course-storage" role="status">
          <p>
            {c.storage} ({s.issue})
          </p>
          <button onClick={s.store.load}>{c.reload}</button>
          <ManagementRecovery />
        </div>
      )}
      {s.facts.full && !journal && (
        <div className="course-storage" role="status">
          <p>{c.limit}</p>
          <Link href="/learn/architecture?topic=management-assessment">{c.limitReturn}</Link>
        </div>
      )}
      <p className="pa-prerequisite">{c.prerequisite}</p>
      {journal ? (
        <>
          {(Object.keys(managementStudy) as ManagementSection[]).map((section) => (
            <ManagementTheory key={section} section={section} journal />
          ))}
          <section>
            {c.hierarchyTheory.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
          <ScopeExplanation />
          <ManagementSources />
        </>
      ) : topic === 'hierarchy' ? (
        <HierarchyExplorer blocked={guidanceBlocked} />
      ) : topic === 'scope' ? (
        <>
          <ScopeExplorer blocked={guidanceBlocked} />
          <section className="ma-bridge" id="management-lab-debrief" tabIndex={-1} ref={bridge}>
            <h3>{c.portalBridge}</h3>
            <p>{c.portalWhy}</p>
            <button
              className="pa-primary"
              disabled={guidanceBlocked || s.facts.active || !s.ready || !!s.issue || !onLab}
              onClick={onLab}
            >
              {c.portalStart}
            </button>
            <h3>{c.debrief}</h3>
            <p>{c.debriefLimit}</p>
            <HierarchyExplorer blocked={guidanceBlocked} compact />
          </section>
        </>
      ) : topic === 'management-assessment' ? (
        <ManagementAssessment blocked={guidanceBlocked} />
      ) : topic === 'core-summary' ? (
        <CoreArchitectureSummary />
      ) : (
        <ManagementTheory section={topic} />
      )}
    </article>
  );
}
function ManagementTheory({
  section,
  journal = false,
}: {
  section: ManagementSection;
  journal?: boolean;
}) {
  const s = useManagement(),
    copy = c.sections[section],
    study = s.save.events.findLast((e) => e.kind === 'study' && e.section === section);
  return (
    <section className="pa-theory">
      <h3>{copy.title}</h3>
      <div className="pa-reading">
        <div>
          {copy.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside>
          <ol className="ma-concept-chain">
            {[
              c.directoryLabel,
              'Tenant root group',
              'Management group',
              'Subscription',
              'Resource group',
              'Resource',
            ].map((v, i) => (
              <li key={v}>
                <small>{i === 0 ? c.identity : c.membership}</small>
                <strong>{v}</strong>
              </li>
            ))}
          </ol>
          <dl className="pa-terms">
            {copy.terms.map(([term, meaning]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
      <p>
        {copy.sources.map((id) => (
          <a
            key={id}
            href={
              'https://learn.microsoft.com/en-us/' +
              managementSources[id as keyof typeof managementSources]
            }
            target="_blank"
            rel="noreferrer"
          >
            {id}{' '}
          </a>
        ))}
      </p>
      {!journal && (
        <fieldset className="pa-question" disabled={!s.ready || !!s.issue || s.facts.full}>
          <legend>{copy.question}</legend>
          {copy.choices.map(([id, label]) => (
            <label key={id}>
              <input
                type="radio"
                name={'management-study-' + section}
                checked={study?.kind === 'study' && study.answer === id}
                onChange={() => s.store.event({ kind: 'study', section, answer: id })}
              />
              <span>{label}</span>
            </label>
          ))}
          {study?.kind === 'study' && (
            <p role="status">{(copy.feedback as Record<string, string>)[study.answer]}</p>
          )}
        </fieldset>
      )}
    </section>
  );
}
function ScopeExplanation() {
  return (
    <section className="pa-theory">
      {c.scopeTheory.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </section>
  );
}
function ManagementSources() {
  return (
    <section>
      <h3>{c.sources}</h3>
      <p>{c.sourceReview}</p>
      <ul>
        {Object.entries(managementSources).map(([id, path]) => (
          <li key={id}>
            <a href={'https://learn.microsoft.com/en-us/' + path} target="_blank" rel="noreferrer">
              {id} · {path}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
export function CoreArchitectureJournal() {
  return (
    <>
      <PhysicalLesson topic="datacenters" journal />
      <ManagementLesson topic="organization" journal />
    </>
  );
}
export function CoreArchitectureSummary() {
  const a = usePhysical(),
    b = useManagement();
  const all =
    a.ready &&
    b.ready &&
    !a.issue &&
    !b.issue &&
    a.facts.guided &&
    b.facts.guided &&
    ['CA01', 'CA02', 'CA03'].every(
      (id) => a.facts.objective(id).taught && a.facts.objective(id).first,
    ) &&
    ['CA04', 'CA05', 'CA06', 'CA07'].every(
      (id) => b.facts.objective(id).taught && b.facts.objective(id).first,
    );
  return (
    <section>
      <h3>{c.summary}</h3>
      <p>{c.fullModule}</p>
      <p role="status">{all ? c.boundedComplete : c.notComplete}</p>
      {[
        [c.partA, a, architectureNb.objectives],
        [c.partB, b, c.objectives],
      ].map(([label, raw, objectives]) => {
        const s = raw as typeof a | typeof b;
        return (
          <section key={label as string}>
            <h3>{label as string}</h3>
            {s.issue && (
              <p>
                {label === c.partA ? architectureNb.storage : c.storage} ({s.issue})
              </p>
            )}
            <p>
              {label === c.partA ? architectureNb.guided : c.guided}:{' '}
              {s.facts.guided ? c.registered : c.notYet}
            </p>
            <dl>
              {Object.entries(objectives as Record<string, string>).map(([id, title]) => (
                <div key={id}>
                  <dt>{title}</dt>
                  <dd>
                    {c.taught}: {s.facts.objective(id).taught ? c.registered : c.notYet} ·{' '}
                    {c.firstOutcome}: {s.facts.objective(id).first ? c.registered : c.notYet}
                  </dd>
                </div>
              ))}
            </dl>
            <p>
              {c.first}:{' '}
              {s.facts.submissions[0]
                ? s.facts.submissions[0].assisted
                  ? c.assisted
                  : c.unaided
                : c.noSubmission}{' '}
              · {s.facts.submissions[0]?.retry ? c.retryLabel : ''}
            </p>
            <p>
              {c.abandoned}: {s.facts.abandoned} · {c.criterionCount}:{' '}
              {Object.values(s.facts.submissions[0]?.criteria ?? {}).filter(Boolean).length}
            </p>
          </section>
        );
      })}
      <p>{c.summaryLimit}</p>
      <ManagementSources />
    </section>
  );
}
function HierarchyExplorer({ blocked, compact = false }: { blocked: boolean; compact?: boolean }) {
  const live = useSandbox(),
    s = useManagement(),
    world = live.attempt.engine.world,
    nodes = managementHierarchy(world),
    [selected, setSelected] = useState('sub-app'),
    [lens, setLens] = useState<'management' | 'relations'>('management'),
    [answer, setAnswer] = useState(''),
    [closed, setClosed] = useState<Set<string>>(() => new Set());
  const node = nodes.find((n) => n.id === selected),
    path = node ? ancestry(nodes, node.id) : null,
    observation = liveManagementObservation(live.attempt.engine),
    safe = !blocked && s.ready && !s.issue && !s.facts.active && live.ready && !live.issue;
  const navigate: Navigate = (area, change = {}) => {
    window.location.assign(
      '/portal?' +
        new URLSearchParams({
          area,
          ...Object.fromEntries(Object.entries(change).map(([k, v]) => [k, String(v)])),
        }),
    );
  };
  const roots = nodes.filter((n) => !n.parentId);
  const tree = (n: HierarchyNode): React.ReactNode => {
    const children = nodes.filter((x) => x.parentId === n.id),
      expanded = !closed.has(n.id);
    return (
      <li key={n.id}>
        <div className="ma-node-row">
          {children.length > 0 && (
            <button
              className="ma-toggle"
              aria-expanded={expanded}
              aria-controls={'management-children-' + n.id}
              aria-label={c.expand + ': ' + n.name}
              onClick={() =>
                setClosed((prev) => {
                  const next = new Set(prev);
                  if (next.has(n.id)) next.delete(n.id);
                  else next.add(n.id);
                  return next;
                })
              }
            >
              {expanded ? '−' : '+'}
            </button>
          )}
          <ServiceIcon kind={n.kind} size={20} />
          <button aria-pressed={selected === n.id} onClick={() => setSelected(n.id)}>
            {n.name}
          </button>
          <small>{n.kind}</small>
        </div>
        {children.length > 0 && (
          <ul id={'management-children-' + n.id} hidden={!expanded}>
            {children.map((x) => tree(x))}
          </ul>
        )}
      </li>
    );
  };
  return (
    <section className="ma-hierarchy">
      <header>
        <h3>{c.hierarchyTitle}</h3>
        <p>{c.hierarchyLimit}</p>
        {!compact && c.hierarchyTheory.map((p) => <p key={p}>{p}</p>)}
        <p>
          {c.live} · {world.revision}
        </p>
        <p>
          {world.identity.name} · {c.identity}
        </p>
      </header>
      {(!live.ready || live.issue) && (
        <p role="status">
          {c.storage} ({live.issue ?? c.loading})
        </p>
      )}
      <div className="pa-actions">
        <button aria-pressed={lens === 'management'} onClick={() => setLens('management')}>
          {c.membership}
        </button>
        <button aria-pressed={lens === 'relations'} onClick={() => setLens('relations')}>
          {c.relationships}
        </button>
      </div>
      {lens === 'management' ? (
        <div className="ma-hierarchy-layout">
          <nav aria-label={c.hierarchyTitle}>
            <ul className="ma-tree">{roots.map((n) => tree(n))}</ul>
            {!world.groups.length && <p>{c.empty}</p>}
          </nav>
          <aside className="ma-inspector">
            <h4>{c.selected}</h4>
            {node ? (
              <>
                <h4>
                  <ServiceIcon kind={node.kind} size={24} /> {node.name}
                </h4>
                <p>
                  <code>{node.type}</code>
                </p>
                <h5>{c.ancestors}</h5>
                <ol>
                  {path?.map((id) => (
                    <li key={id}>{nodes.find((n) => n.id === id)?.name}</li>
                  ))}
                </ol>
                {node.location && (
                  <p>
                    {c.location}: {node.location}
                  </p>
                )}
                <Link
                  href={
                    '/portal?area=' +
                    (node.kind === 'subscription'
                      ? 'subscriptions'
                      : node.kind === 'management'
                        ? 'hierarchy'
                        : 'resource') +
                    '&id=' +
                    encodeURIComponent(node.id)
                  }
                >
                  {c.portal}
                </Link>
              </>
            ) : (
              <p>{c.noSelection}</p>
            )}
            <h4>{c.policyTitle}</h4>
            {world.policies.map((p) => (
              <div key={p.id}>
                <strong>{p.id}</strong>
                {node && (
                  <p>
                    {node.id === p.scopeId
                      ? c.assignmentDirect
                      : path?.includes(p.scopeId)
                        ? c.assignmentInherited
                        : c.assignmentOutside}
                  </p>
                )}
                <p>
                  {nodes.find((n) => n.id === p.scopeId)?.name} · {p.scopeId}
                </p>
                <code>{p.targetTypes.join(', ')}</code>
                <p>{p.allowedLocations.join(', ')}</p>
              </div>
            ))}
            <p>{c.policyLimit}</p>
          </aside>
        </div>
      ) : (
        <>
          <p>{c.relationsLimit}</p>
          <ArchitectureExplorer world={world} navigate={navigate} />
        </>
      )}
      {observation.relation && (
        <fieldset className="pa-question" disabled={!safe || s.facts.full}>
          <legend>{c.relationQuestion}</legend>
          <p>
            {observation.relation.app} → {observation.relation.group} · {observation.relation.app} →{' '}
            {observation.relation.plan}
          </p>
          {c.relationChoices.map(([id, label]) => (
            <label key={id}>
              <input
                type="radio"
                name="management-relations"
                checked={answer === id}
                onChange={() => {
                  setAnswer(id);
                  if (
                    s.store.event({ kind: 'observe', ...observation.relation, answer: id }) &&
                    id === 'distinct'
                  )
                    window.dispatchEvent(
                      new CustomEvent('azurelab:management-milestone', { detail: 'relation' }),
                    );
                }}
              />
              <span>{label}</span>
            </label>
          ))}
          {answer && <p role="status">{c.relationFeedback}</p>}
        </fieldset>
      )}
      {observation.denial ? (
        <button
          disabled={!safe || s.facts.full}
          onClick={() => {
            if (s.store.event({ kind: 'policy', ...observation.denial }))
              window.dispatchEvent(
                new CustomEvent('azurelab:management-milestone', { detail: 'policy' }),
              );
          }}
        >
          {c.observePolicy} · {observation.denial.command}
        </button>
      ) : (
        <p>{c.noPolicy}</p>
      )}
      <ManagementMilestones blocked={!safe} />
    </section>
  );
}
function ManagementMilestones({ blocked }: { blocked: boolean }) {
  const s = useManagement(),
    live = useSandbox(),
    [dialog, setDialog] = useState<'relation' | 'policy' | null>(null),
    [warning, setWarning] = useState(false);
  const observed = liveManagementObservation(live.attempt.engine);
  const qualifies = (kind: 'relation' | 'policy') =>
    kind === 'relation'
      ? !!observed.relation &&
        s.save.events.some(
          (e) =>
            e.kind === 'observe' && e.answer === 'distinct' && e.app === observed.relation!.app,
        )
      : !!observed.denial &&
        s.save.events.some((e) => e.kind === 'policy' && e.command === observed.denial!.command);
  if (blocked && dialog) setDialog(null);
  useEffect(() => {
    const onEvent = (e: Event) => {
      const kind = (e as CustomEvent).detail;
      if (
        blocked ||
        !['relation', 'policy'].includes(kind) ||
        document.querySelector('dialog[open]') ||
        s.store.getSnapshot().issue
      )
        return;
      try {
        const id = kind === 'relation' ? 'management-relations' : 'management-policy';
        const def = conceptMilestones[id];
        const claim = claimMilestone(localStorage, id + '@' + def.version + ':PartB');
        setWarning(claim === 'unavailable');
        if (claim === 'claimed') setDialog(kind);
      } catch {
        setWarning(true);
      }
    };
    const changed = (e: StorageEvent) => {
      if (e.key === null || e.key === milestonePreferenceKey) {
        setDialog(null);
        try {
          setWarning(!parseMilestonePreferences(localStorage.getItem(milestonePreferenceKey)));
        } catch {
          setWarning(true);
        }
      }
    };
    window.addEventListener('azurelab:management-milestone', onEvent);
    window.addEventListener('storage', changed);
    return () => {
      window.removeEventListener('azurelab:management-milestone', onEvent);
      window.removeEventListener('storage', changed);
    };
  }, [blocked, s.store]);
  return (
    <>
      {warning && <p role="status">{c.historyIssue}</p>}
      <div className="pa-actions">
        {(['relation', 'policy'] as const).map(
          (kind) =>
            !blocked &&
            qualifies(kind) && (
              <button key={kind} onClick={() => setDialog(kind)}>
                {c.recall} · {c.milestones[kind].title}
              </button>
            ),
        )}
      </div>
      {!blocked && dialog && qualifies(dialog) && (
        <GuidanceWindow
          title={c.milestones[dialog].title}
          notice={c.milestoneLimit}
          onClose={() => setDialog(null)}
        >
          <SavvyShark>
            <p>{c.milestones[dialog].text}</p>
          </SavvyShark>
          <div>
            {dialog === 'relation' ? (
              <dl>
                {Object.entries(observed.relation!).map(([kind, id]) => (
                  <div key={kind}>
                    <dt>{c.relationLabels[kind as keyof typeof c.relationLabels]}</dt>
                    <dd>
                      {managementHierarchy(live.attempt.engine.world).find((n) => n.id === id)
                        ?.name ?? id}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <>
                {observed.denial?.assignment} · {observed.denial?.scope} ·{' '}
                {observed.denial?.location} · {observed.denial?.command}
              </>
            )}
          </div>
        </GuidanceWindow>
      )}
    </>
  );
}
function ScopeStructure({ result }: { result: ReturnType<typeof evaluateScope> }) {
  return (
    <figure className="ma-scope-structure">
      <figcaption>{c.concept}</figcaption>
      <div className="ma-scope-parent">
        <ServiceIcon kind="management" size={24} /> {c.scopeNames.parent}
      </div>
      <div className="ma-scope-branches">
        {['development', 'production'].map((id) => (
          <section key={id}>
            <h4>
              <ServiceIcon kind="subscription" size={20} />
              {c.scopeNames[id as keyof typeof c.scopeNames]}
            </h4>
            {scopeFixture
              .filter((n) => n.parentId === id)
              .map((group) => (
                <div key={group.id}>
                  <h5>
                    <ServiceIcon kind="group" size={18} />
                    {c.scopeNames[group.id as keyof typeof c.scopeNames]}
                  </h5>
                  <ul>
                    {scopeFixture
                      .filter((n) => n.parentId === group.id)
                      .map((n) => (
                        <li key={n.id}>
                          <ServiceIcon kind={n.kind} size={20} />
                          <strong>{c.scopeNames[n.id as keyof typeof c.scopeNames]}</strong>
                          <span>{n.location}</span>
                          {result && (
                            <em>
                              {
                                c.statuses[
                                  result.find((r) => r.id === n.id)!
                                    .status as keyof typeof c.statuses
                                ]
                              }
                            </em>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </section>
        ))}
      </div>
    </figure>
  );
}
function ScopeExplorer({ blocked }: { blocked: boolean }) {
  const s = useManagement(),
    last = s.facts.runs.at(-1),
    [input, setInput] = useState<ScopeInput>(last?.input ?? initialScope),
    [prediction, setPrediction] = useState(''),
    [started, setStarted] = useState(!!last),
    [brief, setBrief] = useState(false);
  const safe = !blocked && s.ready && !s.issue && !s.facts.active,
    result = last ? evaluateScope(last.input) : null,
    explanation = s.save.events.findLast((e) => e.kind === 'explain');
  if (!safe && brief) setBrief(false);
  return (
    <section className="ma-scope">
      <h3>{c.scopeTitle}</h3>
      <p className="pa-assumptions">{c.concept}</p>
      <p>{c.task}</p>
      <ScopeExplanation />
      <ol className="pa-task-steps">
        {c.steps.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ol>
      {!safe && <p role="status">{c.blocked}</p>}
      <button disabled={!safe} onClick={() => setBrief(true)}>
        {started ? c.briefOpen : c.start}
      </button>
      {started && (
        <>
          <ScopeStructure result={result} />
          <fieldset className="pa-controls" disabled={!safe || s.facts.full}>
            <legend>{c.controls}</legend>
            {(
              [
                ['scope', c.scopeLabel, ['parent', 'development', 'production', 'dev-group']],
                ['target', c.targetLabel, ['plan', 'app', 'vm']],
                ['effect', c.effectLabel, ['deny', 'audit', 'disabled']],
                ['allowed', c.allowedLabel, ['westeurope', 'northeurope']],
              ] as const
            ).map(([key, label, values]) => (
              <label key={key}>
                {label}
                <select
                  value={input[key]}
                  onChange={(e) => {
                    setInput({ ...input, [key]: e.target.value });
                    setPrediction('');
                  }}
                >
                  {values.map((v) => (
                    <option key={v} value={v}>
                      {c.scopeNames[v as keyof typeof c.scopeNames] ??
                        c.targetNames[v as keyof typeof c.targetNames] ??
                        v}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <label>
              {c.prediction}
              <select value={prediction} onChange={(e) => setPrediction(e.target.value)}>
                <option value="">{c.choose}</option>
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <p>{c.pendingPrediction}</p>
            <button
              className="pa-primary"
              disabled={prediction === ''}
              onClick={() => s.store.event({ kind: 'run', input, prediction: Number(prediction) })}
            >
              {c.run}
            </button>
          </fieldset>
          <SavvyShark compact>
            <h3>{c.practice}</h3>
            <p>{c.actualGuide}</p>
            {last && (
              <p>
                {c.prediction}: {last.prediction} · {c.result}:{' '}
                {evaluateScope(last.input)!.filter((r) => r.status === 'denied').length}
              </p>
            )}
          </SavvyShark>
          {result && (
            <section aria-live="polite">
              <h4>{c.result}</h4>
              <dl className="ma-snapshot">
                <div>
                  <dt>{c.scopeLabel}</dt>
                  <dd>{c.scopeNames[last!.input.scope]}</dd>
                </div>
                <div>
                  <dt>{c.targetLabel}</dt>
                  <dd>{c.targetNames[last!.input.target]}</dd>
                </div>
                <div>
                  <dt>{c.effectLabel}</dt>
                  <dd>{last!.input.effect}</dd>
                </div>
                <div>
                  <dt>{c.allowedLabel}</dt>
                  <dd>{last!.input.allowed}</dd>
                </div>
              </dl>
              {JSON.stringify(last!.input) !== JSON.stringify(input) && <p>{c.unchanged}</p>}
              <div className="ma-table-scroll" role="region" aria-label={c.result} tabIndex={0}>
                <table>
                  <caption>{c.concept}</caption>
                  <thead>
                    <tr>
                      {[c.row, c.inScope, c.typeMatch, c.condition, c.outcome].map((x) => (
                        <th key={x} scope="col">
                          {x}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((r) => (
                      <tr key={r.id}>
                        <th scope="row">{c.scopeNames[r.id as keyof typeof c.scopeNames]}</th>
                        <td>{r.included ? c.yes : c.no}</td>
                        <td>{r.target ? c.yes : c.no}</td>
                        <td>{r.condition ? c.yes : c.no}</td>
                        <td>{c.statuses[r.status as keyof typeof c.statuses]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <fieldset className="pa-question" disabled={!safe || s.facts.full}>
                <legend>{c.explain}</legend>
                {c.explainChoices.map(([id, label]) => (
                  <label key={id}>
                    <input
                      type="radio"
                      name="management-explain"
                      checked={explanation?.kind === 'explain' && explanation.answer === id}
                      onChange={() => s.store.event({ kind: 'explain', answer: id })}
                    />
                    <span>{label}</span>
                  </label>
                ))}
                {explanation?.kind === 'explain' && (
                  <p role="status">{c.explainFeedback[explanation.answer]}</p>
                )}
              </fieldset>
            </section>
          )}
          <ul className="pa-witnesses">
            {c.witnesses.map((x, i) => (
              <li key={x}>
                {s.facts.witnesses[i] ? c.registered : c.pending}: {x}
              </li>
            ))}
          </ul>
          {s.facts.guided && <p role="status">{c.guidedDone}</p>}
        </>
      )}
      {safe && brief && (
        <GuidanceWindow
          title={c.brief.title}
          notice={c.brief.consequence}
          onClose={() => setBrief(false)}
          onStart={() => {
            setStarted(true);
            setBrief(false);
          }}
        >
          <SavvyShark>
            <p>{c.brief.why}</p>
          </SavvyShark>
          <p>{c.prerequisite}</p>
          <ol>
            {c.steps.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
          <p>{c.brief.observe}</p>
        </GuidanceWindow>
      )}
    </section>
  );
}
function ManagementAssessment({ blocked }: { blocked: boolean }) {
  const s = useManagement(),
    f = s.facts,
    last = f.submissions.at(-1),
    unsafe = blocked || !s.ready || !!s.issue;
  const draft = (id: string, value: string) =>
    s.store.event({
      kind: 'draft',
      answers: {
        ...s.store
          .getSnapshot()
          .save.events.reduce(
            (a, e) => (e.kind === 'draft' ? e.answers : e.kind === 'begin' ? {} : a),
            {} as Record<string, string>,
          ),
        [id]: value,
      },
    });
  return (
    <section className="pa-assessment">
      <h3>{c.independent}</h3>
      <p>{c.assessmentIntro}</p>
      {blocked && <p role="status">{c.blocked}</p>}
      {!f.active ? (
        <button
          className="pa-primary"
          disabled={unsafe || f.full}
          onClick={() => s.store.event({ kind: 'begin' })}
        >
          {f.attempts ? c.retry : c.begin}
        </button>
      ) : (
        <>
          <p role="status">
            {c.active} · {f.assisted ? c.assisted : c.unaided} ·{' '}
            {f.attempts > 1 ? c.retryLabel : ''}
          </p>
          {c.scenarios.map((scenario, index) => (
            <section key={scenario.title}>
              <h3>{scenario.title}</h3>
              <p>{scenario.text}</p>
              {Object.entries(c.questions)
                .filter(([, q]) => q.scenario === index)
                .map(([id, q]) => (
                  <fieldset key={id} className="pa-question" disabled={unsafe || f.full}>
                    <legend>{q.label}</legend>
                    {q.choices.map(([key, label]) => (
                      <label key={key}>
                        <input
                          type="radio"
                          name={`management-${id}`}
                          value={key}
                          checked={f.draft[id] === key}
                          onChange={() => draft(id, key)}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </fieldset>
                ))}
            </section>
          ))}
          <div className="pa-actions">
            <button
              className="pa-primary"
              disabled={unsafe || Object.keys(managementCriteria).some((id) => !f.draft[id])}
              onClick={() => s.store.event({ kind: 'submit', answers: f.draft })}
            >
              {c.submit}
            </button>
            <button disabled={unsafe} onClick={() => s.store.event({ kind: 'aid' })}>
              {c.aid}
            </button>
            <button disabled={unsafe} onClick={() => s.store.event({ kind: 'abandon' })}>
              {c.abandon}
            </button>
          </div>
          {f.assisted && <p>{c.aidText}</p>}
        </>
      )}
      {!s.issue && !f.active && last && (
        <section className="pa-feedback">
          <h3>{c.feedback}</h3>
          <p>
            {last.assisted ? c.assisted : c.unaided} · {last.retry ? c.retryLabel : ''}
          </p>
          {Object.entries(c.questions).map(([id, q]) => (
            <article key={id}>
              <h4>
                {q.label} · {last.criteria[id as ManagementCriterion] ? c.correct : c.wrong}
              </h4>
              <p>{(q.feedback as Record<string, string>)[last.answers[id]!]}</p>
              {!last.criteria[id as ManagementCriterion] && (
                <p>
                  {
                    (q.feedback as Record<string, string>)[
                      managementCriteria[id as ManagementCriterion].answer
                    ]
                  }
                </p>
              )}
              <details>
                <summary>{c.allReasons}</summary>
                <dl>
                  {q.choices.map(([key, label]) => (
                    <div key={key}>
                      <dt>{label}</dt>
                      <dd>{(q.feedback as Record<string, string>)[key]}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}
