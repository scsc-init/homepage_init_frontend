'use client';

import { useMe } from '@/util/hooks/useMe';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';

export default function ClientAuthGate({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const { me, isLoading, isUnauthenticated } = useMe();
  useEffect(() => {
    let cancelled = false;

    const goLogin = () => {
      Promise.resolve().then(() => replaceLoginWithRedirect(router));
    };

    if (isLoading) return undefined;
    if (isUnauthenticated || !me) {
      goLogin();
      return undefined;
    }
    if (!cancelled) setChecking(false);

    return () => {
      cancelled = true;
    };
  }, [isLoading, isUnauthenticated, me, router]);

  return (
    <>
      {children}
      {checking && (
        <div className="AuthGateBackdrop">
          <div className="AuthGateSpinner" />
        </div>
      )}
    </>
  );
}
