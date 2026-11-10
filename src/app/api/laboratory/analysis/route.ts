import { handle } from '@/laboratory/v3/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  return handle(request, 'analysis');
}
