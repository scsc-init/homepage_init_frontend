import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getBackendBase() {
  const base = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '').trim();
  if (!base) return '';
  return base.replace(/\/+$/, '');
}

export async function GET(request) {
  const backendBase = getBackendBase();
  if (!backendBase) {
    return NextResponse.json({ detail: 'BACKEND_URL is not set' }, { status: 500 });
  }

  const url = new URL(request.url);
  const target = `${backendBase}/api/user/executives${url.search || ''}`;

  let res;
  try {
    res = await fetch(target, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
    });
  } catch (e) {
    return NextResponse.json({ detail: 'Failed to reach backend' }, { status: 502 });
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'content-type': contentType || 'text/plain; charset=utf-8',
      },
    });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
