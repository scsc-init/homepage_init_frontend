import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AuthClient from './AuthClient';
import { authOptions } from '@/util/authOptions';
import { fetchMe } from '@/util/fetchAPIData';

export default async function LoginPage() {
  const check = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return;
    const me = await fetchMe();
    if (me) redirect('/');
    return;
  };
  await check();

  return <AuthClient />;
}
