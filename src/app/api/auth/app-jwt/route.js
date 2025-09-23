import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  const { jwt, maxAge } = await req.json();
  if (!jwt) return NextResponse.json({ error: 'missing jwt' }, { status: 400 });

  cookies().set('app_jwt', jwt, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: typeof maxAge === 'number' ? maxAge : 60 * 60 * 24 * 7,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().set('app_jwt', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
