const REDIRECT_COOKIE = 'redirect_after_login';
const LOGIN_PREFIX = '/us/login';

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
  return pathname === '/login' || pathname === '/us/login' || pathname.startsWith(LOGIN_PREFIX);
}

function getCurrentPath() {
  if (typeof window === 'undefined') return '/';
  return `${window.location.pathname}${window.location.search || ''}`;
}

function debugLog(event, data = {}) {
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
      fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        keepalive: true,
      });
    }
  } catch {}
}

function setCookie(name, value, { maxAge = 300 } = {}) {
  if (typeof document === 'undefined') return;
  const encoded = encodeURIComponent(value);
  const secure = window?.location?.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encoded}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  const parts = document.cookie ? document.cookie.split('; ') : [];
  for (const part of parts) {
    if (part.startsWith(prefix)) return part.slice(prefix.length);
  }
  return null;
}

function clearCookie(name) {
  if (typeof document === 'undefined') return;
  const secure = window?.location?.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export function setRedirectAfterLogin(path) {
  const target = path || getCurrentPath();
  const base = String(target).split('?')[0] || '';

  debugLog('set_redirect_after_login_attempt', { target, base });

  if (!isSafeInternalPath(target)) {
    debugLog('set_redirect_after_login_rejected', { reason: 'unsafe_path', target });
    return;
  }
  if (isLoginPath(base)) {
    debugLog('set_redirect_after_login_rejected', { reason: 'login_path', target });
    return;
  }

  setCookie(REDIRECT_COOKIE, target, { maxAge: 300 });
  debugLog('set_redirect_after_login_set', {
    cookie: REDIRECT_COOKIE,
    target,
    documentCookie: typeof document !== 'undefined' ? document.cookie : null,
  });
}

export function consumeRedirectAfterLogin() {
  const raw = getCookie(REDIRECT_COOKIE);
  debugLog('consume_redirect_after_login_read', {
    cookie: REDIRECT_COOKIE,
    raw,
    documentCookie: typeof document !== 'undefined' ? document.cookie : null,
  });

  if (!raw) return null;

  clearCookie(REDIRECT_COOKIE);

  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {}

  const base = String(decoded).split('?')[0] || '';
  if (!isSafeInternalPath(decoded)) {
    debugLog('consume_redirect_after_login_rejected', { reason: 'unsafe_path', decoded });
    return null;
  }
  if (isLoginPath(base)) {
    debugLog('consume_redirect_after_login_rejected', { reason: 'login_path', decoded });
    return null;
  }

  debugLog('consume_redirect_after_login_ok', { decoded });
  return decoded;
}

export function pushLoginWithRedirect(router, options = {}) {
  const { redirectTo } = options;
  debugLog('push_login_with_redirect', { redirectTo, current: getCurrentPath() });
  setRedirectAfterLogin(redirectTo);
  router.push('/us/login');
}

export function replaceLoginWithRedirect(router, options = {}) {
  const { redirectTo } = options;
  debugLog('replace_login_with_redirect', { redirectTo, current: getCurrentPath() });
  setRedirectAfterLogin(redirectTo);
  router.replace('/us/login');
}
