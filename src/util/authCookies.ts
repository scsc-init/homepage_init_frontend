export const shareAuthCookies =
  process.env.NEXTAUTH_URL?.replace(/\/+$/, '') === 'https://scsc.dev';

// Keep shared cookies separate from existing host-only NextAuth cookies.
export const SHARED_AUTH_COOKIE_PREFIX = '__Secure-scsc-auth';
export const SHARED_SESSION_COOKIE_NAME = `${SHARED_AUTH_COOKIE_PREFIX}.session-token`;

export function isLegacySessionCookie(name: string): boolean {
  return /^(?:__Secure-)?next-auth\.session-token(?:\.\d+)?$/.test(name);
}
