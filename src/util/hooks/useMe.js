'use client';

import { useSession } from 'next-auth/react';
/**
 * Gets current user profile data from the NextAuth session.
 *
 * @returns Current user profile data and session status helpers.
 */
export function useMe() {
  const { data: session, status, update } = useSession();

  const me = session?.userProfile ?? null;

  return {
    me,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
    update,
  };
}
