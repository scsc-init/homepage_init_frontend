import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AuthClient from './AuthClient';
import { authOptions } from '@/util/authOptions';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';
import { fetchMe } from '@/util/fetchAPIData';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session?.user?.name || !session?.hashToken) {
    redirect('/us/login');
  }
  const res = await fetch(`${getBaseUrl()}/api/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-secret': getApiSecret(),
    },
    body: JSON.stringify({
      email: session.user.email,
      hashToken: session.hashToken,
    }),
  });
  if (res.status === 200) {
    const me = await fetchMe();
    redirect(me ? '/' : '/us/login');
  }
  if (res.status !== 404) {
    redirect('/us/login');
  }

  const discordLogin = async () => {
    const res = await fetch(`${getBaseUrl()}/api/bot/discord/login`, {
      method: 'POST',
      headers: {
        'x-api-secret': getApiSecret(),
      },
    });
    if (res.status === 204) console.log('봇 로그인 성공');
    else console.log(`봇 로그인 실패: ${await res.text()}`);
  };
  discordLogin();

  return <AuthClient session={session} />;
}
