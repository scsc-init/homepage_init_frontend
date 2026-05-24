import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { REDIRECT_COOKIE, isAllowedRedirectPath } from '@/util/loginRedirect';

function buildReturnPath(req) {
  const { pathname, search } = req.nextUrl;
  const target = `${pathname}${search || ''}`;
  return isAllowedRedirectPath(target) ? target : null;
}

function isPrefetchRequest(req) {
  const purpose = req.headers.get('purpose') || '';
  const secPurpose = req.headers.get('sec-purpose') || '';

  return (
    req.headers.get('next-router-prefetch') === '1' ||
    req.headers.get('x-middleware-prefetch') === '1' ||
    purpose.toLowerCase() === 'prefetch' ||
    secPurpose.toLowerCase().includes('prefetch')
  );
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

  if (returnTo && !isPrefetchRequest(req)) {
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
    '/sig/create',
    '/pig/create',
    '/sig/edit/:id(\\d+)',
    '/pig/edit/:id(\\d+)',
  ],
};
