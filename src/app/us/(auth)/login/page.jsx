import { redirect } from 'next/navigation';
import AuthClient from './AuthClient';
import { fetchCurrentUserProfile } from '@/util/fetch/server-util';

export default async function LoginPage(props) {
  const searchParams = await props.searchParams;

  const redirectTo =
    typeof searchParams?.redirect === 'string' && searchParams.redirect
      ? searchParams.redirect
      : null;

  const me = await fetchCurrentUserProfile();
  if (me) redirect('/api/auth/consume-redirect');

  return <AuthClient initialRedirect={redirectTo} />;
}
