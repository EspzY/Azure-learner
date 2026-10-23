'use client';
import { nb } from '@/content/nb';
import { unitIds, units, sourceUrl, type UnitId } from '@/domain/curriculum/manifest';
import { CommandDialog } from '@/components/command-dialog';
import './learning.css';
import { LearningDiagram } from './diagram';
import { initialProbe } from '@/domain/curriculum/foundations';
const t = nb.foundations;
export function KnowledgeJournal({
  unit,
  onUnit,
  onClose,
}: {
  unit: UnitId;
  onUnit: (unit: UnitId) => void;
  onClose: () => void;
}) {
  const c = t.units[unit],
    definition = units.find((u) => u.id === unit)!;
  return (
    <CommandDialog title={t.journal} onClose={onClose} wide>
      <div className="knowledge-journal">
        <p>{t.journalHint}</p>
        <label>
          {t.module}
          <select
            aria-label={t.module}
            value={unit}
            onChange={(e) => onUnit(e.target.value as UnitId)}
          >
            {unitIds.map((id) => (
              <option key={id} value={id}>
                {t.units[id].title}
              </option>
            ))}
          </select>
        </label>
        <article key={unit} tabIndex={-1}>
          <p className="eyebrow">{definition.objectives.join(' · ')}</p>
          <h3>{c.title}</h3>
          <LearningDiagram
            unit={unit}
            input={{
              ...initialProbe,
              ...(unit === 'metering' ? { profile: 'idle', mode: 'cloud' } : {}),
              ...(unit === 'models' || unit === 'placement' ? { topology: 'hybrid' } : {}),
            }}
          />
          <p>{t.assumptions}</p>
          <section>
            <h4>{t.definition}</h4>
            <dl>
              {c.terms.map(([term, meaning]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{meaning}</dd>
                </div>
              ))}
            </dl>
          </section>
          {(['purpose', 'mechanism', 'azure', 'example', 'misconception', 'limits'] as const).map(
            (key) => (
              <section key={key}>
                <h4>{t[key]}</h4>
                <p>{c[key]}</p>
              </section>
            ),
          )}
          <section>
            <h4>{t.sources}</h4>
            <ul>
              {definition.sources.map((id) => (
                <li key={id}>
                  <a href={sourceUrl(id)} target="_blank" rel="noreferrer">
                    {id} · {t.sourcePublisher} ↗
                  </a>
                </li>
              ))}
            </ul>
            <p>{t.reviewed}</p>
          </section>
        </article>
        <button type="button" className="button button-secondary" onClick={onClose}>
          {t.close}
        </button>
      </div>
    </CommandDialog>
  );
}
