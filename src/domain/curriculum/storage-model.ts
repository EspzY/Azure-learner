/** Pedagogical fixtures only. Never imports World, commands, receipts or cloud clients. */
export const storageModelVersion = '1.0.0';
export const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
export const keys = (v: object, fields: readonly string[]) =>
  Object.keys(v).sort().join(',') === [...fields].sort().join(',');
export const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export type Outcome = 0 | 1 | 2;
export const storageServices = ['blob', 'files', 'queue', 'table', 'disk', 'other'] as const;
export type StorageService = (typeof storageServices)[number];
export const storageWorkloads = ['images', 'documents', 'jobs', 'metadata'] as const;
export interface DesignInput {
  kind: 'design';
  imageAccess: 'http' | 'smb';
  services: Record<(typeof storageWorkloads)[number], StorageService>;
}
/** Classic account-based shares. SS21 qualifies the older four-family Learn table. */
export const accountSupport = {
  gpv2: ['block', 'append', 'page', 'smb', 'queue', 'table'],
  block: ['block', 'append'],
  fileSsd: ['smb', 'nfs'],
  fileHdd: ['smb'],
  page: ['page'],
} as const;
export type StorageAccount = keyof typeof accountSupport;
export const storageRequests = [
  'block',
  'append',
  'page',
  'smb',
  'nfs',
  'queue',
  'table',
  'disk',
] as const;
export type StorageRequest = (typeof storageRequests)[number];
export interface AccountInput {
  kind: 'accounts';
  account: StorageAccount;
  request: StorageRequest;
  regionDeclared: boolean;
}
export interface DeliveryInput {
  kind: 'delivery';
  payload: 'pointer' | 'large';
  idempotent: boolean;
}
export type StorageInput = DesignInput | AccountInput | DeliveryInput;
export const initialDesign: DesignInput = {
  kind: 'design',
  imageAccess: 'http',
  services: { images: 'blob', documents: 'blob', jobs: 'blob', metadata: 'blob' },
};
export const initialAccounts: AccountInput = {
  kind: 'accounts',
  account: 'block',
  request: 'queue',
  regionDeclared: true,
};
export const initialDelivery: DeliveryInput = {
  kind: 'delivery',
  payload: 'pointer',
  idempotent: false,
};
export function validDesign(v: unknown): v is DesignInput {
  return (
    object(v) &&
    keys(v, ['kind', 'imageAccess', 'services']) &&
    v.kind === 'design' &&
    ['http', 'smb'].includes(v.imageAccess as string) &&
    object(v.services) &&
    keys(v.services, storageWorkloads) &&
    storageWorkloads.every((k) =>
      storageServices.includes(
        (v.services as Record<(typeof storageWorkloads)[number], StorageService>)[k],
      ),
    )
  );
}
export function validAccounts(v: unknown): v is AccountInput {
  return (
    object(v) &&
    keys(v, ['kind', 'account', 'request', 'regionDeclared']) &&
    v.kind === 'accounts' &&
    Object.hasOwn(accountSupport, v.account as string) &&
    storageRequests.includes(v.request as StorageRequest) &&
    typeof v.regionDeclared === 'boolean'
  );
}
export function validDelivery(v: unknown): v is DeliveryInput {
  return (
    object(v) &&
    keys(v, ['kind', 'payload', 'idempotent']) &&
    v.kind === 'delivery' &&
    ['pointer', 'large'].includes(v.payload as string) &&
    typeof v.idempotent === 'boolean'
  );
}
export function validStorageInput(v: unknown): v is StorageInput {
  return validDesign(v) || validAccounts(v) || validDelivery(v);
}
export function runDesign(raw: unknown) {
  if (!validDesign(raw)) return null;
  const expected = {
    images: raw.imageAccess === 'http' ? 'blob' : 'files',
    documents: 'files',
    jobs: 'queue',
    metadata: 'table',
  } as const;
  const fits = storageWorkloads.map((workload) => ({
    workload,
    chosen: raw.services[workload],
    expected: expected[workload],
    met: raw.services[workload] === expected[workload],
  }));
  const matched = fits.filter((f) => f.met).length;
  return {
    input: raw,
    fits,
    matched,
    requirementsMet: matched === 4,
    outcome: (matched === 4 ? 2 : matched ? 1 : 0) as Outcome,
  };
}
export function runAccounts(raw: unknown) {
  if (!validAccounts(raw)) return null;
  const supported = (accountSupport[raw.account] as readonly string[]).includes(raw.request);
  return {
    input: raw,
    supported,
    supportedRequests: accountSupport[raw.account],
    qualified: supported && raw.regionDeclared,
    outcome: (supported ? (raw.regionDeclared ? 2 : 1) : 0) as Outcome,
  };
}
export function runDelivery(raw: unknown) {
  if (!validDelivery(raw)) return null;
  const accepted = raw.payload === 'pointer';
  // Fixed declared crash AFTER side effect but BEFORE delete. No clock, API or actual worker.
  const deliveries = accepted ? 2 : 0;
  const effects = accepted ? (raw.idempotent ? 1 : 2) : 0;
  return {
    input: raw,
    accepted,
    deliveries,
    effects,
    steps: accepted ? [0, 1, 2, 3, 4, 5, 6] : [],
    outcome: (!accepted ? 0 : effects === 1 ? 2 : 1) as Outcome,
  };
}
export function runStorage(raw: unknown) {
  return validDesign(raw)
    ? runDesign(raw)
    : validAccounts(raw)
      ? runAccounts(raw)
      : runDelivery(raw);
}
export function initialStorage(kind: StorageInput['kind']): StorageInput {
  return structuredClone(
    { design: initialDesign, accounts: initialAccounts, delivery: initialDelivery }[kind],
  );
}
