import { fetchBackendServer } from '@/util/fetch/server';

export async function GET(_req, { params }) {
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
