import { fetchBackendServer } from '@/util/fetch/server';

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
  return fetchBackendServer(
    method,
    pathTemplate,
    {
      ...options,
      params: await options.params,
    },
    request,
  );
}
