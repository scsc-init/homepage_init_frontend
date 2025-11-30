'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ClientPageTracker from '@/components/ClientPageTracker';

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

  if (status === 'authenticated') {
    return (
      <>
        <LoadingSpinner />
        <ClientPageTracker eventName="User Logged In" />
      </>
    );
  }

  return <LoadingSpinner />;
}
