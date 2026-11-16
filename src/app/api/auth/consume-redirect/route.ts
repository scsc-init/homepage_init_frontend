import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { normalizeRedirectTarget } from '@/util/loginRedirect';
import { routing } from '@/i18n/routing';

export function GET(request: NextRequest) {
  const raw = request.cookies.get('redirect_after_login')?.value || null;
  const target = normalizeRedirectTarget(raw);

  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '')
    .split(',')[0]
    .trim()
    .toLowerCase();

  // i18n에 등록된 도메인만 허용
  const allowedHost = routing.domains?.some(({ domain }) => domain.toLowerCase() === host);

  const isProduction = process.env.NODE_ENV === 'production';
  const fallbackHost = isProduction ? 'scsc.dev' : 'localhost:3000';

  const origin = `${isProduction ? 'https' : 'http'}://${allowedHost ? host : fallbackHost}`;

  const res = NextResponse.redirect(new URL(target ?? '/', origin));

  if (raw) {
    res.cookies.set('redirect_after_login', '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
      secure: isProduction,
    });
  }

  return res;
}
