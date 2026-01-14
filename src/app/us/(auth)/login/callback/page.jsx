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
    log('oauth_landing_effect', {
      status,
      registered: session?.registered,
      didNavigate: didNavigateRef.current,
      href: typeof window !== 'undefined' ? window.location.href : null,
      cookie: typeof document !== 'undefined' ? document.cookie : null,
    });

    if (didNavigateRef.current) return;
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      didNavigateRef.current = true;
      log('oauth_landing_unauthenticated_redirect_to_login', {});
      replaceLoginWithRedirect(router);
      return;
    }

    if (session?.registered) {
      const redirectTo = consumeRedirectAfterLogin();
      didNavigateRef.current = true;
      log('oauth_landing_registered_redirect', { redirectTo });
      router.replace(redirectTo || '/');
      return;
    }

    didNavigateRef.current = true;
    log('oauth_landing_unregistered_redirect_to_register', {});
    router.replace('/us/register');
  }, [status, session, router]);

  return <LoadingSpinner />;
}
