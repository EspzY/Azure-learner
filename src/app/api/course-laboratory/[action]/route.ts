import { handle } from '@/laboratory/v3/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ action: string }> };
async function route(request: Request, context: Context) {
  const { action } = await context.params;
  const allowed =
    request.method === 'GET'
      ? ['state', 'analysis', 'policy-analysis', 'evidence']
      : ['session', 'review', 'command', 'evidence'];
  if (!allowed.includes(action))
    return new Response(null, { status: 405, headers: { 'Cache-Control': 'no-store' } });
  return handle(request, action as Parameters<typeof handle>[1], 'course-technical');
}
export const GET = route;
export const POST = route;
