'use client';

import { useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import * as validator from '@/util/validator';
import {
  consumeRedirectAfterLogin,
  isAllowedRedirectPath,
  replaceLoginWithRedirect,
  setRedirectAfterLogin,
} from '@/util/loginRedirect';

export default function OAuthLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const mode = searchParams.get('mode') === 'external' ? 'external' : 'snu';
  const rawRedirect = searchParams.get('redirect');
  const redirectTo = rawRedirect && isAllowedRedirectPath(rawRedirect) ? rawRedirect : null;
  const didNavigateRef = useRef(false);

  useEffect(() => {
    if (didNavigateRef.current) return;
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      didNavigateRef.current = true;
      replaceLoginWithRedirect(router, { redirectTo: redirectTo ?? undefined });
      return;
    }

    const email = session?.user?.email?.toLowerCase();
    const isSnuEmail = validator.email(email);

    const invalidAccount = mode === 'snu' ? !isSnuEmail : isSnuEmail;

    if (invalidAccount) {
      didNavigateRef.current = true;
      const target = redirectTo ?? consumeRedirectAfterLogin();
      const params = new URLSearchParams({
        error: mode === 'snu' ? 'invalid_email' : 'snu_external_login',
      });
      if (target) params.set('redirect', target);

      void signOut({ redirect: false }).then(() => {
        router.replace(`/us/login?${params}`);
      });
      return;
    }

    if (session?.registered) {
      const redirectFromCookie = consumeRedirectAfterLogin();
      didNavigateRef.current = true;
      router.replace(redirectTo ?? redirectFromCookie ?? '/');
      return;
    }

    didNavigateRef.current = true;
    if (redirectTo) setRedirectAfterLogin(redirectTo);
    router.replace(mode === 'external' ? '/us/external-register' : '/us/register');
  }, [status, session, router, mode, redirectTo]);

  return <LoadingSpinner />;
}
