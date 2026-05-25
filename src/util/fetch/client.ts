// @/util/fetch/client.ts

'use client';

const PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/** Checks whether the value is a plain JavaScript object */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/** Resolves frontend API route aliases to their backend API paths. */
function resolveBackendPath(path: string): string {
  const [pathname, suffix = ''] = path.split(/([?#].*)/, 2);

  if (pathname === '/api/comments/create') return `/api/comment/create${suffix}`;

  const commentExecutiveDelete = pathname.match(
    /^\/api\/comments\/([^/]+)\/executive\/delete$/,
  );
  if (commentExecutiveDelete) {
    return `/api/executive/comment/delete/${commentExecutiveDelete[1]}${suffix}`;
  }

  const commentDelete = pathname.match(/^\/api\/comments\/([^/]+)\/delete$/);
  if (commentDelete) return `/api/comment/delete/${commentDelete[1]}${suffix}`;

  const pigExecutiveUpdate = pathname.match(/^\/api\/pig\/([^/]+)\/update\/executive$/);
  if (pigExecutiveUpdate) return `/api/executive/pig/${pigExecutiveUpdate[1]}/update${suffix}`;

  const pigExecutiveDelete = pathname.match(/^\/api\/pig\/([^/]+)\/delete\/executive$/);
  if (pigExecutiveDelete) return `/api/executive/pig/${pigExecutiveDelete[1]}/delete${suffix}`;

  const sigExecutiveUpdate = pathname.match(/^\/api\/sig\/([^/]+)\/update\/executive$/);
  if (sigExecutiveUpdate) return `/api/executive/sig/${sigExecutiveUpdate[1]}/update${suffix}`;

  const sigExecutiveDelete = pathname.match(/^\/api\/sig\/([^/]+)\/delete\/executive$/);
  if (sigExecutiveDelete) return `/api/executive/sig/${sigExecutiveDelete[1]}/delete${suffix}`;

  return path;
}

/** Returns true when a frontend route must inject server-only credentials. */
function requiresFrontendProxy(path: string): boolean {
  const [pathname] = path.split(/[?#]/, 1);
  return (
    pathname === '/api/user/login' ||
    pathname === '/api/user/create' ||
    pathname === '/api/user/profile' ||
    pathname.startsWith('/api/test/')
  );
}

/**
 * Sends a client-side request to the backend.
 *
 * Uses `NEXT_PUBLIC_API_BASE_URL` as the backend base URL and always includes
 * `credentials: 'include'`.
 *
 * If `fallback` is true, it retries the same request against the frontend
 * API route when the backend request fails or returns 401.
 *
 * @param path - Relative API path such as `/api/...`
 * @param init - Optional fetch options
 * @param fallback - Whether to fallback to frontend API route on failure
 * @returns Fetch `Response`
 */
export async function fetchBackendClient(
  path: string,
  init: RequestInit = {},
  fallback: boolean = false,
): Promise<Response> {
  const method = (init.method || 'GET').toUpperCase();
  const headers = new Headers(init.headers);
  let body = init.body;

  if (!fallback && !PUBLIC_BACKEND_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured');
  }

  if (body != null && (method === 'GET' || method === 'HEAD')) {
    throw new Error(`fetchBackendClient: ${method} request cannot have a body`);
  }

  if (body != null && isPlainObject(body)) {
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  if (fallback && (!PUBLIC_BACKEND_URL || requiresFrontendProxy(path))) {
    return fetch(path, {
      ...init,
      method,
      headers,
      body,
      credentials: 'include',
    });
  }

  try {
    const url = PUBLIC_BACKEND_URL + resolveBackendPath(path);
    const res = await fetch(url, {
      ...init,
      method,
      headers,
      body,
      credentials: 'include',
    });
    if (!fallback) return res;
    if (res.ok || res.status !== 401) return res;
  } catch (err) {
    if (!fallback) throw new Error(`Network error while fetching ${path}: ${String(err)}`);
  }

  return fetch(path, {
    ...init,
    method,
    headers,
    body,
    credentials: 'include',
  });
}

/**
 * Wrapper of `fetchBackendClient` that ensures a successful response
 * and returns the parsed JSON body.
 *
 * Throws an error if the response is not OK (non-2xx status).
 *
 * @template T - Expected response JSON type
 * @param path - Relative API path such as `/api/...`
 * @param init - Optional fetch options
 * @param fallback - Whether to fallback to frontend API route on failure
 *
 * @returns Parsed JSON response of type `T`
 */
export async function fetchBackendClientJson<T>(
  path: string,
  init: RequestInit = {},
  fallback: boolean = false,
): Promise<T> {
  const res = await fetchBackendClient(path, init, fallback);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Backend Error: ${res.status} ${txt}`);
  }
  return (await res.json()) as T;
}
