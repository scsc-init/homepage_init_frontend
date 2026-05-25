// @/util/fetch/client-util.ts
import type { UserProfile } from '@/types/user';
import type { KvFetchResponse } from '@/types/system';
import { fetchBackendClient } from './client';

/** JSDOC */
export async function fetchCurrentUserProfile(): Promise<UserProfile | null> {
  // TODO
  return null;
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

export async function getKvsClient(keys: string[]): Promise<Record<string, string>> {
  const list = Array.isArray(keys) ? keys : [];
  const entries = await Promise.all(
    list.map(async (key): Promise<[string, string]> => {
      const value = await getKvClient(key);
      return [key, value];
    }),
  );
  return Object.fromEntries(entries);
}
