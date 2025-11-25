// app/api/file/docs/upload/route.js
import { cookies } from 'next/headers';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';

export async function POST(req) {
  const base = getBaseUrl();
  const url = `${base}/api/file/docs/upload`;

  const appJwt = cookies().get('app_jwt')?.value || null;

  const headers = {
    'x-api-secret': getApiSecret(),
    ...(appJwt ? { 'x-jwt': appJwt } : {}),
  };

  const contentType = req.headers.get('content-type');
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: req.body,
    duplex: 'half',
  });

  const text = await res.text();

  return new Response(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/json',
    },
  });
}
