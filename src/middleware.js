import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { REDIRECT_COOKIE, isAllowedRedirectPath } from '@/util/loginRedirect';

function buildReturnPath(req) {
  const { pathname, search } = req.nextUrl;
  const target = `${pathname}${search || ''}`;
  return isAllowedRedirectPath(target) ? target : null;
}

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const jwt = token?.backendJwt || null;
  if (jwt) return NextResponse.next();

  const returnTo = buildReturnPath(req);

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/us/login';
  loginUrl.search = '';

  const res = NextResponse.redirect(loginUrl);

  if (returnTo) {
    res.cookies.set(REDIRECT_COOKIE, returnTo, {
      path: '/',
      maxAge: 300,
      sameSite: 'lax',
      secure: req.nextUrl.protocol === 'https:',
    });
  }

  return res;
}

export const config = {
  matcher: [
    '/us/fund-apply/:path*',
    '/board/:path*',
    '/article/:path*',
    '/sig/:id(\\d+)',
    '/pig/:id(\\d+)',
  ],
};
