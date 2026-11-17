import { fetchBackendServer } from '@/util/fetch/server';
import type { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = encodeURIComponent(resolvedParams.id);

  const res = await fetchBackendServer('GET', `/api/file/image/download/${id}`);

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
