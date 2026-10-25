'use client';
import { useEffect, useState, useRef, useId } from 'react';
import Link from 'next/link';
import { nb, regionLabels } from '@/content/nb';
import {
  activities,
  experiment,
  teachingPolicy,
  type Activity,
  type Input,
  type Result,
} from '@/domain/curriculum/expansion-models';
import { trackUnits, criteria, type Track, type Unit } from '@/domain/curriculum/expansion';
import {
  bindings,
  expansionSources,
  manuscript,
  type Manuscript,
} from '@/domain/curriculum/expansion-content';
import { useExpansion } from './expansion-provider';
import { SavvyShark } from '@/features/course/savvy-shark';
import { ResponsibilityExplorer } from '@/features/portal/responsibility';
import './expansion.css';
const t = nb.expansion.common;
export function ExpandedModule({
  track,
  topic,
  technicalReady = false,
  embedded = false,
}: {
  track: Track;
  topic: string;
  technicalReady?: boolean;
  embedded?: boolean;
}) {
  const learning = useExpansion(track, technicalReady),
    [confirm, setConfirm] = useState(false);
  const c = manuscript(track, topic),
    unit = topic as Unit;
  useEffect(() => {
    if (learning.ready && c) learning.store.event({ kind: 'visit', unit });
  }, [learning.ready, learning.store, c, unit]);
  return (
    <article className={`expanded-module ${embedded ? 'expanded-embedded' : ''}`}>
      {learning.issue && (
        <div className="course-storage" role="status">
          <p>
            {t.storage} ({learning.issue})
          </p>
          {learning.issue === 'unsaved' && <p>{t.memory}</p>}
          <button onClick={learning.store.load}>{t.reload}</button>
          <button onClick={() => setConfirm(true)}>{t.reset}</button>
          {confirm && (
            <button
              onClick={() => {
                learning.store.clear();
                setConfirm(false);
              }}
            >
              {t.confirmReset}
            </button>
          )}
        </div>
      )}
      {topic === 'assessment' ? (
        <ExpandedAssessment track={track} />
      ) : topic === 'summary' ? (
        <ExpandedSummary track={track} technicalReady={technicalReady} />
      ) : c ? (
        <>
          <header className="expanded-heading">
            <small>{c.objective}</small>
            {embedded ? (
              <h3 data-activity-heading tabIndex={-1}>
                {c.title}
              </h3>
            ) : (
              <h2 data-activity-heading tabIndex={-1}>
                {c.title}
              </h2>
            )}
            <p>{c.prerequisite}</p>
          </header>
          {track === 'services' && topic === trackUnits[track][0] && (
            <p className="expanded-intro">{nb.expansion[track].intro}</p>
          )}
          <p className="expanded-intuition">{c.intuition}</p>
          <div className="expanded-explanation">
            <section>
              <h3>{t.mechanism}</h3>
              <p>{c.mechanism}</p>
            </section>
            <section>
              <h3>{t.azure}</h3>
              <p>{c.azure}</p>
            </section>
          </div>
          <section className="expanded-worked">
            <h3>{t.worked}</h3>
            <p>{c.example}</p>
          </section>
          <section className="expanded-assumptions">
            <h3>{t.limits}</h3>
            <p>{c.limits}</p>
          </section>
          <SavvyShark compact>
            <dl className="expanded-guidance">
              {(['goal', 'why', 'action', 'expect'] as const).map((k) => (
                <div key={k}>
                  <dt>{t[k]}</dt>
                  <dd>{c[k]}</dd>
                </div>
              ))}
            </dl>
          </SavvyShark>
          {unit === 'overview' ? (
            <ResponsibilityExplorer
              context="services-v2"
              guide
              onCompare={(model) =>
                learning.store.event({
                  kind: 'run',
                  unit: 'overview',
                  input: { model },
                  prediction: null,
                })
              }
            />
          ) : unit !== 'practice' ? (
            <Experiment key={`experiment-${unit}`} track={track} unit={unit} />
          ) : (
            <p className="expanded-technical" role="status">
              {technicalReady ? t.technicalReady : t.technicalMissing} {t.technicalRequired}
            </p>
          )}
          <section className="expanded-counterexample">
            <h3>{t.counterexample}</h3>
            <p>{c.misconception}</p>
          </section>
          <GuidedAnswer
            key={`answer-${unit}`}
            track={track}
            unit={unit}
            content={c}
            technicalReady={technicalReady}
          />
          <details>
            <summary>{t.terms}</summary>
            <dl>
              {c.terms.map(([term, meaning]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{meaning}</dd>
                </div>
              ))}
            </dl>
          </details>
          <Sources unit={unit} />
          <nav className="expanded-evidence">
            <Link href={`/learn/${track}?topic=assessment`}>{t.assessment}</Link>
            <Link href={`/learn/${track}?topic=summary`}>{t.summary}</Link>
          </nav>
        </>
      ) : null}
    </article>
  );
}
function Sources({ unit }: { unit: Unit }) {
  return (
    <details className="expanded-sources">
      <summary>{t.sources}</summary>
      <p>{t.review}</p>
      <ul>
        {bindings[unit].sources.map((id) => (
          <li key={id}>
            <a href={expansionSources[id]!.url} target="_blank" rel="noreferrer">
              {id} · Microsoft Learn ↗
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
export function ExpansionReference({ track, topic }: { track: Track; topic: string }) {
  const [unit, setUnit] = useState<Unit>(
    (trackUnits[track] as readonly string[]).includes(topic)
      ? (topic as Unit)
      : trackUnits[track][0],
  );
  const learning = useExpansion(track);
  useEffect(() => {
    if (learning.facts.active) learning.store.event({ kind: 'aid' });
  }, [learning.facts.active, learning.store]);
  const c = manuscript(track, unit)!;
  return (
    <article className="expanded-reference">
      <label>
        {nb.official.unitLabel}
        <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
          {trackUnits[track].map((id) => (
            <option key={id} value={id}>
              {manuscript(track, id)!.title}
            </option>
          ))}
        </select>
      </label>
      <h2>{c.title}</h2>
      {(
        [
          'prerequisite',
          'intuition',
          'mechanism',
          'azure',
          'example',
          'misconception',
          'limits',
        ] as const
      ).map((key) => (
        <section key={key}>
          <h3>
            {key === 'intuition'
              ? t.goal
              : key === 'example'
                ? t.worked
                : key === 'misconception'
                  ? t.counterexample
                  : key === 'prerequisite'
                    ? t.prerequisite
                    : t[key]}
          </h3>
          <p>{c[key]}</p>
        </section>
      ))}
      <Sources unit={unit} />
    </article>
  );
}
function GuidedAnswer({
  track,
  unit,
  content: c,
  technicalReady,
}: {
  track: Track;
  unit: Unit;
  content: Manuscript;
  technicalReady: boolean;
}) {
  const { facts, store, ready, issue } = useExpansion(track, technicalReady),
    [choice, setChoice] = useState('');
  const answered = facts.answers[unit],
    feedback = c.choices.find((x) => x[0] === answered)?.[2],
    requirements = unit === 'practice' ? [] : activities[unit].required;
  return (
    <form
      className="expanded-practice"
      onSubmit={(e) => {
        e.preventDefault();
        store.event({ kind: 'answer', unit, answer: choice });
      }}
    >
      <h3>{t.required}</h3>
      <ul className="expanded-witnesses">
        {requirements.map((w) => (
          <li key={w} data-observed={facts.witnesses.get(unit)?.has(w) ?? false}>
            {facts.witnesses.get(unit)?.has(w) ? '✓' : '○'}{' '}
            {t.witnesses[w as keyof typeof t.witnesses]}
          </li>
        ))}
      </ul>
      <fieldset
        disabled={!ready || ['corrupt', 'unsupported', 'conflict', 'limit'].includes(issue ?? '')}
      >
        <legend>{c.question}</legend>
        {c.choices.map(([id, label]) => (
          <label key={id}>
            <input
              type="radio"
              name={`apply-${unit}`}
              required
              checked={choice === id}
              onChange={() => setChoice(id!)}
            />
            {label}
          </label>
        ))}
        <button disabled={!facts.observed(unit) || (unit === 'practice' && !technicalReady)}>
          {t.check}
        </button>
      </fieldset>
      {!facts.observed(unit) && <p>{t.wait}</p>}
      {feedback && (
        <p className="expanded-causal" role="status">
          {feedback}
        </p>
      )}
      {facts.guided(unit) && (
        <p role="status">
          {t.practiced} · {c.objective}
        </p>
      )}
    </form>
  );
}
function valueLabel(id: string | number) {
  return typeof id === 'number'
    ? String(id)
    : id === 'sub-app'
      ? 'App Sandbox'
      : id === 'sub-shared'
        ? 'Shared Sandbox'
        : id in regionLabels
          ? regionLabels[id as keyof typeof regionLabels]
          : ((t.values as Record<string, string>)[id] ??
            (id === 'yes' ? t.results.yes : id === 'no' ? t.results.no : id));
}
function Experiment({ track, unit }: { track: Track; unit: Activity }) {
  const learning = useExpansion(track),
    last = learning.facts.runs.findLast((r) => r.unit === unit);
  const [input, setInput] = useState<Input>(last?.input ?? activities[unit].initial),
    [prediction, setPrediction] = useState(''),
    [error, setError] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const shown = last && JSON.stringify(last.input) === JSON.stringify(input),
    result = shown ? experiment(unit, last.input) : null;
  const change = (id: string, value: string) => {
    const field = activities[unit].fields.find((f) => f.id === id)!;
    setInput((old) => ({
      ...old,
      [id]: typeof field.values[0] === 'number' ? Number(value) : value,
    }));
    setError(false);
  };
  return (
    <section
      className="expanded-experiment"
      aria-label={manuscript(track, unit)!.title}
      data-unit={unit}
    >
      <div className="expanded-model-layout">
        <div className="expanded-visual">
          <ModelVisual unit={unit} input={input} />
          {unit === 'reliability' && (
            <ol className="incident-trend" aria-label={t.results.observations}>
              {[2, 4, 6].map((n, i) => (
                <li key={i}>
                  <span>{i + 1}</span>
                  <meter min={0} max={6} value={n} />
                  <strong>{n} / 6</strong>
                </li>
              ))}
            </ol>
          )}
        </div>
        <form
          ref={form}
          className="expanded-controls"
          onSubmit={(e) => {
            e.preventDefault();
            const p = unit === 'availability' ? Number(prediction) : null;
            if (
              unit === 'availability' &&
              (prediction.trim() === '' || !Number.isInteger(p) || p! < 0 || p! > 30)
            ) {
              setError(true);
              return;
            }
            if (!learning.store.event({ kind: 'run', unit, input, prediction: p })) setError(true);
          }}
        >
          {activities[unit].fields
            .filter(
              (f) =>
                unit !== 'management' ||
                (!(['a', 'b', 'c'].includes(f.id) && input.method === 'template') &&
                  !(f.id === 'template' && input.method === 'manual')),
            )
            .map((field) => (
              <label key={field.id}>
                {t.labels[field.id as keyof typeof t.labels]}
                <select value={input[field.id]} onChange={(e) => change(field.id, e.target.value)}>
                  {field.values.map((v) => (
                    <option key={v} value={v}>
                      {valueLabel(v)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          {unit === 'availability' && (
            <label>
              {t.prediction}
              <input
                aria-label={t.prediction}
                type="number"
                required
                min={0}
                max={30}
                step={1}
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
              />
              <small>{t.predictionHelp}</small>
            </label>
          )}
          <button
            className="primary"
            disabled={
              !learning.ready ||
              ['corrupt', 'unsupported', 'conflict', 'limit'].includes(learning.issue ?? '')
            }
          >
            {t.run}
          </button>
          {error && <p role="alert">{t.invalid}</p>}
        </form>
      </div>
      {result ? (
        <ResultView unit={unit} result={result} prediction={last?.prediction ?? null} />
      ) : (
        <p className="expanded-causal">{t.pending}</p>
      )}
    </section>
  );
}
function ResultView({
  unit,
  result: r,
  prediction,
}: {
  unit: Activity;
  result: Result;
  prediction: number | null;
}) {
  const cause =
    unit === 'paas'
      ? (t.results.paasCause as Record<string, string>)[r.code]
      : unit === 'saas'
        ? r.issues.length
          ? r.issues.map((id) => (t.results.saasCause as Record<string, string>)[id]).join(' ')
          : t.results.saasCause.fit
        : (t.results as Record<string, unknown>)[r.code];
  return (
    <div className="expanded-result" aria-live="polite">
      {unit === 'governance' && r.receipt ? (
        <>
          <p>{t.results.fork}</p>
          <strong>{nb.chapter.errors[r.receipt.code]}</strong>
          <dl className="expanded-metrics">
            {[
              [
                nb.chapter.requestedLocation,
                r.receipt.location ? valueLabel(r.receipt.location) : '—',
              ],
              [nb.chapter.scope, r.receipt.scopeId],
              [nb.chapter.rule, r.receipt.ruleId],
              [nb.chapter.inventory, `${r.receipt.beforeCount} → ${r.receipt.afterCount}`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {r.receipt.policy && (
            <p>
              {r.receipt.policy.assignmentId} · {r.receipt.policy.assignmentScope} ·{' '}
              {r.receipt.policy.allowedLocations.map(valueLabel).join(', ')}
            </p>
          )}
          <p>
            {t.results.permission} {t.results.security}
          </p>
        </>
      ) : (
        <>
          <dl className="expanded-metrics">
            {Object.entries(r.metrics).map(([key, value]) => (
              <div key={key}>
                <dt>{(t.results as Record<string, unknown>)[key] as string}</dt>
                <dd>
                  {value === null
                    ? t.results.undefined
                    : typeof value === 'number'
                      ? Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 }).format(value)
                      : valueLabel(value)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="expanded-causal">{typeof cause === 'string' ? cause : ''}</p>
          {unit === 'iaas' &&
            r.issues.map((id) => (
              <p key={id}>{t.results.vmMissing[id as keyof typeof t.results.vmMissing]}</p>
            ))}
        </>
      )}
      {prediction !== null && (
        <p>
          {t.prediction}: {prediction} · {t.results.served}: {r.metrics.served}
        </p>
      )}
      {['iaas', 'paas', 'saas', 'selection'].includes(unit) && <p>{t.results.noGuarantee}</p>}
    </div>
  );
}
function ModelVisual({ unit, input: i }: { unit: Activity; input: Input }) {
  const marker = useId().replaceAll(':', '');
  if (['iaas', 'paas', 'saas', 'selection'].includes(unit))
    return <TechnicalVisual unit={unit} input={i} />;
  if (unit === 'management') {
    const rows = i.method === 'template' ? [i.template, i.template, i.template] : [i.a, i.b, i.c];
    return (
      <table className="configuration-matrix">
        <caption>
          {t.results.observations} · {valueLabel('westeurope')}
        </caption>
        <thead>
          <tr>
            <th>{t.labels.method}</th>
            <th>{t.labels.region}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((value, n) => (
            <tr key={n} data-match={value === 'westeurope'}>
              <th>{['A', 'B', 'C'][n]}</th>
              <td>{valueLabel(value!)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  if (unit === 'sustainability') {
    const hours = Number(i.hours);
    return (
      <div className="resource-schedule">
        <strong>
          {t.labels.hours}: {hours}/24
        </strong>
        <div aria-hidden="true">
          {Array.from({ length: 24 }, (_, hour) => (
            <span key={hour} data-active={hour < hours}>
              {hour + 1}
            </span>
          ))}
        </div>
        <p>
          {valueLabel(i.profile!)} · {i.capacity} × {i.copies}
        </p>
      </div>
    );
  }
  return (
    <svg
      className="expanded-diagram"
      viewBox="0 0 900 370"
      role="img"
      aria-label={
        manuscript(
          unit === 'availability' || unit === 'reliability' || unit === 'governance'
            ? 'benefits'
            : 'services',
          unit,
        )!.title
      }
    >
      <defs>
        <marker id={marker} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0L6 3 0 6" stroke="currentColor" fill="none" />
        </marker>
      </defs>
      {unit === 'availability' ? (
        <>
          <g className="model-client">
            <circle cx="72" cy="150" r="20" />
            <path d="M40 210v-20q32-36 64 0v20" />
            <text x="25" y="255">
              {t.results.client}
            </text>
          </g>
          <path className="model-route" d="M115 175H245" markerEnd={`url(#${marker})`} />
          <circle className="model-hub" cx="260" cy="175" r="14" />
          <text x="155" y="155">
            {t.results.route}
          </text>
          {Array.from({ length: Number(i.instances) }, (_, n) => {
            const x = 320 + n * 180,
              failed = n === 0 && i.failed === 'one',
              routed = i.routing === 'balanced' || n === 0;
            return (
              <g key={n}>
                <path
                  className={`model-route ${failed || !routed ? 'model-off' : ''}`}
                  d={`M275 175V60H${x + 75}V95`}
                  markerEnd={`url(#${marker})`}
                />
                <ServerGlyph x={x} y={105} label={`${n + 1} · ${i.size}`} failed={failed} />
              </g>
            );
          })}
        </>
      ) : unit === 'reliability' ? (
        <>
          <ServerGlyph
            x={85}
            y={115}
            label={
              i.incident === 'instance' && i.remedy === 'reroute'
                ? t.results.alternative
                : t.results.instance
            }
            failed={i.incident === 'instance' && i.remedy !== 'reroute'}
          />
          <path
            className={`model-route ${i.incident === 'dependency' && i.remedy !== 'restore' ? 'model-off' : ''}`}
            d="M265 180H490"
            markerEnd={`url(#${marker})`}
          />
          <ServerGlyph
            x={510}
            y={115}
            label={t.results.dependency}
            failed={i.incident === 'dependency' && i.remedy !== 'restore'}
          />
          <text x="90" y="325">
            {valueLabel(i.incident!)}
          </text>
        </>
      ) : unit === 'governance' ? (
        <>
          <rect x="35" y="65" width="365" height="245" rx="8" className="model-boundary" />
          <text x="95" y="110">
            {valueLabel(i.subscription!)}
          </text>
          <ServerGlyph x={135} y={145} label={valueLabel(i.region!)} />
          <path
            className={`model-route model-policy ${i.subscription !== teachingPolicy.scopeId ? 'model-off' : ''}`}
            d="M340 205H535"
            markerEnd={`url(#${marker})`}
          />
          <rect x="545" y="65" width="320" height="245" rx="8" className="model-boundary" />
          <text x="565" y="100">
            {t.results.policyScope}
          </text>
          <text x="565" y="127">
            {valueLabel(teachingPolicy.scopeId)}
          </text>
          <path d="M710 150l50 18v45q-15 35-50 50-35-15-50-50v-45z" className="model-shield" />
          <text x="565" y="290">
            {teachingPolicy.allowedLocations.map(valueLabel).join(' / ')}
          </text>
          <text x="250" y="350">
            {i.subscription === teachingPolicy.scopeId ? t.results.applies : t.results.outside}
          </text>
        </>
      ) : (
        <>
          <ServerGlyph
            x={120}
            y={120}
            label={valueLabel(i.model ?? i.package ?? i.user ?? 'iaas')}
          />
          <text x="380" y="190">
            {t.results.noGuarantee}
          </text>
        </>
      )}
    </svg>
  );
}
function TechnicalVisual({ unit, input: i }: { unit: Activity; input: Input }) {
  const c = nb.expansion.common;
  return (
    <section className={`technical-sketch sketch-${unit}`} aria-label={c.preview}>
      <small>{c.preview}</small>
      {unit === 'iaas' ? (
        <>
          <div className="vm-guest">
            <strong>{c.vm.boundary}</strong>
            <div className="vm-os" data-warning={i.guest !== 'windows'}>
              <small>{c.vm.os}</small>
              <b>{valueLabel(i.guest!)}</b>
            </div>
            <div className="vm-resources">
              <span>{c.vm.resources}</span>
              <b>{i.cpu} vCPU</b>
              <b data-warning={Number(i.ram) < 8}>{i.ram} GiB</b>
            </div>
            <div
              className="vm-runtime"
              data-warning={i.runtime !== 'installed' || i.patch !== 'planned'}
            >
              {c.vm.runtime}
              <p>
                {valueLabel(i.runtime!)} · {valueLabel(i.patch!)}
              </p>
            </div>
          </div>
          <div className="vm-connections">
            <div data-warning={i.disk !== 'persistent'}>
              <strong>{c.vm.disk}</strong>
              <p>{valueLabel(i.disk!)}</p>
            </div>
            <div data-warning={i.network !== 'configured'}>
              <strong>{c.vm.nic}</strong>
              <p>{valueLabel(i.network!)}</p>
            </div>
          </div>
          <div className="vm-physical">{c.vm.host}</div>
          <p>{c.vm.needs}</p>
        </>
      ) : unit === 'paas' ? (
        <>
          <div className="platform-package">
            <strong>{c.platform.input}</strong>
            <p>{valueLabel(i.package!)}</p>
          </div>
          <div className="platform-gate" data-warning={i.package !== 'supported'}>
            <b>↓</b>
            <strong>{c.platform.gate}</strong>
            <p>{i.package === 'supported' ? c.platform.allowed : c.platform.blocked}</p>
          </div>
          <div className="platform-host">
            <strong>{c.results.platform}</strong>
            <p>{c.platform.runtime}</p>
          </div>
          <h4>{c.platform.retained}</h4>
          <div className="retained-choices">
            {(['config', 'access', 'data'] as const).map((key) => (
              <div key={key}>
                <strong>{c.labels[key]}</strong>
                <p>{valueLabel(i[key]!)}</p>
              </div>
            ))}
          </div>
        </>
      ) : unit === 'saas' ? (
        <>
          <div className="saas-person">
            <span aria-hidden="true">◉</span>
            <strong>{c.saasModel.person}</strong>
          </div>
          <ol className="saas-gates">
            <li data-warning={i.user === 'departed' || i.license === 'unlicensed'}>
              <strong>{c.saasModel.entry}</strong>
              <p>
                {valueLabel(i.user!)} · {valueLabel(i.license!)}
              </p>
            </li>
            <li data-warning={i.role === 'admin'}>
              <strong>{c.saasModel.authority}</strong>
              <p>{valueLabel(i.role!)}</p>
            </li>
            <li data-warning={i.sharing === 'everyone'}>
              <strong>{c.saasModel.data}</strong>
              <p>{valueLabel(i.sharing!)}</p>
            </li>
          </ol>
          <div className="saas-provider">{c.saasModel.provider}</div>
          {i.user === 'departed' && <p>{c.saasModel.departed}</p>}
        </>
      ) : (
        <>
          <div className="choice-requirement">
            <small>{c.choiceModel.requirements}</small>
            <h4>{c.choiceModel[i.scenario as 'legacy' | 'custom' | 'ready' | 'open']}</h4>
          </div>
          <div className="choice-decision">
            <strong>{c.choiceModel.boundary}</strong>
            <b>{valueLabel(i.model!)}</b>
            <span>{c.choiceModel.reason}</span>
            <p>{valueLabel(i.reason!)}</p>
          </div>
          <p>{c.choiceModel.evaluate}</p>
        </>
      )}
    </section>
  );
}
function ServerGlyph({
  x,
  y,
  label,
  failed = false,
}: {
  x: number;
  y: number;
  label: string;
  failed?: boolean;
}) {
  return (
    <g
      transform={`translate(${x},${y})`}
      className={failed ? 'model-server model-failed' : 'model-server'}
    >
      <path d="M0 0H130L150 18V120H0Z" />
      {[22, 52, 82].map((row) => (
        <g key={row}>
          <rect x="15" y={row} width="115" height="19" rx="2" />
          <path d={`M24 ${row + 9}h68`} />
          <circle cx="118" cy={row + 9} r="3" />
        </g>
      ))}
      {failed && <path className="model-cross" d="M40 25L110 95M110 25L40 95" />}
      <text x="75" y="155" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}
function ExpandedAssessment({ track }: { track: Track }) {
  const { facts, store, ready, issue } = useExpansion(track),
    [help, setHelp] = useState(false),
    task = nb.expansion[track].assessment,
    last = facts.submissions.at(-1),
    blocked = !ready || ['corrupt', 'unsupported', 'conflict', 'limit'].includes(issue ?? '');
  return (
    <section className="expanded-assessment">
      <h2 data-activity-heading tabIndex={-1}>
        {t.assessment}
      </h2>
      <p>{task.brief}</p>
      <p>{t.summaryNote}</p>
      {facts.active ? (
        <>
          <p>{t.draft}</p>
          {facts.assisted && <p role="status">{t.assisted}</p>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              store.event({ kind: 'submit' });
            }}
          >
            {task.items.map((q) => (
              <label key={q.id}>
                {q.question}
                {q.id === 'unmet' ? (
                  <input
                    aria-label={q.question}
                    type="number"
                    min={0}
                    max={12}
                    step={1}
                    required
                    value={facts.draft[q.id] ?? ''}
                    onChange={(e) =>
                      store.event({
                        kind: 'draft',
                        answers: { ...facts.draft, [q.id]: e.target.value },
                      })
                    }
                  />
                ) : (
                  <select
                    aria-label={q.question}
                    required
                    value={facts.draft[q.id] ?? ''}
                    onChange={(e) =>
                      store.event({
                        kind: 'draft',
                        answers: { ...facts.draft, [q.id]: e.target.value },
                      })
                    }
                  >
                    <option value="">{t.choose}</option>
                    {q.choices.map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                )}
              </label>
            ))}
            <button
              className="primary"
              disabled={blocked || Object.keys(criteria[track]).some((id) => !facts.draft[id])}
            >
              {t.submit}
            </button>
          </form>
          <button
            onClick={() => {
              if (store.event({ kind: 'aid' })) setHelp(true);
            }}
          >
            {t.hint}
          </button>
          {help && <p>{t.hintText}</p>}
          <button disabled={blocked} onClick={() => store.event({ kind: 'abandon' })}>
            {t.cancel}
          </button>
        </>
      ) : (
        <>
          <button
            disabled={blocked}
            onClick={() => {
              if (store.event({ kind: 'begin' })) setHelp(false);
            }}
          >
            {last ? t.newAttempt : t.begin}
          </button>
          {last && (
            <section className="expanded-assessment-feedback" role="status">
              <h3>{last.retry ? t.retry : last.assisted ? t.firstAssisted : t.first}</h3>
              <p>{t.submitted}</p>
              {task.items.map((q) => (
                <section key={q.id}>
                  <h4>{q.question}</h4>
                  <p>{last.criteria[q.id] ? nb.foundations.correct : nb.foundations.incorrect}</p>
                  <p>{q.explanation}</p>
                </section>
              ))}
            </section>
          )}
        </>
      )}
      {facts.attempts.some((a) => a.status === 'abandoned') && <p>{t.cancelledNote}</p>}
      <Link href={`/learn/${track}?topic=summary`}>{t.summary}</Link>
    </section>
  );
}
function ExpandedSummary({ track, technicalReady }: { track: Track; technicalReady: boolean }) {
  const { facts } = useExpansion(track, technicalReady);
  return (
    <section className="expanded-summary">
      <h2 data-activity-heading tabIndex={-1}>
        {t.summary}
      </h2>
      <p>{t.summaryNote}</p>
      <p>{facts.guidedComplete ? t.guidedComplete : t.guidedIncomplete}</p>
      <table>
        <thead>
          <tr>
            <th>{nb.course.learning}</th>
            <th>{t.introduced}</th>
            <th>{t.practiced}</th>
          </tr>
        </thead>
        <tbody>
          {trackUnits[track].map((unit) => (
            <tr key={unit}>
              <th>
                <Link href={`/learn/${track}?topic=${unit}`}>{manuscript(track, unit)!.title}</Link>
              </th>
              <td>{facts.introduced.has(unit) ? t.introduced : t.notYet}</td>
              <td>{facts.guided(unit) ? t.practiced : t.notYet}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>{t.assessment}</h3>
      {facts.submissions.length ? (
        facts.submissions.map((s) => (
          <p key={s.attempt}>
            #{s.attempt} · {s.retry ? t.retry : s.assisted ? t.firstAssisted : t.first} ·{' '}
            {Object.entries(s.criteria)
              .map(
                ([id, ok]) =>
                  `${nb.expansion[track].assessment.items.find((q) => q.id === id)?.question}: ${ok ? nb.foundations.correct : nb.foundations.incorrect}`,
              )
              .join(' · ')}
          </p>
        ))
      ) : (
        <p>{t.noAssessment}</p>
      )}
      {facts.attempts
        .filter((a) => a.status === 'abandoned')
        .map((a) => (
          <p key={a.number}>
            #{a.number} · {t.cancelled}
          </p>
        ))}
      <Link href={`/learn/${track}?topic=assessment`}>
        {facts.active ? t.resumeAssessment : t.assessment}
      </Link>
    </section>
  );
}
