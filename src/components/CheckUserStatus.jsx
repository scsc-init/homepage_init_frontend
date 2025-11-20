'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckUserStatusClient() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/user/profile', {
          credentials: 'include',
        });

        if (!res.ok) return;

        const data = await res.json();
        const status = data?.status;

        if (status === 'pending' || status === 'standby') {
          router.replace('/about/welcome');
        }
      } catch (e) {}
    };

    check();
  }, [router]);

  return null;
}
