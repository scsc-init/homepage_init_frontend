'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useMe } from '@/util/hooks/useMe';
import { useRouter } from 'next/navigation';

export default function RefreshJWTClient() {
  const { me } = useMe();
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      fetch('/api/auth/logout', { method: 'POST' });
      return;
    }

    if (me) {
      if (!me.is_active) {
        router.replace('/about/welcome');
      }
      return;
    }

    (async () => {
      if (!session?.user?.email || !session?.hashToken) {
        await signOut({ redirect: false });
        await fetch('/api/auth/logout', { method: 'POST' });
        router.refresh();
        return;
      }

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

      if (!data.jwt || !data.userProfile) {
        await signOut({ redirect: false });
        await fetch('/api/auth/logout', { method: 'POST' });
        router.refresh();
        return;
      }

      await update({
        backendJwt: data.jwt,
        userProfile: data.userProfile,
      });

      if (!data.userProfile.is_active) {
        router.replace('/about/welcome');
      }
    })();
  }, [me, session, status, router, update]);
}
