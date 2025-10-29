import { cookies } from 'next/headers';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';
/**
 * Handles forwarding requests to an internal API.
 * @param {string} method - The HTTP method (e.g., "POST").
 * @param {string} pathTemplate - A template string for the path (e.g., "/executive/user/{id}").
 * @param {object} [options] - Optional additional fetch options.
 * @param {object} [options.params] - The Next.js `params` object from the route handler.
 * @param {object} [options.query] - Object for URL query parameters (e.g., { page: 1 }).
 * @param {Request} request - If included, fetch with body from it. The incoming Next.js Request object.
 * @returns {Promise<Response>} - A Next.js Response object.
 */
export async function handleApiRequest(method, pathTemplate, options = {}, request) {
  const cookieStore = cookies();
  const appJwt = cookieStore.get('app_jwt')?.value || null;

  let fullPath = pathTemplate;
  const { params, query, body, headers: extraHeaders } = options;
  if (params) {
    for (const key of Object.keys(params)) {
      const encoded = encodeURIComponent(String(params[key]));
      fullPath = fullPath.replaceAll(`{${key}}`, encoded);
    }
  }
  if (query) {
    const qs = new URLSearchParams(query).toString();
    if (qs) fullPath += `?${qs}`;
  }
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error('Missing BACKEND_URL environment variable');
  }
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const fullUrl = new URL(fullPath, normalizedBase).toString();

  const hasIncoming = Boolean(request);
  if (hasIncoming && body !== undefined) {
    throw new Error('handleApiRequest: provide either request or options.body, not both');
  }

  let bodyJson;
  if (hasIncoming) {
    bodyJson = await request.json();
  } else if (body !== undefined) {
    bodyJson = body;
  }

  const hdrs = {
    'x-api-secret': getApiSecret(),
    ...(extraHeaders || {}),
  };
  if (appJwt) hdrs['x-jwt'] = appJwt;

  let fetchBody;
  const isBlobSupported = typeof Blob !== 'undefined';
  if (bodyJson === undefined) {
    fetchBody = undefined;
  } else if (
    bodyJson instanceof FormData ||
    bodyJson instanceof URLSearchParams ||
    typeof bodyJson === 'string' ||
    (isBlobSupported && bodyJson instanceof Blob)
  ) {
    fetchBody = bodyJson;
  } else {
    if (!hdrs['Content-Type']) {
      hdrs['Content-Type'] = 'application/json';
    }
    fetchBody = JSON.stringify(bodyJson);
  }

  return fetch(fullUrl, {
    method,
    headers: hdrs,
    body: fetchBody,
    cache: 'no-store',
  });
}
