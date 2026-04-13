import { redirect } from 'next/navigation';
import InAppBrowser from './InAppBrowser';
import { fetchMe } from '@/util/fetchAPIData';

export default async function BrowserPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const redirectTo = typeof searchParams?.redirect === 'string' ? searchParams.redirect : null;

  const [me] = await Promise.allSettled([fetchMe()]);

  if (me.status === 'fulfilled') {
    redirect('/api/auth/consume-redirect');
  }

  return <InAppBrowser initialRedirect={redirectTo} slug={params?.slug || []} />;
}
