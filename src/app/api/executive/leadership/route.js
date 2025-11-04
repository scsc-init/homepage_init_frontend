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

  const cookieStore = cookies();
  const appJwt = cookieStore.get('app_jwt')?.value || null;

  try {
    let apiSecret = getApiSecret();
    if (!apiSecret) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Missing API_SECRET environment variable');
      }
      apiSecret = 'development-missing-api-secret';
    }
    const hdrs = {
      'Content-Type': 'application/json',
      'x-api-secret': apiSecret,
    };
    if (appJwt) hdrs['x-jwt'] = appJwt;

    const [prezUpdate, viceUpdate] = await Promise.all([
      fetch(`${getBaseUrl()}/api/kv/main-president/update`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({ value: presidentId || null }),
        cache: 'no-store',
      }),
      fetch(`${getBaseUrl()}/api/kv/vice-president/update`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({ value: vicePresidentId || null }),
        cache: 'no-store',
      }),
    ]);

    if (!prezUpdate.ok || !viceUpdate.ok) {
      const msg1 = prezUpdate.ok ? '' : await prezUpdate.text().catch(() => '');
      const msg2 = viceUpdate.ok ? '' : await viceUpdate.text().catch(() => '');
      const text =
        [msg1, msg2].filter(Boolean).join(' | ') || 'Failed to update leadership entries';
      return new NextResponse(text, {
        status:
          (!prezUpdate.ok && prezUpdate.status) || (!viceUpdate.ok && viceUpdate.status) || 500,
      });
    }

    return NextResponse.json({
      president_id: presidentId || null,
      vice_president_id: vicePresidentId || null,
    });
  } catch (err) {
    const detail =
      err instanceof Error && err.message
        ? `Upstream update failed: ${err.message}`
        : 'Upstream update failed';
    return NextResponse.json({ detail }, { status: 502 });
  }
}
