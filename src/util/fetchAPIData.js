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
          const [article, members] = await Promise.all([
            safeFetch('GET', `/api/article/${sig.content_id}`),
            safeFetch('GET', `/api/sig/${sig.id}/members`),
          ]);
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
          const [article, members] = await Promise.all([
            safeFetch('GET', `/api/article/${pig.content_id}`),
            safeFetch('GET', `/api/pig/${pig.id}/members`),
          ]);
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

export async function fetchExecutiveCandidates() {
  const [execRes, prezRes] = await Promise.all([
    handleApiRequest('GET', '/api/users', { query: { user_role: 'executive' } }),
    handleApiRequest('GET', '/api/users', { query: { user_role: 'president' } }),
  ]);

  const execList = execRes.ok ? await execRes.json().catch(() => []) : [];
  const prezList = prezRes.ok ? await prezRes.json().catch(() => []) : [];

  const merged = new Map();
  for (const entry of [
    ...(Array.isArray(execList) ? execList : []),
    ...(Array.isArray(prezList) ? prezList : []),
  ]) {
    if (!entry || typeof entry !== 'object') continue;
    const key = entry.id || entry.email || `${entry.name || ''}-${entry.phone || ''}`;
    if (!merged.has(key)) merged.set(key, entry);
  }

  return Array.from(merged.values()).sort((a, b) => {
    const nameA = (a?.name || '').toString();
    const nameB = (b?.name || '').toString();
    return nameA.localeCompare(nameB, 'ko');
  });
}

/**
 * Get a single KV value.
 * Returns trimmed string or '' (if not set / invalid).
 */
export async function getKVValue(key) {
  try {
    const j = await safeFetch('GET', `/api/kv/${encodeURIComponent(key)}`);
    const v = j?.value;
    return typeof v === 'string' && v.trim() ? v.trim() : '';
  } catch {
    return '';
  }
}

/**
 * Get multiple KV values in parallel.
 * @param {string[]} keys
 * @returns {Promise<Record<string, {status: 'fulfilled', value: string} | {status: 'rejected', reason: string}>>}
 */
export async function getKVValues(keys) {
  const list = Array.isArray(keys) ? keys : [];
  const results = await Promise.allSettled(
    list.map((k) => safeFetch('GET', `/api/kv/${encodeURIComponent(String(k))}`)),
  );

  const out = {};
  for (let i = 0; i < list.length; i++) {
    const key = String(list[i]);
    const r = results[i];
    if (r.status === 'fulfilled') {
      const raw = r.value?.value;
      out[key] = { status: 'fulfilled', value: typeof raw === 'string' ? raw : '' };
    } else {
      out[key] = { status: 'rejected', reason: String(r.reason ?? '') };
    }
  }
  return out;
}

/**
 * Set a single KV value (string or null).
 */
export async function setKVValue(key, value) {
  const body = { value: typeof value === 'string' ? value : null };
  const req = new Request('http://dummy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return safeFetch('POST', `/api/kv/${encodeURIComponent(key)}/update`, {}, req).catch(
    async (e) => {
      throw e;
    },
  );
}

/**
 * Set multiple KV values in parallel.
 * @param {Record<string,string|null|undefined>} entries
 * @returns {Promise<Record<string,boolean>>} - { key: true/false } success map
 */
export async function setKVValues(entries) {
  const pairs = Object.entries(entries || {});
  const results = await Promise.allSettled(
    pairs.map(async ([k, v]) => {
      await setKVValue(k, (v ?? '') === '' ? null : String(v));
      return [k, true];
    }),
  );
  const out = {};
  for (let i = 0; i < results.length; i++) {
    const [k] = pairs[i];
    out[k] = results[i].status === 'fulfilled';
  }
  return out;
}
