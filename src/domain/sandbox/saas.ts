import { parseRequest, type Request } from '../chapter01/model';
export const saasKey = 'azurelab.saas-admin.v1';
export const userIds = ['mina', 'leo', 'erin'] as const;
export type UserId = (typeof userIds)[number];
export interface Account {
  id: UserId;
  licensed: boolean;
  role: 'member' | 'support-admin' | 'service-admin';
  blocked: boolean;
  dataReviewed: boolean;
}
export interface SaasState {
  revision: number;
  sharing: 'team' | 'link';
  accounts: Account[];
}
export interface SaasReceipt {
  commandId: string;
  sequence: number;
  action: string;
  subject: string;
  before: number;
  after: number;
  outcome: 'accepted' | 'rejected' | 'unsupported';
  reason: 'updated' | 'invalid' | 'seats-full' | 'stale' | 'conflict' | 'unsupported' | 'limit';
}
export interface SaasEngine {
  state: SaasState;
  ledger: { request: Request; receipt: SaasReceipt }[];
}
export const freshSaas = (): SaasEngine => ({
  state: {
    revision: 0,
    sharing: 'link',
    accounts: userIds.map((id) => ({
      id,
      licensed: id !== 'erin',
      role: id === 'mina' ? 'service-admin' : id === 'leo' ? 'support-admin' : 'member',
      blocked: false,
      dataReviewed: false,
    })),
  },
  ledger: [],
});
const canon = (r: Request) =>
  JSON.stringify([
    r.expectedWorldRevision,
    Object.entries(r.command).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  ]);
export function executeSaas(
  engine: SaasEngine,
  raw: unknown,
): { engine: SaasEngine; receipt: SaasReceipt } {
  const r = parseRequest(raw),
    c = r?.command,
    action = typeof c?.type === 'string' ? c.type : 'unknown';
  const old = r && engine.ledger.find((e) => e.request.commandId === r.commandId);
  if (old && canon(old.request) === canon(r!)) return { engine, receipt: old.receipt };
  let reason: SaasReceipt['reason'] = 'updated',
    outcome: SaasReceipt['outcome'] = 'accepted',
    state = engine.state;
  const account = state.accounts.find((u) => u.id === c?.userId);
  const fields = ['type', 'userId', 'value'];
  if (
    !r ||
    !c ||
    Object.keys(c).sort().join(',') !== fields.sort().join(',') ||
    !account ||
    typeof c.value !== 'string'
  )
    reason = 'invalid';
  else if (old) reason = 'conflict';
  else if (r.expectedWorldRevision !== state.revision) reason = 'stale';
  else if (engine.ledger.length >= 400) reason = 'limit';
  else if (
    !['SetLicense', 'SetRole', 'SetBlocked', 'SetSharing', 'ReviewDepartureData'].includes(action)
  )
    reason = 'unsupported';
  else if ((action === 'SetLicense' || action === 'SetBlocked') && !['yes', 'no'].includes(c.value))
    reason = 'invalid';
  else if (action === 'SetRole' && !['member', 'support-admin', 'service-admin'].includes(c.value))
    reason = 'invalid';
  else if (action === 'SetSharing' && !['team', 'link'].includes(c.value)) reason = 'invalid';
  else if (action === 'ReviewDepartureData' && c.value !== 'reviewed') reason = 'invalid';
  else if (
    action === 'SetLicense' &&
    c.value === 'yes' &&
    !account.licensed &&
    state.accounts.filter((u) => u.licensed).length >= 2
  )
    reason = 'seats-full';
  if (reason !== 'updated') outcome = reason === 'unsupported' ? 'unsupported' : 'rejected';
  else {
    const value = c!.value;
    state = {
      ...state,
      revision: state.revision + 1,
      sharing: action === 'SetSharing' ? (value as 'team' | 'link') : state.sharing,
      accounts: state.accounts.map((u) =>
        u !== account
          ? u
          : {
              ...u,
              ...(action === 'SetLicense' ? { licensed: value === 'yes' } : {}),
              ...(action === 'SetRole' ? { role: value as Account['role'] } : {}),
              ...(action === 'SetBlocked' ? { blocked: value === 'yes' } : {}),
              ...(action === 'ReviewDepartureData' ? { dataReviewed: true } : {}),
            },
      ),
    };
  }
  const receipt: SaasReceipt = {
    commandId: r?.commandId ?? 'invalid',
    sequence: engine.ledger.length + 1,
    action,
    subject: account?.id ?? '',
    before: engine.state.revision,
    after: state.revision,
    outcome,
    reason,
  };
  return {
    engine:
      r && !old && engine.ledger.length < 400
        ? { state, ledger: [...engine.ledger, { request: r, receipt }] }
        : engine,
    receipt,
  };
}
export function replaySaas(source: SaasEngine, through = source.ledger.length): SaasEngine | null {
  if (!Number.isSafeInteger(through) || through < 0 || through > source.ledger.length) return null;
  let result = freshSaas();
  for (const entry of source.ledger.slice(0, through)) {
    const next = executeSaas(result, entry.request);
    if (JSON.stringify(next.receipt) !== JSON.stringify(entry.receipt)) return null;
    result = next.engine;
  }
  if (
    through === source.ledger.length &&
    JSON.stringify(result.state) !== JSON.stringify(source.state)
  )
    return null;
  return result;
}
