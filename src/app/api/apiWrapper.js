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
  if (options.params) {
    for (const key in options.params) {
      fullPath = fullPath.replace(`{${key}}`, encodeURIComponent(options.params[key]));
    }
  }
  if (options.query) {
    const qs = new URLSearchParams(options.query).toString();
    if (qs) fullPath += `?${qs}`;
  }
  const fullUrl = `${getBaseUrl()}${fullPath}`;

  const hasIncoming = Boolean(request);
  const bodyJson = hasIncoming ? await request.json() : undefined;

  const hdrs = { 'x-api-secret': getApiSecret() };
  if (appJwt) hdrs['x-jwt'] = appJwt;
  if (bodyJson !== undefined) hdrs['Content-Type'] = 'application/json';

  return fetch(fullUrl, {
    method,
    headers: hdrs,
    body: bodyJson !== undefined ? JSON.stringify(bodyJson) : undefined,
    cache: 'no-store',
  });
}
