import {
  activities,
  curriculum,
  objectiveIds,
  sources,
  sourceRecords,
  transferCriteria,
  units,
  type UnitDefinition,
} from './manifest';
import { nb } from '@/content/nb';
export function validateCurriculum(
  definitions: readonly UnitDefinition[] = units,
  content: Record<string, unknown> = nb.foundations.units,
  registry: Record<string, { unit: string; kind: string; implemented: boolean }> = activities,
) {
  const errors: string[] = [],
    seen = new Set<string>(),
    objectiveSet = new Set<string>(),
    used = new Set<string>();
  for (const unit of definitions) {
    if (seen.has(unit.id)) errors.push(`Duplicate unit ${unit.id}`);
    seen.add(unit.id);
    for (const prerequisite of unit.prerequisites)
      if (!definitions.some((u) => u.id === prerequisite))
        errors.push(`Missing prerequisite ${prerequisite}`);
    const c = content[unit.id] as Record<string, unknown> | undefined;
    for (const key of [
      'title',
      'spoken',
      'purpose',
      'mechanism',
      'azure',
      'example',
      'misconception',
      'limits',
      'question',
    ])
      if (typeof c?.[key] !== 'string' || !(c[key] as string).trim())
        errors.push(`${unit.id}: missing ${key}`);
    if (
      !Array.isArray(c?.terms) ||
      c.terms.length === 0 ||
      c.terms.some(
        (pair) =>
          !Array.isArray(pair) ||
          pair.length !== 2 ||
          pair.some((s) => typeof s !== 'string' || !s.trim()),
      )
    )
      errors.push(`${unit.id}: terminology`);
    if (
      !c?.feedback ||
      typeof c.feedback !== 'object' ||
      Object.keys(c.feedback).length === 0 ||
      Object.values(c.feedback).some((v) => typeof v !== 'string' || !v.trim())
    )
      errors.push(`${unit.id}: feedback`);
    if (
      c?.answers &&
      typeof c.answers === 'object' &&
      Object.keys(c.answers).some(
        (id) => !c.feedback || typeof c.feedback !== 'object' || !Object.hasOwn(c.feedback, id),
      )
    )
      errors.push(`${unit.id}: missing answer explanation`);
    if (!unit.sources.length || unit.sources.some((id) => !Object.hasOwn(sources, id)))
      errors.push(`${unit.id}: source`);
    for (const id of unit.sources) {
      const record = sourceRecords[id];
      if (
        !record ||
        !record.url.startsWith('https://learn.microsoft.com/') ||
        !/^\d{4}-\d{2}-\d{2}$/.test(record.reviewed) ||
        record.usage !== 'reference-only'
      )
        errors.push(`${unit.id}: source provenance`);
    }
    if (!unit.objectives.length) errors.push(`${unit.id}: objectives`);
    unit.objectives.forEach((id) => {
      if (!objectiveIds.includes(id)) errors.push(`Unknown objective ${id}`);
      objectiveSet.add(id);
    });
    for (const id of unit.activities) {
      used.add(id);
      const a = registry[id];
      if (!a || a.unit !== unit.id || !a.implemented) errors.push(`Missing implementation ${id}`);
    }
    if (
      !['teaching', 'practice', 'guided-assessment'].every((kind) =>
        unit.activities.some((id) => registry[id]?.kind === kind),
      )
    )
      errors.push(`${unit.id}: activity types`);
  }
  for (const id of objectiveIds) {
    if (!objectiveSet.has(id)) errors.push(`Uncovered objective ${id}`);
    if (!transferCriteria.some((c) => c.objective === id)) errors.push(`Missing transfer ${id}`);
  }
  for (const id of Object.keys(content)) if (!seen.has(id)) errors.push(`Orphan manuscript ${id}`);
  for (const id of Object.keys(registry)) if (!used.has(id)) errors.push(`Orphan activity ${id}`);
  function cycle(id: string, path: Set<string>): boolean {
    if (path.has(id)) return true;
    const next = new Set(path).add(id);
    return definitions.find((u) => u.id === id)?.prerequisites.some((p) => cycle(p, next)) ?? false;
  }
  if (definitions.some((u) => cycle(u.id, new Set()))) errors.push('Prerequisite cycle');
  for (const item of nb.foundations.transferItems) {
    const criterion = transferCriteria.find((c) => c.id === item.id);
    if (
      !criterion ||
      !item.choices.some(([id]) => id === criterion.answer) ||
      !item.explanation.trim()
    )
      errors.push(`Unimplemented assessment ${item.id}`);
  }
  const authoredIds = nb.foundations.transferItems.map((i) => i.id);
  if (
    new Set(authoredIds).size !== authoredIds.length ||
    new Set(transferCriteria.map((c) => c.id)).size !== transferCriteria.length
  )
    errors.push('Duplicate assessment IDs');
  for (const criterion of transferCriteria)
    if (authoredIds.filter((id) => id === criterion.id).length !== 1)
      errors.push(`Missing assessment ${criterion.id}`);
  if (nb.foundations.transferItems.length !== transferCriteria.length)
    errors.push('Assessment count mismatch');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(curriculum.review.sourceChecked))
    errors.push('Missing source review');
  return errors;
}

/** Availability, not a learner score. Unknown or partial bindings remain false. */
export function contentCoverage() {
  return Object.fromEntries(
    objectiveIds.map((id) => {
      const owners = units.filter((u) => u.objectives.includes(id));
      const complete = (kind: string) =>
        owners.length > 0 &&
        owners.every((u) =>
          u.activities.some((a) => activities[a]?.kind === kind && activities[a]?.implemented),
        );
      const authored =
        owners.length > 0 &&
        owners.every((u) => {
          const c = nb.foundations.units[u.id];
          return ['purpose', 'mechanism', 'azure', 'example', 'misconception', 'limits'].every(
            (key) => !!c[key as 'purpose'].trim(),
          );
        });
      return [
        id,
        {
          referenced: owners.length > 0,
          authored,
          teaching: complete('teaching'),
          practice: complete('practice'),
          assessment: transferCriteria.some((c) => c.objective === id),
          sourceReviewed:
            owners.length > 0 &&
            owners.every((u) => u.sources.length > 0) &&
            !!curriculum.review.sourceChecked,
          humanSmeReviewed: curriculum.review.humanSme !== null,
        },
      ];
    }),
  );
}
