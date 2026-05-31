import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';

export async function POST() {
  const session = await getServerSession(authOptions);
  const appJwt = session?.backendJwt || null;

  if (!appJwt) {
    return Response.json({ detail: 'Unauthorized' }, { status: 401 });
  }

  const controller = new AbortController();
  const timeoutMs = 20_000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(
      `${process.env.BACKEND_URL || ''}/api/executive/scsc/global/status/backup`,
      {
        method: 'POST',
        headers: {
          'x-jwt': appJwt,
        },
        cache: 'no-store',
        signal: controller.signal,
      },
    );
  } catch (err) {
    clearTimeout(timeout);

    const isAbort =
      typeof err === 'object' &&
      err !== null &&
      ('name' in err ? err.name === 'AbortError' : false);

    return new Response(isAbort ? 'Upstream timeout' : 'Upstream fetch failed', {
      status: isAbort ? 504 : 502,
    });
  } finally {
    clearTimeout(timeout);
  }

  const headers = new Headers();
  const ct = res.headers.get('Content-Type') || res.headers.get('content-type');
  const cd = res.headers.get('Content-Disposition') || res.headers.get('content-disposition');
  const cl = res.headers.get('Content-Length') || res.headers.get('content-length');

  if (ct) headers.set('Content-Type', ct);
  if (cd) headers.set('Content-Disposition', cd);
  if (cl) headers.set('Content-Length', cl);

  if (!res.ok && !res.body) {
    return new Response(`Upstream error: ${res.status}`, {
      status: res.status,
      headers,
    });
  }

  return new Response(res.body, {
    status: res.status,
    headers,
  });
}
