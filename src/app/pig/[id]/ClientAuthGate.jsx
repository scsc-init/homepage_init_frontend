'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientAuthGate({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const goLogin = () => {
      Promise.resolve().then(() => router.replace('/us/login'));
    };

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      goLogin();
      return;
    }

    (async () => {
      try {
        const res = await fetch('/api/user/profile', {
          headers: { 'x-jwt': jwt },
          cache: 'no-store',
        });
        if (!res.ok) {
          goLogin();
          return;
        }
        // NOTE(KMSstudio): An authentication is successful, the overlay will be dismissed.
        if (!cancelled) setChecking(false);
      } catch {
        goLogin();
      }
    })();

    return () => { cancelled = true; };
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
