// @/util/fetch/client-util.ts

'use client';

import type { UserProfile } from '@/types/user';
import { fetchBackendClient } from '@/util/fetch/client';

/** JSDOC */
export async function fetchCurrentUserProfile(): Promise<UserProfile | null> {
  const res = await fetchBackendClient('/api/user/profile', undefined, true);
  if (!res.ok) return null;
  return (await res.json()) as UserProfile;
}
