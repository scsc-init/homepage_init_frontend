'use client';

import { useMe } from '@/util/hooks/useMe';
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckUserStatusClient() {
  const router = useRouter();
  const { me, isLoading } = useMe();

  useEffect(() => {
    if (isLoading) return;
    if (!me.is_active && !me.is_banned) router.replace('/about/welcome');
  }, [isLoading, me, router]);

  return null;
}
