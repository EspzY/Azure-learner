/** Former UI-provider keys, removed only by explicit all-data reset.
 * Game/preferences stay opaque; Chapter01 is still a validated SandboxStore import source. */
export const retiredStorageKeys = [
  'azurelab.rpg.g1.v1',
  'azurelab.expedition.v1',
  'azurelab.orientation.v1',
  'azurelab.presentation.v1',
  'azurelab.chapter01.guided.v1',
] as const;
