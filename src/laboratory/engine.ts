/** Version dispatch is bound to persisted workspace identity, never to command name. */
import * as legacy from './v3/domain';
import * as current from './v31/domain';
import * as v30 from './v3/contract';
import * as v31 from './v31/contract';
export const models = [v30.laboratoryModel, v31.laboratoryModel] as const;
export type Model = (typeof models)[number];
export type World = v30.World | v31.World;
export type Request = v31.Request;
export type Command = v31.Command;
export type Receipt = v31.Receipt;
export type Entry = { model: Model; attempt: number; request: Request; receipt: Receipt };
export type Snapshot = { workspace: string; world: World; entries: Entry[]; historical: boolean };
export type CommandResult = Snapshot & { receipt: Receipt; redelivered: boolean };
export const canonical = legacy.canonical;
export const parseRequest = current.parseRequest;
export const freshWorld = (model: Model = v30.laboratoryModel): World =>
  model === v31.laboratoryModel ? current.freshWorld() : legacy.freshWorld();
export const execute = (
  world: World,
  request: Request,
  sequence: number,
): { world: World; receipt: Receipt } =>
  world.model === v30.laboratoryModel
    ? legacy.execute(world, request as v30.Request, sequence)
    : current.execute(world, request, sequence);
export const replay = (entries: Entry[], model: Model, through = entries.length): World | null => {
  if (!models.includes(model)) return null;
  return model === v30.laboratoryModel
    ? legacy.replay(entries as v30.Entry[], through)
    : current.replay(entries as v31.Entry[], through);
};
