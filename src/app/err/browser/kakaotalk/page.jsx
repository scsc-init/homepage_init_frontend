import { redirect } from 'next/navigation';
import KakaoTalkBrowser from './KakaoTalkBrowser';
import { fetchMe } from '@/util/fetchAPIData';

export default async function KakaoBrowserPage(props) {
  const searchParams = await props.searchParams;

  const redirectTo =
    typeof searchParams?.redirect === 'string' && searchParams.redirect
      ? searchParams.redirect
      : null;

  const [me] = await Promise.allSettled([fetchMe()]);
  if (me.status === 'fulfilled') redirect('/api/auth/consume-redirect');

  return <KakaoTalkBrowser initialRedirect={redirectTo} />;
}
