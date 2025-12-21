import { cookies } from 'next/headers';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';

export async function GET(_req, { params }) {
  const id = encodeURIComponent(params.id);
  const base = getBaseUrl();
  const url = `${base}/api/file/docs/download/${id}`;

  const appJwt = cookies().get('app_jwt')?.value || null;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-secret': getApiSecret(),
      ...(appJwt ? { 'x-jwt': appJwt } : {}),
    },
    cache: 'no-store',
  });

  const headers = new Headers();
  const ct = res.headers.get('Content-Type') || res.headers.get('content-type');
  const cd = res.headers.get('Content-Disposition') || res.headers.get('content-disposition');

  if (ct) headers.set('Content-Type', ct);
  if (cd) headers.set('Content-Disposition', cd);

  return new Response(res.body, {
    status: res.status,
    headers,
  });
}
