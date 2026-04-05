import { DEFAULT_EXECUTIVE_PFP } from '@/util/constants';

/**
 * @param url Source image URL
 * @returns URL with high-resolution parameters applied when applicable
 */
export function upgradeGoogleAvatar(url: string): string {
  try {
    const u = new URL(url);
    if (!u.hostname.toLowerCase().includes('googleusercontent.com')) return url;
    let s = url;
    s = s.replace(/([?&]sz=)(\d+)/i, '$1' + 512);
    s = s.replace(/=s\d+(?:-c)?(?=$|[?#])/i, '=s512-c');
    if (!/[?&]sz=\d+/i.test(s) && !/=s\d+(?:-c)?/i.test(s)) {
      s += (s.includes('?') ? '&' : '?') + 'sz=512';
    }
    return s;
  } catch {
    return url;
  }
}

/**
 * @param raw Path stored in DB
 * @param fallback Fallback image when invalid
 * @returns Proxied image path or fallback
 */
export function toProxyStaticPath(raw: string, fallback = DEFAULT_EXECUTIVE_PFP): string {
  const s = raw.replace(/^\/+/, '');
  if (!s) return fallback;
  if (!s.startsWith('static/image/')) return fallback;
  return `/api/${s}`.replace(/^\/api\/static\/image\//, '/api/static/image/');
}

export interface ProfileImageUser {
  profile_picture?: string;
  profile_picture_is_url?: boolean;
}

/**
 * @param user User object
 * @param fallback Fallback image when invalid
 * @returns Final profile image URL
 */
export function resolveProfileImage(
  user?: ProfileImageUser,
  fallback = DEFAULT_EXECUTIVE_PFP,
): string {
  const raw = user?.profile_picture;
  if (!raw) return fallback;
  if (user?.profile_picture_is_url) return upgradeGoogleAvatar(raw);
  return toProxyStaticPath(raw, fallback);
}
