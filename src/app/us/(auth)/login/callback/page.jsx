'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { consumeRedirectAfterLogin, replaceLoginWithRedirect } from '@/util/loginRedirect';

export default function OAuthLanding() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const didNavigateRef = useRef(false);

  useEffect(() => {
    if (didNavigateRef.current) return;
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      didNavigateRef.current = true;
      replaceLoginWithRedirect(router);
      return;
    }

    if (session?.registered) {
      const redirectTo = consumeRedirectAfterLogin();
      didNavigateRef.current = true;
      router.replace(redirectTo || '/');
      return;
    }

    didNavigateRef.current = true;
    router.replace('/us/register');
  }, [status, session, router]);

  return <LoadingSpinner />;
}
