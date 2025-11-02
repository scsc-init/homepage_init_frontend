'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { fetchMeClient } from '@/util/fetchClientData';
import { useRouter } from 'next/navigation';

export default function RefreshJWTClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      fetch('/api/auth/logout', { method: 'POST' });
      return;
    }

    (async () => {
      const me = await fetchMeClient();
      if (me) return;

      if (session?.user?.email && session?.hashToken) {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: session.user.email,
            hashToken: session.hashToken,
          }),
        });

        if (!loginRes.ok) {
          await signOut({ redirect: false });
          await fetch('/api/auth/logout', { method: 'POST' });
          router.refresh();
        }
      } else {
        await signOut({ redirect: false });
        await fetch('/api/auth/logout', { method: 'POST' });
        router.refresh();
      }
    })();
  }, [session, status, router]);
}
