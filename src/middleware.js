import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { REDIRECT_COOKIE, isAllowedRedirectPath } from '@/util/loginRedirect';

function buildReturnPath(req) {
  const { pathname, search } = req.nextUrl;
  const target = `${pathname}${search || ''}`;
  return isAllowedRedirectPath(target) ? target : null;
}

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/err/browser')) {
    return NextResponse.next();
  }
  const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';

  const kakaotalk = ['kakao', 'kakaotalk'];
  const everytime = ['everytime'];
  const blockedBrowsers = ['kakao', 'kakaotalk', 'everytime'];

  if (kakaotalk.some((keyword) => userAgent.includes(keyword))) {
    return NextResponse.redirect(new URL('/err/browser/kakaotalk', req.url));
  }
  if (everytime.some((keyword) => userAgent.includes(keyword))) {
    return NextResponse.redirect(new URL('/err/browser/everytime', req.url));
  }
  if (blockedBrowsers.some((browser) => userAgent.includes(browser))) {
    return NextResponse.redirect(new URL('/err/browser', req.url));
  }

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
    '/',
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
