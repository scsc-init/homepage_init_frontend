import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';
import { getBaseUrl } from '@/util/getBaseUrl';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const jwt = session?.backendJwt;
    if (!jwt) return NextResponse.json({ message: '로그인 필요' }, { status: 401 });

    const res = await fetch(`${getBaseUrl()}/api/executive/users/read`, {
      method: 'GET',
      headers: { 'x-jwt': jwt },
      cache: 'no-store',
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return NextResponse.json({ message: text || 'backend error' }, { status: res.status });
    }

    const body = await res.json();
    return NextResponse.json(body);
  } catch (_err) {
    return NextResponse.json({ message: 'Failed to fetch executive users' }, { status: 502 });
  }
}
