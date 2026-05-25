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
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/err/browser')) {
    return NextResponse.next();
  }

  const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';

  const kakaotalk = ['kakao', 'kakaotalk'];
  const everytime = ['everytime'];
  const redirectParam = buildReturnPath(req);
  const redirectQuery = redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : '';

  if (kakaotalk.some((keyword) => userAgent.includes(keyword))) {
    return NextResponse.redirect(new URL(`/err/browser/kakaotalk${redirectQuery}`, req.url));
  }
  if (everytime.some((keyword) => userAgent.includes(keyword))) {
    return NextResponse.redirect(new URL(`/err/browser/everytime${redirectQuery}`, req.url));
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

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

const publicRoutes = [
  '/',
  '/board/1',
  '/board/2',
  '/about',
  '/about/executives',
  '/about/developers',
  '/about/rules',
  '/sig',
  '/pig',
  '/us/contact',
  '/us/login',
];

export const config = {
  matcher: [
    '/',
    '/about/:path*',
    '/article/:path*',
    '/board/:path*',
    '/err/:path*',
    '/executive/:path*',
    '/sig/:path*',
    '/pig/:path*',
    '/testutils/:path*',
    '/us/:path*',
  ],
};
