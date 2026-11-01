'use client';
import { monitoringNb as c } from '@/content/nb';
import {
  evidenceQuestions,
  evidenceTools,
  evidenceSignals,
  type MonitoringInput,
} from '@/domain/curriculum/monitoring-model';
export function MonitoringControls({
  input,
  change,
}: {
  input: MonitoringInput;
  change: (v: MonitoringInput) => void;
}) {
  const select = (key: keyof typeof c.options, allowed?: readonly string[]) => {
    const options = c.options[key];
    return (
      <label className="compute-control" key={key}>
        <span>{c.controls[key]}</span>
        <select
          value={String((input as unknown as Record<string, unknown>)[key])}
          onChange={(e) =>
            change({
              ...input,
              [key]: ['window', 'threshold'].includes(key)
                ? Number(e.target.value)
                : e.target.value,
            } as MonitoringInput)
          }
        >
          {Object.entries(options)
            .filter(([v]) => !allowed || allowed.includes(v))
            .map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
        </select>
      </label>
    );
  };
  const check = (key: keyof typeof c.controls) => (
    <label className="storage-check" key={key}>
      <input
        type="checkbox"
        checked={Boolean((input as unknown as Record<string, unknown>)[key])}
        onChange={(e) => change({ ...input, [key]: e.target.checked } as MonitoringInput)}
      />
      <span>{c.controls[key]}</span>
    </label>
  );
  if (input.kind === 'evidence')
    return (
      <>
        {select('question', evidenceQuestions)}
        {select('tool', evidenceTools)}
        {select('signal', evidenceSignals)}
        {check('dataReady')}
        {check('fresh')}
      </>
    );
  if (input.kind === 'health')
    return (
      <>
        {(
          [
            'subscription',
            'region',
            'resourceType',
            'event',
            'inspection',
            'health',
            'appObservation',
          ] as const
        ).map((k) => select(k))}
        {check('publicNotice')}
        {check('supported')}
      </>
    );
  return (
    <>
      <div className="monitoring-control-group">
        <h5>{c.visual.metricControls}</h5>
        {select('fixture')}
        {select('signal', ['cpu', 'duration'])}
        {select('coverage')}
        {select('aggregation')}
        {select('window')}
        {select('threshold')}
      </div>
      <div className="monitoring-control-group">
        <h5>{c.visual.alertControls}</h5>
        {select('rule')}
        {select('ruleSignal')}
        {check('actionGroup')}
      </div>
      <div className="monitoring-control-group">
        <h5>{c.visual.logControls}</h5>
        {select('logSource')}
        {select('filter')}
        {check('routed')}
        {check('instrumented')}
        {check('access')}
      </div>
    </>
  );
}
