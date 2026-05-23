import { NextResponse } from 'next/server';
import { fetchBackendServer } from '@/util/fetch/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);

  let res;
  try {
    res = await fetchBackendServer('GET', '/api/user/executives', {
      headers: {
        accept: 'application/json',
      },
      query: Object.fromEntries(url.searchParams.entries()),
    });
  } catch (_e) {
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
