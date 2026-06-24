'use client';

import { UserProfile } from '@/types/user';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

type SessionProfile = {
  me: UserProfile | null;
  status: 'authenticated' | 'loading' | 'unauthenticated';
  isLoading: boolean;
  isUnauthenticated: boolean;
  isAuthenticated: boolean;
  update: (data?: any) => Promise<Session | null>;
};

/**
 * Gets current user profile data from the NextAuth session.
 *
 * @returns Current user profile data and session status helpers.
 */
export function useMe(): SessionProfile {
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
