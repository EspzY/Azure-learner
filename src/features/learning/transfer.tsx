'use client';
import { nb } from '@/content/nb';
import { useLearning } from './provider';
import { transferCriteria } from '@/domain/curriculum/manifest';
const t = nb.foundations;
const numericItems = new Set<string>(
  transferCriteria.filter((c) => 'input' in c && c.input === 'number').map((c) => c.id),
);
export function TransferAssessment() {
  const { store, facts, issue } = useLearning();
  const answers = facts.draft;
  const setAnswers = (draft: Record<string, string>) =>
    store.event({ kind: 'draft', answers: draft });
  const last = facts.submissions.at(-1);
  return (
    <section className="learning-transfer">
      <h3 tabIndex={-1} data-lesson-focus>
        {t.transfer}
      </h3>
      <p>{t.transferIntro}</p>
      <p>{t.transferRules}</p>
      {facts.assisted && <p role="status">{t.aid}</p>}
      {facts.active ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            store.event({ kind: 'submit', answers });
          }}
        >
          {t.transferItems.map((item) => (
            <fieldset key={item.id}>
              <legend>{item.question}</legend>
              {numericItems.has(item.id) ? (
                <input
                  type="number"
                  name={`transfer-${item.id}`}
                  aria-label={item.question}
                  required
                  min="0"
                  max="40"
                  step="1"
                  value={answers[item.id] ?? ''}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [item.id]: Number.isFinite(e.target.valueAsNumber)
                        ? String(e.target.valueAsNumber)
                        : '',
                    })
                  }
                />
              ) : (
                item.choices.map(([id, label]) => (
                  <label key={id}>
                    <input
                      required
                      type="radio"
                      name={`transfer-${item.id}`}
                      value={id}
                      checked={answers[item.id] === id}
                      onChange={() => setAnswers({ ...answers, [item.id]: id })}
                    />
                    {label}
                  </label>
                ))
              )}
            </fieldset>
          ))}
          <button
            type="submit"
            disabled={
              Object.keys(answers).length !== t.transferItems.length ||
              ['corrupt', 'unsupported', 'conflict', 'limit'].includes(issue ?? '')
            }
          >
            {t.submit}
          </button>
        </form>
      ) : (
        last && (
          <>
            <p role="status">{t.submitted}</p>
            <strong>
              {last.retry ? t.retryResult : last.assisted ? t.assisted : t.independent}
            </strong>
            {t.transferItems.map((item) => (
              <section key={item.id} className="learning-feedback">
                <h4>{item.question}</h4>
                <p>
                  {item.choices.find(([id]) => id === last.answers[item.id])?.[1] ??
                    last.answers[item.id]}
                </p>
                <strong>{last.criteria[item.id] ? t.correct : t.incorrect}</strong>
                <p>{item.explanation}</p>
              </section>
            ))}
            <button
              type="button"
              onClick={() => {
                store.event({ kind: 'begin-transfer' });
              }}
            >
              {t.retry}
            </button>
          </>
        )
      )}
    </section>
  );
}
