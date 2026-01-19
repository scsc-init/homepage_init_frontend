'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { fetchMeClient } from '@/util/fetchClientData';
import { useRouter } from 'next/navigation';

export default function RefreshJWTClient() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      fetch('/api/auth/logout', { method: 'POST' });
      return;
    }

    (async () => {
      let me = null;
      try {
        me = await fetchMeClient();
      } catch {
        me = null;
      }

      if (me) {
        const s = me.status;
        if (s === 'pending' || s === 'standby') {
          router.replace('/about/welcome');
          return;
        }
        return;
      }

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
          return;
        }

        const data = await loginRes.json();
        if (data.jwt) await update({ backendJwt: data.jwt });

        try {
          const me2 = await fetchMeClient();
          if (me2 && (me2.status === 'pending' || me2.status === 'standby')) {
            router.replace('/about/welcome');
            return;
          }
        } catch {
          return;
        }
      } else {
        await signOut({ redirect: false });
        await fetch('/api/auth/logout', { method: 'POST' });
        router.refresh();
      }
    })();
  }, [session, status, router, update]);
}
