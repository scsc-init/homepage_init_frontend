import { NextResponse } from 'next/server';
import { normalizeRedirectTarget } from '@/util/loginRedirect';

export function GET(request) {
  const raw = request.cookies.get('redirect_after_login')?.value || null;

  let target = null;
  if (raw) target = normalizeRedirectTarget(raw);

  let baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) {
    console.warn('[consume-redirect] NEXTAUTH_URL is not set; falling back to request.url');
    baseUrl = request.url;
  }
  let redirectUrl;
  try {
    redirectUrl = new URL(target || '/', baseUrl);
  } catch {
    redirectUrl = new URL(target || '/', request.url);
  }

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
