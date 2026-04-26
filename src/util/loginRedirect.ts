import { ALLOWED_REDIRECT_PREFIXES } from '@/util/constants';

export const REDIRECT_COOKIE = 'redirect_after_login';
export const LOGIN_PREFIX = '/us/login';

interface RouterLike {
  push(url: string): void;
  replace(url: string): void;
}

/**
 * 내부 안전 경로인지 확인합니다.
 *
 * @param value - Path candidate
 * @returns 내부 안전 경로 여부
 */
export function isSafeInternalPath(value: unknown): value is string {
  if (!value || typeof value !== 'string') return false;
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//')) return false;
  if (value.includes('://')) return false;
  if (value.toLowerCase().startsWith('/javascript:')) return false;
  return true;
}

/**
 * 로그인 경로인지 확인합니다.
 *
 * @param pathname - Pathname
 * @returns 로그인 경로 여부
 */
export function isLoginPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === '/login' || pathname === '/us/login' || pathname.startsWith(LOGIN_PREFIX);
}

/**
 * 허용된 로그인 후 리다이렉트 경로인지 확인합니다.
 *
 * @param pathname - Pathname
 * @returns 허용 여부
 */
export function isAllowedRedirectPath(pathname: string): boolean {
  if (!isSafeInternalPath(pathname)) return false;
  const base = String(pathname).split('?')[0] || '';
  if (isLoginPath(base)) return false;
  return ALLOWED_REDIRECT_PREFIXES.some((p) => base === p || base.startsWith(`${p}/`));
}

/**
 * 리다이렉트 대상을 정규화합니다.
 *
 * @param raw - Raw redirect target
 * @returns 정규화된 redirect target 또는 null
 */
export function normalizeRedirectTarget(raw: string | null | undefined): string | null {
  if (!raw) return null;

  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {}

  return isAllowedRedirectPath(decoded) ? decoded : null;
}

function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';
  return `${window.location.pathname}${window.location.search || ''}`;
}

function debugLog(event: string, data: Record<string, unknown> = {}): void {
  try {
    if (typeof window !== 'undefined') {
      console.info(`[loginRedirect] ${event}`, data);
    }
    const body = JSON.stringify({ event, data, ts: new Date().toISOString() });
    const url = '/api/log';
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    }
    if (typeof fetch !== 'undefined') {
      void fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        keepalive: true,
      });
    }
  } catch {}
}

function setCookie(
  name: string,
  value: string,
  { maxAge = 300 }: { maxAge?: number } = {},
): void {
  if (typeof document === 'undefined') return;
  const encoded = encodeURIComponent(value);
  const secure = window?.location?.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encoded}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  const parts = document.cookie ? document.cookie.split('; ') : [];
  for (const part of parts) {
    if (part.startsWith(prefix)) return part.slice(prefix.length);
  }
  return null;
}

function clearCookie(name: string): void {
  if (typeof document === 'undefined') return;
  const secure = window?.location?.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

/**
 * 로그인 후 돌아갈 경로를 쿠키에 저장합니다.
 *
 * @param path - Redirect target
 */
export function setRedirectAfterLogin(path?: string): void {
  const target = path || getCurrentPath();

  debugLog('set_redirect_after_login_attempt', { target });

  if (!isAllowedRedirectPath(target)) {
    debugLog('set_redirect_after_login_rejected', { reason: 'not_allowed', target });
    return;
  }

  setCookie(REDIRECT_COOKIE, target, { maxAge: 300 });
  debugLog('set_redirect_after_login_set', {
    cookie: REDIRECT_COOKIE,
    target,
    documentCookie: typeof document !== 'undefined' ? document.cookie : null,
  });
}

/**
 * 로그인 후 리다이렉트 대상을 읽고 소모합니다.
 *
 * @returns Redirect target 또는 null
 */
export function consumeRedirectAfterLogin(): string | null {
  const raw = getCookie(REDIRECT_COOKIE);
  debugLog('consume_redirect_after_login_read', {
    cookie: REDIRECT_COOKIE,
    raw,
    documentCookie: typeof document !== 'undefined' ? document.cookie : null,
  });

  if (!raw) return null;

  clearCookie(REDIRECT_COOKIE);

  const target = normalizeRedirectTarget(raw);
  if (!target) {
    debugLog('consume_redirect_after_login_rejected', { reason: 'not_allowed', raw });
    return null;
  }

  debugLog('consume_redirect_after_login_ok', { decoded: target });
  return target;
}

/**
 * 현재 위치를 저장하고 로그인 페이지로 push 이동합니다.
 *
 * @param router - Router instance
 * @param options - Redirect options
 * @param options.redirectTo - Explicit redirect target
 */
export function pushLoginWithRedirect(
  router: RouterLike,
  options: { redirectTo?: string } = {},
): void {
  const { redirectTo } = options;
  debugLog('push_login_with_redirect', { redirectTo, current: getCurrentPath() });
  setRedirectAfterLogin(redirectTo);
  router.push('/us/login');
}

/**
 * 현재 위치를 저장하고 로그인 페이지로 replace 이동합니다.
 *
 * @param router - Router instance
 * @param options - Redirect options
 * @param options.redirectTo - Explicit redirect target
 */
export function replaceLoginWithRedirect(
  router: RouterLike,
  options: { redirectTo?: string } = {},
): void {
  const { redirectTo } = options;
  debugLog('replace_login_with_redirect', { redirectTo, current: getCurrentPath() });
  setRedirectAfterLogin(redirectTo);
  router.replace('/us/login');
}
