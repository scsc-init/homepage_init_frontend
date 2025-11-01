import { handleApiRequest } from '@/app/api/apiWrapper';

/**
 * Fetches from API and handles errors.
 *
 * @param {string} method - The HTTP method (e.g., "POST").
 * @param {string} path - A template string for the path (e.g., "/executive/user/{id}").
 * @param {object} [options] - Optional additional fetch options.
 * @param {object} [options.params] - The Next.js `params` object from the route handler.
 * @param {object} [options.query] - Object for URL query parameters (e.g., { page: 1 }).
 * @param {Request} request - If included, fetch with body from it. The incoming Next.js Request object.
 * @returns {Promise<any>} - Promise that resolves with response body or rejects on non-OK response.
 */
async function safeFetch(method, path, options = {}, request) {
  const res = await handleApiRequest(method, path, options, request);
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`${res.status} ${errText}`);
  }
  return res.json();
}

/**
 * Fetches current user data.
 */
export async function fetchMe() {
  return safeFetch('GET', `/api/user/profile`);
}

/**
 * Fetches all users.
 */
export async function fetchUsers() {
  return safeFetch('GET', `/api/users`);
}

/**
 * Fetches board data.
 *
 * @param {number[]} boardIds - Ids of the target boards to fetch.
 * @returns {Promise<PromiseSettledResult<any>[]>} - Promise that always resolves to object that contains information for each boards.
 */
export async function fetchBoards(boardIds) {
  return Promise.allSettled(boardIds.map((id) => safeFetch('GET', `/api/board/${id}`)));
}

/**
 * Fetches all sigs, along with their respective article content and sig members.
 *
 * @returns {Promise<PromiseSettledResult<any>[]>} - Promise that resolves to object that contains information for each sigs.
 */
export async function fetchSigs() {
  try {
    const sigsRaw = await safeFetch('GET', '/api/sigs');
    const sigsWithContentMembers = await Promise.allSettled(
      sigsRaw.map(async (sig) => {
        try {
          const [articleRes, membersRes] = await Promise.all([
            handleApiRequest('GET', `/api/article/${sig.content_id}`),
            handleApiRequest('GET', `/api/sig/${sig.id}/members`),
          ]);
          const article = articleRes.ok
            ? await articleRes.json()
            : { content: '시그 설명을 불러오는데 실패했습니다.' };
          const members = membersRes.ok ? await membersRes.json() : [];
          return { ...sig, content: article.content, members: members };
        } catch (err) {
          throw new Error(`sig fetch failed: ${err}`);
        }
      }),
    );
    return sigsWithContentMembers;
  } catch (err) {
    throw err;
  }
}

/**
 * Fetches all pigs, along with their respective article content and pig members.
 *
 * @returns {Promise<PromiseSettledResult<any>[]>} - Promise that resolves to object that contains information for each pigs.
 */
export async function fetchPigs() {
  try {
    const pigsRaw = await safeFetch('GET', '/api/pigs');
    const pigsWithContentMembers = await Promise.allSettled(
      pigsRaw.map(async (pig) => {
        try {
          const [articleRes, membersRes] = await Promise.all([
            handleApiRequest('GET', `/api/article/${pig.content_id}`),
            handleApiRequest('GET', `/api/pig/${pig.id}/members`),
          ]);
          const article = articleRes.ok
            ? await articleRes.json()
            : { content: '피그 설명을 불러오는데 실패했습니다.' };
          const members = membersRes.ok ? await membersRes.json() : [];
          return { ...pig, content: article.content, members: members };
        } catch (err) {
          throw new Error(`pig fetch failed: ${err}`);
        }
      }),
    );
    return pigsWithContentMembers;
  } catch (err) {
    throw err;
  }
}

/**
 * Fetches all majors.
 */
export async function fetchMajors() {
  return safeFetch('GET', '/api/majors');
}

/**
 * Fetches Discord bot status - logged in or not.
 *
 * @returns {Promise<boolean>} - Whether Discord bot is logged in or not.
 */
export async function fetchDiscordBotStatus() {
  try {
    const body = await safeFetch('GET', '/api/bot/discord/status');
    return body.logged_in;
  } catch (err) {
    throw err;
  }
}

/**
 * Fetches current SCSC global status.
 *
 * @returns {Promise<string>} - Current SCSC global status.
 */
export async function fetchSCSCGlobalStatus() {
  return safeFetch('GET', '/api/scsc/global/status');
}
