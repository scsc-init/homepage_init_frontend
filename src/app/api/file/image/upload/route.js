import { cookies } from 'next/headers';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';

export async function POST(req) {
  const base = getBaseUrl();
  const url = `${base}/api/file/image/upload`;

  const appJwt = cookies().get('app_jwt')?.value || null;
  const formData = await req.formData();

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-secret': getApiSecret(),
      ...(appJwt ? { 'x-jwt': appJwt } : {}),
    },
    body: formData,
  });

  const text = await res.text().catch(() => '');

  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  return new Response(data ? JSON.stringify(data) : text, {
    status: res.status,
    headers: data ? { 'Content-Type': 'application/json' } : {},
  });
}
