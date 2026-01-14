'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { consumeRedirectAfterLogin, replaceLoginWithRedirect } from '@/util/loginRedirect';

function log(event, data = {}) {
  try {
    const body = JSON.stringify({ event, data, ts: new Date().toISOString() });
    const url = '/api/log';
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    }
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {}
}

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
