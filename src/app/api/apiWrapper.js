import { headers } from "next/headers";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

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
export async function handleApiRequest(
  method,
  pathTemplate,
  options = {},
  request,
) {
  const headersList = headers();
  const jwt = headersList.get("x-jwt");

  // --- URL Construction (as before, using pathTemplate and params/query) ---
  let fullPath = pathTemplate;
  if (options.params) {
    for (const key in options.params) {
      fullPath = fullPath.replace(`{${key}}`, options.params[key]);
    }
  }
  if (options.query) {
    const searchParams = new URLSearchParams(options.query).toString();
    if (searchParams) {
      fullPath += `?${searchParams}`;
    }
  }
  const fullUrl = `${getBaseUrl()}${fullPath}`;

  const requestBody = request ? await request.json() : undefined;

  const res = await fetch(fullUrl, {
    method: method,
    headers: {
      "Content-Type": requestBody ? "application/json" : undefined,
      "x-api-secret": getApiSecret(),
      "x-jwt": jwt,
    },
    body: requestBody && JSON.stringify(requestBody),
    cache: "no-store",
  });
  return res;
}
