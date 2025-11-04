import { NextResponse } from 'next/server';
import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET() {
  try {
    const [prezRes, viceRes] = await Promise.all([
      handleApiRequest('GET', '/api/kv/main-president'),
      handleApiRequest('GET', '/api/kv/vice-president'),
    ]);

    let president_id = null;
    let vice_president_id = null;

    if (prezRes.ok) {
      const prezPayload = await prezRes.json().catch(() => null);
      const v = prezPayload?.value;
      president_id = typeof v === 'string' && v.trim() ? v.trim() : null;
      if (v === null) president_id = null;
    }

    if (viceRes.ok) {
      const vicePayload = await viceRes.json().catch(() => null);
      const v = vicePayload?.value;
      vice_president_id = typeof v === 'string' && v.trim() ? v.trim() : null;
      if (v === null) vice_president_id = null;
    }

    return NextResponse.json({ president_id, vice_president_id }, { status: 200 });
  } catch {
    return NextResponse.json({ president_id: null, vice_president_id: null }, { status: 200 });
  }
}
