import { fetchBackendServer } from '@/util/fetch/server';

export async function GET(_req, { params }) {
  const resolvedParams = await params;
  const segments = Array.isArray(resolvedParams?.path) ? resolvedParams.path : [];
  const targetPath = segments.map(encodeURIComponent).join('/');

  const res = await fetchBackendServer('GET', `/static/image/${targetPath}`);
  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
