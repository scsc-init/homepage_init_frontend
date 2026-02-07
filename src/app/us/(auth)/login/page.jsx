import { redirect } from 'next/navigation';
import AuthClient from './AuthClient';
import { fetchMe } from '@/util/fetchAPIData';

export default async function LoginPage({ searchParams = {} }) {
  const redirectTo =
    typeof searchParams?.redirect === 'string' && searchParams.redirect
      ? searchParams.redirect
      : null;

  const [me] = await Promise.allSettled([fetchMe()]);
  if (me.status === 'fulfilled') redirect('/api/auth/consume-redirect');

  return <AuthClient initialRedirect={redirectTo} />;
}
