import { analyseRoutes as routes, type RouteAnalysis as PreviousRoute } from '../v33/route';
import {
  analysePolicy as policy,
  type PolicyInput,
  type PolicyAnalysis as PreviousPolicy,
} from '../v33/policy';
import { endpointProjection } from './projection';
import { laboratoryModel, type World } from './contract';
export type RouteAnalysis = Omit<PreviousRoute, 'model'> & { model: typeof laboratoryModel };
export type PolicyAnalysis = Omit<PreviousPolicy, 'model' | 'route'> & {
  model: typeof laboratoryModel;
  route: RouteAnalysis | null;
};
export function analyseRoutes(world: World, subnetId: string, destination: string) {
  const result = routes(endpointProjection(world), subnetId, destination);
  return result.ok
    ? { ok: true as const, analysis: { ...result.analysis, model: laboratoryModel } }
    : result;
}
export function analysePolicy(world: World, input: PolicyInput) {
  const result = policy(endpointProjection(world), input);
  return result.ok
    ? {
        ok: true as const,
        analysis: {
          ...result.analysis,
          model: laboratoryModel,
          route: result.analysis.route
            ? { ...result.analysis.route, model: laboratoryModel }
            : null,
        },
      }
    : result;
}
