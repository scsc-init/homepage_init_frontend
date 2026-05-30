'use client';

// @/util/fetch/client-util.ts
import type { UserProfile } from '@/types/user';
import type { KvFetchResponse } from '@/types/system';
import { fetchBackendClient } from './client';
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
  return fetchBackendClientJson<T>('/api/executive/users');
}

/** Fetches executive user summaries. */
export async function fetchUserSummaries<
  T extends UserSummary[] = UserSummary[],
>(): Promise<T> {
  return fetchBackendClientJson<T>('/api/executive/users/summary');
}

/** Fetches board data. */
export async function fetchBoards<T extends BoardInfo = BoardInfo>(
  boardIds: number[],
): Promise<PromiseSettledResult<T>[]> {
  return Promise.allSettled(
    boardIds.map((id) => fetchBackendClientJson<T>(`/api/board/${id}`)),
  );
}

/** Fetches all majors. */
export async function fetchMajors<T extends MajorInfo[] = MajorInfo[]>(): Promise<T> {
  return fetchBackendClientJson<T>('/api/majors');
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
  return fetchBackendClientJson<GlobalStatus>('/api/scsc/global/status');
}

/** Fetches executive candidates from executive and president lists. */
export async function fetchExecutiveCandidates<
  T extends ExecutiveCandidate = ExecutiveCandidate,
>(): Promise<T[]> {
  const params = (role: string) => new URLSearchParams({ user_role: role }).toString();
  const [execList, prezList] = await Promise.all([
    fetchBackendClientJson<T[]>(`/api/executive/users?${params('executive')}`),
    fetchBackendClientJson<T[]>(`/api/executive/users?${params('president')}`),
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

export async function getKvClient(key: string): Promise<string> {
  try {
    const res = await fetchBackendClient(`/api/kv/${encodeURIComponent(key)}`, {}, true);
    if (!res.ok) return '';
    const body = (await res.json()) as KvFetchResponse;
    const v = body?.value;
    return typeof v === 'string' && v.trim() ? v.trim() : '';
  } catch {
    return '';
  }
}

export async function getKvsClient(keys: string[]): Promise<string[]> {
  const list = Array.isArray(keys) ? keys : [];
  if (list.length === 0) return [];
  try {
    const qs = list.map((k) => `q=${encodeURIComponent(k)}`).join('&');
    const res = await fetchBackendClient(`/api/kvs?${qs}`, {}, true);
    if (!res.ok) return list.map(() => '');
    const data = (await res.json()) as KvFetchResponse[];
    const map: Record<string, string> = {};
    for (const item of Array.isArray(data) ? data : []) {
      const v = item?.value;
      map[item?.key] = typeof v === 'string' && v.trim() ? v.trim() : '';
    }
    return list.map((k) => map[k] || '');
  } catch {
    return list.map(() => '');
  }
}
