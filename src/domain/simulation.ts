export const regions = ['norwayeast', 'westeurope', 'northeurope'] as const;
export type Region = (typeof regions)[number];
export type ScopeKind = 'tenant' | 'root' | 'management' | 'subscription' | 'group' | 'resource';
export interface Scope {
  id: string;
  kind: ScopeKind;
  label: string;
  parentId?: string;
  region?: Region;
}
export interface Simulation {
  scopes: Scope[];
  sequence: number;
}
export const initialSimulation: Simulation = {
  sequence: 1,
  scopes: [
    { id: 'tenant', kind: 'tenant', label: 'AzureLab Directory' },
    { id: 'root', kind: 'root', label: 'Tenant root group', parentId: 'tenant' },
    { id: 'mg', kind: 'management', label: 'mg-learning', parentId: 'root' },
    { id: 'sub', kind: 'subscription', label: 'Learning Sandbox', parentId: 'mg' },
    { id: 'rg-app', kind: 'group', label: 'rg-webapp-dev', parentId: 'sub', region: 'norwayeast' },
    { id: 'rg-data', kind: 'group', label: 'rg-data-dev', parentId: 'sub', region: 'westeurope' },
    { id: 'app', kind: 'resource', label: 'App Service', parentId: 'rg-app', region: 'westeurope' },
    {
      id: 'storage',
      kind: 'resource',
      label: 'Storage account',
      parentId: 'rg-data',
      region: 'westeurope',
    },
  ],
};
export type CreationError =
  'invalid-name' | 'invalid-region' | 'invalid-parent' | 'duplicate' | 'limit';
export type CreationResult =
  { ok: true; state: Simulation; created: Scope } | { ok: false; error: CreationError };

// A bounded teaching sandbox, not the full Azure resource provider contract.
export function validResourceGroupName(name: string): boolean {
  return /^[\p{L}\p{N}_.()-]{1,90}$/u.test(name) && !name.endsWith('.');
}
export function createResourceGroup(
  state: Simulation,
  command: { name: string; region: string; subscriptionId: string },
): CreationResult {
  const name = command.name.trim();
  if (!validResourceGroupName(name)) return { ok: false, error: 'invalid-name' };
  if (!regions.includes(command.region as Region)) return { ok: false, error: 'invalid-region' };
  if (
    !state.scopes.some(
      (scope) => scope.id === command.subscriptionId && scope.kind === 'subscription',
    )
  )
    return { ok: false, error: 'invalid-parent' };
  if (
    state.scopes.some(
      (scope) =>
        scope.kind === 'group' &&
        scope.parentId === command.subscriptionId &&
        scope.label.toLowerCase() === name.toLowerCase(),
    )
  )
    return { ok: false, error: 'duplicate' };
  if (state.sequence > 3) return { ok: false, error: 'limit' };
  const created: Scope = {
    id: `created-group-${state.sequence}`,
    kind: 'group',
    label: name,
    parentId: command.subscriptionId,
    region: command.region as Region,
  };
  return {
    ok: true,
    created,
    state: { sequence: state.sequence + 1, scopes: [...state.scopes, created] },
  };
}

export function missionSatisfied(state: Simulation): boolean {
  return state.scopes.some(
    (scope) =>
      scope.id.startsWith('created-group-') &&
      scope.kind === 'group' &&
      scope.parentId === 'sub' &&
      scope.label.toLowerCase() === 'rg-azurelab-dev' &&
      scope.region === 'norwayeast',
  );
}
