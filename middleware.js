import { NextResponse } from 'next/server';

const REDIRECT_COOKIE = 'redirect_after_login';

function isSafeInternalPath(value) {
  if (!value || typeof value !== 'string') return false;
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//')) return false;
  if (value.includes('://')) return false;
  if (value.toLowerCase().startsWith('/javascript:')) return false;
  return true;
}

function isLoginPath(pathname) {
  if (!pathname) return false;
  return pathname === '/login' || pathname === '/us/login' || pathname.startsWith('/us/login/');
}

export function middleware(req) {
  const { pathname, search } = req.nextUrl;

  if (pathname.startsWith('/_next')) return NextResponse.next();
  if (pathname.startsWith('/api')) return NextResponse.next();
  if (isLoginPath(pathname)) return NextResponse.next();

  const jwt = req.cookies.get('app_jwt')?.value;
  if (jwt) return NextResponse.next();

  const target = `${pathname}${search || ''}`;
  if (!isSafeInternalPath(target)) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/us/login';
  loginUrl.search = '';

  const res = NextResponse.redirect(loginUrl);

  res.cookies.set({
    name: REDIRECT_COOKIE,
    value: target,
    path: '/',
    maxAge: 60 * 5,
    sameSite: 'lax',
    secure: req.nextUrl.protocol === 'https:',
  });

  res.headers.set('x-scsc-mw', '1');

  return res;
}

export const config = {
  matcher: ['/board/:path*'],
};
