import { NextResponse } from 'next/server';
import { isAllowedRedirectPath } from '@/util/loginRedirect';

const REDIRECT_COOKIE = 'redirect_after_login';
const AUTH_COOKIE = 'app_jwt';

function buildReturnPath(req) {
  const { pathname, search } = req.nextUrl;
  const target = `${pathname}${search || ''}`;
  return isAllowedRedirectPath(target) ? target : null;
}

export function middleware(req) {
  const jwt = req.cookies.get(AUTH_COOKIE)?.value;
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
    '/sig/:path*',
    '/pig/:path*',
  ],
};
