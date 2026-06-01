'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/util/hooks/useMe';

export default function ClientAuthGate({ children }) {
  const router = useRouter();
  const { me, isLoading, isUnauthenticated } = useMe();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isUnauthenticated) {
      router.replace('/us/login');
      return;
    }

    if (!isLoading && me) setChecking(false);
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
