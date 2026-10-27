'use client';
import { useState } from 'react';
import { missionsNb as c } from '@/content/nb';
import { diagnose, type DiagnosisInput } from '@/domain/sandbox/missions';
import { replayEngine } from '@/domain/sandbox/replay';
import { ServiceIcon } from '@/features/portal/service-icon';
import { useMissionResult, useMissionSafety } from './mission-context';
export function DiagnosisExplorer() {
  const { m, s, engine, technical } = useMissionResult(),
    safe = useMissionSafety();
  const [input, setInput] = useState<DiagnosisInput>({
      failure: 'subnet',
      copies: 2,
      isolation: 'shared',
      routing: 'balanced',
    }),
    [prediction, setPrediction] = useState('');
  if (!s) return null;
  const last = s.runs.filter((r) => r.target === s.target).at(-1),
    at = last?.through
      ? engine.ledger.findIndex((e) => e.receipt.commandId === last.through) + 1
      : 0;
  const snapshot = last ? replayEngine(engine, at) : null,
    observed = last && snapshot ? diagnose(snapshot.world, last.target, last.input) : null;
  const set = (next: DiagnosisInput) => {
    setInput(next);
    setPrediction('');
  };
  return (
    <section className="mission-diagnosis">
      <h3>{c.model.title}</h3>
      <p>{c.model.note}</p>
      {s.runs.length >= 24 && <p role="status">{c.model.limit}</p>}
      <div className="mission-model-controls">
        <label>
          {c.model.failure}
          <select
            value={input.failure}
            onChange={(e) =>
              set({ ...input, failure: e.target.value as DiagnosisInput['failure'] })
            }
          >
            {Object.entries(c.model.failures).map(([id, text]) => (
              <option key={id} value={id}>
                {text}
              </option>
            ))}
          </select>
        </label>
        <label>
          {c.model.copies}
          <select
            value={input.copies}
            onChange={(e) => set({ ...input, copies: Number(e.target.value) as 1 | 2 })}
          >
            <option>1</option>
            <option>2</option>
          </select>
        </label>
        <label>
          {c.model.isolation}
          <select
            value={input.isolation}
            onChange={(e) =>
              set({ ...input, isolation: e.target.value as DiagnosisInput['isolation'] })
            }
          >
            {Object.entries(c.model.isolations).map(([id, text]) => (
              <option key={id} value={id}>
                {text}
              </option>
            ))}
          </select>
        </label>
        <label>
          {c.model.routing}
          <select
            value={input.routing}
            onChange={(e) =>
              set({ ...input, routing: e.target.value as DiagnosisInput['routing'] })
            }
          >
            {Object.entries(c.model.routings).map(([id, text]) => (
              <option key={id} value={id}>
                {text}
              </option>
            ))}
          </select>
        </label>
        <label>
          {c.model.prediction}
          <select value={prediction} onChange={(e) => setPrediction(e.target.value)}>
            <option value="">{c.model.choose}</option>
            {[0, 1, 2].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={
            !safe ||
            !!m.issue ||
            !!technical.issue ||
            !s.target ||
            prediction === '' ||
            s.runs.length >= 24 ||
            m.save.events.length >= 600
          }
          onClick={() => {
            if (s.target)
              m.store.event({
                type: 'run',
                run: {
                  target: s.target,
                  through: engine.ledger.at(-1)?.receipt.commandId ?? null,
                  input,
                  prediction: Number(prediction),
                },
              });
          }}
        >
          {c.model.run}
        </button>
      </div>
      {observed && last && (
        <div className="mission-model-result" role="status">
          <h4>{c.model.result}</h4>
          {JSON.stringify(last.input) !== JSON.stringify(input) && <p>{c.model.stale}</p>}
          <p>
            {c.model.failures[last.input.failure]} · {last.input.copies} ·{' '}
            {c.model.isolations[last.input.isolation]} · {c.model.routings[last.input.routing]}
          </p>
          <p>
            {c.model.predicted}: {last.prediction} · {c.model.actual}: {observed.usable}
          </p>
          <div className="mission-paths" aria-hidden="true">
            {observed.paths.map((p) => (
              <div key={p.path} className={p.usable ? 'path-usable' : 'path-lost'}>
                <span>
                  {c.model.path} {p.path}
                </span>
                <div className="mission-dependency-tree">
                  <span className="mission-vm-node">
                    <ServiceIcon kind="vm" size={28} /> {c.model.vm}
                  </span>
                  <span className="mission-disk-node">{c.model.disk}</span>
                  <span className="mission-network-node">{c.model.network}</span>
                </div>
                <strong>
                  {p.affected ? c.model.affected : p.usable ? c.model.usable : c.model.unused}
                </strong>
              </div>
            ))}
          </div>
          <table>
            <caption>{c.model.result}</caption>
            <thead>
              <tr>
                <th>{c.model.path}</th>
                <th>{c.model.affected}</th>
                <th>{c.model.routed}</th>
                <th>{c.model.usable}</th>
              </tr>
            </thead>
            <tbody>
              {observed.paths.map((p) => (
                <tr key={p.path}>
                  <th>{p.path}</th>
                  <td>{p.affected ? c.model.yes : c.model.no}</td>
                  <td>{p.routed ? c.model.yes : c.model.no}</td>
                  <td>{p.usable ? 1 : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {s.mode === 'guided' && <p>{c.model.explain}</p>}
        </div>
      )}
    </section>
  );
}
