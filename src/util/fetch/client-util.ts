// @/util/fetch/client-util.ts

'use client';

import type { ExecutiveCandidate, UserSummary, UserProfile } from '@/types/user';
import type {
  BoardInfo,
  DiscordBotStatusResponse,
  GlobalStatus,
  MajorInfo,
} from '@/types/system';
import { fetchBackendClientJson } from '@/util/fetch/client';

/** fetch all users **/
export async function fetchUsers<T extends UserProfile[] = UserProfile[]>(): Promise<T> {
  return fetchBackendClientJson<T>('/api/executive/users', undefined, true);
}

/** Fetches executive user summaries. */
export async function fetchUserSummaries<
  T extends UserSummary[] = UserSummary[],
>(): Promise<T> {
  return fetchBackendClientJson<T>('/api/executive/users/summary', undefined, true);
}

/** Fetches board data. */
export async function fetchBoards<T extends BoardInfo = BoardInfo>(
  boardIds: number[],
): Promise<PromiseSettledResult<T>[]> {
  return Promise.allSettled(
    boardIds.map((id) => fetchBackendClientJson<T>(`/api/board/${id}`, undefined, true)),
  );
}

/** Fetches all majors. */
export async function fetchMajors<T extends MajorInfo[] = MajorInfo[]>(): Promise<T> {
  return fetchBackendClientJson<T>('/api/majors', undefined, true);
}

/** Fetches Discord bot status. */
export async function fetchDiscordBotStatus(): Promise<boolean> {
  const body = await fetchBackendClientJson<DiscordBotStatusResponse>(
    '/api/bot/discord/status',
    undefined,
    true,
  );
  return body.logged_in === true;
}

/** Fetches current SCSC global status. */
export async function fetchSCSCGlobalStatus(): Promise<GlobalStatus> {
  return fetchBackendClientJson<GlobalStatus>('/api/scsc/global/status', undefined, true);
}

/** Fetches executive candidates from executive and president lists. */
export async function fetchExecutiveCandidates<
  T extends ExecutiveCandidate = ExecutiveCandidate,
>(): Promise<T[]> {
  const params = (role: string) => new URLSearchParams({ user_role: role }).toString();
  const [execList, prezList] = await Promise.all([
    fetchBackendClientJson<T[]>(`/api/executive/users?${params('executive')}`, undefined, true),
    fetchBackendClientJson<T[]>(`/api/executive/users?${params('president')}`, undefined, true),
  ]);

  const merged = new Map<string, T>();
  for (const entry of [
    ...(Array.isArray(execList) ? execList : []),
    ...(Array.isArray(prezList) ? prezList : []),
  ]) {
    const key = String(entry.id || entry.email || entry.name);
    if (!merged.has(key)) merged.set(key, entry);
  }
  return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}
