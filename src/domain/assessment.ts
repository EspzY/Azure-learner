// Stable option IDs are independent of translation and visual ordering.
export const answerKey = {
  parent: 'subscription',
  geography: 'independent',
  tenant: 'one-directory',
} as const;
export type QuestionId = keyof typeof answerKey;
export type Answers = Partial<Record<QuestionId, string>>;

export function scoreAssessment(answers: Answers) {
  const ids = Object.keys(answerKey) as QuestionId[];
  const correct = ids.filter((id) => answers[id] === answerKey[id]).length;
  return { correct, total: ids.length, passed: correct === ids.length };
}
