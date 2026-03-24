import { redirect } from 'next/navigation';
import EveryTimeBrowser from './EveryTimeBrowser';
import { fetchMe } from '@/util/fetchAPIData';

export default async function EveryTimeBrowserPage(props) {
  const searchParams = await props.searchParams;

  const redirectTo =
    typeof searchParams?.redirect === 'string' && searchParams.redirect
      ? searchParams.redirect
      : null;

  const [me] = await Promise.allSettled([fetchMe()]);
  if (me.status === 'fulfilled') redirect('/api/auth/consume-redirect');

  return <EveryTimeBrowser initialRedirect={redirectTo} />;
}
