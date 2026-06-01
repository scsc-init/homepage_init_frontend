'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { replaceLoginWithRedirect } from '@/util/loginRedirect';
import { useMe } from '@/util/hooks/useMe';

export default function ClientAuthGate({ children }) {
  const router = useRouter();
  const { me, isLoading, isUnauthenticated } = useMe();

  useEffect(() => {
    if (isUnauthenticated) {
      replaceLoginWithRedirect(router);
    }
  }, [isUnauthenticated, router]);

  const checking = isLoading || isUnauthenticated || !me;

  return (
    <>
      {checking ? (
        <div className="AuthGateBackdrop">
          <div className="AuthGateSpinner" />
        </div>
      ) : (
        children
      )}
    </>
  );
}
