import { NextResponse } from 'next/server';
import { normalizeRedirectTarget } from '@/util/loginRedirect';

export function GET(request) {
  const raw = request.cookies.get('redirect_after_login')?.value || null;

  let target = null;
  if (raw) target = normalizeRedirectTarget(raw);

  const baseUrl = process.env.NEXTAUTH_URL || request.url;
  const redirectUrl = new URL(target || '/', baseUrl);

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
