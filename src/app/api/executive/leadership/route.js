import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';

function sanitizeId(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' && value.trim()) return value.trim();
  return '';
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid JSON body' }, { status: 400 });
  }

  const presidentId = sanitizeId(body?.president_id);
  const vicePresidentId = sanitizeId(body?.vice_president_id);

  const payload = {
    value: JSON.stringify({
      president_id: presidentId || null,
      vice_president_id: vicePresidentId || null,
    }),
  };

  const cookieStore = cookies();
  const appJwt = cookieStore.get('app_jwt')?.value || null;

  let res;
  try {
    let apiSecret = getApiSecret();
    if (!apiSecret) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Missing API_SECRET environment variable');
      }
      console.warn('API_SECRET is missing; using development placeholder value.');
      apiSecret = 'development-missing-api-secret';
    }
    const hdrs = {
      'Content-Type': 'application/json',
      'x-api-secret': apiSecret,
    };
    if (appJwt) hdrs['x-jwt'] = appJwt;

    res = await fetch(`${getBaseUrl()}/api/kv/leaders/update`, {
      method: 'POST',
      headers: hdrs,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
  } catch (err) {
    const detail =
      err instanceof Error && err.message
        ? `Upstream update failed: ${err.message}`
        : 'Upstream update failed';
    return NextResponse.json({ detail }, { status: 502 });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return new NextResponse(text || 'Failed to update leadership entries', {
      status: res.status,
    });
  }

  return NextResponse.json({
    president_id: presidentId || null,
    vice_president_id: vicePresidentId || null,
  });
}
