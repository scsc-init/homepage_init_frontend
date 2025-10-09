import { NextResponse } from 'next/server';

export async function POST(req) {
  const { jwt } = await req.json();

  if (!jwt) return NextResponse.json({ status: 400 });

  const res = NextResponse.json({ success: true });

  res.cookies.set('app_jwt', jwt, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
