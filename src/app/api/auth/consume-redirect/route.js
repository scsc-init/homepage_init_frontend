import { NextResponse } from 'next/server';
import { normalizeRedirectTarget } from '@/util/loginRedirect';

export function GET(request) {
  const raw = request.cookies.get('redirect_after_login')?.value || null;

  const responseUrl = new URL(request.url);
  responseUrl.pathname = '/';
  responseUrl.search = '';

  let target = null;
  if (raw) target = normalizeRedirectTarget(raw);

  const redirectUrl = new URL(request.url);
  redirectUrl.pathname = target || '/';
  redirectUrl.search = '';

  const res = NextResponse.redirect(redirectUrl);

  if (raw) {
    res.cookies.set('redirect_after_login', '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return res;
}
