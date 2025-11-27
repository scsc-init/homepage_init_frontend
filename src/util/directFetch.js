// util/directFetch.js

'use client';

/**
 * @param {string} path - api path like as "/api/kv/foo". Note that '/' comes first
 * @param {RequestInit} [init] - fetch 옵션
 * @returns {Promise<Response>}
 */
export async function directFetch(path, init = {}) {
  const p = String(path || '');
  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const isBrowser = typeof window !== 'undefined';
  const useBackend = isBrowser && !!backendBase;

  if (!useBackend) {
    return fetch(p, {
      credentials: 'include',
      ...init,
    });
  }

  let res;
  try {
    res = await fetch(backendBase + p, {
      credentials: 'include',
      ...init,
    });
  } catch {
    return fetch(p, {
      credentials: 'include',
      ...init,
    });
  }

  if (res.status === 401) {
    return fetch(p, {
      credentials: 'include',
      ...init,
    });
  }

  return res;
}

/**
 * JSON 응답까지 바로 받고 싶은 경우 편의 함수.
 * 2xx 아니면 Error throw.
 *
 * @param {string} path
 * @param {RequestInit} [init]
 */
export async function directFetchJson(path, init = {}) {
  const res = await directFetch(path, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${text}`);
  }
  return res.json();
}
