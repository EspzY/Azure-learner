import {
  execute as executeLegacy,
  freshEngine,
  type Engine as LegacyEngine,
} from '../chapter01/model';
import { continueEngine, execute, modelVersion, type Engine } from './model';
export function executeCurrent(engine: LegacyEngine, raw: unknown) {
  return (engine as Partial<Engine>).modelVersion === modelVersion
    ? execute(engine as Engine, raw)
    : executeLegacy(engine, raw);
}

/** Receipt equality is checked across the frozen v1 prefix and the versioned continuation. */
export function replayEngine(
  source: LegacyEngine,
  through = source.ledger.length,
): LegacyEngine | null {
  const current = source as Partial<Engine>;
  const v2 = current.modelVersion === modelVersion;
  const prefix = v2 ? current.prefix : source.ledger.length;
  if (
    !Number.isSafeInteger(through) ||
    !Number.isSafeInteger(prefix) ||
    prefix! < 0 ||
    prefix! > source.ledger.length ||
    through < 0 ||
    through > source.ledger.length
  )
    return null;
  let result: LegacyEngine = freshEngine();
  for (let i = 0; i < through; i++) {
    if (v2 && i === prefix) result = continueEngine(result);
    const e = source.ledger[i]!;
    const next =
      v2 && i >= prefix! ? execute(result as Engine, e.request) : executeLegacy(result, e.request);
    if (JSON.stringify(next.receipt) !== JSON.stringify(e.receipt)) return null;
    result = next.engine;
  }
  if (v2 && through === prefix) result = continueEngine(result);
  if (
    through === source.ledger.length &&
    JSON.stringify(result.world) !== JSON.stringify(source.world)
  )
    return null;
  return result;
}
