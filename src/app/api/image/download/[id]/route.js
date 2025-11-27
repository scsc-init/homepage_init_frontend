import { cookies } from 'next/headers';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';

export async function GET(_req, { params }) {
  const id = encodeURIComponent(params.id);
  const base = getBaseUrl();
  const url = `${base}/api/file/image/download/${id}`;

  const appJwt = cookies().get('app_jwt')?.value || null;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-secret': getApiSecret(),
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
