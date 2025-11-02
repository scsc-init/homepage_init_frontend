import { NextResponse } from 'next/server';
import { handleApiRequest } from '@/app/api/apiWrapper';

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

  const sanitizedRequest = new Request('http://localhost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const res = await handleApiRequest('POST', '/api/kv/leaders/update', {}, sanitizedRequest);

  if (!res.ok) {
    const text = await res.text();
    return new NextResponse(text || 'Failed to update leadership entries', {
      status: res.status,
    });
  }

  return NextResponse.json({
    president_id: presidentId || null,
    vice_president_id: vicePresidentId || null,
  });
}
