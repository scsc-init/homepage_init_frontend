import { redirect } from 'next/navigation';
import InAppBrowser from './InAppBrowser';
import { fetchCurrentUserProfile } from '@/util/fetch/server-util';

export default async function BrowserPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const redirectTo = typeof searchParams?.redirect === 'string' ? searchParams.redirect : null;

  const me = await fetchCurrentUserProfile();

  if (me) {
    redirect('/api/auth/consume-redirect');
  }

  return <InAppBrowser initialRedirect={redirectTo} slug={params?.slug || []} />;
}
