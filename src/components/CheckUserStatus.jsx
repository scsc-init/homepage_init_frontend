'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/util/hooks/useMe';

export default function CheckUserStatusClient() {
  const router = useRouter();
  const { me } = useMe();

  useEffect(() => {
    if (me && !me.is_active && !me.is_banned) {
      router.replace('/about/welcome');
    }
  }, [me, router]);

  return null;
}
