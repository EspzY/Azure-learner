'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { costNb as c, nb } from '@/content/nb';
import {
  costMilestoneFacts,
  costLimit,
  costHref,
  guidedCostFacts,
  type CostMission,
  type CostRun,
  type CostGuided,
  type Prediction,
} from '@/domain/curriculum/cost';
import {
  allocateCost,
  analysisDimensions,
  analysisReferenceBudgets,
  costAnalysis,
  departments,
  environments,
  estimateCost,
  estimatePrediction,
  evaluateBudget,
  fixtureResources,
  initialEstimate,
  initialTags,
  validEstimate,
  type EstimateInput,
  type AnalysisDimension,
  type AnalysisScope,
  type BudgetInput,
  type TagInput,
  type TagValue,
} from '@/domain/curriculum/cost-model';
import { conceptMilestones } from '@/domain/guidance/milestones';
import {
  claimMilestone,
  milestonePreferenceKey,
  parseMilestonePreferences,
} from '@/domain/guidance/milestone-preferences';
import { inventory } from '@/domain/portal/model';
import { GuidanceWindow } from '@/features/course/guidance-window';
import { SavvyShark } from '@/features/course/savvy-shark';
import { useMissionSafety } from '@/features/course/mission-context';
import { MissionSafetyRecovery } from '@/features/course/missions';
import { useSandbox } from '@/features/portal/sandbox-provider';
import { ServiceIcon } from '@/features/portal/service-icon';
import { useCost } from './cost-provider';
import { CostBars, CostTrend, CostTable, costMoney } from './cost-visuals';
type RunAction = (run: CostRun) => boolean;
function PredictionResult({ prediction, actual }: { prediction: Prediction; actual: Prediction }) {
  return (
    <p className="cost-prediction-result">
      {c.workbench.predicted}:{' '}
      {c.controls.options.prediction[['lower', 'same', 'higher'].indexOf(prediction) + 1]} ·{' '}
      {c.workbench.observed}:{' '}
      {c.controls.options.prediction[['lower', 'same', 'higher'].indexOf(actual) + 1]}
    </p>
  );
}
export function CostWorkbench({ mission }: { mission: CostMission }) {
  const t = useCost(),
    safe = useMissionSafety(),
    copy = c.missions[mission],
    g = t.facts.guide?.mission === mission ? t.facts.guide : null;
  const [overlay, setOverlay] = useState<'brief' | 'time' | 'budget' | null>(null),
    [warning, setWarning] = useState(false),
    [failed, setFailed] = useState(false),
    [answer, setAnswer] = useState<number | null>(null);
  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (event.key !== null && event.key !== milestonePreferenceKey) return;
      setOverlay((current) => (current === 'brief' ? current : null));
      try {
        const preferences = parseMilestonePreferences(localStorage.getItem(milestonePreferenceKey));
        setWarning(!preferences || preferences.seen.length >= 256);
      } catch {
        setWarning(true);
      }
    };
    const reset = () => {
      setWarning(false);
      setOverlay(null);
    };
    window.addEventListener('storage', changed);
    window.addEventListener('azurelab:clear', reset);
    return () => {
      window.removeEventListener('storage', changed);
      window.removeEventListener('azurelab:clear', reset);
    };
  }, []);
  if (overlay && !safe) setOverlay(null);
  const run: RunAction = (event) => {
    const previous = costMilestoneFacts(t.store.getSnapshot().save);
    if (!safe || !t.store.event(event)) {
      setFailed(true);
      return false;
    }
    setFailed(false);
    const facts = costMilestoneFacts(t.store.getSnapshot().save),
      id =
        mission === 'estimate' && facts.time && !previous.time
          ? 'time'
          : mission === 'budgets' && facts.budget && !previous.budget
            ? 'budget'
            : null;
    if (id && !document.querySelector('dialog[open]')) {
      const definition = conceptMilestones[`cost-${id}`];
      const status = claimMilestone(
        localStorage,
        `cost-${id}@${definition.version}:cost-management`,
      );
      setWarning(status === 'unavailable');
      if (status === 'claimed') setOverlay(id);
    }
    return true;
  };
  const milestones = costMilestoneFacts(t.save);
  return (
    <section className="cost-workbench" aria-label={copy.title}>
      <header>
        <small>{c.workbench.subheading}</small>
        <h3>{copy.title}</h3>
        <p>{copy.situation}</p>
        <p>{copy.goal}</p>
      </header>
      {!safe ? (
        <div role="status">
          <p>{c.workbench.recallUnsafe}</p>
          <MissionSafetyRecovery />
        </div>
      ) : (
        <>
          <button className="cost-primary" onClick={() => setOverlay('brief')}>
            {g ? c.guided.recall : c.guided.brief}
          </button>
          {!g && <GuidedSwitchNotice mission={mission} />}
          {g && (
            <>
              <SavvyShark compact>
                <dl>
                  <div>
                    <dt>{c.guided.steps}</dt>
                    <dd>
                      {guidedCostFacts(g).complete
                        ? c.guided.done
                        : guidedCostFacts(g).witnessed
                          ? c.guided.answer
                          : copy.observe}
                    </dd>
                  </div>
                  <div>
                    <dt>{c.guided.witness}</dt>
                    <dd>
                      {g.runs.length
                        ? `${c.workbench.valid} · ${g.runs.length}`
                        : c.controls.noResult}
                    </dd>
                  </div>
                </dl>
              </SavvyShark>
              {mission === 'estimate' ? (
                <EstimateBench key={g.id} g={g} run={run} />
              ) : mission === 'analysis' ? (
                <AnalysisBench key={g.id} g={g} run={run} />
              ) : mission === 'budgets' ? (
                <BudgetBench key={g.id} g={g} run={run} />
              ) : (
                <TagBench key={g.id} g={g} run={run} />
              )}
              <form
                className="cost-explanation"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (answer === null || !t.store.event({ kind: 'explain', answer }))
                    setFailed(true);
                  else setFailed(false);
                }}
              >
                <h4>{c.guided.answer}</h4>
                <fieldset>
                  <legend>{copy.question}</legend>
                  {copy.answers.map((text, i) => (
                    <label key={text}>
                      <input
                        type="radio"
                        name={`cost-explain-${mission}`}
                        checked={answer === i}
                        onChange={() => setAnswer(i)}
                      />
                      <span>{text}</span>
                    </label>
                  ))}
                </fieldset>
                <button
                  disabled={
                    answer === null ||
                    !guidedCostFacts(g).witnessed ||
                    guidedCostFacts(g).complete ||
                    t.save.events.length >= costLimit
                  }
                >
                  {c.guided.submit}
                </button>
                {!guidedCostFacts(g).witnessed && <p>{c.workbench.incomplete}</p>}
                {g.answer !== null && (
                  <div role="status">
                    <strong>
                      {guidedCostFacts(g).complete ? c.guided.done : c.guided.missing}
                    </strong>
                    <p>{copy.reason}</p>
                  </div>
                )}
              </form>
            </>
          )}
          {milestones.time && (
            <button onClick={() => setOverlay('time')}>{c.milestone.title}</button>
          )}
          {milestones.budget && (
            <button onClick={() => setOverlay('budget')}>{c.milestone.budgetTitle}</button>
          )}
        </>
      )}
      {failed && <p role="alert">{c.storage.failed}</p>}
      {warning && <p role="status">{nb.milestones.storage}</p>}
      {safe && overlay && (
        <GuidanceWindow
          title={
            overlay === 'brief'
              ? copy.title
              : overlay === 'time'
                ? c.milestone.title
                : c.milestone.budgetTitle
          }
          onClose={() => setOverlay(null)}
          onStart={
            overlay === 'brief' && !g && !t.facts.full
              ? () => {
                  if (t.store.event({ kind: 'mission', mission })) {
                    setOverlay(null);
                    setFailed(false);
                  } else setFailed(true);
                }
              : undefined
          }
          notice={
            overlay === 'brief'
              ? g
                ? c.guided.reviewNotice
                : t.facts.full
                  ? c.storage.capacity
                  : c.guided.notice
              : c.milestone.notice
          }
        >
          <SavvyShark compact>
            <p>
              {overlay === 'brief'
                ? copy.situation
                : overlay === 'time'
                  ? c.milestone.text
                  : c.milestone.budgetText}
            </p>
          </SavvyShark>
          {overlay === 'brief' ? (
            <>
              {!g && <GuidedSwitchNotice mission={mission} />}
              <h3>{c.guided.prerequisite}</h3>
              <p>{c.prerequisite}</p>
              <h3>{c.guided.steps}</h3>
              <p>{copy.goal}</p>
              <h3>{c.guided.witness}</h3>
              <p>{copy.observe}</p>
              <p>{c.synthetic}</p>
            </>
          ) : (
            <p>{c.workbench.summary}</p>
          )}
          {failed && <p role="alert">{c.storage.failed}</p>}
        </GuidanceWindow>
      )}
    </section>
  );
}
function GuidedSwitchNotice({ mission }: { mission: CostMission }) {
  const t = useCost(),
    current = t.facts.guide,
    previous = t.facts.guided.some((g) => g.mission === mission);
  if (!current || current.mission === mission) return null;
  return (
    <aside className="cost-reference">
      {previous && <p>{c.guided.previous}</p>}
      <p>{c.guided.switch}</p>
      <p>
        {c.guided.current} {c.missions[current.mission].title}
      </p>
      <Link href={costHref(current.mission)}>{c.guided.continue}</Link>
    </aside>
  );
}
function NumberInput({
  label,
  value,
  min = 0,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="cost-control">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step="1"
        required
        value={value}
        onChange={(e) => {
          if (e.target.value !== '' && Number.isInteger(e.target.valueAsNumber))
            onChange(e.target.valueAsNumber);
        }}
      />
    </label>
  );
}
function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly (readonly [string, string])[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="cost-control">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
function PredictionControl({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="cost-run">
      <Select
        label={c.controls.prediction}
        value={value}
        options={['', 'lower', 'same', 'higher'].map((v, i) => [
          v,
          c.controls.options.prediction[i]!,
        ])}
        onChange={onChange}
      />
      <button className="cost-primary" disabled={!value || disabled}>
        {c.controls.run}
      </button>
    </div>
  );
}
function EstimateBench({ g, run }: { g: CostGuided; run: RunAction }) {
  const t = useCost(),
    saved =
      g.configuration?.mission === 'estimate'
        ? g.configuration
        : g.runs.findLast((r) => r.mission === 'estimate');
  const [input, setInput] = useState<EstimateInput>(saved?.input ?? { ...initialEstimate }),
    [prediction, setPrediction] = useState(''),
    [reference, setReference] = useState<EstimateInput>(saved?.baseline ?? { ...initialEstimate });
  const runs = g.runs.filter(
      (r): r is Extract<CostRun, { mission: 'estimate' }> => r.mission === 'estimate',
    ),
    last = runs.at(-1),
    result = last ? estimateCost(last.input) : null,
    baseline = last ? estimateCost(last.baseline) : null;
  const change = (patch: Partial<EstimateInput>) => {
    const next = { ...input, ...patch };
    if (next.service === 'paas' && next.pricing === 'spot') next.pricing = 'payg';
    if (
      validEstimate(next) &&
      t.store.event({ kind: 'configure', mission: 'estimate', input: next, baseline: reference })
    ) {
      setInput(next);
      setPrediction('');
    }
  };
  return (
    <>
      <p>{c.workbench.comparison}</p>
      <p>
        {c.comparisonReference}: {c.serviceLabels[reference.service]} · {reference.count} ×{' '}
        {reference.hours} ·{' '}
        {
          c.controls.options.pricing[
            ['payg', 'reservation', 'savings', 'spot'].indexOf(reference.pricing)
          ]
        }{' '}
        · {reference.storage} GB · {reference.egress} GB
      </p>
      <p>{c.predictionContexts.estimate}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (prediction)
            run({
              kind: 'run',
              mission: 'estimate',
              input,
              baseline: reference,
              prediction: prediction as Prediction,
            });
        }}
      >
        <div className="cost-estimate-layout">
          <fieldset className="cost-input-grid">
            <legend>{c.controls.service}</legend>
            <Select
              label={c.controls.service}
              value={input.service}
              options={['vm', 'paas'].map((v, i) => [v, c.controls.options.service[i]!])}
              onChange={(v) => change({ service: v as EstimateInput['service'] })}
            />
            <NumberInput
              label={c.controls.count}
              min={1}
              max={8}
              value={input.count}
              onChange={(count) => change({ count })}
            />
            <NumberInput
              label={c.controls.hours}
              max={720}
              value={input.hours}
              onChange={(hours) => change({ hours })}
            />
            <Select
              label={c.controls.size}
              value={input.size}
              options={['standard', 'large'].map((v, i) => [v, c.controls.options.size[i]!])}
              onChange={(v) => change({ size: v as EstimateInput['size'] })}
            />
            <Select
              label={c.controls.region}
              value={input.region}
              options={['west', 'north'].map((v, i) => [v, c.controls.options.region[i]!])}
              onChange={(v) => change({ region: v as EstimateInput['region'] })}
            />
            <Select
              label={c.controls.pricing}
              value={input.pricing}
              options={['payg', 'reservation', 'savings', 'spot']
                .filter((v) => input.service === 'vm' || v !== 'spot')
                .map((v) => [
                  v,
                  c.controls.options.pricing[
                    ['payg', 'reservation', 'savings', 'spot'].indexOf(v)
                  ]!,
                ])}
              onChange={(v) => change({ pricing: v as EstimateInput['pricing'] })}
            />
            <NumberInput
              label={c.controls.storage}
              max={2000}
              value={input.storage}
              onChange={(storage) => change({ storage })}
            />
            <NumberInput
              label={c.controls.operations}
              max={1000}
              value={input.operations}
              onChange={(operations) => change({ operations })}
            />
            <NumberInput
              label={c.controls.egress}
              max={5000}
              value={input.egress}
              onChange={(egress) => change({ egress })}
            />
            <Select
              label={c.controls.license}
              value={String(input.license)}
              options={['false', 'true'].map((v, i) => [v, c.controls.options.license[i]!])}
              onChange={(v) => change({ license: v === 'true' })}
            />
            <Select
              label={c.controls.support}
              value={String(input.support)}
              options={['false', 'true'].map((v, i) => [v, c.controls.options.support[i]!])}
              onChange={(v) => change({ support: v === 'true' })}
            />
            <Select
              label={c.controls.scope}
              value={input.scope}
              options={['app', 'shared'].map((v) => [v, c.scopeLabels[v as 'app' | 'shared']])}
              onChange={(v) => change({ scope: v as EstimateInput['scope'] })}
            />
          </fieldset>
          <aside className="cost-rate-notes">
            <h4>{c.workbench.estimateNotes}</h4>
            <ul>
              {c.modelNotes.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </aside>
        </div>
        <p>{c.workbench.copyDraft}</p>
        <PredictionControl value={prediction} onChange={setPrediction} disabled={t.facts.full} />
      </form>
      {result && last ? (
        <section className="cost-observation" aria-label={c.workbench.observed}>
          <p role="status">
            {c.workbench.valid} · {c.workbench.predicted}:{' '}
            {
              c.controls.options.prediction[
                ['lower', 'same', 'higher'].indexOf(last.prediction) + 1
              ]
            }
          </p>
          <PredictionResult
            prediction={last.prediction}
            actual={estimatePrediction(last.baseline, last.input)!}
          />
          {(JSON.stringify(last.input) !== JSON.stringify(input) ||
            JSON.stringify(last.baseline) !== JSON.stringify(reference)) && (
            <p className="cost-stale">{c.controls.stale}</p>
          )}
          <div className="cost-totals">
            <div>
              <small>{c.controls.b}</small>
              <strong>{costMoney(result.cents)}</strong>
            </div>
            {baseline && (
              <>
                <div>
                  <small>{c.controls.a}</small>
                  <strong>{costMoney(baseline.cents)}</strong>
                </div>
                <div>
                  <small>{c.controls.change}</small>
                  <strong>{costMoney(result.cents - baseline.cents)}</strong>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => {
              if (
                t.store.event({
                  kind: 'configure',
                  mission: 'estimate',
                  input,
                  baseline: last.input,
                })
              ) {
                setReference(last.input);
                setPrediction('');
              }
            }}
          >
            {c.controls.compare}
          </button>
          <CostBars
            title={c.controls.breakdown}
            rows={result.lines.map((l) => ({
              key: l.id,
              cents: l.cents,
              label: c.components[l.id],
            }))}
          />
          <CostTable label={c.controls.subtotal}>
            <table>
              <caption>
                {c.controls.subtotal} · {c.scopeLabels[last.input.scope]} /{' '}
                {last.input.scope === 'app' ? 'rg-catalog' : 'rg-shared'}
              </caption>
              <thead>
                <tr>
                  {[
                    c.controls.line,
                    c.controls.driver,
                    c.controls.quantity,
                    c.controls.rate,
                    c.controls.fixed,
                    c.controls.total,
                  ].map((s) => (
                    <th key={s}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.lines.map((l) => (
                  <tr key={l.id}>
                    <th>{c.components[l.id]}</th>
                    <td>{c.unitLabels[l.unit]}</td>
                    <td>{l.quantity}</td>
                    <td>
                      {new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 4 }).format(
                        l.rateCents / 100,
                      )}
                    </td>
                    <td>{costMoney(l.fixedCents)}</td>
                    <td>{costMoney(l.cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CostTable>
          <p>{c.workbench.summary}</p>
        </section>
      ) : (
        <p>{c.controls.noResult}</p>
      )}
      <ResourceReference />
    </>
  );
}
function AnalysisBench({ g, run }: { g: CostGuided; run: RunAction }) {
  const t = useCost(),
    saved =
      g.configuration?.mission === 'analysis'
        ? g.configuration
        : g.runs.findLast((r) => r.mission === 'analysis');
  const [scope, setScope] = useState<AnalysisScope>(saved?.input.scope ?? 'all'),
    [dimension, setDimension] = useState<AnalysisDimension>(saved?.input.dimension ?? 'component'),
    [prediction, setPrediction] = useState('');
  const last = g.runs.findLast(
      (r): r is Extract<CostRun, { mission: 'analysis' }> => r.mission === 'analysis',
    ),
    data = last ? costAnalysis(last.input.scope, last.input.dimension) : null;
  const change = (s: AnalysisScope, d: AnalysisDimension) => {
    if (
      t.store.event({ kind: 'configure', mission: 'analysis', input: { scope: s, dimension: d } })
    ) {
      setScope(s);
      setDimension(d);
      setPrediction('');
    }
  };
  const label = (key: string) =>
    key in c.components
      ? c.components[key as keyof typeof c.components]
      : key in c.serviceLabels
        ? c.serviceLabels[key as keyof typeof c.serviceLabels]
        : key in c.scopeLabels
          ? c.scopeLabels[key as keyof typeof c.scopeLabels]
          : key;
  return (
    <>
      <p>{c.analysis.period}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (prediction)
            run({
              kind: 'run',
              mission: 'analysis',
              input: { scope, dimension },
              prediction: prediction as Prediction,
            });
        }}
      >
        <div className="cost-input-grid">
          <Select
            label={c.controls.scope}
            value={scope}
            options={['all', 'app', 'shared'].map((v) => [v, c.scopeLabels[v as AnalysisScope]])}
            onChange={(v) => change(v as AnalysisScope, dimension)}
          />
          <Select
            label={c.analysis.groupBy}
            value={dimension}
            options={analysisDimensions.map((v, i) => [v, c.analysis.dimensions[i]!])}
            onChange={(v) => change(scope, v as AnalysisDimension)}
          />
        </div>
        <p>{c.predictionContexts.analysis}</p>
        <PredictionControl value={prediction} onChange={setPrediction} disabled={t.facts.full} />
      </form>
      {data && last ? (
        <section className="cost-observation">
          <p role="status">
            {c.workbench.valid} · {c.scopeLabels[last.input.scope]}
          </p>
          <PredictionResult
            prediction={last.prediction}
            actual={
              data.groups.reduce((s, g) => s + g.delta, 0) > 0
                ? 'higher'
                : data.groups.reduce((s, g) => s + g.delta, 0) < 0
                  ? 'lower'
                  : 'same'
            }
          />
          {(last.input.scope !== scope || last.input.dimension !== dimension) && (
            <p>{c.controls.stale}</p>
          )}
          <CostBars
            title={c.analysis.later}
            rows={data.groups.map((g) => ({ key: g.key, cents: g.later, label: label(g.key) }))}
          />
          <CostTable label={c.analysis.delta}>
            <table>
              <caption>{c.analysis.delta}</caption>
              <thead>
                <tr>
                  <th>{c.controls.line}</th>
                  <th>{c.analysis.earlier}</th>
                  <th>{c.analysis.later}</th>
                  <th>{c.analysis.delta}</th>
                </tr>
              </thead>
              <tbody>
                {data.groups.map((g) => (
                  <tr key={g.key}>
                    <th>{label(g.key)}</th>
                    <td>{costMoney(g.earlier)}</td>
                    <td>{costMoney(g.later)}</td>
                    <td>{costMoney(g.delta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CostTable>
          <p>{c.analysis.explanation}</p>
          <p>{c.analysis.budgetAssumption}</p>
          <CostTrend scope={last.input.scope} budget={analysisReferenceBudgets[last.input.scope]} />
          <div
            className="cost-data-scroll"
            tabIndex={0}
            role="region"
            aria-label={c.workbench.allRows}
          >
            <table>
              <caption>{c.analysis.detail}</caption>
              <thead>
                <tr>
                  {[
                    c.analysis.date,
                    c.controls.line,
                    c.controls.driver,
                    c.controls.quantity,
                    c.controls.rate,
                    c.controls.total,
                  ].map((s) => (
                    <th key={s}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.id}>
                    <th>
                      {r.date} · {r.resource}
                    </th>
                    <td>{c.components[r.component]}</td>
                    <td>{c.unitLabels[r.unit]}</td>
                    <td>{r.quantity}</td>
                    <td>{costMoney(r.rateCents)}</td>
                    <td>{costMoney(r.cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <p>{c.controls.noResult}</p>
      )}
    </>
  );
}
function BudgetBench({ g, run }: { g: CostGuided; run: RunAction }) {
  const t = useCost(),
    saved =
      g.configuration?.mission === 'budgets'
        ? g.configuration
        : g.runs.findLast((r) => r.mission === 'budgets');
  const [input, setInput] = useState<BudgetInput>(
      saved?.input ?? { scope: 'app', amount: 600, percent: 80, type: 'actual' },
    ),
    [prediction, setPrediction] = useState('');
  const last = g.runs.findLast(
      (r): r is Extract<CostRun, { mission: 'budgets' }> => r.mission === 'budgets',
    ),
    result = last ? evaluateBudget(last.input) : null;
  const change = (patch: Partial<BudgetInput>) => {
    const next = { ...input, ...patch };
    if (t.store.event({ kind: 'configure', mission: 'budgets', input: next })) {
      setInput(next);
      setPrediction('');
    }
  };
  return (
    <>
      <p>{c.workbench.budgetBoth}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (prediction)
            run({ kind: 'run', mission: 'budgets', input, prediction: prediction as Prediction });
        }}
      >
        <div className="cost-input-grid">
          <Select
            label={c.controls.scope}
            value={input.scope}
            options={['app', 'shared'].map((v) => [v, c.scopeLabels[v as 'app' | 'shared']])}
            onChange={(v) => change({ scope: v as BudgetInput['scope'] })}
          />
          <NumberInput
            label={c.budget.amount}
            value={input.amount}
            min={1}
            max={100000}
            onChange={(amount) => change({ amount })}
          />
          <Select
            label={c.budget.type}
            value={input.type}
            options={['actual', 'forecast'].map((v, i) => [v, c.budget.types[i]!])}
            onChange={(v) => change({ type: v as BudgetInput['type'] })}
          />
          <NumberInput
            label={c.budget.threshold}
            value={input.percent}
            min={1}
            max={200}
            onChange={(percent) => change({ percent })}
          />
        </div>
        <p>{c.predictionContexts.budgets}</p>
        <PredictionControl value={prediction} onChange={setPrediction} disabled={t.facts.full} />
      </form>
      {result && last ? (
        <section className="cost-observation">
          <p role="status">{result.triggered ? c.budget.yes : c.budget.no}</p>
          <PredictionResult
            prediction={last.prediction}
            actual={
              result.observed < result.thresholdCents
                ? 'lower'
                : result.observed > result.thresholdCents
                  ? 'higher'
                  : 'same'
            }
          />
          {JSON.stringify(last.input) !== JSON.stringify(input) && <p>{c.controls.stale}</p>}
          <div className="cost-totals">
            <div>
              <small>{c.analysis.observed}</small>
              <strong>{costMoney(result.cents)}</strong>
            </div>
            <div>
              <small>{c.analysis.forecast}</small>
              <strong>{costMoney(result.forecast)}</strong>
            </div>
            <div>
              <small>
                {c.budget.threshold} · {last.input.percent}%
              </small>
              <strong>{costMoney(result.thresholdCents)}</strong>
            </div>
          </div>
          <p>
            {c.budget.types[last.input.type === 'actual' ? 0 : 1]}: {costMoney(result.observed)}{' '}
            {result.triggered ? '≥' : '<'} {costMoney(result.thresholdCents)}
          </p>
          <CostTrend scope={last.input.scope} budget={last.input.amount} />
          <p>{c.budget.consequence}</p>
        </section>
      ) : (
        <p>{c.controls.noResult}</p>
      )}
    </>
  );
}
function TagBench({ g, run }: { g: CostGuided; run: RunAction }) {
  const t = useCost(),
    saved =
      g.configuration?.mission === 'tags'
        ? g.configuration
        : g.runs.findLast((r) => r.mission === 'tags');
  const [input, setInput] = useState<TagInput>(saved?.input ?? initialTags()),
    [prediction, setPrediction] = useState(''),
    [dimension, setDimension] = useState<'department' | 'environment'>('department');
  const last = g.runs.findLast(
      (r): r is Extract<CostRun, { mission: 'tags' }> => r.mission === 'tags',
    ),
    result = last ? allocateCost(last.input, dimension) : null;
  const change = (next: TagInput) => {
    if (t.store.event({ kind: 'configure', mission: 'tags', input: next })) {
      setInput(next);
      setPrediction('');
    }
  };
  return (
    <>
      <p>{c.workbench.tagsBoth}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (prediction)
            run({ kind: 'run', mission: 'tags', input, prediction: prediction as Prediction });
        }}
      >
        <Select
          label={c.tags.inheritance}
          value={input.mode}
          options={['off', 'keep-resource', 'prefer-parent'].map((v, i) => [v, c.tags.modes[i]!])}
          onChange={(mode) => change({ ...input, mode: mode as TagInput['mode'] })}
        />
        <div className="cost-tag-editors">
          {fixtureResources.map((id) => (
            <fieldset key={id}>
              <legend>{id}</legend>
              <Select
                label={`${c.tags.direct} · ${id}`}
                value={input.values[id].department}
                options={departments.map((v, i) => [v, c.tags.departments[i]!])}
                onChange={(v) =>
                  change({
                    ...input,
                    values: {
                      ...input.values,
                      [id]: { ...input.values[id], department: v as TagValue['department'] },
                    },
                  })
                }
              />
              <Select
                label={`${c.tags.environment} · ${id}`}
                value={input.values[id].environment}
                options={environments.map((v, i) => [v, c.tags.environments[i]!])}
                onChange={(v) =>
                  change({
                    ...input,
                    values: {
                      ...input.values,
                      [id]: { ...input.values[id], environment: v as TagValue['environment'] },
                    },
                  })
                }
              />
              {id === 'fixture-transfer' && <p>{c.tags.unsupported}</p>}
            </fieldset>
          ))}
        </div>
        <p>{c.predictionContexts.tags}</p>
        <PredictionControl value={prediction} onChange={setPrediction} disabled={t.facts.full} />
      </form>
      {result && last ? (
        <section className="cost-observation">
          <p role="status">
            {c.workbench.valid} · {c.tags.total}: <strong>{costMoney(result.cents)}</strong>
          </p>
          <PredictionResult prediction={last.prediction} actual="same" />
          {JSON.stringify(last.input) !== JSON.stringify(input) && <p>{c.controls.stale}</p>}
          <Select
            label={c.tags.groupBy}
            value={dimension}
            options={[
              ['department', c.tags.department],
              ['environment', c.tags.environment],
            ]}
            onChange={(v) => setDimension(v as typeof dimension)}
          />
          <CostBars
            title={c.tags.groupBy}
            rows={result.groups.map((g) => ({ ...g, label: g.key || c.tags.unassigned }))}
          />
          <CostTable label={c.tags.boundary}>
            <table>
              <caption>{c.tags.boundary}</caption>
              <thead>
                <tr>
                  <th>{c.tags.resource}</th>
                  <th>{c.tags.direct}</th>
                  <th>{c.tags.parent}</th>
                  <th>{c.tags.reporting}</th>
                  <th>{c.controls.total}</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => (
                  <tr key={r.id}>
                    <th>{r.id}</th>
                    <td>{r.direct.department || c.tags.unassigned}</td>
                    <td>{r.parent.department}</td>
                    <td>{r.report.department || c.tags.unassigned}</td>
                    <td>{costMoney(r.cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CostTable>
        </section>
      ) : (
        <p>{c.controls.noResult}</p>
      )}
    </>
  );
}
function ResourceReference() {
  const s = useSandbox(),
    [selected, setSelected] = useState('');
  const rows = inventory(s.attempt.engine.world).filter((r) =>
    ['vm', 'app', 'plan', 'group'].includes(r.kind),
  );
  const row = rows.find((r) => r.id === selected);
  return (
    <section className="cost-resource-reference">
      <h4>{c.reference.title}</h4>
      <p>{c.reference.text}</p>
      {s.issue ? (
        <p>{c.reference.unsupported}</p>
      ) : !rows.length ? (
        <p>{c.reference.empty}</p>
      ) : (
        <>
          <Select
            label={c.workbench.selectResource}
            value={selected}
            options={[['', c.workbench.noSelection], ...rows.map((r) => [r.id, r.name] as const)]}
            onChange={setSelected}
          />
          {row && (
            <>
              <ServiceIcon kind={row.kind} size={24} />
              <dl>
                <div>
                  <dt>{c.workbench.name}</dt>
                  <dd>{row.name}</dd>
                </div>
                <div>
                  <dt>{c.workbench.type}</dt>
                  <dd>{row.type}</dd>
                </div>
                <div>
                  <dt>{c.workbench.location}</dt>
                  <dd>{row.location ?? '—'}</dd>
                </div>
              </dl>
              <p>{c.reference.unknown}</p>
              <a
                href={`/portal?area=resource&id=${encodeURIComponent(row.id)}`}
                target="_blank"
                rel="noreferrer"
              >
                {c.reference.open}
              </a>
            </>
          )}
        </>
      )}
    </section>
  );
}
