// util/directFetch.js

'use client';

/**
 * 지정된 API path를 BE로 우선 요청하고, BE가 401을 반환하면 동일 path로 FE API route에 재요청
 * NEXT_PUBLIC_API_BASE_URL이 설정되어 있으면 항상 BE를 우선 호출하며, 반환값은 fetch Response 그대로
 *
 * @param {string} path - "/api/..." 형태의 API 상대경로
 * @param {RequestInit} [init] - fetch 옵션 (method, headers, body 등)
 * @returns {Promise<Response>} - BE 또는 FE API에서의 fetch Response
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
 * API 호출 후 JSON 파싱
 * 응답 상태 코드가 2xx가 아니면 에러 throw, 성공 시 JSON 파싱 결과 반환
 *
 * @param {string} path - "/api/..." 형태의 API 상대경로
 * @param {RequestInit} [init] - fetch 옵션
 * @returns {Promise<any>} - JSON 파싱된 응답 데이터
 */

export async function directFetchJson(path, init = {}) {
  const res = await directFetch(path, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${text}`);
  }
  return res.json();
}
