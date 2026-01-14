'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';

export default function ClientAuthGate({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const goLogin = () => {
      Promise.resolve().then(() => replaceLoginWithRedirect(router));
    };

    (async () => {
      try {
        const res = await fetch('/api/user/profile', { cache: 'no-store' });
        if (!res.ok || res.status === 401) {
          goLogin();
          return;
        }
        if (!cancelled) setChecking(false);
      } catch {
        goLogin();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

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
