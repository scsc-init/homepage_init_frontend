// @/util/fetch/server.ts

import 'server-only';

import { getServerSession, type Session } from 'next-auth';
import { authOptions } from '@/util/authOptions';

import { ENABLE_TEST_UTILS } from '@/util/constants';
const BACKEND_URL: string = process.env.BACKEND_URL || '';
const API_SECRET: string = process.env.API_SECRET || '';

export interface Fetch2BackendOptions {
  params?: Record<string, string | number | boolean>;
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
  body?: unknown;
}

/** Builds a query string from key-value pairs, skipping null and undefined values. */
function buildQueryString(
  query?: Record<string, string | number | boolean | null | undefined>,
): string {
  if (!query) return '';
  const entries: string[][] = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => [k, String(v)]);
  const qs = new URLSearchParams(entries).toString();
  return qs ? `?${qs}` : '';
}

/** Determines whether the given path requires the `x-api-secret` header. */
function needApiSecret(path: string): boolean {
  return (
    path.startsWith('/api/user/login') ||
    path.startsWith('/api/user/create') ||
    (ENABLE_TEST_UTILS && path.startsWith('/api/test'))
  );
}

/**
 * Sends a server-side request to the backend API with path, query, and auth handling.
 *
 * Builds a full backend URL from a path template by replacing `{param}` placeholders
 * using `options.params`, and appends a query string from `options.query`
 * Automatically injects authentication headers:
 * `x-jwt` from the current session (`backendJwt`) if available
 * `x-api-secret` for specific internal routes (login, create, test)
 *
 * Additional headers from `options.headers` are merged, and
 * `Content-Type: application/json` is set when a body is present.
 * Uses `cache: 'no-store'` to ensure fresh backend responses.
 *
 * This function does NOT throw on non-2xx responses and returns the raw `Response`.
 * JSON parsing and error handling must be handled by the caller.
 *
 * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)
 * @param path - API path template (e.g., `/api/user/{id}`)
 *
 * @param options - Optional request configuration
 * @param options.params - Path parameters to replace in `pathTemplate`
 * @param options.query - Query parameters appended to the URL
 * @param options.headers - Additional headers to include in the request
 * @param options.body - Explicit request body (overrides `request` body if provided)
 *
 * @param request - Optional incoming Request to forward JSON body from
 * @returns T resolving to the backend `Response`
 */
export async function fetchBackendServer<T>(
  method: string,
  path: string,
  options: Fetch2BackendOptions = {},
  request?: Request,
): Promise<T> {
  const session: Session | null = await getServerSession(authOptions);
  const backendJwt = session?.backendJwt || null;
  const params = options.params;

  let resolvedPath = path;
  if (params) {
    for (const [key, value] of Object.entries(params))
      resolvedPath = resolvedPath.replaceAll(`{${key}}`, encodeURIComponent(String(value)));
  }
  resolvedPath += buildQueryString(options.query);

  const fullUrl = `${BACKEND_URL}${resolvedPath}`;

  let body: unknown = options.body;
  if (body === undefined && request) body = await request.json();

  const headers: Record<string, string> = { ...(options.headers || {}) };
  if (needApiSecret(resolvedPath)) headers['x-api-secret'] = API_SECRET;
  if (backendJwt) headers['x-jwt'] = backendJwt;
  if (body !== undefined && !headers['Content-Type'])
    headers['Content-Type'] = 'application/json';

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Backend Error: ${res.status} ${txt}`);
  }

  return (await res.json()) as T;
}
