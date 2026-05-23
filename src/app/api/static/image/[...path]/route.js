import { fetchBackendServer } from '@/util/fetch/server';

export async function GET(_req, { params }) {
  const segments = Array.isArray(params?.path) ? params.path : [];
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
