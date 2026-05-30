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
