'use client';

/**
 * 클라이언트에서 현재 사용자 정보를 가져옵니다.
 *
 * @returns 사용자 정보 또는 null
 */
export async function fetchMeClient<T = any>(): Promise<T | null> {
  const res = await fetch('/api/user/profile');
  return res.ok ? ((await res.json()) as T) : null;
}
