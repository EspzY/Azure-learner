import 'server-only';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import { canonical, execute, freshWorld, replay } from './domain';
import {
  laboratoryModel,
  limits,
  type Entry,
  type Request,
  type Snapshot,
  type World,
  type CommandResult,
} from './contract';
export class LabError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
  }
}
export const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');
const columns = 'model,attempt,request,receipt';
export class Repository {
  // Controlled integration fault point; HTTP callers cannot supply hooks.
  constructor(
    private pool: Pool,
    private beforeCommit?: () => void,
  ) {}
  private async transaction<T>(
    run: (client: PoolClient) => Promise<T>,
    readonly = false,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query(readonly ? 'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY' : 'BEGIN');
      await client.query("SET LOCAL statement_timeout='5000ms'");
      await client.query("SET LOCAL lock_timeout='3000ms'");
      const result = await run(client);
      this.beforeCommit?.();
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      throw e;
    } finally {
      client.release();
    }
  }
  private async workspace(client: PoolClient, token: string, lock = true) {
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new LabError('session-required', 401);
    const result = await client.query<{ id: string; world: World; sequence: number }>(
      `SELECT id,world,sequence FROM laboratory_v3.workspaces WHERE token_hash=$1 AND expires_at>now()${lock ? ' FOR UPDATE' : ''}`,
      [tokenHash(token)],
    );
    if (!result.rows[0]) throw new LabError('session-required', 401);
    const row = result.rows[0];
    const rate = await client.query(
      "UPDATE laboratory_v3.workspaces SET request_count=CASE WHEN window_start<now()-interval '1 minute' THEN 1 ELSE request_count+1 END,window_start=CASE WHEN window_start<now()-interval '1 minute' THEN now() ELSE window_start END WHERE id=$1 RETURNING request_count",
      [row.id],
    );
    if (rate.rows[0].request_count > 120) throw new LabError('request-limit', 429);
    return row;
  }
  private async verified(
    client: PoolClient,
    row: { id: string; world: World; sequence: number },
  ): Promise<Entry[]> {
    const result = await client.query<Entry>(
      `SELECT ${columns} FROM laboratory_v3.events WHERE workspace_id=$1 ORDER BY sequence`,
      [row.id],
    );
    const entries = result.rows,
      original = replay(entries);
    if (
      entries.length !== row.sequence ||
      !original ||
      canonical(original) !== canonical(row.world)
    )
      throw new LabError('unverifiable-history', 503);
    return entries;
  }
  createSession = async () =>
    this.transaction(async (client) => {
      await client.query('SELECT id FROM laboratory_v3.admission WHERE id=1 FOR UPDATE');
      const rate = await client.query(
        "UPDATE laboratory_v3.admission SET count=CASE WHEN window_start<now()-interval '1 minute' THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<now()-interval '1 minute' THEN now() ELSE window_start END WHERE id=1 RETURNING count",
      );
      if (
        rate.rows[0].count > 100 ||
        (await client.query('SELECT count(*)::integer AS n FROM laboratory_v3.workspaces')).rows[0]
          .n >= 2048
      )
        throw new LabError('session-capacity', 429);
      const id = randomUUID();
      const token = randomBytes(32).toString('base64url'),
        world = freshWorld();
      await client.query(
        "INSERT INTO laboratory_v3.workspaces(id,token_hash,expires_at,world) VALUES($1,$2,now()+interval '7 days',$3)",
        [id, tokenHash(token), world],
      );
      return {
        token,
        snapshot: { workspace: id, world, entries: [], historical: false } as Snapshot,
      };
    });
  read = async (token: string, through?: number): Promise<Snapshot> =>
    this.transaction(async (client) => {
      const row = await this.workspace(client, token),
        entries = await this.verified(client, row);
      if (through !== undefined) {
        const world = replay(entries, through);
        if (!world) throw new LabError('invalid-through', 400);
        return {
          workspace: row.id,
          world,
          entries: entries.slice(0, through),
          historical: through !== entries.length,
        };
      }
      return { workspace: row.id, world: row.world, entries, historical: false };
    });
  review = async (token: string, request: Request, expectedWorkspace?: string) =>
    this.transaction(async (client) => {
      const row = await this.workspace(client, token),
        entries = await this.verified(client, row);
      if (expectedWorkspace !== undefined && expectedWorkspace !== row.id)
        throw new LabError('workspace-changed', 409);
      return {
        workspace: row.id,
        preview: execute(row.world, request, entries.length + 1).receipt,
        revision: row.world.revision,
      };
    });
  command = async (
    token: string,
    request: Request,
    expectedWorkspace?: string,
  ): Promise<CommandResult> =>
    this.transaction(async (client) => {
      const row = await this.workspace(client, token, true),
        entries = await this.verified(client, row);
      if (expectedWorkspace !== undefined && expectedWorkspace !== row.id)
        throw new LabError('workspace-changed', 409);
      const prior = entries.find((e) => e.request.commandId === request.commandId);
      if (prior) {
        if (canonical(prior.request) !== canonical(request))
          throw new LabError('command-id-conflict', 409);
        return {
          workspace: row.id,
          world: row.world,
          entries,
          historical: false,
          receipt: prior.receipt,
          redelivered: true,
        };
      }
      if (entries.length >= limits.events - (request.command.type === 'ResetWorkspace' ? 0 : 1))
        throw new LabError('history-limit', 409);
      const next = execute(row.world, request, entries.length + 1);
      const entry: Entry = {
        model: laboratoryModel,
        attempt: row.world.attempt,
        request,
        receipt: next.receipt,
      };
      await client.query(
        'INSERT INTO laboratory_v3.events(workspace_id,sequence,command_id,model,attempt,request,receipt) VALUES($1,$2,$3,$4,$5,$6,$7)',
        [
          row.id,
          next.receipt.sequence,
          request.commandId,
          laboratoryModel,
          entry.attempt,
          request,
          next.receipt,
        ],
      );
      await client.query('UPDATE laboratory_v3.workspaces SET world=$1,sequence=$2 WHERE id=$3', [
        next.world,
        next.receipt.sequence,
        row.id,
      ]);
      return {
        workspace: row.id,
        world: next.world,
        entries: [...entries, entry],
        historical: false,
        receipt: next.receipt,
        redelivered: false,
      };
    });
}
