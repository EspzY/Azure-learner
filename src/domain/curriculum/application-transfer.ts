/** AS-02 Stage A only. Original banks and replay contracts remain immutable. */
export const applicationKey = 'azurelab.learning.application-transfer.v1';
export const applicationVersion = '1.0.0';
export const applicationLimit = 800;
export type ApplicationGroup = 'networking' | 'storage' | 'cost';
const definition = (
  group: ApplicationGroup,
  family: string,
  variant: string,
  decisions: readonly string[],
  reasons: readonly string[],
  accepted: readonly (readonly [string, string])[],
  repeat: string,
  slots: readonly string[],
) => ({
  group,
  family,
  variant,
  decisions,
  reasons,
  accepted,
  repeat,
  slots,
  itemVersion: applicationVersion,
  rubricVersion: applicationVersion,
  presentation: applicationVersion,
});
export const applicationItems = {
  'at-network-01': definition(
    'networking',
    'at.network-evidence',
    'endpoint-object',
    ['route-token', 'dns-object', 'dns-route'],
    ['split-evidence', 'login-renewal', 'route-uniform'],
    [['dns-object', 'split-evidence']],
    '/learn/networking?topic=explorer',
    ['2.2.05', '2.4.05'],
  ),
  'at-network-02': definition(
    'networking',
    'at.network-evidence',
    'transport-token',
    ['dns-object', 'token-both', 'path-token'],
    ['dns-for-timeout', 'separate-stages', 'roles-first'],
    [['path-token', 'separate-stages']],
    '/learn/networking?topic=dns',
    ['2.2.05', '2.4.02'],
  ),
  'at-storage-01': definition(
    'storage',
    'at.storage-contract',
    'shared-update',
    ['sequential-io', 'mount-access', 'concurrent-io'],
    ['single-writer', 'identity-sample', 'coordination'],
    [['concurrent-io', 'coordination']],
    '/learn/storage?topic=files',
    ['2.3.01'],
  ),
  'at-storage-02': definition(
    'storage',
    'at.storage-contract',
    'independent-reports',
    ['blob-pilot', 'files-pilot', 'activate-now'],
    ['files-adapter', 'object-contract', 'early-activation'],
    [
      ['blob-pilot', 'object-contract'],
      ['files-pilot', 'files-adapter'],
    ],
    '/learn/storage?topic=blob',
    ['2.3.01'],
  ),
  'at-cost-01': definition(
    'cost',
    'at.cost-commitment',
    'matched-floor',
    ['base-commit', 'peak-commit', 'all-payg'],
    ['no-commit', 'matched-floor', 'peak-equals-floor'],
    [['base-commit', 'matched-floor']],
    '/learn/cost?topic=optimization',
    ['1.1.06', '3.1.01'],
  ),
  'at-cost-02': definition(
    'cost',
    'at.cost-commitment',
    'interruptible-campaign',
    ['year-commit', 'spot-fallback', 'all-payg'],
    ['observed-conditional', 'reference-run', 'commitment-rate'],
    [['spot-fallback', 'observed-conditional']],
    '/learn/cost?topic=optimization',
    ['1.1.06', '3.1.01'],
  ),
} as const;
export type ApplicationItem = keyof typeof applicationItems;
export const applicationIds = Object.keys(applicationItems) as ApplicationItem[];
export const isApplicationItem = (v: unknown): v is ApplicationItem =>
  typeof v === 'string' && applicationIds.includes(v as ApplicationItem);
export const applicationHref = (item: ApplicationItem = 'at-network-01') =>
  `/learn/${applicationItems[item].group}?topic=assessment&application=${item}`;
export const exposureBanks = ['networking', 'storage', 'cost', 'cloud-transfer'] as const;
export type ExposureBank = (typeof exposureBanks)[number];
export interface ApplicationExposure {
  related: ExposureBank[];
  uncertain: ExposureBank[];
}
export interface ApplicationAnswer {
  decision: string | null;
  reason: string | null;
}
export interface ApplicationAttempt {
  id: number;
  item: ApplicationItem;
  family: string;
  variant: string;
  itemVersion: string;
  rubricVersion: string;
  presentation: string;
  exposure: ApplicationExposure;
  answer: ApplicationAnswer;
  assisted: boolean;
  retry: boolean;
  status: 'active' | 'submitted' | 'abandoned';
}
export type ApplicationEvent =
  | { kind: 'begin'; item: ApplicationItem; exposure: ApplicationExposure }
  | { kind: 'draft'; answer: ApplicationAnswer }
  | { kind: 'aid' | 'submit' | 'abandon' };
export interface ApplicationSave {
  schema: 1;
  content: string;
  model: string;
  rubric: string;
  presentation: string;
  events: ApplicationEvent[];
}
export const freshApplication = (): ApplicationSave => ({
  schema: 1,
  content: applicationVersion,
  model: applicationVersion,
  rubric: applicationVersion,
  presentation: applicationVersion,
  events: [],
});
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v: object, keys: string[]) =>
  Object.keys(v).sort().join('|') === [...keys].sort().join('|');
function validExposure(v: unknown, group: ApplicationGroup): v is ApplicationExposure {
  if (!object(v) || !exact(v, ['related', 'uncertain'])) return false;
  const allowed = group === 'cost' ? ['cost', 'cloud-transfer'] : [group];
  return (
    [v.related, v.uncertain].every(
      (a) =>
        Array.isArray(a) &&
        a.length <= allowed.length &&
        a.every((x) => allowed.includes(x)) &&
        new Set(a).size === a.length &&
        a.join('|') === [...a].sort().join('|'),
    ) && !(v.related as string[]).some((x) => (v.uncertain as string[]).includes(x))
  );
}
export function applicationFacts(save: ApplicationSave) {
  const attempts: ApplicationAttempt[] = [];
  let current: ApplicationAttempt | undefined;
  for (const e of save.events) {
    if (e.kind === 'begin') {
      const d = applicationItems[e.item];
      current = {
        id: attempts.length + 1,
        item: e.item,
        family: d.family,
        variant: d.variant,
        itemVersion: d.itemVersion,
        rubricVersion: d.rubricVersion,
        presentation: d.presentation,
        exposure: structuredClone(e.exposure),
        answer: { decision: null, reason: null },
        assisted: false,
        retry: attempts.some((a) => a.family === d.family),
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
    firsts: applicationIds.flatMap((id) => {
      const a = attempts.find((a) => a.item === id && a.status === 'submitted');
      return a ? [a] : [];
    }),
    full: save.events.length > applicationLimit - 5,
  };
}
export function evaluateApplication(a: ApplicationAttempt) {
  const pairs: readonly (readonly [string, string])[] = applicationItems[a.item].accepted;
  return {
    decision: pairs.some(([d]) => d === a.answer.decision),
    relation: pairs.some(([d, r]) => d === a.answer.decision && r === a.answer.reason),
  };
}
export function applyApplication(save: ApplicationSave, raw: unknown): ApplicationSave | null {
  if (!object(raw)) return null;
  const f = applicationFacts(save),
    a = f.current;
  if (raw.kind === 'begin') {
    if (
      !exact(raw, ['kind', 'item', 'exposure']) ||
      !isApplicationItem(raw.item) ||
      !validExposure(raw.exposure, applicationItems[raw.item].group) ||
      f.active ||
      save.events.length > applicationLimit - 5
    )
      return null;
  } else {
    if (!f.active || !a) return null;
    if (raw.kind === 'draft') {
      if (
        !exact(raw, ['kind', 'answer']) ||
        !object(raw.answer) ||
        !exact(raw.answer, ['decision', 'reason'])
      )
        return null;
      const d = applicationItems[a.item];
      for (const field of ['decision', 'reason'] as const) {
        const value = raw.answer[field];
        const allowed: readonly string[] = field === 'decision' ? d.decisions : d.reasons;
        if (value !== null && (typeof value !== 'string' || !allowed.includes(value))) return null;
      }
      if (JSON.stringify(raw.answer) === JSON.stringify(a.answer)) return save;
      if (save.events.length >= applicationLimit - 2) return null;
    } else {
      if (!exact(raw, ['kind']) || !['aid', 'submit', 'abandon'].includes(String(raw.kind)))
        return null;
      if (raw.kind === 'aid') {
        if (a.assisted) return save;
        if (save.events.length >= applicationLimit - 1) return null;
      }
      if (raw.kind === 'submit' && (a.answer.decision === null || a.answer.reason === null))
        return null;
    }
  }
  if (save.events.length >= applicationLimit) return null;
  return { ...save, events: [...save.events, structuredClone(raw) as ApplicationEvent] };
}
export function restoreApplication(raw: string | null): {
  save: ApplicationSave;
  issue: 'unsupported' | 'corrupt' | null;
} {
  const invalid = (issue: 'unsupported' | 'corrupt') => ({ save: freshApplication(), issue });
  if (raw === null) return { save: freshApplication(), issue: null };
  if (raw.length > 500000) return invalid('corrupt');
  try {
    const v: unknown = JSON.parse(raw);
    if (!object(v)) return invalid('corrupt');
    if (
      v.schema !== 1 ||
      v.content !== applicationVersion ||
      v.model !== applicationVersion ||
      v.rubric !== applicationVersion ||
      v.presentation !== applicationVersion
    )
      return invalid('unsupported');
    if (
      !exact(v, ['schema', 'content', 'model', 'rubric', 'presentation', 'events']) ||
      !Array.isArray(v.events) ||
      v.events.length > applicationLimit
    )
      return invalid('corrupt');
    let save = freshApplication();
    for (const event of v.events) {
      const next = applyApplication(save, event);
      if (!next || next === save) return invalid('corrupt');
      save = next;
    }
    return { save, issue: null };
  } catch {
    return invalid('corrupt');
  }
}
