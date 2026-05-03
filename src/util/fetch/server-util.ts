// @/util/fetch/server-util.ts

import type { GlobalStatus } from '@/types/system';
import type { UserProfile } from '@/types/user';
import { fetchBackendServer, fetchBackendServerJson } from './server';

/** Fetches current SCSC global status. */
export async function fetchGlobalStatus(): Promise<GlobalStatus> {
  return fetchBackendServerJson<GlobalStatus>('GET', '/api/scsc/global/status');
}

/**
 * Fetches current login user.
 * If user does not login or error occur while fetching, then return null.
 */
export async function fetchCurrentUserProfile(): Promise<UserProfile | null> {
  const res = await fetchBackendServer('GET', '/api/user/profile');
  return res.ok ? ((await res.json()) as UserProfile) : null;
}
