'use client';

import { useSession } from 'next-auth/react';

export function useMe() {
  const { data: session, status, update } = useSession();

  const me = session?.user ?? null;

  return {
    me,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
    update,
  };
}
