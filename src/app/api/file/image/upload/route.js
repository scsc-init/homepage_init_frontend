// app/api/file/image/upload/route.js
import { cookies } from 'next/headers';
import { getBaseUrl } from '@/util/getBaseUrl';

export async function POST(req) {
  const base = getBaseUrl();
  const url = `${base}/api/file/image/upload`;

  const appJwt = cookies().get('app_jwt')?.value || null;
  const formData = await req.formData();

  const headers = {
    ...(appJwt ? { 'x-jwt': appJwt } : {}),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
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
