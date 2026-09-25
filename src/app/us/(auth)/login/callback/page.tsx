'use client';

import { useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import * as validator from '@/util/validator';
import { consumeRedirectAfterLogin, replaceLoginWithRedirect } from '@/util/loginRedirect';

export default function OAuthLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const mode = searchParams.get('mode') === 'external' ? 'external' : 'snu';
  const didNavigateRef = useRef(false);

  useEffect(() => {
    if (didNavigateRef.current) return;
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      didNavigateRef.current = true;
      replaceLoginWithRedirect(router);
      return;
    }

    const email = session?.user?.email?.toLowerCase();
    const isSnuEmail = validator.email(email);

    if (mode === 'snu' && !isSnuEmail) {
      didNavigateRef.current = true;
      void signOut({ redirect: false }).then(() => {
        router.replace('/us/login?error=invalid_email');
      });
      return;
    }

    if (mode === 'external' && isSnuEmail) {
      didNavigateRef.current = true;
      void signOut({ redirect: false }).then(() => {
        router.replace('/us/login?error=snu_external_login');
      });
      return;
    }

    if (session?.registered) {
      const redirectTo = consumeRedirectAfterLogin();
      didNavigateRef.current = true;
      router.replace(redirectTo || '/');
      return;
    }

    didNavigateRef.current = true;
    router.replace(mode === 'external' ? '/us/external-register' : '/us/register');
  }, [status, session, router, mode]);

  return <LoadingSpinner />;
}
