'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleHelp } from 'lucide-react';
import { nb, questions } from '@/content/nb';
import { answerKey, scoreAssessment, type Answers } from '@/domain/assessment';
import { useProgress } from '@/components/progress-provider';

export function Assessment({ unlocked }: { unlocked: boolean }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const { award, ready } = useProgress();
  const score = scoreAssessment(answers);
  return (
    <section className="assessment-section" id="knowledge-check" aria-labelledby="assessment-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow blue">{nb.assessment.eyebrow}</p>
          <h2 id="assessment-title">{nb.assessment.title}</h2>
          <p>{nb.assessment.intro}</p>
        </div>
        <span className="assessment-icon">
          <CircleHelp size={28} />
        </span>
      </div>
      {!unlocked ? (
        <div className="locked-state">
          <CircleHelp size={21} />
          <p>{nb.assessment.prerequisite}</p>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
            if (score.passed) award('organization-check-v1');
          }}
        >
          <div className="question-grid">
            {questions.map((question, index) => {
              const chosen = question.options.find((option) => option.id === answers[question.id]);
              const correct = answers[question.id] === answerKey[question.id];
              return (
                <fieldset key={question.id} className="question-card" disabled={submitted}>
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
                  {submitted && (
                    <div className={`answer-feedback ${correct ? 'correct' : 'incorrect'}`}>
                      <strong>{correct ? nb.assessment.correct : nb.assessment.incorrect}</strong>
                      <p>{chosen?.explanation}</p>
                    </div>
                  )}
                </fieldset>
              );
            })}
          </div>
          {submitted && (
            <div className={`assessment-result ${score.passed ? 'passed' : ''}`} role="status">
              <CheckCircle2 size={22} />
              <div>
                <strong>{score.passed ? nb.assessment.passed : nb.assessment.failed}</strong>
                <p>
                  {score.correct} / {score.total} {nb.assessment.result}
                </p>
              </div>
            </div>
          )}
          <div className="assessment-actions">
            {submitted ? (
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                }}
              >
                {nb.assessment.retry}
              </button>
            ) : (
              <button
                type="submit"
                className="button button-dark"
                disabled={!ready || Object.keys(answers).length < questions.length}
              >
                {nb.assessment.submit}
                <ArrowRight size={17} />
              </button>
            )}
            <p>{nb.assessment.evidence}</p>
          </div>
          {submitted && <p className="reflection">{nb.assessment.reflection}</p>}
        </form>
      )}
    </section>
  );
}
