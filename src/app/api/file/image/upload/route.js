import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';
import { getBaseUrl } from '@/util/getBaseUrl';

export async function POST(req) {
  const base = getBaseUrl();
  const url = `${base}/api/file/image/upload`;

  const session = await getServerSession(authOptions);
  const appJwt = session?.backendJwt || null;
  const formData = await req.formData();

  const res = await fetch(url, {
    method: 'POST',
    headers: {
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
