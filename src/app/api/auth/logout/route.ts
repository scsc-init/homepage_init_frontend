import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { REDIRECT_COOKIE } from '@/util/loginRedirect';

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/', req.url));

  res.cookies.set('app_jwt', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  const sessionCookieNames = new Set([
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    ...req.cookies
      .getAll()
      .filter(({ name }) => /^(?:__Secure-)?next-auth\.session-token(?:\.\d+)?$/.test(name))
      .map(({ name }) => name),
  ]);

  for (const name of sessionCookieNames) {
    res.cookies.set(name, '', {
      maxAge: 0,
      path: '/',
      secure: name.startsWith('__Secure-'),
    });
  }

  res.cookies.set(REDIRECT_COOKIE, '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  if (process.env.NEXTAUTH_URL?.replace(/\/+$/, '') === 'https://scsc.dev') {
    // Append separately to expire both host-only and shared cookies of the same name.
    for (const name of sessionCookieNames) {
      if (!name.startsWith('__Secure-')) continue;
      res.headers.append(
        'Set-Cookie',
        `${name}=; Path=/; Max-Age=0; Domain=.scsc.dev; HttpOnly; Secure; SameSite=Lax`,
      );
    }
  }

  return res;
}
