import { cookies } from 'next/headers';
import { getBaseUrl } from '@/util/getBaseUrl';

export async function GET(_req, { params }) {
  const segments = Array.isArray(params?.path) ? params.path : [];
  const targetPath = segments.map(encodeURIComponent).join('/');

  const base = getBaseUrl();
  const url = `${base}/static/image/${targetPath}`;

  const appJwt = cookies().get('app_jwt')?.value || null;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...(appJwt ? { 'x-jwt': appJwt } : {}),
    },
    cache: 'no-store',
  });
  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
