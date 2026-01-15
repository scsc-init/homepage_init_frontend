import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AuthClient from './AuthClient';
import { AUTH_COOKIE } from '@/util/loginRedirect';

export default async function LoginPage() {
  const cookieStore = cookies();
  const jwt = cookieStore.get(AUTH_COOKIE);

  if (jwt) {
    redirect('/api/auth/consume-redirect');
  }

  return <AuthClient />;
}
