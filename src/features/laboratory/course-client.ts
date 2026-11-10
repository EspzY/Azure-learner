'use client';
import {
  courseModel,
  courseProfile,
  courseWorkspaceAdapter,
  courseUuid,
} from '@/laboratory/course/contract';
/** Persistent course transport only. Never reads the free document-memory client. */
export async function courseApi(action: string, request?: unknown, workspace?: string) {
  let response: Response, value;
  try {
    response = await fetch('/api/course-laboratory/' + action, {
      method: request === undefined ? 'GET' : 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        ...(request === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(workspace ? { 'If-Laboratory-Workspace': workspace } : {}),
      },
      ...(request === undefined ? {} : { body: JSON.stringify(request) }),
    });
    value = await response.json();
  } catch {
    throw Error('server-result-unavailable');
  }
  if (value.error) throw Error(value.error);
  const deniedCommand =
    action === 'command' &&
    [409, 422].includes(response.status) &&
    value.receipt?.outcome === 'rejected' &&
    !!value.world;
  if (!response.ok && !deniedCommand) throw Error('server-result-unavailable');
  if (value.world) {
    const b = value.courseBinding;
    if (
      !b ||
      b.adapter !== courseWorkspaceAdapter ||
      b.profile !== courseProfile ||
      b.course !== 'az900' ||
      b.model !== courseModel ||
      value.world.model !== courseModel ||
      !courseUuid(b.contextId) ||
      !courseUuid(value.workspace) ||
      b.startThrough !== 0 ||
      b.workspace !== value.workspace ||
      b.learningAttempt !== null
    )
      throw Error('unverifiable-course-binding');
  }
  return value;
}
export const courseAnalysis = (
  kind: 'analysis' | 'policy-analysis',
  params: URLSearchParams,
  workspace: string,
) => courseApi(kind + '?' + params, undefined, workspace);
