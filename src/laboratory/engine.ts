/** Version dispatch is bound to persisted workspace identity, never to command name. */
import * as legacy from './v3/domain';
import * as current from './v31/domain';
import * as v30 from './v3/contract';
import * as v31 from './v31/contract';
import * as routing from './v32/domain';
import * as v32 from './v32/contract';
import * as endpoints from './v33/domain';
import * as v33 from './v33/contract';
import * as compute from './v34/domain';
import * as v34 from './v34/contract';
import * as firewall from './v35/domain';
import * as v35 from './v35/contract';
export const models = [
  v30.laboratoryModel,
  v31.laboratoryModel,
  v32.laboratoryModel,
  v33.laboratoryModel,
  v34.laboratoryModel,
  v35.laboratoryModel,
] as const;
export type Model = (typeof models)[number];
export type World = v30.World | v31.World | v32.World | v33.World | v34.World | v35.World;
export type Request = v35.Request;
export type Command = v35.Command;
export type Receipt = v35.Receipt;
export type Entry = { model: Model; attempt: number; request: Request; receipt: Receipt };
export type Snapshot = { workspace: string; world: World; entries: Entry[]; historical: boolean };
export type CommandResult = Snapshot & { receipt: Receipt; redelivered: boolean };
export const canonical = legacy.canonical;
export const parseRequest = firewall.parseRequest;
export const freshWorld = (model: Model = v30.laboratoryModel): World =>
  model === v35.laboratoryModel
    ? firewall.freshWorld()
    : model === v34.laboratoryModel
      ? compute.freshWorld()
      : model === v33.laboratoryModel
        ? endpoints.freshWorld()
        : model === v32.laboratoryModel
          ? routing.freshWorld()
          : model === v31.laboratoryModel
            ? current.freshWorld()
            : legacy.freshWorld();
export const execute = (
  world: World,
  request: Request,
  sequence: number,
): { world: World; receipt: Receipt } =>
  world.model === v30.laboratoryModel
    ? legacy.execute(world, request as v30.Request, sequence)
    : world.model === v31.laboratoryModel
      ? current.execute(world, request as v31.Request, sequence)
      : world.model === v32.laboratoryModel
        ? routing.execute(world, request as v32.Request, sequence)
        : world.model === v33.laboratoryModel
          ? endpoints.execute(world, request as v33.Request, sequence)
          : world.model === v34.laboratoryModel
            ? compute.execute(world, request as v34.Request, sequence)
            : firewall.execute(world, request, sequence);
export const replay = (entries: Entry[], model: Model, through = entries.length): World | null => {
  if (!models.includes(model)) return null;
  return model === v30.laboratoryModel
    ? legacy.replay(entries as v30.Entry[], through)
    : model === v31.laboratoryModel
      ? current.replay(entries as v31.Entry[], through)
      : model === v32.laboratoryModel
        ? routing.replay(entries as v32.Entry[], through)
        : model === v33.laboratoryModel
          ? endpoints.replay(entries as v33.Entry[], through)
          : model === v34.laboratoryModel
            ? compute.replay(entries as v34.Entry[], through)
            : firewall.replay(entries as v35.Entry[], through);
};
