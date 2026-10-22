'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { nb, questions } from '@/content/nb';
import { answerKey, scoreAssessment, type Answers } from '@/domain/assessment';
import { useProgress } from '@/components/progress-provider';

export function Assessment({ onComplete }: { onComplete: (xp: number) => void }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const fieldset = useRef<HTMLFieldSetElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (submitted) resultHeading.current?.focus();
    else fieldset.current?.focus();
  }, [index, submitted]);
  const { progress, award, ready } = useProgress();
  const question = questions[index]!;
  const score = scoreAssessment(answers);
  if (submitted)
    return (
      <section className="assessment-results">
        <span className={`result-emblem ${score.passed ? 'passed' : ''}`}>
          <CheckCircle2 size={35} />
        </span>
        <p className="eyebrow">{nb.assessment.eyebrow}</p>
        <h3 ref={resultHeading} tabIndex={-1}>
          {score.passed ? nb.assessment.passed : nb.assessment.failed}
        </h3>
        <p className="result-count" role="status">
          {score.correct} / {score.total} {nb.assessment.result}
        </p>
        <div className="answer-review">
          {questions.map((item, i) => (
            <div
              key={item.id}
              className={`answer-feedback ${answers[item.id] === answerKey[item.id] ? 'correct' : 'incorrect'}`}
            >
              <strong>
                0{i + 1} ·{' '}
                {answers[item.id] === answerKey[item.id]
                  ? nb.assessment.correct
                  : nb.assessment.incorrect}
              </strong>
              <p>{item.options.find((option) => option.id === answers[item.id])?.explanation}</p>
            </div>
          ))}
        </div>
        <p className="reflection">{nb.assessment.reflection}</p>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => {
            setAnswers({});
            setIndex(0);
            setSubmitted(false);
          }}
        >
          <RotateCcw size={16} />
          {nb.assessment.retry}
        </button>
        <p className="assessment-evidence">{nb.assessment.evidence}</p>
      </section>
    );
  return (
    <form
      className="assessment-command"
      onSubmit={(event) => {
        event.preventDefault();
        if (index < questions.length - 1) {
          setIndex(index + 1);
          return;
        }
        setSubmitted(true);
        if (score.passed) {
          const already = progress.completed.includes('organization-check-v1');
          award('organization-check-v1');
          onComplete(already ? 0 : 40);
        }
      }}
    >
      <div className="check-progress">
        <span>
          {nb.universe.assessmentCount} {index + 1} / {questions.length}
        </span>
        <div>
          {questions.map((item, i) => (
            <i key={item.id} className={i <= index ? 'active' : ''} />
          ))}
        </div>
        <span>+40 XP</span>
      </div>
      <fieldset className="question-card" key={question.id} ref={fieldset} tabIndex={-1}>
        <legend>
          <span className="question-number">0{index + 1}</span>
          {question.prompt}
        </legend>
        <div className="options">
          {question.options.map((option) => (
            <label
              key={option.id}
              className={`answer-option ${answers[question.id] === option.id ? 'chosen' : ''}`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.id}
                required
                checked={answers[question.id] === option.id}
                onChange={() =>
                  setAnswers((previous) => ({ ...previous, [question.id]: option.id }))
                }
              />
              <span>{option.text}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="assessment-actions">
        {index > 0 && (
          <button
            type="button"
            className="icon-button"
            aria-label={nb.universe.backQuestion}
            onClick={() => setIndex(index - 1)}
          >
            <ArrowLeft size={19} />
          </button>
        )}
        <button
          type="submit"
          className="button button-primary"
          disabled={!ready || !answers[question.id]}
        >
          {index < questions.length - 1 ? nb.universe.nextQuestion : nb.universe.finishCheck}
          <ArrowRight size={17} />
        </button>
      </div>
      <p className="assessment-evidence">{nb.assessment.evidence}</p>
    </form>
  );
}
