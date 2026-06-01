'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/util/hooks/useMe';
import { pushLoginWithRedirect } from '@/util/loginRedirect';

export default function LeadershipAuthorization({ children }) {
  const { me, isLoading, isUnauthenticated } = useMe();
  const router = useRouter();
  const viewerRole = me?.role ?? 0;

  useEffect(() => {
    if (isUnauthenticated) {
      pushLoginWithRedirect(router);
      return;
    }

    if (!isLoading && me && viewerRole < 1000) {
      router.replace('/executive/user');
    }
  }, [isLoading, isUnauthenticated, me, router, viewerRole]);

  if (isLoading || isUnauthenticated || !me || viewerRole < 1000) return null;

  return children;
}
