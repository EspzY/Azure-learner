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
import * as remediation from './v36/domain';
import * as v36 from './v36/contract';
import * as topology from './v37/domain';
import * as v37 from './v37/contract';
import * as applications from './v38/domain';
import * as v38 from './v38/contract';
import * as integrated from './v39/domain';
import * as v39 from './v39/contract';
export const models = [
  v30.laboratoryModel,
  v31.laboratoryModel,
  v32.laboratoryModel,
  v33.laboratoryModel,
  v34.laboratoryModel,
  v35.laboratoryModel,
  v36.laboratoryModel,
  v37.laboratoryModel,
  v38.laboratoryModel,
  v39.laboratoryModel,
] as const;
export type Model = (typeof models)[number];
export type World =
  | v30.World
  | v31.World
  | v32.World
  | v33.World
  | v34.World
  | v35.World
  | v36.World
  | v37.World
  | v38.World
  | v39.World;
export type Request = v39.Request;
export type Command = v39.Command;
export type Receipt = v39.Receipt;
export type Entry = { model: Model; attempt: number; request: Request; receipt: Receipt };
export type Snapshot = { workspace: string; world: World; entries: Entry[]; historical: boolean };
export type CommandResult = Snapshot & { receipt: Receipt; redelivered: boolean };
export const canonical = legacy.canonical;
export const parseRequest = topology.parseRequest;
export const freshWorld = (model: Model = v30.laboratoryModel): World =>
  model === v39.laboratoryModel
    ? integrated.freshWorld()
    : model === v38.laboratoryModel
      ? applications.freshWorld()
      : model === v37.laboratoryModel
        ? topology.freshWorld()
        : model === v36.laboratoryModel
          ? remediation.freshWorld()
          : model === v35.laboratoryModel
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
            : world.model === v35.laboratoryModel
              ? firewall.execute(world, request as v35.Request, sequence)
              : world.model === v36.laboratoryModel
                ? remediation.execute(world, request as v36.Request, sequence)
                : world.model === v37.laboratoryModel
                  ? topology.execute(world, request as v37.Request, sequence)
                  : world.model === v38.laboratoryModel
                    ? applications.execute(world, request as v38.Request, sequence)
                    : integrated.execute(world, request, sequence);
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
            : model === v35.laboratoryModel
              ? firewall.replay(entries as v35.Entry[], through)
              : model === v36.laboratoryModel
                ? remediation.replay(entries as v36.Entry[], through)
                : model === v37.laboratoryModel
                  ? topology.replay(entries as v37.Entry[], through)
                  : model === v38.laboratoryModel
                    ? applications.replay(entries as v38.Entry[], through)
                    : integrated.replay(entries as v39.Entry[], through);
};
