'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { fetchMeClient } from '@/util/fetchClientData';

export default function RefreshJWTClient() {
  const { data: session } = useSession();

  useEffect(() => {
    fetchMeClient().then(async (me) => {
      if (me) return;
      if (session?.user?.email && session?.id_token) {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: session.user.email, id_token: session.id_token }),
        });
        if (!loginRes.ok) {
          await signOut({ redirect: false });
          await fetch('/api/auth/logout', { method: 'POST' });
        }
      } else {
        await signOut({ redirect: false });
        await fetch('/api/auth/logout', { method: 'POST' });
      }
    });
  }, [session?.user?.email, session?.id_token]);
}
