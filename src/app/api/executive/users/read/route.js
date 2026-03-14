import { getServerSession } from 'next-auth';
import { authOptions } from '@/util/authOptions';
import { getBaseUrl } from '@/util/getBaseUrl';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  const jwt = session?.backendJwt;
  if (!jwt) return NextResponse.json({ message: '로그인 필요' }, { status: 401 });

  const res = await fetch(`${getBaseUrl()}/api/executive/users/read`, {
    method: 'GET',
    headers: { 'x-jwt': jwt },
    cache: 'no-store',
  });

  const body = await res.json();
  return NextResponse.json(body, { status: res.status });
}
