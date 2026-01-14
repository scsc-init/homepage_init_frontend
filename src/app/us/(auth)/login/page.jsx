import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AuthClient from './AuthClient';

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

export default async function LoginPage() {
  const cookieStore = cookies();
  const jwt = cookieStore.get('app_jwt');

  if (jwt) {
    const raw = cookieStore.get('redirect_after_login')?.value;

    if (raw) {
      cookieStore.delete('redirect_after_login');

      let decoded = raw;
      try {
        decoded = decodeURIComponent(raw);
      } catch {}

      const base = String(decoded).split('?')[0] || '';

      if (isSafeInternalPath(decoded) && !isLoginPath(base)) {
        redirect(decoded);
      }
    }

    redirect('/');
  }

  return <AuthClient />;
}
