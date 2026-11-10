import { analyseRoutes as frozenAnalyse, type Analysis as PreviousAnalysis } from '../v32/analysis';
import { routingProjection } from './projection';
import { laboratoryModel, type World } from './contract';
export type RouteAnalysis = Omit<PreviousAnalysis, 'model'> & { model: typeof laboratoryModel };
export function analyseRoutes(world: World, subnetId: string, destination: string) {
  const result = frozenAnalyse(routingProjection(world), subnetId, destination);
  return result.ok
    ? {
        ok: true as const,
        analysis: { ...result.analysis, model: laboratoryModel as typeof laboratoryModel },
      }
    : result;
}
