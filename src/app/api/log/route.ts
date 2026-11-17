import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type ClientEventBody = { ts?: string; event?: string; data?: unknown };

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const ua = req.headers.get('user-agent') || '';
  const referer = req.headers.get('referer') || '';
  let body: ClientEventBody = {};
  try {
    body = (await req.json()) as ClientEventBody;
  } catch {}
  const payload = {
    type: 'client_event',
    ts: body?.ts || new Date().toISOString(),
    event: body?.event || 'unknown',
    data: body?.data || {},
    ip,
    ua,
    referer,
  };
  console.log(JSON.stringify(payload));
  return NextResponse.json({ ok: true });
}
