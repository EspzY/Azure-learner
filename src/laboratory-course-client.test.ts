import { afterEach, expect, it, vi } from 'vitest';
import { courseApi } from './features/laboratory/course-client';
import { courseModel } from './laboratory/course/contract';
import { freshWorld, execute } from './laboratory/engine';
afterEach(() => vi.unstubAllGlobals());
const workspace = '00000000-1111-2222-3333-444444444444';
const courseBinding = {
  adapter: 'course-workspace@1',
  profile: 'az900-technical@1',
  contextId: '00000000-1111-2222-3333-555555555555',
  course: 'az900',
  workspace,
  model: courseModel,
  startThrough: 0,
  learningAttempt: null,
};
const snapshot = {
  workspace,
  courseBinding,
  world: freshWorld(courseModel),
  entries: [],
  historical: false,
};
it('uses only the course server endpoint and expected workspace, never document-memory transport', async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(snapshot), { status: 200 }));
  vi.stubGlobal('fetch', fetch);
  expect(await courseApi('state', undefined, workspace)).toEqual(snapshot);
  expect(fetch).toHaveBeenCalledExactlyOnceWith(
    '/api/course-laboratory/state',
    expect.objectContaining({
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'If-Laboratory-Workspace': workspace },
    }),
  );
});
it.each([409, 422])(
  'returns the original denied technical receipt at HTTP %s rather than inventing server-unavailable',
  async (status) => {
    const result = execute(
      snapshot.world,
      { commandId: 'denied', expectedRevision: 1, command: { type: 'ResetWorkspace' } },
      1,
    );
    expect(result.receipt.outcome).toBe('rejected');
    const response = { ...snapshot, ...result, receipt: result.receipt };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(response), { status })),
    );
    expect((await courseApi('command', {}, workspace)).receipt).toEqual(result.receipt);
  },
);
it.each([
  {},
  { ...courseBinding, workspace: 'foreign' },
  { ...courseBinding, startThrough: 5 },
  { ...courseBinding, model: 'laboratory@3.7.0' },
  { ...courseBinding, learningAttempt: 'invented' },
])('fails closed on an unverified course binding %j', async (b) => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ ...snapshot, courseBinding: b }), { status: 200 }),
      ),
  );
  await expect(courseApi('state')).rejects.toThrow('unverifiable-course-binding');
});
it('fails closed on backend errors, invalid JSON or a lost response without accepting local history', async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'backend-unavailable' }), { status: 503 }),
    )
    .mockResolvedValueOnce(new Response('not JSON', { status: 503 }))
    .mockRejectedValueOnce(Error('lost response'));
  vi.stubGlobal('fetch', fetch);
  await expect(courseApi('state')).rejects.toThrow('backend-unavailable');
  await expect(courseApi('state')).rejects.toThrow('server-result-unavailable');
  await expect(courseApi('state')).rejects.toThrow('server-result-unavailable');
  expect(fetch).toHaveBeenCalledTimes(3);
});
