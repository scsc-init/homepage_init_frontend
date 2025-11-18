'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function OAuthLanding() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace('/us/login');
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      if (cancelled) return;
      controller.abort();
      if (session?.registered) {
        router.replace('/');
      } else {
        router.replace('/us/register');
      }
    }, 3000);

    const check = async () => {
      try {
        const res = await fetch('/api/user/profile', {
          credentials: 'include',
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          if (cancelled) return;
          if (data?.status === 'standby') {
            clearTimeout(timeoutId);
            router.replace('/about/welcome');
            return;
          }
        }
      } catch {
        if (cancelled) return;
      }
      if (cancelled) return;
      clearTimeout(timeoutId);
      if (session?.registered) {
        router.replace('/');
      } else {
        router.replace('/us/register');
      }
    };

    check();

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [status, session, router]);

  return <LoadingSpinner />;
}
