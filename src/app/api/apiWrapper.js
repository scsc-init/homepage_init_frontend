import { fetchBackendServer } from '@/util/fetch/server';

/**
 * Handles API requests by forwarding them to the backend server.
 *
 * @param {string} method - HTTP method such as GET, POST, PUT, DELETE.
 * @param {string} pathTemplate - Backend API path template.
 * @param {object} options - Optional fetchBackendServer options.
 * @param {Request} request - Incoming Next.js request object.
 * @returns {Promise<Response>} - Backend response.
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
