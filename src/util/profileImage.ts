import { DEFAULT_EXECUTIVE_PFP } from '@/util/constants';

const PUBLIC_BACKEND_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

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
 * @returns Backend image URL or fallback
 */
export function toBackendStaticPath(
  raw: string,
  fallback = DEFAULT_EXECUTIVE_PFP,
  version?: string,
): string {
  const s = raw.replace(/^\/+/, '');
  if (!s) return fallback;
  if (!s.startsWith('static/image/')) return fallback;
  if (!PUBLIC_BACKEND_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured');
  }

  const imageUrl = `${PUBLIC_BACKEND_URL}/${s}`;
  return version ? `${imageUrl}?v=${encodeURIComponent(version)}` : imageUrl;
}

export interface ProfileImageUser {
  profile_picture?: string;
  profile_picture_is_url?: boolean;
  updated_at?: string;
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
  return toBackendStaticPath(raw, fallback, user?.updated_at);
}
