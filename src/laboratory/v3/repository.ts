import 'server-only';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import {
  canonical,
  execute,
  freshWorld,
  replay,
  type Model,
  type Entry,
  type Request,
  type Snapshot,
  type World,
  type CommandResult,
} from '../engine';
import { limits, laboratoryModel } from './contract';
import {
  courseWorkspaceAdapter,
  courseEvidenceAdapter,
  courseProfile,
  courseModel,
  courseUuid,
  parseCapture,
  type WorkspacePurpose,
  type CourseBinding,
  type CaptureRequest,
  type CourseEvidence,
} from '../course/contract';
type WorkspaceRow = {
  id: string;
  world: World;
  sequence: number;
  model: Model;
  courseBinding?: CourseBinding;
};
type EvidenceRow = {
  id: string;
  binding_id: string;
  model: string;
  adapter: string;
  through: number;
  expected_revision: number;
  revision: number;
  attempt: number;
  history_digest: string;
};
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
    private purpose: WorkspacePurpose = 'free',
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
    const result = await client.query<WorkspaceRow>(
      `SELECT id,world,sequence,model FROM laboratory_v3.workspaces w WHERE token_hash=$1 AND expires_at>now() AND COALESCE(to_jsonb(w)->>'purpose','free')=$2${lock ? ' FOR UPDATE' : ''}`,
      [tokenHash(token), this.purpose],
    );
    if (!result.rows[0]) throw new LabError('session-required', 401);
    const row = result.rows[0];
    if (this.purpose === 'course-technical') row.courseBinding = await this.binding(client, row);
    const rate = await client.query(
      "UPDATE laboratory_v3.workspaces SET request_count=CASE WHEN window_start<now()-interval '1 minute' THEN 1 ELSE request_count+1 END,window_start=CASE WHEN window_start<now()-interval '1 minute' THEN now() ELSE window_start END WHERE id=$1 RETURNING request_count",
      [row.id],
    );
    if (rate.rows[0].request_count > 120) throw new LabError('request-limit', 429);
    return row;
  }
  private async binding(client: PoolClient, row: WorkspaceRow): Promise<CourseBinding> {
    const result = await client.query<{
      id: string;
      workspace_id: string;
      adapter: string;
      profile: string;
      course: string;
      model: string;
    }>(
      'SELECT id,workspace_id,adapter,profile,course,model FROM laboratory_v3.course_bindings WHERE workspace_id=$1',
      [row.id],
    );
    const b = result.rows[0];
    if (
      !b ||
      !courseUuid(b.id) ||
      b.workspace_id !== row.id ||
      b.adapter !== courseWorkspaceAdapter ||
      b.profile !== courseProfile ||
      b.course !== 'az900' ||
      b.model !== courseModel ||
      row.model !== courseModel
    )
      throw new LabError('unverifiable-course-binding', 503);
    return {
      adapter: courseWorkspaceAdapter,
      contextId: b.id,
      workspace: row.id,
      profile: courseProfile,
      course: 'az900',
      model: courseModel,
      startThrough: 0,
      learningAttempt: null,
    };
  }
  private snapshot(
    row: WorkspaceRow,
    entries: Entry[],
    world = row.world,
    historical = false,
  ): Snapshot {
    return {
      workspace: row.id,
      world,
      entries,
      historical,
      ...(row.courseBinding ? { courseBinding: row.courseBinding } : {}),
    };
  }
  private course(row: WorkspaceRow) {
    if (this.purpose !== 'course-technical' || !row.courseBinding)
      throw new LabError('course-authority-required', 403);
    return row.courseBinding;
  }
  private async verified(
    client: PoolClient,
    row: { id: string; world: World; sequence: number; model: Model },
  ): Promise<Entry[]> {
    const result = await client.query<Entry>(
      `SELECT ${columns} FROM laboratory_v3.events WHERE workspace_id=$1 ORDER BY sequence`,
      [row.id],
    );
    const entries = result.rows,
      original = replay(entries, row.model);
    if (
      row.world.model !== row.model ||
      entries.length !== row.sequence ||
      !original ||
      canonical(original) !== canonical(row.world)
    )
      throw new LabError('unverifiable-history', 503);
    return entries;
  }
  createSession = async (model: Model = laboratoryModel) =>
    this.transaction(async (client) => {
      if (this.purpose === 'course-technical' && model !== courseModel)
        throw new LabError('unsupported-course-model', 422);
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
        world = freshWorld(model);
      if (this.purpose === 'course-technical') {
        await client.query(
          "INSERT INTO laboratory_v3.workspaces(id,token_hash,expires_at,world,model,purpose) VALUES($1,$2,now()+interval '7 days',$3,$4,'course-technical')",
          [id, tokenHash(token), world, model],
        );
        await client.query(
          'INSERT INTO laboratory_v3.course_bindings(id,workspace_id,purpose,adapter,profile,course,model) VALUES($1,$2,$3,$4,$5,$6,$7)',
          [randomUUID(), id, this.purpose, courseWorkspaceAdapter, courseProfile, 'az900', model],
        );
      } else
        await client.query(
          "INSERT INTO laboratory_v3.workspaces(id,token_hash,expires_at,world,model) VALUES($1,$2,now()+interval '7 days',$3,$4)",
          [id, tokenHash(token), world, model],
        );
      const row: WorkspaceRow = { id, world, sequence: 0, model };
      if (this.purpose === 'course-technical') row.courseBinding = await this.binding(client, row);
      return {
        token,
        snapshot: this.snapshot(row, []),
      };
    });
  read = async (token: string, through?: number): Promise<Snapshot> =>
    this.transaction(async (client) => {
      const row = await this.workspace(client, token),
        entries = await this.verified(client, row);
      if (through !== undefined) {
        const world = replay(entries, row.model, through);
        if (!world) throw new LabError('invalid-through', 400);
        return this.snapshot(row, entries.slice(0, through), world, through !== entries.length);
      }
      return this.snapshot(row, entries);
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
          ...this.snapshot(row, entries),
          receipt: prior.receipt,
          redelivered: true,
        };
      }
      if (entries.length >= limits.events - (request.command.type === 'ResetWorkspace' ? 0 : 1))
        throw new LabError('history-limit', 409);
      const next = execute(row.world, request, entries.length + 1);
      const entry: Entry = {
        model: row.model,
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
          row.model,
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
        ...this.snapshot(row, [...entries, entry], next.world),
        receipt: next.receipt,
        redelivered: false,
      };
    });
  private evidence(row: WorkspaceRow, entries: Entry[], stored: EvidenceRow) {
    const binding = this.course(row),
      world = replay(entries, row.model, stored.through);
    const historyDigest = createHash('sha256')
      .update(
        canonical({
          adapter: courseEvidenceAdapter,
          binding,
          entries: entries.slice(0, stored.through),
        }),
      )
      .digest('hex');
    if (
      !world ||
      stored.binding_id !== binding.contextId ||
      stored.model !== row.model ||
      stored.adapter !== courseEvidenceAdapter ||
      world.revision !== stored.revision ||
      world.attempt !== stored.attempt ||
      historyDigest !== stored.history_digest
    )
      throw new LabError('unverifiable-course-evidence', 503);
    const evidence: CourseEvidence = {
      adapter: courseEvidenceAdapter,
      id: stored.id,
      binding,
      through: stored.through,
      revision: stored.revision,
      attempt: stored.attempt,
      historyDigest,
    };
    return {
      evidence,
      snapshot: this.snapshot(
        row,
        entries.slice(0, stored.through),
        world,
        stored.through !== entries.length,
      ),
    };
  }
  captureEvidence = async (token: string, request: CaptureRequest, expectedWorkspace: string) => {
    if (!parseCapture(request)) throw new LabError('invalid-evidence-request', 400);
    return this.transaction(async (client) => {
      const row = await this.workspace(client, token),
        binding = this.course(row),
        entries = await this.verified(client, row);
      if (row.id !== expectedWorkspace) throw new LabError('workspace-changed', 409);
      const prior = await client.query<EvidenceRow>(
        'SELECT * FROM laboratory_v3.course_evidence WHERE id=$1 AND workspace_id=$2',
        [request.captureId, row.id],
      );
      if (prior.rows[0]) {
        if (
          prior.rows[0].through !== request.through ||
          prior.rows[0].expected_revision !== request.expectedRevision
        )
          throw new LabError('capture-id-conflict', 409);
        return { ...this.evidence(row, entries, prior.rows[0]), redelivered: true };
      }
      if (request.expectedRevision !== row.world.revision)
        throw new LabError('stale-revision', 409);
      const world = replay(entries, row.model, request.through);
      if (!world) throw new LabError('invalid-through', 400);
      const count = await client.query<{ n: number }>(
        'SELECT count(*)::integer AS n FROM laboratory_v3.course_evidence WHERE workspace_id=$1',
        [row.id],
      );
      if (count.rows[0]!.n >= 512) throw new LabError('evidence-limit', 409);
      const hash = createHash('sha256')
        .update(
          canonical({
            adapter: courseEvidenceAdapter,
            binding,
            entries: entries.slice(0, request.through),
          }),
        )
        .digest('hex');
      const saved = await client.query<EvidenceRow>(
        'INSERT INTO laboratory_v3.course_evidence(id,binding_id,workspace_id,model,adapter,through,expected_revision,revision,attempt,history_digest) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT DO NOTHING RETURNING *',
        [
          request.captureId,
          binding.contextId,
          row.id,
          row.model,
          courseEvidenceAdapter,
          request.through,
          request.expectedRevision,
          world.revision,
          world.attempt,
          hash,
        ],
      );
      if (!saved.rows[0]) throw new LabError('capture-id-conflict', 409);
      return { ...this.evidence(row, entries, saved.rows[0]!), redelivered: false };
    });
  };
  readEvidence = async (token: string, id: string, expectedWorkspace: string) => {
    if (!courseUuid(id)) throw new LabError('invalid-evidence-id', 400);
    return this.transaction(async (client) => {
      const row = await this.workspace(client, token),
        entries = await this.verified(client, row);
      this.course(row);
      if (row.id !== expectedWorkspace) throw new LabError('workspace-changed', 409);
      const saved = await client.query<EvidenceRow>(
        'SELECT * FROM laboratory_v3.course_evidence WHERE id=$1 AND workspace_id=$2',
        [id, row.id],
      );
      if (!saved.rows[0]) throw new LabError('evidence-not-found', 404);
      return this.evidence(row, entries, saved.rows[0]);
    });
  };
}
