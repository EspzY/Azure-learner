/** P03 supplement. Never reinterpret a historical module's events or rubric. */
export const transferKey = 'azurelab.learning.cloud-transfer.v1';
export const transferVersion = '1.0.0';
export const transferLimit = 1200;
export type TransferModule = 'computing' | 'benefits' | 'services';
export type TransferFamily =
  | 'deployment'
  | 'pricing'
  | 'availability'
  | 'reliability'
  | 'governance'
  | 'manageability'
  | 'services';
export const transferObjectiveMap: Record<string, string> = {
  '1.1.03': 'az900.cloud.models',
  '1.1.04': 'az900.cloud.model-use',
  '1.1.06': 'az900.cloud.pricing',
  '1.2.01': 'az900.benefits.availability-scale',
  '1.2.02': 'az900.benefits.reliability-predictability',
  '1.2.03': 'az900.benefits.security-governance',
  '1.2.04': 'az900.benefits.manageability',
  '1.3.04': 'az900.services.use-cases',
};
interface Item {
  family: TransferFamily;
  module: TransferModule;
  objectives: readonly string[];
  accepted: readonly (readonly [number, number])[];
  sources: readonly string[];
  repeat: string;
  version: string;
  rubric: string;
  examSlots: readonly string[];
}
const item = (
  family: TransferFamily,
  module: TransferModule,
  slots: string[],
  accepted: [number, number][],
  sources: string[],
  repeat: string,
): Item => ({
  family,
  module,
  objectives: slots.map((id) => transferObjectiveMap[id]!),
  examSlots: slots,
  accepted,
  sources,
  repeat,
  version: transferVersion,
  rubric: transferVersion,
});
export const transferItems = {
  'public-information': item(
    'deployment',
    'computing',
    ['1.1.03', '1.1.04'],
    [[1, 2]],
    ['T01', 'T02'],
    '/learn/computing?topic=v2-models',
  ),
  'exclusive-research': item(
    'deployment',
    'computing',
    ['1.1.03', '1.1.04'],
    [[0, 0]],
    ['T01', 'T02'],
    '/learn/computing?topic=v2-models',
  ),
  'integrated-production': item(
    'deployment',
    'computing',
    ['1.1.03', '1.1.04'],
    [[2, 1]],
    ['T01', 'T02'],
    '/learn/computing?topic=v2-placement',
  ),
  'campaign-pricing': item(
    'pricing',
    'computing',
    ['1.1.06'],
    [[1, 2]],
    ['T03', 'T10', 'T11', 'T12'],
    '/learn/computing?topic=v2-pricing',
  ),
  'baseline-pricing': item(
    'pricing',
    'computing',
    ['1.1.06'],
    [[0, 1]],
    ['T03', 'T10', 'T12'],
    '/learn/computing?topic=v2-pricing',
  ),
  'batch-pricing': item(
    'pricing',
    'computing',
    ['1.1.06'],
    [[2, 0]],
    ['T03', 'T11'],
    '/learn/computing?topic=v2-pricing',
  ),
  'memory-capacity': item(
    'availability',
    'benefits',
    ['1.2.01'],
    [[1, 2]],
    ['T04'],
    '/learn/benefits?topic=availability',
  ),
  'route-replica': item(
    'availability',
    'benefits',
    ['1.2.01'],
    [[0, 1]],
    ['T04', 'T13'],
    '/learn/benefits?topic=availability',
  ),
  'shared-payment': item(
    'availability',
    'benefits',
    ['1.2.01'],
    [[2, 1]],
    ['T04', 'T13'],
    '/learn/benefits?topic=reliability',
  ),
  'parallel-demand': item(
    'availability',
    'benefits',
    ['1.2.01'],
    [[0, 1]],
    ['T04'],
    '/learn/benefits?topic=availability',
  ),
  'recovery-evidence': item(
    'reliability',
    'benefits',
    ['1.2.02'],
    [[1, 0]],
    ['T05', 'T13'],
    '/learn/benefits?topic=reliability',
  ),
  'forecast-change': item(
    'reliability',
    'benefits',
    ['1.2.02'],
    [[2, 0]],
    ['T05'],
    '/learn/benefits?topic=reliability',
  ),
  'accepted-configuration': item(
    'governance',
    'benefits',
    ['1.2.03'],
    [[0, 1]],
    ['T06', 'T14'],
    '/learn/benefits?topic=governance',
  ),
  'signed-in-operator': item(
    'governance',
    'benefits',
    ['1.2.03'],
    [[1, 2]],
    ['T06', 'T15', 'T16'],
    '/learn/benefits?topic=governance',
  ),
  'manual-drift': item(
    'manageability',
    'benefits',
    ['1.2.04'],
    [[2, 0]],
    ['T07', 'T17'],
    '/learn/benefits?topic=management',
  ),
  'repeatable-error': item(
    'manageability',
    'benefits',
    ['1.2.04'],
    [[0, 1]],
    ['T07', 'T17'],
    '/learn/benefits?topic=management',
  ),
  'kernel-workload': item(
    'services',
    'services',
    ['1.3.04'],
    [[1, 2]],
    ['T08', 'T09'],
    '/learn/services?topic=iaas&version=2',
  ),
  'ready-collaboration': item(
    'services',
    'services',
    ['1.3.04'],
    [[0, 1]],
    ['T18', 'T09'],
    '/learn/services?topic=saas&version=2',
  ),
  'two-valid-hosts': item(
    'services',
    'services',
    ['1.3.04'],
    [
      [1, 0],
      [2, 1],
    ],
    ['T08', 'T09'],
    '/learn/services?topic=selection&version=2',
  ),
} as const satisfies Record<string, Item>;
export type TransferItemId = keyof typeof transferItems;
export const transferVariants: Record<TransferItemId, string> = {
  'public-information': 'cc01',
  'exclusive-research': 'cc02',
  'integrated-production': 'cc03',
  'campaign-pricing': 'cc04',
  'baseline-pricing': 'cc05',
  'batch-pricing': 'cc06',
  'memory-capacity': 'cc07',
  'route-replica': 'cc08',
  'shared-payment': 'cc09',
  'parallel-demand': 'cc19',
  'recovery-evidence': 'cc10',
  'forecast-change': 'cc11',
  'accepted-configuration': 'cc12',
  'signed-in-operator': 'cc13',
  'manual-drift': 'cc14',
  'repeatable-error': 'cc15',
  'kernel-workload': 'cc16',
  'ready-collaboration': 'cc17',
  'two-valid-hosts': 'cc18',
};
export const transferCase = (value: string | null) =>
  transferIds.find((id) => transferVariants[id] === value);
export const transferIds = Object.keys(transferItems) as TransferItemId[];
export const transferManifest = {
  id: 'cloud-concepts-transfer',
  content: transferVersion,
  model: transferVersion,
  rubric: transferVersion,
  reviewed: '2026-10-27',
  humanSme: null,
  learnerStudy: null,
  objectives: {
    deployment: ['FC04', 'FC05'],
    pricing: ['FC07'],
    availability: ['CB01'],
    reliability: ['CB02'],
    governance: ['CB03'],
    manageability: ['CB04'],
    services: ['ST04'],
  },
  competencies: {
    deployment: ['F01'],
    pricing: ['F03'],
    availability: ['F02'],
    reliability: ['F02'],
    governance: ['G03'],
    manageability: ['A01'],
    services: ['R01'],
  },
  certificationOverlay: { exam: 'AZ-900', version: '2026-07-20', slots: transferObjectiveMap },
  activities: transferIds,
} as const;
export const transferHref = (id: TransferItemId) =>
  `/learn/${transferItems[id].module}?topic=transfer&case=${transferVariants[id]}`;
export const misconceptionId = (id: TransferItemId, field: keyof TransferAnswer, choice: number) =>
  `transfer.${id}.${field}.${choice}`;
export interface TransferAnswer {
  decision: number | null;
  reason: number | null;
}
export interface TransferAttempt {
  id: number;
  item: TransferItemId;
  family: TransferFamily;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  answer: TransferAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export type TransferEvent =
  | { kind: 'begin'; item: TransferItemId }
  | { kind: 'draft'; answer: TransferAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface TransferSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  events: TransferEvent[];
}
export const freshTransfer = (): TransferSave => ({
  schema: 1,
  content: transferVersion,
  model: transferVersion,
  rubric: transferVersion,
  events: [],
});
const exact = (v: object, keys: string[]) =>
  Object.keys(v).sort().join('|') === keys.sort().join('|');
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const choice = (v: unknown): v is number | null =>
  v === null || (Number.isInteger(v) && typeof v === 'number' && v >= 0 && v < 3);
function event(raw: unknown): raw is TransferEvent {
  if (!object(raw)) return false;
  if (raw.kind === 'begin')
    return (
      exact(raw, ['kind', 'item']) &&
      typeof raw.item === 'string' &&
      transferIds.includes(raw.item as TransferItemId)
    );
  if (raw.kind === 'draft')
    return (
      exact(raw, ['kind', 'answer']) &&
      object(raw.answer) &&
      exact(raw.answer, ['decision', 'reason']) &&
      choice(raw.answer.decision) &&
      choice(raw.answer.reason)
    );
  return ['aid', 'submit', 'abandon'].includes(String(raw.kind)) && exact(raw, ['kind']);
}
export function transferFacts(save: TransferSave) {
  const attempts: TransferAttempt[] = [];
  let current: TransferAttempt | undefined;
  for (const e of save.events) {
    if (e.kind === 'begin') {
      const definition = transferItems[e.item];
      current = {
        id: attempts.length + 1,
        item: e.item,
        family: definition.family,
        variant: transferVariants[e.item],
        itemVersion: definition.version,
        rubricVersion: definition.rubric,
        answer: { decision: null, reason: null },
        assisted: false,
        retry: attempts.some((a) => a.family === definition.family),
        status: 'active',
      };
      attempts.push(current);
    } else if (current?.status === 'active') {
      if (e.kind === 'draft') current.answer = { ...e.answer };
      if (e.kind === 'aid') current.assisted = true;
      if (e.kind === 'submit') current.status = 'submitted';
      if (e.kind === 'abandon') current.status = 'abandoned';
    }
  }
  return {
    attempts,
    current,
    active: current?.status === 'active',
    assisted: current?.status === 'active' && current.assisted,
    submitted: attempts.filter((a) => a.status === 'submitted'),
  };
}
export function evaluateTransfer(attempt: TransferAttempt) {
  const accepted = transferItems[attempt.item].accepted;
  return {
    decision: accepted.some(([d]) => d === attempt.answer.decision),
    relation: accepted.some(
      ([d, r]) => d === attempt.answer.decision && r === attempt.answer.reason,
    ),
    misconceptions: accepted.some(
      ([d, r]) => d === attempt.answer.decision && r === attempt.answer.reason,
    )
      ? []
      : (['decision', 'reason'] as const).map((field) =>
          misconceptionId(attempt.item, field, attempt.answer[field] ?? -1),
        ),
  };
}
export function applyTransfer(save: TransferSave, raw: unknown): TransferSave | null {
  if (!event(raw)) return null;
  const f = transferFacts(save),
    a = f.current;
  if (raw.kind === 'begin') {
    if (f.active || save.events.length > transferLimit - 5) return null;
  } else {
    if (!f.active || !a) return null;
    if (raw.kind === 'draft') {
      if (JSON.stringify(raw.answer) === JSON.stringify(a.answer)) return save;
      if (save.events.length >= transferLimit - 2) return null;
    }
    if (raw.kind === 'aid') {
      if (a.assisted) return save;
      if (save.events.length >= transferLimit - 1) return null;
    }
    if (raw.kind === 'submit' && (a.answer.decision === null || a.answer.reason === null))
      return null;
  }
  if (save.events.length >= transferLimit) return null;
  return { ...save, events: [...save.events, raw] };
}
export function restoreTransfer(raw: string | null): {
  save: TransferSave;
  issue: 'unsupported' | 'corrupt' | null;
} {
  const invalid = (issue: 'unsupported' | 'corrupt') => ({ save: freshTransfer(), issue });
  if (raw === null) return { save: freshTransfer(), issue: null };
  if (raw.length > 220000) return invalid('corrupt');
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!object(parsed)) return invalid('corrupt');
    if (
      parsed.schema !== 1 ||
      parsed.content !== transferVersion ||
      parsed.model !== transferVersion ||
      parsed.rubric !== transferVersion
    )
      return invalid('unsupported');
    if (
      !exact(parsed, ['schema', 'content', 'model', 'rubric', 'events']) ||
      !Array.isArray(parsed.events) ||
      parsed.events.length > transferLimit
    )
      return invalid('corrupt');
    let save = freshTransfer();
    for (const e of parsed.events) {
      const next = applyTransfer(save, e);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
