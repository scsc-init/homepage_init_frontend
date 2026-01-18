import { redirect } from 'next/navigation';
import AuthClient from './AuthClient';
import { fetchMe } from '@/util/fetchAPIData';

export default async function LoginPage() {
  const [me] = await Promise.allSettled([fetchMe()]);
  if (me.status === 'fulfilled') redirect('/');

  return <AuthClient />;
}
