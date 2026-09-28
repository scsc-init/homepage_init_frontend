import AuthClient from './AuthClient';
import { fetchBackendServer } from '@/util/fetch/server';

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const discordLogin = async () => {
    const res = await fetchBackendServer('POST', '/api/bot/discord/login', {
      headers: { 'x-api-secret': process.env.API_SECRET || '' },
    });

    if (res.status === 204) console.log('봇 로그인 성공');
    else console.log(`봇 로그인 실패: ${await res.text()}`);
  };

  discordLogin();

  const params = await searchParams;

  const redirectTo =
    typeof params.redirect === 'string' && params.redirect ? params.redirect : null;

  const snuEmailCheck = process.env.SNU_EMAIL_CHECK?.toUpperCase() === 'TRUE';

  return <AuthClient initialRedirect={redirectTo} snuEmailCheck={snuEmailCheck} />;
}
