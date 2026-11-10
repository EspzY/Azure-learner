export const serviceModels = ['iaas', 'paas', 'saas'] as const;
export type ServiceModel = (typeof serviceModels)[number];
export const layers = [
  'physical',
  'os',
  'runtime',
  'application',
  'network',
  'settings',
  'identity',
  'data',
] as const;
export type Layer = (typeof layers)[number];
export type Owner = 'customer' | 'microsoft' | 'shared';
export function responsibility(model: ServiceModel, layer: Layer): Owner {
  if (['data', 'identity', 'settings'].includes(layer)) return 'customer';
  if (layer === 'physical') return 'microsoft';
  if (model === 'iaas') return 'customer';
  if (layer === 'application') return 'shared';
  if (layer === 'network' && model === 'paas') return 'shared';
  return 'microsoft';
}
