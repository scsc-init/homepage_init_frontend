import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ExternalRegisterClient from './ExternalRegisterClient';
import { authOptions } from '@/util/authOptions';
import { fetchBackendServer } from '@/util/fetch/server';
import * as validator from '@/util/validator';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function ExternalRegisterPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !session?.user?.name || !session?.hashToken) {
    redirect('/us/login');
  }

  if (validator.email(session.user.email.toLowerCase())) {
    redirect('/us/register');
  }

  const res = await fetchBackendServer('POST', '/api/user/login', {
    body: {
      email: session.user.email,
      hashToken: session.hashToken,
    },
  });

  if (res.status === 200) {
    redirect('/');
  }

  if (res.status !== 404) {
    redirect('/us/login');
  }

  return <ExternalRegisterClient />;
}
