import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';
import { getBaseUrl } from '@/util/getBaseUrl';

export async function POST(req) {
  const base = getBaseUrl();
  const url = `${base}/api/file/docs/upload`;

  const session = await getServerSession(authOptions);
  const appJwt = session?.backendJwt || null;

  const headers = {
    ...(appJwt ? { 'x-jwt': appJwt } : {}),
  };

  const contentType = req.headers.get('Content-Type');
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
