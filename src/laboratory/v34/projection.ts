import { laboratoryModel, type World as EndpointWorld } from '../v33/contract';
import { routingProjection } from '../v33/projection';
import type { World } from './contract';
/** Read-only input to frozen network rules. Never persisted or exposed as another workspace. */
export const endpointProjection = (w: World): EndpointWorld => ({
  ...routingProjection({ ...w, model: laboratoryModel }),
  model: laboratoryModel,
  nics: w.nics,
});
