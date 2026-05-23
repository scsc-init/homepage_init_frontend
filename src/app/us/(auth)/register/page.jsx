import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AuthClient from './AuthClient';
import { authOptions } from '@/util/authOptions';
import { fetchBackendServer } from '@/util/fetch/server';
import { fetchCurrentUserProfile } from '@/util/fetch/server-util';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session?.user?.name || !session?.hashToken) {
    redirect('/us/login');
  }
  const res = await fetchBackendServer('POST', '/api/user/login', {
    body: {
      email: session.user.email,
      hashToken: session.hashToken,
    },
  });
  if (res.status === 200) {
    const me = await fetchCurrentUserProfile();
    redirect(me ? '/' : '/us/login');
  }
  if (res.status !== 404) {
    redirect('/us/login');
  }

  const discordLogin = async () => {
    const res = await fetchBackendServer('POST', '/api/bot/discord/login', {
      headers: { 'x-api-secret': process.env.API_SECRET || '' },
    });
    if (res.status === 204) console.log('봇 로그인 성공');
    else console.log(`봇 로그인 실패: ${await res.text()}`);
  };
  discordLogin();

  return <AuthClient />;
}
