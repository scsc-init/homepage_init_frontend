import { NextResponse } from 'next/server';

const REDIRECT_COOKIE = 'redirect_after_login';
const AUTH_COOKIE = 'app_jwt';

function isSafeInternalPath(value) {
  if (!value || typeof value !== 'string') return false;
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//')) return false;
  if (value.includes('://')) return false;
  if (value.toLowerCase().startsWith('/javascript:')) return false;
  return true;
}

function buildReturnPath(req) {
  const { pathname, search } = req.nextUrl;
  const target = `${pathname}${search || ''}`;
  return isSafeInternalPath(target) ? target : '/';
}

export function middleware(req) {
  const jwt = req.cookies.get(AUTH_COOKIE)?.value;
  if (jwt) return NextResponse.next();

  const returnTo = buildReturnPath(req);

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/us/login';
  loginUrl.search = '';

  const res = NextResponse.redirect(loginUrl);

  res.cookies.set(REDIRECT_COOKIE, returnTo, {
    path: '/',
    maxAge: 300,
    sameSite: 'lax',
    secure: req.nextUrl.protocol === 'https:',
  });

  return res;
}

export const config = {
  matcher: [
    '/us/fund-apply/:path*',
    '/board/:path*',
    '/article/:path*',
    '/sig/:path*',
    '/pig/:path*',
    '/us/edit-user-info/:path*',
    '/executive/:path*',
  ],
};
