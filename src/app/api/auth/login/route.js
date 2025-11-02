import { NextResponse } from 'next/server';
import { handleApiRequest } from '@/app/api/apiWrapper';

export async function POST(request) {
  const res = await handleApiRequest('POST', '/api/user/login', {}, request);

  if (!res.ok) {
    return NextResponse.json({ error: 'login failed' }, { status: 400 });
  }

  let jwt;
  try {
    const data = await res.json();
    jwt = data.jwt;
  } catch {
    return NextResponse.json({ error: 'login failed' }, { status: 400 });
  }

  if (!jwt) return NextResponse.json({ error: 'login failed' }, { status: 400 });

  const response = NextResponse.json({ success: true });

  response.cookies.set('app_jwt', jwt, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
