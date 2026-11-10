import type { World } from './contract';
import * as P from '../v35/contract';
/** Private input only. Never stored, migrated, or accepted as a different workspace. */
export const firewallProjection = (world: World): P.World => ({
  ...world,
  model: P.laboratoryModel,
});
