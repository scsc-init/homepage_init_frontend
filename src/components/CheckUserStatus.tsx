'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/util/hooks/useMe';

export default function CheckUserStatusClient(): null {
  const router = useRouter();
  const { me, isLoading } = useMe();

  useEffect(() => {
    if (isLoading || !me) return;
    if (!me.is_active && !me.is_banned) {
      router.replace('/about/welcome');
    }
  }, [isLoading, me, router]);

  return null;
}
