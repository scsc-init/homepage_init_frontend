'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function OAuthLanding() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace('/us/login');
      return;
    }

    if (session.registered) {
      router.replace('/');
    } else {
      router.replace('/us/register');
    }
  }, [status, session, router]);

  return <div>로그인 중…</div>;
}
