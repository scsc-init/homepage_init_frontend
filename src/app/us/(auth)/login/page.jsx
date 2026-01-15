import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AuthClient from './AuthClient';

export default async function LoginPage() {
  const cookieStore = cookies();
  const jwt = cookieStore.get('app_jwt');

  if (jwt) {
    redirect('/api/auth/consume-redirect');
  }

  return <AuthClient />;
}
