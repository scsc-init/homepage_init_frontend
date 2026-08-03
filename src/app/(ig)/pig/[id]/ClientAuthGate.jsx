'use client';

import { useMe } from '@/util/hooks/useMe';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from '@/app/(ig)/components/detail/IgDetail.module.css';

export default function ClientAuthGate({ children }) {
  const router = useRouter();
  const { me, isLoading, isUnauthenticated } = useMe();

  useEffect(() => {
    if (isUnauthenticated) {
      router.replace('/us/login');
    }
  }, [isUnauthenticated, router]);

  const checking = isLoading || isUnauthenticated || !me;

  return (
    <>
      {checking ? (
        <div className={styles.authGateBackdrop}>
          <div className={styles.authGateSpinner} />
        </div>
      ) : (
        children
      )}
    </>
  );
}
