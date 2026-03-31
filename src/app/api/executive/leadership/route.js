import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';
import { NextResponse } from 'next/server';

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
    const vicePresidentIds = vicePresidentId
    .split(';')
    .map((id) => sanitizeId(id))
    .filter((id) => id !== '');
  if (presidentId === '') {
    return NextResponse.json(
      { detail: '회장 직책은 반드시 지정해야 합니다.' },
      { status: 400 },
    );
  }

  if (new Set(vicePresidentIds).size !== vicePresidentIds.length) {
    return NextResponse.json(
      { detail: '부회장끼리는 서로 다른 인물이어야 합니다.' },
      { status: 400 },
    );
  }

  if (vicePresidentIds.includes(presidentId)) {
    return NextResponse.json(
      { detail: '회장과 부회장은 서로 다른 인물이어야 합니다.' },
      { status: 400 },
    );
  }  
  const session = await getServerSession(authOptions);
  const appJwt = session?.backendJwt || null;

  try {
    const hdrs = {
      'Content-Type': 'application/json',
    };
    if (appJwt) hdrs['x-jwt'] = appJwt;

    const [prezUpdate, viceUpdate] = await Promise.all([
      fetch(`${process.env.BACKEND_URL || ''}/api/kv/main-president/update`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({ value: presidentId}),
        cache: 'no-store',
      }),
      fetch(`${process.env.BACKEND_URL || ''}/api/kv/vice-president/update`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({ value: vicePresidentId}),
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
