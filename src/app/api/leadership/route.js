import { NextResponse } from 'next/server';
import { handleApiRequest } from '@/app/api/apiWrapper';

export async function GET() {
  try {
    const res = await handleApiRequest('GET', '/api/kv/leaders');

    if (!res.ok) {
      // When the key does not exist or permission denied, fall back to empty state.
      return NextResponse.json(
        { president_id: null, vice_president_id: null },
        { status: 200 },
      );
    }

    const payload = await res.json().catch(() => null);
    if (!payload || typeof payload.value !== 'string') {
      return NextResponse.json(
        { president_id: null, vice_president_id: null },
        { status: 200 },
      );
    }
    const parsed = JSON.parse(payload.value || '{}');
    const presidentId =
      typeof parsed?.president_id === 'string' && parsed.president_id.trim()
        ? parsed.president_id.trim()
        : null;
    const vicePresidentId =
      typeof parsed?.vice_president_id === 'string' && parsed.vice_president_id.trim()
        ? parsed.vice_president_id.trim()
        : null;
    return NextResponse.json({ president_id: presidentId, vice_president_id: vicePresidentId });
  } catch {
    return NextResponse.json({ president_id: null, vice_president_id: null }, { status: 200 });
  }
}
