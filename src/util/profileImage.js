import { DEFAULT_EXECUTIVE_PFP } from '@/util/constants';

export function upgradeGoogleAvatar(url) {
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

export function toProxyStaticPath(raw, fallback = DEFAULT_EXECUTIVE_PFP) {
  const s = String(raw || '').replace(/^\/+/, '');
  if (!s) return fallback;
  if (!s.startsWith('static/image/')) return fallback;
  return `/api/${s}`.replace(/^\/api\/static\/image\//, '/api/static/image/');
}

export function resolveProfileImage(user, fallback = DEFAULT_EXECUTIVE_PFP) {
  const raw = user?.profile_picture;
  if (!raw) return fallback;
  if (user?.profile_picture_is_url) return upgradeGoogleAvatar(String(raw));
  return toProxyStaticPath(raw, fallback);
}
