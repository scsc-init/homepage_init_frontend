'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckUserStatusClient() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetchBackendClient(
          '/api/user/profile',
          {
            credentials: 'include',
          },
          true,
        );

        if (!res.ok) return;

        const data = await res.json();

        if (!data?.is_active && !data?.is_banned) {
          router.replace('/about/welcome');
        }
      } catch (_e) {}
    };

    check();
  }, [router]);

  return null;
}
